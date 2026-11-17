import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { farben, schrift } from "../../brand/solleva";
import { kurve, tw } from "../../lib/bewegung";
import { Ton } from "../../lib/kamera";
import { Schriften } from "../../components/Basis";
import timeline from "./timeline.json";
import { K } from "./Reel";

// ======================================================================
// «4 Schichten» v2 – Blueprint / Explosionszeichnung.
// EINE durchgehende Einstellung: 4 Platten im Raum, Kamera fährt von oben nach unten.
// Eigene Projektion → alles in einem SVG, Linien bleiben gestochen scharf.
// Timing (Stimme) unverändert aus timeline.json; Schlüsselwörter K aus v1.
// ======================================================================

export const BP_DAUER = timeline.dauer;
const A = (v: string) => staticFile(`assets/reels/vier-schichten/${v}`);

// ---------- Farben (60/30/10) ----------
const NAVY = "#0A1130"; // Solleva-Nacht, minimal blauer
const WEISS = "#FFFFFF";
const LILA = farben.lavendelAkzent; // Linien auf dunkel
const LILA_F = farben.violett; // Flächen (Button, CTA)

// ---------- Plattenmass ----------
const PW = 720;
const PH = 520;
const ABSTAND = 330;

// ---------- Hilfen ----------
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const deg = (d: number) => (d * Math.PI) / 180;
const fenster = (f: number, an: number, aus: number, rein = 8, raus = 6) =>
  Math.min(tw(f, an, rein, 0, 1, kurve.land), tw(f, aus, raus, 1, 0, kurve.raus));

type Cam = { fokus: number; zoom: number; rz: number; a: number; cx: number; cy: number };

/** Kamerafahrt: Segmente nacheinander, jedes mit Heavy-Kurve. Startet ~6 Frames vor dem Satz. */
const kamera = (f: number): Cam => {
  let c: Cam = { fokus: 1.5, zoom: 1.05, rz: -44, a: 60, cx: 540, cy: 1180 };
  const seg = (von: number, dauer: number, ziel: Partial<Cam>, k = kurve.heavy) => {
    const p = tw(f, von, dauer, 0, 1, k);
    const n: Cam = { ...c };
    (Object.keys(ziel) as (keyof Cam)[]).forEach((key) => (n[key] = mix(c[key], ziel[key] as number, p)));
    c = n;
  };
  seg(K.vier1 - 6, 30, { zoom: 0.64, rz: -36, cy: 1230 }); // Hook: nah → zieht beim Auffächern zurück
  seg(K.vier1 + 24, 70, { zoom: 0.68, rz: -33 }, kurve.linear);
  seg(K.s3 - 6, 26, { fokus: 0, zoom: 1.14, rz: -32, a: 58, cy: 1260 }); // Platte 01
  seg(K.s4 - 6, 26, { fokus: 1, rz: -30 }); // Platte 02
  seg(K.s5 - 6, 26, { fokus: 2, rz: -34 }); // Platte 03
  seg(K.s6 - 4, 26, { fokus: 3, rz: -31, zoom: 1.1 }); // Platte 04 (Fundament)
  seg(K.s9 - 6, 24, { fokus: 1.5, zoom: 0.66, rz: -34, a: 58, cy: 1230 }); // weit
  seg(K.zusammen + 2, 22, { zoom: 1.0, rz: -14, a: 32, cy: 1180 }); // zusammengesetzt, frontaler
  seg(K.s10 - 4, 28, { zoom: 0.5, rz: -12, a: 40, cy: 1470 }); // sinkt unter die Endkarte
  // Standbild lebt: minimaler Drift
  return { ...c, rz: c.rz + Math.sin(f / 70) * 0.8, zoom: c.zoom * (1 + Math.sin(f / 90) * 0.008), cx: c.cx + Math.sin(f / 55) * 3 };
};

/** Platten-Abstand: zusammen → explodiert auf «vier» → rastet auf «zusammen» ein (mit Overshoot). */
const abstand = (f: number) => {
  let s = tw(f, K.vier1 - 2, 22, 34, ABSTAND, kurve.heavy);
  if (f >= K.zusammen) {
    const z = f - K.zusammen;
    s = z < 15 ? tw(z, 0, 15, ABSTAND, -10, kurve.heavy) : tw(z, 15, 6, -10, 0, kurve.land);
  }
  return s;
};

type P = { x: number; y: number; t: number };
/** Weltpunkt → Bildschirm. x,y in der Platte (Mitte = 0), z = Höhe im Stapel. */
const projektor = (cam: Cam, S: number) => {
  const fz = (1.5 - cam.fokus) * S;
  const d = 2600;
  return (x: number, y: number, z: number): P => {
    const zz = z - fz;
    const cr = Math.cos(deg(cam.rz)), sr = Math.sin(deg(cam.rz));
    const x1 = x * cr - y * sr;
    const y1 = x * sr + y * cr;
    const ca = Math.cos(deg(cam.a)), sa = Math.sin(deg(cam.a));
    const sy = y1 * ca - zz * sa;
    const tiefe = y1 * sa + zz * ca;
    const k = d / (d - tiefe * cam.zoom);
    return { x: cam.cx + x1 * cam.zoom * k, y: cam.cy + sy * cam.zoom * k, t: tiefe };
  };
};
const plattenZ = (i: number, S: number) => (1.5 - i) * S;

/** Affine Abbildung der Platte (lokal 0..PW, 0..PH) auf den Bildschirm. */
const matrix = (pr: ReturnType<typeof projektor>, z: number) => {
  const o = pr(-PW / 2, -PH / 2, z);
  const ax = pr(PW / 2, -PH / 2, z);
  const by = pr(-PW / 2, PH / 2, z);
  return `matrix(${(ax.x - o.x) / PW} ${(ax.y - o.y) / PW} ${(by.x - o.x) / PH} ${(by.y - o.y) / PH} ${o.x} ${o.y})`;
};
const lokal = (pr: ReturnType<typeof projektor>, z: number, u: number, v: number) => pr(u - PW / 2, v - PH / 2, z);

// ---------- Strich-Helfer (non-scaling, zeichnet sich per pathLength) ----------
const NS = { vectorEffect: "non-scaling-stroke" as const };
const zug = (p: number) => ({ pathLength: 100, strokeDasharray: 100, strokeDashoffset: 100 * (1 - Math.max(0, Math.min(1, p))) });

// ======================================================================
// Platteninhalte (lokale Koordinaten 720×520). Zusammengelegt ergeben sie EINE Website.
// ======================================================================
type Zustand = { f: number; akt: number; final: number; o: number };

