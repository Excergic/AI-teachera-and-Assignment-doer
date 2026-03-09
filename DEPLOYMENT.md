# Deployment: Vercel (frontend) + Render (backend)

## CI/CD

- **GitHub Actions** (`.github/workflows/ci.yml`) runs on every push/PR to `main` or `master`:
  - **Frontend**: `npm ci`, `npm run lint`, `npm run build` in `frontend/`
  - **Backend**: `uv sync`, then verify app import in `backend/`

- **Deploys**: Frontend and backend deploy via Vercel and Render when you connect the repo; no deploy step in the workflow.

- **Optional**: In GitHub → repo **Settings** → **Secrets and variables** → **Actions**, add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and (under Variables) `NEXT_PUBLIC_API_URL` so the frontend build uses real values in CI. The workflow uses placeholders if these are not set.

---

## 1. Deploy frontend to Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo.
3. Set **Root Directory** to `frontend` (important for monorepo).
4. **Environment variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` – from [Clerk Dashboard](https://dashboard.clerk.com)
   - `CLERK_SECRET_KEY` – from Clerk Dashboard
   - `NEXT_PUBLIC_API_URL` – your **backend URL** (e.g. `https://studybuddy-api.onrender.com`). Set this after the backend is deployed.
5. Deploy. Vercel will run `npm run build` and deploy.

---

## 2. Deploy backend to Render

### Option A: Blueprint (recommended)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your GitHub repo. Render will detect `render.yaml` at the repo root.
3. When prompted, set **secret** env vars (they have `sync: false` in the Blueprint):
   - `OPENAI_API_KEY`
   - `SUPABASE_URL` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)
4. Create the Blueprint. The backend service will be created with:
   - **Root directory**: `backend`
   - **Build**: `pip install uv && uv sync --frozen`
   - **Start**: `uv run uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Copy the service URL (e.g. `https://studybuddy-api.onrender.com`).

### Option B: Manual Web Service

1. **New** → **Web Service** → connect your repo.
2. Settings:
   - **Name**: `studybuddy-api`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install uv && uv sync --frozen`
   - **Start Command**: `uv run uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add env vars: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (optional).
4. Deploy.

---

## 3. Connect frontend to backend

1. In **Vercel** → your project → **Settings** → **Environment Variables**, set:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g. `https://studybuddy-api.onrender.com`).
2. Redeploy the frontend so the new value is used.

---

## CORS

The backend allows:

- `http://localhost:3000` and `http://127.0.0.1:3000`
- Any origin matching `https://*.vercel.app`

If you use a custom domain on Vercel, add it to `allow_origins` in `backend/main.py` or use an env-based list.
