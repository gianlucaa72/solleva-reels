import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { farben, schrift, stimmungen, Stimmung } from "../../brand/solleva";
import { Headline, Hintergrund, Label, Schriften, Serif } from "../../components/Basis";
import { Endkarte } from "../../components/Endkarte";
import { Emoji } from "../../bausteine/Emoji";
import { WebKarte } from "../../bausteine/Bausteine";
import { MiniPost, Walze } from "../../bausteine/Walze";
import { Nacht } from "../../welten/Welten";

// Storyboard «Spielautomat»: pro Moment ein Schlüsselbild (Frame i*60+45).
export const SB_PANEL = 60;
const N = stimmungen.S2;
const H = stimmungen.S1;

const Platzhalter: React.FC<{ titel: string; prompt: string; y?: number; h?: number }> = ({ titel, prompt, y = 820, h = 640 }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top: y, height: h, borderRadius: 34, border: `3px dashed ${farben.lavendelAkzent}`, background: "rgba(169,139,255,.08)", padding: 36, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
    <div style={{ fontFamily: schrift.mono, fontSize: 24, letterSpacing: "0.14em", color: farben.lavendelAkzent }}>HIGGSFIELD · PLATZHALTER</div>
    <div style={{ fontFamily: schrift.text, fontWeight: 800, fontSize: 46, color: farben.papier, lineHeight: 1.05 }}>{titel}</div>
    <div style={{ fontFamily: schrift.mono, fontSize: 21, color: "#9DA1D6", lineHeight: 1.4 }}>{prompt}</div>
  </div>
);

const Satz: React.FC<{ s: Stimmung; vor: string; wort: string; nach?: string; y?: number; size?: number }> = ({ s, vor, wort, nach = "", y = 330, size = 92 }) => (
  <Headline s={s} y={y} size={size}>
    {vor} <Serif s={s}>{wort}</Serif>
    {nach}
  </Headline>
);

const feedTöne = ["#6C3FD4", "#2A2E66", "#A98BFF", "#22265A", "#8FE3FF", "#3A3D6B"];
const feed = (s: Stimmung) => feedTöne.map((t, i) => <MiniPost key={i} s={s} ton={t} />);
const symbol = (name: string, size = 190) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <Emoji name={name} x={size / 2} y={size / 2} size={size} schweben={false} />
  </div>
);

const Panel1 = () => (
  <AbsoluteFill>
    <Nacht />
    <Label s={N} text="// 01 Hebel" />
    <Satz s={N} vor="Dein Daumen zieht gerade an einem" wort="Spielautomaten." />
    <Platzhalter titel="Hand hält Handy – der Daumen zieht nach unten wie an einem Hebel" prompt="photoreal close-up, hand holding smartphone in dark room, violet neon casino glow, thumb swiping down, shallow depth of field, 9:16, cinematic, no text" />
  </AbsoluteFill>
);

const Panel2 = () => (
  <AbsoluteFill>
    <Hintergrund s={N} />
    <Label s={N} text="// 02 Dreh  ★ Signature" />
    <Satz s={N} vor="Jeder Wisch ist ein neuer" wort="Dreh." />
    {[0, 1, 2].map((i) => (
      <Walze key={i} s={N} eintraege={feed(N)} pos={1.4 + i * 1.7} tempo={0.9 - i * 0.2} x={90 + i * 310} y={880} />
    ))}
    <div style={{ position: "absolute", left: 90, right: 130, top: 1320, fontFamily: schrift.mono, fontSize: 24, color: "#7C80B8", letterSpacing: "0.1em" }}>
      HANDY-FEED KLAPPT AUF → 3 WALZEN (B08)
    </div>
  </AbsoluteFill>
);

const Panel3 = () => (
  <AbsoluteFill>
    <Hintergrund s={N} />
    <Label s={N} text="// 03 Treffer" />
    <Satz s={N} vor="Meistens Niete. Aber manchmal:" wort="Treffer." />
    <Walze s={N} eintraege={[symbol("cross-mark")]} pos={0} x={90} y={880} />
    <Walze s={N} eintraege={[symbol("cross-mark")]} pos={0} x={400} y={880} />
    <Walze s={N} eintraege={[symbol("red-heart")]} pos={0} x={710} y={880} leuchten />
    <Emoji name="sparkles" x={850} y={860} size={150} schweben={false} />
  </AbsoluteFill>
);

