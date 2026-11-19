// Reel 04 v2: Standbilder zur Freigabe (keine Credits). Hintergründe/Gerät/Figur = Platzhalter bis Higgsfield.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile, useCurrentFrame } from "remotion";
import { farben } from "../../brand/solleva";
import { Blaetterschatten, Koernung, schriftR04, SchriftenR04, TiltShift } from "./Look";
import { Schatten, Staub, Welt, Zeile3D } from "./Stiltest";

const SchreibmaschinenSchrift: React.FC = () => {
  const [h] = useState(() => delayRender("Special Elite"));
  useEffect(() => {
    const ff = new FontFace("Special Elite", `url(${staticFile("fonts/special-elite-latin-400-normal.woff2")})`);
    ff.load().then((x) => { document.fonts.add(x); continueRender(h); });
  }, [h]);
  return null;
};

const Hinweis: React.FC<{ text: string; y?: number }> = ({ text, y = 120 }) => (
  <div style={{ position: "absolute", top: y, left: 70, right: 140, display: "flex" }}>
    <div style={{ background: "rgba(14,10,40,.85)", color: farben.gold, fontFamily: schriftR04.mono, fontSize: 24, padding: "6px 14px", borderRadius: 8 }}>{text}</div>
  </div>
);

// ---------- Platzhalter-Welten (werden durch Higgsfield ersetzt) ----------
const SamtSpot: React.FC = () => (
  <AbsoluteFill style={{ background: "#1a0f3d" }}>
    <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.5 }}>
      <filter id="samt"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed={4} /><feColorMatrix type="matrix" values="0.2 0 0 0 0.12  0.1 0 0 0 0.05  0.35 0 0 0 0.25  0 0 0 0 1" /></filter>
      <rect width="1080" height="1920" filter="url(#samt)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 48% 34% at 50% 46%, rgba(169,139,255,.55), rgba(108,63,212,.18) 55%, transparent 75%)" }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 300px rgba(4,2,16,.9)" }} />
  </AbsoluteFill>
);

const Kork: React.FC = () => (
  <AbsoluteFill style={{ background: "#3d2378" }}>
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <filter id="kork"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed={7} /><feColorMatrix type="matrix" values="0.32 0 0 0 0.12  0.16 0 0 0 0.04  0.48 0 0 0 0.2  0 0 0 0 1" /></filter>
      <rect width="1080" height="1920" filter="url(#kork)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 25% 15%, rgba(255,250,240,.18), transparent 60%)", mixBlendMode: "screen" }} />
    <Blaetterschatten seed={5} staerke={0.35} />
    <Koernung staerke={0.12} seed={3} />
  </AbsoluteFill>
);

// ---------- Dymo-Prägeband ----------
const zufall = (i: number) => ((Math.sin(i * 91.7 + 3.1) * 4375.85) % 1 + 1) % 1;
export const DymoBand: React.FC<{ text: string; sichtbar?: number; farbe?: string }> = ({ text, sichtbar = text.length, farbe = "#5B2FC4" }) => (
  <div style={{ display: "inline-flex", alignItems: "center", height: 128, padding: "0 40px", borderRadius: 10, background: `linear-gradient(180deg, ${farbe} 0%, #3f1c96 55%, #2d1173 100%)`, boxShadow: "inset 0 3px 0 rgba(255,255,255,.28), inset 0 -4px 0 rgba(0,0,0,.35)", position: "relative" }}>
    <div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 10, borderRadius: 6, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)" }} />
    {text.split("").map((c, i) => (
      <span key={i} style={{ fontFamily: schriftR04.display, fontWeight: 800, fontStretch: "75%", fontSize: 92, letterSpacing: "0.06em", color: "#F4F1FF", opacity: i < sichtbar ? 0.95 : 0, display: "inline-block", transform: `translateY(${(zufall(i) - 0.5) * 5}px) rotate(${(zufall(i + 9) - 0.5) * 3}deg)`, textShadow: "-1px -2px 0 rgba(255,255,255,.55), 2px 3px 0 rgba(20,6,60,.75), 0 0 2px rgba(255,255,255,.4)" }}>
        {c === " " ? " " : c}
      </span>
    ))}
  </div>
);

