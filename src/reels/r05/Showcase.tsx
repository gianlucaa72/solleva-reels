// Reel 05 neu: Website-Showcase (Referenz 08), nur Bild – Musik kommt in Instagram dazu.
// Stiltest: solleva.ch (Laptop + Handy) → Tauchfahrt durch das Lieblingsfund-Bild auf /websites/ → Lieblingsfund.
// Kamera: K06 Fluss-Kamera (eine Bahn, Minimum-Jerk, Gauss-geglättet). Takt: 100 BPM (18 Frames).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Bewegungsunschaerfe, Filmlook } from "../../kamera/welt";
import { deckt, Fenster, flussKamera, inKind, kameraCss, Stellung } from "../../lib/flussKamera";

const A = (p: string) => staticFile(`assets/r05/${p}`);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const mj = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (10 + x * (-15 + 6 * x));
};
/** Wert, der zu bestimmten Frames per Minimum-Jerk auf neue Ziele läuft. */
const schritte = (f: number, start: number, wege: { f: number; d: number; v: number }[]) =>
  wege.reduce((v, w) => v + (w.v - v) * mj((f - w.f) / w.d), start);

// ============================ Takt (100 BPM) ============================
export const BEAT = 18;
const b = (n: number) => n * BEAT;

// ============================ Geräte-Layout (Welt 1080 × 1920) ============================
const PH = { x: 770, y: 1230, w: 330, h: 714 }; // Handy-Bildschirm (CSS 390 × 844)
const PH_S = PH.w / 390; // CSS-px → Welt
const DT = { x: 520, y: 720, w: 940, bar: 36 }; // Laptop-Browser (Inhalt 1440 × 900)
const DT_S = DT.w / 1440;
const DT_H = 900 * DT_S;

// ============================ Zeiten ============================
const F_REGLER = b(2); // Scroll zum Vorher/Nachher-Regler
const F_SEITE = b(5); // Seitenwechsel auf /websites/
const F_TAUCH = b(6); // Kamera taucht ins Lieblingsfund-Bild
const F_LF_SCROLL = b(10); // Lieblingsfund scrollt zu «Zwei Fragen»
export const SHOWCASE_DAUER = b(12) + 6;

// Lieblingsfund-Bild auf /websites/ (mobil, CSS): l 23, t 483, w 186, h 403
const KARTE = { x: PH.x - PH.w / 2 + (23 + 93) * PH_S, y: PH.y - PH.h / 2 + (483 + 201.5) * PH_S, w: 186 * PH_S, h: 403 * PH_S };
// Lieblingsfund-Welt sitzt so in der solleva-Welt, dass ihr Handy-Bildschirm genau auf der Karte liegt
const KF = KARTE.w / PH.w;
const LF_FENSTER: Fenster = { x: KARTE.x - KF * (PH.x - 540), y: KARTE.y - KF * (PH.y - 960), w: 1080 * KF };
const ausLF = (st: Stellung): Stellung => ({ s: st.s / KF, cx: LF_FENSTER.x + KF * (st.cx - 540), cy: LF_FENSTER.y + KF * (st.cy - 960), rot: st.rot });

const KAM = flussKamera(
  [
    { f: 0, s: 1.0, cx: 560, cy: 960 },
    { f: b(4), s: 1.1, cx: 620, cy: 1060 },
    { f: F_TAUCH, s: 1.3, cx: 670, cy: 1240 },
    { f: F_TAUCH + 40, s: 1080 / KARTE.w * 1.12, cx: KARTE.x, cy: KARTE.y },
    { f: F_TAUCH + 46, s: 1080 / KARTE.w * 1.12, cx: KARTE.x, cy: KARTE.y },
    { ...ausLF({ s: 1.0, cx: 560, cy: 980 }), f: F_TAUCH + 92 },
    { ...ausLF({ s: 1.06, cx: 580, cy: 1010 }), f: SHOWCASE_DAUER + 20 },
  ],
  SHOWCASE_DAUER,
  { glaettung: 6, drift: 0 },
);
// Wechsel in die Lieblingsfund-Welt: erster Frame, in dem die Karte das ganze Bild deckt
const F_WECHSEL = (() => {
  for (let f = F_TAUCH; f < SHOWCASE_DAUER; f++) if (deckt(KAM.bei(f), { x: KARTE.x, y: KARTE.y, w: KARTE.w, h: KARTE.h })) return f;
  throw new Error("Tauchfahrt erreicht die Karte nicht (Zoom zu klein)");
})();

// ============================ Seiten-Inhalt ============================
/** Ganzseiten-Bild, um scrollY (CSS-px) verschoben, auf Breite w. px2 = Bildpixel pro CSS-px. */
const Seite: React.FC<{ src: string; css: number; px2: number; w: number; scrollY: number; x?: number }> = ({ src, css, w, scrollY, x = 0 }) => (
  <Img src={src} style={{ position: "absolute", left: x, top: -scrollY * (w / css), width: w }} />
);
const Kopf: React.FC<{ src: string; css: number; hCss: number; w: number }> = ({ src, css, hCss, w }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: hCss * (w / css), overflow: "hidden" }}>
    <Img src={src} style={{ width: w }} />
  </div>
);

