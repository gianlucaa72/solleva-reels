import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { farben, schrift, Stimmung, stimmungen } from "../brand/solleva";
import { Atmend, Headline, Hintergrund, Karte, Label, Schriften, Serif } from "../components/Basis";
import { Cursor } from "../components/Cursor";
import { Endkarte } from "../components/Endkarte";
import { kurve, overshoot, tw } from "../lib/bewegung";
import { Durchstreichen, MaskenAufstieg, SerifAkzent, textKatalog, Tippen, WortAufhellen, WortSchlag, Zaehler } from "../text/Texteffekte";
import { Uebergang, uebergangsKatalog, UebergangsTyp } from "../transitions/Uebergaenge";

const { S1, S2, S3, S4 } = stimmungen;

// Katalog-Beschriftung (nur im Katalog, nie im Reel)
const Schild: React.FC<{ nr: string; name: string; wann?: string }> = ({ nr, name, wann }) => (
  <>
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 70,
        display: "flex",
        gap: 18,
        alignItems: "center",
        fontFamily: schrift.mono,
        fontSize: 30,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ background: farben.nacht, color: farben.cyan, padding: "10px 18px", borderRadius: 12 }}>{nr}</span>
      <span style={{ background: "rgba(7,10,36,.82)", color: farben.papier, padding: "10px 18px", borderRadius: 12 }}>{name}</span>
    </div>
    {wann && (
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 70,
          right: 70,
          fontFamily: schrift.mono,
          fontSize: 26,
          color: farben.papier,
          background: "rgba(7,10,36,.82)",
          padding: "16px 22px",
          borderRadius: 14,
          lineHeight: 1.35,
        }}
      >
        Wann: {wann}
      </div>
    )}
  </>
);

// ---------- Demo-Szenen für Übergänge ----------
const SzeneProblem: React.FC<{ s: Stimmung }> = ({ s }) => (
  <AbsoluteFill>
    <Hintergrund s={s} />
    <Atmend dauer={80}>
      <Label s={s} text="// 01 Unsichtbar" />
      <Headline s={s} y={640}>
        Deine Website <Serif s={s}>schweigt.</Serif>
      </Headline>
      <Karte s={s} w={760} h={420} y={1000}>
        <div style={{ padding: 40 }}>
          {[0.9, 0.7, 0.8, 0.5].map((w, i) => (
            <div key={i} style={{ height: 26, width: `${w * 100}%`, background: s.leise, borderRadius: 13, marginBottom: 30, opacity: 0.8 }} />
          ))}
        </div>
      </Karte>
    </Atmend>
  </AbsoluteFill>
);

const SzeneLoesung: React.FC<{ s: Stimmung }> = ({ s }) => (
  <AbsoluteFill>
    <Hintergrund s={s} ton2 />
    <Atmend dauer={80} seed={2}>
      <Label s={s} text="// 02 Gefunden" />
      <Headline s={s} y={640}>
        Jetzt <Serif s={s}>spricht</Serif> sie.
      </Headline>
      <Karte s={s} w={760} h={420} y={1000}>
        <div style={{ padding: 40, fontFamily: schrift.text, color: s.tinte }}>
          <div style={{ fontWeight: 800, fontSize: 44, marginBottom: 18 }}>Neue Anfrage</div>
          <div style={{ fontWeight: 500, fontSize: 32, color: "#8C89AE", marginBottom: 30 }}>«Wann hätten Sie Zeit?»</div>
          <div style={{ display: "inline-block", background: s.akzent, color: s.dunkel ? farben.nacht : "#fff", fontWeight: 700, fontSize: 30, padding: "14px 28px", borderRadius: 22 }}>
            Antworten
          </div>
        </div>
      </Karte>
    </Atmend>
  </AbsoluteFill>
);

const UebergangDemo: React.FC<{ typ: UebergangsTyp; sa: Stimmung; sb: Stimmung }> = ({ typ, sa, sb }) => {
  const k = uebergangsKatalog[typ];
  return (
    <AbsoluteFill>
      <Uebergang
        typ={typ}
        start={28}
        s={sb}
        a={<SzeneProblem s={sa} />}
        b={<SzeneLoesung s={sb} />}
        punkt={{ x: 540, y: 1210 }}
        karte={{ x: 160, y: 1000, w: 760, h: 420 }}
      />
      <Schild nr={typ} name={k.name} wann={`${k.wann} · ${k.dauer} Frames · Kurve ${k.kurve} · Sound: ${k.sound}`} />
    </AbsoluteFill>
  );
};

// ---------- Stimmungen ----------
const StimmungDemo: React.FC<{ s: Stimmung }> = ({ s }) => {
  const frame = useCurrentFrame();
  const p = tw(frame, 0, 14, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      <Hintergrund s={s} />
      <Atmend dauer={60}>
        <Headline s={s} y={620} size={110}>
          <span style={{ opacity: p }}>
            Stimmung <Serif s={s}>{s.id}</Serif>
          </span>
        </Headline>
        <Karte s={s} w={760} h={360} y={980} style={{ transform: `translateY(${(1 - p) * 40}px)` }}>
          <div style={{ padding: 40, display: "flex", gap: 20 }}>
            {[s.hintergrund, s.hintergrund2, s.flaeche, s.tinte, s.akzent].map((c, i) => (
              <div key={i} style={{ width: 110, height: 110, borderRadius: 24, background: c, border: `1.5px solid ${s.rand}` }} />
            ))}
          </div>
        </Karte>
      </Atmend>
      <Schild nr={s.id} name={s.name} />
    </AbsoluteFill>
  );
};

