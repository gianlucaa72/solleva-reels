import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { farben, schrift, Stimmung, stimmungen } from "../brand/solleva";
import { Hintergrund, Karte, Label, Schriften, Headline, Serif } from "../components/Basis";
import { Cursor } from "../components/Cursor";
import { Endkarte } from "../components/Endkarte";
import { Kamera, Ton } from "../lib/kamera";
import { kurve, overshoot, tw } from "../lib/bewegung";
import { Durchstreichen, MaskenAufstieg, SerifAkzent, textKatalog, Tippen, WortAufhellen, WortSchlag, Zaehler } from "../text/Texteffekte";
import { BalkenHighlight, BuchstabenFlug, FokusZiehen, Handschrift, Kacheln, Kringel, LinieZeichnet, Stempel, textKatalog2, Ueberkleben, Wortstapel, ZahlAufbau } from "../text/Texteffekte2";
import { Uebergang, uebergangsKatalog, UebergangsTyp } from "../transitions/Uebergaenge";
import { Filz, Lichtkanal, Nacht, Rauten, Strahlen, Wellen, weltenKatalog } from "../welten/Welten";
import { bausteinKatalog, EigenschaftenKarten, KalenderLauf, Kranz, Landen, Muenze, Schweben, Stakkato, WebKarte } from "../bausteine/Bausteine";

const { S1, S2, S3, S4 } = stimmungen;

// Katalog-Beschriftung (nur im Katalog, nie im Reel)
const Schild: React.FC<{ nr: string; name: string; wann?: string }> = ({ nr, name, wann }) => (
  <>
    <div style={{ position: "absolute", top: 90, left: 60, right: 60, display: "flex", gap: 14, alignItems: "center", fontFamily: schrift.mono, fontSize: 28, letterSpacing: "0.06em", textTransform: "uppercase", zIndex: 50 }}>
      <span style={{ background: farben.nacht, color: farben.cyan, padding: "10px 16px", borderRadius: 12 }}>{nr}</span>
      <span style={{ background: "rgba(7,10,36,.85)", color: farben.papier, padding: "10px 16px", borderRadius: 12 }}>{name}</span>
    </div>
    {wann && (
      <div style={{ position: "absolute", bottom: 110, left: 60, right: 60, fontFamily: schrift.mono, fontSize: 24, color: farben.papier, background: "rgba(7,10,36,.85)", padding: "14px 20px", borderRadius: 14, lineHeight: 1.35, zIndex: 50 }}>
        {wann}
      </div>
    )}
  </>
);

// ---------- Demo-Szenen ----------
const SzeneProblem: React.FC<{ s: Stimmung }> = ({ s }) => (
  <AbsoluteFill>
    <Hintergrund s={s} />
    <Kamera dauer={80}>
      <Label s={s} text="// 01 Unsichtbar" />
      <Headline s={s} y={620}>Deine Website <Serif s={s}>schweigt.</Serif></Headline>
      <Karte s={s} w={760} h={420} y={1000}>
        <div style={{ padding: 40 }}>
          {[0.9, 0.7, 0.8, 0.5].map((w, i) => <div key={i} style={{ height: 26, width: `${w * 100}%`, background: s.leise, borderRadius: 13, marginBottom: 30, opacity: 0.8 }} />)}
        </div>
      </Karte>
    </Kamera>
  </AbsoluteFill>
);

const SzeneLoesung: React.FC<{ s: Stimmung }> = ({ s }) => (
  <AbsoluteFill>
    <Hintergrund s={s} ton2 />
    <Kamera dauer={80} seed={2}>
      <Label s={s} text="// 02 Gefunden" />
      <Headline s={s} y={620}>Jetzt <Serif s={s}>spricht</Serif> sie.</Headline>
      <Karte s={s} w={760} h={420} y={1000}>
        <div style={{ padding: 40, fontFamily: schrift.text, color: s.tinte }}>
          <div style={{ fontWeight: 800, fontSize: 44, marginBottom: 18 }}>Neue Anfrage</div>
          <div style={{ fontWeight: 500, fontSize: 32, color: "#8C89AE", marginBottom: 30 }}>«Wann hätten Sie Zeit?»</div>
          <div style={{ display: "inline-block", background: s.akzent, color: s.dunkel ? farben.nacht : "#fff", fontWeight: 700, fontSize: 30, padding: "14px 28px", borderRadius: 22 }}>Antworten</div>
        </div>
      </Karte>
    </Kamera>
  </AbsoluteFill>
);

