# Auto Memory: Cross-Validation of Key Integration Chains

## Overview

This document provides source-level cross-validation of all critical integration chains connecting the Auto Memory system to the agent loop, system prompt pipeline, plan mode, agent teams memory, and normalization pipeline.

**All symbols verified against source code. All logic chains traced end-to-end.**

**Version**: Claude Code v2.1.76
**Date**: 2026-03-29

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## 1. Complete Agent Loop Architecture

### 1.1 Attachment Pipeline: `_uY` + `Hz` + `Vf6`

The attachment system follows a three-layer architecture. Understanding this is critical to correctly placing memory injection in the turn sequence.

```javascript
// ============================================
// _uY - computeAllAttachments - Parallel attachment computation
// Location: chunks.147.mjs:1-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = { ...q, abortController: w },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)),
                  Hz("mcp_resources", () => SuY(A, $)),
                  Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))),
                  ...[] ] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())),
             Hz("ultrathink_effort", () => Promise.resolve(TuY(A))),
             Hz("deferred_tools_delta", () => Promise.resolve(xE1(...))),
             Hz("mcp_instructions_delta", () => Promise.resolve(uE1(...))),
             Hz("changed_files", () => CuY($)),
             Hz("nested_memory", () => IuY($)),        // ← Memory @include expansion
             Hz("dynamic_skill", () => BuY($)),
             Hz("skill_listing", () => guY($)),
             Hz("ultra_claude_md", async () => VuY(z)),
             Hz("plan_mode", () => DuY(z, q)),          // ← Plan mode reminder
             Hz("plan_mode_exit", () => XuY(q)),
             Hz("auto_mode", () => ZuY(z, q)),
             Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)),
             ...E7() ? [Hz("teammate_mailbox", ...), Hz("team_context", ...)] : [],
             Hz("agent_pending_messages", async () => $uY(q)),
             Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", ...), Hz("ide_opened_file", ...), Hz("output_style", ...),
                 Hz("diagnostics", ...), Hz("lsp_diagnostics", ...), Hz("unified_tasks", ...),
                 Hz("async_hook_responses", ...), Hz("token_usage", ...),
                 Hz("budget_usd", ...), Hz("output_token_usage", ...),
                 Hz("verify_plan_reminder", ...), Hz("queued_commands", ()=>OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter(W => W !== void 0 && W !== null)
}
```

**Architecture:**
- A 1-second timeout (`sK()`) kills slow attachment producers
- Three groups computed in parallel: `j` (at-mentions), `M` (universal), `D` (main-agent-only)
- `nested_memory` via `IuY($)` and `plan_mode` via `DuY(z, q)` are in group `M` (every turn)
- Returns flat array of non-null attachment objects

```javascript
// ============================================
// Hz - attachmentComputationWrapper - Times and error-wraps each producer
// Location: chunks.147.mjs:20-46
// ============================================

// ORIGINAL (for source lookup):
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(), z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A, duration_ms: z, attachment_size_bytes: ..., attachment_count: Y.length
        });
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", { label: A, duration_ms: z, error: !0 });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}

// READABLE:
async function attachmentComputationWrapper(label, producer) {
    const start = Date.now();
    try {
        const results = await producer();
        const duration = Date.now() - start;
        // 5% random sampling for telemetry (avoids performance overhead every turn)
        if (Math.random() < 0.05) recordTelemetry("tengu_attachment_compute_duration", { label, duration_ms: duration, ... });
        return results;
    } catch (err) {
        if (Math.random() < 0.05) recordTelemetry("tengu_attachment_compute_duration", { label, duration_ms: ..., error: true });
        return logError(err), logWarning(`Attachment error in ${label}`, err), [];  // ← Fail-safe: returns []
    }
}
// Mapping: Hz→attachmentComputationWrapper, _6→logError, jV→logWarning
```

**Why Hz wraps each producer:** Individual failure isolation — if `nested_memory` computation fails, it returns `[]` and the other attachments still proceed. 5% telemetry sampling prevents high-frequency overhead.

