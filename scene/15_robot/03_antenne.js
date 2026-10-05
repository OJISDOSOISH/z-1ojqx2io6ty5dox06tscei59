// ANTENNE — element 03 du dossier 15_robot/. REFONTE 2 : bloc radio de toit,
// fouet, stub a isolateurs, parabole, cable gaine qui rentre en cabine.
export function piece_antenne(E) {
  const { THREE, m } = E;
  const { BoxGeometry, CylinderGeometry, TorusGeometry, SphereGeometry } = THREE;

  const rack = new THREE.Group();
  rack.position.set(-0.14, 0.375, -0.10);
  E.tete.head.add(rack);
  const plate = new THREE.Mesh(new CylinderGeometry(0.055, 0.062, 0.014, 18), m.frameMat);
  rack.add(plate);
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    E.bolt(rack, Math.cos(a) * 0.042, 0.008, Math.sin(a) * 0.042, 'y', 0.007);
  }

  const whip = new THREE.Group();
  whip.position.set(0, 0.010, 0);
  rack.add(whip);
  const coil = new THREE.Mesh(new TorusGeometry(0.020, 0.006, 6, 14), m.darkMat);
  coil.rotation.x = Math.PI / 2;
  coil.position.y = 0.02;
  whip.add(coil);
  const mast = new THREE.Mesh(new CylinderGeometry(0.004, 0.007, 0.30, 8), m.steelMat);
  mast.position.y = 0.17;
  whip.add(mast);
  const tip = new THREE.Mesh(new SphereGeometry(0.011, 10, 8), m.ledAmber);
  tip.position.y = 0.325;
  whip.add(tip);

  const stub = new THREE.Group();
  stub.position.set(0.09, 0.008, -0.03);
  rack.add(stub);
  const rod = new THREE.Mesh(new CylinderGeometry(0.0035, 0.0035, 0.14, 6), m.steelMat);
  rod.position.y = 0.07;
  stub.add(rod);
  for (let i = 0; i < 3; i++) {
    const disc = new THREE.Mesh(new CylinderGeometry(0.016, 0.016, 0.008, 10), m.hullPlainMat);
    disc.position.y = 0.03 + i * 0.04;
    stub.add(disc);
  }

  const dish = new THREE.Group();
  dish.position.set(0.005, 0.012, 0.075);
  dish.rotation.x = -0.7;
  rack.add(dish);
  const dishMat = m.steelMat.clone();
  dishMat.side = THREE.DoubleSide;
  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.052, 18, 10, 0, Math.PI * 2, 0, 0.55),
    dishMat
  );
  dish.add(bowl);
  const feed = new THREE.Mesh(new CylinderGeometry(0.0025, 0.0025, 0.05, 6), m.steelMat);
  feed.position.y = 0.03;
  dish.add(feed);
  const feedTip = new THREE.Mesh(new SphereGeometry(0.007, 8, 6), m.brassMat);
  feedTip.position.y = 0.055;
  dish.add(feedTip);
  for (const s of [-1, 1]) {
    const strut = new THREE.Mesh(new CylinderGeometry(0.0022, 0.0022, 0.055, 6), m.steelMat);
    strut.position.set(s * 0.018, 0.02, 0.012);
    strut.rotation.z = -s * 0.5;
    dish.add(strut);
  }

  E.cable(E.tete.head, [
    new THREE.Vector3(-0.14, 0.375, -0.10),
    new THREE.Vector3(-0.15, 0.34, -0.14),
    new THREE.Vector3(-0.16, 0.28, -0.20),
    new THREE.Vector3(-0.14, 0.22, -0.24),
  ], 0.006, m.hoseMat);
  for (const p of [
    new THREE.Vector3(-0.15, 0.33, -0.145),
    new THREE.Vector3(-0.155, 0.255, -0.21),
  ]) {
    const clip = new THREE.Mesh(new BoxGeometry(0.014, 0.010, 0.014), m.frameMat);
    clip.position.copy(p);
    E.tete.head.add(clip);
  }

  return { rack };
}
