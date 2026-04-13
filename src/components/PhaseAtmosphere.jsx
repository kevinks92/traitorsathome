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
const isEndgameRoam = p.includes("endgame_free_roam");
const isFire = !isEndgameRoam && PHASES_LOCAL.fire.some(x => p.includes(x));
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
<div style={{ position:"relative", width:"100%", height:165, pointerEvents:"none", marginBottom:4, overflow:"visible" }}>
{/* Ground glow */}
<div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:120, height:16, background:"radial-gradient(ellipse,rgba(255,80,10,.3),transparent)", borderRadius:"50%" }} />
{/* Base plate */}
<div style={{ position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)", width:70, height:8, background:"linear-gradient(to bottom,#8b5a2b,#5c3210)", borderRadius:"2px 2px 6px 6px", boxShadow:"0 2px 8px rgba(0,0,0,.7)" }} />
{/* Base foot */}
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:54, height:11, background:"linear-gradient(to bottom,#9a6230,#5c3210)", borderRadius:"40% 40% 0 0 / 80% 80% 0 0" }} />
{/* Stem */}
<div style={{ position:"absolute", bottom:21, left:"50%", transform:"translateX(-50%)", width:11, height:18, background:"linear-gradient(to right,#5c3210,#a06828,#5c3210)", borderRadius:4 }} />
{/* Stem knop */}
<div style={{ position:"absolute", bottom:31, left:"50%", transform:"translateX(-50%)", width:22, height:10, background:"linear-gradient(to right,#6a3a14,#c07838,#6a3a14)", borderRadius:"50%", boxShadow:"0 0 8px rgba(180,80,20,.4)" }} />
{/* Cup body — solid steel-blue */}
<div style={{ position:"absolute", bottom:40, left:"50%", transform:"translateX(-50%)", width:74, height:48,
  background:"linear-gradient(160deg,#506878 0%,#3e5868 35%,#304858 65%,#3e5d70 100%)",
  borderRadius:"38% 38% 50% 50% / 15% 15% 55% 55%",
  border:"2px solid rgba(120,158,185,.8)",
  boxShadow:"inset 2px 4px 10px rgba(160,200,230,.12),inset -2px -2px 8px rgba(5,12,20,.7),0 0 18px rgba(180,80,20,.3)" }}>
  {/* Subtle engraving — much lighter */}
  <div style={{ position:"absolute", top:"18%", left:"12%", width:"30%", height:"55%", borderRadius:"50%", border:"1px solid rgba(140,180,210,.2)", transform:"rotate(-20deg)" }} />
  {/* Highlight sheen */}
  <div style={{ position:"absolute", top:"8%", left:"18%", width:"20%", height:"34%", background:"rgba(210,240,255,.1)", borderRadius:"50%", transform:"rotate(-15deg)" }} />
