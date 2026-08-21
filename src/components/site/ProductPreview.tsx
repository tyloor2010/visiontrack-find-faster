import { MapCanvas } from "@/components/common/MapCanvas";
import { PersonThumb } from "@/components/common/PersonThumb";
import { DemoTag, PriorityBadge, StatusBadge } from "@/components/common/badges";

/** Static, faithful reproduction of the VisionTrack case workspace, used on marketing pages. */
export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_20px_60px_-30px_oklch(0.21_0.03_258/0.55)]">
      <div className="flex items-center gap-2 border-b border-border bg-surface-strong px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          visiontrack — case VT-1042 · visual search
        </span>
        <DemoTag className="ml-auto" />
      </div>

      <div className="grid gap-px bg-border md:grid-cols-[220px_1fr_260px]">
        {/* Reference column */}
        <div className="bg-card p-4">
          <p className="eyebrow text-muted-foreground">Reference</p>
          <PersonThumb seed="VT-1042" label="Reference image" ratio="portrait" className="mt-3" />
          <dl className="mt-3 space-y-1.5 text-[12px]">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Case</dt>
              <dd className="font-mono">VT-1042</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Age</dt>
              <dd>27</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Last seen</dt>
              <dd>14 Aug, 19:40</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <StatusBadge status="Potential Match" />
            <PriorityBadge priority="Critical" />
          </div>
        </div>

        {/* Map column */}
        <div className="bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted-foreground">Search area · 4 km radius</p>
            <span className="font-mono text-[11px] text-muted-foreground">1,284 candidates scanned</span>
          </div>
          <MapCanvas
            className="mt-3 h-52 w-full"
            radius={{ x: 38, y: 42, km: 4 }}
            pins={[
              { id: "p1", x: 38, y: 46, kind: "last-seen", label: "Last known location" },
              { id: "p2", x: 47, y: 38, kind: "match", label: "Potential match · 87%" },
              { id: "p3", x: 28, y: 58, kind: "evidence", label: "Evidence EV-4822" },
              { id: "p4", x: 60, y: 52, kind: "team", label: "Field team activity" },
            ]}
          />
          <div className="mt-3 grid grid-cols-4 gap-px border border-border bg-border">
            {[
              ["Stage", "Complete"],
              ["Results", "4"],
              ["Threshold", "50%"],
              ["Reviewers", "2"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-2.5 py-2">
                <p className="eyebrow text-muted-foreground">{k}</p>
                <p className="mt-1 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>
          <ol className="mt-3 space-y-1.5 text-[12px] text-muted-foreground">
            {[
              ["09:20", "Search job SJ-2291 initiated"],
              ["09:24", "3 potential matches queued for review"],
              ["13:40", "Reviewer assigned"],
            ].map(([t, e]) => (
              <li key={t} className="flex gap-3">
                <span className="font-mono text-foreground/70">{t}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Results column */}
        <div className="bg-card p-4">
          <p className="eyebrow text-muted-foreground">Potential matches</p>
          <ul className="mt-3 space-y-2.5">
            {[
              { n: "01", s: 87, loc: "Corniche", state: "Awaiting review" },
              { n: "02", s: 74, loc: "Raml Station", state: "Saved lead" },
              { n: "03", s: 61, loc: "Sidi Gaber", state: "In review" },
            ].map((m) => (
              <li key={m.n} className="flex gap-3 border border-border p-2">
                <PersonThumb seed={`m${m.n}`} label={`#${m.n}`} className="w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium">Potential Match #{m.n}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">Similarity {m.s}%</p>
                  <div className="mt-1.5 h-1 w-full bg-surface-strong">
                    <div className="h-full bg-primary" style={{ width: `${m.s}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {m.loc} · {m.state}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
            Similarity scores are algorithmic indicators, not identity confirmation. Every potential match requires
            authorized human review.
          </p>
        </div>
      </div>
    </div>
  );
}
