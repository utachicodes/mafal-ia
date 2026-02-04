import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";
import { WhatsAppClient } from "@/src/lib/whatsapp-client";
import { randomInt } from "crypto";

export async function POST(req: Request) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();
    const { name, whatsappNumber, ownerAgeRange, ownerSex, country } = body;

    if (!name || !whatsappNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    // Create Restaurant (pending verification)
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        whatsappNumber,
        ownerAgeRange,
        ownerSex,
        country,
        description: "New Restaurant",
        cuisine: "General",
        supportedLanguages: ["en", "fr"],
        userId: "pending-user",
        verificationCode: otp,
        isVerified: false,
      },
    });

    // Send OTP via WhatsApp
    // We need the platform's phone number ID to send FROM.
    // Assuming process.env.WHATSAPP_PHONE_NUMBER_ID is set.
    const businessPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (businessPhoneNumberId) {
      await WhatsAppClient.sendMessage(
        businessPhoneNumberId,
        whatsappNumber,
        `Your verification code is: ${otp}`
      );
    } else {
      console.warn("WHATSAPP_PHONE_NUMBER_ID not set, logging OTP:", otp);
    }

    return NextResponse.json({ ok: true, restaurantId: restaurant.id });
  } catch (error: any) {
    console.error("Registration initiate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
