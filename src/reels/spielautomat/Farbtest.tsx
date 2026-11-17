import React from "react";
import { AbsoluteFill } from "remotion";
import { schrift, Stimmung } from "../../brand/solleva";
import { Schriften } from "../../components/Basis";
import { Emoji } from "../../bausteine/Emoji";
import { MiniPost, Walze } from "../../bausteine/Walze";

// Farbtest «Casino-Rot»: Weg von Violett/Weiss, nur für dieses Reel (noch nicht freigegeben).
export const casino = {
  rot: "#B3122E",
  rotTief: "#3A0612",
  schwarz: "#120306",
  gold: "#F5C451",
  goldDunkel: "#B9862A",
  creme: "#FFF1DC",
  koralle: "#FF5A4E",
};

const C: Stimmung = {
  id: "C1",
  name: "Casino-Rot",
  hintergrund: casino.rotTief,
  hintergrund2: casino.schwarz,
  flaeche: "#2A0710",
  tinte: casino.creme,
  leise: "#7A3A44",
  akzent: casino.gold,
  rand: "#5A1424",
  textur: "koernung",
  dunkel: true,
};

const Birnen: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const punkte: { x: number; y: number }[] = [];
  const abst = 46;
  for (let x = 30; x <= w - 30; x += abst) punkte.push({ x, y: 18 }, { x, y: h - 18 });
  for (let y = 18 + abst; y <= h - 18 - abst; y += abst) punkte.push({ x: 18, y }, { x: w - 18, y });
  return (
    <>
      {punkte.map((p, i) => {
        const an = i % 3 !== 0;
        return (
          <div key={i} style={{ position: "absolute", left: p.x - 8, top: p.y - 8, width: 16, height: 16, borderRadius: 8, background: an ? "#FFF6D6" : "#8A5A1E", boxShadow: an ? `0 0 14px 4px ${casino.gold}` : "none" }} />
        );
      })}
    </>
  );
};

export const Farbtest: React.FC = () => {
  const feed = ["#B3122E", "#F5C451", "#FF5A4E", "#3A0612", "#FFF1DC"].map((t, i) => <MiniPost key={i} s={C} ton={t} />);
  const herz = (
    <div style={{ position: "relative", width: 190, height: 190 }}>
      <Emoji name="red-heart" start={-30} x={95} y={95} size={190} schweben={false} />
    </div>
  );
  const niete = (
    <div style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 64, color: "#7A3A44", letterSpacing: "0.04em" }}>NIETE</div>
  );
  const mx = 110, my = 820, mw = 800, mh = 640;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1100px 1200px at 50% 55%, ${casino.rot} 0%, ${casino.rotTief} 55%, ${casino.schwarz} 100%)` }}>
      <Schriften />
      {/* Lichtkegel von oben */}
      <AbsoluteFill style={{ background: `radial-gradient(500px 900px at 50% 0%, rgba(255,214,140,.22), transparent 70%)` }} />
      {/* Label */}
      <div style={{ position: "absolute", left: 70, top: 230, fontFamily: schrift.mono, fontSize: 26, letterSpacing: "0.14em", color: "#D98A8A" }}>// 03 TREFFER</div>
      {/* Satz */}
      <div style={{ position: "absolute", left: 70, right: 140, top: 300, fontFamily: schrift.text, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.02em", color: casino.creme }}>
        Meistens <span style={{ color: "#C9707C", textDecoration: "line-through", textDecorationThickness: 8 }}>Niete.</span> Aber manchmal:{" "}
        <span style={{ fontFamily: schrift.serif, fontStyle: "italic", fontWeight: 400, color: casino.gold, textShadow: `0 0 40px ${casino.gold}99` }}>Treffer.</span>
      </div>
      {/* Spielautomat */}
      <div style={{ position: "absolute", left: mx, top: my, width: mw, height: mh, borderRadius: 60, background: `linear-gradient(160deg, ${casino.gold}, ${casino.goldDunkel} 55%, #7A5418)`, boxShadow: "0 60px 120px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.5)" }}>
        <Birnen w={mw} h={mh} />
        <div style={{ position: "absolute", left: 50, top: 50, right: 50, bottom: 50, borderRadius: 36, background: casino.schwarz, boxShadow: "inset 0 0 40px rgba(0,0,0,.9)" }} />
      </div>
      {/* Gewinnlinie */}
      <div style={{ position: "absolute", left: mx + 60, width: mw - 120, top: my + 318, height: 4, background: casino.koralle, boxShadow: `0 0 18px ${casino.koralle}`, opacity: 0.9 }} />
      <Walze s={C} eintraege={[niete]} pos={0} x={mx + 75} y={my + 130} w={200} h={380} />
      <Walze s={C} eintraege={[niete]} pos={0} x={mx + 300} y={my + 130} w={200} h={380} />
      <Walze s={C} eintraege={[<div key="l" />]} pos={0} x={mx + 525} y={my + 130} w={200} h={380} leuchten />
      <div style={{ position: "absolute", left: mx + 525, top: my + 130, width: 200, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>{herz}</div>
      {/* Hebel */}
      <div style={{ position: "absolute", left: mx + mw - 6, top: my + 160, width: 26, height: 300, borderRadius: 13, background: "linear-gradient(90deg,#d9d9d9,#888)", transform: "rotate(14deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", left: mx + mw + 20, top: my + 110, width: 80, height: 80, borderRadius: 40, background: `radial-gradient(circle at 35% 30%, #ff8a80, ${casino.rot})`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
      {/* Glitzer */}
      <Emoji name="sparkles" start={-30} x={mx + 700} y={my + 110} size={150} schweben={false} />
      {/* Fussnote */}
      <div style={{ position: "absolute", left: 70, right: 140, top: 1520, fontFamily: schrift.mono, fontSize: 30, color: "#E8B9A0", letterSpacing: "0.06em" }}>
        Jeder Like = ein kleiner Gewinn.
      </div>
    </AbsoluteFill>
  );
};
