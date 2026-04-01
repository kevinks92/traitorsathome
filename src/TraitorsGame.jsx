import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
import { PHASES, ROOMS, PHASE_INSTRUCTIONS, PHASE_STRIP } from "./constants/phases.js";
import { HOST_QUIPS, getQuip } from "./constants/quips.js";
import { BASE_PHASE_TIMERS, getPhaseTimers, PHASE_TIMERS } from "./constants/timers.js";
import { TRIVIA_BANK, NAME5_CATEGORIES, EMOJI_CIPHERS, WHISPER_PHRASES,
         LAST_WORD_CATEGORIES, RELIC_OBJECTS, MISSIONS, HOT_TAKES } from "./constants/content.js";

// ─── Utils ────────────────────────────────────────────────────────────────────
import { generateWitnessQuestions, shuffle, SHIELD_MODE_LABELS,
         EMOJIS, genId, getEmoji, shuffleArray } from "./utils/gameUtils.js";

// ─── Storage ──────────────────────────────────────────────────────────────────
import { save, load } from "./storage.js";

// ─── Styles ───────────────────────────────────────────────────────────────────
import { FONTS, CSS } from "./styles/index.js";

// ─── Subcomponents ────────────────────────────────────────────────────────────
import { PhaseContent }      from "./components/PhaseContent.jsx";
import { PhaseAtmosphere }   from "./components/PhaseAtmosphere.jsx";
import { AnimatedCandles }   from "./components/AnimatedCandles.jsx";
import { GameIntroScreen }   from "./components/GameIntroScreen.jsx";
import { WinnerScreen }      from "./components/WinnerScreen.jsx";
import { HistoryScreen }     from "./components/HistoryScreen.jsx";
import { StatsCard }         from "./components/StatsCard.jsx";
import { TutorialScreen }    from "./components/TutorialScreen.jsx";
import { DemoScreen }        from "./components/DemoScreen.jsx";
import { GameElementToggle } from "./components/GameElementToggle.jsx";
import { AvatarCapture }     from "./components/AvatarCapture.jsx";
import { GoldFrame }         from "./components/GoldFrame.jsx";
import { MsgLog }            from "./components/MsgLog.jsx";
import { GhostChat }         from "./components/GhostChat.jsx";

