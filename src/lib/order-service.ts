import { getPrisma } from "@/src/lib/db"
import { env } from "@/src/lib/env"

export type OrderRecord = {
  id: string
  restaurantId: string
  phoneNumber: string
  total: number
  itemsSummary: string
  notFoundItems: string
  orderItems: { itemName: string; quantity: number; price?: number; specs?: any }[]
  status: "pending" | "confirmed" | "cancelled" | "preparing" | "delivered"
  createdAt: Date
}

// Prisma-backed Order service with DEMO_MODE in-memory fallback
export class OrderService {
  private static store = new Map<string, OrderRecord>()

  static async createOrder(params: {
    restaurantId: string
    phoneNumber: string
    total: number
    itemsSummary: string
    notFoundItems: string
    orderItems: { itemName: string; quantity: number; price?: number; specs?: any }[]
    customerName?: string
    notes?: string
  }): Promise<OrderRecord> {
    if (env.DEMO_MODE) {
      const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const rec: OrderRecord = {
        id,
        status: "confirmed",
        createdAt: new Date(),
        ...params,
      }
      this.store.set(id, rec)
      return rec
    }

    const prisma = await getPrisma()
    const created = await prisma.order.create({
      data: {
        restaurantId: params.restaurantId,
        customerName: params.customerName ?? "",
        phoneNumber: params.phoneNumber,
        items: params.orderItems.map((it) => ({ itemName: it.itemName, quantity: it.quantity, price: it.price ?? 0, specs: it.specs })),
        total: params.total ?? params.orderItems.reduce((s, it) => s + (it.price ?? 0) * (it.quantity ?? 0), 0),
        notes: params.notes ?? (params.notFoundItems ? `Missing: ${params.notFoundItems}` : null),
        status: "confirmed",
      },
    })
    return {
      id: created.id,
      restaurantId: created.restaurantId,
      phoneNumber: created.phoneNumber,
      total: created.total,
      itemsSummary: params.itemsSummary || (Array.isArray(created.items) ? (created.items as any[]).map((it) => `${it.quantity}x ${it.itemName}`).join(", ") : ""),
      notFoundItems: params.notFoundItems ?? "",
      orderItems: (created.items as any[])?.map((it: any) => ({ itemName: it.itemName, quantity: it.quantity, price: it.price, specs: it.specs })) ?? [],
      status: created.status,
      createdAt: created.createdAt,
    }
  }

  static async getOrder(id: string): Promise<OrderRecord | null> {
    if (env.DEMO_MODE) return this.store.get(id) ?? null
    const prisma = await getPrisma()
    const o = await prisma.order.findUnique({ where: { id } })
    if (!o) return null
    return {
      id: o.id,
      restaurantId: o.restaurantId,
      phoneNumber: o.phoneNumber,
      total: o.total,
      itemsSummary: Array.isArray(o.items) ? (o.items as any[]).map((it) => `${it.quantity}x ${it.itemName}`).join(", ") : "",
      notFoundItems: "",
      orderItems: (o.items as any[])?.map((it: any) => ({ itemName: it.itemName, quantity: it.quantity, price: it.price, specs: it.specs })) ?? [],
      status: o.status,
      createdAt: o.createdAt,
    }
  }

  static async listByPhone(restaurantId: string, phoneNumber: string): Promise<OrderRecord[]> {
    if (env.DEMO_MODE) {
      return [...this.store.values()].filter((o) => o.restaurantId === restaurantId && o.phoneNumber === phoneNumber)
    }
    const prisma = await getPrisma()
    const list = await prisma.order.findMany({ where: { restaurantId, phoneNumber }, orderBy: { createdAt: "desc" } })
    return list.map((o: any) => ({
      id: o.id,
      restaurantId: o.restaurantId,
      phoneNumber: o.phoneNumber,
      total: o.total,
      itemsSummary: Array.isArray(o.items) ? (o.items as any[]).map((it) => `${it.quantity}x ${it.itemName}`).join(", ") : "",
      notFoundItems: "",
      orderItems: (o.items as any[])?.map((it: any) => ({ itemName: it.itemName, quantity: it.quantity, price: it.price, specs: it.specs })) ?? [],
      status: o.status,
      createdAt: o.createdAt,
    }))
  }
}
