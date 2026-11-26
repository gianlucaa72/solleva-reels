// K06 «Fluss-Kamera» (Feedback Reel 05 v1: Zooms zu ruckartig, «muss wie in einem Fluss sein»).
//
// Prinzip
// 1. Eine einzige Kamerabahn für das ganze Reel, definiert durch Wegpunkte (Zeit, Zoom, Mitte, Drehung).
// 2. Zwischen zwei Wegpunkten wird als «Spiral-Ähnlichkeit» interpoliert: Zoom und Drehung logarithmisch
//    gleichmässig, und zwar um den Fixpunkt der beiden Kamerastellungen. Der Punkt, auf den gezoomt wird,
//    bleibt dadurch ruhig im Bild (kein Ausschwingen nach aussen wie bei linearer Mitte).
// 3. Fortschritt pro Fahrt mit der Minimum-Jerk-Kurve (10t³ − 15t⁴ + 6t⁵): Tempo UND Beschleunigung starten
//    und enden bei 0.
// 4. Danach wird die ganze Bahn über die Zeit mit einem Gauss-Fenster geglättet (σ in Frames). Das lässt
//    aufeinanderfolgende Fahrten ineinanderfliessen (keine Stopps an den Wegpunkten, keine Sprünge in der
//    Beschleunigung) und ergibt einen Fluss statt Stop-and-go.
// 5. Messbar: `kurvenWerte()` liefert pro Frame Tempo und Beschleunigung (Prüfung ohne Hinsehen).
//
// Kamera als komplexe Ähnlichkeitsabbildung: Bildpunkt z = a·w + b (a = s·e^{iθ}, w = Weltpunkt).

export type K = { re: number; im: number };
const k = (re: number, im = 0): K => ({ re, im });
const add = (x: K, y: K): K => k(x.re + y.re, x.im + y.im);
const sub = (x: K, y: K): K => k(x.re - y.re, x.im - y.im);
const mul = (x: K, y: K): K => k(x.re * y.re - x.im * y.im, x.re * y.im + x.im * y.re);
const div = (x: K, y: K): K => {
  const d = y.re * y.re + y.im * y.im;
  return k((x.re * y.re + x.im * y.im) / d, (x.im * y.re - x.re * y.im) / d);
};
const expK = (x: K): K => k(Math.exp(x.re) * Math.cos(x.im), Math.exp(x.re) * Math.sin(x.im));
const MITTE = k(540, 960);

/** Kamerastellung: Weltpunkt (cx, cy) liegt in der Bildmitte, Zoom s, Drehung rot (Grad; die Welt wird im Bild um rot gedreht, + = im Uhrzeigersinn). */
export type Stellung = { s: number; cx: number; cy: number; rot?: number };
export type Wegpunkt = Stellung & { f: number };

type Affin = { la: K; b: K }; // la = log(a) = ln s + iθ
const zuAffin = (st: Stellung): Affin => {
  const th = ((st.rot ?? 0) * Math.PI) / 180;
  const la = k(Math.log(st.s), th);
  const a = expK(la);
  return { la, b: sub(MITTE, mul(a, k(st.cx, st.cy))) };
};
const zuStellung = (x: Affin): Stellung => {
  const a = expK(x.la);
  const c = div(sub(MITTE, x.b), a);
  return { s: Math.exp(x.la.re), cx: c.re, cy: c.im, rot: (x.la.im * 180) / Math.PI };
};

/** Spiral-Ähnlichkeit zwischen zwei Stellungen, e = 0..1. */
const spirale = (p: Affin, q: Affin, e: number): Affin => {
  const la = k(p.la.re + (q.la.re - p.la.re) * e, p.la.im + (q.la.im - p.la.im) * e);
  const a0 = expK(p.la), a1 = expK(q.la);
  const dA = sub(a0, a1);
  if (Math.hypot(dA.re, dA.im) < 1e-9) return { la, b: add(p.b, k((q.b.re - p.b.re) * e, (q.b.im - p.b.im) * e)) };
  const P = div(sub(q.b, p.b), dA); // Fixpunkt (Welt)
  const Z = add(mul(a0, P), p.b); // sein Bildpunkt (bleibt fest)
  return { la, b: sub(Z, mul(expK(la), P)) };
};

const minJerk = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (10 + x * (-15 + 6 * x));
};

const SUB = 4; // Abtastung: 4 Proben pro Frame

