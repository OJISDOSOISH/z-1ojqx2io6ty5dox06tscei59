// BRAS — element 05 du dossier 15_robot/. REFONTE 2 : manipulateur de machine,
// epaule bridee, piston visible, durites, pince, lanterne. Materiaux partages.
export function piece_bras(E) {
  const { THREE, m } = E;
  const { CylinderGeometry, SphereGeometry, TorusGeometry, BoxGeometry } = THREE;
  const { RoundedBoxGeometry } = E;

  const arm = new THREE.Group();
  E.ROBOT.add(arm);

  const S = new THREE.Vector3(0.30, 0.52, 0.10);
  const bracket = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.16, 0.14, 2, 0.012), m.frameMat);
  bracket.position.set(S.x + 0.015, S.y, S.z);
  arm.add(bracket);
  for (const dy of [-0.055, 0.055]) {
    const bx = new THREE.Mesh(new CylinderGeometry(0.008, 0.008, 0.045, 8), m.steelMat);
    bx.rotation.z = Math.PI / 2;
    bx.position.set(S.x + 0.045, S.y + dy, S.z);
    arm.add(bx);
  }
  const shoulder = new THREE.Mesh(new CylinderGeometry(0.058, 0.064, 0.075, 20), m.frameMat);
  shoulder.rotation.z = Math.PI / 2;
  shoulder.position.copy(S);
  arm.add(shoulder);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    E.bolt(arm, S.x + 0.042, S.y + Math.cos(a) * 0.040, S.z + Math.sin(a) * 0.040, 'x', 0.007);
  }

  const Aj = {
    E: new THREE.Vector3(0.40, 0.40, 0.26),
    W: new THREE.Vector3(0.40, 0.48, 0.47)
  };
  const limb = (a, b, r0, r1, mat) => {
    const d = new THREE.Vector3().subVectors(b, a), len = d.length();
    const mm = new THREE.Mesh(new CylinderGeometry(r1, r0, len, 14), mat);
    mm.position.copy(a).addScaledVector(d, 0.5);
    mm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    arm.add(mm); return mm;
  };
  limb(S, Aj.E, 0.045, 0.038, m.accentMat);
  limb(Aj.E, Aj.W, 0.032, 0.028, m.frameMat);

  const cylDir = new THREE.Vector3().subVectors(Aj.E, S).normalize();
  const cylLen = S.distanceTo(Aj.E) * 0.72;
  const cyl = new THREE.Mesh(new CylinderGeometry(0.024, 0.026, cylLen, 14), m.accentMat);
  cyl.position.copy(S).addScaledVector(cylDir, cylLen * 0.42);
  cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cylDir);
  arm.add(cyl);
  const cylCap = new THREE.Mesh(new CylinderGeometry(0.028, 0.028, 0.014, 14), m.frameMat);
  cylCap.position.copy(S).addScaledVector(cylDir, 0.05);
  cylCap.quaternion.copy(cyl.quaternion);
  arm.add(cylCap);
  const rodLen = S.distanceTo(Aj.E) * 0.55;
  const rod = new THREE.Mesh(new CylinderGeometry(0.011, 0.011, rodLen, 12), m.chromeMat);
  rod.position.copy(S).addScaledVector(cylDir, cylLen * 0.72 + rodLen * 0.28);
  rod.quaternion.copy(cyl.quaternion);
  arm.add(rod);
  const nipple = new THREE.Mesh(new CylinderGeometry(0.005, 0.005, 0.014, 8), m.brassMat);
  nipple.position.copy(S).addScaledVector(cylDir, 0.10).add(new THREE.Vector3(0, 0.026, 0));
  arm.add(nipple);

  {
    const a = new THREE.Vector3(0.27, 0.44, 0.10);
    const b = S.clone().addScaledVector(cylDir, 0.10);
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const p = new THREE.Vector3().lerpVectors(a, b, t);
      p.y -= Math.sin(t * Math.PI) * 0.030;
      pts.push(p);
    }
    E.cable(arm, pts, 0.006, m.hoseMat);
    const nutA = new THREE.Mesh(new CylinderGeometry(0.009, 0.009, 0.014, 6), m.brassMat);
    nutA.position.copy(b);
    arm.add(nutA);
  }
  // seconde durite, retour
  {
    const a = new THREE.Vector3(0.26, 0.40, 0.08);
    const b = S.clone().addScaledVector(cylDir, 0.16);
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const p = new THREE.Vector3().lerpVectors(a, b, t);
      p.y -= Math.sin(t * Math.PI) * 0.022;
      p.z += 0.012;
      pts.push(p);
    }
    E.cable(arm, pts, 0.005, m.hoseMat);
  }

  const elbow = new THREE.Mesh(new SphereGeometry(0.042, 14, 12), m.frameMat);
  elbow.position.copy(Aj.E);
  arm.add(elbow);
  const elbowRing = new THREE.Mesh(new TorusGeometry(0.042, 0.008, 8, 18), m.steelMat);
  elbowRing.position.copy(Aj.E);
  elbowRing.rotation.y = Math.PI / 2;
  arm.add(elbowRing);
  const wrist = new THREE.Mesh(new SphereGeometry(0.034, 14, 12), m.frameMat);
  wrist.position.copy(Aj.W);
  arm.add(wrist);

  const lamp = new THREE.Group();
  lamp.position.copy(Aj.W).add(new THREE.Vector3(0.018, -0.085, 0.020));
  arm.add(lamp);
  const hook = new THREE.Mesh(new TorusGeometry(0.026, 0.009, 8, 16), m.frameMat);
  hook.position.y = 0.070; lamp.add(hook);
  const stem = new THREE.Mesh(new CylinderGeometry(0.007, 0.007, 0.045, 8), m.frameMat);
  stem.position.y = 0.045; lamp.add(stem);
  for (const y of [0.026, -0.056]) {
    const ringL = new THREE.Mesh(new TorusGeometry(0.042, 0.009, 8, 20), m.frameMat);
    ringL.rotation.x = Math.PI / 2; ringL.position.y = y; lamp.add(ringL);
  }
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * 6.2832 + 0.78;
    const bar = new THREE.Mesh(new CylinderGeometry(0.006, 0.006, 0.088, 6), m.frameMat);
    bar.position.set(Math.cos(a) * 0.042, -0.015, Math.sin(a) * 0.042);
    lamp.add(bar);
  }
  const flame = new THREE.Mesh(new SphereGeometry(0.030, 16, 12), m.ledWhite);
  flame.position.y = -0.015; lamp.add(flame);
  const bulb = new THREE.PointLight('#ffb464', 0.20, 1.5, 2);
  bulb.position.y = -0.015; lamp.add(bulb);
  const lampGlass = new THREE.Mesh(new CylinderGeometry(0.044, 0.044, 0.082, 18, 1, true), m.glassMat);
  lampGlass.position.y = -0.015; lamp.add(lampGlass);
  const cap = new THREE.Mesh(new CylinderGeometry(0.050, 0.036, 0.014, 18), m.frameMat);
  cap.position.y = 0.058; lamp.add(cap);

  for (const sgn of [-1, 1]) {
    const f = new THREE.Mesh(new RoundedBoxGeometry(0.026, 0.070, 0.044, 2, 0.011), m.frameMat);
    f.position.copy(Aj.W).add(new THREE.Vector3(0.024 * sgn, -0.018, 0.016));
    f.rotation.z = -0.30 * sgn;
    arm.add(f);
    const pad = new THREE.Mesh(new BoxGeometry(0.008, 0.044, 0.030), m.rubberMat);
    pad.position.copy(Aj.W).add(new THREE.Vector3(0.010 * sgn, -0.045, 0.016));
    pad.rotation.z = -0.30 * sgn;
    arm.add(pad);
  }

  return { arm };
}
