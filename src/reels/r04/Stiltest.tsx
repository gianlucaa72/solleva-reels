// Reel 04 Stiltest: Satz 1 (Filmcrew) + Satz 2 (Wochenlang). Welten und Objekte von Higgsfield, Rest Code.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { farben } from "../../brand/solleva";
import { Ton } from "../../lib/kamera";
import { kurve, tw } from "../../lib/bewegung";
import { feder } from "../../lib/punchFeder";
import { gleitKamera, halbeKamera } from "../../lib/gleitKamera";
import { kamera1, kamera2 } from "./kamera";
import { Koernung, r04, schriftR04, SchriftenR04, TiltShift } from "./Look";

export { S1, w1, T, SCHNITT, S2, w2, U, STILTEST_DAUER } from "./timeline";
import { S1, w1, T, SCHNITT, S2, U, STILTEST_DAUER } from "./timeline";

// ---------- Helfer ----------
export const Welt: React.FC<{ src: string; breite: number }> = ({ src, breite }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", width: breite, left: (1080 - breite) / 2, top: "50%", transform: "translateY(-50%)" }} />
);

/** Objekt fällt von oben auf den Tisch (von der Kamera weg): gross + unscharf → Landung mit Feder. */
export const fallen = (f: number, start: number, dauer = 7) => {
  const p = Math.min(1, Math.max(0, (f - start) / dauer));
  const k = kurve.whip(p);
  const nach = f - start - dauer;
  const wipp = nach > 0 ? Math.exp(-nach / 4) * Math.sin(nach / 1.6) * 0.025 : 0;
  return { s: 1.7 - 0.7 * k - wipp, blur: (1 - k) * 14, hoehe: 1 + (1 - k) * 5, sichtbar: f >= start, k };
};

/** Fächer: dreht von oben um einen Drehpunkt über dem Bild ein (5 Frames, wie Geldfächer). */
export const faecher = (f: number, start: number, vonGrad: number, dauer = 5) => {
  const t = f - start;
  if (t < 0) return null;
  const p = feder(t * (8 / dauer), 8);
  return { dreh: vonGrad * (1 - p), blur: t < dauer ? (1 - t / dauer) * 10 : 0 };
};

/** Text-Ebene folgt der Kamera nur halb (ruhiger, bleibt in der Safe Zone). */
export const halb = (k: { z: number; x: number; y: number; r: number }) => `translate(${k.x / 2}px, ${k.y / 2}px) scale(${1 + (k.z - 1) / 2}) rotate(${k.r / 2}deg)`;

export const Schatten = (h: number) => `drop-shadow(${10 * h}px ${18 * h}px ${12 * h}px rgba(20,10,40,${0.55 / Math.sqrt(h)}))`;

