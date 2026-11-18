// Storyboard-Stills Reel 04 (ein Frame = ein Satz). Keine Credits: Higgsfield-Objekte sind Platzhalter.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { farben } from "../../brand/solleva";
import { HandPlatzhalter, Holz, Koernung, Marker, Matte, Objekt, r04, Samt, schriftR04, SchriftenR04, TiltShift, Typo3D, Untertitel } from "./Look";

const Tag: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <div style={{ position: "absolute", left: x, top: y, background: farben.gold, color: farben.tinte, fontFamily: schriftR04.mono, fontSize: 20, padding: "4px 10px", borderRadius: 6, transform: "rotate(-3deg)", boxShadow: "0 6px 14px rgba(0,0,0,.3)" }}>{text}</div>
);

// Filmklappe (Storyboard-Zeichnung; im Reel Higgsfield-Objekt)
const Filmklappe: React.FC = () => (
  <svg width="520" height="470" viewBox="0 0 520 470">
    <defs>
      <pattern id="streifen" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="40" height="80" fill="#F6F5FC" />
        <rect x="40" width="40" height="80" fill="#14123A" />
      </pattern>
    </defs>
    <g transform="rotate(-14 20 120)">
      <rect x="10" y="40" width="500" height="78" rx="8" fill="url(#streifen)" stroke="#14123A" strokeWidth="6" />
    </g>
    <rect x="10" y="125" width="500" height="70" rx="6" fill="url(#streifen)" stroke="#14123A" strokeWidth="6" />
    <rect x="10" y="195" width="500" height="265" rx="10" fill="#1A1838" />
    <g fontFamily="JetBrains Mono" fontSize="26" fill="#ECE6FF">
      <text x="34" y="245">PROD.  SOLLEVA</text>
      <text x="34" y="300">SZENE  01</text>
      <text x="290" y="300">TAKE 1</text>
      <text x="34" y="355">REGIE  –</text>
      <text x="34" y="410">KAMERA –</text>
    </g>
    <line x1="10" y1="268" x2="510" y2="268" stroke="#3A3D6B" strokeWidth="3" />
    <line x1="10" y1="322" x2="510" y2="322" stroke="#3A3D6B" strokeWidth="3" />
    <line x1="10" y1="376" x2="510" y2="376" stroke="#3A3D6B" strokeWidth="3" />
  </svg>
);

const Kalenderblatt: React.FC<{ x: number; y: number; dreh: number; tag: string; blur?: number }> = ({ x, y, dreh, tag, blur = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 170, background: farben.papier, borderRadius: 8, transform: `rotate(${dreh}deg)`, filter: `blur(${blur}px) drop-shadow(10px 18px 12px ${r04.schatten})`, overflow: "hidden" }}>
    <div style={{ height: 40, background: farben.violett, color: farben.papier, fontFamily: schriftR04.mono, fontSize: 20, textAlign: "center", lineHeight: "40px" }}>WOCHE</div>
    <div style={{ fontFamily: schriftR04.display, fontWeight: 900, fontSize: 84, color: farben.tinte, textAlign: "center", lineHeight: "120px" }}>{tag}</div>
  </div>
);

const Umschlag: React.FC = () => (
  <div style={{ width: 640, height: 420, background: "#F3EEE3", borderRadius: 10, position: "relative", overflow: "hidden" }}>
    <svg width="640" height="420" style={{ position: "absolute" }}>
      <path d="M0 0 L320 230 L640 0" fill="none" stroke="#D8CFBF" strokeWidth="4" />
      <path d="M0 420 L250 190 M640 420 L390 190" fill="none" stroke="#E2DACB" strokeWidth="3" />
    </svg>
    <div style={{ position: "absolute", left: 40, top: 300, fontFamily: schriftR04.mono, fontSize: 22, color: "#8A8170" }}>WERBEFILM · OFFERTE</div>
    <div style={{ position: "absolute", right: 36, top: 290, fontFamily: schriftR04.display, fontWeight: 900, fontSize: 52, color: "#6E6C92" }}>CHF ? ? ?</div>
  </div>
);

const Stempel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ border: `8px solid ${farben.violett}`, borderRadius: 14, padding: "10px 26px", color: farben.violett, fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "112%", fontSize: 54, lineHeight: 1, transform: "rotate(-13deg)", opacity: 0.88, mixBlendMode: "multiply", whiteSpace: "nowrap" }}>{text}</div>
);

