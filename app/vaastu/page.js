"use client";
import {useEffect,useState} from "react";
import {useT} from "@/components/Shell";

const RULES={
  Kitchen:{best:["South-East"],ok:["North-West"],tip:"Cooking while facing east is traditionally preferred. Plan for safe ventilation and convenient access to water."},
  "Main entrance":{best:["North","North-East","East"],ok:["North-West"],tip:"Keep the entrance clear, easy to reach and well lit."},
  "Master bedroom":{best:["South-West"],ok:["South","West"],tip:"Consider privacy, daylight and a comfortable bed layout alongside direction."},
  Pooja:{best:["North-East"],ok:["East","North"],tip:"Choose a quiet, accessible spot, away from a toilet or under-stair space."},
  Toilet:{best:["North-West","West"],ok:["South"],tip:"Prioritise plumbing, ventilation and local building requirements when planning."}
};
const DIRECTIONS=["North","North-East","East","South-East","South","South-West","West","North-West"];

export default function Page(){
  const {t}=useT();
  const [heading,setHeading]=useState(null);
  const [room,setRoom]=useState("Kitchen");
  const [direction,setDirection]=useState("South-East");
  const [image,setImage]=useState(null);
  const [compassStatus,setCompassStatus]=useState("");
  const [compassActive,setCompassActive]=useState(false);
  const [imageError,setImageError]=useState("");
  const rule=RULES[room];
  const assessment=rule.best.includes(direction)?"Traditionally preferred":rule.ok.includes(direction)?"An alternative to consider":"Worth discussing";

  useEffect(()=>{
    if(!image)return;
    return ()=>URL.revokeObjectURL(image);
  },[image]);
  useEffect(()=>{
    if(!compassActive)return;
    const onOrientation=event=>{
      const angle=event.webkitCompassHeading??(event.alpha!=null?360-event.alpha:null);
      if(angle!=null)setHeading(Math.round((angle+360)%360));
    };
    window.addEventListener("deviceorientation",onOrientation,true);
    window.addEventListener("deviceorientationabsolute",onOrientation,true);
    return ()=>{
      window.removeEventListener("deviceorientation",onOrientation,true);
      window.removeEventListener("deviceorientationabsolute",onOrientation,true);
    };
  },[compassActive]);

  async function startCompass(){
    setCompassStatus("");
    if(!window.isSecureContext){setCompassStatus("Compass access requires a secure connection (HTTPS) on your device.");return}
    if(!("DeviceOrientationEvent" in window)){setCompassStatus("This browser doesn't provide compass sensor access. You can still choose a direction manually.");return}
    if(typeof DeviceOrientationEvent.requestPermission==="function"){
      try{
        const permission=await DeviceOrientationEvent.requestPermission();
        if(permission!=="granted"){setCompassStatus("Compass permission wasn't granted. You can select a direction manually.");return}
      }catch(error){
        setCompassStatus(`Compass permission could not be requested: ${error.message||"please check your device settings."}`);
        return;
      }
    }
    setHeading(null);setCompassActive(true);setCompassStatus("Move your phone gently in a figure-eight to help calibrate the compass.");
  }
  function chooseImage(event){
    setImageError("");
    const file=event.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){setImageError("Choose an image file to preview.");return}
    if(file.size>5*1024*1024){setImageError("Choose an image smaller than 5 MB.");return}
    setImage(URL.createObjectURL(file));
  }

  return <div className="feature-page vaastu-page">
    <section className="vaastu-hero"><div><div className="eyebrow">THOUGHTFUL IDEAS FOR YOUR SPACE</div><h1>{t("vaastu")}<br/><span>meet your own good sense.</span></h1><p>Explore traditional directional guidance and use your phone's compass as a simple reference while planning a room.</p><div className="vaastu-hero-note"><span>✳</span> Practical prompts, not a substitute for professional design</div></div><div className="vaastu-hero-art" aria-hidden="true"><span className="vaastu-ring ring-one"/><span className="vaastu-ring ring-two"/><span className="vaastu-compass-rose">✳</span><span className="vaastu-direction north">N</span><span className="vaastu-direction east">E</span><span className="vaastu-direction south">S</span><span className="vaastu-direction west">W</span><span className="vaastu-center">⌂</span></div></section>

    <section className="vaastu-tools"><article className="vaastu-card compass-card"><div className="feature-kicker">OPTIONAL DEVICE TOOL</div><h2>Check a direction</h2><p>Compass readings depend on your device and surroundings. Use this as a rough reference.</p><div className="compass-display"><div className="compass-ring"><span className="compass-point compass-n">N</span><span className="compass-point compass-e">E</span><span className="compass-point compass-s">S</span><span className="compass-point compass-w">W</span><span className="compass-needle" style={{transform:`translate(-50%,-90%) rotate(${heading??0}deg)`}}><i/><b/></span><span className="compass-center">{heading==null?"—":`${heading}°`}</span></div><div className="compass-reading"><span>DEVICE HEADING</span><strong>{heading==null?"Not available":`${DIRECTIONS[Math.round(heading/45)%8]} facing`}</strong><small>Hold your phone flat and away from metal.</small></div></div><button type="button" className="feature-button" onClick={startCompass} disabled={compassActive}>{compassActive?"Compass is active":"◎ Enable compass"}</button>{compassStatus&&<p className="compass-status" role="status">{compassStatus}</p>}</article>

      <article className="vaastu-card guidance-card"><div className="feature-kicker">TRADITIONAL ROOM GUIDANCE</div><h2>A considered place for each room.</h2><p>Select a room and the direction you are exploring to see a simple reference.</p><label className="feature-label">Room<select className="feature-input" value={room} onChange={e=>setRoom(e.target.value)}>{Object.keys(RULES).map(value=><option key={value}>{value}</option>)}</select></label><label className="feature-label">Direction being considered<select className="feature-input" value={direction} onChange={e=>setDirection(e.target.value)}>{DIRECTIONS.map(value=><option key={value}>{value}</option>)}</select></label><div className="direction-compass" aria-label="Select a direction">{DIRECTIONS.map((value,index)=><button key={value} type="button" aria-label={value} aria-pressed={direction===value} title={value} style={{"--direction-index":index}} className={`direction-choice direction-${index}${direction===value?" active":""}`} onClick={()=>setDirection(value)}>{direction===value?"•":""}</button>)}<span className="direction-compass-label">{direction}</span></div><div className={`guidance-result ${rule.best.includes(direction)?"preferred":rule.ok.includes(direction)?"acceptable":"consider"}`}><span>{rule.best.includes(direction)?"✳":rule.ok.includes(direction)?"✓":"↗"}</span><div><strong>{assessment}</strong><p><b>Traditionally preferred:</b> {rule.best.join(", ")}. {rule.tip}</p></div></div></article></section>

    <section className="vaastu-photo"><div className="photo-copy"><div className="feature-kicker">OPTIONAL · STAYS ON THIS DEVICE</div><h2>Bring your plan into view.</h2><p>Preview a room or floor-plan photo while you think through possible directions. Your image is not uploaded.</p><label className="photo-upload"><input type="file" accept="image/*" capture="environment" onChange={chooseImage}/><span>＋</span><span><strong>{image?"Choose a different image":"Choose a photo"}</strong><small>Image files up to 5 MB</small></span></label>{imageError&&<p className="feature-error" role="alert">{imageError}</p>}</div><div className="photo-preview">{image?<img src={image} alt="Selected room or floor-plan preview"/>:<div className="photo-placeholder"><span>▧</span><strong>Your preview will appear here.</strong><small>Choose an image to get started.</small></div>}</div></section>

    <p className="feature-footnote vaastu-footnote">Directional suggestions reflect a traditional rule set, not scientific or architectural advice. For structural safety, accessibility and code compliance, consult qualified local professionals. Compass accuracy varies by device and location.</p>
  </div>;
}
