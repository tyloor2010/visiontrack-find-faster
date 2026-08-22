import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

const sans = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const INK = "#0b0b0b";
const PAPER = "#f6f6f4";

export const SWARM_TOTAL = 700;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------------------------------------------------------------- grid */

const Grid: React.FC<{ dark?: boolean; progress: number }> = ({ dark, progress }) => {
  const c = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.16)";
  const xs = [0.18, 0.38, 0.62, 0.82];
  const ys = [0.22, 0.5, 0.78];
  return (
    <AbsoluteFill>
      {xs.map((x, i) => (
        <div
          key={`x${x}`}
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: 0,
            width: 1,
            height: `${interpolate(progress, [0, 1], [0, 100], { extrapolateRight: "clamp" })}%`,
            background: c,
            opacity: 1 - i * 0.08,
          }}
        />
      ))}
      {ys.map((y) => (
        <div
          key={`y${y}`}
          style={{
            position: "absolute",
            top: `${y * 100}%`,
            left: 0,
            height: 1,
            width: `${interpolate(progress, [0.2, 1.2], [0, 100], { extrapolateRight: "clamp" })}%`,
            background: c,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- S1 dot */

const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const size = interpolate(s, [0, 1], [6, 26]);
  const breathe = 1 + Math.sin(frame / 8) * 0.06;
  const out = interpolate(frame, [34, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: size * breathe,
          height: size * breathe,
          borderRadius: "50%",
          background: PAPER,
          opacity: out,
          boxShadow: `0 0 ${40 * out}px rgba(255,255,255,0.35)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ S2 swarm */

const DOTS = 130;

const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = 540;

  // 0 -> chaotic cloud, 1 -> spiral rosette
  const form = interpolate(frame, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const collapse = interpolate(frame, [86, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spin = frame * 0.6;

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <svg width={1920} height={1080}>
        {new Array(DOTS).fill(0).map((_, i) => {
          const a = random(`a${i}`) * Math.PI * 2;
          const rr = 90 + random(`r${i}`) * 300;
          const chaosX = cx + Math.cos(a) * rr * 1.4;
          const chaosY = cy + Math.sin(a) * rr;

          const golden = i * 2.399963;
          const rad = 40 + Math.sqrt(i / DOTS) * 300;
          const tx = cx + Math.cos(golden + spin / 60) * rad;
          const ty = cy + Math.sin(golden + spin / 60) * rad;

          const p = ease(Math.min(1, Math.max(0, form - (i / DOTS) * 0.25) / 0.75));
          let x = interpolate(p, [0, 1], [chaosX, tx]);
          let y = interpolate(p, [0, 1], [chaosY, ty]);
          // collapse into solid disc
          x = interpolate(ease(collapse), [0, 1], [x, cx + Math.cos(golden) * rad * 0.55]);
          y = interpolate(ease(collapse), [0, 1], [y, cy + Math.sin(golden) * rad * 0.55]);

          const r = interpolate(ease(collapse), [0, 1], [2 + random(`s${i}`) * 7, 12]);
          return <circle key={i} cx={x} cy={y} r={r} fill={INK} />;
        })}
        <circle
          cx={cx}
          cy={cy}
          r={interpolate(ease(collapse), [0, 1], [180, 250])}
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
          opacity={collapse}
        />
      </svg>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- S3 wordmark */

const Wordmark: React.FC<{ text: string; dark?: boolean; size?: number }> = ({ text, dark, size = 130 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", fontFamily: sans, fontWeight: 500, fontSize: size, letterSpacing: -4, color: dark ? PAPER : INK }}>
      {text.split("").map((ch, i) => {
        const s = spring({ frame: frame - i * 2.2, fps, config: { damping: 200 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
              filter: `blur(${interpolate(s, [0, 1], [10, 0])}px)`,
            }}
          >
            {ch === " " ? "\u00a0" : ch}
          </span>
        );
      })}
    </div>
  );
};

const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [48, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, alignItems: "center", justifyContent: "center", opacity: out }}>
      <Wordmark text="VisionTrack" />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- S4 "Scanning" */

const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const word = "Scanning...";
  const shown = Math.min(word.length, Math.floor(interpolate(frame, [0, 30], [0, word.length], { extrapolateRight: "clamp" })));
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: sans, fontSize: 96, fontWeight: 500, letterSpacing: -3, color: INK }}>
        {word.split("").map((ch, i) => (
          <span key={i} style={{ opacity: i < shown ? (i < 4 ? 1 : 0.42) : 0 }}>
            {ch}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 26, fontFamily: mono, fontSize: 18, letterSpacing: 2, color: "rgba(0,0,0,0.4)" }}>
        1,248 EVIDENCE ITEMS · 48 ACTIVE CASES
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- S5 report streaming */

const REPORT = `Case VT-2041 — Visual Identification Summary
1. Reference set
Three authorized reference photographs, front and three-quarter angles.
2. Evidence processed
— 214 CCTV frames, Maadi corridor, 18:40–21:10
— 36 public submissions, deduplicated to 21 unique items
— 8 field photographs from search team Delta
3. Candidate ranking
— C-118  similarity 0.94  frame 18:52  Road 9 junction
— C-097  similarity 0.88  frame 19:31  metro entrance
— C-052  similarity 0.71  frame 20:04  bus terminal
4. Review status
Two candidates escalated to investigator review. No identity confirmed
by the system — every decision is recorded against a named reviewer.
5. Next actions
Extend search radius to 4 km. Request operator footage 21:10–23:00.
Notify family liaison with the reviewed summary at shift handover.`;

const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [12, 150], [0, REPORT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const scroll = interpolate(frame, [40, 170], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circle = spring({ frame: frame - 6, fps: 30, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <Grid progress={interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" })} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 150 }}>
        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: "50%",
            border: `1.5px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: sans,
            fontSize: 22,
            color: INK,
            transform: `scale(${interpolate(circle, [0, 1], [0.6, 1])})`,
            opacity: circle,
          }}
        >
          Instant
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "18%",
          right: "18%",
          top: 470,
          height: 610,
          overflow: "hidden",
        }}
      >
        <pre
          style={{
            margin: 0,
            transform: `translateY(${-scroll}px)`,
            fontFamily: sans,
            fontSize: 21,
            lineHeight: 1.55,
            color: INK,
            whiteSpace: "pre-wrap",
          }}
        >
          {REPORT.slice(0, chars)}
        </pre>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- S6 prompt */

const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const q = "Find every candidate match for case VT-2041";
  const shown = Math.floor(interpolate(frame, [10, 55], [0, q.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const glow = interpolate(frame, [0, 60], [0.25, 0.85], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 620px at 50% 118%, rgba(14,165,233,${glow * 0.55}) 0%, rgba(10,15,30,0) 70%)`,
        }}
      />
      <Grid dark progress={interpolate(frame, [6, 34], [0, 1], { extrapolateRight: "clamp" })} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 980,
            padding: "26px 30px",
            borderRadius: 999,
            background: PAPER,
            display: "flex",
            alignItems: "center",
            gap: 18,
            transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
            opacity: s,
          }}
        >
          <span style={{ fontFamily: sans, fontSize: 30, color: "rgba(0,0,0,0.45)" }}>+</span>
          <span style={{ fontFamily: sans, fontSize: 27, color: INK, flex: 1 }}>
            {q.slice(0, shown)}
            <span style={{ opacity: frame % 20 < 10 ? 1 : 0 }}>|</span>
          </span>
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: INK,
              color: PAPER,
              fontFamily: sans,
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ↑
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- S7 always */

const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const words = ["faster", "clearer", "always"];
  const idx = Math.min(words.length - 1, Math.floor(frame / 22));
  const r = interpolate(s, [0, 1], [80, 175]);
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <Grid dark progress={1} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: PAPER,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: sans,
            fontSize: 44,
            color: INK,
          }}
        >
          {words[idx]}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- S8 end */

const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Wordmark text="VisionTrack" size={150} />
      <div style={{ height: 1, width: `${line * 44}%`, background: "rgba(0,0,0,0.25)", marginTop: 34 }} />
      <div
        style={{
          marginTop: 28,
          fontFamily: mono,
          fontSize: 20,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.55)",
          opacity: line,
        }}
      >
        See further. Find faster.
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- assembly */

export const SwarmVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PAPER }}>
    <Sequence from={0} durationInFrames={46}>
      <S1 />
    </Sequence>
    <Sequence from={46} durationInFrames={122}>
      <S2 />
    </Sequence>
    <Sequence from={168} durationInFrames={62}>
      <S3 />
    </Sequence>
    <Sequence from={230} durationInFrames={56}>
      <S4 />
    </Sequence>
    <Sequence from={286} durationInFrames={176}>
      <S5 />
    </Sequence>
    <Sequence from={462} durationInFrames={74}>
      <S6 />
    </Sequence>
    <Sequence from={536} durationInFrames={70}>
      <S7 />
    </Sequence>
    <Sequence from={606} durationInFrames={94}>
      <S8 />
    </Sequence>
  </AbsoluteFill>
);
