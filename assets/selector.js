const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Number(n).toFixed(Number.isInteger(Number(n))?0:2);
export const defaults={budget:30,traffic:200,cycle:'月付',multiplier:1,reserve:0,sort:'price'};
export function selectPlans(brands,criteria){
 const q={...defaults,...criteria};
 for(const key of ['budget','traffic','multiplier','reserve'])q[key]=Number(q[key]);
 if(!Number.isFinite(q.budget)||q.budget<=0||q.budget>100000)throw Error('请输入大于 0 且不超过 100000 元的单次支付预算。');
 if(!Number.isFinite(q.traffic)||q.traffic<=0||q.traffic>1000000)throw Error('请输入大于 0 且不超过 1000000GB 的流量需求。');
 if(!Number.isFinite(q.multiplier)||q.multiplier<0.1||q.multiplier>10)throw Error('流量倍率请填写 0.1 至 10。');
 if(!Number.isFinite(q.reserve)||q.reserve<0||q.reserve>100)throw Error('预留比例请填写 0 至 100%。');
 if(!['月付','年付','一次性'].includes(q.cycle))throw Error('请选择一种付款周期。');
 const required=Math.ceil(q.traffic*q.multiplier*(1+q.reserve/100)*100-1e-8)/100;
 const rows=[];
 for(const brand of brands){
  if(brand.planAttribution==='disputed')continue;
  const candidates=brand.plans.filter(p=>p.cycle===q.cycle&&(!p.quotaPeriod||p.quotaPeriod===(q.cycle==='一次性'?'total':'month'))&&Number.isFinite(p.gb)&&p.gb>=required&&p.price<=q.budget&&p.price>0).sort((a,b)=>a.price-b.price||a.gb-b.gb);
  const plan=candidates[0];if(!plan)continue;
  rows.push({brand,plan,monthlyCost:q.cycle==='一次性'?null:plan.price/(q.cycle==='年付'?12:1),unitCost:plan.price/(plan.gb*(q.cycle==='年付'?12:1)),spare:plan.gb-required,required});
 }
 rows.sort((a,b)=>q.sort==='unit'?a.unitCost-b.unitCost||a.plan.price-b.plan.price:q.sort==='spare'?a.spare-b.spare||a.plan.price-b.plan.price:a.plan.price-b.plan.price||a.unitCost-b.unitCost);
 return {criteria:q,required,rows};
}
export function renderPlanCards(rows){
 return rows.map(({brand,plan,monthlyCost,unitCost,spare})=>`<article class="selector-card"><div class="article-meta"><span>第三方参考 · ${escapeHtml(plan.cycle)}</span><span>${escapeHtml(plan.sourceDate)}</span></div><h2><a href="../brands/${escapeHtml(brand.id)}/">${escapeHtml(brand.name)}</a></h2><p class="selector-plan">${escapeHtml(plan.name)}</p><div class="selector-metrics"><div><small>单次支付</small><strong>¥${money(plan.price)}</strong><span>${escapeHtml(plan.cycle)}</span></div><div><small>标称流量</small><strong>${money(plan.gb)}GB</strong><span>${plan.cycle==='一次性'?'总额度':'每月额度'}</span></div></div><p class="selector-calculation">${monthlyCost===null?'一次性包不计算折合月费':`折合 ¥${monthlyCost.toFixed(2)}/月${plan.cycle==='年付'?' · 仍需一次支付全年':''}`}<br>标称每 GB ¥${unitCost.toFixed(3)} · 按本次条件余量 ${money(spare)}GB</p><p class="selector-note">${escapeHtml(brand.note)}</p><a class="button secondary" href="../brands/${escapeHtml(brand.id)}/#plans">核对套餐与来源 ↗</a></article>`).join('');
}
export function describeSelection(result){const q=result.criteria;return `匹配 ${result.rows.length} 个品牌 · 需标称 ${money(result.required)}GB${q.cycle==='一次性'?'总流量':'/月'} · 倍率 ${q.multiplier} × 预留 ${q.reserve}% · 单次支付不超过 ¥${money(q.budget)}`;}
if(typeof document!=='undefined'){
 const form=document.querySelector('#selector-form');
 if(form){
  const brands=JSON.parse(document.querySelector('#selector-data').textContent),list=document.querySelector('#selector-results'),status=document.querySelector('#selector-status'),error=document.querySelector('#selector-error'),empty=document.querySelector('#selector-empty'),quota=document.querySelector('#selector-quota-label');
  const controls=form.elements;
  function update(){
   quota.textContent=controls.cycle.value==='一次性'?'需要的总流量（GB）':'每月实际用量（GB）';
   try{const q=Object.fromEntries(new FormData(form));const result=selectPlans(brands,q);error.hidden=true;list.innerHTML=renderPlanCards(result.rows);status.textContent=describeSelection(result);empty.hidden=result.rows.length!==0;}
   catch(e){error.hidden=false;error.textContent=e.message;list.replaceChildren();status.textContent='请先检查输入条件';empty.hidden=true;}
  }
  form.addEventListener('submit',e=>{e.preventDefault();update();});form.addEventListener('change',update);
  form.addEventListener('reset',()=>setTimeout(update,0));
  update();
 }
}
