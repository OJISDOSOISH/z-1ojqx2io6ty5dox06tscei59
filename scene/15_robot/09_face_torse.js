// Façade démontable : tôle réellement ajourée, conduits fermés, radiateur,
// persiennes et phare. Les cartes sont peintes dans le même repère que la tôle.
// Aucune ressource externe ; aucun changement des pneus ou du visage.
export function piece_face_torse(E, front) {
  const {THREE:T, m, RoundedBoxGeometry, canvasTex, P} = E;
  const {Mesh, Shape, Path} = T;
  const fasteners = [[-.228,.238],[.228,.238],[-.233,.0],[.233,-.005],[-.228,-.116],[.228,-.116]];
  const rounded = (C,x,y,w,h,r) => {
    const s=new C();
    s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
    s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
    s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
    return s;
  };
  const outline=rounded(Shape,-.25,-.14,.50,.40,.012);
  const opening=rounded(Path,-.213,.012,.293,.181,.009);
  const lampHole=new Path(); lampHole.absarc(.166,.103,.043,0,Math.PI*2,true);
  outline.holes.push(opening,lampHole);

  // Bruit local : ne remplace pas Math.random (ni celui des pneus).
  let seed=90202;
  const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const W=1280,H=1024;
  const canvases=Array.from({length:4},()=>{const c=document.createElement('canvas'); c.width=W;c.height=H;return c;});
  const [albedo,rough,height,metal]=canvases.map(c=>c.getContext('2d'));
  const px=x=>(x+.25)/.5*W, py=y=>(.26-y)/.4*H;
  albedo.fillStyle=P.orange;albedo.fillRect(0,0,W,H);
  rough.fillStyle='#c4c4c4';rough.fillRect(0,0,W,H);
  height.fillStyle='#808080';height.fillRect(0,0,W,H);
  metal.fillStyle='#080808';metal.fillRect(0,0,W,H);
  // Peau d'orange submillimétrique : hauteur et rugosité, sans grille sinusoïdale.
  const a=albedo.getImageData(0,0,W,H), r=rough.getImageData(0,0,W,H), b=height.getImageData(0,0,W,H);
  for(let i=0;i<a.data.length;i+=4) {
    const n=rand()-.5;
    a.data[i]+=n*7; a.data[i+1]+=n*5; a.data[i+2]+=n*3;
    for(let j=0;j<3;j++){r.data[i+j]+=n*26;b.data[i+j]+=n*38;}
  }
  albedo.putImageData(a,0,0);rough.putImageData(r,0,0);height.putImageData(b,0,0);
  // Crasse de ruissellement sous le rebord supérieur, jamais sur tout le panneau.
  const dust=albedo.createLinearGradient(0,0,0,80);
  dust.addColorStop(0,'rgba(60,43,23,.38)');dust.addColorStop(1,'rgba(60,43,23,0)');
  albedo.fillStyle=dust;albedo.fillRect(0,0,W,80);
  const traces=(x,y,len)=>{
    const xx=px(x),yy=py(y),ll=len/.4*H;
    for(const [g,col] of [[albedo,'87,46,21'],[rough,'238,238,238']]) {
      const grad=g.createLinearGradient(0,yy,0,yy+ll);
      grad.addColorStop(0,`rgba(${col},.55)`);grad.addColorStop(1,`rgba(${col},0)`);
      g.strokeStyle=grad;g.lineWidth=4.5;g.lineCap='round';
      g.beginPath();g.moveTo(xx,yy+5);g.bezierCurveTo(xx-2,yy+ll*.25,xx+2,yy+ll*.65,xx+1,yy+ll);g.stroke();
      g.lineWidth=11;g.beginPath();g.moveTo(xx,yy+4);g.lineTo(xx,yy+ll*.22);g.stroke();
    }
  };
  traces(-.228,.238,.045);traces(.228,.238,.074);traces(-.233,0,.058);
  // Éclats uniquement sur les contours réels : peinture, primaire, acier.
  const chip=(x,y,radius)=>{
    const points=Array.from({length:7},(_,i)=>{
      const theta=i/7*Math.PI*2,rr=radius*(.55+rand()*.7);
      return [Math.cos(theta)*rr,Math.sin(theta)*rr*.48];
    });
    const draw=(g,color,scale=1)=>{
      g.fillStyle=color;g.beginPath();points.forEach(([xx,yy],i)=>g[i?'lineTo':'moveTo'](px(x)+xx*scale,py(y)+yy*scale));g.closePath();g.fill();
    };
    draw(albedo,'#785237',1.55);draw(albedo,'#6b6961');
    draw(rough,'#8b8b8b');draw(height,'#545454');draw(metal,'#c4c4c4');
  };
  for(const contour of [outline,opening,lampHole]) {
    const pts=contour.getSpacedPoints(300);
    for(let i=0;i<pts.length;i++) if(rand()<.44) chip(pts[i].x,pts[i].y,1.5+rand()*6);
  }
  // Impacts de gravillons concentrés sur le bas, avec densité décroissante.
  for(let i=0;i<210;i++) {
    const x=-.24+rand()*.48, y=-.135+Math.pow(rand(),2)*.09;
    const xx=px(x),yy=py(y),rad=.4+rand()*2;
    albedo.fillStyle=`rgba(85,64,38,${.12+rand()*.26})`;
    albedo.beginPath();albedo.ellipse(xx,yy,rad*1.6,rad,rand()*3,0,7);albedo.fill();
    rough.fillStyle='#e4e4e4';rough.beginPath();rough.arc(xx,yy,rad*2,0,7);rough.fill();
    if(i%9===0)chip(x,y,rad);
  }
  // Sérigraphies localisées : aucune projection sur un autre panneau.
  albedo.textBaseline='middle';albedo.fillStyle='#30291d';
  albedo.font='bold 24px monospace';albedo.fillText('REFROIDISSEMENT',px(-.205),py(.225));
  albedo.font='bold 64px monospace';albedo.fillText('Z-02',px(-.201),py(-.050));
  albedo.font='bold 24px monospace';albedo.fillText('CHANTIER NORD',px(-.201),py(-.079));
  // Ponts de pochoir dans les gros caractères, sans plaque flottante.
  albedo.fillStyle=P.orange;
  albedo.fillRect(px(-.1635),py(-.039),2.5,56);
  albedo.beginPath();albedo.arc(px(.164),py(.226),.022/.5*W,0,7);
  albedo.fillStyle='#dbd2b4';albedo.fill();albedo.lineWidth=5;albedo.strokeStyle='#3c3529';albedo.stroke();
  albedo.fillStyle='#30291d';albedo.textAlign='center';albedo.font='bold 42px monospace';albedo.fillText('02',px(.164),py(.226)+2);
  albedo.font='bold 18px monospace';albedo.fillText('48 V',px(.164),py(.033));
  albedo.textAlign='left';albedo.font='16px monospace';albedo.fillText('CN / 02017',px(.09),py(-.100));
  albedo.strokeStyle='#342a1a';albedo.lineWidth=3;
  albedo.beginPath();albedo.moveTo(px(.168),py(-.038));albedo.lineTo(px(.145),py(-.081));albedo.lineTo(px(.191),py(-.081));albedo.closePath();albedo.stroke();
  albedo.textAlign='center';albedo.font='bold 29px monospace';albedo.fillText('!',px(.168),py(-.067));
  // Déposer la poussière après l'encre pour que la patine traverse le marquage.
  for(let i=0;i<32;i++)chip(-.23+rand()*.46,-.125+rand()*.034,1+rand()*3);
  const textures=canvases.map((c,i)=>{const t=new T.CanvasTexture(c);t.colorSpace=i===0?T.SRGBColorSpace:T.NoColorSpace;t.anisotropy=8;return t;});
  const paint=new T.MeshPhysicalMaterial({name:'tole-frontale-patinee',map:textures[0],roughnessMap:textures[1],bumpMap:textures[2],metalnessMap:textures[3],roughness:.9,metalness:1,bumpScale:.00022,clearcoat:.12,clearcoatRoughness:.58,envMapIntensity:.5});
  const edge=m.hullPlainMat.clone();edge.name='chants-tole-frontale';edge.vertexColors=false;
  const sheetGeo=new T.ExtrudeGeometry(outline,{depth:.003,bevelEnabled:true,bevelThickness:.0005,bevelSize:.0006,bevelOffset:-.0006,bevelSegments:3,steps:1,curveSegments:32});
  sheetGeo.translate(0,0,.016);
  const uv=sheetGeo.attributes.uv,pos=sheetGeo.attributes.position;
  const caps=sheetGeo.groups.find(g=>g.materialIndex===0);
  for(let i=caps.start;i<caps.start+caps.count;i++)uv.setXY(i,(pos.getX(i)+.25)/.5,(pos.getY(i)+.14)/.4);
  uv.needsUpdate=true;
  const sheet=new Mesh(sheetGeo,[paint,edge]);sheet.name='torse-tole-ajouree';front.add(sheet);
  const box=(name,w,h,d,x,y,z,mat,r=.001)=>{
    const mesh=new Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),mat);
    mesh.name=name;mesh.position.set(x,y,z);front.add(mesh);return mesh;
  };
  const bolt=(x,y,z,r=.0045)=>{
    const group=E.bolt(front,x,y,z,'z',r);group.name='vis-face-torse';
    box('empreinte-vis',r*1.1,.0008,.0005,x,y,z+r*.47,m.darkMat,.0001);
  };
  // Vis sur rondelles et joint périphérique : fixations posées sur la tôle.
  for(const [x,y] of fasteners)bolt(x,y,.022);
  const ring=(outer,inner,z,depth,mat,name)=>{
    outer.holes.push(inner);
    const geo=new T.ExtrudeGeometry(outer,{depth,bevelEnabled:false,curveSegments:24});
    geo.translate(0,0,z);const mesh=new Mesh(geo,mat);mesh.name=name;front.add(mesh);return mesh;
  };
  ring(rounded(Shape,-.218,.007,.303,.191,.012),rounded(Path,-.211,.014,.289,.177,.009),.019,.002,m.rubberMat,'joint-calandre');
  // Shroud fermé sur les quatre côtés : pas de jour vers l'intérieur du robot.
  box('conduit-gauche',.004,.181,.048,-.212,.1025,-.003,m.darkMat);
  box('conduit-droit',.004,.181,.048,.079,.1025,-.003,m.darkMat);
  box('conduit-haut',.293,.004,.048,-.0665,.192,-.003,m.darkMat);
  box('conduit-bas',.293,.004,.048,-.0665,.013,-.003,m.darkMat);
  box('fond-radiateur',.29,.18,.006,-.0665,.1025,-.03,m.darkMat);
  // Retour supérieur jusqu'au plateau existant : ferme le jour constaté au rendu.
  box('joint-sous-plateau',.494,.028,.028,0,.245,-.009,m.rubberMat,.002);
  box('retour-haut-tole',.498,.009,.071,0,.261,-.014,edge,.002);
  const finMat=m.steelMat.clone();finMat.name='aluminium-oxyde-radiateur';
  finMat.color.set('#575c5b');finMat.roughness=.76;finMat.envMapIntensity=.40;
  // Faisceau de refroidissement : ailettes fines fixées aux deux collecteurs.
  for(const x of [-.198,.065])box('collecteur-radiateur',.012,.162,.012,x,.1025,-.018,m.frameMat);
  for(let i=0;i<32;i++)box('ailette-radiateur',.002,.159,.008,-.187+i*.0077,.1025,-.018,finMat,.0004);
  for(const y of [.041,.100,.160])box('traverse-radiateur',.265,.003,.004,-.0665,y,-.010,m.frameMat,.0006);
  // Persiennes galbées : le pli forme une arête claire, le dessous reste sombre.
  for(let i=0;i<6;i++) {
    const y=.026+i*.029;
    const blade=box('persienne',.276,.010,.024,-.0665,y,.020,m.frameMat,.002);
    blade.rotation.x=-.30;
    const lip=box('bord-persienne',.269,.0012,.002,-.0665,y+.007,.030,m.steelMat,.0004);
    lip.rotation.x=-.30;
  }
  // Platines de chaque côté des persiennes, fixées au conduit (pas flottantes).
  for(const x of [-.205,.072]) {
    box('montant-calandre',.008,.169,.008,x,.1025,.023,m.frameMat);
    for(const y of [.03,.176])bolt(x,y,.028,.0032);
  }
  // Réflecteur fermé en lathe ; toute l'ouverture du phare a un fond.
  const lx=.166,ly=.103;
  const points=[[0,-.028],[.011,-.028],[.025,-.019],[.038,-.004],[.041,.015],[.043,.019],[.046,.021],[.047,.017],[.044,-.009],[.03,-.030],[0,-.031]].map(([r,z])=>new T.Vector2(r,z));
  const reflector=new Mesh(new T.LatheGeometry(points,64),m.chromeMat);
  reflector.name='reflecteur-phare';reflector.rotation.x=Math.PI/2;reflector.position.set(lx,ly,0);front.add(reflector);
  // Lathe Y -> Z (rotation +PI/2) : z = y d'origine.
  for(const [radius,tube,z,mat] of [[.046,.004,.022,m.rubberMat],[.043,.0022,.029,m.steelMat]]) {
    const bezel=new Mesh(new T.TorusGeometry(radius,tube,12,64),mat);
    bezel.name='cerclage-phare';bezel.position.set(lx,ly,z);front.add(bezel);
  }
  const emitter=new Mesh(new T.SphereGeometry(.011,24,16),m.ledWhite);
  emitter.name='ampoule-phare';emitter.position.set(lx,ly,-.013);front.add(emitter);
  const lensTex=canvasTex(256,256,(g,w,h)=>{
    g.fillStyle='#777777';g.fillRect(0,0,w,h);g.strokeStyle='#989898';g.lineWidth=3;
    for(let x=12;x<w;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
  });lensTex.colorSpace=T.NoColorSpace;
  const lensMat=new T.MeshPhysicalMaterial({name:'verre-strie-phare',color:'#e2e5d7',roughness:.18,metalness:0,transparent:true,opacity:.32,depthWrite:false,bumpMap:lensTex,bumpScale:.0006,clearcoat:1,envMapIntensity:.6});
  const lens=new Mesh(new T.CircleGeometry(.0405,64),lensMat);lens.name='vitre-phare';lens.position.set(lx,ly,.029);front.add(lens);
  for(const x of [lx-.038,lx+.038])bolt(x,ly-.037,.027,.0028);
  // Deux charnières basses, et pattes de retour vers les flancs.
  for(const x of [-.153,.145]) {
    box('patte-charniere',.045,.031,.004,x,-.12,.022,m.frameMat);
    const pin=new Mesh(new T.CylinderGeometry(.004,.004,.052,24),m.steelMat);
    pin.name='axe-charniere';pin.rotation.z=Math.PI/2;pin.position.set(x,-.130,.027);front.add(pin);
    for(const xx of [x-.014,x+.014])bolt(xx,-.110,.027,.0027);
  }
  for(const x of [-.247,.247])box('retour-tole',.004,.36,.025,x,.06,.006,edge);
  // Retour exploitable par les sondes sans casser le point d'entrée historique.
  return {sheet,opening};
}
