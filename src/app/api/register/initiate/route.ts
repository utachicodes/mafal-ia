import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();
    const { z } = await import("zod");

    // Strict Validation Schema
    const registerSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      whatsappNumber: z.string()
        .min(8, "Phone number too short")
        .max(15, "Phone number too long")
        .regex(/^\d+$/, "Phone number must contain only digits (no + or spaces)"),
      pin: z.string().min(4, "PIN must be 4-6 digits").max(6, "PIN must be 4-6 digits"),
      country: z.string().optional(),
    });

    // Sanitize phone number before validation
    if (body.whatsappNumber) {
      body.whatsappNumber = body.whatsappNumber.replace(/\D/g, "");
    }

    // Validate body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: validationResult.error.format()
      }, { status: 400 });
    }

    const { name, whatsappNumber, pin, country } = validationResult.data;

    // Create the User and Restaurant immediately (no OTP verification)
    const bcrypt = await import("bcryptjs");
    const hashedPin = await bcrypt.hash(pin, 10);
    const proxyEmail = `${whatsappNumber}@mafal.ia`;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: proxyEmail } });
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    user = await prisma.user.create({
      data: {
        email: proxyEmail,
        passwordHash: hashedPin,
        name: name,
        role: "BUSINESS_OWNER",
        plan: "STANDARD"
      }
    });

    const restaurant = await prisma.business.create({
      data: {
        name,
        whatsappNumber,
        country: country || "Senegal",
        description: "New Restaurant",
        cuisine: "General",
        supportedLanguages: ["fr", "en"],
        userId: user.id,
        isVerified: true, // Auto-verify
      },
    });

    return NextResponse.json({ ok: true, businessId: restaurant.id });
  } catch (error: any) {
    console.error("Registration initiate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