const reglerWert = (f: number) => schritte(f, 50, [{ f: F_REGLER + 14, d: 14, v: 100 }, { f: F_REGLER + 34, d: 18, v: 2 }]);
const reglerBild = (ordner: string, f: number) => A(`${ordner}/r${String(Math.round(reglerWert(f) / 2.5)).padStart(2, "0")}.png`);
const seitenWisch = (f: number) => mj((f - F_SEITE) / 10); // 0 = Startseite, 1 = /websites/

const SollevaHandy: React.FC<{ f: number }> = ({ f }) => {
  const scroll = schritte(f, 0, [{ f: F_REGLER, d: 12, v: 1089 }]);
  const imRegler = f >= F_REGLER + 12 && f < F_SEITE + 10;
  const w = seitenWisch(f);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-w * PH.w}px)` }}>
        {imRegler ? <Img src={reglerBild("solleva/regler", f)} style={{ position: "absolute", left: 0, top: 0, width: PH.w }} /> : <Seite src={A("seiten/solleva-start-mobil.png")} css={390} px2={2} w={PH.w} scrollY={scroll} />}
      </div>
      {w > 0 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - w) * PH.w}px)`, background: "#04050c" }}><Seite src={A("seiten/solleva-websites-mobil.png")} css={390} px2={2} w={PH.w} scrollY={0} />
        {/* Lieblingsfund-Bild in voller Auflösung über die Stelle legen (Tauchfahrt bleibt scharf) */}
        <Img src={A("projekte/lieblingsfund-mobile.webp")} style={{ position: "absolute", left: 23 * PH_S, top: 483 * PH_S, width: 186 * PH_S, height: 403 * PH_S }} />
      </div>}
    </>
  );
};
const SollevaLaptop: React.FC<{ f: number }> = ({ f }) => {
  const scroll = schritte(f, 0, [{ f: F_REGLER, d: 12, v: 832 }]);
  const imRegler = f >= F_REGLER + 12 && f < F_SEITE + 10;
  const w = seitenWisch(f);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-w * DT.w}px)` }}>
        {imRegler ? <Img src={reglerBild("seiten/regler-desktop", f)} style={{ position: "absolute", left: 0, top: 0, width: DT.w }} /> : <Seite src={A("seiten/solleva-start-desktop.png")} css={1440} px2={1} w={DT.w} scrollY={scroll} />}
      </div>
      {w > 0 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - w) * DT.w}px)`, background: "#04050c" }}><Seite src={A("seiten/solleva-websites-desktop.png")} css={1440} px2={1} w={DT.w} scrollY={0} /></div>}
    </>
  );
};
const LfHandy: React.FC<{ f: number }> = ({ f }) => {
  const scroll = schritte(f, 0, [{ f: F_LF_SCROLL, d: 14, v: 880 }]);
  if (f < F_LF_SCROLL) return <Img src={A("projekte/lieblingsfund-mobile.webp")} style={{ position: "absolute", left: 0, top: 0, width: PH.w, height: PH.h }} />;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#fdf8f3" }} />
      <Seite src={A("seiten/lieblingsfund-mobil.png")} css={390} px2={2} w={PH.w} scrollY={scroll} />
      <Kopf src={A("seiten/lieblingsfund-mobil-viewport0.png")} css={390} hCss={64} w={PH.w} />
    </>
  );
};
const LfLaptop: React.FC<{ f: number }> = ({ f }) => {
  const scroll = schritte(f, 0, [{ f: F_LF_SCROLL, d: 14, v: 1010 }]);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#fdf8f3" }} />
      <Seite src={A("seiten/lieblingsfund-desktop.png")} css={1440} px2={1} w={DT.w} scrollY={scroll} />
      <Kopf src={A("seiten/lieblingsfund-desktop-viewport0.png")} css={1440} hCss={76} w={DT.w} />
    </>
  );
};

