"use client"

import { PersonalInfoSection } from "../sections/personal-info-section"
import { WorkExperienceSection } from "../sections/work-experience-section"
import { EducationSection } from "../sections/education-section"
import { SkillsSection } from "../sections/skills-section"
import { SECTION_CONFIGS } from "../../constants/section-configs"
import type { TResumeSection, TResumeData } from "../../types/resume"

export type TSectionRendererProps = {
  readonly section: TResumeSection
  readonly resumeData: TResumeData
}

export function SectionRenderer({ section, resumeData }: TSectionRendererProps) {
  const config = SECTION_CONFIGS[section.type]

  switch (section.type) {
    case "personal-info":
      return <PersonalInfoSection data={resumeData.personalInfo} />

    case "work-experience":
      return <WorkExperienceSection data={resumeData.workExperience} />

    case "education":
      return <EducationSection data={resumeData.education} />

    case "skills":
      return <SkillsSection data={resumeData.skills} />

    case "projects":
    case "certifications":
    case "languages":
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">
            {config.icon && <config.icon className="h-12 w-12 mx-auto text-muted-foreground" />}
          </div>
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="text-muted-foreground">This section is coming soon!</p>
        </div>
      )

    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Unknown Section</h2>
          <p className="text-muted-foreground">This section type is not supported.</p>
        </div>
      )
  }
}
