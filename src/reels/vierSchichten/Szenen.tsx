import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, form, schrift, stimmungen } from "../../brand/solleva";
import { kurve, overshoot, tw } from "../../lib/bewegung";
import { Kamera } from "../../lib/kamera";
import { Label, Serif } from "../../components/Basis";
import { Cursor } from "../../components/Cursor";
import { Endkarte } from "../../components/Endkarte";
import { Wellen } from "../../welten/Welten";
import { GymSeite, GYM } from "./GymSeite";

// «4 Schichten» – Szenen. Jede Szene bekommt ihren lokalen Frame (0 = Satzbeginn).
// Higgsfield-Hintergründe sind hier noch Code-Platzhalter (H1–H5), siehe docs/reels/vier-schichten.md.

const S1 = stimmungen.S1;
const S2 = stimmungen.S2;

// ---------- Hintergrund-Platzhalter (später Higgsfield-Clips als unterste Ebene) ----------
export const Studio: React.FC = () => {
  const f = useCurrentFrame();
  const lx = 540 + Math.sin(f / 70) * 40;
  return (
    <AbsoluteFill style={{ background: "#05060F" }}>
      <AbsoluteFill style={{ background: `radial-gradient(700px 900px at ${lx}px 520px, rgba(169,139,255,.22), transparent 70%)` }} />
      {/* Spiegelboden */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, bottom: 0, background: "linear-gradient(180deg, #14123A 0%, #070A24 40%, #05060F 100%)" }} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 1170, height: 40, background: "radial-gradient(ellipse at 50% 50%, rgba(236,230,255,.35), transparent 70%)", filter: "blur(10px)" }} />
    </AbsoluteFill>
  );
};

export const LavendelPapier: React.FC = () => {
  const f = useCurrentFrame();
  const d = Math.sin(f / 60) * 20;
  return (
    <AbsoluteFill style={{ background: farben.lavendel }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 900px at 75% 20%, rgba(255,255,255,.9), transparent 70%)` }} />
      {/* Fensterschatten (Kreuz) */}
      <AbsoluteFill style={{ transform: `translate(${d}px,0) rotate(-24deg) scale(1.6)`, filter: "blur(26px)", opacity: 0.22 }}>
        <div style={{ position: "absolute", left: 300, top: -200, width: 70, height: 2600, background: farben.violett }} />
        <div style={{ position: "absolute", left: 760, top: -200, width: 70, height: 2600, background: farben.violett }} />
        <div style={{ position: "absolute", left: -400, top: 900, width: 2200, height: 70, background: farben.violett }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Bauplan: React.FC = () => (
  <AbsoluteFill style={{ background: farben.papier }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${farben.grauLinie} 1.5px, transparent 1.5px), linear-gradient(90deg, ${farben.grauLinie} 1.5px, transparent 1.5px)`, backgroundSize: "40px 40px" }} />
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(108,63,212,.18) 2px, transparent 2px), linear-gradient(90deg, rgba(108,63,212,.18) 2px, transparent 2px)`, backgroundSize: "200px 200px" }} />
  </AbsoluteFill>
);

export const NeonGitter: React.FC<{ an?: number }> = ({ an = 1 }) => {
  const f = useCurrentFrame();
  const off = (f * 3) % 80;
  const h: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const z = (i * 80 + off) / 1280; // 0..1 Tiefe
    const y = 1100 + Math.pow(z, 2.2) * 820;
    h.push(<line key={`h${i}`} x1={0} x2={1080} y1={y} y2={y} stroke={farben.lavendelAkzent} strokeWidth={1 + z * 3} opacity={0.15 + z * 0.8} />);
  }
  const v: React.ReactNode[] = [];
  for (let i = -12; i <= 12; i++) v.push(<line key={`v${i}`} x1={540 + i * 22} y1={1100} x2={540 + i * 220} y2={1920} stroke={farben.lavendelAkzent} strokeWidth={2} opacity={0.6} />);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 700px at 50% 1100px, #2A1670 0%, ${farben.nacht} 60%)`, opacity: an }}>
      <svg width={1080} height={1920} style={{ position: "absolute", filter: `drop-shadow(0 0 6px ${farben.violett})` }}>
        {h}
        {v}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, height: 90, background: `radial-gradient(ellipse at 50% 50%, rgba(169,139,255,.55), transparent 70%)`, filter: "blur(18px)" }} />
    </AbsoluteFill>
  );
};

