"""Übernimmt den Ordner «new sounds» (ElevenLabs) nach sounds/neu/ mit sauberen Namen und misst Einsatz/Hit/Dauer/Lautheit.
Aufruf: python3 -I tools/neue_sounds.py <quellordner>   (schreibt sounds/neu/*.mp3 und sounds/neu/sounds-neu.json)"""
import json, os, re, shutil, subprocess, sys, unicodedata
import numpy as np

quelle = sys.argv[1]
ziel = os.path.join(os.path.dirname(__file__), "..", "sounds", "neu")
os.makedirs(ziel, exist_ok=True)

def slug(name):
    base = os.path.splitext(name)[0]
    base = re.sub(r"-\d{8,}$", "", base)              # ElevenLabs-ID am Ende
    base = unicodedata.normalize("NFKD", base).encode("ascii", "ignore").decode()
    base = re.sub(r"[^a-zA-Z0-9]+", "-", base).strip("-").lower()
    return "neu-" + base

def messen(pfad):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", pfad, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(float) / 32768
    hop = 160
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)]) + 1e-9
    db = 20 * np.log10(e)
    einsatz = int(np.argmax(db > db.max() - 30)) / 100
    hit = int(np.argmax(e)) / 100
    loud = subprocess.run(["ffmpeg", "-i", pfad, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud)
    return round(len(x) / 16000, 3), round(einsatz, 3), round(hit, 3), float(m[-1]) if m else None

liste = []
vergeben = set()
for f in sorted(os.listdir(quelle)):
    if not f.lower().endswith(".mp3"): continue
    neu = slug(f)
    while neu in vergeben: neu += "-b"   # gleiche Namen (z. B. «soft_pop,_UI_click_#2» und «soft_pop_UI_click_2»)
    vergeben.add(neu); neu += ".mp3"
    shutil.copyfile(os.path.join(quelle, f), os.path.join(ziel, neu))
    dauer, einsatz, hit, lufs = messen(os.path.join(ziel, neu))
    liste.append({"datei": "neu/" + neu, "original": f, "dauer": dauer, "einsatz": einsatz, "hit": hit, "lufs": lufs, "kategorie": "neu"})
json.dump(liste, open(os.path.join(ziel, "sounds-neu.json"), "w"), ensure_ascii=False, indent=1)
for s in liste: print(f'{s["datei"][4:]:<52} {s["dauer"]:5.2f}s hit {s["hit"]:5.2f}  {s["lufs"]}')
