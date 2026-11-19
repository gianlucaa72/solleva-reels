---
name: reel-produktion
description: Fester Ablauf für hochwertige Kurzvideos (Instagram-Reels, YouTube Shorts, TikTok) für Solleva, giani.hockey, Lieblingsfund und Kunden. Verwenden bei jedem Reel, Short, Promo- oder Erklärvideo mit KI-Stimme und Motion Graphics, auch wenn nur «mach ein Reel/Video über …» oder «heute machen wir ein Reel» gesagt wird. Legt Referenz-Intake (Pinterest-Bilder, kurze Clips, vier Fragen), Referenz-Analyse, Stil-Steckbrief mit Storyboard zur Freigabe, 5-Sekunden-Stiltest vor jedem Credit-Verbrauch, Skript, KI-Voiceover, durchgehende Kamera mit Zoom-Through, Instagram-Safe-Zone, Sound, Musik zur Auswahl, Loop und Abgabe verbindlich fest, damit das erste Ergebnis schon stimmt.
---

# Reel-Produktion: so machen wir unsere Videos

Ziel: Jedes Video erzeugt beim Nutzer und bei den Zuschauern einen WOW-Effekt, und zwar mit **höchstens einer Korrekturrunde**. Der Nutzer gibt sich nicht mit 60 % zufrieden. Grundlage sind Referenzen, die wirklich funktionieren (Zane Hoyer «ChatGPT vs Claude Motion Graphics», City Chicken, Amazon, EarnEdits «Buffett»/«Batman») und die Referenzen, die der Nutzer pro Reel mitbringt. Das Rezept:

> **Erst verstehen, dann bauen. Die Referenzen werden zerlegt und als Steckbrief bestätigt, bevor etwas animiert wird. Die Stimme gibt den Takt vor. Jeder Satz ist ein klarer Moment mit einem echten Bild. Eine Kamera, ein Look. Credits fliessen erst, wenn ein 5-Sekunden-Stiltest überzeugt.**

Warum dieser Ablauf: Beim ersten Solleva-Reel wurden Referenzen geliefert, aber nur teilweise umgesetzt. Ergebnis «gut, aber nicht überragend». Ursache war nicht das Werkzeug, sondern dass ohne bestätigte Analyse direkt das ganze Reel gebaut wurde. Claude sieht Videos nur als Einzelbilder und hört keinen Ton. Was der Nutzer an einer Referenz liebt, muss deshalb **ausgesprochen, zerlegt und bestätigt** werden; jedes Klangurteil holt Claude beim Nutzer ab.

Was wir NICHT mehr machen (hat sich als «cool, aber nicht überzeugend» erwiesen): direkt das ganze Reel bauen, ohne dass Steckbrief und Stiltest freigegeben sind; Referenzen nur «ungefähr» umsetzen; ein Film ohne Stimme; eine Einstellung über 5 s; 15 s dieselbe dunkle Farbe; Effekt-Sammlungen (Lens Flares, Lichtfasern, Glow überall); Musik, die niemand ausgewählt hat; Folien mit Text statt Bildern; Smiley-Emojis als Bildersatz; futuristische/synthetische Soundeffekte; 14 Szenen in 47 s («am Ende kommt man nicht mehr nach»).

**Arbeitsteilung (Hybrid):**
- **Code (Remotion/React, TypeScript) baut Claude:** Kamera, Ebenen, Typografie, UI- und Website-Demos, Übergänge, Captions, exaktes Timing, Markenfarben.
- **Higgsfield liefert:** freigestellte Objekte und Figuren, Textur-Hintergründe, Animationen von Figuren/Karten (Kling), Stimme, Musik-Varianten, Soundeffekte. Nie für exakten Text oder UI; Text kommt immer als Code-Ebene darüber.
- **Echtes Material vor generiertem:** eigene Aufnahmen und Illustrationen des Nutzers (z. B. Hockey-Clips, Screenshots, eigene Karten-Illustrationen) haben Vorrang.
- Ein Schnittprogramm (DaVinci Resolve oder CapCut) braucht es nur, wenn der Nutzer selbst feinjustieren will.

