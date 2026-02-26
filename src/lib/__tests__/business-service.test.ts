import { describe, it, expect, vi, beforeEach } from "vitest"

// vi.hoisted ensures mockPrisma is defined before vi.mock factory runs
const { mockPrisma } = vi.hoisted(() => {
  const mockPrisma = {
    business: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    menuItem: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  }
  return { mockPrisma }
})

vi.mock("@/src/lib/db", () => ({
  getPrisma: vi.fn().mockResolvedValue(mockPrisma),
}))

import { BusinessService } from "@/src/lib/business-service"

function makePrismaRestaurant(overrides: Record<string, any> = {}) {
  return {
    id: "rest-1",
    name: "Chez Fatou",
    description: "Traditional Senegalese cuisine",
    cuisine: "Senegalese",
    whatsappNumber: "+221771234567",
    whatsappPhoneNumberId: "phone-id-1",
    whatsappAccessToken: "token-abc",
    whatsappAppSecret: "secret-xyz",
    webhookVerifyToken: "verify-tok",
    lamApiKey: "",
    lamBaseUrl: "",
    supportedLanguages: ["French", "Wolof"],
    isActive: true,
    businessType: "RESTAURANT",
    isConcierge: false,
    welcomeMessage: null,
    businessHours: null,
    specialInstructions: null,
    orderingEnabled: null,
    deliveryInfo: null,
    ownerAgeRange: null,
    ownerSex: null,
    country: null,
    userId: "user-1",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-06-01"),
    menuItems: [],
    ...overrides,
  }
}

describe("BusinessService.getBusinessById", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when restaurant not found", async () => {
    mockPrisma.business.findUnique.mockResolvedValue(null)
    const result = await BusinessService.getBusinessById("nonexistent")
    expect(result).toBeNull()
  })

  it("maps prisma record to Restaurant domain object", async () => {
    mockPrisma.business.findUnique.mockResolvedValue(makePrismaRestaurant())
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result).not.toBeNull()
    expect(result!.id).toBe("rest-1")
    expect(result!.name).toBe("Chez Fatou")
    expect(result!.cuisine).toBe("Senegalese")
    expect(result!.isActive).toBe(true)
  })

  it("maps menuItems correctly", async () => {
    const menuItems = [
      { id: "item-1", name: "Thieboudienne", description: "Rice and fish", price: 3500, imageUrl: null, category: "Main", isAvailable: true },
      { id: "item-2", name: "Yassa Poulet", description: "Chicken with onions", price: 2500, imageUrl: "http://img.example.com/yassa.jpg", category: "Main", isAvailable: false },
    ]
    mockPrisma.business.findUnique.mockResolvedValue(makePrismaRestaurant({ menuItems }))
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result!.menu).toHaveLength(2)
    expect(result!.menu[0].name).toBe("Thieboudienne")
    expect(result!.menu[0].price).toBe(3500)
    expect(result!.menu[1].imageUrl).toBe("http://img.example.com/yassa.jpg")
    expect(result!.menu[1].isAvailable).toBe(false)
  })

  it("falls back to default chatbot context when DB fields are null", async () => {
    mockPrisma.business.findUnique.mockResolvedValue(makePrismaRestaurant())
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result!.chatbotContext.orderingEnabled).toBe(true)
    expect(result!.chatbotContext.welcomeMessage).toContain("Chez Fatou")
    expect(result!.chatbotContext.businessHours).toBe("10:00 - 22:00 (Mon-Sun)")
  })

  it("uses actual chatbot context values when DB fields are set", async () => {
    const prismaRecord = makePrismaRestaurant({
      welcomeMessage: "Bonjour, bienvenue!",
      businessHours: "08:00 - 20:00",
      orderingEnabled: false,
    })
    mockPrisma.business.findUnique.mockResolvedValue(prismaRecord)
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result!.chatbotContext.welcomeMessage).toBe("Bonjour, bienvenue!")
    expect(result!.chatbotContext.businessHours).toBe("08:00 - 20:00")
    expect(result!.chatbotContext.orderingEnabled).toBe(false)
  })

  it("maps apiCredentials correctly", async () => {
    mockPrisma.business.findUnique.mockResolvedValue(makePrismaRestaurant())
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result!.apiCredentials.whatsappAccessToken).toBe("token-abc")
    expect(result!.apiCredentials.whatsappPhoneNumberId).toBe("phone-id-1")
    expect(result!.apiCredentials.webhookVerifyToken).toBe("verify-tok")
    expect(result!.apiCredentials.whatsappAppSecret).toBe("secret-xyz")
  })

  it("uses default supportedLanguages when array is empty", async () => {
    mockPrisma.business.findUnique.mockResolvedValue(makePrismaRestaurant({ supportedLanguages: [] }))
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result!.supportedLanguages).toEqual(["French", "English", "Wolof", "Arabic"])
  })

  it("preserves non-empty supportedLanguages", async () => {
    mockPrisma.business.findUnique.mockResolvedValue(makePrismaRestaurant({ supportedLanguages: ["French", "Wolof"] }))
    const result = await BusinessService.getBusinessById("rest-1")
    expect(result!.supportedLanguages).toEqual(["French", "Wolof"])
  })
})

