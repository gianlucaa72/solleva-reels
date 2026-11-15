import { Easing, interpolate } from "remotion";

// Die drei Kurven aus dem motion-design-Skill. Keine anderen Standardkurven.
export const kurve = {
  land: Easing.bezier(0.22, 0.9, 0.24, 1),
  heavy: Easing.bezier(0.65, 0, 0.15, 1),
  whip: Easing.bezier(0.85, 0, 0.1, 1),
  // Für Ausgänge (beschleunigt weg)
  raus: Easing.bezier(0.55, 0, 0.9, 0.4),
  // Opacity: kurz und fast linear
  fade: Easing.bezier(0.3, 0, 0.7, 1),
  linear: (t: number) => t,
};

export type Kurve = (t: number) => number;

/** Wert von a nach b zwischen start und start+dauer (in Frames). */
export const tw = (
  frame: number,
  start: number,
  dauer: number,
  a: number,
  b: number,
  k: Kurve = kurve.land,
) =>
  interpolate(frame, [start, start + Math.max(1, dauer)], [a, b], {
    easing: k,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Fortschritt 0..1 */
export const fortschritt = (frame: number, start: number, dauer: number, k: Kurve = kurve.linear) =>
  tw(frame, start, dauer, 0, 1, k);

/** Ankunft mit Overshoot: 0 → spitze → 1 (nur beim Anführer verwenden). */
export const overshoot = (frame: number, start: number, dauer: number, spitze = 1.04) => {
  const t1 = Math.round(dauer * 0.62);
  if (frame < start + t1) return tw(frame, start, t1, 0, spitze, kurve.land);
  return tw(frame, start + t1, dauer - t1, spitze, 1, kurve.land);
};

/** Standbilder leben weiter: langsamer Drift + leichter Zoom über die Haltezeit. */
export const atmen = (frame: number, dauer: number, seed = 0) => {
  const t = frame / Math.max(1, dauer);
  return {
    x: Math.sin((frame + seed * 37) / 47) * 2,
    y: Math.cos((frame + seed * 53) / 61) * 1.5,
    scale: 1 + 0.02 * t,
  };
};

/** Bewegungsunschärfe proportional zur Geschwindigkeit (für Whip-Bewegungen). */
export const unschaerfe = (frame: number, f: (fr: number) => number, faktor = 0.35, max = 24) =>
  Math.min(max, Math.abs(f(frame + 0.5) - f(frame - 0.5)) * faktor);

/** ms → Frames bei 30 fps */
export const ms = (m: number) => Math.round((m / 1000) * 30);
