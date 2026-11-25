"""Reel 05: Timing aus EINER Stimmdatei (ElevenLabs, ganzes Skript) -> src/reels/r05/timeline.json

Aufruf:
  python3 -I tools/r05_timing.py <stimme.mp3> [--woerter scribe.json] [--pause-vor 4=0.15,9=0.5]

- Ohne --woerter: Wortzeiten aus Sprechpausen (silencedetect) + Silbenverteilung (Näherung).
- Mit --woerter (ElevenLabs Scribe, Liste mit text/start/end): Wortzeiten exakt.
- --pause-vor: zusätzliche Pause (s) vor einem Satz, z. B. Halt nach dem Signature-Moment.
Die Stimme wird in Segmente pro Satz geschnitten (Datei-Zeiten bleiben unverändert), damit Extra-Pausen möglich sind.
"""
import json, os, re, subprocess, sys
ENDEN = []

FPS = 30
VORLAUF = 4  # erstes Wort bei Frame 4 (Hook in Sekunde 1)
HALT_ENDE = 2.5  # CTA steht 2 s

SAETZE = [
    "Fünfzig Millisekunden.",
    "Schneller als ein Wimpernschlag.",
    "So schnell weisst du, ob dir eine Seite gefällt.",
    "Noch bevor du ein Wort gelesen hast.",
    "Gefällt sie nicht … ist sie weg.",
    "Und dieser Eindruck bleibt.",
    "Auch nach dem Lesen.",
    "Darum habe ich meine Seite neu gebaut.",
    "Für die ersten fünfzig Millisekunden.",
    "Folge für mehr.",
]

def norm(w):
    w = w.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    w = re.sub(r"[^a-z]", "", w)
    return {"kai": "ki", "kaii": "ki", "real": "reel", "riel": "reel"}.get(w, w)

def silben(w):
    return max(1, len(re.findall(r"[aeiouyäöü]+", w.lower())))

def skript_woerter():
    out = []
    for i, s in enumerate(SAETZE, 1):
        for w in s.split():
            if norm(w):
                out.append({"satz": i, "w": re.sub(r"[«».,?!…–]", "", w), "n": norm(w)})
    return out

