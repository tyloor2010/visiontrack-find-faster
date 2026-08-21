import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, DarkBg, Eyebrow, Kinetic, Screen } from "../components/Kit";

/** The workspace lands: dashboard flies in on a 3D tilt. */
export const S3Product: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 26, stiffness: 90, mass: 1.2 } });
  const rotY = interpolate(s, [0, 1], [26, 6]);
  const rotX = interpolate(s, [0, 1], [14, 4]);
  const y = interpolate(s, [0, 1], [220, 0]);
  const blur = interpolate(s, [0, 0.6], [14, 0], { extrapolateRight: "clamp" });
  const float = Math.sin(frame / 46) * 10;
  return (
    <DarkBg>
      <AbsoluteFill style={{ padding: "80px 120px" }}>
        <Eyebrow text="One workspace" delay={2} />
        <div style={{ height: 18 }} />
        <Kinetic text="Every case, in one record." size={78} delay={8} maxWidth={1100} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", perspective: 2000 }}>
        <div
          style={{
            transform: `translateY(${y + float + 130}px) rotateX(${rotX}deg) rotateY(${-rotY}deg) scale(1.02)`,
            filter: `blur(${blur}px)`,
            opacity: s,
          }}
        >
          <Screen src="dashboard.png" width={1420} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 120, top: 300, display: "flex", flexDirection: "column", gap: 18 }}>
        <Chip label="Active cases" value="27" delay={40} />
        <Chip label="Potential matches" value="23" delay={50} accent="#8b5cf6" />
        <Chip label="Evidence items" value="203" delay={60} accent="#2f6bff" />
      </div>
    </DarkBg>
  );
};
