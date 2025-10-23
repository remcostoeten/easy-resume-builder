import { SkeletonLoader } from '@/components/ui/skeleton-loader'
import { Loader2, Sparkles } from 'lucide-react'

export function AIAssistantSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Main AI Button */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-muted/50 border border-border/50 rounded-md px-3 py-2 min-w-16">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <SkeletonLoader width="30px" height="16px" />
        </div>

        {/* Dropdown menu skeleton */}
        <div className="absolute right-0 top-full mt-2 w-72 bg-muted/90 border border-border/50 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <SkeletonLoader width="160px" height="20px" />
            <SkeletonLoader width="200px" height="16px" className="mt-2" />
          </div>

          <div className="p-2 space-y-1">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-md">
                <div className="mt-0.5 h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <SkeletonLoader width="16px" height="16px" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <SkeletonLoader width="120px" height="16px" />
                  <SkeletonLoader width="180px" height="12px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AIResultsModalSkeleton() {
  return (
    <div className="max-w-3xl max-h-[85vh] flex flex-col bg-card border border-border rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="p-6 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <SkeletonLoader width="200px" height="24px" />
        </div>
        <SkeletonLoader width="300px" height="16px" />
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-2">
                <SkeletonLoader
                  width={`${Math.random() * 100 + 50}px`}
                  height="16px"
                  className="shrink-0"
                />
                <SkeletonLoader
                  width={`${Math.random() * 200 + 100}px`}
                  height="16px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Re-prompt section skeleton */}
        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
          <SkeletonLoader width="200px" height="16px" />
          <SkeletonLoader className="h-20" />
          <div className="flex gap-2">
            <SkeletonLoader width="140px" height="32px" />
            <SkeletonLoader width="80px" height="32px" />
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-between border-t border-border p-4">
        <SkeletonLoader width="80px" height="32px" />
        <div className="flex gap-2">
          <SkeletonLoader width="80px" height="32px" />
          <SkeletonLoader width="120px" height="32px" />
        </div>
      </div>
    </div>
  )
}

export function SectionAIResultsModalSkeleton() {
  return (
    <div className="max-w-4xl max-h-[85vh] flex flex-col bg-card border border-border rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="p-6 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <SkeletonLoader width="250px" height="24px" />
        </div>
        <SkeletonLoader width="350px" height="16px" />
      </div>

      {/* Changes list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <SkeletonLoader width="150px" height="20px" />
                <div className="flex gap-2">
                  <SkeletonLoader width="80px" height="24px" />
                  <SkeletonLoader width="80px" height="24px" />
                </div>
              </div>

              <div className="space-y-2">
                <SkeletonLoader width="100%" height="16px" />
                <SkeletonLoader width="90%" height="16px" />
                <SkeletonLoader width="85%" height="16px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-between border-t border-border p-4">
        <SkeletonLoader width="120px" height="32px" />
        <div className="flex gap-2">
          <SkeletonLoader width="100px" height="32px" />
          <SkeletonLoader width="140px" height="32px" />
        </div>
      </div>
    </div>
  )
}

export function DiffViewSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex gap-4 p-2 rounded border border-border/50">
          <div className="w-20 text-xs text-muted-foreground flex items-center">
            <SkeletonLoader width="40px" height="12px" />
          </div>
          <div className="flex-1">
            {i % 3 === 0 ? (
              // Removed line
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 px-3 py-1">
                <SkeletonLoader width="100%" height="16px" className="line-through opacity-50" />
              </div>
            ) : i % 3 === 1 ? (
              // Added line
              <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 px-3 py-1">
                <SkeletonLoader width="100%" height="16px" />
              </div>
            ) : (
              // Unchanged line
              <div className="px-3 py-1">
                <SkeletonLoader width={`${80 + Math.random() * 20}%`} height="16px" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FieldManagerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SkeletonLoader width="200px" height="24px" />
        <SkeletonLoader width="100px" height="32px" />
      </div>

      {/* Field types tabs */}
      <div className="flex space-x-1 border-b border-border">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="px-3 py-2">
            <SkeletonLoader width="60px" height="16px" />
          </div>
        ))}
      </div>

      {/* Field configuration */}
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLoader width="120px" height="16px" />
            <SkeletonLoader className="h-10" />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <SkeletonLoader width="100px" height="32px" />
        <SkeletonLoader width="80px" height="32px" />
      </div>
    </div>
  )
}

export function StylePanelSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonLoader width="200px" height="24px" />
        <SkeletonLoader width="300px" height="16px" />
      </div>

      {/* Style sections */}
      <div className="space-y-6">
        {/* Layout */}
        <div className="space-y-3">
          <SkeletonLoader width="100px" height="20px" />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonLoader className="h-16 rounded border border-border" />
                <SkeletonLoader width="60px" height="16px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="space-y-3">
          <SkeletonLoader width="80px" height="20px" />
          <SkeletonLoader className="h-10" />
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <SkeletonLoader width="100px" height="20px" />
          <div className="flex items-center gap-4">
            <SkeletonLoader width="60px" height="16px" />
            <SkeletonLoader className="flex-1 h-2" />
            <SkeletonLoader width="60px" height="16px" />
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-3">
          <SkeletonLoader width="80px" height="20px" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2 p-3 border border-border rounded">
                <SkeletonLoader width="80px" height="16px" />
                <SkeletonLoader width="60px" height="32px" />
              </div>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div className="space-y-3">
          <SkeletonLoader width="120px" height="20px" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonLoader key={i} className="h-12 rounded border border-border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PDFExportDialogSkeleton() {
  return (
    <div className="max-w-md bg-card border border-border rounded-lg shadow-lg p-6 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonLoader width="200px" height="24px" />
        <SkeletonLoader width="300px" height="16px" />
      </div>

      {/* Export options */}
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-border rounded">
            <div className="flex items-center gap-3">
              <SkeletonLoader width="20px" height="20px" />
              <div className="space-y-1">
                <SkeletonLoader width="120px" height="16px" />
                <SkeletonLoader width="180px" height="12px" />
              </div>
            </div>
            <SkeletonLoader width="20px" height="20px" />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <SkeletonLoader width="80px" height="32px" />
        <SkeletonLoader width="120px" height="32px" />
      </div>
    </div>
  )
}

export function TopBarSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        <SkeletonLoader width="20px" height="20px" />
        <SkeletonLoader width="160px" height="20px" />
        <SkeletonLoader width="200px" height="16px" />
      </div>

      {/* Right side - grouped controls */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Load Example */}
        <SkeletonLoader width="140px" height="32px" />

        <div className="h-6 w-px bg-border" />

        {/* View Mode */}
        <div className="flex gap-1">
          <SkeletonLoader width="60px" height="32px" />
          <SkeletonLoader width="60px" height="32px" />
          <SkeletonLoader width="80px" height="32px" />
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <SkeletonLoader width="32px" height="32px" />
          <SkeletonLoader width="32px" height="32px" />
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Style */}
        <SkeletonLoader width="32px" height="32px" />

        <div className="h-6 w-px bg-border" />

        {/* Theme */}
        <SkeletonLoader width="32px" height="32px" />

        <div className="h-6 w-px bg-border" />

        {/* Export */}
        <div className="flex gap-2">
          <SkeletonLoader width="60px" height="32px" />
          <SkeletonLoader width="60px" height="32px" />
          <SkeletonLoader width="80px" height="32px" />
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Save */}
        <SkeletonLoader width="80px" height="32px" />
      </div>
    </div>
  )
}