# Reel «4 Schichten» – Freigabe-Paket (v1, 17.11.2026)

Kanal **Solleva** · Ich-Form, Du zum Zuschauer · Schweizer Schreibung · Stimme **Andre** · ca. **31 s** · 1080×1920, 30 fps
Botschaft: *Eine gute Website besteht aus 4 Schichten – und die wichtigste sieht man nicht.*
Zielgruppe: lokale Betriebe Olten/Aarau · Beispiel: anonymes Gym **«DEIN GYM.»** (kein echter Name, Telefonnummer 062 000 00 00 = Platzhalter)
CTA: «Schreib «Analyse»» · Storyboard: `out/vs-board/kontakt.png` · Code: `src/reels/vierSchichten/`

---

## 1. Referenz-Analyse

### Bildschirmaufnahme (Pinterest-Video, 11,8 s, 120 fps, **ohne Ton**)
Kontaktbogen 4 fps + Ausschnitte mit 12 fps um jeden Übergang.

| Zeit | Was passiert | Messung |
|---|---|---|
| 0–3,0 s | oranger Landingpage-Stapel (4 Ebenen) schwebt schräg (~55° gekippt, ~-35° gedreht), oberste Ebene hebt sich, Inhalte bauen sich ein | Haltezeit ~1,5–2 s pro Look, Stapel dreht langsam |
| 3,0–3,2 s | **Wisch mit Bewegungsunschärfe**: Kamera stösst rein, Stapel verwischt diagonal nach rechts oben, neuer (beiger Shop-)Stapel ist sofort da | **~7–8 Frames bei 30 fps**, Whip-Kurve (spät anfahren, hart stoppen), danach Nachfedern ~10 Frames |
| 3,2–4,7 s | Shop-Stapel: Produktbilder ploppen nacheinander in die Kacheln, Kopfleiste schwebt über dem Stapel | Elemente gestaffelt, je ~2–3 Frames Versatz |
| 4,7–5,2 s | **Partikel-Zerfall**: Stapel zerfällt von links unten nach rechts oben in warme Partikel, daraus erscheint dunkles Dashboard (rot/cyan Neon) | **~13–15 Frames**, Partikel driften nach oben-rechts, neue Seite blendet unter den Partikeln auf |
| 6,4–6,6 s | dunkel → hell: Überblendung zur cremefarbenen Möbel-Seite | ~6–8 Frames Opacity |
| 7,2–8,4 s | **Teile fliegen auseinander und setzen sich zusammen**: Hero, Bilder, Formular, Buttons fliegen von den Rändern ein und rasten frontal als **flache Desktop-Seite** auf dem Spiegelboden ein | **~30 Frames**, Heavy-Kurve, letztes Element (Kopfleiste) landet zuletzt |
| ab 9,5 s | Schleife zurück zum Anfang | |

