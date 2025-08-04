"use client"

import { GraduationCap, Plus } from "lucide-react"
import { FormSection } from "../form/form-section"
import { Button } from "@/components/ui/button"
import type { TEducationItem } from "../../types/resume"

export type TEducationSectionProps = {
  readonly data: readonly TEducationItem[]
}

export function EducationSection({ data }: TEducationSectionProps) {
  return (
    <FormSection title="Education" icon={<GraduationCap className="h-5 w-5" />}>
      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Education Added</h3>
            <p className="text-muted-foreground mb-4">Add your educational background and qualifications.</p>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{item.degree}</h4>
                <p className="text-muted-foreground">{item.institution}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Add Another Education
            </Button>
          </div>
        )}
      </div>
    </FormSection>
  )
}
