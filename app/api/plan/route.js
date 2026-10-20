import {layout} from "@/lib/plan";
const used=new Map(); // demo quota store; use a DB keyed by user id in production
export async function POST(req){
  const {w,h,bhk,notes=""}=await req.json();
  const uid=req.headers.get("x-user-id")||"anon",wk=Math.floor(Date.now()/6048e5),key=uid+wk,max=+process.env.AI_WEEKLY_QUOTA||3;
  if((used.get(key)||0)>=max)return Response.json({error:`Weekly limit of ${max} AI plans reached.`},{status:429});
  used.set(key,(used.get(key)||0)+1);
  let rooms=null,source="fallback";
  if(process.env.OPENROUTER_API_KEY){try{
    const r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",
      headers:{Authorization:"Bearer "+process.env.OPENROUTER_API_KEY,"Content-Type":"application/json"},
      body:JSON.stringify({model:process.env.AI_MODEL||"meta-llama/llama-3.3-70b-instruct:free",messages:[
        {role:"system",content:"You design simple 2D residential concept layouts. Reply ONLY with a JSON array of rooms: [{\"name\":string,\"x\":number,\"y\":number,\"w\":number,\"h\":number}] in feet, origin top-left, rooms must tile inside the plot without overlap. No prose."},
        {role:"user",content:`Plot ${w}x${h} ft, ${bhk} BHK. Notes: ${String(notes).slice(0,300)}`}]})});
    const j=await r.json(),txt=j.choices?.[0]?.message?.content||"",m=txt.match(/\[[\s\S]*\]/);
    const a=m&&JSON.parse(m[0]);
    if(Array.isArray(a)&&a.length>=3&&a.every(o=>["x","y","w","h"].every(k=>typeof o[k]==="number"&&o[k]>=0)&&o.x+o.w<=w+0.5&&o.y+o.h<=h+0.5)){rooms=a;source="ai"}
  }catch(e){}}
  return Response.json({rooms:rooms||layout(w,h,bhk),source});}
