import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";

// Standbild «Halbton-Collage / Zine» (Pinterest-Referenzen des Nutzers, Nov. 2026) für Reel «Spielautomat», Moment 1.
// Objekte = Platzhalter (Emoji mit Halbton-Filter). Im Reel: Higgsfield-Bilder im Kupferstich-/Halbton-Look.

export const zine = {
  papier: "#ECE9E2",
  schwarz: "#121212",
  rot: "#D7232B",
  gelb: "#FFD21F",
  violett: "#6C3FD4", // Solleva-Akzent statt Kobaltblau
  zeitung: "#DCD6C8",
};

const fonts: [string, string, string, string][] = [
  ["Fell SC", "im-fell-english-sc-latin-400-normal.woff2", "normal", "400"],
  ["Rye", "rye-latin-400-normal.woff2", "normal", "400"],
  ["Barlow", "barlow-latin-800-normal.woff2", "normal", "800"],
  ["Instrument Serif", "instrument-serif-latin-400-italic.woff2", "italic", "400"],
  ["JetBrains Mono", "jetbrains-mono-latin-500-normal.woff2", "normal", "500"],
];
const ZineSchriften: React.FC = () => {
  const [h] = useState(() => delayRender("Zine-Schriften"));
  useEffect(() => {
    Promise.all(
      fonts.map(async ([fam, file, style, weight]) => {
        const f = new FontFace(fam, `url(${staticFile(`fonts/${file}`)})`, { style, weight });
        await f.load();
        document.fonts.add(f);
      }),
    ).then(() => continueRender(h));
  }, [h]);
  return null;
};

const weisserRand = (px: number) =>
  `drop-shadow(${px}px 0 0 #fff) drop-shadow(-${px}px 0 0 #fff) drop-shadow(0 ${px}px 0 #fff) drop-shadow(0 -${px}px 0 #fff) drop-shadow(8px 14px 6px rgba(0,0,0,.28))`;

