export function quotaLabel(p){
 if(p.quotaPeriod==='year-total')return p.quotedGb+'GB/年（外部原图）';
 if(p.gb==null)return p.quotedGb? p.quotedGb+'GB · 重置周期待核验':'流量待核验';
 return p.gb+'GB'+(p.cycle==='一次性'?' 总量':'/月');
}
export function unitPrice(p){if(p.quotaPeriod==='year-total')return p.price/p.quotedGb;if(p.gb==null)return null;return p.price/(p.gb*(p.cycle==='年付'?12:1));}
