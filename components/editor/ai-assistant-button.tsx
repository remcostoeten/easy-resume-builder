"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Loader2, Lightbulb, SpellCheck, Wand2, MessageSquare } from "lucide-react"
import { AIResultsModal } from "./ai-results-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface AIAssistantButtonProps {
  text: string
  fieldLabel: string
  onApplySuggestion?: (correctedText: string) => void
}

type AIOperation = "tips" | "spellcheck" | "rewrite" | "custom"

export function AIAssistantButton({ text, fieldLabel, onApplySuggestion }: AIAssistantButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [operation, setOperation] = useState<AIOperation>("tips")
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  const handleAIOperation = async (op: AIOperation, prompt?: string) => {
    if (!text || text.trim().length === 0) {
      toast.error("No text to process", {
        description: "Please enter some text before using AI assistance.",
      })
      return
    }

    setIsProcessing(true)
    setOperation(op)

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          fieldLabel,
          operation: op,
          customPrompt: prompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 503 && errorData.fallback) {
          // Show fallback response
          setResult(errorData.fallback)
          setIsResultsOpen(true)
          toast.warning("AI features unavailable", {
            description: errorData.message || "AI features are currently disabled. Showing general suggestions instead."
          })
          return
        }

        // Handle other HTTP errors
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)
      setIsResultsOpen(true)
    } catch (error) {
      console.error("AI operation failed:", error)

      let errorMessage = "There was an error processing your request. Please try again."
      let errorTitle = "AI operation failed"

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()

        if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
          errorTitle = "Network error"
          errorMessage = "Unable to connect to the AI service. Please check your internet connection and try again."
        } else if (errorMsg.includes("timeout")) {
          errorTitle = "Request timeout"
          errorMessage = "The AI request took too long. Please try again with shorter text."
        } else if (errorMsg.includes("rate limit") || errorMsg.includes("quota")) {
          errorTitle = "Service unavailable"
          errorMessage = "AI service has reached its usage limit. Please try again later."
        } else if (error.message) {
          errorMessage = error.message
        }
      }

      toast.error(errorTitle, {
        description: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isProcessing || !text}
            className="h-8 gap-2"
            title="AI Assistant"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-primary" />
            )}
            <span className="text-xs font-medium">AI</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 z-[9999]">
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="text-xs text-muted-foreground">Improve your resume content</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAIOperation("tips")} className="gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <div className="flex flex-col">
              <span className="font-medium">Get Tips</span>
              <span className="text-xs text-muted-foreground">Suggestions for improvement</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAIOperation("spellcheck")} className="gap-2">
            <SpellCheck className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="font-medium">Spell Check</span>
              <span className="text-xs text-muted-foreground">Fix spelling & grammar</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAIOperation("rewrite")} className="gap-2">
            <Wand2 className="h-4 w-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="font-medium">Rewrite</span>
              <span className="text-xs text-muted-foreground">Make it more impactful</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCustomPromptOpen(true)} className="gap-2">
            <MessageSquare className="h-4 w-4 text-green-500" />
            <div className="flex flex-col">
              <span className="font-medium">Custom Prompt</span>
              <span className="text-xs text-muted-foreground">Your own instructions</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {result && (
        <AIResultsModal
          isOpen={isResultsOpen}
          onOpenChange={setIsResultsOpen}
          original={text}
          result={result}
          operation={operation}
          fieldLabel={fieldLabel}
          onInsert={(newText) => onApplySuggestion?.(newText)}
          onRePrompt={handleRePrompt}
        />
      )}

      <Dialog open={isCustomPromptOpen} onOpenChange={setIsCustomPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom AI Prompt</DialogTitle>
            <DialogDescription>
              Describe how you'd like to improve or modify the text for "{fieldLabel}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-prompt">Your Instructions</Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., Make it more concise, Add technical details, Focus on leadership skills..."
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
