#!/usr/bin/env bash
# Reel 05: Endmischung und Abgabe-Fassungen (Skill reel-produktion, Schritt 9).
# Erwartet: out/r05/reel-bild.mp4 (ohne Ton) und out/r05/ton-{mit-musik,ohne-musik,effekte}.wav
# Ergebnis in out/abgabe/: r05-50-millisekunden-vN.mp4, -klein.mp4, -ohne-musik.mp4, -effekte.wav, -uebersicht.png
set -euo pipefail
cd "$(dirname "$0")/.."
V=${1:-v1}
N=out/abgabe/r05-50-millisekunden-$V
mkdir -p out/abgabe

# Lautheit: lineare Verstärkung auf −14 LUFS (keine Kompression), danach True Peak prüfen
gain() {
  local i
  i=$(ffmpeg -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
  python3 -c "print(round(-14.0 - ($i), 2))"
}
G=$(gain out/r05/ton-mit-musik.wav)
G2=$(gain out/r05/ton-ohne-musik.wav)
echo "Verstärkung mit Musik: ${G} dB, ohne Musik: ${G2} dB"

# Limiter nur als Sicherheitsnetz für True Peak ≤ −1 dBTP (greift bei normalem Pegel nicht)
lim="alimiter=limit=0.75:attack=5:release=50:level=false"
ffmpeg -v error -y -i out/r05/ton-mit-musik.wav -af "volume=${G}dB,$lim" -ar 48000 out/r05/mix-mit-musik.wav
ffmpeg -v error -y -i out/r05/ton-ohne-musik.wav -af "volume=${G2}dB,$lim" -ar 48000 out/r05/mix-ohne-musik.wav
# Effekt-Spur: gleiche Verstärkung wie der Mix mit Musik, volle Länge ab 0:00
ffmpeg -v error -y -i out/r05/ton-effekte.wav -af "volume=${G}dB" -ar 48000 "$N-effekte.wav"

# Bild: yuv420p TV-Range, H.264 CRF 18
vf="scale=in_range=full:out_range=tv,format=yuv420p"
ffmpeg -v error -y -i out/r05/reel-bild.mp4 -i out/r05/mix-mit-musik.wav -map 0:v -map 1:a -vf "$vf" -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$N.mp4"
ffmpeg -v error -y -i "$N.mp4" -i out/r05/mix-ohne-musik.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$N-ohne-musik.mp4"
ffmpeg -v error -y -i "$N.mp4" -vf "scale=720:-2" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart "$N-klein.mp4"

# Übersicht: ein Frame pro Sekunde mit Safe-Zone-Rahmen
ffmpeg -v error -y -i "$N.mp4" -vf "fps=1,scale=270:480,drawbox=x=15:y=62:w=220:h=325:color=yellow@0.8:t=2,tile=8x4:padding=6:color=black" -frames:v 1 "$N-uebersicht.png"

# Messwerte
for f in "$N.mp4" "$N-ohne-musik.mp4"; do
  echo "== $f"; ffmpeg -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
  ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt,color_range,width,height,r_frame_rate -of compact=p=0 "$f"
done
