# Reel 05 «50 Millisekunden»: Übergabe an Claude Code (25.11.2026)

Branch: `reel-05-50-millisekunden` (abgezweigt von `reel-04-keine-filmcrew`, dem neusten Stand mit `sounds/neu`, Gleit-Kamera und Timing-Werkzeug; dazu `src/kamera/welt.tsx` (K01) aus `reel/spielautomat`).
Der ältere Branch `reel/website-sekunde` ist **verworfen** (zu «Standard», Glas-UI wie «KI-SaaS», Objekt-Parade ohne Zusammenhang). Nichts davon übernehmen ausser dem Auge.

Es gelten der Skill `reel-produktion` (Kopie: `skill/reel-produktion/SKILL.md`) und `motion-design`, dazu alle Regeln in `CLAUDE.md` und `LOGBUCH.md` der Branches `reel/spielautomat` und `reel-04-keine-filmcrew`.

## Stand
- **Konzept freigegeben** von Gianluca (25.11.2026): «50 Millisekunden in Zeitlupe», Farbwelt **wie die Website solleva.ch**.
- **Stimme:** René Deutschmann (ElevenLabs), nicht Andre.
- **Blinzeln per Kling freigegeben** und generiert (siehe Assets).
- **Noch offen (Pflicht-Freigaben):** Storyboard-Standbilder, danach 5-Sekunden-Stiltest. Erst danach das ganze Reel.

## Idee
Das ganze Reel spielt **innerhalb eines einzigen Blicks** (Bullet-Time). Eine Welt: die der Website solleva.ch (Nachthimmel, Planeten-Horizont mit Lavendel-Cyan-Atmosphäre, schwebende Prismen-Kristalle, Lichtbänder). Eine Kamera, vom Auge bis zum Planeten.
Roter Faden **Schwerkraft**: Was nicht gefällt, fällt. Was gefällt, steigt = «solleva» (anheben). Die Website-Headline lautet «Websites, die deinen Betrieb anheben.»

## Skript und Szenen (Ziel ca. 32 s, 8 Szenen)

| # | Satz (René) | Bild | Schrift-Idee | Übergang |
|---|---|---|---|---|
| 1 | 50 Millisekunden. Schneller als ein Wimpernschlag. | Auge (Kling-Blinzeln), LCD-Zähler 0,000 → 0,050 s; **«50 Millisekunden» steht ab Frame 0** | Stoppuhr-LCD (7-Segment, **Komma** statt Punkt) | Zoom-Through **in die Pupille** |
| 2 | So schnell weisst du, ob dir eine Seite gefällt. | Im Blick: Nebel-Hintergrund, alte **Muster-Praxis**-Seite schwebt eingefroren (wie im Vorher/Nachher-Regler auf solleva.ch) | Instrument Serif, «gefällt» kursiv | Kamerafahrt um die Seite |
| 3 | Noch bevor du ein Wort gelesen hast. | Text der alten Seite verschwimmt zu Strichen, Kamera umkreist sie | Schärfe-Zug: Wörter werden nacheinander scharf | weiter in derselben Welt |
| 4 | Gefällt sie nicht … ist sie weg. | **Bruch + Humor:** Besucherzähler springt 000412 → 000413, im selben Moment fällt die Seite und zerspringt in Zeitlupe in Glasscherben | «WEG.» riesig (Barlow 800), reisst mit dem Glas | **einziger harter Schnitt** auf «weg» |
| 5 | Und dieser Eindruck bleibt. Auch nach dem Lesen. | Scherben hängen eingefroren in der Luft, Kamera fliegt hindurch (Bullet-Time), jede Scherbe zeigt noch ein Stück der alten Seite | Text als Gravur in einer Scherbe | Flug durch die Scherben |
| 6 | Darum habe ich meine Seite neu gebaut. | **Signature:** Zurückspulen. Scherben fliegen zurück, drehen sich um 180°, auf der Rückseite ist die **echte neue solleva.ch** und setzt sich zum Handy zusammen | Chrom-Schrift (CSS `--chrome` der Website) | Kamera kippt nach oben |
| 7 | Für die ersten 50 Millisekunden. | Handy steigt über den Planeten-Horizont zwischen die Kristalle (= Website-Hero) | «50» als LCD-Echo von Szene 1 | Rausfahrt |
| 8 | Folge für mehr. | Endkarte E01 (@solleva.ch, «Heb dich von der Masse ab.»), dann Rausfahrt: alles war die Spiegelung in der Pupille → **Loop** zu Bild 1 | Endkarte | Loop (letzter ≈ erster Frame) |

