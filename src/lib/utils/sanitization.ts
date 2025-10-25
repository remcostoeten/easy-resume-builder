/**
 * Sanitization utilities for AI responses and user-generated content
 */

/**
 * Sanitize text by removing/escaping potentially harmful content
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return ""
  
  return text
    // Remove any HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove iframe tags
    .replace(/<iframe[^>]*>[^<]*<\/iframe>/gi, "")
    // Decode HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    // Remove null bytes
    .replace(/\0/g, "")
    // Trim whitespace
    .trim()
}

/**
 * Sanitize HTML content for safe display
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ""
  
  // Create a temporary element to leverage browser's HTML parser
  const temp = document.createElement("div")
  temp.textContent = html
  return temp.innerHTML
}

/**
 * Validate and sanitize AI field suggestions
 */
export interface SanitizedSuggestion {
  fieldLabel: string
  original: string
  suggested: string
  hasChanges: boolean
}

export function sanitizeAISuggestions(
  suggestions: unknown
): SanitizedSuggestion[] {
  if (!Array.isArray(suggestions)) return []
  
  return suggestions
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((suggestion) => ({
      fieldLabel: sanitizeText(String(suggestion.fieldLabel || "")),
      original: sanitizeText(String(suggestion.original || "")),
      suggested: sanitizeText(String(suggestion.suggested || "")),
      hasChanges: Boolean(suggestion.hasChanges),
    }))
}

/**
 * Escape special regex characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Validate that a string doesn't contain dangerous patterns
 */
export function containsDangerousPatterns(str: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /javascript:/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    /eval\(/i,
    /expression\(/i,
  ]
  
  return dangerousPatterns.some((pattern) => pattern.test(str))
}