## Baukasten: Repository `gianlucaa72/solleva-reels` (zuerst laden!)
Jede Reel-Sitzung beginnt mit: Repo anhängen (`add_repo`), klonen, `npm install`, `CLAUDE.md`, `LOGBUCH.md` und `docs/referenzen/` lesen. Dort liegen:
- **Marken-Kern** `src/brand/solleva.ts` (Farben, Stimmungen S1–S4, Schriften), **Kurven** `src/lib/bewegung.ts` (`landung()` für Landungen, `overshoot()` nur für Pop-Eingänge), **Ton** `src/lib/kamera.tsx` (`<Ton nr=… bei=… />`)
- **Kamera K01** `src/kamera/welt.tsx` (Ebenen mit Tiefe, Zoom-Through, Bewegungsunschärfe, Filmlook), **Lupe K02** (Reel «Spielautomat» v3–v5)
- **Stil-Rezepte**: R01 Halbton-Collage `src/stil/halbton.tsx` (Hintergründe H1–H8, Typografie T01–T13), R02 Papiertheater (Entwurf)
- **Welten** W01–W07, **Übergänge** U01–U21, **Texteffekte** X01–X20, **Bausteine** B01/B06/B07/B08 Walze/E02/U13/P01, Cursor C01, Endkarte E01
- **Karten** `assets/cards/` (2:3, austauschbare Walzen-Symbole), **Assets** pro Reel in `assets/<reel>/`
- **Sound-Kit** `sounds/` (Mixkit + selbst erzeugt) mit Hit-Zeiten in `sounds.json`, Hörprobe `sounds/hoerprobe.html`
- **Katalog** `src/katalog/Katalog.tsx` (alle Bausteine mit Nummer und Ton)
- Vorlage für ein ganzes Reel mit K01: `src/reels/spielautomat/v5/Voll5.tsx`

Erst Bausteine und Assets aus dem Baukasten nehmen; Neues nur ergänzen und mit Nummer in Katalog + `CLAUDE.md` aufnehmen.

## Content-Strategie (Vorgabe des Nutzers, gilt für jedes Reel)
**Ausgangslage:** Bisherige Reels 100–250 Aufrufe, weil sie wie Werbung wirkten («Ich mache Websites»). Ziel: **zuerst Reichweite durch Unterhaltung/Neugier, dann Vertrauen, erst dann Verkauf.**
1. **Themen breit**: Websites, Social Media, Marketing, Psychologie des Klickens, digitaler Erfolg von Firmen. Website ist **ein** Thema unter vielen.
2. **Formate wechseln** (Content-Säulen): Fallgeschichte · Vergleich (A gegen B, Mythos gegen Wahrheit) · Tipp/Hack · Hinter den Kulissen · **Psychologie/Wissen** (z. B. «Dein Daumen ist an einem Spielautomaten» – Dopamin) · Lokal/KMU.
3. **Die Story trägt alles**: Hook in Sekunde 1, Spannung, Twist, Auflösung (Story-Bauplan). Erst die Story, dann Bilder und Effekte.
4. **Bildlich denken**: Jeder Satz hat ein starkes, wörtliches Bild (Gehirn, Marmorbüste, Zirkuskanone, Joker-Karte …), keine Listen auf Folien.
5. **Nichts von der Stange**: jedes Reel anders in Format, Stil-Rezept, Erzählweise (Logbuch prüfen).
6. **Solleva dezent als Absender**: Standard-CTA **«Folge für mehr»**, kein Verkaufsgespräch.
7. **Erzähler**: Ich-Form (Gianluca) **oder neutraler Erzähler** (wie Buffett-/Batman-Reels), je nach Thema.
8. **Fakten**: recherchieren, Quellen im Freigabe-Paket nennen; nichts Unbelegtes behaupten, keine erfundenen Zahlen. Zuspitzungen als solche kennzeichnen. Keine Markenlogos/Marken-Assets nachbauen; Firmen nur im Text/Ton nennen. Referenzen werden im **Stil** nachgebaut, nie 1:1 (keine fremden Figuren wie Batman).

