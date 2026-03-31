import { AnimatedCandles } from "./AnimatedCandles.jsx";

function PhaseAtmosphere({ phase }) {
const PHASES_LOCAL = {
night: ["night_sequester","night_seer","night_recruit","night_recruit_response","night_secret_traitor","night_traitor_chat","night_resolve"],
fire: ["endgame","endgame_free_roam"],
mission: ["mission_briefing","mission_active"],
table: ["round_table","voting"],
banish: ["banishment"],
breakfast: ["breakfast"],
roam: ["free_roam"],
};
const p = phase?.toLowerCase() || "";
const isNight = PHASES_LOCAL.night.some(x => p.includes(x.replace("night_",""))) || p.startsWith("night");
const isFire = PHASES_LOCAL.fire.some(x => p.includes(x));
const isMission = PHASES_LOCAL.mission.some(x => p.includes(x));
const isTable = PHASES_LOCAL.table.some(x => p.includes(x));
const isBanish = p.includes("banishment");
const isBreakfast = p.includes("breakfast");
const isRoam = p.includes("free_roam");

if (isNight) return (
<div style={{ position:"relative", width:"100%", height:56, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Stars */}
{[...Array(12)].map((_,i) => (
<div key={i} style={{
position:"absolute",
left:`${6 + i*7.5 + (i%3)*4}%`, top:`${10 + (i%4)*18}px`,
width: i%3===0 ? 3 : 2, height: i%3===0 ? 3 : 2,
borderRadius:"50%", background:"rgba(220,200,255,.9)",
animation:`starTwinkle ${1.4+i*.3}s ${i*.2}s ease-in-out infinite`,
}} />
))}
{/* Moon */}
<div style={{
position:"absolute", right:16, top:8,
fontSize:"1.8rem", lineHeight:1,
animation:"moonPulse 3s ease-in-out infinite",
}}>🌙</div>
{/* Candles row */}
{[...Array(6)].map((_,i) => (
<div key={i} style={{
position:"absolute",
left:`${8 + i*16}%`, bottom:0,
display:"flex", flexDirection:"column", alignItems:"center",
opacity: 0.65 + i*.05,
}}>
<div style={{
width:7, height:14+i%3*4,
background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.2))",
borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%",
animation:`candleFlicker ${1.8+i*.25}s ${i*.3}s ease-in-out infinite`,
boxShadow:"0 0 8px 3px rgba(255,140,40,.35)",
transformOrigin:"bottom center",
}} />
<div style={{ width:1.5, height:5, background:"#1a0f05" }} />
<div style={{ width:9, height:18+i%3*5, background:"linear-gradient(to right,rgba(230,210,170,.9),rgba(255,245,220,1),rgba(210,190,155,.9))", borderRadius:"2px 2px 1px 1px" }} />
<div style={{ width:12, height:3, background:"rgba(160,130,90,.8)", borderRadius:"0 0 2px 2px" }} />
</div>
))}
</div>
);

if (isFire) return (
<div style={{ position:"relative", width:"100%", height:56, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Fire base glow */}
<div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:8, background:"radial-gradient(ellipse,rgba(255,80,20,.4),transparent)", borderRadius:"50%" }} />
{/* Flames */}
{[...Array(9)].map((_,i) => (
<div key={i} style={{
position:"absolute",
left:`${8+i*10.5}%`, bottom:0,
width: 10+i%3*4, height: 24+i%4*10,
background:`linear-gradient(to top,${i%2?"#ff4010":"#ff6820"},#ffaa30,rgba(255,220,80,.1))`,
borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%",
animation:`flameWaver ${1.2+i*.18}s ${i*.15}s ease-in-out infinite`,
opacity: 0.7+i%3*.1,
transformOrigin:"bottom center",
}} />
))}
{/* Embers */}
{[...Array(8)].map((_,i) => (
<div key={i} style={{
position:"absolute",
left:`${15+i*9}%`, bottom:`${8+i%3*8}px`,
width:3, height:3, borderRadius:"50%",
background:"#ffaa40",
animation:`emberFloat ${1.8+i*.4}s ${i*.3}s ease-out infinite`,
opacity:0.8,
}} />
))}
</div>
);

if (isMission) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s ease-in-out infinite", marginRight:12 }}>⚔️</div>
{/* Shimmer line left */}
<div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(201,168,76,.4),rgba(201,168,76,.1))", animation:"pulse 2s ease-in-out infinite" }} />
<div style={{ fontSize:"1rem", margin:"0 8px", opacity:.5 }}>✦</div>
{/* Shimmer line right */}
<div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,rgba(201,168,76,.4),rgba(201,168,76,.1))", animation:"pulse 2s .3s ease-in-out infinite" }} />
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s .5s ease-in-out infinite", marginLeft:12 }}>🛡️</div>
</div>
);

if (isTable) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
{[...Array(5)].map((_,i) => (
<div key={i} style={{
display:"flex", flexDirection:"column", alignItems:"center",
opacity: 0.5+i%2*.3,
}}>
<div style={{ width:7, height:12+i%3*3, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.15))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.6+i*.3}s ${i*.25}s ease-in-out infinite`, boxShadow:"0 0 6px 2px rgba(255,140,40,.3)", transformOrigin:"bottom center" }} />
<div style={{ width:1, height:4, background:"#1a0f05" }} />
<div style={{ width:8, height:16+i%2*6, background:"linear-gradient(to right,rgba(230,210,170,.85),rgba(255,245,220,1),rgba(210,190,155,.85))", borderRadius:"2px 2px 1px 1px" }} />
</div>
))}
</div>
);

if (isBanish) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
{/* Embers floating up */}
{[...Array(10)].map((_,i) => (
<div key={i} style={{
position:"absolute",
left:`${5+i*9.5}%`, bottom:`${i%3*6}px`,
width:i%2?4:3, height:i%2?4:3, borderRadius:"50%",
background:i%3?"#ff6020":i%2?"#ffaa40":"#ff8030",
animation:`emberFloat ${1.4+i*.35}s ${i*.2}s ease-out infinite`,
}} />
))}
<div style={{ fontSize:"2rem", animation:"fireBreath 1.8s ease-in-out infinite" }}>🔥</div>
</div>
);

if (isBreakfast) return (
<div style={{ position:"relative", width:"100%", height:44, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
<div style={{ fontSize:"1.6rem", animation:"breakfastRise .6s ease-out both" }}>🍳</div>
<div style={{ height:1, width:40, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
<div style={{ fontSize:"1.4rem", animation:"breakfastRise .6s .15s ease-out both" }}>☕</div>
<div style={{ height:1, width:40, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"pulse 3s .5s ease-in-out infinite" }} />
<div style={{ fontSize:"1.6rem", animation:"breakfastRise .6s .3s ease-out both" }}>🌅</div>
</div>
);

if (isRoam) return (
<div style={{ position:"relative", width:"100%", height:44, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
{["🏰","·","🗺️","·","🏰"].map((e,i) => (
<div key={i} style={{ fontSize:i%2?"1rem":"1.6rem", opacity:i%2?.3:1, animation: i%2===0 ? `roamDrift ${2.5+i*.4}s ${i*.3}s ease-in-out infinite` : "pulse 2s ease-in-out infinite", color:i%2?"var(--gold2)":"inherit" }}>{e}</div>
))}
</div>
);

return null;
}

export { PhaseAtmosphere };
