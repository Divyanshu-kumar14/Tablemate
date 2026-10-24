"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Check, Copy, Volume2, ShieldCheck, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface ScriptItem {
  id: number;
  question: string;
  hostResponse: string;
  category: string;
}

const SAMPLE_SCRIPT: ScriptItem[] = [
  {
    id: 1,
    question: "“Hi, I'm booking for my mother who requires soft textures. Can the kitchen prepare the branzino steamed and keep finishing sauces on the side?”",
    hostResponse: "“Yes, absolutely. Chef Marco prepares all fish to order; we can steam the branzino simply with olive oil and serve reductions in a side ramekin.”",
    category: "Texture & Sodium",
  },
  {
    id: 2,
    question: "“Are there any steps at the front doorway or leading into the customer restrooms?”",
    hostResponse: "“Zero stairs from sidewalk to table. Our entrance is completely level and our single-occupancy restroom has a 36-inch wide door with grab bars.”",
    category: "Mobility & Restroom",
  },
  {
    id: 3,
    question: "“My father wears bilateral hearing aids — could you seat us in the quiet corner banquette at 6:15 PM?”",
    hostResponse: "“The corner banquette in the rear dining room is our quietest table, well isolated from the bar and kitchen line. We'll hold it under your name.”",
    category: "Acoustics & Hearing",
  },
];

export function CallScriptSimulator() {
  const [checkedItems, setCheckedItems] = useState<number[]>([1]);
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setActiveQuestion(id);
  };

  const currentItem = SAMPLE_SCRIPT.find((item) => item.id === activeQuestion) || SAMPLE_SCRIPT[0];

  const fullScriptText = SAMPLE_SCRIPT.map(
    (item, index) => `${index + 1}. [${item.category}]\nQuestion: ${item.question}\nExpected: ${item.hostResponse}`
  ).join("\n\n");

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(fullScriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative mx-auto w-full">
      {/* Specular Ambient Glow */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent blur-3xl" />

      <div className="liquid-glass liquid-glass-specular relative overflow-hidden rounded-2xl border border-white/[0.1] bg-obsidian-900/90 p-5 sm:p-8 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                Live Host Verification Simulation
              </span>
            </div>
            <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              The 30-Second Verification Call
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Never rely on blind luck. Before seating an aging loved one, run this exact script. Click each question below to rehearse the exchange.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyScript}
              className="btn-secondary !min-h-[42px] !px-4 !text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Script Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Copy Call Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two-Column Simulation: Questions on Left, Live Audio/Response Dossier on Right */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Left: Interactive Checklist */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              Click a question to inspect the host answer:
            </p>

            {SAMPLE_SCRIPT.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              const isActive = activeQuestion === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-all duration-200 group",
                    isActive
                      ? "border-amber-400/60 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      aria-label={`Mark question ${item.id} verified`}
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
                        isChecked
                          ? "border-emerald-500 bg-emerald-500 text-obsidian-950 font-bold"
                          : "border-white/[0.2] bg-white/[0.04]",
                      )}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-semibold text-amber-400/90">
                          Question 0{item.id} · {item.category}
                        </span>
                        {isChecked && (
                          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <ShieldCheck className="h-3 w-3" /> Rehearsed
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm font-medium text-zinc-100 group-hover:text-amber-200 transition-colors leading-relaxed">
                        {item.question}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Audio Waveform & Host Response Dossier */}
          <div className="rounded-xl border border-white/[0.12] bg-obsidian-950/80 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs font-semibold text-zinc-200">
                  Call in Progress · Cobble Hill Trattoria
                </span>
              </div>

              {/* Gentle Audio Waveform Animation */}
              <div className="flex items-center gap-0.5">
                {[12, 20, 8, 16, 24, 10, 18, 14, 6].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 rounded-full bg-amber-400/80 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Active Dialogue */}
            <div className="mt-4 space-y-3.5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold block">
                  You Say ({currentItem.category})
                </span>
                <p className="mt-1 text-xs text-zinc-200 italic leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.06]">
                  {currentItem.question}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3" /> Host Response (Expected)
                </span>
                <p className="mt-1 text-xs text-zinc-100 leading-relaxed bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/20">
                  {currentItem.hostResponse}
                </p>
              </div>
            </div>

            {/* Verification metric footer */}
            <div className="mt-4 border-t border-white/[0.06] pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Duration: 28 seconds</span>
              <span className="text-emerald-400 font-semibold">Risk Eliminated: 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