export type FlussKamera = {
  /** Stellung bei Frame f (auch Bruchteile, für Bewegungsunschärfe). */
  bei: (f: number) => Stellung;
  /** Tempo für die Bewegungsunschärfe (log-Zoom + Drehung + Verschiebung im Bild). */
  tempo: (f: number) => number;
  /** Pro Frame: Zoom-Tempo (Verdoppelungen/s), Bild-Tempo (px/s), Beschleunigung (px/s²). */
  kurvenWerte: () => { f: number; zoomProS: number; pxProS: number; beschl: number }[];
};

/**
 * Baut die Kamera aus Wegpunkten. Zwischen zwei Wegpunkten fährt sie mit Minimum-Jerk; `glaettung` (σ in Frames)
 * lässt die Fahrten ineinanderfliessen. Stillstand gibt es nicht: `drift` legt einen langsamen Push darüber.
 */
export const flussKamera = (wege: Wegpunkt[], dauer: number, o: { glaettung?: number; drift?: number } = {}): FlussKamera => {
  const sigma = o.glaettung ?? 7;
  const drift = o.drift ?? 0.012; // log-Zoom pro Sekunde (≈ 1,2 %/s)
  const ws = [...wege].sort((x, y) => x.f - y.f);
  const af = ws.map(zuAffin);
  const roh = (f: number): Affin => {
    let i = 0;
    while (i < ws.length - 1 && f > ws[i + 1].f) i++;
    if (f <= ws[0].f) return af[0];
    if (i >= ws.length - 1) return af[af.length - 1];
    const e = minJerk((f - ws[i].f) / (ws[i + 1].f - ws[i].f));
    return spirale(af[i], af[i + 1], e);
  };
  // Abtasten mit Rand (Glättung braucht Werte vor 0 und nach dem Ende)
  const rand = Math.ceil(sigma * 4);
  const n = (dauer + 2 * rand) * SUB + 1;
  // Kanäle: log-Zoom, Drehung und der Weltpunkt in der Bildmitte (nicht die Bildverschiebung b: deren Mittelwert
  // verzerrt die Bahn, sobald sich der Zoom im Glättungsfenster stark ändert → Kamera schwingt aus).
  const la_re = new Float64Array(n), la_im = new Float64Array(n), c_re = new Float64Array(n), c_im = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    const f = j / SUB - rand;
    const st = zuStellung(roh(f));
    la_re[j] = Math.log(st.s) + (drift / 30) * f; // Drift als langsamer Push um die Bildmitte
    la_im[j] = ((st.rot ?? 0) * Math.PI) / 180;
    c_re[j] = st.cx;
    c_im[j] = st.cy;
  }
  // Gauss-Glättung (getrennt pro Kanal; im log-Zoom-Raum, damit Zoom gleichmässig wirkt)
  const r = Math.ceil(sigma * 3 * SUB);
  const g = Array.from({ length: 2 * r + 1 }, (_, i) => Math.exp(-0.5 * ((i - r) / (sigma * SUB)) ** 2));
  const gs = g.reduce((s, v) => s + v, 0);
  const glatt = (src: Float64Array) => {
    const out = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += src[Math.max(0, Math.min(n - 1, j + i))] * g[i + r];
      out[j] = s / gs;
    }
    return out;
  };
  const G = [glatt(la_re), glatt(la_im), glatt(c_re), glatt(c_im)];
  const affinBei = (f: number): Affin => {
    const x = (f + rand) * SUB;
    const j = Math.max(0, Math.min(n - 2, Math.floor(x)));
    const t = Math.max(0, Math.min(1, x - j));
    const v = G.map((a) => a[j] + (a[j + 1] - a[j]) * t);
    return zuAffin({ s: Math.exp(v[0]), rot: (v[1] * 180) / Math.PI, cx: v[2], cy: v[3] });
  };
  const bei = (f: number) => zuStellung(affinBei(f));
  // Bild-Tempo: wie schnell bewegt sich ein Punkt in der Bildmitte bzw. am Rand (px pro Frame)
  const bildBewegung = (f0: number, f1: number) => {
    const p = affinBei(f0), q = affinBei(f1);
    const st = zuStellung(p);
    const pts = [k(st.cx, st.cy), k(st.cx + 400 / st.s, st.cy + 700 / st.s)];
    return Math.max(...pts.map((w) => {
      const z0 = add(mul(expK(p.la), w), p.b), z1 = add(mul(expK(q.la), w), q.b);
      return Math.hypot(z1.re - z0.re, z1.im - z0.im);
    }));
  };
  const tempo = (f: number) => bildBewegung(f - 0.5, f + 0.5) / 600;
  const kurvenWerte = () =>
    Array.from({ length: dauer }, (_, f) => {
      const v0 = bildBewegung(f - 1, f), v1 = bildBewegung(f, f + 1);
      const a0 = affinBei(f - 0.5), a1 = affinBei(f + 0.5);
      return { f, zoomProS: ((a1.la.re - a0.la.re) * 30) / Math.LN2, pxProS: v1 * 30, beschl: (v1 - v0) * 900 };
    });
  return { bei, tempo, kurvenWerte };
};

