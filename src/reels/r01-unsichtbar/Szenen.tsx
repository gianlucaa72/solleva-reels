// Reel 01 «Unsichtbar»: alle Szenen in absoluten Reel-Frames (Timing aus timeline.json).
// Jede Szene kennt zwei Auslegungen: A = Hook-Titel gross im Raum (nah an den Referenzen),
// B = Captions oben + Bild kompakter darunter. Hintergründe kommen aus Reel.tsx (global).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { farben, schrift } from "../../brand/solleva";
import { Kamera, Ton } from "../../lib/kamera";
import { kurve, overshoot, tw } from "../../lib/bewegung";
import { cursorPosition } from "../../components/Cursor";
import { Band, Ergebnis, Gesperrt, Gross, Kursiv, MeshHell, Telefon } from "./Teile";
import timeline from "./timeline.json";

export type V = "A" | "B";
type Satz = { satz: number; text: string; schluessel: string; datei: string; von: number; bis: number; start: number; dauer: number; woerter: [string, number][] };
export const T = timeline as { fps: number; gesamt: number; saetze: Satz[] };
export const satz = (n: number) => T.saetze[n - 1];
export const w = (n: number, wort: string) => {
  const e = satz(n).woerter.find(([x]) => x === wort);
  if (!e) throw new Error(`Wort ${wort} in Satz ${n} fehlt`);
  return e[1];
};
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

// ---------- Stimme ----------
export const Stimme: React.FC = () => (
  <>
    {T.saetze.map((s) => (
      <Sequence key={s.satz} from={s.start} durationInFrames={s.dauer + 6} layout="none">
        <Audio src={staticFile(s.datei)} startFrom={Math.round(s.von * 30)} volume={1} />
      </Sequence>
    ))}
  </>
);

// ---------- X21 Apple-Wort: aus Unschärfe, 6 Frames ----------
export const Wort: React.FC<{ bei: number; weg?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ bei, weg, children, style }) => {
  const F = useCurrentFrame();
  const rein = tw(F, bei - 1, 6, 0, 1, kurve.land);
  const raus = weg ? tw(F, weg, 4, 0, 1, kurve.raus) : 0;
  return (
    <span
      style={{
        display: "inline-block",
        opacity: rein * (1 - raus),
        filter: `blur(${(1 - rein) * 10 + raus * 8}px)`,
        transform: `translateY(${(1 - rein) * 14 - raus * 10}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Slam: gross → 1 mit Overshoot, Opacity in 3 Frames, Unschärfe weg. */
const slam = (F: number, bei: number, von = 1.3, dauer = 8) => {
  const o = tw(F, bei, 3, 0, 1, kurve.fade);
  const p = overshoot(F, bei, dauer, 1.04);
  return { opacity: o, transform: `scale(${von - (von - 1) * p})`, filter: `blur(${(1 - o) * 12}px)` } as React.CSSProperties;
};
/** Aus der Unschärfe (Text kommt nach vorne). */
const ausUnschaerfe = (F: number, bei: number, dauer = 7) => {
  const p = tw(F, bei - 1, dauer, 0, 1, kurve.land);
  return { opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${1.12 - 0.12 * p})`, filter: `blur(${(1 - p) * 16}px)` } as React.CSSProperties;
};

/** Titel nur in Version A; Bild in B kompakter und tiefer (Platz für Captions). */
const Titel: React.FC<{ v: V; children: React.ReactNode }> = ({ v, children }) => (v === "A" ? <>{children}</> : null);
const Bild: React.FC<{ v: V; children: React.ReactNode }> = ({ v, children }) =>
  v === "A" ? <>{children}</> : <AbsoluteFill style={{ transform: "translateY(150px) scale(.8)", transformOrigin: "50% 100%" }}>{children}</AbsoluteFill>;

// ---------- Statue (freigestellt, unten weich ausgeblendet) ----------
const Statue: React.FC<{ src: string; x: number; y: number; h: number; style?: React.CSSProperties; spiegeln?: boolean }> = ({ src, x, y, h, style, spiegeln }) => (
  <Img
    src={staticFile(`r01/a/${src}`)}
    style={{
      position: "absolute",
      left: x,
      top: y,
      height: h,
      WebkitMaskImage: "linear-gradient(180deg, black 72%, transparent 97%)",
      filter: "drop-shadow(0 30px 40px rgba(44,30,120,.18))",
      transform: spiegeln ? "scaleX(-1)" : undefined,
      ...style,
    }}
  />
);

// ---------- Funken (Mikro-Detail) ----------
const Funken: React.FC<{ bei: number; cx: number; cy: number; n?: number; farbe?: string; r0?: number; weite?: number }> = ({ bei, cx, cy, n = 6, farbe = farben.lavendelAkzent, r0 = 20, weite = 140 }) => {
  const F = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const p = tw(F, bei + (i % 3), 16, 0, 1, kurve.land);
        const a = (i / n) * Math.PI * 2 + 0.4;
        const r = r0 + p * (weite + (i % 2) * 50);
        const o = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
        const g = 8 + (i % 3) * 3;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: cx + Math.cos(a) * r - g / 2, top: cy + Math.sin(a) * r - g / 2, width: g, height: g, borderRadius: g, background: i % 2 ? farben.lavendelAkzent : "#fff", boxShadow: `0 0 16px ${farbe}`, opacity: o }}
          />
        );
      })}
    </>
  );
};

