"use client"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import type { ExperienceContent, ExperienceItem } from "@/lib/types/resume"

interface ExperienceEditorProps {
  content: any
  onUpdate: (content: ExperienceContent) => void
}

export function ExperienceEditor({ content, onUpdate }: ExperienceEditorProps) {
  const experienceContent = content as ExperienceContent

  const addItem = () => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: null,
      endDate: null,
      current: false,
      description: [""],
    }

    onUpdate({
      ...experienceContent,
      items: [...experienceContent.items, newItem],
    })
  }

  const updateItem = (id: string, updates: Partial<ExperienceItem>) => {
    onUpdate({
      ...experienceContent,
      items: experienceContent.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const deleteItem = (id: string) => {
    onUpdate({
      ...experienceContent,
      items: experienceContent.items.filter((item) => item.id !== id),
    })
  }

  const updateDescription = (id: string, index: number, value: string) => {
    const item = experienceContent.items.find((i) => i.id === id)
    if (!item) return

    const newDescription = [...item.description]
    newDescription[index] = value

    updateItem(id, { description: newDescription })
  }

  const addDescriptionPoint = (id: string) => {
    const item = experienceContent.items.find((i) => i.id === id)
    if (!item) return

    updateItem(id, { description: [...item.description, ""] })
  }

  const removeDescriptionPoint = (id: string, index: number) => {
    const item = experienceContent.items.find((i) => i.id === id)
    if (!item) return

    updateItem(id, { description: item.description.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      {experienceContent.items.map((item) => (
        <Card key={item.id} className="px-4 pb-4 pt-3">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="font-semibold text-foreground">Experience Entry</h3>
            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={item.company}
                  onChange={(e) => updateItem(item.id, { company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={item.position}
                  onChange={(e) => updateItem(item.id, { position: e.target.value })}
                  placeholder="Job Title"
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

            <div className="grid gap-4 md:grid-cols-2">
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
                  disabled={item.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${item.id}`}
                checked={item.current}
                onCheckedChange={(checked) => updateItem(item.id, { current: checked as boolean })}
              />
              <Label htmlFor={`current-${item.id}`} className="cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              {item.description.map((desc, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={desc}
                    onChange={(e) => updateDescription(item.id, index, e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={2}
                    className="resize-none"
                  />
                  {item.description.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDescriptionPoint(item.id, index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addDescriptionPoint(item.id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Bullet Point
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addItem} variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  )
}
