import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { form, schrift, Stimmung } from "../brand/solleva";
import { atmen } from "../lib/bewegung";

// ---------- Schriften (lokal, Google-CDN ist im Headless-Chromium blockiert) ----------
const fontFiles: [string, string, string, string][] = [
  [schrift.text, "barlow-latin-500-normal.woff2", "500", "normal"],
  [schrift.text, "barlow-latin-700-normal.woff2", "700", "normal"],
  [schrift.text, "barlow-latin-800-normal.woff2", "800", "normal"],
  [schrift.serif, "instrument-serif-latin-400-italic.woff2", "400", "italic"],
  [schrift.serif, "instrument-serif-latin-400-normal.woff2", "400", "normal"],
  [schrift.mono, "jetbrains-mono-latin-500-normal.woff2", "500", "normal"],
  [schrift.hand, "allura-latin-400-normal.woff2", "400", "normal"],
  [schrift.notiz, "caveat-latin-600-normal.woff2", "600", "normal"],
  [schrift.titel, "barlow-condensed-latin-800-normal.woff2", "800", "normal"],
  [schrift.titel, "barlow-condensed-latin-900-normal.woff2", "900", "normal"],
  [schrift.titel, "barlow-condensed-latin-800-italic.woff2", "800", "italic"],
  [schrift.titel, "barlow-condensed-latin-900-italic.woff2", "900", "italic"],
];

let geladen: Promise<void> | null = null;
const ladeSchriften = () => {
  if (!geladen) {
    geladen = Promise.all(
      fontFiles.map(async ([family, file, weight, style]) => {
        const f = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight, style });
        await f.load();
        document.fonts.add(f);
      }),
    ).then(() => undefined);
  }
  return geladen;
};

export const Schriften: React.FC = () => {
  const [handle] = useState(() => delayRender("Schriften laden"));
  useEffect(() => {
    ladeSchriften().then(() => continueRender(handle));
  }, [handle]);
  return null;
};

// ---------- Hintergrund mit Textur ----------
const Raster: React.FC<{ farbe: string; dunkel: boolean }> = ({ farbe, dunkel }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${farbe} ${dunkel ? 1.2 : 1.6}px, transparent 0)`,
      backgroundSize: "36px 36px",
      opacity: dunkel ? 0.35 : 0.55,
    }}
  />
);

const Koernung: React.FC<{ dunkel: boolean }> = ({ dunkel }) => {
  const frame = useCurrentFrame();
  // Körnung wechselt alle 2 Frames → lebt, flackert aber nicht
  const seed = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{ opacity: dunkel ? 0.13 : 0.07, mixBlendMode: dunkel ? "screen" : "multiply" }}>
      <svg width="100%" height="100%">
        <filter id={`n${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#n${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Hintergrund: React.FC<{ s: Stimmung; ton2?: boolean; licht?: boolean }> = ({ s, ton2, licht = true }) => {
  const frame = useCurrentFrame();
  const bg = ton2 ? s.hintergrund2 : s.hintergrund;
  const lx = 50 + Math.sin(frame / 90) * 8;
  const ly = 30 + Math.cos(frame / 110) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {licht && (
        <AbsoluteFill
          style={{
            background: s.dunkel
              ? `radial-gradient(900px 900px at ${lx}% ${ly}%, rgba(143,227,255,.10), transparent 70%)`
              : `radial-gradient(1000px 1000px at ${lx}% ${ly}%, rgba(255,255,255,.75), transparent 70%)`,
          }}
        />
      )}
      {(s.textur === "raster" || s.textur === "beides") && (
        <Raster farbe={s.dunkel ? "#2A2E66" : "#CFC8EC"} dunkel={s.dunkel} />
      )}
      {(s.textur === "koernung" || s.textur === "beides") && <Koernung dunkel={s.dunkel} />}
    </AbsoluteFill>
  );
};

// ---------- Karte ----------
export const Karte: React.FC<{
  s: Stimmung;
  w: number;
  h: number;
  x?: number;
  y?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ s, w, h, x, y, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x ?? (1080 - w) / 2,
      top: y ?? (1920 - h) / 2,
      width: w,
      height: h,
      background: s.flaeche,
      borderRadius: form.radius,
      border: `${form.randBreite}px solid ${s.rand}`,
      boxShadow: s.dunkel ? form.schattenDunkel : form.schatten,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------- Kapitel-Label «// 01 NAME» ----------
export const Label: React.FC<{ s: Stimmung; text: string; x?: number; y?: number }> = ({ s, text, x = 70, y = 230 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: schrift.mono,
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: "0.14em",
      color: s.dunkel ? "#7C80B8" : "#8C89AE",
      textTransform: "uppercase",
    }}
  >
    {text}
  </div>
);

// ---------- Atmende Ebene (Standbilder leben weiter) ----------
export const Atmend: React.FC<{ dauer: number; seed?: number; children: React.ReactNode }> = ({
  dauer,
  seed = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const a = atmen(frame, dauer, seed);
  return (
    <AbsoluteFill style={{ transform: `translate(${a.x}px, ${a.y}px) scale(${a.scale})` }}>{children}</AbsoluteFill>
  );
};

// ---------- Headline-Helfer ----------
export const Headline: React.FC<{
  s: Stimmung;
  children: React.ReactNode;
  size?: number;
  y?: number;
  align?: "left" | "center";
}> = ({ s, children, size = 104, y = 700, align = "left" }) => (
  <div
    style={{
      position: "absolute",
      left: 70,
      right: 140,
      top: y,
      fontFamily: schrift.text,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: "-0.02em",
      color: s.tinte,
      textAlign: align,
    }}
  >
    {children}
  </div>
);

export const Serif: React.FC<{ s: Stimmung; children: React.ReactNode; style?: React.CSSProperties }> = ({
  s,
  children,
  style,
}) => (
  <span
    style={{
      fontFamily: schrift.serif,
      fontStyle: "italic",
      fontWeight: 400,
      color: s.akzent,
      letterSpacing: "-0.01em",
      ...style,
    }}
  >
    {children}
  </span>
);
