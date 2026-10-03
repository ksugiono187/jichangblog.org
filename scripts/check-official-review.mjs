import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectPlans} from '../assets/selector.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const brands=JSON.parse(read('data/brands.json'));
const official=JSON.parse(read('data/official-checks.json'));
const coupons=JSON.parse(read('data/coupon-reviews.json'));
assert.equal(official.records.length,28);
assert.equal(new Set(official.records.map(r=>r.id)).size,28);
assert.equal(coupons.records.length,11);
assert.equal(coupons.records.filter(r=>r.sources.length).length,9);
for(const b of brands){
 const r=official.records.find(r=>r.id===b.id);
 assert(r);assert.equal(r.panelStatus,200);assert.equal(r.configStatus,200);
 assert.equal(r.planStatus,403);assert.equal(r.termsUrl,null);
 assert.equal(r.plansVerified,false);assert.equal(r.couponVerified,false);
 const html=read('dist/brands/'+b.id+'/index.html');
 assert(html.includes('官网公开资料复查'));
 assert(html.includes(r.panelUrl));
 if(b.coupon){const c=coupons.records.find(r=>r.id===b.id);assert.equal(c.code,b.coupon);assert.equal(c.checkoutVerified,false);assert(html.includes('id="coupon-review-'+b.id+'"'));}
}
assert.deepEqual(brands.filter(b=>b.planAttribution==='disputed').map(b=>b.id).sort(),['firefly','jilian']);
const html=read('dist/select/index.html');
const data=JSON.parse(html.match(/<script[^>]+id="selector-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
for(const dataset of [brands,data])for(const cycle of ['月付','年付','一次性']){
 const rows=selectPlans(dataset,{cycle,budget:100000,traffic:1}).rows;
 assert(rows.length>0);
 assert(!rows.some(r=>r.brand.id==='firefly'||r.brand.id==='jilian'));
}
const couponPage=read('dist/coupons/index.html');
assert.equal((couponPage.match(/class="coupon-condition-hint"/g)||[]).length,11);
assert(read('dist/updates/index.html').includes('id="official-review"'));
console.log('PASS: 28 public panel boundaries; 11 unchanged codes with 9 historical conditions; disputed plans excluded in server and browser selector data.');
