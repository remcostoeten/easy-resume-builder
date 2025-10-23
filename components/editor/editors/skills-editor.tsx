"use client"

import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SkillsContent } from "@/lib/types/resume"
import { useState } from "react"

interface SkillsEditorProps {
  content: any
  onUpdate: (content: SkillsContent) => void
}

export function SkillsEditor({ content, onUpdate }: SkillsEditorProps) {
  const skillsContent = content as SkillsContent
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({})

  const addCategory = () => {
    const newCategory = {
      id: crypto.randomUUID(),
      name: "",
      skills: [],
    }

    onUpdate({
      ...skillsContent,
      categories: [...skillsContent.categories, newCategory],
    })
  }

  const updateCategory = (id: string, name: string) => {
    onUpdate({
      ...skillsContent,
      categories: skillsContent.categories.map((cat) => (cat.id === id ? { ...cat, name } : cat)),
    })
  }

  const deleteCategory = (id: string) => {
    onUpdate({
      ...skillsContent,
      categories: skillsContent.categories.filter((cat) => cat.id !== id),
    })
  }

  const addSkill = (categoryId: string) => {
    const skillName = newSkillInputs[categoryId]?.trim()
    if (!skillName) return

    onUpdate({
      ...skillsContent,
      categories: skillsContent.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, skills: [...cat.skills, skillName] } : cat,
      ),
    })

    setNewSkillInputs({ ...newSkillInputs, [categoryId]: "" })
  }

  const removeSkill = (categoryId: string, skillIndex: number) => {
    onUpdate({
      ...skillsContent,
      categories: skillsContent.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, skills: cat.skills.filter((_, i) => i !== skillIndex) } : cat,
      ),
    })
  }

  return (
    <div className="space-y-4">
      {skillsContent.categories.map((category) => (
        <Card key={category.id} className="px-4 pb-4 pt-3">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Label>Category Name</Label>
              <Input
                value={category.name}
                onChange={(e) => updateCategory(category.id, e.target.value)}
                placeholder="e.g., Programming Languages, Tools, etc."
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteCategory(category.id)}
              className="ml-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(category.id, index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newSkillInputs[category.id] || ""}
                onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [category.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill(category.id)
                  }
                }}
                placeholder="Add a skill..."
              />
              <Button onClick={() => addSkill(category.id)} variant="outline">
                Add
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addCategory} variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Category
      </Button>
    </div>
  )
}
