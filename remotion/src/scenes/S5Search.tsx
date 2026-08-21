import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, DarkBg, Eyebrow, Kinetic, Screen } from "../components/Kit";

/** The core: visual search comparison with a scanning sweep. */
export const S5Search: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 24, stiffness: 110 } });
  const sweep = ((frame - 20) / 55) % 1;
  return (
    <DarkBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2000 }}>
        <div style={{ transform: `translateY(${(1 - s) * 90 - 30}px) scale(${0.92 + s * 0.08}) rotateX(${(1 - s) * 10}deg)`, opacity: s, position: "relative" }}>
          <Screen src="search.png" width={1180} />
          {frame > 20 ? (
            <div style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden", pointerEvents: "none" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${sweep * 100}%`,
                  width: 240,
                  transform: "translateX(-50%)",
                  background: "linear-gradient(90deg, transparent, rgba(49,214,224,0.28), transparent)",
                }}
              />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "62px 120px" }}>
        <Eyebrow text="Visual search" delay={2} />
        <div style={{ height: 14 }} />
        <Kinetic text="Compare. Rank. Review." size={62} delay={8} accent="#31d6e0" accentFrom={2} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 46, display: "flex", gap: 16, justifyContent: "space-between" }}>
        <Chip label="Candidates" value="1,264" delay={44} />
        <Chip label="Top similarity" value="87%" delay={54} accent="#8b5cf6" />
        <Chip label="Human review" value="Always required" delay={64} accent="#2f6bff" />
      </div>
    </DarkBg>
  );
};
