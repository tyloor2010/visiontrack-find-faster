import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, ScanSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/app/AppShell";
import { PersonThumb } from "@/components/common/PersonThumb";
import { DemoTag } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cases, getCase, type PotentialMatch } from "@/lib/demo-data";
import {
  SIMILARITY_DISCLAIMER,
  STAGE_LABELS,
  visualSearchService,
  type SearchStage,
} from "@/lib/visual-search-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/search")({
  validateSearch: z.object({ case: z.string().optional() }),
  component: VisualSearch,
});

const STAGES: SearchStage[] = ["preparing", "analyzing", "comparing", "ranking", "complete"];

function VisualSearch() {
  const params = Route.useSearch();
  const [caseId, setCaseId] = useState(params.case ?? cases[0]!.id);
  const [area, setArea] = useState("4");
  const [dateRange, setDateRange] = useState("14d");
  const [source, setSource] = useState("authorized");
  const [threshold, setThreshold] = useState(50);
  const [stage, setStage] = useState<SearchStage | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanned, setScanned] = useState(0);
  const [results, setResults] = useState<PotentialMatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [compare, setCompare] = useState<PotentialMatch | null>(null);
  const [compareMode, setCompareMode] = useState<"side" | "overlay">("side");
  const [zoom, setZoom] = useState(100);
  const cancelRef = useRef<(() => void) | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const record = getCase(caseId)!;

  useEffect(() => () => cancelRef.current?.(), []);

  function run() {
    setError(null);
    setResults(null);
    setProgress(0);
    const job = visualSearchService.createSearchJob({
      caseId,
      ...(uploadName ? { referenceImageName: uploadName } : {}),
      searchAreaKm: Number(area),
      dateRange,
      evidenceSource: source,
      similarityThreshold: threshold,
    });
    setStage("queued");
    cancelRef.current = visualSearchService.processImage(
      job,
      (s, p, n) => {
        setStage(s);
        setProgress(p);
        setScanned(n);
      },
      (set) => {
        setResults(set.results);
        toast.success(`Search complete — ${set.results.length} potential matches`, {
          description: "Simulated output. Each candidate requires human review.",
        });
      },
      (message) => {
        setStage("failed");
        setError(message);
      },
    );
  }

  function decide(m: PotentialMatch, decision: "saved" | "dismissed" | "in-review") {
    const out = visualSearchService.reviewResult(m.id, decision, "You");
    setResults((prev) => prev?.map((r) => (r.id === m.id ? { ...r, status: out.status, reviewer: "You" } : r)) ?? null);
    toast.success(`Result ${out.status.toLowerCase()}`, { description: `${m.id} · recorded in the audit log.` });
  }

  return (
    <PageShell
      title="Visual Search"
      description="Compare a reference image against authorized evidence attached to a case."
      actions={<DemoTag />}
    >
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* LEFT — reference */}
        <section className="panel h-fit p-4" aria-labelledby="reference-heading">
          <h2 id="reference-heading" className="text-sm font-semibold">Reference image</h2>
          <PersonThumb seed={caseId} ratio="portrait" className="mt-3" label={uploadName ? "Uploaded" : "Case reference"} />
          <p className="mt-2 truncate text-xs text-muted-foreground">{uploadName ?? `${record.id} — case reference`}</p>
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => fileInput.current?.click()}>
            <ImagePlus className="mr-2 h-4 w-4" /> Upload image
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload reference image"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (!file.type.startsWith("image/")) {
                toast.error("Invalid file", { description: "Upload a JPG or PNG image." });
                return;
              }
              if (file.size > 15 * 1024 * 1024) {
                toast.error("Image too large", { description: "Maximum size is 15 MB." });
                return;
              }
              setUploadName(visualSearchService.uploadEvidence(file).name);
              toast.success("Reference image attached");
            }}
          />
          <dl className="mt-4 space-y-2 border-t border-border pt-3 text-xs">
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Person</dt><dd>{record.person.fullName}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Age</dt><dd>{record.person.age}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Last seen</dt><dd className="text-right">{record.lastSeenLocation}</dd></div>
          </dl>
        </section>

        {/* CENTER — configuration */}
        <section className="panel h-fit p-4" aria-labelledby="config-heading">
          <h2 id="config-heading" className="text-sm font-semibold">Search configuration</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="case">Case</Label>
              <Select value={caseId} onValueChange={setCaseId}>
                <SelectTrigger id="case"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cases.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.id} — {c.person.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Search area</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger id="area"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["2", "4", "6", "12", "25"].map((k) => (
                    <SelectItem key={k} value={k}>{k} km radius</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="range">Date range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="range"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="14d">Last 14 days</SelectItem>
                  <SelectItem value="all">Since case opened</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Evidence source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="case">Case evidence only</SelectItem>
                  <SelectItem value="authorized">All authorized evidence</SelectItem>
                  <SelectItem value="partner">Partner organization uploads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="threshold">Similarity threshold</Label>
                <span className="font-mono text-xs">{threshold}%</span>
              </div>
              <Slider id="threshold" min={30} max={95} step={1} value={[threshold]} onValueChange={([v]) => setThreshold(v ?? 50)} />
              <p className="text-xs text-muted-foreground">Candidates below this score are not surfaced.</p>
            </div>
            <Button className="w-full" onClick={run} disabled={stage !== null && stage !== "complete" && stage !== "failed"}>
              <ScanSearch className="mr-2 h-4 w-4" />
              {stage && stage !== "complete" && stage !== "failed" ? "Searching…" : "Run Visual Search"}
            </Button>
          </div>

          {stage ? (
            <div className="mt-5 border-t border-border pt-4" aria-live="polite">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{STAGE_LABELS[stage]}</span>
                <span className="font-mono text-muted-foreground">{progress}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-surface-strong">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <ol className="mt-3 space-y-1.5">
                {STAGES.map((s) => {
                  const done = STAGES.indexOf(s) < STAGES.indexOf(stage === "queued" ? "preparing" : stage);
                  const active = s === stage;
                  return (
                    <li key={s} className={cn("flex items-center gap-2 text-xs", done ? "text-muted-foreground" : active ? "font-medium" : "text-muted-foreground/60")}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", done ? "bg-success" : active ? "bg-primary" : "bg-border")} />
                      {STAGE_LABELS[s]}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">{scanned.toLocaleString()} candidates scanned</p>
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 border-l-2 border-critical bg-critical/5 p-3 text-sm">
              <p className="font-medium">Search failed</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={run}>Retry search</Button>
            </div>
          ) : null}
        </section>

        {/* RIGHT — results */}
        <section aria-labelledby="results-heading">
          <div className="panel">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 id="results-heading" className="text-sm font-semibold">Search results</h2>
              <span className="font-mono text-xs text-muted-foreground">{results?.length ?? 0} candidates</span>
            </header>

            {results === null ? (
              <EmptyState
                icon={ScanSearch}
                title="No search run yet"
                description="Configure the search on the left and run it to generate ranked potential matches for review."
              />
            ) : results.length === 0 ? (
              <EmptyState
                icon={ScanSearch}
                title="No potential matches above threshold"
                description="Lower the similarity threshold or widen the evidence source, then run the search again."
              />
            ) : (
              <>
                <p className="border-b border-border bg-critical/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  {SIMILARITY_DISCLAIMER}
                </p>
                <ul className="divide-y divide-border">
                  {results.map((m) => (
                    <li key={m.id} className="p-4">
                      <div className="flex gap-3">
                        <PersonThumb seed={m.caseId} variant="capture" className="w-20 shrink-0" label={`#${String(m.rank).padStart(2, "0")}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">Potential Match #{String(m.rank).padStart(2, "0")}</p>
                            <span className="font-mono text-sm">{m.similarity}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Potential visual match — requires human review</p>
                          <div className="mt-2 h-1.5 w-full bg-surface-strong">
                            <div className="h-full bg-primary" style={{ width: `${m.similarity}%` }} />
                          </div>
                          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                            <div className="flex gap-1.5"><dt>Source:</dt><dd className="text-foreground">{m.source}</dd></div>
                            <div className="flex gap-1.5"><dt>Location:</dt><dd className="text-foreground">{m.location}</dd></div>
                            <div className="flex gap-1.5"><dt>Timestamp:</dt><dd className="text-foreground">{m.timestamp}</dd></div>
                            <div className="flex gap-1.5"><dt>Distance:</dt><dd className="text-foreground">{m.distanceKm} km</dd></div>
                            <div className="flex gap-1.5"><dt>Status:</dt><dd className="text-foreground">{m.status}</dd></div>
                            <div className="flex gap-1.5"><dt>Reviewer:</dt><dd className="text-foreground">{m.reviewer ?? "Unassigned"}</dd></div>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => decide(m, "in-review")}>Review</Button>
                        <Button size="sm" variant="outline" onClick={() => { setCompare(m); setZoom(100); }}>Compare</Button>
                        <Button size="sm" onClick={() => decide(m, "saved")}>Save Lead</Button>
                        <Button size="sm" variant="ghost" onClick={() => decide(m, "dismissed")}>Dismiss</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>

      <Dialog open={!!compare} onOpenChange={(o) => !o && setCompare(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image comparison — {compare?.id}</DialogTitle>
            <DialogDescription>
              Reference image beside the potential match. Comparison assists a reviewer; it does not confirm identity.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-2 border-y border-border py-2">
            <Button size="sm" variant={compareMode === "side" ? "default" : "outline"} onClick={() => setCompareMode("side")}>Side-by-side</Button>
            <Button size="sm" variant={compareMode === "overlay" ? "default" : "outline"} onClick={() => setCompareMode("overlay")}>Overlay</Button>
            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="zoom" className="text-xs">Zoom</Label>
              <Slider id="zoom" className="w-32" min={100} max={220} step={10} value={[zoom]} onValueChange={([v]) => setZoom(v ?? 100)} />
              <span className="font-mono text-xs">{zoom}%</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            {compareMode === "side" ? (
              <div className="grid grid-cols-2 gap-3">
                <figure className="overflow-hidden">
                  <div className="overflow-hidden border border-border">
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                      <PersonThumb seed={caseId} label="Reference" ratio="portrait" />
                    </div>
                  </div>
                  <figcaption className="mt-1.5 text-xs text-muted-foreground">Reference — {record.id}</figcaption>
                </figure>
                <figure className="overflow-hidden">
                  <div className="overflow-hidden border border-border">
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                      <PersonThumb seed={compare?.caseId ?? caseId} variant="capture" label="Candidate" ratio="portrait" />
                    </div>
                  </div>
                  <figcaption className="mt-1.5 text-xs text-muted-foreground">Potential match — {compare?.source}</figcaption>
                </figure>
              </div>
            ) : (
              <div className="relative overflow-hidden border border-border">
                <div style={{ transform: `scale(${zoom / 100})` }}>
                  <PersonThumb seed={caseId} label="Reference" ratio="wide" />
                </div>
                <div className="absolute inset-0 opacity-50" style={{ transform: `scale(${zoom / 100})` }}>
                  <PersonThumb seed={compare?.caseId ?? caseId} variant="capture" label="Candidate overlay" ratio="wide" />
                </div>
              </div>
            )}

            <dl className="space-y-px border border-border bg-border text-sm">
              {[
                ["Visual similarity", `${compare?.similarity ?? 0}%`],
                ["Location", compare?.location ?? "—"],
                ["Timestamp", compare?.timestamp ?? "—"],
                ["Evidence source", compare?.source ?? "—"],
                ["Reviewer status", compare?.status ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="bg-card px-3 py-2">
                  <dt className="eyebrow text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCompare(null)}>Close</Button>
            <Button
              onClick={() => {
                if (compare) decide(compare, "in-review");
                setCompare(null);
              }}
            >
              Mark for Human Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
