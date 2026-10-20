export default function PlanSVG({w,h,rooms}){const s=6;
  return <svg viewBox={`-4 -4 ${w*s+8} ${h*s+8}`} className="w-full rounded bg-mist" role="img" aria-label="2D concept plan">
  <rect x="0" y="0" width={w*s} height={h*s} fill="none" stroke="#14283C" strokeWidth="3"/>
  {rooms.map((r,i)=><g key={i}><rect x={r.x*s} y={r.y*s} width={r.w*s} height={r.h*s} fill="#fff" fillOpacity=".6" stroke="#2F5D85"/>
  <text x={(r.x+r.w/2)*s} y={(r.y+r.h/2)*s} fontSize="9" textAnchor="middle" fill="#14283C">{r.name}</text></g>)}</svg>}
