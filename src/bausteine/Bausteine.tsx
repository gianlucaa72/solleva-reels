import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, form, schrift, Stimmung } from "../brand/solleva";
import { kurve, overshoot, tw } from "../lib/bewegung";

export const bausteinKatalog = {
  B01: { name: "Landen", wann: "Objekt fällt mit Unschärfe, staucht beim Aufprall, Schatten wächst · Ref. 02" },
  B06: { name: "Eigenschaften-Karten", wann: "3–4 Karten fliegen im Takt ein, Vorgänger rutscht zur Seite · Ref. 04" },
  B07: { name: "Kalender-Lauf", wann: "Tage rasen vorbei, Markierung springt, landet auf «jetzt» · Ref. 06" },
  E02: { name: "Kranz", wann: "Objekte schiessen ein und legen sich strahlenförmig um ein Zentrum · Ref. 01" },
  U13: { name: "Stakkato", wann: "3–4 harte Schnitte im Takt, jeder in eigener Farbe · Ref. 03" },
  P01: { name: "Schwebende Objekte", wann: "Objekte in 3 Tiefen, vorne unscharf (Parallaxe) · Ref. 03" },
} as const;

// ---------- kleine Requisite: Website-Karte (Platzhalter für echte Screenshots) ----------
export const WebKarte: React.FC<{ s: Stimmung; w?: number; h?: number; titel?: string; akzent?: string; style?: React.CSSProperties }> = ({
  s, w = 420, h = 300, titel = "Website", akzent, style,
}) => (
  <div style={{ width: w, height: h, borderRadius: 26, background: farben.weiss, border: `1.5px solid ${s.rand}`, boxShadow: "0 24px 50px rgba(44,30,120,.22)", overflow: "hidden", ...style }}>
    <div style={{ height: h * 0.13, background: farben.staubgrau, display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: farben.grauHell }} />)}
    </div>
    <div style={{ height: h * 0.4, background: akzent ?? s.akzent, opacity: 0.9, display: "flex", alignItems: "flex-end", padding: 18, boxSizing: "border-box" }}>
      <span style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: h * 0.1, color: farben.weiss }}>{titel}</span>
    </div>
    <div style={{ padding: 18 }}>
      <div style={{ height: 12, width: "80%", background: farben.grauHell, borderRadius: 6, marginBottom: 12 }} />
      <div style={{ height: 12, width: "55%", background: farben.grauHell, borderRadius: 6 }} />
    </div>
  </div>
);

/** B01: Objekt fällt von oben, landet mit Squash, Schatten wächst. */
export const Landen: React.FC<{ start: number; x?: number; boden?: number; dauer?: number; children: React.ReactNode }> = ({
  start, x = 540, boden = 1250, dauer = 12, children,
}) => {
  const f = useCurrentFrame();
  const p = tw(f, start, dauer, 0, 1, (t) => t * t); // Fall beschleunigt
  const y = -700 + (boden + 700) * p;
  const v = f < start + dauer && f >= start ? 1 : 0;
  const k = f - (start + dauer);
  const squash = k >= 0 && k < 10 ? 1 - 0.1 * Math.sin((k / 10) * Math.PI) * Math.exp(-k / 6) : 1;
  const nachfedern = k >= 0 ? Math.sin(k / 2.2) * Math.exp(-k / 5) * 14 : 0;
  const schatten = tw(f, start, dauer, 0.15, 1, kurve.land);
  return (
    <>
      <div style={{ position: "absolute", left: x - 220 * schatten, top: boden + 10, width: 440 * schatten, height: 60 * schatten, borderRadius: "50%", background: "rgba(20,18,58,.28)", filter: "blur(14px)" }} />
      <div style={{ position: "absolute", left: x, top: y - nachfedern, transform: `translate(-50%, -100%) scale(${2 - squash}, ${squash})`, transformOrigin: "50% 100%", filter: v ? "blur(5px)" : "none" }}>
        {children}
      </div>
    </>
  );
};

