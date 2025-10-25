/**
 * Simple markdown-like parser for resume content
 * Supports: **bold**, *italic*, • bullet lists, 1. numbered lists, line breaks
 */

/**
 * Convert markdown-like text to HTML for display
 */
export function markdownToHtml(text: string): string {
  if (!text) return ''

  // Convert bold: **text** -> <strong>text</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Convert italic: *text* -> <em>text</em> (but not if it's already part of bold)
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')

  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>')

  return html
}

/**
 * Convert markdown-like text to formatted plain text for PDF
 */
export function markdownToPlainText(text: string): string {
  if (!text) return ''

  // For PDF, we can keep the markdown syntax as simple formatting indicators
  // or remove it entirely for plain text

  // Convert bold: **text** -> TEXT (uppercase for emphasis)
  let plainText = text.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    return content.toUpperCase()
  })

  // Convert italic: *text* -> "text" (quotes for emphasis)
  plainText = plainText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '"$1"')

  // Convert bullet points: • item -> • item (keep as is)
  // Convert numbered lists: 1. item -> 1. item (keep as is)

  return plainText
}

/**
 * Parse text with markdown syntax and return both HTML and plain text versions
 */
export function parseMarkdown(text: string): {
  html: string
  plainText: string
} {
  return {
    html: markdownToHtml(text),
    plainText: markdownToPlainText(text)
  }
}

/**
 * Extract text content from markdown (strips all formatting)
 */
export function stripMarkdown(text: string): string {
  if (!text) return ''

  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1') // Remove italic
    .replace(/^[\s]*•[\s]+/gm, '• ') // Normalize bullet points
    .replace(/^[\s]*\d+\.[\s]+/gm, '') // Remove numbered list prefixes
    .trim()
}

/**
 * Check if text contains markdown formatting
 */
export function hasMarkdown(text: string): boolean {
  if (!text) return false

  return /\*\*.*?\*\*/.test(text) || // Bold
    /(?<!\*)\*[^*]+\*(?!\*)/.test(text) || // Italic
    /^[\s]*•[\s]+/m.test(text) || // Bullet lists
    /^[\s]*\d+\.[\s]+/m.test(text) // Numbered lists
}

/**
 * Get word count from markdown text (ignores formatting)
 */
export function getWordCount(text: string): number {
  const plainText = stripMarkdown(text)
  return plainText.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Get character count from markdown text (includes spaces, excludes formatting)
 */
export function getCharacterCount(text: string): number {
  const plainText = stripMarkdown(text)
  return plainText.length
}