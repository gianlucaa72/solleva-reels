// Reel 05 «50 Millisekunden»: ganzes Reel. Eine Welt (solleva.ch: Nacht, Nebel, Planet, Kristalle), eine Kamera.
// Schrift: Archivo 900 breit, Versalien, violette Prägung (Wunsch Gianluca, wie Reel 04).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Schriften } from "../../components/Basis";
import { Bewegungsunschaerfe, Cam, Ebene, Filmlook, MITTE, Rechteck, RUHE, drift, zoomInFenster } from "../../kamera/welt";
import { kurve, tw } from "../../lib/bewegung";
import { Ton } from "../../lib/kamera";
import { SchriftenR04 } from "../r04/Look";
import { ALT, AlteSeite, asset, Handy, Kristall, Lcd, NeueSeite, schluesselStil, ScherbeEl, scherben, textStil, titelStil, web } from "./Look";
import { DAUER, Stimme, wf, woerter } from "./timeline";

export const REEL05_DAUER = DAUER;
export type R05Props = { musik?: boolean; stimme?: boolean; effekte?: boolean };

// ============================ Zeiten (Frames) ============================
const F_ZAEHLER = wf(1, "fuenfzig");
const F_ZAEHLER_ENDE = wf(1, "millisekunden") + 16;
const F_WIMPERN = wf(2, "wimpernschlag");
const F_LID_ZU = F_WIMPERN + 13;
const F_VIDEO_START = Math.round(F_LID_ZU - (34.5 / 24) * 30);
const F_ZOOM = F_WIMPERN + 27;
const ZOOM_DAUER = 21;
const F_S2 = F_ZOOM + ZOOM_DAUER; // Wechsel in den Nebel

const F_GEFAELLT = wf(3, "gefaellt");
const F_S4 = wf(4, "noch");
const F_WORT = wf(4, "wort");
const F_S5 = wf(5, "gefaellt");
const F_TICK = wf(5, "nicht") + 12; // Besucherzähler springt in der Pause
const F_WEG = wf(5, "weg"); // einziger harter Schnitt
const F_FRIER = wf(6, "und"); // Zeit bleibt stehen
const F_BLEIBT = wf(6, "bleibt");
const F_LESEN = wf(7, "lesen");
const F_SPUL = F_LESEN + 26; // Zurückspulen
const F_GANZ = wf(8, "neu") - 6; // Scherben wieder ganz, neue Seite
const F_HANDY = F_GANZ + 4;
const F_SCHWENK = wf(8, "gebaut") + 24; // Kamera kippt zum Planeten
const SCHWENK_DAUER = 36;
const F_FUENFZIG = wf(9, "fuenfzig");
const F_ZOOM_HANDY = wf(9, "millisekunden") + 34;
const ZOOM_HANDY_DAUER = 21;
const F_END = F_ZOOM_HANDY + ZOOM_HANDY_DAUER; // Endkarte voll
const F_MEHR = wf(10, "mehr");
const F_TIPP = F_MEHR + 6;
const F_RAUS = DAUER - 36; // Rausfahrt aus der Pupille
const RAUS_DAUER = 22;
const F_LOOP = F_RAUS + RAUS_DAUER; // Auge wie Frame 0

// ============================ Geometrie ============================
const PUPILLE = { x: 557, y: 902, r: 92 };
const FENSTER: Rechteck = { x: PUPILLE.x - 36, y: PUPILLE.y - 64, w: 72, h: 128 };
const SEITE = { x: 540, y: 1100, s: 0.92 }; // Mitte und Massstab der Seite im Nebel
const ZAEHLER = { x: 85, y: 559 }; // Besucherzähler in Seiten-Koordinaten (620 × 1100)
const HANDY_END = { x: 540, y: 1160, s: 0.62 };

// ============================ Hilfen ============================
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const zufall = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Wort steigt auf (0,5 em), Blur 12 → 0, ease-out-expo. */
const WortEin: React.FC<{ f: number; ab: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, ab, children, style }) => {
  const e = expoOut(clamp01((f - ab + 2) / 24));
  const o = clamp01((f - ab + 2) / 6);
  return <span style={{ display: "inline-block", opacity: o, transform: `translateY(${(1 - e) * 0.5}em)`, filter: e < 0.99 ? `blur(${(1 - e) * 12}px)` : undefined, ...style }}>{children}</span>;
};
/** Schärfe-Zug: Wort steht unscharf vor und wird scharf, wenn es gesprochen wird. */
const WortScharf: React.FC<{ f: number; ab: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, ab, children, style }) => {
  const p = tw(f, ab - 1, 8, 0, 1, kurve.land);
  return <span style={{ display: "inline-block", opacity: 0.35 + 0.65 * p, filter: p < 0.99 ? `blur(${(1 - p) * 14}px)` : undefined, ...style }}>{children}</span>;
};
/** Ausgang: kürzer als der Eingang, Blur und nach oben. */
const raus = (f: number, ab: number, dauer = 8) => {
  const t = tw(f, ab, dauer, 0, 1, kurve.raus);
  return { opacity: 1 - t, transform: `translateY(${-t * 40}px)`, filter: t > 0.01 ? `blur(${t * 14}px)` : undefined } as React.CSSProperties;
};

