import { useState, useEffect } from "react";
import { load } from "../storage.js";
import { HistoryStatsCard } from "./HistoryStatsCard.jsx";

function HistoryScreen({ onExit, CSS }) {
const [history, setHistory] = useState(null);
useEffect(() => {
  load("game-history").then(r => setHistory(r || [])).catch(() => setHistory([]));
}, []);

return (
<div className="app"><style>{CSS}</style><div className="noise" /><div className="z1">
<div className="hdr" style={{ padding: "20px 16px 12px" }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--gold)" }}>📋 Past Games</div>
<button className="btn btn-outline btn-sm" onClick={onExit}>← Back</button>
</div>
</div>
<div className="main">
{history === null && <div style={{ textAlign: "center", color: "var(--dim)", fontStyle: "italic", padding: 32 }}>Loading…</div>}
{history !== null && history.length === 0 && (
<div style={{ textAlign: "center", padding: 40 }}>
<div style={{ fontSize: "3rem", marginBottom: 12 }}>🏰</div>
<div style={{ fontStyle: "italic", color: "var(--dim)" }}>No games recorded yet. Complete a game to see its stats here.</div>
</div>
)}
{history !== null && history.length > 0 && history.map((entry, i) => (
<HistoryStatsCard key={entry.gameId || i} entry={entry} />
))}
</div>
</div></div>
);
}

export { HistoryScreen };
