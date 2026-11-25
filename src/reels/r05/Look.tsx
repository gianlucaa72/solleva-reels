// Reel 05 «50 Millisekunden»: Look nach solleva.ch (Nachthimmel, Planet, Prismen-Kristalle).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// CSS-Variablen der Website solleva.ch
export const web = {
  ink: "#04050c",
  night: "#0a0d22",
  deep: "#2b2270",
  violet: "#3b1e8c",
  purple: "#6c3fd4",
  lilac: "#a98bff",
  cyan: "#8fe3ff",
  text: "#f1f2f7",
  muted: "#b4bde0",
  chrome: "linear-gradient(180deg, #fff 0%, #dfe5f1 30%, #8a93ab 50%, #f2f5fb 66%, #a7b0c6 84%, #e8ecf5 100%)",
  prism: "conic-gradient(#8fe3ff, #6c3fd4, #ff4fa3, #ff8a3d, #ffe27a, #8fe3ff)",
} as const;

export const schriftR05 = {
  serif: "Instrument Serif",
  text: "Barlow",
  mono: "JetBrains Mono",
  alt: "FreeSerif, 'DejaVu Serif', 'Times New Roman', serif", // alte Seite (Times-Look)
};

export const asset = (p: string) => staticFile(`assets/r05/${p}`);

