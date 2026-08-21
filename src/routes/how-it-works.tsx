import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const title = "How VisionTrack Works — Case to Reviewed Lead";
const description =
  "The four-step VisionTrack workflow: create a case, upload authorized evidence, run a visual search, and review potential matches with human decision-making.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    title: "Create a Case",
    body: "Intake is structured, not free text. A complete case record gives every later step something reliable to work from.",
    items: [
      "Person name and age",
      "Last known location",
      "Date and time last seen",
      "Clothing at time of disappearance",
      "Physical descriptors and distinguishing features",
      "Emergency and case contact information",
      "Authorized reference images",
    ],
  },
  {
    n: "02",
    title: "Upload Evidence",
    body: "Authorized users attach material to the case record. Each item carries who submitted it, when, and from where.",
    items: [
      "Photographs supplied by family or partners",
      "Video frames released through authorized channels",
      "Documents, statements and reports",
      "Location records and sighting coordinates",
      "Investigator and volunteer notes",
    ],
  },
  {
    n: "03",
    title: "Visual Search",
    body: "VisionTrack processes submitted visual evidence and produces ranked potential matches within the case's authorized evidence set.",
    items: [
      "Potential Match — a candidate, not a person",
      "Visual Similarity — a measured comparison score",
      "Confidence Score — how strong the comparison is",
      "Requires Human Review — the only valid next step",
    ],
  },
  {
    n: "04",
    title: "Review & Coordinate",
    body: "Reviewers compare candidates side by side against the reference image, record a decision, and coordinate field follow-up.",
    items: [
      "Side-by-side and overlay comparison",
      "Save as lead, dismiss, or escalate for a second reviewer",
      "Assign field verification to a team member",
      "Every decision written to the case timeline and audit log",
    ],
  },
];

function HowItWorks() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="How it works"
        title="A disciplined path from a report to a reviewed lead."
        intro="VisionTrack does not try to shortcut investigation. It removes the coordination overhead around it so that people spend their time on judgement, not on chasing files."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <ol className="space-y-px border border-border bg-border">
          {steps.map((s) => (
            <li key={s.n} className="grid gap-6 bg-card p-7 md:grid-cols-[80px_1fr_1fr] md:p-10">
              <span className="font-mono text-2xl text-primary">{s.n}</span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
              <ul className="space-y-2 text-sm">
                {s.items.map((i) => (
                  <li key={i} className="flex gap-2.5 border-b border-border pb-2 text-muted-foreground last:border-0">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-10 border-l-2 border-critical bg-critical/5 p-6">
          <h2 className="text-sm font-semibold">What VisionTrack never does</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            VisionTrack does not confirm identity, does not act autonomously on a match, and does not run searches
            against people who are not the subject of an authorized case. A similarity score is an indicator that a
            human should look — it is never a conclusion.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/app/cases/new">Start a Case</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/technology">How the technology is built</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
