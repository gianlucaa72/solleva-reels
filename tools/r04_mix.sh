#!/bin/bash
# Endmischung: Lautheit auf ca. −14 LUFS, Peak ≤ −1 dBFS (Limiter), Bild yuv420p TV-Range. Aufruf: tools/r04_mix.sh roh.mp4 ziel.mp4
set -e
roh="$1"; ziel="$2"; I=-13.2
for versuch in 1 2 3; do
  ffmpeg -v error -y -i "$roh" -af "loudnorm=I=$I:TP=-1.5:LRA=11,alimiter=limit=0.891:attack=3:release=60:level=disabled" \
    -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -crf 18 -preset slow -c:a aac -ar 48000 -b:a 192k -movflags +faststart "$ziel"
  m=$(ffmpeg -v info -i "$ziel" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  echo "Versuch $versuch: I=$m LUFS (Ziel −14)"
  python3 -c "import sys; sys.exit(0 if abs($m+14)<=0.5 else 1)" && break
  I=$(python3 -c "print(round($I + (-14 - $m), 1))")
done
ffmpeg -v info -i "$ziel" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
