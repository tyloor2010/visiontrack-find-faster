import { cn } from "@/lib/utils";
import type { CasePriority, CaseStatus } from "@/lib/demo-data";

const base =
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap";

const statusStyles: Record<CaseStatus, string> = {
  Active: "border-primary/25 bg-primary/8 text-primary",
  "Under Review": "border-warning/30 bg-warning/10 text-warning",
  "Potential Match": "border-critical/25 bg-critical/8 text-critical",
  Resolved: "border-success/25 bg-success/10 text-success",
  Archived: "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  return (
    <span className={cn(base, statusStyles[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

const priorityStyles: Record<CasePriority, string> = {
  Low: "border-border bg-muted text-muted-foreground",
  Medium: "border-border bg-surface-strong text-foreground",
  High: "border-warning/35 bg-warning/10 text-warning",
  Critical: "border-critical/40 bg-critical/10 text-critical",
};

export function PriorityBadge({ priority, className }: { priority: CasePriority; className?: string }) {
  return <span className={cn(base, "font-mono uppercase tracking-wide", priorityStyles[priority], className)}>{priority}</span>;
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-surface-strong px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase",
        className,
      )}
    >
      Demo data
    </span>
  );
}

export function Metric({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="eyebrow text-muted-foreground">{label}</p>
        {trend ? <span className="font-mono text-[11px] text-muted-foreground">{trend}</span> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
