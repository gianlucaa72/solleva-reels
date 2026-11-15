import React from "react";
import { useCurrentFrame } from "remotion";
import { schrift, Stimmung } from "../brand/solleva";
import { kurve, overshoot, tw } from "../lib/bewegung";

// Bibliothek der Text-Effekte. Schlüsselwort im Text mit *Sternchen* markieren: "Deine *Website* arbeitet."

export const textKatalog = {
  X01: { name: "Wort-für-Wort aufhellen", wann: "Captions synchron zur Stimme (Standard)" },
  X02: { name: "Masken-Aufstieg", wann: "Headlines, ruhige edle Momente" },
  X03: { name: "Serif-Akzent mit Unterstrich", wann: "Das eine Schlüsselwort des Satzes" },
  X04: { name: "Tippen mit Cursor", wann: "Suche, Chat, «ich schreibe dir»" },
  X05: { name: "Zähler", wann: "Fortschritt, symbolische Werte (keine erfundenen Statistiken)" },
  X06: { name: "Durchstreichen + Ersetzen", wann: "Humor-/Bruch-Moment" },
  X07: { name: "Wort-Schlag", wann: "Hook in Sekunde 1, ein riesiges Wort" },
} as const;

type Wort = { t: string; key: boolean };
const zerlege = (text: string): Wort[] =>
  text.split(" ").map((w) => (w.startsWith("*") ? { t: w.replace(/\*/g, ""), key: true } : { t: w, key: false }));

// Ungleichmässige Abstände (motion-design Regel 5), deterministisch
const versatz = [0, 6, 13, 18, 26, 31, 39, 45, 52, 58, 66, 71];

const basis = (s: Stimmung, size: number): React.CSSProperties => ({
  fontFamily: schrift.text,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.04,
  letterSpacing: "-0.02em",
  color: s.tinte,
});

const keyStyle = (s: Stimmung): React.CSSProperties => ({
  fontFamily: schrift.serif,
  fontStyle: "italic",
  fontWeight: 400,
  color: s.akzent,
  letterSpacing: "-0.01em",
  fontSize: "1.08em",
});

type Gemeinsam = { s: Stimmung; text: string; start: number; size?: number; x?: number; y?: number; w?: number; woerter?: number[] };

/** X01: ganzer Satz steht leise, jedes Wort wird beim Sprechen voll (kleiner Hub). */
export const WortAufhellen: React.FC<Gemeinsam> = ({ s, text, start, size = 96, x = 70, y = 300, w = 870, woerter }) => {
  const frame = useCurrentFrame();
  const ws = zerlege(text);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, ...basis(s, size) }}>
      {ws.map((wd, i) => {
        const f0 = start + (woerter?.[i] ?? versatz[i % versatz.length] + Math.floor(i / versatz.length) * 72);
        const p = tw(frame, f0, 7, 0, 1, kurve.land);
        const puls = wd.key ? 1 + 0.06 * Math.sin(Math.min(1, Math.max(0, (frame - f0 - 4) / 10)) * Math.PI) : 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              transform: `translateY(${(1 - p) * 8}px) scale(${puls})`,
              transformOrigin: "50% 70%",
              color: p > 0.5 ? (wd.key ? s.akzent : s.tinte) : s.leise,
              transition: "none",
              ...(wd.key ? keyStyle(s) : {}),
              opacity: 0.35 + 0.65 * p,
            }}
          >
            {wd.t}
          </span>
        );
      })}
    </div>
  );
};