```javascript
// ============================================
// Vf6 - streamAttachmentsAsMessages - Yields each attachment as a message
// Location: chunks.147.mjs:822-830
// ============================================

// ORIGINAL (for source lookup):
async function* Vf6(A, q, K, Y, z, _) {
    let w = await _uY(A, q, K, Y, z, _);
    if (w.length === 0) return;
    d("tengu_attachments", { attachment_types: w.map((O) => O.type) });
    for (let O of w) yield f4(O)
}

// READABLE:
async function* streamAttachmentsAsMessages(userText, agentContext, null, queuedCommands, messages, agentId) {
    const attachments = await computeAllAttachments(userText, agentContext, null, queuedCommands, messages, agentId);
    if (attachments.length === 0) return;
    recordTelemetry("tengu_attachments", { attachment_types: attachments.map(a => a.type) });
    for (const attachment of attachments) yield wrapAsMessage(attachment);
}
// Mapping: Vf6→streamAttachmentsAsMessages, _uY→computeAllAttachments, f4→wrapAsMessage
```

---

### 1.2 Agent Loop: Complete Turn Sequence

The agent loop in `chunks.148.mjs` processes each turn in this order:

```
Line 916:  L = zqq(P, X)        ← START: concurrent memory search (returns Promise)
           h = skillPrefetch()   ← START: concurrent skill prefetch (returns handle)

Lines ~920-987: Message preparation
  - Fetch microcompact
  - Autocompact check
  - Build system prompt Q (via R0)

Lines 988-1100: while (o) loop — LLM API call
  K5("query_api_streaming_start")
  for await (Q6 of j.callModel({
      messages: eE1(I, Y),       ← Full message history
      systemPrompt: Q,           ← Built by R0 (memory cached here)
      thinkingConfig: ...,
      ...
  })) { yield Q6, e.push(Q6) }  ← Stream LLM response to caller

Lines ~1260-1340: Tool execution
  l = GE1(H6, e, _, X)          ← Execute tool uses
  for await (D6 of l) {
      yield D6.message
      Y6.push(D6.message)        ← Collect tool results into Y6
  }

Lines 1345-1347: BETWEEN-TURN attachment injection (Vf6)
  for await (D6 of Vf6(null, i, null, O6, [...I, ...e, ...Y6], O))
      yield D6, Y6.push(D6)     ← Add nested_memory, plan_mode, etc. to Y6

Lines 1348-1357: Relevant memories injection (from concurrent zqq)
  if (L) {
      D6 = _qq(await L, H6)     ← AWAIT the concurrent search, filter vs Read tool
      for (Q6 of D6)
          yield f4(Q6), Y6.push(f4(Q6))   ← Add relevant_memories to Y6
  }

Lines 1358-1365: Skill discovery injection (from concurrent prefetch)

Lines 1366+: Continue loop with updated Y6 (includes all injected context)
```

**Key insight — "Between-tool-turn" injection:**

Both `Vf6` (for `nested_memory`, `plan_mode`, etc.) AND `relevant_memories` (from `zqq`) are injected **AFTER** tool execution, not before the LLM call. They are accumulated in `Y6` and included in the NEXT LLM API call's message history. This is the "between tool turn" pattern — each tool-use round-trip can add fresh context for the next LLM call.

```
Turn N LLM call:  messages = [history + system]
    ↓ LLM yields tool use
    ↓ Tool executes, result → Y6
    ↓ Vf6 injects [nested_memory, plan_mode, ...] → Y6
    ↓ zqq result filtered by _qq → Y6
Turn N+1 LLM call: messages = [history + Y6_with_injections]
    ↓ LLM sees updated context including memory
```

---

## 2. `nested_memory` vs `relevant_memories`: Two Distinct Memory Channels

These are fundamentally different and serve different purposes.

### 2.1 `nested_memory` — @include Expansion (IuY)

