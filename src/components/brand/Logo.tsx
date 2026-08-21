import { cn } from "@/lib/utils";

/**
 * VisionTrack mark — an eye aperture whose pupil is a location pin,
 * crossed by a tracking path.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
      fill="none"
      strokeLinecap="square"
    >
      <path
        d="M2 16c4.2-5.6 8.9-8.4 14-8.4S25.8 10.4 30 16c-4.2 5.6-8.9 8.4-14 8.4S6.2 21.6 2 16Z"
        stroke="currentColor"
        strokeWidth="1.7"
        opacity="0.55"
      />
      <path
        d="M16 10.6c2.6 0 4.7 2.05 4.7 4.58 0 3.16-3.35 6.3-4.36 7.17a.53.53 0 0 1-.68 0c-1.01-.87-4.36-4.01-4.36-7.17 0-2.53 2.1-4.58 4.7-4.58Z"
        fill="currentColor"
      />
      <circle cx="16" cy="15.1" r="1.55" className="fill-background" />
      <path d="M1 27h7.5l4-3.2 4 3.2H31" stroke="currentColor" strokeWidth="1.7" strokeDasharray="3 2.4" opacity="0.75" />
    </svg>
  );
}

export function Logo({
  className,
  variant = "default",
  showTagline = false,
}: {
  className?: string;
  variant?: "default" | "inverted";
  showTagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={variant === "inverted" ? "text-primary" : "text-primary"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            variant === "inverted" ? "text-navy-foreground" : "text-foreground",
          )}
        >
          Vision<span className="text-primary">Track</span>
        </span>
        {showTagline ? (
          <span className="eyebrow mt-1 text-muted-foreground">See Further. Find Faster.</span>
        ) : null}
      </span>
    </span>
  );
}
