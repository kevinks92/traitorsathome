import { useState, useEffect } from "react";

function WinnerScreen({ tw, isHost, resetGame, game }) {
const [particles, setParticles] = useState([]);
const [knifes, setKnifes] = useState([]);
const [blood, setBlood] = useState([]);
const [phase, setPhase] = useState("reveal"); // reveal → celebrate

useEffect(() => {
if (tw) {
// Traitors win: knife stabs then blood splatters
const k = Array.from({ length: 7 }, (_, i) => ({
id: i, x: 10 + Math.random() * 80, delay: i * 180,
angle: -30 + Math.random() * 60, size: 2 + Math.random() * 2,
}));
setKnifes(k);
setTimeout(() => {
const b = Array.from({ length: 18 }, (_, i) => ({
id: i, x: 5 + Math.random() * 90, y: 10 + Math.random() * 80,
size: 3 + Math.random() * 8, opacity: 0.6 + Math.random() * 0.4,
shape: Math.random() > 0.5 ? "circle" : "splat",
delay: i * 80,
}));
setBlood(b);
}, 900);
} else {
// Faithful win: golden shimmer particles
const p = Array.from({ length: 60 }, (_, i) => ({
id: i,
x: Math.random() * 100, startY: -10,
size: 3 + Math.random() * 5,
delay: Math.random() * 2000,
duration: 2500 + Math.random() * 2000,
drift: -20 + Math.random() * 40,
color: ["#f5e090","#c9a84c","#f0d060","#ffffff","#ffd700"][Math.floor(Math.random()*5)],
shape: Math.random() > 0.6 ? "star" : Math.random() > 0.5 ? "circle" : "diamond",
}));
setParticles(p);
}
setTimeout(() => setPhase("celebrate"), 1200);
}, []);

const Particle = ({ p }) => {
const style = {
position: "fixed", left: `${p.x}%`, top: "-20px", zIndex: 1000,
width: p.size, height: p.size,
animation: `fairyDust ${p.duration}ms ${p.delay}ms ease-in forwards`,
color: p.color, fontSize: p.size * 2,
pointerEvents: "none",
};
if (p.shape === "star") return <div style={style}>✦</div>;
if (p.shape === "diamond") return <div style={{ ...style, width: p.size*1.4, height: p.size*1.4, background: p.color, transform: "rotate(45deg)", borderRadius: 1 }} />;
return <div style={{ ...style, borderRadius: "50%", background: p.color, boxShadow: `0 0 ${p.size*2}px ${p.color}` }} />;
};

return (
<div style={{ position: "relative", overflow: "hidden" }}>
{/* Faithful: floating fairy dust */}
{!tw && particles.map(p => <Particle key={p.id} p={p} />)}

  {/* Traitors: blood splatters */}
  {tw && blood.map(b => (
    <div key={b.id} style={{
      position: "fixed", left: `${b.x}%`, top: `${b.y}%`, zIndex: 999,
      width: b.size * 10, height: b.size * 10,
      animation: `bloodSplat 0.4s ${b.delay}ms ease-out forwards`,
      opacity: 0, pointerEvents: "none",
      background: `radial-gradient(circle at ${30+Math.random()*40}% ${30+Math.random()*40}%, #8b0000, #c0392b, transparent)`,
      borderRadius: b.shape === "circle" ? "50%" : `${40+Math.random()*30}% ${30+Math.random()*40}% ${40+Math.random()*30}% ${30+Math.random()*40}%`,
      transform: `rotate(${Math.random()*360}deg)`,
    }} />
  ))}

  {/* Traitors: knives falling */}
  {tw && knifes.map(k => (
    <div key={k.id} style={{
      position: "fixed", left: `${k.x}%`, top: "-60px", zIndex: 1000,
      fontSize: `${k.size}rem`,
      animation: `knifeStab 0.6s ${k.delay}ms cubic-bezier(.2,1.4,.6,1) forwards`,
      transform: `rotate(${k.angle}deg)`,
      pointerEvents: "none", opacity: 0,
    }}>🗡️</div>
  ))}

  {/* Main card */}
  <div className="card" style={{
    textAlign: "center", padding: "52px 20px",
    background: tw ? "rgba(20,2,2,.97)" : "rgba(8,12,4,.97)",
    border: tw ? "2px solid rgba(192,57,43,.6)" : "2px solid rgba(201,168,76,.5)",
    boxShadow: tw ? "0 0 120px rgba(139,26,26,.5), inset 0 0 80px rgba(80,0,0,.3)" : "0 0 120px rgba(201,168,76,.3), inset 0 0 80px rgba(100,80,20,.15)",
    position: "relative", zIndex: 10,
    animation: "winReveal 0.8s ease-out forwards",
  }}>
    <style>{`
      @keyframes fairyDust {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) translateX(var(--drift,0px)) rotate(360deg); opacity: 0; }
      }
      @keyframes bloodSplat {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        60% { opacity: 0.9; }
        100% { transform: scale(1) rotate(var(--rot,45deg)); opacity: 0.7; }
      }
      @keyframes knifeStab {
        0% { top: -60px; opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { top: 110vh; opacity: 0; }
      }
      @keyframes winReveal {
        0% { transform: scale(0.92); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes goldShimmer {
        0%, 100% { text-shadow: 0 0 60px rgba(201,168,76,.5), 0 0 120px rgba(201,168,76,.2); }
        50% { text-shadow: 0 0 80px rgba(245,224,144,.9), 0 0 160px rgba(201,168,76,.6), 0 0 200px rgba(201,168,76,.3); }
      }
      @keyframes crimsonPulse {
        0%, 100% { text-shadow: 0 0 60px rgba(192,57,43,.6), 0 0 120px rgba(139,26,26,.3); }
        50% { text-shadow: 0 0 100px rgba(220,20,20,.9), 0 0 200px rgba(139,26,26,.6), 0 0 30px #fff; }
      }
    `}</style>

    <div style={{ fontSize: "5rem", marginBottom: 20, animation: "winReveal 1s 0.3s ease-out both" }}>
      {tw ? "🗡️" : "✨"}
    </div>
    <div style={{
      fontFamily: "'Cinzel Decorative',cursive",
      fontSize: "clamp(2rem,7vw,4rem)", fontWeight: 900,
      color: tw ? "var(--crim2)" : "var(--gold)",
      marginBottom: 16, lineHeight: 1.1,
      animation: tw ? "crimsonPulse 2s 1s ease-in-out infinite" : "goldShimmer 2s 1s ease-in-out infinite",
    }}>
      {tw ? "The Traitors Win" : "The Faithful Win"}
    </div>
    <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: 400, margin: "0 auto 28px" }}>
      {tw
        ? "They lied. They schemed. They murdered — and they got away with it. Absolutely despicable. Absolutely iconic."
        : "Against considerable odds, genuine paranoia, and at least two catastrophically wrong votes — the Faithful prevailed. Justice, served cold."}
    </div>
    {/* Winner players */}
    {(() => {
      const all = game.players || [];
      const winners = tw
        ? all.filter(p => p.role === "traitor" || p.role === "secret_traitor")
        : all.filter(p => (p.role === "faithful" || p.role === "seer") && p.alive);
      if (!winners.length) return null;
      return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          {winners.map(p => (
            <div key={p.id} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 4 }}>{p.emoji}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".7rem", color: tw ? "var(--crim3)" : "var(--gold)" }}>{p.name}</div>
            </div>
          ))}
        </div>
      );
    })()}
    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", letterSpacing: ".2em", textTransform: "uppercase", color: tw ? "var(--crim3)" : "var(--gold2)", marginBottom: 28 }}>
      {tw ? "Glory to the deceivers. Bragging rights: eternal." : "Glory to the Faithful. Bragging rights: well earned."}
    </div>
    {isHost && <button className="btn btn-outline" style={{ marginTop: 8 }} onClick={resetGame}>Do It All Again (You Masochist)</button>}
  </div>
</div>

);
}

// ── GAME INTRO SCREEN ──────────────────────────────────────────────────────────

export { WinnerScreen };
