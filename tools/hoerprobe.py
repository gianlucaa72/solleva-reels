"""Baut sounds/hoerprobe.html (relativ verlinkt) und out/sound-kit-hoerprobe.html (alles eingebettet)."""
import json, base64, os, html, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(root, "sounds/sounds.json"), encoding="utf-8"))
beschr = {"swish": "Kurz & fallend: Einflug, Karten, Text", "whoosh": "Rauschend: Lupe, Kamerafahrt, Szenenwechsel",
          "papier": "Papier & Karten: Collage-Look", "klick": "Cursor, Einrasten, Häkchen", "schlag": "Landung, Enthüllung, CTA",
          "glitzer": "Enthüllung, Wow-Moment", "downlifter": "Stakkato, Bruch, Rückspulen", "riser": "Spannung vor dem grossen Moment",
          "pop": "Text & Elemente erscheinen", "glitch": "Dunkle Stimmung, Störung", "tippen": "Tippen", "schreiben": "Handschrift, Kringel",
          "ratsche": "Zahnrad / Ratsche: etwas rollt aus, Linie zeichnet sich, Zähler läuft (13–17 selbst erzeugt)"}
def build(embed):
    rows, cat = [], None
    for s in S:
        if s["kategorie"] != cat:
            cat = s["kategorie"]; rows.append(f'<h2>{cat}<span>{beschr.get(cat, "")}</span></h2>')
        p = os.path.join(root, "sounds/mixkit", s["datei"])
        src = ("data:audio/mpeg;base64," + base64.b64encode(open(p, "rb").read()).decode()) if embed else "mixkit/" + s["datei"]
        nr = s["datei"][: len(cat) + 3]
        rows.append(f'<div class="row"><div class="info"><b>{nr}</b> {html.escape(s["titel"])}<small>{s["dauer"]:.1f} s · Hit bei {s["hit"]:.2f} s</small></div><audio controls preload="none" src="{src}"></audio></div>')
    return f'''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Solleva Sound-Kit</title>
<style>:root{{--bg:#F6F5FC;--card:#fff;--ink:#14123A;--muted:#6E6C92;--line:#E1DDF5;--acc:#6C3FD4}}
@media (prefers-color-scheme:dark){{:root{{--bg:#070A24;--card:#11143A;--ink:#F6F5FC;--muted:#9a9cc8;--line:#22265A;--acc:#A98BFF}}}}
body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.4 system-ui,-apple-system,sans-serif;padding:24px 16px 60px}}
main{{max-width:760px;margin:auto}}h1{{font-size:28px;margin:0 0 6px}}p{{color:var(--muted);margin:0 0 20px}}
h2{{font-size:15px;text-transform:uppercase;letter-spacing:.12em;color:var(--acc);margin:28px 0 8px}}h2 span{{display:block;text-transform:none;letter-spacing:0;color:var(--muted);font-weight:400;font-size:14px}}
.row{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px;margin:8px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap}}
.info{{flex:1 1 220px;min-width:0}}.info b{{font-family:ui-monospace,monospace;color:var(--acc);margin-right:6px}}small{{display:block;color:var(--muted)}}audio{{flex:1 1 240px;max-width:100%;height:36px}}</style></head>
<body><main><h1>Solleva Sound-Kit</h1><p>{len(S)} lizenzfreie Sounds (Mixkit + selbst erzeugt), sortiert nach Einsatz im Reel. Notier dir die Nummern deiner Favoriten (z. B. «swish-03, ratsche-16») und was fehlt.</p>{"".join(rows)}</main></body></html>'''
open(os.path.join(root, "sounds/hoerprobe.html"), "w", encoding="utf-8").write(build(False))
os.makedirs(os.path.join(root, "out"), exist_ok=True)
open(os.path.join(root, "out/sound-kit-hoerprobe.html"), "w", encoding="utf-8").write(build(True))
print(len(S), "Sounds")
