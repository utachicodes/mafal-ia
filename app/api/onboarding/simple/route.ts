import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { Registry, type RestaurantConfig, type RegistryMenuItem } from "@/src/lib/registry"
import { prisma } from "@/lib/prisma"
import { getEmbedding } from "@/src/lib/embeddings"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const name = String(body?.name || "Untitled Restaurant")
    const description = String(body?.description || "")
    const cuisine = String(body?.cuisine || "")
    const businessHours = body?.businessHours ? String(body.businessHours) : ""
    const deliveryInfo = body?.deliveryInfo ? String(body.deliveryInfo) : ""
    const location = body?.location ? String(body.location) : ""
    const welcomeMessage = body?.welcomeMessage ? String(body.welcomeMessage) : ""
    const orderingEnabled = Boolean(body?.orderingEnabled ?? true)

    let menu: RegistryMenuItem[] | undefined
    if (Array.isArray(body?.menu)) {
      menu = (body.menu as any[]).map((m) => ({
        name: String(m?.name || ""),
        description: m?.description ? String(m.description) : undefined,
        price: m?.price != null ? Number(m.price) : undefined,
        category: m?.category ? String(m.category) : undefined,
        isAvailable: m?.isAvailable != null ? Boolean(m.isAvailable) : undefined,
      })).filter((m) => m.name)
    }

    // Persist to DB: create Restaurant with minimal required fields
    const created = await prisma.restaurant.create({
      data: {
        name,
        description,
        cuisine,
        // Fill required fields with safe defaults for demo; can be updated later
        whatsappNumber: "", // not used in provider-neutral flow
        supportedLanguages: ["en"],
        userId: "demo-user", // replace with authenticated user when auth is wired
        welcomeMessage,
        businessHours,
        deliveryInfo,
        location,
        orderingEnabled,
        // other optional fields keep defaults per schema
      },
      select: { id: true },
    })

    const id = created.id
    const chatbotEndpoint = `/api/chatbots/${id}/messages`

    // Persist menu items if provided (with embeddings)
    if (menu && menu.length > 0) {
      for (const m of menu) {
        const text = [m.name, m.description, m.category].filter(Boolean).join(" \n")
        const embedding = await getEmbedding(text)
        await prisma.menuItem.create({
          data: {
            restaurantId: id,
            name: m.name,
            description: m.description ?? "",
            price: Number.isFinite(m.price as any) ? Number(m.price) : 0,
            category: m.category,
            isAvailable: m.isAvailable ?? true,
            embedding,
          },
        })
      }
    }

    // Also store in memory for immediate use
    const cfg: RestaurantConfig = {
      name,
      description,
      cuisine,
      businessHours,
      deliveryInfo,
      location,
      welcomeMessage,
      orderingEnabled,
      menu,
    }
    Registry.set(id, cfg)

    return NextResponse.json({ ok: true, restaurant: { id, name, description, cuisine }, chatbotEndpoint })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Invalid request" }, { status: 400 })
  }
}
