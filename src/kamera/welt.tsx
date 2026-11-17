import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { kurve } from "../lib/bewegung";

// ============================================================================
// K01 Virtuelle Kamera: eine Welt, eine Kamera, Ebenen mit Tiefe (Parallax).
//
// Kamera = { s, cx, cy }: Punkt (cx, cy) der Szene liegt in der Bildmitte, Zoom s.
// Ebene mit Tiefe d: Bild = (p − c_d) · s^d + Mitte, mit c_d = Mitte + (c − Mitte) · d.
//   d = 1 → bewegt sich exakt mit der Kamera (Hauptobjekt)
//   d < 1 → weiter hinten, bewegt/zoomt weniger (Hintergrund 0,3)
//   d > 1 → näher, bewegt/zoomt stärker (Vordergrund 1,6)
// Zoom-Through: Die nächste Szene liegt verkleinert in einem 9:16-Fenster des Schlüsselobjekts.
// Die Kamera fährt hinein, bis das Fenster genau das Bild füllt → unsichtbarer Wechsel.
// ============================================================================

export const MITTE = { x: 540, y: 960 };
export type Cam = { s: number; cx: number; cy: number };
export const RUHE: Cam = { s: 1, cx: 540, cy: 960 };
export type Rechteck = { x: number; y: number; w: number; h: number };

export const TIEFE = { hintergrund: 0.3, haupt: 1.0, text: 1.1, vordergrund: 1.6 };

export const ebenenTransform = (cam: Cam, d: number) => {
  const s = Math.pow(cam.s, d);
  const cx = MITTE.x + (cam.cx - MITTE.x) * d;
  const cy = MITTE.y + (cam.cy - MITTE.y) * d;
  return `translate(${MITTE.x}px, ${MITTE.y}px) scale(${s}) translate(${-cx}px, ${-cy}px)`;
};

/** Ebene einer Szene. Kinder in Szenen-Koordinaten (1080 × 1920). */
export const Ebene: React.FC<{ cam: Cam; tiefe: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ cam, tiefe, children, style }) => (
  <AbsoluteFill style={{ transformOrigin: "0 0", transform: ebenenTransform(cam, tiefe), ...style }}>{children}</AbsoluteFill>
);

/** Langsamer Drift zwischen den Fahrten: Zoom 100 → 104 %, 2–3 px seitlich. */
export const drift = (f: number, start: number, dauer: number, seed = 0): Cam => {
  const l = Math.max(0, f - start);
  const t = Math.min(1, l / Math.max(1, dauer));
  return {
    s: 1 + 0.04 * t,
    cx: MITTE.x + Math.sin((l + seed * 37) / 48) * 2.6,
    cy: MITTE.y + Math.cos((l + seed * 23) / 62) * 1.6,
  };
};

/** Zoom-Through von cam0 in das 9:16-Fenster r (Szenen-Koordinaten der Hauptebene). t = 0..1 linear. */
export const zoomInFenster = (cam0: Cam, r: Rechteck, t: number): Cam => {
  const e = kurve.heavy(Math.max(0, Math.min(1, t))); // cubic-bezier(0.65, 0, 0.15, 1)
  const ziel = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  const s1 = 1080 / r.w;
  const s = Math.exp(Math.log(cam0.s) + (Math.log(s1) - Math.log(cam0.s)) * e);
  // Bildposition des Zielpunkts wandert gerade in die Mitte
  const p0 = { x: (ziel.x - cam0.cx) * cam0.s + MITTE.x, y: (ziel.y - cam0.cy) * cam0.s + MITTE.y };
  const p = { x: p0.x + (MITTE.x - p0.x) * e, y: p0.y + (MITTE.y - p0.y) * e };
  return { s, cx: ziel.x - (p.x - MITTE.x) / s, cy: ziel.y - (p.y - MITTE.y) / s };
};

/** Eingebettete Szene: wird im Fenster r gezeigt (exakt 9:16, Massstab r.w / 1080). */
export const Fenster: React.FC<{ r: Rechteck; children: React.ReactNode; radius?: number }> = ({ r, children, radius = 0 }) => (
  <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", borderRadius: radius }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${r.w / 1080})` }}>{children}</div>
  </div>
);

/**
 * Bewegungsunschärfe: bei schnellen Kamerafahrten wird die Welt mehrfach in Sub-Frames gerendert
 * und gemittelt (Ebene i mit Deckkraft 1/(i+1) → gleiches Gewicht für alle Proben).
 */
export const Bewegungsunschaerfe: React.FC<{ f: number; tempo: number; render: (f: number) => React.ReactNode; schwelle?: number; proben?: number; verschluss?: number }> = ({
  f, tempo, render, schwelle = 0.012, proben = 10, verschluss = 0.7,
}) => {
  if (tempo < schwelle) return <AbsoluteFill>{render(f)}</AbsoluteFill>;
  const n = Math.round(Math.min(proben, 3 + (tempo / schwelle) * 1.5));
  return (
    <AbsoluteFill>
      {Array.from({ length: n }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          {render(f - (verschluss * i) / Math.max(1, n - 1))}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** Feste Ebene über allem (nicht von der Kamera bewegt): Filmkorn, Vignette, 1–2 % Flackern. */
export const Filmlook: React.FC = () => {
  const f = useCurrentFrame();
  const zufall = (n: number) => {
    const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const flackern = 0.01 + zufall(f) * 0.012;
  const seed = f % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.22 }}>
        <svg width="100%" height="100%">
          <filter id={`korn${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#korn${seed})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 62% at 50% 48%, transparent 58%, rgba(20,10,5,.42) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: flackern }} />
    </AbsoluteFill>
  );
};
