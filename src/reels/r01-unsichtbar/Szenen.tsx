// Reel 01 «Unsichtbar»: Szenen in absoluten Reel-Frames (Timing aus timeline.json).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { farben, schrift } from "../../brand/solleva";
import { Kamera, Ton } from "../../lib/kamera";
import { kurve, overshoot, tw } from "../../lib/bewegung";
import { Ergebnis, Gesperrt, Gross, MeshHell } from "./Teile";
import timeline from "./timeline.json";

export const T = timeline;
export const satz = (n: number) => T.saetze[n - 1] as (typeof T.saetze)[number] & { woerter?: Record<string, number> };
const w = (n: number, wort: string) => (satz(n).woerter as Record<string, number>)[wort];

// ---------- Stimme: jeder Satz getrimmt an seiner Timeline-Position ----------
export const Stimme: React.FC<{ nur?: number[] }> = ({ nur }) => (
  <>
    {T.saetze
      .filter((s) => !nur || nur.includes(s.satz))
      .map((s) => (
        <Sequence key={s.satz} from={s.start} durationInFrames={s.dauer + 6} layout="none">
          <Audio src={staticFile(s.datei)} startFrom={Math.round(s.von * 30)} volume={1} />
        </Sequence>
      ))}
  </>
);

// ---------- X21 Apple-Wort: erscheint aus Unschärfe (5 Frames), geht in umgekehrter Reihenfolge ----------
export const Wort: React.FC<{ bei: number; weg?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  bei,
  weg,
  children,
  style,
}) => {
  const F = useCurrentFrame();
  const rein = tw(F, bei - 1, 6, 0, 1, kurve.land);
  const raus = weg ? tw(F, weg, 4, 0, 1, kurve.raus) : 0;
  const o = rein * (1 - raus);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: o,
        filter: `blur(${(1 - rein) * 10 + raus * 8}px)`,
        transform: `translateY(${(1 - rein) * 14 - raus * 10}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// ---------- Hintergrund-Foto mit Licht-Schleier oben (Text bleibt lesbar) ----------
const KieselFeld: React.FC<{ scale: number; y?: number; schleier?: number; spot?: number }> = ({ scale, y = 0, schleier = 1, spot = 0 }) => (
  <AbsoluteFill>
    <Img
      src={staticFile("r01/a/kiesel-feld-a.jpg")}
      style={{ width: 1080, height: 1920, objectFit: "cover", transform: `translateY(${y}px) scale(${scale})`, transformOrigin: "50% 60%" }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${farben.papier} 0%, rgba(246,245,252,.92) 22%, rgba(246,245,252,.35) 45%, rgba(236,230,255,0) 62%)`,
        opacity: schleier,
      }}
    />
    {/* Bühne für das Anheben: Rand dunkler, Mitte im Licht */}
    <AbsoluteFill
      style={{
        opacity: spot,
        background:
          "radial-gradient(560px 700px at 50% 60%, rgba(255,255,255,.0), rgba(236,230,255,.20) 55%, rgba(108,63,212,.16) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        opacity: spot * 0.9,
        background: "linear-gradient(180deg, rgba(255,255,255,.0) 0%, rgba(255,255,255,.55) 40%, rgba(255,255,255,0) 75%)",
        clipPath: "polygon(38% 0, 62% 0, 74% 100%, 26% 100%)",
        filter: "blur(30px)",
      }}
    />
  </AbsoluteFill>
);

// ---------- Satz 5 (nur Ausklang für den Stiltest) ----------
export const Szene5Ausklang: React.FC = () => {
  const F = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MeshHell t={F} />
      <Kamera dauer={60} seed={5}>
        <Gesperrt style={{ position: "absolute", left: 90, top: 330 }}>Dabei machst du</Gesperrt>
        <div style={{ position: "absolute", left: 90, top: 360, fontFamily: schrift.serif, fontStyle: "italic", fontSize: 260, color: farben.violett }}>gute</div>
        <Gross size={220} style={{ position: "absolute", left: 330, top: 560 }}>Arbeit.</Gross>
      </Kamera>
    </AbsoluteFill>
  );
};

