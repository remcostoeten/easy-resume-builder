"use client"

import { markdownToHtml } from "@/lib/utils/markdown"

interface SimpleRichTextDisplayProps {
  content: string
  className?: string
}

export function SimpleRichTextDisplay({ content, className }: SimpleRichTextDisplayProps) {
  const html = markdownToHtml(content)

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}