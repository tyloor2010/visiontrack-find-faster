import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  // Session state lives in the browser, so the workspace subtree is client-rendered.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Workspace — VisionTrack" },
      { name: "description", content: "VisionTrack case workspace for authorized teams." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkspaceLayout,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="eyebrow text-critical">Workspace error</p>
      <h1 className="mt-3 text-xl font-semibold">{error.message || "Something went wrong"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Reload the workspace. If the problem continues, contact your organization administrator.
      </p>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="eyebrow text-primary">Not found</p>
      <h1 className="mt-3 text-xl font-semibold">That workspace page doesn't exist</h1>
      <Button asChild className="mt-6">
        <Link to="/app">Back to overview</Link>
      </Button>
    </div>
  ),
});

function WorkspaceLayout() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/signin", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-6 py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
        <p className="sr-only">Checking your session</p>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
