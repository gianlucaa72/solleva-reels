// Reel 05 Stiltest: Szene 1 komplett (Auge, LCD-Zähler, Blinzeln auf «Wimpernschlag»,
// Zoom-Through in die Pupille) + Ankunft in Szene 2 bis «gefällt».
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Schriften } from "../../components/Basis";
import { Bewegungsunschaerfe, Cam, Ebene, Filmlook, MITTE, Rechteck, drift, zoomInFenster } from "../../kamera/welt";
import { kurve, tw } from "../../lib/bewegung";
import { Ton } from "../../lib/kamera";
import { ALT, AlteSeite, asset, Lcd, schriftR05, web } from "./Look";
import { Stimme, satzStart, wf, woerter } from "./timeline";

// ---------- Zeiten ----------
const F_ZAEHLER = wf(1, "fuenfzig"); // Zähler startet mit dem ersten Wort
const F_ZAEHLER_ENDE = wf(1, "millisekunden") + 16; // 0,050 rastet ein
const F_WIMPERN = wf(2, "wimpernschlag");
const F_LID_ZU = F_WIMPERN + 13; // «-schlag»: Lid ganz zu
const VIDEO_FPS = 24;
const LID_ZU_VIDEO = 34.5 / VIDEO_FPS; // Lid zu im Kling-Clip (Bild 34–35)
const F_VIDEO_START = Math.round(F_LID_ZU - LID_ZU_VIDEO * 30);
const F_ZOOM = F_WIMPERN + 27; // nach dem Wort: Fahrt in die Pupille
const ZOOM_DAUER = 21; // 0,7 s
const F_S2 = F_ZOOM + ZOOM_DAUER; // unsichtbarer Wechsel
export const STILTEST_R05_DAUER = wf(3, "gefaellt") + 40;

// Pupille im Augenbild (gemessen: Mitte 557/902, Radius ≈ 90)
const PUPILLE = { x: 557, y: 902, r: 92 };
const FENSTER: Rechteck = { x: PUPILLE.x - 36, y: PUPILLE.y - 64, w: 72, h: 128 };

// ---------- Hilfen ----------
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
/** Wort steigt auf (0,5 em), Blur 12 → 0, ease-out-expo. */
const WortEin: React.FC<{ f: number; ab: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, ab, children, style }) => {
  const t = Math.max(0, Math.min(1, (f - ab + 2) / 24));
  const e = expoOut(t);
  const o = Math.min(1, Math.max(0, (f - ab + 2) / 6));
  return (
    <span style={{ display: "inline-block", opacity: o, transform: `translateY(${(1 - e) * 0.5}em)`, filter: e < 0.99 ? `blur(${(1 - e) * 12}px)` : undefined, ...style }}>
      {children}
    </span>
  );
};

// ---------- Szene 1: Auge ----------
const blinzelBild = (f: number) => {
  const idx = Math.max(1, Math.min(73, Math.floor(((f - F_VIDEO_START) / 30) * VIDEO_FPS) + 1));
  return asset(`blinzeln/b${String(idx).padStart(3, "0")}.jpg`);
};

const lcdText = (f: number) => {
  const p = tw(f, F_ZAEHLER, F_ZAEHLER_ENDE - F_ZAEHLER, 0, 1, kurve.land);
  const ms = Math.round(p * 50);
  return `0,0${String(ms).padStart(2, "0")}`;
};