def pausen(datei):
    log = subprocess.run(["ffmpeg", "-i", datei, "-af", "silencedetect=n=-40dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    dauer = float(re.findall(r"Duration: (\d+):(\d+):([\d.]+)", log)[0][2]) + 60 * float(re.findall(r"Duration: (\d+):(\d+):([\d.]+)", log)[0][1])
    return list(zip(st, en + [dauer] * (len(st) - len(en)))), dauer

def zeiten_aus_pausen(datei, ww):
    """Sprechblöcke zwischen Pausen; Wörter nach Silben auf die Blöcke verteilt."""
    p, dauer = pausen(datei)
    bloecke, t = [], 0.0
    for a, b in p:
        if a - t > 0.05: bloecke.append([t, a])
        t = b
    if dauer - t > 0.05: bloecke.append([t, dauer])
    gesamt_s = sum(silben(w["w"]) for w in ww)
    gesamt_t = sum(b - a for a, b in bloecke)
    # Silben gleichmässig über die Sprechzeit legen
    pro = gesamt_t / gesamt_s
    zeit, bi, rest = [], 0, bloecke[0][1] - bloecke[0][0]
    pos = bloecke[0][0]
    for w in ww:
        zeit.append(pos)
        need = silben(w["w"]) * pro
        while need > rest + 1e-6 and bi < len(bloecke) - 1:
            need -= rest; bi += 1; pos = bloecke[bi][0]; rest = bloecke[bi][1] - bloecke[bi][0]
        pos += need; rest -= need
    return zeit, [(w, s) for w, s in zip(ww, zeit)], dauer

def zeiten_aus_scribe(pfad, ww):
    roh = json.load(open(pfad))
    roh = roh.get("words", roh) if isinstance(roh, dict) else roh
    sw = [x for x in roh if x.get("type", "word") == "word" and norm(x.get("text", ""))]
    # zusammengesetzte Wörter, die Scribe trennt («stehen bleiben» → stehenbleiben)
    ziel = {w["n"] for w in ww}
    i = 0
    while i < len(sw) - 1:
        z = norm(sw[i]["text"]) + norm(sw[i + 1]["text"])
        if z in ziel and norm(sw[i]["text"]) not in ziel:
            sw[i] = {"text": sw[i]["text"] + sw[i + 1]["text"], "start": sw[i]["start"], "end": sw[i + 1]["end"]}
            del sw[i + 1]
        i += 1
    zeit, j = [], 0
    global ENDEN
    ENDEN = []
    for w in ww:
        k = j
        while k < len(sw) and norm(sw[k]["text"]) != w["n"] and k < j + 4: k += 1
        if k < len(sw) and norm(sw[k]["text"]) == w["n"]:
            zeit.append(float(sw[k]["start"])); ENDEN.append(float(sw[k].get("end", sw[k]["start"]))); j = k + 1
        else:
            zeit.append(None); ENDEN.append(None)
    # Lücken (nicht erkannte Wörter) linear füllen
    for i, z in enumerate(zeit):
        if z is None:
            a = next((zeit[x] for x in range(i - 1, -1, -1) if zeit[x] is not None), 0.0)
            b = next((zeit[x] for x in range(i + 1, len(zeit)) if zeit[x] is not None), a + 0.3)
            zeit[i] = a + (b - a) * 0.5
    ende = float(sw[-1]["end"]) if sw else None
    return zeit, ende

def main():
    datei = sys.argv[1]
    arg = dict(zip(sys.argv[2::2], sys.argv[3::2]))
    extra = {int(k): float(v) for k, v in (x.split("=") for x in arg.get("--pause-vor", "").split(",") if x)}
    ww = skript_woerter()
    if "--woerter" in arg:
        zeit, sprach_ende = zeiten_aus_scribe(arg["--woerter"], ww)
        _, dauer = pausen(datei)
        sprach_ende = sprach_ende or dauer
    else:
        zeit, _, dauer = zeiten_aus_pausen(datei, ww)
        sprach_ende = max(b for a, b in [(0, dauer)]) - 0.05
    # Segmente pro Satz (Datei-Zeiten) + Reel-Startframes mit Extra-Pausen
    segmente, verschiebung = [], VORLAUF / FPS - zeit[0]
    for nr in range(1, len(SAETZE) + 1):
        idx = [i for i, w in enumerate(ww) if w["satz"] == nr]
        # Schnitt in der Mitte der Lücke zwischen letztem Wort und nächstem Satz (höchstens 0,12 s vor dem Wort)
        def schnitt(i):
            vor = ENDEN[i - 1] if i > 0 and ENDEN and ENDEN[i - 1] is not None else zeit[i] - 0.24
            return max(0.0, zeit[i] - min(0.12, (zeit[i] - vor) / 2))
        von = schnitt(idx[0])
        bis = schnitt([i for i, w in enumerate(ww) if w["satz"] == nr + 1][0]) if nr < len(SAETZE) else sprach_ende + 0.15
        verschiebung += extra.get(nr, 0.0)
        segmente.append({"satz": nr, "von": round(von, 3), "bis": round(bis, 3), "reel": round((von + verschiebung) * FPS)})
    def reel(i):
        nr = ww[i]["satz"]
        sg = segmente[nr - 1]
        return round(sg["reel"] + (zeit[i] - sg["von"]) * FPS)
    woerter = [{"satz": w["satz"], "w": w["w"], "n": w["n"], "f": reel(i)} for i, w in enumerate(ww)]
    letzte = segmente[-1]
    ende_f = round(letzte["reel"] + (letzte["bis"] - letzte["von"]) * FPS)
    out = {"quelle": os.path.basename(datei), "fps": FPS, "methode": "scribe" if "--woerter" in arg else "pausen", "segmente": segmente, "woerter": woerter, "dauer": ende_f + round(HALT_ENDE * FPS)}
    ziel = os.path.join(os.path.dirname(__file__), "..", "src", "reels", "r05", "timeline.json")
    json.dump(out, open(ziel, "w"), ensure_ascii=False, indent=1)
    for sg in segmente:
        ws = [f'{w["w"]}@{w["f"]}' for w in woerter if w["satz"] == sg["satz"]]
        print(f'Satz {sg["satz"]}: Datei {sg["von"]:.2f}–{sg["bis"]:.2f}s → Reel ab F{sg["reel"]}: ' + " ".join(ws))
    print("Dauer:", out["dauer"], "Frames =", round(out["dauer"] / FPS, 2), "s ->", ziel)

if __name__ == "__main__":
    main()