/** Text kommt aus der Unschärfe (Gucci: 2 Frames Versatz pro Zeile, je ~6 Frames). */
export const Zeile3D: React.FC<{ text: string; start: number; top: number; groesse: number; f: number; farbe?: string; pA?: string; pB?: string }> = ({ text, start, top, groesse, f, farbe = farben.papier, pA = "#C9B48F", pB = "#2B170C" }) => {
  if (f < start) return null;
  const p = tw(f, start, 6, 0, 1, kurve.land);
  const tiefe = 9;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [hex(pA), hex(pB)];
  const sh: string[] = [];
  for (let i = 1; i <= tiefe; i++) {
    const c = a.map((v, k) => Math.round(v + (b[k] - v) * (i / tiefe)));
    sh.push(`${i * 0.7}px ${i}px 0 rgb(${c.join(",")})`);
  }
  sh.push(`18px 30px 26px ${r04.schatten}`);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 140, textAlign: "center", opacity: p, filter: `blur(${(1 - p) * 16}px)`, transform: `scale(${1.25 - 0.25 * p}) rotate(-2deg)` }}>
      <span style={{ fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "118%", fontSize: groesse, lineHeight: 0.86, color: farbe, textShadow: sh.join(","), whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};

/** Wort-für-Wort-Untertitel in Box (Referenz: Phrasen à 2–4 Wörter). */
export type Wort = { w: string; f: number; key?: boolean };
export type UntertitelStil = "klein" | "gross" | "aus";
export const Untertitel: React.FC<{ f: number; phrasen: { von: number; bis: number; woerter: Wort[] }[]; stil?: UntertitelStil }> = ({ f, phrasen, stil = "klein" }) => {
  const ph = phrasen.find((p) => f >= p.von && f < p.bis);
  if (!ph || stil === "aus") return null;
  const pop = tw(f, ph.von, 4, 0.92, 1, kurve.land);
  const gross = stil === "gross";
  return (
    // gross: Unterkante der Pille spätestens bei y 1540 (Safe Zone)
    <div style={{ position: "absolute", ...(gross ? { bottom: 1920 - 1540 } : { top: 1400 }), left: 70, right: 140, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(14,10,40,.82)", borderRadius: gross ? 22 : 12, padding: gross ? "18px 34px" : "10px 22px", transform: `scale(${pop})`, fontFamily: "Barlow", fontWeight: 700, fontSize: gross ? 66 : 44, lineHeight: 1.12, textAlign: "center", maxWidth: 860 }}>
        {ph.woerter.map((w, i) => (
          <span key={i} style={{ color: w.key ? farben.lavendelAkzent : farben.papier, opacity: f >= w.f ? 1 : 0.35 }}>
            {w.w}{i < ph.woerter.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Handschrift schreibt sich von links nach rechts. */
export const Schreiben: React.FC<{ text: string; x: number; y: number; groesse: number; p: number; dreh: number; farbe?: string }> = ({ text, x, y, groesse, p, dreh, farbe = farben.gold }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, clipPath: `inset(-30% ${100 - p * 100}% -30% -5%)` }}>
    <span style={{ fontFamily: schriftR04.marker, fontSize: groesse, color: farbe, textShadow: `4px 6px 6px ${r04.schatten}`, whiteSpace: "nowrap" }}>{text}</span>
  </div>
);

/** Kreidestaub beim Zuklappen. */
export const Staub: React.FC<{ f: number; start: number; x: number; y: number }> = ({ f, start, x, y }) => {
  const t = f - start;
  if (t < 0 || t > 16) return null;
  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.3;
        const v = 8 + (i % 5) * 4;
        const d = v * Math.log(1 + t);
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * d * 1.6, top: y + Math.sin(a) * d * 0.7, width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, borderRadius: "50%", background: "rgba(246,245,252,.85)", opacity: 1 - t / 16, filter: "blur(1px)" }} />;
      })}
    </>
  );
};

/** Kalenderblatt (Papier, Code). */
export const Blatt: React.FC<{ nr: number }> = ({ nr }) => (
  <div style={{ width: 190, height: 220, background: "#F7F3EA", borderRadius: 6, overflow: "hidden", boxShadow: "inset 0 0 30px rgba(120,100,60,.18)" }}>
    <div style={{ height: 52, background: farben.violett, color: farben.papier, fontFamily: schriftR04.mono, fontSize: 22, textAlign: "center", lineHeight: "52px", letterSpacing: "0.1em" }}>WOCHE</div>
    <div style={{ fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "112%", fontSize: 120, color: farben.tinte, textAlign: "center", lineHeight: "160px" }}>{nr}</div>
  </div>
);

// ---------- Szene 1: Filmcrew ----------
export const Szene1: React.FC<{ f: number }> = ({ f }) => {
  // Kamera K04 «Weicher Bounce»: pro Moment eine Richtung (rein, raus, rein), Feder ohne Ruck.
  // Auf «Filmcrew» beginnt der Push, der durch den Schnitt in Satz 2 weiterläuft (Mitte = Schnitt).
  const kam = gleitKamera(f, kamera1());
  // Hook: Die Klappe liegt schon da und schlägt in Frame 1 zu (Aufprall: 104 → 100 %).
  const kl = { sichtbar: true, s: 1 + 0.04 * Math.exp(-f / 3) * Math.cos(f / 1.5), blur: 0, hoehe: 1, k: 1 };
  // Stab: 0 = offen wie im Bild, +11,5 = zu, negativ = weiter offen
  // Nur EIN Schlag (Frame 1), danach bleibt die Klappe zu (Wunsch des Nutzers).
  const stab = f < 1 ? -14 : 11.5 + Math.exp(-(f - 1) / 2) * Math.sin((f - 1) / 1.1) * -2.5;
  const KL_W = 640;
  return (
    <AbsoluteFill style={{ background: "#2a1d14" }}>
      <AbsoluteFill style={{ transform: kam.css, transformOrigin: "50% 40%", filter: `blur(${kam.blur}px)` }}>
        <Welt src="r04/welt-samt-b.png" breite={1100} />
        {/* Anker: die violette Matte ist nur angedeutet (Ecke unten links im Halbdunkel) */}
        <div style={{ position: "absolute", left: -420, top: 1290, width: 900, height: 900, transform: "rotate(-12deg)", filter: "drop-shadow(18px 26px 22px rgba(8,2,30,.75))" }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 18, filter: "brightness(.5) saturate(.9)" }}>
            <Img src={staticFile("r04/welt-matte-a.png")} style={{ width: 1300, marginLeft: -200, marginTop: -400 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(35deg, rgba(10,4,30,.75) 10%, transparent 70%)" }} />
          </div>
        </div>
        {kl.sichtbar && (
          <div style={{ position: "absolute", left: 540 - KL_W / 2, top: 880 - KL_W / 2, width: KL_W, height: KL_W, transform: `scale(${kl.s}) rotate(${-6 + (1 - kl.k) * -18}deg)`, filter: `blur(${kl.blur}px) ${Schatten(kl.hoehe)}` }}>
            <Img src={staticFile("r04/obj-klappe-brett.png")} style={{ position: "absolute", width: "100%" }} />
            <Img src={staticFile("r04/obj-klappe-stab.png")} style={{ position: "absolute", width: "100%", transformOrigin: `${(90 / 1024) * 100}% ${(258 / 1024) * 100}%`, transform: `rotate(${stab}deg)` }} />
          </div>
        )}
        <Staub f={f} start={1} x={760} y={690} />
      </AbsoluteFill>
      <TiltShift blur={10} fokus={50} />
      <AbsoluteFill style={{ transform: halbeKamera(kam), transformOrigin: "50% 40%", filter: `blur(${kam.blur / 2}px)` }}>
        {f >= T.frueher && (
          <Schreiben text="früher …" x={130} y={480} groesse={96} p={tw(f, T.frueher, 10, 0, 1, kurve.linear)} dreh={-7} />
        )}
        <Zeile3D text="FILMCREW" start={1} top={290} groesse={116} f={f} pA="#B9A6F5" pB="#2A1670" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Szene 2: Kamera, Licht, Schnitt. Wochenlang. ----------
export const Szene2: React.FC<{ f: number; ende?: number }> = ({ f, ende = STILTEST_DAUER }) => {
  // Kamera K04: Eintritt (zweite Hälfte des Push aus Satz 1), dann Bounce pro Wort, Übergang in Satz 3.
  const kam = gleitKamera(f, kamera2(ende));
  const objekte = [
    { src: "r04/obj-kamera-a.png", start: U.kamera, x: 290, y: 800, w: 560, dreh: -12, von: -75, pivot: "50% -60%" },
    { src: "r04/obj-lampe-a.png", start: U.licht, x: 790, y: 760, w: 470, dreh: 8, von: 70, pivot: "50% -70%" },
    { src: "r04/obj-filmrolle-a.png", start: U.schnitt, x: 560, y: 1080, w: 470, dreh: -6, von: 80, pivot: "20% -60%" },
  ];
  const licht = f >= U.licht + 6 ? Math.min(1, (f - U.licht - 6) / 3) * (f < U.licht + 9 ? (f % 2 ? 0.4 : 1) : 1) : 0;
  const blaetter = [0, 1, 2, 3, 4, 5].map((i) => ({ nr: i + 1, start: U.wochenlang + 1 + i * 2, x: 90 + (i % 3) * 290 + (i > 2 ? 120 : 0), y: 900 + (i > 2 ? 120 : 0) + (i % 2) * 30, dreh: [-18, 9, -6, 15, -12, 7][i], von: [-60, 50, -70, 65, -55, 60][i] }));
  return (
    <AbsoluteFill style={{ background: "#2a1d14" }}>
      <AbsoluteFill style={{ transform: kam.css, transformOrigin: "50% 40%", filter: `blur(${kam.blur}px)` }}>
        <Welt src="r04/welt-filmset-a.png" breite={1100} />
        {objekte.map((o, i) => {
          const fa = faecher(f, o.start, o.von);
          if (!fa) return null;
          return (
            <div key={i} style={{ position: "absolute", left: o.x - o.w / 2, top: o.y - o.w / 2, width: o.w, height: o.w, transformOrigin: o.pivot, transform: `rotate(${o.dreh + fa.dreh}deg)`, filter: `blur(${fa.blur}px) ${Schatten(1.3)}` }}>
              <Img src={staticFile(o.src)} style={{ width: "100%" }} />
            </div>
          );
        })}
        {/* Lampe geht an: warmes Licht */}
        <AbsoluteFill style={{ opacity: licht, mixBlendMode: "screen", background: "radial-gradient(circle at 795px 770px, rgba(255,236,200,.9) 0, rgba(255,214,150,.45) 70px, rgba(255,190,110,.12) 190px, transparent 320px)" }} />
        <AbsoluteFill style={{ opacity: licht * 0.12, background: "#FFB866", mixBlendMode: "soft-light" }} />
        {blaetter.map((b, i) => {
          const fa = faecher(f, b.start, b.von, 5);
          if (!fa) return null;
          return (
            <div key={i} style={{ position: "absolute", left: b.x, top: b.y, transformOrigin: "50% -120%", transform: `rotate(${b.dreh + fa.dreh}deg)`, filter: `blur(${fa.blur}px) ${Schatten(1)}` }}>
              <Blatt nr={b.nr} />
            </div>
          );
        })}
      </AbsoluteFill>
      <TiltShift blur={10} fokus={50} />
      <AbsoluteFill style={{ transform: halbeKamera(kam), transformOrigin: "50% 40%", filter: `blur(${kam.blur / 2}px)` }}>
        <Zeile3D text="KAMERA." start={U.kamera} top={250} groesse={104} f={f} />
        <Zeile3D text="LICHT." start={U.licht} top={345} groesse={104} f={f} />
        <Zeile3D text="SCHNITT." start={U.schnitt} top={440} groesse={104} f={f} />
        {f >= U.wochenlang + 4 && (
          <Schreiben text="wochenlang." x={190} y={1230} groesse={124} p={tw(f, U.wochenlang + 4, 16, 0, 1, kurve.linear)} dreh={-6} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const R04Stiltest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SchriftenR04 />
      {f < SCHNITT ? <Szene1 f={f} /> : <Szene2 f={f} />}
      <Untertitel
        f={f}
        phrasen={[
          { von: T.fuer, bis: T.brauchte, woerter: [{ w: "Für", f: T.fuer }, { w: "so", f: w1(0.22) }, { w: "ein", f: w1(0.36) }, { w: "Video", f: T.video }] },
          { von: T.brauchte, bis: T.eine, woerter: [{ w: "brauchte", f: T.brauchte }, { w: "man", f: T.man }, { w: "früher", f: T.frueher }] },
          { von: T.eine, bis: SCHNITT, woerter: [{ w: "eine", f: T.eine }, { w: "Filmcrew.", f: T.filmcrew, key: true }] },
          { von: U.kamera, bis: U.licht, woerter: [{ w: "Kamera,", f: U.kamera }] },
          { von: U.licht, bis: U.schnitt, woerter: [{ w: "Licht,", f: U.licht }] },
          { von: U.schnitt, bis: U.wochenlang, woerter: [{ w: "Schnitt.", f: U.schnitt }] },
          { von: U.wochenlang, bis: STILTEST_DAUER - 6, woerter: [{ w: "Wochenlang.", f: U.wochenlang, key: true }] },
        ]}
      />
      <Koernung staerke={0.1} seed={Math.floor(f / 2) % 8} />
      {/* Stimme */}
      <Sequence from={S1} layout="none"><Audio src={staticFile("r04/stimme/s1.mp3")} /></Sequence>
      <Sequence from={S2} layout="none"><Audio src={staticFile("r04/stimme/s2.mp3")} /></Sequence>
      {/* Sounds: stumpfe Grundsounds, ein Akzent pro Wechsel */}
      <Ton nr="swish-02" bei={7} vor={2} vol={0.35} />
      <Ton nr="schlag-07" bei={8} vol={0.4} />
      <Ton nr="klick-04" bei={T.brauchte + 2} vol={0.35} />
      <Ton nr="schreiben-01" bei={T.frueher + 2} vol={0.3} />
      <Ton nr="schlag-07" bei={T.filmcrew} vol={0.95} />
      <Ton nr="schlag-01" bei={T.filmcrew} vol={0.5} />
      <Ton nr="whoosh-03" bei={SCHNITT} vol={0.45} />
      <Ton nr="swish-01" bei={U.kamera + 5} vor={2} vol={0.3} />
      <Ton nr="schlag-01" bei={U.kamera + 6} vol={0.22} />
      <Ton nr="swish-05" bei={U.licht + 5} vor={2} vol={0.3} />
      <Ton nr="klick-01" bei={U.licht + 6} vol={0.4} />
      <Ton nr="swish-06" bei={U.schnitt + 5} vor={2} vol={0.3} />
      <Ton nr="papier-04" bei={U.schnitt + 6} vol={0.55} />
      <Ton nr="papier-05" bei={U.wochenlang + 3} vol={0.4} />
      <Ton nr="ratsche-19" bei={U.wochenlang + 2} vol={0.28} max={1.2} />
      <Ton nr="schreiben-01" bei={U.wochenlang + 6} vol={0.3} />
      <Ton nr="whoosh-02" bei={STILTEST_DAUER - 1} vol={0.45} />
    </AbsoluteFill>
  );
};
