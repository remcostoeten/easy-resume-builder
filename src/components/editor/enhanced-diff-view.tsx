"use client"

import { useMemo } from "react"
import { diffWords, type Change } from "diff"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedDiffViewProps {
  original: string
  modified: string
  onToggleChange: (changeId: string, accept: boolean) => void
  acceptedChanges: Set<string>
  rejectedChanges: Set<string>
}

export function EnhancedDiffView({
  original,
  modified,
  onToggleChange,
  acceptedChanges,
  rejectedChanges,
}: EnhancedDiffViewProps) {
  const changes = useMemo(() => {
    return diffWords(original, modified)
  }, [original, modified])

  const renderChange = (change: Change, index: number) => {
    const changeId = `change-${index}`
    const isAccepted = acceptedChanges.has(changeId)
    const isRejected = rejectedChanges.has(changeId)

    if (change.added) {
      return (
        <div key={index} className="group relative">
          <div
            className={cn(
              "bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded transition-all",
              {
                "ring-2 ring-green-500": isAccepted,
                "opacity-50 line-through": isRejected,
              }
            )}
          >
            {change.value}
            {/* Individual controls for additions */}
            <div className={cn(
              "absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
              {
                "opacity-100": isAccepted || isRejected
              }
            )}>
              {!isAccepted && !isRejected && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleChange(changeId, true)}
                    className="h-6 w-6 p-0 bg-green-500/20 hover:bg-green-500/30 text-green-700"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleChange(changeId, false)}
                    className="h-6 w-6 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-700"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </>
              )}
              {isAccepted && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleChange(changeId, false)}
                  className="h-6 w-6 p-0 bg-green-500/20 hover:bg-green-500/30 text-green-700"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
              {isRejected && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleChange(changeId, true)}
                  className="h-6 w-6 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-700"
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (change.removed) {
      return (
        <div key={index} className="group relative">
          <div
            className={cn(
              "bg-red-500/20 text-red-700 line-through dark:text-red-300 px-2 py-1 rounded transition-all",
              {
                "ring-2 ring-red-500": isRejected,
                "opacity-30": isAccepted,
              }
            )}
          >
            {change.value}
            {/* Individual controls for removals */}
            <div className={cn(
              "absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
              {
                "opacity-100": isAccepted || isRejected
              }
            )}>
              {!isAccepted && !isRejected && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleChange(changeId, false)}
                    className="h-6 w-6 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-700"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleChange(changeId, true)}
                    className="h-6 w-6 p-0 bg-green-500/20 hover:bg-green-500/30 text-green-700"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </>
              )}
              {isAccepted && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleChange(changeId, false)}
                  className="h-6 w-6 p-0 bg-green-500/20 hover:bg-green-500/30 text-green-700"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
              {isRejected && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleChange(changeId, true)}
                  className="h-6 w-6 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-700"
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return <span key={index}>{change.value}</span>
  }

  const handleBulkAccept = () => {
    changes.forEach((change, index) => {
      if (change.added) {
        onToggleChange(`change-${index}`, true)
      } else if (change.removed) {
        onToggleChange(`change-${index}`, false)
      }
    })
  }

  const handleBulkReject = () => {
    changes.forEach((change, index) => {
      if (change.added) {
        onToggleChange(`change-${index}`, false)
      } else if (change.removed) {
        onToggleChange(`change-${index}`, true)
      }
    })
  }

  const handleReset = () => {
    changes.forEach((change, index) => {
      const changeId = `change-${index}`
      if (acceptedChanges.has(changeId) || rejectedChanges.has(changeId)) {
        onToggleChange(changeId, false)
        onToggleChange(changeId, true)
      }
    })
  }

  const hasChanges = changes.some(change => change.added || change.removed)

  return (
    <div className="space-y-6">
      {/* Original text */}
      <div className="rounded-lg border bg-muted/30 p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            <span className="text-sm font-medium text-muted-foreground">Original</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{original}</p>
      </div>

      {/* Bulk controls */}
      {hasChanges && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-blue-500/10 p-4">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Quick Actions:</span>
          <Button size="sm" variant="outline" onClick={handleBulkAccept}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept All
          </Button>
          <Button size="sm" variant="outline" onClick={handleBulkReject}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject All
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </div>
      )}

      {/* Suggested changes */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">Suggested Changes</span>
            <span className="text-xs text-muted-foreground">
              (Click ± buttons to accept/reject individual changes)
            </span>
          </div>
        </div>
        <div className="text-sm leading-relaxed">
          {changes.map(renderChange)}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-start gap-4 rounded-lg border bg-blue-500/10 p-4 text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-6 rounded bg-green-500/20 border border-green-500/30" />
            <span className="text-muted-foreground">Added</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-6 rounded bg-red-500/20 border border-red-500/30 relative">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-px w-full bg-red-500/50" />
              </span>
            </span>
            <span className="text-muted-foreground">Removed</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          <strong>Tips:</strong> Hover over changes to see controls, use Quick Actions for bulk operations
        </div>
      </div>
    </div>
  )
}