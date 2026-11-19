# Solleva Motion-System (Baukasten für Reels)

Status: **v0.2: Bausteine aus 7 Referenzen gebaut, wartet auf Freigabe des Nutzers** (Katalog-Video). Was der Nutzer im Katalog verwirft, wird entfernt; Freigegebenes gilt als Solleva-Stil.

## Regeln
- Es gilt der Skill `reel-produktion` (Ablauf, Freigaben, Stiltest, Stil-DNA, Story-Bauplan, Sound-Regeln) und `motion-design` (Kurven, Timing). Kopie des Skills: `skill/reel-produktion/SKILL.md`.
- **Keine Higgsfield-Generierung und kein Reel ohne ausdrückliche Freigabe des Nutzers.**
- Fester Kern (immer gleich): Farben, Schriften, Endkarte, Stimme, Signatur-Sounds → `src/brand/solleva.ts`.
- Abwechslung (pro Reel wechselnd): Format, Stimmung (S1–S4), Übergangs-Set, Welten, Tempo, Hook-Typ.
- Vor jedem Reel `LOGBUCH.md` lesen: was in den letzten 3 Reels vorkam, nicht wiederholen. Pro Reel mindestens ein neues Element.
- Neue Bausteine bekommen eine feste Nummer und kommen in den Katalog (`src/katalog/Katalog.tsx`).
- Jede Szene in `<Kamera>`; Sounds mit `<Ton nr=… bei=… />` (Hit-Zeiten aus `sounds/sounds.json`).

## Struktur
- `src/brand/solleva.ts`: Farben, Stimmungen S1–S4, Schriften (Barlow, Instrument Serif, JetBrains Mono, Allura, Caveat; Nutzer will Schriften evtl. noch überarbeiten)
- `src/lib/bewegung.ts`: Kurven Land/Heavy/Whip, Helfer · `src/lib/kamera.tsx`: Kamera (nie Stillstand) + Ton (Hit auf Frame)
- `src/welten/Welten.tsx`: W01 Raster, W02 Wellen, W03 Strahlen, W04 Rauten, W05 Lichtkanal, W06 Filz, W07 Nacht
- `src/transitions/Uebergaenge.tsx`: U01–U10, U12, U14–U17 (U09 Lupe, U15 Bild-im-Bild, U16 Licht-Bloom …)
- `src/text/Texteffekte.tsx` (X01–X07) und `Texteffekte2.tsx` (X08–X20)
- `src/bausteine/Bausteine.tsx`: B01 Landen, B06 Eigenschaften-Karten, B07 Kalender-Lauf, E02 Kranz, U13 Stakkato, P01 Schweben, WebKarte
- `src/components/`: Hintergrund, Karte, Label, Cursor (C01), Endkarte (E01)
- `src/katalog/Katalog.tsx`: Katalog-Video aller Bausteine mit Ton
- `sounds/`: Sound-Kit (Mixkit + selbst erzeugt), `sounds.json`, `hoerprobe.html`; `public/sounds` ist ein Symlink darauf
- `docs/referenzen/`: Analysen der Referenzen + Sound-Analyse
- `tools/hoerprobe.py`: baut die Hörprobe-Seiten neu

## Befehle
- `npm install`
- `npx remotion still Katalog out/bild.png --frame=N` (Standbild)
- `npm run katalog` (Katalog-Video mit Ton)
- `python3 tools/hoerprobe.py` (Hörprobe neu bauen)

## CTA (Wunsch des Nutzers, ab Reel «Spielautomat»)
- Standard-CTA ist **«Folge für mehr»** (nicht mehr «Schreib «Analyse»»). Endkarte E01 hat das als Vorgabe.
- Skripte dürfen ausführlicher sein (ca. 30–40 s), wenn sie Wissen faktenbasiert erklären (z. B. Dopamin).

## Lesezeit und Hintergründe (Wunsch des Nutzers, gilt immer)
- **Hooks und Texte nicht zu schnell**: Text baut sich synchron zur Stimme auf und bleibt danach mindestens 1,5 s ganz stehen (Faustregel ≥ 0,3 s pro Wort). Nichts fliegt raus, bevor es gelesen werden kann. Pro Bild höchstens ca. 8 Wörter.
- **Übersichtlich**: oben Text, Mitte EIN Hauptobjekt, höchstens 2–3 Akzente.
- **Hintergründe immer anders und in Bewegung** (Ref. 08 «Batman»): pro Satz ein anderer Hintergrund-Typ, jeder bewegt sich leicht (Strahlen drehen, Tapete schwenkt, Punkte atmen, Spirale dreht).