// ---------- Hintergründe ----------
export const Bild: React.FC<{ src: string; scale?: number; x?: number; y?: number; style?: React.CSSProperties }> = ({ src, scale = 1, x = 0, y = 0, style }) => (
  <AbsoluteFill style={{ background: web.ink, overflow: "hidden" }}>
    <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translate(${x}px, ${y}px) scale(${scale})`, ...style }} />
  </AbsoluteFill>
);

// ---------- LCD-Stoppuhr (7 Segmente, Komma) ----------
const SEG: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", " ": "",
};
const Ziffer: React.FC<{ z: string; h: number; farbe: string; aus: string }> = ({ z, h, farbe, aus }) => {
  const w = h * 0.55, t = h * 0.11, g = t * 0.18, sk = -0.08;
  const an = SEG[z] ?? "";
  const hor = (y: number) => `M${t / 2 + g},${y} l${t / 2},${-t / 2} h${w - 2 * t - 2 * g} l${t / 2},${t / 2} l${-t / 2},${t / 2} h${-(w - 2 * t - 2 * g)} z`;
  const ver = (x: number, y0: number, y1: number) => `M${x},${y0 + g} l${t / 2},${t / 2} v${y1 - y0 - t - 2 * g} l${-t / 2},${t / 2} l${-t / 2},${-t / 2} v${-(y1 - y0 - t - 2 * g)} z`;
  const segs: Record<string, string> = {
    a: hor(t / 2), g: hor(h / 2), d: hor(h - t / 2),
    f: ver(t / 2, t / 2, h / 2), b: ver(w - t / 2, t / 2, h / 2),
    e: ver(t / 2, h / 2, h - t / 2), c: ver(w - t / 2, h / 2, h - t / 2),
  };
  return (
    <svg width={w + t} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", transform: `skewX(${sk * 57}deg)` }}>
      {Object.entries(segs).map(([k, d]) => (
        <path key={k} d={d} fill={an.includes(k) ? farbe : aus} style={an.includes(k) ? { filter: `drop-shadow(0 0 ${h * 0.06}px ${farbe})` } : undefined} />
      ))}
    </svg>
  );
};
export const Lcd: React.FC<{ text: string; h?: number; farbe?: string; aus?: string }> = ({ text, h = 160, farbe = web.cyan, aus = "rgba(143,227,255,.07)" }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: h * 0.08 }}>
    {text.split("").map((c, i) =>
      c === "," ? (
        <div key={i} style={{ width: h * 0.14, height: h * 0.22, background: farbe, borderRadius: h * 0.03, transform: "skewX(-20deg) translateY(4%)", boxShadow: `0 0 ${h * 0.06}px ${farbe}` }} />
      ) : c.match(/[a-z]/) ? (
        <span key={i} style={{ fontFamily: schriftR05.mono, fontSize: h * 0.42, color: farbe, marginLeft: h * 0.1, textShadow: `0 0 ${h * 0.05}px ${farbe}` }}>{c}</span>
      ) : (
        <Ziffer key={i} z={c} h={h} farbe={farbe} aus={aus} />
      ),
    )}
  </div>
);

// ---------- Alte Seite «Muster-Praxis» (fiktiv) ----------
export const ALT = { w: 620, h: 1100 };
export const AlteSeite: React.FC<{ zaehler?: string; unscharf?: number }> = ({ zaehler = "000412", unscharf = 0 }) => {
  const txt: React.CSSProperties = { fontFamily: schriftR05.alt, color: "#000", filter: unscharf ? `blur(${unscharf}px)` : undefined };
  return (
    <div style={{ width: ALT.w, height: ALT.h, background: "#fffef4", position: "relative", overflow: "hidden", border: "3px outset #c0c0c0" }}>
      <div style={{ height: 120, background: "linear-gradient(180deg,#1d3fbf,#0a1f7a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...txt, color: "#ffff66", fontSize: 50, fontWeight: 700, fontStyle: "italic", textShadow: "3px 3px 0 #000" }}>Herzlich Willkommen!</span>
      </div>
      <div style={{ background: "#c0c0c0", padding: "6px 10px", ...txt, fontSize: 20 }}>Physiotherapie Muster-Praxis · seit 1998</div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 170, background: "#e8e8ff", padding: 12, minHeight: 760, borderRight: "2px solid #9999cc" }}>
          {["Startseite", "Über uns", "Angebot", "Team", "Anfahrt", "Gästebuch", "Links", "Kontakt", "Impressum"].map((l) => (
            <div key={l} style={{ ...txt, color: "#0000ee", textDecoration: "underline", fontSize: 22, margin: "10px 0" }}>» {l}</div>
          ))}
          <div style={{ marginTop: 40, ...txt, fontSize: 16, textAlign: "center" }}>Sie sind Besucher Nr.</div>
          <div style={{ margin: "6px auto 0", width: 130, background: "#000", color: "#33ff33", fontFamily: "'DejaVu Sans Mono', monospace", fontSize: 26, textAlign: "center", letterSpacing: 2, padding: "2px 0", border: "2px inset #666" }}>{zaehler}</div>
        </div>
        <div style={{ flex: 1, padding: 18 }}>
          <div style={{ ...txt, color: "#cc0000", fontWeight: 700, fontSize: 26, background: "#ffff99", border: "2px dashed #cc0000", padding: "6px 8px", marginBottom: 16 }}>Neu: Jetzt mit Gästebuch!!</div>
          <div style={{ ...txt, fontSize: 21, lineHeight: 1.35 }}>
            Liebe Besucherinnen und Besucher, herzlich willkommen auf unserer Homepage. Hier finden Sie alle Informationen rund um unsere Praxis und unser Angebot. Bitte beachten Sie auch die Öffnungszeiten.
          </div>
          <div style={{ height: 210, margin: "18px 0", background: "repeating-linear-gradient(45deg,#ddd 0 10px,#eee 10px 20px)", border: "2px solid #999", display: "flex", alignItems: "center", justifyContent: "center", ...txt, fontSize: 18, color: "#777" }}>[ Bild wird geladen … ]</div>
          <div style={{ ...txt, fontWeight: 700, fontSize: 24, textDecoration: "underline" }}>Öffnungszeiten</div>
          <table style={{ ...txt, fontSize: 19, borderCollapse: "collapse", marginTop: 8, width: "100%" }}>
            <tbody>
              {["Mo–Fr 08.00–12.00", "Mo–Fr 13.30–18.00", "Sa nach Vereinbarung"].map((r) => (
                <tr key={r}><td style={{ border: "1px solid #999", padding: 5 }}>{r}</td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ ...txt, fontSize: 16, marginTop: 30, color: "#555" }}>Optimiert für Internet Explorer 6.0 · 800×600</div>
        </div>
      </div>
    </div>
  );
};

// ---------- Neue Seite (echter Screenshot solleva.ch, 390 px @2x) ----------
export const NeueSeite: React.FC<{ datei?: string; w?: number | string; h?: number | string }> = ({ datei = "solleva/hero.png", w = ALT.w, h = ALT.h }) => (
  <Img src={asset(datei)} style={{ width: w, height: h, objectFit: "cover", objectPosition: "top", display: "block" }} />
);

// ---------- Scherben (Voronoi, fester Seed) ----------
type P = [number, number];
const zufall = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const schneide = (poly: P[], a: P, b: P): P[] => {
  // behält die Seite, die näher an a liegt (Halbraum der Mittelsenkrechten)
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1];
  const d = (p: P) => (p[0] - mx) * nx + (p[1] - my) * ny;
  const out: P[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], dp = d(p), dq = d(q);
    if (dp <= 0) out.push(p);
    if (dp * dq < 0) {
      const t = dp / (dp - dq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
};
export type Scherbe = { poly: P[]; cx: number; cy: number; i: number };
export const scherben = (w: number, h: number, n = 22, seed = 5): Scherbe[] => {
  const r = zufall(seed);
  // Aufschlagpunkt unten-mitte: dichtere Zellen dort
  const pts: P[] = Array.from({ length: n }, (_, i) => {
    const nah = i < n * 0.45;
    return nah ? [w * (0.3 + r() * 0.4), h * (0.55 + r() * 0.35)] : [r() * w, r() * h];
  });
  return pts.map((a, i) => {
    let poly: P[] = [[0, 0], [w, 0], [w, h], [0, h]];
    pts.forEach((b, j) => { if (j !== i) poly = schneide(poly, a, b); });
    const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
    const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    return { poly, cx, cy, i };
  });
};

/** Eine Scherbe als 3D-Element: Vorderseite alte Seite, Rückseite neue Seite. */
export const ScherbeEl: React.FC<{
  s: Scherbe; dx: number; dy: number; dz?: number; rx?: number; ry: number; rz: number;
  vorne: React.ReactNode; hinten: React.ReactNode; kante?: number;
}> = ({ s, dx, dy, dz = 0, rx = 0, ry, rz, vorne, hinten, kante = 0.9 }) => {
  const clip = `polygon(${s.poly.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(",")})`;
  const seite = (inhalt: React.ReactNode, rueck: boolean) => (
    // Rückseite um die Scherbenmitte gedreht: nach ry = 180° liegt sie unverspiegelt an derselben Stelle.
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transformOrigin: `${s.cx}px ${s.cy}px`, transform: rueck ? "rotateY(180deg)" : undefined }}>
      <div style={{ position: "absolute", inset: 0, clipPath: clip }}>{inhalt}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: ALT.w, height: ALT.h, transformStyle: "preserve-3d", transformOrigin: `${s.cx}px ${s.cy}px`, transform: `translate3d(${dx}px, ${dy}px, ${dz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {seite(vorne, false)}
      {seite(hinten, true)}
      {/* Glanzkante */}
      <svg width={ALT.w} height={ALT.h} style={{ position: "absolute", inset: 0, overflow: "visible", transform: "translateZ(1px)" }}>
        <polygon points={s.poly.map((p) => p.join(",")).join(" ")} fill="none" stroke={s.i % 3 ? web.lilac : web.cyan} strokeOpacity={kante} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 5px ${web.cyan})` }} />
      </svg>
    </div>
  );
};

// ---------- Kristalle (lokal freigestellt aus Kristalle A) ----------
export const Kristall: React.FC<{ nr: 1 | 2 | 3; x: number; y: number; h: number; dreh?: number; blur?: number }> = ({ nr, x, y, h, dreh = 0, blur = 0 }) => (
  <Img src={asset(`kristalle/kristall-${nr}.png`)} style={{ position: "absolute", left: x, top: y, height: h, transform: `translate(-50%,-50%) rotate(${dreh}deg)`, filter: `blur(${blur}px) drop-shadow(0 0 30px rgba(143,227,255,.35))` }} />
);

// ---------- Handy-Rahmen ----------
export const Handy: React.FC<{ w: number; h?: number; children: React.ReactNode }> = ({ w, h: hoehe, children }) => {
  const h = hoehe ?? w * (1688 / 780);
  return (
    <div style={{ width: w + 24, height: h + 24, padding: 12, borderRadius: w * 0.16, background: "linear-gradient(160deg,#dfe5f1,#5c6378 40%,#e8ecf5 60%,#8a93ab)", boxShadow: "0 40px 90px rgba(108,63,212,.45), 0 0 0 2px rgba(255,255,255,.15)" }}>
      <div style={{ width: w, height: h, borderRadius: w * 0.13, overflow: "hidden", position: "relative", background: web.ink }}>
        {children}
        <div style={{ position: "absolute", top: w * 0.03, left: "50%", width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, background: "#000", borderRadius: 99 }} />
      </div>
    </div>
  );
};

// ---------- Typografie ----------
export const Chrom: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <span style={{ fontFamily: schriftR05.serif, fontSize: size, lineHeight: 1, background: web.chrome, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 6px 18px rgba(0,0,0,.6))", ...style }}>{children}</span>
);

/** Safe-Zone-Rahmen fürs Storyboard (Zone x 60–940 / y 250–1550, Text x 95–900 / y ≥ 300). */
export const SafeZone: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 60, top: 250, width: 880, height: 1300, border: "3px dashed rgba(255,226,122,.85)" }} />
    <div style={{ position: "absolute", left: 95, top: 300, width: 805, height: 1250, border: "2px dotted rgba(255,226,122,.45)" }} />
  </AbsoluteFill>
);

// ---------- Schrift Reel 05 (Wunsch Gianluca: modern und fett wie Reel 04 «Filmcrew») ----------
// Archivo 900, breit (wdth 112 %), Versalien, Prägung in Solleva-Violett.
export const ARCHIVO = "Archivo R04"; // geladen über SchriftenR04 (src/reels/r04/Look.tsx)
export const praegung = (tiefe: number, a: string, b: string) => {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [ca, cb] = [hex(a), hex(b)];
  const s: string[] = [];
  for (let i = 1; i <= tiefe; i++) {
    const t = i / tiefe;
    const c = ca.map((v, k) => Math.round(v + (cb[k] - v) * t));
    s.push(`${(i * 0.6).toFixed(1)}px ${i}px 0 rgb(${c.join(",")})`);
  }
  return s;
};
export const titelStil = (size: number, tiefe = 6): React.CSSProperties => ({
  fontFamily: ARCHIVO,
  fontWeight: 900,
  fontStretch: "112%",
  fontSize: size,
  lineHeight: 0.98,
  letterSpacing: "-0.005em",
  textTransform: "uppercase",
  color: web.text,
  textShadow: [...praegung(tiefe, "#7b62d6", "#1c1550"), `0 ${tiefe + 10}px 28px rgba(4,5,12,.75)`].join(","),
});
export const schluesselStil = (tiefe = 6): React.CSSProperties => ({
  color: web.lilac,
  textShadow: [...praegung(tiefe, "#5a3bc4", "#1c1550"), `0 ${tiefe + 10}px 28px rgba(4,5,12,.75)`, `0 0 40px rgba(169,139,255,.35)`].join(","),
});
export const textStil = (size: number): React.CSSProperties => ({
  fontFamily: ARCHIVO,
  fontWeight: 600,
  fontStretch: "100%",
  fontSize: size,
  lineHeight: 1.15,
  color: web.muted,
  textShadow: "0 4px 18px rgba(4,5,12,.85)",
});
