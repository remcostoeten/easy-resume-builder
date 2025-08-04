import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export type TFormSectionProps = {
  readonly title: string
  readonly icon?: ReactNode
  readonly children: ReactNode
  readonly className?: string
  readonly isRequired?: boolean
}

export function FormSection({ title, icon, children, className, isRequired }: TFormSectionProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          <span>{title}</span>
          {isRequired && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Required</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}