const Platte1Marke: React.FC<Zustand> = ({ f, akt, final, o }) => {
  const w = (x: number) => x * o;
  const foto = tw(f, K.echte + 2, 14, 0, 1, kurve.heavy);
  const logo = Math.max(akt * tw(f, K.marke - 2, 10, 0, 1), final);
  return (
    <g>
      {/* Logo + Favicon (funktioniert winzig) */}
      <text x={30} y={74} fontFamily={schrift.text} fontWeight={800} fontSize={26} fill={WEISS} opacity={w(0.5 + 0.5 * logo)} letterSpacing={2}>
        DEIN GYM<tspan fill={akt > 0.5 || final > 0.5 ? LILA : WEISS}>.</tspan>
      </text>
      <rect x={196} y={52} width={24} height={24} rx={5} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.7)} {...NS} />
      <text x={202} y={70} fontFamily={schrift.text} fontWeight={800} fontSize={15} fill={WEISS} opacity={w(0.8)}>G</text>
      {/* Hero-Text (Botschaft) */}
      <text x={34} y={150} fontFamily={schrift.text} fontWeight={800} fontSize={34} fill={WEISS} opacity={w(0.85)}>Krafttraining in Olten.</text>
      <text x={34} y={182} fontFamily={schrift.mono} fontSize={13} fill={WEISS} opacity={w(0.6)} letterSpacing={1}>FÜR ALLE, DIE STÄRKER WERDEN WOLLEN</text>
      {/* Foto-Feld: leer = Fadenkreuz; «echte» → eigenes Foto in Graustufen */}
      <rect x={400} y={100} width={290} height={196} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} />
      <line x1={400} y1={100} x2={690} y2={296} stroke={WEISS} strokeWidth={1} opacity={w(0.35 * (1 - foto))} {...NS} />
      <line x1={690} y1={100} x2={400} y2={296} stroke={WEISS} strokeWidth={1} opacity={w(0.35 * (1 - foto))} {...NS} />
      {foto > 0 && (
        <>
          <clipPath id="fotoClip"><rect x={400} y={100} width={290} height={196 * foto} /></clipPath>
          <image href={A("g1-gym.png")} x={400} y={100} width={290} height={196} preserveAspectRatio="xMidYMid slice" filter="url(#grau)" opacity={0.85 * o} clipPath="url(#fotoClip)" />
        </>
      )}
      {/* Leistungs-Beschriftungen */}
      {["KRAFT", "KURSE", "PERSONAL"].map((t, i) => (
        <text key={t} x={46 + i * 228} y={372} fontFamily={schrift.mono} fontSize={14} fill={WEISS} opacity={w(0.7)} letterSpacing={1.5}>{t}</text>
      ))}
    </g>
  );
};

const Platte2Struktur: React.FC<Zustand> = ({ f, akt, final, o }) => {
  const zeichnen = Math.max(tw(f, K.struktur - 4, 22, 0, 1, kurve.heavy), f < K.s4 ? 1 : 0, final);
  const L = (an: boolean) => (an && akt > 0.5 ? LILA : WEISS);
  const box = (bei: number) => tw(f, bei, 10, 0, 1, kurve.heavy);
  const w = (x: number) => x * o;
  return (
    <g>
      {/* Navigation: max. 5 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={404 + i * 60} x2={446 + i * 60} y1={64} y2={64} stroke={WEISS} strokeWidth={3} opacity={w(0.7)} {...NS} {...zug(zeichnen)} />
      ))}
      {/* Hero-Rahmen */}
      <rect x={20} y={96} width={680} height={208} rx={6} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} {...zug(zeichnen)} />
      {/* WAS / WO / FÜR WEN */}
      {[
        { b: K.was, x: 28, y: 118, wd: 236, h: 42, t: "WAS" },
        { b: K.wo, x: 272, y: 118, wd: 100, h: 42, t: "WO" },
        { b: K.fuerwen, x: 28, y: 166, wd: 344, h: 24, t: "FÜR WEN" },
      ].map((k) => {
        const p = box(k.b);
        if (p <= 0 || final >= 1) return null;
        return (
          <g key={k.t}>
            <rect x={k.x} y={k.y} width={k.wd} height={k.h} rx={4} fill="none" stroke={L(true)} strokeWidth={2.2} opacity={w(1 - final)} {...NS} {...zug(p)} />
            <text x={k.x + k.wd + 6} y={k.y + 12} fontFamily={schrift.mono} fontSize={12} fill={L(true)} opacity={w(p * (1 - final))} letterSpacing={1}>{k.t}</text>
          </g>
        );
      })}
      {/* Leistungen auf einen Blick */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={20 + i * 228} y={318} width={216} height={70} rx={6} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} {...zug(zeichnen)} />
      ))}
      {/* Team-Gesicht + Bewertungen */}
      <circle cx={52} cy={434} r={26} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.7)} {...NS} {...zug(zeichnen)} />
      <circle cx={52} cy={426} r={9} fill="none" stroke={WEISS} strokeWidth={1.2} opacity={w(0.6)} {...NS} />
      <path d="M36 452 Q52 436 68 452" fill="none" stroke={WEISS} strokeWidth={1.2} opacity={w(0.6)} {...NS} />
      <text x={92} y={430} fontFamily={schrift.mono} fontSize={13} fill={WEISS} opacity={w(0.7)} letterSpacing={1}>TEAM</text>
      <text x={92} y={456} fontSize={20} fill={WEISS} opacity={w(0.8)} letterSpacing={3}>★★★★★</text>
    </g>
  );
};

const Platte3Handlung: React.FC<Zustand & { druck: number; klick2: number }> = ({ f, akt, final, o, druck, klick2 }) => {
  const knopf = Math.max(akt, final) * tw(f, K.button - 6, 10, 0, 1, kurve.land) + final * (f >= K.s9 ? 1 : 0);
  const fuell = Math.min(1, knopf);
  const w = (x: number) => x * o;
  const zeiten = Math.max(tw(f, K.anklickbar + 8, 8, 0, 1), final);
  return (
    <g>
      {/* EIN Haupt-Button */}
      <g transform={`translate(130 252) scale(${1 - 0.05 * druck}) translate(-130 -252)`}>
        <rect x={30} y={232} width={200} height={40} rx={20} fill={fuell > 0 ? LILA_F : "none"} fillOpacity={fuell} stroke={fuell > 0.5 ? LILA : WEISS} strokeWidth={1.8} opacity={w(1)} {...NS} />
        <text x={130} y={257} textAnchor="middle" fontFamily={schrift.text} fontWeight={800} fontSize={14} fill={WEISS} opacity={w(0.95)} letterSpacing={0.5}>PROBETRAINING BUCHEN</text>
      </g>
      {/* Öffnungszeiten + Nummer */}
      <rect x={345} y={398} width={176} height={72} rx={6} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} />
      <text x={358} y={424} fontFamily={schrift.mono} fontSize={13} fill={WEISS} opacity={w(0.8 * Math.max(zeiten, 0.5))}>MO–SO 6–22</text>
      <text x={358} y={454} fontFamily={schrift.text} fontWeight={800} fontSize={17} fill={klick2 > 0 && akt > 0.5 ? LILA : WEISS} opacity={w(0.9)}>062 000 00 00</text>
      <line x1={358} x2={500} y1={460} y2={460} stroke={klick2 > 0 && akt > 0.5 ? LILA : WEISS} strokeWidth={1.5} opacity={w(0.8)} {...NS} />
      {/* Karte */}
      <rect x={535} y={398} width={165} height={72} rx={6} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={545 + i * 28} y1={466} x2={575 + i * 28} y2={402} stroke={WEISS} strokeWidth={1} opacity={w(0.25 * Math.max(zeiten, 0.6))} {...NS} />
      ))}
    </g>
  );
};