```javascript
// ============================================
// produceNestedMemoryAttachment - Expands @include file references
// Location: chunks.147.mjs:541-550
// ============================================

// ORIGINAL (for source lookup):
async function IuY(A) {
    if (!A.nestedMemoryAttachmentTriggers || A.nestedMemoryAttachmentTriggers.size === 0) return [];
    let q = A.getAppState(), K = [];
    for (let Y of A.nestedMemoryAttachmentTriggers) {
        let z = Yqq(Y, A, q);
        K.push(...z)
    }
    return A.nestedMemoryAttachmentTriggers.clear(), K
}
```

**Trigger mechanism:** A set `nestedMemoryAttachmentTriggers` on the agent state. When MEMORY.md or CLAUDE.md contains `@include path/to/file.md`, the include resolver (`cv9`) adds the resolved path to this set. On next turn, `IuY` reads those files and injects them as `nested_memory` attachments.

**Use case:** Static inclusion of memory topic files. MEMORY.md says `@debugging.md` → debugging.md content injected as nested_memory each turn.

### 2.2 `relevant_memories` — Semantic Search (buY / zqq)

**Trigger mechanism:** `zqq` runs LLM-powered semantic search on the memory directory, finds relevant files, injects them. Gated by `tengu_moth_copse`.

**Use case:** Dynamic, query-relevant memory injection. The LLM (via `quY`) decides which memory files are relevant to the current query.

### 2.3 Comparison Table

| Aspect | `nested_memory` | `relevant_memories` |
|--------|----------------|---------------------|
| **Trigger** | `@include` in CLAUDE.md/MEMORY.md | User message via `zqq` (tengu_moth_copse) |
| **Selection** | Explicit file reference | LLM-based semantic search |
| **Producer** | `IuY` | `buY` via `zqq` |
| **Timing** | Every turn (if triggers exist) | Concurrent with LLM request |
| **Max files** | All referenced files | 5 files max |
| **Max lines** | MEMORY_MAX_LINES (200) | RELEVANT_MEMORIES_MAX_LINES (200) |
| **Staleness** | No staleness warning | `buildStalenessWarning (Cz8)` applied |
| **Dedup** | Not deduplicated | `_qq` removes already-Read files |
| **Format** | `Contents of {path}:...` | `Memory (saved {reltime}): {path}:...` or with staleness warning |
| **Agent teams** | Per-agent CLAUDE.md includes | Agent @mention targeting |

---

## 3. Agent Teams Memory Chain

### 3.1 Full Agent Reference Resolution Chain

When a user message contains `@agent-xxx` or `@"agent-xxx (agent)"`, the memory system resolves the referenced agent's memory directory:

```javascript
// ============================================
// Full chain: wqq → buY → GW6 agent memory path resolution
// ============================================

// STEP 1: wqq — Extract agent references from message text
// Location: chunks.147.mjs:743
function wqq(A) {
    let q = [],
        K = /(^|\s)@"([\w:.@-]+) \(agent\)"/g,  // Format 1: @"agent-name (agent)"
        Y;
    while ((Y = K.exec(A)) !== null) if (Y[2]) q.push(Y[2]);
    let z = /(^|\s)@(agent-[\w:.@-]+)/g,          // Format 2: @agent-name
        _ = A.match(z) || [];
    for (let w of _) q.push(w.slice(w.indexOf("@") + 1));
    return [...new Set(q)]   // Deduplicate
}

// STEP 2: buY — Resolve agent type to memory path
// Location: chunks.147.mjs:552
async function buY(A, q, K, Y) {
    let z = AbortSignal.timeout(5000),
        _ = wqq(A).flatMap((j) => {
            let J = j.replace("agent-", ""),     // "agent-coder" → "coder"
                M = q.find((D) => D.agentType === J);   // Find in activeAgents
            return M?.memory ? [GW6(J, M.memory)] : []  // Get path if agent has memory config
        }),
        w = _.length > 0 ? _ : [uH()];  // ← Fallback to auto memory dir if no agent refs
    // ... search and fetch files from w (array of memory dirs) ...
}

// STEP 3: GW6 — Map agent type + memory scope to file path
// Location: chunks.90.mjs:860
function GW6(A, q) {
    let K = Nm9(A);   // Normalize: "agent:name" → "agent-name" (replaces : with -)
    switch (q) {
        case "project": return id(G1(), ".claude", "agent-memory", K) + xB;
        case "local":   return J94(K);   // Local scope with remote support
        case "user":    return id(Ma(), "agent-memory", K) + xB;  // User home
    }
}

// Supporting: Nm9 — normalizeAgentName (chunks.90.mjs:851)
function Nm9(A) { return A.replace(/:/g, "-") }

// Supporting: J94 — getLocalAgentMemoryPath (chunks.90.mjs:855)
function J94(A) {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR)
        return id(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects", BD(LJ(qY()) ?? qY()), "agent-memory-local", A) + xB;
    return id(G1(), ".claude", "agent-memory-local", A) + xB
}
```

