---
name: reel-produktion
description: Fester Ablauf für hochwertige Kurzvideos (Instagram-Reels, YouTube Shorts, TikTok) für Solleva, giani.hockey, Lieblingsfund und Kunden. Verwenden bei jedem Reel, Short, Promo- oder Erklärvideo mit KI-Stimme und Motion Graphics, auch wenn nur «mach ein Reel/Video über …» oder «heute machen wir ein Reel» gesagt wird. Legt Referenz-Intake (Pinterest-Bilder, kurze Clips, vier Fragen), Referenz-Analyse, Stil-Steckbrief mit Storyboard zur Freigabe, 5-Sekunden-Stiltest vor jedem Credit-Verbrauch, Skript, KI-Voiceover, zwei Versionen mit Best-of-Schnitt, Sound, Musik und Abgabe verbindlich fest, damit das erste Ergebnis schon stimmt.
---

# Reel-Produktion: so machen wir unsere Videos

Ziel: Jedes Video erzeugt beim Nutzer und bei den Zuschauern einen WOW-Effekt, und zwar mit **höchstens einer Korrekturrunde**. Der Nutzer gibt sich nicht mit 60 % zufrieden. Grundlage sind Referenzen, die wirklich funktionieren (Zane Hoyer «ChatGPT vs Claude Motion Graphics» inkl. seiner Original-Prompts, City Chicken, Amazon) und die Referenzen, die der Nutzer pro Reel mitbringt. Das Rezept:

> **Erst verstehen, dann bauen. Die Referenzen werden zerlegt und als Steckbrief bestätigt, bevor etwas animiert wird. Die Stimme gibt den Takt vor. Jeder Satz ist ein klarer Moment. Ein einziger, streng definierter Look. Credits fliessen erst, wenn ein 5-Sekunden-Stiltest überzeugt.**

Warum dieser Ablauf: Beim ersten Solleva-Reel wurden Referenzen geliefert, aber nur teilweise umgesetzt. Ergebnis «gut, aber nicht überragend». Ursache war nicht das Werkzeug, sondern dass ohne bestätigte Analyse direkt das ganze Reel gebaut wurde. Claude sieht Videos nur als Einzelbilder und hört keinen Ton. Was der Nutzer an einer Referenz liebt, muss deshalb **ausgesprochen, zerlegt und bestätigt** werden.

Was wir NICHT mehr machen (hat sich als «cool, aber nicht überzeugend» erwiesen): direkt das ganze Reel bauen, ohne dass Steckbrief und Stiltest freigegeben sind; Referenzen nur «ungefähr» umsetzen; ein durchgehender Film ohne Stimme; eine Einstellung über 5+ s; 15 s dieselbe dunkle Farbe; Effekt-Sammlungen (Lens Flares, Lichtfasern, Glow überall); generierte Musik, die niemand ausgewählt hat.

**Arbeitsteilung (Hybrid):**
- **Code (Remotion/React, TypeScript) baut Claude:** Typografie, UI- und Website-Demos, Übergänge, Icons, Captions, exaktes Timing, Markenfarben. Wirkt besser als Animationen in DaVinci Fusion und ist schneller änderbar.
- **Higgsfield (inkl. Katana/Video-Modelle) liefert:** filmische Hintergründe, Licht, Kamerafahrten, Atmosphäre, Produkt- und Personenszenen, also alles, was Code nicht fotorealistisch kann. Nie für exakten Text oder UI verwenden; Text kommt immer als Code-Ebene darüber.
- **Echtes Material vor generiertem:** eigene Aufnahmen (z. B. Hockey-Clips für giani.hockey, echte Screenshots von Solleva) haben Vorrang.
- Ein Schnittprogramm (DaVinci Resolve oder CapCut) braucht es nur, wenn der Nutzer selbst feinjustieren will.

## Baukasten: Repository `gianlucaa72/solleva-reels` (zuerst laden!)
Jede Reel-Sitzung beginnt mit: Repo anhängen (`add_repo`), klonen, `npm install`, `CLAUDE.md`, `LOGBUCH.md` und `docs/referenzen/` lesen. Dort liegen:
- **Marken-Kern** `src/brand/solleva.ts` (Farben, Stimmungen S1–S4, Schriften), **Kurven** `src/lib/bewegung.ts`, **Kamera + Ton** `src/lib/kamera.tsx`
- **Welten** W01–W07 (`src/welten`), **Übergänge** U01–U17 (`src/transitions`), **Texteffekte** X01–X20 (`src/text`), **Bausteine** B01/B06/B07/E02/U13/P01 (`src/bausteine`), Cursor C01, Endkarte E01
- **Sound-Kit** `sounds/` (Mixkit + selbst erzeugt) mit Hit-Zeiten in `sounds.json`, Hörprobe `sounds/hoerprobe.html`; Sounds immer mit `<Ton nr="swish-02" bei={frame} />` setzen
- **Katalog** `src/katalog/Katalog.tsx` (alle Bausteine mit Nummer und Ton)
Erst Bausteine aus dem Baukasten nehmen; Neues nur ergänzen und mit Nummer in Katalog + Bibliothek aufnehmen.

