import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { kurve, landung, overshoot, tw } from "../../../lib/bewegung";
import { Ton } from "../../../lib/kamera";
import { Bewegungsunschaerfe, Cam, drift, Ebene, Filmlook, MITTE, Rechteck, RUHE, TIEFE } from "../../../kamera/welt";
import {
  Blase, Hand, HKaro, HPunkte, HZeitung, Kreistext, Papierstueck, Praegeband, Rasterwort, Riso, weisserRand, Zacken, Zeitung, zine, ZineSchriften,
} from "../../../stil/halbton";
import { BildGrund as _unused, Etikett, PapierLage, Rein } from "../Reel";
import { ErpresserAnim, EtikettAnim, Walze, walzenPos } from "../Stiltest";
import { REEL_DAUER, SAETZE } from "../zeiten";

// ============================================================================
// Reel «Spielautomat» v2 (ganz): durchgehende virtuelle Kamera K01.
// Jede Szene liegt verkleinert im Schlüsselobjekt der vorherigen (Zoom-Through, 0,7 s).
// Ebenen: Hintergrund 0,3 · Hauptobjekt 1,0 · Text 1,1 · Vordergrund 1,6.
// ============================================================================
void _unused;
export const V2_DAUER = REEL_DAUER;
type Satz = { nr: number; start: number; ende: number; datei: string; m: Record<string, number> };
const Z = (n: number) => SAETZE[n - 1] as unknown as Satz;
const A = (name: string) => staticFile(`assets/spielautomat/${name}.png`);
const ZOOM = 21; // 0,7 s, cubic-bezier(0.65, 0, 0.15, 1)

type SzProps = { f: number; cam: Cam; stufe: number };

// ---------- Zeitplan: Start der Fahrt aus Szene n in Szene n+1 ----------
const FAHRT: Record<number, number | null> = {
  1: Z(2).start, // Hook: 1,4 s Lesepause
  2: Z(3).start - 4,
  3: Z(4).start - 4,
  4: Z(5).start - 4,
  5: null, // harter Schnitt auf «Falsch.» (Bruch), Flasche bleibt an derselben Stelle
  6: Z(7).start - 4,
  7: Z(8).start - 4,
  8: Z(9).start - 4,
  9: Z(10).start - 4,
  10: Z(11).start, // Feed scrollt erst auf die nächste Kachel
  11: Z(12).start - 4,
  12: Z(13).start - 4,
  13: Z(14).start - 4,
};
const beginn = (n: number) => (n === 1 ? 0 : n === 6 ? Z(6).start : (FAHRT[n - 1] as number) + ZOOM);
/** Idle klingt vor der Fahrt aus, damit das Fenster beim Zoom still steht. */
const ruhe = (f: number, n: number) => {
  const s = FAHRT[n];
  return s == null ? 1 : 1 - tw(f, s - 14, 12, 0, 1, kurve.land);
};

/** Während der Fahrt fliegen Vordergrund und Text der alten Szene unscharf vorbei und blenden aus (sonst Sprung beim Wechsel). */
const weg = (f: number, n: number, ab: number, dauer: number) => {
  const s = FAHRT[n];
  return s == null ? 1 : 1 - tw(f, s + ab, dauer, 0, 1, kurve.fade);
};

// ============================== Bausteine ==============================
/** Bei starkem Zoom (Kamera > 2×) teure Papierrand-Filter weglassen (Elemente sind dann ohnehin aus dem Bild oder verwischt). */
const Leicht = React.createContext(false);
const randFilter = (leicht: boolean, px: number) => (leicht ? "drop-shadow(6px 10px 6px rgba(0,0,0,.25))" : weisserRand(px));
/** Sehr grosser Hintergrund (für Parallax/Zoom nie Ränder sichtbar). */
// Kern 1720 × 2760 (deckt Bild + Parallax), Rand bis 4680 × 7920: füllt auch breite Portale (Herz, Tropfen, Rauch, Glaskolben).
const RAND = { x: -1800, y: -3000, w: 4680, h: 7920 };
const KERN = { x: -320, y: -420, w: 1720, h: 2760 };
const Gross: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; rand?: React.ReactNode }> = ({ children, style, rand }) => (
  <div style={{ position: "absolute", left: RAND.x, top: RAND.y, width: RAND.w, height: RAND.h, overflow: "hidden", ...style }}>
    {rand}
    <div style={{ position: "absolute", left: KERN.x - RAND.x, top: KERN.y - RAND.y, width: KERN.w, height: KERN.h, overflow: "hidden", ...style }}>{children}</div>
  </div>
);
/** Rand: dieselbe Textur in gleicher Grösse und Lage wie im Kern (Bild 1520 × 2688, «cover» im Kern), als Kachel wiederholt. */
const KACHEL = { w: KERN.w, h: (2688 * KERN.w) / 1520 };
const RandBild: React.FC<{ name: string; mix?: "multiply"; deckkraft?: number }> = ({ name, mix, deckkraft = 1 }) => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile(`assets/spielautomat/${name}-spiegel.jpg`)})`, backgroundSize: `${KACHEL.w * 2}px ${KACHEL.h * 2}px`, backgroundPosition: `${KERN.x - RAND.x}px ${KERN.y - RAND.y - (KACHEL.h - KERN.h) / 2}px`, backgroundRepeat: "repeat", mixBlendMode: mix, opacity: deckkraft }} />
);
const BildFlaeche: React.FC<{ name: string; f: number; start: number; vx?: number; vy?: number; zoom?: number }> = ({ name, f, start, vx = 0, vy = -0.4, zoom = 1.04 }) => {
  const l = f - start;
  void zoom;
  // ganze Fläche (Kern + Rand) bewegt sich gemeinsam → keine Naht am Kernrand
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${l * vx}px, ${l * vy}px)` }}>
      <Gross rand={<RandBild name={name} />}>
        <Img src={A(name)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Gross>
    </div>
  );
};
const Strahlen: React.FC<{ f: number; bild: string; grund: string; cx: number; cy: number; tempo?: number }> = ({ f, bild, grund, cx, cy, tempo = 0.08 }) => {
  const g = 3000;
  return (
    <>
      <div style={{ position: "absolute", left: -500, top: -600, width: 2080, height: 3120, background: grund }} />
      <Img src={A(bild)} style={{ position: "absolute", left: cx - g / 2, top: cy - g / 2, width: g, height: g, transform: `rotate(${f * tempo}deg)` }} />
    </>
  );
};

/** Freigestelltes Objekt mit weissem Papierrand. Kinder in Anzeige-Pixeln (Breite = bw · sc). */
const Objekt: React.FC<{ bild: string; bw: number; bh: number; sc: number; x: number; y: number; tr?: string; ursprung?: string; blur?: number; children?: React.ReactNode; rand?: number }> = ({
  bild, bw, bh, sc, x, y, tr = "", ursprung = "50% 50%", blur = 0, children, rand = 8,
}) => {
  const leicht = React.useContext(Leicht);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: bw * sc, height: bh * sc, transform: tr, transformOrigin: ursprung, filter: `${randFilter(leicht, rand)}${blur > 0.2 ? ` blur(${blur}px)` : ""}` }}>
      <Img src={A(bild)} style={{ width: "100%", height: "100%" }} />
      {children}
    </div>
  );
};

/** Eingang eines Objekts: whip von aussen, Landung 1 → 1,03 → 1 (nie 0). */
const eingang = (f: number, start: number, von: "unten" | "links" | "rechts" | "oben" | "pop") => {
  if (von === "pop") {
    const s = f < start ? 0 : overshoot(f, start, 12, 1.08);
    return { tr: `scale(${s})`, blur: 0, sichtbar: f >= start };
  }
  const p = tw(f, start, 12, 1, 0, kurve.whip);
  const off = { unten: [0, 1300], oben: [0, -1300], links: [-1200, 0], rechts: [1200, 0] }[von];
  const rot = p * (von === "links" ? -20 : von === "rechts" ? 20 : 8);
  return { tr: `translate(${off[0] * p}px, ${off[1] * p}px) rotate(${rot}deg) scale(${landung(f, start + 11, 8, 1.03)})`, blur: p * 6, sichtbar: f >= start };
};

// ---------- Portal: die nächste Szene im Schlüsselobjekt ----------
/**
 * fenster: 9:16-Rechteck (Koordinaten des Elternelements), in dem die Szene n liegt.
 * box + form: sichtbarer Ausschnitt (grösser als das Fenster, damit beim Zoom nie der Objektrand aufblitzt).
 * auf: [Start, Dauer] Einblenden (für Objekte, die vorher etwas anderes zeigen); sonst immer sichtbar.
 * tönung: Abdunkeln/Glas-Effekt, verschwindet während der Fahrt.
 */
