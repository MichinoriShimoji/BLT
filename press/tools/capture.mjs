// Render a local page to PNG through an already-running headless Chrome.
//   node capture.mjs <url> <out.png> [width] [height] [deviceScaleFactor]
// Waits for document.title === 'SHOT-READY' before shooting; set STATIC=1 for
// pages that have no such signal (a plain layout with no async setup).
// Chrome must be listening on port 9333 — see ../README.md.
const PORT=9333;
const target=process.argv[2];
const out=process.argv[3]||'app_raw.png';
const W=+(process.argv[4]||1500), H=+(process.argv[5]||1050), DSF=+(process.argv[6]||2);
const fs=await import('node:fs');
const r=await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'});
const t=await r.json();
const ws=new WebSocket(t.webSocketDebuggerUrl);
let id=0; const pend=new Map();
const send=(m,p={})=>new Promise((res,rej)=>{const i=++id;pend.set(i,[res,rej]);ws.send(JSON.stringify({id:i,method:m,params:p}));});
ws.onmessage=e=>{const d=JSON.parse(e.data);if(d.id&&pend.has(d.id)){const[res,rej]=pend.get(d.id);pend.delete(d.id);d.error?rej(new Error(JSON.stringify(d.error))):res(d.result);}};
await new Promise(r=>ws.onopen=r);
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:DSF,mobile:false});
await send('Page.navigate',{url:target});
const evalJs=async expr=>{const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true});return r.result.value;};
let ok=false;
const STATIC=process.env.STATIC==='1';
for(let i=0;i<(STATIC?4:120);i++){
  await new Promise(r=>setTimeout(r,500));
  try{ const title=await evalJs('document.title'); if(title==='SHOT-READY'){ok=true;break;} }catch(e){}
}
await new Promise(r=>setTimeout(r,1200));
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
fs.writeFileSync(out,Buffer.from(shot.data,'base64'));
console.log(STATIC?'STATIC':(ok?'READY':'TIMEOUT — page never set document.title to SHOT-READY'),'->',out);
process.exit(0);
