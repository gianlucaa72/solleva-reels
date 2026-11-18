// Reel 04 «Keine Filmcrew»: Look «Retro-Doku auf dem Tisch».
// Analoge Welt (Schneidematte, Holz, Papier) in Solleva-Farben. Wiederverwendbar für Reel 05/06 (gleiche Serie).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";
import { farben } from "../../brand/solleva";

// ---------- Schriften dieser Serie ----------
export const schriftR04 = {
  display: "Archivo R04", // breit (wdth 112–125), Gewicht 900, Versalien
  marker: "Permanent Marker", // Handschrift als Kontrast
  text: "Barlow", // Untertitel
  mono: "JetBrains Mono",
};

let geladen: Promise<void> | null = null;
const lade = () => {
  if (!geladen) {
    const fs = [
      new FontFace(schriftR04.display, `url(${staticFile("fonts/archivo-latin-wdth-normal.woff2")})`, { weight: "100 900", stretch: "62% 125%" }),
      new FontFace(schriftR04.marker, `url(${staticFile("fonts/permanent-marker-latin-400-normal.woff2")})`),
      new FontFace("Barlow", `url(${staticFile("fonts/barlow-latin-700-normal.woff2")})`, { weight: "700" }),
      new FontFace("JetBrains Mono", `url(${staticFile("fonts/jetbrains-mono-latin-500-normal.woff2")})`, { weight: "500" }),
    ];
    geladen = Promise.all(fs.map(async (f) => { await f.load(); document.fonts.add(f); })).then(() => undefined);
  }
  return geladen;
};
export const SchriftenR04: React.FC = () => {
  const [h] = useState(() => delayRender("Schriften R04"));
  useEffect(() => { lade().then(() => continueRender(h)); }, [h]);
  return null;
};

// ---------- Palette der Serie (nur Solleva-Töne + analoge Materialien) ----------
export const r04 = {
  matte: "#5A37C2", // Solleva-Violett #6C3FD4, als Gummimatte leicht abgedunkelt
  matteTief: "#3E2496",
  matteLinie: "rgba(214,200,255,.30)",
  matteLinieStark: "rgba(226,214,255,.55)",
  matteHell: "#D9CEFF", // helle Matte (Lavendel-Variante) für Satz 5/7
  holz: ["#3B2418", "#6B4430", "#9A6A48"], // analoges Material (Rückfrage im Freigabe-Paket)
  schatten: "rgba(20,10,60,.55)",
};

// ---------- Körnung (statisch im Storyboard, im Reel alle 2 Frames neu) ----------
export const Koernung: React.FC<{ staerke?: number; seed?: number }> = ({ staerke = 0.12, seed = 1 }) => (
  <AbsoluteFill style={{ opacity: staerke, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id={`k${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#k${seed})`} />
    </svg>
  </AbsoluteFill>
);

// ---------- Blätterschatten (Tageslicht durchs Fenster, Pinterest-Matte) ----------
const blaetter = (seed: number) => {
  const out: { x: number; y: number; w: number; h: number; r: number }[] = [];
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let ast = 0; ast < 3; ast++) {
    const x0 = 200 + ast * 380 + rnd() * 120, y0 = -100 + rnd() * 300;
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      out.push({ x: x0 + t * 520 - 160, y: y0 + t * 1300, w: 70 + rnd() * 50, h: 260 + rnd() * 120, r: -38 + (i % 2 ? 70 : -10) + rnd() * 20 });
    }
  }
  return out;
};
export const Blaetterschatten: React.FC<{ staerke?: number; seed?: number }> = ({ staerke = 0.32, seed = 3 }) => (
  <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: staerke, filter: "blur(22px)" }}>
    <svg width="1080" height="1920">
      {blaetter(seed).map((b, i) => (
        <ellipse key={i} cx={b.x} cy={b.y} rx={b.w / 2} ry={b.h / 2} transform={`rotate(${b.r} ${b.x} ${b.y})`} fill="#140a3a" />
      ))}
      <path d="M 120 -50 C 400 500, 520 900, 820 1980" stroke="#140a3a" strokeWidth="26" fill="none" />
    </svg>
  </AbsoluteFill>
);

