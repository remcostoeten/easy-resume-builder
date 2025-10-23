"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { SummaryContent } from "@/lib/types/resume"

interface SummaryEditorProps {
  content: any
  onUpdate: (content: SummaryContent) => void
}

export function SummaryEditor({ content, onUpdate }: SummaryEditorProps) {
  const summaryContent = content as SummaryContent

  return (
    <div className="space-y-2">
      <Label htmlFor="summary">Professional Summary</Label>
      <Textarea
        id="summary"
        value={summaryContent.text}
        onChange={(e) => onUpdate({ ...summaryContent, text: e.target.value })}
        placeholder="Write a brief professional summary..."
        rows={6}
        className="resize-none"
      />
      <p className="text-xs text-muted-foreground">
        A concise overview of your professional background and key qualifications
      </p>
    </div>
  )
}
