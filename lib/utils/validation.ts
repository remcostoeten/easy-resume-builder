export type ValidationResult = {
  isValid: boolean
  error?: string
  warnings?: string[]
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") return { isValid: true } // Empty is valid (required check is separate)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const warnings: string[] = []

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }

  // Check for common issues
  if (email.length > 254) {
    warnings.push("Email address is very long")
  }

  if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
    warnings.push("Email contains unusual characters")
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === "") return { isValid: true }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-().+]/g, "")

  if (cleaned.length === 0) {
    return { isValid: false, error: "Please enter a phone number" }
  }

  // Check if it's a valid phone number (10-15 digits, optionally starting with +)
  const phoneRegex = /^\+?\d{10,15}$/
  const warnings: string[] = []

  if (!phoneRegex.test(cleaned)) {
    return { isValid: false, error: "Please enter a valid phone number (10-15 digits)" }
  }

  // Check for common issues
  if (cleaned.length < 10) {
    warnings.push("Phone number seems short")
  }

  if (cleaned.startsWith("0") && cleaned.length > 10) {
    warnings.push("Phone number starts with 0 - ensure correct country code")
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim() === "") return { isValid: true }

  const warnings: string[] = []

  try {
    // Add https:// if no protocol is provided
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const urlObject = new URL(urlWithProtocol)

    // Check for common issues
    if (urlObject.protocol !== "https:" && urlObject.protocol !== "http:") {
      return { isValid: false, error: "Please enter a valid HTTP or HTTPS URL" }
    }

    if (urlObject.hostname.length === 0) {
      return { isValid: false, error: "URL must include a domain name" }
    }

    // Warnings for common issues
    if (urlObject.protocol === "http:") {
      warnings.push("Consider using HTTPS for security")
    }

    // Check for potentially dangerous patterns (more specific than previous check)
    if (url.includes("../../../") || url.includes("..\\") || url.includes("javascript:") ||
        url.includes("data:") || url.includes("vbscript:") || url.includes("file:")) {
      warnings.push("URL contains potentially unsafe content")
    }

    return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
  } catch (error) {
    return { isValid: false, error: "Please enter a valid URL (e.g., https://example.com)" }
  }
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  return { isValid: true }
}

export function validateTextLength(text: string, minLength?: number, maxLength?: number): ValidationResult {
  if (!text || text.trim() === "") return { isValid: true } // Empty is handled by required validation

  const warnings: string[] = []

  if (minLength && text.length < minLength) {
    return { isValid: false, error: `Text must be at least ${minLength} characters long` }
  }

  if (maxLength && text.length > maxLength) {
    return { isValid: false, error: `Text must be no more than ${maxLength} characters long` }
  }

  // Warnings for common issues
  if (text.length < 10) {
    warnings.push("Consider adding more detail")
  }

  if (text.length > 500) {
    warnings.push("Text is quite long - consider if this fits the resume format")
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

export function validateField(type: string, value: any, fieldName?: string, options?: {
  required?: boolean
  minLength?: number
  maxLength?: number
}): ValidationResult {
  const result = { isValid: true, error: undefined, warnings: undefined }

  // Check required first
  if (options?.required) {
    const requiredResult = validateRequired(value, fieldName || "Field")
    if (!requiredResult.isValid) return requiredResult
  }

  // Type-specific validation
  switch (type) {
    case "email":
      return validateEmail(value as string)
    case "phone":
      return validatePhone(value as string)
    case "url":
      return validateUrl(value as string)
    case "text":
    case "textarea":
      return validateTextLength(value as string, options?.minLength, options?.maxLength)
    default:
      return result
  }
}

export function validateResumeData(data: any): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate required fields
  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required")
  }

  // Validate sections
  if (!data.sections || !Array.isArray(data.sections) || data.sections.length === 0) {
    errors.push("At least one section is required")
  }

  // Validate each section
  data.sections?.forEach((section: any, index: number) => {
    if (!section.title || section.title.trim() === "") {
      errors.push(`Section ${index + 1}: Title is required`)
    }

    if (!section.content) {
      errors.push(`Section ${index + 1}: Content is required`)
    }
  })

  // Check for common issues
  if (data.sections?.length > 10) {
    warnings.push("Resume has many sections - consider consolidating similar content")
  }

  if (data.sections?.length < 3) {
    warnings.push("Resume has few sections - consider adding more detail")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