## Content-Strategie (Vorgabe des Nutzers, gilt für jedes Reel)
**Ausgangslage:** Bisherige Reels 100–250 Aufrufe, weil sie wie Werbung wirkten («Ich mache Websites»). Ziel: **zuerst Reichweite durch Unterhaltung/Neugier, dann Vertrauen, erst dann Verkauf.**
1. **Themen breit**: Websites, Social Media, Marketing, Psychologie des Klickens, digitaler Erfolg von Firmen. Website ist **ein** Thema unter vielen, nicht jedes Mal das Hauptthema.
2. **Formate wechseln** (Content-Säulen):
   - **Fallgeschichte**: wie bekannte Firmen Social Media/Traffic geknackt haben (Story wie Buffett-Reel)
   - **Vergleich**: A gegen B, früher gegen heute, Mythos gegen Wahrheit
   - **Tipp/Hack**: sofort umsetzbar, bildlich erklärt
   - **Hinter den Kulissen**: z. B. wie ein Reel mit Claude entsteht, der ganze Ablauf
   - **Psychologie/Wissen**: warum Menschen klicken, scrollen, vertrauen, kaufen
   - **Lokal/KMU**: Alltagsszenen von Schweizer KMU (Kunde sucht, findet nicht …)
3. **Die Story trägt alles**: Hook in Sekunde 1, Spannung, Twist, Auflösung (Story-Bauplan). Erst die Story, dann Bilder und Effekte.
4. **Bildlich denken**: Ideen so entwickeln, dass jeder Satz ein starkes Bild hat (Gehirn, griechische Statue, fallender PC, Cartoon-Figur …), nicht Listen auf Folien.
5. **Nichts von der Stange**: jedes Reel anders in Format, Stimmung, Erzählweise (Logbuch prüfen).
6. **Solleva dezent als Absender**: weicher CTA am Ende («Folge für mehr», «Schreib ‹Analyse›»), kein Verkaufsgespräch.
7. **Erzähler**: Ich-Form (Gianluca) **oder neutraler Erzähler** (wie Buffett-/Batman-Reels), je nach Thema.
8. **Fakten**: Fallgeschichten und Zahlen vorher recherchieren, Quellen im Freigabe-Paket nennen; nichts Unbelegtes behaupten. Keine Markenlogos/Marken-Assets nachbauen; Firmen nur im Text/Ton nennen.

## Stil-DNA aus den Referenzen (gilt für jedes Reel)
1. **Nichts steht still**: jede Szene in `<Kamera>` (Push 2–5 %, Drift, ±0,6° Rotation), Objekte driften/pendeln.
2. **Alle 0,3–0,6 s ein Ereignis** (Wort, Zahl, Objekt, Zoom). Gleiche Szene max. 2,5 s.
3. **Pro Satz eine neue Welt** (Hintergrund wechselt), Hauptfigur/-objekt darf als Anker bleiben.
4. **Tiefe**: Text kommt aus der Unschärfe, Vordergrund unscharf, Schatten am Boden.
5. **Wörtliche Bilder**: jedes Bild illustriert das gesprochene Wort, nicht das Thema allgemein.
6. **Zahlen werden inszeniert** (aufbauen, zählen, überkleben, Kacheln), nie nur geschrieben.
7. Hauptlook hell = Ref. 05 «2-D Motion Reel» (Lavendel, Raster, schmale kursive Serif, Licht-Bloom). Dunkel = Nacht/Violett mit Leuchten.
8. **Bildsprache statt Folien (wichtig für den Nutzer)**: Jede Szene braucht ein **Bild zur Veranschaulichung**, nicht nur Text auf Fläche. **Hauptbilder sind echte, generierte Objekte und Figuren** (Higgsfield, fotorealistisch oder im Collage-/Cartoon-Stil, freigestellt), z. B. ein **realistisches Gehirn**, **griechische Männer/Marmor-Statuen** (Denker, Philosoph am Laptop), Cartoon-/Ausschnitt-Figuren (wie das Buffett-Männchen), ein PC, der vom Himmel fällt, Hände, Geld, Lupe, Uhr. **Emojis (`assets/emoji/`, Fluent 3D, MIT) sind nur kleine Akzente** (Reaktionen, Aufzählungen), **nie Ersatz** für ein generiertes Hauptbild. Ablauf: zuerst in `assets/` nach bereits generierten Objekten suchen und wiederverwenden; Neues mit Higgsfield **nur nach Freigabe** (Kosten nennen), danach in `assets/objekte/` bzw. `assets/figuren/` speichern. Im Freigabe-Paket pro Szene das Bild nennen.
9. **Hintergründe aufwerten**: Der Nutzer findet die Code-Hintergründe noch zu schlicht. Pro Reel prüfen, ob 1–3 Hintergründe als Foto/Textur mit Higgsfield erstellt werden sollen (Himmel, Marmor, Filz, Papier, Vorhang … in Solleva-Farben getönt); nach Freigabe generieren und in `assets/hintergrund/` für spätere Reels speichern.

