import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { VsBoard } from "./reels/vierSchichten/Board";
import { Stiltest, STILTEST_DAUER } from "./reels/vierSchichten/Stiltest";
import { VierSchichten, REEL_DAUER } from "./reels/vierSchichten/Reel";

export const Root: React.FC = () => (
  <>
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="VS-Board" component={VsBoard} durationInFrames={150} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ nr: 0 }} />
    <Composition id="VS-Stiltest" component={Stiltest} durationInFrames={STILTEST_DAUER} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ video: "h5-gitter-b.mp4" }} />
    <Composition id="VierSchichten" component={VierSchichten} durationInFrames={REEL_DAUER} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ mitMusik: "" }} />
  </>
);
