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

        // 4. Customer Conversations (Count of unique phone numbers or usage of Conversation model)
        // Assuming Conversation model tracks unique chats per restaurant
        const conversationCount = await prisma.conversation.count()

        return {
            totalRevenue,
            activeRestaurants,
            totalOrders,
            conversationCount,
        }
    },

    async getRevenueOverTime() {
        // Placeholder for chart data - in a real app, use groupBy or raw query
        return []
    }
}