Ich-Form ab Satz 6 (Gianluca arbeitet allein, nie «wir»). Schweizer Schreibweise, kein ß. Szene 4 «ist sie weg» ist eine Zuspitzung.

### Fakten und Quellen
- 50 ms: Lindgaard, Fernandes, Dudek & Brown (2006), «Attention web designers: You have 50 milliseconds to make a good first impression!», *Behaviour & Information Technology* 25(2), 115–126, doi:10.1080/01449290500330448. Zusammenfassung: Nature News, 13.01.2006 («Web users judge sites in the blink of an eye»).
- Das Urteil nach 50 ms deckt sich mit dem Urteil nach längerem Anschauen (Lindgaard 2006; Nachfolgestudie Tractinsky et al., 500 ms vs. 10 s hoch korreliert).
- Die Studie misst die **visuelle Anziehung** («gefällt»), nicht Käufe. Deshalb heisst es «ob dir eine Seite gefällt», nicht «ob du kaufst».
- 50 ms ≈ halb so lang wie ein Wimpernschlag (MediaPost zur Studie). «Schneller als ein Wimpernschlag» ist sicher.

## Look (Farben und Schriften der Website)
Aus den CSS-Variablen von solleva.ch:
- `--ink #04050c` (Grund) · `--night #0a0d22` · `--deep #2b2270` · `--violet #3b1e8c` · `--purple #6c3fd4` · `--lilac #a98bff` · `--cyan #8fe3ff` (nur Licht) · `--text #f1f2f7` · `--muted #b4bde0`
- `--chrome: linear-gradient(180deg, #fff 0%, #dfe5f1 30%, #8a93ab 50%, #f2f5fb 66%, #a7b0c6 84%, #e8ecf5 100%)`
- `--prism: conic-gradient(#8fe3ff, #6c3fd4, #ff4fa3, #ff8a3d, #ffe27a, #8fe3ff)`
- Schriften: Instrument Serif (Titel, Kursiv für das Schlüsselwort), Barlow 300–500 (Text). Kurven der Website: ease-out `.22,1,.36,1`, in-out `.65,0,.35,1`.

**Nicht verwenden:** Glas-UI-Karten als Hauptbild (wirkte bei «4 Schichten» v1 wie KI-SaaS), kleine Partikel und Sterne-Punkte (Nutzer mag sie nicht), Marmorbüsten und Schreibmaschine (schon in Reel 01 / Spielautomat / Reel 04), Smileys.

## Kamera und Tempo
- Szenenübergreifend K01 (`src/kamera/welt.tsx`) mit Zoom-Through; innerhalb der Szene Rhythmus wie Reel 04 (K05/Gleit-Kamera, `src/lib/gleitKamera.ts`): **pro Szene ein Eintritt, ein Akzent, ein Übergang**, Heavy-Kurve, kein Wippen auf jedem Wort (war «zu nervös»).
- Alle 0,3–0,6 s ein Ereignis, **kein Leerlauf**. Der erste Stiltest hatte 3,5 s Pause nach dem Zähler: genau das vermeiden.
- Safe Zone: Text x 95–900, y ≥ 300 und ≤ 1550.

## Scherben-Technik (Vorschlag)
- Alte Seite und neue Seite (Screenshot) gleich gross rendern; Fläche in ca. 18–26 Voronoi-Zellen teilen (fester Seed).
- Jede Scherbe = ein 3D-Element (`transform-style: preserve-3d`) mit **Vorderseite = alte Seite** und **Rückseite = neue Seite** (`backface-visibility: hidden`, Rückseite `rotateY(180deg)`), beide per `clip-path: polygon()` auf die Zelle zugeschnitten.
- Fall: Schwerkraft + Rotation, in Zeitlupe (Szene 4), Einfrieren (Szene 5), Rückwärts mit Drehung um 180° (Szene 6). Glanzkante pro Scherbe (Lilac/Cyan-Linie), leichte Bewegungsunschärfe.
- Alles im Code, ohne Credits.

