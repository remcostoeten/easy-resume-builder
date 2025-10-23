import { generateObject } from "ai"
import { z } from "zod"
import { geminiKeyManager, executeWithRetry } from "@/lib/gemini-key-manager"

// Check if AI is enabled
const isAIEnabled = geminiKeyManager.isAIEnabled()

const resumeDataSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  summary: z.string().optional(),
  workExperience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().optional(),
        achievements: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        location: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        gpa: z.string().optional(),
        courses: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .optional(),
})

export async function POST(req: Request) {
  try {
    // Check if AI is enabled
    if (!isAIEnabled) {
      return Response.json(
        {
          error: "PDF parsing is currently unavailable",
          message: "The AI-powered PDF parser is not configured. Please add a valid Google Generative AI API key to enable this feature.",
          suggestion: "Contact the administrator to set up the GOOGLE_GENERATIVE_AI_API_KEY environment variable.",
          keyStatus: geminiKeyManager.getKeyStatus()
        },
        { status: 503 },
      )
    }

    let body
    try {
      body = await req.json()
    } catch (parseError) {
      return Response.json({
        error: "Invalid request format",
        message: "Request body must be valid JSON.",
        details: process.env.NODE_ENV === 'development' ? (parseError instanceof Error ? parseError.message : String(parseError)) : undefined
      }, { status: 400 })
    }

    const { file } = body

    // Comprehensive file validation
    if (!file) {
      return Response.json({
        error: "No file provided",
        message: "Please upload a PDF file."
      }, { status: 400 })
    }

    if (!file.data || typeof file.data !== 'string') {
      return Response.json({
        error: "Invalid file data",
        message: "File data must be a valid base64 string."
      }, { status: 400 })
    }

    if (!file.data.trim()) {
      return Response.json({
        error: "Empty file data",
        message: "The uploaded file contains no data."
      }, { status: 400 })
    }

    // Validate media type
    const mediaType = file.mediaType || file.mimeType || "application/pdf"
    if (mediaType !== "application/pdf") {
      return Response.json({
        error: "Unsupported file type",
        message: `Received ${mediaType}. Only PDF files are supported.`,
        supportedTypes: ["application/pdf"]
      }, { status: 400 })
    }

    // Check file size (base64 is ~4/3 the size of binary)
    const estimatedSize = (file.data.length * 3) / 4
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (estimatedSize > maxSize) {
      return Response.json({
        error: "File too large",
        message: `File size is approximately ${Math.round(estimatedSize / 1024 / 1024)}MB. Maximum allowed size is 10MB.`,
        maxSize: "10MB"
      }, { status: 400 })
    }

    let object
    try {
      const result = await executeWithRetry(async (client, keyIndex) => {
        return generateObject({
          model: client("gemini-2.5-flash"),
          schema: resumeDataSchema,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all resume information from this PDF. Parse dates carefully and extract all relevant details including work experience, education, skills, projects, and certifications. If a section is not present, omit it rather than creating empty data.",
                },
                {
                  type: "file",
                  data: file.data,
                  mediaType: file.mediaType || file.mimeType || "application/pdf",
                },
              ],
            },
          ],
        })
      })
      object = result.object
    } catch (aiError) {
      console.error("AI parsing error:", aiError)

      // Handle specific AI errors
      if (aiError instanceof Error) {
        const errorMessage = aiError.message.toLowerCase()
        const keyStatus = geminiKeyManager.getKeyStatus()

        // Check if all keys are rate limited
        if (errorMessage.includes("all gemini api keys are currently rate limited") || keyStatus.availableKeys === 0) {
          const earliestReset = keyStatus.keyStatuses
            .filter(ks => ks.rateLimitResetTime)
            .map(ks => new Date(ks.rateLimitResetTime!).getTime())
            .sort((a, b) => a - b)[0]

          const retryAfter = earliestReset ? Math.ceil((earliestReset - Date.now()) / 1000) : 60

          return Response.json({
            error: "All API keys rate limited",
            message: "All Gemini API keys have reached their rate limits. Please wait before trying again.",
            retryAfter: Math.max(retryAfter, 1),
            keyStatus: keyStatus,
            suggestion: `Try again in ${retryAfter} seconds when rate limits reset.`
          }, { status: 429 })
        }

        if (errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
          return Response.json({
            error: "Rate limit exceeded",
            message: "Too many requests. Please wait a moment before trying again.",
            retryAfter: 60,
            keyStatus: keyStatus
          }, { status: 429 })
        }

        // Network errors
        if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
          return Response.json({
            error: "Network error",
            message: "Unable to connect to the AI service. Please check your internet connection.",
            suggestion: "Try again in a moment or contact support if the issue persists.",
            keyStatus: keyStatus
          }, { status: 503 })
        }

        // Timeout errors
        if (errorMessage.includes("timeout") || errorMessage.includes("aborted")) {
          return Response.json({
            error: "Request timeout",
            message: "The PDF processing took too long. Please try with a smaller file or try again.",
            suggestion: "Consider compressing your PDF or splitting it into smaller sections.",
            keyStatus: keyStatus
          }, { status: 408 })
        }
      }

      return Response.json({
        error: "AI parsing failed",
        message: "Unable to process the PDF with AI. The file may be corrupted or contain unsupported content.",
        suggestion: "Try uploading a different PDF or ensure the file contains readable text.",
        details: process.env.NODE_ENV === 'development' ? (aiError instanceof Error ? aiError.message : String(aiError)) : undefined,
        keyStatus: geminiKeyManager.getKeyStatus()
      }, { status: 422 })
    }

    // Validate that we got at least some data and proper structure
    if (!object || typeof object !== 'object') {
      return Response.json({
        error: "No data extracted",
        message: "Could not extract any resume information from the PDF. Please ensure the PDF contains readable text and is not password-protected.",
        suggestion: "Try opening the PDF in a viewer to confirm it contains text, not just images."
      }, { status: 422 })
    }

    if (!object.personalInfo?.name || !object.personalInfo.name.trim()) {
      return Response.json({
        error: "No personal information found",
        message: "Could not find a name in the resume. Please ensure the PDF contains personal information.",
        suggestion: "Check that the PDF includes contact information and is not image-only."
      }, { status: 422 })
    }

    // Ensure all expected fields are present and have correct structure
    const resumeData = {
      personalInfo: object.personalInfo,
      summary: object.summary || null,
      workExperience: Array.isArray(object.workExperience) ? object.workExperience.filter(exp =>
        exp && (exp.title || exp.company || exp.description)
      ) : [],
      education: Array.isArray(object.education) ? object.education.filter(edu =>
        edu && (edu.degree || edu.institution)
      ) : [],
      skills: Array.isArray(object.skills) ? object.skills.filter(skill =>
        skill && typeof skill === 'string' && skill.trim()
      ) : [],
      projects: Array.isArray(object.projects) ? object.projects.filter(project =>
        project && (project.name || project.description)
      ) : [],
      certifications: Array.isArray(object.certifications) ? object.certifications.filter(cert =>
        cert && (cert.name || cert.issuer)
      ) : [],
    }

    return Response.json({ resumeData })
  } catch (error) {
    console.error("Error parsing resume:", error)

    // Handle different types of errors
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return Response.json({
          error: "Network error",
          message: "Unable to connect to the AI service. Please check your internet connection.",
          suggestion: "Try again in a moment or contact support if the issue persists."
        }, { status: 503 })
      }

      // Timeout errors
      if (error.message.includes("timeout") || error.message.includes("aborted")) {
        return Response.json({
          error: "Request timeout",
          message: "The PDF processing took too long. Please try with a smaller file or try again.",
          suggestion: "Consider compressing your PDF or splitting it into smaller sections."
        }, { status: 408 })
      }

      // Generic error with details in development
      return Response.json({
        error: "Parsing failed",
        message: "An error occurred while processing your resume.",
        suggestion: "Please try again or contact support if this continues.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        keyStatus: geminiKeyManager.getKeyStatus()
      }, { status: 500 })
    }

    return Response.json({
      error: "Unexpected error",
      message: "An unexpected error occurred while processing your resume.",
      suggestion: "Please try again or contact support.",
      keyStatus: geminiKeyManager.getKeyStatus()
    }, { status: 500 })
  }
}
