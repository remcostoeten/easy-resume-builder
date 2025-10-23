import type { Resume, ResumeSection } from "../types/resume"
import { defaultSchemas, createEmptySectionContent } from "../schemas/default-schemas"

export function createDefaultResume(): Resume {
  const sections: ResumeSection[] = defaultSchemas.map((schema, index) => ({
    id: crypto.randomUUID(),
    schemaId: schema.id,
    title: schema.displayName,
    order: index,
    visible: true,
    content: createEmptySectionContent(schema),
  }))

  return {
    id: crypto.randomUUID(),
    name: "Untitled Resume",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections,
  }
}
