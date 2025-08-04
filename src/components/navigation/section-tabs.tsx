"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SECTION_CONFIGS } from "../../constants/section-configs"
import type { TResumeSection } from "../../types/resume"

export type TSectionTabsProps = {
  readonly sections: readonly TResumeSection[]
  readonly activeSection: string
  readonly onSectionChange: (sectionId: string) => void
}

export function SectionTabs({ sections, activeSection, onSectionChange }: TSectionTabsProps) {
  const enabledSections = sections.filter((section) => section.isEnabled).sort((a, b) => a.order - b.order)

  return (
    <div className="border-b border-border bg-card">
      <div className="flex overflow-x-auto scrollbar-hide">
        {enabledSections.map((section) => {
          const config = SECTION_CONFIGS[section.type]
          const IconComponent = config.icon
          const isActive = section.id === activeSection

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200",
                "hover:text-foreground hover:bg-accent/50 border-b-2 border-transparent",
                isActive ? "text-foreground bg-background border-b-primary" : "text-muted-foreground",
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span>{section.title}</span>

              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
