import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const title = "About VisionTrack";
const description =
  "VisionTrack is a visual search and case-coordination platform for authorized missing-person work, built around human review and traceable decisions.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="We build the boring infrastructure that search work actually needs."
        intro="VisionTrack started from a simple observation: the hardest part of a missing-person search is rarely the technology. It is that the information exists, but nobody can see all of it at once."
      />

      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            Search coordinators work with photographs forwarded through group chats, descriptions typed from memory,
            volunteer sightings that never reach the investigator, and evidence that exists in three places with three
            different filenames. The work of keeping that straight consumes the hours that matter most.
          </p>
          <p>
            VisionTrack is our attempt to fix that specific problem. It is a case workspace first: a structured record,
            an evidence trail, a map, a timeline, and a set of roles that decide who can do what. Visual search sits on
            top of that foundation — useful only because the underlying record is clean.
          </p>
          <h2 className="pt-4 text-2xl font-semibold tracking-tight text-foreground">What we believe</h2>
          <ul className="space-y-4">
            {[
              ["Human review is not a formality.", "The product is designed so that no algorithmic output can advance a case on its own. If that makes the workflow slower in places, that is the correct trade."],
              ["Scope is a safety feature.", "A tool that can compare faces across an entire city is a different product with different risks. VisionTrack operates inside a case, on authorized evidence, under an audit log."],
              ["Uncertainty should be visible.", "Scores are shown with their source, quality and context. We would rather a reviewer distrust a number than act on it blindly."],
              ["Records outlive incidents.", "Cases get handed over, reopened and reviewed months later. Everything in VisionTrack is written so that the next person can reconstruct what happened and why."],
            ].map(([t, b]) => (
              <li key={t} className="border-l-2 border-primary pl-5">
                <p className="font-medium text-foreground">{t}</p>
                <p className="mt-1.5">{b}</p>
              </li>
            ))}
          </ul>
          <h2 className="pt-4 text-2xl font-semibold tracking-tight text-foreground">Current status</h2>
          <p>
            The platform is at working-product stage. The workspace, case management, evidence handling, review flow,
            reporting and administration are implemented and populated with clearly labelled sample data. The visual
            comparison layer runs behind a service boundary and currently returns simulated results, so an organization
            can evaluate the workflow before connecting an inference backend.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/contact">Get in touch</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app">Open the workspace</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
