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
  ["Caveat", "caveat-latin-600-normal.woff2", "normal", "600"],
  ["Fell", "im-fell-english-latin-400-italic.woff2", "italic", "400"],
];
export const ZineSchriften: React.FC = () => {
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

export const weisserRand = (px: number) =>
  `drop-shadow(${px}px 0 0 #fff) drop-shadow(-${px}px 0 0 #fff) drop-shadow(0 ${px}px 0 #fff) drop-shadow(0 -${px}px 0 #fff) drop-shadow(8px 14px 6px rgba(0,0,0,.28))`;

/** Ausgeschnittenes Objekt im Halbton-Look mit weissem Papierrand. */
export const Ausschnitt: React.FC<{ name: string; x: number; y: number; size: number; dreh?: number; farbig?: boolean; raster?: number }> = ({
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
export const riss = (w: number, h: number, seed: number, zacken = 26) => {
  const pts: string[] = [];
  const r = (i: number) => ((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1 + 1) % 1;
  for (let i = 0; i <= zacken; i++) pts.push(`${(i / zacken) * 100}% ${r(i) * 3}%`);
  for (let i = 0; i <= zacken; i++) pts.push(`${100 - r(i + 50) * 2.5}% ${(i / zacken) * 100}%`);
  for (let i = zacken; i >= 0; i--) pts.push(`${(i / zacken) * 100}% ${100 - r(i + 100) * 3}%`);
  for (let i = zacken; i >= 0; i--) pts.push(`${r(i + 150) * 2.5}% ${(i / zacken) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

export const Papierstueck: React.FC<{ x: number; y: number; w: number; h: number; dreh: number; seed: number; style: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, dreh, seed, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${dreh}deg)`, filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.22))" }}>
    <div style={{ width: "100%", height: "100%", clipPath: riss(w, h, seed), overflow: "hidden", ...style }}>{children}</div>
  </div>
);

export const Zeitung: React.FC = () => {
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
export const stile: React.CSSProperties[] = [
  { background: zine.rot, color: "#fff", fontFamily: "Barlow", fontWeight: 800 },
  { background: "#fff", color: zine.schwarz, fontFamily: "Rye" },
  { background: zine.schwarz, color: zine.gelb, fontFamily: "Instrument Serif", fontStyle: "italic" },
  { background: zine.gelb, color: zine.schwarz, fontFamily: "Fell SC" },
  { background: zine.zeitung, color: zine.rot, fontFamily: "Barlow", fontWeight: 800 },
  { background: zine.violett, color: "#fff", fontFamily: "Fell SC" },
  { background: "#fff", color: zine.rot, fontFamily: "Instrument Serif", fontStyle: "italic" },
];
export const Erpresser: React.FC<{ text: string; x: number; y: number; size: number; versatz?: number }> = ({ text, x, y, size, versatz = 0 }) => (
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

export const Etikett: React.FC<{ text: string; x: number; y: number; dreh: number }> = ({ text, x, y, dreh }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, background: zine.schwarz, color: "#F4F1EA", fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 40, letterSpacing: "0.12em", padding: "10px 22px", boxShadow: "5px 8px 0 rgba(0,0,0,.18)" }}>
    {text}
  </div>
);

export const Blitz: React.FC<{ x: number; y: number; s: number; dreh: number }> = ({ x, y, s, dreh }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, filter: weisserRand(4) }} width={s} height={s * 1.6} viewBox="0 0 50 80">
    <polygon points="30,0 4,44 22,44 12,80 46,30 27,30 38,0" fill={zine.rot} />
  </svg>
);

export const Zacken: React.FC<{ x: number; y: number; r: number; farbe: string; spitzen?: number; dreh?: number }> = ({ x, y, r, farbe, spitzen = 12, dreh = 0 }) => {
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

export const Hebel: React.FC = () => (
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

// ================= Hintergründe (H1–H8): jede Szene anders, alle bewegen sich leicht =================
// f = Frame (für Bewegung). Im Standbild wird ein fester Frame gerendert.

/** H1 Strahlen, drehen langsam (0,15°/Frame). */
export const HStrahlen: React.FC<{ f?: number; a?: string; b?: string; cx?: string; cy?: string }> = ({ f = 0, a = zine.rot, b = "#F4EFE6", cx = "50%", cy = "55%" }) => (
  <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.15}deg at ${cx} ${cy}, ${a} 0deg 6deg, ${b} 6deg 13deg)` }} />
);

/** H2 Zeitungs-Tapete, Kamera schwenkt (y wandert). */
export const HZeitung: React.FC<{ f?: number }> = ({ f = 0 }) => (
  <AbsoluteFill style={{ background: zine.zeitung, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -60, top: -200 - f * 0.8, width: 1200, transform: "rotate(-4deg)", opacity: 0.75 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={{ width: 1200 }}>
          <Zeitung />
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/** H3 Gelbe Fläche mit Halbton-Verlauf, Punkte atmen. */
export const HPunkte: React.FC<{ f?: number; farbe?: string; punkt?: string }> = ({ f = 0, farbe = zine.gelb, punkt = "rgba(0,0,0,.16)" }) => {
  const s = 1 + Math.sin(f / 20) * 0.06;
  return (
    <AbsoluteFill style={{ background: farbe }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, ${punkt} 34%, transparent 36%)`,
          backgroundSize: `${22 * s}px ${22 * s}px`,
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 100%, #000 10%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** H4 Schwarzes Papier mit Kratzern (RansomLab-Look). */
export const HSchwarz: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #262626, #0C0C0C 75%)" }}>
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.35 }}>
      <svg width="100%" height="100%">
        <filter id="kratzer">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.6" numOctaves="2" seed={3} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -1.1" />
        </filter>
        <rect width="100%" height="100%" filter="url(#kratzer)" />
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** H5 Karopapier (Schulheft), leicht schief. */
export const HKaro: React.FC<{ f?: number }> = ({ f = 0 }) => (
  <AbsoluteFill style={{ background: "#F7F5EF" }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(#B9C7E0 1.5px, transparent 1.5px), linear-gradient(90deg, #B9C7E0 1.5px, transparent 1.5px)",
        backgroundSize: "48px 48px",
        backgroundPosition: `${f * 0.4}px 0`,
        transform: "rotate(-3deg) scale(1.1)",
      }}
    />
    <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 3, background: "#E06A6A", opacity: 0.7 }} />
  </AbsoluteFill>
);

