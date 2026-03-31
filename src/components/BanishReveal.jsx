

function BanishReveal({ data }) {
const isT = data.role === “traitor” || data.role === “secret_traitor”;
return (
<div className=“ban-reveal” style={{ position:“relative”, overflow:“hidden” }}>
{/* Embers */}
{[...Array(12)].map((_,i) => (
<div key={i} style={{ position:“absolute”, left:`${4+i*8}%`, bottom:`${i%4*8}px`, width:i%2?4:3, height:i%2?4:3, borderRadius:“50%”, background:i%3?”#ff6020”:i%2?”#ffaa40”:”#ff8030”, animation:`emberFloat ${1.5+i*.3}s ${i*.18}s ease-out infinite`, pointerEvents:“none”, zIndex:0 }} />
))}
<div style={{ fontSize: “2.5rem”, marginBottom: 10 }}>{data.emoji}</div>
<div className=“ban-name” style={{ color: isT ? “var(–crim2)” : “var(–gold)” }}>{data.name}</div>
<div className=“ban-verdict” style={{ color: isT ? “var(–crim3)” : “var(–gold)” }}>
{isT ? “⚔️ A Traitor — Finally Unmasked” : “🛡️ Faithful. Innocent. Absolutely Wronged.”}
</div>
<div style={{ fontFamily: “‘Cinzel Decorative’,cursive”, fontSize: “1.2rem”, marginTop: 8, color: isT ? “#f09090” : “var(–gold3)” }}>
{isT ? “The Castle Exhales” : “A Disaster, Frankly”}
</div>
</div>
);
}


export { BanishReveal };
