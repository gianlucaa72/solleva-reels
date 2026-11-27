# Reel 04 «Keine Filmcrew»: Abgabe v7

Datei (lokal, nicht im Repo): `out/r04/reel04-keine-filmcrew-v7.mp4` + Standbilder `reel04-v7-0.0s.png`, `-0.3s.png`, `-1.0s.png`.
Neu rendern: `npm run r04:assets`, `npx remotion render R04ReelV7 out/r04/roh-v7.mp4`, dann `tools/r04_mix.sh out/r04/roh-v7.mp4 out/r04/reel04-keine-filmcrew-v7.mp4`.

## Was sich gegenüber v6 geändert hat (nur Einstieg + ein Übergang)
- **Szene 1 neu** (`src/reels/r04/V7.tsx`, `HookSzene`), 54 Frames = 1,8 s: Text «DIESES VIDEO HAT KEINE / FILMCREW GEMACHT.» ab Frame 0 voll da
  (gleicher Stil wie «FILMCREW»: Archivo 900, 118 %, weiss, violetter 3D-Schatten; 50 / 57 px, damit beide Zeilen in x 95–900 passen, Oberkante y 300).
  Klappe offen ab Frame 0, holt bis Frame 5 noch etwas aus, schlägt bis Frame 9 (0,3 s) zu: Overshoot 2°, kleiner Rückprall, Brett-Puls,
  Kreidestaub, Shake 3/2/2/1 px über 4 Frames. Dann Push durch den Schnitt (Mitte = Frame 54).
- **«Früher …»** (gelbe Handschrift) schreibt sich am Anfang der Szene «Kamera. Licht. Schnitt.» unter den drei Zeilen ein (x 130, y 514), bevor «KAMERA.» erscheint.
  Szene 2 beginnt dafür 12 Frames vor «KAMERA.» (alter Frame 82).
- **Loch vor «DER UNTERSCHIED:» geschlossen**: Zeile steht ab dem ersten Frame der Schreibmaschinen-Szene (vorher 9 leere Frames + 6 Frames Einblenden).
- **Timing**: alles ab Szene 2 ist v6, um 28 Frames (0,93 s) nach vorne gerückt (`<Sequence from={-28}>`): Bild, Stimme, Sounds, Musik und Figur-Clips
  bleiben untereinander exakt synchron (geprüft: v7-Frame 200 = v6-Frame 228, Abweichung 0). Satz 1 der Stimme und die Sounds der alten Szene 1 fallen weg.

- **Figur in Satz 8 ohne Lippensynchronisation** (Nachtrag 27.11., Wunsch des Nutzers): Statt des Higgsfield-Clips steht die Figur still,
  nur der Kopf wackelt leicht (±2–3°) und nickt einmal auf «Nur ich.». Kopf und Körper aus `figur-b-frei.png` zerlegt
  (`tools/r04_figur_kopf.py` → `assets/r04/figur-kopf/`), Drehpunkt am Hals. Keine Credits. Landung mit Hüpfer, Stimme und Timing unverändert.
  Endkarte: Figur bleibt wie in v6 (ruhig, ohne Lippen).

## Messwerte v7
- 1080×1920, 30 fps, H.264 High yuv420p TV-Range, AAC 48 kHz, 839 Frames = 28,0 s (v6: 28,9 s)
- Lautheit −13,9 LUFS, Peak −1,8 dBFS
- Ton ab 2,4 s gegen v6 (um 28 Frames verschoben): bester Versatz 0 ms, Pegelunterschied 0,0 dB
- Bild ab Szene 2: v7-Frame 200 = v6-Frame 228 (Abweichung 0); Hook-Text bei 0,0 / 0,3 / 1,0 s ganz in der Safe Zone

## Platzhalter (werden 1:1 ersetzt, gleicher Name)
- `assets/r04/hook/hook-voice.mp3` → Hook-Stimme ab Frame 0. Platzhalter = Ausschnitt der bisherigen Stimme «Dieses Video? Keine Filmcrew.» (1,78 s).
  Läuft höchstens bis Frame 62 (dort setzt Satz 2 ein), die echte Datei also ≤ ca. 2,0 s.
- `assets/r04/hook/klappe-klack.mp3` → Klappen-Knall auf Frame 9. Platzhalter = `neu-wooden-film-clapperb-2`. Der Knall muss am Dateianfang liegen
  (sonst `HOOK_TON.KLAPPE_HIT_SEK` in `V7.tsx` anpassen). Darunter bleibt wie in v6 leise `neu-kick-drum-vintage-3`.
- Nach dem Ersetzen: `npm run r04:assets`, neu rendern, mischen.

# Abgabe v6 (Stand vorher)

Dateien (lokal, nicht im Repo): `out/r04/reel04-keine-filmcrew-v6.mp4` und `out/r04/reel04-keine-filmcrew-v6-ohne-musik.mp4`.
Neu rendern: `npm run r04:assets`, Stimme nach `public/r04/stimme-neu.mp3` kopieren, `npx remotion render R04Reel …`, dann `tools/r04_mix.sh roh.mp4 ziel.mp4`.