// ---------- Satz 6: «Nur sieht sie keiner.» Karte versinkt in der Masse ----------
export const Szene6: React.FC = () => {
  const F = useCurrentFrame();
  const s = satz(6);
  const k = w(6, "keiner");
  const ende = satz(7).start;
  // Feld zieht langsam auf, beim Satzende Push nach unten (Übergang in Satz 7)
  const feldScale = tw(F, s.start - 6, 40, 1.14, 1.06, kurve.heavy) + tw(F, ende - 6, 10, 0, 0.05, kurve.whip);
  // Karte: schwebt, auf «keiner» versinkt sie
  const sink = tw(F, k - 2, 16, 0, 1, kurve.raus);
  const landung = s.start + 5;
  const fall = tw(F, s.start - 2, 7, -520, 0, kurve.land);
  const kartY = 980 + fall + Math.sin(F / 9) * 6 + sink * 300;
  // «KEINER.»: Slam mit Overshoot
  const slam = overshoot(F, k, 8, 1.04);
  const keinerScale = 1.3 - 0.3 * slam;
  const keinerO = tw(F, k, 3, 0, 1, kurve.fade);
  const raus = tw(F, ende - 4, 6, 0, 1, kurve.raus);
  return (
    <AbsoluteFill>
      <KieselFeld scale={feldScale} />
      <Kamera dauer={s.dauer + 10} seed={6} rucke={[k]}>
        <div style={{ opacity: 1 - raus, transform: `translateY(${-raus * 120}px)`, filter: `blur(${raus * 10}px)` }}>
          <Gesperrt size={50} style={{ position: "absolute", left: 90, top: 310 }}>
            <Wort bei={w(6, "Nur")}>Nur</Wort> <Wort bei={w(6, "sieht")}>sieht</Wort> <Wort bei={w(6, "sie")}>sie</Wort>
          </Gesperrt>
          <Gross
            size={300}
            style={{
              position: "absolute",
              left: 70,
              top: 390,
              opacity: keinerO,
              transform: `scale(${keinerScale})`,
              transformOrigin: "20% 60%",
              filter: `blur(${(1 - keinerO) * 12}px)`,
            }}
          >
            Keiner.
          </Gross>
        </div>
        <div
          style={{
            position: "absolute",
            left: 270,
            top: kartY,
            opacity: tw(F, s.start - 2, 3, 0, 1, kurve.fade) * (1 - sink),
            transform: `scale(${1 - sink * 0.35}) rotate(${-4 - sink * 8}deg)`,
            filter: `blur(${sink * 8}px)`,
          }}
        >
          <Ergebnis y={0} x={0} w={540} titel="Deine Firma" />
        </div>
      </Kamera>
      <Ton nr="swish-02" bei={landung} vor={3} vol={0.3} />
      <Ton nr="papier-04" bei={landung} vol={0.35} />
      <Ton nr="swish-03" bei={k} vor={2} vol={0.35} />
      <Ton nr="schlag-01" bei={k} vol={0.55} />
      <Ton nr="papier-02" bei={k + 6} vol={0.25} />
    </AbsoluteFill>
  );
};

// ---------- Satz 7: «Solleva heisst: heb an.» Signature-Moment ----------
const Funken: React.FC<{ bei: number; cx: number; cy: number }> = ({ bei, cx, cy }) => {
  const F = useCurrentFrame();
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const p = tw(F, bei + (i % 3), 18, 0, 1, kurve.land);
        const a = (i / 6) * Math.PI * 2 + 0.4;
        const r = 120 + p * (140 + (i % 2) * 60);
        const o = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * r - 7,
              top: cy + Math.sin(a) * r - 7,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: i % 2 ? farben.lavendelAkzent : "#fff",
              boxShadow: `0 0 18px ${farben.lavendelAkzent}`,
              opacity: o,
            }}
          />
        );
      })}
    </>
  );
};

