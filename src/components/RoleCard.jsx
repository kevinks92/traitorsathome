import { useState } from "react";



function RoleCard({ me, isTraitor, isSecretTraitor, knownAllies, onSeer, showSeerBtn }) {
const [visible, setVisible] = useState(false);
const roleKey = isSecretTraitor ? "st" : isTraitor ? "t" : me?.seerRole ? "sv" : "f";
const roleLabel = isSecretTraitor ? "Secret Traitor" : isTraitor ? "Traitor" : me?.seerRole ? "The Seer" : "Faithful";
const roleIcon = isSecretTraitor ? "🎭" : isTraitor ? "🗡️" : me?.seerRole ? "👁️" : "🛡️";
const roleDesc = isSecretTraitor ? "You are a Traitor that even the other Traitors don't know about. You vote with the Faithful by day, you murder by night, and you answer to absolutely no one. You gorgeous, chaotic little sleeper agent."
: isTraitor ? "You lie. You smile. You tell them they're safe while picking out their metaphorical coffin. Win the trust. Betray everyone. Try not to look so pleased about it."
: me?.seerRole ? "Somewhere in this castle, a Traitor is smiling at you right now. You get ONE chance to ask someone for the truth — and they have to give it. Choose wisely. Then lie about what you found out."
: "Your job is simple: find the Traitors and get them banished before they murder every last one of you. Historically, the Faithful are terrible at this. Prove the statistics wrong.";
return (
<div className={`card ${isTraitor || isSecretTraitor ? "crim" : ""}`} style={{ marginBottom: 14 }}>
{!visible
? <div style={{ textAlign: "center", padding: "16px 10px" }}>
<div style={{ fontSize: ".75rem", fontFamily: "'Cinzel',serif", letterSpacing: ".2em", color: "var(--dim)", marginBottom: 12, textTransform: "uppercase" }}>Your Role — Eyes Only, Darling</div>
<button className="btn btn-outline" onClick={() => setVisible(true)}>Show Me My Fate</button>
<div style={{ fontSize: ".78rem", color: "var(--dim)", marginTop: 8, fontStyle: "italic" }}>Shield from prying eyes first. This is for your eyes only, babe.</div>
</div>
: <div className="role-screen">
<span className="role-icon">{roleIcon}</span>
<div className={`role-title ${roleKey}`}>{roleLabel}</div>
<div className="italic" style={{ maxWidth: 360, margin: "0 auto 12px", fontSize: ".93rem" }}>{roleDesc}</div>
{isTraitor && knownAllies.length > 0 && false && (
<div className="allies-box">
<div className="label" style={{ color: "var(--crim3)", marginBottom: 6 }}>Your Co-Conspirators (try not to make eye contact at breakfast)</div>
<div className="row" style={{ justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
{knownAllies.map(p => <span key={p.id} className="badge b-dagger">{p.emoji} {p.name}</span>)}
</div>
</div>
)}
{isSecretTraitor && (
<div className="allies-box" style={{ borderColor: "rgba(120,0,140,.4)", background: "rgba(60,0,80,.2)" }}>
<div className="label" style={{ color: "#d88ef0" }}>The other Traitors don't know you exist. You are the plot twist this game didn't ask for but absolutely deserves.</div>
</div>
)}
<div className="row" style={{ justifyContent: "center", marginTop: 10, gap: 7, flexWrap: "wrap" }}>
{me.shield && <span className="badge b-shield">🛡️ Shielded</span>}
{me.dagger && <span className="badge b-dagger">🗡️ Dagger</span>}
{me.seerRole && <span className="badge b-seer">👁️ Seer Power</span>}
</div>
{showSeerBtn && <button className="btn btn-night btn-sm" style={{ marginTop: 12 }} onClick={onSeer}>Use Seer Power</button>}
<button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => setVisible(false)}>Hide</button>
</div>
}
</div>
);
}


export { RoleCard };
