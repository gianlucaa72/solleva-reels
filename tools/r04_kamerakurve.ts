// Gibt die Kamera-Werte von Reel 04 Frame für Frame als CSV aus (zoom, x, y, dreh, blur).
// Aufruf: npm run r04:kurve  (schreibt out/r04/kamerakurve.csv und optional ohne Feder zum Vergleich)
import { gleitKamera } from "../src/lib/gleitKamera";
import { kamera1, kamera2, kamera3, kamera4, kamera5, kamera6, kamera7, kamera8, kamera9 } from "../src/reels/r04/kamera";
import { REEL04_DAUER, SCHNITT, V } from "../src/reels/r04/timeline";

const ohneFeder = process.argv.includes("--ohne-feder");
const szene = (f: number) =>
  f < SCHNITT ? [1, kamera1()] : f < V.s3 ? [2, kamera2(V.s3)] : f < V.s4 ? [3, kamera3()] : f < V.s5 ? [4, kamera4()] :
  f < V.s6 ? [5, kamera5()] : f < V.s7 ? [6, kamera6()] : f < V.s8 ? [7, kamera7()] : f < V.s9 ? [8, kamera8()] : [9, kamera9()];
const zeilen = ["frame,szene,zoom,x,y,dreh,blur"];
for (let f = 0; f < REEL04_DAUER; f++) {
  const [nr, cfg] = szene(f) as [number, any];
  const k = gleitKamera(f, ohneFeder ? { ...cfg, feder: undefined } : cfg);
  zeilen.push([f, nr, k.zoom.toFixed(5), k.x.toFixed(2), k.y.toFixed(2), k.dreh.toFixed(3), k.blur.toFixed(2)].join(","));
}
console.log(zeilen.join("\n"));