const Zeile: React.FC<{ satz: number; f: number; top: number; size: number; schluessel?: string[]; modus?: "ein" | "scharf"; style?: React.CSSProperties; zusatz?: Record<string, string> }> = ({ satz, f, top, size, schluessel = [], modus = "ein", style, zusatz = {} }) => {
  const ws = woerter(satz);
  const W = modus === "ein" ? WortEin : WortScharf;
  return (
    <div style={{ position: "absolute", top, left: 95, width: 805, textAlign: "center", ...titelStil(size), ...style }}>
      {ws.map((w, i) => (
        <React.Fragment key={i}>
          <W f={f} ab={w.f} style={schluessel.includes(w.n) ? schluesselStil() : undefined}>{w.w}{zusatz[w.n] ?? ""}{i === ws.length - 1 ? "." : ""}</W>{" "}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Bild 1:1 mit gespiegelter Fortsetzung ringsum (Kreis-/Fenster-Fahrten zeigen nie Leerfläche). */
const Kachel: React.FC<{ src: string; filter?: string; dy?: number }> = ({ src, filter, dy = 0 }) => (
  <AbsoluteFill style={{ filter }}>
    {[-1, 0, 1].flatMap((ix) => [-1, 0, 1].map((iy) => (
      <Img key={`${ix}${iy}`} src={src} style={{ position: "absolute", left: ix * 1080, top: iy * 1920 + dy, width: 1080, height: 1920, transform: `scale(${ix ? -1 : 1}, ${iy ? -1 : 1})` }} />
    )))}
  </AbsoluteFill>
);

// ============================ Szene 1: Auge ============================
const blinzelBild = (f: number) => {
  const idx = Math.max(1, Math.min(73, Math.floor(((f - F_VIDEO_START) / 30) * 24) + 1));
  return asset(`blinzeln/b${String(idx).padStart(3, "0")}.jpg`);
};
const lcdText = (f: number) => {
  const ms = Math.round(tw(f, F_ZAEHLER, F_ZAEHLER_ENDE - F_ZAEHLER, 0, 50, kurve.land));
  return `0,0${String(ms).padStart(2, "0")}`;
};

const HookText: React.FC<{ f: number; loop?: boolean }> = ({ f, loop }) => {
  const einrast = !loop && f >= F_ZAEHLER_ENDE ? tw(f, F_ZAEHLER_ENDE, 10, 1.06, 1, kurve.land) : 1;
  const glanz = !loop && f >= F_ZAEHLER_ENDE ? tw(f, F_ZAEHLER_ENDE, 14, 1, 0, kurve.fade) : 0;
  const puls = !loop && f >= F_ZAEHLER ? tw(f, F_ZAEHLER, 12, 1.035, 1, kurve.land) : 1;
  const ws = woerter(2);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${einrast})`, filter: glanz ? `drop-shadow(0 0 ${30 * glanz}px ${web.cyan})` : undefined }}>
        <Lcd text={loop ? "0,000s" : `${lcdText(f)}s`} h={170} />
      </div>
      <div style={{ position: "absolute", top: 1130, left: 95, width: 805, textAlign: "center", transform: `scale(${puls})` }}>
        <div style={{ ...titelStil(230, 9), ...schluesselStil(9), lineHeight: 0.9 }}>50</div>
        <div style={{ ...titelStil(80, 6) }}>Millisekunden.</div>
      </div>
      {!loop && (
        <div style={{ position: "absolute", top: 1440, left: 95, width: 805, textAlign: "center", ...textStil(46) }}>
          {ws.map((w, i) => (
            <React.Fragment key={i}>
              <WortEin f={f} ab={w.f} style={w.n === "wimpernschlag" ? { color: web.text } : undefined}>{w.w}{i === ws.length - 1 ? "." : ""}</WortEin>{" "}
            </React.Fragment>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Auge mit eingebetteter Szene in der Pupille (Zoom-Through hinein und heraus). */
const AugeWelt: React.FC<{ f: number; cam: Cam; sicht: number; bild: string; innen: React.ReactNode; text: React.ReactNode; textTiefe?: number }> = ({ cam, sicht, bild, innen, text, textTiefe = 1.1 }) => {
  const k = 1080 / FENSTER.w;
  const R = PUPILLE.r;
  return (
    <AbsoluteFill style={{ background: web.ink }}>
      <Ebene cam={cam} tiefe={1}>
        <Img src={bild} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />
        {sicht > 0.001 && (
          <div style={{ position: "absolute", left: PUPILLE.x - R, top: PUPILLE.y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", opacity: sicht, WebkitMaskImage: "radial-gradient(circle, #000 80%, transparent 100%)", maskImage: "radial-gradient(circle, #000 80%, transparent 100%)" }}>
            <div style={{ position: "absolute", left: FENSTER.x - (PUPILLE.x - R), top: FENSTER.y - (PUPILLE.y - R), width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${1 / k})` }}>{innen}</div>
          </div>
        )}
      </Ebene>
      <Ebene cam={cam} tiefe={textTiefe}>{text}</Ebene>
    </AbsoluteFill>
  );
};

