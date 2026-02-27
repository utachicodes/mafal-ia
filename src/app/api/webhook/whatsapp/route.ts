import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getPrisma } from "@/src/lib/db"
import { processUnifiedMessage } from "@/src/lib/webhook-processor"
import { BusinessService } from "@/src/lib/business-service"
import { logger } from "@/src/lib/logger"

export const runtime = "nodejs"

// GET — verification (Meta hub.challenge or LAM challenge)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Meta format
  const hubMode = searchParams.get("hub.mode")
  const hubVerifyToken = searchParams.get("hub.verify_token")
  const hubChallenge = searchParams.get("hub.challenge")

  if (hubMode === "subscribe" && hubChallenge) {
    if (hubVerifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
      return new Response(hubChallenge, { status: 200 })
    }
    const prisma = await getPrisma()
    const business = await prisma.business.findFirst({
      where: { webhookVerifyToken: hubVerifyToken ?? "" },
    })
    if (business) return new Response(hubChallenge, { status: 200 })
    return new Response("Forbidden", { status: 403 })
  }

  // LAM format
  const lamChallenge = searchParams.get("challenge")
  if (lamChallenge) return new Response(lamChallenge, { status: 200 })

  return NextResponse.json({ ok: true })
}

// POST — inbound message (Meta or LAM)
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    // --- META FORMAT DETECTION ---
    const isMetaFormat =
      body?.object === "whatsapp_business_account" ||
      body?.entry?.[0]?.changes?.[0]?.value?.messages

    if (isMetaFormat) {
      // HMAC verification
      const appSecret = process.env.WHATSAPP_APP_SECRET
      if (appSecret) {
        const sig = request.headers.get("x-hub-signature-256") || ""
        const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")
        const sigBuf = Buffer.from(sig)
        const expBuf = Buffer.from(expected)
        if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
          logger.warn("Webhook signature mismatch", {}, "WEBHOOK_WHATSAPP")
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
      }

      const entry = body?.entry?.[0]
      const changes = entry?.changes ?? []

      for (const change of changes) {
        const value = change?.value
        const messages = value?.messages ?? []
        const phoneNumberId = value?.metadata?.phone_number_id
        const contactName = value?.contacts?.[0]?.profile?.name

        for (const msg of messages) {
          if (msg.type !== "text" && msg.type !== "location") continue

          let messageText = ""
          let isLocation = false
          let locationData: { lat: number; lng: number } | undefined

          if (msg.type === "text") {
            messageText = msg.text?.body ?? ""
          } else if (msg.type === "location") {
            isLocation = true
            locationData = { lat: msg.location.latitude, lng: msg.location.longitude }
            messageText = `My location: ${msg.location?.name || ""} ${msg.location?.address || ""} (${msg.location.latitude}, ${msg.location.longitude})`
          }

          const business = await BusinessService.getBusinessByPhoneNumber(phoneNumberId ?? "")
          if (!business) {
            logger.warn(`No business for phone_number_id: ${phoneNumberId}`, {}, "WEBHOOK_WHATSAPP")
            continue
          }

          processUnifiedMessage(business.id, msg.from, msg.id, messageText, {
            contactName,
            isLocation,
            locationData,
          }).catch((err) => logger.error("processUnifiedMessage error", err, "WEBHOOK_WHATSAPP"))
        }
      }

      return NextResponse.json({ ok: true })
    }

    // --- LAM FORMAT DETECTION ---
    // LAM sends: { from: "...", text: "...", id: "..." } or nested under message
    // May also come via /api/webhooks/lam/[id] with businessId — detect by presence of `from`
    const lamMessage = body.message || body
    const phoneNumber = lamMessage.from || body.from
    const messageText = lamMessage.text?.body || lamMessage.text || body.text || ""
    const messageId = lamMessage.id || body.id || `lam_${Date.now()}`
    const contactName = lamMessage.name || body.name || body.contact_name

    if (!phoneNumber) {
      return NextResponse.json({ error: "No sender number" }, { status: 400 })
    }

    // Resolve business: try by business phone number or LAM API key header
    let business = await BusinessService.getBusinessByPhoneNumber(body.to || phoneNumber)

    if (!business) {
      const lamApiKey = request.headers.get("lam-api-key") || request.headers.get("x-lam-api-key")
      if (lamApiKey) {
        const prisma = await getPrisma()
        const byKey = await prisma.business.findFirst({ where: { lamApiKey } })
        if (byKey) {
          business = await BusinessService.getBusinessById(byKey.id)
        }
      }
    }

    if (!business) {
      logger.warn(`No business found for LAM sender: ${phoneNumber}`, {}, "WEBHOOK_LAM")
      return NextResponse.json({ ok: true }) // Return 200 to prevent retries
    }

    logger.info(`LAM message for ${business.name}`, { from: phoneNumber, businessId: business.id }, "WEBHOOK_LAM")
    processUnifiedMessage(business.id, phoneNumber, messageId, messageText, { contactName }).catch(
      (err) => logger.error("processUnifiedMessage error", err, "WEBHOOK_LAM")
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error("Webhook error", err, "WEBHOOK_WHATSAPP")
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