## Assets
Alle Higgsfield-Bilder sind generiert und müssen nur heruntergeladen werden. **Gianluca wählt je eine Variante.** In der Cloud-Sitzung waren die Downloads blockiert; lokal sollten sie gehen.

| Asset | Job-ID | Datei-URL |
|---|---|---|
| Auge (gewählt, «perfekt») | – | `assets/r05/auge-original-752x1344.png` (Original), `assets/r05/auge.png` (1080×1920) |
| Auge Kling-Blinzeln (3 s, pro, ohne Ton) | f842d246-e2a4-4f5b-8014-119602363b62 | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155849_f842d246-e2a4-4f5b-8014-119602363b62.mp4 |
| Nebel A | 933ce458-5b38-43df-9c0c-eef94a4ada58 | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155711_933ce458-5b38-43df-9c0c-eef94a4ada58.png |
| Nebel B | b9b01842-836e-41fb-81c2-fb3da7b17fb1 | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155711_b9b01842-836e-41fb-81c2-fb3da7b17fb1.png |
| Planet A | 86ceb943-7da0-4b35-b2e2-ccba8e0aff6b | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155716_86ceb943-7da0-4b35-b2e2-ccba8e0aff6b.png |
| Planet B | 9a812ffd-b677-461c-8f18-4803ca64162e | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155713_9a812ffd-b677-461c-8f18-4803ca64162e.png |
| Kristalle A | d3a5e5da-3ab6-412e-8fb4-95fc7469723c | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155717_d3a5e5da-3ab6-412e-8fb4-95fc7469723c.png |
| Kristalle B | 5d8e84e9-265d-468b-a4e0-5881ac701855 | https://d8j0ntlcm91z4.cloudfront.net/user_3Io1qyRUgihFHN2NQlkPA7F5SxY/hf_20261125_155714_5d8e84e9-265d-468b-a4e0-5881ac701855.png |

- Kristalle lokal freistellen (rembg, `isnet-general-use`), nicht mit Credits.
- In Higgsfield importiertes Auge: media_id `ceb7e084-61ef-4ae7-9c81-51d0a31c198b` (für weitere Kling-Läufe).
- **Neue solleva.ch:** Screenshots in Handy-Grösse (390 px breit, 2×) selbst aufnehmen: Hero + Abschnitt «Websites, die man gern anschaut». Echte Seite, nicht nachbauen.
- **Alte Seite:** fiktive «Muster-Praxis» im Code (Times New Roman, blaue Kopfzeile «Herzlich Willkommen!», Linkliste, «Neu: Jetzt mit Gästebuch!!», Besucherzähler «000412»). Keine echte Firma.

### Stimme
- ElevenLabs, Stimme **René Deutschmann** `voice_id muSxG4dqYjBCkbpXqbEl`, Modell `eleven_v4`.
- **Ein einziger Take für das ganze Skript** (wie Reel 04), danach Wortzeiten mit Scribe und `tools/r04_timing.py` (für r05 kopieren/anpassen).
- Zwei Testsätze liegen im ElevenLabs-Flow `tT0awH2XZ92r0Z4QQpcC` (nur Probe, nicht verwenden).

### Ton
- Nur natürliche Geräusche aus `sounds/neu` und `sounds/mixkit` (siehe Sound-Haltung im Skill). Kandidaten: `neu-vintage-camera-shutt` (Blinzeln), `neu-slow-bass-woosh` (Pupillen-Zoom), `neu-deep-cinematic-boom` (Aufschlag), `neu-tape-stop-effect` / `downlifter-01` (Zurückspulen), `neu-soft-close-air-movem` (Aufsteigen), `ratsche-19` (Zähler).
- **Fehlt:** Glas zerspringt (Zeitlupe, tief, natürlich) → Mixkit suchen oder Higgsfield Mirelo (~0,75 Credits, nur nach Freigabe).
- Musik: zuerst `neu-dark-cinematic-suspe` als Bett testen (0 Credits), ca. 17 dB unter der Stimme.

