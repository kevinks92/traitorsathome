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
const isTurret = p.includes("night_traitor_chat");
const isSeerVision = p.includes("night_seer");
const isSecretTraitor = p.includes("night_secret_traitor");
const isFire = PHASES_LOCAL.fire.some(x => p.includes(x));
const isMission = PHASES_LOCAL.mission.some(x => p.includes(x));
const isTable = PHASES_LOCAL.table.some(x => p.includes(x));
const isBanish = p.includes("banishment");
const isBreakfast = p.includes("breakfast");
const isRoam = p.includes("free_roam");
const isNight = !isTurret && !isSeerVision && !isSecretTraitor && (PHASES_LOCAL.night.some(x => p.includes(x.replace("night_",""))) || p.startsWith("night"));

// ── NIGHT (general) — Stars, moon, candles ────────────────────────────────
if (isNight) return (
<div style={{ position:"relative", width:"100%", height:56, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{[...Array(12)].map((_,i) => (
<div key={i} style={{
position:"absolute",
left:`${6 + i*7.5 + (i%3)*4}%`, top:`${10 + (i%4)*18}px`,
width: i%3===0 ? 3 : 2, height: i%3===0 ? 3 : 2,
borderRadius:"50%", background:"rgba(220,200,255,.9)",
animation:`starTwinkle ${1.4+i*.3}s ${i*.2}s ease-in-out infinite`,
}} />
))}
<div style={{ position:"absolute", right:16, top:8, fontSize:"1.8rem", lineHeight:1, animation:"moonPulse 3s ease-in-out infinite" }}>🌙</div>
{[...Array(6)].map((_,i) => (
<div key={i} style={{ position:"absolute", left:`${8 + i*16}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity: 0.65 + i*.05 }}>
<div style={{ width:7, height:14+i%3*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.2))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.8+i*.25}s ${i*.3}s ease-in-out infinite`, boxShadow:"0 0 8px 3px rgba(255,140,40,.35)", transformOrigin:"bottom center" }} />
<div style={{ width:1.5, height:5, background:"#1a0f05" }} />
<div style={{ width:9, height:18+i%3*5, background:"linear-gradient(to right,rgba(230,210,170,.9),rgba(255,245,220,1),rgba(210,190,155,.9))", borderRadius:"2px 2px 1px 1px" }} />
<div style={{ width:12, height:3, background:"rgba(160,130,90,.8)", borderRadius:"0 0 2px 2px" }} />
</div>
))}
</div>
);

// ── FIRE OF TRUTH — Ornate goblet with animated fire ─────────────────────
if (isFire) return (
<div style={{ position:"relative", width:"100%", height:110, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Ground glow */}
<div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:120, height:16, background:"radial-gradient(ellipse,rgba(255,80,10,.22),transparent)", borderRadius:"50%" }} />
{/* Outer flame aura */}
{[-28,-16,0,16,28].map((x,i) => (
<div key={`aura-${i}`} style={{ position:"absolute", bottom:56, left:`calc(50% + ${x}px)`, transform:"translateX(-50%)", width:14+i%2*10, height:38+i%3*22, background:`linear-gradient(to top,rgba(139,20,0,.7),rgba(200,60,0,.4),transparent)`, borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`flameWaver ${1.4+i*.22}s ${i*.2}s ease-in-out infinite`, transformOrigin:"bottom center", opacity:0.5 }} />
))}
{/* Base plate */}
<div style={{ position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)", width:68, height:8, background:"linear-gradient(to bottom,rgba(160,100,50,.7),rgba(100,55,20,.8))", borderRadius:"2px 2px 6px 6px", boxShadow:"0 2px 8px rgba(0,0,0,.6)" }} />
{/* Base foot */}
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:52, height:10, background:"linear-gradient(to bottom,rgba(140,85,35,.65),rgba(100,55,20,.7))", borderRadius:"40% 40% 0 0 / 80% 80% 0 0" }} />
{/* Stem */}
<div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", width:10, height:18, background:"linear-gradient(to right,rgba(100,55,20,.7),rgba(170,100,40,.85),rgba(100,55,20,.7))", borderRadius:4 }} />
{/* Stem knop */}
<div style={{ position:"absolute", bottom:30, left:"50%", transform:"translateX(-50%)", width:20, height:9, background:"linear-gradient(to right,rgba(110,60,20,.65),rgba(180,110,45,.8),rgba(110,60,20,.65))", borderRadius:"50%", boxShadow:"0 0 8px rgba(180,80,20,.3)" }} />
{/* Cup body */}
<div style={{ position:"absolute", bottom:38, left:"50%", transform:"translateX(-50%)", width:72, height:46,
  background:"linear-gradient(160deg,rgba(80,100,120,.15) 0%,rgba(60,80,110,.22) 35%,rgba(40,60,90,.18) 65%,rgba(80,100,130,.12) 100%)",
  borderRadius:"38% 38% 50% 50% / 15% 15% 55% 55%",
  border:"1.5px solid rgba(100,130,160,.45)",
  boxShadow:"inset 2px 4px 12px rgba(120,160,200,.08),inset -2px 0 8px rgba(60,30,10,.3),0 0 14px rgba(180,80,20,.2)" }}>
  <div style={{ position:"absolute", top:"22%", left:"12%", width:"30%", height:"55%", borderRadius:"50%", border:"1px solid rgba(100,130,160,.25)", transform:"rotate(-20deg)" }} />
  <div style={{ position:"absolute", top:"15%", left:"30%", width:"40%", height:"65%", borderRadius:"50%", border:"1px solid rgba(100,130,160,.18)" }} />
  <div style={{ position:"absolute", top:"8%", left:"18%", width:"22%", height:"38%", background:"rgba(180,210,240,.1)", borderRadius:"50%", transform:"rotate(-15deg)" }} />
</div>
{/* Left handle */}
<div style={{ position:"absolute", bottom:52, left:"calc(50% - 46px)", width:18, height:28, borderRadius:"50% 0 0 50% / 50% 0 0 50%", border:"1.5px solid rgba(100,130,160,.5)", borderRight:"none", background:"linear-gradient(to left,transparent,rgba(60,80,110,.12))" }} />
{/* Right handle */}
<div style={{ position:"absolute", bottom:52, right:"calc(50% - 46px)", width:18, height:28, borderRadius:"0 50% 50% 0 / 0 50% 50% 0", border:"1.5px solid rgba(100,130,160,.5)", borderLeft:"none", background:"linear-gradient(to right,transparent,rgba(60,80,110,.12))" }} />
{/* Cup rim */}
<div style={{ position:"absolute", bottom:84, left:"50%", transform:"translateX(-50%)", width:74, height:6, background:"linear-gradient(to bottom,rgba(130,160,190,.6),rgba(90,115,145,.7))", borderRadius:"3px 3px 0 0", boxShadow:"0 0 10px rgba(180,100,20,.35),0 -2px 6px rgba(255,120,40,.2)", animation:"gobletGlow 2.5s ease-in-out infinite" }} />
{/* Inner fire glow */}
<div style={{ position:"absolute", bottom:54, left:"50%", transform:"translateX(-50%)", width:50, height:32, background:"radial-gradient(ellipse at center bottom,rgba(255,100,20,.28),transparent)", borderRadius:"50%" }} />
{/* Main flames */}
{[-18,-9,0,9,18].map((x,i) => (
<div key={`f-${i}`} style={{ position:"absolute", bottom:88, left:`calc(50% + ${x}px)`, transform:"translateX(-50%)", width:11+i%3*6, height:32+i%3*20, background:`linear-gradient(to top,${i%2?"#cc2800":"#ff5010"},#ffaa20,rgba(255,230,80,.03))`, borderRadius:"50% 50% 25% 25%/65% 65% 35% 35%", animation:`flameWaver ${1.0+i*.19}s ${i*.16}s ease-in-out infinite`, transformOrigin:"bottom center", opacity:0.9 }} />
))}
{/* Embers */}
{[0,1,2,3,4,5,6,7].map(i => (
<div key={`e-${i}`} style={{ position:"absolute", left:`calc(50% + ${(i-3.5)*13}px)`, bottom:`${60+i%4*14}px`, width:i%2?4:3, height:i%2?4:3, borderRadius:"50%", background:i%3?"#ffcc40":i%2?"#ff8020":"#ff5010", animation:`emberFloat ${1.3+i*.32}s ${i*.22}s ease-out infinite`, opacity:0.85 }} />
))}
</div>
);

