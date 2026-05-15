# Deferred Tools — Lazy Loading via ToolSearch

> Some tools' schemas are too large to ship in the turn-1 system prompt for every session. The deferred-tools system sends just the names, and the model fetches schemas on demand via the `ToolSearch` tool.

## Why deferred loading

A typical session may have:
- 46 built-in tools, schema sizes 5–10 KB each
- 50+ MCP tools from connected servers (Chrome MCP, GitHub MCP, Slack MCP), each 2–10 KB
- Total prompt overhead: ~500 KB just for tool schemas

That overhead:
1. **Costs tokens.** Every turn pays the full schema cost even if the model only uses Read + Bash.
2. **Slows time-to-first-token.** Larger prompts take longer to send and process.
3. **Crowds the context window.** Less room for actual conversation.

Deferred loading reduces turn-1 to "tools you'll definitely need" (~30 KB) + "names only, schemas via ToolSearch" for the rest.

## The mechanism

### 1. Decide per-tool whether to defer

```javascript
// ============================================
// isDeferredTool (zm) — predicate for defer_loading API field
// Location: cli_inner_pretty.js:211830-211841
// ============================================

// ORIGINAL (for source lookup):
function zm(H) {
  if (H.alwaysLoad === !0) return !1;
  if (H.isMcp === !0) return !0;
  if (H.name === cY) return !1;
  if (H.name === D7) {
    if ((Rt(), s6(rlK)).isForkSubagentEnabled()) return !1;
  }
  if (H.name === x$_) return !1;
  if (H.name === u$_) return !1;
  if (H.name === nf && U3H()) return !1;
  return H.shouldDefer === !0;
}

// READABLE (for understanding):
function isDeferredTool(tool) {
  // 1. Explicit always-load wins (MCP _meta["anthropic/alwaysLoad"] = true)
  if (tool.alwaysLoad === true) return false;
  // 2. Every MCP tool is deferred by default — there may be hundreds
  if (tool.isMcp === true) return true;
  // 3. ToolSearch itself is never deferred (model needs it to defer-resolve)
  if (tool.name === TOOL_SEARCH_TOOL_NAME) return false;
  // 4. Subagent (Agent) tool — non-deferred when fork-subagent enabled
  if (tool.name === AGENT_TOOL_NAME) {
    if (loadForkSubagentMod().isForkSubagentEnabled()) return false;
  }
  // 5. BriefTool — never deferred (frequently needed turn 1)
  if (tool.name === BRIEF_TOOL_NAME) return false;
  // 6. SendUserFile — never deferred (must be visible for proactive output)
  if (tool.name === SEND_USER_FILE_TOOL_NAME) return false;
  // 7. Skill — never deferred when Skill discovery is enabled
  if (tool.name === SKILL_TOOL_NAME && isSkillDiscoveryEnabled()) return false;
  // 8. Otherwise, defer if the tool opts in via shouldDefer
  return tool.shouldDefer === true;
}

// Mapping: zm→isDeferredTool, H→tool, cY→TOOL_SEARCH_TOOL_NAME, D7→AGENT_TOOL_NAME,
//          Rt→loadForkSubagentMod, x$_→BRIEF_TOOL_NAME, u$_→SEND_USER_FILE_TOOL_NAME,
//          nf→SKILL_TOOL_NAME, U3H→isSkillDiscoveryEnabled
```

**Why these special cases:**
- `ToolSearch` (`cY`) is the dispatcher for deferred tools — deferring it would be a chicken-and-egg deadlock.
- `Agent` (`D7`) is deferred only when fork-subagent mode is **off**. When it's on, fork-subagent is a high-frequency operation that the model needs immediate access to.
- `BriefTool` (`x$_`) is a small, very common tool — paying its schema cost upfront is worth not having a ToolSearch round-trip.
- `SendUserFile` (`u$_`) must be in the prompt for the model to know it can proactively deliver files. Deferring would mean the model has no idea this option exists when relevant.
- `Skill` (`nf`) is deferred unless skill discovery is on — when on, the model needs to invoke skills frequently and shouldn't ToolSearch them.

**Key insight:** The deferred-tool predicate is "small list of explicit exceptions, then `shouldDefer` for the rest". MCP tools auto-defer because their count is open-ended; everything else opts in.

### 2. The `shouldDefer: true` opt-in

Currently set on these built-in tools (search for `shouldDefer: !0` in `cli_inner_pretty.js`):
- Cron / RemoteTrigger (4 tools)
- Worktree management (2 tools)
- Agent Team (3 tools)
- Onboarding (1 tool)
- PowerShell (1 tool)
- TestingPermission (1 tool)
- Skill (1 tool)
- ScheduleWakeup (1 tool)
- Plan-mode adjuncts (1 tool)
- ListMcpResources / ReadMcpResource (2 tools)
- LSP (1 tool)
- AskUserQuestion (1 tool)
- StructuredOutput (1 tool)

