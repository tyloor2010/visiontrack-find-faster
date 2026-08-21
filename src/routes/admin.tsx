import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Cpu, Database, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag } from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { can, useAuth } from "@/lib/auth";
import { auditLog, cases, team } from "@/lib/demo-data";

export const Route = createFileRoute("/admin")({
  component: AdminConsole,
});

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-card p-4">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function AdminConsole() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [flags, setFlags] = useState({ newIntake: true, mapBeta: false, autoReview: false });

  if (!can(user?.role, "admin.access")) {
    return (
      <PageShell title="Admin Console" description="Restricted area.">
        <div className="panel p-8 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">Administrator access required</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your role ({user?.role ?? "signed out"}) does not include admin console permissions.
          </p>
          <Button asChild className="mt-4"><Link to="/app">Back to dashboard</Link></Button>
        </div>
      </PageShell>
    );
  }

  const logs = auditLog.filter(
    (l) =>
      q.trim() === "" ||
      [l.user, l.action, l.object, l.caseId ?? ""].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageShell
      title="Admin Console"
      description="Platform health, organizations, users, audit log and system configuration."
      actions={<DemoTag />}
    >
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Organizations" value="12" hint="3 pending verification" />
        <Stat label="Active users" value={`${team.filter((t) => t.status === "Active").length}`} hint="Across all organizations" />
        <Stat label="Open cases" value={`${cases.filter((c) => c.status !== "Resolved" && c.status !== "Archived").length}`} hint="Requiring review activity" />
        <Stat label="Processing queue" value="4" hint="Median wait 38 s" />
      </div>

      <Tabs defaultValue="health" className="mt-5">
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="health">System health</TabsTrigger>
          <TabsTrigger value="orgs">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Cpu, title: "Analysis workers", value: "8 / 8 healthy", detail: "Average job time 42 s" },
              { icon: Database, title: "Storage", value: "1.8 TB used", detail: "Encrypted at rest, EU-west" },
              { icon: Activity, title: "API availability", value: "99.98%", detail: "Rolling 30-day window" },
            ].map((s) => (
              <section key={s.title} className="panel p-5">
                <s.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-sm font-semibold">{s.title}</h2>
                <p className="mt-1 text-lg font-medium tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.detail}</p>
              </section>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orgs" className="mt-4">
          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Organizations</caption>
              <thead className="bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Organization</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Users</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Cases</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Verification</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Northfield Search Coalition", "NGO", 14, 22, "Verified"],
                  ["Harbour City Response Unit", "Public agency", 31, 48, "Verified"],
                  ["Lantern Family Support", "Family support", 6, 9, "Pending"],
                  ["Rivergate Volunteer Network", "Volunteer", 19, 12, "Pending"],
                ].map((r) => (
                  <tr key={String(r[0])} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{r[0]}</td>
                    <td className="px-4 py-3">{r[1]}</td>
                    <td className="px-4 py-3 tabular-nums">{r[2]}</td>
                    <td className="px-4 py-3 tabular-nums">{r[3]}</td>
                    <td className="px-4 py-3">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Platform users</caption>
              <thead className="bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Name</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Role</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {team.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <span className="font-medium">{m.name}</span>
                      <span className="block text-xs text-muted-foreground">{m.email}</span>
                    </td>
                    <td className="px-4 py-3">{m.role}</td>
                    <td className="px-4 py-3">{m.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="max-w-sm">
            <Label htmlFor="audit-q" className="sr-only">Search audit log</Label>
            <Input id="audit-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by user, action or object" />
          </div>
          <ul className="panel mt-4 divide-y divide-border">
            {logs.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{l.timestamp}</span>
                <span className="font-medium">{l.user}</span>
                <span className="text-muted-foreground">{l.action}</span>
                <span className="font-mono text-xs">{l.object}</span>
                {l.caseId ? <span className="font-mono text-xs text-muted-foreground">{l.caseId}</span> : null}
                <span className="ml-auto text-xs text-muted-foreground">{l.metadata}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <section className="panel max-w-2xl p-5">
            <h2 className="text-sm font-semibold">Feature flags</h2>
            <div className="mt-3">
              {[
                ["newIntake", "Guided intake wizard", "Multi-step case creation for all organizations."],
                ["mapBeta", "Map clustering (beta)", "Group nearby pins at low zoom levels."],
                ["autoReview", "Auto-advance review queue", "Move to the next candidate after a decision."],
              ].map(([key, label, detail]) => (
                <div key={key} className="flex items-start justify-between gap-6 border-b border-border py-3 last:border-0">
                  <div>
                    <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
                  </div>
                  <Switch
                    id={key}
                    checked={flags[key as keyof typeof flags]}
                    onCheckedChange={(v) => {
                      setFlags((p) => ({ ...p, [key as keyof typeof flags]: v }));
                      toast.success(`${label} ${v ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
