import React from "react";
import { AbsoluteFill } from "remotion";
import { Schriften } from "../../components/Basis";
import { szenen } from "./Szenen";

// Storyboard: eine Szene pro Render (inputProps.nr), Standbild mit `npx remotion still VS-Board --props='{"nr":3}' --frame=N`.
export const VsBoard: React.FC<{ nr: number }> = ({ nr }) => {
  const Sz = szenen[nr] ?? szenen[0];
  return (
    <AbsoluteFill>
      <Schriften />
      <Sz />
    </AbsoluteFill>
  );
};
