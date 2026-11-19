import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Kamera, Ton } from "../../lib/kamera";
import { kurve, overshoot, tw } from "../../lib/bewegung";
import { HZeitung, Korn, stile, weisserRand, zine, ZineSchriften } from "../../stil/halbton";

// 5-Sekunden-Stiltest «Spielautomat»: Szene 1 (Hook) komplett + Übergang (Zoom ins Handy) + Anfang Szene 2.
// Zeiten in Frames (30 fps), aus timeline.json + Hüllkurve Satz 1 («gerade» ab 1,06 s, «Spielautomaten» ab 2,06 s).
export const T = {
  stimme1: 4,
  zeile2: 36,
  wort: 66, // «Spielautomaten»
  hebel: 68,
  stop: [100, 111, 124],
  zoom: 137, // = Start Satz 2 (Hook-Pause 1,4 s zum Lesen)
  zoomDauer: 14,
  los: 150,
  dreh: 180, // «Dreh»
};
export const STILTEST_DAUER = 232;

// ---------- Objekt: Hand + Handy (Higgsfield, freigestellt) ----------
export const BILD = { w: 880, h: 1168, screen: { x: 71, y: 309, w: 329, h: 560 } };
export const S = 1.22;
export const POS = { x: 1090 - BILD.w * S, y: 486 };
export const screenFrame = () => ({
  x: POS.x + BILD.screen.x * S,
  y: POS.y + BILD.screen.y * S,
  w: BILD.screen.w * S,
  h: BILD.screen.h * S,
});

// ---------- Walzen ----------
export const SYMBOLE = ["♥", "✕", "★", "?", "♣", "✕"];
export const symbolFarbe = (c: string) => (c === "♥" ? zine.rot : c === "?" ? zine.violett : zine.schwarz);

/** Position (in Zellen) einer Walze: steht, dreht ab start, rastet bei stop auf Ziel ein (mit Overshoot). */
export const walzenPos = (f: number, start: number, stop: number, startIdx: number, zielIdx: number, tempo = 0.55) => {
  const n = SYMBOLE.length;
  if (f < start) return startIdx;
  const bremsBeginn = stop - 10;
  const anlauf = (x: number) => startIdx + tempo * (x - start) * Math.min(1, (x - start) / 6);
  if (f < bremsBeginn) return anlauf(f);
  const p0 = anlauf(bremsBeginn);
  let ziel = Math.ceil(p0 + 2);
  while (((ziel % n) + n) % n !== zielIdx) ziel++;
  const t = Math.min(1, (f - bremsBeginn) / 10);
  const ueber = f >= stop && f < stop + 6 ? Math.sin(((f - stop) / 6) * Math.PI) * 0.12 : 0;
  return p0 + (ziel - p0) * kurve.land(t) + ueber;
};

