

function GameElementToggle({ icon, label, desc, enabled, onChange }) {
return (
<div
onClick={() => onChange(!enabled)}
style={{
display: “flex”, gap: 14, alignItems: “flex-start”, padding: “13px 16px”,
background: enabled ? “rgba(201,168,76,.06)” : “rgba(255,255,255,.02)”,
border: `1px solid ${enabled ? "rgba(201,168,76,.3)" : "rgba(255,255,255,.07)"}`,
borderRadius: 3, cursor: “pointer”, transition: “all .2s”,
}}
>
<div style={{ fontSize: “1.5rem”, minWidth: 28, paddingTop: 2 }}>{icon}</div>
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 4 }}>
<span style={{ fontFamily: “‘Cinzel’,serif”, fontSize: “.78rem”, letterSpacing: “.1em”, color: enabled ? “var(–gold)” : “var(–dim)”, fontWeight: 700 }}>{label}</span>
<span style={{
display: “inline-block”, width: 36, height: 20, borderRadius: 10,
background: enabled ? “var(–gold2)” : “rgba(255,255,255,.1)”,
position: “relative”, transition: “background .2s”, flexShrink: 0,
}}>
<span style={{
position: “absolute”, top: 3, left: enabled ? 18 : 3,
width: 14, height: 14, borderRadius: “50%”,
background: enabled ? “var(–gold3)” : “rgba(255,255,255,.3)”,
transition: “left .2s”,
}} />
</span>
</div>
<div style={{ fontSize: “.8rem”, color: “var(–dim)”, lineHeight: 1.5, fontStyle: “italic” }}>{desc}</div>
</div>
</div>
);
}


export { GameElementToggle };
