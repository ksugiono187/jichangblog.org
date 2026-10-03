import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {articles,topics} from './editorial.mjs';
const root=path.resolve(import.meta.dirname,'..'),dist=path.resolve(root,process.env.SITE_OUTPUT_DIR||'dist');
const brands=JSON.parse(fs.readFileSync(path.join(root,'data/brands.json'),'utf8'));
assert.equal(brands.length,28);assert.equal(new Set(brands.map(b=>b.id)).size,28);assert.equal(brands.filter(b=>b.coupon).length,11);
const files=[];function walk(d){for(const n of fs.readdirSync(d)){const p=path.join(d,n);if(fs.statSync(p).isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p);}}walk(dist);
const titles=new Set();let links=0;const graph=new Map();
for(const f of files){const html=fs.readFileSync(f,'utf8');const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert(title);assert(!titles.has(title),'Duplicate title '+title);titles.add(title);assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert(html.includes('name="description"'));assert(html.includes('lang="zh-CN"'));for(const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){const href=m[1];if(/^(https?:|data:|mailto:|\/)/.test(href))continue;const target=path.resolve(path.dirname(f),href.split('?')[0]);assert(fs.existsSync(target),'Missing '+href+' in '+f);links++;}for(const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(m[1]);}
for(const b of brands){assert(b.plans.length>0);assert(b.url.includes('#/?code='));assert(b.source.startsWith('https://'));for(const p of b.plans){assert(p.price>0);assert(['月付','年付','一次性'].includes(p.cycle));assert(p.gb===null||p.gb>0);}const html=fs.readFileSync(path.join(dist,'brands',b.id,'index.html'),'utf8');assert(html.includes(b.url.replace(/&/g,'&amp;')));assert(html.includes(b.source));if(b.coupon)assert(html.includes('data-copy="'+b.coupon+'"'));assert(html.includes('sponsored nofollow noopener noreferrer'));}
assert.equal(files.length,36+articles.length+topics.length+6);assert(fs.existsSync(path.join(dist,'assets/hero-background.webp')));
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'build-manifest.json'),'utf8'));assert.equal(manifest.pageCount,files.length);assert.equal(manifest.articleCount,articles.length);assert.equal(manifest.topicCount,topics.length);
const origin=manifest.origin||'http://localhost:4173';const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');const locs=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(locs.length,manifest.sitemapCount);assert.equal(locs.length,files.length-3);assert.equal(new Set(locs).size,locs.length);
for(const loc of locs){assert(loc.startsWith(origin+manifest.basePath+'/'));assert(!loc.includes('404.html'));const rel=decodeURIComponent(new URL(loc).pathname).slice(manifest.basePath.length);assert(fs.existsSync(path.join(dist,rel,rel.endsWith('/')?'index.html':'')),loc);}
for(const f of files){const html=fs.readFileSync(f,'utf8');const next=[];for(const m of html.matchAll(/href="([^"<>]+)"/g)){const value=m[1];if(/^(https?:|data:|mailto:)/.test(value))continue;const [link,fragment]=value.split('#');if(link.startsWith('/'))continue;let target=link?path.resolve(path.dirname(f),link):f;if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');if(target.endsWith('.html')){next.push(target);if(fragment)assert(fs.readFileSync(target,'utf8').includes(`id="${fragment}"`),'Missing fragment '+value+' in '+f);}}graph.set(f,next);}
const distances=new Map([[path.join(dist,'index.html'),0]]);const queue=[path.join(dist,'index.html')];for(let i=0;i<queue.length;i++){const f=queue[i];for(const target of graph.get(f)||[])if(!distances.has(target)){distances.set(target,distances.get(f)+1);queue.push(target);}}
for(const f of files.filter(f=>!f.endsWith('404.html')))assert(distances.has(f),'Orphan page '+f);const maxDepth=Math.max(...distances.values());assert(maxDepth<=3,'Content too far from homepage');
for(const a of articles){assert(topics.some(t=>t.id===a.topic));for(const id of a.related)assert(articles.some(a=>a.id===id),'Unknown related article '+id);for(const id of a.brandIds)assert(brands.some(b=>b.id===id));const html=fs.readFileSync(path.join(dist,'blog',a.id,'index.html'),'utf8');assert(html.includes('article-toc'));assert(html.includes('article-pagination'));assert(html.includes('datePublished'));assert(html.includes('href="../../topics/'+a.topic+'/"'));}
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');assert(home.match(/<h1[ >][\s\S]*?<\/h1>/)[0].includes('机场推荐'));assert(home.includes('READ BY NEED'));
const robots=fs.readFileSync(path.join(dist,'robots.txt'),'utf8');assert(robots.includes(manifest.production?'Allow: /':'Disallow: /'));if(manifest.production)assert(robots.includes('Sitemap: '+origin+manifest.basePath+'/sitemap.xml'));
console.log(`PASS: ${files.length} pages; ${articles.length} articles, ${topics.length} topics; ${links} local references; ${locs.length} sitemap URLs; all pages reachable within ${maxDepth} links; titles, fragments, metadata, structured data, 28 brands and 11 coupons verified.`);

assert.equal(new Set(articles.map(a=>a.id)).size,articles.length);assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);for(const t of topics)assert(articles.filter(a=>a.topic===t.id).length>=3,'Too few articles for topic '+t.id);

await import('./check-selector.mjs');

// Ensure coupon actions and direct brand navigation are present in shipped HTML.
assert.equal((home.match(/class="copy card-copy"/g)||[]).length,11);
for(let i=0;i<brands.length;i++){
 const b=brands[i],html=fs.readFileSync(path.join(dist,'brands',b.id,'index.html'),'utf8');
 const previous=brands[(i+27)%28],next=brands[(i+1)%28];
 assert(html.includes('data-brand-previous href="../'+previous.id+'/"'));
 assert(html.includes('data-brand-next href="../'+next.id+'/"'));
 const menus=[...html.matchAll(/<nav class="brand-jump-menu"[\s\S]*?<\/nav>/g)];assert.equal(menus.length,2);
 for(const menu of menus){assert.equal((menu[0].match(/href="\.\.\/[a-z0-9-]+\/"/g)||[]).length,28);for(const target of brands)assert(menu[0].includes('href="../'+target.id+'/"'));}
 if(b.coupon)assert(home.includes('data-copy="'+b.coupon+'"'));
}
console.log('PASS: 11 homepage copy actions; all 28 brands have previous/next links and complete directories.');

await import('./check-reader.mjs');