const Portal: React.FC<{
  n: number; f: number; stufe: number; fenster: Rechteck; box: Rechteck; form?: "rechteck" | "ellipse" | string; radius?: number;
  auf?: [number, number]; toenung?: { farbe: string; staerke: number }; feder?: boolean; glas?: boolean;
}> = ({ n, f, stufe, fenster, box, form = "rechteck", radius = 0, auf, toenung, feder, glas }) => {
  if (stufe >= 2) return null;
  // Dritte Ebene erst rendern, wenn die Fahrt in die zweite Ebene läuft (vorher nur wenige Pixel gross).
  if (stufe === 1) {
    const elternFahrt = FAHRT[n - 2];
    if (elternFahrt == null || f < elternFahrt + 8) return null;
  }
  const sichtbar = auf ? tw(f, auf[0], auf[1], 0, 1, kurve.fade) : 1;
  if (sichtbar <= 0) return null;
  const fahrt = FAHRT[n - 1] ?? 0;
  const t = toenung ? toenung.staerke * (1 - tw(f, fahrt, ZOOM * 0.6, 0, 1, kurve.land)) : 0;
  const clip = form === "ellipse" ? "ellipse(50% 50% at 50% 50%)" : undefined;
  // Freie Formen (Herz, Tropfen) als SVG-Maske: CSS-path() zeichnet im Headless-Chrome nur gerade Linien.
  const pfadMaske = form !== "ellipse" && form !== "rechteck"
    ? `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${box.w}' height='${box.h}' viewBox='0 0 ${box.w} ${box.h}'><path d='${form}' fill='black'/></svg>`)}")`
    : undefined;
  const maske = feder ? "radial-gradient(ellipse 50% 50% at 50% 50%, #000 82%, transparent 100%)" : pfadMaske;
  const S = SZENEN[n];
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", borderRadius: radius, clipPath: clip, opacity: sichtbar, WebkitMaskImage: maske, maskImage: maske, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" } as React.CSSProperties}>
      <div style={{ position: "absolute", left: fenster.x - box.x, top: fenster.y - box.y, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${fenster.w / 1080})` }}>
        <Leicht.Provider value={false}>
          <S f={f} cam={RUHE} stufe={stufe + 1} />
        </Leicht.Provider>
      </div>
      {t > 0.001 && <div style={{ position: "absolute", inset: 0, background: toenung!.farbe, opacity: t }} />}
      {glas && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,.25) 100%)", opacity: 1 - tw(f, fahrt, ZOOM * 0.5, 0, 1, kurve.land) }} />}
    </div>
  );
};

// ---------- Vordergrund-Elemente (1,6, unscharf, angeschnitten) ----------
const VMuenze: React.FC<{ f: number; x: number; y: number; g: number; dreh?: number; blur?: number }> = ({ f, x, y, g, dreh = 0, blur = 8 }) => (
  <Img src={A("muenze-frei")} style={{ position: "absolute", left: x, top: y, width: g, height: g, transform: `rotate(${dreh + f * 0.22}deg)`, filter: `blur(${blur}px) brightness(.9)` }} />
);
const VLos: React.FC<{ x: number; y: number; dreh: number; farbe?: string }> = ({ x, y, dreh, farbe = zine.gelb }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 560, height: 260, transform: `rotate(${dreh}deg)`, background: farbe, border: `6px solid ${zine.schwarz}`, borderRadius: 20, filter: "blur(7px)", padding: "24px 36px", boxSizing: "border-box" }}>
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, letterSpacing: "0.14em", color: zine.schwarz }}>LOS № 471</div>
    <div style={{ borderTop: `4px dashed ${zine.schwarz}`, margin: "12px 0" }} />
    <div style={{ fontFamily: "Rye", fontSize: 110, color: zine.rot }}>GLÜCK</div>
  </div>
);
const VKlebeband: React.FC<{ x: number; y: number; dreh: number }> = ({ x, y, dreh }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 620, height: 120, transform: `rotate(${dreh}deg)`, background: "rgba(238,228,200,.75)", boxShadow: "0 4px 12px rgba(0,0,0,.18)", filter: "blur(6px)" }} />
);

// ============================== Szene 1: Hand + Handy ==============================
const H = { bw: 880, bh: 1168 };
const S1_SC = 1.22;
const S1_POS = { x: 1090 - H.bw * S1_SC, y: 486 };
/** Fenster im Handy (Bildpixel 91,5 / 333, 288 × 512) und Bildschirm (71 / 309, 329 × 560). */
const HANDY_FENSTER_B = { x: 91.5, y: 333, w: 288, h: 512 };
const HANDY_SCHIRM_B = { x: 71, y: 309, w: 329, h: 560 };

const handTransform = (f: number) => {
  const z = Z(1);
  const ein = tw(f, 0, 12, 1, 0, kurve.whip);
  const land = landung(f, 11, 10, 1.03);
  const hebel = f < z.m.wort + 2 ? 0 : f < z.m.wort + 8 ? tw(f, z.m.wort + 2, 6, 0, 1, kurve.whip) : tw(f, z.m.wort + 8, 18, 1, 0, kurve.land);
  const ruck = f >= 124 && f < 134 ? Math.sin((f - 124) * 1.6) * (1 - (f - 124) / 10) : 0;
  const h = ruhe(f, 1);
  return `translate(${ein * 500}px, ${ein * 900 + Math.sin(f / 26) * 6 * h + hebel * 14}px) rotate(${ein * 18 + Math.sin(f / 41) * 0.7 * h + hebel * 3.5 + ruck}deg) scale(${land})`;
};

const HandyMitSzene: React.FC<{ f: number; stufe: number; sc: number; x: number; y: number; tr: string; blur?: number; n: number; inhalt?: React.ReactNode }> = ({ f, stufe, sc, x, y, tr, blur = 0, n, inhalt }) => {
  const schirm = { x: HANDY_SCHIRM_B.x * sc, y: HANDY_SCHIRM_B.y * sc, w: HANDY_SCHIRM_B.w * sc, h: HANDY_SCHIRM_B.h * sc };
  const fenster = { x: HANDY_FENSTER_B.x * sc, y: HANDY_FENSTER_B.y * sc, w: HANDY_FENSTER_B.w * sc, h: HANDY_FENSTER_B.h * sc };
  return (
    <Objekt bild="hand-b-frei" bw={H.bw} bh={H.bh} sc={sc} x={x} y={y} tr={tr} ursprung={`${470 * sc}px ${760 * sc}px`} blur={blur}>
      <div style={{ position: "absolute", left: schirm.x, top: schirm.y, width: schirm.w, height: schirm.h, borderRadius: 16 * sc, background: "#E9E1CF", overflow: "hidden" }}>
        {inhalt}
      </div>
      <Portal n={n} f={f} stufe={stufe} fenster={fenster} box={schirm} radius={16 * sc} />
    </Objekt>
  );
};

const Szene1: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(1);
  const ein = tw(f, 0, 12, 1, 0, kurve.whip);
  const fx = S1_POS.x + (HANDY_FENSTER_B.x + HANDY_FENSTER_B.w / 2) * S1_SC;
  const fy = S1_POS.y + (HANDY_FENSTER_B.y + HANDY_FENSTER_B.h / 2) * S1_SC;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Strahlen f={f} bild="strahlen-rot-a" grund="#5A0E12" cx={fx} cy={fy} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <HandyMitSzene f={f} stufe={stufe} sc={S1_SC} x={S1_POS.x} y={S1_POS.y} tr={handTransform(f)} blur={ein * 6} n={2} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 1, 11, 8) }}>
        <EtikettAnim text="DEIN DAUMEN ZIEHT" x={70} y={250} dreh={-3} start={z.start} f={f} />
        <EtikettAnim text="GERADE AN EINEM" x={240} y={338} dreh={2} start={z.m.zeile2} f={f} />
        <ErpresserAnim text="SPIEL" x={80} y={432} size={120} start={z.m.wort} f={f} />
        <ErpresserAnim text="AUTOMATEN" x={50} y={584} size={92} versatz={3} start={z.m.wort + 10} f={f} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 1, 6, 9) }}>
        <VMuenze f={f} x={-190} y={1560} g={520} dreh={-20} blur={7} />
        <VMuenze f={-f} x={900} y={40} g={300} dreh={30} blur={9} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Walzen (Szene 1–3) ==============================
const WALZE = { w: 260, h: 380, gap: 31, y: 860 };
const WALZE_X = (1080 - (3 * WALZE.w + 2 * WALZE.gap)) / 2;
const wx = (i: number) => WALZE_X + i * (WALZE.w + WALZE.gap);
const HOOK_STOPS = [100, 111, 124];
const SPIN2 = Z(2).start + 26;
/** Szene 1–2: dreht beim Hebel, stoppt auf ♥ ♥ ?, dreht in Szene 2 wieder. */
const walze12 = (f: number, i: number) => {
  const a = (x: number) => walzenPos(x, Z(1).m.wort + 4 + i * 2, HOOK_STOPS[i], [1, 2, 3][i], [0, 0, 3][i]);
  if (f < SPIN2) return a(f);
  const g = f - SPIN2 - i * 3;
  return g <= 0 ? a(SPIN2) : a(SPIN2) + 0.5 * g * Math.min(1, g / 10);
};
/** Szene 3: dreht schon, stoppt auf ✕ ✕ ♥. */
const walze3 = (f: number, i: number) => {
  const z = Z(3);
  const stops = [z.m.niete + 8, z.m.aber - 6, z.m.wort];
  return walzenPos(f, z.start - 70, stops[i], [0, 2, 4][i], [1, 1, 0][i]);
};
const Walzen: React.FC<{ f: number; pos: (f: number, i: number) => number; versteckt?: number }> = ({ f, pos, versteckt }) => (
  <div style={{ position: "absolute", left: WALZE_X, top: WALZE.y, display: "flex", gap: WALZE.gap, filter: randFilter(React.useContext(Leicht), 8) }}>
    {[0, 1, 2].map((i) => {
      const p = pos(f, i);
      const v = Math.abs(pos(f + 1, i) - p);
      return <div key={i} style={{ opacity: versteckt === i ? 0 : 1 }}><Walze p={p} tempo={v} w={WALZE.w} h={WALZE.h} /></div>;
    })}
  </div>
);

// ============================== Szene 2: Zeitung + Walzen + Los ==============================
const S2_FENSTER: Rechteck = { x: 540 - 95.625, y: 880, w: 191.25, h: 340 };
const S2_BOX: Rechteck = { x: wx(1) + 10, y: WALZE.y + 10, w: WALZE.w - 20, h: WALZE.h - 20 };

const Szene2: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(2);
  const los = z.start + 28;
  const losP = tw(f, los, 10, 1, 0, kurve.whip);
  const losWackel = f > los + 18 ? Math.sin((f - los) / 14) * 0.8 * ruhe(f, 2) : 0;
  const wortS = f < z.m.wort ? 0 : tw(f, z.m.wort, 6, 1.8, 1, kurve.whip);
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Gross rand={<RandBild name="papier" />}>
          <Img src={A("papier")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 120, top: 40 - Math.max(0, f - z.start) * 0.5, width: 1500, transform: "rotate(-4deg)", mixBlendMode: "multiply", opacity: 0.62 }}>
            {[0, 1, 2, 3].map((i) => <div key={i}><Zeitung /></div>)}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 45% 40% at 50% 52%, transparent 45%, rgba(60,35,10,.32))" }} />
        </Gross>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <Walzen f={f} pos={walze12} />
        <Portal n={3} f={f} stufe={stufe} fenster={S2_FENSTER} box={S2_BOX} radius={18} auf={[FAHRT[2] as number, 8]} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 2, 11, 8) }}>
        {f >= los - 1 && (
          <div style={{ position: "absolute", left: 120, top: 250, width: 840, transformOrigin: "50% 0", transform: `translateY(${losP * -900}px) rotate(${-3 + losP * -25 + losWackel}deg) scale(${landung(f, los + 9, 8, 1.03)})`, filter: "drop-shadow(10px 14px 0 rgba(0,0,0,.28))" }}>
            <div style={{ background: zine.gelb, border: `5px solid ${zine.schwarz}`, borderRadius: 20, padding: "26px 40px 30px", WebkitMaskImage: "radial-gradient(circle at 0 50%, transparent 30px, #000 31px), radial-gradient(circle at 100% 50%, transparent 30px, #000 31px)", WebkitMaskComposite: "source-in", maskComposite: "intersect" } as React.CSSProperties}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono", fontSize: 30, letterSpacing: "0.14em", color: zine.schwarz }}>
                <span>JEDER WISCH IST EIN NEUER</span>
                <span style={{ color: zine.rot }}>№ 471</span>
              </div>
              <div style={{ borderTop: `4px dashed ${zine.schwarz}`, margin: "14px 0 6px" }} />
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Rye", fontSize: 210, lineHeight: 1, color: zine.rot, transform: `scale(${wortS}) rotate(${(wortS - 1) * -12}deg)`, display: "inline-block", textShadow: `6px 6px 0 ${zine.schwarz}` }}>DREH</span>
              </div>
            </div>
          </div>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 2, 6, 9) }}>
        <div style={{ filter: "blur(2.5px)" }}>
          <Papierstueck x={-80} y={1660} w={1240} h={420} dreh={-5} seed={44} style={{ background: "#EFE7D3" }}>
            <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
            <div style={{ position: "relative", padding: "34px 70px", fontFamily: "Fell SC", fontSize: 120, color: zine.schwarz, lineHeight: 1 }}>Der Jackpot</div>
            <div style={{ position: "relative", padding: "0 70px", fontFamily: "Fell SC", fontSize: 28, color: "#3A3026", columnCount: 3 }}>
              Glück Gewinn Spiel Daumen Feed Dopamin Treffer Niete Walze Hebel Münze Belohnung jetzt mehr weiter scrollen Glück Gewinn Spiel Daumen Feed
            </div>
          </Papierstueck>
        </div>
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 3: Treffer (Herz = Portal) ==============================
const HERZ_PFAD = (s: number, ox: number, oy: number) => {
  const P = (x: number, y: number) => `${(ox + x * s).toFixed(1)},${(oy + y * s).toFixed(1)}`;
  return `M${P(50, 88)} C${P(20, 65)} ${P(0, 48)} ${P(0, 26)} C${P(0, 10)} ${P(12, 0)} ${P(26, 0)} C${P(38, 0)} ${P(46, 8)} ${P(50, 16)} C${P(54, 8)} ${P(62, 0)} ${P(74, 0)} C${P(88, 0)} ${P(100, 10)} ${P(100, 26)} C${P(100, 48)} ${P(80, 65)} ${P(50, 88)} Z`;
};
const HERZ = { s: 1.9, x: wx(2) + WALZE.w / 2 - 95, y: WALZE.y + WALZE.h / 2 - 82 };
const S3_FENSTER: Rechteck = { x: HERZ.x + 35.4 * HERZ.s, y: HERZ.y + 20 * HERZ.s, w: 29.25 * HERZ.s, h: 52 * HERZ.s };

const Szene3: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(3);
  const strich = tw(f, z.m.niete + 12, 8, 0, 1, kurve.land);
  const herzDa = f >= z.m.wort + 8;
  const puls = herzDa ? landung(f, z.m.wort + 8, 10, 1.14) : 1;
  const fahrt = FAHRT[3] as number;
  const herzFuellung = 1 - tw(f, fahrt, 8, 0, 1, kurve.fade);
  const box = { x: HERZ.x, y: HERZ.y, w: 100 * HERZ.s, h: 90 * HERZ.s };
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Strahlen f={f} bild="strahlen-gelb" grund="#B07A12" cx={540} cy={1060} tempo={0.1} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {f >= z.m.wort && <Zacken x={wx(2) + 130} y={1050} r={overshoot(f, z.m.wort, 10, 1.1) * 240} farbe={zine.rot} spitzen={13} dreh={f * 0.5} />}
        <Walzen f={f} pos={walze3} />
        {herzDa && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px`, transform: `scale(${puls})` }}>
            {/* Kartenfläche unter dem Herz (deckt die Glyphe) */}
            <div style={{ position: "absolute", left: wx(2) + 12, top: WALZE.y + 40, width: WALZE.w - 24, height: WALZE.h - 80, background: "#fff" }} />
            <Portal n={4} f={f} stufe={stufe} fenster={S3_FENSTER} box={box} form={HERZ_PFAD(HERZ.s, 0, 0)} />
            <svg style={{ position: "absolute", left: 0, top: 0, opacity: herzFuellung }} width={1080} height={1920}>
              <defs>
                <pattern id="herzRaster" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.6" fill="rgba(0,0,0,.18)" /></pattern>
              </defs>
              <path d={HERZ_PFAD(HERZ.s, HERZ.x, HERZ.y)} fill={zine.rot} />
              <path d={HERZ_PFAD(HERZ.s, HERZ.x, HERZ.y)} fill="url(#herzRaster)" />
            </svg>
          </div>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 3, 11, 8) }}>
        <Rein f={f} start={z.start} art="rutsch">
          <Papierstueck x={50} y={235} w={980} h={230} dreh={-2} seed={31} style={{ background: "#F6F1E4" }} />
        </Rein>
        <Rein f={f} start={z.start + 2} art="slap" ox={100} oy={280}>
          <div style={{ position: "absolute", left: 100, top: 250, fontFamily: "Fell", fontStyle: "italic", fontSize: 84, color: zine.schwarz, whiteSpace: "nowrap" }}>
            Meistens{" "}
            {f >= z.m.niete && (
              <span style={{ position: "relative" }}>
                Niete.
                <span style={{ position: "absolute", left: -6, top: "52%", height: 9, width: `${strich * 108}%`, background: zine.rot, transform: "rotate(-4deg)" }} />
              </span>
            )}
          </div>
        </Rein>
        <Rein f={f} start={z.m.aber} art="slap" ox={300} oy={370}>
          <div style={{ position: "absolute", left: 300, top: 345, fontFamily: "Fell", fontStyle: "italic", fontSize: 84, color: zine.schwarz }}>Aber manchmal:</div>
        </Rein>
        <Rein f={f} start={z.m.wort} art="stempel" ox={540} oy={560}>
          <Riso x={70} y={485} text="TREFFER!" size={190} dreh={-4} />
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 3, 6, 9) }}>
        <VLos x={-260} y={60} dreh={-14} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 4: Gehirn + Dopamin-Tropfen ==============================
