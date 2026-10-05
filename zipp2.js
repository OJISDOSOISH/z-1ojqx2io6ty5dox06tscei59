// ZIPP 2 — le personnage, deuxieme generation. 100 % code, aucun modele importe.
//
// Pourquoi un second module plutot que modifier zipp.js : zipp.js est partage
// avec rendu_v3.html, et le banc de mesure verifie que la v3 reste IDENTIQUE AU
// PIXEL a rendus/final_01.png. Toucher zipp.js casserait cette reference. La v4
// a donc son propre personnage.
//
// DECOMPOSITION EN ELEMENTS (atomicite structurelle) : le robot est un dossier,
// app/scene/15_robot/, avec un fichier par element — 00_matieres, 01_tete,
// 02_visage, 03_antenne, 04_corps, 05_bras, 06_sacoche, 07_train, 08_pneus.
// Ce fichier est l'assembleur : il monte les elements dans l'ordre et garde la
// signature buildZipp2(THREE, H), donc rendu_v4.js et app/scene/15_robot.js ne
// changent pas. Les pneus (08) sont la sculpture de l'utilisateur, integree
// sans modification ; les anciennes roues cylindriques et leurs matieres
// (treadTex, rubberMat, sideMat) ont ete retirees avec elles.
//
// Piege connu de ce fichier : jamais de backtick dans les commentaires.

import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { piece_matieres } from './scene/15_robot/00_matieres.js';
import { piece_tete } from './scene/15_robot/01_tete.js';
import { piece_visage } from './scene/15_robot/02_visage.js';
import { piece_antenne } from './scene/15_robot/03_antenne.js';
import { piece_corps } from './scene/15_robot/04_corps.js';
import { piece_bras } from './scene/15_robot/05_bras.js';
import { piece_sacoche } from './scene/15_robot/06_sacoche.js';
import { piece_pneus } from './scene/15_robot/08_pneus.js';
import { piece_train } from './scene/15_robot/07_train.js';

