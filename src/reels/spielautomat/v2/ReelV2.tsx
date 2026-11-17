import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { kurve, landung, tw } from "../../../lib/bewegung";
import { Ton } from "../../../lib/kamera";
import { Bewegungsunschaerfe, Cam, drift, Ebene, Filmlook, Rechteck, RUHE, TIEFE, zoomInFenster } from "../../../kamera/welt";
import { Papierstueck, weisserRand, Zeitung, zine, ZineSchriften } from "../../../stil/halbton";
import { ErpresserAnim, EtikettAnim, Walze, walzenPos } from "../Stiltest";
import { SAETZE } from "../zeiten";

// ============================================================================
// Reel «Spielautomat» v2: durchgehende virtuelle Kamera (K01). Testteil: Szene 1 + 2.
// ============================================================================
const Z = (n: number) => SAETZE[n - 1] as unknown as { nr: number; start: number; ende: number; datei: string; m: Record<string, number> };
const A = (name: string) => staticFile(`assets/spielautomat/${name}.png`);

// ---------- Zeitplan Kamera ----------
const ZOOM_DAUER = 21; // 0,7 s
const ZOOM1 = Z(2).start; // 137: Hook steht 1,4 s, dann Fahrt ins Handy
const WECHSEL1 = ZOOM1 + ZOOM_DAUER; // 158: unsichtbarer Wechsel → Szene 2
export const V2_TEST_DAUER = 236;

// ---------- Szene 1: Hand + Handy ----------
const BILD = { w: 880, h: 1168 };
const S_OBJ = 1.22;
const POS = { x: 1090 - BILD.w * S_OBJ, y: 486 };
// 9:16-Fenster im Handy-Bildschirm (Bild-Koordinaten: Bildschirm x 71–400, y 309–869).
// Fenster 288 × 512, ringsum ~20 px Rand: dort läuft Szene 2 weiter, damit beim Zoom nie der Handy-Rahmen aufblitzt.
const FENSTER1: Rechteck = { x: POS.x + 91.5 * S_OBJ, y: POS.y + 333 * S_OBJ, w: 288 * S_OBJ, h: 512 * S_OBJ };
const BILDSCHIRM1: Rechteck = { x: POS.x + 71 * S_OBJ, y: POS.y + 309 * S_OBJ, w: 329 * S_OBJ, h: 560 * S_OBJ };

/** Idle nimmt vor der Fahrt ab, damit das Fenster beim Zoom still steht. */
const ruheHuelle = (f: number) => 1 - tw(f, ZOOM1 - 14, 12, 0, 1, kurve.land);

const handTransform = (f: number) => {
  const z = Z(1);
  const ein = tw(f, 0, 12, 1, 0, kurve.whip);
  const land = landung(f, 11, 10, 1.03); // Fix: startet bei 1, nicht bei 0 (Handy verschwand in Frame 10)
  const hebel = f < z.m.wort + 2 ? 0 : f < z.m.wort + 8 ? tw(f, z.m.wort + 2, 6, 0, 1, kurve.whip) : tw(f, z.m.wort + 8, 18, 1, 0, kurve.land);
  const stop3 = 124;
  const ruck = f >= stop3 && f < stop3 + 10 ? Math.sin((f - stop3) * 1.6) * (1 - (f - stop3) / 10) * 1.0 : 0;
  const h = ruheHuelle(f);
  const schweben = Math.sin(f / 26) * 6 * h;
  const wackel = Math.sin(f / 41) * 0.7 * h;
  return { x: ein * 500, y: ein * 900 + schweben + hebel * 14, rot: ein * 18 + wackel + hebel * 3.5 + ruck, s: land, blur: ein * 6 };
};

const StrahlenEbene: React.FC<{ f: number; bild: string; grund: string; cx: number; cy: number; tempo?: number }> = ({ f, bild, grund, cx, cy, tempo = 0.08 }) => {
  const g = 2700;
  return (
    <>
      <div style={{ position: "absolute", left: -400, top: -400, width: 1880, height: 2720, background: grund }} />
      <Img src={A(bild)} style={{ position: "absolute", left: cx - g / 2, top: cy - g / 2, width: g, height: g, transform: `rotate(${f * tempo}deg)` }} />
    </>
  );
};

