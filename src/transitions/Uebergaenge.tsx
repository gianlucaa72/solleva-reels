import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, form, Stimmung } from "../brand/solleva";
import { kurve, tw } from "../lib/bewegung";

// Bibliothek der Übergänge. Jeder hat eine feste Nummer, Dauer und Kurve.
// Pro Reel 3–4 davon wählen (Reel-Logbuch beachten), max. 2 «Effekt»-Typen + Match-Cuts.

export type UebergangsTyp = "U01" | "U02" | "U03" | "U04" | "U05" | "U06" | "U07" | "U08";

export const uebergangsKatalog: Record<
  UebergangsTyp,
  { name: string; dauer: number; kurve: string; wann: string; sound: string }
> = {
  U01: { name: "Whip-Push", dauer: 14, kurve: "whip", wann: "Tempo, Aufzählungen, schneller Themenwechsel", sound: "whoosh kurz" },
  U02: { name: "Zoom-Durchflug", dauer: 20, kurve: "heavy", wann: "Hineinzoomen in ein Detail, «tiefer gehen»", sound: "whoosh tief + leiser Impact" },
  U03: { name: "Anheben (Signatur)", dauer: 24, kurve: "heavy", wann: "Solleva-Signatur: Vorher → Nachher, Problem → Lösung", sound: "Riser kurz + Pop" },
  U04: { name: "Marken-Wischer", dauer: 18, kurve: "whip", wann: "Kapitelwechsel, Stimmungswechsel hell ↔ dunkel", sound: "whoosh breit" },
  U05: { name: "Kreis-Maske ab Klick", dauer: 16, kurve: "land", wann: "Cursor klickt → neue Szene öffnet sich am Klickpunkt", sound: "Klick + weicher Swell" },
  U06: { name: "Blur-Whip vertikal", dauer: 12, kurve: "whip", wann: "Scroll-Gefühl, schnelle Folge", sound: "swish hoch" },
  U07: { name: "Split", dauer: 18, kurve: "heavy", wann: "Enthüllung, «Vorhang auf», Ergebnis zeigen", sound: "Impact dumpf" },
  U08: { name: "Karte wird Fläche", dauer: 20, kurve: "heavy", wann: "Match-Cut: Element wächst zur nächsten Szene", sound: "whoosh weich" },
};

type Props = {
  typ: UebergangsTyp;
  a: React.ReactNode;
  b: React.ReactNode;
  start: number;
  dauer?: number;
  s: Stimmung; // Stimmung der Zielszene (für Farben von Wischer/Morph)
  punkt?: { x: number; y: number }; // U05: Klickpunkt
  karte?: { x: number; y: number; w: number; h: number }; // U08: Ausgangskarte
};

const Ebene: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...style }}>{children}</AbsoluteFill>
);