## Lesezeit, Übersicht, Hintergründe (Nutzer-Feedback Reel «Spielautomat»)
- Text baut sich synchron zur Stimme auf und bleibt danach ≥ 1,5 s ganz stehen (≥ 0,3 s pro Wort); Hooks nie zu schnell. Pro Bild höchstens ca. 8 Wörter.
- Übersicht: oben Text, Mitte ein Hauptobjekt, höchstens 2–3 Akzente.
- Pro Satz ein anderer Hintergrund-Typ, und jeder Hintergrund bewegt sich leicht (Strahlen drehen, Tapete schwenkt, Punkte atmen).
- Stil-Rezepte stehen in `CLAUDE.md` (R01 Halbton-Collage, R02 Papiertheater).

## Story-Bauplan (Vorlage, aus Ref. 01/03)
1. **Hook** mit konkreter Zahl oder Szene (0–2 s) · 2. **Vergleich**, der sie fühlbar macht · 3. **Twist** («Aber …») · 4. **Spannung über Zeit** · 5. **Rätsel** («Warum?») · 6. **Beweis/Muster** · 7. **offene Schleife oder CTA**. Zahlen nur, wenn echt (eigene Projekte mit Erlaubnis).

## Abwechslung (damit es nach 3–4 Reels nicht langweilig wird)
- Fester Kern: Farben, Schriften, Endkarte, Stimme, Signatur-Sounds, Qualität.
- Wechselt pro Reel: **Format** (UI-Demo, Vorher/Nachher, Typo, Collage/filmisch, «3 Fehler», Person mit Overlays), **Stimmung** S1–S4, **Übergangs-Set** (3–4), **Welten**, **Tempo**, **Hook-Typ**.
- Vor jedem Reel `LOGBUCH.md` lesen: Kombination der letzten 3 Reels nicht wiederholen; **pro Reel mindestens ein neues Element**. Nach Abgabe Logbuch-Zeile ergänzen.

## Sound-Regeln (aus Sound-Analyse der Referenzen)
- Drei Schichten: Stimme klar oben, basslastiger Beat durchgehend darunter, kurze Effekte (0,1–0,3 s) auf fast jedem Bildereignis.
- **Swish/Whoosh 1–3 Frames VOR** der Bewegung, **Klick/Schlag exakt** auf Landung/Einrasten.
- Tonhöhe folgt Bewegung: Einflug/Fall → fallender Swish; Spannung → Riser; Stakkato/Bruch → Downlifter; Enthüllung → Glitzer; Linie/Zähler/Ausrollen → Ratsche.
- Favoriten des Nutzers in `sounds/README.md` nachführen. Nutzer hört selbst und ergänzt Sounds.

Zusätzlich gilt immer der Skill **motion-design** (Kurven Land/Heavy/Whip, ein Anführer pro Moment, Ausgänge schneller als Eingänge, Standbilder leben weiter).

**Pflicht-Freigaben (sonst ohne Rückfrage durcharbeiten):**
1. Freigabe-Paket (Steckbrief + Skript + Storyboard), Schritt 3
2. Stimmwahl beim ersten Video eines Kanals, Schritt 4
3. 5-Sekunden-Stiltest, Schritt 5

---

## Ablauf (immer in dieser Reihenfolge)

### 1. Brief und Referenz-Intake (eine Nachricht, nur nachfragen, was fehlt)
Typischer Start: «Heute machen wir ein Reel über X.» Dann gemeinsam klären:
- **Kanal:** Solleva, giani.hockey, Lieblingsfund oder Kunde → bestimmt den Basis-Steckbrief (unten).
- **Eine Botschaft** in einem Satz, **Zielgruppe**, **CTA** (Standard Solleva: «Folge für mehr»).
- **Länge:** Standard 20–30 s. Nie über 35 s ohne Grund.

