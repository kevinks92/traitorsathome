

function GoldFrame({ src, emoji, size = 72, dead = false, redX = false }) {
const border = Math.max(10, Math.round(size * 0.18)); // frame thickness scales with size
const photoW = size;
const photoH = Math.round(size * 1.33); // 3:4 portrait ratio
const totalW = photoW + border * 2;
const totalH = photoH + border * 2;
const imgFilter = dead ? "grayscale(1) brightness(0.4)" : "none";

// Corner cartouche size
const cc = Math.max(6, Math.round(border * 0.85));
// Mid-side ornament
const mo = Math.max(4, Math.round(border * 0.6));

const uid = `${size}-${dead ? 'd' : 'a'}`;

// Frame band gradient — simulates carved moulding with highlight/shadow
// We'll draw 4 trapezoid faces (top, right, bottom, left) each with its own shading

const T = 0; const L = 0;
const W = totalW; const H = totalH;
const b = border;

// Each face: outer edge, inner edge — moulding faces
const faces = [
// top face — bright highlight
{ pts: `${L},${T} ${W},${T} ${W-b},${b} ${L+b},${b}`, fill: "url(#gf-top-"+uid+")" },
// right face — mid tone
{ pts: `${W},${T} ${W},${H} ${W-b},${H-b} ${W-b},${b}`, fill: "url(#gf-right-"+uid+")" },
// bottom face — darker shadow
{ pts: `${W},${H} ${L},${H} ${L+b},${H-b} ${W-b},${H-b}`, fill: "url(#gf-bottom-"+uid+")" },
// left face — mid tone
{ pts: `${L},${H} ${L},${T} ${L+b},${b} ${L+b},${H-b}`, fill: "url(#gf-left-"+uid+")" },
];

return (
<div style={{ position: "relative", width: totalW, height: totalH, flexShrink: 0 }}>
{/* Photo / emoji behind everything */}
<div style={{ position: "absolute", top: border, left: border, width: photoW, height: photoH, overflow: "hidden", zIndex: 1, background: "rgba(10,5,20,.95)" }}>
{src
? <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: imgFilter }} />
: <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, filter: imgFilter }}>{emoji}</div>
}
{/* Mat inner shadow */}
<div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 12px rgba(0,0,0,0.6)", pointerEvents: "none" }} />
</div>

  {/* SVG ornate frame overlay */}
  <svg width={totalW} height={totalH} style={{ position: "absolute", top: 0, left: 0, zIndex: 2, pointerEvents: "none" }}>
    <defs>
      {/* Top face — champagne highlight */}
      <linearGradient id={`gf-top-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8edb0" />
        <stop offset="35%" stopColor="#d4a842" />
        <stop offset="100%" stopColor="#8a5e18" />
      </linearGradient>
      {/* Bottom face — dark shadow */}
      <linearGradient id={`gf-bottom-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6a4010" />
        <stop offset="60%" stopColor="#a07828" />
        <stop offset="100%" stopColor="#c9a84c" />
      </linearGradient>
      {/* Right face */}
      <linearGradient id={`gf-right-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c9a84c" />
        <stop offset="40%" stopColor="#e8c860" />
        <stop offset="100%" stopColor="#7a5010" />
      </linearGradient>
      {/* Left face */}
      <linearGradient id={`gf-left-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7a5010" />
        <stop offset="60%" stopColor="#e8c860" />
        <stop offset="100%" stopColor="#c9a84c" />
      </linearGradient>
      {/* Gem fill */}
      <radialGradient id={`gf-gem-${uid}`} cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#fffbe0" />
        <stop offset="40%" stopColor="#d4a842" />
        <stop offset="100%" stopColor="#6a3c08" />
      </radialGradient>
      {/* Outer edge gold line */}
      <linearGradient id={`gf-edge-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5e090" />
        <stop offset="50%" stopColor="#b08830" />
        <stop offset="100%" stopColor="#f0d060" />
      </linearGradient>
      <filter id={`gf-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.2" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Outer border line */}
    <rect x={0.5} y={0.5} width={totalW-1} height={totalH-1} fill="none" stroke={`url(#gf-edge-${uid})`} strokeWidth="1.5" />

    {/* Moulding faces — 4 trapezoids */}
    {faces.map((f, i) => (
      <polygon key={i} points={f.pts} fill={f.fill} />
    ))}

    {/* Inner bezel lines (double-rule at photo edge) */}
    <rect x={b-2} y={b-2} width={photoW+4} height={photoH+4} fill="none" stroke="#f5e090" strokeWidth="0.75" opacity="0.7" />
    <rect x={b-0.5} y={b-0.5} width={photoW+1} height={photoH+1} fill="none" stroke="#8a5e18" strokeWidth="0.8" opacity="0.8" />

    {/* ── CORNER CARTOUCHES ── ornate square rosette at each corner */}
    {[[b/2, b/2], [totalW-b/2, b/2], [totalW-b/2, totalH-b/2], [b/2, totalH-b/2]].map(([cx, cy], i) => (
      <g key={i} transform={`translate(${cx},${cy})`} filter={`url(#gf-glow-${uid})`}>
        {/* Outer diamond */}
        <polygon points={`0,${-cc} ${cc},0 0,${cc} ${-cc},0`} fill={`url(#gf-gem-${uid})`} stroke="#f5e090" strokeWidth="0.6" />
        {/* Inner square rotated 45° */}
        <polygon points={`0,${-cc*0.52} ${cc*0.52},0 0,${cc*0.52} ${-cc*0.52},0`} fill="none" stroke="#f8edb0" strokeWidth="0.5" opacity="0.8" />
        {/* Centre dot */}
        <circle cx={0} cy={0} r={cc*0.18} fill="#fffbe0" opacity="0.9" />
        {/* Four petal marks */}
        {[0,90,180,270].map(d => {
          const a = d * Math.PI / 180;
          return <line key={d} x1={0} y1={0} x2={Math.cos(a)*cc*0.38} y2={Math.sin(a)*cc*0.38} stroke="#f5e090" strokeWidth="0.5" opacity="0.7" />;
        })}
      </g>
    ))}

    {/* ── MID-SIDE ORNAMENTS ── smaller diamond on each side */}
    {[
      [totalW/2, b/2],            // top
      [totalW-b/2, totalH/2],     // right
      [totalW/2, totalH-b/2],     // bottom
      [b/2, totalH/2],            // left
    ].map(([cx, cy], i) => (
      <g key={i} transform={`translate(${cx},${cy})`} filter={`url(#gf-glow-${uid})`}>
        <polygon points={`0,${-mo} ${mo},0 0,${mo} ${-mo},0`} fill={`url(#gf-gem-${uid})`} stroke="#f5e090" strokeWidth="0.5" />
        <circle cx={0} cy={0} r={mo*0.22} fill="#fffbe0" opacity="0.85" />
      </g>
    ))}

    {/* ── ROPE BEAD TRIM ── tiny dots along outer edge of frame band */}
    {(() => {
      const beads = [];
      const step = Math.max(6, Math.round(b * 0.9));
      const off = b * 0.28;
      // top
      for (let x = b + step; x < totalW - b - step; x += step) beads.push(<circle key={`t${x}`} cx={x} cy={off} r={1} fill="#d4a842" opacity="0.65" />);
      // bottom
      for (let x = b + step; x < totalW - b - step; x += step) beads.push(<circle key={`b${x}`} cx={x} cy={totalH-off} r={1} fill="#d4a842" opacity="0.65" />);
      // left
      for (let y = b + step; y < totalH - b - step; y += step) beads.push(<circle key={`l${y}`} cx={off} cy={y} r={1} fill="#d4a842" opacity="0.65" />);
      // right
      for (let y = b + step; y < totalH - b - step; y += step) beads.push(<circle key={`r${y}`} cx={totalW-off} cy={y} r={1} fill="#d4a842" opacity="0.65" />);
      return beads;
    })()}

    {/* Red X — drawn over photo area only */}
    {redX && (
      <g opacity="0.93">
        <line x1={b + photoW*0.12} y1={b + photoH*0.12} x2={b + photoW*0.88} y2={b + photoH*0.88} stroke="#c0392b" strokeWidth={Math.max(3, size*0.07)} strokeLinecap="round" />
        <line x1={b + photoW*0.88} y1={b + photoH*0.12} x2={b + photoW*0.12} y2={b + photoH*0.88} stroke="#c0392b" strokeWidth={Math.max(3, size*0.07)} strokeLinecap="round" />
      </g>
    )}
  </svg>
</div>

);
}


export { GoldFrame };
