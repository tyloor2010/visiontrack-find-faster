import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { AuthPanel } from "@/routes/signin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import type { TeamRole } from "@/lib/demo-data";

const title = "Create Account — VisionTrack";
const description = "Request a VisionTrack workspace account. Accounts are provisioned to verified organizations and nominated case contacts.";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<TeamRole>("Investigator");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const organization = String(data.get("organization") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const accepted = data.get("terms") === "on";

    const next: Record<string, string> = {};
    if (name.length < 2) next["name"] = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next["email"] = "Enter a valid work email address.";
    if (organization.length < 2) next["organization"] = "Enter your organization.";
    if (password.length < 8) next["password"] = "Use at least 8 characters.";
    else if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) next["password"] = "Include letters and numbers.";
    if (confirm !== password) next["confirm"] = "Passwords do not match.";
    if (!accepted) next["terms"] = "You must accept the terms and privacy policy.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      signIn(email, { name, role, organization });
      toast.success("Account created", { description: "Demo account stored on this device only." });
      navigate({ to: "/app" });
    }, 500);
  }

  const field = (id: string) => (errors[id] ? { "aria-invalid": true, "aria-describedby": `${id}-err` } : {});

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="lg:hidden" aria-label="VisionTrack home">
            <Logo />
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight lg:mt-0">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            In production, accounts are provisioned after organization verification. This demo creates a local session
            so you can explore the workspace.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" autoComplete="name" {...field("name")} />
              {errors["name"] ? <p id="name-err" className="text-xs text-critical">{errors["name"]}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" {...field("email")} />
              {errors["email"] ? <p id="email-err" className="text-xs text-critical">{errors["email"]}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input id="organization" name="organization" defaultValue="Coastal Response Unit" {...field("organization")} />
              {errors["organization"] ? <p id="organization-err" className="text-xs text-critical">{errors["organization"]}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Requested role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as TeamRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Administrator", "Investigator", "Reviewer", "Coordinator", "Viewer"] as TeamRole[]).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" {...field("password")} />
                {errors["password"] ? <p id="password-err" className="text-xs text-critical">{errors["password"]}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm</Label>
                <Input id="confirm" name="confirm" type="password" autoComplete="new-password" {...field("confirm")} />
                {errors["confirm"] ? <p id="confirm-err" className="text-xs text-critical">{errors["confirm"]}</p> : null}
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <Checkbox id="terms" name="terms" />
              <Label htmlFor="terms" className="text-sm leading-relaxed font-normal text-muted-foreground">
                I accept the{" "}
                <Link to="/terms" className="text-primary hover:underline">terms</Link> and{" "}
                <Link to="/privacy" className="text-primary hover:underline">privacy policy</Link>, and confirm I will
                use VisionTrack only for authorized missing-person cases.
              </Label>
            </div>
            {errors["terms"] ? <p className="text-xs text-critical">{errors["terms"]}</p> : null}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <AuthPanel />
    </div>
  );
}
