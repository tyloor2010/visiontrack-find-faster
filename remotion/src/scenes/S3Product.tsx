import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, DarkBg, Eyebrow, Kinetic, Screen } from "../components/Kit";

/** The workspace lands: dashboard flies in on a 3D tilt, stats read on the left. */
export const S3Product: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 26, stiffness: 90, mass: 1.2 } });
  const rotY = interpolate(s, [0, 1], [26, 11]);
  const rotX = interpolate(s, [0, 1], [14, 5]);
  const x = interpolate(s, [0, 1], [420, 250]);
  const blur = interpolate(s, [0, 0.6], [14, 0], { extrapolateRight: "clamp" });
  const float = Math.sin(frame / 46) * 10;
  return (
    <DarkBg>
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", perspective: 2000 }}>
        <div
          style={{
            transform: `translate(${x}px, ${float + 60}px) rotateX(${rotX}deg) rotateY(${-rotY}deg)`,
            filter: `blur(${blur}px)`,
            opacity: s,
          }}
        >
          <Screen src="dashboard.png" width={1220} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "0 120px", justifyContent: "center" }}>
        <Eyebrow text="One workspace" delay={2} />
        <div style={{ height: 18 }} />
        <Kinetic text="Every case, in one record." size={72} delay={8} maxWidth={640} lineHeight={1.06} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 16 }}>
          <Chip label="Cases" value="27" delay={40} />
          <Chip label="Matches" value="23" delay={50} accent="#8b5cf6" />
          <Chip label="Evidence" value="203" delay={60} accent="#2f6bff" />
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};