const Platte4Fundament: React.FC<Zustand & { scan: number }> = ({ f, akt, final, o, scan }) => {
  const w = (x: number) => x * o;
  const sek = f < K.dreiSek + 8 ? tw(f, K.s7 + 4, K.dreiSek + 4 - K.s7, 0, 3, kurve.linear) : Math.min(3.6, 3 + (f - K.dreiSek - 8) * 0.012);
  const lade = f >= K.s7 ? Math.min(1, sek / 3.6) : 0;
  const mobil = tw(f, K.s7 + 2, 16, 0, 1, kurve.heavy);
  const pin = tw(f, K.lokal, 12, 0, 1, kurve.heavy);
  const recht = tw(f, K.datenschutz - 4, 12, 0, 1, kurve.heavy);
  const haken = tw(f, K.sauber, 10, 0, 1, kurve.heavy);
  const sicht = Math.max(scan, final);
  const C = (an: boolean) => (an && akt > 0.5 ? LILA : WEISS);
  return (
    <g clipPath="url(#scan4)">
      <clipPath id="scan4"><rect x={-20} y={-20} width={PW + 40} height={(PH + 40) * sicht} /></clipPath>
      {/* Browser-Leiste: Schloss, Adresse, Ladebalken (Ladezeit) */}
      <rect x={0} y={0} width={PW} height={30} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} />
      <rect x={14} y={11} width={10} height={9} rx={1.5} fill="none" stroke={C(recht > 0)} strokeWidth={1.4} opacity={w(0.9)} {...NS} />
      <path d="M16 11 V8 a3 3 0 0 1 6 0 V11" fill="none" stroke={C(recht > 0)} strokeWidth={1.4} opacity={w(0.9)} {...NS} />
      <text x={34} y={20} fontFamily={schrift.mono} fontSize={12} fill={WEISS} opacity={w(0.6)}>https://</text>
      <line x1={0} x2={PW * lade} y1={29} y2={29} stroke={sek >= 3 ? WEISS : LILA} strokeWidth={4} opacity={w(lade > 0 ? 1 : 0)} {...NS} />
      {/* Mobile zuerst: Viewport 390 px */}
      <rect x={588} y={84} width={112} height={226} rx={16} fill="none" stroke={C(f >= K.s7 && f < K.s8)} strokeWidth={2} strokeDasharray="6 5" opacity={w(0.5 + 0.5 * mobil)} {...NS} />
      <text x={594} y={326} fontFamily={schrift.mono} fontSize={12} fill={WEISS} opacity={w(0.7 * mobil)}>MOBILE ZUERST</text>
      {/* Lokal: Pin + Koordinaten im Kartenfeld */}
      <g opacity={w(Math.max(pin, final))}>
        <circle cx={617} cy={434} r={14 * pin + 4} fill="none" stroke={C(f >= K.lokal && f < K.datenschutz)} strokeWidth={2} {...NS} />
        <line x1={597} x2={637} y1={434} y2={434} stroke={WEISS} strokeWidth={1.2} {...NS} />
        <line x1={617} x2={617} y1={414} y2={454} stroke={WEISS} strokeWidth={1.2} {...NS} />
      </g>
      {/* Footer: Impressum / Datenschutz (revDSG) */}
      <rect x={0} y={486} width={PW} height={34} fill="none" stroke={WEISS} strokeWidth={1.5} opacity={w(0.6)} {...NS} />
      <text x={20} y={508} fontFamily={schrift.mono} fontSize={13} fill={C(recht > 0)} opacity={w(0.5 + 0.5 * Math.max(recht, final))} letterSpacing={1}>IMPRESSUM · DATENSCHUTZ (revDSG)</text>
      <path d="M520 503 l8 8 l16 -16" fill="none" stroke={C(true)} strokeWidth={3} opacity={w(haken > 0 ? 1 : 0)} {...NS} {...zug(haken)} />
      <text x={560} y={508} fontFamily={schrift.mono} fontSize={13} fill={WEISS} opacity={w(Math.max(pin, final) * 0.8)} letterSpacing={1}>GOOGLE-PROFIL ★★★★★</text>
    </g>
  );
};

// ======================================================================
// Bildschirm-Ebene: Ziffern, Headlines, Callouts
// ======================================================================
const Ziffer: React.FC<{ f: number; text: string; an: number; aus: number; x: number; anker: "start" | "end" }> = ({ f, text, an, aus, x, anker }) => {
  if (f < an || f > aus + 8) return null;
  const strich = tw(f, an, 22, 0, 1, kurve.heavy);
  const rausP = tw(f, aus, 7, 0, 1, kurve.raus); // Ausgang schneller
  const lebt = Math.sin((f - an) / 40) * 2;
  return (
    <text x={x} y={612 + lebt - rausP * 120} textAnchor={anker} fontFamily={schrift.text} fontWeight={800} fontSize={560} letterSpacing={-46} fill="none" stroke={WEISS} strokeWidth={2.2} opacity={0.75 * (1 - rausP)} strokeDasharray="2600" strokeDashoffset={2600 * (1 - strich)}>
      {text}
    </text>
  );
};

const Serif: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: schrift.serif, fontStyle: "italic", fontWeight: 400, fontSize: "1.12em", letterSpacing: "-0.01em" }}>{children}</span>
);

