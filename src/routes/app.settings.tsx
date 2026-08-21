import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag } from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
});

function Row({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-3 last:border-0">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Settings() {
  const { user } = useAuth();
  const [org, setOrg] = useState(user?.organization ?? "Northfield Search Coalition");
  const [region, setRegion] = useState("eu-west");
  const [retention, setRetention] = useState("180");
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    urgentSms: false,
    weeklyDigest: true,
    twoFactor: true,
    sessionTimeout: true,
    highContrast: false,
    reducedMotion: false,
  });
  const set = (k: keyof typeof prefs) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [k]: v }));
    toast.success("Preference saved");
  };

  return (
    <PageShell title="Settings" description="Organization, notification, security and accessibility preferences." actions={<DemoTag />}>
      <Tabs defaultValue="org">
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data & retention</TabsTrigger>
          <TabsTrigger value="a11y">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="mt-4">
          <section className="panel max-w-2xl p-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input id="org-name" value={org} onChange={(e) => setOrg(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-region">Data residency region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="org-region"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eu-west">Europe (west)</SelectItem>
                    <SelectItem value="eu-north">Europe (north)</SelectItem>
                    <SelectItem value="us-east">North America (east)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Case data and evidence remain within the selected region.</p>
              </div>
              <Button onClick={() => toast.success("Organization settings saved")}>Save changes</Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <section className="panel max-w-2xl p-5">
            <Row label="Email alerts" description="New matches, case status changes and evidence uploads." checked={prefs.emailAlerts} onChange={set("emailAlerts")} />
            <Row label="Urgent SMS" description="Only for cases marked critical priority." checked={prefs.urgentSms} onChange={set("urgentSms")} />
            <Row label="Weekly digest" description="A summary of case activity every Monday." checked={prefs.weeklyDigest} onChange={set("weeklyDigest")} />
          </section>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <section className="panel max-w-2xl p-5">
            <Row label="Two-factor authentication" description="Required for all accounts with case access." checked={prefs.twoFactor} onChange={set("twoFactor")} />
            <Row label="Automatic session timeout" description="Sign out inactive sessions after 30 minutes." checked={prefs.sessionTimeout} onChange={set("sessionTimeout")} />
            <div className="mt-4 space-y-2">
              <Label htmlFor="pw">Change password</Label>
              <Input id="pw" type="password" placeholder="New password" />
              <Button variant="outline" onClick={() => toast.success("Password updated")}>Update password</Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          <section className="panel max-w-2xl p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Evidence retention (days)</Label>
              <Input id="retention" type="number" min={30} max={3650} value={retention} onChange={(e) => setRetention(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Evidence is deleted automatically after this period unless the case is still open.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.success("Export requested", { description: "You will receive a download link when it is ready." })}>
                Export organization data
              </Button>
              <Button variant="outline" onClick={() => toast.success("Retention policy saved")}>Save policy</Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="a11y" className="mt-4">
          <section className="panel max-w-2xl p-5">
            <Row label="High contrast" description="Increase contrast for tables and dense data views." checked={prefs.highContrast} onChange={set("highContrast")} />
            <Row label="Reduced motion" description="Disable non-essential transitions and animations." checked={prefs.reducedMotion} onChange={set("reducedMotion")} />
          </section>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
