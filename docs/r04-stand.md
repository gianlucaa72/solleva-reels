# Reel 04 «Keine Filmcrew»: Stand für die nächste Sitzung (19.11.2026)

Branch: `reel-04-keine-filmcrew`. Assets: `npm run r04:assets` (kopiert nach `public/r04`), dazu `public/r04/stimme-neu.mp3` = `assets/r04/stimme-neu/take2.mp3`.

## Entschieden
- Hook: Klappe schlägt **einmal** in Frame 1 zu, FILMCREW sofort, Samt B + angedeutete Matte.
- Untertitel **aus**. Schreibmaschine (nicht Dymo). Auf dem TV «KI».
- Hintergründe: Samt B, Leuchttisch B, Kork A, Terrazzo A, Hohlkehle B. Holzpult, Chef-Schreibtisch, TV unverändert.
- Stimme: neue ElevenLabs-Datei, **Take 2** (`assets/r04/stimme-neu/take2.mp3`), Wortzeiten von Scribe (`take2-scribe.json`), Timeline mit `tools/r04_timing.py … --pause-vor 9=0.6`.
- Kamera **K05 «Referenz-Rhythmus»** (`src/reels/r04/kamera.ts`): pro Szene Eintritt + ein Akzent + Übergang, Heavy-Kurve, kein Nachschwingen. v2b (Bounce auf jedem Wort) war «zu nervös». Prüfung: `npm run r04:kurve`.
- Sounds: «new sounds» in `sounds/neu` (Namen `neu-…`), Ratsche bei «Wochenlang» bleibt, Musikbett `neu-dark-cinematic-suspe` ca. 17 dB unter der Stimme.

## Offen
1. **v3 beurteilen** (`out/r04/reel04-keine-filmcrew-v3.mp4`): Kamera ruhig genug?
2. **«Reel» am Schluss** klingt laut Scribe wie «Real»: Nutzer hört nach, ggf. letzten Satz neu als «Riel».
3. **Neue Mini-Figur** (Karikatur mit grossem Kopf, schwarzer Hoodie, Handy am Stativ) liegt nur als Chat-Vorschau vor: Nutzer lädt sie als Datei hoch.
4. **Figur wie Buffett** (Vorschlag, noch nicht freigegeben): Figur spricht «Dieses Video? Keine Filmcrew. Nur ich.» und den CTA selbst, lippensynchron mit Higgsfield **Wan 2.7** (start_image = Figur, audio_references = Satz 8 bzw. 9 aus Take 2), danach Video freistellen. Kosten ca. 10 Credits pro Video (2 Videos ≈ 20 + Freistellen). Guthaben 66,7.
5. Fehlende Sounds (Platzhalter aktiv): Gummistempel, Röhren-TV, Filzstift-X, Ladenglocke → Prompts in `docs/r04-sound-prompts.md`.
6. Am Ende: Sound-Liste, Hintergrund-Liste, Messwerte, Zeile im `LOGBUCH.md`.
