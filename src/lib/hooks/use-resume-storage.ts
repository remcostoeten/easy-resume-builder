"use client"

import { useState, useEffect } from "react"
import type { Resume, SavedResume } from "@/lib/types/resume"
import { toast } from "sonner"

const DRAFT_KEY = "resume-draft"
const SAVED_RESUMES_KEY = "saved-resumes"

export function useResumeStorage() {
  const [draft, setDraft] = useState<Resume | null>(null)
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const draftData = localStorage.getItem(DRAFT_KEY)
      if (draftData) {
        const parsedDraft = JSON.parse(draftData)
        // Ensure draft data has properly initialized sections array
        setDraft({
          ...parsedDraft,
          sections: parsedDraft.sections || []
        })
      }

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
      console.error("Failed to load resume data:", error)
      toast.error("Failed to load resume data", {
        description: "There was an error loading your resumes from storage.",
      })
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const saveDraft = (resume: Resume) => {
    try {
      const updatedResume = {
        ...resume,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedResume))
      setDraft(updatedResume)
    } catch (error) {
      console.error("Failed to save draft:", error)
      if (error instanceof Error && error.name === "QuotaExceededError") {
        toast.error("Storage quota exceeded", {
          description: "Your browser storage is full. Please delete some old resumes.",
        })
      } else {
        toast.error("Failed to save draft", {
          description: "There was an error saving your resume.",
        })
      }
    }
  }

  const saveToAccount = (resume: Resume, name: string) => {
    try {
      const existingResume = savedResumes.find((r) => r.name === name && r.id !== resume.id)
      if (existingResume) {
        toast.error("Duplicate resume name", {
          description: "A resume with this name already exists. Please choose a different name.",
        })
        return false
      }

      const savedResume: SavedResume = {
        id: resume.id || crypto.randomUUID(),
        name,
        data: {
          ...resume,
          name,
          sections: resume.sections || [],
          updatedAt: new Date().toISOString(),
          createdAt: resume.createdAt || new Date().toISOString(),
        },
        savedAt: new Date().toISOString(),
      }

      const updated = [...savedResumes.filter((r) => r.id !== savedResume.id), savedResume]
      localStorage.setItem(SAVED_RESUMES_KEY, JSON.stringify(updated))
      setSavedResumes(updated)

      const updatedResume = { ...resume, name }
      saveDraft(updatedResume)

      toast.success("Resume saved", {
        description: `"${name}" has been saved to your library.`,
      })
      return true
    } catch (error) {
      console.error("Failed to save resume:", error)
      if (error instanceof Error && error.name === "QuotaExceededError") {
        toast.error("Storage quota exceeded", {
          description: "Your browser storage is full. Please delete some old resumes.",
        })
      } else {
        toast.error("Failed to save resume", {
          description: "There was an error saving your resume.",
        })
      }
      return false
    }
  }

  const deleteResume = (id: string) => {
    try {
      const updated = savedResumes.filter((r) => r.id !== id)
      localStorage.setItem(SAVED_RESUMES_KEY, JSON.stringify(updated))
      setSavedResumes(updated)
      toast.success("Resume deleted", {
        description: "The resume has been removed from your library.",
      })
    } catch (error) {
      console.error("Failed to delete resume:", error)
      toast.error("Failed to delete resume", {
        description: "There was an error deleting the resume.",
      })
    }
  }

  const loadResume = (resume: Resume) => {
    saveDraft(resume)
  }

  const updateResumeName = (id: string, newName: string) => {
    try {
      const updated = savedResumes.map((r) =>
        r.id === id
          ? {
              ...r,
              name: newName,
              data: { ...r.data, name: newName, updatedAt: new Date().toISOString() },
            }
          : r,
      )
      localStorage.setItem(SAVED_RESUMES_KEY, JSON.stringify(updated))
      setSavedResumes(updated)

      // Update draft if it's the current resume
      if (draft?.id === id) {
        saveDraft({ ...draft, name: newName })
      }

      toast.success("Resume renamed", {
        description: `Resume renamed to "${newName}".`,
      })
      return true
    } catch (error) {
      console.error("Failed to rename resume:", error)
      toast.error("Failed to rename resume", {
        description: "There was an error renaming the resume.",
      })
      return false
    }
  }

  // Export resume to JSON
  const exportResume = (resume: Resume) => {
    try {
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        resume: resume,
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${resume.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Resume exported successfully", {
        description: `Your resume "${resume.name}" has been downloaded as a JSON file.`,
      })

      return true
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Export failed", {
        description: "There was an error exporting your resume. Please try again.",
      })
      return false
    }
  }

  // Import resume from JSON
  const importResume = (file: File): Promise<Resume | null> => {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const importData = JSON.parse(content)

            // Validate import data structure
            if (!importData.resume || !importData.resume.name || !importData.resume.sections) {
              toast.error("Invalid file format", {
                description: "The selected file is not a valid resume export.",
              })
              resolve(null)
              return
            }

            // Ensure the imported resume has the correct structure
            const importedResume: Resume = {
              ...importData.resume,
              id: crypto.randomUUID(), // Generate new ID to avoid conflicts
              updatedAt: new Date().toISOString(),
            }

            toast.success("Resume imported successfully", {
              description: `Resume "${importedResume.name}" has been imported.`,
            })

            resolve(importedResume)
          } catch (parseError) {
            console.error("Parse error:", parseError)
            toast.error("Import failed", {
              description: "The selected file could not be parsed. Please ensure it's a valid JSON file.",
            })
            resolve(null)
          }
        }

        reader.onerror = () => {
          toast.error("Import failed", {
            description: "There was an error reading the selected file.",
          })
          resolve(null)
        }

        reader.readAsText(file)
      } catch (error) {
        console.error("Import error:", error)
        toast.error("Import failed", {
          description: "An unexpected error occurred during import.",
        })
        resolve(null)
      }
    })
  }

  return {
    draft,
    savedResumes,
    isLoaded,
    saveDraft,
    saveToAccount,
    deleteResume,
    loadResume,
    updateResumeName,
    exportResume,
    importResume,
  }
}
