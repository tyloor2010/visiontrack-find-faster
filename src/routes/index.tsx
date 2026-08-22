import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Boxes,
  Compass,
  FileStack,
  FileText,
  FolderKanban,
  Layers,
  LayoutDashboard,
  MapPin,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductPreview } from "@/components/site/ProductPreview";
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
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-navy text-navy-foreground">
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 rounded-sm border border-navy-foreground/15 px-2.5 py-1 text-navy-foreground/70">
                <ShieldCheck className="h-3.5 w-3.5" /> Authorized missing-person searches
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                See Further. Find Faster.
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
            <ProductPreview />
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

      {/* Impact metrics */}
      <section className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <p className="eyebrow text-navy-foreground/60">Platform snapshot</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Built for the volume real searches generate.
          </h2>
          <dl className="mt-10 grid gap-px border border-navy-foreground/10 bg-navy-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["48", "Active case records", "Structured intake, descriptors and contacts per case."],
              ["1,200+", "Evidence items indexed", "Photos, frames, documents and field notes with versioning."],
              ["3", "Review roles", "Administrator, Investigator and Reviewer permissions."],
              ["100%", "Actions audited", "Every upload, search and decision is attributed and timestamped."],
            ].map(([n, t, b], i) => (
              <Reveal key={t} delay={i * 110}>
                <div className="h-full bg-navy p-6">
                  <dt className="font-mono text-3xl font-semibold text-primary">{n}</dt>
                  <dd className="mt-3 text-sm font-medium text-navy-foreground/90">{t}</dd>
                  <dd className="mt-2 text-sm leading-relaxed text-navy-foreground/55">{b}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Modules */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-primary">Inside the workspace</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                Nine modules, one operational record.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/app">
                Open the workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              [LayoutDashboard, "Dashboard", "Active cases, newest candidate matches and team activity in one operational overview."],
              [FolderKanban, "Case management", "Sortable, filterable case table with status tracking and a guided multi-step intake wizard."],
              [ScanSearch, "Visual search", "Upload evidence, run identification passes and compare candidates side by side with similarity scores."],
              [FileStack, "Evidence center", "Central repository with chain-of-custody logging, uploader attribution and file provenance."],
              [MapPin, "Spatial map", "Geographic view of last-known locations, sighting reports and team deployment radii."],
              [Bell, "Alerts", "Notification center for new matches, status changes and escalations that need a reviewer."],
              [FileText, "Reports", "Structured case summaries and activity exports for briefings and handovers."],
              [Users, "Team", "Role assignment, invitations and per-case membership with scoped permissions."],
              [ShieldCheck, "Admin console", "Organization management, platform health and access review for administrators."],
            ].map(([Icon, t, b], i) => {
              const I = Icon as typeof ScanSearch;
              return (
                <Reveal key={t as string} delay={(i % 3) * 110}>
                  <article className="group h-full bg-card p-7 transition-colors duration-300 hover:bg-surface">
                    <I className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    <h3 className="mt-5 text-base font-semibold">{t as string}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b as string}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* First 48 hours timeline */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow text-primary">The first 48 hours</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Where time is usually lost — and where it is recovered.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              The early window of a search is decisive. VisionTrack structures that window into repeatable steps so a
              team can hand off between shifts without losing what has already been checked.
            </p>
          </div>
          <ol className="relative border-l border-border pl-6">
            {[
              ["H+0", "Intake", "A family member or authorized officer files the case: identity details, descriptors, last-known location and reference imagery."],
              ["H+1", "Evidence consolidation", "Photos arriving from relatives and CCTV operators are uploaded once, deduplicated and attributed to a source."],
              ["H+3", "First visual pass", "Candidate frames are ranked against reference imagery. Reviewers triage the queue by confidence."],
              ["H+6", "Field coordination", "Confirmed areas of interest are pushed to the spatial map with search radii and assigned teams."],
              ["H+12", "Escalation", "Unresolved high-confidence candidates are escalated to an investigator with a full evidence packet."],
              ["H+48", "Reporting", "A structured summary documents everything reviewed, dismissed and pending for the next shift or authority."],
            ].map(([h, t, b], i) => (
              <Reveal key={h} as="li" delay={i * 90} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-primary bg-background" />
                <span className="font-mono text-xs text-primary">{h}</span>
                <h3 className="mt-1.5 font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Roles */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <p className="eyebrow text-primary">Who uses it</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Different responsibilities, one shared record.
          </h2>
          <div className="mt-10 grid gap-px border border-border bg-border lg:grid-cols-3">
            {[
              ["Families", "Submit a case, upload reference photographs, follow progress and receive updates without chasing anyone for status.", "/for-families", "Read the family guide"],
              ["Organizations", "NGOs, search teams and authorized units coordinate volunteers, assign reviewers and keep an auditable operational record.", "/for-organizations", "See organization tooling"],
              ["Reviewers", "Trained reviewers work a ranked candidate queue, compare evidence side by side and record an explicit accept or dismiss decision.", "/how-it-works", "See the review workflow"],
            ].map(([t, b, to, cta], i) => (
              <Reveal key={t} delay={i * 130}>
                <article className="flex h-full flex-col bg-card p-7">
                  <h3 className="text-lg font-semibold">{t}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{b}</p>
                  <Link to={to} className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline">
                    {cta} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology detail */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-primary">Under the hood</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Computer vision as a ranking tool, not a verdict.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Reference imagery and submitted evidence are normalized, encoded into comparable representations, and
              scored against each other. The output is an ordered list with explicit confidence — designed to shorten
              the queue a human has to look at, not to replace them.
            </p>
            <Button asChild variant="outline" className="mt-7">
              <Link to="/technology">
                Explore the technology <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-px self-start border border-border bg-border sm:grid-cols-2">
            {[
              ["Normalization", "Alignment, lighting correction and quality scoring before anything is compared."],
              ["Representation", "Evidence is encoded into comparable vectors so similarity is measurable, not subjective."],
              ["Ranking", "Candidates are returned ordered by confidence, with low-quality inputs flagged rather than hidden."],
              ["Explainability", "Every result shows what was compared, when, and by which pass — visible in the case timeline."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 110} className="bg-card p-6">
                <h3 className="text-sm font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow text-primary">Questions</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Common questions.</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Something not covered here? <Link to="/contact" className="text-primary hover:underline">Contact the team</Link>.
            </p>
          </div>
          <dl className="grid gap-px border border-border bg-border">
            {[
              ["Does VisionTrack confirm a person's identity?", "No. The platform reports visual similarity between authorized evidence items. Confirming identity is always a human decision made by an authorized reviewer, and that decision is recorded."],
              ["Who can access a case?", "Only named users with an assigned role on that case. Administrators manage membership, and access changes are written to the audit log."],
              ["What happens to uploaded evidence?", "Each item is stored against a single case with uploader attribution, timestamps and a chain-of-custody entry for every subsequent action."],
              ["Can families use it directly?", "Families can submit a case and reference imagery, follow progress, and receive updates. Review and field coordination remain with authorized team members."],
              ["Is this a surveillance system?", "No. It operates only on evidence attached to a registered missing-person case and is not designed to identify people outside an authorized search."],
            ].map(([q, a], i) => (
              <Reveal key={q} delay={i * 90} className="bg-card p-6">
                <dt className="font-semibold">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</dd>
              </Reveal>
            ))}
          </dl>
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
              <Link to="/app/cases/new">Start a Case</Link>
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
