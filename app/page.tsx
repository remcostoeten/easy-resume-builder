"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, BookOpen, Trash2, Clock, Library, Pencil, Check, X, AlertTriangle } from "lucide-react"
import type { SavedResume } from "@/lib/types/resume"
import { PdfUploadDialog } from "@/components/pdf-upload-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/loading"
import { ErrorBoundary } from "@/components/error-boundary"
import { AnimatedLogo } from "@/components/ui/animated-logo"

const SAVED_RESUMES_KEY = "saved-resumes"
const DRAFT_KEY = "resume-draft"

export default function LibraryPage() {
  const router = useRouter()
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("")

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setError(null)
        const savedData = localStorage.getItem(SAVED_RESUMES_KEY)
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          // Ensure all resume data has properly initialized sections arrays
          const validatedData = parsedData.map((item: any) => ({
            ...item,
            data: {
              ...item.data,
              sections: item.data.sections || []
            }
          }))
          setSavedResumes(validatedData)
        }
      } catch (error) {
        console.error("Failed to load resumes:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setError("Failed to load your resume library. Please try refreshing the page.")
        toast.error("Failed to load resumes", {
          description: "There was an error loading your resume library.",
        })
      } finally {
        setIsLoading(false)
        setIsLoaded(true)
      }
    }

    loadResumes()
  }, [])

  const handleCreateNew = () => {
    // Clear draft to start fresh
    localStorage.removeItem(DRAFT_KEY)
    router.push("/editor")
  }

  const handleEdit = (resume: SavedResume) => {
    // Load the resume into draft
    localStorage.setItem(DRAFT_KEY, JSON.stringify(resume.data))
    router.push("/editor")
  }

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name })
  }

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return

    try {
      const updated = savedResumes.filter((r) => r.id !== deleteConfirm.id)
      localStorage.setItem(SAVED_RESUMES_KEY, JSON.stringify(updated))
      setSavedResumes(updated)
      toast.success("Resume deleted", {
        description: `"${deleteConfirm.name}" has been removed from your library.`,
      })
    } catch (error) {
      console.error("Failed to delete resume:", error)
      toast.error("Failed to delete resume", {
        description: "There was an error deleting the resume. Please try again.",
      })
      setError("Failed to delete resume. Please refresh the page and try again.")
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleRenameClick = (id: string, currentName: string) => {
    setEditingId(id)
    setEditedName(currentName)
  }

  const handleRenameSave = (id: string) => {
    if (!editedName.trim()) {
      toast.error("Invalid name", {
        description: "Resume name cannot be empty.",
      })
      return
    }

    try {
      const updated = savedResumes.map((r) =>
        r.id === id
          ? {
              ...r,
              name: editedName.trim(),
              data: { ...r.data, name: editedName.trim() },
            }
          : r,
      )
      localStorage.setItem(SAVED_RESUMES_KEY, JSON.stringify(updated))
      setSavedResumes(updated)
      toast.success("Resume renamed", {
        description: `Resume renamed to "${editedName.trim()}".`,
      })
    } catch (error) {
      console.error("Failed to rename resume:", error)
      toast.error("Failed to rename resume", {
        description: "There was an error renaming the resume. Please try again.",
      })
      setError("Failed to rename resume. Please refresh the page and try again.")
    } finally {
      setEditingId(null)
      setEditedName("")
    }
  }

  const handleRenameCancel = () => {
    setEditingId(null)
    setEditedName("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading your resume library..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-destructive mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={() => setError(null)}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <AnimatedLogo size="lg" className="flex h-16 w-16 items-center justify-center" />
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">Resume Library</h1>
              <p className="mt-1 font-sans text-sm text-muted-foreground">Your collection of professional resumes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap gap-4">
          <Button
            onClick={handleCreateNew}
            size="lg"
            className="gap-2 border border-foreground/20 bg-foreground px-8 py-6 text-base font-medium text-background shadow-lg transition-all hover:bg-foreground/90 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Create New Resume
          </Button>
          <PdfUploadDialog />
        </div>

        {savedResumes.length === 0 ? (
          <Card className="border-2 border-dashed border-border bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-foreground/10 bg-muted">
                <BookOpen className="h-12 w-12 text-foreground/60" />
              </div>
              <h3 className="mb-3 font-serif text-2xl font-semibold text-foreground">Your library awaits</h3>
              <p className="mb-8 max-w-md text-balance text-muted-foreground">
                Begin your journey by crafting your first professional resume. Each resume is a new chapter in your
                career story.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={handleCreateNew}
                  size="lg"
                  className="gap-2 border border-foreground/20 bg-foreground text-background hover:bg-foreground/90"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Resume
                </Button>
                <PdfUploadDialog />
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedResumes.map((resume) => (
              <Card
                key={resume.id}
                className="group relative flex flex-col overflow-hidden border-2 border-border bg-card shadow-md transition-all hover:border-foreground/20 hover:shadow-xl"
              >
                <div className="absolute left-0 top-0 h-full w-2 bg-foreground/80" />

                <div className="flex flex-1 flex-col p-6 pl-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-foreground/10 bg-muted">
                      <BookOpen className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRenameClick(resume.id, resume.name)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(resume.id, resume.name)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {editingId === resume.id ? (
                    <div className="mb-3 flex items-center gap-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameSave(resume.id)
                          if (e.key === "Escape") handleRenameCancel()
                        }}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleRenameSave(resume.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleRenameCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <h3 className="mb-3 font-serif text-xl font-semibold leading-tight text-foreground line-clamp-2">
                      {resume.name || "Untitled Resume"}
                    </h3>
                  )}

                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Saved {formatDate(resume.savedAt)}</span>
                  </div>
                </div>

                <div className="border-t-2 border-border bg-muted/30 p-4">
                  <Button
                    onClick={() => handleEdit(resume)}
                    variant="secondary"
                    className="w-full border border-foreground/10 bg-background font-medium hover:bg-foreground hover:text-background"
                  >
                    Open & Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </ErrorBoundary>
  )
}
