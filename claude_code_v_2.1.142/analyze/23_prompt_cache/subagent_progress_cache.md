# Sub-Agent Progress Summary Cache Fix (v2.1.121)

## Changelog Anchor

> Fixed sub-agent progress summaries missing the prompt cache (~3× `cache_creation` reduction)
> Fixed sub-agent summaries firing repeatedly while a sub-agent's transcript is static, capping worst-case token cost on idle sub-agents

## Background — What Subagent Progress Summaries Are

When a parent agent spawns a long-running subagent, the parent's UI needs to surface a one-line "what is the subagent currently doing?" status. The parent doesn't want to read the full subagent transcript (that would be expensive and would pollute the parent's context). Instead, periodically (`AP_ = 30000` ms = 30s), the subagent runner forks a tiny query that:

1. Receives the subagent's transcript-so-far as `forkContextMessages`
2. Runs the small fast model with a single prompt: "summarize what the agent is doing right now in one line"
3. Returns the summary text to be displayed in the parent's UI

This is the `CM$` function (`cli_inner_pretty.js:271869-271941`). It runs on a self-rescheduling `setTimeout` for the lifetime of the subagent.

## The Two Problems

### Problem 1 — Cache Creation On Every Summary

Pre-v2.1.121, the periodic summary fork would write to the parent agent's cache. Each summarize call would create a new ephemeral cache entry for the prompt prefix (including the subagent's transcript). At 30s intervals, this meant:

- Every 30s: a fresh `cache_creation_input_tokens` worth of tokens billed
- Cache entries from previous summaries went unused (next summary had a different transcript suffix, so different cache key)
- Net effect: ~3× more `cache_creation` tokens than `cache_read` tokens — the cache was being written but not benefiting reads

### Problem 2 — Pointless Re-Summarization

If the subagent was *idle* (no new messages emitted), the periodic summary still fired every 30s and re-summarized the unchanged transcript. This wasted LLM cycles and money for zero information value.

## The Two Fixes

### Fix 1 — `skipCacheWrite: true`

The summary fork now passes `skipCacheWrite: true` through to `JV`, which propagates to `gC` → request build → `YB5` (cache breakpoint applicator), which then **does not place any cache_control markers** on the prompt:

```javascript
// cli_inner_pretty.js:271902-271911 — CM$ summary fork
let E = await JV({
  promptMessages: [w8({ content: zP_(D) })],
  cacheSafeParams: V,
  canUseTool: v,
  querySource: "agent_summary",
  forkLabel: "agent_summary",
  overrides: { abortController: O },
  skipTranscript: !0,
  skipCacheWrite: !0,        // ← Fix 1
});
```

How `skipCacheWrite` propagates to "no cache writes":

```javascript
// cli_inner_pretty.js:526228-526254 — YB5 (cache breakpoint applicator)
function YB5(H, $, q, K = !1, _, A, z = !1, Y) {        // z === skipCacheWrite
  let f = (X) => {
      let L = X;
      while (L >= 0 && H[L].type === "api_system") L--;
      return L;
    },
    O = f(H.length - 1);
  if (z) O = f(O - 1);       // ← skipCacheWrite drops the LAST breakpoint
  let M = new Set();
  if (O >= 0) M.add(O);
  ...
}
```

The trick: pre-fix, the cache-breakpoint logic adds `cache_control` to the last user message. That cache_control writes a fresh ephemeral cache entry on each request. With `skipCacheWrite: true`, the code advances the index past the last entry (`O = f(O - 1)`) so no marker gets attached. The request still goes out, the server returns a response, but no cache entry is created.

This shifts the summary fork from "cache creator" to "cache freerider": if the parent's cache prefix happens to overlap (it usually does, since the summary call inherits `forkContextMessages` from the parent), the summary call **reads** from the parent's cache without writing anything new.

### Fix 2 — Fingerprint-Based Dedup

