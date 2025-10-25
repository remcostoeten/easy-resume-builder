"use client"

import type React from "react"
import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  User,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ResumeSection, EntryData } from "@/lib/types/resume"
import { getSchemaById } from "@/lib/schemas/default-schemas"

interface LayersPanelProps {
  sections: ResumeSection[]
  selectedSectionId: string | null
  selectedEntryId?: string | null
  onSectionSelect: (sectionId: string) => void
  onSectionToggle: (sectionId: string) => void
  onSectionDelete: (sectionId: string) => void
  onSectionUpdate?: (sectionId: string, updates: Partial<ResumeSection>) => void
  onEntrySelect?: (sectionId: string, entryId: string) => void
  onEntryDelete?: (sectionId: string, groupName: string, entryId: string) => void
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  header: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code,
  projects: Award,
}

function getSectionIcon(section: ResumeSection) {
  const schemaId = section.schemaId.toLowerCase()
  for (const [key, Icon] of Object.entries(sectionIcons)) {
    if (schemaId.includes(key)) return Icon
  }
  return FileText
}

function getSectionEntryCount(section: ResumeSection): number {
  const entries = Object.values(section.content.groupEntries).flat()
  return entries.length
}

function getEntryPreview(entry: EntryData, schema: any, groupName: string): string {
  const group = schema?.repeatableGroups.find((g: any) => g.name === groupName)
  if (!group) return "Entry"

  // Get the first text field value as preview
  const firstField = group.fields.find((f: any) => f.type === "text" || f.type === "textarea")
  if (firstField && entry.values[firstField.name]) {
    const value = entry.values[firstField.name]
    if (typeof value === "string") {
      return value.length > 30 ? value.substring(0, 30) + "..." : value
    }
  }

  return `${group.label}`
}

