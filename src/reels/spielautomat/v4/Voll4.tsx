import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { kurve, landung, overshoot, tw } from "../../../lib/bewegung";
import { Ton } from "../../../lib/kamera";
import { Bewegungsunschaerfe, Cam, Ebene, Filmlook, MITTE, Rechteck, RUHE, TIEFE } from "../../../kamera/welt";
import {
  HPunkte, HZeitung, Papierstueck, Rasterwort, Riso, weisserRand, Zacken, Zeitung, zine, ZineSchriften,
} from "../../../stil/halbton";
import { Rein } from "../Reel";
import { ErpresserAnim, walzenPos } from "../Stiltest";
import { SAETZE3, V3_DAUER } from "../v3/zeiten3";

// ============================================================================
// Reel «Spielautomat» v4: wie v3 (Timing/Stimme identisch), Bildebene überarbeitet:
// grösserer Hook, keine leeren Papierflächen, Kontrast, Instagram-Safe-Zones (x 60–940, y 250–1550),
// keine Münzen, Loop-Ende, Walzen mit austauschbaren Karten (assets/cards, 2:3).
// Durchgehende Kamera K01, Zoom-Through in Schlüsselobjekte (0,7 s), Ebenen mit Tiefe.
// ============================================================================
export const V4_DAUER = V3_DAUER;
type Satz = { nr: number; start: number; ende: number; datei: string; m: Record<string, number> };
/** Satz nach Original-Nummer (1, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14). */
const Z = (n: number) => SAETZE3.find((s) => s.nr === n) as unknown as Satz;
const A = (name: string) => staticFile(`assets/spielautomat/${name}.png`);
const ZOOM = 21; // 0,7 s, cubic-bezier(0.65, 0, 0.15, 1)

type SzProps = { f: number; cam: Cam; stufe: number; camT?: Cam };

// ---------- Szenen: 1 Hook · 2 Dreh+Treffer · 3 Dopamin (Lupe) · 4 Schub · 5 Weiter · 6 Firma · 7 Sekunde+Niete/Treffer · 8 CTA ----------
const FAHRT: Record<number, number | null> = {
  1: Z(2).start - 6,
  2: Z(4).start - 4,
  3: Z(8).start - 4,
  4: Z(10).start - 4,
  5: Z(11).start,
  6: Z(12).start - 4,
  7: Z(14).start - 4,
};
const beginn = (n: number) => (n === 1 ? 0 : (FAHRT[n - 1] as number) + ZOOM);
/** Idle klingt vor der Fahrt aus, damit das Fenster beim Zoom still steht. */
const ruhe = (f: number, n: number) => {
  const s = FAHRT[n];
  return s == null ? 1 : 1 - tw(f, s - 12, 10, 0, 1, kurve.land);
};
/** Während der Fahrt fliegen Vordergrund und Text der alten Szene unscharf vorbei und blenden aus. */
const weg = (f: number, n: number, ab: number, dauer: number) => {
  const s = FAHRT[n];
  return s == null ? 1 : 1 - tw(f, s + ab, dauer, 0, 1, kurve.fade);
};
/** Text fliegt raus (whip nach oben + ausblenden), wenn der Satz wechselt. */
const raus = (f: number, start: number) => ({ transform: `translateY(${tw(f, start, 7, 0, -260, kurve.whip)}px)`, opacity: 1 - tw(f, start + 2, 5, 0, 1, kurve.fade) });


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

// ---------- Karten-Walze: Symbole sind austauschbare Bilder in assets/cards (2:3) ----------
/** Reihenfolge = Walzen-Index (wie bisher): 0 treffer, 1 niete, 2 stern, 3 frage, 4 klee, 5 niete. */
const KARTEN = ["treffer", "niete", "stern", "frage", "klee", "niete"];
const KartenWalze: React.FC<{ p: number; tempo: number; w: number }> = ({ p, tempo, w }) => {
  const h = w * 1.5;
  const n = KARTEN.length;
  const off = ((p % n) + n) % n;
  const rand = Math.max(3, w * 0.018);
  return (
    <div style={{ width: w, height: h, overflow: "hidden", borderRadius: w * 0.07, position: "relative", background: "#F7F2E6" }}>
      <div style={{ transform: `translateY(${-off * h}px)`, filter: tempo > 0.02 ? `blur(${Math.min(10, tempo * 14)}px)` : undefined }}>
        {[...KARTEN, ...KARTEN].map((k, i) => (
          <Img key={i} src={staticFile(`assets/cards/${k}.png`)} style={{ display: "block", width: w, height: h }} />
        ))}
      </div>
      {/* Walzenfenster: Rahmen und Schatten liegen über der Karte, verändern ihre Grösse nicht */}
      <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.07, boxShadow: `inset 0 0 0 ${rand}px ${zine.schwarz}, inset 0 18px 18px rgba(0,0,0,.16), inset 0 -18px 18px rgba(0,0,0,.16)` }} />
    </div>
  );
};

