"""StudyBuddy API - FastAPI app with OpenAI and Supabase."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import get_settings
from services.ai import generate_answer
from db.supabase import save_qa


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    if not settings.openai_configured:
        print("Warning: OPENAI_API_KEY not set. Answer generation will return a placeholder.")
    yield


app = FastAPI(
    title="StudyBuddy API",
    description="AI-powered study assistant",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """So opening the Render URL in a browser shows API is up (GET / used to 404)."""
    return {
        "service": "StudyBuddy API",
        "health": "GET /health",
        "ask": "POST /api/ask with JSON body {\"question\": \"...\"}",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/ask", response_model=AskResponse)
async def ask(req: AskRequest):
    """Generate an answer for the given question using OpenAI. Optionally stores in Supabase."""
    question = (req.question or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")
    # TODO: pass user_id from Clerk JWT when you add auth to backend
    user_id: str | None = None
    answer = await generate_answer(question, user_id=user_id)
    await save_qa(question, answer, user_id)
    return AskResponse(answer=answer)
