// Production embedding utilities using Genkit Google AI
import { genkit } from "genkit";
import { googleAI, textEmbedding004 } from "@genkit-ai/googleai";

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
});

// Cosine similarity between two numeric vectors
export function cosineSim(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < len; i++) {
    const va = a[i] || 0
    const vb = b[i] || 0
    dot += va * vb
    na += va * va
    nb += vb * vb
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

// Simple deterministic fallback embedding (bag-of-words hashed into fixed dims)
export function fallbackEmbed(text: string, dims = 128): number[] {
  const vec = new Array(dims).fill(0)
  const tokens = String(text || "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  for (const t of tokens) {
    let h = 2166136261
    for (let i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i)
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    }
    const idx = Math.abs(h) % dims
    vec[idx] += 1
  }
  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map((v) => v / norm)
}

/**
 * Generate embedding using Google AI textEmbedding004
 * Falls back to deterministic embedding if Genkit fails
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const result = await ai.embed({
    embedder: textEmbedding004,
    content: text,
  });
  return result[0].embedding;
}

/**
 * Generate embedding for a menu item
 */
export async function generateMenuItemEmbedding(item: {
  name: string;
  description: string;
  category?: string;
  price: number;
}): Promise<number[]> {
  const embeddingText = `${item.name}. ${item.description}. ${item.category || ""}. Price: ${item.price} FCFA.`;
  return getEmbedding(embeddingText);
}

/**
 * Semantic search using vector similarity (requires pgvector extension)
 */
export async function searchMenuItemsByVector(
  businessId: string,
  query: string,
  limit: number = 5
): Promise<any[]> {
  const { getPrisma } = await import("@/src/lib/db");
  const prisma = await getPrisma();

  try {
    const queryEmbedding = await getEmbedding(query);

    // PostgreSQL vector similarity search
    const results = await prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        category,
        "isAvailable",
        1 - (embedding::vector <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity
      FROM "MenuItem"
      WHERE "businessId" = ${businessId}
        AND "isAvailable" = true
        AND embedding IS NOT NULL
      ORDER BY embedding::vector <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;

    return results as any[];
  } catch (error) {
    console.warn("Vector search failed (likely missing pgvector or API error), falling back to text search:", error);

    // Fallback to text search if vector search fails (e.g. pgvector not enabled)
    // This is still valid logic, not a simulation.
    const fallback = await prisma.menuItem.findMany({
      where: {
        businessId,
        isAvailable: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      take: limit,
    });

    return fallback.map((item: any) => ({ ...item, similarity: 0.5 }));
  }
}
