# StudyBuddy

AI study assistant for computer engineering students.

## Structure

- **backend/** — Python (uv), FastAPI, RAG, agents
- **frontend/** — Next.js (TypeScript)

## Backend (uv)

```bash
cd backend
uv sync
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
uv run python main.py       # or run your app
```

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000

## License

MIT — see [LICENSE](LICENSE).
