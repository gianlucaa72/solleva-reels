import React from "react";
import { AbsoluteFill } from "remotion";
import { Schriften } from "../../components/Basis";
import { schrift } from "../../brand/solleva";

// Storyboard-Standbilder «Ein Zwanzigstel Sekunde» (Website-Look, Platzhalter statt Higgsfield-Objekte)
const C = {
  ink: "#04050C", night: "#0A0D22", violet: "#6C3FD4", lilac: "#A98BFF", cyan: "#8FE3FF",
  text: "#F1F2F7", muted: "#B4BDE0", creme: "#EFEAE0",
};
const serif = `"${schrift.serif}", serif`;
const sans = `"${schrift.text}", sans-serif`;
const mono = `"${schrift.mono}", monospace`;

const Welt: React.FC<{ planet?: boolean; glow?: string }> = ({ planet = true, glow = C.violet }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 100%, ${C.night} 0%, ${C.ink} 70%)` }}>
    <AbsoluteFill style={{ background: `radial-gradient(60% 30% at 50% 78%, ${glow}55 0%, transparent 70%)` }} />
    {planet && (
      <div style={{ position: "absolute", left: -300, right: -300, top: 1500, height: 1200, borderRadius: "50%",
        background: `radial-gradient(ellipse at 50% 0%, #0a0d22 40%, #04050c 70%)`,
        boxShadow: `0 -6px 60px 6px ${C.lilac}aa, 0 -2px 8px 2px ${C.cyan}` }} />
    )}
  </AbsoluteFill>
);

const Glas: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "linear-gradient(160deg,#ffffff24,#ffffff09)", border: "1.5px solid #ffffff33", borderRadius: 34,
    boxShadow: "0 30px 80px rgba(0,0,0,.45)", backdropFilter: "blur(10px)", ...style }}>{children}</div>
);

const Kristall: React.FC<{ size?: number; x?: number; y?: number; rot?: number }> = ({ size = 360, x = 540, y = 960, rot = -12 }) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size * 1.25, transform: `rotate(${rot}deg)` }}>
    <div style={{ width: "100%", height: "100%",
      clipPath: "polygon(50% 0%, 92% 28%, 78% 100%, 22% 100%, 8% 28%)",
      background: `conic-gradient(from 200deg, ${C.cyan}, ${C.violet}, #ff4fa3, #ff8a3d, #ffe27a, ${C.cyan})`, opacity: .9 }} />
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(50% 0%, 92% 28%, 78% 100%, 22% 100%, 8% 28%)",
      background: "linear-gradient(135deg,#ffffff88 0%,#ffffff00 45%,#00000055 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: -50, textAlign: "center", font: `500 22px ${mono}`, color: C.muted, transform: `rotate(${-rot}deg)` }}>PLATZHALTER · Higgsfield-Kristall</div>
  </div>
);

const Logo: React.FC = () => (
  <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", font: `600 30px ${sans}`, letterSpacing: 6, color: C.text }}>
    <span style={{ color: C.lilac }}>✦</span> SOLLEVA
  </div>
);

const Satz: React.FC<{ nr: number; text: string; kamera: string }> = ({ nr, text, kamera }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 40px 36px", background: "#04050cf2", color: C.muted, font: `500 26px ${mono}`, lineHeight: 1.4 }}>
    <div style={{ color: C.cyan }}>SZENE {nr} · «{text}»</div>
    <div>{kamera}</div>
  </div>
);

const AltSeite: React.FC<{ w?: number; h?: number; pixel?: boolean }> = ({ w = 640, h = 760, pixel }) => (
  <div style={{ width: w, height: h, background: "#e9e6dc", border: "3px solid #8a8a8a", overflow: "hidden", imageRendering: "pixelated",
    filter: pixel ? "contrast(1.1) saturate(.8)" : "none", fontFamily: "Times New Roman, serif", color: "#222" }}>
    <div style={{ background: "#1c3f95", color: "#fff", padding: "14px 18px", fontSize: 30, fontWeight: 700 }}>Herzlich Willkommen!</div>
    <div style={{ display: "flex", gap: 14, padding: 14 }}>
      <div style={{ width: 170, background: "#c7c3b2", padding: 10, fontSize: 22, lineHeight: 1.5, color: "#1c3f95", textDecoration: "underline" }}>Start<br />Über uns<br />Leistungen<br />Preise<br />Gästebuch<br />Kontakt</div>
      <div style={{ flex: 1, fontSize: 22, lineHeight: 1.35 }}>
        <div style={{ color: "#a30000", fontWeight: 700, fontSize: 26 }}>Neu: Jetzt mit Gästebuch!!</div>
        Willkommen auf der Homepage unserer Praxis. Besuchen Sie uns auch auf unserer Seite.
        <div style={{ marginTop: 14, height: 130, background: "#b8b4a0", border: "2px solid #777" }} />
        <div style={{ marginTop: 14, fontSize: 18, color: "#555" }}>Besucher seit 2012: 000412</div>
      </div>
    </div>
  </div>
);

