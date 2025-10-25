import type { SummaryContent } from "@/lib/types/resume"
import { SimpleRichTextDisplay } from "./simple-rich-text-display"

interface RichTextDisplayProps {
  content: SummaryContent
  className?: string
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  // Use richText if available, otherwise fall back to text
  const displayContent = content.richText || content.text || ''

  return (
    <div className={className}>
      <SimpleRichTextDisplay
        content={displayContent}
        className=""
      />
    </div>
  )
}