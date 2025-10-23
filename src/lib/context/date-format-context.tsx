"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { DATE_FORMATS, DateFormatConfig } from "@/lib/config/date-formats"

interface DateFormatContextType {
  dateFormat: DateFormatConfig
  setDateFormat: (config: DateFormatConfig) => void
  availableFormats: DateFormatConfig[]
  isFormatLocked: boolean
  lockFormat: () => void
  unlockFormat: () => void
}

const DateFormatContext = createContext<DateFormatContextType | undefined>(undefined)

interface DateFormatProviderProps {
  children: ReactNode
}

export function DateFormatProvider({ children }: DateFormatProviderProps) {
  const [dateFormat, setDateFormatState] = useState<DateFormatConfig>(DATE_FORMATS[0]) // Default to US
  const [isFormatLocked, setIsFormatLocked] = useState(false)

  // Load saved date format from localStorage
  useEffect(() => {
    try {
      const savedFormatId = localStorage.getItem("resume-builder-date-format")
      const savedLocked = localStorage.getItem("resume-builder-date-format-locked") === "true"

      if (savedFormatId) {
        const savedFormat = DATE_FORMATS.find(format => format.id === savedFormatId)
        if (savedFormat) {
          setDateFormatState(savedFormat)
        }
      }

      setIsFormatLocked(savedLocked)
    } catch (error) {
      console.error("Failed to load date format settings:", error)
    }
  }, [])

  // Save date format to localStorage whenever it changes
  const setDateFormat = (config: DateFormatConfig) => {
    setDateFormatState(config)
    try {
      localStorage.setItem("resume-builder-date-format", config.id)
    } catch (error) {
      console.error("Failed to save date format:", error)
    }
  }

  // Lock format to prevent changes
  const lockFormat = () => {
    setIsFormatLocked(true)
    try {
      localStorage.setItem("resume-builder-date-format-locked", "true")
    } catch (error) {
      console.error("Failed to save format lock:", error)
    }
  }

  // Unlock format
  const unlockFormat = () => {
    setIsFormatLocked(false)
    try {
      localStorage.removeItem("resume-builder-date-format-locked")
    } catch (error) {
      console.error("Failed to remove format lock:", error)
    }
  }

  return (
    <DateFormatContext.Provider
      value={{
        dateFormat,
        setDateFormat,
        availableFormats: DATE_FORMATS,
        isFormatLocked,
        lockFormat,
        unlockFormat
      }}
    >
      {children}
    </DateFormatContext.Provider>
  )
}

export function useDateFormat() {
  const context = useContext(DateFormatContext)
  if (context === undefined) {
    throw new Error("useDateFormat must be used within a DateFormatProvider")
  }
  return context
}

// Hook to get AI parsing instructions
export function useAIDateInstructions() {
  const { dateFormat } = useDateFormat()

  const getInstructions = () => {
    return {
      dateFormat: dateFormat.id,
      instructions: `IMPORTANT DATE FORMAT INSTRUCTIONS:\n\n${require("@/lib/config/date-formats").getAIDateInstructions(dateFormat)}\n\nPlease ensure all dates in the parsed resume data follow this format exactly.`
    }
  }

  return { getInstructions }
}