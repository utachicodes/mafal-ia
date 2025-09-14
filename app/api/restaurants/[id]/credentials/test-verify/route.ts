import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";
import { stackServerApp } from "@/src/stack";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const prisma = await getPrisma();
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: params.id, userId: user.id },
      select: { webhookVerifyToken: true },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    const verifyToken = restaurant.webhookVerifyToken;
    if (!verifyToken) return NextResponse.json({ error: "Missing verify token" }, { status: 400 });

    // Derive base URL from request
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    const host = request.headers.get("host");
    const baseUrl = `${proto}://${host}`;

    const challenge = "123456";
    const url = new URL(`/api/whatsapp`, baseUrl);
    url.searchParams.set("hub.mode", "subscribe");
    url.searchParams.set("hub.verify_token", verifyToken);
    url.searchParams.set("hub.challenge", challenge);

    const res = await fetch(url.toString(), { method: "GET" });
    const text = await res.text();

    return NextResponse.json({
      requestedUrl: url.toString(),
      status: res.status,
      ok: res.ok,
      body: text,
      expectedChallenge: challenge,
      passed: res.ok && text.trim() === challenge,
    });
  } catch (err: any) {
    console.error("[TestVerify] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
