import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { Storyboard } from "./reels/website-sekunde/Storyboard";
import { StiltestHook, STILTEST_DAUER } from "./reels/website-sekunde/StiltestHook";

export const Root: React.FC = () => (
  <>
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Storyboard" component={Storyboard} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ szene: 1 }} />
    <Composition id="StiltestHook" component={StiltestHook} durationInFrames={STILTEST_DAUER} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ mitStimme: false }} />
  </>
);