/** Hook-Etikett: wie EtikettAnim, aber gross genug fürs Handy (62 px). */
const HookLabel: React.FC<{ text: string; x: number; y: number; dreh: number; start: number; f: number }> = ({ text, x, y, dreh, start, f }) => {
  if (f < start - 1) return null;
  const s = tw(f, start, 6, 1.3, 1, kurve.whip);
  const o = tw(f, start - 1, 3, 0, 1, kurve.fade);
  const r = tw(f, start, 8, dreh - 7, dreh, kurve.land);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg) scale(${s})`, transformOrigin: "left center", opacity: o, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 58, letterSpacing: "0.09em", padding: "12px 24px", boxShadow: "6px 9px 0 rgba(0,0,0,.25)", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Helles Label mit dunkler Schrift (wie «UND DANN SCHÜTTET …»), gut lesbar auf hellem Grund. */
const HellLabel: React.FC<{ x: number; y: number; size?: number; dreh?: number; children: React.ReactNode }> = ({ x, y, size = 52, dreh = -1.5, children }) => (
  <div style={{ position: "absolute", left: x, top: y, background: "#fff", padding: "10px 22px", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: size, lineHeight: 1.15, letterSpacing: "0.04em", color: zine.schwarz, boxShadow: "6px 9px 0 rgba(0,0,0,.22)", transform: `rotate(${dreh}deg)`, whiteSpace: "nowrap" }}>{children}</div>
);

// ---------- Vordergrund-Elemente (1,6, unscharf, angeschnitten) ----------
const VMuenze: React.FC<{ f: number; x: number; y: number; g: number; dreh?: number; blur?: number }> = ({ f, x, y, g, dreh = 0, blur = 8 }) => (
  <Img src={A("muenze-frei")} style={{ position: "absolute", left: x, top: y, width: g, height: g, transform: `rotate(${dreh + f * 0.22}deg)`, filter: `blur(${blur}px) brightness(.9)` }} />
);
const VLos: React.FC<{ x: number; y: number; dreh: number; farbe?: string; blur?: number; skala?: number }> = ({ x, y, dreh, farbe = zine.gelb, blur = 7, skala = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 560, height: 260, transform: `rotate(${dreh}deg) scale(${skala})`, transformOrigin: "0 0", background: farbe, border: `6px solid ${zine.schwarz}`, borderRadius: 20, filter: blur > 0 ? `blur(${blur}px)` : undefined, padding: "24px 36px", boxSizing: "border-box", boxShadow: blur > 0 ? undefined : "8px 12px 0 rgba(0,0,0,.25)" }}>
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
const S1_POS = { x: 1090 - H.bw * S1_SC, y: 536 };
/** Fenster im Handy (Bildpixel 91,5 / 333, 288 × 512) und Bildschirm (71 / 309, 329 × 560). */
const HANDY_FENSTER_B = { x: 91.5, y: 333, w: 288, h: 512 };
const HANDY_SCHIRM_B = { x: 71, y: 309, w: 329, h: 560 };

const handTransform = (f: number) => {
  const z = Z(1);
  const ein = tw(f, 0, 12, 1, 0, kurve.whip);
  const land = landung(f, 11, 10, 1.03);
  const hebel = f < z.m.wort + 2 ? 0 : f < z.m.wort + 8 ? tw(f, z.m.wort + 2, 6, 0, 1, kurve.whip) : tw(f, z.m.wort + 8, 18, 1, 0, kurve.land);
  const st = HOOK_STOPS[2];
  const ruck = f >= st && f < st + 10 ? Math.sin((f - st) * 1.6) * (1 - (f - st) / 10) : 0;
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
        <HookLabel text="DEIN DAUMEN ZIEHT" x={100} y={300} dreh={-3} start={z.start} f={f} />
        <HookLabel text="GERADE AN EINEM" x={150} y={404} dreh={2} start={z.m.zeile2} f={f} />
        {/* «SPIELAUTOMATEN» steht bei 0,7 s; beim gesprochenen Wort pulsiert es */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "480px 640px", transform: `scale(${landung(f, z.m.wort, 10, 1.05)})` }}>
          <ErpresserAnim text="SPIEL" x={100} y={512} size={122} start={8} takt={1} f={f} />
          <ErpresserAnim text="AUTOMATEN" x={100} y={664} size={86} versatz={3} start={13} takt={1} f={f} />
        </div>
      </Ebene>
    </AbsoluteFill>
  );
};


// ============================== Walzen ==============================
const WALZE = { w: 228, h: 342, gap: 24, y: 900 };
const WALZE_X = (1080 - (3 * WALZE.w + 2 * WALZE.gap)) / 2;
const wx = (i: number) => WALZE_X + i * (WALZE.w + WALZE.gap);
const HOOK_STOPS = [Z(1).m.wort + 14, Z(1).m.wort + 20, Z(1).m.wort + 27];
const SPIN_B = Z(2).start + 6; // «Jeder Wisch …»: Walzen drehen wieder
const STOPS_B = [Z(3).m.niete + 8, Z(3).m.aber - 6, Z(3).m.wort];
/** Hook: dreht beim Hebel, stoppt auf ♥ ♥ ?. Szene 2: dreht wieder, stoppt auf ✕ ✕ ♥. */
const walzeB = (f: number, i: number) => {
  const hook = (x: number) => walzenPos(x, Z(1).m.wort + 4 + i * 2, HOOK_STOPS[i], [1, 2, 3][i], [0, 0, 3][i]);
  if (f < SPIN_B + i * 2) return hook(f);
  return walzenPos(f, SPIN_B + i * 2, STOPS_B[i], hook(SPIN_B + i * 2), [1, 1, 0][i], 0.6);
};
const Walzen: React.FC<{ f: number; pos: (f: number, i: number) => number }> = ({ f, pos }) => (
  <div style={{ position: "absolute", left: WALZE_X, top: WALZE.y, display: "flex", gap: WALZE.gap, filter: randFilter(React.useContext(Leicht), 8) }}>
    {[0, 1, 2].map((i) => {
      const p = pos(f, i);
      const v = Math.abs(pos(f + 1, i) - p);
      return <KartenWalze key={i} p={p} tempo={v} w={WALZE.w} />;
    })}
  </div>
);

// ============================== Herz ==============================
const HERZ_PFAD = (s: number, ox: number, oy: number) => {
  const P = (x: number, y: number) => `${(ox + x * s).toFixed(1)},${(oy + y * s).toFixed(1)}`;
  return `M${P(50, 88)} C${P(20, 65)} ${P(0, 48)} ${P(0, 26)} C${P(0, 10)} ${P(12, 0)} ${P(26, 0)} C${P(38, 0)} ${P(46, 8)} ${P(50, 16)} C${P(54, 8)} ${P(62, 0)} ${P(74, 0)} C${P(88, 0)} ${P(100, 10)} ${P(100, 26)} C${P(100, 48)} ${P(80, 65)} ${P(50, 88)} Z`;
};
/** Herz exakt wie in assets/cards/treffer.png (Karte 2:3, Herz 79 % der Breite). */
const HERZ_S = (1.9 * WALZE.w) / 240;
const HERZ = { s: HERZ_S, x: wx(2) + WALZE.w / 2 - 50 * HERZ_S, y: WALZE.y + WALZE.h / 2 - 43.16 * HERZ_S };
const S3_FENSTER: Rechteck = { x: HERZ.x + 35.4 * HERZ.s, y: HERZ.y + 20 * HERZ.s, w: 29.25 * HERZ.s, h: 52 * HERZ.s };


// ============================== Tropfen ==============================
const TROPFEN_PFAD = (s: number, ox: number, oy: number) => {
  const P = (x: number, y: number) => `${(ox + x * s).toFixed(1)},${(oy + y * s).toFixed(1)}`;
  return `M${P(50, 0)} C${P(50, 0)} ${P(95, 70)} ${P(95, 100)} C${P(95, 128)} ${P(75, 150)} ${P(50, 150)} C${P(25, 150)} ${P(5, 128)} ${P(5, 100)} C${P(5, 70)} ${P(50, 0)} ${P(50, 0)} Z`;
};

// ============================== Szene 2: Dreh + Treffer (Walzen, Herz = Portal) ==============================
const Szene2: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z2 = Z(2);
  const z3 = Z(3);
  const los = z2.start + 14;
  const losP = tw(f, los, 10, 1, 0, kurve.whip);
  const losWackel = f > los + 18 ? Math.sin((f - los) / 12) * 1.4 : 0;
  const wortS = f < z2.m.wort ? 0 : tw(f, z2.m.wort, 6, 1.8, 1, kurve.whip);
  const strich = tw(f, z3.m.niete + 10, 8, 0, 1, kurve.land);
  const herzDa = f >= z3.m.wort + 8;
  const puls = herzDa ? landung(f, z3.m.wort + 8, 10, 1.14) : 1;
  const fahrt = FAHRT[2] as number;
  const box = { x: HERZ.x, y: HERZ.y, w: 100 * HERZ.s, h: 90 * HERZ.s };
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Strahlen f={f} bild="strahlen-gelb" grund="#B07A12" cx={540} cy={1060} tempo={0.22} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {f >= z3.m.wort && <Zacken x={wx(2) + 130} y={1050} r={overshoot(f, z3.m.wort, 10, 1.1) * 240} farbe={zine.rot} spitzen={13} dreh={f * 0.8} />}
        <Walzen f={f} pos={walzeB} />
        {herzDa && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px`, transform: `scale(${puls})` }}>
            {/* Das Herz der Treffer-Karte öffnet sich zum Portal (gleiche Lage wie in assets/cards/treffer.png) */}
            <Portal n={3} f={f} stufe={stufe} fenster={S3_FENSTER} box={box} form={HERZ_PFAD(HERZ.s, 0, 0)} auf={[fahrt, 6]} />
          </div>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 2, 11, 8) }}>
        {/* Satz 2: Lotterie-Los «DREH» – fliegt beim nächsten Satz nach oben raus */}
        {f >= los - 1 && f < z3.start + 9 && (
          <AbsoluteFill style={raus(f, z3.start - 2)}>
            <div style={{ position: "absolute", left: 110, top: 300, width: 780, transformOrigin: "50% 0", transform: `translateY(${losP * -900}px) rotate(${-3 + losP * -25 + losWackel}deg) scale(${landung(f, los + 9, 8, 1.03)})`, filter: "drop-shadow(10px 14px 0 rgba(0,0,0,.28))" }}>
              <div style={{ background: zine.gelb, border: `5px solid ${zine.schwarz}`, borderRadius: 20, padding: "26px 40px 30px", WebkitMaskImage: "radial-gradient(circle at 0 50%, transparent 30px, #000 31px), radial-gradient(circle at 100% 50%, transparent 30px, #000 31px)", WebkitMaskComposite: "source-in", maskComposite: "intersect" } as React.CSSProperties}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono", fontSize: 30, letterSpacing: "0.14em", color: zine.schwarz }}>
                  <span>JEDER WISCH IST EIN NEUER</span>
                  <span style={{ color: zine.rot }}>№ 471</span>
                </div>
                <div style={{ borderTop: `4px dashed ${zine.schwarz}`, margin: "14px 0 6px" }} />
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Rye", fontSize: 210, lineHeight: 1, display: "inline-block", ...(f < z2.m.wort ? { color: "transparent", WebkitTextStroke: `4px ${zine.rot}`, opacity: 0.6 } : { color: zine.rot, textShadow: `6px 6px 0 ${zine.schwarz}`, transform: `scale(${wortS}) rotate(${(wortS - 1) * -12}deg)` }) }}>DREH</span>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )}
        {/* Satz 3 */}
        <Rein f={f} start={z3.start} art="rutsch">
          {/* Papier wächst mit der zweiten Zeile (nie leere Fläche) */}
          <Papierstueck x={100} y={300} w={800} h={128 + tw(f, z3.m.aber - 2, 6, 0, 98, kurve.whip)} dreh={-2} seed={31} style={{ background: "#F6F1E4" }} />
        </Rein>
        <Rein f={f} start={z3.start + 2} art="slap" ox={100} oy={280}>
          <div style={{ position: "absolute", left: 135, top: 316, fontFamily: "Fell", fontStyle: "italic", fontSize: 84, color: zine.schwarz, whiteSpace: "nowrap" }}>
            Meistens{" "}
            {f >= z3.m.niete && (
              <span style={{ position: "relative" }}>
                Niete.
                <span style={{ position: "absolute", left: -6, top: "52%", height: 9, width: `${strich * 108}%`, background: zine.rot, transform: "rotate(-4deg)" }} />
              </span>
            )}
          </div>
        </Rein>
        <Rein f={f} start={z3.m.aber} art="slap" ox={300} oy={370}>
          <div style={{ position: "absolute", left: 320, top: 412, fontFamily: "Fell", fontStyle: "italic", fontSize: 84, color: zine.schwarz }}>Aber manchmal:</div>
        </Rein>
        <Rein f={f} start={z3.m.wort} art="stempel" ox={540} oy={560}>
          <Riso x={105} y={545} text="TREFFER!" size={158} dreh={-4} />
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 2, 6, 9) }}>
        {/* «Der Jackpot»: scharf, ganz in der Safe Zone */}
        <Papierstueck x={110} y={1300} w={780} h={190} dreh={-4} seed={44} style={{ background: "#EFE7D3" }}>
          <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
          <div style={{ position: "relative", padding: "34px 60px", fontFamily: "Fell SC", fontSize: 112, color: zine.schwarz, lineHeight: 1, whiteSpace: "nowrap" }}>Der Jackpot</div>
        </Papierstueck>
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 3: Dopamin mit Lupen-Kamera (Ref. 01), Tropfen = Portal ==============================
/** Lupe: dunkler Ring rollt in 6 Frames von rechts ein, innen 1,6× vergrössert, Ring bleibt als Vignette; öffnet sich vor der Fahrt. */
const LUPE = { start: Z(4).m.gehirn, ein: 6, R: 820, M: 1.6, fokus: { x: 540, y: 1050 } };
const LUPE_AUF = (FAHRT[3] as number) - 12;
const lupeP = (f: number) => tw(f, LUPE.start, LUPE.ein, 0, 1, kurve.whip);
const lupeRing = (f: number) => ({ cx: 540 + (1 - lupeP(f)) * (LUPE.R + 760), cy: 960, R: LUPE.R + tw(f, LUPE_AUF, 10, 0, 1100, kurve.land) });
const lupeSichtbar = (f: number) => f >= LUPE.start && f < LUPE_AUF + 10;

