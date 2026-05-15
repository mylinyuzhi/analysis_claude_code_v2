# Module 23 — Prompt Cache (v2.1.113 → v2.1.142 Deltas)

## Overview

This document covers prompt-cache-related changes between v2.1.113 and v2.1.142. The v2.1.112 baseline is in [../../../claude_code_v_2.1.112/analyze/23_prompt_cache/](../../../claude_code_v_2.1.112/analyze/23_prompt_cache/) — it covers the foundational TTL evolution (`ENABLE_PROMPT_CACHING_1H` env var, allowlist `tengu_prompt_cache_1h_config`, the `FORCE_PROMPT_CACHING_5M` override) and the recap/away-summary infrastructure.

The window between v2.1.113 and v2.1.142 saw mostly correctness fixes that surfaced as TTL was rolled out broadly:

1. **v2.1.116** — Cache control TTL ordering: a parallel-request race could complete between request build and serialization, causing a 400 with mis-ordered `cache_control` blocks. The fix is `$I4(block, ttl)` — an idempotent merge that only writes TTL if it isn't already set.
2. **v2.1.121** — Sub-agent progress summaries were spawning forked queries that *re-built* the cache prefix on every periodic summarize call (~3× cache_creation tokens vs cache_read). The fix is `skipCacheWrite: true` on the summary fork plus a fingerprint-based skip-if-unchanged guard.
3. **v2.1.129** — Two related fixes:
    a. 1-hour TTL was being **silently downgraded to 5 minutes** when allowlist eligibility check ran ahead of the `tengu_prompt_cache_1h_config` flag fetch. Fix: `iv8` lazy-caches the allowlist and treats `null` (not loaded yet) as "force re-check" rather than "deny".
    b. The cache-miss notification ("Your conversation is cached for the current model. Switching to X means the full history gets re-read") fired spuriously after `/clear` or compaction when the user then opened `/effort` or `/model`. Fix: `Bn` (post-compact cleanup) writes `cacheMissAckedAtOutputTokens = nX()` so the dialog gate `P > 0 && P !== A` short-circuits.
4. **v2.1.132** — Bedrock and Vertex returned 400 when `ENABLE_PROMPT_CACHING_1H` was set. The env var still triggered `Q = "1h"` for non-first-party providers but the `extended-cache-ttl-2025-04-11` beta header was only pushed when `RT()` returned true (first-party + AnthropicAWS + foundry). Bedrock/Vertex got the TTL but not the beta header → 400. Fix: gate the TTL itself behind provider eligibility.
5. **v2.1.139 (cross-link)** — The `claude_code.pull_request.count` OTel counter now increments for MCP tool calls that look like `create_pull_request` / `create_merge_request`, not just shell commands. See [../../31_telemetry/](../../31_telemetry/) for the telemetry side; the new `eH4(toolName)` hook is wired into the MCP tool-execution path and uses the same `IXH().add(1)` counter the shell path already uses.

The throughline: as 1-hour TTL rolled out from internal-only to allowlisted-broadly, the system encountered every interaction it had with non-Anthropic providers, parallel request races, and compaction. Each fix is small but moves a different lever.

## Document Map

| File | Topic | Changelog Anchor |
|------|-------|------------------|
| [one_hour_ttl_downgrade_fix.md](./one_hour_ttl_downgrade_fix.md) | 1-hour TTL silently downgraded to 5-min when allowlist cache was `null` | 2.1.129 |
| [bedrock_vertex_400.md](./bedrock_vertex_400.md) | Bedrock/Vertex 400 when `ENABLE_PROMPT_CACHING_1H` is set | 2.1.132 |
| [cache_miss_warning_after_clear.md](./cache_miss_warning_after_clear.md) | "Switching model/effort re-reads history" warning fires after `/clear` or compaction | 2.1.129 |
| [subagent_progress_cache.md](./subagent_progress_cache.md) | Sub-agent progress summaries bypassing the cache (~3× `cache_creation`) | 2.1.121 |
| [cache_control_ttl_ordering.md](./cache_control_ttl_ordering.md) | API 400 from cache_control TTL ordering when a parallel request completes during setup | 2.1.116 |
| [../00_overview/symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) | All symbol mappings discovered in this delta | — |

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - API client, beta headers, prompt cache TTL plumbing
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compaction (cross-link for cache-miss-acked fix)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Subagent runner (cross-link for progress-summary cache fix)
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This delta's new symbols

Key functions/constants in this delta:

