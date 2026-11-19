import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Ton } from "../../lib/kamera";
import { kurve, overshoot, tw } from "../../lib/bewegung";
import {
  Blase, Hand, HKaro, HPunkte, HSpirale, HZeitung, Karteikarte, Kreistext, Korn, Praegeband, Rasterwort, Riso, Stapel,
  Stempel, Papierstueck, riss as rissPfad, weisserRand, Zacken, zine, ZineSchriften,
} from "../../stil/halbton";
import { ErpresserAnim, EtikettAnim, screenFrame, StrahlenBild, Szene1, Szene2, Walzenreihe } from "./Stiltest";
import { REEL_DAUER, SAETZE } from "./zeiten";

// ============================================================================
// Reel «Spielautomat» (Stil R01 Halbton-Collage). 14 Sätze = 14 Szenen.
// Zeiten: zeiten.ts (Stimme Andre, 0,3 s Pause, 1,4 s Lese-Pause nach dem Hook).
// ============================================================================
export { REEL_DAUER };
const Z = (n: number) => SAETZE[n - 1] as unknown as { nr: number; start: number; ende: number; datei: string; m: Record<string, number> };
const A = (name: string) => staticFile(`assets/spielautomat/${name}.png`);

// ---------- Kamera mit Frame-Parameter (nie Stillstand) ----------
const KameraF: React.FC<{ f: number; start: number; dauer: number; push?: number; seed?: number; rucke?: number[]; children: React.ReactNode }> = ({ f, start, dauer, push = 0.035, seed = 0, rucke = [], children }) => {
  const l = f - start;
  const t = Math.max(0, Math.min(1, l / Math.max(1, dauer)));
  let ruck = 0;
  for (const r of rucke) if (f >= r && f < r + 14) ruck += tw(f, r, 3, 0, 0.04, kurve.whip) - tw(f, r + 3, 11, 0, 0.04, kurve.land);
  let wackel = 0;
  for (const r of rucke) if (f >= r && f < r + 8) wackel += Math.sin((f - r) * 2.4) * (1 - (f - r) / 8) * 9;
  const s = 1 + push * kurve.heavy(t) + ruck;
  const x = Math.sin((l + seed * 41) / 53) * 4 + wackel;
  const y = Math.cos((l + seed * 29) / 67) * 3;
  const r = Math.sin((l + seed * 17) / 90) * 0.4;
  return <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)` }}>{children}</AbsoluteFill>;
};

// ---------- Text-Eingänge ----------
type Art = "slap" | "stempel" | "fall" | "pop" | "schreiben" | "rutsch";
export const Rein: React.FC<{ f: number; start: number; art?: Art; dauer?: number; ox?: number; oy?: number; children: React.ReactNode }> = ({ f, start, art = "slap", dauer = 30, ox = 540, oy = 500, children }) => {
  if (f < start) return null;
  let tr = "";
  let o = 1;
  let clip: string | undefined;
  if (art === "slap") {
    tr = `rotate(${tw(f, start, 8, -6, 0, kurve.land)}deg) scale(${tw(f, start, 6, 1.3, 1, kurve.whip)})`;
    o = tw(f, start, 3, 0, 1, kurve.fade);
  } else if (art === "stempel") {
    const w = f >= start + 5 && f < start + 11 ? Math.sin((f - start) * 3) * 4 : 0;
    tr = `translateX(${w}px) scale(${tw(f, start, 5, 2.2, 1, kurve.whip)})`;
    o = tw(f, start, 2, 0, 1, kurve.fade);
  } else if (art === "fall") {
    const p = tw(f, start, 10, 1, 0, kurve.whip);
    tr = `translateY(${-800 * p}px) rotate(${-14 * p}deg) scale(${f >= start + 9 ? overshoot(f, start + 9, 8, 1.03) : 1})`;
  } else if (art === "pop") {
    tr = `scale(${overshoot(f, start, 10, 1.07)})`;
  } else if (art === "rutsch") {
    tr = `translateX(${tw(f, start, 10, 1200, 0, kurve.whip)}px)`;
  } else if (art === "schreiben") {
    const p = tw(f, start, dauer, 0, 1, kurve.linear);
    clip = `inset(-20% ${(1 - p) * 100}% -40% -5%)`;
  }
  return <AbsoluteFill style={{ transform: tr, transformOrigin: `${ox}px ${oy}px`, opacity: o, clipPath: clip }}>{children}</AbsoluteFill>;
};

// ---------- Objekt (Higgsfield-Ausschnitt mit weissem Papierrand) ----------
const Obj: React.FC<{ f: number; src: string; w: number; ar: number; cx: number; cy: number; start: number; von?: "unten" | "oben" | "links" | "rechts" | "pop" | "da"; dreh?: number; schweben?: number; extra?: string; children?: React.ReactNode }> = ({ f, src, w, ar, cx, cy, start, von = "unten", dreh = 0, schweben = 8, extra = "", children }) => {
  if (f < start && von !== "da") return null;
  const h = w * ar;
  const p = von === "da" ? 0 : tw(f, start, 12, 1, 0, kurve.whip);
  const off = { unten: [0, 1300], oben: [0, -1300], links: [-1200, 0], rechts: [1200, 0], pop: [0, 0], da: [0, 0] }[von];
  const sc = von === "pop" ? (f < start ? 0 : overshoot(f, start, 12, 1.08)) : f >= start + 10 && von !== "da" ? overshoot(f, start + 10, 8, 1.03) : 1;
  const sw = Math.sin((f - start) / 22) * schweben;
  const rot = dreh + Math.sin((f - start) / 30) * 1.5 + p * (von === "links" ? -20 : von === "rechts" ? 20 : 8);
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `translate(${off[0] * p}px, ${off[1] * p + sw}px) rotate(${rot}deg) scale(${sc}) ${extra}`, filter: `${weisserRand(8)} blur(${p * 6}px)` }}>
      <Img src={src} style={{ width: "100%", height: "100%" }} />
      {children}
    </div>
  );
};

// ---------- Hintergründe aus Bildern ----------
export const BildGrund: React.FC<{ name: string; f: number; start: number; zoom?: number; vx?: number; vy?: number }> = ({ name, f, start, zoom = 1.12, vx = 0, vy = -0.5 }) => {
  const l = f - start;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#222" }}>
      <Img src={A(name)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translate(${l * vx}px, ${l * vy}px) scale(${zoom + l * 0.0004})` }} />
    </AbsoluteFill>
  );
};
export const PapierLage: React.FC<{ staerke?: number }> = ({ staerke = 0.55 }) => (
  <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: staerke }}>
    <Img src={A("papier")} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
  </AbsoluteFill>
);