**Referenzen: drei Bausteine** (Upload-Limit des Nutzers: 30 MB pro Datei)
1. **Pinterest-Bilder für den Look** (5–10 Stück): Hintergründe, Farben, Schriften, Licht, Icon-/Emoji-Stil.
2. **2–3 kurze Clips für die Bewegung:** 5–15 s, nur der Teil, der packt (nicht das ganze Reel), **1080p, mit Ton, MP4**, jeder Clip einzeln hochladen (15 s in 1080p ≈ 15–25 MB). **Keine 480p-Aufnahmen**: Darin gehen Schriften, Körnung, Unschärfe-Übergänge, Glow und feine Bewegungen verloren.
3. **Sound als Titel oder Link:** Tempo und Energie (ruhig, treibend, mit Drop). Musikdatei nur, wenn sie im Video landen soll.

**Die vier Fragen pro Clip** (Stichworte reichen, Fachwörter unnötig; dem Nutzer bei Bedarf genau so vorlegen):
1. **Was genau?** Zeitangabe + Stelle, z. B. «0:04, wie der Text reinkommt».
2. **Wie fühlt es sich an?** z. B. edel, verspielt, hart, ruhig, schnell, teuer. Vergleiche sind willkommen («wie Apple-Werbung, aber wärmer»).
3. **Was übernehmen?** nur die Übergänge / den ganzen Look / nur die Schrift / den Rhythmus.
4. **Was NICHT übernehmen?** z. B. «zu hektisch», «Farben passen nicht zu uns».

Fehlen Referenzen: mit dem Basis-Steckbrief des Kanals arbeiten und das im Freigabe-Paket klar sagen.

### 2. Referenz-Analyse (Claude, ohne Rückfrage)
Jede Referenz wirklich zerlegen, nicht nur anschauen:
- **Einzelbilder:** mit ffmpeg rund um jede genannte Zeitangabe **15–30 Bilder pro Sekunde** extrahieren (`ffmpeg -ss T-0.5 -t 1.5 -i clip.mp4 -vf fps=24,scale=540:-1 f_%03d.png`), dazu ein Kontaktbogen des ganzen Clips mit 4 fps (`tile`). Alle Bilder ansehen.
- **Szenenwechsel messen:** `select='gt(scene,0.3)',showinfo` → Liste der Schnitte, durchschnittliche Einstellungslänge.
- **Übergänge bestimmen:** Art (Push, Zoom-Durchflug, Match-Cut, Maske, Blur-Whip, Glitch), **Dauer in Frames**, Easing (wie schnell rein, wo es abbremst, Overshoot ja/nein), was sich in welcher Reihenfolge bewegt (Anführer + Nachzügler mit Verzögerung).
- **Look:** Farbpalette aus den Bildern ziehen (dominante Farben als Hex), Hintergrund-Aufbau (Verlauf, Textur, Körnung, Tiefe/Ebenen, Licht), Formsprache (Radius, Schatten, Rahmen).
- **Schrift:** Klasse und Merkmale bestimmen (Grotesk/Serif/Condensed, Strichstärke, Laufweite, Versalien) und die **nächste freie Entsprechung** von Fontshare oder Google Fonts wählen. Nicht behaupten, die Originalschrift sicher zu kennen.
- **Icons/Emojis:** Stil bestimmen (flach, 3D, Outline, animiert). Freie Quellen: Microsoft Fluent 3D Emoji (MIT), Lucide/Phosphor Icons, Lottie.
- **Ton (Claude hört nicht):** Hüllkurve und Beats per ffmpeg/numpy messen (`astats`, Energie pro 50 ms, Onsets) und gegen die Schnittliste legen: Schneidet die Referenz auf den Beat? Wo liegen Impacts, Whooshes, Stille? Den Klangcharakter aus der Beschreibung des Nutzers übernehmen, nie erfinden.
- Pinterest-Bilder genauso auf Farben, Schrift, Textur, Komposition auswerten.

### 3. Freigabe-Paket: Steckbrief + Skript + Storyboard (Pflicht-Freigabe)
Alles in **einer** Nachricht, damit es nur eine Runde braucht.

**a) Stil-Steckbrief für dieses Reel**
- Basis = Steckbrief des Kanals (unten), **darüber** die Erkenntnisse aus den Referenzen. Widerspricht eine Referenz dem Kanal-Steckbrief (z. B. andere Farben), ausdrücklich nachfragen statt still entscheiden.
- Inhalt: Farben (Hex), Hintergründe, Textur, Formsprache, Schriften, Icon-Stil, Übergangs-Typen mit Dauer in Frames und Kurve, Rhythmus (Ø Einstellungslänge, Schnitt auf Beat ja/nein), Sound-Momente, Herkunft jeder Szene (Code / Higgsfield / echtes Material).
- **Pro Referenz-Notiz des Nutzers eine Zeile «Gesehen → so setze ich es um»**, damit überprüfbar ist, dass nichts untergeht. Jede vom Nutzer genannte Stelle muss im Reel vorkommen oder begründet weggelassen werden.

