import { cn } from "@/lib/utils";

/**
 * Placeholder visual for reference imagery. VisionTrack sample data contains no
 * photographs of real people, so reference frames are rendered as labelled
 * synthetic tiles.
 */
export function PersonThumb({
  seed,
  label,
  className,
  ratio = "square",
}: {
  seed: string;
  label?: string;
  className?: string;
  ratio?: "square" | "portrait" | "wide";
}) {
  const hue = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 60;
  const aspect = ratio === "square" ? "aspect-square" : ratio === "portrait" ? "aspect-[3/4]" : "aspect-[16/10]";
  return (
    <div
      className={cn("relative overflow-hidden border border-border bg-navy", aspect, className)}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 30% 15%, oklch(0.4 0.06 ${210 + hue}) 0%, oklch(0.2 0.03 258) 70%)`,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid-blueprint opacity-40" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-navy-foreground/25">
        <circle cx="50" cy="38" r="16" fill="currentColor" />
        <path d="M20 92c0-17 13.4-28 30-28s30 11 30 28Z" fill="currentColor" />
      </svg>
      <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-navy/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] text-navy-foreground/80 uppercase">
        {label ?? "Sample frame"}
      </span>
    </div>
  );
}