## Credits
Bisher in dieser Sache: 1,5 (Auge) + 4,5 (Nebel/Planet/Kristalle) + 5,25 (Kling) = **11,25 Credits**. ElevenLabs: zwei Testsätze, ca. 1,3 US-Cent.

## Nächste Schritte für Claude Code
1. Assets herunterladen nach `assets/r05/higgsfield/`, Gianluca je eine Variante wählen lassen, Kristalle freistellen.
2. Screenshots der neuen solleva.ch aufnehmen.
3. **Storyboard:** 8 Schlüsselbilder mit echten Assets und Safe-Zone-Rahmen als Kontaktbogen → Freigabe Gianluca.
4. Stimme: ein Take, Wortzeiten.
5. **5-Sekunden-Stiltest:** Szene 1 komplett (Blinzeln, Zähler, Pupillen-Zoom-Through bis Szene 2) → Freigabe.
6. Ganzes Reel, Kontrolle, Mix (−14 LUFS, Peak ≤ −1 dBFS), Abgabe nach Skill Schritt 9, Logbuch-Zeile «05».

## Stand 25.11.2026 (Claude Code)
- Assets geladen nach `assets/r05/higgsfield/`. **Gewählt: Nebel A, Planet B, Kristalle A** (Vergleich: `docs/r05/varianten-wahl.jpg`).
- Kristalle A lokal freigestellt (Helligkeits-Alpha, ohne rembg): `assets/r05/kristalle/kristall-1..3.png`.
- Screenshots solleva.ch (390 px @2x): `assets/r05/solleva/hero.png`, `abschnitt-anschaut.png`, `ganz.png`.
- Storyboard v1 (Remotion `R05Storyboard`, Frames 0–7): `docs/r05/storyboard-v1.jpg` → wartet auf Freigabe.
- Bausteine neu in `src/reels/r05/Look.tsx`: LCD-Stoppuhr (7 Segmente, Komma), alte Muster-Praxis-Seite, Voronoi-Scherben mit Vorder-/Rückseite, Handy-Rahmen, Chrom-Schrift.

## Stand 25.11.2026 abends: v1 nicht gut (Feedback Gianluca)
- v1 (30,1 s) abgegeben, Urteil: «fast das schlechteste Reel». Gründe: **Scherben sehen billig aus, nicht wie Glas**; **es passiert zu wenig**, spätestens nach 10 s weg; nach dem Blinzeln sieht der Hintergrund gut aus, aber es passiert nichts ausser Wippen.
- Eigene Analyse: 8,3 s Extra-Pausen, Szenen 2–4 ≈ 8 s dieselbe Einstellung, 30 s fast nur Dunkelviolett, Hauptbild nur Code (nachgebaute Seite, Papier-Polygone), Signature-Moment nie im Stiltest geprüft.
- **Idee Gianluca:** komplett umbauen zu einem coolen Video mit Musik, das die neue Website präsentiert («wie im letzten»), mit Scrollen o. Ä.
- **Offen für morgen:** (1) Welches Video ist mit «wie im letzten» gemeint? (Reel «4 Schichten», Reel 01 oder extern) (2) Hook (Auge, Blinzeln, Stoppuhr) behalten? (3) Stimme + Musik oder nur Musik?
- Vorschlag Claude: echte Bildschirmaufnahme von solleva.ch (Playwright, 390 px @2x: Scrollen, Antippen, Vorher/Nachher-Regler) als Hauptmaterial, Schnitte im Takt der Musik, alle 0,3–0,6 s ein Ereignis, ca. 20–25 s. Erst Freigabe-Paket, dann Stiltest der ersten 10 s.
- Higgsfield-Guthaben: 14,68 Credits (Kling 5 s ≈ 10, Bilder 2 Var. ≈ 1,5).
