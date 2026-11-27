// Reel 05 «solleva.ch» (Website-Showcase, Wunsch Gianluca 26.11.): nur solleva.ch, nur Bild – Musik kommt in Instagram dazu.
// Ablauf: Kristall ganz nah → Zoom-out (Laptop + Handy) → in den Laptop, Startseite scrollt → Tauchfahrt durch das
// Reel-Bild (9:16) → Social-Media-Seite in Handy-Ansicht → Fahrt in den Bildschirm → Endkarte → Fahrt in den Kristall (Loop).
// Kamera: K06 Fluss-Kamera (eine Bahn über drei verschachtelte Welten, Minimum-Jerk, Gauss-geglättet).
// Takt: 100 BPM (18 Frames). Skill reel-produktion: Safe Zone, Loop, Endkarte ≥ 1,5 s, nichts steht still.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Schriften } from "../../components/Basis";
import { Bewegungsunschaerfe, Filmlook } from "../../kamera/welt";
import { tw, kurve } from "../../lib/bewegung";
import { ausKind, deckt, Fenster, flussKamera, inKind, kameraCss, Stellung } from "../../lib/flussKamera";
import { SchriftenR04 } from "../r04/Look";
import { schluesselStil, titelStil, web } from "./Look";

const A = (p: string) => staticFile(`assets/r05/${p}`);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const mj = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (10 + x * (-15 + 6 * x));
};
const schritte = (f: number, start: number, wege: { f: number; d: number; v: number }[]) => wege.reduce((v, w) => v + (w.v - v) * mj((f - w.f) / w.d), start);


// ============================ Welt 1: Laptop + Handy ============================
const DT = { x: 540, y: 900, w: 940, bar: 36 };
const DT_S = DT.w / 1440; // CSS-px → Welt
const DT_H = 900 * DT_S;
const DT0 = { x: DT.x - DT.w / 2, y: DT.y - (DT_H + DT.bar) / 2 + DT.bar }; // Ursprung des Inhalts
const PH1 = { x: 840, y: 1330, w: 300, h: 649 }; // Handy in Welt 1 (390 × 844 CSS)

// Hero-Film im Laptop: 1440 × 810 CSS ab y 259; Kristall im Film-Bild bei 2,0 s (hero-t2.png): Mitte (1572, 262) px,
// Länge 270 px, Ausschnitt kristall-1 um 16° gedreht liegt deckungsgleich darauf (geprüft als Überlagerung).
const VIDEO_S = 1440 / 1920;
const KRISTALL_CSS = { x: 1572 * VIDEO_S, y: 259 + 262 * VIDEO_S, len: 270 * VIDEO_S };
const KRISTALL_W = { x: DT0.x + KRISTALL_CSS.x * DT_S, y: DT0.y + KRISTALL_CSS.y * DT_S, len: KRISTALL_CSS.len * DT_S };
const KRISTALL_DREH = 16;
const KRISTALL_PNG = { w: 280, h: 661, len: 661 };

