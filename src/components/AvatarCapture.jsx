import { useEffect, useRef, useState } from "react";;
import { GoldFrame } from "./GoldFrame.jsx";

function AvatarCapture({ onSave, onClose }) {
const videoRef = useRef(null);
const canvasRef = useRef(null);
const [streaming, setStreaming] = useState(false);
const [captured, setCaptured] = useState(null);
const [error, setError] = useState("");

useEffect(() => {
navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user" }, audio: false })
.then(stream => {
if (videoRef.current) { videoRef.current.srcObject = stream; setStreaming(true); }
})
.catch(() => setError("Camera not available. You can skip this."));
return () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); };
}, []);

const capture = () => {
const v = videoRef.current, c = canvasRef.current;
if (!v || !c) return;
c.width = 300; c.height = 400;
const ctx = c.getContext("2d");
// Crop to 3:4 portrait from centre of video
const srcH = v.videoWidth * 4 / 3;
const srcW = v.videoWidth;
const sy = Math.max(0, (v.videoHeight - srcH) / 2);
ctx.drawImage(v, 0, sy, srcW, Math.min(srcH, v.videoHeight), 0, 0, 300, 400);
setCaptured(c.toDataURL("image/jpeg", 0.7));
};

return (
<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
<div style={{ background: "var(--dark2)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 6, padding: 24, maxWidth: 340, width: "100%", textAlign: "center" }}>
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 8 }}>📸 Your Photo</div>
<div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 14 }}>Take a quick selfie. It appears next to your name during voting and on the photo wall at breakfast.</div>
{error ? (
<div style={{ color: "var(--dim)", fontSize: ".82rem", fontStyle: "italic", marginBottom: 14 }}>{error}</div>
) : !captured ? (
<div style={{ marginBottom: 14 }}>
<video ref={videoRef} autoPlay playsInline style={{ width: 160, height: 213, borderRadius: 4, objectFit: "cover", border: "2px solid rgba(201,168,76,.3)", background: "#000", display: "block", margin: "0 auto" }} />
<canvas ref={canvasRef} style={{ display: "none" }} />
</div>
) : (
<div style={{ marginBottom: 14 }}>
<div style={{ display: "flex", justifyContent: "center" }}><GoldFrame src={captured} size={140} /></div>
<canvas ref={canvasRef} style={{ display: "none" }} />
</div>
)}
<div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
{!captured ? (
<button className="btn btn-gold btn-sm" onClick={capture} disabled={!streaming && !error}>📸 Take Photo</button>
) : (
<>
<button className="btn btn-gold btn-sm" onClick={() => onSave(captured)}>✓ Use This</button>
<button className="btn btn-outline btn-sm" onClick={() => setCaptured(null)}>↩ Retake</button>
</>
)}
<button className="btn btn-outline btn-sm" onClick={onClose}>Skip</button>
</div>
</div>
</div>
);
}


export { AvatarCapture };
