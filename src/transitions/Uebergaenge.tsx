import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, form, Stimmung } from "../brand/solleva";
import { kurve, tw } from "../lib/bewegung";

// Bibliothek der Übergänge. Jeder hat eine feste Nummer, Dauer und Kurve.
// Pro Reel 3–4 davon wählen (Reel-Logbuch beachten), max. 2 «Effekt»-Typen + Match-Cuts.

export type UebergangsTyp =
  | "U01" | "U02" | "U03" | "U04" | "U05" | "U06" | "U07" | "U08"
  | "U09" | "U10" | "U12" | "U14" | "U15" | "U16" | "U17";

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
  // ---- aus den Referenzen ----
  U09: { name: "Lupen-Zoom", dauer: 7, kurve: "whip", wann: "Detail heranholen, stapelbar (Zoom in Zoom) · Ref. 01", sound: "whoosh-03 + klick" },
  U10: { name: "Kamera-Kippen", dauer: 22, kurve: "heavy", wann: "Kamera fährt durch den Raum nach unten in die nächste Welt · Ref. 02", sound: "whoosh-01" },
  U12: { name: "Objekt-Wischer (Karten-Fächer)", dauer: 16, kurve: "whip", wann: "Gegenstände wischen diagonal durchs Bild · Ref. 03", sound: "papier-02 + swish-02" },
  U14: { name: "Tür-Schwung 3D", dauer: 12, kurve: "land", wann: "Neue Szene schwingt wie eine Tür herein · Ref. 04", sound: "swish-05 + schlag-07" },
  U15: { name: "Bild-im-Bild-Rauszoom", dauer: 30, kurve: "heavy", wann: "Szene wird ein Bild an einer Wand (Portfolio) · Ref. 04/06", sound: "whoosh-02 + glitzer-04" },
  U16: { name: "Licht-Bloom", dauer: 18, kurve: "land", wann: "Edler Wechsel durchs Licht, hell · Ref. 05", sound: "glitzer-05 leise" },
  U17: { name: "Licht-Streifen", dauer: 14, kurve: "whip", wann: "Dunkle Stimmung, Lichtbalken wischen · Ref. 06", sound: "swish-01" },
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
  // Lupe: Ring bleibt nach dem Einfahren als Vignette stehen (Ref. 01)
  if (typ === "U09" && frame >= start) {
    const t = Math.min(1, (frame - start) / d);
    const c = punkt ?? { x: 540, y: 900 };
    const p = kurve.whip(t);
    const cx = 1500 + (c.x - 1500) * p;
    const r = 520 + 260 * kurve.land(Math.min(1, Math.max(0, (frame - start - d * 0.7) / 10)));
    const ring = 90;
    return (
      <>
        <Ebene style={{ filter: `brightness(${1 - 0.45 * p}) blur(${2 * p}px)` }}>{a}</Ebene>
        <Ebene style={{ clipPath: `circle(${r}px at ${cx}px ${c.y}px)` }}>{b}</Ebene>
        <div
          style={{
            position: "absolute",
            left: cx - r - ring / 2,
            top: c.y - r - ring / 2,
            width: (r + ring / 2) * 2,
            height: (r + ring / 2) * 2,
            borderRadius: "50%",
            border: `${ring}px solid #0B0A18`,
            boxSizing: "border-box",
            filter: "blur(6px)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,.6)",
          }}
        />
        <div style={{ position: "absolute", left: cx - r - 2000, top: c.y - r - 2000, width: (r + 2000) * 2, height: (r + 2000) * 2, borderRadius: "50%", border: `2000px solid #0B0A18`, boxSizing: "border-box", opacity: p }} />
      </>
    );
  }
  if (frame < start) return <Ebene>{a}</Ebene>;
  if (frame >= start + d && typ !== "U15") return <Ebene>{b}</Ebene>;
  const t = Math.min(1, (frame - start) / d);

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
    case "U10": {
      // Kamera kippt nach unten: beide Welten übereinander, starke vertikale Bewegungsunschärfe in der Mitte
      const p = kurve.heavy(t);
      const v = Math.abs(kurve.heavy(Math.min(1, t + 0.04)) - kurve.heavy(Math.max(0, t - 0.04)));
      const blur = Math.min(30, v * 220);
      const sc = 1 + 0.06 * Math.sin(Math.PI * t);
      return (
        <AbsoluteFill style={{ transform: `scale(${sc})` }}>
          <Ebene style={{ transform: `translateY(${-p * 1920}px)`, filter: `blur(${blur}px)` }}>{a}</Ebene>
          <Ebene style={{ transform: `translateY(${(1 - p) * 1920}px)`, filter: `blur(${blur}px)` }}>{b}</Ebene>
        </AbsoluteFill>
      );
    }
    case "U12": {
      // Fächer aus Karten wischt diagonal von unten links nach oben rechts
      const p = kurve.whip(t);
      const zeigeB = p > 0.5;
      const karten = Array.from({ length: 9 }, (_, i) => {
        const w = -40 + i * 10;
        const farbe = [s.akzent, farben.weiss, farben.lavendelAkzent, farben.tinte][i % 4];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1300,
              height: 700,
              borderRadius: 40,
              background: farbe,
              border: `2px solid ${s.rand}`,
              boxShadow: "0 30px 60px rgba(20,18,58,.35)",
              transformOrigin: "0 100%",
              transform: `rotate(${w}deg)`,
            }}
          >
            <div style={{ margin: 50, height: 30, width: 500, borderRadius: 15, background: farbe === farben.weiss ? farben.grauHell : "rgba(255,255,255,.35)" }} />
            <div style={{ margin: 50, height: 30, width: 340, borderRadius: 15, background: farbe === farben.weiss ? farben.grauHell : "rgba(255,255,255,.25)" }} />
          </div>
        );
      });
      const x = -1700 + p * 3000;
      const y = 2700 - p * 3400;
      return (
        <>
          <Ebene>{zeigeB ? b : a}</Ebene>
          <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${-20 + p * 25}deg) scale(2.2)`, transformOrigin: "0 100%" }}>{karten}</div>
        </>
      );
    }
    case "U14": {
      // B schwingt wie eine Tür herein (Scharnier links), A weicht leicht zurück
      const p = kurve.land(t);
      return (
        <AbsoluteFill style={{ perspective: 1800 }}>
          <Ebene style={{ transform: `scale(${1 - 0.06 * p})`, filter: `brightness(${1 - 0.3 * p})` }}>{a}</Ebene>
          <Ebene
            style={{
              transformOrigin: "0% 50%",
              transform: `rotateY(${(1 - p) * -78}deg) scale(${0.86 + 0.14 * p})`,
              boxShadow: `0 0 ${80 * (1 - p)}px rgba(0,0,0,.5)`,
              borderRadius: form.radius * (1 - p),
            }}
          >
            {b}
          </Ebene>
        </AbsoluteFill>
      );
    }
    case "U15": {
      // A schrumpft in einen Rahmen, Kamera fährt weiter zurück: Wand voller Bilder (B)
      const p = kurve.heavy(t);
      const sc = 1 - 0.62 * p;
      const rahmen = 26 * Math.min(1, t * 4);
      return (
        <>
          <Ebene style={{ transform: `scale(${1.6 - 0.6 * p})` }}>{b}</Ebene>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1080,
              height: 1920,
              transform: `scale(${sc})`,
              outline: `${rahmen / sc}px solid ${farben.weiss}`,
              boxShadow: `0 ${40 / sc}px ${90 / sc}px rgba(20,18,58,.35)`,
              borderRadius: 6 / sc,
              overflow: "hidden",
            }}
          >
            {a}
          </div>
        </>
      );
    }
    case "U16": {
      // durchs Licht: A überstrahlt ins Weisse, B entsteht aus dem Licht
      const hin = Math.min(1, t / 0.45);
      const weg = Math.max(0, (t - 0.45) / 0.55);
      const weiss = t < 0.45 ? kurve.land(hin) : 1 - kurve.land(weg);
      return (
        <>
          {t < 0.45 ? (
            <Ebene style={{ filter: `brightness(${1 + hin * 0.8}) blur(${hin * 10}px)`, transform: `scale(${1 + hin * 0.05})` }}>{a}</Ebene>
          ) : (
            <Ebene style={{ filter: `blur(${(1 - weg) * 10}px)`, transform: `scale(${1.05 - 0.05 * kurve.land(weg)})` }}>{b}</Ebene>
          )}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FFFFFF, ${farben.lavendel})`, opacity: weiss }} />
        </>
      );
    }
    case "U17": {
      // Lichtbalken wischen quer durchs Bild (dunkle Stimmung)
      const p = kurve.whip(t);
      const zeigeB = p > 0.5;
      const balken = [0, 110, 170, 300, 360].map((o, i) => {
        const x = -600 + p * 2400 - o * 1.4;
        const w = [140, 40, 90, 24, 60][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: -100,
              width: w,
              height: 2120,
              background: i % 2 ? farben.cyan : farben.lavendelAkzent,
              filter: `blur(${10 + i * 4}px)`,
              opacity: 0.9,
              mixBlendMode: "screen",
              transform: "skewX(-8deg)",
            }}
          />
        );
      });
      return (
        <>
          <Ebene style={{ filter: `brightness(${1 + Math.sin(Math.PI * p) * 0.6})` }}>{zeigeB ? b : a}</Ebene>
          {balken}
        </>
      );
    }
    default:
      return <Ebene>{b}</Ebene>;
  }
};
