# MISSION : le meilleur rendu possible du robot Z-02, niveau film

Lis README.md puis ce brief en entier avant de toucher à quoi que ce soit.

## Objectif
Le robot doit tenir un plan rapproché de cinéma. Aucun endroit ne doit paraître bizarre, mal posé, mal fait, flottant,
interpénétré, trop propre, trop plat, étrange ou laid. « Propre mais générique » n'est PAS acceptable.
Les pneus (`08_pneus.js`) sont la référence : tout le reste du robot doit monter à ce niveau, et au-dessus si possible.
Aucune retenue sur les moyens : vise le meilleur résultat, pas le plus facile.

## Liberté totale sur les moyens
L'auteur autorise TOUT ce qui améliore le rendu. Le « 100 % code » n'est plus une contrainte. Tu peux :
- écrire du code three.js, des shaders, de la géométrie procédurale ;
- créer des modèles 3D avec les outils que tu as (Blender en script, autre logiciel, génération de maillage), les exporter en glTF/GLB et les charger ;
- peindre ou générer des textures PBR haute résolution (albedo, normal, roughness, metalness, AO, height), les baker, les mettre en atlas ;
- sculpter, faire du retopo, des décals, de la patine bakée depuis la courbure ;
- utiliser un HDRI, du path tracing offline (three-gpu-pathtracer, Blender Cycles, etc.), de la profondeur de champ, du post-traitement ;
- ajouter des animations (voir plus bas).
Conditions pour les ressources non écrites en code : libres de droits (rien de copyrighté, pas de modèle ou texture piochés sans licence), formats ouverts
(glTF/GLB, PNG, EXR, KTX2), fichiers sources et scripts de génération versionnés dans le dépôt pour que ce soit reproductible, poids total raisonnable (< 200 Mo).
Si tu abandonnes la structure `piece_xxx(E)`, livre un point d'entrée qui retourne le robot comme le fait `buildZipp2` et documente-le.

## Règles dures
1. `scene/15_robot/08_pneus.js` : jamais modifié. Vérifie son sha256 avant et après.
2. Les roues sont montées par l'assembleur à z = ±0.27, rayon 0.25, centre y = 0.252. Tant que tu gardes ces pneus, ne change pas ça.
3. Identité : jaune chantier, stencil « Z-02 / CHANTIER NORD », macarons « 02 », orange P.orange. L'esprit « robot de chantier robuste et expressif » reste.
4. Ne supprime pas le visage et son regard : c'est ce qui donne la personnalité du robot.

## Pièges connus (déjà rencontrés, ne les refais pas)
- **Visage.** Dans `01_tete.js` la coque pleine est volontairement reculée de 11 cm (profondeur `HL*2+0.02-0.11`, `position.z = -0.055`) pour que la baie, la vitre et l'écran du visage ne soient pas enfermés dedans. Une version précédente (d'une autre IA) avait une coque pleine qui cachait tout le visage : vérifie toujours, par un rendu de face, que les yeux sont visibles.
- **Écran.** Dans `zipp2.js`, l'envMap n'est pas appliqué aux `MeshBasicMaterial` (sinon l'écran des yeux devient noir). Ne retire pas cette exclusion sans vérifier.
- **Métal sans envMap = noir.** Un matériau local très métallique qui ne passe pas par le matériau partagé `m` rend noir ; garde `metalness` bas ou utilise `m`.
- **Hachures et moiré.** Les motifs périodiques (sin(x)+sin(y)) sur de grandes surfaces donnent des hachures visibles : évite-les.
- **Chevrons de sécurité.** Une texture étirée sur une pièce longue et fine donne des lignes presque horizontales : fixe l'échelle avec `repeat`.
- Le LISEZMOI d'une ancienne version annonçait des choses fausses ; rien d'écrit dans l'historique git n'est une source fiable. Seuls les rendus comptent.

## Mesures réelles (état actuel, mesurées par `rendu.html`)
2 154 296 triangles au total, 33 matériaux. Les 4 pneus font environ 523 000 triangles chacun (≈ 2 092 000 en tout) ; le reste du robot ≈ 62 000.
Il y a donc énormément de marge pour détailler carrosserie et ailes. Pas de plafond pour le rendu offline ; pour le contrôle temps réel, signale le total et propose des LOD ou de l'instancing s'il devient lourd.

## Défauts connus, liste de départ (non exhaustive)
- Patine : taches uniformes, pas d'usure qui suit la géométrie. À faire : écaillage aux arêtes et angles (courbure/AO), coulures de rouille sous rivets et soudures,
  traînées de crasse sous les saillies, boue qui monte du bas, frottements (poignées, marchepieds).
- Peinture : trop lisse et uniforme. Normal/bump/roughness variés (peau d'orange, micro-rayures, brillance par panneau), pas seulement de la couleur.
- Volumes : encore « boîte sur boîte » dans les grandes masses. Raccords tête / torse / ailes / châssis, joints de panneaux en creux, soudures, charnières, trappes cohérentes.
- Ailes : jeu avec le pneu, épaisseur de tôle, lèvre, fixations, raccord marchepied.
- Éléments à justifier ou supprimer : trappe sur le flanc de la tête, blocs aux coins du toit, rétros, rampe de projecteurs, jerrican et sangles, câbles (chemin logique, rien ne flotte).
- Visage : tout élément doit servir le regard. Rien devant les pupilles.

## Environnement de rendu
La scène finale de l'auteur est différente du banc de test : soleil + effet bokeh (profondeur de champ). L'éclairage de `rendu.html` n'est qu'un banc de test (modes `dur` et `couvert`).
Ne juge jamais un reflet ou une matière sur un seul éclairage.

## Méthode obligatoire
1. Liste tous les éléments du robot (≥ 40 : tête, casquette, baie, visage, rétros, rampe, antenne, flancs, trappe, dos, torse, ailes x4, marchepieds, pare-chocs, feux, plaque, pot, vérin, bras, lanterne, jerrican, sangles, câbles, etc.).
2. Pour chacun : gros plan sous au moins 2 éclairages (`SHOOTAT` dans `rendu.html`), défauts notés (flottant, interpénétration, arête vive, aplat sans détail, échelle fausse, fonction illisible), correction, nouveau rendu, comparaison.
3. Ne dis JAMAIS « c'est bon » sans avoir regardé les images. Si tu ne peux pas rendre, dis-le franchement au lieu de deviner.
4. Valide le « film » avec au moins un rendu path-tracé offline si ton environnement le permet (sinon dis pourquoi tu ne l'as pas fait).
5. Si une technique atteint ses limites, dis-le et passe à la meilleure alternative (modèle externe, texture bakée, etc.).

## Animation (bonus, seulement APRÈS la qualité statique)
Possibles : clignement et regard des yeux, balancement d'antenne, suspension, clignotants, bras. La pose de repos doit rester la pose de référence du rendu statique.

## Livraison
- Code, assets et scripts dans ce dépôt : un commit par chantier, message clair. Si tu n'as pas le droit d'écriture, livre un zip ou un patch à l'auteur (rien n'est perdu si tu ne peux pas pousser).
- Planche avant/après par élément dans `images/`.
- `RAPPORT.md`, franc : ce qui est vraiment meilleur, ce qui reste moyen, ce que tu n'as pas pu faire. Pas de langue de bois. Si ça reste générique, dis-le.