(13–15 total at any given moment, gated by build flags and feature flags.)

### 3. The API field

When `defer_loading: true` is passed to the API, only the tool's `name` is sent — the model sees the name in the deferred-tools list but cannot invoke it directly. Attempting to call a deferred tool fails with `InputValidationError` because there's no schema to validate against.

### 4. ToolSearch hydrates schemas on demand

The model invokes `ToolSearch` with one of:
- `select:Read,Edit,Grep` — explicit list (no fuzzy match)
- `notebook jupyter` — keyword search
- `+slack send` — `+` prefix requires the term

```javascript
// ============================================
// toolSearchTool — name and search algorithm entry
// Location: cli_inner_pretty.js:383397-383490 (extract)
// ============================================

// ORIGINAL (for source lookup):
wL$ = XK({
  isEnabled() { return UI(); },
  isConcurrencySafe() { return !0; },
  isReadOnly() { return !0; },
  name: cY,
  maxResultSizeChars: 1e5,
  async description() { return SH8(); },
  async prompt() { return SH8(); },
  get inputSchema() { return Fl7(); },
  get outputSchema() { return gl7(); },
  async call(H, { options: { tools: $, refreshTools: q, mcpClients: K, refreshMcpClients: _ }, abortController: A }) {
    let { query: z, max_results: Y = 5 } = H,
      f = q?.() ?? $,
      O = f.filter(zm);                              // List of currently-deferred tools
    Bl7(O);                                          // Invalidate cache if deferred-set changed
    ...
  },
});

// READABLE (for understanding):
const toolSearchTool = createTool({
  isEnabled: () => isToolSearchFeatureEnabled(),     // Gated by env / Statsig
  isConcurrencySafe: () => true,
  isReadOnly: () => true,
  name: TOOL_SEARCH_TOOL_NAME,
  maxResultSizeChars: 100000,
  async description() { return getToolSearchPromptText(); },
  async prompt() { return getToolSearchPromptText(); },
  get inputSchema() { return buildToolSearchInputSchema(); },
  get outputSchema() { return buildToolSearchOutputSchema(); },
  async call(input, { options: { tools, refreshTools, mcpClients, refreshMcpClients }, abortController }) {
    const { query, max_results = 5 } = input;
    const freshTools = refreshTools?.() ?? tools;
    const deferredTools = freshTools.filter(isDeferredTool);
    invalidateToolSearchCacheIfChanged(deferredTools);
    ...
  },
});

// Mapping: wL$→toolSearchTool, XK→createTool, UI→isToolSearchFeatureEnabled, cY→TOOL_SEARCH_TOOL_NAME,
//          SH8→getToolSearchPromptText, Fl7→buildToolSearchInputSchema, gl7→buildToolSearchOutputSchema,
//          zm→isDeferredTool, Bl7→invalidateToolSearchCacheIfChanged, H→input, $→tools, q→refreshTools, K→mcpClients
```

### 5. The search algorithm

ToolSearch uses a hybrid scorer (around `cli_inner_pretty.js:383275-383342`):

**Step 1 — exact match.** If the query lower-cases to a tool name, return that tool.

**Step 2 — prefix-match for MCP names.** If query starts with `mcp__`, prefix-match tool names. Lets the model load all tools from a single server with one search.

**Step 3 — keyword scoring.**
- Split query into tokens, separating `+`-prefixed (required) from plain (optional).
- For each tool, derive `parts` (camel-case-split + snake-case-split of name), `coarseParts` (whole tool name lowered), `searchHint` (user-supplied capability phrase), and `description` (prompt lowercase).
- Score each tool:
  - Token exact-matches a `part`: +10 (regular) / +12 (MCP gets slight boost)
  - Token substring-matches a `part`: +5 / +6
  - Token exact-matches `coarseParts`: +10 / +12
  - Token substring-matches `coarseParts`: +3 / +4
  - Token appears anywhere in concatenated full name: +3 (if score == 0 only)
  - Token whole-word-matches `searchHint`: +4
  - Token whole-word-matches description: +2
- `+`-prefixed terms must match (else tool filtered out entirely).
- Return top `max_results` by score.

**Why this scoring:** Different parts of a tool's identity carry different signal strength:
- Tool name is highest — model is most likely to remember the canonical name.
- `searchHint` is curated for keyword-search and is highly relevant when it matches.
- Description matches are noisy (descriptions mention adjacent concepts) so they get the lowest weight.
- The `+`-prefix mechanism handles "I need a Slack tool from MCP" — model types `+slack send` and gets only Slack tools ranked by `send`.

**Key insight:** The scorer is deliberately conservative — small gaps between scores let the `max_results` cap (default 5) act as a quality threshold. If three Slack tools all score 18 and the fourth scores 6, the model only sees the top three.

