import { SidebarSkeleton, ListItemSkeleton } from '@/components/ui/skeleton-loader'

export function LayersPanelSkeleton() {
  return (
    <div className="flex h-full max-w-full flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-6 w-12 rounded-full bg-muted animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-1.5 px-2 py-2">
          {/* Layer items */}
          {Array.from({ length: 5 }, (_, i) => (
            <LayerItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/20 px-3 py-2">
        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
      </div>
    </div>
  )
}

function LayerItemSkeleton() {
  return (
    <div className="group relative flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-2 transition-all duration-200 min-w-0 max-w-full">
      {/* Expand button placeholder */}
      <div className="w-3.5 h-3.5 flex-shrink-0" />

      {/* Drag handle */}
      <div className="h-4 w-4 flex-shrink-0 rounded bg-muted animate-pulse" />

      {/* Icon */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted animate-pulse">
        <div className="h-3.5 w-3.5 rounded" />
      </div>

      {/* Title and count */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left overflow-hidden">
        <div className="h-4 w-24 rounded bg-muted animate-pulse truncate w-full" />
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 items-center gap-1">
        <div className="h-7 w-7 rounded bg-muted animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="h-7 w-7 rounded bg-muted animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

// Entry item skeleton for expanded sections
function EntryItemSkeleton() {
  return (
    <div className="group flex items-center gap-2 rounded-md border border-border/50 bg-card/50 px-2 py-1.5 transition-all min-w-0 max-w-full">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted/50 animate-pulse">
        <div className="h-3 w-3 rounded" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start text-left overflow-hidden">
        <div className="h-3 w-28 rounded bg-muted animate-pulse truncate" />
        <div className="h-2.5 w-20 rounded bg-muted animate-pulse truncate" />
      </div>

      <div className="h-6 w-6 shrink-0 rounded bg-muted animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}