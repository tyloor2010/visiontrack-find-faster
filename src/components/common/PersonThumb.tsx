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
const PORTRAITS: { src: string; gender: "Female" | "Male"; age: number }[] = [
  { src: p01, gender: "Female", age: 27 },
  { src: p02, gender: "Male", age: 40 },
  { src: p03, gender: "Male", age: 17 },
  { src: p04, gender: "Female", age: 70 },
  { src: p05, gender: "Male", age: 22 },
  { src: p06, gender: "Female", age: 42 },
  { src: p07, gender: "Female", age: 12 },
  { src: p08, gender: "Male", age: 65 },
  { src: p09, gender: "Female", age: 33 },
  { src: p10, gender: "Male", age: 52 },
  { src: p11, gender: "Female", age: 24 },
  { src: p12, gender: "Male", age: 9 },
];

function hash(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Picks a stable stand-in portrait that matches the described gender and age. */
export function portraitFor(seed: string, gender?: string, age?: number) {
  let pool = PORTRAITS;
  if (gender === "Female" || gender === "Male") {
    const byGender = PORTRAITS.filter((p) => p.gender === gender);
    if (byGender.length) pool = byGender;
  }
  if (typeof age === "number") {
    const minGap = Math.min(...pool.map((p) => Math.abs(p.age - age)));
    const close = pool.filter((p) => Math.abs(p.age - age) <= Math.max(minGap, 8));
    if (close.length) pool = close;
  }
  return pool[hash(seed) % pool.length]!.src;
}

export function PersonThumb({
  seed,
  label,
  className,
  ratio = "square",
  variant = "reference",
  gender,
  age,
}: {
  seed: string;
  label?: string;
  className?: string;
  ratio?: "square" | "portrait" | "wide";
  gender?: string;
  age?: number;
  /** `capture` renders the frame like a desaturated camera still. */
  variant?: "reference" | "capture";
}) {
  const aspect = ratio === "square" ? "aspect-square" : ratio === "portrait" ? "aspect-[3/4]" : "aspect-[16/10]";
  return (
    <div className={cn("relative overflow-hidden border border-border bg-navy", aspect, className)}>
      <img
        src={portraitFor(seed, gender, age)}
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
