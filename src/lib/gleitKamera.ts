// K03 Kamera «Gleiten» (Feedback Reel 04 v1: «gleiten statt springen»), ersetzt K02 «Punch + Feder» an der Kamera.
// Regeln (werden beim Rendern geprüft):
// - Jede Fahrt läuft auf der Heavy-Kurve (In-out), ohne Overshoot und ohne Feder.
// - Eine Fahrt dauert mindestens 15 Frames; Fahrten überlappen nie (pro Moment genau eine Kamerabewegung).
// - Dazwischen läuft ein langsamer, durchgehender Push über die ganze Szene (Standard 100 → 103 %).
// - Bewegungsunschärfe proportional zur Geschwindigkeit (leicht, gedeckelt).
// - Übergänge: Die Fahrt läuft über den Schnitt; Szene A zeigt die erste (beschleunigende) Hälfte,
//   Szene B übernimmt mit eigener Fahrt ab demselben Startframe und zeigt die zweite (abbremsende) Hälfte.
import { kurve } from "./bewegung";

export type KamZustand = { zoom: number; x: number; y: number; dreh: number };
export type Fahrt = { f: number; dauer: number; zoom?: number; x?: number; y?: number; dreh?: number; notiz?: string };

const MIN_DAUER = 15;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const pruefe = (fahrten: Fahrt[]) => {
  for (let i = 0; i < fahrten.length; i++) {
    const a = fahrten[i];
    if (a.dauer < MIN_DAUER) throw new Error(`Kamerafahrt bei Frame ${a.f} ist ${a.dauer} Frames lang (Minimum ${MIN_DAUER}).`);
    const b = fahrten[i + 1];
    if (b && b.f < a.f + a.dauer) throw new Error(`Kamerafahrten überlappen: Frame ${a.f}+${a.dauer} und Frame ${b.f}.`);
  }
};

const zustand = (t: number, von: KamZustand, fahrten: Fahrt[]): KamZustand => {
  const z = { ...von };
  for (const fa of fahrten) {
    if (t <= fa.f) break;
    const p = kurve.heavy(clamp01((t - fa.f) / fa.dauer));
    if (fa.zoom !== undefined) z.zoom = z.zoom + (fa.zoom - z.zoom) * p;
    if (fa.x !== undefined) z.x = z.x + (fa.x - z.x) * p;
    if (fa.y !== undefined) z.y = z.y + (fa.y - z.y) * p;
    if (fa.dreh !== undefined) z.dreh = z.dreh + (fa.dreh - z.dreh) * p;
  }
  return z;
};

export const gleitKamera = (
  frame: number,
  o: { start: number; ende: number; von?: Partial<KamZustand>; fahrten: Fahrt[]; push?: number; maxBlur?: number },
) => {
  const fahrten = [...o.fahrten].sort((a, b) => a.f - b.f);
  pruefe(fahrten);
  const von: KamZustand = { zoom: 1, x: 0, y: 0, dreh: 0, ...o.von };
  const push = o.push ?? 0.03;
  const bei = (t: number) => {
    const z = zustand(t, von, fahrten);
    z.zoom *= 1 + push * clamp01((t - o.start) / Math.max(1, o.ende - o.start));
    return z;
  };
  const k = bei(frame);
  const a = bei(frame - 0.5);
  const b = bei(frame + 0.5);
  const tempo = Math.abs(Math.log(b.zoom / a.zoom)) * 220 + Math.hypot(b.x - a.x, b.y - a.y) * 0.1 + Math.abs(b.dreh - a.dreh) * 1.5;
  const blur = tempo < 0.5 ? 0 : Math.min(o.maxBlur ?? 5, tempo);
  return { ...k, z: k.zoom, r: k.dreh, blur, css: `translate(${k.x}px, ${k.y}px) scale(${k.zoom}) rotate(${k.dreh}deg)` };
};

/** Text-Ebene folgt der Kamera nur halb (Parallaxe); Unschärfe ebenfalls halb. */
export const halbeKamera = (k: { zoom: number; x: number; y: number; dreh: number }) =>
  `translate(${k.x / 2}px, ${k.y / 2}px) scale(${1 + (k.zoom - 1) / 2}) rotate(${k.dreh / 2}deg)`;
