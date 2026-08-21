import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

const title = "Privacy & Safety — VisionTrack";
const description =
  "How VisionTrack handles case data, evidence access, retention, audit logging, and the boundaries that keep the platform limited to authorized missing-person work.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    h: "Scope of the platform",
    p: [
      "VisionTrack processes material that authorized organizations attach to a registered missing-person case. It is not a general identification service, a public lookup tool, or a monitoring system.",
      "The platform must not be used for surveillance, tracking of individuals who are not the subject of an authorized case, workplace monitoring, or the identification of members of the public.",
    ],
  },
  {
    h: "What is collected",
    p: [
      "Case records: identity details, descriptors, last known location and circumstances of the disappearance, supplied by the reporting organization or family contact.",
      "Evidence: images, video frames, documents, location records and notes uploaded by authorized users, together with the identity of the uploader and the time of upload.",
      "Account data: name, work email, organization, assigned role and session activity.",
      "Activity data: searches run, results reviewed, decisions recorded, exports generated and administrative changes.",
    ],
  },
  {
    h: "Access control",
    p: [
      "Access is role-based and scoped to the organization. Case material is visible only to users assigned to that case, and administrative functions are separated from case work.",
      "Evidence files are stored privately. Links are not publicly addressable and access is checked on every request rather than assumed from possession of a URL.",
    ],
  },
  {
    h: "Visual comparison and human review",
    p: [
      "Similarity scores are algorithmic indicators, not identity confirmation. The platform does not assert that two images show the same person.",
      "A potential match cannot change case status, trigger contact with a family, or initiate field activity on its own. An authorized reviewer must record a decision first, and that decision is attributed and logged.",
    ],
  },
  {
    h: "Audit logging",
    p: [
      "Case creation, evidence upload and modification, search execution, review decisions, exports, role changes and account suspensions are recorded with the acting user, timestamp and relevant object.",
      "Audit records are readable by administrators and are retained independently of the case record so that a closed case can still be reconstructed.",
    ],
  },
  {
    h: "Retention and deletion",
    p: [
      "Case material is retained while the case is active and for the retention period agreed with the operating organization. Archived cases retain their audit trail.",
      "Family contacts may request correction or removal of material they supplied through the organization handling the case.",
    ],
  },
  {
    h: "Security practices",
    p: [
      "Authentication, session management, authorization checks on every protected route, validated input, restricted file types, private storage and rate limiting on sensitive operations.",
      "Sensitive case content is never written to client-side logs or exposed through public pages.",
    ],
  },
  {
    h: "Limits of the service",
    p: [
      "VisionTrack is a support tool. It does not replace law enforcement, investigators, emergency services, or human judgement, and it cannot dispatch assistance.",
      "Report a disappearance to your local emergency or law-enforcement channel first. Use of VisionTrack is in addition to that process, never instead of it.",
    ],
  },
];

function Privacy() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Privacy & Safety"
        title="The boundaries this platform operates inside."
        intro="This page describes how VisionTrack handles sensitive material and the limits that are enforced in the product itself, not only in policy."
      />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <article key={s.h}>
              <h2 className="text-xl font-semibold tracking-tight">
                <span className="mr-3 font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                {s.h}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {s.p.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