export const Uebergang: React.FC<Props> = ({ typ, a, b, start, dauer, s, punkt, karte }) => {
  const frame = useCurrentFrame();
  const d = dauer ?? uebergangsKatalog[typ].dauer;
  if (frame < start) return <Ebene>{a}</Ebene>;
  if (frame >= start + d) return <Ebene>{b}</Ebene>;
  const t = (frame - start) / d;

  switch (typ) {
    case "U01": {
      const p = kurve.whip(t);
      const v = Math.abs(kurve.whip(Math.min(1, t + 0.04)) - kurve.whip(Math.max(0, t - 0.04)));
      const blur = Math.min(18, v * 120);
      return (
        <>
          <Ebene style={{ transform: `translateX(${-p * 1080}px) scaleX(${1 + v * 0.4})`, filter: `blur(${blur}px)` }}>{a}</Ebene>
          <Ebene style={{ transform: `translateX(${(1 - p) * 1080}px) scaleX(${1 + v * 0.4})`, filter: `blur(${blur}px)` }}>{b}</Ebene>
        </>
      );
    }
    case "U02": {
      const pa = kurve.heavy(Math.min(1, t / 0.7));
      const pb = kurve.land(Math.max(0, (t - 0.25) / 0.75));
      return (
        <>
          <Ebene
            style={{
              transform: `scale(${1 + pa * 1.6})`,
              opacity: 1 - Math.min(1, t / 0.55),
              filter: `blur(${pa * 14}px)`,
            }}
          >
            {a}
          </Ebene>
          <Ebene style={{ opacity: pb, transform: `scale(${0.84 + 0.16 * pb})` }}>{b}</Ebene>
        </>
      );
    }
    case "U03": {
      // Antizipation: A senkt sich minimal und wird kleiner (wird «angehoben»), dann fliegt A nach oben.
      const ant = 0.22;
      const lift = t < ant ? kurve.land(t / ant) : 1;
      const flug = t < ant ? 0 : kurve.heavy((t - ant) / (1 - ant));
      const scaleA = 1 - 0.05 * lift;
      const yA = 12 * lift * (1 - flug) - flug * 2050;
      const schatten = 30 + 50 * lift;
      const pb = kurve.land(Math.max(0, (t - 0.3) / 0.7));
      return (
        <>
          <Ebene style={{ transform: `scale(${0.95 + 0.05 * pb})`, filter: `brightness(${0.9 + 0.1 * pb})` }}>{b}</Ebene>
          <Ebene
            style={{
              transform: `translateY(${yA}px) scale(${scaleA})`,
              borderRadius: form.radius * lift,
              boxShadow: `0 ${schatten}px ${schatten * 2}px rgba(20,18,58,${0.25 * lift})`,
            }}
          >
            {a}
          </Ebene>
        </>
      );
    }
    case "U04": {
      // Grosse Pille in Markenfarbe wischt diagonal von unten nach oben über das Bild.
      const p = kurve.whip(t);
      const y = 2600 - p * 5600; // Pillen-Oberkante wandert von unten nach weit oben
      const zeigeB = p > 0.5;
      const haupt = s.dunkel ? farben.violett : farben.violett;
      const band = s.dunkel ? farben.cyan : farben.lavendelAkzent;
      return (
        <>
          <Ebene>{zeigeB ? b : a}</Ebene>
          <AbsoluteFill style={{ transform: "rotate(-14deg)", transformOrigin: "50% 50%" }}>
            <div style={{ position: "absolute", left: -900, width: 2900, top: y - 120, height: 2700, borderRadius: 1400, background: band }} />
            <div style={{ position: "absolute", left: -900, width: 2900, top: y, height: 2500, borderRadius: 1400, background: haupt }} />
          </AbsoluteFill>
        </>
      );
    }
    case "U05": {
      const c = punkt ?? { x: 540, y: 960 };
      const r = kurve.land(t) * 2300;
      return (
        <>
          <Ebene style={{ transform: `scale(${1 - 0.03 * kurve.land(t)})` }}>{a}</Ebene>
          <Ebene style={{ clipPath: `circle(${r}px at ${c.x}px ${c.y}px)` }}>{b}</Ebene>
        </>
      );
    }
    case "U06": {
      const p = kurve.whip(t);
      const v = Math.abs(kurve.whip(Math.min(1, t + 0.04)) - kurve.whip(Math.max(0, t - 0.04)));
      const blur = Math.min(26, v * 160);
      return (
        <>
          <Ebene style={{ transform: `translateY(${-p * 1920}px) scaleY(${1 + v * 0.5})`, filter: `blur(${blur}px)` }}>{a}</Ebene>
          <Ebene style={{ transform: `translateY(${(1 - p) * 1920}px) scaleY(${1 + v * 0.5})`, filter: `blur(${blur}px)` }}>{b}</Ebene>
        </>
      );
    }
    case "U07": {
      const p = kurve.heavy(t);
      return (
        <>
          <Ebene style={{ transform: `scale(${1.08 - 0.08 * p})` }}>{b}</Ebene>
          <Ebene style={{ clipPath: "inset(0 0 50% 0)", transform: `translateY(${-p * 980}px)` }}>{a}</Ebene>
          <Ebene style={{ clipPath: "inset(50% 0 0 0)", transform: `translateY(${p * 980}px)` }}>{a}</Ebene>
        </>
      );
    }
    case "U08": {
      const k = karte ?? { x: 160, y: 700, w: 760, h: 520 };
      const p = kurve.heavy(Math.min(1, t / 0.75));
      const x = k.x * (1 - p);
      const y = k.y * (1 - p);
      const w = k.w + (1080 - k.w) * p;
      const h = k.h + (1920 - k.h) * p;
      const pb = tw(t, 0.6, 0.4, 0, 1, kurve.fade);
      return (
        <>
          <Ebene>{a}</Ebene>
          <div
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: form.radius * (1 - p),
              background: s.hintergrund,
              overflow: "hidden",
              boxShadow: form.schatten,
            }}
          >
            <div style={{ position: "absolute", left: -x, top: -y, width: 1080, height: 1920, opacity: pb }}>{b}</div>
          </div>
        </>
      );
    }
  }
};
