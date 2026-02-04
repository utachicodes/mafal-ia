import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { subDays, startOfDay, format } from "date-fns"
import { OrderService } from "@/src/lib/order-service"

export async function GET() {
  try {
    const prisma = await getPrisma()

    // Get today's date and 7 days ago
    const today = startOfDay(new Date())
    const sevenDaysAgo = subDays(today, 6) // inclusive 7 days window

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      select: {
        createdAt: true,
        total: true,
        items: true,
      },
    })

    const ordersByDayMap = new Map<string, { count: number; revenue: number }>()
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(today, 6 - i), 'yyyy-MM-dd')
      ordersByDayMap.set(date, { count: 0, revenue: 0 })
    }

    orders.forEach((order: any) => {
      const date = format(order.createdAt, 'yyyy-MM-dd')
      const current = ordersByDayMap.get(date) || { count: 0, revenue: 0 }
      ordersByDayMap.set(date, { count: current.count + 1, revenue: current.revenue + order.total })
    })

    const ordersByDay = Array.from(ordersByDayMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      revenue: data.revenue,
    }))

    const totalOrders = orders.length
    const todayOrders = ordersByDay[6]?.count || 0
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)

    const categoryDistributionMap = new Map<string, number>()
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const category = item.category || "Other" // Assuming items have a category field
        categoryDistributionMap.set(category, (categoryDistributionMap.get(category) || 0) + item.quantity)
      })
    })

    const categoryDistribution = Array.from(categoryDistributionMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))

    return NextResponse.json({
      totalOrders,
      todayOrders,
      totalRevenue,
      ordersByDay,
      categoryDistribution,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load order analytics" }, { status: 500 })
  }
}