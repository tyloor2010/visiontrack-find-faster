import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

const title = "Terms of Use — VisionTrack";
const description =
  "Terms governing authorized use of the VisionTrack case-coordination and visual search platform, including permitted use, responsibilities and limitations.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Terms,
});

const clauses = [
  ["Eligibility", "Access is granted to verified organizations and to individuals nominated by them. Accounts are personal and must not be shared."],
  ["Permitted use", "The platform may be used only to coordinate and review authorized missing-person cases. Any use for surveillance, profiling, or identification outside an authorized case is prohibited and will result in immediate termination of access."],
  ["Lawful basis", "The uploading organization is responsible for holding a lawful basis for the material it submits and for any onward disclosure it makes."],
  ["Accuracy of output", "Visual comparison output is probabilistic. VisionTrack makes no representation that a potential match identifies a specific person, and no decision affecting an individual may be taken on that output alone."],
  ["Human review obligation", "Organizations must ensure that trained personnel review all potential matches before any operational action is taken."],
  ["Confidentiality", "Case material accessed through the platform is confidential. Users must not export, share, or publish it outside the authorized process."],
  ["Audit and monitoring", "Use of the platform is logged. Administrators and the operating organization may review activity records for compliance purposes."],
  ["Service limitations", "The platform is not an emergency service and provides no guarantee of availability, outcome, or discovery. It does not replace law enforcement or investigative process."],
  ["Suspension", "Access may be suspended without notice where misuse, a security risk, or a breach of these terms is suspected."],
  ["Changes", "These terms may be updated as the platform develops. Material changes are communicated to organization administrators."],
];

function Terms() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Terms"
        title="Terms of use."
        intro="Summary terms for authorized use of VisionTrack. A full agreement is executed with each operating organization before workspace provisioning."
      />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <ol className="space-y-8">
          {clauses.map(([h, b], i) => (
            <li key={h}>
              <h2 className="text-lg font-semibold tracking-tight">
                <span className="mr-3 font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                {h}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
