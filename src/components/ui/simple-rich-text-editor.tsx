"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface SimpleRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
}

export function SimpleRichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  rows = 4
}: SimpleRichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Get cursor position in textarea
  const getCursorPosition = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return { start: 0, end: 0 }
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    }
  }, [])

  // Set cursor position in textarea
  const setCursorPosition = useCallback((start: number, end: number = start) => {
    const textarea = textareaRef.current
    if (!textarea) return

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, end)
    }, 0)
  }, [])

  // Wrap selected text with markdown syntax
  const wrapText = useCallback((before: string, after: string = before) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { start, end } = getCursorPosition()
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Set cursor position after the wrapping
    const newStart = start + before.length
    const newEnd = newStart + selectedText.length
    setCursorPosition(newStart, newEnd)
  }, [value, onChange, getCursorPosition, setCursorPosition])

  // Insert text at cursor position
  const insertText = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { start } = getCursorPosition()
    const newText = value.substring(0, start) + text + value.substring(start)

    onChange(newText)
    setCursorPosition(start + text.length)
  }, [value, onChange, getCursorPosition, setCursorPosition])

  // Format functions
  const handleBold = useCallback(() => {
    wrapText('**')
  }, [wrapText])

  const handleItalic = useCallback(() => {
    wrapText('*')
  }, [wrapText])

  const handleBulletList = useCallback(() => {
    const { start } = getCursorPosition()
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const beforeLine = value.substring(0, lineStart)
    const afterLine = value.substring(start)
    const newText = beforeLine + '• ' + afterLine

    onChange(newText)
    setCursorPosition(lineStart + 2)
  }, [value, onChange, getCursorPosition])

  const handleNumberedList = useCallback(() => {
    const { start } = getCursorPosition()
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const beforeLine = value.substring(0, lineStart)
    const afterLine = value.substring(start)
    const newText = beforeLine + '1. ' + afterLine

    onChange(newText)
    setCursorPosition(lineStart + 3)
  }, [value, onChange, getCursorPosition])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          handleBold()
          break
        case 'i':
          e.preventDefault()
          handleItalic()
          break
      }
    }

    // Handle tab for lists
    if (e.key === 'Tab') {
      e.preventDefault()
      const { start } = getCursorPosition()
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const currentLine = value.substring(lineStart, start)

      if (currentLine.startsWith('• ')) {
        // Convert bullet to numbered
        const newText = value.substring(0, lineStart) + '1. ' + value.substring(lineStart + 2)
        onChange(newText)
        setCursorPosition(start + 1)
      } else if (currentLine.match(/^\d+\. /)) {
        // Convert numbered to bullet
        const newText = value.substring(0, lineStart) + '• ' + value.substring(lineStart + currentLine.indexOf(' ') + 1)
        onChange(newText)
        setCursorPosition(start - 1)
      }
    }
  }, [handleBold, handleItalic, getCursorPosition, value, onChange])

  return (
    <div className={cn("border rounded-md", isFocused ? "ring-2 ring-ring ring-offset-2" : "", className)}>
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBulletList}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNumberedList}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className="border-0 resize-none focus:outline-none focus:ring-0 min-h-[120px] font-mono"
      />

      {/* Help text */}
      <div className="border-t bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium">Tips:</span> Use **bold** or *italic* • Ctrl+B for bold • Ctrl+I for italic • Tab to switch list types
      </div>
    </div>
  )
}