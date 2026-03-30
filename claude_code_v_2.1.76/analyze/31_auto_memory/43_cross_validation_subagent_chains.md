# Auto Memory: Cross-Validation — Subagent Spawning & Include Resolution Chains

## Overview

This document validates three remaining high-priority chains:

1. **Memory extraction subagent full spawning chain** — how `cmY`/`vKq` triggers a forked agent that writes memories
2. **Agent memory scope propagation** — how the UI scope selection flows to `m36` → agent system prompt
3. **`cv9` → @include resolution** — how `@file.md` in CLAUDE.md files triggers recursive loading

**Version**: Claude Code v2.1.76 | **Date**: 2026-03-29 | **All symbols source-verified**

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

New symbols in this document:
- `cmY` - createExtractMemoriesModule (chunks.148.mjs:508) — factory that creates vKq
- `vKq` - executeExtractMemories (chunks.148.mjs:580) — public entrypoint for extraction
- `lmY` - triggerExtractMemories (chunks.148.mjs:599) — thin wrapper calling vKq
- `av` - runForkedAgent (chunks.148.mjs:2026) — spawns isolated agent using Yh
- `Bc6` - buildForkedToolContext (chunks.148.mjs:1978) — creates subagent tool context
- `Fb` - buildCacheSafeParams (chunks.148.mjs:1924) — extracts system+messages for fork
- `QmY` - countMessagesSince (chunks.148.mjs:427) — counts messages after UUID marker
- `UmY` - didConversationWriteMemory (chunks.148.mjs:442) — detects direct memory writes
- `fKq` - buildMemoryToolFilter (chunks.148.mjs:460) — restricts tools to Read/Edit/Write on memory path
- `TKq` - extractFilePathFromToolUse (chunks.148.mjs:484) — extracts file_path from tool_use block
- `dmY` - extractWrittenPaths (chunks.148.mjs:494) — collects all file paths written by subagent
- `VKq` - mainQueryLoop (chunks.148.mjs:621) — outer query function calling executeExtractMemories
- `m36` - buildAgentMemoryInstructions (chunks.90.mjs:896) — generates scope-specific memory guide
- `GW6` - getAgentMemoryDir (chunks.90.mjs:860) — computes agent memory directory by scope
- `Nm9` - sanitizeAgentTypeName (chunks.90.mjs:851) — `A.replace(/:/g, "-")`
- `J94` - getLocalScopeMemoryDir (chunks.90.mjs:855) — local-scope path (env var aware)
- `LP1` - describeMemoryScope (chunks.90.mjs:883) — human-readable scope label
- `Sk` - loadClaudeFileWithIncludes (chunks.84.mjs:602) — recursively loads CLAUDE.md with @includes
- `Xt` - loadRulesDirFiles (chunks.84.mjs:625) — scans .claude/ directory
- `if8` - loadManagedAndUserRules (chunks.84.mjs:702) — loads Managed+User rules for path
- `nf8` - loadProjectRules (chunks.84.mjs:712) — loads Project rules for nested dir
- `iv9` - isClaudeFileExcluded (chunks.84.mjs:570) — checks claudeMdExcludes setting
- `xv9` - buildPassiveMemoryPrompt (chunks.84.mjs:329) — read-only memory system prompt (extraction mode)
- `uv9` - buildClassicAutoMemoryPrompt (chunks.84.mjs:367) — classic auto-memory system prompt
- `U14` - buildTypedMemoryInstructions (chunks.84.mjs:324) — structured "typed" memory guide
- `d14` - buildTypedAgentMemoryPrompt (chunks.84.mjs:333) — typed agent memory prompt
- `Q14` - buildClassicAgentMemoryPrompt (chunks.84.mjs:290) — classic agent memory prompt

---

## 1. Memory Extraction Subagent: Full Spawning Chain

### 1.1 Architecture Overview

The memory extraction mechanism uses a **closure factory pattern** to maintain per-session state while exposing a single exported function (`vKq`):

```
cmY() — called once at module init
│
├─ Creates closure variables:
│   A = lastProcessedMessageUUID (null initially)
│   q = bool: currently running?
│   K = bool: extraction in progress?
│   Y = int: consecutive run counter (throttle)
│   z = stashed context (for trailing run)
│
├─ Defines inner async _({context, addNotification, isTrailingRun})
│   ← The actual extraction logic
│
└─ Assigns to vKq ← exported as imY.executeExtractMemories
```

**Why a closure factory?** State must persist across turns within the same session but reset across sessions. The closure variables (`A`, `K`, `Y`, `z`) track extraction state without needing external storage.

### 1.2 Trigger Point: Where Extraction Fires

```javascript
// ============================================
// VKq - mainQueryLoop: where extraction triggers
// Location: chunks.148.mjs:635
// ============================================

// ORIGINAL (for source lookup):
if (!_.agentId) imY.executeExtractMemories(H, _.addNotification);

// READABLE (for understanding):
if (!toolUseContext.agentId) {
    extractionModule.executeExtractMemories(contextSnapshot, toolUseContext.addNotification);
}

// Mapping: VKq→mainQueryLoop, _→toolUseContext, imY→extractionModule, H→contextSnapshot
```

**Critical condition**: `!_.agentId` — extraction ONLY fires for the top-level conversation, NOT for any subagent (Agent tool invocations). This prevents infinite recursion where the extraction subagent triggers further extraction.

**Note**: `imY.executeExtractMemories` is a `fire-and-forget` call — it's NOT awaited. This means extraction runs concurrently with the main query response being returned to the user. The extraction completion does NOT block user-visible output.

