# Reel 04 «Keine Filmcrew»: Abgabe v6

Dateien (lokal, nicht im Repo): `out/r04/reel04-keine-filmcrew-v6.mp4` und `out/r04/reel04-keine-filmcrew-v6-ohne-musik.mp4`.
Neu rendern: `npm run r04:assets`, Stimme nach `public/r04/stimme-neu.mp3` kopieren, `npx remotion render R04Reel …`, dann `tools/r04_mix.sh roh.mp4 ziel.mp4`.

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
