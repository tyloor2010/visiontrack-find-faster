import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const title = "For Organizations — VisionTrack Deployment";
const description =
  "Role-based access, audit logging, evidence governance and search coordination for NGOs, search-and-rescue teams and authorized public-safety organizations.";

export const Route = createFileRoute("/for-organizations")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ForOrganizations,
});

const roles = [
  ["Administrator", "Manages organization settings, users, roles and the admin console. Sees system-wide activity."],
  ["Investigator", "Owns cases: intake, evidence, running searches and acting on reviewed leads."],
  ["Reviewer", "Works the potential-match queue. Compares candidates and records review decisions."],
  ["Coordinator", "Assigns people to cases, manages team workload and search-area coverage."],
  ["Viewer", "Read-only access to assigned cases. Cannot upload, search, or decide."],
];

function ForOrganizations() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="For organizations"
        title="Coordination infrastructure for authorized search teams."
        intro="VisionTrack is designed for organizations that already carry responsibility for missing-person work: search-and-rescue units, NGOs operating under formal agreements, and public-safety teams that need traceability as much as speed."
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {[
            ["Governance", "Every action is attributable. Uploads, searches, review decisions, role grants and exports are written to an immutable audit log."],
            ["Access control", "Five roles with distinct permissions, scoped per organization and per case assignment. Unassigned staff cannot browse case material."],
            ["Operational fit", "Desktop workspace for case work, responsive layouts for the field, printable case reports for internal documentation and handover."],
          ].map(([t, b]) => (
            <article key={t} className="bg-card p-7">
              <h2 className="text-lg font-semibold">{t}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">Role model</h2>
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">VisionTrack organization roles and their responsibilities</caption>
            <thead className="bg-surface-strong">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium">Role</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(([r, d]) => (
                <tr key={r} className="border-t border-border bg-card">
                  <th scope="row" className="w-52 px-4 py-3 text-left font-medium">{r}</th>
                  <td className="px-4 py-3 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">Conditions of use</h2>
        <ul className="mt-5 grid gap-px border border-border bg-border md:grid-cols-2">
          {[
            "Searches run only against evidence attached to a registered missing-person case.",
            "Organizations must have a lawful basis for holding and processing the material they upload.",
            "No use for surveillance, monitoring, or identification of people outside an authorized case.",
            "Review decisions must be made by trained staff, not automated rules.",
          ].map((c) => (
            <li key={c} className="bg-card p-5 text-sm text-muted-foreground">
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/contact">Request organization access</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/technology">Technical overview</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
