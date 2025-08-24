import { NextResponse } from "next/server"
import { env } from "@/src/lib/env"

// POST /api/ai/validate
// Body: { apiKey: string, model?: string }
// Makes a minimal countTokens request to verify the key works for the model
export async function POST(req: Request) {
  try {
    const { apiKey: apiKeyFromClient, model = "models/gemini-1.5-flash" } = await req.json().catch(() => ({} as any))
    const key = typeof apiKeyFromClient === "string" && apiKeyFromClient.trim() ? apiKeyFromClient : env.GOOGLE_GENKIT_API_KEY
    if (!key) {
      return NextResponse.json({ ok: false, error: "Missing apiKey and no server default configured" }, { status: 400 })
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:countTokens?key=${encodeURIComponent(key)}`
    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: "hello" }],
        },
      ],
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { ok: false, error: err?.error?.message || `Validation failed with status ${res.status}` },
        { status: 400 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Validation error" }, { status: 500 })
  }
}
