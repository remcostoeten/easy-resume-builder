import type { SummaryContent } from "@/lib/types/resume"

/**
 * Parse rich text content and return both HTML and plain text versions
 */
export function parseRichText(content: SummaryContent): {
  html: string
  text: string
} {
  // If rich text is available, use it; otherwise convert plain text
  if (content.richText && content.richText.trim()) {
    return {
      html: content.richText,
      text: content.text
    }
  }

  // Convert plain text to basic HTML (handle line breaks)
  const html = content.text
    .split('\n')
    .map(line => line.trim() || '<br>')
    .join('<br>')

  return {
    html,
    text: content.text
  }
}

/**
 * Render rich text content as HTML with proper formatting
 */
export function renderRichText(content: SummaryContent): string {
  const { html } = parseRichText(content)

  // Clean up the HTML and ensure proper formatting
  return html
    .replace(/\n/g, '') // Remove literal newlines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

/**
 * Convert plain text with simple markdown-like syntax to HTML
 * Supports **bold** and line breaks
 */
export function plainTextToHtml(text: string): string {
  if (!text) return ''

  return text
    // Convert **bold** to <strong>bold</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert line breaks to <br>
    .replace(/\n/g, '<br>')
    // Convert multiple spaces to &nbsp;
    .replace(/  /g, '&nbsp;&nbsp;')
}

/**
 * Convert HTML back to plain text (for fallback)
 */
export function htmlToPlainText(html: string): string {
  if (!html) return ''

  return html
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Convert HTML entities back
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Convert <br> back to line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    .trim()
}