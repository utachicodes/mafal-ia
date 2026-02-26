import { NextRequest, NextResponse } from "next/server"
import { BusinessService } from "@/src/lib/business-service"

export const runtime = "nodejs"

function deriveBaseUrl(headers: Headers): string {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const proto = headers.get("x-forwarded-proto") || "https"
  const host = headers.get("x-forwarded-host") || headers.get("host") || "localhost:3000"
  return `${proto}://${host}`.replace(/\/$/, "")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const name: string | undefined = body?.name
    const description: string | undefined = body?.description
    const cuisine: string | undefined = body?.cuisine

    if (!name) return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 })

    const created = await BusinessService.createRestaurant({
      id: "temp", // ignored by service
      name,
      description: description || "",
      cuisine: cuisine || "",
      whatsappNumber: "",
      supportedLanguages: ["French", "English", "Wolof", "Arabic"],
      isActive: true,
      isConcierge: false,
      menu: [],
      chatbotContext: {
        welcomeMessage: undefined as any,
        businessHours: undefined as any,
        specialInstructions: undefined as any,
        orderingEnabled: undefined as any,
        deliveryInfo: undefined as any,
      },
      apiCredentials: {
        whatsappAccessToken: "",
        whatsappPhoneNumberId: "",
        webhookVerifyToken: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    const base = deriveBaseUrl(new Headers(req.headers))
    const chatbotEndpoint = `${base}/api/chatbots/${created.id}/messages`

    return NextResponse.json({ ok: true, restaurant: { id: created.id, name: created.name }, chatbotEndpoint })
  } catch (e) {
    console.error("[Onboarding Simple] error:", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}
