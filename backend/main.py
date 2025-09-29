from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from fastapi.responses import StreamingResponse
import asyncio

from rag import RagEngine

app = FastAPI(title="Mafal-IA Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RagEngine()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/rag/index")
async def rag_index(
    files: List[UploadFile] = File(...),
    namespace: str = Form("default")
):
    try:
        n_docs = await rag.index_files(files, namespace)
        return {"ok": True, "namespace": namespace, "documents": n_docs}
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})

@app.post("/rag/query")
async def rag_query(
    question: str = Form(...),
    namespace: str = Form("default"),
    top_k: int = Form(5),
    with_answer: bool = Form(True),
    answer_mode: str = Form("simple"),
):
    try:
        result = await rag.query(
            question=question,
            namespace=namespace,
            top_k=top_k,
            with_answer=with_answer,
            answer_mode=answer_mode,
        )
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})

@app.get("/rag/stream_query")
async def rag_stream_query(
    question: str,
    namespace: str = "default",
    top_k: int = 5,
    answer_mode: str = "simple",
):
    async def event_gen():
        try:
            result = await rag.query(question=question, namespace=namespace, top_k=top_k, with_answer=True, answer_mode=answer_mode)
            contexts = result.get("contexts", [])
            metadatas = result.get("metadatas", [])
            # Send metadata first
            yield f"event: meta\ndata: {{\"contexts\": {contexts!r}, \"metadatas\": {metadatas!r}}}\n\n"
            answer = result.get("answer", "")
            # Stream in chunks
            step = max(20, len(answer)//40)
            for i in range(0, len(answer), step):
                chunk = answer[i:i+step]
                yield f"event: delta\ndata: {chunk!r}\n\n"
                await asyncio.sleep(0.01)
            yield "event: done\ndata: {}\n\n"
        except Exception as e:
            yield f"event: error\ndata: {str(e)!r}\n\n"
    return StreamingResponse(event_gen(), media_type="text/event-stream")
