# Karten für die Slot-Walzen

Jede Datei ist eine Karte im Seitenverhältnis **2:3** (400 × 600 px, PNG). Die Walzen zeigen genau diese Bilder;
wer eine Datei durch eine andere Karte mit **gleichem Namen und gleichem Format** ersetzt, muss an der Animation nichts ändern.

| Datei | Karte (Illustration des Nutzers, Nov. 2026) | Rolle | Walzen-Index |
|---|---|---|---|
| `treffer.png` | Joker mit Goldmünze | Gewinn | 0 |
| `niete.png` | Kreuz 2 | Niete | 1 und 5 |
| `niete-7.png` | Pik 7 | Niete | 2 |
| `frage.png` | Rückseite (rot/gold) | Unbekannt / Spannung | 3 |
| `niete-4.png` | Karo 4 | Niete | 4 |

- Originale (688 × 1024) liegen in `original/`; die PNGs sind daraus auf 2:3 zugeschnitten (x 2–685) und auf 400 × 600 skaliert.
- Hook: Walzen stoppen auf Joker, Joker, Rückseite. Szene «Meistens Niete. Aber manchmal: Treffer!»: Kreuz 2, Pik 7, **Joker**.
- Der Joker springt beim «Treffer!» aus der Walze, lacht und flippt die Münze (Kling-Animation, `assets/spielautomat/joker/`);
  die Kamera fährt durch die **Münze** in die nächste Szene. Wird `treffer.png` ersetzt, muss auch die Animation neu erzeugt
  und die Münzposition in `src/reels/spielautomat/v5/Voll5.tsx` (`MUENZE`) neu vermessen werden.
