import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock genkit and its Google AI plugin before any imports touch them
vi.mock("genkit", () => ({
  genkit: vi.fn(() => ({
    embed: vi.fn().mockResolvedValue([{ embedding: new Array(768).fill(0.1) }]),
  })),
}))
vi.mock("@genkit-ai/googleai", () => ({
  googleAI: vi.fn(),
  textEmbedding004: "textEmbedding004",
}))
// Mock the db module so retrieveMenuItems doesn't need a real DB
vi.mock("@/src/lib/db", () => ({
  getPrisma: vi.fn(),
}))
// Mock embeddings so getEmbedding is spyable
vi.mock("@/src/lib/embeddings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../embeddings")>()
  return { ...actual, getEmbedding: vi.fn().mockResolvedValue(new Array(768).fill(0.1)) }
})

import { cosineSim, fallbackEmbed, getEmbedding } from "../embeddings"
import { retrieveMenuItems, retrieveKnowledge } from "../retrieval"
import { getPrisma } from "@/src/lib/db"

describe("cosineSim", () => {
  it("returns 1 for identical non-zero vectors", () => {
    const v = [1, 2, 3, 4]
    expect(cosineSim(v, v)).toBeCloseTo(1)
  })

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSim([1, 0, 0], [0, 1, 0])).toBeCloseTo(0)
  })

  it("returns 0 when one vector is all zeros", () => {
    expect(cosineSim([0, 0, 0], [1, 2, 3])).toBe(0)
  })

  it("handles vectors of different lengths by using the shorter length", () => {
    const result = cosineSim([1, 0], [1, 0, 0])
    expect(result).toBeCloseTo(1)
  })
})

describe("fallbackEmbed", () => {
  it("produces a vector of the correct default dimension", () => {
    const vec = fallbackEmbed("hello world")
    expect(vec).toHaveLength(128)
  })

  it("produces a vector of a custom dimension", () => {
    const vec = fallbackEmbed("test", 64)
    expect(vec).toHaveLength(64)
  })

  it("produces a normalized (unit) vector", () => {
    const vec = fallbackEmbed("senegalese restaurant menu items", 128)
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0))
    expect(norm).toBeCloseTo(1, 5)
  })

  it("returns the same vector for the same input deterministically", () => {
    const v1 = fallbackEmbed("thieboudienne poulet yassa", 128)
    const v2 = fallbackEmbed("thieboudienne poulet yassa", 128)
    expect(v1).toEqual(v2)
  })

  it("returns different vectors for different inputs", () => {
    const v1 = fallbackEmbed("thieboudienne", 128)
    const v2 = fallbackEmbed("pizza", 128)
    expect(v1).not.toEqual(v2)
  })
})

describe("retrieveMenuItems", () => {
  const mockItems = [
    {
      id: "1",
      name: "Thieboudienne",
      description: "Traditional Senegalese fish and rice",
      price: 3500,
      category: "Plats",
      isAvailable: true,
      embedding: null,
    },
    {
      id: "2",
      name: "Yassa Poulet",
      description: "Marinated chicken with onions",
      price: 3000,
      category: "Plats",
      isAvailable: true,
      embedding: null,
    },
    {
      id: "3",
      name: "Jus de Bissap",
      description: "Hibiscus flower juice",
      price: 500,
      category: "Drinks",
      isAvailable: true,
      embedding: null,
    },
  ]

  beforeEach(() => {
    vi.mocked(getPrisma).mockResolvedValue({
      menuItem: {
        findMany: vi.fn().mockResolvedValue(mockItems),
      },
    } as any)
  })

  it("returns at most k items", async () => {
    const results = await retrieveMenuItems("rest-1", "food", 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  it("ranks exact name match above unrelated items using lexical scoring", async () => {
    // Items have no embeddings so lexical scoring is used
    const results = await retrieveMenuItems("rest-1", "thieboudienne", 3)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toBe("Thieboudienne")
  })

  it("returns empty array when no items exist", async () => {
    vi.mocked(getPrisma).mockResolvedValue({
      menuItem: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as any)
    const results = await retrieveMenuItems("rest-empty", "anything", 5)
    expect(results).toHaveLength(0)
  })

  it("returns items with required fields", async () => {
    const results = await retrieveMenuItems("rest-1", "poulet", 5)
    for (const item of results) {
      expect(item).toHaveProperty("id")
      expect(item).toHaveProperty("name")
      expect(item).toHaveProperty("price")
      expect(item).toHaveProperty("score")
    }
  })
})

describe("retrieveKnowledge", () => {
  it("returns top-k chunks ranked by cosine similarity", async () => {
    const mockChunks = [
      { id: "c1", businessId: "b1", docId: "d1", content: "Our return policy is 30 days.", embedding: [1, 0, 0], chunkIndex: 0, createdAt: new Date() },
      { id: "c2", businessId: "b1", docId: "d1", content: "We ship to all regions.", embedding: [0, 1, 0], chunkIndex: 1, createdAt: new Date() },
      { id: "c3", businessId: "b1", docId: "d1", content: "Contact us at support@example.com", embedding: [0, 0, 1], chunkIndex: 2, createdAt: new Date() },
    ]

    vi.mocked(getPrisma).mockResolvedValue({
      knowledgeChunk: {
        findMany: vi.fn().mockResolvedValue(mockChunks),
      },
    } as any)

    // getEmbedding returns a vector close to chunk c1
    vi.mocked(getEmbedding).mockResolvedValue([1, 0, 0])

    const results = await retrieveKnowledge("b1", "return policy", 2)

    expect(results).toHaveLength(2)
    expect(results[0].content).toBe("Our return policy is 30 days.")
    expect(results[0].score).toBeCloseTo(1, 2)
  })

  it("returns empty array when no chunks exist", async () => {
    vi.mocked(getPrisma).mockResolvedValue({
      knowledgeChunk: { findMany: vi.fn().mockResolvedValue([]) },
    } as any)

    const results = await retrieveKnowledge("b1", "anything", 3)
    expect(results).toEqual([])
  })
})
