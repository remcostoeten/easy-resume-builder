"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface EmailAutocompleteProps {
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
}

// Popular email domains in priority order
const POPULAR_DOMAINS = [
  // Major international providers
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "zoho.com",
  "tutanota.com",

  // Regional and niche providers
  "hotmail.nl",
  "gmx.com",
  "yandex.com",
  "mail.com",
  "me.com",
  "mac.com",
  "fastmail.com",
  "inbox.com",
  "hushmail.com",

  // ISP providers
  "comcast.net",
  "verizon.net",
  "att.net",
  "cox.net",
  "earthlink.net",
  "bellsouth.net",
  "charter.net",
  "sbcglobal.net",
  "msn.com",

  // Additional international providers
  "mail.ru",
  "qq.com",
  "163.com",
  "126.com",
  "sina.com",
  "rambler.ru",

  // Privacy and secure providers
  "posteo.de",
  "kolabnow.com",
  "startmail.com",
  "countermail.com",
  "lavabit.com",

  // Legacy and alternative providers
  "rocketmail.com"
]

export function EmailAutocomplete({
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
}: EmailAutocompleteProps) {
  const [suggestion, setSuggestion] = useState("")
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(-1)
  const [isMobile, setIsMobile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<string>("")

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Function to get email domain suggestions
  const getSuggestions = useCallback((text: string) => {
    const atIndex = text.lastIndexOf("@")
    if (atIndex === -1) return []

    const localPart = text.substring(0, atIndex)
    const domainPart = text.substring(atIndex + 1).toLowerCase()

    // If no domain characters typed yet, return top 3 suggestions
    if (domainPart === "") {
      return POPULAR_DOMAINS.slice(0, 3).map(domain => `${localPart}@${domain}`)
    }

    // Filter domains that start with what user typed
    return POPULAR_DOMAINS
      .filter(domain => domain.startsWith(domainPart))
      .map(domain => `${localPart}@${domain}`)
  }, [])

  // Update suggestion when input value changes
  useEffect(() => {
    const suggestions = getSuggestions(value)
    const topSuggestion = suggestions[0] || ""

    if (topSuggestion && topSuggestion !== value && topSuggestion.startsWith(value)) {
      setSuggestion(topSuggestion.substring(value.length))
      setShowSuggestion(true)
      suggestionRef.current = topSuggestion
    } else {
      setSuggestion("")
      setShowSuggestion(false)
      suggestionRef.current = ""
    }
    // Reset dropdown selection when suggestions change
    setSelectedDropdownIndex(-1)
  }, [value, getSuggestions])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestions = getSuggestions(value)

    if (e.key === "Tab" && showSuggestion && suggestion) {
      e.preventDefault()
      // Accept the main suggestion
      onChange(suggestionRef.current)
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    } else if (e.key === "ArrowRight" && showSuggestion && suggestion) {
      e.preventDefault()
      // Accept the main suggestion
      onChange(suggestionRef.current)
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    } else if (e.key === "ArrowDown" && showSuggestion && suggestions.length > 1) {
      e.preventDefault()
      // Navigate dropdown down
      setSelectedDropdownIndex(prev => {
        const newIndex = prev < suggestions.length - 2 ? prev + 1 : -1
        return newIndex
      })
    } else if (e.key === "ArrowUp" && showSuggestion && suggestions.length > 1) {
      e.preventDefault()
      // Navigate dropdown up
      setSelectedDropdownIndex(prev => {
        const newIndex = prev > -1 ? prev - 1 : suggestions.length - 2
        return newIndex
      })
    } else if (e.key === "Escape") {
      // Dismiss suggestion
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    } else if (e.key === "Enter") {
      // Accept dropdown selection or main suggestion
      if (selectedDropdownIndex >= 0 && suggestions.length > 1) {
        e.preventDefault()
        const selectedSuggestion = suggestions[selectedDropdownIndex + 1] // +1 because index 0 is main inline suggestion
        onChange(selectedSuggestion)
        setSuggestion("")
        setShowSuggestion(false)
        setSelectedDropdownIndex(-1)
      } else if (showSuggestion && suggestion) {
        e.preventDefault()
        onChange(suggestionRef.current)
        setSuggestion("")
        setShowSuggestion(false)
        setSelectedDropdownIndex(-1)
      }
    } else if (e.key === "1" && suggestions.length > 1) {
      // Number shortcuts for dropdown items
      e.preventDefault()
      onChange(suggestions[1])
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    } else if (e.key === "2" && suggestions.length > 2) {
      e.preventDefault()
      onChange(suggestions[2])
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    } else if (e.key === "3" && suggestions.length > 3) {
      e.preventDefault()
      onChange(suggestions[3])
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    }
  }

  // Handle blur events
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Small delay to allow clicking on suggestion
    setTimeout(() => {
      setSuggestion("")
      setShowSuggestion(false)
      setSelectedDropdownIndex(-1)
    }, 150)

    if (onBlur) {
      onBlur(e)
    }
  }

  // Handle click on suggestion
  const handleSuggestionClick = () => {
    if (suggestionRef.current) {
      onChange(suggestionRef.current)
      setSuggestion("")
      setShowSuggestion(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="email"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn("pr-2", className)}
        data-section-id={sectionId}
        data-field-name={fieldName}
        aria-invalid={ariaInvalid}
      />

      {/* Suggestion overlay */}
      {showSuggestion && suggestion && (
        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
          <div
            className="h-full flex items-center bg-background border border-l-0 border-input rounded-r-md px-3 text-muted-foreground cursor-pointer pointer-events-auto hover:bg-accent hover:text-accent-foreground transition-colors active:bg-accent/80 min-w-fit touch-manipulation"
            onClick={handleSuggestionClick}
            onMouseEnter={() => inputRef.current?.focus()}
            onTouchStart={(e) => {
              e.preventDefault()
              // Visual feedback for touch
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
              {isMobile ? "Tap" : "Tab ↹"}
            </span>
          </div>
        </div>
      )}

      {/* Dropdown for multiple suggestions */}
      {showSuggestion && getSuggestions(value).length > 1 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-input rounded-md shadow-md">
          <div className="py-1 max-h-40 overflow-auto">
            {getSuggestions(value).slice(1, 5).map((suggestionEmail, index) => (
              <button
                key={index}
                type="button"
                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between touch-manipulation min-h-[44px] ${
                  selectedDropdownIndex === index
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80'
                }`}
                onClick={() => {
                  onChange(suggestionEmail)
                  setSuggestion("")
                  setShowSuggestion(false)
                  setSelectedDropdownIndex(-1)
                }}
                onTouchStart={(e) => {
                  e.currentTarget.classList.add('bg-accent/80')
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.classList.remove('bg-accent/80')
                }}
              >
                <span className="select-none">{suggestionEmail}</span>
                <kbd className="text-xs px-2 py-1 bg-muted rounded select-none">
                  {index + 2}
                </kbd>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}