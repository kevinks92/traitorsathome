import { TRIVIA_BANK } from '../constants/content.js';

function generateWitnessQuestions(game, players) {
const qs = [];
const alive = players.filter(p => p.alive || !p.alive); // all players
const byId = {};
players.forEach(p => { byId[p.id] = p; });

// From banishLog: who voted for whom, who was banished which round
const banishLog = game.banishLog || [];
banishLog.forEach((entry, i) => {
const banished = byId[entry.banishedId];
if (!banished) return;
// "What round was [player] banished?"
if (i < 3) qs.push({
q: `What round was ${banished.emoji} ${banished.name} banished?`,
a: String(entry.round || i+1),
opts: () => {
const correct = String(entry.round || i+1);
const others = ["1","2","3","4","5"].filter(x=>x!==correct).sort(()=>Math.random()-.5).slice(0,3);
return shuffle([correct, ...others]);
}
});
// "Who did [voter] vote for in round N?"
if (entry.votes) {
const voterIds = Object.keys(entry.votes).filter(vid => byId[vid]);
const picked = voterIds[Math.floor(Math.random() * voterIds.length)];
if (picked && entry.votes[picked]) {
const voter = byId[picked];
const target = byId[entry.votes[picked]];
if (voter && target) qs.push({
q: `Who did ${voter.emoji} ${voter.name} vote to banish at Round Table ${entry.round || i+1}?`,
a: target.name,
opts: () => {
const others = players.filter(p=>p.id!==target.id).sort(()=>Math.random()-.5).slice(0,3).map(p=>p.name);
return shuffle([target.name, ...others]);
}
});
}
}
});

// From killLog: who was murdered which night
const killLog = game.killLog || [];
killLog.forEach((entry, i) => {
const killed = byId[entry.killedId];
if (!killed) return;
qs.push({
q: `Which night was ${killed.emoji} ${killed.name} murdered?`,
a: `Night ${entry.round || i+1}`,
opts: () => {
const correct = `Night ${entry.round || i+1}`;
const others = ["Night 1","Night 2","Night 3","Night 4"].filter(x=>x!==correct).slice(0,3);
return shuffle([correct, ...others]);
}
});
});

// From breakfastGroups: which group did player X arrive with
const bGroups = game.breakfastGroupHistory || [];
bGroups.forEach((morningGroups, morning) => {
morningGroups.forEach((group, groupIdx) => {
const pid = group[Math.floor(Math.random() * group.length)];
const pl = byId[pid];
if (!pl) return;
qs.push({
q: `Which group did ${pl.emoji} ${pl.name} arrive with at breakfast on Morning ${morning+1}?`,
a: `Group ${groupIdx+1}`,
opts: () => {
const correct = `Group ${groupIdx+1}`;
const others = ["Group 1","Group 2","Group 3","Group 4"].filter(x=>x!==correct).slice(0,3);
return shuffle([correct, ...others]);
}
});
});
});

// From shieldLog: who was saved
const shieldLog = game.shieldLog || [];
shieldLog.forEach(entry => {
const saved = byId[entry.savedId];
if (!saved) return;
qs.push({
q: `Which player's Shield blocked a murder attempt on Night ${entry.round}?`,
a: saved.name,
opts: () => {
const others = players.filter(p=>p.id!==saved.id).sort(()=>Math.random()-.5).slice(0,3).map(p=>p.name);
return shuffle([saved.name, ...others]);
}
});
});

// If not enough questions from game history, add generic observation questions
const generic = [
{ q: "How many players have been banished so far in total?", a: String(banishLog.length), opts: () => { const c=String(banishLog.length); const o=["0","1","2","3","4"].filter(x=>x!==c).slice(0,3); return shuffle([c,...o]); }},
{ q: "How many Traitors were active at the start of the game?", a: String(players.filter(p=>p.role==="traitor"||p.role==="secret_traitor").length), opts: () => { const c=String(players.filter(p=>p.role==="traitor"||p.role==="secret_traitor").length); const o=["1","2","3","4"].filter(x=>x!==c).slice(0,3); return shuffle([c,...o]); }},
{ q: "How many players are still alive right now?", a: String(players.filter(p=>p.alive).length), opts: () => { const c=String(players.filter(p=>p.alive).length); const o=["3","4","5","6","7","8","9","10"].filter(x=>x!==c).slice(0,3); return shuffle([c,...o]); }},
{ q: "Has anyone been saved by a Shield so far in this game?", a: shieldLog.length > 0 ? "Yes" : "No", opts: () => shuffle(["Yes","No","Not sure","More than once"])},
{ q: "How many murders have happened so far in this game?", a: String(killLog.length), opts: () => { const c=String(killLog.length); const o=["0","1","2","3","4"].filter(x=>x!==c).slice(0,3); return shuffle([c,...o]); }},
];
const combined = shuffle([...qs, ...generic.filter(g => !qs.find(q => q.q === g.q))]);
return combined.slice(0, 7);
}

function shuffle(arr) { return [...arr].sort(()=>Math.random()-.5); }

const SHIELD_MODE_LABELS = {
hidden_winner: "🤫 Only the winner knows",
public: "📢 Announced publicly",
team_hidden: "👥 Winning team knows privately",
all_know: "👁️ All players are told",
dagger: "🗡️ No shield — winner gets Dagger",
seer_award: "👁️ Winner becomes the Seer",
nobody: "❌ No power awarded",
};

const EMOJIS = ["🦊","🐺","🦅","🐉","🦁","🐍","🦉","🐻","🦋","🌙","⚔️","🔮","🏹","🛡️","🌹","💎","🗝️","🕯️","🧿","🪬","🦚","🦜","🐊","🪄","🏚️","🧙","🕵️","🃏","🎪","🩸"];

const genId = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const getEmoji = name => { let h = 0; for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff; return EMOJIS[h % EMOJIS.length]; };
const shuffleArray = arr => [...arr].sort(() => Math.random() - 0.5);

export { generateWitnessQuestions, shuffle, SHIELD_MODE_LABELS, EMOJIS, genId, getEmoji, shuffleArray };
