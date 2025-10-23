"use client"

import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProjectsContent, ProjectItem } from "@/lib/types/resume"
import { useState } from "react"

interface ProjectsEditorProps {
  content: any
  onUpdate: (content: ProjectsContent) => void
}

export function ProjectsEditor({ content, onUpdate }: ProjectsEditorProps) {
  const projectsContent = content as ProjectsContent
  const [newTechInputs, setNewTechInputs] = useState<Record<string, string>>({})

  const addItem = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      link: "",
    }

    onUpdate({
      ...projectsContent,
      items: [...projectsContent.items, newItem],
    })
  }

  const updateItem = (id: string, updates: Partial<ProjectItem>) => {
    onUpdate({
      ...projectsContent,
      items: projectsContent.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const deleteItem = (id: string) => {
    onUpdate({
      ...projectsContent,
      items: projectsContent.items.filter((item) => item.id !== id),
    })
  }

  const addTechnology = (projectId: string) => {
    const tech = newTechInputs[projectId]?.trim()
    if (!tech) return

    const project = projectsContent.items.find((p) => p.id === projectId)
    if (!project) return

    updateItem(projectId, { technologies: [...project.technologies, tech] })
    setNewTechInputs({ ...newTechInputs, [projectId]: "" })
  }

  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = projectsContent.items.find((p) => p.id === projectId)
    if (!project) return

    updateItem(projectId, { technologies: project.technologies.filter((_, i) => i !== techIndex) })
  }

  return (
    <div className="space-y-4">
      {projectsContent.items.map((item) => (
        <Card key={item.id} className="px-4 pb-4 pt-3">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="font-semibold text-foreground">Project Entry</h3>
            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                placeholder="My Awesome Project"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                placeholder="Describe what the project does and your role..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(item.id, index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTechInputs[item.id] || ""}
                  onChange={(e) => setNewTechInputs({ ...newTechInputs, [item.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTechnology(item.id)
                    }
                  }}
                  placeholder="Add a technology..."
                />
                <Button onClick={() => addTechnology(item.id)} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Link (Optional)</Label>
              <Input
                value={item.link || ""}
                onChange={(e) => updateItem(item.id, { link: e.target.value })}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addItem} variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  )
}