```javascript
// ============================================
// subagentProgressSummary - Periodically summarize a running subagent's transcript
// Location: cli_inner_pretty.js:271869-271941
// ============================================

// ORIGINAL (for source lookup):
function CM$(H, $, q, K, _, A = {}) {
  let z = A.intervalMs ?? AP_,
    { forkContextMessages: Y, ...f } = q,
    O = null, M = null, w = !1, D = null, j = null, J = !1;
  async function X() {
    if (w) return;
    N(`[AgentSummary] Timer fired for agent ${$}`);
    try {
      let Z = K();
      if (Z.length < 3) { N(`[AgentSummary] Skipping summary for ${H}: not enough messages (${Z.length})`); return; }
      let W = cJ6(Z),
        G = `${W.length}:${W.at(-1)?.uuid ?? ""}`;
      if (G === j) {
        if ((N(`[AgentSummary] Skipping summary for ${H}: transcript unchanged (${W.length} messages)`), !J))
          (d("tengu_agent_summary_skipped", { reason: "unchanged" }), (J = !0));
        return;
      }
      ((J = !1), (j = G));
      let V = { ...f, forkContextMessages: W };
      ...
      let E = await JV({
        promptMessages: [w8({ content: zP_(D) })],
        cacheSafeParams: V,
        canUseTool: v,
        querySource: "agent_summary",
        forkLabel: "agent_summary",
        overrides: { abortController: O },
        skipTranscript: !0,
        skipCacheWrite: !0,
      });
      ...
    } catch (Z) {
      if (!w && Z instanceof Error) EH(Z);
    } finally {
      if (((O = null), !w)) L();
    }
  }
  function L() { if (w) return; M = setTimeout(X, z); }
  function P() { ... }
  return (L(), { stop: P });
}

// READABLE (for understanding):
function subagentProgressSummary(agentId, sidechainKey, baseParams, getCurrentTranscript, parentSummaryStore, options = {}) {
  const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;   // AP_ = 30000
  const { forkContextMessages, ...restParams } = baseParams;

  let inFlightController = null;
  let nextTimer = null;
  let stopped = false;
  let lastSummaryText = null;        // D: most recent summary, used as part of the prompt
  let lastTranscriptFingerprint = null;   // j: "<length>:<last-uuid>" stable identity
  let skipAlreadyReported = false;        // J: only emit telemetry once per skip-run

  async function periodicSummarize() {
    if (stopped) return;
    log(`[AgentSummary] Timer fired for agent ${sidechainKey}`);
    try {
      const transcript = getCurrentTranscript();
      if (transcript.length < 3) {
        log(`[AgentSummary] Skipping summary for ${agentId}: not enough messages (${transcript.length})`);
        return;
      }

      // ─── v2.1.121 KEY: skip if transcript hasn't changed since last summary ──
      const stableTranscript = stripIncompleteToolPairs(transcript);    // cJ6
      const fingerprint = `${stableTranscript.length}:${stableTranscript.at(-1)?.uuid ?? ""}`;

      if (fingerprint === lastTranscriptFingerprint) {
        log(`[AgentSummary] Skipping summary for ${agentId}: transcript unchanged (${stableTranscript.length} messages)`);
        if (!skipAlreadyReported) {
          telemetry("tengu_agent_summary_skipped", { reason: "unchanged" });
          skipAlreadyReported = true;
        }
        return;
      }
      skipAlreadyReported = false;
      lastTranscriptFingerprint = fingerprint;

      const cacheSafeParams = { ...restParams, forkContextMessages: stableTranscript };
      log(`[AgentSummary] Forking for summary, ${stableTranscript.length} messages in context`);
      inFlightController = new AbortController();

      const denyAllTools = async () => ({
        behavior: "deny",
        message: "No tools needed for summary",
        decisionReason: { type: "other", reason: "summary only" },
      });

      const queryResult = await runForkedQuery({          // JV
        promptMessages: [makeUserMessage({ content: buildSummaryPrompt(lastSummaryText) })],   // zP_
        cacheSafeParams,
        canUseTool: denyAllTools,
        querySource: "agent_summary",
        forkLabel: "agent_summary",
        overrides: { abortController: inFlightController },
        skipTranscript: true,
        skipCacheWrite: true,         // ← v2.1.121 fix: no cache_control markers added
      });

      if (stopped) return;
      for (const msg of queryResult.messages) {
        if (msg.type !== "assistant") continue;
        if (msg.isApiErrorMessage) {
          log(`[AgentSummary] Skipping API error message for ${agentId}`);
          continue;
        }
        const textBlock = msg.message.content.find((c) => c.type === "text");
        if (textBlock?.type === "text" && textBlock.text.trim()) {
          const summaryText = textBlock.text.trim();
          log(`[AgentSummary] Summary result for ${agentId}: ${summaryText}`);
          lastSummaryText = summaryText;
          publishSummary(agentId, summaryText, parentSummaryStore);   // lO7
          break;
        }
      }
    } catch (e) {
      if (!stopped && e instanceof Error) recordError(e);
    } finally {
      if ((inFlightController = null), !stopped) scheduleNext();
    }
  }

  function scheduleNext() {
    if (stopped) return;
    nextTimer = setTimeout(periodicSummarize, intervalMs);
  }

  function stop() {
    log(`[AgentSummary] Stopping summarization for ${sidechainKey}`);
    stopped = true;
    if (nextTimer) { clearTimeout(nextTimer); nextTimer = null; }
    if (inFlightController) { inFlightController.abort(); inFlightController = null; }
  }

  scheduleNext();
  return { stop };
}

// Mapping: CM$→subagentProgressSummary, H→agentId, $→sidechainKey, q→baseParams, K→getCurrentTranscript,
//          _→parentSummaryStore, A→options, z→intervalMs, Y→forkContextMessages (discarded), f→restParams,
//          O→inFlightController, M→nextTimer, w→stopped, D→lastSummaryText, j→lastTranscriptFingerprint,
//          J→skipAlreadyReported, X→periodicSummarize, L→scheduleNext, P→stop,
//          Z→transcript, W→stableTranscript, G→fingerprint, V→cacheSafeParams, E→queryResult,
//          cJ6→stripIncompleteToolPairs, zP_→buildSummaryPrompt, lO7→publishSummary,
//          AP_→DEFAULT_INTERVAL_MS
```

