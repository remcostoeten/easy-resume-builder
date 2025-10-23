"use client"

import { Suspense, useMemo, useState, useEffect } from 'react'
import { useResponsiveSkeleton } from '@/lib/hooks/use-responsive-skeleton'
import {
  EditorSkeleton,
  EditModeSkeleton,
  PreviewModeSkeleton,
  SplitModeSkeleton,
  MobileSkeleton
} from './skeletons/editor-skeleton'
import { LayersPanelSkeleton } from './skeletons/layers-panel-skeleton'
import {
  SectionEditorSkeleton,
  SkillsEditorSkeleton,
  HeaderEditorSkeleton,
  EntryListSkeleton
} from './skeletons/section-editor-skeleton'
import {
  AIAssistantSkeleton,
  AIResultsModalSkeleton,
  SectionAIResultsModalSkeleton,
  DiffViewSkeleton
} from './skeletons/ai-components-skeleton'
import type { ViewMode } from './top-bar'
import type { ResumeSection } from '@/lib/types/resume'

// Enhanced loading strategies for better performance
export enum LoadingStrategy {
  IMMEDIATE = 'immediate',      // Show skeleton immediately
  DELAYED = 'delayed',         // Show skeleton after short delay
  PROGRESSIVE = 'progressive', // Progressive loading with multiple states
  PRIORITY = 'priority'        // Priority-based loading
}

interface OptimizedSuspenseWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  strategy?: LoadingStrategy
  delay?: number
  priority?: 'high' | 'medium' | 'low'
}

