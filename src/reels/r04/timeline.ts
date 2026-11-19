// Reel 04: Timeline (Frames bei 30 fps). Heute: 9 Einzeldateien der alten Stimme (Platzhalter).
// Für die neue Stimme (EINE Datei) wird diese Datei aus timeline.json erzeugt (tools/r04_timing.py).
// ---------- Timeline (Frames bei 30 fps, aus silencedetect + Energie-Hüllkurve) ----------
export const S1 = 4; // Stimme Satz 1 startet
export const w1 = (s: number) => S1 + Math.round(s * 30);
export const T = {
  fuer: w1(0.04), video: w1(0.5), brauchte: w1(1.04), man: w1(1.31), frueher: w1(1.64), eine: w1(2.01), filmcrew: w1(2.28),
};
export const SCHNITT = 97; // harter Schnitt Szene 1 → 2
export const S2 = 96; // Stimme Satz 2 (0,06 s Vorlauf in der Datei)
export const w2 = (s: number) => S2 + Math.round(s * 30);
export const U = { kamera: w2(0.06), licht: w2(0.8), schnitt: w2(1.45), wochenlang: w2(2.26), ende: w2(3.47) };
export const STILTEST_DAUER = 232;

// ---------- Timeline: Startframe jeder Stimmdatei (0,22 s Pause, vor Satz 4 und 8 0,4 s) ----------
export const V = { s3: 204, s4: 275, s5: 317, s6: 416, s7: 514, s8: 585, s9: 712 }; // vor Satz 9: Halt für den Signature-Moment
export const REEL04_DAUER = 847; // Satz 9 endet bei 25,6 s + 2 s Halt
export const at = (start: number, s: number) => start + Math.round(s * 30);
export const W3 = { bezahlen: at(V.s3, 0.1), konnten: at(V.s3, 0.63), das: at(V.s3, 0.86), nur: at(V.s3, 1.05), die: at(V.s3, 1.3), grossen: at(V.s3, 1.54) };
export const W4 = { dann: at(V.s4, 0.06), kam: at(V.s4, 0.38), ai: at(V.s4, 0.75) };
export const W5 = { aber: at(V.s5, 0.08), ai: at(V.s5, 0.42), allein: at(V.s5, 0.85), macht: at(V.s5, 1.6), noch: at(V.s5, 1.78), kein: at(V.s5, 1.98), gutes: at(V.s5, 2.3), video: at(V.s5, 2.67) };
export const W6 = { den: at(V.s6, 0.08), unterschied: at(V.s6, 0.28), machen: at(V.s6, 0.8), hook: at(V.s6, 1.15), geschichte: at(V.s6, 1.6), und: at(V.s6, 2.35), details: at(V.s6, 2.55) };
export const W7 = { heute: at(V.s7, 0.11), bekommen: at(V.s7, 0.3), das: at(V.s7, 0.8), auch: at(V.s7, 0.95), kleine: at(V.s7, 1.2), betriebe: at(V.s7, 1.64) };
export const W8 = { dieses: at(V.s8, 0.08), video: at(V.s8, 0.48), keine: at(V.s8, 1.34), filmcrew: at(V.s8, 1.81), nur: at(V.s8, 2.74), ich: at(V.s8, 3.07) };
export const W9 = { willst: at(V.s9, 0.04), du: at(V.s9, 0.37), das: at(V.s9, 0.6), auch: at(V.s9, 0.93), schreib: at(V.s9, 1.31), reel: at(V.s9, 2.0) };

// Text, der vom Skript abhängt (alte Stimme = Platzhalter; mit der neuen Stimme umstellen)
export const NEUE_STIMME = false;
export const CTA_ZEILEN = NEUE_STIMME ? ["SO EIN VIDEO", "FÜR DICH?"] : ["WILLST DU", "DAS AUCH?"];
