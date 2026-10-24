"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

type CopyStatus = "idle" | "copied" | "error";

function fallbackCopy(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  area.style.pointerEvents = "none";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(area);
  if (!copied) throw new Error("Copy command failed");
}

export function CopyButton({
  text,
  label = "Copy script",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2_000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2_500);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200 active:scale-95",
        status === "copied"
          ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
          : status === "error"
            ? "border-red-500/40 bg-red-950/60 text-red-300"
            : "border-white/[0.12] bg-white/[0.04] text-zinc-200 hover:border-amber-400/40 hover:bg-white/[0.08] hover:text-white",
        className,
      )}
      aria-live="polite"
    >
      {status === "copied" ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>Copied to Clipboard!</span>
        </>
      ) : status === "error" ? (
        <>
          <AlertTriangle className="h-4 w-4 text-red-400" aria-hidden="true" />
          <span>Copy Failed</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
