import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { kurve, overshoot, tw } from "../lib/bewegung";

/** 3D-Emoji aus assets/emoji mit Pop-Einflug, Schweben, Schatten. name = Dateiname ohne .png (z. B. "brain"). */
export const Emoji: React.FC<{ name: string; start?: number; x: number; y: number; size?: number; dreh?: number; schweben?: boolean; von?: "unten" | "oben" | "links" | "rechts" | "pop" }> = ({
  name, start = 0, x, y, size = 260, dreh = 0, schweben = true, von = "pop",
}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const sc = von === "pop" ? overshoot(f, start, 12, 1.15) : 1;
  const p = tw(f, start, 12, 0, 1, kurve.whip);
  const off = { unten: [0, 900], oben: [0, -900], links: [-900, 0], rechts: [900, 0], pop: [0, 0] }[von];
  const sw = schweben ? Math.sin((f - start) / 18) * 10 : 0;
  const rot = dreh + (schweben ? Math.sin((f - start) / 26) * 4 : 0) + (1 - p) * (von === "pop" ? 0 : 30);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `translate(${off[0] * (1 - p)}px, ${off[1] * (1 - p) + sw}px) rotate(${rot}deg) scale(${sc})`, filter: `blur(${(1 - p) * (von === "pop" ? 0 : 8)}px) drop-shadow(0 ${size * 0.08}px ${size * 0.08}px rgba(20,18,58,.3))` }}>
      <Img src={staticFile(`assets/emoji/${name}.png`)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
