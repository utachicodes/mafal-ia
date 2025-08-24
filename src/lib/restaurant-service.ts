import { prisma } from "@/src/lib/db"
import type { Restaurant, MenuItem } from "@/lib/data"
import { mockRestaurants } from "@/lib/data"
import { env } from "@/src/lib/env"

// Service for restaurant-related operations (Prisma-backed)
export class RestaurantService {
  // In-memory store for demo mode
  private static demoStore: Restaurant[] | null = null

  // Provide safe defaults so chatbot always has guidance
  private static defaultChatbotContext(restaurantName?: string) {
    return {
      welcomeMessage: `Welcome to ${restaurantName || "our restaurant"}! How can I help you today?`,
      businessHours: "10:00 - 22:00 (Mon-Sun)",
      specialInstructions:
        "Be friendly and concise. Detect the user's language (French, English, Wolof, Arabic). Offer help with menu, prices, delivery/pickup, or placing an order.",
      orderingEnabled: true,
      deliveryInfo: "Delivery available in selected zones. Fees may apply.",
    }
  }

  private static ensureDemoStore() {
    if (!this.demoStore) {
      // Deep clone mock to avoid accidental mutation of import
      this.demoStore = JSON.parse(JSON.stringify(mockRestaurants))
    }
  }

  private static async ensureSeeded() {
    if (env.DEMO_MODE) return
    const count = await prisma.restaurant.count()
    if (count > 0) return

    for (const r of mockRestaurants) {
      await prisma.restaurant.create({
        data: {
          name: r.name,
          description: r.description,
          cuisine: r.cuisine,
          whatsappNumber: r.whatsappNumber,
          whatsappPhoneNumberId: r.apiCredentials.whatsappPhoneNumberId || "",
          supportedLanguages: r.supportedLanguages,
          isActive: r.isActive,
          isConcierge: !!r.isConcierge,
          welcomeMessage: r.chatbotContext.welcomeMessage,
          businessHours: r.chatbotContext.businessHours,
          specialInstructions: r.chatbotContext.specialInstructions,
          orderingEnabled: r.chatbotContext.orderingEnabled,
          deliveryInfo: r.chatbotContext.deliveryInfo,
          menuItems: {
            create: r.menu.map((m) => ({
              name: m.name,
              description: m.description,
              price: m.price,
              category: m.category || null,
              isAvailable: m.isAvailable ?? true,
            })),
          },
        },
      })
    }
  }

  private static mapPrismaToRestaurant(p: any): Restaurant {
    const menu: MenuItem[] = (p.menuItems || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      price: m.price,
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
        whatsappAccessToken: "", // not stored in DB
        whatsappPhoneNumberId: p.whatsappPhoneNumberId ?? "",
        webhookVerifyToken: "", // not stored in DB
      },
      apiKey: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  static async getRestaurantByPhoneNumber(phoneNumberId: string): Promise<Restaurant | null> {
    if (env.DEMO_MODE) {
      this.ensureDemoStore()
      const found = this.demoStore!.find((r) => r.apiCredentials?.whatsappPhoneNumberId === phoneNumberId) || this.demoStore![0]
      return found || null
    }
    await this.ensureSeeded()
    const p = await prisma.restaurant.findFirst({
      where: { whatsappPhoneNumberId: phoneNumberId },
      include: { menuItems: true },
    })
    if (p) return this.mapPrismaToRestaurant(p)

    const anyR = await prisma.restaurant.findFirst({ include: { menuItems: true } })
    return anyR ? this.mapPrismaToRestaurant(anyR) : null
  }

  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    if (env.DEMO_MODE) {
      this.ensureDemoStore()
      return this.demoStore!.find((r) => r.id === id) || null
    }
    await this.ensureSeeded()
    const p = await prisma.restaurant.findUnique({ where: { id }, include: { menuItems: true } })
    return p ? this.mapPrismaToRestaurant(p) : null
  }

  static async getAllRestaurants(): Promise<Restaurant[]> {
    if (env.DEMO_MODE) {
      this.ensureDemoStore()
      return this.demoStore as Restaurant[]
    }
    await this.ensureSeeded()
    const list = await prisma.restaurant.findMany({ include: { menuItems: true } })
    return list.map((p: any) => this.mapPrismaToRestaurant(p))
  }

  static async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<boolean> {
    if (env.DEMO_MODE) {
      this.ensureDemoStore()
      const idx = this.demoStore!.findIndex((r) => r.id === id)
      if (idx >= 0) {
        this.demoStore![idx] = {
          ...this.demoStore![idx],
          ...updates,
          chatbotContext: { ...this.demoStore![idx].chatbotContext, ...(updates.chatbotContext || {}) },
        }
        return true
      }
      return false
    }
    await this.ensureSeeded()
    await prisma.restaurant.update({
      where: { id },
      data: {
        name: updates.name,
        description: updates.description,
        cuisine: updates.cuisine,
        whatsappNumber: updates.whatsappNumber,
        whatsappPhoneNumberId: updates.apiCredentials?.whatsappPhoneNumberId,
        supportedLanguages: updates.supportedLanguages,
        isActive: updates.isActive,
        isConcierge: updates.isConcierge,
        welcomeMessage: updates.chatbotContext?.welcomeMessage,
        businessHours: updates.chatbotContext?.businessHours,
        specialInstructions: updates.chatbotContext?.specialInstructions,
        orderingEnabled: updates.chatbotContext?.orderingEnabled,
        deliveryInfo: updates.chatbotContext?.deliveryInfo,
      },
    })
    return true
  }
}
