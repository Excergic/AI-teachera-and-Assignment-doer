"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";

const SUGGESTIONS = [
  "Explain recursion with a simple example",
  "What are the key concepts in linear algebra?",
  "Summarize the causes of World War I",
  "How does photosynthesis work?",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ question: string; answer: string } | null>(null);
  const { isLoaded } = useUser();

  async function handleAsk() {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data.detail;
        const message = Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg).join(", ")
          : typeof detail === "string"
            ? detail
            : `Request failed: ${res.status}`;
        throw new Error(message || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      setResult({ question: q, answer: data.answer });
      setQuery("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 right-0 z-10">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors"
        >
          StudyBuddy
        </Link>
        <div className="flex items-center gap-3">
          {isLoaded && (
            <>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="rounded-full bg-white text-black text-sm font-medium px-4 py-2 hover:bg-zinc-200 transition-colors"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </Show>
            </>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-24">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
          {/* Logo / title – compact when there's a result */}
          <div className={`text-center ${result ? "mb-0" : ""}`}>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white mb-2">
              StudyBuddy
            </h1>
            <p className="text-zinc-500 text-sm sm:text-base">
              Ask anything. Get clear, reliable answers.
            </p>
          </div>

          {/* Search box */}
          <div className="w-full relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity" />
            <div className="relative flex items-center gap-3 rounded-2xl border border-zinc-700/80 bg-zinc-900/80 backdrop-blur-sm px-4 py-3.5 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500/50 transition-all">
              <svg
                className="w-5 h-5 text-zinc-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-base sm:text-lg outline-none min-w-0"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) handleAsk();
                }}
              />
              {loading ? (
                <span className="flex items-center gap-1 text-zinc-500 text-sm">
                  <span className="inline-block w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </span>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-500 border border-zinc-700">
                  ↵
                </kbd>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Answer result */}
          {result && (
            <div className="w-full rounded-2xl border border-zinc-700/80 bg-zinc-900/60 backdrop-blur-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-700/80">
                <p className="text-zinc-400 text-sm font-medium">Your question</p>
                <p className="text-zinc-100 mt-1">{result.question}</p>
              </div>
              <div className="px-4 py-4">
                <p className="text-zinc-400 text-sm font-medium mb-2">Answer</p>
                <div className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {result.answer}
                </div>
              </div>
            </div>
          )}

          {/* Suggestion chips – hide when we have a result to keep focus */}
          {!result && (
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-zinc-600 text-sm w-full text-center mb-1">
                Try asking
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-zinc-600 text-xs">
        Powered by AI · Built for learning
      </footer>
    </div>
  );
}
