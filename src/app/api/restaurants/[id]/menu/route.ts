import { NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

// GET: list menu items for a restaurant
export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const prisma = await getPrisma()
    const items = await prisma.menuItem.findMany({ where: { restaurantId: ctx.params.id }, orderBy: { createdAt: "desc" } })
    return NextResponse.json({ ok: true, items })
  } catch (e: any) {
    console.error("[Menu][GET]", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}

// POST: create a menu item
// body: { name: string, price: number, description?: string, category?: string, isAvailable?: boolean }
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}))
    const name: string | undefined = body?.name
    const price = Number(body?.price)
    const description: string | undefined = body?.description
    const category: string | undefined = body?.category
    const isAvailable: boolean = body?.isAvailable === undefined ? true : Boolean(body?.isAvailable)

    if (!name || !Number.isFinite(price)) {
      return NextResponse.json({ ok: false, error: "name_and_price_required" }, { status: 400 })
    }

    const prisma = await getPrisma()
    const item = await prisma.menuItem.create({
      data: {
        restaurantId: ctx.params.id,
        name,
        price,
        description: description || "",
        category: category || null,
        isAvailable,
      },
    })

    return NextResponse.json({ ok: true, item }, { status: 201 })
  } catch (e: any) {
    console.error("[Menu][POST]", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}
