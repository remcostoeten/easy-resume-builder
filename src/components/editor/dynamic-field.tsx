"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X, Upload, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SimpleRichTextEditor } from "@/components/ui/simple-rich-text-editor"
import { SegmentedUrlInput } from "@/components/ui/segmented-url-input"
import type { FieldDefinition, FieldValue, DateValue } from "@/lib/types/resume"
import { useState, useCallback, useMemo } from "react"
import { FlexibleDatePicker } from "./flexible-date-picker"
import { validateField, type ValidationResult } from "@/lib/utils/validation"
import { validateAndProcessImage } from "@/lib/utils/image-upload"
import { toast } from "sonner"
import { useDebounce } from "@/lib/hooks/use-performance-optimizations"

interface DynamicFieldProps {
  field: FieldDefinition
  value: FieldValue
  onChange: (value: FieldValue) => void
  disabled?: boolean
  sectionId?: string
  fieldName?: string
}

export function DynamicField({ field, value, onChange, disabled, sectionId, fieldName }: DynamicFieldProps) {
  const [listInput, setListInput] = useState("")
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true })

  // Debounce validation to reduce lag during typing
  const debouncedValue = useDebounce(value, 500)

  // Memoize validation options to prevent unnecessary recreations
  const validationOptions = useMemo(() => ({
    required: field.required,
    minLength: field.type === "textarea" ? 10 : undefined,
    maxLength: field.type === "textarea" ? 2000 : field.type === "text" ? 100 : undefined
  }), [field.required, field.type])

  // Memoize validation function
  const handleBlur = useCallback((fieldValue: any) => {
    const result = validateField(field.type, fieldValue, field.label, validationOptions)
    setValidationResult(result)
  }, [field.type, field.label, validationOptions])

  // Memoize onChange handlers to prevent unnecessary re-renders
  const handleTextChange = useCallback((newValue: string) => {
    onChange(newValue)
    if (!validationResult.isValid) {
      setValidationResult({ isValid: true })
    }
  }, [onChange, validationResult.isValid])

  const handleListValidation = useCallback((inputValue: string) => {
    return validateField("text", inputValue.trim(), field.label)
  }, [field.label])

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <div className="space-y-1">
            <Input
              type={field.type === "email" ? "email" : "text"}
              value={(value as string) || ""}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={(e) => handleBlur(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              required={field.required}
              className={`flex-1 ${!validationResult.isValid ? 'border-destructive focus:border-destructive' : ''}`}
              aria-invalid={!validationResult.isValid}
              data-section-id={sectionId}
              data-field-name={fieldName}
            />
            {!validationResult.isValid && validationResult.error && (
              <p className="text-sm text-destructive">{validationResult.error}</p>
            )}
            {validationResult.isValid && validationResult.warnings && validationResult.warnings.length > 0 && (
              <p className="text-sm text-yellow-600">{validationResult.warnings[0]}</p>
            )}
          </div>
        )

      case "url":
        return (
          <div className="space-y-1">
            <SegmentedUrlInput
              value={(value as string) || ""}
              onChange={handleTextChange}
              onBlur={(e) => handleBlur(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              required={field.required}
              className={`flex-1 ${!validationResult.isValid ? 'border-destructive' : ''}`}
              aria-invalid={!validationResult.isValid}
              data-section-id={sectionId}
              data-field-name={fieldName}
            />
            {!validationResult.isValid && validationResult.error && (
              <p className="text-sm text-destructive">{validationResult.error}</p>
            )}
            {validationResult.isValid && validationResult.warnings && validationResult.warnings.length > 0 && (
              <p className="text-sm text-yellow-600">{validationResult.warnings[0]}</p>
            )}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-1">
            <Textarea
              value={(value as string) || ""}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={(e) => handleBlur(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              required={field.required}
              rows={4}
              className={`resize-none ${!validationResult.isValid ? 'border-destructive focus:border-destructive' : ''}`}
              data-section-id={sectionId}
              data-field-name={fieldName}
            />
            {!validationResult.isValid && validationResult.error && (
              <p className="text-sm text-destructive">{validationResult.error}</p>
            )}
            {validationResult.isValid && validationResult.warnings && validationResult.warnings.length > 0 && (
              <p className="text-sm text-yellow-600">{validationResult.warnings[0]}</p>
            )}
          </div>
        )

      case "richtext":
        return (
          <div className="space-y-1">
            <SimpleRichTextEditor
              value={(value as string) || ""}
              onChange={handleTextChange}
              placeholder={field.placeholder}
              className={`!border-0 !p-0 ${!validationResult.isValid ? 'ring-2 ring-destructive' : ''}`}
              rows={4}
            />
            {!validationResult.isValid && validationResult.error && (
              <p className="text-sm text-destructive">{validationResult.error}</p>
            )}
            {validationResult.isValid && validationResult.warnings && validationResult.warnings.length > 0 && (
              <p className="text-sm text-yellow-600">{validationResult.warnings[0]}</p>
            )}
          </div>
        )

      case "date":
        return (
          <FlexibleDatePicker
            value={value as DateValue}
            onChange={(newValue) => onChange(newValue)}
            disabled={disabled}
            required={field.required}
            allowPrecisionToggle={field.dateOptions?.allowPrecisionToggle ?? true}
            defaultPrecision={field.dateOptions?.defaultPrecision ?? "month"}
          />
        )

  
      case "image":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {value ? (
                <div className="relative group">
                  <img
                    src={value as string}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange(null)}
                    disabled={disabled}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById(`file-input-${field.id}`)?.click()}
                    disabled={disabled}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {value ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange(null)}
                      disabled={disabled}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  id={`file-input-${field.id}`}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        const result = await validateAndProcessImage(file)

                        if (result.isValid && result.processedImage) {
                          onChange(result.processedImage)
                          toast.success("Image uploaded successfully", {
                            description: "Your profile photo has been uploaded and optimized.",
                          })
                        } else {
                          toast.error("Upload failed", {
                            description: result.error || "Failed to process image.",
                          })
                        }
                      } catch (error) {
                        console.error("Image upload error:", error)
                        toast.error("Upload failed", {
                          description: "An unexpected error occurred. Please try again.",
                        })
                      }
                    }
                  }}
                  disabled={disabled}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => onChange(checked as boolean)}
              disabled={disabled}
            />
            <Label htmlFor={field.id} className="cursor-pointer font-normal">
              {field.label}
            </Label>
          </div>
        )

      case "list":
        const listValue = (value as string[]) || []
        const listValidation = handleListValidation(listInput)

        // Memoize list item handlers to prevent unnecessary re-renders
        const handleRemoveItem = useCallback((index: number) => {
          const newList = listValue.filter((_, i) => i !== index)
          onChange(newList)
        }, [listValue, onChange])

        const handleAddItem = useCallback(() => {
          if (listInput.trim() && listValidation.isValid) {
            onChange([...listValue, listInput.trim()])
            setListInput("")
          }
        }, [listInput, listValidation.isValid, listValue, onChange])

        const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && listInput.trim()) {
            e.preventDefault()
            handleAddItem()
          }
        }, [listInput, handleAddItem])

        // Memoize badges to prevent unnecessary re-renders
        const memoizedBadges = useMemo(() => (
          listValue.map((item, index) => (
            <Badge key={`${item}-${index}`} variant="secondary" className="gap-1">
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="ml-1 hover:text-destructive"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ), [listValue, handleRemoveItem, disabled])

        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {memoizedBadges}
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <Input
                  value={listInput}
                  onChange={(e) => setListInput(e.target.value)}
                  placeholder={field.placeholder}
                  disabled={disabled}
                  className={!listValidation.isValid ? 'border-destructive focus:border-destructive' : ''}
                  onKeyDown={handleKeyDown}
                  data-section-id={sectionId}
                  data-field-name={fieldName}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddItem}
                  disabled={disabled || !listInput.trim() || !listValidation.isValid}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {!listValidation.isValid && listValidation.error && (
                <p className="text-sm text-destructive">{listValidation.error}</p>
              )}
              {listValidation.isValid && listValidation.warnings && listValidation.warnings.length > 0 && (
                <p className="text-sm text-yellow-600">{listValidation.warnings[0]}</p>
              )}
              {listValue.length > 20 && (
                <p className="text-sm text-yellow-600">Many items in list - consider if this fits the resume format</p>
              )}
              {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            </div>
          </div>
        )

      default:
        return <div className="text-sm text-muted-foreground">Unsupported field type: {field.type}</div>
    }
  }

  if (field.type === "checkbox" || field.type === "date") {
    return <div className="space-y-2">{renderField()}</div>
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {!validationResult.isValid && validationResult.error && (
        <p className="text-xs text-destructive">{validationResult.error}</p>
      )}
      {field.helpText && field.type !== "list" && validationResult.isValid && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
    </div>
  )
}
