import { getPrisma } from "@/src/lib/db";
import type { Restaurant, MenuItem } from "@/lib/data";
import crypto from "crypto";

// Service for restaurant-related operations (Prisma-backed)
export class RestaurantService {
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

  private static async ensureSeeded() {
    // No-op: seeding is handled elsewhere when needed.
    return
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
        whatsappAccessToken: "", // intentionally not exposing tokens via API
        whatsappPhoneNumberId: p.whatsappPhoneNumberId ?? "",
        webhookVerifyToken: "", // intentionally not exposing tokens via API
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  static async getRestaurantByPhoneNumber(phoneNumberId: string): Promise<Restaurant | null> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    const p = await prisma.restaurant.findFirst({
      where: { whatsappPhoneNumberId: phoneNumberId },
      include: { menuItems: true },
    })
    if (p) return this.mapPrismaToRestaurant(p)
    return null
  }

  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    const p = await prisma.restaurant.findUnique({ where: { id }, include: { menuItems: true } })
    return p ? this.mapPrismaToRestaurant(p) : null
  }

  static async getAllRestaurants(): Promise<Restaurant[]> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    const list = await prisma.restaurant.findMany({ include: { menuItems: true } })
    return list.map((p: any) => this.mapPrismaToRestaurant(p))
  }

  static async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<boolean> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    await prisma.restaurant.update({
      where: { id },
      data: {
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

  static async createRestaurant(restaurantData: Omit<Restaurant, "id" | "createdAt" | "updatedAt">): Promise<Restaurant> {
    await this.ensureSeeded()
    const prisma = await getPrisma()
    const createdPrismaRestaurant = await prisma.restaurant.create({
      data: {
        name: restaurantData.name,
        description: restaurantData.description,
        cuisine: restaurantData.cuisine,
        whatsappNumber: restaurantData.whatsappNumber,
        whatsappPhoneNumberId: restaurantData.apiCredentials?.whatsappPhoneNumberId || "",
        whatsappAccessToken: restaurantData.apiCredentials?.whatsappAccessToken || "",
        whatsappAppSecret: (restaurantData as any)?.apiCredentials?.whatsappAppSecret || "",
        webhookVerifyToken: restaurantData.apiCredentials?.webhookVerifyToken || "",
        // Fallback owner in absence of auth: seed/admin user
        userId: (restaurantData as any)?.userId || "seed-admin",
        supportedLanguages: restaurantData.supportedLanguages || [],
        isActive: restaurantData.isActive ?? true,
        isConcierge: restaurantData.isConcierge ?? false,
        welcomeMessage: restaurantData.chatbotContext?.welcomeMessage || this.defaultChatbotContext().welcomeMessage,
        businessHours: restaurantData.chatbotContext?.businessHours || this.defaultChatbotContext().businessHours,
        specialInstructions: restaurantData.chatbotContext?.specialInstructions || this.defaultChatbotContext().specialInstructions,
        orderingEnabled: restaurantData.chatbotContext?.orderingEnabled ?? this.defaultChatbotContext().orderingEnabled,
        deliveryInfo: restaurantData.chatbotContext?.deliveryInfo || this.defaultChatbotContext().deliveryInfo,
        menuItems: {
          create: restaurantData.menu?.map((m) => ({
            name: m.name,
            description: m.description,
            price: m.price,
            category: m.category || null,
            isAvailable: m.isAvailable ?? true,
          })) || [],
        },
      },
      include: { menuItems: true },
    })
    return this.mapPrismaToRestaurant(createdPrismaRestaurant)
  }

  static async getRestaurantByApiKey(apiKey: string): Promise<Restaurant | null> {
    const prisma = await getPrisma();
    const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const p = await prisma.restaurant.findFirst({
      where: {
        apiKeyHash,
        apiKeyRevokedAt: null,
      },
      include: { menuItems: true },
    });

    if (p) return this.mapPrismaToRestaurant(p);
    return null;
  }

  // API key functionality handled via dedicated API routes
}
