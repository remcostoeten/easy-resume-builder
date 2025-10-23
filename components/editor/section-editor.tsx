"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, Settings, Copy, ChevronDown, ChevronUp, GripVertical, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DynamicField } from "./dynamic-field"
import { LazyFieldManager, LazySectionAIAssistant } from "./lazy-components"
import type { ResumeSection, EntryData, FieldValue, FieldChange } from "@/lib/types/resume"
import { getSchemaById } from "@/lib/schemas/default-schemas"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "sonner"

interface SectionEditorProps {
  section: ResumeSection
  onUpdate: (section: ResumeSection) => void
  scrollToEntryId?: string
  autoFocusFirstField?: boolean
}

function SortableEntryCard({
  entry,
  index,
  groupName,
  groupLabel,
  schema,
  onUpdate,
  onDelete,
  onDuplicate,
  entryRef,
}: {
  entry: EntryData
  index: number
  groupName: string
  groupLabel: string
  schema: any
  onUpdate: (fieldName: string, value: FieldValue) => void
  onDelete: () => void
  onDuplicate: () => void
  entryRef?: React.RefObject<HTMLDivElement>
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: entry.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const group = schema.repeatableGroups.find((g: any) => g.name === groupName)

  return (
    <Card ref={setNodeRef} style={style} className="overflow-hidden" data-entry-id={entry.id}>
      <div ref={entryRef} className="flex items-center gap-2 border-b border-border bg-muted/30 p-3">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <h4 className="flex-1 font-semibold text-foreground">
          {groupLabel} #{index + 1}
        </h4>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onDuplicate} className="h-8 w-8">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4 p-4">
          {group?.fields
            .sort((a: any, b: any) => a.order - b.order)
            .map((field: any) => (
              <DynamicField
                key={field.id}
                field={field}
                value={entry.values[field.name]}
                onChange={(value) => onUpdate(field.name, value)}
              />
            ))}
        </div>
      )}
    </Card>
  )
}