**b) Skript** (Format: eine Zeile = ein Moment)

```
#  | Kapitel-Label    | Gesprochener Satz                     | Schlüsselwort | Bild-Moment / Übergang          | Quelle
1  | // 01 GESUCHT    | Deine Kunden googeln dich. Jeden Tag. | googeln       | Suchleiste tippt, Zoom-Push     | Code
2  | // 02 UNSICHTBAR | Nur … du tauchst nicht auf.           | nicht         | Liste scrollt, findet nichts    | Code
```

Regeln:
- **6–10 Sätze**, je 4–9 Wörter, gesprochen 1,5–3 s.
- **Satz 1 = Hook** (Problem, Widerspruch oder Neugier) in der ersten Sekunde. Kein Logo am Anfang.
- **Pro Satz genau ein Schlüsselwort.**
- **Ein Humor- oder Bruch-Moment** pro Video (Wort durchgestrichen, Cursor dreht ab, Fenster friert ein).
- **Ein Signature-Moment:** die eine Stelle, über die man redet (meist aus der Lieblings-Referenz des Nutzers). Im Skript markieren.
- **Letzter Satz = CTA**, das Bild endet auf dem grossen CTA.
- Erzähler: Ich-Form als Gianluca (Solleva: «ich», nie «wir») oder neutraler Erzähler (siehe Content-Strategie). Du-Form zum Zuschauer. Schweizer Schreibung «ss». Keine erfundenen Zahlen, Bewertungen, Rankings oder Kundennamen. Fremdwörter und Markennamen vorher prüfen (z. B. «Solleva» = it. «heb an!/hebt an», von «sollevare» = anheben).

**c) Storyboard als Standbilder**
- Pro Moment ein gerendertes Schlüsselbild (Remotion `still`, ohne Credits) im Steckbrief-Stil, als Kontaktbogen in einem Bild. Higgsfield-Szenen dabei als Platzhalter mit Beschreibung und Prompt-Entwurf darstellen, noch **nicht** generieren.
- Kosten-Schätzung für alle geplanten Higgsfield-Generierungen nennen.

**Erst nach Freigabe weiter.** Korrekturen hier einarbeiten; sie kosten nichts.

### 4. KI-Voiceover (Higgsfield)
- Engine `text2speech_v2`, Variante `elevenlabs`. **Solleva-Stimme: «Andre»** (voice_id `f1e8226e-2248-4d5f-b43c-0a79e9949dbf`, preset). Bei neuen Kanälen 3 Proben zur Wahl, gewählte Stimme hier eintragen.
- Kosten vorher nennen (`get_cost`; ca. 0,15 Credits pro Satz).
- **Jeder Satz als eigene Datei** (Batch). Bei Fehler 429 (Rate-Limit) die fehlenden einzeln nachsenden.
- Download-Host `d8j0ntlcm91z4.cloudfront.net` muss in der Umgebung erlaubt sein.
- Timing: mit ffmpeg `silencedetect=n=-40dB:d=0.1` jede Sprechpause auf 10 ms genau messen, Phrasen und Wörter daraus ableiten. Sätze ohne Anfangs-/Endstille mit **0,22 s Pause** aneinanderreihen, am Schluss **2 s Halt** für den CTA. Alle Zeiten in **einer** `timeline.json` (Frames bei 30 fps). Jeder visuelle Beat sitzt auf einem bestimmten gesprochenen Wort.
- Stimme vor dem Mix auf −16 LUFS normalisieren.

### 5. 5-Sekunden-Stiltest (Pflicht-Freigabe, erst hier fliessen Credits)
- Nur **eine** Szene fertig bauen: den Signature-Moment bzw. die Szene, die die Lieblings-Referenz am stärksten verkörpert, inkl. Hintergrund, Typografie, Übergang rein und raus, Stimme, Sounds und (falls vorhanden) Musik.
- Higgsfield **nur für diese Szene** generieren; Kosten vorher nennen. Prompts aus dem Steckbrief ableiten (Licht, Kamerabewegung, Farbwelt, Format 9:16), lieber 2 Varianten einer Szene als 1 Szene blind.
- Als MP4 abgeben, daneben ein Vergleichsbild «Referenz-Frame | unser Frame» an der genannten Stelle.
- Frage an den Nutzer: «Hat das den WOW-Effekt? Was fehlt noch?» Nur bei Ja das ganze Reel bauen. Bei Nein: Steckbrief anpassen, Test wiederholen; nie mit einem halb überzeugenden Stil weiterbauen.