const Lupe: React.FC<{ farbe?: string }> = ({ farbe = farben.grau }) => (
  <svg width="48" height="48" viewBox="0 0 24 24">
    <circle cx="10" cy="10" r="7" stroke={farbe} strokeWidth="2.5" fill="none" />
    <path d="M15 15 L21 21" stroke={farbe} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// =====================================================================
// Satz 1: «Deine Kunden suchen dich. Jeden Tag.»  Hook + Suchleiste im Stakkato
// =====================================================================
const BRANCHEN = ["Coiffeur", "Elektriker", "Physio", "Garage", "Schreiner", "Malerei", "Treuhand", "Gärtner", "Bäckerei", "Sanitär"];
export const Szene1: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const raus = tw(F, satz(2).start - 2, 7, 0, 1, kurve.whip); // Whip nach links (Telefon kommt von rechts)
  const pilleRein = tw(F, 2, 10, 0, 1, kurve.land);
  const takt = 7;
  const START = 8;
  const i = Math.max(0, Math.floor((F - START) / takt)) % BRANCHEN.length;
  const wechsel = START + Math.max(0, Math.floor((F - START) / takt)) * takt;
  const wp = tw(F, wechsel, 3, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ transform: `translateX(${-raus * 1150}px)`, filter: `blur(${Math.sin(raus * Math.PI) * 14}px)` }}>
      <Kamera dauer={90} seed={1} rucke={[w(1, "suchen")]}>
        <Titel v={v}>
          <div style={abs(80, 395, { ...slam(F, -2, 1.5, 9), transformOrigin: "0 50%" })}>
            <Band dreh={-5} size={70}>Deine Kunden</Band>
          </div>
          <Gross size={300} style={abs(70, 500, ausUnschaerfe(F, w(1, "suchen")))}>
            Suchen
          </Gross>
          <Kursiv size={230} style={abs(470, 720, { ...slam(F, w(1, "dich"), 0.6, 9), transformOrigin: "30% 70%" })}>
            dich.
          </Kursiv>
          <Gesperrt style={abs(90, 990)}>
            <Wort bei={w(1, "Jeden")}>Jeden</Wort> <Wort bei={w(1, "Jeden") + 4}>·</Wort> <Wort bei={w(1, "Tag")}>Tag</Wort>
          </Gesperrt>
        </Titel>
        <Bild v={v}>
          <div
            style={abs(90, 1180, {
              width: 900,
              height: 150,
              borderRadius: 75,
              opacity: pilleRein,
              transform: `translateY(${(1 - pilleRein) * 80}px)`,
              background: "linear-gradient(160deg, rgba(255,255,255,.95), rgba(236,230,255,.75))",
              border: "1.5px solid rgba(255,255,255,.95)",
              boxShadow: "inset 0 2px 0 #fff, inset 0 -10px 30px rgba(169,139,255,.18), 0 30px 70px rgba(44,30,120,.16)",
              display: "flex",
              alignItems: "center",
              gap: 24,
              paddingLeft: 50,
              boxSizing: "border-box",
              fontFamily: schrift.text,
              fontWeight: 700,
              fontSize: 46,
              color: farben.tinte,
              whiteSpace: "nowrap",
            })}
          >
            <Lupe />
            <span style={{ display: "inline-block", minWidth: 0, opacity: F >= START ? wp : 0, transform: `translateY(${(1 - wp) * 18}px)`, filter: `blur(${(1 - wp) * 6}px)`, color: farben.violett }}>
              {BRANCHEN[i]}
            </span>
            <span style={{ opacity: F >= START ? 1 : 0 }}>in der Nähe</span>
            <span style={{ width: 4, height: 56, background: farben.violett, opacity: Math.floor(F / 8) % 2 ? 1 : 0.15 }} />
          </div>
        </Bild>
      </Kamera>
      <Ton nr="schlag-07" bei={0} vol={0.5} />
      <Ton nr="swish-02" bei={w(1, "suchen")} vor={2} vol={0.35} />
      <Ton nr="pop-01" bei={w(1, "dich")} vol={0.35} />
      <Ton nr="swish-06" bei={4} vor={2} vol={0.2} />
      {Array.from({ length: 10 }).map((_, k) => (
        <Ton key={k} nr="klick-04" bei={START + k * takt} vol={0.22} />
      ))}
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 2: «Und finden: deine Konkurrenz.»  Telefon fliegt rein (Apple-Ref), Büste mit Lupe
// =====================================================================
export const Szene2: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(2);
  const ende = satz(3).start;
  // Telefon: guckt rechts rein (66–78), wartet, Whip ins Bild (80–87)
  const peek = tw(F, s.start - 17, 12, 0, 1, kurve.land);
  const whip = tw(F, s.start - 1, 7, 0, 1, kurve.whip);
  const tx = 1180 - peek * 150 - whip * (1030 - 470);
  const trot = 14 - whip * 10;
  const tBlur = Math.sin(whip * Math.PI) * 10;
  // Liste scrollt
  const scroll = tw(F, s.start + 11, 40, 0, -300, kurve.heavy);
  // Tauchgang in den Bildschirm (Übergang zu Satz 3)
  const tauch = tw(F, ende - 9, 9, 0, 1, kurve.whip);
  const tauchS = 1 + tauch * 6;
  const statue = tw(F, s.start + 13, 14, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ transform: `scale(${tauchS})`, transformOrigin: "720px 1290px" }}>
      <Kamera dauer={90} seed={2} rucke={[w(2, "Konkurrenz")]}>
        <Titel v={v}>
          <Gesperrt size={40} style={abs(90, 330)}>
            <Wort bei={w(2, "Und")}>Und</Wort> <Wort bei={w(2, "finden")}>finden:</Wort>
          </Gesperrt>
          <Gross size={190} style={abs(80, 390, ausUnschaerfe(F, w(2, "deine")))}>
            deine
          </Gross>
          <div style={abs(60, 545, { ...slam(F, w(2, "Konkurrenz"), 1.45, 9), transformOrigin: "10% 50%" })}>
            <Band dreh={-3} size={150} bg={farben.tinte}>
              Konkurrenz
            </Band>
          </div>
        </Titel>
        <Bild v={v}>
          <div style={{ position: "absolute", inset: 0, filter: `blur(${tBlur}px)` }}>
            <Telefon x={tx} y={800} w={480} dreh={trot}>
              <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${scroll * 0.5}px) scale(.5)`, transformOrigin: "0 0", width: 900 }}>
                {["A", "B", "C", "D", "E", "F", "G"].map((b, k) => (
                  <Ergebnis key={b} y={170 + k * 180} titel={`Mitbewerber ${b}`} x={20} w={860} />
                ))}
              </div>
              <div style={{ position: "absolute", inset: 0, background: farben.nacht, opacity: tw(F, ende - 8, 6, 0, 1, kurve.fade) }} />
            </Telefon>
          </div>
          <Statue src="statue-lupe.webp" x={-60} y={1000 + (1 - statue) * 500} h={820} style={{ opacity: statue }} />
        </Bild>
      </Kamera>
      <AbsoluteFill style={{ background: farben.nacht, opacity: tw(F, ende - 4, 4, 0, 1, kurve.fade) }} />
      <Ton nr="swish-05" bei={s.start - 1} vor={2} vol={0.45} />
      <Ton nr="klick-02" bei={s.start + 6} vol={0.25} />
      <Ton nr="papier-01" bei={s.start + 15} vol={0.25} />
      <Ton nr="schlag-01" bei={w(2, "Konkurrenz")} vol={0.5} />
      <Ton nr="whoosh-03" bei={ende} vor={1} vol={0.45} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 3: «Du? Irgendwo auf Seite zwei.»  Nacht, Seitenleiste rastet auf 2
// =====================================================================
export const Szene3: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(3);
  const zwei = w(3, "zwei");
  const raus = tw(F, satz(4).start - 6, 6, 0, 1, kurve.whip);
  const pille = tw(F, s.start + 12, 10, 0, 1, kurve.land);
  const aktiv = tw(F, zwei - 2, 7, 0, 1, kurve.heavy); // 1 → 2
  const zweiP = F >= zwei ? overshoot(F, zwei, 10, 1.06) : 0;
  const slots = ["‹", "1", "2", "3", "›"];
  return (
    <AbsoluteFill style={{ transform: `translateY(${-raus * 700}px)`, filter: `blur(${raus * 16}px)`, opacity: 1 - raus * 0.6 }}>
      <Kamera dauer={80} seed={3} rucke={[zwei]}>
        <Titel v={v}>
          <Kursiv size={170} farbe={farben.papier} style={abs(90, 360, ausUnschaerfe(F, w(3, "Du") + 2, 8))}>
            Du?
          </Kursiv>
          <Gesperrt farbe="#8C90C8" style={abs(95, 570)}>
            <Wort bei={w(3, "Irgendwo")}>Irgendwo</Wort> <Wort bei={w(3, "auf")}>auf</Wort>
          </Gesperrt>
          <Gross size={260} farbe={farben.papier} style={abs(80, 630, { ...slam(F, w(3, "Seite"), 1.3), transformOrigin: "0 60%" })}>
            Seite
          </Gross>
        </Titel>
        <Bild v={v}>
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const y = 1900 + k * 260 - (F - s.start + 4) * 14;
            return (
              <div key={k} style={{ position: "absolute", left: 0, top: 0, opacity: 0.13, filter: "blur(5px)", transform: `translateY(${y}px) rotate(${k % 2 ? 2 : -2}deg)` }}>
                <Ergebnis y={0} x={k % 2 ? 300 : 120} w={620} titel={`Mitbewerber ${"HIJKLM"[k]}`} />
              </div>
            );
          })}
          <div
            style={abs(560, 520, {
              fontFamily: schrift.titel,
              fontWeight: 900,
              fontSize: 620,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `6px ${farben.lavendelAkzent}`,
              textShadow: `0 0 ${40 * zweiP}px rgba(169,139,255,.7)`,
              opacity: Math.min(1, zweiP * 1.5),
              transform: `scale(${0.6 + 0.4 * zweiP}) rotate(${(1 - zweiP) * -12}deg)`,
              transformOrigin: "50% 60%",
            })}
          >
            2
          </div>
          <div
            style={abs(160, 1260, {
              width: 760,
              height: 140,
              borderRadius: 70,
              opacity: pille,
              transform: `translateY(${(1 - pille) * 80}px)`,
              background: "linear-gradient(160deg, rgba(255,255,255,.28), rgba(255,255,255,.08))",
              border: "1.5px solid rgba(255,255,255,.35)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,.35), 0 30px 80px rgba(0,0,0,.5)",
            })}
          >
            {/* Schieber */}
            <div style={{ position: "absolute", top: 30, left: 228 + 152 * aktiv - 50, width: 100, height: 80, borderRadius: 40, background: farben.violett, boxShadow: `0 0 30px rgba(108,63,212,.8)` }} />
            {slots.map((t, k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 76 + 152 * k - 50,
                  width: 100,
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: schrift.text,
                  fontWeight: 800,
                  fontSize: 52,
                  color: farben.papier,
                  opacity: (k === 1 && aktiv < 0.5) || (k === 2 && aktiv >= 0.5) ? 1 : 0.5,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </Bild>
      </Kamera>
      <Ton nr="pop-02" bei={w(3, "Du") + 3} vol={0.35} />
      <Ton nr="swish-06" bei={s.start + 12} vor={2} vol={0.2} />
      <Ton nr="schlag-01" bei={w(3, "Seite")} vol={0.35} />
      <Ton nr="klick-01" bei={zwei} vol={0.4} />
      <Ton nr="glitch-03" bei={zwei + 2} vol={0.18} />
      <Ton nr="swish-01" bei={satz(4).start - 3} vor={1} vol={0.35} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 4: «Da klickt niemand.»  Humor: Spinnennetz auf dem Anfrage-Button, Cursor dreht ab
// =====================================================================
/** S01 Spinnennetz aus einer Ecke: Speichen + durchhängende Fäden, zeichnet sich mit p (0..1). */
const Netz: React.FC<{ cx: number; cy: number; von: number; bis: number; r: number; p: number }> = ({ cx, cy, von, bis, r, p }) => {
  const n = 6;
  const winkel = Array.from({ length: n }, (_, i) => ((von + ((bis - von) * i) / (n - 1)) * Math.PI) / 180);
  const pt = (a: number, rr: number) => [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  const ringe = [0.25, 0.45, 0.65, 0.85];
  const strich = { stroke: "rgba(110,108,146,.8)", strokeWidth: 2.2, fill: "none", pathLength: 1, strokeDasharray: 1 } as const;
  return (
    <g>
      {winkel.map((a, i) => {
        const [x, y] = pt(a, r);
        return <path key={`s${i}`} d={`M ${cx} ${cy} L ${x} ${y}`} {...strich} strokeDashoffset={1 - Math.min(1, p * 1.6)} />;
      })}
      {ringe.map((q, j) => {
        let d = "";
        for (let i = 0; i < n; i++) {
          const [x, y] = pt(winkel[i], r * q);
          if (i === 0) d += `M ${x} ${y}`;
          else {
            const [px, py] = pt(winkel[i - 1], r * q);
            const [mx, my] = pt((winkel[i] + winkel[i - 1]) / 2, r * q * 0.86);
            d += ` Q ${mx + (mx - (px + x) / 2) * 0.1} ${my} ${x} ${y}`;
          }
        }
        const pj = Math.max(0, Math.min(1, (p - 0.3 - j * 0.12) / 0.35));
        return <path key={`r${j}`} d={d} {...strich} strokeDashoffset={1 - pj} />;
      })}
    </g>
  );
};

export const Szene4: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(4);
  const rein = tw(F, s.start - 1, 7, 0, 1, kurve.land);
  const nm = w(4, "niemand");
  // Karte und Button (Button-Mitte ≈ 540/1440)
  const KX = 170, KY = 830, KW = 740, KH = 700;
  const pfad = [
    { f: s.start + 2, x: 1060, y: 1780 },
    { f: nm + 2, x: 600, y: 1450 },
    { f: nm + 8, x: 622, y: 1462 },
    { f: nm + 20, x: 1010, y: 900 },
    { f: nm + 30, x: 1200, y: 640 },
  ];
  const c = cursorPosition(F, pfad);
  const dreh = tw(F, nm + 8, 6, 0, 35, kurve.land);
  const zoegern = F > nm + 2 && F < nm + 8 ? Math.sin((F - nm) * 2.2) * 4 : 0;
  const notiz = tw(F, nm + 12, 10, 0, 1, kurve.linear);
  const karte = tw(F, s.start - 2, 10, 0, 1, kurve.land);
  const netz = tw(F, s.start + 1, 16, 0, 1, kurve.heavy);
  const lockt = tw(F, s.start + 4, 8, 0, 1) * (1 - tw(F, nm + 8, 6, 0, 1));
  const spinne = tw(F, nm + 14, 14, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - rein) * 500}px)`, filter: `blur(${(1 - rein) * 14}px)` }}>
      <Kamera dauer={50} seed={4} rucke={[nm]}>
        <Titel v={v}>
          <Gesperrt farbe="#8C90C8" style={abs(95, 380)}>
            <Wort bei={w(4, "Da")}>Da</Wort> <Wort bei={w(4, "klickt")}>klickt</Wort>
          </Gesperrt>
          <Gross size={250} farbe={farben.papier} style={abs(70, 440, { ...slam(F, nm, 1.35), transformOrigin: "0 60%" })}>
            Niemand
          </Gross>
        </Titel>
        <Bild v={v}>
          {/* Website-Karte mit Anfrage-Button, über den sich ein Spinnennetz zieht */}
          <div style={abs(KX, KY + (1 - karte) * 260, { width: KW, height: KH, borderRadius: 40, background: farben.papier, opacity: karte, transform: "rotate(-2deg)", boxShadow: "0 40px 90px rgba(0,0,0,.55), 0 0 80px rgba(108,63,212,.25)", overflow: "hidden" })}>
            <div style={abs(50, 46, { display: "flex", alignItems: "center", gap: 16 })}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: farben.lavendel }} />
              <span style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 32, color: farben.tinte }}>Deine Firma</span>
            </div>
            <div style={abs(50, 130, { width: 520, height: 34, borderRadius: 17, background: farben.grauHell })} />
            <div style={abs(50, 186, { width: 400, height: 34, borderRadius: 17, background: farben.grauHell })} />
            <div style={abs(50, 260, { width: KW - 100, height: 230, borderRadius: 28, background: `linear-gradient(135deg, ${farben.lavendel}, #D9CFFB)` })} />
            <div
              style={abs(50, 540, {
                width: KW - 100,
                height: 104,
                borderRadius: 52,
                background: farben.violett,
                filter: `grayscale(${tw(F, nm + 10, 10, 0, 0.75)}) brightness(${1 + 0.25 * lockt})`,
                boxShadow: `0 0 ${50 * lockt}px rgba(169,139,255,.9)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: schrift.text,
                fontWeight: 800,
                fontSize: 42,
                color: "#fff",
              })}
            >
              Anfrage senden
            </div>
            {/* Spinnennetze (zeichnen sich) */}
            <svg width={KW} height={KH} style={{ position: "absolute", inset: 0 }}>
              <Netz cx={KW} cy={KH} von={180} bis={270} r={360} p={netz} />
              <Netz cx={0} cy={0} von={0} bis={90} r={210} p={netz} />
            </svg>
            {/* Spinne seilt sich ab, nachdem der Cursor weg ist */}
            <div style={abs(KW - 150, 0, { width: 2, height: 120 + spinne * 260, background: "rgba(20,18,58,.6)" })} />
            <svg width="76" height="76" viewBox="-11 -11 22 22" style={abs(KW - 187, 84 + spinne * 260, { opacity: tw(F, nm + 14, 3, 0, 1), transform: `rotate(${Math.sin(F / 4) * 8}deg)` })}>
              {[-1, 1].flatMap((sgn) => [-6, -2, 2, 6].map((dy) => <path key={`${sgn}${dy}`} d={`M 0 ${dy * 0.4} Q ${sgn * 6} ${dy - 3} ${sgn * 10} ${dy + 2}`} stroke={farben.tinte} strokeWidth={1.3} fill="none" />))}
              <circle r={4} fill={farben.tinte} />
              <circle cy={-4} r={2.6} fill={farben.tinte} />
            </svg>
          </div>
          {/* Staub schwebt */}
          {Array.from({ length: 12 }).map((_, k) => (
            <div key={k} style={abs(150 + ((k * 137) % 760), 860 + ((k * 211) % 700) - ((F * (0.4 + (k % 3) * 0.2)) % 120), { width: 4 + (k % 3), height: 4 + (k % 3), borderRadius: 4, background: "rgba(213,209,233,.45)" })} />
          ))}
          <svg width="76" height="98" viewBox="0 0 28 36" style={abs(c.x - 8 + zoegern, c.y - 6, { transform: `rotate(${dreh}deg)`, transformOrigin: "8px 6px", opacity: tw(F, s.start + 2, 4, 0, 1) })}>
            <path d="M2 2 L2 28 L9 21 L14 33 L19 31 L14 19 L24 19 Z" fill={farben.papier} stroke={farben.tinte} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <div style={abs(470, 735, { fontFamily: schrift.notiz, fontWeight: 600, fontSize: 64, color: farben.cyan, transform: "rotate(-8deg)", clipPath: `inset(0 ${(1 - notiz) * 100}% 0 0)` })}>…und tschüss</div>
        </Bild>
      </Kamera>
      <Ton nr="papier-01" bei={s.start} vol={0.25} />
      <Ton nr="ratsche-13" bei={s.start + 2} vol={0.12} max={0.5} />
      <Ton nr="schlag-01" bei={nm} vol={0.4} />
      <Ton nr="swish-03" bei={nm + 10} vor={2} vol={0.35} />
      <Ton nr="pop-05" bei={nm + 26} vol={0.18} />
      <Ton nr="schreiben-01" bei={nm + 12} vol={0.3} />
      <Ton nr="glitzer-05" bei={satz(5).start} vor={2} vol={0.15} max={2} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 5: «Dabei machst du gute Arbeit.»  Statue mit Meissel am Meisterstück
// =====================================================================
export const Szene5: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(5);
  const gute = w(5, "gute");
  const arbeit = w(5, "Arbeit");
  const statue = tw(F, s.start + 2, 14, 0, 1, kurve.land);
  // Meissel-Schläge: kleine Stösse auf den Schlüsselwörtern
  const stoss = (b: number) => (F >= b && F < b + 6 ? Math.sin(((F - b) / 6) * Math.PI) * 6 : 0);
  const sx = 170, sy = 760, sh = 860;
  const spitze = { x: sx + sh * 0.75 * 0.62, y: sy + sh * 0.375 };
  return (
    <AbsoluteFill>
      <Kamera dauer={70} seed={5} rucke={[gute, arbeit]}>
        <Titel v={v}>
          <Gesperrt style={abs(90, 330)}>
            <Wort bei={w(5, "Dabei")}>Dabei</Wort> <Wort bei={w(5, "machst")}>machst</Wort> <Wort bei={w(5, "du")}>du</Wort>
          </Gesperrt>
          <Kursiv size={260} style={abs(90, 360, { ...slam(F, gute, 0.7, 9), transformOrigin: "20% 70%" })}>
            gute
          </Kursiv>
          <Gross size={220} style={abs(290, 560, { ...slam(F, arbeit, 1.3), transformOrigin: "30% 60%" })}>
            Arbeit.
          </Gross>
        </Titel>
        <Bild v={v}>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${stoss(gute) + stoss(arbeit)}px, ${stoss(gute) * 0.5}px)` }}>
            <Statue src="statue-meissel.webp" x={sx} y={sy + (1 - statue) * 500} h={sh} style={{ opacity: statue }} />
          </div>
          <Funken bei={gute} cx={spitze.x} cy={spitze.y} n={7} farbe="#fff" weite={90} />
          <Funken bei={arbeit} cx={spitze.x} cy={spitze.y} n={9} weite={130} />
        </Bild>
      </Kamera>
      <Ton nr="swish-02" bei={s.start + 4} vor={2} vol={0.25} />
      <Ton nr="schlag-07" bei={gute} vol={0.45} />
      <Ton nr="schlag-07" bei={arbeit} vol={0.4} />
      <Ton nr="schlag-01" bei={arbeit} vol={0.35} />
      <Ton nr="glitzer-05" bei={satz(6).start} vor={2} vol={0.15} max={2} />
    </AbsoluteFill>
  );
};

