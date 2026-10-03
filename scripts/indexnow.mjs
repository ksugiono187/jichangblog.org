import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8'));
if(config.indexNowEnabled===false&&!process.argv.includes('--dry-run')){console.log('IndexNow notifications are paused pending the site owner’s review. No URLs were submitted.');process.exit(0);}
const origin=config.url,base=config.basePath||'',key=config.indexNowKey;
if(!/^https:\/\/[a-zA-Z0-9.-]+$/.test(origin)||!/^[a-zA-Z0-9-]{8,128}$/.test(key||''))throw Error('Production origin and IndexNow key required');
const canonicalFile=file=>origin+base+'/'+(file==='dist/index.html'?'':file.slice(5).replace(/index.html$/,''));
let urls=[];
if(process.argv.includes('--changed')){
 const files=execFileSync('git',['diff','--name-only','HEAD^','HEAD','--','dist'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/);
 urls=files.filter(p=>p.startsWith('dist/')&&p.endsWith('.html')&&!['dist/404.html','dist/search/index.html','dist/library/index.html'].includes(p)).map(canonicalFile);
}else if(process.argv.includes('--all')){
 urls=[...fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
}else throw Error('Use --changed after a Git push, or --all for an initial/manual submission');
urls=[...new Set(urls)];
for(const url of urls)if(!url.startsWith(origin+base+'/')||new URL(url).host!==new URL(origin).host)throw Error('URL outside the configured website');
if(urls.length>10000)throw Error('More than 10000 URLs; split this update before submission');
if(process.argv.includes('--dry-run')){console.log(JSON.stringify({dryRun:true,urls:urls.length,origin}));process.exit(0);}
if(!urls.length){console.log('No changed content URLs; IndexNow notification skipped.');process.exit(0);}
const keyLocation=origin+base+'/'+key+'.txt';
const get=async url=>fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(10000)});
if(process.env.GITHUB_SHA){
 const deadline=Date.now()+240000;let deployed=false;
 console.log('Waiting for the published website to match this commit before notifying search engines.');
 while(Date.now()<deadline){
  try{const r=await get(origin+base+'/build-manifest.json');if(r.ok&&(await r.json()).revision===process.env.GITHUB_SHA){deployed=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,5000));
 }
 if(!deployed)throw Error('The expected website version is not live; no IndexNow notification was sent.');
}
const proof=await get(keyLocation);if(!proof.ok||(await proof.text()).trim()!==key)throw Error('Public IndexNow verification file is not available; submission stopped.');
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({host:new URL(origin).host,key,keyLocation,urlList:urls}),signal:AbortSignal.timeout(30000)});
const body=await response.text();
const result={submittedAt:new Date().toISOString(),status:response.status,urlCount:urls.length,revision:process.env.GITHUB_SHA||null,meaning:response.status===200?'URLs received; indexing and ranking are not confirmed':response.status===202?'URLs received; key validation is pending':'Submission failed',...(response.status!==200&&response.status!==202?{response:body.slice(0,300)}:{})};
fs.writeFileSync(path.join(root,'indexnow-result.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
if(![200,202].includes(response.status))throw Error('IndexNow did not accept the notification; do not retry successful requests or flood the endpoint.');
