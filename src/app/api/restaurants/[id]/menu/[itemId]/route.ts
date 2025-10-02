import { NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

// PATCH: update a menu item
// body: any subset of { name, price, description, category, isAvailable }
export async function PATCH(req: NextRequest, ctx: { params: { id: string; itemId: string } }) {
  try {
    const body = await req.json().catch(() => ({}))
    const data: any = {}
    if (typeof body.name === "string") data.name = body.name
    if (body.price !== undefined) data.price = Number(body.price)
    if (typeof body.description === "string") data.description = body.description
    if (body.category !== undefined) data.category = body.category || null
    if (body.isAvailable !== undefined) data.isAvailable = Boolean(body.isAvailable)

    const prisma = await getPrisma()
    const item = await prisma.menuItem.update({ where: { id: ctx.params.itemId }, data })
    return NextResponse.json({ ok: true, item })
  } catch (e: any) {
    console.error("[Menu][PATCH]", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}

// DELETE: remove a menu item
export async function DELETE(_req: NextRequest, ctx: { params: { id: string; itemId: string } }) {
  try {
    const prisma = await getPrisma()
    await prisma.menuItem.delete({ where: { id: ctx.params.itemId } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("[Menu][DELETE]", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}
