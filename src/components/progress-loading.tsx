"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressLoadingProps {
  message?: string
  estimatedTime?: number
  steps?: string[]
  currentStep?: number
  isComplete?: boolean
}

export function ProgressLoading({
  message = "Loading...",
  estimatedTime = 3000,
  steps = ["Initializing", "Loading data", "Preparing editor"],
  currentStep = 0,
  isComplete = false,
}: ProgressLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [displayedStep, setDisplayedStep] = useState(currentStep)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      setElapsedTime(elapsed)

      if (isComplete) {
        setProgress(100)
        clearInterval(interval)
      } else {
        const newProgress = Math.min((elapsed / estimatedTime) * 100, 95)
        setProgress(newProgress)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [estimatedTime, isComplete])

  useEffect(() => {
    setDisplayedStep(currentStep)
  }, [currentStep])

  const remainingTime = Math.max(0, Math.ceil((estimatedTime - elapsedTime) / 1000))
  const timeDisplay = remainingTime > 0 ? `${remainingTime}s` : "Almost done..."

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Main spinner */}
        <div className="flex justify-center">
          <div className="relative h-16 w-16">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-muted" />
            </div>
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <p className="text-sm text-muted-foreground">{timeDisplay}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isCompleted = index < displayedStep
              const isActive = index === displayedStep
              const isPending = index > displayedStep

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isActive ? (
                      <div className="relative h-5 w-5">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      isCompleted && "text-muted-foreground line-through",
                      isActive && "font-medium text-foreground",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Completion state */}
        {isComplete && (
          <div className="flex justify-center">
            <CheckCircle2 className="h-8 w-8 animate-pulse text-green-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export function ResumeLoadingProgress({
  isLoading = true,
  isComplete = false,
}: {
  isLoading?: boolean
  isComplete?: boolean
}) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const steps = [
      { delay: 300, step: 0 },
      { delay: 1000, step: 1 },
      { delay: 2000, step: 2 },
    ]

    const timeouts = steps.map((item) =>
      setTimeout(() => setCurrentStep(item.step), item.delay)
    )

    return () => timeouts.forEach((timeout) => clearTimeout(timeout))
  }, [isLoading])

  return (
    <ProgressLoading
      message="Loading your resume..."
      estimatedTime={2500}
      steps={["Fetching resume", "Processing data", "Preparing editor"]}
      currentStep={currentStep}
      isComplete={isComplete}
    />
  )
}
