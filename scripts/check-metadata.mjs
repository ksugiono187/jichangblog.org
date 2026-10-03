import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.resolve(root,process.env.SITE_OUTPUT_DIR||'dist');
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(e.name.endsWith('.html'))files.push(file);}}walk(dist);
const descriptions=new Set();let indexable=0;
for(const file of files){const html=fs.readFileSync(file,'utf8');const title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 assert(!title?.includes('机场机场'),'Repeated brand suffix: '+file);
 assert.equal(html.match(/<meta property="og:title" content="([^"]*)"/)?.[1],title);
 assert.equal(html.match(/<meta property="og:description" content="([^"]*)"/)?.[1],description);
 if(html.includes('name="robots" content="noindex'))continue;
 assert(description?.length,'Missing description: '+file);
 assert(!descriptions.has(description),'Duplicate search description: '+file);descriptions.add(description);indexable++;
 const blocks=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];
 for(const block of blocks){const value=JSON.parse(block[1]);const page=Array.isArray(value)?value[0]:value;assert.equal(page.description,description.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));}
}
const checks=JSON.parse(fs.readFileSync(root+'/data/source-checks.json','utf8'));
assert.equal(checks.records.length,28);assert.equal(new Set(checks.records.map(r=>r.id)).size,28);
for(const record of checks.records){assert.equal(record.plansVerified,false);assert.equal(record.couponVerified,false);assert(Number.isFinite(Date.parse(record.checkedAt)));}
const updates=fs.readFileSync(dist+'/updates/index.html','utf8');assert(updates.includes('入口访问'));assert(updates.includes('未获得登录后的套餐及优惠结算数据'));
console.log('PASS: '+indexable+' unique search descriptions; Open Graph and structured descriptions match; access checks remain separate from price and coupon verification.');