### 1.3 Gate Checks in `vKq`

```javascript
// ============================================
// vKq - executeExtractMemories: gate checks
// Location: chunks.148.mjs:580-596
// ============================================

// ORIGINAL:
vKq = async function(O, $) {
    if (O.toolUseContext.agentId) return;                    // 1. not inside subagent
    if (!w8("tengu_passport_quail", !1)) return;             // 2. feature flag enabled
    if (!Z3()) return;                                       // 3. auto memory enabled
    if (t4()) return;                                        // 4. not read-only mode
    if (K) {                                                 // 5. not already running
        k("[extractMemories] extraction in progress — stashing for trailing run");
        d("tengu_extract_memories_coalesced", {});
        z = { context: O, addNotification: $ };              // stash for trailing run
        return
    }
    await _({ context: O, addNotification: $, isTrailingRun: false })
}

// Mapping: vKq→executeExtractMemories, w8→getFeatureFlag, Z3→isAutoMemoryEnabled,
//          t4→isReadOnlyMode, K→extractionInProgress
```

**Gate conditions** (all must pass):
| Guard | Symbol | Meaning |
|-------|--------|---------|
| `!agentId` | duplicated from VKq | main conversation only |
| `tengu_passport_quail` | feature flag | extraction mode enabled |
| `Z3()` | `isAutoMemoryEnabled` | auto memory turned on |
| `t4()` | `isReadOnlyMode` | not in read-only/inspection mode |
| `!K` | in-progress flag | not already extracting |

**Trailing run**: If extraction is already in progress (`K = true`) when a new request arrives, the latest context is stashed in `z`. After the current run completes, it executes `_()` again with the stashed context. This ensures the most recent conversation state is always eventually processed, preventing silent data loss when extractions overlap.

### 1.4 Inner Extraction Logic `_()`

```javascript
// ============================================
// _ (inner) - extractMemoriesInner
// Location: chunks.148.mjs:513-579
// ============================================

// ORIGINAL (simplified):
async function _({ context: w, addNotification: O, isTrailingRun: $ }) {
    let { messages: H } = w, j = uH(), J = QmY(H, A);

    // Skip if conversation already wrote memory files directly
    if (UmY(H, A)) {
        k("[extractMemories] skipping — conversation already wrote to memory files");
        let Z = H[H.length - 1];
        if (Z?.uuid) A = Z.uuid;        // advance the marker
        d("tengu_extract_memories_skipped_direct_write", { message_count: J });
        return
    }

    // Select prompt variant based on team memory + typing flag
    let M = pmY.isTeamMemoryEnabled(),
        D = w8("tengu_swinburne_dune", !1),
        X = M ? (D ? WKq : PKq)(J) : (D ? XKq : DKq)(J);

    // Throttle: skip unless enough turns have passed
    if (!$) {
        if (Y++, Y < (w8("tengu_bramble_lintel", null) ?? 1)) return
    }
    Y = 0, K = !0;   // set in-progress flag

    try {
        let Z = await av({
            promptMessages: [p1({ content: X })],  // extraction instructions
            cacheSafeParams: Fb(w),                // main conversation context
            canUseTool: fKq(j),                    // tool restrictions
            querySource: "extract_memories",
            forkLabel: "extract_memories"
        });

        // Update last-processed marker
        let G = H[H.length - 1];
        if (G?.uuid) A = G.uuid;

        // Log results, notify UI
        let f = dmY(Z.messages);                  // collect written paths
        if (f.length > 0) {
            O?.({ key: "extract-memories", text: `Saved ${f.length} memor${f.length===1?"y":"ies"}`, priority: "medium" });
        }

        // Telemetry
        d("tengu_extract_memories_extraction", { ...Z.totalUsage, message_count: J });
    } catch (Z) {
        k(`[extractMemories] error: ${Z}`)
    } finally {
        K = !1;                                    // clear in-progress flag
        let Z = z;
        if (z = void 0, Z) {
            k("[extractMemories] running trailing extraction for stashed context");
            await _({ context: Z.context, addNotification: Z.addNotification, isTrailingRun: true })
        }
    }
}

// Mapping: _→extractMemoriesInner, w→context, O→addNotification, $→isTrailingRun,
//          J→newMessageCount, M→hasTeamMemory, D→isTypedFormat, X→extractionPrompt,
//          K→extractionInProgress, Y→runCounter, A→lastProcessedUUID
```

### 1.5 Prompt Selection: 2×2 Matrix

```javascript
// Selection at chunks.148.mjs:532:
let X = M ? (D ? WKq : PKq)(J) : (D ? XKq : DKq)(J);

// Matrix:
//
//              tengu_swinburne_dune = false   tengu_swinburne_dune = true
// team = false    DKq(J)                         XKq(J)
// team = true     PKq(J)                         WKq(J)
```

| Flag | `tengu_swinburne_dune=false` | `tengu_swinburne_dune=true` |
|------|------------------------------|------------------------------|
| **No team memory** | `DKq(J)` — classic single-memory | `XKq(J)` — typed single-memory |
| **Team memory enabled** | `PKq(J)` — classic user+team | `WKq(J)` — typed user+team |

All 4 call `sE1(J)` as their first line:

