import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockPrisma } = vi.hoisted(() => {
  const mockPrisma = {
    conversation: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  }
  return { mockPrisma }
})

vi.mock("@/src/lib/db", () => ({
  getPrisma: vi.fn().mockResolvedValue(mockPrisma),
}))

import { ConversationManager } from "@/src/lib/conversation-manager"

const RESTAURANT_ID = "rest-1"
const PHONE = "+221771234567"

function makeMsg(role: "user" | "assistant", content: string) {
  return { role, content, timestamp: new Date("2025-01-01T12:00:00Z") }
}

describe("ConversationManager.getConversation", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns [] when no conversation exists", async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(null)
    const result = await ConversationManager.getConversation(RESTAURANT_ID, PHONE)
    expect(result).toEqual([])
  })

  it("returns [] when messages field is null", async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue({ messages: null })
    const result = await ConversationManager.getConversation(RESTAURANT_ID, PHONE)
    expect(result).toEqual([])
  })

  it("parses and returns messages with Date objects", async () => {
    const raw = [makeMsg("user", "Hello"), makeMsg("assistant", "Hi there")]
    mockPrisma.conversation.findFirst.mockResolvedValue({ messages: raw })
    const result = await ConversationManager.getConversation(RESTAURANT_ID, PHONE)
    expect(result).toHaveLength(2)
    expect(result[0].role).toBe("user")
    expect(result[0].content).toBe("Hello")
    expect(result[0].timestamp).toBeInstanceOf(Date)
  })

  it("queries by restaurantId and phoneNumber", async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(null)
    await ConversationManager.getConversation(RESTAURANT_ID, PHONE)
    expect(mockPrisma.conversation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { restaurantId: RESTAURANT_ID, phoneNumber: PHONE } })
    )
  })
})

describe("ConversationManager.addMessage", () => {
  beforeEach(() => vi.clearAllMocks())

  it("creates new conversation when none exists", async () => {
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce(null)  // getConversation (messages select)
      .mockResolvedValueOnce(null)  // existingConv lookup (id select)

    await ConversationManager.addMessage(RESTAURANT_ID, PHONE, makeMsg("user", "Test"))

    expect(mockPrisma.conversation.create).toHaveBeenCalledOnce()
    const createCall = mockPrisma.conversation.create.mock.calls[0][0]
    expect(createCall.data.restaurantId).toBe(RESTAURANT_ID)
    expect(createCall.data.phoneNumber).toBe(PHONE)
    expect(createCall.data.messages).toHaveLength(1)
  })

  it("updates existing conversation when it exists", async () => {
    const existing = [makeMsg("user", "Previous message")]
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce({ messages: existing })  // getConversation
      .mockResolvedValueOnce({ id: "conv-1" })         // existingConv lookup

    await ConversationManager.addMessage(RESTAURANT_ID, PHONE, makeMsg("assistant", "Reply"))

    expect(mockPrisma.conversation.update).toHaveBeenCalledOnce()
    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.where.id).toBe("conv-1")
    expect(updateCall.data.messages).toHaveLength(2)
  })

  it("enforces 50-message limit by slicing oldest messages", async () => {
    const existing = Array.from({ length: 50 }, (_, i) =>
      makeMsg("user", `Message ${i}`)
    )
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce({ messages: existing })
      .mockResolvedValueOnce({ id: "conv-1" })

    await ConversationManager.addMessage(RESTAURANT_ID, PHONE, makeMsg("user", "Message 51"))

    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.data.messages).toHaveLength(50)
    // Last message should be the new one
    expect(updateCall.data.messages[49].content).toBe("Message 51")
    // First should be Message 1 (oldest Message 0 was dropped)
    expect(updateCall.data.messages[0].content).toBe("Message 1")
  })

  it("appends new message to end of history", async () => {
    const existing = [makeMsg("user", "First")]
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce({ messages: existing })
      .mockResolvedValueOnce({ id: "conv-1" })

    await ConversationManager.addMessage(RESTAURANT_ID, PHONE, makeMsg("assistant", "Second"))

    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.data.messages[1].content).toBe("Second")
    expect(updateCall.data.messages[1].role).toBe("assistant")
  })
})