### 6. Zwei Versionen bauen (gleiche Timeline, gleicher Steckbrief)

Gilt als Standard. **Definieren die Referenzen ein anderes Format** (z. B. filmisch mit Higgsfield-Szenen statt UI mit Mauszeiger), dann sind A und B **zwei Auslegungen der Referenz** (z. B. A = näher an der Referenz, B = ruhiger/markentreuer). Der freigegebene Steckbrief und der Stiltest haben immer Vorrang.

**Gemeinsame Regeln für beide:**
- Ein klarer Moment pro Satz, **eine Hauptaktion zur Zeit**, Federn mit leichtem Overshoot, nichts überladen, nichts flackert.
- 2–4 Mikro-Details reagieren auf die Hauptaktion (ungleiche Verzögerungen): Zähler zählt, Häkchen zeichnet sich, Badge ploppt, kleine Partikel in Akzentfarbe beim Klick.
- Safe Zones 1080×1920: Wichtiges zwischen y 220 und y 1540, rechts 140 px frei, CTA nie im unteren Fünftel.
- Jede Haltephase lebt weiter (Drift 1–3 px, Zoom 100→102 %).
- Higgsfield-Clips als Hintergrund-Ebene: auf 1080×1920 bringen, Farben an den Steckbrief angleichen (leichte Farbkorrektur/Tönung), Text-Ebene aus Code darüber, Schnitt auf Satzgrenzen bzw. Beat.

**Version A: «Interaktive UI im ganzen Bild»** (bei UI-/Website-Themen meist die stärkere)
- **Keine Text-Box.** Das ganze Bild ist **eine lange, durchgehende Arbeitsfläche** (z. B. 1080 × 6000 px), auf der alle Momente untereinander bzw. nebeneinander liegen. Die **Kamera scrollt** mit weichen Heavy-Kurven von Moment zu Moment, mitten in der Bewegung leicht herausgezoomt (95 %), dann wieder 100 %. Keine harten Szenenwechsel.
- **Ein Mauszeiger treibt die Story:** bewegt sich in weichen Bögen (nicht geradlinig), klickt (kleiner Ripple in Akzentfarbe + Klick-Sound), zieht Dinge, tippt. Er darf sich verwandeln: Schere zum Schneiden, Sanduhr beim Warten/Einfrieren, Hand beim Ziehen, Pfeil-hoch beim Anheben.
- Jeder Satz = ein UI-Moment, den der Cursor auslöst. Bausteine: Suchleiste tippt, Ergebnisliste scrollt, Fenster friert ein («KEINE ANTWORT», hängender Ladebalken), Dateien in eine Drop-Zone ziehen, Checkliste abhaken, Grafik zeichnet sich mit %-Zähler und Stempel, Chatfenster tippt synchron zur Stimme, Versionsbaum mit Render-Button, Mind-Map wächst aus einem Knoten, Eintrag wird nach oben gezogen.
- Text nur sparsam: das Schlüsselwort darf gross im Raum stehen, sonst erzählt die UI.
- **Ende:** alles fällt in **einen grossen CTA-Button** zusammen, den der Cursor auf dem letzten Wort klickt.

**Version B: «Text oben + Karte»**
- **Captions oben** (y 290–700): der ganze Satz steht von Anfang an **hellgrau** (Opacity ~25 %), jedes Wort wird beim Sprechen **schwarz/hell** (Land-Kurve, kleiner Hub). Schlüsselwort kursiv in Serif und Akzentfarbe, mit kleinem Puls.
- **Kopfzeile:** Kapitel-Label links, rechts ein kleiner Zähler (z. B. «SICHTBARKEIT 12 %» → steigt mit der Story; nur symbolisch, keine erfundenen Fakten im Sinn von Statistiken).
- **Mitte:** eine Karte/Konsole im Steckbrief-Stil, in der die Illustration des Satzes spielt (gleiche Momente wie A, kompakter). Übergänge: Push mit Whip-Kurve oder Match-Cut.
- HUD-Texte immer auf kleinen umrandeten Panels, nie über der Szene.

### 7. Best-of-Schnitt
- Beide Versionen als Stills an jedem Beat rendern (Kontaktbogen A neben B, Zeile pro Satz) und **selbst vergleichen**, immer auch gegen die Referenz-Frames.
- Pro Satz die Version wählen, die ihn klarer erklärt. Liste führen: `Satz → A/B → Grund`.
- Finale Komposition schneidet entlang der Satzgrenzen zwischen A und B. Bei ähnlichem Inhalt an der Naht **6-Frame-Überblendung** (Opacity), sonst harter Schnitt auf das Wort.
- Jede Naht als Standbild prüfen (kein Sprung im Layout, kein doppeltes Element).

