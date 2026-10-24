import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={cn(
        "liquid-glass flex items-start gap-3 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-obsidian-900 to-obsidian-950 p-4 text-zinc-300 backdrop-blur-md",
        compact ? "text-xs" : "text-sm",
      )}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
      <p className="leading-relaxed">
        <strong className="font-semibold text-amber-300">A starting shortlist, not medical advice.</strong>{" "}
        We label the evidence we have and do not verify current kitchen practice or allergy protocols.
        Confirm texture, sodium, and accessibility by phone before visiting.
      </p>
    </div>
  );
}
