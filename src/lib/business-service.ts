import { getPrisma } from "@/src/lib/db"
import type { Business, MenuItem } from "@/lib/data"

// Service for business-related operations (Prisma-backed)
export class BusinessService {
  // Provide safe defaults so chatbot always has guidance
  private static defaultChatbotContext(businessName?: string) {
    return {
      welcomeMessage: `Welcome to ${businessName || "our business"}! How can I help you today?`,
      businessHours: "10:00 - 22:00 (Mon-Sun)",
      specialInstructions:
        "Be friendly and concise. Detect the user's language (French, English, Wolof, Arabic). Offer help with menu, prices, delivery/pickup, or placing an order.",
      orderingEnabled: true,
      deliveryInfo: "Delivery available in selected zones. Fees may apply.",
    }
  }

  private static async ensureSeeded() {
    // No-op: seeding is handled elsewhere when needed.
    return
  }

  private static mapPrismaToBusiness(p: any): Business {
    const menu: MenuItem[] = (p.menuItems || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      price: m.price,
      imageUrl: m.imageUrl ?? undefined,
      category: m.category ?? undefined,
      isAvailable: m.isAvailable,
    }))

    const defaults = this.defaultChatbotContext(p?.name)

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      cuisine: p.cuisine,
      whatsappNumber: p.whatsappNumber,
      supportedLanguages: Array.isArray(p.supportedLanguages) && p.supportedLanguages.length > 0
        ? p.supportedLanguages
        : ["French", "English", "Wolof", "Arabic"],
      isActive: p.isActive,
      businessType: p.businessType as "RESTAURANT" | "RETAIL" | "SERVICE",
      isConcierge: !!p.isConcierge,
      menu,
      chatbotContext: {
        welcomeMessage: p.welcomeMessage ?? defaults.welcomeMessage,
        businessHours: p.businessHours ?? defaults.businessHours,
        specialInstructions: p.specialInstructions ?? defaults.specialInstructions,
        orderingEnabled: p.orderingEnabled ?? defaults.orderingEnabled,
        deliveryInfo: p.deliveryInfo ?? defaults.deliveryInfo,
      },
      apiCredentials: {
        whatsappAccessToken: p.whatsappAccessToken || "",
        whatsappPhoneNumberId: p.whatsappPhoneNumberId ?? "",
        webhookVerifyToken: p.webhookVerifyToken || "",
        whatsappAppSecret: p.whatsappAppSecret || "",
        lamApiKey: p.lamApiKey || "",
        lamBaseUrl: p.lamBaseUrl || "",
      },
      createdAt: p.createdAt || new Date(),
      updatedAt: p.updatedAt || new Date(),
    }
  }

  static async getBusinessByPhoneNumber(phoneNumberId: string): Promise<Business | null> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    const p = await prisma.business.findFirst({
      where: { whatsappPhoneNumberId: phoneNumberId },
      include: { menuItems: true },
    })
    if (p) return this.mapPrismaToBusiness(p)
    return null
  }

  static async getBusinessById(id: string): Promise<Business | null> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    const p = await prisma.business.findUnique({ where: { id }, include: { menuItems: true } })
    return p ? this.mapPrismaToBusiness(p) : null
  }

  static async getAllBusinesses(userId?: string): Promise<Business[]> {
    await this.ensureSeeded()
    const prisma = await getPrisma()

    const whereClause: any = {}
    if (userId) {
      whereClause.userId = userId
    }

    const list = await prisma.business.findMany({
      where: whereClause,
      include: { menuItems: true },
      orderBy: { updatedAt: 'desc' }
    })
    return list.map((p: any) => this.mapPrismaToBusiness(p))
  }

  static async updateBusiness(id: string, updates: Partial<Business>): Promise<boolean> {
    await this.ensureSeeded()
    const prisma = await getPrisma()

    const data: any = {
      name: updates.name,
      description: updates.description,
      cuisine: updates.cuisine,
      whatsappNumber: updates.whatsappNumber,
      whatsappPhoneNumberId: updates.apiCredentials?.whatsappPhoneNumberId,
      whatsappAccessToken: updates.apiCredentials?.whatsappAccessToken,
      whatsappAppSecret: (updates as any)?.apiCredentials?.whatsappAppSecret,
      webhookVerifyToken: updates.apiCredentials?.webhookVerifyToken,
      supportedLanguages: updates.supportedLanguages,
      isActive: updates.isActive,
      businessType: updates.businessType,
      isConcierge: updates.isConcierge,
      welcomeMessage: updates.chatbotContext?.welcomeMessage,
      businessHours: updates.chatbotContext?.businessHours,
      specialInstructions: updates.chatbotContext?.specialInstructions,
      orderingEnabled: updates.chatbotContext?.orderingEnabled,
      deliveryInfo: updates.chatbotContext?.deliveryInfo,
    }

    // Prepare transaction operations
    const ops = []

    // 1. Update main business fields
    ops.push(prisma.business.update({
      where: { id },
      data,
    }))

    // 2. If menu is provided, replace all items
    if (updates.menu) {
      // Delete all existing items
      ops.push(prisma.menuItem.deleteMany({
        where: { businessId: id },
      }))

      // Create new items
      if (updates.menu.length > 0) {
        ops.push(prisma.menuItem.createMany({
          data: updates.menu.map((m) => ({
            businessId: id,
            name: m.name,
            description: m.description,
            price: m.price,
            category: m.category,
            isAvailable: m.isAvailable ?? true,
            imageUrl: m.imageUrl,
          })),
        }))
      }
    }

    try {
      await prisma.$transaction(ops)
      return true
    } catch (error) {
      console.error("Failed to update business:", error)
      return false
    }
  }

  static async createBusiness(businessData: Omit<Business, "id" | "createdAt" | "updatedAt">): Promise<Business> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    // Normalize incoming payload (handles onboarding form quirks)
    const r: any = businessData || {}
    const normalizedApi = r.apiCredentials ?? {
      whatsappAccessToken: r.whatsappAccessToken ?? "",
      whatsappPhoneNumberId: r.whatsappPhoneNumberId ?? "",
      webhookVerifyToken: r.webhookVerifyToken ?? "",
      whatsappAppSecret: r.whatsappAppSecret ?? "",
    }
    let supportedLanguages: string[] = []
    if (Array.isArray(r.supportedLanguages)) supportedLanguages = r.supportedLanguages
    else if (typeof r.supportedLanguages === 'string') {
      try { const parsed = JSON.parse(r.supportedLanguages); if (Array.isArray(parsed)) supportedLanguages = parsed }
      catch { supportedLanguages = [] }
    }
    let menuArray: any[] = []
    if (Array.isArray(r.menu)) menuArray = r.menu
    else if (typeof r.menu === 'string') {
      try { const parsed = JSON.parse(r.menu); if (Array.isArray(parsed)) menuArray = parsed } catch { }
    }

    const createdPrismaBusiness = await prisma.business.create({
      data: {
        name: r.name || "",
        description: r.description ?? "",
        cuisine: r.cuisine ?? "",
        whatsappNumber: r.whatsappNumber ?? "",
        whatsappPhoneNumberId: normalizedApi?.whatsappPhoneNumberId || "",
        whatsappAccessToken: normalizedApi?.whatsappAccessToken || "",
        whatsappAppSecret: normalizedApi?.whatsappAppSecret || "",
        webhookVerifyToken: normalizedApi?.webhookVerifyToken || "",
        // Fallback owner in absence of auth: seed/admin user
        userId: r.userId || "seed-admin",
        supportedLanguages,
        isActive: r.isActive ?? true,
        businessType: r.businessType || "RESTAURANT",
        isConcierge: r.isConcierge ?? false,
        welcomeMessage: r.chatbotContext?.welcomeMessage || this.defaultChatbotContext().welcomeMessage,
        businessHours: r.chatbotContext?.businessHours || this.defaultChatbotContext().businessHours,
        specialInstructions: r.chatbotContext?.specialInstructions || this.defaultChatbotContext().specialInstructions,
        orderingEnabled: r.chatbotContext?.orderingEnabled ?? this.defaultChatbotContext().orderingEnabled,
        deliveryInfo: r.chatbotContext?.deliveryInfo || this.defaultChatbotContext().deliveryInfo,
        ownerAgeRange: r.ownerAgeRange ?? null,
        ownerSex: r.ownerSex ?? null,
        country: r.country ?? null,
        menuItems: {
          create: menuArray.map((m: any) => ({
            name: String(m.name ?? ""),
            description: String(m.description ?? ""),
            price: Number.isFinite(m?.price) ? Number(m.price) : parseInt(String(m?.price ?? 0), 10) || 0,
            category: m?.category ? String(m.category) : null,
            isAvailable: typeof m?.isAvailable === 'boolean' ? m.isAvailable : true,
          })) || [],
        },
      },
      include: { menuItems: true },
    })
    return this.mapPrismaToBusiness(createdPrismaBusiness)
  }

  // API key functionality handled via dedicated API routes
}

