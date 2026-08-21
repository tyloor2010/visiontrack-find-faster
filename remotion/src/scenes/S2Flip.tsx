import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Eyebrow, GRADIENT_TEXT, Kinetic, LightBg, sans } from "../components/Kit";
import { INK } from "../theme";

/** Light flip: the brand promise in oversized editorial type. */
export const S2Flip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 26, fps, config: { damping: 200 } });
  const drift = interpolate(frame, [0, 110], [40, -30]);
  return (
    <LightBg>
      <AbsoluteFill style={{ padding: "0 150px", justifyContent: "center" }}>
        <Eyebrow text="See further" color="rgba(11,18,32,0.45)" delay={4} />
        <div style={{ height: 30 }} />
        <Kinetic text="See Further." size={158} color={INK} delay={8} />
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 158, letterSpacing: "-0.03em", lineHeight: 1.02, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, ...GRADIENT_TEXT }}>
          Find Faster.
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: -180 + drift * 0.4,
          top: 120 + drift,
          width: 620,
          height: 620,
          borderRadius: 999,
          background: "radial-gradient(circle at 35% 30%, rgba(47,107,255,0.35), rgba(139,92,246,0.18) 55%, transparent 70%)",
        }}
      />
    </LightBg>
  );
};