/** H6 Violette Fläche mit grossem Halbton-Kreis, pulsiert. */
export const HKreis: React.FC<{ f?: number }> = ({ f = 0 }) => {
  const s = 1 + Math.sin(f / 15) * 0.05;
  return (
    <AbsoluteFill style={{ background: zine.violett }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 520 * s,
          top: 1050 - 520 * s,
          width: 1040 * s,
          height: 1040 * s,
          borderRadius: "50%",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,.28) 32%, transparent 35%)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(circle, #000 40%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** H7 Graues Packpapier mit Klebeband-Streifen. */
export const HPackpapier: React.FC = () => (
  <AbsoluteFill style={{ background: "#CFC6B4" }}>
    {[[-40, 380, -12], [620, 1500, 9], [700, 160, 18]].map(([x, y, d], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: 520, height: 70, background: "rgba(245,240,225,.55)", transform: `rotate(${d}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,.1)" }} />
    ))}
  </AbsoluteFill>
);

/** H8 Hypnose-Spirale schwarz/weiss, dreht. */
export const HSpirale: React.FC<{ f?: number; tempo?: number }> = ({ f = 0, tempo = 1.2 }) => {
  const pts: string[] = [];
  for (let t = 0; t < 40 * Math.PI; t += 0.1) {
    const r = t * 13;
    pts.push(`${Math.cos(t) * r},${Math.sin(t) * r}`);
  }
  return (
    <AbsoluteFill style={{ background: "#F2EFE8", overflow: "hidden" }}>
      <svg width={2400} height={2400} viewBox="-1200 -1200 2400 2400" style={{ position: "absolute", left: 540 - 1200, top: 1000 - 1200, transform: `rotate(${f * tempo}deg)` }}>
        <polyline points={pts.join(" ")} fill="none" stroke={zine.schwarz} strokeWidth={42} />
      </svg>
    </AbsoluteFill>
  );
};

/** Papierkorn über allem. */
export const Korn: React.FC<{ staerke?: number }> = ({ staerke = 0.22 }) => (
  <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: staerke, pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="korn2">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed={9} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.38  0 0 0 0 0.34  0 0 0 0.8 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#korn2)" />
    </svg>
  </AbsoluteFill>
);

/** Kleines Schild im Storyboard: was hier von Higgsfield kommt. */
export const HfNotiz: React.FC<{ text: string; y?: number }> = ({ text, y = 1600 }) => (
  <div style={{ position: "absolute", left: 70, right: 140, top: y, fontFamily: "JetBrains Mono", fontSize: 24, lineHeight: 1.35, color: zine.schwarz, background: "rgba(255,255,255,.85)", border: `2px dashed ${zine.schwarz}`, padding: "10px 16px" }}>
    HIGGSFIELD: {text}
  </div>
);


// ================= Typografie-Set T01–T13: jede Szene eine andere Schrift-Idee =================
// T01 Erpresser + T02 Etikett: oben. Weitere:

/** T03 Lotterie-Los: Text auf Ticket mit Perforation und Nummer. */
export const Los: React.FC<{ x: number; y: number; w: number; text: string; klein?: string; dreh?: number }> = ({ x, y, w, text, klein, dreh = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${dreh}deg)`, filter: "drop-shadow(8px 12px 0 rgba(0,0,0,.25))" }}>
    <div style={{ background: zine.gelb, border: `4px solid ${zine.schwarz}`, borderRadius: 18, padding: "22px 34px", position: "relative", WebkitMaskImage: "radial-gradient(circle at 0 50%, transparent 26px, #000 27px), radial-gradient(circle at 100% 50%, transparent 26px, #000 27px)", WebkitMaskComposite: "source-in" as any, maskComposite: "intersect" }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, letterSpacing: "0.2em", color: zine.schwarz }}>{klein ?? "LOS Nr. 000 471"}</div>
      <div style={{ borderTop: `3px dashed ${zine.schwarz}`, margin: "10px 0" }} />
      <div style={{ fontFamily: "Rye", fontSize: w * 0.26, lineHeight: 1, color: zine.rot, textAlign: "center" }}>{text}</div>
    </div>
  </div>
);

/** T04 Riso-Doppeldruck: zwei versetzte Farbschichten. */
export const Riso: React.FC<{ x: number; y: number; text: string; size: number; a?: string; b?: string; dreh?: number }> = ({ x, y, text, size, a = zine.rot, b = zine.violett, dreh = 0 }) => {
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.03em", whiteSpace: "nowrap", mixBlendMode: "multiply" };
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)` }}>
      <div style={{ ...st, color: b, transform: "translate(10px, 8px)" }}>{text}</div>
      <div style={{ ...st, position: "relative", color: a, mixBlendMode: "normal" }}>{text}</div>
    </div>
  );
};

/** T05 Halbton-gefüllte Riesenbuchstaben (Punktraster im Buchstaben). */
export const Rasterwort: React.FC<{ x: number; y: number; text: string; size: number; farbe?: string; dreh?: number }> = ({ x, y, text, size, farbe = "#fff", dreh = 0 }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`,
      fontFamily: "Barlow", fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.03em", whiteSpace: "nowrap",
      backgroundImage: `radial-gradient(circle, ${farbe} 42%, transparent 46%)`, backgroundSize: `${size / 14}px ${size / 14}px`,
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      WebkitTextStroke: `3px ${farbe}`,
    }}
  >
    {text}
  </div>
);

