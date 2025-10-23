"use client"

import { lazy, Suspense } from 'react'
import {
  AIAssistantSkeleton,
  AIResultsModalSkeleton,
  SectionAIResultsModalSkeleton,
  FieldManagerSkeleton,
  StylePanelSkeleton,
  DiffViewSkeleton
} from './skeletons/ai-components-skeleton'

// AI Components - Lazy loaded as they are heavy and not always needed
export const SectionAIAssistant = lazy(() =>
  import('./section-ai-assistant').then(module => ({
    default: module.SectionAIAssistant
  }))
)

export const AIResultsModal = lazy(() =>
  import('./ai-results-modal').then(module => ({
    default: module.AIResultsModal
  }))
)

export const SectionAIResultsModal = lazy(() =>
  import('./section-ai-results-modal').then(module => ({
    default: module.SectionAIResultsModal
  }))
)

// Field Management - Lazy loaded as it's only used when customizing fields
export const FieldManager = lazy(() =>
  import('./field-manager').then(module => ({
    default: module.FieldManager
  }))
)

// Style Components - Lazy loaded as they're only needed in dialogs
export const StylePanel = lazy(() =>
  import('./style-panel').then(module => ({
    default: module.StylePanel
  }))
)

// Utility Components - Lazy loaded as they're conditionally rendered
export const DiffView = lazy(() =>
  import('./diff-view').then(module => ({
    default: module.DiffView
  }))
)

// Theme Components - Lazy loaded as they're only used in dialogs
export const ThemePicker = lazy(() =>
  import('@/components/theme-picker').then(module => ({
    default: module.ThemePicker
  }))
)

// FlexibleDatePicker is NOT lazy loaded since DynamicField (critical path) uses it
// Critical components that should NOT be lazy loaded for SSR
import { FlexibleDatePicker } from './flexible-date-picker'

// Suspense Wrappers for Lazy Components
export function LazySectionAIAssistant(props: any) {
  return (
    <Suspense fallback={<AIAssistantSkeleton />}>
      <SectionAIAssistant {...props} />
    </Suspense>
  )
}

export function LazyAIResultsModal(props: any) {
  return (
    <Suspense fallback={<AIResultsModalSkeleton />}>
      <AIResultsModal {...props} />
    </Suspense>
  )
}

export function LazySectionAIResultsModal(props: any) {
  return (
    <Suspense fallback={<SectionAIResultsModalSkeleton />}>
      <SectionAIResultsModal {...props} />
    </Suspense>
  )
}

export function LazyFieldManager(props: any) {
  return (
    <Suspense fallback={<FieldManagerSkeleton />}>
      <FieldManager {...props} />
    </Suspense>
  )
}

export function LazyStylePanel(props: any) {
  return (
    <Suspense fallback={<StylePanelSkeleton />}>
      <StylePanel {...props} />
    </Suspense>
  )
}

export function LazyDiffView(props: any) {
  return (
    <Suspense fallback={<DiffViewSkeleton />}>
      <DiffView {...props} />
    </Suspense>
  )
}

export function LazyThemePicker(props: any) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading themes...</div>}>
      <ThemePicker {...props} />
    </Suspense>
  )
}

// FlexibleDatePicker is not lazy loaded (critical component)

// Critical components that should NOT be lazy loaded for SSR
// These components are part of the core UI and should be server-rendered
import { TopBar } from './top-bar'
import { EditorLayout } from './editor-layout'
import { LayersPanel } from './layers-panel'
import { SectionEditor } from './section-editor'
import { ResumePreview } from './resume-preview'
import { DynamicField } from './dynamic-field'
import { ResizeHandle } from './resize-handle'

export {
  TopBar,
  EditorLayout,
  LayersPanel,
  SectionEditor,
  ResumePreview,
  DynamicField,
  ResizeHandle,
  FlexibleDatePicker
}

// Helper function to determine if a component should be lazy loaded
export function shouldLazyLoad(componentName: string): boolean {
  const lazyComponents = [
    'SectionAIAssistant',
    'AIResultsModal',
    'SectionAIResultsModal',
    'FieldManager',
    'StylePanel',
    'DiffView',
    'ThemePicker'
  ]

  return lazyComponents.includes(componentName)
}

// Priority loading levels for better performance
export enum LoadPriority {
  IMMEDIATE = 0,    // Core components, not lazy loaded
  HIGH = 1,         // Load immediately after core
  MEDIUM = 2,       // Load when needed
  LOW = 3,          // Load when explicitly requested
}

export const componentPriorities: Record<string, LoadPriority> = {
  // Core components - immediate
  'TopBar': LoadPriority.IMMEDIATE,
  'EditorLayout': LoadPriority.IMMEDIATE,
  'LayersPanel': LoadPriority.IMMEDIATE,
  'SectionEditor': LoadPriority.IMMEDIATE,
  'ResumePreview': LoadPriority.IMMEDIATE,
  'DynamicField': LoadPriority.IMMEDIATE,
  'ResizeHandle': LoadPriority.IMMEDIATE,
  'FlexibleDatePicker': LoadPriority.IMMEDIATE, // Critical since DynamicField uses it

  // High priority - frequently used
  'StylePanel': LoadPriority.HIGH,
  'FieldManager': LoadPriority.HIGH,
  'ThemePicker': LoadPriority.HIGH,

  // Medium priority - used occasionally
  'DiffView': LoadPriority.MEDIUM,

  // Low priority - rarely used
  'SectionAIAssistant': LoadPriority.LOW,
  'AIResultsModal': LoadPriority.LOW,
  'SectionAIResultsModal': LoadPriority.LOW,
}

// Preloading utilities
export function preloadComponent(componentName: string) {
  switch (componentName) {
    case 'StylePanel':
      import('./style-panel')
      break
    case 'FieldManager':
      import('./field-manager')
      break
    case 'ThemePicker':
      import('@/components/theme-picker')
      break
    case 'SectionAIAssistant':
      import('./section-ai-assistant')
      break
    case 'DiffView':
      import('./diff-view')
      break
    // FlexibleDatePicker is not lazy loaded (critical)
    default:
      break
  }
}

// Batch preloading for high-priority components
export function preloadHighPriorityComponents() {
  Promise.all([
    import('./style-panel'),
    import('./field-manager'),
    import('@/components/theme-picker'),
    import('./diff-view')
  ]).catch(console.error)
}