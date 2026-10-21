import type { Evidence, FitItem } from "@/types/domain";
import { EVIDENCE_COPY } from "@/lib/labels";
import { cn } from "@/lib/cn";

const STYLES: Record<Evidence, { container: string; dot: string }> = {
  reported: {
    container: "border-[#86EFAC] bg-[#F0FDF4] text-[#14532D]",
    dot: "bg-[#16A34A]",
  },
  likely: {
    container: "border-[#FCD34D] bg-[#FFFBEB] text-[#78350F]",
    dot: "bg-[#D97706]",
  },
  ask: {
    container: "border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]",
    dot: "bg-[#64748B]",
  },
};

export function EvidenceChip({ item }: { item: Pick<FitItem, "need" | "label"> }) {
  const style = STYLES[item.label];
  const copy = EVIDENCE_COPY[item.label];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.9rem] font-medium leading-snug",
        style.container,
      )}
      title={copy.description}
    >
      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", style.dot)} aria-hidden="true" />
      <span>
        {item.need}: <strong className="font-semibold">{copy.label}</strong>
      </span>
      <span className="sr-only"> — {copy.description}</span>
    </span>
  );
}