// ---------- Hintergrund-Foto Kieselfeld mit Licht-Schleier oben ----------
const KieselFeld: React.FC<{ scale: number; schleier?: number; spot?: number }> = ({ scale, schleier = 1, spot = 0 }) => (
  <AbsoluteFill>
    <Img src={staticFile("r01/a/kiesel-feld-a.jpg")} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "50% 60%" }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${farben.papier} 0%, rgba(246,245,252,.92) 22%, rgba(246,245,252,.35) 45%, rgba(236,230,255,0) 62%)`, opacity: schleier }} />
    <AbsoluteFill style={{ opacity: spot, background: "radial-gradient(560px 700px at 50% 60%, rgba(255,255,255,.0), rgba(236,230,255,.20) 55%, rgba(108,63,212,.16) 100%)" }} />
    <AbsoluteFill style={{ opacity: spot * 0.9, background: "linear-gradient(180deg, rgba(255,255,255,.0) 0%, rgba(255,255,255,.55) 40%, rgba(255,255,255,0) 75%)", clipPath: "polygon(38% 0, 62% 0, 74% 100%, 26% 100%)", filter: "blur(30px)" }} />
  </AbsoluteFill>
);

// =====================================================================
// Satz 6: «Nur sieht sie keiner.»  Karte versinkt in der Masse
// =====================================================================
export const Szene6: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(6);
  const k = w(6, "keiner");
  const ende = satz(7).start;
  const feldScale = tw(F, s.start - 6, 40, 1.14, 1.06, kurve.heavy) + tw(F, ende - 6, 10, 0, 0.05, kurve.whip);
  const sink = tw(F, k - 2, 16, 0, 1, kurve.raus);
  const landung = s.start + 5;
  const fall = tw(F, s.start - 2, 7, -520, 0, kurve.land);
  const kartY = 980 + fall + Math.sin(F / 9) * 6 + sink * 300;
  const raus = tw(F, ende - 4, 6, 0, 1, kurve.raus);
  return (
    <AbsoluteFill>
      <KieselFeld scale={feldScale} />
      <Kamera dauer={s.dauer + 10} seed={6} rucke={[k]}>
        <Titel v={v}>
          <div style={{ opacity: 1 - raus, transform: `translateY(${-raus * 120}px)`, filter: `blur(${raus * 10}px)` }}>
            <Gesperrt size={50} style={abs(90, 310)}>
              <Wort bei={w(6, "Nur")}>Nur</Wort> <Wort bei={w(6, "sieht")}>sieht</Wort> <Wort bei={w(6, "sie")}>sie</Wort>
            </Gesperrt>
            <Gross size={300} style={abs(70, 390, { ...slam(F, k, 1.3), transformOrigin: "20% 60%" })}>
              Keiner.
            </Gross>
          </div>
        </Titel>
        <Bild v={v}>
          <div
            style={abs(270, kartY, {
              opacity: tw(F, s.start - 2, 3, 0, 1, kurve.fade) * (1 - sink),
              transform: `scale(${1 - sink * 0.35}) rotate(${-4 - sink * 8}deg)`,
              filter: `blur(${sink * 8}px)`,
            })}
          >
            <Ergebnis y={0} x={0} w={540} titel="Deine Firma" />
          </div>
        </Bild>
      </Kamera>
      <Ton nr="swish-02" bei={landung} vor={3} vol={0.3} />
      <Ton nr="papier-04" bei={landung} vol={0.35} />
      <Ton nr="swish-03" bei={k} vor={2} vol={0.35} />
      <Ton nr="schlag-01" bei={k} vol={0.55} />
      <Ton nr="papier-02" bei={k + 6} vol={0.25} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 7: «Solleva heisst: anheben.»  ★ Signature: Glas-Kiesel hebt sich, Island → Glas-Pille
// =====================================================================
export const Szene7: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(7);
  const heisst = w(7, "heisst");
  const heb = w(7, "anheben");
  const ende = satz(8).start;

  const p0 = s.start - 2;
  const grow = overshoot(F, p0 + 3, 10, 1.03);
  const pw = 230 + (900 - 230) * grow;
  const ph = 66 + (190 - 66) * grow;
  const glas = tw(F, p0 + 4, 7, 0, 1, kurve.fade);
  const pO = tw(F, p0, 3, 0, 1, kurve.fade);

  const aus = tw(F, heb - 5, 4, 0, 1, kurve.land) - tw(F, heb - 1, 3, 0, 1, kurve.land);
  const hub = tw(F, heb - 1, 20, 0, 1, kurve.heavy);
  const schweb = hub >= 1 ? Math.sin((F - heb) / 10) * 8 : 0;
  const kY = 1260 + aus * 14 - hub * 380 + schweb;
  const kS = 0.6 + hub * 0.22;
  const versunken = 1 - hub;
  const kRein = tw(F, s.start, 10, 0, 1, kurve.land);
  const glanz = tw(F, heisst + 2, 14, -20, 130, kurve.heavy);

  const bloom = tw(F, ende - 12, 12, 0, 1, kurve.heavy);
  const feldScale = 1.11 - tw(F, s.start, s.dauer + 10, 0, 0.04, kurve.heavy) + bloom * 0.06;
  const txt: React.CSSProperties = { fontFamily: schrift.text, fontWeight: 800, fontSize: 58, color: farben.tinte };
  const ser: React.CSSProperties = { fontFamily: schrift.serif, fontStyle: "italic", fontSize: 88, color: farben.violett };

  return (
    <AbsoluteFill>
      <KieselFeld scale={feldScale} spot={tw(F, s.start, 14, 0, 1, kurve.fade)} />
      <Kamera dauer={s.dauer + 20} seed={7} rucke={[heb]}>
        <Bild v={v}>
          <div style={abs(540 - 380, kY - 380, { width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, rgba(169,139,255,${0.55 * hub}) 0%, rgba(169,139,255,0) 65%)` })} />
          <div
            style={abs(540 - (200 - hub * 70), 1330, {
              width: (200 - hub * 70) * 2,
              height: 60 - hub * 20,
              borderRadius: "50%",
              background: "rgba(20,18,58,.55)",
              filter: `blur(${12 + hub * 20}px)`,
              opacity: kRein * (0.55 - hub * 0.35),
            })}
          />
          <div
            style={abs(540 - 450 * kS, kY - 450 * kS, {
              width: 900 * kS,
              height: 900 * kS,
              opacity: kRein,
              WebkitMaskImage: `linear-gradient(180deg, black ${62 - versunken * 22}%, rgba(0,0,0,${1 - versunken}) ${80 - versunken * 10}%)`,
              transform: `rotate(${-8 + hub * 10 + schweb * 0.25}deg)`,
            })}
          >
            <Img src={staticFile("r01/a/glas-kiesel-b.webp")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                WebkitMaskImage: `url(${staticFile("r01/a/glas-kiesel-b.webp")})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                background: `linear-gradient(115deg, rgba(255,255,255,0) ${glanz - 12}%, rgba(255,255,255,.85) ${glanz}%, rgba(255,255,255,0) ${glanz + 12}%)`,
                mixBlendMode: "screen",
              }}
            />
          </div>
          <Funken bei={heb + 8} cx={540} cy={1260 - 380} weite={160} r0={120} />
        </Bild>
        <Titel v={v}>
          <div style={abs(540 - pw / 2, 420 - ph / 2, { width: pw, height: ph, borderRadius: ph / 2, opacity: pO, background: farben.nacht, boxShadow: "0 30px 70px rgba(44,30,120,.22)", overflow: "hidden" })}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: glas,
                borderRadius: ph / 2,
                background: "linear-gradient(160deg, rgba(255,255,255,.97), rgba(236,230,255,.88))",
                boxShadow: "inset 0 2px 0 #fff, inset 0 -12px 30px rgba(169,139,255,.22)",
                border: "1.5px solid rgba(255,255,255,.95)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, whiteSpace: "nowrap" }}>
              <Wort bei={w(7, "Solleva") + 6} style={txt}>
                Solleva
              </Wort>
              <Wort bei={heisst} style={txt}>
                heisst:
              </Wort>
              <Wort bei={heb} style={ser}>
                anheben.
              </Wort>
            </div>
          </div>
        </Titel>
      </Kamera>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${(kY / 1920) * 100}%, #fff ${bloom * 70}%, rgba(255,255,255,${bloom}) ${bloom * 100 + 10}%)`, opacity: bloom }} />
      {v === "A" && <Ton nr="pop-02" bei={p0 + 3} vol={0.4} />}
      {v === "A" && <Ton nr="klick-02" bei={p0 + 9} vol={0.35} />}
      <Ton nr="glitzer-04" bei={heisst + 8} vol={0.18} />
      <Ton nr="riser-01" bei={heb} vol={0.25} />
      <Ton nr="whoosh-03" bei={heb + 4} vor={2} vol={0.45} />
      <Ton nr="glitzer-04" bei={heb + 10} vol={0.4} />
      <Ton nr="glitzer-05" bei={ende} vor={2} vol={0.2} max={2} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 8: «Genau das mache ich mit deiner Website.»  Website baut sich auf, Telefon hebt sich
