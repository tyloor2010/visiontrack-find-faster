import { createFileRoute, Link } from "@tanstack/react-router";
import { BellOff, CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alerts as seedAlerts, formatDateTime, type AlertItem } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/alerts")({
  component: Alerts,
});

const TABS = ["All", "Urgent", "Cases", "Evidence", "Team"] as const;

function Alerts() {
  const [items, setItems] = useState<AlertItem[]>(seedAlerts);

  const select = (tab: (typeof TABS)[number]) =>
    items.filter((a) => (tab === "All" ? true : tab === "Urgent" ? a.urgent : a.category === tab));

  return (
    <PageShell
      title="Alerts"
      description="Case, evidence and team notifications, ordered by recency."
      actions={
        <>
          <DemoTag />
          <Button
            variant="outline"
            onClick={() => {
              setItems((prev) => prev.map((a) => ({ ...a, read: true })));
              toast.success("All alerts marked as read");
            }}
          >
            <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
          </Button>
        </>
      }
    >
      <Tabs defaultValue="All">
        <TabsList className="flex flex-wrap justify-start">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">{select(t).length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => {
          const rows = select(t);
          return (
            <TabsContent key={t} value={t} className="mt-4">
              {rows.length === 0 ? (
                <EmptyState icon={BellOff} title="No alerts" description="Alerts appear here when a case changes, evidence is added, or a match needs review." />
              ) : (
                <ul className="panel divide-y divide-border">
                  {rows.map((a) => (
                    <li key={a.id} className={cn("flex flex-wrap items-start gap-3 px-4 py-4", !a.read && "bg-primary/4")}>
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          a.urgent ? "bg-critical" : a.read ? "bg-border" : "bg-primary",
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{a.title}</p>
                          {a.urgent ? (
                            <span className="rounded-sm border border-critical/30 bg-critical/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-critical uppercase">
                              Urgent
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                          {formatDateTime(a.at)} · {a.category}
                          {a.caseId ? ` · ${a.caseId}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {a.caseId ? (
                          <Button asChild size="sm" variant="outline">
                            <Link to="/app/cases/$caseId" params={{ caseId: a.caseId }}>Open case</Link>
                          </Button>
                        ) : null}
                        {!a.read ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, read: true } : x)))}
                          >
                            Mark read
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </PageShell>
  );
}