const TROPFEN_PFAD = (s: number, ox: number, oy: number) => {
  const P = (x: number, y: number) => `${(ox + x * s).toFixed(1)},${(oy + y * s).toFixed(1)}`;
  return `M${P(50, 0)} C${P(50, 0)} ${P(95, 70)} ${P(95, 100)} C${P(95, 128)} ${P(75, 150)} ${P(50, 150)} C${P(25, 150)} ${P(5, 128)} ${P(5, 100)} C${P(5, 70)} ${P(50, 0)} ${P(50, 0)} Z`;
};
const TROPFEN = { s: 1.5, cx: 600, cy: 1590 };
const TROPFEN_BOX: Rechteck = { x: TROPFEN.cx - 50 * TROPFEN.s, y: TROPFEN.cy - 75 * TROPFEN.s, w: 100 * TROPFEN.s, h: 150 * TROPFEN.s };
const S4_FENSTER: Rechteck = { x: TROPFEN_BOX.x + 31.5 * TROPFEN.s, y: TROPFEN_BOX.y + 62 * TROPFEN.s, w: 37 * TROPFEN.s, h: (37 * TROPFEN.s * 16) / 9 };

const Szene4: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(4);
  const puls = landung(f, z.m.wort, 16, 1.08);
  const funken = [[250, 900, 0], [850, 960, 3], [190, 1300, 6], [900, 1380, 9], [560, 760, 12]];
  const gehirn = eingang(f, z.m.gehirn - 4, "unten");
  const h = ruhe(f, 4);
  const tropfenStart = z.m.wort + 14;
  const fall = tw(f, tropfenStart, 12, 0, 1, kurve.whip);
  const tropfenS = f < tropfenStart ? 0 : landung(f, tropfenStart + 10, 10, 1.06) * Math.min(1, (f - tropfenStart) / 6);
  const quetsch = 1 + Math.sin((f - tropfenStart) / 7) * 0.03 * h;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <BildFlaeche name="wolken" f={f} start={z.start} vy={-0.5} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {f >= z.m.wort && <AbsoluteFill style={{ background: `radial-gradient(circle at 540px 1170px, rgba(108,63,212,${0.32 * tw(f, z.m.wort, 8, 0, 1)}), transparent 480px)` }} />}
        {gehirn.sichtbar && (
          <Objekt bild="gehirn-frei" bw={1024} bh={1024} sc={0.78} x={540 - 400} y={1170 - 400} blur={gehirn.blur} tr={`${gehirn.tr} translateY(${Math.sin(f / 24) * 8 * h}px) scale(${puls})`} />
        )}
        {funken.map(([x, y, d], i) => (f >= z.m.wort + d ? <Zacken key={i} x={x} y={y + Math.sin((f + i * 9) / 18) * 6 * h} r={overshoot(f, z.m.wort + d, 10, 1.15) * (55 + (i % 3) * 15)} farbe={zine.gelb} spitzen={9} dreh={f * 2 + i * 30} /> : null))}
        {f >= tropfenStart && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${TROPFEN.cx}px ${TROPFEN.cy}px`, transform: `translate(${(1 - fall) * -60}px, ${(1 - fall) * -170}px) scale(${tropfenS}) scaleY(${quetsch})`, filter: "drop-shadow(0 10px 14px rgba(40,20,90,.35))" }}>
            <Portal n={5} f={f} stufe={stufe} fenster={S4_FENSTER} box={TROPFEN_BOX} form={TROPFEN_PFAD(TROPFEN.s, 0, 0)} toenung={{ farbe: zine.violett, staerke: 0.28 }} glas />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
              <path d={TROPFEN_PFAD(TROPFEN.s, TROPFEN_BOX.x, TROPFEN_BOX.y)} fill="none" stroke={zine.violett} strokeWidth={5} opacity={1 - tw(f, FAHRT[4] as number, 8, 0, 1)} />
            </svg>
          </div>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 4, 11, 8) }}>
        <Rein f={f} start={z.start} art="slap" ox={80} oy={280}>
          <div style={{ position: "absolute", left: 80, top: 255, background: "#fff", padding: "10px 20px", fontFamily: "JetBrains Mono", fontSize: 38, letterSpacing: "0.06em", color: zine.schwarz, boxShadow: "6px 9px 0 rgba(0,0,0,.2)", transform: "rotate(-1.5deg)" }}>UND DANN SCHÜTTET DEIN GEHIRN …</div>
        </Rein>
        <Rein f={f} start={z.m.wort} art="stempel" ox={540} oy={430}>
          <Rasterwort x={60} y={340} text="DOPAMIN" size={205} farbe={zine.violett} dreh={-2} />
        </Rein>
        <Rein f={f} start={tropfenStart} art="slap" ox={760} oy={570}>
          <div style={{ position: "absolute", left: 760, top: 545, background: "#fff", padding: "8px 18px", fontFamily: "JetBrains Mono", fontSize: 38, color: zine.schwarz, boxShadow: "6px 9px 0 rgba(0,0,0,.2)" }}>… AUS.</div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 4, 6, 9) }}>
        <div style={{ filter: "blur(9px)" }}>
          <Zacken x={1010} y={150} r={210} farbe={zine.gelb} spitzen={11} dreh={f * 0.3} />
        </div>
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 5 + 6: Flasche ==============================
const FL = { bw: 880, bh: 1168, sc: 540 / 880, x: 290, y: 832 };
/** Etikett-Fenster (Bildpixel 311,75 / 524,5, 247,5 × 440) in Anzeige-Pixeln des Objekts. */
const FL_FENSTER: Rechteck = { x: 311.75 * FL.sc, y: 524.5 * FL.sc, w: 247.5 * FL.sc, h: 440 * FL.sc };
const FL_BOX: Rechteck = { x: 222 * FL.sc, y: 508 * FL.sc, w: 427 * FL.sc, h: 473 * FL.sc };

const Szene5: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(5);
  const e = eingang(f, z.start + 10, "unten");
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Gross rand={<><HKaro f={f - z.start} /><RandBild name="papier" mix="multiply" deckkraft={0.5} /></>}>
          <HKaro f={f - z.start} />
          <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.5 }} />
        </Gross>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {e.sichtbar && (
          <Objekt bild="flasche-frei" bw={FL.bw} bh={FL.bh} sc={FL.sc} x={FL.x} y={FL.y} blur={e.blur} tr={`${e.tr} rotate(${4 + Math.sin(f / 30) * 1.2}deg) translateY(${Math.sin(f / 22) * 6}px)`}>
            <Etikett />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 5, 11, 8) }}>
        <Rein f={f} start={z.start} art="schreiben" dauer={52}>
          <Hand x={90} y={245} text="Viele denken, Dopamin sei das …" size={66} farbe={zine.schwarz} strich={zine.violett} />
        </Rein>
        <Rein f={f} start={z.m.wort} art="pop" ox={480} oy={520}>
          <Blase x={150} y={360} w={660} dreh={-3}>Glücks&shy;hormon!</Blase>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 5, 6, 9) }}>
        <Img src={A("papierball-frei")} style={{ position: "absolute", left: 820, top: 1620, width: 420, height: 420, filter: "blur(8px)", transform: `rotate(${f * 0.15}deg)` }} />
      </Ebene>
    </AbsoluteFill>
  );
};

const Szene6: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(6);
  const fahrt = FAHRT[6] as number;
  const etikettWeg = 1 - tw(f, fahrt, 8, 0, 1, kurve.fade);
  const riss = tw(f, z.start + 3, 10, 0, 1, kurve.land);
  const h = ruhe(f, 6);
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <BildFlaeche name="schwarz" f={f} start={z.start} vy={-0.25} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <Objekt bild="flasche-frei" bw={FL.bw} bh={FL.bh} sc={FL.sc} x={FL.x} y={FL.y} tr={`rotate(${4 * h}deg) translateY(${Math.sin(f / 22) * 6 * h}px)`}>
          <div style={{ opacity: etikettWeg }}><Etikett /></div>
          <svg style={{ position: "absolute", inset: 0, opacity: etikettWeg }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M30,30 L44,46 L36,55 L52,70 L46,86 M44,46 L58,50 M52,70 L64,66" fill="none" stroke="#fff" strokeWidth={0.9} strokeDasharray="120" strokeDashoffset={120 * (1 - riss)} />
            <path d="M30,30 L44,46 L36,55 L52,70 L46,86 M44,46 L58,50 M52,70 L64,66" fill="none" stroke={zine.schwarz} strokeWidth={0.45} strokeDasharray="120" strokeDashoffset={120 * (1 - riss)} />
          </svg>
          <Portal n={7} f={f} stufe={stufe} fenster={FL_FENSTER} box={FL_BOX} radius={6} auf={[fahrt, 8]} />
        </Objekt>
        <div style={{ opacity: etikettWeg }}>
          <Rein f={f} start={z.start + 1} art="stempel" ox={480} oy={1180}>
            <div style={{ position: "absolute", left: 150, top: 1090, transform: "rotate(-14deg)", border: "12px solid #FF3B3B", borderRadius: 20, padding: "6px 30px", color: "#FF3B3B", fontFamily: "Barlow", fontWeight: 800, fontSize: 170, letterSpacing: "0.04em", lineHeight: 1, WebkitMaskImage: "radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,.55) 75%, #000 90%)" }}>FALSCH.</div>
          </Rein>
        </div>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 6, 11, 8) }}>
        <Rein f={f} start={z.m.heisst} art="slap" ox={90} oy={300}>
          <div style={{ position: "absolute", left: 90, top: 280, fontFamily: "JetBrains Mono", fontSize: 40, color: "#C9C9C9", letterSpacing: "0.1em" }}>DOPAMIN HEISST:</div>
        </Rein>
        <Rein f={f} start={z.m.mehr} art="schreiben" dauer={30}>
          <Hand x={80} y={350} text="Da kommt noch mehr!" size={104} />
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 6, 6, 9) }}>
        <div style={{ filter: "blur(7px)" }}>
          <Papierstueck x={760} y={-80} w={520} h={300} dreh={18} seed={61} style={{ background: "#EDE6D8" }} />
        </div>
        <VKlebeband x={700} y={120} dreh={24} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 7: Büste gähnt (Mund = Portal) ==============================
const BU = { bw: 880, bh: 1168, sc: 0.75, x: 230, y: 782 };
const BU_FENSTER: Rechteck = { x: 487 * BU.sc, y: 329.5 * BU.sc, w: 40 * BU.sc, h: (40 * BU.sc * 16) / 9 };
const BU_BOX: Rechteck = { x: (507 - 38) * BU.sc, y: (365 - 42) * BU.sc, w: 76 * BU.sc, h: 84 * BU.sc };

const Szene7: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(7);
  const e = eingang(f, z.start + 4, "rechts");
  const h = ruhe(f, 7);
  const gaehn = f >= z.m.wort ? Math.sin(Math.min(1, (f - z.m.wort) / 12) * Math.PI) * -3 : 0;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <BildFlaeche name="kraft" f={f} start={z.start} vx={0.15} vy={-0.15} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {e.sichtbar && (
          <Objekt bild="bueste-frei" bw={BU.bw} bh={BU.bh} sc={BU.sc} x={BU.x} y={BU.y} blur={e.blur} tr={`${e.tr} rotate(${gaehn + Math.sin(f / 34) * 0.8 * h}deg) translateY(${Math.sin(f / 26) * 4 * h}px)`} ursprung="50% 90%">
            <Portal n={8} f={f} stufe={stufe} fenster={BU_FENSTER} box={BU_BOX} form="ellipse" toenung={{ farbe: "#000", staerke: 0.78 }} />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 7, 11, 8) }}>
        <Rein f={f} start={z.start} art="slap" ox={70} oy={290}>
          <Praegeband x={70} y={262} text="EIN ERWARTETER TREFFER" size={44} dreh={-2} />
        </Rein>
        <Rein f={f} start={z.m.zeile2} art="slap" ox={220} oy={390}>
          <Praegeband x={220} y={365} text="LÄSST ES FAST" size={44} farbe={zine.violett} dreh={2} />
        </Rein>
        <Rein f={f} start={z.m.wort} art="stempel" ox={420} oy={530}>
          <Praegeband x={300} y={470} text="KALT." size={112} farbe="#2F6FB5" dreh={-3} />
        </Rein>
        <Rein f={f} start={z.m.wort + 6} art="pop" ox={820} oy={800}>
          <div style={{ position: "absolute", left: 700, top: 820, fontFamily: "Caveat", fontWeight: 600, fontSize: 92, color: zine.schwarz, transform: "rotate(-8deg)" }}>gääähn …</div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 7, 6, 9) }}>
        <VKlebeband x={-140} y={1640} dreh={-18} />
        <VKlebeband x={760} y={60} dreh={14} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 8: Kanone (Rauch = Portal) ==============================
const KA = { bw: 1024, bh: 1024, sc: 860 / 1024, x: 70, y: 770 };
const KA_FENSTER: Rechteck = { x: 498.5 * KA.sc, y: 399 * KA.sc, w: 63 * KA.sc, h: 112 * KA.sc };
const KA_BOX: Rechteck = { x: (530 - 125) * KA.sc, y: (455 - 80) * KA.sc, w: 250 * KA.sc, h: 160 * KA.sc };

const Szene8: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(8);
  const e = eingang(f, z.start + 4, "links");
  const h = ruhe(f, 8);
  const schub = f < z.m.wort ? 0 : f < z.m.wort + 4 ? tw(f, z.m.wort, 4, 0, 1, kurve.whip) : tw(f, z.m.wort + 4, 16, 1, 0, kurve.land);
  const titel = f >= z.m.zeile2;
  const fahrt = FAHRT[8] as number;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <BildFlaeche name="wellen" f={f} start={z.start} vx={-0.45} vy={0} zoom={1.05} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {f >= z.m.wort && <Zacken x={790} y={930} r={overshoot(f, z.m.wort, 10, 1.12) * 260} farbe={zine.gelb} spitzen={14} dreh={f} />}
        {e.sichtbar && (
          <Objekt bild="kanone-frei" bw={KA.bw} bh={KA.bh} sc={KA.sc} x={KA.x} y={KA.y} blur={e.blur} tr={`${e.tr} translate(${-34 * schub}px, ${20 * schub + Math.sin(f / 25) * 4 * h}px)`}>
            <Portal n={9} f={f} stufe={stufe} fenster={KA_FENSTER} box={KA_BOX} form="ellipse" feder auf={[fahrt, 10]} />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 8, 11, 8) }}>
        <Rein f={f} start={z.start + 1} art="fall" ox={540} oy={360}>
          <Papierstueck x={60} y={235} w={960} h={330} dreh={-2} seed={21} style={{ background: "#F1ECDF", padding: "26px 40px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: "Fell SC", fontSize: 33, letterSpacing: "0.06em", color: zine.rot, whiteSpace: "nowrap", borderBottom: `4px double ${zine.schwarz}`, paddingBottom: 6 }}>EXTRABLATT · ÜBERRASCHENDER TREFFER</div>
            <div style={{ fontFamily: "Fell SC", fontSize: 86, lineHeight: 1, color: zine.schwarz, marginTop: 22, whiteSpace: "nowrap", opacity: titel ? 1 : 0, transform: `scale(${titel ? tw(f, z.m.zeile2, 6, 1.15, 1, kurve.whip) : 1})`, transformOrigin: "left center" }}>
              Löst einen <span style={{ color: zine.rot, display: "inline-block", transform: `scale(${f >= z.m.wort ? tw(f, z.m.wort, 6, 1.6, 1, kurve.whip) : 1})`, opacity: f >= z.m.wort ? 1 : 0 }}>Schub</span> aus!
            </div>
          </Papierstueck>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 8, 6, 9) }}>
        <div style={{ filter: "blur(10px)" }}>
          <Zacken x={-40} y={1720} r={230} farbe={zine.gelb} spitzen={12} dreh={-f * 0.3} />
        </div>
        <VMuenze f={f} x={880} y={1500} g={380} dreh={10} blur={9} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 9 + 10: Spirale (Mitte = Portal) ==============================
const SpiraleZ: React.FC<{ cx: number; cy: number; winkel: number; loch?: number }> = ({ cx, cy, winkel, loch = 0 }) => {
  const pts: string[] = [];
  for (let t = loch ? 5.4 : 0; t < 48 * Math.PI; t += 0.08) {
    const r = t * 13;
    pts.push(`${(Math.cos(t) * r).toFixed(1)},${(Math.sin(t) * r).toFixed(1)}`);
  }
  return (
    <svg width={4000} height={4000} viewBox="-2000 -2000 4000 4000" style={{ position: "absolute", left: cx - 2000, top: cy - 2000, transform: `rotate(${winkel}deg)` }}>
      <rect x={-2000} y={-2000} width={4000} height={4000} fill="#F2EFE8" />
      <polyline points={pts.join(" ")} fill="none" stroke={zine.schwarz} strokeWidth={42} />
      {loch > 0 && <circle cx={0} cy={0} r={loch + 6} fill="none" stroke={zine.schwarz} strokeWidth={14} />}
    </svg>
  );
};
const S9_LOCH = { cx: 540, cy: 1640, r: 70 };
const S9_FENSTER: Rechteck = { x: S9_LOCH.cx - 34.25, y: S9_LOCH.cy - 61, w: 68.5, h: 121.8 };

const Szene9: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(9);
  const h = ruhe(f, 9);
  const flip = Math.cos((f - z.start) * 0.22 * (0.3 + 0.7 * h));
  const scheibe = f >= z.m.wort ? landung(f, z.m.wort, 10, 1.05) * Math.min(1, (f - z.m.wort + 1) / 4) : 0;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <div style={{ position: "absolute", left: -1200, top: -1200, width: 3480, height: 4320, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 1200, top: 1200 }}>
            <SpiraleZ cx={S9_LOCH.cx} cy={S9_LOCH.cy} winkel={f * 0.6} loch={S9_LOCH.r} />
          </div>
        </div>
        <Img src={A("papier")} style={{ position: "absolute", left: -300, top: -400, width: 1680, height: 2720, objectFit: "cover", mixBlendMode: "multiply", opacity: 0.4 }} />
        <Portal n={10} f={f} stufe={stufe} fenster={S9_FENSTER} box={{ x: S9_LOCH.cx - S9_LOCH.r, y: S9_LOCH.cy - S9_LOCH.r, w: S9_LOCH.r * 2, h: S9_LOCH.r * 2 }} form="ellipse" />
        {scheibe > 0 && (
          <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 1080px", transform: `scale(${scheibe})` }}>
            <div style={{ position: "absolute", left: 540 - 400, top: 1080 - 400, width: 800, height: 800, borderRadius: "50%", background: "#F2EFE8", boxShadow: `0 0 0 8px ${zine.schwarz}, 0 20px 40px rgba(0,0,0,.25)` }} />
            <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 1080px", transform: `rotate(${(f - z.m.wort) * 0.8}deg)` }}>
              <Kreistext cx={540} cy={1080} r={320} text="UNGEWISS · UNGEWISS · UNGEWISS · " size={78} farbe={zine.rot} />
            </div>
          </div>
        )}
        <Objekt bild="muenze-frei" bw={1024} bh={1024} sc={520 / 1024} x={540 - 260} y={1080 - 260} tr={`scale(${f < z.start + 3 ? 0 : overshoot(f, z.start + 3, 12, 1.08)}) translateY(${Math.sin(f / 20) * 14 * h}px) scaleX(${0.25 + 0.75 * Math.abs(flip)})`} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 9, 11, 8) }}>
        <Rein f={f} start={z.start} art="slap" ox={100} oy={300}>
          <div style={{ position: "absolute", left: 70, right: 130, top: 255, background: "#fff", border: `4px solid ${zine.schwarz}`, padding: "14px 26px", fontFamily: "Fell", fontStyle: "italic", fontSize: 78, lineHeight: 1, transform: "rotate(-2deg)", boxShadow: "8px 12px 0 rgba(0,0,0,.25)" }}>Am stärksten wirkt es,<br />wenn es …</div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 9, 6, 9) }}>
        <VMuenze f={f} x={-200} y={1380} g={460} dreh={-30} blur={9} />
        <VMuenze f={-f} x={860} y={520} g={300} dreh={40} blur={10} />
      </Ebene>
    </AbsoluteFill>
  );
};

/** Szene 10: Spirale dahinter, «WEITER.»-Stapel oben, Handy-Feed unten (nächste Kachel = Szene 11). */
const S10_SC = 0.9;
const S10_POS = { x: 1090 - H.bw * S10_SC, y: 860 };
const Kachel: React.FC<{ gelb?: boolean }> = ({ gelb }) => (
  <div style={{ width: 1080, height: 1920, background: gelb ? zine.gelb : "#F4F1EA", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
    <div style={{ fontFamily: "Barlow", fontWeight: 800, fontSize: 210, lineHeight: 0.9, textAlign: "center", color: zine.schwarz, letterSpacing: "-0.03em" }}>NUR<br />NOCH<br />EINS.</div>
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 60, color: "#555" }}>♥ 12 412</div>
  </div>
);
const Szene10: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(10);
  const zeilen = [z.m.weiter1, z.m.weiter1 + 6, z.m.und, z.m.und + 5, z.m.wort];
  const scrolls = [z.m.weiter1 + 10, z.m.und - 4, z.m.wort + 2, (FAHRT[10] as number) - 10];
  let pos = 0;
  scrolls.forEach((s) => (pos += tw(f, s, 9, 0, 1, kurve.heavy)));
  const h = ruhe(f, 10);
  const sc = S10_SC;
  const fenster = { x: HANDY_FENSTER_B.x * sc, y: HANDY_FENSTER_B.y * sc, w: HANDY_FENSTER_B.w * sc, h: HANDY_FENSTER_B.h * sc };
  const e = eingang(f, z.start + 6, "unten");
  const feed = (
    <div style={{ position: "absolute", left: fenster.x - HANDY_SCHIRM_B.x * sc, top: fenster.y - HANDY_SCHIRM_B.y * sc, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${fenster.w / 1080})` }}>
      <div style={{ position: "absolute", left: 0, top: -pos * 1920 }}>
        {[<div key="0" style={{ width: 1080, height: 1920, background: "#F4F1EA" }} />, <Kachel key="1" />, <Kachel key="2" />, <Kachel key="3" gelb />].map((k, i) => (
          <div key={i} style={{ position: "absolute", top: i * 1920 - 1920 + 1920 }}>{k}</div>
        ))}
      </div>
    </div>
  );
  // Szene 11 ist die 5. Kachel (Position 4): eigenes Portal, das mitscrollt
  const s11Top = (4 - pos) * fenster.h;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <div style={{ position: "absolute", left: -1200, top: -1200, width: 3480, height: 4320, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 1200, top: 1200 }}>
            <SpiraleZ cx={540} cy={960} winkel={f * 2.4} />
          </div>
        </div>
        <Img src={A("papier")} style={{ position: "absolute", left: -300, top: -400, width: 1680, height: 2720, objectFit: "cover", mixBlendMode: "multiply", opacity: 0.4 }} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {e.sichtbar && (
          <Objekt bild="hand-b-frei" bw={H.bw} bh={H.bh} sc={sc} x={S10_POS.x} y={S10_POS.y} blur={e.blur} tr={`${e.tr} translateY(${Math.sin(f / 26) * 5 * h}px) rotate(${Math.sin(f / 40) * 0.6 * h}deg)`} ursprung={`${470 * sc}px ${760 * sc}px`}>
            <div style={{ position: "absolute", left: HANDY_SCHIRM_B.x * sc, top: HANDY_SCHIRM_B.y * sc, width: HANDY_SCHIRM_B.w * sc, height: HANDY_SCHIRM_B.h * sc, borderRadius: 16 * sc, background: "#E9E1CF", overflow: "hidden" }}>
              {feed}
            </div>
            {pos > 2.6 && (
              <div style={{ position: "absolute", left: HANDY_SCHIRM_B.x * sc, top: HANDY_SCHIRM_B.y * sc, width: HANDY_SCHIRM_B.w * sc, height: HANDY_SCHIRM_B.h * sc, borderRadius: 16 * sc, overflow: "hidden" }}>
                <Portal n={11} f={f} stufe={stufe} fenster={{ x: fenster.x - HANDY_SCHIRM_B.x * sc, y: fenster.y - HANDY_SCHIRM_B.y * sc + s11Top, w: fenster.w, h: fenster.h }} box={{ x: 0, y: Math.max(0, s11Top - 40), w: HANDY_SCHIRM_B.w * sc, h: HANDY_SCHIRM_B.h * sc }} />
              </div>
            )}
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 10, 11, 8) }}>
        <Rein f={f} start={z.start} art="rutsch">
          <Papierstueck x={30} y={215} w={1010} h={640} dreh={-2} seed={14} style={{ background: zine.papier }} />
        </Rein>
        <Rein f={f} start={z.start + 3} art="slap" ox={90} oy={260}>
          <div style={{ position: "absolute", left: 90, top: 245, fontFamily: "JetBrains Mono", fontSize: 40, letterSpacing: "0.08em", color: zine.schwarz }}>DARUM SCROLLST DU …</div>
        </Rein>
        {zeilen.map((s, i) => {
          if (f < s) return null;
          const size = 56 + (94 * i) / 4;
          let top = 310;
          for (let k = 0; k < i; k++) top += (56 + (94 * k) / 4) * 0.88;
          return <div key={i} style={{ position: "absolute", left: 90, top, fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.88, letterSpacing: "-0.03em", color: i % 2 ? zine.rot : zine.schwarz, transform: `scale(${tw(f, s, 5, 1.3, 1, kurve.whip)})`, transformOrigin: "left center" }}>WEITER.</div>;
        })}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 10, 6, 9) }}>
        <div style={{ position: "absolute", left: -120, top: 1650, transform: "rotate(-10deg)", background: zine.gelb, border: `6px solid ${zine.schwarz}`, fontFamily: "Barlow", fontWeight: 800, fontSize: 110, padding: "10px 40px", filter: "blur(8px)" }}>NUR NOCH EINS.</div>
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 11: Laptop (mittlere Mini-Walze = Portal) ==============================
const LA = { bw: 1168, bh: 880, sc: 940 / 1168, x: 70, y: 876 };
const LA_SCHIRM = { x: 274 * LA.sc, y: 149 * LA.sc, w: 612 * LA.sc, h: 375 * LA.sc };
const MINI = { w: 80, h: 128, gap: 14 };
const MINI_X = LA_SCHIRM.x + (LA_SCHIRM.w - (3 * MINI.w + 2 * MINI.gap)) / 2;
const MINI_Y = LA_SCHIRM.y + 29 + (LA_SCHIRM.h - 29 - MINI.h) / 2;
const LA_BOX: Rechteck = { x: MINI_X + MINI.w + MINI.gap + 3, y: MINI_Y + 3, w: MINI.w - 6, h: MINI.h - 6 };
const LA_FENSTER: Rechteck = { x: LA_BOX.x + (LA_BOX.w - (LA_BOX.h * 9) / 16) / 2, y: LA_BOX.y, w: (LA_BOX.h * 9) / 16, h: LA_BOX.h };

