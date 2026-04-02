import { useState, useEffect } from "react";

function GameIntroScreen({ game, isHost, gameId, load, save, advanceTo, PHASES, secretTraitorEnabled }) {
const [slide, setSlide] = useState(game?.introSlide || 0);
const [hostReady, setHostReady] = useState(false);
// Sync players to host's current slide
useEffect(() => {
if (!isHost && game?.introSlide !== undefined) {
setSlide(game.introSlide);
}
}, [game?.introSlide, isHost]);
const players = game?.players || [];
const traitorCount = players.filter(p => p.role === "traitor" || p.role === "secret_traitor").length;
const faithfulCount = players.filter(p => p.role === "faithful" || p.role === "seer").length;
const totalCount = players.length;

const hostSlides = [
{
icon: "🏰",
title: "Welcome to the Castle",
body: `${totalCount} players. ${traitorCount} Traitor${traitorCount !== 1 ? "s" : ""}. One spectacular betrayal in the making. The Faithful outnumber the Traitors — which should make this easy. It won't.`,
sub: "The Traitors already know who they are. They're looking at you right now and feeling nothing.",
color: "var(--gold)",
},
{
icon: "🗡️",
title: "What the Traitors Must Do",
body: "Lie. Charm. Smile. Point the finger at someone completely innocent. Murder one Faithful every night. Avoid detection until they hold enough power to win. They've been practising their innocent face since they checked their phone in the lobby.",
sub: "No prize money. No dramatic elimination suite. Just glory, bragging rights, and the knowledge that they are, objectively, better at this than everyone else.",
color: "var(--crim3)",
},
{
icon: "🛡️",
title: "What the Faithful Must Do",
body: "Accuse correctly. Vote strategically. Survive the night. Find the Traitors before the Traitors find them. The Faithful have the numbers — they just need to stop voting for each other.",
sub: "Also no prize money. But there is the enduring satisfaction of not being a lying, scheming, double-crossing murder accomplice. Priceless, really.",
color: "#80e080",
},
{
icon: "⚖️",
title: "How It Ends",
body: "The Faithful win by banishing every last Traitor. The Traitors win by reaching parity with the Faithful at the Fire of Truth — when only 4 remain and they hold the balance of power. The game can also end if all Traitors are eliminated at any point during voting.",
sub: "There is no third option. Only winners and people who have to live with their choices.",
color: "var(--gold2)",
},
{
icon: "🎭",
title: "Your Role Tonight",
body: "You run everything. You are judge, narrator, mystery host, and the most powerful person in the room. Keep it moving. Build tension. Let drama breathe. When things go wrong — and they will — lean into it.",
sub: "Tap below when you're ready to begin. The players are waiting. The Traitors are waiting harder.",
color: "var(--gold)",
isLast: true,
},
];

const playerSlides = [
{
icon: "🏰",
title: "Welcome to the Castle",
body: `${totalCount} players. ${traitorCount > 0 ? `${traitorCount} Traitor${traitorCount !== 1 ? "s" : ""}` : "an unknown number of Traitors"}. One spectacular betrayal in the making. The Faithful outnumber the Traitors — which should make this easy. It won't.`,
sub: "The Traitors already know who they are. They're looking at you right now and feeling nothing.",
color: "var(--gold)",
},
{
icon: "🗡️",
title: "What the Traitors Must Do",
body: "Lie. Charm. Smile. Point the finger at someone completely innocent. Murder one Faithful every night. Avoid detection until they hold enough power to win. They've been practising their innocent face since they checked their phone in the lobby.",
sub: "No prize money. No dramatic elimination suite. Just glory, bragging rights, and the knowledge that they are, objectively, better at this than everyone else.",
color: "var(--crim3)",
},
{
icon: "🛡️",
title: "What the Faithful Must Do",
body: "Accuse correctly. Vote strategically. Survive the night. Find the Traitors before the Traitors find them. The Faithful have the numbers — they just need to stop voting for each other.",
sub: "Also no prize money. But there is the enduring satisfaction of not being a lying, scheming, double-crossing murder accomplice. Priceless, really.",
color: "#80e080",
},
{
icon: "⚖️",
title: "How It Ends",
body: "The Faithful win by banishing every last Traitor. The Traitors win by reaching parity with the Faithful at the Fire of Truth — when only 4 remain and they hold the balance of power.",
sub: "There is no third option. Only winners and people who have to live with their choices.",
color: "var(--gold2)",
},
{
icon: "🌙",
title: "The Game Begins",
body: "The host is about to reveal something to each of you — privately and one at a time. Whatever you see on your phone, say nothing. Show nothing. Take a breath and commit to the performance of your life.",
sub: "Some of you are about to become Traitors. Most of you have no idea. Good luck.",
color: "var(--gold)",
isLast: true,
},
];

if (isHost) {
const current = hostSlides[slide];
return (
<div className="app"><style>{`@keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } } @keyframes castleGlow { 0%,100%{text-shadow:0 0 40px rgba(201,168,76,.3);} 50%{text-shadow:0 0 80px rgba(201,168,76,.6),0 0 120px rgba(201,168,76,.2);} }`}</style>
<div className="noise" /><div className="z1">
<div className="hdr">
<div style={{ textAlign: "center", overflow: "visible" }}>
<div className="logo-title flicker" style={{
fontFamily: "'Cinzel Decorative',cursive",
fontSize: "clamp(2.4rem,8vw,5rem)",
fontWeight: 900,
color: "var(--gold)",
letterSpacing: ".06em",
lineHeight: .9,
WebkitFontSmoothing: "antialiased",
overflow: "visible",
display: "block",
paddingBottom: ".05em",
paddingTop: ".1em",
}}>The Traitors</div>
<div style={{
fontFamily: "'Cinzel Decorative',cursive",
fontSize: ".8rem",
fontWeight: 900,
letterSpacing: ".2em",
color: "var(--gold)",
textShadow: "0 0 20px rgba(201,168,76,.4)",
textTransform: "uppercase",
marginTop: 6,
}}>at home</div>
<div style={{
fontFamily: "'Crimson Text',serif",
fontSize: ".88rem",
fontStyle: "italic",
color: "var(--dim)",
letterSpacing: ".04em",
marginTop: 8,
}}>a party game of deception and murder</div>
</div>
</div>
<div className="main" style={{ maxWidth:600, margin:"0 auto" }}>
{/* Progress dots */}
<div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:24 }}>
{hostSlides.map((_,i)=>(
<div key={i} style={{ width:i===slide?24:8, height:8, borderRadius:4, background:i===slide?"var(--gold)":i<slide?"rgba(201,168,76,.4)":"rgba(201,168,76,.12)", transition:"all .3s" }} />
))}
</div>
<div style={{ animation:"slideIn .4s ease-out" }} key={slide}>
<div style={{ textAlign:"center", marginBottom:28 }}>
<div style={{ fontSize:"4rem",marginBottom:16 }}>{current.icon}</div>
<div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"clamp(1.4rem,4vw,2.2rem)",color:current.color,marginBottom:16,lineHeight:1.2,textShadow:"0 0 40px rgba(201,168,76,.2)" }}>{current.title}</div>
<div style={{ fontSize:"1.05rem",lineHeight:1.85,color:"var(--text)",marginBottom:16,maxWidth:480,margin:"0 auto 16px" }}>{current.body}</div>
<div style={{ fontStyle:"italic",color:"var(--dim)",fontSize:".92rem",lineHeight:1.7,maxWidth:440,margin:"0 auto",borderLeft:"2px solid rgba(201,168,76,.2)",paddingLeft:16 }}>{current.sub}</div>
</div>
{/* Player roster on slide 1 */}
{slide === 0 && (
<div style={{ background:"rgba(201,168,76,.04)",border:"1px solid rgba(201,168,76,.12)",borderRadius:4,padding:"14px 16px",marginBottom:20 }}>
<div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:10 }}>Castle Roster</div>
<div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
{players.map(p=>(
<div key={p.id} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.05)",borderRadius:3,padding:"5px 10px" }}>
<span>{p.emoji}</span>
<span style={{ fontFamily:"'Cinzel',serif",fontSize:".72rem",color:"var(--dim)" }}>{p.name}</span>
</div>
))}
</div>
</div>
)}
</div>
<div style={{ display:"flex",gap:10,justifyContent:"center",marginTop:24 }}>
{slide > 0 && <button className="btn btn-outline" onClick={async()=>{
const newSlide = slide - 1;
setSlide(newSlide);
const g = await load(gameId);
if (g) await save(gameId, { ...g, introSlide: newSlide });
}}>← Back</button>}
{!current.isLast
? <button className="btn btn-gold btn-lg" onClick={async()=>{
const newSlide = slide + 1;
setSlide(newSlide);
const g = await load(gameId);
if (g) await save(gameId, { ...g, introSlide: newSlide });
}}>Next →</button>
: <button className="btn btn-gold btn-lg" onClick={async()=>{
const g = await load(gameId);
if (!g) return;
const nextPhase = g.secretTraitorEnabled ? PHASES.SECRET_TRAITOR_SELECTION : PHASES.ROLE_REVEAL;
await advanceTo(nextPhase);
}}>
Begin the Game → 🏰
</button>
}
</div>
</div>
</div></div>
);
}

