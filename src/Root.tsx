import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { Storyboard, SB_DAUER } from "./reels/spielautomat/Storyboard";
import { Farbtest } from "./reels/spielautomat/Farbtest";
import { Collage } from "./reels/spielautomat/Collage";
import { Halbton } from "./reels/spielautomat/Halbton";

export const Root: React.FC = () => (
  <>
    <Composition id="SpielautomatStoryboard" component={Storyboard} durationInFrames={SB_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatFarbtest" component={Farbtest} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatCollage" component={Collage} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatHalbton" component={Halbton} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
  </>
);
