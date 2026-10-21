import Link from "next/link";
import { Logo } from "@/components/logo";
import { TextSizeControl } from "@/components/text-size-control";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75">
      <div className="container-page flex min-h-[76px] items-center justify-between gap-3 py-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg"
          aria-label="Tablemate home"
        >
          <Logo />
          <span className="hidden font-display text-[1.5rem] font-semibold tracking-tight sm:inline">
            Tablemate
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#how-it-works"
            className="hidden rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-muted transition hover:text-ink md:inline-flex"
          >
            How it works
          </Link>
          <Link
            href="/plan"
            className="btn-secondary hidden !min-h-[48px] !px-4 !text-[0.95rem] sm:inline-flex"
          >
            Build a shortlist
          </Link>
          <TextSizeControl />
        </nav>
      </div>
    </header>
  );
}