## Stil-DNA (gilt für jedes Reel)
1. **Eine durchgehende Kamera (K01)**: alle Szenen liegen in einer Welt; die Kamera ist eine einzige Scale/Translate-Animation über die ganze Timeline. Ebenen mit Tiefe: Hintergrund 0,3 · Hauptobjekt 1,0 · Text 1,1 · Vordergrund 1,6 → Parallax.
2. **Übergänge als Zoom-Through**: die nächste Szene liegt verkleinert in einem 9:16-Fenster eines Schlüsselobjekts der aktuellen Szene (Handy-Bildschirm, Münze, Tropfen, Rauchwolke, Laptop, Pokal …). Fahrt **0,7 s, cubic-bezier(0.65,0,0.15,1)**, Bewegungsunschärfe, danach unsichtbarer Wechsel. Höchstens **ein** bewusster harter Schnitt pro Reel (Bruch-Moment).
3. **Nichts steht still, aber nichts schiesst Text aus dem Bild**: Drift 100 → 104 %, 2–4 px seitlich; **Kamera-Stoss (3 %) auf jedes Schlüsselwort**; 1–2 kleine Schwenks pro Szene; Objekte mit Idle (Schweben, Wackeln, rieselnder Sand). Idle vor jeder Fahrt auf 0 ausblenden (sonst trifft die Kamera das Fenster nicht).
4. **Alle 0,3–0,6 s ein Ereignis** (Wort, Objekt, Stoss), gleiche Szene max. ~2,5–3 s.
5. **Pro Satz eine neue Welt**: anderer Hintergrund-Typ, jeder Hintergrund bewegt sich (Strahlen drehen, Tapete schwenkt, Punkte atmen, Spirale dreht). Hintergründe mit **echter Textur** (Higgsfield), nicht flach im Code.
6. **Wörtliche Bilder**: jedes Bild illustriert das gesprochene Wort. **Hauptbilder sind echte, generierte Objekte/Figuren** (freigestellt, im Stil des Rezepts). Emojis nur als kleine Akzente; **keine Smiley-Gesichter**, auch nicht als Platzhalter – Gefühle über echte Motive (gähnende Marmorbüste statt schlafender Smiley).
7. **Typografie nie kopieren**: jede Szene eine eigene Schrift-Idee (z. B. Erpresser, Etikett, Lotterie-Los, Riso, Raster-Wort, Sprechblase, Stempel, Handschrift, Prägeband, Schlagzeile, Kreistext, Wiederholungs-Stapel, Karteikarte). Dieselbe Idee höchstens zweimal (Hook und CTA als Klammer).
8. **Filmlook als feste Ebene über allem** (nicht von der Kamera bewegt): Korn, Vignette, 1–2 % Flackern.
9. **Stil-Rezepte sind Optionen, kein Standard** (Entscheid Nutzer): pro Reel eines wählen (R01 Halbton-Collage, R02 Papiertheater, Solleva hell «Ref. 05» …) oder ein neues aus Referenzen ableiten. Fest für alle Reels gelten nur Kamera, Tempo/Länge, Sounds, Lesezeit, Safe Zone, CTA.

## Lesbarkeit, Safe Zone, Loop (gilt immer, Feedback «Spielautomat» v4)
- **Instagram-Safe-Zone**: alles Wichtige in **x 60–940, y 250–1550** (rechts Buttons, unten Caption). Weil die Kamera zoomt, Text mit Reserve setzen: **x 95–900, y ≥ 300**. Kein wichtiges Element unter die rechten Buttons.
- **Hook**: das Schlüsselwort steht **bis spätestens 0,8 s gross im Bild** (nicht erst, wenn es gesprochen wird; dann nur noch ein Puls). Hook-Etiketten ≥ 58 px.
- **Lesezeit**: Text baut sich synchron zur Stimme auf und bleibt ≥ 1,5 s ganz stehen (≥ 0,3 s pro Wort). Pro Bild höchstens ca. 8 Wörter.
- **Übersicht**: oben Text, Mitte EIN Hauptobjekt, höchstens 2–3 Akzente.
- **Keine leeren Papierflächen > 0,2 s**: Papier/Label wächst mit dem Text oder ist von Anfang an gefüllt; noch nicht gesprochene Wörter als Kontur vorzeigen.
- **Kontrast**: auf hellen Hintergründen dunkle Schrift auf hellem Label; nie hellgraue Schrift auf hellem Grund.
- **Keine halb angeschnittenen, unscharfen Deko-Elemente am Rand**: ganz ins Bild und scharf, oder weg.
- **Loop-Ende**: Endkarte geht raus, der erste Hintergrund blendet deckungsgleich ein (letzter ≈ erster Frame, messen).

## Länge und Tempo (Feedback «Spielautomat» v2 → v3)
- **Zielmass 30–35 s, höchstens 8–9 Szenen.** Lieber Sätze zusammenlegen als Szenen stapeln.
- Gleiche Motive nicht in mehreren Szenen hintereinander → zusammenlegen und innerhalb der Szene mit Kamera-Schwenk weiterführen.
- Stimme darf 3–5 % schneller laufen (`atempo`), wenn das Reel sonst zu lang wird.

