import assert from 'node:assert/strict';
import fs from 'node:fs';
import {quotaLabel,unitPrice} from '../assets/quota.js';
import {selectPlans} from '../assets/selector.js';
const brands=JSON.parse(fs.readFileSync(new URL('../data/brands.json',import.meta.url)));
const reports=JSON.parse(fs.readFileSync(new URL('../data/research.json',import.meta.url)));
assert.equal(reports.records.length,8);assert.equal(new Set(reports.records.map(x=>x.brandId)).size,7);
const ling=brands.find(b=>b.id==='lingdong'),annual=ling.plans.find(p=>p.cycle==='年付');
assert.equal(annual.gb,null);assert.equal(annual.quotedGb,70);assert.equal(annual.quotaPeriod,'year-total');
assert.equal(unitPrice(annual),99/70);assert(quotaLabel(annual).includes('70GB/年'));
const selected=selectPlans(brands,{cycle:'年付',budget:1000,traffic:1});
assert(!selected.rows.some(r=>r.brand.id==='lingdong'));
assert(selected.rows.every(r=>r.plan.quotaPeriod==='month'));
const unknown=brands.flatMap(b=>b.plans).filter(p=>p.quotaPeriod==='unknown');
assert.equal(unknown.length,25);assert(unknown.every(p=>p.gb===null&&p.quotedGb>0&&unitPrice(p)===null));
for(const b of brands){const html=fs.readFileSync(new URL('../dist/brands/'+b.id+'/index.html',import.meta.url),'utf8');assert(html.includes('id="cost-analysis"'));assert(html.includes('id="evidence"'));assert(!html.includes('nullGB'));assert(!/¥(?:Infinity|NaN)/.test(html));for(const p of b.plans)assert(html.includes(quotaLabel(p)));}
for(const r of reports.records){assert(brands.some(b=>b.id===r.brandId));assert(r.url.startsWith('https://'));assert(r.limit&&r.environment&&r.testDate&&r.sample);const html=fs.readFileSync(new URL('../dist/brands/'+r.brandId+'/index.html',import.meta.url),'utf8');assert(html.includes(r.url));assert(html.includes(r.testDate));assert(html.includes('本站未复测'));}
console.log('PASS: 28 cost analyses; 8 attributed reports; yearly-total quota excluded from monthly screening; 25 ambiguous annual quotas have no invented unit cost.');
