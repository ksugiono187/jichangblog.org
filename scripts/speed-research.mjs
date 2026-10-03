import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../data/speed-research.json',import.meta.url),'utf8'));
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={historical:'外部历史记录','attribution-caution':'品牌归属需再核对','date-uncertain':'日期不完整',incomplete:'测试条件不完整','supplier-image':'商家提供图证','image-only':'图证参考 · 未摘录速度','disputed-image':'图证有疑点 · 不采用数值','not-found':'未找到可采用的记录'};
function table(r,name){
 if(!r.metrics.length)return '';
 let head,body,caption;
 if(r.kind==='regional'){
  head=['地区','测试节点数','来源有效样本','平均TLS RTT','平均下载（来源）','原始平均速度'];
  body=r.metrics.map(m=>[m.region,m.samples,m.valid,m.latency,m.download,m.originalDownload]);
  caption=name+' · 发布者的地区汇总值，含失败样本；有效样本口径见原文';
 }else if(r.kind==='raw-node'){
  head=['地区 / 节点示例',r.latencyType,'HTTP / HTTPS延迟','平均速度栏原值','最大速度栏原值'];
  body=r.metrics.map(m=>[m.region+' / '+m.node,m.latency,m.httpLatency,m.download,m.maximum]);
  caption=name+' · 各常用地区在原表首次出现的节点，保留0B；不是地区均值';
 }else{head=['指标','发布者记录'];body=r.metrics.map(m=>[m.label,m.value]);caption=name+' · 外部报告摘要，非本站复测';}
 return `<div class="table-scroll speed-table-scroll" tabindex="0" role="region" aria-label="${E(name)}测速资料表，可左右滑动"><table class="speed-table"><caption>${E(caption)}</caption><thead><tr>${head.map(h=>`<th scope="col">${E(h)}</th>`).join('')}</tr></thead><tbody>${body.map(c=>`<tr>${c.map((v,i)=>i===0?`<th scope="row">${E(v)}</th>`:`<td>${E(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function speedRecordBody(b){
 const r=data.records.find(r=>r.brandId===b.id);
 return `<div class="speed-record-head"><span class="tag">${E(labels[r.status])}</span><span class="muted">检索 ${data.checkedDate}</span></div><p>来源：<a href="${E(r.url)}" target="_blank" rel="noopener noreferrer">${E(r.publisher)} · 查看测速原文 ↗</a>。以下为其他发布者的资料，本站未独立测速，未确认其当前订阅与站长提供的入口完全一致。</p><dl class="speed-context"><div><dt>采样日期</dt><dd>${E(r.testDate||'未可靠确认')}${r.time?' · '+E(r.time):''}</dd></div><div><dt>测试条件</dt><dd>${E(r.environment)}</dd></div><div><dt>测试工具</dt><dd>${E(r.tool)}</dd></div><div><dt>样本口径</dt><dd>${r.sampleCount?r.kind==='raw-node'?`采用的转录表含${r.sampleCount}个节点行（排除账户信息行），不等于当前节点总数。`:`来源记录${r.sampleCount}个地区节点；仅该次采样。`:'未取得完整节点样本数，不推算通过率。'}</dd></div></dl>${r.dateNote?`<p class="muted">${E(r.dateNote)}</p>`:''}${table(r,b.name)}${r.kind==='raw-node'?'<p class="table-foot">原图MB、KB、B缺少明确时间分母，保持原值，不换算为Mbps或MB/s；0B为当次零结果，0ms不能解释为真实零延迟。手机可左右滑动查看表格。</p>':''}<div class="notice"><strong>这份资料需要注意</strong><ul>${r.limitations.map(s=>`<li>${E(s)}</li>`).join('')}</ul></div><p><strong>本站判断：</strong>${E(r.analysis)}</p><div class="inline-links">${r.image?`<a href="${E(r.image)}" target="_blank" rel="noopener noreferrer">查看发布者图证 ↗</a>`:''}${r.sources.map(s=>`<a href="${E(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.label)} ↗</a>`).join('')}<a href="../../updates/#speed-reports">浏览28个品牌的测速资料状态 →</a></div>`;
}
export const renderSpeedRecord=b=>`<section class="prose-block speed-record" id="speed-records"><p class="eyebrow">SPEED EVIDENCE / 看数据，也看条件</p><h2>${E(b.name)}测速资料与使用判断</h2>${speedRecordBody(b)}</section>`;
export function speedOverview(brands){return `<section class="library-section" id="speed-reports"><p class="eyebrow">SPEED RECORDS / 28 个品牌</p><h2>机场测速资料：逐家看来源与条件</h2><p>本轮整理于${data.checkedDate}：22个品牌保留外部报告中的数值，3个只提供图证参考，灵动云图证有疑点未采用数值，飞V与浪网未找到可采用的记录。22个有数值的品牌中，也包含日期、品牌归属或测试条件需补核的记录，均逐项说明。</p><p>本站没有购买订阅或自行测速。不同品牌的采样日期、带宽、线程与工具不同，这个目录按原品牌清单排序，不是速度排名。重复转载的图证不算多份独立测试。</p><div class="table-scroll"><table><caption>28家外部资料状态；日期为测试采样日期，无法可靠确认时明确保留空缺</caption><thead><tr><th>品牌</th><th>证据状态</th><th>采样日期</th><th>条件概况</th><th>原发布者</th></tr></thead><tbody>${brands.map(b=>{const r=data.records.find(r=>r.brandId===b.id);return `<tr><th scope="row"><a href="../brands/${b.id}/#speed-records">${E(b.name)} · 查看记录 →</a></th><td>${E(labels[r.status])}</td><td>${E(r.testDate||'未可靠确认')}${r.time?`<small>${E(r.time)}</small>`:''}</td><td>${E(r.environment)}</td><td><a href="${E(r.url)}" target="_blank" rel="noopener noreferrer">${E(r.publisher)} ↗</a></td></tr>`;}).join('')}</tbody></table></div></section>`;}