## Story-Bauplan (Vorlage)
1. **Hook** mit konkreter Szene oder Widerspruch (0–1 s) · 2. **Vergleich**, der sie fühlbar macht · 3. **Twist** («Aber …») · 4. **Erklärung/Spannung** · 5. **Rätsel** («Warum?») · 6. **Beweis/Muster** · 7. **Übertrag auf den Zuschauer** · 8. **CTA**. Pro Reel ein **Humor-/Bruch-Moment** und ein **Signature-Moment** (z. B. Joker knallt aus der Walze, lacht, Kamera fährt durch die Münze).

## Abwechslung (damit es nach 3–4 Reels nicht langweilig wird)
- Fester Kern: Kamera K01, Stimme, Endkarte/CTA, Safe Zone, Sound-Haltung, Qualität.
- Wechselt pro Reel: **Format**, **Stil-Rezept/Farbwelt**, **Schlüsselobjekte für die Zoom-Throughs**, **Hintergrund-Typen**, **Typografie-Ideen**, **Hook-Typ**, **Musik-Richtung**.
- Vor jedem Reel `LOGBUCH.md` lesen: Kombination der letzten 3 Reels nicht wiederholen; **pro Reel mindestens ein neues Element**. Nach Abgabe Logbuch-Zeile ergänzen.

## Sound-Haltung (Feedback «Spielautomat» v2)
- **Minimal und teuer, nichts Futuristisches**: nur natürliche Geräusche (Papier, Schreibmaschine, Holz, Mechanik, Luft, Favoriten ratsche-18/19), wenige Ereignisse, leise unter der Stimme.
- Gemessen synthetisch/tonal und darum meiden: ratsche-09/10 (Arcade), klick-01/02 (UI), pop-*, glitzer-*, glitch-*, riser-02/04, downlifter-02, schlag-01/03/04/06 (Sinus/Synth).
- **Swish/Whoosh 1–3 Frames VOR** der Bewegung, **Klick/Schlag exakt** auf Landung/Einrasten; Zoom-Through → Luft-Whoosh; Lupe → swish-06 auf die Landung.
- Charakter-Sounds (z. B. «dreckiges Joker-Lachen») gezielt einsetzen: generieren (Higgsfield Mirelo, ~0,75 Credits) oder Mixkit; **zentral und laut genug** (etwa so laut wie die Stimme), Einsatz genau auf den sichtbaren Moment, unter der Stimme nur leicht leiser.
- Neue Favoriten oder Ausschlüsse des Nutzers in `sounds/README.md` und `CLAUDE.md` nachführen.

Zusätzlich gilt immer der Skill **motion-design** (Kurven Land/Heavy/Whip, ein Anführer pro Moment, Ausgänge schneller als Eingänge, Standbilder leben weiter).

**Pflicht-Freigaben (sonst ohne Rückfrage durcharbeiten):**
1. Freigabe-Paket (Steckbrief + Skript + Storyboard), Schritt 3
2. Stimmwahl beim ersten Video eines Kanals, Schritt 4
3. 5-Sekunden-Stiltest, Schritt 5
4. **Jede Higgsfield-Generierung mit Kosten** (Bilder, Videos, Musik, Sounds): Kosten vorher mit `estimate_*` nennen, Freigabe abwarten.

---

## Ablauf (immer in dieser Reihenfolge)

### 1. Brief und Referenz-Intake (eine Nachricht, nur nachfragen, was fehlt)
Typischer Start: «Heute machen wir ein Reel über X.» Dann gemeinsam klären:
- **Kanal:** Solleva, giani.hockey, Lieblingsfund oder Kunde → bestimmt den Basis-Steckbrief (unten).
- **Eine Botschaft** in einem Satz, **Zielgruppe**, **CTA** (Standard Solleva: «Folge für mehr»).
- **Länge:** 30–35 s, höchstens 8–9 Szenen.
- Hat der Nutzer kein Thema: 3–5 Ideen aus verschiedenen Content-Säulen vorschlagen (mit Hook-Satz und Signature-Moment), eine empfehlen.

**Referenzen: drei Bausteine** (Upload-Limit des Nutzers: 30 MB pro Datei)
1. **Pinterest-Bilder für den Look** (5–10 Stück): Hintergründe, Farben, Schriften, Licht, Objekte.
2. **2–3 kurze Clips für die Bewegung:** 5–15 s, nur der Teil, der packt, **1080p, mit Ton, MP4**, jeder Clip einzeln. **Keine 480p-Aufnahmen.**
3. **Sound als Titel, Link oder Clip:** Tempo und Energie. Musik kann Claude auch als Varianten generieren (Schritt 8).

