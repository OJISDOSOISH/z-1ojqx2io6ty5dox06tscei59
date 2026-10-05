# Z-02 — reprise après rejet de la première passe

La première passe a été rejetée à juste titre : surfaces devenues génériques,
stencil frontal inversé et hors panneau. Les trois fichiers modifiés ont été
restaurés à la base 321a004 avant le nouveau chantier. `images/after/` est un
**essai rejeté**, pas une livraison validée.

## Inventaire préalable (48 éléments)

L'inventaire n'est pas une certification : les zones non corrigées restent à
traiter individuellement. Les vues groupées ne remplacent pas les gros plans de
chaque pièce exigés par le brief.

| Zone | Éléments à examiner |
|---|---|
| Tête | 01 coque ; 02 couronne de tourelle ; 03 piliers ; 04 casquette ; 05 menton ; 06 joint de baie ; 07 essuie-glace ; 08 rétro droit ; 09 rétro gauche ; 10 clignotants d'angle |
| Regard | 11 écran ; 12 vitre ; 13 reflet artificiel ; 14 cadre ; 15 arceaux ; 16 sourcils |
| Haut | 17 toit ; 18 rampe ; 19 projecteurs ; 20 câble de rampe ; 21 antenne fouet ; 22 isolateurs ; 23 parabole |
| Cabine | 24 flanc droit ; 25 flanc gauche ; 26 trappe ; 27 hublot ; 28 dos ; 29 poignée arrière |
| Torse | 30 panneau frontal ; 31 calandre ; 32 radiateur ; 33 phare ; 34 échappement ; 35 plateau ; 36 trappes latérales ; 37 jupe |
| Train | 38 aile AV droite ; 39 aile AV gauche ; 40 aile AR droite ; 41 aile AR gauche ; 42 marchepieds ; 43 suspension / essieux ; 44 pare-chocs |
| Accessoires | 45 bras / lanterne ; 46 caisse / sangles ; 47 jerrican / berceau ; 48 feux / plaque / attelage |

## Lot en cours : façade du torse

Constat code + rendu : la plaque avant pleine masque calandre, radiateur et
phare. Les textures simulent des panneaux alors que la façade est fermée.
Objectif : ouvrir réellement le panneau sans déplacer les roues ni masquer les yeux.

## Contrôle

`npm ci`, puis `npm run capture -- images/lot-01/avant` (ou `apres`).
Graine identique dans le navigateur de test seulement. `CHROME_PATH` permet un
Chromium local ; sinon la distribution headless npm est utilisée. Toutes les
images viennent du modèle Three.js, pas d'une génération d'images.

Pneus protégés : SHA-256 attendu
`525257bddcd0f39e46acad35cfe4fbfa25188bcf599c9cd3722fcdde5c006509`.

Pas de validation « film » à ce stade. Aucun rendu path-tracé réalisé pour ce lot.

## Résultat du lot 01 (pas du robot entier)

- **Façade** : remplacement de la plaque pleine par une tôle extrudée de 3 mm,
  avec deux ouvertures traversantes et chants chanfreinés. Le reste du torse
  et toute la peinture partagée sont restés à la version originale.
- **Calandre / radiateur** : conduit sur quatre côtés, fond, collecteurs,
  ailettes en retrait, six persiennes et montants vissés. Les ailettes ont été
  assombries après examen du premier rendu, où elles paraissaient chromées.
- **Phare** : réflecteur fermé, ampoule, deux cerclages et vitre séparée. Il ne
  disparaît plus derrière la tôle. Son verre reste visuellement trop peu strié.
- **Fixations / marquages** : vis sur rondelles, charnières basses, stencil,
  macaron et avertissement peints dans le repère exact du panneau. Aucune
  plaque transparente décalée ou inversée. Coulures sous trois vis, éclats
  sur les contours réels et impacts sur le bas ; cartes couleur, hauteur,
  rugosité et métal générées ensemble (1280 × 1024, source JS versionnée).
- **Raccord supérieur** : ajout d'un retour de tôle après constat d'un jour
  sur le rendu d'ensemble. Le joint noir reste trop visible au coin droit.

### Ce que montrent réellement les images

La façade a maintenant une fonction mécanique lisible, du relief et des plans
successifs. C'est un progrès local par rapport au panneau plein. La grande
surface peinte reste assez régulière ; les coulures sont encore simplifiées.
Ce n'est **pas** la patine cinéma de tout le robot. Le contraste entre cette
nouvelle façade et les textures répétées des ailes / de la tête reste à traiter.

Le visage de face a été regardé : les deux pupilles restent visibles. Ses
barres, le faux reflet diagonal, les gros montants noirs et les accessoires de
toit restent ceux d'origine ; ils ne sont pas validés par ce lot.

### Preuves et mesures

- `images/lot-01/avant/` et `apres/` : 9 vues × 2 éclairages chacun.
- `images/lot-01/planches/` : face et oblique, puis calandre, phare, marquages
  et fixations, avec les deux éclairages. Reproduction : `scripts/planches.sh`.
- Après : **2 187 932 triangles, 37 matériaux**, contre 2 154 296 / 33 à la base
  (soit +33 636 triangles, +1,56 %). Les pneus dominent toujours le coût.
- Pas de LOD ajouté. Pour le contrôle temps réel, les ailettes / vis pourraient
  être instanciées ; tout LOD des pneus devra rester externe au fichier protégé.
- Zéro erreur JavaScript dans les captures. Test par rayons sur la tôle :
  zone pleine présente, ouverture de calandre libre, ouverture du phare libre.
  Positions, normales et UV finies. `npm test` contrôle le SHA des pneus,
  des garde-fous de l'assembleur et les 36 PNG. Ce test ne prouve pas l'absence
  de toutes les interpénétrations du robot.
- SHA-256 des pneus après travaux : identique à la valeur ci-dessus.
- `buildZipp2(THREE, H)`, montage des roues et exclusion envMap de l'écran
  inchangés. Le nouvel élément est appelé depuis `04_corps.js`.

### Non fait — explicitement

L'audit individuel des 48 éléments n'est pas terminé : seules les sous-pièces
frontales ont eu une boucle de correction et comparaison rapprochée dans ce
lot. Les autres vues sont des contrôles de contexte, pas une validation.
Aucun path tracing : Blender n'est pas installé dans cet environnement et je
n'ai pas installé d'autre moteur pour ce lot structurel. Je n'affirme pas que
le path tracing serait impossible, ni que l'objectif « film » est atteint.
Aucune animation ajoutée. Aucun modèle ni texture tiers utilisé.

### Prochains chantiers, non réalisés

1. Tête : vitres / cadre sans barres parasites, rétros réellement raccordés.
2. Ailes et marchepieds : passage de roue, étais et chevrons à l'échelle.
3. Flancs : trappes / grilles actuellement en partie enfouies dans les panneaux.
4. Charge arrière : sangles plates, appuis et attaches cohérents.
5. Harmonisation PBR localisée puis vraie validation path-tracée.
