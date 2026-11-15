import React from "react";
import { useCurrentFrame } from "remotion";
import { farben, schrift, Stimmung } from "../brand/solleva";
import { kurve, overshoot, tw } from "../lib/bewegung";

// Texteffekte aus den Referenzen (Ref. 01–07).
export const textKatalog2 = {
  X08: { name: "Zahl baut sich auf", wann: "Zahl erscheint Zeichen für Zeichen (5 → 50 → 500) · Ref. 01" },
  X09: { name: "Stempel-Kästchen", wann: "Wörter in dunklen Kästchen, poppen nacheinander · Ref. 01" },
  X12: { name: "Fokus-Ziehen", wann: "Wort kommt aus der Unschärfe/Tiefe · Ref. 02/05" },
  X13: { name: "Ziffern-Kacheln", wann: "Jahr/Zahl als Kacheln, Ziffer für Ziffer · Ref. 02" },
  X14: { name: "Handschrift", wann: "Unterschrift / persönliche Note schreibt sich · Ref. 02/03" },
  X15: { name: "Überkleben", wann: "Etikett klebt über eine Zahl und korrigiert sie · Ref. 03" },
  X16: { name: "Wortstapel", wann: "Riesige Wörter stapeln sich Zeile für Zeile · Ref. 03" },
  X17: { name: "Kringel", wann: "Handgezeichneter Kreis + Pfeil um ein Wort · Ref. 04/07" },
  X18: { name: "Linie zeichnet sich", wann: "Puls-/Wachstumslinie mit leuchtendem Punkt · Ref. 05" },
  X19: { name: "Balken-Highlight", wann: "Farbbalken schiebt sich hinter ein Wort · Ref. 06" },
  X20: { name: "Buchstaben-Flug", wann: "Buchstaben fliegen einzeln ein, unscharf → scharf · Ref. 06" },
} as const;

const fett = (s: Stimmung, size: number): React.CSSProperties => ({
  fontFamily: schrift.text,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: s.tinte,
});
const serifKursiv = (s: Stimmung): React.CSSProperties => ({ fontFamily: schrift.serif, fontStyle: "italic", fontWeight: 400, color: s.akzent });

/** X08: Zahl erscheint Zeichen für Zeichen, jedes Zeichen mit kleinem Pop. */
export const ZahlAufbau: React.FC<{ s: Stimmung; start: number; text: string; abstand?: number; size?: number; y?: number; farbe?: string }> = ({
  s, start, text, abstand = 4, size = 300, y = 760, farbe,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", ...fett(s, size), color: farbe ?? s.tinte }}>
      {text.split("").map((c, i) => {
        const f0 = start + i * abstand;
        const sc = f >= f0 ? overshoot(f, f0, 8, 1.12) : 0;
        return (
          <span key={i} style={{ display: "inline-block", transform: `scale(${sc})`, transformOrigin: "50% 80%" }}>
            {c}
          </span>
        );
      })}
    </div>
  );
};

