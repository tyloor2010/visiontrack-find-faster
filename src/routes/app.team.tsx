import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { portraitFor } from "@/components/common/PersonThumb";
import { DemoTag } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { can, useAuth } from "@/lib/auth";
import { team as seedTeam, type TeamMember, type TeamRole } from "@/lib/demo-data";

export const Route = createFileRoute("/app/team")({
  component: TeamPage,
});

const ROLES: TeamRole[] = ["Administrator", "Investigator", "Reviewer", "Coordinator", "Viewer"];

const PERMISSION_MATRIX: Record<TeamRole, string[]> = {
  Administrator: ["Full case access", "Manage users & roles", "Admin console", "Audit log access"],
  Investigator: ["Create & edit cases", "Upload evidence", "Run searches", "Review results"],
  Reviewer: ["Review potential matches", "Compare evidence", "Record decisions"],
  Coordinator: ["Assign cases", "Manage search areas", "Team scheduling"],
  Viewer: ["Read-only access to assigned cases"],
};

function TeamPage() {
  const { user } = useAuth();
  const manage = can(user?.role, "team.manage");
  const [members, setMembers] = useState<TeamMember[]>(seedTeam);
  const [q, setQ] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Reviewer");
  const [inviteEmail, setInviteEmail] = useState("");
  const [open, setOpen] = useState(false);

  const rows = members.filter(
    (m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageShell
      title="Team"
      description={manage ? "Manage roles, assignments and access." : "Your role has read-only access to team information."}
      actions={
        <>
          <DemoTag />
          {manage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Invite member</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a team member</DialogTitle>
                  <DialogDescription>
                    Invitations are scoped to your organization. The invited user receives the permissions of the role
                    selected here.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Work email</Label>
                    <Input id="invite-email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamRole)}>
                      <SelectTrigger id="invite-role"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {PERMISSION_MATRIX[inviteRole].map((p) => <li key={p}>· {p}</li>)}
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)}
                    onClick={() => {
                      setMembers((prev) => [
                        ...prev,
                        {
                          id: `U-${prev.length + 10}`,
                          name: inviteEmail.split("@")[0] ?? "Invited user",
                          email: inviteEmail,
                          role: inviteRole,
                          status: "Invited",
                          assignedCases: 0,
                          lastActive: "—",
                        },
                      ]);
                      setInviteEmail("");
                      setOpen(false);
                      toast.success("Invitation queued", { description: "Demo environment — no email is sent." });
                    }}
                  >
                    Send invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
        </>
      }
    >
      <div className="max-w-sm">
        <Label htmlFor="team-q" className="sr-only">Search team</Label>
        <Input id="team-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" />
      </div>

      <div className="mt-5 panel">
        {rows.length === 0 ? (
          <EmptyState icon={Users} title="No team members" description="Invite colleagues to collaborate on cases with role-scoped permissions." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Team members</caption>
              <thead className="bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Name</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Role</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Assigned cases</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Last active</th>
                  {manage ? <th scope="col" className="px-4 py-2.5 font-medium"><span className="sr-only">Actions</span></th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={portraitFor(m.id)}
                          alt=""
                          loading="lazy"
                          width={512}
                          height={640}
                          className="h-9 w-9 shrink-0 rounded-full border border-border object-cover object-top"
                        />
                        <div>
                          <span className="font-medium">{m.name}</span>
                          <span className="block text-xs text-muted-foreground">{m.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {manage ? (
                        <Select
                          value={m.role}
                          onValueChange={(v) => {
                            setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, role: v as TeamRole } : x)));
                            toast.success(`${m.name} is now ${v}`, { description: "Role change written to the audit log." });
                          }}
                        >
                          <SelectTrigger className="h-8 w-40" aria-label={`Role for ${m.name}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        m.role
                      )}
                    </td>
                    <td className="px-4 py-3">{m.status}</td>
                    <td className="px-4 py-3 tabular-nums">{m.assignedCases}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.lastActive}</td>
                    {manage ? (
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setMembers((prev) =>
                              prev.map((x) =>
                                x.id === m.id ? { ...x, status: x.status === "Suspended" ? "Active" : "Suspended" } : x,
                              ),
                            );
                            toast.success(m.status === "Suspended" ? "Access restored" : "Access suspended");
                          }}
                        >
                          {m.status === "Suspended" ? "Restore" : "Suspend"}
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="mt-6 panel p-5" aria-labelledby="permissions">
        <h2 id="permissions" className="text-sm font-semibold">Role permissions</h2>
        <div className="mt-4 grid gap-px border border-border bg-border md:grid-cols-3 xl:grid-cols-5">
          {ROLES.map((r) => (
            <div key={r} className="bg-card p-4">
              <h3 className="text-sm font-medium">{r}</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {PERMISSION_MATRIX[r].map((p) => <li key={p}>· {p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