/** B06: Karten fliegen im Takt ein (Richtung wechselt), Vorgänger rutscht kleiner zur Seite. */
export const EigenschaftenKarten: React.FC<{ s: Stimmung; start: number; woerter: string[]; abstand?: number }> = ({ s, start, woerter, abstand = 15 }) => {
  const f = useCurrentFrame();
  const richtungen = [{ x: -900, y: 300, r: -30 }, { x: 900, y: 200, r: 25 }, { x: 0, y: 1400, r: -12 }, { x: -800, y: -600, r: 20 }];
  const plaetze = [{ x: -250, y: -380, r: -8 }, { x: 260, y: -330, r: 7 }, { x: -230, y: 360, r: 6 }, { x: 250, y: 400, r: -6 }];
  const farbenK = [s.akzent, farben.tinte, farben.lavendelAkzent, farben.violett];
  return (
    <AbsoluteFill>
      {woerter.map((w, i) => {
        const f0 = start + i * abstand;
        if (f < f0) return null;
        const rein = tw(f, f0, 9, 0, 1, kurve.whip);
        const setz = overshoot(f, f0 + 5, 9, 1.05);
        const weg = i < woerter.length - 1 ? tw(f, f0 + abstand, 10, 0, 1, kurve.heavy) : 0;
        const r = richtungen[i % 4];
        const pl = plaetze[i % 4];
        const x = (1 - rein) * r.x + weg * pl.x;
        const y = (1 - rein) * r.y + weg * pl.y;
        const rot = (1 - rein) * r.r + weg * pl.r + Math.sin(f / 20 + i) * 1.2;
        const sc = (0.9 + 0.1 * setz) * (1 - 0.42 * weg);
        return (
          <div key={i} style={{ position: "absolute", left: 540 - 230, top: 960 - 330, width: 460, height: 660, transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${sc})`, filter: `blur(${(1 - rein) * 8}px)` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 30, background: farben.weiss, border: `10px solid ${farben.weiss}`, boxShadow: "0 30px 60px rgba(20,18,58,.35)", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, background: `linear-gradient(160deg, ${farbenK[i % 4]}, ${farben.nacht})`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schrift.mono, color: farben.papier, fontSize: 120, opacity: 0.95 }}>
                {["I", "II", "III", "IV"][i % 4]}
              </div>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schrift.serif, fontStyle: "italic", fontSize: 76, color: farben.tinte }}>{w}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** B07: Kalender rast vorbei, Markierung springt Tag für Tag, landet auf «jetzt». */
export const KalenderLauf: React.FC<{ s: Stimmung; start: number; dauer?: number }> = ({ s, start, dauer = 50 }) => {
  const f = useCurrentFrame();
  const p = tw(f, start, dauer, 0, 1, kurve.heavy);
  const tag = Math.min(31, Math.floor(1 + p * 30));
  const zelle = 150;
  const spalte = (d: number) => (d - 1) % 7;
  const zeile = (d: number) => Math.floor((d - 1) / 7);
  const kamX = -spalte(tag) * zelle + 3 * zelle;
  const kamY = -zeile(tag) * zelle + 1 * zelle;
  const fertig = f >= start + dauer;
  const jetzt = fertig ? overshoot(f, start + dauer, 10, 1.15) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 3.5 * zelle, top: 900 - zelle, transform: `translate(${kamX}px, ${kamY}px)`, filter: fertig ? "none" : "blur(1.2px)" }}>
        {Array.from({ length: 31 }, (_, i) => {
          const d = i + 1;
          const aktiv = d === tag;
          const nah = Math.abs(d - tag) <= 2;
          return (
            <div key={d} style={{ position: "absolute", left: spalte(d) * zelle, top: zeile(d) * zelle, width: zelle, height: zelle, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schrift.text, fontWeight: 700, fontSize: 58, color: s.dunkel ? farben.papier : farben.tinte, opacity: nah ? 1 : 0.3 }}>
              {aktiv && <div style={{ position: "absolute", width: 110, height: 110, borderRadius: 55, background: fertig ? "#2BB673" : s.akzent, transform: `scale(${fertig ? jetzt : 1})`, boxShadow: `0 0 40px ${fertig ? "#2BB673" : s.akzent}` }} />}
              <span style={{ position: "relative", color: aktiv ? farben.weiss : undefined, fontSize: aktiv && fertig ? 40 : 58 }}>{aktiv && fertig ? "jetzt" : d}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** E02: Objekte schiessen von allen Seiten ein und legen sich strahlenförmig um ein Zentrum; Kamera zoomt leicht raus. */
export const Kranz: React.FC<{ s: Stimmung; start: number; anzahl?: number; zentrum?: { x: number; y: number }; children: React.ReactNode; objekt?: (i: number) => React.ReactNode }> = ({
  s, start, anzahl = 16, zentrum = { x: 540, y: 880 }, children, objekt,
}) => {
  const f = useCurrentFrame();
  const kam = 1 - 0.1 * tw(f, start, 14, 0, 1, kurve.heavy);
  const items = Array.from({ length: anzahl }, (_, i) => {
    const w = (i / anzahl) * Math.PI * 2 + (i % 2) * 0.1;
    const f0 = start + (i % 4);
    const p = tw(f, f0, 8, 0, 1, kurve.whip);
    const r = 1500 - (1500 - (430 + (i % 3) * 60)) * p;
    const x = zentrum.x + Math.cos(w) * r * 0.85;
    const y = zentrum.y + Math.sin(w) * r * 1.15;
    const rot = (w * 180) / Math.PI + 90 + Math.sin(f / 25 + i) * 2;
    return (
      <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${1.4 - 0.4 * p})`, filter: `blur(${(1 - p) * 10}px)` }}>
        {objekt ? objekt(i) : (
          <div style={{ width: 300, height: 170, borderRadius: 18, background: i % 3 === 0 ? s.akzent : farben.weiss, border: `2px solid ${s.rand}`, boxShadow: "0 16px 30px rgba(20,18,58,.3)", padding: 18, boxSizing: "border-box" }}>
            <div style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 30, color: i % 3 === 0 ? farben.weiss : farben.tinte }}>Neue Anfrage</div>
            <div style={{ height: 10, width: "70%", marginTop: 14, borderRadius: 5, background: i % 3 === 0 ? "rgba(255,255,255,.5)" : farben.grauHell }} />
          </div>
        )}
      </div>
    );
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${kam})` }}>
      {children}
      {items}
    </AbsoluteFill>
  );
};

/** U13: Stakkato, harte Schnitte im Takt, jede Karte eigene Farbe. */
export const Stakkato: React.FC<{ start: number; teile: { text: string; bg: string; farbe: string }[]; takt?: number }> = ({ start, teile, takt = 7 }) => {
  const f = useCurrentFrame();
  const i = Math.floor((f - start) / takt);
  if (f < start || i >= teile.length) return null;
  const t = teile[i];
  const k = f - start - i * takt;
  const sc = tw(k, 0, 4, 1.25, 1, kurve.whip);
  return (
    <AbsoluteFill style={{ background: t.bg, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${sc})` }}>
        <div style={{ width: 120, height: 8, background: t.farbe, opacity: 0.6 }} />
        <span style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 380, color: t.farbe, lineHeight: 1 }}>{t.text}</span>
        <div style={{ width: 120, height: 8, background: t.farbe, opacity: 0.6 }} />
      </div>
    </AbsoluteFill>
  );
};

