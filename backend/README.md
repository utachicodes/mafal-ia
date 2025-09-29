# Mafal-IA Backend (FastAPI + RAG)

This backend powers the RAG tool using FastAPI and ChromaDB.

## Quickstart

1. Create a virtual environment and install deps

```bash
cd backend
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

2. Run the API

```bash
uvicorn main:app --reload --port 8000
```

3. Endpoints

- `GET /health` – sanity check
- `POST /rag/index` – form-data with files[] and namespace
- `POST /rag/query` – x-www-form-urlencoded or multipart fields: question, namespace, top_k, with_answer

Persisted ChromaDB data is stored in `backend/.chroma`.
