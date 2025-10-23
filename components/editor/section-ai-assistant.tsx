"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { SectionAIResultsModal } from "./section-ai-results-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { SectionContent, SectionSchema } from "@/lib/types/resume"
import type { FieldChange } from "@/lib/types/ai"

interface SectionAIAssistantProps {
  sectionContent: SectionContent
  sectionTitle: string
  schema: SectionSchema
  onApplyChanges: (changes: FieldChange[]) => void
}

type AIOperation = "spellcheck" | "improve" | "custom"

export function SectionAIAssistant({ sectionContent, sectionTitle, schema, onApplyChanges }: SectionAIAssistantProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [changes, setChanges] = useState<FieldChange[]>([])
  const [operation, setOperation] = useState<AIOperation>("spellcheck")
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  const handleAIOperation = async (op: AIOperation, prompt?: string) => {
    setIsMenuOpen(false)

    const hasTextContent = checkForTextContent()
    if (!hasTextContent) {
      toast.error("No text to process", {
        description: "Please add some text content to this section before using AI assistance.",
      })
      return
    }

    setIsProcessing(true)
    setOperation(op)

    try {
      const response = await fetch("/api/ai-section-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionContent,
          sectionTitle,
          operation: op,
          customPrompt: prompt,
          schema,
        }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error("AI operation failed", {
          description: data.error,
        })
        return
      }

      if (data.changes.length === 0) {
        toast.success("No changes needed", {
          description:
            op === "spellcheck"
              ? "Your content looks great! No spelling or grammar issues found."
              : "Your content is already well-optimized.",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
        return
      }

      setChanges(data.changes)
      setIsResultsOpen(true)
    } catch (error) {
      console.error("[v0] AI operation failed:", error)
      toast.error("AI operation failed", {
        description: "There was an error processing your request. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const checkForTextContent = () => {
    const hasDirectText = schema.fields.some((field) => {
      const value = sectionContent.fieldValues[field.name]
      return (
        value &&
        typeof value === "string" &&
        value.trim().length > 0 &&
        (field.type === "text" || field.type === "textarea" || field.type === "email")
      )
    })

    if (hasDirectText) return true

    const hasGroupText = schema.repeatableGroups.some((group) => {
      const entries = sectionContent.groupEntries[group.name] || []
      return entries.some((entry) =>
        group.fields.some((field) => {
          const value = entry.values[field.name]
          return (
            value &&
            typeof value === "string" &&
            value.trim().length > 0 &&
            (field.type === "text" || field.type === "textarea" || field.type === "email")
          )
        }),
      )
    })

    return hasGroupText
  }

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      setIsCustomPromptOpen(false)
      handleAIOperation("custom", customPrompt)
      setCustomPrompt("")
    }
  }

  const handleRePrompt = (newPrompt: string) => {
    handleAIOperation("custom", newPrompt)
  }

  return (
    <>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isProcessing}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
          <span className="font-medium">AI</span>
        </Button>

        <div
          className={`absolute right-0 top-full mt-2 w-72 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top ${
            isMenuOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
          style={{ zIndex: 9999 }}
        >
          <div className="p-4 border-b border-border/50">
            <p className="text-sm font-semibold text-foreground">Section AI Assistant</p>
            <p className="text-xs text-muted-foreground mt-1">Analyze and improve all text fields</p>
          </div>

          <div className="p-2 space-y-1">
            <button
              onClick={() => handleAIOperation("spellcheck")}
              className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors duration-200 text-left group"
            >
              <div className="mt-0.5 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Spell Check</p>
                <p className="text-xs text-muted-foreground mt-0.5">Fix spelling and grammar</p>
              </div>
            </button>

            <button
              onClick={() => handleAIOperation("improve")}
              className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors duration-200 text-left group"
            >
              <div className="mt-0.5 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Improve Content</p>
                <p className="text-xs text-muted-foreground mt-0.5">Make it more impactful</p>
              </div>
            </button>

            <div className="h-px bg-border/50 my-2" />

            <button
              onClick={() => {
                setIsMenuOpen(false)
                setIsCustomPromptOpen(true)
              }}
              className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors duration-200 text-left group"
            >
              <div className="mt-0.5 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Custom Instructions</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your own prompt</p>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />}
      </div>

      {changes.length > 0 && (
        <SectionAIResultsModal
          isOpen={isResultsOpen}
          onOpenChange={setIsResultsOpen}
          changes={changes}
          operation={operation}
          sectionTitle={sectionTitle}
          onApplyChanges={onApplyChanges}
          onRePrompt={handleRePrompt}
        />
      )}

      <Dialog open={isCustomPromptOpen} onOpenChange={setIsCustomPromptOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Custom AI Instructions</DialogTitle>
            <DialogDescription>
              Describe how you'd like to improve or modify the content in "{sectionTitle}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-prompt">Your Instructions</Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., Make everything more concise, Add more technical details, Focus on leadership skills..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCustomPromptOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCustomPrompt} disabled={!customPrompt.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