/** Ausgeschnittenes Objekt im Halbton-Look mit weissem Papierrand. */
const Ausschnitt: React.FC<{ name: string; x: number; y: number; size: number; dreh?: number; farbig?: boolean; raster?: number }> = ({
  name, x, y, size, dreh = 0, farbig = false, raster = 10,
}) => {
  const src = staticFile(`assets/emoji/${name}.png`);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `rotate(${dreh}deg)`, filter: weisserRand(7) }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <Img src={src} style={{ width: "100%", height: "100%", filter: farbig ? "saturate(1.3) contrast(1.15)" : "grayscale(1) contrast(1.9) brightness(1.05)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: "100% 100%",
            maskImage: `url(${src})`,
            maskSize: "100% 100%",
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,.85) 30%, transparent 33%)`,
            backgroundSize: `${raster}px ${raster}px`,
            mixBlendMode: "multiply",
            opacity: farbig ? 0.25 : 0.55,
          }}
        />
      </div>
    </div>
  );
};

/** Gerissenes Papierstück (Zickzack-Kante per clip-path). */
const riss = (w: number, h: number, seed: number, zacken = 26) => {
  const pts: string[] = [];
  const r = (i: number) => ((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1 + 1) % 1;
  for (let i = 0; i <= zacken; i++) pts.push(`${(i / zacken) * 100}% ${r(i) * 3}%`);
  for (let i = 0; i <= zacken; i++) pts.push(`${100 - r(i + 50) * 2.5}% ${(i / zacken) * 100}%`);
  for (let i = zacken; i >= 0; i--) pts.push(`${(i / zacken) * 100}% ${100 - r(i + 100) * 3}%`);
  for (let i = zacken; i >= 0; i--) pts.push(`${r(i + 150) * 2.5}% ${(i / zacken) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

const Papierstueck: React.FC<{ x: number; y: number; w: number; h: number; dreh: number; seed: number; style: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, dreh, seed, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${dreh}deg)`, filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.22))" }}>
    <div style={{ width: "100%", height: "100%", clipPath: riss(w, h, seed), overflow: "hidden", ...style }}>{children}</div>
  </div>
);

const Zeitung: React.FC = () => {
  const woerter = "Glück Gewinn Spiel Daumen Feed Dopamin Treffer Niete Walze Hebel Münze Belohnung jetzt mehr weiter scrollen ".split(" ");
  const zeilen = Array.from({ length: 34 }, (_, i) =>
    Array.from({ length: 9 }, (_, j) => woerter[(i * 7 + j * 3) % woerter.length]).join(" "),
  );
  return (
    <div style={{ padding: 18, fontFamily: "Fell SC", fontSize: 21, lineHeight: 1.18, color: "#2A2620", columnCount: 2, columnGap: 18, textAlign: "justify" }}>
      <div style={{ fontFamily: "Rye", fontSize: 54, lineHeight: 1, marginBottom: 10, columnSpan: "all" }}>Der Jackpot</div>
      {zeilen.map((z, i) => (
        <div key={i}>{z}</div>
      ))}
    </div>
  );
};

/** Erpresserbrief-Buchstaben: jeder Buchstabe eigenes Papier, eigene Schrift. */
const stile: React.CSSProperties[] = [
  { background: zine.rot, color: "#fff", fontFamily: "Barlow", fontWeight: 800 },
  { background: "#fff", color: zine.schwarz, fontFamily: "Rye" },
  { background: zine.schwarz, color: zine.gelb, fontFamily: "Instrument Serif", fontStyle: "italic" },
  { background: zine.gelb, color: zine.schwarz, fontFamily: "Fell SC" },
  { background: zine.zeitung, color: zine.rot, fontFamily: "Barlow", fontWeight: 800 },
  { background: zine.violett, color: "#fff", fontFamily: "Fell SC" },
  { background: "#fff", color: zine.rot, fontFamily: "Instrument Serif", fontStyle: "italic" },
];
const Erpresser: React.FC<{ text: string; x: number; y: number; size: number; versatz?: number }> = ({ text, x, y, size, versatz = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 6 }}>
    {text.split("").map((c, i) => {
      const s = stile[(i + versatz) % stile.length];
      const dreh = ((i * 37 + versatz * 11) % 13) - 6;
      const hub = ((i * 53) % 21) - 10;
      return (
        <div
          key={i}
          style={{
            ...s,
            fontSize: size * (0.9 + ((i * 29) % 5) * 0.05),
            lineHeight: 1,
            padding: `${size * 0.08}px ${size * 0.12}px ${size * 0.02}px`,
            transform: `rotate(${dreh}deg) translateY(${hub}px)`,
            boxShadow: "4px 7px 0 rgba(0,0,0,.22)",
            textTransform: "uppercase",
          }}
        >
          {c}
        </div>
      );
    })}
  </div>
);

const Etikett: React.FC<{ text: string; x: number; y: number; dreh: number }> = ({ text, x, y, dreh }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 40, letterSpacing: "0.12em", padding: "10px 22px", boxShadow: "5px 8px 0 rgba(0,0,0,.18)" }}>
    {text}
  </div>
);

const Blitz: React.FC<{ x: number; y: number; s: number; dreh: number }> = ({ x, y, s, dreh }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, filter: weisserRand(4) }} width={s} height={s * 1.6} viewBox="0 0 50 80">
    <polygon points="30,0 4,44 22,44 12,80 46,30 27,30 38,0" fill={zine.rot} />
  </svg>
);

const Zacken: React.FC<{ x: number; y: number; r: number; farbe: string; spitzen?: number; dreh?: number }> = ({ x, y, r, farbe, spitzen = 12, dreh = 0 }) => {
  const pts = Array.from({ length: spitzen * 2 }, (_, i) => {
    const a = (Math.PI / spitzen) * i;
    const rr = i % 2 ? r * (0.45 + ((i * 7) % 3) * 0.08) : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return (
    <svg style={{ position: "absolute", left: x - r, top: y - r, transform: `rotate(${dreh}deg)`, filter: weisserRand(4) }} width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}>
      <polygon points={pts} fill={farbe} />
    </svg>
  );
};

const Hebel: React.FC = () => (
  // Spielautomaten-Hebel, seitlich am Handy angeklebt
  <div style={{ position: "absolute", left: 742, top: 820, transform: "rotate(14deg)", filter: weisserRand(6) }}>
    <div style={{ position: "absolute", left: 0, top: 300, width: 70, height: 60, background: "#3A3A3A", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 40, top: 40, width: 24, height: 280, background: "linear-gradient(90deg,#BDBDBD,#5A5A5A)", borderRadius: 12 }} />
    <div style={{ position: "absolute", left: 14, top: 0, width: 80, height: 80, borderRadius: 40, background: `radial-gradient(circle at 35% 30%, #FF6B6B, ${zine.rot})` }} />
  </div>
);

export const Halbton: React.FC = () => (
  <AbsoluteFill style={{ background: zine.papier, overflow: "hidden" }}>
    <ZineSchriften />
    {/* Hintergrund-Ebene: rote Strahlen + Zeitung */}
    <Papierstueck x={430} y={560} w={760} h={900} dreh={6} seed={2} style={{ background: `repeating-conic-gradient(from 0deg at 20% 60%, ${zine.rot} 0deg 6deg, #F4EFE6 6deg 13deg)` }} />
    <Papierstueck x={-80} y={1180} w={560} h={640} dreh={-8} seed={5} style={{ background: zine.zeitung }}>
      <Zeitung />
    </Papierstueck>
    <Zacken x={250} y={820} r={150} farbe={zine.gelb} spitzen={11} dreh={8} />

    {/* Hauptobjekt: Handy als Spielautomat */}
    <Hebel />
    <Ausschnitt name="mobile-phone" x={560} y={1080} size={620} dreh={-8} />
    {/* Walzen auf dem Bildschirm, aufgeklebt */}
    <div style={{ position: "absolute", left: 420, top: 960, display: "flex", gap: 10, transform: "rotate(-8deg)", filter: weisserRand(5) }}>
      {["♥", "♥", "?"].map((c, i) => (
        <div key={i} style={{ width: 92, height: 130, background: i === 2 ? zine.gelb : "#fff", border: `4px solid ${zine.schwarz}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rye", fontSize: 80, color: i === 2 ? zine.schwarz : zine.rot }}>
          {c}
        </div>
      ))}
    </div>

    {/* Akzente */}
    <Ausschnitt name="coin" x={880} y={1380} size={170} dreh={20} />
    <Ausschnitt name="coin" x={780} y={1520} size={130} dreh={-15} />
    <Ausschnitt name="red-heart" x={170} y={1100} size={190} dreh={-14} farbig />
    <Blitz x={880} y={700} s={90} dreh={14} />
    <Blitz x={930} y={820} s={60} dreh={24} />
    <Zacken x={130} y={1530} r={70} farbe={zine.violett} spitzen={8} dreh={-10} />
    <Ausschnitt name="brain" x={880} y={1660} size={230} dreh={8} />

    {/* Text: Etiketten + Erpresserbrief */}
    <Etikett text="DEIN DAUMEN ZIEHT" x={80} y={260} dreh={-3} />
    <Etikett text="GERADE AN EINEM" x={250} y={345} dreh={2} />
    <Erpresser text="SPIEL" x={90} y={440} size={120} />
    <Erpresser text="AUTOMATEN" x={60} y={590} size={92} versatz={3} />

    {/* Papierkorn */}
    <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.22 }}>
      <svg width="100%" height="100%">
        <filter id="korn">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed={9} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.38  0 0 0 0 0.34  0 0 0 0.8 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#korn)" />
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);
