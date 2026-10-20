"use client";
import {useMemo,useState} from "react";
import {useT} from "@/components/Shell";

const ARTICLES=[
  {stage:"Planning",number:"01",title:"Before you buy a plot",summary:"A few checks now can save difficult surprises later.",time:"5 point checklist",icon:"⌖",points:["Verify title and mutation records with a qualified professional.","Check land use, access and permitted setbacks with your local authority.","Ask whether a soil test is needed for the proposed site.","Confirm water, power, drainage and road access.","Keep copies of approvals and correspondence."]},
  {stage:"Foundation",number:"02",title:"Foundation and plinth basics",summary:"Understand what to review with your engineer before work begins.",time:"5 point checklist",icon:"▱",points:["Confirm the foundation and column layout against approved drawings.","Use the reinforcement grade and cover specified by the structural engineer.","Check that formwork is stable before any concrete pour.","Follow the engineer's concrete curing instructions; timing varies by conditions and mix.","Record inspections and keep the site safe and accessible."]},
  {stage:"Structure",number:"03",title:"A safer slab and column pour",summary:"A simple site checklist for a high-stakes stage of the build.",time:"5 point checklist",icon:"⌂",points:["Have the responsible engineer review reinforcement and formwork before pouring.","Check props and supports are installed as designed and properly braced.","Use suitable protective equipment and restrict access to active work areas.","Do not remove supports until the engineer confirms it is safe.","Keep a clear record of the pour, mix and any site observations."]},
  {stage:"Finishing",number:"04",title:"Waterproofing and finish checks",summary:"Catch common finishing issues before surfaces are closed up.",time:"5 point checklist",icon:"◒",points:["Follow the product and professional specifications for surface preparation.","Test wet areas and terraces using a method approved for your construction.","Seal pipe penetrations and inspect drainage falls before tiling.","Photograph concealed electrical and plumbing routes before plastering.","Keep product details and warranties together for future reference."]}
];
const STAGES=["All",...ARTICLES.map(article=>article.stage)];

export default function Page(){
  const {t}=useT();
  const [stage,setStage]=useState("All");
  const articles=useMemo(()=>ARTICLES.filter(article=>stage==="All"||article.stage===stage),[stage]);
  return <div className="feature-page knowledge-page">
    <section className="knowledge-hero"><div><div className="eyebrow">SMALL STEPS, SMARTER BUILDS</div><h1>{t("knowledge")}<br/><span>keep the know-how close.</span></h1><p>Clear, practical checklists to help you ask better questions at every stage of your home build.</p></div><div className="knowledge-hero-art" aria-hidden="true"><div className="knowledge-paper"><span>SAHAYAK FIELD NOTES</span><i/><i/><i/><b>✓</b><i/><b>✓</b><i/></div><span className="knowledge-plant">✳</span></div></section>

    <section className="knowledge-library"><div className="library-heading"><div><div className="feature-kicker">A QUICK REFERENCE FOR YOUR JOURNEY</div><h2>Good questions make a difference.</h2><p>Pick a stage to find a useful starting checklist.</p></div><span className="library-count">{articles.length} <small>{articles.length===1?"guide":"guides"}</small></span></div>
      <div className="knowledge-filters" role="group" aria-label="Filter guides by construction stage">{STAGES.map(value=><button key={value} type="button" aria-pressed={stage===value} className={stage===value?"knowledge-filter active":"knowledge-filter"} onClick={()=>setStage(value)}>{value}</button>)}</div>
      <div className="knowledge-grid">{articles.map(article=><article className="knowledge-card" key={article.number}><div className="knowledge-card-top"><span className="knowledge-card-icon">{article.icon}</span><span className="knowledge-card-number">{article.number}</span></div><span className="feature-kicker">{article.stage.toUpperCase()} · {article.time.toUpperCase()}</span><h3>{article.title}</h3><p className="knowledge-summary">{article.summary}</p><ul>{article.points.map(point=><li key={point}><span>✓</span>{point}</li>)}</ul><button type="button" className="knowledge-print" onClick={()=>window.print()}>Print / save as PDF <span>↗</span></button></article>)}</div>
      <p className="feature-footnote">These sample checklists are general information, not engineering, legal or safety advice. Requirements vary by project and location; confirm decisions with qualified professionals and local authorities.</p>
    </section>
  </div>;
}