/** T06 Gelbe Sprechblase (Pinterest-Ref.) mit Serif kursiv. */
export const Blase: React.FC<{ x: number; y: number; w: number; children: React.ReactNode; dreh?: number }> = ({ x, y, w, children, dreh = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${dreh}deg)`, filter: weisserRand(6) }}>
    <div style={{ background: zine.gelb, borderRadius: "50%", padding: `${w * 0.12}px ${w * 0.1}px`, textAlign: "center", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: w * 0.15, lineHeight: 0.95, color: zine.schwarz }}>
      {children}
    </div>
    <div style={{ position: "absolute", left: w * 0.62, bottom: -w * 0.1, width: 0, height: 0, borderLeft: `${w * 0.06}px solid transparent`, borderRight: `${w * 0.1}px solid transparent`, borderTop: `${w * 0.16}px solid ${zine.gelb}`, transform: "rotate(-18deg)" }} />
  </div>
);

/** T07 Gummistempel: rot, schief, ausgefranst. */
export const Stempel: React.FC<{ x: number; y: number; text: string; size: number; dreh?: number; farbe?: string; dunkel?: boolean }> = ({ x, y, text, size, dreh = -8, farbe = zine.rot, dunkel = false }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, border: `${size * 0.07}px solid ${farbe}`, borderRadius: size * 0.12, padding: `${size * 0.04}px ${size * 0.18}px`, color: farbe, fontFamily: "Barlow", fontWeight: 800, fontSize: size, letterSpacing: "0.04em", lineHeight: 1,
    WebkitMaskImage: "radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,.55) 75%, #000 90%)", opacity: 0.95, mixBlendMode: dunkel ? "normal" : "multiply" }}>
    {text}
  </div>
);

/** T08 Handschrift mit Marker-Unterstrich. */
export const Hand: React.FC<{ x: number; y: number; text: string; size: number; farbe?: string; dreh?: number; strich?: string }> = ({ x, y, text, size, farbe = zine.gelb, dreh = -3, strich = zine.rot }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, fontFamily: "Caveat", fontWeight: 600, fontSize: size, color: farbe, lineHeight: 1, whiteSpace: "nowrap" }}>
    {text}
    <svg style={{ position: "absolute", left: 0, top: size * 0.95 }} width="100%" height={size * 0.3} viewBox="0 0 100 10" preserveAspectRatio="none">
      <path d="M2,6 C30,2 60,9 98,3" fill="none" stroke={strich} strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  </div>
);

/** T09 Prägeband (Dymo): erhabene weisse Buchstaben auf farbigem Band. */
export const Praegeband: React.FC<{ x: number; y: number; text: string; size: number; farbe?: string; dreh?: number }> = ({ x, y, text, size, farbe = zine.schwarz, dreh = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${dreh}deg)`, background: `linear-gradient(${farbe}, ${farbe} 45%, #000 140%)`, padding: `${size * 0.14}px ${size * 0.3}px`, borderRadius: 6, boxShadow: "4px 7px 0 rgba(0,0,0,.25), inset 0 2px 0 rgba(255,255,255,.25)",
    fontFamily: "Barlow", fontWeight: 800, fontSize: size, letterSpacing: "0.22em", color: "#F2F2F2", textShadow: "0 -1px 0 rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.4)" }}>
    {text}
  </div>
);

