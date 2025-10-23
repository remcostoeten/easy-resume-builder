import { generateText } from "ai"
import { geminiKeyManager, executeWithRetry } from "@/lib/gemini-key-manager"

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

    // Extract all text fields from the section
    const textFields: Array<{ path: string; label: string; value: string }> = []

    // Process direct field values
    if (schema.fields) {
      schema.fields.forEach((field: any) => {
        const value = sectionContent.fieldValues[field.name]
        if (
          value &&
          typeof value === "string" &&
          (field.type === "text" || field.type === "textarea" || field.type === "email")
        ) {
          textFields.push({
            path: `fieldValues.${field.name}`,
            label: field.label,
            value: value,
          })
        }
      })
    }

    // Process repeatable group entries
    if (schema.repeatableGroups) {
      schema.repeatableGroups.forEach((group: any) => {
        const entries = sectionContent.groupEntries[group.name] || []
        entries.forEach((entry: any, entryIndex: number) => {
          group.fields.forEach((field: any) => {
            const value = entry.values[field.name]
            if (
              value &&
              typeof value === "string" &&
              (field.type === "text" || field.type === "textarea" || field.type === "email")
            ) {
              textFields.push({
                path: `groupEntries.${group.name}.${entryIndex}.values.${field.name}`,
                label: `${group.label} #${entryIndex + 1} - ${field.label}`,
                value: value,
              })
            }
          })
        })
      })
    }

    if (textFields.length === 0) {
      return Response.json({ error: "No text fields found to process" }, { status: 400 })
    }

    let prompt = ""

    switch (operation) {
      case "spellcheck":
        prompt = `You are a professional resume editor. Review the following fields from the "${sectionTitle}" section for spelling, grammar, and punctuation errors.

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
        prompt = `You are a professional resume editor. Review and improve the following fields from the "${sectionTitle}" section to make them more impactful and professional.

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
        prompt = `You are a professional resume editor. The user has the following fields from the "${sectionTitle}" section:

${textFields.map((f) => `${f.label}:\n"${f.value}"\n`).join("\n")}

User's request: ${customPrompt}

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

    const { text: result } = await executeWithRetry(async (client, keyIndex) => {
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

      const aiSuggestions = JSON.parse(jsonStr)
      const changes = aiSuggestions
        .map((suggestion: any) => {
          const field = textFields.find((f) => f.label === suggestion.label)
          if (!field) return null

          const suggestedValue = suggestion.corrected || suggestion.improved || suggestion.modified

          return {
            fieldPath: field.path,
            fieldLabel: field.label,
            original: field.value,
            suggested: suggestedValue,
            hasChanges: suggestion.hasChanges !== false && field.value !== suggestedValue,
          }
        })
        .filter((c: any) => c !== null && c.hasChanges)

      return Response.json({ changes, operation })
    } catch (error) {
      console.error("[v0] Failed to parse AI response:", error)
      console.error("[v0] Raw response:", result)
      return Response.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 })
    }
  } catch (error: any) {
    console.error("[v0] AI section assist error:", error)

    const keyStatus = geminiKeyManager.getKeyStatus()
    const errorMessage = error?.message?.toLowerCase() || ''

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

    return Response.json({
      error: error.message || "An unexpected error occurred",
      keyStatus: keyStatus
    }, { status: 500 })
  }
}
