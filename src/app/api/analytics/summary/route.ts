import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { subDays, startOfDay, format } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    const prisma = await getPrisma()

    const whereClause = restaurantId ? { restaurantId } : {}

    // 1. Total Conversations
    const totalConversations = await prisma.conversation.count({
      where: whereClause
    })

    // 2. Total Messages (approximated as conversations * average messages, or count if we had a message table)
    // For now, we only have conversations. Let's assume 1 conversation = 1 message interaction for simplicity until we have message table
    const totalMessages = totalConversations

    // 3. Average Response Time (Placeholder - requires message timestamps)
    const averageResponseTime = 0

    // 4. Customer Satisfaction (Placeholder - requires feedback logic)
    const customerSatisfaction = 0

    // 5. Language Distribution (Placeholder or random for now if not tracked)
    const languageDistribution: any[] = []

    // 6. Daily Messages/Conversations
    const today = startOfDay(new Date())
    const sevenDaysAgo = subDays(today, 6)

    // Group conversations by date
    // Note: groupBy by createdAt directly might be too granular. 
    // In a real app we'd use raw SQL or date_trunc. 
    // For minimal approximation, we fetch last 7 days and map in JS.
    const last7DaysConversations = await prisma.conversation.findMany({
      where: {
        ...whereClause,
        createdAt: { gte: sevenDaysAgo }
      },
      select: { createdAt: true }
    })

    const dailyMap = new Map<string, number>()
    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd')
      dailyMap.set(date, 0)
    }

    last7DaysConversations.forEach(c => {
      const date = format(new Date(c.createdAt), 'yyyy-MM-dd')
      if (dailyMap.has(date)) {
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      }
    })

    const dailyMessages = Array.from(dailyMap.entries()).map(([day, count]) => ({
      day,
      messages: count
    })).reverse() // sort chronological


    // 7. Top Queries (Placeholder)
    const topQueries: any[] = []

    // 8. Tool Usage (Placeholder)
    const toolUsage: any[] = []

    return NextResponse.json({
      totalConversations,
      totalMessages,
      averageResponseTime,
      customerSatisfaction,
      languageDistribution,
      dailyMessages,
      topQueries,
      toolUsage
    })

  } catch (err: any) {
    console.error("Analytics error:", err)
    return NextResponse.json({ error: err?.message || "Failed to load analytics" }, { status: 500 })
  }
}
