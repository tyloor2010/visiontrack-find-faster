import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FolderPlus, Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag, PriorityBadge, StatusBadge } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cases, formatDate, relativeFrom, type CasePriority, type CaseStatus } from "@/lib/demo-data";

const searchSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  page: z.coerce.number().optional(),
});

export const Route = createFileRoute("/app/cases/")({
  validateSearch: searchSchema,
  component: CasesPage,
});

const PAGE_SIZE = 5;

function CasesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/app/cases/" });
  const [q, setQ] = useState(search.q ?? "");

  const status = search.status ?? "all";
  const priority = search.priority ?? "all";
  const page = search.page ?? 1;

  const filtered = cases.filter((c) => {
    const term = (search.q ?? "").toLowerCase();
    const matchesTerm =
      !term ||
      c.id.toLowerCase().includes(term) ||
      c.person.fullName.toLowerCase().includes(term) ||
      c.lastSeenLocation.toLowerCase().includes(term);
    return matchesTerm && (status === "all" || c.status === status) && (priority === "all" || c.priority === priority);
  });

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const setParam = (patch: Record<string, string | number | undefined>) =>
    navigate({ search: (prev) => ({ ...prev, page: 1, ...patch }) });

  return (
    <PageShell
      title="Missing Persons Cases"
      description="All cases visible to your role and assignments."
      actions={
        <>
          <DemoTag />
          <Button asChild>
            <Link to="/app/cases/new">
              <FolderPlus className="mr-2 h-4 w-4" /> Create Case
            </Link>
          </Button>
        </>
      }
    >
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setParam({ q: q.trim() || undefined });
        }}
      >
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by case ID, name or location"
            aria-label="Search cases"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setParam({ status: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-44" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(["Active", "Under Review", "Potential Match", "Resolved", "Archived"] as CaseStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => setParam({ priority: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-40" aria-label="Filter by priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {(["Low", "Medium", "High", "Critical"] as CasePriority[]).map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline">Apply</Button>
        {(search.q || search.status || search.priority) ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setQ("");
              navigate({ search: {} });
            }}
          >
            Clear
          </Button>
        ) : null}
      </form>

      <div className="mt-5 panel">
        {rows.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="No cases match these filters"
            description="Adjust or clear the filters, or create a new case to begin a search."
            action={
              <Button asChild>
                <Link to="/app/cases/new">Create a case</Link>
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Missing person cases</caption>
              <thead className="bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Case ID</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Person</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Last seen</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Priority</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Team</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface">
                    <td className="px-4 py-3">
                      <Link to="/app/cases/$caseId" params={{ caseId: c.id }} className="font-mono text-xs text-primary hover:underline">
                        {c.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{c.person.fullName}</span>
                      <span className="block text-xs text-muted-foreground">
                        Age {c.person.age} · {c.person.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.lastSeenLocation}
                      <span className="block text-xs">{formatDate(c.lastSeenAt)}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.assignedTeam}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{relativeFrom(c.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 ? (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Pagination">
          <p className="text-muted-foreground">
            Page {current} of {pages} · {filtered.length} cases
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={current === 1} onClick={() => navigate({ search: (p) => ({ ...p, page: current - 1 }) })}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={current === pages} onClick={() => navigate({ search: (p) => ({ ...p, page: current + 1 }) })}>
              Next
            </Button>
          </div>
        </nav>
      ) : null}
    </PageShell>
  );
}