/** X02: Zeilen steigen aus einer unsichtbaren Maske auf. Zeilen mit | trennen. */
export const MaskenAufstieg: React.FC<Gemeinsam & { align?: "left" | "center" }> = ({
  s,
  text,
  start,
  size = 120,
  x = 70,
  y = 640,
  w = 870,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const zeilen = text.split("|");
  const verz = [0, 5, 12, 16, 23];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, ...basis(s, size) }}>
      {zeilen.map((z, i) => {
        const f0 = start + verz[i % verz.length];
        const p = tw(frame, f0, 16, 0, 1, kurve.land);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
            <div style={{ transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 3}deg)`, transformOrigin: "0 100%" }}>
              {zerlege(z.trim()).map((wd, j) => (
                <span key={j} style={{ marginRight: "0.24em", ...(wd.key ? keyStyle(s) : {}) }}>
                  {wd.t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** X03: ein Schlüsselwort landet mit Overshoot, der Unterstrich zeichnet sich nach. */
export const SerifAkzent: React.FC<Gemeinsam & { davor?: string; danach?: string }> = ({
  s,
  text,
  start,
  size = 150,
  x = 70,
  y = 760,
  davor,
  danach,
}) => {
  const frame = useCurrentFrame();
  const sc = overshoot(frame, start, 14, 1.06);
  const op = tw(frame, start, 6, 0, 1, kurve.fade);
  const linie = tw(frame, start + 8, 12, 0, 1, kurve.land);
  return (
    <div style={{ position: "absolute", left: x, top: y, right: 140, ...basis(s, size * 0.62) }}>
      {davor && <div style={{ marginBottom: 6 }}>{davor}</div>}
      <div style={{ position: "relative", display: "inline-block", fontSize: size }}>
        <span style={{ ...keyStyle(s), display: "inline-block", transform: `scale(${sc})`, transformOrigin: "0 80%", opacity: op }}>
          {text}
        </span>
        <svg style={{ position: "absolute", left: 0, bottom: -10, width: "100%", height: 34, overflow: "visible" }} viewBox="0 0 100 10" preserveAspectRatio="none">
          <path
            d="M2 6 C 25 2, 55 9, 98 4"
            fill="none"
            stroke={s.akzent}
            strokeWidth={2.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 9 }}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - linie}
          />
        </svg>
      </div>
      {danach && <div style={{ marginTop: 18 }}>{danach}</div>}
    </div>
  );
};

/** X04: Text tippt sich, blinkender Cursor. Optional in einer Suchleiste. */
export const Tippen: React.FC<Gemeinsam & { leiste?: boolean; tempo?: number }> = ({
  s,
  text,
  start,
  size = 54,
  x = 110,
  y = 860,
  w = 860,
  leiste = true,
  tempo = 2.2,
}) => {
  const frame = useCurrentFrame();
  // Menschliches Tippen: leicht unregelmässig
  let n = 0;
  let acc = start;
  for (let i = 0; i < text.length; i++) {
    acc += tempo + ((i * 7) % 3) * 0.6 + (text[i] === " " ? 1.5 : 0);
    if (frame >= acc) n = i + 1;
  }
  const blink = Math.floor(frame / 8) % 2 === 0 || n < text.length;
  const inner = (
    <span style={{ fontFamily: schrift.text, fontWeight: 500, fontSize: size, color: s.tinte }}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: 4, height: size * 0.9, background: s.akzent, marginLeft: 4, verticalAlign: "-0.12em", opacity: blink ? 1 : 0 }} />
    </span>
  );
  if (!leiste) return <div style={{ position: "absolute", left: x, top: y }}>{inner}</div>;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: size * 2.3,
        borderRadius: size * 1.15,
        background: s.flaeche,
        border: `1.5px solid ${s.rand}`,
        boxShadow: s.dunkel ? "0 20px 60px rgba(0,0,0,.4)" : "0 20px 50px rgba(44,30,120,.12)",
        display: "flex",
        alignItems: "center",
        paddingLeft: size * 1.6,
        boxSizing: "border-box",
      }}
    >
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" style={{ position: "absolute", left: size * 0.55 }}>
        <circle cx="10" cy="10" r="6.5" fill="none" stroke={s.leise === s.tinte ? s.tinte : "#8C89AE"} strokeWidth="2.4" />
        <path d="M15 15 L21 21" stroke="#8C89AE" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      {inner}
    </div>
  );
};

/** X05: Zahl zählt hoch, kleiner Puls am Ende. */
export const Zaehler: React.FC<{ s: Stimmung; start: number; von?: number; bis: number; dauer?: number; einheit?: string; label?: string; x?: number; y?: number; size?: number }> = ({
  s,
  start,
  von = 0,
  bis,
  dauer = 30,
  einheit = "%",
  label,
  x = 70,
  y = 720,
  size = 260,
}) => {
  const frame = useCurrentFrame();
  const v = Math.round(tw(frame, start, dauer, von, bis, kurve.heavy));
  const puls = frame >= start + dauer ? overshoot(frame, start + dauer, 10, 1.05) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {label && (
        <div style={{ fontFamily: schrift.mono, fontSize: 28, letterSpacing: "0.14em", color: "#8C89AE", textTransform: "uppercase", marginBottom: 10 }}>
          {label}
        </div>
      )}
      <div style={{ ...basis(s, size), transform: `scale(${puls})`, transformOrigin: "0 80%", fontVariantNumeric: "tabular-nums" }}>
        {v}
        <span style={{ ...keyStyle(s), fontSize: size * 0.55, marginLeft: 8 }}>{einheit}</span>
      </div>
    </div>
  );
};

/** X06: Wort wird durchgestrichen und durch ein neues ersetzt (Humor/Bruch). */
export const Durchstreichen: React.FC<{ s: Stimmung; start: number; davor: string; alt: string; neu: string; size?: number; x?: number; y?: number }> = ({
  s,
  start,
  davor,
  alt,
  neu,
  size = 104,
  x = 70,
  y = 700,
}) => {
  const frame = useCurrentFrame();
  const strich = tw(frame, start, 8, 0, 1, kurve.whip);
  const altRaus = tw(frame, start + 12, 7, 0, 1, kurve.raus);
  const neuRein = frame >= start + 16 ? overshoot(frame, start + 16, 14, 1.06) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, right: 140, ...basis(s, size) }}>
      <div>{davor}</div>
      <div style={{ position: "relative", height: size * 1.15 }}>
        <span style={{ position: "absolute", left: 0, color: s.leise === s.tinte ? s.tinte : "#8C89AE", opacity: 1 - altRaus, transform: `translateY(${altRaus * 40}px)` }}>
          {alt}
          <span
            style={{
              position: "absolute",
              left: -6,
              top: "52%",
              height: 10,
              borderRadius: 5,
              width: `calc(${strich * 100}% + 12px)`,
              background: s.akzent,
              transform: "rotate(-3deg)",
            }}
          />
        </span>
        <span style={{ position: "absolute", left: 0, ...keyStyle(s), fontSize: size * 1.1, transform: `scale(${neuRein})`, transformOrigin: "0 80%" }}>{neu}</span>
      </div>
    </div>
  );
};

/** X07: ein riesiges Wort schlägt ein (Hook). */
export const WortSchlag: React.FC<{ s: Stimmung; start: number; text: string; size?: number; y?: number; serif?: boolean }> = ({
  s,
  start,
  text,
  size = 260,
  y = 760,
  serif,
}) => {
  const frame = useCurrentFrame();
  const sc = tw(frame, start, 9, 1.6, 1, kurve.whip);
  const blur = tw(frame, start, 7, 14, 0, kurve.land);
  const op = tw(frame, start, 4, 0, 1, kurve.fade);
  const shake = frame >= start + 8 && frame < start + 14 ? Math.sin((frame - start) * 3.1) * (start + 14 - frame) * 1.4 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        ...basis(s, size),
        ...(serif ? keyStyle(s) : {}),
        fontSize: size,
        transform: `scale(${sc}) translateX(${shake}px)`,
        filter: `blur(${blur}px)`,
        opacity: op,
      }}
    >
      {text}
    </div>
  );
};