**Die vier Fragen pro Clip** (Stichworte reichen):
1. **Was genau?** Zeitangabe + Stelle, z. B. «0:04, wie der Text reinkommt».
2. **Wie fühlt es sich an?** z. B. edel, verspielt, hart, ruhig, schnell, teuer.
3. **Was übernehmen?** nur die Übergänge / den ganzen Look / nur die Schrift / den Rhythmus.
4. **Was NICHT übernehmen?** z. B. «zu hektisch», «Farben passen nicht zu uns».

Fehlen Referenzen: mit dem Basis-Steckbrief und den bereits analysierten Referenzen (`docs/referenzen/`) arbeiten und das im Freigabe-Paket klar sagen. Kann der Nutzer einen Stil nicht benennen: Stil benennen und Suchbegriffe für Pinterest vorschlagen (z. B. «halftone collage», «vintage collage animation»).

### 2. Referenz-Analyse (Claude, ohne Rückfrage)
- **Einzelbilder:** rund um jede genannte Stelle 15–30 Bilder pro Sekunde (`ffmpeg -ss T-0.5 -t 1.5 -i clip.mp4 -vf fps=24,scale=540:-1 f_%03d.png`), dazu ein Kontaktbogen des ganzen Clips (4 fps, `tile`). Alle Bilder ansehen.
- **Szenenwechsel messen:** `select='gt(scene,0.3)',showinfo` (findet nichts → die Referenz verbindet alles über Bewegung).
- **Übergänge bestimmen:** Art (Zoom-Through, Push, Match-Cut, Maske, Lupe, Objekt-Wischer), **Dauer in Frames**, Easing, Reihenfolge der Bewegungen.
- **Look:** Farbpalette als Hex, Hintergrund-Aufbau (Textur, Ebenen, Licht), Formsprache.
- **Schrift:** Klasse und Merkmale bestimmen, nächste freie Entsprechung (Google Fonts/Fontshare) wählen. Nicht behaupten, die Originalschrift sicher zu kennen.
- **Ton (Claude hört nicht):** Tempo (BPM), Tonart, Energieverlauf, harmonisch/perkussiv, Lautheit messen (librosa/ffmpeg) und gegen die Schnittliste legen. Klangcharakter aus der Beschreibung des Nutzers übernehmen, nie erfinden.
- **Bildquelle erkennen**: Sieht eine Referenz nach KI-Bild aus (glatt, verwaschene Details, inkonsistente Rahmen), dann Rahmen/Text/Etiketten im Code bauen, einen Prompt-Kern für alle Objekte verwenden und jedes Bild prüfen (Hände, Ränder, kein KI-Text).
- Analyse als `docs/referenzen/refNN-<name>.md` speichern (Tabelle «Zeit → Bild/Übergang» + «Gesehen → so setze ich es um»).

### 3. Freigabe-Paket: Steckbrief + Skript + Storyboard (Pflicht-Freigabe)
Alles in **einer** Nachricht.

**a) Stil-Steckbrief**: Stil-Rezept, Farben (Hex), Hintergrund-Typ pro Szene, Typografie-Idee pro Szene, Schlüsselobjekt pro Zoom-Through, Sound-Momente, Herkunft jeder Szene (Code / Higgsfield / Material des Nutzers). **Pro Referenz-Notiz eine Zeile «Gesehen → so setze ich es um».** Widerspricht eine Referenz dem Kanal-Steckbrief: ausdrücklich nachfragen.

**b) Skript** (eine Zeile = ein Moment)

```
#  | Satz                                         | Schlüsselwort | Bild / Typografie        | Zoom-Through in …   | Quelle
1  | Dein Daumen zieht gerade an einem Spielautomaten. | Spielautomaten | Hand zieht Handy-Hebel, Erpresserbrief | Handy-Bildschirm | Higgsfield + Code
```

Regeln:
- **8–11 Sätze in höchstens 8–9 Szenen**, je 4–9 Wörter.
- **Satz 1 = Hook** in der ersten Sekunde, Schlüsselwort bis 0,8 s im Bild. Kein Logo am Anfang.
- **Pro Satz genau ein Schlüsselwort.** Ein Humor-/Bruch-Moment, ein Signature-Moment (markieren).
- **Letzter Satz = CTA** «Folge für mehr», Endkarte ≥ 1,5 s, danach Loop zum ersten Bild.
- Du-Form zum Zuschauer, Schweizer «ss», keine erfundenen Zahlen/Rankings/Kundennamen. Fakten mit Quelle (z. B. Dopamin = Erwartung/«wanting», Vorhersagefehler, Ungewissheit).

