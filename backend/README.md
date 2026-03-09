# StudyBuddy API

FastAPI backend with OpenAI for answer generation and Supabase for optional storage. Uses **uv** for dependencies.

## Setup

1. **Create virtual env and install dependencies** (from `backend/`):

   ```bash
   uv sync
   ```

2. **Environment variables** – copy and edit:

   ```bash
   cp .env.example .env
   ```

   - `OPENAI_API_KEY` – required for `/api/ask`
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` – optional, for storing Q&A in `qa_history`

3. **Supabase** – To persist Q&A history, run the migration in your Supabase project:

   ```bash
   supabase db push
   ```

   Or run the SQL in `../supabase/migrations/20250309000000_create_qa_history.sql` in the SQL editor.

## Run

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  

## Endpoints

- `GET /health` – health check  
- `POST /api/ask` – body `{ "question": "..." }` → `{ "answer": "..." }` (OpenAI + optional Supabase save)
