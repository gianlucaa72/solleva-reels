import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  Ausschnitt, Blitz, Erpresser, Etikett, HfNotiz, HKaro, HKreis, HPackpapier, HPunkte, HSchwarz, HSpirale, HStrahlen, HZeitung,
  Hebel, Korn, Papierstueck, Zacken, zine, ZineSchriften,
  Flasche, Bueste, Kanone,
  Los, Riso, Rasterwort, Blase, Stempel, Hand, Praegeband, Schlagzeile, Kreistext, Stapel, Karteikarte,
} from "../../stil/halbton";

// Storyboard v2 «Spielautomat» im Stil Halbton-Collage. Pro Moment ein Schlüsselbild (Frame i*SB2_PANEL+30).
// Regel Übersicht: oben Text (y 250–700), Mitte EIN Hauptobjekt, höchstens 2–3 Akzente.
export const SB2_PANEL = 40;

const Walzen: React.FC<{ x: number; y: number; zeichen: string[]; dreh?: number; gross?: boolean }> = ({ x, y, zeichen, dreh = 0, gross }) => {
  const w = gross ? 200 : 120, h = gross ? 280 : 170;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 14, transform: `rotate(${dreh}deg)`, filter: "drop-shadow(0 0 0 #fff) drop-shadow(6px 10px 0 rgba(0,0,0,.25))" }}>
      {zeichen.map((c, i) => (
        <div key={i} style={{ width: w, height: h, background: c === "♥" && i === zeichen.length - 1 ? zine.gelb : "#fff", border: `5px solid ${zine.schwarz}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rye", fontSize: w * 0.62, color: c === "♥" ? zine.rot : zine.schwarz }}>
          {c}
        </div>
      ))}
    </div>
  );
};

const P = {
  // 1 Hook
  hook: () => (
    <>
      <HStrahlen />
      <Etikett text="DEIN DAUMEN ZIEHT" x={80} y={260} dreh={-3} />
      <Etikett text="GERADE AN EINEM" x={250} y={345} dreh={2} />
      <Erpresser text="SPIEL" x={90} y={440} size={120} />
      <Erpresser text="AUTOMATEN" x={60} y={590} size={92} versatz={3} />
      <Hebel />
      <Ausschnitt name="mobile-phone" x={540} y={1100} size={600} dreh={-8} />
      <Walzen x={410} y={990} zeichen={["♥", "♥", "?"]} dreh={-8} />
      <HfNotiz text="Hand, Daumen zieht Handy-Hebel (Halbton)" />
    </>
  ),
  dreh: () => (
    <>
      <HZeitung f={20} />
      <Los x={140} y={260} w={760} klein="JEDER WISCH IST EIN NEUER" text="DREH" dreh={-3} />
      <Walzen x={150} y={820} zeichen={["▤", "▥", "▦"]} gross dreh={2} />
      <Blitz x={880} y={720} s={80} dreh={14} />
      <HfNotiz text="(nur Code: Feed klappt zu 3 Walzen auf)" />
    </>
  ),
  treffer: () => (
    <>
      <HPunkte />
      <div style={{ position: "absolute", left: 80, top: 260, fontFamily: "Fell", fontStyle: "italic", fontSize: 72, color: zine.schwarz }}>Meistens <s>Niete</s>. Aber manchmal:</div>
      <Riso x={60} y={380} text="TREFFER!" size={190} dreh={-4} />
      <Walzen x={150} y={820} zeichen={["✕", "✕", "♥"]} gross />
      <Zacken x={850} y={820} r={110} farbe={zine.rot} />
      <HfNotiz text="Halbton-Herz mit Papierrand (oder Code)" />
    </>
  ),
  dopamin: () => (
    <>
      <HKreis f={10} />
      <div style={{ position: "absolute", left: 80, top: 270, fontFamily: "JetBrains Mono", fontSize: 38, color: "#fff", letterSpacing: "0.08em" }}>UND DANN SCHÜTTET DEIN GEHIRN …</div>
      <Rasterwort x={50} y={340} text="DOPAMIN" size={200} />
      <div style={{ position: "absolute", left: 720, top: 540, fontFamily: "JetBrains Mono", fontSize: 38, color: "#fff" }}>… AUS.</div>
      <Ausschnitt name="brain" x={540} y={1080} size={620} />
      <Zacken x={280} y={850} r={70} farbe={zine.gelb} spitzen={9} />
      <Zacken x={820} y={1300} r={55} farbe={zine.gelb} spitzen={9} />
      <HfNotiz text="Gehirn, Kupferstich/Halbton, Funken" />
    </>
  ),
  glueck: () => (
    <>
      <HKaro f={10} />
      <Hand x={130} y={250} text="Viele denken, Dopamin sei das …" size={64} farbe={zine.schwarz} strich={zine.violett} />
      <Blase x={140} y={370} w={680} dreh={-3}>Glücks&shy;hormon!</Blase>
      <Flasche x={560} y={1140} h={640} dreh={5} />
      <HfNotiz text="Apotheker-Flasche, Etikett «GLÜCK» (Halbton)" />
    </>
  ),
  falsch: () => (
    <>
      <HSchwarz />
      <div style={{ position: "absolute", left: 90, top: 290, fontFamily: "JetBrains Mono", fontSize: 36, color: "#bbb", letterSpacing: "0.1em" }}>DOPAMIN HEISST:</div>
      <Hand x={80} y={350} text="Da kommt noch mehr!" size={118} />
      <Flasche x={560} y={1180} h={600} dreh={-6} riss />
      <Stempel x={170} y={1060} text="FALSCH." size={170} dreh={-14} farbe="#FF3B3B" dunkel />
      <HfNotiz text="dieselbe Flasche, bekommt Riss + Stempel (Code)" />
    </>
  ),
  erwartet: () => (
    <>
      <HPackpapier />
      <Praegeband x={70} y={270} text="EIN ERWARTETER TREFFER" size={44} dreh={-2} />
      <Praegeband x={220} y={370} text="LÄSST ES FAST" size={44} farbe={zine.violett} dreh={2} />
      <Praegeband x={300} y={470} text="KALT." size={110} farbe="#2F6FB5" dreh={-3} />
      <Bueste x={540} y={1140} h={660} />
      <HfNotiz text="Marmorbüste gähnt (Halbton)" />
    </>
  ),
  ueberraschung: () => (
    <>
      <HStrahlen a={zine.gelb} b="#FFF6D0" f={40} />
      <Schlagzeile x={70} y={250} w={880} dach="EXTRABLATT · ÜBERRASCHENDER TREFFER" titel="Löst einen Schub aus!" dreh={-2} />
      <Zacken x={700} y={900} r={260} farbe={zine.rot} spitzen={14} />
      <Kanone x={520} y={1150} w={860} />
      <HfNotiz text="Zirkus-Kanone, Mann fliegt raus (Kupferstich/Halbton)" />
    </>
  ),
  ungewiss: () => (
    <>
      <HSpirale f={20} tempo={0.6} />
      <div style={{ position: "absolute", left: 70, right: 140, top: 270, background: "#fff", border: `4px solid ${zine.schwarz}`, padding: "14px 24px", fontFamily: "Fell", fontStyle: "italic", fontSize: 70, lineHeight: 1, transform: "rotate(-2deg)" }}>Am stärksten, wenn es …</div>
      <div style={{ position: "absolute", left: 540 - 380, top: 1120 - 380, width: 760, height: 760, borderRadius: "50%", background: "#F2EFE8", boxShadow: "0 0 0 6px #121212" }} />
      <Kreistext cx={540} cy={1120} r={300} text="UNGEWISS · UNGEWISS · UNGEWISS · UNGEWISS · " size={74} farbe={zine.rot} dreh={-20} />
      <Ausschnitt name="coin" x={540} y={1120} size={420} dreh={30} />
      <div style={{ position: "absolute", left: 830, top: 1440, fontFamily: "Rye", fontSize: 200, color: zine.rot, transform: "rotate(14deg)" }}>?</div>
      <HfNotiz text="Münze im Flug, halb Kopf halb Zahl" />
    </>
  ),
  weiter: () => (
    <>
      <HSpirale f={80} tempo={1} />
      <Papierstueck x={30} y={220} w={1000} h={560} dreh={-2} seed={14} style={{ background: zine.papier }} />
      <Stapel x={90} y={250} text="WEITER." von={56} bis={150} n={5} farben={[zine.schwarz, zine.rot]} />
      {["NUR NOCH EINS.", "NUR NOCH EINS.", "NUR NOCH EINS."].map((t, i) => (
        <div key={i} style={{ position: "absolute", left: 140 + i * 50, top: 900 + i * 170, transform: `rotate(${-6 + i * 5}deg)`, background: i === 2 ? zine.gelb : "#fff", border: `5px solid ${zine.schwarz}`, fontFamily: "Barlow", fontWeight: 800, fontSize: 80, padding: "8px 28px", boxShadow: "6px 10px 0 rgba(0,0,0,.25)" }}>
          {t}
        </div>
      ))}
      <HfNotiz text="(nur Code: Bruch-Moment)" />
    </>
  ),
  firma: () => (
    <>
      <HZeitung f={120} />
      <Papierstueck x={-40} y={720} w={1160} h={860} dreh={-3} seed={8} style={{ background: zine.papier }} />
      <Karteikarte x={90} y={250} w={860} dreh={-2} zeilen={["Deine Firma steckt", <span key="w">in derselben <span style={{ background: zine.gelb, padding: "0 8px" }}>Walze.</span></span>]} />
      <Ausschnitt name="laptop" x={540} y={1130} size={560} dreh={-4} />
      <HfNotiz text="Laptop mit Website im Halbton, Riss-Übergang" />
    </>
  ),
  sekunde: () => (
    <>
      <HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" />
      <div style={{ position: "absolute", left: 70, top: 240, fontFamily: "Barlow", fontWeight: 800, fontSize: 420, lineHeight: 0.8, color: "#fff", letterSpacing: "-0.05em" }}>1</div>
      <div style={{ position: "absolute", left: 330, top: 280, fontFamily: "Rye", fontSize: 92, color: zine.gelb, lineHeight: 1 }}>SEKUNDE</div>
      <div style={{ position: "absolute", left: 335, top: 400, fontFamily: "JetBrains Mono", fontSize: 34, color: "#fff", lineHeight: 1.35 }}>entscheidet:<br />WEITER — oder STOPP.</div>
      <Ausschnitt name="hourglass-done" x={540} y={1150} size={520} />
      <HfNotiz text="Sanduhr (Halbton, wie Pinterest-Ref.)" />
    </>
  ),
  belohnung: () => (
    <>
      <AbsoluteFill style={{ background: zine.schwarz }} />
      <Papierstueck x={540} y={-50} w={620} h={2050} dreh={3} seed={11} style={{ background: zine.gelb }} />
      <div style={{ position: "absolute", left: 70, top: 300, fontFamily: "Fell SC", fontSize: 120, color: "#666", textDecoration: "line-through", textDecorationColor: zine.rot, textDecorationThickness: 10 }}>Niete</div>
      <div style={{ position: "absolute", left: 470, top: 440, fontFamily: "Caveat", fontWeight: 600, fontSize: 70, color: "#fff", transform: "rotate(-6deg)" }}>oder …</div>
      <div style={{ position: "absolute", left: 590, top: 520, fontFamily: "Rye", fontSize: 108, color: zine.schwarz, transform: "rotate(4deg)" }}>Treffer?</div>
      <Ausschnitt name="cross-mark" x={270} y={1100} size={300} dreh={-10} />
      <Ausschnitt name="trophy" x={800} y={1100} size={380} dreh={6} farbig />
      <HfNotiz text="Zerknülltes Papier vs. Pokal (Halbton)" />
    </>
  ),
  cta: () => (
    <>
      <HStrahlen a={zine.violett} b={zine.papier} f={60} />
      <Erpresser text="FOLGE" x={210} y={420} size={150} versatz={5} />
      <Erpresser text="FÜR MEHR" x={110} y={620} size={120} versatz={2} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 1050, height: 150, background: zine.schwarz, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Barlow", fontWeight: 800, fontSize: 60, transform: "rotate(-2deg)", boxShadow: "8px 12px 0 rgba(0,0,0,.25)" }}>
        @solleva.ch
      </div>
      <Etikett text="HEB DICH VON DER MASSE AB." x={140} y={1290} dreh={2} />
    </>
  ),
};

const panels = Object.values(P);
export const SB2_DAUER = panels.length * SB2_PANEL;

export const Storyboard2: React.FC = () => (
  <AbsoluteFill style={{ background: zine.papier }}>
    <ZineSchriften />
    {panels.map((Comp, i) => (
      <Sequence key={i} from={i * SB2_PANEL} durationInFrames={SB2_PANEL}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Comp />
          <Korn />
          <div style={{ position: "absolute", left: 70, top: 200, fontFamily: "JetBrains Mono", fontSize: 22, color: "#555", background: "rgba(255,255,255,.7)", padding: "2px 8px" }}>{String(i + 1).padStart(2, "0")}</div>
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);