// ---------- Verschachtelte Welten (Zoom-Through) ----------
/** Fenster einer Kind-Welt in der Eltern-Welt: Mitte, Breite (Kind-Breite 1080 → w), Drehung (Grad). */
export type Fenster = { x: number; y: number; w: number; rot?: number };
/** Stellung der Kamera in Kind-Koordinaten (für das Rendern der Kind-Welt allein). */
export const inKind = (st: Stellung, fe: Fenster): Stellung => {
  const kf = fe.w / 1080;
  const rot = ((fe.rot ?? 0) * Math.PI) / 180;
  // Welt-Eltern = O + kf·e^{iφ}·(Kind − Kindmitte)
  const rel = k(st.cx - fe.x, st.cy - fe.y);
  const back = mul(rel, k(Math.cos(-rot) / kf, Math.sin(-rot) / kf));
  return { s: st.s * kf, cx: 540 + back.re, cy: 960 + back.im, rot: (st.rot ?? 0) + (fe.rot ?? 0) };
};
/** CSS-Transform einer Ebene (Welt 1080 × 1920) für eine Stellung. */
export const kameraCss = (st: Stellung) =>
  `translate(540px, 960px) rotate(${st.rot ?? 0}deg) scale(${st.s}) translate(${-st.cx}px, ${-st.cy}px)`;
/** Liegt der ganze Bildausschnitt innerhalb des (gedrehten) Rechtecks r (Eltern-Koordinaten, Breite w, Höhe h)? */
export const deckt = (st: Stellung, r: { x: number; y: number; w: number; h: number; rot?: number }) => {
  const th = ((st.rot ?? 0) * Math.PI) / 180;
  const rr = ((r.rot ?? 0) * Math.PI) / 180;
  const ecken = [[0, 0], [1080, 0], [0, 1920], [1080, 1920]];
  return ecken.every(([X, Y]) => {
    // Bildpunkt → Welt: w = c + R(−rot)·(z − M)/s
    const dx = (X - 540) / st.s, dy = (Y - 960) / st.s;
    const wx = st.cx + dx * Math.cos(-th) - dy * Math.sin(-th);
    const wy = st.cy + dx * Math.sin(-th) + dy * Math.cos(-th);
    // Welt → Rechteck-Koordinaten: u = R(−rr)·(w − r)
    const ux = (wx - r.x) * Math.cos(-rr) - (wy - r.y) * Math.sin(-rr);
    const uy = (wx - r.x) * Math.sin(-rr) + (wy - r.y) * Math.cos(-rr);
    return Math.abs(ux) <= r.w / 2 && Math.abs(uy) <= r.h / 2;
  });
};
/** CSS für ein Kind-Fenster in der Eltern-Welt (Inhalt 1080 × 1920, Mitte auf (x, y), gedreht, skaliert). */
export const fensterCss = (fe: Fenster) =>
  `translate(${fe.x}px, ${fe.y}px) rotate(${fe.rot ?? 0}deg) scale(${fe.w / 1080}) translate(-540px, -960px)`;
/** Umkehrung von inKind: Stellung in Kind-Koordinaten → Stellung in Eltern-Koordinaten. */
export const ausKind = (st: Stellung, fe: Fenster): Stellung => {
  const kf = fe.w / 1080;
  const rot = ((fe.rot ?? 0) * Math.PI) / 180;
  const rel = k((st.cx - 540) * kf, (st.cy - 960) * kf);
  const vor = mul(rel, k(Math.cos(rot), Math.sin(rot)));
  return { s: st.s / kf, cx: fe.x + vor.re, cy: fe.y + vor.im, rot: (st.rot ?? 0) - (fe.rot ?? 0) };
};