### 8. Sound und Musik
Bibliotheken: `sfx-library/` (Mixkit: whoosh, transition, click, pop, notification, typing, interface, impact) und `user-sounds-pixabay/`. Hat der Nutzer eine Lizenz (z. B. Artlist, Epidemic Sound), deren Dateien bevorzugen.

**Effekte:**
- Jeden Sound zuerst analysieren (Hüllkurve mit ffmpeg/numpy): **wo liegt der Hit**, Stille am Anfang wegschneiden, damit der Hit exakt auf dem visuellen Ereignis landet (z. B. Riser `riser-hit-01`: Hit bei 5,38 s).
- Sound-Momente aus der Referenz-Analyse (Schritt 2) übernehmen: gleiche Art Sound an der gleichen Art Moment.
- Zuordnung: **Klicks** auf Cursor-Klicks und Tippen, **Pops** auf Erscheinen, **Whooshes** auf Kamerafahrten und Nähte, **Glitch/Ticks** auf Einfrieren und laufende Zähler, **Impacts** auf grosse Enthüllungen und den CTA.
- **Viele Sounds, aber nie zwei wichtige gleichzeitig.**
- **Drei Spuren:** (1) Klicks/Pops, (2) Whooshes, (3) Impacts. Jeder Clip mit eigener Lautstärke und sprechendem Namen (z. B. `klick-suchleiste`, `whoosh-kamera-03`).
- Lautstärken unter der Stimme: Klicks/Pops −14 bis −10 dB, Whooshes −12 bis −8 dB, Impacts −8 bis −5 dB.

**Musik (nur mit echtem Song vom Nutzer oder lizenzfreier, ausgewählter Datei):**
- Song **10–15 s in den Track hinein** starten, den Startpunkt so wählen, dass **Drop oder grösster Energiewechsel auf einen Kapitelwechsel** fällt (Energie-Hüllkurve analysieren). Schnitte möglichst auf Beats legen, wenn die Referenz das tut.
- Am Drop teilen: ruhiger Teil **~10 dB unter der Stimme**, lauter Teil **~6 dB unter der Stimme**. Kurzes Fade-in, **0,8 s Fade-out**.
- Kein Song vorhanden: ohne Musik abgeben (Nutzer legt in Instagram einen Trend-Song drüber).
- Claude hört nicht: Klangurteil immer beim Nutzer abholen (beim Stiltest).

**Mix:** Stimme klar oben, Gesamt **−14 LUFS**, Peak ≤ −1 dBFS, lokal nachmessen (ebur128). Keine ungewollte Stille.

### 9. Rendern und abgeben
- **Video:** 1080×1920, 30 fps, H.264, **yuv420p TV-Range** (Remotion rendert oft `yuvj420p` → danach `scale=in_range=full:out_range=tv,format=yuv420p`), CRF 18–20, AAC 48 kHz, Lautheit normalisiert.
- **Fassungen:** `<name>-vN.mp4` (fertig) und, falls Musik drin ist, `<name>-vN-ohne-musik.mp4`.
- **Für DaVinci auf Wunsch:** Version A und B als getrennte Videos ohne Ton, Stimme als WAV, Sounds als drei Spuren (WAV) – so kann der Nutzer selbst schneiden.
- **Bericht an den Nutzer:** Abgleich mit jeder Referenz-Notiz (umgesetzt / bewusst weggelassen + Grund), welche Version pro Satz gewählt wurde, wo die wichtigsten Sounds liegen, Musik-Startpunkt (falls Musik), verbrauchte Credits, Messwerte (Lautheit, Szenenwechsel), was nur als Standbild geprüft wurde. Projekt zusätzlich als ZIP sichern (Cloud-Umgebung kann neu starten).

### 10. Selbstprüfung vor jeder Abgabe (messen, nicht schätzen)
- Jede Referenz-Notiz des Nutzers ist umgesetzt oder begründet weggelassen.
- Übergänge haben die im Steckbrief gemessene Dauer und Kurve (Frames zählen, gegen Referenz-Frames vergleichen).
- Jeder Satz hat genau einen Moment, ausgelöst auf einem bestimmten Wort.
- Neues Bild oder neue Hauptaktion **mindestens alle 2 s** (Szenenliste/Timeline zählen).
- Nur Farben aus dem Steckbrief; ≥ 2 Hintergrund-Wechsel; nicht durchgehend dunkel.
- Text in Safe Zones (Pixel-Ausdehnung rechts ≤ 940 px), Captions lesbar, kein KI-Text in Higgsfield-Clips sichtbar.
- Ton: −14 LUFS ±1, Peak ≤ −1 dBFS, nie zwei wichtige Sounds gleichzeitig.
- Hook in Sekunde 1, Signature-Moment vorhanden, CTA auf dem letzten Wort und ≥ 1,5 s stehend, keine erfundenen Fakten.
- motion-design-Prüfliste abgehakt.