describe("ConversationManager.getMetadata", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns {} when no conversation exists", async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(null)
    const result = await ConversationManager.getMetadata(RESTAURANT_ID, PHONE)
    expect(result).toEqual({})
  })

  it("returns {} when metadata is null", async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue({ metadata: null })
    const result = await ConversationManager.getMetadata(RESTAURANT_ID, PHONE)
    expect(result).toEqual({})
  })

  it("returns metadata object when it exists", async () => {
    const meta = { name: "Moussa", locationText: "Plateau" }
    mockPrisma.conversation.findFirst.mockResolvedValue({ metadata: meta })
    const result = await ConversationManager.getMetadata(RESTAURANT_ID, PHONE)
    expect(result).toEqual({ name: "Moussa", locationText: "Plateau" })
  })
})

describe("ConversationManager.updateMetadata", () => {
  beforeEach(() => vi.clearAllMocks())

  it("merges patch with existing metadata", async () => {
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce({ metadata: { name: "Moussa" } })
      .mockResolvedValueOnce({ id: "conv-1" })

    await ConversationManager.updateMetadata(RESTAURANT_ID, PHONE, { locationText: "Almadies" })

    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.data.metadata).toEqual({ name: "Moussa", locationText: "Almadies" })
  })

  it("overwrites keys that already exist in metadata", async () => {
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce({ metadata: { name: "Moussa", locationText: "Plateau" } })
      .mockResolvedValueOnce({ id: "conv-1" })

    await ConversationManager.updateMetadata(RESTAURANT_ID, PHONE, { name: "Ibrahima" })

    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.data.metadata.name).toBe("Ibrahima")
    expect(updateCall.data.metadata.locationText).toBe("Plateau")
  })

  it("creates conversation if none exists when setting metadata", async () => {
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce(null)  // getMetadata: no conv
      .mockResolvedValueOnce(null)  // existingConv lookup: no conv

    await ConversationManager.updateMetadata(RESTAURANT_ID, PHONE, { name: "New Customer" })

    expect(mockPrisma.conversation.create).toHaveBeenCalledOnce()
    const createCall = mockPrisma.conversation.create.mock.calls[0][0]
    expect(createCall.data.metadata).toEqual({ name: "New Customer" })
  })

  it("can set pendingOrder metadata", async () => {
    mockPrisma.conversation.findFirst
      .mockResolvedValueOnce({ metadata: {} })
      .mockResolvedValueOnce({ id: "conv-1" })

    const pendingOrder = {
      total: 5000,
      itemsSummary: "2x Thieb",
      notFoundItems: "",
      orderItems: [{ itemName: "Thieb", quantity: 2 }],
    }

    await ConversationManager.updateMetadata(RESTAURANT_ID, PHONE, { pendingOrder })

    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.data.metadata.pendingOrder).toEqual(pendingOrder)
  })
})

describe("ConversationManager.clearConversation", () => {
  beforeEach(() => vi.clearAllMocks())

  it("calls deleteMany with correct where clause", async () => {
    mockPrisma.conversation.deleteMany.mockResolvedValue({ count: 1 })
    await ConversationManager.clearConversation(RESTAURANT_ID, PHONE)
    expect(mockPrisma.conversation.deleteMany).toHaveBeenCalledWith({
      where: { restaurantId: RESTAURANT_ID, phoneNumber: PHONE }
    })
  })

  it("does not throw when no conversation to delete", async () => {
    mockPrisma.conversation.deleteMany.mockResolvedValue({ count: 0 })
    await expect(
      ConversationManager.clearConversation(RESTAURANT_ID, PHONE)
    ).resolves.toBeUndefined()
  })
})
