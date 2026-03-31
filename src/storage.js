/**
 * Storage adapter — provides the same async save/load interface
 * the game was originally built on (backed by window.storage in the
 * Claude artifact environment) but now powered by Convex.
 *
 * Usage (same as before):
 *   import { save, load } from "./storage";
 *   await save("my-key", { foo: 1 });
 *   const val = await load("my-key");  // returns parsed object or null
 *
 * For real-time subscriptions (replacing the setInterval polling) the
 * game's main component uses convex's useQuery hook directly with the
 * keys it cares about — see TraitorsGame.jsx.
 */

import { ConvexHttpClient } from "convex/browser";

// CONVEX_URL is injected by Vite from the .env file:
//   VITE_CONVEX_URL=https://happy-animal-123.convex.cloud
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error(
    "[storage] VITE_CONVEX_URL is not set. " +
      "Create a .env file with VITE_CONVEX_URL=<your deployment URL>."
  );
}

// One shared HTTP client for fire-and-forget mutations.
// The ConvexHttpClient is safe to share across the app.
export const httpClient = new ConvexHttpClient(convexUrl ?? "");

/**
 * Persist a value under `key`.
 * Value is serialised to JSON exactly as the original window.storage adapter did.
 */
export const save = async (key, value) => {
  try {
    await httpClient.mutation("storage:set", {
      key,
      value: JSON.stringify(value),
    });
  } catch (e) {
    console.warn("[storage] save error", key, e);
  }
};

/**
 * Load a value by key. Returns the parsed object/array/primitive, or null.
 */
export const load = async (key) => {
  try {
    const result = await httpClient.query("storage:get", { key });
    return result ? JSON.parse(result.value) : null;
  } catch (e) {
    console.warn("[storage] load error", key, e);
    return null;
  }
};

/**
 * Load multiple keys in one network round-trip.
 * Returns a plain object { [key]: parsedValue }.
 */
export const loadMany = async (keys) => {
  try {
    const results = await httpClient.query("storage:getMany", { keys });
    const out = {};
    for (const { key, value } of results) {
      out[key] = JSON.parse(value);
    }
    return out;
  } catch (e) {
    console.warn("[storage] loadMany error", keys, e);
    return {};
  }
};

/**
 * Delete all storage keys for a game (used on full reset).
 * Prefix is typically the gameId.
 */
export const clearGame = async (gameId) => {
  try {
    await httpClient.mutation("storage:delByPrefix", { prefix: gameId });
  } catch (e) {
    console.warn("[storage] clearGame error", gameId, e);
  }
};

// ---------------------------------------------------------------------------
// Session helper — small wrapper around the "traitors-session" key so callers
// don't have to spell it out.
// ---------------------------------------------------------------------------

export const saveSession = (session) => save("traitors-session", session);
export const loadSession = () => load("traitors-session");
export const clearSession = () =>
  httpClient.mutation("storage:del", { key: "traitors-session" });
