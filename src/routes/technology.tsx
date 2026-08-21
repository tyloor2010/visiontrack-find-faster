import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const title = "VisionTrack Technology — Visual Search Architecture";
const description =
  "How VisionTrack structures case data, processes authorized visual evidence, ranks potential matches, and keeps human review at the centre of every decision.";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Technology,
});

const layers = [
  {
    name: "Case data model",
    detail:
      "A relational record set — cases, missing persons, evidence, locations, search jobs, results, review decisions, timeline events and audit entries — with explicit relationships rather than one opaque document per case.",
  },
  {
    name: "Evidence pipeline",
    detail:
      "Uploads are attributed, typed and versioned on intake. Video contributions are handled as extracted frames so that every comparison operates on a still image with a known source and timestamp.",
  },
  {
    name: "Visual comparison service",
    detail:
      "The interface talks to a single service abstraction (createSearchJob, uploadEvidence, processImage, getSearchResults, reviewResult). In this environment it returns clearly labelled simulated output; in production it is replaced by a computer-vision inference backend without any UI change.",
  },
  {
    name: "Ranking and thresholds",
    detail:
      "Candidates below the operator-set similarity threshold are never surfaced. Above it, results are ordered by score and annotated with source, location, timestamp and distance from the last known position.",
  },
  {
    name: "Review layer",
    detail:
      "No result changes case state on its own. A reviewer must record a decision, and that decision is attributed, timestamped and written to the audit log.",
  },
];

function Technology() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Technology"
        title="Built to be replaced, extended, and audited."
        intro="VisionTrack is an application layer around a visual comparison service. The boundary between them is deliberately clean, so the underlying model can be evaluated, swapped, or run on an organization's own infrastructure."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
          {layers.map((l, i) => (
            <article key={l.name} className="bg-card p-7">
              <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 text-lg font-semibold">{l.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.detail}</p>
            </article>
          ))}
          <article className="bg-surface p-7">
            <span className="font-mono text-xs text-primary">API</span>
            <h2 className="mt-3 text-lg font-semibold">visualSearchService</h2>
            <pre className="mt-3 overflow-x-auto border border-border bg-card p-4 font-mono text-[12px] leading-relaxed text-muted-foreground">
              {`createSearchJob(input): SearchJob
uploadEvidence(file): UploadedEvidence
processImage(job, onStage, onDone)
getSearchResults(job): SearchResultSet
reviewResult(id, decision, reviewer)`}
            </pre>
          </article>
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-12 lg:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">On accuracy claims</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We publish no accuracy figures here, because a similarity score has no meaning without the dataset,
              lighting conditions, capture quality and demographic distribution it was measured against. Any deployment
              should be evaluated against the organization's own authorized material before operational use.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">On failure modes</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Low-resolution frames, partial occlusion, extreme angles and age gaps all degrade comparison quality.
              VisionTrack surfaces the source and quality context beside every score so reviewers can weigh it, rather
              than presenting a number in isolation.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">On data handling</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Evidence is private to its case and organization, access is role-scoped, and every read or write of
              sensitive material is logged. Case data is never exposed on the public site.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/for-organizations">Deploying in an organization</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/privacy">Privacy & Safety</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
