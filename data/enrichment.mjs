import fs from 'node:fs';
const brands=JSON.parse(fs.readFileSync(new URL('./brands.json',import.meta.url),'utf8'));
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table=(caption,headers,rows)=>`<div class="table-scroll"><table><caption>${caption}</caption><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export function enrichGuides(guides){
 const first=guides.find(a=>a.id==='first-purchase');
 const scenarios=[{gb:50,budget:20},{gb:150,budget:30},{gb:200,budget:30}];
 const rows=scenarios.map(({gb,budget})=>{const candidates=brands.flatMap(b=>{const p=b.plans.filter(p=>p.cycle==='月付'&&p.gb!==null&&p.gb>=gb&&p.price<=budget).sort((a,c)=>a.price-c.price)[0];return p?[{b,p}]:[];}).sort((a,c)=>a.p.price-c.p.price).slice(0,3);return [`${gb}GB / 月`,`¥${budget} / 月`,candidates.map(({b,p})=>`<a href="../../brands/${b.id}/#plans">${E(b.name)}</a>：${E(p.name)}，¥${p.price}，${p.gb}GB`).join('<br>')||'当前资料中未找到匹配档位'];});
 first.sections.push({heading:'把首次预算落实到三个用量场景',paragraphs:['下面把假设月用量与首次月付上限固定，再从已收录的月付档中寻找容量足够、金额不超预算的候选。每个场景仅展示金额最低的前三家；不是服务质量排行。', '有些品牌的最低档不足以覆盖需求，因此应按符合用量的档位比较。点击候选查看全部套餐与来源，再确认当前是否在售；不把年付折合价混入月付预算。'],html:table('首次月付筛选算例 · 第三方参考，未计优惠与倍率',['假设用量','首次预算','参考候选'],rows)+'<p><a href="../../select/">换成自己的预算和实际流量，重新筛选 →</a></p>'});
 const cost=guides.find(a=>a.id==='cost-per-gb'),b=brands.find(b=>b.id==='kuaili');
 cost.sections.push({heading:'同一品牌的两个档位，按实际用量再算一次',paragraphs:['以快狸资料中的月付档为例，固定每月实际使用 40GB，再比较标称容量与真正支出。下表不计算节点倍率，不证明两个档位有相同线路或其他权益。','若每月需求增加到 200GB，50GB 档就不满足容量要求；这时不能继续因为首次价格低而把它当成候选。单位成本只有在满足条件后才有比较意义。'],html:table('快狸参考月包 · 假设实际用量 40GB/月',['套餐','月付金额','标称流量','标称元/GB','按实际 40GB 计算'],b.plans.filter(p=>p.cycle==='月付'&&p.gb!==null).slice(0,2).map(p=>[E(p.name),'¥'+p.price,p.gb+'GB','¥'+(p.price/p.gb).toFixed(3),'¥'+(p.price/40).toFixed(3)+'/实际 GB']))+'<p><a href="../../brands/kuaili/#sources">查看套餐来源</a> · <a href="../../compare/">勾选品牌，比较实际金额</a></p>'});
 const coupon=guides.find(a=>a.id==='coupon-validation');
 coupon.sections.push({heading:'保存一次能复核的优惠验证记录',paragraphs:['实际核验时，应记录优惠输入前后的同一订单，而不是只保存一张“复制成功”的提示。记录字段包括：品牌与套餐名、周期和流量、原价、实付、验证日期、首购或续费、适用条件。', '计算减免金额 = 原价 − 实付；只有套餐规格、付款周期和其他费用均一致时，才适合计算减免比例 = 减免金额 ÷ 原价。原价为零、活动叠加或套餐变更时，不能直接据此推断优惠码折扣。', '本站 11 个优惠码当前仍待结算验证。读者反馈不会自动变成“已验证”；提交资料时请遮挡账号、订单号、支付信息与订阅链接。'],html:table('填写模板 · 空白字段表示尚无验证数据',['项目','应记录的内容'],[['订单规格','套餐名、付款周期、流量口径'],['金额依据','同一订单输入优惠前的原价与之后的实付'],['适用范围','首购 / 续费、新老用户、活动叠加情况'],['验证时间','真实日期，以及官方结算页依据']])+'<p><a href="../../updates/">查看目前资料与优惠核验状态</a> · <a href="../../contact/">提交有依据的更正</a></p>'});
}