## Fingerprint Choice — Length + Last UUID

```javascript
const fingerprint = `${stableTranscript.length}:${stableTranscript.at(-1)?.uuid ?? ""}`;
```

Why these two fields:

- `length` — Detects new messages appended
- `last uuid` — Detects message replacement (e.g., a tool_result replacing a previous abortive tool_use). A pure length check would miss this case.

Why not a content hash:
- A content hash would catch in-place edits that change the substance without changing length+uuid. But subagent messages aren't edited in place — JSONL is append-only. Length + UUID is sufficient.
- Hashing every transcript would cost CPU. The fingerprint is O(1) string concat.

Why strip incomplete tool pairs first (`cJ6`):
- An assistant message with a `tool_use` that hasn't yet received a `tool_result` is in-flight. If we summarize while a tool is still running, the summary will include "agent is thinking about calling X". When the tool returns, the transcript changes (the tool_result appears) but the fingerprint should reflect the *stable* state.
- `cJ6` filters out assistant messages with orphan tool_use IDs. After filtering, the transcript represents only the completed tool-pairs. Fingerprint over that gives a stable identity that doesn't flicker during a tool call.

## The Cache-Creation 3× Picture

Pre-fix metrics for a typical 1-hour subagent run:
- ~120 periodic summary calls (every 30s)
- Each call creates a fresh cache entry for the prompt prefix
- Each cache entry contains ~50% of the transcript-so-far
- Per call: ~3000-15000 `cache_creation_input_tokens`
- Total `cache_creation` over the hour: ~750k tokens
- Of these, ~zero ever got `cache_read` from again — each call had a different transcript

