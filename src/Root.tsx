import React from "react";
import { Composition } from "remotion";
import { BREITE, FPS, HOEHE } from "./brand/solleva";
import { Katalog, KATALOG_DAUER } from "./katalog/Katalog";
import { VsBoard } from "./reels/vierSchichten/Board";

export const Root: React.FC = () => (
  <>
    <Composition id="Katalog" component={Katalog} durationInFrames={KATALOG_DAUER} fps={FPS} width={BREITE} height={HOEHE} />
    <Composition id="VS-Board" component={VsBoard} durationInFrames={150} fps={FPS} width={BREITE} height={HOEHE} defaultProps={{ nr: 0 }} />
  </>
);