## The system-reminder delta protocol

When the deferred-tool set changes mid-session (MCP server connects/disconnects, plan mode enters/exits), the host emits a `deferred_tools_delta` attachment that becomes a `<system-reminder>` in the model's context.

### Format

```javascript
// ============================================
// deferred_tools_delta system-reminder generation
// Location: cli_inner_pretty.js:425201-425236
// ============================================

// ORIGINAL (for source lookup):
case "deferred_tools_delta": {
  let q = [];
  if (H.addedLines.length > 0)
    q.push(`The following deferred tools are now available via ${cY}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${cY} with query "select:<name>[,<name>...]" to load tool schemas before calling them:\n${H.addedLines.join("\n")}`);
  let K = H.readdedNames ?? [];
  if (K.length > 0)
    q.push(`${K.length} deferred tool${K.length === 1 ? " is" : "s are"} available again (MCP server reconnected — names announced earlier in this conversation): ${iM8(K)}. Load via ${cY} as before.`);
  if (H.removedNames.length > 0) /* ... */;
  let _ = H.pendingMcpServers ?? [];
  if (_.length > 0) {
    let A = _.length > xHH ? `${_.slice(0, xHH).join(", ")}, …and ${_.length - xHH} more` : _.join("\n");
    q.push(`The following MCP servers are still connecting — their tools (typically named mcp__<server>__*) are not yet available but will appear shortly:\n${A}\n\nIf the user's request might be served by one of these servers (even if they didn't name it explicitly), call ${cY} with a relevant keyword — ${cY} will wait for connecting servers and search their tools once available. Do not report a capability as unavailable without first searching.`);
  }
  if (q.length === 0) return [];
  return o_([w8({ ... })]);
}

// READABLE (for understanding):
case "deferred_tools_delta": {
  const lines = [];

  // 1. New deferred tools appeared (e.g., MCP server just connected)
  if (delta.addedLines.length > 0) {
    lines.push(
      `The following deferred tools are now available via ${TOOL_SEARCH_TOOL_NAME}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${TOOL_SEARCH_TOOL_NAME} with query "select:<name>[,<name>...]" to load tool schemas before calling them:\n${delta.addedLines.join("\n")}`
    );
  }

  // 2. Previously-removed tools are back (MCP server reconnected)
  const readded = delta.readdedNames ?? [];
  if (readded.length > 0) {
    lines.push(
      `${readded.length} deferred tool${readded.length === 1 ? " is" : "s are"} available again (MCP server reconnected — names announced earlier in this conversation): ${formatToolList(readded)}. Load via ${TOOL_SEARCH_TOOL_NAME} as before.`
    );
  }

  // 3. Tools are no longer available (server disconnected)
  if (delta.removedNames.length > 0) {
    lines.push(
      delta.removedNames.length > MAX_INLINE_TOOL_NAMES
        ? `${delta.removedNames.length} deferred tools are no longer available (MCP server disconnected): ${formatToolList(delta.removedNames)}. Do not search for them — ${TOOL_SEARCH_TOOL_NAME} will return no match.`
        : `The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — ${TOOL_SEARCH_TOOL_NAME} will return no match:\n${delta.removedNames.join("\n")}`
    );
  }

  // 4. Servers still in flight — tell the model to be patient and use ToolSearch with keywords
  const pending = delta.pendingMcpServers ?? [];
  if (pending.length > 0) {
    const display = pending.length > MAX_INLINE_TOOL_NAMES
      ? `${pending.slice(0, MAX_INLINE_TOOL_NAMES).join(", ")}, …and ${pending.length - MAX_INLINE_TOOL_NAMES} more`
      : pending.join("\n");
    lines.push(
      `The following MCP servers are still connecting — their tools (typically named mcp__<server>__*) are not yet available but will appear shortly:\n${display}\n\nIf the user's request might be served by one of these servers (even if they didn't name it explicitly), call ${TOOL_SEARCH_TOOL_NAME} with a relevant keyword — ${TOOL_SEARCH_TOOL_NAME} will wait for connecting servers and search their tools once available. Do not report a capability as unavailable without first searching.`
    );
  }

  if (lines.length === 0) return [];
  return wrapAsSystemReminderMessage(...);
}

// Mapping: H→delta, q→lines, K→readded, _→pending, A→display, cY→TOOL_SEARCH_TOOL_NAME, iM8→formatToolList, xHH→MAX_INLINE_TOOL_NAMES, w8→makeMessage, o_→wrapAsSystemReminderMessage
```

**Why four cases:** Each represents a distinct state-change the model needs to handle differently:
1. **Added** — new capabilities; the model should know they exist (often discovers them by ToolSearch later).
2. **Re-added** — previously-known capabilities are back; the model can keep references it had.
3. **Removed** — capabilities are gone; the model should stop trying to use them.
4. **Pending** — capabilities are *expected*; the model shouldn't give up early. The "ToolSearch will wait for connecting servers" line is critical — without it, a model facing "this server isn't ready yet" might prematurely respond "I can't help with that".

