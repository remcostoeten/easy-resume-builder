"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export type TGradientCardProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly gradient?: "blue" | "purple" | "green" | "orange"
  readonly hover?: boolean
}

export function GradientCard({ children, className, gradient = "blue", hover = true }: TGradientCardProps) {
  const gradients = {
    blue: "from-blue-500/10 via-cyan-500/5 to-blue-600/10",
    purple: "from-purple-500/10 via-pink-500/5 to-purple-600/10",
    green: "from-green-500/10 via-emerald-500/5 to-green-600/10",
    orange: "from-orange-500/10 via-yellow-500/5 to-orange-600/10",
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br backdrop-blur-sm",
        gradients[gradient],
        hover && "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10",
        className,
      )}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
