"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { DateValue, DatePrecision } from "@/lib/types/resume"

interface FlexibleDatePickerProps {
  value: DateValue
  onChange: (value: DateValue) => void
  label?: string
  required?: boolean
  disabled?: boolean
  allowPrecisionToggle?: boolean
  defaultPrecision?: DatePrecision
}

export function FlexibleDatePicker({
  value,
  onChange,
  label,
  required,
  disabled,
  allowPrecisionToggle = true,
  defaultPrecision = "month",
}: FlexibleDatePickerProps) {
  const [precision, setPrecision] = useState<DatePrecision>(value?.precision || defaultPrecision)

  const handlePrecisionChange = (newPrecision: DatePrecision) => {
    setPrecision(newPrecision)
    // Convert existing value to new precision if possible
    if (value?.value) {
      const converted = convertDatePrecision(value.value, newPrecision)
      onChange({ value: converted, precision: newPrecision })
    } else {
      onChange({ value: "", precision: newPrecision })
    }
  }

  const handleDateChange = (newValue: string) => {
    onChange({ value: newValue, precision })
  }

  const getInputType = () => {
    switch (precision) {
      case "year":
        return "number"
      case "month":
        return "month"
      case "full":
        return "date"
    }
  }

  const getPlaceholder = () => {
    switch (precision) {
      case "year":
        return "2022"
      case "month":
        return "Dec 2022"
      case "full":
        return "MM/DD/YYYY"
    }
  }

  const getPrecisionLabel = () => {
    switch (precision) {
      case "year":
        return "Year"
      case "month":
        return "Month"
      case "full":
        return "Full Date"
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          {precision === "year" ? (
            <Input
              type="number"
              min="1900"
              max="2100"
              value={value?.value || ""}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={disabled}
              required={required}
            />
          ) : (
            <Input
              type={getInputType()}
              value={value?.value || ""}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={disabled}
              required={required}
            />
          )}
        </div>
        {allowPrecisionToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={disabled}>
                <Calendar className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePrecisionChange("year")}>
                <div className="flex flex-col">
                  <span className="font-medium">Year Only</span>
                  <span className="text-xs text-muted-foreground">e.g., 2022</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrecisionChange("month")}>
                <div className="flex flex-col">
                  <span className="font-medium">Month + Year</span>
                  <span className="text-xs text-muted-foreground">e.g., Dec 2022</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrecisionChange("full")}>
                <div className="flex flex-col">
                  <span className="font-medium">Full Date</span>
                  <span className="text-xs text-muted-foreground">e.g., 12/03/2022</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Precision: {getPrecisionLabel()}</p>
    </div>
  )
}

// Helper function to convert date values between precisions
function convertDatePrecision(value: string, newPrecision: DatePrecision): string {
  if (!value) return ""

  // If it's a year (4 digits)
  if (/^\d{4}$/.test(value)) {
    switch (newPrecision) {
      case "year":
        return value
      case "month":
        return `${value}-01` // Default to January
      case "full":
        return `${value}-01-01` // Default to January 1st
    }
  }

  // If it's month format (YYYY-MM)
  if (/^\d{4}-\d{2}$/.test(value)) {
    switch (newPrecision) {
      case "year":
        return value.split("-")[0]
      case "month":
        return value
      case "full":
        return `${value}-01` // Default to 1st of the month
    }
  }

  // If it's full date format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    switch (newPrecision) {
      case "year":
        return value.split("-")[0]
      case "month":
        return value.substring(0, 7) // YYYY-MM
      case "full":
        return value
    }
  }

  return value
}

// Helper function to format date for display
export function formatDateForDisplay(dateValue: DateValue): string {
  if (!dateValue?.value) return ""

  const { value, precision } = dateValue

  switch (precision) {
    case "year":
      return value
    case "month":
      // Convert YYYY-MM to "Month Year"
      const [year, month] = value.split("-")
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    case "full":
      // Convert YYYY-MM-DD to "Month DD, YYYY"
      const fullDate = new Date(value)
      return fullDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
  }
}
