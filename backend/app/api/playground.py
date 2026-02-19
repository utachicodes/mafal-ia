import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.rag_chain import get_rag_chain

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    business_id: Optional[str] = None
    context: dict = {}


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat_interaction(request: ChatRequest):
    try:
        chain = get_rag_chain(request.business_id)
        response_text = await chain.chat(request.message)
        logger.info("Playground chat", extra={"business_id": request.business_id})
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error("Playground error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def playground_status():
    return {"status": "Playground Engine Online", "mode": "Inference"}
