"use client"

import { useThemeSwitcher } from "@/lib/hooks/use-theme-switcher"
import { Card } from "@/components/ui/card"
import { Check, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemePicker() {
  const { currentTheme, themes, switchTheme } = useThemeSwitcher()

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-foreground/10 bg-muted">
          <Palette className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Choose Your Theme</h2>
          <p className="text-sm text-muted-foreground">Personalize your resume builder experience</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const isSelected = currentTheme === theme.id
          const lightColors = theme.colors.light

          return (
            <Card
              key={theme.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden border-2 transition-all hover:shadow-lg",
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-foreground/20",
              )}
              onClick={() => switchTheme(theme.id)}
            >
              {/* Theme Preview Skeleton */}
              <div
                className="relative h-32 overflow-hidden p-4"
                style={{ backgroundColor: lightColors["--background"] }}
              >
                {/* Mini card preview */}
                <div
                  className="mb-2 h-16 rounded-md border p-2 shadow-sm"
                  style={{
                    backgroundColor: lightColors["--card"],
                    borderColor: lightColors["--border"],
                  }}
                >
                  <div
                    className="mb-1.5 h-2 w-3/4 rounded"
                    style={{ backgroundColor: lightColors["--foreground"], opacity: 0.8 }}
                  />
                  <div
                    className="h-1.5 w-1/2 rounded"
                    style={{ backgroundColor: lightColors["--muted-foreground"], opacity: 0.6 }}
                  />
                </div>

                {/* Color dots */}
                <div className="flex gap-1.5">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: lightColors["--primary"],
                      borderColor: lightColors["--border"],
                    }}
                  />
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: lightColors["--secondary"],
                      borderColor: lightColors["--border"],
                    }}
                  />
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: lightColors["--accent"],
                      borderColor: lightColors["--border"],
                    }}
                  />
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="border-t-2 border-border bg-card p-4">
                <h3 className="mb-1 font-serif text-lg font-semibold text-foreground">{theme.name}</h3>
                <p className="text-sm text-muted-foreground">{theme.description}</p>
              </div>

              {/* Hover overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-primary/5 opacity-0 transition-opacity",
                  !isSelected && "group-hover:opacity-100",
                )}
              />
            </Card>
          )
        })}
      </div>
    </div>
  )
}
