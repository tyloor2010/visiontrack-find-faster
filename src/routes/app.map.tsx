import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageShell } from "@/components/app/AppShell";
import { MapCanvas, MapLegend, type MapPin } from "@/components/common/MapCanvas";
import { DemoTag, PriorityBadge, StatusBadge } from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { caseEvidence, caseMatches, cases, formatDateTime, getCase } from "@/lib/demo-data";

export const Route = createFileRoute("/app/map")({
  validateSearch: z.object({ case: z.string().optional() }),
  component: MapPage,
});

function MapPage() {
  const params = Route.useSearch();
  const [caseId, setCaseId] = useState(params.case ?? cases[0]!.id);
  const [radius, setRadius] = useState(4);
  const [timeFilter, setTimeFilter] = useState("14d");
  const [showEvidence, setShowEvidence] = useState(true);
  const [showMatches, setShowMatches] = useState(true);
  const [showTeam, setShowTeam] = useState(true);
  const [selected, setSelected] = useState<MapPin | null>(null);

  const record = getCase(caseId)!;
  const ev = caseEvidence(caseId);
  const ms = caseMatches(caseId);

  const pins: MapPin[] = [
    { id: "last-seen", x: record.coordinates.x, y: record.coordinates.y, kind: "last-seen", label: "Last known location", sublabel: record.lastSeenLocation },
    ...(showMatches
      ? ms.map((m) => ({ id: m.id, x: m.coordinates.x, y: m.coordinates.y, kind: "match" as const, label: `Potential match ${m.similarity}%`, sublabel: `${m.location} · ${m.timestamp}` }))
      : []),
    ...(showEvidence
      ? ev.filter((e) => e.type === "Image" || e.type === "Location").map((e, i) => ({
          id: e.id,
          x: Math.min(92, record.coordinates.x + 9 + i * 7),
          y: Math.min(88, record.coordinates.y + 14),
          kind: "evidence" as const,
          label: e.id,
          sublabel: e.title,
        }))
      : []),
    ...(showTeam
      ? [{ id: "team-1", x: record.coordinates.x - 11, y: record.coordinates.y + 8, kind: "team" as const, label: record.assignedTeam, sublabel: "Field activity logged 2 h ago" }]
      : []),
  ];

  return (
    <PageShell
      title="Locations & Map"
      description="Search zones, evidence locations and reviewed activity for a single case."
      actions={<DemoTag />}
    >
      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="panel p-4">
            <h2 className="text-sm font-semibold">Case filter</h2>
            <div className="mt-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="map-case">Case</Label>
                <Select value={caseId} onValueChange={(v) => { setCaseId(v); setSelected(null); }}>
                  <SelectTrigger id="map-case"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.id} — {c.person.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="map-radius">Search area</Label>
                  <span className="font-mono text-xs">{radius} km</span>
                </div>
                <Slider id="map-radius" min={1} max={25} step={1} value={[radius]} onValueChange={([v]) => setRadius(v ?? 4)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="map-time">Time filter</Label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger id="map-time"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="14d">Last 14 days</SelectItem>
                    <SelectItem value="all">Since case opened</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 border-t border-border pt-3">
                {[
                  ["Evidence locations", showEvidence, setShowEvidence] as const,
                  ["Potential matches", showMatches, setShowMatches] as const,
                  ["Team activity", showTeam, setShowTeam] as const,
                ].map(([label, value, setter]) => (
                  <div key={label} className="flex items-center justify-between">
                    <Label htmlFor={label} className="text-sm font-normal">{label}</Label>
                    <Switch id={label} checked={value} onCheckedChange={setter} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="text-sm font-semibold">Case</h2>
            <p className="mt-2 text-sm font-medium">{record.person.fullName}</p>
            <p className="text-xs text-muted-foreground">{record.lastSeenLocation}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(record.lastSeenAt)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <StatusBadge status={record.status} />
              <PriorityBadge priority={record.priority} />
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to="/app/cases/$caseId" params={{ caseId: record.id }}>Open case</Link>
            </Button>
          </section>

          {selected ? (
            <section className="panel p-4" aria-live="polite">
              <h2 className="text-sm font-semibold">{selected.label}</h2>
              {selected.sublabel ? <p className="mt-1 text-sm text-muted-foreground">{selected.sublabel}</p> : null}
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                {selected.kind.replace("-", " ")} · pin {selected.id}
              </p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelected(null)}>Clear selection</Button>
            </section>
          ) : null}
        </aside>

        <section className="panel p-4">
          <MapCanvas
            className="h-[560px] w-full"
            pins={pins}
            radius={{ x: record.coordinates.x, y: record.coordinates.y, km: radius }}
            center={record.coordinates}
            {...(selected ? { selectedId: selected.id } : {})}
            onSelect={setSelected}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <MapLegend />
            <p className="font-mono text-[11px] text-muted-foreground">
              {pins.length} pins · {radius} km radius · schematic view
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
