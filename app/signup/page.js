"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

const EMPTY_PROFILE={fullName:"",phone:"",address:"",city:"",state:"",pincode:""};

export default function SignupPage(){
  const router=useRouter();
  const [profile,setProfile]=useState(EMPTY_PROFILE);
  const [otp,setOtp]=useState("");
  const [step,setStep]=useState("details");
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);

  function update(key,value){
    setProfile(current=>({...current,[key]:value}));
    setError("");
  }

  function continueToVerification(event){
    event.preventDefault();
    const nextProfile={
      fullName:profile.fullName.trim(),
      phone:profile.phone,
      address:profile.address.trim(),
      city:profile.city.trim(),
      state:profile.state.trim(),
      pincode:profile.pincode
    };
    if(nextProfile.fullName.length<2||nextProfile.address.length<5||nextProfile.city.length<2||nextProfile.state.length<2){
      setError("Enter your full name, full address, city and state to continue.");
      return;
    }
    if(!/^[6-9][0-9]{9}$/.test(nextProfile.phone)){
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if(!/^[1-9][0-9]{5}$/.test(nextProfile.pincode)){
      setError("Enter a valid 6-digit PIN code.");
      return;
    }
    try{
      const users=JSON.parse(localStorage.getItem("sahayakUsers")||"{}");
      if(!users||typeof users!=="object"||Array.isArray(users))throw new Error("Saved account data is invalid. Clear your browser's Sahayak demo data and try again.");
      if(users[nextProfile.phone]){
        setError("An account with this mobile number already exists. Use Log in in the top menu to continue.");
        return;
      }
      setProfile(nextProfile);
      setOtp("");
      setStep("otp");
      setError("");
    }catch(validationError){
      setError(validationError.message||"Unable to check this number. Please try again.");
    }
  }

  function createAccount(event){
    event.preventDefault();
    if(otp!=="123456"){
      setError("That code doesn't match. Enter the demo OTP shown below.");
      return;
    }
    setSaving(true);
    setError("");
    try{
      const users=JSON.parse(localStorage.getItem("sahayakUsers")||"{}");
      if(!users||typeof users!=="object"||Array.isArray(users))throw new Error("Saved account data is invalid. Clear your browser's Sahayak demo data and try again.");
      if(users[profile.phone])throw new Error("An account with this mobile number already exists. Use Log in instead.");
      const account={...profile};
      users[account.phone]=account;
      localStorage.setItem("sahayakUsers",JSON.stringify(users));
      localStorage.setItem("sahayakSession",JSON.stringify(account));
      localStorage.setItem("sahayakPhone",account.phone);
      localStorage.removeItem("helpifyPhone");
      window.dispatchEvent(new CustomEvent("sahayak:account-created",{detail:{profile:account}}));
      router.push("/");
    }catch(saveError){
      setError(saveError.message||"Unable to save your account on this device. Please try again.");
      setSaving(false);
    }
  }

  return <div className="signup-page">
    <section className="signup-story">
      <Link href="/" className="signup-brand" aria-label="Sahayak home">
        <span className="brand-mark">s<span>.</span></span>
        <span className="brand-name">sahayak<span>home</span></span>
      </Link>
      <div className="signup-story-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> YOUR HOME JOURNEY, TOGETHER</div>
        <h1>A little help<br/><span>goes a long way.</span></h1>
        <p>Create your Sahayak profile to keep your home-building journey personal and connected.</p>
        <div className="signup-benefits"><span>✓</span> Save your details for next time</div>
        <div className="signup-benefits"><span>✓</span> Get tools and guidance in one place</div>
      </div>
      <div className="signup-story-foot">A helpful companion for the home you dream of.</div>
      <span className="signup-decoration" aria-hidden="true">⌂</span>
    </section>

    <section className="signup-form-side">
      <div className="signup-card">
        <div className="signup-step-indicator">
          <span className={step==="details"?"current":""}>01 <small>Your details</small></span>
          <i/>
          <span className={step==="otp"?"current":""}>02 <small>Verify mobile</small></span>
        </div>
        <div className="feature-kicker">{step==="details"?"LET’S GET YOU STARTED":"ONE LAST STEP"}</div>
        <h2>{step==="details"?"Create your account":"Verify your number"}</h2>
        <p className="signup-intro">{step==="details"?"Add your contact details so Sahayak can personalise your home-building experience.":"Enter the 6-digit code for +91 "+profile.phone+" to finish creating your profile."}</p>
        {step==="details"?<form className="signup-page-form" onSubmit={continueToVerification}>
          <label className="signup-page-label" htmlFor="signup-full-name">Full name<input id="signup-full-name" autoComplete="name" minLength={2} maxLength={80} required value={profile.fullName} onChange={e=>update("fullName",e.target.value)} placeholder="Enter your full name"/></label>
          <label className="signup-page-label" htmlFor="signup-mobile">Mobile number<div className="signup-phone"><span>+91</span><input id="signup-mobile" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" maxLength={10} required value={profile.phone} onChange={e=>update("phone",e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number"/></div></label>
          <label className="signup-page-label" htmlFor="signup-full-address">Full address<textarea id="signup-full-address" autoComplete="street-address" minLength={5} maxLength={200} required value={profile.address} onChange={e=>update("address",e.target.value)} placeholder="House / flat, street, area"/></label>
          <div className="signup-page-grid">
            <label className="signup-page-label" htmlFor="signup-profile-city">City<input id="signup-profile-city" autoComplete="address-level2" minLength={2} maxLength={60} required value={profile.city} onChange={e=>update("city",e.target.value)} placeholder="Your city"/></label>
            <label className="signup-page-label" htmlFor="signup-profile-state">State<input id="signup-profile-state" autoComplete="address-level1" minLength={2} maxLength={60} required value={profile.state} onChange={e=>update("state",e.target.value)} placeholder="Your state"/></label>
          </div>
          <label className="signup-page-label" htmlFor="signup-profile-pincode">PIN code<input id="signup-profile-pincode" inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} required value={profile.pincode} onChange={e=>update("pincode",e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="6-digit PIN code"/></label>
          {error&&<p className="signup-page-error" role="alert">{error}</p>}
          <button type="submit" className="signup-page-submit">Continue to verification <span aria-hidden="true">→</span></button>
          <p className="signup-login-prompt">Already have an account? Use <Link href="/" onClick={()=>window.dispatchEvent(new Event("sahayak:open-login"))}>Log in</Link> in the top menu.</p>
        </form>:<form className="signup-page-form otp-page-form" onSubmit={createAccount}>
          <label className="signup-page-label" htmlFor="signup-page-otp">6-digit verification code<input id="signup-page-otp" className="signup-otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={e=>{setOtp(e.target.value.replace(/\D/g,"").slice(0,6));setError("")}} placeholder="••••••"/></label>
          <div className="signup-demo-otp"><strong>Demo mode</strong><span>Use OTP <b>123456</b> to verify your number.</span></div>
          {error&&<p className="signup-page-error" role="alert">{error}</p>}
          <button type="submit" className="signup-page-submit" disabled={saving}>{saving?"Creating your account…":<>Verify and create account <span aria-hidden="true">→</span></>}</button>
          <button type="button" className="signup-edit-details" disabled={saving} onClick={()=>{setStep("details");setOtp("");setError("")}}>← Review or edit your details</button>
        </form>}
        <p className="signup-demo-note">Demo only: no real SMS is sent. Your profile is stored in this browser.</p>
      </div>
    </section>
  </div>;
}
