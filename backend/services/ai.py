"""OpenAI-based answer generation."""

from openai import OpenAI

from config import get_settings


def get_openai_client() -> OpenAI | None:
    settings = get_settings()
    if not settings.openai_configured:
        return None
    return OpenAI(api_key=settings.openai_api_key)


SYSTEM_PROMPT = """You are StudyBuddy, a helpful AI study assistant. Answer questions clearly and concisely.
Focus on accuracy and educational value. Use simple language and structure (bullet points or short paragraphs when helpful)."""


async def generate_answer(question: str, user_id: str | None = None) -> str:
    """Generate an answer for the given question using OpenAI."""
    client = get_openai_client()
    if not client:
        return "OpenAI is not configured. Set OPENAI_API_KEY in the environment."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
        max_tokens=1024,
    )
    content = response.choices[0].message.content
    return content or "I couldn't generate an answer for that."