// ---------- Schneidematte von oben ----------
export const Matte: React.FC<{ hell?: boolean; seed?: number }> = ({ hell = false, seed = 3 }) => {
  const basis = hell ? r04.matteHell : r04.matte;
  const linie = hell ? "rgba(90,55,194,.20)" : r04.matteLinie;
  const stark = hell ? "rgba(90,55,194,.38)" : r04.matteLinieStark;
  const zahl = hell ? "rgba(62,36,150,.65)" : "rgba(236,230,255,.75)";
  const z = 48; // 1 Feld
  return (
    <AbsoluteFill style={{ background: basis }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${stark} 2px, transparent 2px), linear-gradient(90deg, ${stark} 2px, transparent 2px), linear-gradient(${linie} 1px, transparent 1px), linear-gradient(90deg, ${linie} 1px, transparent 1px)`,
          backgroundSize: `${z * 5}px ${z * 5}px, ${z * 5}px ${z * 5}px, ${z}px ${z}px, ${z}px ${z}px`,
          backgroundPosition: "36px 30px",
        }}
      />
      {/* Lineal-Ziffern oben und links */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`o${i}`} style={{ position: "absolute", top: 4, left: 36 + i * z * 5 - 8, fontFamily: schriftR04.mono, fontSize: 18, color: zahl }}>{i}</div>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`l${i}`} style={{ position: "absolute", left: 8, top: 30 + i * z * 5 - 10, fontFamily: schriftR04.mono, fontSize: 18, color: zahl }}>{i}</div>
      ))}
      {/* Tageslicht von oben links */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 25% 15%, rgba(255,250,240,.22), transparent 60%)", mixBlendMode: "screen" }} />
      <Blaetterschatten seed={seed} staerke={hell ? 0.18 : 0.3} />
      <Koernung staerke={0.14} seed={seed} />
    </AbsoluteFill>
  );
};

// ---------- Holztisch von oben (zweite Welt) ----------
export const Holz: React.FC<{ dunkel?: boolean; seed?: number }> = ({ dunkel = false, seed = 2 }) => (
  <AbsoluteFill style={{ background: dunkel ? "#22140d" : r04.holz[1] }}>
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <filter id={`holz${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.045" numOctaves="4" seed={seed} />
        <feColorMatrix
          type="matrix"
          values={dunkel ? "0.55 0 0 0 0.10  0.34 0 0 0 0.05  0.20 0 0 0 0.02  0 0 0 0 1" : "0.75 0 0 0 0.22  0.50 0 0 0 0.12  0.32 0 0 0 0.06  0 0 0 0 1"}
        />
      </filter>
      <rect width="1080" height="1920" filter={`url(#holz${seed})`} />
      {/* Brettfugen */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={0} y={i * 300 + 40} width={1080} height={4} fill="rgba(15,8,4,.55)" />
      ))}
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 30% 20%, rgba(255,235,200,.20), transparent 65%)", mixBlendMode: "screen" }} />
    <Koernung staerke={0.12} seed={seed + 5} />
  </AbsoluteFill>
);

// ---------- Nacht-Samt mit Lichtkegel (Satz 3: «die Grossen») ----------
export const Samt: React.FC = () => (
  <AbsoluteFill style={{ background: farben.nacht }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(108,63,212,.10) 0 38px, rgba(0,0,0,.25) 38px 76px)", filter: "blur(6px)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 42% at 50% 46%, rgba(169,139,255,.38), transparent 70%)" }} />
    <Koernung staerke={0.16} seed={8} />
  </AbsoluteFill>
);

// ---------- Tiefe: Rand unscharf, Mitte scharf (Notiz des Nutzers) + Vignette ----------
export const TiltShift: React.FC<{ blur?: number; fokus?: number }> = ({ blur = 9, fokus = 52 }) => (
  <>
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        maskImage: `radial-gradient(ellipse 78% 62% at 50% 50%, transparent ${fokus}%, black 100%)`,
        WebkitMaskImage: `radial-gradient(ellipse 78% 62% at 50% 50%, transparent ${fokus}%, black 100%)`,
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 280px rgba(8,4,30,.62)", pointerEvents: "none" }} />
  </>
);

// ---------- 3D-Schrift: breit, fett, geprägt, sichtbarer Schatten ----------
const praegung = (tiefe: number, a: string, b: string) => {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [ca, cb] = [hex(a), hex(b)];
  const s: string[] = [];
  for (let i = 1; i <= tiefe; i++) {
    const t = i / tiefe;
    const c = ca.map((v, k) => Math.round(v + (cb[k] - v) * t));
    s.push(`${i * 0.7}px ${i}px 0 rgb(${c.join(",")})`);
  }
  return s;
};
export const Typo3D: React.FC<{
  zeilen: string[];
  top: number;
  groesse?: number;
  farbe?: string;
  praegA?: string;
  praegB?: string;
  breite?: number; // font-stretch %
  dreh?: number;
  opacity?: number;
}> = ({ zeilen, top, groesse = 150, farbe = farben.papier, praegA = "#B9A6F5", praegB = "#2A1670", breite = 118, dreh = -2, opacity = 1 }) => (
  <div style={{ position: "absolute", top, left: 70, right: 140, textAlign: "center", transform: `rotate(${dreh}deg)`, opacity }}>
    {zeilen.map((z, i) => (
      <div
        key={i}
        style={{
          fontFamily: schriftR04.display,
          fontWeight: 900,
          fontStretch: `${breite}%`,
          fontSize: groesse,
          lineHeight: 0.86,
          letterSpacing: "-0.01em",
          color: farbe,
          textShadow: [...praegung(9, praegA, praegB), `18px 30px 26px ${r04.schatten}`].join(","),
          whiteSpace: "nowrap",
        }}
      >
        {z}
      </div>
    ))}
  </div>
);

