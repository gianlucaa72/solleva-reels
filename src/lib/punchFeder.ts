// K02 Kamera «Punch + Feder» (gemessen an EarnEdits/Buffett, siehe docs/referenzen/ref-r04-earnedits.md)
// - Punch: Ziel wird exponentiell angefahren, τ ≈ 8 Frames (60 % nach 8 Frames, 95 % nach 24 Frames)
// - Feder: kleines Überschwingen (~3 % des Sprungs, also ~0,5 % absolut bei 15 %)
// - Richtung wechselt pro Ereignis (rein, raus, rein) = «Bouncen»
// - Drift zwischen Ereignissen: 0,3 %/s
// - Ausgang: beschleunigt (ease-in), danach harter Schnitt
import { Easing, interpolate } from "remotion";

export type KamEreignis = {
  f: number; // Start-Frame
  zoom: number; // Ziel-Zoom (1 = 100 %)
  x?: number; // Ziel-Verschiebung in px (Fokus)
  y?: number;
  dreh?: number; // Ziel-Rotation in Grad
  tau?: number; // Zeitkonstante in Frames (Standard 8)
  art?: "punch" | "raus"; // raus = beschleunigter Ausgang
  dauer?: number; // nur für raus
};

/** Feder-Antwort 0 → 1 mit leichtem Überschwingen. t in Frames. */
export const feder = (t: number, tau = 8) => {
  if (t <= 0) return 0;
  const w = Math.PI / (tau * 3.2);
  return 1 - Math.exp(-t / tau) * (Math.cos(w * t) - 0.18 * Math.sin(w * t));
};

export const punchFeder = (frame: number, ereignisse: KamEreignis[], drift = 0.003 / 30) => {
  let z = 1, x = 0, y = 0, r = 0;
  for (const e of ereignisse) {
    if (frame < e.f) break;
    const t = frame - e.f;
    const p =
      e.art === "raus"
        ? interpolate(t, [0, e.dauer ?? 12], [0, 1], { easing: Easing.bezier(0.55, 0, 0.9, 0.4), extrapolateRight: "clamp" })
        : feder(t, e.tau ?? 8);
    z = z + (e.zoom - z) * p;
    x = x + ((e.x ?? x) - x) * p;
    y = y + ((e.y ?? y) - y) * p;
    r = r + ((e.dreh ?? r) - r) * p;
  }
  z *= 1 + drift * frame;
  return { z, x, y, r, css: `translate(${x}px, ${y}px) scale(${z}) rotate(${r}deg)` };
};
