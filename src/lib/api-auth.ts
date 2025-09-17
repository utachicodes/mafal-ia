import { getPrisma } from "@/src/lib/db"
import { hashApiKey } from "@/src/lib/api-key"

export interface ApiKeyValidationResult {
  valid: boolean
  restaurantId?: string
  reason?: string
}

/**
 * Extracts an API key from Authorization: Bearer <key> or x-api-key header
 */
export function extractApiKeyFromHeaders(headers: Headers): string | null {
  const auth = headers.get("authorization") || headers.get("Authorization")
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim()
  }
  const xKey = headers.get("x-api-key")
  if (xKey && xKey.trim().length > 0) return xKey.trim()
  return null
}

/**
 * Validates an API key by hashing and matching against Restaurant.apiKeyHash,
 * ensuring it's not revoked.
 */
export async function validateApiKey(apiKey: string): Promise<ApiKeyValidationResult> {
  try {
    const prisma = await getPrisma()
    const hash = hashApiKey(apiKey)
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        apiKeyHash: hash,
        apiKeyRevokedAt: null,
      },
      select: { id: true },
    })
    if (!restaurant) {
      return { valid: false, reason: "Invalid or revoked API key" }
    }
    return { valid: true, restaurantId: restaurant.id }
  } catch (e: any) {
    return { valid: false, reason: e?.message || "Validation error" }
  }
}
