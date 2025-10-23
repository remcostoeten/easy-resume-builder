"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import type { EducationContent, EducationItem } from "@/lib/types/resume"

interface EducationEditorProps {
  content: any
  onUpdate: (content: EducationContent) => void
}

export function EducationEditor({ content, onUpdate }: EducationEditorProps) {
  const educationContent = content as EducationContent

  const addItem = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: null,
      endDate: null,
      gpa: "",
    }

    onUpdate({
      ...educationContent,
      items: [...educationContent.items, newItem],
    })
  }

  const updateItem = (id: string, updates: Partial<EducationItem>) => {
    onUpdate({
      ...educationContent,
      items: educationContent.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const deleteItem = (id: string) => {
    onUpdate({
      ...educationContent,
      items: educationContent.items.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      {educationContent.items.map((item) => (
        <Card key={item.id} className="px-4 pb-4 pt-3">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="font-semibold text-foreground">Education Entry</h3>
            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input
                value={item.institution}
                onChange={(e) => updateItem(item.id, { institution: e.target.value })}
                placeholder="University Name"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={item.degree}
                  onChange={(e) => updateItem(item.id, { degree: e.target.value })}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={item.field}
                  onChange={(e) => updateItem(item.id, { field: e.target.value })}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={item.location}
                onChange={(e) => updateItem(item.id, { location: e.target.value })}
                placeholder="City, State"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={item.startDate?.value || ""}
                  onChange={(e) => updateItem(item.id, {
                    startDate: e.target.value ? { value: e.target.value, precision: "month" } : null
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={item.endDate?.value || ""}
                  onChange={(e) => updateItem(item.id, {
                    endDate: e.target.value ? { value: e.target.value, precision: "month" } : null
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={item.gpa || ""}
                  onChange={(e) => updateItem(item.id, { gpa: e.target.value })}
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addItem} variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  )
}
