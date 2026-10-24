import { AlertTriangle, Loader2, Sparkles, CheckCircle2, Clock } from "lucide-react";
import type { AgentDone, AgentStep } from "@/types/agent-ui";
import { cn } from "@/lib/cn";

const STEP_LABELS: Record<string, string> = {
  resolve_seeds: "Resolve Taste Signals",
  get_place_candidates: "Qloo Insights Search",
  apply_senior_fit: "Senior Fit Validation",
  explain: "Gemini Explanation Layer",
};

const DEGRADED_COPY: Record<string, string> = {
  qloo: "Live Qloo results were unavailable; sample fixtures are shown.",
  llm: "The explanation model was unavailable; notes use templates.",
  budget: "The daily token budget was reached; notes use templates.",
  few_results: "Fewer than three live matches in this radius. Showing available places.",
  sample_location: "Sample data covers Brooklyn, Edison, and Chicago.",
  unresolved_seeds: "Some taste signals could not be resolved; remainder used.",
};

export function AgentSteps({
  steps,
  done,
  loading,
}: {
  steps: AgentStep[];
  done: AgentDone | null;
  loading: boolean;
}) {
  return (
    <div className="liquid-glass liquid-glass-specular p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
            Agent Execution HUD
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
          {loading && !done ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-amber-400" aria-hidden="true" />
              Streaming...
            </>
          ) : done?.mode === "mock" ? (
            "Sample Mode"
          ) : done ? (
            `${done.qloo_calls} Qloo Calls · ${done.ms}ms`
          ) : (
            "Live"
          )}
        </span>
      </div>

      <ol className="mt-4 space-y-3" aria-live="polite">
        {steps.length === 0 ? (
          <li className="font-mono text-xs text-zinc-500">Initializing agent loop...</li>
        ) : (
          steps.map((step) => (
            <li key={step.step} className="flex items-start gap-2.5 text-xs">
              <span
                className={cn(
                  "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                  step.status === "running"
                    ? "text-amber-400"
                    : step.status === "done"
                      ? "text-emerald-400"
                      : "text-red-400",
                )}
                aria-hidden="true"
              >
                {step.status === "running" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : step.status === "done" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-zinc-200">
                    {STEP_LABELS[step.step] ?? step.step}
                  </p>
                  {typeof step.ms === "number" && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                      <Clock className="h-2.5 w-2.5" /> {step.ms}ms
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))
        )}
      </ol>

      {done && done.degraded.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-white/[0.08] pt-3 text-[11px]">
          {done.degraded.map((item) => (
            <p key={item} className="flex items-center gap-1.5 text-amber-400/90 font-mono">
              <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{DEGRADED_COPY[item] ?? item}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
