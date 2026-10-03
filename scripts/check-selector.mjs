import assert from 'node:assert/strict';
import {selectPlans} from '../assets/selector.js';
const fixture=[{id:'sample',name:'样例',plans:[
 {name:'月付',price:20,gb:200,cycle:'月付'},
 {name:'月付扩容',price:30,gb:500,cycle:'月付'},
 {name:'年付',price:120,gb:200,cycle:'年付'},
 {name:'一次性',price:50,gb:500,cycle:'一次性'},
 {name:'容量未知',price:1,gb:null,cycle:'月付'}
]}];
assert.equal(selectPlans(fixture,{budget:20,traffic:200}).rows[0].plan.name,'月付');
assert.equal(selectPlans(fixture,{budget:19.99,traffic:200}).rows.length,0);
assert.equal(selectPlans(fixture,{budget:30,traffic:200,multiplier:2,reserve:20}).required,480);
assert.equal(selectPlans(fixture,{budget:30,traffic:200,multiplier:2,reserve:20}).rows[0].plan.name,'月付扩容');
assert.equal(selectPlans(fixture,{cycle:'年付',budget:10,traffic:200}).rows.length,0,'Annual cash budget must not use amortized monthly price');
const annual=selectPlans(fixture,{cycle:'年付',budget:120,traffic:200}).rows[0];
assert.equal(annual.monthlyCost,10);assert.equal(annual.unitCost,.05);
const once=selectPlans(fixture,{cycle:'一次性',budget:50,traffic:500}).rows[0];
assert.equal(once.monthlyCost,null);assert.equal(once.unitCost,.1);
assert.equal(selectPlans(fixture,{cycle:'一次性',budget:50,traffic:500.01}).rows.length,0);
assert.equal(selectPlans(fixture,{budget:100,traffic:1}).rows[0].plan.name,'月付','Unknown quota must never match');
assert.throws(()=>selectPlans(fixture,{budget:NaN}));assert.throws(()=>selectPlans(fixture,{traffic:0}));assert.throws(()=>selectPlans(fixture,{multiplier:-1}));
console.log('PASS: selector payment periods, exact budget and quota boundaries, multiplier, reserve, unknown data and invalid inputs.');
