import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag, PriorityBadge, StatusBadge } from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  caseEvidence,
  caseMatches,
  caseTimeline,
  cases,
  formatDate,
  formatDateTime,
  getCase,
} from "@/lib/demo-data";

export const Route = createFileRoute("/app/reports")({
  validateSearch: z.object({ case: z.string().optional() }),
  component: Reports,
});

const SECTIONS = [
  { id: "summary", label: "Case summary" },
  { id: "timeline", label: "Timeline of events" },
  { id: "evidence", label: "Evidence inventory" },
  { id: "matches", label: "Reviewed potential matches" },
  { id: "activity", label: "Team activity" },
] as const;

function Reports() {
  const search = Route.useSearch();
  const [caseId, setCaseId] = useState(search.case ?? cases[0]!.id);
  const [range, setRange] = useState("all");
  const [enabled, setEnabled] = useState<string[]>(SECTIONS.map((s) => s.id));

  const record = getCase(caseId)!;
  const ev = caseEvidence(caseId);
  const ms = caseMatches(caseId);
  const tl = caseTimeline(caseId);
  const on = (id: string) => enabled.includes(id);

  return (
    <PageShell
      title="Reports"
      description="Assemble a printable case report from recorded activity. Nothing here is a conclusion — every item is evidence for a human reviewer."
      actions={
        <>
          <DemoTag />
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={() => toast.success("Report exported", { description: `${record.id} report prepared as PDF (demo).` })}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel h-fit p-4 print:hidden">
          <h2 className="text-sm font-semibold">Report options</h2>
          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rep-case">Case</Label>
              <Select value={caseId} onValueChange={setCaseId}>
                <SelectTrigger id="rep-case"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cases.map((c) => <SelectItem key={c.id} value={c.id}>{c.id} — {c.person.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rep-range">Date range</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger id="rep-range"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">Full case history</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <fieldset className="space-y-2 border-t border-border pt-3">
              <legend className="eyebrow text-muted-foreground">Sections</legend>
              {SECTIONS.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`sec-${s.id}`}
                    checked={on(s.id)}
                    onCheckedChange={(v) =>
                      setEnabled((prev) => (v ? [...new Set([...prev, s.id])] : prev.filter((x) => x !== s.id)))
                    }
                  />
                  <Label htmlFor={`sec-${s.id}`} className="text-sm font-normal">{s.label}</Label>
                </div>
              ))}
            </fieldset>
          </div>
        </aside>

        <article className="panel p-8">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="eyebrow text-muted-foreground">VisionTrack case report</p>
              <h2 className="mt-1 text-2xl font-semibold">{record.person.fullName}</h2>
              <p className="font-mono text-xs text-muted-foreground">
                {record.id} · generated {formatDateTime(new Date().toISOString())} · range: {range}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status={record.status} />
              <PriorityBadge priority={record.priority} />
            </div>
          </header>

          {on("summary") ? (
            <section className="mt-6">
              <h3 className="text-sm font-semibold">Case summary</h3>
              <dl className="mt-3 grid gap-px border border-border bg-border text-sm sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Age", `${record.person.age}`],
                  ["Height", record.person.height],
                  ["Hair", record.person.hair],
                  ["Last seen", formatDate(record.lastSeenAt)],
                  ["Location", record.lastSeenLocation],
                  ["Assigned team", record.assignedTeam],
                  ["Case opened", formatDate(record.createdAt)],
                  ["Evidence items", `${ev.length}`],
                  ["Reviewed candidates", `${ms.length}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card px-3 py-2">
                    <dt className="eyebrow text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{record.circumstances}</p>
            </section>
          ) : null}

          {on("timeline") ? (
            <section className="mt-8">
              <h3 className="text-sm font-semibold">Timeline of events</h3>
              <ol className="mt-3 space-y-3 border-l border-border pl-4">
                {tl.map((t) => (
                  <li key={t.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    <p className="font-medium">{t.action}</p>
                    <p className="text-muted-foreground">{t.detail}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{t.date} {t.time} · {t.user}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {on("evidence") ? (
            <section className="mt-8">
              <h3 className="text-sm font-semibold">Evidence inventory</h3>
              <table className="mt-3 w-full text-sm">
                <thead className="border-b border-border text-left text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="py-2 font-medium">ID</th>
                    <th scope="col" className="py-2 font-medium">Type</th>
                    <th scope="col" className="py-2 font-medium">Title</th>
                    <th scope="col" className="py-2 font-medium">Uploaded by</th>
                    <th scope="col" className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ev.map((e) => (
                    <tr key={e.id} className="border-b border-border/60">
                      <td className="py-2 font-mono text-xs">{e.id}</td>
                      <td className="py-2">{e.type}</td>
                      <td className="py-2">{e.title}</td>
                      <td className="py-2 text-muted-foreground">{e.uploadedBy}</td>
                      <td className="py-2 text-xs">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {on("matches") ? (
            <section className="mt-8">
              <h3 className="text-sm font-semibold">Reviewed potential matches</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Similarity scores indicate visual likeness only. They are not identifications.
              </p>
              <ul className="mt-3 space-y-2">
                {ms.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border/60 pb-2 text-sm">
                    <span className="font-mono text-xs">{m.id}</span>
                    <span className="tabular-nums font-medium">{m.similarity}% similarity</span>
                    <span className="text-muted-foreground">{m.location}</span>
                    <span className="text-xs text-muted-foreground">{m.timestamp}</span>
                    <span className="ml-auto text-xs">{m.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {on("activity") ? (
            <section className="mt-8">
              <h3 className="text-sm font-semibold">Team activity</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Assigned team: {record.assignedTeam}. All actions in this report are attributed to named accounts and
                recorded in the immutable audit log.
              </p>
            </section>
          ) : null}

          <footer className="mt-8 border-t border-border pt-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileBarChart className="h-3.5 w-3.5" aria-hidden="true" />
              VisionTrack supports human decision-making. It does not determine identity or make conclusions about any
              individual. All data shown is fictional sample data.
            </p>
          </footer>
        </article>
      </div>
    </PageShell>
  );
}
