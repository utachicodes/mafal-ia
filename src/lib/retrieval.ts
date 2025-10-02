import { prisma } from "@/lib/prisma"
import { getEmbedding, cosineSim, fallbackEmbed } from "@/src/lib/embeddings"

export type RetrievedItem = {
  id: string
  name: string
  description: string
  price: number
  category?: string | null
  isAvailable: boolean
  score: number
}

function lexicalScore(query: string, text: string): number {
  const q = String(query || "").toLowerCase()
  const t = String(text || "").toLowerCase()
  let s = 0
  for (const term of q.split(/\s+/).filter(Boolean)) {
    if (t.includes(term)) s += 1
  }
  return s
}

export async function retrieveMenuItems(restaurantId: string, query: string, k = 5): Promise<RetrievedItem[]> {
  const items = await prisma.menuItem.findMany({
    where: { restaurantId, isAvailable: true },
    select: { id: true, name: true, description: true, price: true, category: true, isAvailable: true, embedding: true },
    take: 200,
  })

  if (items.length === 0) return []

  // Attempt embedding retrieval
  const qVec = await getEmbedding(query)

  const scored = items.map((m) => {
    const text = [m.name, m.description, m.category].filter(Boolean).join(" \n")
    let score = 0
    if (Array.isArray(m.embedding)) {
      score = cosineSim(qVec, m.embedding as number[])
    } else {
      // lexical fallback if embedding missing
      score = lexicalScore(query, text)
    }
    return {
      id: m.id,
      name: m.name,
      description: m.description,
      price: m.price,
      category: m.category,
      isAvailable: m.isAvailable,
      score,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, k)
}
