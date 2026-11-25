// Storyboard-Stills Reel 05 «50 Millisekunden» (ein Frame = eine Szene). Echte Assets, keine Credits.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { Schriften } from "../../components/Basis";
import { Filmlook } from "../../kamera/welt";
import { ALT, AlteSeite, asset, Bild, Chrom, Handy, Kristall, Lcd, NeueSeite, SafeZone, ScherbeEl, scherben, schriftR05, web } from "./Look";

const SCH = scherben(ALT.w, ALT.h, 22, 5);

const Satz: React.FC<{ top: number; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, size = 84, children, style }) => (
  <div style={{ position: "absolute", top, left: 95, width: 805, textAlign: "center", fontFamily: schriftR05.serif, fontSize: size, lineHeight: 1.04, color: web.text, textShadow: "0 4px 24px rgba(4,5,12,.8)", ...style }}>{children}</div>
);
const Kursiv: React.FC<{ children: React.ReactNode; farbe?: string }> = ({ children, farbe = web.lilac }) => (
  <span style={{ fontStyle: "italic", color: farbe }}>{children}</span>
);
// Seite schwebend im Raum (Mitte = Weltmitte)
const Raum: React.FC<{ children: React.ReactNode; x?: number; y?: number; s?: number; perspektive?: number }> = ({ children, x = 540, y = 1000, s = 1, perspektive = 1600 }) => (
  <div style={{ position: "absolute", left: x - ALT.w / 2, top: y - ALT.h / 2, width: ALT.w, height: ALT.h, perspective: perspektive, transform: `scale(${s})` }}>
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{children}</div>
  </div>
);

