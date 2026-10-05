// TETE — element 01 du dossier 15_robot/. REFONTE 2 : cabine sculptee.
// Plus un cube a toit plat : coque chanfreinee et legerement bombee, arêtes
// roulees, casquette au-dessus de la baie, menton, couronne de tourelle,
// trappe, retros construits, gouttieres. La baie (OPEN, fz, TILT) reste le
// contrat de 02_visage.
export function piece_tete(E) {
  const { THREE, m } = E;
  const { BoxGeometry, CylinderGeometry, SphereGeometry, TorusGeometry, PlaneGeometry } = THREE;
  const { RoundedBoxGeometry } = E;

  const head = new THREE.Group();
  head.position.y = 0.66;
  E.ROBOT.add(head);

  const HW = 0.25;
  const HL = 0.30;
  const HH = 0.40;
  const fz = HL - 0.02;
  const TILT = -0.14;
  const OPEN = { w: 0.34, y0: 0.10, y1: 0.34 };
  const bayY = (OPEN.y0 + OPEN.y1) / 2 - 0.015;

  // Couronne de tourelle : la tete n'est pas posee, elle tourne sur un palier.
  const neck = new THREE.Group();
  neck.position.y = -0.018;
  head.add(neck);
  const ring = new THREE.Mesh(new CylinderGeometry(0.195, 0.205, 0.028, 28), m.frameMat);
  neck.add(ring);
  const ringTop = new THREE.Mesh(new CylinderGeometry(0.168, 0.168, 0.012, 28), m.steelMat);
  ringTop.position.y = 0.016;
  neck.add(ringTop);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    E.bolt(neck, Math.cos(a) * 0.178, 0.016, Math.sin(a) * 0.178, 'y', 0.008);
  }

  // Coque : un volume unique, chanfrein reel, bombé, pas quatre plaques seches.
  const gHull = new RoundedBoxGeometry(HW * 2 + 0.02, HH - 0.02, HL * 2 + 0.02 - 0.11, 5, 0.032);
  E.bulgeFace(gHull, 0, 1, 0.014);
  E.bulgeFace(gHull, 0, -1, 0.014);
  E.bulgeFace(gHull, 2, 1, 0.012);
  E.bulgeFace(gHull, 2, -1, 0.010);
  E.bulgeFace(gHull, 1, 1, 0.016);
  E.finishHull(gHull);
  const hull = new THREE.Mesh(gHull, E.hullFaces(4));
  hull.position.set(0, HH / 2 - 0.02, -0.055);
  head.add(hull);

  // Piliers d'angle : l'arête vive disparait, on lit une tole roulée.
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const post = new THREE.Mesh(new CylinderGeometry(0.020, 0.020, HH - 0.05, 12), m.hullPlainMat);
    post.position.set(sx * (HW - 0.004), HH / 2 - 0.02, sz * (HL - 0.016));
    head.add(post);
  }

  // Nervure de tole sous le toit (joint de panneau en creux).
  const seam = new THREE.Mesh(new BoxGeometry(HW * 2 - 0.04, 0.006, 0.008), m.darkMat);
  seam.position.set(0, HH * 0.62, fz - 0.04);
  head.add(seam);

  // Face avant inclinee : baie + casquette + menton.
  const frontFace = new THREE.Group();
  frontFace.position.set(0, 0, fz);
  frontFace.rotation.x = TILT;
  head.add(frontFace);

  const strip = (w, h, d, x, y, z) => {
    const gStrip = new RoundedBoxGeometry(w, h, d, 3, 0.012);
    E.bulgeFace(gStrip, 2, 1, 0.006);
    E.finishHull(gStrip);
    const st = new THREE.Mesh(gStrip, E.hullFaces(4));
    st.position.set(x, y, z || 0);
    frontFace.add(st);
    return st;
  };
  const sideW = (0.54 - OPEN.w) / 2;
  strip(0.54, OPEN.y0 + 0.02, 0.048, 0, OPEN.y0 / 2 - 0.02, 0.006);                 // menton / sous baie
  strip(0.54, HH - OPEN.y1 + 0.02, 0.042, 0, (OPEN.y1 + HH) / 2 - 0.01, 0.002);    // fronton
  strip(sideW + 0.01, OPEN.y1 - OPEN.y0 + 0.02, 0.042, -(OPEN.w + sideW) / 2, bayY, 0.004);
  strip(sideW + 0.01, OPEN.y1 - OPEN.y0 + 0.02, 0.042, (OPEN.w + sideW) / 2, bayY, 0.004);

  // Casquette : c'est elle qui fait visage, pas ecran. Visiere qui depasse.
  const brow = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.046, 0.125, 3, 0.014), m.hullPlainMat);
  E.finishHull(brow.geometry);
  brow.position.set(0, OPEN.y1 + 0.036, 0.058);
  brow.rotation.x = -0.24;
  frontFace.add(brow);
  const browLip = new THREE.Mesh(new BoxGeometry(0.52, 0.012, 0.016), m.frameMat);
  browLip.position.set(0, OPEN.y1 + 0.014, 0.112);
  frontFace.add(browLip);

  // Menton de tole pliee sous la baie, plus epais qu'un bandeau.
  const chin = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.055, 0.07, 3, 0.012), m.hullPlainMat);
  E.finishHull(chin.geometry);
  chin.position.set(0, OPEN.y0 - 0.028, 0.038);
  chin.rotation.x = 0.18;
  frontFace.add(chin);

  // Joint baie
  for (const [ww, hh, xx, yy] of [
    [OPEN.w + 0.04, 0.014, 0, OPEN.y0 - 0.006],
    [OPEN.w + 0.04, 0.014, 0, OPEN.y1 + 0.006],
    [0.014, OPEN.y1 - OPEN.y0 + 0.028, -OPEN.w / 2 - 0.01, bayY],
    [0.014, OPEN.y1 - OPEN.y0 + 0.028, OPEN.w / 2 + 0.01, bayY]]) {
    const seal = new THREE.Mesh(new BoxGeometry(ww, hh, 0.02), m.rubberMat);
    seal.position.set(xx, yy, 0.018);
    frontFace.add(seal);
  }

  for (const sx of [-(OPEN.w + sideW) / 2, (OPEN.w + sideW) / 2]) {
    for (const yy of [OPEN.y0 + 0.03, OPEN.y1 - 0.03]) {
      E.bolt(frontFace, sx + (sx < 0 ? -0.012 : 0.012), yy, 0.024, 'z', 0.008);
    }
  }

  // Essuie-glace
  const wiper = new THREE.Group();
  wiper.position.set(-OPEN.w / 2 + 0.03, OPEN.y1 - 0.022, 0.028);
  frontFace.add(wiper);
  const pivotCap = new THREE.Mesh(new CylinderGeometry(0.012, 0.014, 0.016, 12), m.frameMat);
  pivotCap.rotation.x = Math.PI / 2;
  wiper.add(pivotCap);
  const arm = new THREE.Mesh(new BoxGeometry(0.20, 0.007, 0.006), m.frameMat);
  arm.position.set(0.10, 0.004, 0.006);
  wiper.add(arm);
  const blade = new THREE.Mesh(new BoxGeometry(0.19, 0.014, 0.008), m.rubberMat);
  blade.position.set(0.10, -0.016, 0.010);
  wiper.add(blade);

  // Retros : bras coudé, coque epaisse, glace, clignotant.
  for (const s of [-1, 1]) {
    const mir = new THREE.Group();
    mir.position.set(s * (HW + 0.02), OPEN.y1 + 0.02, fz - 0.04);
    head.add(mir);
    const hinge = new THREE.Mesh(new CylinderGeometry(0.012, 0.012, 0.028, 10), m.steelMat);
    hinge.rotation.x = Math.PI / 2;
    mir.add(hinge);
    const arm1 = new THREE.Mesh(new CylinderGeometry(0.007, 0.008, 0.07, 8), m.frameMat);
    arm1.rotation.z = s * 1.05;
    arm1.position.set(s * 0.032, 0.018, 0.008);
    mir.add(arm1);
    const arm2 = new THREE.Mesh(new CylinderGeometry(0.006, 0.007, 0.05, 8), m.frameMat);
    arm2.rotation.z = s * 0.35;
    arm2.position.set(s * 0.072, 0.048, 0.018);
    mir.add(arm2);
    const shellM = new THREE.Mesh(new RoundedBoxGeometry(0.088, 0.062, 0.028, 3, 0.008), m.hullMat);
    E.finishHull(shellM.geometry);
    shellM.position.set(s * 0.095, 0.058, 0.022);
    mir.add(shellM);
    const glassM = new THREE.Mesh(new PlaneGeometry(0.068, 0.046), m.mirrorMat);
    glassM.position.set(s * 0.095, 0.058, 0.037);
    glassM.rotation.y = Math.PI;
    mir.add(glassM);
    const blink = new THREE.Mesh(new SphereGeometry(0.010, 10, 8), m.ledAmber);
    blink.position.set(s * 0.095, 0.058, 0.008);
    mir.add(blink);
    E.bolt(mir, s * 0.095, 0.030, 0.022, 'z', 0.006);
  }

  // Clignotants d'angle, encastres dans un boitier.
  for (const s of [-1, 1]) {
    const boxS = new THREE.Mesh(new RoundedBoxGeometry(0.028, 0.022, 0.022, 2, 0.004), m.frameMat);
    boxS.position.set(s * 0.255, HH - 0.055, fz - 0.012);
    head.add(boxS);
    const sig = new THREE.Mesh(new SphereGeometry(0.011, 10, 8), m.ledAmber);
    sig.position.set(s * 0.255, HH - 0.055, fz + 0.002);
    head.add(sig);
  }

  // Flancs : tole bombee + trappe a droite + hublot a gauche.
  for (const s of [-1, 1]) {
    const gPlate = new RoundedBoxGeometry(0.034, HH - 0.04, HL * 2 - 0.06, 4, 0.014);
    E.bulgeFace(gPlate, 0, s, 0.012);
    E.finishHull(gPlate);
    const plate = new THREE.Mesh(gPlate, E.hullFaces(s > 0 ? 0 : 1));
    plate.position.set(s * (HW + 0.012), HH / 2 - 0.015, 0);
    plate.rotation.z = s * 0.07;
    head.add(plate);

    // joint de panneau en creux
    const groove = new THREE.Mesh(new BoxGeometry(0.006, HH - 0.10, 0.006), m.darkMat);
    groove.position.set(s * (HW + 0.028), HH / 2 - 0.02, 0.04);
    head.add(groove);

    for (const zz of [-0.18, 0, 0.18]) {
      E.bolt(head, s * (HW + 0.032), 0.06, zz, 'x', 0.008);
      E.bolt(head, s * (HW + 0.032), HH - 0.08, zz, 'x', 0.008);
    }
    if (s === 1) {
      E.rustDrip(head, s * (HW + 0.032), 0.05, -0.18, 0.07, 0.006);
      E.rustDrip(head, s * (HW + 0.032), 0.05, 0.18, 0.055, 0.005);
    }

    // pod radio
    const pod = new THREE.Mesh(new CylinderGeometry(0.038, 0.044, 0.05, 16), m.frameMat);
    pod.rotation.z = Math.PI / 2;
    pod.position.set(s * (HW + 0.048), 0.18, -0.04);
    head.add(pod);
    const led = new THREE.Mesh(new SphereGeometry(0.011, 10, 8), m.ledAmber);
    led.position.set(s * (HW + 0.074), 0.18, -0.04);
    head.add(led);
  }

  // Trappe d'acces a tribord : cadre, porte, charnieres a piano, loquet.
  {
    const hatch = new THREE.Group();
    hatch.position.set(HW + 0.036, 0.16, 0.10);
    head.add(hatch);
    const frame = new THREE.Mesh(new BoxGeometry(0.012, 0.16, 0.20), m.frameMat);
    hatch.add(frame);
    const door = new THREE.Mesh(new RoundedBoxGeometry(0.010, 0.13, 0.17, 2, 0.006), m.hullPlainMat);
    E.finishHull(door.geometry);
    door.position.x = 0.008;
    hatch.add(door);
    for (const dz of [-0.07, 0.07]) {
      const hinge = new THREE.Mesh(new CylinderGeometry(0.007, 0.007, 0.028, 8), m.steelMat);
      hinge.rotation.x = Math.PI / 2;
      hinge.position.set(0.012, 0.05, dz);
      hatch.add(hinge);
    }
    const latch = new THREE.Mesh(new BoxGeometry(0.014, 0.018, 0.028), m.steelMat);
    latch.position.set(0.016, -0.02, 0.06);
    hatch.add(latch);
    const latchBar = new THREE.Mesh(new BoxGeometry(0.010, 0.036, 0.010), m.steelMat);
    latchBar.position.set(0.016, -0.02, 0.078);
    hatch.add(latchBar);
  }

  // Hublot babord
  {
    const winF = new THREE.Mesh(new RoundedBoxGeometry(0.012, 0.10, 0.14, 2, 0.006), m.frameMat);
    winF.position.set(-(HW + 0.034), 0.22, 0.08);
    head.add(winF);
    const winG = new THREE.Mesh(new PlaneGeometry(0.08, 0.11), m.glassMat);
    winG.position.set(-(HW + 0.041), 0.22, 0.08);
    winG.rotation.y = -Math.PI / 2;
    head.add(winG);
  }

  // Dos
  const gBack = new RoundedBoxGeometry(HW * 2 - 0.04, HH - 0.06, 0.036, 4, 0.014);
  E.bulgeFace(gBack, 2, -1, 0.008);
  E.finishHull(gBack);
  const back = new THREE.Mesh(gBack, E.hullFaces(5));
  back.position.set(0, HH / 2 - 0.015, -HL + 0.008);
  head.add(back);
  const rearFrame = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.18, 0.014, 2, 0.006), m.frameMat);
  rearFrame.position.set(0, HH / 2 - 0.02, -HL - 0.010);
  head.add(rearFrame);
  const rearGlass = new THREE.Mesh(new PlaneGeometry(0.24, 0.15), m.glassMat);
  rearGlass.position.set(0, HH / 2 - 0.02, -HL - 0.018);
  rearGlass.rotation.y = Math.PI;
  head.add(rearGlass);

  const grab = new THREE.Group();
  grab.position.set(HW - 0.05, 0.18, -HL - 0.024);
  head.add(grab);
  for (const dy of [-0.04, 0.04]) {
    const leg = new THREE.Mesh(new BoxGeometry(0.014, 0.018, 0.032), m.steelMat);
    leg.position.y = dy;
    grab.add(leg);
  }
  const grabBar = new THREE.Mesh(new CylinderGeometry(0.009, 0.009, 0.10, 8), m.steelMat);
  grabBar.rotation.x = Math.PI / 2;
  grabBar.position.y = 0.05;
  grab.add(grabBar);

  // Toit cambre + gouttieres + rampe
  const gRoof = new RoundedBoxGeometry(HW * 2 + 0.10, 0.032, HL * 2 + 0.08, 4, 0.014);
  E.bulgeFace(gRoof, 1, 1, 0.012);
  E.finishHull(gRoof);
  const roof = new THREE.Mesh(gRoof, E.hullFaces(2));
  roof.position.y = HH - 0.002;
  head.add(roof);

  const lightbar = new THREE.Group();
  lightbar.position.set(0, HH + 0.038, -0.04);
  head.add(lightbar);
  const rail = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.020, 0.055, 2, 0.006), m.frameMat);
  lightbar.add(rail);
  for (const [lx, lr] of [[-0.12, 0.034], [0, 0.050], [0.12, 0.034]]) {
    const housing = new THREE.Mesh(new CylinderGeometry(lr, lr * 1.12, 0.044, 18), m.frameMat);
    housing.rotation.x = Math.PI / 2 - 0.28;
    housing.position.set(lx, 0.030, 0.020);
    lightbar.add(housing);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(lr * 0.82, 16), m.ledWhite);
    lens.position.set(lx, 0.046, 0.052);
    lens.rotation.x = -0.28;
    lightbar.add(lens);
    const bezel = new THREE.Mesh(new TorusGeometry(lr * 0.88, lr * 0.12, 6, 20), m.steelMat);
    bezel.position.set(lx, 0.046, 0.052);
    bezel.rotation.x = -0.28;
    lightbar.add(bezel);
    E.bolt(lightbar, lx, 0.008, 0, 'y', 0.006);
  }

  // Cable d'alimentation rampe → cabine
  E.cable(head, [
    new THREE.Vector3(-0.14, HH + 0.02, -0.04),
    new THREE.Vector3(-0.16, HH - 0.02, -0.08),
    new THREE.Vector3(-0.15, HH - 0.08, -0.14),
  ], 0.005, m.hoseMat);

  return { head, HW, HL, HH, OPEN, fz, TILT };
}
