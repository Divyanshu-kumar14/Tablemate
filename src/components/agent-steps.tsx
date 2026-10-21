import { AlertTriangle, Loader2 } from "lucide-react";
import type { AgentDone, AgentStep } from "@/types/agent-ui";
import { cn } from "@/lib/cn";

const STEP_LABELS: Record<string, string> = {
  resolve_seeds: "Resolve taste signals",
  get_place_candidates: "Find candidate venues",
  apply_senior_fit: "Apply evidence rules",
  explain: "Write taste notes",
};

const DEGRADED_COPY: Record<string, string> = {
  qloo: "Live Qloo results were unavailable, so sample venues are shown.",
  llm: "The explanation model was unavailable; taste notes use templates.",
  budget: "The daily explanation budget was reached; taste notes use templates.",
  few_results: "Fewer than three live matches. Showing what exists.",
  sample_location: "Sample data covers Brooklyn, Edison, and Chicago.",
  unresolved_seeds: "Some taste signals could not be resolved; the rest were used.",
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
    <div className="card-paper p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-teal">
          Agent trace
        </h2>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-3 py-1 text-[0.9rem] font-medium text-muted">
          {loading && !done ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Working
            </>
          ) : done?.mode === "mock" ? (
            "Sample mode"
          ) : done ? (
            `${done.qloo_calls} Qloo calls`
          ) : (
            "Live"
          )}
        </span>
      </div>

      <ol className="mt-4 space-y-3" aria-live="polite">
        {steps.length === 0 ? (
          <li className="text-[0.95rem] text-muted">Waiting for the first step…</li>
        ) : (
          steps.map((step) => (
            <li key={step.step} className="flex gap-3">
              <span
                className={cn(
                  "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  step.status === "running"
                    ? "bg-teal status-running"
                    : step.status === "done"
                      ? "bg-[#16A34A]"
                      : "bg-amber",
                )}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[0.95rem] font-semibold leading-snug">
                  {STEP_LABELS[step.step] ?? step.step}
                  <span className="sr-only"> — {step.status}</span>
                </p>
                {step.detail && (
                  <p className="mt-0.5 text-[0.85rem] leading-snug text-muted">{step.detail}</p>
                )}
                {typeof step.ms === "number" && step.ms > 0 && (
                  <p className="mt-0.5 text-[0.8rem] text-muted">{step.ms}ms</p>
                )}
              </div>
            </li>
          ))
        )}
      </ol>

      {done && (
        <p className="mt-4 border-t border-line/70 pt-3 text-[0.9rem] text-muted">
          {done.ms}ms total · {done.llm_used ? "LLM taste notes" : "Templated taste notes"}
        </p>
      )}

      {done && done.degraded.length > 0 && (
        <ul className="mt-3 space-y-2">
          {done.degraded.map((item) => (
            <li key={item} className="flex gap-2 text-[0.85rem] leading-snug text-amber">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{DEGRADED_COPY[item] ?? item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