- **Typografie nie kopieren**: jede Szene bekommt eine eigene Schrift-Idee (Typografie-Set T01–T13 in `src/stil/halbton.tsx`: Erpresser, Etikett, Lotterie-Los, Riso-Doppeldruck, Raster-Wort, Sprechblase, Stempel, Handschrift, Prägeband, Schlagzeile, Kreistext, Wiederholungs-Stapel, Karteikarte). Dieselbe Idee höchstens zweimal pro Reel (z. B. Hook und CTA als Klammer).

## Kamera und Sound (Wunsch des Nutzers ab Reel «Spielautomat» v2)
- **K01 Virtuelle Kamera** (`src/kamera/welt.tsx`): eine Kamera (Scale/Translate) über die ganze Timeline; Ebenen mit Tiefe (Hintergrund 0,3, Hauptobjekt 1,0, Text 1,1, Vordergrund 1,6) → Parallax. Jede Szene hat ein angeschnittenes, unscharfes Vordergrund-Element am Rand.
- **Übergänge als Zoom-Through**: nächste Szene liegt verkleinert in einem 9:16-Fenster des Schlüsselobjekts (mit Rand, damit nie der Objektrahmen aufblitzt); Fahrt 0,7 s, cubic-bezier(0.65,0,0.15,1), danach unsichtbarer Wechsel (Bildabweichung prüfen). Bewegungsunschärfe per Sub-Frame-Mittelung.
- Zwischen den Fahrten: Drift 100→104 %, 2–3 px; Objekte mit Idle (Schweben, Wackeln). Idle vor einer Fahrt auf 0 ausblenden.
- **Filmlook als feste Ebene über allem** (nicht von der Kamera bewegt): Korn, Vignette, 1–2 % Flackern.
- **Sounds minimal und teuer, nichts Futuristisches**: nur natürliche Geräusche (Papier, Schreibmaschine, Holz, Mechanik, Luft, Favoriten ratsche-18/19), wenige Ereignisse, leise. Gemessen synthetisch/tonal und darum meiden: ratsche-09/10 (Arcade), klick-01/02 (UI), pop-*, glitzer-*, glitch-*, riser-02/04, downlifter-02, schlag-01/03/04/06 (Sinus/Synth).
- **Overshoot-Fehler vermeiden**: `overshoot()` startet bei 0 (nur für Pop-Eingänge). Für Landungen `landung()` nehmen (1 → Spitze → 1); sonst verschwindet das Objekt für einen Frame.

## Länge und Tempo (Nutzer-Feedback «Spielautomat» v2 → v3)
- **Zielmass ~30–35 s, höchstens 8–9 Szenen.** 14 Szenen in 47 s waren zu viel: am Ende «kommt man nicht mehr nach».
- Gleiche Motive nicht in mehreren Szenen hintereinander (Walzen 3× am Anfang wirkte langweilig) → zusammenlegen, innerhalb der Szene mit Kamera-Schwenk weiterführen.
- Innerhalb jeder Szene **sichtbare Kamerabewegung**: Stoss auf jedes Schlüsselwort, 1–2 Schwenks, Drift bis 107 %. Nur Drift wirkte «fast zu wenig Bewegung».
- **K02 Lupen-Kamera** (Ref. 01): Ring rollt in 6 Frames von rechts ein, innen 1,6×, Ring bleibt als Vignette, Text mit Farbversatz; Sound swish-06 auf die Landung. Sparsam einsetzen (1× pro Reel).

## Instagram-Safe-Zone und Loop (Nutzer-Feedback «Spielautomat» v4, gilt immer)
- Alles Wichtige (Text, Schlüsselobjekte) in **x 60–940, y 250–1550**. Weil die Kamera zoomt: Text mit Reserve setzen (**x 95–900, y ≥ 300**), Kamera-Zoom in Haltephasen ≤ ~104 % (+ kurze Stösse 3 %). Prüfen mit Safe-Zone-Rahmen über Kontrollbildern.
- **Keine leeren Papierflächen > 0,2 s**: Papier/Label wächst mit dem Text oder ist von Anfang an gefüllt; fehlende Wörter als Kontur vorzeigen (wie «DREH», «Schub»).
- **Kontrast**: auf hellen Hintergründen dunkle Schrift auf hellem Label (`HellLabel`); Hook-Etiketten ≥ 58 px.
- **Hook**: Schlüsselwort steht bis spätestens 0,8 s gross im Bild (nicht erst, wenn es gesprochen wird; dann nur noch ein Puls).
- **Keine halb angeschnittenen, unscharfen Deko-Elemente am Rand** (Münzen etc.): ganz ins Bild und scharf, oder weg.
- **Loop-Ende**: Endcard geht raus, der erste Hintergrund blendet deckungsgleich ein (letzter ≈ erster Frame).
- **Karten** (`assets/cards/`, 2:3, 400 × 600): Walzen-Symbole sind austauschbare Bilder (treffer, niete, stern, frage, klee). Ersetzen durch Illustrationen mit gleichem Namen/Format; Herz der Treffer-Karte bleibt an derselben Stelle (Portal).
- **Animierte Karten/Figuren** (Joker v5): Startbild auf 9:16-Fläche setzen (Kling kann nur 16:9/9:16/1:1), danach Kartenbereich ausschneiden und als **Bildfolge** einbauen (nicht als Video: so läuft sie in Portalen und mit Bewegungsunschärfe exakt synchron). Endbild = Quellframe, der dem letzten Clip-Frame entspricht (Abweichung messen). Upload zu Higgsfield geht nur über `media_import_url` (raw.githubusercontent.com, Repo ist öffentlich); upload.higgsfield.ai ist gesperrt.
- Schnelle Kontrollbilder: `REMOTION_UNSCHAERFE=1 npx remotion still …` (keine Dateiänderung nötig).

