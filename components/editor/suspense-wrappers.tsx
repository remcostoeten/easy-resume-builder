"use client"

import { Suspense } from 'react'
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
import type { ViewMode } from './top-bar'
import type { ResumeSection } from '@/lib/types/resume'

// Main editor suspense wrapper
export function EditorSuspenseWrapper({
  children,
  viewMode = "edit"
}: {
  children: React.ReactNode
  viewMode?: ViewMode
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

  return (
    <Suspense fallback={getSkeleton()}>
      {children}
    </Suspense>
  )
}

// Layers panel suspense wrapper
export function LayersPanelSuspense({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<LayersPanelSkeleton />}>
      {children}
    </Suspense>
  )
}

// Section editor suspense wrapper with different skeletons based on section type
export function SectionEditorSuspense({
  children,
  section
}: {
  children: React.ReactNode
  section?: ResumeSection
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

  return (
    <Suspense fallback={getSkeleton()}>
      {children}
    </Suspense>
  )
}

// Resume preview suspense wrapper
export function ResumePreviewSuspense({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <div className="w-[400px] h-[564px] bg-muted rounded-lg mx-auto" />
          </div>
          <div className="text-muted-foreground text-sm">Loading preview...</div>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}

// Individual component suspense wrappers for granular loading
export function LayersPanelItemSuspense({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
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
    }>
      {children}
    </Suspense>
  )
}

export function EntryItemSuspense({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
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
    }>
      {children}
    </Suspense>
  )
}

// Field suspense wrapper
export function FieldSuspense({
  children,
  type = "text"
}: {
  children: React.ReactNode
  type?: "text" | "textarea" | "date" | "checkbox"
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

  return (
    <Suspense fallback={getFallback()}>
      {children}
    </Suspense>
  )
}