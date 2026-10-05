# Robot Z-02 — three.js, 100 % code

Robot de chantier jaune, généré entièrement par code (aucun modèle importé).
Destiné à un film : le niveau visé est le rendu qualité film, pas la démo temps réel.

- `zipp2.js` : assembleur, `buildZipp2(THREE, H)` (signature à garder).
- `scene/15_robot/` : une pièce par fichier (`piece_xxx(E)`), `00_matieres.js` = matériaux/textures.
- `scene/15_robot/08_pneus.js` : **INTERDIT DE MODIFIER** (sculpture de l'auteur, octet pour octet).
- `rendu.html` + `shoot.py` : banc de rendu (Playwright). `npm i`, puis `python3 shoot.py`.
- `images/etat_actuel.png` : rendu de l'état actuel (4 vues).
- `BRIEF.md` : **la mission. À lire en premier.**

`rendu.html` fournit des versions de test de `canvasTex`, `rr`, `clamp01`, `P` (ces outils viennent du projet de l'auteur).
