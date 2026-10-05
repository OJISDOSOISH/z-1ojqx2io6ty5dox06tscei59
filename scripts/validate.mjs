import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const hash=createHash('sha256').update(readFileSync('scene/15_robot/08_pneus.js')).digest('hex');
assert.equal(hash,'525257bddcd0f39e46acad35cfe4fbfa25188bcf599c9cd3722fcdde5c006509','Le fichier protégé des pneus a changé');
const build=readFileSync('zipp2.js','utf8');
assert.ok(build.includes('* 0.27'),'Montage longitudinal des roues');
assert.ok(build.includes('mat.isMeshBasicMaterial'),'Exclusion envMap de l’écran');
assert.ok(!build.includes('Math.random ='),'Pas de remplacement global du RNG dans le robot');
for(const phase of ['avant','apres']) {
  const stats=JSON.parse(readFileSync(`images/lot-01/${phase}/stats.json`));
  assert.deepEqual(stats.errors,[]);
  assert.equal(stats.views.length,9);
  for(const view of stats.views) for(const light of ['dur','couvert']) {
    const png=readFileSync(`images/lot-01/${phase}/${view.id}_${light}.png`);
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1400);assert.equal(png.readUInt32BE(20),900);
  }
}
console.log('Pneus intacts, montage et écran protégés, 36 PNG et statistiques vérifiés.');