// =====================================================================
export const Szene8: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(8);
  const web = w(8, "Website");
  const ende = satz(9).start;
  const tel = tw(F, s.start + 1, 14, 0, 1, kurve.land);
  const hebt = tw(F, web, 16, 0, 1, kurve.heavy);
  const teil = (b: number) => (F >= b ? overshoot(F, b, 9, 1.06) : 0);
  // Bild-im-Bild raus (Apple-Ref 5,6 s): ganze Szene schrumpft zur Karte und fliegt hoch
  const pip = tw(F, ende - 10, 10, 0, 1, kurve.heavy);
  const pipW = tw(F, ende - 2, 10, 0, 1, kurve.whip);
  const woerter: [string, string][] = [["Genau", "Genau"], ["das", "das"], ["mache", "mache"], ["ich", "ich"], ["mit", "mit"]];
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${-pipW * 1400}px) scale(${1 - pip * 0.42})`,
        borderRadius: pip * 80,
        overflow: "hidden",
        boxShadow: `0 40px 90px rgba(44,30,120,${pip * 0.3})`,
      }}
    >
      <MeshHell t={F} />
      <Kamera dauer={80} seed={8} rucke={[web]}>
        <Titel v={v}>
          <Gesperrt size={46} style={abs(90, 290, { width: 860, lineHeight: 1.25 })}>
            {woerter.map(([k, t]) => (
              <React.Fragment key={k}>
                <Wort bei={w(8, k)}>{t}</Wort>
                {k === "das" ? <br /> : " "}
              </React.Fragment>
            ))}
          </Gesperrt>
          <Gross size={200} style={abs(70, 425, ausUnschaerfe(F, w(8, "deiner")))}>
            deiner
          </Gross>
          <div style={abs(380, 565, { ...slam(F, web, 1.45, 9), transformOrigin: "30% 50%" })}>
            <Band dreh={-4} size={130}>
              Website
            </Band>
          </div>
        </Titel>
        <Bild v={v}>
          <div style={abs(230, 1700, { width: 620, height: 40, borderRadius: "50%", background: "rgba(44,30,120,.22)", filter: `blur(${18 + hebt * 14}px)`, transform: `scaleX(${1 - hebt * 0.3})`, opacity: tel * (1 - hebt * 0.5) })} />
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - tel) * 900 - hebt * 70}px)` }}>
            <div style={abs(540 - 360, 1150 - 360 - hebt * 0, { width: 720, height: 720, borderRadius: "50%", background: `radial-gradient(circle, rgba(169,139,255,${0.45 * hebt}), rgba(169,139,255,0) 65%)` })} />
            <Telefon x={250} y={780} w={580}>
              <div style={{ position: "absolute", inset: 0, background: farben.papier }} />
              <div style={abs(40, 100, { display: "flex", alignItems: "center", gap: 14, transform: `scale(${teil(s.start + 12)})`, transformOrigin: "0 50%" })}>
                <Img src={staticFile("r01/a/glas-kiesel-b.webp")} style={{ width: 54, height: 54 }} />
                <span style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 30, color: farben.tinte }}>Deine Firma</span>
              </div>
              <div style={abs(40, 190, { fontFamily: schrift.titel, fontWeight: 900, fontSize: 84, lineHeight: 0.92, color: farben.tinte, ...ausUnschaerfe(F, w(8, "das")) })}>
                DEIN BETRIEB.
                <br />
                <span style={{ fontFamily: schrift.serif, fontStyle: "italic", fontWeight: 400, color: farben.violett, textTransform: "none" }}>sichtbar.</span>
              </div>
              <div style={abs(40, 400, { width: 300, height: 70, borderRadius: 999, background: farben.violett, transform: `scale(${teil(w(8, "mache"))})`, transformOrigin: "0 50%", color: "#fff", fontFamily: schrift.text, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" })}>
                Termin buchen
              </div>
              <div style={abs(40, 510, { width: 470, height: 280, borderRadius: 30, background: `linear-gradient(135deg, ${farben.lavendel}, #D9CFFB)`, transform: `scale(${teil(w(8, "ich"))})`, transformOrigin: "50% 0" })} />
              <div style={abs(40, 830, { width: 400 * teil(w(8, "mit")), height: 18, borderRadius: 9, background: farben.grauLinie })} />
              <div style={abs(40, 870, { width: 300 * teil(w(8, "mit") + 3), height: 18, borderRadius: 9, background: farben.grauLinie })} />
            </Telefon>
          </div>
          <Funken bei={web + 4} cx={540} cy={760} n={8} weite={200} r0={60} />
        </Bild>
      </Kamera>
      <Ton nr="swish-02" bei={s.start + 4} vor={2} vol={0.3} />
      <Ton nr="pop-02" bei={s.start + 12} vol={0.3} />
      <Ton nr="pop-05" bei={w(8, "mache")} vol={0.3} />
      <Ton nr="pop-02" bei={w(8, "ich")} vol={0.3} />
      <Ton nr="ratsche-18" bei={w(8, "mit")} vol={0.2} max={0.5} />
      <Ton nr="schlag-01" bei={web} vol={0.4} />
      <Ton nr="whoosh-03" bei={web + 2} vor={2} vol={0.3} />
      <Ton nr="whoosh-01" bei={ende + 2} vor={2} vol={0.35} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Satz 9: «Sichtbar sein ist kein Zufall.»  Schluss, Glas-Pille + Zufall, Kiesel schwebt
// =====================================================================
export const Szene9: React.FC<{ v: V }> = ({ v }) => {
  const F = useCurrentFrame();
  const s = satz(9);
  const ist = w(9, "ist");
  const zufall = w(9, "Zufall");
  const p0 = ist - 4;
  const grow = overshoot(F, p0, 10, 1.03);
  const pw = 200 + (760 - 200) * grow;
  const ph = 60 + (210 - 60) * grow;
  const glas = tw(F, p0 + 2, 7, 0, 1, kurve.fade);
  const kRein = tw(F, zufall + 6, 16, 0, 1, kurve.land);
  const nach = zufall + 30;
  const hebNochmal = tw(F, nach, 18, 0, 1, kurve.heavy);
  const schweb = Math.sin(F / 14) * 10 - hebNochmal * 60;
  const glanz9 = tw(F, nach + 10, 16, -30, 140, kurve.heavy);
  const ende = T.gesamt;
  return (
    <AbsoluteFill>
      <Kamera dauer={ende - s.start} seed={9} push={0.03} rucke={[zufall]}>
        <div style={abs(0, 300, { width: 1080, textAlign: "center", fontFamily: schrift.text, fontWeight: 800, fontSize: 40, letterSpacing: "0.14em", color: farben.tinte, opacity: tw(F, s.start + 4, 10, 0, 1) })}>SOLLEVA</div>
        <Titel v={v}>
          <Gesperrt style={abs(0, 600, { width: 1080, textAlign: "center" })}>
            <Wort bei={w(9, "Sichtbar")}>Sichtbar</Wort> <Wort bei={w(9, "sein")}>sein</Wort>
          </Gesperrt>
          <div style={abs(540 - pw / 2, 790 - ph / 2, { width: pw, height: ph, borderRadius: ph / 2, background: farben.nacht, opacity: tw(F, p0 - 2, 3, 0, 1), overflow: "hidden", boxShadow: "0 30px 70px rgba(44,30,120,.18)" })}>
            <div style={{ position: "absolute", inset: 0, opacity: glas, borderRadius: ph / 2, background: "linear-gradient(160deg, rgba(255,255,255,.97), rgba(236,230,255,.85))", boxShadow: "inset 0 2px 0 #fff, inset 0 -12px 30px rgba(169,139,255,.22)", border: "1.5px solid rgba(255,255,255,.95)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, fontFamily: schrift.titel, fontWeight: 900, fontSize: 130, color: farben.tinte, textTransform: "uppercase" }}>
              <Wort bei={ist}>ist</Wort>
              <Wort bei={w(9, "kein")}>kein</Wort>
            </div>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${glanz9 - 14}%, rgba(255,255,255,.9) ${glanz9}%, rgba(255,255,255,0) ${glanz9 + 14}%)`, mixBlendMode: "screen" }} />
          </div>
          <Kursiv size={290} style={abs(0, 900, { width: 1080, textAlign: "center", ...slam(F, zufall, 0.6, 10), transformOrigin: "50% 60%" })}>
            Zufall.
          </Kursiv>
          <Funken bei={zufall + 2} cx={540} cy={1040} n={10} weite={300} r0={150} />
        </Titel>
        <Bild v={v}>
          <div style={abs(540 - 300, 1420 - 300 + schweb, { width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(169,139,255,${0.4 * kRein}), rgba(169,139,255,0) 65%)` })} />
          <div style={abs(540 - 70, 1640, { width: 140, height: 26, borderRadius: "50%", background: "rgba(44,30,120,.25)", filter: "blur(10px)", opacity: kRein, transform: `scaleX(${1 - schweb / 40})` })} />
          <Img
            src={staticFile("r01/a/glas-kiesel-b.webp")}
            style={abs(540 - 150, 1420 - 150 + schweb + (1 - kRein) * 200, { width: 300, height: 300, opacity: kRein, transform: `rotate(${-6 + Math.sin(F / 20) * 4}deg)` })}
          />
        </Bild>
      </Kamera>
      <Ton nr="pop-02" bei={p0} vol={0.35} />
      <Ton nr="klick-02" bei={p0 + 7} vol={0.3} />
      <Ton nr="schlag-04" bei={zufall} vol={0.35} />
      <Ton nr="glitzer-03" bei={zufall + 4} vol={0.3} />
      <Ton nr="whoosh-03" bei={nach + 2} vor={2} vol={0.25} />
      <Ton nr="glitzer-04" bei={nach + 14} vol={0.2} />
    </AbsoluteFill>
  );
};
