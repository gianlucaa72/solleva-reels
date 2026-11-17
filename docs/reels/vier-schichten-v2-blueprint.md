# «4 Schichten» v2 – Blueprint / Explosionszeichnung (Steckbrief + Selbst-Freigabe)

Auftrag 17.11.2026: visuell komplett umbauen, Inhalt/Texte/Reihenfolge/Timing bleiben. Nutzer unterwegs → Freigabe und Stiltest selbst.
**Keine Higgsfield-/Bezahl-Generierung.** Stimme (Andre) und `timeline.json` aus v1 unverändert (34,9 s; der Auftrag nennt 25 s, massgebend ist «Timing bleibt»).

## Annahmen (Auftragstext brach mitten im Satz ab)
- Serifen-Akzentwort max. 2×: **«nie»** (Hook) und **«zusammen»** (Finale). Claim der Endkarte «Masse» deshalb ohne Serif (lila Unterstrich).
- Die angekündigte Checkliste «unten» fehlte → Checkliste unten aus dem Auftrag abgeleitet.

## Look
- **Eine Einstellung, eine Welt:** Blaupausen-Navy `#0A1130` (Solleva-Nacht, minimal blauer), Raster 30 px weiss 5 % + 150 px weiss 8 %, Papierkorn (Noise 7 %). Kein Verlauf, kein Spot, kein Nebel, kein Blur-Fleck.
- **Explosionszeichnung:** 4 Platten (Website 720×520) übereinander, Abstand 330. Oben 01 Marke … unten 04 Fundament. Eigene Projektion in SVG (gestochen scharfe Linien, `non-scaling-stroke`).
- **Inaktiv:** weisse Strichzeichnung 1,75 px, 40 %; Eck-Fadenkreuze, gestrichelte Explosionslinien zwischen den Ecken, Masslinien mit Pfeilen.
- **Aktiv:** Platte bekommt Lila-Kontur 2,5 px + ihre Inhalte in Weiss 90 %. Lila **nur** für aktive Platte / aktiven Button / CTA.
- **60/30/10:** Navy-Fläche ≈ 60 %+, Weiss-Linien/Text ≈ 30 %, Lila ≤ 10 %.
- **Typo:** Ziffern 01–04 als Outline (Barlow 800, 420 px, weisse Kontur 2 px), zeichnen sich per Strich ein, alte Ziffer fliegt raus (Ausgang schneller). Headlines Barlow 800 weiss ≥ 64 px, abwechselnd links/rechts der Ziffer. Labels/Masse JetBrains Mono Versalien.
- **Kein** Glas, keine Pillen, kein schwebendes Handy, keine Lavendel-Flächen, kein Stock-Foto. «Echte Bilder» = eigenes Foto-Feld (Graustufen) mit durchgestrichenem «STOCK».

## Kamera (durchgehend, Heavy-Kurven 22–26 Frames, startet 6 Frames vor dem Satz)
Hook weit (alle 4) → S3 Platte 01 → S4 Platte 02 → S5 Platte 03 → S6 Platte 04 (von oben nach unten durch den Stapel) → S9 weit, Platten fahren zusammen und rasten ein → S10 Seite sinkt nach unten, Endkarte im selben Raum.

## Signature (Satz 6, Frame 548 «vier»)
Statt Weltwechsel: **Licht aus im selben Raum** – 2 Frames fast schwarz (Raster weg), dann zeichnet sich Platte 04 per Scan in Lila ein, Ziffer 04 zeichnet sich, Schlag-02 + (später) Drop.

## Übergänge (max. 2 Arten)
1. Kamerafahrt durch den Stapel (Match über Platten), 2. Ziffern-Wechsel (Strich-Einzeichnen). Sonst keine.

## Checkliste (Stiltest + Abgabe)
1. Durchgehend derselbe Navy-Hintergrund, kein Weltwechsel, kein Verlauf/Spot/Nebel.
2. Lila nur auf aktiver Platte/Button/CTA, Fläche ≤ 10 % (gemessen).
3. Serif-Kursiv genau 2× (nie, zusammen).
4. Ziffern 01–04 outline 380–450 px, Wechsel = alte raus, neue zeichnet sich ein.
5. Headlines weiss ≥ 64 px, Position wechselt links/rechts.
6. Inaktives = weisse Linien 1,5–2 px, 30–60 % + Masslinien/Fadenkreuze.
7. Keine Glas-Pillen, keine Handys, kein Stock-Bild, keine Lavendel-Flächen.
8. Safe Zones: Text 220–1540, rechts ≤ 940 px; CTA nicht im unteren Fünftel.
9. Jede Bewegung Land/Heavy/Whip, Ausgänge schneller, ein Anführer pro Moment, Standbild lebt (Drift/Zoom).
10. Ton −14 LUFS ±1, Peak ≤ −1 dBFS; Schlag exakt auf «vier».

