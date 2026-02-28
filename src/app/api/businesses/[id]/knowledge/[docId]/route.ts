import { type NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

// DELETE /api/businesses/[id]/knowledge/[docId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { docId } = await params
  const prisma = await getPrisma()

  // KnowledgeChunk is cascade-deleted via onDelete: Cascade
  await prisma.knowledgeDoc.delete({ where: { id: docId } })

  return NextResponse.json({ ok: true })
}
