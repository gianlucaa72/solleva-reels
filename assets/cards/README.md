# Karten für die Slot-Walzen

Jede Datei ist eine Karte im Seitenverhältnis **2:3** (aktuell 400 × 600 px, PNG). Die Walzen zeigen genau diese Bilder;
wer eine Datei durch eine illustrierte Karte mit **gleichem Namen und gleichem Format** ersetzt, muss an der Animation nichts ändern.

| Datei | Bedeutung | Walzen-Index |
|---|---|---|
| `treffer.png` | Gewinn (Herz) | 0 |
| `niete.png` | Niete (✕) | 1 und 5 |
| `stern.png` | Stern | 2 |
| `frage.png` | Fragezeichen | 3 |
| `klee.png` | Kreuz/Klee | 4 |

Hinweis `treffer.png`: In Szene 2 öffnet sich in der Treffer-Karte ein **herzförmiges Portal** in die nächste Szene
(Herz 79 % der Kartenbreite, mittig, Vorlage in `src/reels/spielautomat/v4/Karte.tsx`). Eine illustrierte Treffer-Karte
sollte ihr Herz an derselben Stelle haben, dann ist der Übergang nahtlos.

Platzhalter neu erzeugen: `npx remotion still Karte assets/cards/<name>.png --props='{"name":"<name>"}' --image-format=png`
