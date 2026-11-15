# Solleva Motion-System (Baukasten für Reels)

Status: **Entwurf v0.1, Grundgerüst.** Die Bausteine (U01–U08, X01–X07, C01, E01) sind Platzhalter auf Basis des bisherigen Solleva-Steckbriefs. Sie werden nach der Analyse der Referenz-Clips des Nutzers überarbeitet oder ersetzt. Vorher nichts davon als «fertigen Solleva-Stil» behandeln.

## Regeln
- Es gilt der Skill `reel-produktion` (Ablauf, Freigaben, Stiltest) und `motion-design` (Kurven, Timing).
- **Keine Higgsfield-Generierung und kein Reel ohne ausdrückliche Freigabe des Nutzers.**
- Fester Kern (immer gleich): Farben, Schriften, Endkarte, Stimme, Signatur-Sounds → `src/brand/solleva.ts`.
- Abwechslung (pro Reel wechselnd): Format, Stimmung (S1–S4), Übergangs-Set, Hintergrundwelt, Tempo, Hook-Typ.
- Vor jedem Reel `LOGBUCH.md` lesen: was in den letzten 3 Reels vorkam, nicht wiederholen. Pro Reel mindestens ein neues Element.
- Neue Bausteine bekommen eine feste Nummer und kommen in den Katalog (`src/katalog/Katalog.tsx`).

## Struktur
- `src/brand/solleva.ts`: Farben, Stimmungen S1–S4, Schriften, Formen, Safe Zones
- `src/lib/bewegung.ts`: Kurven Land/Heavy/Whip, Helfer
- `src/components/`: Hintergrund, Karte, Label, Cursor (C01), Endkarte (E01)
- `src/transitions/Uebergaenge.tsx`: Übergänge U01–U08
- `src/text/Texteffekte.tsx`: Texteffekte X01–X07
- `src/katalog/Katalog.tsx`: Katalog-Video aller Bausteine
- `sounds/`: Sound-Kit (folgt, nach Referenzen)
- `public/fonts/`: Schriften lokal (vorläufig Barlow, Instrument Serif, JetBrains Mono; Nutzer will Schriften evtl. noch überarbeiten)

## Befehle
- `npm install`
- `npx remotion still Katalog out/bild.png --frame=N` (Standbild)
- `npm run katalog` (Katalog-Video, nur auf Wunsch)
