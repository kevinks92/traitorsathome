import { useState, useEffect } from "react";
import { load } from "../storage.js";

function StatsCard({ game, gameId, myId, me }) {
if (!game?.rolesRevealed) return null;
const [confessionDraft, setConfessionDraft] = React.useState(””);
const [confessionSubmitted, setConfessionSubmitted] = React.useState(false);
const [confessionUnlocked, setConfessionUnlocked] = React.useState(false);
React.useEffect(() => { const t = setTimeout(() => setConfessionUnlocked(true), 30000); return () => clearTimeout(t); }, []);
const [confessions, setConfessions] = React.useState([]);
const [showTurretArchive, setShowTurretArchive] = React.useState(false);
const [turretArchive, setTurretArchive] = React.useState([]);
const [showTimeline, setShowTimeline] = React.useState(false);

React.useEffect(() => {
if (!gameId) return;
const load = async () => {
try {
const r = await window.storage.get(gameId + “-confessions”);
if (r) setConfessions(JSON.parse(r.value));
} catch(e) {}
try {
const r2 = await window.storage.get(gameId + “-traitor-chat-archive”);
if (r2) setTurretArchive(JSON.parse(r2.value));
} catch(e) {}
};
load();
const interval = setInterval(load, 3000);
return () => clearInterval(interval);
}, [gameId]);

const submitConfession = async () => {
if (!confessionDraft.trim()) return;
try {
const existing = await window.storage.get(gameId + “-confessions”).catch(() => null);
const list = existing ? JSON.parse(existing.value) : [];
list.push({ text: confessionDraft.trim(), ts: Date.now() });
await window.storage.set(gameId + “-confessions”, JSON.stringify(list));
setConfessions(list);
setConfessionDraft(””);
setConfessionSubmitted(true);
} catch(e) {}
};

const players = game.players || [];
const banishLog = game.banishLog || [];
const killLog = game.killLog || [];
const shieldLog = game.shieldLog || [];

const name = (id) => { const p = players.find(x => x.id === id); return p ? `${p.emoji} ${p.name}` : “?”; };
const player = (id) => players.find(x => x.id === id);
const isTraitorRole = (r) => r === “traitor” || r === “secret_traitor”;

const stats = [];

// 🎯 Best Voting Record — voted for the actually banished person most often
if (banishLog.length >= 2) {
const correctVotes = {};
banishLog.forEach(b => {
Object.entries(b.votes || {}).forEach(([voterId, targetId]) => {
if (targetId === b.banishedId) correctVotes[voterId] = (correctVotes[voterId] || 0) + 1;
});
});
const best = Object.entries(correctVotes).sort((a,b) => b[1]-a[1])[0];
if (best) stats.push({ icon: “🎯”, label: “Best Voting Record”, value: name(best[0]), detail: `Called it right ${best[1]} time${best[1]>1?"s":""}` });
}

// 🤡 Wrongest Voter — most votes cast for people who weren’t banished
if (banishLog.length >= 2) {
const wrongVotes = {};
banishLog.forEach(b => {
Object.entries(b.votes || {}).forEach(([voterId, targetId]) => {
if (targetId !== b.banishedId) wrongVotes[voterId] = (wrongVotes[voterId] || 0) + 1;
});
});
const worst = Object.entries(wrongVotes).sort((a,b) => b[1]-a[1])[0];
if (worst && worst[1] >= 2) stats.push({ icon: “🤡”, label: “Most Spectacularly Wrong”, value: name(worst[0]), detail: `Voted for the wrong person ${worst[1]} times` });
}

// 👀 Most Suspected — received the most votes across all rounds (even if not banished)
const totalVotesReceived = {};
banishLog.forEach(b => {
Object.values(b.votes || {}).forEach(targetId => {
totalVotesReceived[targetId] = (totalVotesReceived[targetId] || 0) + 1;
});
});
const mostSuspected = Object.entries(totalVotesReceived).sort((a,b) => b[1]-a[1])[0];
if (mostSuspected && mostSuspected[1] >= 2) {
stats.push({ icon: “👀”, label: “Most Suspected”, value: name(mostSuspected[0]), detail: `Received ${mostSuspected[1]} votes across the game` });
}

// 🎭 Master of Disguise — Traitor who received the fewest votes (min 1 round survived)
const traitors = players.filter(p => isTraitorRole(p.role));
if (traitors.length > 0) {
const traitorVotes = traitors.map(p => ({ p, v: totalVotesReceived[p.id] || 0 })).sort((a,b) => a.v-b.v);
const sneakiest = traitorVotes[0];
if (sneakiest) stats.push({ icon: “🎭”, label: “Master of Disguise”, value: name(sneakiest.p.id), detail: sneakiest.v === 0 ? “Never received a single vote. Terrifying.” : `Only ${sneakiest.v} vote${sneakiest.v>1?"s":""} against them all game` });
}

// 🗡️ Longest Surviving Traitor
if (traitors.length > 0) {
const traitorSurvival = traitors.map(p => {
const banishRound = banishLog.find(b => b.banishedId === p.id)?.round;
const killRound = killLog.find(k => k.killedId === p.id)?.round;
const endRound = banishRound || killRound || (game.currentRound || 99);
return { p, rounds: endRound };
}).sort((a,b) => b.rounds - a.rounds);
const longest = traitorSurvival[0];
if (longest) stats.push({ icon: “🗡️”, label: “Longest Surviving Traitor”, value: name(longest.p.id), detail: longest.p.alive ? “Survived to the end. Won.” : `Lasted ${longest.rounds} round${longest.rounds>1?"s":""}` });
}

// 🛡️ Saved by the Shield
if (shieldLog.length > 0) {
const saved = shieldLog[0];
stats.push({ icon: “🛡️”, label: “Saved by the Shield”, value: name(saved.savedId), detail: “Would have been murdered. Wasn’t. Shield expired at breakfast.” });
}

// 💀 First Blood — first person banished
if (banishLog.length > 0) {
const first = banishLog[0];
stats.push({ icon: “💀”, label: “First Blood”, value: name(first.banishedId), detail: `First to be banished${isTraitorRole(first.banishedRole) ? " — and they were a Traitor" : " — and they were innocent"}` });
}

// 🌙 Night One Victim — first murder
if (killLog.length > 0) {
const first = killLog[0];
stats.push({ icon: “🌙”, label: “Night One Victim”, value: name(first.killedId), detail: `First to be murdered in the dark` });
}

// 🗳️ Dagger Bearer — who used it
const daggerUser = banishLog.find(b => b.daggerUserId);
if (daggerUser) {
stats.push({ icon: “🗳️”, label: “The Dagger Bearer”, value: name(daggerUser.daggerUserId), detail: `Declared the Dagger in round ${daggerUser.round}. Made it count.` });
}

// 🔮 The Seer — just show who held the power
const seer = players.find(p => p.seerRole);
if (seer) stats.push({ icon: “🔮”, label: “The Seer”, value: name(seer.id), detail: “Held the power of truth. What they saw, only they know.” });

// 🎭 The Secret Traitor
const secretTraitor = players.find(p => p.role === “secret_traitor”);
if (secretTraitor) {
const rounds = banishLog.find(b => b.banishedId === secretTraitor.id)?.round || killLog.find(k => k.killedId === secretTraitor.id)?.round;
stats.push({ icon: “🎭”, label: “The Secret Traitor”, value: name(secretTraitor.id), detail: secretTraitor.alive ? “Worked alone in the shadows — and survived to the end.” : rounds ? `Operated alone for ${rounds} round${rounds > 1 ? "s" : ""} before being uncovered.` : “Operated in complete secrecy the entire game.” });
}

// 🏆 Most Rounds Survived — player who lasted longest overall
const allPlayers = players.filter(p => p.role); // everyone who played
const survival = allPlayers.map(p => {
const banishRound = banishLog.find(b => b.banishedId === p.id)?.round;
const killRound = killLog.find(k => k.killedId === p.id)?.round;
return { p, rounds: banishRound || killRound || (game.currentRound || 99) };
}).sort((a,b) => b.rounds - a.rounds);
const survivor = survival[0];
if (survivor && !isTraitorRole(survivor.p.role)) {
stats.push({ icon: “🏅”, label: “Last Faithful Standing”, value: name(survivor.p.id), detail: survivor.p.alive ? “Made it to the very end.” : `Survived ${survivor.rounds} rounds before falling` });
}

// 💩 Worst Traitor — Traitor banished the quickest (fewest rounds survived)
const banishedTraitors = traitors.filter(p => banishLog.some(b => b.banishedId === p.id));
if (banishedTraitors.length > 0) {
const worst = banishedTraitors.map(p => ({
p, round: banishLog.find(b => b.banishedId === p.id)?.round || 99
})).sort((a, b) => a.round - b.round)[0];
if (worst) stats.push({ icon: “💩”, label: “Worst Traitor”, value: name(worst.p.id), detail: worst.round === 1 ? “Banished in round 1. Spectacular.” : `Banished in round ${worst.round}. The deception was not strong with this one.` });
}

// 🤦 Worst Faithful — voted most often for other Faithful players (friendly fire)
if (banishLog.length >= 2) {
const friendlyFire = {};
banishLog.forEach(b => {
Object.entries(b.votes || {}).forEach(([voterId, targetId]) => {
const voter = player(voterId);
const target = player(targetId);
if (voter && target && !isTraitorRole(voter.role) && !isTraitorRole(target.role) && targetId !== b.banishedId) {
friendlyFire[voterId] = (friendlyFire[voterId] || 0) + 1;
}
});
});
const worst = Object.entries(friendlyFire).sort((a, b) => b[1] - a[1])[0];
if (worst && worst[1] >= 2) stats.push({ icon: “🤦”, label: “Worst Faithful”, value: name(worst[0]), detail: `Voted for fellow Faithful ${worst[1]} time${worst[1] > 1 ? "s" : ""}. Doing the Traitors' job for them.` });
}

if (stats.length === 0) return null;

return (
<div className=“card” style={{ marginTop: 16, padding: “20px 16px” }}>
<div style={{ fontFamily: “‘Cinzel Decorative’,cursive”, fontSize: “1.1rem”, color: “var(–gold)”, textAlign: “center”, marginBottom: 16 }}>🏆 The Verdicts</div>
{/* Winner announcement */}
{(() => {
const tw = game.winner === “traitors”;
const winners = tw
? players.filter(p => isTraitorRole(p.role))
: players.filter(p => !isTraitorRole(p.role));
const hostPlayer = players.find(p => p.id === game.hostId);
return (
<div style={{ background: tw ? “rgba(139,26,26,.15)” : “rgba(20,60,20,.15)”, border: tw ? “2px solid rgba(139,26,26,.4)” : “2px solid rgba(40,120,40,.3)”, borderRadius: 4, padding: “14px 16px”, marginBottom: 14, textAlign: “center” }}>
<div style={{ fontFamily: “‘Cinzel Decorative’,cursive”, fontSize: “1.4rem”, color: tw ? “var(–crim2)” : “#80e080”, marginBottom: 8 }}>
{tw ? “🗡️ The Traitors Win!” : “🏆 The Faithful Win!”}
</div>
<div style={{ display: “flex”, flexWrap: “wrap”, justifyContent: “center”, gap: 6, marginBottom: 10 }}>
{winners.map(p => (
<span key={p.id} style={{ background: tw ? “rgba(139,26,26,.2)” : “rgba(40,120,40,.2)”, border: tw ? “1px solid rgba(139,26,26,.4)” : “1px solid rgba(40,120,40,.3)”, borderRadius: 20, padding: “3px 10px”, fontSize: “.78rem”, fontFamily: “‘Cinzel’,serif”, color: tw ? “var(–crim3)” : “#80e080” }}>{p.emoji} {p.name}</span>
))}
</div>
{hostPlayer && (
<div style={{ fontSize: “.72rem”, color: “var(–dim)”, fontStyle: “italic” }}>👑 Hosted by {hostPlayer.emoji} {hostPlayer.name}</div>
)}
</div>
);
})()}
<div style={{ display: “flex”, flexDirection: “column”, gap: 8 }}>
{stats.map((s, i) => (
<div key={i} style={{ display: “flex”, gap: 12, alignItems: “flex-start”, padding: “10px 12px”, background: “rgba(201,168,76,.04)”, border: “1px solid rgba(201,168,76,.12)”, borderRadius: 3 }}>
<div style={{ fontSize: “1.4rem”, flexShrink: 0, marginTop: 1 }}>{s.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontFamily: “‘Cinzel’,serif”, fontSize: “.65rem”, letterSpacing: “.12em”, textTransform: “uppercase”, color: “var(–gold2)”, marginBottom: 3 }}>{s.label}</div>
<div style={{ fontFamily: “‘Cinzel Decorative’,cursive”, fontSize: “.95rem”, color: “var(–text)”, marginBottom: 3 }}>{s.value}</div>
<div style={{ fontSize: “.8rem”, color: “var(–dim)”, fontStyle: “italic” }}>{s.detail}</div>
</div>
</div>
))}
</div>

```
  {/* Confession Wall */}
  <div style={{ marginTop: 20, borderTop: "1px solid rgba(201,168,76,.15)", paddingTop: 16 }}>
    <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", textAlign: "center", marginBottom: 12 }}>🕯️ Confession Wall</div>
    <div style={{ fontSize: ".8rem", color: "var(--dim)", fontStyle: "italic", textAlign: "center", marginBottom: 12 }}>Anonymous. Post once. Everyone sees.</div>
    {confessions.length > 0 && (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {confessions.map((c, i) => (
          <div key={i} style={{ background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3, padding: "8px 12px", fontSize: ".88rem", color: "var(--dim)", fontStyle: "italic" }}>
            "{c.text}"
          </div>
        ))}
      </div>
    )}
    {!confessionSubmitted ? (
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ flex: 1, background: "rgba(10,5,20,.8)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "8px 12px", color: "var(--text)", fontSize: ".88rem", outline: "none" }}
          placeholder="I knew it was… / I voted wrong because…"
          value={confessionDraft} onChange={e => setConfessionDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submitConfession(); }} maxLength={200} />
        <button className="btn btn-outline btn-sm" onClick={submitConfession} disabled={!confessionDraft.trim()}>Post</button>
      </div>
    ) : (
      <div style={{ textAlign: "center", fontStyle: "italic", color: "var(--dim)", fontSize: ".85rem" }}>✓ Your confession has been posted.</div>
    )}
  </div>

  {/* Timeline */}
  {(game.timeline?.length > 0) && (
    <div style={{ marginTop: 14, borderTop: "1px solid rgba(201,168,76,.1)", paddingTop: 12 }}>
      <button onClick={() => setShowTimeline(v => !v)} style={{ width: "100%", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.12)", borderRadius: 3, padding: "8px 12px", fontFamily: "'Cinzel',serif", fontSize: ".65rem", color: "var(--gold2)", cursor: "pointer", letterSpacing: ".1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>📜 Game Timeline</span><span>{showTimeline ? "▲" : "▼"}</span>
      </button>
      {showTimeline && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {game.timeline.map((e, i) => (
            <div key={i} style={{ padding: "7px 10px", background: e.type === "murder" ? "rgba(139,26,26,.1)" : e.type === "banish" ? "rgba(100,50,0,.1)" : e.type === "shield" ? "rgba(30,60,180,.08)" : "rgba(201,168,76,.04)", border: `1px solid ${e.type === "murder" ? "rgba(139,26,26,.25)" : e.type === "banish" ? "rgba(139,80,0,.25)" : e.type === "shield" ? "rgba(60,100,220,.2)" : "rgba(201,168,76,.1)"}`, borderRadius: 3, fontSize: ".82rem", color: "var(--dim)" }}>{e.text}</div>
          ))}
        </div>
      )}
    </div>
  )}

  {/* Turret Chat Archive */}
  {turretArchive.length > 0 && (
    <div style={{ marginTop: 10 }}>
      <button onClick={() => setShowTurretArchive(v => !v)} style={{ width: "100%", background: "rgba(80,0,120,.08)", border: "1px solid rgba(100,0,160,.2)", borderRadius: 3, padding: "8px 12px", fontFamily: "'Cinzel',serif", fontSize: ".65rem", color: "#c090ff", cursor: "pointer", letterSpacing: ".1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>🎯 Read the Turret Logs — Every Lie, Every Plot</span><span>{showTurretArchive ? "▲" : "▼"}</span>
      </button>
      {showTurretArchive && (
        <div style={{ marginTop: 8, background: "rgba(10,2,18,.8)", border: "1px solid rgba(60,20,80,.4)", borderRadius: 4, padding: 12, maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {turretArchive.map((m, i) => (
            m.isSystem
              ? <div key={i} style={{ background: "rgba(120,0,180,.2)", border: "1px solid rgba(180,60,255,.3)", borderRadius: 3, padding: "5px 10px", textAlign: "center", fontSize: ".75rem", color: "#d088ff" }}>{m.text}</div>
              : <div key={i} style={{ padding: "3px 0", fontSize: ".82rem" }}>
                  <span style={{ color: "#c090ff", fontSize: ".6rem", fontFamily: "'Cinzel',serif" }}>{m.sender}: </span>
                  <span style={{ color: "var(--dim)" }}>{m.text}</span>
                </div>
          ))}
        </div>
      )}
    </div>
  )}

  {/* Share button */}
  <button className="btn btn-outline" style={{ width: "100%", marginTop: 16, fontSize: ".72rem" }} onClick={() => {
    const tw = game.winner === "traitors";
    const winners = (tw ? players.filter(p => isTraitorRole(p.role)) : players.filter(p => !isTraitorRole(p.role))).map(p => `${p.emoji} ${p.name}`).join(", ");
    const host = players.find(p => p.id === game.hostId);
    const topStats = stats.slice(0, 5).map(s => `${s.icon} ${s.label}: ${s.value} — ${s.detail}`).join("\n");
    const confText = confessions.length > 0 ? "\n\n🕯️ Confessions:\n" + confessions.map(c => `"${c.text}"`).join("\n") : "";
    const text = `🏰 The Traitors (at Home)\n${tw ? "🗡️ THE TRAITORS WIN" : "🏆 THE FAITHFUL WIN"}\nWinners: ${winners}\n👑 Host: ${host?.name || "?"}\n\n🏆 The Verdicts:\n${topStats}${confText}`;
    if (navigator.share) { navigator.share({ title: "The Traitors (at Home)", text }); }
    else { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); }
  }}>📤 Share This Game</button>
</div>
```

);
}

// ── WINNER SCREEN ─────────────────────────────────────────────────────────────

export { StatsCard };