// ---------- Texteffekte ----------
const TextDemo: React.FC<{ nr: keyof typeof textKatalog; s: Stimmung; children: React.ReactNode }> = ({ nr, s, children }) => (
  <AbsoluteFill>
    <Hintergrund s={s} />
    <Atmend dauer={75}>{children}</Atmend>
    <Schild nr={nr} name={textKatalog[nr].name} wann={textKatalog[nr].wann} />
  </AbsoluteFill>
);

// ---------- Cursor ----------
const CursorDemo: React.FC = () => {
  const s = S1;
  const frame = useCurrentFrame();
  const druck = frame >= 40 && frame < 44 ? 0.95 : 1;
  const ok = frame >= 44 ? overshoot(frame, 44, 12, 1.08) : 0;
  return (
    <AbsoluteFill>
      <Hintergrund s={s} />
      <Karte s={s} w={760} h={300} y={820}>
        <div style={{ padding: 44, fontFamily: schrift.text, color: s.tinte, fontWeight: 800, fontSize: 46 }}>Website-Check</div>
        <div
          style={{
            position: "absolute",
            left: 44,
            bottom: 44,
            background: s.akzent,
            color: "#fff",
            fontFamily: schrift.text,
            fontWeight: 700,
            fontSize: 34,
            padding: "18px 34px",
            borderRadius: 26,
            transform: `scale(${druck})`,
          }}
        >
          Starten {ok > 0 && <span style={{ display: "inline-block", transform: `scale(${ok})` }}>✓</span>}
        </div>
      </Karte>
      <Cursor s={s} pfad={[{ f: 0, x: 900, y: 1500 }, { f: 36, x: 330, y: 1040 }, { f: 40, x: 330, y: 1040, klick: true }, { f: 70, x: 520, y: 1300 }]} />
      <Schild nr="C01" name="Mauszeiger" wann="Weiche Bögen, Klick = Eindrücken + Ripple in Akzentfarbe" />
    </AbsoluteFill>
  );
};

// ---------- Intro ----------
const Intro: React.FC = () => (
  <AbsoluteFill>
    <Hintergrund s={S2} />
    <MaskenAufstieg s={S2} text="Solleva|*Motion-System*" start={4} size={140} y={720} />
    <div style={{ position: "absolute", left: 70, top: 1100, fontFamily: schrift.mono, fontSize: 30, color: "#7C80B8", letterSpacing: "0.14em" }}>
      KATALOG V0.1 · BAUSTEINE MIT NUMMER
    </div>
  </AbsoluteFill>
);

// ---------- Reihenfolge ----------
type Teil = { dauer: number; el: React.ReactNode };
const teile: Teil[] = [
  { dauer: 60, el: <Intro /> },
  ...[S1, S2, S3, S4].map((s) => ({ dauer: 45, el: <StimmungDemo s={s} /> })),
  { dauer: 75, el: <TextDemo nr="X01" s={S1}><WortAufhellen s={S1} text="Deine Kunden *googeln* dich. Jeden Tag." start={6} y={640} /></TextDemo> },
  { dauer: 70, el: <TextDemo nr="X02" s={S3}><MaskenAufstieg s={S3} text="Gutes Design|ist *leise.*" start={6} /></TextDemo> },
  { dauer: 70, el: <TextDemo nr="X03" s={S4}><SerifAkzent s={S4} text="sichtbar" davor="Werde endlich" start={6} /></TextDemo> },
  { dauer: 75, el: <TextDemo nr="X04" s={S1}><Tippen s={S1} text="Webdesign Olten" start={6} /></TextDemo> },
  { dauer: 70, el: <TextDemo nr="X05" s={S2}><Zaehler s={S2} start={6} bis={100} label="Website-Check" /></TextDemo> },
  { dauer: 75, el: <TextDemo nr="X06" s={S3}><Durchstreichen s={S3} start={14} davor="Deine Website ist" alt="hübsch." neu="dein Verkäufer." /></TextDemo> },
  { dauer: 60, el: <TextDemo nr="X07" s={S2}><WortSchlag s={S2} start={6} text="Stopp." /></TextDemo> },
  { dauer: 70, el: <UebergangDemo typ="U01" sa={S3} sb={S1} /> },
  { dauer: 75, el: <UebergangDemo typ="U02" sa={S1} sb={S4} /> },
  { dauer: 80, el: <UebergangDemo typ="U03" sa={S3} sb={S1} /> },
  { dauer: 75, el: <UebergangDemo typ="U04" sa={S1} sb={S2} /> },
  { dauer: 75, el: <UebergangDemo typ="U05" sa={S2} sb={S1} /> },
  { dauer: 70, el: <UebergangDemo typ="U06" sa={S4} sb={S3} /> },
  { dauer: 75, el: <UebergangDemo typ="U07" sa={S2} sb={S4} /> },
  { dauer: 80, el: <UebergangDemo typ="U08" sa={S1} sb={S2} /> },
  { dauer: 75, el: <CursorDemo /> },
  { dauer: 90, el: <AbsoluteFill><Endkarte s={S1} start={0} klickAuf={60} /><Schild nr="E01" name="Endkarte" /></AbsoluteFill> },
];

export const KATALOG_DAUER = teile.reduce((a, t) => a + t.dauer, 0);

export const Katalog: React.FC = () => {
  let von = 0;
  return (
    <AbsoluteFill style={{ background: farben.nacht }}>
      <Schriften />
      {teile.map((t, i) => {
        const el = (
          <Sequence key={i} from={von} durationInFrames={t.dauer}>
            {t.el}
          </Sequence>
        );
        von += t.dauer;
        return el;
      })}
    </AbsoluteFill>
  );
};
