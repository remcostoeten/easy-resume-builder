"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SegmentedUrlInputProps {
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

interface UrlConfig {
  prefix: string
  placeholder: string
  icon: string
  name: string
}

const URL_CONFIGS: Record<string, UrlConfig> = {
  linkedin: {
    prefix: "https://linkedin.com/in/",
    placeholder: "johndoe",
    icon: "💼",
    name: "LinkedIn"
  },
  github: {
    prefix: "https://github.com/",
    placeholder: "johndoe",
    icon: "🐙",
    name: "GitHub"
  },
  general: {
    prefix: "https://",
    placeholder: "example.com",
    icon: "🌐",
    name: "Website"
  }
}

export function SegmentedUrlInput({
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
}: SegmentedUrlInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isPastingRef = useRef(false)

  // Detect URL type based on field name
  const detectUrlType = useCallback((fieldName?: string): string => {
    if (!fieldName) return urlType
    const name = fieldName.toLowerCase()
    if (name.includes('linkedin')) return 'linkedin'
    if (name.includes('github')) return 'github'
    return urlType
  }, [urlType])

  const [config] = useState<UrlConfig>(() => {
    const detectedType = detectUrlType(fieldName)
    return URL_CONFIGS[detectedType]
  })

  // Extract username from full URL for display
  const getUsernameFromUrl = useCallback((url: string): string => {
    if (!url) return ""

    if (urlType === 'general') {
      // For general URLs, remove the prefix
      if (url.startsWith(config.prefix)) {
        return url.substring(config.prefix.length)
      }
      return url
    }

    // For LinkedIn/GitHub, extract username from various formats
    const patterns = urlType === 'linkedin'
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

    // If no pattern matches, check if it starts with our prefix
    if (url.startsWith(config.prefix)) {
      return url.substring(config.prefix.length).replace(/\/$/, '').trim()
    }

    // Return as-is (might already be username)
    return url
  }, [config.prefix, urlType])

  const [username, setUsername] = useState(() => getUsernameFromUrl(value))

  // Update username when external value changes
  const [isUpdating, setIsUpdating] = useState(false)

  const updateUsernameFromValue = useCallback((newValue: string) => {
    if (!isUpdating) {
      const newUsername = getUsernameFromUrl(newValue)
      if (newUsername !== username) {
        setUsername(newUsername)
      }
    }
  }, [getUsernameFromUrl, username, isUpdating])

  // Sync with external value changes
  useEffect(() => {
    updateUsernameFromValue(value)
  }, [value, updateUsernameFromValue])

  // Handle username changes
  const handleUsernameChange = useCallback((newUsername: string) => {
    setUsername(newUsername)

    if (isPastingRef.current) {
      // During paste, we'll handle this in the paste handler
      return
    }

    // Create full URL
    const fullUrl = config.prefix + newUsername
    setIsUpdating(true)
    onChange(fullUrl)
    setIsUpdating(false)
  }, [config.prefix, onChange])

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    isPastingRef.current = true

    const pastedText = e.clipboardData.getData('text').trim()
    if (!pastedText) return

    // Extract username from pasted URL
    const extractedUsername = getUsernameFromUrl(pastedText)
    handleUsernameChange(extractedUsername)

    setTimeout(() => {
      isPastingRef.current = false
    }, 100)
  }, [getUsernameFromUrl, handleUsernameChange])

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  // Handle blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)

    // Clean up username on blur
    const cleanUsername = username.replace(/\/$/, '').trim()
    if (cleanUsername !== username) {
      handleUsernameChange(cleanUsername)
    }

    if (onBlur) {
      onBlur(e)
    }
  }, [username, handleUsernameChange, onBlur])

  // Update external value when username changes
  useEffect(() => {
    const fullUrl = config.prefix + username
    if (fullUrl !== value && !isUpdating) {
      setIsUpdating(true)
      onChange(fullUrl)
      setIsUpdating(false)
    }
  }, [username, config.prefix, value, onChange, isUpdating])

  return (
    <div className={cn(
      "relative flex items-center border rounded-md transition-colors",
      isFocused ? "ring-2 ring-ring ring-offset-2" : "",
      disabled ? "opacity-50 cursor-not-allowed" : "",
      ariaInvalid ? "border-destructive" : "border-input",
      className
    )}>
      {/* Prefix (non-editable) */}
      <div className="flex items-center px-3 py-2 bg-muted/50 border-r border-input">
        <span className="text-sm text-muted-foreground select-none">
          {config.prefix}
        </span>
        {urlType !== 'general' && (
          <span className="ml-2 text-lg">{config.icon}</span>
        )}
      </div>

      {/* Username input */}
      <Input
        ref={inputRef}
        type="text"
        value={username}
        onChange={(e) => handleUsernameChange(e.target.value)}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || config.placeholder}
        disabled={disabled}
        required={required}
        className="border-0 shadow-none focus:ring-0 focus:outline-none bg-transparent"
        data-section-id={sectionId}
        data-field-name={fieldName}
        aria-invalid={ariaInvalid}
      />

      {/* Help tooltip when focused and empty */}
      {isFocused && !username && urlType !== 'general' && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-input rounded-md shadow-md p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{config.icon}</span>
            <div>
              <div className="font-medium">{config.name} Username</div>
              <div className="text-xs text-muted-foreground">
                Enter just your username (e.g., {config.placeholder})<br/>
                Smart paste: Paste full URLs like {config.prefix}{config.placeholder}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}