// Reel 04 v7: neuer Hook (Szene 1, 1,8 s) + v6 ab Szene 2 unverändert, um V7.VERSATZ Frames nach vorne gerückt.
// - Hook-Text steht ab Frame 0 voll da (kein Einblenden), Klappe offen → schlägt bei 0,3 s zu, Shake 4 Frames.
// - Danach harter Schnitt in «Kamera. Licht. Schnitt.» (dort schreibt sich zuerst «Früher …» ein).
// - Bild, Stimme, Sounds und Musik ab Szene 2 laufen im verschobenen R04Reel weiter (Sequence mit negativem from).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { kurve } from "../../lib/bewegung";
import { gleitKamera, halbeKamera } from "../../lib/gleitKamera";
import { Ton } from "../../lib/kamera";
import { Koernung, TiltShift } from "./Look";
import { R04Reel, REEL04_DAUER, V7_ALT_START } from "./Reel04";
import { STIMME_SEGMENTE } from "./timeline";
import { Schatten, Staub, Welt, Zeile3D } from "./Stiltest";

export const V7 = {
  HOOK_DAUER: 54, // Szene 1 = 1,8 s
  IMPACT: 9, // Klappe schlägt bei 0,3 s zu
  VERSATZ: V7_ALT_START - 54, // = 28: alles nach dem Hook rückt so viele Frames nach vorne
};
export const REEL04_V7_DAUER = REEL04_DAUER - V7.VERSATZ;
/** Frame (v7), an dem Satz 2 der Stimme beginnt: bis dahin darf die Hook-Stimme laufen. */
const SATZ2_V7 = (STIMME_SEGMENTE.find((s) => s.satz === 2)?.reel ?? 90) - V7.VERSATZ;

/** Hook-Dateien (Platzhalter, werden 1:1 ersetzt). Knall der Klappe am Dateianfang; liegt er später, KLAPPE_HIT_SEK anpassen. */
export const HOOK_TON = { stimme: "r04/hook-voice.mp3", klappe: "r04/klappe-klack.mp3", KLAPPE_HIT_SEK: 0.02 };

/** Hook-Text: 2 Zeilen, gleiche Schrift und gleicher Stil wie «FILMCREW» in v6 (Archivo 900, 118 %, violetter 3D-Schatten). */
export const HOOK_ZEILEN = [
  { text: "DIESES VIDEO HAT KEINE", groesse: 50, top: 300 },
  { text: "FILMCREW GEMACHT.", groesse: 57, top: 356 },
];

const kameraHook = () => ({
  start: 0,
  ende: V7.HOOK_DAUER,
  fahrten: [
    { f: V7.IMPACT, dauer: 18, zoom: 1.06, y: 10, notiz: "Akzent rein: Klappe schlägt zu", optional: true },
    { f: V7.HOOK_DAUER - 10, dauer: 20, zoom: 1.45, y: 60, dreh: -1, notiz: "Push durch den Schnitt (Mitte = Schnitt)" },
  ],
});

// Stab: negativ = offen, 11,5 = zu (wie v6).
const OFFEN = -20;
const ZU = 11.5;
const AUSHOLEN = 5; // bis hier öffnet sich die Klappe noch etwas weiter (steht nie still)
export const stabWinkel = (t: number) => {
  if (t < AUSHOLEN) return OFFEN - 3 * kurve.land(Math.max(0, t) / AUSHOLEN);
  if (t < V7.IMPACT) {
    const p = (t - AUSHOLEN) / (V7.IMPACT - AUSHOLEN);
    return OFFEN - 3 + (ZU - OFFEN + 3) * p * p * p; // beschleunigt bis zum Aufprall
  }
  const n = t - V7.IMPACT;
  return ZU + 2 * Math.exp(-n / 2.5) * Math.cos(n * 1.25); // kurzer Overshoot, kleiner Rückprall, ruhig
};

/** Shake beim Aufprall: 4 Frames, 2–3 px. */
const SHAKE: [number, number][] = [[3, -2], [-2, 2], [2, -1], [-1, 1]];

