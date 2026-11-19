// Reel 04 «Keine Filmcrew»: ganzes Reel (Satz 1–9). Satz 1–2 = freigegebener Stiltest.
// Welten + Objekte: Higgsfield (assets/r04/higgsfield). Code: Schrift, Kamera K02, Tiefe, Animation, Stempel, Ton.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { farben } from "../../brand/solleva";
import { Ton } from "../../lib/kamera";
import { kurve, tw } from "../../lib/bewegung";
import { feder } from "../../lib/punchFeder";
import { gleitKamera, halbeKamera } from "../../lib/gleitKamera";
import { kamera3, kamera4, kamera5, kamera6, kamera7, kamera8, kamera9 } from "./kamera";
import { Karteikarte, Pin, SchreibmaschinenSchrift } from "./Freigabe";
import { Koernung, r04, schriftR04, SchriftenR04, TiltShift } from "./Look";
import { fallen, faecher, Schatten, Schreiben, Staub, Szene1, Szene2, Untertitel, UntertitelStil, Welt, Zeile3D } from "./Stiltest";
import { REEL04_DAUER, S1, S2, SCHNITT, T, U, w1 } from "./timeline";

export { REEL04_DAUER } from "./timeline";
import { CTA_ZEILEN, NEUE_STIMME, STIMME_DATEI, STIMME_SEGMENTE, V, W3, W4, W5, W6, W7, W8, W9 } from "./timeline";

const Ebene: React.FC<{ css: string; blur?: number; children: React.ReactNode }> = ({ css, blur = 0, children }) => (
  <AbsoluteFill style={{ transform: css, transformOrigin: "50% 40%", filter: blur ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
);
const Obj: React.FC<{ src: string; x: number; y: number; w: number; dreh?: number; s?: number; blur?: number; h?: number; extra?: string }> = ({ src, x, y, w, dreh = 0, s = 1, blur = 0, h = 1.2, extra = "" }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w / 2, width: w, height: w, transform: `${extra} rotate(${dreh}deg) scale(${s})`, filter: `${blur ? `blur(${blur}px) ` : ""}${Schatten(h)}` }}>
    <Img src={staticFile(src)} style={{ width: "100%" }} />
  </div>
);

