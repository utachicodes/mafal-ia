export interface RagIndexResponse {
  ok: boolean;
  namespace: string;
  documents: number;
  error?: string;
}

export interface RagQueryResponse {
  ok: boolean;
  namespace: string;
  question: string;
  contexts: string[];
  metadatas: Array<Record<string, any>>;
  answer?: string;
  error?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function ragIndex(files: File[], namespace: string): Promise<RagIndexResponse> {
  const form = new FormData();
  files.forEach(f => form.append("files", f));
  form.append("namespace", namespace);

  const res = await fetch(`${BASE_URL}/rag/index`, {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function ragQuery(params: { question: string; namespace: string; top_k?: number; with_answer?: boolean; answer_mode?: "simple" | "llm"; }): Promise<RagQueryResponse> {
  const form = new FormData();
  form.append("question", params.question);
  form.append("namespace", params.namespace);
  form.append("top_k", String(params.top_k ?? 5));
  form.append("with_answer", String(params.with_answer ?? true));
  if (params.answer_mode) form.append("answer_mode", params.answer_mode);

  const res = await fetch(`${BASE_URL}/rag/query`, { method: "POST", body: form });
  return res.json();
}
