import { describe, it, expect } from "vitest"
import { extractApiKeyFromHeaders } from "../api-auth-headers"

describe("api-auth headers", () => {
  it("extracts from Authorization: Bearer", () => {
    const h = new Headers()
    h.set("Authorization", "Bearer mafalia_sk_TEST")
    expect(extractApiKeyFromHeaders(h)).toBe("mafalia_sk_TEST")
  })

  it("extracts from lowercase authorization", () => {
    const h = new Headers()
    h.set("authorization", "bearer abc123")
    expect(extractApiKeyFromHeaders(h)).toBe("abc123")
  })

  it("extracts from x-api-key when no Authorization present", () => {
    const h = new Headers()
    h.set("x-api-key", "key_from_header")
    expect(extractApiKeyFromHeaders(h)).toBe("key_from_header")
  })

  it("returns null when missing", () => {
    const h = new Headers()
    expect(extractApiKeyFromHeaders(h)).toBeNull()
  })
})
