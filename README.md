# Robot Z-02

Robot de chantier jaune pour un film. Base actuelle : three.js, générée par code. Le but est le meilleur rendu possible (voir `BRIEF.md`).

- `BRIEF.md` : **la mission. À lire en premier, en entier.**
- `zipp2.js` : assembleur, `buildZipp2(THREE, H)`.
- `scene/15_robot/` : une pièce par fichier (`piece_xxx(E)`), `00_matieres.js` = matériaux et textures.
- `scene/15_robot/08_pneus.js` : **ne jamais modifier** (travail de l'auteur, octet pour octet).
- `rendu.html` + `shoot.py` : banc de rendu (testé depuis un clone vierge).
- `images/etat_actuel.png` : rendu de l'état actuel.

## Lancer le banc de rendu
```
npm i
pip install playwright && playwright install chromium
python3 shoot.py images/rendus
```
Produit 6 vues x 2 éclairages (dur, couvert) et `stats.txt` (triangles, matériaux). Rendu logiciel : lent mais fiable.
Variable `CHROME_PATH` pour forcer un navigateur. Gros plan sur n'importe quel point : `window.SHOOTAT(x,y,z,azimut,elevation,distance_m)` dans `rendu.html`.

`rendu.html` contient des versions de test de `canvasTex`, `rr`, `clamp01`, `P` : ces outils viennent du projet de l'auteur et ne sont pas dans le dépôt.
