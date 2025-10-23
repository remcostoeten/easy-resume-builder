import { geminiKeyManager } from "@/lib/gemini-key-manager"

export async function GET() {
  try {
    const status = geminiKeyManager.getKeyStatus()

    return Response.json({
      success: true,
      isAIEnabled: geminiKeyManager.isAIEnabled(),
      keyStatus: status,
      timestamp: new Date().toISOString(),
      nextAvailableIn: status.rateLimitedKeys > 0
        ? Math.max(1, Math.ceil(
            Math.min(...status.keyStatuses
              .filter(ks => ks.rateLimitResetTime)
              .map(ks => new Date(ks.rateLimitResetTime!).getTime() - Date.now())
            ) / 1000
          ))
        : null
    })
  } catch (error) {
    console.error("Error getting AI status:", error)
    return Response.json({
      success: false,
      error: "Failed to get AI status",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}