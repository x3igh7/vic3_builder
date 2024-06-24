(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(9502)}])},8961:function(e,t,n){"use strict";var o=n(7294),u=n(3308);t.Z=()=>{let[e,t]=(0,o.useState)([]),[n,r]=(0,o.useState)([]),[i,d]=(0,o.useState)([]),[a,l]=(0,u._)([],"settings");(0,o.useEffect)(()=>{fetch("data/buildings.json").then(e=>e.json()).then(e=>t(e)),fetch("data/production_method_groups.json").then(e=>e.json()).then(e=>r(e)),fetch("data/production_methods.json").then(e=>e.json()).then(e=>d(e))},[]);let s=()=>e.map(e=>({name:e.name,unlocking_technologies:e.unlocking_technologies||[],productionMethodGroups:n.filter(t=>e.production_method_groups.includes(t.name)).map(e=>{let t=i.find(t=>e.production_methods[0]===t.name);return{name:e.name,currentMethod:t}})})).sort((e,t)=>e.name.localeCompare(t.name));return(0,o.useEffect)(()=>{0===a.length&&e.length&&n.length&&i.length&&l(s())},[a,e,n,i]),{buildings:e,productionMethodGroups:n,productionMethods:i,settings:a,getDefaultSettings:s}}},9502:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return q}});var o=n(4386),u=n(7294),r=n(7154),i=n(4182),d=n(917),a=e=>{let{buildings:t,selectedBuilding:n,buildingQuantity:a,onSelectedBuildingChange:l,onBuildingQuantityChange:s}=e,[c,m]=(0,u.useState)(),[h,g]=(0,u.useState)([]);return(0,u.useEffect)(()=>{g(t)},[t]),(0,u.useEffect)(()=>{n&&m(n.name)},[n]),(0,o.BX)("div",{children:[(0,o.BX)("div",{css:(0,d.iv)({marginBottom:"1rem"}),children:[(0,o.tZ)("label",{htmlFor:"buildingSelector",css:(0,d.iv)({marginRight:"1rem"}),children:"Building Type"}),(0,o.tZ)(r.Q,{inputId:"buildingSelector",field:"name",suggestions:h,value:c,completeMethod:e=>{g(t.filter(t=>t.name.toLowerCase().includes(e.query.toLowerCase())))},onChange:e=>{m(e.value)},onSelect:e=>{l(e.value)},dropdown:!0,dropdownMode:"current",forceSelection:!0})]}),(0,o.BX)("div",{children:[(0,o.tZ)("label",{htmlFor:"quantityInput",css:(0,d.iv)({marginRight:"1rem"}),children:"Quantity"}),(0,o.tZ)(i.R,{inputId:"quantityInput",value:a,onChange:e=>{s(e.value)}})]})]})},l=n(8961);let s=e=>e.productionMethodGroups.flatMap(e=>e.currentMethod.inputs?e.currentMethod.inputs:[]).reduce((e,t)=>e.some(e=>e.good===t.good)?[...e.map(e=>(e.good===t.good&&(e.amount+=t.amount),e))]:[...e,t],[]),c=e=>e.productionMethodGroups.flatMap(e=>e.currentMethod.outputs?e.currentMethod.outputs:[]).reduce((e,t)=>e.some(e=>e.good===t.good)?[...e.map(e=>(e.good===t.good&&(e.amount+=t.amount),e))]:[...e,t],[]),m=(e,t)=>t.filter(t=>t.productionMethodGroups.some(t=>{var n;return null===(n=t.currentMethod.outputs)||void 0===n?void 0:n.some(t=>t.good===e)})),h=(e,t)=>{var n,o;return null===(o=e.productionMethodGroups.find(e=>{var n;return null===(n=e.currentMethod.outputs)||void 0===n?void 0:n.some(e=>e.good===t)}))||void 0===o?void 0:null===(n=o.currentMethod.outputs)||void 0===n?void 0:n.find(e=>e.good===t)},g=e=>e.flatMap(e=>[...e.totalInputs.map(e=>({...e}))]).reduce((e,t)=>e.some(e=>e.good===t.good)?[...e.map(e=>(e.good===t.good&&(e.amount+=t.amount),e))]:[...e,t],[]),p=e=>e.flatMap(e=>[...e.totalOutputs.map(e=>({...e}))]).reduce((e,t)=>e.some(e=>e.good===t.good)?[...e.map(e=>(e.good===t.good&&(e.amount+=t.amount),e))]:[...e,t],[]),f=e=>{let t=g(e),n=p(e);return t.map(e=>{let t=n.find(t=>t.good===e.good);return t?{good:e.good,amount:t.amount-e.amount}:{good:e.good,amount:0-e.amount}})},v=e=>{var t;return[...(null==e?void 0:e.unlocking_technologies)||[],...null===(t=e.productionMethodGroups)||void 0===t?void 0:t.flatMap(e=>{var t;return(null===(t=e.currentMethod)||void 0===t?void 0:t.unlocking_technologies)||[]})]},M=e=>e.filter(e=>{if(f(e).filter(e=>e.amount<0).length>0)return e}),B=(e,t,n,o)=>{let u=Math.ceil(-1*e.amount/t.amount),r=n.find(e=>e.name===o.name),i=r?r.quantity+u:u,d=c(o).map(e=>({...e,amount:e.amount*i})),a=s(o).map(e=>({...e,amount:e.amount*i}));return{name:o.name,requiredTechs:(null==r?void 0:r.requiredTechs)||v(o)||[],quantity:i,totalInputs:a,totalOutputs:d}},_=(e,t)=>{let n=M(e);if(!n.length)return e;let o=n[0],u=e.filter(e=>e!==o),r=f(o).filter(e=>e.amount<0);if(!r.length)return e;let i=r[0],d=m(i.good,t);if(!d.length)return e;let a=d.find(e=>o.some(t=>t.name===e.name));a||(a=d[0]),d.length>1&&d.filter(e=>e.name!==a.name).forEach(t=>{if(e.some(e=>e.some(e=>e.name===t.name)))return;let n=o.map(e=>({...e})),r=B(i,h(t,i.good),n,t);u.push([...n,r])});let l=h(a,i.good),s=B(i,l,o,a);return _([...u,[...o.filter(e=>e.name!==s.name),s]],t)},Z=(e,t,n)=>{let o={...n.find(t=>t.name===e.name)},u=s(o).map(e=>{let n=e.amount*t;return{...e,amount:n}}),r=c(o).map(e=>{let n=e.amount*t;return{...e,amount:n}}),i=[];return i.push({name:o.name,requiredTechs:v(o),quantity:t,totalInputs:u,totalOutputs:r}),_([i],n)};var X=e=>{let{selectedBuilding:t,quantity:n}=e,{settings:r}=(0,l.Z)(),[i,a]=(0,u.useState)([]);(0,u.useEffect)(()=>{t&&n&&a([...Z(t,n,r)])},[t,n,r]);let s=e=>e.map(e=>(0,o.BX)("div",{css:(0,d.iv)({"> *":{marginRight:"1rem"}}),children:[(0,o.BX)("label",{children:[e.name,": "]}),(0,o.tZ)("span",{css:(0,d.iv)({color:"#9eade6"}),children:e.quantity})]},e.name)),c=e=>{let t=f(e),n=p(e);return t.map(e=>{var t;let u=e.amount<0?"red":"green",r=(null===(t=n.find(t=>t.good===e.good))||void 0===t?void 0:t.amount)||0;return(0,o.BX)("div",{css:(0,d.iv)({"> *":{marginRight:"1rem"}}),children:[(0,o.tZ)("label",{children:e.good}),(0,o.BX)("span",{css:{color:"var(--text-color-secondary)"},children:["Total: ",r]}),(0,o.BX)("span",{css:{color:u},children:["Excess: ",e.amount]})]},e.good)})},m=e=>{let t=e.flatMap(e=>e.requiredTechs)||[];return t.length?t.map(e=>(0,o.tZ)("div",{children:(0,o.tZ)("label",{children:e})},e)):(0,o.tZ)("div",{children:"No technologies required"})};return t&&n?(0,o.BX)("div",{children:[(0,o.tZ)("h2",{children:"Building Chain Results"}),i.map((e,t)=>(0,o.BX)("div",{css:(0,d.iv)({display:"flex",flexDirection:"row",flexWrap:"wrap",gap:"1rem"}),children:[(0,o.BX)("div",{css:(0,d.iv)({flex:"1 auto"}),children:[(0,o.tZ)("h3",{children:"Buildings"}),s(e)]}),(0,o.BX)("div",{css:(0,d.iv)({flex:"1 auto"}),children:[(0,o.tZ)("h3",{children:"Output Deltas"}),c(e)]}),(0,o.BX)("div",{css:(0,d.iv)({flex:"1 auto"}),children:[(0,o.tZ)("h3",{children:"Required Technologies"}),m(e)]})]},t))]}):(0,o.tZ)("div",{})};function q(){let[e,t]=(0,u.useState)(),[n,r]=(0,u.useState)(5),{buildings:i}=(0,l.Z)();return(0,o.BX)("main",{children:[(0,o.tZ)("h1",{children:"Vic3 Builder"}),(0,o.tZ)(a,{buildings:i,selectedBuilding:e,buildingQuantity:n,onSelectedBuildingChange:e=>{t(e)},onBuildingQuantityChange:e=>{r(e)}}),(0,o.tZ)(X,{selectedBuilding:e,quantity:n})]})}}},function(e){e.O(0,[154,182,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);