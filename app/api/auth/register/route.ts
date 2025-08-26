import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body?.email || "").trim().toLowerCase()
    const password = String(body?.password || "")
    const name = body?.name ? String(body.name) : null
    if (!email || !password) return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })

    const prisma = await getPrisma()
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Un utilisateur existe déjà avec cet email" }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, name, passwordHash } })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur d'inscription" }, { status: 500 })
  }
}