// ============================== Szenen ==============================
// 3 «Meistens Niete. Aber manchmal: Treffer.»
const S3: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(3);
  const strich = tw(f, z.m.niete + 12, 8, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <StrahlenBild f={f} cx={540} cy={1060} bild="strahlen-gelb" grund="#B07A12" tempo={0.12} />
      <Rein f={f} start={z.start} art="rutsch">
        <Papierstueck x={50} y={235} w={980} h={230} dreh={-2} seed={31} style={{ background: "#F6F1E4" }} />
      </Rein>
      <Rein f={f} start={z.start + 2} art="slap" ox={100} oy={280}>
        <div style={{ position: "absolute", left: 100, top: 250, fontFamily: "Fell", fontStyle: "italic", fontSize: 84, color: zine.schwarz, whiteSpace: "nowrap" }}>
          Meistens{" "}
          {f >= z.m.niete && (
            <span style={{ position: "relative" }}>
              Niete.
              <span style={{ position: "absolute", left: -6, top: "52%", height: 9, width: `${strich * 108}%`, background: zine.rot, transform: "rotate(-4deg)" }} />
            </span>
          )}
        </div>
      </Rein>
      <Rein f={f} start={z.m.aber} art="slap" ox={300} oy={370}>
        <div style={{ position: "absolute", left: 300, top: 345, fontFamily: "Fell", fontStyle: "italic", fontSize: 84, color: zine.schwarz }}>Aber manchmal:</div>
      </Rein>
      <Rein f={f} start={z.m.wort} art="stempel" ox={540} oy={560}>
        <Riso x={70} y={485} text="TREFFER!" size={190} dreh={-4} />
      </Rein>
      {f >= z.m.wort && <Zacken x={830} y={1010} r={overshoot(f, z.m.wort, 10, 1.1) * 230} farbe={zine.rot} spitzen={13} dreh={f * 0.6} />}
      <div style={{ position: "absolute", left: 100, top: 820, filter: weisserRand(8) }}>
        <Walzenreihe f={f} w={260} h={380} start={z.start - 70} stops={[z.m.niete + 8, z.m.aber - 6, z.m.wort]} ziele={[1, 1, 0]} startIdx={[0, 2, 4]} />
      </div>
    </AbsoluteFill>
  );
};

