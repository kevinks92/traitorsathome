import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Simple key-value store that mirrors the window.storage API the game was
 * originally built on top of.  Every entry is a (key, value) pair where
 * value is a JSON-encoded string.
 *
 * Keys follow these conventions used in the game:
 *   "<gameId>"                       — main game state object
 *   "<gameId>-msgs"                  — host message log
 *   "<gameId>-traitor-chat"          — traitor night chat
 *   "<gameId>-ghost-chat"            — ghost chat
 *   "<gameId>-st-chat"               — secret-traitor chat
 *   "<gameId>-seer-chat"             — seer chat
 *   "<gameId>-recruit-chat"          — recruit chat
 *   "<gameId>-seer-<playerId>"       — seer reveal result
 *   "<gameId>-seer-explain-<pid>"    — seer explanation
 *   "<gameId>-st-reveal-<pid>"       — secret-traitor reveal result
 *   "<gameId>-fw-<pid>"              — first-word mission answer
 *   "<gameId>-emoji-cipher"          — active emoji cipher
 *   "<gameId>-name5-cat"             — Name-5 category
 *   "<gameId>-hot-take"              — active hot-take statement
 *   "<gameId>-draw-winner"           — draw-the-thing winner id
 *   "<gameId>-witness-qs"            — generated witness questions
 *   "<gameId>-witness-ans-<pid>"     — witness answers per player
 *   "<gameId>-ballot-<pid>"          — secret-ballot vote per player
 *   "<gameId>-auction-bid-<pid>"     — auction bid per player
 *   "<gameId>-hottake-<pid>"         — hot-take vote per player
 *   "<gameId>-rps-matchup"           — active RPS matchup
 *   "<gameId>-relic-phase"           — relic challenge phase
 *   "<gameId>-st-shortlist"          — ST shortlist submission
 *   "traitors-session"               — local session (auto-rejoin)
 */
export default defineSchema({
  storage: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
