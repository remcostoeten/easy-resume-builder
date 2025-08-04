"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export type TFloatingActionButtonProps = {
  readonly onClick: () => void
  readonly icon?: ReactNode
  readonly label?: string
  readonly className?: string
  readonly variant?: "primary" | "secondary"
}

export function FloatingActionButton({
  onClick,
  icon = <Plus className="h-5 w-5" />,
  label,
  className,
  variant = "primary",
}: TFloatingActionButtonProps) {
  return (
    <motion.div
      className={cn("fixed bottom-8 right-8 z-50", className)}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
          variant === "primary" &&
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          variant === "secondary" &&
            "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
          label && "w-auto px-6 gap-2",
        )}
      >
        {icon}
        {label && <span className="font-medium">{label}</span>}
      </Button>
    </motion.div>
  )
}
