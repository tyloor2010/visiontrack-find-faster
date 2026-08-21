import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { S1Open } from "./scenes/S1Open";
import { S2Flip } from "./scenes/S2Flip";
import { S3Product } from "./scenes/S3Product";
import { S4Cases } from "./scenes/S4Cases";
import { S5Search } from "./scenes/S5Search";
import { S6Map } from "./scenes/S6Map";
import { S7Wall } from "./scenes/S7Wall";
import { S8End } from "./scenes/S8End";
import { NAVY } from "./theme";

const D = [96, 96, 132, 120, 132, 120, 108, 120];
const T = [18, 20, 16, 18, 20, 16, 22];
export const TOTAL = D.reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D[0]!}>
        <S1Open />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T[0]! })} />
      <TransitionSeries.Sequence durationInFrames={D[1]!}>
        <S2Flip />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T[1]! })} />
      <TransitionSeries.Sequence durationInFrames={D[2]!}>
        <S3Product />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T[2]! })} />
      <TransitionSeries.Sequence durationInFrames={D[3]!}>
        <S4Cases />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T[3]! })} />
      <TransitionSeries.Sequence durationInFrames={D[4]!}>
        <S5Search />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T[4]! })} />
      <TransitionSeries.Sequence durationInFrames={D[5]!}>
        <S6Map />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T[5]! })} />
      <TransitionSeries.Sequence durationInFrames={D[6]!}>
        <S7Wall />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T[6]! })} />
      <TransitionSeries.Sequence durationInFrames={D[7]!}>
        <S8End />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