**Agent memory directory structure:**

| Scope | Path |
|-------|------|
| `project` | `{cwd}/.claude/agent-memory/{agent-name}/` |
| `local` | `{cwd}/.claude/agent-memory-local/{agent-name}/` (or remote path) |
| `user` | `~/.claude/agent-memory/{agent-name}/` (or CLAUDE_CODE_REMOTE_MEMORY_DIR) |

**Memory search fallback:** If the user message contains NO agent @references, `buY` falls back to `uH()` (the auto memory directory). This means the regular auto memory is always searched when no specific agent is mentioned.

**Agent @reference to memory path flow:**

```
User: "Ask @agent-coder about the build setup"
         │
         ▼
wqq("...@agent-coder...") → ["agent-coder"]
         │
         ▼
"agent-coder".replace("agent-", "") → "coder"
activeAgents.find(a => a.agentType === "coder") → { agentType: "coder", memory: "user" }
         │
         ▼
GW6("coder", "user") → "~/.claude/agent-memory/coder/"
         │
         ▼
a4q(query, "~/.claude/agent-memory/coder/", 5s, recentTools)
    → AuY() → list .md files, sort by mtime
    → quY() → LLM selects relevant files
         │
         ▼
h36(path, 0, 200) → read file content with 200-line limit
         │
         ▼
{ type: "relevant_memories", memories: [{ path, content, mtimeMs }] }
```

---

## 4. Plan Mode Integration

### 4.1 Plan Mode Attachment Production (DuY)

```javascript
// ============================================
// producePlanModeAttachment - DuY
// Location: chunks.147.mjs:136-165
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];                    // Guard: only in plan mode
    if (A && A.length > 0) {
        let { turnCount: H, foundPlanModeAttachment: j } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []   // Rate limiting
    }
    let z = Fj(q.agentId),  // planFilePath
        _ = sJ(q.agentId),  // planContent
        w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode", reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId, planFilePath: z, planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({ type: "plan_mode_reentry", planFilePath: z }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({ type: "plan_mode", reminderType: $, isSubAgent: !!q.agentId,
                    planFilePath: z, planExists: _ !== null }), w
}
```

**Key logic:**
1. **Guard**: Returns empty array if not in plan mode — zero overhead for normal sessions
2. **Rate limiting**: `TURNS_BETWEEN_ATTACHMENTS` prevents repeated plan mode reminder spam
3. **Ultraplan handling**: Special case for "ultraplan" pre-plan mode transition
4. **Re-entry**: When returning to plan mode, injects `plan_mode_reentry` attachment first
5. **Reminder frequency**: Alternates "full" vs "sparse" reminder using `FULL_REMINDER_EVERY_N_ATTACHMENTS` modulo

**Memory + Plan Mode interaction:** When in plan mode, the system prompt (from `R0`) includes memory content (MEMORY.md). The agent can reference past patterns from memory when designing the plan. Plan decisions can be saved to memory via Write/Edit tools. The plan_mode attachment (from `DuY`) is injected separately, ALONGSIDE memory, in the same `Vf6` pass.

### 4.2 Memory-Plan Interaction During Between-Turn Injection

