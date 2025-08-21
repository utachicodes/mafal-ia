import { env } from "@/src/lib/env"

export type OrderRecord = {
  id: string
  restaurantId: string
  phoneNumber: string
  total: number
  itemsSummary: string
  notFoundItems: string
  orderItems: { itemName: string; quantity: number }[]
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

// Simple in-memory order store for demo and default usage.
// In production, replace with Prisma models.
export class OrderService {
  private static store = new Map<string, OrderRecord>()

  static async createOrder(params: Omit<OrderRecord, "id" | "status" | "createdAt">): Promise<OrderRecord> {
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

  static async getOrder(id: string): Promise<OrderRecord | null> {
    return this.store.get(id) ?? null
  }

  static async listByPhone(restaurantId: string, phoneNumber: string): Promise<OrderRecord[]> {
    return [...this.store.values()].filter((o) => o.restaurantId === restaurantId && o.phoneNumber === phoneNumber)
  }
}