const GEHIRN = { sc: 520 / 1024, cx: 540, cy: 1080 };
const TROPFEN = { s: 1.3, cx: 590, cy: 1430 };
const TROPFEN_BOX: Rechteck = { x: TROPFEN.cx - 50 * TROPFEN.s, y: TROPFEN.cy - 75 * TROPFEN.s, w: 100 * TROPFEN.s, h: 150 * TROPFEN.s };
const TR_FENSTER: Rechteck = { x: TROPFEN_BOX.x + 31.5 * TROPFEN.s, y: TROPFEN_BOX.y + 62 * TROPFEN.s, w: 37 * TROPFEN.s, h: (37 * TROPFEN.s * 16) / 9 };

/** Text wie «WENT UP» in Ref. 01: kommt aus der Unschärfe, mit Farbversatz rot/blau, gleitet leicht nach. */
const LinsenText: React.FC<{ f: number; start: number; x: number; y: number; size: number; children: React.ReactNode; farbe?: string; von?: "links" | "rechts"; schub?: number }> = ({ f, start, x, y, size, children, farbe = "#fff", von = "links", schub = 0 }) => {
  if (f < start - 1) return null;
  const p = tw(f, start, 8, 0, 1, kurve.land);
  const dx = (von === "links" ? -60 : 260) * (1 - tw(f, start, 7, 0, 1, kurve.whip));
  const ca = 18 * (1 - p) + 2;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(${dx - schub}px)`, opacity: tw(f, start - 1, 3, 0, 1, kurve.fade), filter: `blur(${(1 - p) * 8}px)`, whiteSpace: "nowrap",
      fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.01em", color: farbe, WebkitTextStroke: `${Math.round(size / 26)}px ${zine.schwarz}`, paintOrder: "stroke fill",
      textShadow: `${-ca}px 0 0 rgba(255,40,60,.55), ${ca}px 0 0 rgba(40,200,255,.55), 0 ${size / 18}px 0 rgba(0,0,0,.35)` } as React.CSSProperties}>
      {children}
    </div>
  );
};

/** «MEHR!» als ein Wort: «MEHR» schiesst mit Unschärfe von rechts herein, «!» schiebt direkt anschliessend nach (kein Leerzeichen). */
const MehrAusruf: React.FC<{ f: number; start: number; x: number; y: number; size: number }> = ({ f, start, x, y, size }) => {
  if (f < start - 1) return null;
  const p = tw(f, start, 8, 0, 1, kurve.land);
  const dx = 260 * (1 - tw(f, start, 7, 0, 1, kurve.whip));
  const ca = 18 * (1 - p) + 2;
  const ap = tw(f, start + 7, 6, 0, 1, kurve.whip);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(${dx}px)`, opacity: tw(f, start - 1, 3, 0, 1, kurve.fade), filter: `blur(${(1 - p) * 8}px)`, whiteSpace: "nowrap",
      fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.01em", color: "#E8231F", WebkitTextStroke: `${Math.round(size / 26)}px ${zine.schwarz}`, paintOrder: "stroke fill",
      textShadow: `${-ca}px 0 0 rgba(255,40,60,.55), ${ca}px 0 0 rgba(40,200,255,.55), 0 ${size / 18}px 0 rgba(0,0,0,.35)` } as React.CSSProperties}>
      MEHR<span style={{ display: "inline-block", transform: `translateX(${(1 - ap) * 240}px)`, opacity: f >= start + 7 ? 1 : 0 }}>!</span>
    </div>
  );
};

