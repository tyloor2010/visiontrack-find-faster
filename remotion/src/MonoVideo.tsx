import React from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLACK, Flash, Label, Mono, MonoScreen, Punch, WHITE, monoM, sansM } from "./components/MonoKit";

export const MONO_TOTAL = 726; // 24.2s @ 30fps — matches the soundtrack

/* ------------------------------------------------------------------ 1 */
const M1: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, 66], [1.06, 1.0]);
  return (
    <Mono dark={false}>
      <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center", transform: `scale(${k})` }}>
        <Label text="VisionTrack" dark={false} delay={0} />
        <div style={{ height: 26 }} />
        <Punch text="Someone [is missing]" size={140} dark={false} delay={6} />
        <div style={{ height: 30 }} />
        <Punch text="right now." size={140} dark={false} delay={26} />
      </AbsoluteFill>
      <Flash at={58} len={6} />
    </Mono>
  );
};

/* ------------------------------------------------------------------ 2 */
const M2: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 60], [700, -900]);
  const y = interpolate(frame, [0, 60], [-260, 240]);
  return (
    <Mono dark>
      <AbsoluteFill style={{ justifyContent: "center", overflow: "hidden" }}>
        <div
          style={{
            fontFamily: sansM,
            fontWeight: 700,
            fontSize: 300,
            letterSpacing: "-0.06em",
            color: WHITE,
            whiteSpace: "nowrap",
            transform: `translate(${x}px, -110px)`,
          }}
        >
          EVERY HOUR EVERY HOUR
        </div>
        <div
          style={{
            fontFamily: sansM,
            fontWeight: 700,
            fontSize: 300,
            letterSpacing: "-0.06em",
            color: "transparent",
            WebkitTextStroke: `2px rgba(247,247,247,0.55)`,
            whiteSpace: "nowrap",
            transform: `translate(${-x}px, ${y - 120}px)`,
          }}
        >
          MATTERS MATTERS MATTERS
        </div>
      </AbsoluteFill>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 3 */
const M3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 20, stiffness: 120, mass: 1.1 } });
  const y = interpolate(s, [0, 1], [520, 120]);
  const rot = interpolate(s, [0, 1], [10, 2]);
  return (
    <Mono dark={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", perspective: 2000 }}>
        <div style={{ transform: `translateY(${y}px) rotateX(${rot}deg) scale(${0.9 + s * 0.1})`, opacity: s }}>
          <MonoScreen src="dashboard.png" width={1420} dark={false} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "70px 130px" }}>
        <Punch text="One [workspace.]" size={104} dark={false} delay={16} />
      </AbsoluteFill>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 4 */
const M4: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = interpolate(frame, [0, 78], [1.9, 2.25]);
  const ty = interpolate(frame, [0, 78], [-14, -22]);
  return (
    <Mono dark>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <MonoScreen src="cases.png" width={1760} dark chrome={false} crop={{ scale: sc, x: -12, y: ty }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.85), transparent 38%, transparent 62%, rgba(10,10,10,0.9))" }} />
      <AbsoluteFill style={{ padding: "70px 130px", justifyContent: "space-between" }}>
        <Label text="Case management" delay={2} />
        <Punch text="48 cases. [Zero guesswork.]" size={92} dark delay={8} maxWidth={1400} />
      </AbsoluteFill>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 5 */
