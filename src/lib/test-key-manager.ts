// Test file for the Gemini key manager
import { geminiKeyManager } from './gemini-key-manager'

export function testKeyManager() {
  console.log("=== Gemini API Key Manager Test ===")

  const status = geminiKeyManager.getKeyStatus()
  console.log("Key Status:", JSON.stringify(status, null, 2))

  if (status.totalKeys === 0) {
    console.log("❌ No API keys configured")
    console.log("Please set one or more of these environment variables:")
    console.log("- GOOGLE_GENERATIVE_AI_API_KEY")
    console.log("- GOOGLE_GENERATIVE_AI_API_KEY_TWO")
    console.log("- GOOGLE_GENERATIVE_AI_API_KEY_THREE")
    return
  }

  console.log(`✅ ${status.totalKeys} API key(s) configured`)
  console.log(`✅ ${status.availableKeys} key(s) available`)
  console.log(`✅ ${status.rateLimitedKeys} key(s) rate limited`)

  // Test key rotation
  try {
    const keyData = geminiKeyManager.getNextAvailableKey()
    if (keyData) {
      console.log(`✅ Successfully retrieved key ${keyData.index + 1}`)
      console.log(`Key prefix: ${keyData.key.substring(0, 8)}...`)
    } else {
      console.log("❌ No available keys")
    }
  } catch (error) {
    console.error("❌ Error getting key:", error)
  }

  // Test rate limit simulation
  if (status.totalKeys > 1) {
    console.log("\n=== Simulating Rate Limit on Key 1 ===")
    geminiKeyManager.markKeyAsRateLimited(0, 30000) // 30 seconds

    const newStatus = geminiKeyManager.getKeyStatus()
    console.log("Status after rate limiting:", JSON.stringify(newStatus, null, 2))

    const nextKey = geminiKeyManager.getNextAvailableKey()
    if (nextKey) {
      console.log(`✅ Successfully rotated to key ${nextKey.index + 1}`)
    } else {
      console.log("❌ Failed to rotate to available key")
    }
  }

  console.log("\n=== Test Complete ===")
}

// Export for manual testing in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // Uncomment to run test during development
  // testKeyManager()
}