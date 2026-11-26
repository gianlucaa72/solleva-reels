import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { R04Storyboard } from "./reels/r04/Storyboard";
import { R04Stiltest, STILTEST_DAUER } from "./reels/r04/Stiltest";
import { R04Reel, REEL04_DAUER } from "./reels/r04/Reel04";
import { R04ReelV7, REEL04_V7_DAUER } from "./reels/r04/V7";
import { R04Freigabe } from "./reels/r04/Freigabe";
import { R05Storyboard } from "./reels/r05/Storyboard";
import { R05Stiltest, STILTEST_R05_DAUER } from "./reels/r05/Stiltest";
import { R05Reel, REEL05_DAUER } from "./reels/r05/Reel05";
import { R05Showcase, SHOWCASE_DAUER } from "./reels/r05/Showcase";
import { R05Showcase2, SHOW2_DAUER } from "./reels/r05/Showcase2";

export const Root: React.FC = () => (
  <>
    <Composition id="R04Freigabe" component={R04Freigabe} durationInFrames={4} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R04HookTest" component={R04Reel} durationInFrames={150} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R04Reel" component={R04Reel} durationInFrames={REEL04_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R04ReelV7" component={R04ReelV7} durationInFrames={REEL04_V7_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R04Stiltest" component={R04Stiltest} durationInFrames={STILTEST_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R04Storyboard" component={R04Storyboard} durationInFrames={9} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R05Storyboard" component={R05Storyboard} durationInFrames={8} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R05Stiltest" component={R05Stiltest} durationInFrames={STILTEST_R05_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R05Reel" component={R05Reel} durationInFrames={REEL05_DAUER} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ musik: true, stimme: true, effekte: true }} />
    <Composition id="R05Showcase" component={R05Showcase} durationInFrames={SHOWCASE_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="R05Solleva" component={R05Showcase2} durationInFrames={SHOW2_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
  </>
);
