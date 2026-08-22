import { cn } from "@/lib/utils";
import p01 from "@/assets/portraits/p01.jpg";
import p02 from "@/assets/portraits/p02.jpg";
import p03 from "@/assets/portraits/p03.jpg";
import p04 from "@/assets/portraits/p04.jpg";
import p05 from "@/assets/portraits/p05.jpg";
import p06 from "@/assets/portraits/p06.jpg";
import p07 from "@/assets/portraits/p07.jpg";
import p08 from "@/assets/portraits/p08.jpg";
import p09 from "@/assets/portraits/p09.jpg";
import p10 from "@/assets/portraits/p10.jpg";
import p11 from "@/assets/portraits/p11.jpg";
import p12 from "@/assets/portraits/p12.jpg";

/**
 * Reference imagery for the sample dataset. Portraits are model-generated
 * stand-ins — they do not depict real people or real cases.
 */
const PORTRAITS = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12];

export function portraitFor(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PORTRAITS[h % PORTRAITS.length]!;
}

export function PersonThumb({
  seed,
  label,
  className,
  ratio = "square",
  variant = "reference",
}: {
  seed: string;
  label?: string;
  className?: string;
  ratio?: "square" | "portrait" | "wide";
  /** `capture` renders the frame like a desaturated camera still. */
  variant?: "reference" | "capture";
}) {
  const aspect = ratio === "square" ? "aspect-square" : ratio === "portrait" ? "aspect-[3/4]" : "aspect-[16/10]";
  return (
    <div className={cn("relative overflow-hidden border border-border bg-navy", aspect, className)}>
      <img
        src={portraitFor(seed)}
        alt={label ?? "Reference frame"}
        loading="lazy"
        width={512}
        height={640}
        className={cn(
          "h-full w-full object-cover object-top",
          variant === "capture" && "grayscale contrast-125 brightness-90",
        )}
      />
      {variant === "capture" ? (
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(0,0,0,0.18)_3px)]" />
      ) : null}
      {label ? (
        <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-navy/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] text-navy-foreground/85 uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}
