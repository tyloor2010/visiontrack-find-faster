import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PersonThumb } from "@/components/common/PersonThumb";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cases, formatDate, DEMO_NOTICE } from "@/lib/demo-data";

const title = "Public Appeals — VisionTrack";
const description =
  "Browse published missing-person appeals shared by authorized VisionTrack organizations: photograph, last-seen location, date, and how to report a sighting safely.";

export const Route = createFileRoute("/appeals")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppealsPage,
});

const published = cases.filter((c) => c.status !== "Archived");

function AppealsPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");

  const cities = useMemo(
    () => Array.from(new Set(published.map((c) => c.lastSeenLocation.split(",").pop()!.trim()))).sort(),
    [],
  );

  const rows = published.filter((c) => {
    const term = q.trim().toLowerCase();
    const matchesTerm =
      !term ||
      c.person.fullName.toLowerCase().includes(term) ||
      c.lastSeenLocation.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term);
    const matchesCity = city === "all" || c.lastSeenLocation.endsWith(city);
    return matchesTerm && matchesCity;
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Public appeals"
        title="Published missing-person appeals."
        intro="Appeals published by authorized organizations. If you recognise someone, contact your local emergency or law-enforcement service first — do not approach anyone yourself."
      />

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, place or reference"
              aria-label="Search appeals"
              className="pl-9"
            />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-52" aria-label="Filter by area">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All areas</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="ml-auto font-mono text-xs text-muted-foreground">{rows.length} appeals</p>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((c) => (
            <li key={c.id} className="panel overflow-hidden">
              <PersonThumb seed={c.id} ratio="portrait" />
              <div className="p-4">
                <h2 className="text-base font-semibold">{c.person.fullName}</h2>
                <p className="text-xs text-muted-foreground">
                  Age {c.person.age} · {c.person.gender} · {c.person.height}
                </p>
                <dl className="mt-3 space-y-1 text-xs">
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Last seen:</dt>
                    <dd>{c.lastSeenLocation}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Date:</dt>
                    <dd>{formatDate(c.lastSeenAt)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Wearing:</dt>
                    <dd className="line-clamp-2">{c.person.clothing}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/contact">Report a sighting</Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {rows.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No appeals match this search. Try a different name or area.
          </p>
        ) : null}

        <p className="mt-12 border-l-2 border-critical bg-critical/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {DEMO_NOTICE}
        </p>
      </section>
    </SiteLayout>
  );
}