const Szene1: React.FC<{ f: number; cam: Cam }> = ({ f, cam }) => {
  const z = Z(1);
  const t = handTransform(f);
  const ruhe = ruheHuelle(f);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Hintergrund 0,3: texturierte Strahlen, drehen langsam */}
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <StrahlenEbene f={f} bild="strahlen-rot-a" grund="#5A0E12" cx={FENSTER1.x + FENSTER1.w / 2} cy={FENSTER1.y + FENSTER1.h / 2} />
      </Ebene>
      {/* Hauptobjekt 1,0: Hand + Handy, im Bildschirm liegt Szene 2 */}
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <div style={{ position: "absolute", left: POS.x, top: POS.y, width: BILD.w * S_OBJ, height: BILD.h * S_OBJ, transformOrigin: `${470 * S_OBJ}px ${760 * S_OBJ}px`, transform: `translate(${t.x}px, ${t.y}px) rotate(${t.rot}deg) scale(${t.s})`, filter: `${weisserRand(8)} blur(${t.blur}px)` }}>
          <Img src={A("hand-b-frei")} style={{ width: "100%", height: "100%" }} />
          {/* Bildschirm: Grund in Papierfarbe, darin das 9:16-Fenster mit Szene 2 */}
          <div style={{ position: "absolute", left: BILDSCHIRM1.x - POS.x, top: BILDSCHIRM1.y - POS.y, width: BILDSCHIRM1.w, height: BILDSCHIRM1.h, borderRadius: 16, background: "#E9E1CF", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: FENSTER1.x - BILDSCHIRM1.x, top: FENSTER1.y - BILDSCHIRM1.y, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${FENSTER1.w / 1080})` }}>
              <Szene2 f={f} cam={RUHE} eingebettet />
            </div>
          </div>
        </div>
      </Ebene>
      {/* Text 1,1 */}
      <Ebene cam={cam} tiefe={TIEFE.text}>
        <EtikettAnim text="DEIN DAUMEN ZIEHT" x={70} y={250} dreh={-3} start={z.start} f={f} />
        <EtikettAnim text="GERADE AN EINEM" x={240} y={338} dreh={2} start={z.m.zeile2} f={f} />
        <ErpresserAnim text="SPIEL" x={80} y={432} size={120} start={z.m.wort} f={f} />
        <ErpresserAnim text="AUTOMATEN" x={50} y={584} size={92} versatz={3} start={z.m.wort + 10} f={f} />
      </Ebene>
      {/* Vordergrund 1,6: unscharfe Münzen, ragen angeschnitten ins Bild */}
      <Ebene cam={cam} tiefe={TIEFE.vordergrund}>
        <Img src={A("muenze-frei")} style={{ position: "absolute", left: -190, top: 1560, width: 520, height: 520, transform: `rotate(${-20 + f * 0.25}deg) translateY(${Math.sin(f / 30) * 6 * ruhe}px)`, filter: "blur(7px) brightness(0.9)" }} />
        <Img src={A("muenze-frei")} style={{ position: "absolute", left: 900, top: 40, width: 300, height: 300, transform: `rotate(${30 - f * 0.2}deg)`, filter: "blur(9px) brightness(0.85)" }} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Szene 2: Zeitung + grosse Walzen + Lotterie-Los ----------
const WALZE = { w: 260, h: 380, gap: 31, y: 860 };
const WALZE_X = (1080 - (3 * WALZE.w + 2 * WALZE.gap)) / 2;
const HOOK_STOPS = [100, 111, 124];
const SPIN2 = Z(2).start + 26; // «… neuer Dreh»: Walzen drehen wieder

/** Walzen-Position über beide Phasen: Hook (dreht beim Hebel, stoppt auf ♥ ♥ ?) und Szene 2 (dreht wieder). */
const walze = (f: number, i: number) => {
  const startIdx = [1, 2, 3][i];
  const ziel = [0, 0, 3][i];
  const a = (x: number) => walzenPos(x, Z(1).m.wort + 4 + i * 2, HOOK_STOPS[i], startIdx, ziel);
  if (f < SPIN2) return a(f);
  const g = f - SPIN2 - i * 3;
  if (g <= 0) return a(SPIN2);
  return a(SPIN2) + 0.5 * g * Math.min(1, g / 10);
};

const Szene2: React.FC<{ f: number; cam: Cam; eingebettet?: boolean }> = ({ f, cam, eingebettet }) => {
  const z = Z(2);
  const los = z.start + 28;
  const losP = tw(f, los, 10, 1, 0, kurve.whip);
  const losLand = landung(f, los + 9, 8, 1.03);
  const losWackel = f > los + 18 ? Math.sin((f - los) / 14) * 0.8 : 0;
  const wortS = f < z.m.wort ? 0 : tw(f, z.m.wort, 6, 1.8, 1, kurve.whip);
  return (
    <AbsoluteFill style={{ overflow: eingebettet ? "visible" : "hidden" }}>
      {/* Hintergrund 0,3: altes Papier + Zeitungsspalten, schwenkt langsam */}
      <Ebene cam={cam} tiefe={TIEFE.hintergrund}>
        <Img src={A("papier")} style={{ position: "absolute", left: -120, top: -200, width: 1320, height: 2320, objectFit: "cover" }} />
        <div style={{ position: "absolute", left: -160, top: -380 - Math.max(0, f - z.start) * 0.5, width: 1400, transform: "rotate(-4deg)", mixBlendMode: "multiply", opacity: 0.62 }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i}>
              <Zeitung />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: -200, top: -300, width: 1480, height: 2520, background: "radial-gradient(ellipse 60% 50% at 50% 52%, transparent 45%, rgba(60,35,10,.32))" }} />
      </Ebene>
      {/* Hauptobjekt 1,0: drei Walzen */}
      <Ebene cam={cam} tiefe={TIEFE.haupt}>
        <div style={{ position: "absolute", left: WALZE_X, top: WALZE.y, display: "flex", gap: WALZE.gap, filter: weisserRand(8) }}>
          {[0, 1, 2].map((i) => {
            const p = walze(f, i);
            const v = Math.abs(walze(f + 1, i) - p);
            return <Walze key={i} p={p} tempo={v} w={WALZE.w} h={WALZE.h} />;
          })}
        </div>
      </Ebene>
      {/* Text 1,1: Lotterie-Los */}
      <Ebene cam={cam} tiefe={TIEFE.text}>
        {f >= los - 1 && (
          <div style={{ position: "absolute", left: 120, top: 250, width: 840, transformOrigin: "50% 0", transform: `translateY(${losP * -900}px) rotate(${-3 + losP * -25 + losWackel}deg) scale(${losLand})`, filter: "drop-shadow(10px 14px 0 rgba(0,0,0,.28))" }}>
            <div style={{ background: zine.gelb, border: `5px solid ${zine.schwarz}`, borderRadius: 20, padding: "26px 40px 30px", WebkitMaskImage: "radial-gradient(circle at 0 50%, transparent 30px, #000 31px), radial-gradient(circle at 100% 50%, transparent 30px, #000 31px)", WebkitMaskComposite: "source-in", maskComposite: "intersect" } as React.CSSProperties}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono", fontSize: 30, letterSpacing: "0.14em", color: zine.schwarz }}>
                <span>JEDER WISCH IST EIN NEUER</span>
                <span style={{ color: zine.rot }}>№ 471</span>
              </div>
              <div style={{ borderTop: `4px dashed ${zine.schwarz}`, margin: "14px 0 6px" }} />
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Rye", fontSize: 210, lineHeight: 1, color: zine.rot, transform: `scale(${wortS}) rotate(${(wortS - 1) * -12}deg)`, display: "inline-block", textShadow: `6px 6px 0 ${zine.schwarz}` }}>DREH</span>
              </div>
            </div>
          </div>
        )}
      </Ebene>
      {/* Vordergrund 1,6: gerissener Zeitungsstreifen ragt unten ins Bild */}
      <Ebene cam={cam} tiefe={TIEFE.vordergrund}>
        <div style={{ filter: "blur(2.5px)" }}>
          <Papierstueck x={-80} y={1660} w={1240} h={420} dreh={-5} seed={44} style={{ background: "#EFE7D3" }}>
            <Img src={A("papier")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
            <div style={{ position: "relative", padding: "34px 70px", fontFamily: "Fell SC", fontSize: 120, color: zine.schwarz, lineHeight: 1 }}>Der Jackpot</div>
            <div style={{ position: "relative", padding: "0 70px", fontFamily: "Fell SC", fontSize: 28, color: "#3A3026", columnCount: 3 }}>
              Glück Gewinn Spiel Daumen Feed Dopamin Treffer Niete Walze Hebel Münze Belohnung jetzt mehr weiter scrollen Glück Gewinn Spiel Daumen Feed
            </div>
          </Papierstueck>
        </div>
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Kamera über die Timeline ----------
type Zustand = { szene: number; cam: Cam };
export const kamera = (f: number): Zustand => {
  if (f < ZOOM1) return { szene: 1, cam: drift(f, 0, ZOOM1, 1) };
  if (f < WECHSEL1) {
    const vorher = drift(ZOOM1, 0, ZOOM1, 1);
    // Fenster bewegt sich mit dem Hauptobjekt (das ist bei der Fahrt in Ruhe → Fenster fest)
    return { szene: 1, cam: zoomInFenster(vorher, FENSTER1, (f - ZOOM1) / ZOOM_DAUER) };
  }
  return { szene: 2, cam: drift(f, WECHSEL1, 90, 2) };
};

const Welt: React.FC<{ f: number }> = ({ f }) => {
  const { szene, cam } = kamera(f);
  return szene === 1 ? <Szene1 f={f} cam={cam} /> : <Szene2 f={f} cam={cam} />;
};

// ---------- Ton: minimal, natürlich (Papier, Holz, Mechanik, Luft), nichts Synthetisches ----------
const Toene: React.FC = () => {
  const z1 = Z(1);
  const z2 = Z(2);
  return (
    <>
      <Ton nr="papier-02" bei={z1.start} vol={0.16} />
      <Ton nr="papier-03" bei={z1.m.zeile2} vol={0.14} />
      <Ton nr="klick-04" bei={z1.m.wort} vol={0.14} />
      <Ton nr="klick-04" bei={z1.m.wort + 10} vol={0.14} />
      <Ton nr="klick-04" bei={z1.m.wort + 26} vol={0.14} />
      <Ton nr="ratsche-19" bei={z1.m.wort + 4} vol={0.14} max={1.0} />
      <Ton nr="ratsche-12" bei={HOOK_STOPS[0]} vol={0.16} />
      <Ton nr="ratsche-12" bei={HOOK_STOPS[1]} vol={0.16} />
      <Ton nr="schlag-07" bei={HOOK_STOPS[2]} vol={0.22} />
      <Ton nr="whoosh-03" bei={ZOOM1 + 12} vol={0.2} />
      <Ton nr="ratsche-18" bei={SPIN2 + 2} vol={0.11} max={1.4} />
      <Ton nr="papier-01" bei={z2.start + 37} vol={0.2} />
      <Ton nr="schlag-02" bei={z2.m.wort} vol={0.22} />
    </>
  );
};

// ---------- Komposition ----------
export const ReelV2Test: React.FC = () => {
  const f = useCurrentFrame();
  const tempo = Math.abs(Math.log(kamera(f + 0.5).cam.s) - Math.log(kamera(f - 0.5).cam.s));
  return (
    <AbsoluteFill style={{ background: zine.schwarz }}>
      <ZineSchriften />
      <Bewegungsunschaerfe f={f} tempo={tempo} render={(x) => <Welt f={x} />} />
      <Filmlook />
      <Sequence from={Z(1).start} layout="none">
        <Audio src={staticFile(`reels/spielautomat/stimme/${Z(1).datei}`)} />
      </Sequence>
      <Sequence from={Z(2).start} layout="none">
        <Audio src={staticFile(`reels/spielautomat/stimme/${Z(2).datei}`)} />
      </Sequence>
      <Toene />
    </AbsoluteFill>
  );
};
