import React from "react";
import { farben, schrift, Stimmung } from "../brand/solleva";

/**
 * B08 «Walze»: Spielautomaten-Walze. Inhalte laufen vertikal durch ein Fenster.
 * pos = Position in Einträgen (darf fliessend sein), tempo = Bewegungsunschärfe 0–1.
 * Wird im Reel «Spielautomat» aus einem Feed (Posts) gebaut: Feed = Walze.
 */
export const Walze: React.FC<{
  s: Stimmung;
  eintraege: React.ReactNode[];
  pos: number;
  tempo?: number;
  w?: number;
  h?: number;
  x: number;
  y: number;
  leuchten?: boolean;
}> = ({ s, eintraege, pos, tempo = 0, w = 280, h = 380, x, y, leuchten }) => {
  const n = eintraege.length;
  const zelle = h;
  const off = ((pos % n) + n) % n;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 30,
        overflow: "hidden",
        background: s.dunkel ? s.flaeche : farben.weiss,
        border: `2px solid ${leuchten ? s.akzent : s.rand}`,
        boxShadow: leuchten
          ? `0 0 60px ${s.akzent}88, inset 0 0 40px ${s.akzent}33`
          : s.dunkel
            ? "inset 0 30px 40px rgba(0,0,0,.6), inset 0 -30px 40px rgba(0,0,0,.6)"
            : "inset 0 30px 40px rgba(44,30,120,.10), inset 0 -30px 40px rgba(44,30,120,.10)",
      }}
    >
      <div style={{ filter: `blur(${tempo * 14}px)`, transform: `translateY(${-off * zelle}px) scaleY(${1 + tempo * 0.25})` }}>
        {[...eintraege, ...eintraege].map((e, i) => (
          <div key={i} style={{ width: w, height: zelle, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {e}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Mini-Post für den Feed in der Walze. */
export const MiniPost: React.FC<{ s: Stimmung; ton: string; zeile?: string }> = ({ s, ton, zeile }) => (
  <div style={{ width: 210, height: 300, borderRadius: 22, background: s.dunkel ? "#141844" : farben.papier, border: `1.5px solid ${s.rand}`, overflow: "hidden" }}>
    <div style={{ height: 190, background: ton }} />
    <div style={{ padding: 14, fontFamily: schrift.mono, fontSize: 18, color: s.dunkel ? "#7C80B8" : farben.grau }}>{zeile ?? "· · ·"}</div>
  </div>
);
