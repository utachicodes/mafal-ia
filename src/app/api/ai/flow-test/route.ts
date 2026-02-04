import { NextResponse } from "next/server"
import { AIClient } from "@/src/lib/ai-client"

// POST /api/ai/flow-test
// Body: { apiKey?: string (unused here), message: string, restaurantName?: string, menu?: Array<{name, description, price}>, context?: string }
// Returns: { response, detectedLanguage, usedTools, orderQuote? }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const message: string = String(body.message || "Bonjour")
    const restaurantName: string = String(body.restaurantName || "Test Restaurant")
    const menu = Array.isArray(body.menu)
      ? body.menu
      : [
          { id: "1", name: "Thieboudienne", description: "Riz au poisson", price: 3500 },
          { id: "2", name: "Yassa Poulet", description: "Poulet à l'oignon-citron", price: 3000 },
          { id: "3", name: "Burger", description: "Classic beef burger", price: 2500 },
        ]

    const restaurantContext = String(
      body.context ||
        `Business Hours: 10:00-22:00\nWelcome Message: Bienvenue / Welcome\nSpecial Instructions: Be concise and helpful.\nDelivery Info: Dakar zones.`,
    )

    const messages = [
      { id: `u_${Date.now()}`, role: "user" as const, content: message, timestamp: new Date() },
    ]

    const result = await AIClient.generateResponse(messages as any, restaurantContext, menu as any, restaurantName)
    return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Flow test error" }, { status: 500 })
  }
}

