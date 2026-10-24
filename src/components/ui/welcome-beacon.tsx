"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

const AUDIENCES = [
  { id: "parent", label: "Planning for an aging parent", subtitle: "Connecting Mom or Dad's lifelong tastes with safe dining." },
  { id: "spouse", label: "Planning for a partner / spouse", subtitle: "Intimate, quiet rooms with modified texture and low sodium." },
  { id: "pro", label: "Senior living & care concierge", subtitle: "Auditable venue intelligence for resident outings & family visits." },
];

export function WelcomeBeacon({ className }: { className?: string }) {
  const [greeting, setGreeting] = useState("Welcome, caregiver");
  const [selectedAudience, setSelectedAudience] = useState(AUDIENCES[0]!);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning, caregiver");
    else if (hour < 17) setGreeting("Good afternoon, caregiver");
    else setGreeting("Good evening, caregiver");
  }, []);

  return (
    <div className={cn("relative mx-auto flex flex-col items-center", className)}>
      {/* Interactive Main Pill */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="liquid-glass group flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-obsidian-900 to-obsidian-950 px-4 py-1.5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {/* Audio Waveform Micro-Visualizer */}
          <div className="flex items-center gap-0.5 h-3.5 px-0.5" aria-hidden="true">
            <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
            <span className="w-0.5 h-3.5 bg-amber-300 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
            <span className="w-0.5 h-1.5 bg-amber-500 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.1s]" />
          </div>

          <span className="font-mono text-xs font-semibold text-amber-300">
            {greeting}
          </span>

          <span className="h-3 w-[1px] bg-white/[0.15]" aria-hidden="true" />

          <span className="text-xs font-medium text-zinc-300 flex items-center gap-1 group-hover:text-white transition-colors">
            {selectedAudience.label}
            <ChevronDown className={cn("h-3 w-3 text-amber-400 transition-transform duration-200", isOpen && "rotate-180")} />
          </span>
        </button>

        {/* Dropdown Role Selector */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 10, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="liquid-glass absolute left-1/2 -translate-x-1/2 top-full z-50 w-80 sm:w-96 rounded-2xl border border-white/[0.15] bg-obsidian-900/98 p-2 shadow-2xl backdrop-blur-2xl"
              role="listbox"
            >
              <div className="px-3 py-1.5 border-b border-white/[0.06]">
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  Personalize Your Visit
                </p>
                <p className="text-[11px] text-zinc-400">Choose your caregiver context for tailored suggestions.</p>
              </div>

              <div className="mt-1 space-y-1">
                {AUDIENCES.map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => {
                      setSelectedAudience(aud);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150",
                      selectedAudience.id === aud.id
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                        : "hover:bg-white/[0.06] text-zinc-300",
                    )}
                    role="option"
                    aria-selected={selectedAudience.id === aud.id}
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">{aud.label}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-400 leading-snug">{aud.subtitle}</p>
                    </div>
                    {selectedAudience.id === aud.id && (
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
