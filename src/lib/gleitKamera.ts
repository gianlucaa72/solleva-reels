// K03 Kamera «Gleiten» + K04 «Weicher Bounce» (Feedback Reel 04: Bounce behalten, aber smooth).
// Ziel-Kurve: Jede Fahrt verschiebt das ZIEL der Kamera auf der Heavy-Kurve (mindestens 15 Frames,
// Fahrten überlappen nie: pro Moment genau eine Bewegung; Richtung darf pro Moment wechseln = Bounce).
// Mit `feder` folgt die Kamera diesem Ziel wie an einer weichen Feder: Geschwindigkeit ändert sich nie
// sprunghaft (kein Ruck), beim Ankommen schwingt sie leicht nach (Bounce). Ohne `feder` = reines Gleiten (K03).
// Dazu: durchgehender Push 100 → 103 % pro Szene und Bewegungsunschärfe aus der Geschwindigkeit.
import { kurve } from "./bewegung";

export type KamZustand = { zoom: number; x: number; y: number; dreh: number };
export type Fahrt = { f: number; dauer: number; zoom?: number; x?: number; y?: number; dreh?: number; notiz?: string; optional?: boolean };
export type Feder = { zeta: number; omega: number }; // Dämpfung (0,5–0,8) und Eigenfrequenz in rad/Frame

/** Standard-Bounce: schwingt einmal weich nach (ca. 4–5 % des Wegs), ruhig nach ~20 Frames, kein zweites Pendeln. */
export const WEICH: Feder = { zeta: 0.7, omega: 0.32 };

const MIN_DAUER = 15;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const KEYS = ["zoom", "x", "y", "dreh"] as const;

/** Passt Fahrten an ein anderes Sprechtempo an: Pflichtfahrten mindestens 15 Frames, optionale (Bounce) fallen weg, wenn kein Platz ist. */
export const bereinige = (roh: Fahrt[]): Fahrt[] => {
  let fs = [...roh].sort((a, b) => a.f - b.f).map((x) => ({ ...x, dauer: Math.max(MIN_DAUER, Math.round(x.dauer)) }));
  for (let runde = 0; runde < 20; runde++) {
    const i = fs.findIndex((a, k) => k < fs.length - 1 && fs[k + 1].f < a.f + a.dauer);
    if (i < 0) break;
    const a = fs[i], b = fs[i + 1];
    if (b.optional) fs.splice(i + 1, 1);
    else if (a.optional) fs.splice(i, 1);
    else fs[i] = { ...a, dauer: Math.max(MIN_DAUER, b.f - a.f) }, (fs[i].f + fs[i].dauer > b.f) && (fs[i + 1] = { ...b, f: fs[i].f + fs[i].dauer });
  }
  return fs;
};

const pruefe = (fahrten: Fahrt[]) => {
  for (let i = 0; i < fahrten.length; i++) {
    const a = fahrten[i];
    if (a.dauer < MIN_DAUER) throw new Error(`Kamerafahrt bei Frame ${a.f} ist ${a.dauer} Frames lang (Minimum ${MIN_DAUER}).`);
    const b = fahrten[i + 1];
    if (b && b.f < a.f + a.dauer) throw new Error(`Kamerafahrten überlappen: Frame ${a.f}+${a.dauer} und Frame ${b.f}.`);
  }
};

/** Ziel der Kamera zum Zeitpunkt t (Heavy-Kurve zwischen den Fahrten). */
const ziel = (t: number, von: KamZustand, fahrten: Fahrt[]): KamZustand => {
  const z = { ...von };
  for (const fa of fahrten) {
    if (t <= fa.f) break;
    const p = kurve.heavy(clamp01((t - fa.f) / fa.dauer));
    for (const k of KEYS) if (fa[k] !== undefined) z[k] = z[k] + ((fa[k] as number) - z[k]) * p;
  }
  return z;
};

/** Feder-Folger (gedämpfter Oszillator), deterministisch vom Startframe an integriert. */
const folge = (t: number, t0: number, von: KamZustand, fahrten: Fahrt[], fe: Feder): KamZustand => {
  const pos = { ...von };
  const vel = { zoom: 0, x: 0, y: 0, dreh: 0 };
  const SUB = 4;
  const dt = 1 / SUB;
  const w2 = fe.omega * fe.omega;
  const d = 2 * fe.zeta * fe.omega;
  for (let s = t0; s < t; s += dt) {
    const zi = ziel(Math.min(s + dt, t), von, fahrten);
    for (const k of KEYS) {
      const a = w2 * (zi[k] - pos[k]) - d * vel[k];
      vel[k] += a * dt;
      pos[k] += vel[k] * dt;
    }
  }
  return pos;
};

export const gleitKamera = (
  frame: number,
  o: { start: number; ende: number; von?: Partial<KamZustand>; fahrten: Fahrt[]; push?: number; maxBlur?: number; feder?: Feder },
) => {
  const fahrten = bereinige(o.fahrten);
  pruefe(fahrten);
  const von: KamZustand = { zoom: 1, x: 0, y: 0, dreh: 0, ...o.von };
  const push = o.push ?? 0.03;
  const t0 = Math.min(o.start, fahrten[0]?.f ?? o.start);
  const bei = (t: number) => {
    const z = o.feder ? folge(t, t0, von, fahrten, o.feder) : ziel(t, von, fahrten);
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
