import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-zinc-400 backdrop-blur-md",
        compact ? "text-xs" : "text-xs sm:text-sm",
      )}
    >
      <Info className="h-4 w-4 shrink-0 text-amber-400/80 mt-0.5" aria-hidden="true" />
      <p className="leading-relaxed">
        <strong className="font-semibold text-zinc-200">A starting shortlist, not medical advice.</strong>{" "}
        We label the evidence we have and do not verify current kitchen practice or allergy protocols.
        Confirm texture, sodium, and accessibility by phone before visiting.
      </p>
    </div>
  );
}
