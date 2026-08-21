import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DarkBg, GRADIENT_TEXT, mono, sans } from "../components/Kit";

/** Resolve: wordmark, tagline, URL. */
export const S8End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const line = interpolate(frame, [18, 54], [0, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag = interpolate(frame, [34, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = 0.25 + Math.sin(frame / 20) * 0.08;
  return (
    <DarkBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 999, background: `radial-gradient(circle, rgba(47,107,255,${glow}), transparent 62%)` }} />
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 148,
            letterSpacing: "-0.035em",
            opacity: s,
            transform: `scale(${0.94 + s * 0.06})`,
            ...GRADIENT_TEXT,
          }}
        >
          VisionTrack
        </div>
        <div style={{ width: line, height: 1, background: "linear-gradient(90deg,transparent,#31d6e0,transparent)", marginTop: 26 }} />
        <div style={{ height: 30 }} />
        <div style={{ fontFamily: mono, fontSize: 26, letterSpacing: "0.42em", textTransform: "uppercase", color: "rgba(214,231,255,0.62)", opacity: tag }}>
          See Further. Find Faster.
        </div>
        <div style={{ height: 44 }} />
        <div style={{ fontFamily: mono, fontSize: 20, color: "rgba(214,231,255,0.35)", opacity: tag }}>visiontrack-find-faster.lovable.app</div>
      </AbsoluteFill>
    </DarkBg>
  );
};
