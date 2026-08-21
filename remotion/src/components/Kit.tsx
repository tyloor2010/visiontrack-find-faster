import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { BLUE, CYAN, LIGHT, NAVY, VIOLET } from "../theme";

export const sans = loadSans("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/** Dark cinematic backdrop with drifting colour fields. */
export const DarkBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const d = Math.sin(frame / 90) * 40;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60rem 34rem at ${22 + d / 10}% 18%, rgba(47,107,255,0.28), transparent 62%),
                       radial-gradient(52rem 30rem at 82% ${22 + d / 12}%, rgba(139,92,246,0.24), transparent 62%),
                       radial-gradient(58rem 32rem at 48% 104%, rgba(49,214,224,0.18), transparent 60%)`,
        }}
      />
      <Grid opacity={0.16} />
      {children}
    </AbsoluteFill>
  );
};

export const LightBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const d = Math.sin(frame / 110) * 30;
  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(52rem 30rem at ${18 + d / 12}% 88%, rgba(47,107,255,0.18), transparent 60%),
                       radial-gradient(46rem 26rem at 88% 12%, rgba(139,92,246,0.14), transparent 62%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Grid: React.FC<{ opacity?: number; color?: string }> = ({ opacity = 0.2, color = "rgba(140,180,230,0.18)" }) => {
  const frame = useCurrentFrame();
  const off = (frame * 0.35) % 72;
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        backgroundPosition: `${off}px ${off}px`,
      }}
    />
  );
};

/** Kinetic word-by-word type reveal: blur + rise + slight scale. */
export const Kinetic: React.FC<{
  text: string;
  size?: number;
  color?: string;
  accent?: string;
  accentFrom?: number;
  delay?: number;
  weight?: number;
  align?: "left" | "center";
  maxWidth?: number;
  lineHeight?: number;
}> = ({ text, size = 120, color = "#fff", accent, accentFrom = 999, delay = 0, weight = 700, align = "left", maxWidth = 1500, lineHeight = 1.02 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `0 ${size * 0.24}px`,
        maxWidth,
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: sans,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.03em",
      }}
    >
      {words.map((w, i) => {
        const f = frame - delay - i * 4;
        const s = spring({ frame: f, fps, config: { damping: 22, stiffness: 130, mass: 0.9 } });
        const blur = interpolate(s, [0, 1], [16, 0]);
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              color: i >= accentFrom && accent ? accent : color,
              opacity: s,
              filter: `blur(${blur}px)`,
              transform: `translateY(${(1 - s) * size * 0.42}px) scale(${0.94 + s * 0.06})`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Eyebrow: React.FC<{ text: string; color?: string; delay?: number }> = ({ text, color = "rgba(255,255,255,0.5)", delay = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.42em", textTransform: "uppercase", color, opacity: o }}>
      {text}
    </div>
  );
};

/** App screenshot inside a product window frame. */
export const Screen: React.FC<{
  src: string;
  width: number;
  style?: React.CSSProperties;
  glow?: boolean;
  crop?: { scale?: number; x?: number; y?: number };
}> = ({ src, width, style, glow = true, crop }) => {
  const h = (width / 1600) * 1000;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: 22,
        overflow: "hidden",
        background: "#0b111f",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: glow
          ? "0 60px 140px rgba(4,10,25,0.65), 0 0 0 1px rgba(47,107,255,0.18), 0 0 90px rgba(47,107,255,0.22)"
          : "0 40px 90px rgba(4,10,25,0.45)",
        ...style,
      }}
    >
      <div style={{ height: 34, background: "linear-gradient(180deg,#151d2e,#101827)", display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c, opacity: 0.85 }} />
        ))}
      </div>
      <div style={{ width: "100%", height: h - 34, overflow: "hidden" }}>
        <Img
          src={staticFile(`shots/${src}`)}
          style={{
            width: "100%",
            display: "block",
            transform: `scale(${crop?.scale ?? 1}) translate(${crop?.x ?? 0}%, ${crop?.y ?? 0}%)`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
};

export const Chip: React.FC<{ label: string; value: string; delay?: number; accent?: string }> = ({ label, value, delay = 0, accent = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 24}px)`,
        background: "rgba(10,17,30,0.72)",
        border: `1px solid ${accent}55`,
        borderRadius: 16,
        padding: "18px 26px",
        backdropFilter: "none",
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 15, letterSpacing: "0.28em", textTransform: "uppercase", color: `${accent}` }}>{label}</div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 44, color: "#fff", lineHeight: 1.15 }}>{value}</div>
    </div>
  );
};

export const GRADIENT_TEXT: React.CSSProperties = {
  backgroundImage: `linear-gradient(92deg, ${BLUE}, ${VIOLET} 45%, ${CYAN})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
