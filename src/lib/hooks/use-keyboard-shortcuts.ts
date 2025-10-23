"use client"

import { useEffect } from "react"

interface KeyboardShortcutsOptions {
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({ onSave, onUndo, onRedo, enabled = true }: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const modifier = isMac ? event.metaKey : event.ctrlKey

      // Cmd/Ctrl + S: Save
      if (modifier && event.key === "s") {
        event.preventDefault()
        onSave?.()
      }

      // Cmd/Ctrl + Z: Undo
      if (modifier && event.key === "z" && !event.shiftKey) {
        event.preventDefault()
        onUndo?.()
      }

      // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y: Redo
      if ((modifier && event.shiftKey && event.key === "z") || (modifier && event.key === "y")) {
        event.preventDefault()
        onRedo?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [enabled, onSave, onUndo, onRedo])
}