```
After LLM tool use (between turns):
│
├─ Vf6 runs _uY in parallel:
│   ├─ Hz("nested_memory", IuY)   ← Memory @includes
│   ├─ Hz("plan_mode", DuY)       ← Plan mode reminder (if in plan mode)
│   └─ other attachments...
│
├─ zqq result (relevant_memories) injected after Vf6
│
└─ Next LLM call sees:
   ├─ System prompt with cached MEMORY.md (from R0/B8q)
   ├─ nested_memory attachments (from @includes)
   ├─ plan_mode reminder (if in plan mode)
   └─ relevant_memories (semantic search result)
```

---

## 5. Normalization Pipeline: Memory → System Reminder Tags

### 5.1 `normalizeAttachmentForAPI (Ui8)` — Both Memory Types

```javascript
// ============================================
// normalizeAttachmentForAPI - Handle memory attachment types
// Location: chunks.174.mjs:165-184
// ============================================

// ORIGINAL (for source lookup):
case "nested_memory":
    return b5([p1({
        content: `Contents of ${A.content.path}:\n\n${A.content.content}`,
        isMeta: !0
    })]);
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}\n\nMemory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({ content: `${z}\n\n${K.content}`, isMeta: !0 })
    }));
```

**Normalization output for `nested_memory`:**
```xml
<system-reminder>
Contents of /path/to/debugging.md:

# Debugging Notes
- Always check logs first
...
</system-reminder>
```

**Normalization output for `relevant_memories` (fresh):**
```xml
<system-reminder>Memory (saved today): /path/to/patterns.md:

# Code Patterns
...
</system-reminder>
```

**Normalization output for `relevant_memories` (stale, >1 day):**
```xml
<system-reminder>
This memory is 5 days old. Memories are point-in-time observations, not live state —
claims about code behavior or file:line citations may be outdated. Verify against
current code before asserting as fact.

Memory: /path/to/patterns.md:

# Code Patterns
...
</system-reminder>
```

**Chain verified:**
```
buY() returns: { type: "relevant_memories", memories: [{ path, content, mtimeMs }] }
    ↓
f4(Q6) wraps as attachment message
    ↓
normalizeAttachmentForAPI(Ui8) called when building API message
    ↓ case "relevant_memories":
    ├─ Cz8(mtimeMs) → staleness warning (empty if ≤1 day old)
    ├─ cJ7(mtimeMs) → "today"/"yesterday"/"{N} days ago"
    ├─ p1({ content, isMeta: true }) → user message with meta flag
    └─ b5([...]) → wrap in <system-reminder> tags
```

---

## 6. System Prompt Chain: `R0` Called Before Every LLM Request

### 6.1 Where R0 Is Called

Cross-validated: `R0` (`buildSystemPrompt`) is called in at least 5 locations before LLM API requests:

| File | Line | Context |
|------|------|---------|
| `chunks.134.mjs` | ~1603 | Sub-agent system prompt building |
| `chunks.136.mjs` | ~1673 | Main loop query preparation |
| `chunks.149.mjs` | ~1944 | Query function with tool permissions |
| `chunks.151.mjs` | ~111 | Main loop with additional working dirs |
| `chunks.185.mjs` | ~1803 | Background agent initialization |

**Pattern at each call site:**

```javascript
// Pattern used (chunks.151.mjs:111):
[systemPromptParts, otherData, moreData] = await Promise.all([
    R0(tools, model, workingDirs, mcpClients),
    getOtherData(),
    getMoreData()
]);
// systemPromptParts used to build systemPrompt Q for callModel()

// Pattern used (chunks.185.mjs:1803 — background agent):
[B, b, p] = await Promise.all([R0(z, I, dirs, _), a2(), mw()]);
// ...
const U = typeof J === "string" && Oz1() ? await ID1() : null;  // ← Extra memory call in cowork mode
const r = uq([...typeof J === "string" ? [J] : B, ...U ? [U] : [], ...M ? [M] : []]);
```

**Important: Background agent `Oz1()` branch at chunks.185.mjs:1806:**

```javascript
const U = typeof J === "string" && Oz1() ? await ID1() : null
```

