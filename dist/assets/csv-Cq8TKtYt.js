import{ai as u,ak as s,C as g,af as c}from"./index-BggLmXCK.js";import{a as f,T as b}from"./trending-up-BVDwjvUg.js";/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=u("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);function k({label:e,value:t,icon:a,iconBg:r="bg-primary/15",iconColor:d="text-primary",trend:n}){return s.jsxs(g,{className:"p-5 hover:shadow-card-hover transition-shadow",children:[s.jsxs("div",{className:"flex items-start justify-between mb-3",children:[s.jsx("div",{className:c("h-11 w-11 rounded-card flex items-center justify-center",r,d),children:a}),n&&s.jsxs("span",{className:c("inline-flex items-center gap-1 text-small font-semibold px-2 py-1 rounded-md",n.positive?"bg-success/15 text-success":"bg-danger/15 text-danger"),children:[n.positive?s.jsx(f,{className:"h-3 w-3"}):s.jsx(b,{className:"h-3 w-3"}),n.value,"%"]})]}),s.jsxs("div",{className:"space-y-1",children:[s.jsx("p",{className:"text-small text-muted-light dark:text-muted-dark",children:e}),s.jsx("p",{className:"text-h1 font-bold",children:t})]})]})}function N(e,t,a){if(!t.length)return;const r=Object.keys(t[0]??{}).map(o=>({key:o,label:o})),d=r.map(o=>m(String(o.label))).join(","),n=t.map(o=>r.map(x=>m(String(o[x.key]??""))).join(",")),p="\uFEFF",h=new Blob([p+[d,...n].join(`
`)],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(h),i=document.createElement("a");i.href=l,i.download=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(l)}function m(e){return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function C(e,t){const a=window.open("","_blank","width=900,height=700");a&&(a.document.write(`<!doctype html><html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8" />
  <title>${y(e)}</title>
  <style>
    body { font-family: 'Tajawal', system-ui, sans-serif; padding: 24px; color: #111827; }
    h1, h2, h3 { margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border-bottom: 1px solid #E5E7EB; padding: 8px 10px; text-align: start; font-size: 13px; }
    th { background: #F8F9FC; font-weight: 600; }
    .muted { color: #6B7280; font-size: 12px; }
    .right { text-align: end; }
    @media print { @page { margin: 12mm; } }
  </style>
</head>
<body>${t}</body></html>`),a.document.close(),a.onload=()=>{setTimeout(()=>{a.focus(),a.print()},250)})}function y(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}export{v as D,k as S,N as d,C as p};
