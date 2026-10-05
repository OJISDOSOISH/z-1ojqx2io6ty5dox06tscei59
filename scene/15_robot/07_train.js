// TRAIN — element 07 du dossier 15_robot/. REFONTE 2 : ailes galbees qui
// epousent chaque pneu (jeu ~2 cm), levre roulee, epaisseur de tole, etais,
// marchepied raccordé, bavettes, verins. 08_pneus.js n'est pas touche.
// Pneus : centre ( ±0.375, 0.252, ±0.27 ), rayon 0.252, demi-largeur 0.0925.
export function piece_train(E) {
  const { THREE, m } = E;
  const { BoxGeometry, CylinderGeometry, SphereGeometry, TorusGeometry } = THREE;

  const TRACK = 0.27;
  const XHULL = 0.255;
  const WX = 0.375;
  const WY = 0.252;
  const R_TIRE = 0.252;
  const R_IN = 0.274;

  for (const s of [-1, 1]) {
    const rail = new THREE.Mesh(new BoxGeometry(0.05, 0.06, 0.94), m.frameMat);
    rail.position.set(s * XHULL, 0.11, 0);
    E.ROBOT.add(rail);
    for (let i = 0; i < 5; i++) {
      const cross = new THREE.Mesh(new BoxGeometry(0.055, 0.014, 0.025), m.frameMat);
      cross.position.set(s * XHULL, 0.085, -0.36 + i * 0.18);
      E.ROBOT.add(cross);
    }
  }

  for (const s of [-1, 1]) {
    for (const zc of [-1, 1]) {
      const hub = new THREE.Vector3(s * 0.315, WY, zc * TRACK);
      const armA = new THREE.Mesh(new CylinderGeometry(0.016, 0.020, 0.19, 10), m.frameMat);
      armA.position.set(s * 0.278, 0.185, zc * (TRACK - 0.115));
      armA.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(hub, new THREE.Vector3(s * 0.252, 0.115, zc * (TRACK - 0.20))).normalize());
      E.ROBOT.add(armA);
      const armB = new THREE.Mesh(new CylinderGeometry(0.016, 0.020, 0.15, 10), m.frameMat);
      armB.position.set(s * 0.278, 0.30, zc * (TRACK - 0.10));
      armB.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(hub, new THREE.Vector3(s * 0.252, 0.36, zc * (TRACK - 0.18))).normalize());
      E.ROBOT.add(armB);

      // Amortisseur incline, corps orange, tige chrome — lisible de profil.
      const shockA = new THREE.Vector3(s * 0.268, 0.36, zc * (TRACK - 0.16));
      const shockB = new THREE.Vector3(s * 0.305, 0.175, zc * (TRACK - 0.04));
      const shockD = new THREE.Vector3().subVectors(shockB, shockA);
      const shockLen = shockD.length();
      const shock = new THREE.Mesh(new CylinderGeometry(0.014, 0.016, shockLen * 0.62, 10), m.accentMat);
      shock.position.copy(shockA).addScaledVector(shockD, 0.28);
      shock.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), shockD.clone().normalize());
      E.ROBOT.add(shock);
      const sRod = new THREE.Mesh(new CylinderGeometry(0.006, 0.006, shockLen * 0.5, 8), m.chromeMat);
      sRod.position.copy(shockA).addScaledVector(shockD, 0.68);
      sRod.quaternion.copy(shock.quaternion);
      E.ROBOT.add(sRod);
      const sCap = new THREE.Mesh(new CylinderGeometry(0.018, 0.018, 0.012, 10), m.frameMat);
      sCap.position.copy(shockA);
      sCap.quaternion.copy(shock.quaternion);
      E.ROBOT.add(sCap);

      for (let k = 0; k < 5; k++) {
        const coil = new THREE.Mesh(new TorusGeometry(0.024, 0.005, 6, 14), m.steelMat);
        coil.position.set(s * 0.282, 0.16 + k * 0.020, zc * (TRACK - 0.075));
        coil.rotation.y = Math.PI / 2;
        coil.scale.set(1, 1, 1.7);
        E.ROBOT.add(coil);
      }
      const axle = new THREE.Mesh(new CylinderGeometry(0.038, 0.042, 0.07, 14), m.frameMat);
      axle.rotation.z = Math.PI / 2;
      axle.position.set(s * 0.293, WY, zc * TRACK);
      E.ROBOT.add(axle);
      const flange = new THREE.Mesh(new CylinderGeometry(0.052, 0.052, 0.014, 16), m.steelMat);
      flange.rotation.z = Math.PI / 2;
      flange.position.set(s * 0.325, WY, zc * TRACK);
      E.ROBOT.add(flange);
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        E.bolt(E.ROBOT, s * 0.331, WY + Math.cos(a) * 0.034, zc * TRACK + Math.sin(a) * 0.034, 'x', 0.006);
      }
    }
  }

  // ------------------------------------------------- AILES GALBEES
  for (const s of [-1, 1]) {
    for (const zc of [-1, 1]) {
      const a0 = zc > 0 ? -0.42 : -1.48;
      const a1 = zc > 0 ?  1.48 :  0.42;
      const geo = E.fenderGeo(THREE, {
        r0: R_IN, r1: R_IN + 0.012, th: 0.010,
        a0: a0, a1: a1,
        x0: s * 0.292, x1: s * 0.505,
        nA: 26, nX: 6, lip: 0.018,
      });
      E.planarUVs(geo);
      E.paintWear(geo);
      const fender = new THREE.Mesh(geo, m.hullMat);
      fender.position.set(0, WY, zc * TRACK);
      E.ROBOT.add(fender);

      // Liner sombre : le jeu avec le pneu se lit comme un passage de roue.
      const liner = E.fenderGeo(THREE, {
        r0: R_IN - 0.006, r1: R_IN, th: 0.006,
        a0: a0, a1: a1,
        x0: s * 0.305, x1: s * 0.455,
        nA: 18, nX: 3, lip: 0.004,
      });
      const well = new THREE.Mesh(liner, m.darkMat);
      well.position.set(0, WY, zc * TRACK);
      E.ROBOT.add(well);

      // Flasque interieur : raccord aile / chassis
      const flangeI = new THREE.Mesh(new BoxGeometry(0.024, 0.05, 0.22), m.frameMat);
      flangeI.position.set(s * 0.286, WY + 0.22, zc * TRACK);
      E.ROBOT.add(flangeI);

      // Etais visisbles sous l'aile
      for (const t of [0.25, 0.75]) {
        const a = a0 + (a1 - a0) * t;
        const stay = new THREE.Mesh(new CylinderGeometry(0.007, 0.009, 0.12, 8), m.frameMat);
        stay.position.set(
          s * 0.34,
          WY + Math.cos(a) * R_IN * 0.55,
          zc * TRACK + Math.sin(a) * R_IN * 0.55
        );
        stay.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(-s * 0.4, -0.8, 0).normalize()
        );
        E.ROBOT.add(stay);
        E.bolt(E.ROBOT, s * 0.36, WY + Math.cos(a) * (R_IN + 0.004), zc * TRACK + Math.sin(a) * (R_IN + 0.004), 'y', 0.006);
      }

      // Bavette caoutchouc au bout bas de l'aile
      const aTip = zc > 0 ? a1 : a0;
      const flap = new THREE.Mesh(new BoxGeometry(0.14, 0.08, 0.010), m.rubberMat);
      flap.position.set(
        s * 0.40,
        WY + Math.cos(aTip) * R_IN - 0.04,
        zc * TRACK + Math.sin(aTip) * R_IN
      );
      flap.rotation.x = zc * 0.35;
      E.ROBOT.add(flap);
    }

    // Marchepied : il se raccorde aux ailes, plus bas que le sommet des pneus.
    const gBoard = new BoxGeometry(0.14, 0.022, 0.30);
    E.planarUVs(gBoard);
    E.paintWear(gBoard);
    const board = new THREE.Mesh(gBoard, E.hullFaces(2));
    board.position.set(s * 0.40, 0.42, 0);
    E.ROBOT.add(board);
    const lipM = m.hazardMat;
    const lip = new THREE.Mesh(new BoxGeometry(0.012, 0.026, 0.30), lipM);
    lip.position.set(s * 0.468, 0.42, 0);
    E.ROBOT.add(lip);
    // Joues de raccord marchepied → aile (remplit le vide)
    for (const zc of [-1, 1]) {
      const cheek = new THREE.Mesh(new BoxGeometry(0.13, 0.018, 0.08), m.hullPlainMat);
      cheek.position.set(s * 0.40, 0.445, zc * 0.18);
      cheek.rotation.x = -zc * 0.4;
      E.ROBOT.add(cheek);
    }
    for (const zz of [-0.10, 0.10]) {
      const stay = new THREE.Mesh(new BoxGeometry(0.12, 0.014, 0.024), m.frameMat);
      stay.position.set(s * 0.34, 0.30, zz);
      stay.rotation.z = s * 0.85;
      E.ROBOT.add(stay);
    }
    const marker = new THREE.Mesh(new SphereGeometry(0.009, 8, 6), m.ledAmber);
    marker.position.set(s * 0.46, 0.50, 0.48);
    E.ROBOT.add(marker);
  }

  // Pare-choc avant
  const bumper = new THREE.Mesh(new CylinderGeometry(0.022, 0.022, 0.56, 16), m.steelMat);
  bumper.rotation.z = Math.PI / 2;
  bumper.position.set(0, 0.16, 0.51);
  E.ROBOT.add(bumper);
  for (const s of [-1, 1]) {
    const end = new THREE.Mesh(new SphereGeometry(0.03, 14, 10), m.steelMat);
    end.position.set(s * 0.28, 0.16, 0.51);
    E.ROBOT.add(end);
    const arm = new THREE.Mesh(new BoxGeometry(0.03, 0.03, 0.10), m.frameMat);
    arm.position.set(s * 0.26, 0.16, 0.46);
    E.ROBOT.add(arm);
  }
  // Pare-choc arriere
  const bumperR = new THREE.Mesh(new BoxGeometry(0.52, 0.04, 0.05), m.frameMat);
  bumperR.position.set(0, 0.14, -0.50);
  E.ROBOT.add(bumperR);
  const stripe = new THREE.Mesh(new BoxGeometry(0.52, 0.018, 0.012), m.hazardMat);
  stripe.position.set(0, 0.14, -0.528);
  E.ROBOT.add(stripe);

  return {};
}