const Wand: React.FC<{ s: Stimmung }> = ({ s }) => (
  <AbsoluteFill>
    <Hintergrund s={S1} ton2 />
    {Array.from({ length: 20 }, (_, i) => {
      const x = (i % 4) * 320 - 160;
      const y = Math.floor(i / 4) * 420 + 60;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${(i % 3) - 1}deg)` }}><WebKarte s={s} w={280} h={360} titel={["Bäckerei", "Coach", "Garage", "Praxis", "Studio"][i % 5]} akzent={[farben.violett, farben.tinte, farben.lavendelAkzent][i % 3]} /></div>;
    })}
  </AbsoluteFill>
);

// Standard-Sound pro Übergang
const tonUebergang: Record<UebergangsTyp, React.ReactNode> = {
  U01: <Ton nr="swish-02" bei={28} vor={2} vol={0.7} />,
  U02: <><Ton nr="whoosh-03" bei={34} vol={0.6} /><Ton nr="schlag-01" bei={44} vol={0.5} /></>,
  U03: <><Ton nr="swish-05" bei={34} vol={0.6} /><Ton nr="pop-05" bei={50} vol={0.5} /></>,
  U04: <Ton nr="whoosh-01" bei={36} vol={0.6} />,
  U05: <><Ton nr="klick-01" bei={28} vol={0.7} /><Ton nr="glitzer-04" bei={34} vol={0.4} /></>,
  U06: <Ton nr="swish-01" bei={33} vol={0.6} />,
  U07: <Ton nr="schlag-03" bei={38} vol={0.6} />,
  U08: <Ton nr="whoosh-02" bei={40} vol={0.5} />,
  U09: <><Ton nr="whoosh-03" bei={33} vor={1} vol={0.7} /><Ton nr="klick-04" bei={35} vol={0.6} /></>,
  U10: <Ton nr="whoosh-01" bei={38} vol={0.7} />,
  U12: <><Ton nr="papier-02" bei={34} vol={0.7} /><Ton nr="swish-02" bei={36} vol={0.5} /></>,
  U14: <><Ton nr="swish-05" bei={32} vol={0.6} /><Ton nr="schlag-07" bei={40} vol={0.6} /></>,
  U15: <><Ton nr="whoosh-02" bei={44} vol={0.5} /><Ton nr="glitzer-04" bei={56} vol={0.4} /></>,
  U16: <Ton nr="glitzer-05" bei={36} vol={0.45} />,
  U17: <Ton nr="swish-01" bei={34} vol={0.6} />,
};

const UebergangDemo: React.FC<{ typ: UebergangsTyp; sa: Stimmung; sb: Stimmung }> = ({ typ, sa, sb }) => {
  const k = uebergangsKatalog[typ];
  let b: React.ReactNode = <SzeneLoesung s={sb} />;
  if (typ === "U09") b = <AbsoluteFill style={{ transform: "scale(2.2)", transformOrigin: "330px 760px" }}><SzeneProblem s={sa} /></AbsoluteFill>;
  if (typ === "U15") b = <Wand s={sb} />;
  return (
    <AbsoluteFill>
      <Uebergang typ={typ} start={28} s={sb} a={<SzeneProblem s={sa} />} b={b} punkt={typ === "U09" ? { x: 540, y: 820 } : { x: 540, y: 1150 }} karte={{ x: 160, y: 1000, w: 760, h: 420 }} />
      {tonUebergang[typ]}
      <Schild nr={typ} name={k.name} wann={`${k.wann} · ${k.dauer} Frames`} />
    </AbsoluteFill>
  );
};

const TextDemo: React.FC<{ nr: string; name: string; wann: string; s: Stimmung; welt?: React.ReactNode; dauer: number; children: React.ReactNode }> = ({ nr, name, wann, s, welt, dauer, children }) => (
  <AbsoluteFill>
    {welt ?? <Hintergrund s={s} />}
    <Kamera dauer={dauer}>{children}</Kamera>
    <Schild nr={nr} name={name} wann={wann} />
  </AbsoluteFill>
);

const WeltDemo: React.FC<{ id: keyof typeof weltenKatalog; welt: React.ReactNode; s: Stimmung; text: React.ReactNode }> = ({ id, welt, s, text }) => (
  <AbsoluteFill>
    {welt}
    <Kamera dauer={50}>{text}</Kamera>
    <Ton nr="swish-03" bei={2} vol={0.35} />
    <Schild nr={id} name={weltenKatalog[id].name} wann={weltenKatalog[id].wann} />
  </AbsoluteFill>
);

const Intro: React.FC = () => (
  <AbsoluteFill>
    <Nacht />
    <Kamera dauer={70}>
      <MaskenAufstieg s={S2} text="Solleva|*Motion-System*" start={4} size={140} y={720} />
      <div style={{ position: "absolute", left: 70, top: 1100, fontFamily: schrift.mono, fontSize: 30, color: "#7C80B8", letterSpacing: "0.14em" }}>KATALOG V0.2 · MIT TON</div>
    </Kamera>
    <Ton nr="riser-01" bei={6} vol={0.35} />
    <Ton nr="schlag-01" bei={8} vol={0.5} />
  </AbsoluteFill>
);

const CursorDemo: React.FC = () => {
  const s = S1;
  const f = useCurrentFrame();
  const druck = f >= 40 && f < 44 ? 0.95 : 1;
  const ok = f >= 44 ? overshoot(f, 44, 12, 1.08) : 0;
  return (
    <AbsoluteFill>
      <Hintergrund s={s} />
      <Kamera dauer={75}>
        <Karte s={s} w={760} h={300} y={820}>
          <div style={{ padding: 44, fontFamily: schrift.text, color: s.tinte, fontWeight: 800, fontSize: 46 }}>Website-Check</div>
          <div style={{ position: "absolute", left: 44, bottom: 44, background: s.akzent, color: "#fff", fontFamily: schrift.text, fontWeight: 700, fontSize: 34, padding: "18px 34px", borderRadius: 26, transform: `scale(${druck})` }}>
            Starten {ok > 0 && <span style={{ display: "inline-block", transform: `scale(${ok})` }}>✓</span>}
          </div>
        </Karte>
        <Cursor s={s} pfad={[{ f: 0, x: 900, y: 1500 }, { f: 36, x: 330, y: 1040 }, { f: 40, x: 330, y: 1040, klick: true }, { f: 70, x: 520, y: 1300 }]} />
      </Kamera>
      <Ton nr="klick-03" bei={40} vol={0.7} />
      <Ton nr="pop-04" bei={46} vol={0.5} />
      <Schild nr="C01" name="Mauszeiger" wann="Weiche Bögen, Klick = Eindrücken + Ripple" />
    </AbsoluteFill>
  );
};

// ---------- Reihenfolge ----------
type Teil = { dauer: number; el: React.ReactNode };
const T = (nr: keyof typeof textKatalog2) => ({ nr, name: textKatalog2[nr].name, wann: textKatalog2[nr].wann });
const T1 = (nr: keyof typeof textKatalog) => ({ nr, name: textKatalog[nr].name, wann: textKatalog[nr].wann });
const B = (nr: keyof typeof bausteinKatalog) => ({ nr, name: bausteinKatalog[nr].name, wann: bausteinKatalog[nr].wann });

const teile: Teil[] = [
  { dauer: 70, el: <Intro /> },

  // --- Welten ---
  { dauer: 50, el: <WeltDemo id="W01" s={S1} welt={<Hintergrund s={S1} />} text={<FokusZiehen s={S1} start={4} text="Raster" serif />} /> },
  { dauer: 50, el: <WeltDemo id="W02" s={S1} welt={<Wellen />} text={<WebKarte s={S1} titel="Deine Website" style={{ position: "absolute", left: 330, top: 640 }} />} /> },
  { dauer: 50, el: <WeltDemo id="W03" s={S1} welt={<Strahlen />} text={<FokusZiehen s={S1} start={4} text="Bühne frei" />} /> },
  { dauer: 50, el: <WeltDemo id="W04" s={S1} welt={<Rauten />} text={<div style={{ position: "absolute", left: 330, top: 600 }}><WebKarte s={S1} titel="Joker" w={420} h={560} /></div>} /> },
  { dauer: 50, el: <WeltDemo id="W05" s={S1} welt={<Lichtkanal />} text={<FokusZiehen s={S2} start={4} text="STORIES" y={1180} size={170} serif />} /> },
  { dauer: 50, el: <WeltDemo id="W06" s={S1} welt={<Filz />} text={<div style={{ position: "absolute", left: 300, top: 700, transform: "rotate(-6deg)" }}><WebKarte s={S1} titel="Collage" w={480} h={340} /></div>} /> },
  { dauer: 50, el: <WeltDemo id="W07" s={S2} welt={<Nacht />} text={<FokusZiehen s={S2} start={4} text="Nachts" serif />} /> },

  // --- Text: Grundeffekte ---
  { dauer: 70, el: <TextDemo {...T1("X01")} s={S1} dauer={70}><WortAufhellen s={S1} text="Deine Kunden *googeln* dich. Jeden Tag." start={6} y={640} /><Ton nr="pop-02" bei={6} vol={0.4} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T1("X02")} s={S3} dauer={60}><MaskenAufstieg s={S3} text="Gutes Design|ist *leise.*" start={6} /><Ton nr="swish-03" bei={8} vol={0.4} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T1("X03")} s={S4} dauer={60}><SerifAkzent s={S4} text="sichtbar" davor="Werde endlich" start={6} /><Ton nr="schreiben-01" bei={16} vol={0.5} /></TextDemo> },
  { dauer: 70, el: <TextDemo {...T1("X04")} s={S1} dauer={70}><Tippen s={S1} text="Webdesign Olten" start={6} /><Ton nr="tippen-01" bei={4} vol={0.45} max={1.4} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T1("X05")} s={S2} welt={<Nacht />} dauer={60}><Zaehler s={S2} start={6} bis={100} label="Website-Check" /><Ton nr="ratsche-14" bei={6} vol={0.5} max={1.1} /><Ton nr="pop-04" bei={37} vol={0.5} /></TextDemo> },
  { dauer: 70, el: <TextDemo {...T1("X06")} s={S3} dauer={70}><Durchstreichen s={S3} start={14} davor="Deine Website ist" alt="hübsch." neu="dein Verkäufer." /><Ton nr="schreiben-01" bei={16} vol={0.5} /><Ton nr="pop-01" bei={31} vol={0.5} /></TextDemo> },
  { dauer: 50, el: <TextDemo {...T1("X07")} s={S2} welt={<Nacht />} dauer={50}><WortSchlag s={S2} start={6} text="Stopp." /><Ton nr="schlag-01" bei={9} vol={0.7} /></TextDemo> },

  // --- Text: aus den Referenzen ---
  { dauer: 55, el: <TextDemo {...T("X08")} s={S1} welt={<Filz farbe="#4B35A6" />} dauer={55}><ZahlAufbau s={S2} start={6} text="500" farbe={farben.papier} /><Ton nr="pop-05" bei={6} vol={0.5} /><Ton nr="pop-05" bei={10} vol={0.5} /><Ton nr="pop-05" bei={14} vol={0.5} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T("X09")} s={S1} welt={<Wellen />} dauer={60}><Stempel s={S1} start={6} woerter={["DANN", "KAM", "ERFOLG"]} /><Ton nr="klick-05" bei={6} vol={0.6} /><Ton nr="klick-05" bei={14} vol={0.6} /><Ton nr="schlag-07" bei={22} vol={0.7} /></TextDemo> },
  { dauer: 55, el: <TextDemo {...T("X12")} s={S1} welt={<Hintergrund s={S1} />} dauer={55}><FokusZiehen s={S1} start={6} text="STRATEGIE" serif /><Ton nr="swish-03" bei={8} vol={0.5} /></TextDemo> },
  { dauer: 55, el: <TextDemo {...T("X13")} s={S1} welt={<Strahlen />} dauer={55}><Kacheln s={S1} start={6} text="2026" /><Ton nr="ratsche-15" bei={6} vol={0.45} max={0.5} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T("X14")} s={S1} welt={<Hintergrund s={S1} ton2 />} dauer={60}><FokusZiehen s={S1} start={2} text="Gemacht von" y={760} size={90} /><Handschrift s={S1} start={14} text="Gianluca" /><Ton nr="schreiben-02" bei={40} vol={0.5} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T("X15")} s={S1} welt={<Wellen />} dauer={60}><Ueberkleben s={S1} start={20} basis="300" neu="81" /><Ton nr="swish-02" bei={20} vor={1} vol={0.6} /><Ton nr="papier-04" bei={26} vol={0.7} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T("X16")} s={S1} welt={<Filz />} dauer={60}><Wortstapel s={S2} start={6} zeilen={["Mehr", "als die", "ganze", "Region"]} farbe={farben.papier} /><Ton nr="schlag-07" bei={6} vol={0.4} /><Ton nr="schlag-07" bei={13} vol={0.4} /><Ton nr="schlag-07" bei={20} vol={0.4} /><Ton nr="schlag-01" bei={27} vol={0.6} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T("X17")} s={S1} welt={<Hintergrund s={S1} />} dauer={60}><Headline s={S1} y={700} size={120}>Das <Serif s={S1}>fehlt.</Serif></Headline><Kringel s={S1} start={10} x={320} y={690} w={420} h={150} notiz="dein Angebot!" /><Ton nr="schreiben-01" bei={12} vol={0.6} /></TextDemo> },
  { dauer: 60, el: <TextDemo {...T("X18")} s={S1} welt={<Hintergrund s={S1} ton2 />} dauer={60}><FokusZiehen s={S1} start={2} text="LEBENSADER" serif y={600} size={120} /><LinieZeichnet s={S1} start={10} y={950} /><Ton nr="ratsche-17" bei={10} vol={0.5} /><Ton nr="glitzer-04" bei={36} vol={0.35} /></TextDemo> },
  { dauer: 55, el: <TextDemo {...T("X19")} s={S2} welt={<Nacht />} dauer={55}><BalkenHighlight s={S2} start={6} text="Erfolg" unter="entsteht durch Handeln" /><Ton nr="swish-06" bei={8} vol={0.5} /></TextDemo> },
  { dauer: 55, el: <TextDemo {...T("X20")} s={S2} welt={<Nacht />} dauer={55}><BuchstabenFlug s={S2} start={6} text="handeln" serif /><Ton nr="glitzer-01" bei={10} vol={0.4} /></TextDemo> },

  // --- Übergänge ---
  ...(["U01", "U02", "U03", "U04", "U05", "U06", "U07", "U08", "U09", "U10", "U12", "U14", "U15", "U16", "U17"] as UebergangsTyp[]).map((typ, i) => {
    const paare: [Stimmung, Stimmung][] = [[S3, S1], [S1, S4], [S3, S1], [S1, S2], [S2, S1], [S4, S3], [S2, S4], [S1, S2], [S1, S1], [S1, S4], [S3, S1], [S1, S4], [S1, S1], [S1, S4], [S2, S2]];
    return { dauer: typ === "U15" ? 90 : 72, el: <UebergangDemo typ={typ} sa={paare[i][0]} sb={paare[i][1]} /> };
  }),

  // --- Bausteine ---
  { dauer: 60, el: <AbsoluteFill><Strahlen /><Kamera dauer={60}><Landen start={8}><WebKarte s={S1} titel="Neu!" w={460} h={340} /></Landen></Kamera><Ton nr="swish-02" bei={18} vol={0.4} /><Ton nr="schlag-02" bei={20} vol={0.7} max={1} /><Schild {...B("B01")} /></AbsoluteFill> },
  { dauer: 85, el: <AbsoluteFill><Nacht /><Kamera dauer={85}><EigenschaftenKarten s={S2} start={8} woerter={["Schnell", "Mobil", "Gefunden"]} /></Kamera><Ton nr="papier-04" bei={12} vol={0.7} /><Ton nr="papier-04" bei={27} vol={0.7} /><Ton nr="papier-04" bei={42} vol={0.7} /><Schild {...B("B06")} /></AbsoluteFill> },
  { dauer: 85, el: <AbsoluteFill><Nacht /><Kamera dauer={85} push={0.02}><FokusZiehen s={S2} start={0} text="Nicht morgen." y={300} size={90} /><KalenderLauf s={S2} start={8} dauer={50} /></Kamera><Ton nr="ratsche-13" bei={8} vol={0.55} /><Ton nr="pop-04" bei={58} vol={0.6} /><Schild {...B("B07")} /></AbsoluteFill> },
  { dauer: 80, el: <AbsoluteFill><Kranz s={S1} start={16}><Wellen /><div style={{ position: "absolute", left: 330, top: 700 }}><WebKarte s={S1} titel="Deine Website" /></div></Kranz><Ton nr="whoosh-03" bei={18} vol={0.6} /><Ton nr="glitzer-04" bei={22} vol={0.5} /><Ton nr="schlag-01" bei={22} vol={0.5} /><Schild {...B("E02")} /></AbsoluteFill> },
  { dauer: 50, el: <AbsoluteFill><Hintergrund s={S3} /><Stakkato start={4} teile={[{ text: "1", bg: "#E8562F", farbe: farben.tinte }, { text: "2", bg: "#2A2A33", farbe: farben.papier }, { text: "3", bg: farben.nacht, farbe: "#E8562F" }]} /><Ton nr="downlifter-02" bei={5} vol={0.5} max={1} /><Ton nr="klick-02" bei={11} vol={0.6} /><Ton nr="klick-02" bei={18} vol={0.6} /><Schild {...B("U13")} /></AbsoluteFill> },
  { dauer: 60, el: <AbsoluteFill><Filz /><Schweben objekt={() => <Muenze />} /><Kamera dauer={60}><FokusZiehen s={S2} start={4} text="Er verkauft." farbe={farben.papier} /></Kamera><Schild {...B("P01")} /></AbsoluteFill> },

  { dauer: 75, el: <CursorDemo /> },
  { dauer: 90, el: <AbsoluteFill><Endkarte s={S1} start={0} klickAuf={60} /><Ton nr="pop-04" bei={14} vol={0.5} /><Ton nr="klick-03" bei={60} vol={0.7} /><Ton nr="schlag-01" bei={62} vol={0.4} /><Schild nr="E01" name="Endkarte" /></AbsoluteFill> },
];

export const KATALOG_DAUER = teile.reduce((a, t) => a + t.dauer, 0);

export const Katalog: React.FC = () => {
  let von = 0;
  return (
    <AbsoluteFill style={{ background: farben.nacht }}>
      <Schriften />
      {teile.map((t, i) => {
        const el = <Sequence key={i} from={von} durationInFrames={t.dauer}>{t.el}</Sequence>;
        von += t.dauer;
        return el;
      })}
    </AbsoluteFill>
  );
};

// Startframes je Teil (für Prüf-Standbilder)
export const KATALOG_STARTS = teile.reduce<number[]>((acc, t, i) => (acc.push(i === 0 ? 0 : acc[i - 1] + teile[i - 1].dauer), acc), []);
