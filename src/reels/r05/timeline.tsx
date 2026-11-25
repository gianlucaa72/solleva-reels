// Reel 05: Timeline (Frames bei 30 fps) aus timeline.json, erzeugt mit
//   python3 -I tools/r05_timing.py assets/r05/stimme/<take>.mp3 --woerter assets/r05/stimme/<take>-scribe.json --pause-vor 3=0.5,…
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import tl from "./timeline.json";

type Wort = { satz: number; w: string; n: string; f: number };
type Segment = { satz: number; von: number; bis: number; reel: number };
const daten = tl as unknown as { quelle: string; segmente: Segment[]; woerter: Wort[]; dauer: number };

export const STIMME = `assets/r05/stimme/${daten.quelle}`;
export const DAUER = daten.dauer;

/** Frame eines Wortes (n = normalisiert, z. B. "gefaellt"); nth = Vorkommen im Satz. */
export const wf = (satz: number, n: string, nth = 0) => {
  const xs = daten.woerter.filter((w) => w.satz === satz && w.n === n);
  const x = xs[nth] ?? xs[0];
  if (!x) throw new Error(`timeline.json: Wort «${n}» in Satz ${satz} fehlt`);
  return x.f;
};
export const woerter = (satz: number) => daten.woerter.filter((w) => w.satz === satz);
export const satzStart = (satz: number) => Math.min(...woerter(satz).map((w) => w.f));

/** Stimme als Segmente pro Satz (Datei-Zeiten unverändert, Pausen dazwischen). bis = letzter Frame, der noch gespielt wird. */
export const Stimme: React.FC<{ bis?: number; vol?: number }> = ({ bis = Infinity, vol = 1 }) => (
  <>
    {daten.segmente
      .filter((s) => s.reel < bis)
      .map((s) => {
        const len = Math.round((s.bis - s.von) * 30);
        return (
          <Sequence key={s.satz} from={s.reel} durationInFrames={Math.max(1, Math.min(len, bis - s.reel))} layout="none">
            <Audio src={staticFile(STIMME)} startFrom={Math.round(s.von * 30)} endAt={Math.round(s.bis * 30)} volume={vol} />
          </Sequence>
        );
      })}
  </>
);
