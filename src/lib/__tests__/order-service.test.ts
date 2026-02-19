import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockPrisma } = vi.hoisted(() => {
  const mockPrisma = {
    order: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  }
  return { mockPrisma }
})

vi.mock("@/src/lib/db", () => ({
  getPrisma: vi.fn().mockResolvedValue(mockPrisma),
}))

import { OrderService } from "@/src/lib/order-service"

const BASE_PARAMS = {
  restaurantId: "rest-1",
  phoneNumber: "+221771234567",
  total: 5000,
  itemsSummary: "2x Thieboudienne",
  orderItems: [{ itemName: "Thieboudienne", quantity: 2, price: 2500 }],
}

function makeOrderRecord(overrides: Record<string, any> = {}) {
  return {
    id: "order-abc",
    restaurantId: "rest-1",
    phoneNumber: "+221771234567",
    customerName: "",
    total: 5000,
    items: { summary: "2x Thieboudienne", notFound: [], lines: [] },
    notes: null,
    status: "pending",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  }
}

describe("OrderService.createOrder", () => {
  beforeEach(() => vi.clearAllMocks())

  it("creates order with correct restaurantId and phoneNumber", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord())
    await OrderService.createOrder(BASE_PARAMS)
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.restaurantId).toBe("rest-1")
    expect(callArg.data.phoneNumber).toBe("+221771234567")
  })

  it("truncates total to integer (Math.trunc)", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord({ total: 4999 }))
    await OrderService.createOrder({ ...BASE_PARAMS, total: 4999.99 })
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.total).toBe(4999)
  })

  it("clamps negative total to 0", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord({ total: 0 }))
    await OrderService.createOrder({ ...BASE_PARAMS, total: -100 })
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.total).toBe(0)
  })

  it("uses customerName when provided", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord({ customerName: "Moussa" }))
    await OrderService.createOrder({ ...BASE_PARAMS, customerName: "Moussa" })
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.customerName).toBe("Moussa")
  })

  it("falls back to empty string for customerName when not provided", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord())
    await OrderService.createOrder(BASE_PARAMS)
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.customerName).toBe("")
  })

  it("stores orderItems as lines in items JSON", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord())
    await OrderService.createOrder({
      ...BASE_PARAMS,
      orderItems: [
        { itemName: "Thieboudienne", quantity: 2, price: 2500 },
        { itemName: "Bissap", quantity: 1, price: 500 },
      ],
    })
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.items.lines).toHaveLength(2)
    expect(callArg.data.items.lines[0].itemName).toBe("Thieboudienne")
    expect(callArg.data.items.lines[1].quantity).toBe(1)
  })

  it("stores notFoundItems as array when string provided", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord())
    await OrderService.createOrder({ ...BASE_PARAMS, notFoundItems: "UnknownDish, AnotherDish" })
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.items.notFound).toEqual(["UnknownDish", "AnotherDish"])
  })

  it("stores notFoundItems as-is when array provided", async () => {
    mockPrisma.order.create.mockResolvedValue(makeOrderRecord())
    await OrderService.createOrder({ ...BASE_PARAMS, notFoundItems: ["Dish A", "Dish B"] })
    const callArg = mockPrisma.order.create.mock.calls[0][0]
    expect(callArg.data.items.notFound).toEqual(["Dish A", "Dish B"])
  })

  it("returns the created order record", async () => {
    const record = makeOrderRecord({ id: "order-xyz", total: 5000 })
    mockPrisma.order.create.mockResolvedValue(record)
    const result = await OrderService.createOrder(BASE_PARAMS)
    expect(result.id).toBe("order-xyz")
    expect(result.total).toBe(5000)
  })
})

describe("OrderService.getOrder", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when order not found", async () => {
    mockPrisma.order.findUnique.mockResolvedValue(null)
    const result = await OrderService.getOrder("nonexistent")
    expect(result).toBeNull()
  })

  it("returns order record when found", async () => {
    const record = makeOrderRecord({ id: "order-123" })
    mockPrisma.order.findUnique.mockResolvedValue(record)
    const result = await OrderService.getOrder("order-123")
    expect(result).not.toBeNull()
    expect(result!.id).toBe("order-123")
    expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({ where: { id: "order-123" } })
  })
})

describe("OrderService.listByPhone", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns empty array when no orders found", async () => {
    mockPrisma.order.findMany.mockResolvedValue([])
    const result = await OrderService.listByPhone("rest-1", "+221771234567")
    expect(result).toEqual([])
  })

  it("returns orders for a specific phone + restaurant", async () => {
    const orders = [makeOrderRecord({ id: "o1" }), makeOrderRecord({ id: "o2" })]
    mockPrisma.order.findMany.mockResolvedValue(orders)
    const result = await OrderService.listByPhone("rest-1", "+221771234567")
    expect(result).toHaveLength(2)
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { restaurantId: "rest-1", phoneNumber: "+221771234567" },
        orderBy: { createdAt: "desc" },
      })
    )
  })
})

describe("OrderService.getAllOrders", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns orders with restaurant name included", async () => {
    const orders = [
      { ...makeOrderRecord(), restaurant: { name: "Chez Fatou" } },
      { ...makeOrderRecord({ id: "o2" }), restaurant: null },
    ]
    mockPrisma.order.findMany.mockResolvedValue(orders)
    const result = await OrderService.getAllOrders()
    expect(result).toHaveLength(2)
    expect(result[0].restaurant?.name).toBe("Chez Fatou")
    expect(result[1].restaurant).toBeNull()
  })

  it("limits results to 100 orders", async () => {
    mockPrisma.order.findMany.mockResolvedValue([])
    await OrderService.getAllOrders()
    const callArg = mockPrisma.order.findMany.mock.calls[0][0]
    expect(callArg.take).toBe(100)
  })
})
