#!/usr/bin/env bash
# Planches tirées exclusivement des captures réelles, sans retouche du modèle.
# Dépendance système : ImageMagick 6/7 (montage, convert).
set -euo pipefail
cd "$(dirname "$0")/.."
base=images/lot-01
mkdir -p "$base/planches"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for view in torse_face torse_oblique; do
  montage -font DejaVu-Sans -pointsize 22 -background '#20242a' -fill white \
    -label 'AVANT / SOLEIL' "$base/avant/${view}_dur.png" \
    -label 'APRES / SOLEIL' "$base/apres/${view}_dur.png" \
    -label 'AVANT / COUVERT' "$base/avant/${view}_couvert.png" \
    -label 'APRES / COUVERT' "$base/apres/${view}_couvert.png" \
    -tile 2x2 -geometry 840x540+8+12 "$base/planches/${view}.jpg"
done
# Avant/après par sous-élément : mêmes pixels, cadrage et deux éclairages.
for entry in 'calandre:530x320+340+235' 'phare:220x235+865+285' 'marquages:420x220+325+555' 'fixations:150x190+990+145'; do
  name=${entry%%:*}; crop=${entry#*:}
  for phase in avant apres; do for light in dur couvert; do
    convert "$base/$phase/torse_face_$light.png" -crop "$crop" +repage "$tmp/${phase}_${light}.png"
  done; done
  montage -font DejaVu-Sans -pointsize 17 -background '#20242a' -fill white \
    -label 'AVANT / SOLEIL' "$tmp/avant_dur.png" -label 'APRES / SOLEIL' "$tmp/apres_dur.png" \
    -label 'AVANT / COUVERT' "$tmp/avant_couvert.png" -label 'APRES / COUVERT' "$tmp/apres_couvert.png" \
    -tile 2x2 -geometry +10+12 "$base/planches/$name.jpg"
done
