import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { farben, schrift, stimmungen } from "../../brand/solleva";
import { kurve, tw } from "../../lib/bewegung";
import { Kamera, Ton } from "../../lib/kamera";
import { Label, Schriften, Serif } from "../../components/Basis";
import { GymSeite, GYM } from "./GymSeite";
import { SzHandlung, SzLadezeit } from "./Szenen";

// 5-Sekunden-Stiltest: Ende Schicht 3 → LICHT AUS (Signature) → Wisch in Ladezeit.
// Zeiten aus der Stimme (silencedetect + Hüllkurve, 30 fps):
export const ST = {
  satz5: 0, // Ausschnitt satz-05 ab 3,10 s («anklickbar»)
  satz6: 30, // «Und vier … sieht keiner.»
  vier: 45, // Onset «vier» (0,50 s) → LICHT AUS
  sieht: 77, // Onset «sieht» (1,55 s)
  keiner: 88, // Onset «keiner» (1,95 s)
  wisch: 104, // U18 raus/rein (8 Frames)
  satz7: 109, // «Lädt sie auf dem Handy über drei Sekunden,»
  ende: 186,
};
export const STILTEST_DAUER = ST.ende;

const S2 = stimmungen.S2;
// f (äusserer Frame) wird nur noch im Ton genutzt
const pfad = (v: string) => staticFile(`assets/reels/vier-schichten/${v}`);