export const HookSzene: React.FC<{ f: number }> = ({ f }) => {
  const kam = gleitKamera(f, kameraHook());
  const n = f - V7.IMPACT;
  const sh = n >= 0 && n < SHAKE.length ? SHAKE[n] : [0, 0];
  const brett = n >= 0 ? 1 + 0.035 * Math.exp(-n / 3) * Math.cos(n / 1.5) : 1;
  // Bewegungsunschärfe nur für den Stab in der Schlagbewegung (Sub-Frames gemittelt)
  const proben = f > AUSHOLEN && f <= V7.IMPACT ? 4 : 1;
  const KL_W = 640;
  const textBlur = f >= V7.HOOK_DAUER - 10 ? kam.blur / 2 : 0;
  return (
    <AbsoluteFill style={{ background: "#2a1d14", transform: `translate(${sh[0]}px, ${sh[1]}px)` }}>
      <AbsoluteFill style={{ transform: kam.css, transformOrigin: "50% 40%", filter: `blur(${kam.blur}px)` }}>
        <Welt src="r04/welt-samt-b.png" breite={1100} />
        {/* violette Matte nur angedeutet (Ecke unten links), wie v6 */}
        <div style={{ position: "absolute", left: -420, top: 1290, width: 900, height: 900, transform: "rotate(-12deg)", filter: "drop-shadow(18px 26px 22px rgba(8,2,30,.75))" }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 18, filter: "brightness(.5) saturate(.9)" }}>
            <Img src={staticFile("r04/welt-matte-a.png")} style={{ width: 1300, marginLeft: -200, marginTop: -400 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(35deg, rgba(10,4,30,.75) 10%, transparent 70%)" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 540 - KL_W / 2, top: 900 - KL_W / 2, width: KL_W, height: KL_W, transform: `scale(${brett}) rotate(-6deg)`, filter: Schatten(1) }}>
          <Img src={staticFile("r04/obj-klappe-brett.png")} style={{ position: "absolute", width: "100%" }} />
          {Array.from({ length: proben }, (_, i) => (
            <Img
              key={i}
              src={staticFile("r04/obj-klappe-stab.png")}
              style={{ position: "absolute", width: "100%", opacity: 1 / (i + 1), transformOrigin: `${(90 / 1024) * 100}% ${(258 / 1024) * 100}%`, transform: `rotate(${stabWinkel(f - (0.7 * i) / Math.max(1, proben - 1))}deg)` }}
            />
          ))}
        </div>
        <Staub f={f} start={V7.IMPACT} x={760} y={710} />
      </AbsoluteFill>
      <TiltShift blur={10} fokus={50} />
      <AbsoluteFill style={{ transform: halbeKamera(kam), transformOrigin: "50% 40%", filter: textBlur ? `blur(${textBlur}px)` : undefined }}>
        {HOOK_ZEILEN.map((z) => (
          <Zeile3D key={z.text} text={z.text} start={-60} top={z.top} groesse={z.groesse} f={f} pA="#B9A6F5" pB="#2A1670" links={95} rechts={180} />
        ))}
      </AbsoluteFill>
      <Koernung staerke={0.1} seed={Math.floor(f / 2) % 8} />
    </AbsoluteFill>
  );
};

export const R04ReelV7: React.FC<{ musik?: boolean }> = ({ musik = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* v6 ab Szene 2: Bild, Stimme, Sounds, Musik und Figur-Clips bleiben untereinander synchron */}
      <Sequence from={-V7.VERSATZ}>
        <R04Reel v7 musik={musik} />
      </Sequence>
      {f < V7.HOOK_DAUER && <HookSzene f={f} />}
      {/* Hook-Ton: Stimme ab Frame 0 (bis Satz 2 einsetzt), Klappe auf den Aufprall */}
      <Sequence from={0} durationInFrames={SATZ2_V7} layout="none">
        <Audio src={staticFile(HOOK_TON.stimme)} />
      </Sequence>
      <Sequence from={V7.IMPACT} durationInFrames={30} layout="none">
        <Audio src={staticFile(HOOK_TON.klappe)} startFrom={Math.floor(HOOK_TON.KLAPPE_HIT_SEK * 30)} volume={0.95} />
      </Sequence>
      <Ton nr="neu-kick-drum-vintage-3" bei={V7.IMPACT} vol={0.35} />
    </AbsoluteFill>
  );
};
