import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Eyebrow, Kinetic, LightBg, Screen } from "../components/Kit";
import { INK } from "../theme";

/** Slow push into the live case table. */
export const S4Cases: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 110], [1.0, 1.16], { extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, 110], [0, -70]);
  const o = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  return (
    <LightBg>
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", perspective: 1800 }}>
        <div style={{ transform: `translateX(${340 + x}px) scale(${scale}) rotateY(-10deg)`, opacity: o }}>
          <Screen src="cases.png" width={1280} glow={false} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
        <Eyebrow text="Case management" color="rgba(11,18,32,0.45)" delay={6} />
        <div style={{ height: 22 }} />
        <Kinetic text="48 structured cases." size={82} color={INK} delay={12} maxWidth={760} />
        <div style={{ height: 16 }} />
        <Kinetic text="Filtered by status, priority, team." size={40} weight={400} color="rgba(11,18,32,0.6)" delay={26} maxWidth={720} lineHeight={1.25} />
      </AbsoluteFill>
    </LightBg>
  );
};
