// Reel 04: Kamera pro Szene (K03/K04). Eine Datei, damit Kurven geplottet und geprüft werden können (tools/r04_kamerakurve).
import { WEICH } from "../../lib/gleitKamera";
import { REEL04_DAUER, SCHNITT, T, U, V, W3, W4, W5, W6, W7, W8, W9 } from "./timeline";

export const kamera1 = () => ({
    start: 0,
    ende: SCHNITT,
    von: { zoom: 1.04 },
    feder: WEICH,
    fahrten: [
      { f: 1, dauer: 15, zoom: 1.09, y: 10, notiz: "rein: Klappe schlägt zu (Frame 1)" },
      { f: T.brauchte, dauer: 15, zoom: 1.05, y: -10, notiz: "raus: Klappe öffnet" },
      { f: T.frueher, dauer: 15, zoom: 1.1, x: 15, notiz: "rein: «früher»" },
      { f: T.filmcrew, dauer: 2 * (SCHNITT - T.filmcrew), zoom: 1.6, x: 0, y: 60, dreh: -1.2, notiz: "Push durch den Schnitt" },
    ],
  });

export const kamera2 = (ende: number) => ({
    start: SCHNITT,
    ende,
    von: { zoom: 1.04 },
    feder: WEICH,
    fahrten: [
      { f: T.filmcrew, dauer: 2 * (SCHNITT - T.filmcrew), zoom: 1.12, notiz: "Eintritt (zweite Hälfte)" },
      { f: U.licht + 2, dauer: 15, zoom: 1.06, x: -20, notiz: "raus: «Licht»" },
      { f: U.schnitt, dauer: 15, zoom: 1.13, x: 0, y: -20, notiz: "rein: «Schnitt»" },
      { f: U.wochenlang, dauer: 18, zoom: 1.06, y: 20, notiz: "raus: «Wochenlang», viele Wochen" },
      { f: ende - 9, dauer: 18, zoom: 1.5, y: -40, dreh: -1.5, notiz: "Übergang Satz 3 (erste Hälfte)" },
    ],
  });

export const kamera3 = () => {
  const ende = V.s4;
  return {
    start: V.s3,
    ende,
    von: { zoom: 1.04 },
    feder: WEICH,
    fahrten: [
      { f: V.s3 - 9, dauer: 18, zoom: 1.08, notiz: "Eintritt (zweite Hälfte des Übergangs)" },
      { f: W3.nur, dauer: 15, zoom: 1.16, y: 30, notiz: "rein: Stempel" },
      { f: W3.nur + 15, dauer: 15, zoom: 1.08, y: 0, notiz: "raus: «Grossen»" },
      { f: ende - 9, dauer: 18, zoom: 1.6, dreh: 1.5, notiz: "Übergang Satz 4 (erste Hälfte)" },
    ],
  };
};

export const kamera4 = () => {
  const ende = V.s5;
  return {
    start: V.s4,
    ende,
    maxBlur: 8,
    von: { zoom: 1.02 },
    feder: WEICH,
    fahrten: [
      { f: V.s4 - 9, dauer: 18, zoom: 1.07, notiz: "Eintritt (zweite Hälfte)" },
      { f: W4.ai, dauer: 2 * (ende - W4.ai), zoom: 3.8, notiz: "Fahrt durch den Bildschirm" },
    ],
  };
};

export const kamera5 = () => {
  const ende = V.s6;
  return {
    start: V.s5,
    ende,
    von: { zoom: 1.04 },
    feder: WEICH,
    fahrten: [
      { f: W4.ai, dauer: 2 * (V.s5 - W4.ai), zoom: 1.1, notiz: "Eintritt (zweite Hälfte der Bildschirm-Fahrt)" },
      { f: W5.allein, dauer: 18, zoom: 1.17, y: 20, notiz: "rein: «allein»" },
      { f: W5.kein, dauer: 15, zoom: 1.09, y: 0, notiz: "raus: «kein gutes Video»" },
      { f: ende - 9, dauer: 18, zoom: 1.55, dreh: -1.5, notiz: "Übergang Satz 6 (erste Hälfte)" },
    ],
  };
};

export const kamera6 = () => {
  const ende = V.s7;
  return {
    start: V.s6,
    ende,
    von: { zoom: 1.04 },
    feder: WEICH,
    fahrten: [
      { f: V.s6 - 9, dauer: 18, zoom: 1.08, notiz: "Eintritt (zweite Hälfte)" },
      { f: W6.hook, dauer: 15, zoom: 1.13, y: 20, notiz: "rein: «Hook»" },
      { f: W6.hook + 15, dauer: 15, zoom: 1.07, notiz: "raus: «Geschichte»" },
      { f: ende - 19, dauer: 38, zoom: 1.7, x: 136, y: -483, notiz: "Fahrt auf DETAILS, Schnitt in der Mitte" },
    ],
  };
};

export const kamera7 = () => {
  const ende = V.s8;
  return {
    start: V.s7,
    ende,
    von: { zoom: 1.04 },
    feder: WEICH,
    fahrten: [
      { f: V.s7 - 19, dauer: 38, zoom: 1.12, notiz: "Eintritt (zweite Hälfte der DETAILS-Fahrt)" },
      { f: V.s7 + 21, dauer: 15, zoom: 1.06, notiz: "raus: «auch»" },
      { f: W7.kleine, dauer: 18, zoom: 1.16, y: 20, notiz: "rein: «kleine Betriebe»" },
      { f: ende - 9, dauer: 18, zoom: 1.5, y: 0, notiz: "Übergang Satz 8 (erste Hälfte)" },
    ],
  };
};

export const kamera8 = () => {
  const ende = V.s9;
  // Matte in der Bildmitte halten: Verschiebung = Zoom × Abstand der Mattenmitte (524/985) zur Bildmitte.
  const nah = (z: number) => ({ zoom: z, x: 16 * z, y: -25 * z });
  return {
    start: V.s8,
    ende,
    von: nah(1.55),
    feder: { zeta: 0.7, omega: 0.3 }, // etwas mehr Dämpfung: die Rausfahrt darf nicht unter 100 % schwingen
    fahrten: [
      { f: V.s8 - 9, dauer: 18, ...nah(1.75), notiz: "Eintritt (zweite Hälfte)" },
      { f: W8.video, dauer: 15, ...nah(1.68), notiz: "raus: «Video?»" },
      { f: W8.keine, dauer: 15, ...nah(1.82), notiz: "rein: «Keine Filmcrew»" },
      { f: W8.nur, dauer: 24, zoom: 1.04, x: 0, y: 0, dreh: -1, notiz: "RAUSFAHRT auf den echten Tisch" },
    ],
  };
};

export const kamera9 = () => {
  return {
    start: V.s9,
    ende: REEL04_DAUER,
    von: { zoom: 1.1 },
    feder: WEICH,
    fahrten: [
      { f: V.s9, dauer: 18, zoom: 1.02, notiz: "raus: Eintritt" },
      { f: V.s9 + 19, dauer: 15, zoom: 1.06, notiz: "rein: «das auch?»" },
      { f: W9.schreib, dauer: 15, zoom: 1.03, notiz: "raus: Button kommt" },
      { f: W9.reel, dauer: 24, zoom: 1.08, y: -15, notiz: "rein: «Reel»" },
    ],
  };
};