**c) Storyboard als Standbilder**: pro Szene ein gerendertes Schlüsselbild (Remotion `still`, ohne Credits) als Kontaktbogen, mit Safe-Zone-Rahmen. Higgsfield-Objekte als neutrale Platzhalter-Silhouetten (keine Smileys) mit Prompt-Entwurf. **Kosten-Schätzung** für alle geplanten Generierungen.

**Erst nach Freigabe weiter.** Korrekturen hier kosten nichts.

### 4. KI-Voiceover (Higgsfield)
- Engine `text2speech_v2`, Variante `elevenlabs`. **Solleva-Stimme: «Andre»** (voice_id `f1e8226e-2248-4d5f-b43c-0a79e9949dbf`, preset). Bei neuen Kanälen 3 Proben zur Wahl.
- Kosten vorher nennen (ca. 0,15 Credits pro Satz). **Jeder Satz als eigene Datei** (Batch).
- Stille vorne/hinten wegschneiden, auf −16 LUFS normalisieren; Wortgrenzen per Hüllkurve (10 ms) messen. Pausen ~0,2–0,3 s, nach dem Hook eine kurze Lesepause, am Schluss ~1,6–2 s Halt.
- Alle Zeiten in **einer** Zeitleiste (Frames bei 30 fps, Wortmarken pro Satz). Jeder visuelle Beat sitzt auf einem gesprochenen Wort.

### 5. 5-Sekunden-Stiltest (Pflicht-Freigabe, erst hier fliessen Credits)
- Nur den Hook bzw. Signature-Moment fertig bauen: Kamera, Hintergrund, Objekt, Typografie, erster Zoom-Through, Stimme, Sounds.
- Higgsfield **nur für diese Szene**; lieber 2 Varianten als 1 blind.
- Als MP4 abgeben + Kontrollbilder. Frage: «Hat das den WOW-Effekt? Was fehlt noch?» Nur bei Ja das ganze Reel bauen.

### 6. Ganzes Reel bauen
- Bei Collage/filmisch mit durchgehender Kamera **eine Version** (der Stiltest ersetzt den A/B-Vergleich). Bei UI-/Website-Themen bleibt **A «Interaktive UI im ganzen Bild»** (Cursor treibt die Story, durchgehende Arbeitsfläche, Ende im grossen CTA-Button) gegen **B «Text oben + Karte»** mit Best-of-Schnitt Standard.
- Objekte und Hintergründe für alle Szenen in **einem** Durchgang generieren (höchstens 8 Higgsfield-Aufträge gleichzeitig, sonst 429), Objekte freistellen, in `assets/<reel>/` speichern.
- **Zoom-Through bauen**: Fenster (9:16) vollständig innerhalb des sichtbaren Portal-Ausschnitts (bei runden Portalen: Ecken im Kreis); freie Formen (Herz, Tropfen) als SVG-Maske, nicht CSS `path()`; Hintergründe der eingebetteten Szene gross genug (Rand mit gespiegelter Textur), damit nie Leerfläche aufblitzt. Bildabweichung am Wechsel messen (≈ letzter Zoom-Schritt).
- **Animierte Figuren/Karten** (z. B. Joker lacht, flippt Münze): Startbild auf 9:16-Fläche setzen (Kling kann nur 16:9/9:16/1:1), 2 Varianten generieren, beste wählen, Kartenbereich ausschneiden, Tempo anpassen und als **Bildfolge** einbauen (läuft so auch in Portalen und mit Bewegungsunschärfe synchron). Endbild = Quellframe, der dem letzten Clip-Frame entspricht; Zielobjekt im Endbild neu vermessen.
- **Karten-Walzen**: Symbole sind Bilder in `assets/cards/` (2:3); Walzenfeld im Format 2:3.

### 7. Kontrolle während des Baus
- Kontrollbilder an jeder Szene, jedem Wechsel und jedem Textaufbau rendern (`REMOTION_UNSCHAERFE=1` für schnelle Stills ohne Dateiänderung), **mit Safe-Zone-Rahmen** überlagern, als Kontaktbogen ansehen.
- Prüfen: Text in der Zone, keine leeren Flächen, Kontrast, keine Lücken/Sprünge beim Wechsel, kein Objekt verschwindet für einen Frame (`landung()` statt `overshoot()`).

