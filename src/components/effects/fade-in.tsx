"use client"

import { useRef } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  UseInViewOptions,
  Variants,
} from "framer-motion"

type MarginType = UseInViewOptions["margin"]

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { y: number }
    visible: { y: number }
  }
  duration?: number
  delay?: number
  yOffset?: number
  inView?: boolean
  inViewMargin?: MarginType
  blur?: string
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

