import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { restaurantId, otp } = body;

    if (!restaurantId || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.verificationCode !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP valid, verify restaurant
    await prisma.restaurant.update({
      where: { id: restaurantId },
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
