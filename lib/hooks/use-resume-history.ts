"use client"

import { useState, useCallback } from "react"
import type { Resume } from "../types/resume"

const MAX_HISTORY = 50

export function useResumeHistory(initialResume: Resume | null) {
  const [history, setHistory] = useState<Resume[]>(initialResume ? [initialResume] : [])
  const [currentIndex, setCurrentIndex] = useState(0)

  const addToHistory = useCallback(
    (resume: Resume) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(resume)

        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift()
          setCurrentIndex((i) => i - 1)
        } else {
          setCurrentIndex(newHistory.length - 1)
        }

        return newHistory
      })
    },
    [currentIndex],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((i) => i + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