/** U18 Unschärfe-Wisch (aus Referenz 0:03): 8 Frames, Whip, diagonal nach rechts oben, Bewegungsunschärfe. */
const Wisch: React.FC<{ start: number; rolle: "raus" | "rein"; dauer?: number; children: React.ReactNode }> = ({ start, rolle, dauer = 8, children }) => {
  const f = useCurrentFrame();
  const p = rolle === "raus" ? tw(f, start, dauer, 0, 1, kurve.whip) : tw(f, start, dauer, 1, 0, kurve.whip);
  const v = rolle === "raus" ? Math.abs(tw(f + 0.5, start, dauer, 0, 1, kurve.whip) - tw(f - 0.5, start, dauer, 0, 1, kurve.whip)) : Math.abs(tw(f + 0.5, start, dauer, 1, 0, kurve.whip) - tw(f - 0.5, start, dauer, 1, 0, kurve.whip));
  const dx = (rolle === "raus" ? 1 : -1) * 1300 * p;
  const dy = (rolle === "raus" ? -1 : 1) * 700 * p;
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${(rolle === "raus" ? -1 : 1) * 6 * p}deg)`, filter: `blur(${Math.min(28, v * 140)}px)` }}>{children}</AbsoluteFill>;
};

/** Neonröhre geht an: flackert 1–0–1–0,3–1 und steigt dann weich. */
const neonAn = (f: number, start: number) => {
  const d = f - start;
  if (d < 0) return 0;
  const muster = [0.9, 0, 0, 0.7, 0.15, 0, 1, 0.4];
  if (d < muster.length) return muster[d];
  return tw(d, muster.length, 10, 0.6, 1, kurve.land);
};

/** Signature-Szene: Licht aus → Neon-Gitter (Higgsfield H5) + Drahtgitter-Website im Lichtkegel. */
const SzLichtAusEcht: React.FC<{ video: string; lokalAus: number; lokalSieht: number; lokalKeiner: number; dauer: number }> = ({ video, lokalAus, lokalSieht, lokalKeiner, dauer }) => {
  const f = useCurrentFrame();
  const dunkel = f >= lokalAus;
  const an = neonAn(f, lokalAus + 2);
  const scan = tw(f, lokalAus + 3, 14, 0, 1, kurve.heavy); // Drahtgitter wird von oben nach unten «gescannt»
  const dreh = -30 + Math.sin(f / 50) * 5 + tw(f, lokalAus, dauer, 0, 8, kurve.heavy);
  const schwebe = Math.sin(f / 22) * 10;
  const wortVier = tw(f, 0, 8, 0, 1, kurve.land);
  const wortSieht = tw(f, lokalSieht, 6, 0, 1, kurve.land);
  const wortKeiner = tw(f, lokalKeiner, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {dunkel && (
        <AbsoluteFill style={{ opacity: an }}>
          <OffthreadVideo src={pfad(video)} startFrom={0} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      <Kamera dauer={dauer} push={0.07} rucke={[lokalAus, lokalKeiner]}>
        {dunkel && (
          <>
            {/* Glühen am Boden unter der Seite */}
            <div style={{ position: "absolute", left: 240, top: 1440, width: 600, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(169,139,255,.55), transparent 70%)", filter: "blur(20px)", opacity: an }} />
            <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: "540px 700px", transform: `translateY(${schwebe}px)` }}>
              <div style={{ position: "absolute", left: 500 - GYM.w / 2, top: 1010 - GYM.h / 2, width: GYM.w, height: GYM.h, transformStyle: "preserve-3d", transform: `scale(0.82) rotateX(56deg) rotateZ(${dreh}deg)` }}>
                {/* unterste, unsichtbare Ebene: gestrichelt, leuchtet auf «keiner» cyan auf */}
                {(() => {
                  const k = f >= lokalKeiner ? Math.max(0, 1 - (f - lokalKeiner) / 18) : 0;
                  const glimm = tw(f, lokalKeiner, 6, 0, 1, kurve.land);
                  return (
                    <div style={{ position: "absolute", inset: 0, borderRadius: 30, border: `${2 + glimm * 2}px dashed ${glimm > 0 ? farben.cyan : farben.lavendelAkzent}`, opacity: (0.45 + 0.55 * glimm) * an, background: `rgba(143,227,255,${0.08 * glimm + 0.25 * k})`, boxShadow: `0 0 ${30 + 60 * k}px ${glimm > 0 ? farben.cyan : farben.violett}` }}>
                      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: schrift.mono, fontSize: 30, letterSpacing: "0.14em", color: farben.cyan, opacity: glimm }}>04 · LADEZEIT · MOBILE · SEO · revDSG</div>
                    </div>
                  );
                })()}
                {/* drei Drahtgitter-Ebenen darüber, gestaffelt gescannt */}
                {[0, 1, 2].map((i) => {
                  const sc = tw(f, lokalAus + 3 + i * 3, 14, 0, 1, kurve.heavy);
                  const z = 110 * (i + 1);
                  return (
                    <React.Fragment key={i}>
                      <div style={{ position: "absolute", inset: 0, transform: `translateZ(${z}px)`, clipPath: `inset(0 0 ${(1 - sc) * 100}% 0)`, opacity: i === 2 ? 1 : 0.55 }}>
                        <div style={{ position: "absolute", inset: 0, borderRadius: 30, border: `2px solid ${farben.lavendelAkzent}`, background: "rgba(17,20,58,.25)", boxShadow: `0 0 24px ${farben.violett}, inset 0 0 30px rgba(169,139,255,.25)` }} />
                        {i === 2 && <GymSeite m="draht" />}
                        {i === 1 && <div style={{ position: "absolute", left: 120, top: 400, width: 400, height: 110, borderRadius: 55, border: `3px solid ${farben.lavendelAkzent}`, boxShadow: `0 0 20px ${farben.violett}` }} />}
                        {i === 0 && [0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 40 + j * 190, top: 60, width: 170, height: 240, borderRadius: 20, border: `2px solid ${farben.lavendelAkzent}` }} />)}
                      </div>
                      <div style={{ position: "absolute", left: -20, right: -20, top: sc * GYM.h - 3, height: 6, transform: `translateZ(${z}px)`, background: farben.papier, boxShadow: `0 0 30px 8px ${farben.lavendelAkzent}`, opacity: sc > 0 && sc < 1 ? 1 : 0 }} />
                    </React.Fragment>
                  );
                })}
              </div>
            </AbsoluteFill>
          </>
        )}
        {!dunkel && (
          <AbsoluteFill style={{ background: farben.lavendel }}>
            <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: "540px 700px" }}>
              <div style={{ position: "absolute", left: 540 - GYM.w / 2, top: 900 - GYM.h / 2, width: GYM.w, height: GYM.h, transform: `scale(0.86) rotateX(56deg) rotateZ(${dreh}deg)`, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 80px rgba(44,30,120,.3)" }}>
                <GymSeite />
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        )}
      </Kamera>
      {/* Schwarzbild 2 Frames genau auf «vier» */}
      <AbsoluteFill style={{ background: "#000", opacity: f >= lokalAus && f < lokalAus + 2 ? 1 : 0 }} />
      <Label s={dunkel ? S2 : stimmungen.S1} text="// 04 Das Unsichtbare" x={70} y={230} />
      <div style={{ position: "absolute", left: 70, right: 140, top: 290, fontFamily: schrift.text, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.02em", color: dunkel ? farben.papier : farben.tinte }}>
        <span style={{ opacity: wortVier }}>Und vier …</span>{" "}
        <span style={{ opacity: wortSieht, display: "inline-block", transform: `translateY(${(1 - wortSieht) * 20}px)` }}>sieht</span>
        <br />
        <span style={{ display: "inline-block", opacity: wortKeiner, transform: `scale(${0.85 + 0.15 * wortKeiner})`, transformOrigin: "0 70%", filter: `blur(${(1 - wortKeiner) * 14}px)` }}>
          <Serif s={S2} style={{ color: farben.lavendelAkzent, fontSize: "1.18em", textShadow: `0 0 30px ${farben.violett}, 0 0 60px ${farben.violett}` }}>keiner.</Serif>
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Stiltest: React.FC<{ video: string }> = ({ video }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Schriften />
      {/* Ende Schicht 3 */}
      <Sequence from={0} durationInFrames={ST.satz6} layout="none">
        <Sequence from={-50} layout="none">
          <SzHandlung dauer={90} />
        </Sequence>
      </Sequence>
      {/* Signature (ab Satz 6 sichtbar; davor Schicht 3 bis «vier») */}
      <Sequence from={ST.satz6} durationInFrames={ST.wisch + 8 - ST.satz6} layout="none">
        <Wisch start={ST.wisch - ST.satz6} rolle="raus">
          <SzLichtAusEcht video={video} lokalAus={ST.vier - ST.satz6} lokalSieht={ST.sieht - ST.satz6} lokalKeiner={ST.keiner - ST.satz6} dauer={ST.wisch - ST.satz6} />
        </Wisch>
      </Sequence>
      {/* Ladezeit: Hintergrund läuft weiter, Vordergrund wischt rein */}
      <Sequence from={ST.wisch} layout="none">
        <AbsoluteFill>
          <OffthreadVideo src={pfad(video)} startFrom={ST.wisch - ST.vier} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        <Wisch start={0} rolle="rein">
          <Sequence from={ST.satz7 - ST.wisch} layout="none">
            <SzLadezeit dauer={110} ohneHintergrund />
          </Sequence>
        </Wisch>
      </Sequence>

      {/* ---------- Ton ---------- */}
      <Sequence from={ST.satz5} durationInFrames={24} layout="none">
        <Audio src={pfad("stimme/satz-05.wav")} startFrom={Math.round(3.1 * 30)} />
      </Sequence>
      <Sequence from={ST.satz6} layout="none">
        <Audio src={pfad("stimme/satz-06.wav")} />
      </Sequence>
      <Sequence from={ST.satz7} durationInFrames={ST.ende - ST.satz7} layout="none">
        <Audio src={pfad("stimme/satz-07.wav")} volume={(fr) => (fr > ST.ende - ST.satz7 - 10 ? Math.max(0, (ST.ende - ST.satz7 - fr) / 10) : 1)} />
      </Sequence>
      {/* Klick auf Nummer (Schicht 3, lokaler Klick 62 → Frame 12) */}
      <Ton nr="klick-03" bei={12} vol={0.35} />
      <Ton nr="pop-02" bei={20} vol={0.3} />
      <Ton nr="pop-02" bei={26} vol={0.25} />
      {/* LICHT AUS: tiefer Schlag exakt auf «vier», danach Glitch beim Neon-Anflackern */}
      <Ton nr="schlag-02" bei={ST.vier} vol={0.9} max={2.5} />
      <Ton nr="glitch-03" bei={ST.vier + 3} vol={0.25} />
      <Ton nr="glitzer-04" bei={ST.vier + 10} vol={0.25} />
      {/* «keiner»: kleiner Kamera-Ruck + Bass */}
      <Ton nr="schlag-01" bei={ST.keiner} vol={0.45} />
      {/* Wisch: Swish 2 Frames vor der Bewegung */}
      <Ton nr="swish-02" bei={ST.wisch + 3} vor={2} vol={0.55} />
      {/* Ladebalken */}
      <Ton nr="ratsche-19" bei={ST.satz7 + 6} vol={0.25} max={2.2} />
    </AbsoluteFill>
  );
};