export function LayersPanel({
  sections,
  selectedSectionId,
  selectedEntryId,
  onSectionSelect,
  onSectionToggle,
  onSectionDelete,
  onSectionUpdate,
  onEntrySelect,
  onEntryDelete,
}: LayersPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const visibleCount = (sections || []).filter((s) => s.visible).length
  const totalCount = (sections || []).length

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const handleTitleEdit = (section: ResumeSection) => {
    setEditingSectionId(section.id)
    setEditingTitle(section.title)
  }

  const handleTitleChange = (newTitle: string) => {
    setEditingTitle(newTitle)
  }

  const handleTitleSave = (sectionId: string) => {
    if (onSectionUpdate && editingTitle.trim()) {
      const section = sections.find(s => s.id === sectionId)
      if (section && editingTitle.trim() !== section.title) {
        onSectionUpdate(sectionId, { title: editingTitle.trim() })
      }
    }
    setEditingSectionId(null)
    setEditingTitle("")
  }

  const handleTitleCancel = () => {
    setEditingSectionId(null)
    setEditingTitle("")
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleTitleSave(sectionId)
    } else if (e.key === "Escape") {
      handleTitleCancel()
    }
  }

  return (
    <div className="flex h-full max-w-full flex-col bg-card">
      <div className="border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-card-foreground">Sections</h2>
            <p className="text-xs text-muted-foreground">Drag to reorder</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {visibleCount}/{totalCount}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1.5 px-2 py-2">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            const entryCount = getSectionEntryCount(section)
            const hasEntries = entryCount > 0

            return (
              <div key={section.id}>
                <LayerItem
                  section={section}
                  isSelected={section.id === selectedSectionId}
                  isExpanded={isExpanded}
                  hasEntries={hasEntries}
                  entryCount={entryCount}
                  editingSectionId={editingSectionId}
                  editingTitle={editingTitle}
                  onSelect={() => onSectionSelect(section.id)}
                  onToggle={() => onSectionToggle(section.id)}
                  onDelete={() => onSectionDelete(section.id)}
                  onToggleExpand={() => toggleSectionExpand(section.id)}
                  onTitleEdit={handleTitleEdit}
                  onTitleChange={handleTitleChange}
                  onTitleSave={handleTitleSave}
                  onTitleKeyDown={handleTitleKeyDown}
                />

                {isExpanded && hasEntries && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-border/50 pl-2">
                    {Object.entries(section.content.groupEntries).map(([groupName, entries]) =>
                      entries.map((entry, index) => (
                        <EntryItem
                          key={entry.id}
                          entry={entry}
                          index={index}
                          section={section}
                          groupName={groupName}
                          isSelected={selectedEntryId === entry.id}
                          onSelect={() => onEntrySelect?.(section.id, entry.id)}
                          onDelete={() => onEntryDelete?.(section.id, groupName, entry.id)}
                        />
                      )),
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-muted/20 px-3 py-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Tip:</span> Hide sections to exclude them from your resume
        </p>
      </div>
    </div>
  )
}

interface LayerItemProps {
  section: ResumeSection
  isSelected: boolean
  isExpanded: boolean
  hasEntries: boolean
  entryCount: number
  editingSectionId: string | null
  editingTitle: string
  onSelect: () => void
  onToggle: () => void
  onDelete: () => void
  onToggleExpand: () => void
  onTitleEdit: (section: ResumeSection) => void
  onTitleChange: (newTitle: string) => void
  onTitleSave: (sectionId: string) => void
  onTitleKeyDown: (e: React.KeyboardEvent, sectionId: string) => void
}

function LayerItem({
  section,
  isSelected,
  isExpanded,
  hasEntries,
  entryCount,
  editingSectionId,
  editingTitle,
  onSelect,
  onToggle,
  onDelete,
  onToggleExpand,
  onTitleEdit,
  onTitleChange,
  onTitleSave,
  onTitleKeyDown,
}: LayerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = getSectionIcon(section)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center gap-2 rounded-lg border px-2 py-2 transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/30 hover:bg-accent/50 cursor-pointer",
        isDragging && "opacity-50 shadow-lg",
        !section.visible && "opacity-60",
        "min-w-0 max-w-full",
      )}
      onClick={(e) => {
        // Don't select if clicking on interactive elements
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        if (editingSectionId !== section.id) {
          onSelect()
        }
      }}
    >
      {hasEntries && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      )}

      <button
        type="button"
        className={cn(
          "cursor-grab touch-none text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing",
          isSelected && "text-primary",
          !hasEntries && "ml-5",
        )}
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
          isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left overflow-hidden">
        {editingSectionId === section.id ? (
          <Input
            value={editingTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => onTitleSave(section.id)}
            onKeyDown={(e) => onTitleKeyDown(e, section.id)}
            className="h-6 text-sm font-medium px-1 py-0 border-none shadow-none bg-transparent focus-visible:ring-0"
            placeholder="Section title"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={cn(
              "truncate text-sm font-medium transition-colors cursor-text hover:text-primary",
              isSelected ? "text-primary" : "text-card-foreground",
            )}
            onClick={(e) => {
              e.stopPropagation()
              onTitleEdit(section)
            }}
            title="Click to edit title"
          >
            {section.title}
          </span>
        )}
        {entryCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {entryCount} {entryCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7 transition-all", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
        >
          {section.visible ? (
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-destructive transition-all hover:bg-destructive/10",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isSelected && <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
    </div>
  )
}

interface EntryItemProps {
  entry: EntryData
  index: number
  section: ResumeSection
  groupName: string
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function EntryItem({ entry, index, section, groupName, isSelected, onSelect, onDelete }: EntryItemProps) {
  const schema = getSchemaById(section.schemaId)
  const preview = getEntryPreview(entry, schema, groupName)
  const group = schema?.repeatableGroups.find((g: any) => g.name === groupName)

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md border px-2 py-1.5 transition-all",
        isSelected
          ? "border-primary/50 bg-primary/5 shadow-sm"
          : "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-accent/30",
        "min-w-0 max-w-full",
      )}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted/50 text-xs font-medium text-muted-foreground">
        {index + 1}
      </div>

      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 flex-col items-start text-left overflow-hidden">
        <span className={cn("truncate text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
          {preview}
        </span>
        <span className="truncate text-[10px] text-muted-foreground">{group?.label}</span>
      </button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6 shrink-0 text-destructive transition-all hover:bg-destructive/10",
          "opacity-0 group-hover:opacity-100",
        )}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
