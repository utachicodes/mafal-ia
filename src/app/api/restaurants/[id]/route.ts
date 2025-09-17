import { NextResponse } from "next/server"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { getPrisma } from "@/src/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const restaurant = await RestaurantService.getRestaurantById(id)
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    return NextResponse.json(restaurant)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch restaurant" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const prisma = await getPrisma()
    const existing = await prisma.restaurant.findUnique({ where: { id: params.id }, select: { userId: true, whatsappPhoneNumberId: true, webhookVerifyToken: true, whatsappAppSecret: true } })
    if (!existing) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })

    const id = params.id
    const body = await req.json()

    // Only allow specific fields to be updated via this endpoint
    const updates: any = {}

    if (body?.apiCredentials?.whatsappPhoneNumberId !== undefined) {
      updates.apiCredentials = {
        whatsappPhoneNumberId: String(body.apiCredentials.whatsappPhoneNumberId || ""),
      }
    }

    if (body?.apiCredentials?.whatsappAccessToken !== undefined) {
      updates.apiCredentials = {
        ...(updates.apiCredentials || {}),
        whatsappAccessToken: String(body.apiCredentials.whatsappAccessToken || ""),
      }
    }

    if (body?.apiCredentials?.whatsappAppSecret !== undefined) {
      updates.apiCredentials = {
        ...(updates.apiCredentials || {}),
        whatsappAppSecret: String(body.apiCredentials.whatsappAppSecret || ""),
      }
    }

    if (body?.apiCredentials?.webhookVerifyToken !== undefined) {
      updates.apiCredentials = {
        ...(updates.apiCredentials || {}),
        webhookVerifyToken: String(body.apiCredentials.webhookVerifyToken || ""),
      }
    }

    if (body?.name !== undefined) updates.name = String(body.name)
    if (body?.description !== undefined) updates.description = String(body.description)
    if (body?.cuisine !== undefined) updates.cuisine = String(body.cuisine)
    if (body?.whatsappNumber !== undefined) updates.whatsappNumber = String(body.whatsappNumber)
    if (body?.supportedLanguages !== undefined) updates.supportedLanguages = body.supportedLanguages
    if (body?.isActive !== undefined) {
      const desired = Boolean(body.isActive)
      if (desired) {
        const phoneId = updates?.apiCredentials?.whatsappPhoneNumberId ?? existing.whatsappPhoneNumberId
        const verifyToken = updates?.apiCredentials?.webhookVerifyToken ?? existing.webhookVerifyToken
        if (!phoneId || !verifyToken) {
          return NextResponse.json({ error: "Cannot activate: phone_number_id and webhook verify token are required" }, { status: 400 })
        }
      }
      updates.isActive = desired
    }

    if (body?.chatbotContext) {
      updates.chatbotContext = {
        welcomeMessage: body.chatbotContext.welcomeMessage,
        businessHours: body.chatbotContext.businessHours,
        specialInstructions: body.chatbotContext.specialInstructions,
        orderingEnabled: body.chatbotContext.orderingEnabled,
        deliveryInfo: body.chatbotContext.deliveryInfo,
      }
    }

    const ok = await RestaurantService.updateRestaurant(id, updates)
    if (!ok) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update restaurant" }, { status: 500 })
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "GET, PATCH, HEAD, OPTIONS",
    },
  })
}

