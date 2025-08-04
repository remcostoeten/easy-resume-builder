"use client"

import { useState } from "react"
import { useSnapshot } from "valtio"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable-panels"
import { ProfessionalHeader } from "./professional-header"
import { ProfessionalSidebar } from "../sidebar/professional-sidebar"
import { ProfessionalEditingArea } from "../editing/professional-editing-area"
import { ProfessionalPreview } from "../preview/professional-preview"
import { resumeStore, resumeReducer } from "../../store/resume-store"
import type { TResumeSection } from "../../types/resume"

export function ProfessionalMainLayout() {
  const resumeData = useSnapshot(resumeStore).data
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isEditMode, setIsEditMode] = useState(true)
  const [isSplitMode, setIsSplitMode] = useState(true)

  function handleToggleSection(sectionId: string) {
    resumeReducer({ type: "TOGGLE_SECTION", sectionId })
  }

  function handleReorderSections(sections: readonly TResumeSection[]) {
    resumeReducer({ type: "REORDER_SECTIONS", sections })
  }

  function handleTogglePreview() {
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      // When entering preview mode, hide edit mode
      setIsEditMode(false)
      setIsSplitMode(false)
    } else {
      // When exiting preview mode, restore split view
      setIsEditMode(true)
      setIsSplitMode(true)
    }
  }

  function handleToggleEdit() {
    setIsEditMode(!isEditMode)
    if (!isEditMode) {
      setIsPreviewMode(false)
      setIsSplitMode(true)
    }
  }

  function handleToggleSplit() {
    setIsSplitMode(!isSplitMode)
    if (!isSplitMode) {
      setIsPreviewMode(false)
      setIsEditMode(true)
    }
  }

  function handlePreview() {
    console.log("Preview mode:", !isPreviewMode)
  }

  function handleDownload() {
    // Trigger browser print dialog for PDF export
    window.print()
  }

  function handleSettings() {
    console.log("Open settings")
  }

  // Calculate panel sizes based on mode
  const sidebarSize = isPreviewMode ? 0 : 20
  const editingSize = isPreviewMode ? 0 : isSplitMode ? 50 : isEditMode ? 80 : 0
  const previewSize = isPreviewMode ? 100 : isSplitMode ? 30 : isEditMode ? 0 : 100

  return (
    <div className="h-screen bg-background">
      <ProfessionalHeader
        onPreview={handlePreview}
        onDownload={handleDownload}
        onSettings={handleSettings}
        onTogglePreview={handleTogglePreview}
        onToggleEdit={handleToggleEdit}
        onToggleSplit={handleToggleSplit}
        isPreviewMode={isPreviewMode}
        isEditMode={isEditMode}
        isSplitMode={isSplitMode}
      />

      <div className="h-[calc(100vh-73px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {!isPreviewMode && (
            <>
              <ResizablePanel defaultSize={sidebarSize} minSize={15} maxSize={30} className="min-w-[280px]">
                <ProfessionalSidebar
                  sections={resumeData.sections}
                  onToggleSection={handleToggleSection}
                  onReorderSections={handleReorderSections}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {(isEditMode || isSplitMode) && !isPreviewMode && (
            <>
              <ResizablePanel defaultSize={editingSize} minSize={35}>
                <ProfessionalEditingArea sections={resumeData.sections} resumeData={resumeData} />
              </ResizablePanel>
              {isSplitMode && <ResizableHandle withHandle />}
            </>
          )}

          {(isSplitMode || isPreviewMode || (!isEditMode && !isSplitMode)) && (
            <ResizablePanel defaultSize={previewSize} minSize={25}>
              <ProfessionalPreview resumeData={resumeData} />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
