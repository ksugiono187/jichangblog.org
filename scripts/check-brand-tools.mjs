import fs from 'node:fs';
import assert from 'node:assert/strict';
import {feedbackTemplate,feedbackMail,snapshotPlans,referenceChanges,assertHistoryMatches} from './brand-tools.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const brands=JSON.parse(read('data/brands.json')),history=JSON.parse(read('data/brand-history.json')),home=read('dist/index.html');
const cards=[...home.matchAll(/<article class="brand-card"[\s\S]*?<\/article>/g)].map(m=>m[0]);
assert.equal(history.records.length,28);assert.equal(new Set(history.records.map(r=>r.brandId)).size,28);assertHistoryMatches(brands);
for(let i=0;i<brands.length;i++){
 const b=brands[i],h=read('dist/brands/'+b.id+'/index.html'),r=history.records.find(r=>r.brandId===b.id),mail=new URL(feedbackMail(b));
 assert.equal(mail.protocol,'mailto:');assert.equal(mail.pathname,'ksugiono187@gmail.com');assert(mail.searchParams.get('subject').includes(b.name));assert.equal(mail.searchParams.get('body'),feedbackTemplate(b));assert(mail.searchParams.get('body').includes('https://jichangblog.org/brands/'+b.id+'/'));
 assert(cards[i].includes('brands/'+b.id+'/#speed-records'));assert(cards[i].includes('brands/'+b.id+'/#history'));assert(cards[i].includes('class="brand-feedback-link"'));assert(cards[i].includes('预填品牌与页面'));
 assert(h.includes('id="history"'));assert(h.includes('id="feedback"'));assert(h.includes('data-copy-kind="feedback"'));assert(h.includes(r.referenceSnapshots.length===1?'暂无两次记录之间的价格变化':'参考资料调整'));assert(r.referenceSnapshots.length>=1);assert.deepEqual(snapshotPlans(r.referenceSnapshots.at(-1).plans),snapshotPlans(b.plans));assert.equal(r.referenceSnapshots[0].date,r.startedAt);assert(r.events.every(e=>e.sources.length&&e.sources.every(s=>s.url.startsWith('https://'))));
 assert(read('dist/updates/index.html').includes('../brands/'+b.id+'/#history'));
}
const before=[{name:'测试套餐',cycle:'月付',price:20,gb:100,quotaPeriod:'month'}],after=structuredClone(before);after[0].price=23;after[0].gb=120;
assert.deepEqual(referenceChanges(before,after).map(c=>[c.field,c.before,c.after]),[['price',20,23],['gb',100,120]]);assert.deepEqual(referenceChanges(before,before),[]);assert.equal(referenceChanges(before,[])[0].after,'本版未收录');assert.equal(referenceChanges([],before)[0].after,'新增收录');assert.equal(before[0].price,20);
const altered=structuredClone(brands);altered[0].plans[0].price++;assert.throws(()=>assertHistoryMatches(altered),/needs a sourced update/);
assert.equal(JSON.parse(read('dist/build-manifest.json')).sitemapCount,183);
console.log('PASS: 28 speed shortcuts, exact contextual mail drafts, 28 immutable reference baselines; price/quota differences and unrecorded-change guard.');