const kameraS1 = (f: number): Cam => {
  const d = drift(f, 0, F_ZOOM, 2);
  const stoss = 1 + tw(f, F_WIMPERN - 2, 15, 0, 0.03, kurve.heavy);
  const hin = tw(f, F_WIMPERN - 2, 26, 0, 1, kurve.heavy);
  return { s: d.s * stoss, cx: d.cx + (PUPILLE.x - MITTE.x) * 0.25 * hin, cy: d.cy + (PUPILLE.y - MITTE.y) * 0.25 * hin };
};
const kameraA = (f: number): Cam => (f < F_ZOOM ? kameraS1(f) : zoomInFenster(kameraS1(F_ZOOM), FENSTER, (f - F_ZOOM) / ZOOM_DAUER));

// ============================ Szene 2–4: Seite im Nebel ============================
const seitenDrehung = (f: number) => {
  // Orbit um die Seite (S3 → S4), in S5 dreht sie sich zur Kamera
  const y1 = tw(f, F_S2 - 10, 90, -34, -16, kurve.heavy);
  const y2 = tw(f, F_S4 - 4, 70, 0, 46, kurve.heavy);
  const zurueck = tw(f, F_S5 - 6, 24, 1, 0, kurve.heavy);
  return { ry: (y1 + y2) * zurueck, rx: 6 * zurueck, rz: -2 * zurueck };
};
const NebelSeite: React.FC<{ f: number }> = ({ f }) => {
  const d = seitenDrehung(f);
  const schweben = (Math.sin((f - F_S2) / 26) * 6 + Math.sin((f - F_S2) / 41) * 4) * tw(f, F_S5, 20, 1, 0);
  const unscharf = tw(f, F_WORT - 6, 20, 0, 6, kurve.land) * tw(f, F_S5 - 4, 14, 1, 0);
  const tick = f >= F_TICK;
  const tickPuls = tick ? tw(f, F_TICK, 10, 1, 0, kurve.fade) : 0;
  return (
    <AbsoluteFill>
      <Kachel src={asset("higgsfield/nebel-a.png")} />
      <div style={{ position: "absolute", left: SEITE.x - ALT.w / 2, top: SEITE.y - ALT.h / 2 + schweben, width: ALT.w, height: ALT.h, perspective: 1600, transform: `scale(${SEITE.s})` }}>
        <div style={{ transform: `rotateY(${d.ry}deg) rotateX(${d.rx}deg) rotateZ(${d.rz}deg)`, boxShadow: "0 50px 120px rgba(108,63,212,.55)", position: "relative" }}>
          <AlteSeite unscharf={unscharf} zaehler={tick ? "000413" : "000412"} />
          {tickPuls > 0 && <div style={{ position: "absolute", left: ZAEHLER.x - 80, top: ZAEHLER.y - 30, width: 160, height: 60, borderRadius: 8, boxShadow: `0 0 ${40 * tickPuls}px ${20 * tickPuls}px rgba(51,255,51,.45)` }} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};
const NebelText: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    {f < F_S4 + 8 && <div style={raus(f, F_S4 - 6)}><Zeile satz={3} f={f} top={300} size={70} schluessel={["gefaellt"]} zusatz={{ du: "," }} /></div>}
    {f >= F_S4 - 8 && f < F_S5 + 8 && <div style={raus(f, F_S5 - 6)}><Zeile satz={4} f={f} top={300} size={78} modus="scharf" schluessel={["wort"]} /></div>}
    {f >= F_S5 - 8 && (
      <div style={{ position: "absolute", top: 280, left: 95, width: 805, padding: "22px 0 26px", borderRadius: 28, background: "rgba(4,5,12,.82)", boxShadow: "0 20px 60px rgba(4,5,12,.6)", textAlign: "center", ...titelStil(84), opacity: tw(f, F_S5 - 8, 8, 0, 1, kurve.fade) }}>
        {woerter(5).filter((w) => w.n !== "weg").map((w, i) => (
          <React.Fragment key={i}><WortEin f={f} ab={w.f}>{w.w}{w.n === "nicht" ? " …" : ""}</WortEin>{" "}</React.Fragment>
        ))}
      </div>
    )}
  </AbsoluteFill>
);
const kameraB = (f: number): Cam => {
  const push = 1 + 0.035 * clamp01((f - F_S2) / 90);
  const stoss = 1 + tw(f, F_GEFAELLT - 2, 15, 0, 0.03, kurve.heavy) + tw(f, F_WORT - 2, 15, 0, 0.03, kurve.heavy);
  // S5: Kamera fährt an den Besucherzähler
  const z = tw(f, F_S5 + 2, 30, 0, 1, kurve.heavy);
  const ziel = { x: SEITE.x + (ZAEHLER.x - ALT.w / 2) * SEITE.s, y: SEITE.y + (ZAEHLER.y - ALT.h / 2) * SEITE.s };
  const sway = Math.sin((f - F_S2) / 50) * 3;
  return { s: push * stoss * (1 + 0.6 * z), cx: MITTE.x + sway * (1 - z) + (ziel.x - MITTE.x) * z, cy: MITTE.y + (ziel.y - 85 - MITTE.y) * z };
};

// ============================ Szene 4–6: Scherben ============================
const SCH = scherben(ALT.w, ALT.h, 22, 5);
const EINSCHLAG = { x: ALT.w * 0.5, y: ALT.h * 0.7 };
const PARAM = SCH.map((s) => {
  const dx = s.cx - EINSCHLAG.x, dy = s.cy - EINSCHLAG.y, l = Math.hypot(dx, dy) || 1;
  const v = 160 + zufall(s.i + 1) * 280;
  return {
    vx: (dx / l) * v, vy: (dy / l) * v - 120, vz: (zufall(s.i + 7) - 0.4) * 900,
    wx: (zufall(s.i + 3) - 0.5) * 220, wy: (zufall(s.i + 4) - 0.5) * 260, wz: (zufall(s.i + 5) - 0.5) * 160,
    flipVerz: zufall(s.i + 9) * 0.45,
  };
});
const G = 420;
/** Scherben-Zeit τ (Sekunden der Explosion): Ausbruch, Zeitlupe, Einfrieren, Zurückspulen. */
const tau = (f: number) => {
  if (f < F_WEG) return 0;
  const t = f - F_WEG;
  const lauf = (x: number) => 0.28 * (1 - Math.exp(-x / 4)) + 0.011 * x; // Ausbruch + Zeitlupe
  const TF = F_FRIER - F_WEG;
  const u = Math.max(0, Math.min(t - TF, 18)); // Bremsen über 18 Frames (Tape-Stop)
  const tEff = Math.min(t, TF) + u - (u * u) / 36;
  const leben = Math.max(0, f - F_FRIER - 18) * 0.0006; // eingefroren, aber nicht tot
  const voll = lauf(tEff) + leben;
  if (f < F_SPUL) return voll;
  return voll * tw(f, F_SPUL, F_GANZ - F_SPUL, 1, 0, kurve.heavy);
};
const flipP = (f: number, i: number) => clamp01(tw(f, F_SPUL + 8, F_GANZ - F_SPUL - 8, 0, 1, kurve.linear) * 1.6 - PARAM[i].flipVerz);
const kamZ = (f: number) => {
  const flug = tw(f, F_FRIER, F_SPUL - F_FRIER, 0, 380, kurve.heavy);
  return f < F_SPUL ? flug : flug * tw(f, F_SPUL, F_GANZ - F_SPUL, 1, 0, kurve.heavy);
};

const ScherbenWelt: React.FC<{ f: number }> = ({ f }) => {
  const T = tau(f);
  const z = kamZ(f);
  const handy = tw(f, F_HANDY, 14, 0, 1, kurve.land);
  const dreh = tw(f, F_FRIER, F_SPUL - F_FRIER, 0, -8, kurve.heavy) * (f < F_SPUL ? 1 : tw(f, F_SPUL, F_GANZ - F_SPUL, 1, 0, kurve.heavy));
  return (
    <AbsoluteFill>
      <Kachel src={asset("higgsfield/nebel-a.png")} filter="brightness(.72)" />
      <div style={{ position: "absolute", left: 540 - ALT.w / 2, top: SEITE.y - ALT.h / 2, width: ALT.w, height: ALT.h, perspective: 1100 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateY(${dreh}deg)` }}>
          {handy < 1 && SCH.map((s, i) => {
            const p = PARAM[i];
            const dz = p.vz * T;
            const nah = dz + z;
            const sicht = nah > 760 ? clamp01(1 - (nah - 760) / 200) : 1;
            if (sicht <= 0) return null;
            return (
              <div key={i} style={{ opacity: sicht * (1 - handy), position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
                <ScherbeEl s={s} dx={p.vx * T} dy={p.vy * T + 0.5 * G * T * T} dz={dz} rx={p.wx * T} ry={p.wy * T + 180 * flipP(f, i)} rz={p.wz * T}
                  vorne={<AlteSeite zaehler="000413" />} hinten={<NeueSeite />} kante={T > 0.002 ? 0.9 : 0.9 * clamp01((F_GANZ + 6 - f) / 6)} />
              </div>
            );
          })}
        </div>
        {handy > 0 && (
          <div style={{ position: "absolute", left: -12, top: -12, opacity: handy, transform: `scale(${1.04 - 0.04 * handy})` }}>
            <Handy w={ALT.w} h={ALT.h}><NeueSeite /></Handy>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const ScherbenText: React.FC<{ f: number }> = ({ f }) => {
  const weg = f - F_WEG;
  // «WEG.» reisst mit dem Glas: untere Hälfte sackt ab und dreht sich
  const riss = tw(weg, 2, 40, 0, 1, kurve.land);
  const wegRaus = raus(f, F_FRIER - 4, 10);
  const wegStil: React.CSSProperties = { ...titelStil(300, 10), ...schluesselStil(10), position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", lineHeight: 1 };
  return (
    <AbsoluteFill>
      {f < F_FRIER + 8 && (
        <div style={wegRaus}>
          <div style={{ ...wegStil, clipPath: "polygon(0 0,100% 0,100% 47%,61% 55%,43% 48%,0 58%)" }}>Weg.</div>
          <div style={{ ...wegStil, clipPath: "polygon(0 58%,43% 48%,61% 55%,100% 47%,100% 100%,0 100%)", transform: `translate(${riss * 22}px, ${riss * 46}px) rotate(${riss * 5}deg)` }}>Weg.</div>
        </div>
      )}
      {f >= F_FRIER - 4 && f < F_SPUL + 10 && (
        <div style={raus(f, F_SPUL - 2, 10)}>
          {/* Gravur in einer Scherbe */}
          <div style={{ position: "absolute", left: 110, top: 300, width: 800, padding: "40px 40px 46px", background: "linear-gradient(135deg, rgba(43,34,112,.9), rgba(10,13,34,.93))", clipPath: "polygon(3% 10%, 94% 0, 100% 74%, 62% 100%, 0 86%)", opacity: tw(f, F_FRIER - 4, 8, 0, 1, kurve.fade), transform: `translateY(${tw(f, F_FRIER - 4, 14, 30, 0, kurve.land)}px)` }}>
            <div style={{ textAlign: "center", ...titelStil(72, 4) }}>
              {woerter(6).map((w, i) => (
                <React.Fragment key={i}><WortEin f={f} ab={w.f} style={w.n === "bleibt" ? { ...schluesselStil(4), color: web.cyan } : undefined}>{w.w}{w.n === "bleibt" ? "." : ""}</WortEin>{" "}</React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", top: 1420, left: 95, width: 805, textAlign: "center", ...titelStil(56, 4) }}>
            {woerter(7).map((w, i) => (
              <React.Fragment key={i}><WortEin f={f} ab={w.f}>{w.w}{w.n === "lesen" ? "." : ""}</WortEin>{" "}</React.Fragment>
            ))}
          </div>
        </div>
      )}
      {f >= F_SPUL && f < F_GANZ + 4 && (
        <div style={{ position: "absolute", top: 1440, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 44, color: web.cyan, letterSpacing: 6, opacity: (Math.floor((f - F_SPUL) / 6) % 2 ? 0.45 : 1) * tw(f, F_GANZ - 24, 8, 1, 0) }}>◀◀ REW</div>
      )}
      {f >= wf(8, "darum") - 4 && (
        <div style={{ position: "absolute", top: 300, left: 95, width: 805, textAlign: "center", ...titelStil(74, 0), textShadow: "none", filter: "drop-shadow(0 6px 0 #2b2270) drop-shadow(0 14px 22px rgba(4,5,12,.8))" }}>
          {woerter(8).map((w, i) => (
            <React.Fragment key={i}>
              <WortEin f={f} ab={w.f} style={{ background: w.n === "neu" ? `linear-gradient(180deg,#e7defe 0%,${web.lilac} 55%,#6c3fd4 100%)` : web.chrome, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{w.w}{w.n === "gebaut" ? "." : ""}</WortEin>{" "}
            </React.Fragment>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
const kameraC = (f: number): Cam => {
  const t = f - F_WEG;
  const shake = t < 5 ? (1 - t / 5) * 14 : 0;
  const push = 1 + 0.03 * clamp01(t / 60);
  return { s: push, cx: MITTE.x + Math.sin(t * 2.7) * shake, cy: MITTE.y + Math.cos(t * 3.3) * shake * 0.7 };
};

// ============================ Szene 7: Planet ============================
const PlanetWelt: React.FC<{ f: number; schwenk: number }> = ({ f, schwenk }) => {
  // schwenk 0 → 1: Nebel oben, Planet darunter; Handy wird kleiner und steigt
  const steig = tw(f, F_SCHWENK + SCHWENK_DAUER - 6, 30, 0, 1, kurve.land);
  const hs = 1 + (HANDY_END.s - 1) * schwenk;
  const hy = SEITE.y + (HANDY_END.y + 70 - SEITE.y) * schwenk - 70 * steig + Math.sin((f - F_SCHWENK) / 30) * 5 * steig;
  const kr = (i: number) => Math.sin((f + i * 40) / 34) * 10 + Math.sin((f + i * 17) / 53) * 6;
  const kIn = tw(f, F_SCHWENK + 10, 34, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${-1920 * schwenk}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}><Kachel src={asset("higgsfield/nebel-a.png")} filter="brightness(.72)" /></div>
        <Img src={asset("higgsfield/planet-b.png")} style={{ position: "absolute", left: 0, top: 1920, width: 1080, height: 1920 }} />
        <div style={{ position: "absolute", left: 0, top: 1920 - 500, width: 1080, height: 1000, background: "linear-gradient(180deg, transparent 0%, rgba(4,5,12,1) 50%, transparent 100%)" }} />
      </AbsoluteFill>
      <Kristall nr={1} x={175 - (1 - kIn) * 300} y={760 + kr(1)} h={420} dreh={-14 + kr(1) * 0.3} />
      <Kristall nr={2} x={905 + (1 - kIn) * 300} y={930 + kr(2)} h={310} dreh={12} blur={2} />
      <Kristall nr={3} x={170 - (1 - kIn) * 300} y={1360 + kr(3)} h={270} dreh={18} blur={1.5} />
      <div style={{ position: "absolute", left: HANDY_END.x - ALT.w / 2 - 12, top: hy - ALT.h / 2 - 12, transform: `scale(${hs})`, transformOrigin: `${ALT.w / 2 + 12}px ${ALT.h / 2 + 12}px` }}>
        <Handy w={ALT.w} h={ALT.h}><NeueSeite /></Handy>
      </div>
    </AbsoluteFill>
  );
};
const handyFenster = (f: number): Rechteck => {
  const w = ALT.w * HANDY_END.s;
  const h = (w * 16) / 9;
  const y = HANDY_END.y - 70 * 1 + Math.sin((f - F_SCHWENK) / 30) * 5;
  return { x: HANDY_END.x - w / 2, y: y - h / 2, w, h };
};
const PlanetText: React.FC<{ f: number }> = ({ f }) => {
  const ws = woerter(9);
  const lcd = Math.round(tw(f, F_FUENFZIG, 16, 0, 50, kurve.land));
  return (
    <AbsoluteFill style={raus(f, F_ZOOM_HANDY, 8)}>
      <div style={{ position: "absolute", top: 290, left: 95, width: 805, textAlign: "center", ...titelStil(66) }}>
        {ws.slice(0, 3).map((w, i) => <React.Fragment key={i}><WortEin f={f} ab={w.f}>{w.w}</WortEin>{" "}</React.Fragment>)}
      </div>
      <div style={{ position: "absolute", top: 385, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: clamp01((f - F_FUENFZIG + 2) / 4), transform: `scale(${f >= F_FUENFZIG + 16 ? tw(f, F_FUENFZIG + 16, 10, 1.06, 1, kurve.land) : 1})` }}>
        <Lcd text={String(lcd).padStart(2, "0")} h={150} />
      </div>
      <div style={{ position: "absolute", top: 565, left: 95, width: 805, textAlign: "center", ...titelStil(68) }}>
        <WortEin f={f} ab={ws[4].f} style={schluesselStil()}>Millisekunden.</WortEin>
      </div>
    </AbsoluteFill>
  );
};

// ============================ Szene 8: Endkarte ============================
const Endkarte: React.FC<{ f: number }> = ({ f }) => {
  const ein = (d: number) => ({ opacity: tw(f, F_END - 10 + d, 10, 0, 1, kurve.fade), transform: `translateY(${tw(f, F_END - 10 + d, 18, 30, 0, kurve.land)}px)` });
  const t = f - F_TIPP;
  const druck = t >= 0 && t < 4 ? tw(t, 0, 4, 1, 0.95, kurve.whip) : t >= 4 && t < 14 ? tw(t, 4, 10, 0.95, 1, kurve.land) : 1;
  const gefolgt = t >= 3;
  const ripple = t >= 0 && t < 22 ? t / 22 : -1;
  return (
    <AbsoluteFill>
      <Kachel src={asset("higgsfield/planet-b.png")} filter="brightness(.5)" />
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: "Instrument Serif", fontSize: 76, color: web.text, ...ein(0) }}>Solleva</div>
      <div style={{ position: "absolute", top: 480, left: 95, width: 805, textAlign: "center", ...titelStil(104, 8), ...ein(4) }}>
        Heb dich von der <span style={schluesselStil(8)}>Masse</span> ab.
      </div>
      <div style={{ position: "absolute", top: 900, left: 150, width: 780, ...ein(8) }}>
        <div style={{ height: 150, borderRadius: 75, background: gefolgt ? `linear-gradient(180deg, ${web.lilac}, ${web.purple})` : web.chrome, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${druck})`, boxShadow: "0 22px 60px rgba(108,63,212,.55)" }}>
          <span style={{ fontFamily: "Archivo R04", fontWeight: 900, fontStretch: "112%", fontSize: 58, textTransform: "uppercase", color: gefolgt ? web.text : web.ink }}>{gefolgt ? "Folge ich ✓" : "Folge für mehr"}</span>
        </div>
        {ripple >= 0 && <div style={{ position: "absolute", left: 390 - 60 - ripple * 260, top: 75 - 60 - ripple * 260, width: 120 + ripple * 520, height: 120 + ripple * 520, borderRadius: "50%", border: `4px solid rgba(143,227,255,${0.8 * (1 - ripple)})` }} />}
        {t > -12 && t < 20 && <div style={{ position: "absolute", left: 390 - 46, top: 75 - 46, width: 92, height: 92, borderRadius: "50%", background: "rgba(255,255,255,.35)", border: "3px solid rgba(255,255,255,.8)", opacity: tw(t, -12, 6, 0, 1) * tw(t, 12, 8, 1, 0), transform: `translate(${tw(t, -12, 12, 60, 0, kurve.land)}px, ${tw(t, -12, 12, 80, 0, kurve.land)}px) scale(${t >= 0 && t < 6 ? 0.85 : 1})` }} />}
      </div>
      <div style={{ position: "absolute", top: 1110, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 42, color: web.lilac, ...ein(12) }}>@solleva.ch</div>
    </AbsoluteFill>
  );
};

// ============================ Welt + Kamera ============================
type Teil = "A" | "B" | "C" | "E" | "F" | "R";
const teil = (f: number): Teil =>
  f < F_S2 ? "A" : f < F_WEG ? "B" : f < F_SCHWENK ? "C" : f < F_END ? "E" : f < F_RAUS ? "F" : "R";
const grenzen: Record<Teil, [number, number]> = {
  A: [0, F_S2], B: [F_S2, F_WEG], C: [F_WEG, F_SCHWENK], E: [F_SCHWENK, F_END], F: [F_END, F_RAUS], R: [F_RAUS, DAUER],
};
const schwenkP = (f: number) => tw(f, F_SCHWENK, SCHWENK_DAUER, 0, 1, kurve.heavy);
const kameraE = (f: number): Cam => (f < F_ZOOM_HANDY ? { s: kameraC(F_SCHWENK).s + 0.02 * clamp01((f - F_SCHWENK) / 60), cx: MITTE.x, cy: MITTE.y } : zoomInFenster(kameraE(F_ZOOM_HANDY - 0.001), handyFenster(F_ZOOM_HANDY), (f - F_ZOOM_HANDY) / ZOOM_HANDY_DAUER));
const kameraF = (f: number): Cam => ({ s: 1 + 0.025 * Math.sin(Math.PI * clamp01((f - F_END) / (F_RAUS - F_END))), cx: MITTE.x, cy: MITTE.y });
const kameraR = (f: number): Cam => (f < F_LOOP ? zoomInFenster(RUHE, FENSTER, 1 - (f - F_RAUS) / RAUS_DAUER) : RUHE);

const kameraVon = (f: number): Cam => {
  switch (teil(f)) {
    case "A": return kameraA(f);
    case "B": return kameraB(f);
    case "C": return kameraC(f);
    case "E": return kameraE(f);
    case "F": return kameraF(f);
    default: return kameraR(f);
  }
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  const tl = teil(f);
  if (tl === "A") {
    const sicht = f < F_ZOOM ? 0 : tw(f, F_ZOOM, ZOOM_DAUER * 0.55, 0, 1, kurve.fade);
    return <AugeWelt f={f} cam={kameraA(f)} sicht={sicht} bild={blinzelBild(f)} innen={<NebelSeite f={f} />} text={<div style={{ opacity: tw(f, F_ZOOM - 2, 8, 1, 0, kurve.raus) }}><HookText f={f} /></div>} />;
  }
  if (tl === "B") {
    const cam = kameraB(f);
    return (
      <AbsoluteFill style={{ background: web.ink }}>
        <Ebene cam={cam} tiefe={1}><NebelSeite f={f} /></Ebene>
        <Ebene cam={cam} tiefe={0.03}><NebelText f={f} /></Ebene>
      </AbsoluteFill>
    );
  }
  if (tl === "C" || tl === "E") {
    const cam = kameraVon(f);
    const sw = schwenkP(f);
    const endSicht = tl === "E" && f >= F_ZOOM_HANDY ? tw(f, F_ZOOM_HANDY, ZOOM_HANDY_DAUER * 0.5, 0, 1, kurve.fade) : 0;
    const r = handyFenster(f);
    const e = tl === "E" && f >= F_ZOOM_HANDY ? kurve.heavy(clamp01((f - F_ZOOM_HANDY) / ZOOM_HANDY_DAUER)) : 0;
    return (
      <AbsoluteFill style={{ background: web.ink }}>
        <Ebene cam={cam} tiefe={1}>
          {tl === "C" ? <ScherbenWelt f={f} /> : <PlanetWelt f={f} schwenk={sw} />}
          {endSicht > 0 && (
            <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", borderRadius: 50 * (1 - e), opacity: endSicht }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${r.w / 1080})` }}><Endkarte f={f} /></div>
            </div>
          )}
        </Ebene>
        <Ebene cam={cam} tiefe={tl === "E" ? 1.1 : 0.15}>{tl === "C" ? <ScherbenText f={f} /> : <PlanetText f={f} />}</Ebene>
      </AbsoluteFill>
    );
  }
  if (tl === "F") {
    return <AbsoluteFill style={{ background: web.ink }}><Ebene cam={kameraF(f)} tiefe={1}><Endkarte f={f} /></Ebene></AbsoluteFill>;
  }
  // R: Rausfahrt aus der Pupille, Ende = Frame 0
  const p = (f - F_RAUS) / RAUS_DAUER;
  const sicht = f < F_LOOP ? tw(p, 0.45, 0.55, 1, 0, kurve.fade) : 0;
  const hook = tw(f, F_LOOP - 8, 12, 0, 1, kurve.fade);
  return <AugeWelt f={f} cam={kameraR(f)} sicht={sicht} bild={asset("blinzeln/b001.jpg")} innen={<Endkarte f={F_RAUS} />} text={<div style={{ opacity: hook }}><HookText f={0} loop /></div>} />;
};

