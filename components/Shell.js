"use client";
import {createContext,useContext,useEffect,useState} from "react";
import Link from "next/link";
import {LANGS,D} from "@/lib/i18n";
const Ctx=createContext({lang:"en",t:k=>k});
export const useT=()=>useContext(Ctx);
const NAV=["estimator","planner","experts","dealers","vaastu","knowledge"];
export default function Shell({children}){
  const [lang,setLang]=useState("en");
  const [profile,setProfile]=useState(null);
  const [navOpen,setNavOpen]=useState(false);
  const [loginOpen,setLoginOpen]=useState(false);
  const [loginStep,setLoginStep]=useState("phone");
  const [loginMode,setLoginMode]=useState("signup");
  const [loginPhone,setLoginPhone]=useState("");
  const [signupDetails,setSignupDetails]=useState({fullName:"",address:"",city:"",state:"",pincode:""});
  const [pendingProfile,setPendingProfile]=useState(null);
  const [otp,setOtp]=useState("");
  const [loginError,setLoginError]=useState("");
  useEffect(()=>{const l=localStorage.getItem("lang");if(l&&D[l])setLang(l)},[]);
  useEffect(()=>{
    try{
      const users=JSON.parse(localStorage.getItem("sahayakUsers")||"{}");
      const session=JSON.parse(localStorage.getItem("sahayakSession")||"null");
      if(!users||typeof users!=="object"||Array.isArray(users))throw new Error("Saved account data is invalid.");
      if(session&&typeof session.phone==="string"&&users[session.phone])setProfile(users[session.phone]);
      else{
        const legacyPhone=localStorage.getItem("sahayakPhone")||localStorage.getItem("helpifyPhone")||"";
        if(legacyPhone&&users[legacyPhone])setProfile(users[legacyPhone]);
      }
    }catch(error){console.error("Unable to restore Sahayak demo account:",error)}
  },[]);
  useEffect(()=>{
    function syncAccount(event){
      if(event.detail?.profile)setProfile(event.detail.profile);
    }
    window.addEventListener("sahayak:account-created",syncAccount);
    return ()=>window.removeEventListener("sahayak:account-created",syncAccount);
  },[]);
  useEffect(()=>{
    function openLoginFromPage(){
      setLoginPhone("");setSignupDetails({fullName:"",address:"",city:"",state:"",pincode:""});
      setLoginMode("signup");setLoginStep("phone");setLoginError("");setLoginOpen(true);
    }
    window.addEventListener("sahayak:open-login",openLoginFromPage);
    return ()=>window.removeEventListener("sahayak:open-login",openLoginFromPage);
  },[]);
  useEffect(()=>{
    if(!loginOpen)return;
    const onKeyDown=e=>{if(e.key==="Escape")setLoginOpen(false)};
    window.addEventListener("keydown",onKeyDown);
    return ()=>window.removeEventListener("keydown",onKeyDown);
  },[loginOpen]);
  const t=k=>D[lang][k]||D.en[k]||k;
  function continueWithPhone(e){
    e.preventDefault();
    if(!/^[6-9][0-9]{9}$/.test(loginPhone)){setLoginError("Enter a valid 10-digit Indian mobile number.");return}
    try{
      const users=JSON.parse(localStorage.getItem("sahayakUsers")||"{}");
      if(!users||typeof users!=="object"||Array.isArray(users))throw new Error("Saved account data is invalid. Clear your browser's Sahayak demo data and try again.");
      const existing=users[loginPhone];
      if(existing){
        setPendingProfile(existing);setLoginMode("login");setLoginStep("otp");
      }else{
        setPendingProfile(null);setLoginMode("signup");setSignupDetails({fullName:"",address:"",city:"",state:"",pincode:""});setLoginStep("details");
      }
      setLoginError("");setOtp("");
    }catch(error){setLoginError(error.message||"Unable to check this number. Please try again.")}
  }
  function sendSignupOtp(e){
    e.preventDefault();
    const fullName=signupDetails.fullName.trim();
    const address=signupDetails.address.trim();
    const city=signupDetails.city.trim();
    const state=signupDetails.state.trim();
    if(fullName.length<2||address.length<5||city.length<2||state.length<2||!/^[1-9][0-9]{5}$/.test(signupDetails.pincode)){
      setLoginError("Complete all your details and enter a valid 6-digit PIN code.");
      return;
    }
    setPendingProfile({fullName,address,city,state,pincode:signupDetails.pincode,phone:loginPhone});
    setLoginError("");setOtp("");setLoginStep("otp");
  }
  function verifyOtp(e){
    e.preventDefault();
    if(otp!=="123456"){setLoginError("That code doesn't match. Try the demo OTP shown below.");return}
    if(!pendingProfile){setLoginError("Your account details are missing. Start again with your mobile number.");return}
    try{
      const users=JSON.parse(localStorage.getItem("sahayakUsers")||"{}");
      if(!users||typeof users!=="object"||Array.isArray(users))throw new Error("Saved account data is invalid. Clear your browser's Sahayak demo data and try again.");
      if(loginMode==="signup"&&users[loginPhone])throw new Error("An account with this number already exists. Go back and sign in instead.");
      const nextProfile={...pendingProfile,phone:loginPhone};
      users[loginPhone]=nextProfile;
      localStorage.setItem("sahayakUsers",JSON.stringify(users));
      localStorage.setItem("sahayakSession",JSON.stringify(nextProfile));
      localStorage.setItem("sahayakPhone",loginPhone);
      localStorage.removeItem("helpifyPhone");
      setProfile(nextProfile);setLoginError("");setLoginOpen(false);setLoginStep("phone");setOtp("");
    }catch(error){setLoginError(error.message||"Unable to save your demo account on this device.")}
  }
  function closeLogin(){setLoginOpen(false);setLoginError("");setLoginStep("phone");setOtp("");setPendingProfile(null)}
  function openLogin(){setLoginPhone("");setSignupDetails({fullName:"",address:"",city:"",state:"",pincode:""});setLoginMode("signup");setLoginStep("phone");setLoginError("");setLoginOpen(true)}
  function backToPhone(){setLoginStep("phone");setLoginMode("signup");setPendingProfile(null);setOtp("");setLoginError("")}
  function logout(){localStorage.removeItem("sahayakPhone");localStorage.removeItem("helpifyPhone");localStorage.removeItem("sahayakSession");setProfile(null)}
  return <Ctx.Provider value={{lang,t}}>
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Sahayak, home"><span className="brand-mark">s<span>.</span></span><span className="brand-name">sahayak<span>home</span></span></Link>
        <nav id="main-navigation" className={navOpen?"site-nav mobile-open":"site-nav"} aria-label="Main navigation">{NAV.map(n=><Link key={n} href={"/"+n} onClick={()=>setNavOpen(false)}>{t(n)}</Link>)}</nav>
        <div className="header-actions">
          <select aria-label="Language" className="language-select" value={lang}
            onChange={e=>{setLang(e.target.value);localStorage.setItem("lang",e.target.value)}}>
            {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
          <button type="button" className="mobile-nav-toggle" aria-label={navOpen?"Close navigation":"Open navigation"} aria-expanded={navOpen} aria-controls="main-navigation" onClick={()=>setNavOpen(open=>!open)}><span/><span/><span/></button>
          {profile?<div className="account-actions"><span className="account-greeting"><span className="account-avatar">{profile.fullName?.slice(0,1)?.toUpperCase()||"S"}</span><span>Hi, {profile.fullName?.split(/\s+/)[0]||profile.phone?.slice(-4)}</span></span><button type="button" className="login-button" onClick={logout}>Log out</button></div>:<button type="button" className="login-button" onClick={openLogin}><span aria-hidden="true">↗</span> Log in</button>}
        </div>
      </div>
    </header>
    <main className="site-main">{children}</main>
    <footer className="site-footer"><div className="footer-inner"><Link href="/" className="brand footer-brand"><span className="brand-mark">s<span>.</span></span><span className="brand-name">sahayak<span>home</span></span></Link><p>A helpful companion for your home-building journey.</p><span>Estimates and guidance are indicative only. Powered by TENOCCO Metalics.</span></div></footer>
    {loginOpen&&<div className="login-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeLogin()}}>
      <section className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button type="button" className="login-close" aria-label="Close login" onClick={closeLogin}>×</button>
        <span className="login-mark">s<span>.</span></span>
        <div className="eyebrow dark-eyebrow">{loginStep==="otp"?"VERIFY YOUR MOBILE":loginStep==="details"?"YOUR SAHAYAK PROFILE":"WELCOME TO SAHAYAK"}</div>
        <h2 id="login-title">{loginStep==="phone"?"Good to have you here.":loginStep==="details"?"Let’s get to know you.":"Check your messages."}</h2>
        <p className="login-description">{loginStep==="phone"?"Enter your mobile number to sign in or create your Sahayak account.":loginStep==="details"?"First time here? Add your contact details before verifying your number.":<>We sent a 6-digit code to <strong>+91 {loginPhone}</strong>.</>}</p>
        {loginStep==="phone"?<form onSubmit={continueWithPhone}>
          <label className="login-label" htmlFor="login-phone">Mobile number</label>
          <div className="phone-input-wrap"><span>+91</span><input id="login-phone" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile number" value={loginPhone} onChange={e=>{setLoginPhone(e.target.value.replace(/\D/g,"").slice(0,10));setLoginError("")}}/></div>
          <button className="login-submit" type="submit">Continue with mobile <span aria-hidden="true">→</span></button>
          <p className="login-step-hint">New to Sahayak? We’ll ask for your full address before OTP verification.</p>
          <Link href="/signup" className="login-signup-link" onClick={closeLogin}>Create a new account <span aria-hidden="true">↗</span></Link>
        </form>:loginStep==="details"?<form className="signup-form" onSubmit={sendSignupOtp}>
          <label className="login-label" htmlFor="signup-name">Full name</label>
          <input id="signup-name" className="signup-input" autoComplete="name" minLength={2} maxLength={80} required value={signupDetails.fullName} onChange={e=>{setSignupDetails({...signupDetails,fullName:e.target.value});setLoginError("")}} placeholder="Enter your full name"/>
          <label className="login-label" htmlFor="signup-address">Full address</label>
          <textarea id="signup-address" className="signup-input signup-address" autoComplete="street-address" minLength={5} maxLength={200} required value={signupDetails.address} onChange={e=>{setSignupDetails({...signupDetails,address:e.target.value});setLoginError("")}} placeholder="House / flat, street, area"/>
          <div className="signup-grid">
            <div><label className="login-label" htmlFor="signup-city">City</label><input id="signup-city" className="signup-input" autoComplete="address-level2" minLength={2} maxLength={60} required value={signupDetails.city} onChange={e=>{setSignupDetails({...signupDetails,city:e.target.value});setLoginError("")}} placeholder="Your city"/></div>
            <div><label className="login-label" htmlFor="signup-state">State</label><input id="signup-state" className="signup-input" autoComplete="address-level1" minLength={2} maxLength={60} required value={signupDetails.state} onChange={e=>{setSignupDetails({...signupDetails,state:e.target.value});setLoginError("")}} placeholder="Your state"/></div>
          </div>
          <label className="login-label" htmlFor="signup-pincode">PIN code</label>
          <input id="signup-pincode" className="signup-input" inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} required value={signupDetails.pincode} onChange={e=>{setSignupDetails({...signupDetails,pincode:e.target.value.replace(/\D/g,"").slice(0,6)});setLoginError("")}} placeholder="6-digit PIN code"/>
          <button className="login-submit" type="submit">Save details and verify mobile <span aria-hidden="true">→</span></button>
          <button className="login-back" type="button" onClick={backToPhone}>← Change mobile number</button>
        </form>:<form onSubmit={verifyOtp}>
          <label className="login-label" htmlFor="login-otp">6-digit verification code</label>
          <input id="login-otp" className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={otp} onChange={e=>{setOtp(e.target.value.replace(/\D/g,"").slice(0,6));setLoginError("")}}/>
          <button className="login-submit" type="submit">{loginMode==="signup"?"Verify and create account":"Verify and sign in"} <span aria-hidden="true">→</span></button>
          <button className="login-back" type="button" onClick={()=>{setLoginStep(loginMode==="signup"?"details":"phone");setOtp("");setLoginError("")}}>{loginMode==="signup"?"← Review your details":"← Change mobile number"}</button>
          <div className="demo-code"><strong>Demo mode</strong><span>Use OTP <b>123456</b> to verify your number.</span></div>
        </form>}
        {loginError&&<p className="login-error" role="alert">{loginError}</p>}
        <p className="login-privacy">Demo only: profile details are stored in this browser, and no real SMS is sent. Use OTP 123456 to continue.</p>
      </section>
    </div>}
  </Ctx.Provider>}