This calls `ID1()` directly in the background agent path ONLY when:
1. `J` is a string (custom system prompt provided)
2. AND `Oz1()` is true (cowork mode active — `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` set)

In cowork mode, background agents get an additional memory injection on top of the custom system prompt. In non-cowork mode, memory is handled by `R0` via `B8q` caching.

### 6.2 Memory Component Caching Verification

```javascript
// R0 at chunks.168.mjs:2153:
j = [AF("memory", () => ID1()), ...]
J = await B8q(j)

// B8q (chunks.144.mjs:1413):
async function B8q(A) {
    let q = ou1();  // v1.systemPromptSectionCache (Map)
    return Promise.all(A.map(async (K) => {
        if (!K.cacheBreak && q.has(K.name)) return q.get(K.name) ?? null;
        let Y = await K.compute();
        return au1(K.name, Y), Y  // cache it
    }))
}
```

**Verified caching behavior:**

| Scenario | `B8q` behavior |
|----------|---------------|
| Turn 1, no cache | `q.has("memory")` = false → call `ID1()`, cache result |
| Turn 2+ | `q.has("memory")` = true → return `q.get("memory")`, no `ID1()` call |
| After `RT6()` | cache cleared → next call triggers `ID1()` again |
| After worktree change | `RT6()` called → cache cleared |
| After session reset (`gl()`) | `RT6()` called → cache cleared |
| MCP instructions | `m8q` creates `cacheBreak: true` → always recomputed |

---

## 7. Session Reset Chain

### 7.1 `gl` (resetSession) Full Cleanup

```javascript
// ============================================
// resetSession - gl
// Location: chunks.147.mjs:2551-2552
// ============================================

// ORIGINAL (for source lookup):
function gl(A) {
    W66(), RT6(), wW4(), rE1(), cf8(), Oc(), Lz4(), Hp8()
}
```

**Function chain called by `gl()`:**

| Symbol | Readable Name (inferred) | Effect |
|--------|--------------------------|--------|
| `W66()` | clearConversationHistory | Clears message history |
| `RT6()` | clearSystemPromptCache | Clears `v1.systemPromptSectionCache` — **forces MEMORY.md re-read next turn** |
| `wW4()` | clearFileState | Clears file read/write state |
| `rE1()` | clearTelemetryState | Resets telemetry counters |
| `cf8()` | clearCompactState | Resets compact tracking |
| `Oc()` | clearUndoState | Clears edit undo stack |
| `Lz4()` | clearPlanState | Resets plan mode state |
| `Hp8()` | clearPermissionState | Resets permission overrides |

After `gl()`, the next turn will:
1. Re-read MEMORY.md from disk (cache miss)
2. Re-evaluate all system prompt components
3. Start fresh conversation with empty history

---

## 8. Feature Flag Cross-Validation Summary

All flags verified with actual source usage locations:

| Flag | Source Location | Effect When True |
|------|-----------------|-----------------|
| `tengu_moth_copse` | `chunks.147.mjs:593` | Enables `zqq` → `relevant_memories` pipeline |
| `tengu_herring_clock` | `chunks.84.mjs:141` | Enables team memory (`SD1` → `isTeamMemoryEnabled`) |
| `tengu_passport_quail` | `chunks.84.mjs:392,400` | Background agent mode → read-only + extraction subagent |
| `tengu_swinburne_dune` | `chunks.84.mjs:384` | File-based memory format (U14 vs uv9) |
| `tengu_coral_fern` | `chunks.84.mjs:374` | Adds search guidance section (Dt) to memory prompt |
| `tengu_paper_halyard` | `chunks.84.mjs:816`, `chunks.147.mjs:382` | Filters Project/Local types from file collection |
| `tengu_system_prompt_global_cache` | `chunks.168.mjs:2155` | Adds global cache break marker to system prompt |

---

## 9. End-to-End Validation: Complete Memory Lifecycle Per Turn

Tracing a single turn from user message to memory injection, with all verified source locations:

