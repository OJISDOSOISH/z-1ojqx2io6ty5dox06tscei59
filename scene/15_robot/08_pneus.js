// PNEUS — element 08 du dossier 15_robot/.
// La sculpture des pneus est le travail de l'utilisateur : elle est integree
// SANS AUCUNE MODIFICATION (bloc entre les marqueurs DEBUT/FIN ci-dessous).
// Seule change sa residence : avant, page de demo autonome ; ici, element du
// robot monte sur E.ROBOT. La machinerie de la demo (HUD, orbite, studio,
// layout 1-4 roues, boucle d'animation) reste dans la page de demo et ne fait
// pas partie de l'element : dans la scene, le robot est statue.
export function piece_pneus(E) {
  const { THREE } = E;
  const ROBOT = E.ROBOT;

  /* ╔═════════════ DEBUT DU BLOC PNEUS — CODE UTILISATEUR, NON MODIFIÉ ═════════════╗ */

  const R_OUT  = 0.252;
  const R_BASE = 0.236;
  const R_RIM  = 0.146;
  const HALF_W = 0.0925;

  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi),
          c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  const pnoise = (u, k, yv) =>
    vnoise(u * k, yv) * (1 - u) + vnoise((u - 1) * k, yv) * u;

  /* bruit de caoutchouc : canvas unique, deux échelles */
  const noiseCanvas = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#a8a8a8';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 110; i++) {
      const v = (120 + Math.random() * 100) | 0;
      g.fillStyle = `rgba(${v},${v},${v},0.35)`;
      const x = Math.random() * 256, y = Math.random() * 256,
            rr = 3 + Math.random() * 16;
      for (const dx of [0, -256])
        for (const dy of [0, -256]) {
          g.beginPath();
          g.arc(x + dx, y + dy, rr, 0, 7);
          g.fill();
        }
    }
    const d = g.getImageData(0, 0, 256, 256);
    for (let i = 0; i < d.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 44;
      d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n;
    }
    g.putImageData(d, 0, 0);
    return c;
  })();
  function makeNoise(rx, ry) {
    const t = new THREE.CanvasTexture(noiseCanvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    return t;
  }
  const noiseTex      = makeNoise(9, 3);    // usure large (flanc, moteur)
  const treadGrainTex = makeNoise(48, 4);   // grain fin (bande)

  /* lamelles : entailles ondulées traversant chaque pavé */
  function sipeTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#c9c9c9';
    g.fillRect(0, 0, 256, 128);
    g.strokeStyle = '#1e1e1e';
    g.lineWidth = 2.5;
    for (let i = 0; i < 8; i++) {
      const x = i * 32 + 16;
      g.beginPath();
      g.moveTo(x, -6);
      for (let y = 0; y <= 134; y += 11)
        g.lineTo(x + Math.sin(y / 128 * Math.PI * 2.5 + i * 1.7) * 4, y);
      g.stroke();
    }
    const d = g.getImageData(0, 0, 256, 128);
    for (let i = 0; i < d.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 34;
      d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n;
    }
    g.putImageData(d, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(22, 1);                    // une tuile par chevron
    t.anisotropy = 16;
    return t;
  }
  const sipeTex = sipeTexture();

  const sideCanvas = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#b0b0b0';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 130; i++) {
      const v = (150 + Math.random() * 90) | 0;
      g.fillStyle = `rgba(${v},${v},${v},0.3)`;
      const x = Math.random() * 512, y = Math.random() * 512,
            rr = 2 + Math.random() * 9;
      for (const dx of [0, -512])
        for (const dy of [0, -512]) {
          g.beginPath();
          g.arc(x + dx, y + dy, rr, 0, 7);
          g.fill();
        }
    }
    g.fillStyle = 'rgba(60,60,60,0.55)';
    for (let x = 0; x < 512; x += 10)
      g.fillRect(x, 25, 3, 103);
    const d = g.getImageData(0, 0, 512, 512);
    for (let i = 0; i < d.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 60;
      d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n;
    }
    g.putImageData(d, 0, 0);
    return c;
  })();
  function sideGrain(vFlip) {
    const t = new THREE.CanvasTexture(sideCanvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(24, vFlip ? -1 : 1);
    t.anisotropy = 16;
    return t;
  }

  const labelCanvas = (() => {
    const W = 4096, H = 96;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#1c1c1f';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#6a665c';
    g.fillRect(0, 3, W, 2);
    g.fillRect(0, H - 5, W, 2);
    const b1 = 'Z·ROBOT    OFF·ROAD';
    const b2 = '10×2.50 · HEAVY DUTY · TUBELESS';
    g.font = 'bold 34px Arial'; const w1 = g.measureText(b1).width;
    g.font = 'bold 22px Arial'; const w2 = g.measureText(b2).width;
    const block = Math.max(w1, w2) * 1.28;
    const n = Math.max(1, Math.floor(W / block));
    g.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const x0 = (W - n * block) / 2 + i * block;
      g.font = 'bold 34px Arial';
      g.fillStyle = '#a9a294';
      g.fillText(b1, x0 + (block - w1) / 2, 30);
      g.font = 'bold 22px Arial';
      g.fillStyle = '#877f72';
      g.fillText(b2, x0 + (block - w2) / 2, 67);
    }
    for (let i = 0; i < 340; i++) {
      g.fillStyle = `rgba(28,28,31,${0.25 + Math.random() * 0.35})`;
      g.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 6, 1 + Math.random() * 2);
    }
    return c;
  })();
  function labelTexture(mirror) {
    const t = new THREE.CanvasTexture(labelCanvas);
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = 16;
    if (mirror) t.repeat.x = -1;
    if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* matériaux */
  const treadMat = new THREE.MeshPhysicalMaterial({
    color: 0x151517, roughness: 0.93, metalness: 0,
    vertexColors: true,
    sheen: 0.35, sheenRoughness: 0.55, sheenColor: new THREE.Color(0x55524b),
    bumpMap: sipeTex, bumpScale: 0.0022, roughnessMap: treadGrainTex,
    envMapIntensity: 0.3,
  });
  const grainA = sideGrain(false), grainB = sideGrain(true);
  const sidewallMat  = new THREE.MeshStandardMaterial({
    color: 0x1c1c1f, roughness: 0.78, metalness: 0,
    bumpMap: grainA, bumpScale: 0.0015, roughnessMap: grainA,
    envMapIntensity: 0.2,
  });
  const sidewallMatM = new THREE.MeshStandardMaterial({
    color: 0x1c1c1f, roughness: 0.78, metalness: 0,
    bumpMap: grainB, bumpScale: 0.0015, roughnessMap: grainB,
    envMapIntensity: 0.2,
  });
  const rimMat   = new THREE.MeshStandardMaterial({ color: 0x2e3136, roughness: 0.4,
                                                    metalness: 0.9, side: THREE.DoubleSide });
  const spokeMat = new THREE.MeshStandardMaterial({ color: 0x666a72, roughness: 0.25, metalness: 1 });
  const motorMat = new THREE.MeshStandardMaterial({
    color: 0x232529, roughness: 0.5, metalness: 0.7,
    roughnessMap: noiseTex, bumpMap: noiseTex, bumpScale: 0.0006,
  });
  const valveMat = new THREE.MeshStandardMaterial({ color: 0x232326, roughness: 0.9, metalness: 0.1 });
  const texA = labelTexture(false), texB = labelTexture(true);
  const labelMatA = new THREE.MeshStandardMaterial(
    { map: texA, bumpMap: texA, bumpScale: 0.0008, roughness: 0.7 });
  const labelMatB = new THREE.MeshStandardMaterial(
    { map: texB, bumpMap: texB, bumpScale: 0.0008, roughness: 0.7 });
  spokeMat.envMapIntensity    = 1.0;
  rimMat.envMapIntensity      = 0.7;

  /* flanc (128 segments, profil inchangé) */
  const FLANK = [
    [0.2342, 0.058],
    [0.233,  0.062],
    [0.2360, 0.067],
    [0.231,  0.072],
    [0.2295, 0.076],
    [0.233,  0.079],
    [0.228,  0.085],
    [0.2205, HALF_W],
    [0.218,  HALF_W],
    [0.190,  HALF_W],
    [0.187,  HALF_W * 0.997],
    [0.1845, 0.0905],
    [0.1885, 0.0855],
    [0.1845, 0.0815],
    [0.172,  0.0805],
    [0.163,  0.0785],
    [0.150,  0.0745],
    [R_RIM,  0.068],
  ];
  const flankGeo  = new THREE.LatheGeometry(FLANK.map(p => new THREE.Vector2(p[0], p[1])), 128);
  const flankGeoM = new THREE.LatheGeometry(
    FLANK.slice().reverse().map(p => new THREE.Vector2(p[0], -p[1])), 128);

  const letterGeoA = new THREE.LatheGeometry([
    new THREE.Vector2(0.216,  HALF_W + 0.0015),
    new THREE.Vector2(0.192,  HALF_W + 0.0015)], 128);
  const letterGeoB = new THREE.LatheGeometry([
    new THREE.Vector2(0.192, -HALF_W - 0.0015),
    new THREE.Vector2(0.216, -HALF_W - 0.0015)], 128);

  /* ══ SCULPTURE : maille fine + micro-relief + témoins d'usure ══ */
  const treadGeo = (() => {
    const NA = 1280, NW = 200;         // maille ≈ 1,2 mm × 0,6 mm
    const Yw = 0.058;
    const D  = 0.014;
    const Nc = 22;
    const ARC = 2 * Math.PI * 0.244;
    const PITCH = ARC / Nc;

    const gro = (g, half, w) => {
      const a = Math.abs(g);
      return a <= half ? 0 : THREE.MathUtils.smoothstep(a - half, 0, w);
    };

    const pos = [], uv = [], col = [], idx = [];
    for (let j = 0; j <= NW; j++) {
      const y  = -Yw + 2 * Yw * (j / NW);
      const ay = Math.abs(y);
      const r0 = R_BASE
        + 0.002 * Math.max(0, 1 - (y / 0.048) ** 2)
        - Math.max(0, ay - 0.048) * 0.2;

      for (let i = 0; i <= NA; i++) {
        const u  = i / NA;
        const th = u * Math.PI * 2;

        const wear = 0.88 + 0.12 * pnoise(u, 15, y * 15);
        const skew = 0.7 * (y / 0.046) ** 2 + 0.1 * (y / 0.058);

        const phi = u * Nc - skew;
        const fr  = phi - Math.floor(phi);
        const gChev = Math.min(fr, 1 - fr) * PITCH;
        const hw = 0.0045 + 0.0015 * (ay / Yw)
                 + 0.0006 * (pnoise(u, 80, y * 90) - 0.5);
        const fChev = gro(gChev, hw, 0.0022);

        const fRing = gro(Math.abs(ay - 0.026), 0.0032, 0.0022);

        const wn  = THREE.MathUtils.smoothstep(ay, 0.030, 0.038);
        const phn = u * 2 * Nc - 0.5 - skew * 0.5;
        const frn = phn - Math.floor(phn);
        const gN  = Math.min(frn, 1 - frn) * (PITCH / 2);
        const mixN = 1 - wn * 0.55 * (1 - gro(gN, 0.0024, 0.0018));

        const fe = 1 - THREE.MathUtils.smoothstep(ay, 0.052, 0.0572);

        let d = D * wear * fe * Math.min(fChev, fRing, mixN);

        // micro-relief : les pavés ne sont plus parfaitement plans
        d += 0.00022 * (pnoise(u, 280, y * 160) - 0.5)
             * THREE.MathUtils.smoothstep(d, 0, 0.0008);

        // témoins d'usure (TWI) : barrettes au fond des rainures
        const gT  = Math.abs(u * 6 - Math.round(u * 6)) / 6 * ARC;
        const dTw = 0.3 * D * (1 - THREE.MathUtils.smoothstep(gT, 0.0020, 0.0035)) * fe;
        if (dTw > d) d = dTw;

        const r = r0 + d;
        pos.push(r * Math.sin(th), y, r * Math.cos(th));
        uv.push(u, j / NW);

        const shade = 0.45 + 0.55 * (d / D);
        const dust  = pnoise(u, 18, y * 30);
        col.push(shade * (0.95 + 0.10 * dust),
                 shade * (0.95 + 0.02 * dust),
                 shade * (0.95 - 0.06 * dust));
      }
    }
    for (let j = 0; j < NW; j++)
      for (let i = 0; i < NA; i++) {
        const a = j * (NA + 1) + i, b = a + 1, c = a + NA + 1, dd = c + 1;
        idx.push(a, b, c, b, dd, c);
      }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv',       new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const n = g.attributes.normal;
    for (let j = 0; j <= NW; j++) {
      const a = j * (NA + 1), b = a + NA;
      n.setXYZ(b, n.getX(a), n.getY(a), n.getZ(a));
    }
    return g;
  })();

  /* ══ JANTE OUVERTE (inchangée) ══ */
  function buildHub() {
    const hub = new THREE.Group();

    hub.add(new THREE.Mesh(
      new THREE.CylinderGeometry(R_RIM - 0.002, R_RIM - 0.002, HALF_W * 2 - 0.02, 32, 1, true),
      rimMat));

    const motor = new THREE.Group();
    motor.add(new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.090, 24), motorMat));
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2 + Math.PI / 24;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.060, 0.024), spokeMat);
      fin.position.set(Math.cos(a) * 0.070, 0, Math.sin(a) * 0.070);
      fin.rotation.y = Math.PI / 2 - a;
      motor.add(fin);
    }
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.008, 24), rimMat);
    flange.position.y = 0.049;
    motor.add(flange);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.010, 6), spokeMat);
      bolt.position.set(Math.cos(a) * 0.048, 0.053, Math.sin(a) * 0.048);
      motor.add(bolt);
    }
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.014, 0.030), valveMat);
    plug.position.set(0, -0.052, 0.040);
    motor.add(plug);
    hub.add(motor);

    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.085, 0.062), spokeMat);
      arm.position.set(Math.cos(a) * 0.115, 0, Math.sin(a) * 0.115);
      arm.rotation.y = Math.PI / 2 - a;
      hub.add(arm);
    }

    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      const stub = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 0.050), spokeMat);
      stub.position.set(Math.cos(a) * 0.062, 0.052, Math.sin(a) * 0.062);
      stub.rotation.y = Math.PI / 2 - a;
      hub.add(stub);
    }

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.040, 0.036, 24), rimMat);
    cap.position.y = 0.062;
    hub.add(cap);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.014, 6), spokeMat);
    nut.position.y = 0.082;
    hub.add(nut);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 + Math.PI / 5;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.012, 6), spokeMat);
      bolt.position.set(Math.cos(a) * 0.023, 0.080, Math.sin(a) * 0.023);
      hub.add(bolt);
    }

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.006, 8, 40), spokeMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.047;
    hub.add(ring);
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI * 2 + Math.PI / 10;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.010, 6), spokeMat);
      bolt.position.set(Math.cos(a) * 0.134, 0.050, Math.sin(a) * 0.134);
      hub.add(bolt);
    }

    const valve = new THREE.Group();
    valve.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.026, 10), valveMat));
    const vcap = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.010, 10), spokeMat);
    vcap.position.y = 0.017;
    valve.add(vcap);
    valve.position.set(0, 0.064, 0.132);
    valve.rotation.x = Math.PI / 2 - 0.3;
    hub.add(valve);

    return hub;
  }
  const HUB = buildHub();

  function buildWheel(side) {
    const w = new THREE.Group();
    const tire = new THREE.Group();
    tire.rotation.z = -side * Math.PI / 2;
    w.add(tire);
    tire.add(new THREE.Mesh(flankGeo,   sidewallMat));
    tire.add(new THREE.Mesh(flankGeoM,  sidewallMatM));
    tire.add(new THREE.Mesh(treadGeo,   treadMat));
    tire.add(new THREE.Mesh(letterGeoA, labelMatA));
    tire.add(new THREE.Mesh(letterGeoB, labelMatB));
    tire.add(HUB.clone());
    tire.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return w;
  }

  const wheels = [];
  for (const s of [-1, 1]) {
    for (const zc of [-1, 1]) {
      const w = buildWheel(s);
      w.position.set(0.375 * s, 0.252, 0.205 * zc);
      ROBOT.add(w);
      wheels.push(w);
    }
  }

  /* ╚═════════════ FIN DU BLOC PNEUS — CODE UTILISATEUR, NON MODIFIÉ ══════════════╝ */

  return { wheels };
}