export const Walze: React.FC<{ p: number; tempo: number; w: number; h: number; dunkel?: boolean }> = ({ p, tempo, w, h }) => {
  const n = SYMBOLE.length;
  const off = ((p % n) + n) % n;
  const zelle = h;
  return (
    <div style={{ width: w, height: h, overflow: "hidden", background: "#fff", border: `${Math.max(3, w * 0.04)}px solid ${zine.schwarz}`, borderRadius: w * 0.08, position: "relative", boxShadow: "inset 0 14px 14px rgba(0,0,0,.18), inset 0 -14px 14px rgba(0,0,0,.18)" }}>
      <div style={{ transform: `translateY(${-off * zelle + zelle * 0}px)`, filter: `blur(${Math.min(10, tempo * 14)}px)` }}>
        {[...SYMBOLE, ...SYMBOLE].map((c, i) => (
          <div key={i} style={{ height: zelle, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rye", fontSize: w * 0.66, color: symbolFarbe(c), lineHeight: 1 }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Walzenreihe: React.FC<{ f: number; w: number; h: number; start: number; stops: number[]; ziele: number[]; startIdx?: number[] }> = ({ f, w, h, start, stops, ziele, startIdx = [1, 2, 3] }) => (
  <div style={{ display: "flex", gap: w * 0.12 }}>
    {stops.map((st, i) => {
      const p = walzenPos(f, start + i * 2, st, startIdx[i], ziele[i]);
      const v = Math.abs(walzenPos(f + 1, start + i * 2, st, startIdx[i], ziele[i]) - p);
      return <Walze key={i} p={p} tempo={v} w={w} h={h} />;
    })}
  </div>
);

// ---------- Texte (animiert) ----------
export const EtikettAnim: React.FC<{ text: string; x: number; y: number; dreh: number; start: number; f: number }> = ({ text, x, y, dreh, start, f }) => {
  if (f < start - 1) return null;
  const s = tw(f, start, 6, 1.35, 1, kurve.whip);
  const o = tw(f, start - 1, 3, 0, 1, kurve.fade);
  const r = tw(f, start, 8, dreh - 7, dreh, kurve.land);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg) scale(${s})`, transformOrigin: "left center", opacity: o, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 42, letterSpacing: "0.12em", padding: "10px 22px", boxShadow: "5px 8px 0 rgba(0,0,0,.25)" }}>
      {text}
    </div>
  );
};

export const ErpresserAnim: React.FC<{ text: string; x: number; y: number; size: number; versatz?: number; start: number; takt?: number; f: number }> = ({ text, x, y, size, versatz = 0, start, takt = 2, f }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 6 }}>
    {text.split("").map((c, i) => {
      const st = stile[(i + versatz) % stile.length];
      const ein = start + i * takt;
      const dreh = ((i * 37 + versatz * 11) % 13) - 6;
      const hub = ((i * 53) % 21) - 10;
      const sc = f < ein ? 0 : tw(f, ein, 5, 1.7, 1, kurve.whip);
      const o = f < ein ? 0 : 1;
      return (
        <div key={i} style={{ ...st, opacity: o, fontSize: size * (0.9 + ((i * 29) % 5) * 0.05), lineHeight: 1, padding: `${size * 0.08}px ${size * 0.12}px ${size * 0.02}px`, transform: `rotate(${dreh + (sc - 1) * 20}deg) translateY(${hub}px) scale(${sc})`, boxShadow: "4px 7px 0 rgba(0,0,0,.22)", textTransform: "uppercase" }}>
          {c}
        </div>
      );
    })}
  </div>
);

// ---------- Hintergrund: Strahlen (Higgsfield-Textur), dreht langsam ----------
export const StrahlenBild: React.FC<{ f: number; cx: number; cy: number; bild?: string; grund?: string; tempo?: number }> = ({ f, cx, cy, bild = "strahlen-rot-a", grund = "#5A0E12", tempo = 0.09 }) => {
  const g = 2520;
  return (
    <AbsoluteFill style={{ background: grund, overflow: "hidden" }}>
      <Img src={staticFile(`assets/spielautomat/${bild}.png`)} style={{ position: "absolute", left: cx - g / 2, top: cy - g / 2, width: g, height: g, transform: `rotate(${f * tempo}deg) scale(${1 + Math.sin(f / 40) * 0.01})` }} />
    </AbsoluteFill>
  );
};

// ---------- Szene 1: Hook ----------
export const Szene1: React.FC<{ f: number }> = ({ f }) => {
  const sf = screenFrame();
  // Objekt fliegt von unten rechts ein
  const ein = tw(f, 0, 12, 1, 0, kurve.whip);
  const landen = f >= 10 ? overshoot(f, 10, 10, 1.03) : 1;
  // Hebelzug: ganzes Objekt nickt nach unten (Drehpunkt am Hebel)
  const zug = f < T.hebel ? 0 : f < T.hebel + 6 ? tw(f, T.hebel, 6, 0, 1, kurve.whip) : tw(f, T.hebel + 6, 16, 1, 0, kurve.land);
  const wackel = f >= T.stop[2] && f < T.stop[2] + 10 ? Math.sin((f - T.stop[2]) * 1.6) * (1 - (f - T.stop[2]) / 10) * 1.2 : 0;
  return (
    <AbsoluteFill>
      <StrahlenBild f={f} cx={sf.x + sf.w / 2} cy={sf.y + sf.h / 2} />
      {/* Hand + Handy */}
      <div
        style={{
          position: "absolute",
          left: POS.x,
          top: POS.y,
          width: BILD.w * S,
          height: BILD.h * S,
          transformOrigin: `${470 * S}px ${760 * S}px`,
          transform: `translate(${ein * 500}px, ${ein * 900}px) rotate(${ein * 18 + zug * 4 + wackel}deg) translateY(${zug * 16}px) scale(${landen})`,
          filter: `${weisserRand(8)} blur(${ein * 6}px)`,
        }}
      >
        <Img src={staticFile("assets/spielautomat/hand-b-frei.png")} style={{ width: "100%", height: "100%" }} />
        {/* Walzen auf dem Bildschirm */}
        <div style={{ position: "absolute", left: BILD.screen.x * S, top: BILD.screen.y * S, width: sf.w, height: sf.h, borderRadius: 18, background: "#EDEAE2", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ fontFamily: "Rye", fontSize: 52, color: zine.rot, letterSpacing: "0.04em" }}>JACKPOT</div>
          <Walzenreihe f={f} w={108} h={176} start={T.hebel + 2} stops={T.stop} ziele={[0, 0, 3]} />
          <div style={{ width: sf.w * 0.7, height: 6, background: zine.schwarz, opacity: 0.8 }} />
        </div>
      </div>
      {/* Text */}
      <EtikettAnim text="DEIN DAUMEN ZIEHT" x={70} y={250} dreh={-3} start={T.stimme1} f={f} />
      <EtikettAnim text="GERADE AN EINEM" x={240} y={338} dreh={2} start={T.zeile2} f={f} />
      <ErpresserAnim text="SPIEL" x={80} y={432} size={120} start={T.wort} f={f} />
      <ErpresserAnim text="AUTOMATEN" x={50} y={584} size={92} versatz={3} start={T.wort + 10} f={f} />
      <Korn staerke={0.16} />
    </AbsoluteFill>
  );
};

// ---------- Szene 2: «Jeder Wisch ist ein neuer Dreh.» (Lotterie-Los + grosse Walzen) ----------
export const Szene2: React.FC<{ f: number }> = ({ f }) => {
  const g = f - T.zoom;
  const losP = tw(f, T.los, 10, 1, 0, kurve.whip);
  const losLand = f >= T.los + 8 ? overshoot(f, T.los + 8, 8, 1.03) : 1;
  const wortS = f < T.dreh ? 0 : tw(f, T.dreh, 6, 1.8, 1, kurve.whip);
  return (
    <AbsoluteFill>
      <HZeitung f={g} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 55%, transparent 40%, rgba(40,25,10,.35))" }} />
      {/* Lotterie-Los */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 840, transform: `translateY(${losP * -900}px) rotate(${-3 + losP * -25}deg) scale(${losLand})`, filter: "drop-shadow(10px 14px 0 rgba(0,0,0,.28))" }}>
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
      {/* grosse Walzen, drehen durchgehend */}
      <div style={{ position: "absolute", left: 100, top: 820, filter: weisserRand(8) }}>
        <Walzenreihe f={f} w={260} h={380} start={T.zoom - 4} stops={[9999, 9999, 9999]} ziele={[0, 0, 0]} startIdx={[0, 2, 4]} />
      </div>
      <Korn staerke={0.16} />
    </AbsoluteFill>
  );
};

// ---------- Komposition ----------
export const Stiltest: React.FC = () => {
  const f = useCurrentFrame();
  const sf = screenFrame();
  const cx = sf.x + sf.w / 2;
  const cy = sf.y + sf.h / 2;
  const zp = tw(f, T.zoom, T.zoomDauer, 0, 1, kurve.whip);
  const zMax = Math.max(1080 / sf.w, 1920 / sf.h) * 1.04;
  const z = 1 + (zMax - 1) * zp;
  const dx = (540 - cx) * zp;
  const dy = (960 - cy) * zp;
  // Bildschirm-Rechteck nach Zoom (in Bildkoordinaten)
  const r = { x: 540 + (cx - 540) * (1 - zp) - (sf.w * z) / 2 + 0, y: 960 + (cy - 960) * (1 - zp) - (sf.h * z) / 2, w: sf.w * z, h: sf.h * z };
  const s2 = Math.max(r.w / 1080, r.h / 1920);
  const zeigeS1 = f < T.zoom + T.zoomDauer;
  return (
    <AbsoluteFill style={{ background: zine.schwarz }}>
      <ZineSchriften />
      {zeigeS1 && (
        <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `translate(${dx}px, ${dy}px) scale(${z})`, filter: zp > 0 && zp < 1 ? `blur(${Math.sin(zp * Math.PI) * 3}px)` : undefined }}>
          <Kamera dauer={T.zoom} push={0.03} drift={4} dreh={0.4}>
            <Szene1 f={f} />
          </Kamera>
        </AbsoluteFill>
      )}
      {f >= T.zoom && (
        <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", borderRadius: 18 * z * (1 - zp) }}>
          <div style={{ position: "absolute", left: (r.w - 1080 * s2) / 2, top: (r.h - 1920 * s2) / 2, width: 1080, height: 1920, transform: `scale(${s2})`, transformOrigin: "0 0" }}>
            <Kamera dauer={STILTEST_DAUER - T.zoom} push={0.03} drift={4} dreh={0.4} seed={2}>
              <Szene2 f={f} />
            </Kamera>
          </div>
        </div>
      )}

      {/* Stimme */}
      <Sequence from={T.stimme1} layout="none">
        <Audio src={staticFile("reels/spielautomat/stimme/satz_01.wav")} />
      </Sequence>
      <Sequence from={T.zoom} layout="none">
        <Audio src={staticFile("reels/spielautomat/stimme/satz_02.wav")} />
      </Sequence>

      {/* Sounds: Swish VOR der Bewegung, Klick/Schlag exakt auf Landung */}
      <Ton nr="swish-04" bei={8} vor={2} vol={0.32} />
      <Ton nr="papier-02" bei={T.stimme1} vol={0.3} />
      <Ton nr="papier-02" bei={T.zeile2} vol={0.3} />
      {Array.from({ length: 5 }, (_, i) => <Ton key={`a${i}`} nr="klick-04" bei={T.wort + i * 2} vol={0.22} />)}
      {Array.from({ length: 9 }, (_, i) => (i % 2 === 0 ? <Ton key={`b${i}`} nr="klick-04" bei={T.wort + 10 + i * 2} vol={0.22} /> : null))}
      <Ton nr="ratsche-09" bei={T.hebel + 2} vol={0.3} max={1.7} />
      {T.stop.map((s, i) => <Ton key={`s${i}`} nr={i === 2 ? "schlag-07" : "klick-02"} bei={s} vol={i === 2 ? 0.45 : 0.3} />)}
      <Ton nr="whoosh-02" bei={T.zoom + 6} vor={2} vol={0.38} />
      <Ton nr="papier-01" bei={T.los + 9} vol={0.32} />
      <Ton nr="ratsche-10" bei={T.zoom + 40} vol={0.2} max={2.6} />
      <Ton nr="schlag-03" bei={T.dreh} vol={0.45} />
    </AbsoluteFill>
  );
};
