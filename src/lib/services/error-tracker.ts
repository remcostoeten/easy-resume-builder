/**
 * Error Tracking Service
 * Tracks and reports application errors for debugging and monitoring
 */

export interface ErrorTrackingConfig {
  enableConsoleLogging?: boolean
  enableRemoteTracking?: boolean
  remoteEndpoint?: string
  environment?: 'development' | 'staging' | 'production'
  maxErrorsToStore?: number
}

export interface TrackedError {
  id: string
  timestamp: string
  message: string
  stack?: string
  context?: Record<string, unknown>
  severity: 'info' | 'warning' | 'error' | 'critical'
  component?: string
  userId?: string
}

class ErrorTracker {
  private config: Required<ErrorTrackingConfig>
  private errorLog: TrackedError[] = []

  constructor(config: ErrorTrackingConfig = {}) {
    this.config = {
      enableConsoleLogging: config.enableConsoleLogging ?? process.env.NODE_ENV === 'development',
      enableRemoteTracking: config.enableRemoteTracking ?? false,
      remoteEndpoint: config.remoteEndpoint ?? '/api/errors',
      environment: config.environment ?? 'development',
      maxErrorsToStore: config.maxErrorsToStore ?? 100,
    }
  }

  /**
   * Track an error
   */
  trackError(
    error: Error | string,
    context?: {
      severity?: 'info' | 'warning' | 'error' | 'critical'
      component?: string
      userId?: string
      additionalContext?: Record<string, unknown>
    }
  ): TrackedError {
    const trackedError: TrackedError = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context: context?.additionalContext,
      severity: context?.severity ?? 'error',
      component: context?.component,
      userId: context?.userId,
    }

    // Store in local log
    this.storeError(trackedError)

    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      this.logToConsole(trackedError)
    }

    // Send to remote endpoint if enabled
    if (this.config.enableRemoteTracking) {
      this.sendToRemote(trackedError).catch((err) => {
        console.error('Failed to send error to remote tracker:', err)
      })
    }

    return trackedError
  }

  /**
   * Track an API error
   */
  trackApiError(
    endpoint: string,
    status: number,
    error: Error | string,
    context?: Record<string, unknown>
  ): TrackedError {
    return this.trackError(error, {
      severity: status >= 500 ? 'critical' : 'error',
      component: `API:${endpoint}`,
      additionalContext: {
        endpoint,
        status,
        ...context,
      },
    })
  }

  /**
   * Track a performance issue
   */
  trackPerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context?: Record<string, unknown>
  ): TrackedError {
    return this.trackError(`Performance issue: ${metric} exceeded threshold`, {
      severity: 'warning',
      component: 'Performance',
      additionalContext: {
        metric,
        value,
        threshold,
        ...context,
      },
    })
  }

  /**
   * Get all tracked errors
   */
  getErrors(): TrackedError[] {
    return [...this.errorLog]
  }

  /**
   * Get errors filtered by severity
   */
  getErrorsBySeverity(severity: 'info' | 'warning' | 'error' | 'critical'): TrackedError[] {
    return this.errorLog.filter((e) => e.severity === severity)
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = []
  }

  /**
   * Export error log for debugging
   */
  exportErrorLog(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        environment: this.config.environment,
        errors: this.errorLog,
      },
      null,
      2
    )
  }

  /**
   * Private methods
   */

  private storeError(error: TrackedError): void {
    this.errorLog.push(error)

    // Keep only the most recent errors
    if (this.errorLog.length > this.config.maxErrorsToStore) {
      this.errorLog = this.errorLog.slice(-this.config.maxErrorsToStore)
    }
  }

  private logToConsole(error: TrackedError): void {
    const icon = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🔴',
    }[error.severity]

    console.group(
      `${icon} [${error.severity.toUpperCase()}] ${error.message}`
    )
    console.log('ID:', error.id)
    console.log('Time:', error.timestamp)
    if (error.component) console.log('Component:', error.component)
    if (error.stack) console.log('Stack:', error.stack)
    if (error.context) console.log('Context:', error.context)
    console.groupEnd()
  }

  private async sendToRemote(error: TrackedError): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error,
          environment: this.config.environment,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
    } catch (err) {
      // Silently fail - we don't want error tracking to cause errors
      console.debug('Error tracker failed to send to remote:', err)
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Create a singleton instance
let instance: ErrorTracker | null = null

/**
 * Get or create the error tracker instance
 */
export function getErrorTracker(config?: ErrorTrackingConfig): ErrorTracker {
  if (!instance) {
    instance = new ErrorTracker(config)
  }
  return instance
}

/**
 * Initialize error tracker with custom configuration
 */
export function initErrorTracker(config: ErrorTrackingConfig): ErrorTracker {
  instance = new ErrorTracker(config)
  return instance
}
