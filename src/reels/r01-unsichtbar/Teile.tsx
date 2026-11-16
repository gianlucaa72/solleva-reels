// Reel 01 «Unsichtbar bei Google»: neue Bausteine
// G01 Glas-Pille (Liquid-Glass-Look aus Apple-Referenz), T01 Hook-Titel (Pinterest «Kinetic Hook Titles»),
// W08 Mesh-Hell, W09 Mesh-Nacht, H00 Higgsfield-Platzhalter, P02 Telefon-Rahmen.
import React from "react";
import { AbsoluteFill } from "remotion";
import { farben, schrift } from "../../brand/solleva";

// ---------- W08 Mesh-Hell: weicher Lavendel-Verlauf wie Apple-Referenz, in Solleva-Farben ----------
export const MeshHell: React.FC<{ t?: number }> = ({ t = 0 }) => {
  const a = 20 + Math.sin(t / 70) * 6;
  const b = 75 + Math.cos(t / 80) * 6;
  return (
    <AbsoluteFill style={{ background: farben.papier }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(700px 700px at ${a}% 12%, #FFFFFF 0%, transparent 70%)`,
            `radial-gradient(900px 800px at ${b}% 30%, ${farben.grauHell} 0%, transparent 70%)`,
            `radial-gradient(900px 900px at 15% 70%, ${farben.lavendel} 0%, transparent 70%)`,
            `radial-gradient(800px 700px at 85% 85%, rgba(169,139,255,.30) 0%, transparent 70%)`,
            `radial-gradient(700px 600px at 60% 60%, #FFFFFF 0%, transparent 70%)`,
          ].join(","),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(20,18,58,.10) 1.5px, transparent 0)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(70% 60% at 50% 45%, black, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- W09 Mesh-Nacht: Nacht mit violetten Wellen (Platzhalter bis Higgsfield-Hintergrund) ----------
export const MeshNacht: React.FC = () => (
  <AbsoluteFill style={{ background: farben.nacht }}>
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(1200px 500px at 70% 18%, rgba(108,63,212,.55), transparent 70%)`,
          `radial-gradient(900px 900px at 20% 95%, rgba(108,63,212,.35), transparent 70%)`,
          `radial-gradient(500px 400px at 80% 70%, rgba(143,227,255,.10), transparent 70%)`,
        ].join(","),
      }}
    />
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M -100 ${560 + i * 60} C 300 ${380 + i * 40}, 700 ${200 + i * 70}, 1200 ${80 + i * 50}`}
          stroke={i % 2 ? farben.lavendelAkzent : farben.violett}
          strokeOpacity={0.5 - i * 0.07}
          strokeWidth={2 + i}
          fill="none"
        />
      ))}
    </svg>
  </AbsoluteFill>
);

