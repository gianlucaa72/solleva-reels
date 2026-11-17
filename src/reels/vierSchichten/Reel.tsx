import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { farben, form, schrift, stimmungen } from "../../brand/solleva";
import { kurve, overshoot, tw } from "../../lib/bewegung";
import { Kamera, Ton } from "../../lib/kamera";
import { Label, Schriften, Serif } from "../../components/Basis";
import { Cursor } from "../../components/Cursor";
import { Endkarte } from "../../components/Endkarte";
import { GymSeite, GYM } from "./GymSeite";
import { Akzent, EbeneHandlung, glas, Satz, Stapel, SzLadezeit } from "./Szenen";
import { SzLichtAusEcht, Wisch } from "./Stiltest";
import timeline from "./timeline.json";

// ======================================================================
// Reel «4 Schichten» (Solleva) – 1080×1920, 30 fps, Stimme Andre.
// Alle Frames aus timeline.json (Stimme vermessen), Schlüsselwörter per Hüllkurve.
// ======================================================================

export const REEL_DAUER = timeline.dauer;
const S1 = stimmungen.S1;
const S2 = stimmungen.S2;
const A = (v: string) => staticFile(`assets/reels/vier-schichten/${v}`);
const BILDER = [A("g1-gym.png"), A("g2-coach.png")];

// Schlüsselwort-Frames (absolut)
export const K = {
  vier1: 40, s2: 75, nie: 118,
  s3: 137, marke: 153, farben: 181, schriften: 209, echte: 239,
  s4: 268, struktur: 289, fuenf: 323, was: 362, wo: 381, fuerwen: 398,
  s5: 425, button: 450, nummer: 482, anklickbar: 508,
  s6: 535, vier: 548, sieht: 577, keiner: 588,
  s7: 611, dreiSek: 650, springen: 675, google: 697,
  s8: 728, lokal: 749, datenschutz: 797, sauber: 820,
  s9: 838, zusammen: 860, bringen: 879,
  s10: 916, schreib: 959, analyse: 977,
};