// Plaque a coins arrondis, centree, dans le plan XY. Sert a tout ce qui se pose
// a plat sur une face : masque, socle, ecran, vitre. UV ramenees sur [0,1] pour
// qu'une texture (le visage) tombe juste quelle que soit la taille de la plaque.
// (exporte pour les sondes qui montent les elements un par un)
export function rrShapeGeo(T, w, h, r) {
  const s = new T.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new T.ShapeGeometry(s, 10);
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

// Tole d'aile : feuille d'epaisseur th, balayee en arc autour de l'essieu X.
// Origine au centre de roue. x va de x0 (flanc chassis) a x1 (levre exterieure).
// a=0 au sommet (+Y), +a vers +Z. La levre roule a x1.
export function fenderGeo(T, o) {
  const r0 = o.r0, r1 = o.r1, th = o.th, a0 = o.a0, a1 = o.a1;
  const x0 = o.x0, x1 = o.x1, nA = o.nA || 26, nX = o.nX || 7, lip = o.lip || 0.012;
  const pos = [], nrm = [], uv = [], idx = [];
  const sSign = x1 >= x0 ? 1 : -1;
  const prof = [];
  for (let j = 0; j <= nX; j++) {
    const t = j / nX;
    const x = x0 + (x1 - x0) * t;
    const crown = Math.sin(t * Math.PI) * 0.007;
    prof.push({ x: x, r: r0 + (r1 - r0) * t * 0.15 + crown, lip: 0 });
  }
  const nLip = 6;
  for (let k = 1; k <= nLip; k++) {
    const t = k / nLip;
    const ang = t * Math.PI * 0.95;
    prof.push({
      x: x1 + sSign * Math.sin(ang) * lip,
      r: r0 + 0.004 - (1 - Math.cos(ang)) * lip * 0.9,
      lip: t,
    });
  }
  const nP = prof.length;
  const pushV = (x, y, z, u, v) => { pos.push(x, y, z); nrm.push(0, 0, 0); uv.push(u, v); };
  for (let layer = 0; layer < 2; layer++) {
    const side = layer === 0 ? 1 : -1;
    for (let j = 0; j < nP; j++) {
      const pr = prof[j];
      const r = pr.r + side * (th * 0.5);
      for (let i = 0; i <= nA; i++) {
        const u = i / nA;
        const a = a0 + (a1 - a0) * u;
        pushV(pr.x, r * Math.cos(a), r * Math.sin(a), u, j / (nP - 1));
      }
    }
  }
  const ring = nA + 1;
  const quad = (a, b, c, d) => { idx.push(a, b, c, a, c, d); };
  for (let layer = 0; layer < 2; layer++) {
    const base = layer * nP * ring;
    const flip = layer === 0 ? sSign > 0 : sSign < 0;
    for (let j = 0; j < nP - 1; j++) {
      for (let i = 0; i < nA; i++) {
        const a = base + j * ring + i, b = a + 1, c = a + ring, d = c + 1;
        if (flip) quad(a, c, d, b); else quad(a, b, d, c);
      }
    }
  }
  const cap = (j, layerA, layerB, rev) => {
    for (let i = 0; i < nA; i++) {
      const a = layerA * nP * ring + j * ring + i;
      const b = a + 1;
      const c = layerB * nP * ring + j * ring + i;
      const d = c + 1;
      if (rev) quad(a, b, d, c); else quad(a, c, d, b);
    }
  };
  cap(0, 0, 1, sSign < 0);
  cap(nP - 1, 0, 1, sSign > 0);
  const endA = (ia, rev) => {
    for (let j = 0; j < nP - 1; j++) {
      const a0i = j * ring + ia, b0i = (j + 1) * ring + ia;
      const a1i = nP * ring + j * ring + ia, b1i = nP * ring + (j + 1) * ring + ia;
      if (rev) quad(a0i, b0i, b1i, a1i); else quad(a0i, a1i, b1i, b0i);
    }
  };
  endA(0, sSign < 0);
  endA(nA, sSign > 0);
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function buildZipp2(THREE, H) {
  // Environnement transmis a chaque element : outils de la scene, geometries du
  // coeur de three, l'addon RoundedBoxGeometry et le helper de plaque.
  const E = { THREE, ...H, RoundedBoxGeometry, rrShapeGeo, fenderGeo };

  const m = E.m = piece_matieres(E);          // MATIERES (textures + materiaux)
  // Une plaque de coque est une box : ses six faces porteraient toutes la
  // texture complete (macaron compris, retourne six fois). Ce helper habille
  // la face visible avec la vraie peau et les cinq autres avec la tole sobre.
  E.hullFaces = (outer) => {
    const faces = [m.hullPlainMat, m.hullPlainMat, m.hullPlainMat, m.hullPlainMat, m.hullPlainMat, m.hullPlainMat];
    faces[outer] = m.hullMat;
    return faces;
  };
  // Remappage UV planaire par orientation de normale : chaque face d'une plaque
  // est projettee DROITE (les UV natifs des boxes retournent ou pivotent la
  // texture selon la face — le macaron finissait la tete en bas). Appeler
  // APRES le deplacement des sommets et computeVertexNormals.
  E.planarUVs = (geo) => {
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const uv = geo.attributes.uv, pos = geo.attributes.position, nor = geo.attributes.normal;
    const sx = bb.max.x - bb.min.x, sy = bb.max.y - bb.min.y, sz = bb.max.z - bb.min.z;
    for (let i = 0; i < uv.count; i++) {
      const nx = nor.getX(i), ny = nor.getY(i), nz = nor.getZ(i);
      const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
      let u, v;
      if (ax >= ay && ax >= az) {
        // vu depuis +x, la droite de l'ecran est -z ; depuis -x, c'est +z
        u = nx > 0 ? (bb.max.z - pos.getZ(i)) / sz : (pos.getZ(i) - bb.min.z) / sz;
        v = (pos.getY(i) - bb.min.y) / sy;
      } else if (az >= ay) {
        // vu depuis +z, la droite est +x ; depuis -z, c'est -x
        u = nz > 0 ? (pos.getX(i) - bb.min.x) / sx : (bb.max.x - pos.getX(i)) / sx;
        v = (pos.getY(i) - bb.min.y) / sy;
      } else {
        u = (pos.getX(i) - bb.min.x) / sx;
        v = ny > 0 ? (bb.max.z - pos.getZ(i)) / sz : (pos.getZ(i) - bb.min.z) / sz;
      }
      uv.setXY(i, u, v);
    }
    uv.needsUpdate = true;
  };

  // Usure liee a la geometrie : ecaillage d'arete, boue bas, crasse sous-face.
  // Multiplie la texture (vertexColors). Appeler apres les deformations.
  E.paintWear = (geo, opt) => {
    opt = opt || {};
    geo.computeBoundingBox();
    geo.computeVertexNormals();
    const pos = geo.attributes.position, nor = geo.attributes.normal;
    const col = new Float32Array(pos.count * 3);
    const bb = geo.boundingBox;
    const sx = bb.max.x - bb.min.x || 1;
    const sy = bb.max.y - bb.min.y || 1;
    const sz = bb.max.z - bb.min.z || 1;
    const edgeN = opt.edge || 0.018;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const ny = nor.getY(i);
      const ex = Math.min(x - bb.min.x, bb.max.x - x);
      const ey = Math.min(y - bb.min.y, bb.max.y - y);
      const ez = Math.min(z - bb.min.z, bb.max.z - z);
      const e1 = ex < ey ? (ex < ez ? ex : ez) : (ey < ez ? ey : ez);
      const e2 = ex + ey + ez - e1 - Math.max(ex, ey, ez);
      const edge = Math.exp(-Math.min(e1, e2) / edgeN);
      const h = (y - bb.min.y) / sy;
      const mud = Math.max(0, 1 - h / 0.38);
      const mud2 = mud * mud;
      const under = Math.max(0, -ny);
      const nse = Math.sin(x * 37.1 + y * 19.7 + z * 28.3) * Math.sin(x * 11.9 + z * 8.3);
      const rust = Math.max(0, nse) * mud2 * 0.45;
      let r = 1 - mud2 * 0.32 - under * 0.16 - rust * 0.12;
      let g = 1 - mud2 * 0.42 - under * 0.20 - rust * 0.38;
      let b = 1 - mud2 * 0.52 - under * 0.26 - rust * 0.48;
      const spl = Math.max(0, Math.sin(x * 71.3 + z * 53.1) * Math.sin(y * 13.7 + z * 9.1));
      const splash = spl * spl * mud * 0.35;
      r -= splash * 0.25; g -= splash * 0.32; b -= splash * 0.38;
      const ew = edge * (0.50 + 0.2 * (opt.edgeAmt || 1));
      r = r * (1 - ew) + 0.82 * ew;
      g = g * (1 - ew) + 0.74 * ew;
      b = b * (1 - ew) + 0.56 * ew;
      col[i * 3]     = Math.min(1, Math.max(0.22, r));
      col[i * 3 + 1] = Math.min(1, Math.max(0.18, g));
      col[i * 3 + 2] = Math.min(1, Math.max(0.12, b));
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  };

  // Panneau legerement bombe : ne touche que la face dont la coordonnee axis
  // est au bord sign, amenuise a zero vers les aretes.
  E.bulgeFace = (geo, axis, sign, amt) => {
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const pos = geo.attributes.position;
    const c = [(bb.min.x + bb.max.x) * 0.5, (bb.min.y + bb.max.y) * 0.5, (bb.min.z + bb.max.z) * 0.5];
    const size = [bb.max.x - bb.min.x || 1, bb.max.y - bb.min.y || 1, bb.max.z - bb.min.z || 1];
    const lim = sign > 0 ? bb.max.getComponent(axis) : bb.min.getComponent(axis);
    const a1 = (axis + 1) % 3, a2 = (axis + 2) % 3;
    for (let i = 0; i < pos.count; i++) {
      const p = [pos.getX(i), pos.getY(i), pos.getZ(i)];
      if (Math.abs(p[axis] - lim) > 0.0035) continue;
      const u = (p[a1] - c[a1]) / (size[a1] * 0.5);
      const v = (p[a2] - c[a2]) / (size[a2] * 0.5);
      const uu = Math.min(1, Math.abs(u)), vv = Math.min(1, Math.abs(v));
      const w = Math.cos(uu * 1.57) * Math.cos(vv * 1.57);
      const grain = Math.sin(p[a1] * 41.3 + p[a2] * 27.1) * Math.sin(p[a2] * 18.9) * 0.18;
      p[axis] += sign * amt * (w + grain * w);
      pos.setXYZ(i, p[0], p[1], p[2]);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  };

  // Geos partagees : vis, coulure, collier. Evite de recreer a chaque rivet.
  E.G = {
    hex: new THREE.CylinderGeometry(1, 1.12, 0.9, 6),
    pad: new THREE.CylinderGeometry(1.35, 1.35, 0.18, 10),
    drip: new THREE.ConeGeometry(1, 4, 6),
    bolt: new THREE.CylinderGeometry(1, 1, 1, 6),
  };

  E.bolt = (parent, x, y, z, axis, r) => {
    r = r || 0.011;
    const g = new THREE.Group();
    const hex = new THREE.Mesh(E.G.hex, m.steelMat);
    hex.scale.set(r, r, r);
    if (axis === 'x') hex.rotation.z = Math.PI / 2;
    else if (axis === 'z') hex.rotation.x = Math.PI / 2;
    g.add(hex);
    const pad = new THREE.Mesh(E.G.pad, m.frameMat);
    pad.scale.set(r, r, r);
    pad.rotation.copy(hex.rotation);
    pad.position.copy(hex.position);
    g.add(pad);
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };

  E.rustDrip = (parent, x, y, z, len, r) => {
    const d = new THREE.Mesh(E.G.drip, m.rustMat);
    d.rotation.x = Math.PI;
    d.position.set(x, y - (len || 0.04) * 0.28, z);
    d.scale.set((r || 0.005) * 1.8, (len || 0.04) * 0.14, (r || 0.005) * 0.28);
    parent.add(d);
    return d;
  };

  E.cable = (parent, pts, radius, mat) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(8, pts.length * 3), radius, 5, false), mat || m.hoseMat);
    parent.add(mesh);
    return mesh;
  };

  E.finishHull = (geo, faces) => {
    geo.computeVertexNormals();
    E.planarUVs(geo);
    E.paintWear(geo);
    return geo;
  };

  const ROBOT = new THREE.Group();
  ROBOT.name = 'zipp';
  E.ROBOT = ROBOT;
  const shellS = 1.24;

  const tete = E.tete = piece_tete(E);        // TETE (crane + masque)
  const visage = piece_visage(E);             // VISAGE (ecran, vitre, lentilles)
  piece_antenne(E);                           // ANTENNE (mat, led, fanion)
  const corps = E.corps = piece_corps(E);     // CORPS (torse, grille, badge...)
  const bras = piece_bras(E);                 // BRAS (articulation + lanterne)
  piece_sacoche(E);                           // SACOCHE (sac + cable)
  const pneus = piece_pneus(E);               // PNEUS (sculpture utilisateur)
  // Voie : les pneus sont montes par le code utilisateur a z = +/-0.205, comme
  // l'ancien train. Mais deux pneus de rayon 0.25 centres a +/-0.205
  // s'interpenetre de 9 cm (0.41 d'ecart pour 0.50 de diametre). L'ecart
  // est corrige ICI, cote montage, sans toucher au fichier 08_pneus.js.
  for (const w of pneus.wheels) w.position.z = (w.position.z < 0 ? -1 : 1) * 0.27;
  piece_train(E);                             // TRAIN (essieux + garde-boue)

  // ---------------------------------------------------------------- FINITION
  // Lumiere d'atelier : la demo de l'utilisateur reglait les envMapIntensity de
  // ses pneus AVEC un environnement PMREM (RoomEnvironment). Sans lui, chromes,
  // flancs et jantes rendent plus sombres que l'auteur ne les a ecrits. On
  // fabrique donc l'environnement et on l'epingle sur les matieres du robot ET
  // sur celles des pneus — lecture seule : aucun fichier utilisateur n'est touche.
  if (H.renderer) {
    const pmrem = new THREE.PMREMGenerator(H.renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const vus = new Set();
    const pin = (mat) => {
      if (!mat || vus.has(mat) || mat.isMeshBasicMaterial) return; // ecran/reflets : l'envMap les noircit
      vus.add(mat);
      mat.envMap = env;
      mat.needsUpdate = true;
    };
    for (const mat of Object.values(m)) pin(mat);
    ROBOT.traverse(o => {
      if (!o.isMesh) return;
      for (const mat of Array.isArray(o.material) ? o.material : [o.material]) pin(mat);
    });
    pmrem.dispose();
  }
  ROBOT.scale.setScalar(shellS);
  ROBOT.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    // la vitre ne doit pas recevoir d'ombre : sinon elle s'eteint
    if (o === visage.glass) { o.castShadow = false; o.receiveShadow = false; }
    if (o === visage.visor) o.receiveShadow = false;
  });
  return { robot: ROBOT, shellMat: m.hullMat, trimMat: m.accentMat, darkMat: m.darkMat,
    visor: visage.visor, glass: visage.glass, head: tete.head, body: corps.body,
    wheels: pneus.wheels, arm: bras.arm, faceLight: visage.faceLight };
}
