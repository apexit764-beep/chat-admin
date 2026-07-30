function u(t,e,n){if(!e.length)return;const i=Object.keys(e[0]??{}).map(o=>({key:o,label:o})),c=i.map(o=>d(String(o.label))).join(","),l=e.map(o=>i.map(m=>d(String(o[m.key]??""))).join(",")),s="\uFEFF",p=new Blob([s+[c,...l].join(`
`)],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(p),a=document.createElement("a");a.href=r,a.download=t,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(r)}function d(t){return/[",\n]/.test(t)?`"${t.replace(/"/g,'""')}"`:t}function b(t,e){const n=window.open("","_blank","width=900,height=700");n&&(n.document.write(`<!doctype html><html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8" />
  <title>${h(t)}</title>
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
<body>${e}</body></html>`),n.document.close(),n.onload=()=>{setTimeout(()=>{n.focus(),n.print()},250)})}function h(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}export{u as d,b as p};