const Szene11: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(11);
  const mark = tw(f, z.m.wort, 10, 0, 1, kurve.land);
  const e = eingang(f, z.start + 4, "unten");
  const h = ruhe(f, 11);
  const fahrt = FAHRT[11] as number;
  const mini = (x: number, i: number) => (i === 1 ? walzenPos(x, z.start + 10, z.m.wort + 10, 1, 3) : walzenPos(x, z.start + 10 + i * 3, 99999, [1, 3, 5][i], 0));
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Gross rand={<><AbsoluteFill style={{ background: zine.zeitung }} /><RandBild name="papier" mix="multiply" deckkraft={0.6} /></>}>
          <HZeitung f={f - z.start + 200} />
          <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.6 }} />
        </Gross>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {e.sichtbar && (
          <Objekt bild="laptop-frei" bw={LA.bw} bh={LA.bh} sc={LA.sc} x={LA.x} y={LA.y} blur={e.blur} tr={`${e.tr} translateY(${Math.sin(f / 24) * 4 * h}px)`}>
            <div style={{ position: "absolute", left: LA_SCHIRM.x, top: LA_SCHIRM.y, width: LA_SCHIRM.w, height: LA_SCHIRM.h, background: "#F4F1EA", overflow: "hidden" }}>
              <div style={{ height: 29, background: zine.violett, color: "#fff", fontFamily: "Barlow", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", paddingLeft: 12 }}>deine-firma.ch</div>
            </div>
            <div style={{ position: "absolute", left: MINI_X, top: MINI_Y, display: "flex", gap: MINI.gap }}>
              {[0, 1, 2].map((i) => {
                const p = mini(f, i);
                return <Walze key={i} p={p} tempo={Math.abs(mini(f + 1, i) - p)} w={MINI.w} h={MINI.h} />;
              })}
            </div>
            <Portal n={12} f={f} stufe={stufe} fenster={LA_FENSTER} box={LA_BOX} radius={5} auf={[fahrt, 8]} />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 11, 11, 8) }}>
        <Rein f={f} start={z.start} art="fall" ox={520} oy={330}>
          <div style={{ position: "absolute", left: 80, top: 240, width: 900, transform: "rotate(-2deg)", background: "#FBF8F0", boxShadow: "8px 12px 0 rgba(0,0,0,.22)", padding: "30px 40px 36px", backgroundImage: "repeating-linear-gradient(transparent 0 66px, #C9D5EA 66px 68px)", backgroundPosition: "0 44px" }}>
            <div style={{ position: "absolute", left: 360, top: -26, width: 170, height: 50, background: "rgba(240,234,210,.85)", transform: "rotate(-4deg)" }} />
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 54, lineHeight: "68px", color: "#222" }}>Deine Firma steckt</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 54, lineHeight: "68px", color: "#222" }}>
              in derselben{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ position: "absolute", left: -8, right: -8, top: 8, bottom: 6, background: zine.gelb, transformOrigin: "left center", transform: `scaleX(${mark}) rotate(-1deg)` }} />
                <span style={{ position: "relative" }}>Walze.</span>
              </span>
            </div>
          </div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 11, 6, 9) }}>
        <VLos x={760} y={1660} dreh={12} farbe="#F4EFE4" />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 12: Sanduhr (leerer Glaskolben = Portal) ==============================
