import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Read a single key. Returns { value: string } or null. */
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const doc = await ctx.db
      .query("storage")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return doc ? { value: doc.value } : null;
  },
});

/** Read multiple keys in one round-trip. Returns an array of { key, value } pairs (missing keys omitted). */
export const getMany = query({
  args: { keys: v.array(v.string()) },
  handler: async (ctx, { keys }) => {
    const results: { key: string; value: string }[] = [];
    for (const key of keys) {
      const doc = await ctx.db
        .query("storage")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (doc) results.push({ key, value: doc.value });
    }
    return results;
  },
});

/** Write a key-value pair (upsert). */
export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, { key, value }) => {
    const existing = await ctx.db
      .query("storage")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("storage", { key, value });
    }
  },
});

/** Delete a key (no-op if missing). */
export const del = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const existing = await ctx.db
      .query("storage")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});

/**
 * Delete all keys that start with a given prefix.
 * Useful for wiping a game's data when resetting.
 */
export const delByPrefix = mutation({
  args: { prefix: v.string() },
  handler: async (ctx, { prefix }) => {
    // Convex doesn't have a native prefix scan, so we scan the whole table.
    // For typical game sizes (<1000 keys) this is fine.
    const all = await ctx.db.query("storage").collect();
    for (const doc of all) {
      if (doc.key.startsWith(prefix)) {
        await ctx.db.delete(doc._id);
      }
    }
  },
});
