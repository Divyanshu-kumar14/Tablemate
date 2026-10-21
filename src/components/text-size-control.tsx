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
      // Storage can be unavailable in private modes; the default is fine.
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
      className="flex items-center gap-1 rounded-xl border border-line bg-paper p-1"
      role="group"
      aria-label="Text size"
    >
      <button
        type="button"
        onClick={() => change(-STEP)}
        disabled={size <= MIN}
        aria-label="Decrease text size"
        className="flex h-12 w-12 items-center justify-center rounded-lg text-ink transition hover:bg-teal-light/60 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>
      <span
        className="min-w-[3.4rem] text-center text-[0.9rem] font-semibold text-muted"
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
        className="flex h-12 w-12 items-center justify-center rounded-lg text-ink transition hover:bg-teal-light/60 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
