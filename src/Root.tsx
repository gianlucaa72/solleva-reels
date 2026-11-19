import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { Storyboard, SB_DAUER } from "./reels/spielautomat/Storyboard";
import { Farbtest } from "./reels/spielautomat/Farbtest";
import { Collage } from "./reels/spielautomat/Collage";
import { Halbton } from "./reels/spielautomat/Halbton";
import { Storyboard2, SB2_DAUER } from "./reels/spielautomat/Storyboard2";
import { Stiltest, STILTEST_DAUER } from "./reels/spielautomat/Stiltest";
import { Reel, REEL_DAUER } from "./reels/spielautomat/Reel";
import { ReelV2Test, V2_TEST_DAUER } from "./reels/spielautomat/v2/ReelV2";
import { ReelV2Voll, V2_DAUER, PortalDebug } from "./reels/spielautomat/v2/Voll";
import { ReelV3, V3_DAUER } from "./reels/spielautomat/v3/Voll3";
import { Karte } from "./reels/spielautomat/v4/Karte";
import { ReelV4, V4_DAUER } from "./reels/spielautomat/v4/Voll4";
import { ReelV5, V5_DAUER } from "./reels/spielautomat/v5/Voll5";

export const Root: React.FC = () => (
  <>
    <Composition id="SpielautomatStoryboard" component={Storyboard} durationInFrames={SB_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatFarbtest" component={Farbtest} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatCollage" component={Collage} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatHalbton" component={Halbton} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatStoryboard2" component={Storyboard2} durationInFrames={SB2_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatStiltest" component={Stiltest} durationInFrames={STILTEST_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Spielautomat" component={Reel} durationInFrames={REEL_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatV2Test" component={ReelV2Test} durationInFrames={V2_TEST_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatV2" component={ReelV2Voll} durationInFrames={V2_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="PortalDebug" component={PortalDebug} durationInFrames={1} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatV3" component={ReelV3} durationInFrames={V3_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Karte" component={Karte} durationInFrames={1} fps={FPS} width={400} height={600} defaultProps={{ name: "treffer" as const }} />
    <Composition id="SpielautomatV4" component={ReelV4} durationInFrames={V4_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="SpielautomatV5" component={ReelV5} durationInFrames={V5_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
  </>
);
