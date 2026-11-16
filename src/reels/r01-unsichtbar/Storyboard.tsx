// Storyboard Reel 01: Frame N = Schlüsselbild von Satz N+1 (keine Animation, nur Look).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, schrift, stimmungen } from "../../brand/solleva";
import { Label, Schriften } from "../../components/Basis";
import { Band, Ergebnis, GlasPille, Gesperrt, Gross, Kursiv, MeshHell, MeshNacht, Platzhalter, Telefon } from "./Teile";

const S1 = stimmungen.S1;
const S2 = stimmungen.S2;
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

const Pfeil: React.FC<{ d: string; farbe?: string }> = ({ d, farbe = farben.violett }) => (
  <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    <path d={d} stroke={farbe} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CursorPfeil: React.FC<{ x: number; y: number; dreh?: number; dunkel?: boolean }> = ({ x, y, dreh = 0, dunkel }) => (
  <svg width="70" height="90" viewBox="0 0 28 36" style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)` }}>
    <path d="M2 2 L2 28 L9 21 L14 33 L19 31 L14 19 L24 19 Z" fill={dunkel ? farben.papier : "#fff"} stroke={farben.tinte} strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

const P1 = () => (
  <>
    <MeshHell />
    <Label s={S1} text="// 01 Gesucht" />
    <div style={abs(80, 420)}>
      <Band dreh={-5}>Deine Kunden</Band>
    </div>
    <Gross size={300} style={abs(70, 500)}>Suchen</Gross>
    <Kursiv size={230} style={abs(470, 720)}>dich.</Kursiv>
    <Gesperrt style={abs(90, 990)}>Jeden · Tag</Gesperrt>
    <GlasPille w={900} h={150} y={1180} style={{ justifyContent: "flex-start", paddingLeft: 50, gap: 26 }}>
      <svg width="48" height="48" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" stroke={farben.grau} strokeWidth="2.5" fill="none" /><path d="M15 15 L21 21" stroke={farben.grau} strokeWidth="2.5" strokeLinecap="round" /></svg>
      <span style={{ fontFamily: schrift.text, fontWeight: 700, fontSize: 44, color: farben.tinte }}>Schreiner in der Nähe</span>
      <span style={{ width: 4, height: 56, background: farben.violett }} />
    </GlasPille>
  </>
);

const P2 = () => (
  <>
    <MeshHell t={200} />
    <Label s={S1} text="// 02 Gefunden" />
    <Gesperrt style={abs(90, 330)} size={34}>Und finden:</Gesperrt>
    <div style={abs(80, 390)}>
      <Gross size={190}>deine</Gross>
    </div>
    <div style={abs(60, 540)}>
      <Band dreh={-3} size={150} bg={farben.tinte}>Konkurrenz</Band>
    </div>
    <Telefon x={300} y={800} w={480} dreh={4}>
      <div style={{ transform: "scale(.5)", transformOrigin: "0 0", width: 900 }}>
        <Ergebnis y={170} titel="Mitbewerber A" x={20} w={860} />
        <Ergebnis y={350} titel="Mitbewerber B" x={20} w={860} />
        <Ergebnis y={530} titel="Mitbewerber C" x={20} w={860} />
        <Ergebnis y={710} titel="Mitbewerber D" x={20} w={860} />
        <Ergebnis y={890} titel="Mitbewerber E" x={20} w={860} />
      </div>
    </Telefon>
    <Platzhalter x={20} y={1000} w={330} h={520} text={"HIGGSFIELD H1\nMarmor-Büste mit Lupe, freigestellt"} />
  </>
);

const P3 = () => (
  <>
    <MeshNacht />
    <Label s={S2} text="// 03 Seite zwei" />
    <Kursiv size={150} farbe={farben.papier} style={abs(90, 380)}>Du?</Kursiv>
    <Gesperrt farbe="#7C80B8" style={abs(95, 560)}>Irgendwo auf</Gesperrt>
    <Gross size={260} farbe={farben.papier} style={abs(80, 620)}>Seite</Gross>
    <div style={abs(560, 520, { fontFamily: schrift.titel, fontWeight: 900, fontSize: 620, lineHeight: 1, color: "transparent", WebkitTextStroke: `6px ${farben.lavendelAkzent}` })}>2</div>
    <GlasPille dunkel w={760} h={140} y={1260} style={{ gap: 60, fontFamily: schrift.text, fontWeight: 800, fontSize: 52, color: farben.papier }}>
      <span style={{ opacity: 0.5 }}>‹</span>
      <span style={{ opacity: 0.5 }}>1</span>
      <span style={{ background: farben.violett, borderRadius: 999, padding: "6px 30px" }}>2</span>
      <span style={{ opacity: 0.5 }}>3</span>
      <span style={{ opacity: 0.5 }}>›</span>
    </GlasPille>
  </>
);

const P4 = () => (
  <>
    <MeshNacht />
    <Label s={S2} text="// 04 Niemand" />
    <Gesperrt farbe="#7C80B8" style={abs(95, 380)}>Da klickt</Gesperrt>
    <Gross size={250} farbe={farben.papier} style={abs(70, 440)}>Niemand</Gross>
    <div style={abs(560, 650)}>
      <Band dreh={6} bg={farben.cyan} farbe={farben.nacht} size={44}>Kein einziger Klick</Band>
    </div>
    <Platzhalter dunkel x={110} y={860} w={500} h={640} text={"HIGGSFIELD H2\nverstaubte Marmor-Büste, allein, Spinnweben, wartet"} />
    <Pfeil d="M 720 1200 C 820 1120, 900 1000, 960 860" farbe={farben.cyan} />
    <CursorPfeil x={930} y={790} dreh={35} dunkel />
    <div style={abs(700, 1260, { fontFamily: schrift.notiz, fontWeight: 600, fontSize: 56, color: farben.cyan, transform: "rotate(-8deg)" })}>…und tschüss</div>
  </>
);

const P5 = () => (
  <>
    <MeshHell t={400} />
    <Label s={S1} text="// 05 Aber" />
    <Gesperrt style={abs(90, 330)}>Dabei machst du</Gesperrt>
    <Kursiv size={260} style={abs(90, 360)}>gute</Kursiv>
    <Gross size={220} style={abs(330, 560)}>Arbeit.</Gross>
    <Platzhalter x={240} y={820} w={600} h={720} text={"HIGGSFIELD H3\nMarmor-Statue hält stolz ein fertiges Werkstück (Holzstuhl), Studio-Licht, freigestellt"} />
    <div style={abs(130, 1420)}>
      <Band dreh={-4} bg={farben.tinte}>Das sieht man.</Band>
    </div>
  </>
);

const P6 = () => (
  <>
    <MeshHell t={600} />
    <Label s={S1} text="// 06 Unsichtbar" />
    <Gesperrt style={abs(90, 330)}>Nur sieht sie</Gesperrt>
    <Gross size={300} style={abs(70, 390)}>
      <span style={{ position: "relative" }}>
        Keiner.
      </span>
    </Gross>
    <Platzhalter x={60} y={760} w={960} h={760} text={"HIGGSFIELD H4\nFeld aus hunderten grauen Marmor-Kieseln (die Masse), Draufsicht leicht schräg, weiches Licht – deine Karte versinkt darin"} />
    <div style={abs(340, 1100, { transform: "rotate(-6deg)", opacity: 0.55 })}>
      <Ergebnis y={0} x={0} w={420} titel="Du" blass />
    </div>
  </>
);

const P7 = () => (
  <>
    <MeshHell t={800} />
    <Label s={S1} text="// 07 Heb an ★ Signature" />
    <Platzhalter x={60} y={1060} w={960} h={460} text={"HIGGSFIELD H4 (Video, 5 s)\nein Kiesel aus violettem Glas hebt sich aus der grauen Masse, Schatten wird kleiner"} />
    <Telefon x={340} y={560} w={400}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${farben.nacht}, #2A1E6E)` }} />
    </Telefon>
    <GlasPille w={820} h={190} y={430} style={{ gap: 22 }}>
      <span style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 64, color: farben.tinte }}>Solleva heisst:</span>
      <span style={{ fontFamily: schrift.serif, fontStyle: "italic", fontSize: 92, color: farben.violett }}>heb an.</span>
    </GlasPille>
    <Pfeil d="M 540 1000 L 540 700 M 500 750 L 540 700 L 580 750" />
    <div style={abs(90, 300, { fontFamily: schrift.mono, fontSize: 26, color: farben.grau })}>Dynamic-Island-Pille wächst aus dem Telefon (Apple-Ref 5,9–6,3 s)</div>
  </>
);