const Szene3: React.FC<SzProps> = ({ f, cam, stufe, camT }) => {
  const z4 = Z(4);
  const z6 = Z(6);
  const tCam = camT ?? cam;
  const puls = landung(f, z4.m.wort, 16, 1.08);
  const funken = [[300, 880, 0], [790, 900, 3], [260, 1250, 6], [820, 1280, 9], [540, 760, 12]];
  const gehirn = eingang(f, z4.m.gehirn - 6, "unten");
  const h = ruhe(f, 3);
  const tropfenStart = z6.m.mehr + 6;
  const fall = tw(f, tropfenStart, 12, 0, 1, kurve.whip);
  const tropfenS = f < tropfenStart ? 0 : landung(f, tropfenStart + 10, 10, 1.06) * Math.min(1, (f - tropfenStart) / 6);
  const quetsch = 1 + Math.sin((f - tropfenStart) / 6) * 0.04 * h;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <BildFlaeche name="wolken" f={f} start={z4.start} vy={-1.1} vx={0.3} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {f >= z4.m.wort && <AbsoluteFill style={{ background: `radial-gradient(circle at ${GEHIRN.cx}px ${GEHIRN.cy}px, rgba(108,63,212,${0.32 * tw(f, z4.m.wort, 8, 0, 1)}), transparent 420px)` }} />}
        {gehirn.sichtbar && (
          <Objekt bild="gehirn-frei" bw={1024} bh={1024} sc={GEHIRN.sc} x={GEHIRN.cx - 260} y={GEHIRN.cy - 260} blur={gehirn.blur} tr={`${gehirn.tr} translateY(${Math.sin(f / 16) * 10 * h}px) rotate(${Math.sin(f / 22) * 2.5 * h}deg) scale(${puls})`} />
        )}
        {funken.map(([x, y, d], i) => (f >= z4.m.wort + d ? <Zacken key={i} x={x} y={y + Math.sin((f + i * 9) / 12) * 10 * h} r={overshoot(f, z4.m.wort + d, 10, 1.15) * (42 + (i % 3) * 12)} farbe={zine.gelb} spitzen={9} dreh={f * 3 + i * 30} /> : null))}
        {f >= tropfenStart && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${TROPFEN.cx}px ${TROPFEN.cy}px`, transform: `translate(${(1 - fall) * -50}px, ${(1 - fall) * -140}px) scale(${tropfenS}) scaleY(${quetsch})`, filter: "drop-shadow(0 10px 14px rgba(40,20,90,.35))" }}>
            <Portal n={4} f={f} stufe={stufe} fenster={TR_FENSTER} box={TROPFEN_BOX} form={TROPFEN_PFAD(TROPFEN.s, 0, 0)} toenung={{ farbe: zine.violett, staerke: 0.28 }} glas />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
              <path d={TROPFEN_PFAD(TROPFEN.s, TROPFEN_BOX.x, TROPFEN_BOX.y)} fill="none" stroke={zine.violett} strokeWidth={5} opacity={1 - tw(f, FAHRT[3] as number, 8, 0, 1)} />
            </svg>
          </div>
        )}
      </Ebene>
      {/* Text liegt ausserhalb der Lupen-Vergrösserung (gleiche Kamera innen und aussen) */}
      <Ebene cam={tCam} tiefe={TIEFE.text} style={{ opacity: weg(f, 3, 11, 8) }}>
        <AbsoluteFill style={f >= z6.start - 2 ? raus(f, z6.start - 2) : undefined}>
          <Rein f={f} start={z4.start} art="slap" ox={120} oy={360}>
            <HellLabel x={120} y={315} size={50}>UND DANN SCHÜTTET<br />DEIN GEHIRN …</HellLabel>
          </Rein>
          <LinsenText f={f} start={z4.m.wort} x={115} y={470} size={164}>DOPAMIN</LinsenText>
          <Rein f={f} start={z4.m.wort + 14} art="slap" ox={720} oy={680}>
            <HellLabel x={640} y={655} size={50} dreh={2}>… AUS.</HellLabel>
          </Rein>
        </AbsoluteFill>
        {/* dunkle Schrift auf hellen Labels (Kontrast auf den Wolken), «MEHR!» gross wie «80%» in Ref. 01 */}
        <Rein f={f} start={z6.start} art="slap" ox={120} oy={350}>
          <HellLabel x={120} y={315} size={58}>DOPAMIN HEISST:</HellLabel>
        </Rein>
        <Rein f={f} start={z6.m.mehr - 12} art="slap" ox={170} oy={450}>
          <HellLabel x={170} y={415} size={58} dreh={1.5}>DA KOMMT NOCH</HellLabel>
        </Rein>
        <MehrAusruf f={f} start={z6.m.mehr} x={120} y={520} size={246} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 3, 6, 9) }}>
        <div style={{ filter: "blur(9px)" }}>
          <Zacken x={1010} y={170} r={210} farbe={zine.gelb} spitzen={11} dreh={f * 0.6} />
        </div>
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 7: Sekunde + Niete oder Treffer (Pokal = Portal) ==============================
const Szene7: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z12 = Z(12);
  const z13 = Z(13);
  const h = ruhe(f, 7);
  const wechsel = z13.start - 2;
  const wack = f >= z12.m.wort ? Math.sin((f - z12.m.wort) * 0.5) * Math.exp(-(f - z12.m.wort) / 10) * 12 : 0;
  const pop = f < z12.start + 2 ? 0 : overshoot(f, z12.start + 2, 12, 1.08);
  const suRaus = tw(f, wechsel, 9, 0, 1, kurve.whip);
  const split = tw(f, wechsel, 10, 0, 1, kurve.whip);
  const strich = tw(f, z13.m.niete + 6, 8, 0, 1, kurve.land);
  const ball = eingang(f, z13.start + 4, "oben");
  const pokal = eingang(f, z13.m.wort - 3, "unten");
  const fahrt = FAHRT[7] as number;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Gross rand={<><HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" f={f} /><RandBild name="papier" mix="multiply" deckkraft={0.4} /></>}>
          <HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" f={f} />
          <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.4 }} />
        </Gross>
        {split > 0 && (
          <>
            <div style={{ position: "absolute", left: -2400 + split * 1500, top: -3000, width: 2400 + 530, height: 7920, background: "#151515", transform: "rotate(3deg)" }} />
            <div style={{ position: "absolute", left: 470 + (1 - split) * 2400, top: -3000, width: 4000, height: 7920, background: zine.gelb, transform: "rotate(3deg)" }} />
          </>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {pop > 0 && suRaus < 1 && (
          <Objekt bild="sanduhr-frei" bw={SU.bw} bh={SU.bh} sc={SU.sc} x={SU.x} y={SU.y} tr={`translateY(${suRaus * 1500 + Math.sin(f / 18) * 8}px) rotate(${wack + suRaus * 30}deg) scale(${pop})`}>
            <div style={{ position: "absolute", left: 437 * SU.sc - 1.5, top: 590 * SU.sc, width: 3, height: 230 * SU.sc, background: "repeating-linear-gradient(#8b7a5c 0 6px, transparent 6px 10px)", backgroundPositionY: `${f * 4}px`, opacity: 0.8 }} />
          </Objekt>
        )}
        {ball.sichtbar && <Objekt bild="papierball-frei" bw={1024} bh={1024} sc={330 / 1024} x={270 - 165} y={1250 - 165} blur={ball.blur} tr={`${ball.tr} rotate(${-8 + Math.sin(f / 20) * 4 * h}deg)`} />}
        {f >= z13.m.wort && <Zacken x={698} y={1150} r={overshoot(f, z13.m.wort, 10, 1.1) * 260} farbe={zine.rot} spitzen={14} dreh={f * 0.9} />}
        {pokal.sichtbar && (
          <Objekt bild="pokal-frei" bw={PK.bw} bh={PK.bh} sc={PK.sc} x={PK.x} y={PK.y} blur={pokal.blur} tr={`${pokal.tr} rotate(${5 * h}deg) translateY(${Math.sin(f / 16) * 7 * h}px)`}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.25 + 0.75 * tw(f, fahrt, 8, 0, 1, kurve.fade), mixBlendMode: f >= fahrt + 8 ? "normal" : "multiply" }}>
              <Portal n={8} f={f} stufe={stufe} fenster={PK_FENSTER} box={PK_BOX} form="ellipse" />
            </div>
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 7, 11, 8) }}>
        {f < wechsel + 9 && (
          <AbsoluteFill style={f >= wechsel ? raus(f, wechsel) : undefined}>
            <Rein f={f} start={z12.m.wort} art="stempel" ox={180} oy={420}>
              <div style={{ position: "absolute", left: 100, top: 305, fontFamily: "Barlow", fontWeight: 800, fontSize: 430, lineHeight: 0.8, color: "#fff", letterSpacing: "-0.05em", textShadow: "10px 12px 0 rgba(0,0,0,.25)" }}>1</div>
            </Rein>
            <Rein f={f} start={z12.m.wort + 6} art="slap" ox={330} oy={320}>
              <div style={{ position: "absolute", left: 360, top: 318, fontFamily: "Rye", fontSize: 98, color: zine.gelb, lineHeight: 1, textShadow: `5px 5px 0 ${zine.schwarz}` }}>SEKUNDE</div>
            </Rein>
            <Rein f={f} start={z12.m.wort + 16} art="slap" ox={335} oy={410}>
              <div style={{ position: "absolute", left: 365, top: 443, fontFamily: "JetBrains Mono", fontSize: 40, color: "#fff" }}>entscheidet:</div>
            </Rein>
            <Rein f={f} start={z12.m.weiter} art="slap" ox={335} oy={480}>
              <div style={{ position: "absolute", left: 365, top: 503, fontFamily: "Barlow", fontWeight: 800, fontSize: 64, color: "#fff" }}>WEITER —</div>
            </Rein>
            <Rein f={f} start={z12.m.stopp - 4} art="stempel" ox={540} oy={590}>
              <div style={{ position: "absolute", left: 365, top: 583, fontFamily: "Barlow", fontWeight: 800, fontSize: 64, color: "#fff" }}>
                oder <span style={{ background: zine.gelb, color: zine.schwarz, padding: "0 12px" }}>STOPP.</span>
              </div>
            </Rein>
          </AbsoluteFill>
        )}
        <Rein f={f} start={z13.m.niete} art="slap" ox={80} oy={330}>
          <div style={{ position: "absolute", left: 105, top: 305, fontFamily: "Fell SC", fontSize: 124, color: "#8A8A8A" }}>
            Niete
            <span style={{ position: "absolute", left: -10, top: "50%", height: 12, width: `${strich * 112}%`, background: zine.rot, transform: "rotate(-5deg)" }} />
          </div>
        </Rein>
        <Rein f={f} start={z13.m.oder} art="pop" ox={560} oy={470}>
          <div style={{ position: "absolute", left: 360, top: 465, fontFamily: "Caveat", fontWeight: 600, fontSize: 80, color: "#fff", transform: "rotate(-6deg)", textShadow: "3px 3px 0 #000" }}>oder …</div>
        </Rein>
        <Rein f={f} start={z13.m.wort} art="stempel" ox={800} oy={600}>
          <div style={{ position: "absolute", left: 480, top: 575, fontFamily: "Rye", fontSize: 76, color: zine.schwarz, transform: "rotate(4deg)" }}>Treffer?</div>
        </Rein>
      </Ebene>
    </AbsoluteFill>
  );
};

// ============================== Szene 4: Kanone (Rauch = Portal) ==============================
const KA = { bw: 1024, bh: 1024, sc: 860 / 1024, x: 70, y: 770 };
const KA_FENSTER: Rechteck = { x: 498.5 * KA.sc, y: 399 * KA.sc, w: 63 * KA.sc, h: 112 * KA.sc };
const KA_BOX: Rechteck = { x: (530 - 125) * KA.sc, y: (455 - 80) * KA.sc, w: 250 * KA.sc, h: 160 * KA.sc };

const Szene4: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(8);
  const e = eingang(f, z.start + 4, "links");
  const h = ruhe(f, 4);
  const schub = f < z.m.wort ? 0 : f < z.m.wort + 4 ? tw(f, z.m.wort, 4, 0, 1, kurve.whip) : tw(f, z.m.wort + 4, 16, 1, 0, kurve.land);
  const titel = f >= z.m.zeile2;
  const fahrt = FAHRT[4] as number;
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <BildFlaeche name="wellen" f={f} start={z.start} vx={-0.45} vy={0} zoom={1.05} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        {f >= z.m.wort && <Zacken x={790} y={930} r={overshoot(f, z.m.wort, 10, 1.12) * 260} farbe={zine.gelb} spitzen={14} dreh={f} />}
        {e.sichtbar && (
          <Objekt bild="kanone-frei" bw={KA.bw} bh={KA.bh} sc={KA.sc} x={KA.x} y={KA.y} blur={e.blur} tr={`${e.tr} translate(${-34 * schub}px, ${20 * schub + Math.sin(f / 25) * 4 * h}px)`}>
            <Portal n={5} f={f} stufe={stufe} fenster={KA_FENSTER} box={KA_BOX} form="ellipse" feder auf={[fahrt, 10]} />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 4, 11, 8) }}>
        <Rein f={f} start={z.start + 1} art="fall" ox={500} oy={340}>
          {/* Papier ist nur so gross wie der Text: wächst, wenn die zweite Zeile kommt */}
          <Papierstueck x={115} y={300} w={780} h={176 + tw(f, z.m.zeile2, 7, 0, 92, kurve.whip)} dreh={-2} seed={21} style={{ background: "#F1ECDF", padding: "22px 40px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: "Fell SC", fontSize: 34, letterSpacing: "0.12em", color: zine.rot, whiteSpace: "nowrap", borderBottom: `4px double ${zine.schwarz}`, paddingBottom: 4 }}>EXTRABLATT</div>
            <div style={{ fontFamily: "Fell SC", fontSize: 54, lineHeight: 1.05, color: zine.schwarz, marginTop: 10, whiteSpace: "nowrap" }}>Überraschender Treffer:</div>
            <div style={{ fontFamily: "Fell SC", fontSize: 66, lineHeight: 1, color: zine.schwarz, marginTop: 12, whiteSpace: "nowrap", opacity: titel ? 1 : 0, transform: `scale(${titel ? tw(f, z.m.zeile2, 6, 1.15, 1, kurve.whip) : 1})`, transformOrigin: "left center" }}>
              Löst einen <span style={{ display: "inline-block", ...(f >= z.m.wort ? { color: zine.rot, transform: `scale(${tw(f, z.m.wort, 6, 1.6, 1, kurve.whip)})` } : { color: "transparent", WebkitTextStroke: `2px ${zine.rot}`, opacity: 0.6 }) }}>Schub</span> aus!
            </div>
          </Papierstueck>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 4, 6, 9) }}>
        <div style={{ filter: "blur(10px)" }}>
          <Zacken x={-40} y={1720} r={230} farbe={zine.gelb} spitzen={12} dreh={-f * 0.3} />
        </div>

      </Ebene>
    </AbsoluteFill>
  );
};


// ============================== Szene 5: Weiter (Spirale + Feed) ==============================
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

/** Papierhöhe Szene 5: Kopfzeile + nur die schon sichtbaren «WEITER.»-Zeilen (nie leere Fläche). */
const weiterPapierH = (f: number) => {
  const z = Z(10);
  const zeilen = [z.m.weiter1, z.m.weiter1 + 6, z.m.und, z.m.und + 5, z.m.wort];
  let h = 112;
  zeilen.forEach((s, i) => (h += tw(f, s - 2, 6, 0, (56 + (94 * i) / 4) * 0.88, kurve.whip)));
  return h + 10;
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
const Szene5: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(10);
  const zeilen = [z.m.weiter1, z.m.weiter1 + 6, z.m.und, z.m.und + 5, z.m.wort];
  const scrolls = [z.m.weiter1 + 10, z.m.und - 4, z.m.wort + 2, (FAHRT[5] as number) - 10];
  let pos = 0;
  scrolls.forEach((s) => (pos += tw(f, s, 9, 0, 1, kurve.heavy)));
  const h = ruhe(f, 5);
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
                <Portal n={6} f={f} stufe={stufe} fenster={{ x: fenster.x - HANDY_SCHIRM_B.x * sc, y: fenster.y - HANDY_SCHIRM_B.y * sc + s11Top, w: fenster.w, h: fenster.h }} box={{ x: 0, y: Math.max(0, s11Top - 40), w: HANDY_SCHIRM_B.w * sc, h: HANDY_SCHIRM_B.h * sc }} />
              </div>
            )}
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 5, 11, 8) }}>
        <Rein f={f} start={z.start} art="rutsch">
          <Papierstueck x={95} y={300} w={810} h={weiterPapierH(f)} dreh={-2} seed={14} style={{ background: zine.papier }} />
        </Rein>
        <Rein f={f} start={z.start + 3} art="slap" ox={90} oy={260}>
          <div style={{ position: "absolute", left: 125, top: 322, fontFamily: "Barlow", fontWeight: 800, fontSize: 66, lineHeight: 1, letterSpacing: "-0.01em", color: zine.schwarz, whiteSpace: "nowrap" }}>DARUM SCROLLST DU …</div>
        </Rein>
        {zeilen.map((s, i) => {
          if (f < s) return null;
          const size = 56 + (94 * i) / 4;
          let top = 410;
          for (let k = 0; k < i; k++) top += (56 + (94 * k) / 4) * 0.88;
          return <div key={i} style={{ position: "absolute", left: 125, top, fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.88, letterSpacing: "-0.03em", color: i % 2 ? zine.rot : zine.schwarz, transform: `scale(${tw(f, s, 5, 1.3, 1, kurve.whip)})`, transformOrigin: "left center" }}>WEITER.</div>;
        })}
        <Rein f={f} start={z.m.weiter1 + 10} art="slap" ox={140} oy={960}>
          <div style={{ position: "absolute", left: 120, top: 905, transform: "rotate(-4deg)", background: zine.gelb, border: `6px solid ${zine.schwarz}`, fontFamily: "Barlow", fontWeight: 800, fontSize: 84, lineHeight: 1, padding: "12px 32px", boxShadow: "8px 12px 0 rgba(0,0,0,.28)", whiteSpace: "nowrap" }}>NUR NOCH EINS.</div>
        </Rein>
      </Ebene>
    </AbsoluteFill>
  );
};


// ============================== Szene 6: Laptop ==============================
const LA = { bw: 1168, bh: 880, sc: 860 / 1168, x: 110, y: 900 };
const LA_SCHIRM = { x: 274 * LA.sc, y: 149 * LA.sc, w: 612 * LA.sc, h: 375 * LA.sc };
const MINI = { w: 76, h: 114, gap: 14 };
const MINI_X = LA_SCHIRM.x + (LA_SCHIRM.w - (3 * MINI.w + 2 * MINI.gap)) / 2;
const MINI_Y = LA_SCHIRM.y + 29 + (LA_SCHIRM.h - 29 - MINI.h) / 2;
const LA_BOX: Rechteck = { x: MINI_X + MINI.w + MINI.gap + 3, y: MINI_Y + 3, w: MINI.w - 6, h: MINI.h - 6 };
const LA_FENSTER: Rechteck = { x: LA_BOX.x + (LA_BOX.w - (LA_BOX.h * 9) / 16) / 2, y: LA_BOX.y, w: (LA_BOX.h * 9) / 16, h: LA_BOX.h };

const Szene6: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(11);
  const mark = tw(f, z.m.wort, 10, 0, 1, kurve.land);
  const e = eingang(f, z.start + 4, "unten");
  const h = ruhe(f, 6);
  const fahrt = FAHRT[6] as number;
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
                return <KartenWalze key={i} p={p} tempo={Math.abs(mini(f + 1, i) - p)} w={MINI.w} />;
              })}
            </div>
            <Portal n={7} f={f} stufe={stufe} fenster={LA_FENSTER} box={LA_BOX} radius={5} auf={[fahrt, 8]} />
          </Objekt>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={{ opacity: weg(f, 6, 11, 8) }}>
        <Rein f={f} start={z.start} art="fall" ox={520} oy={330}>
          <div style={{ position: "absolute", left: 100, top: 300, width: 800, transform: "rotate(-2deg)", background: "#FBF8F0", boxShadow: "8px 12px 0 rgba(0,0,0,.22)", padding: "30px 40px 36px", backgroundImage: "repeating-linear-gradient(transparent 0 66px, #C9D5EA 66px 68px)", backgroundPosition: "0 44px" }}>
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
      <Ebene cam={cam} tiefe={TIEFE.vordergrund} style={{ opacity: weg(f, 6, 6, 9) }}>
        <VLos x={560} y={575} dreh={8} farbe="#F4EFE4" blur={0} skala={0.6} />
      </Ebene>
    </AbsoluteFill>
  );
};


// ============================== Sanduhr + Pokal (Konstanten) ==============================
const SU = { bw: 880, bh: 1168, sc: 500 / 880, x: 310, y: 918 };
const SU_FENSTER: Rechteck = { x: 399 * SU.sc, y: 236 * SU.sc, w: 72 * SU.sc, h: 128 * SU.sc };
const SU_BOX: Rechteck = { x: (435 - 150) * SU.sc, y: (300 - 80) * SU.sc, w: 300 * SU.sc, h: 160 * SU.sc };


const PK = { bw: 880, bh: 1168, sc: 0.45, x: 500, y: 930 };
const PK_FENSTER: Rechteck = { x: 365.5 * PK.sc, y: 200 * PK.sc, w: 169 * PK.sc, h: 300 * PK.sc };
const PK_BOX: Rechteck = { x: (450 - 175) * PK.sc, y: (350 - 200) * PK.sc, w: 350 * PK.sc, h: 400 * PK.sc };



// ============================== Szene 8: CTA ==============================
/** Loop-Ende: Logo und Text gehen in den letzten ~0,8 s raus, dann blenden die roten Strahlen von Frame 0 deckungsgleich ein. */
const LOOP_AUS = V3_DAUER - 26;
const LOOP_EIN = V3_DAUER - 16;
const loopAus = (f: number): React.CSSProperties => ({ opacity: 1 - tw(f, LOOP_AUS + 2, 8, 0, 1, kurve.fade), transform: `translateY(${tw(f, LOOP_AUS, 10, 0, -220, kurve.whip)}px)` });
const LoopStrahlen: React.FC<{ f: number }> = ({ f }) => {
  const o = tw(f, LOOP_EIN, 15, 0, 1, kurve.fade);
  if (o <= 0) return null;
  const fx = S1_POS.x + (HANDY_FENSTER_B.x + HANDY_FENSTER_B.w / 2) * S1_SC;
  const fy = S1_POS.y + (HANDY_FENSTER_B.y + HANDY_FENSTER_B.h / 2) * S1_SC;
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <Ebene cam={RUHE} tiefe={TIEFE.hintergrund}>
        <Strahlen f={0} bild="strahlen-rot-a" grund="#5A0E12" cx={fx} cy={fy} />
      </Ebene>
    </AbsoluteFill>
  );
};

const Szene8: React.FC<SzProps> = ({ f, cam, stufe }) => {
  const z = Z(14);
  return (
    <AbsoluteFill style={{ overflow: stufe ? "visible" : "hidden" }}>
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Strahlen f={f} bild="strahlen-violett" grund="#3A1F7A" cx={540} cy={1000} tempo={0.1} />
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.haupt} style={loopAus(f)}>
        <Rein f={f} start={z.m.mehr + 2} art="pop" ox={540} oy={960}>
          <div style={{ position: "absolute", left: 180, right: 180, top: 850, background: "#F6F1E4", padding: "28px 40px", transform: `rotate(${-2 + Math.sin(f / 30) * 0.6}deg)`, boxShadow: "10px 14px 0 rgba(0,0,0,.3)", filter: weisserRand(6), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Img src={A("logo")} style={{ width: 480 }} />
            <div style={{ background: zine.schwarz, color: "#fff", fontFamily: "Barlow", fontWeight: 800, fontSize: 56, padding: "10px 34px" }}>@solleva.ch</div>
          </div>
        </Rein>
      </Ebene>
      <Ebene cam={cam} tiefe={TIEFE.text} style={loopAus(f)}>
        <ErpresserAnim text="FOLGE" x={170} y={380} size={138} versatz={5} start={z.start} takt={3} f={f} />
        <ErpresserAnim text="FÜR MEHR" x={100} y={570} size={98} versatz={2} start={z.m.mehr} takt={2} f={f} />
        <Rein f={f} start={z.m.mehr + 12} art="slap" ox={540} oy={1330}>
          <div style={{ position: "absolute", left: 140, top: 1300, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 36, letterSpacing: "0.1em", padding: "10px 22px", transform: "rotate(2deg)" }}>HEB DICH VON DER MASSE AB.</div>
        </Rein>
      </Ebene>
    </AbsoluteFill>
  );
};


// ============================== Szenen-Register + Kamera ==============================
const SZENEN: Record<number, React.FC<SzProps>> = { 1: Szene1, 2: Szene2, 3: Szene3, 4: Szene4, 5: Szene5, 6: Szene6, 7: Szene7, 8: Szene8 };

const fahrtFenster = (n: number): Rechteck => {
  const plus = (o: { x: number; y: number }, r: Rechteck): Rechteck => ({ x: o.x + r.x, y: o.y + r.y, w: r.w, h: r.h });
  switch (n) {
    case 1: return { x: S1_POS.x + HANDY_FENSTER_B.x * S1_SC, y: S1_POS.y + HANDY_FENSTER_B.y * S1_SC, w: HANDY_FENSTER_B.w * S1_SC, h: HANDY_FENSTER_B.h * S1_SC };
    case 2: return S3_FENSTER;
    case 3: return TR_FENSTER;
    case 4: return plus(KA, KA_FENSTER);
    case 5: return { x: S10_POS.x + HANDY_FENSTER_B.x * S10_SC, y: S10_POS.y + HANDY_FENSTER_B.y * S10_SC, w: HANDY_FENSTER_B.w * S10_SC, h: HANDY_FENSTER_B.h * S10_SC };
    case 6: return plus(LA, LA_FENSTER);
    case 7: return plus(PK, PK_FENSTER);
    default: return { x: 0, y: 0, w: 1080, h: 1920 };
  }
};

/** Mehr Bewegung: Kamera-Stoss auf jedem Schlüsselwort (Zoom-Impuls 4,5 %, kommt zurück). */
const STOESSE = [Z(1).m.wort, Z(2).m.wort, Z(3).m.wort, Z(4).m.wort, Z(6).m.mehr, Z(8).m.wort, Z(10).m.und, Z(12).m.wort, Z(13).m.wort, Z(14).m.mehr];
const stoss = (f: number) => {
  let s = 0;
  for (const r of STOESSE) if (f >= r && f < r + 18) s += tw(f, r, 3, 0, 0.03, kurve.whip) - tw(f, r + 3, 15, 0, 0.03, kurve.land);
  return s;
};
/** Schwenks innerhalb einer Szene (bleiben stehen): Zoom-Änderung ds, Blickpunkt-Verschiebung dx/dy. */
type Schwenk = { f: number; dauer: number; ds: number; dx?: number; dy?: number };
const SCHWENKS: Record<number, Schwenk[]> = {
  // v4: Schwenks kleiner (Text bleibt in der Instagram-Safe-Zone), Bewegung vor allem über Seitwärts-Drift
  1: [{ f: Z(1).m.zeile2, dauer: 26, ds: 0.02, dx: -12 }],
  2: [{ f: Z(3).start, dauer: 24, ds: 0.02, dx: 12 }],
  4: [{ f: Z(8).m.wort - 2, dauer: 16, ds: 0.02, dx: 20 }],
  5: [{ f: Z(10).m.und - 6, dauer: 20, ds: 0.02, dy: -20 }],
  6: [{ f: Z(11).m.wort - 12, dauer: 20, ds: 0.02, dx: -12 }],
  7: [{ f: Z(13).start - 2, dauer: 14, ds: -0.03 }, { f: Z(13).m.wort - 4, dauer: 16, ds: 0.04, dx: 12 }],
  8: [{ f: Z(14).start, dauer: 40, ds: 0.02, dy: -20 }],
};
/** Drift zwischen den Fahrten: Zoom 100 → 107 %, ±4 px (startet ohne Versatz). */
const drift3 = (f: number, start: number, dauer: number, seed: number): Cam => {
  const l = Math.max(0, f - start);
  const t = Math.min(1, l / Math.max(1, dauer));
  return {
    s: 1 + 0.04 * kurve.heavy(t),
    cx: MITTE.x + (Math.sin((l + seed * 37) / 40) - Math.sin((seed * 37) / 40)) * 4,
    cy: MITTE.y + (Math.cos((l + seed * 23) / 52) - Math.cos((seed * 23) / 52)) * 3,
  };
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
/** Lupe (Szene 3): innen 1,6× auf das Gehirn. */
const mitLupe = (c: Cam, f: number): Cam => {
  const p = lupeP(f);
  return { s: c.s * (1 + (LUPE.M - 1) * p), cx: c.cx + (LUPE.fokus.x - c.cx) * p, cy: c.cy + (LUPE.fokus.y - c.cy) * p };
};

type Zustand = { szene: number; cam: Cam; camT: Cam; aussen?: Cam };
export const kamera3 = (f: number): Zustand => {
  let n = 1;
  for (let k = 2; k <= 8; k++) if (f >= beginn(k)) n = k;
  const start = beginn(n);
  const fahrt = FAHRT[n];
  const dauer = fahrt != null ? fahrt - start : V3_DAUER - start;
  const basis = (x: number): Cam => {
    const c = drift3(x, start, Math.max(30, dauer), n);
    let ds = stoss(x);
    let dx = 0;
    let dy = 0;
    for (const s of SCHWENKS[n] ?? []) {
      const p = tw(x, s.f, s.dauer, 0, 1, kurve.heavy);
      ds += s.ds * p;
      dx += (s.dx ?? 0) * p;
      dy += (s.dy ?? 0) * p;
    }
    return { s: c.s + ds, cx: c.cx + dx, cy: c.cy + dy };
  };
  const innen = (x: number) => (n === 3 ? mitLupe(basis(x), x) : basis(x));
  if (fahrt != null && f >= fahrt) {
    return { szene: n, cam: zoomCam(innen(fahrt), fahrtFenster(n), (f - fahrt) / ZOOM), camT: n === 3 ? basis(fahrt) : zoomCam(innen(fahrt), fahrtFenster(n), (f - fahrt) / ZOOM) };
  }
  if (n === 3) return { szene: 3, cam: innen(f), camT: basis(f), aussen: lupeSichtbar(f) ? basis(f) : undefined };
  return { szene: n, cam: basis(f), camT: basis(f) };
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  const z = kamera3(f);
  const S = SZENEN[z.szene];
  const leicht = z.cam.s > 2;
  if (z.szene === 3 && z.aussen) {
    const r = lupeRing(f);
    return (
      <Leicht.Provider value={leicht}>
        <AbsoluteFill>
          <S f={f} cam={z.aussen} camT={z.camT} stufe={0} />
          <AbsoluteFill style={{ clipPath: `circle(${r.R}px at ${r.cx}px ${r.cy}px)` }}>
            <S f={f} cam={z.cam} camT={z.camT} stufe={0} />
          </AbsoluteFill>
          {/* Linsen-Ring: dunkles Band mit weicher Kante, aussen leicht abgedunkelt */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at ${r.cx}px ${r.cy}px, rgba(0,0,0,0) ${r.R - 70}px, rgba(8,8,8,.25) ${r.R - 40}px, rgba(8,8,8,.92) ${r.R - 14}px, rgba(8,8,8,.92) ${r.R + 34}px, rgba(0,0,0,.34) ${r.R + 90}px)` }} />
        </AbsoluteFill>
      </Leicht.Provider>
    );
  }
  return (
    <Leicht.Provider value={leicht}>
      <S f={f} cam={z.cam} camT={z.camT} stufe={0} />
    </Leicht.Provider>
  );
};