/** P01: schwebende Objekte in 3 Tiefen (vorne gross + unscharf, hinten klein + scharf). */
export const Schweben: React.FC<{ anzahl?: number; objekt: (i: number, tiefe: number) => React.ReactNode }> = ({ anzahl = 12, objekt }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: anzahl }, (_, i) => {
        const tiefe = i % 3; // 0 hinten, 2 vorne
        const sc = [0.5, 0.85, 1.6][tiefe];
        const speed = [0.6, 1.1, 2.2][tiefe];
        const x = ((i * 293) % 1180) - 50;
        const y = (((i * 677) % 2200) - f * speed * 2 + 4000) % 2200 - 140;
        const rot = Math.sin(f / 30 + i) * 20 + i * 30;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `scale(${sc}) rotate(${rot}deg)`, filter: tiefe === 2 ? "blur(6px)" : tiefe === 0 ? "blur(1px)" : "none", opacity: tiefe === 0 ? 0.8 : 1 }}>
            {objekt(i, tiefe)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Muenze: React.FC<{ farbe?: string }> = ({ farbe = farben.gold }) => (
  <div style={{ width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle at 35% 30%, #FFF1C9, ${farbe} 55%, #B98A2E)`, boxShadow: "0 10px 20px rgba(0,0,0,.25), inset 0 0 0 8px rgba(255,255,255,.25)" }} />
);

export const Funke: React.FC<{ s: Stimmung }> = ({ s }) => (
  <div style={{ width: 90, height: 90, borderRadius: form.radius / 2, background: s.akzent, boxShadow: `0 0 30px ${s.akzent}`, opacity: 0.85 }} />
);
