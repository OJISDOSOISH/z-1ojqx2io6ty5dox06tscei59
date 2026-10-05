# MISSION — amener le robot Z-02 au niveau « film »

Lis README.md, puis ce brief en entier avant de toucher au code.

## Objectif
Le robot doit tenir un plan rapproché de cinéma. Aucun élément ne doit paraître bizarre, mal posé,
mal fait, flottant, interpénétré, trop propre, trop plat ou moche. « Propre mais générique » n'est PAS acceptable.
Les pneus (`08_pneus.js`) sont la référence de qualité : tout le reste du robot doit monter à ce niveau.

## Règles dures (ne pas casser)
1. `08_pneus.js` : jamais modifié. Vérifie son hash avant et après (sha256 identique).
2. Signature `buildZipp2(THREE, H)` et contrat `piece_xxx(E)` inchangés,
   avec E = { THREE, canvasTex, rr, clamp01, P, RoundedBoxGeometry, rrShapeGeo, m, ROBOT }.
3. Roues montées par l'assembleur à z = ±0.27, rayon 0.25, centre y = 0.252.
4. Pas de modèle importé (GLTF/OBJ), pas de texture externe : tout est généré par code.
5. Identité : jaune chantier, stencil « Z-02 / CHANTIER NORD », macarons « 02 », P.orange.
6. Matériaux : un MeshBasicMaterial ne reçoit pas l'envMap (l'écran du visage). Les matériaux locaux
   très métalliques sans envMap rendent noirs : passe par le matériau partagé `m`.
7. Les pneus seuls dépassent déjà 250 000 triangles. Le reste du robot doit rester raisonnable (< 400 000 au total hors pneus : à justifier).

## Ce qui est connu comme encore mauvais (liste de départ, pas exhaustive)
- Patine : taches uniformes, pas d'usure qui suit la géométrie. À refaire : écaillage aux arêtes et angles
  (courbure/AO en vertex colors ou seconde passe de texture), coulures de rouille sous rivets et soudures,
  traînées de crasse sous les saillies, boue qui monte du bas, zones de frottement (poignées, marchepied).
- Matière peinture : trop lisse et trop uniforme. Ajouter normal/bump/roughness procéduraux (orange peel,
  micro-rayures, variations de brillance par panneau), pas seulement de la couleur.
- Corps : toujours « boîte sur boîte » dans les grandes masses. Revoir les volumes, les raccords entre tête, torse, ailes,
  châssis. Joints de panneaux en creux réels, soudures en relief, charnières, trappes cohérentes.
- Ailes : à vérifier de près (jeu avec le pneu, épaisseur de tôle, lèvre, fixations, raccord marchepied).
- Détails douteux à justifier ou supprimer : trappe sur le flanc de la tête, blocs/pods au toit, rétros,
  rampe de projecteurs, jerrican et sangles, câbles/durites (chemin logique, pas de flottement).
- Visage : tout élément doit servir le regard. Aucune barre devant les pupilles.
- Éclairage de mes rendus de test ≠ la scène finale : ne juge pas un reflet sur un seul éclairage.

## Méthode obligatoire
1. Pour chaque élément du robot (liste ≥ 40 : tête, casquette, baie, visage, rétros, rampe, antenne, flancs, trappe,
   dos, torse, ailes ×4, marchepieds, pare-chocs, feux, plaque, pot, vérin, bras, lanterne, jerrican, sangles, câbles…),
   fais un rendu en gros plan sous au moins 2 éclairages (soleil dur + ciel couvert).
2. Note chaque défaut (flottant, interpénétration, arête vive, aplat sans détail, échelle fausse, fonction illisible).
3. Corrige, re-rends, compare. Ne dis JAMAIS « c'est bon » sans avoir regardé les images.
4. Pour valider le « film » : fais au moins un rendu offline path-tracé (three-gpu-pathtracer ou équivalent) en plus du
   temps réel. Le temps réel masque les défauts de matière que le film révélera.
5. Si une technique de code atteint ses limites (ex. usure géométrique), propose-la franchement et implémente
   la meilleure alternative (vertex colors par courbure, texture d'atlas par pièce, etc.).

## Livrable
- Code complet corrigé dans ce dépôt (un commit par chantier, message clair).
- Planche avant/après par élément (images/).
- Rapport FRANC dans `RAPPORT.md` : ce qui est vraiment meilleur, ce qui reste moyen, ce qui n'a pas été fait.
  Pas de langue de bois. Si ça reste générique, le dire.