/** Headline, wechselt innerhalb des Satzes. Land-Kurve rein (Position) + kürzere, lineare Deckkraft; raus schneller. */
const Headline: React.FC<{ f: number; teile: { ab: number; inhalt: React.ReactNode }[]; bis: number; x: number; w: number; y: number; size: number; rechts?: boolean }> = ({ f, teile, bis, x, w, y, size, rechts }) => {
  if (f < teile[0].ab - 2 || f > bis + 6) return null;
  let akt = 0;
  teile.forEach((t, i) => { if (f >= t.ab) akt = i; });
  const t = teile[akt];
  const pos = tw(f, t.ab, 12, 1, 0, kurve.land);
  const op = Math.min(tw(f, t.ab, 7, 0, 1, kurve.fade), tw(f, bis, 5, 1, 0, kurve.raus));
  return (
    <div style={{ position: "absolute", left: x, width: w, top: y, fontFamily: schrift.text, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.015em", color: WEISS, textAlign: rechts ? "right" : "left", opacity: op, transform: `translateY(${pos * 22}px)` }}>
      {t.inhalt}
    </div>
  );
};

/** Technische Beschriftung mit Bezugslinie zu einem Punkt auf einer Platte. */
const Callout: React.FC<{ f: number; ab: number; bis: number; von: P; x: number; y: number; zeilen: string[]; aktiv?: boolean; gross?: string }> = ({ f, ab, bis, von, x, y, zeilen, aktiv, gross }) => {
  if (f < ab || f > bis + 6) return null;
  const l = tw(f, ab, 10, 0, 1, kurve.heavy);
  const t = tw(f, ab + 5, 7, 0, 1, kurve.fade);
  const raus = tw(f, bis, 5, 1, 0, kurve.raus);
  const knick = { x: x > 540 ? x - 60 : x + 60, y };
  const farbe = aktiv ? LILA : WEISS;
  return (
    <g opacity={raus}>
      <circle cx={von.x} cy={von.y} r={5 * l} fill={farbe} />
      <polyline points={`${von.x},${von.y} ${mix(von.x, knick.x, l)},${mix(von.y, knick.y, l)} ${mix(knick.x, x, Math.max(0, l * 2 - 1))},${y}`} fill="none" stroke={farbe} strokeWidth={1.6} opacity={0.8} />
      <g opacity={t} transform={`translate(${x} ${y})`}>
        {(() => {
          const rechts = x > 540;
          const anker = rechts ? "end" : "start";
          const hoehe = (gross ? 110 : 0) + zeilen.length * 30 + 10;
          const breite = Math.max(...zeilen.map((z) => z.length * 15), gross ? gross.length * 52 : 0) + 20;
          return (
            <>
              <rect x={rechts ? -breite + 6 : -6} y={-hoehe - 6} width={breite} height={hoehe} fill={NAVY} opacity={0.82} />
              {gross && <text x={0} y={-zeilen.length * 30 - 18} textAnchor={anker} fontFamily={schrift.mono} fontSize={84} fill={WEISS}>{gross}</text>}
              {zeilen.map((z, i) => (
                <text key={i} x={0} y={-12 - (zeilen.length - 1 - i) * 30} textAnchor={anker} fontFamily={schrift.mono} fontSize={24} fill={i === 0 && aktiv ? LILA : WEISS} opacity={i === 0 ? 1 : 0.75} letterSpacing={2}>{z}</text>
              ))}
            </>
          );
        })()}
      </g>
    </g>
  );
};

// ======================================================================
// Hauptkomposition
// ======================================================================
export const Blueprint: React.FC<{ mitMusik?: string }> = ({ mitMusik }) => {
  const f = useCurrentFrame();
  const cam = kamera(f);
  const S = abstand(f);
  const pr = projektor(cam, S);

  // Signature: Licht aus auf «vier» – 2 Frames fast schwarz, dann flackert das Raster zurück
  const dunkel = f >= K.vier && f < K.vier + 2;
  const flacker = f < K.vier ? 1 : f < K.vier + 2 ? 0 : [0.2, 0.7, 0.1, 0.9, 0.4, 1][Math.min(5, f - K.vier - 2)] ?? 1;
  const nachDunkel = f >= K.vier && f < K.s7 ? tw(f, K.vier + 2, 30, 0.12, 0.35, kurve.land) : 1; // andere Platten gedimmt

  // Aktivität je Platte
  const akt = [
    fenster(f, K.s3, K.s4 - 2),
    fenster(f, K.s4, K.s5 - 2),
    fenster(f, K.s5, K.s6 - 2),
    fenster(f, K.vier + 2, K.s9 - 2, 4),
  ];
  const final = tw(f, K.zusammen + 10, 10, 0, 1, kurve.land);
  const scan4 = Math.max(tw(f, K.vier + 2, 14, 0, 1, kurve.heavy), final);
  const vorNie = f >= K.nie && f < K.s3 ? 0.35 + 0.65 * Math.abs(Math.sin((f - K.nie) / 2.4)) : 1;
  // Grund-Deckkraft je Platte (inaktiv 0,4; aktiv 1; im Dunkel-Moment gedimmt)
  const deck = (i: number) => {
    let o = 0.42 + 0.58 * Math.max(akt[i], final);
    if (f >= K.vier && f < K.s9 && i !== 3) o *= nachDunkel / 0.42 * 0.42;
    if (dunkel) o = 0.04;
    return o;
  };

  const k1 = K.button + 10;
  const k2 = K.anklickbar + 4;
  const druck = (f >= k1 - 2 && f < k1 + 6 ? tw(f, k1 - 2, 3, 0, 1, kurve.whip) * tw(f, k1 + 1, 5, 1, 0, kurve.land) : 0);

  // Reihenfolge: unten (04) zuerst, oben (01) zuletzt
  const reihe = [3, 2, 1, 0];
  const ecken = (z: number) => [lokal(pr, z, 0, 0), lokal(pr, z, PW, 0), lokal(pr, z, PW, PH), lokal(pr, z, 0, PH)];

  // Raster bewegt sich minimal mit der Kamera (Parallaxe), Korn wechselt alle 3 Frames
  const rasterY = -cam.fokus * 46 + Math.sin(f / 80) * 4;
  const korn = Math.floor(f / 3) % 6;

  // Punkte für Callouts (Platte i, lokale u,v)
  const pt = (i: number, u: number, v: number) => lokal(pr, plattenZ(i, S), u, v);

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Schriften />
      {/* Raster + Korn (Papier) */}
      <AbsoluteFill style={{ opacity: dunkel ? 0 : flacker, backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`, backgroundSize: "30px 30px, 30px 30px, 150px 150px, 150px 150px", backgroundPosition: `0 ${rasterY}px, 0 ${rasterY}px, 0 ${rasterY}px, 0 ${rasterY}px` }} />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "screen" }}>
        <svg width="100%" height="100%">
          <filter id={`korn${korn}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={korn} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#korn${korn})`} />
        </svg>
      </AbsoluteFill>

      {/* ================= Explosionszeichnung ================= */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="grau"><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="linear" slope="1.15" intercept="-0.05" /><feFuncG type="linear" slope="1.15" intercept="-0.05" /><feFuncB type="linear" slope="1.25" intercept="-0.02" /></feComponentTransfer></filter>
        </defs>
        {/* Explosionslinien zwischen den Ecken (gestrichelt) */}
        {[0, 1, 2].map((i) => {
          const a = ecken(plattenZ(i, S));
          const b = ecken(plattenZ(i + 1, S));
          return a.map((p, j) => (
            <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={b[j].x} y2={b[j].y} stroke={WEISS} strokeWidth={1.2} strokeDasharray="5 7" opacity={dunkel ? 0 : 0.22 * (1 - final)} />
          ));
        })}
        {reihe.map((i) => {
          const z = plattenZ(i, S);
          const o = deck(i) * (i === 3 && f < K.s3 ? vorNie : 1);
          const unsichtbar = i === 3 && scan4 < 1 && f < K.s9;
          const c = ecken(z);
          const a = akt[i];
          return (
            <g key={i}>
              {/* Plattenfläche (verdeckt leicht, was darunter liegt) + Kontur */}
              <polygon points={c.map((p) => `${p.x},${p.y}`).join(" ")} fill={NAVY} fillOpacity={0.72 * (1 - final)} stroke="none" />
              <polygon points={c.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={WEISS} strokeWidth={1.75} opacity={(1 - a) * o * (unsichtbar ? 0.7 : 1)} strokeDasharray={unsichtbar ? "8 8" : undefined} />
              {a > 0 && <polygon points={c.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={LILA} strokeWidth={i === 3 ? 2.6 + 4 * tw(f, K.keiner, 14, 1, 0, kurve.land) * (f >= K.keiner ? 1 : 0) : 2.6} opacity={a * (dunkel ? 0.05 : 1)} />}
              {/* Eck-Fadenkreuze */}
              {c.map((p, j) => (
                <g key={j} opacity={dunkel ? 0 : 0.55 * Math.min(1, o + 0.2)}>
                  <line x1={p.x - 14} x2={p.x + 14} y1={p.y} y2={p.y} stroke={WEISS} strokeWidth={1.2} />
                  <line x1={p.x} x2={p.x} y1={p.y - 14} y2={p.y + 14} stroke={WEISS} strokeWidth={1.2} />
                </g>
              ))}
              {/* Inhalt in Plattenkoordinaten */}
              <g transform={matrix(pr, z)}>
                {i === 0 && <Platte1Marke f={f} akt={akt[0]} final={final} o={o} />}
                {i === 1 && <Platte2Struktur f={f} akt={akt[1]} final={final} o={o} />}
                {i === 2 && <Platte3Handlung f={f} akt={akt[2]} final={final} o={o} druck={druck} klick2={f >= k2 ? 1 : 0} />}
                {i === 3 && <Platte4Fundament f={f} akt={akt[3]} final={final} o={dunkel ? 0.04 : o} scan={f < K.s9 ? scan4 : 1} />}
                {/* Klick-Ripples auf der Platte */}
                {i === 2 && [{ k: k1, x: 130, y: 252 }, { k: k2, x: 430, y: 452 }].map((r) => {
                  const d = f - r.k;
                  if (d < 0 || d > 16) return null;
                  return <circle key={r.k} cx={r.x} cy={r.y} r={tw(d, 0, 16, 8, 70, kurve.land)} fill="none" stroke={LILA} strokeWidth={2.5} opacity={tw(d, 0, 16, 1, 0, kurve.fade)} {...NS} />;
                })}
              </g>
              {/* Scan-Linie Platte 04 */}
              {i === 3 && scan4 > 0 && scan4 < 1 && f < K.s9 && (() => {
                const l1 = lokal(pr, z, 0, PH * scan4), l2 = lokal(pr, z, PW, PH * scan4);
                return <line x1={l1.x} y1={l1.y} x2={l2.x} y2={l2.y} stroke={WEISS} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${LILA})` }} />;
              })()}
            </g>
          );
        })}

        {/* ================= Masslinien / Callouts ================= */}
        {/* Hook: Massangabe über den ganzen Stapel + Platten-Beschriftungen */}
        {f < K.s3 + 6 && (() => {
          const oben = pt(0, PW, 0), unten = pt(3, PW, PH);
          const xL = 900;
          const p = tw(f, K.vier1 + 6, 16, 0, 1, kurve.heavy);
          const raus = tw(f, K.s3 - 4, 6, 1, 0, kurve.raus);
          const namen = ["01 MARKE", "02 STRUKTUR", "03 HANDLUNG", "04 ???"];
          const verz = [0, 4, 11, 15]; // ungleich
          return (
            <g opacity={raus}>
              <line x1={xL} x2={xL} y1={oben.y} y2={mix(oben.y, unten.y, p)} stroke={WEISS} strokeWidth={1.6} opacity={0.7} />
              <path d={`M${xL - 7} ${oben.y + 12} L${xL} ${oben.y} L${xL + 7} ${oben.y + 12}`} fill="none" stroke={WEISS} strokeWidth={1.6} opacity={0.7 * p} />
              <path d={`M${xL - 7} ${unten.y - 12} L${xL} ${unten.y} L${xL + 7} ${unten.y - 12}`} fill="none" stroke={WEISS} strokeWidth={1.6} opacity={0.7 * (p > 0.98 ? 1 : 0)} />
              <text x={xL + 16} y={(oben.y + unten.y) / 2} fontFamily={schrift.mono} fontSize={24} fill={WEISS} opacity={0.8 * p} letterSpacing={3} transform={`rotate(90 ${xL + 16} ${(oben.y + unten.y) / 2})`} textAnchor="middle">4 SCHICHTEN</text>
              {namen.map((n, i) => {
                const q = pt(i, 0, PH / 2);
                const op = tw(f, K.vier1 + 12 + verz[i], 8, 0, 1, kurve.fade) * (i === 3 && f >= K.nie ? vorNie : 1);
                return (
                  <g key={n} opacity={op}>
                    <line x1={q.x} y1={q.y} x2={q.x - 40} y2={q.y} stroke={WEISS} strokeWidth={1.4} opacity={0.6} />
                    <text x={q.x - 48} y={q.y + 8} textAnchor="end" fontFamily={schrift.mono} fontSize={24} fill={WEISS} letterSpacing={2}>{n}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* Satz 3 – Marke */}
        <Callout f={f} ab={K.marke + 4} bis={K.farben - 2} von={pt(0, 208, 64)} x={130} y={790} zeilen={["LOGO", "AUCH 16 PX LESBAR", "HELL + DUNKEL"]} aktiv />
        {f >= K.farben && f < K.s4 + 4 && (() => {
          const op = Math.min(tw(f, K.farben, 8, 0, 1, kurve.fade), tw(f, K.s4 - 2, 5, 1, 0, kurve.raus));
          const sw = [{ c: NAVY, p: 60, t: "60  NAVY", w: 300 }, { c: WEISS, p: 30, t: "30  WEISS", w: 150 }, { c: LILA_F, p: 10, t: "10  LILA", w: 50 }];
          let x = 90;
          const anz = [0, 5, 13]; // ungleiche Verzögerung
          return (
            <g opacity={op} transform={`translate(0 ${tw(f, K.farben, 12, 18, 0, kurve.land)})`}>
              <text x={90} y={770} fontFamily={schrift.mono} fontSize={24} fill={WEISS} letterSpacing={2} opacity={0.75}>FARBE 60 / 30 / 10</text>
              {sw.map((s, i) => {
                const g = tw(f, K.farben + 2 + anz[i], 12, 0, 1, kurve.heavy);
                const el = (
                  <g key={i}>
                    <rect x={x} y={790} width={s.w * g} height={64} fill={s.c} stroke={WEISS} strokeWidth={1.5} />
                    <text x={x + 4} y={884} fontFamily={schrift.mono} fontSize={20} fill={WEISS} opacity={0.8 * g}>{s.t}</text>
                  </g>
                );
                x += s.w + 6;
                return el;
              })}
              <text x={600} y={830} fontFamily={schrift.mono} fontSize={20} fill={WEISS} opacity={0.7 * tw(f, K.farben + 20, 8, 0, 1)}>← AKZENT NUR FÜR BUTTONS</text>
            </g>
          );
        })()}
        {f >= K.schriften && f < K.s4 + 4 && (() => {
          const op = Math.min(tw(f, K.schriften, 8, 0, 1, kurve.fade), tw(f, K.s4 - 2, 5, 1, 0, kurve.raus));
          return (
            <g opacity={op}>
              <text x={90} y={1010} fontFamily={schrift.text} fontWeight={800} fontSize={96} fill="none" stroke={WEISS} strokeWidth={1.8}>Aa</text>
              <text x={250} y={1010} fontFamily={schrift.mono} fontSize={88} fill="none" stroke={WEISS} strokeWidth={1.6} opacity={tw(f, K.schriften + 6, 8, 0, 1)}>Aa</text>
              <text x={90} y={1048} fontFamily={schrift.mono} fontSize={20} fill={WEISS} opacity={0.7} letterSpacing={2}>MAX. 2 SCHRIFTEN</text>
            </g>
          );
        })()}
        <Callout f={f} ab={K.echte + 6} bis={K.s4 - 2} von={pt(0, 545, 296)} x={930} y={760} zeilen={["EIGENES FOTO", "KEIN STOCK"]} aktiv />
        {f >= K.echte + 16 && f < K.s4 + 4 && (() => {
          const p = tw(f, K.echte + 16, 6, 0, 1, kurve.whip) * tw(f, K.s4 - 2, 5, 1, 0, kurve.raus);
          return <line x1={918} x2={918 - 152 * p} y1={812} y2={812} stroke={LILA} strokeWidth={3} />;
        })()}

        {/* Satz 4 – Struktur */}
        <Callout f={f} ab={K.struktur + 10} bis={K.s5 - 2} von={pt(1, 520, 64)} x={930} y={1600 - 70} zeilen={["MENÜ: MAX. 5"]} />
        {f >= K.fuenf - 4 && f < K.s5 + 2 && (() => {
          const a = pt(1, 20, 92), b = pt(1, 700, 92);
          const p = tw(f, K.fuenf - 4, 12, 0, 1, kurve.heavy);
          const op = tw(f, K.s5 - 2, 5, 1, 0, kurve.raus);
          const sek = Math.min(5, Math.max(0, Math.floor((f - K.fuenf) / 7)));
          const nx = -(b.y - a.y), ny = b.x - a.x, nl = Math.hypot(nx, ny);
          const ox = (nx / nl) * 26, oy = (ny / nl) * 26;
          return (
            <g opacity={op}>
              <line x1={a.x - ox} y1={a.y - oy} x2={mix(a.x, b.x, p) - ox} y2={mix(a.y, b.y, p) - oy} stroke={WEISS} strokeWidth={1.6} />
              <line x1={a.x} y1={a.y} x2={a.x - ox * 1.4} y2={a.y - oy * 1.4} stroke={WEISS} strokeWidth={1.2} opacity={0.7} />
              <line x1={b.x} y1={b.y} x2={b.x - ox * 1.4} y2={b.y - oy * 1.4} stroke={WEISS} strokeWidth={1.2} opacity={0.7 * p} />
              <rect x={74} y={712} width={420} height={176} fill={NAVY} opacity={0.82} />
              <text x={90} y={830} fontFamily={schrift.mono} fontSize={120} fill={WEISS}>0:0{sek}</text>
              <text x={96} y={870} fontFamily={schrift.mono} fontSize={22} fill={sek >= 5 ? LILA : WEISS} letterSpacing={2}>IN 5 S KLAR</text>
            </g>
          );
        })()}
        <Callout f={f} ab={K.fuerwen + 8} bis={K.s5 - 2} von={pt(1, 52, 434)} x={140} y={1560 - 40} zeilen={["GESICHT + BEWERTUNGEN"]} />

        {/* Satz 5 – Handlung */}
        <Callout f={f} ab={k1 + 2} bis={K.s6 - 2} von={pt(2, 230, 252)} x={130} y={800} zeilen={["1 HAUPT-BUTTON", "IN AKZENTFARBE"]} aktiv />
        <Callout f={f} ab={k2 + 2} bis={K.s6 - 2} von={pt(2, 500, 460)} x={930} y={1560 - 40} zeilen={["NUMMER KLICKBAR", "ZEITEN + KARTE"]} aktiv />

        <Callout f={f} ab={K.keiner + 2} bis={K.s7 - 2} von={pt(3, 360, PH)} x={130} y={1560 - 40} zeilen={["04 FUNDAMENT", "UNSICHTBAR"]} aktiv />
        {/* Satz 7 – Ladezeit */}
        {f >= K.s7 && f < K.s8 + 4 && (() => {
          const sek = f < K.dreiSek + 8 ? tw(f, K.s7 + 4, K.dreiSek + 4 - K.s7, 0, 3, kurve.linear) : Math.min(3.6, 3 + (f - K.dreiSek - 8) * 0.012);
          const op = Math.min(tw(f, K.s7, 8, 0, 1, kurve.fade), tw(f, K.s8 - 2, 5, 1, 0, kurve.raus));
          const von = pt(3, 300, 29);
          return (
            <g opacity={op}>
              <polyline points={`${von.x},${von.y} ${von.x - 30},780 ${100},780`} fill="none" stroke={WEISS} strokeWidth={1.4} opacity={0.6} />
              <circle cx={von.x} cy={von.y} r={5} fill={sek >= 3 ? WEISS : LILA} />
              <rect x={74} y={770} width={520} height={290} fill={NAVY} opacity={0.82} />
              <text x={90} y={900} fontFamily={schrift.mono} fontSize={130} fill={WEISS}>{sek.toFixed(1).replace(".", ",")} s</text>
              <text x={96} y={940} fontFamily={schrift.mono} fontSize={22} fill={WEISS} opacity={0.75} letterSpacing={2}>LADEZEIT MOBIL</text>
              {/* Besucher: 10 Kästchen, nach 3 s springen viele ab */}
              {Array.from({ length: 10 }, (_, i) => {
                const bleibt = i % 4 === 0;
                const fall = bleibt ? 0 : tw(f, K.springen + 2 + ((i * 7) % 10) * 1.7, 16, 0, 1, (t) => t * t);
                return <rect key={i} x={96 + i * 46} y={980 + fall * 260} width={30} height={30} fill={bleibt ? WEISS : "none"} stroke={WEISS} strokeWidth={1.6} opacity={1 - fall} />;
              })}
              <text x={96} y={1046} fontFamily={schrift.mono} fontSize={20} fill={WEISS} opacity={0.75 * tw(f, K.google, 6, 0, 1)} letterSpacing={2}>QUELLE: GOOGLE</text>
            </g>
          );
        })()}
        <Callout f={f} ab={K.s7 + 14} bis={K.s8 - 2} von={pt(3, 644, 310)} x={930} y={1540 - 30} zeilen={["MOBILE ZUERST"]} aktiv />

        {/* Satz 8 – lokal + Datenschutz */}
        <Callout f={f} ab={K.lokal + 6} bis={K.s9 - 2} von={pt(3, 617, 434)} x={140} y={800} zeilen={["LOKAL GEFUNDEN", "OLTEN · 47.35° N 7.90° E", "GOOGLE-PROFIL ★★★★★"]} aktiv={f < K.datenschutz} />
        <Callout f={f} ab={K.datenschutz} bis={K.s9 - 2} von={pt(3, 200, 508)} x={930} y={1540 - 30} zeilen={["IMPRESSUM + DATENSCHUTZ", "NACH revDSG"]} aktiv />

        {/* Satz 9 – Anfragen */}
        {f >= K.bringen && f < K.s10 + 4 && (() => {
          const von = pt(2, 130, 252);
          const op = tw(f, K.s10 - 2, 5, 1, 0, kurve.raus);
          const verz = [10, 17, 27];
          return (
            <g opacity={op}>
              {verz.map((v, i) => {
                const p = tw(f, K.bringen + v, 10, 0, 1, kurve.heavy);
                const y = 820 + i * 56;
                return (
                  <g key={i} opacity={p}>
                    <polyline points={`${von.x},${von.y} ${mix(von.x, 780, p)},${mix(von.y, y, p)} ${930 * p + 780 * (1 - p)},${y}`} fill="none" stroke={i === 0 ? LILA : WEISS} strokeWidth={1.4} opacity={0.7} />
                    <text x={930} y={y - 10} textAnchor="end" fontFamily={schrift.mono} fontSize={24} fill={WEISS} letterSpacing={2}>ANFRAGE 0{i + 1} ✓</text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* ================= Ziffern (Outline) ================= */}
        <Ziffer f={f} text="01" an={K.s3} aus={K.s4 - 6} x={24} anker="start" />
        <Ziffer f={f} text="02" an={K.s4} aus={K.s5 - 6} x={1048} anker="end" />
        <Ziffer f={f} text="03" an={K.s5} aus={K.s6 - 6} x={24} anker="start" />
        {!dunkel && <Ziffer f={f} text="04" an={K.vier + 2} aus={K.s9 - 6} x={1048} anker="end" />}
      </svg>

      {/* ================= Headlines (weiss, ≥ 64 px, links/rechts) ================= */}
      <Headline f={f} bis={K.s2 - 3} x={70} w={850} y={260} size={92} teile={[{ ab: 0, inhalt: <>Jede gute Website hat vier Schichten.</> }]} />
      <Headline f={f} bis={K.s3 - 3} x={150} w={790} y={260} size={92} rechts teile={[{ ab: K.s2, inhalt: <>Die wichtigste siehst du <Serif>nie.</Serif></> }]} />
      <Headline f={f} bis={K.s4 - 3} x={600} w={340} y={262} size={66} teile={[
        { ab: K.s3, inhalt: <>Eins: die Marke.</> },
        { ab: K.farben, inhalt: <>Zwei Farben, …</> },
        { ab: K.schriften, inhalt: <>Zwei Farben, zwei Schriften, …</> },
        { ab: K.echte, inhalt: <>Zwei Farben, zwei Schriften, echte Bilder.</> },
      ]} />
      <Headline f={f} bis={K.s5 - 3} x={70} w={400} y={262} size={66} teile={[
        { ab: K.s4, inhalt: <>Zwei: Struktur.</> },
        { ab: K.fuenf - 5, inhalt: <>In fünf Sekunden klar: was, wo, für wen.</> },
      ]} />
      <Headline f={f} bis={K.s6 - 3} x={600} w={340} y={262} size={66} teile={[
        { ab: K.s5, inhalt: <>Drei: ein Haupt-Button.</> },
        { ab: K.nummer, inhalt: <>Und die Nummer anklickbar.</> },
      ]} />
      {!dunkel && <Headline f={f} bis={K.s7 - 3} x={70} w={400} y={262} size={72} teile={[{ ab: K.s6, inhalt: <>Und vier …</> }, { ab: K.sieht, inhalt: <>Und vier … sieht keiner.</> }]} />}
      <Headline f={f} bis={K.s8 - 3} x={70} w={400} y={262} size={64} teile={[{ ab: K.s7, inhalt: <>Lädt sie auf dem Handy über drei Sekunden, springen laut Google viele ab.</> }]} />
      <Headline f={f} bis={K.s9 - 3} x={70} w={400} y={262} size={66} teile={[
        { ab: K.s8, inhalt: <>Dazu: lokal gefunden werden.</> },
        { ab: K.datenschutz, inhalt: <>Datenschutz sauber.</> },
      ]} />
      <Headline f={f} bis={K.s10 - 3} x={70} w={860} y={262} size={88} teile={[
        { ab: K.s9, inhalt: <>Erst alle vier <Serif>zusammen</Serif> …</> },
        { ab: K.bringen, inhalt: <>… bringen Anfragen.</> },
      ]} />

      <EndBlock f={f} />

      {/* ================= Ton ================= */}
      <Audio src={A("stimme/stimme-gesamt.wav")} />
      {mitMusik && <Audio src={A(mitMusik)} volume={0.25} />}
      <BlueprintTon />
    </AbsoluteFill>
  );
};

// ---------- Endkarte im selben Raum (kein Weltwechsel) ----------
const EndBlock: React.FC<{ f: number }> = ({ f }) => {
  const s = K.s10;
  if (f < s - 2) return null;
  const marke = tw(f, s, 10, 0, 1, kurve.fade);
  const claimPos = tw(f, s + 4, 14, 1, 0, kurve.land);
  const claimOp = tw(f, s + 4, 8, 0, 1, kurve.fade);
  const unter = tw(f, s + 16, 12, 0, 1, kurve.heavy);
  const btn = f >= s + 14 ? tw(f, s + 14, 12, 0.86, 1, kurve.land) : 0;
  const k = f - (K.analyse + 2);
  const druck = k >= -3 && k < 0 ? tw(k, -3, 3, 1, 0.96, kurve.whip) : k >= 0 && k < 8 ? tw(k, 0, 8, 0.96, 1, kurve.land) : 1;
  const ig = tw(f, s + 26, 10, 0, 1, kurve.land);
  // Cursor (weisse Kontur), Bogen zum Button, Klick auf «Analyse»
  const cp = tw(f, s + 24, K.analyse + 2 - (s + 24), 0, 1, kurve.heavy);
  const cx = mix(930, 640, cp) - Math.sin(cp * Math.PI) * 60;
  const cy = mix(1500, 990, cp);
  const ripple = k >= 0 && k < 16 ? { r: tw(k, 0, 16, 10, 80, kurve.land), o: tw(k, 0, 16, 0.8, 0, kurve.fade) } : null;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 250, fontFamily: schrift.mono, fontSize: 26, letterSpacing: "0.16em", color: WEISS, opacity: 0.7 * marke }}>WO HAKT'S BEI DIR?</div>
      <div style={{ position: "absolute", right: 140, top: 244, fontFamily: schrift.text, fontWeight: 800, fontSize: 40, color: WEISS, opacity: marke }}>Solleva</div>
      <div style={{ position: "absolute", left: 70, width: 870, top: 330, fontFamily: schrift.text, fontWeight: 800, fontSize: 108, lineHeight: 1.0, letterSpacing: "-0.02em", color: WEISS, opacity: claimOp, transform: `translateY(${claimPos * 30}px)` }}>
        Heb dich von der{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          Masse
          <span style={{ position: "absolute", left: 0, bottom: 4, height: 8, width: `${unter * 100}%`, background: LILA_F }} />
        </span>{" "}
        ab.
      </div>
      <div style={{ position: "absolute", left: 70, width: 870, top: 900, height: 160, borderRadius: 80, background: LILA_F, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schrift.text, fontWeight: 800, fontSize: 64, color: WEISS, transform: `scale(${btn * druck})` }}>
        Schreib «Analyse»
      </div>
      <div style={{ position: "absolute", left: 70, width: 870, top: 1100, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: schrift.mono, fontSize: 30, color: WEISS, letterSpacing: "0.06em", opacity: ig, transform: `translateY(${(1 - ig) * 16}px)` }}>
        <span>@solleva.ch · solleva.ch</span>
        <span style={{ border: `1.6px solid ${WEISS}`, borderRadius: 30, padding: "10px 26px", fontSize: 26 }}>FOLGEN</span>
      </div>
      {ripple && <div style={{ position: "absolute", left: 640 - ripple.r, top: 990 - ripple.r, width: ripple.r * 2, height: ripple.r * 2, borderRadius: "50%", border: `3px solid ${WEISS}`, opacity: ripple.o }} />}
      {f >= s + 24 && (
        <svg width={64} height={64} viewBox="0 0 32 32" style={{ position: "absolute", left: cx - 6, top: cy - 4, transform: `scale(${k >= -3 && k < 6 ? 0.88 : 1})`, transformOrigin: "6px 4px" }}>
          <path d="M6 4 L6 25 L11.5 20 L15 28 L18.6 26.4 L15.2 18.6 L22.5 18.6 Z" fill={NAVY} stroke={WEISS} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ---------- Ton (3 Spuren; Swish 1–3 Frames vor der Bewegung, Klick exakt) ----------
const BlueprintTon: React.FC = () => (
  <>
    {/* Klicks / Pops / Zeichnen */}
    <Ton nr="klick-02" bei={K.vier1 + 12} vol={0.25} />
    <Ton nr="klick-02" bei={K.vier1 + 16} vol={0.22} />
    <Ton nr="klick-02" bei={K.vier1 + 23} vol={0.22} />
    <Ton nr="klick-02" bei={K.vier1 + 27} vol={0.22} />
    <Ton nr="glitch-03" bei={K.nie} vol={0.2} />
    <Ton nr="schreiben-02" bei={K.s3 + 12} vol={0.25} max={0.8} />
    <Ton nr="klick-02" bei={K.marke + 4} vol={0.3} />
    <Ton nr="ratsche-16" bei={K.farben + 2} vol={0.25} max={0.8} />
    <Ton nr="klick-04" bei={K.schriften} vol={0.3} />
    <Ton nr="klick-04" bei={K.schriften + 6} vol={0.3} />
    <Ton nr="klick-05" bei={K.echte + 4} vol={0.35} />
    <Ton nr="schreiben-01" bei={K.echte + 16} vol={0.3} />
    <Ton nr="schreiben-02" bei={K.s4 + 12} vol={0.25} max={0.8} />
    <Ton nr="ratsche-16" bei={K.fuenf} vol={0.28} max={1.3} />
    <Ton nr="schreiben-01" bei={K.was} vol={0.28} />
    <Ton nr="schreiben-01" bei={K.wo} vol={0.28} />
    <Ton nr="schreiben-01" bei={K.fuerwen} vol={0.28} />
    <Ton nr="schreiben-02" bei={K.s5 + 12} vol={0.25} max={0.8} />
    <Ton nr="klick-03" bei={K.button + 10} vol={0.45} />
    <Ton nr="klick-03" bei={K.anklickbar + 4} vol={0.45} />
    <Ton nr="klick-02" bei={K.anklickbar + 10} vol={0.25} />
    <Ton nr="glitch-03" bei={K.vier + 3} vol={0.22} />
    <Ton nr="ratsche-19" bei={K.s7 + 4} vol={0.22} max={1.6} />
    <Ton nr="klick-02" bei={K.google} vol={0.25} />
    <Ton nr="klick-02" bei={K.lokal + 6} vol={0.3} />
    <Ton nr="klick-02" bei={K.datenschutz} vol={0.3} />
    <Ton nr="klick-02" bei={K.sauber} vol={0.45} />
    <Ton nr="klick-04" bei={K.bringen + 10} vol={0.3} />
    <Ton nr="klick-04" bei={K.bringen + 17} vol={0.28} />
    <Ton nr="klick-04" bei={K.bringen + 27} vol={0.26} />
    <Ton nr="klick-03" bei={K.analyse + 2} vol={0.45} />
    {/* Whooshes: Kamerafahrten (2 Frames vor Start) */}
    <Ton nr="whoosh-03" bei={K.vier1} vor={2} vol={0.3} />
    <Ton nr="whoosh-01" bei={K.s3 - 2} vor={2} vol={0.3} max={1.4} />
    <Ton nr="whoosh-01" bei={K.s4 - 2} vor={2} vol={0.3} max={1.4} />
    <Ton nr="whoosh-01" bei={K.s5 - 2} vor={2} vol={0.3} max={1.4} />
    <Ton nr="whoosh-03" bei={K.s9} vor={2} vol={0.35} />
    <Ton nr="swish-03" bei={K.s10} vor={2} vol={0.3} />
    {/* Impacts */}
    <Ton nr="schlag-01" bei={K.vier1 + 4} vol={0.35} />
    <Ton nr="schlag-02" bei={K.vier} vol={0.85} max={2.5} />
    <Ton nr="schlag-01" bei={K.keiner} vol={0.4} />
    <Ton nr="ratsche-12" bei={K.zusammen + 15} vol={0.45} />
    <Ton nr="schlag-03" bei={K.zusammen + 15} vol={0.5} />
    <Ton nr="schlag-05" bei={K.s10 + 14} vol={0.3} max={2} />
  </>
);
