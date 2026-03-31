

function MsgLog({ messages }) {
if (!messages?.length) return null;
return (
<div className=“card” style={{ marginTop: 14 }}>
<div className="ctitle">Chronicles</div>
<div className="msglog">
{[...messages].reverse().map((m, i) => (
<div key={i} className={`msg msg-${m.type}`}>{m.text}</div>
))}
</div>
</div>
);
}

export { MsgLog };
