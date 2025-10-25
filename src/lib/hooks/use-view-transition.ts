"use client"

import { useCallback } from "react"

export function useViewTransition() {
  const startTransition = useCallback((callback: () => void) => {
    // Check if View Transitions API is supported
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      // Type assertion for ViewTransition API
      const doc = document as any
      doc.startViewTransition?.(callback)
    } else {
      // Fallback for browsers that don't support View Transitions
      callback()
    }
  }, [])

  return { startTransition }
}
