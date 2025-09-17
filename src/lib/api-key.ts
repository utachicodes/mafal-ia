import crypto from "crypto"

export interface GeneratedKey {
  apiKey: string
  hash: string
  createdAt: Date
}

export function generateApiKey(prefix: string = "mafalia_sk_"): GeneratedKey {
  const raw = crypto.randomBytes(32).toString("base64url")
  const apiKey = `${prefix}${raw}`
  const hash = hashApiKey(apiKey)
  return { apiKey, hash, createdAt: new Date() }
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex")
}
