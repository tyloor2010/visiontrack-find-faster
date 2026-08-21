import { cn } from "@/lib/utils";

export interface MapPin {
  id: string;
  x: number;
  y: number;
  kind: "last-seen" | "evidence" | "match" | "team";
  label: string;
  sublabel?: string;
}

const pinColor: Record<MapPin["kind"], string> = {
  "last-seen": "text-critical",
  evidence: "text-primary",
  match: "text-warning",
  team: "text-success",
};

/**
 * Vector map surface. Renders a schematic coastline, road grid, districts and
 * case pins without depending on an external tile provider.
 */
export function MapCanvas({
  pins,
  radius,
  center,
  onSelect,
  selectedId,
  className,
}: {
  pins: MapPin[];
  radius?: { x: number; y: number; km: number };
  center?: { x: number; y: number };
  onSelect?: (pin: MapPin) => void;
  selectedId?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden border border-border bg-[oklch(0.94_0.008_230)]", className)}>
      <svg viewBox="0 0 100 60" className="h-full w-full" role="img" aria-label="Case map with search area and located pins">
        <defs>
          <pattern id="mapgrid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0H0V5" fill="none" stroke="oklch(0.86 0.01 240)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="60" fill="url(#mapgrid)" />
        {/* water */}
        <path d="M0 0H100V13c-14 5-28 2-42 6S24 24 0 19Z" fill="oklch(0.85 0.045 230)" />
        <path d="M0 19c24 5 44-4 58-8s28-1 42-6" fill="none" stroke="oklch(0.72 0.06 232)" strokeWidth="0.35" />
        {/* parks */}
        <path d="M12 42h16v11H12Z" fill="oklch(0.9 0.04 150)" />
        <path d="M70 30h18v9H70Z" fill="oklch(0.9 0.04 150)" />
        {/* main roads */}
        <g stroke="oklch(0.99 0 0)" strokeWidth="1.1" fill="none">
          <path d="M0 26c22 6 40-2 60 2s28 8 40 6" />
          <path d="M22 60V22" />
          <path d="M52 60V24" />
          <path d="M78 60V29" />
          <path d="M0 44h100" />
        </g>
        <g stroke="oklch(0.8 0.01 240)" strokeWidth="0.2" fill="none">
          <path d="M0 34h100M0 52h100M36 60V25M66 60V27M90 60V22" />
        </g>
        {radius ? (
          <g>
            <circle cx={radius.x} cy={radius.y * 0.6} r={radius.km * 1.6} fill="oklch(0.5 0.13 249 / 0.1)" stroke="oklch(0.5 0.13 249)" strokeWidth="0.3" strokeDasharray="1.2 0.8" />
          </g>
        ) : null}
        {center ? <circle cx={center.x} cy={center.y * 0.6} r="0.9" fill="oklch(0.5 0.13 249)" /> : null}
      </svg>

      {pins.map((pin) => (
        <button
          key={pin.id}
          type="button"
          onClick={() => onSelect?.(pin)}
          aria-label={`${pin.label}${pin.sublabel ? `, ${pin.sublabel}` : ""}`}
          className={cn(
            "group absolute -translate-x-1/2 -translate-y-full focus-visible:outline-2",
            pinColor[pin.kind],
            selectedId === pin.id && "z-10",
          )}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <svg viewBox="0 0 16 20" className={cn("h-5 w-5 drop-shadow-sm", selectedId === pin.id && "h-6 w-6")} fill="currentColor">
            <path d="M8 0c4.4 0 8 3.5 8 7.8C16 13.2 9.4 19.4 8.6 20a1 1 0 0 1-1.2 0C6.6 19.4 0 13.2 0 7.8 0 3.5 3.6 0 8 0Z" />
            <circle cx="8" cy="7.6" r="2.6" fill="white" />
          </svg>
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-navy px-2 py-1 text-[11px] text-navy-foreground group-hover:block group-focus-visible:block">
            {pin.label}
            {pin.sublabel ? <span className="block text-navy-foreground/60">{pin.sublabel}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}

export function MapLegend() {
  const items: { kind: MapPin["kind"]; label: string }[] = [
    { kind: "last-seen", label: "Last known location" },
    { kind: "evidence", label: "Evidence location" },
    { kind: "match", label: "Potential match" },
    { kind: "team", label: "Team activity" },
  ];
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.kind} className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full bg-current", pinColor[i.kind])} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
