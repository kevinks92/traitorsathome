

function GhostChat({ ghostChats, ghostDraft, setGhostDraft, sendGhostChat, myId, isHost, senderName }) {
const chatEndRef = useRef(null);
useEffect(() => {
if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: “smooth” });
}, [ghostChats?.length]);

return (
<div className=“card” style={{ marginTop: 14, background: “rgba(6,3,12,.9)”, border: “1px solid rgba(80,40,120,.35)” }}>
<div className="ctitle purple">👻 Ghost Chat</div>
<div style={{ fontSize: “.78rem”, color: “rgba(140,100,180,.55)”, fontStyle: “italic”, marginBottom: 10 }}>
{isHost ? “Visible to you and all ghosts. Ghosts cannot communicate with active players.” : “You can chat here with other ghosts and the host. Active players cannot see this.”}
</div>
<div style={{ background: “rgba(10,4,20,.7)”, border: “1px solid rgba(60,30,80,.4)”, borderRadius: 3, overflow: “hidden” }}>
<div style={{ maxHeight: 200, overflowY: “auto”, padding: 12, display: “flex”, flexDirection: “column”, gap: 7 }}>
{ghostChats.length === 0 && (
<div style={{ textAlign: “center”, fontStyle: “italic”, color: “rgba(120,90,160,.5)”, fontSize: “.82rem”, padding: “12px 0” }}>
The ghosts are watching in silence…
</div>
)}
{ghostChats.map((m, i) => {
const isMine = m.senderId === myId;
const isHostMsg = m.isHost;
return (
<div key={i} style={{
padding: “7px 11px”, borderRadius: 3, fontSize: “.88rem”, lineHeight: 1.5,
background: isHostMsg ? “rgba(60,30,80,.35)” : isMine ? “rgba(40,20,60,.4)” : “rgba(20,10,30,.4)”,
borderLeft: isHostMsg ? “2px solid rgba(160,100,220,.6)” : isMine ? “2px solid rgba(120,70,180,.4)” : “2px solid rgba(80,50,120,.3)”,
textAlign: isMine ? “right” : “left”,
}}>
<div style={{ fontSize: “.58rem”, fontFamily: “‘Cinzel’,serif”, letterSpacing: “.1em”, marginBottom: 3, color: isHostMsg ? “#c090ff” : isMine ? “#a070e0” : “rgba(160,130,200,.6)” }}>
{m.sender}
</div>
<span style={{ color: “rgba(200,170,240,.75)” }}>{m.text}</span>
</div>
);
})}
<div ref={chatEndRef} />
</div>
<div style={{ display: “flex”, gap: 8, padding: 10, borderTop: “1px solid rgba(60,30,80,.3)”, background: “rgba(5,2,10,.6)” }}>
<input
style={{ flex: 1, background: “rgba(15,7,28,.8)”, border: “1px solid rgba(60,30,80,.35)”, borderRadius: 3, padding: “8px 12px”, color: “rgba(200,170,240,.8)”, fontFamily: “‘Crimson Text’,serif”, fontSize: “.9rem”, outline: “none” }}
placeholder=“Speak from beyond…”
value={ghostDraft}
onChange={e => setGhostDraft(e.target.value)}
onKeyDown={e => { if (e.key === “Enter”) sendGhostChat(); }}
maxLength={200}
/>
<button
className=“btn btn-sm”
style={{ background: “rgba(60,30,80,.5)”, border: “1px solid rgba(100,60,140,.4)”, color: “#c090ff”, fontFamily: “‘Cinzel’,serif”, fontSize: “.62rem” }}
onClick={sendGhostChat}
disabled={!ghostDraft.trim()}
>
Send
</button>
</div>
</div>
</div>
);
}


export { GhostChat };
