import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

// DELETE /api/businesses/[id]/knowledge/[docId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { docId } = await params
  const prisma = await getPrisma()

  // KnowledgeChunk is cascade-deleted via onDelete: Cascade
  await prisma.knowledgeDoc.delete({ where: { id: docId } })

  return NextResponse.json({ ok: true })
}
