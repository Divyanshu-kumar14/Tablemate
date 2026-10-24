"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

const STORAGE_KEY = "tablemate:text-size";
const MIN = 18;
const MAX = 24;
const STEP = 2;
const DEFAULT = 20;

function applySize(size: number) {
  document.documentElement.style.fontSize = `${size}px`;
}

export function TextSizeControl() {
  const [size, setSize] = useState(DEFAULT);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(saved) && saved >= MIN && saved <= MAX) {
        setSize(saved);
        applySize(saved);
      }
    } catch {
      // Storage can be unavailable in private modes; default is fine.
    }
  }, []);

  function change(delta: number) {
    const next = Math.min(MAX, Math.max(MIN, size + delta));
    setSize(next);
    applySize(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage failures.
    }
  }

  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-white/[0.1] bg-white/[0.04] p-1 backdrop-blur-md"
      role="group"
      aria-label="Text size"
    >
      <button
        type="button"
        onClick={() => change(-STEP)}
        disabled={size <= MIN}
        aria-label="Decrease text size"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        className="min-w-[3.2rem] text-center font-mono text-xs font-semibold text-zinc-400"
        aria-live="polite"
      >
        <span aria-hidden="true">Aa {size}</span>
        <span className="sr-only">Text size {size} pixels</span>
      </span>
      <button
        type="button"
        onClick={() => change(STEP)}
        disabled={size >= MAX}
        aria-label="Increase text size"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