### 8. Sound und Musik
**Effekte:** jeden Sound auf seinen Hit vermessen (`sounds.json`) und exakt platzieren; nie zwei wichtige gleichzeitig; Lautstärken deutlich unter der Stimme (ausser bewusste Charakter-Sounds).

**Musik:**
- Hat der Nutzer einen Song/eine Lizenz: diesen verwenden. Sonst **3 Varianten** generieren (Higgsfield ElevenLabs Music, instrumental, ~5 Credits pro 36 s), Richtung aus einer Referenz ableiten (Tempo, Tonart, Energieverlauf messen), z. B. «Jahrmarkt-Hip-Hop», «Noir-Jazz», «Kino-Puls». Jede Variante unter das fertige Reel mischen und dem Nutzer zur Wahl schicken. Gewählte Richtung in `CLAUDE.md` festhalten (Spielautomat: «Kino-Puls», 103 BPM, d-Moll, Streicher/Klavier, kein klassischer Beat).
- Musik ~10 dB unter der Stimme, **Sidechain-Ducking** auf die Stimme, kurzes Fade-in, 0,8 s Fade-out. Immer auch eine Fassung **ohne Musik** abgeben.
- Claude hört nicht: Klangurteil immer beim Nutzer abholen.

**Mix:** Stimme klar oben, Gesamt **−14 LUFS**, Peak ≤ −1 dBFS, nachmessen (ebur128). Keine ungewollte Stille.

### 9. Rendern und abgeben
- **Video:** 1080×1920, 30 fps, H.264, **yuv420p TV-Range** (Remotion liefert oft `yuvj420p`/Full-Range → `scale=in_range=full:out_range=tv,format=yuv420p`; auch nach Ton-Austausch mit `-c:v copy` prüfen!), CRF 18–20, AAC 48 kHz.
- **Fassungen** in `out/abgabe/`: `<name>-vN.mp4` (mit Musik), `-klein.mp4` (zum Verschicken), `-ohne-musik.mp4`, dazu **Übersicht mit einem Frame pro Sekunde und Safe-Zone-Rahmen** (`-uebersicht.png`).
- Nur Ton geändert: Ton-Spur mit `--codec=wav` rendern und unter das bestehende Bild legen, statt das Bild neu zu rendern.
- **Bericht an den Nutzer**: was umgesetzt wurde (pro Feedback-Punkt), was bewusst anders/weggelassen wurde und warum, verbrauchte Credits (mit `transactions` gegenprüfen), Messwerte (Lautheit, Peak, Loop-Abweichung), was nur als Standbild geprüft und was nicht gehört wurde.
- Code, Assets und Logbuch auf den Reel-Branch committen und pushen; am Schluss auf Wunsch Pull Request nach `main`.

### 10. Selbstprüfung vor jeder Abgabe (messen, nicht schätzen)
- Jede Referenz-Notiz und jeder Feedback-Punkt umgesetzt oder begründet weggelassen.
- Länge 30–35 s, höchstens 8–9 Szenen; Hook-Wort bis 0,8 s; CTA ≥ 1,5 s; Loop letzter ≈ erster Frame.
- Jeder Satz hat genau einen Moment auf einem bestimmten Wort; neues Ereignis mindestens alle 2 s.
- Alle Texte in x 95–900 / y ≥ 300 (Safe-Zone-Übersicht), keine leere Papierfläche > 0,2 s, Kontrast ok, keine halb angeschnittenen Deko-Elemente.
- Jeder Zoom-Through ohne Aufblitzen des Objektrands, Wechsel-Abweichung ≈ letzter Zoom-Schritt.
- Keine Smileys, kein KI-Text in generierten Bildern, keine erfundenen Fakten.
- Ton: −14 LUFS ±1, Peak ≤ −1 dBFS, nur natürliche Effekte, nie zwei wichtige Sounds gleichzeitig.
- motion-design-Prüfliste abgehakt.

### 11. Feedback-Runden
- Feedback als nummerierte Liste übernehmen, nur das Genannte ändern, Stimm-Timing bleibt fix (Ausnahme: Kürzen auf Wunsch).
- Ziel: **höchstens 1 Runde**. Bei Geschmacksfragen 2 Varianten zeigen statt raten.
- Was der Nutzer korrigiert, als dauerhafte Regel in `CLAUDE.md` und in die Skill-Kopie `skill/reel-produktion/SKILL.md` zurückschreiben; im Logbuch vermerken.

---

