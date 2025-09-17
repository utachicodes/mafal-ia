export function extractApiKeyFromHeaders(headers: Headers): string | null {
  const auth = headers.get("authorization") || headers.get("Authorization")
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim()
  }
  const xKey = headers.get("x-api-key")
  if (xKey && xKey.trim().length > 0) return xKey.trim()
  return null
}