const SU = { bw: 880, bh: 1168, sc: 500 / 880, x: 310, y: 918 };
const SU_FENSTER: Rechteck = { x: 399 * SU.sc, y: 236 * SU.sc, w: 72 * SU.sc, h: 128 * SU.sc };
const SU_BOX: Rechteck = { x: (435 - 150) * SU.sc, y: (300 - 80) * SU.sc, w: 300 * SU.sc, h: 160 * SU.sc };

const Szene12: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(12);
  const h = ruhe(f, 12);
  const wack = f >= z.m.wort ? Math.sin((f - z.m.wort) * 0.5) * Math.exp(-(f - z.m.wort) / 10) * 10 : 0;
  const pop = f < z.start + 2 ? 0 : overshoot(f, z.start + 2, 12, 1.08);
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Gross rand={<><HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" f={f} /><RandBild name="papier" mix="multiply" deckkraft={0.4} /></>}>
          <HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" f={f} />
          <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.4 }} />
        </Gross>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {pop > 0 && (
          <Objekt bild="sanduhr-frei" bw={SU.bw} bh={SU.bh} sc={SU.sc} x={SU.x} y={SU.y} tr={`scale(${pop}) rotate(${wack * h}deg) translateY(${Math.sin(f / 22) * 6 * h}px)`}>
            {/* rieselnder Sand */}
            <div style={{ position: "absolute", left: 437 * SU.sc - 1.5, top: 590 * SU.sc, width: 3, height: 230 * SU.sc, background: `repeating-linear-gradient(${"#8b7a5c"} 0 6px, transparent 6px 10px)`, backgroundPositionY: `${f * 3}px`, opacity: 0.8 }} />
            <Portal n={13} f={f} stufe={stufe} fenster={SU_FENSTER} box={SU_BOX} form="ellipse" toenung={{ farbe: "#EDE3C8", staerke: 0.45 }} glas />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 12, 11, 8) }}>
        <Rein f={f} start={z.m.wort} art="stempel" ox={180} oy={420}>
          <div style={{ position: "absolute", left: 70, top: 230, fontFamily: "Barlow", fontWeight: 800, fontSize: 430, lineHeight: 0.8, color: "#fff", letterSpacing: "-0.05em", textShadow: "10px 12px 0 rgba(0,0,0,.25)" }}>1</div>
        </Rein>
        <Rein f={f} start={z.m.wort + 6} art="slap" ox={330} oy={320}>
          <div style={{ position: "absolute", left: 330, top: 275, fontFamily: "Rye", fontSize: 98, color: zine.gelb, lineHeight: 1, textShadow: `5px 5px 0 ${zine.schwarz}` }}>SEKUNDE</div>
        </Rein>
        <Rein f={f} start={z.m.wort + 16} art="slap" ox={335} oy={410}>
          <div style={{ position: "absolute", left: 335, top: 400, fontFamily: "JetBrains Mono", fontSize: 40, color: "#fff" }}>entscheidet:</div>
        </Rein>
        <Rein f={f} start={z.m.weiter} art="slap" ox={335} oy={480}>
          <div style={{ position: "absolute", left: 335, top: 460, fontFamily: "Barlow", fontWeight: 800, fontSize: 64, color: "#fff" }}>WEITER —</div>
        </Rein>
        <Rein f={f} start={z.m.stopp - 4} art="stempel" ox={540} oy={590}>
          <div style={{ position: "absolute", left: 335, top: 540, fontFamily: "Barlow", fontWeight: 800, fontSize: 64, color: "#fff" }}>
            oder <span style={{ background: zine.gelb, color: zine.schwarz, padding: "0 12px" }}>STOPP.</span>
          </div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 12, 6, 9) }}>
        <VMuenze f={f} x={-160} y={1500} g={420} dreh={15} blur={9} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 13: Niete oder Treffer (Pokal = Portal) ==============================