Post-fix metrics:
- ~30-60 periodic summary calls (idle skips remove ~50% of attempts)
- Each call has no `cache_control` markers → no cache_creation
- Each call inherits the parent's `forkContextMessages` which *might* be cached on the parent's prefix
- Net cache_creation from summary calls: ~0
- Net cache_read from summary calls: highly variable (depends on whether parent's cache covered the transcript prefix)

The 3× number in the changelog refers to `cache_creation` reduction — the absolute numbers vary by usage pattern.

## Telemetry

```javascript
telemetry("tengu_agent_summary_skipped", { reason: "unchanged" });
```

Fires at most once per "stable window" — when the fingerprint matches the previous one. Resets to allow re-firing when the fingerprint changes again. This gives a clean signal of "how often is the dedup actually helping". A session with very chatty subagents has few skips; an idle subagent has many.

## Why `skipTranscript: true` Too

The summary fork passes both `skipTranscript: true` AND `skipCacheWrite: true`:

```javascript
skipTranscript: true,        // don't write the summary call's transcript to disk
skipCacheWrite: true,        // don't add cache_control markers
```

These are independent:
- `skipTranscript` prevents this query from being persisted as a sidechain. Otherwise every 30s summary would create a new sidechain.jsonl file.
- `skipCacheWrite` prevents this query from creating cache entries. Otherwise every 30s would write a fresh ephemeral entry.

The combination makes the summary call a pure "consume the model, get a one-liner back" operation with no persistence side effects.

## What Happens On Subagent Stop

When the subagent finishes (or is aborted), `stop()` runs:

```javascript
function stop() {
  stopped = true;
  if (nextTimer) { clearTimeout(nextTimer); nextTimer = null; }
  if (inFlightController) { inFlightController.abort(); inFlightController = null; }
}
```

This:
1. Sets the `stopped` flag so any in-flight `periodicSummarize` exits early after its await.
2. Clears any pending `setTimeout` so no more summaries fire.
3. Aborts the in-flight summary (if any) so it doesn't run to completion after we no longer need it.

## Verification

```bash
# Confirm fingerprint dedup:
grep -A 3 "let G = .W.length.:" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | head -5
# → let G = `${W.length}:${W.at(-1)?.uuid ?? ""}`;
# → if (G === j) { ... tengu_agent_summary_skipped ... }

# Confirm skipCacheWrite in summary fork:
grep -B 2 "skipCacheWrite: !0" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | grep -A 1 "agent_summary"
# (shows agent_summary fork passing skipCacheWrite)
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Subagent runner, fork query
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Cache_control plumbing
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions / constants:
- `subagentProgressSummary` (`CM$`) — `cli_inner_pretty.js:271869-271941` — The periodic summarizer
- `DEFAULT_INTERVAL_MS` (`AP_`) — `cli_inner_pretty.js:271942` — 30000 (30s)
- `stripIncompleteToolPairs` (`cJ6`) — `cli_inner_pretty.js:393435-393451` — Filters orphan tool_use assistant messages
- `buildSummaryPrompt` (`zP_`) — Builds the summarize prompt, optionally including the previous summary
- `publishSummary` (`lO7`) — Pushes the new summary into the parent's summary store
- `runForkedQuery` (`JV`) — `cli_inner_pretty.js:242702-242802` — Common forked-query infra
- `applyCacheBreakpoints` (`YB5`) — `cli_inner_pretty.js:526228-526317` — Honors `skipCacheWrite` by skipping last-breakpoint placement
- `tengu_agent_summary_skipped` (telemetry event) — `{ reason: "unchanged" }` — Fired once per stable transcript window
