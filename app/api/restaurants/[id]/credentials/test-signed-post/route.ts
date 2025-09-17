import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getPrisma } from "@/src/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const prisma = await getPrisma();
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: params.id },
      select: { whatsappPhoneNumberId: true, whatsappAppSecret: true },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    const phoneId = restaurant.whatsappPhoneNumberId;
    const appSecret = restaurant.whatsappAppSecret;
    if (!phoneId) return NextResponse.json({ error: "Missing phone_number_id" }, { status: 400 });
    if (!appSecret) return NextResponse.json({ error: "Missing App Secret" }, { status: 400 });

    // Minimal WhatsApp-like signed payload
    const body = {
      entry: [
        {
          changes: [
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: phoneId },
                contacts: [{ profile: { name: "Test User" }, wa_id: "15551234567" }],
                messages: [
                  { from: "15551234567", id: "wamid.TEST", timestamp: String(Math.floor(Date.now() / 1000)), type: "text", text: { body: "Hello from signed POST test" } }
                ]
              }
            }
          ]
        }
      ],
      object: "whatsapp_business_account"
    };

    const raw = JSON.stringify(body);
    const signature =
      "sha256=" + createHmac("sha256", appSecret).update(raw, "utf8").digest("hex");

    // Derive base URL from request
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    const host = request.headers.get("host");
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/whatsapp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": signature,
      },
      body: raw,
    });

    const text = await res.text();
    return NextResponse.json({ status: res.status, ok: res.ok, body: text });
  } catch (err: any) {
    console.error("[TestSignedPost] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
