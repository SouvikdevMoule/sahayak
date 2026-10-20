"use client";
import Link from "next/link";
import {useT} from "@/components/Shell";

const TOOLS=[
  {key:"estimator",number:"01",eyebrow:"PLAN YOUR BUDGET",description:"Get an indicative materials estimate for your city, home size and number of floors.",icon:"₹",href:"/estimator"},
  {key:"planner",number:"02",eyebrow:"FIND YOUR FLOOR PLAN",description:"Explore ready-to-use layouts or create an AI-assisted concept for your plot.",icon:"⌂",href:"/planner"},
  {key:"experts",number:"03",eyebrow:"TALK TO AN EXPERT",description:"Request a free online consultation or schedule a specialist site visit.",icon:"✳",href:"/experts"},
  {key:"dealers",number:"04",eyebrow:"FIND MATERIALS NEARBY",description:"Discover nearby dealers, compare locations and get in touch directly.",icon:"↗",href:"/dealers"},
  {key:"vaastu",number:"05",eyebrow:"MAKE A THOUGHTFUL PLAN",description:"Get practical Vaastu guidance using your phone compass and site photos.",icon:"✺",href:"/vaastu"},
  {key:"knowledge",number:"06",eyebrow:"LEARN AS YOU BUILD",description:"Browse useful checklists, construction guides and home-building safety tips.",icon:"▤",href:"/knowledge"},
];

const STEPS=[
  {number:"01",title:"Start with your idea",description:"Tell us about your plot, budget and the home you have in mind."},
  {number:"02",title:"Explore your options",description:"Compare estimates, floor plans and practical expert guidance."},
  {number:"03",title:"Build with confidence",description:"Find local materials and useful advice for the next step."},
];

export default function Home(){
  const {t}=useT();
  return <div className="home-page">
    <section className="home-hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> YOUR HOME, YOUR WAY</div>
        <h1>Big dreams.<br/><span>Solid plans.</span></h1>
        <p className="hero-description">Everything you need to plan, budget and build a home you love — all in one helpful place.</p>
        <div className="hero-actions">
          <Link href="/estimator" className="home-primary-button">Plan your home <span aria-hidden="true">↗</span></Link>
          <Link href="#tools" className="home-secondary-link">Explore what you can do <span aria-hidden="true">↓</span></Link>
        </div>
        <div className="hero-trust"><span className="trust-mark">✓</span> Practical guidance for every step of your build</div>
      </div>
      <div className="hero-art" aria-label="Illustration of a welcoming home among trees" role="img">
        <div className="art-sun"/><div className="art-cloud art-cloud-one"/><div className="art-cloud art-cloud-two"/>
        <div className="art-ground"/>
        <svg className="house-illustration" viewBox="0 0 620 490" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M135 235 305 93l176 142v191H135V235Z" fill="#F9F5EC"/>
          <path d="m104 235 201-169 207 169" stroke="#173D36" strokeWidth="17" strokeLinejoin="round"/>
          <path d="M160 228v180h274V228L305 114 160 228Z" fill="#F8F3E9" stroke="#173D36" strokeWidth="8" strokeLinejoin="round"/>
          <path d="M127 239 305 91l180 148" stroke="#C77850" strokeWidth="13" strokeLinejoin="round"/>
          <path d="M270 408V294c0-20 16-36 36-36s36 16 36 36v114" fill="#D99A70" stroke="#173D36" strokeWidth="7"/>
          <path d="M191 280h48v57h-48zM375 280h42v57h-42z" fill="#BCD8CF" stroke="#173D36" strokeWidth="7"/>
          <path d="M215 280v57m-24-28h48m157-1h42m-21-28v57" stroke="#173D36" strokeWidth="5"/>
          <path d="M251 188h107" stroke="#173D36" strokeWidth="7" strokeLinecap="round"/>
          <path d="M301 188v-31h8v31" fill="#C77850"/>
          <path d="M298 302h8m23 0h8" stroke="#F8F3E9" strokeWidth="5" strokeLinecap="round"/>
          <path d="M108 408h405" stroke="#173D36" strokeWidth="8" strokeLinecap="round"/>
          <path d="M105 409c-6-37-28-59-58-63 2 37 19 58 58 63Zm405 0c7-39 29-60 60-64-2 39-22 60-60 64Z" fill="#69937B" stroke="#173D36" strokeWidth="6"/>
          <path d="M111 408c0-54 3-83 12-111m386 111c0-53-4-83-13-112" stroke="#173D36" strokeWidth="7" strokeLinecap="round"/>
          <path d="M95 295c-13-26-7-55 12-68 22 13 29 41 14 68m388 0c-13-26-7-55 12-68 22 13 29 41 14 68" fill="#69937B" stroke="#173D36" strokeWidth="6"/>
          <circle cx="74" cy="394" r="13" fill="#D99A70"/><circle cx="543" cy="394" r="13" fill="#D99A70"/>
          <path d="M198 415c31-11 57-9 79 5m68 0c27-14 53-16 80-5" stroke="#B6C9A4" strokeWidth="8" strokeLinecap="round"/>
        </svg>
        <div className="art-note"><span>⌂</span><div><strong>A home of your own</strong><small>Starts with a good plan.</small></div></div>
      </div>
      <div className="hero-bottom-note"><span>01 / 03</span><span className="note-rule"/><span>FROM FIRST IDEA TO FRONT DOOR</span></div>
    </section>

    <section className="welcome-strip" aria-label="What you can do with Sahayak">
      <div><span className="strip-icon">◎</span><span><strong>Plan it</strong><small>Explore home layouts</small></span></div>
      <span className="strip-separator"/>
      <div><span className="strip-icon">₹</span><span><strong>Price it</strong><small>Estimate materials</small></span></div>
      <span className="strip-separator"/>
      <div><span className="strip-icon">✳</span><span><strong>Build it</strong><small>Get helpful guidance</small></span></div>
    </section>

    <section id="tools" className="tools-section">
      <div className="section-heading">
        <div><div className="eyebrow dark-eyebrow">A LITTLE HELP GOES A LONG WAY</div><h2>Good things happen<br/>when you have a plan.</h2></div>
        <p>From your very first idea to the finishing touches, find the right tools and guidance to help you move forward.</p>
      </div>
      <div className="tool-grid">{TOOLS.map(tool=><Link key={tool.key} href={tool.href} className="tool-card">
        <div className="tool-card-top"><span className="tool-number">{tool.number}</span><span className="tool-icon" aria-hidden="true">{tool.icon}</span></div>
        <span className="tool-eyebrow">{tool.eyebrow}</span><h3>{t(tool.key)}</h3><p>{tool.description}</p>
        <span className="tool-card-link">Explore <span aria-hidden="true">↗</span></span>
      </Link>)}</div>
    </section>

    <section className="steps-section">
      <div className="steps-intro"><div className="eyebrow">ONE STEP AT A TIME</div><h2>Building a home<br/>can feel simpler.</h2><p>There's a lot to think about. Here's an easy place to start.</p></div>
      <div className="steps-list">{STEPS.map(step=><div className="step-item" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><span className="step-arrow" aria-hidden="true">↗</span></div>)}</div>
    </section>

    <section className="home-cta"><div><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>Let's make room<br/>for your dream.</h2><p>Begin with a simple, indicative estimate for your future home.</p></div><Link href="/estimator" className="cta-button">Get your estimate <span aria-hidden="true">↗</span></Link><span className="cta-sun" aria-hidden="true">✳</span></section>
    <p className="home-disclaimer">Estimates and guidance are indicative only and are not a substitute for professional advice.</p>
  </div>;
}