const PK = { bw: 880, bh: 1168, sc: 0.5, x: 590, y: 908 };
const PK_FENSTER: Rechteck = { x: 365.5 * PK.sc, y: 200 * PK.sc, w: 169 * PK.sc, h: 300 * PK.sc };
const PK_BOX: Rechteck = { x: (450 - 175) * PK.sc, y: (350 - 200) * PK.sc, w: 350 * PK.sc, h: 400 * PK.sc };

const Szene13: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(13);
  const strich = tw(f, z.m.niete + 6, 8, 0, 1, kurve.land);
  const h = ruhe(f, 13);
  const ball = eingang(f, z.start + 6, "oben");
  const pokal = eingang(f, z.m.wort - 3, "unten");
  const fahrt = FAHRT[13] as number;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Gross style={{ background: "#151515" }} rand={<div style={{ position: "absolute", left: 850 + KERN.x - RAND.x, top: -200, width: 4000, height: 8400, background: zine.gelb, transform: "rotate(3deg)", transformOrigin: `0 ${3100 + 420}px` }} />}>
          {/* Papier über Kern */}
          <div style={{ position: "absolute", left: 850, top: -100, width: 1000, height: 3000, background: zine.gelb, transform: "rotate(3deg)" }} />
          <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.45 }} />
        </Gross>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {ball.sichtbar && <Objekt bild="papierball-frei" bw={1024} bh={1024} sc={330 / 1024} x={270 - 165} y={1250 - 165} blur={ball.blur} tr={`${ball.tr} rotate(${-8 + Math.sin(f / 30) * 2 * h}deg)`} />}
        {f >= z.m.wort && <Zacken x={810} y={1170} r={overshoot(f, z.m.wort, 10, 1.1) * 260} farbe={zine.rot} spitzen={14} dreh={f * 0.6} />}
        {pokal.sichtbar && (
          <Objekt bild="pokal-frei" bw={PK.bw} bh={PK.bh} sc={PK.sc} x={PK.x} y={PK.y} blur={pokal.blur} tr={`${pokal.tr} rotate(${5 * h}deg) translateY(${Math.sin(f / 22) * 5 * h}px)`}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.25 + 0.75 * tw(f, fahrt, 8, 0, 1, kurve.fade), mixBlendMode: f >= fahrt + 8 ? "normal" : "multiply" }}>
              <Portal n={14} f={f} stufe={stufe} fenster={PK_FENSTER} box={PK_BOX} form="ellipse" />
            </div>
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 13, 11, 8) }}>
        <Rein f={f} start={z.m.niete} art="slap" ox={80} oy={330}>
          <div style={{ position: "absolute", left: 80, top: 270, fontFamily: "Fell SC", fontSize: 130, color: "#8A8A8A" }}>
            Niete
            <span style={{ position: "absolute", left: -10, top: "50%", height: 12, width: `${strich * 112}%`, background: zine.rot, transform: "rotate(-5deg)" }} />
          </div>
        </Rein>
        <Rein f={f} start={z.m.oder} art="pop" ox={560} oy={470}>
          <div style={{ position: "absolute", left: 470, top: 430, fontFamily: "Caveat", fontWeight: 600, fontSize: 80, color: "#fff", transform: "rotate(-6deg)", textShadow: "3px 3px 0 #000" }}>oder …</div>
        </Rein>
        <Rein f={f} start={z.m.wort} art="stempel" ox={800} oy={600}>
          <div style={{ position: "absolute", left: 560, top: 540, fontFamily: "Rye", fontSize: 98, color: zine.schwarz, transform: "rotate(4deg)" }}>Treffer?</div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 13, 6, 9) }}>
        <Img src={A("papierball-frei")} style={{ position: "absolute", left: -220, top: 1560, width: 520, height: 520, filter: "blur(10px)", transform: `rotate(${f * 0.12}deg)` }} />
        <VMuenze f={f} x={900} y={60} g={280} dreh={20} blur={10} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 14: CTA ==============================
