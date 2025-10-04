import { NextResponse } from "next/server"
import { RestaurantService } from "@/src/lib/restaurant-service"
import type { Restaurant } from "@/lib/data"
import { z } from "zod"

// Ensure Prisma runs in the Node.js runtime on Vercel
export const runtime = "nodejs"

export async function GET() {
  try {
    const list = await RestaurantService.getAllRestaurants()
    return NextResponse.json(list)
  } catch (err: any) {
    console.error("GET /api/restaurants failed:", err)
    // Fallback: return empty list so client can proceed without server DB
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any

    // Zod schema with coercion and tolerant parsing
    const MenuItemSchema = z.object({
      name: z.string().min(1, "name required"),
      description: z.string().default(""),
      price: z.coerce.number().int().nonnegative(),
      category: z.string().optional(),
      isAvailable: z.coerce.boolean().optional(),
    })

    const CredentialsSchema = z.object({
      whatsappAccessToken: z.string().optional().default(""),
      whatsappPhoneNumberId: z.string().optional().default(""),
      webhookVerifyToken: z.string().optional().default(""),
      whatsappAppSecret: z.string().optional().default(""),
    })

    // Allow supportedLanguages and menu as JSON strings or arrays
    const LangsSchema = z.union([
      z.array(z.string()),
      z
        .string()
        .transform((s) => {
          try {
            const p = JSON.parse(s)
            return Array.isArray(p) ? p : []
          } catch {
            return []
          }
        }),
    ]).default([])

    const MenuSchema = z.union([
      z.array(MenuItemSchema),
      z
        .string()
        .transform((s) => {
          try {
            const p = JSON.parse(s)
            return Array.isArray(p) ? p : []
          } catch {
            return []
          }
        }),
    ]).default([])

    const RestaurantInput = z.object({
      name: z.string().min(1, "name required"),
      description: z.string().optional().default(""),
      cuisine: z.string().optional().default(""),
      whatsappNumber: z.string().optional().default(""),
      supportedLanguages: LangsSchema,
      isActive: z.coerce.boolean().optional().default(true),
      isConcierge: z.coerce.boolean().optional().default(false),
      menu: MenuSchema,
      chatbotContext: z
        .object({
          welcomeMessage: z.string().optional(),
          businessHours: z.string().optional(),
          specialInstructions: z.string().optional(),
          orderingEnabled: z.coerce.boolean().optional(),
          deliveryInfo: z.string().optional(),
        })
        .optional()
        .default({}),
      apiCredentials: CredentialsSchema.optional(),
      // Accept flat credential fields too
      whatsappAccessToken: z.string().optional(),
      whatsappPhoneNumberId: z.string().optional(),
      webhookVerifyToken: z.string().optional(),
      whatsappAppSecret: z.string().optional(),
      userId: z.string().optional(),
    })

    const parsed = RestaurantInput.safeParse(body)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
      return NextResponse.json({ error: "invalid_input", details: issues }, { status: 400 })
    }

    // Merge flat creds into apiCredentials
    const v = parsed.data
    const apiCredentials = {
      whatsappAccessToken: v.apiCredentials?.whatsappAccessToken ?? v.whatsappAccessToken ?? "",
      whatsappPhoneNumberId: v.apiCredentials?.whatsappPhoneNumberId ?? v.whatsappPhoneNumberId ?? "",
      webhookVerifyToken: v.apiCredentials?.webhookVerifyToken ?? v.webhookVerifyToken ?? "",
      whatsappAppSecret: v.apiCredentials?.whatsappAppSecret ?? v.whatsappAppSecret ?? "",
    }

    const payload: Partial<Restaurant> = {
      name: v.name,
      description: v.description ?? "",
      cuisine: v.cuisine ?? "",
      whatsappNumber: v.whatsappNumber ?? "",
      supportedLanguages: (v.supportedLanguages as string[]) ?? [],
      isActive: v.isActive ?? true,
      isConcierge: v.isConcierge ?? false,
      menu: (v.menu as any[]) ?? [],
      chatbotContext: v.chatbotContext as any,
      apiCredentials,
      // userId (optional) used by service fallback if not present
      // createdAt/updatedAt set by service/DB
    } as any

    const created = await RestaurantService.createRestaurant(payload as any)
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    console.error("POST /api/restaurants failed:", err)
    return NextResponse.json({ error: "internal_error", message: err?.message || "Failed to create restaurant" }, { status: 500 })
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "GET, POST, HEAD, OPTIONS",
    },
  })
}

