"use client"

import { useEffect, useState } from 'react'

export function useResponsiveSkeleton() {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const updateBreakpoints = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
      setIsDesktop(window.innerWidth >= 1024)
    }

    updateBreakpoints()
    window.addEventListener('resize', updateBreakpoints)

    return () => window.removeEventListener('resize', updateBreakpoints)
  }, [])

  return {
    isClient,
    isMobile,
    isTablet,
    isDesktop,
    // Loading state that matches SSR
    isLoading: !isClient
  }
}