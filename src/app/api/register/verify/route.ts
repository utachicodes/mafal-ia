import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();
    const { businessId, otp } = body;

    if (!businessId || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurant = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.verificationCode !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP valid, verify restaurant
    await prisma.business.update({
      where: { id: businessId },
      data: {
        isVerified: true,
        verificationCode: null, // Clear OTP
        isActive: true
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Registration verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
