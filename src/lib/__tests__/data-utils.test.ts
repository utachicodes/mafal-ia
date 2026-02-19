import { describe, it, expect } from "vitest"
import { calculateOrderTotal, searchMenuItems, validateMenuItem } from "../data-utils"
import type { MenuItem, OrderItem } from "../data"

const sampleMenu: MenuItem[] = [
  { id: "1", name: "Thieboudienne", description: "Traditional Senegalese fish and rice", price: 3500, isAvailable: true },
  { id: "2", name: "Yassa Poulet", description: "Marinated chicken with onions", price: 3000, isAvailable: true },
  { id: "3", name: "Mafé", description: "Peanut stew", price: 2800, category: "Plats", isAvailable: true },
]

describe("calculateOrderTotal", () => {
  it("sums correctly for known items", () => {
    const items: OrderItem[] = [
      { itemName: "Thieboudienne", quantity: 2 },
      { itemName: "Yassa Poulet", quantity: 1 },
    ]
    const { total, foundItems, notFoundItems } = calculateOrderTotal(items, sampleMenu)
    expect(total).toBe(3500 * 2 + 3000 * 1) // 10000
    expect(foundItems).toHaveLength(2)
    expect(notFoundItems).toHaveLength(0)
  })

  it("reports not-found items", () => {
    const items: OrderItem[] = [
      { itemName: "Thieboudienne", quantity: 1 },
      { itemName: "NonExistentDish", quantity: 2 },
    ]
    const { total, foundItems, notFoundItems } = calculateOrderTotal(items, sampleMenu)
    expect(total).toBe(3500)
    expect(foundItems).toHaveLength(1)
    expect(notFoundItems).toContain("NonExistentDish")
  })

  it("returns zero total for empty order", () => {
    const { total } = calculateOrderTotal([], sampleMenu)
    expect(total).toBe(0)
  })

  it("is case-insensitive when matching items", () => {
    const items: OrderItem[] = [{ itemName: "thieboudienne", quantity: 1 }]
    const { foundItems } = calculateOrderTotal(items, sampleMenu)
    expect(foundItems).toHaveLength(1)
    expect(foundItems[0].item.name).toBe("Thieboudienne")
  })
})

describe("searchMenuItems", () => {
  it("returns all items when query is empty", () => {
    const result = searchMenuItems(sampleMenu, "")
    expect(result).toHaveLength(sampleMenu.length)
  })

  it("returns matching items by name", () => {
    const result = searchMenuItems(sampleMenu, "yassa")
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Yassa Poulet")
  })

  it("returns matching items by description", () => {
    const result = searchMenuItems(sampleMenu, "peanut")
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Mafé")
  })

  it("returns matching items by category", () => {
    const result = searchMenuItems(sampleMenu, "Plats")
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Mafé")
  })

  it("returns empty array when no items match", () => {
    const result = searchMenuItems(sampleMenu, "sushi")
    expect(result).toHaveLength(0)
  })
})

describe("validateMenuItem", () => {
  it("returns true for a valid menu item", () => {
    const item: MenuItem = { id: "1", name: "Dish", description: "A nice dish", price: 2000, isAvailable: true }
    expect(validateMenuItem(item)).toBe(true)
  })

  it("returns false when id is missing", () => {
    const item = { name: "Dish", description: "A nice dish", price: 2000, isAvailable: true }
    expect(validateMenuItem(item as Partial<MenuItem>)).toBe(false)
  })

  it("returns false when name is missing", () => {
    const item = { id: "1", description: "A nice dish", price: 2000, isAvailable: true }
    expect(validateMenuItem(item as Partial<MenuItem>)).toBe(false)
  })

  it("returns false when price is zero", () => {
    const item = { id: "1", name: "Dish", description: "A nice dish", price: 0, isAvailable: true }
    expect(validateMenuItem(item as Partial<MenuItem>)).toBe(false)
  })

  it("returns false when price is negative", () => {
    const item = { id: "1", name: "Dish", description: "A nice dish", price: -100, isAvailable: true }
    expect(validateMenuItem(item as Partial<MenuItem>)).toBe(false)
  })
})