// ---------- Hilfen ----------
const Video: React.FC<{ v: string; ab?: number; dunkler?: number }> = ({ v, ab = 0, dunkler = 0 }) => (
  <AbsoluteFill>
    <OffthreadVideo src={A(v)} startFrom={ab} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {dunkler > 0 && <AbsoluteFill style={{ background: `rgba(7,10,36,${dunkler})` }} />}
  </AbsoluteFill>
);
const Bild: React.FC<{ v: string }> = ({ v }) => <Img src={A(v)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />;

/** Untertitel, der innerhalb eines Satzes wechselt: teile[i].ab = lokaler Frame. */
const Wechseltext: React.FC<{ teile: { ab: number; inhalt: React.ReactNode }[]; dunkel?: boolean; size?: number; y?: number }> = ({ teile, dunkel, size = 92, y = 290 }) => {
  const f = useCurrentFrame();
  let akt = 0;
  teile.forEach((t, i) => { if (f >= t.ab) akt = i; });
  const t = teile[akt];
  const p = tw(f, t.ab, 10, 0, 1, kurve.land);
  return (
    <div key={akt} style={{ position: "absolute", left: 70, right: 140, top: y, fontFamily: schrift.text, fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: "-0.02em", color: dunkel ? farben.papier : farben.tinte, opacity: p, transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
      {t.inhalt}
    </div>
  );
};

/** U16-Variante «Licht an»: weisser Bloom aus der Mitte, 12 Frames. */
const LichtAn: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  if (f < start || f > start + 14) return null;
  const r = tw(f, start, 7, 0, 1600, kurve.whip);
  const o = f < start + 7 ? 1 : tw(f, start + 7, 7, 1, 0, kurve.fade);
  return <AbsoluteFill style={{ background: `radial-gradient(${r}px ${r * 1.4}px at 540px 960px, #FFFFFF 0%, #F6F5FC 55%, rgba(236,230,255,0) 100%)`, opacity: o }} />;
};

/** U19 Partikel-Zerfall (Referenz 0:04,7): Ausgang zerfällt von links unten nach rechts oben in Partikel. 14 Frames. */
const PartikelZerfall: React.FC<{ start: number; dauer?: number; children: React.ReactNode }> = ({ start, dauer = 14, children }) => {
  const f = useCurrentFrame();
  const p = tw(f, start, dauer, 0, 1, kurve.linear);
  if (f > start + dauer + 26) return null;
  const teile: React.ReactNode[] = [];
  const pal = [farben.violett, farben.lavendelAkzent, farben.papier, farben.tinte, "#C9BEF0"];
  for (let i = 0; i < 260; i++) {
    const x = (i * 97.3) % 1080;
    const y = (i * 151.7 + (i % 7) * 37) % 1920;
    const los = start + dauer * ((x + (1920 - y)) / 3000); // diagonal
    const d = f - los;
    if (d < 0 || d > 26) continue;
    const k = d / 26;
    const s = 8 + (i % 4) * 5;
    teile.push(<div key={i} style={{ position: "absolute", left: x + k * (180 + (i % 5) * 60), top: y - k * (260 + (i % 3) * 90), width: s, height: s, borderRadius: i % 3 === 0 ? s : 2, background: pal[i % pal.length], opacity: 1 - k, transform: `rotate(${k * 180}deg)` }} />);
  }
  const m = `linear-gradient(45deg, transparent ${p * 140 - 20}%, black ${p * 140}%)`;
  return (
    <>
      {f <= start + dauer && <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}>{children}</AbsoluteFill>}
      <AbsoluteFill>{teile}</AbsoluteFill>
    </>
  );
};

const Pille: React.FC<{ children: React.ReactNode; dunkel?: boolean; style?: React.CSSProperties }> = ({ children, dunkel, style }) => (
  <div style={{ position: "absolute", padding: "16px 24px", borderRadius: 22, background: dunkel ? "rgba(17,20,58,.8)" : farben.weiss, border: `1.5px solid ${dunkel ? farben.lavendelAkzent : farben.rand}`, boxShadow: dunkel ? `0 0 24px ${farben.violett}` : form.schatten, fontFamily: schrift.text, fontWeight: 800, fontSize: 30, color: dunkel ? farben.papier : farben.tinte, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);
const pop = (f: number, start: number, dauer = 12) => (f >= start ? overshoot(f, start, dauer, 1.08) : 0);

const FotoEbene: React.FC = () => (
  <div style={{ ...glas(false), overflow: "hidden" }}>
    <GymSeite bilder={BILDER} />
  </div>
);
const MarkeEbene: React.FC = () => (
  <div style={{ ...glas(false), background: farben.weiss }}>
    {[farben.tinte, farben.papier, farben.violett].map((c, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + i * 190, top: 60, width: 170, height: 240, borderRadius: 20, background: c, border: `1.5px solid ${farben.rand}` }} />
    ))}
    <div style={{ position: "absolute", left: 40, top: 360, fontFamily: schrift.text, fontWeight: 800, fontSize: 160, color: farben.tinte }}>Aa</div>
    <div style={{ position: "absolute", left: 330, top: 380, fontFamily: schrift.serif, fontStyle: "italic", fontSize: 160, color: farben.violett }}>Aa</div>
  </div>
);
const StrukturEbene: React.FC = () => (
  <div style={{ ...glas(false), background: farben.papier }}>
    <GymSeite m="bauplan" />
  </div>
);
const UnsichtbarEbene: React.FC<{ sichtbar?: number; cyan?: number }> = ({ sichtbar = 1, cyan = 0 }) => (
  <div style={{ ...glas(true), opacity: sichtbar, borderStyle: "dashed", borderColor: cyan > 0 ? farben.cyan : farben.lavendelAkzent, boxShadow: `0 0 ${30 + cyan * 40}px ${cyan > 0 ? farben.cyan : farben.violett}` }} />
);

// ======================================================================
// Szene 1–2: Hook im Studio (0–137)
// ======================================================================
const SzStudio: React.FC = () => {
  const f = useCurrentFrame();
  const dauer = K.s3;
  const einflug = tw(f, 0, 14, 1, 0, kurve.land); // Stapel fällt aus der Unschärfe ins Bild
  const spreiz = tw(f, K.vier1, 18, 8, 125, kurve.heavy);
  const naeher = f >= K.s2; // Schnitt auf Satz 2: näher, andere Drehung
  const dreh = (naeher ? -20 : -34) + Math.sin(f / 40) * 5;
  const flacker = f >= K.nie ? 0.3 + 0.7 * Math.abs(Math.sin((f - K.nie) / 2.6)) * ((f - K.nie) % 9 < 2 ? 0.15 : 1) : 1;
  return (
    <AbsoluteFill>
      <Video v="h1-studio.mp4" />
      <Kamera dauer={dauer} push={0.05} rucke={[K.vier1, K.s2, K.nie]}>
        <AbsoluteFill style={{ transform: `translateY(${-900 * einflug}px) scale(${naeher ? 1.12 : 1})`, filter: `blur(${einflug * 18}px)`, transformOrigin: "540px 1100px" }}>
          <Stapel ebenen={[<FotoEbene />, <EbeneHandlung />, <StrukturEbene />, <UnsichtbarEbene sichtbar={flacker} />]} spreiz={spreiz} drehZ={dreh} reflex y={1100} skala={0.74} />
        </AbsoluteFill>
        {!naeher && ["04 ???", "02 Struktur", "03 Handlung", "01 Marke"].map((n, i) => {
          const st = K.vier1 + 10 + i * 5;
          const o = tw(f, st, 8, 0, 1, kurve.land);
          return (
            <div key={n} style={{ position: "absolute", left: 790, top: 1330 - i * 100, fontFamily: schrift.mono, fontSize: 26, color: i === 3 ? farben.cyan : farben.lavendelAkzent, opacity: o, transform: `translateX(${(1 - o) * 30}px)`, letterSpacing: "0.12em" }}>
              — {n.toUpperCase()}
            </div>
          );
        })}
        {naeher && (
          <div style={{ position: "absolute", left: 800, top: 1340, fontFamily: schrift.serif, fontStyle: "italic", fontSize: 160, color: farben.lavendelAkzent, transform: `scale(${pop(f, K.nie)})`, textShadow: `0 0 30px ${farben.violett}` }}>?</div>
        )}
      </Kamera>
      <Wechseltext
        dunkel
        teile={[
          { ab: 0, inhalt: <>Jede gute Website hat <Akzent dunkel>vier</Akzent> Schichten.</> },
          { ab: K.s2, inhalt: <>Die wichtigste siehst du <Akzent dunkel>nie.</Akzent></> },
        ]}
        y={250}
      />
    </AbsoluteFill>
  );
};

// ======================================================================
// Szene 3: Marke (137–268) – Lavendel-Papier
// ======================================================================
const SzMarke: React.FC = () => {
  const f = useCurrentFrame(); // lokal, 0 = K.s3
  const L = (k: number) => k - K.s3;
  // 1) Logo: gross → hell/dunkel → winzig (Favicon)
  const logoKlein = tw(f, L(K.marke) + 14, 12, 0, 1, kurve.heavy);
  const logoWeg = tw(f, L(K.farben) - 2, 8, 0, 1, kurve.raus);
  // 2) Farbkarten
  const karte = (i: number) => tw(f, L(K.farben) + i * 4, 16, 0, 1, kurve.heavy);
  const kartenWeg = tw(f, L(K.schriften) - 2, 10, 0, 1, kurve.heavy);
  // 3) Schriften
  const aa = (i: number) => pop(f, L(K.schriften) + 2 + i * 6);
  const aaWeg = tw(f, L(K.echte) - 4, 8, 0, 1, kurve.heavy);
  // 4) Bilder
  const stock = pop(f, L(K.echte) - 4, 12);
  const stempel = tw(f, L(K.echte) + 8, 6, 0, 1, kurve.whip);
  const echt = tw(f, L(K.echte) + 18, 10, 0, 1, kurve.heavy);
  const karten = [
    { c: farben.tinte, n: "Haupt", hex: "#14123A", pct: "60", t: farben.papier },
    { c: farben.papier, n: "Neutral", hex: "#F6F5FC", pct: "30", t: farben.tinte },
    { c: farben.violett, n: "Akzent", hex: "#6C3FD4", pct: "10", t: farben.papier },
  ];
  return (
    <AbsoluteFill>
      <Video v="h2-papier.mp4" />
      <Kamera dauer={131} push={0.04} rucke={[L(K.farben), L(K.echte) + 8]}>
        {/* 1 Logo */}
        {logoWeg < 1 && (
          <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${(1 - 0.75 * logoKlein) * pop(f, 2)}) translateY(${logoWeg * -900}px)`, display: "flex", gap: 30 }}>
            <div style={{ padding: "40px 54px", borderRadius: 34, background: farben.weiss, boxShadow: form.schatten, fontFamily: schrift.text, fontWeight: 800, fontSize: 76, color: farben.tinte }}>DEIN GYM<span style={{ color: farben.violett }}>.</span></div>
            <div style={{ padding: "40px 54px", borderRadius: 34, background: farben.tinte, fontFamily: schrift.text, fontWeight: 800, fontSize: 76, color: farben.papier, transform: `scale(${pop(f, L(K.marke))})` }}>DEIN GYM<span style={{ color: farben.lavendelAkzent }}>.</span></div>
          </div>
        )}
        {logoKlein > 0.5 && logoWeg < 1 && (
          <Pille style={{ left: 330, top: 1180, fontSize: 26, opacity: tw(f, L(K.marke) + 24, 6, 0, 1), transform: `translateY(${logoWeg * -900}px)` }}>funktioniert auch winzig ✓</Pille>
        )}
        {/* 2 Farbkarten 60/30/10 */}
        {f >= L(K.farben) - 2 && aaWeg < 1 &&
          karten.map((k, i) => {
            const p = karte(i);
            const rot = (i - 1) * 14 * p;
            const sx = 1 - 0.45 * kartenWeg;
            return (
              <div key={i} style={{ position: "absolute", left: 340, top: 640, width: 400, height: 560, borderRadius: 28, background: k.c, border: `1.5px solid ${farben.rand}`, boxShadow: form.schatten, transformOrigin: "50% 120%", transform: `translate(${-230 * kartenWeg}px, ${-120 * kartenWeg + (1 - p) * 900}px) scale(${sx}) rotate(${rot}deg) translateX(${(i - 1) * 70 * p}px)`, padding: 34, boxSizing: "border-box", fontFamily: schrift.text, color: k.t, opacity: 1 - aaWeg }}>
                <div style={{ fontWeight: 800, fontSize: 104, lineHeight: 1 }}>{k.pct}<span style={{ fontSize: 46 }}>%</span></div>
                <div style={{ position: "absolute", left: 34, bottom: 78, fontFamily: schrift.mono, fontSize: 26, opacity: 0.8 }}>{k.hex}</div>
                <div style={{ position: "absolute", left: 34, bottom: 34, fontWeight: 700, fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase" }}>{k.n}</div>
              </div>
            );
          })}
        {f >= L(K.farben) + 18 && kartenWeg < 0.5 && <Pille style={{ left: 290, top: 1290, fontSize: 26, transform: `scale(${pop(f, L(K.farben) + 18)})` }}>Akzent nur für Buttons</Pille>}
        {/* 3 Zwei Schriften */}
        {f >= L(K.schriften) && aaWeg < 1 && (
          <>
            <div style={{ position: "absolute", left: 560, top: 640, width: 400, height: 280, borderRadius: 28, background: farben.weiss, boxShadow: form.schatten, transform: `scale(${aa(0) * (1 - aaWeg)}) rotate(3deg)`, padding: 30, boxSizing: "border-box" }}>
              <div style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 150, lineHeight: 1, color: farben.tinte }}>Aa</div>
              <div style={{ fontFamily: schrift.mono, fontSize: 22, color: farben.grau, marginTop: 10 }}>TEXT · BARLOW</div>
            </div>
            <div style={{ position: "absolute", left: 560, top: 960, width: 400, height: 280, borderRadius: 28, background: farben.weiss, boxShadow: form.schatten, transform: `scale(${aa(1) * (1 - aaWeg)}) rotate(-3deg)`, padding: 30, boxSizing: "border-box" }}>
              <div style={{ fontFamily: schrift.serif, fontStyle: "italic", fontSize: 160, lineHeight: 1, color: farben.violett }}>Aa</div>
              <div style={{ fontFamily: schrift.mono, fontSize: 22, color: farben.grau }}>AKZENT · SERIF</div>
            </div>
          </>
        )}
        {/* 4 Stock-Foto → Stempel → echtes Foto */}
        {f >= L(K.echte) - 4 && (
          <>
            <div style={{ position: "absolute", left: 160, top: 660, width: 760, height: 570, borderRadius: 30, overflow: "hidden", boxShadow: form.schatten, transform: `scale(${stock}) rotate(${-4 + echt * -6}deg) translate(${echt * -120}px, ${echt * 60}px)`, filter: `saturate(${1 - echt * 0.8})` }}>
              <Bild v="g4-stock.png" />
              <div style={{ position: "absolute", left: 150, top: 220, padding: "14px 30px", border: `8px solid ${farben.violett}`, color: farben.violett, background: "rgba(255,255,255,.85)", fontFamily: schrift.text, fontWeight: 800, fontSize: 70, letterSpacing: "0.1em", transform: `rotate(-14deg) scale(${2.2 - 1.2 * stempel})`, opacity: stempel, borderRadius: 14 }}>NEIN, DANKE</div>
            </div>
            <div style={{ position: "absolute", left: 200, top: 760, width: 760, height: 570, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 90px rgba(44,30,120,.35)", border: `8px solid ${farben.weiss}`, transform: `translate(${(1 - echt) * 1100}px, ${(1 - echt) * -200}px) rotate(${3 + (1 - echt) * 20}deg)` }}>
              <Bild v="g3-kurs.png" />
            </div>
          </>
        )}
      </Kamera>
      <Label s={S1} text="// 01 Marke" x={70} y={230} />
      <Wechseltext
        size={84}
        teile={[
          { ab: 0, inhalt: <>Eins: die <Akzent>Marke.</Akzent></> },
          { ab: L(K.farben), inhalt: <>Zwei Farben, …</> },
          { ab: L(K.schriften), inhalt: <>Zwei Farben, zwei Schriften, …</> },
          { ab: L(K.echte), inhalt: <>Zwei Farben, zwei Schriften, <Akzent>echte</Akzent> Bilder.</> },
        ]}
      />
    </AbsoluteFill>
  );
};

// ======================================================================
// Szene 4: Struktur (268–425) – Bauplan-Papier, halb Foto / halb Zeichnung
// ======================================================================
const SzStruktur: React.FC = () => {
  const f = useCurrentFrame();
  const L = (k: number) => k - K.s4;
  const split = tw(f, L(K.struktur), 30, 0, 0.5, kurve.heavy);
  const sx = 70, sy = 640, sk = 0.9;
  const beschr = [
    { t: "MENÜ: MAX. 5", y: 40, x: 600, bei: L(K.fuenf) + 8 },
    { t: "LEISTUNGEN AUF EINEN BLICK", y: 550, x: 620, bei: L(K.was) - 8 },
    { t: "GESICHT / TEAM", y: 720, x: 300, bei: L(K.wo) - 6 },
    { t: "BEWERTUNGEN SICHTBAR", y: 765, x: 520, bei: L(K.fuerwen) - 4 },
  ];
  const sek = Math.min(5, Math.max(0, Math.floor((f - L(K.fuenf)) / 7)));
  // was / wo / für wen: Kringel auf der Hero-Botschaft
  const kringel = [
    { bei: L(K.was), x: 34, y: 236, w: 400, h: 64, t: "WAS" },
    { bei: L(K.wo), x: 300, y: 236, w: 180, h: 64, t: "WO" },
    { bei: L(K.fuerwen), x: 34, y: 300, w: 470, h: 40, t: "FÜR WEN" },
  ];
  return (
    <AbsoluteFill>
      <Bild v="h3-bauplan.png" />
      <Kamera dauer={157} push={0.05} rucke={[L(K.fuenf)]}>
        <div style={{ position: "absolute", left: sx, top: sy, transform: `scale(${sk})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", width: GYM.w, height: GYM.h, borderRadius: 30, boxShadow: form.schatten }} />
          <div style={{ position: "absolute", width: GYM.w, height: GYM.h, clipPath: `inset(0 ${split * 100}% 0 0)` }}><GymSeite bilder={BILDER} /></div>
          <div style={{ position: "absolute", width: GYM.w, height: GYM.h, clipPath: `inset(0 0 0 ${(1 - split) * 100}%)` }}><GymSeite m="bauplan" /></div>
          <div style={{ position: "absolute", left: GYM.w * (1 - split) - 1, top: -30, width: 3, height: GYM.h + 60, background: farben.violett, opacity: split > 0.01 ? 1 : 0 }} />
          {kringel.map((k, i) => {
            const p = tw(f, k.bei, 10, 0, 1, kurve.heavy);
            if (p <= 0) return null;
            return (
              <React.Fragment key={i}>
                <svg width={GYM.w} height={GYM.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={k.h / 2} fill="none" stroke={farben.violett} strokeWidth={5} strokeDasharray={2 * (k.w + k.h)} strokeDashoffset={(1 - p) * 2 * (k.w + k.h)} />
                </svg>
                <div style={{ position: "absolute", left: k.x + k.w - 30, top: k.y - 34, padding: "4px 12px", borderRadius: 10, background: farben.violett, color: "#fff", fontFamily: schrift.mono, fontSize: 22, transform: `scale(${pop(f, k.bei + 4)})` }}>{k.t}</div>
              </React.Fragment>
            );
          })}
        </div>
        {beschr.map((b, i) => {
          const l = tw(f, b.bei, 12, 0, 1, kurve.heavy);
          const ax = sx + b.x * sk, ay = sy + b.y * sk;
          const ex = 770, ey = 640 + i * 190;
          return (
            <React.Fragment key={i}>
              <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
                <circle cx={ax} cy={ay} r={6 * l} fill={farben.violett} />
                <polyline points={`${ax},${ay} ${ax + (ex - 40 - ax) * l},${ay + (ey - ay) * l} ${ex - 40 + 40 * l},${ey}`} fill="none" stroke={farben.violett} strokeWidth={2} opacity={l > 0 ? 1 : 0} />
              </svg>
              <div style={{ position: "absolute", left: ex + 10, top: ey - 14, width: 160, fontFamily: schrift.mono, fontSize: 18, lineHeight: 1.25, color: farben.tinte, letterSpacing: "0.06em", opacity: tw(f, b.bei + 8, 8, 0, 1) }}>{b.t}</div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 70, top: 540, padding: "12px 24px", borderRadius: 40, background: sek >= 5 ? farben.violett : farben.tinte, color: farben.papier, fontFamily: schrift.mono, fontSize: 34, transform: `scale(${pop(f, L(K.fuenf) - 2)})` }}>⏱ 0:0{sek}</div>
      </Kamera>
      <Label s={S1} text="// 02 Struktur" x={70} y={230} />
      <Wechseltext
        size={82}
        teile={[
          { ab: 0, inhalt: <>Zwei: <Akzent>Struktur.</Akzent></> },
          { ab: L(K.fuenf) - 5, inhalt: <>In <Akzent>fünf Sekunden</Akzent> klar: was, wo, für wen.</> },
        ]}
      />
    </AbsoluteFill>
  );
};

// ======================================================================
// Szene 5: Handlung (425–535) – Lavendel-Wellen, Cursor klickt
// ======================================================================
const SzHandlung: React.FC = () => {
  const f = useCurrentFrame();
  const L = (k: number) => k - K.s5;
  const k1 = L(K.button) + 10, k2 = L(K.anklickbar) + 4;
  const anruf = tw(f, k2, 10, 0, 1, kurve.land);
  const einflug = tw(f, 0, 16, 1, 0, kurve.land);
  return (
    <AbsoluteFill>
      <Video v="h4-wellen.mp4" />
      <Kamera dauer={110} push={0.05} rucke={[k1, k2]}>
        <div style={{ position: "absolute", left: 300, top: 620, width: 480, height: 960, borderRadius: 64, background: farben.tinte, padding: 16, boxSizing: "border-box", boxShadow: "0 50px 90px rgba(44,30,120,.35)", transform: `translateY(${einflug * 1200}px) rotate(${einflug * 12}deg)` }}>
          <div style={{ width: 448, height: 928, borderRadius: 50, overflow: "hidden", background: farben.weiss, position: "relative" }}>
            <div style={{ transform: "scale(0.7)", transformOrigin: "0 0" }}><GymSeite bilder={BILDER} /></div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 120, height: 92, borderRadius: 46, background: farben.violett, color: "#fff", fontFamily: schrift.text, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f > k1 && f < k1 + 6 ? 0.94 : 1})`, boxShadow: `0 0 ${f > k1 ? 40 : 0}px ${farben.lavendelAkzent}` }}>Probetraining buchen</div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 30, height: 70, borderRadius: 35, border: `2px solid ${farben.violett}`, color: farben.violett, fontFamily: schrift.text, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(108,63,212,${0.14 * anruf})` }}>📞 062 000 00 00</div>
          </div>
        </div>
        <Pille style={{ left: 640, top: 1150, transform: `scale(${pop(f, k1 + 6)}) rotate(4deg)`, fontSize: 28 }}>✓ Termin angefragt</Pille>
        <Pille style={{ left: 600, top: 1640 - 120, transform: `scale(${pop(f, k2 + 6)}) rotate(-3deg)`, fontSize: 28, background: farben.violett, color: "#fff", border: "none" }}>Anruf …</Pille>
        <Pille style={{ left: 70, top: 900, transform: `scale(${pop(f, k2 + 12)}) rotate(-4deg)` }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.12em", color: farben.grau }}>HEUTE GEÖFFNET</div>6–22 Uhr
        </Pille>
        <Pille style={{ left: 760, top: 760, transform: `scale(${pop(f, k2 + 18)}) rotate(5deg)`, color: farben.violett }}>📍 Route</Pille>
        <Cursor s={S1} sichtbarAb={10} pfad={[{ f: 10, x: 980, y: 1750 }, { f: k1, x: 560, y: 1395, klick: true }, { f: k1 + 20, x: 620, y: 1420 }, { f: k2, x: 560, y: 1497, klick: true }, { f: 110, x: 610, y: 1530 }]} />
      </Kamera>
      <Label s={S1} text="// 03 Handlung" x={70} y={230} />
      <Wechseltext
        size={84}
        teile={[
          { ab: 0, inhalt: <>Drei: ein <Akzent>Haupt-Button.</Akzent></> },
          { ab: L(K.nummer), inhalt: <>Und die Nummer <Akzent>anklickbar.</Akzent></> },
        ]}
      />
    </AbsoluteFill>
  );
};

// ======================================================================
// Szene 8: lokal + Datenschutz (728–838) – Neon-Flug (H5 A), Glas-Ebenen
// ======================================================================
const SzLokal: React.FC = () => {
  const f = useCurrentFrame();
  const L = (k: number) => k - K.s8;
  const ebene = (i: number, bei: number, inhalt: React.ReactNode) => {
    const p = tw(f, bei, 16, 0, 1, kurve.heavy);
    return (
      <div style={{ position: "absolute", left: 150, top: 1180 - i * 250 - p * 40, width: 780, height: 330, borderRadius: 36, background: "rgba(17,20,58,.62)", border: `2px solid ${farben.lavendelAkzent}`, boxShadow: `0 0 30px rgba(108,63,212,.6), inset 0 0 40px rgba(169,139,255,.25)`, transform: `perspective(1600px) rotateX(${46 - p * 8}deg) translateY(${(1 - p) * 500}px)`, opacity: p, fontFamily: schrift.text, color: farben.papier, padding: "34px 40px", boxSizing: "border-box" }}>
        {inhalt}
      </div>
    );
  };
  const h = (t: string) => <div style={{ fontFamily: schrift.mono, fontSize: 24, color: farben.cyan, letterSpacing: "0.14em" }}>{t}</div>;
  const haken = tw(f, L(K.sauber), 10, 0, 1, kurve.heavy);
  return (
    <AbsoluteFill>
      <Video v="h5-gitter-a.mp4" />
      <Kamera dauer={110} push={0.05} rucke={[L(K.sauber)]}>
        {ebene(0, 2, <>{h("MOBILE ZUERST")}<div style={{ fontWeight: 800, fontSize: 56 }}>📱 Handy-Ansicht ✓</div></>)}
        {ebene(1, L(K.lokal), <>{h("LOKALES SEO + GOOGLE-PROFIL")}<div style={{ fontWeight: 800, fontSize: 52 }}>📍 Gym · Olten <span style={{ color: farben.gold, fontSize: 40 }}>★★★★★</span></div></>)}
        {ebene(2, L(K.datenschutz) - 4, <>{h("IMPRESSUM · DATENSCHUTZ")}<div style={{ fontWeight: 800, fontSize: 56 }}>🔒 revDSG <span style={{ display: "inline-block", color: farben.cyan, transform: `scale(${pop(f, L(K.sauber))})` }}>✓</span></div></>)}
        {haken > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 4, background: farben.cyan, boxShadow: `0 0 30px ${farben.cyan}`, transform: `scaleX(${haken})`, opacity: 1 - tw(f, L(K.sauber) + 10, 10, 0, 1) }} />}
      </Kamera>
      <Label s={S2} text="// 04 Lokal · Datenschutz" x={70} y={230} />
      <Wechseltext
        dunkel
        size={84}
        teile={[
          { ab: 0, inhalt: <>Dazu: lokal <Akzent dunkel>gefunden</Akzent> werden.</> },
          { ab: L(K.datenschutz), inhalt: <>Datenschutz <Akzent dunkel>sauber.</Akzent></> },
        ]}
      />
    </AbsoluteFill>
  );
};

