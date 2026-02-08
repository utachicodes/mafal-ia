import { getPrisma } from "@/src/lib/db"
import { Order } from "@prisma/client"

export type OrderRecord = Order

// DTO accepted by WhatsApp flow when confirming an order
export type CreateOrderParams = {
  restaurantId: string
  phoneNumber: string
  total: number
  itemsSummary: string // human-readable summary
  notFoundItems?: string | string[]
  orderItems: { itemName: string; quantity: number; price?: number; specs?: Record<string, any> }[]
  customerName?: string
  notes?: string
}

export class OrderService {
  static async createOrder(params: CreateOrderParams): Promise<OrderRecord> {
    const prisma = await getPrisma()
    // Prisma model fields mapping
    // - customerName is required; fallback to "" if not provided
    // - items is a Json array with detailed line items + summary metadata
    const itemsJson = {
      summary: params.itemsSummary,
      notFound: Array.isArray(params.notFoundItems)
        ? params.notFoundItems
        : params.notFoundItems
          ? String(params.notFoundItems).split(/\s*,\s*/).filter(Boolean)
          : [],
      lines: params.orderItems.map((it) => ({
        itemName: it.itemName,
        quantity: it.quantity,
        price: it.price ?? null,
        specs: it.specs ?? null,
      })),
    }

    const createdOrder = await prisma.order.create({
      data: {
        restaurantId: params.restaurantId,
        customerName: params.customerName ?? "",
        phoneNumber: params.phoneNumber,
        items: itemsJson as any,
        total: Math.max(0, Math.trunc(params.total || 0)),
        notes: params.notes,
      },
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

  static async getAllOrders(): Promise<(OrderRecord & { restaurant: { name: string } | null })[]> {
    const prisma = await getPrisma()
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: {
          select: { name: true }
        }
      },
      take: 100
    })
  }
}
