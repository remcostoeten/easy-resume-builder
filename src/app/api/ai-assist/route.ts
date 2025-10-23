import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

// Check if API key is configured
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY
const isAIEnabled = !!API_KEY && API_KEY !== 'your-api-key-here'

// Only initialize AI if API key is available
const google = isAIEnabled ? createGoogleGenerativeAI({
  apiKey: API_KEY,
}) : null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text, fieldLabel, operation, customPrompt } = body

    if (!text || !fieldLabel || !operation) {
      return Response.json(
        { error: "Missing required fields: text, fieldLabel, and operation are required" },
        { status: 400 },
      )
    }

    // Check if AI is enabled
    if (!isAIEnabled || !google) {
      return Response.json(
        {
          error: "AI features are currently unavailable",
          message: "The AI assistant is not configured. Please add a Google Generative AI API key to enable this feature.",
          fallback: getFallbackResponse(operation, text, fieldLabel)
        },
        { status: 503 },
      )
    }

    let prompt = ""

    switch (operation) {
      case "tips":
        prompt = `You are a professional resume editor. Review the following text from the "${fieldLabel}" field of a resume.

Text to review:
"${text}"

Provide 3-5 specific, actionable tips for improvement. Focus on:
- Impact and quantifiable achievements
- Action verbs and professional language
- Relevance and clarity
- ATS optimization

Format as a bulleted list. Be concise and specific.`
        break

      case "spellcheck":
        prompt = `You are a professional resume editor. Review the following text from the "${fieldLabel}" field for spelling, grammar, and punctuation errors.

Original text:
"${text}"

Provide the corrected version. If there are no errors, return the original text exactly as is. Only fix actual errors - do not rewrite or improve the content.`
        break

      case "rewrite":
        prompt = `You are a professional resume editor. Rewrite the following text from the "${fieldLabel}" field to be more impactful and professional.

Original text:
"${text}"

Rewrite it to:
- Use strong action verbs
- Quantify achievements where possible
- Be concise and impactful
- Maintain professional tone
- Optimize for ATS (Applicant Tracking Systems)

Provide only the rewritten text, no explanations.`
        break

      case "custom":
        if (!customPrompt) {
          return Response.json({ error: "Custom prompt is required for custom operation" }, { status: 400 })
        }
        prompt = `You are a professional resume editor. The user has the following text from the "${fieldLabel}" field:

"${text}"

User's request: ${customPrompt}

Provide the improved text based on their request. Only return the modified text, no explanations.`
        break

      default:
        return Response.json({ error: "Invalid operation" }, { status: 400 })
    }

    const { text: result } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      maxOutputTokens: 1000,
    })

    return Response.json({ result, operation })
  } catch (error) {
    console.error("Error in AI assist:", error)

    if (error instanceof Error) {
      // Handle specific AI errors
      if (error.message.includes("rate limit")) {
        return Response.json({
          error: "Rate limit exceeded",
          message: "Too many AI requests. Please wait before trying again.",
          retryAfter: 60
        }, { status: 429 })
      }

      if (error.message.includes("quota")) {
        return Response.json({
          error: "AI quota exceeded",
          message: "The AI service has reached its usage limit.",
          suggestion: "Please try again later or contact support."
        }, { status: 503 })
      }

      if (error.message.includes("network") || error.message.includes("fetch")) {
        return Response.json({
          error: "Network error",
          message: "Unable to connect to AI service. Please check your connection.",
          suggestion: "Try again in a moment."
        }, { status: 503 })
      }

      return Response.json({
        error: "AI assistance failed",
        message: "The AI service encountered an error.",
        suggestion: "Please try again or contact support if this continues.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 })
    }

    return Response.json({
      error: "Unexpected error",
      message: "An unexpected error occurred during AI assistance.",
      suggestion: "Please try again or contact support."
    }, { status: 500 })
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(operation: string, text: string, fieldLabel: string): string {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return "Please add some text to get AI assistance."
  }

  switch (operation) {
    case "tips":
      return `Here are some general tips for improving your ${fieldLabel.toLowerCase()}:\n\n• Use action verbs to start bullet points\n• Quantify achievements with numbers and metrics\n• Focus on impact and results rather than just duties\n• Keep descriptions concise and specific\n• Tailor content to the specific job you're applying for\n\nNote: These are general suggestions. For personalized advice, please enable AI features in your settings.`

    case "spellcheck":
      return `Basic spelling and grammar check completed. For comprehensive proofreading:\n\n• Read your text aloud to catch errors\n• Check for commonly confused words (affect/effect, their/there)\n• Ensure consistent verb tenses\n• Verify proper punctuation usage\n• Consider using a dedicated grammar checker tool\n\nNote: Advanced AI-powered proofreading is currently unavailable.`

    case "rewrite":
      return `For rewriting suggestions, consider:\n\n• Starting bullet points with strong action verbs\n• Including specific metrics and outcomes\n• Removing jargon and simplifying complex language\n• Ensuring each point demonstrates value or impact\n• Keeping descriptions to 1-2 lines maximum\n\nExample format: "Led [project/initiative] resulting in [specific metric or outcome]"\n\nNote: AI-powered rewriting suggestions require AI features to be enabled.`

    default:
      return "AI features are currently unavailable. Please check your configuration or contact support for assistance."
  }
}
