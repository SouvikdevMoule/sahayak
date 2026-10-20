"use client";
import {useState} from "react";
import Link from "next/link";
import R from "@/data/rates.json";
import {useT} from "@/components/Shell";

const inr=n=>"₹"+Math.round(n).toLocaleString("en-IN");
const AREA_PRESETS=[800,1000,1200,1500];

export default function Page(){
  const {t}=useT();
  const [form,setForm]=useState({area:1000,floors:1,city:"Kolkata"});
  const [insights,setInsights]=useState(null);
  const [insightError,setInsightError]=useState("");
  const [loading,setLoading]=useState(false);
  const area=Math.max(100,Math.min(5000,Number(form.area)||100));
  const floors=Number(form.floors);
  const builtUpArea=area*floors;
  const rates=R.cities[form.city];
  const rows=R.norms.map(material=>{
    const quantity=Math.ceil(builtUpArea*material.perSqft*(1+R.wastage));
    return {...material,quantity,rate:rates[material.key],amount:quantity*rates[material.key]};
  });
  const total=rows.reduce((sum,row)=>sum+row.amount,0);
  const average=total/builtUpArea;

  function update(key,value){
    setForm(current=>({...current,[key]:value}));
    setInsights(null);
    setInsightError("");
  }

  async function generateInsights(){
    setLoading(true);
    setInsightError("");
    setInsights(null);
    try{
      const response=await fetch("/api/estimate-insights",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({area,floors,city:form.city})
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||"Unable to create suggestions right now.");
      setInsights(result);
    }catch(error){
      setInsightError(error.message||"Unable to connect. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  return <div className="estimator-page">
    <div className="estimator-heading">
      <div><div className="eyebrow dark-eyebrow">A CLEARER PLACE TO START</div><h1>{t("estimator")}</h1><p>Adjust a few details to see an indicative materials estimate for your home.</p></div>
      <div className="estimate-badge"><span>✳</span> Updated {R.updated}</div>
    </div>

    <section className="calculator-layout">
      <div className="calculator-controls">
        <div className="calculator-card-heading"><span className="calculator-step">01</span><div><h2>Tell us about your home</h2><p>You can change these details any time.</p></div></div>
        <div className="area-control">
          <div className="input-heading"><label htmlFor="built-area">Built-up area per floor</label><span>Square feet</span></div>
          <div className="area-input-wrap"><input id="built-area" type="number" min="100" max="5000" step="50" value={form.area} disabled={loading} onChange={e=>update("area",e.target.value===""?"":Math.max(100,Math.min(5000,Number(e.target.value))))} /><span>sq ft</span></div>
          <input className="area-range" aria-label="Adjust built-up area per floor" type="range" min="100" max="5000" step="50" value={area} disabled={loading} style={{"--range-progress":`${((area-100)/4900)*100}%`}} onChange={e=>update("area",Number(e.target.value))}/>
          <div className="range-labels"><span>100 sq ft</span><span>5,000 sq ft</span></div>
          <div className="area-presets" aria-label="Popular built-up areas">{AREA_PRESETS.map(preset=><button key={preset} type="button" disabled={loading} className={area===preset?"preset-button selected":"preset-button"} onClick={()=>update("area",preset)}>{preset.toLocaleString("en-IN")}</button>)}</div>
        </div>
        <div className="floor-control">
          <div className="input-heading"><span>Number of floors</span><span>Choose 1–4</span></div>
          <div className="floor-options">{[1,2,3,4].map(number=><button key={number} type="button" disabled={loading} aria-pressed={floors===number} className={floors===number?"floor-option selected":"floor-option"} onClick={()=>update("floors",number)}><span>{number}</span><small>{number===1?"floor":"floors"}</small></button>)}</div>
        </div>
        <div className="city-control">
          <label className="input-heading" htmlFor="estimate-city"><span>Where are you building?</span><span>Material rates vary by city</span></label>
          <select id="estimate-city" className="city-select" value={form.city} disabled={loading} onChange={e=>update("city",e.target.value)}>{Object.keys(R.cities).map(city=><option key={city}>{city}</option>)}</select>
        </div>
        <div className="estimate-formula"><span>⌁</span><p>We use local sample rates and standard material quantities, including {Math.round(R.wastage*100)}% for wastage.</p></div>
      </div>

      <div className="estimate-result">
        <div className="result-topline"><span>YOUR INDICATIVE ESTIMATE</span><span className="live-indicator"><i/> UPDATING LIVE</span></div>
        <p className="result-total">{inr(total)}</p>
        <p className="result-subtitle">Estimated core materials cost</p>
        <div className="result-summary">
          <div><span>BUILT-UP AREA</span><strong>{builtUpArea.toLocaleString("en-IN")} <small>sq ft</small></strong></div>
          <div><span>APPROX. PER SQ FT</span><strong>{inr(average)} <small>/ sq ft</small></strong></div>
          <div><span>LOCATION</span><strong>{form.city}</strong></div>
        </div>
        <div className="cost-breakdown">
          <div className="breakdown-heading"><h3>Material breakdown</h3><span>{rows.length} essentials</span></div>
          <div className="material-list">{rows.map(row=><div className="material-row" key={row.key}>
            <div className="material-title"><span>{row.item}</span><strong>{inr(row.amount)}</strong></div>
            <div className="material-track"><span style={{width:`${Math.max(3,row.amount/total*100)}%`}}/></div>
            <div className="material-detail">{row.quantity.toLocaleString("en-IN")} {row.unit} <span>·</span> {inr(row.rate)} per {row.unit}</div>
          </div>)}</div>
        </div>
        <p className="result-footnote">Indicative only — actual prices and quantities depend on design, material grade and local supplier rates.</p>
      </div>
    </section>

    <section className="insights-panel">
      <div className="insights-intro">
        <span className="insights-icon">✳</span>
        <div><div className="insights-kicker">YOUR PERSONAL BUILD BRIEF</div><h2>Make sense of your estimate.</h2><p>Get a plain-language summary and useful next steps based on your area, floors and city.</p></div>
        <button type="button" className="insights-button" onClick={generateInsights} disabled={loading}>{loading?<><span className="loading-spinner"/> Thinking…</>:<>Create my build brief <span aria-hidden="true">→</span></>}</button>
      </div>
      {insightError&&<p className="insights-error" role="alert">{insightError}</p>}
      {insights?<div className="insights-content" aria-live="polite">
        <div className="insight-description"><span className="insight-label">A QUICK READ ON YOUR PROJECT</span><p>{insights.description}</p></div>
        <div className="suggestion-list"><div className="insight-label">SUGGESTED NEXT STEPS</div>{insights.suggestions.map((suggestion,index)=><div className="suggestion-item" key={`${index}-${suggestion}`}><span>{String(index+1).padStart(2,"0")}</span><p>{suggestion}</p></div>)}</div>
        <div className="insight-source">{insights.source==="ai"?"AI-generated for your estimate":"Data-based suggestions"}{insights.notice&&<span>{insights.notice}</span>}</div>
      </div>:<div className="insights-placeholder"><span>✦</span><p>Your project description and tailored suggestions will appear here.</p></div>}
    </section>

    <div className="estimate-next-step"><div><span>READY FOR A SECOND OPINION?</span><strong>Talk through your plan with an expert.</strong></div><Link href="/experts">Get expert help <span aria-hidden="true">↗</span></Link></div>
  </div>;
}
