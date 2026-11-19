import React from "react";
import { AbsoluteFill } from "remotion";
import { zine, ZineSchriften } from "../../../stil/halbton";

// Platzhalter-Karten für die Slot-Walzen (2:3, 400 × 600). Werden später durch illustrierte Karten ersetzt:
// assets/cards/<name>.png – gleiche Namen, gleiches Format, dann ändert sich an der Animation nichts.
export const KARTEN_NAMEN = ["treffer", "niete", "stern", "frage", "klee"] as const;
export type KartenName = (typeof KARTEN_NAMEN)[number];

/** Herz exakt wie das Portal in Szene 2 (79 % der Kartenbreite, mittig). */
const herzPfad = (s: number, ox: number, oy: number) => {
  const P = (x: number, y: number) => `${(ox + x * s).toFixed(1)},${(oy + y * s).toFixed(1)}`;
  return `M${P(50, 88)} C${P(20, 65)} ${P(0, 48)} ${P(0, 26)} C${P(0, 10)} ${P(12, 0)} ${P(26, 0)} C${P(38, 0)} ${P(46, 8)} ${P(50, 16)} C${P(54, 8)} ${P(62, 0)} ${P(74, 0)} C${P(88, 0)} ${P(100, 10)} ${P(100, 26)} C${P(100, 48)} ${P(80, 65)} ${P(50, 88)} Z`;
};

export const Karte: React.FC<{ name: KartenName }> = ({ name }) => {
  const k = 400 / 240; // Karten-Pixel pro Walzen-Pixel (Walze 240 × 360)
  return (
    <AbsoluteFill style={{ background: "#F7F2E6" }}>
      <ZineSchriften />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,.07) 28%, transparent 31%)", backgroundSize: "10px 10px" }} />
      <div style={{ position: "absolute", left: 16, top: 16, right: 16, bottom: 16, border: `6px solid ${zine.schwarz}`, borderRadius: 18 }} />
      {name === "treffer" ? (
        <svg width={400} height={600} style={{ position: "absolute", inset: 0 }}>
          <path d={herzPfad(1.9 * k, 200 - 95 * k, 300 - 82 * k)} fill={zine.rot} />
        </svg>
      ) : (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: "Rye", fontSize: 300, lineHeight: 1, color: name === "frage" ? zine.violett : zine.schwarz }}>
          {{ niete: "✕", stern: "★", frage: "?", klee: "♣" }[name]}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
