import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Boxes,
  FileBarChart,
  MessageSquare,
  ScanSearch,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { MapCanvas, MapLegend } from "@/components/common/MapCanvas";
import { PersonThumb } from "@/components/common/PersonThumb";
import { DemoTag, PriorityBadge, StatusBadge } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  caseEvidence,
  caseMatches,
  caseTimeline,
  formatDate,
  formatDateTime,
  getCase,
  team,
} from "@/lib/demo-data";
import { SIMILARITY_DISCLAIMER } from "@/lib/visual-search-service";

export const Route = createFileRoute("/app/cases/$caseId")({
  loader: ({ params }) => {
    const record = getCase(params.caseId);
    if (!record) throw notFound();
    return { caseId: params.caseId };
  },
  head: ({ params }) => ({
    meta: [{ title: `Case ${params.caseId} — VisionTrack` }, { name: "robots", content: "noindex" }],
  }),
  component: CaseDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="eyebrow text-critical">Case not found</p>
      <h1 className="mt-3 text-xl font-semibold">No case with that reference</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The case may have been archived, or your role may not include access to it.
      </p>
      <Button asChild className="mt-6"><Link to="/app/cases">Back to cases</Link></Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="text-xl font-semibold">Could not load this case</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-3">
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value || "—"}</dd>
    </div>
  );
}

