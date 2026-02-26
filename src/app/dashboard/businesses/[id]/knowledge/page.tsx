"use client"

import { useState, useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, FileText, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface KnowledgeDoc {
  id: string
  filename: string
  mimeType: string
  createdAt: string
  chunkCount: number
}

export default function KnowledgePage() {
  const { id: businessId } = useParams<{ id: string }>()
  const [docs, setDocs] = useState<KnowledgeDoc[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDocs = useCallback(async () => {
    try {
      const res = await fetch(`/api/businesses/${businessId}/knowledge`)
      const data = await res.json()
      setDocs(data.docs || [])
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    loadDocs()
  }, [loadDocs])

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return
    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/api/businesses/${businessId}/knowledge`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Upload failed"); return }
      await loadDocs()
    } finally {
      setUploading(false)
    }
  }, [businessId, loadDocs])

  const handleDelete = useCallback(async (docId: string) => {
    await fetch(`/api/businesses/${businessId}/knowledge/${docId}`, { method: "DELETE" })
    setDocs(prev => prev.filter(d => d.id !== docId))
  }, [businessId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Upload documents to power your AI chatbot with business-specific knowledge.
        </p>
      </div>

      {/* Upload dropzone */}
      <Card
        className={`border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleUpload(file)
        }}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">Drop a file here or</p>
            <label className="cursor-pointer">
              <span className="text-primary hover:underline text-sm"> browse to upload</span>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                disabled={uploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">PDF, TXT, or Markdown — max 10 MB</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* Document list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uploaded Documents</CardTitle>
          <CardDescription>{docs.length} document{docs.length !== 1 ? "s" : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : docs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No documents yet. Upload one above.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {docs.map((doc) => (
                <motion.li
                  key={doc.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.chunkCount} chunks · {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
