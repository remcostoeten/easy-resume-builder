"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FormSection } from "../form/form-section"
import { SkillsForm } from "./skills-form"
import { resumeReducer } from "../../store/resume-store"
import type { TSkillCategory } from "../../types/resume"

export type TSkillsSectionProps = {
  readonly data: readonly TSkillCategory[]
}

export function SkillsSection({ data }: TSkillsSectionProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingCategory, setEditingCategory] = useState<TSkillCategory | null>(null)

  function handleAddNew() {
    setIsAddingNew(true)
    setEditingCategory(null)
  }

  function handleEdit(category: TSkillCategory) {
    setEditingCategory(category)
    setIsAddingNew(false)
  }

  function handleSave(skillCategory: TSkillCategory) {
    if (editingCategory) {
      resumeReducer({
        type: "UPDATE_SKILL_CATEGORY",
        id: skillCategory.id,
        data: skillCategory,
      })
    } else {
      resumeReducer({
        type: "ADD_SKILL_CATEGORY",
        data: skillCategory,
      })
    }
    setIsAddingNew(false)
    setEditingCategory(null)
  }

  function handleCancel() {
    setIsAddingNew(false)
    setEditingCategory(null)
  }

  function handleDelete(id: string) {
    resumeReducer({
      type: "REMOVE_SKILL_CATEGORY",
      id,
    })
    setEditingCategory(null)
  }

  const isFormVisible = isAddingNew || editingCategory

  function renderSkillProficiency(skill: any) {
    if (!skill.proficiency?.showLevel) return null

    const { level, displayType } = skill.proficiency

    switch (displayType) {
      case "bar":
        return <Progress value={(level / 10) * 100} className="h-2 w-24" />
      case "dots":
        return (
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < Math.ceil(level / 2) ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        )
      case "text":
        return (
          <Badge variant="outline" className="text-xs">
            {level <= 3 ? "Beginner" : level <= 6 ? "Intermediate" : level <= 8 ? "Advanced" : "Expert"}
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <FormSection title="Skills" icon={<Code className="h-5 w-5" />}>
      <div className="space-y-6">
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkillsForm
                skillCategory={editingCategory || undefined}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={editingCategory ? handleDelete : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!isFormVisible && (
          <div className="space-y-4">
            <AnimatePresence>
              {data.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{category.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {category.skills.length} skills
                            </Badge>
                          </div>

                          <div className="grid gap-3">
                            {category.skills.map((skill) => (
                              <div key={skill.id} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{skill.name}</span>
                                {renderSkillProficiency(skill)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {data.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Skills Added</h3>
                <p className="text-muted-foreground mb-4">Add your technical and professional skills.</p>
              </div>
            )}

            <Button onClick={handleAddNew} className="w-full flex items-center gap-2 bg-transparent" variant="outline">
              <Plus className="h-4 w-4" />
              Add Skill Category
            </Button>
          </div>
        )}
      </div>
    </FormSection>
  )
}
