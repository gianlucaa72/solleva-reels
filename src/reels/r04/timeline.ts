// Reel 04: Timeline (Frames bei 30 fps).
// - NEUE STIMME (eine Datei, ganzes Skript): Werte kommen aus timeline.json, erzeugt mit
//   python3 -I tools/r04_timing.py public/r04/stimme-neu.mp3 [--woerter scribe.json] [--pause-vor 9=0.5]
// - ALTE STIMME (9 Einzeldateien, Platzhalter): feste Werte unten.
import tl from "./timeline.json";

type Wort = { satz: number; w: string; n: string; f: number };
const daten = tl as unknown as { quelle: string; segmente: { satz: number; von: number; bis: number; reel: number }[]; woerter: Wort[]; dauer: number };
export const NEUE_STIMME = daten.quelle !== "platzhalter";
export const STIMME_SEGMENTE = daten.segmente;
export const STIMME_DATEI = "r04/stimme-neu.mp3";

/** Frame eines Wortes im Satz (n = normalisiert, z. B. "frueher"); nth = Vorkommen im Satz. */
const wf = (satz: number, n: string, nth = 0) => {
  const xs = daten.woerter.filter((w) => w.satz === satz && w.n === n);
  const x = xs[nth] ?? xs[0];
  if (!x) throw new Error(`timeline.json: Wort «${n}» in Satz ${satz} fehlt`);
  return x.f;
};
const satzStart = (satz: number) => Math.min(...daten.woerter.filter((w) => w.satz === satz).map((w) => w.f));

// ---------- ALTE STIMME (Platzhalter) ----------
const S1_ALT = 4;
const w1a = (s: number) => S1_ALT + Math.round(s * 30);
const S2_ALT = 96;
const w2a = (s: number) => S2_ALT + Math.round(s * 30);
const V_ALT = { s3: 204, s4: 275, s5: 317, s6: 416, s7: 514, s8: 585, s9: 712 };
const at = (start: number, s: number) => start + Math.round(s * 30);
const ALT = {
  T: { fuer: w1a(0.04), video: w1a(0.5), brauchte: w1a(1.04), man: w1a(1.31), frueher: w1a(1.64), eine: w1a(2.01), filmcrew: w1a(2.28) },
  SCHNITT: 97,
  S2: S2_ALT,
  U: { kamera: w2a(0.06), licht: w2a(0.8), schnitt: w2a(1.45), wochenlang: w2a(2.26), ende: w2a(3.47) },
  V: V_ALT,
  DAUER: 847,
  W3: { bezahlen: at(V_ALT.s3, 0.1), konnten: at(V_ALT.s3, 0.63), das: at(V_ALT.s3, 0.86), nur: at(V_ALT.s3, 1.05), die: at(V_ALT.s3, 1.3), grossen: at(V_ALT.s3, 1.54) },
  W4: { dann: at(V_ALT.s4, 0.06), kam: at(V_ALT.s4, 0.38), ai: at(V_ALT.s4, 0.75) },
  W5: { aber: at(V_ALT.s5, 0.08), ai: at(V_ALT.s5, 0.42), allein: at(V_ALT.s5, 0.85), macht: at(V_ALT.s5, 1.6), noch: at(V_ALT.s5, 1.78), kein: at(V_ALT.s5, 1.98), gutes: at(V_ALT.s5, 2.3), video: at(V_ALT.s5, 2.67) },
  W6: { den: at(V_ALT.s6, 0.08), unterschied: at(V_ALT.s6, 0.28), machen: at(V_ALT.s6, 0.8), hook: at(V_ALT.s6, 1.15), geschichte: at(V_ALT.s6, 1.6), und: at(V_ALT.s6, 2.35), details: at(V_ALT.s6, 2.55) },
  W7: { heute: at(V_ALT.s7, 0.11), bekommen: at(V_ALT.s7, 0.3), das: at(V_ALT.s7, 0.8), auch: at(V_ALT.s7, 0.95), kleine: at(V_ALT.s7, 1.2), betriebe: at(V_ALT.s7, 1.64) },
  W8: { dieses: at(V_ALT.s8, 0.08), video: at(V_ALT.s8, 0.48), keine: at(V_ALT.s8, 1.34), filmcrew: at(V_ALT.s8, 1.81), nur: at(V_ALT.s8, 2.74), ich: at(V_ALT.s8, 3.07) },
  W9: { willst: at(V_ALT.s9, 0.04), du: at(V_ALT.s9, 0.37), das: at(V_ALT.s9, 0.6), auch: at(V_ALT.s9, 0.93), schreib: at(V_ALT.s9, 1.31), reel: at(V_ALT.s9, 2.0) },
};