// ---------- Karteikarte mit Schreibmaschinenschrift ----------
const Karteikarte: React.FC<{ text: string; cursor?: boolean }> = ({ text, cursor }) => (
  <div style={{ width: 640, height: 250, background: "#F5F0E3", borderRadius: 6, position: "relative", backgroundImage: "repeating-linear-gradient(0deg, transparent 0 46px, rgba(108,63,212,.14) 46px 48px)", boxShadow: "inset 0 0 30px rgba(120,100,60,.18)" }}>
    <div style={{ position: "absolute", top: 0, left: 58, width: 3, height: "100%", background: "rgba(201,53,53,.35)" }} />
    <div style={{ position: "absolute", left: 90, top: 70, fontFamily: "Special Elite", fontSize: 74, color: "#1b1630", letterSpacing: "0.04em" }}>
      {text.split("").map((c, i) => <span key={i} style={{ opacity: 0.78 + zufall(i) * 0.22 }}>{c}</span>)}
      {cursor && <span style={{ opacity: 0.6 }}>_</span>}
    </div>
  </div>
);
const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: "radial-gradient(circle at 35% 30%, #C9B6FF, #6C3FD4 55%, #3a1c8c)", boxShadow: "6px 10px 8px rgba(20,8,60,.5)" }} />
);

