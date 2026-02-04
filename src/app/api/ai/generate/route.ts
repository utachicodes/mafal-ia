import { NextResponse } from "next/server"
import { env } from "@/src/lib/env"

// Maps our chat roles to Gemini API roles
function mapRole(role: string): "user" | "model" {
  return role === "assistant" ? "model" : "user"
}

// POST /api/ai/generate
// Body: { model?: string, messages: { role: string, content: string }[], restaurantContext?: string }
export async function POST(req: Request) {
  try {
    const { model = "models/gemini-1.5-flash", messages = [], restaurantContext = "" } =
      await req.json().catch(() => ({} as any))

    const key = env.GOOGLE_GENKIT_API_KEY
    if (!key) {
      return NextResponse.json({ ok: false, error: "Server AI key not configured" }, { status: 500 })
    }

    // Build contents for the Generative Language API
    const contents: any[] = []
    if (restaurantContext) {
      contents.push({ role: "user", parts: [{ text: `System context for assistant (restaurant):\n${restaurantContext}` }] })
    }
    for (const m of messages) {
      if (!m?.content) continue
      contents.push({ role: mapRole(m.role), parts: [{ text: String(m.content) }] })
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${encodeURIComponent(key)}`
    const body = { contents }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error?.message || `Generation failed with status ${res.status}` },
        { status: 400 },
      )
    }

    // Extract text from first candidate
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("\n") || ""

    return NextResponse.json({ ok: true, response: text })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Generation error" }, { status: 500 })
  }
}
