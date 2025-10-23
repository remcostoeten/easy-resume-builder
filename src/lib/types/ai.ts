export type SectionAIOperation = "spellcheck" | "improve" | "custom"

export type SectionAIResult = {
  operation: SectionAIOperation
  originalContent: SectionSnapshot
  suggestedContent: SectionSnapshot
  changes: FieldChange[]
  timestamp: string
}

export type FieldChange = {
  fieldPath: string // e.g., "fieldValues.summary" or "groupEntries.experience.0.values.description"
  fieldLabel: string
  original: string
  suggested: string
  accepted: boolean
}

export type SectionSnapshot = {
  fieldValues: Record<string, any>
  groupEntries: Record<string, any[]>
}
