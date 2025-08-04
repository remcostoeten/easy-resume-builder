import type { FieldError, FieldErrors } from "react-hook-form"

export function getFieldError(errors: FieldErrors, fieldName: string): string | undefined {
  const error = errors[fieldName] as FieldError | undefined
  return error?.message
}

export function hasFieldError(errors: FieldErrors, fieldName: string): boolean {
  return Boolean(errors[fieldName])
}

export function createFieldProps(name: string, errors: FieldErrors) {
  return {
    name,
    error: getFieldError(errors, name),
    hasError: hasFieldError(errors, name),
  }
}

export function formatValidationErrors(errors: FieldErrors): Record<string, string> {
  const formattedErrors: Record<string, string> = {}

  Object.keys(errors).forEach((key) => {
    const error = errors[key] as FieldError
    if (error?.message) {
      formattedErrors[key] = error.message
    }
  })

  return formattedErrors
}
