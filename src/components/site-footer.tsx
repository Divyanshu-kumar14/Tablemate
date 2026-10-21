import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper/70">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Tablemate home">
            <Logo />
            <span className="font-display text-2xl font-semibold">Tablemate</span>
          </Link>
          <p className="mt-4 max-w-xs font-display text-xl leading-snug text-muted">
            Good taste doesn&apos;t retire.
          </p>
        </div>

        <div>
          <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-teal">
            What this is
          </h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-muted">
            A shortlist tool for older adults and the people who care for them. It is not
            medical advice, and it does not verify that a restaurant can meet a dietary,
            texture, or accessibility requirement. Call ahead.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/plan" className="prose-link">
              Build a shortlist
            </Link>
            <Link href="/#how-it-works" className="prose-link">
              How it works
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-teal">
            The data
          </h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-muted">
            Taste signals come from Qloo when a key is configured. Without a key, the app
            runs on clearly labeled sample venues so the whole flow stays testable.
          </p>
          <p className="mt-4 text-[0.9rem] text-muted">
            Built with Next.js, Qloo, and an optional Gemini explanation layer.
          </p>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="container-page flex flex-col justify-between gap-2 py-5 text-[0.9rem] text-muted sm:flex-row">
          <p>© 2026 Tablemate. A hackathon build.</p>
          <p>No accounts. No medical claims. Just a better phone call.</p>
        </div>
      </div>
    </footer>
  );
}
