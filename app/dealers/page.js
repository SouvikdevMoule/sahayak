"use client";
import {useMemo,useState} from "react";
import D from "@/data/dealers.json";
import {useT} from "@/components/Shell";

const km=(lat1,lon1,lat2,lon2)=>{
  const rad=Math.PI/180;
  const x=(lon2-lon1)*rad*Math.cos(lat1*rad);
  const y=(lat2-lat1)*rad;
  return Math.hypot(x,y)*6371;
};

export default function Page(){
  const {t}=useT();
  const [position,setPosition]=useState(null);
  const [city,setCity]=useState("");
  const [locationStatus,setLocationStatus]=useState("");
  const [locating,setLocating]=useState(false);
  const cities=[...new Set(D.map(dealer=>dealer.city))];
  const dealers=useMemo(()=>D.filter(dealer=>!city||dealer.city===city)
    .map(dealer=>({...dealer,distance:position?km(position.lat,position.lng,dealer.lat,dealer.lng):null}))
    .sort((a,b)=>position?a.distance-b.distance:a.name.localeCompare(b.name)),[city,position]);
  function findNearby(){
    if(!navigator.geolocation){setLocationStatus("Location services are not available in this browser.");return}
    setLocating(true);setLocationStatus("");
    navigator.geolocation.getCurrentPosition(
      result=>{setPosition({lat:result.coords.latitude,lng:result.coords.longitude});setLocationStatus("Showing dealers sorted by distance from your location.");setLocating(false)},
      error=>{setLocationStatus(error.code===error.PERMISSION_DENIED?"Location permission was denied. Choose a city instead.":"We couldn't get your location. Check your device settings and try again.");setLocating(false)},
      {enableHighAccuracy:false,timeout:10000,maximumAge:300000}
    );
  }
  return <div className="feature-page dealer-page">
    <section className="dealer-hero"><div><div className="eyebrow">GOOD MATERIALS, CLOSER TO HOME</div><h1>{t("dealers")}<br/><span>around the corner.</span></h1><p>Discover listed sample dealers, check their locations and get in touch directly to ask about availability and prices.</p><div className="dealer-hero-note"><span>↗</span> Call, message or get directions</div></div><div className="dealer-map-art" aria-label="Illustration of map pins locating nearby building material dealers" role="img"><div className="map-road map-road-one"/><div className="map-road map-road-two"/><div className="map-road map-road-three"/><span className="map-pin map-pin-one">⌂</span><span className="map-pin map-pin-two">⌂</span><span className="map-pin map-pin-three">⌂</span><span className="map-center">◎</span></div></section>

    <section className="dealer-search"><div className="dealer-search-copy"><div className="feature-kicker">FIND A LOCAL SUPPLIER</div><h2>Start with your location.</h2><p>Choose a city or let us find your approximate location to sort nearby listings.</p></div><div className="dealer-search-controls"><label className="filter-field"><span>Choose a city</span><select className="feature-input" value={city} onChange={e=>setCity(e.target.value)}><option value="">All cities</option>{cities.map(value=><option key={value}>{value}</option>)}</select></label><button type="button" className="feature-button location-button" disabled={locating} onClick={findNearby}>{locating?<><span className="loading-spinner"/> Finding you…</>:<>◎ Find near me</>}</button></div>{locationStatus&&<p className="location-status" role="status">{locationStatus}</p>}</section>

    <section className="dealer-results"><div className="library-heading"><div><div className="feature-kicker">SAMPLE DEALER DIRECTORY</div><h2>{position?"Closest listings":city?`Dealers in ${city}`:"Listed dealers"}</h2></div><span className="library-count">{dealers.length} <small>{dealers.length===1?"listing":"listings"}</small></span></div>
      {dealers.length?<div className="dealer-grid">{dealers.map((dealer,index)=><article className="dealer-card" key={dealer.name}><div className="dealer-card-heading"><span className="dealer-avatar">{dealer.name.slice(0,1).toUpperCase()}</span><span className="dealer-index">{String(index+1).padStart(2,"0")}</span></div><div className="feature-kicker">{dealer.city.toUpperCase()}</div><h3>{dealer.name}</h3><p className="dealer-info">{dealer.info}</p>{dealer.distance!=null&&<span className="dealer-distance">◎ {dealer.distance.toFixed(1)} km away</span>}<div className="dealer-actions"><a href={`tel:${dealer.phone}`} className="dealer-action primary-action">Call <span>↗</span></a><a href={`https://wa.me/${dealer.wa}`} target="_blank" rel="noreferrer" className="dealer-action">WhatsApp <span>↗</span></a><a href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.lat},${dealer.lng}`} target="_blank" rel="noreferrer" className="dealer-action">Directions <span>↗</span></a></div></article>)}</div>:<div className="empty-state"><span>⌖</span><h3>No sample dealers listed for this city.</h3><p>Try another city or choose “All cities”.</p></div>}
      <div className="sample-data-note"><span>i</span><p>This directory uses sample listings for discovery only. Confirm stock, prices and opening hours with the dealer. Enquiries here do not create dealer leads.</p></div>
    </section>
  </div>;
}
