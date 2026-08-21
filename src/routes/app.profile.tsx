import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag } from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { auditLog, cases } from "@/lib/demo-data";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("+44 20 7946 0102");
  const [bio, setBio] = useState("Field investigator focused on urban search coordination.");

  const assigned = cases.slice(0, 3);
  const activity = auditLog.slice(0, 6);

  return (
    <PageShell title="Profile" description="Your account details, assigned cases and recent activity." actions={<DemoTag />}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="panel p-5">
          <h2 className="text-sm font-semibold">Account details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p-name">Full name</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-email">Email</Label>
              <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-phone">Phone</Label>
              <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-role">Role</Label>
              <Input id="p-role" value={user?.role ?? "Viewer"} readOnly aria-readonly="true" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="p-bio">About</Label>
              <Textarea id="p-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
          </div>
          <Button
            className="mt-4"
            disabled={name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            onClick={() => toast.success("Profile updated")}
          >
            Save profile
          </Button>
        </section>

        <aside className="space-y-4">
          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Organization</h2>
            <p className="mt-2 text-sm">{user?.organization ?? "Northfield Search Coalition"}</p>
            <p className="text-xs text-muted-foreground">Role: {user?.role ?? "Viewer"}</p>
          </section>
          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Assigned cases</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {assigned.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs">{c.id}</span>
                  <span className="truncate text-muted-foreground">{c.person.fullName}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {activity.map((a) => (
                <li key={a.id}>
                  <span className="font-mono">{a.timestamp}</span> — {a.action} {a.object}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
