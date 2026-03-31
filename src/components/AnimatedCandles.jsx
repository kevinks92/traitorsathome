
import { useMemo } from "react";

function AnimatedCandles({ count = 5, style = {} }) {
const candles = useMemo(() => Array.from({ length: count }, (_, i) => ({
id: i,
left: `${8 + (i * (84 / (count - 1)))}%`,
height: 28 + Math.floor(Math.random() * 18),
delay: `${(i * 0.4 + Math.random() * 0.3).toFixed(2)}s`,
speed: `${(1.8 + Math.random() * 1.2).toFixed(2)}s`,
glowSpeed: `${(2.2 + Math.random() * 1.5).toFixed(2)}s`,
opacity: 0.7 + Math.random() * 0.3,
drip: Math.random() > 0.5,
})), [count]);
return (
<div style={{ position:"relative", width:"100%", height:70, pointerEvents:"none", ...style }}>
{candles.map(c => (
<div key={c.id} style={{ position:"absolute", left:c.left, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:c.opacity }}>
{/* Flame */}
<div style={{
width:8, height:c.height * 0.55,
background:"linear-gradient(to top, #ff9020, #ffcc40, rgba(255,240,120,.3))",
borderRadius:"50% 50% 30% 30% / 60% 60% 40% 40%",
animation:`candleFlicker ${c.speed} ${c.delay} ease-in-out infinite`,
boxShadow:"0 0 8px 3px rgba(255,160,50,.4), 0 0 2px rgba(255,220,80,.6)",
transformOrigin:"bottom center",
marginBottom:-1,
}} />
{/* Wick */}
<div style={{ width:1.5, height:6, background:"#2a1a0a", marginBottom:-1 }} />
{/* Body */}
<div style={{
width:10, height:c.height,
background:"linear-gradient(to right, rgba(240,220,180,.9), rgba(255,245,220,1), rgba(220,200,160,.9))",
borderRadius:"2px 2px 1px 1px",
animation:`candleGlow ${c.glowSpeed} ${c.delay} ease-in-out infinite`,
boxShadow:"0 2px 8px rgba(0,0,0,.4)",
}} />
{/* Base */}
<div style={{ width:14, height:4, background:"rgba(180,150,100,.8)", borderRadius:"0 0 2px 2px", marginTop:-1 }} />
{/* Drip */}
{c.drip && <div style={{ position:"absolute", left:"60%", top:c.height * 0.2, width:3, height:c.height * 0.3, background:"rgba(240,220,180,.6)", borderRadius:"0 0 2px 2px" }} />}
</div>
))}
</div>
);
}

// ── GOLD FRAME ────────────────────────────────────────────────────────────────
// Ornate rectangular portrait frame. size = inner photo width; aspect 3:4.

export { AnimatedCandles };
