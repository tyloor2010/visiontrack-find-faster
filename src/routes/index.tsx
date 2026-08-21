import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Compass, Layers, ScanSearch, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductPreview } from "@/components/site/ProductPreview";
import { CinematicIntro } from "@/components/site/CinematicIntro";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

const title = "VisionTrack — See Further. Find Faster.";
const description =
  "VisionTrack helps authorized teams organize missing-person cases, review visual evidence, and turn scattered information into reviewable leads.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

const capabilities = [
  {
    icon: ScanSearch,
    name: "Visual Intelligence",
    body: "Analyze authorized images and video frames to surface visual similarities across a case's evidence set. Results are ranked candidates for human review — never identity decisions.",
  },
  {
    icon: Layers,
    name: "Search Coordination",
    body: "Case details, evidence, locations, assignments and search activity live in one workspace, so every team member works from the same record instead of scattered messages.",
  },
  {
    icon: Compass,
    name: "Faster Decisions",
    body: "Scattered tips, uploads and sightings become an organized, timestamped lead queue that investigators and reviewers can act on in order of relevance.",
  },
];

function Home() {
  return (
    <SiteLayout>
      <CinematicIntro />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-navy text-navy-foreground">
        <div className="absolute inset-0 grid-blueprint opacity-60" aria-hidden="true" />
        <div className="vt-aurora absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="vt-scan" style={{ animationDelay: "0s" }} />
          <span className="vt-scan" style={{ animationDelay: "2.5s" }} />
          <span className="vt-ping left-[12%] top-[22%] h-24 w-24" />
          <span className="vt-ping right-[18%] bottom-[18%] h-32 w-32" style={{ animationDelay: "1.4s" }} />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 rounded-sm border border-navy-foreground/15 px-2.5 py-1 text-navy-foreground/70">
                <ShieldCheck className="h-3.5 w-3.5" /> Authorized missing-person searches
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                See Further. <span className="vt-shimmer-text">Find Faster.</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-foreground/70">
                VisionTrack combines computer vision, visual intelligence, and location-based case management to help
                authorized teams organize missing-person searches and identify potential leads faster.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="transition-transform duration-200 hover:scale-[1.03]">
                  <Link to="/app/cases/new">
                    Start a Case <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-navy-foreground/25 bg-transparent text-navy-foreground transition-transform duration-200 hover:scale-[1.03] hover:bg-navy-foreground/10 hover:text-navy-foreground">
                  <Link to="/technology">Explore the Technology</Link>
                </Button>
              </div>
            </Reveal>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px border border-navy-foreground/10 bg-navy-foreground/10">
              {[
                ["Case workspace", "One record per case"],
                ["Review model", "Human decision required"],
                ["Access", "Role-based & audited"],
              ].map(([k, v], i) => (
                <Reveal key={k} delay={460 + i * 90}>
                  <div className="bg-navy px-3 py-3">
                    <dt className="eyebrow text-navy-foreground/45">{k}</dt>
                    <dd className="mt-1.5 text-[13px] text-navy-foreground/85">{v}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
          <Reveal delay={200} className="lg:-mr-10">
            <div className="vt-float">
              <ProductPreview />
            </div>
          </Reveal>
        </div>
      </section>


      {/* Mission */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow text-primary">Mission</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Every search matters.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              When someone goes missing, the first hours produce an overwhelming amount of unstructured information:
              photographs sent through five different chat apps, handwritten descriptions, half-remembered sightings,
              screenshots of screenshots, and a search team that has no shared picture of what has already been checked.
            </p>
            <p>
              That fragmentation costs time. Evidence gets duplicated, leads get lost between volunteers and
              investigators, and nobody can answer the simple question:{" "}
              <span className="font-medium text-foreground">what do we actually know right now?</span>
            </p>
            <p>
              VisionTrack exists to remove that fragmentation. It gives authorized teams a single structured case
              record, a disciplined way to submit and track visual evidence, and a review workflow where every
              algorithmic suggestion ends with a person making the decision.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <p className="eyebrow text-primary">How VisionTrack helps</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Three capabilities, built around one review discipline.
          </h2>
          <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.name} delay={i * 130}>
                <article className="group relative h-full overflow-hidden bg-card p-7 transition-colors duration-300 hover:bg-surface">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <c.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow strip */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-primary">Workflow</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">From report to reviewed lead.</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/how-it-works">
                See the full workflow <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ol className="mt-10 grid gap-px border border-border bg-border md:grid-cols-4">
            {[
              ["01", "Create a case", "Structured intake: identity details, last known location, descriptors, contacts and reference images."],
              ["02", "Upload evidence", "Photos, video frames, documents, locations and notes — each item versioned and attributed."],
              ["03", "Visual search", "Ranked visual similarities across authorized evidence with explicit confidence scores."],
              ["04", "Review & coordinate", "Reviewers compare, decide, and assign field follow-up. Every action is logged."],
            ].map(([n, t, b], i) => (
              <Reveal key={n} as="li" delay={i * 120} className="bg-card p-6">
                <span className="font-mono text-xs text-primary">{n}</span>
                <h3 className="mt-3 font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Responsibility */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-primary">Responsible by design</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              A support tool for authorized cases. Nothing more.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              VisionTrack is scoped deliberately narrowly. It operates on evidence attached to a registered
              missing-person case, by named users with defined roles, under a full audit trail. It is not a surveillance
              product and it is not built to identify people who are not the subject of an authorized search.
            </p>
            <Button asChild variant="outline" className="mt-7">
              <Link to="/privacy">Read Privacy & Safety</Link>
            </Button>
          </div>
          <ul className="grid gap-px self-start border border-border bg-border sm:grid-cols-2">
            {[
              ["No identity claims", "The system reports visual similarity, never confirmed identity."],
              ["Human review required", "Every potential match must be accepted or dismissed by an authorized reviewer."],
              ["Scoped access", "Role-based permissions restrict cases, evidence and admin functions."],
              ["Full audit trail", "Uploads, searches, reviews and role changes are recorded and traceable."],
            ].map(([t, b], i) => (
              <Reveal key={t} as="li" delay={i * 110} className="bg-card p-6">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h3 className="text-sm font-semibold">{t}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{b}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Open a case workspace.</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Explore the full workspace with sample cases, evidence and simulated search output.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app">View the workspace</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
