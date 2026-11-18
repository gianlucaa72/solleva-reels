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

## Bildsprache (Wunsch des Nutzers, gilt immer)
- **Nicht nur Folien mit Text**: jede Szene bekommt ein Bild zur Veranschaulichung.
- **Hauptbilder = echte, generierte Objekte/Figuren** (Higgsfield, freigestellt): z. B. realistisches **Gehirn**, **griechische Männer/Marmor-Statuen**, Cartoon-Figuren, PC fällt vom Himmel. **Nicht** die Emoji-Version davon.
- `assets/emoji/` (74 Fluent 3D, MIT, `src/bausteine/Emoji.tsx`) = **nur kleine Akzente**, kein Ersatz für Hauptbilder.
- Figuren/Objekte/Foto-Hintergründe mit Higgsfield **nur nach Freigabe**, danach in `assets/` speichern und wiederverwenden.
- Hintergründe: Nutzer findet sie noch zu schlicht → pro Reel 1–3 Foto/Textur-Hintergründe vorschlagen.

## Offen
- Ratsche erledigt: Favoriten ratsche-18 (rollt aus) und ratsche-19 (gleichmässig).
- Musik: Reel 01 nutzt «Deep Urban» (Mixkit, `assets/musik/`), Drop auf Kapitelwechsel. Weitere Kandidaten: Close Up (175), Stylz (726).
- Tiefere Stimme bei Higgsfield testen (kostet Credits, nur mit Freigabe).
- Collage-Foto-Objekte (Hände, Geräte) via Higgsfield erst nach Freigabe.