```javascript
// sE1 - extractionPreamble (chunks.148.mjs:393):
function sE1(A) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${A} messages above and use them to update your persistent memory systems.`
}
// Mapping: sE1→extractionPreamble, A→messageCount
```

**Key design**: `sE1` explicitly overrides the "don't write memory" instruction that the main agent receives in `xv9` mode. This solves the conflict: the main agent is told it shouldn't write memories (the extraction subagent will), but the extraction subagent sees the same conversation context including that instruction — `sE1` reverts it.

### 1.6 Tool Restrictions for Extraction Subagent

```javascript
// ============================================
// fKq - buildMemoryToolFilter
// Location: chunks.148.mjs:460
// ============================================

// ORIGINAL:
function fKq(A) {
    return async (q, K) => {
        if (q.name === s7) return { behavior: "allow", updatedInput: K };    // s7 = "Read"
        if ((q.name === R4 || q.name === _K) && "file_path" in K) {         // R4="Edit", _K="Write"
            let Y = K.file_path;
            if (typeof Y === "string" && Da(Y)) return { behavior: "allow", updatedInput: K };
        }
        return {
            behavior: "deny",
            message: `only ${s7}, ${R4}, and ${_K} within ${A} are allowed`,
            decisionReason: { type: "other", reason: `...` }
        }
    }
}

// Mapping: fKq→buildMemoryToolFilter, A→memoryDir,
//          s7→"Read", R4→"Edit", _K→"Write", Da→isAutoMemoryPath
```

**Tool access table** for extraction subagent:

| Tool | Condition | Result |
|------|-----------|--------|
| `Read` (s7) | always | ALLOW |
| `Edit` (R4) | `Da(file_path)` = in auto memory dir | ALLOW |
| `Write` (_K) | `Da(file_path)` = in auto memory dir | ALLOW |
| Any other | — | DENY |

**Why is Read always allowed?** The extraction subagent needs to read existing memory files to avoid duplicating content — it checks MEMORY.md before writing. Read is safe since it has no side effects.

**Why Edit/Write restricted to auto memory path?** The extraction subagent must ONLY write to memory files. If it could write to arbitrary paths, a malicious/hallucinating assistant turn could trick it into modifying source code.

### 1.7 Context Passed to Extraction Subagent via `av`/`Fb`

```javascript
// Fb - buildCacheSafeParams (chunks.148.mjs:1924):
function Fb(A) {
    return {
        systemPrompt: A.systemPrompt,           // same system prompt as main conversation
        userContext: A.userContext,
        systemContext: A.systemContext,
        toolUseContext: A.toolUseContext,
        forkContextMessages: A.messages         // ALL messages from main conversation
    }
}

// av - runForkedAgent (chunks.148.mjs:2026):
async function av({ promptMessages: A, cacheSafeParams: q, canUseTool: K, ... }) {
    let { systemPrompt: X, userContext: P, systemContext: W, toolUseContext: Z, forkContextMessages: G } = q,
        f = Bc6(Z, _),              // build isolated tool context (readFileState copy)
        v = [...G, ...A];           // full history + extraction instructions appended at end

    for await (let h of Yh({ messages: v, systemPrompt: X, ..., canUseTool: K, toolUseContext: f })) {
        // ...collect messages, update telemetry
    }
    // finally: f.readFileState.clear(), v.length = 0   ← cleanup
}
```

**What the extraction subagent sees:**
- The SAME system prompt as the main conversation (includes MEMORY.md content, CLAUDE.md files)
- ALL messages from the main conversation up to this point
- PLUS the extraction instructions (`DKq`/`XKq`/`PKq`/`WKq`) appended as the last user message

This gives the extraction subagent full context of the entire conversation — enabling it to identify what's worth persisting.

### 1.8 `Bc6` — Forked Tool Context

```javascript
// Bc6 - buildForkedToolContext (chunks.148.mjs:1978):
function Bc6(A, q) {
    let K = Wm(A.abortController),    // NEW abort controller (independent from parent)
        Y = () => {
            let z = A.getAppState();
            return { ...z, toolPermissionContext: { ...z.toolPermissionContext, shouldAvoidPermissionPrompts: true } }
        };
    return {
        readFileState: DI(q?.readFileState ?? A.readFileState),   // COPY of parent readFileState
        nestedMemoryAttachmentTriggers: new Set,                   // FRESH empty set
        dynamicSkillDirTriggers: new Set,
        toolDecisions: void 0,
        abortController: K,
        getAppState: Y,                                            // shouldAvoidPermissionPrompts=true
        setAppState: () => {},                                     // NOOP — doesn't update parent state
        addNotification: void 0,
        options: q?.options ?? A.options,
        messages: q?.messages ?? A.messages,
        agentId: bI(),                                             // NEW agent ID
        queryTracking: { chainId: emY(), depth: (A.queryTracking?.depth ?? -1) + 1 },
        // ... other fields
    }
}
```

**Key isolation properties:**
- `readFileState: DI(...)` — deep-copy, subagent file reads don't affect parent dedup
- `nestedMemoryAttachmentTriggers: new Set` — fresh set, no inheritance from parent
- `setAppState: () => {}` — NOOP: extraction subagent cannot modify parent app state
- `shouldAvoidPermissionPrompts: true` — bypasses confirmation dialogs (extraction runs unattended)
- `agentId: bI()` — unique ID; this is why `vKq` check `agentId` prevents subagent re-extraction

### 1.9 Message Count Calculation

```javascript
// QmY - countMessagesSince (chunks.148.mjs:427):
function QmY(A, q) {
    if (q === null || q === void 0) return A.filter(Np8).length;   // all messages if no marker
    let K = false, Y = 0;
    for (let z of A) {
        if (!K) {
            if (z.uuid === q) K = true;   // found the marker
            continue
        }
        if (Np8(z)) Y++   // count user/assistant messages after marker
    }
    if (!K) return A.filter(Np8).length;   // marker not found = count all
    return Y
}

