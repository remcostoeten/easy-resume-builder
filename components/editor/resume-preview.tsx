"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ZoomIn, ZoomOut, Download, Maximize2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Resume, ResumeSection, DateValue, FieldValue } from "@/lib/types/resume"
import type { ResumeStyle } from "./style-panel"
import { getSchemaById } from "@/lib/schemas/default-schemas"
import { formatDateForDisplay } from "./flexible-date-picker"

interface ResumePreviewProps {
  resume: Resume
  showToolbar?: boolean
  style?: ResumeStyle
}

export function ResumePreview({ resume, showToolbar = true, style }: ResumePreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [isExporting, setIsExporting] = useState(false)
  const visibleSections = (resume.sections || []).filter((s) => s.visible).sort((a, b) => a.order - b.order)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))
  const handleDownload = async () => {
    if (isExporting) return

    setIsExporting(true)
    try {
      const { exportToPDF } = await import("@/lib/utils/pdf-export")
      await exportToPDF(`${resume.name || 'Resume'}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error("PDF export failed:", error)
      // Error is already handled in the exportToPDF function with user-friendly messages
    } finally {
      setIsExporting(false)
    }
  }

  const getFontFamily = () => {
    if (!style) return "font-sans"
    switch (style.fontFamily) {
      case "serif":
        return "font-serif"
      case "mono":
        return "font-mono"
      default:
        return "font-sans"
    }
  }

  const getSpacingClass = () => {
    if (!style) return "p-12"
    switch (style.spacing) {
      case "compact":
        return "p-8"
      case "spacious":
        return "p-16"
      default:
        return "p-12"
    }
  }

  const fontSize = style?.fontSize || 12

  return (
    <div className="flex h-full flex-col">
      {showToolbar && (
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground">{zoom}%</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 150}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="mx-1 h-4 w-px bg-border" />
            <Button variant="ghost" size="sm" onClick={() => setZoom(100)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <div className="mx-1 h-4 w-px bg-border" />
            <Button variant="ghost" size="sm" onClick={handleDownload} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="ml-2 text-xs">
                {isExporting ? "Exporting..." : "Export PDF"}
              </span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-muted/50 p-8">
        <div
          className="mx-auto origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div
            className={`mx-auto w-full max-w-[210mm] bg-white text-black shadow-2xl ring-1 ring-black/5 print:shadow-none print:ring-0 ${getFontFamily()} ${getSpacingClass()}`}
            id="resume-preview"
            style={{ fontSize: `${fontSize}px` }}
          >
            {visibleSections.map((section) => (
              <SectionPreview key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionPreview({ section }: { section: ResumeSection }) {
  const schema = getSchemaById(section.schemaId)
  if (!schema) return null

  if (schema.name === "header") {
    return <HeaderPreview section={section} />
  }

  if (schema.name === "summary") {
    return <SummaryPreview section={section} />
  }

  if (schema.repeatableGroups.length > 0) {
    return <RepeatableGroupPreview section={section} schema={schema} />
  }

  return <DirectFieldsPreview section={section} schema={schema} />
}

function HeaderPreview({ section }: { section: ResumeSection }) {
  const { fieldValues } = section.content
  const avatar = fieldValues.avatar as string
  const name = fieldValues.name as string
  const title = fieldValues.title as string
  const email = fieldValues.email as string
  const phone = fieldValues.phone as string
  const location = fieldValues.location as string
  const website = fieldValues.website as string
  const linkedin = fieldValues.linkedin as string
  const github = fieldValues.github as string

  return (
    <div className="mb-6 border-b-2 border-black pb-4">
      <div className="flex items-start gap-4">
        {avatar && (
          <img
            src={avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="mb-1 text-3xl font-bold">{name || "Your Name"}</h1>
          {title && <p className="mb-3 text-lg text-gray-700">{title}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        {email && (
          <div className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            <span>{phone}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span>{website}</span>
          </div>
        )}
        {linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-3.5 w-3.5" />
            <span>{linkedin}</span>
          </div>
        )}
        {github && (
          <div className="flex items-center gap-1">
            <Github className="h-3.5 w-3.5" />
            <span>{github}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryPreview({ section }: { section: ResumeSection }) {
  const { fieldValues } = section.content
  const text = fieldValues.text as string

  if (!text) return null

  return (
    <div className="mb-5">
      <h2 className="mb-2 border-b border-gray-300 text-lg font-bold uppercase tracking-wide">{section.title}</h2>
      <p className="text-sm leading-relaxed text-gray-800">{text}</p>
    </div>
  )
}

function DirectFieldsPreview({ section, schema }: { section: ResumeSection; schema: any }) {
  const { fieldValues } = section.content
  const hasContent = Object.values(fieldValues).some((v) => v !== null && v !== "")

  if (!hasContent) return null

  return (
    <div className="mb-5">
      <h2 className="mb-2 border-b border-gray-300 text-lg font-bold uppercase tracking-wide">{section.title}</h2>
      <div className="space-y-2">
        {schema.fields.map((field: any) => {
          const value = fieldValues[field.name]
          if (!value) return null

          return (
            <div key={field.id}>
              <span className="font-semibold text-gray-700">{field.label}: </span>
              <span className="text-sm text-gray-800">{formatFieldValue(value, field.type)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RepeatableGroupPreview({ section, schema }: { section: ResumeSection; schema: any }) {
  const { groupEntries } = section.content

  const group = schema.repeatableGroups[0]
  if (!group) return null

  const entries = groupEntries[group.name] || []
  if (entries.length === 0) return null

  return (
    <div className="mb-5">
      <h2 className="mb-2 border-b border-gray-300 text-lg font-bold uppercase tracking-wide">{section.title}</h2>
      <div className="space-y-4">
        {entries.map((entry: any) => (
          <EntryPreview key={entry.id} entry={entry} fields={group.fields} schemaName={schema.name} />
        ))}
      </div>
    </div>
  )
}

function EntryPreview({ entry, fields, schemaName }: { entry: any; fields: any[]; schemaName: string }) {
  const values = entry.values

  if (schemaName === "experience") {
    return (
      <div>
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-black">{values.position || "Position"}</h3>
            <p className="text-sm font-semibold text-gray-700">{values.company || "Company"}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            {values.location && <p>{values.location}</p>}
            <p>
              {values.startDate && formatFieldValue(values.startDate, "date")} -{" "}
              {values.current ? "Present" : values.endDate ? formatFieldValue(values.endDate, "date") : ""}
            </p>
          </div>
        </div>
        {values.description && Array.isArray(values.description) && values.description.length > 0 && (
          <ul className="ml-4 list-disc space-y-1 text-sm text-gray-800">
            {values.description
              .filter((d: string) => d.trim())
              .map((desc: string, index: number) => (
                <li key={index}>{desc}</li>
              ))}
          </ul>
        )}
        {values.skills && Array.isArray(values.skills) && values.skills.length > 0 && (
          <p className="mt-2 text-xs text-gray-600">
            <span className="font-semibold">Skills: </span>
            {values.skills.join(" • ")}
          </p>
        )}
      </div>
    )
  }

  if (schemaName === "education") {
    return (
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-black">{values.institution || "Institution"}</h3>
            <p className="text-sm text-gray-700">
              {values.degree} {values.field && `in ${values.field}`}
              {values.gpa && ` - Grade: ${values.gpa}`}
            </p>
            {values.courses && Array.isArray(values.courses) && values.courses.length > 0 && (
              <p className="mt-1 text-xs text-gray-600">
                <span className="font-semibold">Relevant Courses: </span>
                {values.courses.join(", ")}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-gray-600">
            {values.location && <p>{values.location}</p>}
            <p>
              {values.startDate && formatFieldValue(values.startDate, "date")} -{" "}
              {values.current ? "Present" : values.endDate ? formatFieldValue(values.endDate, "date") : ""}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (schemaName === "skills") {
    return (
      <div className="flex gap-2">
        <span className="min-w-[120px] font-semibold text-gray-700">{values.name}:</span>
        <span className="text-sm text-gray-800">
          {Array.isArray(values.skills) ? values.skills.join(", ") : values.skills}
        </span>
      </div>
    )
  }

  if (schemaName === "projects") {
    return (
      <div>
        <div className="mb-1">
          <h3 className="font-bold text-black">
            {values.name || "Project Name"}
            {values.link && (
              <span className="ml-2 text-sm font-normal text-blue-600">
                <Globe className="inline h-3 w-3" /> {values.link}
              </span>
            )}
          </h3>
          {values.technologies && Array.isArray(values.technologies) && values.technologies.length > 0 && (
            <p className="text-xs text-gray-600">{values.technologies.join(" • ")}</p>
          )}
        </div>
        {values.description && <p className="text-sm text-gray-800">{values.description}</p>}
      </div>
    )
  }
    
  return (
    <div className="space-y-2">
      {fields.map((field: any) => {
        const value = values[field.name]
        if (!value || (Array.isArray(value) && value.length === 0)) return null

        return (
          <div key={field.id}>
            <span className="font-semibold text-gray-700">{field.label}: </span>
            <span className="text-sm text-gray-800">{formatFieldValue(value, field.type)}</span>
          </div>
        )
      })}
    </div>
  )
}

function formatFieldValue(value: FieldValue, fieldType: string): string {
  if (value === null || value === undefined) return ""

  if (fieldType === "date" && typeof value === "object" && "value" in value) {
    return formatDateForDisplay(value as DateValue)
  }

  if (Array.isArray(value)) {
    return value.join(", ")
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  return String(value)
}