**Key insight:** The `pendingMcpServers` case bridges the asynchronous-startup gap. MCP servers connect non-blockingly to keep startup fast, but a model that asks "search Slack" at turn 1 needs the system to wait for Slack-MCP to connect rather than report "no Slack tool available". The ToolSearch tool internally waits up to `Pe_` (5000ms) for relevant pending servers before reporting no match.

## Auto-resolution: when deferred becomes loaded

Tool schemas become loaded into the model's API request when:

1. **ToolSearch returns them.** The `<function>{schema}</function>` block in the result is parsed by Anthropic's servers and the tool becomes callable. The schema also enters the prompt cache so subsequent turns don't re-pay the load cost.

2. **The optimistic mode pre-loads them.** `ENABLE_TOOL_SEARCH=auto:N` mode (visible in `cli_inner_pretty.js:409085`) automatically loads the top-N most-likely tools per turn based on recent usage patterns. This bypasses the round-trip for high-frequency tools.

3. **Deferral is disabled session-wide.** `ENABLE_TOOL_SEARCH=false` or non-first-party hosts disable deferred-tools entirely; every tool's full schema ships every turn.

## Cache invalidation

The ToolSearch tool maintains a cache of "tools list → deferred-tools fingerprint" (`OE6` in the bundle). Whenever the set of deferred tools changes (MCP connect/disconnect, feature flag flip), the cache is cleared and the next ToolSearch call rebuilds it.

```javascript
// ============================================
// invalidateToolSearchCacheIfChanged (Bl7)
// Location: cli_inner_pretty.js:383245-383248
// ============================================

// ORIGINAL (for source lookup):
function Bl7(H) {
  let $ = We_(H);
  if (OE6 !== $) (N("ToolSearchTool: cache invalidated - deferred tools changed"), F38.cache.clear?.(), (OE6 = $));
}

// READABLE (for understanding):
function invalidateToolSearchCacheIfChanged(deferredTools) {
  const fingerprint = computeDeferredToolFingerprint(deferredTools);
  if (currentDeferredFingerprint !== fingerprint) {
    logger.info("ToolSearchTool: cache invalidated - deferred tools changed");
    toolSearchScoreCache.cache.clear?.();
    currentDeferredFingerprint = fingerprint;
  }
}

// Mapping: Bl7→invalidateToolSearchCacheIfChanged, H→deferredTools, We_→computeDeferredToolFingerprint, OE6→currentDeferredFingerprint, F38→toolSearchScoreCache
```

The fingerprint is just `tools.map(t => t.name).sort().join(",")` — cheap to compute, deterministic, fingerprint-stable across runs.

**Why fingerprint vs. always-fresh:** ToolSearch scoring touches description, prompt, and searchHint for every deferred tool. With 100+ MCP tools, recomputing per call is wasteful. The fingerprint catches the only case that requires invalidation (the set of deferred tools itself changed) without paying the cost per call.

## Interaction with PreCompactDiscoveredTools

When auto-compaction triggers mid-session, the list of tools the model has actually used (`discoveredTools`) is carried across the compaction boundary so the post-compact `deferred_tools_delta` can re-announce them. Otherwise, the model would lose memory of "I used `mcp__github__create_pr` earlier" and have to re-ToolSearch.

See `07_compact/` for the carry-across mechanism (`collectPreCompactDiscoveredTools`, `rc` in the symbol index).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `isDeferredTool` (obfuscated: `zm`) - Predicate for `defer_loading:true` in API
- `toolSearchTool` (obfuscated: `wL$`) - The ToolSearch tool registration object
- `getToolSearchPromptText` (obfuscated: `SH8`) - Description/prompt text
- `searchDeferredTools` (obfuscated: `Ul7`) - The scoring/matching algorithm
- `invalidateToolSearchCacheIfChanged` (obfuscated: `Bl7`) - Fingerprint-based cache invalidation
- `computeDeferredToolFingerprint` (obfuscated: `We_`) - Sorted comma-joined name list
- `currentDeferredFingerprint` (obfuscated: `OE6`) - Last-seen fingerprint
- `TOOL_SEARCH_MCP_WAIT_MS` (obfuscated: `Pe_`) - 5000ms wait for pending servers
- `BRIEF_TOOL_NAME` (obfuscated: `x$_`) - Brief tool name (never deferred)
- `SEND_USER_FILE_TOOL_NAME` (obfuscated: `u$_` / `NH8`) - SendUserFile name (never deferred)
- `MAX_INLINE_TOOL_NAMES` (obfuscated: `xHH`) - Threshold for inline-vs-summarised lists