const Szene1Text: React.FC<{ f: number }> = ({ f }) => {
  const raus = tw(f, F_ZOOM - 2, 8, 1, 0, kurve.raus);
  const einrast = f >= F_ZAEHLER_ENDE ? tw(f, F_ZAEHLER_ENDE, 10, 1.06, 1, kurve.land) : 1;
  const glanz = f >= F_ZAEHLER_ENDE ? tw(f, F_ZAEHLER_ENDE, 14, 1, 0, kurve.fade) : 0;
  const puls = f >= F_ZAEHLER ? tw(f, F_ZAEHLER, 12, 1.035, 1, kurve.land) : 1;
  const s2 = woerter(2);
  return (
    <AbsoluteFill style={{ opacity: raus }}>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${einrast})`, filter: glanz ? `drop-shadow(0 0 ${30 * glanz}px ${web.cyan})` : undefined }}>
        <Lcd text={`${lcdText(f)}s`} h={170} />
      </div>
      <div style={{ position: "absolute", top: 1240, left: 95, width: 805, textAlign: "center", fontFamily: schriftR05.serif, fontSize: 112, lineHeight: 1.04, color: web.text, textShadow: "0 4px 24px rgba(4,5,12,.8)", transform: `scale(${puls})` }}>
        50 <span style={{ fontStyle: "italic", color: web.lilac }}>Millisekunden.</span>
      </div>
      <div style={{ position: "absolute", top: 1390, left: 95, width: 805, textAlign: "center", fontFamily: schriftR05.text, fontWeight: 500, fontSize: 50, color: web.muted }}>
        {s2.map((w, i) => (
          <React.Fragment key={i}>
            <WortEin f={f} ab={w.f} style={w.n === "wimpernschlag" ? { color: web.text } : undefined}>{w.w}{i === s2.length - 1 ? "." : ""}</WortEin>{" "}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Szene 2: Nebel + alte Seite (wird auch klein in der Pupille gezeigt) ----------
const S2_START = satzStart(3);
const Szene2Welt: React.FC<{ f: number }> = ({ f }) => {
  // Fahrt um die Seite: beginnt mit der Ankunft, läuft ruhig weiter
  const orbit = tw(f, F_S2 - 10, 90, -34, -16, kurve.heavy);
  const schweben = Math.sin((f - F_S2) / 26) * 6 + Math.sin((f - F_S2) / 41) * 4;
  return (
    <AbsoluteFill>
      {/* Nebel 1:1 im Bild, ringsum gespiegelt fortgesetzt: der Pupillenkreis zeigt während der Fahrt nie Leerfläche */}
      <AbsoluteFill style={{ transform: `scale(${1 + Math.max(0, f - F_S2) * 0.0005})` }}>
        {[-1, 0, 1].flatMap((ix) => [-1, 0, 1].map((iy) => (
          <Img key={`${ix}${iy}`} src={asset("higgsfield/nebel-a.png")} style={{ position: "absolute", left: ix * 1080, top: iy * 1920, width: 1080, height: 1920, transform: `scale(${ix ? -1 : 1}, ${iy ? -1 : 1})` }} />
        )))}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - ALT.w / 2, top: 1090 - ALT.h / 2 + schweben, width: ALT.w, height: ALT.h, perspective: 1600, transform: "scale(0.92)" }}>
        <div style={{ transform: `rotateY(${orbit}deg) rotateX(6deg) rotateZ(-2deg)`, boxShadow: "0 50px 120px rgba(108,63,212,.55)" }}>
          <AlteSeite />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Szene2Text: React.FC<{ f: number }> = ({ f }) => {
  const ws = woerter(3);
  const fG = wf(3, "gefaellt");
  return (
    <div style={{ position: "absolute", top: 300, left: 95, width: 805, textAlign: "center", fontFamily: schriftR05.serif, fontSize: 84, lineHeight: 1.06, color: web.text, textShadow: "0 4px 24px rgba(4,5,12,.8)" }}>
      {ws.map((w, i) => {
        const schluessel = w.n === "gefaellt";
        const glow = schluessel && f >= fG ? tw(f, fG, 18, 1, 0.35, kurve.fade) : 0;
        return (
          <React.Fragment key={i}>
            <WortEin f={f} ab={w.f} style={schluessel ? { fontStyle: "italic", color: web.lilac, textShadow: `0 0 ${40 * glow}px ${web.lilac}` } : undefined}>
              {w.w}{w.n === "du" ? "," : ""}{i === ws.length - 1 ? "." : ""}
            </WortEin>{" "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- Kamera ----------
const kameraS1 = (f: number): Cam => {
  const d = drift(f, 0, F_ZOOM, 2);
  // Kamera-Stoss auf «Wimpernschlag» (3 %, Heavy, 15 Frames)
  const stoss = 1 + tw(f, F_WIMPERN - 2, 15, 0, 0.03, kurve.heavy);
  // leichte Fahrt zur Pupille hin, damit der Zoom aus der Bewegung kommt
  const hin = tw(f, F_WIMPERN - 2, 26, 0, 1, kurve.heavy);
  return { s: d.s * stoss, cx: d.cx + (PUPILLE.x - MITTE.x) * 0.25 * hin, cy: d.cy + (PUPILLE.y - MITTE.y) * 0.25 * hin };
};
const kamera = (f: number): Cam => {
  if (f < F_ZOOM) return kameraS1(f);
  return zoomInFenster(kameraS1(F_ZOOM), FENSTER, (f - F_ZOOM) / ZOOM_DAUER);
};
const kameraS2 = (f: number): Cam => {
  // nach dem Wechsel: weiterer langsamer Push (Richtung der Fahrt bleibt), Stoss auf «gefällt»
  const push = 1 + 0.035 * Math.min(1, (f - F_S2) / 90);
  const stoss = 1 + tw(f, wf(3, "gefaellt") - 2, 15, 0, 0.03, kurve.heavy);
  return { s: push * stoss, cx: MITTE.x + Math.sin((f - F_S2) / 50) * 3, cy: MITTE.y };
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  if (f >= F_S2) {
    const cam = kameraS2(f);
    return (
      <AbsoluteFill style={{ background: web.ink }}>
        <Ebene cam={cam} tiefe={1}><Szene2Welt f={f} /></Ebene>
        <Ebene cam={cam} tiefe={1.1}><Szene2Text f={f} /></Ebene>
      </AbsoluteFill>
    );
  }
  const cam = kamera(f);
  const k = 1080 / FENSTER.w;
  // Die Spiegelung in der Pupille wird mit der Fahrt sichtbar
  const sicht = f < F_ZOOM ? 0 : tw(f, F_ZOOM, ZOOM_DAUER * 0.55, 0, 1, kurve.fade);
  const R = PUPILLE.r;
  return (
    <AbsoluteFill style={{ background: web.ink }}>
      <Ebene cam={cam} tiefe={1}>
        <Img src={blinzelBild(f)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />
        {sicht > 0 && (
          <div style={{ position: "absolute", left: PUPILLE.x - R, top: PUPILLE.y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", opacity: sicht, WebkitMaskImage: "radial-gradient(circle, #000 80%, transparent 100%)", maskImage: "radial-gradient(circle, #000 80%, transparent 100%)" }}>
            <div style={{ position: "absolute", left: FENSTER.x - (PUPILLE.x - R), top: FENSTER.y - (PUPILLE.y - R), width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${1 / k})` }}>
              <Szene2Welt f={f} />
            </div>
          </div>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={1.1}><Szene1Text f={f} /></Ebene>
    </AbsoluteFill>
  );
};

