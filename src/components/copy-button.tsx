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
      className={cn("btn-secondary !min-h-[48px] !px-4 !text-[0.95rem]", className)}
    >
      {status === "copied" ? (
        <Check className="h-4 w-4 text-[#166534]" aria-hidden="true" />
      ) : status === "error" ? (
        <AlertTriangle className="h-4 w-4 text-amber" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span aria-live="polite">
        {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : label}
      </span>
    </button>
  );
}