/** T10 Zeitungs-Schlagzeile: Streifen aus der Zeitung gerissen. */
export const Schlagzeile: React.FC<{ x: number; y: number; w: number; dach: string; titel: string; dreh?: number }> = ({ x, y, w, dach, titel, dreh = 0 }) => (
  <Papierstueck x={x} y={y} w={w} h={w * 0.5} dreh={dreh} seed={21} style={{ background: "#F1ECDF", padding: "26px 34px", boxSizing: "border-box" }}>
    <div style={{ fontFamily: "Fell SC", fontSize: w * 0.045, letterSpacing: "0.1em", color: zine.rot, borderBottom: `3px double ${zine.schwarz}`, paddingBottom: 6 }}>{dach}</div>
    <div style={{ fontFamily: "Fell SC", fontSize: w * 0.14, lineHeight: 0.95, color: zine.schwarz, marginTop: 10 }}>{titel}</div>
  </Papierstueck>
);

/** T11 Text auf Kreisbahn (um ein Objekt). */
export const Kreistext: React.FC<{ cx: number; cy: number; r: number; text: string; size: number; farbe?: string; dreh?: number }> = ({ cx, cy, r, text, size, farbe = zine.schwarz, dreh = 0 }) => (
  <svg style={{ position: "absolute", left: cx - r - size, top: cy - r - size, transform: `rotate(${dreh}deg)` }} width={(r + size) * 2} height={(r + size) * 2} viewBox={`${-r - size} ${-r - size} ${(r + size) * 2} ${(r + size) * 2}`}>
    <defs>
      <path id={`kreis${r}`} d={`M ${-r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 ${-r * 2},0`} />
    </defs>
    <text style={{ fontFamily: "Barlow", fontWeight: 800, fontSize: size, letterSpacing: "0.12em" }} fill={farbe}>
      <textPath href={`#kreis${r}`} textLength={2 * Math.PI * r * 0.985} lengthAdjust="spacing">{text}</textPath>
    </text>
  </svg>
);

