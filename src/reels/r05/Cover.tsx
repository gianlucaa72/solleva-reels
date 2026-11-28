// Reel-Cover «MEINE NEUE WEBSITE.» (Skill solleva-posts, Leitstil «Wort dahinter», dunkel für Reel-Cover).
// 1080 × 1920; alles Wichtige im 3:4-Ausschnitt des Profil-Rasters (y 240–1680).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";

const A = (p: string) => staticFile(`assets/r05/${p}`);
const F = (p: string) => staticFile(`fonts/${p}`);

const schriften: [string, string, string][] = [
  ["Anton", "anton-latin-400-normal.woff2", "400"],
  ["Great Vibes", "great-vibes-latin-400-normal.woff2", "400"],
  ["Lexend", "lexend-latin-300-normal.woff2", "300"],
  ["Lexend", "lexend-latin-500-normal.woff2", "500"],
  ["Lexend", "lexend-latin-600-normal.woff2", "600"],
  ["Instrument Serif", "instrument-serif-latin-400-normal.woff2", "400"],
];
const Schriften: React.FC = () => {
  const [h] = useState(() => delayRender("Cover-Schriften"));
  useEffect(() => {
    Promise.all(schriften.map(async ([fam, datei, w]) => { const f = new FontFace(fam, `url(${F(datei)})`, { weight: w }); await f.load(); document.fonts.add(f); })).then(() => continueRender(h));
  }, [h]);
  return null;
};

const VIOLETT = "#6C3FD4", AKZENT = "#9E7CFF", HELL = "#B9A2FF", TEXT = "#F4F2F8";

/** Mini-Label mit kleinem Massstab (Leitstil). */
const Label: React.FC<{ text: string; x: number; y: number; rechts?: boolean }> = ({ text, x, y, rechts }) => (
  <div style={{ position: "absolute", left: rechts ? undefined : x, right: rechts ? 1080 - x : undefined, top: y, display: "flex", flexDirection: "column", alignItems: rechts ? "flex-end" : "flex-start", gap: 8 }}>
    <div style={{ fontFamily: "Lexend", fontWeight: 500, fontSize: 22, letterSpacing: 4, color: TEXT, opacity: 0.85 }}>{text}</div>
    <svg width="150" height="12" style={{ opacity: 0.6 }}>
      <line x1="0" y1="11" x2="150" y2="11" stroke={TEXT} strokeWidth="1.5" />
      {Array.from({ length: 11 }, (_, i) => <line key={i} x1={i * 15} y1={i % 5 === 0 ? 0 : 5} x2={i * 15} y2="11" stroke={TEXT} strokeWidth="1.5" />)}
    </svg>
  </div>
);