### 11. Feedback-Runden
- Feedback als nummerierte Liste übernehmen, nur das Genannte ändern, Stimm-Timing bleibt fix.
- Ziel: **höchstens 1 Runde** (dank Freigabe-Paket und Stiltest). Bei Geschmacksfragen 2 Varianten rendern statt raten.
- Was der Nutzer in einer Runde korrigiert, als dauerhafte Regel in diesen Skill bzw. den Kanal-Steckbrief zurückschreiben (Nutzer bietet das an), damit derselbe Fehler nie zweimal passiert.

---

## Stil-Steckbriefe (Basis pro Kanal)

**Solleva** (Webdesign, Olten/Aarau) – «hell, ruhig, violett»
- Farben (nur diese): Papier #F6F5FC, Lavendel #ECE6FF, Staubgrau #EEEDF3, Nacht #070A24 (nur Kontrast/CTA), Tinte #14123A, Grau #6E6C92 / #D5D1E9 / #E4E1F3, Akzent Violett #6C3FD4 (auf hell), Lavendel-Akzent #A98BFF, Cyan #8FE3FF (nur auf Nacht), Gold #F2C46D (nur Bewertungssterne).
- Formen: weisse Karten, Radius 34, Rand 1,5 px #E1DDF5, weicher Schatten (0 30 70 rgba(44,30,120,.14)). Cursor weiss mit Tinten-Rand.
- Schrift: Barlow 800 (Text), Instrument Serif kursiv (Schlüsselwörter), Barlow 700 Versalien mit Sperrung 0,14 em (Labels).
- Motive: Suche (neutral, ohne Google-Logo; «Google» nur gesprochen), Ergebnisliste, Website-Karte, Google-Profil-Karte, Checkliste, Termin/Anfrage, «anheben»-Motiv (Dinge heben sich, Schatten wird kleiner).
- Endkarte: Logo + «Solleva» oben, Claim «Heb dich von der *Masse* ab.», CTA-Button «Folge für mehr» (seit Reel «Spielautomat»), Instagram-Karte @solleva.ch / solleva.ch mit «Folgen».
- Stimme: Andre (siehe Schritt 4). Ich-Form.

**giani.hockey** (Hockey, persönlich)
- Noch festzulegen (Pinterest-Referenzen). Vorschlag: Eis-Weiss + eine Teamfarbe + Schwarz, sportliche Condensed-Sans, Motive Scoreboard, Taktiktafel, Puck, Statistik. Echte Hockey-Aufnahmen haben Vorrang vor generierten Szenen.

**Lieblingsfund** (Geschenkideen, Pinterest/Amazon)
- Creme #FBF3EA, Sand #F6EDE3, Terracotta #C2694B/#A4523A, Gold #F2C46D, Salbei #8C9A7E, Tinte #3A2A22; Fraunces italic + DM Sans.
- Immer «Anzeige | Affiliate-Link», keine festen Preise.

---

## Technik-Notizen (Cloud-Umgebung)
- Remotion: `npm i remotion @remotion/cli react react-dom`, eigene Dateien, kein Wizard. Browser `/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell` in `remotion.config.ts`. Schriften lokal als woff2 in `public/fonts/` (Google-Fonts-CDN ist im Headless-Chromium blockiert).
- Durchgehender Raum (Version A): eine grosse Bühne, Kamera = `translate/scale` der Bühne, Kamera-Keyframes aus der timeline.json.
- Sounds direkt in Remotion per `<Sequence from><Audio startFrom volume/></Sequence>` mischen, danach mit ffmpeg `loudnorm=I=-14:TP=-1.5` normalisieren.
- Higgsfield-Clips in Remotion per `<OffthreadVideo>` als unterste Ebene einbinden.
- Referenz-Analyse: ffmpeg für Frames (`fps`, `tile`), Szenenwechsel (`select=gt(scene\,0.3),showinfo`), Ton (`astats`, `ebur128`); Paletten mit Python/Pillow (Quantisierung) ziehen. Uploads des Nutzers in eigenem Ordner ablegen, nur lesen.
- Rendern mit `--concurrency=4`; Standbilder mit `npx remotion still … --frame=N`.
- Netzwerk-Hosts, die erlaubt sein müssen: Higgsfield-Downloads (`d8j0ntlcm91z4.cloudfront.net`), Mixkit (`mixkit.co`, `assets.mixkit.co`).
- Subagenten (stärkeres Modell) nur auf Wunsch des Nutzers; dann diesen Skill vollständig in den Auftrag kopieren.
