import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const brands=JSON.parse(read('data/brands.json')),data=JSON.parse(read('data/speed-research.json'));
assert.equal(data.records.length,28);assert.equal(new Set(data.records.map(r=>r.brandId)).size,28);
assert.equal(data.records.filter(r=>r.metrics.length).length,22);
const home=read('dist/index.html'),cards=[...home.matchAll(/<article class="brand-card"[\s\S]*?<\/article>/g)].map(m=>m[0]);assert.equal(cards.length,28);
for(let i=0;i<brands.length;i++){
 const b=brands[i],r=data.records.find(r=>r.brandId===b.id),html=read('dist/brands/'+b.id+'/index.html');
 assert(r);assert.equal(r.ownTest,false);assert.equal(r.currentVerified,false);assert(r.url.startsWith('https://'));assert(r.limitations.length>=2);
 assert(html.includes('id="speed-records"'));assert(html.includes(r.url));assert(html.includes('本站未独立测速'));assert(!/本站实测记录/.test(html));
 assert(read('dist/blog/'+b.id+'-plan-analysis/index.html').includes('id="speed-records"'));
 const official=cards[i].match(/<a class="button primary"[^>]+>前往官方 ↗<\/a>/g);assert.equal(official?.length,1);assert(official[0].includes('href="'+b.url.replaceAll('&','&amp;')+'"'));assert(official[0].includes('target="_blank"'));assert(official[0].includes('rel="sponsored nofollow noopener noreferrer"'));
 if(r.kind==='raw-node'){assert.equal(r.metrics.length,5);assert(r.metrics.every(m=>!(/剩余流量|套餐到期|重置/.test(m.node))));assert(html.includes('不换算为Mbps或MB/s'));assert(r.metrics.every(m=>/\d.*(?:MB|KB|B)$/.test(m.download)));}
}
assert.equal(data.records.find(r=>r.brandId==='kosing').testDate,null);
assert.equal(data.records.find(r=>r.brandId==='laddercloud').testDate,null);
for(const id of ['flyv','wavenet','lingdong'])assert.equal(data.records.find(r=>r.brandId===id).metrics.length,0);
for(const id of ['lightspeed','yuzhou','jilian','sogo'])assert.match(data.records.find(r=>r.brandId===id).metrics[0].download,/^0(?:\.0+)?B$/);
assert.equal(brands.find(b=>b.id==='firefly').planAttribution,'disputed');assert.equal(brands.find(b=>b.id==='jilian').planAttribution,'disputed');
const overview=read('dist/updates/index.html');for(const b of brands)assert(overview.includes('../brands/'+b.id+'/#speed-records'));
assert.equal(JSON.parse(read('dist/build-manifest.json')).sitemapCount,183);
console.log('PASS: 28 attributed speed sections; 22 numeric records; uncertain dates stay unknown; zero samples retained; 28 exact affiliate buttons; 183 sitemap URLs.');