export function SectionEditor({
  section,
  onUpdate,
  scrollToEntryId,
  autoFocusFirstField,
}: SectionEditorProps & { scrollToEntryId?: string; autoFocusFirstField?: boolean }) {
  const schema = getSchemaById(section.schemaId)
  const [isManagingFields, setIsManagingFields] = useState(false)
  const [previousContent, setPreviousContent] = useState<typeof section.content | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(section.title)

  // Sync edited title when section changes
  useEffect(() => {
    setEditedTitle(section.title)
  }, [section.title])

  // Auto-focus the first field when requested
  useEffect(() => {
    if (autoFocusFirstField && schema && schema.fields.length > 0) {
      const firstField = schema.fields.sort((a, b) => a.order - b.order)[0]
      if (firstField) {
        setTimeout(() => {
          const firstInput = document.querySelector(
            `[data-field-name="${firstField.name}"][data-section-id="${section.id}"]`
          )
          if (firstInput instanceof HTMLElement) {
            firstInput.focus()
          }
        }, 100)
      }
    }
  }, [autoFocusFirstField, schema, section.id])

  if (!schema) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-muted-foreground">Schema not found for this section.</p>
      </div>
    )
  }

  const updateFieldValue = (fieldName: string, value: FieldValue) => {
    onUpdate({
      ...section,
      content: {
        ...section.content,
        fieldValues: {
          ...section.content.fieldValues,
          [fieldName]: value,
        },
      },
    })
  }

  const addGroupEntry = (groupName: string) => {
    const group = schema.repeatableGroups.find((g) => g.name === groupName)
    if (!group) return

    const newEntry: EntryData = {
      id: crypto.randomUUID(),
      values: {},
    }

    group.fields.forEach((field) => {
      newEntry.values[field.name] = field.defaultValue ?? null
    })

    const currentEntries = section.content.groupEntries[groupName] || []

    onUpdate({
      ...section,
      content: {
        ...section.content,
        groupEntries: {
          ...section.content.groupEntries,
          [groupName]: [...currentEntries, newEntry],
        },
      },
    })
  }

  const duplicateGroupEntry = (groupName: string, entryId: string) => {
    const currentEntries = section.content.groupEntries[groupName] || []
    const entryToDuplicate = currentEntries.find((e) => e.id === entryId)

    if (!entryToDuplicate) return

    const duplicatedEntry: EntryData = {
      id: crypto.randomUUID(),
      values: { ...entryToDuplicate.values },
    }

    onUpdate({
      ...section,
      content: {
        ...section.content,
        groupEntries: {
          ...section.content.groupEntries,
          [groupName]: [...currentEntries, duplicatedEntry],
        },
      },
    })

    const group = schema?.repeatableGroups.find((g) => g.name === groupName)
    toast.success("Entry duplicated", {
      description: `${group?.label || "Entry"} has been duplicated successfully.`,
    })
  }

  const updateGroupEntry = (groupName: string, entryId: string, fieldName: string, value: FieldValue) => {
    const currentEntries = section.content.groupEntries[groupName] || []

    onUpdate({
      ...section,
      content: {
        ...section.content,
        groupEntries: {
          ...section.content.groupEntries,
          [groupName]: currentEntries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  values: {
                    ...entry.values,
                    [fieldName]: value,
                  },
                }
              : entry,
          ),
        },
      },
    })
  }

  const deleteGroupEntry = (groupName: string, entryId: string) => {
    const currentEntries = section.content.groupEntries[groupName] || []

    onUpdate({
      ...section,
      content: {
        ...section.content,
        groupEntries: {
          ...section.content.groupEntries,
          [groupName]: currentEntries.filter((entry) => entry.id !== entryId),
        },
      },
    })
  }

  const handleEntryDragEnd = (groupName: string) => (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const currentEntries = section.content.groupEntries[groupName] || []
    const oldIndex = currentEntries.findIndex((e) => e.id === active.id)
    const newIndex = currentEntries.findIndex((e) => e.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newEntries = [...currentEntries]
    const [movedEntry] = newEntries.splice(oldIndex, 1)
    newEntries.splice(newIndex, 0, movedEntry)

    onUpdate({
      ...section,
      content: {
        ...section.content,
        groupEntries: {
          ...section.content.groupEntries,
          [groupName]: newEntries,
        },
      },
    })
  }

  const handleApplyAIChanges = (changes: FieldChange[]) => {
    setPreviousContent(section.content)

    const newContent = { ...section.content }

    changes.forEach((change) => {
      const pathParts = change.fieldPath.split(".")

      if (pathParts[0] === "fieldValues") {
        const fieldName = pathParts[1]
        newContent.fieldValues = {
          ...newContent.fieldValues,
          [fieldName]: change.suggested,
        }
      } else if (pathParts[0] === "groupEntries") {
        const groupName = pathParts[1]
        const entryIndex = Number.parseInt(pathParts[2])
        const fieldName = pathParts[4]

        const entries = [...(newContent.groupEntries[groupName] || [])]
        if (entries[entryIndex]) {
          entries[entryIndex] = {
            ...entries[entryIndex],
            values: {
              ...entries[entryIndex].values,
              [fieldName]: change.suggested,
            },
          }
          newContent.groupEntries = {
            ...newContent.groupEntries,
            [groupName]: entries,
          }
        }
      }
    })

    onUpdate({
      ...section,
      content: newContent,
    })
  }

  const handleRevertAIChanges = () => {
    if (previousContent) {
      onUpdate({
        ...section,
        content: previousContent,
      })
      setPreviousContent(null)
      toast.success("Changes reverted", {
        description: "AI changes have been reverted successfully.",
      })
    }
  }

  const handleTitleEdit = () => {
    setIsEditingTitle(true)
  }

  const handleTitleChange = (newTitle: string) => {
    setEditedTitle(newTitle)
  }

  const handleTitleSave = () => {
    if (editedTitle.trim() !== section.title) {
      onUpdate({
        ...section,
        title: editedTitle.trim() || schema.displayName,
      })
      toast.success("Section title updated")
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setEditedTitle(section.title)
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave()
    } else if (e.key === "Escape") {
      handleTitleCancel()
    }
  }

  return (
    <div className="mx-auto max-w-3xl" data-section-id={section.id}>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="text-2xl font-bold text-foreground h-auto py-1"
                placeholder="Section title"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTitleCancel}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          ) : (
            <h2
              className="text-2xl font-bold text-foreground cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={handleTitleEdit}
              title="Click to edit title"
            >
              {section.title}
            </h2>
          )}
          <p className="text-sm text-muted-foreground">Edit the content for this section</p>
        </div>
        <div className="flex gap-2">
          {previousContent && (
            <Button variant="outline" size="sm" onClick={handleRevertAIChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Revert AI Changes
            </Button>
          )}
          <LazySectionAIAssistant
            sectionContent={section.content}
            sectionTitle={section.title}
            schema={schema}
            onApplyChanges={handleApplyAIChanges}
          />
          <Dialog open={isManagingFields} onOpenChange={setIsManagingFields}>
            <Button variant="outline" size="sm" onClick={() => setIsManagingFields(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Customize Fields
            </Button>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Customize Section Fields</DialogTitle>
              </DialogHeader>
              <LazyFieldManager schema={schema} onSchemaUpdate={() => {}} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {schema.fields.length > 0 && (
          <Card className="p-4">
            <div className="space-y-4">
              {schema.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <DynamicField
                    key={field.id}
                    field={field}
                    value={section.content.fieldValues[field.name]}
                    onChange={(value) => updateFieldValue(field.name, value)}
                    sectionId={section.id}
                    fieldName={field.name}
                  />
                ))}
            </div>
          </Card>
        )}

        {schema.repeatableGroups.map((group) => {
          const entries = section.content.groupEntries[group.name] || []

          return (
            <div key={group.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{group.label}s</h3>
              </div>

              <DndContext collisionDetection={closestCenter} onDragEnd={handleEntryDragEnd(group.name)}>
                <SortableContext items={entries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {entries.map((entry, index) => (
                      <SortableEntryCard
                        key={entry.id}
                        entry={entry}
                        index={index}
                        groupName={group.name}
                        groupLabel={group.label}
                        schema={schema}
                        onUpdate={(fieldName, value) => updateGroupEntry(group.name, entry.id, fieldName, value)}
                        onDelete={() => deleteGroupEntry(group.name, entry.id)}
                        onDuplicate={() => duplicateGroupEntry(group.name, entry.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <Button onClick={() => addGroupEntry(group.name)} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add {group.label}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
