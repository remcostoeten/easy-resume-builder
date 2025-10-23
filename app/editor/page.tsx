"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ResumeBuilder } from "@/components/resume-builder"
import type { Resume } from "@/lib/types/resume"
import { toast } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading"
import { ResumeLoadingProgress } from "@/components/progress-loading"

function EditorPageContent() {
  const searchParams = useSearchParams()
  const resumeId = searchParams?.get("resumeId")
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [initialResume, setInitialResume] = useState<Resume | null>(null)
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false)
  const [loadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    if (!resumeId) return

    const loadResumeById = async () => {
      setIsLoadingResume(true)
      setLoadingComplete(false)

      try {
        // Simulate minimum loading time for better UX
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Load saved resumes from localStorage
        const savedResumesData = localStorage.getItem("saved-resumes")
        if (!savedResumesData) {
          throw new Error("No saved resumes found")
        }

        const savedResumes = JSON.parse(savedResumesData)
        const targetResume = savedResumes.find((r: any) => r.id === resumeId)

        if (!targetResume) {
          throw new Error("Resume not found")
        }

        // Set the found resume as the draft
        localStorage.setItem("resume-draft", JSON.stringify(targetResume.data))
        setInitialResume(targetResume.data)
        setShouldAutoFocus(true) // Trigger auto-focus after load

        toast.success("Resume loaded", {
          description: `"${targetResume.name}" has been loaded for editing.`,
        })
      } catch (error) {
        console.error("Failed to load resume:", error)
        toast.error("Failed to load resume", {
          description: error instanceof Error ? error.message : "Could not find the specified resume.",
        })
        // Redirect to library if resume can't be loaded
        window.location.href = "/"
      } finally {
        setIsLoadingResume(false)
        setLoadingComplete(true)
      }
    }

    loadResumeById()
  }, [resumeId])

  if (isLoadingResume) {
    return <ResumeLoadingProgress isLoading={isLoadingResume} isComplete={loadingComplete} />
  }

  return <ResumeBuilder initialResume={initialResume} autoFocusFirstField={shouldAutoFocus || !resumeId} />
}

export default function EditorPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading editor..." />}>
        <EditorPageContent />
      </Suspense>
    </ErrorBoundary>
  )
}