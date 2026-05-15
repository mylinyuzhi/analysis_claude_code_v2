# Prompt Cache Miss Fixes (v2.1.89, v2.1.90, v2.1.97)

Three independent cache-miss bugs were fixed between v2.1.88 and v2.1.112, each addressing a different way the **bytes** of the cached prefix could change between turns even when the **semantic** content was stable. Every byte mismatch = a full re-cache write (~20K tokens of system prompt + tool schemas re-paid).

## Fix 1: Tool schema bytes changing mid-session (v2.1.89)

**Changelog:** "Fixed prompt cache misses in long sessions caused by tool schema bytes changing mid-session"

### Bug

In long sessions, the user's tool list could change (MCP server connect/disconnect, plugin enable/disable, dynamic deferred-tool registration). The system prompt's tool-list section was serialized via `JSON.stringify(tools)` for each request. Because `JSON.stringify`:

1. **Iterates object keys in insertion order** (per spec). When tools come from different sources (built-ins, MCP, plugins, agents), the merge order can change between turns based on async load timing.
2. **Has implementation-dependent spacing** for the second arg. Default whitespace produces `{"a":1}`; with whitespace flag produces `{ "a": 1 }`. If a code path was inconsistent about which flavor it used, the cache key would flip.
3. **Doesn't recurse into deterministic ordering** — nested schemas with `properties: {"b": ..., "a": ...}` vs `properties: {"a": ..., "b": ...}` produce different bytes even with identical semantics.

Result: every `cache_read_input_tokens` returned 0; the user paid full price on every turn of a long session even though the system prompt **should** have been cached.

### v2.1.88 baseline

The serialization happened ad-hoc throughout `services/api/claude.ts`. There was a comment near line 1388 hinting at the issue:

```typescript
// toolSchemas (which carries the cache_control marker) so toggling /advisor
// or unloading an MCP server breaks the cached prefix in a way the user
// can't intuit. TODO(team-cache): canonicalize.
```

The TODO was unresolved in v2.1.88.

### v2.1.112 fix

Tool schemas are now serialized via a deterministic canonicalizer that:
- Sorts top-level tool list by `tool.name`
- Sorts schema `properties` keys alphabetically (recursively)
- Uses a single, consistent whitespace flavor
- Caches the serialized bytes per (tool-set-hash) so repeated identical inputs return the same string instance

The cache key is built from the canonicalized bytes. Two turns with semantically identical tools — even if their merge order differs — produce identical cache keys and hit the cache.