/** T12 Wiederholungs-Stapel: Wort wiederholt, jede Zeile grösser. */
export const Stapel: React.FC<{ x: number; y: number; text: string; von: number; bis: number; n: number; farben?: string[] }> = ({ x, y, text, von, bis, n, farben = [zine.schwarz] }) => {
  let top = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {Array.from({ length: n }, (_, i) => {
        const s = von + ((bis - von) * i) / (n - 1);
        const el = <div key={i} style={{ position: "absolute", left: 0, top, fontFamily: "Barlow", fontWeight: 800, fontSize: s, lineHeight: 0.86, letterSpacing: "-0.03em", color: farben[i % farben.length], whiteSpace: "nowrap" }}>{text}</div>;
        top += s * 0.86;
        return el;
      })}
    </div>
  );
};

/** T13 Karteikarte mit Schreibmaschine. */
export const Karteikarte: React.FC<{ x: number; y: number; w: number; zeilen: React.ReactNode[]; dreh?: number }> = ({ x, y, w, zeilen, dreh = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${dreh}deg)`, background: "#FBF8F0", boxShadow: "8px 12px 0 rgba(0,0,0,.2)", padding: "30px 36px 34px",
    backgroundImage: "linear-gradient(transparent 62px, #9DB5D9 62px, #9DB5D9 64px, transparent 64px), repeating-linear-gradient(transparent 0 58px, #C9D5EA 58px 60px)", backgroundPosition: "0 0, 0 70px" }}>
    <div style={{ position: "absolute", left: w * 0.38, top: -24, width: 150, height: 46, background: "rgba(240,234,210,.8)", transform: "rotate(-4deg)" }} />
    {zeilen.map((z, i) => (
      <div key={i} style={{ fontFamily: "JetBrains Mono", fontSize: 44, lineHeight: "60px", color: "#222" }}>{z}</div>
    ))}
  </div>
);

// ================= Platzhalter-Silhouetten (nur Storyboard, werden durch Higgsfield-Bilder ersetzt) =================
const Rasterfuellung: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#D8D8D8" />
      <stop offset="1" stopColor="#6A6A6A" />
    </linearGradient>
    <pattern id={`${id}p`} width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill={`url(#${id}g)`} />
      <circle cx="5" cy="5" r="2.6" fill="rgba(0,0,0,.45)" />
    </pattern>
  </defs>
);

const Silhouette: React.FC<{ x: number; y: number; w: number; h: number; dreh?: number; children: React.ReactNode; vb: string }> = ({ x, y, w, h, dreh = 0, children, vb }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - h / 2, transform: `rotate(${dreh}deg)`, filter: weisserRand(7), overflow: "visible" }} width={w} height={h} viewBox={vb}>
    {children}
  </svg>
);

