import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Schriften } from "../../components/Basis";
import { Kamera, Ton } from "../../lib/kamera";
import { kurve, tw } from "../../lib/bewegung";
import { schrift } from "../../brand/solleva";

// Stiltest Hook «Ein Zwanzigstel Sekunde»: Auge → Zähler → Blinzeln → Zoom durch die Pupille → Szene 2 (Platzhalter)
const C = { lilac: "#A98BFF", violet: "#6C3FD4", cyan: "#8FE3FF", text: "#F1F2F7" };
const PUPILLE = { x: 556, y: 919 }; // Pupillenmitte im 1080×1920-Bild
const ZOOM = 14;
export const STILTEST_DAUER = 225;

// ---------- 7-Segment-Anzeige ----------
const W = 120, H = 220, T = 24, G = 4;
const hor = (y0: number) => `${G + T / 2},${y0 + T / 2} ${G + T},${y0} ${W - G - T},${y0} ${W - G - T / 2},${y0 + T / 2} ${W - G - T},${y0 + T} ${G + T},${y0 + T}`;
const ver = (x0: number, ys: number, ye: number) => `${x0 + T / 2},${ys + G} ${x0 + T},${ys + G + T / 2} ${x0 + T},${ye - G - T / 2} ${x0 + T / 2},${ye - G} ${x0},${ye - G - T / 2} ${x0},${ys + G + T / 2}`;
const SEG: Record<string, string> = {
  a: hor(0), g: hor(H / 2 - T / 2), d: hor(H - T),
  f: ver(0, T / 2, H / 2), b: ver(W - T, T / 2, H / 2), e: ver(0, H / 2, H - T / 2), c: ver(W - T, H / 2, H - T / 2),
};
const DIGITS: Record<number, string> = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg" };
const Ziffer: React.FC<{ n: number; hell: number }> = ({ n, hell }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
    {Object.entries(SEG).map(([k, p]) => {
      const an = DIGITS[n].includes(k);
      return <polygon key={k} points={p} fill={an ? "#EFE9FF" : "#ffffff10"} style={an ? { filter: `drop-shadow(0 0 ${14 * hell}px ${C.lilac}) drop-shadow(0 0 ${34 * hell}px ${C.violet})` } : undefined} />;
    })}
  </svg>
);

const Zaehler: React.FC = () => {
  const f = useCurrentFrame();
  const letzte = f < 4 ? 0 : Math.min(5, Math.floor((f - 4) / 3) + 1) - 0;
  const wert = f < 4 ? 0 : Math.min(5, Math.floor((f - 4) / 3));
  void letzte;
  const einblend = tw(f, 0, 8, 0, 1, kurve.land);
  const hell = 1 + 0.5 * Math.max(0, 1 - Math.abs(f - 19) / 6) + 0.6 * Math.max(0, 1 - Math.abs(f - 132) / 6);
  return (
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", opacity: einblend }}>
      <div style={{ font: `500 28px "${schrift.mono}"`, letterSpacing: 8, color: C.lilac, marginBottom: 26 }}>50 MILLISEKUNDEN</div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 22, transform: "skewX(-7deg)" }}>
        <Ziffer n={0} hell={hell} />
        <div style={{ width: 26, height: 26, borderRadius: 4, background: "#EFE9FF", marginBottom: 6, boxShadow: `0 0 20px ${C.lilac}` }} />
        <Ziffer n={0} hell={hell} />
        <Ziffer n={wert} hell={hell} />
        <div style={{ fontFamily: `"${schrift.serif}"`, fontStyle: "italic", fontSize: 180, color: C.lilac, lineHeight: 1, marginLeft: 10, transform: "skewX(7deg)" }}>s</div>
      </div>
    </div>
  );
};

