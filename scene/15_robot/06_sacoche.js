// SACOCHE — element 06 du dossier 15_robot/. REFONTE 2 : le jerrican a un
// berceau, les sangles sont des tubes qui epousent la charge, boucles a
// cliquet, fixations reelles au plateau.
export function piece_sacoche(E) {
  const { THREE, m, canvasTex } = E;
  const { BoxGeometry, CylinderGeometry, TorusGeometry } = THREE;
  const { RoundedBoxGeometry } = E;

  const rack = new THREE.Group();
  rack.position.set(0, 0.30, -0.34);
  rack.rotation.x = 0.06;
  E.corps.body.add(rack);

  const boxTex = canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = '#c04a24'; g.fillRect(0, 0, w, h);
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, 'rgba(255,214,160,0.30)'); gr.addColorStop(0.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,20,8,0.4)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      g.fillStyle = 'rgba(40,22,10,' + (0.1 + Math.random() * 0.3).toFixed(2) + ')';
      g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 2 + Math.random() * 9, 1 + Math.random() * 5, Math.random() * 3, 0, 6.29); g.fill();
    }
    g.font = 'bold 56px Consolas, monospace';
    g.fillStyle = 'rgba(240,228,206,0.85)';
    g.fillText('OUT-1', w * 0.30, h * 0.58);
    g.font = 'bold 26px Consolas, monospace';
    g.fillStyle = 'rgba(240,228,206,0.6)';
    g.fillText('OUTILLAGE · Z-02', w * 0.24, h * 0.72);
  });
  const boxMat = new THREE.MeshStandardMaterial({ map: boxTex, roughness: 0.6, metalness: 0.05 });
  const toolbox = new THREE.Mesh(new RoundedBoxGeometry(0.40, 0.20, 0.20, 2, 0.015), boxMat);
  toolbox.position.set(-0.12, 0.10, 0);
  rack.add(toolbox);
  for (const dz of [-0.04, 0.04]) {
    const rib = new THREE.Mesh(new BoxGeometry(0.36, 0.012, 0.016), m.frameMat);
    rib.position.set(-0.12, 0.205, dz);
    rack.add(rib);
  }
  for (const dx of [-0.24, 0.0]) {
    const latch = new THREE.Mesh(new BoxGeometry(0.022, 0.035, 0.012), m.steelMat);
    latch.position.set(-0.12 + dx, 0.06, 0.103);
    rack.add(latch);
  }
  const grip = new THREE.Mesh(new TorusGeometry(0.030, 0.007, 6, 14, Math.PI), m.rubberMat);
  grip.position.set(-0.12, 0.21, 0);
  grip.rotation.z = Math.PI / 2;
  rack.add(grip);

  // Berceau du jerrican : rails + cale avant, le bidon ne flotte plus.
  const cradle = new THREE.Group();
  cradle.position.set(0.15, 0.012, -0.02);
  rack.add(cradle);
  const tray = new THREE.Mesh(new BoxGeometry(0.16, 0.010, 0.12), m.frameMat);
  tray.position.y = 0.005;
  cradle.add(tray);
  for (const sx of [-1, 1]) {
    const rail = new THREE.Mesh(new BoxGeometry(0.014, 0.036, 0.12), m.frameMat);
    rail.position.set(sx * 0.072, 0.022, 0);
    cradle.add(rail);
  }
  const stop = new THREE.Mesh(new BoxGeometry(0.16, 0.04, 0.012), m.frameMat);
  stop.position.set(0, 0.024, 0.056);
  cradle.add(stop);
  for (const sx of [-1, 1]) E.bolt(cradle, sx * 0.06, 0.012, -0.05, 'y', 0.006);

  const can = new THREE.Group();
  can.position.set(0.15, 0.12, -0.02);
  can.rotation.z = -0.03;
  rack.add(can);
  const canBody = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.20, 0.10, 2, 0.012), m.accentMat);
  can.add(canBody);
  for (let i = 0; i < 3; i++) {
    const ribc = new THREE.Mesh(new BoxGeometry(0.136, 0.010, 0.085), m.hullMat);
    ribc.position.y = -0.055 + i * 0.055;
    can.add(ribc);
  }
  const capC = new THREE.Mesh(new CylinderGeometry(0.020, 0.022, 0.018, 12), m.frameMat);
  capC.position.set(-0.04, 0.108, 0);
  can.add(capC);
  const handleC = new THREE.Mesh(new BoxGeometry(0.07, 0.014, 0.03), m.accentMat);
  handleC.position.set(0.03, 0.104, 0);
  can.add(handleC);

  // Sangle dediee du jerrican, boucle autour du bidon (pas une boite).
  {
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16 * Math.PI * 2;
      pts.push(new THREE.Vector3(0.15 + Math.cos(t) * 0.078, 0.11 + Math.sin(t) * 0.10, -0.02));
    }
    E.cable(rack, pts, 0.007, m.webbingMat);
  }

  const tube = new THREE.Group();
  tube.position.set(0, 0.22, 0.02);
  tube.rotation.z = Math.PI / 2;
  rack.add(tube);
  const blue = new THREE.Mesh(new CylinderGeometry(0.018, 0.018, 0.42, 12), m.steelMat);
  blue.material = new THREE.MeshStandardMaterial({ color: '#5a7d9a', roughness: 0.5, metalness: 0.1 });
  tube.add(blue);
  for (const dx of [-0.20, 0.20]) {
    const capT = new THREE.Mesh(new CylinderGeometry(0.021, 0.021, 0.016, 12), m.frameMat);
    capT.position.x = dx;
    tube.add(capT);
  }

  // Sangles qui EPHOUSENT caisse + tube : chemin Catmull, pas des parallelepipedes.
  const ratchet = (sx, zFront) => {
    const g = new THREE.Group();
    g.position.set(sx, 0.028, zFront);
    rack.add(g);
    const bodyB = new THREE.Mesh(new BoxGeometry(0.036, 0.028, 0.042), m.steelMat);
    g.add(bodyB);
    const drum = new THREE.Mesh(new CylinderGeometry(0.010, 0.010, 0.038, 10), m.frameMat);
    drum.rotation.z = Math.PI / 2;
    drum.position.y = 0.004;
    g.add(drum);
    const lever = new THREE.Mesh(new BoxGeometry(0.010, 0.008, 0.048), m.steelMat);
    lever.position.set(0, 0.012, 0.028);
    lever.rotation.x = -0.55;
    g.add(lever);
    const slot = new THREE.Mesh(new BoxGeometry(0.028, 0.006, 0.012), m.darkMat);
    slot.position.set(0, 0.016, -0.012);
    g.add(slot);
    return g;
  };

  const strapPath = (sx) => {
    const pts = [
      new THREE.Vector3(sx, 0.04, 0.12),
      new THREE.Vector3(sx, 0.12, 0.11),
      new THREE.Vector3(sx, 0.22, 0.04),
      new THREE.Vector3(sx, 0.255, 0.00),
      new THREE.Vector3(sx, 0.22, -0.08),
      new THREE.Vector3(sx, 0.10, -0.14),
      new THREE.Vector3(sx, 0.03, -0.16),
    ];
    E.cable(rack, pts, 0.008, m.webbingMat);
    ratchet(sx, 0.13);
    const anchor = new THREE.Mesh(new BoxGeometry(0.030, 0.016, 0.022), m.steelMat);
    anchor.position.set(sx, 0.018, -0.16);
    rack.add(anchor);
    E.bolt(rack, sx, 0.012, -0.16, 'y', 0.005);
  };
  strapPath(-0.06);
  strapPath(0.08);

  E.cable(E.corps.body, [
    new THREE.Vector3(-0.10, 0.42, -0.40),
    new THREE.Vector3(-0.12, 0.52, -0.38),
    new THREE.Vector3(-0.12, 0.62, -0.32),
    new THREE.Vector3(-0.10, 0.70, -0.22),
  ], 0.010, m.hoseMat);

  const hookS = new THREE.Mesh(new TorusGeometry(0.012, 0.004, 6, 12), m.steelMat);
  hookS.position.set(0.22, 0.20, 0.10);
  hookS.rotation.x = Math.PI / 2;
  rack.add(hookS);
  const oilCan = new THREE.Mesh(new CylinderGeometry(0.018, 0.022, 0.05, 12), m.frameMat);
  oilCan.position.set(0.22, 0.15, 0.10);
  rack.add(oilCan);
  const oilSpout = new THREE.Mesh(new CylinderGeometry(0.003, 0.003, 0.05, 6), m.brassMat);
  oilSpout.position.set(0.234, 0.185, 0.10);
  oilSpout.rotation.z = -0.7;
  rack.add(oilSpout);

  return { rack };
}