const RetroTV: React.FC = () => (
  <div style={{ width: 860, height: 640, borderRadius: 40, background: "linear-gradient(160deg,#7A4B2E,#4A2A18)", padding: 34, display: "flex", gap: 24, boxShadow: "inset 0 0 0 6px rgba(255,220,180,.15)" }}>
    <div style={{ flex: 1, borderRadius: 60, background: "#0b0b14", padding: 18, boxShadow: "inset 0 0 0 10px #D9D4CC" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 44, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {["#D9D9D9", "#E8E04A", "#4AD8E0", "#4AD860", "#D84AC8", "#D84A4A", "#4A5AD8"].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
        {/* Glitch-Streifen */}
        {[120, 210, 330, 380].map((y, i) => (
          <div key={i} style={{ position: "absolute", left: (i % 2 ? -40 : 30), right: (i % 2 ? 40 : -30), top: y, height: 14 + i * 6, background: "inherit", backdropFilter: "hue-rotate(90deg) saturate(2)", mixBlendMode: "difference", opacity: 0.6 }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 5px)" }} />
        <div style={{ position: "absolute", left: 24, top: 18, fontFamily: schriftR04.mono, fontSize: 30, color: "#fff", textShadow: "0 0 6px #fff" }}>▶ PLAY</div>
      </div>
    </div>
    <div style={{ width: 110, display: "flex", flexDirection: "column", gap: 30, alignItems: "center", paddingTop: 40 }}>
      {[0, 1].map((i) => <div key={i} style={{ width: 84, height: 84, borderRadius: 42, background: "radial-gradient(circle at 35% 35%,#eee,#777)", boxShadow: "0 6px 10px rgba(0,0,0,.5)" }} />)}
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 90, height: 6, background: "rgba(0,0,0,.45)", borderRadius: 3 }} />)}
    </div>
  </div>
);

const Karteikarte: React.FC<{ wort: string; aktiv?: boolean }> = ({ wort, aktiv }) => (
  <div style={{ width: 600, height: 230, background: farben.papier, borderRadius: 10, position: "relative", overflow: "hidden", backgroundImage: "repeating-linear-gradient(0deg, transparent 0 46px, rgba(108,63,212,.18) 46px 48px)" }}>
    <div style={{ position: "absolute", top: 0, left: 54, width: 3, height: "100%", background: "rgba(216,74,74,.45)" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "118%", fontSize: wort.length > 8 ? 76 : 96, color: aktiv ? farben.violett : farben.tinte }}>{wort}</div>
    {aktiv && <div style={{ position: "absolute", left: 120, right: 120, bottom: 46, height: 10, background: farben.gold, borderRadius: 5, opacity: 0.9 }} />}
  </div>
);

const Klebeband: React.FC<{ x: number; y: number; dreh: number }> = ({ x, y, dreh }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 46, background: "rgba(236,230,255,.62)", transform: `rotate(${dreh}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,.15)" }} />
);

const Szene: React.FC<{ nr: number }> = ({ nr }) => {
  switch (nr) {
    case 0: // 1 Filmcrew
      return (
        <AbsoluteFill>
          <Matte seed={3} />
          <Typo3D zeilen={["FILMCREW"]} top={300} groesse={128} breite={112} />
          <Objekt x={540} y={860} w={520} h={470} dreh={-6} label="" hoehe={1.4}><Filmklappe /></Objekt>
          <Tag x={700} y={600} text="HIGGSFIELD: Filmklappe" />
          <HandPlatzhalter x={720} y={1010} dreh={-28} />
          <TiltShift />
          <Untertitel text="Für so ein Video brauchte man früher eine Filmcrew." schluessel="Filmcrew" />
        </AbsoluteFill>
      );
    case 1: // 2 Wochenlang
      return (
        <AbsoluteFill>
          <Holz seed={4} />
          <Typo3D zeilen={["KAMERA.", "LICHT.", "SCHNITT."]} top={250} groesse={96} praegA="#C9B48F" praegB="#2B170C" />
          <Objekt x={250} y={820} w={300} h={260} dreh={-18} label="KAMERA" />
          <Objekt x={560} y={760} w={260} h={300} dreh={4} label="LAMPE" />
          <Objekt x={850} y={830} w={280} h={260} dreh={20} label="FILMROLLE" />
          <Kalenderblatt x={90} y={1030} dreh={-22} tag="1" blur={2} />
          <Kalenderblatt x={300} y={1100} dreh={8} tag="2" />
          <Kalenderblatt x={560} y={1050} dreh={-6} tag="3" blur={1} />
          <Kalenderblatt x={800} y={1120} dreh={18} tag="4" blur={3} />
          <Marker text="wochenlang." x={220} y={1210} groesse={120} />
          <TiltShift />
          <Untertitel text="Kamera, Licht, Schnitt. Wochenlang." schluessel="Wochenlang" />
        </AbsoluteFill>
      );
    case 2: // 3 Grossen (Humor)
      return (
        <AbsoluteFill>
          <Samt />
          <Typo3D zeilen={["NUR DIE", "GROSSEN."]} top={260} groesse={118} />
          <Objekt x={540} y={900} w={640} h={420} dreh={-4} label="" quelle="Code" hoehe={1.2}><Umschlag /></Objekt>
          <div style={{ position: "absolute", left: 230, top: 840 }}><Stempel text="NUR FÜR GROSSE" /></div>
          <HandPlatzhalter x={760} y={1230} dreh={-8} laenge={700} />
          <Marker text="zuck!" x={820} y={1120} groesse={70} farbe={farben.lavendelAkzent} dreh={8} />
          <TiltShift />
          <Untertitel text="Bezahlen konnten das nur die Grossen." schluessel="Grossen" />
        </AbsoluteFill>
      );
    case 3: // 4 AI (Retro-TV)
      return (
        <AbsoluteFill>
          <Holz dunkel seed={6} />
          <div style={{ position: "absolute", left: 110, top: 600, transform: "rotate(-2deg)", filter: "drop-shadow(24px 40px 30px rgba(0,0,0,.6))" }}><RetroTV /></div>
          <Tag x={640} y={560} text="HIGGSFIELD: Retro-TV" />
          <Typo3D zeilen={["DANN KAM"]} top={300} groesse={92} />
          <div style={{ position: "absolute", top: 660, left: 0, right: 140, textAlign: "center", fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "125%", fontSize: 330, color: farben.papier, textShadow: `-10px 0 0 rgba(143,227,255,.85), 10px 0 0 rgba(216,74,200,.85), 20px 34px 30px rgba(0,0,0,.6)` }}>AI</div>
          <TiltShift />
          <Untertitel text="Dann kam AI." schluessel="AI" />
        </AbsoluteFill>
      );
    case 4: // 5 allein
      return (
        <AbsoluteFill>
          <Matte hell seed={5} />
          <Typo3D zeilen={["AI ALLEIN"]} top={290} groesse={120} farbe={farben.tinte} praegA="#B9A6F5" praegB="#6C3FD4" />
          <Objekt x={600} y={860} w={460} h={540} dreh={14} label="" quelle="Code" hoehe={1.3}>
            <div style={{ width: "100%", height: "100%", background: "#F7F7F7", padding: "28px 28px 110px", boxSizing: "border-box", filter: "saturate(.4)" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(#B8C7D9,#8B96A8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Img src={staticFile("assets/emoji/robot.png")} style={{ width: 260, height: 260 }} />
              </div>
              <div style={{ fontFamily: schriftR04.marker, fontSize: 36, color: "#888", textAlign: "center", marginTop: 20 }}>generisch</div>
            </div>
          </Objekt>
          <HandPlatzhalter x={250} y={900} dreh={-62} laenge={620} />
          <Marker text="reicht nicht." x={300} y={1180} groesse={104} farbe={farben.violett} dreh={-5} />
          <TiltShift />
          <Untertitel text="Aber AI allein macht noch kein gutes Video." schluessel="allein" />
        </AbsoluteFill>
      );
    case 5: // 6 Details
      return (
        <AbsoluteFill>
          <Matte seed={7} />
          <Typo3D zeilen={["DER UNTERSCHIED:"]} top={280} groesse={62} />
          <div style={{ position: "absolute", left: 200, top: 470, transform: "rotate(-5deg)", filter: `drop-shadow(12px 20px 14px ${r04.schatten})` }}><Karteikarte wort="HOOK" /></div>
          <div style={{ position: "absolute", left: 270, top: 740, transform: "rotate(4deg)", filter: `drop-shadow(12px 20px 14px ${r04.schatten})` }}><Karteikarte wort="GESCHICHTE" /></div>
          <div style={{ position: "absolute", left: 180, top: 1010, transform: "rotate(-3deg) scale(1.08)", filter: `drop-shadow(18px 30px 20px ${r04.schatten})` }}><Karteikarte wort="DETAILS" aktiv /></div>
          <Klebeband x={420} y={455} dreh={-8} />
          <Klebeband x={500} y={725} dreh={6} />
          <Klebeband x={400} y={995} dreh={-4} />
          <Img src={staticFile("assets/emoji/magnifying-glass-tilted-left.png")} style={{ position: "absolute", left: 680, top: 940, width: 260, height: 260, filter: `drop-shadow(14px 24px 16px ${r04.schatten})` }} />
          <TiltShift />
          <Untertitel text="Den Unterschied machen Hook, Geschichte und Details." schluessel="Details" y={1420} />
        </AbsoluteFill>
      );
    case 6: // 7 kleine Betriebe (anheben)
      return (
        <AbsoluteFill>
          <Matte hell seed={9} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 40% 60% at 50% 30%, rgba(255,255,255,.75), transparent 70%)" }} />
          <Typo3D zeilen={["KLEINE", "BETRIEBE"]} top={330} groesse={124} farbe={farben.tinte} praegA="#B9A6F5" praegB="#6C3FD4" />
          <div style={{ position: "absolute", left: 360, top: 1210, width: 360, height: 60, borderRadius: "50%", background: "rgba(40,20,110,.35)", filter: "blur(18px)" }} />
          <Objekt x={540} y={830} w={420} h={420} label="LADEN-MINIATUR" emoji="house" hoehe={2} />
          <Marker text="↑ anheben" x={700} y={1080} groesse={64} farbe={farben.violett} dreh={-8} />
          <TiltShift />
          <Untertitel text="Heute bekommen das auch kleine Betriebe." schluessel="Betriebe" />
        </AbsoluteFill>
      );
    case 7: // 8 Nur ich (Signature)
      return (
        <AbsoluteFill>
          <Holz seed={11} />
          <div style={{ position: "absolute", left: 250, top: 560, width: 580, height: 1030, transform: "rotate(-3deg)", overflow: "hidden", borderRadius: 14, boxShadow: `20px 34px 30px ${r04.schatten}` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(0.537)", transformOrigin: "0 0" }}>
              <Matte seed={7} />
              <div style={{ position: "absolute", left: 200, top: 600, transform: "rotate(-5deg)" }}><Karteikarte wort="HOOK" /></div>
              <div style={{ position: "absolute", left: 230, top: 900, transform: "rotate(-3deg)" }}><Karteikarte wort="DETAILS" aktiv /></div>
              <div style={{ position: "absolute", left: 300, top: 300 }}><Filmklappe /></div>
            </div>
          </div>
          <Objekt x={880} y={420} w={230} h={330} dreh={12} label="HANDY AUF STATIV" quelle="echt" />
          <HandPlatzhalter x={180} y={1060} dreh={-40} laenge={760} />
          <Typo3D zeilen={["KEINE FILMCREW."]} top={250} groesse={60} dreh={-3} />
          <Marker text="Nur ich." x={360} y={1180} groesse={150} />
          <TiltShift blur={6} fokus={60} />
          <Untertitel text="Dieses Video? Keine Filmcrew. Nur ich." schluessel="ich" y={1470} />
        </AbsoluteFill>
      );
    default: // 9 CTA
      return (
        <AbsoluteFill>
          <Matte seed={13} />
          <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontFamily: "Barlow", fontWeight: 700, fontSize: 56, color: farben.papier }}>Solleva</div>
          <Typo3D zeilen={["WILLST DU", "DAS AUCH?"]} top={400} groesse={96} />
          <div style={{ position: "absolute", top: 760, left: 120, right: 120, height: 190, borderRadius: 95, background: farben.nacht, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 0 #2A1670, 18px 36px 30px ${r04.schatten}` }}>
            <span style={{ fontFamily: schriftR04.display, fontWeight: 900, fontStretch: "112%", fontSize: 76, color: farben.papier }}>Schreib «Reel»</span>
          </div>
          <Marker text="→ in die DMs" x={360} y={1020} groesse={70} farbe={farben.gold} dreh={-5} />
          <div style={{ position: "absolute", top: 1200, left: 0, right: 0, textAlign: "center", fontFamily: schriftR04.mono, fontSize: 34, color: farben.lavendel }}>@solleva.ch · solleva.ch</div>
          <TiltShift blur={7} fokus={60} />
          <Untertitel text="Willst du das auch? Schreib «Reel»." schluessel="Reel" />
        </AbsoluteFill>
      );
  }
};

const WELTEN = ["Violette Schneidematte, Blätterschatten", "Film-Set-Tisch (Holz) mit Requisiten", "Chef-Schreibtisch: dunkles Holz, Leder", "Retro-Wohnzimmer, Holztäfer, TV", "Helle Lavendel-Matte, Tageslicht", "Violette Schneidematte (Wiederverwendung)", "Helle Matte, Lichtkegel von oben", "ECHTER Tisch + deine Hand (Clip)", "Violette Matte (Wiederverwendung)"];

export const R04Storyboard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SchriftenR04 />
      <Szene nr={f} />
      <div style={{ position: "absolute", top: 110, left: 70, background: "rgba(14,10,40,.82)", color: "#F2C46D", fontFamily: "JetBrains Mono", fontSize: 24, padding: "6px 14px", borderRadius: 8 }}>WELT {f === 7 ? "" : "(HIGGSFIELD)"}: {WELTEN[f]}</div>
      <Koernung staerke={0.06} seed={21} />
    </AbsoluteFill>
  );
};
