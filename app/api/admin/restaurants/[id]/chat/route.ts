import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is here, or I'll check imports
import { AIClient } from "@/src/lib/ai-client";
import { RestaurantService } from "@/src/lib/restaurant-service";
import { ConversationManager } from "@/src/lib/conversation-manager";

// Helper to normalize menu items (copied from whatsapp/route.ts)
function normalizeMenu(r: any) {
    if (Array.isArray(r.menu) && r.menu.length) return r.menu
    if (Array.isArray(r.menuItems) && r.menuItems.length)
        return r.menuItems.map((m: any) => ({
            id: m.id || String(Math.random()),
            name: m.name,
            description: m.description || "",
            price: m.price || 0,
            category: m.category || "General",
            isAvailable: m.isAvailable !== false,
        }))
    return []
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Next.js 15 params are promises
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // 1. Fetch Restaurant
        const restaurant = await RestaurantService.getRestaurantById(id);
        if (!restaurant) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
        }

        // 2. Mock WhatsApp Metadata using "SIMULATOR" as phone number
        const phoneNumber = "SIMULATOR";

        // 3. Save User Message
        await ConversationManager.addMessage(restaurant.id, phoneNumber, {
            role: "user",
            content: message,
        });

        // 4. Load History
        const history = await ConversationManager.getConversation(restaurant.id, phoneNumber);

        // 5. Build Context (Same as usage in whatsapp/route.ts)
        const menu = normalizeMenu(restaurant);
        const context = `
Restaurant: ${restaurant.name}
Description: ${restaurant.description}
Cuisine: ${restaurant.cuisine}
Hours: ${restaurant.chatbotContext?.businessHours || "Not specified"}
Delivery: ${restaurant.chatbotContext?.deliveryInfo || "Available"}
Customer Name: Admin Simulator
    `.trim();

        // 6. Generate AI Response
        const aiRes = await AIClient.generateResponse(history, context, menu, restaurant.name);

        // 7. Save Assistant Message
        await ConversationManager.addMessage(restaurant.id, phoneNumber, {
            role: "assistant",
            content: aiRes.response,
        });

        return NextResponse.json({
            response: aiRes.response,
            debug: {
                detectedLanguage: aiRes.detectedLanguage,
                usedTools: aiRes.usedTools
            }
        });

    } catch (error: any) {
        console.error("Simulator Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
