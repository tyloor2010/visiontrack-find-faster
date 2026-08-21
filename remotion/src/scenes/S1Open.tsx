import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DarkBg, Eyebrow, Kinetic, GRADIENT_TEXT, mono } from "../components/Kit";

/** Opening hook: statement type on a dark, drifting field. */
export const S1Open: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 100], [1.06, 1], { extrapolateRight: "clamp" });
  const rule = interpolate(frame, [24, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <DarkBg>
      <AbsoluteFill style={{ transform: `scale(${push})`, padding: "0 150px", justifyContent: "center" }}>
        <Eyebrow text="VisionTrack" delay={4} />
        <div style={{ height: 34 }} />
        <Kinetic text="Every hour" size={132} delay={10} />
        <Kinetic text="matters." size={132} delay={22} accent="#fff" />
        <div style={{ height: 46 }} />
        <div style={{ width: 1180 * rule, height: 1, background: "linear-gradient(90deg,#2f6bff,#8b5cf6,transparent)" }} />
        <div style={{ height: 30 }} />
        <div style={{ fontFamily: mono, fontSize: 26, color: "rgba(214,231,255,0.62)", opacity: rule, letterSpacing: "0.04em" }}>
          A missing-person search runs on <span style={GRADIENT_TEXT}>fragments</span>.
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};