/** Apotheker-Flasche mit Etikett «GLÜCK». */
export const Flasche: React.FC<{ x: number; y: number; h?: number; dreh?: number; riss?: boolean }> = ({ x, y, h = 620, dreh = 0, riss = false }) => (
  <Silhouette x={x} y={y} w={h * 0.5} h={h} dreh={dreh} vb="0 0 100 200">
    <Rasterfuellung id="fl" />
    <rect x="38" y="0" width="24" height="14" rx="3" fill="#3A2A1E" />
    <path d="M40,14 L60,14 L60,46 C88,58 92,74 92,96 L92,186 C92,194 86,200 78,200 L22,200 C14,200 8,194 8,186 L8,96 C8,74 12,58 40,46 Z" fill="url(#flp)" stroke="#121212" strokeWidth="2" />
    <rect x="16" y="104" width="68" height="58" fill="#F3EEDF" stroke="#121212" strokeWidth="1.6" />
    <text x="50" y="128" textAnchor="middle" style={{ fontFamily: "Fell SC", fontSize: 17 }} fill="#121212">GLÜCK</text>
    <text x="50" y="146" textAnchor="middle" style={{ fontFamily: "Fell", fontStyle: "italic", fontSize: 10 }} fill="#D7232B">Tropfen · 100 ml</text>
    {riss && <path d="M30,60 L44,92 L36,110 L52,140 L46,170" fill="none" stroke="#121212" strokeWidth="2.5" />}
  </Silhouette>
);

/** Marmorbüste, gähnt. */
export const Bueste: React.FC<{ x: number; y: number; h?: number; dreh?: number }> = ({ x, y, h = 640, dreh = 0 }) => (
  <Silhouette x={x} y={y} w={h * 0.8} h={h} dreh={dreh} vb="0 0 160 200">
    <Rasterfuellung id="bu" />
    <path d="M80,10 C112,10 124,36 122,62 C121,80 114,96 104,106 L104,124 C130,130 152,146 156,176 L160,200 L0,200 L4,176 C8,146 30,130 56,124 L56,106 C46,96 39,80 38,62 C36,36 48,10 80,10 Z" fill="url(#bup)" stroke="#121212" strokeWidth="2" />
    <path d="M52,34 C60,18 100,16 110,34 C104,26 96,30 88,24 C80,30 66,24 60,32 Z" fill="#9A9A9A" stroke="#121212" strokeWidth="1.2" />
    <path d="M58,62 C64,58 70,58 74,62 M88,62 C92,58 98,58 104,62" fill="none" stroke="#121212" strokeWidth="2" />
    <ellipse cx="81" cy="88" rx="9" ry="13" fill="#2A2A2A" />
    <text x="128" y="40" style={{ fontFamily: "Caveat", fontWeight: 600, fontSize: 22 }} fill="#121212">gääähn</text>
  </Silhouette>
);

/** Zirkus-Kanone, Mann fliegt raus. */
export const Kanone: React.FC<{ x: number; y: number; w?: number; dreh?: number }> = ({ x, y, w = 820, dreh = 0 }) => (
  <Silhouette x={x} y={y} w={w} h={w * 0.75} dreh={dreh} vb="0 0 200 150">
    <Rasterfuellung id="ka" />
    <g transform="rotate(-32 70 110)">
      <rect x="40" y="92" width="120" height="36" rx="8" fill="url(#kap)" stroke="#121212" strokeWidth="2" />
      <rect x="150" y="86" width="16" height="48" rx="4" fill="#D7232B" stroke="#121212" strokeWidth="2" />
      <rect x="70" y="92" width="10" height="36" fill="#FFD21F" stroke="#121212" strokeWidth="1.2" />
      <rect x="100" y="92" width="10" height="36" fill="#FFD21F" stroke="#121212" strokeWidth="1.2" />
    </g>
    <circle cx="66" cy="126" r="22" fill="#F3EEDF" stroke="#121212" strokeWidth="2" />
    <path d="M66,104 L66,148 M44,126 L88,126 M50,110 L82,142 M82,110 L50,142" stroke="#121212" strokeWidth="1.5" />
    <g transform="translate(160 22) rotate(30)">
      <circle cx="0" cy="0" r="8" fill="url(#kap)" stroke="#121212" strokeWidth="1.5" />
      <path d="M0,8 L0,30 M0,14 L-14,4 M0,14 L14,22 M0,30 L-10,44 M0,30 L12,42" stroke="#121212" strokeWidth="4" strokeLinecap="round" />
    </g>
    <path d="M120,58 C130,50 136,44 148,36" fill="none" stroke="#121212" strokeWidth="1.5" strokeDasharray="4 4" />
  </Silhouette>
);
