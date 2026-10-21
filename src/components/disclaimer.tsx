import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border border-amber/30 bg-amber-light/60 p-4 text-ink",
        compact ? "text-[0.9rem]" : "text-[1rem]",
      )}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
      <p className="leading-relaxed">
        <strong className="font-semibold">A starting shortlist, not medical advice.</strong>{" "}
        We label the evidence we have. We do not verify safety or current kitchen practice.
        Call ahead before you go.
      </p>
    </div>
  );
}