// Progressive loading component that shows different loading states
function ProgressiveLoader({
  strategy,
  fallback,
  delay = 0
}: {
  strategy: LoadingStrategy
  fallback: React.ReactNode
  delay: number
}) {
  const [showLoader, setShowLoader] = useState(delay === 0)

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowLoader(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  if (!showLoader) {
    return <div className="invisible">{fallback}</div>
  }

  return <>{fallback}</>
}

// Optimized suspense wrapper with loading strategies
export function OptimizedSuspenseWrapper({
  children,
  fallback,
  strategy = LoadingStrategy.IMMEDIATE,
  delay = 0,
  priority = 'medium'
}: OptimizedSuspenseWrapperProps) {
  const enhancedFallback = useMemo(() => {
    if (strategy === LoadingStrategy.PROGRESSIVE) {
      return <ProgressiveLoader strategy={strategy} fallback={fallback || <div />} delay={delay} />
    }

    if (strategy === LoadingStrategy.DELAYED && delay > 0) {
      return <ProgressiveLoader strategy={strategy} fallback={fallback || <div />} delay={delay} />
    }

    return fallback
  }, [fallback, strategy, delay])

  return (
    <Suspense fallback={enhancedFallback || <div />}>
      {children}
    </Suspense>
  )
}

// Main editor suspense wrapper with priority-based loading
export function OptimizedEditorSuspenseWrapper({
  children,
  viewMode = "edit",
  priority = 'high'
}: {
  children: React.ReactNode
  viewMode?: ViewMode
  priority?: 'high' | 'medium' | 'low'
}) {
  const { isMobile } = useResponsiveSkeleton()

  const getSkeleton = () => {
    if (isMobile) return <MobileSkeleton />

    switch (viewMode) {
      case 'edit':
        return <EditModeSkeleton />
      case 'preview':
        return <PreviewModeSkeleton />
      case 'split':
        return <SplitModeSkeleton />
      default:
        return <EditorSkeleton />
    }
  }

  const strategy = priority === 'high' ? LoadingStrategy.IMMEDIATE :
                   priority === 'medium' ? LoadingStrategy.DELAYED :
                   LoadingStrategy.PROGRESSIVE

  const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 200

  return (
    <OptimizedSuspenseWrapper
      fallback={getSkeleton()}
      strategy={strategy}
      delay={delay}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// Layers panel suspense wrapper with progressive loading
export function OptimizedLayersPanelSuspense({
  children,
  priority = 'medium'
}: {
  children: React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}) {
  const strategy = priority === 'high' ? LoadingStrategy.IMMEDIATE : LoadingStrategy.PROGRESSIVE
  const delay = priority === 'high' ? 0 : 150

  return (
    <OptimizedSuspenseWrapper
      fallback={<LayersPanelSkeleton />}
      strategy={strategy}
      delay={delay}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// Section editor suspense wrapper with type-specific skeletons
export function OptimizedSectionEditorSuspense({
  children,
  section,
  priority = 'high'
}: {
  children: React.ReactNode
  section?: ResumeSection
  priority?: 'high' | 'medium' | 'low'
}) {
  const getSkeleton = () => {
    if (!section) return <SectionEditorSkeleton />

    const schemaId = section.schemaId.toLowerCase()

    if (schemaId.includes('header')) return <HeaderEditorSkeleton />
    if (schemaId.includes('skills')) return <SkillsEditorSkeleton />
    if (schemaId.includes('experience') || schemaId.includes('education') || schemaId.includes('projects')) {
      return <EntryListSkeleton entries={2} />
    }

    return <SectionEditorSkeleton />
  }

  const strategy = priority === 'high' ? LoadingStrategy.IMMEDIATE : LoadingStrategy.DELAYED
  const delay = priority === 'high' ? 0 : 100

  return (
    <OptimizedSuspenseWrapper
      fallback={getSkeleton()}
      strategy={strategy}
      delay={delay}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// Resume preview suspense wrapper with delayed loading
export function OptimizedResumePreviewSuspense({
  children,
  priority = 'medium'
}: {
  children: React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}) {
  const fallback = (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="animate-pulse">
          <div className="w-[400px] h-[564px] bg-muted rounded-lg mx-auto" />
        </div>
        <div className="text-muted-foreground text-sm">Loading preview...</div>
      </div>
    </div>
  )

  const strategy = priority === 'high' ? LoadingStrategy.IMMEDIATE : LoadingStrategy.DELAYED
  const delay = priority === 'high' ? 0 : 200

  return (
    <OptimizedSuspenseWrapper
      fallback={fallback}
      strategy={strategy}
      delay={delay}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// AI components suspense wrapper with progressive loading
export function OptimizedAISuspenseWrapper({
  children,
  type = 'assistant',
  priority = 'low'
}: {
  children: React.ReactNode
  type?: 'assistant' | 'results' | 'diff'
  priority?: 'high' | 'medium' | 'low'
}) {
  const getFallback = () => {
    switch (type) {
      case 'assistant':
        return <AIAssistantSkeleton />
      case 'results':
        return <AIResultsModalSkeleton />
      case 'diff':
        return <DiffViewSkeleton />
      default:
        return <AIAssistantSkeleton />
    }
  }

  const strategy = priority === 'high' ? LoadingStrategy.IMMEDIATE : LoadingStrategy.PROGRESSIVE
  const delay = priority === 'high' ? 0 : priority === 'medium' ? 300 : 500

  return (
    <OptimizedSuspenseWrapper
      fallback={getFallback()}
      strategy={strategy}
      delay={delay}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// Component-level suspense wrappers with optimized loading
export function OptimizedLayersPanelItemSuspense({
  children,
  priority = 'low'
}: {
  children: React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}) {
  const fallback = (
    <div className="group relative flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-2 min-w-0 max-w-full">
      <div className="w-3.5 h-3.5 flex-shrink-0" />
      <div className="h-4 w-4 flex-shrink-0 rounded bg-muted animate-pulse" />
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted animate-pulse">
        <div className="h-3.5 w-3.5 rounded" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <div className="h-7 w-7 rounded bg-muted animate-pulse" />
        <div className="h-7 w-7 rounded bg-muted animate-pulse" />
      </div>
    </div>
  )

  return (
    <OptimizedSuspenseWrapper
      fallback={fallback}
      strategy={LoadingStrategy.PROGRESSIVE}
      delay={100}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

export function OptimizedEntryItemSuspense({
  children,
  priority = 'low'
}: {
  children: React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}) {
  const fallback = (
    <div className="group flex items-center gap-2 rounded-md border border-border/50 bg-card/50 px-2 py-1.5 min-w-0 max-w-full">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted/50 animate-pulse">
        <div className="h-3 w-3 rounded" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden">
        <div className="h-3 w-28 rounded bg-muted animate-pulse" />
        <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-6 w-6 shrink-0 rounded bg-muted animate-pulse" />
    </div>
  )

  return (
    <OptimizedSuspenseWrapper
      fallback={fallback}
      strategy={LoadingStrategy.PROGRESSIVE}
      delay={50}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// Field suspense wrapper with type-specific loading
export function OptimizedFieldSuspense({
  children,
  type = "text",
  priority = 'medium'
}: {
  children: React.ReactNode
  type?: "text" | "textarea" | "date" | "checkbox"
  priority?: 'high' | 'medium' | 'low'
}) {
  const getFallback = () => {
    switch (type) {
      case "textarea":
        return <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-24 w-full rounded bg-muted animate-pulse" />
        </div>
      case "date":
        return <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-10 w-full rounded bg-muted animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-10 w-full rounded bg-muted animate-pulse" />
          </div>
        </div>
      case "checkbox":
        return <div className="flex items-center space-x-3">
          <div className="h-4 w-4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        </div>
      default:
        return <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-10 w-full rounded bg-muted animate-pulse" />
        </div>
    }
  }

  const strategy = priority === 'high' ? LoadingStrategy.IMMEDIATE : LoadingStrategy.DELAYED
  const delay = priority === 'high' ? 0 : 50

  return (
    <OptimizedSuspenseWrapper
      fallback={getFallback()}
      strategy={strategy}
      delay={delay}
      priority={priority}
    >
      {children}
    </OptimizedSuspenseWrapper>
  )
}

// Preloading utilities for better performance
export function preloadComponent(componentName: string) {
  // This can be used to preload critical components
  switch (componentName) {
    case 'StylePanel':
      import('./style-panel')
      break
    case 'FieldManager':
      import('./field-manager')
      break
    case 'SectionAIAssistant':
      import('./section-ai-assistant')
      break
    default:
      break
  }
}

// Batch preloading for multiple components
export function preloadCriticalComponents() {
  // Preload high-priority components in parallel
  Promise.all([
    import('./style-panel'),
    import('./field-manager'),
    import('./dynamic-field'),
    import('./layers-panel'),
    import('./section-editor'),
    import('./resume-preview')
  ]).catch(console.error)
}