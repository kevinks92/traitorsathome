import { useState, useEffect, useRef } from "react";
import { GoldFrame } from "./GoldFrame.jsx";
import { RoleCard } from "./RoleCard.jsx";
import { BanishReveal } from "./BanishReveal.jsx";
import { RoomSelector } from "./RoomSelector.jsx";
import { GhostChat } from "./GhostChat.jsx";
import { save, load } from "../storage.js";
import { PHASES } from "../constants/phases.js";
import { PHASE_TIMERS } from "../constants/timers.js";
import { PHASE_INSTRUCTIONS, PHASE_STRIP } from "../constants/phases.js";
import { getQuip } from "../constants/quips.js";
import { MISSIONS, TRIVIA_BANK, NAME5_CATEGORIES, EMOJI_CIPHERS,
         WHISPER_PHRASES, LAST_WORD_CATEGORIES, RELIC_OBJECTS, HOT_TAKES } from "../constants/content.js";
import { SHIELD_MODE_LABELS, EMOJIS, genId, getEmoji, shuffleArray, shuffle } from "../utils/gameUtils.js";
import { generateWitnessQuestions } from "../utils/gameUtils.js";

function PhaseContent(props) {
const { game, me, myId, gameId, isHost, isTraitor, isSecretTraitor, isSeer, canJoinTraitorChat, hasTraitorRole, alivePlayers, aliveTraitors, selectedTarget, setSelectedTarget, selectedMission, setSelectedMission, missionFilter, setMissionFilter, myRoom, updateRoom, timerSec, timerMax, timerRunning, timerClass, fmtTime, timerPct, startTimer, chatDraft, setChatDraft, traitorChats, chatRef, stChats, stChatDraft, setStChatDraft, sendStChat, seerChats, seerDraft, setSeerDraft, sendSeerChat, recruitChats, recruitDraft, setRecruitDraft, sendRecruitChat, shortlist, setShortlist, dayTally, hasVotedDay, hasVotedNight, breakfastGroupIdx, endgameChoice, hostStartMission, awardPower, advanceTo, hostBeginNight, hostEndSeerPhase, hostEndSecretTraitorPhase, submitRecruitTarget, acceptRecruitment, declineRecruitment, recruitTarget, setRecruitTarget, resolveNight, resolveBanishment, advanceBreakfastGroup, advanceFromBreakfast, revealBreakfast, submitDayVote, submitNightVote, submitTwoTraitorRecruitChoice, submitTwoTraitorTarget, submitShortlist, sendChat, submitEndgameVote, resetGame, goBackPhase, manualKillPlayer, manualRevivePlayer, avatars, releaseRoles, finishRoleReveal, stRevealPlayer, stAdvanceToNext, stSkipSelection, stRevealResult, phaseTimers, seerTarget, setSeerTarget, seerResult, useSeerPower, seerLocked, setSeerLocked, seerExplain,
  dmTriviaQ, setDmTriviaQ, dmTriviaScores, setDmTriviaScores, dmTriviaBank,
  dmBuzzerWinner, setDmBuzzerWinner, dmForbiddenWords, dmForbiddenElim, setDmForbiddenElim,
  dmAuctionBids, setDmAuctionBids, dmAuctionRevealed, setDmAuctionRevealed,
  dmWhisperPhrase, dmEmojiIdx, dmName5Idx, dmName5Round, dmName5Scores, setDmName5Scores, setDmName5Round,
  castleMsg, addMsg, setGame, endGameFinal, revealEndgameVote,
  dmRpsBracket, setDmRpsBracket, dmRpsRound, dmHotTakeIdx, dmHotTakeVotes, setDmHotTakeVotes,
  dmDrawWinner, setDmDrawWinner, dmWitnessQs, dmWitnessQ, setDmWitnessQ,
  dmWitnessScores, setDmWitnessScores, dmSecretBallotVotes, setDmSecretBallotVotes,
  dmLastWordCat, setDmLastWordCat, dmLastWordElim, setDmLastWordElim,
  dmRelicObject, setDmRelicObject, startGame, deadPlayers } = props;
const [showPowers, setShowPowers] = useState(false);
const [ghostTab, setGhostTab] = useState("turret");
const [pendingShieldId, setPendingShieldId] = useState(null);
const [showPlayerList, setShowGameState] = useState(false);
const pt = phaseTimers || PHASE_TIMERS; // scaled timers for this game
const isRecruitTarget = game.recruitTargetId === myId;
const p = game.phase;
const instr = PHASE_INSTRUCTIONS[p];
const quip = p === PHASES.LOBBY ? "" : getQuip([PHASES.NIGHT_SEQUESTER, PHASES.NIGHT_SEER, PHASES.NIGHT_RECRUIT, PHASES.NIGHT_RECRUIT_RESPONSE, PHASES.NIGHT_SECRET_TRAITOR, PHASES.NIGHT_TRAITOR_CHAT].includes(p) ? "night_sequester" : p === PHASES.BREAKFAST ? "breakfast" : p.replace("_", " ").split(" ")[0].toLowerCase() || p);
const nightVoteCount = Object.keys(game.nightVotes || {}).length;
const dayVoteCount = Object.keys(game.dayVotes || {}).length;
const breakfastGroups = game.breakfastGroups || [];
const currentGroup = breakfastGroups[breakfastGroupIdx];
const isLastBreakfastGroup = breakfastGroupIdx >= breakfastGroups.length - 1;

return (
<>
{/* HOST PANEL */}
{isHost && instr && (
<div className="card host" style={{ marginTop: 16 }}>
<div className="host-label">⚜ Host · {instr.title}</div>
{/* Timer */}
<div className="timer-wrap">
<div className="timer-top">
<span className="timer-label">Phase Timer</span>
<span className="timer-num">{fmtTime(timerSec)}</span>
</div>
<div className="timer-bar">
<div className="timer-fill" style={{ width: `${timerPct}%` }} />
</div>
{pt[p] && (
<div style={{ fontSize: ".65rem", fontFamily: "'Cinzel',serif", color: "var(--gold2)", textAlign: "center", marginTop: 6, letterSpacing: ".1em" }}>
Recommended: <strong style={{ color: "var(--gold)" }}>{pt[p]} min</strong>
<button className="btn btn-outline btn-sm" style={{ marginLeft: 8, padding: "2px 8px", fontSize: ".6rem" }} onClick={() => startTimer(pt[p] * 60)}>Set →</button>
</div>
)}
<div className="row" style={{ marginTop: 8, gap: 6 }}>
{[2, 5, 8, 12, 18, 25].map(m => <button key={m} className="btn btn-outline btn-sm" onClick={() => startTimer(m * 60)}>{m}m</button>)}
</div>
</div>
{/* Quip */}
{quip && <div className="quip" style={{ marginBottom: 16 }}><span style={{ marginLeft: 14 }}>{quip}</span></div>}
{/* Instructions */}
<ul className="inst-list" style={{ marginBottom: 18 }}>
{instr.steps.map((s, i) => (
<li key={i} className="inst-item"><span className="inst-num">{i + 1}</span><span>{s}</span></li>
))}
</ul>
{/* Phase-specific host controls */}
{p === PHASES.SECRET_TRAITOR_SELECTION && (() => {
const players = game.players || [];
const idx = game.stSelectionIdx || 0;
const currentPlayer = players[idx];
const isLast = idx >= players.length - 1;
const alreadyRevealed = idx > 0;
return (
<div className="col">
<div className="info-box purple" style={{ fontSize: ".95rem", lineHeight: 1.75 }}>
Players stand in front of the group one at a time and look at their phone. Tap <strong style={{ color: "#d88ef0" }}>Reveal</strong> — their screen will show whether they are the Secret Traitor. Everyone watches their face. Only one will know the truth.
</div>
{currentPlayer && (
<div style={{ background: "rgba(60,0,80,.2)", border: "1px solid rgba(120,40,180,.4)", borderRadius: 4, padding: 20, textAlign: "center" }}>
<div style={{ fontSize: ".65rem", fontFamily: "'Cinzel',serif", letterSpacing: ".2em", textTransform: "uppercase", color: "#c090ff", marginBottom: 10 }}>
Now Standing: Player {idx + 1} of {players.length}
</div>
<div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{currentPlayer.emoji}</div>
<div style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", color: "var(--text)", marginBottom: 16 }}>{currentPlayer.name}</div>
<div className="info-box purple" style={{ marginBottom: 16, fontSize: ".85rem" }}>
{currentPlayer.id === game.stCandidateId
? <span style={{ color: "#f0a0ff" }}>⚠️ This IS the Secret Traitor. Their screen will show a dramatic reveal. Watch their face.</span>
: <span>Their screen will show they are NOT the Secret Traitor.</span>}
</div>
<button className="btn btn-night btn-lg" style={{ width: "100%", marginBottom: 10 }} onClick={() => stRevealPlayer(currentPlayer.id)}>
👁️ Reveal to {currentPlayer.name}
</button>
<button className="btn btn-outline btn-sm" style={{ width: "100%" }} onClick={stAdvanceToNext}>
{isLast ? "All Done — Proceed to Role Reveal →" : `Next Player → (${players[idx + 1]?.name})`}
</button>
</div>
)}
<button className="btn btn-ghost btn-sm" onClick={stSkipSelection} style={{ alignSelf: "flex-start" }}>Skip ceremony & go straight to Role Reveal</button>
</div>
);
})()}
{/* Phase-specific host controls */}
{p === PHASES.ROLE_REVEAL && (() => {
const step = game.roleRevealStep || "tapping";
const traitors = (game.players || []).filter(pl => pl.role === "traitor");
const secretTraitor = (game.players || []).find(pl => pl.role === "secret_traitor");
return (
<>
{/* STEP 1: TAPPING */}
{step === "tapping" && (
<div className="col">
<div className="info-box" style={{ borderColor: "rgba(201,168,76,.3)", fontSize: ".95rem", lineHeight: 1.75 }}>
Everyone blindfolded, phones face-down. Walk behind each <strong style={{ color: "var(--gold)" }}>regular Traitor</strong> and tap them <strong style={{ color: "var(--gold)" }}>twice on the shoulder</strong>. Do not tap the Faithful or the Secret Traitor — the ST already knows their role from the ceremony.
</div>
<div style={{ background: "rgba(139,26,26,.12)", border: "1px solid var(--crim-border)", borderRadius: 4, padding: 16 }}>
<div className="label" style={{ color: "var(--crim3)", marginBottom: 10 }}>Tap TWICE — Regular Traitors Only</div>
<div className="pgrid">
{traitors.map(pl => (
<div key={pl.id} className="pcard" style={{ borderColor: "rgba(139,26,26,.5)", background: "rgba(139,26,26,.1)" }}>
<div className="pavatar">{pl.emoji}</div>
<div className="pname">{pl.name}</div>
<div className="prole role-t">Traitor</div>
</div>
))}
{secretTraitor && (
<div className="pcard" style={{ borderColor: "rgba(120,0,140,.3)", background: "rgba(80,0,100,.08)", opacity: .6 }}>
<div className="pavatar">{secretTraitor.emoji}</div>
<div className="pname">{secretTraitor.name}</div>
<div className="prole role-s">Secret Traitor</div>
<div style={{ fontSize: ".62rem", color: "#d88ef0", marginTop: 4, fontStyle: "italic" }}>Do NOT tap — already selected</div>
</div>
)}
</div>
{secretTraitor && (
<div className="info-box purple" style={{ marginTop: 12, fontSize: ".85rem" }}>
The Secret Traitor was identified in their own ceremony — skip them here.
</div>
)}
</div>
<button className="btn btn-gold next-phase-btn" onClick={releaseRoles}>
Tapping Done — Release Roles →
</button>
</div>
)}

            {/* STEP 2: SILENCE */}
            {step === "silence" && (
              <div className="col">
                <div className="info-box" style={{ textAlign: "center", fontSize: "1rem", lineHeight: 1.8 }}>
                  Say: <strong style={{ color: "var(--gold)" }}>"Blindfolds off. Look around. Say nothing."</strong><br />
                  60 seconds of silence — everyone looks at each other. No phones yet.<br />
                  <span style={{ fontSize: ".9rem", color: "var(--dim)" }}>After 60 seconds, say: "Check your phone. Not a word."</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "3rem", color: timerClass === "urgent" ? "var(--crim3)" : timerClass === "warn" ? "#e0a040" : "var(--gold)" }}>{fmtTime(timerSec)}</div>
                  <div className="label" style={{ textAlign: "center" }}>silence timer — no phones yet</div>
                </div>
                <button className="btn btn-gold next-phase-btn" onClick={finishRoleReveal}>
                  60s Done — "Check your phone. Not a word." →
                </button>
              </div>
            )}

            {/* STEP 3: DONE — now just advance */}
            {step === "done" && (
              <div className="col">
                <div className="info-box" style={{ textAlign: "center" }}>
                  Everyone has read their role. Traitors are composing themselves. Faithful are already suspicious of the wrong person. Whenever you're ready — begin.
                </div>
                <button className="btn btn-gold next-phase-btn" onClick={() => advanceTo(PHASES.MISSION_BRIEFING)}>
                  Everyone's Ready — Begin the Game →
                </button>
              </div>
            )}
          </>
        );
      })()}
      {p === PHASES.MISSION_BRIEFING && (
        <>
          <div className="label">Select a mission</div>
          {(game.daggerMissionId || game.seerMissionId) && (
            <div style={{ fontSize: ".78rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 8 }}>
              {!game.daggerAwarded && game.daggerMissionId && <span style={{ color: "var(--crim3)", marginRight: 10 }}>🗡️ Dagger assigned to a mission below</span>}
              {!game.seerAwarded && game.seerMissionId && <span style={{ color: "#dd88ff" }}>👁️ Seer assigned to a mission below</span>}
            </div>
          )}
          <div className="type-filters">
            {["all", "digital", "analog", "trivia", "social", "physical", "puzzle", "luck", "drama"].map(t => (
              <button key={t} className={`tf ${missionFilter === t ? "active" : ""}`} onClick={() => setMissionFilter(t)}>{t}</button>
            ))}
          </div>
          <div className="mission-grid">
            {MISSIONS.filter(m => missionFilter === "all" || (missionFilter === "digital" && m.digital) || (missionFilter === "analog" && !m.digital) || m.type === missionFilter).map(m => {
              const isDagger = game.daggerMissionId === m.id && !game.daggerAwarded;
              const isSeer = game.seerMissionId === m.id && !game.seerAwarded;
              const halfwayRound = Math.ceil((game.totalRounds || 6) / 2);
              const isWitnessLocked = m.id === "m25" && (game.currentRound || 1) < halfwayRound;
              return (
                <div key={m.id} className={`mc ${selectedMission === m.id ? "sel" : ""} ${isWitnessLocked ? "locked" : ""}`}
                  onClick={() => !isWitnessLocked && setSelectedMission(m.id)}
                  style={{ ...(isDagger ? { borderColor: "rgba(139,26,26,.5)" } : isSeer ? { borderColor: "rgba(120,0,180,.4)" } : {}), ...(isWitnessLocked ? { opacity: .45, cursor: "not-allowed" } : {}) }}>
                  <div className="mc-icon">{m.icon}</div>
                  <div className="mc-name">
                    {m.name}
                    {isDagger && <span style={{ marginLeft: 5, color: "var(--crim3)", fontSize: ".65rem" }}>🗡️</span>}
                    {isSeer && <span style={{ marginLeft: 5, color: "#dd88ff", fontSize: ".65rem" }}>👁️</span>}
                    {isWitnessLocked && <span style={{ marginLeft: 5, color: "var(--dim)", fontSize: ".6rem" }}>🔒 Round {halfwayRound}+</span>}
                  </div>
                  <div className="mc-type">{m.type} · {m.time}m</div>
                  <div className="mc-shield">
                    {isDagger ? "🗡️ Awards the Dagger (one per game)" : isSeer ? "👁️ Awards the Seer (one per game)" : SHIELD_MODE_LABELS[m.shieldMode]}
                  </div>
                  <div className="mc-desc">{isWitnessLocked ? `Locked until Round ${halfwayRound} — not enough game history yet.` : m.desc}</div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-gold next-phase-btn" style={{ marginTop: 14 }} onClick={hostStartMission} disabled={!selectedMission}>Begin Mission →</button>
        </>
      )}
      {p === PHASES.MISSION_ACTIVE && (
        <>
          {game.currentMission && (() => {
            const m = MISSIONS.find(x => x.id === game.currentMission);
            if (!m) return null;

            // Determine what this mission awards based on game assignments
            const isDaggerMission = game.daggerMissionId === m.id && !game.daggerAwarded;
            const isSeerMission = game.seerMissionId === m.id && !game.seerAwarded;
            const daggerAlreadyGone = game.daggerMissionId === m.id && game.daggerAwarded;
            const seerAlreadyGone = game.seerMissionId === m.id && game.seerAwarded;

            // Dynamic shield count: random 1-4, capped at 25% of alive players
            const alive = alivePlayers.length;
            const maxShields = Math.max(1, Math.floor(alive * 0.25));
            const shieldCount = Math.min(maxShields, Math.floor(Math.random() * 4) + 1);
            // Use seeded value so it's consistent (based on round + mission id)
            const seed = (game.currentRound || 1) + m.id.charCodeAt(1);
            const seededShieldCount = Math.max(1, Math.min(maxShields, (seed % 4) + 1));

            const hostJudged = isDaggerMission || isSeerMission || ["hidden_winner"].includes(m.shieldMode);
            const awardLabel = isDaggerMission ? "🗡️ Dagger Mission — Award the Dagger" : isSeerMission ? "👁️ Seer Mission — Award the Seer Power (secretly)" : `🛡️ Award up to ${seededShieldCount} Shield${seededShieldCount > 1 ? "s" : ""} (max 25% of ${alive} players)`;

            // ── Award bar (used at bottom of every digital mission) ──
            const AwardBar = () => (
              <div style={{ marginTop: 10 }}>
                {isDaggerMission && <div style={{ background:"rgba(139,26,26,.1)",border:"1px solid rgba(139,26,26,.35)",borderRadius:3,padding:"7px 10px",marginBottom:8,fontSize:".78rem",color:"var(--crim3)" }}>🗡️ Dagger Mission — award the Dagger to the winner silently.</div>}
                {isSeerMission && <div style={{ background:"rgba(60,0,90,.15)",border:"1px solid rgba(120,0,180,.3)",borderRadius:3,padding:"7px 10px",marginBottom:8,fontSize:".78rem",color:"#dd88ff" }}>👁️ Seer Mission — award Seer silently. They will be notified privately.</div>}
                {daggerAlreadyGone && <div style={{ fontSize:".75rem",color:"var(--dim)",marginBottom:6,fontStyle:"italic" }}>🗡️ Dagger already awarded — award a shield instead.</div>}
                {seerAlreadyGone && <div style={{ fontSize:".75rem",color:"var(--dim)",marginBottom:6,fontStyle:"italic" }}>👁️ Seer already awarded — award a shield instead.</div>}
                {!isDaggerMission && !isSeerMission && <div style={{ fontSize:".72rem",color:"var(--gold2)",marginBottom:6 }}>🛡️ Up to {seededShieldCount} shield{seededShieldCount>1?"s":""} · {m.shieldMode==="public"||m.shieldMode==="all_know"?"📢 Announce publicly":m.shieldMode==="team_hidden"?"👥 Award team quietly":"🤫 Award silently"}</div>}
                <div className="label" style={{ fontSize:".62rem",marginBottom:6 }}>Award to winner:</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {alivePlayers.map(pl => (
                    <div key={pl.id} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                      <div style={{ fontSize:".85rem" }}>{pl.emoji}</div>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".5rem",color:"var(--dim)" }}>{pl.name}</div>
                      {isDaggerMission && !game.daggerAwarded && <button className="btn btn-ghost btn-sm" style={{ padding:"2px 6px",fontSize:".5rem" }} onClick={()=>awardPower(pl.id,"dagger")}>🗡️</button>}
                      {isSeerMission && !game.seerAwarded && <button className="btn btn-outline btn-sm" style={{ padding:"2px 6px",fontSize:".5rem",borderColor:"rgba(140,0,180,.4)",color:"#dd88ff" }} onClick={()=>awardPower(pl.id,"seer")}>👁️</button>}
                      {((!isDaggerMission&&!isSeerMission)||daggerAlreadyGone||seerAlreadyGone) && <button className="btn btn-outline btn-sm" style={{ padding:"2px 6px",fontSize:".5rem" }} onClick={()=>awardPower(pl.id,"shield",m.shieldMode)}>🛡️</button>}
                    </div>
                  ))}
                </div>
              </div>
            );

            // ── DIGITAL MISSION PANELS ──
            if (m.digitalType === "trivia_scored") {
              const q = dmTriviaBank[dmTriviaQ];
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>📜 Castle Trivia — Question {dmTriviaQ+1} of 10</div>
                    {q ? (<>
                      <div style={{ fontSize:"1rem",color:"var(--text)",lineHeight:1.6,marginBottom:10,fontWeight:600 }}>{q.q}</div>
                      <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:3,padding:"8px 12px",fontSize:".85rem",color:"var(--gold)",marginBottom:12 }}>✓ Answer: {q.a}</div>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",color:"var(--dim)",marginBottom:6 }}>Tap who got it correct:</div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
                        {alivePlayers.map(pl => {
                          const score = dmTriviaScores[pl.id] || 0;
                          return (
                            <button key={pl.id} onClick={() => setDmTriviaScores(s=>({...s,[pl.id]:(s[pl.id]||0)+1}))}
                              style={{ background:"rgba(40,80,40,.3)",border:"1px solid rgba(60,140,60,.4)",borderRadius:3,padding:"6px 10px",fontSize:".72rem",color:"#80e080",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                              <span>{pl.emoji}</span><span style={{ fontFamily:"'Cinzel',serif",fontSize:".5rem" }}>{pl.name}</span><span style={{ fontSize:".6rem",color:"var(--gold)" }}>+1 ({score})</span>
                            </button>
                          );
                        })}
                      </div>
                      <button className="btn btn-gold btn-sm" onClick={() => setDmTriviaQ(q=>Math.min(q+1,9))} disabled={dmTriviaQ>=9}>
                        {dmTriviaQ<9 ? "Next Question →" : "All Questions Done"}
                      </button>
                    </>) : <div style={{ color:"var(--dim)",fontStyle:"italic" }}>All 10 questions complete.</div>}
                    {/* Scoreboard */}
                    <div style={{ marginTop:12,borderTop:"1px solid rgba(201,168,76,.1)",paddingTop:10 }}>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".1em",color:"var(--gold2)",marginBottom:6 }}>SCORES</div>
                      {alivePlayers.slice().sort((a,b)=>(dmTriviaScores[b.id]||0)-(dmTriviaScores[a.id]||0)).map(pl => (
                        <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",padding:"3px 6px",fontSize:".78rem" }}>
                          <span style={{ color:"var(--dim)" }}>{pl.emoji} {pl.name}</span>
                          <span style={{ color:"var(--gold)",fontFamily:"'Cinzel',serif",fontWeight:700 }}>{dmTriviaScores[pl.id]||0}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "trivia_buzzer") {
              const q = dmTriviaBank[dmTriviaQ];
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>⚡ Lightning Round — Question {dmTriviaQ+1} of 10</div>
                    {q ? (<>
                      <div style={{ fontSize:"1rem",color:"var(--text)",lineHeight:1.6,marginBottom:10,fontWeight:600 }}>{q.q}</div>
                      <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:3,padding:"8px 12px",fontSize:".85rem",color:"var(--gold)",marginBottom:12 }}>✓ Answer: {q.a}</div>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",color:"var(--dim)",marginBottom:6 }}>First to shout the correct answer — tap who got it:</div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
                        {alivePlayers.map(pl => {
                          const score = dmTriviaScores[pl.id] || 0;
                          return (
                            <button key={pl.id} onClick={() => { setDmTriviaScores(s=>({...s,[pl.id]:(s[pl.id]||0)+1})); setDmBuzzerWinner(pl.id); setTimeout(()=>{ setDmBuzzerWinner(null); setDmTriviaQ(q=>Math.min(q+1,9)); },1200); }}
                              style={{ background:dmBuzzerWinner===pl.id?"rgba(80,160,80,.4)":"rgba(40,20,60,.5)",border:`1px solid ${dmBuzzerWinner===pl.id?"rgba(80,160,80,.6)":"rgba(100,60,140,.3)"}`,borderRadius:3,padding:"8px 12px",fontSize:".75rem",color:dmBuzzerWinner===pl.id?"#80e080":"var(--text)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .2s" }}>
                              <span style={{ fontSize:"1.1rem" }}>{pl.emoji}</span>
                              <span style={{ fontFamily:"'Cinzel',serif",fontSize:".52rem" }}>{pl.name}</span>
                              <span style={{ fontSize:".65rem",color:"var(--gold)" }}>{score} pts</span>
                            </button>
                          );
                        })}
                      </div>
                      <button className="btn btn-outline btn-sm" onClick={() => setDmTriviaQ(q=>Math.min(q+1,9))}>Skip Question →</button>
                    </>) : <div style={{ color:"var(--dim)",fontStyle:"italic" }}>All questions done.</div>}
                    <div style={{ marginTop:12,borderTop:"1px solid rgba(201,168,76,.1)",paddingTop:10 }}>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".1em",color:"var(--gold2)",marginBottom:6 }}>SCORES</div>
                      {alivePlayers.slice().sort((a,b)=>(dmTriviaScores[b.id]||0)-(dmTriviaScores[a.id]||0)).map(pl => (
                        <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",padding:"3px 6px",fontSize:".78rem" }}>
                          <span style={{ color:"var(--dim)" }}>{pl.emoji} {pl.name}</span>
                          <span style={{ color:"var(--gold)",fontFamily:"'Cinzel',serif",fontWeight:700 }}>{dmTriviaScores[pl.id]||0}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "secret_ballot") {
              // Auto-poll votes every 3s
              useEffect(() => {
                const poll = async () => {
                  const v = {};
                  for (const pl of alivePlayers) {
                    const vote = await load(gameId+"-ballot-"+pl.id);
                    if (vote) v[pl.id] = vote;
                  }
                  setDmSecretBallotVotes(v);
                };
                poll();
                const t = setInterval(poll, 3000);
                return () => clearInterval(t);
              }, []);
              const votes = dmSecretBallotVotes;
              const tally = {};
              Object.values(votes).forEach(vid => { tally[vid] = (tally[vid]||0)+1; });
              const topScore = Math.max(0,...Object.values(tally));
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>🗳️ Secret Ballot — {Object.keys(votes).length}/{alivePlayers.length} votes cast</div>
                    <div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic",marginBottom:10 }}>Players vote privately on their phones for who they'd most protect. Results visible only here.</div>
                    <button className="btn btn-outline btn-sm" style={{ fontSize:".6rem",marginBottom:10 }} onClick={async()=>{
                      const v = {};
                      for (const pl of alivePlayers) {
                        const vote = await load(gameId+"-ballot-"+pl.id);
                        if (vote) v[pl.id] = vote;
                      }
                      setDmSecretBallotVotes(v);
                    }}>🔄 Refresh Votes</button>
                    <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                      {alivePlayers.slice().sort((a,b)=>(tally[b.id]||0)-(tally[a.id]||0)).map(pl => (
                        <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:(tally[pl.id]||0)===topScore&&topScore>0?"rgba(201,168,76,.08)":"transparent",borderRadius:3 }}>
                          <span style={{ color:"var(--dim)",fontSize:".82rem" }}>{pl.emoji} {pl.name}</span>
                          <span style={{ color:"var(--gold)",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:".85rem" }}>{tally[pl.id]||0} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "forbidden_word") {
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>🚫 Forbidden Word — {alivePlayers.length - dmForbiddenElim.length} remaining</div>
                    <div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic",marginBottom:10 }}>Each player's secret word is on their phone. Tap a player to eliminate them if they say their word.</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                      {alivePlayers.map(pl => {
                        const isElim = dmForbiddenElim.includes(pl.id);
                        return (
                          <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:isElim?"rgba(139,26,26,.1)":"rgba(255,255,255,.02)",borderRadius:3,opacity:isElim?.5:1 }}>
                            <div>
                              <span style={{ fontSize:".85rem" }}>{pl.emoji} </span>
                              <span style={{ fontFamily:"'Cinzel',serif",fontSize:".75rem",color:isElim?"var(--dim)":"var(--text)",textDecoration:isElim?"line-through":"none" }}>{pl.name}</span>
                              <span style={{ fontSize:".68rem",color:"var(--crim3)",marginLeft:8,fontFamily:"'Cinzel',serif" }}>word: {dmForbiddenWords[pl.id]||"?"}</span>
                            </div>
                            {!isElim && <button className="btn btn-crim btn-sm" style={{ fontSize:".52rem",padding:"3px 8px" }} onClick={()=>setDmForbiddenElim(e=>[...e,pl.id])}>✕ Eliminated</button>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "auction") {
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>🏺 Midnight Auction — {Object.keys(dmAuctionBids).length}/{alivePlayers.length} bids</div>
                    {/* Auto-poll bid count */}
                    {useEffect(() => {
                      if (dmAuctionRevealed) return;
                      const poll = async () => {
                        let count = 0;
                        for (const pl of alivePlayers) {
                          const b = await load(gameId+"-auction-bid-"+pl.id);
                          if (b != null) count++;
                        }
                        setDmAuctionBids(prev => ({ ...prev, _count: count }));
                      };
                      poll();
                      const t = setInterval(poll, 2000);
                      return () => clearInterval(t);
                    }, [dmAuctionRevealed]) || null}
                    <div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic",marginBottom:10 }}>Players submit bids (1--10) on their phones. Once all bids are in, reveal simultaneously.</div>
                    {!dmAuctionRevealed ? (
                      <>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
                          {alivePlayers.map(pl => (
                            <div key={pl.id} style={{ background:dmAuctionBids[pl.id]!=null?"rgba(201,168,76,.1)":"rgba(255,255,255,.03)",border:"1px solid rgba(201,168,76,.2)",borderRadius:3,padding:"6px 10px",textAlign:"center" }}>
                              <div style={{ fontSize:".9rem" }}>{pl.emoji}</div>
                              <div style={{ fontFamily:"'Cinzel',serif",fontSize:".5rem",color:"var(--dim)" }}>{pl.name}</div>
                              <div style={{ color:dmAuctionBids[pl.id]!=null?"var(--gold)":"var(--dim)",fontSize:".7rem",marginTop:2 }}>{dmAuctionBids[pl.id]!=null?"✓ Bid in":"waiting…"}</div>
                            </div>
                          ))}
                        </div>
                        <button className="btn btn-gold btn-sm" onClick={async()=>{
                          const bids = {};
                          for (const pl of alivePlayers) {
                            const b = await load(gameId+"-auction-bid-"+pl.id);
                            if (b != null) bids[pl.id] = b;
                          }
                          setDmAuctionBids(bids); setDmAuctionRevealed(true);
                        }}>Reveal All Bids →</button>
                      </>
                    ) : (
                      <>
                        <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:10 }}>
                          {alivePlayers.slice().sort((a,b)=>(dmAuctionBids[b.id]||0)-(dmAuctionBids[a.id]||0)).map(pl => {
                            const bid = dmAuctionBids[pl.id]||"?";
                            const topBid = Math.max(...Object.values(dmAuctionBids).map(Number));
                            const isWinner = Number(bid)===topBid;
                            return (
                              <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:isWinner?"rgba(201,168,76,.12)":"rgba(255,255,255,.02)",borderRadius:3,border:isWinner?"1px solid rgba(201,168,76,.3)":"1px solid transparent" }}>
                                <span style={{ color:"var(--dim)",fontSize:".82rem" }}>{pl.emoji} {pl.name}</span>
                                <span style={{ color:isWinner?"var(--gold)":"var(--dim)",fontFamily:"'Cinzel',serif",fontWeight:isWinner?700:400,fontSize:".9rem" }}>{bid}{isWinner?" 🏆":""}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "whisper_chain") {
              const alive = alivePlayers;
              const half = Math.ceil(alive.length/2);
              const team1 = alive.slice(0,half);
              const team2 = alive.slice(half);
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>👂 Whisper Chain</div>
                    <div style={{ background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)",borderRadius:3,padding:"8px 12px",marginBottom:10 }}>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",color:"var(--gold2)",marginBottom:4 }}>THE PHRASE (only you can see this):</div>
                      <div style={{ fontSize:".95rem",color:"var(--gold)",fontWeight:700,lineHeight:1.5 }}>"{dmWhisperPhrase}"</div>
                    </div>
                    <div style={{ display:"flex",gap:8,marginBottom:10 }}>
                      {[{t:"Team 1",pl:team1},{t:"Team 2",pl:team2}].map(({t,pl},ti) => (
                        <div key={ti} style={{ flex:1,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:3,padding:"8px 10px" }}>
                          <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",color:"var(--gold2)",marginBottom:6 }}>{t}</div>
                          {pl.map((p,i)=>(
                            <div key={p.id} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4,fontSize:".75rem",color:i===0?"var(--gold)":"var(--dim)" }}>
                              <span>{p.emoji}</span><span>{p.name}</span>{i===0&&<span style={{ fontSize:".5rem",color:"var(--gold)",fontFamily:"'Cinzel',serif" }}>← receives phrase</span>}
                            </div>
                          ))}
                          <button className="btn btn-gold btn-sm" style={{ marginTop:6,width:"100%",fontSize:".55rem" }} onClick={async()=>{ await save(gameId+"-whisper-"+ti, dmWhisperPhrase); }}>📤 Send Phrase to {pl[0]?.name}</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:".78rem",color:"var(--dim)",fontStyle:"italic" }}>After both chains complete, judge which team's final answer is closest. Award shields to each winning team member.</div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "emoji_cipher") {
              const cipher = EMOJI_CIPHERS[dmEmojiIdx];
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>📱 Emoji Cipher</div>
                    <div style={{ textAlign:"center",fontSize:"2.5rem",letterSpacing:".2em",marginBottom:12,padding:"12px 0",background:"rgba(255,255,255,.02)",borderRadius:4 }}>{cipher?.emoji}</div>
                    <div style={{ background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)",borderRadius:3,padding:"8px 12px",marginBottom:10 }}>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",color:"var(--gold2)",marginBottom:4 }}>ANSWER (only you see this):</div>
                      <div style={{ fontSize:".9rem",color:"var(--gold)",fontWeight:700 }}>"{cipher?.answer}"</div>
                    </div>
                    <div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic" }}>Players see the emoji on their phones. First to whisper the correct answer to you wins. Award the shield silently.</div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "name5") {
              const cat = NAME5_CATEGORIES[dmName5Idx];
              const cats = [cat, ...NAME5_CATEGORIES.filter((_,i)=>i!==dmName5Idx).sort(()=>Math.random()-.5).slice(0,4)];
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>⏱️ Name 5 in 30 — Round {dmName5Round+1} of 5</div>
                    <div style={{ background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",borderRadius:4,padding:"12px 16px",marginBottom:10,textAlign:"center" }}>
                      <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.1rem",color:"var(--gold)",lineHeight:1.4 }}>{cats[dmName5Round]?.cat}</div>
                      <div style={{ fontSize:".7rem",color:"var(--dim)",marginTop:6,fontStyle:"italic" }}>e.g. {cats[dmName5Round]?.ex?.slice(0,3).join(", ")}</div>
                    </div>
                    <div style={{ fontSize:".8rem",color:"var(--dim)",fontStyle:"italic",marginBottom:10 }}>First to shout 5 valid answers wins the round. Tap the winner:</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
                      {alivePlayers.map(pl => (
                        <button key={pl.id} onClick={async() => { 
                          const newRound = Math.min(dmName5Round+1,4);
                          setDmName5Scores(s=>({...s,[pl.id]:(s[pl.id]||0)+1})); 
                          setDmName5Round(newRound);
                          // Push next category to player phones
                          const nextIdx = (dmName5Idx + newRound) % NAME5_CATEGORIES.length;
                          if (newRound < 5) await save(gameId+"-name5-cat", NAME5_CATEGORIES[nextIdx].cat);
                        }}
                          style={{ background:"rgba(40,20,60,.5)",border:"1px solid rgba(100,60,140,.3)",borderRadius:3,padding:"6px 10px",fontSize:".72rem",color:"var(--text)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                          <span>{pl.emoji}</span>
                          <span style={{ fontFamily:"'Cinzel',serif",fontSize:".5rem" }}>{pl.name}</span>
                          <span style={{ color:"var(--gold)",fontSize:".62rem" }}>{dmName5Scores[pl.id]||0} wins</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ borderTop:"1px solid rgba(201,168,76,.1)",paddingTop:8,display:"flex",flexWrap:"wrap",gap:6 }}>
                      {alivePlayers.slice().sort((a,b)=>(dmName5Scores[b.id]||0)-(dmName5Scores[a.id]||0)).map(pl=>(
                        <span key={pl.id} style={{ fontSize:".72rem",color:"var(--dim)" }}>{pl.emoji} {dmName5Scores[pl.id]||0}</span>
                      ))}
                    </div>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "rps_bracket") {
              const players = dmRpsBracket;
              // Build current round matchups
              const roundSize = Math.pow(2, Math.ceil(Math.log2(players.length)));
              const padded = [...players, ...Array(roundSize-players.length).fill("bye")];
              const matchups = [];
              for(let i=0;i<padded.length;i+=2) matchups.push([padded[i],padded[i+1]]);
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>✊ Rock Paper Scissors Tournament — {players.length} players remaining</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:10 }}>
                      {matchups.map(([a,b],i) => {
                        const pa = alivePlayers.find(p=>p.id===a);
                        const pb = alivePlayers.find(p=>p.id===b);
                        if (!pa && !pb) return null;
                        if (!pb || b==="bye") return (
                          <div key={i} style={{ padding:"8px 10px",background:"rgba(201,168,76,.04)",borderRadius:3,fontSize:".78rem",color:"var(--dim)" }}>
                            {pa?.emoji} {pa?.name} — advances automatically (bye)
                          </div>
                        );
                        // Push this matchup to player phones
                        useEffect(() => {
                          if (pa && pb) save(gameId+"-rps-matchup", {p1:a, p2:b});
                        }, [a, b]);
                        return (
                          <div key={i} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:3,padding:"10px 12px",display:"flex",alignItems:"center",gap:8 }}>
                            <button onClick={()=>{ setDmRpsBracket(br=>br.filter(id=>id!==b)); save(gameId+"-rps-matchup", null); }}
                              style={{ flex:1,background:"rgba(40,20,60,.6)",border:"1px solid rgba(120,60,180,.4)",borderRadius:3,padding:"8px",cursor:"pointer",color:"var(--text)",fontSize:".78rem",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                              <span style={{ fontSize:"1.2rem" }}>{pa?.emoji}</span>
                              <span style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem" }}>{pa?.name}</span>
                              <span style={{ fontSize:".5rem",color:"#80e080" }}>← Wins</span>
                            </button>
                            <div style={{ fontFamily:"'Cinzel',serif",fontSize:".7rem",color:"var(--dim)" }}>vs</div>
                            <button onClick={()=>{ setDmRpsBracket(br=>br.filter(id=>id!==a)); save(gameId+"-rps-matchup", null); }}
                              style={{ flex:1,background:"rgba(40,20,60,.6)",border:"1px solid rgba(120,60,180,.4)",borderRadius:3,padding:"8px",cursor:"pointer",color:"var(--text)",fontSize:".78rem",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                              <span style={{ fontSize:"1.2rem" }}>{pb?.emoji}</span>
                              <span style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem" }}>{pb?.name}</span>
                              <span style={{ fontSize:".5rem",color:"#80e080" }}>← Wins</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {players.length===1 && (() => {
                      const champ = alivePlayers.find(p=>p.id===players[0]);
                      return <div style={{ textAlign:"center",padding:"10px",background:"rgba(201,168,76,.1)",borderRadius:3,fontFamily:"'Cinzel',serif",color:"var(--gold)" }}>🏆 Champion: {champ?.emoji} {champ?.name}</div>;
                    })()}
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "hot_take") {
              const take = HOT_TAKES[dmHotTakeIdx];
              const votes = dmHotTakeVotes;
              // Auto-poll votes every 3s
              useEffect(() => {
                const poll = async () => {
                  const v = {};
                  for (const pl of alivePlayers) {
                    const vote = await load(gameId+"-hottake-"+pl.id);
                    if (vote) v[pl.id] = vote;
                  }
                  setDmHotTakeVotes(v);
                };
                poll();
                const t = setInterval(poll, 3000);
                return () => clearInterval(t);
              }, []);
              const agree = Object.values(votes).filter(v=>v==="agree").length;
              const disagree = Object.values(votes).filter(v=>v==="disagree").length;
              const majority = agree > disagree ? "agree" : disagree > agree ? "disagree" : null;
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>🔥 Hot Take</div>
                    <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:4,padding:"14px 16px",marginBottom:12,fontSize:"1rem",color:"var(--text)",lineHeight:1.6,textAlign:"center",fontStyle:"italic" }}>"{take}"</div>
                    <div style={{ display:"flex",gap:8,marginBottom:10,fontSize:".72rem",color:"var(--dim)" }}>
                      <div style={{ flex:1,textAlign:"center",color:"#80e080" }}>✓ Agree: {agree}</div>
                      <div style={{ flex:1,textAlign:"center",color:"var(--crim3)" }}>✗ Disagree: {disagree}</div>
                      <div style={{ flex:1,textAlign:"center",color:"var(--dim)" }}>Waiting: {alivePlayers.length-Object.keys(votes).length}</div>
                    </div>
                    {majority && <div style={{ textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:".75rem",color:majority==="agree"?"#80e080":"var(--crim3)",marginBottom:8 }}>Majority: {majority==="agree"?"AGREE ✓":"DISAGREE ✗"} — award shields to {majority} voters</div>}
                    <div style={{ display:"flex",flexDirection:"column",gap:4,marginBottom:10 }}>
                      {alivePlayers.map(pl=>(
                        <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 8px",fontSize:".78rem" }}>
                          <span style={{ color:"var(--dim)" }}>{pl.emoji} {pl.name}</span>
                          <span style={{ color:votes[pl.id]==="agree"?"#80e080":votes[pl.id]==="disagree"?"var(--crim3)":"var(--dim)",fontStyle:!votes[pl.id]?"italic":"normal" }}>{votes[pl.id]||"waiting…"}</span>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-outline btn-sm" style={{ fontSize:".6rem" }} onClick={async()=>{
                      const v = {};
                      for (const pl of alivePlayers) {
                        const vote = await load(gameId+"-hottake-"+pl.id);
                        if (vote) v[pl.id] = vote;
                      }
                      setDmHotTakeVotes(v);
                    }}>🔄 Refresh Votes</button>
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "the_draw") {
              const winner = alivePlayers.find(p=>p.id===dmDrawWinner);
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>🎴 The Draw</div>
                    <div style={{ fontSize:".85rem",color:"var(--dim)",fontStyle:"italic",marginBottom:12 }}>The app has already selected a winner at random. Only you can see this. The winner received a silent notification on their phone.</div>
                    {winner && (
                      <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:4,padding:"14px",textAlign:"center" }}>
                        <div style={{ fontSize:"2rem",marginBottom:6 }}>{winner.emoji}</div>
                        <div style={{ fontFamily:"'Cinzel',serif",fontSize:"1rem",color:"var(--gold)" }}>{winner.name}</div>
                        <div style={{ fontSize:".72rem",color:"var(--dim)",marginTop:4,fontStyle:"italic" }}>has already been privately notified.</div>
                      </div>
                    )}
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "the_witness") {
              const qs = dmWitnessQs;
              const q = qs[dmWitnessQ];
              const scores = dmWitnessScores;
              const maxScore = Math.max(0,...Object.values(scores));
              const leaders = alivePlayers.filter(p=>(scores[p.id]||0)===maxScore&&maxScore>0);
              const isTie = leaders.length > 1;
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(80,0,120,.35)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"#dd88ff",marginBottom:8 }}>👁️ The Witness — Question {Math.min(dmWitnessQ+1,qs.length)} of {Math.min(qs.length,5)}</div>
                    {qs.length === 0 ? (
                      <div style={{ color:"var(--dim)",fontStyle:"italic",fontSize:".85rem" }}>Not enough game history yet. This mission must be played after the halfway point. Play a different mission this round.</div>
                    ) : q ? (<>
                      <div style={{ fontSize:".95rem",color:"var(--text)",lineHeight:1.6,marginBottom:10,fontWeight:600 }}>{q.q}</div>
                      <div style={{ background:"rgba(80,0,120,.15)",border:"1px solid rgba(120,0,180,.3)",borderRadius:3,padding:"8px 12px",fontSize:".85rem",color:"#dd88ff",marginBottom:10 }}>✓ Answer: {q.a}</div>
                      <div style={{ fontSize:".78rem",color:"var(--dim)",fontStyle:"italic",marginBottom:8 }}>Players answered privately on their phones. Mark who got it right:</div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
                        {alivePlayers.map(pl=>(
                          <button key={pl.id} onClick={()=>setDmWitnessScores(s=>({...s,[pl.id]:(s[pl.id]||0)+1}))}
                            style={{ background:"rgba(40,0,60,.6)",border:"1px solid rgba(100,0,160,.4)",borderRadius:3,padding:"6px 10px",fontSize:".72rem",color:"#c080ff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                            <span>{pl.emoji}</span>
                            <span style={{ fontFamily:"'Cinzel',serif",fontSize:".5rem" }}>{pl.name}</span>
                            <span style={{ fontSize:".62rem",color:"#dd88ff" }}>{scores[pl.id]||0} pts</span>
                          </button>
                        ))}
                      </div>
                      <button className="btn btn-outline btn-sm" style={{ borderColor:"rgba(120,0,180,.4)",color:"#dd88ff" }} onClick={()=>setDmWitnessQ(q=>q+1)}>
                        {dmWitnessQ < Math.min(qs.length,5)-1 ? "Next Question →" : isTie ? "Tiebreaker →" : "Results →"}
                      </button>
                    </>) : (<>
                      <div style={{ marginBottom:10 }}>
                        <div style={{ fontFamily:"'Cinzel',serif",fontSize:".65rem",color:"#dd88ff",marginBottom:8 }}>FINAL SCORES</div>
                        {alivePlayers.slice().sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0)).map(pl=>(
                          <div key={pl.id} style={{ display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:".82rem" }}>
                            <span style={{ color:(scores[pl.id]||0)===maxScore&&maxScore>0?"#dd88ff":"var(--dim)" }}>{pl.emoji} {pl.name}</span>
                            <span style={{ color:"#dd88ff",fontFamily:"'Cinzel',serif",fontWeight:700 }}>{scores[pl.id]||0}</span>
                          </div>
                        ))}
                      </div>
                      {isTie && <div style={{ fontSize:".78rem",color:"var(--dim)",fontStyle:"italic",marginBottom:8 }}>Tied! Use tiebreaker question before awarding.</div>}
                      {!isTie && leaders[0] && (
                        <div style={{ background:"rgba(80,0,120,.15)",border:"1px solid rgba(120,0,180,.3)",borderRadius:3,padding:"10px",textAlign:"center",marginBottom:10 }}>
                          <div style={{ fontFamily:"'Cinzel',serif",fontSize:".7rem",color:"#dd88ff" }}>THE WITNESS: {leaders[0].emoji} {leaders[0].name}</div>
                          <div style={{ fontSize:".72rem",color:"var(--dim)",marginTop:4,fontStyle:"italic" }}>Tap Seer below to award privately. No announcement.</div>
                        </div>
                      )}
                    </>)}
                    {/* Scoreboard always visible */}
                    {qs.length>0 && q && (
                      <div style={{ marginTop:8,borderTop:"1px solid rgba(120,0,180,.2)",paddingTop:8,display:"flex",flexWrap:"wrap",gap:8 }}>
                        {alivePlayers.slice().sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0)).map(pl=>(
                          <span key={pl.id} style={{ fontSize:".72rem",color:"var(--dim)" }}>{pl.emoji} {scores[pl.id]||0}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "last_word") {
              const cats = [...LAST_WORD_CATEGORIES].sort(()=>Math.random()-.5);
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>💬 Last Word — {alivePlayers.length - dmLastWordElim.length} remaining</div>
                    <div style={{ background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",borderRadius:4,padding:"14px 16px",marginBottom:10,textAlign:"center" }}>
                      <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:6 }}>Current Category</div>
                      <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.2rem",color:"var(--gold)",lineHeight:1.4 }}>{dmLastWordCat}</div>
                    </div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>
                      {cats.slice(0,6).map((c,i)=>(
                        <button key={i} className="btn btn-outline btn-sm" style={{ fontSize:".55rem",padding:"4px 8px" }} onClick={()=>setDmLastWordCat(c)}>{c}</button>
                      ))}
                    </div>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",color:"var(--dim)",marginBottom:6 }}>Tap to eliminate:</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
                      {alivePlayers.map(pl => {
                        const isOut = dmLastWordElim.includes(pl.id);
                        return (
                          <button key={pl.id} onClick={()=>!isOut&&setDmLastWordElim(e=>[...e,pl.id])}
                            style={{ background:isOut?"rgba(139,26,26,.2)":"rgba(40,20,60,.5)",border:`1px solid ${isOut?"rgba(139,26,26,.4)":"rgba(100,60,140,.3)"}`,borderRadius:3,padding:"5px 9px",fontSize:".72rem",color:isOut?"var(--dim)":"var(--text)",cursor:isOut?"default":"pointer",textDecoration:isOut?"line-through":"none" }}>
                            {pl.emoji} {pl.name}
                          </button>
                        );
                      })}
                    </div>
                    {alivePlayers.filter(p=>!dmLastWordElim.includes(p.id)).length===1 && (
                      <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:3,padding:"10px",textAlign:"center",fontFamily:"'Cinzel',serif",color:"var(--gold)" }}>
                        🏆 Winner: {alivePlayers.find(p=>!dmLastWordElim.includes(p.id))?.emoji} {alivePlayers.find(p=>!dmLastWordElim.includes(p.id))?.name}
                      </div>
                    )}
                  </div>
                  <AwardBar />
                </>
              );
            }

            if (m.digitalType === "the_relic") {
              const [relicPhase, setRelicPhase] = useState("pick"); // pick → blindfold → hide → search
              const [hideTimer, setHideTimer] = useState(60);
              useEffect(() => {
                if (relicPhase !== "hide") return;
                if (hideTimer <= 0) { setRelicPhase("search"); return; }
                const t = setTimeout(() => setHideTimer(s => s-1), 1000);
                return () => clearTimeout(t);
              }, [relicPhase, hideTimer]);
              return (
                <>
                  <div style={{ background:"rgba(10,5,20,.8)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:12,marginBottom:10 }}>
                    <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:8 }}>🗿 The Relic — {relicPhase==="pick"?"Choose Object":relicPhase==="blindfold"?"Players Blindfolding":relicPhase==="hide"?"Hide the Relic":("Search Phase")}</div>
                    {relicPhase === "pick" && (<>
                      <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:4,padding:"14px 16px",marginBottom:10,textAlign:"center" }}>
                        <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:6 }}>The Object to Hide</div>
                        <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.3rem",color:"var(--gold)" }}>{dmRelicObject}</div>
                      </div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
                        {RELIC_OBJECTS.map((o,i)=>(<button key={i} className="btn btn-outline btn-sm" style={{ fontSize:".55rem",padding:"4px 8px" }} onClick={()=>setDmRelicObject(o)}>{o}</button>))}
                      </div>
                      <button className="btn btn-gold" style={{ width:"100%" }} onClick={async()=>{ setRelicPhase("blindfold"); await save(gameId+"-relic-phase","blindfold"); }}>
                        Object chosen — Blindfold everyone →
                      </button>
                    </>)}
                    {relicPhase === "blindfold" && (<>
                      <div style={{ background:"rgba(40,0,60,.2)",border:"1px solid rgba(120,0,180,.3)",borderRadius:4,padding:"16px",textAlign:"center",marginBottom:12 }}>
                        <div style={{ fontSize:"2rem",marginBottom:8 }}>🙈</div>
                        <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1rem",color:"#dd88ff",marginBottom:8 }}>Blindfolds On</div>
                        <div style={{ fontSize:".85rem",color:"var(--dim)",lineHeight:1.6 }}>Say: <em>"Blindfolds on, phones face-down. Nobody opens their eyes or moves until I say so."</em></div>
                      </div>
                      <button className="btn btn-crim" style={{ width:"100%" }} onClick={()=>{ setRelicPhase("hide"); setHideTimer(60); }}>
                        Everyone's blindfolded — Start hiding →
                      </button>
                    </>)}
                    {relicPhase === "hide" && (<>
                      <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.3)",borderRadius:4,padding:"16px",textAlign:"center",marginBottom:12 }}>
                        <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1rem",color:"var(--gold)",marginBottom:8 }}>Hide It Now</div>
                        <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"3rem",color:hideTimer<10?"var(--crim3)":"var(--gold)" }}>{hideTimer}s</div>
                        <div style={{ fontSize:".78rem",color:"var(--dim)",marginTop:6,fontStyle:"italic" }}>Take the {dmRelicObject} somewhere it won't be obvious. Return to your spot before time runs out.</div>
                      </div>
                      {hideTimer <= 0 && <div style={{ color:"#80e080",textAlign:"center",fontSize:".85rem",fontFamily:"'Cinzel',serif" }}>✓ Time's up — back to your spot</div>}
                    </>)}
                    {relicPhase === "search" && (<>
                      <div style={{ background:"rgba(40,0,60,.15)",border:"1px solid rgba(120,0,180,.25)",borderRadius:4,padding:"14px",marginBottom:10 }}>
                        <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1rem",color:"#dd88ff",marginBottom:6 }}>Blindfolds Off — Search!</div>
                        <div style={{ fontSize:".85rem",color:"var(--dim)",lineHeight:1.6 }}>Say: <em>"Blindfolds off. Somewhere in this space is a hidden {dmRelicObject}. Find it. If you do — pocket it silently and say absolutely nothing."</em></div>
                      </div>
                      <div style={{ fontSize:".78rem",color:"var(--dim)",fontStyle:"italic" }}>The finder will come to you privately. You decide who won — regardless of the group vote. Award their shield silently.</div>
                    </>)}
                  </div>
                  {relicPhase === "search" && <AwardBar />}
                </>
              );
            }

            // Default (analog) mission panel
            return (
              <>
                <div className="info-box" style={{ marginBottom: 10 }}>
                  <strong style={{ color: "var(--gold)" }}>{m.icon} {m.name}</strong><br />{m.desc}
                </div>
                {m.hostNote && (
                  <div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 3, padding: "8px 12px", marginBottom: 10, fontSize: ".82rem", color: "var(--gold2)", fontStyle: "italic" }}>
                    ⚜ {m.hostNote}
                  </div>
                )}
                <AwardBar />
              </>
            );
          })()}
          <button className="btn btn-gold next-phase-btn" onClick={() => advanceTo(PHASES.FREE_ROAM)}>Mission Complete → Free Roam</button>
        </>
      )}
      {p === PHASES.FREE_ROAM && (
        <>
          {/* Hidden Shield Search — host award panel */}
          {game.hiddenShieldEnabled && alivePlayers.length > 6 && (
            <div className="card host" style={{ marginBottom: 10, padding: "14px 16px" }}>
              <div className="ctitle" style={{ fontSize:".7rem",marginBottom:10 }}>🛡️ Hidden Shield Search — Active</div>
              <div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic",marginBottom:12,lineHeight:1.6 }}>
                If a player finds one of the {game.hiddenShieldCount || 1} hidden shield{(game.hiddenShieldCount||1)>1?"s":""} and brings it to you, tap their name to select them — then confirm to award.
              </div>
              {(()=>{const pending = pendingShieldId ? alivePlayers.find(p => p.id === pendingShieldId) : null; return (
                  <>
                    <div className="pgrid" style={{ marginBottom: pending ? 10 : 8 }}>
                      {alivePlayers.map(pl => (
                        <div key={pl.id}
                          className={`pcard click ${pendingShieldId === pl.id ? "sel" : ""}`}
                          style={{ borderColor: pendingShieldId === pl.id ? "rgba(45,107,71,.6)" : "var(--border)" }}
                          onClick={() => setPendingShieldId(prev => prev === pl.id ? null : pl.id)}>
                          {pl.shield && <div className="ppip">🛡️</div>}
                          <div className="pavatar">{pl.emoji}</div>
                          <div className="pname" style={{ fontSize:".65rem" }}>{pl.name}</div>
                        </div>
                      ))}
                    </div>
                    {pending && (
                      <div style={{ background:"rgba(45,107,71,.12)",border:"1px solid rgba(45,107,71,.4)",borderRadius:4,padding:"12px 14px",marginBottom:8 }}>
                        <div style={{ fontFamily:"'Cinzel',serif",fontSize:".62rem",letterSpacing:".12em",textTransform:"uppercase",color:"#60c080",marginBottom:8 }}>
                          Confirm — Award shield to {pending.emoji} {pending.name}?
                        </div>
                        <div style={{ display:"flex",gap:8 }}>
                          <button className="btn btn-gold btn-sm" style={{ flex:1,background:"linear-gradient(135deg,#2d6b47,#1a3d2b)",color:"#90f0b0",border:"1px solid rgba(45,107,71,.5)" }}
                            onClick={async () => {
                              const g = await load(gameId);
                              const updated = { ...g,
                                players: g.players.map(p => p.id===pending.id ? {...p,shield:true} : p),
                                hiddenShieldsRemaining: Math.max(0,(g.hiddenShieldsRemaining ?? g.hiddenShieldCount ?? 1)-1)
                              };
                              await save(gameId, updated); setGame(updated);
                              await addMsg(gameId, { type:"power", text:`🛡️ ${pending.emoji} ${pending.name} found a hidden shield — awarded. ${updated.hiddenShieldsRemaining} remaining.` });
                              await castleMsg(`🛡️ ${pending.emoji} ${pending.name} found a hidden Shield during Free Roam. It's theirs to keep.`);
                              setPendingShieldId(null);
                            }}>
                            ✓ Confirm Award
                          </button>
                          <button className="btn btn-outline btn-sm" style={{ flex:1 }} onClick={() => setPendingShieldId(null)}>
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {!pending && <div style={{ fontSize:".7rem",color:"var(--dim)",fontStyle:"italic" }}>Tap a player to select, then confirm. No shield is awarded until you confirm.</div>}
                  </>
                );
              })()}
            </div>
          )}
          {game.hiddenShieldEnabled && alivePlayers.length <= 6 && (
            <div style={{ fontSize:".75rem",color:"var(--dim)",fontStyle:"italic",textAlign:"center",padding:"8px",marginBottom:8,border:"1px solid rgba(255,255,255,.06)",borderRadius:3 }}>
              🛡️ Hidden Shield Search locked — fewer than 7 players remain.
            </div>
          )}
        <button className="btn btn-gold next-phase-btn" onClick={() => advanceTo(PHASES.ROUND_TABLE)}>
          {alivePlayers.length === 5 ? "Call the Final Round Table →" : "Call the Round Table →"}
        </button>
        </>
      )}
      {p === PHASES.ROUND_TABLE && <button className="btn btn-gold next-phase-btn" onClick={() => advanceTo(PHASES.VOTING, { dayVotes: {}, daggerActivePlayerId: null })}>Open the Vote →</button>}
      {p === PHASES.VOTING && (() => {
        const daggerHolder = alivePlayers.find(pl => pl.dagger);
        const daggerActive = game.daggerActivePlayerId;
        const votes = game.dayVotes || {};
        return (
          <div className="col">
            {/* Real-time secret vote tracker */}
            <div style={{ background: "rgba(139,26,26,.06)", border: "1px solid rgba(139,26,26,.15)", borderRadius: 3, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 6 }}>
                🗳️ Live Vote Tracker — {dayVoteCount}/{alivePlayers.length} cast
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {alivePlayers.map(pl => {
                  const targetId = votes[pl.id];
                  const target = game.players?.find(x => x.id === targetId);
                  return (
                    <div key={pl.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 6px", background: targetId ? "rgba(139,26,26,.08)" : "transparent", borderRadius: 2, fontSize: ".75rem" }}>
                      <span style={{ color: "var(--dim)" }}>{pl.emoji} {pl.name}</span>
                      <span style={{ color: targetId ? "var(--crim3)" : "var(--dim)", fontStyle: targetId ? "normal" : "italic" }}>
                        {target ? `→ ${target.emoji} ${target.name}` : "…"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {daggerHolder && (
              <div style={{ background: "rgba(139,26,26,.08)", border: "1px solid rgba(139,26,26,.3)", borderRadius: 3, padding: "10px 14px", marginBottom: 8 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".12em", color: "var(--crim3)", textTransform: "uppercase", marginBottom: 6 }}>🗡️ The Dagger</div>
                <div style={{ fontSize: ".85rem", color: "var(--dim)", marginBottom: 10, lineHeight: 1.6 }}>
                  Ask the room: <strong style={{ color: "var(--gold)" }}>"Does anyone wish to use the Dagger?"</strong><br />
                  <span style={{ fontSize: ".78rem" }}>The holder must stand, reveal themselves, and declare it aloud. If they do — press Yes. If not — press No.</span>
                </div>
                {daggerActive
                  ? <div style={{ background: "rgba(139,26,26,.15)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 3, padding: "8px 12px", fontSize: ".85rem", color: "var(--crim3)" }}>
                      🗡️ <strong>{alivePlayers.find(pl => pl.id === daggerActive)?.name}</strong> is using the Dagger — their vote counts twice.
                      <button className="btn btn-outline btn-sm" style={{ marginTop: 6, display: "block", fontSize: ".6rem" }} onClick={async () => { const g = await load(gameId); await save(gameId, {...g, daggerActivePlayerId: null}); setGame({...g, daggerActivePlayerId: null}); }}>Undo</button>
                    </div>
                  : <div className="pgrid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 6 }}>
                      <button className="btn btn-crim btn-sm" onClick={async () => { const g = await load(gameId); await save(gameId, {...g, daggerActivePlayerId: daggerHolder.id}); setGame({...g, daggerActivePlayerId: daggerHolder.id}); }}>
                        ✅ Yes — {daggerHolder.name} uses it
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={async () => { const g = await load(gameId); await save(gameId, {...g, daggerActivePlayerId: null}); setGame({...g, daggerActivePlayerId: null}); }}>
                        ❌ No — not this round
                      </button>
                    </div>
                }
              </div>
            )}
            <button className="btn btn-crim next-phase-btn" onClick={resolveBanishment}>
              Resolve Banishment · {dayVoteCount}/{alivePlayers.length} votes{daggerActive ? " · 🗡️ Dagger active" : ""}
            </button>
          </div>
        );
      })()}
      {p === PHASES.BANISHMENT && (() => {
        const ban = game.lastBanished;
        if (!ban) {
          const aliveNow = alivePlayers.length;
          return aliveNow <= 4
            ? <button className="btn btn-gold next-phase-btn" onClick={() => advanceTo(PHASES.ENDGAME_FREE_ROAM, { endgameVotes: {} })}>No Banishment → Final Free Roam →</button>
            : <button className="btn btn-night next-phase-btn" onClick={hostBeginNight}>No Banishment → Proceed to Night →</button>;
        }
        const wasTraitor = ban.role === "traitor" || ban.role === "secret_traitor";
        const suppress = ban.suppressRoleReveal; // 5th-to-last: silent exit, no reveal
        const traitorQuips = [
          "Well, well, well. Turns out your instincts aren't completely broken. A Traitor — gone. Try not to look too smug about it. It's unbecoming.",
          "You actually got one! A real, live Traitor, caught and expelled. Statistically this was unlikely. Savour it.",
          "The castle has spoken and it has said: not today, you lying little menace. A Traitor is among the fallen.",
          "Justice, served lukewarm and slightly passive-aggressive, as is traditional. That was a Traitor. You did it.",
        ];
        const faithfulQuips = [
          "Ah. A Faithful. Gone. Wrongly accused by the very people they were trying to protect. This is either very sad or very funny and I genuinely cannot tell which.",
          "Congratulations — you've banished someone completely innocent. The Traitors are somewhere trying not to cry with laughter right now.",
          "A Faithful player, cast out into the cold by their supposed allies. The Traitors are fine. Thriving, actually. Well done, everyone.",
          "That was a Faithful. An innocent person. You did this. You may sit with that information for as long as you need.",
        ];
        const pool = wasTraitor ? traitorQuips : faithfulQuips;
        const quipIdx = Math.floor((ban.name.charCodeAt(0) || 0) % pool.length);
        return (
          <div className="col">
            <div className="quip"><span style={{ marginLeft: 14 }}>{suppress ? "And then there were four. The endgame awaits — but first, say goodbye. No questions. No answers. They leave in silence." : pool[quipIdx]}</span></div>
            {suppress
              ? <div style={{ background: "rgba(139,26,26,.08)", border: "1px solid var(--crim-border)", borderRadius: 3, padding: 14, fontSize: ".9rem", color: "var(--dim)", lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--crim3)", display: "block", marginBottom: 6 }}>🚪 Silent Exit</strong>
                  {ban.name} leaves the castle without answering any questions. Their role remains unknown until the very end. Send them to join the ghosts.
                </div>
              : <div style={{ background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: 14, fontSize: ".9rem", color: "var(--dim)", lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--gold)", display: "block", marginBottom: 6 }}>🎤 Circle of Truth</strong>
                  Now, before they leave your game — lean in, look them in the eye, and ask:<br />
                  <strong style={{ color: "var(--gold)", fontSize: "1rem", display: "block", margin: "10px 0", fontStyle: "italic" }}>"Are you a Traitor… or are you Faithful?"</strong>
                  Let them answer. Let the room react. Then send them on their way.
                </div>
            }
            <button className="btn btn-gold next-phase-btn" onClick={suppress ? () => advanceTo(PHASES.ENDGAME_FREE_ROAM, { endgameVotes: {} }) : hostBeginNight}>{suppress ? "Silent Exit Done → Final Free Roam →" : "Circle of Truth Done → Begin the Night →"}</button>
          </div>
        );
      })()}
      {p === PHASES.NIGHT_RECRUIT && (
        <div className="col">
          {game.recruitDeclined && (
            <div style={{ background: "rgba(139,26,26,.15)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 3, padding: "10px 14px", marginBottom: 8, fontSize: ".88rem", color: "var(--dim)" }}>
              <strong style={{ color: "var(--crim3)" }}>{game.recruitDeclinedEmoji} {game.recruitDeclinedName}</strong> declined and was murdered. The Traitor must recruit again.
            </div>
          )}
          <div style={{ background: "rgba(80,0,120,.15)", border: "1px solid rgba(120,0,180,.35)", borderRadius: 3, padding: 14, fontSize: ".88rem", color: "var(--dim)", lineHeight: 1.75, marginBottom: 8 }}>
            <strong style={{ color: "#d088ff", display: "block", marginBottom: 6 }}>🤝 Recruitment Night</strong>
            The solo Traitor is awake. Tap their shoulder — they will select a Faithful to recruit privately on their phone. Once they lock in, tap below to wake the selected Faithful.
          </div>
          <div style={{ background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 3, padding: "8px 12px", fontSize: ".82rem", color: "var(--dim)", marginBottom: 8 }}>
            {game.recruitTargetId
              ? <><strong style={{ color: "var(--gold)" }}>✓ Target selected.</strong> Tap below to wake them and show them the offer.</>
              : "Waiting for the Traitor to select their recruit target…"
            }
          </div>
          {game.recruitTargetId && (
            <button className="btn btn-night next-phase-btn" onClick={() => advanceTo(PHASES.NIGHT_RECRUIT_RESPONSE)}>
              Wake {game.players.find(p => p.id === game.recruitTargetId)?.name} — Show Them the Offer →
            </button>
          )}
        </div>
      )}
      {p === PHASES.NIGHT_RECRUIT_RESPONSE && (
        <div className="col">
          <div style={{ background: "rgba(80,0,120,.15)", border: "1px solid rgba(120,0,180,.35)", borderRadius: 3, padding: 14, fontSize: ".88rem", color: "var(--dim)", lineHeight: 1.75 }}>
            <strong style={{ color: "#d088ff", display: "block", marginBottom: 6 }}>🤝 Awaiting Response</strong>
            Tap <strong style={{ color: "#d088ff" }}>{game.players.find(p => p.id === game.recruitTargetId)?.name}</strong>'s shoulder — they lift their blindfold and see the offer on their phone. They tap Accept or Decline.<br /><br />
            If they <strong style={{ color: "#80e080" }}>Accept</strong>: wake the original Traitor — the Turret begins with both of them.<br />
            If they <strong style={{ color: "var(--crim3)" }}>Decline</strong>: they are murdered immediately. Wake the Traitor — they must recruit again.
          </div>
        </div>
      )}
      {p === PHASES.NIGHT_SEER && (
        <div className="col">
          <div style={{ background: "rgba(30,0,50,.2)", border: "1px solid rgba(100,0,160,.35)", borderRadius: 3, padding: 14, lineHeight: 1.75, fontSize: ".9rem", color: "var(--dim)", marginBottom: 8 }}>
            <strong style={{ color: "#dd88ff", display: "block", marginBottom: 6 }}>👁️ Seer Phase</strong>
            Quietly tap the Seer's shoulder — they lift their blindfold. Their screen shows a player grid with a two-step lock-in before the reveal. They may also choose to save their power for a future night — tap "Save for another night" and put the phone down. Once they're done (interrogated or delayed), tap below to proceed.
            {game.seerUsed && !game.seerInvestigated && <div style={{ marginTop: 8, color: "#a0d080", fontSize: ".82rem" }}>✓ The Seer saved their power for another night.</div>}
            {game.seerInvestigated && <div style={{ marginTop: 8, background: "rgba(80,0,120,.2)", border: "1px solid rgba(120,0,180,.35)", borderRadius: 3, padding: "8px 12px", fontSize: ".82rem" }}>
              👁️ Seer investigated: <strong style={{ color: "#d088ff" }}>{game.seerInvestigated.targetEmoji} {game.seerInvestigated.targetName}</strong> — <span style={{ color: game.seerInvestigated.isTraitor ? "var(--crim3)" : "#80e080" }}>{game.seerInvestigated.isTraitor ? "🗡️ TRAITOR" : "🛡️ FAITHFUL"}</span>
            </div>}
          </div>
          <button className="btn btn-night next-phase-btn" onClick={hostEndSeerPhase}>
            Seer Done → {game.secretTraitorEnabled && !game.secretTraitorRevealedInChat && !game.stBeingRevealedThisNight ? "Wake Secret Traitor →" : "Wake Traitors →"}
          </button>
        </div>
      )}
      {p === PHASES.NIGHT_SECRET_TRAITOR && (
        <>
          {game.stBeingRevealedThisNight ? (
            <div className="col">
              <div style={{ background: "rgba(80,0,120,.15)", border: "1px solid rgba(140,40,220,.4)", borderRadius: 3, padding: 14, lineHeight: 1.75, fontSize: ".9rem", color: "var(--dim)" }}>
                <strong style={{ color: "#d088ff", display: "block", marginBottom: 6 }}>🎭 Reveal Night — Special Instructions</strong>
                The Secret Traitor will submit their shortlist as usual — but this time, <strong style={{ color: "#d088ff" }}>do not send them back to sleep</strong>. After they submit, show them this screen. Then wake the regular Traitors. The Secret Traitor stays awake and joins the Turret.
              </div>
              <div className="info-box purple" style={{ marginBottom: 4 }}>
                {game.stShortlistSubmitted
                  ? "✓ Shortlist received. The Secret Traitor is waiting to be revealed. Tap below to wake the Traitors and make the introduction."
                  : "Waiting for the Secret Traitor to submit their 5-player shortlist…"}
              </div>
              <button className="btn btn-night next-phase-btn" onClick={hostEndSecretTraitorPhase} disabled={!game.stShortlistSubmitted}>
                Wake the Traitors — Reveal the Secret Traitor →
              </button>
            </div>
          ) : (
            <>
              <div className="info-box purple" style={{ marginBottom: 12 }}>
                The Secret Traitor is awake and selecting their mandatory shortlist of 5 targets. The Traitors will only be able to vote from this list. When the ST has locked in and gone back to sleep, proceed.
                {game.stShortlistSubmitted && <div style={{ marginTop: 8, color: "#a0d080" }}>✓ 5-player shortlist received. Someone just signed 5 death warrants and no one knows it was them.</div>}
              </div>
              {/* ST ↔ Host private chat */}
              <div style={{ background: "rgba(30,0,50,.4)", border: "1px solid rgba(120,0,180,.3)", borderRadius: 4, padding: 12, marginBottom: 10 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".12em", color: "#d088ff", textTransform: "uppercase", marginBottom: 8 }}>🔒 ST Private Channel</div>
                <div style={{ background: "rgba(10,2,18,.8)", border: "1px solid rgba(60,0,80,.3)", borderRadius: 3, maxHeight: 120, overflowY: "auto", padding: 8, marginBottom: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {stChats.length === 0
                    ? <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".78rem", textAlign: "center" }}>No messages yet.</div>
                    : stChats.map((m, i) => (
                      <div key={i} style={{ background: m.isHost ? "rgba(40,20,60,.4)" : "rgba(80,20,120,.3)", borderLeft: m.isHost ? "2px solid rgba(120,70,180,.5)" : "none", borderRight: m.isHost ? "none" : "2px solid rgba(180,60,240,.5)", borderRadius: 3, padding: "4px 8px", fontSize: ".78rem", textAlign: m.isHost ? "left" : "right" }}>
                        <div style={{ fontSize: ".55rem", color: "#c090ff", marginBottom: 1 }}>{m.sender}</div>
                        {m.text}
                      </div>
                    ))
                  }
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ flex: 1, background: "rgba(15,7,28,.8)", border: "1px solid rgba(80,20,120,.35)", borderRadius: 3, padding: "6px 10px", color: "var(--text)", fontSize: ".82rem", outline: "none" }}
                    placeholder="Reply to Secret Traitor…" value={stChatDraft} onChange={e => setStChatDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") sendStChat(); }} maxLength={200} />
                  <button className="btn btn-sm" style={{ background: "rgba(60,30,80,.5)", border: "1px solid rgba(100,60,140,.4)", color: "#c090ff" }} onClick={sendStChat} disabled={!stChatDraft.trim()}>Send</button>
                </div>
              </div>
              <button className="btn btn-night next-phase-btn" onClick={hostEndSecretTraitorPhase} disabled={!game.stShortlistSubmitted}>
                {game.stShortlistSubmitted ? "Secret Traitor Done → Wake Traitors →" : "Waiting for shortlist (5/5)…"}
              </button>
            </>
          )}
        </>
      )}
      {p === PHASES.NIGHT_TRAITOR_CHAT && (() => {
        const votes = game.nightVotes || {};
        const aliveT = alivePlayers.filter(pl => pl.role === "traitor" || pl.role === "secret_traitor");
        const voteValues = Object.values(votes);
        const allVoted = aliveT.length > 0 && aliveT.every(t => votes[t.id]);
        const unanimous = allVoted && new Set(voteValues).size === 1;
        const targetName = unanimous ? game.players.find(p => p.id === voteValues[0])?.name : null;
        const recruitNight = game.recruitedThisNight;
        return (
          <div className="col">
            {recruitNight && (
              <div style={{ background: "rgba(80,0,120,.12)", border: "1px solid rgba(120,0,180,.3)", borderRadius: 3, padding: "10px 14px", marginBottom: 8, fontSize: ".85rem", color: "#d0a0ff" }}>
                🤝 <strong>Recruitment Night</strong> — A new Traitor was recruited. The Turret is meeting so they can introduce themselves, but <strong>no murder can happen tonight</strong>. Resolve when they're done chatting.
              </div>
            )}
            {!recruitNight && (
              <div style={{ background: unanimous ? "rgba(20,80,20,.2)" : "rgba(139,26,26,.08)", border: unanimous ? "1px solid rgba(40,160,40,.3)" : "1px solid rgba(139,26,26,.2)", borderRadius: 3, padding: "10px 14px", marginBottom: 8, fontSize: ".85rem" }}>
                {unanimous
                  ? <><span style={{ color: "#80e080", fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase" }}>✅ Unanimous — </span>All Traitors locked in on <strong style={{ color: "#80e080" }}>{targetName}</strong>. Ready to resolve.</>
                  : <><span style={{ color: "var(--crim3)", fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase" }}>⏳ Waiting — </span>{nightVoteCount} of {aliveT.length} Traitor{aliveT.length !== 1 ? "s" : ""} voted. {allVoted && !unanimous ? "Not unanimous — no murder if you resolve now." : "Must be unanimous to murder."}</>
                }
              </div>
            )}
            {!recruitNight && unanimous && targetName && (
              <div style={{ background:"rgba(80,0,0,.2)",border:"1px solid rgba(139,26,26,.5)",borderRadius:4,padding:"14px 16px",marginBottom:10,textAlign:"center",animation:"phaseEnter .4s ease" }}>
                <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(200,80,80,.6)",marginBottom:8 }}>⚰️ Marked for Death</div>
                <div style={{ fontSize:"1.8rem",marginBottom:6 }}>{aliveT.length > 0 && alivePlayers.find(p=>p.id===Object.values(game.nightVotes||{})[0])?.emoji}</div>
                <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.1rem",color:"var(--crim3)",marginBottom:4 }}>{targetName}</div>
                <div style={{ fontSize:".78rem",color:"var(--dim)",fontStyle:"italic" }}>Unanimous. Fate sealed. Resolve when ready.</div>
              </div>
            )}
            <button className="btn btn-crim next-phase-btn" onClick={resolveNight}>
              {recruitNight ? "Recruitment Night Done → Breakfast →" : unanimous ? `Resolve Night — Murder ${targetName} →` : `Resolve Night — No Murder (${nightVoteCount}/${aliveT.length} votes, not unanimous)`}
            </button>
            {/* Decline debrief note — no murder possible */}
            {game.declineNoMurder && (
              <div style={{ background:"rgba(139,26,26,.08)",border:"1px solid rgba(139,26,26,.3)",borderRadius:3,padding:"10px 14px",marginBottom:10,fontSize:".82rem",lineHeight:1.6 }}>
                <span style={{ color:"var(--crim3)",fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:4 }}>⚰️ Debrief Only — No Murder Possible</span>
                <span style={{ color:"var(--dim)" }}>{game.recruitDeclinedName} refused and was eliminated. With only {alivePlayers.length} players remaining, the Turret cannot murder tonight. Let the Traitor(s) debrief and ask questions, then tap Resolve Night to go to breakfast.</span>
              </div>
            )}
            {/* 2-Traitor conditional recruitment — host status panel */}
            {game.canTwoTraitorRecruit && (
              <div style={{ background:"rgba(40,0,80,.12)",border:"1px solid rgba(100,0,180,.3)",borderRadius:3,padding:"10px 14px",marginBottom:10,fontSize:".82rem",lineHeight:1.6 }}>
                <span style={{ color:"#c090ff",fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:4 }}>⚡ Conditional Recruitment Mode</span>
                {game.twoTraitorRecruitMode
                  ? game.twoTraitorRecruitTarget
                    ? <><span style={{ color:"#80e080" }}>✅ Both agreed to recruit </span><strong style={{ color:"#d0a0ff" }}>{alivePlayers.find(p=>p.id===game.twoTraitorRecruitTarget)?.name}</strong><span style={{ color:"var(--dim)" }}> — tap below to present the offer. Same night-recruit rules apply.</span>
                      <div style={{ marginTop:8 }}>
                        <button className="btn btn-night btn-sm" onClick={async()=>{
                          const g=await load(gameId);
                          await save(gameId,{...g,recruitTargetId:game.twoTraitorRecruitTarget,phase:PHASES.NIGHT_RECRUIT_RESPONSE,twoTraitorRecruitMode:false,canTwoTraitorRecruit:false});
                          setGame({...g,recruitTargetId:game.twoTraitorRecruitTarget,phase:PHASES.NIGHT_RECRUIT_RESPONSE,twoTraitorRecruitMode:false,canTwoTraitorRecruit:false});
                        }}>Wake recruit → present offer</button>
                      </div></>
                    : <span style={{ color:"var(--dim)" }}>Both voted recruit — waiting for unanimous target selection…</span>
                  : (() => {
                    const votes = game.twoTraitorRecruitVotes || {};
                    const vals = Object.values(votes);
                    return <span style={{ color:"var(--dim)" }}>Traitors deciding: recruit or murder? {vals.length > 0 ? `${vals.filter(v=>v==="recruit").length} recruit / ${vals.filter(v=>v==="murder").length} murder` : "No votes yet."}</span>;
                  })()
                }
              </div>
            )}
            {/* Host can see and participate in Turret chat */}
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".12em", color: "var(--crim3)", textTransform: "uppercase", marginBottom: 6 }}>🗡️ Turret Chat — Host View</div>
              <div className="chat-wrap">
                <div className="chat-msgs" ref={chatRef} style={{ maxHeight: 160 }}>
                  {traitorChats.length === 0 && <div className="italic" style={{ textAlign: "center", fontSize: ".8rem", padding: "10px 0", color: "var(--dim)" }}>No messages yet.</div>}
                  {traitorChats.map((m, i) => (
                    m.isSystem
                      ? <div key={i} style={{ background: "rgba(120,0,180,.2)", borderRadius: 3, padding: "8px 10px", textAlign: "center", fontSize: ".8rem", color: "#d088ff", marginBottom: 4 }}>{m.text}</div>
                      : <div key={i} className={`chat-msg ${m.senderId === myId ? "mine" : "other"}`}>
                          <div className={`chat-name ${m.senderId === myId ? "mine" : "other"}`}>{m.name || m.sender}</div>
                          {m.text}
                        </div>
                  ))}
                </div>
                <div className="chat-input-row">
                  <input className="chat-input" placeholder="Message the Turret…" value={chatDraft} onChange={e => setChatDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendChat(); }} maxLength={200} />
                  <button className="btn btn-night btn-sm" onClick={sendChat} disabled={!chatDraft.trim()}>Send</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {p === PHASES.BREAKFAST && (
        <div>
          {game.lastKilled
            ? <div style={{ background: "rgba(139,26,26,.1)", border: "1px solid rgba(139,26,26,.3)", borderRadius: 3, padding: "8px 12px", marginBottom: 10, fontSize: ".82rem", color: "var(--dim)" }}>
                <span style={{ color: "var(--crim3)", fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase" }}>🌙 Last Night — </span>
                <strong style={{ color: "var(--crim3)" }}>{game.lastKilled.emoji} {game.lastKilled.name}</strong> was murdered. {game.breakfastRevealed ? "Revealed to players." : "Not yet revealed to players."}
              </div>
            : <div style={{ background: "rgba(20,60,20,.1)", border: "1px solid rgba(40,120,40,.3)", borderRadius: 3, padding: "8px 12px", marginBottom: 10, fontSize: ".82rem", color: "var(--dim)" }}>
                <span style={{ color: "#80e080", fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase" }}>🛡️ Last Night — </span>
                No murder. A shield blocked the attempt, or no kill was made. {game.breakfastRevealed ? "Revealed to players." : "Not yet revealed to players."}
              </div>
          }
          <div className="label">Breakfast Groups</div>
          {breakfastGroups.map((group, i) => {
            const isCurrentGroup = i === breakfastGroupIdx;
            const isPast = i < breakfastGroupIdx;
            const isLast = i === breakfastGroups.length - 1;
            const groupPlayers = group.map(id => (game.players || []).find(p => p.id === id)).filter(Boolean);
            return (
              <div key={i} className={`bk-group ${isCurrentGroup ? "current" : isPast ? "" : "waiting"}`}>
                <div className="bk-group-label">Group {i + 1}{isLast ? " — Final (murder reveal)" : ""}{isCurrentGroup ? " — At Breakfast Now" : ""}</div>
                <div className="row" style={{ gap: 8 }}>
                  {groupPlayers.map(p => <span key={p.id} className="badge b-shield" style={{ background: "rgba(100,60,10,.3)", color: "var(--gold2)", border: "1px solid rgba(140,90,20,.3)" }}>{p.emoji} {p.name}</span>)}
                </div>
              </div>
            );
          })}
          <div className="row" style={{ marginTop: 14, gap: 10 }}>
            {!isLastBreakfastGroup && <button className="btn btn-gold btn-sm" onClick={advanceBreakfastGroup}>Next Group to Breakfast →</button>}
            {isLastBreakfastGroup && !game.breakfastRevealed && (
              <button className="btn btn-crim next-phase-btn" onClick={revealBreakfast}>
                🔥 Reveal the Murder →
              </button>
            )}
            {isLastBreakfastGroup && game.breakfastRevealed && (
              <div className="col" style={{ gap: 8, width: "100%" }}>
                {timerSec > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".1em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 4 }}>⏱ Conversation time</div>
                    <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.8rem", color: timerClass === "urgent" ? "var(--crim3)" : timerClass === "warn" ? "#e0a040" : "var(--gold)" }}>{fmtTime(timerSec)}</div>
                  </div>
                )}
                <button className="btn btn-gold next-phase-btn" onClick={advanceFromBreakfast}>
                  Breakfast Done → Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {p === PHASES.ENDGAME_FREE_ROAM && (
        <div className="col">
          <div className="quip"><span style={{ marginLeft: 14 }}>Four left standing. Send them to roam one last time before the Fire of Truth. Watch who pairs off. It tells you everything.</span></div>
          <div className="info-box" style={{ lineHeight: 1.8 }}>
            Players see a countdown timer on their screens. When time is up — or when you feel the moment is right — call everyone to the Fire of Truth.
          </div>
          {timerSec > 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2rem", color: timerClass === "urgent" ? "var(--crim3)" : timerClass === "warn" ? "#e0a040" : "var(--gold)" }}>{fmtTime(timerSec)}</div>
              <div className="label" style={{ textAlign: "center" }}>final free roam</div>
            </div>
          )}
          {timerSec <= 0 && (
            <button className="btn btn-outline btn-sm" onClick={() => startTimer((phaseTimers?.endgame_free_roam || 10) * 60)}>
              ▶ Start {phaseTimers?.endgame_free_roam || 10} min timer
            </button>
          )}
          <button className="btn btn-gold next-phase-btn" onClick={() => advanceTo(PHASES.ENDGAME, { endgameVotes: {} })}>
            Call Everyone to the Fire of Truth →
          </button>
        </div>
      )}
      {p === PHASES.ENDGAME && (() => {
        const votes = game.endgameVotes || {};
        const allVoted = Object.keys(votes).length >= alivePlayers.length;
        const unanimous = allVoted && Object.values(votes).every(v => v === "end");
        const revealedCount = game.endgameRevealIdx ?? -1;
        return (
          <div className="col">
            {timerSec > 0 && (
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.8rem", color: timerClass === "urgent" ? "var(--crim3)" : timerClass === "warn" ? "#e0a040" : "var(--gold)" }}>{fmtTime(timerSec)}</div>
                <div className="label" style={{ textAlign: "center" }}>fire of truth</div>
              </div>
            )}
            {timerSec <= 0 && !allVoted && (
              <button className="btn btn-outline btn-sm" style={{ marginBottom: 8 }} onClick={() => startTimer((phaseTimers?.endgame || 10) * 60)}>
                ▶ Start {phaseTimers?.endgame || 10} min timer
              </button>
            )}
            {!allVoted && (
              <div className="info-box" style={{ marginBottom: 8 }}>
                Waiting for votes… ({Object.keys(votes).length}/{alivePlayers.length})<br />
                <span style={{ fontSize: ".82rem", fontStyle: "italic" }}>Once all votes are in, ask each player one by one: <strong style={{ color: "var(--gold)" }}>"Have you chosen to end the game, or banish again?"</strong> They will turn their screen toward the group to reveal their answer.</span>
              </div>
            )}
            {allVoted && (
              <>
                <div className="quip" style={{ marginBottom: 12 }}><span style={{ marginLeft: 14 }}>All votes are in. Go around the group — ask each person directly: "Have you chosen to end the game, or banish again?" They will turn their screen to reveal the answer.</span></div>
                <div className="label">The Votes</div>
                <div className="pgrid" style={{ marginBottom: 14 }}>
                  {alivePlayers.map((pl, i) => {
                    const v = votes[pl.id];
                    const isRevealed = i <= revealedCount;
                    return (
                      <div key={pl.id}
                        className="pcard"
                        style={{ cursor: i === revealedCount + 1 ? "pointer" : "default", borderColor: isRevealed ? (v === "end" ? "rgba(201,168,76,.5)" : "rgba(139,26,26,.5)") : "var(--border)", transition: "all .3s" }}
                        onClick={() => revealEndgameVote(i)}
                      >
                        <div className="pavatar">{pl.emoji}</div>
                        <div className="pname" style={{ fontSize: ".72rem" }}>{pl.name}</div>
                        {isRevealed
                          ? <div style={{ marginTop: 5, padding: "3px 6px", borderRadius: 2, background: v === "end" ? "rgba(40,120,40,.25)" : "rgba(139,26,26,.2)", border: v === "end" ? "1px solid rgba(80,160,80,.4)" : "1px solid rgba(139,26,26,.5)", fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".08em", color: v === "end" ? "#80e080" : "var(--crim3)" }}>
                              {v === "end" ? "✅ End It" : "🔄 Banish"}
                            </div>
                          : i === revealedCount + 1
                            ? <div style={{ marginTop: 5, fontSize: ".65rem", color: "var(--gold)", fontStyle: "italic" }}>← next</div>
                            : <div style={{ marginTop: 5, fontSize: ".65rem", color: "var(--dim2)" }}>—</div>
                        }
                      </div>
                    );
                  })}
                </div>
                {revealedCount >= alivePlayers.length - 1 && unanimous && (
                  <button className="btn btn-gold next-phase-btn" onClick={endGameFinal}>
                    Unanimous — End the Game →
                  </button>
                )}
                {revealedCount >= alivePlayers.length - 1 && !unanimous && (
                  <button className="btn btn-crim next-phase-btn" onClick={() => advanceTo(PHASES.ROUND_TABLE)}>
                    Not Unanimous → Banish Again
                  </button>
                )}
              </>
            )}
          </div>
        );
      })()}
      <div className="divider" />
      {isHost && p !== PHASES.LOBBY && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <button className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: ".62rem" }}
              onClick={goBackPhase}
              disabled={!(game.phaseHistory?.length > 0)}
              title="Return to previous phase">
              ↩ Go Back
            </button>
            {timerSec > 0 && <>
              <button className="btn btn-outline btn-sm" style={{ fontSize: ".62rem" }} onClick={() => startTimer(timerSec + 120)}>+2m</button>
              <button className="btn btn-outline btn-sm" style={{ fontSize: ".62rem" }} onClick={() => startTimer(timerSec + 300)}>+5m</button>
            </>}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: showPlayerList ? 10 : 0 }}>
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setShowGameState(v => !v)}>
              {showPlayerList ? "Hide Players ↑" : "👁 View Players ↓"}
            </button>
            <button className="btn btn-outline btn-sm" onClick={resetGame}>Reset Game</button>
          </div>
          {showPlayerList && (() => {
            const all = game.players || [];
            const alive = all.filter(p => p.alive);
            const ghosts = all.filter(p => !p.alive);
            const roleColor = (r) => r === "traitor" ? "var(--crim3)" : r === "secret_traitor" ? "#d88ef0" : r === "faithful" ? "var(--gold)" : "var(--dim)";
            const roleLabel = (r) => r === "traitor" ? "🗡️ Traitor" : r === "secret_traitor" ? "🎭 Secret Traitor" : r === "faithful" ? "🛡️ Faithful" : "—";
            const dayVotes = game.dayVotes || {};
            const nightVotes = game.nightVotes || {};
            const isVotingPhase = p === PHASES.VOTING;
            const isNightVoting = p === PHASES.NIGHT_TRAITOR_CHAT;
            return (
              <div style={{ background: "rgba(4,2,8,.9)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 4, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 10 }}>View Players — Host Only</div>

                {/* Real-time voting tracker */}
                {(isVotingPhase || isNightVoting) && (() => {
                  const votes = isVotingPhase ? dayVotes : nightVotes;
                  const voters = isVotingPhase ? alive : alive.filter(pl => pl.role === "traitor" || pl.role === "secret_traitor");
                  const hasVoted = voters.filter(pl => votes[pl.id]);
                  const waiting = voters.filter(pl => !votes[pl.id]);
                  return (
                    <div style={{ marginBottom: 12, background: "rgba(139,26,26,.06)", border: "1px solid rgba(139,26,26,.2)", borderRadius: 3, padding: "8px 10px" }}>
                      <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--crim3)", marginBottom: 6 }}>
                        🗳️ {isNightVoting ? "Turret Votes" : "Day Votes"} — {hasVoted.length}/{voters.length}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {voters.map(pl => {
                          const targetId = votes[pl.id];
                          const target = game.players.find(x => x.id === targetId);
                          return (
                            <div key={pl.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".75rem" }}>
                              <span style={{ color: roleColor(pl.role) }}>{pl.emoji} {pl.name}</span>
                              <span style={{ color: targetId ? "var(--crim3)" : "var(--dim)", fontStyle: targetId ? "normal" : "italic" }}>
                                {target ? `→ ${target.emoji} ${target.name}` : "waiting…"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Alive players */}
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#80e080", marginBottom: 6 }}>Alive ({alive.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                  {alive.map(pl => (
                    <div key={pl.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", background: "rgba(255,255,255,.03)", borderRadius: 3, border: "1px solid rgba(255,255,255,.05)" }}>
                      <GoldFrame src={avatars?.[pl.id]} emoji={pl.emoji} size={32} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: "var(--text)" }}>{pl.name}</div>
                        <div style={{ fontSize: ".65rem", color: roleColor(pl.role) }}>{roleLabel(pl.role)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {pl.shield && <span style={{ fontSize: ".6rem", background: "rgba(40,80,180,.3)", border: "1px solid rgba(60,100,220,.4)", borderRadius: 2, padding: "1px 5px", color: "#88aaff" }}>🛡️</span>}
                        {pl.dagger && <span style={{ fontSize: ".6rem", background: "rgba(139,26,26,.3)", border: "1px solid rgba(139,26,26,.5)", borderRadius: 2, padding: "1px 5px", color: "var(--crim3)" }}>🗡️</span>}
                        {pl.seerRole && <span style={{ fontSize: ".6rem", background: "rgba(80,0,120,.3)", border: "1px solid rgba(120,0,180,.5)", borderRadius: 2, padding: "1px 5px", color: "#dd88ff" }}>👁️</span>}
                        <button onClick={() => manualKillPlayer(pl.id)} style={{ background: "rgba(139,26,26,.3)", border: "1px solid rgba(139,26,26,.5)", borderRadius: 2, padding: "2px 6px", fontSize: ".52rem", color: "var(--crim3)", cursor: "pointer", fontFamily: "'Cinzel',serif" }} title="Remove from game">✕ Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Ghosts */}
                {ghosts.length > 0 && (
                  <>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(140,100,180,.6)", marginBottom: 6 }}>Ghosts ({ghosts.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {ghosts.map(pl => (
                        <div key={pl.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
                          <GoldFrame src={avatars?.[pl.id]} emoji={pl.emoji} size={28} dead />
                          <div style={{ flex: 1, opacity: .6 }}>
                            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".72rem", color: "var(--dim)", textDecoration: "line-through" }}>{pl.name}</div>
                            <div style={{ fontSize: ".6rem", color: roleColor(pl.role) }}>{roleLabel(pl.role)}</div>
                          </div>
                          <button onClick={() => manualRevivePlayer(pl.id)} style={{ background: "rgba(40,80,40,.3)", border: "1px solid rgba(60,120,60,.4)", borderRadius: 2, padding: "2px 6px", fontSize: ".52rem", color: "#80e080", cursor: "pointer", fontFamily: "'Cinzel',serif" }} title="Return to game">↩ Revive</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  )}

  {/* ── PLAYER FACING CONTENT ── */}

  {/* SECRET TRAITOR SELECTION — PLAYER SCREEN */}
  {p === PHASES.SECRET_TRAITOR_SELECTION && !isHost && (() => {
    const idx = game.stSelectionIdx || 0;
    const currentPlayer = game.players?.[idx];
    const isMyTurn = currentPlayer?.id === myId;

    // If host has sent a reveal result to this player
    if (stRevealResult && isMyTurn) {
      if (stRevealResult.isSecretTraitor) {
        return (
          <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "44px 20px", background: "rgba(40,0,60,.95)", border: "2px solid rgba(180,60,240,.6)", boxShadow: "0 0 60px rgba(140,0,200,.4)" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎭</div>
            <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "clamp(1.4rem,5vw,2.2rem)", fontWeight: 900, color: "#e060ff", textShadow: "0 0 40px rgba(200,80,255,.6)", marginBottom: 14, lineHeight: 1.2 }}>
              YOU ARE THE<br />SECRET TRAITOR
            </div>
            <div style={{ fontStyle: "italic", color: "#c090e0", fontSize: "1rem", lineHeight: 1.75, maxWidth: 320, margin: "0 auto 20px" }}>
              You are a Traitor — but the other Traitors have no idea you exist. Vote with the Faithful. Murder at night. Keep. This. Face.
            </div>
            <div style={{ background: "rgba(180,60,240,.15)", border: "1px solid rgba(180,60,240,.4)", borderRadius: 3, padding: "12px 16px", fontSize: ".85rem", color: "#d0a0f0" }}>
              ⚠️ Do not react. Do not smile. You are being watched by everyone in this room right now.
            </div>
          </div>
        );
      } else {
        return (
          <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "44px 20px", background: "rgba(4,8,4,.95)", border: "1px solid rgba(60,120,60,.4)" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "clamp(1.3rem,4vw,1.9rem)", fontWeight: 900, color: "#80d080", marginBottom: 14, lineHeight: 1.2 }}>
              NOT THE<br />SECRET TRAITOR
            </div>
            <div style={{ fontStyle: "italic", color: "#60a060", fontSize: "1rem", lineHeight: 1.75 }}>
              You are not the Secret Traitor.<br />Hand the phone back and take your seat.
            </div>
          </div>
        );
      }
    }

    // Waiting — not my turn or no result yet
    return (
      <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "40px 20px", background: "rgba(8,4,12,.95)", border: "1px solid rgba(60,30,80,.4)" }}>
        {isMyTurn
          ? <>
              <div style={{ fontSize: "3rem", marginBottom: 14 }} className="pulse">🎭</div>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "#c090ff", marginBottom: 10 }}>Your Turn</div>
              <div style={{ fontStyle: "italic", color: "rgba(140,100,180,.7)", fontSize: ".95rem", lineHeight: 1.7 }}>
                Stand up. Face the group. The host will tap Reveal — your result appears on this screen.<br />Whatever you see: keep a poker face.
              </div>
            </>
          : <>
              <div style={{ fontSize: "3rem", marginBottom: 14 }}>🌑</div>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "rgba(80,50,110,.6)", marginBottom: 10 }}>
                {currentPlayer ? `${currentPlayer.name} is up` : "Stand by"}
              </div>
              <div style={{ fontStyle: "italic", color: "rgba(80,60,100,.5)", fontSize: ".95rem", lineHeight: 1.7 }}>
                Watch the person standing in front of the group.<br />Read their face. Remember this moment.
              </div>
            </>
        }
      </div>
    );
  })()}

  {/* ROLE REVEAL — PLAYER SCREENS */}
  {p === PHASES.ROLE_REVEAL && !isHost && (() => {
    const step = game.roleRevealStep || "tapping";
    if (step === "tapping") {
      // Full-screen blindfold — phones face down
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "48px 20px", background: "rgba(4,1,8,.98)", border: "1px solid rgba(40,20,60,.4)" }}>
          {/* Big bright full moon */}
          <div style={{ fontSize: "5.5rem", lineHeight: 1, marginBottom: 20, animation: "moonRise 3s ease-in-out infinite", filter: "drop-shadow(0 0 24px rgba(255,255,200,.5))" }}>🌕</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.4rem", color: "rgba(200,170,240,.85)", marginBottom: 14 }}>Blindfold On</div>
          <div style={{ fontStyle: "italic", color: "rgba(190,165,225,.7)", fontSize: "1rem", lineHeight: 1.8 }}>
            Phone face-down on the table.<br />Eyes closed or blindfolded.<br />The host will come to you.
          </div>
        </div>
      );
    }
    if (step === "silence") {
      // Blindfolds off — sit in silence looking at each other, no phones yet
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "48px 20px", background: "rgba(4,1,8,.98)", border: "1px solid rgba(40,20,60,.4)" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>👀</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.4rem", color: "rgba(80,50,110,.7)", marginBottom: 12 }}>Blindfolds Off</div>
          <div style={{ fontStyle: "italic", color: "rgba(80,60,100,.5)", fontSize: "1rem", lineHeight: 1.7 }}>
            Look around. Say nothing.<br />Do not check your phone yet.<br />The host will tell you when.
          </div>
        </div>
      );
    }
    // step === "done" — blindfolds off, check phone quietly
    const tc = game.players?.filter(p => p.role === "traitor" || p.role === "secret_traitor").length || 0;
    return (
      <div className="card" style={{ marginTop: 16 }}>
        <div className="ctitle">Eyes Open. Mouth Shut.</div>
        <div className="info-box" style={{ textAlign: "center", fontSize: "1rem", lineHeight: 1.8 }}>
          Check your role above. Read it. Absorb it. <strong>Do not speak. Do not react.</strong><br />
          <span style={{ fontSize: ".88rem", color: "var(--dim)" }}>The person next to you is doing the exact same thing right now.</span>
        </div>
        <div style={{ marginTop: 14, background: "rgba(139,26,26,.1)", border: "1px solid rgba(139,26,26,.3)", borderRadius: 3, padding: "10px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--crim3)", marginBottom: 4 }}>Know Your Enemy</div>
          <div style={{ fontSize: ".95rem", color: "var(--text)" }}>There {tc === 1 ? "is" : "are"} <strong style={{ color: "var(--crim2)", fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem" }}>{tc}</strong> Traitor{tc !== 1 ? "s" : ""} among you.</div>
          {game.secretTraitorEnabled && <div style={{ fontSize: ".78rem", color: "var(--dim)", fontStyle: "italic", marginTop: 4 }}>One of them is a Secret Traitor — unknown even to the others.</div>}
        </div>
      </div>
    );
  })()}

  {/* MISSION BRIEFING — PLAYER VIEW */}
  {p === PHASES.MISSION_BRIEFING && !isHost && (() => {
    const selectedM = game.currentMission ? MISSIONS.find(x => x.id === game.currentMission) : null;
    return (
      <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
        <div className="ctitle">Incoming Mission</div>
        {selectedM ? (
          <div style={{ padding: "10px 0 14px" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>{selectedM.icon}</div>
            <div className="display gold" style={{ marginBottom: 6 }}>{selectedM.name}</div>
            <div className="label" style={{ marginBottom: 10 }}>{selectedM.type} · {selectedM.time} minutes</div>
            <div className="body" style={{ maxWidth: 480, margin: "0 auto 14px" }}>{selectedM.desc}</div>
            <div className="info-box" style={{ display: "inline-block", padding: "8px 14px", fontSize: ".85rem" }}>🛡️ {SHIELD_MODE_LABELS[selectedM.shieldMode]}</div>
          </div>
        ) : (
          <div style={{ padding: "32px 0", fontStyle: "italic", color: "var(--dim)" }}>The host is selecting a mission…</div>
        )}
      </div>
    );
  })()}

  {/* MISSION ACTIVE — PLAYER VIEW */}
  {p === PHASES.MISSION_ACTIVE && !isHost && game.currentMission && (() => {
    const m = MISSIONS.find(x => x.id === game.currentMission);
    if (!m) return null;

    // ── Forbidden Word: show player's secret word ──
    if (m.digitalType === "forbidden_word") {
      const [myWord, setMyWord] = useState("loading…");
      useEffect(() => {
        load(gameId + "-fw-" + myId).then(w => { if (w) setMyWord(w); });
      }, []);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "24px 20px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🚫</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 8 }}>Forbidden Word</div>
          <div style={{ fontSize: ".9rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 14 }}>You must NOT say this word. Try to make others say theirs.</div>
          <div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 6, padding: "14px 20px", display: "inline-block" }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", color: "var(--crim3)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 6 }}>Your Secret Word</div>
            <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.8rem", color: "var(--text)", letterSpacing: ".05em" }}>{myWord}</div>
          </div>
        </div>
      );
    }

    // ── Secret Ballot: vote on phone ──
    if (m.digitalType === "secret_ballot") {
      const [voted, setVoted] = useState(null);
      return (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="ctitle">🗳️ Secret Ballot</div>
          <div className="info-box" style={{ marginBottom: 14, textAlign: "center" }}>Who would you most want to protect? Your vote is completely private.</div>
          {!voted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {alivePlayers.filter(pl=>pl.id!==myId).map(pl => (
                <button key={pl.id} className="btn btn-outline" onClick={async()=>{ await save(gameId+"-ballot-"+myId, pl.id); setVoted(pl.id); }}
                  style={{ textAlign:"left",padding:"10px 14px",display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:"1.2rem" }}>{pl.emoji}</span>
                  <span style={{ fontFamily:"'Cinzel',serif",fontSize:".82rem" }}>{pl.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center",padding:"20px 0",color:"var(--gold)",fontFamily:"'Cinzel',serif",fontSize:".85rem" }}>
              ✓ Vote cast. Wait for the host to reveal results.
            </div>
          )}
        </div>
      );
    }

    // ── Midnight Auction: submit bid on phone ──
    if (m.digitalType === "auction") {
      const [bid, setBid] = useState("");
      const [submitted, setSubmitted] = useState(false);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "24px 20px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🏺</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 8 }}>Midnight Auction</div>
          <div style={{ fontSize: ".9rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 16 }}>Enter a number from 1 to 10. Highest unique bid wins. Nobody sees your bid until all are revealed.</div>
          {!submitted ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <input type="number" min="1" max="10" value={bid} onChange={e=>setBid(e.target.value)}
                style={{ width:80,padding:"12px",fontSize:"1.5rem",textAlign:"center",background:"rgba(255,255,255,.05)",border:"1px solid rgba(201,168,76,.3)",borderRadius:4,color:"var(--gold)",fontFamily:"'Cinzel',serif" }} />
              <button className="btn btn-gold" disabled={!bid||bid<1||bid>10} onClick={async()=>{ await save(gameId+"-auction-bid-"+myId, Number(bid)); setSubmitted(true); }}>
                Submit Bid
              </button>
            </div>
          ) : (
            <div style={{ color:"var(--gold)",fontFamily:"'Cinzel',serif" }}>✓ Bid of {bid} submitted. Sit tight.</div>
          )}
        </div>
      );
    }

    // ── Hot Take: vote agree/disagree ──
    if (m.digitalType === "hot_take") {
      const [voted, setVoted] = useState(null);
      const [takeText, setTakeText] = useState("Loading…");
      useEffect(() => { load(gameId+"-hot-take").then(t=>{ if(t) setTakeText(t); }); }, []);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "24px 20px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🔥</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 14 }}>Hot Take</div>
          <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:4,padding:"14px 16px",marginBottom:16,fontSize:".95rem",color:"var(--text)",fontStyle:"italic",lineHeight:1.6 }}>"{takeText}"</div>
          {!voted ? (
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <button className="btn btn-sm" style={{ background:"rgba(40,100,40,.4)",border:"1px solid rgba(60,160,60,.5)",color:"#80e080",padding:"12px 20px",fontSize:".85rem" }}
                onClick={async()=>{ await save(gameId+"-hottake-"+myId,"agree"); setVoted("agree"); }}>✓ Agree</button>
              <button className="btn btn-sm" style={{ background:"rgba(100,20,20,.4)",border:"1px solid rgba(160,40,40,.5)",color:"var(--crim3)",padding:"12px 20px",fontSize:".85rem" }}
                onClick={async()=>{ await save(gameId+"-hottake-"+myId,"disagree"); setVoted("disagree"); }}>✗ Disagree</button>
            </div>
          ) : (
            <div style={{ color:"var(--gold)",fontFamily:"'Cinzel',serif" }}>✓ Voted {voted}. Waiting for others.</div>
          )}
        </div>
      );
    }

    // ── The Witness: answer questions privately ──
    if (m.digitalType === "the_witness") {
      const [qs, setQs] = useState([]);
      const [qIdx, setQIdx] = useState(0);
      const [answers, setAnswers] = useState({});
      const [done, setDone] = useState(false);
      useEffect(() => { load(gameId+"-witness-qs").then(q=>{ if(q) setQs(q); }); }, []);
      const q = qs[qIdx];
      const submit = async (opt) => {
        const newAnswers = {...answers, [qIdx]: opt};
        setAnswers(newAnswers);
        await save(gameId+"-witness-ans-"+myId, newAnswers);
        if (qIdx >= Math.min(qs.length,5)-1) setDone(true);
        else setQIdx(i=>i+1);
      };
      return (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:".9rem",color:"#dd88ff",textAlign:"center",marginBottom:14 }}>👁️ The Witness</div>
          {done ? (
            <div style={{ textAlign:"center",padding:"20px 0",color:"var(--gold)",fontFamily:"'Cinzel',serif",fontSize:".85rem" }}>
              ✓ Your answers are in. The host is tallying scores.
            </div>
          ) : !q ? (
            <div style={{ textAlign:"center",color:"var(--dim)",fontStyle:"italic" }}>Loading questions…</div>
          ) : (
            <>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",color:"var(--dim)",marginBottom:8 }}>Question {qIdx+1} of {Math.min(qs.length,5)}</div>
              <div style={{ fontSize:".95rem",color:"var(--text)",lineHeight:1.6,marginBottom:14,fontWeight:600 }}>{q.q}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {(q.opts ? q.opts() : [q.a]).map((opt,i) => (
                  <button key={i} className="btn btn-outline" onClick={()=>submit(opt)}
                    style={{ textAlign:"left",padding:"10px 14px",borderColor:"rgba(120,0,180,.3)",color:"var(--text)" }}>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    // ── The Draw: show winner notification to the winner only ──
    if (m.digitalType === "the_draw") {
      const [isWinner, setIsWinner] = useState(false);
      useEffect(() => {
        load(gameId + "-draw-winner").then(wid => { if (wid === myId) setIsWinner(true); });
      }, []);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🎴</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 12 }}>The Draw</div>
          {isWinner ? (
            <div style={{ background: "rgba(201,168,76,.1)", border: "2px solid rgba(201,168,76,.4)", borderRadius: 6, padding: "16px 20px" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 8 }}>You have been chosen</div>
              <div style={{ fontSize: "2rem", marginBottom: 6 }}>🛡️</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic" }}>Tell no one. The host will award your shield silently.</div>
            </div>
          ) : (
            <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".9rem", lineHeight: 1.7 }}>
              The castle chooses one player at random. Sit quietly. If it's you — you'll know.
            </div>
          )}
        </div>
      );
    }

    // ── Emoji Cipher: show the emoji on player phones ──
    if (m.digitalType === "emoji_cipher") {
      const [emojiDisplay, setEmojiDisplay] = useState("…");
      useEffect(() => {
        load(gameId + "-emoji-cipher").then(e => { if (e) setEmojiDisplay(e); });
      }, []);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 16 }}>📱 Emoji Cipher</div>
          <div style={{ fontSize: "3rem", letterSpacing: ".3em", margin: "0 auto 20px", padding: "16px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(201,168,76,.15)", borderRadius: 6 }}>{emojiDisplay}</div>
          <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".9rem", lineHeight: 1.7 }}>
            Decode the emojis. If you know the answer —<br />whisper it to the host <em>immediately</em>.
          </div>
        </div>
      );
    }

    // ── Name 5 in 30: show current category on player phones ──
    if (m.digitalType === "name5") {
      const [cat, setCat] = useState("…");
      useEffect(() => {
        const poll = () => load(gameId + "-name5-cat").then(c => { if (c) setCat(c); });
        poll();
        const t = setInterval(poll, 2000);
        return () => clearInterval(t);
      }, []);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 16 }}>⏱️ Name 5 in 30</div>
          <div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 6, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 8 }}>Category</div>
            <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--gold)", lineHeight: 1.4 }}>{cat}</div>
          </div>
          <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".9rem" }}>
            First to shout 5 valid answers wins the round.
          </div>
        </div>
      );
    }

    // ── RPS Bracket: show current matchup on player phones ──
    if (m.digitalType === "rps_bracket") {
      const [matchup, setMatchup] = useState(null);
      useEffect(() => {
        const poll = () => load(gameId + "-rps-matchup").then(m => { if (m) setMatchup(m); });
        poll();
        const t = setInterval(poll, 2000);
        return () => clearInterval(t);
      }, []);
      return (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 16 }}>✊ Rock Paper Scissors</div>
          {matchup?.p1 === myId || matchup?.p2 === myId ? (
            <div style={{ background: "rgba(201,168,76,.1)", border: "2px solid rgba(201,168,76,.4)", borderRadius: 6, padding: "20px" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--crim3)", marginBottom: 8 }}>⚔️ It's Your Turn</div>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>
                {alivePlayers.find(p=>p.id===matchup.p1)?.emoji} vs {alivePlayers.find(p=>p.id===matchup.p2)?.emoji}
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".85rem", color: "var(--text)" }}>
                {alivePlayers.find(p=>p.id===matchup.p1)?.name} vs {alivePlayers.find(p=>p.id===matchup.p2)?.name}
              </div>
              <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".82rem", marginTop: 10 }}>Best of 3. Step forward when called.</div>
            </div>
          ) : (
            <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".9rem", lineHeight: 1.7 }}>
              {matchup ? `Current match: ${alivePlayers.find(p=>p.id===matchup.p1)?.name} vs ${alivePlayers.find(p=>p.id===matchup.p2)?.name}` : "Waiting for the host to call the next match…"}
            </div>
          )}
        </div>
      );
    }

    // ── The Relic: phase-aware player screen ──
    if (m.digitalType === "the_relic") {
      const [phase, setPhase] = useState("waiting");
      useEffect(() => {
        const poll = () => load(gameId+"-relic-phase").then(p => { if (p) setPhase(p); });
        poll();
        const t = setInterval(poll, 2000);
        return () => clearInterval(t);
      }, []);
      return (
        <div className="card" style={{ marginTop:16, textAlign:"center", padding:"28px 20px" }}>
          <div style={{ fontSize:"2.5rem",marginBottom:10 }}>🗿</div>
          <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1rem",color:"var(--gold)",marginBottom:12 }}>The Relic</div>
          {phase === "blindfold" || phase === "hide" ? (
            <div style={{ background:"rgba(40,0,60,.2)",border:"1px solid rgba(120,0,180,.3)",borderRadius:6,padding:"20px" }}>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:".65rem",letterSpacing:".15em",textTransform:"uppercase",color:"#dd88ff",marginBottom:10 }}>🙈 Blindfolds On</div>
              <div style={{ fontSize:".9rem",color:"var(--dim)",lineHeight:1.7 }}>Eyes closed. Phone face-down. Don't move. Don't peek.<br /><em>The host is hiding something.</em></div>
            </div>
          ) : phase === "search" ? (
            <div>
              <div style={{ background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:6,padding:"18px 20px",marginBottom:12 }}>
                <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1rem",color:"var(--gold)",marginBottom:8 }}>Blindfolds Off — Search</div>
                <div style={{ fontSize:".9rem",color:"var(--dim)",lineHeight:1.7 }}>Somewhere in this space, a small object is hidden. Find it.<br /><br />If you find it — <strong style={{ color:"var(--gold)" }}>pocket it silently</strong> and say nothing. Act completely normal.<br /><br />After the search ends, the group will vote on who they think found it.</div>
              </div>
            </div>
          ) : (
            <div style={{ color:"var(--dim)",fontStyle:"italic",fontSize:".9rem" }}>Waiting for the host to begin…</div>
          )}
        </div>
      );
    }

    // Default player view (analog missions)
    return (
      <div className="card phase-enter" style={{ marginTop: 16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.5),transparent)", animation:"swordShimmer 2s ease-in-out infinite" }} />
        <div className="ctitle">⚔️ The Mission</div>
        <div style={{ textAlign: "center", padding: "10px 0 18px" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>{m.icon}</div>
          <div className="display gold" style={{ marginBottom: 6 }}>{m.name}</div>
          <div className="label" style={{ marginBottom: 10 }}>{m.type} · {m.time} minutes</div>
          <div className="body" style={{ maxWidth: 480, margin: "0 auto 14px" }}>{m.desc}</div>
          {m.shieldMode !== "seer_award" && (
            <div className="info-box" style={{ display: "inline-block", padding: "8px 14px", fontSize: ".85rem" }}>
              🛡️ {SHIELD_MODE_LABELS[m.shieldMode]}
            </div>
          )}
        </div>
      </div>
    );
  })()}

  {/* FREE ROAM */}
  {p === PHASES.FREE_ROAM && (
    <div className="card phase-enter" style={{ marginTop: 16, textAlign: "center", padding: "32px 20px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
      <div style={{ fontSize: "3rem", marginBottom: 14, animation:"roamDrift 3s ease-in-out infinite" }}>🏰</div>
      <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.4rem", color: "var(--gold)", marginBottom: 10 }}>Free Roam</div>
      <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 360, margin: "0 auto 20px" }}>
        The castle is open. Go wherever you want. Talk to whoever you want. The host will call you back when time is up.
      </div>
      {timerSec > 0 && (
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.8rem", color: timerSec < 120 ? "var(--crim3)" : "var(--gold)", marginBottom: 8 }}>{fmtTime(timerSec)}</div>
      )}
      <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".82rem", marginTop: 8 }}>Use the 🎭 and 🎒 buttons below to check your role and inventory.</div>
    </div>
  )}

  {/* ROUND TABLE */}
  {p === PHASES.ROUND_TABLE && (
    <div className="card phase-enter" style={{ marginTop: 16, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.5),rgba(220,180,80,.7),rgba(201,168,76,.5),transparent)", animation:"tableGlow 3s ease-in-out infinite" }} />
      <div className="ctitle">🕯️ The Round Table</div>
      <div className="info-box" style={{ marginBottom: 14, textAlign: "center" }}>
        Everyone's here. Someone in this circle is lying with their whole chest. Your job: figure out who before they murder you in your sleep. The host opens the vote when the debate gets interesting enough.
      </div>
      <div className="pgrid">
        {alivePlayers.map(pl => (
          <div key={pl.id} className="pcard">
            {pl.shield && <div className="ppip">🛡️</div>}
            {pl.dagger && <div className="ppip" style={{ left: "auto", right: 5 }}>🗡️</div>}
            <div className="pavatar">{pl.emoji}</div>
            <div className="pname">{pl.name}{pl.id === myId ? " (You)" : ""}</div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* VOTING — lock-in reveal card */}
  {p === PHASES.VOTING && me?.alive && (
    <div className="card phase-enter" style={{ marginTop: 16, position:"relative", overflow:"hidden" }}>
      {/* Animated candle border glow */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(201,168,76,.6),transparent)", animation:"tableGlow 2.5s ease-in-out infinite" }} />
      <div className="ctitle">🗳️ Cast Your Vote</div>
      {hasVotedDay
        ? (() => {
            const votedFor = game.players?.find(pl => pl.id === game.dayVotes?.[myId]);
            return (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: ".7rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 12 }}>Your Vote — Locked In</div>
                <div style={{ background: "rgba(139,26,26,.15)", border: "2px solid rgba(139,26,26,.4)", borderRadius: 4, padding: "20px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>{votedFor?.emoji || "?"}</div>
                  <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "clamp(1.4rem,5vw,2.2rem)", fontWeight: 900, color: "var(--crim2)" }}>{votedFor?.name || "?"}</div>
                </div>
                <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".88rem", marginBottom: 12 }}>When the host calls your name, turn this screen toward the group.</div>
                <div style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:"rgba(201,168,76,.3)",animation:"fadeInEl .6s .8s ease both" }}>Waiting for all votes to be cast…</div>
              </div>
            );
          })()
        : <>
            <div className="info-box" style={{ marginBottom: 14 }}>
              Pick your suspect. Once locked in, your phone shows a large name card to reveal when the host calls on you.{me?.dagger && <strong style={{ color: "#ff9999" }}> You hold the Dagger — your vote counts double.</strong>}
            </div>
            <div className="pgrid" style={{ marginBottom: 14 }}>
              {alivePlayers.filter(pl => pl.id !== myId).map(pl => (
                <div key={pl.id} className={`pcard click ${selectedTarget === pl.id ? "sel" : ""}`} onClick={() => setSelectedTarget(pl.id)}>
                  <div className="pavatar">{pl.emoji}</div>
                  <div className="pname">{pl.name}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-gold btn-lg" onClick={submitDayVote} disabled={!selectedTarget}>🗳️ Lock In My Vote</button>
          </>
      }
    </div>
  )}

  {/* BANISHMENT */}
  {p === PHASES.BANISHMENT && (
    <div className="card crim" style={{ marginTop: 16, position:"relative", overflow:"hidden" }}>
      {[...Array(8)].map((_,i) => (
        <div key={i} style={{ position:"absolute", left:`${5+i*13}%`, bottom:`${i%3*6}px`, width:i%2?4:3, height:i%2?4:3, borderRadius:"50%", background:i%3?"#ff5010":i%2?"#ff9030":"#ff6820", animation:`emberFloat ${1.3+i*.35}s ${i*.2}s ease-out infinite`, pointerEvents:"none", zIndex:0 }} />
      ))}
      <div className="ctitle red">🔥 The Verdict</div>
      {game.lastBanished
        ? (() => {
            const isBanished = game.lastBanished.name === me?.name;
            const suppress = game.lastBanished.suppressRoleReveal;
            return (
              <>
                <div className="ban-reveal" style={{ paddingBottom: 16 }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>{game.lastBanished.emoji}</div>
                  <div className="ban-name" style={{ color: "var(--crim2)" }}>{game.lastBanished.name}</div>
                  <div className="ban-verdict" style={{ color: "var(--text)", marginTop: 12, fontSize: ".85rem", letterSpacing: ".1em" }}>has been banished from the castle.</div>
                </div>
                {isBanished
                  ? suppress
                    ? <div style={{ background: "rgba(139,26,26,.12)", border: "1px solid var(--crim-border)", borderRadius: 3, padding: "18px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🚪</div>
                        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--crim3)", marginBottom: 8 }}>Your Exit</div>
                        <div style={{ fontSize: ".9rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.7 }}>
                          No questions. No answers. You leave in silence.<br />
                          Your role remains your secret — for now.<br />
                          Join the ghosts and watch the game unfold.
                        </div>
                      </div>
                    : <div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 3, padding: "18px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🎤</div>
                        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--gold)", marginBottom: 10 }}>Circle of Truth</div>
                        <div style={{ fontStyle: "italic", color: "var(--gold)", fontSize: "1.05rem", fontWeight: 600, marginBottom: 10 }}>
                          "Are you a Traitor… or are you Faithful?"
                        </div>
                        <div style={{ fontSize: ".88rem", color: "var(--dim)", fontStyle: "italic", lineHeight: 1.6 }}>Answer the host's question. Say whatever else you want. Then take your leave.</div>
                      </div>
                  : <div className="info-box" style={{ textAlign: "center", fontSize: ".85rem" }}>
                      {suppress
                        ? <>{game.lastBanished.name} leaves in silence. No questions asked, no answers given. Watch.</>
                        : <>The host is asking {game.lastBanished.name}: <em>"Are you a Traitor, or are you Faithful?"</em></>
                      }
                    </div>
                }
              </>
            );
          })()
        : <div className="info-box" style={{ textAlign: "center" }}>A tie — no one is banished.</div>
      }
    </div>
  )}

  {/* NIGHT — TRAITOR RECRUIT SELECTION */}
  {p === PHASES.NIGHT_RECRUIT && hasTraitorRole && !isHost && (
    <div className="card night" style={{ marginTop: 16, border: "1px solid rgba(120,0,180,.4)", background: "rgba(20,0,35,.9)" }}>
      <div className="ctitle purple">🤝 Recruitment</div>
      {game.recruitDeclined && (
        <div style={{ background: "rgba(139,26,26,.15)", border: "1px solid rgba(139,26,26,.4)", borderRadius: 3, padding: "10px 14px", marginBottom: 12, fontSize: ".88rem", color: "var(--dim)" }}>
          <strong style={{ color: "var(--crim3)" }}>{game.recruitDeclinedEmoji} {game.recruitDeclinedName}</strong> refused and paid the price. Choose again.
        </div>
      )}
      <div className="info-box purple" style={{ marginBottom: 14 }}>
        You are the last Traitor. Choose a Faithful to recruit. They will be woken and offered a choice: join you, or die.
      </div>
      <div className="pgrid" style={{ marginBottom: 14 }}>
        {alivePlayers.filter(pl => pl.role === "faithful" || pl.role === "seer").map(pl => (
          <div key={pl.id} className={`pcard click ${recruitTarget === pl.id ? "sel" : ""}`} onClick={() => setRecruitTarget(pl.id)}>
            <div className="pavatar">{pl.emoji}</div>
            <div className="pname">{pl.name}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-night btn-lg" onClick={() => submitRecruitTarget(recruitTarget)} disabled={!recruitTarget}>
        Lock In — Recruit {recruitTarget ? alivePlayers.find(pl => pl.id === recruitTarget)?.name : "…"}
      </button>
    </div>
  )}

  {/* NIGHT — FAITHFUL RECRUIT RESPONSE */}
  {p === PHASES.NIGHT_RECRUIT_RESPONSE && isRecruitTarget && !isHost && (
    <div className="card" style={{ marginTop: 16, background: "rgba(20,0,40,.98)", border: "2px solid rgba(140,0,220,.5)", textAlign: "center", padding: "28px 20px", position:"relative", overflow:"hidden" }}>
      {/* Purple shimmer top */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(160,60,255,.8),transparent)", animation:"orbPulse 2.2s ease-in-out infinite" }} />
      {[0,1,2,3].map(i => (
        <div key={i} style={{ position:"absolute", left:`${15+i*22}%`, top:`${4+i%3*5}px`, width:2, height:2, borderRadius:"50%", background:"rgba(200,150,255,.7)", animation:`starTwinkle ${1.5+i*.3}s ${i*.22}s ease-in-out infinite`, pointerEvents:"none" }} />
      ))}
      <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🤝</div>
      <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "#d088ff", marginBottom: 16, lineHeight: 1.4 }}>
        YOU HAVE BEEN<br />RECRUITED BY A TRAITOR
      </div>
      <div style={{ fontSize: ".95rem", color: "rgba(180,130,220,.8)", fontStyle: "italic", lineHeight: 1.8, marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
        A Traitor has chosen you. You can join them in the dark — or refuse and face the consequences.
      </div>
      {me?.shield && (
        <div style={{ background: "linear-gradient(135deg,rgba(30,60,180,.3),rgba(20,40,140,.25))", border: "2px solid rgba(80,120,220,.6)", borderRadius: 6, padding: "16px 18px", marginBottom: 20, textAlign: "left", boxShadow: "0 0 30px rgba(60,100,220,.2)" }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#88aaff", marginBottom: 8 }}>🛡️ You Hold a Shield</div>
          <div style={{ fontSize: ".85rem", color: "rgba(180,200,255,.85)", lineHeight: 1.6 }}>
            If you <strong style={{ color: "#ffffff" }}>decline</strong> this offer, you would normally be murdered immediately.<br /><br />
            <strong style={{ color: "#88aaff" }}>Your Shield changes that.</strong> Declining will block the murder. You survive. Your Shield is spent.
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn btn-gold btn-xl" onClick={acceptRecruitment}>
          ✅ Accept — Join the Traitors
        </button>
        <button className="btn btn-crim btn-xl" onClick={declineRecruitment}>
          ❌ Decline — Face the Consequences
        </button>
      </div>
      <div style={{ fontSize: ".78rem", color: "rgba(140,100,180,.5)", fontStyle: "italic", marginTop: 16 }}>
        Your decision is final. Choose wisely.
      </div>
    </div>
  )}

  {/* NIGHT — SEER INTERROGATION */}
  {p === PHASES.NIGHT_SEER && isSeer && !isHost && (
    <div className="card night" style={{ marginTop: 16, border: "1px solid rgba(100,0,160,.4)", background: "rgba(20,0,35,.9)", position:"relative", overflow:"hidden" }}>
      {/* Stars */}
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{ position:"absolute", left:`${5+i*17}%`, top:`${3+i%4*5}px`, width:i%2?3:2, height:i%2?3:2, borderRadius:"50%", background:"rgba(220,180,255,.8)", animation:`starTwinkle ${1.3+i*.28}s ${i*.18}s ease-in-out infinite`, pointerEvents:"none" }} />
      ))}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(140,60,220,.6),transparent)", animation:"orbPulse 2s ease-in-out infinite" }} />
      <div className="ctitle purple">👁️ The Seer's Vision</div>
      {!game.seerUsed
        ? seerResult
          ? <div style={{ background: seerResult.isTraitor ? "rgba(139,26,26,.2)" : "rgba(20,60,20,.2)", border: seerResult.isTraitor ? "2px solid rgba(139,26,26,.5)" : "2px solid rgba(40,120,40,.4)", borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>{seerResult.emoji}</div>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: seerResult.isTraitor ? "var(--crim2)" : "#80e080", marginBottom: 8 }}>{seerResult.name}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".8rem", letterSpacing: ".15em", textTransform: "uppercase", color: seerResult.isTraitor ? "var(--crim3)" : "#80e080" }}>
                {seerResult.isTraitor ? "🗡️ TRAITOR" : "🛡️ FAITHFUL"}
              </div>
              <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".82rem", marginTop: 10 }}>Remember this. Put your phone face-down.</div>
            </div>
          : <>
              <div className="info-box purple" style={{ marginBottom: 14 }}>
                Tap a player to select them, then choose to reveal or save your power.
              </div>
              <div className="pgrid" style={{ marginBottom: 14 }}>
                {alivePlayers.filter(pl => pl.id !== myId).map(pl => (
                  <div key={pl.id} className={`pcard click ${seerTarget === pl.id ? "sel" : ""}`}
                    onClick={() => { setSeerTarget(pl.id); setSeerLocked(false); }}>
                    <div className="pavatar">{pl.emoji}</div>
                    <div className="pname">{pl.name}</div>
                  </div>
                ))}
              </div>
              {seerTarget
                ? <div className="col" style={{ gap: 8 }}>
                    <button className="btn btn-night btn-lg" onClick={useSeerPower}>
                      👁️ Reveal {alivePlayers.find(pl => pl.id === seerTarget)?.name}'s Role
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ opacity: .7 }} onClick={() => useSeerPower(true)}>
                      Save for another night
                    </button>
                  </div>
                : <button className="btn btn-outline btn-sm" style={{ opacity: .7 }} onClick={() => useSeerPower(true)}>
                    Save for another night
                  </button>
              }
            </>
        : <div className="info-box purple" style={{ textAlign: "center" }}>Your power is saved for another night. Put your phone down and wait for the host.</div>
      }
    </div>
  )}

  {/* NIGHT — SECRET TRAITOR SHORTLIST */}
  {p === PHASES.NIGHT_SECRET_TRAITOR && isSecretTraitor && !isHost && (
    <div className="card night" style={{ marginTop: 16 }}>
      {game.stShortlistSubmitted && game.stBeingRevealedThisNight
        ? <>
            <div className="ctitle purple">You Are About to Be Revealed</div>
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{ fontSize: "3rem", marginBottom: 14 }}>🎭</div>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "#d088ff", marginBottom: 14, lineHeight: 1.4 }}>
                You are about to be revealed<br />to your fellow Traitors,<br />and they to you.
              </div>
              <div style={{ fontStyle: "italic", color: "rgba(180,120,220,.7)", fontSize: ".92rem", lineHeight: 1.8, maxWidth: 320, margin: "0 auto" }}>
                Until now, you have worked alone. That changes tonight.<br /><br />
                Stay awake. Keep your blindfold off. When the host wakes the Traitors, you will meet your new allies — and they will meet you.
              </div>
            </div>
          </>
        : game.stShortlistSubmitted
          ? <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>✅</div>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "#80e080", marginBottom: 8 }}>Shortlist Locked In</div>
              <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".9rem" }}>Blindfold back on. Stay still. The Traitors will be woken shortly.</div>
            </div>
          : <>
              <div className="ctitle purple">Your Shortlist</div>
              <div className="info-box purple" style={{ marginBottom: 14 }}>
                You wake first, alone in the dark. <strong style={{ color: "#d0a0ff" }}>Select exactly 5 players</strong> you want targeted for murder. The Traitors will only be able to choose from your list — they won't know it came from you.
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".12em", color: shortlist.length === 5 ? "#80e080" : "#d088ff", textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>
                {shortlist.length}/5 selected {shortlist.length === 5 ? "— ready to lock in" : `— need ${5 - shortlist.length} more`}
              </div>
              <div className="pgrid" style={{ marginBottom: 14 }}>
                {alivePlayers.filter(pl => pl.role !== "traitor" && pl.id !== myId).map(pl => (
                  <div key={pl.id} className={`pcard click ${shortlist.includes(pl.id) ? "sel" : ""}`}
                    style={{ opacity: !shortlist.includes(pl.id) && shortlist.length >= 5 ? .4 : 1 }}
                    onClick={() => setShortlist(prev => prev.includes(pl.id) ? prev.filter(x => x !== pl.id) : prev.length < 5 ? [...prev, pl.id] : prev)}>
                    <div className="pavatar">{pl.emoji}</div>
                    <div className="pname">{pl.name}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-night btn-lg" onClick={submitShortlist} disabled={shortlist.length !== 5} style={{ marginBottom: 16 }}>
                🔒 Lock In My List ({shortlist.length}/5)
              </button>
              {/* Private ST ↔ Host chat */}
              <div style={{ borderTop: "1px solid rgba(120,0,180,.3)", paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".12em", color: "#d088ff", textTransform: "uppercase", marginBottom: 8 }}>🔒 Private Channel — Host Only</div>
                <div style={{ background: "rgba(10,2,18,.8)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 4, maxHeight: 140, overflowY: "auto", padding: 10, marginBottom: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                  {stChats.length === 0
                    ? <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".8rem", textAlign: "center" }}>Send a message to the host if you have questions.</div>
                    : stChats.map((m, i) => (
                      <div key={i} style={{ background: m.isHost ? "rgba(40,20,60,.4)" : "rgba(80,20,120,.3)", borderLeft: m.isHost ? "2px solid rgba(120,70,180,.5)" : "none", borderRight: m.isHost ? "none" : "2px solid rgba(180,60,240,.5)", borderRadius: 3, padding: "5px 8px", fontSize: ".8rem", textAlign: m.isHost ? "left" : "right" }}>
                        <div style={{ fontSize: ".58rem", color: "#c090ff", marginBottom: 2 }}>{m.sender}</div>
                        {m.text}
                      </div>
                    ))
                  }
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ flex: 1, background: "rgba(15,7,28,.8)", border: "1px solid rgba(80,20,120,.35)", borderRadius: 3, padding: "7px 10px", color: "var(--text)", fontSize: ".85rem", outline: "none" }}
                    placeholder="Ask the host…" value={stChatDraft} onChange={e => setStChatDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") sendStChat(); }} maxLength={200} />
                  <button className="btn btn-sm" style={{ background: "rgba(60,30,80,.5)", border: "1px solid rgba(100,60,140,.4)", color: "#c090ff" }} onClick={sendStChat} disabled={!stChatDraft.trim()}>Send</button>
                </div>
              </div>
            </>
      }
    </div>
  )}

  {/* NIGHT — TRAITOR CHAT */}
  {(p === PHASES.NIGHT_TRAITOR_CHAT || p === PHASES.NIGHT_SECRET_TRAITOR) && canJoinTraitorChat && !isHost && (
    <div className="card night" style={{ marginTop: 16, position:"relative", overflow:"hidden" }}>
      {/* Animated crimson top line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,rgba(139,26,26,.8),rgba(180,40,40,.9),rgba(139,26,26,.8),transparent)", animation:"crimsonPulse 2.5s ease-in-out infinite" }} />
      {/* Floating stars */}
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ position:"absolute", left:`${10+i*20}%`, top:`${4+i%3*6}px`, width:2, height:2, borderRadius:"50%", background:"rgba(200,160,255,.6)", animation:`starTwinkle ${1.4+i*.3}s ${i*.2}s ease-in-out infinite`, pointerEvents:"none" }} />
      ))}
      <div className="ctitle purple">🗡️ The Turret</div>
      {game.recruitedThisNight
        ? <div className="info-box purple" style={{ marginBottom: 12, fontSize: ".85rem" }}>
            🤝 <strong style={{ color: "#d0a0ff" }}>Recruitment Night</strong> — A new Traitor joined tonight. Use this time to introduce yourselves and plan. <strong>No murder can happen on the night of recruitment.</strong>
          </div>
        : <div className="info-box purple" style={{ marginBottom: 12, fontSize: ".85rem" }}>
            Chat and agree on one target. <strong style={{ color: "#d0a0ff" }}>All Traitors must vote the same name — unanimity required.</strong> If the timer runs out without agreement, no murder tonight.
            {game.stShortlist?.length > 0 && <div style={{ marginTop: 6, color: "#c0f0c0" }}>Shortlist: <strong>{game.stShortlist.map(id => game.players.find(pl => pl.id === id)?.name || "?").join(", ")}</strong></div>}
          </div>
      }
      <div className="chat-wrap" style={{ marginBottom: 14 }}>
        <div className="chat-msgs" ref={chatRef}>
          {traitorChats.length === 0 && <div className="italic" style={{ textAlign: "center", fontSize: ".85rem", padding: "12px 0" }}>The Turret is open. Choose your target.</div>}
          {traitorChats.map((m, i) => (
            m.isSystem
              ? <div key={i} style={{ background: "rgba(120,0,180,.25)", border: "1px solid rgba(180,60,255,.4)", borderRadius: 3, padding: "10px 14px", textAlign: "center", animation: "fadeUp .3s ease" }}>
                  <div style={{ fontSize: ".6rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "#d088ff", marginBottom: 6, textTransform: "uppercase" }}>🎭 {m.sender}</div>
                  <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: ".88rem", color: "#e8a0ff", lineHeight: 1.6 }}>{m.text}</div>
                </div>
              : <div key={i} className={`chat-msg ${m.senderId === myId ? "mine" : "other"}`}>
                  <div className={`chat-name ${m.senderId === myId ? "mine" : "other"}`}>{m.name || m.sender}</div>
                  {m.text}
                </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input className="chat-input" placeholder="Plot in the shadows…" value={chatDraft} onChange={e => setChatDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendChat(); }} maxLength={200} />
          <button className="btn btn-night btn-sm" onClick={sendChat} disabled={!chatDraft.trim()}>Send</button>
        </div>
      </div>
      {!hasVotedNight && me?.alive && !game.recruitedThisNight
        ? <>
            {/* 2-Traitor recruitment option — shown when eligible and not yet in recruit mode */}
            {game.canTwoTraitorRecruit && !game.twoTraitorRecruitMode && (() => {
              const myChoice = (game.twoTraitorRecruitVotes || {})[myId];
              const allChoices = Object.values(game.twoTraitorRecruitVotes || {});
              const turretT = alivePlayers.filter(pl => pl.role === "traitor");
              const allVoted = turretT.every(t => (game.twoTraitorRecruitVotes || {})[t.id]);
              const unanimous = allVoted && new Set(allChoices).size === 1;
              return (
                <div style={{ background:"rgba(40,0,80,.2)",border:"1px solid rgba(100,0,180,.35)",borderRadius:4,padding:"12px 14px",marginBottom:12 }}>
                  <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",color:"#c090ff",marginBottom:8 }}>⚡ Conditional Recruitment Available</div>
                  <div style={{ fontSize:".85rem",color:"var(--dim)",marginBottom:10,lineHeight:1.6 }}>Two Traitors remain in the Turret. You may unanimously recruit a Faithful — or proceed to murder as normal.</div>
                  {!myChoice
                    ? <div style={{ display:"flex",gap:8 }}>
                        <button className="btn btn-night btn-sm" style={{ flex:1 }} onClick={() => submitTwoTraitorRecruitChoice("recruit")}>🤝 Vote Recruit</button>
                        <button className="btn btn-crim btn-sm" style={{ flex:1 }} onClick={() => submitTwoTraitorRecruitChoice("murder")}>🗡️ Vote Murder</button>
                      </div>
                    : <div style={{ fontSize:".82rem",color:"var(--dim)",fontStyle:"italic" }}>Your vote: <strong style={{ color:myChoice==="recruit"?"#d0a0ff":"var(--crim3)" }}>{myChoice==="recruit"?"Recruit":"Murder"}</strong> — {allVoted && unanimous ? (allChoices[0]==="recruit"?"✅ Unanimous — switching to recruit mode.":"✅ Unanimous — proceeding to murder.") : "Waiting for your partner…"}</div>
                  }
                </div>
              );
            })()}
            {/* 2-Traitor recruit target selection */}
            {game.canTwoTraitorRecruit && game.twoTraitorRecruitMode && (() => {
              const myTargetVote = (game.twoTraitorTargetVotes || {})[myId];
              const turretT = alivePlayers.filter(pl => pl.role === "traitor");
              const allPicked = turretT.every(t => (game.twoTraitorTargetVotes || {})[t.id]);
              return (
                <div style={{ marginBottom:12 }}>
                  <div className="info-box purple" style={{ marginBottom:10, fontSize:".85rem" }}>
                    🤝 <strong style={{ color:"#d0a0ff" }}>Recruit Mode</strong> — Both agree. Pick the same Faithful to recruit. They'll be offered the chance — one shot, same rules apply.
                  </div>
                  <div className="label">Choose Your Recruit Target</div>
                  <div className="pgrid" style={{ marginBottom:10 }}>
                    {alivePlayers.filter(pl => pl.role==="faithful"||pl.role==="seer").map(pl => (
                      <div key={pl.id} className={`pcard click ${myTargetVote===pl.id?"sel":""}`} onClick={() => submitTwoTraitorTarget(pl.id)}>
                        <div className="pavatar">{pl.emoji}</div>
                        <div className="pname">{pl.name}</div>
                      </div>
                    ))}
                  </div>
                  {allPicked && (
                    <div style={{ fontSize:".82rem",color:game.twoTraitorRecruitTarget?"#80e080":"var(--dim)",fontStyle:"italic" }}>
                      {game.twoTraitorRecruitTarget ? `✅ Unanimous — wait for host to proceed.` : "Waiting for your partner to agree…"}
                    </div>
                  )}
                </div>
              );
            })()}
            {/* Standard murder vote */}
            {!game.twoTraitorRecruitMode && (<>
            <div className="info-box purple" style={{ marginBottom: 12, fontSize: ".85rem" }}>
              You must all lock in the <strong>same target</strong> to commit a murder. If the timer runs out without a unanimous vote, no murder happens tonight.
            </div>
            <div className="label">Choose Your Target</div>
            {game.stShortlist?.length > 0 && (
              <div style={{ background: "rgba(60,0,80,.2)", border: "1px solid rgba(120,0,140,.3)", borderRadius: 3, padding: "8px 12px", marginBottom: 8, fontSize: ".8rem", color: "#d088ff" }}>
                🎭 Vote from the Secret Traitor's shortlist only.
              </div>
            )}
            <div className="pgrid" style={{ marginBottom: 12 }}>
              {(() => {
                const candidates = alivePlayers.filter(pl => pl.role === "faithful" || pl.role === "seer");
                const shortlistIds = game.stShortlist;
                const filtered = shortlistIds?.length > 0 ? candidates.filter(pl => shortlistIds.includes(pl.id)) : candidates;
                return filtered.map(pl => (
                  <div key={pl.id} className={`pcard click ${selectedTarget === pl.id ? "sel" : ""}`} onClick={() => setSelectedTarget(pl.id)}>
                    {pl.shield && <div className="ppip">🛡️</div>}
                    <div className="pavatar">{pl.emoji}</div>
                    <div className="pname">{pl.name}</div>
                  </div>
                ));
              })()}
            </div>
            <button className="btn btn-crim btn-lg" onClick={submitNightVote} disabled={!selectedTarget}>Lock In My Vote</button>
            </>)}
          </>
        : hasVotedNight && (() => {
            const votes = game.nightVotes || {};
            const aliveT = alivePlayers.filter(pl => pl.role === "traitor" || pl.role === "secret_traitor");
            const voteValues = Object.values(votes);
            const unanimous = aliveT.length > 0 && aliveT.every(t => votes[t.id]) && new Set(voteValues).size === 1;
            const myVoteName = game.players?.find(pl => pl.id === votes[myId])?.name;
            return (
              <div>
                <div className="info-box purple" style={{ textAlign: "center", marginBottom: 10 }}>
                  Your vote: <strong style={{ color: "var(--crim3)" }}>{myVoteName}</strong>
                  {unanimous
                    ? <div style={{ color: "#80e080", marginTop: 4 }}>✅ Unanimous — all Traitors agree.</div>
                    : <div style={{ color: "var(--dim)", marginTop: 4, fontSize: ".85rem" }}>{Object.keys(votes).length}/{aliveT.length} voted. Waiting for unanimity…</div>
                  }
                </div>
                {/* Show vote tally to traitors */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {aliveT.map(t => {
                    const targetId = votes[t.id];
                    const targetName = game.players?.find(pl => pl.id === targetId)?.name;
                    return (
                      <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(80,20,120,.2)", border: "1px solid rgba(80,20,120,.3)", borderRadius: 3, fontSize: ".82rem" }}>
                        <span style={{ color: "#c090ff" }}>{t.emoji} {t.name}{t.id === myId ? " (you)" : ""}</span>
                        <span style={{ color: targetId ? "var(--crim3)" : "var(--dim)", fontStyle: targetId ? "normal" : "italic" }}>
                          {targetId ? `→ ${targetName}` : "deciding…"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
      }
    </div>
  )}

  {/* BREAKFAST */}
  {p === PHASES.BREAKFAST && (
    <div className="card phase-enter" style={{ marginTop: 16, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(to right,transparent,rgba(255,180,60,.5),rgba(255,220,100,.7),rgba(255,180,60,.5),transparent)", animation:"pulse 3s ease-in-out infinite" }} />
      <div className="ctitle">🌅 Good Morning, Castle</div>
      {(() => {
        const myGroupIdx = breakfastGroups.findIndex(g => g.includes(myId));
        const hasArrived = myGroupIdx <= breakfastGroupIdx;
        const revealed = game.breakfastRevealed;
        if (hasArrived) {
          return (
            <>
              <div className="info-box" style={{ marginBottom: 14, textAlign: "center" }}>
                {revealed
                  ? game.lastKilled
                    ? <>The seat is empty. <strong style={{ color: "var(--crim3)" }}>{game.lastKilled.name}</strong> was murdered in the night.</>
                    : <><strong style={{ color: "#80e080" }}>You all survived the night.</strong> Every seat is full. Either a shield blocked the murder, or the Traitors couldn't agree.</>
                  : "Look around. Count the seats. Is everyone here? The host will bring more guests soon."}
              </div>
              {/* Photo wall */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginBottom: 10 }}>
                {alivePlayers.map(pl => (
                  <div key={pl.id} style={{ textAlign: "center" }}>
                    <GoldFrame src={avatars?.[pl.id]} emoji={pl.emoji} size={64} />
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".55rem", color: "var(--dim)", marginTop: 4 }}>{pl.name}</div>
                  </div>
                ))}
                {revealed && game.lastKilled && (() => {
                  const killedPlayer = game.players?.find(pl => pl.name === game.lastKilled.name);
                  return (
                    <div style={{ textAlign: "center" }}>
                      <GoldFrame src={avatars?.[killedPlayer?.id]} emoji={game.lastKilled.emoji} size={64} dead redX />
                      <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".55rem", color: "var(--crim3)", marginTop: 4, textDecoration: "line-through" }}>{game.lastKilled.name}</div>
                    </div>
                  );
                })()}
              </div>
            </>
          );
        } else {
          return <div className="info-box" style={{ textAlign: "center" }}>You have not been summoned yet. Stay where you are.</div>;
        }
      })()}
    </div>
  )}

  {/* ENDGAME FREE ROAM */}
  {p === PHASES.ENDGAME_FREE_ROAM && (
    <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "32px 20px", position:"relative", overflow:"hidden" }}>
      {[...Array(10)].map((_,i) => (
        <div key={i} style={{ position:"absolute", left:`${4+i*9.5}%`, bottom:`${i%4*8}px`, width:i%2?5:3, height:i%2?5:3, borderRadius:"50%", background:i%3?"#ff4010":i%2?"#ffaa30":"#ff7020", animation:`emberFloat ${1.6+i*.3}s ${i*.22}s ease-out infinite`, pointerEvents:"none" }} />
      ))}
      <div style={{ fontSize: "3rem", marginBottom: 14, animation:"fireBreath 1.8s ease-in-out infinite" }}>🔥</div>
      <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.4rem", color: "var(--gold)", marginBottom: 10 }}>Final Free Roam</div>
      <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 340, margin: "0 auto 20px" }}>
        Four remain. Use this time wisely. When the host calls — go to the Fire of Truth.
      </div>
      {timerSec > 0 && (
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.5rem", color: timerSec < 60 ? "var(--crim3)" : "var(--gold)", marginBottom: 8 }}>{fmtTime(timerSec)}</div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {me?.shield && <span className="badge b-shield">🛡️ Shielded</span>}
        {me?.dagger && <span className="badge b-dagger">🗡️ Dagger</span>}
      </div>
    </div>
  )}

  {/* FIRE OF TRUTH */}
  {p === PHASES.ENDGAME && (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🔥</div>
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.4rem", color: "var(--gold)" }}>The Fire of Truth</div>
      </div>
      {!endgameChoice && me?.alive
        ? <>
            <div className="info-box" style={{ marginBottom: 14, textAlign: "center" }}>
              Only {alivePlayers.length} remain. Vote in secret — the host reveals each vote to the group.
            </div>
            <div className="endgame-choices">
              <button className="btn btn-gold btn-xl" onClick={() => submitEndgameVote("end")}>✅ End the Game</button>
              <button className="btn btn-crim btn-xl" onClick={() => submitEndgameVote("banish")}>🔄 Banish Again</button>
            </div>
          </>
        : (() => {
            const myVote = game.endgameVotes?.[myId];
            const isEnd = myVote === "end";
            return (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: ".7rem", fontFamily: "'Cinzel',serif", letterSpacing: ".15em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 12 }}>Your Vote — Locked In</div>
                <div style={{ background: isEnd ? "rgba(20,80,20,.2)" : "rgba(139,26,26,.15)", border: isEnd ? "2px solid rgba(60,160,60,.5)" : "2px solid rgba(139,26,26,.5)", borderRadius: 4, padding: "20px 16px", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 900, color: isEnd ? "#80e080" : "var(--crim2)" }}>
                    {isEnd ? "END THE GAME" : "BANISH AGAIN"}
                  </div>
                </div>
                <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".88rem" }}>When the host calls your name, turn this screen toward the group.</div>
              </div>
            );
          })()
      }
    </div>
  )}
</>

);
}


export { PhaseContent };
