// Embedding utilities: uses Genkit in production (placeholder hook),
// falls back to a deterministic lexical embedding locally.

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

// Main embedding function. Hook Genkit here in production.
export async function getEmbedding(text: string): Promise<number[]> {
  // TODO: Integrate Genkit Google AI embeddings here when available in runtime.
  // For now, always fallback to deterministic embedding so local/dev works.
  return fallbackEmbed(text)
}
