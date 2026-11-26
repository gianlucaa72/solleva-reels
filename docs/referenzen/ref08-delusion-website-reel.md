# Referenz 08: Website-Showcase-Reel eines Webdesigners (delusion.ch, Instagram)

Quelle: Bildschirmaufnahme von Gianluca (26.11.2026), 8,2 s, iPhone 1320×2868, 60 fps, Reel im Instagram-Feed (Bereich ca. y 420–2070).
Wunsch: **nicht kopieren**, aber diese Art statt Erklär-Reel: **nur Website + Musik, keine Stimme.**

## Zeit → Bild / Übergang
| Zeit | Bild | Bewegung |
|---|---|---|
| 0,0–0,6 s | Ende des vorherigen Projekts (Schuh-Website, Riesen-Typo «LA…T») | – |
| 0,6–4,2 s | **Projekt «VERDA»** (Schmuck): Desktop-Browserfenster oben links (läuft links aus dem Bild), iPhone vorne rechts überlappend, beide zeigen dieselbe Seite. Hintergrund = Bild der Website, stark unscharf und abgedunkelt. | Geräte leicht 3D gekippt (wenige Grad), schweben langsam; **Inhalte wechseln synchron Abschnitt für Abschnitt** («Ein Tropfen Licht» → «Nah am Herzen» → «Zum Bleiben gemacht»), Wechsel ca. jede Sekunde als weicher Wisch/Scroll |
| 3,6–4,9 s | Kamera fährt **durchgehend** auf den Desktop zu, bis das Produktbild (Ring) das ganze Bild füllt | Push, immer schneller, am Ende Bewegungsunschärfe |
| 4,9–5,3 s | Übergang: grüne Streifen / RGB-Glitch, dann Riesen-Typo «NO…» | harter, kurzer Effekt |
| 5,3–8,2 s | **Projekt «NOIR INK»** (Tattoo): Name riesig, Kamera zieht auf Desktop + iPhone zurück, schwarzer Hintergrund | Zug zurück, dann wieder Schweben |

Szenenwechsel (Messung `scene>0.25`): 0,11 s und 5,89 s → innerhalb eines Projekts **kein Schnitt**, alles fliesst über Kamera und Scroll.

## Look
- Zwei Geräte zusammen (Desktop + Handy): zeigt «auf jedem Gerät schön».
- Hintergrund aus der Website selbst (unscharf) → jedes Projekt hat automatisch seine eigene Farbwelt.
- Leichte chromatische Aberration (RGB-Rand) an den Gerätekanten bei Bewegung.
- Keine eigenen Texte: die Website spricht für sich.

## Ton
- Musik ca. **97 BPM** (Puls 0,62 s), Pegel fällt bei 4,5 s ab (−27 dB) und kommt mit dem **Drop bei ≈ 5,6 s** zurück: Der Projektwechsel sitzt genau auf dem Drop.
- Keine Stimme, keine Soundeffekte erkennbar (Klangurteil beim Nutzer abholen).

## Gesehen → so setze ich es um (ohne zu kopieren)
| Gesehen | Bei uns |
|---|---|
| Desktop + iPhone, synchroner Inhalt | gleich (Grundprinzip), eigene Geräte-Rahmen im Code, Solleva-Glanzkante statt Standard-Mockup |
| unscharfer Website-Hintergrund | gleich, plus langsamer Lichtverlauf in Solleva-Lila |
| Abschnittswechsel ca. 1×/s | echte Bildschirmaufnahmen, Wechsel **auf den Beat** (0,62 s × 2) |
| Push ins Produktbild → Glitch → nächstes Projekt | **eigener Übergang**: Push in das Bild des Handys, Zoom-Through (unsere Signatur) direkt ins nächste Projekt; kein Glitch |
| Riesen-Projektname | Projektname kurz gross in der Schrift des Projekts |
| Kamera immer in Bewegung | K06 Fluss-Kamera (`src/lib/flussKamera.ts`): eine Bahn, Minimum-Jerk, Gauss-geglättet |