const NeuSeite: React.FC<{ w?: number; h?: number; pl?: number }> = ({ w = 640, h = 760, pl = 26 }) => (
  <div style={{ width: w, height: h, background: C.creme, overflow: "hidden", color: "#0b1030", fontFamily: sans, padding: `26px 26px 26px ${pl}px` }}>
    <div style={{ font: `600 20px ${sans}`, letterSpacing: 4 }}>PRAXIS MUSTER</div>
    <div style={{ fontFamily: serif, fontSize: 64, lineHeight: 1.05, marginTop: 70 }}>Ruhig. <i style={{ color: C.violet }}>Klar.</i><br />Für dich da.</div>
    <div style={{ marginTop: 24, fontSize: 24, color: "#3b4470" }}>Persönlich, nah, in Olten.</div>
    <div style={{ marginTop: 34, display: "inline-block", background: "#0b1030", color: "#fff", padding: "16px 28px", borderRadius: 40, fontSize: 22 }}>Termin anfragen →</div>
    <div style={{ marginTop: 50, height: 200, borderRadius: 26, background: "linear-gradient(135deg,#d8cfe9,#b9c9a8)" }} />
  </div>
);

const Safe: React.FC = () => (
  <div style={{ position: "absolute", left: 95, top: 300, width: 805, height: 1250, border: "2px dashed #ff4fa388", pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: -26, left: 0, font: `500 18px ${mono}`, color: "#ff4fa3aa" }}>SAFE ZONE x95–900 · y300–1550</div>
  </div>
);