const M5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const sweep = Math.min(1, ((frame - 14) % 46) / 46);
  const inv = frame > 70 && frame < 76;
  return (
    <Mono dark={!inv}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", opacity: s, transform: `scale(${0.94 + s * 0.06}) translateY(${(1 - s) * 60 - 20}px)` }}>
          <MonoScreen src="search.png" width={1240} dark={!inv} />
          {frame > 12 ? (
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${sweep * 100}%`,
                  width: 6,
                  background: inv ? BLACK : WHITE,
                  boxShadow: `0 0 60px 24px ${inv ? "rgba(10,10,10,0.35)" : "rgba(247,247,247,0.35)"}`,
                }}
              />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "62px 130px" }}>
        <Punch text="Compare. Rank. [Review.]" size={84} dark={!inv} delay={6} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 130, bottom: 54, fontFamily: monoM, fontSize: 26, letterSpacing: "0.2em", color: inv ? BLACK : "rgba(247,247,247,0.6)" }}>
        1,264 CANDIDATES · 87% TOP SIMILARITY · HUMAN REVIEW ALWAYS
      </div>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 6 */
const M6: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = interpolate(frame, [0, 78], [1.55, 1.95]);
  const pulse = 0.35 + Math.abs(Math.sin(frame / 12)) * 0.55;
  return (
    <Mono dark={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <MonoScreen src="map.png" width={1700} dark={false} chrome={false} crop={{ scale: sc, x: -18, y: -20 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 260, height: 260, borderRadius: 999, border: `3px solid ${BLACK}`, opacity: pulse, transform: `scale(${0.7 + pulse * 0.5})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "70px 130px", justifyContent: "flex-end" }}>
        <Punch text="Every [location]" size={96} dark={false} delay={6} />
        <div style={{ height: 22 }} />
        <Punch text="on one map." size={96} dark={false} delay={20} />
      </AbsoluteFill>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 7 */
const COLS = [
  ["evidence.png", "alerts.png", "reports.png"],
  ["dashboard.png", "search.png", "cases.png"],
  ["map.png", "tech.png", "how.png"],
  ["landing.png", "reports.png", "evidence.png"],
];
const M7: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 84], [1.35, 1.05]);
  return (
    <Mono dark>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2400 }}>
        <div style={{ display: "flex", gap: 54, transform: `rotateX(14deg) rotateZ(-9deg) scale(${z})` }}>
          {COLS.map((col, ci) => {
            const speed = 1.1 + ci * 0.4;
            const y = ((frame * speed) % 1500) - 750;
            return (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 44, transform: `translateY(${ci % 2 === 0 ? -y : y}px)` }}>
                {col.map((src, i) => (
                  <MonoScreen key={`${src}-${i}`} src={src} width={560} dark />
                ))}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(58% 52% at 50% 50%, rgba(10,10,10,0.1), rgba(10,10,10,0.94) 78%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Punch text="Evidence. Alerts. Teams. [Reports.]" size={86} dark delay={8} align="center" maxWidth={1350} />
      </AbsoluteFill>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 8 */
const M8: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = frame % 16 < 8;
  return (
    <Mono dark={flip} grain={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
        <Punch text="This is how we [search now.]" size={130} dark={flip} delay={2} align="center" maxWidth={1500} lineHeight={1.06} />
      </AbsoluteFill>
    </Mono>
  );
};

/* ------------------------------------------------------------------ 9 */
const M9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const line = interpolate(frame, [22, 60], [0, 720], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag = interpolate(frame, [40, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [86, 102], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Mono dark>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
        <div style={{ fontFamily: sansM, fontWeight: 700, fontSize: 156, letterSpacing: "-0.05em", color: WHITE, opacity: s, transform: `scale(${0.95 + s * 0.05})` }}>
          VisionTrack
        </div>
        <div style={{ width: line, height: 2, background: WHITE, marginTop: 24 }} />
        <div style={{ height: 34 }} />
        <div style={{ fontFamily: monoM, fontSize: 28, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(247,247,247,0.7)", opacity: tag }}>
          See Further. Find Faster.
        </div>
        <div style={{ height: 42 }} />
        <div style={{ fontFamily: monoM, fontSize: 20, color: "rgba(247,247,247,0.4)", opacity: tag }}>visiontrack-find-faster.lovable.app</div>
      </AbsoluteFill>
    </Mono>
  );
};

const SCENES: [React.FC, number][] = [
  [M1, 66],
  [M2, 60],
  [M3, 96],
  [M4, 78],
  [M5, 96],
  [M6, 78],
  [M7, 84],
  [M8, 66],
  [M9, 102],
];

export const MonoVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BLACK }}>
    <Series>
      {SCENES.map(([C, d], i) => (
        <Series.Sequence key={i} durationInFrames={d}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
