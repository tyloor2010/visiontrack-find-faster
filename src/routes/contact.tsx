import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const title = "Contact VisionTrack";
const description =
  "Reach the VisionTrack team about organization access, case support, security disclosures, or partnership enquiries.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

interface Errors {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
}

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [topic, setTopic] = useState("organization");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const organization = String(data.get("organization") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (organization.length < 2) next.organization = "Tell us which organization you represent.";
    if (message.length < 20) next.message = "Please give us at least a couple of sentences of context.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setSent(true);
    toast.success("Message queued", { description: "This demo environment does not deliver email." });
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the team."
        intro="Organization access is granted case by case. Tell us who you are, what you are responsible for, and what you need the platform to do."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {sent ? (
            <div className="border border-border bg-card p-8">
              <h2 className="text-xl font-semibold tracking-tight">Message queued</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Thanks — in a production deployment this would open an access request ticket. This environment does not
                send email or store submissions.
              </p>
              <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5 border border-border bg-card p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
                  {errors.name ? <p id="name-err" className="text-xs text-critical">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
                  {errors.email ? <p id="email-err" className="text-xs text-critical">{errors.email}</p> : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" name="organization" aria-invalid={!!errors.organization} aria-describedby={errors.organization ? "org-err" : undefined} />
                {errors.organization ? <p id="org-err" className="text-xs text-critical">{errors.organization}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger id="topic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organization">Organization access</SelectItem>
                    <SelectItem value="case">Support with an existing case</SelectItem>
                    <SelectItem value="security">Security disclosure</SelectItem>
                    <SelectItem value="partnership">Partnership or research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={6} aria-invalid={!!errors.message} aria-describedby={errors.message ? "msg-err" : undefined} />
                {errors.message ? <p id="msg-err" className="text-xs text-critical">{errors.message}</p> : null}
              </div>
              <p className="text-xs text-muted-foreground">
                Do not include case details, photographs, or personal information about a missing person in this form.
              </p>
              <Button type="submit" size="lg">Send message</Button>
            </form>
          )}
        </div>

        <aside className="space-y-px self-start border border-border bg-border">
          {[
            ["Emergencies", "VisionTrack cannot dispatch help. Contact your local emergency number immediately if someone is at risk."],
            ["Organization access", "We verify the requesting organization and its lawful basis before provisioning a workspace."],
            ["Security disclosures", "Report vulnerabilities through this form with the security topic selected. We do not run a public bug bounty."],
            ["Data requests", "Case contacts can request a record of what is held about their case through the assigned organization."],
          ].map(([t, b]) => (
            <div key={t} className="bg-card p-6">
              <h2 className="text-sm font-semibold">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </aside>
      </section>
    </SiteLayout>
  );
}
