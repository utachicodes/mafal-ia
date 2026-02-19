import { describe, it, expect } from "vitest"
import { estimateDelivery, formatEstimate } from "../delivery"

describe("estimateDelivery", () => {
  it("detects Dakar Plateau zone and returns 1000 FCFA fee", () => {
    const result = estimateDelivery("I am near plateau")
    expect(result).not.toBeNull()
    expect(result!.zone).toBe("Dakar Plateau")
    expect(result!.fee).toBe(1000)
    expect(result!.etaMinutes).toBe(25)
  })

  it("detects Almadies zone", () => {
    const result = estimateDelivery("deliver to almadies")
    expect(result).not.toBeNull()
    expect(result!.zone).toBe("Almadies")
    expect(result!.fee).toBe(1500)
  })

  it("detects Pikine zone", () => {
    const result = estimateDelivery("I live in pikine")
    expect(result).not.toBeNull()
    expect(result!.zone).toBe("Pikine")
    expect(result!.fee).toBe(1800)
  })

  it("returns 2000 FCFA fallback fee for unknown zone", () => {
    const result = estimateDelivery("deliver to some unknown area xyz")
    expect(result).not.toBeNull()
    expect(result!.fee).toBe(2000)
    expect(result!.zone).toBe("Unknown")
    expect(result!.etaMinutes).toBe(50)
  })

  it("returns null for empty location text", () => {
    const result = estimateDelivery("")
    expect(result).toBeNull()
  })

  it("is case-insensitive", () => {
    const result = estimateDelivery("PLATEAU area")
    expect(result).not.toBeNull()
    expect(result!.zone).toBe("Dakar Plateau")
  })
})

describe("formatEstimate", () => {
  it("formats known zone estimate without notes", () => {
    const est = { zone: "Dakar Plateau", fee: 1000, etaMinutes: 25 }
    const str = formatEstimate(est)
    expect(str).toBe("Dakar Plateau • ~25 min • 1000 FCFA")
  })

  it("appends notes when present", () => {
    const est = { zone: "Unknown", fee: 2000, etaMinutes: 50, notes: "Approximate for non-mapped area" }
    const str = formatEstimate(est)
    expect(str).toContain("Approximate for non-mapped area")
    expect(str).toContain("Unknown")
    expect(str).toContain("2000 FCFA")
  })
})
