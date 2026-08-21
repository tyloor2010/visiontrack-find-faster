import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DarkBg, Kinetic, Screen } from "../components/Kit";

const COLS: string[][] = [
  ["dashboard.png", "cases.png", "alerts.png"],
  ["search.png", "reports.png", "evidence.png"],
  ["map.png", "landing.png", "tech.png"],
  ["how.png", "dashboard.png", "search.png"],
];

/** Wall of real product screens drifting diagonally past camera. */
export const S7Wall: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <DarkBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2400 }}>
        <div style={{ display: "flex", gap: 60, transform: "rotateX(12deg) rotateZ(-8deg) scale(1.15)", opacity: o }}>
          {COLS.map((col, ci) => {
            const speed = 0.9 + ci * 0.35;
            const y = ((frame * speed) % 1400) - 700;
            return (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 48, transform: `translateY(${ci % 2 === 0 ? -y : y}px)` }}>
                {col.map((src, i) => (
                  <Screen key={`${src}-${i}`} src={src} width={560} glow={false} />
                ))}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 55% at 50% 50%, rgba(8,13,24,0.15), rgba(8,13,24,0.92) 80%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Kinetic text="Built for the whole team." size={92} delay={12} align="center" maxWidth={1200} />
      </AbsoluteFill>
    </DarkBg>
  );
};
