// Reel 01 «Unsichtbar»: Zusammenbau. Version A, Version B und Best-of (Wahl pro Satz).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { farben, schrift } from "../../brand/solleva";
import { Label, Schriften } from "../../components/Basis";
import { kurve, tw } from "../../lib/bewegung";
import { MeshHell, MeshNacht } from "./Teile";
import { satz, Stimme, Szene1, Szene2, Szene3, Szene4, Szene5, Szene6, Szene7, Szene8, Szene9, T, V } from "./Szenen";

export const REEL_DAUER = T.gesamt;

// Fenster, in denen eine Szene gezeichnet wird (Überlappung = Übergang). Reihenfolge = Ebenen (später oben).
const st = (n: number) => satz(n).start;
const fenster: { n: number; von: number; bis: number; C: React.FC<{ v: V }>; z: number }[] = [
  { n: 1, von: 0, bis: st(2) + 7, C: Szene1, z: 1 },
  { n: 2, von: st(2) - 17, bis: st(3) - 2, C: Szene2, z: 2 },
  { n: 3, von: st(3) - 2, bis: st(4) - 1, C: Szene3, z: 3 },
  { n: 4, von: st(4) - 2, bis: st(5) + 3, C: Szene4, z: 4 },
  { n: 5, von: st(5), bis: st(6) + 2, C: Szene5, z: 5 },
  { n: 6, von: st(6), bis: st(7), C: Szene6, z: 6 },
  { n: 7, von: st(7) - 1, bis: st(8) + 2, C: Szene7, z: 7 },
  { n: 9, von: st(9) - 10, bis: T.gesamt, C: Szene9, z: 8 },
  { n: 8, von: st(8), bis: st(9) + 10, C: Szene8, z: 9 },
];

const LABELS = ["01 Gesucht", "02 Gefunden", "03 Seite zwei", "04 Niemand", "05 Aber", "06 Unsichtbar", "07 Anheben", "08 Genau das", "09 Sichtbar"];
const dunkelBei = (F: number) => F >= st(3) - 2 && F < st(5);

// Licht-Bloom (U16) an den Nähten 4→5, 5→6 und Ausklang nach 7→8
const bloom = (F: number) => {
  let b = 0;
  for (const p of [st(5), st(6)]) b = Math.max(b, tw(F, p - 9, 9, 0, 1, kurve.heavy) - tw(F, p, 10, 0, 1, kurve.land));
  if (F >= st(8)) b = Math.max(b, 1 - tw(F, st(8), 10, 0, 1, kurve.land));
  return Math.max(0, b);
};

// ---------- Version B: Captions oben, Wort für Wort grau → Tinte, Schlüsselwort kursiv violett ----------
const Captions: React.FC<{ nur?: (n: number) => boolean }> = ({ nur }) => {
  const F = useCurrentFrame();
  let n = 0;
  for (const s of T.saetze) if (F >= s.start - 3) n = s.satz;
  if (!n || (nur && !nur(n))) return null;
  const s = satz(n);
  const next = n < 9 ? satz(n + 1).start - 3 : T.gesamt + 10;
  const rein = tw(F, s.start - 3, 4, 0, 1, kurve.fade);
  const raus = tw(F, next - 3, 3, 0, 1, kurve.raus);
  const dunkel = dunkelBei(F);
  const tinte = dunkel ? farben.papier : farben.tinte;
  const akzent = dunkel ? farben.lavendelAkzent : farben.violett;
  const tokens = s.text.split(" ");
  return (
    <AbsoluteFill style={{ opacity: rein * (1 - raus) }}>
      <Label s={{ dunkel } as never} text={`// ${LABELS[n - 1]}`} y={230} />
      <div style={{ position: "absolute", left: 70, right: 140, top: 300, fontFamily: schrift.text, fontWeight: 800, fontSize: 88, lineHeight: 1.06, letterSpacing: "-0.02em" }}>
        {tokens.map((t, i) => {
          const [, bei] = s.woerter[i];
          const an = tw(F, bei - 1, 5, 0, 1, kurve.land);
          const kern = t.replace(/[.,:?!]/g, "").toLowerCase() === s.schluessel.toLowerCase();
          const puls = kern ? 1 + Math.sin(Math.min(1, Math.max(0, (F - bei) / 10)) * Math.PI) * 0.06 : 1;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.24em",
                color: kern ? akzent : tinte,
                opacity: 0.25 + 0.75 * an,
                transform: `translateY(${-6 * an * (kern ? 1 : 0.5)}px) scale(${puls})`,
                fontFamily: kern ? schrift.serif : undefined,
                fontStyle: kern ? "italic" : undefined,
                fontWeight: kern ? 400 : 800,
                fontSize: kern ? 104 : undefined,
              }}
            >
              {t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ReelBau: React.FC<{ wahl: (n: number) => V }> = ({ wahl }) => {
  const F = useCurrentFrame();
  const b = bloom(F);
  return (
    <AbsoluteFill style={{ background: farben.papier }}>
      <Schriften />
      {dunkelBei(F) ? <MeshNacht /> : <MeshHell t={F} />}
      {fenster
        .filter((f) => F >= f.von && F < f.bis)
        .map((f) => (
          <AbsoluteFill key={f.n} style={{ zIndex: f.z }}>
            <f.C v={wahl(f.n)} />
          </AbsoluteFill>
        ))}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <Captions nur={(n) => wahl(n) === "B"} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 30, background: "#fff", opacity: b }} />
      <Stimme />
    </AbsoluteFill>
  );
};

export const ReelA: React.FC = () => <ReelBau wahl={() => "A"} />;
export const ReelB: React.FC = () => <ReelBau wahl={() => "B"} />;

// Best-of: pro Satz die klarere Version (Begründung in docs/reels/r01-unsichtbar.md)
export const BEST_OF: Record<number, V> = { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A", 6: "A", 7: "A", 8: "A", 9: "A" };
export const ReelFinal: React.FC = () => <ReelBau wahl={(n) => BEST_OF[n]} />;