const tempo = (f: number) => {
  const a = kameraVon(f - 0.5), b = kameraVon(f + 0.5);
  const sw = Math.abs(schwenkP(f + 0.5) - schwenkP(f - 0.5)) * 1.6;
  return Math.abs(Math.log(b.s / a.s)) + Math.hypot(b.cx - a.cx, b.cy - a.cy) * 0.0006 + sw;
};

// ============================ Ton ============================
const Effekte: React.FC = () => (
  <>
    <Ton nr="ratsche-19" bei={F_ZAEHLER} ab={0} max={(F_ZAEHLER_ENDE - F_ZAEHLER) / 30 + 0.15} vol={0.22} />
    <Ton nr="neu-vintage-camera-shutt-1" bei={F_LID_ZU} vol={0.5} />
    <Ton nr="neu-slow-bass-woosh" bei={F_ZOOM + 13} vol={0.55} />
    <Ton nr="neu-soft-wind-swoosh-lo-3" bei={F_S4 + 10} vol={0.22} />
    <Ton nr="ratsche-12" bei={F_TICK} vol={0.5} />
    <Ton nr="glas-02" bei={F_WEG} vol={0.85} />
    <Ton nr="neu-deep-cinematic-boom" bei={F_WEG} vol={0.4} />
    <Ton nr="neu-tape-stop-effect-ca-1" bei={F_FRIER} vol={0.35} />
    <Ton nr="downlifter-01" bei={F_SPUL} ab={0} max={(F_GANZ - F_SPUL) / 30 + 0.2} vol={0.45} />
    <Ton nr="neu-soft-cinematic-boom-1" bei={F_HANDY} vol={0.35} />
    <Ton nr="neu-soft-close-air-movem" bei={F_SCHWENK + 20} vol={0.45} />
    <Ton nr="ratsche-19" bei={F_FUENFZIG} ab={0} max={0.6} vol={0.2} />
    <Ton nr="neu-soft-wind-swoosh-lo-4" bei={F_ZOOM_HANDY + 13} vol={0.45} />
    <Ton nr="neu-soft-pop-ui-click-1" bei={F_TIPP} vol={0.35} />
    <Ton nr="neu-soft-wind-swoosh-lo-3" bei={F_RAUS + 9} vol={0.4} />
  </>
);

export const R05Reel: React.FC<R05Props> = ({ musik = true, stimme = true, effekte = true }) => {
  const f = useCurrentFrame();
  const [a, b] = grenzen[teil(f)];
  return (
    <AbsoluteFill style={{ background: web.ink }}>
      <Schriften />
      <SchriftenR04 />
      <Bewegungsunschaerfe f={f} tempo={f === a ? 0 : tempo(f)} render={(x) => <Welt f={Math.max(a, Math.min(b - 0.001, x))} />} />
      <Filmlook />
      {stimme && <Stimme />}
      {effekte && <Effekte />}
      {musik && (
        <Sequence from={0} durationInFrames={DAUER} layout="none">
          <Audio src={staticFile("sounds-neu/neu-dark-cinematic-suspe.mp3")} volume={(x) => interpolate(x, [0, 10, DAUER - 24, DAUER], [0, 0.13, 0.13, 0], { extrapolateRight: "clamp" })} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
