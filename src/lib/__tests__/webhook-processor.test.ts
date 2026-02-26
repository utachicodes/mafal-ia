import { describe, it, expect, vi, beforeEach } from "vitest"

// All vi.mock calls are hoisted by vitest above imports automatically

vi.mock("next/server", () => ({
  NextResponse: { json: vi.fn((data: any, init: any) => ({ data, init })) },
}))

vi.mock("@/src/lib/business-service", () => ({
  BusinessService: {
    getBusinessById: vi.fn(),
  },
}))

vi.mock("@/src/lib/conversation-manager", () => ({
  ConversationManager: {
    getMetadata: vi.fn(),
    updateMetadata: vi.fn(),
    addMessage: vi.fn(),
    getConversation: vi.fn(),
  },
}))

vi.mock("@/src/lib/order-service", () => ({
  OrderService: {
    createOrder: vi.fn(),
  },
}))

vi.mock("@/src/lib/ai-client", () => ({
  AIClient: {
    generateResponse: vi.fn(),
  },
}))

vi.mock("@/src/lib/whatsapp-client", () => ({
  WhatsAppClient: {
    sendMessage: vi.fn(),
    sendImage: vi.fn(),
  },
}))

import { processUnifiedMessage } from "../webhook-processor"
import { BusinessService } from "@/src/lib/business-service"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { OrderService } from "@/src/lib/order-service"
import { AIClient } from "@/src/lib/ai-client"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"

const mockRestaurant = {
  id: "rest-1",
  name: "Test Restaurant",
  isActive: true,
  description: "A test restaurant",
  cuisine: "Senegalese",
  menu: [],
  menuItems: [],
  apiCredentials: {
    whatsappAccessToken: "token-abc",
    whatsappPhoneNumberId: "phone-123",
    lamApiKey: null,
    lamBaseUrl: null,
  },
  chatbotContext: {
    businessHours: "9h-22h",
    deliveryInfo: "Available in Dakar",
  },
}

const PHONE = "+221700000001"
const MSG_ID = "msg-test-001"

beforeEach(() => {
  vi.clearAllMocks()

  vi.mocked(BusinessService.getBusinessById).mockResolvedValue(mockRestaurant as any)
  vi.mocked(ConversationManager.getMetadata).mockResolvedValue({} as any)
  vi.mocked(ConversationManager.getConversation).mockResolvedValue([] as any)
  vi.mocked(ConversationManager.addMessage).mockResolvedValue(undefined as any)
  vi.mocked(ConversationManager.updateMetadata).mockResolvedValue(undefined as any)
  vi.mocked(WhatsAppClient.sendMessage).mockResolvedValue(undefined as any)
  vi.mocked(WhatsAppClient.sendImage).mockResolvedValue(undefined as any)
  vi.mocked(AIClient.generateResponse).mockResolvedValue({
    response: "Hello! How can I help you?",
    detectedLanguage: "en",
    usedTools: [],
  } as any)
})

describe("processUnifiedMessage — pending order confirmation", () => {
  const pendingOrder = {
    total: 5000,
    itemsSummary: "2x Thieboudienne",
    notFoundItems: "",
    orderItems: [{ itemName: "Thieboudienne", quantity: 2 }],
  }

  beforeEach(() => {
    vi.mocked(ConversationManager.getMetadata).mockResolvedValue({ pendingOrder } as any)
    vi.mocked(OrderService.createOrder).mockResolvedValue({ id: "order-abcdef", total: pendingOrder.total } as any)
  })

  it("calls OrderService.createOrder when user replies 'yes'", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "yes", {})

    expect(OrderService.createOrder).toHaveBeenCalledOnce()
    expect(OrderService.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        businessId: "rest-1",
        phoneNumber: PHONE,
        total: 5000,
      })
    )
  })

  it("sends confirmation message after order creation", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "yes", {})

    expect(WhatsAppClient.sendMessage).toHaveBeenCalledOnce()
    const [, , msgText] = vi.mocked(WhatsAppClient.sendMessage).mock.calls[0]
    expect(msgText).toContain("confirmed")
    expect(msgText).toContain("5000 FCFA")
  })

  it("clears pendingOrder metadata after confirmation", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "oui", {})

    expect(ConversationManager.updateMetadata).toHaveBeenCalledWith(
      "rest-1",
      PHONE,
      { pendingOrder: undefined }
    )
  })

  it("does not call AIClient when handling a pending order reply", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "confirm", {})
    expect(AIClient.generateResponse).not.toHaveBeenCalled()
  })
})

