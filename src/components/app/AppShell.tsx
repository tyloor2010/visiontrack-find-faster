import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileBarChart,
  FolderOpen,
  LayoutDashboard,
  LifeBuoy,
  Map,
  ScanSearch,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  Boxes,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { alerts, cases } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const primaryNav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/cases", label: "Cases", icon: FolderOpen },
  { to: "/app/search", label: "Visual Search", icon: ScanSearch },
  { to: "/app/evidence", label: "Evidence", icon: Boxes },
  { to: "/app/map", label: "Map", icon: Map },
  { to: "/app/alerts", label: "Alerts", icon: Bell },
  { to: "/app/team", label: "Team", icon: Users },
  { to: "/app/reports", label: "Reports", icon: FileBarChart },
] as const;

const bottomNav = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/profile", label: "Profile", icon: UserRound },
] as const;

const mobileNav = [
  { to: "/app", label: "Home", icon: LayoutDashboard },
  { to: "/app/cases", label: "Cases", icon: FolderOpen },
  { to: "/app/search", label: "Search", icon: ScanSearch },
  { to: "/app/alerts", label: "Alerts", icon: Bell },
  { to: "/app/profile", label: "Profile", icon: UserRound },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function SidebarLink({
  to,
  label,
  icon: Icon,
  badge,
}: {
  to: string;
  label: string;
  icon: typeof Bell;
  badge?: number | undefined;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
      activeOptions={{ exact: to === "/app" }}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="rounded-sm bg-critical px-1.5 py-0.5 font-mono text-[10px] text-white">{badge}</span>
      ) : null}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = alerts.filter((a) => !a.read).length;

  const results = query.trim()
    ? cases.filter(
        (c) =>
          c.id.toLowerCase().includes(query.toLowerCase()) ||
          c.person.fullName.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Link to="/app" aria-label="VisionTrack workspace">
            <Logo variant="inverted" />
          </Link>
        </div>
        <nav aria-label="Workspace" className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {primaryNav.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              badge={item.to === "/app/alerts" ? unread : undefined}
            />
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          {bottomNav.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
          {user?.role === "Administrator" ? (
            <SidebarLink to="/admin" label="Admin Console" icon={ShieldCheck} />
          ) : null}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur">
          <Link to="/app" className="lg:hidden" aria-label="VisionTrack workspace">
            <LogoMark />
          </Link>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cases, people, evidence IDs"
              aria-label="Search workspace"
              className="pl-9"
            />
            {results.length > 0 ? (
              <ul className="absolute top-full right-0 left-0 z-40 mt-1 max-h-72 overflow-auto border border-border bg-popover shadow-lg">
                {results.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                      onClick={() => {
                        setQuery("");
                        navigate({ to: "/app/cases/$caseId", params: { caseId: c.id } });
                      }}
                    >
                      <span>{c.person.fullName}</span>
                      <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" aria-label={`Alerts, ${unread} unread`}>
              <Link to="/app/alerts" className="relative">
                <Bell className="h-4 w-4" />
                {unread ? (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical" aria-hidden="true" />
                ) : null}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-sm border border-border px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-navy font-mono text-[11px] text-navy-foreground">
                    {user ? initials(user.name) : "VT"}
                  </span>
                  <span className="hidden max-w-32 truncate sm:inline">{user?.name ?? "Guest"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user?.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/profile">
                    <UserRound className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/privacy">
                    <LifeBuoy className="mr-2 h-4 w-4" /> Privacy & Safety
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>

        <nav
          aria-label="Mobile"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card lg:hidden"
        >
          {mobileNav.map((item) => {
            const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="pt-6">{children}</div>
    </div>
  );
}
