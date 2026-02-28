import { type NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { ingestDocument } from "@/src/lib/knowledge-ingestor"

export const runtime = "nodejs"

// GET /api/businesses/[id]/knowledge — list all docs for this business
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: businessId } = await params
  const prisma = await getPrisma()

  const docs = await prisma.knowledgeDoc.findMany({
    where: { businessId },
    select: {
      id: true,
      filename: true,
      mimeType: true,
      createdAt: true,
      _count: { select: { chunks: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    docs: docs.map((d: any) => ({
      id: d.id,
      filename: d.filename,
      mimeType: d.mimeType,
      createdAt: d.createdAt,
      chunkCount: d._count.chunks,
    })),
  })
}

// POST /api/businesses/[id]/knowledge — upload and ingest a document
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: businessId } = await params

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const allowedTypes = ["application/pdf", "text/plain", "text/markdown"]
  const mimeType = file.type || "text/plain"

  if (!allowedTypes.includes(mimeType) && !file.name.endsWith(".md")) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PDF, TXT, or MD." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const { docId, chunkCount } = await ingestDocument(businessId, file.name, mimeType, buffer)

  return NextResponse.json({ ok: true, docId, chunkCount })
}
