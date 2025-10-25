import { generateText } from "ai"
import { geminiKeyManager, executeWithRetry } from "@/lib/gemini-key-manager"
import { sanitizeText, containsDangerousPatterns } from "@/lib/utils/sanitization"

// Type definitions
interface TextField {
  path: string
  label: string
  value: string
}

interface SectionSchema {
  fields?: Array<{ name: string; type: string; label: string }>
  repeatableGroups?: Array<{
    name: string
    label: string
    fields: Array<{ name: string; type: string; label: string }>
  }>
}

interface SectionContent {
  fieldValues: Record<string, string>
  groupEntries: Record<string, Array<{ values: Record<string, string> }>>
}

interface AISuggestion {
  label: string
  corrected?: string
  improved?: string
  modified?: string
  hasChanges?: boolean
}

interface SectionChange {
  fieldPath: string
  fieldLabel: string
  original: string
  suggested: string
  hasChanges: boolean
}

// Check if AI is enabled
const isAIEnabled = geminiKeyManager.isAIEnabled()

export async function POST(req: Request) {
  try {
    // Check if AI is enabled
    if (!isAIEnabled) {
      return Response.json(
        {
          error: "AI features are currently unavailable",
          message: "The AI assistant is not configured. Please add a Google Generative AI API key to enable this feature.",
          fallback: "For better section content, consider adding specific achievements, quantifying results with numbers, and using action verbs to describe your experience. Review each section for clarity, consistency, and impact on your overall resume narrative.",
          keyStatus: geminiKeyManager.getKeyStatus()
        },
        { status: 503 },
      )
    }

    const { sectionContent, sectionTitle, operation, customPrompt, schema } = await req.json()

    // Validate inputs
    if (!sectionContent || !schema) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Extract all text fields from the section
    const textFields: TextField[] = []

    // Process direct field values
    if (schema.fields && Array.isArray(schema.fields)) {
      for (const field of schema.fields) {
        if (!field || typeof field !== "object") continue
        const fieldName = String(field.name || "")
        const value = sectionContent.fieldValues?.[fieldName]
        if (
          value &&
          typeof value === "string" &&
          (field.type === "text" || field.type === "textarea" || field.type === "email")
        ) {
          // Validate value doesn't contain dangerous patterns
          if (containsDangerousPatterns(value)) {
            console.warn(`Skipping field with dangerous patterns: ${fieldName}`)
            continue
          }
          textFields.push({
            path: `fieldValues.${fieldName}`,
            label: String(field.label || fieldName),
            value: sanitizeText(value),
          })
        }
      }
    }

    // Process repeatable group entries
    if (schema.repeatableGroups && Array.isArray(schema.repeatableGroups)) {
      for (const group of schema.repeatableGroups) {
        if (!group || typeof group !== "object") continue
        const groupName = String(group.name || "")
        const entries = sectionContent.groupEntries?.[groupName]
        if (!Array.isArray(entries)) continue

        for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
          const entry = entries[entryIndex]
          if (!entry || typeof entry !== "object" || !entry.values) continue

          if (Array.isArray(group.fields)) {
            for (const field of group.fields) {
              if (!field || typeof field !== "object") continue
              const fieldName = String(field.name || "")
              const value = entry.values[fieldName]
              if (
                value &&
                typeof value === "string" &&
                (field.type === "text" || field.type === "textarea" || field.type === "email")
              ) {
                // Validate value
                if (containsDangerousPatterns(value)) {
                  console.warn(`Skipping field with dangerous patterns: ${fieldName}`)
                  continue
                }
                textFields.push({
                  path: `groupEntries.${groupName}.${entryIndex}.values.${fieldName}`,
                  label: `${String(group.label || groupName)} #${entryIndex + 1} - ${String(field.label || fieldName)}`,
                  value: sanitizeText(value),
                })
              }
            }
          }
        }
      }
    }

    if (textFields.length === 0) {
      return Response.json({ error: "No text fields found to process" }, { status: 400 })
    }

    let prompt = ""
    const sanitizedTitle = sanitizeText(sectionTitle)

    switch (operation) {
      case "spellcheck":
        prompt = `You are a professional resume editor. Review the following fields from the "${sanitizedTitle}" section for spelling, grammar, and punctuation errors.

${textFields.map((f) => `${f.label}:\n"${f.value}"\n`).join("\n")}

For each field, provide the corrected version. If there are no errors in a field, return it exactly as is. Only fix actual errors - do not rewrite or improve the content.

Return your response as a JSON array with this structure:
[
  {
    "label": "Field Label",
    "original": "original text",
    "corrected": "corrected text",
    "hasChanges": true/false
  }
]

Only include fields that have changes. If no changes are needed, return an empty array.`
        break

      case "improve":
        prompt = `You are a professional resume editor. Review and improve the following fields from the "${sanitizedTitle}" section to make them more impactful and professional.

${textFields.map((f) => `${f.label}:\n"${f.value}"\n`).join("\n")}

For each field, provide an improved version that:
- Uses strong action verbs
- Quantifies achievements where possible
- Is concise and impactful
- Maintains professional tone
- Optimizes for ATS (Applicant Tracking Systems)

Return your response as a JSON array with this structure:
[
  {
    "label": "Field Label",
    "original": "original text",
    "improved": "improved text",
    "hasChanges": true/false
  }
]

Only include fields where improvements are suggested.`
        break

      case "custom":
        if (!customPrompt || typeof customPrompt !== "string") {
          return Response.json({ error: "Valid custom prompt is required" }, { status: 400 })
        }
        const sanitizedPrompt = sanitizeText(customPrompt)
        prompt = `You are a professional resume editor. The user has the following fields from the "${sanitizedTitle}" section:

${textFields.map((f) => `${f.label}:\n"${f.value}"\n`).join("\n")}

User's request: ${sanitizedPrompt}

Provide improved versions based on their request. Return your response as a JSON array with this structure:
[
  {
    "label": "Field Label",
    "original": "original text",
    "modified": "modified text",
    "hasChanges": true/false
  }
]

Only include fields that should be changed based on the user's request.`
        break

      default:
        return Response.json({ error: "Invalid operation" }, { status: 400 })
    }

    const { text: result } = await executeWithRetry(async (client) => {
      return generateText({
        model: client("gemini-2.5-flash"),
        prompt,
        maxOutputTokens: 2000,
      })
    })

    console.log("[v0] AI response received:", result.substring(0, 200))

    // Parse the AI response and map back to field paths
    try {
      let jsonStr = result.trim()
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "")
      }

      const aiSuggestions: unknown = JSON.parse(jsonStr)
      if (!Array.isArray(aiSuggestions)) {
        return Response.json({ error: "Invalid AI response format" }, { status: 500 })
      }

      const changes: SectionChange[] = aiSuggestions
        .filter((item): item is AISuggestion => {
          return typeof item === "object" && item !== null && "label" in item
        })
        .map((suggestion) => {
          const field = textFields.find((f) => f.label === suggestion.label)
          if (!field) return null

          const suggestedValue = sanitizeText(
            suggestion.corrected || suggestion.improved || suggestion.modified || ""
          )

          return {
            fieldPath: field.path,
            fieldLabel: field.label,
            original: field.value,
            suggested: suggestedValue,
            hasChanges: suggestion.hasChanges !== false && field.value !== suggestedValue,
          }
        })
        .filter((c): c is SectionChange => c !== null && c.hasChanges)

      return Response.json({ changes, operation })
    } catch (error) {
      console.error("[v0] Failed to parse AI response:", error)
      console.error("[v0] Raw response:", result)
      return Response.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 })
    }
  } catch (error: unknown) {
    console.error("[v0] AI section assist error:", error)

    const keyStatus = geminiKeyManager.getKeyStatus()
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : ""

    // Check if all keys are rate limited
    if (errorMessage.includes("all gemini api keys are currently rate limited") || keyStatus.availableKeys === 0) {
      const earliestReset = keyStatus.keyStatuses
        .filter((ks) => ks.rateLimitResetTime)
        .map((ks) => new Date(ks.rateLimitResetTime!).getTime())
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

    const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred"
    return Response.json({
      error: errorMsg,
      keyStatus: keyStatus
    }, { status: 500 })
  }
}
