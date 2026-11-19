// Reel 04: Kamera pro Szene, K05 «Referenz-Rhythmus» (gemessen an Buffett/Gucci, siehe docs/referenzen/ref-r04-earnedits.md):
// - pro Szene höchstens: Eintritt (zweite Hälfte des Übergangs) + EIN Akzent auf dem Schlüsselwort + Übergang (erste Hälfte)
// - Bounce = Richtungswechsel zwischen den Szenen bzw. am Akzent, nicht auf jedem Wort
// - Heavy-Kurve (In-out), kein Nachschwingen; dazwischen ruhiger Push 100 → 103 %
// - Akzente sind «optional»: passt das Sprechtempo nicht, fallen sie weg (siehe bereinige() in gleitKamera.ts)
import { REEL04_DAUER, SCHNITT, T, U, V, W3, W4, W5, W6, W7, W9 } from "./timeline";

export const kamera1 = () => ({
  start: 0,
  ende: SCHNITT,
  fahrten: [
    { f: 1, dauer: 18, zoom: 1.08, y: 10, notiz: "Akzent rein: Klappe schlägt zu (Frame 1)", optional: true },
    { f: T.filmcrew, dauer: 2 * (SCHNITT - T.filmcrew), zoom: 1.45, y: 60, dreh: -1, notiz: "Push durch den Schnitt" },
  ],
});

export const kamera2 = (ende: number) => ({
  start: SCHNITT,
  ende,
  fahrten: [
    { f: T.filmcrew, dauer: 2 * (SCHNITT - T.filmcrew), zoom: 1.12, notiz: "Eintritt (zweite Hälfte, rein)" },
    { f: U.wochenlang, dauer: 24, zoom: 1.0, y: 20, notiz: "Akzent raus: «Wochenlang», die Wochen fallen", optional: true },
    { f: ende - 9, dauer: 18, zoom: 1.4, y: -40, dreh: -1.5, notiz: "Übergang Satz 3 (erste Hälfte, rein)" },
  ],
});

export const kamera3 = () => {
  const ende = V.s4;
  return {
    start: V.s3,
    ende,
    fahrten: [
      { f: V.s3 - 9, dauer: 18, zoom: 1.08, notiz: "Eintritt (zweite Hälfte)" },
      { f: W3.nur, dauer: 18, zoom: 1.18, y: 30, notiz: "Akzent rein: Stempel", optional: true },
      { f: ende - 9, dauer: 18, zoom: 1.5, dreh: 1.5, notiz: "Übergang Satz 4 (erste Hälfte)" },
    ],
  };
};

export const kamera4 = () => {
  const ende = V.s5;
  return {
    start: V.s4,
    ende,
    maxBlur: 8,
    fahrten: [
      { f: V.s4 - 9, dauer: 18, zoom: 1.06, notiz: "Eintritt (zweite Hälfte)" },
      { f: W4.ai, dauer: 2 * (ende - W4.ai), zoom: 3.8, notiz: "Fahrt durch den Bildschirm" },
    ],
  };
};

export const kamera5 = () => {
  const ende = V.s6;
  return {
    start: V.s5,
    ende,
    fahrten: [
      { f: W4.ai, dauer: 2 * (V.s5 - W4.ai), zoom: 1.1, notiz: "Eintritt (zweite Hälfte der Bildschirm-Fahrt)" },
      { f: W5.kein, dauer: 24, zoom: 1.0, notiz: "Akzent raus: «kein gutes Video»", optional: true },
      { f: ende - 9, dauer: 18, zoom: 1.45, dreh: -1.5, notiz: "Übergang Satz 6 (erste Hälfte)" },
    ],
  };
};

export const kamera6 = () => {
  const ende = V.s7;
  return {
    start: V.s6,
    ende,
    fahrten: [
      { f: V.s6 - 9, dauer: 18, zoom: 1.06, notiz: "Eintritt (zweite Hälfte)" },
      { f: ende - 19, dauer: 38, zoom: 1.7, x: -8, y: -628, notiz: "Fahrt auf DETAILS in der Schreibmaschine, Schnitt in der Mitte" },
    ],
  };
};

export const kamera7 = () => {
  const ende = V.s8;
  return {
    start: V.s7,
    ende,
    fahrten: [
      { f: V.s7 - 19, dauer: 38, zoom: 1.1, notiz: "Eintritt (zweite Hälfte der DETAILS-Fahrt)" },
      { f: W7.kleine, dauer: 24, zoom: 1.02, notiz: "Akzent raus: Laden hebt ab", optional: true },
      { f: ende - 9, dauer: 18, zoom: 1.35, notiz: "Übergang Satz 8 (erste Hälfte)" },
    ],
  };
};

export const kamera8 = () => {
  // Signature: EINE ruhige Fahrt auf die Mini-Figur zu, Heavy-Kurve über die ganze Szene (100 → 108 %).
  const ende = V.s9;
  return {
    start: V.s8,
    ende,
    push: 0,
    fahrten: [{ f: V.s8, dauer: ende - V.s8, zoom: 1.08, y: -15, notiz: "langsam auf die Figur zu" }],
  };
};

export const kamera9 = () => ({
  start: V.s9,
  ende: REEL04_DAUER,
  von: { zoom: 1.08 },
  fahrten: [
    { f: V.s9, dauer: 18, zoom: 1.0, notiz: "Eintritt: sanft zurück (raus)" },
    { f: W9.reel, dauer: 24, zoom: 1.06, y: -15, notiz: "Akzent rein: «Reel»", optional: true },
  ],
});

// W6 wird für den Akzent in Satz 6 nicht gebraucht (die Schreibmaschine trägt den Moment).
export const _unbenutzt = W6;