// ---------- Handschrift (Kontrast) ----------
export const Marker: React.FC<{ text: string; x: number; y: number; groesse?: number; farbe?: string; dreh?: number }> = ({ text, x, y, groesse = 110, farbe = farben.gold, dreh = -6 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: schriftR04.marker, fontSize: groesse, color: farbe, transform: `rotate(${dreh}deg)`, textShadow: `4px 6px 6px ${r04.schatten}`, whiteSpace: "nowrap" }}>{text}</div>
);

// ---------- Kleine Wort-für-Wort-Untertitel in einer Box (wie Referenz) ----------
export const Untertitel: React.FC<{ text: string; schluessel?: string; y?: number }> = ({ text, schluessel, y = 1400 }) => (
  <div style={{ position: "absolute", top: y, left: 70, right: 140, display: "flex", justifyContent: "center" }}>
    <div style={{ background: "rgba(14,10,40,.78)", borderRadius: 12, padding: "10px 22px", fontFamily: "Barlow", fontWeight: 700, fontSize: 40, color: farbe(1), maxWidth: 820, textAlign: "center", lineHeight: 1.15 }}>
      {text.split(" ").map((w, i) => {
        const key = schluessel && w.replace(/[.,?!«»]/g, "").toLowerCase() === schluessel.toLowerCase();
        return (
          <span key={i} style={{ color: key ? farben.lavendelAkzent : farben.papier }}>
            {w}{" "}
          </span>
        );
      })}
    </div>
  </div>
);
const farbe = (_: number) => farben.papier;

// ---------- Freigestelltes Objekt mit Schlagschatten (Higgsfield folgt; im Storyboard Platzhalter) ----------
export const Objekt: React.FC<{
  x: number; y: number; w: number; h: number; dreh?: number; label: string; emoji?: string; quelle?: "Higgsfield" | "echt" | "Code"; children?: React.ReactNode; hoehe?: number;
}> = ({ x, y, w, h, dreh = 0, label, emoji, quelle = "Higgsfield", children, hoehe = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${dreh}deg)`, filter: `drop-shadow(${14 * hoehe}px ${24 * hoehe}px ${18 * hoehe}px ${r04.schatten})` }}>
    {children ?? (
      <div style={{ width: "100%", height: "100%", borderRadius: 26, background: "rgba(246,245,252,.92)", border: `4px dashed ${farben.violett}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {emoji && <Img src={staticFile(`assets/emoji/${emoji}.png`)} style={{ width: Math.min(w, h) * 0.5, height: Math.min(w, h) * 0.5 }} />}
        <div style={{ fontFamily: schriftR04.mono, fontSize: 24, color: farben.tinte, textAlign: "center", padding: "0 10px" }}>{label}</div>
        <div style={{ fontFamily: schriftR04.mono, fontSize: 18, color: farben.violett }}>{quelle === "echt" ? "ECHTE AUFNAHME" : quelle === "Higgsfield" ? "HIGGSFIELD" : "CODE"}</div>
      </div>
    )}
  </div>
);

// ---------- Hand (echter Clip des Nutzers; im Storyboard Platzhalter-Silhouette) ----------
export const HandPlatzhalter: React.FC<{ x: number; y: number; dreh?: number; laenge?: number }> = ({ x, y, dreh = -25, laenge = 820 }) => (
  <div style={{ position: "absolute", left: x - 110, top: y, width: 220, height: laenge, transformOrigin: "50% 0%", transform: `rotate(${dreh}deg)`, filter: `drop-shadow(20px 34px 24px ${r04.schatten})` }}>
    <div style={{ width: "100%", height: "100%", borderRadius: "110px 110px 40px 40px", background: "linear-gradient(180deg,#E9C3A6,#D6A584)", border: "4px dashed rgba(20,18,58,.55)" }} />
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: schriftR04.mono, fontSize: 20, color: farben.tinte, transform: "rotate(90deg) translateX(120px)" }}>DEINE HAND (CLIP)</div>
  </div>
);
