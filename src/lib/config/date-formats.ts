export interface DateFormatConfig {
  id: string
  name: string
  flag: string
  description: string
  locale: string
  patterns: {
    display: string          // Display format (e.g., "MM/DD/YYYY")
    short: string           // Short format (e.g., "MM/DD")
    long: string            // Long format (e.g., "Month YYYY")
    full: string            // Full format (e.g., "Month Day, YYYY")
  }
  examples: {
    full: string            // Example: "December 15, 2023"
    short: string           // Example: "12/15/2023"
    month: string           // Example: "December 2023"
    range: string           // Example: "December 2022 - December 2023"
  }
  aiPrompt: string         // AI instruction for this format
  parsingInstructions: string[] // Instructions for AI parsing
}

export const DATE_FORMATS: DateFormatConfig[] = [
  {
    id: "us",
    name: "US Style",
    flag: "🇺🇸",
    description: "Month Day, Year (MM/DD/YYYY)",
    locale: "en-US",
    patterns: {
      display: "MM/DD/YYYY",
      short: "MM/DD",
      long: "MMMM YYYY",
      full: "MMMM d, yyyy"
    },
    examples: {
      full: "December 15, 2023",
      short: "12/15/2023",
      month: "December 2023",
      range: "December 2022 - December 2023"
    },
    aiPrompt: "Use US date format (Month Day, Year, e.g., December 15, 2023)",
    parsingInstructions: [
      "Use MM/DD/YYYY format (e.g., 12/15/2023)",
      "Use Month Day, Year format (e.g., December 15, 2023)",
      "Use Month Year format for month precision (e.g., December 2023)",
      "Use YYYY format for year precision (e.g., 2023)"
    ]
  },
  {
    id: "dutch",
    name: "Dutch Style",
    flag: "🇳🇱",
    description: "Day Month Year (DD-MM-YYYY)",
    locale: "nl-NL",
    patterns: {
      display: "DD-MM-YYYY",
      short: "DD-MM",
      long: "MMMM YYYY",
      full: "d MMMM yyyy"
    },
    examples: {
      full: "15 december 2023",
      short: "15-12-2023",
      month: "december 2023",
      range: "december 2022 - december 2023"
    },
    aiPrompt: "Use Dutch date format (Day Month Year, e.g., 15 december 2023)",
    parsingInstructions: [
      "Use DD-MM-YYYY format (e.g., 15-12-2023)",
      "Use Day Month Year format (e.g., 15 december 2023)",
      "Use Month Year format for month precision (e.g., december 2023)",
      "Use YYYY format for year precision (e.g., 2023)",
      "Use lowercase month names in Dutch (januari, februari, etc.)"
    ]
  },
  {
    id: "eu",
    name: "European Style",
    flag: "🇪🇺",
    description: "Day Month Year (DD/MM/YYYY)",
    locale: "en-GB",
    patterns: {
      display: "DD/MM/YYYY",
      short: "DD/MM",
      long: "MMMM YYYY",
      full: "d MMMM yyyy"
    },
    examples: {
      full: "15 December 2023",
      short: "15/12/2023",
      month: "December 2023",
      range: "December 2022 - December 2023"
    },
    aiPrompt: "Use European date format (Day Month Year, e.g., 15 December 2023)",
    parsingInstructions: [
      "Use DD/MM/YYYY format (e.g., 15/12/2023)",
      "Use Day Month Year format (e.g., 15 December 2023)",
      "Use Month Year format for month precision (e.g., December 2023)",
      "Use YYYY format for year precision (e.g., 2023)"
    ]
  },
  {
    id: "iso",
    name: "ISO Style",
    flag: "🌐",
    description: "Year-Month-Day (YYYY-MM-DD)",
    locale: "en-CA",
    patterns: {
      display: "YYYY-MM-DD",
      short: "YYYY-MM",
      long: "MMMM YYYY",
      full: "yyyy-MM-dd"
    },
    examples: {
      full: "2023-12-15",
      short: "2023-12-15",
      month: "2023-12",
      range: "2022-12 - 2023-12"
    },
    aiPrompt: "Use ISO date format (Year-Month-Day, e.g., 2023-12-15)",
    parsingInstructions: [
      "Use YYYY-MM-DD format (e.g., 2023-12-15)",
      "Use YYYY-MM format for month precision (e.g., 2023-12)",
      "Use YYYY format for year precision (e.g., 2023)"
    ]
  }
]

// Dutch month names for localization
export const DUTCH_MONTHS = {
  january: "januari",
  february: "februari",
  march: "maart",
  april: "april",
  may: "mei",
  june: "juni",
  july: "juli",
  augustus: "augustus",
  september: "september",
  october: "oktober",
  november: "november",
  december: "december"
}

// Helper function to format date according to config
export function formatDate(
  date: Date,
  format: keyof DateFormatConfig['patterns'],
  config: DateFormatConfig
): string {
  const { patterns, locale } = config

  switch (format) {
    case 'display':
    case 'full':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: format === 'full' ? 'long' : '2-digit',
        day: format === 'full' ? 'numeric' : '2-digit'
      }).format(date)

    case 'short':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)

    case 'long':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long'
      }).format(date)

    default:
      return date.toLocaleDateString(locale)
  }
}

// Helper function to parse date according to config
export function parseDate(
  dateString: string,
  config: DateFormatConfig
): Date | null {
  try {
    // Try to parse according to the config patterns
    const patterns = config.patterns

    // ISO format (YYYY-MM-DD)
    if (patterns.display === 'YYYY-MM-DD') {
      const isoMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
      if (isoMatch) {
        const [, year, month, day] = isoMatch
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }
    }

    // US format (MM/DD/YYYY or MM/DD)
    if (patterns.display === 'MM/DD/YYYY') {
      const usMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/)
      if (usMatch) {
        const [, month, day, year] = usMatch
        return new Date(
          year ? parseInt(year) : new Date().getFullYear(),
          parseInt(month) - 1,
          parseInt(day)
        )
      }
    }

    // European/Dutch format (DD/MM/YYYY or DD-MM-YYYY or DD/MM or DD-MM)
    if (patterns.display === 'DD/MM/YYYY' || patterns.display === 'DD-MM-YYYY') {
      const euMatch = dateString.match(/^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{4}))?$/)
      if (euMatch) {
        const [, day, month, year] = euMatch
        return new Date(
          year ? parseInt(year) : new Date().getFullYear(),
          parseInt(month) - 1,
          parseInt(day)
        )
      }
    }

    // Try general date parsing as fallback
    const parsed = new Date(dateString)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }

    return null
  } catch (error) {
    return null
  }
}

// Helper function to get AI instruction for date parsing
export function getAIDateInstructions(config: DateFormatConfig): string {
  return [
    `Important: Use ${config.name} date formatting throughout the resume.`,
    `Date format preference: ${config.aiPrompt}`,
    `Examples:`,
    `- Full date: ${config.examples.full}`,
    `- Short date: ${config.examples.short}`,
    `- Month only: ${config.examples.month}`,
    `- Date range: ${config.examples.range}`,
    ...config.parsingInstructions.map(instruction => `- ${instruction}`)
  ].join('\n')
}

// Helper function to validate date format
export function validateDateFormat(
  dateString: string,
  config: DateFormatConfig
): { isValid: boolean; error?: string } {
  if (!dateString.trim()) {
    return { isValid: true } // Empty is valid (optional field)
  }

  const parsed = parseDate(dateString, config)
  if (!parsed) {
    return {
      isValid: false,
      error: `Invalid ${config.name} date format. Expected format: ${config.patterns.display}`
    }
  }

  return { isValid: true }
}