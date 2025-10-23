"use client"

import { useEffect, useState } from "react"
import { themes, getThemeById } from "@/lib/themes/theme-config"

const THEME_KEY = "selected-theme"
const DARK_MODE_KEY = "dark-mode"
const DEFAULT_THEME = "amber-glow"

export function useThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load saved theme
    try {
      const saved = localStorage.getItem(THEME_KEY)
      if (saved && getThemeById(saved)) {
        setCurrentTheme(saved)
      }
    } catch (error) {
      console.error("Failed to load theme:", error)
    }

    try {
      const savedDarkMode = localStorage.getItem(DARK_MODE_KEY)
      const prefersDark =
        savedDarkMode === "true" ||
        (savedDarkMode === null && window.matchMedia("(prefers-color-scheme: dark)").matches)
      setIsDark(prefersDark)

      // Apply dark mode class
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } catch (error) {
      console.error("Failed to load dark mode:", error)
    }
  }, [])

  useEffect(() => {
    // Apply theme colors
    const theme = getThemeById(currentTheme)
    if (!theme) return

    const colors = isDark ? theme.colors.dark : theme.colors.light
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Save theme preference
    try {
      localStorage.setItem(THEME_KEY, currentTheme)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }, [currentTheme, isDark])

  const switchTheme = (themeId: string) => {
    if (getThemeById(themeId)) {
      setCurrentTheme(themeId)
    }
  }

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newDarkMode = !prev

      // Update DOM
      if (newDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Save preference
      try {
        localStorage.setItem(DARK_MODE_KEY, String(newDarkMode))
      } catch (error) {
        console.error("Failed to save dark mode:", error)
      }

      return newDarkMode
    })
  }

  return {
    currentTheme,
    themes,
    switchTheme,
    isDark,
    toggleDarkMode,
  }
}
