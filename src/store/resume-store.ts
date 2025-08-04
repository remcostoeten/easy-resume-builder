import { proxy } from "valtio"
import type { TResumeData, TResumeSection, TSectionType, TSkillCategory } from "../types/resume"
import { createEntity } from "../utils/entity"

export type TResumeAction =
  | { type: "TOGGLE_SECTION"; sectionId: string }
  | { type: "REORDER_SECTIONS"; sections: readonly TResumeSection[] }
  | { type: "UPDATE_PERSONAL_INFO"; data: Partial<TResumeData["personalInfo"]> }
  | { type: "ADD_WORK_EXPERIENCE"; data: TResumeData["workExperience"][0] }
  | { type: "UPDATE_WORK_EXPERIENCE"; id: string; data: Partial<TResumeData["workExperience"][0]> }
  | { type: "REMOVE_WORK_EXPERIENCE"; id: string }
  | { type: "ADD_SKILL_CATEGORY"; data: TSkillCategory }
  | { type: "UPDATE_SKILL_CATEGORY"; id: string; data: TSkillCategory }
  | { type: "REMOVE_SKILL_CATEGORY"; id: string }

function createDefaultSections(): readonly TResumeSection[] {
  const sectionConfigs: Array<{
    type: TSectionType
    title: string
    isRequired: boolean
    order: number
  }> = [
    { type: "personal-info", title: "Personal Information", isRequired: true, order: 0 },
    { type: "work-experience", title: "Work Experience", isRequired: false, order: 1 },
    { type: "education", title: "Education", isRequired: false, order: 2 },
    { type: "skills", title: "Skills", isRequired: false, order: 3 },
    { type: "projects", title: "Projects", isRequired: false, order: 4 },
    { type: "certifications", title: "Certifications", isRequired: false, order: 5 },
    { type: "languages", title: "Languages", isRequired: false, order: 6 },
  ]

  return sectionConfigs.map((config) =>
    createEntity<TResumeSection>({
      ...config,
      isEnabled: config.isRequired || config.order <= 2,
    }),
  )
}

function createInitialResumeData(): TResumeData {
  return createEntity<TResumeData>({
    personalInfo: createEntity({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
    }),
    workExperience: [],
    education: [],
    skills: [],
    sections: createDefaultSections(),
    metadata: {
      title: "Untitled Resume",
      template: "default",
      lastModified: new Date(),
    },
  })
}

export const resumeStore = proxy({
  data: createInitialResumeData(),
})

export function resumeReducer(action: TResumeAction): void {
  switch (action.type) {
    case "TOGGLE_SECTION": {
      const sectionIndex = resumeStore.data.sections.findIndex((s) => s.id === action.sectionId)
      if (sectionIndex !== -1 && !resumeStore.data.sections[sectionIndex].isRequired) {
        resumeStore.data.sections[sectionIndex].isEnabled = !resumeStore.data.sections[sectionIndex].isEnabled
        resumeStore.data.sections[sectionIndex].updatedAt = new Date()
        resumeStore.data.updatedAt = new Date()
      }
      break
    }

    case "REORDER_SECTIONS": {
      const reorderedSections = action.sections.map((section, index) => ({
        ...section,
        order: index,
        updatedAt: new Date(),
      }))
      resumeStore.data.sections = reorderedSections as any
      resumeStore.data.updatedAt = new Date()
      break
    }

    case "UPDATE_PERSONAL_INFO": {
      Object.assign(resumeStore.data.personalInfo, action.data)
      resumeStore.data.personalInfo.updatedAt = new Date()
      resumeStore.data.updatedAt = new Date()
      break
    }

    case "ADD_WORK_EXPERIENCE": {
      resumeStore.data.workExperience.push(action.data as any)
      resumeStore.data.updatedAt = new Date()
      break
    }

    case "UPDATE_WORK_EXPERIENCE": {
      const workIndex = resumeStore.data.workExperience.findIndex((item) => item.id === action.id)
      if (workIndex !== -1) {
        Object.assign(resumeStore.data.workExperience[workIndex], action.data)
        resumeStore.data.workExperience[workIndex].updatedAt = new Date()
        resumeStore.data.updatedAt = new Date()
      }
      break
    }

    case "REMOVE_WORK_EXPERIENCE": {
      const workIndex = resumeStore.data.workExperience.findIndex((item) => item.id === action.id)
      if (workIndex !== -1) {
        resumeStore.data.workExperience.splice(workIndex, 1)
        resumeStore.data.updatedAt = new Date()
      }
      break
    }

    case "ADD_SKILL_CATEGORY": {
      resumeStore.data.skills.push(action.data as any)
      resumeStore.data.updatedAt = new Date()
      break
    }

    case "UPDATE_SKILL_CATEGORY": {
      const skillIndex = resumeStore.data.skills.findIndex((category) => category.id === action.id)
      if (skillIndex !== -1) {
        resumeStore.data.skills[skillIndex] = action.data as any
        resumeStore.data.updatedAt = new Date()
      }
      break
    }

    case "REMOVE_SKILL_CATEGORY": {
      const skillIndex = resumeStore.data.skills.findIndex((category) => category.id === action.id)
      if (skillIndex !== -1) {
        resumeStore.data.skills.splice(skillIndex, 1)
        resumeStore.data.updatedAt = new Date()
      }
      break
    }

    default:
      break
  }
}