// Player view — mirrors host slides, tracks host's current slide
const playerCurrent = playerSlides[Math.min(slide, playerSlides.length - 1)];
return (
<div className="app"><style>{`@keyframes castleGlow { 0%,100%{text-shadow:0 0 40px rgba(201,168,76,.3);} 50%{text-shadow:0 0 80px rgba(201,168,76,.6),0 0 120px rgba(201,168,76,.2);} } @keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
<div className="noise"/><div className="z1">
<div className="hdr">
<div style={{ textAlign: "center", overflow: "visible" }}>
<div style={{
fontFamily: "'Cinzel Decorative',cursive",
fontSize: "clamp(2.4rem,8vw,5rem)",
fontWeight: 900,
color: "var(--gold)",
textShadow: "0 0 0 2px rgba(0,0,0,.9),1px 1px 0 #3a2000,2px 2px 0 #2a1500,3px 3px 0 #1a0d00,3px 3px 12px rgba(0,0,0,.8),0 0 60px rgba(201,168,76,.5),0 0 120px rgba(201,168,76,.2)",
WebkitTextStroke: "1.5px rgba(100,50,0,.8)",
letterSpacing: ".06em",
lineHeight: .9,
WebkitFontSmoothing: "antialiased",
overflow: "visible",
display: "block",
filter: "drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 40px rgba(201,168,76,.3))",
animation: "logoFlicker 4s ease-in-out infinite",
paddingBottom: ".05em",
paddingTop: ".1em",
}}>The Traitors</div>
<div style={{
fontFamily: "'Cinzel Decorative',cursive",
fontSize: ".8rem",
fontWeight: 900,
letterSpacing: ".2em",
color: "var(--gold)",
textShadow: "0 0 20px rgba(201,168,76,.4)",
textTransform: "uppercase",
marginTop: 6,
}}>at home</div>
<div style={{
fontFamily: "'Crimson Text',serif",
fontSize: ".88rem",
fontStyle: "italic",
color: "var(--dim)",
letterSpacing: ".04em",
marginTop: 8,
}}>a party game of deception and murder</div>
</div>
</div>
<div className="main" style={{ maxWidth:600,margin:"0 auto" }}>
{/* Progress dots — read-only, mirrors host */}
<div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:24 }}>
{playerSlides.map((_,i)=>(
<div key={i} style={{ width:i===slide?24:8, height:8, borderRadius:4, background:i===slide?"var(--gold)":i<slide?"rgba(201,168,76,.4)":"rgba(201,168,76,.12)", transition:"all .3s" }} />
))}
</div>
<div style={{ animation:"slideIn .4s ease-out" }} key={slide}>
<div style={{ textAlign:"center", marginBottom:28 }}>
<div style={{ fontSize:"4rem",marginBottom:16 }}>{playerCurrent.icon}</div>
<div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"clamp(1.4rem,4vw,2.2rem)",color:playerCurrent.color,marginBottom:16,lineHeight:1.2,textShadow:"0 0 40px rgba(201,168,76,.2)" }}>{playerCurrent.title}</div>
<div style={{ fontSize:"1.05rem",lineHeight:1.85,color:"var(--text)",marginBottom:16,maxWidth:480,margin:"0 auto 16px" }}>{playerCurrent.body}</div>
<div style={{ fontStyle:"italic",color:"var(--dim)",fontSize:".92rem",lineHeight:1.7,maxWidth:440,margin:"0 auto",borderLeft:"2px solid rgba(201,168,76,.2)",paddingLeft:16 }}>{playerCurrent.sub}</div>
</div>
{/* Player roster on slide 1 */}
{slide === 0 && (
<div style={{ background:"rgba(201,168,76,.04)",border:"1px solid rgba(201,168,76,.12)",borderRadius:4,padding:"14px 16px",marginBottom:20 }}>
<div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:10 }}>Castle Roster</div>
<div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
{players.map(p=>(
<div key={p.id} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.05)",borderRadius:3,padding:"5px 10px" }}>
<span>{p.emoji}</span>
<span style={{ fontFamily:"'Cinzel',serif",fontSize:".72rem",color:"var(--dim)" }}>{p.name}</span>
</div>
))}
</div>
</div>
)}
</div>
{playerCurrent.isLast && (
<div style={{ marginTop:20,fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(201,168,76,.3)",textAlign:"center",animation:"castlePulse 2s ease-in-out infinite" }}>Waiting for the host…</div>
)}
</div>
</div></div>
);
}

// ── PHASE ATMOSPHERE ─────────────────────────────────────────────────────────
// Decorative animated header strip themed per phase

export { GameIntroScreen };
