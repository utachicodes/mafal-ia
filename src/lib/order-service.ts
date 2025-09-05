import { getPrisma } from "@/src/lib/db"
import { Order, Prisma } from "@prisma/client"

export type OrderRecord = Order

export class OrderService {
  static async createOrder(params: Prisma.OrderCreateInput): Promise<OrderRecord> {
    const prisma = await getPrisma()
    const createdOrder = await prisma.order.create({
      data: params,
    })
    return createdOrder
  }

  static async getOrder(id: string): Promise<OrderRecord | null> {
    const prisma = await getPrisma()
    return prisma.order.findUnique({
      where: { id },
    })
  }

  static async listByPhone(restaurantId: string, phoneNumber: string): Promise<OrderRecord[]> {
    const prisma = await getPrisma()
    return prisma.order.findMany({
      where: { restaurantId, phoneNumber },
      orderBy: { createdAt: "desc" },
    })
  }
}
