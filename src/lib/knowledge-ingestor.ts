import { getEmbedding } from "@/src/lib/embeddings"
import { getPrisma } from "@/src/lib/db"

const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

function chunkText(text: string): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length)
    chunks.push(text.slice(start, end).trim())
    start += CHUNK_SIZE - CHUNK_OVERLAP
  }
  return chunks.filter((c) => c.length > 20)
}

export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default
    const data = await pdfParse(buffer)
    return data.text
  }
  // TXT, MD, plain text
  return buffer.toString("utf-8")
}

export async function ingestDocument(
  businessId: string,
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<{ docId: string; chunkCount: number }> {
  const prisma = await getPrisma()
  const contentText = await extractText(buffer, mimeType)
  const chunks = chunkText(contentText)

  const doc = await prisma.$transaction(async (tx: any) => {
    const doc = await tx.knowledgeDoc.create({
      data: { businessId, filename, mimeType, contentText },
    })

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i])
      await tx.knowledgeChunk.create({
        data: {
          docId: doc.id,
          businessId,
          content: chunks[i],
          embedding: embedding as any,
          chunkIndex: i,
        },
      })
    }

    return doc
  })

  return { docId: doc.id, chunkCount: chunks.length }
}