/** X09: Wörter in dunklen Kästchen, jedes poppt leicht gedreht (Stempel). */
export const Stempel: React.FC<{ s: Stimmung; start: number; woerter: string[]; abstand?: number; size?: number; y?: number }> = ({
  s, start, woerter, abstand = 8, size = 78, y = 760,
}) => {
  const f = useCurrentFrame();
  const drehs = [-3, 2, -1.5, 3, -2];
  return (
    <div style={{ position: "absolute", left: 70, right: 140, top: y, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
      {woerter.map((w, i) => {
        const f0 = start + i * abstand;
        const sc = f >= f0 ? overshoot(f, f0, 7, 1.15) : 0;
        const gross = i === woerter.length - 1;
        return (
          <span
            key={i}
            style={{
              ...fett(s, gross ? size * 1.6 : size),
              color: farben.papier,
              background: s.dunkel ? farben.violett : farben.nacht,
              padding: "10px 22px 14px",
              borderRadius: 10,
              transform: `scale(${sc}) rotate(${drehs[i % 5]}deg)`,
              boxShadow: "0 12px 0 rgba(20,18,58,.18)",
              fontFamily: schrift.mono,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** X12: Wort kommt aus der Tiefe: gross + unscharf → scharf, setzt sich. */
export const FokusZiehen: React.FC<{ s: Stimmung; start: number; text: string; size?: number; y?: number; serif?: boolean; farbe?: string; dauer?: number }> = ({
  s, start, text, size = 150, y = 700, serif, farbe, dauer = 16,
}) => {
  const f = useCurrentFrame();
  const p = tw(f, start, dauer, 0, 1, kurve.land);
  const op = tw(f, start, dauer * 0.5, 0, 1, kurve.fade);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: y,
        textAlign: "center",
        ...fett(s, size),
        ...(serif ? { ...serifKursiv(s), fontSize: size * 1.1 } : {}),
        ...(farbe ? { color: farbe } : {}),
        transform: `scale(${1.7 - 0.7 * p})`,
        filter: `blur(${(1 - p) * 22}px)`,
        opacity: op,
        textShadow: s.dunkel ? `0 0 30px ${s.akzent}` : "0 10px 30px rgba(44,30,120,.18)",
      }}
    >
      {text}
    </div>
  );
};

/** X13: Ziffern als Kacheln, jede klappt einzeln auf. */
export const Kacheln: React.FC<{ s: Stimmung; start: number; text: string; abstand?: number; size?: number; y?: number }> = ({
  s, start, text, abstand = 3, size = 170, y = 820,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 18, perspective: 900 }}>
      {text.split("").map((c, i) => {
        const f0 = start + i * abstand;
        const p = tw(f, f0, 9, 0, 1, kurve.land);
        const sc = f >= f0 ? overshoot(f, f0, 10, 1.08) : 0;
        return (
          <div
            key={i}
            style={{
              width: size * 0.78,
              height: size * 1.05,
              borderRadius: 22,
              background: farben.weiss,
              border: `2px solid ${s.rand}`,
              boxShadow: `0 ${10 + 8 * p}px 0 ${farben.lavendelAkzent}, 0 30px 50px rgba(44,30,120,.2)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...fett(s, size * 0.8),
              color: s.akzent,
              transform: `rotateX(${(1 - p) * 90}deg) scale(${sc})`,
              transformOrigin: "50% 100%",
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

/** X14: Handschrift schreibt sich von links nach rechts (Maske mit weicher Kante + Stiftspitze). */
export const Handschrift: React.FC<{ s: Stimmung; start: number; text: string; dauer?: number; size?: number; y?: number; farbe?: string }> = ({
  s, start, text, dauer = 24, size = 140, y = 1080, farbe,
}) => {
  const f = useCurrentFrame();
  const p = tw(f, start, dauer, 0, 1, kurve.linear);
  const pct = p * 112 - 6;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        fontFamily: schrift.hand,
        fontSize: size,
        color: farbe ?? s.akzent,
        WebkitMaskImage: `linear-gradient(90deg, #000 ${pct}%, transparent ${pct + 6}%)`,
        maskImage: `linear-gradient(90deg, #000 ${pct}%, transparent ${pct + 6}%)`,
        transform: "rotate(-4deg)",
      }}
    >
      {text}
    </div>
  );
};

/** X15: Etikett klebt über die letzten Ziffern einer Zahl und korrigiert sie (300 → 381). */
export const Ueberkleben: React.FC<{ s: Stimmung; start: number; basis: string; neu: string; size?: number; y?: number }> = ({
  s, start, basis, neu, size = 260, y = 800,
}) => {
  const f = useCurrentFrame();
  const p = tw(f, start, 7, 0, 1, kurve.whip);
  const setz = f >= start + 6 ? overshoot(f, start + 6, 8, 1.06) : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", ...fett(s, size) }}>
        <span style={{ background: farben.weiss, padding: "0 24px", borderRadius: 18, boxShadow: "0 20px 40px rgba(20,18,58,.18)" }}>{basis}</span>
        <span
          style={{
            position: "absolute",
            right: -30,
            top: -18,
            padding: "6px 22px",
            background: s.akzent,
            color: farben.weiss,
            borderRadius: 16,
            transform: `translate(${(1 - p) * 500}px, ${(1 - p) * 300}px) rotate(${-6 + (1 - p) * 30}deg) scale(${setz})`,
            boxShadow: "0 18px 30px rgba(20,18,58,.3)",
            opacity: p > 0 ? 1 : 0,
          }}
        >
          {neu}
        </span>
      </div>
    </div>
  );
};

/** X16: riesige Wörter stapeln sich Zeile für Zeile (jede Zeile knallt rein). */
export const Wortstapel: React.FC<{ s: Stimmung; start: number; zeilen: string[]; abstand?: number; size?: number; y?: number; farbe?: string }> = ({
  s, start, zeilen, abstand = 7, size = 150, y = 520, farbe,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 50, right: 110, top: y }}>
      {zeilen.map((z, i) => {
        const f0 = start + i * abstand;
        const sc = tw(f, f0, 6, 1.5, 1, kurve.whip);
        const op = tw(f, f0, 3, 0, 1, kurve.fade);
        return (
          <div key={i} style={{ ...fett(s, size), color: farbe ?? s.tinte, textTransform: "uppercase", transform: `scale(${sc})`, transformOrigin: "0 50%", opacity: op, lineHeight: 0.92 }}>
            {z}
          </div>
        );
      })}
    </div>
  );
};

/** X17: handgezeichneter Kringel um einen Bereich + Pfeil + Notiz. */
export const Kringel: React.FC<{ s: Stimmung; start: number; x: number; y: number; w: number; h: number; notiz?: string; farbe?: string }> = ({
  s, start, x, y, w, h, notiz, farbe,
}) => {
  const f = useCurrentFrame();
  const p = tw(f, start, 14, 0, 1, kurve.land);
  const pf = tw(f, start + 10, 10, 0, 1, kurve.land);
  const op = tw(f, start + 16, 8, 0, 1, kurve.fade);
  const c = farbe ?? (s.dunkel ? farben.cyan : "#E0457B");
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
      <path
        d={`M ${x + w * 0.1} ${y + h * 0.05} C ${x + w * 1.08} ${y - h * 0.25}, ${x + w * 1.12} ${y + h * 1.15}, ${x + w * 0.45} ${y + h * 1.08} S ${x - w * 0.1} ${y + h * 0.2}, ${x + w * 0.3} ${y - h * 0.08}`}
        fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
      />
      {notiz && (
        <>
          <path d={`M ${x + w * 0.75} ${y + h * 1.25} q 60 120 170 110`} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pf} />
          <text x={x + w * 0.75 + 190} y={y + h * 1.25 + 130} fill={c} fontFamily={schrift.notiz} fontWeight={600} fontSize={64} opacity={op}>
            {notiz}
          </text>
        </>
      )}
    </svg>
  );
};

/** X18: Linie zeichnet sich (Puls oder Wachstum) mit leuchtendem Kopf. */
export const LinieZeichnet: React.FC<{ s: Stimmung; start: number; dauer?: number; art?: "puls" | "wachstum"; y?: number }> = ({
  s, start, dauer = 30, art = "puls", y = 900,
}) => {
  const f = useCurrentFrame();
  const p = tw(f, start, dauer, 0, 1, kurve.heavy);
  const d =
    art === "puls"
      ? `M 40 ${y} L 330 ${y} L 380 ${y - 40} L 430 ${y} L 470 ${y} L 520 ${y - 230} L 575 ${y + 150} L 625 ${y} L 700 ${y} L 740 ${y - 60} L 780 ${y} L 1040 ${y}`
      : `M 60 ${y + 200} C 260 ${y + 180}, 380 ${y + 120}, 520 ${y + 20} S 820 ${y - 160}, 1000 ${y - 260}`;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
      <defs>
        <filter id="leuchten"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      <path d={d} fill="none" stroke={s.akzent} strokeWidth={14} opacity={0.5} filter="url(#leuchten)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={s.akzent} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** X19: Farbbalken schiebt sich hinter ein Wort (von links), Wort hellt auf. */
export const BalkenHighlight: React.FC<{ s: Stimmung; start: number; text: string; size?: number; y?: number; unter?: string }> = ({
  s, start, text, size = 130, y = 760, unter,
}) => {
  const f = useCurrentFrame();
  const b = tw(f, start, 8, 0, 1, kurve.whip);
  const t = tw(f, start + 3, 10, 0, 1, kurve.land);
  const u = tw(f, start + 10, 10, 0, 1, kurve.land);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", padding: "0 24px" }}>
        <div style={{ position: "absolute", left: 0, top: "18%", height: "70%", width: `${b * 100}%`, background: s.akzent, borderRadius: 8, boxShadow: s.dunkel ? `0 0 40px ${s.akzent}` : "none" }} />
        <span style={{ position: "relative", ...fett(s, size), color: s.dunkel ? farben.papier : farben.tinte, filter: `blur(${(1 - t) * 10}px)`, opacity: t }}>{text}</span>
      </div>
      {unter && <div style={{ marginTop: 18, fontFamily: schrift.text, fontWeight: 500, fontSize: size * 0.32, color: s.dunkel ? "#B9B6E8" : farben.grau, opacity: u, fontStyle: "italic" }}>{unter}</div>}
    </div>
  );
};

/** X20: Buchstaben fliegen einzeln aus verschiedenen Richtungen ein, unscharf → scharf. */
export const BuchstabenFlug: React.FC<{ s: Stimmung; start: number; text: string; size?: number; y?: number; serif?: boolean }> = ({
  s, start, text, size = 170, y = 760, serif,
}) => {
  const f = useCurrentFrame();
  const versatz = [0, 3, 1, 5, 2, 6, 4, 7, 3, 5];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", ...fett(s, size), ...(serif ? serifKursiv(s) : { color: s.akzent }) }}>
      {text.split("").map((c, i) => {
        const f0 = start + versatz[i % versatz.length];
        const p = tw(f, f0, 10, 0, 1, kurve.land);
        const dx = ((i * 137) % 400) - 200;
        const dy = ((i * 251) % 300) - 150;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * (i % 2 ? 25 : -25)}deg)`,
              filter: `blur(${(1 - p) * 14}px)`,
              opacity: p,
              textShadow: s.dunkel ? `0 0 26px ${s.akzent}` : undefined,
            }}
          >
            {c === " " ? " " : c}
          </span>
        );
      })}
    </div>
  );
};