// ---------- Lider ----------
const Lider: React.FC<{ f: number }> = ({ f }) => {
  const zu = tw(f, 128, 6, 0, 1, kurve.whip) - tw(f, 137, 8, 0, 1, kurve.land);
  const oben = 380 + (930 - 380) * zu;
  const unten = 1500 - (1500 - 930) * zu;
  const haut = "linear-gradient(to bottom, transparent 0%, transparent 48%, #1c1018 80%, #07040a 100%)";
  const hautU = "linear-gradient(to top, transparent 0%, transparent 48%, #1c1018 80%, #07040a 100%)";
  return (
    <>
      <div style={{ position: "absolute", left: -60, right: -60, height: 1000, top: oben - 1000, background: haut, borderBottomLeftRadius: "50% 90px", borderBottomRightRadius: "50% 90px" }} />
      <div style={{ position: "absolute", left: -60, right: -60, height: 1000, top: unten, background: hautU, borderTopLeftRadius: "50% 90px", borderTopRightRadius: "50% 90px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 928, height: 4, background: `linear-gradient(90deg, transparent, ${C.lilac}88, transparent)`, opacity: zu > 0.9 ? 1 : 0 }} />
    </>
  );
};

// ---------- Szene 2 (Platzhalter: Welt Gerichtssaal, Protokoll-Streifen, alte Seite) ----------
const ZEILEN = ["SO SCHNELL URTEILT MAN", "ÜBER DEINE WEBSITE."];
const Szene2: React.FC = () => {
  const f = useCurrentFrame();
  const typ = Math.max(0, Math.floor((f - 14) * 1.6));
  const z1 = ZEILEN[0].slice(0, typ);
  const z2 = ZEILEN[1].slice(0, Math.max(0, typ - ZEILEN[0].length));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 40%, #5a3a22 0%, #24140c 55%, #0a0605 100%)" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #00000022 0 3px, transparent 3px 46px)", opacity: .6 }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 420, background: "#efe9db", padding: "34px 40px", transform: "rotate(-1.5deg)", boxShadow: "0 24px 60px #000a" }}>
        <div style={{ font: `700 58px "${schrift.mono}"`, color: "#1b1410", letterSpacing: 1, lineHeight: 1.3, minHeight: 150 }}>
          {z1}<br />{z2}<span style={{ opacity: f % 10 < 5 ? 1 : 0 }}>▌</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 250, top: 880, width: 580, height: 560, background: "#d9d5c6", border: "3px solid #777", boxShadow: "0 40px 90px #000c", fontFamily: "Times New Roman, serif", color: "#222", overflow: "hidden" }}>
        <div style={{ background: "#1c3f95", color: "#fff", padding: "12px 16px", fontSize: 28, fontWeight: 700 }}>Herzlich Willkommen!</div>
        <div style={{ padding: 16, fontSize: 22, lineHeight: 1.4 }}><span style={{ color: "#a30000", fontWeight: 700 }}>Neu: Jetzt mit Gästebuch!!</span><br />Besucher seit 2012: 000412</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", font: `500 22px "${schrift.mono}"`, color: "#ffffff77" }}>PLATZHALTER · Richterhammer folgt (Higgsfield)</div>
    </AbsoluteFill>
  );
};

export const StiltestHook: React.FC<{ mitStimme?: boolean }> = ({ mitStimme = false }) => {
  const f = useCurrentFrame();
  const p = tw(f, 150, 22, 0, 1, kurve.heavy); // Zoom-Through-Fortschritt
  const skala = Math.exp(Math.log(ZOOM) * p);
  const unschaerfe = 14 * Math.sin(Math.PI * Math.min(1, p));
  const zaehlerAus = 1 - tw(f, 148, 6, 0, 1, kurve.raus);
  const szene2 = tw(f, 164, 10, 0, 1, kurve.fade);
  const flackern = 1 + Math.sin(f * 2.3) * 0.012;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Schriften />
      <Sequence durationInFrames={176}>
        <Kamera dauer={150} push={0.06} drift={5} dreh={0.4}>
          <AbsoluteFill style={{ transformOrigin: `${PUPILLE.x}px ${PUPILLE.y}px`, transform: `scale(${skala})`, filter: `blur(${unschaerfe}px)` }}>
            <Img src={staticFile("assets/website-sekunde/auge.png")} style={{ width: 1080, height: 1920, filter: `brightness(${flackern})` }} />
            <Lider f={f} />
            <div style={{ opacity: zaehlerAus }}><Zaehler /></div>
          </AbsoluteFill>
        </Kamera>
      </Sequence>
      <Sequence from={160}>
        <AbsoluteFill style={{ opacity: szene2 }}>
          <Kamera dauer={70} push={0.05} drift={5} dreh={0.3} seed={3}><Szene2 /></Kamera>
        </AbsoluteFill>
      </Sequence>
      {/* Vignette + Korn über allem */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 55%, #000000aa 100%)", pointerEvents: "none" }} />
      {/* Ton: Zähler ratscht, Auslöser beim Blinzeln, Luft-Whoosh beim Zoom, Schreibmaschine in Szene 2 */}
      <Ton nr="ratsche-19" bei={4} vol={0.3} max={0.7} />
      <Ton nr="klick-05" bei={130} vol={0.45} />
      <Ton nr="whoosh-03" bei={166} vol={0.5} vor={0} />
      {[178, 184, 189, 195, 200, 206].map((b) => <Ton key={b} nr="klick-04" bei={b} vol={0.22} />)}
      {mitStimme && (
        <>
          <Sequence from={6}><Audio src={staticFile("assets/website-sekunde/voice/s1.mp3")} /></Sequence>
          <Sequence from={84}><Audio src={staticFile("assets/website-sekunde/voice/s2.mp3")} /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