// ---------- G01 Glas-Pille ----------
export const GlasPille: React.FC<{
  w: number;
  h: number;
  x?: number;
  y: number;
  dunkel?: boolean;
  radius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, x, y, dunkel, radius, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x ?? (1080 - w) / 2,
      top: y,
      width: w,
      height: h,
      borderRadius: radius ?? h / 2,
      background: dunkel
        ? "linear-gradient(160deg, rgba(255,255,255,.30), rgba(255,255,255,.10))"
        : "linear-gradient(160deg, rgba(255,255,255,.92), rgba(236,230,255,.70))",
      border: `1.5px solid rgba(255,255,255,${dunkel ? 0.35 : 0.95})`,
      boxShadow: dunkel
        ? "inset 0 2px 0 rgba(255,255,255,.35), 0 30px 80px rgba(0,0,0,.5)"
        : "inset 0 2px 0 rgba(255,255,255,1), inset 0 -10px 30px rgba(169,139,255,.18), 0 30px 70px rgba(44,30,120,.16)",
      backdropFilter: "blur(24px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------- T01 Hook-Titel-Teile ----------
export const Gross: React.FC<{ children: React.ReactNode; size?: number; farbe?: string; style?: React.CSSProperties }> = ({
  children,
  size = 230,
  farbe = farben.tinte,
  style,
}) => (
  <div
    style={{
      fontFamily: schrift.titel,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 0.86,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
      color: farbe,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Klebeband-Label: schräg, Versalien, auf Farbfläche */
export const Band: React.FC<{ children: React.ReactNode; bg?: string; farbe?: string; dreh?: number; size?: number; style?: React.CSSProperties }> = ({
  children,
  bg = farben.violett,
  farbe = "#fff",
  dreh = -4,
  size = 46,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: "6px 20px 4px",
      background: bg,
      color: farbe,
      fontFamily: schrift.titel,
      fontWeight: 800,
      fontStyle: "italic",
      fontSize: size,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      transform: `rotate(${dreh}deg)`,
      boxShadow: "0 10px 24px rgba(44,30,120,.18)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Kleiner Sperrsatz «F O C U S» */
export const Gesperrt: React.FC<{ children: React.ReactNode; farbe?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  farbe = farben.tinte,
  size = 38,
  style,
}) => (
  <div
    style={{
      fontFamily: schrift.text,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
      color: farbe,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kursiv: React.FC<{ children: React.ReactNode; size?: number; farbe?: string; style?: React.CSSProperties }> = ({
  children,
  size = 200,
  farbe = farben.violett,
  style,
}) => (
  <div style={{ fontFamily: schrift.serif, fontStyle: "italic", fontSize: size, lineHeight: 0.9, color: farbe, ...style }}>{children}</div>
);

// ---------- H00 Platzhalter für Higgsfield-Bild (Storyboard) ----------
export const Platzhalter: React.FC<{ x: number; y: number; w: number; h: number; text: string; dunkel?: boolean; rund?: boolean }> = ({
  x,
  y,
  w,
  h,
  text,
  dunkel,
  rund,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: rund ? "50%" : 40,
      border: `4px dashed ${dunkel ? "rgba(169,139,255,.7)" : "rgba(108,63,212,.55)"}`,
      background: dunkel
        ? "radial-gradient(circle at 50% 40%, rgba(213,209,233,.28), rgba(108,63,212,.10) 70%)"
        : "radial-gradient(circle at 50% 40%, rgba(255,255,255,.9), rgba(213,209,233,.6) 75%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 30,
      boxSizing: "border-box",
      fontFamily: schrift.mono,
      fontSize: 26,
      lineHeight: 1.35,
      color: dunkel ? "#C9BEF0" : farben.violett,
    }}
  >
    {text}
  </div>
);

// ---------- P02 Telefon-Rahmen ----------
export const Telefon: React.FC<{ x: number; y: number; w?: number; dreh?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w = 560,
  dreh = 0,
  children,
}) => {
  const h = w * 2.05;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: w * 0.16,
        background: farben.nacht,
        padding: w * 0.03,
        boxSizing: "border-box",
        transform: `rotate(${dreh}deg)`,
        boxShadow: "0 50px 100px rgba(20,18,58,.35), inset 0 0 0 3px #3A3D6B",
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: w * 0.13, overflow: "hidden", position: "relative", background: farben.papier }}>
        {children}
        <div
          style={{
            position: "absolute",
            top: w * 0.035,
            left: "50%",
            width: w * 0.3,
            height: w * 0.085,
            marginLeft: -w * 0.15,
            borderRadius: 999,
            background: farben.nacht,
          }}
        />
      </div>
    </div>
  );
};

/** Grauer Ergebnis-Eintrag (anonym) */
export const Ergebnis: React.FC<{ y: number; titel: string; x?: number; w?: number; hervor?: boolean; blass?: boolean }> = ({
  y,
  titel,
  x = 120,
  w = 840,
  hervor,
  blass,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 150,
      borderRadius: 34,
      background: "#fff",
      border: `1.5px solid ${hervor ? farben.violett : farben.rand}`,
      boxShadow: "0 20px 50px rgba(44,30,120,.10)",
      opacity: blass ? 0.55 : 1,
      display: "flex",
      alignItems: "center",
      gap: 28,
      padding: "0 34px",
      boxSizing: "border-box",
    }}
  >
    <div style={{ width: 70, height: 70, borderRadius: 20, background: hervor ? farben.lavendel : farben.staubgrau }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 36, color: farben.tinte }}>{titel}</div>
      <div style={{ marginTop: 14, height: 14, width: "80%", borderRadius: 7, background: farben.grauLinie }} />
      <div style={{ marginTop: 10, height: 14, width: "55%", borderRadius: 7, background: farben.grauLinie }} />
    </div>
  </div>
);
