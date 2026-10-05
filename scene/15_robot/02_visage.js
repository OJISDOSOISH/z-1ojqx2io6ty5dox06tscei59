// VISAGE — element 02 du dossier 15_robot/. REFONTE 2.
// Dalle legerement bombee, regard asymetrique (paupieres, sourcils), reflet
// de studio, cadre de protection qui ne traverse JAMAIS les pupilles.
export function piece_visage(E) {
  const { THREE, m, canvasTex } = E;
  const { BoxGeometry, CylinderGeometry, SphereGeometry } = THREE;
  const { OPEN, fz, TILT } = E.tete;

  function faceTex() {
    return canvasTex(1500, 900, (g, w, h) => {
      const bg = g.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0d1c25'); bg.addColorStop(0.5, '#081420'); bg.addColorStop(1, '#040b10');
      g.fillStyle = bg; g.fillRect(0, 0, w, h);

      for (let y = 0; y < h; y += 5) {
        g.fillStyle = 'rgba(140,205,230,0.045)';
        g.fillRect(0, y, w, 1.6);
      }
      const edge = (x0, y0, x1, y1) => {
        const gr = g.createLinearGradient(x0, y0, x1, y1);
        gr.addColorStop(0, 'rgba(0,0,0,0.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      };
      edge(0, 0, 0, h * 0.16); edge(0, h, 0, h * 0.84);
      edge(0, 0, w * 0.10, 0); edge(w, 0, w * 0.90, 0);

      const squircle = (cx, cy, rx, ry, n) => {
        g.beginPath();
        for (let i = 0; i <= 120; i++) {
          const a = i / 120 * 6.2831853;
          const c = Math.cos(a), si = Math.sin(a);
          g.lineTo(cx + Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * rx,
                   cy + Math.sign(si) * Math.pow(Math.abs(si), 2 / n) * ry);
        }
        g.closePath();
      };
      const eye = (cx, cy, rx, ry, lid) => {
        g.fillStyle = 'rgba(2,6,8,0.9)';
        squircle(cx, cy, rx * 1.22, ry * 1.22, 3.4); g.fill();
        g.save();
        g.shadowColor = 'rgba(176,224,102,0.75)'; g.shadowBlur = rx * 0.10;
        g.fillStyle = '#e4f2b4'; squircle(cx, cy, rx, ry, 3.4); g.fill();
        g.restore();
        const sc = g.createRadialGradient(cx - rx * 0.18, cy - ry * 0.22, rx * 0.08, cx, cy, rx * 1.05);
        sc.addColorStop(0, '#f0f8da'); sc.addColorStop(0.5, '#ddecb4');
        sc.addColorStop(0.82, '#bdd382'); sc.addColorStop(1, '#8fa85a');
        g.fillStyle = sc; squircle(cx, cy, rx, ry, 3.4); g.fill();
        g.save(); squircle(cx, cy, rx, ry, 3.4); g.clip();
        g.strokeStyle = 'rgba(96,118,58,0.25)'; g.lineWidth = 3;
        for (let k = 0; k < 26; k++) {
          const a = k / 26 * 6.283;
          g.beginPath();
          g.moveTo(cx + Math.cos(a) * rx * 0.42, cy + Math.sin(a) * ry * 0.42);
          g.lineTo(cx + Math.cos(a) * rx * 1.05, cy + Math.sin(a) * ry * 1.05);
          g.stroke();
        }
        g.restore();
        g.strokeStyle = 'rgba(34,48,18,0.9)'; g.lineWidth = rx * 0.07;
        squircle(cx, cy, rx, ry, 3.4); g.stroke();
        // paupiere : lid 0..1 (0 ouvert, 1 plus ferme)
        g.save(); squircle(cx, cy, rx, ry, 3.4); g.clip();
        const lidH = ry * (0.55 + lid * 0.55);
        const lg = g.createLinearGradient(0, cy - ry, 0, cy - ry + lidH);
        lg.addColorStop(0, 'rgba(8,14,9,0.92)'); lg.addColorStop(0.65, 'rgba(8,14,9,0.55)'); lg.addColorStop(1, 'rgba(8,14,9,0)');
        g.fillStyle = lg; g.fillRect(cx - rx * 1.2, cy - ry * 1.2, rx * 2.4, lidH + ry * 0.2);
        // paupiere basse legerement remontee a gauche
        if (lid > 0.35) {
          const lg2 = g.createLinearGradient(0, cy + ry, 0, cy + ry * 0.15);
          lg2.addColorStop(0, 'rgba(8,14,9,0.55)'); lg2.addColorStop(1, 'rgba(8,14,9,0)');
          g.fillStyle = lg2; g.fillRect(cx - rx * 1.2, cy + ry * 0.15, rx * 2.4, ry);
        }
        g.restore();
        const pr = rx * 0.56;
        const pg = g.createRadialGradient(cx - pr * 0.2, cy - pr * 0.25, pr * 0.1, cx, cy, pr);
        pg.addColorStop(0, '#131c24'); pg.addColorStop(0.7, '#050a0e'); pg.addColorStop(1, '#000000');
        g.fillStyle = pg; g.beginPath(); g.arc(cx, cy + ry * 0.04, pr, 0, 6.2832); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.98)';
        g.beginPath(); g.ellipse(cx - pr * 0.40, cy - pr * 0.46, pr * 0.22, pr * 0.17, -0.55, 0, 6.2832); g.fill();
        g.fillStyle = 'rgba(212,240,255,0.55)';
        g.beginPath(); g.ellipse(cx + pr * 0.44, cy + pr * 0.46, pr * 0.20, pr * 0.15, -0.5, 0, 6.2832); g.fill();
      };
      // Asymetrie volontaire : oeil gauche un peu plus petit et plus ferme, droit plus bas.
      eye(w * 0.295, h * 0.455, w * 0.108, h * 0.285, 0.55);
      eye(w * 0.705, h * 0.475, w * 0.118, h * 0.305, 0.18);

      // sourcils dessines (en plus des pieces 3D)
      g.strokeStyle = 'rgba(18, 28, 22, 0.85)';
      g.lineWidth = 18; g.lineCap = 'round';
      g.beginPath(); g.moveTo(w * 0.20, h * 0.22); g.quadraticCurveTo(w * 0.30, h * 0.14, w * 0.40, h * 0.20); g.stroke();
      g.lineWidth = 14;
      g.beginPath(); g.moveTo(w * 0.60, h * 0.16); g.quadraticCurveTo(w * 0.72, h * 0.10, w * 0.82, h * 0.18); g.stroke();

      const leds = [['#6ade8a', 'PWR'], ['#ffc65e', 'TEMP'], ['#ff7a5c', 'LOAD']];
      for (let i = 0; i < 3; i++) {
        const x = w * (0.055 + i * 0.075), y = h * 0.845;
        g.fillStyle = 'rgba(4,10,12,0.9)';
        g.beginPath(); g.arc(x, y, 22, 0, 6.29); g.fill();
        g.fillStyle = leds[i][0];
        g.shadowColor = leds[i][0]; g.shadowBlur = 16;
        g.beginPath(); g.arc(x, y, 13, 0, 6.29); g.fill();
        g.shadowBlur = 0;
        g.font = 'bold 20px Consolas, monospace';
        g.fillStyle = 'rgba(150,196,204,0.8)';
        g.fillText(leds[i][1], x + 32, y + 7);
      }
      g.font = 'bold 34px Consolas, monospace';
      g.fillStyle = 'rgba(146,196,204,0.55)';
      g.fillText('CAM 02 · Z-02 · REC', w * 0.60, h * 0.855);
      g.fillStyle = 'rgba(255,92,64,0.9)';
      g.beginPath(); g.arc(w * 0.955, h * 0.845, 11, 0, 6.29); g.fill();
    });
  }

  const bay = new THREE.Group();
  bay.position.set(0, (OPEN.y0 + OPEN.y1) / 2 - 0.015, fz - 0.045);
  bay.rotation.x = TILT || -0.14;
  E.tete.head.add(bay);

  const bw = OPEN.w, bh = OPEN.y1 - OPEN.y0;
  const recess = new THREE.Mesh(new BoxGeometry(bw + 0.07, bh + 0.07, 0.055), m.darkMat);
  recess.position.z = -0.030;
  bay.add(recess);

  const bulge = (geo, amt) => {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const u = x / (bw * 0.47), v = y / (bh * 0.46);
      const r2 = Math.min(1, u * u + v * v);
      pos.setZ(i, amt * (1 - r2));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  };

  const visorGeo = new THREE.PlaneGeometry(bw * 0.92, bh * 0.88, 18, 12);
  bulge(visorGeo, 0.022);
  const visor = new THREE.Mesh(visorGeo, new THREE.MeshBasicMaterial({ map: faceTex() }));
  visor.position.z = 0.002;
  bay.add(visor);

  const rec = new THREE.Mesh(new SphereGeometry(0.006, 8, 8), m.ledRed);
  rec.position.set(bw * 0.42, -bh * 0.38, 0.018);
  bay.add(rec);

  const glassGeo = new THREE.PlaneGeometry(bw * 0.96, bh * 0.93, 18, 12);
  bulge(glassGeo, 0.026);
  const glass = new THREE.Mesh(glassGeo, m.glassMat);
  glass.position.z = 0.016;
  bay.add(glass);

  // Reflet de dalle : bande diagonale, additive, ne barre pas les pupilles
  const streak = new THREE.Mesh(
    new THREE.PlaneGeometry(bw * 0.22, bh * 0.85),
    new THREE.MeshBasicMaterial({ color: '#d8f0ff', transparent: true, opacity: 0.10, depthWrite: false })
  );
  streak.position.set(-bw * 0.28, 0.01, 0.020);
  streak.rotation.z = -0.18;
  bay.add(streak);

  // Cadre de protection : uniquement le peri — rien devant les globes.
  const frameT = 0.018;
  const zG = 0.032;
  const topBar = new THREE.Mesh(new BoxGeometry(bw + 0.03, frameT, 0.016), m.frameMat);
  topBar.position.set(0, bh * 0.50, zG);
  bay.add(topBar);
  const botBar = new THREE.Mesh(new BoxGeometry(bw + 0.03, frameT, 0.016), m.frameMat);
  botBar.position.set(0, -bh * 0.50, zG);
  bay.add(botBar);
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(new BoxGeometry(frameT, bh + 0.03, 0.016), m.frameMat);
    post.position.set(s * (bw * 0.50), 0, zG);
    bay.add(post);
  }
  // coins boulonnes, toujours hors pupilles
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    E.bolt(bay, sx * bw * 0.50, sy * bh * 0.50, zG, 'z', 0.008);
  }
  // arceaux d'angle (cage) — ils contournent, ils ne coupent pas
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const guard = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.0045, 6, 10, 1.6), m.steelMat);
    guard.position.set(sx * (bw * 0.42), sy * (bh * 0.40), zG + 0.006);
    guard.rotation.z = (sx > 0 ? -1 : 1) * (sy > 0 ? 0.2 : 2.9);
    bay.add(guard);
  }

  // Sourcils 3D, asymetriques, poses sur la casquette / le haut de baie
  const browL = new THREE.Mesh(new E.RoundedBoxGeometry(0.12, 0.016, 0.022, 2, 0.006), m.darkMat);
  browL.position.set(-0.09, bh * 0.42, 0.028);
  browL.rotation.z = 0.18;
  bay.add(browL);
  const browR = new THREE.Mesh(new E.RoundedBoxGeometry(0.13, 0.014, 0.022, 2, 0.006), m.darkMat);
  browR.position.set(0.10, bh * 0.48, 0.028);
  browR.rotation.z = -0.08;
  bay.add(browR);

  const faceLight = new THREE.PointLight('#8fe0f0', 0.32, 0.8, 2);
  faceLight.position.set(0, (OPEN.y0 + OPEN.y1) / 2 - 0.015, fz + 0.22);
  E.tete.head.add(faceLight);

  return { visor, glass, faceLight };
}
