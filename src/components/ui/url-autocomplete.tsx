"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface UrlAutocompleteProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  "data-section-id"?: string
  "data-field-name"?: string
  "aria-invalid"?: boolean
  urlType?: "linkedin" | "github" | "general"
}

interface UrlPattern {
  type: string
  name: string
  icon: string
  baseUrl: string
  placeholder: string
  example: string
  validation: {
    patterns: string[]
    message: string
  }
}

// URL patterns for different platforms
const URL_PATTERNS: Record<string, UrlPattern> = {
  linkedin: {
    type: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    baseUrl: "https://linkedin.com/in/",
    placeholder: "username",
    example: "johndoe",
    validation: {
      patterns: [
        /^https:\/\/www\.linkedin\.com\/in\/[\w-]+$/,
        /^https:\/\/linkedin\.com\/in\/[\w-]+$/,
        /^[\w-]+$/,
      ],
      message: "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)"
    }
  },
  github: {
    type: "github",
    name: "GitHub",
    icon: "🐙",
    baseUrl: "https://github.com/",
    placeholder: "username",
    example: "johndoe",
    validation: {
      patterns: [
        /^https:\/\/www\.github\.com\/[\w-]+$/,
        /^https:\/\/github\.com\/[\w-]+$/,
        /^[\w-]+$/,
      ],
      message: "Please enter a valid GitHub URL (e.g., https://github.com/username)"
    }
  },
  general: {
    type: "general",
    name: "Website",
    icon: "🌐",
    baseUrl: "https://",
    placeholder: "example.com",
    example: "www.example.com",
    validation: {
      patterns: [
        /^https?:\/\/.+\..+/,
      ],
      message: "Please enter a valid URL (e.g., https://example.com)"
    }
  }
}