const Panel4 = () => (
  <AbsoluteFill>
    <Nacht />
    <Label s={N} text="// 04 Warum" />
    <Satz s={N} vor="Warum? Dein Gehirn liebt das" wort="Vielleicht." />
    <Platzhalter titel="Realistisches Gehirn, leuchtet violett auf, wenn die Walze dreht" prompt="photoreal human brain floating, glass-like, violet and cyan inner glow pulsing, dark navy background, soft rim light, 9:16, no text" />
  </AbsoluteFill>
);

const Panel5 = () => (
  <AbsoluteFill>
    <Hintergrund s={N} ton2 />
    <Label s={N} text="// 05 Schleife  ☺ Bruch" />
    <Satz s={N} vor="Darum scrollst du weiter. Und" wort="weiter." />
    {["Nur noch eins.", "Nur noch eins.", "Nur noch eins."].map((t, i) => (
      <div key={i} style={{ position: "absolute", left: 120 + i * 40, top: 900 + i * 150, transform: `rotate(${-5 + i * 4}deg)`, background: i === 2 ? N.akzent : "#141844", color: i === 2 ? farben.nacht : farben.papier, fontFamily: schrift.text, fontWeight: 800, fontSize: 84, padding: "10px 34px", borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        {t}
      </div>
    ))}
  </AbsoluteFill>
);

const Panel6 = () => (
  <AbsoluteFill>
    <Hintergrund s={H} />
    <Label s={H} text="// 06 Deine Firma" />
    <Satz s={H} vor="Deine Firma steckt in derselben" wort="Walze." />
    <Walze s={H} eintraege={feed(H)} pos={0.5} tempo={0.6} x={90} y={880} />
    <Walze s={H} eintraege={[<WebKarte key="w" s={H} w={240} h={300} titel="Deine Firma" />]} pos={0} x={400} y={880} leuchten />
    <Walze s={H} eintraege={feed(H)} pos={2.3} tempo={0.6} x={710} y={880} />
    <div style={{ position: "absolute", left: 90, right: 130, top: 1320, fontFamily: schrift.mono, fontSize: 24, color: farben.grau, letterSpacing: "0.1em" }}>
      LICHT-BLOOM (U16): NACHT → HELL
    </div>
  </AbsoluteFill>
);

const Panel7 = () => (
  <AbsoluteFill>
    <Hintergrund s={H} ton2 />
    <Label s={H} text="// 07 Sekunde" />
    <Satz s={H} vor="In der ersten" wort="Sekunde" nach=" entscheidet sich alles." />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: schrift.text, fontWeight: 800, fontSize: 300, color: farben.tinte, letterSpacing: "-0.04em" }}>
      0:01
    </div>
    <Emoji name="stopwatch" x={860} y={900} size={170} schweben={false} />
    <WebKarte s={H} w={520} h={340} titel="Deine Website" style={{ position: "absolute", left: 280, top: 1200 }} />
  </AbsoluteFill>
);

const Panel8 = () => (
  <AbsoluteFill>
    <Hintergrund s={H} />
    <Label s={H} text="// 08 Belohnung" />
    <Satz s={H} vor="Bist du die Niete – oder der" wort="Treffer?" />
    <div style={{ position: "absolute", left: 90, top: 1000, opacity: 0.45, filter: "grayscale(1)" }}>
      <WebKarte s={H} w={400} h={300} titel="Niete" akzent={farben.grauHell} />
    </div>
    <div style={{ position: "absolute", left: 120, top: 1150, width: 320, height: 6, background: farben.grau, transform: "rotate(-14deg)" }} />
    <div style={{ position: "absolute", left: 560, top: 880, transform: "rotate(2deg)" }}>
      <WebKarte s={H} w={430} h={320} titel="Treffer" />
    </div>
    <div style={{ position: "absolute", left: 610, top: 1290, width: 330, height: 26, borderRadius: "50%", background: "rgba(44,30,120,.18)", filter: "blur(10px)" }} />
    <div style={{ position: "absolute", left: 560, top: 1340, fontFamily: schrift.mono, fontSize: 22, color: farben.grau, letterSpacing: "0.1em" }}>«ANHEBEN»: SCHATTEN WIRD KLEIN</div>
  </AbsoluteFill>
);

const Panel9 = () => <Endkarte s={H} start={-40} />;

const panels = [Panel1, Panel2, Panel3, Panel4, Panel5, Panel6, Panel7, Panel8, Panel9];
export const SB_DAUER = panels.length * SB_PANEL;

export const Storyboard: React.FC = () => (
  <AbsoluteFill style={{ background: farben.nacht }}>
    <Schriften />
    {panels.map((P, i) => (
      <Sequence key={i} from={i * SB_PANEL} durationInFrames={SB_PANEL}>
        <P />
      </Sequence>
    ))}
  </AbsoluteFill>
);
