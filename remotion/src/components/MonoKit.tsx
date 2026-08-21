import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

export const sansM = loadSans("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily;
export const monoM = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const BLACK = "#0a0a0a";
export const WHITE = "#f7f7f7";

/** Flat monochrome canvas. */
export const Mono: React.FC<{ dark?: boolean; children?: React.ReactNode; grain?: boolean }> = ({ dark = true, children, grain = true }) => (
  <AbsoluteFill style={{ backgroundColor: dark ? BLACK : WHITE }}>
    {grain ? <MonoGrid dark={dark} /> : null}
    {children}
  </AbsoluteFill>
);

export const MonoGrid: React.FC<{ dark?: boolean; opacity?: number }> = ({ dark = true, opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  const off = (frame * 0.5) % 80;
  const c = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)";
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        backgroundPosition: `${off}px ${off}px`,
      }}
    />
  );
};

/**
 * Kinetic headline. Words wrapped in [brackets] render as an inverted
 * highlight box that snaps open — the reference ad's signature move.
 */
export const Punch: React.FC<{
  text: string;
  size?: number;
  dark?: boolean;
  delay?: number;
  stagger?: number;
  align?: "left" | "center";
  maxWidth?: number;
  lineHeight?: number;
}> = ({ text, size = 120, dark = true, delay = 0, stagger = 4, align = "left", maxWidth = 1560, lineHeight = 1.0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fg = dark ? WHITE : BLACK;
  const bg = dark ? BLACK : WHITE;
  // Tokens: a [bracketed phrase] stays one token so it renders as one box.
  const words = text.match(/\[[^\]]+\]|\S+/g) ?? [];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: `${size * 0.14}px ${size * 0.2}px`,
        maxWidth,
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: sansM,
        fontWeight: 700,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.045em",
      }}
    >
      {words.map((raw, i) => {
        const boxed = raw.startsWith("[") && raw.endsWith("]");
        const w = boxed ? raw.slice(1, -1) : raw;
        const f = frame - delay - i * stagger;
        const s = spring({ frame: f, fps, config: { damping: 20, stiffness: 190, mass: 0.7 } });
        if (boxed) {
          return (
            <span
              key={`${w}-${i}`}
              style={{
                display: "inline-block",
                background: fg,
                color: bg,
                padding: `${size * 0.06}px ${size * 0.14}px`,
                transform: `scaleX(${s}) translateY(${(1 - s) * 8}px)`,
                transformOrigin: "left center",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ opacity: interpolate(s, [0.55, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{w}</span>
            </span>
          );
        }
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              color: fg,
              opacity: s,
              filter: `blur(${interpolate(s, [0, 1], [14, 0])}px)`,
              transform: `translateY(${(1 - s) * size * 0.38}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Label: React.FC<{ text: string; dark?: boolean; delay?: number; size?: number }> = ({ text, dark = true, delay = 0, size = 22 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: monoM,
        fontSize: size,
        letterSpacing: "0.44em",
        textTransform: "uppercase",
        color: dark ? "rgba(247,247,247,0.55)" : "rgba(10,10,10,0.5)",
        opacity: o,
      }}
    >
      {text}
    </div>
  );
};

/** Product screenshot, fully desaturated + punched contrast, in a mono frame. */
export const MonoScreen: React.FC<{
  src: string;
  width: number;
  dark?: boolean;
  crop?: { scale?: number; x?: number; y?: number };
  chrome?: boolean;
  style?: React.CSSProperties;
}> = ({ src, width, dark = true, crop, chrome = true, style }) => {
  const h = (width / 1600) * 1000;
  const bar = chrome ? 34 : 0;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: 18,
        overflow: "hidden",
        background: dark ? "#111" : "#fff",
        border: `1px solid ${dark ? "rgba(247,247,247,0.22)" : "rgba(10,10,10,0.18)"}`,
        boxShadow: dark ? "0 50px 120px rgba(0,0,0,0.7)" : "0 40px 90px rgba(0,0,0,0.28)",
        ...style,
      }}
    >
      {chrome ? (
        <div style={{ height: bar, background: dark ? "#171717" : "#e9e9e9", display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: 99, background: dark ? "rgba(247,247,247,0.4)" : "rgba(10,10,10,0.28)" }} />
          ))}
        </div>
      ) : null}
      <div style={{ width: "100%", height: h - bar, overflow: "hidden" }}>
        <Img
          src={staticFile(`shots/${src}`)}
          style={{
            width: "100%",
            display: "block",
            filter: "grayscale(1) contrast(1.14) brightness(1.02)",
            transform: `scale(${crop?.scale ?? 1}) translate(${crop?.x ?? 0}%, ${crop?.y ?? 0}%)`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
};

/** Hard white flash used on cuts. */
export const Flash: React.FC<{ at: number; len?: number }> = ({ at, len = 5 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + len], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: WHITE, opacity: o }} />;
};
