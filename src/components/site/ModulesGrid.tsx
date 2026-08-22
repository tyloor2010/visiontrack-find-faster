import {
  Bell,
  FileStack,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MapPin,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const modules = [
  { icon: LayoutDashboard, title: "Dashboard", body: "Active cases, newest candidate matches and team activity in one operational overview." },
  { icon: FolderKanban, title: "Case management", body: "Sortable, filterable case table with status tracking and a guided multi-step intake wizard." },
  { icon: ScanSearch, title: "Visual search", body: "Upload evidence, run identification passes and compare candidates side by side with similarity scores." },
  { icon: FileStack, title: "Evidence center", body: "Central repository with chain-of-custody logging, uploader attribution and file provenance." },
  { icon: MapPin, title: "Spatial map", body: "Geographic view of last-known locations, sighting reports and team deployment radii." },
  { icon: Bell, title: "Alerts", body: "Notification center for new matches, status changes and escalations that need a reviewer." },
  { icon: FileText, title: "Reports", body: "Structured case summaries and activity exports for briefings and handovers." },
  { icon: Users, title: "Team", body: "Role assignment, invitations and per-case membership with scoped permissions." },
  { icon: ShieldCheck, title: "Admin console", body: "Organization management, platform health and access review for administrators." },
];

export function ModulesGrid() {
  return (
    <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m, i) => (
        <Reveal key={m.title} delay={(i % 3) * 110}>
          <article className="group h-full bg-card p-7 transition-colors duration-300 hover:bg-surface">
            <m.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            <h3 className="mt-5 text-base font-semibold">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