export default function TraitorsGame() {
const [screen, setScreen] = useState("start");
const [tutorialMode, setTutorialMode] = useState("rules");
const [tutorialStep, setTutorialStep] = useState(0);
const [joinTab, setJoinTab] = useState("join");
const [playerName, setPlayerName] = useState("");
const [joinId, setJoinId] = useState("");
const [game, setGame] = useState(null);
const [messages, setMessages] = useState([]);
const [myId, setMyId] = useState(null);
const [gameId, setGameId] = useState("");
const [isHost, setIsHost] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [copied, setCopied] = useState(false);
const [recentGames, setRecentGames] = useState([]); // [{gId, name, host, playerCount, ts}]

// Host settings
const [traitorCount, setTraitorCount] = useState(2);
const [gameDuration, setGameDuration] = useState(4); // hours: 3, 4, 5, or 6
const [secretTraitorEnabled, setSecretTraitorEnabled] = useState(false);
const [manualTraitorIds, setManualTraitorIds] = useState([]); // empty = let fate decide
const [manualSTId, setManualSTId] = useState(null); // null = random ST
const [showInventory, setShowInventory] = useState(false);
const [showMyRole, setShowMyRole] = useState(false);
const [showPlayerPanel, setShowPlayerPanel] = useState(false);
// Phase transition overlay state
const [phaseTransition, setPhaseTransition] = useState(null); // {icon, title, sub, color, duration}
const [phaseKey, setPhaseKey] = useState(0); // increment on phase change to trigger CSS re-animation
const [deathLetter, setDeathLetter] = useState(false); // murder reveal letter for victim
const [seerEnabled, setSeerEnabled] = useState(true);
const [daggerEnabled, setDaggerEnabled] = useState(true);
const [stRevealPlayerIdx, setStRevealPlayerIdx] = useState(0); // which player is currently being revealed during ST selection
const [stRevealResult, setStRevealResult] = useState(null);    // what this player's screen shows during ST selection

// Game UI state
const [selectedTarget, setSelectedTarget] = useState(null);
const [selectedMission, setSelectedMission] = useState(null);
const [missionFilter, setMissionFilter] = useState("all");
const [dmTriviaQ, setDmTriviaQ] = useState(0);
const [dmTriviaScores, setDmTriviaScores] = useState({});
const [dmTriviaBank, setDmTriviaBank] = useState([]);
const [dmBuzzerWinner, setDmBuzzerWinner] = useState(null);
const [dmForbiddenWords, setDmForbiddenWords] = useState({});
const [dmForbiddenElim, setDmForbiddenElim] = useState([]);
const [dmAuctionBids, setDmAuctionBids] = useState({});
const [dmAuctionRevealed, setDmAuctionRevealed] = useState(false);
const [dmWhisperPhrase, setDmWhisperPhrase] = useState("");
const [dmEmojiIdx, setDmEmojiIdx] = useState(0);
const [dmName5Idx, setDmName5Idx] = useState(0);
const [dmName5Round, setDmName5Round] = useState(0);
const [dmName5Scores, setDmName5Scores] = useState({});
const [dmRpsBracket, setDmRpsBracket] = useState([]);
const [dmRpsRound, setDmRpsRound] = useState(0);
const [dmHotTakeIdx, setDmHotTakeIdx] = useState(0);
const [dmHotTakeVotes, setDmHotTakeVotes] = useState({});
const [dmDrawWinner, setDmDrawWinner] = useState(null);
const [dmWitnessQs, setDmWitnessQs] = useState([]);
const [dmWitnessQ, setDmWitnessQ] = useState(0);
const [dmWitnessScores, setDmWitnessScores] = useState({});
const [dmSecretBallotVotes, setDmSecretBallotVotes] = useState({});
const [dmLastWordCat, setDmLastWordCat] = useState(null);
const [dmLastWordElim, setDmLastWordElim] = useState([]);
const [dmRelicObject, setDmRelicObject] = useState(null);
const [myRoom, setMyRoom] = useState("living");
const [timerSec, setTimerSec] = useState(0);
const [pauseElapsed, setPauseElapsed] = useState(0);
const pauseRef = useRef(null);
const [timerMax, setTimerMax] = useState(0);
const [timerRunning, setTimerRunning] = useState(false);

// Night chat
const [chatDraft, setChatDraft] = useState("");
const [traitorChats, setTraitorChats] = useState([]);
const [ghostChats, setGhostChats] = useState([]);
const [ghostDraft, setGhostDraft] = useState("");
const [stChatDraft, setStChatDraft] = useState("");
const [stChats, setStChats] = useState([]);
const [seerChats, setSeerChats] = useState([]);
const [seerDraft, setSeerDraft] = useState("");
const [recruitChats, setRecruitChats] = useState([]);
const [recruitDraft, setRecruitDraft] = useState("");

// Shortlist (secret traitor)
const [shortlist, setShortlist] = useState([]);
const [recruitTarget, setRecruitTarget] = useState(null); // traitor's recruit pick

// Seer
const [seerResult, setSeerResult] = useState(null);
const [seerTarget, setSeerTarget] = useState(null);
const [seerLocked, setSeerLocked] = useState(false); // two-step: select then lock then reveal
const [seerExplain, setSeerExplain] = useState(null); // private explanation shown on award
const [showSeerModal, setShowSeerModal] = useState(false);

// Modals
const [showBanishModal, setShowBanishModal] = useState(false);
const [showMurderModal, setShowMurderModal] = useState(false);

// Endgame
const [endgameChoice, setEndgameChoice] = useState(null);

// Breakfast groups
const [breakfastGroupIdx, setBreakfastGroupIdx] = useState(0);

// Privacy mode
const [privacyMode, setPrivacyMode] = useState(false);

// Connection status
const [isOnline, setIsOnline] = useState(true);
const lastSyncRef = useRef(Date.now());

// Avatar capture
const [showAvatarCapture, setShowAvatarCapture] = useState(false);
const [myAvatar, setMyAvatar] = useState(null); // base64 data URL
const [avatars, setAvatars] = useState({}); // { playerId: dataURL }

const pollRef = useRef(null);
const timerRef = useRef(null);
const prevPhaseRef = useRef(null);
const chatRef = useRef(null);

const me = game?.players?.find(p => p.id === myId);
const alivePlayers = game?.players?.filter(p => p.alive) || [];
const deadPlayers = game?.players?.filter(p => !p.alive) || [];
const aliveTraitors = alivePlayers.filter(p => p.role === "traitor" || p.role === "secret_traitor");
const phaseTimers = game?.phaseDurations || PHASE_TIMERS;
const aliveFaithful = alivePlayers.filter(p => p.role === "faithful" || p.role === "seer");
const isTraitor = me?.role === "traitor";
const isSecretTraitor = me?.role === "secret_traitor";
const hasTraitorRole = isTraitor || isSecretTraitor;
const isGhost = me && !me.alive; // banished or murdered player
const isSeer = me?.seerRole;
const knownAllies = isTraitor ? alivePlayers.filter(p => p.role === "traitor" && p.id !== myId) : [];
const currentMission = game?.currentMission ? MISSIONS.find(m => m.id === game.currentMission) : null;
const secretTraitorRevealedInChat = game?.secretTraitorRevealedInChat || false;
const canJoinTraitorChat = isTraitor || (isSecretTraitor && secretTraitorRevealedInChat);

// ── SESSION PERSISTENCE — rejoin on page refresh ────────────────────────────
useEffect(() => {
const tryRejoin = async () => {
try {
// Load recent games list for recall UI (localStorage = per-device)
try {
  const raw = localStorage.getItem("traitors-recent-games");
  if (raw) setRecentGames(JSON.parse(raw));
} catch(e) {}

const sess = await load("traitors-session");
if (!sess) return;
const { gId, pId, host, name } = sess;
const g = await load(gId);
if (!g) return;
setGame(g); setGameId(gId); setMyId(pId); setIsHost(!!host);
setPlayerName(name || ""); setScreen("game");
} catch(e) {}
};
tryRejoin();
}, []);

// ── POLLING ────────────────────────────────────────────────────────────────
useEffect(() => {
if (!gameId) return;
const poll = async () => {
try {
const g = await load(gameId);
if (!g) return;
lastSyncRef.current = Date.now();
setIsOnline(true);
const prevPhase = prevPhaseRef.current;
prevPhaseRef.current = g.phase;
setGame(g);
const msgs = await load(gameId + "-msgs");
if (msgs) setMessages(msgs);
const chats = await load(gameId + "-traitor-chat");
if (chats) { setTraitorChats(chats); if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }
const gChats = await load(gameId + "-ghost-chat");
if (gChats) setGhostChats(gChats);
// Poll ST chat only during ST shortlist phase
if (g.phase === PHASES.NIGHT_SECRET_TRAITOR) {
const stC = await load(gameId + "-st-chat");
if (stC) setStChats(stC);
}
// Poll seer chat during seer phase (seer player + host + ghosts)
if (g.phase === PHASES.NIGHT_SEER && (isHost || me?.seerRole || (me && !me.alive))) {
const sC = await load(gameId + "-seer-chat");
if (sC) setSeerChats(sC);
} else if (g.phase !== PHASES.NIGHT_SEER) {
setSeerChats([]);
}
// Poll recruit chat during recruit response phase (recruit target + host + ghosts)
if (g.phase === PHASES.NIGHT_RECRUIT_RESPONSE && (isHost || (me && g.recruitTargetId === myId) || (me && !me.alive))) {
const rC = await load(gameId + "-recruit-chat");
if (rC) setRecruitChats(rC);
} else if (g.phase !== PHASES.NIGHT_RECRUIT_RESPONSE) {
setRecruitChats([]);
}
const seerR = await load(gameId + "-seer-" + myId);
if (seerR && !seerResult) setSeerResult(seerR);
const seerEx = await load(gameId + "-seer-explain-" + myId);
if (seerEx && !seerExplain) setSeerExplain(seerEx);
// Poll for ST reveal result during ST selection phase
if (g.phase === PHASES.SECRET_TRAITOR_SELECTION) {
const stR = await load(gameId + "-st-reveal-" + myId);
if (stR) setStRevealResult(stR);
} else if (stRevealResult) {
setStRevealResult(null); // clear once phase moves on
}

  if (prevPhase !== g.phase) {
    if (g.phase === PHASES.BANISHMENT) setShowBanishModal(true);
    if (g.phase === PHASES.BREAKFAST) setShowMurderModal(false);
    if (g.phase === PHASES.NIGHT_SEQUESTER) setShortlist([]); // reset ST shortlist each new night
    setSelectedTarget(null);
    stopTimer();
    setSeerResult(null); // clear seer result between phases
    setSeerLocked(false); // clear lock state between phases
    // Increment phaseKey to trigger CSS re-animation on player screens
    setPhaseKey(k => k + 1);
    // Phase transition overlay for players
    if (!isHost) {
      const transMap = {
        [`${PHASES.MISSION_ACTIVE}_${PHASES.FREE_ROAM}`]: { icon:"🏰", title:"Mission Complete", sub:"The castle is yours. Go wherever you like — the scheming begins.", color:"var(--gold)", duration:2400 },
        [`${PHASES.FREE_ROAM}_${PHASES.ROUND_TABLE}`]: { icon:"🕯️", title:"The Time for Scheming is Over", sub:"Make your way to the Round Table — the banishment ceremony awaits.", color:"var(--gold)", duration:2800 },
        [`${PHASES.ROUND_TABLE}_${PHASES.VOTING}`]: { icon:"🗳️", title:"It's Time to Vote", sub:"Phones out. No conferring. Trust no one. Lock it in.", color:"var(--crim3)", duration:2400 },
        [`${PHASES.BANISHMENT}_${PHASES.NIGHT_SEQUESTER}`]: { icon:"🌙", title:"Time to Go to Bed", sub:"Make your way to the night sequester room. Put on your blindfold and wait.", color:"#c090ff", duration:3000 },
        [`${PHASES.BREAKFAST}_${PHASES.MISSION_BRIEFING}`]: { icon:"⚔️", title:"A New Day Begins", sub:"The morning is over. A new mission — and new suspicions — await.", color:"var(--gold)", duration:2400 },
        [`${PHASES.BREAKFAST}_${PHASES.FREE_ROAM}`]: { icon:"🔥", title:"The Final Morning is Over", sub:"The last roam before the Fire of Truth. Make it count.", color:"var(--gold)", duration:2400 },
        [`${PHASES.NIGHT_TRAITOR_CHAT}_${PHASES.BREAKFAST}`]: { icon:"🌅", title:"Dawn Breaks Over the Castle", sub:"The night is over. Make your way to breakfast.", color:"var(--gold)", duration:2400 },
        [`${PHASES.MISSION_BRIEFING}_${PHASES.MISSION_ACTIVE}`]: { icon:"⚔️", title:"The Mission Begins", sub:"Compete well. Win suspiciously. Or lose strategically.", color:"var(--gold)", duration:2000 },
        [`${PHASES.ENDGAME_FREE_ROAM}_${PHASES.ENDGAME}`]: { icon:"🔥", title:"The Fire of Truth", sub:"The final gathering. Only honesty — or a very convincing lie — will do.", color:"var(--crim3)", duration:2800 },
        [`${PHASES.NIGHT_SECRET_TRAITOR}_${PHASES.NIGHT_TRAITOR_CHAT}`]: { icon:"🗡️", title:"The Turret Convenes", sub:"The castle holds its breath. The wolves are awake.", color:"#c090ff", duration:2000 },
        [`${PHASES.ROLE_REVEAL}_${PHASES.MISSION_BRIEFING}`]: { icon:"🏰", title:"The Game Has Begun", sub:"Whatever you just read — bury it. Keep your face still. Trust no one.", color:"var(--gold)", duration:2800 },
        [`${PHASES.GAME_INTRO}_${PHASES.SECRET_TRAITOR_SELECTION}`]: { icon:"🎭", title:"The Ceremony Begins", sub:"Step forward when the host calls your name. Look everyone in the eye.", color:"#c090ff", duration:2600 },
        [`${PHASES.GAME_INTRO}_${PHASES.ROLE_REVEAL}`]: { icon:"🌙", title:"Blindfolds On", sub:"Stay seated. Stay silent. Whatever happens next — do not react.", color:"#c090ff", duration:2600 },
      };
      const key = `${prevPhase}_${g.phase}`;
      if (transMap[key]) {
        const t = transMap[key];
        setPhaseTransition(t);
        setTimeout(() => setPhaseTransition(null), t.duration);
      }
      // Murder letter — check if this player was killed
      if (g.phase === PHASES.BREAKFAST && g.breakfastRevealed && g.lastKilled) {
        const killed = g.players?.find(p => p.name === g.lastKilled.name);
        if (killed?.id === myId) setDeathLetter(true);
      }
    }
    // Auto-start timer for new phase using game's scaled durations
    const timers = g.phaseDurations || PHASE_TIMERS;
    const mins = timers[g.phase];
    if (mins) startTimer(mins * 60);
  }
  // Also check murder letter on breakfast reveal (even without phase change)
  if (!isHost && g.phase === PHASES.BREAKFAST && g.breakfastRevealed && g.lastKilled && !deathLetter) {
    const killed = g.players?.find(p => p.name === g.lastKilled.name);
    if (killed?.id === myId) setDeathLetter(true);
  }
  if (g.rooms?.[myId]) setMyRoom(g.rooms[myId]);
  // Poll avatars for all players
  try {
    const avKey = gameId + "-avatars";
    const avR = await load(avKey);
    if (avR) setAvatars(avR);
  } catch(e) {}
  } catch(e) { setIsOnline(false); }
};
poll();
pollRef.current = setInterval(poll, 2200);
return () => clearInterval(pollRef.current);

}, [gameId, myId]);

// ── LOBBY HEARTBEAT ────────────────────────────────────────────────────────
// Each player pings every 5s. Host's poll evicts anyone silent for 15s.
useEffect(() => {
if (!gameId || !myId || !game || game.phase !== PHASES.LOBBY) return;
const ping = () => save(gameId + "-hb-" + myId, Date.now());
ping();
const iv = setInterval(ping, 5000);
return () => clearInterval(iv);
}, [gameId, myId, game?.phase]);

useEffect(() => {
if (!gameId || !isHost || !game || game.phase !== PHASES.LOBBY) return;
const checkHeartbeats = async () => {
  try {
    const now = Date.now();
    const stale = [];
    for (const p of game.players) {
      const ts = await load(gameId + "-hb-" + p.id);
      if (ts && now - ts > 15000) stale.push(p.id);
    }
    if (stale.length === 0) return;
    const g = await load(gameId);
    if (!g || g.phase !== PHASES.LOBBY) return;
    const updated = { ...g, players: g.players.filter(p => !stale.includes(p.id)) };
    await save(gameId, updated);
    setGame(updated);
  } catch(e) {}
};
const iv = setInterval(checkHeartbeats, 8000);
return () => clearInterval(iv);
}, [gameId, isHost, game?.phase, game?.players?.length]);

// ── TIMER ──────────────────────────────────────────────────────────────────
const startTimer = useCallback((seconds) => {
if (timerRef.current) clearInterval(timerRef.current);
setTimerMax(seconds); setTimerSec(seconds); setTimerRunning(true);
timerRef.current = setInterval(() => {
setTimerSec(s => { if (s <= 1) { clearInterval(timerRef.current); setTimerRunning(false); return 0; } return s - 1; });
}, 1000);
}, []);
const stopTimer = useCallback(() => { if (timerRef.current) clearInterval(timerRef.current); setTimerRunning(false); }, []);

const togglePause = async () => {
const g = await load(gameId);
const nowPaused = !g.paused;
const pausedAt = nowPaused ? Date.now() : null;
const updated = { ...g, paused: nowPaused, pausedAt };
await save(gameId, updated); setGame(updated);
if (nowPaused) { stopTimer(); setPauseElapsed(0); }
else { if (g.timerSec > 0) startTimer(g.timerSec); clearInterval(pauseRef.current); }
};

// Tick the pause elapsed clock
useEffect(() => {
if (game?.paused && game?.pausedAt) {
clearInterval(pauseRef.current);
pauseRef.current = setInterval(() => {
setPauseElapsed(Math.floor((Date.now() - game.pausedAt) / 1000));
}, 1000);
} else {
clearInterval(pauseRef.current);
setPauseElapsed(0);
}
return () => clearInterval(pauseRef.current);
}, [game?.paused, game?.pausedAt]);
useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const timerPct = timerMax > 0 ? (timerSec / timerMax) * 100 : 0;
const timerClass = timerPct < 15 ? "urgent" : timerPct < 30 ? "warn" : "";

// ── STORAGE HELPERS ────────────────────────────────────────────────────────
const addMsg = async (gKey, msg) => {
const msgs = (await load(gKey + "-msgs")) || [];
msgs.push({ ...msg, ts: Date.now() });
await save(gKey + "-msgs", msgs);
};

// ── CREATE / JOIN ──────────────────────────────────────────────────────────
const createGame = async () => {
if (!playerName.trim()) return setError("Enter your name");
setLoading(true);
const gId = genId();
const hId = genId();
const g = {
id: gId, hostId: hId, phase: PHASES.LOBBY,
players: [{ id: hId, name: playerName.trim(), emoji: getEmoji(playerName), role: null, alive: true, shield: false, dagger: false, seerRole: false }],
nightVotes: {}, dayVotes: {}, endgameVotes: {},
round: 0, currentMission: null,
lastKilled: null, lastBanished: null, winner: null,
rooms: { [hId]: "living" },
secretTraitorEnabled: false,
breakfastGroups: [],
breakfastGroupIdx: 0,
secretTraitorRevealCycle: 0,
secretTraitorRevealedInChat: false,
currentRound: 0,
};
await save(gId, g);
await save(gId + "-msgs", []);
await save(gId + "-traitor-chat", []);
await save(gId + "-ghost-chat", []);
setGame(g); setGameId(gId); setMyId(hId);
setIsHost(true); setScreen("game"); setLoading(false); setError("");
try {
  await save("traitors-session", { gId, pId: hId, host: true, name: playerName.trim() });
  const prev = JSON.parse(localStorage.getItem("traitors-recent-games") || "[]");
  const entry = { gId, pId: hId, name: playerName.trim(), host: true, ts: Date.now() };
  const updated = [entry, ...prev.filter(r => r.gId !== gId)].slice(0, 5);
  localStorage.setItem("traitors-recent-games", JSON.stringify(updated));
  setRecentGames(updated);
} catch(e) {}
};

const joinGame = async () => {
if (!playerName.trim()) return setError("Enter your name");
if (!joinId.trim()) return setError("Enter a Game ID");
setLoading(true);
const key = joinId.trim().toUpperCase();
const g = await load(key);
if (!g) { setLoading(false); return setError("Game not found."); }
if (g.phase !== PHASES.LOBBY) {
const sId = genId();
setGame(g); setGameId(key); setMyId(sId);
setIsHost(false); setScreen("game"); setLoading(false); setError("");
try { await save("traitors-session", { gId: key, pId: sId, host: false, name: playerName.trim() }); } catch(e) {}
return;
}
if (g.players.length >= 24) { setLoading(false); return setError("Game is full — maximum 24 players."); }
if (g.players.find(p => p.name.toLowerCase() === playerName.trim().toLowerCase())) { setLoading(false); return setError("Name already taken."); }
const pId = genId();
const updated = { ...g, players: [...g.players, { id: pId, name: playerName.trim(), emoji: getEmoji(playerName), role: null, alive: true, shield: false, dagger: false, seerRole: false }], rooms: { ...g.rooms, [pId]: "living" } };
await save(key, updated);
setGame(updated); setGameId(key); setMyId(pId);
setIsHost(false); setScreen("game"); setLoading(false); setError("");
try {
  await save("traitors-session", { gId: key, pId, host: false, name: playerName.trim() });
  const prev = JSON.parse(localStorage.getItem("traitors-recent-games") || "[]");
  const entry = { gId: key, pId, name: playerName.trim(), host: false, ts: Date.now() };
  const upd = [entry, ...prev.filter(r => r.gId !== key)].slice(0, 5);
  localStorage.setItem("traitors-recent-games", JSON.stringify(upd));
  setRecentGames(upd);
} catch(e) {}
};

// ── START GAME ─────────────────────────────────────────────────────────────
const startGame = async () => {
// Require all players to have submitted avatars
const avKey = gameId + "-avatars";
const avRaw = await load(avKey).catch(()=>null);
const avMap = avRaw || {};
const missingAvatars = game.players.filter(p => !avMap[p.id] && p.id !== myId && !myAvatar);
// Just check the count — host can override if needed
if (!game || game.players.length < 10) return setError("Need at least 10 players to start");
const cleanManual = manualTraitorIds.filter(id => id !== 'select');
const tc = cleanManual.length > 0 ? cleanManual.length : Math.min(traitorCount, Math.floor(game.players.length / 3));
const n = game.players.length;

// Each round removes ~2 players (1 banishment + 1 murder).
// We need (n - 4) eliminations to reach the final 4.
// That takes ceil((n-4)/2) rounds.
const totalRounds = Math.max(1, Math.ceil((n - 4) / 2));

// Secret Traitor reveal happens in first half of game, randomly
const maxRevealRound = Math.max(1, Math.floor(totalRounds / 2));
const revealCycle = Math.floor(Math.random() * maxRevealRound) + 1;

// Assign traitor/faithful roles — ST pending, assigned during ceremony
let shuffled = shuffleArray(game.players);
let withRoles;
if (cleanManual.length > 0) {
  withRoles = shuffled.map(p => ({ ...p, role: cleanManual.includes(p.id) ? "traitor" : "faithful" }));
} else {
  withRoles = shuffled.map((p, i) => ({ ...p, role: i < tc ? "traitor" : "faithful" }));
}

// Pre-pick the secret traitor (a random faithful) but don't reveal yet
let stCandidateId = null;
if (secretTraitorEnabled) {
  if (manualSTId && withRoles.find(p => p.id === manualSTId && p.role === "faithful")) {
    stCandidateId = manualSTId;
  } else {
    const faithfuls = withRoles.filter(p => p.role === "faithful");
    if (faithfuls.length > 0) stCandidateId = faithfuls[Math.floor(Math.random() * faithfuls.length)].id;
  }
}

const nextPhase = PHASES.GAME_INTRO;
const phaseDurations = getPhaseTimers(gameDuration);

// m25 (The Witness) is always the Seer mission — locked until halfway through the game
// Dagger is randomly assigned from shield missions
const shieldMissions = MISSIONS.filter(m => m.id !== "m25" && (m.shieldMode === "hidden_winner" || m.shieldMode === "public" || m.shieldMode === "team_hidden" || m.shieldMode === "all_know"));
const shuffledMissions = shuffleArray(shieldMissions);
const daggerMissionId = daggerEnabled ? (shuffledMissions[0]?.id || null) : null;
const seerMissionId = seerEnabled ? "m25" : null;

const updated = {
  ...game,
  phase: nextPhase,
  players: withRoles,
  round: 1, currentRound: 1,
  totalRounds,
  gameDuration,
  phaseDurations,
  daggerMissionId,
  seerMissionId,
  daggerAwarded: false,
  seerAwarded: false,
  secretTraitorEnabled,
  startingTraitorCount: withRoles.filter(p => p.role === "traitor" || p.role === "secret_traitor").length,
  seerEnabled,
  daggerEnabled,
  secretTraitorRevealCycle: revealCycle,
  secretTraitorRevealedInChat: false,
  rolesReleased: false,
  roleRevealStep: "tapping",
  stCandidateId,            // host-only: who will be secret traitor
  stSelectionIdx: 0,        // which player is currently up for ST reveal
  stSelectionDone: false,
};
await save(gameId, updated);
await addMsg(gameId, { type: "system", text: `⚔️ The castle doors close. ${tc} Traitor${tc > 1 ? "s" : ""} walk among you. Good luck. You'll need it.` });
setGame(updated);

};

// ── HOST PHASE ADVANCES ────────────────────────────────────────────────────
const advanceTo = async (newPhase, extraData = {}) => {
const g = await load(gameId);
// Save phase history for go-back (keep last 5)
const phaseHistory = [...(g.phaseHistory || []), g.phase].slice(-5);
const updated = { ...g, phase: newPhase, phaseHistory, ...extraData };
await save(gameId, updated);
setGame(updated);
const timers = g.phaseDurations || PHASE_TIMERS;
const mins = timers[newPhase];
if (mins) startTimer(mins * 60);
};

const goBackPhase = async () => {
const g = await load(gameId);
const history = g.phaseHistory || [];
if (history.length === 0) return;
const prevPhase = history[history.length - 1];
const newHistory = history.slice(0, -1);
const updated = { ...g, phase: prevPhase, phaseHistory: newHistory };
await save(gameId, updated); setGame(updated);
stopTimer();
};

// Host: reveal current player's ST status during ceremony
// Sends a private result to that player's screen, then advances to next player
const stRevealPlayer = async (playerId) => {
const g = await load(gameId);
const isTheOne = playerId === g.stCandidateId;
// Write private result for this player to read on their screen
await save(gameId + "-st-reveal-" + playerId, { isSecretTraitor: isTheOne, ts: Date.now() });
setGame(g); // refresh
};

const stAdvanceToNext = async () => {
const g = await load(gameId);
const nextIdx = (g.stSelectionIdx || 0) + 1;
if (nextIdx >= g.players.length) {
// All players revealed — now lock in ST role and move to role reveal
const withST = g.players.map(p => p.id === g.stCandidateId ? { ...p, role: "secret_traitor" } : p);
const updated = { ...g, players: withST, stSelectionDone: true, phase: PHASES.ROLE_REVEAL, stSelectionIdx: nextIdx };
await addMsg(gameId, { type: "system", text: "🎭 The Secret Traitor has been chosen. They know who they are. Nobody else does. Yet." });
await save(gameId, updated);
setGame(updated);
} else {
const updated = { ...g, stSelectionIdx: nextIdx };
await save(gameId, updated);
setGame(updated);
}
};

const stSkipSelection = async () => {
// Advance straight to role reveal without ST selection (host abort)
const g = await load(gameId);
const updated = { ...g, phase: PHASES.ROLE_REVEAL, stSelectionDone: true };
await save(gameId, updated);
setGame(updated);
};

const releaseRoles = async () => {
const g = await load(gameId);
const updated = { ...g, rolesReleased: true, roleRevealStep: "silence" };
await save(gameId, updated);
setGame(updated);
startTimer(60);
};

const finishRoleReveal = async () => {
const g = await load(gameId);
const updated = { ...g, roleRevealStep: "done" };
await save(gameId, updated);
setGame(updated);
};

const hostStartMission = async () => {
if (!selectedMission) return;
const m = MISSIONS.find(x => x.id === selectedMission);
// Init digital mission state
setDmTriviaQ(0); setDmTriviaScores({}); setDmBuzzerWinner(null);
setDmForbiddenElim([]); setDmAuctionBids({}); setDmAuctionRevealed(false);
setDmName5Round(0); setDmName5Scores({}); setDmRpsBracket([]); setDmRpsRound(0);
setDmHotTakeVotes({}); setDmDrawWinner(null);
setDmWitnessQs([]); setDmWitnessQ(0); setDmWitnessScores({});
setDmSecretBallotVotes({});
setDmLastWordElim([]); setDmLastWordCat(null); setDmRelicObject(null);
if (m?.digitalType === "last_word") {
const cat = LAST_WORD_CATEGORIES[Math.floor(Math.random() * LAST_WORD_CATEGORIES.length)];
setDmLastWordCat(cat);
}
if (m?.digitalType === "the_relic") {
const obj = RELIC_OBJECTS[Math.floor(Math.random() * RELIC_OBJECTS.length)];
setDmRelicObject(obj);
}
if (m?.digitalType === "trivia_scored" || m?.digitalType === "trivia_buzzer") {
const shuffled = [...TRIVIA_BANK].sort(() => Math.random() - 0.5).slice(0, 10);
setDmTriviaBank(shuffled);
}
if (m?.digitalType === "forbidden_word") {
const wordPool = ["castle","shadow","trust","knife","night","secret","vote","shield","traitor","innocent","never","always","guilty","obvious","honest","blood","dark","silent","hidden","certain"];
const words = {}; const g = await load(gameId);
const alive = (g.players||[]).filter(p=>p.alive);
const shuffled = [...wordPool].sort(()=>Math.random()-0.5);
alive.forEach((pl,i) => { words[pl.id] = shuffled[i % shuffled.length]; });
setDmForbiddenWords(words);
// Push each word privately via storage
for (const [pid, word] of Object.entries(words)) {
await save(gameId + "-fw-" + pid, word);
}
}
if (m?.digitalType === "whisper_chain") {
const phrase = WHISPER_PHRASES[Math.floor(Math.random() * WHISPER_PHRASES.length)];
setDmWhisperPhrase(phrase);
// Will be sent to team leaders by host tapping
}
if (m?.digitalType === "emoji_cipher") {
const eidx = Math.floor(Math.random() * EMOJI_CIPHERS.length);
setDmEmojiIdx(eidx);
await save(gameId + "-emoji-cipher", EMOJI_CIPHERS[eidx].emoji);
}
if (m?.digitalType === "name5") {
const nidx = Math.floor(Math.random() * NAME5_CATEGORIES.length);
setDmName5Idx(nidx);
setDmName5Round(0); setDmName5Scores({});
await save(gameId + "-name5-cat", NAME5_CATEGORIES[nidx].cat);
}
if (m?.digitalType === "rps_bracket") {
const g = await load(gameId);
const alive = (g.players||[]).filter(p=>p.alive).map(p=>p.id);
const shuffled = [...alive].sort(()=>Math.random()-0.5);
setDmRpsBracket(shuffled);
}
if (m?.digitalType === "hot_take") {
const htIdx = Math.floor(Math.random() * HOT_TAKES.length);
setDmHotTakeIdx(htIdx);
await save(gameId + "-hot-take", HOT_TAKES[htIdx]);
}
if (m?.digitalType === "the_draw") {
const g = await load(gameId);
const alive = (g.players||[]).filter(p=>p.alive);
const winner = alive[Math.floor(Math.random() * alive.length)];
setDmDrawWinner(winner?.id || null);
if (winner) await save(gameId + "-draw-winner", winner.id);
}
if (m?.digitalType === "the_witness") {
const g = await load(gameId);
const qs = generateWitnessQuestions(g, g.players||[]);
setDmWitnessQs(qs); setDmWitnessQ(0); setDmWitnessScores({});
// Push questions to player phones (strip opts function — not serialisable)
const qsForPlayers = qs.map((q, i) => ({ q: q.q, a: q.a, opts: q.opts ? q.opts() : [q.a], idx: i }));
await save(gameId + "-witness-qs", qsForPlayers);
await save(gameId + "-witness-answers", {});
}
if (m?.digitalType === "secret_ballot") {
await save(gameId + "-ballot-votes", {});
}
await advanceTo(PHASES.MISSION_ACTIVE, { currentMission: selectedMission });
setSelectedMission(null);
};

const castleMsg = async (text) => {
try {
const msgs = (await load(gameId + "-ghost-chat")) || [];
msgs.push({ sender: "🏰 THE CASTLE", senderId: "system", text, ts: Date.now(), isSystem: true });
await save(gameId + "-ghost-chat", msgs);
setGhostChats([...msgs]);
} catch(e) {}
};

const sendSeerChat = async () => {
if (!seerDraft.trim()) return;
const name = isHost ? "🏰 Host" : (me?.name || "Seer");
const msgs = (await load(gameId + "-seer-chat")) || [];
msgs.push({ sender: name, senderId: myId, text: seerDraft.trim(), ts: Date.now() });
await save(gameId + "-seer-chat", msgs);
setSeerChats(msgs); setSeerDraft("");
};

const sendRecruitChat = async () => {
if (!recruitDraft.trim()) return;
const msgs = (await load(gameId + "-recruit-chat")) || [];
const name = isHost ? "🏰 Host" : (me?.name || "Recruit");
msgs.push({ sender: name, senderId: myId, text: recruitDraft.trim(), ts: Date.now() });
await save(gameId + "-recruit-chat", msgs);
setRecruitChats(msgs); setRecruitDraft("");
};

const awardPower = async (pId, power, shieldMode) => {
const g = await load(gameId);
let updated;
if (power === "shield") {
// Max 25% of alive players can hold shields at once
const alive = g.players.filter(p => p.alive);
const maxShields = Math.max(1, Math.floor(alive.length * 0.25));
const currentShields = alive.filter(p => p.shield).length;
if (currentShields >= maxShields) return;
const winnerPlayer = g.players.find(p => p.id === pId);
updated = { ...g, players: g.players.map(p => p.id === pId ? { ...p, shield: true } : p) };
const mode = shieldMode || "hidden_winner";
let msg;
if (mode === "public" || mode === "all_know") {
msg = `🛡️ ${winnerPlayer?.name} has won a Shield — and everyone knows it. Use that information accordingly.`;
} else if (mode === "team_hidden") {
msg = `🛡️ The winning team has been shielded. Only they know. Everyone else: speculate freely.`;
} else {
msg = `🛡️ A shield was quietly slipped to someone. They know. You don't. Isn't that fun.`;
}
await addMsg(gameId, { type: "power", text: msg });
// Castle ghost update — reveals winner only if public mode
if (mode === "public" || mode === "all_know") {
await castleMsg(`🛡️ ${winnerPlayer?.emoji} ${winnerPlayer?.name} has won a Shield — publicly awarded.`);
} else if (mode === "team_hidden") {
await castleMsg(`🛡️ A Shield was awarded to someone on the winning team. Identity hidden.`);
} else {
await castleMsg(`🛡️ A Shield was secretly awarded to someone. Only they know.`);
}
} else if (power === "dagger") {
if (g.daggerAwarded) return;
updated = { ...g, daggerAwarded: true, players: g.players.map(p => p.id === pId ? { ...p, dagger: true } : p) };
await castleMsg(`🗡️ The Dagger has been awarded to a player. It will double their vote at the Round Table — once. Only the holder knows.`);
} else if (power === "seer") {
if (g.seerAwarded) return;
updated = { ...g, seerAwarded: true, players: g.players.map(p => p.id === pId ? { ...p, seerRole: true } : p) };
await castleMsg(`👁️ The Seer power has been bestowed on a player. Each night they may interrogate one person — the truth will be theirs alone.`);
// Send private explanation to the seer's storage key — no public message
await save(gameId + "-seer-explain-" + pId, {
ts: Date.now(),
msg: "You have been awarded the Seer power. Each night, the host will wake you before the Traitors. You may privately interrogate one player — their true role (Faithful or Traitor) will be revealed on your screen alone. You are free to share what you learn with others, but revealing that you hold the Seer power makes you a target. You may also choose to save your power for a future night.",
});
}
if (updated) { await save(gameId, updated); setGame(updated); }
};

const hostBeginNight = async () => {
const g = await load(gameId);
const isSTInPlay = g.secretTraitorEnabled && g.players.some(p => p.role === "secret_traitor" && p.alive);
const shouldRevealST = isSTInPlay && g.currentRound >= g.secretTraitorRevealCycle && !g.secretTraitorRevealedInChat;
// Build breakfast groups for tomorrow
const alive = g.players.filter(p => p.alive);
const shuffledAlive = shuffleArray(alive);
const groups = [];
let i = 0;
while (i < shuffledAlive.length) {
const size = i === 0 ? Math.min(2, shuffledAlive.length) : Math.min(4, shuffledAlive.length - i);
groups.push(shuffledAlive.slice(i, i + size).map(p => p.id));
i += size;
}
// Night phase routing:
// 1. Solo traitor + 6+ alive → RECRUIT first (one chance only — no re-recruit after decline)
// 2. Solo traitor + exactly 5 alive → no recruit, go straight to breakfast (no murder possible)
// 3. Seer (if active)
// 4. ST shortlist ONLY if NOT being revealed this night
// 5. Traitor chat (Turret)
const hasSeer = g.players.some(p => p.seerRole && p.alive);
const aliveTraitors = alive.filter(p => p.role === "traitor" || p.role === "secret_traitor");
const soloTraitor = aliveTraitors.length === 1;
const canRecruit = soloTraitor && alive.length >= 6;
const canUseTurret = !soloTraitor || alive.length >= 6; // solo traitor with only 5 alive can't use Turret

let nightPhase;
if (canRecruit) {
  nightPhase = PHASES.NIGHT_RECRUIT;
} else if (!canUseTurret) {
  // Solo traitor, 5 alive — no murder possible, skip straight to breakfast
  nightPhase = PHASES.BREAKFAST;
} else if (hasSeer) {
  nightPhase = PHASES.NIGHT_SEER;
} else if (isSTInPlay && !g.secretTraitorRevealedInChat && !shouldRevealST) {
  nightPhase = PHASES.NIGHT_SECRET_TRAITOR;
} else {
  nightPhase = PHASES.NIGHT_TRAITOR_CHAT;
}

// If skipping to breakfast, add a message and don't run night ceremony
if (nightPhase === PHASES.BREAKFAST) {
  const noMurderUpdate = { ...g, phase: PHASES.BREAKFAST, nightVotes: {}, breakfastGroups: groups, breakfastGroupIdx: 0, lastKilled: null, seerUsed: false };
  await addMsg(gameId, { type: "system", text: "🌙 The night passes without incident. With only 5 players remaining (1 Traitor + 4 Faithful), the lone Traitor cannot recruit or murder. Morning comes quickly." });
  await save(gameId, noMurderUpdate); setGame(noMurderUpdate);
  return;
}
// Accumulate breakfast group history for The Witness questions
const breakfastGroupHistory = [...(g.breakfastGroupHistory || []), groups];
// 2-Traitor recruitment: eligible if game started with 4+ traitors AND exactly 2 turret traitors alive now
// AND the offer hasn't already been made this game (one chance only, ever)
const turretTraitors = alive.filter(p => p.role === "traitor"); // excludes unrevealed ST
const canTwoTraitorRecruit = (g.startingTraitorCount || 0) >= 4 && turretTraitors.length === 2 && !g.twoTraitorRecruitUsed;
const updated = {
  ...g,
  phase: nightPhase,
  nightVotes: {},
  twoTraitorRecruitVotes: {}, // reset each night
  twoTraitorRecruitMode: false,
  twoTraitorRecruitTarget: null,
  canTwoTraitorRecruit,
  twoTraitorRecruitUsed: g.twoTraitorRecruitUsed || canTwoTraitorRecruit, // once offered, never again
  breakfastGroups: groups,
  breakfastGroupHistory,
  breakfastGroupIdx: 0,
  stBeingRevealedThisNight: shouldRevealST,
  stShortlist: [],            // reset shortlist each night
  stShortlistSubmitted: false, // reset submission flag each night
  seerUsed: false,             // reset each night
  seerInvestigated: null,      // reset each night
};
await save(gameId, updated);
await addMsg(gameId, { type: "system", text: "🌙 Night falls on the castle. The Faithful close their eyes. The Traitors open theirs. Someone's evening is about to get significantly worse." });
const timers = g.phaseDurations || PHASE_TIMERS;
startTimer(timers.night_sequester * 60);
setGame(updated);

};

const hostEndSeerPhase = async () => {
const g = await load(gameId);
const isSTInPlay = g.secretTraitorEnabled && g.players.some(p => p.role === "secret_traitor" && p.alive);
// On reveal night, ST skips shortlist and goes straight to Turret (they stay awake)
const nextPhase = isSTInPlay && !g.secretTraitorRevealedInChat && !g.stBeingRevealedThisNight
? PHASES.NIGHT_SECRET_TRAITOR
: PHASES.NIGHT_TRAITOR_CHAT;
await advanceTo(nextPhase);
};

// Traitor locks in their recruit target → host wakes the target faithful
const submitRecruitTarget = async (targetId) => {
const g = await load(gameId);
const updated = { ...g, recruitTargetId: targetId, phase: PHASES.NIGHT_RECRUIT_RESPONSE };
await save(gameId, updated); setGame(updated);
setRecruitTarget(null);
};

// Faithful accepts recruitment → becomes traitor, goes to Turret to meet allies — but no murder this night
const acceptRecruitment = async () => {
const g = await load(gameId);
const me2 = g.players.find(p => p.id === myId);
const newPlayers = g.players.map(p => p.id === myId ? { ...p, role: "traitor" } : p);
const updated = { ...g, players: newPlayers, phase: PHASES.NIGHT_TRAITOR_CHAT, recruitTargetId: null, recruitDeclined: false, recruitedThisNight: true };
await save(gameId, updated); setGame(updated);
await castleMsg(`🗡️ ${me2?.emoji} ${me2?.name} has accepted the offer and joined the Traitors. The Turret grows.`);
await save(gameId + "-recruit-chat", []); setRecruitChats([]);
};

// Faithful declines → murdered; if now 5 alive, no more recruiting AND no Turret — go to breakfast
const declineRecruitment = async () => {
const g = await load(gameId);
const targetId = g.recruitTargetId;
const target = g.players.find(p => p.id === targetId);
// Shield blocks decline-murder
let newPlayers;
if (target?.shield) {
await addMsg(gameId, { type: "power", text: `🛡️ ${target.name} refused recruitment — and had a Shield. The attempt was blocked. Their shield expires at breakfast.` });
newPlayers = g.players.map(p => p.id === targetId ? { ...p, shield: false } : p);
} else {
newPlayers = g.players.map(p => p.id === targetId ? { ...p, alive: false, isGhost: true } : p);
}
const aliveAfter = dagStripped.filter(p => p.alive).length;
// Always go to Turret so Traitors can debrief — even if no further murder is possible
// Flag declineNoTurretMurder if 5 alive (Turret meets but cannot murder)
const shieldBlocked = !!target?.shield;
const noMurderPossible = aliveAfter <= 5;
if (!shieldBlocked) {
await addMsg(gameId, { type: "system", text: `🌙 ${target?.name} refused recruitment and was murdered. The Traitor will now convene in the Turret to debrief${noMurderPossible ? " — but with only " + aliveAfter + " players remaining, no further murder is possible tonight." : "."}` });
await castleMsg(`❌ ${target?.emoji} ${target?.name} refused recruitment and was immediately eliminated. They died a Faithful.`);
} else {
await castleMsg(`🛡️ ${target?.emoji} ${target?.name} refused recruitment — but their Shield blocked the murder. They survive, Shield spent.`);
}
// Post decline status to Turret chat so Traitor sees it
const chats = (await load(gameId + "-traitor-chat")) || [];
chats.push({
sender: "🏰 THE CASTLE",
senderId: "system",
text: shieldBlocked
? `😬 ${target?.name} has declined your offer. Even worse — they had a Shield, and it saved them from murder. They're alive, they know you tried to recruit them, and breakfast is going to be absolutely delightful. Good luck.`
: `⚰️ ${target?.name} refused recruitment and has been eliminated. ${noMurderPossible ? "With only " + aliveAfter + " players remaining, no Turret murder is possible — morning comes after this debrief." : "You may now recruit again or proceed to morning."}`,
ts: Date.now(),
isSystem: true,
});
await save(gameId + "-traitor-chat", chats);
const updated = {
...g,
players: newPlayers,
phase: PHASES.NIGHT_TRAITOR_CHAT, // always go to Turret after decline — one chance only
recruitTargetId: null,
recruitDeclined: false,
recruitDeclinedName: target?.name,
recruitDeclinedEmoji: target?.emoji,
declineNoMurder: noMurderPossible, // Turret can debrief but not murder
canTwoTraitorRecruit: false, // one chance — used, regardless of outcome
lastKilled: !shieldBlocked ? { name: target?.name, emoji: target?.emoji, role: target?.role } : g.lastKilled,
};
await save(gameId, updated); setGame(updated);
await save(gameId + "-recruit-chat", []); setRecruitChats([]);
};

// Host advances from recruit phase once traitor has locked in (host shows target their screen)
const hostPresentRecruitOffer = async () => {
// Already in NIGHT_RECRUIT_RESPONSE — nothing to save, just a host cue
};

const hostEndSecretTraitorPhase = async () => {
const g = await load(gameId);
if (g.stBeingRevealedThisNight) {
// Promote the secret traitor to regular traitor
const stPlayer = g.players.find(p => p.role === "secret_traitor" && p.alive);
const newPlayers = g.players.map(p =>
p.role === "secret_traitor" ? { ...p, role: "traitor" } : p
);
// Inject dramatic reveal into traitor chat
const chats = (await load(gameId + "-traitor-chat")) || [];
chats.push({
sender: "🎭 THE CASTLE",
senderId: "system",
text: `THE SECRET TRAITOR HAS BEEN REVEALED — IT'S ${stPlayer?.name?.toUpperCase() || "UNKNOWN"}. They are now one of you. Welcome them. Or don't. Either way — you're all Traitors now.`,
ts: Date.now(),
isSystem: true,
});
await save(gameId + "-traitor-chat", chats);
const updated = {
...g,
phase: PHASES.NIGHT_TRAITOR_CHAT,
players: newPlayers,
secretTraitorRevealedInChat: true,
stBeingRevealedThisNight: false,
};
await save(gameId, updated);
setGame(updated);
if (stPlayer) await castleMsg(`🎭 The Secret Traitor has been revealed to their fellow Traitors. ${stPlayer.emoji} ${stPlayer.name} is no longer operating alone.`);
} else {
await advanceTo(PHASES.NIGHT_TRAITOR_CHAT);
}
await save(gameId + "-st-chat", []); // clear ST chat — phase is over
setStChats([]);
const timers = (await load(gameId))?.phaseDurations || PHASE_TIMERS;
startTimer(timers.night_traitor_chat * 60);
};

const resolveNight = async () => {
const g = await load(gameId);
// If a new Traitor was recruited this night, they meet their allies in the Turret but no murder happens
if (g.recruitedThisNight) {
await addMsg(gameId, { type: "system", text: "🌙 A new Traitor was recruited tonight. The Turret met but no murder was committed — the night of recruitment is always safe." });
const newPlayers = g.players.map(p => ({ ...p, shield: false }));
const updated = { ...g, players: newPlayers, phase: PHASES.BREAKFAST, lastKilled: null, nightVotes: {}, recruitedThisNight: false };
await save(gameId + "-traitor-chat", []);
await save(gameId, updated); setGame(updated);
return;
}
// Decline with no murder possible (≤5 alive after decline) — Turret debriefed, go to breakfast
if (g.declineNoMurder) {
await addMsg(gameId, { type: "system", text: `🌙 The night ends. ${g.recruitDeclinedName || "The target"} refused and was eliminated. With too few players remaining, no Turret murder is possible. Morning comes.` });
const newPlayers = g.players.map(p => ({ ...p, shield: false }));
const updated = { ...g, players: newPlayers, phase: PHASES.BREAKFAST, nightVotes: {}, declineNoMurder: false };
await save(gameId + "-traitor-chat", []);
await save(gameId, updated); setGame(updated);
return;
}
const votes = g.nightVotes || {};
const aliveTraitors = g.players.filter(p => (p.role === "traitor" || p.role === "secret_traitor") && p.alive);
const voteValues = Object.values(votes);
const allVoted = aliveTraitors.every(t => votes[t.id]);
const unanimous = allVoted && voteValues.length > 0 && new Set(voteValues).size === 1;
let updated;
if (!unanimous) {
const reason = voteValues.length === 0
? "The Traitors couldn't agree before time ran out. No murder tonight."
: "The Traitors were divided. No unanimous target — no murder tonight.";
await addMsg(gameId, { type: "system", text: `🌙 ${reason} The Faithful sleep soundly, unaware of how close it was.` });
const noMurderPlayers = g.players.map(p => ({ ...p, shield: false }));
updated = { ...g, players: noMurderPlayers, phase: PHASES.BREAKFAST, lastKilled: null, nightVotes: {} };
} else {
const targetId = voteValues[0];
const target = g.players.find(p => p.id === targetId);
if (target?.shield) {
await addMsg(gameId, { type: "power", text: "🛡️ The Traitors were unanimous — and their target had a Shield. It blocks the attempt. Their target survives. Their dignity does not." });
await castleMsg(`🛡️ The Traitors targeted someone last night — but their Shield blocked it. ${target.emoji} ${target.name} survives. The Shield is spent.`);
const newPlayers = g.players.map(p => p.id === targetId ? { ...p, shield: false } : p);
// Track shield block for stats
const shieldLog = [...(g.shieldLog || []), { round: g.currentRound || 1, savedId: targetId }];
const shieldTl = [...(g.timeline || []), { round: g.currentRound || 1, type: "shield", text: `🛡️ Night ${g.currentRound || 1}: ${target.emoji} ${target.name}'s Shield blocked a murder attempt.` }];
updated = { ...g, players: newPlayers, phase: PHASES.BREAKFAST, lastKilled: null, nightVotes: {}, shieldLog, timeline: shieldTl };
} else {
const newPlayers = g.players.map(p => p.id === targetId ? { ...p, alive: false, isGhost: true } : p);
await addMsg(gameId, { type: "death", text: `🌙 Dawn breaks on the castle. ${target.name}'s seat at breakfast will be conspicuously, permanently empty.` });
await castleMsg(`🌙 The Traitors struck last night. ${target.emoji} ${target.name} has been murdered.`);
// Append to kill log for end-game stats
const killLog = [...(g.killLog || []), { round: g.currentRound || 1, killedId: targetId, killedRole: target.role }];
const tl = [...(g.timeline || []), { round: g.currentRound || 1, type: "murder", text: `🌙 Night ${g.currentRound || 1}: ${target.emoji} ${target.name} was murdered.` }];
updated = { ...g, players: newPlayers, phase: PHASES.BREAKFAST, lastKilled: { name: target.name, emoji: target.emoji, role: target.role }, nightVotes: {}, killLog, timeline: tl };
}
}
// Archive the turret chat before clearing it
const currentChats = await load(gameId + "-traitor-chat") || [];
if (currentChats.length) {
const archR = await load(gameId + "-traitor-chat-archive");
const archive = archR ? [...archR, ...currentChats] : currentChats;
await save(gameId + "-traitor-chat-archive", archive);
}
await save(gameId + "-traitor-chat", []);
// Shields expire each morning — clear all regardless of whether they were used
updated = { ...updated, players: updated.players.map(p => ({ ...p, shield: false })) };
// No mid-game win conditions. Everyone goes to the Fire of Truth. Always.
await save(gameId, updated); setGame(updated);
};

const resolveBanishment = async () => {
const g = await load(gameId);
const votes = g.dayVotes || {};
const daggerPid = g.daggerActivePlayerId || null;
const tieBreakRound = g.tieBreakRound || 0;
const tieLockedIds = g.tieLockedIds || [];
const tally = {};
Object.entries(votes).forEach(([vId, tId]) => {
const w = (daggerPid && vId === daggerPid) ? 2 : 1;
tally[tId] = (tally[tId] || 0) + w;
});
const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
const isTie = !sorted.length || (sorted.length > 1 && sorted[0][1] === sorted[1][1]);

if (isTie) {
  const topScore = sorted.length ? sorted[0][1] : 0;
  const tiedIds = sorted.filter(([,v]) => v === topScore).map(([id]) => id);

  if (tieBreakRound === 0) {
    // First tie — revote between tied players only
    const tiedNames = tiedIds.map(id => g.players.find(p=>p.id===id)?.name).filter(Boolean).join(" & ");
    await addMsg(gameId, { type: "system", text: `⚖️ A tie between ${tiedNames}. First revote — everyone votes again, but only the tied players may be selected.` });
    await advanceTo(PHASES.VOTING, { dayVotes: {}, daggerActivePlayerId: null, tieBreakRound: 1, tieLockedIds: tiedIds });
  } else if (tieBreakRound === 1) {
    // Second tie — revote again, warn that a 3rd tie means random draw
    const tiedNames = tiedIds.map(id => g.players.find(p=>p.id===id)?.name).filter(Boolean).join(" & ");
    await addMsg(gameId, { type: "system", text: `⚖️ Still tied — ${tiedNames}. Final revote. If this ties again, the tied players are safe and everyone else is in the random draw.` });
    await advanceTo(PHASES.VOTING, { dayVotes: {}, daggerActivePlayerId: null, tieBreakRound: 2, tieLockedIds: tiedIds });
  } else {
    // Third tie — tied targets are SAFE, random draw from everyone else
    const safeIds = tiedIds;
    const drawPool = g.players.filter(p => p.alive && !safeIds.includes(p.id));
    const randomId = drawPool[Math.floor(Math.random() * drawPool.length)]?.id;
    const ban = g.players.find(p => p.id === randomId);
    const safeNames = safeIds.map(id => g.players.find(p=>p.id===id)?.name).filter(Boolean).join(" & ");
    await addMsg(gameId, { type: "system", text: `🎲 Three ties. ${safeNames} are safe — the draw falls on everyone else. ${ban?.emoji} ${ban?.name} drawn at random.` });
    const newPlayers = g.players.map(p => p.id === randomId ? { ...p, alive: false, isGhost: true, dagger: false } : p);
    const aliveAfter = newPlayers.filter(p => p.alive).length;
    const suppressRoleReveal = aliveAfter <= 4;
    const lastBanished = { name: ban.name, role: ban.role, emoji: ban.emoji, suppressRoleReveal };
const tieReset = { tieBreakRound: 0, tieLockedIds: [] };
    const updated = { ...g, players: newPlayers, lastBanished, phase: PHASES.BANISHMENT, tieBreakRound: 0, tieLockedIds: [] };
    await save(gameId, updated); setGame(updated);
    await addMsg(gameId, { type: "ban", text: `🔥 ${ban.name} has been banished by random draw.` });
    await castleMsg(`🎲 ${ban?.emoji} ${ban?.name} was drawn at random and banished.`);
  }
  return;
}
// Reset tie state on clean banishment
const tieReset = { tieBreakRound: 0, tieLockedIds: [] };
const banId = sorted[0][0];
const ban = g.players.find(p => p.id === banId);
// Dagger is consumed when used
const daggerUsed = daggerPid != null;
const newPlayers = g.players.map(p => {
  if (p.id === banId) return { ...p, alive: false, isGhost: true, dagger: false };
  if (daggerUsed && p.id === daggerPid) return { ...p, dagger: false }; // consumed on use
  return p;
});
const aliveAfterBan = newPlayers.filter(p => p.alive).length;
// Dagger expires at final 6 — strip it when 5 or fewer remain after this banishment
const dagStripped = aliveAfterBan <= 5
  ? newPlayers.map(p => ({ ...p, dagger: false }))
  : newPlayers;
if (aliveAfterBan <= 5 && newPlayers.some(p => p.dagger)) {
  await addMsg(gameId, { type: "system", text: "🗡️ The Dagger has expired — only 5 players remain. The final Round Table is a clean vote." });
}
const aliveAfter = newPlayers.filter(p => p.alive).length;
const suppressRoleReveal = aliveAfter <= 4;
const lastBanished = { name: ban.name, role: ban.role, emoji: ban.emoji, suppressRoleReveal };
// Use dagStripped players (dagger removed when ≤5 remain)
const daggerNote = daggerUsed ? ` The Dagger was used — ${g.players.find(p=>p.id===daggerPid)?.name}'s vote counted twice.` : "";
await addMsg(gameId, { type: "ban", text: `🔥 ${ban.name} has been banished from the castle.${!suppressRoleReveal ? (ban.role === "traitor" || ban.role === "secret_traitor" ? " They were a TRAITOR. The castle rejoices, briefly." : " They were FAITHFUL. A catastrophic misread. Well done, everyone.") : ""}${daggerNote}` });
    await castleMsg(`🔥 ${ban.emoji} ${ban.name} has been banished from the castle.`);
let updated = { ...g, players: dagStripped, phase: PHASES.BANISHMENT, dayVotes: {}, lastBanished, daggerActivePlayerId: null, ...tieReset };
// Append to banish log for end-game stats
const banishLog = [...(g.banishLog || []), {
  round: g.currentRound || 1,
  banishedId: banId,
  banishedRole: ban.role,
  votes: votes,
  daggerUserId: daggerPid || null,
}];
const isT = ban.role === "traitor" || ban.role === "secret_traitor";
const banTl = [...(g.timeline || []), { round: g.currentRound || 1, type: "banish", text: `🔥 Round ${g.currentRound || 1}: ${ban.emoji} ${ban.name} was banished — ${suppressRoleReveal ? "role hidden" : isT ? "was a Traitor ✓" : "was Faithful ✗"}.` }];
updated = { ...updated, banishLog, timeline: banTl };
// No mid-game win conditions. Everyone goes to the Fire of Truth. Always.
await save(gameId, updated); setGame(updated);
setShowBanishModal(true);

};

const advanceBreakfastGroup = async () => {
const g = await load(gameId);
const newIdx = (g.breakfastGroupIdx || 0) + 1;
const updated = { ...g, breakfastGroupIdx: newIdx };
await save(gameId, updated); setGame(updated);
};

const advanceFromBreakfast = async () => {
const g = await load(gameId);
const alive = g.players.filter(p => p.alive);
const nextRound = g.round + 1;
const nextCurrentRound = (g.currentRound || 1) + 1;
if (alive.length <= 4) {
// 4 remain — Fire of Truth
await addMsg(gameId, { type: "system", text: `🔥 Only ${alive.length} remain. The Fire of Truth awaits.` });
await advanceTo(PHASES.ENDGAME_FREE_ROAM, { endgameVotes: {}, round: nextRound, currentRound: nextCurrentRound, breakfastRevealed: false });
} else if (alive.length === 5) {
// 5 remain — skip mission, go straight to final free roam before last banishment
await addMsg(gameId, { type: "system", text: `⚔️ Five remain. No mission — the final Round Table follows this roam.` });
await advanceTo(PHASES.FREE_ROAM, { round: nextRound, currentRound: nextCurrentRound, breakfastRevealed: false });
} else {
await advanceTo(PHASES.MISSION_BRIEFING, { currentMission: null, round: nextRound, currentRound: nextCurrentRound, breakfastRevealed: false });
}
};

const revealBreakfast = async () => {
const g = await load(gameId);
await save(gameId, { ...g, breakfastRevealed: true });
setGame({ ...g, breakfastRevealed: true });
const timers = g.phaseDurations || PHASE_TIMERS;
startTimer((timers.breakfast_convo || 3) * 60);
};

// ── PLAYER ACTIONS ─────────────────────────────────────────────────────────
const submitDayVote = async () => {
if (!selectedTarget || !me?.alive) return;
const g = await load(gameId);
await save(gameId, { ...g, dayVotes: { ...(g.dayVotes || {}), [myId]: selectedTarget } });
setSelectedTarget(null);
};

const submitNightVote = async () => {
if (!selectedTarget || !me?.alive || !hasTraitorRole) return;
const g = await load(gameId);
await save(gameId, { ...g, nightVotes: { ...(g.nightVotes || {}), [myId]: selectedTarget } });
setSelectedTarget(null);
};

// 2-Traitor recruitment vote — each Traitor votes "recruit" or "murder"
const submitTwoTraitorRecruitChoice = async (choice) => {
if (!me?.alive || !isTraitor) return;
const g = await load(gameId);
const votes = { ...(g.twoTraitorRecruitVotes || {}), [myId]: choice };
const turretT = (g.players || []).filter(p => p.role === "traitor" && p.alive);
const allVoted = turretT.every(t => votes[t.id]);
const unanimous = allVoted && new Set(Object.values(votes)).size === 1;
const decision = unanimous ? Object.values(votes)[0] : null;
await save(gameId, { ...g, twoTraitorRecruitVotes: votes,
twoTraitorRecruitMode: decision === "recruit" ? true : g.twoTraitorRecruitMode });
setGame({ ...g, twoTraitorRecruitVotes: votes,
twoTraitorRecruitMode: decision === "recruit" ? true : g.twoTraitorRecruitMode });
};

// 2-Traitor recruitment target vote
const submitTwoTraitorTarget = async (targetId) => {
if (!me?.alive || !isTraitor) return;
const g = await load(gameId);
const targetVotes = { ...(g.twoTraitorTargetVotes || {}), [myId]: targetId };
const turretT = (g.players || []).filter(p => p.role === "traitor" && p.alive);
const allVoted = turretT.every(t => targetVotes[t.id]);
const unanimous = allVoted && new Set(Object.values(targetVotes)).size === 1;
const agreedTarget = unanimous ? Object.values(targetVotes)[0] : null;
await save(gameId, { ...g, twoTraitorTargetVotes: targetVotes, twoTraitorRecruitTarget: agreedTarget });
setGame({ ...g, twoTraitorTargetVotes: targetVotes, twoTraitorRecruitTarget: agreedTarget });
};

const submitShortlist = async () => {
if (shortlist.length !== 5) return;
await save(gameId + "-st-shortlist", { submittedBy: myId, targets: shortlist });
// Notify host
const g = await load(gameId);
await save(gameId, { ...g, stShortlistSubmitted: true, stShortlist: shortlist });
};

const sendChat = async () => {
if (!chatDraft.trim() || (!canJoinTraitorChat && !isHost)) return;
const chats = (await load(gameId + "-traitor-chat")) || [];
const senderName = isHost ? "👁️ Host" : me.name;
chats.push({ sender: senderName, senderId: myId, text: chatDraft.trim(), ts: Date.now() });
await save(gameId + "-traitor-chat", chats);
setTraitorChats(chats);
setChatDraft("");
};

const sendGhostChat = async () => {
if (!ghostDraft.trim()) return;
const senderName = isHost ? "👁️ Host" : (me?.name || "Ghost");
const chats = (await load(gameId + "-ghost-chat")) || [];
chats.push({ sender: senderName, senderId: myId, text: ghostDraft.trim(), ts: Date.now(), isHost });
await save(gameId + "-ghost-chat", chats);
setGhostChats(chats);
setGhostDraft("");
};

const sendStChat = async () => {
if (!stChatDraft.trim()) return;
const senderName = isHost ? "👁️ Host" : (me?.name || "?");
const chats = (await load(gameId + "-st-chat")) || [];
chats.push({ sender: senderName, senderId: myId, text: stChatDraft.trim(), ts: Date.now(), isHost });
await save(gameId + "-st-chat", chats);
setStChats(chats);
setStChatDraft("");
};

const useSeerPower = async (delay = false) => {
if (delay === true) {
// Player chose to save power — mark as used this round so host can advance, but no reveal
const g = await load(gameId);
await save(gameId, { ...g, seerUsed: true });
setGame({ ...g, seerUsed: true });
await castleMsg(`👁️ The Seer chose to save their power for another night.`);
setSeerTarget(null);
setSeerLocked(false);
return;
}
if (!seerTarget || !me?.seerRole) return;
const g = await load(gameId);
const target = g.players.find(p => p.id === seerTarget);
const isTraitorTarget = target.role === "traitor" || target.role === "secret_traitor";
setSeerResult({ name: target.name, emoji: target.emoji, isTraitor: isTraitorTarget });
setSeerLocked(false);
const updated = { ...g, seerUsed: true, seerInvestigated: { targetId: seerTarget, targetName: target.name, targetEmoji: target.emoji, isTraitor: isTraitorTarget } };
await save(gameId, updated); setGame(updated);
};

const updateRoom = async (roomId) => {
setMyRoom(roomId);
const g = await load(gameId);
await save(gameId, { ...g, rooms: { ...(g.rooms || {}), [myId]: roomId } });
};

const submitEndgameVote = async (choice) => {
setEndgameChoice(choice);
const g = await load(gameId);
const alive = g.players.filter(p => p.alive);
const votes = { ...(g.endgameVotes || {}), [myId]: choice };
const updated = { ...g, endgameVotes: votes };
await save(gameId, updated); setGame(updated);
if (Object.keys(votes).length >= alive.length) {
if (Object.values(votes).every(v => v === "end")) {
const winner = checkWinner(g) || "faithful";
const final = { ...updated, phase: PHASES.ENDED, winner };
await addMsg(gameId, { type: "win", text: "✅ A unanimous vote to end it. The masks come off. The truth comes out. Someone is about to feel very, very vindicated — and someone else very, very exposed." });
await save(gameId, final);
} else {
await advanceTo(PHASES.ROUND_TABLE);
}
}
};

const checkWinner = (g) => {
const alive = g.players.filter(p => p.alive);
const aliveT = alive.filter(p => p.role === "traitor" || p.role === "secret_traitor");
const aliveF = alive.filter(p => p.role === "faithful" || p.role === "seer");
if (aliveT.length === 0) return "faithful"; // all traitors gone — faithful win anytime
// Traitor parity win only triggers at/after endgame threshold (≤4 alive)
if (alive.length <= 4 && aliveT.length >= aliveF.length) return "traitors";
return null;
};

const kickPlayer = async (playerId) => {
const g = await load(gameId);
if (g.phase !== PHASES.LOBBY) return;
const updated = { ...g, players: g.players.filter(p => p.id !== playerId) };
await save(gameId, updated); setGame(updated);
};

const manualKillPlayer = async (playerId) => {
const g = await load(gameId);
const target = g.players.find(p => p.id === playerId);
if (!target || !target.alive) return;
const newPlayers = g.players.map(p => p.id === playerId ? { ...p, alive: false, isGhost: true } : p);
const tl = [...(g.timeline || []), { round: g.currentRound || 1, type: "manual_kill", text: `🪄 Host override: ${target.emoji} ${target.name} manually removed from the game.`, ts: Date.now() }];
const updated = { ...g, players: newPlayers, timeline: tl };
await save(gameId, updated); setGame(updated);
await addMsg(gameId, { type: "death", text: `🪄 ${target.name} has been removed from the game by the host.` });
};

const manualRevivePlayer = async (playerId) => {
const g = await load(gameId);
const target = g.players.find(p => p.id === playerId);
if (!target || target.alive) return;
const newPlayers = g.players.map(p => p.id === playerId ? { ...p, alive: true, isGhost: false } : p);
const tl = [...(g.timeline || []), { round: g.currentRound || 1, type: "manual_revive", text: `🪄 Host override: ${target.emoji} ${target.name} returned to the game.`, ts: Date.now() }];
const updated = { ...g, players: newPlayers, timeline: tl };
await save(gameId, updated); setGame(updated);
await addMsg(gameId, { type: "system", text: `🪄 ${target.name} has been returned to the game by the host.` });
};

const saveAvatar = (dataUrl) => {
// Update local state immediately so the UI responds without waiting for Convex
setMyAvatar(dataUrl);
setAvatars(prev => ({ ...prev, [myId]: dataUrl }));
// Persist to Convex in the background — never block the render path
(async () => {
  try {
    const avKey = gameId + "-avatars";
    const avR = await load(avKey).catch(() => null);
    const avMap = { ...(avR || {}), [myId]: dataUrl };
    await save(avKey, avMap);
  } catch(e) {}
})();
};

const resetGame = async () => {
const g = await load(gameId);
const fresh = { ...g, phase: PHASES.LOBBY, players: g.players.map(p => ({ ...p, role: null, alive: true, shield: false, dagger: false, seerRole: false })), round: 0, currentRound: 0, nightVotes: {}, dayVotes: {}, endgameVotes: {}, currentMission: null, winner: null, lastKilled: null, lastBanished: null, breakfastGroups: [], breakfastGroupIdx: 0, secretTraitorRevealedInChat: false, monologueIdx: -1 };
await save(gameId, fresh);
await save(gameId + "-msgs", []);
await save(gameId + "-traitor-chat", []);
setGame(fresh); setMessages([]); setTraitorChats([]); setGhostChats([]); setSeerResult(null); setEndgameChoice(null);
stopTimer();
};

const completeGame = async () => {
const g = await load(gameId);
const updated = { ...g, rolesRevealed: true };
await save(gameId, updated);
// Save to game history (last 10 games)
try {
const host = g.players?.find(p => p.id === g.hostId);
const confR = await load(gameId + "-confessions").catch(() => null);
const confessions = confR || [];
const tChatR = await load(gameId + "-traitor-chat-archive").catch(() => null);
const traitorChatArchive = tChatR || (traitorChats.length ? traitorChats : []);
const historyEntry = {
gameId,
date: new Date().toLocaleDateString(),
hostName: host ? `${host.emoji} ${host.name}` : "Unknown",
winner: g.winner,
players: g.players,
banishLog: g.banishLog || [],
killLog: g.killLog || [],
shieldLog: g.shieldLog || [],
timeline: g.timeline || [],
totalRounds: g.currentRound || 1,
confessions,
traitorChatArchive,
};
const existing = await load('game-history').catch(() => null);
const history = existing || [];
const trimmed = [historyEntry, ...history].slice(0, 10);
await save('game-history', trimmed);
} catch(e) { /* storage unavailable */ }
};

const revealEndgameVote = async (idx) => {
const g = await load(gameId);
if (idx !== (g.endgameRevealIdx ?? -1) + 1) return;
await save(gameId, { ...g, endgameRevealIdx: idx });
};

const endGameFinal = async () => {
const g = await load(gameId);
const final = { ...g, phase: PHASES.ENDED, winner: checkWinner(g) || "faithful", rolesRevealed: false };
await addMsg(gameId, { type: "win", text: "✅ A unanimous vote to end it. The masks come off. The truth comes out. Someone is about to feel very, very vindicated — and someone else very, very exposed." });
await save(gameId, final);
};

const copyId = () => { navigator.clipboard.writeText(gameId); setCopied(true); setTimeout(() => setCopied(false), 2000); };

// Tallies
const dayTally = {};
Object.entries(game?.dayVotes || {}).forEach(([vId, tId]) => { const w = (game?.daggerActivePlayerId && vId === game.daggerActivePlayerId) ? 2 : 1; dayTally[tId] = (dayTally[tId] || 0) + w; });
const hasVotedDay = myId in (game?.dayVotes || {});
const hasVotedNight = myId in (game?.nightVotes || {});
const phaseStripIdx = PHASE_STRIP.findIndex(s => s.key === game?.phase);

// ═══════════════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════════════

// START SCREEN
if (screen === "start") return (
<div className="app">
<style>{CSS}</style>
<div className="noise" />
<div className="z1">
<div className="hdr">
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
    <div className="main" style={{ maxWidth: 400 }}>
      <div className="card">
        <div className="tabs">
          <div className={`tab ${joinTab === "join" ? "active" : ""}`} onClick={() => setJoinTab("join")}>Join Game</div>
          <div className={`tab ${joinTab === "create" ? "active" : ""}`} onClick={() => setJoinTab("create")}>Host Game</div>
        </div>
        <div className="col">
          <div>
            <span className="label">Your Name</span>
            <input type="text" className="w100" placeholder="How shall you be known?" value={playerName} onChange={e => setPlayerName(e.target.value)} maxLength={22} onKeyDown={e => e.key === "Enter" && (joinTab === "join" ? joinGame() : createGame())} />
          </div>
          {joinTab === "join" && <div>
            <span className="label">Game ID</span>
            <input type="text" className="w100" placeholder="e.g. AB1C2D" value={joinId} onChange={e => setJoinId(e.target.value.toUpperCase())} maxLength={8} />
          </div>}
          {joinTab === "create" && <div className="info-box">You'll host a new game and receive a shareable Game ID. You control all phase transitions.</div>}
          {error && <div style={{ color: "#e88", fontSize: ".9rem", fontStyle: "italic" }}>{error}</div>}
          <button className="btn btn-gold" onClick={joinTab === "join" ? joinGame : createGame} disabled={loading}>
            {loading ? "…" : joinTab === "join" ? "Enter the Castle" : "Create Game"}
          </button>
        </div>
      </div>
      <div className="divider" />
      <div style={{ textAlign: "center" }}>
        <div className="label" style={{ marginBottom: 10 }}>New here?</div>
        <div className="row" style={{ justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={() => { setTutorialMode("rules"); setTutorialStep(0); setScreen("tutorial"); }}>📜 Rules & Overview</button>
        </div>
        <div className="label" style={{ marginBottom: 10 }}>Want to experience it? Try the interactive demo.</div>
        <div className="row" style={{ justifyContent: "center", gap: 8 }}>
          <button className="btn btn-gold btn-sm" onClick={() => setScreen("demo-host")}>⚜ Host Demo</button>
          <button className="btn btn-gold btn-sm" onClick={() => setScreen("demo-player")}>🎭 Player Demo</button>
        </div>
      </div>
      <div className="divider" />
      <div style={{ textAlign: "center" }}>
        <button className="btn btn-outline btn-sm" onClick={() => setScreen("history")}>📋 Past Games</button>
      </div>
      {recentGames.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--dim)", textAlign: "center", marginBottom: 10 }}>↩ Rejoin a Lobby</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentGames.map(r => (
              <button key={r.gId} className="btn btn-outline btn-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", textAlign: "left" }}
                onClick={async () => {
                  setLoading(true); setError("");
                  try {
                    const g = await load(r.gId);
                    if (!g) { setLoading(false); return setError("Game not found — it may have expired."); }
                    if (g.phase !== PHASES.LOBBY) { setLoading(false); return setError("This game has already started. Close and reopen the app to reconnect automatically."); }
                    const inGame = r.host
                      ? g.hostId === r.pId
                      : g.players?.some(p => p.id === r.pId);
                    if (!inGame) { setLoading(false); return setError("You are no longer in this game."); }
                    setGame(g); setGameId(r.gId); setMyId(r.pId);
                    setIsHost(!!r.host); setPlayerName(r.name || ""); setScreen("game");
                    await save("traitors-session", { gId: r.gId, pId: r.pId, host: r.host, name: r.name });
                  } catch(e) { setError("Could not rejoin game."); }
                  setLoading(false);
                }}>
                <div>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".7rem", color: "var(--gold)", letterSpacing: ".08em" }}>{r.gId}</div>
                  <div style={{ fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic", marginTop: 2 }}>{r.host ? "⚜ You hosted" : "🎭 You played as"} {r.name}</div>
                </div>
                <div style={{ fontSize: ".65rem", color: "var(--gold2)", flexShrink: 0, fontFamily: "'Cinzel',serif" }}>
                  Rejoin Lobby →
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>

);

if (screen === "history") return (
<HistoryScreen onExit={() => setScreen("start")} CSS={CSS} />
);

if (screen === "tutorial") return (
<TutorialScreen
mode={tutorialMode}
step={tutorialStep}
setStep={setTutorialStep}
setMode={(m) => { setTutorialMode(m); setTutorialStep(0); }}
onExit={() => setScreen("start")}
CSS={CSS}
/>
);

if (screen === "demo-host" || screen === "demo-player") return (
<DemoScreen mode={screen === "demo-host" ? "host" : "player"} onExit={() => setScreen("start")} CSS={CSS} />
);

if (!game || !myId) return <div className="app"><style>{CSS}</style><div style={{ padding: 40, textAlign: "center", color: "var(--dim)" }}>Loading…</div></div>;

// ENDED SCREEN
if (game.phase === PHASES.GAME_INTRO) return (
<GameIntroScreen game={game} isHost={isHost} gameId={gameId}
load={load} save={save} advanceTo={advanceTo} PHASES={PHASES}
secretTraitorEnabled={game.secretTraitorEnabled} />
);

if (game.phase === PHASES.ENDED) return (
<div className="app"><style>{CSS}</style><div className="noise" /><div className="z1">
<div className="hdr"><div style={{ textAlign: "center", overflow: "visible" }}>
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
</div></div>
<div className="main">
{!game.rolesRevealed ? (
isHost ? (() => {
// Build reveal order: Faithful first, then Traitors, Secret Traitor absolutely last
const all = game.players?.filter(p => !p.isGhost && p.alive) || [];
const faithful = all.filter(p => p.role === "faithful" || p.role === "seer");
const traitors = all.filter(p => p.role === "traitor");
const st = all.filter(p => p.role === "secret_traitor");
const revealOrder = [...faithful, ...traitors, ...st];
const calledIdx = game.monologueIdx ?? -1;
const allCalled = calledIdx >= revealOrder.length - 1;
const currentPlayer = calledIdx >= 0 ? revealOrder[calledIdx] : null;

        return (
          <div className="card" style={{ padding: "28px 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🎤</div>
              <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.3rem", color: "var(--gold)", marginBottom: 8 }}>The Unmasking</div>
              <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".92rem", lineHeight: 1.7 }}>
                Ask each remaining player one at a time:
              </div>
              <div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 3, padding: "12px 16px", margin: "12px 0", textAlign: "center" }}>
                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.1rem", color: "var(--gold)", fontStyle: "italic" }}>
                  "Reveal to us — are you a Traitor, or are you Faithful?"
                </div>
              </div>
              <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".88rem", lineHeight: 1.6 }}>
                Faithful first — Traitors last — Secret Traitor absolutely last.
              </div>
            </div>

            {/* Current player spotlight */}
            {currentPlayer && (
              <div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 4, padding: "14px 16px", marginBottom: 14, textAlign: "center" }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".15em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 8 }}>Now Speaking</div>
                <div style={{ fontSize: "2rem", marginBottom: 6 }}>{currentPlayer.emoji}</div>
                <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--gold)", marginBottom: 4 }}>{currentPlayer.name}</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", color: currentPlayer.role === "traitor" || currentPlayer.role === "secret_traitor" ? "var(--crim3)" : "#80e080", marginBottom: 10 }}>
                  {currentPlayer.role === "secret_traitor" ? "🎭 SECRET TRAITOR" : currentPlayer.role === "traitor" ? "🗡️ TRAITOR" : "🛡️ FAITHFUL"}
                </div>
              </div>
            )}

            {/* Reveal order list */}
            <div style={{ marginBottom: 16 }}>
              {revealOrder.map((pl, i) => {
                const done = i <= calledIdx;
                const isCurrent = i === calledIdx;
                const isNext = i === calledIdx + 1;
                const isTraitor = pl.role === "traitor" || pl.role === "secret_traitor";
                return (
                  <div key={pl.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", marginBottom: 4, borderRadius: 3, background: isCurrent ? "rgba(201,168,76,.08)" : "transparent", border: isCurrent ? "1px solid rgba(201,168,76,.2)" : "1px solid transparent", opacity: done && !isCurrent ? .45 : 1 }}>
                    <div style={{ fontSize: "1.2rem" }}>{pl.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".8rem", color: "var(--text)" }}>{pl.name}</div>
                      <div style={{ fontSize: ".65rem", color: isTraitor ? "var(--crim3)" : "var(--dim)", fontStyle: "italic" }}>
                        {done ? (isTraitor ? "🗡️ Revealed" : "🛡️ Revealed") : isNext ? "← next" : "—"}
                      </div>
                    </div>
                    {done && !isCurrent && <span style={{ fontSize: ".7rem", color: "var(--dim)" }}>✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="col" style={{ gap: 8 }}>
              {!allCalled ? (
                <button className="btn btn-gold btn-xl" onClick={async () => {
                  const g = await load(gameId);
                  const nextIdx = (g.monologueIdx ?? -1) + 1;
                  await save(gameId, { ...g, monologueIdx: nextIdx });
                  setGame({ ...g, monologueIdx: nextIdx });
                }}>
                  {calledIdx < 0 ? `Call First Player — ${revealOrder[0]?.name} →` : `Next — ${revealOrder[calledIdx + 1]?.name} →`}
                </button>
              ) : (
                <button className="btn btn-gold btn-xl" style={{ background: "linear-gradient(135deg,#8b1a1a,#5a0e0e)", border: "2px solid rgba(201,68,45,.6)" }} onClick={completeGame}>
                  🏁 Finish — Reveal the Winner
                </button>
              )}
            </div>
          </div>
        );
      })()
      : (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "3rem", marginBottom: 14 }} className="pulse">🕯️</div>
          <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.2rem", color: "var(--gold)", marginBottom: 10 }}>The Game is Over</div>
          <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: "1rem", lineHeight: 1.8, marginBottom: 20 }}>
            The host will call on you one at a time.
          </div>
          <div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.25)", borderRadius: 3, padding: "16px 18px", textAlign: "left" }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--gold2)", textTransform: "uppercase", marginBottom: 10 }}>🎤 When the host calls your name</div>
            <div style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.8 }}>
              Stand up. Give a short dramatic monologue. Who did you suspect? Who did you trust? What did you see that nobody else did?<br /><br />
              <strong style={{ color: "var(--gold)" }}>Then reveal your role.</strong>
            </div>
          </div>
        </div>
      )
    ) : (() => {
      const tw = game.winner === "traitors";
      return <WinnerScreen tw={tw} isHost={isHost} resetGame={resetGame} game={game} />;
    })()}
    <StatsCard game={game} gameId={gameId} myId={myId} me={me} />
    <MsgLog messages={messages} />
  </div>
