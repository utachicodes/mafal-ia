import { NextResponse } from "next/server"
import { env } from "@/src/lib/env"
import { RestaurantService } from "@/src/lib/restaurant-service"

export async function POST(req: Request) {
  try {
    if (!env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: "ADMIN_API_TOKEN not configured" }, { status: 500 })
    }
    const auth = req.headers.get("authorization") || req.headers.get("Authorization")
    const bearer = auth && auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null
    const headerToken = req.headers.get("x-admin-token")?.trim()
    const provided = bearer || headerToken
    if (!provided || provided !== env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sample = {
      name: "Mafal Bistro",
      description: "Contemporary West African cuisine crafted with care",
      cuisine: "West African",
      whatsappNumber: "",
      supportedLanguages: ["English", "French"],
      isActive: true,
      isConcierge: false,
      chatbotContext: {
        welcomeMessage: "Welcome to Mafal Bistro! How can I assist you today?",
        businessHours: "11:00 - 23:00 (Mon-Sun)",
        specialInstructions: "Be helpful, concise, and menu-aware. Offer delivery and pickup details when relevant.",
        orderingEnabled: true,
        deliveryInfo: "Delivery within Dakar. Fees apply beyond 5km.",
      },
      menu: [
        { name: "Thieboudienne", description: "Senegalese rice and fish", price: 3500, category: "Mains", isAvailable: true },
        { name: "Yassa Poulet", description: "Chicken with onion-lemon sauce", price: 3000, category: "Mains", isAvailable: true },
        { name: "Bissap", description: "Hibiscus drink", price: 800, category: "Drinks", isAvailable: true },
      ],
      apiCredentials: {
        whatsappPhoneNumberId: "",
        whatsappAccessToken: "",
        webhookVerifyToken: "",
      },
    }

    const created = await RestaurantService.createRestaurant(sample as any)
    return NextResponse.json({ ok: true, restaurant: created })
  } catch (e: any) {
    console.error("Seed restaurant failed:", e)
    return NextResponse.json({ error: e?.message || "Failed to seed restaurant" }, { status: 500 })
  }
}
