"""Supabase client and helpers."""

from supabase import create_client, Client

from config import get_settings


def get_supabase() -> Client | None:
    """Return Supabase client if configured."""
    settings = get_settings()
    if not settings.supabase_configured:
        return None
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
    )


async def save_qa(question: str, answer: str, user_id: str | None) -> None:
    """Store a Q&A in Supabase (if table exists)."""
    client = get_supabase()
    if not client:
        return
    try:
        client.table("qa_history").insert({
            "question": question,
            "answer": answer,
            "user_id": user_id,
        }).execute()
    except Exception:
        # Table might not exist yet; ignore for now
        pass
