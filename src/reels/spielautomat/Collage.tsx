import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";

// Standbild «Vintage-Collage / Papiertheater» (Ref. 08) für Reel «Spielautomat», Moment 1 (Hook).
// Reiner Code-Entwurf: Ebenen, Komposition, Farben. Im fertigen Reel ersetzen Higgsfield-Illustrationen
// (Kupferstich-Look) die gezeichneten Objekte.

export const vintage = {
  papier: "#EFE3C8",
  papier2: "#E0CDA5",
  tinte: "#1E1712",
  rot: "#A3201E",
  rotTief: "#5E0F12",
  gold: "#C99A3B",
  goldHell: "#E9C77A",
  nacht: "#14182E",
};

const fonts: [string, string, string][] = [
  ["Fell SC", "im-fell-english-sc-latin-400-normal.woff2", "normal"],
  ["Fell", "im-fell-english-latin-400-italic.woff2", "italic"],
  ["Rye", "rye-latin-400-normal.woff2", "normal"],
];
const VintageSchriften: React.FC = () => {
  const [h] = useState(() => delayRender("Vintage-Schriften"));
  useEffect(() => {
    Promise.all(
      fonts.map(async ([fam, file, style]) => {
        const f = new FontFace(fam, `url(${staticFile(`fonts/${file}`)})`, { style });
        await f.load();
        document.fonts.add(f);
      }),
    ).then(() => continueRender(h));
  }, [h]);
  return null;
};

// ---------- Ebene 1: Strahlen-Spirale ----------
const Strahlen: React.FC<{ cx: string; cy: string }> = ({ cx, cy }) => (
  <AbsoluteFill
    style={{
      background: `repeating-conic-gradient(from 0deg at ${cx} ${cy}, ${vintage.papier} 0deg 7deg, ${vintage.papier2} 7deg 14deg)`,
    }}
  />
);

// ---------- Ebene 2: Zirkusboden ----------
const Boden: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: -200,
      right: -200,
      top: 1480,
      height: 700,
      background: `repeating-conic-gradient(from 0deg at 50% -40%, ${vintage.tinte} 0deg 4deg, ${vintage.papier} 4deg 8deg)`,
      borderTop: `6px solid ${vintage.tinte}`,
    }}
  />
);

// ---------- Ebene 3: Vorhänge + Volant ----------
const Vorhang: React.FC<{ seite: "l" | "r" }> = ({ seite }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      [seite === "l" ? "left" : "right"]: 0,
      width: 150,
      height: 1600,
      background: `repeating-linear-gradient(90deg, ${vintage.rotTief} 0px, ${vintage.rot} 22px, #C4372F 34px, ${vintage.rot} 46px, ${vintage.rotTief} 64px)`,
      borderRadius: seite === "l" ? "0 0 150px 0" : "0 0 0 150px",
      boxShadow: "0 0 60px rgba(0,0,0,.55)",
    }}
  />
);

const Volant: React.FC = () => {
  const n = 7;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 210 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: `linear-gradient(${vintage.rotTief}, ${vintage.rot})` }} />
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 60,
            left: (i * 1080) / n - 10,
            width: 1080 / n + 20,
            height: 130,
            borderRadius: "0 0 50% 50%",
            background: `radial-gradient(ellipse at 50% 0%, #C4372F, ${vintage.rotTief})`,
            borderBottom: `10px solid ${vintage.gold}`,
            boxShadow: "0 14px 24px rgba(0,0,0,.4)",
          }}
        />
      ))}
    </div>
  );
};

// ---------- Hängende Requisiten ----------
const Faden: React.FC<{ x: number; bis: number }> = ({ x, bis }) => (
  <div style={{ position: "absolute", left: x, top: 150, width: 2, height: bis - 150, background: vintage.tinte, opacity: 0.7 }} />
);

const Mond: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <svg style={{ position: "absolute", left: x - r, top: y - r }} width={r * 2} height={r * 2} viewBox="-50 -50 100 100">
    <path d="M10,-46 A46,46 0 1,0 10,46 A34,34 0 1,1 10,-46 Z" fill={vintage.goldHell} stroke={vintage.tinte} strokeWidth={2.5} />
    {Array.from({ length: 7 }, (_, i) => (
      <line key={i} x1={-30 + i * 3} y1={-20 + i * 6} x2={-18 + i * 3} y2={-16 + i * 6} stroke={vintage.tinte} strokeWidth={1.2} opacity={0.5} />
    ))}
  </svg>
);

