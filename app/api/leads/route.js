export async function POST(req){const b=await req.json();
  // TODO: persist to your DB / CRM as a professional lead
  console.log("NEW PROFESSIONAL LEAD",b);return Response.json({ok:true,id:"L"+Date.now()});}
