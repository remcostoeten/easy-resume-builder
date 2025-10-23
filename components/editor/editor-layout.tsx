"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { LayersPanel } from "./layers-panel"
import { SectionEditor } from "./section-editor"
import { ResumePreview } from "./resume-preview"
import {
  LayersPanelSuspense,
  SectionEditorSuspense,
  ResumePreviewSuspense
} from "./suspense-wrappers"
import { ResizeHandle } from "./resize-handle"
import { useResizable } from "@/lib/hooks/use-resizable"
import type { Resume, ResumeSection } from "@/lib/types/resume"
import type { ViewMode } from "./top-bar"
import type { ResumeStyle } from "./style-panel"
import { toast } from "sonner"

interface EditorLayoutProps {
  resume: Resume
  onChange: (resume: Resume) => void
  viewMode: ViewMode
  resumeStyle: ResumeStyle
  autoFocusFirstField?: boolean
}

export function EditorLayout({ resume, onChange, viewMode, resumeStyle, autoFocusFirstField }: EditorLayoutProps) {
  const [activeSection, setActiveSection] = useState<ResumeSection | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)

  // Auto-select the first section when a resume is loaded with auto-focus intent
  useEffect(() => {
    if (autoFocusFirstField && (resume.sections || []).length > 0) {
      const firstSection = (resume.sections || []).find(s => s.order === 0) || (resume.sections || [])[0]
      if (firstSection) {
        setSelectedSectionId(firstSection.id)
        setSelectedEntryId(null)
      }
    }
  }, [autoFocusFirstField, resume.sections])

  const handleDragStart = (event: DragStartEvent) => {
    const section = (resume.sections || []).find((s) => s.id === event.active.id)
    if (section) {
      setActiveSection(section)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveSection(null)

    if (!over || active.id === over.id) return

    const oldIndex = (resume.sections || []).findIndex((s) => s.id === active.id)
    const newIndex = (resume.sections || []).findIndex((s) => s.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newSections = [...(resume.sections || [])]
    const [movedSection] = newSections.splice(oldIndex, 1)
    newSections.splice(newIndex, 0, movedSection)

    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    onChange({
      ...resume,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleSectionUpdate = (updatedSection: ResumeSection) => {
    const updatedSections = (resume.sections || []).map((section) =>
      section.id === updatedSection.id ? updatedSection : section,
    )

    onChange({
      ...resume,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleSectionDelete = (sectionId: string) => {
    const updatedSections = (resume.sections || []).filter((section) => section.id !== sectionId)

    onChange({
      ...resume,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    })

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null)
      setSelectedEntryId(null)
    }
  }

  const handleSectionToggle = (sectionId: string) => {
    const updatedSections = (resume.sections || []).map((section) =>
      section.id === sectionId ? { ...section, visible: !section.visible } : section,
    )

    onChange({
      ...resume,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleEntrySelect = (sectionId: string, entryId: string) => {
    setSelectedSectionId(sectionId)
    setSelectedEntryId(entryId)

    setTimeout(() => {
      const entryElement = document.querySelector(`[data-entry-id="${entryId}"]`)
      if (entryElement) {
        entryElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handleEntryDelete = (sectionId: string, groupName: string, entryId: string) => {
    const section = (resume.sections || []).find((s) => s.id === sectionId)
    if (!section) return

    const currentEntries = section.content.groupEntries[groupName] || []
    const updatedEntries = currentEntries.filter((entry) => entry.id !== entryId)

    const updatedSection = {
      ...section,
      content: {
        ...section.content,
        groupEntries: {
          ...section.content.groupEntries,
          [groupName]: updatedEntries,
        },
      },
    }

    handleSectionUpdate(updatedSection)

    if (selectedEntryId === entryId) {
      setSelectedEntryId(null)
    }

    toast.success("Entry deleted", {
      description: "The entry has been removed from the section.",
    })
  }

  const handleSectionPartialUpdate = (sectionId: string, updates: Partial<ResumeSection>) => {
    const section = (resume.sections || []).find((s) => s.id === sectionId)
    if (!section) return

    const updatedSection = {
      ...section,
      ...updates,
    }

    handleSectionUpdate(updatedSection)
  }

  const selectedSection = (resume.sections || []).find((s) => s.id === selectedSectionId)

  const {
    width: previewWidth,
    isResizing,
    startResizing,
  } = useResizable({
    initialWidth: 600,
    minWidth: 400,
    maxWidth: 1200,
    storageKey: "resume-preview-width",
  })

  if (viewMode === "preview") {
    return (
      <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/30 p-8">
        <ResumePreviewSuspense>
          <ResumePreview resume={resume} showToolbar={true} style={resumeStyle} />
        </ResumePreviewSuspense>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="h-64 w-full overflow-hidden border-b border-border bg-card px-2 lg:h-full lg:w-80 lg:border-b-0 lg:border-r lg:px-0">
            <SortableContext items={(resume.sections || []).map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <LayersPanelSuspense>
                <LayersPanel
                  sections={resume.sections || []}
                  selectedSectionId={selectedSectionId}
                  selectedEntryId={selectedEntryId}
                  onSectionSelect={setSelectedSectionId}
                  onSectionToggle={handleSectionToggle}
                  onSectionDelete={handleSectionDelete}
                  onSectionUpdate={handleSectionPartialUpdate}
                  onEntrySelect={handleEntrySelect}
                  onEntryDelete={handleEntryDelete}
                />
              </LayersPanelSuspense>
            </SortableContext>
          </div>
        )}

        {(viewMode === "edit" || viewMode === "split") && (
          <div className="flex-1 overflow-auto bg-background p-4 lg:p-6">
            {selectedSection ? (
              <SectionEditorSuspense section={selectedSection}>
                <SectionEditor
                  section={selectedSection}
                  onUpdate={handleSectionUpdate}
                  scrollToEntryId={selectedEntryId || undefined}
                  autoFocusFirstField={autoFocusFirstField}
                />
              </SectionEditorSuspense>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                Select a section from the layers panel to edit
              </div>
            )}
          </div>
        )}

        {viewMode === "split" && (
          <>
            <ResizeHandle onMouseDown={startResizing} isResizing={isResizing} />
            <div
              className="hidden flex-col overflow-hidden border-l border-border lg:flex"
              style={{ width: `${previewWidth}px` }}
            >
              <ResumePreviewSuspense>
                <ResumePreview resume={resume} showToolbar={true} style={resumeStyle} />
              </ResumePreviewSuspense>
            </div>
          </>
        )}

        <DragOverlay>
          {activeSection ? (
            <div className="rounded-lg border border-primary bg-card p-3 shadow-lg">
              <div className="font-medium text-card-foreground">{activeSection.title}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