// Np8 - isUserOrAssistantMessage: A.type === "user" || A.type === "assistant"
```

**How message count works:**
- `A` (lastProcessedUUID) tracks the last message UUID that was processed
- On first run: `A = null`, so ALL messages are counted
- After each run: `A = last_message.uuid`, so next run only counts new messages
- The count `J` is passed to `sE1(J)` to tell the extraction subagent "analyze the most recent ~N messages"

### 1.10 Direct-Write Detection via `UmY`

```javascript
// UmY - didConversationWriteMemory (chunks.148.mjs:442):
function UmY(A, q) {
    let K = q === void 0;   // no marker = scan all messages
    for (let Y of A) {
        if (!K) {
            if (Y.uuid === q) K = true;
            continue
        }
        if (Y.type !== "assistant") continue;
        let z = Y.message.content;
        if (!Array.isArray(z)) continue;
        for (let _ of z) {
            let w = TKq(_);   // extract file_path from Edit/Write tool_use
            if (w !== void 0 && Da(w)) return true   // found memory write
        }
    }
    return false
}
```

**Why skip extraction when direct writes detected?** This prevents double-writing. If the main agent (in non-`tengu_passport_quail` mode) wrote to the memory file itself during the conversation, running the extraction subagent would create duplicate entries. `UmY` scans for any Edit/Write calls where the path matches `Da()` (auto memory path). If found, extraction is skipped.

### 1.11 Complete Extraction Subagent Timeline

```
Main conversation turn N completes
│
├─ VKq calls imY.executeExtractMemories(context, addNotification) — fire and forget
│
├─ vKq:
│   ├─ Gates pass? (no agentId, feature flag, auto memory, not read-only)
│   │   YES → proceed
│   │   NO → return immediately
│   │
│   ├─ extractionInProgress?
│   │   YES → stash context in z, fire tengu_extract_memories_coalesced, return
│   │   NO → proceed
│   │
│   └─ Call _({context, addNotification, isTrailingRun: false})
│
├─ _():
│   ├─ Count new messages since lastProcessedUUID: J = QmY(H, A)
│   │
│   ├─ UmY check: did conversation write to memory directly?
│   │   YES → advance marker, skip, return
│   │   NO → continue
│   │
│   ├─ Throttle: Y++ < tengu_bramble_lintel? → return (not yet)
│   │   (default: run every time since threshold = 1)
│   │
│   ├─ Set K=true (extractionInProgress)
│   │
│   ├─ Build prompt X from 2×2 matrix: DKq/XKq/PKq/WKq (J)
│   │
│   ├─ av({
│   │       promptMessages: [p1(X)],     ← extraction instructions
│   │       cacheSafeParams: Fb(w),      ← full conversation context
│   │       canUseTool: fKq(j),          ← Read-only + Memory-Write
│   │       querySource: "extract_memories",
│   │       forkLabel: "extract_memories"
│   │   })
│   │   │
│   │   ├─ Bc6(Z): build forked tool context
│   │   │   ├─ readFileState: DI(parent) — copy
│   │   │   ├─ new agentId — prevents re-extraction
│   │   │   └─ shouldAvoidPermissionPrompts: true
│   │   │
│   │   └─ Yh(...): run agent loop with extraction instructions
│   │       │
│   │       ├─ LLM sees: system prompt + full history + "You are now acting as memory extraction subagent..."
│   │       ├─ LLM may call Write/Edit on memory files
│   │       └─ Returns when done (no more tool calls)
│   │
│   ├─ Update A = lastMessage.uuid
│   ├─ f = dmY(Z.messages) — collect written file paths
│   ├─ Notify UI: "Saved N memories"
│   ├─ Telemetry: tengu_extract_memories_extraction
│   │
│   └─ finally: K=false, check stashed trailing run
│       └─ If z exists: await _({context: z.context, isTrailingRun: true})
│
User sees notification "Saved 3 memories" (if files were written)
```

---

## 2. `ID1` — Auto Memory System Prompt Variant Selection

### 2.1 Full 6-Variant Decision Tree

```javascript
// ============================================
// ID1 - buildAutoMemorySystemPrompt
// Location: chunks.84.mjs:382
// ============================================

// ORIGINAL:
async function ID1() {
    let A = Z3(),           // isAutoMemoryEnabled
        q = w8("tengu_swinburne_dune", !1);   // typed format flag

    if (F14.isTeamMemoryEnabled()) {
        let K = uH(), Y = F14.getTeamMemPath();
        await CD1(Y);   // ensure team memory dir exists
        if (w8("tengu_passport_quail", !1)) return Qf8.buildExtractModeTypedCombinedPrompt();
        if (q) return Qf8.buildTypedCombinedMemoryPrompt();
        return Qf8.buildCombinedMemoryPrompt()
    }

    if (A) {
        let K = uH();
        await CD1(K);   // ensure auto memory dir exists
        if (w8("tengu_passport_quail", !1)) return xv9("auto memory", K).join("\n");
        if (q) return U14("auto memory", K).join("\n");
        return uv9()
    }

    return null   // auto memory disabled
}
```

**The complete 6-path decision matrix:**

| Context | `tengu_passport_quail` | `tengu_swinburne_dune` | Prompt Variant |
|---------|----------------------|----------------------|----------------|
| Team memory | true | any | `Qf8.buildExtractModeTypedCombinedPrompt()` |
| Team memory | false | true | `Qf8.buildTypedCombinedMemoryPrompt()` |
| Team memory | false | false | `Qf8.buildCombinedMemoryPrompt()` |
| No team, user only | true | any | `xv9("auto memory", K)` |
| No team, user only | false | true | `U14("auto memory", K)` |
| No team, user only | false | false | `uv9()` |
| Disabled | — | — | `null` |

### 2.2 What Each Variant Tells the Agent

```
xv9 ("passive" extraction mode):
  → "A background agent automatically extracts and saves memories.
     You should NOT write to memory files yourself."
  → Agent reads MEMORY.md for context but defers writing

