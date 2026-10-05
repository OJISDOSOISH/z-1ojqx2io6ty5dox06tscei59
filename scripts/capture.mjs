// Banc autonome : npm run capture -- images/lot-01/avant
// Chromium local via CHROME_PATH, ou distribution headless npm en secours.
import { chromium as playwright } from 'playwright-core';
import chromium, { inflate } from '@sparticuz/chromium';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(process.argv[2] || 'images/controle');
const views = JSON.parse(await readFile(resolve(root,'scripts/vues.json')));
await mkdir(out,{recursive:true});
const server = createServer(async(req,res)=>{
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://local').pathname));
    if (!path.startsWith(root+sep)) {res.writeHead(403).end();return;}
    const bytes = await readFile(path);
    res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json'})[extname(path)] || 'application/octet-stream');
    res.end(bytes);
  } catch {res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
  const executablePath = process.env.CHROME_PATH || await chromium.executablePath();
  let env = {...process.env};
  if (!process.env.CHROME_PATH) {
    const libs = await inflate(resolve(root,'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
    env.LD_LIBRARY_PATH = libs+'/lib'+(env.LD_LIBRARY_PATH ? ':'+env.LD_LIBRARY_PATH : '');
  }
  browser = await playwright.launch({executablePath,env,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const page = await browser.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  // Graine de test seulement : aucun remplacement global dans buildZipp2.
  await page.addInitScript(()=>{let s=20261005; Math.random=()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);});
  await page.goto(`http://127.0.0.1:${server.address().port}/rendu.html`);
  await page.waitForFunction(()=>window.READY,{},{timeout:120000});
  errors.push(...await page.evaluate(()=>window.ERRS));
  if(errors.length) throw new Error(errors.join('\n'));
  const stats=await page.evaluate(()=>window.STATS());
  const geometryChecks=await page.evaluate(()=>{
    const T=window.TH,sheet=window.SC.getObjectByName('torse-tole-ajouree');
    if(!sheet)return {legacy:true};
    sheet.updateWorldMatrix(true,false);
    const hit=(x,y)=>{
      const origin=new T.Vector3(x,y,.15).applyMatrix4(sheet.matrixWorld);
      const direction=new T.Vector3(0,0,-1).transformDirection(sheet.matrixWorld);
      return new T.Raycaster(origin,direction).intersectObject(sheet,false).length>0;
    };
    const result={solid:hit(0,-.04),grilleOpen:!hit(-.06,.10),lampOpen:!hit(.166,.103)};
    const g=sheet.geometry;
    result.finite=[...g.attributes.position.array,...g.attributes.normal.array,...g.attributes.uv.array].every(Number.isFinite);
    if(Object.values(result).some(v=>!v))throw new Error('Géométrie de façade invalide: '+JSON.stringify(result));
    return result;
  });
  for(const light of ['dur','couvert']) {
    await page.evaluate(l=>window.SETLIGHT(l),light);
    for(const view of views) {
      const data=await page.evaluate(v=>window.SHOOTAT(...v.camera),view);
      await writeFile(resolve(out,`${view.id}_${light}.png`),Buffer.from(data.split(',')[1],'base64'));
      console.log(light,view.id);
    }
  }
  await writeFile(resolve(out,'stats.json'),JSON.stringify({stats,errors,geometryChecks,seed:20261005,views},null,2));
} finally {await browser?.close(); await new Promise(r=>server.close(r));}
