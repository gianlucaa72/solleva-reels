"""Reel 04: Figur in Kopf und Körper zerlegen (für Kopfwackeln ohne Higgsfield).
Aufruf: python3 tools/r04_figur_kopf.py assets/r04/higgsfield/figur-b-frei.png assets/r04/figur-kopf/
Ergebnis: figur-kopf.png (nur Kopf) und figur-koerper.png (ohne Kopf, Loch am Hals dunkel gefüllt), beide 835×1842 wie das Original.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

quelle, ziel = Path(sys.argv[1]), Path(sys.argv[2])
ziel.mkdir(parents=True, exist_ok=True)
im = Image.open(quelle).convert("RGBA")
a = np.array(im).astype(np.float32)
h, w = a.shape[:2]
luma = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
yy, xx = np.mgrid[0:h, 0:w]

# Kopf: alles oberhalb y 820; zwischen 820 und 975 nur helle Pixel (Haut/Bart) im Kinnbereich, nicht der schwarze Hoodie.
kopf = (yy < 820) | ((yy < 975) & (xx > 230) & (xx < 640) & (luma > 38))
kopf &= a[..., 3] > 0
m = Image.fromarray((kopf * 255).astype(np.uint8))
m = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))  # kleine Löcher im Bart schliessen
# nur die grösste zusammenhängende Fläche oben behalten (keine Hand-/Handy-Pixel)
mk = np.array(m) > 127
mk[1000:] = False
m = Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
km = np.array(m).astype(np.float32) / 255

kopf_img = a.copy()
kopf_img[..., 3] = a[..., 3] * km
Image.fromarray(kopf_img.astype(np.uint8)).save(ziel / "figur-kopf.png")

koerper = a.copy()
koerper[..., 3] = a[..., 3] * (1 - km)
# Halsöffnung des Hoodies dunkel füllen, damit beim Neigen kein Loch sichtbar wird
neck = ((xx - 450) / 175) ** 2 + ((yy - 905) / 70) ** 2 < 1
fill = neck & (km > 0.05)
koerper[fill, 0:3] = [22, 20, 24]
koerper[fill, 3] = 255
Image.fromarray(koerper.astype(np.uint8)).save(ziel / "figur-koerper.png")
print("ok", ziel)