export const Szene7: React.FC = () => {
  const F = useCurrentFrame();
  const s = satz(7);
  const heb = w(7, "heb");
  const an = w(7, "an");
  const ende = satz(8).start;

  // Pille: Dynamic Island (dunkel, klein) wächst zur Glas-Pille (Apple-Ref 5,9–6,3 s: ~8 Frames, Overshoot)
  const p0 = s.start - 2;
  const grow = overshoot(F, p0 + 3, 10, 1.03);
  const pw = 230 + (900 - 230) * grow;
  const ph = 66 + (200 - 66) * grow;
  const glas = tw(F, p0 + 4, 7, 0, 1, kurve.fade);
  const pO = tw(F, p0, 3, 0, 1, kurve.fade);

  // Kiesel: steckt in der Masse, Ausholen (4 Frames tiefer), auf «heb» heben
  const aus = tw(F, heb - 5, 4, 0, 1, kurve.land) - tw(F, heb - 1, 3, 0, 1, kurve.land);
  const hub = tw(F, heb - 1, 20, 0, 1, kurve.heavy);
  const schweb = hub >= 1 ? Math.sin((F - heb) / 10) * 8 : 0;
  const kY = 1260 + aus * 14 - hub * 380 + schweb;
  const kS = 0.6 + hub * 0.22;
  const versunken = 1 - hub; // unterer Teil von Kieseln verdeckt
  const kRein = tw(F, s.start, 10, 0, 1, kurve.land);
  const glanz = tw(F, w(7, "heisst") + 4, 14, -20, 130, kurve.heavy);

  // Licht-Bloom am Ende (Übergang zu Satz 8)
  const bloom = tw(F, ende - 12, 12, 0, 1, kurve.heavy);
  const feldScale = 1.11 - tw(F, s.start, s.dauer + 10, 0, 0.04, kurve.heavy) + bloom * 0.06;

  return (
    <AbsoluteFill>
      <KieselFeld scale={feldScale} spot={tw(F, s.start, 14, 0, 1, kurve.fade)} />
      <Kamera dauer={s.dauer + 20} seed={7} rucke={[heb]}>
        {/* Aura */}
        <div
          style={{
            position: "absolute",
            left: 540 - 380,
            top: kY - 380,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(169,139,255,${0.55 * hub}) 0%, rgba(169,139,255,0) 65%)`,
          }}
        />
        {/* Schatten auf der Masse: wird kleiner und weicher, je höher */}
        <div
          style={{
            position: "absolute",
            left: 540 - (200 - hub * 70),
            top: 1330,
            width: (200 - hub * 70) * 2,
            height: 60 - hub * 20,
            borderRadius: "50%",
            background: "rgba(20,18,58,.55)",
            filter: `blur(${12 + hub * 20}px)`,
            opacity: kRein * (0.55 - hub * 0.35),
          }}
        />
        {/* Kiesel */}
        <div
          style={{
            position: "absolute",
            left: 540 - 450 * kS,
            top: kY - 450 * kS,
            width: 900 * kS,
            height: 900 * kS,
            opacity: kRein,
            WebkitMaskImage: `linear-gradient(180deg, black ${62 - versunken * 22}%, rgba(0,0,0,${1 - versunken}) ${80 - versunken * 10}%)`,
            transform: `rotate(${-8 + hub * 10 + schweb * 0.25}deg)`,
          }}
        >
          <Img src={staticFile("r01/a/glas-kiesel-b.webp")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          {/* Glanz-Wischer auf «heisst» (Ereignis in der Wartezeit) */}
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
        <Funken bei={an} cx={540} cy={1260 - 380} />

        {/* Pille */}
        <div
          style={{
            position: "absolute",
            left: 540 - pw / 2,
            top: 360 - ph / 2 + 60,
            width: pw,
            height: ph,
            borderRadius: ph / 2,
            opacity: pO,
            background: farben.nacht,
            boxShadow: "0 30px 70px rgba(44,30,120,.22)",
            overflow: "hidden",
          }}
        >
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              whiteSpace: "nowrap",
            }}
          >
            <Wort bei={w(7, "Solleva") + 6} style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 64, color: farben.tinte }}>
              Solleva
            </Wort>
            <Wort bei={w(7, "heisst")} style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 64, color: farben.tinte }}>
              heisst:
            </Wort>
            <Wort bei={heb} style={{ fontFamily: schrift.serif, fontStyle: "italic", fontSize: 96, color: farben.violett }}>
              heb
            </Wort>
            <Wort bei={an} style={{ fontFamily: schrift.serif, fontStyle: "italic", fontSize: 96, color: farben.violett }}>
              an.
            </Wort>
          </div>
        </div>
      </Kamera>
      {/* Licht-Bloom (U16) aus dem Kiesel heraus */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${((kY) / 1920) * 100}%, #fff ${bloom * 70}%, rgba(255,255,255,${bloom}) ${bloom * 100 + 10}%)`,
          opacity: bloom,
        }}
      />
      <Ton nr="pop-02" bei={p0 + 3} vol={0.4} />
      <Ton nr="klick-02" bei={p0 + 9} vol={0.35} />
      <Ton nr="glitzer-04" bei={w(7, "heisst") + 10} vol={0.18} />
      <Ton nr="riser-01" bei={heb} vol={0.25} />
      <Ton nr="whoosh-03" bei={heb + 4} vor={2} vol={0.45} />
      <Ton nr="glitzer-04" bei={an + 2} vol={0.4} />
      <Ton nr="glitzer-05" bei={ende} vor={2} vol={0.2} max={2} />
    </AbsoluteFill>
  );
};
