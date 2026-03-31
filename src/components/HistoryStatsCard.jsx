function HistoryStatsCard({ entry }) {
const { players = [], winner, banishLog = [], killLog = [], shieldLog = [], hostName, date, gameId } = entry;
const isTraitorRole = (r) => r === “traitor” || r === “secret_traitor”;
const tw = winner === “traitors”;
const winners = tw ? players.filter(p => isTraitorRole(p.role)) : players.filter(p => !isTraitorRole(p.role));

const stats = [];
const name = (id) => { const p = players.find(x => x.id === id); return p ? `${p.emoji} ${p.name}` : “?”; };

// Best voting record
if (banishLog.length >= 2) {
const cv = {};
banishLog.forEach(b => Object.entries(b.votes || {}).forEach(([vid, tid]) => { if (tid === b.banishedId) cv[vid] = (cv[vid]||0)+1; }));
const best = Object.entries(cv).sort((a,b)=>b[1]-a[1])[0];
if (best) stats.push({ icon:“🎯”, label:“Best Voting Record”, value:name(best[0]), detail:`Called it right ${best[1]} time${best[1]>1?"s":""}` });
}
// Most suspected
const tvr = {};
banishLog.forEach(b => Object.values(b.votes||{}).forEach(tid => { tvr[tid]=(tvr[tid]||0)+1; }));
const ms = Object.entries(tvr).sort((a,b)=>b[1]-a[1])[0];
if (ms && ms[1]>=2) stats.push({ icon:“👀”, label:“Most Suspected”, value:name(ms[0]), detail:`${ms[1]} votes across the game` });
// First blood
if (banishLog.length > 0) { const f=banishLog[0]; stats.push({ icon:“💀”, label:“First Blood”, value:name(f.banishedId), detail:isTraitorRole(f.banishedRole)?“Banished — was a Traitor”:“Banished — was innocent” }); }
// Night one
if (killLog.length > 0) stats.push({ icon:“🌙”, label:“Night One Victim”, value:name(killLog[0].killedId), detail:“First murdered in the dark” });
// Longest surviving traitor
const traitors = players.filter(p => isTraitorRole(p.role));
if (traitors.length > 0) {
const ts = traitors.map(p => ({ p, r: banishLog.find(b=>b.banishedId===p.id)?.round || killLog.find(k=>k.killedId===p.id)?.round || 99 })).sort((a,b)=>b.r-a.r);
stats.push({ icon:“🗡️”, label:“Longest Surviving Traitor”, value:name(ts[0].p.id), detail:ts[0].p.alive?“Survived to the end”:`Lasted ${ts[0].r} rounds` });
}
// Shield save
if (shieldLog.length > 0) stats.push({ icon:“🛡️”, label:“Saved by the Shield”, value:name(shieldLog[0].savedId), detail:“Would have been murdered. Wasn’t.” });
// Seer
const seer = players.find(p => p.seerRole);
if (seer) stats.push({ icon:“🔮”, label:“The Seer”, value:name(seer.id), detail:“Held the power of truth.” });
// Secret Traitor
const st = players.find(p => p.role === “secret_traitor”);
if (st) stats.push({ icon:“🎭”, label:“The Secret Traitor”, value:name(st.id), detail:st.alive?“Survived to the end.”:“Operated alone until uncovered.” });

const confessions = entry.confessions || [];
return (
<div style={{ background: “rgba(10,5,20,.9)”, border: “1px solid rgba(201,168,76,.15)”, borderRadius: 4, padding: “16px”, marginBottom: 12 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: 10 }}>
<div>
<div style={{ fontFamily: “‘Cinzel’,serif”, fontSize: “.62rem”, letterSpacing: “.12em”, color: “var(–gold2)”, textTransform: “uppercase”, marginBottom: 3 }}>👑 {hostName}</div>
<div style={{ fontSize: “.7rem”, color: “var(–dim)”, fontStyle: “italic” }}>{date}</div>
</div>
<div style={{ fontFamily: “‘Cinzel Decorative’,cursive”, fontSize: “.85rem”, color: tw ? “var(–crim2)” : “#80e080” }}>{tw ? “🗡️ Traitors Win” : “🏆 Faithful Win”}</div>
</div>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 5, marginBottom: 10 }}>
{winners.map(p => <span key={p.id} style={{ background: tw ? “rgba(139,26,26,.2)” : “rgba(40,120,40,.2)”, border: tw ? “1px solid rgba(139,26,26,.3)” : “1px solid rgba(40,120,40,.3)”, borderRadius: 20, padding: “2px 8px”, fontSize: “.7rem”, color: tw ? “var(–crim3)” : “#80e080” }}>{p.emoji} {p.name}</span>)}
</div>
<div style={{ display: “flex”, flexDirection: “column”, gap: 6 }}>
{stats.map((s,i) => (
<div key={i} style={{ display: “flex”, gap: 8, alignItems: “flex-start” }}>
<div style={{ fontSize: “1rem”, flexShrink: 0 }}>{s.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontFamily: “‘Cinzel’,serif”, fontSize: “.55rem”, letterSpacing: “.1em”, textTransform: “uppercase”, color: “var(–gold2)” }}>{s.label}</div>
<div style={{ fontSize: “.75rem”, color: “var(–text)” }}>{s.value} <span style={{ color: “var(–dim)”, fontStyle: “italic” }}>— {s.detail}</span></div>
</div>
</div>
))}
</div>
{confessions.length > 0 && (
<div style={{ marginTop: 10, borderTop: “1px solid rgba(201,168,76,.1)”, paddingTop: 8 }}>
<div style={{ fontFamily: “‘Cinzel’,serif”, fontSize: “.55rem”, letterSpacing: “.1em”, textTransform: “uppercase”, color: “var(–gold2)”, marginBottom: 6 }}>🕯️ Confessions</div>
{confessions.map((c, i) => (
<div key={i} style={{ fontSize: “.75rem”, color: “var(–dim)”, fontStyle: “italic”, marginBottom: 3 }}>”{c.text}”</div>
))}
</div>
)}
</div>
);
}


export { HistoryStatsCard };
