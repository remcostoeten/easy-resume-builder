"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedUrlInput } from "@/components/ui/segmented-url-input"
import { PhoneAutocomplete } from "@/components/ui/phone-autocomplete"
import type { HeaderContent } from "@/lib/types/resume"

interface HeaderEditorProps {
  content: any
  onUpdate: (content: HeaderContent) => void
}


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
  const [emailSuggestions, setEmailSuggestions] = useState(false)
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0)
  const [filteredEmailDomains, setFilteredEmailDomains] = useState<string[]>([])

  // Refs for handling keyboard navigation
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

  function handleLinkedInChange(value: string) {
    handleChange('linkedin', value)
  }

  function handleGithubChange(value: string) {
    handleChange('github', value)
  }

  // Keyboard navigation for suggestions
  function handleKeyDown(e: React.KeyboardEvent, type: 'email') {
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
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const isEmailInput = emailInputRef.current?.contains(target)
      const isEmailDropdown = target.closest('.absolute.top-full.left-0.right-0')

      if (!isEmailInput && !isEmailDropdown) {
        setEmailSuggestions(false)
      }
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
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <PhoneAutocomplete
            value={headerContent.phone || ""}
            onChange={(value) => handleChange('phone', value)}
            placeholder="+1 (555) 123-4567"
          />
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
          <SegmentedUrlInput
            value={headerContent.linkedin || ""}
            onChange={handleLinkedInChange}
            placeholder="johndoe"
            data-field-name="linkedin"
            urlType="linkedin"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <SegmentedUrlInput
            value={headerContent.github || ""}
            onChange={handleGithubChange}
            placeholder="johndoe"
            data-field-name="github"
            urlType="github"
          />
        </div>
      </div>
    </div>
  )
}