U14 ("typed" structured format):
  → Structured memory guide with types (user, feedback, project, reference)
  → Two-step process: write topic file + update MEMORY.md index
  → "MEMORY.md is an index, not a memory"

uv9 ("classic" auto-memory):
  → Traditional auto-memory guide
  → Single MEMORY.md file approach
  → "lines after 200 will be truncated, so keep it concise"

Qf8 variants (team+user combined):
  → Show both ~/.claude/projects/{hash}/memory/ AND team memory path
  → PKq/WKq structure for extraction subagent (mirrors DKq/XKq but for team)
```

**Key insight**: When `tengu_passport_quail` is on, the main agent gets `xv9` (read-only mode) and the SEPARATE `vKq` extraction subagent handles writes. When `tengu_passport_quail` is off, the main agent itself handles writes using either `uv9` or `U14`.

---

## 3. Agent Memory Scope Propagation Chain

### 3.1 UI Selection → Agent Definition

When a user configures a custom agent in the Claude Code agent builder:

```javascript
// React component (chunks.164.mjs:2110-2122):
H = (D) => {   // onChange handler when scope selected
    let X = D === "none" ? void 0 : D,   // "none" → undefined (no memory)
        P = z.finalAgent?.agentType;
    Y({
        selectedMemory: X,
        finalAgent: z.finalAgent ? {
            ...z.finalAgent,
            memory: X,   // ← stored in agent definition
            getSystemPrompt: Z3() && X && P
                ? () => z.systemPrompt + "\n\n" + m36(P, X)   // ← memory instructions appended
                : () => z.systemPrompt                          // ← no memory instructions
        } : void 0
    }), q()
}
```

**Result**: `finalAgent.memory` stores the scope string (`"user"`, `"project"`, `"local"`, or `undefined`). When the agent is later spawned, `getSystemPrompt()` builds the system prompt with memory instructions appended.

### 3.2 `m36` — Memory Instructions Builder

```javascript
// ============================================
// m36 - buildAgentMemoryInstructions
// Location: chunks.90.mjs:896
// ============================================

// ORIGINAL:
function m36(A, q) {
    let K;
    switch (q) {
        case "user":
            K = "- Since this memory is user-scope, keep learnings general since they apply across all projects";
            break;
        case "project":
            K = "- Since this memory is project-scope and shared with your team via version control, tailor your memories to this project";
            break;
        case "local":
            K = "- Since this memory is local-scope (not checked into version control), tailor your memories to this project and machine";
            break
    }
    let Y = GW6(A, q);   // compute memory directory path
    return CD1(Y), (w8("tengu_swinburne_dune", !1) ? d14 : Q14)({
        displayName: "Persistent Agent Memory",
        memoryDir: Y,
        extraGuidelines: [K]
    })
}

// Mapping: m36→buildAgentMemoryInstructions, A→agentType, q→scope,
//          GW6→getAgentMemoryDir, CD1→ensureMemoryDirExists
```

**What `m36` does:**
1. Builds scope-specific guidance line `K`
2. Computes memory directory path `GW6(agentType, scope)`
3. Ensures directory exists via `CD1(Y)`
4. Returns full memory instructions (either `Q14` or `d14` based on `tengu_swinburne_dune`)

### 3.3 `GW6` — Directory Path by Scope

```javascript
// ============================================
// GW6 - getAgentMemoryDir
// Location: chunks.90.mjs:860
// ============================================

function GW6(A, q) {
    let K = Nm9(A);   // sanitize: "agent:type" → "agent-type"
    switch (q) {
        case "project": return path.join(cwd(), ".claude", "agent-memory", K) + "/";
        case "local":   return J94(K);   // local scope (env var aware)
        case "user":    return path.join(home(), "agent-memory", K) + "/";
    }
}

// Nm9 - sanitizeAgentTypeName: A.replace(/:/g, "-")
// J94 - getLocalScopeMemoryDir:
//   if (CLAUDE_CODE_REMOTE_MEMORY_DIR) → {remote}/projects/{hash}/agent-memory-local/{K}/
//   else → {cwd}/.claude/agent-memory-local/{K}/
```

**Path matrix by scope:**

| Scope | Path pattern | Example |
|-------|-------------|---------|
| `"user"` | `~/.claude/agent-memory/{type}/` | `~/.claude/agent-memory/code-reviewer/` |
| `"project"` | `{cwd}/.claude/agent-memory/{type}/` | `.claude/agent-memory/code-reviewer/` |
| `"local"` | `{cwd}/.claude/agent-memory-local/{type}/` | `.claude/agent-memory-local/code-reviewer/` |
| `"local"` + remote | `{remote}/projects/{hash}/agent-memory-local/{type}/` | remote-dev path |

**Agent type sanitization**: `Nm9` replaces `:` with `-` in agentType. This handles agents with compound types like `"general-purpose"` → already safe, or hypothetical `"code:reviewer"` → `"code-reviewer"`.

### 3.4 Permission Bypass for Agent Memory

The `Mp6` bypass in `zo8` uses the SAME 4 path patterns as `GW6`:
```
GW6("user") → ~/.claude/agent-memory/{type}/    ← Mp6 pattern 1: ~/.claude/agent-memory/
GW6("project") → .claude/agent-memory/{type}/  ← Mp6 pattern 2: {cwd}/.claude/agent-memory/
GW6("local") → .claude/agent-memory-local/      ← Mp6 pattern 4: {cwd}/.claude/agent-memory-local/
GW6("local") + remote → {remote}/.../agent-memory-local/  ← Mp6 pattern 3: remote path
```

**This confirms the permission bypass is exactly scoped to what `GW6` can produce.** There's no accident here — `Mp6` was designed to match the output of `GW6` for all scope values.

### 3.5 Memory Instructions Content Structure

Both `Q14` (classic) and `d14` (typed) load the current MEMORY.md content and embed it in the instructions:

```javascript
// Q14 / d14 — both read MEMORY.md at system prompt build time:
let _ = K + "MEMORY.md";   // K = memoryDir
try {
    w = fs.readFileSync(_, { encoding: "utf-8" })
} catch {}

