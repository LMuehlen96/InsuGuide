const MMOL=18.0182;
function roundHalf(x){return Math.round(x*2)/2;}
function computeDose(bzMgdl,be,p){
  const essen=be*p.be;
  const korr=((bzMgdl-p.max)/p.kwert)*p.kfak;
  const totalRaw=p.grund+essen+korr;
  const total=Math.max(0,totalRaw);
  return {essen,korr,totalRaw,total,rounded:roundHalf(total)};
}
const cases=[
 ["Morgens normal",200,4,{min:100,max:140,grund:0,be:2.0,kwert:30,kfak:2.0},12],
 ["Mittags im Korridor (neg. Korr)",120,3,{min:100,max:140,grund:0,be:1.0,kwert:40,kfak:1.0},2.5],
 ["Nachts Hypo -> Floor 0",60,0,{min:120,max:160,grund:0,be:1.0,kwert:50,kfak:1.0},0],
 ["Abends Rundung",175,2,{min:100,max:140,grund:0,be:1.5,kwert:40,kfak:1.5},4.5],
 ["Morgens +Grundmenge",180,4,{min:100,max:140,grund:2,be:2.0,kwert:30,kfak:2.0},null],
];
let ok=true;
for(const [name,bz,be,p,exp] of cases){
  const r=computeDose(bz,be,p);
  const pass=exp===null?"—":(Math.abs(r.rounded-exp)<1e-9?"PASS":"FAIL");
  if(pass==="FAIL")ok=false;
  console.log(`${pass.padEnd(4)} | ${name}`);
  console.log(`       essen=${r.essen.toFixed(3)} korr=${r.korr.toFixed(4)} raw=${r.totalRaw.toFixed(4)} -> ${r.rounded} IE (erwartet ${exp})`);
}
// mmol Fall: 10 mmol/l Frühstück
const bz=10*MMOL;
const r=computeDose(bz,4,{min:100,max:140,grund:0,be:2.0,kwert:30,kfak:2.0});
console.log(`mmol | 10 mmol/l (=${bz.toFixed(1)} mg/dl): raw=${r.totalRaw.toFixed(4)} -> ${r.rounded} IE`);
console.log(ok?"\nALLE PFLICHT-TESTS BESTANDEN":"\nFEHLER!");