## Stil-Steckbriefe (Basis pro Kanal)

**Solleva** (Webdesign, Olten/Aarau)
- Basis-Look «hell, ruhig, violett»: Papier #F6F5FC, Lavendel #ECE6FF, Staubgrau #EEEDF3, Nacht #070A24 (Kontrast/CTA), Tinte #14123A, Grau #6E6C92 / #D5D1E9 / #E4E1F3, Akzent Violett #6C3FD4, Lavendel-Akzent #A98BFF, Cyan #8FE3FF (nur auf Nacht), Gold #F2C46D (Sterne).
- Stil-Rezepte für Abwechslung: **R01 Halbton-Collage** (Papier #ECE9E2, Schwarz #121212, Rot #D7232B, Gelb #FFD21F, Violett #6C3FD4; Halbton-Ausschnitte mit weissem Papierrand, gerissenes Papier, Textur-Hintergründe; vom Nutzer gut befunden), **R02 Papiertheater** (Entwurf). Violett bleibt als Verbindung zur Marke.
- Schrift: Barlow 800, Instrument Serif kursiv (Schlüsselwörter), JetBrains Mono (Etiketten); in Rezepten zusätzlich Rye, IM Fell, Caveat.
- Endkarte: Solleva-Logo, «@solleva.ch», CTA **«Folge für mehr»**, Claim «Heb dich von der Masse ab.»
- Stimme: Andre. Ich-Form oder neutraler Erzähler.

**giani.hockey** (Hockey, persönlich)
- Noch festzulegen (Pinterest-Referenzen). Vorschlag: Eis-Weiss + eine Teamfarbe + Schwarz, sportliche Condensed-Sans, Motive Scoreboard, Taktiktafel, Puck, Statistik. Echte Hockey-Aufnahmen haben Vorrang.

**Lieblingsfund** (Geschenkideen, Pinterest/Amazon)
- Creme #FBF3EA, Sand #F6EDE3, Terracotta #C2694B/#A4523A, Gold #F2C46D, Salbei #8C9A7E, Tinte #3A2A22; Fraunces italic + DM Sans.
- Immer «Anzeige | Affiliate-Link», keine festen Preise.

---

## Technik-Notizen (Cloud-Umgebung)
- Remotion: eigene Dateien, kein Wizard. Browser `/opt/pw-browsers/chromium_headless_shell-*/…/chrome-headless-shell` in `remotion.config.ts`, `setDelayRenderTimeoutInMilliseconds(240000)`. Schriften lokal als woff2 in `public/fonts/` (`@fontsource/*` via npm; Google-Fonts-CDN ist blockiert).
- Bewegungsunschärfe = Sub-Frame-Mittelung (6 Proben); ganzes Reel rendert ca. 30 min. Schnelle Stills: `REMOTION_UNSCHAERFE=1`. Bei starkem Zoom teure Filter (weisser Papierrand) vereinfachen; dritte Portal-Ebene erst rendern, wenn die Fahrt in die zweite läuft.
- Lange Renders im Hintergrund starten (`run_in_background`) und erst danach weiterarbeiten; Status in einer Log-Datei.
- Higgsfield: Downloads von `d8j0ntlcm91z4.cloudfront.net`. **`upload.higgsfield.ai` ist gesperrt** → eigene Bilder ins (öffentliche) Repo pushen und per `media_import_url` mit `raw.githubusercontent.com/<owner>/<repo>/<commit>/<pfad>` importieren (Nutzer darauf hinweisen, dass das Repo öffentlich ist). Höchstens 8 Aufträge gleichzeitig. Bilder: `gpt_image_2_6` (Objekte 0,25–0,5, Texturen 2k ~1 Credit), Freistellen `remove_background`, Video `kling3_0` (5 s pro ~8,75), Musik `elevenlabs_music_v2_5`, Sounds `mirelo_text_to_audio`, Stimme `text2speech_v2`.
- Mixkit-Sounds: Suchseiten unter `mixkit.co/free-sound-effects/<begriff>/`, Dateien unter `assets.mixkit.co/active_storage/sfx/<id>/<id>-preview.mp3`.
- Analyse: ffmpeg (Frames, `tile`, Szenen, `ebur128`, `silencedetect`), Python/Pillow/numpy, librosa (Tempo, Tonart, Grundton). Uploads des Nutzers in eigenem Ordner ablegen, nur lesen.
- Subagenten nur auf Wunsch des Nutzers; dann diesen Skill vollständig in den Auftrag kopieren.
