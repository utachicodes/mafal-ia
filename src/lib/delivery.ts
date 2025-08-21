export type DeliveryEstimate = {
  zone: string
  fee: number
  etaMinutes: number
  notes?: string
}

// Very simple keyword-based zoning. In production, replace with geocoding or a merchant-defined table.
const ZONES: Array<{ name: string; keywords: string[]; fee: number; eta: number }> = [
  { name: "Dakar Plateau", keywords: ["plateau", "sandaga", "pikine-plateau"], fee: 1000, eta: 25 },
  { name: "Almadies", keywords: ["almadies", "ngor", "les almadies"], fee: 1500, eta: 35 },
  { name: "Ouakam", keywords: ["ouakam", "mamadou diop"], fee: 1200, eta: 30 },
  { name: "Yoff", keywords: ["yoff", "aeroport", "aéroport"], fee: 1200, eta: 30 },
  { name: "Mermoz/Sacré-Cœur", keywords: ["mermoz", "sacre coeur", "sacré-cœur", "sacre-coeur"], fee: 1200, eta: 30 },
  { name: "Parcelles", keywords: ["parcelles", "upa", "u\u00a0pa"], fee: 1400, eta: 35 },
  { name: "Guediawaye", keywords: ["guédiawaye", "guediawaye", "thiaroye"], fee: 1800, eta: 45 },
  { name: "Pikine", keywords: ["pikine", "keur massar"], fee: 1800, eta: 45 },
]

export function estimateDelivery(locationText: string): DeliveryEstimate | null {
  if (!locationText) return null
  const normalized = locationText.toLowerCase()
  for (const z of ZONES) {
    if (z.keywords.some((k) => normalized.includes(k))) {
      return { zone: z.name, fee: z.fee, etaMinutes: z.eta }
    }
  }
  // Unknown zone fallback
  return { zone: "Unknown", fee: 2000, etaMinutes: 50, notes: "Approximate for non-mapped area" }
}

export function formatEstimate(est: DeliveryEstimate): string {
  const base = `${est.zone} • ~${est.etaMinutes} min • ${est.fee} FCFA`
  return est.notes ? `${base} (${est.notes})` : base
}