</div></div>

);

// BLINDFOLD SCREEN (for faithful during night)
const isNightPhase = [PHASES.NIGHT_SEQUESTER, PHASES.NIGHT_SEER, PHASES.NIGHT_RECRUIT, PHASES.NIGHT_RECRUIT_RESPONSE, PHASES.NIGHT_SECRET_TRAITOR, PHASES.NIGHT_TRAITOR_CHAT, PHASES.NIGHT_RESOLVE].includes(game.phase);
const stStaysAwake = isSecretTraitor && game.stBeingRevealedThisNight && game.phase === PHASES.NIGHT_TRAITOR_CHAT;
// Recruit target stays awake during their response phase
const isRecruitTarget = game.recruitTargetId === myId;
const faithfulShouldBeBlind = isNightPhase && !hasTraitorRole && !isHost && !isGhost && !stStaysAwake && game.phase !== PHASES.NIGHT_SEER && !(game.phase === PHASES.NIGHT_RECRUIT_RESPONSE && isRecruitTarget);
if (faithfulShouldBeBlind) return (
<div className="app"><style>{CSS}</style>
<div className="blindfold" style={{ animation:"fadeInEl .4s ease", position:"relative", overflow:"hidden" }}>
{/* Candles along the bottom */}
<div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, pointerEvents:"none" }}>
{[0,1,2,3,4,5,6,7].map(i => (
<div key={i} style={{ position:"absolute", left:`${5+i*13}%`, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", opacity:0.45+i%3*.12 }}>
<div style={{ width:7, height:12+i%4*4, background:"linear-gradient(to top,#ff8010,#ffcc40,rgba(255,240,120,.1))", borderRadius:"50% 50% 30% 30%/60% 60% 40% 40%", animation:`candleFlicker ${1.9+i*.26}s ${i*.22}s ease-in-out infinite`, boxShadow:"0 0 8px 3px rgba(255,140,40,.25)", transformOrigin:"bottom center" }} />
<div style={{ width:1.5, height:5, background:"#1a0f05" }} />
<div style={{ width:9, height:18+i%3*6, background:"linear-gradient(to right,rgba(230,210,170,.8),rgba(255,245,220,.95),rgba(210,190,155,.8))", borderRadius:"2px 2px 1px 1px" }} />
<div style={{ width:12, height:3, background:"rgba(160,130,90,.7)", borderRadius:"0 0 2px 2px" }} />
</div>
))}
</div>
{/* Stars */}
{[0,1,2,3,4,5,6,7,8,9].map(i => (
<div key={i} style={{ position:"absolute", left:`${3+i*10+i%3*3}%`, top:`${8+i%5*10}%`, width:i%3===0?3:2, height:i%3===0?3:2, borderRadius:"50%", background:"rgba(220,200,255,.7)", animation:`starTwinkle ${1.5+i*.28}s ${i*.18}s ease-in-out infinite`, pointerEvents:"none" }} />
))}
<span className="bf-icon pulse">🌑</span>
<div className="bf-title">Night Sequester Area</div>
<div className="bf-sub" style={{ maxWidth: 320, lineHeight: 1.9 }}>
Blindfold on. Stay seated.<br />
Nobody leaves the room.<br />
Eyes down. Phone face-down.
</div>
{timerSec > 0 && (
<div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.2rem", color: "rgba(201,168,76,.5)", margin: "16px 0" }}>{fmtTime(timerSec)}</div>
)}
<div style={{ marginTop: 8, fontSize: ".8rem", color: "rgba(201,168,76,.3)", fontStyle: "italic", letterSpacing: ".05em" }}>
🔕 Silence your phone.<br />
<span style={{ opacity: .6 }}>The host will call everyone when it's done.</span>
</div>
</div>
</div>
);

// GHOST SCREEN — shown to eliminated players during active game phases
const isSpectator = !me && !isHost && game.phase !== PHASES.LOBBY;
if ((isGhost || isSpectator) && !isHost && game.phase !== PHASES.ENDED && game.phase !== PHASES.LOBBY) {
const phaseLabel = {
[PHASES.GAME_INTRO]: "🏰 The Game Begins",
[PHASES.MISSION_BRIEFING]: "⚔️ Mission Briefing",
[PHASES.MISSION_ACTIVE]: "⚔️ Mission In Progress",
[PHASES.FREE_ROAM]: "🏰 Free Roam",
[PHASES.ROUND_TABLE]: "🕯️ Round Table",
[PHASES.VOTING]: "🗳️ Voting",
[PHASES.BANISHMENT]: "🔥 Banishment",
[PHASES.NIGHT_SEQUESTER]: "🌙 Night",
[PHASES.NIGHT_SEER]: "🌙 Night — The Seer Wakes",
[PHASES.NIGHT_RECRUIT]: "🌙 Night — Recruitment",
[PHASES.NIGHT_RECRUIT_RESPONSE]: "🌙 Night — Recruitment Offer",
[PHASES.NIGHT_SECRET_TRAITOR]: "🌙 Night — Secret Traitor",
[PHASES.NIGHT_TRAITOR_CHAT]: "🌙 Night — Traitor Conclave",
[PHASES.BREAKFAST]: "🍳 Breakfast",
[PHASES.ENDGAME_FREE_ROAM]: "🔥 Final Free Roam",
[PHASES.ENDGAME]: "🔥 Fire of Truth",
}[game.phase] || "…";

return (
  <div className="app"><style>{CSS}</style><div className="noise" />
    <div className="z1">
      <div className="hdr"><div style={{ textAlign: "center", overflow: "visible" }}>
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
      </div></div>
      <div className="main">

        {/* Phase + ghost badge */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
          <div style={{ flex: 1, background: "rgba(60,30,80,.3)", border: "1px solid rgba(100,60,140,.3)", borderRadius: 3, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(140,100,180,.6)" }}>Current Phase</span>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: ".85rem", color: "rgba(180,140,220,.8)" }}>{phaseLabel}</span>
          </div>
          <div style={{ background: "rgba(30,15,45,.6)", border: "1px solid rgba(80,40,120,.3)", borderRadius: 3, padding: "10px 12px", fontFamily: "'Cinzel',serif", fontSize: ".58rem", color: "rgba(140,100,180,.6)", textAlign: "center" }}>
            {isSpectator ? "👁 Spectator" : "👻 Ghost"}
          </div>
        </div>

        {/* MISSION — show briefing and active mission */}
        {(game.phase === PHASES.MISSION_BRIEFING || game.phase === PHASES.MISSION_ACTIVE) && (() => {
          const m = game.currentMission ? MISSIONS.find(x => x.id === game.currentMission) : null;
          return m ? (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="ctitle">⚔️ {game.phase === PHASES.MISSION_ACTIVE ? "Mission In Progress" : "Upcoming Mission"}</div>
              <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", color: "var(--gold2)", letterSpacing: ".1em", marginBottom: 10 }}>{m.type.toUpperCase()} · {m.time} MIN</div>
                <div style={{ fontSize: ".9rem", color: "var(--dim)", lineHeight: 1.65, marginBottom: 10 }}>{m.desc}</div>
                <div className="info-box" style={{ display: "inline-block", padding: "6px 12px", fontSize: ".82rem" }}>🛡️ {SHIELD_MODE_LABELS[m.shieldMode]}</div>
              </div>
            </div>
          ) : <div className="card" style={{ marginBottom: 14, fontStyle: "italic", color: "var(--dim)", textAlign: "center" }}>Host is selecting a mission…</div>;
        })()}

        {/* FREE ROAM — player locations */}
        {(game.phase === PHASES.FREE_ROAM || game.phase === PHASES.ENDGAME_FREE_ROAM) && (() => {
          const rooms = game.rooms || {};
          const roomMap = { living: "🛋️ Living Area", kitchen: "🍳 Kitchen", dining: "🪑 Dining Room", terrace: "🌿 Upper Terrace", patio: "☀️ Patio", lounge: "🎲 Upstairs Lounge" };
          const byRoom = {};
          game.players.filter(p => p.alive).forEach(p => {
            const r = rooms[p.id] || "living";
            if (!byRoom[r]) byRoom[r] = [];
            byRoom[r].push(p);
          });
          return (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="ctitle">🏰 {game.phase === PHASES.ENDGAME_FREE_ROAM ? "Final Free Roam" : "Free Roam"} — Player Locations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(roomMap).map(([key, label]) => {
                  const here = byRoom[key] || [];
                  if (here.length === 0) return null;
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3 }}>
                      <span style={{ fontSize: ".6rem", minWidth: 120, color: "var(--gold2)", fontFamily: "'Cinzel',serif" }}>{label}</span>
                      <span style={{ fontSize: ".88rem" }}>{here.map(p => `${p.emoji} ${p.name}`).join("  ")}</span>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          );
        })()}

        {/* ROUND TABLE & VOTING — live tally */}
        {(game.phase === PHASES.ROUND_TABLE || game.phase === PHASES.VOTING) && (() => {
          const votes = game.dayVotes || {};
          const tally = {};
          Object.values(votes).forEach(tid => { tally[tid] = (tally[tid] || 0) + 1; });
          const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
          const voted = Object.keys(votes).length;
          const total = alivePlayers.length;
          return (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="ctitle">{game.phase === PHASES.VOTING ? "🗳️ Voting In Progress" : "🕯️ Round Table"}</div>
              {game.phase === PHASES.VOTING && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: "var(--dim)", marginBottom: 4 }}>
                    <span>Votes cast</span><span>{voted}/{total}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--dark4)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${(voted/total)*100}%`, background: "linear-gradient(to right,var(--crim),var(--crim2))", borderRadius: 2, transition: ".3s" }} />
                  </div>
                </div>
              )}
              {sorted.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {sorted.map(([tid, count]) => {
                    const target = game.players.find(p => p.id === tid);
                    return target ? (
                      <div key={tid} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "rgba(139,26,26,.08)", border: "1px solid rgba(139,26,26,.2)", borderRadius: 3 }}>
                        <span style={{ fontSize: ".9rem" }}>{target.emoji} {target.name}</span>
                        <span style={{ marginLeft: "auto", fontFamily: "'Cinzel Decorative',cursive", fontSize: ".9rem", color: "var(--crim3)" }}>{count}</span>
                        <span style={{ fontSize: ".7rem", color: "var(--dim)" }}>vote{count !== 1 ? "s" : ""}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".85rem" }}>No votes yet…</div>
              )}
            </div>
          );
        })()}

        {/* BANISHMENT */}
        {game.phase === PHASES.BANISHMENT && game.lastBanished && (
          <div className="card" style={{ marginBottom: 14, textAlign: "center" }}>
            <div className="ctitle red">🔥 Banishment</div>
            <div style={{ fontSize: "2.5rem", margin: "10px 0 6px" }}>{game.lastBanished.emoji}</div>
            <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.3rem", color: "var(--crim2)", marginBottom: 6 }}>{game.lastBanished.name}</div>
            {!game.lastBanished.suppressRoleReveal ? (
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: (game.lastBanished.role === "traitor" || game.lastBanished.role === "secret_traitor") ? "var(--crim3)" : "var(--gold)", letterSpacing: ".1em" }}>
                {(game.lastBanished.role === "traitor" || game.lastBanished.role === "secret_traitor") ? "🗡️ WAS A TRAITOR" : "🛡️ WAS FAITHFUL"}
              </div>
            ) : (
              <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".82rem" }}>Role hidden — only 5 players remained.</div>
            )}
          </div>
        )}

        {/* NIGHT phases — full observer view */}
        {isNightPhase && (
          <div className="card night" style={{ marginBottom: 14 }}>
            <div className="ctitle purple">🌙 Night Observer</div>

            {/* Seer phase */}
            {game.phase === PHASES.NIGHT_SEER && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", color: "#dd88ff", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>👁️ Seer Phase</div>
                {game.seerInvestigated ? (
                  <div style={{ background: "rgba(80,0,120,.2)", border: "1px solid rgba(120,0,180,.35)", borderRadius: 3, padding: "8px 12px", fontSize: ".85rem" }}>
                    The Seer investigated <strong style={{ color: "#d088ff" }}>{game.seerInvestigated.targetEmoji} {game.seerInvestigated.targetName}</strong> — <span style={{ color: game.seerInvestigated.isTraitor ? "var(--crim3)" : "#80e080" }}>{game.seerInvestigated.isTraitor ? "🗡️ TRAITOR" : "🛡️ FAITHFUL"}</span>
                  </div>
                ) : game.seerUsed ? (
                  <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".85rem" }}>The Seer saved their power for another night.</div>
                ) : (
                  <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".85rem" }}>The Seer is deliberating…</div>
                )}
              </div>
            )}

            {/* Secret Traitor shortlist phase */}
            {game.phase === PHASES.NIGHT_SECRET_TRAITOR && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", color: "#d088ff", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>🎭 Secret Traitor — Shortlist</div>
                {game.stShortlistSubmitted ? (
                  <div>
                    <div style={{ color: "#a0d080", fontSize: ".85rem", marginBottom: 6 }}>✓ Shortlist submitted.</div>
                    {game.stShortlist?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {game.stShortlist.map(id => {
                          const p = game.players.find(x => x.id === id);
                          return p ? <span key={id} style={{ background: "rgba(80,0,80,.3)", border: "1px solid rgba(120,0,120,.4)", borderRadius: 20, padding: "3px 10px", fontSize: ".78rem", color: "#d088ff" }}>{p.emoji} {p.name}</span> : null;
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".85rem" }}>The Secret Traitor is selecting their shortlist…</div>
                )}
              </div>
            )}

            {/* Recruitment phase */}
            {(game.phase === PHASES.NIGHT_RECRUIT || game.phase === PHASES.NIGHT_RECRUIT_RESPONSE) && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", color: "#d0a0ff", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>🤝 Recruitment</div>
                {game.recruitTargetId ? (
                  <div style={{ fontSize: ".85rem", color: "var(--dim)" }}>
                    A Faithful has been approached: <strong style={{ color: "#d0a0ff" }}>{game.players.find(p => p.id === game.recruitTargetId)?.emoji} {game.players.find(p => p.id === game.recruitTargetId)?.name}</strong>
                    <div style={{ marginTop: 4, fontStyle: "italic" }}>{game.phase === PHASES.NIGHT_RECRUIT_RESPONSE ? "Awaiting their response…" : ""}</div>
                  </div>
                ) : (
                  <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".85rem" }}>The Traitor is selecting a recruit…</div>
                )}
              </div>
            )}

            {/* Turret — read-only chat + votes */}
            {game.phase === PHASES.NIGHT_TRAITOR_CHAT && (
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", color: "#c090ff", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>🎯 The Turret</div>
                {game.stShortlist?.length > 0 && (
                  <div style={{ marginBottom: 8, fontSize: ".78rem", color: "var(--dim)" }}>
                    Shortlist: {game.stShortlist.map(id => { const p = game.players.find(x => x.id === id); return p ? `${p.emoji} ${p.name}` : null; }).filter(Boolean).join(", ")}
                  </div>
                )}
                {traitorChats.length > 0 ? (
                  <div style={{ background: "rgba(10,2,18,.8)", border: "1px solid rgba(60,20,80,.4)", borderRadius: 3, maxHeight: 180, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                    {traitorChats.map((m, i) => (
                      m.isSystem
                        ? <div key={i} style={{ background: "rgba(120,0,180,.2)", border: "1px solid rgba(180,60,255,.3)", borderRadius: 3, padding: "6px 10px", textAlign: "center", fontSize: ".78rem", color: "#d088ff" }}>{m.text}</div>
                        : <div key={i} style={{ padding: "4px 0", fontSize: ".82rem" }}>
                            <span style={{ color: "#c090ff", fontSize: ".6rem", fontFamily: "'Cinzel',serif" }}>{m.sender}: </span>
                            <span style={{ color: "var(--dim)" }}>{m.text}</span>
                          </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "var(--dim)", fontStyle: "italic", fontSize: ".82rem", marginBottom: 8 }}>The Traitors are deliberating…</div>
                )}
                {/* Night vote tally */}
                {(() => {
                  const votes = game.nightVotes || {};
                  const traitors = game.players.filter(p => (p.role === "traitor" || p.role === "secret_traitor") && p.alive);
                  return traitors.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {traitors.map(t => {
                        const targetId = votes[t.id];
                        const target = game.players.find(p => p.id === targetId);
                        return (
                          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", background: "rgba(60,20,80,.2)", border: "1px solid rgba(80,20,100,.25)", borderRadius: 3, fontSize: ".78rem" }}>
                            <span style={{ color: "#c090ff" }}>{t.emoji} {t.name}</span>
                            <span style={{ color: targetId ? "var(--crim3)" : "var(--dim)", fontStyle: targetId ? "normal" : "italic" }}>
                              {target ? `→ ${target.emoji} ${target.name}` : "deciding…"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* BREAKFAST */}
        {game.phase === PHASES.BREAKFAST && (() => {
          const killed = game.lastKilled;
          const revealed = game.breakfastRevealed;
          return (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="ctitle">🍳 Breakfast</div>
              {!revealed ? (
                <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".88rem" }}>Groups arriving…</div>
              ) : killed ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>{killed.emoji}</div>
                  <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1rem", color: "var(--crim2)", marginBottom: 4 }}>{killed.name}</div>
                  <div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic" }}>Was murdered in the night.</div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0", color: "#80e080" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>🛡️</div>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", letterSpacing: ".1em" }}>Nobody was murdered. The castle exhales.</div>
                </div>
              )}
            </div>
          );
        })()}

        {/* FIRE OF TRUTH — live votes */}
        {game.phase === PHASES.ENDGAME && (() => {
          const votes = game.endgameVotes || {};
          const alive = game.players.filter(p => p.alive);
          const revealIdx = game.endgameRevealIdx ?? -1;
          return (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="ctitle">🔥 Fire of Truth</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {alive.map((p, i) => {
                  const choice = votes[p.id];
                  const revealed = i <= revealIdx;
                  return (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(20,8,4,.8)", border: "1px solid rgba(80,30,10,.3)", borderRadius: 3 }}>
                      <span style={{ fontSize: ".88rem" }}>{p.emoji} {p.name}</span>
                      <span style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".08em", color: !choice ? "var(--dim)" : revealed ? (choice === "end" ? "#80e080" : "var(--crim3)") : "var(--dim)" }}>
                        {!choice ? "waiting…" : revealed ? (choice === "end" ? "✓ END THE GAME" : "↩ BANISH AGAIN") : "voted ✓"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Players alive/dead overview — always shown */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="ctitle">Castle Status</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#80e080", marginBottom: 6 }}>Alive ({game.players.filter(p => p.alive).length})</div>
          <div className="pgrid" style={{ marginBottom: 10 }}>
            {game.players.filter(p => p.alive).map(p => (
              <div key={p.id} className="pcard" style={{ padding: "8px 4px" }}>
                <div className="pavatar" style={{ fontSize: "1rem" }}>{p.emoji}</div>
                <div className="pname" style={{ fontSize: ".6rem" }}>{p.name}</div>
                {p.shield && <div style={{ fontSize: ".5rem", color: "#88aaff", marginTop: 2 }}>🛡️</div>}
              </div>
            ))}
          </div>
          {game.players.some(p => !p.alive) && <>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--crim3)", marginBottom: 6 }}>Eliminated</div>
            <div className="pgrid">
              {game.players.filter(p => !p.alive).map(p => (
                <div key={p.id} className="pcard" style={{ padding: "8px 4px", opacity: .5 }}>
                  <div className="pavatar" style={{ fontSize: "1rem" }}>{p.emoji}</div>
                  <div className="pname" style={{ fontSize: ".6rem", textDecoration: "line-through" }}>{p.name}</div>
                </div>
              ))}
            </div>
          </>}
        </div>

        {/* Observer chats — real-time read-only access to all private channels */}
        {(()=>{ const tabs = [
            { id: "turret", label: "🗡️ Turret", chats: traitorChats },
            { id: "st", label: "🎭 Secret Traitor", chats: stChats },
            { id: "seer", label: "👁️ Seer", chats: seerChats },
            { id: "recruit", label: "🤝 Recruit", chats: recruitChats },
            { id: "ghost", label: "👻 Ghost Chat", chats: ghostChats },
          ].filter(t => t.id === "ghost" || t.chats.length > 0 || game.phase.includes("night") || game.phase.includes("traitor"));
          return (
            <div className="card night" style={{ marginBottom: 14 }}>
              <div style={{ display:"flex",gap:4,marginBottom:10,flexWrap:"wrap" }}>
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setGhostTab(t.id)}
                    style={{ padding:"5px 10px",borderRadius:3,fontSize:".62rem",fontFamily:"'Cinzel',serif",letterSpacing:".08em",cursor:"pointer",background:ghostTab===t.id?"rgba(80,40,120,.4)":"rgba(255,255,255,.04)",border:ghostTab===t.id?"1px solid rgba(120,60,180,.5)":"1px solid rgba(255,255,255,.08)",color:ghostTab===t.id?"#c090ff":"var(--dim)" }}>
                    {t.label} {t.chats.length > 0 && <span style={{ background:"rgba(80,40,120,.4)",borderRadius:10,padding:"1px 5px",fontSize:".55rem" }}>{t.chats.length}</span>}
                  </button>
                ))}
              </div>
              {ghostTab === "turret" && (
                <div style={{ maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4 }}>
                  {traitorChats.length === 0
                    ? <div style={{ color:"var(--dim)",fontStyle:"italic",fontSize:".82rem",textAlign:"center",padding:"12px 0" }}>Turret chat will appear here in real time.</div>
                    : traitorChats.map((m,i) => (
                      <div key={i} style={{ background:"rgba(60,10,10,.5)",border:"1px solid rgba(139,26,26,.2)",borderRadius:3,padding:"6px 10px",fontSize:".82rem" }}>
                        <span style={{ color:"var(--crim3)",fontFamily:"'Cinzel',serif",fontSize:".6rem" }}>{m.sender}</span>
                        <div style={{ color:"var(--text)",marginTop:2 }}>{m.text}</div>
                      </div>
                    ))}
                </div>
              )}
              {ghostTab === "st" && (
                <div style={{ maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4 }}>
                  {stChats.length === 0
                    ? <div style={{ color:"var(--dim)",fontStyle:"italic",fontSize:".82rem",textAlign:"center",padding:"12px 0" }}>Secret Traitor channel will appear here when active.</div>
                    : stChats.map((m,i) => (
                      <div key={i} style={{ background:"rgba(40,0,60,.5)",border:"1px solid rgba(100,0,140,.2)",borderRadius:3,padding:"6px 10px",fontSize:".82rem" }}>
                        <span style={{ color:"#c090ff",fontFamily:"'Cinzel',serif",fontSize:".6rem" }}>{m.sender}</span>
                        <div style={{ color:"var(--text)",marginTop:2 }}>{m.text}</div>
                      </div>
                    ))}
                </div>
              )}
              {ghostTab === "seer" && (
                <div style={{ maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4 }}>
                  {seerChats.length === 0
                    ? <div style={{ color:"var(--dim)",fontStyle:"italic",fontSize:".82rem",textAlign:"center",padding:"12px 0" }}>Seer chat will appear here when active.</div>
                    : seerChats.map((m,i) => (
                      <div key={i} style={{ background:"rgba(40,0,60,.5)",border:"1px solid rgba(100,0,140,.2)",borderRadius:3,padding:"6px 10px",fontSize:".82rem" }}>
                        <span style={{ color:"#dd88ff",fontFamily:"'Cinzel',serif",fontSize:".6rem" }}>{m.sender}</span>
                        <div style={{ color:"var(--text)",marginTop:2 }}>{m.text}</div>
                      </div>
                    ))}
                </div>
              )}
              {ghostTab === "recruit" && (
                <div style={{ maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4 }}>
                  {recruitChats.length === 0
                    ? <div style={{ color:"var(--dim)",fontStyle:"italic",fontSize:".82rem",textAlign:"center",padding:"12px 0" }}>Recruit chat will appear here when active.</div>
                    : recruitChats.map((m,i) => (
                      <div key={i} style={{ background:"rgba(40,0,60,.5)",border:"1px solid rgba(100,0,140,.2)",borderRadius:3,padding:"6px 10px",fontSize:".82rem" }}>
                        <span style={{ color:"#d088ff",fontFamily:"'Cinzel',serif",fontSize:".6rem" }}>{m.sender}</span>
                        <div style={{ color:"var(--text)",marginTop:2 }}>{m.text}</div>
                      </div>
                    ))}
                </div>
              )}
              {ghostTab === "ghost" && (
                <GhostChat ghostChats={ghostChats} ghostDraft={ghostDraft} setGhostDraft={setGhostDraft} sendGhostChat={sendGhostChat} myId={myId} isHost={false} senderName={me?.name || (isSpectator ? "👁 Spectator" : "Ghost")} />
              )}
            </div>
          );
        })()}

        <MsgLog messages={messages} />
      </div>
    </div>
  </div>
);

}

// LOBBY
if (game.phase === PHASES.LOBBY) return (
<div className="app"><style>{CSS}</style><div className="noise" /><div className="z1">
{showAvatarCapture && (
  <AvatarCapture onSave={(dataUrl) => { saveAvatar(dataUrl); setShowAvatarCapture(false); }} onClose={() => setShowAvatarCapture(false)} />
)}
<div className="hdr">

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
      <div className="main">
        <div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 6, padding: "14px 20px", textAlign: "center", marginBottom: 8 }}>
          <div style={{
            fontFamily: "'Cinzel Decorative',cursive",
            fontSize: "clamp(1rem,3.5vw,1.5rem)",
            fontWeight: 700,
            color: "var(--gold)",
            letterSpacing: ".08em",
            textShadow: "0 0 30px rgba(201,168,76,.35)",
            lineHeight: 1.3,
          }}>The castle gathers its guests…</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={async () => {
            setGame(null); setGameId(""); setMyId(""); setIsHost(false); setScreen("start");
            try { await save("traitors-session", null); } catch(e) {}
          }}>← Back</button>
        </div>
        <AnimatedCandles count={6} style={{ marginBottom:4, marginTop:-8 }} />
        <div className="card">
          <div className="ctitle">Share This Game</div>
          <div className="game-id-box" onClick={copyId}>{gameId}</div>
          <div className="copy-hint">{copied ? "✓ Copied!" : "Tap to copy · Share with all players"}</div>
        </div>
        <div className="card">
          <div className="ctitle">Players Gathered ({game.players.length})</div>
          <div className="pgrid">
            {game.players.map(p => (
              <div key={p.id} className="pcard" style={{ position: "relative" }}>
                {isHost && p.id !== myId && (
                  <button onClick={() => kickPlayer(p.id)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(139,26,26,.4)", border: "1px solid rgba(139,26,26,.6)", borderRadius: 2, padding: "1px 5px", fontSize: ".5rem", color: "var(--crim3)", cursor: "pointer", fontFamily: "'Cinzel',serif" }}>✕</button>
                )}
                <div className="pavatar">{p.emoji}</div>
                <div className="pname">{p.name}{p.id === myId ? " (You)" : ""}</div>
                {p.id === game.hostId && <div style={{ fontSize: ".6rem", color: "var(--gold2)", marginTop: 3, fontFamily: "'Cinzel',serif" }}>Host</div>}
              </div>
            ))}
          </div>
        </div>
        {isHost && (
          <div className="card host">
            <div className="host-label">⚜ Game Configuration</div>
            <div className="col">
              {/* Game duration */}
              <div className="label" style={{ marginBottom: 4 }}>Game Duration</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[{h:3,p:"10--11"},{h:4,p:"12--13"},{h:5,p:"14--15"},{h:6,p:"16--19"},{h:7,p:"20--22"},{h:8,p:"23--24"}].map(({h,p}) => (
                  <button key={h} onClick={() => setGameDuration(h)} style={{
                    flex: 1, padding: "8px 4px", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                    transition: "all .2s",
                    background: gameDuration === h ? "rgba(201,168,76,.15)" : "rgba(255,255,255,.03)",
                    border: gameDuration === h ? "1px solid rgba(201,168,76,.5)" : "1px solid rgba(255,255,255,.08)",
                    color: gameDuration === h ? "var(--gold)" : "var(--dim)",
                  }}>
                    <div style={{ fontSize: ".72rem", fontWeight: 700 }}>{h}h</div>
                    <div style={{ fontSize: ".55rem", opacity: .7, marginTop: 1 }}>{p}</div>
                  </button>
                ))}
              </div>
              {(() => {
                const n = game.players.length;
                const rounds = Math.ceil((n - 4) / 2);
                const scale = gameDuration / 4;
                // Scaled per-round phases: mission(12) + free_roam(12) + round_table(12) + voting(5) + banishment(4) + breakfast(5) = 50
                const scaledPerRound = Math.round(50 * scale);
                // Fixed per-round: night ceremony(15) + breakfast_convo(3) = 18
                const fixedPerRound = 18;
                // Fixed overhead: ST ceremony(15) + role_reveal(3) + mission_briefing(2) + endgame_free_roam(10) + fire_of_truth(10) + unmasking(10) = 50
                const overhead = 50;
                const estimatedMins = overhead + rounds * (scaledPerRound + fixedPerRound);
                const estimatedHours = (estimatedMins / 60).toFixed(1);
                // Suggested: 3h works for 10--11 players, 4h for 12--13, 5h for 14--15, 6h for 16+
                const suggested = n <= 11 ? 3 : n <= 13 ? 4 : n <= 15 ? 5 : n <= 19 ? 6 : n <= 22 ? 7 : 8;
                const tooShort = gameDuration < suggested;
                const tight = gameDuration === suggested;
                const good = gameDuration > suggested;
                return (
                  <div style={{ fontSize: ".75rem", marginTop: 6, lineHeight: 1.6 }}>
                    <span style={{ color: good ? "#80e080" : tight ? "#80e080" : "var(--crim3)" }}>
                      {good || tight ? "✓" : "⚠️"}
                    </span>{" "}
                    <span style={{ color: "var(--dim)", fontStyle: "italic" }}>
                      {n} players · {rounds} round{rounds !== 1 ? "s" : ""} · ~{estimatedHours}h estimated
                    </span>
                    {tooShort && <span style={{ color: "var(--crim3)", display: "block", fontStyle: "italic" }}>⚠️ Too short — suggest {suggested}h for {n} players.</span>}
                    {(tight || good) && <span style={{ color: "#80e080", display: "block", fontStyle: "italic" }}>Suggested for {n} players: {suggested}h{good ? ` · ${gameDuration}h gives extra breathing room` : ""}.</span>}
                  </div>
                );
              })()}
              <div className="divider" />
              {/* Traitor selection */}
              <div className="label" style={{ marginBottom: 6 }}>Traitor Selection</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button onClick={() => setManualTraitorIds([])} style={{ flex:1, padding:"7px 4px", borderRadius:3, fontFamily:"'Cinzel',serif", fontSize:".68rem", fontWeight:700, cursor:"pointer", background: manualTraitorIds.length === 0 ? "rgba(201,168,76,.15)" : "rgba(255,255,255,.03)", border: manualTraitorIds.length === 0 ? "1px solid rgba(201,168,76,.5)" : "1px solid rgba(255,255,255,.08)", color: manualTraitorIds.length === 0 ? "var(--gold)" : "var(--dim)" }}>🎲 Let Fate Decide</button>
                <button onClick={() => setManualTraitorIds(m => m.length > 0 ? m : ['select'])} style={{ flex:1, padding:"7px 4px", borderRadius:3, fontFamily:"'Cinzel',serif", fontSize:".68rem", fontWeight:700, cursor:"pointer", background: manualTraitorIds.length > 0 ? "rgba(139,26,26,.15)" : "rgba(255,255,255,.03)", border: manualTraitorIds.length > 0 ? "1px solid rgba(139,26,26,.5)" : "1px solid rgba(255,255,255,.08)", color: manualTraitorIds.length > 0 ? "var(--crim3)" : "var(--dim)" }}>🗡️ Choose Traitors</button>
              </div>
              {manualTraitorIds.length === 0 && (
                <div className="row" style={{ marginBottom: 4 }}>
                  <span className="label" style={{ margin: 0 }}>Number of Traitors:</span>
                  <input type="number" value={traitorCount} onChange={e => setTraitorCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={Math.max(1, Math.floor(game.players.length / 3))} style={{ width: 48 }} />
                  <span style={{ fontSize: ".85rem", color: "var(--dim)" }}>of {game.players.length}</span>
                </div>
              )}
              {manualTraitorIds.length > 0 && (
                <div>
                  <div style={{ fontSize: ".72rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 8 }}>Tap players to designate as Traitors. Selected: {manualTraitorIds.filter(id=>id!=='select').length}/{Math.max(1,Math.floor(game.players.length/3))} max</div>
                  <div className="pgrid">
                    {game.players.filter(p => p.id !== myId).map(p => {
                      const isSelected = manualTraitorIds.includes(p.id);
                      return (
                        <div key={p.id} className={`pcard click ${isSelected ? "crim" : ""}`} style={{ borderColor: isSelected ? "rgba(139,26,26,.6)" : "var(--border)" }} onClick={() => setManualTraitorIds(prev => {
                          const clean = prev.filter(id => id !== 'select');
                          const max = Math.max(1, Math.floor(game.players.length / 3));
                          if (clean.includes(p.id)) return clean.filter(id => id !== p.id);
                          if (clean.length >= max) return clean;
                          return [...clean, p.id];
                        })}>
                          <div className="pavatar">{p.emoji}</div>
                          <div className="pname" style={{ fontSize: ".62rem" }}>{p.name}</div>
                          {isSelected && <div className="prole role-t" style={{ fontSize: ".5rem" }}>Traitor</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="divider" />
              {/* Game elements */}
              <div className="label" style={{ marginBottom: 4 }}>Special Game Elements</div>
              <div className="info-box" style={{ fontSize: ".85rem", marginBottom: 10 }}>
                Choose which special roles and powers are in play. Randomise all for maximum chaos, or configure each element manually.
              </div>
              {/* Randomise button */}
              <button className="btn btn-outline" style={{ marginBottom: 6 }} onClick={() => {
                setSecretTraitorEnabled(Math.random() > 0.4);
                setSeerEnabled(Math.random() > 0.3);
                setDaggerEnabled(Math.random() > 0.3);
              }}>🎲 Randomise Everything</button>
              {/* Manual toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <GameElementToggle
                    icon="🎭" label="Secret Traitor"
                    desc="One Faithful player is secretly a Traitor — unknown even to the other Traitors. Revealed to the group before blindfolding begins."
                    enabled={secretTraitorEnabled} onChange={v => { setSecretTraitorEnabled(v); if (!v) setManualSTId(null); }} />
                  {secretTraitorEnabled && (
                    <div style={{ marginTop: 6, padding: "10px 12px", background: "rgba(60,0,80,.12)", border: "1px solid rgba(120,0,140,.25)", borderRadius: 3 }}>
                      <div style={{ fontSize: ".65rem", fontFamily: "'Cinzel',serif", letterSpacing: ".1em", color: "#d88ef0", textTransform: "uppercase", marginBottom: 8 }}>🎭 Secret Traitor Selection</div>
                      <div style={{ display: "flex", gap: 6, marginBottom: manualSTId ? 8 : 0 }}>
                        <button onClick={() => setManualSTId(null)} style={{ flex:1, padding:"5px 4px", borderRadius:3, fontFamily:"'Cinzel',serif", fontSize:".62rem", fontWeight:700, cursor:"pointer", background: !manualSTId ? "rgba(201,168,76,.15)" : "rgba(255,255,255,.03)", border: !manualSTId ? "1px solid rgba(201,168,76,.4)" : "1px solid rgba(255,255,255,.08)", color: !manualSTId ? "var(--gold)" : "var(--dim)" }}>🎲 Random</button>
                        <button onClick={() => setManualSTId(manualSTId || 'pick')} style={{ flex:1, padding:"5px 4px", borderRadius:3, fontFamily:"'Cinzel',serif", fontSize:".62rem", fontWeight:700, cursor:"pointer", background: manualSTId ? "rgba(60,0,80,.2)" : "rgba(255,255,255,.03)", border: manualSTId ? "1px solid rgba(120,0,140,.5)" : "1px solid rgba(255,255,255,.08)", color: manualSTId ? "#d88ef0" : "var(--dim)" }}>🎭 Choose</button>
                      </div>
                      {manualSTId && (
                        <>
                          <div style={{ fontSize: ".65rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 6 }}>Pick a Faithful player to be the Secret Traitor — they must not be a regular Traitor.</div>
                          <div className="pgrid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                            {game.players.filter(p => p.id !== myId && !manualTraitorIds.filter(id=>id!=='select').includes(p.id)).map(p => (
                              <div key={p.id} className={`pcard click ${manualSTId === p.id ? "sel" : ""}`}
                                style={{ borderColor: manualSTId === p.id ? "rgba(140,0,200,.6)" : "var(--border)", padding: "6px 4px" }}
                                onClick={() => setManualSTId(prev => prev === p.id ? 'pick' : p.id)}>
                                <div className="pavatar" style={{ fontSize: "1.1rem" }}>{p.emoji}</div>
                                <div className="pname" style={{ fontSize: ".55rem" }}>{p.name}</div>
                                {manualSTId === p.id && <div className="prole role-s" style={{ fontSize: ".45rem" }}>ST</div>}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <GameElementToggle
                  icon="👁️" label="Seer"
                  desc="Can be earned via mission. The Seer may privately interrogate one player to learn their true role."
                  enabled={seerEnabled} onChange={setSeerEnabled} />
                <GameElementToggle
                  icon="🗡️" label="Dagger"
                  desc="Can be earned via mission. Grants double voting weight at the Round Table."
                  enabled={daggerEnabled} onChange={setDaggerEnabled} />
              </div>
              <div className="divider" />
              {/* Active elements summary */}
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                {secretTraitorEnabled && <span className="badge b-seer" style={{ background: "rgba(80,0,80,.3)", color: "#d88ef0", border: "1px solid rgba(120,0,120,.4)" }}>🎭 Secret Traitor</span>}
                {seerEnabled && <span className="badge b-seer">👁️ Seer</span>}
                {daggerEnabled && <span className="badge b-dagger">🗡️ Dagger</span>}
                {!secretTraitorEnabled && !seerEnabled && !daggerEnabled && <span className="dim" style={{ fontSize: ".85rem", fontStyle: "italic" }}>No special elements — vanilla game</span>}
              </div>
              {error && <div style={{ color: "#e88", fontSize: ".9rem" }}>{error}</div>}
              {(() => {
                const avCount = Object.keys(avatars).length;
                const total = game.players.length;
                if (total >= 4 && avCount < total) return (
                  <div style={{ fontSize:".78rem",color:"var(--gold2)",fontStyle:"italic",textAlign:"center",marginBottom:6,padding:"6px 10px",background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.15)",borderRadius:3 }}>
                    📸 {avCount}/{total} portraits taken — players must take their selfie before you begin.
                  </div>
                );
                return null;
              })()}
              <button className="btn btn-gold btn-lg" onClick={startGame} disabled={game.players.length < 4}>
                {game.players.length < 10 ? `Need ${10 - game.players.length} more player${10 - game.players.length === 1 ? "" : "s"} (${game.players.length}/10 min)` : "Lock In & Begin →"}
              </button>
            </div>
          </div>
        )}
        {!isHost && (
          <div className="col">
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={async () => {
                const updated = { ...game, players: game.players.filter(p => p.id !== myId) };
                await save(gameId, updated);
                setGame(null); setGameId(""); setMyId(""); setIsHost(false); setScreen("start");
                try { await save("traitors-session", null); } catch(e) {}
              }}>← Leave Lobby</button>
            </div>
            <div className="info-box" style={{ textAlign: "center" }}>Waiting for the host to start the game and seal your fate.<br /><span style={{ fontSize: ".85rem" }}>({game.players.length} unsuspecting souls in the castle)</span></div>
            {/* Avatar capture in lobby */}
            <div className="card" style={{ textAlign: "center", padding: "18px 20px", border: myAvatar ? "1px solid rgba(201,168,76,.25)" : "1px solid rgba(139,26,26,.3)", background: myAvatar ? "rgba(201,168,76,.03)" : "rgba(139,26,26,.04)" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 4 }}>📸 Your Portrait</div>
              {!myAvatar && <div style={{ fontSize:".62rem",fontFamily:"'Cinzel',serif",letterSpacing:".12em",textTransform:"uppercase",color:"var(--crim3)",marginBottom:10 }}>Required before game can start</div>}
              <div style={{ fontSize: ".82rem", color: "var(--dim)", fontStyle: "italic", marginBottom: 14 }}>Take a quick selfie — it appears on the photo wall at breakfast as a gold portrait frame.</div>
              {myAvatar
                ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <GoldFrame src={myAvatar} size={80} />
                    <button className="btn btn-outline btn-sm" onClick={() => setShowAvatarCapture(true)}>Retake Photo</button>
                  </div>
                : <button className="btn btn-gold btn-sm" onClick={() => setShowAvatarCapture(true)}>📸 Take Your Portrait</button>
              }
            </div>
          </div>
        )}
      </div>
    </div></div>
  );

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GAME VIEW
// ═══════════════════════════════════════════════════════════════════════════
return (
<div className="app">
<style>{CSS}</style>
<div className="noise" />

  {/* AVATAR CAPTURE MODAL */}
  {showAvatarCapture && (
    <AvatarCapture onSave={(dataUrl) => { saveAvatar(dataUrl); setShowAvatarCapture(false); }} onClose={() => setShowAvatarCapture(false)} />
  )}

  {/* PHASE TRANSITION OVERLAY */}
  {phaseTransition && !isHost && (
    <div className="transition-overlay">
      <div className="transition-inner">
        <div style={{ fontSize:"4rem",marginBottom:16,animation:"scaleIn .5s .15s cubic-bezier(.34,1.56,.64,1) both" }}>{phaseTransition.icon}</div>
        <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"clamp(1.4rem,5vw,2.2rem)",color:phaseTransition.color,marginBottom:12,lineHeight:1.2,textShadow:`0 0 40px ${phaseTransition.color}55`,animation:"slideUp .4s .25s ease both" }}>{phaseTransition.title}</div>
        <div style={{ fontStyle:"italic",color:"var(--dim)",fontSize:"1rem",lineHeight:1.7,animation:"fadeInEl .4s .4s ease both" }}>{phaseTransition.sub}</div>
      </div>
    </div>
  )}

  {/* DEATH LETTER — shown to murdered player at breakfast reveal */}
  {deathLetter && (
    <div className="transition-overlay" style={{ background:"rgba(10,2,2,.97)" }}>
      <div className="transition-inner" style={{ maxWidth:380 }}>
        <div className="death-letter" style={{ animation:"dramaticEnter .7s ease both" }}>
          <div className="wax-seal" style={{ animation:"scaleIn .5s .3s cubic-bezier(.34,1.56,.64,1) both" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,180,160,.3)" strokeWidth="1.5"/>
              <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,180,160,.2)" strokeWidth=".8"/>
              <text x="22" y="29" textAnchor="middle" fontFamily="Cinzel Decorative, serif" fontWeight="900" fontSize="20" fill="rgba(255,220,200,.85)" letterSpacing="1">T</text>
            </svg>
          </div>
          <div style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".25em",textTransform:"uppercase",color:"rgba(220,50,50,.95)",textShadow:"0 0 20px rgba(180,20,20,.6)",marginBottom:16,textAlign:"center" }}>By the Order of the Traitors</div>
          <div style={{ borderTop:"1px solid rgba(139,26,26,.2)",borderBottom:"1px solid rgba(139,26,26,.2)",padding:"16px 0",margin:"0 0 16px",textAlign:"center" }}>
            <div style={{ fontFamily:"'Cinzel Decorative',cursive",fontSize:"1.4rem",color:"var(--crim3)",lineHeight:1.3,marginBottom:8 }}>You Have Been<br />Murdered</div>
          <div style={{ fontFamily:"'Cinzel',serif",fontSize:".65rem",letterSpacing:".15em",color:"rgba(200,80,80,.5)",marginTop:6 }}>— Signed, The Traitors —</div>
          </div>
          <div style={{ fontFamily:"'Crimson Text',serif",fontSize:"1rem",lineHeight:1.8,color:"rgba(220,190,160,.8)",textAlign:"center",fontStyle:"italic" }}>
            The Turret convened in the darkness of the night and reached unanimous verdict.
            Your seat at breakfast is empty.
            Your candle has been snuffed.
          </div>

        </div>
        <button className="btn btn-outline" style={{ marginTop:20,width:"100%",borderColor:"rgba(139,26,26,.3)",color:"rgba(220,160,160,.7)" }}
          onClick={() => setDeathLetter(false)}>
          Accept Your Fate → Enter Ghost Life
        </button>
      </div>
    </div>
  )}

  {/* SEER RESULT MODAL */}
  {seerResult && (
    <div className="overlay" onClick={() => setSeerResult(null)}>
      <div className="modal seer-result-modal" style={{ borderColor: "rgba(120,40,200,.5)" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>👁️</div>
        <div className="label" style={{ color: "#dd88ff", textAlign: "center" }}>The Seer's Vision</div>
        <div style={{ fontSize: "1.1rem", marginBottom: 6, color: "var(--text)", textAlign: "center" }}><strong>{seerResult.target}</strong> is…</div>
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.6rem", textAlign: "center", color: seerResult.role === "traitor" || seerResult.role === "secret_traitor" ? "var(--crim2)" : "var(--gold)" }}>
          {seerResult.role === "traitor" || seerResult.role === "secret_traitor" ? "A TRAITOR" : "FAITHFUL"}
        </div>
        <div className="info-box red" style={{ marginTop: 14, fontSize: ".85rem" }}>You now know something no one else does. Don't blow it by immediately telling everyone at breakfast. Sit with it. Weaponise it.</div>
        <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }} onClick={() => setSeerResult(null)}>Understood</button>
      </div>
    </div>
  )}

  {/* SEER PICK MODAL */}
  {showSeerModal && (
    <div className="overlay">
      <div className="modal" style={{ borderColor: "rgba(120,40,200,.4)", background: "rgba(12,3,24,.98)" }}>
        <div style={{ fontSize: "2rem", marginBottom: 10 }}>👁️</div>
        <div className="ctitle purple" style={{ textAlign: "center" }}>Use Your Seer Power</div>
        <div className="italic" style={{ marginBottom: 14, fontSize: ".9rem" }}>Point at one person. They must show you their role on their phone. Do it quietly and try not to visibly react when you find out you've been sleeping next to a monster.</div>
        <div className="pgrid" style={{ marginBottom: 14 }}>
          {alivePlayers.filter(p => p.id !== myId).map(p => (
            <div key={p.id} className={`pcard click ${seerTarget === p.id ? "sel" : ""}`} onClick={() => setSeerTarget(p.id)}>
              <div className="pavatar">{p.emoji}</div>
              <div className="pname">{p.name}</div>
            </div>
          ))}
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn btn-night btn-sm" onClick={useSeerPower} disabled={!seerTarget}>Demand the Truth</button>
          <button className="btn btn-outline btn-sm" onClick={() => setShowSeerModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )}

  {/* BANISHMENT REVEAL MODAL */}
  {showBanishModal && game.lastBanished && (
    <div className="overlay" onClick={() => setShowBanishModal(false)}>
      <div className="modal crim" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <BanishReveal data={game.lastBanished} />
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => setShowBanishModal(false)}>Continue</button>
      </div>
    </div>
  )}

  <div className="z1" style={ (!me?.alive && me) ? { filter: "grayscale(0.85) brightness(0.7)", transition: "filter .5s" } : {} }>
    {/* Privacy mode overlay — blurs everything except timer */}
    {privacyMode && (
      <div style={{ position: "fixed", inset: 0, backdropFilter: "blur(18px)", zIndex: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(4,1,8,.6)" }}>
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.1rem", color: "var(--gold)", marginBottom: 8 }}>🔒 Privacy Mode</div>
        {timerSec > 0 && <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "3rem", color: timerSec < 120 ? "var(--crim3)" : "var(--gold)" }}>{String(Math.floor(timerSec/60)).padStart(2,"0")}:{String(timerSec%60).padStart(2,"0")}</div>}
        <button onClick={() => setPrivacyMode(false)} style={{ marginTop: 20, background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 3, padding: "8px 20px", fontFamily: "'Cinzel',serif", fontSize: ".65rem", color: "var(--gold)", cursor: "pointer", letterSpacing: ".1em" }}>TAP TO REVEAL</button>
      </div>
    )}
    <div className="hdr">
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
      {/* Online indicator */}
      <div style={{ position: "absolute", top: 10, left: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isOnline ? "#50e050" : "#e05050", boxShadow: isOnline ? "0 0 6px #50e050" : "0 0 6px #e05050", transition: "background .5s" }} />
        {!isOnline && <span style={{ fontSize: ".55rem", color: "#e05050", fontFamily: "'Cinzel',serif", letterSpacing: ".08em" }}>OFFLINE</span>}
      </div>
      {/* Privacy mode toggle (non-host players only) */}
      {!isHost && me && game.phase !== PHASES.LOBBY && (
        <button onClick={() => setPrivacyMode(true)} style={{ position: "absolute", top: 10, left: isOnline ? 30 : 70, background: "transparent", border: "none", cursor: "pointer", fontSize: ".85rem", opacity: .4 }} title="Privacy mode">🔒</button>
      )}
      {isHost && (
        <button onClick={togglePause} style={{ position: "absolute", top: 12, right: 16, background: game.paused ? "rgba(201,168,76,.15)" : "rgba(255,255,255,.05)", border: game.paused ? "1px solid rgba(201,168,76,.4)" : "1px solid rgba(255,255,255,.1)", borderRadius: 3, padding: "5px 10px", fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".1em", color: game.paused ? "var(--gold)" : "var(--dim)", cursor: "pointer" }}>
          {game.paused ? "▶ RESUME" : "⏸ PAUSE"}
        </button>
      )}
    </div>
    {/* Pause overlay — shown to all players */}
    {game.paused && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(4,1,8,.92)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: "3rem" }}>⏸</div>
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "1.5rem", color: "var(--gold)" }}>Game Paused</div>
        <div style={{ fontFamily: "'Cinzel Decorative',cursive", fontSize: "2.5rem", color: "var(--gold)", letterSpacing: ".05em" }}>
          {String(Math.floor(pauseElapsed / 60)).padStart(2,"0")}:{String(pauseElapsed % 60).padStart(2,"0")}
        </div>
        <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".9rem" }}>The host has paused the game. Sit tight.</div>
        {isHost && <button onClick={togglePause} className="btn btn-gold" style={{ marginTop: 8 }}>▶ Resume Game</button>}
      </div>
    )}
    {/* Persistent player buttons — Role, Inventory, Players */}
    {!isHost && me && game.phase !== PHASES.LOBBY && game.phase !== PHASES.ENDED && (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(4,1,8,.95)", borderTop: "1px solid rgba(201,168,76,.15)", display: "flex", gap: 0 }}>
        <button onClick={() => { const opening = !showMyRole; setShowMyRole(opening); setShowInventory(false); setShowPlayerPanel(false); }} style={{ flex: 1, padding: "10px 4px", fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".08em", textTransform: "uppercase", background: showMyRole ? "rgba(201,168,76,.12)" : "transparent", color: showMyRole ? "var(--gold)" : "var(--dim)", border: "none", borderRight: "1px solid rgba(201,168,76,.1)", cursor: "pointer" }}>
          🎭 Role
        </button>
        <button onClick={() => { const opening = !showInventory; setShowInventory(opening); setShowMyRole(false); setShowPlayerPanel(false); }} style={{ flex: 1, padding: "10px 4px", fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".08em", textTransform: "uppercase", background: showInventory ? "rgba(201,168,76,.12)" : "transparent", color: showInventory ? "var(--gold)" : "var(--dim)", border: "none", borderRight: "1px solid rgba(201,168,76,.1)", cursor: "pointer" }}>
          🎒 Inventory
        </button>
        <button onClick={() => { const opening = !showPlayerPanel; setShowPlayerPanel(opening); setShowMyRole(false); setShowInventory(false); }} style={{ flex: 1, padding: "10px 4px", fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".08em", textTransform: "uppercase", background: showPlayerPanel ? "rgba(201,168,76,.12)" : "transparent", color: showPlayerPanel ? "var(--gold)" : "var(--dim)", border: "none", cursor: "pointer" }}>
          👥 Players
        </button>
      </div>
    )}
    {/* Role panel */}
    {!isHost && showMyRole && me && (
      <div style={{ position: "fixed", bottom: 44, left: 0, right: 0, zIndex: 99, background: "rgba(7,3,14,.97)", borderTop: "1px solid rgba(201,168,76,.2)", padding: "16px 20px" }}>
        <RoleCard me={me} isTraitor={isTraitor} isSecretTraitor={isSecretTraitor} knownAllies={[]} onSeer={() => {}} showSeerBtn={false} />
      </div>
    )}
    {/* Inventory panel */}
    {!isHost && showInventory && me && (
      <div style={{ position: "fixed", bottom: 44, left: 0, right: 0, zIndex: 99, background: "rgba(7,3,14,.97)", borderTop: "1px solid rgba(201,168,76,.2)", padding: "16px 20px" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 12 }}>🎒 Inventory</div>
        {(!me.shield && !me.dagger && !me.seerRole)
          ? <div style={{ fontStyle: "italic", color: "var(--dim)", fontSize: ".9rem" }}>Empty — no powers yet.</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🛡️", label: "Shield", held: !!me.shield, desc: "Blocks one unanimous murder attempt" },
                { icon: "🗡️", label: "Dagger", held: !!me.dagger, desc: "Declare at Round Table to double your vote — one use ever" },
                { icon: "👁️", label: "Seer", held: !!me.seerRole, desc: "Interrogate one player each night" },
              ].filter(pw => pw.held).map((pw, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 3, background: "rgba(201,168,76,.07)", border: "1px solid rgba(201,168,76,.2)" }}>
                  <div style={{ fontSize: "1.4rem" }}>{pw.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: "var(--gold)" }}>{pw.label}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--dim)", fontStyle: "italic" }}>{pw.desc}</div>
                  </div>
                </div>
              ))}
            </div>
        }
        {seerExplain && me?.seerRole && (
          <div style={{ background: "rgba(60,0,90,.2)", border: "1px solid rgba(120,0,180,.4)", borderRadius: 4, padding: "12px 14px", marginTop: 10 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".62rem", letterSpacing: ".12em", color: "#dd88ff", marginBottom: 6, textTransform: "uppercase" }}>👁️ Seer Power — How It Works</div>
            <div style={{ fontSize: ".85rem", color: "rgba(180,140,220,.85)", lineHeight: 1.7 }}>{seerExplain.msg}</div>
          </div>
        )}
      </div>
    )}
    {/* Players panel */}
    {!isHost && showPlayerPanel && game && (
      <div style={{ position: "fixed", bottom: 44, left: 0, right: 0, zIndex: 99, background: "rgba(7,3,14,.97)", borderTop: "1px solid rgba(201,168,76,.2)", padding: "14px 18px", maxHeight: "60vh", overflowY: "auto" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: 10 }}>👥 Players</div>
        {(() => {
          const alive = (game.players || []).filter(p => p.alive);
          const ghosts = (game.players || []).filter(p => !p.alive);
          return (
            <>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#80e080", marginBottom: 6 }}>Alive ({alive.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                {alive.map(pl => (
                  <div key={pl.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 8px", background: "rgba(255,255,255,.03)", borderRadius: 3 }}>
                    <div style={{ fontSize: "1.1rem" }}>{pl.emoji}</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".78rem", color: pl.id === me?.id ? "var(--gold)" : "var(--text)" }}>{pl.name}{pl.id === me?.id ? " (You)" : ""}</div>
                  </div>
                ))}
              </div>
              {ghosts.length > 0 && (
                <>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(140,100,180,.6)", marginBottom: 6 }}>Ghosts ({ghosts.length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {ghosts.map(pl => (
                      <div key={pl.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", opacity: .5 }}>
                        <div style={{ fontSize: "1rem" }}>{pl.emoji}</div>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".75rem", color: "var(--dim)", textDecoration: "line-through" }}>{pl.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          );
        })()}
      </div>
    )}
    <div className="phase-strip">
      {PHASE_STRIP.map((s, i) => (
        <div key={s.key} className={`ps-item ${game.phase === s.key || (isNightPhase && s.key === PHASES.NIGHT_SEQUESTER) ? "active" : i < phaseStripIdx ? "done" : ""}`}>{s.label}</div>
      ))}
    </div>

    <div className="main" key={phaseKey} style={{ animation: phaseKey > 0 ? "phaseEnter .4s ease both" : "none" }}>
      {/* Phase atmosphere motif */}
      {!isHost && <PhaseAtmosphere phase={game.phase} />}
      {/* ROLE CARD — hidden until host releases roles */}
      {me && game.phase !== PHASES.LOBBY && (game.phase !== PHASES.ROLE_REVEAL || game.rolesReleased) && (
        <RoleCard me={me} isTraitor={isTraitor} isSecretTraitor={isSecretTraitor} knownAllies={knownAllies} onSeer={() => setShowSeerModal(true)} showSeerBtn={(game.phase === PHASES.FREE_ROAM || isNightPhase) && isSeer} />
      )}

      {/* STATS */}
      {game.phase !== PHASES.ROLE_REVEAL && (
        <div className="stats">
          <div className="stat"><div className="stat-n">{alivePlayers.length}</div><div className="stat-l">Alive</div></div>
          <div className="stat"><div className="stat-n">{game.round || 1}{game.totalRounds ? <span style={{ fontSize: ".7rem", color: "var(--dim2)" }}>/{game.totalRounds}</span> : ""}</div><div className="stat-l">Round</div></div>
          <div className="stat"><div className="stat-n">{deadPlayers.length}</div><div className="stat-l">Dead</div></div>
          <div className="stat"><div className="stat-n">{game.round || 1}{game.totalRounds ? <span style={{ fontSize: ".7rem", color: "var(--dim2)" }}>/{game.totalRounds}</span> : ""}</div><div className="stat-l">Round</div></div>
        </div>
      )}

      {/* PHASE CONTENT */}
      <PhaseContent
        game={game} me={me} myId={myId} isHost={isHost}
        isTraitor={isTraitor} isSecretTraitor={isSecretTraitor} isSeer={isSeer}
        canJoinTraitorChat={canJoinTraitorChat} hasTraitorRole={hasTraitorRole}
        alivePlayers={alivePlayers} deadPlayers={deadPlayers}
        aliveTraitors={aliveTraitors}
        selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget}
        selectedMission={selectedMission} setSelectedMission={setSelectedMission}
        missionFilter={missionFilter} setMissionFilter={setMissionFilter}
        myRoom={myRoom} updateRoom={updateRoom}
        timerSec={timerSec} timerMax={timerMax} timerRunning={timerRunning}
        timerClass={timerClass} fmtTime={fmtTime} timerPct={timerPct}
        startTimer={startTimer}
        chatDraft={chatDraft} setChatDraft={setChatDraft}
        traitorChats={traitorChats} chatRef={chatRef}
        stChats={stChats} stChatDraft={stChatDraft} setStChatDraft={setStChatDraft} sendStChat={sendStChat}
        seerChats={seerChats} seerDraft={seerDraft} setSeerDraft={setSeerDraft} sendSeerChat={sendSeerChat}
        recruitChats={recruitChats} recruitDraft={recruitDraft} setRecruitDraft={setRecruitDraft} sendRecruitChat={sendRecruitChat}
        shortlist={shortlist} setShortlist={setShortlist}
        dayTally={dayTally} hasVotedDay={hasVotedDay} hasVotedNight={hasVotedNight}
        breakfastGroupIdx={game.breakfastGroupIdx || 0}
        endgameChoice={endgameChoice}
        // actions
        startGame={startGame}
        hostStartMission={hostStartMission}
        awardPower={awardPower}
        advanceTo={advanceTo}
        hostBeginNight={hostBeginNight}
        hostEndSeerPhase={hostEndSeerPhase}
        hostEndSecretTraitorPhase={hostEndSecretTraitorPhase}
        submitRecruitTarget={submitRecruitTarget}
        acceptRecruitment={acceptRecruitment}
        declineRecruitment={declineRecruitment}
        recruitTarget={recruitTarget}
        setRecruitTarget={setRecruitTarget}
        resolveNight={resolveNight}
        resolveBanishment={resolveBanishment}
        advanceBreakfastGroup={advanceBreakfastGroup}
        advanceFromBreakfast={advanceFromBreakfast}
        revealBreakfast={revealBreakfast}
        submitDayVote={submitDayVote}
        submitNightVote={submitNightVote}
        submitShortlist={submitShortlist}
        sendChat={sendChat}
        submitEndgameVote={submitEndgameVote}
        resetGame={resetGame}
        goBackPhase={goBackPhase}
        manualKillPlayer={manualKillPlayer}
        manualRevivePlayer={manualRevivePlayer}
        avatars={avatars}
        releaseRoles={releaseRoles}
        finishRoleReveal={finishRoleReveal}
        stRevealPlayer={stRevealPlayer}
        stAdvanceToNext={stAdvanceToNext}
        stSkipSelection={stSkipSelection}
        stRevealResult={stRevealResult}
        phaseTimers={phaseTimers}
        seerTarget={seerTarget}
        setSeerTarget={setSeerTarget}
        seerResult={seerResult}
        useSeerPower={useSeerPower}
        seerLocked={seerLocked}
        setSeerLocked={setSeerLocked}
        seerExplain={seerExplain}
        gameId={gameId}
        dmTriviaQ={dmTriviaQ} setDmTriviaQ={setDmTriviaQ}
        dmTriviaScores={dmTriviaScores} setDmTriviaScores={setDmTriviaScores}
        dmTriviaBank={dmTriviaBank}
        dmBuzzerWinner={dmBuzzerWinner} setDmBuzzerWinner={setDmBuzzerWinner}
        dmForbiddenWords={dmForbiddenWords} dmForbiddenElim={dmForbiddenElim} setDmForbiddenElim={setDmForbiddenElim}
        dmAuctionBids={dmAuctionBids} setDmAuctionBids={setDmAuctionBids}
        dmAuctionRevealed={dmAuctionRevealed} setDmAuctionRevealed={setDmAuctionRevealed}
        dmWhisperPhrase={dmWhisperPhrase}
        dmEmojiIdx={dmEmojiIdx} dmName5Idx={dmName5Idx} dmName5Round={dmName5Round} dmName5Scores={dmName5Scores}
        dmRpsBracket={dmRpsBracket} setDmRpsBracket={setDmRpsBracket} dmRpsRound={dmRpsRound}
        dmHotTakeIdx={dmHotTakeIdx} dmHotTakeVotes={dmHotTakeVotes} setDmHotTakeVotes={setDmHotTakeVotes}
        dmDrawWinner={dmDrawWinner} setDmDrawWinner={setDmDrawWinner}
        dmWitnessQs={dmWitnessQs} dmWitnessQ={dmWitnessQ} setDmWitnessQ={setDmWitnessQ}
        dmWitnessScores={dmWitnessScores} setDmWitnessScores={setDmWitnessScores}
        dmSecretBallotVotes={dmSecretBallotVotes} setDmSecretBallotVotes={setDmSecretBallotVotes}
        dmLastWordCat={dmLastWordCat} setDmLastWordCat={setDmLastWordCat}
        dmLastWordElim={dmLastWordElim} setDmLastWordElim={setDmLastWordElim}
        dmRelicObject={dmRelicObject} setDmRelicObject={setDmRelicObject}
      />

      {/* DEAD PLAYERS */}
      {deadPlayers.length > 0 && (
        <div className="card" style={{ opacity: .55, marginTop: 14 }}>
          <div className="ctitle">The Fallen</div>
          <div className="pgrid">
            {deadPlayers.map(p => (
              <div key={p.id} className="pcard dead">
                <div className="pavatar" style={{ filter: "grayscale(1)" }}>{p.emoji}</div>
                <div className="pname">{p.name}</div>
                <div className={`prole ${p.role === "traitor" || p.role === "secret_traitor" ? "role-t" : "role-f"}`}>{p.role === "secret_traitor" ? "Secret Traitor" : p.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <MsgLog messages={messages} />

      {/* HOST GHOST CHAT — always visible when ghosts exist */}
      {deadPlayers.length > 0 && (
        <GhostChat
          ghostChats={ghostChats}
          ghostDraft={ghostDraft}
          setGhostDraft={setGhostDraft}
          sendGhostChat={sendGhostChat}
          myId={myId}
          isHost={true}
          senderName="👁️ Host"
        />
      )}
    </div>
  </div>
</div>

);
}

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

