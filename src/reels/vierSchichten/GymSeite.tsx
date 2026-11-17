import React from "react";
import { farben, schrift } from "../../brand/solleva";

// Anonyme Beispiel-Website «Dein Gym · Olten» (kein echter Betrieb, keine echten Daten).
// modus: foto = fertige Seite, draht = leuchtendes Drahtgitter (Schicht 4), bauplan = Konstruktionszeichnung.
export type GymModus = "foto" | "draht" | "bauplan";

const T = { w: 640, h: 960 };

const linie = (m: GymModus) => (m === "draht" ? farben.lavendelAkzent : m === "bauplan" ? farben.violett : "transparent");

const Block: React.FC<{ m: GymModus; x: number; y: number; w: number; h: number; bg?: string; r?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  m, x, y, w, h, bg, r = 14, children, style,
}) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden",
      background: m === "foto" ? bg ?? "transparent" : "transparent",
      border: m === "foto" ? "none" : `${m === "draht" ? 2 : 1.6}px ${m === "bauplan" ? "dashed" : "solid"} ${linie(m)}`,
      boxShadow: m === "draht" ? `0 0 14px ${farben.violett}, inset 0 0 10px rgba(169,139,255,.35)` : undefined,
      ...style,
    }}
  >
    {m === "foto" ? children : null}
  </div>
);

const Zeile: React.FC<{ m: GymModus; x: number; y: number; w: number; h?: number; c?: string }> = ({ m, x, y, w, h = 12, c = farben.grauHell }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: m === "foto" ? c : linie(m), opacity: m === "foto" ? 1 : 0.7, boxShadow: m === "draht" ? `0 0 8px ${farben.violett}` : undefined }} />
);

// Fotos: Platzhalter-Verläufe, später echte Higgsfield-Gym-Fotos (G1–G3)
const foto = (i: number) =>
  [
    `linear-gradient(160deg, #3B2F7A 0%, #14123A 55%, #070A24 100%)`,
    `linear-gradient(200deg, #A98BFF 0%, #6C3FD4 60%, #14123A 100%)`,
    `linear-gradient(140deg, #D5D1E9 0%, #6E6C92 100%)`,
  ][i % 3];

export const GymSeite: React.FC<{ m?: GymModus; bilder?: string[]; nur?: "oben" | "alles" }> = ({ m = "foto", bilder = [] }) => {
  const txt = (c: string) => (m === "foto" ? c : linie(m));
  const bg = (i: number) => (bilder[i] ? `center/cover url(${bilder[i]})` : foto(i));
  return (
    <div style={{ position: "relative", width: T.w, height: T.h, background: m === "foto" ? farben.weiss : "transparent", borderRadius: 30, overflow: "hidden", fontFamily: schrift.text }}>
      {/* Navigation: max. 5 Punkte */}
      <div style={{ position: "absolute", left: 32, top: 26, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: txt(farben.tinte), textShadow: m === "draht" ? `0 0 10px ${farben.violett}` : undefined }}>
        DEIN GYM<span style={{ color: m === "foto" ? farben.violett : undefined }}>.</span>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <Zeile key={i} m={m} x={250 + i * 58} y={36} w={42} h={9} />
      ))}
      {/* Hero mit Botschaft */}
      <Block m={m} x={20} y={80} w={600} h={380} bg={bg(0)} r={22}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,10,36,0) 30%, rgba(7,10,36,.75))" }} />
      </Block>
      <div style={{ position: "absolute", left: 50, top: 250, width: 520, fontWeight: 800, fontSize: 50, lineHeight: 1.0, letterSpacing: "-0.02em", color: m === "foto" ? farben.weiss : linie(m), textShadow: m === "draht" ? `0 0 14px ${farben.violett}` : undefined }}>
        Krafttraining in Olten.
        <div style={{ fontWeight: 500, fontSize: 22, letterSpacing: 0, marginTop: 12, opacity: 0.85 }}>Für alle, die stärker werden wollen.</div>
      </div>
      {/* Haupt-Button in Akzentfarbe */}
      <div style={{ position: "absolute", left: 50, top: 395, width: 250, height: 50, borderRadius: 25, background: m === "foto" ? farben.violett : "transparent", border: m === "foto" ? "none" : `2px solid ${linie(m)}`, color: m === "foto" ? farben.weiss : linie(m), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 19, boxShadow: m === "draht" ? `0 0 16px ${farben.violett}` : undefined }}>
        Probetraining buchen
      </div>
      {/* Leistungen auf einen Blick */}
      {["Kraft", "Kurse", "Personal"].map((l, i) => (
        <Block key={l} m={m} x={20 + i * 204} y={480} w={192} h={150} bg={farben.lavendel} r={16}>
          <div style={{ position: "absolute", left: 18, top: 18, width: 38, height: 38, borderRadius: 12, background: farben.violett, opacity: 0.9 }} />
          <div style={{ position: "absolute", left: 18, bottom: 18, fontWeight: 800, fontSize: 22, color: farben.tinte }}>{l}</div>
        </Block>
      ))}
      {/* Team-Gesicht */}
      <Block m={m} x={20} y={650} w={290} h={160} bg={bg(1)} r={16} />
      <Zeile m={m} x={330} y={668} w={200} h={14} c={farben.tinte} />
      <Zeile m={m} x={330} y={696} w={260} />
      <Zeile m={m} x={330} y={718} w={220} />
      {/* Bewertungen */}
      <div style={{ position: "absolute", left: 330, top: 752, fontSize: 26, letterSpacing: 4, color: m === "foto" ? farben.gold : linie(m) }}>★★★★★</div>
      {/* Öffnungszeiten + Karte + Nummer */}
      <Block m={m} x={20} y={830} w={290} h={110} bg={farben.staubgrau} r={16}>
        <div style={{ position: "absolute", left: 18, top: 16, fontWeight: 700, fontSize: 16, color: farben.grau, letterSpacing: "0.1em" }}>ÖFFNUNGSZEITEN</div>
        <div style={{ position: "absolute", left: 18, top: 44, fontWeight: 800, fontSize: 22, color: farben.tinte }}>Mo–So 6–22 Uhr</div>
      </Block>
      <Block m={m} x={330} y={830} w={290} h={110} bg={`repeating-linear-gradient(35deg, ${farben.lavendel} 0 18px, ${farben.weiss} 18px 36px)`} r={16}>
        <div style={{ position: "absolute", left: 128, top: 30, width: 34, height: 34, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: farben.violett }} />
      </Block>
    </div>
  );
};

export const GYM = T;