// ============================ Zeiten ============================
// Takt: «two faced» (purc) ab 0:51. Akzent (Snare/Hi-Hat) alle 1,625 s (≈ 147,7 BPM), erster bei 1,65 s
// (gemessen aus der Instagram-Aufnahme, Musikbeginn = Frame 0). Bewegungen LANDEN auf dem Akzent.
const AKZENT = (k: number) => Math.round((1.65 + 1.625 * k) * 30); // 50, 98, 147, 196, 245, 293, 342, 391, 440, 489
const HALB = (k: number) => Math.round((1.65 + 1.625 * k + 0.8125) * 30);
const F_UEBERBLEND = 40; // Ausschnitt → Kristall im Standbild (12 Frames)
const F_FILM = 58; // ab hier läuft der Hero-Film, ab 2,0 s (= Standbild)
const F_UEBERSICHT = AKZENT(0); // Zoom-out fertig: Laptop + Handy
const F_LAPTOP = AKZENT(1); // Kamera ist im Laptop
const F_REGLER = HALB(1) - 13; // Scroll zum Regler landet auf dem halben Takt
const F_VORHER = AKZENT(2); // Regler auf «Vorher»
const F_NACHHER = HALB(2); // Regler auf «Nachher»
const F_REELS = AKZENT(3) - 13; // Scroll zu «Reels» landet auf dem Akzent
const F_TAUCH = AKZENT(3) + 8; // Tauchfahrt durch das Reel-Bild, kommt auf AKZENT(4) durch
const F_S1 = AKZENT(5) - 14; // Social: Scroll 1 landet auf dem Akzent
const F_S2 = HALB(5) - 14;
const F_S3 = AKZENT(6) - 14;
const F_ENDE_TAUCH = AKZENT(6) + 8; // Fahrt in den Handy-Bildschirm, Endkarte füllt das Bild auf AKZENT(7)
const F_TIPP = HALB(7); // «Folgen» wird getippt
const F_KRISTALL = HALB(8) - 2; // Fahrt in den Kristall, landet auf AKZENT(9); Endkarte steht ≈ 2 s
export const SHOW2_DAUER = AKZENT(9) + 24;

// Scroll-Positionen (CSS)
const SCROLL_REGLER = 832;
const SCROLL_REELS = 1733;
// Reel-Bild auf der Startseite (Desktop, CSS): l 189, t 1933, w 280, h 498 → im Laptop bei Scroll 1733
const POSTER: Fenster = { x: DT0.x + (189 + 140) * DT_S, y: DT0.y + (1933 - SCROLL_REELS + 249) * DT_S, w: 280 * DT_S };
const POSTER_H = (POSTER.w * 16) / 9;

// ============================ Welt 2: Handy mit Social-Media-Seite ============================
const PH2 = { x: 540, y: 1000, w: 460, h: 996 };
const PH2_S = PH2.w / 390;
// Endkarten-Fenster (9:16) im Handy-Bildschirm
const END: Fenster = { x: PH2.x, y: PH2.y, w: PH2.w };
const END_H = (END.w * 16) / 9;

// ============================ Welt 3: Endkarte ============================
const KR3 = { x: 790, y: 1420, len: 250 }; // Kristall auf der Endkarte

// ============================ Kamera ============================
const nahS = 7; // Nahaufnahme: Kristall ≈ 7 × Film-Grösse
const W1 = (st: Stellung) => st;
const W2 = (st: Stellung) => ausKind(st, POSTER);
const W3 = (st: Stellung) => ausKind(ausKind(st, END), POSTER);
const NAH_1: Stellung = { s: nahS, cx: KRISTALL_W.x, cy: KRISTALL_W.y };
const NAH_3: Stellung = { s: (nahS * KRISTALL_W.len) / KR3.len, cx: KR3.x, cy: KR3.y };

const KAM = flussKamera(
  [
    { ...W1(NAH_1), f: -30 },
    { ...W1(NAH_1), f: 8 },
    { ...W1({ s: 0.9, cx: 580, cy: 1080 }), f: F_UEBERSICHT },
    { ...W1({ s: 1080 / DT.w * 1.04, cx: DT.x, cy: DT0.y + DT_H / 2 - 10 }), f: F_LAPTOP },
    { ...W1({ s: 1080 / DT.w * 1.06, cx: DT.x, cy: DT0.y + DT_H / 2 }), f: F_TAUCH - 4 },
    { ...W2({ s: 1.04, cx: 540, cy: 960 }), f: AKZENT(4) + 2 },
    { ...W2({ s: 1.28, cx: 545, cy: 995 }), f: F_S1 + 10 },
    { ...W2({ s: 1.4, cx: 540, cy: 1000, rot: -1.5 }), f: F_S3 + 4 },
    { ...W3({ s: 1.0, cx: 540, cy: 960 }), f: AKZENT(7) - 3 },
    { ...W3({ s: 1.03, cx: 540, cy: 950 }), f: F_KRISTALL },
    { ...W3(NAH_3), f: AKZENT(9) + 4 },
    { ...W3(NAH_3), f: SHOW2_DAUER + 40 },
  ],
  SHOW2_DAUER,
  { glaettung: 6, drift: 0 },
);
const erster = (ab: number, ok: (f: number) => boolean) => {
  for (let f = ab; f < SHOW2_DAUER; f++) if (ok(f)) return f;
  throw new Error(`Wechsel ab Frame ${ab} wird nie erreicht`);
};
const F_W2 = erster(F_TAUCH, (f) => deckt(KAM.bei(f), { x: POSTER.x, y: POSTER.y, w: POSTER.w, h: POSTER_H }));
const F_W3 = erster(F_ENDE_TAUCH, (f) => deckt(inKind(KAM.bei(f), POSTER), { x: END.x, y: END.y, w: END.w, h: END_H }));