const tempo = (f: number) => {
  const a = f < F_S2 ? kamera(f - 0.5) : kameraS2(f - 0.5);
  const b = f < F_S2 ? kamera(f + 0.5) : kameraS2(f + 0.5);
  return Math.abs(Math.log(b.s / a.s));
};

export const R05Stiltest: React.FC = () => {
  const f = useCurrentFrame();
  // Bewegungsunschärfe nur innerhalb einer Szene mitteln (nicht über den Wechsel hinweg)
  return (
    <AbsoluteFill style={{ background: web.ink }}>
      <Schriften />
      <Bewegungsunschaerfe f={f} tempo={f >= F_S2 && f < F_S2 + 1 ? 0 : tempo(f)} render={(x) => <Welt f={f < F_S2 ? Math.min(x, F_S2 - 0.001) : Math.max(x, F_S2)} />} />
      <Filmlook />
      {/* Ton */}
      <Stimme bis={STILTEST_R05_DAUER} />
      <Ton nr="ratsche-19" bei={F_ZAEHLER} ab={0} max={(F_ZAEHLER_ENDE - F_ZAEHLER) / 30 + 0.15} vol={0.22} />
      <Ton nr="neu-vintage-camera-shutt-1" bei={F_LID_ZU} vol={0.5} />
      <Ton nr="neu-slow-bass-woosh" bei={F_ZOOM + Math.round(ZOOM_DAUER * 0.6)} vol={0.55} />
      <Sequence from={0} durationInFrames={STILTEST_R05_DAUER} layout="none">
        <Audio src={staticFile("sounds-neu/neu-dark-cinematic-suspe.mp3")} volume={(x) => interpolate(x, [0, 12, STILTEST_R05_DAUER - 15, STILTEST_R05_DAUER], [0, 0.13, 0.13, 0], { extrapolateRight: "clamp" })} />
      </Sequence>
    </AbsoluteFill>
  );
};
