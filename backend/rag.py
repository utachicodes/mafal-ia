from __future__ import annotations

import os
import uuid
from typing import List, Dict, Any

import chromadb
from chromadb.utils import embedding_functions
from fastapi import UploadFile
from pypdf import PdfReader
from openai import OpenAI

# Simple text splitter
def split_text(text: str, chunk_size: int = 900, chunk_overlap: int = 150) -> List[str]:
    """Heuristic splitter: paragraph -> sentence -> fixed window fallback."""
    text = text.replace("\r\n", "\n").strip()
    if not text:
        return []

    paras = [p.strip() for p in text.split("\n\n") if p.strip()]
    sentences: List[str] = []
    for p in paras:
        # naive sentence split
        parts = []
        buff = ""
        for ch in p:
            buff += ch
            if ch in ".!?" and len(buff) > 40:
                parts.append(buff.strip())
                buff = ""
        if buff.strip():
            parts.append(buff.strip())
        sentences.extend(parts if parts else [p])

    chunks: List[str] = []
    cur = ""
    for s in sentences:
        if len(cur) + 1 + len(s) <= chunk_size:
            cur = (cur + " " + s).strip()
        else:
            if cur:
                chunks.append(cur)
            # start new
            if len(s) > chunk_size:
                # hard wrap overly long sentence
                i = 0
                while i < len(s):
                    chunks.append(s[i:i+chunk_size])
                    i += chunk_size - chunk_overlap
                cur = ""
            else:
                cur = s
    if cur:
        chunks.append(cur)

    # add overlaps
    if chunk_overlap > 0 and len(chunks) > 1:
        overlapped: List[str] = []
        for i, ch in enumerate(chunks):
            if i == 0:
                overlapped.append(ch)
            else:
                prev = overlapped[-1]
                overlap = prev[-chunk_overlap:]
                combined = (overlap + " " + ch).strip()
                overlapped.append(combined)
        chunks = overlapped
    return [c.strip() for c in chunks if c.strip()]

class RagEngine:
    def __init__(self, persist_dir: str | None = None, model_name: str = "all-MiniLM-L6-v2") -> None:
        self.persist_dir = persist_dir or os.path.join(os.getcwd(), "backend", ".chroma")
        os.makedirs(self.persist_dir, exist_ok=True)
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        self.embedder = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=model_name)
        self.openai_client: OpenAI | None = None
        if os.getenv("OPENAI_API_KEY"):
            try:
                self.openai_client = OpenAI()
            except Exception:
                self.openai_client = None

    def _collection(self, namespace: str):
        return self.client.get_or_create_collection(name=namespace, embedding_function=self.embedder)

    async def index_files(self, files: List[UploadFile], namespace: str) -> int:
        collection = self._collection(namespace)
        total_docs = 0
        for f in files:
            content = await f.read()
            text = self._extract_text(f.filename, content)
            docs = split_text(text)
            if not docs:
                continue
            ids = [str(uuid.uuid4()) for _ in docs]
            metadatas = [{"source": f.filename}] * len(docs)
            collection.add(ids=ids, documents=docs, metadatas=metadatas)
            total_docs += len(docs)
        return total_docs

    def _extract_text(self, filename: str, content: bytes) -> str:
        lower = filename.lower()
        if lower.endswith(".pdf"):
            from io import BytesIO
            reader = PdfReader(BytesIO(content))
            texts = []
            for page in reader.pages:
                try:
                    texts.append(page.extract_text() or "")
                except Exception:
                    continue
            return "\n".join(texts)
        if lower.endswith('.docx'):
            try:
                from io import BytesIO
                from docx import Document  # type: ignore
                doc = Document(BytesIO(content))
                return "\n".join(p.text for p in doc.paragraphs)
            except Exception:
                return ""
        if lower.endswith('.html') or lower.endswith('.htm'):
            try:
                from bs4 import BeautifulSoup  # type: ignore
                html = content.decode('utf-8', errors='ignore')
                soup = BeautifulSoup(html, 'html.parser')
                # Remove scripts/styles
                for t in soup(['script','style']):
                    t.decompose()
                return soup.get_text('\n', strip=True)
            except Exception:
                return ""
        else:
            # Treat as utf-8 text
            try:
                return content.decode("utf-8", errors="ignore")
            except Exception:
                return ""

    async def query(self, question: str, namespace: str, top_k: int = 5, with_answer: bool = True, answer_mode: str = "simple") -> Dict[str, Any]:
        collection = self._collection(namespace)
        q = collection.query(query_texts=[question], n_results=top_k)
        contexts = [doc for doc in (q.get("documents") or [[]])[0]]
        metadatas = (q.get("metadatas") or [[]])[0]
        response: Dict[str, Any] = {
            "ok": True,
            "namespace": namespace,
            "question": question,
            "contexts": contexts,
            "metadatas": metadatas,
        }
        if with_answer:
            context_text = "\n\n".join(contexts)
            if answer_mode == "llm" and self.openai_client is not None:
                try:
                    answer = self._llm_answer(question, context_text)
                    response["answer"] = answer
                except Exception:
                    response["answer"] = self._simple_answer(question, context_text)
            else:
                response["answer"] = self._simple_answer(question, context_text)
        return response

    def _simple_answer(self, question: str, context: str) -> str:
        # Placeholder non-LLM answer: echo most relevant context
        if not context:
            return "No context available. Try indexing documents first."
        return (
            "Based on the indexed documents, here are the most relevant passages:\n\n"
            + context[:1200]
        )

    def _llm_answer(self, question: str, context: str) -> str:
        if not self.openai_client:
            return self._simple_answer(question, context)
        prompt = (
            "You are a helpful assistant. Answer the user's question using ONLY the provided context. "
            "If the answer isn't in the context, say you don't know succinctly.\n\n"
            f"Context:\n{context[:6000]}\n\nQuestion: {question}\nAnswer:"
        )
        chat = self.openai_client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return chat.choices[0].message.content or ""
