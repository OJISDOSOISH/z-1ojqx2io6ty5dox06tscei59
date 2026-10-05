// MATIERES DU ROBOT — element 00 du dossier 15_robot/. REFONTE 2.
// Le degradé vertical uniforme a ete vire : la tole est un jaune de chantier
// mottled, l'usure geometrique (aretes, boue, sous-faces) passe par vertex
// colors. Les coulures et eclats restent peints, mais ils naissent des vis
// et des bords, pas d'un filtre plein cadre.
export function piece_matieres(E) {
  const { THREE, canvasTex, rr, clamp01, P } = E;

  const grimeCanvas = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#a6a2a0';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 130; i++) {
      const v = (120 + Math.random() * 110) | 0;
      g.fillStyle = 'rgba(' + v + ',' + (v - 6) + ',' + (v - 10) + ',0.32)';
      const x = Math.random() * 512, y = Math.random() * 512, r2 = 3 + Math.random() * 18;
      for (const dx of [0, -512]) for (const dy of [0, -512]) {
        g.beginPath(); g.arc(x + dx, y + dy, r2, 0, 7); g.fill();
      }
    }
    const d = g.getImageData(0, 0, 512, 512);
    for (let i = 0; i < d.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 48;
      d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n;
    }
    g.putImageData(d, 0, 0);
    return c;
  })();
  function grime(rx, ry, vFlip) {
    const t = new THREE.CanvasTexture(grimeCanvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, vFlip ? -ry : ry);
    return t;
  }

  function hazardTex() {
    return canvasTex(512, 128, (g, w, h) => {
      g.fillStyle = '#1c1a18'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#c2410c';
      const per = 64;
      for (let x = -per; x < w + per; x += per) {
        g.beginPath();
        g.moveTo(x, h); g.lineTo(x + per * 0.5, h);
        g.lineTo(x + per * 0.5 + h, 0); g.lineTo(x + h, 0);
        g.closePath(); g.fill();
      }
      for (let i = 0; i < 240; i++) {
        const x = Math.random() * w, y = Math.random() * h, r2 = 0.6 + Math.random() * 2.2;
        g.fillStyle = Math.random() < 0.5 ? 'rgba(214,206,192,0.5)' : 'rgba(30,26,22,0.5)';
        g.beginPath(); g.arc(x, y, r2, 0, 6.29); g.fill();
      }
      const d = g.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 30;
        d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n;
      }
      g.putImageData(d, 0, 0);
    });
  }

  function hullTex() {
    return canvasTex(2048, 2048, (g, w, h) => {
      g.fillStyle = P.orange;
      g.fillRect(0, 0, w, h);
      // mottling : variation locale, PAS un degradé cadre
      const d = g.getImageData(0, 0, w, h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const n = Math.sin(x * 0.021) * Math.sin(y * 0.017) * 10
                  + (Math.random() - 0.5) * 14;
          d.data[i]     = clamp01((d.data[i]     + n + 8) / 255) * 255;
          d.data[i + 1] = clamp01((d.data[i + 1] + n * 0.7) / 255) * 255;
          d.data[i + 2] = clamp01((d.data[i + 2] + n * 0.35 - 6) / 255) * 255;
        }
      }
      g.putImageData(d, 0, 0);

      // lignes de panneaux : ombre + lumiere
      for (const y of [0.28, 0.55, 0.78]) {
        g.fillStyle = 'rgba(58,38,16,0.72)'; g.fillRect(0, y * h, w, 5);
        g.fillStyle = 'rgba(255,224,160,0.42)'; g.fillRect(0, y * h + 5, w, 2);
      }
      g.fillStyle = 'rgba(58,38,16,0.55)'; g.fillRect(w * 0.50, 0, 5, h);
      g.fillStyle = 'rgba(255,224,160,0.35)'; g.fillRect(w * 0.50 + 5, 0, 2, h);
      g.fillStyle = 'rgba(58,38,16,0.4)'; g.fillRect(w * 0.22, 0, 3, h);
      g.fillStyle = 'rgba(58,38,16,0.4)'; g.fillRect(w * 0.78, 0, 3, h);

      const screws = [
        [0.06, 0.08], [0.28, 0.08], [0.50, 0.08], [0.72, 0.08], [0.94, 0.08],
        [0.06, 0.28], [0.94, 0.28], [0.06, 0.55], [0.94, 0.55],
        [0.06, 0.78], [0.28, 0.78], [0.72, 0.78], [0.94, 0.78],
        [0.06, 0.93], [0.50, 0.93], [0.94, 0.93],
      ];
      for (const [px, py] of screws) {
        const x = px * w, y = py * h;
        g.fillStyle = 'rgba(48,34,16,0.85)'; g.beginPath(); g.arc(x, y, 8, 0, 6.29); g.fill();
        g.strokeStyle = 'rgba(20,14,8,0.9)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x - 4, y - 4); g.lineTo(x + 4, y + 4);
        g.moveTo(x + 4, y - 4); g.lineTo(x - 4, y + 4); g.stroke();
        g.strokeStyle = 'rgba(255,226,166,0.55)'; g.lineWidth = 1.5;
        g.beginPath(); g.arc(x, y, 8, 0, 6.29); g.stroke();
      }

      // coulures depuis les vis, pas depuis un bandeau
      for (const [bx, by] of screws) {
        if (Math.random() > 0.55) continue;
        const x0 = bx * w, y0 = by * h + 10;
        const n = 1 + (Math.random() * 2) | 0;
        for (let k = 0; k < n; k++) {
          const len = rr(h * 0.04, h * 0.16), xo = rr(-5, 5), wd = rr(2, 6);
          const cg = g.createLinearGradient(0, y0, 0, y0 + len);
          cg.addColorStop(0, 'rgba(28,22,14,' + rr(0.35, 0.55).toFixed(3) + ')');
          cg.addColorStop(1, 'rgba(28,22,14,0)');
          g.fillStyle = cg; g.fillRect(x0 + xo, y0, wd, len);
        }
      }

      // ecaillage : plus dense pres des bords UV, forme irreguliere
      for (let i = 0; i < 45; i++) {
        const edge = Math.random() < 0.85;
        const x = edge ? (Math.random() < 0.5 ? rr(0, w * 0.08) : rr(w * 0.92, w)) : rr(0, w);
        const y = edge ? (Math.random() < 0.5 ? rr(0, h * 0.1) : rr(h * 0.82, h)) : rr(0, h);
        const r2 = rr(1.5, 5.5);
        g.fillStyle = 'rgba(52,40,28,0.75)'; g.beginPath(); g.ellipse(x, y, r2 * 1.3, r2, rr(0, 3), 0, 6.29); g.fill();
        g.fillStyle = 'rgba(138,132,122,0.92)'; g.beginPath(); g.ellipse(x, y, r2, r2 * 0.72, rr(0, 3), 0, 6.29); g.fill();
        g.fillStyle = 'rgba(168,160,148,0.7)'; g.beginPath(); g.ellipse(x - r2 * 0.2, y - r2 * 0.2, r2 * 0.5, r2 * 0.35, 0, 0, 6.29); g.fill();
      }

      // eclaboussures de boue : blobs + trainées, bas de toile seulement
      for (let i = 0; i < 18; i++) {
        const x = rr(0, w), y = rr(h * 0.78, h), r2 = rr(6, 22);
        g.fillStyle = 'rgba(62,44,24,' + rr(0.08, 0.20).toFixed(3) + ')';
        g.beginPath(); g.ellipse(x, y, r2, r2 * rr(0.4, 0.9), rr(0, 3), 0, 6.29); g.fill();
      }
      for (let i = 0; i < 25; i++) {
        const x = rr(0, w), y = rr(h * 0.55, h * 0.92);
        g.fillStyle = 'rgba(48,34,20,' + rr(0.12, 0.3).toFixed(3) + ')';
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + rr(-18, 18), y + rr(20, 80), x + rr(-8, 8), y + rr(40, 120));
        g.lineWidth = rr(3, 9);
        g.strokeStyle = g.fillStyle;
        g.stroke();
      }

      // rouille localisee sous quelques vis
      for (const [bx, by] of screws) {
        if (Math.random() > 0.4) continue;
        const x = bx * w + rr(-6, 6), y = by * h + rr(6, 18);
        g.fillStyle = 'rgba(122,58,26,' + rr(0.2, 0.45).toFixed(3) + ')';
        g.beginPath(); g.ellipse(x, y, rr(6, 16), rr(10, 28), 0.2, 0, 6.29); g.fill();
      }

      // macaron
      {
        const cx = w * 0.62, cy = h * 0.155, r2 = w * 0.055;
        g.fillStyle = 'rgba(238,230,212,0.92)';
        g.beginPath(); g.arc(cx, cy, r2, 0, 6.29); g.fill();
        g.lineWidth = r2 * 0.16; g.strokeStyle = 'rgba(28,24,20,0.8)';
        g.beginPath(); g.arc(cx, cy, r2 * 0.92, 0, 6.29); g.stroke();
        g.font = 'bold ' + (r2 * 1.05) + 'px Consolas, monospace';
        g.fillStyle = 'rgba(28,24,20,0.85)';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('02', cx, cy + r2 * 0.05);
        g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      }
      {
        const bx = w * 0.70, by = h * 0.415;
        g.fillStyle = 'rgba(226,222,212,0.85)'; g.fillRect(bx, by, w * 0.16, h * 0.035);
        let x = bx + 8;
        while (x < bx + w * 0.16 - 8) {
          const bw2 = 1 + Math.random() * 4;
          g.fillStyle = 'rgba(24,22,20,0.9)';
          g.fillRect(x, by + 5, bw2, h * 0.035 - 10);
          x += bw2 + 1 + Math.random() * 3;
        }
      }
      g.font = 'bold 110px Consolas, monospace';
      g.fillStyle = 'rgba(28,24,20,0.75)'; g.fillText('Z-02', w * 0.10, h * 0.60);
      g.fillStyle = 'rgba(255,230,180,0.16)'; g.fillText('Z-02', w * 0.10 + 3, h * 0.60 + 3);
      g.font = 'bold 52px Consolas, monospace';
      g.fillStyle = 'rgba(28,24,20,0.65)'; g.fillText('CHANTIER NORD', w * 0.10, h * 0.655);
      g.strokeStyle = 'rgba(28,24,20,0.8)'; g.lineWidth = 6;
      g.beginPath(); g.moveTo(w * 0.78, h * 0.52); g.lineTo(w * 0.82, h * 0.595); g.lineTo(w * 0.74, h * 0.595);
      g.closePath(); g.stroke();
      g.fillStyle = 'rgba(28,24,20,0.8)'; g.fillRect(w * 0.796, h * 0.545, 8, 22);
      g.fillRect(w * 0.796, h * 0.575, 8, 8);
    });
  }

  function plainTex() {
    return canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = P.orange;
      g.fillRect(0, 0, w, h);
      const d = g.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 22;
        d.data[i] += n + 6; d.data[i + 1] += n; d.data[i + 2] += n - 4;
      }
      g.putImageData(d, 0, 0);
      for (let i = 0; i < 4; i++) {
        g.fillStyle = 'rgba(58,38,16,0.32)'; g.fillRect(0, (i + 1) * h / 5, w, 2);
      }
      for (let i = 0; i < 40; i++) {
        g.fillStyle = 'rgba(62,44,24,0.18)';
        g.beginPath(); g.arc(Math.random() * w, h * 0.55 + Math.random() * h * 0.45, 2 + Math.random() * 10, 0, 6.29); g.fill();
      }
    });
  }

  function frameTex() {
    return canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#262a2e'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 160; i++) {
        const y = Math.random() * h;
        g.strokeStyle = 'rgba(' + (110 + Math.random() * 60 | 0) + ',' + (116 + Math.random() * 60 | 0) + ',124,' + (0.05 + Math.random() * 0.12).toFixed(3) + ')';
        g.lineWidth = 0.6 + Math.random() * 1.6;
        g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + rr(-3, 3)); g.stroke();
      }
      for (let i = 0; i < 50; i++) {
        g.fillStyle = 'rgba(96,64,34,' + rr(0.1, 0.3).toFixed(3) + ')';
        g.beginPath(); g.ellipse(rr(0, w), rr(0, h), rr(2, 10), rr(1, 5), rr(0, 3), 0, 6.29); g.fill();
      }
    });
  }

  function plateTex() {
    return canvasTex(512, 160, (g, w, h) => {
      g.fillStyle = '#d8d2c4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1c1a18'; g.fillRect(8, 8, w - 16, h - 16);
      g.fillStyle = '#d8d2c4'; g.fillRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#1c1a18';
      g.font = 'bold 72px Consolas, monospace';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('Z-02', w * 0.5, h * 0.42);
      g.font = 'bold 28px Consolas, monospace';
      g.fillText('CHANTIER NORD', w * 0.5, h * 0.78);
    });
  }

  function webbingTex() {
    return canvasTex(64, 256, (g, w, h) => {
      g.fillStyle = '#c4a574'; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(40,28,14,0.25)';
      for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 3);
      g.fillStyle = 'rgba(255,230,190,0.2)';
      g.fillRect(4, 0, 3, h); g.fillRect(w - 7, 0, 3, h);
    });
  }

  const hullMat = new THREE.MeshPhysicalMaterial({
    map: hullTex(), roughness: 0.68, metalness: 0.12,
    clearcoat: 0.05, clearcoatRoughness: 0.7,
    bumpMap: grime(3, 3), bumpScale: 0.0012,
    roughnessMap: grime(5, 5), envMapIntensity: 0.5,
    vertexColors: true,
  });
  const frameMat = new THREE.MeshStandardMaterial({
    map: frameTex(), roughness: 0.62, metalness: 0.82,
    roughnessMap: grime(4, 4), bumpMap: grime(6, 6), bumpScale: 0.0009,
    envMapIntensity: 0.6,
  });
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: '#c2410c', roughness: 0.42, metalness: 0.15,
    clearcoat: 0.5, clearcoatRoughness: 0.3, envMapIntensity: 0.5,
  });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#181c20', roughness: 0.6, metalness: 0.4 });
  const steelMat = new THREE.MeshStandardMaterial({ color: '#9aa1a8', roughness: 0.3, metalness: 0.9, envMapIntensity: 1.0 });
  const brassMat = new THREE.MeshStandardMaterial({ color: '#b08d4a', roughness: 0.36, metalness: 0.8 });
  const hullPlainMat = new THREE.MeshPhysicalMaterial({
    map: plainTex(), roughness: 0.68, metalness: 0.12,
    clearcoat: 0.05, clearcoatRoughness: 0.7,
    bumpMap: grime(3, 3), bumpScale: 0.0012, envMapIntensity: 0.5,
    vertexColors: true,
  });
  const hazardMat = new THREE.MeshStandardMaterial({
    map: hazardTex(), bumpMap: hazardTex(), bumpScale: 0.0008,
    roughness: 0.6, metalness: 0.1, envMapIntensity: 0.4,
  });
  const rubberMat = new THREE.MeshStandardMaterial({ color: '#15171a', roughness: 0.95, metalness: 0 });
  const rustMat = new THREE.MeshStandardMaterial({ color: '#6b3a1e', roughness: 0.92, metalness: 0.18, envMapIntensity: 0.25 });
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#1a1d22', roughness: 0.78, metalness: 0.08 });
  const webbingMat = new THREE.MeshStandardMaterial({
    map: webbingTex(), roughness: 0.95, metalness: 0, envMapIntensity: 0.15,
  });
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: '#c8d2da', roughness: 0.06, metalness: 0.95, envMapIntensity: 1.6,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#0a1620', roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.16,
    clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 1.35,
  });
  const ledAmber = new THREE.MeshStandardMaterial({
    color: '#ffb04a', emissive: '#ff8a1e', emissiveIntensity: 2.2, roughness: 0.4, metalness: 0.1,
  });
  const ledRed = new THREE.MeshStandardMaterial({
    color: '#ff5c40', emissive: '#ff3c20', emissiveIntensity: 2.6, roughness: 0.4, metalness: 0.1,
  });
  const ledWhite = new THREE.MeshStandardMaterial({
    color: '#fff3d8', emissive: '#ffc978', emissiveIntensity: 1.6, roughness: 0.28, metalness: 0.05,
  });
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTex(), roughness: 0.55, metalness: 0.15, envMapIntensity: 0.4,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: '#d5dbe0', roughness: 0.14, metalness: 1.0, envMapIntensity: 1.4,
  });

  return {
    hullMat, hullPlainMat, frameMat, accentMat, darkMat, steelMat, brassMat,
    hazardMat, rubberMat, rustMat, hoseMat, webbingMat, mirrorMat, glassMat,
    ledAmber, ledRed, ledWhite, plateMat, chromeMat,
  };
}
