import { describe, it, expect } from "vitest"
import { generateApiKey, hashApiKey } from "../api-key"

describe("api-key utility", () => {
  it("generates a key with mafalia prefix and returns hash + createdAt", () => {
    const { apiKey, hash, createdAt } = generateApiKey("mafalia_sk_")
    expect(apiKey.startsWith("mafalia_sk_")).toBe(true)
    expect(typeof hash).toBe("string")
    expect(hash).toHaveLength(64) // sha256 hex length
    expect(createdAt instanceof Date).toBe(true)
  })

  it("hashes the plaintext key deterministically", () => {
    const k = "mafalia_sk_TEST"
    const h1 = hashApiKey(k)
    const h2 = hashApiKey(k)
    expect(h1).toBe(h2)
    expect(h1).toHaveLength(64)
  })

  it("matches generated hash with hashing the returned plaintext", () => {
    const { apiKey, hash } = generateApiKey()
    const recomputed = hashApiKey(apiKey)
    expect(recomputed).toBe(hash)
  })

  it("produces unique keys on subsequent calls", () => {
    const a = generateApiKey()
    const b = generateApiKey()
    expect(a.apiKey).not.toBe(b.apiKey)
    expect(a.hash).not.toBe(b.hash)
  })
})
