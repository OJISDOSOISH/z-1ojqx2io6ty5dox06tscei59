// CORPS — element 04 du dossier 15_robot/. REFONTE 2 : coque sculptee, pas une
// caisse. Chanfreins, bombes, joints en creux, soudures, rivets, calandre,
// feux arriere, plaque, pot, prise d'air, durites. Subdivision tenue (perf).
export function piece_corps(E) {
  const { THREE, m } = E;
  const { BoxGeometry, CylinderGeometry, SphereGeometry, TorusGeometry, CircleGeometry } = THREE;
  const { RoundedBoxGeometry } = E;

  const body = new THREE.Group();
  body.position.y = 0.38;
  E.ROBOT.add(body);

  const wav = (x, y, z) =>
    (Math.sin(x * 37.7 + y * 91.3) * Math.sin(y * 43.1 + z * 57.7) * Math.sin(z * 29.9 + x * 71.3)) * 0.5;

  // ---------------------------------------------------------- FLANCS
  for (const s of [-1, 1]) {
    const side = new THREE.Group();
    side.position.x = s * 0.26;
    body.add(side);

    let plateGeo = new THREE.BoxGeometry(0.038, 0.40, 0.86, 2, 18, 36);
    {
      const pos = plateGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const bord = Math.min(1, Math.min(0.20 - Math.abs(y - 0.06), 0.43 - Math.abs(z)) * 10);
        if (bord <= 0) continue;
        const bow = Math.sin((y - 0.06) * 3.1) * Math.cos(z * 2.6) * 0.007;
        const dent = wav(x, y * 3.3, z * 1.1) * 0.0024;
        pos.setX(i, x + s * (bow + dent) * bord);
      }
      pos.needsUpdate = true;
    }
    E.finishHull(plateGeo);
    const plate = new THREE.Mesh(plateGeo, E.hullFaces(s > 0 ? 0 : 1));
    plate.position.y = 0.06;
    side.add(plate);

    // character line : nervure saillante a mi-hauteur
    const crease = new THREE.Mesh(new BoxGeometry(0.010, 0.014, 0.82), m.frameMat);
    crease.position.set(-s * 0.018, 0.04, 0);
    side.add(crease);

    // joints de panneaux verticaux en creux
    for (const zz of [-0.22, 0.18]) {
      const jn = new THREE.Mesh(new BoxGeometry(0.006, 0.34, 0.006), m.darkMat);
      jn.position.set(-s * 0.022, 0.06, zz);
      side.add(jn);
    }

    const inset = new THREE.Mesh(new BoxGeometry(0.02, 0.16, 0.30), m.darkMat);
    inset.position.set(-s * 0.012, 0.10, 0.16);
    side.add(inset);
    for (let i = 0; i < 5; i++) {
      const slat = new THREE.Mesh(new BoxGeometry(0.012, 0.012, 0.27), m.frameMat);
      slat.position.set(-s * 0.016, 0.045 + i * 0.028, 0.16);
      slat.rotation.x = -0.5 * s;
      side.add(slat);
    }

    if (s === 1) {
      const frame = new THREE.Mesh(new BoxGeometry(0.012, 0.22, 0.30), m.frameMat);
      frame.position.set(-s * 0.014, -0.02, -0.18);
      side.add(frame);
      const door = new THREE.Mesh(new RoundedBoxGeometry(0.014, 0.18, 0.26, 2, 0.006), m.hullPlainMat);
      E.finishHull(door.geometry);
      door.position.set(-s * 0.016, -0.02, -0.18);
      side.add(door);
      for (const dy of [-0.07, 0.07]) {
        const hinge = new THREE.Mesh(new CylinderGeometry(0.007, 0.007, 0.03, 8), m.steelMat);
        hinge.position.set(-s * 0.018, -0.02 + dy, -0.315);
        side.add(hinge);
      }
      const latchStem = new THREE.Mesh(new BoxGeometry(0.010, 0.012, 0.03), m.steelMat);
      latchStem.position.set(-s * 0.026, -0.02, -0.055);
      side.add(latchStem);
      const latchBar = new THREE.Mesh(new BoxGeometry(0.010, 0.034, 0.012), m.steelMat);
      latchBar.position.set(-s * 0.026, -0.02, -0.040);
      side.add(latchBar);
    }

    // Prise d'air a babord (fonction lisible : admission)
    if (s === -1) {
      const snork = new THREE.Group();
      snork.position.set(-s * 0.028, 0.12, -0.22);
      side.add(snork);
      const snBox = new THREE.Mesh(new RoundedBoxGeometry(0.04, 0.10, 0.08, 2, 0.008), m.frameMat);
      snork.add(snBox);
      for (let i = 0; i < 4; i++) {
        const sl = new THREE.Mesh(new BoxGeometry(0.006, 0.072, 0.010), m.darkMat);
        sl.position.set(-0.022, 0, -0.024 + i * 0.016);
        snork.add(sl);
      }
    }

    const band = new THREE.Mesh(new BoxGeometry(0.012, 0.07, 0.80), m.hazardMat);
    band.position.set(-s * 0.014, -0.115, 0);
    side.add(band);

    for (let i = 0; i < 8; i++) {
      const z = -0.36 + i * 0.10;
      E.bolt(side, -s * 0.022, 0.245, z, 'x', 0.009);
      E.bolt(side, -s * 0.022, -0.125, z, 'x', 0.009);
      if (i % 3 === 0) E.rustDrip(side, -s * 0.022, 0.235, z, 0.05, 0.004);
    }
  }

  // --------------------------------------------------------------- FACE AVANT
  const front = new THREE.Group();
  front.position.z = 0.44;
  body.add(front);
  let frontGeo = new THREE.BoxGeometry(0.50, 0.40, 0.038, 22, 18, 2);
  {
    const pos = frontGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const bord = Math.min(1, Math.min(0.25 - Math.abs(x), 0.20 - Math.abs(y - 0.06)) * 10);
      if (bord <= 0) continue;
      const bow = Math.sin(x * 4.2) * Math.cos((y - 0.06) * 3.4) * 0.007;
      const dent = wav(x * 1.2, y * 1.7, 0.5) * 0.0022;
      pos.setZ(i, z + (bow + dent) * bord);
    }
    pos.needsUpdate = true;
  }
  E.finishHull(frontGeo);
  const frontPlate = new THREE.Mesh(frontGeo, E.hullFaces(4));
  frontPlate.position.y = 0.06;
  front.add(frontPlate);

  const grille = new THREE.Mesh(new BoxGeometry(0.36, 0.20, 0.06), m.darkMat);
  grille.position.set(-0.04, 0.10, -0.030);
  front.add(grille);
  const engine = new THREE.Mesh(new BoxGeometry(0.30, 0.13, 0.035), m.frameMat);
  engine.position.set(-0.04, 0.10, -0.045);
  front.add(engine);
  for (let i = 0; i < 7; i++) {
    const fin = new THREE.Mesh(new BoxGeometry(0.29, 0.008, 0.05), m.steelMat);
    fin.position.set(-0.04, 0.045 + i * 0.018, -0.048);
    front.add(fin);
  }
  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new BoxGeometry(0.34, 0.014, 0.016), m.frameMat);
    slat.position.set(-0.04, 0.022 + i * 0.031, -0.020);
    front.add(slat);
  }
  const lampRing = new THREE.Mesh(new CylinderGeometry(0.052, 0.058, 0.03, 20), m.frameMat);
  lampRing.rotation.x = Math.PI / 2;
  lampRing.position.set(0.17, 0.16, -0.012);
  front.add(lampRing);
  const lampLens = new THREE.Mesh(new CircleGeometry(0.044, 20), m.ledWhite);
  lampLens.position.set(0.17, 0.16, 0.006);
  front.add(lampLens);

  // Pot vertical a tribord avant : silhouette machine, chapeau anti-pluie.
  const exhaust = new THREE.Group();
  exhaust.position.set(0.22, 0.22, 0.18);
  body.add(exhaust);
  const stack = new THREE.Mesh(new CylinderGeometry(0.028, 0.032, 0.28, 14), m.frameMat);
  stack.position.y = 0.14;
  exhaust.add(stack);
  for (let k = 0; k < 4; k++) {
    const shield = new THREE.Mesh(new TorusGeometry(0.036, 0.0035, 6, 16), m.frameMat);
    shield.position.y = 0.04 + k * 0.05;
    exhaust.add(shield);
  }
  const clamp = new THREE.Mesh(new TorusGeometry(0.034, 0.006, 8, 16), m.steelMat);
  clamp.position.y = 0.02;
  exhaust.add(clamp);
  const capE = new THREE.Mesh(new CylinderGeometry(0.040, 0.022, 0.016, 14), m.frameMat);
  capE.position.y = 0.30;
  exhaust.add(capE);
  const soot = new THREE.Mesh(new CircleGeometry(0.022, 12), m.darkMat);
  soot.position.y = 0.308;
  soot.rotation.x = -Math.PI / 2;
  exhaust.add(soot);

  // ------------------------------------------------------------- PLATEAU
  const gDeck = new RoundedBoxGeometry(0.50, 0.032, 0.84, 3, 0.014);
  E.bulgeFace(gDeck, 1, 1, 0.008);
  E.finishHull(gDeck);
  const deck = new THREE.Mesh(gDeck, E.hullFaces(2));
  deck.position.y = 0.275;
  body.add(deck);

  // Puits de tourelle (la tete s'emboite, ce n'est plus pose)
  const well = new THREE.Mesh(new CylinderGeometry(0.20, 0.21, 0.02, 24), m.frameMat);
  well.position.y = 0.292;
  body.add(well);

  const hatch = new THREE.Mesh(new CylinderGeometry(0.10, 0.105, 0.022, 20), m.hullMat);
  E.finishHull(hatch.geometry);
  hatch.position.set(-0.14, 0.298, -0.18);
  body.add(hatch);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    E.bolt(body, -0.14 + Math.cos(a) * 0.082, 0.312, -0.18 + Math.sin(a) * 0.082, 'y', 0.008);
  }

  const handle = new THREE.Group();
  handle.position.set(0.16, 0.30, -0.28);
  body.add(handle);
  for (const dx of [-0.07, 0.07]) {
    const leg = new THREE.Mesh(new CylinderGeometry(0.008, 0.008, 0.05, 8), m.steelMat);
    leg.position.x = dx; handle.add(leg);
  }
  const cross = new THREE.Mesh(new CylinderGeometry(0.009, 0.009, 0.155, 8), m.steelMat);
  cross.rotation.z = Math.PI / 2;
  cross.position.y = 0.025;
  handle.add(cross);

  // --------------------------------------------------------- JUPE + LISERE
  for (const s of [-1, 1]) {
    const skirt = new THREE.Mesh(new RoundedBoxGeometry(0.028, 0.13, 0.88, 2, 0.008), m.frameMat);
    skirt.position.set(s * 0.274, -0.145, 0);
    body.add(skirt);
    const trim = new THREE.Mesh(new BoxGeometry(0.006, 0.010, 0.88), m.accentMat);
    trim.position.set(s * 0.288, -0.072, 0);
    body.add(trim);
  }
  const skirtFront = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.13, 0.028, 2, 0.008), m.frameMat);
  skirtFront.position.set(0, -0.145, 0.438);
  body.add(skirtFront);
  const trimF = new THREE.Mesh(new BoxGeometry(0.52, 0.010, 0.006), m.accentMat);
  trimF.position.set(0, -0.072, 0.452);
  body.add(trimF);

  for (let i = 0; i < 2; i++) {
    const step = new THREE.Mesh(new BoxGeometry(0.16, 0.014, 0.09), m.frameMat);
    step.position.set(0.31, -0.02 - i * 0.09, -0.18);
    body.add(step);
  }
  for (const sx of [-1, 1]) {
    const pad = new THREE.Mesh(new BoxGeometry(0.07, 0.014, 0.05), m.frameMat);
    pad.position.set(sx * 0.17, -0.10, 0.42);
    body.add(pad);
    const ringH = new THREE.Mesh(new TorusGeometry(0.018, 0.005, 6, 14), m.steelMat);
    ringH.position.set(sx * 0.17, -0.075, 0.42);
    ringH.rotation.x = Math.PI / 2 - 0.3;
    body.add(ringH);
  }

  E.cable(body, [
    new THREE.Vector3(-0.20, 0.292, 0.38),
    new THREE.Vector3(-0.21, 0.298, 0.10),
    new THREE.Vector3(-0.20, 0.292, -0.18),
    new THREE.Vector3(-0.18, 0.288, -0.40),
  ], 0.008, m.hoseMat);

  // ------------------------------------------------------------- FACE ARRIERE
  const rear = new THREE.Group();
  rear.position.set(0, 0.04, -0.44);
  body.add(rear);
  const gRear = new RoundedBoxGeometry(0.50, 0.36, 0.036, 3, 0.014);
  E.bulgeFace(gRear, 2, -1, 0.008);
  E.finishHull(gRear);
  const rearPlate = new THREE.Mesh(gRear, E.hullFaces(5));
  rear.add(rearPlate);

  // Feux : fonction lisible, boitier + lentille rouge / orange / recul
  for (const sx of [-1, 1]) {
    const hous = new THREE.Mesh(new RoundedBoxGeometry(0.10, 0.14, 0.04, 2, 0.008), m.frameMat);
    hous.position.set(sx * 0.175, 0.04, -0.028);
    rear.add(hous);
    const red = new THREE.Mesh(new CylinderGeometry(0.032, 0.032, 0.016, 16), m.ledRed);
    red.rotation.x = Math.PI / 2;
    red.position.set(sx * 0.175, 0.075, -0.048);
    rear.add(red);
    const amb = new THREE.Mesh(new CylinderGeometry(0.018, 0.018, 0.014, 12), m.ledAmber);
    amb.rotation.x = Math.PI / 2;
    amb.position.set(sx * 0.175, 0.018, -0.046);
    rear.add(amb);
    const rev = new THREE.Mesh(new CylinderGeometry(0.012, 0.012, 0.012, 10), m.ledWhite);
    rev.rotation.x = Math.PI / 2;
    rev.position.set(sx * 0.175, -0.012, -0.044);
    rear.add(rev);
  }

  const plate = new THREE.Mesh(new RoundedBoxGeometry(0.18, 0.055, 0.010, 2, 0.004), m.plateMat);
  plate.position.set(0, -0.06, -0.026);
  rear.add(plate);
  E.bolt(rear, -0.078, -0.06, -0.032, 'z', 0.005);
  E.bolt(rear, 0.078, -0.06, -0.032, 'z', 0.005);

  const hitch = new THREE.Mesh(new TorusGeometry(0.030, 0.008, 8, 18), m.steelMat);
  hitch.position.set(0, -0.14, -0.02);
  rear.add(hitch);
  const hitchPad = new THREE.Mesh(new BoxGeometry(0.08, 0.024, 0.04), m.frameMat);
  hitchPad.position.set(0, -0.155, 0.01);
  rear.add(hitchPad);

  // Verin de hayon (cote carrosserie, fonction : maintien)
  const ram = new THREE.Group();
  ram.position.set(0.24, 0.10, -0.36);
  body.add(ram);
  const ramC = new THREE.Mesh(new CylinderGeometry(0.014, 0.016, 0.14, 10), m.accentMat);
  ramC.rotation.x = 0.7;
  ram.add(ramC);
  const ramR = new THREE.Mesh(new CylinderGeometry(0.007, 0.007, 0.10, 8), m.chromeMat);
  ramR.rotation.x = 0.7;
  ramR.position.set(0, 0.06, -0.05);
  ram.add(ramR);

  const skid = new THREE.Mesh(new BoxGeometry(0.44, 0.025, 0.78), m.frameMat);
  skid.position.y = -0.115;
  body.add(skid);
  for (const zz of [-0.30, 0.30]) {
    const rib = new THREE.Mesh(new BoxGeometry(0.46, 0.018, 0.03), m.frameMat);
    rib.position.set(0, -0.10, zz);
    body.add(rib);
  }

  return { body };
}
