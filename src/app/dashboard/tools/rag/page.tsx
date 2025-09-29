"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ragIndex, ragQuery, RagIndexResponse, RagQueryResponse } from "@/src/lib/rag-client"

export default function RagToolPage() {
  const [namespace, setNamespace] = useState("default")
  const [files, setFiles] = useState<File[]>([])
  const [indexing, setIndexing] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string>("")
  const [contexts, setContexts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"simple" | "llm">("simple")
  const streamingRef = useRef<EventSource | null>(null)

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || [])
    setFiles(f)
  }

  const doIndex = async () => {
    setIndexing(true)
    setError(null)
    try {
      const res: RagIndexResponse = await ragIndex(files, namespace)
      if (!res.ok) throw new Error(res.error || "Failed to index")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIndexing(false)
    }
  }

  const ask = async () => {
    setLoading(true)
    setError(null)
    try {
      const res: RagQueryResponse = await ragQuery({ question, namespace, with_answer: true, top_k: 5, answer_mode: mode })
      if (!res.ok) throw new Error(res.error || "Query failed")
      setAnswer(res.answer || "")
      setContexts(res.contexts || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const stream = async () => {
    setAnswer("")
    setContexts([])
    setError(null)
    if (streamingRef.current) {
      streamingRef.current.close()
      streamingRef.current = null
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const url = new URL(`${base}/rag/stream_query`)
    url.searchParams.set("question", question)
    url.searchParams.set("namespace", namespace)
    url.searchParams.set("top_k", "5")
    url.searchParams.set("answer_mode", mode)
    const es = new EventSource(url.toString())
    streamingRef.current = es
    es.addEventListener("meta", (ev: MessageEvent) => {
      try {
        const payload = JSON.parse((ev as any).data)
        setContexts(payload.contexts || [])
      } catch {}
    })
    es.addEventListener("delta", (ev: MessageEvent) => {
      setAnswer((prev) => prev + (ev as any).data.replace(/^'|'$/g, ""))
    })
    es.addEventListener("done", () => {
      es.close()
      streamingRef.current = null
    })
    es.addEventListener("error", (ev: MessageEvent) => {
      setError(String((ev as any).data || "Stream error"))
      es.close()
      streamingRef.current = null
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Knowledge RAG</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Index Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Namespace</label>
              <Input value={namespace} onChange={(e) => setNamespace(e.target.value)} placeholder="default" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Files (PDF/TXT)</label>
              <Input type="file" multiple accept=".pdf,.txt,.md" onChange={onFiles} />
            </div>
            <div className="flex gap-2">
              <Button onClick={doIndex} disabled={indexing || files.length === 0}>
                {indexing ? "Indexing..." : "Index"}
              </Button>
              {error && <div className="text-sm text-red-500 self-center">{error}</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask anything about your docs..." />
            <div className="flex gap-2 items-center">
              <select className="border rounded h-9 px-2 bg-background" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                <option value="simple">Simple</option>
                <option value="llm">LLM</option>
              </select>
              <Button onClick={ask} disabled={loading || question.trim() === ""}>{loading ? "Thinking..." : "Ask"}</Button>
              <Button variant="outline" onClick={stream} disabled={question.trim() === ""}>Stream</Button>
            </div>
            {answer && (
              <div className="prose dark:prose-invert max-w-none">
                <h4>Answer</h4>
                <p className="whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {contexts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Retrieved Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contexts.map((c, i) => (
              <div key={i} className="p-3 rounded border bg-muted/30 whitespace-pre-wrap">
                <div className="text-xs text-muted-foreground mb-1">[{i+1}]</div>
                {c}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
