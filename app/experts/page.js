"use client";
import {useEffect,useState} from "react";
import {useT} from "@/components/Shell";

const STATUSES=["Requested","Assigned","Appointment fixed","Completed"];
const BENEFITS=[
  {icon:"01",title:"Start with a real person",description:"Get help thinking through your questions before the next step."},
  {icon:"02",title:"Choose how to meet",description:"Ask for a phone consultation or an on-site specialist visit."},
  {icon:"03",title:"Keep your plans moving",description:"Share your project needs so your request starts with context."}
];

export default function Page(){
  const {t}=useT();
  const [form,setForm]=useState({type:"Online consultation",name:"",phone:"",city:"",date:"",topic:""});
  const [requests,setRequests]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const [storageError,setStorageError]=useState("");
  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem("reqs")||"[]");
      if(Array.isArray(saved))setRequests(saved);
      else throw new Error("Saved requests are not in the expected format.");
    }catch{
      setStorageError("We couldn't read saved requests on this device. New requests can still be submitted.");
    }
  },[]);
  function update(key,value){setForm(current=>({...current,[key]:value}));setError("");setSuccess("")}
  async function submit(event){
    event.preventDefault();setLoading(true);setError("");setSuccess("");
    try{
      const response=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,source:"expert-help"})});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.error||"Your request could not be sent. Please try again.");
      const next=[{...form,id:result.id,status:0},...requests];
      setRequests(next);
      try{localStorage.setItem("reqs",JSON.stringify(next))}
      catch{setStorageError("Your request was submitted, but could not be saved on this device.")}
      setForm(current=>({...current,name:"",phone:"",topic:""}));
      setSuccess("Your request has been received. You can review it below.");
    }catch(requestError){setError(requestError.message||"Unable to connect. Please try again.")}
    finally{setLoading(false)}
  }
  return <div className="feature-page expert-page">
    <section className="expert-hero"><div><div className="eyebrow">A HELPFUL HUMAN, WHEN YOU NEED ONE</div><h1>{t("experts")}<br/><span>starts with a conversation.</span></h1><p>Tell us where you are in your home-building journey. Request a free phone consultation or ask for a specialist to visit your site.</p><div className="expert-hero-note"><span>✓</span> Free for consumers · No in-app video call</div></div><div className="expert-hero-art" aria-hidden="true"><span className="expert-sun">✳</span><div className="expert-chat"><span>“</span><strong>A little guidance<br/>can go a long way.</strong><small>Let's talk about your project.</small></div><span className="expert-art-star">✦</span></div></section>

    <section className="expert-content">
      <div className="expert-benefits">{BENEFITS.map(item=><div className="expert-benefit" key={item.title}><span>{item.icon}</span><div><h2>{item.title}</h2><p>{item.description}</p></div></div>)}</div>
      <form className="expert-form" onSubmit={submit}>
        <div className="form-section-heading"><div className="feature-kicker">WE’LL TAKE IT FROM HERE</div><h2>Request expert help</h2><p>A few details help us understand what you need.</p></div>
        <div className="expert-form-grid">
          <label className="feature-label">How would you like to meet?<select className="feature-input" value={form.type} onChange={e=>update("type",e.target.value)}><option>Online consultation</option><option>Onsite specialist visit</option></select></label>
          <label className="feature-label">Preferred date<input required className="feature-input" type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={e=>update("date",e.target.value)}/></label>
          <label className="feature-label">Your name<input required className="feature-input" autoComplete="name" value={form.name} onChange={e=>update("name",e.target.value)}/></label>
          <label className="feature-label">Mobile number<input required className="feature-input" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" maxLength={10} title="Enter a 10-digit mobile number" placeholder="10-digit number" value={form.phone} onChange={e=>update("phone",e.target.value.replace(/\D/g,"").slice(0,10))}/></label>
          <label className="feature-label">Your city<input required className="feature-input" autoComplete="address-level2" value={form.city} onChange={e=>update("city",e.target.value)}/></label>
          <label className="feature-label">What would you like help with?<input className="feature-input" placeholder="Budget, layout, materials…" value={form.topic} onChange={e=>update("topic",e.target.value)}/></label>
        </div>
        {error&&<p className="feature-error" role="alert">{error}</p>}
        {success&&<p className="form-success" role="status">{success}</p>}
        <button className="feature-button expert-submit" disabled={loading}>{loading?"Sending your request…":<>Request a conversation <span>→</span></>}</button>
        <p className="form-privacy">Your details are used to respond to this request. This demo stores request history in your browser.</p>
      </form>
    </section>

    <section className="requests-section"><div className="library-heading"><div><div className="feature-kicker">YOUR ACTIVITY</div><h2>Your requests</h2><p>Requests submitted from this browser appear here.</p></div><span className="library-count">{requests.length} <small>{requests.length===1?"request":"requests"}</small></span></div>
      {storageError&&<p className="storage-warning" role="status">{storageError}</p>}
      {!requests.length?<div className="empty-state"><span>✳</span><h3>Your next step starts with a question.</h3><p>Submit the form above and your request will appear here.</p></div>:<div className="request-list">{requests.map(request=><article className="request-card" key={request.id}><span className="request-type-mark">✳</span><div className="request-details"><h3>{request.type||"Expert consultation"}</h3><p>{[request.date,request.city,request.topic].filter(Boolean).join(" · ")}</p></div><span className="request-status">{STATUSES[request.status]||STATUSES[0]}</span></article>)}</div>}
    </section>
  </div>;
}
