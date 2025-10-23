"use client"

import { useMemo } from "react"
import { diffWords, type Change } from "diff"

interface DiffViewProps {
  original: string
  modified: string
}

export function DiffView({ original, modified }: DiffViewProps) {
  const changes = useMemo(() => {
    return diffWords(original, modified)
  }, [original, modified])

  const renderChange = (change: Change, index: number) => {
    if (change.added) {
      return (
        <span key={index} className="bg-green-500/20 text-green-700 dark:text-green-300">
          {change.value}
        </span>
      )
    }
    if (change.removed) {
      return (
        <span key={index} className="bg-red-500/20 text-red-700 line-through dark:text-red-300">
          {change.value}
        </span>
      )
    }
    return <span key={index}>{change.value}</span>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
          <span className="text-xs font-medium text-muted-foreground">Original</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{original}</p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs font-medium text-foreground">Suggested Changes</span>
        </div>
        <p className="text-sm leading-relaxed">{changes.map(renderChange)}</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-xs">
        <div className="mt-0.5 flex gap-3">
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
      </div>
    </div>
  )
}