describe("BusinessService.getBusinessByPhoneNumber", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when no restaurant has this phone number", async () => {
    mockPrisma.business.findFirst.mockResolvedValue(null)
    const result = await BusinessService.getBusinessByPhoneNumber("unknown-phone")
    expect(result).toBeNull()
  })

  it("returns mapped restaurant when found", async () => {
    mockPrisma.business.findFirst.mockResolvedValue(makePrismaRestaurant())
    const result = await BusinessService.getBusinessByPhoneNumber("phone-id-1")
    expect(result).not.toBeNull()
    expect(result!.apiCredentials.whatsappPhoneNumberId).toBe("phone-id-1")
    expect(mockPrisma.business.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { whatsappPhoneNumberId: "phone-id-1" } })
    )
  })
})

describe("BusinessService.getAllBusinesses", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns empty array when no restaurants exist", async () => {
    mockPrisma.business.findMany.mockResolvedValue([])
    const result = await BusinessService.getAllBusinesses()
    expect(result).toEqual([])
  })

  it("returns all restaurants when no userId filter", async () => {
    mockPrisma.business.findMany.mockResolvedValue([
      makePrismaRestaurant({ id: "r1", name: "A" }),
      makePrismaRestaurant({ id: "r2", name: "B" }),
    ])
    const result = await BusinessService.getAllBusinesses()
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe("A")
    expect(result[1].name).toBe("B")
  })

  it("passes userId filter to Prisma when provided", async () => {
    mockPrisma.business.findMany.mockResolvedValue([makePrismaRestaurant({ userId: "user-42" })])
    await BusinessService.getAllBusinesses("user-42")
    expect(mockPrisma.business.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-42" } })
    )
  })

  it("does not pass userId filter when not provided", async () => {
    mockPrisma.business.findMany.mockResolvedValue([])
    await BusinessService.getAllBusinesses()
    expect(mockPrisma.business.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    )
  })
})

