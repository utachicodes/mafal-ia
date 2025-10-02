import { NextResponse } from "next/server"
import { Registry } from "@/src/lib/registry"
import { prisma } from "@/lib/prisma"
import { retrieveMenuItems } from "@/src/lib/retrieval"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: restaurantId } = await params
    const body = await req.json().catch(() => ({} as any))
    const from = String(body?.from || "")
    const text = String(body?.text || "")

    if (!restaurantId) {
      return NextResponse.json({ ok: false, error: "Missing restaurant id" }, { status: 400 })
    }
    if (!from || !text) {
      return NextResponse.json({ ok: false, error: "Body must include 'from' and 'text'" }, { status: 400 })
    }

    // Try DB first
    const dbRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        welcomeMessage: true,
        businessHours: true,
        deliveryInfo: true,
        location: true,
        description: true,
        cuisine: true,
        orderingEnabled: true,
        // location not in schema; keep from registry only
      },
    })
    const dbMenu = await prisma.menuItem.findMany({
      where: { restaurantId },
      select: { name: true, price: true, description: true, category: true, isAvailable: true },
      orderBy: { name: "asc" },
      take: 50,
    })

    const reg = Registry.get(restaurantId)
    const cfg = dbRestaurant
      ? {
          name: "",
          description: dbRestaurant.description,
          cuisine: dbRestaurant.cuisine,
          businessHours: dbRestaurant.businessHours,
          deliveryInfo: dbRestaurant.deliveryInfo,
          location: dbRestaurant.location,
          welcomeMessage: dbRestaurant.welcomeMessage,
          orderingEnabled: dbRestaurant.orderingEnabled,
          menu: dbMenu?.map((m) => ({ name: m.name, price: m.price, description: m.description, category: m.category, isAvailable: m.isAvailable })),
        }
      : reg
    let reply: string
    if (!cfg) {
      reply = `Thanks! (No config found). You said: ${text}`
    } else {
      const lower = text.toLowerCase()
      const pieces: string[] = []
      // Full listing when user asks for a specific item/category e.g., "do you have burgers"
      const haveMatch = /(?:do you have|avez[- ]vous|est[- ]ce que vous avez|you have|have)\s+([\p{L}\p{N}\s-]+)\??/iu.exec(text)
      if (haveMatch && haveMatch[1]) {
        const queryTerm = haveMatch[1].trim()
        if (queryTerm.length >= 3) {
          const allMatches = await prisma.menuItem.findMany({
            where: {
              restaurantId,
              isAvailable: true,
              OR: [
                { name: { contains: queryTerm, mode: 'insensitive' as const } },
                { category: { contains: queryTerm, mode: 'insensitive' as const } },
                { description: { contains: queryTerm, mode: 'insensitive' as const } },
              ],
            },
            orderBy: { name: 'asc' },
            take: 50,
            select: { name: true, price: true, category: true },
          })
          if (allMatches.length > 0) {
            const line = allMatches
              .map(m => `${m.name}${Number.isFinite(m.price) ? ` (${m.price})` : ''}`)
              .join(', ')
            pieces.push(`Yes, we have ${queryTerm}: ${line}.`)
          }
        }
      }
      // Greeting / welcome
      if (cfg.welcomeMessage && /^(hi|hello|hey|salut|bonjour|bonsoir)/.test(lower)) {
        pieces.push(cfg.welcomeMessage)
      }
      // Hours
      if (/hour|open|closing|time|horaire|heures/.test(lower) && cfg.businessHours) {
        pieces.push(`Hours: ${cfg.businessHours}`)
      }
      // Delivery
      if (/deliver|livr|shipping|delivery/.test(lower) && cfg.deliveryInfo) {
        pieces.push(`Delivery: ${cfg.deliveryInfo}`)
      }
      // Location
      if (/where|address|location|adresse|situ/.test(lower) && cfg.location) {
        pieces.push(`Location: ${cfg.location}`)
      }
      // Menu lookup via retriever (DB-backed embeddings with lexical fallback)
      if (/menu|dish|plat|eat|food|order|commande|chicken|rice|poulet|riz|boisson|drink/.test(lower)) {
        const results = await retrieveMenuItems(restaurantId, text, 5)
        if (results.length > 0) {
          const line = results
            .map(r => `${r.name}${Number.isFinite(r.price) ? ` (${r.price})` : ""}`)
            .join(", ")
          pieces.push(`Recommended: ${line}.`)
        }
      }
      if (pieces.length === 0) {
        const fallbackResults = await retrieveMenuItems(restaurantId, text, 5)
        if (fallbackResults.length > 0) {
          const line = fallbackResults
            .map(r => `${r.name}${Number.isFinite(r.price) ? ` (${r.price})` : ""}`)
            .join(", ")
          pieces.push(`Recommended: ${line}.`)
        }
      }
      if (pieces.length === 0) {
        pieces.push(`Got it. You said: ${text}`)
      }
      reply = pieces.join(" \n")
    }

    return NextResponse.json({ ok: true, restaurantId, received: { from, text }, reply })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Invalid request" }, { status: 400 })
  }
}
