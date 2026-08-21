import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DarkBg, Eyebrow, Kinetic, Screen } from "../components/Kit";

/** Spatial layer: map workspace drifting with parallax. */
export const S6Map: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, 120], [120, -60]);
  const back = interpolate(frame, [0, 120], [-40, 40]);
  return (
    <DarkBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2200 }}>
        <div style={{ position: "absolute", transform: `translate(${back * 3}px, -180px) scale(0.62) rotateY(12deg)`, opacity: 0.35 * o, filter: "blur(4px)" }}>
          <Screen src="evidence.png" width={1200} glow={false} />
        </div>
        <div style={{ transform: `translate(${x}px, 90px) rotateY(-8deg) rotateX(4deg)`, opacity: o }}>
          <Screen src="map.png" width={1340} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: "78px 120px" }}>
        <Eyebrow text="Locations & evidence" delay={2} />
        <div style={{ height: 16 }} />
        <Kinetic text="Where the search actually is." size={72} delay={8} maxWidth={1000} />
      </AbsoluteFill>
    </DarkBg>
  );
};
