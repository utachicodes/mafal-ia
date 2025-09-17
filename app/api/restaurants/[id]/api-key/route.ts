import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { generateApiKey } from "@/src/lib/api-key"
import { env } from "@/src/lib/env"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Optional admin guard: if configured, require matching token
    if (env.ADMIN_API_TOKEN) {
      const auth = req.headers.get("authorization") || req.headers.get("Authorization")
      const bearer = auth && auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null
      const headerToken = req.headers.get("x-admin-token")?.trim()
      const provided = bearer || headerToken
      if (!provided || provided !== env.ADMIN_API_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const prisma = await getPrisma()

    // Ensure restaurant exists
    const restaurant = await prisma.restaurant.findUnique({ where: { id: params.id } })
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Generate a new API key (plaintext returned once) and store only the hash
    const { apiKey, hash, createdAt: now } = generateApiKey("mafalia_sk_")
    await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        apiKeyHash: hash,
        apiKeyCreatedAt: now,
        apiKeyRevokedAt: null,
      },
    })

    return NextResponse.json({ apiKey, createdAt: now.toISOString() }, { status: 201 })
  } catch (err: any) {
    console.error("Failed to generate API key:", err)
    return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Optional admin guard: if configured, require matching token
    if (env.ADMIN_API_TOKEN) {
      const auth = req.headers.get("authorization") || req.headers.get("Authorization")
      const bearer = auth && auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null
      const headerToken = req.headers.get("x-admin-token")?.trim()
      const provided = bearer || headerToken
      if (!provided || provided !== env.ADMIN_API_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const prisma = await getPrisma()

    const restaurant = await prisma.restaurant.findUnique({ where: { id: params.id } })
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const now = new Date()
    await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        apiKeyHash: null,
        apiKeyRevokedAt: now,
      },
    })

    return NextResponse.json({ revokedAt: now.toISOString() }, { status: 200 })
  } catch (err: any) {
    console.error("Failed to revoke API key:", err)
    return NextResponse.json({ error: "Failed to revoke API key" }, { status: 500 })
  }
}
