import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const hasDb = !!dbUrl;

    // Light-weight connectivity probe
    let dbOk = false;
    if (hasDb) {
      const prisma = await getPrisma();
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    }

    return NextResponse.json({ ok: true, env: { hasDb }, dbOk });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "health_failed" },
      { status: 500 }
    );
  }
}
