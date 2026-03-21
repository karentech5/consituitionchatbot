"""
main.py
=======
FastAPI server for Nepal Constitution Chatbot.

Endpoints:
  GET  /          → health check
  POST /chat      → accepts { "message": "..." }, returns { "answer": "..." }

Run with:
  uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import get_answer

# ── App Setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Nepal Constitution Chatbot API",
    description="RAG-powered chatbot for the Constitution of Nepal (2015)",
    version="1.0.0",
)

# ── CORS — allow the React dev server to talk to this API ─────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # CRA dev server (fallback)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ──────────────────────────────────────────────────
class ChatRequest(BaseModel):
    """JSON body sent by the frontend: { "message": "user question here" }"""
    message: str


class ChatResponse(BaseModel):
    """JSON response returned to the frontend: { "answer": "bot reply here" }"""
    answer: str


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    """Health check — confirms the API is running."""
    return {"status": "ok", "service": "Nepal Constitution Chatbot API"}


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Receives a user question, runs it through the RAG pipeline,
    and returns the AI-generated answer.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        answer = get_answer(request.message.strip())
        return ChatResponse(answer=answer)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your request: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
