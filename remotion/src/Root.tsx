import { Composition } from "remotion";
import { MainVideo, TOTAL } from "./MainVideo";
import { MonoVideo, MONO_TOTAL } from "./MonoVideo";

export const RemotionRoot = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="mono" component={MonoVideo} durationInFrames={MONO_TOTAL} fps={30} width={1920} height={1080} />
  </>
);
