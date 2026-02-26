import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockRunFlow, mockGenerateResponseFlow, mockCalculateOrderTotalFlow, mockProcessMenuFlow } = vi.hoisted(() => {
  const mockRunFlow = vi.fn()
  const mockGenerateResponseFlow = {}
  const mockCalculateOrderTotalFlow = {}
  const mockProcessMenuFlow = {}
  return { mockRunFlow, mockGenerateResponseFlow, mockCalculateOrderTotalFlow, mockProcessMenuFlow }
})

vi.mock("@/src/ai", () => ({
  generateResponseFlow: mockGenerateResponseFlow,
  calculateOrderTotalFlow: mockCalculateOrderTotalFlow,
  processMenuFlow: mockProcessMenuFlow,
}))

vi.mock("@genkit-ai/flow", () => ({
  runFlow: mockRunFlow,
}))

vi.mock("@/src/lib/embeddings", () => ({
  searchMenuItemsByVector: vi.fn().mockResolvedValue([]),
}))

import { AIClient } from "@/src/lib/ai-client"

const MESSAGES = [
  { role: "user" as const, content: "Bonjour", timestamp: new Date() },
]

const MENU_ITEMS = [
  { id: "m1", name: "Thieboudienne", description: "Rice and fish", price: 3500, isAvailable: true },
  { id: "m2", name: "Yassa Poulet", description: "Chicken and onions", price: 2500, isAvailable: true },
]

describe("AIClient.generateResponse", () => {
  beforeEach(() => vi.clearAllMocks())

  it("calls generateResponseFlow with correct parameters", async () => {
    const flowResult = { response: "Bonjour!", language: "fr", intent: "greeting" }
    mockRunFlow.mockResolvedValue(flowResult)

    const result = await AIClient.generateResponse(MESSAGES, "Some context", MENU_ITEMS, "Chez Fatou", "rest-1")

    expect(mockRunFlow).toHaveBeenCalledWith(
      mockGenerateResponseFlow,
      expect.objectContaining({
        messages: MESSAGES,
        restaurantContext: "Some context",
        menuItems: MENU_ITEMS,
        restaurantName: "Chez Fatou",
        businessId: "rest-1",
      })
    )
    expect(result).toEqual(flowResult)
  })

  it("returns fallback response when flow throws", async () => {
    mockRunFlow.mockRejectedValue(new Error("Flow crashed"))

    const result = await AIClient.generateResponse(MESSAGES, "context", MENU_ITEMS, "Chez Fatou")

    expect(result.response).toContain("difficulté technique")
    expect(result.intent).toBe("error")
  })

  it("returns fallback when flow rejects with AI_TIMEOUT error", async () => {
    // Simulate what happens when the timeout fires: the race rejects with AI_TIMEOUT
    mockRunFlow.mockRejectedValue(new Error("AI_TIMEOUT"))

    const result = await AIClient.generateResponse(MESSAGES, "context", MENU_ITEMS, "Chez Fatou")

    expect(result.intent).toBe("error")
    expect(result.response).toContain("difficulté technique")
  })

  it("uses empty businessId as default", async () => {
    mockRunFlow.mockResolvedValue({ response: "OK", language: "fr", intent: "greeting" })

    await AIClient.generateResponse(MESSAGES, "context", MENU_ITEMS, "Chez Fatou")

    expect(mockRunFlow).toHaveBeenCalledWith(
      mockGenerateResponseFlow,
      expect.objectContaining({ businessId: "" })
    )
  })
})

describe("AIClient.getMenuInformation", () => {
  beforeEach(() => vi.clearAllMocks())

  it("finds menu item by name (case-insensitive fallback)", async () => {
    const result = await AIClient.getMenuInformation("yassa", MENU_ITEMS)
    expect(result).not.toBeNull()
    expect(result!.name).toBe("Yassa Poulet")
  })

  it("finds menu item by description", async () => {
    const result = await AIClient.getMenuInformation("onions", MENU_ITEMS)
    expect(result).not.toBeNull()
    expect(result!.name).toBe("Yassa Poulet")
  })

  it("returns null when no match found", async () => {
    const result = await AIClient.getMenuInformation("pizza", MENU_ITEMS)
    expect(result).toBeNull()
  })

  it("uses vector search when businessId is provided", async () => {
    const { searchMenuItemsByVector } = await import("@/src/lib/embeddings")
    const mockSearch = vi.mocked(searchMenuItemsByVector)
    mockSearch.mockResolvedValue([
      { id: "m1", name: "Thieboudienne", description: "Rice and fish", price: 3500, isAvailable: true, score: 0.9 } as any
    ])

    const result = await AIClient.getMenuInformation("rice fish", MENU_ITEMS, "rest-1")

    expect(mockSearch).toHaveBeenCalledWith("rest-1", "rice fish", 3)
    expect(result!.name).toBe("Thieboudienne")
  })

  it("falls back to local filter when vector search returns empty", async () => {
    const { searchMenuItemsByVector } = await import("@/src/lib/embeddings")
    vi.mocked(searchMenuItemsByVector).mockResolvedValue([])

    const result = await AIClient.getMenuInformation("thieb", MENU_ITEMS, "rest-1")

    expect(result!.name).toBe("Thieboudienne")
  })

  it("falls back to local filter when vector search throws", async () => {
    const { searchMenuItemsByVector } = await import("@/src/lib/embeddings")
    vi.mocked(searchMenuItemsByVector).mockRejectedValue(new Error("Vector DB error"))

    const result = await AIClient.getMenuInformation("yassa", MENU_ITEMS, "rest-1")

    expect(result).not.toBeNull()
    expect(result!.name).toBe("Yassa Poulet")
  })
})

describe("AIClient.calculateOrder", () => {
  beforeEach(() => vi.clearAllMocks())

  it("calls calculateOrderTotalFlow with orderText and menuItems", async () => {
    const flowResult = { total: 7000, items: [] }
    mockRunFlow.mockResolvedValue(flowResult)

    const result = await AIClient.calculateOrder("2 Thieb, 1 Yassa", MENU_ITEMS)

    expect(mockRunFlow).toHaveBeenCalledWith(
      mockCalculateOrderTotalFlow,
      { orderText: "2 Thieb, 1 Yassa", menuItems: MENU_ITEMS }
    )
    expect(result).toEqual(flowResult)
  })

  it("throws when flow fails", async () => {
    mockRunFlow.mockRejectedValue(new Error("Flow error"))

    await expect(
      AIClient.calculateOrder("1 Thieb", MENU_ITEMS)
    ).rejects.toThrow("Failed to calculate order")
  })
})
