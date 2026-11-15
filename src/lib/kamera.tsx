import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { kurve, tw } from "./bewegung";
import soundsJson from "../../sounds/sounds.json";

// ---------- Kamera: nichts steht je still (Regel aus Ref. 02/04) ----------
// Jede Szene liegt in einer Kamera: langsamer Push, leichter Drift, minimale Rotation.
// Optional: Ruck (Push-Impuls) auf bestimmten Frames, z. B. auf einem Wort.
export const Kamera: React.FC<{
  dauer: number;
  push?: number; // Zoom über die ganze Szene, Standard 4 %
  drift?: number; // px
  dreh?: number; // Grad
  rucke?: number[]; // Frames mit kurzem Push-Impuls
  seed?: number;
  children: React.ReactNode;
}> = ({ dauer, push = 0.04, drift = 6, dreh = 0.6, rucke = [], seed = 0, children }) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / Math.max(1, dauer));
  let ruck = 0;
  for (const r of rucke) {
    if (f >= r && f < r + 14) ruck += tw(f, r, 4, 0, 0.035, kurve.whip) - tw(f, r + 4, 10, 0, 0.035, kurve.land);
  }
  const s = 1 + push * kurve.heavy(t) + ruck;
  const x = Math.sin((f + seed * 41) / 53) * drift;
  const y = Math.cos((f + seed * 29) / 67) * drift * 0.7;
  const r = Math.sin((f + seed * 17) / 90) * dreh;
  return <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)` }}>{children}</AbsoluteFill>;
};

// ---------- Ton: Sound so legen, dass sein Hit exakt auf einem Frame sitzt ----------
type SoundInfo = { datei: string; hit: number; dauer: number; kategorie: string };
const sounds = soundsJson as SoundInfo[];
export const soundNr = (nr: string) => {
  const s = sounds.find((x) => x.datei.startsWith(nr));
  if (!s) throw new Error(`Sound ${nr} nicht gefunden`);
  return s;
};

/** nr z. B. "swish-02"; bei = Frame, auf dem der Hit liegen soll; vor = Frames, die der Hit VOR dem Ereignis liegt (Swish 1–3). */
export const Ton: React.FC<{ nr: string; bei: number; vol?: number; vor?: number; max?: number }> = ({
  nr,
  bei,
  vol = 0.6,
  vor = 0,
  max,
}) => {
  const s = soundNr(nr);
  const hitF = Math.round(s.hit * 30);
  const from = bei - vor - hitF;
  const start = Math.max(0, -from);
  const len = Math.round((max ?? s.dauer) * 30);
  return (
    <Sequence from={Math.max(0, from)} durationInFrames={Math.max(1, len - start)} layout="none">
      <Audio src={staticFile(`sounds/${s.datei}`)} startFrom={start} volume={vol} />
    </Sequence>
  );
};
