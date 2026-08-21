import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const title = "For Families — VisionTrack";
const description =
  "What families can expect from VisionTrack: a clear case record, a place for the photographs and details you already have, and honest limits about what the platform can and cannot do.";

export const Route = createFileRoute("/for-families")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ForFamilies,
});

function ForFamilies() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="For families"
        title="Your information, kept in one place — and kept private."
        intro="If someone you love is missing, you are being asked for the same details by many different people. VisionTrack gives the authorized team working your case one organized record, so nothing you provide gets lost or repeated."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="border-l-2 border-critical bg-critical/5 p-6">
          <h2 className="font-semibold">Contact emergency services first</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            VisionTrack is a coordination tool used by authorized organizations. It does not replace police, emergency
            services, or an official missing-person report. Always report a disappearance through your local emergency
            or law-enforcement channel first.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">What we ask you for</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Recent, clear photographs — ideally showing the face directly and from the side.",
                "What they were wearing, including shoes and bags.",
                "The exact place and time they were last seen, as precisely as you can recall.",
                "Physical details: height, hair, glasses, scars, tattoos.",
                "Anything about routine — routes taken, places they feel safe, people they contact.",
                "A single family contact who the team can reach at any hour.",
              ].map((i) => (
                <li key={i} className="border-b border-border pb-3">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">What happens with it</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Everything you provide is attached to one case record with your name recorded as the source.",
                "Only the authorized team assigned to the case can see it. It is never published.",
                "Photographs are used for comparison inside that case only — never for general searching of other people.",
                "When the platform surfaces a possible visual similarity, a trained reviewer checks it before anyone contacts you.",
                "You are told what stage the case is at, not given raw algorithmic scores out of context.",
              ].map((i) => (
                <li key={i} className="border-b border-border pb-3">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border border-border bg-card p-8">
          <h2 className="text-xl font-semibold tracking-tight">Being honest about limits</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            A high similarity score is not a person. It means two images look alike enough that someone should check.
            Many candidates turn out to be unrelated. We show this language everywhere in the product on purpose,
            because false certainty in a missing-person search is harmful — it sends teams to the wrong place and it
            raises hopes that then fall.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/contact">Talk to the team</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/how-it-works">See how a case is handled</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
