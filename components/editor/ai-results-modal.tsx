"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, RotateCcw, Sparkles } from "lucide-react"
import { DiffView } from "./diff-view"
import { toast } from "sonner"

interface AIResultsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  original: string
  result: string
  operation: "tips" | "spellcheck" | "rewrite" | "custom"
  fieldLabel: string
  onInsert: (text: string) => void
  onRePrompt: (customPrompt: string) => void
}

export function AIResultsModal({
  isOpen,
  onOpenChange,
  original,
  result,
  operation,
  fieldLabel,
  onInsert,
  onRePrompt,
}: AIResultsModalProps) {
  const [copied, setCopied] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [showRePrompt, setShowRePrompt] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsert(result)
    onOpenChange(false)
    toast.success("Changes applied")
  }

  const handleRePrompt = () => {
    if (customPrompt.trim()) {
      onRePrompt(customPrompt)
      setCustomPrompt("")
      setShowRePrompt(false)
    }
  }

  const getTitle = () => {
    switch (operation) {
      case "tips":
        return "AI Tips"
      case "spellcheck":
        return "Spell Check Results"
      case "rewrite":
        return "AI Rewrite"
      case "custom":
        return "AI Suggestion"
      default:
        return "AI Results"
    }
  }

  const getDescription = () => {
    switch (operation) {
      case "tips":
        return "Review these suggestions to improve your resume content"
      case "spellcheck":
        return "Spelling and grammar corrections for your text"
      case "rewrite":
        return "AI-powered rewrite to make your content more impactful"
      case "custom":
        return "AI suggestion based on your custom prompt"
      default:
        return "Review the AI-generated suggestions"
    }
  }

  const showDiff = operation === "spellcheck" || operation === "rewrite" || operation === "custom"

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {getTitle()} - {fieldLabel}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {operation === "tips" ? (
            <div className="rounded-lg border bg-card p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
              </div>
            </div>
          ) : showDiff ? (
            <DiffView original={original} modified={result} />
          ) : (
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
            </div>
          )}

          {showRePrompt && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <Label htmlFor="re-prompt">Refine with custom instructions</Label>
              <Textarea
                id="re-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., Make it more concise, Add more technical details, etc."
                rows={3}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleRePrompt} disabled={!customPrompt.trim()}>
                  <Sparkles className="mr-2 h-3 w-3" />
                  Apply Refinement
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowRePrompt(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" size="sm" onClick={() => setShowRePrompt(!showRePrompt)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refine
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            {showDiff && (
              <Button size="sm" onClick={handleInsert}>
                Insert Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
