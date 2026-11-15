import React from "react";
import { useCurrentFrame } from "remotion";
import { Stimmung } from "../brand/solleva";
import { kurve, tw } from "../lib/bewegung";

export type CursorPunkt = { f: number; x: number; y: number; klick?: boolean };

// Weicher Bogen zwischen zwei Punkten (quadratische Bézierkurve, Kontrollpunkt seitlich versetzt)
const bogen = (a: CursorPunkt, b: CursorPunkt, t: number) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(160, len * 0.22);
  const cx = mx - (dy / len) * off;
  const cy = my + (dx / len) * off;
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
};

export const cursorPosition = (frame: number, pfad: CursorPunkt[]) => {
  if (frame <= pfad[0].f) return { x: pfad[0].x, y: pfad[0].y };
  for (let i = 0; i < pfad.length - 1; i++) {
    const a = pfad[i];
    const b = pfad[i + 1];
    if (frame <= b.f) {
      const t = kurve.heavy((frame - a.f) / (b.f - a.f));
      return bogen(a, b, t);
    }
  }
  const l = pfad[pfad.length - 1];
  return { x: l.x, y: l.y };
};

/** Mauszeiger, der die Story treibt. Klick = kurzes Eindrücken + Ripple in Akzentfarbe. */
export const Cursor: React.FC<{ s: Stimmung; pfad: CursorPunkt[]; sichtbarAb?: number }> = ({
  s,
  pfad,
  sichtbarAb = 0,
}) => {
  const frame = useCurrentFrame();
  const p = cursorPosition(frame, pfad);
  const klicks = pfad.filter((q) => q.klick);
  let druck = 1;
  const ripples: React.ReactNode[] = [];
  for (const k of klicks) {
    const d = frame - k.f;
    if (d >= -3 && d < 0) druck = tw(frame, k.f - 3, 3, 1, 0.86, kurve.whip);
    if (d >= 0 && d < 6) druck = tw(frame, k.f, 6, 0.86, 1, kurve.land);
    if (d >= 0 && d < 16) {
      const r = tw(frame, k.f, 16, 10, 70, kurve.land);
      const o = tw(frame, k.f, 16, 0.55, 0, kurve.fade);
      ripples.push(
        <div
          key={k.f}
          style={{
            position: "absolute",
            left: k.x - r,
            top: k.y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: `4px solid ${s.akzent}`,
            opacity: o,
          }}
        />,
      );
    }
  }
  const op = tw(frame, sichtbarAb, 6, 0, 1, kurve.fade);
  return (
    <>
      {ripples}
      <svg
        width={64}
        height={64}
        viewBox="0 0 32 32"
        style={{
          position: "absolute",
          left: p.x - 6,
          top: p.y - 4,
          opacity: op,
          transform: `scale(${druck})`,
          transformOrigin: "6px 4px",
          filter: "drop-shadow(0 6px 10px rgba(20,18,58,.28))",
        }}
      >
        <path
          d="M6 4 L6 25 L11.5 20 L15 28 L18.6 26.4 L15.2 18.6 L22.5 18.6 Z"
          fill="#FFFFFF"
          stroke="#14123A"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