const Stern: React.FC<{ x: number; y: number; r: number; dreh?: number }> = ({ x, y, r, dreh = 0 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return (
    <svg style={{ position: "absolute", left: x - r, top: y - r, transform: `rotate(${dreh}deg)` }} width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}>
      <polygon points={pts} fill="#D9822B" stroke={vintage.tinte} strokeWidth={2} />
    </svg>
  );
};

const Wolke: React.FC<{ x: number; y: number; w: number; spiegeln?: boolean }> = ({ x, y, w, spiegeln }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: spiegeln ? "scaleX(-1)" : undefined }} width={w} height={w * 0.42} viewBox="0 0 200 84">
    <path
      d="M10,74 C0,74 0,54 16,52 C12,34 36,28 46,40 C50,16 84,10 94,32 C104,8 144,10 146,36 C162,26 190,38 180,56 C198,58 198,76 184,76 Z"
      fill="#F7EEDC"
      stroke={vintage.tinte}
      strokeWidth={2.2}
    />
    <path d="M40,60 C56,54 70,62 86,56 M110,58 C126,50 140,60 158,54" fill="none" stroke={vintage.tinte} strokeWidth={1.2} opacity={0.5} />
  </svg>
);

const Karte: React.FC<{ x: number; y: number; dreh: number; w?: number; zeichen?: string; farbe?: string }> = ({ x, y, dreh, w = 170, zeichen = "♥", farbe = vintage.rot }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: w * 1.45,
      background: "#F6EEDD",
      border: `2px solid ${vintage.tinte}`,
      borderRadius: 12,
      transform: `rotate(${dreh}deg)`,
      boxShadow: "8px 14px 0 rgba(30,23,18,.25)",
      fontFamily: "Fell SC",
      color: farbe,
    }}
  >
    <div style={{ position: "absolute", left: 10, top: 4, fontSize: w * 0.22, lineHeight: 1 }}>A<br />{zeichen}</div>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: w * 0.6 }}>{zeichen}</div>
    <div style={{ position: "absolute", right: 10, bottom: 4, fontSize: w * 0.22, lineHeight: 1, transform: "rotate(180deg)" }}>A<br />{zeichen}</div>
  </div>
);

