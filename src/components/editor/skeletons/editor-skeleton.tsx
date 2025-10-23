import { LayersPanelSkeleton } from './layers-panel-skeleton'
import { SectionEditorSkeleton } from './section-editor-skeleton'
import { SkeletonLoader } from '@/components/ui/skeleton-loader'

export function EditorSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      {/* Layers Panel Skeleton */}
      <div className="h-64 w-full overflow-hidden border-b border-border bg-card px-2 lg:h-full lg:w-80 lg:border-b-0 lg:border-r lg:px-0">
        <LayersPanelSkeleton />
      </div>

      {/* Content Area Skeleton */}
      <div className="flex-1 overflow-auto bg-background p-4 lg:p-6">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-2xl">
            <SectionEditorSkeleton />
          </div>
        </div>
      </div>

      {/* Preview Area (if in split view) */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:border-l lg:border-border lg:bg-muted/10">
        <div className="h-full w-full overflow-auto p-4 lg:p-6">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <SkeletonLoader width="400px" height="564px" />
              <div className="mt-4">
                <SkeletonLoader width="200px" height="16px" className="mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Specific skeleton for different view modes
export function EditModeSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="h-64 w-full overflow-hidden border-b border-border bg-card px-2 lg:h-full lg:w-80 lg:border-b-0 lg:border-r lg:px-0">
        <LayersPanelSkeleton />
      </div>
      <div className="flex-1 overflow-auto bg-background p-4 lg:p-6">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-2xl">
            <SectionEditorSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PreviewModeSkeleton() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full items-center justify-center bg-background p-4 lg:p-8">
        <div className="relative">
          <SkeletonLoader width="400px" height="564px" />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <SkeletonLoader width="240px" height="20px" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SplitModeSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="h-64 w-full overflow-hidden border-b border-border bg-card px-2 lg:h-full lg:w-80 lg:border-b-0 lg:border-r lg:px-0">
        <LayersPanelSkeleton />
      </div>
      <div className="flex-1 overflow-auto bg-background p-4 lg:p-6">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-2xl">
            <SectionEditorSkeleton />
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:border-l lg:border-border lg:bg-muted/10">
        <div className="h-full w-full overflow-auto p-4 lg:p-6">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <SkeletonLoader width="400px" height="564px" />
              <div className="mt-4">
                <SkeletonLoader width="200px" height="16px" className="mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized skeleton
export function MobileSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Mobile Layers Panel */}
      <div className="h-64 w-full overflow-hidden border-b border-border bg-card px-2">
        <LayersPanelSkeleton />
      </div>

      {/* Mobile Content Area */}
      <div className="flex-1 overflow-auto bg-background p-4">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-sm">
            <SectionEditorSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}