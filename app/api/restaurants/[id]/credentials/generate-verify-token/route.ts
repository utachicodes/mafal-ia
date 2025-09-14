import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getPrisma } from "@/src/lib/db";
import { stackServerApp } from "@/src/stack";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const prisma = await getPrisma();
    const owner = await prisma.restaurant.findFirst({ where: { id: params.id, userId: user.id }, select: { id: true } });
    if (!owner) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    // Generate a URL-safe token: 32 bytes -> 43 chars base64url
    const token = randomBytes(32).toString("base64url");

    await prisma.restaurant.update({
      where: { id: params.id },
      data: { webhookVerifyToken: token },
    });

    return NextResponse.json({ webhookVerifyToken: token });
  } catch (err: any) {
    if ((err as any)?.code === "P2025") {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    console.error("[GenerateVerifyToken] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
