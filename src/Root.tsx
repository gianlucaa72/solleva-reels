import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { Storyboard, SB_DAUER } from "./reels/spielautomat/Storyboard";

export const Root: React.FC = () => (
  <>
    <Composition id="SpielautomatStoryboard" component={Storyboard} durationInFrames={SB_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
  </>
);