const Geraet: React.FC<{ label: string; x: number; y: number; w: number; h: number; dreh?: number }> = ({ label, x, y, w, h, dreh = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${dreh}deg)`, border: `4px dashed ${farben.gold}`, borderRadius: 30, background: "rgba(14,10,40,.55)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: schriftR04.mono, fontSize: 26, color: farben.gold, padding: 20, boxSizing: "border-box", whiteSpace: "pre-line" }}>{label}</div>
);

const Szene: React.FC<{ nr: number }> = ({ nr }) => {
  if (nr === 0) {
    // Hook, Frame 1: Klappe ist schon zu (Staub fliegt), FILMCREW steht sofort gross.
    return (
      <AbsoluteFill>
        <SamtSpot />
        {/* Matte nur angedeutet: Ecke unten links, im Halbdunkel */}
        <div style={{ position: "absolute", left: -380, top: 1240, width: 900, height: 900, overflow: "hidden", transform: "rotate(-12deg)", borderRadius: 18, opacity: 0.75, filter: "brightness(.55)" }}>
          <Img src={staticFile("r04/welt-matte-a.png")} style={{ width: 1300, marginLeft: -200, marginTop: -400 }} />
        </div>
        <div style={{ position: "absolute", left: 540 - 330, top: 900 - 330, width: 660, height: 660, transform: "rotate(-5deg)", filter: Schatten(1) }}>
          <Img src={staticFile("r04/obj-klappe-brett.png")} style={{ position: "absolute", width: "100%" }} />
          <Img src={staticFile("r04/obj-klappe-stab.png")} style={{ position: "absolute", width: "100%", transformOrigin: `${(90 / 1024) * 100}% ${(258 / 1024) * 100}%`, transform: "rotate(13deg)" }} />
        </div>
        <Staub f={3} start={0} x={760} y={690} />
        <TiltShift blur={9} fokus={52} />
        <Zeile3D text="FILMCREW" start={-10} top={300} groesse={126} f={0} pA="#B9A6F5" pB="#2A1670" />
        <Hinweis text="HOOK · FRAME 1 · Samt = Platzhalter (Higgsfield)" />
      </AbsoluteFill>
    );
  }
  if (nr === 1) {
    // Variante A: Dymo-Prägeband auf violettem Kork
    return (
      <AbsoluteFill>
        <Kork />
        {[["HOOK", 320, -4], ["GESCHICHTE", 530, 3], ["DETAILS", 740, -2]].map(([t, y, d], i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 140, top: y as number, display: "flex", justifyContent: "center", transform: `rotate(${d}deg)`, filter: Schatten(0.5) }}>
            <DymoBand text={t as string} />
          </div>
        ))}
        <Geraet label={"DYMO-PRÄGEGERÄT\n(Higgsfield)\nBand kommt Buchstabe für Buchstabe"} x={420} y={1000} w={520} h={330} dreh={-8} />
        <div style={{ position: "absolute", left: 120, top: 1090, transform: "rotate(-8deg)", filter: Schatten(0.4) }}>
          <DymoBand text="DETAILS" sichtbar={4} />
        </div>
        <TiltShift blur={8} fokus={55} />
        <Hinweis text="VARIANTE A · DYMO · Kork = Platzhalter (Higgsfield)" />
      </AbsoluteFill>
    );
  }
  if (nr === 2) {
    // Variante B: Schreibmaschine tippt auf Karteikarten
    return (
      <AbsoluteFill>
        <Kork />
        {[["HOOK", 260, -3, 150], ["GESCHICHTE", 560, 2, 190], ["DETAILS", 860, -2, 140]].map(([t, y, d, x], i) => (
          <div key={i} style={{ position: "absolute", left: x as number, top: y as number, transform: `rotate(${d}deg)`, filter: Schatten(0.8) }}>
            <Karteikarte text={t as string} />
            <Pin x={320} y={22} />
          </div>
        ))}
        <Geraet label={"SCHREIBMASCHINE\n(Higgsfield)\ntippt die Karte, Karte wird angepinnt"} x={180} y={1170} w={700} h={300} dreh={3} />
        <TiltShift blur={8} fokus={55} />
        <Hinweis text="VARIANTE B · SCHREIBMASCHINE · Kork = Platzhalter" />
      </AbsoluteFill>
    );
  }
  // Mini-Figur: Anordnung (Figur = Platzhalter, bis deine Fotos da sind)
  const kreis = [
    { src: "r04/obj-klappe-brett.png", w: 250, a: -150 },
    { src: "r04/obj-kamera-a.png", w: 250, a: -90 },
    { src: "r04/obj-lampe-a.png", w: 220, a: -30 },
    { src: "r04/obj-filmrolle-a.png", w: 210, a: 30 },
    { src: "r04/obj-laden-a.png", w: 220, a: 90 },
    { src: "r04/obj-polaroid-a.png", w: 190, a: 150 },
  ];
  const cx = 540, cy = 930, rx = 360, ry = 330;
  return (
    <AbsoluteFill>
      <Welt src="r04/welt-matte-a.png" breite={1500} />
      {kreis.map((o, i) => (
        <div key={i} style={{ position: "absolute", left: cx + Math.cos((o.a * Math.PI) / 180) * rx - o.w / 2, top: cy + Math.sin((o.a * Math.PI) / 180) * ry - o.w / 2, width: o.w, height: o.w, transform: `rotate(${(i % 2 ? 1 : -1) * 8}deg)`, filter: Schatten(0.7) }}>
          <Img src={staticFile(o.src)} style={{ width: "100%" }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: cx - 150, top: cy + 160, width: 300, height: 70, borderRadius: "50%", background: "rgba(20,8,60,.45)", filter: "blur(14px)" }} />
      <div style={{ position: "absolute", left: cx - 110, top: cy - 300, width: 220, height: 480, borderRadius: "110px 110px 40px 40px", border: `4px dashed ${farben.gold}`, background: "rgba(14,10,40,.45)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: schriftR04.mono, fontSize: 24, color: farben.gold, padding: 14, boxSizing: "border-box", whiteSpace: "pre-line" }}>MINI-FIGUR{"\n"}von dir{"\n"}(Higgsfield, nach deinen Fotos)</div>
      <TiltShift blur={8} fokus={56} />
      <Zeile3D text="NUR ICH." start={-10} top={280} groesse={140} f={0} pA="#C9B48F" pB="#2B170C" />
      <Hinweis text="NUR ICH · Anordnung · Figur folgt nach deinen Fotos" />
    </AbsoluteFill>
  );
};

export const R04Freigabe: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SchriftenR04 />
      <SchreibmaschinenSchrift />
      <Szene nr={f} />
      <Koernung staerke={0.06} seed={21} />
    </AbsoluteFill>
  );
};