const Szene14: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(14);
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Strahlen f={f} bild="strahlen-violett" grund="#3A1F7A" cx={540} cy={1000} tempo={0.1} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <Rein f={f} start={z.ende - 4} art="pop" ox={540} oy={960}>
          <div style={{ position: "absolute", left: 160, right: 160, top: 840, background: "#F6F1E4", padding: "28px 40px", transform: `rotate(${-2 + Math.sin(f / 30) * 0.6}deg)`, boxShadow: "10px 14px 0 rgba(0,0,0,.3)", filter: weisserRand(6), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Img src={A("logo")} style={{ width: 520 }} />
            <div style={{ background: zine.schwarz, color: "#fff", fontFamily: "Barlow", fontWeight: 800, fontSize: 56, padding: "10px 34px" }}>@solleva.ch</div>
          </div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 14, 11, 8) }}>
        <ErpresserAnim text="FOLGE" x={200} y={360} size={150} versatz={5} start={z.start} takt={3} f={f} />
        <ErpresserAnim text="FÜR MEHR" x={100} y={560} size={124} versatz={2} start={z.m.mehr} takt={2} f={f} />
        <Rein f={f} start={z.ende + 10} art="slap" ox={540} oy={1330}>
          <div style={{ position: "absolute", left: 150, top: 1300, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 40, letterSpacing: "0.1em", padding: "10px 22px", transform: "rotate(2deg)" }}>HEB DICH VON DER MASSE AB.</div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 14, 6, 9) }}>
        <VMuenze f={f} x={820} y={1560} g={460} dreh={-10} blur={9} />
        <VMuenze f={-f} x={-140} y={80} g={300} dreh={35} blur={10} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szenen-Register + Kamera ==============================
