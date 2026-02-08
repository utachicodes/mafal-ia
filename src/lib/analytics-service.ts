import { getPrisma } from "@/src/lib/db"

export const AnalyticsService = {
    async getDashboardStats() {
        const prisma = await getPrisma()

        // 1. Total Revenue (Sum of completed orders)
        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                status: "completed",
            },
        })
        const totalRevenue = revenueResult._sum.total || 0

        // 2. Active Restaurants
        const activeRestaurants = await prisma.restaurant.count({
            where: {
                isActive: true,
            },
        })

        // 3. Total Orders
        const totalOrders = await prisma.order.count()

        // 4. Active Orders (pending or processing)
        const activeOrders = await prisma.order.count({
            where: {
                status: {
                    in: ["pending", "processing"]
                }
            }
        })

        // 5. Total Customers (unique phone numbers from orders)
        // Note: distinct is supported in findMany, not count directly in all providers, but count with distinct is supported in Postgres
        const distinctCustomers = await prisma.order.findMany({
            distinct: ['phoneNumber'],
            select: {
                phoneNumber: true
            }
        })
        const totalCustomers = distinctCustomers.length

        // 6. Customer Conversations
        const conversationCount = await prisma.conversation.count()

        return {
            totalRevenue,
            activeRestaurants,
            totalOrders,
            activeOrders,
            totalCustomers,
            conversationCount,
        }
    },

    async getRevenueOverTime() {
        // Placeholder for chart data - in a real app, use groupBy or raw query
        return []
    }
}