Look: **dunkles Studio**, fast schwarz (#05060F), weicher Spot von oben, **Spiegelboden** mit schwacher Reflexion (~15 %), Stapel wirft weichen Schatten. Kein Text über der Szene. Rhythmus: neuer Look alle ~1,5–2 s. Ton: keiner in der Aufnahme → Sound-Momente leite ich aus unserer Sound-Analyse ab (Whoosh auf Wisch, Glitzer auf Partikel, Klick+Schlag auf Einrasten).

### Pinterest-Pins
| Pin | Gesehen | Übernahme |
|---|---|---|
| Fujifilm X100VI | links Foto, rechts Strichzeichnung auf Creme-Papier, Bauteile mit dünnen Linien + Versal-Labels in schmaler Grotesk | Schicht 2: Website halb fertig / halb Bauplan, Trennlinie wandert, Beschriftungslinien zeichnen sich, Labels in JetBrains Mono Versalien |
| Glas-Ebenen (lina) | 5–6 milchige Glas-Ebenen schräg gestapelt, warmes Licht, Mini-Icons schweben zwischen den Ebenen | Ebenen-Stapel als Rückgrat des ganzen Reels, Schicht-4-Infos als Glas-Ebenen |
| Farbkarten mit Hex | grosse Farbflächen, Name in Condensed-Versalien + Hex-Code | Schicht 1: drei Farbkarten 60/30/10 mit Hex, fächern auf (in Solleva-Farben) |
| Neon-Gitter-Böden | violette/blaue Gitter in Perspektive, Leuchten am Horizont, sonst schwarz | Schicht 4: violettes Neon-Gitter (nur Violett/Lavendel, Cyan als Akzent) |

---

## 2. Stil-Steckbrief

**Basis:** Solleva-Steckbrief (nur Kanal-Farben). Hauptstimmung **S1 hell**, Kontrast-Moment **S2 Nacht** (Hook + Schicht 4). Kein Widerspruch zu den Referenzen: Orange/Rot/Beige aus dem Video übernehme ich **nicht**, nur die Bewegung und das Studio-Licht.

- **Farben:** Papier #F6F5FC · Lavendel #ECE6FF · Tinte #14123A · Nacht #070A24 · Violett #6C3FD4 · Lavendel-Akzent #A98BFF · Cyan #8FE3FF (nur auf Nacht, Ladebalken/Besucher) · Gold #F2C46D (nur Sterne). Studio-Schwarz #05060F nur als Higgsfield-Grund.
- **Schrift:** Barlow 800 (Satz), Instrument Serif kursiv (Schlüsselwort), JetBrains Mono Versalien (Kapitel-Labels, Bauplan-Beschriftungen, Zähler).
- **Formen:** Ebenen = weisse Karten Radius 30, Glas-Ebenen mit 2-px-Lavendel-Rand + Innenleuchten. Cursor C01.
- **Rückgrat (neu):** CSS-3D-Ebenen-Stapel, 55° gekippt, −32° gedreht, Ebenen-Abstand 120–140 px, dreht ständig leicht (nie Stillstand).
- **Übergänge (Set für dieses Reel):**
  - **U18 Unschärfe-Wisch** (aus Referenz): 8 Frames, Whip, Bewegungsunschärfe bis 24 px, Kamera-Ruck 3,5 %, Nachfedern 10 Frames
  - **U19 Partikel-Zerfall** (aus Referenz): 14 Frames, Partikel in Lavendel/Violett, driften nach oben-rechts
  - **U20 Licht aus** (Signature): 2 Frames Schwarz, Gitter fährt in 14 Frames hoch (Land-Kurve), Drop des Beats genau hier
  - **U21 Zusammensetzen** (aus Referenz): Teile fliegen von den Rändern ein, 30 Frames, Heavy-Kurve, Einrasten mit Klick + Schlag
  - dazu U16 Licht-Bloom (Licht geht an, Schicht 1) aus dem Baukasten
- **Rhythmus:** Ø Einstellung ~1,6 s (Referenz 1,5–2 s); in längeren Sätzen (Satz 3, 4, 7) Unter-Ereignisse alle 0,4–0,6 s. Schnitte auf Satzgrenzen; mit Beat zusätzlich auf Takte.
- **Sound-Momente:** Swish 2 Frames vor jedem Wisch · Glitzer auf Partikel-Zerfall · Klick auf Cursor-Klicks · Pop auf Karten/Badges · Ratsche-19 beim Ladebalken · tiefer Schlag + Stille auf «Licht aus» (Drop) · Klick + Schlag beim Einrasten · Impact auf CTA.
- **Musik:** dein Beat; **Drop auf «Licht aus»** (Satz 6, ca. 16,5 s). Startpunkt im Song wähle ich per Energie-Hüllkurve, sobald die Datei da ist.

### Gesehen → so setze ich es um (jede deiner Notizen)
| Deine Notiz | Umsetzung | Wo |
|---|---|---|
| Website-Stapel schweben schräg, fächern sich auf | CSS-3D-Stapel, fächert im Hook von 6 auf 120 px auf, Ebenen zählen 01–04 | Satz 1 |
| alle 1,5–2 s neue Website in anderem Look | Stapel wechselt pro Schicht den Look (Farbkarten → Bauplan → Handy → Drahtgitter → flach), Ø 1,6 s | ganzes Reel |
| Wisch mit Bewegungsunschärfe | U18, 8 Frames | Satz 2→3 (Licht an), 3→4 |
| Partikel-Zerfall | U19, 14 Frames | Satz 4→5 (Bauplan zerfällt zu Handy) |
| Teile fliegen auseinander, setzen sich als flache Desktop-Seite zusammen | U21 im Finale; danach fliegt die Seite ins Handy | Satz 9 |
| dunkles Studio, Spiegelboden, Spotlicht | Higgsfield H1 + Code-Reflexion des Stapels | Satz 1–2 |
| Fujifilm halb Foto / halb Zeichnung | Bauplan-Split mit wandernder Trennlinie + Beschriftungslinien | Satz 4 |
| Glas-Ebenen (lina) | Glas-Ebenen für Ladezeit / lokal / Datenschutz | Satz 7–8 |
| Farbkarten mit Hex | 60/30/10-Karten mit Hex, fächern auf | Satz 3 |
| Neon-Gitter-Böden | Higgsfield H5 (Video), Code-Gitter als Platzhalter | Satz 6–8 |

---

## 3. Skript (eine Zeile = ein Moment)

| # | Label | Gesprochener Satz | Schlüsselwort | Bild-Moment / Übergang | Quelle |
|---|---|---|---|---|---|
| 1 | — | Jede gute Website hat vier Schichten. | **vier** | Dunkles Studio, Gym-Stapel dreht im Spot, fächert auf «vier» in 4 Ebenen, Zähler 01–04 | H1 + Code |
| 2 | — | Die wichtigste siehst du nie. | **nie** | Unterste Ebene flackert gestrichelt, «?» leuchtet; Kamera-Ruck auf «nie» | H1 + Code |
| 3 | // 01 MARKE | Eins: die Marke. Zwei Farben, zwei Schriften, echte Bilder. | **echte** | **Licht geht an** (U16+U18) → Lavendel-Papier mit Fensterschatten; Farbkarten 60/30/10 fächern; Logo hell/dunkel/winzig; **Humor:** Stock-Lächeln-Foto bekommt Stempel «NEIN, DANKE», echtes Gym-Foto rutscht drüber | H2 + Code |
| 4 | // 02 STRUKTUR | Zwei: Struktur. In fünf Sekunden klar: was, wo, für wen. | **fünf Sekunden** | Bauplan-Papier, Seite halb fertig / halb Konstruktion, Uhr 0:00→0:05, Linien zeichnen sich: Botschaft, Menü max. 5, Leistungen, Team, Bewertungen | H3 + Code |
| 5 | // 03 HANDLUNG | Drei: ein Haupt-Button. Und die Nummer anklickbar. | **anklickbar** | Partikel-Zerfall (U19) → Lavendel-Wellen mit Bloom; Handy, Cursor klickt Button (Leuchten) und Nummer (Ripple); Öffnungszeiten + Karte ploppen raus | H4 + Code |
| 6 ★ | // 04 DAS UNSICHTBARE | Und vier … sieht keiner. | **keiner** | **SIGNATURE: Licht schlagartig aus** (U20) auf «vier», **Drop**; violettes Neon-Gitter, Seite nur noch leuchtendes Drahtgitter | H5 + Code |
| 7 | // 04 LADEZEIT | Lädt sie auf dem Handy über drei Sekunden, springen laut Google viele ab. | **drei Sekunden** | Drahtgitter faltet sich zum Glas-Handy, Ladebalken + Zähler 0,0 → 3,0 s (Ratsche), bei 3,0 wird Balken rosa, Besucher-Punkte fallen weg, «Quelle: Google» | H5 + Code |
| 8 | // 04 LOKAL | Dazu: lokal gefunden werden. Datenschutz sauber. | **gefunden** | Drei Glas-Ebenen stapeln sich: Mobile zuerst · Lokales SEO + Profil (Pin Olten, Sterne) · Impressum/Datenschutz revDSG | H5 + Code |
| 9 | — | Erst alle vier zusammen bringen Anfragen. | **zusammen** | Alle 4 Ebenen rasten zusammen (U21, Klick+Schlag), Licht geht wieder an, flache Seite fliegt ins Handy | Code (+H2) |
| 10 | CTA | Wo hakt's bei dir? Schreib «Analyse». | **Analyse** | Endkarte hell, Cursor klickt auf «Analyse», 2 s Halt | Code |

Zahlen/Fakten: nur die Google-Aussage zur Ladezeit (ohne Prozentzahl). Telefonnummer, Öffnungszeiten, Gym = Platzhalter. «revDSG» steht nur als Text im Bild, gesprochen «Datenschutz».

---

## 4. Higgsfield-Plan und Kosten (noch nichts generiert)

Preise heute per `get_cost` abgefragt: Bild GPT Image 2.6 high = **1,5**, Video Kling 3.0 5 s = **10** (Seedance 2.5 wäre 35–80, nicht nötig), Stimme = **0,15/Satz**. Guthaben: **239,75**.

| ID | Was | Prompt-Entwurf (gekürzt) | Typ | Credits |
|---|---|---|---|---|
| H1 | Studio | «empty dark photo studio, glossy black reflective floor, single soft spotlight from above, faint violet haze, no objects, 9:16, cinematic, minimal» | 2 Bilder + 1 Video (langsamer Push) | 3 + 10 |
| H2 | Lavendel-Papier | «lavender paper desk surface top-down, soft window-frame shadow falling diagonally, morning light, subtle paper grain, no objects» | 2 Bilder + 1 Video (Schatten wandert) | 3 + 10 |
| H3 | Bauplan-Papier | «off-white architectural drafting paper, faint violet grid, soft light, top-down» | 1 Bild | 1,5 |
| H4 | Lavendel-Wellen | «flowing lavender silk waves, soft bloom light in the center, pastel violet, dreamy, no objects» | 2 Bilder + 1 Video | 3 + 10 |
| H5 ★ | Neon-Gitter | «endless violet neon grid floor in perspective, glowing horizon, black void, synthwave but minimal, slow forward camera glide» | 2 Bilder + 2 Video-Varianten | 3 + 20 |
| G1–G3 | Gym-Fotos für die Beispielseite | Gym-Innenraum Hanteln, Trainerin-Porträt (fiktiv), Kurs-Detail; natürliches Licht | 3 Bilder | 4,5 |
| G4 | Stock-Foto (Humor) | übertrieben gestelltes Stock-Fitness-Lächeln | 1 Bild | 1,5 |
| — | Stimme Andre | 10 Sätze | Audio | 1,5 |
| | | | **Total ganzes Reel** | **ca. 75** |
| | | davon **Stiltest** (H5 + Stimme) | | **ca. 25** |

Kein KI-Text in den Clips: alle Hintergründe ohne Schrift; Text kommt immer aus Code.

---

## 5. Neu in diesem Reel (für Logbuch + Katalog)
- **B08 Ebenen-Stapel** (CSS-3D, Spiegel-Reflexion) · **W08 Neon-Gitter** · **W09 Bauplan** · **W10 Lavendel-Papier mit Fensterschatten**
- Übergänge **U18 Unschärfe-Wisch**, **U19 Partikel-Zerfall**, **U20 Licht aus**, **U21 Zusammensetzen**
- Format: «Schichten/Explosionszeichnung» (neu, Logbuch war leer)

## 6. Offene Punkte für dich
1. **Freigabe** von Skript + Storyboard (Korrekturen hier kosten nichts).
2. **Beat** hochladen (MP3/WAV), damit ich den Drop auf «Licht aus» lege.
3. **solleva.ch** statt/zusätzlich zum Gym? Vorschlag: Gym bleibt das Beispiel (Zielgruppe erkennt sich), echte Screenshots von solleva.ch landen im Finale im Handy («so sieht's bei mir aus») oder bleiben für ein eigenes Reel. Dafür müsste solleva.ch in der Umgebung erlaubt werden (aktuell blockiert) oder du lädst 2–3 Screenshots hoch.

---

## 7. Abgabe v1 (17.11.2026) – `docs/reels/final/vier-schichten-v1-ohne-musik.mp4`

**Messwerte:** 34,9 s · 1080×1920 · 30 fps · H.264 yuv420p TV-Range · AAC 48 kHz · −13,8 LUFS · Peak −1,4 dBFS.
**Stimme:** Andre, 10 Sätze einzeln; lange Pausen im Satz auf 0,25 s gekürzt (Satz 6 bewusst 0,45 s), 0,22 s zwischen Sätzen, Tempo 1,05, 1,6 s Halt (CTA steht insgesamt 4,3 s). Timeline: `src/reels/vierSchichten/timeline.json`, Skript `tools/vs_timeline.py`.
**Musik:** noch keine (Beat fehlt). Einmischen: Datei nach `assets/reels/vier-schichten/beat.mp3`, Prop `mitMusik`, Drop auf Frame 548 («vier» = Licht aus).

### Abgleich mit deinen Referenz-Notizen
| Notiz | Umsetzung | Zeit |
|---|---|---|
| Stapel schwebt schräg, fächert auf | B08, fächert auf «vier» auf, Ebenen beschriftet 01–04 | 0:00–0:04 |
| alle 1,5–2 s neuer Look | Studio → Papier → Bauplan → Wellen → Neon-Licht → Neon-Flug → Papier → Endkarte; innerhalb der Sätze Unter-Ereignisse alle 0,4–0,8 s | ganz |
| Wisch mit Bewegungsunschärfe | U18 (8 Frames) | 0:08,9 · 0:20,1 · 0:24,2 (hoch) |
| Partikel-Zerfall | U19 (14 Frames) | 0:14,2 |
| Teile fliegen auseinander → flache Seite | U21 + Licht an | 0:27,9–0:29,2 |
| dunkles Studio, Spiegelboden, Spot | H1 (Kling) + Code-Reflexion | 0:00–0:04,5 |
| Fujifilm halb Foto/halb Zeichnung | Split-Linie + Beschriftungslinien + Kringel WAS/WO/FÜR WEN | 0:08,9–0:14,2 |
| Glas-Ebenen (lina) | Glas-Ebenen Mobile/SEO/revDSG, Drahtgitter-Ebenen | 0:18,3–0:27,9 |
| Farbkarten mit Hex | 60/30/10 mit Hex, fächern auf «Zwei Farben» | 0:06,0 |
| Neon-Gitter violett | H5 B (Lichtkegel, Ping-Pong) + H5 A (Flug) | 0:18,3–0:27,9 |

### Sound-Momente (Auswahl)
Schlag-02 exakt auf «vier» (Frame 548) · Glitch beim Neon-Anflackern · Schlag-01 auf «keiner» · Ratsche-19 unter dem Ladebalken · Klicks auf Button/Nummer/CTA · Ratsche-12 + Schlag-03 beim Einrasten (Frame 876) · Pops auf Karten/Badges · Swishes 2 Frames vor jedem Wisch.

### Bewusst anders als im Skill
- **Keine zwei Versionen A/B mit Best-of-Schnitt**: Storyboard und Stiltest waren freigegeben, ich habe direkt diese eine Fassung gebaut. Bei Bedarf rendere ich einzelne Sätze als Variante.
- Schicht 2 (Struktur) hält dieselbe Seite 4,6 s; Ereignisse alle ~0,6 s (Split, Uhr, Linien, Kringel), aber kein Hintergrundwechsel.

### Credits
Stiltest 22,45 · ganzes Reel weitere ≈ 43 (11 Bilder + 3 Kling-Pro-Clips) → total ≈ 65 (Schätzung war 75).
