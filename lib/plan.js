// Deterministic 2D concept layout (feet). Used for the preset library and as AI fallback.
export function layout(w,h,bhk){
  const rooms=[],bh=Math.round(h*0.5),bw=w/bhk;
  for(let i=0;i<bhk;i++)rooms.push({name:i?`Bed ${i+1}`:"Master bed",x:+(i*bw).toFixed(1),y:0,w:+bw.toFixed(1),h:bh});
  const lw=Math.round(w*0.5),kw=Math.round(w*0.25);
  rooms.push({name:"Living",x:0,y:bh,w:lw,h:h-bh},{name:"Kitchen",x:lw,y:bh,w:kw,h:h-bh},{name:"Bath",x:lw+kw,y:bh,w:w-lw-kw,h:h-bh});
  return rooms}
const S=[[20,30],[25,40],[30,40],[30,50],[40,60]];
export const PLANS=S.flatMap(([w,h])=>[1,2].flatMap(fl=>[1,2,3,4].map(b=>({id:`${w}x${h}-${fl}-${b}`,w,h,floors:fl,bhk:b,budget:Math.round(w*h*fl*(1500+b*60)/1e5)/10,rooms:layout(w,h,b)}))));