</div>
{/* Left handle */}
<div style={{ position:"absolute", bottom:54, left:"calc(50% - 48px)", width:20, height:30, borderRadius:"50% 0 0 50% / 50% 0 0 50%", border:"2px solid rgba(110,145,170,.7)", borderRight:"none", background:"linear-gradient(to left,rgba(50,68,82,.95),rgba(36,52,66,.9))" }} />
{/* Right handle */}
<div style={{ position:"absolute", bottom:54, right:"calc(50% - 48px)", width:20, height:30, borderRadius:"0 50% 50% 0 / 0 50% 50% 0", border:"2px solid rgba(110,145,170,.7)", borderLeft:"none", background:"linear-gradient(to right,rgba(50,68,82,.95),rgba(36,52,66,.9))" }} />
{/* Cup rim */}
<div style={{ position:"absolute", bottom:88, left:"50%", transform:"translateX(-50%)", width:76, height:7, background:"linear-gradient(to bottom,#7090a8,#4a6a80)", borderRadius:"3px 3px 0 0", boxShadow:"0 0 12px rgba(200,120,30,.5),0 -2px 8px rgba(255,140,50,.3)", animation:"gobletGlow 2.5s ease-in-out infinite" }} />
{/* Inner fire glow inside cup */}
<div style={{ position:"absolute", bottom:56, left:"50%", transform:"translateX(-50%)", width:54, height:34, background:"radial-gradient(ellipse at center bottom,rgba(255,120,20,.4),transparent)", borderRadius:"50%" }} />
{/* Outer aura flames behind cup */}
{[-30,-20,-10,0,10,20,30].map((x,i) => (
<div key={`aura-${i}`} style={{ position:"absolute", bottom:88, left:`calc(50% + ${x}px)`, marginLeft:-(7+i%2*5), width:14+i%2*10, height:44+i%3*16, background:`linear-gradient(to top,rgba(160,30,0,.55),rgba(220,70,0,.28),transparent)`, borderRadius:"45% 45% 20% 20% / 70% 70% 30% 30%", animation:`flameWaver ${1.4+i*.18}s ${i*.15}s ease-in-out infinite`, transformOrigin:"bottom center", opacity:0.5 }} />
))}
{/* Main flames — tall tapered, full left coverage */}
{[-30,-24,-14,0,14,24,30].map((x,i) => (
<div key={`f-${i}`} style={{
  position:"absolute",
  bottom:93,
  left:`calc(50% + ${x}px)`,
  marginLeft: i===3?-9:i===2||i===4?-7.5:i===1||i===5?-6:-4.5,
  width: i===3 ? 18 : i===2||i===4 ? 15 : i===1||i===5 ? 12 : 9,
  height: i===3 ? 64 : i===2||i===4 ? 52 : i===1||i===5 ? 40 : 30,
  background:`linear-gradient(to top,${i%2?"#dd2200":"#ff5500"} 0%,#ff9900 45%,#ffdd40 75%,rgba(255,240,100,.05) 100%)`,
  borderRadius:"50% 50% 20% 20% / 80% 80% 20% 20%",
  animation:`flameWaver ${0.85+i*.17}s ${i*.13}s ease-in-out infinite`,
  transformOrigin:"bottom center",
  opacity:1,
}} />
))}
{/* Embers */}
{[0,1,2,3,4,5,6,7].map(i => (
<div key={`e-${i}`} style={{ position:"absolute", left:`calc(50% + ${(i-3.5)*14}px)`, bottom:`${72+i%4*18}px`, width:i%2?4:3, height:i%2?4:3, borderRadius:"50%", background:i%3?"#ffcc40":i%2?"#ff8020":"#ff5010", animation:`emberFloat ${1.2+i*.3}s ${i*.2}s ease-out infinite`, opacity:0.9 }} />
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
<div style={{ position:"relative", width:"100%", height:72, pointerEvents:"none", marginBottom:4, overflow:"visible" }}>
{/* Block shadow */}
<div style={{ position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)", width:56, height:6, background:"radial-gradient(ellipse,rgba(0,0,0,.3),transparent)", borderRadius:"50%" }} />
{/* Wooden block */}
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:44, height:13, background:"linear-gradient(to bottom,#7a4a18,#4a2808)", borderRadius:"3px 3px 2px 2px", boxShadow:"0 2px 6px rgba(0,0,0,.5)" }}>
  <div style={{ position:"absolute", top:"35%", left:6, right:6, height:1, background:"rgba(255,200,100,.1)" }} />
</div>
{/* Impact flash */}
<div style={{ position:"absolute", bottom:22, left:"calc(50% - 9px)", transform:"translateX(-50%)", width:40, height:5, background:"radial-gradient(ellipse,rgba(255,190,60,.7),transparent)", borderRadius:"50%", animation:"gavelImpact 2s ease-in-out infinite" }} />
{/* Gavel — pivot IS the handle end, placed at right of base; gavel extends upward */}
<div style={{ position:"absolute", bottom:23, left:"calc(50% + 40px)", transformOrigin:"0 0", animation:"gavelSwing 2s ease-in-out infinite" }}>
  <div style={{ position:"absolute", top:-30, left:-2, width:5, height:30, background:"linear-gradient(to right,#6a3a10,#a06828,#6a3a10)", borderRadius:3 }} />
  <div style={{ position:"absolute", top:-39, left:-14, width:22, height:9, background:"linear-gradient(to bottom,#9a6230,#4a2808)", borderRadius:3, boxShadow:"0 2px 6px rgba(0,0,0,.5)" }} />
</div>
{/* Impact embers */}
{[0,1,2,3].map(i => (
<div key={i} style={{ position:"absolute", bottom:`${18+i%2*7}px`, left:`calc(50% + ${(i-1.5)*14}px)`, width:3, height:3, borderRadius:"50%", background:i%2?"#ffaa30":"#ff7020", animation:`emberFloat ${0.9+i*.18}s ${i*.12+0.45}s ease-out infinite`, opacity:0.85 }} />
))}
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

if (isEndgameRoam) return (
<div style={{ position:"relative", width:"100%", height:48, pointerEvents:"none", marginBottom:4, overflow:"hidden" }}>
{/* Walking figure */}
<div style={{ position:"absolute", top:"50%", left:"6%", transform:"translateY(-60%)", fontSize:".9rem", animation:"roamDrift 2.4s ease-in-out infinite" }}>🚶</div>
{/* Weaving path dots */}
{[0,1,2,3,4,5,6].map(i => (
<div key={i} style={{
  position:"absolute",
  top:`calc(50% + ${[0,-8,0,8,0,-8,0][i]}px)`,
  left:`${10+i*10}%`,
  transform:"translateY(-50%)",
  width:5, height:5, borderRadius:"50%",
  background:"rgba(201,168,76,.6)",
  animation:`pathStep 1.4s ${i*0.18}s ease-in-out infinite`,
}} />
))}
{/* Mini fire at end */}
<div style={{ position:"absolute", right:"8%", top:"50%", transform:"translateY(-65%)" }}>
{[-5,0,5].map((x,i) => (
<div key={i} style={{
  position:"absolute", bottom:0,
  left:`calc(50% + ${x}px)`, transform:"translateX(-50%)",
  width:i===1?7:4, height:i===1?16:10,
  background:"linear-gradient(to top,#dd3300 0%,#ff8800 50%,#ffcc40 80%,transparent 100%)",
  borderRadius:"50% 50% 20% 20% / 80% 80% 20% 20%",
  animation:`flameWaver ${0.9+i*.25}s ${i*.15}s ease-in-out infinite`,
  transformOrigin:"bottom center",
}} />
))}
<div style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%)", width:20, height:5, background:"radial-gradient(ellipse,rgba(255,80,20,.35),transparent)", borderRadius:"50%" }} />
</div>
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
