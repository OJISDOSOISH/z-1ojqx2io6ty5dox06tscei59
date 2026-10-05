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

## Lot 01 — façade du torse (reprise après première passe rejetée)

Le périmètre et les limites sont décrits dans `RAPPORT.md` ; ce n'est pas une
validation cinéma du robot entier. Comparaison principale :
`images/lot-01/planches/torse_face.jpg`.

Banc Node autonome (pas d'installation Python nécessaire) :
```sh
npm ci
npm run capture -- images/controle
npm test
# Pour reconstruire les planches du lot (ImageMagick requis) :
scripts/planches.sh
```
`CHROME_PATH` permet d'utiliser un Chromium installé ; le secours npm fourni
est destiné au Linux x64 de ce banc. Les dépendances et navigateurs ne sont
pas versionnés. La graine aléatoire est imposée uniquement par le test.
