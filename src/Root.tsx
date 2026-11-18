import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { R04Storyboard } from "./reels/r04/Storyboard";
import { R04Stiltest, STILTEST_DAUER } from "./reels/r04/Stiltest";

export const Root: React.FC = () => (
  <>
    <Composition id="R04Stiltest" component={R04Stiltest} durationInFrames={STILTEST_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R04Storyboard" component={R04Storyboard} durationInFrames={9} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
  </>
);