describe("processUnifiedMessage — pending order cancellation", () => {
  const pendingOrder = {
    total: 3000,
    itemsSummary: "1x Yassa Poulet",
    notFoundItems: "",
    orderItems: [{ itemName: "Yassa Poulet", quantity: 1 }],
  }

  beforeEach(() => {
    vi.mocked(ConversationManager.getMetadata).mockResolvedValue({ pendingOrder } as any)
  })

  it("clears pending order metadata when user replies 'no'", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "no", {})

    expect(ConversationManager.updateMetadata).toHaveBeenCalledWith(
      "rest-1",
      PHONE,
      { pendingOrder: undefined }
    )
    expect(OrderService.createOrder).not.toHaveBeenCalled()
  })

  it("sends cancellation message when user replies 'cancel'", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "cancel", {})

    expect(WhatsAppClient.sendMessage).toHaveBeenCalledOnce()
    const [, , msgText] = vi.mocked(WhatsAppClient.sendMessage).mock.calls[0]
    expect(msgText).toContain("cancelled")
  })
})

describe("processUnifiedMessage — normal message flow", () => {
  it("calls AIClient.generateResponse for a regular message", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "Show me the menu", {})

    expect(AIClient.generateResponse).toHaveBeenCalledOnce()
    expect(AIClient.generateResponse).toHaveBeenCalledWith(
      expect.any(Array),   // history
      expect.any(String),  // context
      expect.any(Array),   // menuItems
      "Test Restaurant",
      "rest-1"
    )
  })

  it("sends the AI response as a WhatsApp message", async () => {
    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "What do you serve?", {})

    expect(WhatsAppClient.sendMessage).toHaveBeenCalledOnce()
    const [, , msgText] = vi.mocked(WhatsAppClient.sendMessage).mock.calls[0]
    expect(msgText).toContain("Hello!")
  })

  it("returns early when restaurant is not found", async () => {
    vi.mocked(BusinessService.getBusinessById).mockResolvedValue(null as any)

    await processUnifiedMessage("rest-missing", PHONE, MSG_ID, "hello", {})

    expect(AIClient.generateResponse).not.toHaveBeenCalled()
    expect(WhatsAppClient.sendMessage).not.toHaveBeenCalled()
  })

  it("returns early when restaurant is inactive", async () => {
    vi.mocked(BusinessService.getBusinessById).mockResolvedValue({
      ...mockRestaurant,
      isActive: false,
    } as any)

    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "hello", {})

    expect(AIClient.generateResponse).not.toHaveBeenCalled()
  })
})

describe("processUnifiedMessage — orderQuote handling", () => {
  it("stores pendingOrder in metadata when AI returns an orderQuote", async () => {
    const orderQuote = {
      total: 7000,
      itemsSummary: "2x Mafé",
      notFoundItems: "",
      orderItems: [{ itemName: "Mafé", quantity: 2 }],
    }
    vi.mocked(AIClient.generateResponse).mockResolvedValue({
      response: "Here is your order summary.",
      detectedLanguage: "fr",
      usedTools: ["calculateOrderTotal"],
      orderQuote,
    } as any)

    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "I want 2 mafé", {})

    expect(ConversationManager.updateMetadata).toHaveBeenCalledWith(
      "rest-1",
      PHONE,
      { pendingOrder: orderQuote }
    )
  })

  it("appends confirmation prompt to message when orderQuote is present", async () => {
    const orderQuote = {
      total: 4500,
      itemsSummary: "1x Yassa",
      notFoundItems: "",
      orderItems: [{ itemName: "Yassa", quantity: 1 }],
    }
    vi.mocked(AIClient.generateResponse).mockResolvedValue({
      response: "Great choice!",
      detectedLanguage: "en",
      usedTools: [],
      orderQuote,
    } as any)

    await processUnifiedMessage("rest-1", PHONE, MSG_ID, "order yassa", {})

    const [, , msgText] = vi.mocked(WhatsAppClient.sendMessage).mock.calls[0]
    expect(msgText).toContain("YES")
    expect(msgText).toContain("4500 FCFA")
  })
})
