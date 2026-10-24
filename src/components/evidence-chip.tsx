import type { Evidence, FitItem } from "@/types/domain";
import { EVIDENCE_COPY } from "@/lib/labels";
import { cn } from "@/lib/cn";

const STYLES: Record<Evidence, { container: string; dot: string; glow: string }> = {
  reported: {
    container: "border-emerald-500/30 bg-emerald-950/50 text-emerald-300 hover:border-emerald-500/50",
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  },
  likely: {
    container: "border-amber-500/30 bg-amber-950/50 text-amber-300 hover:border-amber-500/50",
    dot: "bg-amber-400",
    glow: "shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  },
  ask: {
    container: "border-slate-500/30 bg-slate-900/60 text-slate-300 hover:border-slate-500/50",
    dot: "bg-slate-400",
    glow: "",
  },
};

export function EvidenceChip({ item }: { item: Pick<FitItem, "need" | "label"> }) {
  const style = STYLES[item.label];
  const copy = EVIDENCE_COPY[item.label];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition-all duration-200",
        style.container,
      )}
      title={copy.description}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot, style.glow)} aria-hidden="true" />
      {item.need}: <strong className="font-semibold text-white">{copy.label}</strong>
      <span className="sr-only"> — {copy.description}</span>
    </span>
  );
}