// ============================ Bausteine ============================
const Seite: React.FC<{ src: string; css: number; w: number; scrollY: number }> = ({ src, css, w, scrollY }) => (
  <Img src={src} style={{ position: "absolute", left: 0, top: -scrollY * (w / css), width: w }} />
);
const Kopf: React.FC<{ src: string; css: number; hCss: number; w: number }> = ({ src, css, hCss, w }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: hCss * (w / css), overflow: "hidden" }}><Img src={src} style={{ width: w }} /></div>
);

/** Kristall-Ausschnitt mit wanderndem Prisma-Glanz. */
const Kristall: React.FC<{ x: number; y: number; len: number; f: number; dreh?: number; wackel?: number }> = ({ x, y, len, f, dreh = 0, wackel = 0 }) => {
  const s = len / KRISTALL_PNG.len;
  const w = KRISTALL_PNG.w * s, h = KRISTALL_PNG.h * s;
  // periodisch über die ganze Reel-Länge: letzter Frame = erster Frame (Loop)
  const p = (2 * Math.PI * f) / SHOW2_DAUER;
  const glanz = (((f / SHOW2_DAUER) * 5) % 1) * 160 - 30;
  const wackeln = (Math.sin(p * 3) * 2.5 + Math.sin(p * 5) * 1.2) * wackel;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${dreh + wackeln}deg)` }}>
      <Img src={A("kristalle/kristall-1.png")} style={{ width: w, height: h, filter: "drop-shadow(0 0 40px rgba(143,227,255,.35))" }} />
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${A("kristalle/kristall-1.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${A("kristalle/kristall-1.png")})`, maskSize: "100% 100%", background: `linear-gradient(115deg, transparent ${glanz}%, rgba(255,255,255,.55) ${glanz + 8}%, rgba(143,227,255,.35) ${glanz + 14}%, transparent ${glanz + 24}%)`, mixBlendMode: "screen" }} />
    </div>
  );
};