// ---------- Typo ----------
export const Satz: React.FC<{ dunkel?: boolean; y?: number; size?: number; children: React.ReactNode; start?: number }> = ({ dunkel, y = 260, size = 92, children, start = 0 }) => {
  const f = useCurrentFrame();
  const p = tw(f, start, 14, 0, 1, kurve.land);
  return (
    <div style={{ position: "absolute", left: 70, right: 140, top: y, fontFamily: schrift.text, fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: "-0.02em", color: dunkel ? farben.papier : farben.tinte, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
      {children}
    </div>
  );
};
export const Akzent: React.FC<{ children: React.ReactNode; dunkel?: boolean }> = ({ children, dunkel }) => (
  <Serif s={dunkel ? S2 : S1} style={{ color: dunkel ? farben.lavendelAkzent : farben.violett, fontSize: "1.12em", textShadow: dunkel ? `0 0 24px ${farben.violett}` : undefined }}>
    {children}
  </Serif>
);

// ---------- 3D-Stapel ----------
export const Stapel: React.FC<{ ebenen: React.ReactNode[]; spreiz: number; drehZ?: number; kipp?: number; skala?: number; y?: number; reflex?: boolean }> = ({
  ebenen, spreiz, drehZ = -32, kipp = 56, skala = 0.9, y = 760, reflex,
}) => {
  const inner = (
    <div style={{ position: "absolute", left: 540 - GYM.w / 2, top: y - GYM.h / 2, width: GYM.w, height: GYM.h, transformStyle: "preserve-3d", transform: `scale(${skala}) rotateX(${kipp}deg) rotateZ(${drehZ}deg)` }}>
      {ebenen
        .map((e, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${(ebenen.length - 1 - i) * spreiz}px)`, transformStyle: "preserve-3d" }}>
            {e}
          </div>
        ))
        .reverse()}
    </div>
  );
  return (
    <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: `540px ${y - 200}px` }}>
      {inner}
      {reflex && (
        <AbsoluteFill style={{ transform: `translateY(${(y + 330) * 2 - 1920}px) scaleY(-1)`, opacity: 0.14, filter: "blur(3px)", maskImage: "linear-gradient(0deg, black 0%, transparent 35%)", WebkitMaskImage: "linear-gradient(0deg, black 0%, transparent 35%)" }}>
          {inner}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Die vier Schichten als Ebenen-Inhalte
export const glas = (dunkel: boolean): React.CSSProperties => ({
  position: "absolute", inset: 0, borderRadius: 30,
  background: dunkel ? "rgba(17,20,58,.55)" : "rgba(255,255,255,.55)",
  border: `2px solid ${dunkel ? farben.lavendelAkzent : farben.rand}`,
  boxShadow: dunkel ? `0 0 30px rgba(108,63,212,.6), inset 0 0 40px rgba(169,139,255,.25)` : "0 30px 70px rgba(44,30,120,.25)",
  backdropFilter: "blur(6px)",
});
export const EbeneMarke: React.FC = () => (
  <div style={{ ...glas(false), background: farben.weiss }}>
    {[farben.tinte, farben.papier, farben.violett].map((c, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + i * 190, top: 60, width: 170, height: 240, borderRadius: 20, background: c, border: `1.5px solid ${farben.rand}` }} />
    ))}
    <div style={{ position: "absolute", left: 40, top: 360, fontFamily: schrift.text, fontWeight: 800, fontSize: 160, color: farben.tinte }}>Aa</div>
    <div style={{ position: "absolute", left: 330, top: 380, fontFamily: schrift.serif, fontStyle: "italic", fontSize: 160, color: farben.violett }}>Aa</div>
  </div>
);
export const EbeneStruktur: React.FC = () => (
  <div style={{ ...glas(false), background: farben.papier }}>
    <GymSeite m="bauplan" />
  </div>
);
export const EbeneHandlung: React.FC = () => (
  <div style={{ ...glas(false), background: "rgba(236,230,255,.9)" }}>
    <div style={{ position: "absolute", left: 120, top: 400, width: 400, height: 110, borderRadius: 55, background: farben.violett, color: "#fff", fontFamily: schrift.text, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>Probetraining</div>
  </div>
);
export const EbeneUnsichtbar: React.FC<{ sichtbar?: number }> = ({ sichtbar = 1 }) => (
  <div style={{ ...glas(true), opacity: sichtbar, borderStyle: "dashed" }} />
);

// ===================== Szenen =====================

/** 1 Hook: «Jede gute Website hat vier Schichten.» – Studio, Stapel fächert auf, Ebenen zählen 1–4. */
export const SzHook: React.FC<{ dauer?: number }> = ({ dauer = 75 }) => {
  const f = useCurrentFrame();
  const spreiz = tw(f, 18, 26, 6, 120, kurve.heavy);
  const dreh = -32 + Math.sin(f / 40) * 6 + tw(f, 0, dauer, -10, 0, kurve.heavy);
  return (
    <AbsoluteFill>
      <Studio />
      <Kamera dauer={dauer} push={0.05}>
        <Stapel ebenen={[<div style={{ ...glas(false), overflow: "hidden" }}><GymSeite /></div>, <EbeneHandlung />, <EbeneStruktur />, <EbeneMarke />]} spreiz={spreiz} drehZ={dreh} reflex y={1080} skala={0.78} />
        {[1, 2, 3, 4].map((n, i) => {
          const st = 30 + i * 6;
          const o = tw(f, st, 8, 0, 1, kurve.land);
          return <div key={n} style={{ position: "absolute", left: 850, top: 1330 - i * 96, fontFamily: schrift.mono, fontSize: 30, color: farben.lavendelAkzent, opacity: o, letterSpacing: "0.14em" }}>— 0{n}</div>;
        })}
      </Kamera>
      <Satz dunkel y={250}>
        Jede gute Website hat <Akzent dunkel>vier</Akzent> Schichten.
      </Satz>
    </AbsoluteFill>
  );
};

/** 2 «Die wichtigste siehst du nie.» – unterste Ebene flackert gestrichelt, Fragezeichen. */
export const SzNie: React.FC<{ dauer?: number }> = ({ dauer = 60 }) => {
  const f = useCurrentFrame();
  const flacker = 0.35 + 0.65 * Math.abs(Math.sin(f / 3.2)) * (f % 11 < 2 ? 0.2 : 1);
  return (
    <AbsoluteFill>
      <Studio />
      <Kamera dauer={dauer} push={0.06} rucke={[18]}>
        <Stapel ebenen={[<div style={{ ...glas(false), overflow: "hidden" }}><GymSeite /></div>, <EbeneHandlung />, <EbeneStruktur />, <EbeneUnsichtbar sichtbar={flacker} />]} spreiz={120} drehZ={-28 + Math.sin(f / 40) * 4} reflex y={1080} skala={0.78} />
        <div style={{ position: "absolute", left: 780, top: 1330, fontFamily: schrift.serif, fontStyle: "italic", fontSize: 140, color: farben.lavendelAkzent, opacity: tw(f, 16, 10, 0, 1), textShadow: `0 0 30px ${farben.violett}` }}>?</div>
      </Kamera>
      <Satz dunkel y={250}>
        Die wichtigste siehst du <Akzent dunkel>nie.</Akzent>
      </Satz>
    </AbsoluteFill>
  );
};

/** 3 Schicht 1 Marke: «Eins: die Marke. Zwei Farben, zwei Schriften, echte Bilder.» */
export const SzMarke: React.FC<{ dauer?: number }> = ({ dauer = 100 }) => {
  const f = useCurrentFrame();
  const karten = [
    { c: farben.tinte, n: "Haupt", hex: "#14123A", pct: "60", t: farben.papier },
    { c: farben.papier, n: "Neutral", hex: "#F6F5FC", pct: "30", t: farben.tinte },
    { c: farben.violett, n: "Akzent", hex: "#6C3FD4", pct: "10", t: farben.papier },
  ];
  const stock = tw(f, 62, 8, 0, 1, kurve.whip);
  return (
    <AbsoluteFill>
      <LavendelPapier />
      <Kamera dauer={dauer} push={0.04}>
        {/* Farbkarten fächern auf */}
        {karten.map((k, i) => {
          const p = tw(f, 6 + i * 5, 18, 0, 1, kurve.heavy);
          const rot = (i - 1) * 14 * p;
          return (
            <div key={i} style={{ position: "absolute", left: 340, top: 600, width: 400, height: 560, borderRadius: 28, background: k.c, border: `1.5px solid ${farben.rand}`, boxShadow: form.schatten, transformOrigin: "50% 120%", transform: `rotate(${rot}deg) translateX(${(i - 1) * 60 * p}px)`, padding: 34, boxSizing: "border-box", fontFamily: schrift.text, color: k.t }}>
              <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1 }}>{k.pct}<span style={{ fontSize: 44 }}>%</span></div>
              <div style={{ position: "absolute", left: 34, bottom: 34, fontWeight: 700, fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase" }}>{k.n}</div>
              <div style={{ position: "absolute", left: 34, bottom: 78, fontFamily: schrift.mono, fontSize: 24, opacity: 0.8 }}>{k.hex}</div>
            </div>
          );
        })}
        {/* Logo: gross, winzig, hell/dunkel */}
        <div style={{ position: "absolute", left: 90, top: 1290, display: "flex", gap: 26, alignItems: "center", opacity: tw(f, 30, 10, 0, 1) }}>
          <div style={{ padding: "22px 30px", borderRadius: 22, background: farben.weiss, fontFamily: schrift.text, fontWeight: 800, fontSize: 40, color: farben.tinte, boxShadow: form.schatten }}>DEIN GYM<span style={{ color: farben.violett }}>.</span></div>
          <div style={{ padding: "22px 30px", borderRadius: 22, background: farben.tinte, fontFamily: schrift.text, fontWeight: 800, fontSize: 40, color: farben.papier }}>DEIN GYM<span style={{ color: farben.lavendelAkzent }}>.</span></div>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: farben.tinte, color: farben.papier, fontFamily: schrift.text, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>G</div>
        </div>
        {/* Stock-Foto wird abgestempelt (Humor) */}
        <div style={{ position: "absolute", left: 620, top: 1300, width: 330, height: 230, borderRadius: 20, background: "linear-gradient(135deg,#D5D1E9,#ffffff)", border: `1.5px solid ${farben.rand}`, transform: `rotate(6deg)`, opacity: tw(f, 50, 8, 0, 1), overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schrift.text, fontSize: 26, color: farben.grau }}>😁 Stock-Lächeln</div>
          <div style={{ position: "absolute", left: 20, top: 70, padding: "10px 20px", border: `5px solid ${farben.violett}`, color: farben.violett, fontFamily: schrift.text, fontWeight: 800, fontSize: 44, letterSpacing: "0.1em", transform: `rotate(-14deg) scale(${2 - stock})`, opacity: stock, borderRadius: 10 }}>NEIN, DANKE</div>
        </div>
      </Kamera>
      <Label s={S1} text="// 01 Marke" x={70} y={230} />
      <Satz y={290} size={84}>
        Zwei Farben, zwei Schriften, <Akzent>echte</Akzent> Bilder.
      </Satz>
    </AbsoluteFill>
  );
};

/** 4 Schicht 2 Struktur: Website halb fertig / halb Bauplan mit Beschriftungslinien. */
export const SzStruktur: React.FC<{ dauer?: number }> = ({ dauer = 100 }) => {
  const f = useCurrentFrame();
  const split = tw(f, 4, 30, 0, 0.5, kurve.heavy);
  const beschr = [
    { t: "BOTSCHAFT: WAS · WO · FÜR WEN", y: 330, x: 520 },
    { t: "MENÜ: MAX. 5", y: 40, x: 600 },
    { t: "LEISTUNGEN AUF EINEN BLICK", y: 550, x: 620 },
    { t: "GESICHT / TEAM", y: 720, x: 300 },
    { t: "BEWERTUNGEN", y: 765, x: 520 },
  ];
  const sx = 70, sy = 640, sk = 0.9;
  return (
    <AbsoluteFill>
      <Bauplan />
      <Kamera dauer={dauer} push={0.04}>
        <div style={{ position: "absolute", left: sx, top: sy, transform: `scale(${sk})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", width: GYM.w, height: GYM.h, borderRadius: 30, boxShadow: form.schatten }} />
          <div style={{ position: "absolute", width: GYM.w, height: GYM.h, clipPath: `inset(0 ${(1 - (1 - split)) * 100}% 0 0)` }}><GymSeite /></div>
          <div style={{ position: "absolute", width: GYM.w, height: GYM.h, clipPath: `inset(0 0 0 ${(1 - split) * 100}%)` }}><GymSeite m="bauplan" /></div>
          <div style={{ position: "absolute", left: GYM.w * (1 - split) - 1, top: -30, width: 3, height: GYM.h + 60, background: farben.violett, opacity: split > 0.01 ? 1 : 0 }} />
        </div>
        {beschr.map((b, i) => {
          const st = 26 + i * 8;
          const l = tw(f, st, 12, 0, 1, kurve.heavy);
          const ax = sx + b.x * sk, ay = sy + b.y * sk;
          const ex = 770, ey = 600 + i * 160;
          return (
            <React.Fragment key={i}>
              <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
                <circle cx={ax} cy={ay} r={6 * l} fill={farben.violett} />
                <polyline points={`${ax},${ay} ${ax + (ex - 40 - ax) * l},${ay + (ey - ay) * l} ${ex - 40 + 40 * l},${ey}`} fill="none" stroke={farben.violett} strokeWidth={2} />
              </svg>
              <div style={{ position: "absolute", left: ex + 10, top: ey - 14, width: 160, fontFamily: schrift.mono, fontSize: 18, lineHeight: 1.25, color: farben.tinte, letterSpacing: "0.06em", opacity: tw(f, st + 8, 8, 0, 1) }}>{b.t}</div>
            </React.Fragment>
          );
        })}
        {/* 5-Sekunden-Uhr */}
        <div style={{ position: "absolute", left: 70, top: 520, padding: "12px 22px", borderRadius: 40, background: farben.tinte, color: farben.papier, fontFamily: schrift.mono, fontSize: 30, transform: `scale(${f >= 10 ? overshoot(f, 10, 12) : 0})` }}>
          0:0{Math.min(5, Math.max(0, Math.floor((f - 10) / 12)))}
        </div>
      </Kamera>
      <Label s={S1} text="// 02 Struktur" x={70} y={230} />
      <Satz y={290} size={80}>
        In <Akzent>fünf Sekunden</Akzent> klar: was, wo, für wen.
      </Satz>
    </AbsoluteFill>
  );
};

/** 5 Schicht 3 Handlung: Cursor klickt Button und Nummer. Lavendel-Wellen + Bloom. */
export const SzHandlung: React.FC<{ dauer?: number }> = ({ dauer = 90 }) => {
  const f = useCurrentFrame();
  const klick1 = 30, klick2 = 62;
  const anruf = tw(f, klick2, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <Wellen a={"#DCD2FF"} b={farben.lavendel} zentrum={{ x: 540, y: 1100 }} />
      <AbsoluteFill style={{ background: `radial-gradient(700px 600px at 540px 1050px, rgba(255,255,255,.85), transparent 70%)` }} />
      <Kamera dauer={dauer} push={0.05} rucke={[klick1, klick2]}>
        {/* Handy mit Seite */}
        <div style={{ position: "absolute", left: 300, top: 620, width: 480, height: 960, borderRadius: 64, background: farben.tinte, padding: 16, boxSizing: "border-box", boxShadow: "0 50px 90px rgba(44,30,120,.35)" }}>
          <div style={{ width: 448, height: 928, borderRadius: 50, overflow: "hidden", background: farben.weiss, position: "relative" }}>
            <div style={{ transform: "scale(0.7)", transformOrigin: "0 0" }}><GymSeite /></div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 120, height: 92, borderRadius: 46, background: farben.violett, color: "#fff", fontFamily: schrift.text, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f > klick1 && f < klick1 + 8 ? 0.95 : 1})`, boxShadow: `0 0 ${f > klick1 ? 40 : 0}px ${farben.lavendelAkzent}` }}>Probetraining buchen</div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 30, height: 70, borderRadius: 35, border: `2px solid ${farben.violett}`, color: farben.violett, fontFamily: schrift.text, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", background: anruf > 0 ? `rgba(108,63,212,${0.12 * anruf})` : undefined }}>📞 062 000 00 00</div>
          </div>
        </div>
        {/* Öffnungszeiten + Karte ploppen raus */}
        <div style={{ position: "absolute", left: 70, top: 900, padding: "20px 26px", borderRadius: 24, background: farben.weiss, boxShadow: form.schatten, fontFamily: schrift.text, transform: `scale(${f >= 70 ? overshoot(f, 70, 12) : 0}) rotate(-4deg)` }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.12em", color: farben.grau }}>HEUTE GEÖFFNET</div>
          <div style={{ fontWeight: 800, fontSize: 34, color: farben.tinte }}>6–22 Uhr</div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 760, padding: "20px 26px", borderRadius: 24, background: farben.weiss, boxShadow: form.schatten, fontFamily: schrift.text, transform: `scale(${f >= 76 ? overshoot(f, 76, 12) : 0}) rotate(5deg)` }}>
          <div style={{ fontWeight: 800, fontSize: 34, color: farben.violett }}>📍 Olten</div>
          <div style={{ fontWeight: 500, fontSize: 22, color: farben.grau }}>Route starten</div>
        </div>
        <Cursor s={S1} pfad={[{ f: 0, x: 980, y: 1700 }, { f: klick1, x: 560, y: 1390, klick: true }, { f: 50, x: 600, y: 1400 }, { f: klick2, x: 560, y: 1490, klick: true }, { f: dauer, x: 600, y: 1520 }]} />
      </Kamera>
      <Label s={S1} text="// 03 Handlung" x={70} y={230} />
      <Satz y={290} size={84}>
        Ein Haupt-Button. Die Nummer <Akzent>anklickbar.</Akzent>
      </Satz>
    </AbsoluteFill>
  );
};

/** 6 SIGNATURE: «Und vier … sieht keiner.» Licht schlagartig aus → Neon-Gitter, Seite als Drahtgitter. */
export const SzLichtAus: React.FC<{ dauer?: number; aus?: number }> = ({ dauer = 75, aus = 8 }) => {
  const f = useCurrentFrame();
  const dunkel = f >= aus;
  const blitz = f >= aus && f < aus + 3 ? 1 - (f - aus) / 3 : 0;
  const gitterAn = tw(f, aus + 4, 14, 0, 1, kurve.land);
  const draht = tw(f, aus + 2, 10, 0, 1, kurve.fade);
  const dreh = -30 + Math.sin(f / 50) * 5;
  return (
    <AbsoluteFill>
      {!dunkel && <LavendelPapier />}
      {dunkel && <AbsoluteFill style={{ background: farben.nacht }} />}
      {dunkel && <NeonGitter an={gitterAn} />}
      <Kamera dauer={dauer} push={0.07} rucke={[aus]}>
        {!dunkel && <Stapel ebenen={[<div style={{ ...glas(false), overflow: "hidden" }}><GymSeite /></div>]} spreiz={0} drehZ={dreh} y={860} />}
        {dunkel && (
          <div style={{ opacity: draht }}>
            <Stapel ebenen={[<GymSeite m="draht" />, <EbeneUnsichtbar />]} spreiz={140} drehZ={dreh} y={860} skala={0.95} />
          </div>
        )}
      </Kamera>
      <AbsoluteFill style={{ background: "#fff", opacity: blitz * 0.0 }} />
      <AbsoluteFill style={{ background: farben.nacht, opacity: f >= aus && f < aus + 2 ? 1 : 0 }} />
      <Label s={dunkel ? S2 : S1} text="// 04 Das Unsichtbare" x={70} y={230} />
      <Satz dunkel={dunkel} y={290} size={96}>
        Und vier … sieht <Akzent dunkel={dunkel}>keiner.</Akzent>
      </Satz>
    </AbsoluteFill>
  );
};

/** 7 «Lädt sie auf dem Handy über drei Sekunden, springen laut Google viele ab.» */
export const SzLadezeit: React.FC<{ dauer?: number; ohneHintergrund?: boolean; dreiBei?: number; fallBei?: number; quelleBei?: number }> = ({ dauer = 110, ohneHintergrund, dreiBei = 53, fallBei = 60, quelleBei = 0 }) => {
  const f = useCurrentFrame();
  const sek = f < dreiBei ? tw(f, 4, dreiBei - 4, 0, 3, kurve.linear) : Math.min(3.6, 3 + (f - dreiBei) * 0.012);
  const ueber = sek >= 3;
  const punkte = Array.from({ length: 14 }, (_, i) => {
    const fall = tw(f, fallBei + (i % 7) * 3, 22, 0, 1, (t) => t * t);
    const bleibt = i % 5 === 0;
    return (
      <div key={i} style={{ position: "absolute", left: 120 + (i % 7) * 130, top: 1420 + Math.floor(i / 7) * 80 + (bleibt ? 0 : fall * 600), width: 44, height: 44, borderRadius: 22, background: bleibt ? farben.cyan : farben.lavendelAkzent, opacity: bleibt ? 1 : 1 - fall * 0.8, boxShadow: `0 0 16px ${farben.violett}` }} />
    );
  });
  return (
    <AbsoluteFill>
      {!ohneHintergrund && <NeonGitter />}
      <Kamera dauer={dauer} push={0.05}>
        {/* Glas-Handy mit Drahtgitter-Seite und Ladebalken */}
        <div style={{ position: "absolute", left: 330, top: 560, width: 420, height: 800, borderRadius: 60, border: `3px solid ${farben.lavendelAkzent}`, background: "rgba(17,20,58,.5)", boxShadow: `0 0 40px ${farben.violett}, inset 0 0 40px rgba(169,139,255,.3)`, overflow: "hidden" }}>
          <div style={{ transform: "scale(0.6)", transformOrigin: "10px 40px", opacity: 0.6 }}><GymSeite m="draht" /></div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 360, height: 14, borderRadius: 7, background: "rgba(169,139,255,.2)" }}>
            <div style={{ width: `${Math.min(1, sek / 3.4) * 100}%`, height: "100%", borderRadius: 7, background: ueber ? "#FF8FB1" : farben.cyan, boxShadow: `0 0 12px ${farben.cyan}` }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: schrift.mono, fontSize: 64, color: farben.papier, textShadow: `0 0 20px ${farben.violett}` }}>{sek.toFixed(1).replace(".", ",")} s</div>
        </div>
        {punkte}
        <div style={{ position: "absolute", left: 70, top: 1290, padding: "10px 18px", borderRadius: 14, border: `1.5px solid #3A3D6B`, background: "rgba(17,20,58,.7)", fontFamily: schrift.mono, fontSize: 24, color: "#9CA0D8", letterSpacing: "0.1em", opacity: tw(f, quelleBei, 8, 0, 1), transform: `scale(${f >= quelleBei ? overshoot(f, quelleBei, 10) : 0.8})` }}>QUELLE: GOOGLE</div>
      </Kamera>
      <Label s={S2} text="// 04 Ladezeit · Mobile zuerst" x={70} y={230} />
      <Satz dunkel y={290} size={74}>
        Lädt sie auf dem Handy über <Akzent dunkel>drei Sekunden,</Akzent> springen laut Google viele ab.
      </Satz>
    </AbsoluteFill>
  );
};

/** 8 «Dazu: lokal gefunden werden und Datenschutz sauber.» – Glas-Ebenen: Pin/Profil, Schloss revDSG. */
export const SzLokal: React.FC<{ dauer?: number }> = ({ dauer = 80 }) => {
  const f = useCurrentFrame();
  const ebene = (i: number, inhalt: React.ReactNode) => {
    const p = tw(f, 4 + i * 12, 18, 0, 1, kurve.heavy);
    return (
      <div style={{ position: "absolute", left: 160, top: 1260 - i * 260 - p * 40, width: 760, height: 360, borderRadius: 36, background: "rgba(17,20,58,.55)", border: `2px solid ${farben.lavendelAkzent}`, boxShadow: `0 0 30px rgba(108,63,212,.6), inset 0 0 40px rgba(169,139,255,.25)`, transform: `perspective(1600px) rotateX(${50 - p * 8}deg) translateY(${(1 - p) * 400}px)`, opacity: p, fontFamily: schrift.text, color: farben.papier, padding: 40, boxSizing: "border-box" }}>
        {inhalt}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <NeonGitter />
      <Kamera dauer={dauer} push={0.05}>
        {ebene(0, <><div style={{ fontFamily: schrift.mono, fontSize: 24, color: farben.cyan, letterSpacing: "0.14em" }}>MOBILE ZUERST</div><div style={{ fontWeight: 800, fontSize: 56 }}>📱 Handy-Ansicht</div></>)}
        {ebene(1, <><div style={{ fontFamily: schrift.mono, fontSize: 24, color: farben.cyan, letterSpacing: "0.14em" }}>LOKALES SEO + PROFIL</div><div style={{ fontWeight: 800, fontSize: 56 }}>📍 Gym in Olten <span style={{ color: farben.gold, fontSize: 40 }}>★★★★★</span></div></>)}
        {ebene(2, <><div style={{ fontFamily: schrift.mono, fontSize: 24, color: farben.cyan, letterSpacing: "0.14em" }}>IMPRESSUM · DATENSCHUTZ</div><div style={{ fontWeight: 800, fontSize: 56 }}>🔒 revDSG</div></>)}
      </Kamera>
      <Label s={S2} text="// 04 Lokal · Datenschutz" x={70} y={230} />
      <Satz dunkel y={290} size={84}>
        Dazu: lokal <Akzent dunkel>gefunden</Akzent> werden. Datenschutz sauber.
      </Satz>
    </AbsoluteFill>
  );
};

/** 9 Finale: «Erst alle vier zusammen bringen Anfragen.» Ebenen rasten ein → flache Desktop-Seite, Licht an. */
export const SzZusammen: React.FC<{ dauer?: number }> = ({ dauer = 80 }) => {
  const f = useCurrentFrame();
  const z = tw(f, 0, 26, 1, 0, kurve.heavy); // 1 = gespreizt, 0 = flach
  const hell = tw(f, 22, 10, 0, 1, kurve.fade);
  return (
    <AbsoluteFill>
      <NeonGitter />
      <AbsoluteFill style={{ opacity: hell }}><LavendelPapier /></AbsoluteFill>
      <Kamera dauer={dauer} push={0.04} rucke={[26]}>
        <Stapel ebenen={[<div style={{ ...glas(false), overflow: "hidden" }}><GymSeite /></div>, <EbeneHandlung />, <EbeneStruktur />, <EbeneMarke />]} spreiz={140 * z} drehZ={-30 * z} kipp={56 * z} skala={0.78 + 0.1 * (1 - z)} y={1080} />
      </Kamera>
      <Satz dunkel={hell < 0.5} y={290} size={92}>
        Erst alle vier <Akzent dunkel={hell < 0.5}>zusammen</Akzent> bringen Anfragen.
      </Satz>
    </AbsoluteFill>
  );
};

/** 10 CTA */
export const SzCta: React.FC = () => <Endkarte s={S1} start={0} cta="Schreib «Analyse»" klickAuf={40} />;

export const szenen = [SzHook, SzNie, SzMarke, SzStruktur, SzHandlung, SzLichtAus, SzLadezeit, SzLokal, SzZusammen, SzCta];
// Frame, auf dem das Storyboard-Standbild jeder Szene liegt
export const boardFrames = [60, 40, 80, 80, 72, 50, 90, 70, 60, 50];