```
USER: "Help me optimize the database queries"
│
├─ [chunks.148.mjs:916] L = zqq(messages, ctx)
│   ├─ [chunks.147.mjs:593] Z3() → true (memory enabled)
│   ├─ [chunks.147.mjs:593] w8("tengu_moth_copse") → true (flag enabled)
│   ├─ [chunks.147.mjs:595] findLast(user, !meta) → this message
│   ├─ [chunks.147.mjs:596-597] Fg() → "Help me optimize..." (>1 word)
│   └─ [chunks.147.mjs:598] buY("Help me optimize...", agents, readState, tools)
│       ├─ [chunks.147.mjs:553] wqq(text) → [] (no @agent mentions)
│       ├─ [chunks.147.mjs:558] fallback to [uH()] = auto memory dir
│       ├─ [chunks.146.mjs:2773] a4q(query, memDir, 5s, recentTools)
│       │   ├─ [chunks.146.mjs:2784] AuY(dir) → list .md files by mtime
│       │   └─ [chunks.146.mjs:2821] quY(query, files) → LLM selects ["patterns.md"]
│       └─ [chunks.89.mjs:684] h36("patterns.md", 0, 200) → content
│           → Returns Promise<[{type:"relevant_memories", memories:[...]}]>
│
├─ [chunks.168.mjs:2143] R0(tools, model, dirs, mcp)
│   ├─ [chunks.144.mjs:1413] B8q(components)
│   │   └─ "memory" in cache? YES → return cached MEMORY.md content
│   └─ Returns system prompt array including cached memory
│
├─ [chunks.148.mjs:~1020] j.callModel({ messages, systemPrompt, ... })
│   └─ LLM uses system prompt with MEMORY.md content
│
├─ [chunks.148.mjs:~1280] Tool execution (if any)
│   └─ e.g., agent reads "queries.sql" via Read tool → H6 includes Read("queries.sql")
│
├─ [chunks.148.mjs:1347] Vf6(null, i, null, O6, messages, agentId)
│   └─ _uY computes all attachment producers in parallel:
│       ├─ Hz("nested_memory", IuY) → [] (no @includes triggered)
│       ├─ Hz("plan_mode", DuY) → [] (not in plan mode)
│       └─ other attachments...
│
├─ [chunks.148.mjs:1348-1357] if (L) { _qq(await L, H6) }
│   ├─ L resolves: [{ type: "relevant_memories", memories: [{ path: "patterns.md", ... }] }]
│   ├─ H6 = [Read("queries.sql")]
│   ├─ _qq: "patterns.md" NOT in readFilePaths → KEPT
│   └─ Yields wrapped relevant_memories:
│       → normalizeAttachmentForAPI → <system-reminder>Memory (saved today): patterns.md:...</system-reminder>
│
└─ Next LLM call sees:
    ├─ System prompt: (cached MEMORY.md content)
    ├─ Conversation history
    └─ <system-reminder>Memory (saved today): patterns.md:...</system-reminder>
```

---

## Summary: All Key Chains Verified

| Chain | Status | Key Finding |
|-------|--------|-------------|
| System prompt caching | ✅ | `B8q` caches `"memory"` key, not re-read every turn |
| Agent loop timing | ✅ | `Vf6` + `relevant_memories` injected AFTER tool execution, BEFORE next LLM call |
| Agent reference resolution | ✅ | `wqq→buY→GW6` fully traced, 3-tier scope |
| `relevant_memories` dedup | ✅ | `_qq` filters files in `H6` (Read tool uses this turn) |
| Plan mode integration | ✅ | `DuY` via `Hz("plan_mode")` in `_uY`, rate-limited, zero-cost when disabled |
| Normalization pipeline | ✅ | `Ui8` handles both `nested_memory` and `relevant_memories` with staleness |
| Session reset chain | ✅ | `gl()` chains 8 functions, `RT6()` clears memory cache |
| Background agent memory | ✅ | `Oz1()` cowork-mode: extra `ID1()` call; normal: handled by `R0` |
| Feature flags | ✅ | All 7 flags verified with exact source locations |
