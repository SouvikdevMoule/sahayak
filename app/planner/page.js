"use client";
import {useMemo,useState} from "react";
import {PLANS} from "@/lib/plan";
import PlanSVG from "@/components/PlanSVG";
import {useT} from "@/components/Shell";

export default function Page(){
  const {t}=useT();
  const [filters,setFilters]=useState({size:"",floors:"",bhk:"",budget:""});
  const [ai,setAi]=useState({w:30,h:40,bhk:2,notes:""});
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const updateFilter=key=>event=>setFilters(current=>({...current,[key]:event.target.value}));
  const sizes=[...new Set(PLANS.map(plan=>`${plan.w}x${plan.h}`))];
  const plans=useMemo(()=>PLANS.filter(plan=>
    (!filters.size||`${plan.w}x${plan.h}`===filters.size)
    &&(!filters.floors||plan.floors===Number(filters.floors))
    &&(!filters.bhk||plan.bhk===Number(filters.bhk))
    &&(!filters.budget||plan.budget<=Number(filters.budget))
  ),[filters]);
  async function generatePlan(event){
    event.preventDefault();
    if(ai.w<15||ai.w>100||ai.h<15||ai.h>100){setError("Choose plot dimensions between 15 and 100 feet.");return}
    setBusy(true);setError("");setResult(null);
    try{
      let id=localStorage.getItem("uid");
      if(!id){id=crypto.randomUUID();localStorage.setItem("uid",id)}
      const response=await fetch("/api/plan",{method:"POST",headers:{"Content-Type":"application/json","x-user-id":id},body:JSON.stringify(ai)});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Unable to generate a plan. Please try again.");
      setResult(data);
    }catch(requestError){
      setError(requestError.message||"Unable to connect. Please try again.");
    }finally{setBusy(false)}
  }
  return <div className="feature-page planner-page">
    <header className="feature-heading"><div><div className="eyebrow dark-eyebrow">SPACE TO IMAGINE</div><h1>{t("planner")}</h1><p>Explore a ready-made layout or create a simple concept to start the conversation.</p></div><span className="feature-heading-icon">⌂</span></header>

    <section className="planner-builder">
      <div className="planner-builder-copy"><span className="feature-kicker">YOUR IDEA, SKETCHED OUT</span><h2>A starting point<br/>for your floor plan.</h2><p>Share your plot dimensions and preferences. We’ll create a simple 2D concept you can discuss with an architect.</p><div className="concept-disclaimer"><span>i</span> Concept only — not a construction drawing or structural plan.</div></div>
      <form className="planner-form" onSubmit={generatePlan}>
        <div className="planner-form-title"><span>✳</span><div><h3>Generate a concept plan</h3><p>Free demo · Up to 3 generations per week</p></div></div>
        <div className="planner-form-fields">
          <label className="feature-label">Plot width<input required className="feature-input" type="number" min="15" max="100" value={ai.w} onChange={e=>setAi(current=>({...current,w:Number(e.target.value)}))}/><span>feet</span></label>
          <label className="feature-label">Plot depth<input required className="feature-input" type="number" min="15" max="100" value={ai.h} onChange={e=>setAi(current=>({...current,h:Number(e.target.value)}))}/><span>feet</span></label>
          <label className="feature-label">Bedrooms<select className="feature-input" value={ai.bhk} onChange={e=>setAi(current=>({...current,bhk:Number(e.target.value)}))}>{[1,2,3,4].map(number=><option key={number} value={number}>{number} BHK</option>)}</select></label>
        </div>
        <label className="feature-label planner-notes">What matters to you?<input className="feature-input" maxLength={300} placeholder="For example: east-facing, parking, puja room" value={ai.notes} onChange={e=>setAi(current=>({...current,notes:e.target.value}))}/></label>
        {error&&<p className="feature-error" role="alert">{error}</p>}
        <button className="feature-button planner-submit" disabled={busy}>{busy?<><span className="loading-spinner"/> Creating your concept…</>:<>Generate my plan <span>→</span></>}</button>
        {result&&<div className="generated-plan" aria-live="polite"><div className="generated-plan-heading"><strong>Your concept layout</strong><span>{result.source==="ai"?"AI-assisted":"Quick concept"}</span></div><PlanSVG w={ai.w} h={ai.h} rooms={result.rooms}/><p>Use this sketch as a discussion starter with a qualified local architect.</p></div>}
      </form>
    </section>

    <section className="library-section">
      <div className="library-heading"><div><div className="feature-kicker">READY WHEN YOU ARE</div><h2>Browse the plan library</h2><p>Filter by plot size, number of floors, bedrooms or indicative budget.</p></div><span className="library-count">{plans.length} <small>plans</small></span></div>
      <div className="library-filters">
        <label className="filter-field"><span>Plot size</span><select className="feature-input" value={filters.size} onChange={updateFilter("size")}><option value="">Any size</option>{sizes.map(size=><option key={size} value={size}>{size.replace("x"," × ")} ft</option>)}</select></label>
        <label className="filter-field"><span>Floors</span><select className="feature-input" value={filters.floors} onChange={updateFilter("floors")}><option value="">Any floors</option><option value="1">1 floor</option><option value="2">2 floors</option></select></label>
        <label className="filter-field"><span>Bedrooms</span><select className="feature-input" value={filters.bhk} onChange={updateFilter("bhk")}><option value="">Any bedroom count</option>{[1,2,3,4].map(number=><option key={number} value={number}>{number} BHK</option>)}</select></label>
        <label className="filter-field"><span>Max indicative budget</span><select className="feature-input" value={filters.budget} onChange={updateFilter("budget")}><option value="">Any budget</option>{[15,25,40,60,100].map(value=><option key={value} value={value}>₹{value} lakh</option>)}</select></label>
        <button className="clear-filters" type="button" onClick={()=>setFilters({size:"",floors:"",bhk:"",budget:""})} disabled={!Object.values(filters).some(Boolean)}>Clear filters</button>
      </div>
      {plans.length?<div className="plan-grid">{plans.map(plan=><article key={plan.id} className="plan-card"><div className="plan-card-drawing"><PlanSVG {...plan}/></div><div className="plan-card-info"><div><h3>{plan.w} × {plan.h} ft</h3><span>{plan.floors} {plan.floors===1?"floor":"floors"} · {plan.bhk} BHK</span></div><strong>≈ ₹{plan.budget}L</strong></div></article>)}</div>:<div className="empty-state"><span>⌂</span><h3>No plans match just yet.</h3><p>Try relaxing a filter to see more options.</p><button type="button" className="clear-filters" onClick={()=>setFilters({size:"",floors:"",bhk:"",budget:""})}>Show all plans</button></div>}
      <p className="feature-footnote">Library plans and budgets are indicative concepts. Have plot conditions, local rules and structure reviewed by qualified professionals.</p>
    </section>
  </div>;
}
