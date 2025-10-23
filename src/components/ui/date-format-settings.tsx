"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Settings, Calendar, Lock, Unlock } from "lucide-react"
import { useDateFormat } from "@/lib/context/date-format-context"
import { cn } from "@/lib/utils"

export function DateFormatSettings() {
  const { dateFormat, setDateFormat, availableFormats, isFormatLocked, lockFormat, unlockFormat } = useDateFormat()
  const [isOpen, setIsOpen] = useState(false)

  const handleFormatChange = (formatId: string) => {
    const newFormat = availableFormats.find(f => f.id === formatId)
    if (newFormat) {
      setDateFormat(newFormat)
    }
  }

  const toggleLock = () => {
    if (isFormatLocked) {
      unlockFormat()
    } else {
      lockFormat()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <Calendar className="h-4 w-4" />
          Date Format
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date Format Settings
          </DialogTitle>
          <DialogDescription>
            Choose how dates should be displayed throughout your resume. This will apply to all date fields and AI parsing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lock/Unlock Settings */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                {isFormatLocked ? (
                  <>
                    <Lock className="h-4 w-4 text-orange-500" />
                    Format Locked
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 text-green-500" />
                    Format Unlocked
                  </>
                )}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isFormatLocked
                  ? "The date format is locked to prevent accidental changes. Unlock to modify."
                  : "The date format can be changed. Lock it to prevent accidental changes."}
              </p>
            </div>
            <Button
              variant={isFormatLocked ? "destructive" : "default"}
              size="sm"
              onClick={toggleLock}
              className="gap-2"
            >
              {isFormatLocked ? (
                <>
                  <Unlock className="h-4 w-4" />
                  Unlock
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Lock
                </>
              )}
            </Button>
          </div>

          {/* Format Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Date Format</Label>
            <RadioGroup
              value={dateFormat.id}
              onValueChange={handleFormatChange}
              disabled={isFormatLocked}
              className="space-y-3"
            >
              {availableFormats.map((format) => (
                <div
                  key={format.id}
                  className={cn(
                    "flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors",
                    dateFormat.id === format.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                  onClick={() => !isFormatLocked && handleFormatChange(format.id)}
                >
                  <RadioGroupItem value={format.id} id={format.id} disabled={isFormatLocked} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{format.flag}</span>
                      <div>
                        <Label htmlFor={format.id} className="font-medium cursor-pointer">
                          {format.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Full Date</p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {format.examples.full}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Short Date</p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {format.examples.short}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Month Only</p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {format.examples.month}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Date Range</p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {format.examples.range}
                        </p>
                      </div>
                    </div>

                    {/* AI Instructions */}
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>AI Parsing:</strong> {format.aiPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">ℹ️ How this affects your resume:</h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• All date fields will use this format</li>
              <li>• AI parsing will format dates according to this preference</li>
              <li>• Resume export will use this format consistently</li>
              <li>• Settings are saved automatically</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}