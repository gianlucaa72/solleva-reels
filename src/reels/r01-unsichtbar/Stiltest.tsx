// 5-Sekunden-Stiltest: Satz 6 + 7 (Signature-Moment) mit Stimme und Sounds.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Schriften } from "../../components/Basis";
import { kurve, tw } from "../../lib/bewegung";
import { satz, Stimme, Szene5Ausklang, Szene6, Szene7 } from "./Szenen";

export const STILTEST_START = satz(6).start - 14;
export const STILTEST_DAUER = satz(8).start + 6 - STILTEST_START;

const Inhalt: React.FC = () => {
  const F = useCurrentFrame();
  const s6 = satz(6).start;
  const s7 = satz(7).start;
  // Übergang 5→6: Licht-Bloom (U16)
  const bloom = tw(F, s6 - 9, 9, 0, 1, kurve.heavy) - tw(F, s6, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill>
      {F < s6 && <Szene5Ausklang />}
      {F >= s6 && F < s7 - 1 && <Szene6 />}
      {F >= s7 - 1 && <Szene7 />}
      <AbsoluteFill style={{ background: "#fff", opacity: bloom }} />
      <Stimme nur={[6, 7]} />
    </AbsoluteFill>
  );
};

export const Stiltest: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff" }}>
    <Schriften />
    <Sequence from={-STILTEST_START} layout="none">
      <Inhalt />
    </Sequence>
  </AbsoluteFill>
);