function CaseDetail() {
  const { caseId } = Route.useLoaderData();
  const record = getCase(caseId)!;
  const ev = caseEvidence(caseId);
  const tl = caseTimeline(caseId);
  const ms = caseMatches(caseId);
  const [notes, setNotes] = useState<{ id: string; user: string; text: string; at: string }[]>([
    { id: "N1", user: "Dalia Moussa", text: record.notes, at: formatDateTime(record.updatedAt) },
  ]);
  const [draft, setDraft] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <PageShell
      title={record.person.fullName}
      description={`${record.id} · ${record.assignedTeam} · created ${formatDate(record.createdAt)}`}
      actions={
        <>
          <DemoTag />
          <Dialog open={assistantOpen} onOpenChange={setAssistantOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Sparkles className="mr-2 h-4 w-4" /> Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>VisionTrack Assistant</DialogTitle>
                <DialogDescription>
                  Summarizes what is already in this case record. The assistant does not make identification
                  judgements, does not access material outside this case, and never replaces reviewer decisions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="border border-border bg-surface p-3">
                  <p className="eyebrow text-muted-foreground">Case summary</p>
                  <p className="mt-2 leading-relaxed">
                    {record.person.fullName}, age {record.person.age}, last seen {formatDateTime(record.lastSeenAt)} at{" "}
                    {record.lastSeenLocation}. Status {record.status.toLowerCase()}, priority{" "}
                    {record.priority.toLowerCase()}. {ev.length} evidence items and {ms.length} potential matches are
                    attached; {ms.filter((m) => m.status === "Awaiting Review").length} still require human review.
                  </p>
                </div>
                <div className="border border-border bg-surface p-3">
                  <p className="eyebrow text-muted-foreground">Missing from this case</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                    {!record.person.height ? <li>Height is not recorded.</li> : null}
                    {ev.filter((e) => e.type === "Location").length === 0 ? <li>No location evidence attached.</li> : null}
                    {record.referenceImages < 3 ? <li>Fewer than three reference images — comparison quality may be limited.</li> : null}
                    <li>No second reviewer assigned to the current match queue.</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAssistantOpen(false)}>Close</Button>
                <Button asChild><Link to="/app/reports" search={{ case: record.id }}>Generate report</Link></Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link to="/app/search" search={{ case: record.id }}>
              <ScanSearch className="mr-2 h-4 w-4" /> Run Visual Search
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        <div className="panel flex items-center gap-3 p-4">
          <PersonThumb seed={record.id} className="w-16" ratio="portrait" label="Reference" />
          <div>
            <p className="eyebrow text-muted-foreground">Case</p>
            <p className="font-mono text-sm">{record.id}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusBadge status={record.status} />
              <PriorityBadge priority={record.priority} />
            </div>
          </div>
        </div>
        <div className="panel p-4">
          <p className="eyebrow text-muted-foreground">Last seen</p>
          <p className="mt-2 text-sm font-medium">{record.lastSeenLocation}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(record.lastSeenAt)}</p>
        </div>
        <div className="panel p-4">
          <p className="eyebrow text-muted-foreground">Assigned team</p>
          <p className="mt-2 text-sm font-medium">{record.assignedTeam}</p>
          <p className="text-xs text-muted-foreground">{record.assignees.join(", ")}</p>
        </div>
        <div className="panel p-4">
          <p className="eyebrow text-muted-foreground">Last updated</p>
          <p className="mt-2 text-sm font-medium">{formatDateTime(record.updatedAt)}</p>
          <p className="text-xs text-muted-foreground">{ev.length} evidence · {ms.length} matches</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex w-full flex-wrap justify-start">
          {["overview", "person", "evidence", "search", "map", "timeline", "notes", "team"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t === "search" ? "Visual Search" : t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Circumstances</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{record.circumstances}</p>
            <h2 className="mt-5 text-sm font-semibold">Emergency contact</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {record.emergencyContact.name} ({record.emergencyContact.relation}) · {record.emergencyContact.phone}
            </p>
          </section>
          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Latest activity</h2>
            <ul className="mt-3 space-y-3">
              {tl.slice(-4).reverse().map((t) => (
                <li key={t.id} className="border-l-2 border-primary pl-3 text-sm">
                  <p className="font-medium">{t.action}</p>
                  <p className="text-xs text-muted-foreground">{t.date} {t.time} · {t.user}</p>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="person" className="mt-4">
          <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Full name" value={record.person.fullName} />
            <Field label="Age" value={String(record.person.age)} />
            <Field label="Gender" value={record.person.gender} />
            <Field label="Height" value={record.person.height} />
            <Field label="Hair" value={record.person.hair} />
            <Field label="Clothing when last seen" value={record.person.clothing} />
            <Field label="Distinguishing features" value={record.person.distinguishingFeatures} />
            <Field label="Accessories" value={record.person.accessories} />
            <Field label="Reference images" value={`${record.referenceImages} attached`} />
          </dl>
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          {ev.length === 0 ? (
            <EmptyState icon={Boxes} title="No evidence uploaded" description="Attach photos, video frames, documents or location records to this case." action={<Button asChild><Link to="/app/evidence">Open Evidence Center</Link></Button>} />
          ) : (
            <div className="panel overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Evidence attached to {record.id}</caption>
                <thead className="bg-surface text-left text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">Evidence ID</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Title</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Uploaded by</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ev.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="px-4 py-2.5 font-mono text-xs">{e.id}</td>
                      <td className="px-4 py-2.5">{e.type}</td>
                      <td className="px-4 py-2.5">{e.title}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{e.uploadedBy}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDate(e.uploadedAt)}</td>
                      <td className="px-4 py-2.5 text-xs">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="mt-4">
          {ms.length === 0 ? (
            <EmptyState icon={ScanSearch} title="No potential matches" description="Run a visual search against this case's authorized evidence to generate candidates." action={<Button asChild><Link to="/app/search" search={{ case: record.id }}>Open Visual Search</Link></Button>} />
          ) : (
            <>
              <p className="mb-4 border-l-2 border-critical bg-critical/5 px-4 py-3 text-sm text-muted-foreground">
                {SIMILARITY_DISCLAIMER}
              </p>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ms.map((m) => (
                  <li key={m.id} className="panel p-4">
                    <div className="flex gap-3">
                      <PersonThumb seed={m.caseId} variant="capture" className="w-20" label={`#${String(m.rank).padStart(2, "0")}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Potential Match #{String(m.rank).padStart(2, "0")}</p>
                        <p className="font-mono text-xs text-muted-foreground">Similarity {m.similarity}%</p>
                        <div className="mt-2 h-1.5 w-full bg-surface-strong">
                          <div className="h-full bg-primary" style={{ width: `${m.similarity}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{m.location} · {m.timestamp}</p>
                        <p className="text-xs text-muted-foreground">{m.source} · {m.distanceKm} km</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs">{m.status}</span>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/app/search" search={{ case: record.id }}>Review</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <div className="panel p-4">
            <MapCanvas
              className="h-[420px] w-full"
              radius={{ x: record.coordinates.x, y: record.coordinates.y, km: record.searchRadiusKm }}
              pins={[
                { id: "ls", x: record.coordinates.x, y: record.coordinates.y, kind: "last-seen", label: "Last known location", sublabel: record.lastSeenLocation },
                ...ms.map((m) => ({ id: m.id, x: m.coordinates.x, y: m.coordinates.y, kind: "match" as const, label: `Potential match ${m.similarity}%`, sublabel: m.location })),
                ...ev.filter((e) => e.type === "Image").map((e, i) => ({ id: e.id, x: record.coordinates.x + 8 + i * 6, y: record.coordinates.y + 12, kind: "evidence" as const, label: e.id, sublabel: e.location })),
              ]}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <MapLegend />
              <Button asChild variant="outline" size="sm"><Link to="/app/map" search={{ case: record.id }}>Open full map</Link></Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <ol className="panel divide-y divide-border">
            {tl.map((t) => (
              <li key={t.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[130px_1fr]">
                <p className="font-mono text-xs text-muted-foreground">{t.date} {t.time}</p>
                <div>
                  <p className="text-sm font-medium">{t.action}</p>
                  <p className="text-sm text-muted-foreground">{t.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">by {t.user}</p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
          <ul className="panel divide-y divide-border">
            {notes.map((n) => (
              <li key={n.id} className="px-5 py-4">
                <p className="text-sm">{n.text}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{n.user} · {n.at}</p>
              </li>
            ))}
            {notes.length === 0 ? (
              <li>
                <EmptyState icon={MessageSquare} title="No notes yet" description="Add context that other team members should see when they open this case." />
              </li>
            ) : null}
          </ul>
          <div className="panel p-4">
            <h2 className="text-sm font-semibold">Add a note</h2>
            <Textarea
              className="mt-3"
              rows={5}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Case note"
              placeholder="Observation, coordination update, or follow-up needed…"
            />
            <Button
              className="mt-3 w-full"
              disabled={draft.trim().length < 3}
              onClick={() => {
                setNotes((prev) => [
                  ...prev,
                  { id: `N${prev.length + 1}`, user: "You", text: draft.trim(), at: "just now" },
                ]);
                setDraft("");
                toast.success("Note added to case", { description: "Recorded in the case timeline and audit log." });
              }}
            >
              Save note
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Team members assigned to {record.id}</caption>
              <thead className="bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Name</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Role</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {team.filter((t) => record.assignees.includes(t.name)).map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-2.5 font-medium">{t.name}</td>
                    <td className="px-4 py-2.5">{t.role}</td>
                    <td className="px-4 py-2.5">{t.status}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{t.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline"><Link to="/app/team"><Users className="mr-2 h-4 w-4" /> Manage team</Link></Button>
            <Button asChild variant="outline"><Link to="/app/reports" search={{ case: record.id }}><FileBarChart className="mr-2 h-4 w-4" /> Case report</Link></Button>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
