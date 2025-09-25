import { NextResponse } from "next/server";
import { RestaurantService } from "@/src/lib/restaurant-service";
import { AIClient } from "@/src/lib/ai-client";
import type { ChatMessage } from "@/lib/data";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: restaurantId } = params;
    const { query } = await req.json();
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const restaurant = await RestaurantService.getRestaurantByApiKey(apiKey);

    if (!restaurant || restaurant.id !== restaurantId) {
      return NextResponse.json({ error: "Invalid API key or restaurant ID" }, { status: 401 });
    }

    const restaurantContext = `
      Restaurant: ${restaurant.name}
      Description: ${restaurant.description}
      Cuisine: ${restaurant.cuisine}
      Business Hours: ${restaurant.chatbotContext.businessHours}
      Welcome Message: ${restaurant.chatbotContext.welcomeMessage}
      Special Instructions: ${restaurant.chatbotContext.specialInstructions}
      Delivery Info: ${restaurant.chatbotContext.deliveryInfo}
      Ordering Enabled: ${restaurant.chatbotContext.orderingEnabled ? "Yes" : "No"}
    `.trim();

    const messages: ChatMessage[] = [{
      id: "1",
      role: "user",
      content: query,
      timestamp: new Date(),
    }];

    const aiResponse = await AIClient.generateResponse(
      messages,
      restaurantContext,
      restaurant.menu || [],
      restaurant.name
    );

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("[RAG API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}