// ======================================================================
// Szene 9: Zusammensetzen (838–916) – U21 + Licht an + Seite ins Handy
// ======================================================================
const SzZusammen: React.FC = () => {
  const f = useCurrentFrame();
  const L = (k: number) => k - K.s9;
  // Ebenen fliegen von den Rändern ein (Referenz 0:07,2), gestaffelt; letzte landet zuletzt
  const flug = (i: number) => tw(f, 2 + i * 3, 16, 1, 0, kurve.heavy);
  const richt = [[-1400, -300], [1400, 200], [0, -1600], [0, 1500]];
  const z = tw(f, L(K.zusammen), 16, 1, 0, kurve.heavy); // gespreizt → flach
  const insHandy = tw(f, L(K.bringen) + 2, 16, 0, 1, kurve.heavy);
  const ebenen = [<FotoEbene />, <EbeneHandlung />, <StrukturEbene />, <UnsichtbarEbene cyan={1} />];
  const dreh = -30 * z;
  return (
    <AbsoluteFill>
      <Video v="h2-papier.mp4" ab={60} />
      <Kamera dauer={78} push={0.04} rucke={[L(K.zusammen) + 16]}>
        <AbsoluteFill style={{ transform: `scale(${1 - 0.42 * insHandy}) translateY(${insHandy * 60}px)`, transformOrigin: "540px 1080px" }}>
          <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: "540px 880px" }}>
            <div style={{ position: "absolute", left: 540 - GYM.w / 2, top: 1080 - GYM.h / 2, width: GYM.w, height: GYM.h, transformStyle: "preserve-3d", transform: `scale(${0.74 + 0.16 * (1 - z)}) rotateX(${56 * z}deg) rotateZ(${dreh}deg)` }}>
              {ebenen
                .map((e, i) => {
                  const fl = flug(3 - i);
                  const [dx, dy] = richt[i];
                  return (
                    <div key={i} style={{ position: "absolute", inset: 0, transform: `translate3d(${dx * fl}px, ${dy * fl}px, ${(3 - i) * 125 * z}px)`, filter: `blur(${fl * 16}px)`, transformStyle: "preserve-3d" }}>
                      {e}
                    </div>
                  );
                })
                .reverse()}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
        {/* Handy-Rahmen wächst um die Seite */}
        {insHandy > 0 && (
          <div style={{ position: "absolute", left: 540 - 220, top: 1080 - 300 * 1.0 - 180, width: 440, height: 840, borderRadius: 64, border: `18px solid ${farben.tinte}`, boxShadow: "0 50px 90px rgba(44,30,120,.35)", opacity: insHandy, transform: `scale(${1.25 - 0.25 * insHandy})` }} />
        )}
        {[0, 1, 2].map((i) => (
          <Pille key={i} style={{ left: [620, 90, 640][i], top: [760, 1000, 1260][i], fontSize: 28, transform: `scale(${pop(f, L(K.bringen) + 14 + i * 7)}) rotate(${[4, -4, 3][i]}deg)` }}>
            <span style={{ color: farben.violett }}>●</span> Neue Anfrage
          </Pille>
        ))}
      </Kamera>
      <LichtAn start={0} />
      <Wechseltext
        size={90}
        teile={[
          { ab: 0, inhalt: <>Erst alle vier <Akzent>zusammen</Akzent> …</> },
          { ab: L(K.bringen), inhalt: <>… bringen <Akzent>Anfragen.</Akzent></> },
        ]}
      />
    </AbsoluteFill>
  );
};