export function UrlAutocomplete({
  value = "",
  onChange,
  placeholder,
  disabled,
  required,
  className,
  onBlur,
  "data-section-id": sectionId,
  "data-field-name": fieldName,
  "aria-invalid": ariaInvalid,
  urlType = "general"
}: UrlAutocompleteProps) {
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [pattern, setPattern] = useState<UrlPattern>(URL_PATTERNS[urlType])
  const [showHelp, setShowHelp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isPastingRef = useRef(false)
  const previousValueRef = useRef("")

  // Detect URL type based on field name
  const detectUrlType = useCallback((fieldName?: string): string => {
    if (!fieldName) return urlType

    const name = fieldName.toLowerCase()
    if (name.includes('linkedin')) return 'linkedin'
    if (name.includes('github')) return 'github'
    return urlType
  }, [urlType])

  // Initialize pattern based on field name
  useEffect(() => {
    const detectedType = detectUrlType(fieldName)
    setPattern(URL_PATTERNS[detectedType])
  }, [fieldName, detectUrlType])

  // Smart URL parsing - extracts username from pasted URLs
  const parseUrl = useCallback((input: string, currentPattern: UrlPattern): string => {
    const trimmed = input.trim()

    // If it's empty, return empty
    if (!trimmed) return ""

    // Check if it's already a full URL that matches our pattern
    if (trimmed.startsWith('http')) {
      for (const validationPattern of currentPattern.validation.patterns) {
        if (validationPattern.test(trimmed)) {
          return trimmed
        }
      }
    }

    // Try to extract username from various URL formats
    const urlPatterns = currentPattern.type === 'linkedin'
      ? [
          // LinkedIn patterns
          /^https?:\/\/(?:www\.)?linkedin\.com\/in\/([^\/\?]+)/,
          /^https?:\/\/(?:www\.)?linkedin\.com\/in\/([^\/\?]+)\/?.*$/,
          /^linkedin\.com\/in\/([^\/\?]+)/,
          /linkedin\.com\/in\/([^\/\?]+)\/?.*$/,
          // Handle URLs without /in/ for LinkedIn
          /^https?:\/\/(?:www\.)?linkedin\.com\/([^\/\?]+)/,
          /^linkedin\.com\/([^\/\?]+)/
        ]
      : currentPattern.type === 'github'
      ? [
          // GitHub patterns
          /^https?:\/\/(?:www\.)?github\.com\/([^\/\?]+)/,
          /^github\.com\/([^\/\?]+)/,
          // Handle GitHub URLs with subpaths
          /^https?:\/\/(?:www\.)?github\.com\/([^\/\?]+)\/?.*$/,
          /^github\.com\/([^\/\?]+)\/?.*$/
        ]
      : [
          // General URL patterns
          /^https?:\/\/(.+)/,
          /^(https?:\/\/)?(.+)/
      ]

    for (const urlPattern of urlPatterns) {
      const match = trimmed.match(urlPattern)
      if (match) {
        const username = match[1] || match[2]
        if (username && username.trim()) {
          // Clean up the username
          const cleanUsername = username.replace(/\/$/, '').trim()

          if (currentPattern.type === 'general') {
            // For general URLs, reconstruct the full URL
            return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
          } else {
            // For specific platforms, construct with base URL
            return currentPattern.baseUrl + cleanUsername
          }
        }
      }
    }

    // If no pattern matches, handle as username or general URL
    if (currentPattern.type === 'general') {
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    } else {
      // For LinkedIn/GitHub, if it's just a username, add base URL
      if (!trimmed.includes('/') && !trimmed.startsWith('http')) {
        return currentPattern.baseUrl + trimmed
      }
    }

    return trimmed
  }, [])

  // Smart completion - what to show as suggestion
  const getCompletion = useCallback((input: string, currentPattern: UrlPattern): string => {
    const trimmed = input.trim()

    if (currentPattern.type === 'general') {
      if (trimmed === 'https://') return ''
      if (!trimmed.startsWith('http')) return 'https://'
      return ''
    }

    // For LinkedIn/GitHub
    if (trimmed === currentPattern.baseUrl) return ''
    if (!trimmed.startsWith('http') && !trimmed.includes('/')) {
      return currentPattern.baseUrl
    }

    return ''
  }, [])

  // Update suggestion when input value changes
  useEffect(() => {
    if (isPastingRef.current) {
      // Don't show suggestions during paste
      setShowSuggestion(false)
      return
    }

    const completion = getCompletion(value, pattern)
    if (completion && completion !== value) {
      setSuggestion(completion)
      setShowSuggestion(true)
    } else {
      setSuggestion("")
      setShowSuggestion(false)
    }

    // Show help for empty inputs
    setShowHelp(!value.trim())
  }, [value, pattern, getCompletion])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const parsedValue = parseUrl(newValue, pattern)

    if (isPastingRef.current) {
      // During paste, use the parsed value immediately
      onChange(parsedValue)
      previousValueRef.current = parsedValue
      isPastingRef.current = false
    } else {
      // During typing, show suggestion
      onChange(newValue)
      previousValueRef.current = newValue
    }
  }

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    isPastingRef.current = true
    const pastedText = e.clipboardData.getData('text')

    // Parse the pasted URL after a brief delay to allow the input value to update
    setTimeout(() => {
      const parsedValue = parseUrl(pastedText, pattern)
      if (parsedValue && parsedValue !== pastedText) {
        onChange(parsedValue)
      }
      isPastingRef.current = false
    }, 10)
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && showSuggestion && suggestion) {
      e.preventDefault()
      // Apply the suggestion
      const newValue = value + suggestion
      onChange(newValue)
      setSuggestion("")
      setShowSuggestion(false)
    } else if (e.key === "ArrowRight" && showSuggestion && suggestion) {
      e.preventDefault()
      // Apply the suggestion
      const newValue = value + suggestion
      onChange(newValue)
      setSuggestion("")
      setShowSuggestion(false)
    } else if (e.key === "Escape") {
      // Dismiss suggestion
      setSuggestion("")
      setShowSuggestion(false)
    }
  }

  // Handle blur events
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Parse and clean up the input on blur
    setTimeout(() => {
      const finalValue = parseUrl(e.target.value, pattern)
      if (finalValue !== e.target.value) {
        onChange(finalValue)
      }
      setSuggestion("")
      setShowSuggestion(false)
      setShowHelp(false)
    }, 150)

    if (onBlur) {
      onBlur(e)
    }
  }

  // Handle click on suggestion
  const handleSuggestionClick = () => {
    if (suggestion) {
      const newValue = value + suggestion
      onChange(newValue)
      setSuggestion("")
      setShowSuggestion(false)
      inputRef.current?.focus()
    }
  }

  // Handle focus
  const handleFocus = () => {
    if (!value.trim()) {
      // Pre-fill with base URL on focus
      if (pattern.type !== 'general') {
        onChange(pattern.baseUrl)
        setShowHelp(false)
      }
    }
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="url"
        value={value}
        onChange={handleInputChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder || pattern.placeholder}
        disabled={disabled}
        required={required}
        className={cn("pr-12", className)}
        data-section-id={sectionId}
        data-field-name={fieldName}
        aria-invalid={ariaInvalid}
      />

      {/* Platform indicator */}
      {pattern.type !== 'general' && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
          {pattern.icon}
        </div>
      )}

      {/* Suggestion overlay */}
      {showSuggestion && suggestion && (
        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
          <div
            className="h-full flex items-center bg-background border border-l-0 border-input rounded-r-md px-3 text-muted-foreground cursor-pointer pointer-events-auto hover:bg-accent hover:text-accent-foreground transition-colors active:bg-accent/80 min-w-fit touch-manipulation"
            onClick={handleSuggestionClick}
            onTouchStart={(e) => {
              e.preventDefault()
              e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              e.currentTarget.style.backgroundColor = ''
              handleSuggestionClick()
            }}
          >
            <span className="text-sm select-none">
              {suggestion}
            </span>
            <span className="ml-2 text-xs text-muted-foreground/70 select-none">
              Tab ↹
            </span>
          </div>
        </div>
      )}

      {/* Help text overlay */}
      {showHelp && !value && pattern.type !== 'general' && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-input rounded-md shadow-md p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{pattern.icon}</span>
            <div>
              <div className="font-medium">{pattern.name} URL</div>
              <div className="text-xs text-muted-foreground">
                Example: {pattern.example} → {pattern.baseUrl}{pattern.example}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}