## Stil-Rezepte
- Entscheid Nutzer (17.11.2026): Stil-Rezepte sind **Optionen unter mehreren**, kein fester Standard. Pro Reel einen Stil wählen (Abwechslung gemäss Logbuch). Fest für alle Reels gelten nur Kamera K01, Tempo/Länge, Sounds, Lesezeit, CTA.
- **R01 Halbton-Collage** (`src/stil/halbton.tsx`, Reel «Spielautomat», **vom Nutzer gut befunden** «sieht sehr sehr gut aus», 17.11.2026): Halbton-Ausschnitte s/w mit weissem Papierrand, gerissenes Papier, Erpresserbrief-Buchstaben (Schlüsselwort), schwarze Etiketten (Mono) für den Rest des Satzes. Farben: Papier #ECE9E2, Schwarz #121212, Rot #D7232B, Gelb #FFD21F, Violett #6C3FD4. Hintergründe H1 Strahlen, H2 Zeitung, H3 Punkte, H4 Schwarzpapier, H5 Karo, H6 Halbton-Kreis, H7 Packpapier, H8 Spirale. Objekte: Higgsfield (Prompt-Kern: «vintage black and white halftone cutout, white paper border, plain white background»), danach freistellen.
- Neue Bausteine aus Reel «Spielautomat» (noch nicht im Katalog-Video): **B08 Walze** (`src/bausteine/Walze.tsx`, animiert in `Stiltest.tsx`), **U18 Riss**, **U19 Kulissen-Klappe**, **U20 Papier-Wischer**, **U21 Zoom ins Bild** (alle in `src/reels/spielautomat/Reel.tsx`, Funktion `Uebergang`), Text-Eingänge `Rein` (slap, stempel, fall, pop, schreiben, rutsch).
- **R02 Papiertheater** (`src/reels/spielautomat/Collage.tsx`, Ref. 08): Bühne mit Vorhängen, Strahlen, Kupferstich-Requisiten an Fäden, Fell-Serif. Noch nicht eingesetzt.

## Bildsprache (Wunsch des Nutzers, gilt immer)
- **Nicht nur Folien mit Text**: jede Szene bekommt ein Bild zur Veranschaulichung.
- **Hauptbilder = echte, generierte Objekte/Figuren** (Higgsfield, freigestellt): z. B. realistisches **Gehirn**, **griechische Männer/Marmor-Statuen**, Cartoon-Figuren, PC fällt vom Himmel. **Nicht** die Emoji-Version davon.
- `assets/emoji/` (74 Fluent 3D, MIT, `src/bausteine/Emoji.tsx`) = **nur kleine Akzente**, kein Ersatz für Hauptbilder. **Keine Smiley-Gesichter** (Nutzer mag sie nicht), auch nicht als Platzhalter; Gefühle über echte Motive zeigen (z. B. gähnende Marmorbüste statt schlafender Smiley).
- Figuren/Objekte/Foto-Hintergründe mit Higgsfield **nur nach Freigabe**, danach in `assets/` speichern und wiederverwenden.
- Hintergründe: Nutzer findet sie noch zu schlicht → pro Reel 1–3 Foto/Textur-Hintergründe vorschlagen.

## Offen
- Ratsche erledigt: Favoriten ratsche-18 (rollt aus) und ratsche-19 (gleichmässig).
- Musik Reel «Spielautomat»: Nutzer wählt **Variante 3 «Kino-Puls»** (gezupfte Streicher, tiefes Klavier, weicher Puls, 103 BPM, d-Moll, kein klassischer Beat) aus 3 ElevenLabs-Varianten. Richtung Batman-Reel (Ref. 08): dunkel, filmisch, ~103 BPM, Moll. Musik ~10 dB unter der Stimme, Sidechain-Ducking, 0,8 s Fade-out (`assets/spielautomat/musik/`).
- Tiefere Stimme bei Higgsfield testen (kostet Credits, nur mit Freigabe).
- Collage-Foto-Objekte (Hände, Geräte) via Higgsfield erst nach Freigabe.
