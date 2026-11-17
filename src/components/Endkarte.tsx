import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, form, schrift, Stimmung } from "../brand/solleva";
import { kurve, overshoot, tw } from "../lib/bewegung";
import { Hintergrund } from "./Basis";

// Feste Endkarte (Kern): Logo-Wortmarke, Claim, CTA-Button, Instagram-Karte.
// Logo als SVG folgt, sobald die Datei im Repo liegt (assets/logo.svg).
export const Endkarte: React.FC<{ s: Stimmung; start?: number; cta?: string; klickAuf?: number }> = ({
  s,
  start = 0,
  cta = "Folge für mehr",
  klickAuf,
}) => {
  const frame = useCurrentFrame();
  const f = frame - start;
  const marke = tw(f, 0, 12, 0, 1, kurve.land);
  const claim = tw(f, 5, 16, 0, 1, kurve.land);
  const btn = f >= 14 ? overshoot(f, 14, 16, 1.05) : 0;
  const ig = tw(f, 24, 14, 0, 1, kurve.land);
  const k = klickAuf !== undefined ? frame - klickAuf : -99;
  const druck = k >= 0 && k < 4 ? tw(k, 0, 4, 1, 0.95, kurve.whip) : k >= 4 && k < 12 ? tw(k, 4, 8, 0.95, 1, kurve.land) : 1;
  const dunkel = s.dunkel;
  return (
    <AbsoluteFill>
      <Hintergrund s={s} />
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: marke, transform: `translateY(${(1 - marke) * 20}px)` }}>
        <span style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 64, letterSpacing: "-0.01em", color: s.tinte }}>Solleva</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: schrift.text,
          fontWeight: 800,
          fontSize: 112,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          color: s.tinte,
          opacity: claim,
          transform: `translateY(${(1 - claim) * 40}px)`,
        }}
      >
        Heb dich von der{" "}
        <span style={{ fontFamily: schrift.serif, fontStyle: "italic", fontWeight: 400, color: s.akzent }}>Masse</span> ab.
      </div>
      <div
        style={{
          position: "absolute",
          top: 930,
          left: 140,
          right: 140,
          height: 150,
          borderRadius: 75,
          background: dunkel ? s.akzent : farben.nacht,
          color: dunkel ? farben.nacht : farben.papier,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: schrift.text,
          fontWeight: 800,
          fontSize: 54,
          transform: `scale(${btn * druck})`,
          boxShadow: form.schatten,
        }}
      >
        {cta}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1160,
          left: 200,
          right: 200,
          height: 130,
          borderRadius: 30,
          background: s.flaeche,
          border: `1.5px solid ${s.rand}`,
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          boxSizing: "border-box",
          opacity: ig,
          transform: `translateY(${(1 - ig) * 30}px)`,
          fontFamily: schrift.text,
          color: s.tinte,
        }}
      >
        <div style={{ width: 70, height: 70, borderRadius: 35, background: `linear-gradient(135deg, ${farben.violett}, ${farben.lavendelAkzent})`, marginRight: 22 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 32 }}>@solleva.ch</div>
          <div style={{ fontWeight: 500, fontSize: 26, color: "#8C89AE" }}>solleva.ch</div>
        </div>
        <div style={{ background: s.akzent, color: dunkel ? farben.nacht : "#fff", fontWeight: 700, fontSize: 26, padding: "12px 24px", borderRadius: 20 }}>Folgen</div>
      </div>
    </AbsoluteFill>
  );
};
