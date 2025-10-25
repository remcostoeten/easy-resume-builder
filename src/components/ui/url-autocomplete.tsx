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
        "^https://www\\.linkedin\\.com/in/[\\w-]+$",
        "^https://linkedin\\.com/in/[\\w-]+$",
        "^[\\w-]+$",
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
        "^https://www\\.github\\.com/[\\w-]+$",
        "^https://github\\.com/[\\w-]+$",
        "^[\\w-]+$",
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
        "^https?://.+\\..+",
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
  const [displayValue, setDisplayValue] = useState("") // What user sees in input
  const [isUpdating, setIsUpdating] = useState(false)

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

  // Extract username from full URL for display
  const extractUsername = useCallback((url: string, currentPattern: UrlPattern): string => {
    if (!url) return ""

    if (currentPattern.type === 'general') {
      return url
    }

    // For LinkedIn/GitHub, extract just the username
    const patterns = currentPattern.type === 'linkedin'
      ? [
          /^https?:\/\/(?:www\.)?linkedin\.com\/in\/([^\/\?]+)/,
          /^linkedin\.com\/in\/([^\/\?]+)/,
          /^https?:\/\/(?:www\.)?linkedin\.com\/([^\/\?]+)/,
          /^linkedin\.com\/([^\/\?]+)/
        ]
      : [
          /^https?:\/\/(?:www\.)?github\.com\/([^\/\?]+)/,
          /^github\.com\/([^\/\?]+)/
        ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1].replace(/\/$/, '').trim()
      }
    }

    // If no pattern matches, return as-is (might already be username)
    return url
  }, [])

  // Create full URL from username for storage
  const createFullUrl = useCallback((username: string, currentPattern: UrlPattern): string => {
    if (!username) return ""

    if (currentPattern.type === 'general') {
      return username.startsWith('http') ? username : `https://${username}`
    }

    return currentPattern.baseUrl + username.replace(/\/$/, '').trim()
  }, [])

  // Sync display value when external value changes
  useEffect(() => {
    if (!isUpdating) {
      const username = extractUsername(value, pattern)
      setDisplayValue(username)
    }
  }, [value, pattern, extractUsername, isUpdating])

  // Smart URL parsing - extracts username from pasted URLs for display
  const parseUrl = useCallback((input: string, currentPattern: UrlPattern): string => {
    const trimmed = input.trim()

    // If it's empty, return empty
    if (!trimmed) return ""

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
      : []

    for (const urlPattern of urlPatterns) {
      const match = trimmed.match(urlPattern)
      if (match) {
        const username = match[1]
        if (username && username.trim()) {
          // For LinkedIn/GitHub, ALWAYS return just the username for display
          return username.replace(/\/$/, '').trim()
        }
      }
    }

    // If no pattern matches and it's a specific platform, return as-is (might already be username)
    if (currentPattern.type !== 'general') {
      return trimmed
    }

    // For general URLs, return the full URL
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  }, [])

  // Smart completion - what to show as suggestion (now simplified since we only show usernames)
  const getCompletion = useCallback((input: string, currentPattern: UrlPattern): string => {
    // No more suggestions since we only show usernames for LinkedIn/GitHub
    return ''
  }, [])

  // Update suggestion when input value changes
  useEffect(() => {
    if (isPastingRef.current) {
      // Don't show suggestions during paste
      setShowSuggestion(false)
      return
    }

    const completion = getCompletion(displayValue, pattern)
    if (completion && completion !== displayValue) {
      setSuggestion(completion)
      setShowSuggestion(true)
    } else {
      setSuggestion("")
      setShowSuggestion(false)
    }

    // Show help for empty inputs
    setShowHelp(!displayValue.trim())
  }, [displayValue, pattern, getCompletion])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)

    if (isPastingRef.current) {
      // During paste, parse and store full URL
      const parsedUsername = parseUrl(newValue, pattern)
      const fullUrl = createFullUrl(parsedUsername, pattern)
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
      isPastingRef.current = false
    } else {
      // During typing, update display value and create full URL
      const fullUrl = createFullUrl(newValue, pattern)
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
    }
  }

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    isPastingRef.current = true
    const pastedText = e.clipboardData.getData('text')

    // Parse the pasted URL after a brief delay to allow the input value to update
    setTimeout(() => {
      const parsedUsername = parseUrl(pastedText, pattern)
      if (parsedUsername && parsedUsername !== pastedText) {
        setDisplayValue(parsedUsername)
        const fullUrl = createFullUrl(parsedUsername, pattern)
        setIsUpdating(true)
        onChange(fullUrl)
        setIsUpdating(false)
      }
      isPastingRef.current = false
    }, 10)
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && showSuggestion && suggestion) {
      e.preventDefault()
      // Apply the suggestion
      const newValue = displayValue + suggestion
      setDisplayValue(newValue)
      const fullUrl = createFullUrl(newValue, pattern)
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
      setSuggestion("")
      setShowSuggestion(false)
    } else if (e.key === "ArrowRight" && showSuggestion && suggestion) {
      e.preventDefault()
      // Apply the suggestion
      const newValue = displayValue + suggestion
      setDisplayValue(newValue)
      const fullUrl = createFullUrl(newValue, pattern)
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
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
      const finalUsername = parseUrl(e.target.value, pattern)
      const fullUrl = createFullUrl(finalUsername, pattern)
      if (finalUsername !== e.target.value) {
        setDisplayValue(finalUsername)
      }
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
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
      const newValue = displayValue + suggestion
      setDisplayValue(newValue)
      const fullUrl = createFullUrl(newValue, pattern)
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
      setSuggestion("")
      setShowSuggestion(false)
      inputRef.current?.focus()
    }
  }

  // Handle focus
  const handleFocus = () => {
    // No more pre-filling with base URLs since we only show usernames
    setShowHelp(true)
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="url"
        value={displayValue}
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
      {showHelp && !displayValue && pattern.type !== 'general' && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-input rounded-md shadow-md p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{pattern.icon}</span>
            <div>
              <div className="font-medium">{pattern.name} Username</div>
              <div className="text-xs text-muted-foreground">
                Enter just your username (e.g., {pattern.example})<br/>
                Smart paste: Paste full URLs like {pattern.baseUrl}{pattern.example}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}