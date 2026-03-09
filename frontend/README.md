# StudyBuddy Frontend

Perplexity-style home page with Clerk authentication. Deploy to Vercel with one click.

## Getting Started

1. **Copy environment variables** (optional for local dev – Clerk keyless mode works without keys):

   ```bash
   cp .env.local.example .env.local
   ```

   Then add your [Clerk](https://dashboard.clerk.com) keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

2. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Push your repo to GitHub and import the project in [Vercel](https://vercel.com/new) (or connect the `frontend` folder as root).
2. Add environment variables in **Vercel → Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` – from [Clerk Dashboard](https://dashboard.clerk.com) → API Keys
   - `CLERK_SECRET_KEY` – from the same page (never expose this in the client)
3. Deploy. Vercel will detect Next.js and run `npm run build` automatically.

After deployment, in Clerk Dashboard set your production URLs under **Configure → Paths** (e.g. Sign-in URL: `/sign-in`, Sign-up URL: `/sign-up`).