// Then include it:
O.push("## MEMORY.md", "", J);  // J = truncated content (≤200 lines)
```

**This means agent memory MEMORY.md is read on every system prompt build** (when `B8q` cache misses). Unlike `vO()` which uses `e1()` lazy memoization, `m36`/`Q14`/`d14` read MEMORY.md on each cache miss. The component IS cached via `AF` + `B8q`, but cache invalidation happens when system prompt context changes.

---

## 4. `cv9` → @Include Resolution → `Sk` Recursive Loading

### 4.1 `cv9` — parseAtMentions

```javascript
// ============================================
// cv9 - parseAtMentions
// Location: chunks.84.mjs:536
// ============================================

// ORIGINAL:
function cv9(A, q) {
    let K = new Set,
        z = new tW({ gfm: false }).lex(A);   // tW = marked.js Lexer

    function _(w) {
        for (let O of w) {
            if (O.type === "code" || O.type === "codespan") continue;  // skip code blocks!
            if (O.type === "text") {
                let $ = O.text || "",
                    H = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g,   // @word regex
                    j;
                while ((j = H.exec($)) !== null) {
                    let J = j[1];
                    if (!J) continue;
                    let M = J.indexOf("#");
                    if (M !== -1) J = J.substring(0, M);   // strip #anchor
                    if (!J) continue;
                    if (J = J.replace(/\\ /g, " "), J) {
                        // Only accept path-like references:
                        if (J.startsWith("./") || J.startsWith("~/") ||
                            J.startsWith("/") && J !== "/" ||
                            !J.startsWith("@") && !J.match(/^[#%^&*()]+/) && J.match(/^[a-zA-Z0-9._-]/)) {
                            let X = L4(J, XF6(q));   // resolve relative to q (file's directory)
                            K.add(X)
                        }
                    }
                }
            }
            if (O.tokens) _(O.tokens);   // recurse into nested tokens
            if (O.items) _(O.items)      // recurse into list items
        }
    }
    return _(z), [...K]
}

// Mapping: cv9→parseAtMentions, A→content, q→parentDir,
//          tW→markedLexer, L4→resolvePath, XF6→getDirectoryOf
```

**What `cv9` does:**
1. Parses markdown content using `marked.js` lexer (not raw text)
2. Extracts `@reference` patterns from text nodes
3. **Skips code blocks** — `@mentions` in `` `code` `` or ` ```code``` ` are ignored
4. Strips `#anchor` suffixes (`@file.md#section` → `@file.md`)
5. Handles escaped spaces (`@path\ with\ spaces` → `@path with spaces`)
6. Resolves paths relative to parent file's directory via `L4(J, XF6(q))`
7. Filters to only path-like patterns (must start with `./`, `~/`, `/`, or `[a-zA-Z0-9._-]`)

**Why use the markdown lexer?** Naive string parsing would extract `@mentions` from within code examples. Using `marked.js` lets the parser skip code blocks automatically, preventing false includes.

### 4.2 `Sk` — Recursive CLAUDE.md Loader

```javascript
// ============================================
// Sk - loadClaudeFileWithIncludes
// Location: chunks.84.mjs:602
// ============================================

// ORIGINAL:
function Sk(A, q, K, Y, z = 0, _) {
    let w = $$(A);             // canonical path (hash key)
    if (K.has(w) || z >= lv9) return [];   // lv9 = 5 (max depth)
    if (iv9(A, q)) return [];  // excluded by claudeMdExcludes setting

    let { resolvedPath: O, isSymlink: $ } = qO($1(), A);
    if (K.add(w), $) K.add($$(O));  // track both symlink and target to prevent loops

    let H = xD1(A, q);  // load file content
    if (!H || !H.content.trim()) return [];
    if (_) H.parent = _;   // track parent for telemetry

    let j = [];
    j.push(H);   // add this file first

    let J = cv9(H.content, O);   // extract @includes from content
    for (let M of J) {
        if (!r14(M) && !Y) continue;   // r14 = isInWorkingDirectory; Y = includeExternal
        let X = Sk(M, q, K, Y, z + 1, A);   // recurse with depth+1
        j.push(...X)
    }
    return j   // this file + all transitively included files
}

// Mapping: Sk→loadClaudeFileWithIncludes, A→filePath, q→fileType, K→processedPaths,
//          Y→includeExternal, z→depth, _→parentPath,
//          lv9→MAX_INCLUDE_DEPTH(5), iv9→isExcluded, xD1→loadFileWithTruncation
```

**Algorithm:**
1. Check `processedPaths` set (dedup) and depth limit (5) — prevent infinite recursion
2. Check `claudeMdExcludes` setting — allow users to block certain paths
3. Resolve symlinks and track both paths (prevents symlink loops)
4. Load the file via `xD1` (with 200-line truncation)
5. Parse `@includes` via `cv9`
6. For each include: only recurse if in working directory OR `includeExternal=true`
7. Return: this file first, then all transitively included files (depth-first)

**Depth limit = 5**: Prevents malicious/accidental circular include chains. A CLAUDE.md including another that includes another... stops at depth 5.

**`r14` (isInWorkingDirectory) guard**: External file includes (`@/absolute/path`) are only followed when `includeExternal=true`. By default (for Project/Local types), includes must be within the current working directory. This prevents CLAUDE.md files from accidentally exfiltrating system files via `@/etc/passwd`.

### 4.3 `Xt` — Rules Directory Scanner

```javascript
// ============================================
// Xt - loadRulesDirFiles
// Location: chunks.84.mjs:625
// ============================================

// ORIGINAL:
function Xt({ rulesDir: A, type: q, processedPaths: K, includeExternal: Y, conditionalRule: z, visitedDirs: _ = new Set }) {
    if (_.has(A)) return [];
    try {
        let w = $1(), { resolvedPath: O, isSymlink: $ } = qO(w, A);
        if (_.add(A), $) _.add(O);

        let j = w.readdirSync(O);   // list directory contents

        for (let J of j) {
            let M = path.join(A, J.name),
                W = /* is directory? */ J.isDirectory(),
                Z = /* is file? */ J.isFile();

            if (W) Xt({ rulesDir: D, type: q, processedPaths: K, ... });  // recurse into subdirs
            else if (Z && J.name.endsWith(".md")) {
                let G = Sk(D, q, K, Y);   // load .md file with includes
                H.push(...G.filter((f) => z ? f.globs : !f.globs))  // conditional vs unconditional
            }
        }
        return H
    } catch (w) { ... }
}

// Mapping: Xt→loadRulesDirFiles, conditionalRule→z (true=glob-based rules, false=always-active)
```

**How `Xt` is used:**
- Scans a `.claude/` directory (or rules dir) for all `.md` files
- Recurses into subdirectories
- `conditionalRule=true` → only load files with `globs` frontmatter (conditional rules)
- `conditionalRule=false` → only load files WITHOUT `globs` frontmatter (always-active rules)

This separation allows agents to have both project-wide rules and path-specific conditional rules in the same `.claude/` directory.

### 4.4 Integration: How @Includes Flow into nested_memory

The connection from `cv9` → `Sk` → to actual message injection:

```
User reads @file.md in their CLAUDE.md:
```

```
CLAUDE.md content:
  "For details on our patterns, see @patterns.md"
                                    │
cv9(content, dir) extracts "patterns.md" path
                                    │
                                    ▼
Sk("patterns.md", "Project", processedPaths, false)
                                    │
                                    ├─ Loads patterns.md content (via xD1)
                                    ├─ Parses patterns.md for MORE @includes
                                    └─ Returns [patternsFile, ...transitiveIncludes]
                                    │
                                    ▼
sF8([patternsFile, ...], ctx, triggerPath)
                                    │
                                    ├─ Not in readFileState? → Create nested_memory attachment
                                    │   { type: "nested_memory", path, content, displayPath }
                                    │
                                    └─ Add to readFileState (dedup for future turns)
```

**But wait — how does `Sk` get called for CLAUDE.md @includes?** The path is:
- `if8(triggerPath, processedPaths)` → calls `PF6` → calls `Sk` for User/Managed rules
- `nf8(nestedDir, triggerPath, processedPaths)` → calls `Sk` for Project rules (including CLAUDE.md files)

Both `if8` and `nf8` are called inside `Yqq` (the triggered-path processor). So the full chain is:

```
nestedMemoryAttachmentTriggers.add(path)  [Read tool]
        ↓
IuY → Yqq(path)
        ↓
nf8(nestedDir, path, processedPaths)
        ↓
Sk("CLAUDE.md", "Project", K, false)
        ↓
cv9(content, dir) → finds @patterns.md
        ↓
Sk("patterns.md", "Project", K, false, depth=1, parent="CLAUDE.md")
        ↓
sF8([CLAUDE.md, patterns.md], ctx, path)
        ↓
Injects both as nested_memory (if not already in readFileState)
```

### 4.5 `if8` and `nf8` — Rule Loading Functions

```javascript
// if8 - loadManagedAndUserRules (chunks.84.mjs:702):
function if8(A, q) {   // A = trigger file path, q = processedPaths
    let K = [],
        Y = BD1();   // getManagedRulesDir
    if (K.push(...PF6(A, Y, "Managed", q, false)), SH("userSettings")) {
        let z = gD1();   // getUserRulesDir
        K.push(...PF6(A, z, "User", q, true))
    }
    return K
}

// nf8 - loadProjectRules (chunks.84.mjs:712):
function nf8(A, q, K) {   // A = nestedDir, q = triggerPath, K = processedPaths
    let Y = [];
    if (SH("projectSettings")) {
        // Standard CLAUDE.md locations:
        let w = path.join(A, "CLAUDE.md");
        Y.push(...Sk(w, "Project", K, false));   // direct CLAUDE.md

        let O = path.join(A, ".claude", "CLAUDE.md");
        Y.push(...Sk(O, "Project", K, false))   // .claude/CLAUDE.md
    }
    // ...also handles conditional rules and local rules
    return Y
}
```

**Two file loading patterns:**
1. `Sk(path, type, K, false)` — loads a SINGLE file (with @include recursion)
2. `Xt({rulesDir, type, ...})` — loads an ENTIRE DIRECTORY (scanning all .md files)

User/Managed rules use `Xt` (directory-based), while Project/Local rules use both direct `Sk` (for standard locations) and `Xt` (for `.claude/` directories).

---

## 5. Symbols Added to Symbol Index

New symbols discovered and verified in this document:

### `symbol_index_core_features.md` additions

**Auto Memory — Extraction Subagent:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cmY` | `createExtractMemoriesModule` | chunks.148.mjs:508 | function |
| `vKq` | `executeExtractMemories` | chunks.148.mjs:580 | function |
| `lmY` | `triggerExtractMemories` | chunks.148.mjs:599 | function |
| `av` | `runForkedAgent` | chunks.148.mjs:2026 | function |
| `Bc6` | `buildForkedToolContext` | chunks.148.mjs:1978 | function |
| `Fb` | `buildCacheSafeParams` | chunks.148.mjs:1924 | function |
| `QmY` | `countMessagesSince` | chunks.148.mjs:427 | function |
| `UmY` | `didConversationWriteMemory` | chunks.148.mjs:442 | function |
| `fKq` | `buildMemoryToolFilter` | chunks.148.mjs:460 | function |
| `TKq` | `extractFilePathFromToolUse` | chunks.148.mjs:484 | function |
| `dmY` | `extractWrittenPaths` | chunks.148.mjs:494 | function |
| `Np8` | `isUserOrAssistantMessage` | chunks.148.mjs:423 | function |

**Auto Memory — Prompt Variants:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `xv9` | `buildPassiveMemoryPrompt` | chunks.84.mjs:329 | function |
| `uv9` | `buildClassicAutoMemoryPrompt` | chunks.84.mjs:367 | function |
| `U14` | `buildTypedMemoryInstructions` | chunks.84.mjs:324 | function |
| `d14` | `buildTypedAgentMemoryPrompt` | chunks.84.mjs:333 | function |
| `Q14` | `buildClassicAgentMemoryPrompt` | chunks.84.mjs:290 | function |

**Auto Memory — CLAUDE.md Include Resolution:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Sk` | `loadClaudeFileWithIncludes` | chunks.84.mjs:602 | function |
| `Xt` | `loadRulesDirFiles` | chunks.84.mjs:625 | function |
| `if8` | `loadManagedAndUserRules` | chunks.84.mjs:702 | function |
| `nf8` | `loadProjectRules` | chunks.84.mjs:712 | function |
| `iv9` | `isClaudeFileExcluded` | chunks.84.mjs:570 | function |
| `lv9` | `MAX_INCLUDE_DEPTH` | chunks.84.mjs:809 | constant |

**Agent Memory:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `m36` | `buildAgentMemoryInstructions` | chunks.90.mjs:896 | function |
| `GW6` | `getAgentMemoryDir` | chunks.90.mjs:860 | function |
| `Nm9` | `sanitizeAgentTypeName` | chunks.90.mjs:851 | function |
| `J94` | `getLocalScopeMemoryDir` | chunks.90.mjs:855 | function |
| `LP1` | `describeMemoryScope` | chunks.90.mjs:883 | function |

---

## 6. Key Insights and Cross-Validation Corrections

### 6.1 `tengu_passport_quail` Controls Two Separate Behaviors

**Discovery**: `tengu_passport_quail` appears in TWO places:
1. `ID1()` at chunks.84.mjs:400 — selects `xv9` (passive prompt, no direct writes)
2. `vKq` at chunks.148.mjs:582 — enables the extraction subagent

Both checks must be consistent: when `tengu_passport_quail=true`, the main agent is told NOT to write memories (`xv9`) AND the extraction subagent IS enabled (`vKq`). If only one side were flipped, you'd get a conflict (agent told not to write + no extraction subagent = memories never saved; or agent told not to write + extraction runs = redundant extraction attempts).

### 6.2 Extraction Subagent Uses FULL Conversation History (Not Just Recent Messages)

The `Fb(w).forkContextMessages = A.messages` passes ALL messages to `av`. The `sE1(J)` instruction says "analyze the most recent ~J messages" but the full history is in context. This means:
- The subagent can reference earlier messages for disambiguation
- Token cost is proportional to full conversation length, not just `J`
- Cache can be warmed by the main conversation's system prompt (same system prompt)

### 6.3 Trailing Run Prevents Lost Extractions

If a long-running extraction is in progress when the conversation ends, the next `vKq` call would stash the context. The `isTrailingRun: true` path skips the throttle check (`Y` counter not incremented), ensuring the trailing run always executes regardless of the throttle state.

### 6.4 `@include` Depth Limit Is 5, Not Unlimited

`lv9 = 5` at chunks.84.mjs:809. CLAUDE.md → @a.md → @b.md → @c.md → @d.md → @e.md stops here. Deeper includes are silently ignored (return `[]`). This is a safety limit, not an error.

### 6.5 Code Blocks Are @-Include-Safe

`cv9` uses the `marked.js` lexer specifically to skip `code` and `codespan` token types. This means:
```markdown
Example: `@file.md` should not be included
```bash
@file.md also safe
\```
```
None of these trigger actual includes. Only `@file.md` in regular prose triggers loading.
