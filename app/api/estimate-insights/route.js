import R from "@/data/rates.json";

function getEstimate(area,floors,city){
  const builtUpArea=area*floors;
  const rates=R.cities[city];
  const materials=R.norms.map(item=>{
    const quantity=Math.ceil(builtUpArea*item.perSqft*(1+R.wastage));
    return {item:item.item,amount:quantity*rates[item.key]};
  });
  const total=materials.reduce((sum,material)=>sum+material.amount,0);
  const largest=materials.reduce((current,material)=>material.amount>current.amount?material:current);
  return {builtUpArea,total,materials,largest};
}

function makeLocalInsights(area,floors,city,estimate){
  const perSqft=Math.round(estimate.total/estimate.builtUpArea);
  const suggestions=[
    `Request fresh written material quotes from at least two suppliers in ${city}; these indicative rates can change by brand, grade and delivery distance.`,
    `${estimate.largest.item} is the largest line in this estimate at about ₹${estimate.largest.amount.toLocaleString("en-IN")}. Compare equivalent grades and include transport before choosing a supplier.`,
    floors>1
      ?"For a multi-floor home, ask a licensed structural engineer to verify the design and quantities before purchasing steel or concrete materials."
      :"Confirm the foundation and structural design with a qualified local engineer before finalising material quantities."
  ];
  return {
    description:`Your ${estimate.builtUpArea.toLocaleString("en-IN")} sq ft, ${floors}-floor home in ${city} has an indicative core-material estimate of ₹${estimate.total.toLocaleString("en-IN")} (about ₹${perSqft.toLocaleString("en-IN")} per sq ft). This estimate includes the ${Math.round(R.wastage*100)}% material-wastage allowance and reflects rates updated ${R.updated}.`,
    suggestions
  };
}

function parseInsights(text){
  const match=text.match(/\{[\s\S]*\}/);
  if(!match)return null;
  const result=JSON.parse(match[0]);
  if(typeof result.description!=="string"||!Array.isArray(result.suggestions))return null;
  const suggestions=result.suggestions.filter(item=>typeof item==="string").slice(0,4);
  if(!suggestions.length)return null;
  return {description:result.description,suggestions};
}

export async function POST(req){
  let body;
  try{body=await req.json()}catch{return Response.json({error:"Request body must be valid JSON."},{status:400})}
  const area=Number(body.area),floors=Number(body.floors),city=body.city;
  if(!Number.isInteger(area)||area<100||area>10000||!Number.isInteger(floors)||floors<1||floors>4||typeof city!=="string"||!Object.hasOwn(R.cities,city)){
    return Response.json({error:"Choose a valid area, floor count and city."},{status:400});
  }

  const estimate=getEstimate(area,floors,city);
  const localInsights=makeLocalInsights(area,floors,city,estimate);
  const apiKey=process.env.OPENROUTER_API_KEY;
  if(!apiKey)return Response.json({...localInsights,source:"local"});

  try{
    const response=await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",
      headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"},
      signal:AbortSignal.timeout(12000),
      body:JSON.stringify({
        model:process.env.AI_MODEL||"meta-llama/llama-3.3-70b-instruct:free",
        messages:[
          {role:"system",content:"You are a cautious home-building planning assistant. Given an indicative core-material estimate, return ONLY a JSON object with a short factual description string and an array of exactly 3 practical suggestions. Never imply this is a final construction quote or replace a licensed engineer."},
          {role:"user",content:JSON.stringify({area:estimate.builtUpArea,floors,city,total:estimate.total,materials:estimate.materials,ratesUpdated:R.updated})}
        ]
      })
    });
    if(!response.ok)throw new Error(`AI provider returned HTTP ${response.status}.`);
    const payload=await response.json();
    const generated=parseInsights(payload.choices?.[0]?.message?.content||"");
    if(!generated)throw new Error("AI provider returned an invalid project summary.");
    return Response.json({...generated,source:"ai"});
  }catch(error){
    const reason=error.name==="TimeoutError"?"The AI service took too long to respond.":error.message||"The AI service is temporarily unavailable.";
    return Response.json({...localInsights,source:"local-fallback",notice:`${reason} Showing data-based suggestions instead.`});
  }
}