## Messwerte (gemessen, nicht geschätzt)
- 1080×1920, 30 fps, H.264 yuv420p TV-Range, AAC 48 kHz 256 kbit/s, 29,0 s
- Lautheit −14,0 LUFS, True Peak −1,5 dBFS, LRA 3,1 LU (beide Fassungen)
- Keine stillen Löcher (> 0,15 s unter −50 dB) in der Fassung mit Musik
- Szenenwechsel: 3,1 · 6,3 · 8,6 · 10,3 · 13,2 · 17,9 · 20,1 · 23,5 s (9 Welten), dazwischen ein Ereignis alle 0,3–0,6 s
- Kamera: keine Richtungswechsel innerhalb von 10 Frames (`npm run r04:kurve`)
- Credits Higgsfield für Reel 04 gesamt: 94,2 (137,3 → 43,2); ElevenLabs Scribe ca. 290 Credits

## Sounds (alle aus «new sounds», ausser markiert)
Musikbett: `neu-dark-cinematic-suspe` durchgehend, ca. 17 dB unter der Stimme (in der Fassung «ohne Musik» weg).
Übergänge: Stoff-/Luft-Swooshes (`neu-heavy-cloth-swoosh`, `neu-soft-wind-swoosh`, `neu-quick-air-swoosh`) 1–2 Frames vor dem Schnitt.

| Zeit | Moment | Sound |
|---|---|---|
|  0.00 s | Klappe schlägt zu | neu-wooden-film-clapperb-2 + neu-kick-drum-vintage-3 |
|  1.77 s | «früher …» schreibt sich | schreiben-01 (Mixkit) |
|  3.10 s | Schnitt Satz 1→2 | neu-heavy-cloth-swoosh-1 |
|  3.30 s | Kamera fächert ein, rattert | neu-quick-air-swoosh-li-1 + neu-vintage-16mm-film-ca-2 |
|  4.13 s | Lichtschalter, Lampe geht an | neu-heavy-studio-light-s-4 |
|  4.73 s | Filmrolle läuft | neu-film-reel-spinning-4 |
|  5.47 s | Wochenblätter (Ratsche bleibt) | ratsche-19 + neu-paper-page-flip-dry-1 |
|  6.57 s | Umschlag + Zettel | neu-paper-page-flip-qui-4 / -3 |
|  7.60 s | Stempel «NUR FÜR GROSSE» | neu-rubber-stamp-pressed-1 (neu) |
|  8.63 s | Riser vor dem TV | neu-riser-build-up-2 |
|  8.67 s | Röhren-TV geht an (KI-Moment) | neu-old-crt-television-s-1 (neu) |
|  9.10 s | TV schaltet ab | neu-tape-stop-effect-ca-1 |
|  9.47 s | «KI» auf VHS-Blau | glitch-02 + neu-short-impact-hit-pu |
| 10.33 s | Fahrt durch den Bildschirm | neu-slow-bass-woosh |
| 10.77 s | Roboter-Polaroid landet | neu-soft-pop-ui-click-1 |
| 12.27 s | Filzstift-X | neu-thick-felt-tip-marke-2 (neu) |
| 14.93 s | Schreibmaschine tippt (ein Klack pro Buchstabe), Karten werden angepinnt | neu-old-mechanical-typew-1/-2, neu-paper-page-flip-qui-3, neu-wooden-knock-on-a-ta-1 |
| 19.20 s | Laden hebt ab | neu-small-brass-bell-abo-1 (neu) |
| 20.40 s | Mini-Figur landet (Tock) | neu-wooden-knock-on-a-ta-2 + neu-kick-drum-vintage-4 |
| 22.47 s | «NUR ICH.» | neu-deep-cinematic-boom (leise) |
| 26.43 s | Button wird gedrückt | neu-vintage-camera-shutt-1 + neu-deep-cinematic-boom |

## Hintergründe
| Satz | Welt | Status |
|---|---|---|
| 1 Filmcrew | violetter Samt mit Spot (`welt-samt-b`), Matte unten links angedeutet | neu |
| 2 Wochenlang | Film-Set-Holztisch (`welt-filmset-a`) | unverändert |
| 3 Grossen | Chef-Schreibtisch (`welt-chef-b`) | unverändert |
| 4 KI | Retro-TV (`welt-tv-a`) | unverändert |
| 5 KI allein | Leuchttisch Lavendel (`welt-leuchttisch-b`) | neu |
| 6 Unterschied | violettes Korkbrett (`welt-kork-a`) + Schreibmaschine | neu |
| 7 kleine Betriebe | Flieder-Terrazzo (`welt-terrazzo-a`) | neu |
| 8 Nur ich | violette Schneidematte (`welt-matte-a`), Anker | wie gewünscht nur hier gross |
| 9 CTA | dunkelviolette Hohlkehle (`welt-hohlkehle-b`) | neu |

## Figur
Mini-Figur (Karikatur, vom Nutzer geliefert), freigestellt. Satz 8: spricht lippensynchron (Higgsfield Wan 2.7, Ton liegt exakt auf dem Clip). CTA: ruhig unter der Solleva-Karte, ohne Lippensynchronisation.

## Kamera
K05 «Referenz-Rhythmus»: pro Szene Eintritt + ein Akzent + Übergang, Heavy-Kurve, kein Nachschwingen. Prüfung `npm run r04:kurve`: keine Richtungswechsel innerhalb von 10 Frames.
