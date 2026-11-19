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
import { Koernung, r04, schriftR04, SchriftenR04, TiltShift } from "./Look";
import { fallen, faecher, Schatten, Schreiben, Staub, Szene1, Szene2, Untertitel, UntertitelStil, Welt, Zeile3D } from "./Stiltest";
import { REEL04_DAUER, S1, S2, SCHNITT, T, U, w1 } from "./timeline";

export { REEL04_DAUER } from "./timeline";
import { V, W3, W4, W5, W6, W7, W8, W9 } from "./timeline";

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
  const zettelIn = f >= W3.das ? feder(f - W3.das, 4) : 0;
  const weg = f >= W3.nur + 1 ? kurve.raus(Math.min(1, (f - W3.nur - 1) / 10)) : 0;
  const st = f >= W3.nur ? Math.min(1, (f - W3.nur) / 3) : 0;
  const stS = f >= W3.nur ? (f - W3.nur < 3 ? 1.9 - 0.9 * kurve.whip(st) : 1 - Math.exp(-(f - W3.nur - 3) / 3) * Math.sin((f - W3.nur - 3) / 1.3) * 0.04) : 0;
  return (
    <AbsoluteFill style={{ background: "#1b0f0a" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-chef-b.png" breite={1100} />
        {f >= W3.bezahlen && <Obj src="r04/obj-umschlag-a.png" x={540 + (1 - umP) * 900} y={900} w={720} dreh={-5 + (1 - umP) * 25} blur={(1 - um) * 10} h={1.1} />}
        {f >= W3.das && weg < 1 && (
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
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "125%", fontSize: 250, color: farben.papier, transform: `scale(${tw(f, W4.ai, 5, 1.4, 1, kurve.land)})`, textShadow: "-8px 0 0 rgba(143,227,255,.8), 8px 0 0 rgba(216,74,200,.8), 10px 18px 20px rgba(0,0,0,.5)" }}>AI</div>
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
        <Welt src="r04/welt-lavendel-a.png" breite={1100} />
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
        <Zeile3D text="AI ALLEIN" start={W5.allein} top={270} groesse={124} f={f} farbe={farben.tinte} pA="#B9A6F5" pB="#6C3FD4" />
        {f >= W5.kein && <Schreiben text="reicht nicht." x={300} y={1190} groesse={104} p={tw(f, W5.kein, 14, 0, 1, kurve.linear)} dreh={-5} farbe={farben.violett} />}
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 6: Den Unterschied machen Hook, Geschichte und Details. ----------
const Karte: React.FC<{ wort: string; aktiv?: boolean; strich?: number }> = ({ wort, aktiv, strich = 0 }) => (
  <div style={{ width: 640, height: 240, background: "#F7F4EC", borderRadius: 8, position: "relative", overflow: "hidden", backgroundImage: "repeating-linear-gradient(0deg, transparent 0 46px, rgba(108,63,212,.16) 46px 48px)", boxShadow: "inset 0 0 30px rgba(120,100,60,.15)" }}>
    <div style={{ position: "absolute", top: 0, left: 56, width: 3, height: "100%", background: "rgba(201,53,53,.4)" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "118%", fontSize: wort.length > 8 ? 80 : 100, color: aktiv ? farben.violett : farben.tinte }}>{wort}</div>
    {aktiv && <div style={{ position: "absolute", left: 130, width: 380 * strich, bottom: 40, height: 12, background: farben.gold, borderRadius: 6 }} />}
  </div>
);
const Szene6: React.FC<{ f: number }> = ({ f }) => {
  const ende = V.s7;
  // Auf «Details» beginnt EINE Fahrt auf die DETAILS-Karte, die durch den Schnitt in Satz 7 läuft.
  const kam = gleitKamera(f, kamera6());
  const karten = [
    { wort: "HOOK", start: W6.hook, x: 150, y: 470, dreh: -5, von: -70 },
    { wort: "GESCHICHTE", start: W6.geschichte, x: 180, y: 740, dreh: 4, von: 65 },
    { wort: "DETAILS", start: W6.details, x: 140, y: 1010, dreh: -3, von: -60, aktiv: true },
  ];
  return (
    <AbsoluteFill style={{ background: "#3e2496" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-matte-b.png" breite={1100} />
        {karten.map((k, i) => {
          const fa = faecher(f, k.start, k.von);
          if (!fa) return null;
          return (
            <div key={i} style={{ position: "absolute", left: k.x, top: k.y, transformOrigin: "50% -150%", transform: `rotate(${k.dreh + fa.dreh}deg) scale(${k.aktiv ? 1.06 : 1})`, filter: `blur(${fa.blur}px) ${Schatten(k.aktiv ? 1.5 : 1.1)}` }}>
              <Karte wort={k.wort} aktiv={k.aktiv} strich={k.aktiv ? tw(f, k.start + 6, 8, 0, 1, kurve.land) : 0} />
            </div>
          );
        })}
      </Ebene>
      <TiltShift blur={10} fokus={50} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <Zeile3D text="DER UNTERSCHIED:" start={W6.unterschied} top={290} groesse={66} f={f} pA="#B9A6F5" pB="#2A1670" />
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 7: Heute bekommen das auch kleine Betriebe. (Laden hebt ab, Text dahinter) ----------
const Szene7: React.FC<{ f: number }> = ({ f }) => {
  const ende = V.s8;
  const kam = gleitKamera(f, kamera7());
  const hoch = f >= W7.kleine ? feder(f - W7.kleine, 7) : 0;
  const da = f >= W7.kleine - 3;
  const licht = tw(f, W7.kleine, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ background: "#e9e2fb" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-lavendel-b.png" breite={1100} />
        <AbsoluteFill style={{ opacity: licht, background: "radial-gradient(ellipse 34% 55% at 50% 22%, rgba(255,255,255,.85), rgba(255,255,255,.25) 55%, transparent 75%)", mixBlendMode: "screen" }} />
      </Ebene>
      <TiltShift blur={9} fokus={52} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        {f >= W7.heute && <Schreiben text="Heute …" x={110} y={215} groesse={92} p={tw(f, W7.heute, 10, 0, 1, kurve.linear)} dreh={-6} farbe={farben.violett} />}
        <Zeile3D text="KLEINE" start={W7.kleine} top={370} groesse={140} f={f} farbe={farben.tinte} pA="#B9A6F5" pB="#6C3FD4" />
        <Zeile3D text="BETRIEBE" start={W7.betriebe} top={490} groesse={140} f={f} farbe={farben.tinte} pA="#B9A6F5" pB="#6C3FD4" />
      </Ebene>
      {/* Laden liegt VOR dem Text (Tiefe wie «BAGS» hinter dem Koffer) */}
      <Ebene css={kam.css} blur={kam.blur}>
        {da && (
          <>
            <div style={{ position: "absolute", left: 540 - 230 + 40 * hoch, top: 1250 + 30 * hoch, width: 460, height: 90, borderRadius: "50%", background: "rgba(40,20,110,.38)", filter: `blur(${14 + 20 * hoch}px)`, opacity: 1 - 0.45 * hoch }} />
            <Obj src="r04/obj-laden-a.png" x={540} y={1010 - 60 * hoch} w={540} s={0.8 + 0.25 * hoch} h={0.3} />
          </>
        )}
      </Ebene>
    </AbsoluteFill>
  );
};

// ---------- Satz 8 (Signature): Dieses Video? Keine Filmcrew. Nur ich. → Rausfahrt auf den echten Tisch ----------
const Szene8: React.FC<{ f: number }> = ({ f }) => {
  const ende = V.s9;
  const kam = gleitKamera(f, kamera8());
  const props = [
    { src: "r04/obj-kamera-a.png", x: 650, y: 760, w: 210, d: -10 },
    { src: "r04/obj-lampe-a.png", x: 700, y: 1000, w: 180, d: 12 },
    { src: "r04/obj-filmrolle-a.png", x: 370, y: 1060, w: 180, d: -8 },
    { src: "r04/obj-polaroid-a.png", x: 580, y: 1240, w: 150, d: 9 },
    { src: "r04/obj-laden-a.png", x: 360, y: 1260, w: 160, d: 0 },
  ];
  return (
    <AbsoluteFill style={{ background: "#2a1d14" }}>
      <AbsoluteFill style={{ transform: kam.css, transformOrigin: "50% 50%", filter: kam.blur ? `blur(${kam.blur}px)` : undefined }}>
        <Welt src="r04/welt-totale-a.png" breite={1080} />
        {props.map((p, i) => <Obj key={i} src={p.src} x={p.x} y={p.y} w={p.w} dreh={p.d} h={0.6} />)}
        <div style={{ position: "absolute", left: 330, top: 650, width: 240, height: 240, transform: "rotate(-7deg)", filter: Schatten(0.6) }}>
          <Img src={staticFile("r04/obj-klappe-brett.png")} style={{ position: "absolute", width: "100%" }} />
          <Img src={staticFile("r04/obj-klappe-stab.png")} style={{ position: "absolute", width: "100%", transformOrigin: `${(90 / 1024) * 100}% ${(258 / 1024) * 100}%`, transform: "rotate(11.5deg)" }} />
        </div>
      </AbsoluteFill>
      <TiltShift blur={f >= W8.nur ? 4 : 8} fokus={f >= W8.nur ? 66 : 56} />
      <AbsoluteFill>
        <Zeile3D text="KEINE FILMCREW." start={W8.keine} top={250} groesse={74} f={f} pA="#C9B48F" pB="#2B170C" />
        {f >= W8.ich && <Schreiben text="Nur ich." x={150} y={1170} groesse={170} p={tw(f, W8.ich, 12, 0, 1, kurve.linear)} dreh={-6} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Satz 9: CTA auf der Matte + Solleva-Endkarte ----------
const Szene9: React.FC<{ f: number }> = ({ f }) => {
  const kam = gleitKamera(f, kamera9());
  const btn = f >= W9.schreib ? feder(f - W9.schreib, 6) : 0;
  const k = f - W9.reel;
  const druck = k >= 0 && k < 3 ? 0.93 : k >= 3 && k < 10 ? 0.93 + 0.07 * feder(k - 3, 3) : 1;
  const marke = tw(f, W9.reel + 4, 10, 0, 1, kurve.land);
  return (
    <AbsoluteFill style={{ background: "#2a1d14" }}>
      <Ebene css={kam.css} blur={kam.blur}>
        <Welt src="r04/welt-matte-a.png" breite={1380} />
      </Ebene>
      <TiltShift blur={10} fokus={50} />
      <Ebene css={halbeKamera(kam)} blur={kam.blur / 2}>
        <div style={{ position: "absolute", top: 240, left: 70, right: 140, textAlign: "center", opacity: marke, transform: `translateY(${(1 - marke) * 20}px)`, fontFamily: "Barlow", fontWeight: 700, fontSize: 60, color: farben.papier, letterSpacing: "0.01em", textShadow: `4px 6px 10px ${r04.schatten}` }}>Solleva</div>
        <Zeile3D text="WILLST DU" start={W9.willst} top={350} groesse={112} f={f} pA="#B9A6F5" pB="#2A1670" />
        <Zeile3D text="DAS AUCH?" start={W9.auch} top={450} groesse={112} f={f} pA="#B9A6F5" pB="#2A1670" />
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
      {/* Stimme */}
      {[[S1, "s1"], [S2, "s2"], [V.s3, "s3"], [V.s4, "s4"], [V.s5, "s5"], [V.s6, "s6"], [V.s7, "s7"], [V.s8, "s8"], [V.s9, "s9"]].map(([from, n]) => (
        <Sequence key={n as string} from={from as number} layout="none"><Audio src={staticFile(`r04/stimme/${n}.mp3`)} /></Sequence>
      ))}
      {/* Musikbett aus «new sounds»: ca. 17 dB unter der Stimme, keine toten Löcher */}
      <Sequence from={0} durationInFrames={REEL04_DAUER} layout="none">
        <Audio src={staticFile("sounds-neu/neu-dark-cinematic-suspe.mp3")} volume={(fr) => 0.1 * Math.min(1, fr / 9) * Math.min(1, (REEL04_DAUER - fr) / 24)} />
      </Sequence>
      {/* Satz 1: Klappe in Frame 1 (Holz, trocken), Schlag 2 auf «Filmcrew» */}
      <Ton nr="neu-wooden-film-clapperb-2" bei={1} vol={0.95} />
      <Ton nr="neu-kick-drum-vintage-3" bei={1} vol={0.35} />
      <Ton nr="neu-soft-zipper-like-rat-1" bei={T.brauchte + 4} vol={0.35} />
      <Ton nr="schreiben-01" bei={T.frueher + 2} vol={0.3} />
      <Ton nr="neu-wooden-film-clapperb-2" bei={T.filmcrew} vol={0.95} />
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
      {/* Satz 3 */}
      <Ton nr="papier-01" bei={W3.bezahlen + 5} vol={0.45} />
      <Ton nr="papier-03" bei={W3.das + 3} vol={0.4} />
      <Ton nr="schlag-07" bei={W3.nur} vol={0.9} />
      <Ton nr="schlag-01" bei={W3.nur} vol={0.55} />
      <Ton nr="swish-03" bei={W3.nur + 4} vol={0.35} />
      <Ton nr="riser-01" bei={V.s4} vol={0.22} />
      {/* Satz 4 */}
      <Ton nr="glitch-03" bei={V.s4 + 1} vol={0.4} />
      <Ton nr="klick-05" bei={W4.kam} vol={0.45} />
      <Ton nr="glitch-02" bei={W4.ai - 2} vol={0.3} max={0.6} />
      <Ton nr="schlag-03" bei={W4.ai} vol={0.6} />
      <Ton nr="whoosh-03" bei={V.s5} vol={0.5} />
      {/* Satz 5 */}
      <Ton nr="swish-02" bei={W5.ai} vor={2} vol={0.3} />
      <Ton nr="schlag-07" bei={W5.ai + 1} vol={0.35} />
      <Ton nr="schreiben-01" bei={W5.kein + 1} vol={0.4} />
      <Ton nr="swish-04" bei={W5.video + 4} vol={0.4} />
      {/* Satz 6 */}
      <Ton nr="papier-02" bei={W6.hook + 3} vol={0.4} />
      <Ton nr="papier-02" bei={W6.geschichte + 3} vol={0.4} />
      <Ton nr="papier-02" bei={W6.details + 3} vol={0.45} />
      <Ton nr="glitzer-04" bei={W6.details + 8} vol={0.35} />
      <Ton nr="whoosh-01" bei={V.s7} vol={0.35} />
      {/* Satz 7 */}
      <Ton nr="schreiben-01" bei={W7.heute + 2} vol={0.3} />
      <Ton nr="glitzer-01" bei={W7.kleine + 6} vol={0.35} />
      <Ton nr="pop-05" bei={W7.betriebe} vol={0.3} />
      {/* Satz 8 (Signature) */}
      <Ton nr="swish-01" bei={V.s8} vol={0.35} />
      <Ton nr="riser-01" bei={W8.nur} vol={0.3} />
      <Ton nr="schlag-04" bei={W8.nur} vol={0.55} />
      <Ton nr="schreiben-02" bei={W8.ich + 6} vol={0.35} />
      <Ton nr="whoosh-03" bei={V.s9} vol={0.4} />
      {/* Satz 9 */}
      <Ton nr="swish-05" bei={W9.schreib + 3} vor={2} vol={0.3} />
      <Ton nr="klick-02" bei={W9.reel} vol={0.6} />
      <Ton nr="schlag-05" bei={W9.reel + 1} vol={0.45} />
      <Ton nr="glitzer-04" bei={W9.reel + 5} vol={0.3} />
    </AbsoluteFill>
  );
};
