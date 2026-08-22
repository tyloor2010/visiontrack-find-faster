import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderPlus, ScanSearch } from "lucide-react";
import { PageShell } from "@/components/app/AppShell";
import { PersonThumb } from "@/components/common/PersonThumb";
import { DemoTag, Metric, PriorityBadge, StatusBadge } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  alerts,
  cases,
  DEMO_NOTICE,
  evidence,
  formatDate,
  matches,
  relativeFrom,
  searchActivity,
  timeline,
} from "@/lib/demo-data";

export const Route = createFileRoute("/app/")({
  component: Overview,
});

function Overview() {
  const { user } = useAuth();
  const openCases = cases.filter((c) => c.status !== "Resolved" && c.status !== "Archived");
  const pending = matches.filter((m) => m.status === "Awaiting Review");
  const recent = [...cases].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  const maxSearches = Math.max(...searchActivity.map((d) => d.searches));

  return (
    <PageShell
      title={`Overview`}
      description={`Signed in as ${user?.name} · ${user?.role} · ${user?.organization}`}
      actions={
        <>
          <DemoTag />
          <Button asChild variant="outline">
            <Link to="/app/search">
              <ScanSearch className="mr-2 h-4 w-4" /> Visual Search
            </Link>
          </Button>
          <Button asChild>
            <Link to="/app/cases/new">
              <FolderPlus className="mr-2 h-4 w-4" /> New Case
            </Link>
          </Button>
        </>
      }
    >
      <p className="mb-6 border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        {DEMO_NOTICE}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Active cases" value={String(openCases.length)} hint="Excludes resolved and archived" />
        <Metric label="Potential matches" value={String(pending.length)} hint="Awaiting authorized human review" trend="queue" />
        <Metric label="Evidence items" value={String(evidence.length)} hint="Across all assigned cases" />
        <Metric label="Search activity" value={String(searchActivity.reduce((a, d) => a + d.searches, 0))} hint="Searches run in the last 7 days" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="panel" aria-labelledby="active-cases">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 id="active-cases" className="text-sm font-semibold">Active cases</h2>
            <Link to="/app/cases" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              All cases <ArrowUpRight className="h-3 w-3" />
            </Link>
          </header>
          {recent.length === 0 ? (
            <EmptyState
              icon={FolderPlus}
              title="No active cases"
              description="Create a case to start collecting evidence and coordinating a search."
              action={<Button asChild><Link to="/app/cases/new">Create a case</Link></Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Active cases assigned to your organization</caption>
                <thead className="bg-surface text-left">
                  <tr className="text-xs text-muted-foreground">
                    <th scope="col" className="px-4 py-2.5 font-medium">Case ID</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Person</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Last seen</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Priority</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((c) => (
                    <tr key={c.id} className="border-t border-border hover:bg-surface">
                      <td className="px-4 py-2.5">
                        <Link to="/app/cases/$caseId" params={{ caseId: c.id }} className="font-mono text-xs text-primary hover:underline">
                          {c.id}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <PersonThumb seed={c.id} className="w-9 shrink-0 rounded-sm" />
                          <div>
                            <span className="font-medium">{c.person.fullName}</span>
                            <span className="block text-xs text-muted-foreground">Age {c.person.age}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {c.lastSeenLocation}
                        <span className="block text-xs">{formatDate(c.lastSeenAt)}</span>
                      </td>
                      <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-2.5"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{relativeFrom(c.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="panel" aria-labelledby="review-queue">
            <header className="border-b border-border px-4 py-3">
              <h2 id="review-queue" className="text-sm font-semibold">Review queue</h2>
            </header>
            {pending.length === 0 ? (
              <EmptyState icon={ScanSearch} title="No potential matches" description="Run a visual search on an active case to generate candidates." />
            ) : (
              <ul className="divide-y divide-border">
                {pending.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">{m.caseId}</span>
                    <span className="flex-1 text-sm">Potential Match #{String(m.rank).padStart(2, "0")}</span>
                    <span className="font-mono text-xs">{m.similarity}%</span>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/app/search" search={{ case: m.caseId }}>Review</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel" aria-labelledby="activity-chart">
            <header className="border-b border-border px-4 py-3">
              <h2 id="activity-chart" className="text-sm font-semibold">Search activity · 7 days</h2>
            </header>
            <div className="flex h-32 items-end gap-2 px-4 py-4">
              {searchActivity.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full bg-primary/85"
                    style={{ height: `${(d.searches / maxSearches) * 80}px` }}
                    title={`${d.searches} searches`}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" aria-labelledby="recent-activity">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 id="recent-activity" className="text-sm font-semibold">Recent activity</h2>
              <Link to="/app/alerts" className="text-xs text-primary hover:underline">Alerts</Link>
            </header>
            <ul className="divide-y divide-border">
              {timeline.slice(-5).reverse().map((t) => (
                <li key={t.id} className="px-4 py-2.5 text-sm">
                  <p className="font-medium">{t.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.date} {t.time} · {t.user} · {t.caseId}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel" aria-labelledby="unread-alerts">
            <header className="border-b border-border px-4 py-3">
              <h2 id="unread-alerts" className="text-sm font-semibold">
                Unread alerts ({alerts.filter((a) => !a.read).length})
              </h2>
            </header>
            <ul className="divide-y divide-border">
              {alerts.filter((a) => !a.read).map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
