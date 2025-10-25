"use client"

import { Label } from "@/components/ui/label"
import { SimpleRichTextEditor } from "@/components/ui/simple-rich-text-editor"
import type { SummaryContent } from "@/lib/types/resume"

interface SummaryEditorProps {
  content: any
  onUpdate: (content: SummaryContent) => void
}

export function SummaryEditor({ content, onUpdate }: SummaryEditorProps) {
  const summaryContent = content as SummaryContent

  const handleMarkdownChange = (markdown: string) => {
    // Strip markdown for plain text fallback
    const plainText = markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1') // Remove italic
      .replace(/^[\s]*•[\s]+/gm, '') // Remove bullet points
      .replace(/^[\s]*\d+\.[\s]+/gm, '') // Remove numbered lists
      .trim()

    onUpdate({
      ...summaryContent,
      text: plainText,
      richText: markdown // Store markdown in richText field
    })
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="summary">Professional Summary</Label>
      <SimpleRichTextEditor
        value={summaryContent.richText || summaryContent.text}
        onChange={handleMarkdownChange}
        placeholder="Write a brief professional summary..."
        className="w-full"
        rows={6}
      />
      <p className="text-xs text-muted-foreground">
        Use **bold** for emphasis, *italic* for emphasis, and bullet points for lists. Ctrl+B for bold, Ctrl+I for italic.
      </p>
    </div>
  )
}