- `isCacheTtl1Hour` (`ivH`) — `cli_inner_pretty.js:524779-524794` — Decides 1-hour TTL eligibility based on env vars, subscriber state, and allowlist; v2.1.129 fix made the allowlist lazy-load idempotent
- `getCached1hAllowlist` (`nv8`) — Reads the cached allowlist sentinel value
- `setCached1hAllowlist` (`iv8`) — Writes the allowlist cache; called on first non-null lookup
- `extendedCacheTtlBeta` (`AWH`) — `cli_inner_pretty.js:96810` — `pJ("extended_cache_ttl", "extended-cache-ttl-2025-04-11")` — Required beta header for any 1-hour TTL request
- `isFirstPartyEligible` (`RT`) — `cli_inner_pretty.js:128828` — `c$6() && !DISABLE_EXPERIMENTAL_BETAS` — Determines whether 1h TTL is even legal for this provider
- `makeCacheControl` (`Xi`) — `cli_inner_pretty.js:524776-524778` — Builds `{ type: "ephemeral", ttl, scope }` cache_control object
- `normalizeCacheControlTtl` (`$I4`) — `cli_inner_pretty.js:526567-526570` — Idempotent merge: only set TTL if not already present
- `applyCacheBreakpoints` (`YB5`) — `cli_inner_pretty.js:526228-526317` — Adds cache_control to selected messages; v2.1.116 added `forkPointPinned` second breakpoint
- `buildSystemPromptCacheBlocks` (`fB5`) — `cli_inner_pretty.js:526318-526326` — Applies cache scope + TTL to system prompt blocks
- `cacheMissAckedAtOutputTokens` (state field) — Per-session counter tracking the output-token level at which the user last acknowledged a cache-miss dialog
- `postCompactCleanup` (`Bn`) — `cli_inner_pretty.js:243907-243920` — Updates `cacheMissAckedAtOutputTokens` after compaction (v2.1.129 fix)
- `totalOutputTokens` (`nX`) — `cli_inner_pretty.js:2436-2438` — Returns sum across modelUsage
- `confirmModelOrEffortSwitch` (`ZZ$`) — `cli_inner_pretty.js:495631-495707` — The "your conversation is cached, switching re-reads" dialog
- `confirmAckCacheMiss` (`Ky5`) — `cli_inner_pretty.js:495708-495710` — App-state mutator: writes `cacheMissAckedAtOutputTokens = nX()` on user confirm
- `subagentProgressSummary` (`CM$`) — `cli_inner_pretty.js:271869-271941` — The periodic transcript-summarizer for in-flight subagents; uses fingerprint dedup + `skipCacheWrite: true`
- `mcpPRToolHook` (`eH4`) — `cli_inner_pretty.js:411883-411891` — Increments PR counter for matching MCP tool names

## Architecture: Where Each Fix Plugs In

```
                                          ┌──────────────────────────────────────────┐
                                          │ API request build (request layer)          │
                                          │   gC/D$/Sg in api-client                    │
                                          └─────┬─────────────┬─────────────┬─────────┘
                                                │             │             │
                                                ▼             ▼             ▼
                                        TTL decision   Cache control   Beta headers
                                        (ivH)          breakpoints      list
                                                │      (YB5/fB5)        │
                                                │             │         │
                                                ▼             ▼         ▼
                              ┌───────────────────────────────────────────────────────┐
                              │ Per-block: { type: "ephemeral", ttl: Q, scope: ... } │
                              │ Idempotent re-apply via $I4 [v2.1.116 fix]           │
                              └───────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  v2.1.129: ivH allowlist lazy-cache                                              │
  │            - If sentinel is null, re-read tengu_prompt_cache_1h_config           │
  │            - Don't return false during the "not yet loaded" window               │
  │  v2.1.132: ivH still returns true for ENABLE_PROMPT_CACHING_1H on Bedrock,        │
  │            BUT the downstream beta-header push requires RT() === true            │
  │            Fix gated TTL via different path — see bedrock_vertex_400.md          │
  │  v2.1.116: $I4 idempotency — pass-through if cache_control.ttl already set       │
  └─────────────────────────────────────────────────────────────────────────────────┘

                                          ┌──────────────────────────────────────────┐
                                          │ Subagent execution                          │
                                          │   slH/runSubagentInner                      │
                                          └──────────────┬──────────────────────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────────────────────┐
                                          │ CM$ (periodic progress summarizer)          │
                                          │   timer every 30s while subagent runs       │
                                          │   forks a 1-turn query to summarize tx      │
                                          │                                            │
                                          │   v2.1.121: skipCacheWrite: true            │
                                          │             + fingerprint dedup             │
                                          └──────────────────────────────────────────┘

                                          ┌──────────────────────────────────────────┐
                                          │ Compaction completion                       │
                                          │   compactSlashCommand / Y97 / autocompact   │
                                          └──────────────┬──────────────────────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────────────────────┐
                                          │ Bn(post_compact_cleanup):                   │
                                          │   cacheMissAckedAtOutputTokens = nX()        │
                                          │   → suppresses /model and /effort dialogs    │
                                          │   for the rest of this output-token level    │
                                          │   [v2.1.129 fix]                            │
                                          └──────────────────────────────────────────┘
```

## Key Algorithms Touched In This Delta

### 1. `ivH` — TTL Eligibility