const SZENEN: Record<number, React.FC<SzProps>> = {
  1: Szene1, 2: Szene2, 3: Szene3, 4: Szene4, 5: Szene5, 6: Szene6, 7: Szene7, 8: Szene8, 9: Szene9, 10: Szene10, 11: Szene11, 12: Szene12, 13: Szene13, 14: Szene14,
};

/** Fenster der Fahrt aus Szene n (Weltkoordinaten der Hauptebene, Objekt in Ruhe). */
const fahrtFenster = (n: number): Rechteck => {
  const plus = (o: { x: number; y: number }, r: Rechteck): Rechteck => ({ x: o.x + r.x, y: o.y + r.y, w: r.w, h: r.h });
  switch (n) {
    case 1: return { x: S1_POS.x + HANDY_FENSTER_B.x * S1_SC, y: S1_POS.y + HANDY_FENSTER_B.y * S1_SC, w: HANDY_FENSTER_B.w * S1_SC, h: HANDY_FENSTER_B.h * S1_SC };
    case 2: return S2_FENSTER;
    case 3: return S3_FENSTER;
    case 4: return S4_FENSTER;
    case 6: return plus(FL, FL_FENSTER);
    case 7: return plus(BU, BU_FENSTER);
    case 8: return plus(KA, KA_FENSTER);
    case 9: return S9_FENSTER;
    case 10: return { x: S10_POS.x + HANDY_FENSTER_B.x * S10_SC, y: S10_POS.y + HANDY_FENSTER_B.y * S10_SC, w: HANDY_FENSTER_B.w * S10_SC, h: HANDY_FENSTER_B.h * S10_SC };
    case 11: return plus(LA, LA_FENSTER);
    case 12: return plus(SU, SU_FENSTER);
    case 13: return plus(PK, PK_FENSTER);
    default: return { x: 0, y: 0, w: 1080, h: 1920 };
  }
};

/** Kleiner Kamera-Impuls auf Schlüsselwörtern (Treffer, Falsch, Schub). */
const impulse = [Z(3).m.wort, Z(6).start + 1, Z(8).m.wort];
const impuls = (f: number) => {
  let s = 0;
  for (const r of impulse) if (f >= r && f < r + 16) s += tw(f, r, 3, 0, 0.025, kurve.whip) - tw(f, r + 3, 13, 0, 0.025, kurve.land);
  return s;
};

const zoomCam = (cam0: Cam, r: Rechteck, t: number): Cam => {
  const e = kurve.heavy(Math.max(0, Math.min(1, t)));
  const ziel = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  const s1 = 1080 / r.w;
  const s = Math.exp(Math.log(cam0.s) + (Math.log(s1) - Math.log(cam0.s)) * e);
  const p0 = { x: (ziel.x - cam0.cx) * cam0.s + MITTE.x, y: (ziel.y - cam0.cy) * cam0.s + MITTE.y };
  const p = { x: p0.x + (MITTE.x - p0.x) * e, y: p0.y + (MITTE.y - p0.y) * e };
  return { s, cx: ziel.x - (p.x - MITTE.x) / s, cy: ziel.y - (p.y - MITTE.y) / s };
};

export const kamera = (f: number): { szene: number; cam: Cam } => {
  let n = 1;
  for (let k = 2; k <= 14; k++) if (f >= beginn(k)) n = k;
  const start = beginn(n);
  const fahrt = FAHRT[n];
  const dauer = fahrt != null ? fahrt - start : REEL_DAUER - start;
  const d = (x: number) => {
    const c = drift(x, start, Math.max(30, dauer), n);
    return { ...c, s: c.s + impuls(x) };
  };
  if (fahrt != null && f >= fahrt) return { szene: n, cam: zoomCam(d(fahrt), fahrtFenster(n), (f - fahrt) / ZOOM) };
  return { szene: n, cam: d(f) };
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  const { szene, cam } = kamera(f);
  const S = SZENEN[szene];
  return (
    <Leicht.Provider value={cam.s > 2}>
      <S f={f} cam={cam} stufe={0} />
    </Leicht.Provider>
  );
};

// ============================== Ton (minimal, natürlich) ==============================
const Toene: React.FC = () => {
  const T: React.ReactNode[] = [];
  const t = (nr: string, bei: number, vol: number, max?: number) => T.push(<Ton key={`${nr}-${bei}-${T.length}`} nr={nr} bei={bei} vol={vol} max={max} />);
  const z = Z;
  const zoomTon = ["whoosh-03", "swish-06", "whoosh-02", "papier-04"];
  [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13].forEach((n, i) => t(zoomTon[i % zoomTon.length], (FAHRT[n] as number) + 11, 0.18));
  // 1
  t("papier-02", z(1).start, 0.16); t("papier-03", z(1).m.zeile2, 0.14);
  [0, 10, 26].forEach((d) => t("klick-04", z(1).m.wort + d, 0.14));
  t("ratsche-19", z(1).m.wort + 4, 0.14, 1.0); t("ratsche-12", 100, 0.16); t("ratsche-12", 111, 0.16); t("schlag-07", 124, 0.22);
  // 2
  t("ratsche-18", SPIN2 + 2, 0.11, 1.4); t("papier-01", z(2).start + 37, 0.2); t("schlag-02", z(2).m.wort, 0.22);
  // 3
  t("papier-02", z(3).start + 2, 0.14); t("ratsche-12", z(3).m.niete + 8, 0.16); t("ratsche-12", z(3).m.aber - 6, 0.16); t("schlag-02", z(3).m.wort, 0.24); t("schlag-07", z(3).m.wort + 8, 0.14);
  // 4
  t("papier-02", z(4).start, 0.14); t("swish-06", z(4).m.gehirn - 6, 0.16); t("schlag-07", z(4).m.wort, 0.2);
  // 5
  t("schreiben-02", z(5).start + 2, 0.18, 1.6); t("swish-06", z(5).start + 8, 0.14); t("papier-02", z(5).m.wort, 0.16);
  // 6 Bruch
  t("schlag-02", z(6).start + 1, 0.3); t("papier-04", z(6).start + 2, 0.12); t("papier-02", z(6).m.heisst, 0.14); t("schreiben-02", z(6).m.mehr, 0.18, 1.0);
  // 7
  t("klick-05", z(7).start, 0.14); t("klick-05", z(7).m.zeile2, 0.14); t("schlag-07", z(7).m.wort, 0.22);
  // 8
  t("papier-05", z(8).start + 6, 0.18, 0.9); t("papier-02", z(8).m.zeile2, 0.14); t("schlag-02", z(8).m.wort, 0.3); t("whoosh-02", z(8).m.wort + 2, 0.12);
  // 9
  t("klick-03", z(9).start + 3, 0.14); t("ratsche-07", z(9).start + 12, 0.08, 1.4); t("papier-01", z(9).m.wort, 0.18);
  // 10
  [z(10).m.weiter1, z(10).m.und, z(10).m.wort].forEach((s) => t("klick-04", s, 0.14));
  [z(10).m.weiter1 + 10, z(10).m.und - 4, z(10).m.wort + 2].forEach((s) => t("papier-03", s + 3, 0.12));
  // 11
  t("papier-01", z(11).start + 8, 0.18); t("ratsche-19", z(11).start + 12, 0.1, 1.2); t("schreiben-02", z(11).m.wort, 0.16, 0.5);
  // 12
  t("klick-03", z(12).start + 2, 0.14); t("schlag-02", z(12).m.wort, 0.26); t("klick-04", z(12).m.wort + 16, 0.14); t("papier-02", z(12).m.weiter, 0.14); t("schlag-07", z(12).m.stopp, 0.22);
  // 13
  t("swish-06", z(13).start + 6, 0.14); t("schlag-07", z(13).start + 17, 0.16); t("papier-02", z(13).m.niete, 0.14); t("schreiben-02", z(13).m.oder, 0.16, 0.7); t("schlag-02", z(13).m.wort, 0.24);
  // 14
  for (let i = 0; i < 5; i += 2) t("klick-04", z(14).start + i * 3, 0.14);
  for (let i = 0; i < 8; i += 3) t("klick-04", z(14).m.mehr + i * 2, 0.14);
  t("schlag-02", z(14).ende - 4, 0.26); t("papier-02", z(14).ende + 10, 0.14);
  return <>{T}</>;
};

// ============================== Komposition ==============================
export const ReelV2Voll: React.FC = () => {
  const f = useCurrentFrame();
  const a = kamera(f - 0.5);
  const b = kamera(f + 0.5);
  const tempo = a.szene === b.szene ? Math.abs(Math.log(b.cam.s) - Math.log(a.cam.s)) : 0;
  return (
    <AbsoluteFill style={{ background: zine.schwarz }}>
      <ZineSchriften />
      <Bewegungsunschaerfe f={f} tempo={tempo} render={(x) => <Welt f={x} />} />
      <Filmlook />
      {SAETZE.map((s) => (
        <Sequence key={s.nr} from={s.start} layout="none">
          <Audio src={staticFile(`reels/spielautomat/stimme/${s.datei}`)} />
        </Sequence>
      ))}
      <Toene />
    </AbsoluteFill>
  );
};

/** Nur zur Fehlersuche: Portal mit Szene 4 in grosser Box. */
export const PortalDebug: React.FC = () => (
  <AbsoluteFill style={{ background: "#f0f" }}>
    <ZineSchriften />
    <Portal n={4} f={380} stufe={0} fenster={{ x: 400, y: 700, w: 280, h: 497.8 }} box={{ x: 100, y: 400, w: 880, h: 1100 }} />
  </AbsoluteFill>
);