// ============================ Geräte ============================
const Laptop: React.FC<{ url: string; pose: number; f: number; dunkel?: boolean; children: React.ReactNode }> = ({ url, pose, f, dunkel, children }) => {
  const schweben = Math.sin(f / 40) * 8 + Math.sin(f / 23) * 3;
  return (
    <div style={{ position: "absolute", left: DT.x - DT.w / 2, top: DT.y - (DT_H + DT.bar) / 2 + schweben * pose, width: DT.w, height: DT_H + DT.bar, perspective: 2200 }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${9 * pose}deg) rotateX(${6 * pose}deg) rotateZ(${-1.5 * pose}deg)`, borderRadius: 14, overflow: "hidden", background: dunkel ? "#15161d" : "#ecebef", boxShadow: "0 40px 90px rgba(0,0,0,.55), 0 0 0 1.5px rgba(255,255,255,.14)" }}>
        <div style={{ height: DT.bar, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: dunkel ? "#1d1e27" : "#e6e4ea" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
          <div style={{ marginLeft: 70, flex: 1, maxWidth: 360, height: 20, borderRadius: 7, background: dunkel ? "#2a2b36" : "#d6d4dc", color: dunkel ? "#b4bde0" : "#55536b", fontFamily: "Inter", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{url}</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: DT.bar, width: DT.w, height: DT_H, overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  );
};
const Telefon: React.FC<{ pose: number; f: number; children: React.ReactNode }> = ({ pose, f, children }) => {
  const schweben = Math.sin(f / 33 + 1) * 10 + Math.sin(f / 19) * 3;
  const R = 52;
  return (
    <div style={{ position: "absolute", left: PH.x - PH.w / 2 - 12, top: PH.y - PH.h / 2 - 12 + schweben * pose, width: PH.w + 24, height: PH.h + 24, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${-10 * pose}deg) rotateX(${4 * pose}deg) rotateZ(${1.5 * pose}deg)`, borderRadius: R + 12, padding: 12, background: "linear-gradient(150deg,#e8ecf5,#6b7186 35%,#f2f5fb 55%,#8a93ab)", boxShadow: "0 50px 100px rgba(0,0,0,.6)" }}>
        <div style={{ position: "relative", width: PH.w, height: PH.h, borderRadius: R, overflow: "hidden", background: "#000" }}>
          {children}
          <div style={{ position: "absolute", top: 11, left: "50%", width: 100, height: 29, marginLeft: -50, background: "#000", borderRadius: 15 }} />
        </div>
      </div>
    </div>
  );
};

// ============================ Welten ============================
const Hintergrund: React.FC<{ src: string; f: number; hell?: number }> = ({ src, f, hell = 0.42 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#04050c" }}>
    <Img src={src} style={{ position: "absolute", left: -700, top: -200, width: 2480, height: 2320, objectFit: "cover", filter: `blur(46px) brightness(${hell}) saturate(1.25)`, transform: `scale(${1.05 + 0.03 * Math.sin(f / 90)}) translateX(${Math.sin(f / 70) * 20}px)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 40%, rgba(4,5,12,.6) 100%)" }} />
  </AbsoluteFill>
);

const SollevaWelt: React.FC<{ f: number }> = ({ f }) => {
  const pose = 1 - mj((f - (F_TAUCH - 8)) / 40); // Handy dreht sich zur Kamera, wenn sie eintaucht
  return (
    <AbsoluteFill>
      <Hintergrund src={A("seiten/solleva-start-desktop-hero.png")} f={f} hell={0.75} />
      <Laptop url="solleva.ch" pose={1} f={f} dunkel><SollevaLaptop f={f} /></Laptop>
      <Telefon pose={pose} f={f}><SollevaHandy f={f} /></Telefon>
    </AbsoluteFill>
  );
};
const LfWelt: React.FC<{ f: number }> = ({ f }) => {
  const pose = mj((f - F_WECHSEL - 6) / 40);
  return (
    <AbsoluteFill>
      <Hintergrund src={A("seiten/lieblingsfund-desktop-viewport0.png")} f={f} hell={0.5} />
      <Laptop url="deinlieblingsfund.de" pose={pose} f={f}><LfLaptop f={f} /></Laptop>
      <Telefon pose={pose} f={f}><LfHandy f={f} /></Telefon>
    </AbsoluteFill>
  );
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  const st = KAM.bei(f);
  if (f < F_WECHSEL) return <AbsoluteFill style={{ transformOrigin: "0 0", transform: kameraCss(st) }}><SollevaWelt f={f} /></AbsoluteFill>;
  return <AbsoluteFill style={{ transformOrigin: "0 0", transform: kameraCss(inKind(st, LF_FENSTER)) }}><LfWelt f={f} /></AbsoluteFill>;
};

const scrollTempo = (f: number) => {
  const nah = (t: number, d: number) => (f >= t && f <= t + d ? Math.sin(Math.PI * (f - t) / d) * 0.04 : 0);
  return nah(F_REGLER, 12) + nah(F_SEITE, 10) + nah(F_LF_SCROLL, 14);
};

export const R05Showcase: React.FC = () => {
  const f = useCurrentFrame();
  const vor = f < F_WECHSEL;
  return (
    <AbsoluteFill style={{ background: "#04050c" }}>
      <Bewegungsunschaerfe f={f} tempo={f === F_WECHSEL ? 0 : KAM.tempo(f) + scrollTempo(f)} render={(x) => <Welt f={vor ? Math.min(x, F_WECHSEL - 0.001) : Math.max(x, F_WECHSEL)} />} />
      <Filmlook />
    </AbsoluteFill>
  );
};

export const SHOWCASE_KURVE = () => KAM.kurvenWerte();
export const SHOWCASE_WECHSEL = F_WECHSEL;
