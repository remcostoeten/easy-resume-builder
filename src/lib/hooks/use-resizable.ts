"use client"

import { useState, useCallback, useEffect } from "react"

interface UseResizableOptions {
  initialWidth: number
  minWidth: number
  maxWidth: number
  storageKey?: string
}

export function useResizable({ initialWidth, minWidth, maxWidth, storageKey }: UseResizableOptions) {
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined" && storageKey) {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = Number.parseInt(stored, 10)
        return Math.min(Math.max(parsed, minWidth), maxWidth)
      }
    }
    return initialWidth
  })

  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX
        const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth)
        setWidth(clampedWidth)

        if (storageKey) {
          localStorage.setItem(storageKey, clampedWidth.toString())
        }
      }
    },
    [isResizing, minWidth, maxWidth, storageKey],
  )

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize)
      window.addEventListener("mouseup", stopResizing)
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"

      return () => {
        window.removeEventListener("mousemove", resize)
        window.removeEventListener("mouseup", stopResizing)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, resize, stopResizing])

  return { width, isResizing, startResizing }
}
