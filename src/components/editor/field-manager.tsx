"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type { FieldDefinition, FieldType, SectionSchema } from "@/lib/types/resume"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface FieldManagerProps {
  schema: SectionSchema
  onSchemaUpdate: (schema: SectionSchema) => void
  groupName?: string // If managing fields in a repeatable group
}

function SortableFieldItem({
  field,
  onEdit,
  onDelete,
}: {
  field: FieldDefinition
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{field.label}</div>
        <div className="text-xs text-muted-foreground">
          {field.type} {field.required && "• Required"}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Settings2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function FieldManager({ schema, onSchemaUpdate, groupName }: FieldManagerProps) {
  const [isAddingField, setIsAddingField] = useState(false)
  const [editingField, setEditingField] = useState<FieldDefinition | null>(null)

  const fields = groupName ? schema.repeatableGroups.find((g) => g.name === groupName)?.fields || [] : schema.fields

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newFields = [...fields]
    const [movedField] = newFields.splice(oldIndex, 1)
    newFields.splice(newIndex, 0, movedField)

    // Update order property
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index,
    }))

    updateFields(updatedFields)
  }

  const updateFields = (newFields: FieldDefinition[]) => {
    if (groupName) {
      const updatedGroups = schema.repeatableGroups.map((g) => (g.name === groupName ? { ...g, fields: newFields } : g))
      onSchemaUpdate({ ...schema, repeatableGroups: updatedGroups })
    } else {
      onSchemaUpdate({ ...schema, fields: newFields })
    }
  }

  const handleAddField = (field: FieldDefinition) => {
    const newFields = [...fields, { ...field, order: fields.length }]
    updateFields(newFields)
    setIsAddingField(false)
  }

  const handleEditField = (field: FieldDefinition) => {
    const newFields = fields.map((f) => (f.id === field.id ? field : f))
    updateFields(newFields)
    setEditingField(null)
  }

  const handleDeleteField = (fieldId: string) => {
    const newFields = fields.filter((f) => f.id !== fieldId)
    updateFields(newFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Manage Fields</h3>
        <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
            </DialogHeader>
            <FieldEditor onSave={handleAddField} onCancel={() => setIsAddingField(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {fields.map((field) => (
              <SortableFieldItem
                key={field.id}
                field={field}
                onEdit={() => setEditingField(field)}
                onDelete={() => handleDeleteField(field.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingField && (
        <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Field</DialogTitle>
            </DialogHeader>
            <FieldEditor field={editingField} onSave={handleEditField} onCancel={() => setEditingField(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function FieldEditor({
  field,
  onSave,
  onCancel,
}: {
  field?: FieldDefinition
  onSave: (field: FieldDefinition) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<FieldDefinition>>(
    field || {
      id: `field_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      required: false,
      order: 0,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.label && formData.type) {
      onSave(formData as FieldDefinition)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="label">Field Label</Label>
        <Input
          id="label"
          value={formData.label || ""}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="e.g., Company Name"
          required
        />
      </div>

      <div>
        <Label htmlFor="name">Field Name (internal)</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
          placeholder="e.g., company_name"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Field Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as FieldType })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="textarea">Text Area</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="placeholder">Placeholder (optional)</Label>
        <Input
          id="placeholder"
          value={formData.placeholder || ""}
          onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={formData.required}
          onCheckedChange={(checked) => setFormData({ ...formData, required: !!checked })}
        />
        <Label htmlFor="required">Required field</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Save Field
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