describe("BusinessService.createBusiness", () => {
  beforeEach(() => vi.clearAllMocks())

  it("creates a restaurant and returns mapped domain object", async () => {
    const createdRecord = makePrismaRestaurant({ name: "New Place" })
    mockPrisma.business.create.mockResolvedValue(createdRecord)

    const result = await BusinessService.createBusiness({
      name: "New Place",
      description: "",
      cuisine: "",
      whatsappNumber: "",
      supportedLanguages: [],
      isActive: true,
      businessType: "RESTAURANT",
      isConcierge: false,
      menu: [],
      chatbotContext: { welcomeMessage: "", businessHours: "", specialInstructions: "", orderingEnabled: true, deliveryInfo: "" },
      apiCredentials: { whatsappAccessToken: "", whatsappPhoneNumberId: "", webhookVerifyToken: "", whatsappAppSecret: "", lamApiKey: "", lamBaseUrl: "" },
    })

    expect(result.name).toBe("New Place")
    expect(mockPrisma.business.create).toHaveBeenCalledOnce()
  })

  it("parses supportedLanguages from JSON string", async () => {
    const createdRecord = makePrismaRestaurant({ supportedLanguages: ["FR", "EN"] })
    mockPrisma.business.create.mockResolvedValue(createdRecord)

    await BusinessService.createBusiness({
      name: "Test",
      description: "",
      cuisine: "",
      whatsappNumber: "",
      supportedLanguages: '["FR","EN"]' as any,
      isActive: true,
      businessType: "RESTAURANT",
      isConcierge: false,
      menu: [],
      chatbotContext: { welcomeMessage: "", businessHours: "", specialInstructions: "", orderingEnabled: true, deliveryInfo: "" },
      apiCredentials: { whatsappAccessToken: "", whatsappPhoneNumberId: "", webhookVerifyToken: "", whatsappAppSecret: "", lamApiKey: "", lamBaseUrl: "" },
    })

    const callArg = mockPrisma.business.create.mock.calls[0][0]
    expect(callArg.data.supportedLanguages).toEqual(["FR", "EN"])
  })

  it("handles menu items creation with price coercion", async () => {
    const createdRecord = makePrismaRestaurant({
      menuItems: [{ id: "mi-1", name: "Thieb", description: "Fish rice", price: 3000, imageUrl: null, category: "Main", isAvailable: true }]
    })
    mockPrisma.business.create.mockResolvedValue(createdRecord)

    const result = await BusinessService.createBusiness({
      name: "Restaurant with menu",
      description: "",
      cuisine: "",
      whatsappNumber: "",
      supportedLanguages: [],
      isActive: true,
      businessType: "RESTAURANT",
      isConcierge: false,
      menu: [{ id: "mi-1", name: "Thieb", description: "Fish rice", price: 3000, isAvailable: true }],
      chatbotContext: { welcomeMessage: "", businessHours: "", specialInstructions: "", orderingEnabled: true, deliveryInfo: "" },
      apiCredentials: { whatsappAccessToken: "", whatsappPhoneNumberId: "", webhookVerifyToken: "", whatsappAppSecret: "", lamApiKey: "", lamBaseUrl: "" },
    })

    expect(result.menu).toHaveLength(1)
    expect(result.menu[0].name).toBe("Thieb")
  })
})

describe("BusinessService.updateBusiness", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns true on successful update", async () => {
    mockPrisma.$transaction.mockResolvedValue([{}])
    const result = await BusinessService.updateBusiness("rest-1", { name: "Updated Name" })
    expect(result).toBe(true)
  })

  it("returns false when transaction fails", async () => {
    mockPrisma.$transaction.mockRejectedValue(new Error("DB error"))
    const result = await BusinessService.updateBusiness("rest-1", { name: "Bad Update" })
    expect(result).toBe(false)
  })

  it("includes menu delete+create operations when menu is provided", async () => {
    mockPrisma.$transaction.mockResolvedValue([{}, {}, {}])

    await BusinessService.updateBusiness("rest-1", {
      name: "Updated",
      menu: [{ id: "mi-new", name: "New Dish", description: "Test", price: 1500, isAvailable: true }],
    })

    const transactionCall = mockPrisma.$transaction.mock.calls[0][0]
    expect(transactionCall).toHaveLength(3)
  })

  it("skips menu ops when menu not provided", async () => {
    mockPrisma.$transaction.mockResolvedValue([{}])

    await BusinessService.updateBusiness("rest-1", { name: "Only Name" })

    const transactionCall = mockPrisma.$transaction.mock.calls[0][0]
    expect(transactionCall).toHaveLength(1)
  })
})
