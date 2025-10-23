'use client'

import * as React from 'react'
import { useThemeSwitcher } from '@/lib/hooks/use-theme-switcher'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useThemeSwitcher()

  return <>{children}</>
}
