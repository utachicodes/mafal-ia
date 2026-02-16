import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/db"
import { llm } from "@/lib/llm"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { restaurantId, message, sessionId } = body

        if (!restaurantId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const prisma = await getPrisma()

        // 1. Fetch Restaurant Context & Menu
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: { menuItems: { where: { isAvailable: true } } }
        })

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
        }

        // 2. Prepare Context

        // 3. Select Template based on Business Type
        const businessType = restaurant.businessType || "RESTAURANT"
        let systemPrompt = ""
        let menuContext = ""

        if (businessType === "RETAIL") {
            menuContext = restaurant.menuItems
                .map((item: any) => `- ${item.name} (${item.price} FCFA): ${item.description || ""}`)
                .join("\n")

            systemPrompt = `
You are a knowledgeable sales assistant for ${restaurant.name}, a retail store.
Your goal is to help customers find products, understand features, and make purchase decisions based ONLY on the provided catalog.

Store Context:
${restaurant.description || ""}
${restaurant.context || ""}

Product Catalog:
${menuContext}

Rules:
- Be helpful, consultative, and polite.
- Focus on product benefits and details.
- If a product is not listed, say it's not currently available.
- Do NOT invent products.
- Respond in the same language as the user.
`
        } else if (businessType === "SERVICE") {
            menuContext = restaurant.menuItems
                .map((item: any) => `- ${item.name} (Starting at ${item.price} FCFA): ${item.description || ""}`)
                .join("\n")

            systemPrompt = `
You are a booking and inquiry coordinator for ${restaurant.name}, a service provider.
Your goal is to explain services, rates, and help users book appointments based ONLY on the provided service list.

Business Context:
${restaurant.description || ""}
${restaurant.context || ""}

Service List:
${menuContext}

Rules:
- Be professional, organized, and inviting.
- Clarify service details and pricing structures.
- If a service is not listed, politely inform the user.
- Do NOT invent services.
- Respond in the same language as the user.
`
        } else {
            // Default: RESTAURANT
            menuContext = restaurant.menuItems
                .map((item: any) => `- ${item.name} (${item.price} FCFA): ${item.description || ""}`)
                .join("\n")

            systemPrompt = `
You are a helpful restaurant assistant for ${restaurant.name}.
Your goal is to answer customer questions accurately based ONLY on the provided menu and context.

Restaurant Context:
${restaurant.description || ""}
${restaurant.context || ""}

Menu:
${menuContext}

Rules:
- Be polite, concise, and professional.
- If you don't know the answer, say so politely.
- Do NOT invent menu items.
- Respond in the same language as the user.
`
        }

        // 3. Call Groq Direct
        console.log(`[API/Chat] Generating response for ${restaurant.name}...`)
        const responseText = await llm.generateWithSystem(systemPrompt, message)

        return NextResponse.json({
            response: responseText,
            sessionId: sessionId || `web_${Date.now()}`
        })

    } catch (error: any) {
        console.error("[API/Chat] Groq Error:", error)
        return NextResponse.json(
            {
                response: "Désolé, je rencontre un petit problème technique. Peux-tu reformuler ?",
                error: error.message
            },
            { status: 200 }
        )
    }
}
