import { createGoogleGenerativeAI } from "@ai-sdk/google"

export interface APIKeyStatus {
  key: string
  isRateLimited: boolean
  rateLimitResetTime?: number
  lastUsed: number
}

class GeminiAPIKeyManager {
  private keys: string[]
  private keyStatuses: APIKeyStatus[]
  private currentIndex = 0

  constructor() {
    this.keys = this.loadAPIKeys()
    this.keyStatuses = this.keys.map(key => ({
      key,
      isRateLimited: false,
      lastUsed: 0
    }))
  }

  private loadAPIKeys(): string[] {
    const keys: string[] = []

    // Primary key
    const primaryKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (primaryKey && primaryKey !== 'your-api-key-here' && primaryKey.length > 10) {
      keys.push(primaryKey)
    }

    // Backup keys
    const backupKey2 = process.env.GOOGLE_GENERATIVE_AI_API_KEY_TWO
    if (backupKey2 && backupKey2 !== 'your-api-key-here' && backupKey2.length > 10) {
      keys.push(backupKey2)
    }

    const backupKey3 = process.env.GOOGLE_GENERATIVE_AI_API_KEY_THREE
    if (backupKey3 && backupKey3 !== 'your-api-key-here' && backupKey3.length > 10) {
      keys.push(backupKey3)
    }

    return keys
  }

  private isKeyAvailable(keyStatus: APIKeyStatus): boolean {
    if (keyStatus.isRateLimited) {
      const now = Date.now()
      const resetTime = keyStatus.rateLimitResetTime || 0

      // Reset rate limit after 60 seconds (or specified time)
      if (now > resetTime) {
        keyStatus.isRateLimited = false
        keyStatus.rateLimitResetTime = undefined
        return true
      }
      return false
    }
    return true
  }

  private findNextAvailableKey(startIndex: number): number {
    const length = this.keyStatuses.length
    for (let i = 0; i < length; i++) {
      const index = (startIndex + i) % length
      if (this.isKeyAvailable(this.keyStatuses[index])) {
        return index
      }
    }
    return -1 // No available keys
  }

  public getNextAvailableKey(): { key: string; index: number } | null {
    if (this.keys.length === 0) {
      return null
    }

    const availableIndex = this.findNextAvailableKey(this.currentIndex)

    if (availableIndex === -1) {
      return null // All keys are rate limited
    }

    this.currentIndex = availableIndex
    this.keyStatuses[availableIndex].lastUsed = Date.now()

    return {
      key: this.keyStatuses[availableIndex].key,
      index: availableIndex
    }
  }

  public markKeyAsRateLimited(keyIndex: number, retryAfter?: number) {
    if (keyIndex >= 0 && keyIndex < this.keyStatuses.length) {
      this.keyStatuses[keyIndex].isRateLimited = true
      this.keyStatuses[keyIndex].rateLimitResetTime = Date.now() + (retryAfter || 60000) // Default 60 seconds
      console.warn(`Gemini API key ${keyIndex + 1} marked as rate limited. Reset at ${new Date(this.keyStatuses[keyIndex].rateLimitResetTime!).toISOString()}`)
    }
  }

  public createGoogleGenerativeAI() {
    const keyData = this.getNextAvailableKey()

    if (!keyData) {
      throw new Error("All Gemini API keys are currently rate limited or unavailable")
    }

    return {
      client: createGoogleGenerativeAI({
        apiKey: keyData.key,
      }),
      keyIndex: keyData.index,
      keyUsed: () => keyData.key.substring(0, 8) + "...", // For logging
    }
  }

  public getKeyStatus() {
    return {
      totalKeys: this.keys.length,
      availableKeys: this.keyStatuses.filter(ks => this.isKeyAvailable(ks)).length,
      rateLimitedKeys: this.keyStatuses.filter(ks => ks.isRateLimited).length,
      currentKeyIndex: this.currentIndex,
      keyStatuses: this.keyStatuses.map((ks, index) => ({
        index: index + 1,
        isRateLimited: ks.isRateLimited,
        rateLimitResetTime: ks.rateLimitResetTime ? new Date(ks.rateLimitResetTime).toISOString() : null,
        lastUsed: new Date(ks.lastUsed).toISOString(),
      }))
    }
  }

  public isAIEnabled(): boolean {
    return this.keys.length > 0
  }

  public resetAllRateLimits() {
    this.keyStatuses.forEach(status => {
      status.isRateLimited = false
      status.rateLimitResetTime = undefined
    })
    console.log("All Gemini API key rate limits have been reset")
  }
}

// Singleton instance
export const geminiKeyManager = new GeminiAPIKeyManager()

// Helper function to handle AI calls with automatic retry
export async function executeWithRetry<T>(
  aiCall: (client: any, keyIndex: number) => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { client, keyIndex } = geminiKeyManager.createGoogleGenerativeAI()
      console.log(`[Gemini] Attempt ${attempt + 1}/${maxRetries + 1} using key ${keyIndex + 1}`)

      const result = await aiCall(client, keyIndex)
      return result
    } catch (error: any) {
      lastError = error

      // Check if this is a rate limit error
      const errorMessage = error?.message?.toLowerCase() || ''
      const isRateLimit = errorMessage.includes('rate limit') ||
                         errorMessage.includes('quota exceeded') ||
                         errorMessage.includes('too many requests')

      if (isRateLimit && attempt < maxRetries) {
        // Extract retry time from error if available
        const retryMatch = error?.message?.match(/retry after (\d+)/i)
        const retryAfter = retryMatch ? parseInt(retryMatch[1]) * 1000 : 60000

        // Mark current key as rate limited
        try {
          const { keyIndex } = geminiKeyManager.createGoogleGenerativeAI()
          geminiKeyManager.markKeyAsRateLimited(keyIndex, retryAfter)
        } catch (e) {
          // If we can't even get a key, break
          break
        }

        console.warn(`[Gemini] Rate limit hit on attempt ${attempt + 1}, retrying with new key after ${retryAfter}ms...`)
        continue
      }

      // If it's not a rate limit error or we've exhausted retries, break
      break
    }
  }

  throw lastError || new Error('Unknown error occurred during AI call')
}