// ============================== Ton (minimal, natürlich) ==============================
const Toene: React.FC = () => {
  const T: React.ReactNode[] = [];
  const t = (nr: string, bei: number, vol: number, max?: number) => T.push(<Ton key={`${nr}-${bei}-${T.length}`} nr={nr} bei={bei} vol={vol} max={max} />);
  const zoomTon = ["whoosh-03", "whoosh-02", "papier-04", "whoosh-03", "whoosh-02", "papier-04", "whoosh-03"];
  [1, 2, 3, 4, 5, 6, 7].forEach((n, i) => t(zoomTon[i], (FAHRT[n] as number) + 11, 0.18));
  // 1 Hook
  t("papier-02", Z(1).start, 0.16); t("papier-03", Z(1).m.zeile2, 0.14);
  [0, 10, 26].forEach((d) => t("klick-04", Z(1).m.wort + d, 0.14));
  t("ratsche-19", Z(1).m.wort + 4, 0.14, 0.8); t("ratsche-12", HOOK_STOPS[0], 0.16); t("ratsche-12", HOOK_STOPS[1], 0.16); t("schlag-07", HOOK_STOPS[2], 0.22);
  // 2 Dreh + Treffer
  t("ratsche-18", SPIN_B + 2, 0.11, 1.4); t("papier-01", Z(2).start + 23, 0.2); t("schlag-02", Z(2).m.wort, 0.22);
  t("swish-06", Z(3).start - 2, 0.12); t("papier-02", Z(3).start + 2, 0.14);
  t("ratsche-12", STOPS_B[0], 0.16); t("ratsche-12", STOPS_B[1], 0.16); t("schlag-02", Z(3).m.wort, 0.24); t("schlag-07", Z(3).m.wort + 8, 0.14);
  // 3 Dopamin + Lupe (Ref. 01: rauschender Swoosh, endet wenn der Ring steht)
  t("swish-06", LUPE.start + LUPE.ein - 1, 0.32); t("papier-02", Z(4).start, 0.12);
  t("klick-04", Z(4).m.wort, 0.14); t("papier-04", Z(6).m.mehr, 0.22); t("schlag-07", Z(6).m.mehr + 7, 0.2); t("swish-06", LUPE_AUF + 5, 0.16);
  // 4 Schub
  t("papier-05", Z(8).start + 6, 0.18, 0.9); t("papier-02", Z(8).m.zeile2, 0.14); t("schlag-02", Z(8).m.wort, 0.3); t("whoosh-02", Z(8).m.wort + 2, 0.12);
  // 5 Weiter
  [Z(10).m.weiter1, Z(10).m.und, Z(10).m.wort].forEach((s) => t("klick-04", s, 0.14));
  [Z(10).m.weiter1 + 10, Z(10).m.und - 4, Z(10).m.wort + 2].forEach((s) => t("papier-03", s + 3, 0.12));
  // 6 Firma
  t("papier-01", Z(11).start + 8, 0.18); t("ratsche-19", Z(11).start + 12, 0.1, 1.2); t("schreiben-02", Z(11).m.wort, 0.16, 0.5);
  // 7 Sekunde + Niete/Treffer
  t("klick-03", Z(12).start + 2, 0.14); t("schlag-02", Z(12).m.wort, 0.26); t("klick-04", Z(12).m.wort + 16, 0.14); t("papier-02", Z(12).m.weiter, 0.14); t("schlag-07", Z(12).m.stopp, 0.22);
  t("swish-06", Z(13).start - 2, 0.16); t("schlag-07", Z(13).start + 17, 0.16); t("schreiben-02", Z(13).m.oder, 0.16, 0.7); t("schlag-02", Z(13).m.wort, 0.24);
  // 8 CTA
  for (let i = 0; i < 5; i += 2) t("klick-04", Z(14).start + i * 3, 0.14);
  for (let i = 0; i < 8; i += 3) t("klick-04", Z(14).m.mehr + i * 2, 0.14);
  t("schlag-02", Z(14).ende - 4, 0.26); t("papier-02", Z(14).ende + 10, 0.14);
  return <>{T}</>;
};

// ============================== Komposition ==============================
export const ReelV4: React.FC = () => {
  const f = useCurrentFrame();
  const a = kamera3(f - 0.5);
  const b = kamera3(f + 0.5);
  const tempo = a.szene === b.szene ? Math.abs(Math.log(b.cam.s) - Math.log(a.cam.s)) : 0;
  return (
    <AbsoluteFill style={{ background: zine.schwarz }}>
      <ZineSchriften />
      <Bewegungsunschaerfe f={f} tempo={tempo} render={(x) => <Welt f={x} />} />
      <LoopStrahlen f={f} />
      <Filmlook />
      {SAETZE3.map((s) => (
        <Sequence key={s.nr} from={s.start} layout="none">
          <Audio src={staticFile(`reels/spielautomat/stimme/${s.datei}`)} />
        </Sequence>
      ))}
      <Toene />
    </AbsoluteFill>
  );
};
