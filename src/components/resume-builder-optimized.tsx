"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { useResumeStorage } from "@/lib/hooks/use-resume-storage"
import { useResumeHistory } from "@/lib/hooks/use-resume-history"
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts"
import { useViewTransition } from "@/lib/hooks/use-view-transition"
import { createDefaultResume } from "@/lib/utils/resume-defaults"
import type { Resume } from "@/lib/types/resume"
import { EditorLayout } from "./editor/editor-layout"
import { EditorSuspenseWrapper } from "./editor/suspense-wrappers"
import { TopBarSkeleton } from "./editor/skeletons/ai-components-skeleton"
import type { ViewMode } from "./editor/top-bar"
import type { ResumeStyle } from "./editor/style-panel"
import { toast } from "sonner"

// Lazy load the TopBar since it contains many heavy dialog components
const TopBar = lazy(() => import("./editor/top-bar").then(module => ({
  default: module.TopBar
})))

interface ResumeBuilderProps {
  initialResume?: Resume | null
  autoFocusFirstField?: boolean
}

export function ResumeBuilderOptimized({ initialResume, autoFocusFirstField: initialAutoFocus }: ResumeBuilderProps) {
  const { draft, isLoaded, saveDraft, saveToAccount, savedResumes, updateResumeName, exportResume, importResume } = useResumeStorage()
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)
  const { addToHistory, undo, redo, canUndo, canRedo } = useResumeHistory(currentResume)
  const [viewMode, setViewMode] = useState<ViewMode>("split")
  const { startTransition } = useViewTransition()
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>({
    layout: "single",
    fontFamily: "sans",
    fontSize: 12,
    spacing: "normal",
    colorScheme: "default",
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [autoFocusFirstField, setAutoFocusFirstField] = useState(false)

  useEffect(() => {
    if (isLoaded && !currentResume) {
      const resume = initialResume || draft || createDefaultResume()
      setCurrentResume(resume)
      if (!draft && !initialResume) {
        saveDraft(resume)
      }
      if (initialAutoFocus) {
        setAutoFocusFirstField(true)
      }
    }
  }, [isLoaded, draft, initialResume, currentResume, saveDraft, initialAutoFocus])

  useEffect(() => {
    if (currentResume) {
      setHasUnsavedChanges(true)
      const timeoutId = setTimeout(() => {
        saveDraft(currentResume)
        setHasUnsavedChanges(false)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [currentResume, saveDraft])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleResumeChange = (resume: Resume) => {
    setCurrentResume(resume)
    addToHistory(resume)
  }

  const handleUndo = () => {
    const previousResume = undo()
    if (previousResume) {
      setCurrentResume(previousResume)
      toast.info("Undone")
    }
  }

  const handleRedo = () => {
    const nextResume = redo()
    if (nextResume) {
      setCurrentResume(nextResume)
      toast.info("Redone")
    }
  }

  const handleSave = (name: string) => {
    if (currentResume) {
      const success = saveToAccount(currentResume, name)
      if (success) {
        setHasUnsavedChanges(false)
      }
    }
  }

  const handleNameChange = (newName: string) => {
    if (currentResume) {
      const updatedResume = { ...currentResume, name: newName }
      setCurrentResume(updatedResume)
      saveDraft(updatedResume)

      if (currentResume.id) {
        updateResumeName(currentResume.id, newName)
      }
    }
  }

  const handleExportResume = () => {
    if (currentResume) {
      exportResume(currentResume)
    } else {
      toast.error("No resume to export", {
        description: "Please create or load a resume before exporting.",
      })
    }
  }

  const handleImportResume = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const importedResume = await importResume(file)
        if (importedResume) {
          setCurrentResume(importedResume)
          addToHistory(importedResume)
          saveDraft(importedResume)
          setHasUnsavedChanges(false)
        }
      }
    }
    input.click()
  }

  const handleLoadTemplate = (templateResume: Resume) => {
    setCurrentResume(templateResume)
    addToHistory(templateResume)
    saveDraft(templateResume)
  }

  const handleAutoFocusFirstField = () => {
    setAutoFocusFirstField(true)
    setTimeout(() => {
      setAutoFocusFirstField(false)
    }, 1000)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    startTransition(() => {
      setViewMode(mode)
    })
  }

  useKeyboardShortcuts({
    onSave: () => {
      if (currentResume) {
        saveDraft(currentResume)
        setHasUnsavedChanges(false)
        toast.success("Resume saved")
      }
    },
    onUndo: handleUndo,
    onRedo: handleRedo,
    enabled: true,
  })

  if (!isLoaded || !currentResume) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading resume builder...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* TopBar - lazy loaded since it contains many dialogs and heavy components */}
      <Suspense fallback={<TopBarSkeleton />}>
        <TopBar
          resume={currentResume}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          savedResumes={savedResumes}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          resumeStyle={resumeStyle}
          onStyleChange={setResumeStyle}
          onNameChange={handleNameChange}
          onLoadTemplate={handleLoadTemplate}
          onAutoFocusFirstField={handleAutoFocusFirstField}
          onExportResume={handleExportResume}
          onImportResume={handleImportResume}
        />
      </Suspense>

      {/* Core editor content - critical path, SSR optimized */}
      <EditorSuspenseWrapper viewMode={viewMode}>
        <EditorLayout
          resume={currentResume}
          onChange={handleResumeChange}
          viewMode={viewMode}
          resumeStyle={resumeStyle}
          autoFocusFirstField={autoFocusFirstField}
        />
      </EditorSuspenseWrapper>

      {/* Save status indicator - non-critical */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground shadow-lg">
          Saving...
        </div>
      )}
    </div>
  )
}