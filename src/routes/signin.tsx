import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";

const title = "Sign In — VisionTrack";
const description = "Sign in to the VisionTrack workspace. Access is restricted to authorized organizations and case contacts.";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignIn,
});

export function AuthPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-navy p-12 text-navy-foreground lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 grid-blueprint opacity-60" aria-hidden="true" />
      <div className="relative">
        <Link to="/" aria-label="VisionTrack home">
          <Logo variant="inverted" />
        </Link>
      </div>
      <div className="relative max-w-md">
        <p className="eyebrow text-navy-foreground/45">Authorized access</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">See Further. Find Faster.</h2>
        <p className="mt-4 text-sm leading-relaxed text-navy-foreground/65">
          Case records, evidence and search output are restricted to assigned users. Every session, search and review
          decision inside the workspace is logged.
        </p>
      </div>
      <p className="relative text-xs text-navy-foreground/45">
        VisionTrack is a support tool. It does not replace law enforcement, emergency services or human judgement.
      </p>
    </aside>
  );
}

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid work email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    window.setTimeout(() => {
      signIn(email);
      toast.success("Signed in", { description: "Demo session started on this device." });
      navigate({ to: "/app" });
    }, 450);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="lg:hidden" aria-label="VisionTrack home">
            <Logo />
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight lg:mt-0">Sign in to VisionTrack</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your organization account. Any valid-looking email works in this demo environment; use an address
            starting with <code className="font-mono">admin</code> to see the admin console.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" defaultValue="a.selim@demo.visiontrack.app" aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-err" : undefined} />
              {errors.email ? <p id="e-err" className="text-xs text-critical">{errors.email}</p> : null}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/signin" className="text-xs text-primary hover:underline" onClick={(e) => { e.preventDefault(); toast.info("Password reset link sent", { description: "Demo environment — no email is delivered." }); }}>
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" autoComplete="current-password" defaultValue="demo-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "p-err" : undefined} />
              {errors.password ? <p id="p-err" className="text-xs text-critical">{errors.password}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Keep me signed in on this device
              </Label>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => toast.info("Google sign-in not enabled", { description: "Connect an identity provider to enable this option." })}
            >
              Continue with Google
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Need an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
      <AuthPanel />
    </div>
  );
}
