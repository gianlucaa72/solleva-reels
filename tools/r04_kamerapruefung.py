"""Prüft die Kamerakurve von Reel 04: Richtungswechsel (nie zwei innerhalb von 10 Frames) und Knicke (Ruck).
Aufruf: python3 tools/r04_kamerapruefung.py out/r04/kamerakurve.csv [weitere.csv] --png out/r04/kamerakurve.png"""
import csv, sys, math
import numpy as np

def lade(p):
    r = list(csv.DictReader(open(p)))
    return {k: np.array([float(x[k]) for x in r]) for k in r[0]}

def pruefe(d, name):
    sz = d["szene"].astype(int); lz = np.log(d["zoom"])
    print(f"== {name}")
    ok = True
    for s in range(1, 10):
        idx = np.where(sz == s)[0]
        if len(idx) < 5: continue
        for wert, skala, schwelle in (("zoom", None, 2e-4), ("x", 1, 0.05), ("y", 1, 0.05)):
            v_all = np.diff(lz[idx]) if wert == "zoom" else np.diff(d[wert][idx])
            sig = [(i, np.sign(v)) for i, v in enumerate(v_all) if abs(v) > schwelle]
            wechsel = [sig[j][0] for j in range(1, len(sig)) if sig[j][1] != sig[j - 1][1]]
            eng = [(a, b) for a, b in zip(wechsel, wechsel[1:]) if b - a < 10]
            if eng:
                ok = False
                print(f"  Szene {s} {wert}: Richtungswechsel zu eng bei Frames {[(int(idx[a]), int(idx[b])) for a, b in eng]}")
        v = np.diff(lz[idx]); a = np.diff(v)
        print(f"  Szene {s}: Richtungswechsel Zoom {sum(1 for j in range(1, len(v)) if abs(v[j])>2e-4 and abs(v[j-1])>2e-4 and np.sign(v[j])!=np.sign(v[j-1]))}, "
              f"max Tempo {np.max(np.abs(v))*100:.2f} %/F, max Beschleunigungssprung {np.max(np.abs(np.diff(a)))*100 if len(a)>1 else 0:.3f} %/F³")
    print("  ERGEBNIS:", "ok, keine Richtungswechsel innerhalb von 10 Frames" if ok else "NICHT ok")

args = [a for a in sys.argv[1:] if not a.startswith("--")]
png = sys.argv[sys.argv.index("--png") + 1] if "--png" in sys.argv else None
daten = [(p, lade(p)) for p in args if not p.endswith(".png")]
for p, d in daten: pruefe(d, p)
if png:
    import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 1, figsize=(16, 9), sharex=True)
    for p, d in daten:
        lab = p.split("/")[-1].replace(".csv", "")
        t = d["frame"] / 30
        ax[0].plot(t, d["zoom"] * 100, label=lab, lw=1.4)
        ax[1].plot(t[1:], np.diff(np.log(d["zoom"])) * 100, label=lab, lw=1.1)
        ax[2].plot(t, d["y"], label=lab + " y", lw=1.1)
    for c in [97, 204, 275, 317, 416, 514, 585, 712]:
        for a_ in ax: a_.axvline(c / 30, color="#999", lw=0.6, ls=":")
    ax[0].set_ylabel("Zoom %"); ax[1].set_ylabel("Tempo %/Frame"); ax[2].set_ylabel("y px"); ax[2].set_xlabel("Sekunden (gepunktet = Schnitte)")
    ax[1].set_ylim(-4, 6); ax[0].legend(loc="upper left")
    fig.suptitle("Reel 04: Kamera Frame für Frame")
    fig.tight_layout(); fig.savefig(png, dpi=110)
    print("Plot:", png)