const P8 = () => (
  <>
    <MeshHell t={1000} />
    <Label s={S1} text="// 08 Genau das" />
    <Gesperrt style={abs(90, 330)}>Genau das mache ich mit</Gesperrt>
    <Gross size={200} style={abs(70, 390)}>deiner</Gross>
    <div style={abs(380, 520)}>
      <Band dreh={-4} size={130}>Website</Band>
    </div>
    <Telefon x={250} y={800} w={580}>
      <div style={{ position: "absolute", inset: 0, background: farben.papier }} />
      <div style={abs(40, 120, { fontFamily: schrift.titel, fontWeight: 900, fontSize: 90, lineHeight: 0.9, color: farben.tinte })}>DEINE<br />FIRMA</div>
      <div style={abs(40, 330, { width: 300, height: 64, borderRadius: 999, background: farben.violett })} />
      <div style={abs(40, 440, { width: 470, height: 300, borderRadius: 30, background: farben.lavendel })} />
      <div style={abs(40, 780, { width: 400, height: 18, borderRadius: 9, background: farben.grauLinie })} />
      <div style={abs(40, 820, { width: 300, height: 18, borderRadius: 9, background: farben.grauLinie })} />
    </Telefon>
    <div style={{ position: "absolute", left: 230, top: 1640, width: 620, height: 40, borderRadius: "50%", background: "rgba(44,30,120,.18)", filter: "blur(18px)" }} />
  </>
);

const P9 = () => (
  <>
    <MeshHell t={1200} />
    <div style={abs(0, 300, { width: 1080, textAlign: "center", fontFamily: schrift.text, fontWeight: 800, fontSize: 40, letterSpacing: "0.14em", color: farben.tinte })}>SOLLEVA</div>
    <Gesperrt style={abs(0, 620, { width: 1080, textAlign: "center" })}>Sichtbar sein</Gesperrt>
    <GlasPille w={760} h={220} y={700}>
      <span style={{ fontFamily: schrift.titel, fontWeight: 900, fontSize: 130, color: farben.tinte, textTransform: "uppercase" }}>ist kein</span>
    </GlasPille>
    <Kursiv size={280} style={abs(0, 900, { width: 1080, textAlign: "center" })}>Zufall.</Kursiv>
  </>
);

const panels = [P1, P2, P3, P4, P5, P6, P7, P8, P9];
export const STORYBOARD_DAUER = panels.length;

export const Storyboard: React.FC = () => {
  const f = useCurrentFrame();
  const P = panels[Math.min(f, panels.length - 1)];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Schriften />
      <P />
    </AbsoluteFill>
  );
};