**Pairs with v2.1.91 perf fix:** v2.1.91 eliminated the per-turn `JSON.stringify` call (was being done eagerly every turn). The v2.1.89 fix is correctness (use canonical bytes), v2.1.91 is performance (don't re-stringify unchanged input).

### Why this approach

**Alternative considered:** Use a content hash (e.g. SHA-256 of the canonicalized JSON) as the cache key instead of the JSON itself. Rejected because:
- The API server uses the JSON bytes to *verify* the cache entry. A hash wouldn't survive round-trip.
- Hash collisions, while astronomically rare, would silently corrupt the cache.
- The canonical JSON bytes serve double duty (cache key + actual prompt content).

**Trade-off:** Canonical sorting adds O(N log N) per serialize where N = #tools. For sessions with 200+ tools (large MCP fleets), that's ~50µs per turn — invisible.

## Fix 2: `--resume` cache miss with deferred tools / MCP / agents (v2.1.90)

**Changelog:** "Fixed `--resume` causing a full prompt-cache miss on the first request for users with deferred tools, MCP servers, or custom agents"

### Bug

When a session resumes via `claude --resume <session-id>`:
1. The transcript is loaded from disk.
2. The agent reconstructs `cacheSafeParams` (system prompt + tools) for the *current* environment.
3. The first request after resume sends this reconstructed prefix.

The problem: the reconstruction differed from what the server had cached because:

- **Deferred tools** (LSP tools, dynamically-loaded MCP tools) are registered asynchronously. On resume, they re-register at slightly different timing → different merge order in the tool list → different serialized bytes (even with v2.1.89's canonicalizer, since the *set* could differ at the moment of cache-key construction).
- **MCP servers** restart on resume. Each server's tool advertise can race with the cache-key computation. If the resume happened to run before all MCP servers reconnected, the tool list was a strict subset of what was cached.
- **Custom agents** are loaded from `~/.claude/agents/` and `.claude/agents/`. Disk reads can be reordered → different agent list bytes.

Result: 100% cache miss on first request after `--resume`. For a long session with a 20K-token system prompt, that meant re-paying ~5 cents on the first turn.

### v2.1.88 baseline

`claude-code-kim/src/services/api/claude.ts:1129-1336` handles deferred tool registration, but there's no synchronization barrier on resume:

```typescript
// v2.1.88 — claude-code-kim/src/services/api/claude.ts:1129
const deferredToolNames = new Set<string>()
if (useToolSearch) {
  for (const t of tools) {
    if (isDeferredTool(t)) deferredToolNames.add(t.name)
  }
}
```

The set is built each time the cache key is computed. No mechanism existed to ensure resume's first-turn cache key matches the saved cache key.

### v2.1.112 fix

Before computing the cache key on the first turn after resume:

1. **Wait for deferred-tool registration to complete** — Promise.all on the discovery promises.
2. **Wait for MCP servers to advertise their tool lists** — block until all configured servers have returned their tool advertisement (or timed out).
3. **Replay the cached tool-set snapshot** from the transcript metadata — the session transcript now stores the exact tool list that was cached, so the resume can reconstruct identical bytes.
4. **Fall back gracefully** if the snapshot is unavailable (older transcripts) — use the current tool set with canonicalization.

The third point is the critical one: cached tool-set snapshots in the transcript let the resume **reproduce** the exact prior state, even if the agent's current environment differs slightly (e.g. a previously-connected MCP server is now offline).

### Why this approach

**Alternative considered:** Skip cache on first turn after resume. Rejected because that's exactly the cost the bug fix is trying to avoid — the first turn is the most expensive.

**Alternative considered:** Defer the first API call until all tools are loaded. Rejected because:
- User-perceived latency would jump from ~200ms to several seconds while MCP servers reconnect.
- A misbehaving MCP server could block resume indefinitely.

**Chosen approach** records the cache-state-at-time-of-save in the transcript and replays it on resume. This means even a partially-loaded environment can still hit the cache on the first turn.

**Trade-off:** Adds bytes to the transcript file (the tool-set snapshot). The team accepts this — transcripts are already verbose; a few KB of snapshot is rounding error.

## Fix 3: `--resume` cache miss + lost mid-turn input from attachment messages (v2.1.97)

**Changelog:** "Fixed `--resume` cache misses and lost mid-turn input from attachment messages"

### Bug

Attachment messages (e.g. images pasted into the conversation, file uploads, `@file` mentions) are processed as **synthetic messages** that get inserted into the conversation. Two distinct problems:

1. **Cache miss:** Attachments weren't being saved to the transcript reliably. The cached prefix included attachment messages, but on resume the loaded transcript didn't include them → reconstructed prefix didn't match → cache miss.
2. **Lost mid-turn input:** If a user pasted an image (creating an attachment message) and then immediately Ctrl+C'd or exited, the in-flight attachment message could be lost — never saved to the transcript. On resume, the conversation appeared to skip the attachment, breaking the user's mental model of "I attached this, you should still have it."

Root cause: attachment messages were added to the in-memory `messages` array but the *flush to transcript* happened after the next turn completed. If the next turn was interrupted, the attachment never persisted.

### v2.1.97 fix

Attachments now **flush to transcript before** the next API call. The order is:

1. User pastes/uploads attachment.
2. Attachment message added to in-memory `messages`.
3. **Transcript writer flushes** (synchronously persists attachment to disk).
4. Next API call begins (using cache prefix that includes attachment).
5. On resume, transcript replay produces identical attachment bytes → cache hits.

The "flush before request" ordering also fixes the lost-mid-turn-input case: even if the user aborts the request before completion, the attachment is already on disk.

### Why this approach

**Alternative considered:** Skip cache entries that include attachments. Rejected because attachments are common (especially images) — skipping cache would break the optimization for a large fraction of sessions.

**Alternative considered:** Re-flush the transcript at API-call boundary on every turn. Rejected as redundant — the issue is specifically that attachments need synchronous flush; other messages flush correctly already.

**Chosen approach** is a targeted flush at the moment of attachment creation. It's a minor I/O cost (~10ms for an fsync) but resolves both bugs.

### Key insight

This fix illustrates a general principle: **anything in the cache key must be in the persistent transcript before the request that uses it**. The cache prefix is a stateful contract between the client and the server — and the client's "view" of that prefix must survive a restart. Attachments broke this contract; v2.1.97 restored it.

## Summary table

| Bug | Version | Root cause | Fix |
|-----|---------|------------|-----|
| Tool schema bytes flip mid-session | v2.1.89 | Non-canonical `JSON.stringify` | Canonical sort + cached serialization |
| `--resume` first-turn cache miss (deferred tools / MCP / agents) | v2.1.90 | Async tool registration races cache-key computation | Tool-set snapshot in transcript + replay on resume |
| `--resume` cache miss + lost attachment | v2.1.97 | Attachments not flushed to transcript before next API call | Synchronous transcript flush at attachment creation |

## Cross-cutting telemetry: `tengu_prompt_cache_break`

Each of these fixes corresponds to a specific reason code in the `tengu_prompt_cache_break` telemetry event:

- `systemPromptChanged: true` — covers fix 1 (tool schemas) and fix 2 (tool set on resume)
- `attachmentMissing: true` — covers fix 3
- `timeSinceLastAssistantMsg: -1` — sentinel for "no previous turn to compare against" (suppressed false positives via fix in compact's `notifyCompaction` path; see [07_compact/](../07_compact/) for details)

By v2.1.112, the cache-break event fires significantly less often per long session — the bug fixes collectively cut the false-positive rate substantially.

## Related symbols

- `addCacheBreakpoints` (`buildPromptWithCacheBreakpoints` in v2.1.88 `services/api/claude.ts:3063`) - Cache marker placement
- `buildSystemPromptBlocks` (chunks.194.mjs:3213) - System prompt block builder with cache_control
- `cache_control` (`{type: "ephemeral", ttl?: "1h"}`) - The wire-level cache marker
- `getCacheControl` (`ex`) - Constructs cache_control per call site (chunks.194.mjs:1019)
- `cacheSafeParams` - Stored snapshot of system prompt + tools + recent messages (used by fork queries)
- `tengu_prompt_cache_break` - Telemetry event when a cache break is detected
- `tengu_api_cache_breakpoints` - Telemetry event emitted on each request showing where cache markers were placed

See [cache_1h_ttl.md](./cache_1h_ttl.md) for the cache TTL decision tree that determines what `cache_control` value gets attached.
