"use client"

import { useCallback } from "react"

export function useViewTransition() {
  const startTransition = useCallback((callback: () => void) => {
    // Check if View Transitions API is supported
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      // @ts-expect-error - View Transitions API is not yet in TypeScript types
      document.startViewTransition(callback)
    } else {
      // Fallback for browsers that don't support View Transitions
      callback()
    }
  }, [])

  return { startTransition }
}
