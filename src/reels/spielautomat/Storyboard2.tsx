import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  Ausschnitt, Blitz, Erpresser, Etikett, HfNotiz, HKaro, HKreis, HPackpapier, HPunkte, HSchwarz, HSpirale, HStrahlen, HZeitung,
  Hebel, Korn, Papierstueck, Zacken, zine, ZineSchriften,
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
      <Etikett text="JEDER WISCH IST EIN NEUER" x={70} y={280} dreh={-2} />
      <Erpresser text="DREH" x={300} y={380} size={150} versatz={1} />
      <Walzen x={150} y={820} zeichen={["▤", "▥", "▦"]} gross dreh={2} />
      <Blitz x={880} y={720} s={80} dreh={14} />
      <HfNotiz text="(nur Code: Feed klappt zu 3 Walzen auf)" />
    </>
  ),
  treffer: () => (
    <>
      <HPunkte />
      <Etikett text="MEISTENS NIETE." x={80} y={270} dreh={-3} />
      <Etikett text="ABER MANCHMAL:" x={300} y={355} dreh={2} />
      <Erpresser text="TREFFER" x={90} y={460} size={120} versatz={5} />
      <Walzen x={150} y={820} zeichen={["✕", "✕", "♥"]} gross />
      <Zacken x={850} y={820} r={110} farbe={zine.rot} />
      <HfNotiz text="Halbton-Herz mit Papierrand (oder Code)" />
    </>
  ),
  dopamin: () => (
    <>
      <HKreis f={10} />
      <Etikett text="UND DANN SCHÜTTET DEIN GEHIRN" x={60} y={270} dreh={-2} />
      <Erpresser text="DOPAMIN" x={100} y={370} size={130} versatz={2} />
      <Etikett text="AUS." x={760} y={540} dreh={4} />
      <Ausschnitt name="brain" x={540} y={1080} size={620} />
      <Zacken x={280} y={850} r={70} farbe={zine.gelb} spitzen={9} />
      <Zacken x={820} y={1300} r={55} farbe={zine.gelb} spitzen={9} />
      <HfNotiz text="Gehirn, Kupferstich/Halbton, Funken" />
    </>
  ),
  glueck: () => (
    <>
      <HKaro f={10} />
      <Etikett text="VIELE DENKEN, DOPAMIN SEI DAS" x={60} y={270} dreh={-2} />
      <Erpresser text="GLÜCKS" x={90} y={380} size={120} versatz={4} />
      <Erpresser text="HORMON" x={260} y={530} size={110} versatz={1} />
      <Ausschnitt name="zany-face" x={540} y={1120} size={520} dreh={6} />
      <HfNotiz text="Vintage-Frau lacht (Halbton, 50er-Foto)" />
    </>
  ),
  falsch: () => (
    <>
      <HSchwarz />
      <div style={{ position: "absolute", left: 70, top: 280, transform: "rotate(-4deg)" }}>
        <Erpresser text="FALSCH." x={0} y={0} size={150} versatz={0} />
      </div>
      <Etikett text="DOPAMIN HEISST:" x={80} y={560} dreh={2} />
      <div style={{ position: "absolute", left: 80, top: 650, fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 110, color: zine.gelb, transform: "rotate(-2deg)" }}>Da kommt noch mehr.</div>
      <Ausschnitt name="megaphone" x={560} y={1200} size={520} dreh={-12} />
      <HfNotiz text="Hand mit Megafon (Halbton)" />
    </>
  ),
  erwartet: () => (
    <>
      <HPackpapier />
      <Etikett text="EIN ERWARTETER TREFFER" x={70} y={280} dreh={-2} />
      <Etikett text="LÄSST ES FAST" x={200} y={365} dreh={2} />
      <Erpresser text="KALT" x={300} y={460} size={140} versatz={6} />
      <Ausschnitt name="sleeping-face" x={540} y={1120} size={540} />
      <HfNotiz text="Marmorbüste gähnt (Halbton)" />
    </>
  ),
  ueberraschung: () => (
    <>
      <HStrahlen a={zine.gelb} b="#FFF6D0" f={40} />
      <Etikett text="EIN ÜBERRASCHENDER TREFFER" x={60} y={270} dreh={-2} />
      <Etikett text="LÖST EINEN" x={200} y={355} dreh={2} />
      <Erpresser text="SCHUB" x={220} y={450} size={140} versatz={2} />
      <Zacken x={540} y={1100} r={380} farbe={zine.rot} spitzen={14} />
      <Ausschnitt name="face-screaming-in-fear" x={540} y={1100} size={480} />
      <HfNotiz text="Frau mit Fernglas staunt (Halbton)" />
    </>
  ),
  ungewiss: () => (
    <>
      <HSpirale f={20} tempo={0.6} />
      <Etikett text="AM STÄRKSTEN, WENN ES" x={70} y={280} dreh={-2} />
      <Erpresser text="UNGEWISS" x={60} y={380} size={120} versatz={3} />
      <Etikett text="IST." x={760} y={530} dreh={3} />
      <Ausschnitt name="coin" x={540} y={1120} size={420} dreh={30} />
      <div style={{ position: "absolute", left: 760, top: 860, fontFamily: "Rye", fontSize: 220, color: zine.rot, transform: "rotate(14deg)" }}>?</div>
      <HfNotiz text="Münze im Flug, halb Kopf halb Zahl" />
    </>
  ),
  weiter: () => (
    <>
      <HSpirale f={80} tempo={1} />
      <Etikett text="DARUM SCROLLST DU WEITER." x={70} y={280} dreh={-2} />
      <Etikett text="UND" x={300} y={365} dreh={2} />
      <Erpresser text="WEITER" x={140} y={460} size={140} versatz={0} />
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
      <Etikett text="DEINE FIRMA STECKT IN" x={70} y={280} dreh={-2} />
      <Etikett text="DERSELBEN" x={280} y={365} dreh={2} />
      <Erpresser text="WALZE" x={220} y={460} size={140} versatz={5} />
      <Ausschnitt name="laptop" x={540} y={1130} size={560} dreh={-4} />
      <HfNotiz text="Laptop mit Website im Halbton, Riss-Übergang" />
    </>
  ),
  sekunde: () => (
    <>
      <HPunkte farbe={zine.rot} punkt="rgba(0,0,0,.22)" />
      <Etikett text="IN DER ERSTEN" x={80} y={270} dreh={-2} />
      <Erpresser text="SEKUNDE" x={80} y={370} size={130} versatz={1} />
      <Etikett text="ENTSCHEIDET SICH: WEITER ODER STOPP." x={40} y={560} dreh={2} />
      <Ausschnitt name="hourglass-done" x={540} y={1150} size={520} />
      <HfNotiz text="Sanduhr (Halbton, wie Pinterest-Ref.)" />
    </>
  ),
  belohnung: () => (
    <>
      <AbsoluteFill style={{ background: zine.schwarz }} />
      <Papierstueck x={540} y={-50} w={620} h={2050} dreh={3} seed={11} style={{ background: zine.gelb }} />
      <Etikett text="BIST DU DIE NIETE –" x={60} y={280} dreh={-2} />
      <Etikett text="ODER DER" x={420} y={365} dreh={2} />
      <Erpresser text="TREFFER?" x={170} y={460} size={130} versatz={4} />
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
