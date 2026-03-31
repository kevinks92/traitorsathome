const BASE_PHASE_TIMERS = {
role_reveal: 3,
mission_briefing: 2,
mission_active: 12,
free_roam: 12,       // 10–15 min range; scales with duration
round_table: 12,
voting: 5,
banishment: 4,
night_sequester: 2,
night_seer: 3,
night_secret_traitor: 4,
night_traitor_chat: 6,
endgame_free_roam: 10,  // shortened
endgame: 10,            // fire of truth — shortened
unmasking: 10,          // the unmasking — shortened
breakfast_convo: 3,     // post-murder-reveal conversation window
};

// Returns scaled timers based on host-selected game duration (hours)
function getPhaseTimers(durationHours = 4) {
const scale = durationHours / 4;
const scaled = {};
for (const [k, v] of Object.entries(BASE_PHASE_TIMERS)) {
// Don’t scale ceremony phases (role reveal, sequester walkover)
const fixed = [“role_reveal”, “mission_briefing”, “night_sequester”, “night_seer”, “night_secret_traitor”, “night_traitor_chat”, “endgame”, “unmasking”, “breakfast_convo”].includes(k);
scaled[k] = fixed ? v : Math.round(v * scale);
}
return scaled;
}

// Fallback for phases that use this directly
const PHASE_TIMERS = BASE_PHASE_TIMERS;

export { BASE_PHASE_TIMERS, getPhaseTimers, PHASE_TIMERS };
