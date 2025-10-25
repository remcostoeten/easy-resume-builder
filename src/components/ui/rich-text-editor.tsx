"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Bold, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isUpdatingRef = useRef(false)
  const lastKnownValueRef = useRef(value)
  const initialValueSetRef = useRef(false)
  const userIsTypingRef = useRef(false)

  // Save and restore cursor position - simplified approach
  const saveCursorPosition = () => {
    if (!editorRef.current) return null
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null

    return selection.getRangeAt(0).cloneRange()
  }

  const restoreCursorPosition = (savedRange: Range | null) => {
    if (!savedRange || !editorRef.current) return

    try {
      const selection = window.getSelection()
      if (!selection) return

      selection.removeAllRanges()
      selection.addRange(savedRange)
    } catch (error) {
      console.warn('Could not restore cursor position:', error)
    }
  }

  // Initialize editor with value (only once)
  useEffect(() => {
    if (editorRef.current && !initialValueSetRef.current) {
      initialValueSetRef.current = true
      isUpdatingRef.current = true
      editorRef.current.innerHTML = value || ""
      lastKnownValueRef.current = value || ""
      isUpdatingRef.current = false
    }
  }, [])

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current && !isUpdatingRef.current) {
      const content = editorRef.current.innerHTML
      if (content !== lastKnownValueRef.current) {
        lastKnownValueRef.current = content
        onChange(content)
      }
    }
  }

  // Handle external value sync only when user is not actively typing and value actually changed
  useEffect(() => {
    if (
      !userIsTypingRef.current &&
      initialValueSetRef.current &&
      lastKnownValueRef.current !== value &&
      editorRef.current &&
      editorRef.current.innerHTML !== value
    ) {
      isUpdatingRef.current = true
      editorRef.current.innerHTML = value
      lastKnownValueRef.current = value
      isUpdatingRef.current = false
    }
  }, [value])

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true)
    userIsTypingRef.current = true
    isUpdatingRef.current = false
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Small delay before marking user as not typing to avoid interference with final updates
    setTimeout(() => {
      userIsTypingRef.current = false
    }, 100)
  }

  // Format text functions
  const formatText = (command: string, value?: string) => {
    const savedRange = saveCursorPosition()
    isUpdatingRef.current = true
    document.execCommand(command, false, value)
    requestAnimationFrame(() => {
      isUpdatingRef.current = false
      restoreCursorPosition(savedRange)
      handleInput()
    })
    editorRef.current?.focus()
  }

  const handleBold = () => {
    formatText('bold')
  }

  const handleLineBreak = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      isUpdatingRef.current = true
      const range = selection.getRangeAt(0)
      const br = document.createElement('br')
      range.deleteContents()
      range.insertNode(br)
      range.setStartAfter(br)
      range.setEndAfter(br)
      selection.removeAllRanges()
      selection.addRange(range)

      requestAnimationFrame(() => {
        isUpdatingRef.current = false
        handleInput()
      })
    }
    editorRef.current?.focus()
  }

  // Handle paste to strip unwanted formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const savedRange = saveCursorPosition()
    isUpdatingRef.current = true
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    requestAnimationFrame(() => {
      isUpdatingRef.current = false
      restoreCursorPosition(savedRange)
      handleInput()
    })
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          handleBold()
          break
        case 'Enter':
          e.preventDefault()
          handleLineBreak()
          break
      }
    }
  }

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
          onClick={handleLineBreak}
          className="h-8 w-8 p-0"
          title="Line Break (Ctrl+Enter)"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-3 outline-none focus:outline-none"
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          position: absolute;
        }
      `}</style>
    </div>
  )
}