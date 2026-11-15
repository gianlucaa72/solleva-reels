// Solleva: fester Kern des Motion-Systems.
// Nur diese Farben verwenden. Abwechslung entsteht über STIMMUNGEN (Kombinationen),
// nicht über neue Farbtöne.

export const farben = {
  papier: "#F6F5FC",
  lavendel: "#ECE6FF",
  staubgrau: "#EEEDF3",
  nacht: "#070A24",
  tinte: "#14123A",
  grau: "#6E6C92",
  grauHell: "#D5D1E9",
  grauLinie: "#E4E1F3",
  rand: "#E1DDF5",
  violett: "#6C3FD4", // Akzent auf hell
  lavendelAkzent: "#A98BFF",
  cyan: "#8FE3FF", // nur auf Nacht
  gold: "#F2C46D", // nur Bewertungssterne
  weiss: "#FFFFFF",
} as const;

export type Stimmung = {
  id: string;
  name: string;
  hintergrund: string;
  hintergrund2: string; // zweiter Ton für Kapitelwechsel
  flaeche: string; // Karten
  tinte: string; // Haupttext
  leise: string; // Nebentext, inaktive Wörter
  akzent: string;
  rand: string;
  textur: "raster" | "koernung" | "beides" | "keine";
  dunkel: boolean;
};

// Pro Reel EINE Hauptstimmung + optional ein Kontrast-Moment aus einer zweiten.
export const stimmungen: Record<string, Stimmung> = {
  S1: {
    id: "S1",
    name: "Hell & ruhig (Papier + Lavendel)",
    hintergrund: farben.papier,
    hintergrund2: farben.lavendel,
    flaeche: farben.weiss,
    tinte: farben.tinte,
    leise: farben.grauHell,
    akzent: farben.violett,
    rand: farben.rand,
    textur: "raster",
    dunkel: false,
  },
  S2: {
    id: "S2",
    name: "Nacht & Cyan (dunkel, filmisch)",
    hintergrund: farben.nacht,
    hintergrund2: "#0E1236",
    flaeche: "#11143A",
    tinte: farben.papier,
    leise: "#3A3D6B",
    akzent: farben.cyan,
    rand: "#22265A",
    textur: "koernung",
    dunkel: true,
  },
  S3: {
    id: "S3",
    name: "Monochrom + ein Violett (editorial)",
    hintergrund: farben.staubgrau,
    hintergrund2: farben.weiss,
    flaeche: farben.weiss,
    tinte: farben.tinte,
    leise: farben.grauHell,
    akzent: farben.violett,
    rand: farben.grauLinie,
    textur: "koernung",
    dunkel: false,
  },
  S4: {
    id: "S4",
    name: "Lavendel satt (verspielt, warm)",
    hintergrund: farben.lavendel,
    hintergrund2: farben.papier,
    flaeche: farben.weiss,
    tinte: farben.tinte,
    leise: "#C9BEF0",
    akzent: farben.violett,
    rand: "#D9CFFB",
    textur: "beides",
    dunkel: false,
  },
};

export const schrift = {
  text: "Barlow", // 800 für Headlines, 500/700 für Fliesstext
  serif: "Instrument Serif", // kursiv für Schlüsselwörter
  mono: "JetBrains Mono", // Labels, Zähler, Katalog-Nummern
};

export const form = {
  radius: 34,
  randBreite: 1.5,
  schatten: "0 30px 70px rgba(44,30,120,.14)",
  schattenDunkel: "0 30px 80px rgba(0,0,0,.45)",
};

// Safe Zones 1080×1920
export const safe = { oben: 220, unten: 1540, rechts: 140, links: 70 };

export const FPS = 30;
export const BREITE = 1080;
export const HOEHE = 1920;
