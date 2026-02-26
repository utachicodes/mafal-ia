import { getPrisma } from "@/src/lib/db"
import { getEmbedding, cosineSim, fallbackEmbed } from "@/src/lib/embeddings"

export type RetrievedChunk = {
  id: string
  content: string
  score: number
  docId: string
  chunkIndex: number
}

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

export async function retrieveMenuItems(businessId: string, query: string, k = 5): Promise<RetrievedItem[]> {
  const prisma = await getPrisma()
  const items = await prisma.menuItem.findMany({
    where: { businessId, isAvailable: true },
    select: { id: true, name: true, description: true, price: true, category: true, isAvailable: true, embedding: true },
    take: 200,
  })

  if (items.length === 0) return []

  // Attempt embedding retrieval
  const qVec = await getEmbedding(query)

  const scored = items.map((m: any) => {
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

  scored.sort((a: any, b: any) => b.score - a.score)
  return scored.slice(0, k)
}

export async function retrieveKnowledge(businessId: string, query: string, k = 3): Promise<RetrievedChunk[]> {
  const prisma = await getPrisma()
  const chunks = await prisma.knowledgeChunk.findMany({
    where: { businessId },
    select: { id: true, content: true, embedding: true, docId: true, chunkIndex: true },
    take: 500,
  })

  if (chunks.length === 0) return []

  const qVec = await getEmbedding(query)

  const scored = chunks.map((c: any) => {
    let score = 0
    if (Array.isArray(c.embedding)) {
      score = cosineSim(qVec, c.embedding as number[])
    } else {
      score = lexicalScore(query, c.content)
    }
    return { id: c.id, content: c.content, score, docId: c.docId, chunkIndex: c.chunkIndex }
  })

  scored.sort((a: any, b: any) => b.score - a.score)
  return scored.slice(0, k)
}
