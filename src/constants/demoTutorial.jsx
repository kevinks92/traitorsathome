import { useEffect, useRef, useState } from "react";
import { GoldFrame } from "../components/GoldFrame.jsx";

const DEMO_PLAYERS = [
  { id: "p1", name: "Jamie",  emoji: "🦊", role: "faithful",       alive: true,  shield: false, dagger: false },
  { id: "p2", name: "Alex",   emoji: "🐺", role: "traitor",        alive: true,  shield: false, dagger: false },
  { id: "p3", name: "Sam",    emoji: "🦅", role: "faithful",       alive: true,  shield: true,  dagger: false },
  { id: "p4", name: "Riley",  emoji: "🐉", role: "secret_traitor", alive: true,  shield: false, dagger: false },
  { id: "p5", name: "Morgan", emoji: "🦁", role: "faithful",       alive: true,  shield: false, dagger: true  },
  { id: "p6", name: "Casey",  emoji: "🐍", role: "faithful",       alive: true,  shield: false, dagger: false },
  { id: "p7", name: "Drew",   emoji: "🦉", role: "faithful",       alive: false, shield: false, dagger: false },
  { id: "p8", name: "Quinn",  emoji: "🐻", role: "faithful",       alive: false, shield: false, dagger: false },
];

// ── Reusable atmosphere scenes for demo slides ───────────────────────────
const GobletScene = () => (
<div style={{ position:"relative", background:"rgba(8,2,2,.97)", border:"1px solid rgba(139,40,20,.4)", borderRadius:4, overflow:"hidden", minHeight:90, marginBottom:0 }}>
<div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:90, height:14, background:"radial-gradient(ellipse,rgba(255,100,20,.28),transparent)", borderRadius:"50%" }} />
<div style={{ position:"absolute", bottom:5, left:"50%", transform:"translateX(-50%)", width:52, height:7, background:"linear-gradient(to bottom,rgba(201,168,76,.65),rgba(160,120,40,.5))", borderRadius:"3px 3px 4px 4px", animation:"gobletGlow 2.5s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", width:11, height:20, background:"linear-gradient(to right,rgba(170,130,40,.55),rgba(220,185,80,.8),rgba(170,130,40,.55))", borderRadius:6 }} />
<div style={{ position:"absolute", bottom:19, left:"50%", transform:"translateX(-50%)", width:17, height:8, background:"linear-gradient(to right,rgba(180,140,50,.5),rgba(230,195,80,.75),rgba(180,140,50,.5))", borderRadius:"50%", boxShadow:"0 0 6px rgba(201,168,76,.2)" }} />
<div style={{ position:"absolute", bottom:30, left:"50%", transform:"translateX(-50%)", width:48, height:36, background:"linear-gradient(135deg,rgba(201,168,76,.08) 0%,rgba(201,168,76,.18) 45%,rgba(201,168,76,.06) 100%)", borderRadius:"40% 40% 48% 48% / 18% 18% 50% 50%", border:"1.5px solid rgba(201,168,76,.55)", boxShadow:"inset 0 0 18px rgba(255,120,30,.1),0 0 10px rgba(201,168,76,.12)" }} />
<div style={{ position:"absolute", bottom:66, left:"50%", transform:"translateX(-50%)", width:50, height:5, background:"rgba(201,168,76,.72)", borderRadius:"3px 3px 0 0", boxShadow:"0 0 8px rgba(201,168,76,.5)", animation:"gobletGlow 2.5s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:42, left:"50%", transform:"translateX(-50%)", width:32, height:26, background:"radial-gradient(ellipse at center bottom,rgba(255,100,20,.35),transparent)", borderRadius:"50%" }} />
{[0,1,2,3,4].map(i => (<div key={i} style={{ position:"absolute", bottom:65, left:`calc(50% + ${(i-2)*9}px)`, transform:"translateX(-50%)", width:9+i%3*5, height:26+i%3*16, background:`linear-gradient(to top,${i%2?"#ff3800":"#ff6010"},#ffbb30,rgba(255,230,100,.04))`, borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`flameWaver ${1.1+i*.2}s ${i*.17}s ease-in-out infinite`, transformOrigin:"bottom center", opacity:0.8+i%2*.15 }} />))}
{[0,1,2,3,4,5,6].map(i => (<div key={i} style={{ position:"absolute", left:`calc(50% + ${(i-3)*11}px)`, bottom:`${36+i%4*10}px`, width:3, height:3, borderRadius:"50%", background:i%2?"#ffaa40":"#ff8030", animation:`emberFloat ${1.5+i*.38}s ${i*.28}s ease-out infinite`, opacity:0.75 }} />))}
<div style={{ position:"absolute", bottom:42, left:"calc(50% - 42px)", width:28, height:1, background:"linear-gradient(to left,rgba(201,168,76,.35),transparent)" }} />
<div style={{ position:"absolute", bottom:42, right:"calc(50% - 42px)", width:28, height:1, background:"linear-gradient(to right,rgba(201,168,76,.35),transparent)" }} />
</div>
);

const TurretScene = () => (
<div style={{ position:"relative", background:"rgba(4,1,12,.97)", border:"1px solid rgba(80,40,120,.3)", borderRadius:4, overflow:"hidden", minHeight:90, marginBottom:0 }}>
{[...Array(16)].map((_,i) => (<div key={i} style={{ position:"absolute", left:`${3+i*6.2+(i%3)*3.5}%`, top:`${3+(i%5)*13}px`, width:i%4===0?3:2, height:i%4===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.88)", animation:`starTwinkle ${1.3+i*.26}s ${i*.17}s ease-in-out infinite` }} />))}
<div style={{ position:"absolute", left:20, top:5, fontSize:"1.7rem", animation:"moonPulse 3.5s ease-in-out infinite" }}>🌙</div>
<div style={{ position:"absolute", bottom:0, left:0, right:0, height:10, background:"linear-gradient(to top,rgba(30,20,50,.6),transparent)" }} />
<div style={{ position:"absolute", bottom:0, left:"calc(50% - 38px)", width:14, height:42, background:"rgba(28,20,38,.96)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />
<div style={{ position:"absolute", bottom:0, left:"calc(50% - 26px)", width:52, height:62, background:"rgba(28,20,38,.96)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />
<div style={{ position:"absolute", bottom:0, right:"calc(50% - 38px)", width:14, height:34, background:"rgba(28,20,38,.96)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />
{[-22,-12,-2,8,18].map((x,i) => (<div key={i} style={{ position:"absolute", bottom:i===0||i===4?38:58, left:`calc(50% + ${x}px)`, width:9, height:i===1||i===3?12:14, background:"rgba(28,20,38,.97)", border:"1px solid rgba(55,40,75,.5)", borderBottom:"none" }} />))}
<div style={{ position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)", width:20, height:28, background:"rgba(255,175,55,.08)", borderRadius:"50% 50% 0 0 / 40% 40% 0 0", border:"1px solid rgba(255,180,60,.25)", animation:"windowGlow 2.2s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)", width:14, height:22, background:"radial-gradient(ellipse at center,rgba(255,190,70,.35),rgba(255,140,30,.1),transparent)", borderRadius:"50% 50% 10% 10%", animation:"windowGlow 2.2s .3s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:28, height:22, background:"radial-gradient(ellipse at top,rgba(255,160,40,.1),transparent)", animation:"windowGlow 2.2s ease-in-out infinite" }} />
{[0,1,2].map(row => [0,1,2,3].map(col => (<div key={`${row}-${col}`} style={{ position:"absolute", bottom:4+row*18, left:`calc(50% - 22px + ${col*13}px)`, width:11, height:7, border:"1px solid rgba(55,40,75,.22)", borderRadius:1, pointerEvents:"none" }} />)))}
</div>
);

const CrystalBallScene = () => (
<div style={{ position:"relative", background:"rgba(4,1,12,.97)", border:"1px solid rgba(80,40,120,.3)", borderRadius:4, overflow:"hidden", minHeight:90, marginBottom:0 }}>
{[...Array(16)].map((_,i) => (<div key={i} style={{ position:"absolute", left:`${2+i*6.4+(i%3)*3}%`, top:`${2+(i%5)*14}px`, width:i%4===0?3:2, height:i%4===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.88)", animation:`starTwinkle ${1.3+i*.27}s ${i*.19}s ease-in-out infinite` }} />))}
<div style={{ position:"absolute", right:20, top:5, fontSize:"1.7rem", animation:"moonPulse 3.5s ease-in-out infinite" }}>🌙</div>
{[0,1,2,3,4,5].map(i => { const ang=(i/6)*Math.PI*2-Math.PI/4,rx=40,ry=20; return (<div key={i} style={{ position:"absolute", left:`calc(50% + ${Math.cos(ang)*rx}px - 2px)`, top:`calc(54px + ${Math.sin(ang)*ry}px - 2px)`, width:i%2===0?4:3, height:i%2===0?4:3, background:"rgba(200,160,255,.9)", borderRadius:"50%", boxShadow:"0 0 5px 2px rgba(180,120,255,.45)", animation:`starTwinkle ${1.1+i*.32}s ${i*.22}s ease-in-out infinite` }} />); })}
<div style={{ position:"absolute", bottom:5, left:"50%", transform:"translateX(-50%)", width:46, height:5, background:"linear-gradient(to bottom,rgba(120,80,200,.5),rgba(80,50,150,.6))", borderRadius:"2px 2px 4px 4px" }} />
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:18, height:12, background:"linear-gradient(to bottom,rgba(140,90,210,.45),rgba(100,65,170,.55))", borderRadius:"3px 3px 0 0" }} />
<div style={{ position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)", width:36, height:7, background:"linear-gradient(to bottom,rgba(150,100,220,.5),rgba(110,70,180,.55))", borderRadius:"50% 50% 10% 10% / 60% 60% 20% 20%" }} />
<div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", width:46, height:7, background:"radial-gradient(ellipse,rgba(80,40,160,.45),transparent)", borderRadius:"50%" }} />
<div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:58, height:58, borderRadius:"50%", background:"transparent", boxShadow:"0 0 22px 10px rgba(140,80,240,.16),0 0 50px 24px rgba(100,50,200,.07)", animation:"crystalPulse 2.6s ease-in-out infinite" }} />
<div style={{ position:"absolute", top:12, left:"50%", transform:"translateX(-50%)", width:54, height:54, borderRadius:"50%", background:"radial-gradient(circle at 36% 30%,rgba(255,255,255,.22) 0%,rgba(190,150,255,.1) 28%,rgba(110,60,210,.09) 58%,rgba(30,8,70,.14) 100%)", border:"1.5px solid rgba(190,150,255,.32)", overflow:"hidden" }}>
<div style={{ position:"absolute", top:"28%", left:"12%", width:"72%", height:"62%", background:"radial-gradient(ellipse,rgba(150,100,255,.22),transparent)", borderRadius:"50%", animation:"crystalSwirl 3.4s ease-in-out infinite" }} />
<div style={{ position:"absolute", top:"12%", left:"20%", width:"32%", height:"22%", background:"rgba(255,255,255,.32)", borderRadius:"50%", transform:"rotate(-25deg)" }} />
<div style={{ position:"absolute", top:"20%", left:"58%", width:"14%", height:"10%", background:"rgba(255,255,255,.18)", borderRadius:"50%" }} />
</div>
</div>
);

const ParchmentScene = () => (
<div style={{ position:"relative", background:"rgba(4,1,12,.97)", border:"1px solid rgba(120,40,180,.3)", borderRadius:4, overflow:"hidden", minHeight:90, marginBottom:0 }}>
{/* Stars */}
{[...Array(18)].map((_,i) => (<div key={i} style={{ position:"absolute", left:`${2+i*5.5+(i%4)*2.5}%`, top:`${2+(i%6)*12}px`, width:i%4===0?3:2, height:i%4===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.85)", animation:`starTwinkle ${1.3+i*.25}s ${i*.16}s ease-in-out infinite` }} />))}
{/* Moon */}
<div style={{ position:"absolute", right:18, top:5, fontSize:"1.6rem", animation:"moonPulse 3.5s ease-in-out infinite" }}>🌙</div>
{/* Parchment shadow */}
<div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", width:70, height:8, background:"radial-gradient(ellipse,rgba(80,40,20,.45),transparent)", borderRadius:"50%" }} />
{/* Parchment scroll body */}
<div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", width:68, height:56, background:"linear-gradient(135deg,rgba(220,190,130,.18) 0%,rgba(200,165,100,.28) 40%,rgba(180,145,80,.2) 100%)", border:"1px solid rgba(210,175,110,.35)", borderRadius:3, boxShadow:"inset 0 1px 8px rgba(220,185,110,.08)" }}>
{/* Scroll lines */}
{[0,1,2,3,4].map(i => (<div key={i} style={{ position:"absolute", top:`${10+i*9}px`, left:10, right:10, height:1, background:`rgba(210,175,110,${.12+i*.02})`, borderRadius:1 }} />))}
{/* Short line — partial last entry */}
<div style={{ position:"absolute", top:52, left:10, width:"45%", height:1, background:"rgba(210,175,110,.1)", borderRadius:1 }} />
</div>
{/* Top scroll rod */}
<div style={{ position:"absolute", bottom:66, left:"50%", transform:"translateX(-50%)", width:74, height:6, background:"linear-gradient(to bottom,rgba(200,155,70,.55),rgba(160,115,45,.65))", borderRadius:"3px 3px 1px 1px", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }} />
{/* Bottom scroll rod */}
<div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", width:74, height:6, background:"linear-gradient(to top,rgba(200,155,70,.55),rgba(160,115,45,.65))", borderRadius:"1px 1px 3px 3px", boxShadow:"0 -1px 4px rgba(0,0,0,.4)" }} />
{/* Quill */}
<div style={{ position:"absolute", bottom:30, left:"calc(50% + 16px)", fontSize:"1.4rem", transform:"rotate(-35deg)", animation:`candleFlicker 2.2s ease-in-out infinite`, filter:"drop-shadow(0 0 6px rgba(200,160,80,.3))" }}>🪶</div>
{/* Ink glow dot */}
<div style={{ position:"absolute", bottom:28, left:"calc(50% + 8px)", width:4, height:4, borderRadius:"50%", background:"rgba(160,120,200,.5)", boxShadow:"0 0 6px 3px rgba(140,80,200,.3)", animation:`orbPulse 2s ease-in-out infinite` }} />
</div>
);

const HOST_DEMO = [

{
label: "Welcome — Your Role",
icon: "⚜️",
desc: "You run everything. You control every phase transition, run the night ceremony, facilitate missions, orchestrate breakfast, and moderate the Fire of Truth. Players can never advance the game — only you can. You have a private view of all roles at all times.",
tip: "Keep this panel close. Every phase has step-by-step instructions built in.",
render: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{["⚜️ Control all phase transitions","🎭 See every player's role privately","🎲 Configure Secret Traitor, Seer, Dagger","🌙 Run the night ceremony","🍳 Stage the breakfast reveal — two-step reveal","👻 Ghost Chat with eliminated players"].map((t,i) => (
<div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 14px", background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, fontSize: ".88rem" }}>{t}</div>
))}
</div>
),
},

{
label: "Lobby",
icon: "🏰",
desc: "Share your Game ID — players join on their own phones. A green/red dot in the corner shows each player's connection status. Each player card has a ✕ kick button to remove anyone who joined incorrectly. Players can take a selfie (📸 button) that appears in the photo wall at breakfast and in your View Players panel with ornate gold frames. If a player's browser refreshes mid-game, it rejoins automatically. Choose Traitors, pick duration, toggle elements, lock in.",
tip: "Secret Traitor works best with 12+ players — enough for at least 2 regular Traitors plus the Secret Traitor. Minimum 10 players overall.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Game ID */}
<div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: 10, textAlign: "center" }}>
<div style={{ fontSize: ".58rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--gold2)", marginBottom: 4, textTransform: "uppercase" }}>Game ID — Share This</div>
<div style={{ fontFamily: "monospace", fontSize: "1.3rem", color: "var(--gold)", letterSpacing: ".2em" }}>AB4C2D</div>
</div>
{/* Player list */}
<div style={{ background: "rgba(10,5,20,.8)", border: "1px solid var(--border)", borderRadius: 3, padding: 10 }}>
<div style={{ fontSize: ".58rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 8 }}>Players Gathered (10)</div>
<div className="pgrid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
{[...DEMO_PLAYERS, {id:"p9",emoji:"🦋",name:"Jordan",role:"faithful"},{id:"p10",emoji:"🐝",name:"Blake",role:"faithful"}].slice(0,10).map(p => (
<div key={p.id} className="pcard" style={{ padding: "6px 4px" }}>
<div className="pavatar" style={{ fontSize: "1.2rem" }}>{p.emoji}</div>
<div className="pname" style={{ fontSize: ".55rem" }}>{p.name}</div>
</div>
))}
</div>
</div>
{/* Traitor selection */}
<div style={{ display: "flex", gap: 6 }}>
<div style={{ flex:1, padding:"7px 4px", borderRadius:3, textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:".68rem", fontWeight:700, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", color:"var(--dim)" }}>🎲 Let Fate Decide</div>
<div style={{ flex:1, padding:"7px 4px", borderRadius:3, textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:".68rem", fontWeight:700, background:"rgba(139,26,26,.15)", border:"1px solid rgba(139,26,26,.5)", color:"var(--crim3)" }}>🗡️ Choose Traitors</div>
</div>
<div className="pgrid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
{[...DEMO_PLAYERS, {id:"p9",emoji:"🦋",name:"Jordan",role:"faithful"},{id:"p10",emoji:"🐝",name:"Blake",role:"faithful"}].slice(0,10).map((p,i) => (
<div key={p.id} className={`pcard ${p.role==="traitor"?"crim":""}`} style={{ padding: "6px 4px", borderColor: p.role==="traitor"?"rgba(139,26,26,.6)":"var(--border)" }}>
<div className="pavatar" style={{ fontSize: "1.2rem" }}>{p.emoji}</div>
<div className="pname" style={{ fontSize: ".55rem" }}>{p.name}</div>
{p.role==="traitor" && <div className="prole role-t" style={{ fontSize: ".45rem" }}>Traitor</div>}
</div>
))}
</div>
{/* Duration */}
<div style={{ display: "flex", gap: 4 }}>
{[{h:"3h",p:"10--11"},{h:"4h",p:"12--13"},{h:"5h",p:"14--15"},{h:"6h",p:"16--19"},{h:"7h",p:"20--22"},{h:"8h",p:"23--24"}].map((d,i) => (
<div key={i} style={{ flex:1, padding:"7px 3px", borderRadius:3, textAlign:"center", fontFamily:"'Cinzel',serif", background:i===1?"rgba(201,168,76,.15)":"rgba(255,255,255,.03)", border:i===1?"1px solid rgba(201,168,76,.5)":"1px solid rgba(255,255,255,.08)", color:i===1?"var(--gold)":"var(--dim)" }}>
<div style={{ fontSize:".68rem", fontWeight:700 }}>{d.h}</div>
<div style={{ fontSize:".5rem", opacity:.7 }}>{d.p}</div>
</div>
))}
</div>
{/* Elements */}
<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
{/* Secret Traitor with expanded picker */}
<div style={{ background:"rgba(201,168,76,.05)", border:"1px solid rgba(201,168,76,.15)", borderRadius:3, overflow:"hidden" }}>
<div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px" }}>
<span style={{ fontSize:".82rem", color:"var(--gold)" }}>🎭 Secret Traitor</span>
<span style={{ fontSize:".65rem", color:"var(--gold2)", background:"rgba(201,168,76,.1)", padding:"2px 7px", borderRadius:2 }}>ON</span>
</div>
{/* ST manual picker */}
<div style={{ padding:"8px 10px", background:"rgba(60,0,80,.12)", borderTop:"1px solid rgba(120,0,140,.2)" }}>
<div style={{ fontSize:".6rem", fontFamily:"'Cinzel',serif", color:"#d88ef0", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>🎭 Secret Traitor Selection</div>
<div style={{ display:"flex", gap:5, marginBottom:8 }}>
<div style={{ flex:1, padding:"4px", borderRadius:3, textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:".6rem", fontWeight:700, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", color:"var(--dim)" }}>🎲 Random</div>
<div style={{ flex:1, padding:"4px", borderRadius:3, textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:".6rem", fontWeight:700, background:"rgba(60,0,80,.2)", border:"1px solid rgba(120,0,140,.5)", color:"#d88ef0" }}>🎭 Choose</div>
</div>
<div style={{ fontSize:".62rem", color:"var(--dim)", fontStyle:"italic", marginBottom:6 }}>Pick a Faithful player to be the Secret Traitor.</div>
<div className="pgrid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
{DEMO_PLAYERS.filter(p=>p.role==="faithful").map(p => (
<div key={p.id} className={`pcard ${p.id==="p5"?"sel":""}`} style={{ padding:"5px 3px", borderColor: p.id==="p5"?"rgba(140,0,200,.6)":"var(--border)" }}>
<div className="pavatar" style={{ fontSize:"1rem" }}>{p.emoji}</div>
<div className="pname" style={{ fontSize:".5rem" }}>{p.name}</div>
{p.id==="p5" && <div className="prole role-s" style={{ fontSize:".42rem" }}>ST</div>}
</div>
))}
</div>
</div>
</div>
{[{icon:"👁️",label:"Seer"},{icon:"🗡️",label:"Dagger"}].map((e,i) => (
<div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", background:"rgba(201,168,76,.05)", border:"1px solid rgba(201,168,76,.15)", borderRadius:3 }}>
<span style={{ fontSize:".82rem", color:"var(--gold)" }}>{e.icon} {e.label}</span>
<span style={{ fontSize:".65rem", color:"var(--gold2)", background:"rgba(201,168,76,.1)", padding:"2px 7px", borderRadius:2 }}>ON</span>
</div>
))}
</div>
<div style={{ background:"linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius:3, padding:"10px 14px", textAlign:"center", fontSize:".7rem", fontFamily:"'Cinzel',serif", fontWeight:700, color:"#07050a" }}>LOCK IN & BEGIN →</div>
</div>
),
},

{
label: "Game Intro Screen",
icon: "🏰",
desc: "When the host taps 'Begin the Game' in the lobby, players are taken to the Game Intro before any ceremony begins. The host sees a 5-slide walkthrough (What Traitors do, What Faithful do, How it ends, Your role tonight) and taps through at their own pace. Players see the same slides in real time — synced to wherever the host is — with one difference: the final slide tells players to await their role reveal rather than showing host instructions. When the host taps 'Begin the Game →' on the final slide, the game truly begins.",
tip: "Use this moment to build atmosphere. Read each slide aloud if you want. The players are reading along with you and the tension is already building.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background:"rgba(201,168,76,.05)",border:"1px solid rgba(201,168,76,.15)",borderRadius:4,padding:14 }}>
<div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:10 }}>Host Sees — Slide 2 of 5</div>
<div style={{ textAlign:"center",marginBottom:12 }}>
<div style={{ fontSize:"3rem",marginBottom:10 }}>🗡️</div>
<div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.2rem",color:"var(--crim3)",marginBottom:10 }}>What the Traitors Must Do</div>
<div style={{ fontSize:".88rem",color:"var(--text)",lineHeight:1.75,maxWidth:360,margin:"0 auto 12px" }}>Lie. Charm. Smile. Point the finger at someone completely innocent. Murder one Faithful every night.</div>
<div style={{ fontStyle:"italic",color:"var(--dim)",fontSize:".82rem",borderLeft:"2px solid rgba(201,168,76,.2)",paddingLeft:12,textAlign:"left" }}>No prize money. No dramatic elimination suite. Just glory, bragging rights, and the knowledge that they are, objectively, better at this than everyone else.</div>
</div>
<div style={{ display:"flex",justifyContent:"center",gap:8 }}>
<button className="btn btn-outline btn-sm">← Back</button>
<button className="btn btn-gold btn-sm">Next →</button>
</div>
</div>
<div style={{ background:"rgba(80,0,120,.08)",border:"1px solid rgba(80,0,120,.2)",borderRadius:4,padding:10,fontSize:".78rem",color:"var(--dim)",fontStyle:"italic" }}>
Players see the same slide — synced in real time to the host's position. On the final slide they see "The Game Begins — whatever you see on your phone, say nothing" instead of the host instructions.
</div>
</div>
),
},

{
label: "Pause Game",
icon: "⏸",
desc: "A ⏸ PAUSE button is always visible in the top-right corner of your host screen. Tap it any time to freeze the game — a full-screen pause overlay appears on every player's phone. Tap Resume to continue. Useful for breaks, interruptions, or rules questions.",
tip: "The timer stops when the game is paused. Resume and it picks back up where it left off.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Host header with pause button */}
<div style={{ position: "relative", background: "rgba(10,5,20,.8)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 4, padding: "14px 16px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 4 }}>The Traitors</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".7rem", color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 900, textShadow: "0 0 20px rgba(201,168,76,.4)" }}>at home</div>
<div style={{ position: "absolute", top: 10, right: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 3, padding: "4px 9px", fontFamily: "'Cinzel',serif", fontSize: ".6rem", color: "var(--dim)" }}>⏸ PAUSE</div>
</div>
{/* Pause overlay — what players see */}
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", color: "var(--dim)", textTransform: "uppercase", textAlign: "center" }}>↓ What every player's screen shows</div>
<div style={{ background: "rgba(4,1,8,.92)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "28px 20px", textAlign: "center" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 10 }}>⏸</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.3rem", color: "var(--gold)", marginBottom: 8 }}>Game Paused</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.2rem", color: "var(--gold)", marginBottom: 10, letterSpacing: ".05em" }}>02:34</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".88rem" }}>The host has paused the game. Sit tight.</div>
</div>
{/* Resume */}
<div style={{ background: "linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius: 3, padding: "10px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", fontWeight: 700, color: "#07050a" }}>▶ Resume Game</div>
</div>
),
},

{
label: "Avatars & Photo Wall",
icon: "📸",
desc: "While players wait in the lobby, they're prompted to take a quick selfie portrait. Their photo appears in gold portrait frames on the breakfast photo wall and in your View Players panel. When a murder is revealed at breakfast, the victim's framed portrait goes greyscale with a bold red ✕. Ghosts' frames appear greyscale throughout.",
tip: "Avatars are taken in the lobby before the game starts. They appear in View Players and on the breakfast photo wall throughout the game.",
render: () => (
<div className="col" style={{ gap: 12 }}>
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, padding: "12px 0" }}>
{DEMO_PLAYERS.slice(0,5).map((p,i) => (
<div key={p.id} style={{ textAlign: "center" }}>
<GoldFrame emoji={p.emoji} size={52} dead={i===2} redX={i===2} />
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".5rem", color: i===2 ? "var(--crim3)" : "var(--dim)", marginTop: 4, textDecoration: i===2 ? "line-through" : "none" }}>{p.name}</div>
</div>
))}
</div>
<div style={{ background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "8px 12px", fontSize: ".78rem", color: "var(--dim)", lineHeight: 1.6 }}>
Middle portrait: <strong style={{ color: "var(--crim3)" }}>{DEMO_PLAYERS[2].name}</strong> was murdered. Greyscale, red ✕, struck-through name. Gold ornate frames for all.
</div>
</div>
),
},

{
label: "Connection & Privacy",
icon: "🔒",
desc: "A green/red dot (top-left) shows live connection status — goes red with 'OFFLINE' if sync fails. Players have a 🔒 Privacy Mode button: tap it to blur everything except the countdown timer, so nobody can glance at their phone during free roam. Tap to reveal. Eliminated players see the entire app in greyscale — a clear visual signal they're out.",
tip: "If anyone refreshes their browser mid-game, they're automatically rejoined to the same game with the same player ID — no re-entering names or Game IDs.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(10,5,20,.85)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 4, padding: "12px 14px", position: "relative" }}>
<div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
<div style={{ width: 8, height: 8, borderRadius: "50%", background: "#50e050", boxShadow: "0 0 6px #50e050" }} />
<span style={{ fontSize: ".62rem", color: "var(--dim)", fontFamily: "'Cinzel',serif" }}>Synced · 0.2s ago</span>
</div>
<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
<div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e05050", boxShadow: "0 0 6px #e05050" }} />
<span style={{ fontSize: ".62rem", color: "#e05050", fontFamily: "'Cinzel',serif", letterSpacing: ".08em" }}>OFFLINE</span>
</div>
</div>
<div style={{ background: "rgba(4,1,8,.85)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "20px 14px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 8 }}>🔒 Privacy Mode</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.5rem", color: "var(--gold)" }}>07:42</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".78rem", marginTop: 8 }}>Everything else is blurred. Tap to reveal.</div>
</div>
<div style={{ background: "rgba(10,5,20,.7)", borderRadius: 4, padding: "10px 14px", filter: "grayscale(0.85) brightness(0.7)", border: "1px solid rgba(100,100,100,.2)" }}>
<div style={{ fontSize: ".75rem", color: "rgba(150,150,150,.7)", fontStyle: "italic" }}>👻 Eliminated players see the entire app in greyscale — visually out of the game.</div>
</div>
</div>
),
},

{
label: "Host Tools",
icon: "🛠️",
desc: "Three utility tools live in your host panel footer: ↩ Go Back (reverts to the previous phase — up to 5 phases of history), +2m and +5m (extend the running timer without resetting). Go Back is greyed out if no history exists. Timer extend only appears when a timer is actively running.",
tip: "Go Back is a safety net for accidental taps, not a gameplay tool. Use it before anything consequential happens — reversing a completed banishment or night resolve will confuse players.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(10,5,20,.85)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 4, padding: "12px 14px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 10 }}>Host Panel Footer — Always Visible</div>
<div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
<div style={{ flex: 1, padding: "8px", borderRadius: 3, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".65rem", fontWeight: 700, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", color: "var(--gold)" }}>↩ Go Back</div>
<div style={{ padding: "8px 14px", borderRadius: 3, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".65rem", fontWeight: 700, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", color: "var(--gold)" }}>+2m</div>
<div style={{ padding: "8px 14px", borderRadius: 3, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".65rem", fontWeight: 700, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", color: "var(--gold)" }}>+5m</div>
</div>
<div style={{ display: "flex", gap: 6 }}>
<div style={{ flex: 1, padding: "8px", borderRadius: 3, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".62rem", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", color: "var(--dim)" }}>👁 View Players ↓</div>
<div style={{ padding: "8px 14px", borderRadius: 3, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".62rem", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", color: "var(--dim)" }}>Reset</div>
</div>
</div>
{[
{ icon: "↩", label: "Go Back", desc: "Reverts to the previous phase. Stores up to 5 phases. Greyed out if no history." },
{ icon: "+2m / +5m", label: "Extend Timer", desc: "Adds time to the current countdown without resetting. Only shows when a timer is running." },
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 10, padding: "8px 12px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3 }}>
<span style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".9rem", color: "var(--gold)", minWidth: 40, paddingTop: 2 }}>{item.icon}</span>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", color: "var(--gold2)", marginBottom: 2 }}>{item.label}</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)" }}>{item.desc}</div>
</div>
</div>
))}
</div>
),
},

{
label: "Secret Traitor Ceremony",
icon: "🎭",
desc: "One at a time, you call each player to stand before the whole group. Everyone watches. You tap Reveal on your panel — the result appears on that player's OWN phone, not yours. They keep a poker face. You tap Next Player, they return to the group and the next person stands up. Your panel privately shows you which player IS the Secret Traitor.",
tip: "Watch for the tell. Even a half-second of surprise is information the group will reference all game.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Host panel */}
<div style={{ background: "rgba(60,0,80,.2)", border: "1px solid rgba(120,40,180,.4)", borderRadius: 4, padding: 14 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "#c090ff", marginBottom: 8, textTransform: "uppercase" }}>⚜ Host Panel — Now Standing: {DEMO_PLAYERS[3].name} (Player 4 of 8)</div>
<div style={{ background: "rgba(180,60,240,.15)", border: "1px solid rgba(180,60,240,.3)", borderRadius: 3, padding: "8px 12px", fontSize: ".78rem", color: "#f0a0ff", marginBottom: 10, textAlign: "center" }}>⚠️ This IS the Secret Traitor. Watch their face — they're about to see it.</div>
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
<div style={{ background: "rgba(60,0,80,.4)", border: "1px solid rgba(120,40,180,.5)", borderRadius: 3, padding: "9px 14px", fontSize: ".7rem", fontFamily: "'Cinzel',serif", color: "#d0a0ff", textAlign: "center" }}>👁️ Reveal to {DEMO_PLAYERS[3].name} → (sends result to their phone)</div>
<div style={{ background: "transparent", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "7px 14px", fontSize: ".7rem", fontFamily: "'Cinzel',serif", color: "var(--dim)", textAlign: "center" }}>Next Player → ({DEMO_PLAYERS[4].name})</div>
</div>
</div>
{/* What Riley's phone shows — simultaneously */}
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", color: "var(--dim)", textTransform: "uppercase", textAlign: "center", margin: "2px 0" }}>↓ What {DEMO_PLAYERS[3].name}'s phone shows (their own device)</div>
<div style={{ background: "rgba(40,0,60,.95)", border: "2px solid rgba(180,60,240,.5)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🎭</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.3rem", fontWeight: 900, color: "#e060ff", marginBottom: 8, lineHeight: 1.2 }}>YOU ARE THE<br />SECRET TRAITOR</div>
<div style={{ fontSize: ".82rem", color: "#c090e0", fontStyle: "italic", marginBottom: 10 }}>Keep. This. Face.</div>
<div style={{ background: "rgba(180,60,240,.15)", border: "1px solid rgba(180,60,240,.3)", borderRadius: 3, padding: "8px 12px", fontSize: ".78rem", color: "#d0a0f0" }}>
⚠️ Do not react. You are being watched by everyone in this room right now.
</div>
</div>
</div>
),
},

{
label: "Traitors Selection Roundtable",
icon: "🎴",
desc: "Everyone blindfolds, phones face-down. Walk silently behind regular Traitors only — tap them twice. Do NOT tap the Secret Traitor — they were already selected in their own ceremony. Faithful get no tap. Hit Release Roles — phones light up. Say: 'Blindfolds off. Look around. Say nothing.' Sixty seconds of silence — everyone looks at each other, no phones. Then: 'Check your phone. Not a word.' Your panel shows the full private role list.",
tip: "Only tap regular Traitors — not the Secret Traitor. The ST already knows their role from the public ceremony.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(139,26,26,.12)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 4, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--crim3)", marginBottom: 8, textTransform: "uppercase" }}>Tap TWICE — Regular Traitors Only</div>
<div className="pgrid">
{DEMO_PLAYERS.map(p => (
<div key={p.id} className={`pcard ${p.role==="traitor"?"crim":""}`} style={{ opacity: p.role==="secret_traitor" ? 0.45 : 1 }}>
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".62rem" }}>{p.name}</div>
<div className={`prole ${p.role==="traitor"?"role-t":p.role==="secret_traitor"?"role-s":"role-f"}`} style={{ fontSize: ".5rem" }}>
{p.role==="secret_traitor"?"Skip — ST":p.role==="traitor"?"Tap Twice":"—"}
</div>
</div>
))}
</div>
<div style={{ background: "rgba(80,0,100,.1)", border: "1px solid rgba(120,0,140,.3)", borderRadius: 3, padding: "7px 10px", marginTop: 10, fontSize: ".78rem", color: "#d88ef0", fontStyle: "italic" }}>
🎭 {DEMO_PLAYERS[3].name} (Secret Traitor) — do NOT tap. Already selected in their ceremony.
</div>
</div>
<div style={{ background: "rgba(201,168,76,.07)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 3, padding: "10px 14px", textAlign: "center", fontSize: ".75rem", fontFamily: "'Cinzel',serif", color: "var(--gold)" }}>Release Roles →</div>
</div>
),
},

{
label: "Mission",
icon: "⚔️",
desc: "Pick from 25 missions — filterable by type. 12 are fully digital (trivia, auctions, ballots, forbidden words, emoji ciphers, RPS brackets) and 13 are analog games you run in the room. At game start, one mission is secretly pre-assigned the Dagger and one the Seer — marked 🗡️/👁️ in the picker. The Witness (m25, Seer) is locked until the halfway round. Shield reveal type and count are shown per mission.",
tip: "Award the Seer completely silently — no announcement, no ceremony, no log. Tap the button and move on. What the Seer does with the knowledge is their call.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Animated mission atmosphere */}
<div style={{ position:"relative", background:"rgba(8,5,2,.97)", border:"1px solid rgba(201,168,76,.2)", borderRadius:4, padding:"12px 10px", overflow:"hidden", minHeight:56, display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:0 }}>
<div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.6),rgba(220,190,80,.8),rgba(201,168,76,.6),transparent)", animation:"swordShimmer 2.2s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"swordShimmer 2.2s .5s ease-in-out infinite" }} />
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s ease-in-out infinite" }}>⚔️</div>
<div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(201,168,76,.5),rgba(201,168,76,.1))", animation:"pulse 2s ease-in-out infinite" }} />
<div style={{ fontFamily:"'Cinzel',serif", fontSize:".65rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--gold2)" }}>Mission Active</div>
<div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,rgba(201,168,76,.5),rgba(201,168,76,.1))", animation:"pulse 2s .3s ease-in-out infinite" }} />
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s .4s ease-in-out infinite" }}>🛡️</div>
</div>
<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
{["all","trivia","social","physical","puzzle","luck"].map((t,i) => (
<div key={i} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${i===2?"rgba(201,168,76,.4)":"rgba(201,168,76,.12)"}`, background: i===2?"rgba(201,168,76,.1)":"transparent", fontSize: ".6rem", fontFamily: "'Cinzel',serif", color: i===2?"var(--gold)":"var(--dim)" }}>{t}</div>
))}
</div>
<div style={{ background: "rgba(15,10,20,.8)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: 10 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".8rem", color: "var(--gold)" }}>🎭 Two Truths & A Lie <span style={{ color: "#dd88ff", fontSize: ".7rem" }}>👁️</span></div>
<div style={{ fontSize: ".62rem", color: "#dd88ff" }}>Seer Mission</div>
</div>
<div style={{ fontSize: ".65rem", color: "var(--dim)", marginBottom: 6 }}>social · 12 min · Award silently — no announcement</div>
</div>
<div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "6px 12px", fontSize: ".75rem", color: "var(--dim)" }}>
🛡️ Up to <strong style={{ color: "var(--gold)" }}>2</strong> shields this mission (8 alive — max 25%)
</div>
<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
{DEMO_PLAYERS.filter(p=>p.alive).map(p => (
<div key={p.id} style={{ background: "rgba(15,10,20,.6)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "6px 8px", textAlign: "center", minWidth: 60 }}>
<div style={{ fontSize: ".9rem" }}>{p.emoji}</div>
<div style={{ fontSize: ".6rem", color: "var(--dim)", marginTop: 2 }}>{p.name}</div>
<div style={{ display: "flex", gap: 3, marginTop: 4, justifyContent: "center" }}>
<div style={{ padding: "2px 5px", border: "1px solid rgba(201,168,76,.25)", borderRadius: 2, fontSize: ".5rem", color: "var(--dim)" }}>🛡️</div>
<div style={{ padding: "2px 5px", border: "1px solid rgba(140,0,180,.25)", borderRadius: 2, fontSize: ".5rem", color: "#dd88ff" }}>👁️</div>
</div>
</div>
))}
</div>
</div>
),
},

{
label: "Mission Briefing — Phones",
icon: "📱",
desc: "When you tap 'Begin Mission', the full mission card appears on every player's phone automatically. Still read it aloud — players listen carefully to their host — but it's also right there on their screen. 12 missions are fully digital: player phones become interactive with live scoring, auctions, secret votes, emoji ciphers, and more. 13 missions are analog games you run in the room.",
tip: "Especially useful for complex missions like Emoji Cipher or Map Memory — players can reference the rules during the mission without asking you to repeat yourself.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(201,168,76,.07)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "10px 14px", fontSize: ".78rem", color: "var(--gold2)" }}>
Host taps <strong style={{ color: "var(--gold)" }}>Begin Mission →</strong> — every player's phone instantly shows:
</div>
<div style={{ background: "rgba(15,10,20,.9)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 4, padding: "14px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".55rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 8 }}>Incoming Mission</div>
<div style={{ fontSize: "2rem", marginBottom: 6 }}>🧩</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".95rem", color: "var(--gold)", marginBottom: 4 }}>Emoji Cipher</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".55rem", color: "var(--gold2)", letterSpacing: ".1em", marginBottom: 8 }}>PUZZLE · 6 MIN</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)", lineHeight: 1.6, marginBottom: 10 }}>Host displays a short phrase encoded in emojis. First player to whisper the correct answer wins.</div>
<div style={{ background: "rgba(30,60,180,.15)", border: "1px solid rgba(60,100,220,.25)", borderRadius: 3, padding: "6px 12px", fontSize: ".72rem", color: "#88aaff", display: "inline-block" }}>🤫 Only the winner knows</div>
</div>
</div>
),
},

{
label: "Free Roam",
icon: "🏰",
desc: "Players scatter — their screens show a live countdown timer. Call everyone back when time is up. The recommended time is shown on your panel with a Set → button.",
tip: "Don't cut this short. The best Round Table moments come from conversations that happened alone in a corner five minutes ago.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Animated free roam atmosphere */}
<div style={{ position:"relative", background:"rgba(8,6,2,.97)", border:"1px solid rgba(201,168,76,.18)", borderRadius:4, padding:"12px", overflow:"hidden", minHeight:56, display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:0 }}>
<div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
{["🏰","·","🗺️","·","🏰"].map((e,i) => (
<div key={i} style={{ fontSize:i%2?"1rem":"1.8rem", opacity:i%2?.25:1, animation:i%2===0?`roamDrift ${2.5+i*.4}s ${i*.3}s ease-in-out infinite`:"pulse 2.5s ease-in-out infinite", color:i%2?"var(--gold2)":"inherit" }}>{e}</div>
))}
</div>
<div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span style={{ fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--gold)" }}>⚜ Recommended: 12 min</span>
<span style={{ fontSize: ".65rem", color: "var(--gold2)", background: "rgba(201,168,76,.1)", padding: "2px 10px", borderRadius: 2, fontFamily: "'Cinzel',serif" }}>Set →</span>
</div>
<div style={{ background: "rgba(15,10,20,.8)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🏰</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 8 }}>Free Roam</div>
<div style={{ background: "rgba(0,0,0,.3)", borderRadius: 6, height: 5, marginBottom: 12, overflow: "hidden" }}>
<div style={{ width: "62%", height: "100%", background: "linear-gradient(90deg,var(--gold2),var(--gold))", borderRadius: 6 }} />
</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.2rem", color: "var(--gold)", marginBottom: 6 }}>11:09</div>
<div style={{ fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic" }}>Timer visible to all players</div>
</div>
<div style={{ background: "rgba(201,168,76,.07)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 3, padding: "9px 14px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--gold)" }}>Call the Round Table →</div>
</div>
),
},

{
label: "Round Table",
icon: "🕯️",
desc: "Everyone gathers for open debate. Your panel shows step-by-step instructions and a sassy quip. Call the vote when the energy peaks — don't let it drag.",
tip: "Let accusations fly without intervening. Your job is to facilitate, not moderate. The chaos is the point.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Animated candle row */}
<div style={{ position:"relative", background:"rgba(8,5,2,.95)", border:"1px solid rgba(201,168,76,.2)", borderRadius:4, padding:"10px 8px 0", overflow:"hidden", minHeight:70 }}>
{[0,1,2,3,4].map(i => (
<div key={i} style={{ position:"absolute", left:`${12+i*18}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:0.6+i%2*.2 }}>
<div style={{ width:7, height:14+i%3*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.1))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.8+i*.3}s ${i*.28}s ease-in-out infinite`, boxShadow:"0 0 10px 3px rgba(255,150,40,.35)", transformOrigin:"bottom center" }} />
<div style={{ width:1.5, height:5, background:"#1a0f05" }} />
<div style={{ width:9, height:22+i%2*8, background:"linear-gradient(to right,rgba(240,220,180,.9),rgba(255,245,220,1),rgba(220,200,160,.9))", borderRadius:"2px 2px 1px 1px" }} />
<div style={{ width:13, height:3, background:"rgba(170,140,90,.8)", borderRadius:"0 0 2px 2px" }} />
</div>
))}
<div style={{ position:"relative", zIndex:1, textAlign:"center", paddingBottom:10 }}>
<div style={{ fontFamily:"'Cinzel Decorative',cursive", fontSize:".75rem", color:"var(--gold)", letterSpacing:".1em", animation:"tableGlow 2.5s ease-in-out infinite" }}>🕯️ The Round Table</div>
</div>
</div>
<div style={{ background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "10px 14px", fontStyle: "italic", fontSize: ".88rem", color: "var(--dim)", lineHeight: 1.6 }}>
"Who are we looking at today? The floor is open. Accuse with style."
</div>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", color: "var(--gold2)", textTransform: "uppercase", margin: "4px 0 4px" }}>⚜ Step-by-step Instructions</div>
{["Open the floor — say: 'The Round Table is now in session.'","Let anyone speak, accuse, or defend. Don't rush it — but don't let anyone monologue for more than 90 seconds.","When energy peaks, stand up and say: 'Players. The time for talk is over. Phones out. It's time to vote.'"].map((s,i) => (
<div key={i} style={{ display: "flex", gap: 8, padding: "7px 10px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3, fontSize: ".8rem", color: "var(--dim)" }}>
<span style={{ color: "var(--gold2)", fontFamily: "'Cinzel',serif" }}>{i+1}.</span>{s}
</div>
))}
<div style={{ background: "linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius: 3, padding: "11px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: ".13em", color: "#07050a", marginTop: 4 }}>OPEN THE VOTE →</div>
</div>
),
},

{
label: "Voting & Banishment",
icon: "🗳️",
desc: "While players vote, your host panel shows a live secret vote tracker — you see exactly who has voted and who they voted for in real time, so you can build dramatic tension before the reveal. The Dagger panel appears if it's in play. The 5th-to-last player is banished in silence with no role reveal.",
tip: "Ask the Dagger question every single vote — even if you know the holder won't use it. Consistency keeps the secret safe.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Dagger activation panel — only shown once dagger is won from a mission */}
<div style={{ background: "rgba(139,26,26,.08)", border: "1px solid rgba(139,26,26,.3)", borderRadius: 3, padding: "10px 14px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".12em", color: "var(--crim3)", textTransform: "uppercase", marginBottom: 6 }}>🗡️ The Dagger — Appears once won from a mission</div>
<div style={{ fontSize: ".8rem", color: "var(--dim)", marginBottom: 8, lineHeight: 1.6 }}>
Ask: <strong style={{ color: "var(--gold)" }}>"Does anyone wish to use the Dagger?"</strong><br />
<span style={{ fontSize: ".72rem" }}>Holder must stand, reveal themselves, and declare it aloud.</span>
</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
<div style={{ background: "rgba(139,26,26,.2)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 3, padding: "8px", textAlign: "center", fontSize: ".62rem", fontFamily: "'Cinzel',serif", color: "var(--crim3)" }}>✅ Yes — {DEMO_PLAYERS[4].name} uses it</div>
<div style={{ background: "transparent", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "8px", textAlign: "center", fontSize: ".62rem", fontFamily: "'Cinzel',serif", color: "var(--dim)" }}>❌ No — not this round</div>
</div>
</div>
{/* Vote tally — Morgan's vote counts as 2 */}
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 2 }}>⚜ Vote Tally — Dagger Active</div>
<div className="pgrid" style={{ marginBottom: 4 }}>
{[{p:DEMO_PLAYERS[0],v:4,note:"(incl. Dagger)"},{p:DEMO_PLAYERS[2],v:1},{p:DEMO_PLAYERS[4],v:1}].map(({p,v,note},i) => (
<div key={i} className="pcard" style={{ position: "relative" }}>
<div style={{ position: "absolute", top: 4, right: 4, background: "var(--crim)", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: ".55rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{v}</div>
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".62rem" }}>{p.name}</div>
{note && <div style={{ fontSize: ".48rem", color: "var(--crim3)", fontStyle: "italic", marginTop: 2 }}>{note}</div>}
</div>
))}
</div>
<div style={{ position:"relative", background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.5)", borderRadius: 4, padding: "14px", textAlign: "center", overflow:"hidden" }}>
{[0,1,2,3,4,5,6,7].map(i => (
<div key={i} style={{ position:"absolute", left:`${5+i*13}%`, bottom:`${i%3*5}px`, width:i%2?4:3, height:i%2?4:3, borderRadius:"50%", background:i%3?"#ff5010":i%2?"#ffaa30":"#ff7020", animation:`emberFloat ${1.4+i*.32}s ${i*.19}s ease-out infinite`, pointerEvents:"none" }} />
))}
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", fontWeight: 900, color: "var(--crim2)", marginBottom: 6 }}>{DEMO_PLAYERS[0].name}</div>
<div style={{ fontSize: ".75rem", color: "var(--text)", marginBottom: 12 }}>has been banished from the castle.</div>
<div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 3, padding: "10px 14px" }}>
<div style={{ fontSize: ".65rem", fontFamily: "'Cinzel',serif", color: "var(--gold)", marginBottom: 4 }}>🎤 Circle of Truth</div>
<div style={{ fontSize: ".82rem", color: "var(--gold)", fontStyle: "italic" }}>"Are you a Traitor… or are you Faithful?"</div>
</div>
</div>
<div style={{ background: "rgba(139,26,26,.08)", border: "1px solid rgba(139,26,26,.25)", borderRadius: 3, padding: "7px 12px", fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic", textAlign: "center" }}>5th-to-last player: silent exit — no question, no role reveal.</div>
</div>
),
},

{
label: "View Players",
icon: "👁",
desc: "A '👁 View Players' button is always in your host panel footer. It shows every player's role, alive/ghost status, powers, and avatars with gold portrait frames. Every alive player has a '✕ Remove' button and every ghost has a '↩ Revive' for host overrides. During voting phases a live secret vote tracker appears showing exactly who voted for whom in real time. Both override actions log to the Game Timeline.ger, or Seer.",
tip: "Use this if you lose track of who's who, or to quietly verify details before a phase transition.",
render: () => (
<div style={{ background: "rgba(4,2,8,.9)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "14px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 10 }}>View Players — Host Only</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#80e080", marginBottom: 6 }}>Alive (6)</div>
<div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
{[
{ p: DEMO_PLAYERS[1], role: "traitor", shield: false, dagger: false, seer: false },
{ p: DEMO_PLAYERS[2], role: "faithful", shield: true, dagger: false, seer: true },
{ p: DEMO_PLAYERS[3], role: "secret_traitor", shield: false, dagger: false, seer: false },
{ p: DEMO_PLAYERS[4], role: "faithful", shield: false, dagger: true, seer: false },
{ p: DEMO_PLAYERS[0], role: "faithful", shield: false, dagger: false, seer: false },
{ p: DEMO_PLAYERS[5], role: "faithful", shield: true, dagger: false, seer: false },
].map(({ p, role, shield, dagger, seer }, i) => {
const roleColor = role === "traitor" ? "var(--crim3)" : role === "secret_traitor" ? "#d88ef0" : "var(--gold)";
const roleLabel = role === "traitor" ? "🗡️ Traitor" : role === "secret_traitor" ? "🎭 Secret Traitor" : "🛡️ Faithful";
return (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", background: "rgba(255,255,255,.03)", borderRadius: 3, border: "1px solid rgba(255,255,255,.05)" }}>
<div style={{ fontSize: "1rem" }}>{p.emoji}</div>
<div style={{ flex: 1 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".72rem", color: "var(--text)" }}>{p.name}</div>
<div style={{ fontSize: ".6rem", color: roleColor }}>{roleLabel}</div>
</div>
<div style={{ display: "flex", gap: 3 }}>
{shield && <span style={{ fontSize: ".55rem", background: "rgba(40,80,180,.3)", border: "1px solid rgba(60,100,220,.4)", borderRadius: 2, padding: "1px 4px", color: "#88aaff" }}>🛡️</span>}
{dagger && <span style={{ fontSize: ".55rem", background: "rgba(139,26,26,.3)", border: "1px solid rgba(139,26,26,.5)", borderRadius: 2, padding: "1px 4px", color: "var(--crim3)" }}>🗡️</span>}
{seer && <span style={{ fontSize: ".55rem", background: "rgba(80,0,120,.3)", border: "1px solid rgba(120,0,180,.5)", borderRadius: 2, padding: "1px 4px", color: "#dd88ff" }}>👁️</span>}
</div>
</div>
);
})}
</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(140,100,180,.6)", marginBottom: 6 }}>Ghosts (2)</div>
<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
{[{ p: DEMO_PLAYERS[6], role: "faithful" }, { p: DEMO_PLAYERS[7], role: "faithful" }].map(({ p }, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", opacity: .5 }}>
<div style={{ fontSize: "1rem" }}>{p.emoji}</div>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".68rem", color: "var(--dim)", textDecoration: "line-through" }}>{p.name}</div>
<div style={{ fontSize: ".58rem", color: "var(--gold)" }}>🛡️ Faithful</div>
</div>
</div>
))}
</div>
</div>
),
},

{
label: "Night — Blindfolds On",
icon: "🌙",
desc: "Everyone blindfolds and stays seated in the same room. Tap shoulders in order: Seer first (if active), then Solo Traitor recruitment (if only 1 Traitor remains and 6+ total alive), then Secret Traitor shortlist (if applicable, pre-reveal rounds only — on their reveal round they skip straight to the Turret), then all Traitors for the Turret. Each lifts their blindfold, uses their phone, blindfold back on. Keep the whole thing under 8 minutes.",
tip: "Move briskly. The Faithful are sitting there. Every extra second of waiting is dead game time.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Animated candlelit night scene */}
<div style={{ position:"relative", background:"rgba(4,1,12,.97)", border:"1px solid rgba(80,40,120,.3)", borderRadius:4, padding:"18px 12px 0", overflow:"hidden", minHeight:90 }}>
{[0,1,2,3,4,5,6,7].map(i => (
<div key={i} style={{ position:"absolute", left:`${5+i*13}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:0.5+i%3*.15 }}>
<div style={{ width:7, height:12+i%4*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.1))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.9+i*.26}s ${i*.22}s ease-in-out infinite`, boxShadow:"0 0 8px 3px rgba(255,140,40,.25)", transformOrigin:"bottom center" }} />
<div style={{ width:1.5, height:5, background:"#1a0f05" }} />
<div style={{ width:9, height:18+i%3*6, background:"linear-gradient(to right,rgba(230,210,170,.8),rgba(255,245,220,.95),rgba(210,190,155,.8))", borderRadius:"2px 2px 1px 1px" }} />
<div style={{ width:12, height:3, background:"rgba(160,130,90,.7)", borderRadius:"0 0 2px 2px" }} />
</div>
))}
{[0,1,2,3,4,5,6,7,8,9].map(i => (
<div key={i} style={{ position:"absolute", left:`${3+i*10+i%3*3}%`, top:`${6+i%5*8}%`, width:i%3===0?3:2, height:i%3===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.7)", animation:`starTwinkle ${1.5+i*.28}s ${i*.18}s ease-in-out infinite` }} />
))}
<div style={{ position:"relative", zIndex:1, textAlign:"center", paddingBottom:14 }}>
<div style={{ fontSize:"2rem", animation:"moonPulse 3s ease-in-out infinite", display:"inline-block", marginBottom:4 }}>🌙</div>
<div style={{ fontFamily:"'Cinzel',serif", fontSize:".6rem", letterSpacing:".18em", textTransform:"uppercase", color:"rgba(160,120,255,.6)" }}>Night Sequester</div>
</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{[
{icon:"👁️",label:"Seer (if active)",desc:"Tap once → lift blindfold, interrogate a player, blindfold back on",color:"#dd88ff"},
{icon:"🤝",label:"Recruitment (solo Traitor, 6+ total alive)",desc:"Triggers when 1 Traitor + 5 Faithful remain (6 total). Traitor picks recruit → accept or die. If decline drops to 5 total, night ends immediately.",color:"#d088ff"},
{icon:"🎭",label:"Secret Traitor (if applicable, pre-reveal)",desc:"Must select exactly 5 targets — mandatory shortlist. Traitors vote from this list only. Blindfold back on when done.",color:"#c090ff"},
{icon:"🗡️",label:"All Traitors — The Turret",desc:"Tap each → unanimous vote required, blindfolds back on",color:"var(--crim3)"},
].map((s,i) => (
<div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", background: "rgba(10,2,18,.7)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 3 }}>
<div style={{ fontSize: "1.1rem", marginTop: 1 }}>{s.icon}</div>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".68rem", color: s.color, marginBottom: 2 }}>{s.label}</div>
<div style={{ fontSize: ".75rem", color: "var(--dim)", fontStyle: "italic" }}>{s.desc}</div>
</div>
</div>
))}
</div>
<div style={{ background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "8px 12px", fontSize: ".8rem", color: "var(--dim)", fontStyle: "italic" }}>
When Turret votes are in: tap Traitors — blindfolds back on. Then begin calling breakfast groups. Players remove blindfolds only as they leave the room.
</div>
</div>
),
},

{
label: "Night — Seer Phase",
icon: "👁️",
desc: "If the Seer is active, they're woken first. Tap their shoulder — they lift their blindfold and privately tap a player's name on their screen. Their role appears instantly on the Seer's screen only. Your host panel shows exactly who was investigated and whether they were Faithful or Traitor. Ghosts and spectators also see the result in their observer view. Tap their shoulder once more — blindfold back on. 30 seconds maximum.",
tip: "The Seer can share what they learn — that's their weapon. But if others know they hold the Seer power, they become a Traitor target.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<CrystalBallScene />
<div style={{ background: "rgba(30,0,50,.2)", border: "1px solid rgba(100,0,160,.35)", borderRadius: 3, padding: 12, fontSize: ".85rem", color: "var(--dim)", lineHeight: 1.7 }}>
<strong style={{ color: "#dd88ff", display: "block", marginBottom: 4 }}>👁️ Seer Phase — Host View</strong>
Quietly tap Sam's shoulder. They open their phone and see this:
</div>
<div style={{ background: "rgba(20,0,35,.9)", border: "1px solid rgba(100,0,160,.4)", borderRadius: 4, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "#c090ff", marginBottom: 8, textTransform: "uppercase" }}>👁️ The Seer's Vision</div>
<div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 10 }}>
{DEMO_PLAYERS.filter(p=>p.alive&&p.id!=="p3").slice(0,3).map(p => (
<div key={p.id} className="pcard click">
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".62rem" }}>{p.name}</div>
</div>
))}
</div>
<div style={{ background: "rgba(20,80,20,.2)", border: "2px solid rgba(40,120,40,.4)", borderRadius: 4, padding: "12px", textAlign: "center" }}>
<div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{DEMO_PLAYERS[4].emoji}</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "#80e080", marginBottom: 4 }}>{DEMO_PLAYERS[4].name}</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: "#80e080", letterSpacing: ".15em" }}>🛡️ FAITHFUL</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".75rem", marginTop: 6 }}>Remember this. Put your phone face-down.</div>
</div>
</div>
</div>
),
},

{
label: "Night — Recruitment",
icon: "🤝",
desc: "Recruitment triggers when exactly 1 Traitor remains and there are 6 or more players alive in total (1 Traitor + 5 Faithful). The Traitor selects a Faithful. Accept → both go to Turret, no murder that night. Decline → murdered, then the Traitor always goes to the Turret to debrief — even if no murder is possible. If the decline drops to 5 alive, the Turret meets but cannot murder, and the host resolves night immediately after.",
tip: "After a decline, the Traitor always goes to the Turret — whether to pick again (6+ alive) or just to debrief before morning (5 alive). Their Turret chat shows the declined player's name and what happens next. If no murder is possible, your panel shows a 'Debrief Only' note — resolve night as soon as they're done.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<TurretScene />
<div className="card host" style={{ padding: 12 }}>
<div className="host-label">⚜ Host — Recruitment Night</div>
<div style={{ background: "rgba(139,26,26,.1)", border: "1px solid rgba(139,26,26,.3)", borderRadius: 3, padding: "8px 12px", marginBottom: 8, fontSize: ".82rem", color: "var(--dim)" }}>
<strong style={{ color: "var(--crim3)" }}>🦉 Drew</strong> declined and was murdered. The Traitor must recruit again.
</div>
<div style={{ background: "rgba(80,0,120,.1)", border: "1px solid rgba(120,0,180,.3)", borderRadius: 3, padding: "8px 12px", marginBottom: 8, fontSize: ".82rem", color: "var(--dim)" }}>
✓ New target selected: <strong style={{ color: "#d088ff" }}>Morgan</strong>. Tap below to wake them.
</div>
<div style={{ background: "linear-gradient(135deg,#2a0840,#180328)", borderRadius: 3, padding: "9px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", color: "#d0a8ff", border: "1px solid rgba(120,40,180,.4)" }}>
Wake Morgan — Show Them the Offer →
</div>
</div>
<div style={{ background: "rgba(20,0,40,.95)", border: "2px solid rgba(140,0,220,.5)", borderRadius: 4, padding: "16px", textAlign: "center" }}>
<div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🤝</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".95rem", color: "#d088ff", marginBottom: 10, lineHeight: 1.4 }}>YOU HAVE BEEN<br/>RECRUITED BY A TRAITOR</div>
<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
<div style={{ background: "rgba(20,80,20,.2)", border: "1px solid rgba(40,160,40,.35)", borderRadius: 3, padding: "7px 10px", textAlign: "center", fontSize: ".78rem", color: "#80e080" }}>✅ Accept — Join the Traitors</div>
<div style={{ background: "rgba(139,26,26,.2)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 3, padding: "7px 10px", textAlign: "center", fontSize: ".78rem", color: "var(--crim3)" }}>❌ Decline — Face the Consequences</div>
</div>
</div>
</div>
),
},

{
label: "Night — The Turret",
icon: "🎯",
desc: "Tap each Traitor's shoulder — they lift their blindfolds and open The Turret. They chat and each lock in the same target. All Traitors must vote unanimously — your host panel shows the status live. If the timer runs out without agreement, no murder happens. Tap Traitors back to blindfolds, then call morning. If the game started with 4+ Traitors and only 2 Turret Traitors remain, they'll see a conditional recruitment option — they can unanimously choose to recruit instead. Your panel shows their decision live.",
tip: "Keep it under 5 minutes. The Faithful are waiting with blindfolds on.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<TurretScene />
<div className="card host" style={{ padding: 12 }}>
<div className="host-label">⚜ Host — Turret Status</div>
<div style={{ background: "rgba(20,80,20,.2)", border: "1px solid rgba(40,160,40,.3)", borderRadius: 3, padding: "9px 12px", marginBottom: 8, fontSize: ".85rem" }}>
<span style={{ color: "#80e080", fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase" }}>✅ Unanimous — </span>
All Traitors locked in on <strong style={{ color: "#80e080" }}>{DEMO_PLAYERS[5].name}</strong>. Ready to resolve.
</div>
<div style={{ background: "linear-gradient(135deg,#8b1a1a,#5a0e0e)", borderRadius: 3, padding: "10px 14px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--text)", fontWeight: 700 }}>
Resolve Night — Murder {DEMO_PLAYERS[5].name} →
</div>
</div>
<div style={{ background: "rgba(10,2,18,.9)", border: "1px solid rgba(80,20,120,.4)", borderRadius: 4, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "#c090ff", marginBottom: 8, textTransform: "uppercase" }}>🎯 The Turret — Traitor View</div>
<div style={{ background: "rgba(80,20,120,.15)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 3, padding: "8px 12px", marginBottom: 8, fontSize: ".82rem", color: "var(--dim)" }}>
Chat and agree on one target. <strong style={{ color: "#d0a0ff" }}>All Traitors must vote the same name.</strong>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
{[{p:DEMO_PLAYERS[1],v:"Casey"},{p:DEMO_PLAYERS[3],v:"Casey"}].map((t,i) => (
<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 9px", background: "rgba(80,20,120,.2)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 3, fontSize: ".8rem" }}>
<span style={{ color: "#c090ff" }}>{t.p.emoji} {t.p.name}</span>
<span style={{ color: "var(--crim3)" }}>→ {t.v}</span>
</div>
))}
</div>
<div style={{ background: "rgba(20,80,20,.15)", border: "1px solid rgba(40,160,40,.3)", borderRadius: 3, padding: "6px 10px", textAlign: "center", fontSize: ".78rem", color: "#80e080" }}>
✅ Unanimous — all locked in on Casey.
</div>
</div>
</div>
),
},

{
label: "Secret Traitor Reveal Night",
icon: "🎭",
desc: "On pre-reveal rounds (randomly in the first half of the game), the ST is woken and must submit an anonymous shortlist of exactly 5 murder targets — mandatory, not optional. The Traitors can only vote from these 5 names and never know who submitted the list. On the reveal round, no shortlist — the ST goes straight to the Turret and stays unblindfolded throughout. The Turret auto-announces the reveal dramatically.",
tip: "This is the most theatrical moment of the game. Watch the regular Traitors' faces when they learn who's been working alone.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<ParchmentScene />
<div style={{ background: "rgba(60,0,90,.2)", border: "1px solid rgba(140,40,220,.4)", borderRadius: 4, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "#d088ff", marginBottom: 8, textTransform: "uppercase" }}>🎭 Reveal Night — Special Instructions</div>
<div style={{ fontSize: ".78rem", color: "rgba(180,130,220,.7)", lineHeight: 1.6, marginBottom: 8, fontStyle: "italic" }}>Secret Traitor has submitted shortlist. Do NOT send them back to sleep — tap below to wake the Traitors and make the introduction.</div>
<div style={{ background: "rgba(80,0,120,.4)", border: "1px solid rgba(140,40,220,.5)", borderRadius: 3, padding: "8px 12px", textAlign: "center", fontSize: ".68rem", fontFamily: "'Cinzel',serif", color: "#d088ff" }}>Wake the Traitors — Reveal the Secret Traitor →</div>
</div>
<div style={{ background: "rgba(10,2,18,.9)", border: "1px solid rgba(80,20,120,.4)", borderRadius: 4, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "#c090ff", marginBottom: 8, textTransform: "uppercase" }}>🎯 The Turret — After Reveal</div>
<div style={{ background: "rgba(120,0,180,.25)", border: "1px solid rgba(180,60,255,.4)", borderRadius: 3, padding: "8px 12px", textAlign: "center", marginBottom: 6 }}>
<div style={{ fontSize: ".58rem", fontFamily: "'Cinzel',serif", color: "#d088ff", marginBottom: 4, textTransform: "uppercase" }}>🎭 The Castle</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".78rem", color: "#e8a0ff", lineHeight: 1.5 }}>THE SECRET TRAITOR HAS BEEN REVEALED — IT'S {DEMO_PLAYERS[3].name.toUpperCase()}.</div>
</div>
<div style={{ background: "rgba(80,20,120,.3)", borderRight: "2px solid rgba(140,60,200,.5)", borderRadius: 3, padding: "6px 10px", fontSize: ".78rem", textAlign: "right" }}>
<div style={{ fontSize: ".58rem", color: "#c090ff", marginBottom: 2 }}>{DEMO_PLAYERS[1].name}</div>{DEMO_PLAYERS[3].name}?! I never would have guessed.
</div>
</div>
</div>
),
},

{
label: "Breakfast",
icon: "🍳",
desc: "Bring groups to breakfast one at a time. Tap 'Reveal the Murder' after the final group is seated. Then tap 'Breakfast Done'. The final breakfast (after the last murder night) always has 5 players — no mission follows, straight to Free Roam then the final Round Table.",
tip: "If a shield blocked the murder, everyone arrives safely — still tap Reveal before continuing so the no-murder reveal is deliberate, not accidental.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Animated sunrise strip */}
<div style={{ position:"relative", background:"linear-gradient(to bottom,rgba(20,10,4,.98),rgba(8,4,2,.98))", border:"1px solid rgba(201,168,76,.2)", borderRadius:4, padding:"12px 10px", overflow:"hidden", minHeight:64, textAlign:"center" }}>
{/* Sun glow rising */}
<div style={{ position:"absolute", bottom:-20, left:"50%", transform:"translateX(-50%)", width:80, height:80, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,200,60,.4),rgba(255,140,30,.2),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
{/* Horizon line */}
<div style={{ position:"absolute", bottom:8, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(255,180,60,.5),rgba(255,220,100,.7),rgba(255,180,60,.5),transparent)", animation:"pulse 3s .5s ease-in-out infinite" }} />
<div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"center", gap:16, alignItems:"center" }}>
<div style={{ fontSize:"1.8rem", animation:"breakfastRise .6s ease-out both" }}>🍳</div>
<div style={{ fontSize:"1.5rem", animation:"breakfastRise .6s .15s ease-out both" }}>☕</div>
<div style={{ fontSize:"1.8rem", animation:"breakfastRise .6s .3s ease-out both" }}>🌅</div>
</div>
</div>
<div style={{ background: "rgba(139,26,26,.1)", border: "1px solid rgba(139,26,26,.3)", borderRadius: 3, padding: "8px 12px", fontSize: ".82rem", color: "var(--dim)" }}>
<span style={{ color: "var(--crim3)", fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase" }}>🌙 Host Only — </span>
<strong style={{ color: "var(--crim3)" }}>{DEMO_PLAYERS[5].emoji} {DEMO_PLAYERS[5].name}</strong> was murdered. Not yet revealed to players.
</div>
<div className="card host" style={{ padding: 12 }}>
<div className="host-label">⚜ Breakfast Groups</div>
{[{g:"Group 1",names:"🦊 Jamie, 🐺 Alex",cur:false},{g:"Group 2",names:"🦅 Sam, 🐉 Riley, 🦁 Morgan",cur:false},{g:"Group 3 — Final",names:"🐻 Quinn",cur:true}].map((g,i) => (
<div key={i} style={{ background: g.cur?"rgba(30,18,4,.9)":"rgba(20,12,4,.5)", border: `1px solid ${g.cur?"rgba(201,168,76,.4)":"rgba(140,90,20,.15)"}`, borderRadius: 4, padding: "8px 12px", marginBottom: 6 }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", color: "var(--gold2)", textTransform: "uppercase" }}>{g.g}</div>
{g.cur&&<div style={{ fontSize: ".58rem", color: "var(--gold)", fontStyle: "italic" }}>Final Group Seated</div>}
</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)" }}>{g.names}</div>
</div>
))}
<div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
<div style={{ background: "linear-gradient(135deg,#8b1a1a,#5a0e0e)", borderRadius: 3, padding: "10px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--text)", fontWeight: 700 }}>🔥 Reveal the Murder →</div>
<div style={{ background: "rgba(201,168,76,.04)", borderRadius: 3, padding: "9px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--dim)", border: "1px solid rgba(201,168,76,.1)", opacity: .5 }}>Breakfast Done → Continue → (unlocked after reveal)</div>
</div>
</div>
{/* Photo wall preview — what players see after reveal */}
<div style={{ background: "rgba(10,5,20,.8)", border: "1px solid rgba(201,168,76,.12)", borderRadius: 4, padding: "10px 12px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 10 }}>📸 What players see — photo wall after reveal</div>
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
{DEMO_PLAYERS.map((p, i) => (
<div key={p.id} style={{ textAlign: "center" }}>
<GoldFrame emoji={p.emoji} size={44} dead={p.id === "p6"} redX={p.id === "p6"} />
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".48rem", color: p.id === "p6" ? "var(--crim3)" : "var(--dim)", marginTop: 3, textDecoration: p.id === "p6" ? "line-through" : "none" }}>{p.name}</div>
</div>
))}
</div>
</div>
</div>
),
},

{
label: "Final Free Roam",
icon: "🔥",
desc: "4 players remain. One final free roam before the Fire of Truth. Players see a countdown timer. Call them all to the fire when ready.",
tip: "Watch the pairings during this roam. Who seeks out whom tells you everything about who's in a last-minute alliance.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<GobletScene />
<div className="card host" style={{ padding: 12 }}>
<div className="host-label">⚜ Remaining Players</div>
<div className="pgrid">
{DEMO_PLAYERS.filter(p=>p.alive&&["p2","p3","p4","p5"].includes(p.id)).map(p => (
<div key={p.id} className="pcard">
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".62rem" }}>{p.name}</div>
<div className={`prole ${p.role==="traitor"||p.role==="secret_traitor"?"role-t":"role-f"}`} style={{ fontSize: ".5rem" }}>
{p.role==="secret_traitor"?"ST":p.role==="traitor"?"Traitor":"Faithful"}
</div>
</div>
))}
</div>
</div>
<div style={{ background: "rgba(20,6,4,.9)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🔥</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--gold)", marginBottom: 8 }}>Final Free Roam</div>
<div style={{ background: "rgba(0,0,0,.3)", borderRadius: 6, height: 5, marginBottom: 10, overflow: "hidden" }}>
<div style={{ width: "35%", height: "100%", background: "linear-gradient(90deg,#8b1a1a,var(--crim2))", borderRadius: 6 }} />
</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", color: "var(--crim3)", marginBottom: 6 }}>4:18</div>
<div style={{ fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic" }}>Timer visible to all players</div>
</div>
<div style={{ background: "linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius: 3, padding: "11px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: ".13em", color: "#07050a" }}>Call Everyone to the Fire of Truth →</div>
</div>
),
},

{
label: "Fire of Truth",
icon: "🔥",
desc: "All remaining players vote privately — End the Game or Banish Again. Ask each directly: 'Have you chosen to end the game, or banish again?' They turn their screen toward the group. Unanimous End → The Unmasking → winner card. Not unanimous → Banish Again. Repeats until unanimous or only 2 remain.",
tip: "Not unanimous → Banish Again, back to the Round Table. This continues until unanimous End or only 2 remain. Monologue order: Faithful first, Traitors last, Secret Traitor absolutely last.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<GobletScene />
<div style={{ background: "rgba(20,8,4,.9)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: 12 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".15em", color: "var(--gold)", marginBottom: 8, textTransform: "uppercase" }}>🔥 Fire of Truth — Votes</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 10 }}>Ask each player: "Have you chosen to end the game, or banish again?"</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6 }}>
{[{p:DEMO_PLAYERS[1],v:"end",s:true},{p:DEMO_PLAYERS[2],v:"end",s:true},{p:DEMO_PLAYERS[3],v:"end",s:false},{p:DEMO_PLAYERS[4],v:null,s:false}].map(({p,v,s},i) => (
<div key={i} style={{ background: s?(v==="end"?"rgba(40,120,40,.2)":"rgba(139,26,26,.2)"):"rgba(15,10,20,.6)", border: s?(v==="end"?"1px solid rgba(80,160,80,.3)":"1px solid rgba(139,26,26,.4)"):"1px solid rgba(201,168,76,.1)", borderRadius: 3, padding: "8px 6px", textAlign: "center" }}>
<div style={{ fontSize: "1.1rem" }}>{p.emoji}</div>
<div style={{ fontSize: ".62rem", color: "var(--dim)", marginTop: 2 }}>{p.name}</div>
{s && <div style={{ fontSize: ".6rem", marginTop: 3, color: v==="end"?"#80e080":"var(--crim3)" }}>{v==="end"?"✅ End":"🔄 Banish"}</div>}
{!s && <div style={{ fontSize: ".6rem", marginTop: 3, color: "var(--dim2)" }}>—</div>}
</div>
))}
</div>
</div>
<div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: 10, textAlign: "center" }}>
<div style={{ fontSize: ".7rem", fontFamily: "'Cinzel',serif", color: "var(--gold)", marginBottom: 3 }}>🎤 Monologue Phase (if unanimous)</div>
<div style={{ fontSize: ".7rem", color: "var(--dim)", fontStyle: "italic" }}>Call each player one by one — Faithful first, Traitors last. After the last player, press Finish → winner screen.</div>
</div>
</div>
),
},

{
label: "The Unmasking",
icon: "🏁",
desc: "After a unanimous End vote — or when only 2 players remain — The Unmasking begins. All remaining players participate. Your panel shows each in reveal order — Faithful first, Traitors last, Secret Traitor absolutely last. Ask each: 'Reveal to us — are you a Traitor, or are you Faithful?' Tap Next for each. After the last, tap Finish.",
tip: "Don't rush the monologues. The Traitor's reveal is the payoff of the entire game — let the room react.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{/* Monologue order list */}
<div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: 12 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".12em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 8 }}>🎤 The Unmasking — Remaining Players</div>
<div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 3, padding: "10px 12px", marginBottom: 10, textAlign: "center" }}>
<div style={{ fontFamily: "'Crimson Text',serif", fontSize: ".95rem", color: "var(--gold)", fontStyle: "italic" }}>"Reveal to us — are you a Traitor, or are you Faithful?"</div>
</div>
{[
{ p: DEMO_PLAYERS[2], done: true, role: "faithful" },
{ p: DEMO_PLAYERS[5], done: false, role: "faithful", current: true },
{ p: DEMO_PLAYERS[1], done: false, role: "traitor" },
{ p: DEMO_PLAYERS[3], done: false, role: "secret_traitor" },
].map(({ p, done, role, current }, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 3, borderRadius: 3, background: current ? "rgba(201,168,76,.08)" : "transparent", border: current ? "1px solid rgba(201,168,76,.2)" : "1px solid transparent", opacity: done && !current ? .45 : 1 }}>
<div style={{ fontSize: "1rem" }}>{p.emoji}</div>
<div style={{ flex: 1 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: "var(--text)" }}>{p.name}</div>
<div style={{ fontSize: ".6rem", color: role === "traitor" || role === "secret_traitor" ? "var(--crim3)" : "var(--dim)", fontStyle: "italic" }}>
{done ? "✓ Revealed" : current ? "← speaking now" : role === "secret_traitor" ? "Secret Traitor — last" : role === "traitor" ? "Traitor" : "—"}
</div>
</div>
</div>
))}
</div>
{/* Next button */}
<div style={{ background: "linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius: 3, padding: "11px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: ".13em", color: "#07050a" }}>
Next — {DEMO_PLAYERS[1].name} →
</div>
{/* Finish button (greyed — not yet unlocked) */}
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(192,57,43,.3)", borderRadius: 3, padding: "11px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: ".1em", color: "rgba(200,100,80,.5)" }}>
🏁 Finish — Reveal the Winner (unlocked after last player)
</div>
</div>
),
},

{
label: "Ghost Chat",
icon: "👻",
desc: "Ghosts and spectators get a full observer dashboard: missions, room locations, live vote tallies, Seer results, ST shortlist, Turret chat and votes, breakfast reveals, and Fire of Truth votes. A green/red connection dot shows who's online. If a player's browser refreshes, they rejoin automatically without losing their place. Ghost Chat is always available.",
tip: "Ask ghosts questions during breaks. They saw things active players missed entirely.",
render: () => (
<div style={{ background: "rgba(6,3,12,.9)", border: "1px solid rgba(80,40,120,.35)", borderRadius: 4, padding: 14 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", color: "#c090ff", marginBottom: 8, textTransform: "uppercase" }}>👻 Ghost Chat</div>
<div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
<div style={{ background: "rgba(60,30,80,.35)", borderLeft: "2px solid rgba(160,100,220,.6)", borderRadius: 3, padding: "6px 10px", fontSize: ".82rem" }}>
<div style={{ fontSize: ".58rem", color: "#c090ff", marginBottom: 2 }}>👻 {DEMO_PLAYERS[0].name}</div>
<span style={{ color: "rgba(200,170,240,.75)" }}>I KNEW it was Alex the whole time.</span>
</div>
<div style={{ background: "rgba(40,20,60,.4)", borderLeft: "2px solid rgba(120,70,180,.4)", borderRadius: 3, padding: "6px 10px", fontSize: ".82rem" }}>
<div style={{ fontSize: ".58rem", color: "#a070e0", marginBottom: 2 }}>👁️ Host</div>
<span style={{ color: "rgba(200,170,240,.75)" }}>And yet you voted for Sam twice. Explain yourself.</span>
</div>
</div>
<div style={{ display: "flex", gap: 6, borderTop: "1px solid rgba(60,30,80,.3)", paddingTop: 8 }}>
<div style={{ flex: 1, background: "rgba(15,7,28,.8)", border: "1px solid rgba(60,30,80,.35)", borderRadius: 3, padding: "6px 10px", fontSize: ".78rem", color: "rgba(140,100,180,.4)", fontStyle: "italic" }}>Speak from beyond…</div>
<div style={{ padding: "6px 12px", background: "rgba(60,30,80,.5)", border: "1px solid rgba(100,60,140,.4)", borderRadius: 3, fontSize: ".62rem", fontFamily: "'Cinzel',serif", color: "#c090ff" }}>Send</div>
</div>
</div>
),
},

{
label: "The Verdicts",
icon: "🏆",
desc: "After the winner is revealed, a stats card appears for everyone showing game superlatives — best voting record, sneakiest Traitor, most suspected, shield saves, and more. Every game generates different stats based on what actually happened.",
tip: "Read these out loud as a group. The reactions are half the fun.",
render: () => (
<div className="card" style={{ padding: "16px 14px" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", textAlign: "center", marginBottom: 10 }}>🏆 The Verdicts</div>
{/* Winner banner */}
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 4, padding: "12px 14px", marginBottom: 10, textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--crim2)", marginBottom: 6 }}>🗡️ The Traitors Win!</div>
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5, marginBottom: 6 }}>
{[DEMO_PLAYERS[1], DEMO_PLAYERS[3]].map(p => (
<span key={p.id} style={{ background: "rgba(139,26,26,.2)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 20, padding: "2px 10px", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--crim3)" }}>{p.emoji} {p.name}</span>
))}
</div>
<div style={{ fontSize: ".65rem", color: "var(--dim)", fontStyle: "italic" }}>👑 Hosted by {DEMO_PLAYERS[0].emoji} {DEMO_PLAYERS[0].name}</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
{[
{ icon: "🎯", label: "Best Voting Record", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Called it right 3 times" },
{ icon: "🎭", label: "Master of Disguise", value: `${DEMO_PLAYERS[1].emoji} ${DEMO_PLAYERS[1].name}`, detail: "Only 1 vote against them all game. Terrifying." },
{ icon: "👀", label: "Most Suspected", value: `${DEMO_PLAYERS[0].emoji} ${DEMO_PLAYERS[0].name}`, detail: "Received 7 votes across the game" },
{ icon: "🤡", label: "Most Spectacularly Wrong", value: `${DEMO_PLAYERS[5].emoji} ${DEMO_PLAYERS[5].name}`, detail: "Voted for the wrong person 4 times" },
{ icon: "🛡️", label: "Saved by the Shield", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Would have been murdered. Wasn't. Shield expired at breakfast." },
{ icon: "💀", label: "First Blood", value: `${DEMO_PLAYERS[7].emoji} ${DEMO_PLAYERS[7].name}`, detail: "First to be banished — and they were innocent" },
{ icon: "🌙", label: "Night One Victim", value: `${DEMO_PLAYERS[6].emoji} ${DEMO_PLAYERS[6].name}`, detail: "First to be murdered in the dark" },
{ icon: "🗡️", label: "Longest Surviving Traitor", value: `${DEMO_PLAYERS[1].emoji} ${DEMO_PLAYERS[1].name}`, detail: "Survived to the end. Won." },
{ icon: "🏅", label: "Last Faithful Standing", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Made it to the very end." },
{ icon: "🔮", label: "The Seer", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Held the power of truth. What they saw, only they know." },
{ icon: "🎭", label: "The Secret Traitor", value: `${DEMO_PLAYERS[3].emoji} ${DEMO_PLAYERS[3].name}`, detail: "Operated alone in the shadows — and survived to the end." },
{ icon: "💩", label: "Worst Traitor", value: `${DEMO_PLAYERS[1].emoji} ${DEMO_PLAYERS[1].name}`, detail: "Banished in round 2. The deception was not strong with this one." },
{ icon: "🤦", label: "Worst Faithful", value: `${DEMO_PLAYERS[0].emoji} ${DEMO_PLAYERS[0].name}`, detail: "Voted for fellow Faithful 3 times. Doing the Traitors' job for them." },
].map((s, i) => (
<div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3 }}>
<div style={{ fontSize: "1.2rem", flexShrink: 0 }}>{s.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 2 }}>{s.label}</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".82rem", color: "var(--text)", marginBottom: 2 }}>{s.value}</div>
<div style={{ fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic" }}>{s.detail}</div>
</div>
</div>
))}
</div>
</div>
),
},
];

// ─── PLAYER DEMO ─────────────────────────────────────────────────────────────

const PLAYER_DEMO = [

{
label: "Your Role",
icon: "🎭",
desc: "Your goal depends on your role. Faithful: find and banish the Traitors before they murder everyone. Traitors: deceive, survive the vote, murder Faithful each night. A Secret Traitor may be in play — unknown even to other Traitors. The Seer earns a private interrogation power via mission.",
tip: null,
render: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[{r:"🛡️ Faithful",d:"Find and banish Traitors. Trust no one.",c:"rgba(201,168,76,.06)",bc:"rgba(201,168,76,.2)",tc:"var(--gold)"},{r:"🗡️ Traitor",d:"Deceive everyone. Murder by night. Survive the vote.",c:"rgba(139,26,26,.1)",bc:"rgba(139,26,26,.4)",tc:"var(--crim3)"},{r:"🎭 Secret Traitor",d:"A Traitor unknown to everyone — including other Traitors. Work alone until revealed.",c:"rgba(60,0,80,.15)",bc:"rgba(120,0,140,.4)",tc:"#d88ef0"},{r:"👁️ Seer",d:"Earned via mission. Each night: interrogate one player for their true role — privately.",c:"rgba(30,50,120,.1)",bc:"rgba(60,100,200,.3)",tc:"#88aaff"}].map((r,i) => (
<div key={i} style={{ background: r.c, border: `1px solid ${r.bc}`, borderRadius: 3, padding: "10px 13px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: r.tc, marginBottom: 3 }}>{r.r}</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic" }}>{r.d}</div>
</div>
))}
</div>
),
},

{
label: "Joining",
icon: "🏰",
desc: "Open the app, tap Join Game, enter your name and the Game ID the host gives you. You land in the lobby where you'll be prompted to take a selfie portrait — it appears as a gold frame on the photo wall at breakfast. Take it before the game starts. The host sets the duration and locks the game when everyone's in.",
tip: "Your name is permanent. Choose something you'll be comfortable defending loudly at the Round Table.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", marginBottom: 5, textTransform: "uppercase" }}>Your Name</div>
<div style={{ background: "rgba(23,18,30,.9)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "10px 14px", fontSize: "1rem", color: "var(--text)" }}>Sam</div>
</div>
<div>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", marginBottom: 5, textTransform: "uppercase" }}>Game ID</div>
<div style={{ background: "rgba(23,18,30,.9)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "10px 14px", fontFamily: "monospace", fontSize: "1rem", color: "var(--gold)", letterSpacing: ".2em" }}>AB4C2D</div>
</div>
<div style={{ background: "linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius: 3, padding: "11px 14px", textAlign: "center", fontSize: ".7rem", fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: ".13em", color: "#07050a" }}>ENTER THE CASTLE</div>
<div style={{ background: "rgba(15,10,20,.8)", border: "1px solid var(--border)", borderRadius: 3, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--gold2)", marginBottom: 8, textTransform: "uppercase" }}>Waiting in the Lobby (8 players)</div>
<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
{DEMO_PLAYERS.map(p => (
<div key={p.id} style={{ background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.12)", borderRadius: 2, padding: "4px 8px", fontSize: ".72rem", color: "var(--dim)" }}>{p.emoji} {p.name}</div>
))}
</div>
</div>
</div>
),
},

{
label: "Secret Traitor Ceremony",
icon: "🎭",
desc: "One at a time, the host calls each player to stand before the whole group — everyone is watching. The host taps Reveal on their panel. The result appears on YOUR OWN PHONE. Keep a perfect poker face. Return to your seat. The next player stands up. This continues through every player in the game.",
tip: "Act identically whether you're the Secret Traitor or not. Any flicker of reaction is information the group will remember all game.",
render: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", color: "var(--dim)", textTransform: "uppercase", textAlign: "center" }}>Your phone shows one of these two screens:</div>
<div style={{ background: "rgba(40,0,60,.95)", border: "2px solid rgba(180,60,240,.5)", borderRadius: 4, padding: "18px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 8 }}>🎭</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", fontWeight: 900, color: "#e060ff", marginBottom: 8, lineHeight: 1.2 }}>YOU ARE THE<br />SECRET TRAITOR</div>
<div style={{ fontSize: ".82rem", color: "#c090e0", fontStyle: "italic", marginBottom: 8 }}>Keep. This. Face.</div>
<div style={{ background: "rgba(180,60,240,.15)", border: "1px solid rgba(180,60,240,.3)", borderRadius: 3, padding: "8px 10px", fontSize: ".75rem", color: "#d0a0f0" }}>⚠️ Do not react. You are being watched by everyone right now.</div>
</div>
<div style={{ background: "rgba(4,8,4,.95)", border: "1px solid rgba(60,120,60,.4)", borderRadius: 4, padding: "18px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", fontWeight: 900, color: "#80d080", marginBottom: 6, lineHeight: 1.2 }}>NOT THE<br />SECRET TRAITOR</div>
<div style={{ fontSize: ".82rem", color: "#60a060", fontStyle: "italic" }}>Look calm. Return to the group. Take your seat.</div>
</div>
</div>
),
},

{
label: "Traitors Selection Roundtable",
icon: "🎴",
desc: "Blindfold on, phone face-down. The host walks behind the group — regular Traitors get two taps, Faithful get no tap. The Secret Traitor is not tapped — they already know their role from the ceremony. The host says 'Blindfolds off.' — 60 seconds of silence while everyone looks at each other. Then: 'Check your phone. Not a word.' Read your role privately. After everyone has read, the host announces how many Traitors are in play — not who, just the number. That's your only starting intel.",
tip: "Your role is for your eyes only. You'll learn who the other Traitors are at the first Turret — not before.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".12em", color: "var(--dim)", textTransform: "uppercase", textAlign: "center" }}>What your phone shows after the host releases roles</div>
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.45)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🗡️</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--crim2)", fontWeight: 900, marginBottom: 6 }}>You are a Traitor</div>
<div style={{ fontSize: ".85rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.7 }}>Deceive everyone. Murder by night. Survive the vote.<br />You will meet your fellow Traitors at the first Turret.</div>
</div>
<div style={{ background: "rgba(201,168,76,.06)", border: "2px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 6 }}>🛡️</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 6 }}>You are Faithful</div>
<div style={{ fontSize: ".85rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.7 }}>Find the Traitors and banish them before they murder everyone. Trust no one.</div>
</div>
<div style={{ background: "rgba(4,2,8,.8)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "8px 12px", fontSize: ".75rem", color: "var(--dim)", fontStyle: "italic", textAlign: "center" }}>
Your role is private. Nobody else sees your screen.
</div>
</div>
),
},

{
label: "Mission",
icon: "⚔️",
desc: "The full mission briefing appears on your phone when the host begins. Some missions are fully digital — your phone becomes the game: you'll submit bids, vote privately, answer trivia, decode emoji ciphers, or receive a secret word. Others are physical challenges you perform in the room. Listen carefully to your host regardless. Shields expire every morning — used or not.",
tip: "A hidden shield is most powerful when nobody suspects you have it. Don't react when you win.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ position:"relative", background:"rgba(8,5,2,.97)", border:"1px solid rgba(201,168,76,.2)", borderRadius:4, padding:"12px 10px", overflow:"hidden", minHeight:56, display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>
<div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.6),rgba(220,190,80,.8),rgba(201,168,76,.6),transparent)", animation:"swordShimmer 2.2s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"swordShimmer 2.2s .5s ease-in-out infinite" }} />
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s ease-in-out infinite" }}>⚔️</div>
<div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(201,168,76,.5),rgba(201,168,76,.1))", animation:"pulse 2s ease-in-out infinite" }} />
<div style={{ fontFamily:"'Cinzel',serif", fontSize:".65rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--gold2)" }}>Mission</div>
<div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,rgba(201,168,76,.5),rgba(201,168,76,.1))", animation:"pulse 2s .3s ease-in-out infinite" }} />
<div style={{ fontSize:"2rem", animation:"swordShimmer 2.5s .4s ease-in-out infinite" }}>🛡️</div>
</div>
<div style={{ textAlign: "center", padding: "12px 0" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎭</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".95rem", color: "var(--gold)", marginBottom: 4 }}>Two Truths & A Lie</div>
<div style={{ fontSize: ".65rem", fontFamily: "'Cinzel',serif", color: "var(--dim)", marginBottom: 10, letterSpacing: ".1em", textTransform: "uppercase" }}>social · 12 minutes</div>
<div style={{ fontSize: ".88rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.6 }}>Each player states 3 facts. Group votes which is the lie. The best liar wins.</div>
</div>
<div style={{ background: "rgba(30,60,180,.15)", border: "1px solid rgba(60,100,220,.4)", borderRadius: 4, padding: "14px 16px", textAlign: "center" }}>
<div style={{ fontSize: "1.5rem", marginBottom: 6 }}>🛡️</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "#88aaff", marginBottom: 6 }}>Shield Awarded</div>
<div style={{ fontSize: ".82rem", color: "rgba(120,150,220,.7)", fontStyle: "italic" }}>You have been given a Shield. Only you know this. Say nothing. Act normal.</div>
</div>
</div>
),
},

{
label: "Privacy & Connection",
icon: "🔒",
desc: "Tap the 🔒 button in the header to activate Privacy Mode — the screen blurs instantly, showing only the countdown timer. Nobody can glance at your phone during free roam. Tap anywhere to reveal. A green/red dot in the corner shows your connection status. If your browser refreshes mid-game, you're automatically rejoined — no re-entering anything.",
tip: "Always activate Privacy Mode before putting your phone down during Free Roam. People will look.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(4,1,8,.92)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: "24px 14px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 10 }}>🔒 Privacy Mode</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "3rem", color: "var(--gold)", marginBottom: 6 }}>07:42</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".8rem" }}>Everything is hidden. Only the timer shows.</div>
<div style={{ marginTop: 14, background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "7px 14px", display: "inline-block", fontFamily: "'Cinzel',serif", fontSize: ".62rem", color: "var(--gold)", letterSpacing: ".1em" }}>TAP TO REVEAL</div>
</div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(10,5,20,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 3 }}>
<span style={{ fontSize: ".72rem", color: "var(--dim)", fontFamily: "'Cinzel',serif" }}>Connection</span>
<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
<div style={{ width: 8, height: 8, borderRadius: "50%", background: "#50e050", boxShadow: "0 0 6px #50e050" }} />
<span style={{ fontSize: ".65rem", color: "#80d080", fontFamily: "'Cinzel',serif" }}>Synced</span>
</div>
</div>
</div>
),
},

{
label: "Phase Transitions",
icon: "✨",
desc: "Between each phase of the game, your phone displays a brief full-screen transition card so you always know what's happening next. 'The Time for Scheming is Over — Make your way to the Round Table.' 'Time to Go to Bed — Head to the night sequester room.' Each card lasts a few seconds, then your current phase screen loads automatically. on the Castle — Blindfolds on. Phones face-down.' These appear for a few seconds and then clear automatically.",
tip: "If you miss a transition card, the current phase content will be on your screen when it clears. You'll always know where you are.",
render: () => (
<div className="col" style={{ gap: 8 }}>
{[
{icon:"🕯️",title:"The Time for Scheming is Over",sub:"Make your way to the Round Table — the banishment ceremony awaits.",color:"var(--gold)"},
{icon:"🌙",title:"Time to Go to Bed",sub:"Head to the night sequester room. Put on your blindfold and wait.",color:"#c090ff"},
].map((t,i)=>(
<div key={i} style={{ background:"rgba(4,1,8,.9)",border:"1px solid rgba(201,168,76,.1)",borderRadius:4,padding:"14px 16px",textAlign:"center" }}>
<div style={{ fontSize:"1.8rem",marginBottom:6 }}>{t.icon}</div>
<div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1rem",color:t.color,marginBottom:4 }}>{t.title}</div>
<div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic" }}>{t.sub}</div>
</div>
))}
</div>
),
},

{
label: "Free Roam",
icon: "🏰",
desc: "The castle is open. Your screen shows a live countdown timer. Three permanent buttons at the bottom: 🎭 Role, 🎒 Inventory (powers), and 👥 Players (who's alive and who's a ghost). Use 🔒 Privacy Mode to blur your screen when you set it down.",
tip: "Every conversation you have here will come back up at the Round Table. Choose your words carefully.",
render: () => (
<div style={{ position: "relative" }}>
<div style={{ position:"relative", background:"rgba(8,6,2,.97)", border:"1px solid rgba(201,168,76,.18)", borderRadius:4, padding:"12px", overflow:"hidden", minHeight:56, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
<div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
{["🏰","·","🗺️","·","🏰"].map((e,i) => (
<div key={i} style={{ fontSize:i%2?"1rem":"1.8rem", opacity:i%2?.25:1, animation:i%2===0?`roamDrift ${2.5+i*.4}s ${i*.3}s ease-in-out infinite`:"pulse 2.5s ease-in-out infinite", color:i%2?"var(--gold2)":"inherit" }}>{e}</div>
))}
</div>
<div className="card" style={{ textAlign: "center", padding: "24px 20px 70px" }}>
<div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🏰</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--gold)", marginBottom: 10 }}>Free Roam</div>
<div style={{ background: "rgba(0,0,0,.3)", borderRadius: 6, height: 5, marginBottom: 14, overflow: "hidden" }}>
<div style={{ width: "62%", height: "100%", background: "linear-gradient(90deg,var(--gold2),var(--gold))", borderRadius: 6 }} />
</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.5rem", color: "var(--gold)", marginBottom: 8 }}>11:09</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".82rem" }}>Tap the buttons below to check your role, inventory, or who's still in the game.</div>
</div>
{/* Simulated persistent bottom bar — 3 buttons */}
<div style={{ display: "flex", gap: 0, marginTop: 8, background: "rgba(4,1,8,.95)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, overflow: "hidden" }}>
<div style={{ flex:1, padding:"10px 4px", fontFamily:"'Cinzel',serif", fontSize:".58rem", letterSpacing:".08em", textTransform:"uppercase", color:"var(--dim)", textAlign:"center", borderRight:"1px solid rgba(201,168,76,.1)" }}>🎭 Role</div>
<div style={{ flex:1, padding:"10px 4px", fontFamily:"'Cinzel',serif", fontSize:".58rem", letterSpacing:".08em", textTransform:"uppercase", color:"var(--dim)", textAlign:"center", borderRight:"1px solid rgba(201,168,76,.1)" }}>🎒 Inventory</div>
<div style={{ flex:1, padding:"10px 4px", fontFamily:"'Cinzel',serif", fontSize:".58rem", letterSpacing:".08em", textTransform:"uppercase", background:"rgba(201,168,76,.12)", color:"var(--gold)", textAlign:"center" }}>👥 Players</div>
</div>
{/* Players panel preview */}
<div style={{ background: "rgba(7,3,14,.97)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "12px 16px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".1em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 8 }}>👥 Players</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#80e080", marginBottom: 5 }}>Alive (6)</div>
{DEMO_PLAYERS.filter(p=>p.alive).slice(0,6).map(p => (
<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", marginBottom: 3, background: "rgba(255,255,255,.03)", borderRadius: 3 }}>
<div style={{ fontSize: ".95rem" }}>{p.emoji}</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".72rem", color: p.id === "p3" ? "var(--gold)" : "var(--text)" }}>{p.name}{p.id === "p3" ? " (You)" : ""}</div>
</div>
))}
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(140,100,180,.6)", marginTop: 8, marginBottom: 5 }}>Ghosts (2)</div>
{DEMO_PLAYERS.filter(p=>!p.alive).map(p => (
<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 6px", opacity: .5 }}>
<div style={{ fontSize: ".9rem" }}>{p.emoji}</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".68rem", color: "var(--dim)", textDecoration: "line-through" }}>{p.name}</div>
</div>
))}
</div>
</div>
),
},

{
label: "Round Table & Voting",
icon: "🕯️",
desc: "Debate opens — anyone can accuse anyone. Tap a player to vote and lock in. If the Dagger has been won from a mission, the host will ask the room before every vote: 'Does anyone wish to use the Dagger?' If that's you, stand up and declare it aloud — only then does your vote count twice. Staying silent means your vote is normal.",
tip: "The Dagger only comes into play once someone wins it from a mission. After that, the host asks before every vote. You choose when — or whether — to stand up and use it.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ position:"relative", background:"rgba(8,5,2,.95)", border:"1px solid rgba(201,168,76,.2)", borderRadius:4, padding:"10px 8px 0", overflow:"hidden", minHeight:68 }}>
{[0,1,2,3,4].map(i => (
<div key={i} style={{ position:"absolute", left:`${12+i*18}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:0.6+i%2*.2 }}>
<div style={{ width:7, height:14+i%3*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.1))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.8+i*.3}s ${i*.28}s ease-in-out infinite`, boxShadow:"0 0 10px 3px rgba(255,150,40,.35)", transformOrigin:"bottom center" }} />
<div style={{ width:1.5, height:5, background:"#1a0f05" }} />
<div style={{ width:9, height:22+i%2*8, background:"linear-gradient(to right,rgba(240,220,180,.9),rgba(255,245,220,1),rgba(220,200,160,.9))", borderRadius:"2px 2px 1px 1px" }} />
<div style={{ width:13, height:3, background:"rgba(170,140,90,.8)", borderRadius:"0 0 2px 2px" }} />
</div>
))}
<div style={{ position:"relative", zIndex:1, textAlign:"center", paddingBottom:10 }}>
<div style={{ fontFamily:"'Cinzel',serif", fontSize:".6rem", letterSpacing:".18em", textTransform:"uppercase", color:"rgba(201,168,76,.5)", animation:"tableGlow 2.5s ease-in-out infinite" }}>🕯️</div>
</div>
</div>
<div style={{ background: "rgba(139,26,26,.08)", border: "1px solid rgba(139,26,26,.25)", borderRadius: 3, padding: "8px 12px", fontSize: ".8rem", color: "var(--dim)", lineHeight: 1.6 }}>
🗡️ The host asks: <strong style={{ color: "var(--gold)" }}>"Does anyone wish to use the Dagger?"</strong><br />
<span style={{ fontSize: ".72rem" }}>Stand up and declare — or stay silent and vote normally.</span>
</div>
<div style={{ background: "rgba(15,10,20,.8)", border: "1px solid var(--border)", borderRadius: 4, padding: 12 }}>
<div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 10 }}>Vote — Select a Player</div>
<div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 12 }}>
{DEMO_PLAYERS.filter(p=>p.alive).map(p => (
<div key={p.id} className={`pcard click ${p.id==="p5"?"sel":""}`}>
{p.shield&&<div className="ppip">🛡️</div>}
{p.dagger&&<div className="ppip" style={{left:"auto",right:5}}>🗡️</div>}
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".65rem" }}>{p.name}</div>
</div>
))}
</div>
<div style={{ background: "linear-gradient(135deg,#8b1a1a,#5a0e0e)", borderRadius: 3, padding: "10px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--text)", fontWeight: 700 }}>🔒 Lock In My Vote</div>
</div>
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: ".7rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 10 }}>Your Vote — Locked In</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", fontWeight: 900, color: "var(--crim2)", marginBottom: 6 }}>{DEMO_PLAYERS[4].name}</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".85rem" }}>Turn this screen toward the group when the host calls your name.</div>
</div>
</div>
),
},

{
label: "Banishment",
icon: "⚖️",
desc: "The banished player's name appears in large text on the host's screen — held up for the group. For all regular banishments, the host asks: 'Are you a Traitor, or are you Faithful?' They must answer. Exception: the 5th-to-last player leaves in complete silence — no question.",
tip: "The Circle of Truth is your chance. If you're a Traitor, this is your greatest performance. If you're Faithful — the frustration is real.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ position:"relative", background:"rgba(12,3,3,.97)", border:"1px solid rgba(139,26,26,.3)", borderRadius:4, padding:"10px", overflow:"hidden", minHeight:56 }}>
{[0,1,2,3,4,5,6,7,8,9].map(i => (
<div key={i} style={{ position:"absolute", left:`${4+i*10}%`, bottom:`${i%4*6}px`, width:i%2?4:3, height:i%2?4:3, borderRadius:"50%", background:i%3?"#ff5010":i%2?"#ffaa30":"#ff7020", animation:`emberFloat ${1.4+i*.3}s ${i*.18}s ease-out infinite` }} />
))}
<div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
<div style={{ fontSize:"1.4rem", animation:"fireBreath 2s ease-in-out infinite", display:"inline-block" }}>🔥</div>
</div>
</div>
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.5)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 8 }}>{DEMO_PLAYERS[0].emoji}</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", fontWeight: 900, color: "var(--crim2)", marginBottom: 6 }}>{DEMO_PLAYERS[0].name}</div>
<div style={{ fontSize: ".82rem", color: "var(--text)", marginBottom: 14 }}>has been banished from the castle.</div>
<div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 3, padding: "12px 16px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", color: "var(--gold)", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".12em" }}>🎤 Circle of Truth</div>
<div style={{ fontStyle: "italic", color: "var(--gold)", fontSize: "1rem", fontWeight: 600 }}>"Are you a Traitor… or are you Faithful?"</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", marginTop: 6 }}>"I'm Faithful. I always was. Good luck."</div>
</div>
</div>
</div>
),
},

{
label: "Being a Ghost",
icon: "👻",
desc: "If you're banished or murdered, your entire app switches to greyscale — a clear visual signal you're out. You get a full observer dashboard: missions, room locations, vote tallies, the Seer's result, the ST shortlist, Turret chat, breakfast reveals, and Fire of Truth votes. Ghost Chat connects you to other ghosts and the host.",
tip: "Ghosts often have the clearest picture of the game. Save your observations for the post-game debrief — it's the best part.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(30,15,45,.8)", border: "1px solid rgba(80,40,120,.35)", borderRadius: 3, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(140,100,180,.6)" }}>Current Phase</span>
<span style={{ fontSize: ".82rem", fontFamily: "'Cinzel',serif", color: "rgba(180,140,220,.8)" }}>🕯️ Round Table</span>
</div>
<div style={{ background: "rgba(4,2,8,.95)", border: "1px solid rgba(60,30,80,.25)", borderRadius: 4, padding: "16px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 8 }}>👻</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "rgba(140,100,180,.5)", marginBottom: 6 }}>You Are a Ghost</div>
<div style={{ fontSize: ".8rem", color: "rgba(100,80,130,.5)", fontStyle: "italic", lineHeight: 1.7 }}>Roam. Observe. Do not interfere with active players.</div>
</div>
<div style={{ background: "rgba(6,3,12,.9)", border: "1px solid rgba(80,40,120,.35)", borderRadius: 3, padding: "10px 14px" }}>
<div style={{ fontSize: ".62rem", fontFamily: "'Cinzel',serif", color: "#c090ff", marginBottom: 6, textTransform: "uppercase" }}>👻 Ghost Chat</div>
<div style={{ background: "rgba(60,30,80,.35)", borderLeft: "2px solid rgba(160,100,220,.6)", borderRadius: 3, padding: "6px 10px", fontSize: ".8rem", marginBottom: 6 }}>
<div style={{ fontSize: ".58rem", color: "#c090ff", marginBottom: 2 }}>👻 Quinn</div>
<span style={{ color: "rgba(200,170,240,.75)" }}>They're going to vote out the wrong person again, aren't they.</span>
</div>
<div style={{ fontSize: ".75rem", color: "rgba(140,100,180,.5)", fontStyle: "italic" }}>Chat with other ghosts and the host. Active players cannot see this.</div>
</div>
</div>
),
},

{
label: "The Death Letter",
icon: "⚰️",
desc: "If you were murdered during the night, your phone receives a private Death Letter the moment the host reveals the breakfast. An old-style letter with a wax seal stamped with a T appears on your screen. It reads: 'By the Order of the Traitors — You Have Been Murdered. Signed, The Traitors.' Tap 'Accept Your Fate' to enter ghost life. Nobody else sees this — they just see your empty seat.",
tip: "The Death Letter only appears on the murdered player's phone. Everyone else just sees the empty portrait frame with the red ✕.",
render: () => (
<div style={{ animation:"dramaticEnter .6s ease" }}>
<div className="death-letter">
<div className="wax-seal" style={{ animation:"scaleIn .5s .2s ease both" }}>
<svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,180,160,.3)" strokeWidth="1.5"/>
<circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,180,160,.2)" strokeWidth=".8"/>
<text x="22" y="29" textAnchor="middle" fontFamily="Cinzel Decorative, serif" fontWeight="900" fontSize="20" fill="rgba(255,220,200,.85)" letterSpacing="1">T</text>
</svg>
</div>
<div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".25em",textTransform:"uppercase",color:"rgba(220,50,50,.95)",textShadow:"0 0 20px rgba(180,20,20,.6)",marginBottom:14,textAlign:"center" }}>By Order of the Traitors</div>
<div style={{ borderTop:"1px solid rgba(139,26,26,.2)",borderBottom:"1px solid rgba(139,26,26,.2)",padding:"14px 0",margin:"0 0 14px",textAlign:"center" }}>
<div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.3rem",color:"var(--crim3)",lineHeight:1.3 }}>You Have Been<br />Murdered</div>
</div>
<div style={{ fontFamily:"'Crimson Text',serif",fontSize:".95rem",lineHeight:1.8,color:"rgba(220,190,160,.8)",textAlign:"center",fontStyle:"italic" }}>
The Turret convened in the darkness and reached unanimous verdict. Your seat at breakfast is empty.
</div>

    </div>
    <div style={{ marginTop:12,fontSize:".78rem",color:"var(--dim)",fontStyle:"italic",textAlign:"center" }}>Tap below to enter ghost life.</div>
  </div>
),

},

{
label: "Night — Faithful",
icon: "🌙",
desc: "Everyone stays in the same room — blindfolds on, phones face-down. Nobody moves or leaves. The host quietly taps the Seer, Secret Traitor (if applicable), and Traitors one at a time while you sit still. After 5--8 minutes, groups are called to breakfast. You remove your blindfold only when you're escorted out of the room. A Shield silently blocks a unanimous murder attempt.",
tip: "If everyone arrives at breakfast, a shield blocked the murder attempt. That information is yours.",
render: () => (
<div className="blindfold" style={{ minHeight: "auto", padding: "28px 20px", borderRadius: 4, border: "1px solid rgba(40,20,60,.4)" }}>
<div style={{ position:"relative", background:"rgba(4,1,12,.97)", border:"1px solid rgba(80,40,120,.3)", borderRadius:4, padding:"10px 12px 0", overflow:"hidden", minHeight:72, marginBottom:0 }}>
{[0,1,2,3,4,5,6,7].map(i => (
<div key={i} style={{ position:"absolute", left:`${5+i*13}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:0.45+i%3*.15 }}>
<div style={{ width:6, height:10+i%4*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.1))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.9+i*.26}s ${i*.22}s ease-in-out infinite`, boxShadow:"0 0 7px 2px rgba(255,140,40,.25)", transformOrigin:"bottom center" }} />
<div style={{ width:1, height:4, background:"#1a0f05" }} />
<div style={{ width:8, height:16+i%3*5, background:"linear-gradient(to right,rgba(230,210,170,.8),rgba(255,245,220,.95),rgba(210,190,155,.8))", borderRadius:"2px 2px 1px 1px" }} />
</div>
))}
{[0,1,2,3,4,5,6,7,8].map(i => (
<div key={i} style={{ position:"absolute", left:`${4+i*11+i%3*2}%`, top:`${5+i%5*7}%`, width:i%3===0?3:2, height:i%3===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.65)", animation:`starTwinkle ${1.4+i*.28}s ${i*.18}s ease-in-out infinite` }} />
))}
<div style={{ position:"relative", zIndex:1, textAlign:"center", paddingBottom:10 }}>
<div style={{ fontSize:"1.6rem", animation:"moonPulse 3s ease-in-out infinite", display:"inline-block" }}>🌙</div>
</div>
</div>
<span className="bf-icon pulse" style={{ fontSize: "2.5rem", marginBottom: 12 }}>🌑</span>
<div className="bf-title" style={{ fontSize: "1.1rem" }}>Blindfold On</div>
<div className="bf-sub" style={{ maxWidth: 280, lineHeight: 1.9, fontSize: ".88rem" }}>
Stay seated. Nobody leaves the room.<br />Blindfold on. Eyes down. Phone face-down.<br />
<span style={{ opacity: .5, fontSize: ".8rem" }}>About 5--8 minutes. The host will call morning.</span>
</div>
</div>
),
},

{
label: "Night — The Turret",
icon: "🎯",
desc: "You're a Traitor. The host taps your shoulder — lift your blindfold. At the very first Turret, you will see your fellow Traitors for the first time. Chat, agree on a target, and vote unanimously. No unanimity = no murder. Blindfold back on when done.",
tip: "At the very first Turret, Traitors meet each other for the first time — introduce yourselves quietly. If the timer runs out without a unanimous vote, nothing happens. Pick someone and commit.",
render: () => (
<div className="card night" style={{ border: "1px solid rgba(80,20,120,.4)", background: "rgba(10,2,18,.9)" }}>
<TurretScene />
<div className="ctitle purple">🎯 The Turret</div>
<div className="info-box purple" style={{ marginBottom: 12, fontSize: ".85rem" }}>
Chat and agree on one target. <strong style={{ color: "#d0a0ff" }}>All Traitors must vote the same name — unanimity required.</strong>
</div>
<div style={{ background: "rgba(10,2,18,.8)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 4, padding: 10, marginBottom: 12 }}>
{[{p:DEMO_PLAYERS[1],msg:"I say Casey. Too calm."},{p:DEMO_PLAYERS[3],msg:"Agreed. Casey it is."}].map((c,i)=>(
<div key={i} style={{ background: i%2===0?"rgba(80,20,120,.3)":"rgba(139,26,26,.2)", borderLeft: i%2===0?"none":"2px solid rgba(139,26,26,.5)", borderRight: i%2===0?"2px solid rgba(140,60,200,.5)":"none", borderRadius: 3, padding: "6px 10px", fontSize: ".8rem", textAlign: i%2===0?"right":"left", marginBottom: 5 }}>
<div style={{ fontSize: ".58rem", color: "#c090ff", marginBottom: 2 }}>{c.p.name}</div>{c.msg}
</div>
))}
</div>
<div className="label">Lock In Your Vote</div>
<div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
{[{p:DEMO_PLAYERS[1],v:"Casey"},{p:DEMO_PLAYERS[3],v:"Casey"},{p:DEMO_PLAYERS[3],v:null,name:"You (Riley)"}].slice(0,2).map((t,i)=>(
<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 9px", background: "rgba(80,20,120,.2)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 3, fontSize: ".8rem" }}>
<span style={{ color: "#c090ff" }}>{t.p.emoji} {t.p.name}</span>
<span style={{ color: "var(--crim3)" }}>→ {t.v}</span>
</div>
))}
</div>
<div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 10 }}>
{DEMO_PLAYERS.filter(p=>p.alive&&(p.role==="faithful"||p.role==="seer")).map(p=>(
<div key={p.id} className={`pcard click ${p.id==="p6"?"sel":""}`}>
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".6rem" }}>{p.name}</div>
</div>
))}
</div>
<div style={{ background: "linear-gradient(135deg,#8b1a1a,#5a0e0e)", borderRadius: 3, padding: "10px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--text)", fontWeight: 700 }}>Lock In My Vote</div>
</div>
),
},

{
label: "Night — Recruited!",
icon: "🤝",
desc: "Recruitment triggers when 1 Traitor + 5 Faithful remain (6 alive total). The host taps you awake privately. You're shown which Traitor is approaching you, and given a clear choice: accept and join the Turret, or decline and be murdered. If you accept, the Traitor wakes you both in the Turret to meet — no murder that night. If you decline, you are eliminated and the Traitor still convenes in the Turret to debrief before morning. One chance. No second offer. Ever. The host taps your shoulder, you lift your blindfold. Accept to join the Turret as a Traitor. Decline to be murdered — if 6+ still remain after your death, the Traitor recruits again; if only 5 remain, the night ends.",
tip: "Accepting gives you survival and insider knowledge. Declining is fatal — but your silence keeps your cover until morning.",
render: () => (
<div className="card" style={{ background: "rgba(20,0,40,.98)", border: "2px solid rgba(140,0,220,.5)", textAlign: "center", padding: "28px 20px" }}>
<div style={{ position:"relative", background:"rgba(4,1,12,.97)", border:"1px solid rgba(80,40,120,.3)", borderRadius:4, padding:"10px 12px 0", overflow:"hidden", minHeight:72, marginBottom:0 }}>
{[0,1,2,3,4,5,6,7].map(i => (
<div key={i} style={{ position:"absolute", left:`${5+i*13}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:0.45+i%3*.15 }}>
<div style={{ width:6, height:10+i%4*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.1))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.9+i*.26}s ${i*.22}s ease-in-out infinite`, boxShadow:"0 0 7px 2px rgba(255,140,40,.25)", transformOrigin:"bottom center" }} />
<div style={{ width:1, height:4, background:"#1a0f05" }} />
<div style={{ width:8, height:16+i%3*5, background:"linear-gradient(to right,rgba(230,210,170,.8),rgba(255,245,220,.95),rgba(210,190,155,.8))", borderRadius:"2px 2px 1px 1px" }} />
</div>
))}
{[0,1,2,3,4,5,6,7,8].map(i => (
<div key={i} style={{ position:"absolute", left:`${4+i*11+i%3*2}%`, top:`${5+i%5*7}%`, width:i%3===0?3:2, height:i%3===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.65)", animation:`starTwinkle ${1.4+i*.28}s ${i*.18}s ease-in-out infinite` }} />
))}
<div style={{ position:"relative", zIndex:1, textAlign:"center", paddingBottom:10 }}>
<div style={{ fontSize:"1.6rem", animation:"moonPulse 3s ease-in-out infinite", display:"inline-block" }}>🌙</div>
</div>
</div>
<div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🤝</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "#d088ff", marginBottom: 16, lineHeight: 1.4 }}>
YOU HAVE BEEN<br />RECRUITED BY A TRAITOR
</div>
<div style={{ fontSize: ".9rem", color: "rgba(180,130,220,.8)", fontStyle: "italic", lineHeight: 1.8, marginBottom: 24 }}>
A Traitor has chosen you. Join them in the dark — or refuse and face the consequences.
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
<div style={{ background: "linear-gradient(135deg,#c9a84c,#7a5d28)", borderRadius: 3, padding: "12px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", fontWeight: 700, color: "#07050a" }}>✅ Accept — Join the Traitors</div>
<div style={{ background: "linear-gradient(135deg,#8b1a1a,#5a0e0e)", borderRadius: 3, padding: "12px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", fontWeight: 700, color: "var(--text)" }}>❌ Decline — Face the Consequences</div>
</div>
<div style={{ fontSize: ".78rem", color: "rgba(140,100,180,.5)", fontStyle: "italic" }}>Your decision is final.</div>
</div>
),
},

{
label: "Night — Seer Vision",
icon: "👁️",
desc: "You hold the Seer power. Tap a player's name, then tap Reveal to see their role — or Save for another night if you want to wait. The result appears on your screen alone. No announcement, no log.",
tip: "You can share what you've learned with anyone — that's your power. But the moment the Traitors know you're the Seer, you're next.",
render: () => (
<div className="card night" style={{ border: "1px solid rgba(100,0,160,.4)", background: "rgba(20,0,35,.9)" }}>
<CrystalBallScene />
<div className="ctitle purple">👁️ The Seer's Vision</div>
<div className="info-box purple" style={{ marginBottom: 12, fontSize: ".85rem" }}>
Tap a player to select them, then choose to reveal or save your power.
</div>
{/* Player grid — Alex selected */}
<div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 12 }}>
{DEMO_PLAYERS.filter(p=>p.alive&&p.id!=="p3").slice(0,3).map(p => (
<div key={p.id} className={`pcard${p.id==="p2"?" sel":""}`}>
<div className="pavatar">{p.emoji}</div>
<div className="pname" style={{ fontSize: ".62rem" }}>{p.name}</div>
</div>
))}
</div>
{/* Two buttons */}
<div className="col" style={{ gap: 8, marginBottom: 12 }}>
<div style={{ background: "linear-gradient(135deg,#2a0840,#180328)", borderRadius: 3, padding: "11px 14px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "#d0a8ff", border: "1px solid rgba(120,40,180,.4)" }}>
👁️ Reveal {DEMO_PLAYERS[1].name}'s Role
</div>
<div style={{ background: "transparent", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "9px 14px", textAlign: "center", fontSize: ".65rem", fontFamily: "'Cinzel',serif", color: "var(--dim)", opacity: .7 }}>
Save for another night
</div>
</div>
{/* Result */}
<div style={{ background: "rgba(139,26,26,.2)", border: "2px solid rgba(139,26,26,.5)", borderRadius: 4, padding: "14px", textAlign: "center" }}>
<div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{DEMO_PLAYERS[1].emoji}</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--crim2)", marginBottom: 4 }}>{DEMO_PLAYERS[1].name}</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--crim3)" }}>🗡️ TRAITOR</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".78rem", marginTop: 8 }}>Remember this. Put your phone face-down.</div>
</div>
</div>
),
},

{
label: "Breakfast",
icon: "🍳",
desc: "The host calls groups to breakfast one at a time. Arrive, sit down, look around. Once the final group is seated, the host reveals the murder. Player photos appear as ornate gold portrait frames. If someone was murdered, their portrait goes greyscale with a bold red ✕. If nobody died, all portraits are full colour.",
tip: "Watch how the Traitors react when the murder is revealed. They already knew. Their calm is performance.",
render: () => (
<div className="card">
<div style={{ position:"relative", background:"linear-gradient(to bottom,rgba(20,10,4,.98),rgba(8,4,2,.98))", border:"1px solid rgba(201,168,76,.2)", borderRadius:4, padding:"12px 10px", overflow:"hidden", minHeight:60, display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
<div style={{ position:"absolute", bottom:-20, left:"50%", transform:"translateX(-50%)", width:80, height:80, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,200,60,.4),rgba(255,140,30,.2),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
<div style={{ position:"absolute", bottom:8, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(255,180,60,.5),rgba(255,220,100,.7),rgba(255,180,60,.5),transparent)", animation:"pulse 3s .5s ease-in-out infinite" }} />
<div style={{ position:"relative", zIndex:1, fontSize:"1.8rem", animation:"breakfastRise .6s ease-out both" }}>🍳</div>
<div style={{ position:"relative", zIndex:1, fontSize:"1.5rem", animation:"breakfastRise .6s .15s ease-out both" }}>☕</div>
<div style={{ position:"relative", zIndex:1, fontSize:"1.8rem", animation:"breakfastRise .6s .3s ease-out both" }}>🌅</div>
</div>
<div className="ctitle">🍳 Good Morning, Castle</div>
<div className="info-box" style={{ marginBottom: 14, textAlign: "center", fontSize: ".88rem" }}>
{DEMO_PLAYERS[5].name}'s seat is empty. <strong style={{ color: "var(--crim3)" }}>{DEMO_PLAYERS[5].name} was murdered in the night.</strong>
</div>
{/* Gold portrait photo wall */}
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 10 }}>
{DEMO_PLAYERS.filter(p => p.id !== "p6").map(p => (
<div key={p.id} style={{ textAlign: "center" }}>
<GoldFrame emoji={p.emoji} size={52} />
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".5rem", color: "var(--dim)", marginTop: 3 }}>{p.name}{p.id === "p3" ? " (You)" : ""}</div>
</div>
))}
{/* Murdered player — greyscale with red X */}
<div style={{ textAlign: "center" }}>
<GoldFrame emoji={DEMO_PLAYERS[5].emoji} size={52} dead redX />
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".5rem", color: "var(--crim3)", marginTop: 3, textDecoration: "line-through" }}>{DEMO_PLAYERS[5].name}</div>
</div>
</div>
</div>
),
},

{
label: "Final Free Roam",
icon: "🔥",
desc: "4 players remain. One last roam with a countdown timer. Use this time wisely — make your final read on who the Traitors are. When the host calls, everyone gathers at the Fire of Truth.",
tip: "One of the 4 remaining players is a Traitor. Possibly two. Your vote in the next phase could end the game.",
render: () => (
<div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
<GobletScene />
<div style={{ fontSize: "2.5rem", marginBottom: 12, marginTop: 12 }}>🔥</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.3rem", color: "var(--gold)", marginBottom: 12 }}>Final Free Roam</div>
<div style={{ background: "rgba(0,0,0,.3)", borderRadius: 6, height: 5, marginBottom: 14, overflow: "hidden" }}>
<div style={{ width: "35%", height: "100%", background: "linear-gradient(90deg,#8b1a1a,var(--crim2))", borderRadius: 6 }} />
</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.5rem", color: "var(--crim3)", marginBottom: 12 }}>4:18</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".9rem", lineHeight: 1.8, maxWidth: 300, margin: "0 auto 16px" }}>
Four remain. Use this time wisely. When the host calls — go to the Fire of Truth.
</div>
</div>
),
},

{
label: "Fire of Truth",
icon: "🔥",
desc: "Vote privately — End the Game or Banish Again. After all votes are cast, the host asks each player directly. Turn your screen toward the group to reveal your choice — a large full-screen card shows either END THE GAME or BANISH AGAIN. Unanimous End → The Unmasking. Not unanimous → Banish Again.",
tip: "If you're a Traitor at the Fire of Truth — this is your last performance. One convincing Banish Again vote sends everyone back.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<GobletScene />
{/* Voting buttons */}
<div style={{ background: "rgba(20,8,4,.9)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 4, padding: 14, textAlign: "center" }}>
<div style={{ fontSize: "1.6rem", marginBottom: 6 }}>🔥</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 10 }}>Cast Your Vote</div>
<div style={{ display: "flex", gap: 8 }}>
<div style={{ flex: 1, background: "rgba(201,168,76,.1)", border: "2px solid rgba(201,168,76,.3)", borderRadius: 3, padding: "12px 8px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--gold)" }}>✅ End the Game</div>
<div style={{ flex: 1, background: "rgba(139,26,26,.2)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 3, padding: "12px 8px", textAlign: "center", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--crim3)" }}>🔄 Banish Again</div>
</div>
</div>
{/* Reveal cards — what players show the group */}
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".12em", color: "var(--dim)", textTransform: "uppercase", textAlign: "center" }}>↓ Your phone after voting — turn it toward the group</div>
<div style={{ display: "flex", gap: 6 }}>
<div style={{ flex: 1, background: "rgba(20,80,20,.2)", border: "2px solid rgba(60,160,60,.5)", borderRadius: 4, padding: "16px 8px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "#80e080", marginBottom: 4 }}>END THE GAME</div>
<div style={{ fontSize: ".62rem", color: "var(--dim)", fontStyle: "italic" }}>Turn toward group</div>
</div>
<div style={{ flex: 1, background: "rgba(139,26,26,.2)", border: "2px solid rgba(139,26,26,.5)", borderRadius: 4, padding: "16px 8px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--crim2)", marginBottom: 4 }}>BANISH AGAIN</div>
<div style={{ fontSize: ".62rem", color: "var(--dim)", fontStyle: "italic" }}>Turn toward group</div>
</div>
</div>
</div>
),
},

{
label: "The Unmasking",
icon: "🏁",
desc: "If players vote unanimously to end the game — or only 2 players remain — The Unmasking begins. All remaining players participate, The host asks each: 'Reveal to us — are you a Traitor, or are you Faithful?' Faithful first, Traitors last, Secret Traitor absolutely last. After the final player the winner screen appears on every phone.",
tip: "If you're a Traitor who made it to the end — this is your moment. You've earned it.",
render: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: 14, textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 8 }}>🎤</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 8 }}>The Unmasking</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.7 }}>
The host calls each player. Give your speech.<br />Reveal your role. Wait for the final player.
</div>
</div>
<div style={{ background: "rgba(30,4,4,.95)", border: "2px solid rgba(192,57,43,.6)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontSize: "3rem", marginBottom: 10 }}>🗡️</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.8rem", fontWeight: 900, color: "var(--crim2)", marginBottom: 8 }}>The Traitors Win</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.7 }}>They lied. They schemed. They got away with it.</div>
</div>
</div>
),
},

{
label: "The Verdicts",
icon: "🏆",
desc: "After the winner is revealed, a stats card appears for everyone showing game superlatives based on what actually happened — who voted best, who was most suspected, who snuck through as a Traitor, and more. Every game is different.",
tip: "Read these out loud together. The reactions are half the fun.",
render: () => (
<div className="card" style={{ padding: "16px 14px" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", textAlign: "center", marginBottom: 10 }}>🏆 The Verdicts</div>
{/* Winner banner */}
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 4, padding: "12px 14px", marginBottom: 10, textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--crim2)", marginBottom: 6 }}>🗡️ The Traitors Win!</div>
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5, marginBottom: 6 }}>
{[DEMO_PLAYERS[1], DEMO_PLAYERS[3]].map(p => (
<span key={p.id} style={{ background: "rgba(139,26,26,.2)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 20, padding: "2px 10px", fontSize: ".72rem", fontFamily: "'Cinzel',serif", color: "var(--crim3)" }}>{p.emoji} {p.name}</span>
))}
</div>
<div style={{ fontSize: ".65rem", color: "var(--dim)", fontStyle: "italic" }}>👑 Hosted by {DEMO_PLAYERS[0].emoji} {DEMO_PLAYERS[0].name}</div>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
{[
{ icon: "🎯", label: "Best Voting Record", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Called it right 3 times" },
{ icon: "🎭", label: "Master of Disguise", value: `${DEMO_PLAYERS[1].emoji} ${DEMO_PLAYERS[1].name}`, detail: "Only 1 vote against them all game. Terrifying." },
{ icon: "👀", label: "Most Suspected", value: `${DEMO_PLAYERS[0].emoji} ${DEMO_PLAYERS[0].name}`, detail: "Received 7 votes across the game" },
{ icon: "🤡", label: "Most Spectacularly Wrong", value: `${DEMO_PLAYERS[5].emoji} ${DEMO_PLAYERS[5].name}`, detail: "Voted for the wrong person 4 times" },
{ icon: "🛡️", label: "Saved by the Shield", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Would have been murdered. Wasn't." },
{ icon: "💀", label: "First Blood", value: `${DEMO_PLAYERS[7].emoji} ${DEMO_PLAYERS[7].name}`, detail: "First to be banished — and they were innocent" },
{ icon: "🌙", label: "Night One Victim", value: `${DEMO_PLAYERS[6].emoji} ${DEMO_PLAYERS[6].name}`, detail: "First to be murdered in the dark" },
{ icon: "🗡️", label: "Longest Surviving Traitor", value: `${DEMO_PLAYERS[3].emoji} ${DEMO_PLAYERS[3].name}`, detail: "Survived to the end. Won." },
{ icon: "🔮", label: "The Seer", value: `${DEMO_PLAYERS[2].emoji} ${DEMO_PLAYERS[2].name}`, detail: "Held the power of truth. What they saw, only they know." },
{ icon: "🎭", label: "The Secret Traitor", value: `${DEMO_PLAYERS[3].emoji} ${DEMO_PLAYERS[3].name}`, detail: "Operated alone in the shadows — and survived to the end." },
{ icon: "💩", label: "Worst Traitor", value: `${DEMO_PLAYERS[1].emoji} ${DEMO_PLAYERS[1].name}`, detail: "Banished in round 2. The deception was not strong with this one." },
{ icon: "🤦", label: "Worst Faithful", value: `${DEMO_PLAYERS[0].emoji} ${DEMO_PLAYERS[0].name}`, detail: "Voted for fellow Faithful 3 times. Doing the Traitors' job for them." },
].map((s, i) => (
<div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3 }}>
<div style={{ fontSize: "1.2rem", flexShrink: 0 }}>{s.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 2 }}>{s.label}</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".82rem", color: "var(--text)", marginBottom: 2 }}>{s.value}</div>
<div style={{ fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic" }}>{s.detail}</div>
</div>
</div>
))}
</div>
</div>
),
},
];

// ─── RULES TUTORIAL ───────────────────────────────────────────────────────────
const RULES_TUTORIAL = [
{
phase: "The Premise", icon: "🏰", title: "What Is This Game?",
body: "The Traitors (at Home) is a social deception game for 10--20 players. Duration scales with player count: 10--11 players ~3h, 12--13 players ~4h, 14--15 players ~5h, 16+ players ~6h. A small number of players are secretly appointed as Traitors. Everyone else is Faithful. Traitors try to stay hidden, murder Faithful each night, and survive. The Faithful try to identify and banish the Traitors before it's too late.",
tip: "The game is won or lost through conversation, observation, and reading people — not luck.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ label: "🗡️ Traitors", desc: "Know each other. Murder one Faithful each night. Pretend to be Faithful during the day.", c: "rgba(139,26,26,.12)", bc: "rgba(139,26,26,.35)", tc: "var(--crim3)" },
{ label: "🛡️ Faithful", desc: "Don't know who the Traitors are. Vote to banish suspects at the Round Table.", c: "rgba(201,168,76,.06)", bc: "rgba(201,168,76,.2)", tc: "var(--gold)" },
].map((r,i) => (
<div key={i} style={{ background: r.c, border: `1px solid ${r.bc}`, borderRadius: 3, padding: "12px 14px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".8rem", color: r.tc, marginBottom: 4 }}>{r.label}</div>
<div style={{ fontSize: ".88rem", color: "var(--dim)", fontStyle: "italic" }}>{r.desc}</div>
</div>
))}
</div>
),
},
{
phase: "Setup Suggestions", icon: "🏡", title: "Before You Play",
body: "This game can be played in a single room, but it's highly suggested to have at least 2 separate spaces — one for daytime gameplay, and a sequester area for the night phase. If you have more rooms available, open as many as you'd like. Extra spaces give people more options to form groups, hide out, and theorize during Free Roam. It adds to the fun! It's also suggested to obtain blindfolds, bandanas, or similar for all players to use during the night phase. Other than that, all players and the host only need their phones to participate.",
tip: "The more rooms you have, the more the game breathes. Corridors, kitchens, gardens — all fair game. Duration guide: 10--11 players ~3h, 12--13 ~4h, 14--15 ~5h, 16+ ~6h.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ icon: "🏠", label: "Minimum Setup", desc: "1 main room for daytime gameplay + 1 sequester area for the night phase. That's all you need.", c: "rgba(201,168,76,.06)", bc: "rgba(201,168,76,.2)", tc: "var(--gold)" },
{ icon: "🏰", label: "Ideal Setup", desc: "Multiple rooms open during Free Roam — the more space, the more opportunity for private conversations, alliances, and paranoia.", c: "rgba(201,168,76,.06)", bc: "rgba(201,168,76,.2)", tc: "var(--gold)" },
{ icon: "🙈", label: "Blindfolds", desc: "Recommended for all players during the night phase. Bandanas, eye masks, or similar work perfectly.", c: "rgba(40,20,60,.15)", bc: "rgba(80,40,120,.3)", tc: "#c090ff" },
{ icon: "📱", label: "What You Need", desc: "Just phones. Every player and the host needs a phone — that's the whole setup.", c: "rgba(20,60,20,.15)", bc: "rgba(40,120,40,.3)", tc: "#80e080" },
{ icon: "⏱️", label: "Duration Guide", desc: "10--11 players: ~3h · 12--13 players: ~4h · 14--15 players: ~5h · 16+ players: ~6h. The lobby panel shows a live estimate based on your player count.", c: "rgba(201,168,76,.06)", bc: "rgba(201,168,76,.2)", tc: "var(--gold)" },
].map((r,i) => (
<div key={i} style={{ background: r.c, border: `1px solid ${r.bc}`, borderRadius: 3, padding: "10px 13px", display: "flex", gap: 10 }}>
<div style={{ fontSize: "1.3rem" }}>{r.icon}</div>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: r.tc, marginBottom: 3 }}>{r.label}</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic" }}>{r.desc}</div>
</div>
</div>
))}
</div>
),
},
{
phase: "Winning & Losing", icon: "⚔️", title: "How the Game Ends",
body: "The Faithful win if they banish all Traitors. The Traitors win if their numbers equal or outnumber the Faithful. The game formally ends at the Fire of Truth when 4 players remain and vote whether to end or keep banishing. Traitor parity win only triggers at the Fire of Truth stage — not mid-game.",
tip: "One wrong banishment can shift the balance enough for the Traitors to win at the Fire of Truth.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ label: "🛡️ Faithful Win", desc: "All Traitors are banished from the castle. The Faithful vote to End the Game at the Fire of Truth.", c: "rgba(20,60,20,.15)", bc: "rgba(40,120,40,.3)", tc: "#80e080" },
{ label: "🗡️ Traitors Win", desc: "Traitor count equals or outnumbers Faithful at the Fire of Truth. The Traitors have outlasted them all.", c: "rgba(139,26,26,.12)", bc: "rgba(139,26,26,.35)", tc: "var(--crim3)" },
].map((r,i) => (
<div key={i} style={{ background: r.c, border: `1px solid ${r.bc}`, borderRadius: 3, padding: "12px 14px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".8rem", color: r.tc, marginBottom: 4 }}>{r.label}</div>
<div style={{ fontSize: ".88rem", color: "var(--dim)", fontStyle: "italic" }}>{r.desc}</div>
</div>
))}
</div>
),
},
{
phase: "Special Roles & Powers", icon: "🎭", title: "Optional Roles",
body: "Three optional elements can be toggled on or off before the game starts. Secret Traitor: one Faithful is secretly a Traitor — unknown even to other Traitors — chosen via a public ceremony before blindfolding begins. Seer: earned via mission (once per game), lets the holder privately interrogate one player each night for their true role. Dagger: won secretly from a mission (once per game), the holder can double their vote at any Round Table — but must stand and declare it aloud to activate it. Shields are always in play and earned via missions — see The Mission Phase.",
tip: "The Seer is the most powerful role in the game. Whether to reveal it, hide it, or confide in one trusted ally is entirely up to the holder — just remember: if a Traitor finds out, you're a target.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ icon: "🎭", label: "Secret Traitor", desc: "A Traitor unknown to everyone — including other Traitors. Each pre-reveal night, submits a mandatory shortlist of exactly 5 murder candidates. On their reveal night, skips the shortlist and joins the Turret directly.", c: "rgba(60,0,80,.2)", bc: "rgba(120,0,140,.4)", tc: "#d88ef0" },
{ icon: "👁️", label: "Seer", desc: "Earned via mission (once per game). Each night: privately interrogate one player for their true role. You may share what you learn — but revealing you're the Seer makes you a target.", c: "rgba(30,50,120,.12)", bc: "rgba(60,100,200,.3)", tc: "#88aaff" },
{ icon: "🗡️", label: "Dagger", desc: "Won secretly from a mission (once per game). Once awarded, the host asks before every Round Table vote: 'Does anyone wish to use the Dagger?' The holder must stand, reveal themselves, and declare it aloud — only then does their vote count twice. One use ever. The Dagger expires permanently when 5 or fewer players remain — the Final Round Table is always a clean vote.", c: "rgba(139,26,26,.1)", bc: "rgba(139,26,26,.35)", tc: "var(--crim3)" },
].map((r,i) => (
<div key={i} style={{ background: r.c, border: `1px solid ${r.bc}`, borderRadius: 3, padding: "10px 12px", display: "flex", gap: 10 }}>
<div style={{ fontSize: "1.2rem" }}>{r.icon}</div>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: r.tc, marginBottom: 2 }}>{r.label}</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic" }}>{r.desc}</div>
</div>
</div>
))}
</div>
),
},
{
phase: "Round Structure", icon: "🔄", title: "How Each Round Works",
body: "Each full round: Mission → Free Roam → Round Table → Voting → Banishment → Night → Breakfast. When the host selects a mission, the full mission details appear on every player's phone automatically — but still listen carefully to your host. Exception: when 5 players remain after breakfast, there is no mission — straight to Free Roam, then the final Round Table. The 5th-to-last player is banished in silence (no role reveal), leaving 4 for the Final Free Roam and Fire of Truth. The Turret requires unanimous agreement. Solo Traitor recruitment triggers when 6+ players are alive. Two-Traitor recruitment (games that start with 4+ Traitors): when exactly 2 Turret Traitors remain, both vote on whether to recruit or murder — one chance ever, and must be unanimous.",
tip: "The host controls every transition. Players can never advance the game themselves.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{["⚔️ Mission","🏰 Free Roam","🕯️ Round Table","🗳️ Voting","⚖️ Banishment","🌙 Night","🍳 Breakfast"].map((s,i,arr) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
<div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "7px 12px", flex: 1, fontSize: ".85rem", color: "var(--text)" }}>{s}</div>
{i < arr.length-1 && <div style={{ color: "var(--dim2)", fontSize: ".7rem" }}>↓</div>}
</div>
))}
</div>
),
},
{
phase: "Missions", icon: "⚔️", title: "The Mission Phase",
body: "Every mission awards a Shield to the winner — shields are always in play and always earned here. Each mission has a shield reveal type: public (announced to everyone), team (only the winning team knows), or hidden (winner only — your phone confirms silently). Up to 25% of alive players can hold a shield at once. Shields protect from one Turret murder attempt and expire at breakfast every morning whether used or not. Crucially: a Shield also protects against the automatic murder that follows a declined recruitment offer — declining with a Shield means you survive, and the Shield is spent. Two missions are also pre-assigned the Dagger and Seer (once per game each) — both awarded in complete silence.",
tip: "The host awards the Seer with zero ceremony — no announcement, just a quiet tap. What the Seer does with that power is entirely their strategic call.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ icon: "🛡️📢", label: "Public Shield", desc: "Announced to everyone — the winner is known. Expires at breakfast.", tc: "#80e080" },
{ icon: "🛡️👥", label: "Team Shield", desc: "Winning team knows privately. Expires at breakfast.", tc: "#80e080" },
{ icon: "🛡️🤫", label: "Hidden Shield", desc: "Winner only — phone confirms silently. Act normal. Expires at breakfast.", tc: "#80e080" },
{ icon: "🗡️", label: "Dagger Mission", desc: "One per game. Awarded secretly. Holder must publicly declare before the vote to activate it.", tc: "var(--crim3)" },
{ icon: "👁️", label: "Seer Mission", desc: "One per game. Awarded in complete silence — nobody ever knows.", tc: "#88aaff" },
].map((r,i) => (
<div key={i} style={{ background: "rgba(15,10,20,.7)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "10px 12px", display: "flex", gap: 10 }}>
<div style={{ fontSize: "1.4rem" }}>{r.icon}</div>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: r.tc, marginBottom: 2 }}>{r.label}</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic" }}>{r.desc}</div>
</div>
</div>
))}
</div>
),
},
{
phase: "The Round Table", icon: "🕯️", title: "Debate & Voting",
body: "Everyone gathers for open debate — anyone can accuse anyone. When the host calls the vote, players privately tap who they want banished and lock in. Their phone shows a large reveal card. The host calls on each player — they turn their screen toward the group and explain. The player with the most votes is banished.",
tip: "If you win the Dagger, only you know. The host will ask before every Round Table vote if anyone wants to use it — you must stand up and declare it publicly for it to count. Staying silent means your vote is normal.",
screen: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 4, padding: "16px", textAlign: "center" }}>
<div style={{ fontSize: ".7rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 10 }}>Your Vote — Locked In</div>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", fontWeight: 900, color: "var(--crim2)", marginBottom: 6 }}>Morgan</div>
<div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".85rem" }}>Turn this screen toward the group when the host calls your name.</div>
</div>
</div>
),
},
{
phase: "Banishment", icon: "🔥", title: "The Circle of Truth",
body: "The banished player's name appears on the host's screen — held up for the group. For all regular banishments, the host asks: 'Are you a Traitor, or are you Faithful?' Exception: the 5th-to-last player (reducing the count from 5 to 4) leaves in complete silence — no question, no role reveal. Immediately after their silent exit, the Final Free Roam begins and the Fire of Truth follows.",
tip: "If you're a Traitor being banished — this is your greatest performance. Deliver it.",
screen: () => (
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.5)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", fontWeight: 900, color: "var(--crim2)", marginBottom: 8 }}>Morgan</div>
<div style={{ fontSize: ".8rem", color: "var(--text)", marginBottom: 14 }}>has been banished from the castle.</div>
<div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 3, padding: "12px 14px" }}>
<div style={{ fontSize: ".65rem", fontFamily: "'Cinzel',serif", color: "var(--gold)", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".12em" }}>🎤 Circle of Truth</div>
<div style={{ fontStyle: "italic", color: "var(--gold)", fontSize: "1rem" }}>"Are you a Traitor… or are you Faithful?"</div>
</div>
<div style={{ marginTop: 10, fontSize: ".75rem", color: "var(--dim)", fontStyle: "italic" }}>5th-to-last player: silent exit — no question.</div>
</div>
),
},
{
phase: "The Night", icon: "🌙", title: "Murder in the Dark",
body: "Everyone stays in the same room — blindfolds on, nobody leaves. Order: Seer (if active), Recruitment (if 1 Traitor + 5 Faithful alive = 6 total), Secret Traitor shortlist (pre-reveal rounds only — they have a private chat with the host during this phase), then all Traitors for the Turret. Each lifts their blindfold when tapped, uses their phone, then blindfold back on. Turret requires unanimous vote. On a recruitment night, no murder happens. Shields expire at breakfast whether used or not.",
tip: "The whole ceremony should take 5--8 minutes. The Faithful are sitting there blindfolded.",
screen: () => (
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{[
{ icon: "👁️", label: "Seer", desc: "Woken first — interrogates one player privately.", color: "#dd88ff" },
{ icon: "🤝", label: "Recruitment (solo Traitor + 6+ alive)", desc: "Traitor picks recruit → accept or die → repeats. No murder on recruitment night.", color: "#d088ff" },
{ icon: "🎭", label: "Secret Traitor", desc: "Selects exactly 5 targets — mandatory shortlist. Traitors can only vote from this list.", color: "#c090ff" },
{ icon: "🗡️", label: "The Turret", desc: "All Traitors vote — must be unanimous or no murder.", color: "var(--crim3)" },
].map((s,i) => (
<div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "rgba(10,2,18,.7)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 3 }}>
<div style={{ fontSize: "1.1rem" }}>{s.icon}</div>
<div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".7rem", color: s.color, marginBottom: 2 }}>{s.label}</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)", fontStyle: "italic" }}>{s.desc}</div>
</div>
</div>
))}
</div>
),
},
{
phase: "Breakfast", icon: "🍳", title: "The Morning Reveal",
body: "Players are called to breakfast in randomised groups. Once the final group is seated, the host taps 'Reveal the Murder'. Every player's selfie appears as an ornate gold portrait frame. If someone was murdered, their portrait goes greyscale with a bold red ✕. If a shield expired having blocked the attack, or if Traitors couldn't agree, all portraits remain in full colour. The final breakfast always has 5 players.",
tip: "Watch how Traitors react at the reveal. They already knew. Their calm is a performance.",
screen: () => (
<div style={{ background: "rgba(15,8,5,.8)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 4, padding: 14 }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--gold2)", marginBottom: 10, textTransform: "uppercase" }}>🍳 Good Morning, Castle</div>
<div style={{ fontSize: ".85rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.6, marginBottom: 12 }}>
The seat is empty. <strong style={{ color: "var(--crim3)" }}>Jordan</strong> was murdered in the night.
</div>
{/* Gold portrait photo wall */}
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
{["🦊","🦅","🐉","🦁","🐍","🦉","🐻"].map((e,i) => (
<div key={i} style={{ textAlign: "center" }}>
<GoldFrame emoji={e} size={44} />
</div>
))}
<div style={{ textAlign: "center" }}>
<GoldFrame emoji="🐺" size={44} dead redX />
</div>
</div>
<div style={{ fontSize: ".68rem", color: "var(--dim)", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>
Murdered portrait goes greyscale with red ✕. All frames are gold.
</div>
</div>
),
},
{
phase: "The Fire of Truth", icon: "🔥", title: "The Final Reckoning",
body: "When 4 players remain, a Final Free Roam precedes the Fire of Truth. All players vote secretly: End the Game or Banish Again. Each player's phone shows a large vote card — the host asks each person directly and they turn their screen toward the group. Unanimous End → The Unmasking → winner revealed. After that: a Game Timeline of every murder and banishment, the Turret Chat Archive so everyone reads every message the Traitors sent, and the Confession Wall. Not unanimous → Banish Again.",
tip: "Unanimous End → The Unmasking. All remaining players (up to 4, possibly fewer). The host asks each: 'Reveal to us — are you a Traitor, or are you Faithful?' Faithful first, Traitors last, ST absolutely last. After all four have answered, the host taps Finish — winner screen appears on every phone.",
screen: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(20,80,20,.15)", border: "2px solid rgba(60,160,60,.4)", borderRadius: 4, padding: "16px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.5rem", color: "#80e080", marginBottom: 6 }}>END THE GAME</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)", fontStyle: "italic" }}>Turn this toward the group when the host asks you.</div>
</div>
<div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 4, padding: "16px", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.5rem", color: "var(--crim2)", marginBottom: 6 }}>BANISH AGAIN</div>
<div style={{ fontSize: ".78rem", color: "var(--dim)", fontStyle: "italic" }}>One Banish Again vote sends everyone back.</div>
</div>
</div>
),
},
{
phase: "Ghosts", icon: "👻", title: "Life After Elimination",
body: "Banished and murdered players become observers — their app switches to greyscale and they get a full real-time view: missions, room locations, vote tallies, Seer results, ST shortlist, Turret chat, breakfast reveals, and Fire of Truth votes. Spectators who join a game already in progress get the same view. Active players can use 🔒 Privacy Mode to blur their screen during free roam. If any player's browser refreshes, they rejoin automatically.",
tip: "Ghosts often have the clearest picture of the game — they've seen the Turret, the shortlist, and the Seer's findings. Spectators who join mid-game get the same full view. Save the debrief for after the game ends.",
screen: () => (
<div className="col" style={{ gap: 8 }}>
<div style={{ background: "rgba(4,2,8,.95)", border: "1px solid rgba(60,30,80,.25)", borderRadius: 4, padding: "12px 14px" }}>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(140,100,180,.5)", marginBottom: 8 }}>Ghost Observer Dashboard</div>
{[
"⚔️ Mission details (briefing + active)",
"🏰 Player room locations during Free Roam",
"🗳️ Live vote tallies during Round Table & Voting",
"🔥 Banishment reveal with role",
"👁️ Seer investigation target + result",
"🎭 Secret Traitor's 5-player shortlist",
"🤝 Recruitment — who was approached",
"🎯 Full Turret chat + per-Traitor vote tracker",
"🍳 Breakfast murder reveal",
"🔥 Fire of Truth votes as they're revealed",
].map((item, i) => (
<div key={i} style={{ fontSize: ".78rem", color: "rgba(180,140,220,.7)", padding: "3px 0", borderBottom: i < 9 ? "1px solid rgba(80,40,120,.15)" : "none" }}>{item}</div>
))}
</div>
<div style={{ background: "rgba(6,3,12,.9)", border: "1px solid rgba(80,40,120,.35)", borderRadius: 3, padding: "10px 14px" }}>
<div style={{ fontSize: ".62rem", fontFamily: "'Cinzel',serif", color: "#c090ff", marginBottom: 4, textTransform: "uppercase" }}>👻 Ghost Chat</div>
<div style={{ fontSize: ".78rem", color: "rgba(200,170,240,.6)", fontStyle: "italic" }}>Private channel between ghosts, spectators, and the host. Active players cannot see it.</div>
</div>
</div>
),
},
];

function AvatarCapture({ onSave, onClose }) {
const videoRef = useRef(null);
const canvasRef = useRef(null);
const [streaming, setStreaming] = useState(false);
const [captured, setCaptured] = useState(null);
const [error, setError] = useState("");

useEffect(() => {
navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user" }, audio: false })
.then(stream => {
if (videoRef.current) { videoRef.current.srcObject = stream; setStreaming(true); }
})
.catch(() => setError("Camera not available. You can skip this."));
return () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); };
}, []);

const capture = () => {
const v = videoRef.current, c = canvasRef.current;
if (!v || !c) return;
c.width = 300; c.height = 400;
const ctx = c.getContext("2d");
// Crop to 3:4 portrait from centre of video
const srcH = v.videoWidth * 4 / 3;
const srcW = v.videoWidth;
const sy = Math.max(0, (v.videoHeight - srcH) / 2);
ctx.drawImage(v, 0, sy, srcW, Math.min(srcH, v.videoHeight), 0, 0, 300, 400);
setCaptured(c.toDataURL("image/jpeg", 0.7));
};

return (
<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
<div style={{ background: "var(--dark2)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 6, padding: 24, maxWidth: 340, width: "100%", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 8 }}>📸 Your Photo</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 14 }}>Take a quick selfie. It appears next to your name during voting and on the photo wall at breakfast.</div>
{error ? (
<div style={{ color: "var(--dim)", fontSize: ".82rem", fontStyle: "italic", marginBottom: 14 }}>{error}</div>
) : !captured ? (
<div style={{ marginBottom: 14 }}>
<video ref={videoRef} autoPlay playsInline style={{ width: 160, height: 213, borderRadius: 4, objectFit: "cover", border: "2px solid rgba(201,168,76,.3)", background: "#000", display: "block", margin: "0 auto" }} />
<canvas ref={canvasRef} style={{ display: "none" }} />
</div>
) : (
<div style={{ marginBottom: 14 }}>
<div style={{ display: "flex", justifyContent: "center" }}><GoldFrame src={captured} size={140} /></div>
<canvas ref={canvasRef} style={{ display: "none" }} />
</div>
)}
<div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
{!captured ? (
<button className="btn btn-gold btn-sm" onClick={capture} disabled={!streaming && !error}>📸 Take Photo</button>
) : (
<>
<button className="btn btn-gold btn-sm" onClick={() => onSave(captured)}>✓ Use This</button>
<button className="btn btn-outline btn-sm" onClick={() => setCaptured(null)}>↩ Retake</button>
</>
)}
<button className="btn btn-outline btn-sm" onClick={onClose}>Skip</button>
</div>
</div>
</div>
);
}


export { HOST_DEMO, PLAYER_DEMO, RULES_TUTORIAL };