// ---------- Hauptobjekt: alter Jahrmarkt-Automat ----------
const Automat: React.FC = () => {
  const x = 245, y = 860, w = 560, h = 700;
  const walze = (i: number, zeichen: string, farbe: string) => (
    <div
      key={i}
      style={{
        position: "absolute",
        left: 45 + i * 160,
        top: 230,
        width: 140,
        height: 200,
        background: "linear-gradient(#CDBE9C, #F6EEDD 30%, #F6EEDD 70%, #CDBE9C)",
        border: `3px solid ${vintage.tinte}`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Fell SC",
        fontSize: 120,
        color: farbe,
      }}
    >
      {zeichen}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* Schatten am Boden */}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: -40, height: 60, borderRadius: "50%", background: "rgba(30,23,18,.45)", filter: "blur(14px)" }} />
      {/* Kopf mit Bogen */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 0, height: 190, borderRadius: "300px 300px 0 0", background: `linear-gradient(${vintage.goldHell}, ${vintage.gold})`, border: `3px solid ${vintage.tinte}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 18, borderRadius: "280px 280px 0 0", background: vintage.rot, border: `2px solid ${vintage.tinte}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 78, textAlign: "center", fontFamily: "Rye", fontSize: 62, color: vintage.goldHell, textShadow: `3px 3px 0 ${vintage.tinte}` }}>GLÜCK</div>
      </div>
      {/* Körper */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 180,
          bottom: 0,
          background: `repeating-linear-gradient(90deg, ${vintage.rot} 0 30px, #8E1A19 30px 34px)`,
          border: `3px solid ${vintage.tinte}`,
          borderRadius: 18,
          boxShadow: "inset 0 0 0 14px " + vintage.gold + ", inset 0 0 0 17px " + vintage.tinte,
        }}
      >
        {/* Fenster */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: 270, background: vintage.tinte, borderRadius: 14, border: `6px solid ${vintage.gold}` }} />
        <div style={{ position: "absolute", left: 0, top: -180, width: "100%" }}>
          {walze(0, "♥", vintage.rot)}
          {walze(1, "♥", vintage.rot)}
          {walze(2, "?", vintage.tinte)}
        </div>
        {/* Schild */}
        <div style={{ position: "absolute", left: 90, right: 90, top: 340, height: 80, background: "#F6EEDD", border: `3px solid ${vintage.tinte}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fell SC", fontSize: 32, color: vintage.tinte, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
          1 WISCH · 1 DREH
        </div>
        {/* Münzschlitz + Schale */}
        <div style={{ position: "absolute", left: 240, top: 450, width: 80, height: 14, background: vintage.tinte, borderRadius: 7 }} />
        <div style={{ position: "absolute", left: 110, right: 110, top: 490, height: 40, background: vintage.gold, border: `3px solid ${vintage.tinte}`, borderRadius: "0 0 40px 40px" }} />
      </div>
      {/* Hebel */}
      <div style={{ position: "absolute", left: w - 6, top: 360, width: 70, height: 50, background: vintage.gold, border: `3px solid ${vintage.tinte}`, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: w + 40, top: 160, width: 18, height: 230, background: "linear-gradient(90deg,#EDE3CF,#9A8E7A)", border: `2px solid ${vintage.tinte}`, borderRadius: 9, transform: "rotate(10deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", left: w + 34, top: 120, width: 70, height: 70, borderRadius: 35, background: `radial-gradient(circle at 35% 30%, #E25B4A, ${vintage.rotTief})`, border: `2px solid ${vintage.tinte}` }} />
    </div>
  );
};

// ---------- Papierkorn + Vignette ----------
const Papier: React.FC = () => (
  <>
    <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.32 }}>
      <svg width="100%" height="100%">
        <filter id="papier">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed={4} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#papier)" />
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 55%, rgba(40,20,10,.55) 100%)" }} />
  </>
);

export const Collage: React.FC = () => (
  <AbsoluteFill style={{ background: vintage.papier, overflow: "hidden" }}>
    <VintageSchriften />
    <Strahlen cx="50%" cy="58%" />
    <Boden />
    {/* hängende Requisiten hinter dem Automaten */}
    <Faden x={290} bis={700} />
    <Mond x={290} y={760} r={62} />
    <Faden x={850} bis={650} />
    <Stern x={850} y={695} r={48} dreh={8} />
    <Automat />
    {/* Vordergrund: Karten, leicht unscharf */}
    <div style={{ filter: "blur(2.5px)" }}>
      <Karte x={-30} y={1540} dreh={-18} w={210} />
      <Karte x={850} y={1580} dreh={16} w={200} zeichen="♠" farbe={vintage.tinte} />
    </div>
    <Vorhang seite="l" />
    <Vorhang seite="r" />
    <Volant />
    <Wolke x={-40} y={1390} w={330} />
    <Wolke x={790} y={1450} w={300} spiegeln />
    {/* Text */}
    <div style={{ position: "absolute", left: 160, right: 160, top: 280, textAlign: "center", fontFamily: "Fell SC", fontSize: 60, whiteSpace: "nowrap", lineHeight: 1.04, color: vintage.tinte, textShadow: `0 2px 0 ${vintage.papier}` }}>
      DEIN DAUMEN ZIEHT<br />GERADE AN EINEM
    </div>
    <div style={{ position: "absolute", left: 150, right: 150, top: 450, textAlign: "center", fontFamily: "Fell", fontStyle: "italic", fontSize: 112, color: vintage.rot }}>
      Spielautomaten.
    </div>
    {/* roter Handkreis */}
    <svg style={{ position: "absolute", left: 150, top: 450 }} width={780} height={180} viewBox="0 0 880 200" preserveAspectRatio="none">
      <path d="M60,120 C40,40 420,10 760,40 C880,55 860,170 600,180 C320,195 80,180 70,110 C66,80 140,52 220,46" fill="none" stroke={vintage.rot} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
    </svg>
    <Papier />
  </AbsoluteFill>
);
