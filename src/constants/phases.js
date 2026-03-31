// ─── Game phases ─────────────────────────────────────────────────────────────
const PHASES = {
LOBBY: “lobby”,
GAME_INTRO: “game_intro”,
SECRET_TRAITOR_SELECTION: “secret_traitor_selection”,
ROLE_REVEAL: “role_reveal”,
MISSION_BRIEFING: “mission_briefing”,
MISSION_ACTIVE: “mission_active”,
FREE_ROAM: “free_roam”,
ROUND_TABLE: “round_table”,
VOTING: “voting”,
BANISHMENT: “banishment”,
NIGHT_SEQUESTER: “night_sequester”,
NIGHT_SEER: “night_seer”,
NIGHT_RECRUIT: “night_recruit”,
NIGHT_RECRUIT_RESPONSE: “night_recruit_response”,
NIGHT_SECRET_TRAITOR: “night_secret_traitor”,
NIGHT_TRAITOR_CHAT: “night_traitor_chat”,
NIGHT_RESOLVE: “night_resolve”,
BREAKFAST: “breakfast”,
ENDGAME_FREE_ROAM: “endgame_free_roam”,
ENDGAME: “endgame”,
ENDED: “ended”,
};
// ─── Rooms ───────────────────────────────────────────────────────────────────
const ROOMS = [
{ id: “living”, name: “Living Area”, icon: “🛋️” },
{ id: “kitchen”, name: “Kitchen & Breakfast”, icon: “☕” },
{ id: “dining”, name: “Dining Room”, icon: “🕯️” },
{ id: “terrace”, name: “Upper Terrace”, icon: “🌿” },
{ id: “patio”, name: “Patio”, icon: “🌙” },
{ id: “lounge”, name: “Upstairs Lounge”, icon: “🔮” },
];
// ─── Phase host instructions ─────────────────────────────────────────────────
const PHASE_INSTRUCTIONS = {
secret_traitor_selection: {
title: “Secret Traitor Selection — The Ceremony”,
steps: [
“Announce: ‘A Secret Traitor is in play. We’ll find out who it is — publicly, right now. Each of you will stand before the group and look at your phone. One of you will see something very different.’”,
“Call each player up one at a time. They stand facing the group and hold their phone so ONLY THEY can see the screen.”,
“Tap ‘Reveal’ on your panel — their screen will show either a dramatic Secret Traitor reveal or a clear ‘NOT the Secret Traitor’ message.”,
“Give them 3–5 seconds. Watch everyone’s face. Then tap ‘Next Player’ and call the next person up.”,
],
},
role_reveal: {
title: “Traitors Selection Roundtable”,
steps: [
“Say: ‘Phones face-down. Blindfolds on. Eyes closed. Do not open them until I say so.’”,
“Walk silently behind each regular Traitor only — give them TWO taps on the shoulder. Do not tap Faithful players, and do NOT tap the Secret Traitor — they already know their role from the ceremony.”,
“When done, tap ‘Release Roles’ below. Players’ phones will show their role assignments.”,
“Say: ‘Blindfolds off. Look at each other. Say nothing.’ — 60 seconds of silence, no phones. Then: ‘Check your phone. Not a word.’”,
],
},
mission_briefing: {
title: “Mission Briefing — Read it Out Loud, Darling”,
steps: [
“Read the mission name, full description, and shield rules aloud to the group. Use your voice.”,
“Pause for questions. Answer briefly. Do not get derailed by someone trying to negotiate the rules.”,
“Announce whether the shield is hidden, public, or team-based — this is crucial intel and people WILL forget.”,
“Set your timer, point dramatically at the group, and say ‘Begin.’”,
],
},
mission_active: {
title: “Mission In Progress — Facilitate & Observe”,
steps: [
“Run the mission as described. You’re the judge, host, and referee — all three, simultaneously, for free.”,
“After it ends: award powers using the buttons below. Do it quietly and individually. Discretion is everything.”,
“Hidden shield? Whisper to the winner only. Pull them aside. Make it covert. Remind them: the shield only lasts until breakfast the next morning — used or not.”,
“Public shield? Name them aloud with full theatrics. They deserve it. Everyone else should look envious.”,
],
},
free_roam: {
title: “Free Roam — Release the Animals”,
steps: [
“Say: ‘The castle is open. Go wherever you want. Talk to whoever you want. We reconvene when I call.’”,
“Let them know which rooms and spaces are open for the session. They will scatter — let them.”,
“Let them scatter. Do not follow anyone. Do not answer questions. Check your timer — that’s how long you have.”,
“Call everyone back when the timer hits zero — or earlier if energy is high. Be firm: ‘Everyone back to the Round Table. Now.’ They will dawdle. Do not let them.”,
],
},
round_table: {
title: “Round Table — Let Them Fight”,
steps: [
“Get everyone seated and say: ‘The floor is open. Who are we looking at today?’ Then step back and let it rip.”,
“Your job: keep it moving. Draw out the quiet ones. Shut down anyone monologuing for more than 90 seconds.”,
“Watch the Traitors. They’re performing right now and the performance is EVERYTHING.”,
“When energy peaks — or when someone’s clearly about to crack — stand up and say: ‘Players. The time for talk is over. Phones out. It’s time to vote.’”,
],
},
voting: {
title: “Voting Phase — Phones Out, Silence In”,
steps: [
“Say: ‘Phones out. You’re voting NOW. No talking, no eye contact, no meaningful glances across the table.’”,
“Everyone votes simultaneously — no changing votes. In the event of a tie, nobody is banished and the panel will show a tie result. That’s a feature, not a bug.”,
“If the Dagger has been won from a mission, ask before every vote: ‘Does anyone wish to use the Dagger?’ The holder stands and declares — press Yes on the panel. Their vote counts twice and the Dagger is consumed. If they stay silent, press No. Normal vote.”,
“Once resolved: flip your phone toward the group for the full-screen name reveal. Pause. Breathe. Enjoy it.”,
],
},
banishment: {
title: “Banishment — The Big Reveal”,
steps: [
“Hold your phone up and FACE IT TOWARD THE GROUP. The banished name is on screen in enormous text. Let it land.”,
“Do not speak for a full three seconds. Let the room react. It’s theatre and you are the director.”,
“Then say their role aloud: ‘They were a Traitor’ or ‘They were Faithful.’ Pause for the screaming. Exception: if only 5 players remain, the banishment is silent — no role reveal. They exit without a word.”,
“Banished player: they’re out of the game but can stay in the room. They cannot campaign, whisper, or interfere. They are a ghost.”,
],
},
night_sequester: {
title: “Night Sequester — Blindfolds On”,
steps: [
“Say: ‘Blindfolds on. Stay seated. Nobody moves or leaves the room. I’ll tap the people I need. Everyone else — heads down, eyes closed, stay quiet.’”,
“Everyone stays in the same room. You walk around and tap people’s shoulders — Traitors lift their blindfolds when tapped. That’s it.”,
“Follow the order: 1) Seer (if active), 2) Recruitment (if solo Traitor + 6 or more total players alive), 3) Secret Traitor shortlist (pre-reveal rounds only), 4) All Traitors for the Turret. Keep each handoff silent and quick.”,
“The moment the Turret vote is cast, tap the Traitors — blindfolds back on. Then begin calling groups to breakfast. Players remove blindfolds only as they leave the room.”,
],
},
night_seer: {
title: “Seer Phase — Wake the Eye”,
steps: [
“Walk to the Seer. Tap them ONCE on the shoulder — they lift their blindfold and open their phone privately.”,
“They tap a player name on their screen. Their role is revealed silently to the Seer alone. No announcement, no record.”,
“30 seconds maximum. When done, tap their shoulder once more — blindfold back on, head down.”,
“Nobody else in the room has moved. Proceed quietly to the Secret Traitor (if applicable) or the Traitors next.”,
],
},
night_secret_traitor: {
title: “Secret Traitor Shortlist (Pre-Reveal Rounds Only)”,
steps: [
“Walk to the Secret Traitor. Tap them ONCE — they lift their blindfold and open their phone. Everyone else stays still.”,
“They must select exactly 5 players to target for murder — mandatory. The Traitors can only vote from these 5 names. They have a private chat channel with you during this phase if they have questions. They won’t know who submitted the list.”,
“When done, tap their shoulder once more — blindfold back on. They stay seated. Note: on their reveal round, this phase is skipped entirely.”,
“Walk to the regular Traitors next. They’ll see the 5-name shortlist in the Turret and must vote from it. They won’t know the source.”,
],
},
night_traitor_chat: {
title: “The Turret — Wake the Wolves”,
steps: [
“Walk to each Traitor and tap their shoulder. They lift their blindfold and open their phone — that’s it, no one moves.”,
“They chat in the Turret and cast their votes. Everyone is still in the same room. Faithful are seated with blindfolds on.”,
“Keep it under 5 minutes. When votes are in, tap each Traitor’s shoulder — blindfolds back on.”,
“Then begin calling groups to breakfast one at a time. Players are escorted out — blindfolds off only when they leave the room.”,
],
},
breakfast: {
title: “Breakfast Reveal — The Most Evil Morning Show”,
steps: [
“Check the group list below. Bring ONLY Group 1 to the breakfast table first. Everyone else stays put.”,
“Let Group 1 sit, look around, and notice who’s missing. Give them 3-4 minutes to react and discuss — don’t tell them anything.”,
“Tap ‘Next Group’ to bring in each subsequent wave. Let the paranoia compound with each new arrival.”,
“The FINAL group walks in last. Their arrival — or the absence of someone from it — is the murder reveal. Make it a moment.”,
],
},
};
// ─── Phase sequence strip ────────────────────────────────────────────────────
const PHASE_STRIP = [
{ key: PHASES.SECRET_TRAITOR_SELECTION, label: “Secret Traitor” },
{ key: PHASES.ROLE_REVEAL, label: “Roundtable” },
{ key: PHASES.MISSION_BRIEFING, label: “Mission” },
{ key: PHASES.FREE_ROAM, label: “Roam” },
{ key: PHASES.ROUND_TABLE, label: “Table” },
{ key: PHASES.VOTING, label: “Vote” },
{ key: PHASES.BANISHMENT, label: “Banish” },
{ key: PHASES.NIGHT_SEQUESTER, label: “Night” },
{ key: PHASES.BREAKFAST, label: “Breakfast” },
{ key: PHASES.ENDGAME_FREE_ROAM, label: “Final Roam” },
{ key: PHASES.ENDGAME, label: “Fire of Truth” },
];

export { PHASES, ROOMS, PHASE_INSTRUCTIONS, PHASE_STRIP };