// ---------- NEUE STIMME (aus timeline.json) ----------
// Schnitt = 3 Frames vor dem ersten Wort des Satzes. Schlüssel bleiben gleich, damit die Szenen unverändert laufen.
const neu = () => {
  const V = { s3: satzStart(3) - 3, s4: satzStart(4) - 3, s5: satzStart(5) - 3, s6: satzStart(6) - 3, s7: satzStart(7) - 3, s8: satzStart(8) - 3, s9: satzStart(9) - 3 };
  return {
    T: { fuer: wf(1, "fuer"), video: wf(1, "video"), brauchte: wf(1, "brauchte"), man: wf(1, "man"), frueher: wf(1, "frueher"), eine: wf(1, "eine"), filmcrew: wf(1, "filmcrew") },
    SCHNITT: wf(2, "kamera") - 1,
    S2: wf(2, "kamera") - 2,
    U: { kamera: wf(2, "kamera"), licht: wf(2, "licht"), schnitt: wf(2, "schnitt"), wochenlang: wf(2, "wochenlang"), ende: V.s3 - 4 },
    V,
    DAUER: daten.dauer,
    W3: { bezahlen: wf(3, "bezahlen"), konnten: wf(3, "konnten"), das: wf(3, "das"), nur: wf(3, "nur"), die: wf(3, "die"), grossen: wf(3, "grossen") },
    W4: { dann: wf(4, "dann"), kam: wf(4, "kam"), ai: wf(4, "ki") },
    W5: { aber: wf(5, "aber"), ai: wf(5, "ki"), allein: wf(5, "allein"), macht: wf(5, "macht"), noch: wf(5, "noch"), kein: wf(5, "kein"), gutes: wf(5, "gutes"), video: wf(5, "video") },
    // Satz 6 neu: «… dass Leute stehenbleiben, zuschauen – und anrufen.» → die drei getippten Karten liegen auf diesen Wörtern
    W6: { den: wf(6, "den"), unterschied: wf(6, "unterschied"), machen: wf(6, "macht"), hook: wf(6, "stehenbleiben"), geschichte: wf(6, "zuschauen"), und: wf(6, "und"), details: wf(6, "anrufen") },
    W7: { heute: wf(7, "heute"), bekommen: wf(7, "bekommen"), das: wf(7, "das"), auch: wf(7, "auch"), kleine: wf(7, "kleine"), betriebe: wf(7, "betriebe") },
    W8: { dieses: wf(8, "dieses"), video: wf(8, "video"), keine: wf(8, "keine"), filmcrew: wf(8, "filmcrew"), nur: wf(8, "nur"), ich: wf(8, "ich") },
    // Satz 9 neu: «Willst du so ein Video für deinen Betrieb? Schreib «Reel».» (CTA-Zeile 2 auf «für»)
    W9: { willst: wf(9, "willst"), du: wf(9, "du"), das: wf(9, "so"), auch: wf(9, "fuer"), schreib: wf(9, "schreib"), reel: wf(9, "reel") },
  };
};
const A = NEUE_STIMME ? neu() : ALT;

export const S1 = 4;
export const w1 = (s: number) => S1 + Math.round(s * 30);
export const T = A.T;
export const SCHNITT = A.SCHNITT;
export const S2 = A.S2;
export const w2 = (s: number) => S2 + Math.round(s * 30);
export const U = A.U;
export const STILTEST_DAUER = 232;
export const V = A.V;
export const REEL04_DAUER = A.DAUER;
export const W3 = A.W3;
export const W4 = A.W4;
export const W5 = A.W5;
export const W6 = A.W6;
export const W7 = A.W7;
export const W8 = A.W8;
export const W9 = A.W9;

// Text, der vom Skript abhängt
export const CTA_ZEILEN = NEUE_STIMME ? ["SO EIN VIDEO", "FÜR DICH?"] : ["WILLST DU", "DAS AUCH?"];
