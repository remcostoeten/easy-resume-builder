"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { HeaderContent } from "@/lib/types/resume"

interface HeaderEditorProps {
  content: any
  onUpdate: (content: HeaderContent) => void
}

const COUNTRY_CODES = [
  { code: '+1', country: 'United States/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
]

const EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
  'aol.com',
  'mail.com',
  'zoho.com',
  'yandex.com'
]

export function HeaderEditor({ content, onUpdate }: HeaderEditorProps) {
  const headerContent = content as HeaderContent

  // Autocomplete states
  const [phoneSuggestions, setPhoneSuggestions] = useState(false)
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(0)
  const [emailSuggestions, setEmailSuggestions] = useState(false)
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0)
  const [filteredEmailDomains, setFilteredEmailDomains] = useState<string[]>([])

  // Refs for handling keyboard navigation
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const linkedinInputRef = useRef<HTMLInputElement>(null)
  const githubInputRef = useRef<HTMLInputElement>(null)

  function handleChange(field: keyof HeaderContent, value: string) {
    onUpdate({
      ...headerContent,
      [field]: value,
    })
  }

  // Smart URL parsing for LinkedIn and GitHub
  function parseLinkedInUrl(value: string) {
    if (!value) return value

    // Remove common prefixes if they exist
    let cleanValue = value
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/^linkedin\.com\/in\//, '')
      .replace(/^linkedin\.com/, '')
      .replace(/^@/, '')
      .trim()

    // Return empty if user cleared it
    if (!cleanValue) return ''

    // Return the profile name with linkedin.com/in/ prefix
    return `linkedin.com/in/${cleanValue}`
  }

  function parseGithubUrl(value: string) {
    if (!value) return value

    // Remove common prefixes if they exist
    let cleanValue = value
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/^github\.com\//, '')
      .replace(/^github\.com/, '')
      .replace(/^@/, '')
      .trim()

    // Return empty if user cleared it
    if (!cleanValue) return ''

    // Return the username with github.com/ prefix
    return `github.com/${cleanValue}`
  }

  // Email domain autocomplete
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    handleChange('email', value)

    // Show suggestions if there's an @ symbol and cursor is after it
    const atIndex = value.lastIndexOf('@')
    const cursorPos = e.target.selectionStart || 0

    if (atIndex > 0 && cursorPos > atIndex) {
      const domainPart = value.substring(atIndex + 1).toLowerCase()
      const filtered = EMAIL_DOMAINS.filter(domain =>
        domain.startsWith(domainPart)
      )
      setFilteredEmailDomains(filtered)
      setSelectedEmailIndex(0)
      setEmailSuggestions(filtered.length > 0)
    } else {
      setEmailSuggestions(false)
      setFilteredEmailDomains([])
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    // Show country codes if user types +
    if (value === '+') {
      setPhoneSuggestions(true)
      setSelectedPhoneIndex(0)
    } else {
      setPhoneSuggestions(false)
    }

    handleChange('phone', value)
  }

  function selectEmailDomain(domain: string) {
    const currentValue = headerContent.email || ''
    const atIndex = currentValue.lastIndexOf('@')
    if (atIndex > 0) {
      const newEmail = currentValue.substring(0, atIndex + 1) + domain
      handleChange('email', newEmail)
      setEmailSuggestions(false)
      // Focus back to input and move cursor to end
      setTimeout(() => {
        emailInputRef.current?.focus()
        emailInputRef.current?.setSelectionRange(newEmail.length, newEmail.length)
      }, 0)
    }
  }

  function selectCountryCode(code: string) {
    handleChange('phone', code + ' ')
    setPhoneSuggestions(false)
    // Focus back to input and move cursor to end
    setTimeout(() => {
      phoneInputRef.current?.focus()
      phoneInputRef.current?.setSelectionRange(code.length + 1, code.length + 1)
    }, 0)
  }

  function handleLinkedInChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const parsed = parseLinkedInUrl(value)
    handleChange('linkedin', parsed)
  }

  function handleGithubChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const parsed = parseGithubUrl(value)
    handleChange('github', parsed)
  }

  function handleLinkedInPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const parsed = parseLinkedInUrl(pastedText)
    handleChange('linkedin', parsed)
  }

  function handleGithubPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const parsed = parseGithubUrl(pastedText)
    handleChange('github', parsed)
  }

  // Keyboard navigation for suggestions
  function handleKeyDown(e: React.KeyboardEvent, type: 'email' | 'phone') {
    if (type === 'email' && emailSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedEmailIndex((prev) =>
          prev < filteredEmailDomains.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedEmailIndex((prev) =>
          prev > 0 ? prev - 1 : filteredEmailDomains.length - 1
        )
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        selectEmailDomain(filteredEmailDomains[selectedEmailIndex])
      } else if (e.key === 'Escape') {
        setEmailSuggestions(false)
      }
    } else if (type === 'phone' && phoneSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedPhoneIndex((prev) =>
          prev < COUNTRY_CODES.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedPhoneIndex((prev) =>
          prev > 0 ? prev - 1 : COUNTRY_CODES.length - 1
        )
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        selectCountryCode(COUNTRY_CODES[selectedPhoneIndex].code)
      } else if (e.key === 'Escape') {
        setPhoneSuggestions(false)
      }
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setEmailSuggestions(false)
      setPhoneSuggestions(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={headerContent.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={headerContent.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Software Engineer"
            autoComplete="organization-title"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 relative">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              value={headerContent.email}
              onChange={handleEmailChange}
              onKeyDown={(e) => handleKeyDown(e, 'email')}
              placeholder="john@example.com"
              autoComplete="email"
            />
            {/* Email domain suggestions */}
            {emailSuggestions && filteredEmailDomains.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-auto">
                {filteredEmailDomains.map((domain, index) => (
                  <div
                    key={domain}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      index === selectedEmailIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => selectEmailDomain(domain)}
                  >
                    {domain}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Input
              ref={phoneInputRef}
              id="phone"
              value={headerContent.phone}
              onChange={handlePhoneChange}
              onKeyDown={(e) => handleKeyDown(e, 'phone')}
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
            />
            {/* Country code suggestions */}
            {phoneSuggestions && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
                {COUNTRY_CODES.map((country, index) => (
                  <div
                    key={country.code}
                    className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 ${
                      index === selectedPhoneIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => selectCountryCode(country.code)}
                  >
                    <span>{country.flag}</span>
                    <span className="font-medium">{country.code}</span>
                    <span className="text-muted-foreground">{country.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={headerContent.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="San Francisco, CA"
          autoComplete="address-level2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={headerContent.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://example.com"
            autoComplete="url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            ref={linkedinInputRef}
            id="linkedin"
            value={headerContent.linkedin || ""}
            onChange={handleLinkedInChange}
            onPaste={handleLinkedInPaste}
            placeholder="linkedin.com/in/johndoe"
            autoComplete="url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            ref={githubInputRef}
            id="github"
            value={headerContent.github || ""}
            onChange={handleGithubChange}
            onPaste={handleGithubPaste}
            placeholder="github.com/johndoe"
            autoComplete="url"
          />
        </div>
      </div>
    </div>
  )
}
