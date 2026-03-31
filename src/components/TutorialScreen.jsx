import { useState } from "react";
import { RULES_TUTORIAL } from "../constants/demoTutorial.jsx";

function TutorialScreen({ mode, step, setStep, setMode, onExit, CSS }) {
const slides = RULES_TUTORIAL;
const current = slides[step];
const isFirst = step === 0;
const isLast = step === slides.length - 1;

return (
<div className="app">
<style>{CSS}</style>
<div className="noise" />
<div className="z1">
<div className="hdr" style={{ padding: "20px 16px 12px" }}>
<div style={{ textAlign: "center", overflow: "visible" }}>
<div className="logo-title flicker" style={{
fontFamily: "'Cinzel Decorative',cursive",
fontSize: "clamp(2.4rem,8vw,5rem)",
fontWeight: 900,
color: "var(--gold)",
letterSpacing: ".06em",
lineHeight: .9,
WebkitFontSmoothing: "antialiased",
overflow: "visible",
display: "block",
paddingBottom: ".05em",
paddingTop: ".1em",
}}>The Traitors</div>
<div style={{
fontFamily: "'Cinzel Decorative',cursive",
fontSize: ".8rem",
fontWeight: 900,
letterSpacing: ".2em",
color: "var(--gold)",
textShadow: "0 0 20px rgba(201,168,76,.4)",
textTransform: "uppercase",
marginTop: 6,
}}>at home</div>
<div style={{
fontFamily: "'Crimson Text',serif",
fontSize: ".88rem",
fontStyle: "italic",
color: "var(--dim)",
letterSpacing: ".04em",
marginTop: 8,
}}>a party game of deception and murder</div>
</div>
</div>

    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,.3)" }}>
      <div style={{ flex: 1, padding: "10px", textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", borderBottom: "2px solid var(--gold)" }}>
        📜 Rules & Overview
      </div>
      <button onClick={onExit} style={{ padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".1em", color: "var(--dim)", textTransform: "uppercase" }}>← Exit</button>
    </div>

    <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "10px 16px 0", flexWrap: "wrap" }}>
      {slides.map((_, i) => (
        <div key={i} onClick={() => setStep(i)} style={{ width: i===step?16:6, height: 6, borderRadius: 3, background: i===step?"var(--gold)":i<step?"var(--gold2)":"rgba(201,168,76,.2)", transition: "all .25s", cursor: "pointer" }} />
      ))}
    </div>

    <div className="main" style={{ maxWidth: 480, paddingTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{current.icon}</div>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".18em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 2 }}>
            Rules Overview · {step + 1} of {slides.length}
          </div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "clamp(1rem,3vw,1.4rem)", color: "var(--gold)", fontWeight: 900 }}>{current.title}</div>
        </div>
      </div>

      <div style={{ background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.12)", borderRadius: 3, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: ".9rem", color: "var(--text)", lineHeight: 1.8, marginBottom: current.tip ? 8 : 0 }}>{current.body}</div>
        {current.tip && (
          <div style={{ borderTop: "1px solid rgba(201,168,76,.12)", paddingTop: 8, fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.65 }}>
            💡 {current.tip}
          </div>
        )}
      </div>

      <div style={{ background: "var(--dark2)", border: "1px solid var(--border)", borderRadius: 5, padding: 14, marginBottom: 18, boxShadow: "0 8px 32px rgba(0,0,0,.6), inset 0 1px 0 rgba(201,168,76,.06)" }}>
        <current.screen />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 40 }}>
        <button className="btn btn-outline btn-sm" onClick={() => isFirst ? onExit() : setStep(s => s - 1)} style={{ minWidth: 80 }}>
          {isFirst ? "← Exit" : "← Back"}
        </button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: ".65rem", color: "var(--dim2)" }}>{step + 1} / {slides.length}</div>
        {!isLast
          ? <button className="btn btn-gold" onClick={() => setStep(s => s + 1)}>Next →</button>
          : <button className="btn btn-gold" onClick={onExit}>Done →</button>
        }
      </div>
    </div>
  </div>
</div>

);
}


export { TutorialScreen };
