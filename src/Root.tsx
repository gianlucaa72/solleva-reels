import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { Storyboard, STORYBOARD_DAUER } from "./reels/r01-unsichtbar/Storyboard";
import { ReelA, ReelB, ReelFinal, REEL_DAUER } from "./reels/r01-unsichtbar/Reel";

export const Root: React.FC = () => (
  <>
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R01-Storyboard" component={Storyboard} durationInFrames={STORYBOARD_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R01-A" component={ReelA} durationInFrames={REEL_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R01-B" component={ReelB} durationInFrames={REEL_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R01" component={ReelFinal} durationInFrames={REEL_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
  </>
);
