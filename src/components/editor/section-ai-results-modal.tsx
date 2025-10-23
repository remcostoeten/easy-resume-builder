"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RotateCcw, Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react"
import { DiffView } from "./diff-view"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FieldChange } from "@/lib/types/ai"
import { Checkbox } from "@/components/ui/checkbox"

interface SectionAIResultsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  changes: FieldChange[]
  operation: "spellcheck" | "improve" | "custom"
  sectionTitle: string
  onApplyChanges: (changes: FieldChange[]) => void
  onRePrompt: (customPrompt: string) => void
}

export function SectionAIResultsModal({
  isOpen,
  onOpenChange,
  changes: initialChanges,
  operation,
  sectionTitle,
  onApplyChanges,
  onRePrompt,
}: SectionAIResultsModalProps) {
  const [changes, setChanges] = useState<FieldChange[]>(
    initialChanges.map((c) => ({ ...c, accepted: true })), // All accepted by default
  )
  const [customPrompt, setCustomPrompt] = useState("")
  const [showRePrompt, setShowRePrompt] = useState(false)
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set([0])) // First one expanded

  const toggleChange = (index: number) => {
    setChanges((prev) => prev.map((c, i) => (i === index ? { ...c, accepted: !c.accepted } : c)))
  }

  const toggleExpanded = (index: number) => {
    setExpandedChanges((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleApplyChanges = () => {
    const acceptedChanges = changes.filter((c) => c.accepted)
    if (acceptedChanges.length === 0) {
      toast.error("No changes selected", {
        description: "Please select at least one change to apply.",
      })
      return
    }

    onApplyChanges(acceptedChanges)
    onOpenChange(false)
    toast.success("Changes applied", {
      description: `Applied ${acceptedChanges.length} change${acceptedChanges.length > 1 ? "s" : ""} to ${sectionTitle}`,
    })
  }

  const handleRePrompt = () => {
    if (customPrompt.trim()) {
      onRePrompt(customPrompt)
      setCustomPrompt("")
      setShowRePrompt(false)
    }
  }

  const handleSelectAll = () => {
    const allAccepted = changes.every((c) => c.accepted)
    setChanges((prev) => prev.map((c) => ({ ...c, accepted: !allAccepted })))
  }

  const getTitle = () => {
    switch (operation) {
      case "spellcheck":
        return "Spell Check Results"
      case "improve":
        return "Improvement Suggestions"
      case "custom":
        return "AI Suggestions"
      default:
        return "AI Results"
    }
  }

  const getDescription = () => {
    switch (operation) {
      case "spellcheck":
        return "Review and apply spelling and grammar corrections"
      case "improve":
        return "Review and apply AI-powered improvements"
      case "custom":
        return "Review and apply AI suggestions based on your instructions"
      default:
        return "Review the AI-generated suggestions"
    }
  }

  const acceptedCount = changes.filter((c) => c.accepted).length

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">{getTitle()}</div>
              <div className="text-sm font-normal text-muted-foreground">{sectionTitle}</div>
            </div>
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {acceptedCount} of {changes.length} selected
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs">
            {changes.every((c) => c.accepted) ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {changes.map((change, index) => (
              <div
                key={index}
                className={`rounded-lg border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  change.accepted ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/50 bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  <Checkbox
                    checked={change.accepted}
                    onCheckedChange={() => toggleChange(index)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{change.fieldLabel}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                        className="h-7 w-7 p-0 hover:bg-primary/10 transition-colors duration-200"
                      >
                        {expandedChanges.has(index) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-t overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    expandedChanges.has(index) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-3">
                    <DiffView original={change.original} modified={change.suggested} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showRePrompt && (
            <div className="mt-4 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="re-prompt" className="text-sm font-medium">
                Refine with custom instructions
              </Label>
              <Textarea
                id="re-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., Make it more concise, Add more technical details, etc."
                rows={3}
                className="resize-none bg-background/50"
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
        </ScrollArea>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" size="sm" onClick={() => setShowRePrompt(!showRePrompt)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Refine
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyChanges} disabled={acceptedCount === 0} className="gap-2">
              <Check className="h-4 w-4" />
              Apply {acceptedCount > 0 ? `${acceptedCount} ` : ""}Change{acceptedCount !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
