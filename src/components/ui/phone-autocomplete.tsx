"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface PhoneAutocompleteProps {
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

interface CountryCode {
  code: string
  name: string
  flag: string
  pattern: string
  placeholder: string
  example: string
}

// Country codes and their phone number formats
const COUNTRY_CODES: CountryCode[] = [
  // Major countries
  { code: "+1", name: "United States/Canada", flag: "🇺🇸", pattern: "+1 (XXX) XXX-XXXX", placeholder: "5551234567", example: "+1 (555) 123-4567" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", pattern: "+44 XX XXXX XXXX", placeholder: "7911123456", example: "+44 7911 123456" },
  { code: "+49", name: "Germany", flag: "🇩🇪", pattern: "+49 XXX XXXXXXX", placeholder: "1234567890", example: "+49 123 4567890" },
  { code: "+33", name: "France", flag: "🇫🇷", pattern: "+33 X XX XX XX XX", placeholder: "123456789", example: "+33 1 23 45 67 89" },
  { code: "+81", name: "Japan", flag: "🇯🇵", pattern: "+81 XX-XXXX-XXXX", placeholder: "9012345678", example: "+81 90-1234-5678" },
  { code: "+86", name: "China", flag: "🇨🇳", pattern: "+86 XXX XXXX XXXX", placeholder: "13812345678", example: "+86 138 1234 5678" },
  { code: "+91", name: "India", flag: "🇮🇳", pattern: "+91 XXXXX-XXXXX", placeholder: "9876543210", example: "+91 98765-43210" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", pattern: "+55 (XX) XXXX-XXXX", placeholder: "11987654321", example: "+55 (11) 9876-5432" },

  // European countries
  { code: "+31", name: "Netherlands", flag: "🇳🇱", pattern: "+31 XX XXXX XXXX", placeholder: "612345678", example: "+31 6 1234 5678" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", pattern: "+32 XXX XX XX XX", placeholder: "471234567", example: "+32 471 23 45 67" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", pattern: "+41 XX XXX XX XX", placeholder: "791234567", example: "+41 79 123 45 67" },
  { code: "+43", name: "Austria", flag: "🇦🇹", pattern: "+43 XXX XXXXXXX", placeholder: "66412345678", example: "+43 664 12345678" },
  { code: "+45", name: "Denmark", flag: "🇩🇰", pattern: "+45 XX XX XX XX", placeholder: "12345678", example: "+45 12 34 56 78" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", pattern: "+46 XX XXX XXXX", placeholder: "701234567", example: "+46 70 123 45 67" },
  { code: "+47", name: "Norway", flag: "🇳🇴", pattern: "+47 XXXX XXXX", placeholder: "12345678", example: "+47 1234 5678" },
  { code: "+48", name: "Poland", flag: "🇵🇱", pattern: "+48 XXX XXX XXX", placeholder: "123456789", example: "+48 123 456 789" },
  { code: "+34", name: "Spain", flag: "🇪🇸", pattern: "+34 XXX XXX XXX", placeholder: "600123456", example: "+34 600 123 456" },
  { code: "+39", name: "Italy", flag: "🇮🇹", pattern: "+39 XXX XXXXXXX", placeholder: "3123456789", example: "+39 312 3456789" },

  // Nordic countries
  { code: "+358", name: "Finland", flag: "🇫🇮", pattern: "+358 XX XXX XXXX", placeholder: "412345678", example: "+358 41 234 5678" },
  { code: "+354", name: "Iceland", flag: "🇮🇸", pattern: "+354 XXX XXXX", placeholder: "1234567", example: "+354 123 4567" },

  // Eastern Europe
  { code: "+420", name: "Czech Republic", flag: "🇨🇿", pattern: "+420 XXX XXX XXX", placeholder: "123456789", example: "+420 123 456 789" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰", pattern: "+421 XXX XXX XXX", placeholder: "912345678", example: "+421 912 345 678" },
  { code: "+36", name: "Hungary", flag: "🇭🇺", pattern: "+36 XX XXX XXX", placeholder: "301234567", example: "+36 30 123 4567" },
  { code: "+40", name: "Romania", flag: "🇷🇴", pattern: "+40 XXX XXX XXX", placeholder: "721234567", example: "+40 721 234 567" },
  { code: "+359", name: "Bulgaria", flag: "🇧🇬", pattern: "+359 XXX XXX XXX", placeholder: "881234567", example: "+359 881 234 567" },
  { code: "+381", name: "Serbia", flag: "🇷🇸", pattern: "+381 XX XXX XXXX", placeholder: "601234567", example: "+381 60 123 4567" },
  { code: "+385", name: "Croatia", flag: "🇭🇷", pattern: "+385 XX XXX XXX", placeholder: "911234567", example: "+385 91 123 4567" },

  // Asia Pacific
  { code: "+61", name: "Australia", flag: "🇦🇺", pattern: "+61 X XXXX XXXX", placeholder: "412345678", example: "+61 4 1234 5678" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿", pattern: "+64 XXX XXXX", placeholder: "211234567", example: "+64 21 123 4567" },
  { code: "+65", name: "Singapore", flag: "🇸🇬", pattern: "+65 XXXX XXXX", placeholder: "81234567", example: "+65 8123 4567" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", pattern: "+60 XX-XXX XXXX", placeholder: "123456789", example: "+60 12-345 6789" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", pattern: "+66 X-XXXX XXXX", placeholder: "812345678", example: "+66 8-1234 5678" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", pattern: "+62 XXX-XXXX XXXX", placeholder: "81234567890", example: "+62 812-3456-7890" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", pattern: "+63 XXX XXX XXXX", placeholder: "9123456789", example: "+63 912 345 6789" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", pattern: "+82 X-XXXX-XXXX", placeholder: "1012345678", example: "+82 10-1234-5678" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", pattern: "+84 XXX XXX XXXX", placeholder: "912345678", example: "+84 912 345 678" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", pattern: "+90 XXX XXX XX XX", placeholder: "5321234567", example: "+90 532 123 45 67" },

  // Middle East
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", pattern: "+966 XX XXX XXXX", placeholder: "501234567", example: "+966 50 123 4567" },
  { code: "+971", name: "UAE", flag: "🇦🇪", pattern: "+971 XX XXX XXXX", placeholder: "501234567", example: "+971 50 123 4567" },
  { code: "+972", name: "Israel", flag: "🇮🇱", pattern: "+972 X-XXX-XXXX", placeholder: "501234567", example: "+972 50-123-4567" },
  { code: "+98", name: "Iran", flag: "🇮🇷", pattern: "+98 XXX XXX XXXX", placeholder: "9123456789", example: "+98 912 345 6789" },

  // Africa
  { code: "+27", name: "South Africa", flag: "🇿🇦", pattern: "+27 XX XXX XXXX", placeholder: "821234567", example: "+27 82 123 4567" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", pattern: "+234 XXX-XXX-XXXX", placeholder: "8012345678", example: "+234 801-234-5678" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", pattern: "+20 XX XXXX XXXX", placeholder: "1012345678", example: "+20 10 1234 5678" },

  // Americas (excluding US/Canada)
  { code: "+52", name: "Mexico", flag: "🇲🇽", pattern: "+52 XXX XXX XXXX", placeholder: "1234567890", example: "+52 123 456 7890" },
  { code: "+54", name: "Argentina", flag: "🇦🇷", pattern: "+54 XXX XXX-XXXX", placeholder: "91123456789", example: "+54 911 234-56789" },
  { code: "+56", name: "Chile", flag: "🇨🇱", pattern: "+56 X XXXX XXXX", placeholder: "912345678", example: "+56 9 1234 5678" },
  { code: "+57", name: "Colombia", flag: "🇨🇴", pattern: "+57 XXX XXX XXXX", placeholder: "3012345678", example: "+57 301 234 5678" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪", pattern: "+58 XXX-XXXX-XXXX", placeholder: "4121234567", example: "+58 412-123-4567" },
  { code: "+51", name: "Peru", flag: "🇵🇪", pattern: "+51 XXX XXX XXX", placeholder: "912345678", example: "+51 912 345 678" },
]

export function PhoneAutocomplete({
  value = "",
  onChange,
  placeholder = "Phone number",
  disabled,
  required,
  className,
  onBlur,
  "data-section-id": sectionId,
  "data-field-name": fieldName,
  "aria-invalid": ariaInvalid,
}: PhoneAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<CountryCode[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<CountryCode | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formattedPhone, setFormattedPhone] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Function to detect country code and format phone number
  const formatPhoneNumber = useCallback((input: string): { formatted: string; suggestions: CountryCode[] } => {
    const cleanInput = input.replace(/[^\d+]/g, '')

    // Find matching country codes
    const matchingCountries = COUNTRY_CODES.filter(country => {
      const countryCodeWithoutPlus = country.code.replace('+', '')
      return cleanInput.startsWith('+' + countryCodeWithoutPlus) || cleanInput.startsWith(countryCodeWithoutPlus)
    })

    if (matchingCountries.length === 0) {
      // No country code match, return as is but try to add + if it looks like a country code
      if (cleanInput.match(/^\d{1,3}$/) && !input.startsWith('+')) {
        return { formatted: '+' + input, suggestions: [] }
      }
      return { formatted: input, suggestions: [] }
    }

    // Get the best match (longest country code)
    const bestMatch = matchingCountries.reduce((best, current) =>
      current.code.length > best.code.length ? current : best
    )

    // Extract remaining digits after the country code
    let remainingDigits = cleanInput
    const countryCodeWithPlus = bestMatch.code
    const countryCodeWithoutPlus = bestMatch.code.replace('+', '')

    if (cleanInput.startsWith('+' + countryCodeWithoutPlus)) {
      remainingDigits = cleanInput.substring(('+' + countryCodeWithoutPlus).length)
    } else if (cleanInput.startsWith(countryCodeWithoutPlus)) {
      remainingDigits = cleanInput.substring(countryCodeWithoutPlus.length)
    }

    // Format based on country pattern
    let formatted = bestMatch.code + ' '

    if (remainingDigits.length > 0) {
      formatted += formatAccordingToPattern(remainingDigits, bestMatch.pattern)
    }

    return {
      formatted,
      suggestions: matchingCountries.slice(0, 5) // Limit to 5 suggestions
    }
  }, [])

  // Format remaining digits according to country pattern
  const formatAccordingToPattern = (digits: string, pattern: string): string => {
    let formatted = ''
    let digitIndex = 0

    for (let i = pattern.indexOf('X'); i < pattern.length && digitIndex < digits.length; i++) {
      if (pattern[i] === 'X') {
        formatted += digits[digitIndex]
        digitIndex++
      } else {
        formatted += pattern[i]
      }
    }

    return formatted
  }

  // Update formatting when input changes
  useEffect(() => {
    const { formatted, suggestions: newSuggestions } = formatPhoneNumber(value)
    setFormattedPhone(formatted)
    setSuggestions(newSuggestions)

    if (newSuggestions.length > 0 && formatted.length > 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value, formatPhoneNumber])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault()
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault()
      setSelectedIndex(prev =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && showSuggestions) {
        e.preventDefault()
        const selected = suggestions[selectedIndex]
        setSelectedSuggestion(selected)
        setShowSuggestions(false)
        // Focus back to input
        inputRef.current?.focus()
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  // Handle suggestion selection
  const selectSuggestion = (country: CountryCode) => {
    setSelectedSuggestion(country)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Handle blur events
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 150)

    if (onBlur) {
      onBlur(e)
    }
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="tel"
        value={formattedPhone}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn("pr-12", className)}
        data-section-id={sectionId}
        data-field-name={fieldName}
        aria-invalid={ariaInvalid}
      />

      {/* Selected country indicator */}
      {selectedSuggestion && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
          {selectedSuggestion.flag}
        </div>
      )}

      {/* Country suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-input rounded-md shadow-md max-h-60 overflow-auto">
          {suggestions.map((country, index) => (
            <button
              key={country.code}
              type="button"
              className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors touch-manipulation min-h-[44px] ${
                selectedIndex === index
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80'
              }`}
              onClick={() => selectSuggestion(country)}
            >
              <span className="text-lg">{country.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{country.name}</div>
                <div className="text-xs text-muted-foreground">{country.pattern}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>{country.code}</div>
                <div className="text-xs">e.g., {country.example}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}