const Laptop: React.FC<{ pose: number; f: number; children: React.ReactNode }> = ({ pose, f, children }) => {
  const schweben = (Math.sin(f / 40) * 8 + Math.sin(f / 23) * 3) * pose;
  return (
    <div style={{ position: "absolute", left: DT.x - DT.w / 2, top: DT0.y - DT.bar + schweben, width: DT.w, height: DT_H + DT.bar, perspective: 2400 }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${10 * pose}deg) rotateX(${6 * pose}deg) rotateZ(${-1.5 * pose}deg)`, borderRadius: 14, overflow: "hidden", background: "#15161d", boxShadow: "0 40px 90px rgba(0,0,0,.55), 0 0 0 1.5px rgba(255,255,255,.14)" }}>
        <div style={{ height: DT.bar, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#1d1e27" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
          <div style={{ marginLeft: 80, flex: 1, maxWidth: 380, height: 21, borderRadius: 7, background: "#2a2b36", color: "#b4bde0", fontFamily: "Inter", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>solleva.ch</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: DT.bar, width: DT.w, height: DT_H, overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  );
};
const Telefon: React.FC<{ ph: { x: number; y: number; w: number; h: number }; pose: number; f: number; children: React.ReactNode }> = ({ ph, pose, f, children }) => {
  const schweben = (Math.sin(f / 33 + 1) * 10 + Math.sin(f / 19) * 3) * pose;
  const R = ph.w * 0.16;
  return (
    <div style={{ position: "absolute", left: ph.x - ph.w / 2 - 12, top: ph.y - ph.h / 2 - 12 + schweben, width: ph.w + 24, height: ph.h + 24, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${-12 * pose}deg) rotateX(${5 * pose}deg) rotateZ(${2 * pose}deg)`, borderRadius: R + 12, padding: 12, background: "linear-gradient(150deg,#e8ecf5,#6b7186 35%,#f2f5fb 55%,#8a93ab)", boxShadow: "0 50px 100px rgba(0,0,0,.6)" }}>
        <div style={{ position: "relative", width: ph.w, height: ph.h, borderRadius: R, overflow: "hidden", background: "#04050c" }}>
          {children}
          <div style={{ position: "absolute", top: ph.w * 0.033, left: "50%", width: ph.w * 0.3, height: ph.w * 0.088, marginLeft: -ph.w * 0.15, background: "#000", borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
};
const Hintergrund: React.FC<{ src: string; f: number; hell?: number }> = ({ src, f, hell = 0.7 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#04050c" }}>
    {/* grösser als das Bild: Fahrten zeigen nie Rand */}
    <Img src={src} style={{ position: "absolute", left: -1400, top: -900, width: 3880, height: 3720, objectFit: "cover", filter: `blur(50px) brightness(${hell}) saturate(1.3)`, transform: `scale(${1.04 + 0.03 * Math.sin(f / 90)}) translateX(${Math.sin(f / 70) * 24}px)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 40%, rgba(4,5,12,.55) 100%)" }} />
  </AbsoluteFill>
);

// ============================ Inhalte ============================
const reglerWert = (f: number) => schritte(f, 50, [{ f: F_VORHER - 14, d: 14, v: 100 }, { f: F_NACHHER - 16, d: 16, v: 2 }]);
const LaptopInhalt: React.FC<{ f: number }> = ({ f }) => {
  const scroll = schritte(f, 0, [{ f: F_REGLER, d: 13, v: SCROLL_REGLER }, { f: F_REELS, d: 13, v: SCROLL_REELS }]);
  const k = DT_S;
  const regler = Math.round(reglerWert(f) / 2.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#04050c" }}>
      <Seite src={A("seiten/solleva-start-desktop.png")} css={1440} w={DT.w} scrollY={scroll} />
      {/* Hero: laufender Film + Textebene (wie auf der echten Seite) */}
      {scroll < 1100 && (
        <div style={{ position: "absolute", left: 0, top: -scroll * k, width: DT.w, height: 1100 * k, background: "#04050c" }}>
          <div style={{ position: "absolute", left: 0, top: 259 * k, width: DT.w, height: 810 * k, overflow: "hidden" }}>
            <Img src={A("hero/hero-t2.png")} style={{ position: "absolute", left: 0, top: 0, width: DT.w, height: 810 * k }} />
            <Sequence from={F_FILM} layout="none">
              <OffthreadVideo src={A("hero/hero-light.mp4")} startFrom={60} muted style={{ position: "absolute", left: 0, top: 0, width: DT.w, height: 810 * k }} />
            </Sequence>
          </div>
          <Img src={A("seiten/hero-text-desktop.png")} style={{ position: "absolute", left: 0, top: 0, width: DT.w }} />
        </div>
      )}
      {/* Vorher/Nachher-Regler: Bildschirmaufnahme bei Scroll 832, scrollt mit der Seite weg */}
      {f >= F_REGLER + 13 && scroll < SCROLL_REGLER + 900 && (
        <Img src={A(`seiten/regler-desktop/r${String(regler).padStart(2, "0")}.png`)} style={{ position: "absolute", left: 0, top: (SCROLL_REGLER - scroll) * k, width: DT.w }} />
      )}
      {/* Reel im Reel-Bild spielt */}
      {scroll > 1300 && (
        <div style={{ position: "absolute", left: 189 * k, top: (1933 - scroll) * k, width: 280 * k, height: 498 * k, overflow: "hidden", borderRadius: 14 * k }}>
          <OffthreadVideo src={A("hero/fitness365-reel.mp4")} startFrom={30} muted style={{ width: 280 * k, height: 498 * k, objectFit: "cover" }} />
        </div>
      )}
      <Kopf src={A("seiten/solleva-start-desktop.png")} css={1440} hCss={76} w={DT.w} />
    </div>
  );
};
const SOCIAL = [0, 928, 1700, 2771];
const SocialInhalt: React.FC<{ f: number }> = ({ f }) => {
  const scroll = schritte(f, SOCIAL[0], [{ f: F_S1, d: 14, v: SOCIAL[1] }, { f: F_S2, d: 14, v: SOCIAL[2] }, { f: F_S3, d: 14, v: SOCIAL[3] }]);
  return (
    <>
      <Seite src={A("seiten/social-mobil.png")} css={390} w={PH2.w} scrollY={scroll} />
      <Kopf src={A("seiten/social-mobil.png")} css={390} hCss={76} w={PH2.w} />
    </>
  );
};

// ============================ Endkarte (wie v1) + Kristall ============================
/**
 * Loop: Stück des Laptop-Heros (Standbild 2,0 s + Textebene, wie in Frame 0), so skaliert und verschoben, dass sein
 * Kristall genau auf dem Endkarten-Kristall liegt. Blendet weich ein, während die Kamera in den Kristall fährt →
 * letzter Frame ≈ erster Frame.
 */
const HeroNachbau: React.FC<{ sicht: number }> = ({ sicht }) => {
  const m = KR3.len / KRISTALL_W.len; // Welt-1 → Welt-3
  const k = DT_S;
  const kx = KRISTALL_CSS.x * k, ky = KRISTALL_CSS.y * k; // Kristall im Laptop-Inhalt
  // weicher Rand: deckt den Bildausschnitt des letzten Frames (≈ 292 × 519 Welt-3-px) ganz, zeigt aber keinen Hero-Text
  const rx = 310 / m, ry = 500 / m;
  const maske = `radial-gradient(ellipse ${rx}px ${ry}px at ${kx}px ${ky}px, #000 75%, transparent 100%)`;
  const textMaske = `radial-gradient(ellipse ${132 * k}px ${235 * k}px at ${kx}px ${ky}px, #000 82%, transparent 100%)`;
  return (
    <div style={{ position: "absolute", left: KR3.x - kx * m, top: KR3.y - ky * m, width: DT.w, height: DT_H, transformOrigin: "0 0", transform: `scale(${m})`, opacity: sicht, WebkitMaskImage: maske, maskImage: maske, background: "#04050c" }}>
      <div style={{ position: "absolute", left: 0, top: 259 * k, width: DT.w, height: 810 * k, overflow: "hidden" }}>
        <Img src={A("hero/hero-t2.png")} style={{ position: "absolute", left: 0, top: 0, width: DT.w, height: 810 * k }} />
      </div>
      {/* Textebene (Verlauf) nur im Ausschnitt von Frame 0 (± 118 × 210 CSS um den Kristall): kein Hero-Text */}
      <Img src={A("seiten/hero-text-desktop.png")} style={{ position: "absolute", left: 0, top: 0, width: DT.w, WebkitMaskImage: textMaske, maskImage: textMaske }} />
    </div>
  );
};

const Endkarte: React.FC<{ f: number }> = ({ f }) => {
  const F_END = F_W3;
  const ein = (d: number) => ({ opacity: tw(f, F_END - 10 + d, 10, 0, 1, kurve.fade), transform: `translateY(${tw(f, F_END - 10 + d, 18, 30, 0, kurve.land)}px)` });
  const t = f - F_TIPP;
  const druck = t >= 0 && t < 4 ? tw(t, 0, 4, 1, 0.95, kurve.whip) : t >= 4 && t < 14 ? tw(t, 4, 10, 0.95, 1, kurve.land) : 1;
  const gefolgt = t >= 3;
  const ripple = t >= 0 && t < 22 ? t / 22 : -1;
  const raus = tw(f, F_KRISTALL - 6, 8, 1, 0, kurve.raus); // Text geht, bevor die Kamera in den Kristall fährt
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "brightness(.5)" }}>
        {[-1, 0, 1].flatMap((ix) => [-1, 0, 1].map((iy) => (
          <Img key={`${ix}${iy}`} src={A("higgsfield/planet-b.png")} style={{ position: "absolute", left: ix * 1080, top: iy * 1920, width: 1080, height: 1920, transform: `scale(${ix ? -1 : 1}, ${iy ? -1 : 1})` }} />
        )))}
      </AbsoluteFill>
      {f > F_KRISTALL + 4 && <HeroNachbau sicht={tw(f, F_KRISTALL + 6, 18, 0, 1, kurve.fade)} />}
      <div style={{ opacity: raus }}>
        <div style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: "Instrument Serif", fontSize: 76, color: web.text, ...ein(0) }}>Solleva</div>
        <div style={{ position: "absolute", top: 480, left: 95, width: 805, textAlign: "center", ...titelStil(104, 8), ...ein(4) }}>
          Heb dich von der <span style={schluesselStil(8)}>Masse</span> ab.
        </div>
        <div style={{ position: "absolute", top: 900, left: 150, width: 780, ...ein(8) }}>
          <div style={{ height: 150, borderRadius: 75, background: gefolgt ? `linear-gradient(180deg, ${web.lilac}, ${web.purple})` : web.chrome, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${druck})`, boxShadow: "0 22px 60px rgba(108,63,212,.55)" }}>
            <span style={{ fontFamily: "Archivo R04", fontWeight: 900, fontStretch: "112%", fontSize: 58, textTransform: "uppercase", color: gefolgt ? web.text : web.ink }}>{gefolgt ? "Folge ich ✓" : "Folge für mehr"}</span>
          </div>
          {ripple >= 0 && <div style={{ position: "absolute", left: 390 - 60 - ripple * 260, top: 75 - 60 - ripple * 260, width: 120 + ripple * 520, height: 120 + ripple * 520, borderRadius: "50%", border: `4px solid rgba(143,227,255,${0.8 * (1 - ripple)})` }} />}
          {t > -12 && t < 20 && <div style={{ position: "absolute", left: 390 - 46, top: 75 - 46, width: 92, height: 92, borderRadius: "50%", background: "rgba(255,255,255,.35)", border: "3px solid rgba(255,255,255,.8)", opacity: tw(t, -12, 6, 0, 1) * tw(t, 12, 8, 1, 0), transform: `translate(${tw(t, -12, 12, 60, 0, kurve.land)}px, ${tw(t, -12, 12, 80, 0, kurve.land)}px) scale(${t >= 0 && t < 6 ? 0.85 : 1})` }} />}
        </div>
        <div style={{ position: "absolute", top: 1110, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 42, color: web.lilac, ...ein(12) }}>@solleva.ch</div>
      </div>
      <Kristall x={KR3.x} y={KR3.y} len={KR3.len} f={f} dreh={KRISTALL_DREH} wackel={1 - mj((f - (SHOW2_DAUER - 50)) / 40)} />
    </AbsoluteFill>
  );
};

// ============================ Welten ============================
const Welt1: React.FC<{ f: number }> = ({ f }) => {
  const laptopPose = mj((f - 14) / 36) * (1 - mj((f - (F_UEBERSICHT + 6)) / (F_LAPTOP - F_UEBERSICHT - 6))); // gerade in der Nahaufnahme, neigt sich beim Zoom-out, wieder gerade im Laptop
  const phonePose = 1;
  const ausschnitt = 1 - clamp01((f - F_UEBERBLEND) / 12); // Ausschnitt-Kristall → Film-Kristall
  const sicht2 = f >= F_TAUCH ? tw(f, F_TAUCH + 6, 18, 0, 1, kurve.fade) : 0;
  return (
    <AbsoluteFill>
      <Hintergrund src={A("hero/hero-light.webp")} f={f} hell={0.8} />
      <Telefon ph={PH1} pose={phonePose} f={f}>
        <Seite src={A("seiten/solleva-start-mobil.png")} css={390} w={PH1.w} scrollY={0} />
      </Telefon>
      <Laptop pose={laptopPose} f={f}>
        <LaptopInhalt f={f} />
        {ausschnitt > 0 && <div style={{ opacity: ausschnitt }}><Kristall x={KRISTALL_CSS.x * DT_S} y={KRISTALL_CSS.y * DT_S} len={KRISTALL_W.len} f={f} dreh={KRISTALL_DREH} /></div>}
      </Laptop>
      {/* Welt 2 erscheint im Reel-Bild (Zoom-Through) */}
      {sicht2 > 0 && (
        <div style={{ position: "absolute", left: POSTER.x - POSTER.w / 2, top: POSTER.y - POSTER_H / 2, width: POSTER.w, height: POSTER_H, overflow: "hidden", opacity: sicht2 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${POSTER.w / 1080})` }}><Welt2 f={f} /></div>
        </div>
      )}
    </AbsoluteFill>
  );
};
const Welt2: React.FC<{ f: number }> = ({ f }) => {
  const pose = mj((f - F_W2) / 36) * (1 - mj((f - (F_ENDE_TAUCH - 24)) / 24));
  const sicht3 = f >= F_ENDE_TAUCH ? tw(f, F_ENDE_TAUCH, 12, 0, 1, kurve.fade) : 0;
  const e = clamp01((f - F_ENDE_TAUCH) / 24);
  return (
    <AbsoluteFill>
      <Hintergrund src={A("seiten/social-mobil.png")} f={f} hell={0.75} />
      <Telefon ph={PH2} pose={pose} f={f}><SocialInhalt f={f} /></Telefon>
      {sicht3 > 0 && (
        <div style={{ position: "absolute", left: END.x - END.w / 2, top: END.y - END_H / 2, width: END.w, height: END_H, overflow: "hidden", opacity: sicht3, borderRadius: 40 * (1 - mj(e)) }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${END.w / 1080})` }}><Endkarte f={f} /></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  const st = KAM.bei(f);
  if (f < F_W2) return <AbsoluteFill style={{ transformOrigin: "0 0", transform: kameraCss(st) }}><Welt1 f={f} /></AbsoluteFill>;
  const st2 = inKind(st, POSTER);
  if (f < F_W3) return <AbsoluteFill style={{ transformOrigin: "0 0", transform: kameraCss(st2) }}><Welt2 f={f} /></AbsoluteFill>;
  return <AbsoluteFill style={{ transformOrigin: "0 0", transform: kameraCss(inKind(st2, END)) }}><Endkarte f={f} /></AbsoluteFill>;
};

const scrollTempo = (f: number) => {
  const nah = (t: number, d: number) => (f >= t && f <= t + d ? Math.sin((Math.PI * (f - t)) / d) * 0.04 : 0);
  return nah(F_REGLER, 13) + nah(F_REELS, 13) + nah(F_S1, 14) + nah(F_S2, 14) + nah(F_S3, 14);
};

export const R05Showcase2: React.FC = () => {
  const f = useCurrentFrame();
  const grenzen = [0, F_W2, F_W3, SHOW2_DAUER];
  const i = f < F_W2 ? 0 : f < F_W3 ? 1 : 2;
  return (
    <AbsoluteFill style={{ background: "#04050c" }}>
      <Schriften />
      <SchriftenR04 />
      <Bewegungsunschaerfe f={f} tempo={f === grenzen[i] ? 0 : KAM.tempo(f) + scrollTempo(f)} render={(x) => <Welt f={Math.max(grenzen[i], Math.min(grenzen[i + 1] - 0.001, x))} />} />
      <Filmlook />
    </AbsoluteFill>
  );
};
export const SHOW2_INFO = () => ({ F_W2, F_W3, kurve: KAM.kurvenWerte() });
