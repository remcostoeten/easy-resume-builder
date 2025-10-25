
export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "email"
  | "phone"
  | "url"
  | "checkbox"
  | "list"
  | "richtext"
  | "image" 

export type DatePrecision = "year" | "month" | "full"

export type DateValue = {
  value: string 
  precision: DatePrecision
} | null

export type FieldDefinition = {
  id: string
  name: string 
  label: string 
  type: FieldType
  required: boolean
  placeholder?: string
  helpText?: string
  defaultValue?: unknown
  order: number
  dateOptions?: {
    allowPrecisionToggle?: boolean 
    defaultPrecision?: DatePrecision
  }
}

export type RepeatableGroup = {
  id: string
  name: string 
  label: string 
  fields: FieldDefinition[]
  minItems?: number
  maxItems?: number
}

export type SectionSchema = {
  id: string
  name: string 
  displayName: string 
  icon?: string
  isCustom: boolean 

  fields: FieldDefinition[]

  repeatableGroups: RepeatableGroup[]
}

export type FieldValue = string | number | boolean | string[] | DateValue | null

export type EntryData = {
  id: string
  values: Record<string, FieldValue> 
}

export type SectionContent = {
  schemaId: string

  fieldValues: Record<string, FieldValue>

  groupEntries: Record<string, EntryData[]> 
}

export type ResumeSection = {
  id: string
  schemaId: string 
    type: string 
  title: string 
  order: number
  visible: boolean
  content: SectionContent
}

export type Resume = {
  id: string
  name: string
  sections: ResumeSection[]
  createdAt: string
  updatedAt: string
}

export type SavedResume = {
  id: string
  name: string
  data: Resume
  savedAt: string
}
        
export type SchemaLibrary = {
  schemas: SectionSchema[]
}

export type { FieldChange } from "./ai"

export type HeaderContent = {
  avatar?: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
}

export type SummaryContent = {
  text: string // Plain text fallback
  richText?: string // Rich text with formatting (HTML/markdown)
}

export type ExperienceItem = {
  id: string
  position: string
  company: string
  location: string
  startDate: DateValue
  endDate?: DateValue
  current: boolean
  description: string[]
}

export type ExperienceContent = {
  items: ExperienceItem[]
}

export type EducationItem = {
  id: string
  degree: string
  institution: string
  field: string
  location: string
  startDate?: DateValue
  endDate?: DateValue
  gpa: string
}

export type EducationContent = {
  items: EducationItem[]
}

export type SkillsContent = {
  categories: Array<{ id: string; name: string; skills: string[] }>
}

export type ProjectItem = {
  id: string
  name: string
  description: string
  technologies: string[]
  link: string
}

export type ProjectsContent = {
  items: ProjectItem[]
}
