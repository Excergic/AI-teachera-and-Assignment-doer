-- Q&A history for StudyBuddy (optional; backend works without this table)
create table if not exists public.qa_history (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id text,
  question text not null,
  answer text not null
);

-- Optional: RLS so users only see their own history (when using Supabase Auth)
-- alter table public.qa_history enable row level security;
-- create policy "Users can read own qa_history"
--   on public.qa_history for select
--   using (auth.uid()::text = user_id);
-- create policy "Users can insert own qa_history"
--   on public.qa_history for insert
--   with check (auth.uid()::text = user_id);

comment on table public.qa_history is 'Stores question/answer pairs from StudyBuddy API (user_id from Clerk when provided)';