// 4 «Und dann schüttet dein Gehirn Dopamin aus.»
const S4: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(4);
  const puls = f >= z.m.wort && f < z.m.wort + 16 ? 1 + Math.sin(((f - z.m.wort) / 16) * Math.PI) * 0.08 : 1;
  const funken = [[250, 900, 0], [850, 960, 3], [190, 1360, 6], [900, 1420, 9], [560, 760, 12], [700, 1560, 15]];
  return (
    <AbsoluteFill>
      <BildGrund name="wolken" f={f} start={z.start} vy={-0.6} />
      <Rein f={f} start={z.start} art="slap" ox={80} oy={280}>
        <div style={{ position: "absolute", left: 80, top: 255, background: "#fff", padding: "10px 20px", fontFamily: "JetBrains Mono", fontSize: 38, letterSpacing: "0.06em", color: zine.schwarz, boxShadow: "6px 9px 0 rgba(0,0,0,.2)", transform: "rotate(-1.5deg)" }}>UND DANN SCHÜTTET DEIN GEHIRN …</div>
      </Rein>
      {f >= z.m.wort && (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 540px 1150px, rgba(108,63,212,${0.35 * tw(f, z.m.wort, 8, 0, 1)}), transparent 480px)` }} />
      )}
      <Obj f={f} src={A("gehirn-frei")} w={800} ar={1} cx={540} cy={1170} start={z.m.gehirn - 4} extra={`scale(${puls})`} />
      {funken.map(([x, y, d], i) => (f >= z.m.wort + d ? <Zacken key={i} x={x} y={y} r={overshoot(f, z.m.wort + d, 10, 1.15) * (55 + (i % 3) * 15)} farbe={zine.gelb} spitzen={9} dreh={f * 2 + i * 30} /> : null))}
      <Rein f={f} start={z.m.wort} art="stempel" ox={540} oy={430}>
        <Rasterwort x={60} y={340} text="DOPAMIN" size={205} farbe={zine.violett} dreh={-2} />
      </Rein>
      <Rein f={f} start={z.m.wort + 14} art="slap" ox={760} oy={570}>
        <div style={{ position: "absolute", left: 760, top: 545, background: "#fff", padding: "8px 18px", fontFamily: "JetBrains Mono", fontSize: 38, color: zine.schwarz, boxShadow: "6px 9px 0 rgba(0,0,0,.2)" }}>… AUS.</div>
      </Rein>
    </AbsoluteFill>
  );
};

// Flasche (Szene 5 + 6)
const FLASCHE = { w: 540, ar: 1168 / 880, cx: 560, cy: 1190 };
export const Etikett: React.FC = () => (
  <div style={{ position: "absolute", left: "24.5%", top: "43%", width: "50%", height: "41.5%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
    <div style={{ fontFamily: "Fell SC", fontSize: 64, color: zine.schwarz, letterSpacing: "0.04em", borderTop: `3px solid ${zine.schwarz}`, borderBottom: `3px solid ${zine.schwarz}`, padding: "2px 10px" }}>GLÜCK</div>
    <div style={{ fontFamily: "Fell", fontStyle: "italic", fontSize: 30, color: zine.rot }}>Tropfen · 100 ml</div>
    <div style={{ fontFamily: "Fell SC", fontSize: 20, color: "#555", letterSpacing: "0.1em" }}>3× TÄGLICH SCROLLEN</div>
  </div>
);

// 5 «Viele denken, Dopamin sei das Glückshormon.»
const S5: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(5);
  return (
    <AbsoluteFill>
      <HKaro f={f - z.start} />
      <PapierLage staerke={0.5} />
      <Rein f={f} start={z.start} art="schreiben" dauer={52}>
        <Hand x={90} y={245} text="Viele denken, Dopamin sei das …" size={66} farbe={zine.schwarz} strich={zine.violett} />
      </Rein>
      <Obj f={f} src={A("flasche-frei")} w={FLASCHE.w} ar={FLASCHE.ar} cx={FLASCHE.cx} cy={FLASCHE.cy} start={z.start + 10} dreh={4}>
        <Etikett />
      </Obj>
      <Rein f={f} start={z.m.wort} art="pop" ox={480} oy={520}>
        <Blase x={150} y={360} w={660} dreh={-3}>Glücks&shy;hormon!</Blase>
      </Rein>
    </AbsoluteFill>
  );
};

// 6 «Falsch. Dopamin heisst: Da kommt noch mehr.»
const S6: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(6);
  const riss = tw(f, z.start + 3, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <BildGrund name="schwarz" f={f} start={z.start} vy={-0.3} />
      <Obj f={f} src={A("flasche-frei")} w={FLASCHE.w} ar={FLASCHE.ar} cx={FLASCHE.cx} cy={FLASCHE.cy} start={z.start - 90} von="da" dreh={4}>
        <Etikett />
        <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M30,30 L44,46 L36,55 L52,70 L46,86 M44,46 L58,50 M52,70 L64,66" fill="none" stroke="#fff" strokeWidth={0.9} strokeDasharray="120" strokeDashoffset={120 * (1 - riss)} />
          <path d="M30,30 L44,46 L36,55 L52,70 L46,86 M44,46 L58,50 M52,70 L64,66" fill="none" stroke={zine.schwarz} strokeWidth={0.45} strokeDasharray="120" strokeDashoffset={120 * (1 - riss)} />
        </svg>
      </Obj>
      <Rein f={f} start={z.start + 1} art="stempel" ox={480} oy={1180}>
        <Stempel x={150} y={1090} text="FALSCH." size={170} dreh={-14} farbe="#FF3B3B" dunkel />
      </Rein>
      <Rein f={f} start={z.m.heisst} art="slap" ox={90} oy={300}>
        <div style={{ position: "absolute", left: 90, top: 280, fontFamily: "JetBrains Mono", fontSize: 40, color: "#C9C9C9", letterSpacing: "0.1em" }}>DOPAMIN HEISST:</div>
      </Rein>
      <Rein f={f} start={z.m.mehr} art="schreiben" dauer={30}>
        <Hand x={80} y={350} text="Da kommt noch mehr!" size={104} />
      </Rein>
    </AbsoluteFill>
  );
};

// 7 «Ein erwarteter Treffer lässt es fast kalt.»
const S7: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(7);
  const gaehn = f >= z.m.wort ? Math.sin(Math.min(1, (f - z.m.wort) / 20) * Math.PI) * -3 : 0;
  return (
    <AbsoluteFill>
      <BildGrund name="kraft" f={f} start={z.start} vx={0.2} vy={-0.2} />
      <Obj f={f} src={A("bueste-frei")} w={660} ar={1168 / 880} cx={560} cy={1220} start={z.start + 4} von="rechts" schweben={4} extra={`rotate(${gaehn}deg)`} />
      <Rein f={f} start={z.start} art="slap" ox={70} oy={290}>
        <Praegeband x={70} y={262} text="EIN ERWARTETER TREFFER" size={44} dreh={-2} />
      </Rein>
      <Rein f={f} start={z.m.zeile2} art="slap" ox={220} oy={390}>
        <Praegeband x={220} y={365} text="LÄSST ES FAST" size={44} farbe={zine.violett} dreh={2} />
      </Rein>
      <Rein f={f} start={z.m.wort} art="stempel" ox={420} oy={530}>
        <Praegeband x={300} y={470} text="KALT." size={112} farbe="#2F6FB5" dreh={-3} />
      </Rein>
      <Rein f={f} start={z.m.wort + 6} art="pop" ox={820} oy={800}>
        <div style={{ position: "absolute", left: 720, top: 760, fontFamily: "Caveat", fontWeight: 600, fontSize: 92, color: zine.schwarz, transform: "rotate(-8deg)" }}>gääähn …</div>
      </Rein>
    </AbsoluteFill>
  );
};

// 8 «Ein überraschender Treffer löst einen Schub aus.»
const S8: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(8);
  const schub = f < z.m.wort ? 0 : f < z.m.wort + 4 ? tw(f, z.m.wort, 4, 0, 1, kurve.whip) : tw(f, z.m.wort + 4, 20, 1, 0.4, kurve.land);
  const titel = f >= z.m.zeile2;
  return (
    <AbsoluteFill>
      <BildGrund name="wellen" f={f} start={z.start} vx={-0.5} vy={0} zoom={1.15} />
      {f >= z.m.wort && <Zacken x={790} y={930} r={overshoot(f, z.m.wort, 10, 1.12) * 260} farbe={zine.gelb} spitzen={14} dreh={f} />}
      <Obj f={f} src={A("kanone-frei")} w={860} ar={1} cx={500} cy={1200} start={z.start + 4} von="links" schweben={5} extra={`translate(${-34 * schub}px, ${20 * schub}px)`} />
      <Rein f={f} start={z.start + 1} art="fall" ox={540} oy={360}>
        <Papierstueck x={60} y={235} w={960} h={330} dreh={-2} seed={21} style={{ background: "#F1ECDF", padding: "26px 40px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: "Fell SC", fontSize: 33, letterSpacing: "0.06em", color: zine.rot, whiteSpace: "nowrap", borderBottom: `4px double ${zine.schwarz}`, paddingBottom: 6 }}>EXTRABLATT · ÜBERRASCHENDER TREFFER</div>
          <div style={{ fontFamily: "Fell SC", fontSize: 86, lineHeight: 1, color: zine.schwarz, marginTop: 22, whiteSpace: "nowrap", opacity: titel ? 1 : 0, transform: `scale(${titel ? tw(f, z.m.zeile2, 6, 1.15, 1, kurve.whip) : 1})`, transformOrigin: "left center" }}>
            Löst einen <span style={{ color: zine.rot, display: "inline-block", transform: `scale(${f >= z.m.wort ? tw(f, z.m.wort, 6, 1.6, 1, kurve.whip) : 1})`, opacity: f >= z.m.wort ? 1 : 0 }}>Schub</span> aus!
          </div>
        </Papierstueck>
      </Rein>
    </AbsoluteFill>
  );
};

// 9 «Am stärksten wirkt es, wenn es ungewiss ist.» + 10 «Darum scrollst du weiter. Und weiter.» (Spirale = Match-Cut)
const spiralWinkel = (f: number) => {
  const cut = Z(10).start - 3;
  return f < cut ? f * 0.6 : cut * 0.6 + (f - cut) * 2.4;
};
const S9: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(9);
  const flip = Math.cos((f - z.start) * 0.22);
  return (
    <AbsoluteFill>
      <HSpirale f={spiralWinkel(f)} tempo={1} />
      <PapierLage staerke={0.45} />
      <Rein f={f} start={z.start} art="slap" ox={100} oy={300}>
        <div style={{ position: "absolute", left: 70, right: 130, top: 255, background: "#fff", border: `4px solid ${zine.schwarz}`, padding: "14px 26px", fontFamily: "Fell", fontStyle: "italic", fontSize: 78, lineHeight: 1, transform: "rotate(-2deg)", boxShadow: "8px 12px 0 rgba(0,0,0,.25)" }}>Am stärksten wirkt es,<br />wenn es …</div>
      </Rein>
      {f >= z.m.wort && (
        <>
          <div style={{ position: "absolute", left: 540 - 400, top: 1170 - 400, width: 800, height: 800, borderRadius: "50%", background: "#F2EFE8", boxShadow: `0 0 0 8px ${zine.schwarz}`, transform: `scale(${overshoot(f, z.m.wort, 10, 1.05)})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${(f - z.m.wort) * 0.8}deg) scale(${overshoot(f, z.m.wort, 10, 1.05)})`, transformOrigin: "540px 1170px" }}>
            <Kreistext cx={540} cy={1170} r={320} text="UNGEWISS · UNGEWISS · UNGEWISS · " size={78} farbe={zine.rot} />
          </div>
        </>
      )}
      <Obj f={f} src={A("muenze-frei")} w={520} ar={1} cx={540} cy={1170} start={z.start + 3} von="pop" schweben={14} extra={`scaleX(${0.25 + 0.75 * Math.abs(flip)})`} />
    </AbsoluteFill>
  );
};

const S10: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(10);
  const zeilen = [z.m.weiter1, z.m.weiter1 + 6, z.m.und, z.m.und + 5, z.m.wort];
  const karten = [z.m.weiter1 + 14, z.m.und - 10, z.m.wort + 3];
  return (
    <AbsoluteFill>
      <HSpirale f={spiralWinkel(f)} tempo={1} />
      <PapierLage staerke={0.45} />
      <Rein f={f} start={z.start} art="rutsch">
        <Papierstueck x={30} y={215} w={1010} h={660} dreh={-2} seed={14} style={{ background: zine.papier }} />
      </Rein>
      <Rein f={f} start={z.start + 3} art="slap" ox={90} oy={260}>
        <div style={{ position: "absolute", left: 90, top: 245, fontFamily: "JetBrains Mono", fontSize: 40, letterSpacing: "0.08em", color: zine.schwarz }}>DARUM SCROLLST DU …</div>
      </Rein>
      {zeilen.map((s, i) => {
        if (f < s) return null;
        const size = 56 + (94 * i) / 4;
        let top = 310;
        for (let k = 0; k < i; k++) top += (56 + (94 * k) / 4) * 0.88;
        return (
          <div key={i} style={{ position: "absolute", left: 90, top, fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.88, letterSpacing: "-0.03em", color: i % 2 ? zine.rot : zine.schwarz, transform: `scale(${tw(f, s, 5, 1.3, 1, kurve.whip)})`, transformOrigin: "left center" }}>WEITER.</div>
        );
      })}
      {karten.map((s, i) =>
        f >= s ? (
          <div key={i} style={{ position: "absolute", left: 140 + i * 50, top: 980 + i * 175, transform: `translateX(${tw(f, s, 8, 900, 0, kurve.whip)}px) rotate(${-6 + i * 5}deg) scale(${i === 2 ? 1.12 : 1})`, background: i === 2 ? zine.gelb : "#fff", border: `5px solid ${zine.schwarz}`, fontFamily: "Barlow", fontWeight: 800, fontSize: 84, padding: "8px 30px", boxShadow: "8px 12px 0 rgba(0,0,0,.28)" }}>
            NUR NOCH EINS.
          </div>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

// 11 «Deine Firma steckt in derselben Walze.»
const LAPTOP = { w: 940, ar: 880 / 1168, cx: 540, cy: 1230 };
const laptopScreen = () => {
  const h = LAPTOP.w * LAPTOP.ar;
  const x0 = LAPTOP.cx - LAPTOP.w / 2;
  const y0 = LAPTOP.cy - h / 2;
  return { x: x0 + LAPTOP.w * (274 / 1168), y: y0 + h * (149 / 880), w: LAPTOP.w * (612 / 1168), h: h * (375 / 880) };
};
const S11: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(11);
  const mark = tw(f, z.m.wort, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <HZeitung f={f - z.start + 200} />
      <PapierLage staerke={0.6} />
      <Obj f={f} src={A("laptop-frei")} w={LAPTOP.w} ar={LAPTOP.ar} cx={LAPTOP.cx} cy={LAPTOP.cy} start={z.start + 4} schweben={4}>
        <div style={{ position: "absolute", left: "23.5%", top: "16.9%", width: "52.4%", height: "42.6%", background: "#F4F1EA", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", height: 44, background: zine.violett, color: "#fff", fontFamily: "Barlow", fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", paddingLeft: 16, boxSizing: "border-box" }}>deine-firma.ch</div>
          <div style={{ marginTop: 18, transform: "scale(0.62)", transformOrigin: "top center" }}>
            <Walzenreihe f={f} w={130} h={200} start={z.start + 10} stops={[9999, 9999, 9999]} ziele={[0, 0, 0]} startIdx={[1, 3, 5]} />
          </div>
        </div>
      </Obj>
      <Rein f={f} start={z.start} art="fall" ox={520} oy={330}>
        <div style={{ position: "absolute", left: 80, top: 240, width: 900, transform: "rotate(-2deg)", background: "#FBF8F0", boxShadow: "8px 12px 0 rgba(0,0,0,.22)", padding: "30px 40px 36px", backgroundImage: "repeating-linear-gradient(transparent 0 66px, #C9D5EA 66px 68px)", backgroundPosition: "0 44px" }}>
          <div style={{ position: "absolute", left: 360, top: -26, width: 170, height: 50, background: "rgba(240,234,210,.85)", transform: "rotate(-4deg)" }} />
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 54, lineHeight: "68px", color: "#222" }}>Deine Firma steckt</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 54, lineHeight: "68px", color: "#222" }}>
            in derselben{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ position: "absolute", left: -8, right: -8, top: 8, bottom: 6, background: zine.gelb, transformOrigin: "left center", transform: `scaleX(${mark}) rotate(-1deg)`, zIndex: 0 }} />
              <span style={{ position: "relative" }}>Walze.</span>
            </span>
          </div>
        </div>
      </Rein>
    </AbsoluteFill>
  );
};

// 12 «In der ersten Sekunde entscheidet sich: weiter oder Stopp.»
const S12: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(12);
  const kipp = tw(f, z.m.wort, 14, 0, 180, kurve.heavy);
  return (
    <AbsoluteFill>
      <HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" f={f} />
      <PapierLage staerke={0.4} />
      <Obj f={f} src={A("sanduhr-frei")} w={500} ar={1168 / 880} cx={560} cy={1250} start={z.start + 2} von="pop" schweben={6} extra={`rotate(${kipp}deg)`} />
      <Rein f={f} start={z.m.wort} art="stempel" ox={180} oy={420}>
        <div style={{ position: "absolute", left: 70, top: 230, fontFamily: "Barlow", fontWeight: 800, fontSize: 430, lineHeight: 0.8, color: "#fff", letterSpacing: "-0.05em", textShadow: "10px 12px 0 rgba(0,0,0,.25)" }}>1</div>
      </Rein>
      <Rein f={f} start={z.m.wort + 6} art="slap" ox={330} oy={320}>
        <div style={{ position: "absolute", left: 330, top: 275, fontFamily: "Rye", fontSize: 98, color: zine.gelb, lineHeight: 1, textShadow: `5px 5px 0 ${zine.schwarz}` }}>SEKUNDE</div>
      </Rein>
      <Rein f={f} start={z.m.wort + 16} art="slap" ox={335} oy={410}>
        <div style={{ position: "absolute", left: 335, top: 400, fontFamily: "JetBrains Mono", fontSize: 40, color: "#fff" }}>entscheidet:</div>
      </Rein>
      <Rein f={f} start={z.m.weiter} art="slap" ox={335} oy={480}>
        <div style={{ position: "absolute", left: 335, top: 460, fontFamily: "Barlow", fontWeight: 800, fontSize: 64, color: "#fff" }}>WEITER —</div>
      </Rein>
      <Rein f={f} start={z.m.stopp - 4} art="stempel" ox={540} oy={590}>
        <div style={{ position: "absolute", left: 335, top: 540, fontFamily: "Barlow", fontWeight: 800, fontSize: 64, color: "#fff" }}>
          oder <span style={{ background: zine.gelb, color: zine.schwarz, padding: "0 12px" }}>STOPP.</span>
        </div>
      </Rein>
    </AbsoluteFill>
  );
};

// 13 «Bist du die Niete – oder der Treffer?»
const S13: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(13);
  const strich = tw(f, z.m.niete + 6, 8, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#151515" }} />
      <Papierstueck x={530} y={-60} w={640} h={2060} dreh={3} seed={11} style={{ background: zine.gelb }} />
      <PapierLage staerke={0.45} />
      <Rein f={f} start={z.m.niete} art="slap" ox={80} oy={330}>
        <div style={{ position: "absolute", left: 80, top: 270, fontFamily: "Fell SC", fontSize: 130, color: "#8A8A8A" }}>
          Niete
          <span style={{ position: "absolute", left: -10, top: "50%", height: 12, width: `${strich * 112}%`, background: zine.rot, transform: "rotate(-5deg)" }} />
        </div>
      </Rein>
      <Rein f={f} start={z.m.oder} art="pop" ox={560} oy={470}>
        <div style={{ position: "absolute", left: 470, top: 430, fontFamily: "Caveat", fontWeight: 600, fontSize: 80, color: "#fff", transform: "rotate(-6deg)", textShadow: "3px 3px 0 #000" }}>oder …</div>
      </Rein>
      <Rein f={f} start={z.m.wort} art="stempel" ox={800} oy={600}>
        <div style={{ position: "absolute", left: 560, top: 540, fontFamily: "Rye", fontSize: 98, color: zine.schwarz, transform: "rotate(4deg)" }}>Treffer?</div>
      </Rein>
      <Obj f={f} src={A("papierball-frei")} w={330} ar={1} cx={270} cy={1250} start={z.start + 6} von="oben" dreh={-8} schweben={3} />
      {f >= z.m.wort && <Zacken x={810} y={1170} r={overshoot(f, z.m.wort, 10, 1.1) * 260} farbe={zine.rot} spitzen={14} dreh={f * 0.8} />}
      <Obj f={f} src={A("pokal-frei")} w={440} ar={1168 / 880} cx={810} cy={1200} start={z.m.wort - 3} von="unten" dreh={5} />
    </AbsoluteFill>
  );
};

// 14 «Folge für mehr.» (CTA, bleibt 2 s stehen)
const S14: React.FC<{ f: number }> = ({ f }) => {
  const z = Z(14);
  return (
    <AbsoluteFill>
      <StrahlenBild f={f} cx={540} cy={1000} bild="strahlen-violett" grund="#3A1F7A" tempo={0.1} />
      <ErpresserAnim text="FOLGE" x={200} y={360} size={150} versatz={5} start={z.start} takt={3} f={f} />
      <ErpresserAnim text="FÜR MEHR" x={100} y={560} size={124} versatz={2} start={z.m.mehr} takt={2} f={f} />
      <Rein f={f} start={z.ende - 4} art="pop" ox={540} oy={960}>
        <div style={{ position: "absolute", left: 160, right: 160, top: 840, background: "#F6F1E4", padding: "28px 40px", transform: "rotate(-2deg)", boxShadow: "10px 14px 0 rgba(0,0,0,.3)", filter: weisserRand(6), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Img src={A("logo")} style={{ width: 520 }} />
          <div style={{ background: zine.schwarz, color: "#fff", fontFamily: "Barlow", fontWeight: 800, fontSize: 56, padding: "10px 34px" }}>@solleva.ch</div>
        </div>
      </Rein>
      <Rein f={f} start={z.ende + 10} art="slap" ox={540} oy={1330}>
        <div style={{ position: "absolute", left: 150, top: 1300, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 40, letterSpacing: "0.1em", padding: "10px 22px", transform: "rotate(2deg)" }}>HEB DICH VON DER MASSE AB.</div>
      </Rein>
    </AbsoluteFill>
  );
};

// ============================== Übergänge ==============================
type Typ = "zoom" | "riss" | "klappe" | "wischer" | "schnitt";
// Szene n beginnt bei grenze(n); Übergang ÜB[n] führt von Szene n-1 zu n.
const grenze = (n: number) => (n === 1 ? 0 : n === 2 ? Z(2).start : n === 6 ? Z(6).start : Z(n).start - 3);
const UEB: Record<number, { typ: Typ; d: number }> = {
  2: { typ: "zoom", d: 14 },
  3: { typ: "riss", d: 12 },
  4: { typ: "klappe", d: 12 },
  5: { typ: "wischer", d: 14 },
  6: { typ: "schnitt", d: 0 },
  7: { typ: "riss", d: 12 },
  8: { typ: "klappe", d: 12 },
  9: { typ: "wischer", d: 14 },
  10: { typ: "schnitt", d: 0 },
  11: { typ: "riss", d: 12 },
  12: { typ: "zoom", d: 14 },
  13: { typ: "klappe", d: 12 },
  14: { typ: "wischer", d: 14 },
};

const SZENEN: Record<number, React.FC<{ f: number }>> = {
  1: Szene1, 2: ({ f }) => (<AbsoluteFill><Szene2 f={f} /><PapierLage staerke={0.5} /></AbsoluteFill>),
  3: S3, 4: S4, 5: S5, 6: S6, 7: S7, 8: S8, 9: S9, 10: S10, 11: S11, 12: S12, 13: S13, 14: S14,
};

const Szene: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const C = SZENEN[n];
  const start = grenze(n);
  const ende = n === 14 ? REEL_DAUER : grenze(n + 1) + UEB[n + 1].d;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <KameraF f={f} start={start} dauer={ende - start} seed={n} rucke={n === 6 ? [Z(6).start + 2] : n === 8 ? [Z(8).m.wort] : n === 3 ? [Z(3).m.wort] : []}>
        <C f={f} />
      </KameraF>
      <Korn staerke={0.15} />
    </AbsoluteFill>
  );
};

const zoomRect = (n: number) => (n === 2 ? screenFrame() : laptopScreen());

const Uebergang: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const { typ, d } = UEB[n];
  const b = grenze(n);
  const p = tw(f, b, d, 0, 1, kurve.whip);
  const alt = <Szene n={n - 1} f={f} />;
  const neu = <Szene n={n} f={f} />;
  if (typ === "zoom") {
    const r0 = zoomRect(n);
    const cx = r0.x + r0.w / 2, cy = r0.y + r0.h / 2;
    const zMax = Math.max(1080 / r0.w, 1920 / r0.h) * 1.04;
    const z = 1 + (zMax - 1) * p;
    const dx = (540 - cx) * p, dy = (960 - cy) * p;
    const r = { x: 540 + (cx - 540) * (1 - p) - (r0.w * z) / 2, y: 960 + (cy - 960) * (1 - p) - (r0.h * z) / 2, w: r0.w * z, h: r0.h * z };
    const s2 = Math.max(r.w / 1080, r.h / 1920);
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `translate(${dx}px, ${dy}px) scale(${z})`, filter: `blur(${Math.sin(p * Math.PI) * 3}px)` }}>{alt}</AbsoluteFill>
        <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", borderRadius: 18 * (1 - p) * z }}>
          <div style={{ position: "absolute", left: (r.w - 1080 * s2) / 2, top: (r.h - 1920 * s2) / 2, width: 1080, height: 1920, transform: `scale(${s2})`, transformOrigin: "0 0" }}>{neu}</div>
        </div>
      </AbsoluteFill>
    );
  }
  if (typ === "riss") {
    // Alte Szene wird von rechts nach links weggerissen, mit weissem Papierrand an der Kante.
    const L = 1180 - p * 1360;
    const zack = (y: number) => Math.sin(y * 0.031 + n) * 18 + Math.sin(y * 0.11 + n * 3) * 9;
    const pts: string[] = [];
    for (let y = 0; y <= 1920; y += 40) pts.push(`${L + zack(y)}px ${y}px`);
    const poly = `polygon(0 0, ${pts.join(", ")}, 0 1920px)`;
    const randPts: string[] = [];
    for (let y = 0; y <= 1920; y += 40) randPts.push(`${L + zack(y) - 4}px ${y}px`);
    for (let y = 1920; y >= 0; y -= 40) randPts.push(`${L + zack(y) + 22 + Math.sin(y * 0.2) * 6}px ${y}px`);
    return (
      <AbsoluteFill>
        {neu}
        <AbsoluteFill style={{ clipPath: poly, filter: "drop-shadow(12px 0 10px rgba(0,0,0,.35))" }}>{alt}</AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `polygon(${randPts.join(", ")})`, background: "#F4EFE4" }} />
      </AbsoluteFill>
    );
  }
  if (typ === "klappe") {
    return (
      <AbsoluteFill style={{ perspective: 2200 }}>
        <AbsoluteFill style={{ filter: `brightness(${1 - 0.5 * p})` }}>{alt}</AbsoluteFill>
        <AbsoluteFill style={{ transformOrigin: "0 50%", transform: `rotateY(${(1 - p) * 95}deg)`, boxShadow: `0 0 80px rgba(0,0,0,${0.6 * (1 - p)})` }}>{neu}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (typ === "wischer") {
    // Grosses Papierblatt fährt von unten nach oben durchs Bild; in der Mitte wechselt die Szene.
    const lin = tw(f, b, d, 0, 1, kurve.heavy);
    const y = 1980 - lin * 4300;
    return (
      <AbsoluteFill>
        {lin < 0.5 ? alt : neu}
        <div style={{ position: "absolute", left: -60, top: y, width: 1200, height: 2300, transform: "rotate(-4deg)", filter: "drop-shadow(0 -14px 16px rgba(0,0,0,.35)) drop-shadow(0 14px 16px rgba(0,0,0,.35))" }}>
          <div style={{ width: "100%", height: "100%", clipPath: rissPfad(1200, 2300, n, 40), background: "#F1EADB" }}>
            <Img src={A("papier")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return neu;
};

// ============================== Komposition ==============================
export const Reel: React.FC = () => {
  const f = useCurrentFrame();
  let aktiv = 1;
  for (let n = 1; n <= 14; n++) if (f >= grenze(n)) aktiv = n;
  const ueb = aktiv > 1 ? UEB[aktiv] : undefined;
  const imUebergang = ueb && ueb.d > 0 && f < grenze(aktiv) + ueb.d;
  return (
    <AbsoluteFill style={{ background: zine.schwarz }}>
      <ZineSchriften />
      {imUebergang ? <Uebergang n={aktiv} f={f} /> : <Szene n={aktiv} f={f} />}

      {/* Stimme: jeder Satz als eigene Datei */}
      {SAETZE.map((s) => (
        <Sequence key={s.nr} from={s.start} layout="none">
          <Audio src={staticFile(`reels/spielautomat/stimme/${s.datei}`)} />
        </Sequence>
      ))}
      <Toene />
    </AbsoluteFill>
  );
};

// ============================== Sounds ==============================
// Swish/Whoosh 1–3 Frames VOR der Bewegung, Klick/Schlag exakt auf Landung. Nie zwei wichtige gleichzeitig.
const Toene: React.FC = () => {
  const z = Z;
  const T: React.ReactNode[] = [];
  const t = (nr: string, bei: number, vol: number, vor = 0, max?: number) => T.push(<Ton key={`${nr}-${bei}-${T.length}`} nr={nr} bei={bei} vol={vol} vor={vor} max={max} />);
  // 1 Hook (wie Stiltest)
  t("swish-04", 8, 0.32, 2);
  t("papier-02", z(1).start, 0.3);
  t("papier-02", z(1).m.zeile2, 0.3);
  for (let i = 0; i < 5; i++) t("klick-04", z(1).m.wort + i * 2, 0.22);
  for (let i = 0; i < 9; i += 2) t("klick-04", z(1).m.wort + 10 + i * 2, 0.22);
  t("ratsche-09", 70, 0.3, 0, 1.7);
  t("klick-02", 100, 0.3);
  t("klick-02", 111, 0.3);
  t("schlag-07", 124, 0.45);
  // 2
  t("whoosh-02", grenze(2) + 6, 0.38, 2);
  t("papier-01", 159, 0.32);
  t("ratsche-10", 177, 0.2, 0, 1.0);
  t("schlag-03", z(2).m.wort, 0.45);
  // 3
  t("papier-04", grenze(3) + 4, 0.3, 2);
  t("papier-02", z(3).m.niete, 0.28);
  t("klick-02", z(3).m.niete + 8, 0.3);
  t("klick-02", z(3).m.aber - 6, 0.3);
  t("schlag-01", z(3).m.wort, 0.5);
  t("glitzer-03", z(3).m.wort + 3, 0.3);
  // 4
  t("swish-06", grenze(4) + 4, 0.3, 2);
  t("swish-02", z(4).m.gehirn - 2, 0.3, 2);
  t("schlag-01", z(4).m.wort, 0.45);
  t("pop-01", z(4).m.wort + 6, 0.2);
  t("pop-01", z(4).m.wort + 12, 0.18);
  t("klick-01", z(4).m.wort + 14, 0.25);
  // 5
  t("whoosh-01", grenze(5) + 5, 0.32, 2);
  t("schreiben-01", z(5).start + 2, 0.3, 0, 1.6);
  t("swish-04", z(5).start + 12, 0.28, 2);
  t("pop-03", z(5).m.wort, 0.32);
  // 6 Bruch
  t("schlag-02", z(6).start + 1, 0.55);
  t("schlag-07", z(6).start + 8, 0.3);
  t("papier-02", z(6).m.heisst, 0.26);
  t("schreiben-02", z(6).m.mehr, 0.3, 0, 1.1);
  // 7
  t("papier-04", grenze(7) + 4, 0.3, 2);
  t("swish-03", z(7).start + 6, 0.28, 2);
  t("klick-05", z(7).start, 0.25);
  t("klick-05", z(7).m.zeile2, 0.25);
  t("schlag-07", z(7).m.wort, 0.45);
  // 8
  t("swish-06", grenze(8) + 4, 0.3, 2);
  t("papier-05", z(8).start + 6, 0.3, 0, 0.9);
  t("swish-01", z(8).start + 8, 0.25, 2);
  t("klick-02", z(8).m.zeile2, 0.28);
  t("schlag-04", z(8).m.wort, 0.5);
  // 9
  t("whoosh-01", grenze(9) + 5, 0.32, 2);
  t("pop-02", z(9).start + 3, 0.28);
  t("ratsche-07", z(9).start + 12, 0.14, 0, 1.4);
  t("schlag-03", z(9).m.wort, 0.42);
  // 10
  t("downlifter-01", grenze(10), 0.2, 0, 1.0);
  t("klick-05", z(10).start + 3, 0.22);
  [z(10).m.weiter1, z(10).m.weiter1 + 6, z(10).m.und, z(10).m.und + 5, z(10).m.wort].forEach((s) => t("klick-02", s, 0.26));
  [z(10).m.weiter1 + 14, z(10).m.und - 10].forEach((s) => t("papier-02", s + 2, 0.26));
  t("schlag-07", z(10).m.wort + 9, 0.4);
  // 11
  t("papier-04", grenze(11) + 4, 0.3, 2);
  t("papier-01", z(11).start + 8, 0.28);
  t("swish-04", z(11).start + 6, 0.25, 2);
  t("ratsche-19", z(11).start + 14, 0.14, 0, 1.4);
  t("schreiben-01", z(11).m.wort, 0.28, 0, 0.5);
  // 12
  t("whoosh-02", grenze(12) + 6, 0.38, 2);
  t("pop-02", z(12).start + 2, 0.26);
  t("schlag-01", z(12).m.wort, 0.5);
  t("swish-02", z(12).m.wort + 2, 0.22);
  t("klick-04", z(12).m.wort + 16, 0.22);
  t("pop-01", z(12).m.weiter, 0.22);
  t("schlag-07", z(12).m.stopp, 0.45);
  // 13
  t("swish-06", grenze(13) + 4, 0.3, 2);
  t("swish-03", z(13).start + 6, 0.25, 2);
  t("schlag-07", z(13).start + 17, 0.3);
  t("papier-02", z(13).m.niete, 0.24);
  t("schreiben-02", z(13).m.oder, 0.26, 0, 0.7);
  t("schlag-01", z(13).m.wort, 0.45);
  t("glitzer-01", z(13).m.wort + 2, 0.3);
  // 14 CTA
  t("whoosh-01", grenze(14) + 5, 0.32, 2);
  for (let i = 0; i < 5; i++) t("klick-04", z(14).start + i * 3, 0.24);
  for (let i = 0; i < 8; i += 2) t("klick-04", z(14).m.mehr + i * 2, 0.24);
  t("schlag-05", z(14).ende - 4, 0.5);
  t("papier-02", z(14).ende + 10, 0.26);
  return <>{T}</>;
};
