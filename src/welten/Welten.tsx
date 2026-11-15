import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, Stimmung } from "../brand/solleva";

// Hintergrund-Welten: pro Satz eine neue Welt (Regel aus Ref. 01–04).
// Alle nur in Solleva-Farben. Jede Welt bewegt sich leicht von selbst.

export const weltenKatalog = {
  W01: { name: "Raster (Papier)", wann: "ruhig, hell, Standard-Fläche" },
  W02: { name: "Wellenringe", wann: "Hypnose, Fokus auf eine Person/Zahl (Ref. 03)" },
  W03: { name: "Strahlen", wann: "Bühne, Enthüllung, Ankündigung (Ref. 04)" },
  W04: { name: "Rauten", wann: "verspielt, Spiel/Karten-Themen (Ref. 04)" },
  W05: { name: "Lichtkanal", wann: "edel, «They built stories» (Ref. 05)" },
  W06: { name: "Filz / Stoff", wann: "Collage-Tisch, haptisch (Ref. 01)" },
  W07: { name: "Nacht mit Sternen", wann: "dunkler Kontrast-Moment (Ref. 04/06)" },
} as const;

const Koernung: React.FC<{ staerke?: number; dunkel?: boolean }> = ({ staerke = 0.08, dunkel }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <AbsoluteFill style={{ opacity: staerke, mixBlendMode: dunkel ? "screen" : "multiply" }}>
      <svg width="100%" height="100%">
        <filter id={`wk${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#wk${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC<{ staerke?: number }> = ({ staerke = 0.35 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 50%, transparent 55%, rgba(7,10,36,${staerke}))` }} />
);

/** W02: konzentrische, gewellte Ringe, die langsam nach aussen wandern. */
export const Wellen: React.FC<{ a?: string; b?: string; zentrum?: { x: number; y: number } }> = ({
  a = farben.violett,
  b = farben.papier,
  zentrum = { x: 540, y: 820 },
}) => {
  const f = useCurrentFrame();
  const ringe = 14;
  const abstand = 120;
  const off = (f * 1.6) % abstand;
  const pfade: React.ReactNode[] = [];
  for (let i = ringe; i >= 0; i--) {
    const r = i * abstand + off;
    const pts: string[] = [];
    for (let k = 0; k <= 72; k++) {
      const w = (k / 72) * Math.PI * 2;
      const wob = 1 + 0.06 * Math.sin(w * 5 + f / 18 + i) + 0.04 * Math.sin(w * 3 - f / 25);
      pts.push(`${zentrum.x + Math.cos(w) * r * wob * 0.82},${zentrum.y + Math.sin(w) * r * wob * 1.05}`);
    }
    pfade.push(<polygon key={i} points={pts.join(" ")} fill={i % 2 === 0 ? a : b} />);
  }
  return (
    <AbsoluteFill style={{ background: b }}>
      <svg width={1080} height={1920}>{pfade}</svg>
      <Koernung staerke={0.09} />
      <Vignette staerke={0.18} />
    </AbsoluteFill>
  );
};

/** W03: Strahlen-Fächer, dreht sich langsam. */
export const Strahlen: React.FC<{ a?: string; b?: string; zentrum?: { x: number; y: number } }> = ({
  a = farben.lavendel,
  b = farben.papier,
  zentrum = { x: 540, y: 760 },
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: b, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          left: -1500,
          top: -1500,
          width: 4080,
          height: 4920,
          transformOrigin: `${zentrum.x + 1500}px ${zentrum.y + 1500}px`,
          transform: `rotate(${f * 0.12}deg)`,
          background: `repeating-conic-gradient(from 0deg at ${zentrum.x + 1500}px ${zentrum.y + 1500}px, ${a} 0deg 7.5deg, ${b} 7.5deg 15deg)`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${zentrum.x}px ${zentrum.y}px, ${b} 0, transparent 360px)` }} />
      <Koernung staerke={0.08} />
      <Vignette staerke={0.2} />
    </AbsoluteFill>
  );
};

/** W04: Rauten-Muster (Harlekin) in Solleva-Farben, gleitet langsam. */
export const Rauten: React.FC<{ a?: string; b?: string; c?: string }> = ({ a = farben.violett, b = farben.papier, c = farben.tinte }) => {
  const f = useCurrentFrame();
  const g = 120;
  return (
    <AbsoluteFill style={{ background: b, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${(f * 0.8) % (g * 2)}px) scale(1.2)`,
          backgroundImage: `conic-gradient(from 45deg at 50% 50%, ${a} 0 25%, ${b} 0 50%, ${c} 0 75%, ${b} 0)`,
          backgroundSize: `${g}px ${g * 1.6}px`,
          top: -g * 4,
          height: 1920 + g * 8,
          opacity: 0.92,
        }}
      />
      <Koernung staerke={0.1} />
      <Vignette staerke={0.4} />
    </AbsoluteFill>
  );
};

/** W05: violetter Lichtkanal (3D-Box mit Boden), Ref. 05. */
export const Lichtkanal: React.FC = () => {
  const f = useCurrentFrame();
  const glanz = 0.5 + 0.1 * Math.sin(f / 20);
  return (
    <AbsoluteFill style={{ background: farben.lavendel, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 300, width: 480, top: 0, height: 1180, background: `linear-gradient(180deg, ${farben.lavendelAkzent}, ${farben.violett})` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1180,
          height: 740,
          background: `linear-gradient(180deg, #7B4BE0, ${farben.violett} 40%, #4E2AA8)`,
          clipPath: "polygon(300px 0, 780px 0, 1080px 100%, 0 100%)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(500px 900px at 540px 700px, rgba(255,255,255,${glanz * 0.35}), transparent 70%)` }} />
      <Koernung staerke={0.06} />
    </AbsoluteFill>
  );
};

/** W06: Filz/Stoff-Fläche (Collage-Tisch). */
export const Filz: React.FC<{ farbe?: string }> = ({ farbe = "#5B3FB8" }) => (
  <AbsoluteFill style={{ background: farbe }}>
    <AbsoluteFill style={{ opacity: 0.35, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="filz">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed={3} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#filz)" />
      </svg>
    </AbsoluteFill>
    <Koernung staerke={0.12} />
    <Vignette staerke={0.45} />
  </AbsoluteFill>
);

/** W07: Nacht mit funkelnden Sternen. */
export const Nacht: React.FC = () => {
  const f = useCurrentFrame();
  const sterne = Array.from({ length: 46 }, (_, i) => {
    const x = (i * 263) % 1080;
    const y = (i * 419) % 1920;
    const s = 3 + (i % 4) * 2;
    const o = 0.35 + 0.65 * Math.abs(Math.sin(f / (14 + (i % 7)) + i));
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: i % 5 === 0 ? farben.cyan : farben.papier, opacity: o, boxShadow: `0 0 ${s * 3}px ${farben.lavendelAkzent}` }} />;
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 1400px at 50% 40%, #151A4A, ${farben.nacht})` }}>
      {sterne}
      <Koernung staerke={0.14} dunkel />
    </AbsoluteFill>
  );
};

export const Welt: React.FC<{ id: keyof typeof weltenKatalog; s?: Stimmung }> = ({ id }) => {
  switch (id) {
    case "W02":
      return <Wellen />;
    case "W03":
      return <Strahlen />;
    case "W04":
      return <Rauten />;
    case "W05":
      return <Lichtkanal />;
    case "W06":
      return <Filz />;
    case "W07":
      return <Nacht />;
    default:
      return null;
  }
};
