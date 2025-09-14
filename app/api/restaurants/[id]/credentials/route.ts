import { NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const prisma = await getPrisma()
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      select: {
        id: true,
        whatsappPhoneNumberId: true,
        whatsappAccessToken: true,
        whatsappAppSecret: true,
        webhookVerifyToken: true,
        isActive: true
      }
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({
      whatsappPhoneNumberId: restaurant.whatsappPhoneNumberId || "",
      whatsappAccessToken: restaurant.whatsappAccessToken || "",
      whatsappAppSecret: restaurant.whatsappAppSecret || "",
      webhookVerifyToken: restaurant.webhookVerifyToken || "",
      isActive: restaurant.isActive
    })
  } catch (error) {
    console.error("Error fetching restaurant credentials:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}