const Szene: React.FC<{ nr: number }> = ({ nr }) => {
  switch (nr) {
    case 0: // 1 Hook: Auge + LCD
      return (
        <AbsoluteFill>
          <Bild src={asset("auge.png")} scale={1.06} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,5,12,.85) 0%, transparent 30%, transparent 70%, rgba(4,5,12,.85) 100%)" }} />
          <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Lcd text="0,032 s" h={170} />
          </div>
          <Satz top={1240} size={112}>50 <Kursiv>Millisekunden.</Kursiv></Satz>
          <Satz top={1390} size={50} style={{ fontFamily: schriftR05.text, fontWeight: 500, color: web.muted }}>Schneller als ein Wimpernschlag.</Satz>
          {/* Zoom-Through-Fenster in der Pupille */}
          <div style={{ position: "absolute", left: 540 - 22, top: 960 - 39, width: 44, height: 78, border: "2px dashed rgba(143,227,255,.9)" }} />
        </AbsoluteFill>
      );
    case 1: // 2 Seite schwebt im Nebel
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/nebel-a.png")} scale={1.1} />
          <Satz top={300}>So schnell weisst du, ob dir eine Seite <Kursiv>gefällt.</Kursiv></Satz>
          <Raum y={1080} s={0.92}>
            <div style={{ transform: "rotateY(-22deg) rotateX(6deg) rotateZ(-2deg)", boxShadow: "0 50px 120px rgba(108,63,212,.55)" }}><AlteSeite /></div>
          </Raum>
        </AbsoluteFill>
      );
    case 2: // 3 Text verschwimmt, Kamera umkreist
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/nebel-a.png")} scale={1.3} x={-120} y={60} />
          <Raum y={1060} x={600} s={1.05}>
            <div style={{ transform: "rotateY(38deg) rotateX(4deg)", boxShadow: "0 50px 120px rgba(108,63,212,.55)" }}><AlteSeite unscharf={5} /></div>
          </Raum>
          <Satz top={300} size={92}>
            {["Noch", "bevor", "du", "ein", "Wort"].map((w, i) => (
              <span key={w} style={{ filter: i < 3 ? "none" : `blur(${(i - 2) * 6}px)`, opacity: i < 3 ? 1 : 0.7 }}>{w} </span>
            ))}
            <span style={{ filter: "blur(18px)", opacity: 0.5 }}>gelesen hast.</span>
          </Satz>
        </AbsoluteFill>
      );
    case 3: // 4 Bruch: WEG.
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/nebel-a.png")} scale={1.15} style={{ filter: "brightness(.75)" }} />
          <Raum y={1270} s={0.72}>
            {SCH.map((s) => {
              const fall = ((s.cy / ALT.h) * 0.6 + 0.4) * 160;
              const spreiz = (s.cx - ALT.w / 2) * 0.35;
              return <ScherbeEl key={s.i} s={s} dx={spreiz} dy={fall + (s.i % 5) * 18} dz={(s.i % 7) * 30} rx={(s.i % 4) * 9} ry={(s.i % 6) * 7 - 18} rz={(s.i % 9) * 4 - 16} vorne={<AlteSeite zaehler="000413" />} hinten={<NeueSeite />} />;
            })}
          </Raum>
          <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: schriftR05.text, fontWeight: 800, fontSize: 300, lineHeight: 1, letterSpacing: "-0.03em", color: web.text, textShadow: "0 10px 50px rgba(0,0,0,.7)", clipPath: "polygon(0 0,100% 0,100% 46%,58% 54%,40% 48%,0 57%)" }}>WEG.</div>
          <div style={{ position: "absolute", top: 352, left: 18, right: 0, textAlign: "center", fontFamily: schriftR05.text, fontWeight: 800, fontSize: 300, lineHeight: 1, letterSpacing: "-0.03em", color: web.text, transform: "rotate(4deg) translateY(26px)", clipPath: "polygon(0 57%,40% 48%,58% 54%,100% 46%,100% 100%,0 100%)" }}>WEG.</div>
          <Satz top={690} size={64} style={{ color: web.muted }}>Gefällt sie nicht … ist sie <Kursiv>weg.</Kursiv></Satz>
          <div style={{ position: "absolute", left: 650, top: 1440, background: "#000", color: "#33ff33", fontFamily: "'DejaVu Sans Mono', monospace", fontSize: 44, padding: "4px 14px", border: "3px inset #666", transform: "rotate(-6deg)" }}>000413</div>
        </AbsoluteFill>
      );
    case 4: // 5 Scherben eingefroren, Flug hindurch
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/nebel-a.png")} scale={1.5} x={80} y={-200} style={{ filter: "brightness(.7)" }} />
          <Raum y={1060} s={1.35} perspektive={1100}>
            {SCH.map((s) => (
              <ScherbeEl key={s.i} s={s} dx={(s.cx - ALT.w / 2) * 0.55} dy={(s.cy - ALT.h / 2) * 0.35} dz={((s.i * 37) % 200) - 100} rx={(s.i % 5) * 6 - 12} ry={(s.i % 6) * 7 - 18} rz={(s.i % 7) * 6 - 18} vorne={<AlteSeite zaehler="000413" />} hinten={<NeueSeite />} kante={0.7} />
            ))}
          </Raum>
          {/* Gravur in einer Scherbe */}
          <div style={{ position: "absolute", left: 120, top: 340, width: 780, padding: "36px 30px", background: "linear-gradient(135deg, rgba(43,34,112,.92), rgba(10,13,34,.94))", clipPath: "polygon(4% 8%, 92% 0, 100% 70%, 60% 100%, 0 84%)", boxShadow: "inset 0 0 0 3px rgba(143,227,255,.6)" }}>
            <div style={{ fontFamily: schriftR05.serif, fontSize: 82, lineHeight: 1.05, color: "rgba(241,242,247,.92)", textAlign: "center", textShadow: "0 -1px 0 rgba(255,255,255,.6), 0 2px 2px rgba(0,0,0,.6)" }}>Und dieser Eindruck <Kursiv farbe={web.cyan}>bleibt.</Kursiv></div>
          </div>
          <div style={{ position: "absolute", top: 1400, left: 215, width: 650, padding: "10px 0", borderRadius: 14, background: "rgba(4,5,12,.82)", textAlign: "center", fontFamily: schriftR05.text, fontWeight: 500, fontSize: 52, color: web.muted }}>Auch nach dem Lesen.</div>
        </AbsoluteFill>
      );
    case 5: // 6 Signature: Zurückspulen, Scherben drehen auf die neue Seite
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/planet-b.png")} scale={1.2} y={420} />
          <Raum y={1020} s={0.88} perspektive={1800}>
            {SCH.map((s) => {
              const fertig = s.i % 3 !== 0; // 2/3 schon gedreht und eingerastet
              const t = fertig ? 0 : 1;
              return <ScherbeEl key={s.i} s={s} dx={t * (s.cx - ALT.w / 2) * 0.5} dy={t * 140} dz={t * 160} ry={fertig ? 180 : 55} rz={t * ((s.i % 5) * 6 - 12)} vorne={<AlteSeite zaehler="000413" />} hinten={<NeueSeite />} kante={fertig ? 0.25 : 0.9} />;
            })}
          </Raum>
          <div style={{ position: "absolute", top: 300, left: 95, width: 805, textAlign: "center" }}>
            <Chrom size={96}>Darum habe ich meine Seite <span style={{ fontStyle: "italic" }}>neu</span> gebaut.</Chrom>
          </div>
          <div style={{ position: "absolute", left: 790, top: 520, fontFamily: schriftR05.mono, fontSize: 34, color: web.cyan, letterSpacing: 4 }}>◀◀</div>
        </AbsoluteFill>
      );
    case 6: // 7 Handy steigt über den Planeten
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/planet-b.png")} scale={1.05} y={140} />
          <Kristall nr={1} x={190} y={760} h={430} dreh={-14} />
          <Kristall nr={2} x={905} y={640} h={330} dreh={12} blur={2} />
          <Kristall nr={3} x={175} y={1330} h={280} dreh={18} blur={1.5} />
          <div style={{ position: "absolute", left: 540 - 222, top: 560 }}>
            <Handy w={420}><NeueSeite w="100%" h="100%" /></Handy>
          </div>
          <div style={{ position: "absolute", top: 300, left: 95, width: 805, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26 }}>
            <span style={{ fontFamily: schriftR05.serif, fontSize: 74, color: web.text, paddingBottom: 6 }}>Für die ersten</span>
            <Lcd text="50" h={120} />
          </div>
          <Satz top={420} size={74}><Kursiv>Millisekunden.</Kursiv></Satz>
        </AbsoluteFill>
      );
    default: // 8 Endkarte, Rausfahrt in die Pupille
      return (
        <AbsoluteFill>
          <Bild src={asset("higgsfield/planet-b.png")} scale={1.0} style={{ filter: "brightness(.55)" }} />
          <div style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: schriftR05.serif, fontSize: 70, color: web.text }}>Solleva</div>
          <Satz top={470} size={118}>Heb dich von der <Kursiv>Masse</Kursiv> ab.</Satz>
          <div style={{ position: "absolute", top: 830, left: 150, right: 150, height: 140, borderRadius: 70, background: web.chrome, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 60px rgba(108,63,212,.5)" }}>
            <span style={{ fontFamily: schriftR05.text, fontWeight: 700, fontSize: 58, color: web.ink }}>Folge für mehr</span>
          </div>
          <div style={{ position: "absolute", top: 1030, left: 0, right: 0, textAlign: "center", fontFamily: schriftR05.mono, fontSize: 40, color: web.lilac }}>@solleva.ch</div>
          {/* Vorschau Rausfahrt: alles war die Spiegelung in der Pupille */}
          <div style={{ position: "absolute", left: 340, top: 1170, width: 400, height: 330, borderRadius: 24, overflow: "hidden", border: "2px dashed rgba(143,227,255,.7)" }}>
            <Img src={asset("auge.png")} style={{ width: 400, height: 711, objectFit: "cover", marginTop: -190 }} />
            <div style={{ position: "absolute", left: 186, top: 152, width: 28, height: 26, borderRadius: 13, background: "radial-gradient(circle, rgba(169,139,255,.9), transparent 70%)" }} />
          </div>
        </AbsoluteFill>
      );
  }
};

const NOTIZ = [
  "1 · Hook · Kling-Blinzeln · LCD 0,000→0,050 · Zoom-Through in die Pupille",
  "2 · Nebel A · alte Seite eingefroren · Kamerafahrt um die Seite",
  "3 · Schärfe-Zug: Wörter werden nacheinander scharf · Orbit",
  "4 · BRUCH (harter Schnitt) · 000412→000413 · Seite zerspringt",
  "5 · Bullet-Time durch die Scherben · Gravur",
  "6 · SIGNATURE · zurückspulen, Scherben drehen 180° → neue Seite",
  "7 · Planet B + Kristalle A · Handy steigt · LCD-Echo «50»",
  "8 · Endkarte · Rausfahrt aus der Pupille → Loop",
];

export const R05Storyboard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: web.ink }}>
      <Schriften />
      <Szene nr={f} />
      <Filmlook />
      <SafeZone />
      <div style={{ position: "absolute", top: 120, left: 60, right: 60, background: "rgba(4,5,12,.8)", color: "#ffe27a", fontFamily: "JetBrains Mono", fontSize: 24, padding: "8px 14px", borderRadius: 8 }}>{NOTIZ[f]}</div>
    </AbsoluteFill>
  );
};