const Laptop: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const k = w / 1440, h = 900 * k, bar = 30;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h + bar, perspective: 2200 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateY(9deg) rotateX(7deg) rotateZ(-1.5deg)", borderRadius: 14, overflow: "hidden", background: "#15161d", boxShadow: `0 50px 110px rgba(0,0,0,.75), 0 0 0 1.5px rgba(255,255,255,.14), 0 0 80px rgba(108,63,212,.35)` }}>
        <div style={{ height: bar, display: "flex", alignItems: "center", gap: 7, padding: "0 12px", background: "#1d1e27" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />)}
          <div style={{ marginLeft: 60, flex: 1, maxWidth: 300, height: 18, borderRadius: 6, background: "#2a2b36", color: "#b4bde0", fontFamily: "Lexend", fontWeight: 300, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>solleva.ch</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: bar, width: w, height: h, overflow: "hidden", background: "#04050c" }}>
          <div style={{ position: "absolute", left: 0, top: 259 * k, width: w, height: 810 * k, overflow: "hidden" }}>
            <Img src={A("hero/hero-t2.png")} style={{ width: w, height: 810 * k }} />
          </div>
          <Img src={A("seiten/hero-text-desktop.png")} style={{ position: "absolute", left: 0, top: 0, width: w }} />
        </div>
      </div>
    </div>
  );
};
const Handy: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const h = w * (844 / 390), R = w * 0.16;
  return (
    <div style={{ position: "absolute", left: x - w / 2 - 10, top: y, width: w + 20, height: h + 20, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateY(-12deg) rotateX(5deg) rotateZ(3deg)", borderRadius: R + 10, padding: 10, background: "linear-gradient(150deg,#e8ecf5,#6b7186 35%,#f2f5fb 55%,#8a93ab)", boxShadow: "0 50px 100px rgba(0,0,0,.8), 0 0 60px rgba(108,63,212,.35)" }}>
        <div style={{ position: "relative", width: w, height: h, borderRadius: R, overflow: "hidden", background: "#04050c" }}>
          <Img src={A("seiten/solleva-start-mobil.png")} style={{ position: "absolute", left: 0, top: 0, width: w }} />
          <div style={{ position: "absolute", top: w * 0.033, left: "50%", width: w * 0.3, height: w * 0.088, marginLeft: -w * 0.15, background: "#000", borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
};
const Kristall: React.FC<{ x: number; y: number; h: number; dreh: number; blur?: number; o?: number }> = ({ x, y, h, dreh, blur = 0, o = 1 }) => (
  <Img src={A("kristalle/kristall-1.png")} style={{ position: "absolute", left: x, top: y, height: h, transform: `translate(-50%,-50%) rotate(${dreh}deg)`, filter: `blur(${blur}px) drop-shadow(0 0 36px rgba(158,124,255,.55))`, opacity: o }} />
);

const Korn: React.FC = () => (
  <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.28, pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="korn"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#korn)" />
    </svg>
  </AbsoluteFill>
);

export const R05Cover: React.FC<{ raster?: boolean }> = ({ raster = false }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Schriften />
    {/* Hintergrund: Planet-Horizont der Website, dunkel; Violett nur als Licht */}
    <Img src={A("hero/hero-t2.png")} style={{ position: "absolute", left: -900, top: 980, width: 2880, height: 1620, filter: "brightness(.55) saturate(.9) hue-rotate(18deg) blur(3px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,.9) 38%, rgba(0,0,0,.15) 62%, rgba(0,0,0,.7) 100%)" }} />
    {/* Glow hinter dem Titel (Objekt beleuchtet die Schrift) */}
    <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 420, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(108,63,212,.55), transparent 70%)`, filter: "blur(30px)" }} />

    {/* Logo oben mittig */}
    <div style={{ position: "absolute", top: 296, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
      <svg width="30" height="30" viewBox="0 0 30 30"><path d="M15 0 C16.5 10 20 13.5 30 15 C20 16.5 16.5 20 15 30 C13.5 20 10 16.5 0 15 C10 13.5 13.5 10 15 0 Z" fill={AKZENT} /></svg>
      <span style={{ fontFamily: "Lexend", fontWeight: 600, fontSize: 26, letterSpacing: 8, color: TEXT }}>SOLLEVA</span>
    </div>

    <Label text="SOLLEVA.CH" x={70} y={452} />
    <Label text="JETZT LIVE" x={1010} y={452} rechts />

    {/* Grosses Wort, in die Höhe gezogen, Verlauf Weiss → Violett */}
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", transform: "scaleY(1.28)", transformOrigin: "50% 0" }}>
      <span style={{ fontFamily: "Anton", fontSize: 262, lineHeight: 1, letterSpacing: "-0.01em", background: `linear-gradient(180deg, #FFFFFF 0%, #F1ECFF 30%, ${HELL} 58%, ${AKZENT} 80%, ${VIOLETT} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 12px 40px rgba(108,63,212,.45))" }}>WEBSITE.</span>
    </div>
    {/* Schreibschrift kreuzt das Wort */}
    <div style={{ position: "absolute", top: 500, left: 96, fontFamily: "Great Vibes", fontSize: 150, color: "#FFFFFF", transform: "rotate(-6deg)", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>Meine neue</div>

    {/* Geräte ragen von unten ins Wort (Verzahnung) */}
    <Laptop x={470} y={890} w={820} />
    <Handy x={822} y={1000} w={250} />

    {/* Kristall: scharf rechts oben, unscharf vorne links (Tiefe) */}
    <Kristall x={958} y={760} h={170} dreh={18} />
    <Kristall x={130} y={1430} h={300} dreh={-24} blur={10} o={0.8} />

    {/* Pille unten im 3:4-Ausschnitt */}
    <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "16px 34px", borderRadius: 99, border: `1.5px solid rgba(244,242,248,.55)`, fontFamily: "Lexend", fontWeight: 500, fontSize: 22, letterSpacing: 4, color: TEXT, background: "rgba(108,63,212,.18)" }}>LINK IN DER BIO</div>
    </div>

    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 55%, rgba(0,0,0,.6) 100%)" }} />
    <Korn />
    {raster && (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, height: 1440, outline: "3px dashed rgba(255,226,122,.9)" }} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