// ======================================================================
// Szene 10: CTA (916–Ende)
// ======================================================================
const SzCta: React.FC = () => {
  const f = useCurrentFrame();
  const k = K.analyse - K.s10 + 2;
  return (
    <AbsoluteFill>
      <Kamera dauer={130} push={0.02} drift={3} dreh={0.2}>
        <Endkarte s={S1} start={0} cta="Schreib «Analyse»" klickAuf={k} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: schrift.mono, fontSize: 28, letterSpacing: "0.14em", color: farben.grau, opacity: tw(f, 4, 10, 0, 1) }}>WO HAKT'S BEI DIR?</div>
        <Cursor s={S1} sichtbarAb={20} pfad={[{ f: 20, x: 940, y: 1560 }, { f: k, x: 600, y: 1010, klick: true }, { f: 130, x: 640, y: 1040 }]} />
      </Kamera>
    </AbsoluteFill>
  );
};

// ======================================================================
// Gesamtschnitt
// ======================================================================
const W = 8; // Wisch-Dauer
export const VierSchichten: React.FC<{ mitMusik?: string }> = ({ mitMusik }) => {
  const f = useCurrentFrame();
  const s = (n: number) => timeline.saetze[n - 1].start;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Schriften />
      {/* 1–2 Studio → Licht an */}
      <Sequence from={0} durationInFrames={K.s3 + 8} layout="none"><SzStudio /></Sequence>
      {/* 3 Marke (Licht an aus der Mitte) */}
      <Sequence from={K.s3} durationInFrames={K.s4 - K.s3 + W} layout="none">
        <Wisch start={K.s4 - K.s3 - 2} rolle="raus"><SzMarke /></Wisch>
        <LichtAn start={0} />
      </Sequence>
      {/* 4 Struktur (Wisch rein) */}
      <Sequence from={K.s4 - 2} durationInFrames={K.s5 - K.s4 + 2} layout="none">
        <Bild v="h3-bauplan.png" />
        <Wisch start={0} rolle="rein">
          <Sequence from={2} layout="none"><SzStruktur /></Sequence>
        </Wisch>
      </Sequence>
      {/* 5 Handlung unter dem Partikel-Zerfall */}
      <Sequence from={K.s5} durationInFrames={K.s6 - K.s5} layout="none"><SzHandlung /></Sequence>
      <Sequence from={K.s5 - 2} durationInFrames={44} layout="none">
        <PartikelZerfall start={2}>
          <Sequence from={-(K.s5 - K.s4) + 2} layout="none"><SzStruktur /></Sequence>
        </PartikelZerfall>
      </Sequence>
      {/* 6 Signature: Licht aus (Satz 6) */}
      <Sequence from={K.s6} durationInFrames={K.s7 - 5 - K.s6 + W} layout="none">
        <Wisch start={K.s7 - 5 - K.s6} rolle="raus">
          <SzLichtAusEcht video="h5-gitter-b-lang.mp4" lokalAus={K.vier - K.s6} lokalSieht={K.sieht - K.s6} lokalKeiner={K.keiner - K.s6} dauer={K.s7 - K.s6} bilder={BILDER} hell={<Video v="h2-papier.mp4" ab={90} />} />
        </Wisch>
      </Sequence>
      {/* 7 Ladezeit: Hintergrund läuft weiter, Vordergrund wischt rein */}
      <Sequence from={K.s7 - 5} durationInFrames={K.s8 - K.s7 + 5 + W} layout="none">
        <Video v="h5-gitter-b-lang.mp4" ab={K.s7 - 5 - K.vier} />
        <Wisch start={K.s8 - K.s7 + 5 - 2} rolle="raus" richtung="hoch">
          <Wisch start={0} rolle="rein">
            <Sequence from={5} layout="none">
              <SzLadezeit dauer={K.s8 - K.s7} ohneHintergrund dreiBei={K.dreiSek - K.s7 + 8} fallBei={K.springen - K.s7 + 4} quelleBei={K.google - K.s7} />
            </Sequence>
          </Wisch>
        </Wisch>
      </Sequence>
      {/* 8 Lokal (von unten rein) */}
      <Sequence from={K.s8 - 2} durationInFrames={K.s9 - K.s8 + 2} layout="none">
        <Video v="h5-gitter-a.mp4" />
        <Wisch start={0} rolle="rein" richtung="hoch">
          <Sequence from={2} layout="none"><SzLokal /></Sequence>
        </Wisch>
      </Sequence>
      {/* 9 Zusammensetzen */}
      <Sequence from={K.s9} durationInFrames={K.s10 - K.s9 + 6} layout="none"><SzZusammen /></Sequence>
      {/* 10 CTA, 6 Frames Überblendung */}
      <Sequence from={K.s10} layout="none">
        <AbsoluteFill style={{ opacity: tw(f, K.s10, 6, 0, 1, kurve.fade) }}>
          <Sequence from={0} layout="none"><SzCta /></Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* ================= TON ================= */}
      <Audio src={A("stimme/stimme-gesamt.wav")} />
      {mitMusik && <Audio src={A(mitMusik)} volume={0.25} />}
      {/* Spur 1: Klicks / Pops */}
      <Ton nr="pop-05" bei={K.vier1 + 10} vol={0.25} />
      <Ton nr="pop-02" bei={K.vier1 + 15} vol={0.22} />
      <Ton nr="pop-02" bei={K.vier1 + 20} vol={0.22} />
      <Ton nr="pop-02" bei={K.vier1 + 25} vol={0.22} />
      <Ton nr="glitch-03" bei={K.nie} vol={0.25} />
      <Ton nr="pop-01" bei={K.s3 + 2} vol={0.3} />
      <Ton nr="pop-05" bei={K.marke} vol={0.3} />
      <Ton nr="pop-02" bei={K.marke + 24} vol={0.25} />
      <Ton nr="papier-01" bei={K.farben + 8} vol={0.35} />
      <Ton nr="pop-01" bei={K.farben + 18} vol={0.25} />
      <Ton nr="pop-05" bei={K.schriften + 2} vol={0.3} />
      <Ton nr="pop-05" bei={K.schriften + 8} vol={0.3} />
      <Ton nr="pop-02" bei={K.echte - 4} vol={0.3} />
      <Ton nr="schlag-07" bei={K.echte + 8} vol={0.45} />
      <Ton nr="papier-02" bei={K.echte + 22} vol={0.4} />
      <Ton nr="ratsche-16" bei={K.fuenf} vol={0.3} max={1.3} />
      <Ton nr="schreiben-01" bei={K.was} vol={0.3} />
      <Ton nr="schreiben-01" bei={K.wo} vol={0.3} />
      <Ton nr="schreiben-01" bei={K.fuerwen} vol={0.3} />
      <Ton nr="klick-03" bei={K.button + 10} vol={0.4} />
      <Ton nr="pop-03" bei={K.button + 16} vol={0.3} />
      <Ton nr="klick-03" bei={K.anklickbar + 4} vol={0.4} />
      <Ton nr="pop-02" bei={K.anklickbar + 10} vol={0.25} />
      <Ton nr="pop-02" bei={K.anklickbar + 16} vol={0.22} />
      <Ton nr="pop-02" bei={K.anklickbar + 22} vol={0.22} />
      <Ton nr="glitch-03" bei={K.vier + 3} vol={0.25} />
      <Ton nr="ratsche-19" bei={K.s7 + 6} vol={0.25} max={1.6} />
      <Ton nr="pop-04" bei={K.google} vol={0.25} />
      <Ton nr="pop-05" bei={K.lokal} vol={0.25} />
      <Ton nr="pop-05" bei={K.datenschutz - 4} vol={0.25} />
      <Ton nr="klick-02" bei={K.sauber} vol={0.45} />
      <Ton nr="pop-04" bei={K.bringen + 14} vol={0.3} />
      <Ton nr="pop-04" bei={K.bringen + 21} vol={0.28} />
      <Ton nr="pop-04" bei={K.bringen + 28} vol={0.26} />
      <Ton nr="klick-03" bei={K.analyse + 2} vol={0.45} />
      {/* Spur 2: Whooshes (1–3 Frames vor der Bewegung) */}
      <Ton nr="swish-05" bei={6} vor={2} vol={0.4} />
      <Ton nr="whoosh-03" bei={K.vier1 + 8} vor={2} vol={0.35} />
      <Ton nr="swish-02" bei={K.s2} vor={2} vol={0.35} />
      <Ton nr="glitzer-04" bei={K.s3 + 4} vol={0.35} />
      <Ton nr="swish-01" bei={K.farben + 6} vor={2} vol={0.35} />
      <Ton nr="swish-02" bei={K.s4 + 3} vor={2} vol={0.5} />
      <Ton nr="glitzer-04" bei={K.s5 + 4} vol={0.4} />
      <Ton nr="swish-05" bei={K.s5 + 8} vor={2} vol={0.3} />
      <Ton nr="swish-02" bei={K.s7} vor={2} vol={0.5} />
      <Ton nr="swish-03" bei={K.s8} vor={2} vol={0.45} />
      <Ton nr="whoosh-02" bei={K.s9 + 10} vor={2} vol={0.4} />
      <Ton nr="swish-06" bei={K.bringen + 6} vor={2} vol={0.35} />
      {/* Spur 3: Impacts */}
      <Ton nr="schlag-01" bei={K.vier1 + 4} vol={0.4} />
      <Ton nr="schlag-02" bei={K.vier} vol={0.85} max={2.5} />
      <Ton nr="schlag-01" bei={K.keiner} vol={0.45} />
      <Ton nr="ratsche-12" bei={K.zusammen + 16} vol={0.45} />
      <Ton nr="schlag-03" bei={K.zusammen + 16} vol={0.55} />
      <Ton nr="schlag-05" bei={K.s10 + 2} vol={0.35} max={2} />
    </AbsoluteFill>
  );
};
