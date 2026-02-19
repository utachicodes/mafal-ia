import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Mafal-IA Neural Engine",
    description="High-performance AI backend for business automation",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error("Unhandled error on %s: %s", request.url, exc, exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health")
async def health_check():
    return {"status": "healthy", "engine": "Mafal-IA Core Python v2.0"}


from app.api.playground import router as playground_router
from app.api.webhooks import router as webhook_router

app.include_router(playground_router, prefix="/ai", tags=["Inference"])
app.include_router(webhook_router, prefix="/webhooks", tags=["Webhooks"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
