import{ai as a,am as t,ak as e,aa as Z,z as O,a8 as r,ab as c,e as d,a9 as x,R as M,al as X,ag as Y}from"./index-DVlvOVOh.js";import{B}from"./badge-K4w7C-Nl.js";import L from"./Dashboard-BvjYksDl.js";import"./LineChart-Cbszmd_K.js";import"./money-UIU2a6ih.js";import"./format-CxDstj_w.js";import"./dollar-sign-BcaeA0-F.js";import"./trending-up-CCP2qxY5.js";/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=a("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=a("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=a("MousePointer",[["path",{d:"m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z",key:"y2ucgo"}],["path",{d:"m13 13 6 6",key:"1nhxnf"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=a("Move",[["polyline",{points:"5 9 2 12 5 15",key:"1r5uj5"}],["polyline",{points:"9 5 12 2 15 5",key:"5v383o"}],["polyline",{points:"15 19 12 22 9 19",key:"g7qi8m"}],["polyline",{points:"19 9 22 12 19 15",key:"tpp73q"}],["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=a("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=a("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=a("Tablet",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=a("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=a("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]),K={desktop:{w:1440,h:900,label:"1440 × 900"},tablet:{w:768,h:1024,label:"768 × 1024"},mobile:{w:375,h:812,label:"375 × 812"}},b=[.15,.25,.33,.5,.67,.75,1];function oe(){const[m,C]=t.useState("desktop"),[h,u]=t.useState(.5),[i,z]=t.useState(!1),[y,p]=t.useState({x:0,y:0}),k=t.useRef(null),o=t.useRef(null),{w:j,h:f,label:S}=K[m],I=t.useCallback(()=>{u(s=>b.find(n=>n>s+.001)??s)},[]),R=t.useCallback(()=>{u(s=>[...b].reverse().find(n=>n<s-.001)??s)},[]),T=t.useCallback(()=>{u(.5),p({x:0,y:0})},[]),D=t.useCallback(()=>{if(!k.current)return;const s=k.current.getBoundingClientRect(),l=(s.width-80)/j,n=(s.height-80)/f,g=Math.min(l,n,1),E=b.reduce((w,N)=>Math.abs(N-g)<Math.abs(w-g)?N:w);u(E),p({x:0,y:0})},[j,f]),P=t.useCallback(s=>{i&&(s.preventDefault(),o.current={x:s.clientX,y:s.clientY,panX:y.x,panY:y.y})},[i,y]),q=t.useCallback(s=>{if(!o.current)return;const l=s.clientX-o.current.x,n=s.clientY-o.current.y;p({x:o.current.panX+l,y:o.current.panY+n})},[]),v=t.useCallback(()=>{o.current=null},[]);return e.jsx(Z,{delayDuration:300,children:e.jsxs("div",{className:"flex flex-col h-[calc(100vh-56px)]",children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2.5 border-b bg-card flex-shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(O,{className:"h-4 w-4 text-primary"}),e.jsx("h1",{className:"text-body font-bold",children:"معاينة لوحة التحكم"})]}),e.jsx("div",{className:"flex items-center gap-1",children:[{key:"desktop",Icon:V,tooltip:"سطح المكتب"},{key:"tablet",Icon:G,tooltip:"جهاز لوحي"},{key:"mobile",Icon:F,tooltip:"هاتف"}].map(({key:s,Icon:l,tooltip:n})=>e.jsxs(r,{children:[e.jsx(c,{asChild:!0,children:e.jsx(d,{variant:m===s?"default":"ghost",size:"icon",className:"h-8 w-8",onClick:()=>{C(s),p({x:0,y:0})},children:e.jsx(l,{className:"h-4 w-4"})})}),e.jsx(x,{children:n})]},s))}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsxs(r,{children:[e.jsx(c,{asChild:!0,children:e.jsx(d,{variant:i?"default":"ghost",size:"icon",className:"h-8 w-8",onClick:()=>z(!i),children:i?e.jsx(A,{className:"h-4 w-4"}):e.jsx(_,{className:"h-4 w-4"})})}),e.jsx(x,{children:i?"وضع المؤشر":"وضع السحب"})]}),e.jsx(M,{orientation:"vertical",className:"mx-1 h-5"}),e.jsxs(r,{children:[e.jsx(c,{asChild:!0,children:e.jsx(d,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:R,children:e.jsx(J,{className:"h-4 w-4"})})}),e.jsx(x,{children:"تصغير"})]}),e.jsxs("span",{className:"text-small font-mono font-semibold w-12 text-center tabular-nums",children:[Math.round(h*100),"%"]}),e.jsxs(r,{children:[e.jsx(c,{asChild:!0,children:e.jsx(d,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:I,children:e.jsx(H,{className:"h-4 w-4"})})}),e.jsx(x,{children:"تكبير"})]}),e.jsx(M,{orientation:"vertical",className:"mx-1 h-5"}),e.jsxs(r,{children:[e.jsx(c,{asChild:!0,children:e.jsx(d,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:D,children:e.jsx(U,{className:"h-4 w-4"})})}),e.jsx(x,{children:"ملائمة"})]}),e.jsxs(r,{children:[e.jsx(c,{asChild:!0,children:e.jsx(d,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:T,children:e.jsx($,{className:"h-4 w-4"})})}),e.jsx(x,{children:"إعادة تعيين"})]})]})]}),e.jsx("div",{ref:k,className:Y("flex-1 overflow-hidden bg-[#f0f0f0] dark:bg-[#1a1a1a] relative",i?"cursor-grab active:cursor-grabbing":"cursor-default"),style:{backgroundImage:"radial-gradient(circle, #d1d5db 1px, transparent 1px)",backgroundSize:"24px 24px"},onMouseDown:P,onMouseMove:q,onMouseUp:v,onMouseLeave:v,children:e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx(X.div,{animate:{x:y.x,y:y.y},transition:{type:"tween",duration:.1},children:e.jsxs("div",{className:"relative overflow-hidden",style:{width:j*h,height:f*h},children:[e.jsx("div",{className:"absolute -inset-[2px] rounded-xl border-2 border-border shadow-2xl pointer-events-none z-10"}),e.jsx("div",{className:"absolute -bottom-7 left-1/2 -translate-x-1/2 z-10",children:e.jsxs(B,{variant:"secondary",className:"text-[10px] font-mono whitespace-nowrap",children:[S," · ",Math.round(h*100),"%"]})}),e.jsx("div",{className:"origin-top-left bg-white dark:bg-[#0f172a] rounded-lg overflow-hidden absolute top-0 left-0",style:{width:j,height:f,transform:`scale(${h})`,transformOrigin:"top left"},children:e.jsx("div",{className:"w-full h-full overflow-auto",dir:"rtl",children:e.jsx(L,{})})})]})})})}),e.jsxs("div",{className:"flex items-center justify-between px-4 py-1.5 border-t bg-card text-[10px] text-muted-foreground flex-shrink-0",children:[e.jsxs("span",{children:["لوحة الإدارة · ",m==="desktop"?"سطح المكتب":m==="tablet"?"جهاز لوحي":"هاتف"]}),e.jsx("span",{children:"معاينة مباشرة"})]})]})})}export{oe as default};
