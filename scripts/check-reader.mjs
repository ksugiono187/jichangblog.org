import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cleanState,validIds,toggleComparison,searchCatalog,planMetrics} from '../assets/explorer.js';
const root=new URL('../',import.meta.url),out=new URL((process.env.SITE_OUTPUT_DIR||'dist')+'/',root);
const catalog=JSON.parse(fs.readFileSync(new URL('assets/catalog.json',out),'utf8'));
const known=new Set(catalog.brands.map(b=>b.id)),paths=new Set(catalog.documents.map(d=>d.path));
assert.equal(catalog.documents.length,172);assert.equal(new Set(catalog.documents.map(d=>d.path)).size,172);
assert.deepEqual(validIds(['bad','breezenet','breezenet','flycat','twilight','civet','kuaili'],known),['breezenet','flycat','twilight','civet']);
assert.deepEqual(cleanState({favorites:['bad','flycat','flycat'],recent:['https://evil.example/', 'brands/flycat/','brands/flycat/']},known,paths),{favorites:['flycat'],compare:[],recent:['brands/flycat/']});
const four=['breezenet','flycat','twilight','civet'];assert.equal(toggleComparison(four,'kuaili').full,true);assert.deepEqual(toggleComparison(four,'flycat').ids,['breezenet','twilight','civet']);assert.deepEqual(toggleComparison([],'flycat').ids,['flycat']);
assert(searchCatalog(catalog.documents,'BREEZENET','brand').some(d=>d.id==='breezenet'));
assert(searchCatalog(catalog.documents,'２００ＧＢ','brand').some(d=>d.id==='breezenet'));
assert(searchCatalog(catalog.documents,'微风 年付','brand').some(d=>d.id==='breezenet'));
assert(searchCatalog(catalog.documents,'年付','article').every(d=>d.type==='article'));
assert.equal(searchCatalog(catalog.documents,'无此关键字XYZ').length,0);
for(const d of catalog.documents)assert(fs.existsSync(new URL(d.path+'index.html',out)),d.path);
assert.equal(planMetrics(catalog.brands.find(b=>b.id==='breezenet')).monthly.price,27);
assert.equal(planMetrics(catalog.brands.find(b=>b.id==='breezenet')).annual.price,137);
const home=fs.readFileSync(new URL('index.html',out),'utf8');assert.equal((home.match(/data-save-brand=/g)||[]).length,28);assert.equal((home.match(/data-compare-brand=/g)||[]).length,28);
for(const p of ['search/','library/']){assert(fs.readFileSync(new URL(p+'index.html',out),'utf8').includes('noindex,follow'));assert(!fs.readFileSync(new URL('sitemap.xml',out),'utf8').includes('/'+p+'</loc>'));}
assert.equal((fs.readFileSync(new URL('compare/index.html',out),'utf8').match(/type="checkbox"/g)||[]).length,28);
assert(fs.readFileSync(new URL('updates/index.html',out),'utf8').includes('尚未独立确认'));
console.log('PASS: reader state validation, 4-brand limit, removal, search normalization and filters, 172 destinations, reference plan metrics and private-page indexing.');

const config=JSON.parse(fs.readFileSync(new URL('site.config.json',root),'utf8'));assert(home.includes('name="msvalidate.01" content="'+config.bingVerification+'"'));