```javascript
function ivH(querySource) {
  if (parseBool(process.env.FORCE_PROMPT_CACHING_5M)) return false;        // hard override
  if (parseBool(process.env.ENABLE_PROMPT_CACHING_1H)
      || (getProvider() === "bedrock" && parseBool(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)))
    return true;                                                            // env-var force
  if (!isSubscriberWithBenefits() || isUsingOverage) return false;         // entitlement gate
  let allowlist = getCached1hAllowlist();
  if (allowlist === null) {                                                 // not loaded yet
    allowlist = readExperiment("tengu_prompt_cache_1h_config",
                                { allowlist: ["repl_main_thread*", "sdk", "auto_mode", "memdir_relevance"] }).allowlist ?? [];
    setCached1hAllowlist(allowlist);                                        // memoize
  }
  return querySource !== undefined
      && allowlist.some((pattern) =>
           pattern.endsWith("*")
             ? querySource.startsWith(pattern.slice(0, -1))
             : querySource === pattern);
}
```

The v2.1.129 fix was making the `null → re-load` path the default (rather than treating null as "deny"). See [one_hour_ttl_downgrade_fix.md](./one_hour_ttl_downgrade_fix.md).

### 2. `$I4` — Idempotent TTL Application

```javascript
function $I4(block, ttl) {
  if (!("cache_control" in block) || !block.cache_control || block.cache_control.ttl) {
    return block;  // already has ttl OR has no cache_control at all → pass through
  }
  return { ...block, cache_control: { ...block.cache_control, ttl } };
}
```

The "already has ttl" pass-through is the v2.1.116 contribution. See [cache_control_ttl_ordering.md](./cache_control_ttl_ordering.md).

### 3. `CM$` — Subagent Progress Summary With Fingerprint

```javascript
async function periodicSummarize() {
  if (stopped) return;
  const messages = getCurrentTranscript();
  if (messages.length < 3) return;

  const stableMessages = stripIncompleteToolPairs(messages);     // cJ6
  const fingerprint = `${stableMessages.length}:${stableMessages.at(-1)?.uuid ?? ""}`;

  if (fingerprint === lastFingerprint) {
    // Skip — transcript is unchanged since the last summary
    if (!skipReported) {
      telemetry("tengu_agent_summary_skipped", { reason: "unchanged" });
      skipReported = true;
    }
    return;
  }
  skipReported = false;
  lastFingerprint = fingerprint;

  await JV({
    promptMessages: [makeUserMessage({ content: SUMMARY_PROMPT })],
    cacheSafeParams: { ...baseParams, forkContextMessages: stableMessages },
    canUseTool: denyAllTools,
    querySource: "agent_summary",
    forkLabel: "agent_summary",
    overrides: { abortController: localController },
    skipTranscript: true,
    skipCacheWrite: true,        // ← v2.1.121: don't pollute the parent's cache
  });
  // ... process result, schedule next ...
}
```

The `skipCacheWrite: true` plus the fingerprint dedup are the v2.1.121 contribution. See [subagent_progress_cache.md](./subagent_progress_cache.md).

## Cross-Module Interactions

- **07_compact** — Compaction calls `Bn()` to update `cacheMissAckedAtOutputTokens` so the `/model`/`/effort` cache-miss dialog doesn't fire after a successful compact. See [cache_miss_warning_after_clear.md](./cache_miss_warning_after_clear.md).
- **31_telemetry** — The MCP-PR counter increment lives outside this module but uses the same `IXH()` counter as shell-derived PR creation. See [bedrock_vertex_400.md](./bedrock_vertex_400.md) for context on the v2.1.139 telemetry cross-link.

## Verification Surface

```bash
# Confirm $I4 idempotency:
grep -A 2 "function \$I4(H, \$)" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# →   if (!("cache_control" in H) || !H.cache_control || H.cache_control.ttl) return H;
# →   return { ...H, cache_control: { ...H.cache_control, ttl: $ } };

# Confirm 1h-allowlist lazy load:
grep -B 1 -A 5 "function ivH" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# (shows the lazy load via nv8/iv8)

# Confirm cacheMissAckedAtOutputTokens write on compact:
grep -B 2 -A 7 "function Bn" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# (shows the post-compact write to cacheMissAckedAtOutputTokens)

# Confirm skipCacheWrite in agent-summary fork:
grep -B 5 "skipCacheWrite: !0" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | grep -B 5 "agent_summary"
# (shows the CM$ summary call with skipCacheWrite)
```

## Telemetry Surface

| Event | When fired | Notable fields |
|-------|-----------|----------------|
| `tengu_agent_summary_skipped` | `CM$` decides the transcript is unchanged | `reason: "unchanged"` — fires at most once per stable window |
| `tengu_fork_agent_query` (existing) | Every fork including `CM$`'s | Includes `cacheCreationInputTokens` — used to measure the v2.1.121 fix |
| `tengu_prompt_cache_diagnosis_received` | Server returned a cache-miss diagnosis | `tokensMissed`, `reason` |
| `tengu_api_cache_breakpoints` | Every request | `markerCount`, `forkPointPinned`, `skipCacheWrite` |
| `claude_code.pull_request.count` (OTel counter) | PR-creation-shaped command or MCP tool | The metric, not a single event |
