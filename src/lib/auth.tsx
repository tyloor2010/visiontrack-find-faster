import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { TeamRole } from "./demo-data";

export interface SessionUser {
  name: string;
  email: string;
  role: TeamRole;
  organization: string;
  signedInAt: string;
}

interface AuthValue {
  user: SessionUser | null;
  ready: boolean;
  signIn: (email: string, opts?: { name?: string; role?: TeamRole; organization?: string }) => SessionUser;
  signOut: () => void;
  update: (patch: Partial<SessionUser>) => void;
}

const STORAGE_KEY = "visiontrack.session";

const AuthContext = createContext<AuthValue | null>(null);

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "user";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as SessionUser);
      } else {
        const fallback: SessionUser = {
          name: "Nadia Farouk",
          email: "nadia.farouk@coastalresponse.org",
          role: "Administrator",
          organization: "Coastal Response Unit",
          signedInAt: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
        setUser(fallback);
      }
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      signIn: (email, opts) => {
        const next: SessionUser = {
          name: opts?.name?.trim() || nameFromEmail(email),
          email,
          role: opts?.role ?? (email.startsWith("admin") ? "Administrator" : "Investigator"),
          organization: opts?.organization?.trim() || "Coastal Response Unit",
          signedInAt: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setUser(next);
        return next;
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
      update: (patch) => {
        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, ...patch };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

const PERMISSIONS: Record<TeamRole, string[]> = {
  Administrator: ["case.create", "case.edit", "case.delete", "evidence.upload", "search.run", "result.review", "team.manage", "admin.access", "report.generate"],
  Investigator: ["case.create", "case.edit", "evidence.upload", "search.run", "result.review", "report.generate"],
  Reviewer: ["evidence.upload", "search.run", "result.review", "report.generate"],
  Coordinator: ["case.create", "case.edit", "evidence.upload", "team.manage", "report.generate"],
  Viewer: [],
};

export function can(role: TeamRole | undefined, permission: string) {
  if (!role) return false;
  return PERMISSIONS[role].includes(permission);
}