const scenes: Record<number, React.ReactNode> = {
  1: (<>
    <Welt />
    <Logo />
    <Kristall size={420} x={540} y={1130} />
    <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", color: C.text }}>
      <div style={{ font: `500 26px ${mono}`, letterSpacing: 6, color: C.lilac }}>50 MILLISEKUNDEN</div>
      <div style={{ fontFamily: serif, fontSize: 290, letterSpacing: -8, lineHeight: 1, marginTop: 10 }}>0,05<i style={{ fontSize: 150, color: C.lilac }}> s</i></div>
    </div>
    <Satz nr={1} text="Ein Zwanzigstel einer Sekunde." kamera="Zähler ist bis 0,8 s da · Stoss auf «Zwanzigstel» · Zoom-Through in die Kristall-Facette" />
  </>),
  2: (<>
    <Welt glow={C.cyan} />
    <Logo />
    <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontSize: 92, color: C.text, lineHeight: 1.05 }}>So schnell <i style={{ color: C.lilac }}>urteilt</i> man<br />über deine Website.</div>
    <Glas style={{ position: "absolute", left: 220, top: 720, width: 660, padding: 10, transform: "rotate(-3deg)" }}><AltSeite /></Glas>
    <div style={{ position: "absolute", left: 360, top: 1180, transform: "rotate(-12deg)", border: `8px solid ${C.violet}`, color: C.lilac, padding: "10px 34px", font: `800 96px ${sans}`, letterSpacing: 4, borderRadius: 12, background: "#04050ccc" }}>BEWERTET</div>
    <Satz nr={2} text="So schnell urteilt man über deine Website." kamera="Alte Seite als Glaskarte · Stempel schlägt auf «urteilt» ein · Zoom-Through in den Stempel" />
  </>),
  3: (<>
    <Welt />
    <Logo />
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontSize: 92, color: C.text, lineHeight: 1.05 }}>Noch bevor jemand<br />ein <i style={{ color: C.lilac }}>Wort</i> liest.</div>
    <Glas style={{ position: "absolute", left: 160, top: 760, width: 760, padding: 40 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ height: 22, margin: "22px 0", width: `${55 + ((i * 37) % 45)}%`, borderRadius: 11, background: "#ffffff30", filter: "blur(5px)" }} />
      ))}
    </Glas>
    <div style={{ position: "absolute", left: 600, top: 930, width: 120, height: 120, borderRadius: "50%", border: `3px solid ${C.cyan}`, boxShadow: `0 0 40px ${C.cyan}` }} />
    <Satz nr={3} text="Noch bevor jemand ein Wort liest." kamera="Text verschwimmt zu Strichen · Blickpunkt springt (Stakkato) · Zoom-Through in den Blickpunkt" />
  </>),
  4: (<>
    <Welt glow={C.lilac} />
    <Logo />
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontSize: 96, color: C.text, lineHeight: 1.05 }}>Und dieses Urteil<br /><i style={{ color: C.lilac }}>bleibt.</i></div>
    <Glas style={{ position: "absolute", left: 220, top: 760, width: 660, padding: 10, opacity: .55 }}><AltSeite /></Glas>
    <div style={{ position: "absolute", left: 200, top: 1000, transform: "rotate(-9deg)", color: C.lilac, border: `12px solid ${C.violet}`, padding: "20px 50px", font: `800 150px ${sans}`, borderRadius: 18, background: "#04050cdd", letterSpacing: 4 }}>BLEIBT</div>
    <Satz nr={4} text="Und dieses Urteil bleibt." kamera="Stempel aus Szene 2 kehrt gross zurück · Kamera-Stoss auf «bleibt» · Schock-Pause 0,2 s" />
  </>),
  5: (<>
    <AbsoluteFill style={{ background: "#c7c3b2" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(#0000001a 1px,transparent 1px),linear-gradient(90deg,#0000001a 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", font: `700 80px "Times New Roman", serif`, color: "#1c3f95", lineHeight: 1.1 }}>Aber viele Seiten<br />sehen aus wie <span style={{ background: "#ffe94d", padding: "0 14px", color: "#a30000" }}>2012.</span></div>
    <div style={{ position: "absolute", left: 220, top: 700 }}><AltSeite w={640} h={800} pixel /></div>
    <div style={{ position: "absolute", right: 120, top: 1100, transform: "rotate(8deg)", font: `700 34px "Courier New", monospace`, background: "#fff", border: "3px solid #000", padding: "8px 16px" }}>Best viewed in IE 8</div>
    <Satz nr={5} text="Aber viele Seiten sehen aus wie 2012." kamera="BRUCH-MOMENT: harter Schnitt in helle Retro-Welt, Logo bewusst weg · Zuspitzung, wird so gekennzeichnet" />
  </>),
  6: (<>
    <Welt glow={C.cyan} />
    <Logo />
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontSize: 88, color: C.text, lineHeight: 1.05 }}>Gute Seiten fühlen<br />sich <i style={{ color: C.lilac }}>anders</i> an.</div>
    <div style={{ position: "absolute", left: 290, top: 700, width: 500, height: 820, borderRadius: 70, border: "10px solid #1b1d34", background: "#000", overflow: "hidden", boxShadow: `0 40px 120px #000, 0 0 90px ${C.violet}66` }}>
      <div style={{ position: "absolute", inset: 0, transform: "scale(.78)", transformOrigin: "0 0", width: 640 }}><AltSeite w={640} h={1060} /></div>
      <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 0 244px)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "scale(.78)", transformOrigin: "0 0" }}><NeuSeite w={640} h={1060} pl={330} /></div>
      </div>
      <div style={{ position: "absolute", left: 244, top: 0, bottom: 0, width: 6, background: "#fff" }} />
      <div style={{ position: "absolute", left: 222, top: 380, width: 50, height: 50, borderRadius: "50%", background: "#fff", color: "#0b1030", display: "grid", placeItems: "center", font: `700 26px ${sans}` }}>⇄</div>
    </div>
    <Satz nr={6} text="Gute Seiten fühlen sich anders an." kamera="SIGNATURE: Regler zieht von alt (links) zu neu (rechts) · Zoom-Through in den Handy-Bildschirm" />
  </>),
  7: (<>
    <Welt />
    <Logo />
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontSize: 100, color: C.text }}>Ruhig. Klar. <i style={{ color: C.lilac }}>Schnell.</i></div>
    {["Ruhig.", "Klar.", "Schnell."].map((t, i) => (
      <Glas key={t} style={{ position: "absolute", left: 140 + (i % 2) * 70, top: 640 + i * 270, width: 660, height: 230, padding: 36, boxSizing: "border-box" }}>
        <div style={{ font: `500 22px ${mono}`, color: C.cyan, letterSpacing: 4 }}>0{i + 1}</div>
        <div style={{ fontFamily: serif, fontSize: 96, color: C.text, marginTop: 6 }}>{t}</div>
      </Glas>
    ))}
    <Satz nr={7} text="Ruhig. Klar. Schnell." kamera="Drei Glas-Karten landen auf je ein Wort (B06) · Zoom-Through in die dritte Karte" />
  </>),
  8: (<>
    <Welt />
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", color: C.text }}>
      <div style={{ font: `600 56px ${sans}`, letterSpacing: 10 }}><span style={{ color: C.lilac }}>✦</span> SOLLEVA</div>
      <div style={{ fontFamily: serif, fontSize: 130, marginTop: 40, lineHeight: 1 }}>Folge für <i style={{ color: C.lilac }}>mehr.</i></div>
      <div style={{ font: `500 36px ${mono}`, marginTop: 40, color: C.cyan }}>@solleva.ch</div>
      <div style={{ fontFamily: serif, fontSize: 52, marginTop: 60, color: C.muted }}>Heb dich von der Masse ab.</div>
    </div>
    <Kristall size={160} x={540} y={1330} rot={-8} />
    <Satz nr={8} text="Folge für mehr." kamera="Endkarte ≥ 1,5 s · letzter Frame ≈ erster Frame (Kristall) → Loop" />
  </>),
};

export const Storyboard: React.FC<{ szene: number }> = ({ szene }) => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Schriften />
    {scenes[szene]}
    <Safe />
  </AbsoluteFill>
);