// ── TURRET — Stone tower with glowing window, night sky ───────────────────
if (isTurret) return (
<div style={{ position:"relative", width:"100%", height:90, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Stars */}
{[...Array(16)].map((_,i) => (
<div key={i} style={{
  position:"absolute",
  left:`${3 + i*6.2 + (i%3)*3.5}%`, top:`${3 + (i%5)*13}px`,
  width: i%4===0 ? 3 : 2, height: i%4===0 ? 3 : 2,
  borderRadius:"50%", background:"rgba(220,200,255,.88)",
  animation:`starTwinkle ${1.3+i*.26}s ${i*.17}s ease-in-out infinite`,
}} />
))}
{/* Moon */}
<div style={{ position:"absolute", left:20, top:5, fontSize:"1.7rem", animation:"moonPulse 3.5s ease-in-out infinite" }}>🌙</div>
{/* Ground fog */}
<div style={{ position:"absolute", bottom:0, left:0, right:0, height:10, background:"linear-gradient(to top,rgba(30,20,50,.6),transparent)" }} />
{/* Turret — left wall section */}
<div style={{ position:"absolute", bottom:0, left:"calc(50% - 38px)", width:14, height:42, background:"rgba(28,20,38,.96)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />
{/* Turret — main body */}
<div style={{ position:"absolute", bottom:0, left:"calc(50% - 26px)", width:52, height:62, background:"rgba(28,20,38,.96)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />
{/* Turret — right wall section */}
<div style={{ position:"absolute", bottom:0, right:"calc(50% - 38px)", width:14, height:34, background:"rgba(28,20,38,.96)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />
{/* Battlements */}
{[-22,-12,-2,8,18].map((x,i) => (
<div key={i} style={{
  position:"absolute", bottom: i===0||i===4 ? 38 : 58,
  left:`calc(50% + ${x}px)`,
  width:9, height: i===1||i===3 ? 12 : 14,
  background:"rgba(28,20,38,.97)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none",
}} />
))}
{/* Arch window */}
<div style={{
  position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)",
  width:20, height:28,
  background:"rgba(255,175,55,.08)",
  borderRadius:"50% 50% 0 0 / 40% 40% 0 0",
  border:"1px solid rgba(255,180,60,.25)",
  animation:"windowGlow 2.2s ease-in-out infinite",
}} />
{/* Window warm glow core */}
<div style={{
  position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)",
  width:14, height:22,
  background:"radial-gradient(ellipse at center,rgba(255,190,70,.35),rgba(255,140,30,.1),transparent)",
  borderRadius:"50% 50% 10% 10%",
  animation:"windowGlow 2.2s .3s ease-in-out infinite",
}} />
{/* Window glow spill on ground below */}
<div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:28, height:22, background:"radial-gradient(ellipse at top,rgba(255,160,40,.1),transparent)", animation:"windowGlow 2.2s ease-in-out infinite" }} />
{/* Stone texture suggestions */}
{[0,1,2].map(row => [0,1,2,3].map(col => (
<div key={`${row}-${col}`} style={{
  position:"absolute",
  bottom: 4 + row*18, left:`calc(50% - 22px + ${col*13}px)`,
  width:11, height:7,
  border:"1px solid rgba(55,40,75,.22)",
  borderRadius:1,
  pointerEvents:"none",
}} />
)))}
</div>
);

// ── SECRET TRAITOR — Parchment & quill with night sky ────────────────────
if (isSecretTraitor) return (
<div style={{ position:"relative", width:"100%", height:90, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Stars */}
{[...Array(18)].map((_,i) => (
<div key={i} style={{
  position:"absolute",
  left:`${2+i*5.5+(i%4)*2.5}%`, top:`${2+(i%6)*12}px`,
  width:i%4===0?3:2, height:i%4===0?3:2,
  borderRadius:"50%", background:"rgba(220,200,255,.85)",
  animation:`starTwinkle ${1.3+i*.25}s ${i*.16}s ease-in-out infinite`,
}} />
))}
{/* Moon */}
<div style={{ position:"absolute", right:18, top:5, fontSize:"1.6rem", animation:"moonPulse 3.5s ease-in-out infinite" }}>🌙</div>
{/* Parchment shadow */}
<div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", width:70, height:8, background:"radial-gradient(ellipse,rgba(80,40,20,.45),transparent)", borderRadius:"50%" }} />
{/* Parchment body */}
<div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", width:68, height:56, background:"linear-gradient(135deg,rgba(220,190,130,.18) 0%,rgba(200,165,100,.28) 40%,rgba(180,145,80,.2) 100%)", border:"1px solid rgba(210,175,110,.35)", borderRadius:3, boxShadow:"inset 0 1px 8px rgba(220,185,110,.08)" }}>
{[0,1,2,3,4].map(i => (<div key={i} style={{ position:"absolute", top:`${10+i*9}px`, left:10, right:10, height:1, background:`rgba(210,175,110,${.12+i*.02})`, borderRadius:1 }} />))}
<div style={{ position:"absolute", top:52, left:10, width:"45%", height:1, background:"rgba(210,175,110,.1)", borderRadius:1 }} />
</div>
{/* Top rod */}
<div style={{ position:"absolute", bottom:66, left:"50%", transform:"translateX(-50%)", width:74, height:6, background:"linear-gradient(to bottom,rgba(200,155,70,.55),rgba(160,115,45,.65))", borderRadius:"3px 3px 1px 1px", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }} />
{/* Bottom rod */}
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:74, height:6, background:"linear-gradient(to top,rgba(200,155,70,.55),rgba(160,115,45,.65))", borderRadius:"1px 1px 3px 3px", boxShadow:"0 -1px 4px rgba(0,0,0,.4)" }} />
{/* Quill */}
<div style={{ position:"absolute", bottom:30, left:"calc(50% + 16px)", fontSize:"1.4rem", transform:"rotate(-35deg)", animation:"candleFlicker 2.2s ease-in-out infinite", filter:"drop-shadow(0 0 6px rgba(200,160,80,.3))" }}>🪶</div>
{/* Ink glow */}
<div style={{ position:"absolute", bottom:28, left:"calc(50% + 8px)", width:4, height:4, borderRadius:"50%", background:"rgba(160,120,200,.5)", boxShadow:"0 0 6px 3px rgba(140,80,200,.3)", animation:"orbPulse 2s ease-in-out infinite" }} />
</div>
);

// ── SEER'S VISION — Crystal ball with stars and moon ──────────────────────
if (isSeerVision) return (
<div style={{ position:"relative", width:"100%", height:90, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Stars */}
{[...Array(16)].map((_,i) => (
<div key={i} style={{
  position:"absolute",
  left:`${2 + i*6.4 + (i%3)*3}%`, top:`${2 + (i%5)*14}px`,
  width: i%4===0 ? 3 : 2, height: i%4===0 ? 3 : 2,
  borderRadius:"50%", background:"rgba(220,200,255,.88)",
  animation:`starTwinkle ${1.3+i*.27}s ${i*.19}s ease-in-out infinite`,
}} />
))}
{/* Moon */}
<div style={{ position:"absolute", right:20, top:5, fontSize:"1.7rem", animation:"moonPulse 3.5s ease-in-out infinite" }}>🌙</div>
{/* Orbiting sparkles */}
{[0,1,2,3,4,5].map(i => {
const ang = (i/6)*Math.PI*2 - Math.PI/4;
const rx=40, ry=20;
return (
<div key={i} style={{
  position:"absolute",
  left:`calc(50% + ${Math.cos(ang)*rx}px - 2px)`,
  top:`calc(55px + ${Math.sin(ang)*ry}px - 2px)`,
  width: i%2===0?4:3, height: i%2===0?4:3,
  background:"rgba(200,160,255,.9)",
  borderRadius:"50%",
  boxShadow:"0 0 5px 2px rgba(180,120,255,.45)",
  animation:`starTwinkle ${1.1+i*.32}s ${i*.22}s ease-in-out infinite`,
}} />
);
})}
{/* Pedestal base */}
<div style={{ position:"absolute", bottom:5, left:"50%", transform:"translateX(-50%)", width:46, height:5, background:"linear-gradient(to bottom,rgba(120,80,200,.5),rgba(80,50,150,.6))", borderRadius:"2px 2px 4px 4px" }} />
{/* Pedestal stem */}
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:18, height:12, background:"linear-gradient(to bottom,rgba(140,90,210,.45),rgba(100,65,170,.55))", borderRadius:"3px 3px 0 0" }} />
{/* Pedestal cup */}
<div style={{ position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)", width:36, height:7, background:"linear-gradient(to bottom,rgba(150,100,220,.5),rgba(110,70,180,.55))", borderRadius:"50% 50% 10% 10% / 60% 60% 20% 20%" }} />
{/* Shadow under ball */}
<div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", width:46, height:7, background:"radial-gradient(ellipse,rgba(80,40,160,.45),transparent)", borderRadius:"50%" }} />
{/* Crystal ball outer glow */}
<div style={{
  position:"absolute",
  top:10, left:"50%", transform:"translateX(-50%)",
  width:58, height:58, borderRadius:"50%",
  background:"transparent",
  boxShadow:"0 0 22px 10px rgba(140,80,240,.16),0 0 50px 24px rgba(100,50,200,.07)",
  animation:"crystalPulse 2.6s ease-in-out infinite",
}} />
{/* Crystal ball body */}
<div style={{
  position:"absolute",
  top:12, left:"50%", transform:"translateX(-50%)",
  width:54, height:54, borderRadius:"50%",
  background:"radial-gradient(circle at 36% 30%,rgba(255,255,255,.22) 0%,rgba(190,150,255,.1) 28%,rgba(110,60,210,.09) 58%,rgba(30,8,70,.14) 100%)",
  border:"1.5px solid rgba(190,150,255,.32)",
  overflow:"hidden",
}}>
{/* Inner mist swirl */}
<div style={{ position:"absolute", top:"28%", left:"12%", width:"72%", height:"62%", background:"radial-gradient(ellipse,rgba(150,100,255,.22),transparent)", borderRadius:"50%", animation:"crystalSwirl 3.4s ease-in-out infinite" }} />
<div style={{ position:"absolute", top:"48%", left:"30%", width:"50%", height:"40%", background:"radial-gradient(ellipse,rgba(120,80,230,.14),transparent)", borderRadius:"50%", animation:"crystalSwirl 4.2s .8s ease-in-out infinite" }} />
{/* Main highlight */}
<div style={{ position:"absolute", top:"12%", left:"20%", width:"32%", height:"22%", background:"rgba(255,255,255,.32)", borderRadius:"50%", transform:"rotate(-25deg)" }} />
{/* Secondary highlight */}
<div style={{ position:"absolute", top:"20%", left:"58%", width:"14%", height:"10%", background:"rgba(255,255,255,.18)", borderRadius:"50%" }} />
</div>
</div>
);

if (isMission) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s ease-in-out infinite", marginRight:12 }}>⚔️</div>
<div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(201,168,76,.4),rgba(201,168,76,.1))", animation:"pulse 2s ease-in-out infinite" }} />
<div style={{ fontSize:"1rem", margin:"0 8px", opacity:.5 }}>✦</div>
<div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,rgba(201,168,76,.4),rgba(201,168,76,.1))", animation:"pulse 2s .3s ease-in-out infinite" }} />
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s .5s ease-in-out infinite", marginLeft:12 }}>🛡️</div>
</div>
);

if (isTable) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
{[...Array(5)].map((_,i) => (
<div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", opacity: 0.5+i%2*.3 }}>
<div style={{ width:7, height:12+i%3*3, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.15))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.6+i*.3}s ${i*.25}s ease-in-out infinite`, boxShadow:"0 0 6px 2px rgba(255,140,40,.3)", transformOrigin:"bottom center" }} />
<div style={{ width:1, height:4, background:"#1a0f05" }} />
<div style={{ width:8, height:16+i%2*6, background:"linear-gradient(to right,rgba(230,210,170,.85),rgba(255,245,220,1),rgba(210,190,155,.85))", borderRadius:"2px 2px 1px 1px" }} />
</div>
))}
</div>
);

if (isBanish) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
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
