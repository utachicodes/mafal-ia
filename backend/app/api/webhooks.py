import hashlib
import logging
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from app.ai.rag_chain import get_rag_chain
from app.core import database

logger = logging.getLogger(__name__)
router = APIRouter()


class WebhookPayload(BaseModel):
    message: str
    sender_id: str
    metadata: dict = {}


@router.post("/{business_id}")
async def generic_business_webhook(
    business_id: str,
    payload: WebhookPayload,
    x_mafal_key: str = Header(None),
):
    if not x_mafal_key:
        raise HTTPException(status_code=401, detail="Missing API key")

    # Hash the incoming key and compare against stored SHA-256 hash
    incoming_hash = hashlib.sha256(x_mafal_key.encode()).hexdigest()
    if not await database.verify_api_key(business_id, incoming_hash):
        raise HTTPException(status_code=403, detail="Invalid API key")

    try:
        chain = get_rag_chain(business_id)
        response_text = await chain.chat(payload.message)

        await database.insert_message_log(
            restaurant_id=business_id,
            phone_number=payload.sender_id,
            message_id=f"gen_{business_id}_{payload.sender_id}",
            direction="outbound",
            status="delivered",
            raw={"input": payload.message, "output": response_text},
        )

        logger.info("Webhook handled", extra={"business_id": business_id, "sender": payload.sender_id})

        return {"success": True, "response": response_text, "business_id": business_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Webhook error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