## Ergebnis v2 (17.11.2026) – `docs/reels/final/vier-schichten-v2-ohne-musik.mp4`
Code: `src/reels/vierSchichten/Blueprint.tsx`, Komposition `VierSchichtenV2`. v1 bleibt unverändert (`VierSchichten`).
Messwerte: 34,9 s · 1080×1920 · 30 fps · yuv420p TV · −13,8 LUFS · Peak −1,4 dBFS. Higgsfield: 0 Credits.

### Selbst-Freigabe / Stiltest (3 Korrekturschleifen vor dem Vollrender)
1. Ziffern waren gestrichelt (pathLength wirkt bei SVG-Text nicht) → echte Strichlänge.
2. Callouts liefen aus dem Bild → Text richtet sich zur Bildmitte, Navy-Hinterlegung.
3. Aktive Platte zu klein → Zoom 1,1–1,14; Hook startet nah und zieht auf «vier» zurück.
4. Ziffern überdeckten Headlines → Laufweite −46, Spalten getrennt.
5. Headline Satz 6 stand sofort komplett → «Und vier …» / «… sieht keiner.» wortgenau; «keiner» bekommt Konturpuls + Callout.
6. Im Finale verdeckten die Plattenflächen den Button → Flächen werden beim Einrasten transparent; WAS/WO-Rahmen blenden aus.

### Checkliste
| # | Punkt | Ergebnis |
|---|---|---|
| 1 | eine Welt, kein Verlauf/Spot/Nebel | ✓ Navy + Raster + Korn durchgehend |
| 2 | Lila ≤ 10 % | ✓ gemessen Ø 0,8 %, max. 5,9 % (Endkarte) |
| 3 | Serif genau 2× | ✓ «nie», «zusammen» |
| 4 | Ziffern outline ~400 px, Wechsel raus/einzeichnen | ✓ |
| 5 | Headlines weiss ≥ 64 px, links/rechts | ✓ 64–108 px, Seite wechselt mit Ziffer |
| 6 | Linien weiss 1,5–2 px, 30–60 % + Masse/Fadenkreuze | ✓ (Weiss-Fläche gemessen nur 1,4 %, weil Linien dünn sind; die 30 % sind als Bildanteil der Zeichnung gemeint, nicht messbar als Fläche) |
| 7 | kein Glas/Handy/Stock/Lavendel | ✓ (Handy nur als gestrichelter Viewport-Rahmen auf Platte 04) |
| 8 | Safe Zones | ✓ Text 230–1520, CTA 900–1060 |
| 9 | Kurven/Ausgänge/Anführer/Drift | ✓ Heavy-Kamera, Land-Text, Whip-Klicks, Ausgänge 5–7 Frames |
| 10 | Ton, Schlag auf «vier» | ✓ Frame 548 |

### Offen
- Musik (Beat) fehlt weiterhin; Prop `mitMusik`, Drop auf Frame 548.
- Gym-Foto im Foto-Feld ist das Higgsfield-Bild aus v1 (bereits bezahlt, wiederverwendet), in Graustufen.

## Musik (17.11.2026)
Mixkit #299 (`assets/reels/vier-schichten/beat-mixkit-299.mp3`, Mixkit-Lizenz, Titel unbekannt). Start im Song 36,59 s → Drop (54,86 s im Song) exakt auf Frame 548 «vier». Vor dem Drop −26 LUFS, nach dem Drop −23 LUFS (Wunsch Nutzer: Drop etwas leiser als Hörprobe), Fade-in 0,4 s, Fade-out 0,8 s, Gesamt loudnorm −14 LUFS. Fassungen: `final/vier-schichten-v2.mp4` (mit Musik) und `final/vier-schichten-v2-ohne-musik.mp4`.
