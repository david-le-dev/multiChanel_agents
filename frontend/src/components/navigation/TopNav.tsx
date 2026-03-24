import Link from "next/link";

import { ButtonLink } from "@/components/ui/ButtonLink";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/generate", label: "Generator" },
  { href: "/results", label: "Results" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas/84 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/86 text-sm font-semibold shadow-panel">
            AM
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-ember">AI Marketing Ops</p>
            <p className="font-medium">Multi-channel Content Orchestrator</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/76 px-2 py-2 text-sm text-ink/70 shadow-[0_10px_22px_rgba(16,20,24,0.05)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <ButtonLink href="/generate" variant="primary">
          Start Analysis
        </ButtonLink>
      </div>
    </header>
  );
}