// ---------- Satz 3: Bezahlen konnten das nur die Grossen. (Humor: Zettel «kleiner Betrieb» fliegt weg) ----------
const Stempel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ border: `9px solid ${farben.violett}`, borderRadius: 16, padding: "10px 26px", color: farben.violett, fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "112%", fontSize: 54, lineHeight: 1, whiteSpace: "nowrap", mixBlendMode: "multiply", opacity: 0.9 }}>{text}</div>
);
const Szene3: React.FC<{ f: number }> = ({ f }) => {
  const ende = V.s4;
  const kam = gleitKamera(f, kamera3());
  const um = Math.max(0, Math.min(1, (f - W3.bezahlen) / 8));
  const umP = f >= W3.bezahlen ? feder(f - W3.bezahlen, 4) : 0;
  const ZETTEL = W3.bezahlen + 8; // nach der Landung des Umschlags
  const zettelIn = f >= ZETTEL ? feder(f - ZETTEL, 5) : 0;
  const weg = f >= W3.nur + 1 ? kurve.raus(Math.min(1, (f - W3.nur - 1) / 14)) : 0;
  const st = f >= W3.nur ? Math.min(1, (f - W3.nur) / 3) : 0;
  const stS = f >= W3.nur ? (f - W3.nur < 3 ? 1.9 - 0.9 * kurve.whip(st) : 1 - Math.exp(-(f - W3.nur - 3) / 3) * Math.sin((f - W3.nur - 3) / 1.3) * 0.04) : 0;
  return (
    <AbsoluteFill style={{ background: "#1b0f0a" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-chef-b.png" breite={1100} />
        {f >= W3.bezahlen && <Obj src="r04/obj-umschlag-a.png" x={540 + (1 - umP) * 900} y={900} w={720} dreh={-5 + (1 - umP) * 25} blur={(1 - um) * 10} h={1.1} />}
        {f >= ZETTEL && weg < 1 && (
          <div style={{ position: "absolute", left: 210, top: 1040, width: 260, height: 220, background: "#E4D9FF", boxShadow: "0 3px 0 rgba(0,0,0,.05) inset", transform: `translate(${-500 * (1 - zettelIn) - 900 * weg}px, ${300 * (1 - zettelIn) + 500 * weg}px) rotate(${-9 - 260 * weg}deg)`, filter: `blur(${weg * 8}px) ${Schatten(1 + weg * 2)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: schriftR04.marker, fontSize: 46, color: farben.tinte, textAlign: "center", lineHeight: 1.05, transform: "rotate(-4deg)" }}>kleiner<br />Betrieb</span>
          </div>
        )}
        {f >= W3.nur && (
          <div style={{ position: "absolute", left: 540, top: 880, transform: `translate(-50%,-50%) rotate(-12deg) scale(${stS})`, opacity: st }}>
            <Stempel text="NUR FÜR GROSSE" />
          </div>
        )}
        <Staub f={f} start={W3.nur + 1} x={540} y={880} />
      </Ebene>
      <TiltShift blur={10} fokus={50} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <Zeile3D text="NUR DIE" start={W3.nur} top={250} groesse={120} f={f} pA="#B9A6F5" pB="#2A1670" />
        <Zeile3D text="GROSSEN." start={W3.grossen} top={355} groesse={120} f={f} pA="#B9A6F5" pB="#2A1670" />
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 4: Dann kam AI. (Retro-TV: Farbbalken → Schwarz → Rauschen → VHS-Blau → Sprung durch den Bildschirm) ----------
const SCREEN = { x: 285, y: 699, w: 527, h: 492 }; // Bildschirm in Frame-Koordinaten (welt-tv-a, Breite 1080)
const Bildschirm: React.FC<{ f: number }> = ({ f }) => {
  const phase = f < W4.kam ? "balken" : f < W4.kam + 10 ? "schwarz" : f < W4.ai ? "rauschen" : "vhs";
  const g = (n: number) => ((Math.sin(f * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return (
    <div style={{ position: "absolute", left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h, borderRadius: "11% / 13%", overflow: "hidden", background: "#050508" }}>
      {phase === "balken" && (
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {["#C8C8C8", "#D6CF3A", "#35C9CF", "#35C94E", "#C935B8", "#C93535", "#3540C9"].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: (g(i) - 0.5) * 80, right: -(g(i) - 0.5) * 80, top: g(i + 5) * SCREEN.h, height: 10 + g(i + 9) * 40, backdropFilter: "hue-rotate(120deg) saturate(2)", opacity: 0.8 }} />
          ))}
        </div>
      )}
      {phase === "schwarz" && <div style={{ position: "absolute", inset: 0, background: f % 3 === 0 ? "#111" : "#020203" }} />}
      {phase === "rauschen" && (
        <svg width="100%" height="100%" style={{ position: "absolute" }}>
          <filter id={`rs${f}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={f} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter={`url(#rs${f})`} />
        </svg>
      )}
      {phase === "vhs" && (
        <div style={{ position: "absolute", inset: 0, background: "#1F2FB8" }}>
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: schriftR04.mono, fontSize: 30, color: "#E8ECFF", textShadow: "0 0 6px rgba(255,255,255,.7)" }}>PLAY ▶</div>
          <div style={{ position: "absolute", right: 40, bottom: 30, fontFamily: schriftR04.mono, fontSize: 26, color: "#E8ECFF", opacity: 0.85 }}>SP 0:00:0{Math.min(9, Math.floor((f - W4.ai) / 6))}</div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "125%", fontSize: 250, color: farben.papier, transform: `scale(${tw(f, W4.ai, 5, 1.4, 1, kurve.land)})`, textShadow: "-8px 0 0 rgba(143,227,255,.8), 8px 0 0 rgba(216,74,200,.8), 10px 18px 20px rgba(0,0,0,.5)" }}>KI</div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 5px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 25%, rgba(255,255,255,.18), transparent 45%)", boxShadow: "inset 0 0 70px rgba(0,0,0,.8)" }} />
    </div>
  );
};
const Szene4: React.FC<{ f: number }> = ({ f }) => {
  const ende = V.s5;
  // Auf «AI» beginnt EINE Fahrt in den Bildschirm hinein; der Schnitt liegt in ihrer Mitte.
  const kam = gleitKamera(f, kamera4());
  return (
    <AbsoluteFill style={{ background: "#0b0705" }}>
      <AbsoluteFill style={{ transform: kam.css, transformOrigin: "548px 945px", filter: kam.blur ? `blur(${kam.blur}px)` : undefined }}>
        <Welt src="r04/welt-tv-a.png" breite={1080} />
        <Bildschirm f={f} />
      </AbsoluteFill>
      <TiltShift blur={9} fokus={55} />
      <AbsoluteFill style={{ transform: halbeKamera(kam), transformOrigin: "548px 945px", opacity: tw(f, ende - 8, 6, 1, 0, kurve.fade), filter: kam.blur ? `blur(${kam.blur / 2}px)` : undefined }}>
        <Zeile3D text="DANN KAM" start={W4.dann} top={290} groesse={110} f={f} pA="#C9B48F" pB="#2B170C" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Satz 5: Aber AI allein macht noch kein gutes Video. ----------
const Szene5: React.FC<{ f: number }> = ({ f }) => {
  const ende = V.s6;
  const kam = gleitKamera(f, kamera5());
  const po = fallen(f, W5.ai - 6, 7);
  const weg = f >= W5.video + 2 ? kurve.raus(Math.min(1, (f - W5.video - 2) / 8)) : 0;
  const strich = (start: number) => Math.max(0, Math.min(1, (f - start) / 7));
  return (
    <AbsoluteFill style={{ background: "#cfc4f2" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-leuchttisch-b.png" breite={1100} />
        {po.sichtbar && (
          <div style={{ position: "absolute", left: 560 - 300, top: 880 - 300, width: 600, height: 600, transform: `translateX(${weg * 1200}px) rotate(${6 + (1 - po.k) * 14 + weg * 35}deg) scale(${po.s})`, filter: `blur(${po.blur + weg * 12}px) ${Schatten(po.hoehe)}` }}>
            <Img src={staticFile("r04/obj-polaroid-a.png")} style={{ width: "100%" }} />
            <svg width="600" height="600" style={{ position: "absolute", left: 0, top: 0 }}>
              <path d="M150 140 L450 430" stroke={farben.violett} strokeWidth="22" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - strich(W5.kein)} opacity={0.92} />
              <path d="M455 150 L155 425" stroke={farben.violett} strokeWidth="22" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - strich(W5.kein + 6)} opacity={0.92} />
            </svg>
          </div>
        )}
      </Ebene>
      <TiltShift blur={9} fokus={52} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <Zeile3D text="KI ALLEIN" start={W5.allein} top={270} groesse={124} f={f} farbe={farben.tinte} pA="#B9A6F5" pB="#6C3FD4" />
        {f >= W5.kein && <Schreiben text="reicht nicht." x={300} y={1190} groesse={104} p={tw(f, W5.kein, 14, 0, 1, kurve.linear)} dreh={-5} farbe={farben.violett} />}
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 6: Der Unterschied (Schreibmaschine tippt HOOK / GESCHICHTE / DETAILS, Karten werden aufs Korkbrett gepinnt) ----------
// Schreibmaschine: Bild 1024 px, im Bild bei Breite 760 → Karte in der Walze bei ca. x 360–730, y 1150–1283.
const SM = { x: 540, y: 1500, w: 760 };
const WALZE = { x: 545, y: 1218 };
export const tippPlan = () => {
  const plan: { wort: string; start: number; proBuchstabe: number; fertig: number; flug?: number; ziel?: { x: number; y: number; dreh: number } }[] = [];
  const woerter = [
    { wort: "HOOK", f: W6.hook, ziel: { x: 160, y: 470, dreh: -4 } },
    { wort: "GESCHICHTE", f: W6.geschichte, ziel: { x: 230, y: 730, dreh: 3 } },
    { wort: "DETAILS", f: W6.details },
  ];
  let frei = 0;
  for (const w of woerter) {
    const start = Math.max(w.f, frei);
    const pro = w.wort.length > 6 ? 1.5 : 2;
    const fertig = Math.round(start + w.wort.length * pro);
    if (w.ziel) {
      plan.push({ wort: w.wort, start, proBuchstabe: pro, fertig, flug: fertig + 1, ziel: w.ziel });
      frei = fertig + 9;
    } else plan.push({ wort: w.wort, start, proBuchstabe: pro, fertig });
  }
  return plan;
};
const Szene6: React.FC<{ f: number }> = ({ f }) => {
  // Auf «Details» beginnt EINE Fahrt auf die Karte in der Walze, die durch den Schnitt in Satz 7 läuft.
  const kam = gleitKamera(f, kamera6());
  const plan = tippPlan();
  return (
    <AbsoluteFill style={{ background: "#3e2496" }}>
      <SchreibmaschinenSchrift />
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-kork-a.png" breite={1100} />
        {/* Schreibmaschine mit der aktuellen Karte in der Walze */}
        <Obj src="r04/obj-schreibmaschine-a.png" x={SM.x} y={SM.y} w={SM.w} h={1.1} />
        {(() => {
          const aktiv = [...plan].reverse().find((p) => f >= p.start);
          if (!aktiv || (aktiv.flug !== undefined && f >= aktiv.flug)) return null;
          const n = Math.min(aktiv.wort.length, Math.floor((f - aktiv.start) / aktiv.proBuchstabe) + 1);
          const anschlag = (f - aktiv.start) % aktiv.proBuchstabe < 1 && n < aktiv.wort.length + 1 ? 1.5 : 0;
          return (
            <div style={{ position: "absolute", left: WALZE.x - 190, width: 380, top: WALZE.y - 30 - anschlag, textAlign: "center", fontFamily: "Special Elite", fontSize: aktiv.wort.length > 8 ? 46 : 58, color: "#1b1630", letterSpacing: "0.04em" }}>
              {aktiv.wort.slice(0, n)}
            </div>
          );
        })()}
        {/* Karten: fliegen aus der Walze und werden angepinnt (über der Schreibmaschine gezeichnet) */}
        {plan.filter((p) => p.ziel && p.flug !== undefined && f >= p.flug).map((p, i) => {
          const t = Math.min(1, (f - (p.flug as number)) / 8);
          const k = kurve.whip(t);
          const z = p.ziel!;
          const x = WALZE.x - 320 + (z.x - (WALZE.x - 320)) * k;
          const y = WALZE.y - 125 + (z.y - (WALZE.y - 125)) * k - Math.sin(k * Math.PI) * 120;
          const gepinnt = t >= 1;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${z.dreh * k}deg) scale(${1 + 0.08 * Math.sin(k * Math.PI)})`, filter: `blur(${(1 - t) * (t > 0 ? 4 : 0)}px) ${Schatten(gepinnt ? 0.8 : 1.6)}` }}>
              <Karteikarte text={p.wort} />
              {gepinnt && <Pin x={320} y={22} />}
            </div>
          );
        })}
      </Ebene>
      <TiltShift blur={10} fokus={50} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <Zeile3D text="DER UNTERSCHIED:" start={W6.unterschied} top={250} groesse={66} f={f} pA="#B9A6F5" pB="#2A1670" />
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 7: Heute bekommen das auch kleine Betriebe. (Terrazzo-Theke, Laden ist von Anfang an da und hebt ab) ----------
const Szene7: React.FC<{ f: number }> = ({ f }) => {
  const kam = gleitKamera(f, kamera7());
  const hoch = f >= W7.kleine ? feder(f - W7.kleine, 7) : 0;
  const licht = tw(f, W7.kleine, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ background: "#e9e2fb" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-terrazzo-a.png" breite={1100} />
        <AbsoluteFill style={{ opacity: licht * 0.8, background: "radial-gradient(ellipse 34% 55% at 50% 22%, rgba(255,250,240,.8), rgba(255,240,220,.2) 55%, transparent 75%)", mixBlendMode: "screen" }} />
      </Ebene>
      <TiltShift blur={9} fokus={52} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        {f >= W7.heute && <Schreiben text="Heute …" x={110} y={215} groesse={92} p={tw(f, W7.heute, 10, 0, 1, kurve.linear)} dreh={-6} farbe={farben.violett} />}
        <Zeile3D text="KLEINE" start={W7.kleine} top={370} groesse={140} f={f} farbe={farben.tinte} pA="#B9A6F5" pB="#6C3FD4" />
        <Zeile3D text="BETRIEBE" start={W7.betriebe} top={490} groesse={140} f={f} farbe={farben.tinte} pA="#B9A6F5" pB="#6C3FD4" />
      </Ebene>
      {/* Laden liegt VOR dem Text (Tiefe wie «BAGS» hinter dem Koffer); er steht schon auf der Theke und hebt auf «kleine» ab */}
      <Ebene css={kam.css} blur={kam.blur}>
        <div style={{ position: "absolute", left: 540 - 230 + 40 * hoch, top: 1250 + 30 * hoch, width: 460, height: 90, borderRadius: "50%", background: "rgba(40,20,110,.38)", filter: `blur(${14 + 20 * hoch}px)`, opacity: 1 - 0.45 * hoch }} />
        <Obj src="r04/obj-laden-a.png" x={540} y={1010 - 60 * hoch} w={540} s={0.8 + 0.25 * hoch} h={0.3} />
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 8 (Signature): Dieses Video? Keine Filmcrew. Nur ich. → Mini-Figur landet in der Mitte der Matte ----------
// Figur: figur-a2-frei.png (1792×2400, Figur im Bild x 436–1261, y 289–2150). Höhe im Bild ca. 760 px, Füsse bei y 1330.
const FIGUR = { breite: 731, links: 194, oben: 453, fussY: 1330 };
const Szene8: React.FC<{ f: number }> = ({ f }) => {
  // Kamera gleitet ruhig auf die Figur zu (Heavy, 100 → 108 % über die ganze Szene), kein Bounce.
  const kam = gleitKamera(f, kamera8());
  const kreis = [
    { src: "r04/obj-kamera-a.png", x: 850, y: 640, w: 300, d: 10 },
    { src: "r04/obj-lampe-a.png", x: 880, y: 1010, w: 250, d: 12 },
    { src: "r04/obj-filmrolle-a.png", x: 200, y: 1010, w: 250, d: -8 },
    { src: "r04/obj-polaroid-a.png", x: 250, y: 1360, w: 210, d: -9 },
    { src: "r04/obj-laden-a.png", x: 830, y: 1370, w: 240, d: 0 },
  ];
  // Figur fällt auf «Nur»: von oben (näher an der Kamera = grösser, unscharf), landet mit kleinem Hüpfer.
  const t = f - W8.nur;
  let fy = -900, fs = 1.25, fb = 10;
  if (t >= 0) {
    const p = Math.min(1, t / 8);
    const k = kurve.whip(p);
    fy = -900 * (1 - k);
    fs = 1.25 - 0.25 * k;
    fb = 10 * (1 - p);
    if (t > 8) {
      const h = t - 8; // kleiner Hüpfer nach der Landung
      fy = -Math.max(0, Math.sin((h / 10) * Math.PI)) * 40 * Math.exp(-h / 12);
      fs = 1 - 0.03 * Math.exp(-h / 3) * Math.cos(h / 1.4);
    }
  }
  const hoehe = Math.min(1, Math.abs(fy) / 400);
  const textWechsel = tw(f, W8.ich, 6, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ background: "#2a1d14" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-matte-a.png" breite={1500} />
        {kreis.map((o, i) => <Obj key={i} src={o.src} x={o.x} y={o.y} w={o.w} dreh={o.d} h={0.8} />)}
        <div style={{ position: "absolute", left: 120, top: 520, width: 260, height: 260, transform: "rotate(-9deg)", filter: Schatten(0.8) }}>
          <Img src={staticFile("r04/obj-klappe-brett.png")} style={{ position: "absolute", width: "100%" }} />
          <Img src={staticFile("r04/obj-klappe-stab.png")} style={{ position: "absolute", width: "100%", transformOrigin: `${(90 / 1024) * 100}% ${(258 / 1024) * 100}%`, transform: "rotate(11.5deg)" }} />
        </div>
        {t >= -2 && (
          <>
            {/* weicher Schatten am Boden: klein und dunkel bei Landung, gross und blass in der Luft */}
            <div style={{ position: "absolute", left: 540 - 170 * (1 + hoehe), top: FIGUR.fussY - 40, width: 340 * (1 + hoehe), height: 80, borderRadius: "50%", background: "rgba(20,8,60,.5)", filter: `blur(${12 + 30 * hoehe}px)`, opacity: t < 0 ? 0 : 1 - 0.6 * hoehe }} />
            <div style={{ position: "absolute", left: FIGUR.links, top: FIGUR.oben + fy, width: FIGUR.breite, transformOrigin: `50% ${FIGUR.fussY - FIGUR.oben}px`, transform: `scale(${fs})`, filter: `blur(${fb}px) ${Schatten(0.9)}`, opacity: t < 0 ? 0 : 1 }}>
              <Img src={staticFile("r04/figur-a2-frei.png")} style={{ width: "100%" }} />
            </div>
          </>
        )}
      </Ebene>
      <TiltShift blur={8} fokus={56} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <div style={{ opacity: 1 - textWechsel }}>
          <Zeile3D text="KEINE FILMCREW." start={W8.keine} top={250} groesse={74} f={f} pA="#B9A6F5" pB="#2A1670" />
        </div>
        <Zeile3D text="NUR ICH." start={W8.ich} top={230} groesse={150} f={f} pA="#C9B48F" pB="#2B170C" />
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 9: CTA vor der violetten Hohlkehle + Solleva-Endkarte ----------
const Szene9: React.FC<{ f: number }> = ({ f }) => {
  const kam = gleitKamera(f, kamera9());
  const btn = f >= W9.schreib ? feder(f - W9.schreib, 6) : 0;
  const k = f - W9.reel;
  const druck = k >= 0 && k < 3 ? 0.95 : k >= 3 && k < 10 ? 0.95 + 0.05 * feder(k - 3, 3) : 1;
  const marke = tw(f, W9.reel + 4, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ background: "#160b3a" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-hohlkehle-b.png" breite={1100} />
      </Ebene>
      <TiltShift blur={8} fokus={55} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <div style={{ position: "absolute", top: 240, left: 70, right: 140, textAlign: "center", opacity: marke, transform: `translateY(${(1 - marke) * 20}px)`, fontFamily: "Barlow", fontWeight: 700, fontSize: 60, color: farben.papier, letterSpacing: "0.01em", textShadow: `4px 6px 10px ${r04.schatten}` }}>Solleva</div>
        {CTA_ZEILEN.map((z, i) => (
          <Zeile3D key={i} text={z} start={i === 0 ? W9.willst : W9.auch} top={350 + i * 100} groesse={CTA_ZEILEN[0].length > 12 ? 84 : 112} f={f} pA="#B9A6F5" pB="#2A1670" />
        ))}
        {f >= W9.schreib && (
          <div style={{ position: "absolute", top: 700 + (1 - btn) * 500, left: 120, right: 180, height: 180, borderRadius: 90, background: farben.nacht, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${druck}) rotate(${-2 * (1 - btn)}deg)`, boxShadow: `0 10px 0 #2A1670, 18px 36px 30px ${r04.schatten}` }}>
            <span style={{ fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "112%", fontSize: 72, color: farben.papier, whiteSpace: "nowrap" }}>
              Schreib <span style={{ color: farben.lavendelAkzent }}>«Reel»</span>
            </span>
          </div>
        )}
        <div style={{ position: "absolute", top: 960, left: 70, right: 140, textAlign: "center", opacity: marke, fontFamily: "Barlow", fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: farben.papier, textShadow: `4px 6px 10px ${r04.schatten}` }}>
          Heb dich von der <span style={{ fontFamily: schriftR04.marker, color: farben.gold, fontWeight: 400 }}>Masse</span> ab.
        </div>
        <div style={{ position: "absolute", top: 1130, left: 240, right: 300, height: 96, borderRadius: 48, background: "rgba(246,245,252,.94)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 0 30px", opacity: marke, boxShadow: `10px 18px 22px ${r04.schatten}` }}>
          <span style={{ fontFamily: "Barlow", fontWeight: 700, fontSize: 34, color: farben.tinte }}>@solleva.ch</span>
          <span style={{ fontFamily: "Barlow", fontWeight: 700, fontSize: 30, color: farben.papier, background: farben.violett, borderRadius: 34, padding: "12px 24px" }}>Folgen</span>
        </div>
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Untertitel ----------
const P = (von: number, bis: number, woerter: [string, number, boolean?][]) => ({ von, bis, woerter: woerter.map(([w, f, key]) => ({ w, f, key })) });
const PHRASEN = [
  P(T.fuer, T.brauchte, [["Für", T.fuer], ["so", w1(0.22)], ["ein", w1(0.36)], ["Video", T.video]]),
  P(T.brauchte, T.eine, [["brauchte", T.brauchte], ["man", T.man], ["früher", T.frueher]]),
  P(T.eine, SCHNITT, [["eine", T.eine], ["Filmcrew.", T.filmcrew, true]]),
  P(U.kamera, U.licht, [["Kamera,", U.kamera]]),
  P(U.licht, U.schnitt, [["Licht,", U.licht]]),
  P(U.schnitt, U.wochenlang, [["Schnitt.", U.schnitt]]),
  P(U.wochenlang, V.s3, [["Wochenlang.", U.wochenlang, true]]),
  P(W3.bezahlen, W3.das, [["Bezahlen", W3.bezahlen], ["konnten", W3.konnten]]),
  P(W3.das, V.s4, [["das", W3.das], ["nur", W3.nur], ["die", W3.die], ["Grossen.", W3.grossen, true]]),
  P(W4.dann, V.s5, [["Dann", W4.dann], ["kam", W4.kam], ["AI.", W4.ai, true]]),
  P(W5.aber, W5.macht, [["Aber", W5.aber], ["AI", W5.ai], ["allein", W5.allein, true]]),
  P(W5.macht, V.s6, [["macht", W5.macht], ["noch", W5.noch], ["kein", W5.kein], ["gutes", W5.gutes], ["Video.", W5.video]]),
  P(W6.den, W6.hook, [["Den", W6.den], ["Unterschied", W6.unterschied], ["machen", W6.machen]]),
  P(W6.hook, V.s7, [["Hook,", W6.hook], ["Geschichte", W6.geschichte], ["und", W6.und], ["Details.", W6.details, true]]),
  P(W7.heute, W7.kleine, [["Heute", W7.heute], ["bekommen", W7.bekommen], ["das", W7.das], ["auch", W7.auch]]),
  P(W7.kleine, V.s8, [["kleine", W7.kleine, true], ["Betriebe.", W7.betriebe, true]]),
  P(W8.dieses, W8.keine, [["Dieses", W8.dieses], ["Video?", W8.video]]),
  P(W8.keine, W8.nur, [["Keine", W8.keine], ["Filmcrew.", W8.filmcrew]]),
  P(W8.nur, V.s9, [["Nur", W8.nur], ["ich.", W8.ich, true]]),
  P(W9.willst, W9.schreib, [["Willst", W9.willst], ["du", W9.du], ["das", W9.das], ["auch?", W9.auch]]),
  P(W9.schreib, W9.reel + 24, [["Schreib", W9.schreib], ["«Reel».", W9.reel, true]]),
];

export const R04Reel: React.FC<{ untertitel?: UntertitelStil }> = ({ untertitel = "aus" }) => {
  const f = useCurrentFrame();
  const szene =
    f < SCHNITT ? <Szene1 f={f} /> :
    f < V.s3 ? <Szene2 f={f} ende={V.s3} /> :
    f < V.s4 ? <Szene3 f={f} /> :
    f < V.s5 ? <Szene4 f={f} /> :
    f < V.s6 ? <Szene5 f={f} /> :
    f < V.s7 ? <Szene6 f={f} /> :
    f < V.s8 ? <Szene7 f={f} /> :
    f < V.s9 ? <Szene8 f={f} /> : <Szene9 f={f} />;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SchriftenR04 />
      {szene}
      <Untertitel f={f} phrasen={PHRASEN} stil={untertitel} />
      <Koernung staerke={0.1} seed={Math.floor(f / 2) % 8} />
      {/* Stimme: neue Datei in Segmenten pro Satz (erlaubt Extra-Pausen), sonst die 9 alten Einzeldateien */}
      {NEUE_STIMME
        ? STIMME_SEGMENTE.map((sg) => (
            <Sequence key={`st${sg.satz}`} from={sg.reel} durationInFrames={Math.max(1, Math.round((sg.bis - sg.von) * 30))} layout="none">
              <Audio src={staticFile(STIMME_DATEI)} startFrom={Math.round(sg.von * 30)} />
            </Sequence>
          ))
        : [[S1, "s1"], [S2, "s2"], [V.s3, "s3"], [V.s4, "s4"], [V.s5, "s5"], [V.s6, "s6"], [V.s7, "s7"], [V.s8, "s8"], [V.s9, "s9"]].map(([from, n]) => (
            <Sequence key={n as string} from={from as number} layout="none"><Audio src={staticFile(`r04/stimme/${n}.mp3`)} /></Sequence>
          ))}
      {/* Musikbett aus «new sounds»: ca. 17 dB unter der Stimme, keine toten Löcher */}
      <Sequence from={0} durationInFrames={REEL04_DAUER} layout="none">
        <Audio src={staticFile("sounds-neu/neu-dark-cinematic-suspe.mp3")} volume={(fr) => 0.1 * Math.min(1, fr / 9) * Math.min(1, (REEL04_DAUER - fr) / 24)} />
      </Sequence>
      {/* Satz 1: Klappe in Frame 1 (Holz, trocken), Schlag 2 auf «Filmcrew» */}
      <Ton nr="neu-wooden-film-clapperb-2" bei={1} vol={0.95} />
      <Ton nr="neu-kick-drum-vintage-3" bei={1} vol={0.35} />
      <Ton nr="schreiben-01" bei={T.frueher + 2} vol={0.3} />
      <Ton nr="neu-heavy-cloth-swoosh-1" bei={T.filmcrew + 2} vol={0.3} />
      <Ton nr="neu-heavy-cloth-swoosh-1" bei={SCHNITT} vor={2} vol={0.5} />
      {/* Satz 2: Kamera rattert, schwerer Lichtschalter, Filmrolle, Kalender (Ratsche bleibt) */}
      <Ton nr="neu-quick-air-swoosh-li-1" bei={U.kamera + 5} vor={2} vol={0.35} />
      <Ton nr="neu-vintage-16mm-film-ca-2" bei={U.kamera + 5} ab={0.18} max={1.1} vol={0.55} />
      <Ton nr="neu-quick-air-swoosh-li-2" bei={U.licht + 5} vor={2} vol={0.3} />
      <Ton nr="neu-heavy-studio-light-s-4" bei={U.licht + 6} max={1.6} vol={0.6} />
      <Ton nr="neu-film-reel-spinning-4" bei={U.schnitt + 5} ab={0.03} max={1.0} vol={0.8} />
      <Ton nr="ratsche-19" bei={U.wochenlang + 2} vol={0.28} max={1.2} />
      <Ton nr="neu-paper-page-flip-dry-1" bei={U.wochenlang + 3} vol={0.25} />
      <Ton nr="schreiben-01" bei={U.wochenlang + 6} vol={0.3} />
      <Ton nr="neu-heavy-cloth-swoosh-2" bei={V.s3} vor={2} vol={0.45} />
      {/* Satz 3: Papier, dumpfer Stempel, Zettel fliegt weg */}
      <Ton nr="neu-paper-page-flip-qui-4" bei={W3.bezahlen + 5} vol={0.5} />
      <Ton nr="neu-paper-page-flip-qui-3" bei={W3.bezahlen + 10} vol={0.4} />
      <Ton nr="neu-heavy-punching-bag-h-1" bei={W3.nur} vol={1.0} />
      <Ton nr="neu-wooden-knock-on-a-ta-2" bei={W3.nur} vol={0.45} />
      <Ton nr="neu-quick-air-swoosh-li-2" bei={W3.nur + 3} vol={0.35} />
      <Ton nr="neu-riser-build-up-2" bei={V.s4} vol={0.3} />
      {/* Satz 4 (KI-Moment: hier dürfen digitale Sounds) */}
      <Ton nr="neu-rotary-knob-clicking-4" bei={V.s4 + 1} vol={1.0} />
      <Ton nr="glitch-03" bei={V.s4 + 2} vol={0.3} />
      <Ton nr="neu-tape-stop-effect-ca-1" bei={W4.kam} ab={0.02} max={0.5} vol={0.45} />
      <Ton nr="glitch-02" bei={W4.ai - 2} vol={0.3} max={0.6} />
      <Ton nr="neu-short-impact-hit-pu" bei={W4.ai} vol={0.45} />
      <Ton nr="neu-slow-bass-woosh" bei={V.s5} vol={0.4} />
      {/* Satz 5: Roboter-Polaroid (digital erlaubt), Stift-X, weg */}
      <Ton nr="neu-quick-air-swoosh-li-1" bei={W5.ai} vor={2} vol={0.3} />
      <Ton nr="neu-soft-pop-ui-click-1" bei={W5.ai + 1} vol={0.45} />
      <Ton nr="schreiben-01" bei={W5.kein + 1} vol={0.45} />
      <Ton nr="neu-double-swoosh-two-f-1" bei={W5.video + 4} vol={0.4} />
      {/* Satz 6: Schreibmaschine (ein Klack pro Buchstabe), Karte fliegt, dumpfer Tap beim Anpinnen */}
      {tippPlan().flatMap((p, i) => [
        ...p.wort.split("").map((_, j) => <Ton key={`t${i}-${j}`} nr={j % 2 ? "neu-old-mechanical-typew-2" : "neu-old-mechanical-typew-1"} bei={Math.round(p.start + j * p.proBuchstabe)} vol={0.42 + ((j * 37) % 10) / 100} />),
        ...(p.flug !== undefined ? [<Ton key={`f${i}`} nr="neu-paper-page-flip-qui-3" bei={p.flug + 1} vol={0.35} />, <Ton key={`p${i}`} nr="neu-wooden-knock-on-a-ta-1" bei={p.flug + 8} vol={0.6} />] : []),
      ])}
      <Ton nr="neu-heavy-cloth-swoosh-2" bei={V.s7} vor={2} vol={0.4} />
      {/* Satz 7: Laden hebt ab (Ladenglocke fehlt noch: Platzhalter Korken) */}
      <Ton nr="schreiben-01" bei={W7.heute + 2} vol={0.3} />
      <Ton nr="neu-cork-popping-out-of-1" bei={W7.kleine + 2} vol={0.4} />
      <Ton nr="neu-soft-wind-swoosh-lo-4" bei={V.s8} vor={2} vol={0.35} />
      {/* Satz 8 (Signature): Figur landet mit dumpfem Tock */}
      <Ton nr="neu-riser-build-up-1" bei={W8.nur + 8} vol={0.25} />
      <Ton nr="neu-quick-air-swoosh-li-2" bei={W8.nur + 7} vor={2} vol={0.3} />
      <Ton nr="neu-wooden-knock-on-a-ta-2" bei={W8.nur + 8} vol={0.9} />
      <Ton nr="neu-kick-drum-vintage-4" bei={W8.nur + 8} vol={0.4} />
      <Ton nr="neu-soft-wind-swoosh-lo-3" bei={V.s9} vor={2} vol={0.35} />
      {/* Satz 9: Button-Klick (mechanisch), dumpfer Impact auf «Reel» */}
      <Ton nr="neu-heavy-cloth-swoosh-1" bei={W9.schreib + 3} vor={2} vol={0.3} />
      <Ton nr="neu-vintage-camera-shutt-1" bei={W9.reel} vol={0.6} />
      <Ton nr="neu-deep-cinematic-boom" bei={W9.reel + 1} vol={0.55} />
    </AbsoluteFill>
  );
};
