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
    
    // In a production environment, we would use Prisma to query the database
    // Since OrderService uses an in-memory store for demo purposes, we'll create some sample data
    
    // Sample data for order analytics
    const ordersByDay = [
      { date: format(subDays(today, 6), 'yyyy-MM-dd'), count: 4, revenue: 12500 },
      { date: format(subDays(today, 5), 'yyyy-MM-dd'), count: 3, revenue: 9800 },
      { date: format(subDays(today, 4), 'yyyy-MM-dd'), count: 5, revenue: 15200 },
      { date: format(subDays(today, 3), 'yyyy-MM-dd'), count: 7, revenue: 21000 },
      { date: format(subDays(today, 2), 'yyyy-MM-dd'), count: 9, revenue: 28500 },
      { date: format(subDays(today, 1), 'yyyy-MM-dd'), count: 11, revenue: 32000 },
      { date: format(today, 'yyyy-MM-dd'), count: 8, revenue: 24500 },
    ]
    
    const totalOrders = ordersByDay.reduce((sum, day) => sum + day.count, 0)
    const todayOrders = ordersByDay[6].count
    const totalRevenue = ordersByDay.reduce((sum, day) => sum + day.revenue, 0)
    
    // Category distribution for pie chart
    const categoryDistribution = [
      { name: "Plats", value: 45 },
      { name: "Boissons", value: 30 },
      { name: "Desserts", value: 25 },
    ]
    
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