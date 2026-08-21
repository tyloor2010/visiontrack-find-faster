import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/technology", label: "Technology" },
  { to: "/for-families", label: "For Families" },
  { to: "/for-organizations", label: "For Organizations" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Link to="/" aria-label="VisionTrack home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/signin">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/app/cases/new">Start a Case</Link>
          </Button>
        </div>
        <button
          type="button"
          className="lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="py-2.5 text-sm">
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2 pb-3">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to="/app/cases/new">Start a Case</Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const groups = [
    {
      title: "Platform",
      links: [
        { to: "/how-it-works", label: "How It Works" },
        { to: "/technology", label: "Technology" },
        { to: "/app", label: "Open Workspace" },
      ],
    },
    {
      title: "Who it's for",
      links: [
        { to: "/for-families", label: "For Families" },
        { to: "/for-organizations", label: "For Organizations" },
        { to: "/about", label: "About VisionTrack" },
      ],
    },
    {
      title: "Trust",
      links: [
        { to: "/privacy", label: "Privacy & Safety" },
        { to: "/terms", label: "Terms" },
        { to: "/contact", label: "Contact" },
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo variant="inverted" showTagline />
          <p className="mt-4 max-w-xs text-sm text-navy-foreground/65">
            A coordination and review platform for authorized missing-person searches. VisionTrack supports human
            decision-making; it does not replace law enforcement, emergency services, or investigators.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="eyebrow text-navy-foreground/50">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-navy-foreground/80 transition-colors hover:text-navy-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-navy-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VisionTrack. Access restricted to authorized organizations and case contacts.</p>
          <p className="font-mono">Emergency? Contact your local emergency services first.</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("flex-1", className)}>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
