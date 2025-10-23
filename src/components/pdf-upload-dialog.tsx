"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Loader2, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Resume } from "@/lib/types/resume"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useResumeStorage } from "@/lib/hooks/use-resume-storage"

type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error'

export function PdfUploadDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const router = useRouter()
  const { saveToAccount } = useResumeStorage()

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        setFile(null)
        toast.error("Invalid file type", {
          description: "Please select a valid PDF file.",
        })
        return
      }

      // Validate file size (10MB limit for better UX)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (selectedFile.size > maxSize) {
        setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
        setFile(null)
        toast.error("File too large", {
          description: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB. Consider compressing your PDF.`,
        })
        return
      }

      // Enhanced filename security validation
      const fileName = selectedFile.name

      // Check for dangerous patterns
      const dangerousPatterns = [
        '../', '..\\', '../', '..\\', // Directory traversal
        '<script', '</script>', 'javascript:', 'vbscript:', // XSS
        'eval(', 'setTimeout(', 'setInterval(', // Code execution
        'document.', 'window.', 'global.', // Global object access
        '__proto__', 'constructor', 'prototype', // Prototype pollution
        '<iframe', '<object', '<embed', '<form', // HTML injection
        'data:', 'blob:', 'file:', // Dangerous protocols
      ]

      const fileNameLower = fileName.toLowerCase()
      const hasDangerousPatterns = dangerousPatterns.some(pattern =>
        fileNameLower.includes(pattern.toLowerCase())
      )

      if (hasDangerousPatterns || !fileNameLower.endsWith('.pdf')) {
        setError("Invalid filename")
        setFile(null)
        toast.error("Invalid filename", {
          description: "Please select a valid PDF file with a standard filename without special characters.",
        })
        return
      }

      // Additional filename checks
      if (fileName.length > 255 || !/^[\w\-.\s()]+\.pdf$/i.test(fileName)) {
        setError("Invalid filename format")
        setFile(null)
        toast.error("Invalid filename format", {
          description: "Filename must be less than 255 characters and contain only letters, numbers, spaces, and basic punctuation.",
        })
        return
      }

      setFile(selectedFile)
      setError(null)
      setUploadStatus('idle')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadStatus('uploading')

    try {
      // Convert PDF to base64 with timeout and better error handling
      const reader = new FileReader()

      const base64Promise = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reader.abort()
          reject(new Error("File reading timed out. Please try a smaller file."))
        }, 30000) // 30 second timeout

        reader.onload = (e) => {
          clearTimeout(timeout)
          const base64 = e.target?.result as string
          if (!base64 || typeof base64 !== 'string') {
            reject(new Error("Failed to read file content"))
            return
          }

          const base64Data = base64.split(",")[1]
          if (!base64Data) {
            reject(new Error("Invalid file format"))
            return
          }

          resolve(base64Data)
        }

        reader.onerror = () => {
          clearTimeout(timeout)
          reject(new Error("Failed to read file"))
        }

        reader.onabort = () => {
          clearTimeout(timeout)
          reject(new Error("File reading was cancelled"))
        }
      })

      reader.readAsDataURL(file)
      const base64Data = await base64Promise

      // Call API to parse resume with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: {
            data: base64Data,
            mediaType: "application/pdf",
            filename: file.name,
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to parse resume",
          message: "Please try uploading a different resume file."
        }))

        let errorMessage = errorData.error || `Server error: ${response.status}`

        // Provide more specific error messages
        if (response.status === 503) {
          errorMessage = "PDF parsing service is temporarily unavailable. Please try again later."
        } else if (response.status === 422) {
          errorMessage = "Unable to extract readable text from the PDF. Please ensure the PDF contains text content and isn't just images."
        } else if (response.status === 413) {
          errorMessage = "The uploaded file is too large. Please try a smaller file under 10MB."
        }

        throw new Error(errorMessage)
      }

      const responseData = await response.json()

      if (!responseData || !responseData.resumeData) {
        throw new Error("No resume data could be extracted from the PDF. The file may be corrupted or contain no readable text.")
      }

      const resumeData = responseData.resumeData

      if (!resumeData || !resumeData.personalInfo || !resumeData.personalInfo.name) {
        throw new Error("Could not extract basic personal information from the PDF. Please ensure the resume contains your name contact details.")
      }

      // Convert parsed data to our Resume format
      const baseName = `${resumeData.personalInfo.name}'s Resume`
      // Ensure unique name by checking existing resumes
      let resumeName = baseName
      let counter = 1

      // Check if we have access to saved resumes to avoid duplicates
      try {
        const savedResumesData = localStorage.getItem("saved-resumes")
        if (savedResumesData) {
          const savedResumes = JSON.parse(savedResumesData)
          while (savedResumes.some((r: any) => r.name === resumeName)) {
            resumeName = `${baseName} (${counter})`
            counter++
          }
        }
      } catch (error) {
        // If we can't check existing names, just add a timestamp to ensure uniqueness
        resumeName = `${baseName} - ${new Date().toLocaleDateString()}`
      }

      const newResume: Resume = {
        id: crypto.randomUUID(),
        name: resumeName,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add header section
      if (resumeData.personalInfo) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "header",
          title: "Header",
          visible: true,
          order: 0,
          schemaId: "schema_header",
          content: {
            schemaId: "schema_header",
            fieldValues: {
              name: resumeData.personalInfo.name || "",
              email: resumeData.personalInfo.email || "",
              phone: resumeData.personalInfo.phone || "",
              location: resumeData.personalInfo.location || "",
              website: resumeData.personalInfo.website || "",
              linkedin: resumeData.personalInfo.linkedin || "",
              github: resumeData.personalInfo.github || "",
            },
            groupEntries: {},
          },
        })
      }

      // Add summary section
      if (resumeData.summary) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "summary",
          title: "Professional Summary",
          visible: true,
          order: 1,
          schemaId: "schema_summary",
          content: {
            schemaId: "schema_summary",
            fieldValues: {
              text: resumeData.summary,
            },
            groupEntries: {},
          },
        })
      }

      // Add work experience
      if (Array.isArray(resumeData.workExperience) && resumeData.workExperience.length > 0) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "experience",
          title: "Work Experience",
          visible: true,
          order: 2,
          schemaId: "schema_experience",
          content: {
            schemaId: "schema_experience",
            fieldValues: {},
            groupEntries: {
              items: resumeData.workExperience.map((exp: any) => ({
                id: crypto.randomUUID(),
                values: {
                  position: exp.title || "",
                  company: exp.company || "",
                  location: exp.location || "",
                  startDate: exp.startDate ? { value: exp.startDate, precision: "month" } : undefined,
                  endDate: exp.endDate ? { value: exp.endDate, precision: "month" } : undefined,
                  current: exp.current || false,
                  description: exp.description ? [exp.description] : [],
                },
              })),
            },
          },
        })
      }

      // Add education
      if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "education",
          title: "Education",
          visible: true,
          order: 3,
          schemaId: "schema_education",
          content: {
            schemaId: "schema_education",
            fieldValues: {},
            groupEntries: {
              items: resumeData.education.map((edu: any) => ({
                id: crypto.randomUUID(),
                values: {
                  degree: edu.degree || "",
                  institution: edu.institution || "",
                  field: edu.field || edu.major || "",
                  location: edu.location || "",
                  startDate: edu.startDate ? { value: edu.startDate, precision: "year" } : undefined,
                  endDate: edu.endDate ? { value: edu.endDate, precision: "year" } : undefined,
                  gpa: edu.gpa || "",
                },
              })),
            },
          },
        })
      }

      // Add skills
      if (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "skills",
          title: "Skills",
          visible: true,
          order: 4,
          schemaId: "schema_skills",
          content: {
            schemaId: "schema_skills",
            fieldValues: {},
            groupEntries: {
              categories: [{
                id: crypto.randomUUID(),
                values: {
                  name: "Technical Skills",
                  skills: resumeData.skills.filter((skill: any) => skill && typeof skill === 'string')
                }
              }]
            },
          },
        })
      }

      // Add projects section if available
      if (Array.isArray(resumeData.projects) && resumeData.projects.length > 0) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "projects",
          title: "Projects",
          visible: true,
          order: 5,
          schemaId: "schema_projects",
          content: {
            schemaId: "schema_projects",
            fieldValues: {},
            groupEntries: {
              items: resumeData.projects.map((project: any) => ({
                id: crypto.randomUUID(),
                values: {
                  name: project.name || "",
                  description: project.description || "",
                  technologies: Array.isArray(project.technologies) ? project.technologies : [],
                  url: project.url || "",
                },
              })),
            },
          },
        })
      }

      // Add certifications section if available
      if (Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0) {
        newResume.sections.push({
          id: crypto.randomUUID(),
          type: "certifications",
          title: "Certifications",
          visible: true,
          order: 6,
          schemaId: "schema_certifications",
          content: {
            schemaId: "schema_certifications",
            fieldValues: {},
            groupEntries: {
              items: resumeData.certifications.map((cert: any) => ({
                id: crypto.randomUUID(),
                values: {
                  name: cert.name || "",
                  issuer: cert.issuer || "",
                  date: cert.date || "",
                },
              })),
            },
          },
        })
      }

      // Calculate parsing quality feedback
      const extractedSections = []
      if (resumeData.personalInfo && Object.keys(resumeData.personalInfo).length > 1) extractedSections.push("contact info")
      if (resumeData.summary) extractedSections.push("summary")
      if (Array.isArray(resumeData.workExperience) && resumeData.workExperience.length > 0) extractedSections.push(`${resumeData.workExperience.length} work experience`)
      if (Array.isArray(resumeData.education) && resumeData.education.length > 0) extractedSections.push(`${resumeData.education.length} education`)
      if (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) extractedSections.push(`${resumeData.skills.length} skills`)
      if (Array.isArray(resumeData.projects) && resumeData.projects.length > 0) extractedSections.push(`${resumeData.projects.length} projects`)
      if (Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0) extractedSections.push(`${resumeData.certifications.length} certifications`)

      // Save the new resume using the storage hook
      const success = saveToAccount(newResume, resumeName)

      if (success) {
        setUploadStatus('completed')

        toast.success("Resume imported successfully!", {
          description: `Extracted ${extractedSections.join(", ")}. Please review and edit for accuracy.`,
        })

        // Redirect to editor with the new resume ID after a brief delay
        setTimeout(() => {
          router.push(`/editor?resumeId=${newResume.id}`)
          setIsOpen(false)
        }, 1500)
      } else {
        throw new Error("Failed to save the imported resume")
      }
    } catch (error) {
      console.error("Failed to parse resume:", error)
      setUploadStatus('error')
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      toast.error("Failed to import resume", {
        description: errorMessage,
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Simple status indicator
  const StatusIndicator = () => {
    if (uploadStatus === 'idle') return null

    return (
      <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/30">
        {uploadStatus === 'completed' ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Resume imported successfully!</span>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Import failed</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Importing resume...</span>
          </div>
        )}
      </div>
    )
  }

  // Reset upload state when dialog is closed
  const handleDialogClose = (open: boolean) => {
    if (!open && !isUploading) {
      setUploadStatus('idle')
      setError(null)
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40">
          <Upload className="h-5 w-5 text-primary" />
          Import from PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Resume from PDF</DialogTitle>
          <DialogDescription>
            Upload your existing resume PDF and we'll extract the information using AI
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && uploadStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-12 h-12 mb-4 text-primary" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF files only (max 10MB)</p>
                {file && <p className="mt-2 text-sm font-medium text-primary">{file.name}</p>}
              </div>
              <input
                id="pdf-upload"
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
                aria-label="Upload resume PDF file"
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Simple status indicator */}
          <StatusIndicator />

          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Resume...
              </>
            ) : (
              "Import Resume"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
