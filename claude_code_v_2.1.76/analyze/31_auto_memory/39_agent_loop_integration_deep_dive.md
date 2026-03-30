# Auto Memory: Agent Loop Integration Deep Dive

## Overview

This document provides source-level analysis of how Auto Memory integrates into the agent loop, focusing on three critical mechanisms:

1. **System Prompt Component Architecture** — how memory is injected into the system prompt, including the caching mechanism
2. **Relevant Memories Pipeline** — concurrent memory search and post-turn injection via `zqq` / `buY`
3. **Anti-Deduplication Filter** — how `_qq` prevents redundant memory injection

**Version**: Claude Code v2.1.76
**Verified**: 2026-03-29 — All symbols cross-validated against source

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `getAutoMemory` (`ID1`) - Main async entry point (chunks.84.mjs:382)
- `createSystemPromptComponent` (`AF`) - Wraps memory in system prompt component (chunks.144.mjs:1726)
- `evaluateSystemPromptComponents` (`B8q`) - Evaluates and caches components (chunks.144.mjs:1413)
- `getSystemPromptCache` (`ou1`) - Returns the session-level component cache (chunks.1.mjs:3111)
- `setSystemPromptCache` (`au1`) - Writes a component value to cache (chunks.1.mjs:3115)
- `clearSystemPromptCache` (`su1` / `RT6`) - Clears cache on context change (chunks.1.mjs:3119, chunks.144.mjs:1751)
- `buildSystemPrompt` (`R0`) - Main system prompt builder (chunks.168.mjs:2143)
- `getRelevantMemoriesTrigger` (`zqq`) - Starts concurrent memory search (chunks.147.mjs:592)
- `produceRelevantMemories` (`buY`) - Produces relevant memory attachments (chunks.147.mjs:552)
- `filterAlreadyReadMemories` (`_qq`) - Removes redundant memories (chunks.147.mjs:637)
- `getRecentSuccessfulToolNames` (`uuY`) - Extracts recent tool context (chunks.147.mjs:373262)
- `isCoworkMode` (`Oz1`) - Checks CLAUDE_COWORK_MEMORY_PATH_OVERRIDE (chunks.50.mjs:2439)

---

## 1. System Prompt Component Architecture

### 1.1 Correction: Memory Registration Key is `"memory"`, NOT `"auto_memory"`

The existing analysis (architecture.md, README.md, cross_module_integration.md) states:
> "Memory registered as `auto_memory` dynamic variable"

**This is incorrect.** The actual source code in `chunks.168.mjs:2153` shows:

```javascript
// ============================================
// buildSystemPrompt - Main system prompt builder
// Location: chunks.168.mjs:2143-2164
// ============================================

// ORIGINAL (for source lookup):
async function R0(A, q, K, Y) {
    if (t6(process.env.CLAUDE_CODE_SIMPLE)) return [`You are Claude Code...`];
    let z = G1(),
        [_, w, O] = await Promise.all([NR(z), IZq(), RZq(q, K)]),
        $ = mA(),
        H = new Set(A.map((M) => M.name)),
        j = [AF("memory", () => ID1()),       // ← KEY IS "memory" NOT "auto_memory"
             AF("ant_model_override", () => J5z()),
             AF("env_info_simple", () => RZq(q, K)),
             AF("language", () => M5z($.language)),
             AF("output_style", () => D5z(w)),
             m8q("mcp_instructions", () => iT6() ? null : X5z(Y), "..."),
             AF("scratchpad", () => E5z()),
             AF("frc", () => y5z(q)),
             AF("summarize_tool_results", () => L5z),
             AF("brief", () => R5z())],
        J = await B8q(j);
    return [P5z(w), W5z(H), w?.keepCodingInstructions === !0 ? Z5z() : null,
            G5z(), f5z(H, _), N5z(), v5z(), ...cache_break_sections..., ...J].filter((M) => M !== null)
}

// READABLE (for understanding):
async function buildSystemPrompt(tools, modelOptions, additionalDirs, mcpClients) {
    if (isTruthy(process.env.CLAUDE_CODE_SIMPLE)) return [simplePrompt()];
    const cwd = getCwd();
    const [claudeMdFiles, outputStyle, envInfo] = await Promise.all([...]);
    const settings = getUserSettings();
    const toolNames = new Set(tools.map(t => t.name));

    // System prompt COMPONENTS — evaluated and cached
    const components = [
        createStaticComponent("memory", () => getAutoMemory()),       // ← "memory"
        createStaticComponent("ant_model_override", () => getModelOverride()),
        createStaticComponent("env_info_simple", () => getEnvInfo(...)),
        createStaticComponent("language", () => getLanguageSetting(settings.language)),
        createStaticComponent("output_style", () => getOutputStylePrompt(outputStyle)),
        createCacheBreakingComponent("mcp_instructions", () => getMcpInstructions(...)),
        createStaticComponent("scratchpad", () => getScratchpadSection()),
        createStaticComponent("frc", () => getFrequentlyRefreshedContext(modelOptions)),
        createStaticComponent("summarize_tool_results", () => getSummarizeSection),
        createStaticComponent("brief", () => getBriefSection()),
    ];
    const evaluatedComponents = await evaluateSystemPromptComponents(components);
    return [...staticSections, ...evaluatedComponents].filter(s => s !== null);
}

// Mapping: R0→buildSystemPrompt, AF→createStaticComponent, m8q→createCacheBreakingComponent,
//          B8q→evaluateSystemPromptComponents, ID1→getAutoMemory
```

---

### 1.2 Correction: Memory IS Cached — Not Re-Read Every Turn

The existing analysis (architecture.md section 7.3) states:
> "Disk Read Every Turn — No caching"
> "Always fresh: Captures latest changes immediately"

**This is incorrect.** Memory content is cached at the session level via `v1.systemPromptSectionCache`.

```javascript
// ============================================
// createSystemPromptComponent - Create non-cache-breaking component
// Location: chunks.144.mjs:1726-1731
// ============================================

// ORIGINAL (for source lookup):
function AF(A, q) {
    return { name: A, compute: q, cacheBreak: !1 }
}

// ============================================
// createCacheBreakingComponent - Create cache-breaking component
// Location: chunks.144.mjs:1406-1411
// ============================================

// ORIGINAL (for source lookup):
function m8q(A, q, K) {
    return { name: A, compute: q, cacheBreak: !0 }
}

// ============================================
// evaluateSystemPromptComponents - Evaluate and cache components
// Location: chunks.144.mjs:1413-1422
// ============================================

// ORIGINAL (for source lookup):
async function B8q(A) {
    let q = ou1();
    return Promise.all(A.map(async (K) => {
        if (!K.cacheBreak && q.has(K.name)) return q.get(K.name) ?? null;
        let Y = await K.compute();
        return au1(K.name, Y), Y
    }))
}

// READABLE (for understanding):
async function evaluateSystemPromptComponents(components) {
    const cache = getSystemPromptCache();
    return Promise.all(components.map(async (component) => {
        // If component is NOT cache-breaking AND already cached → return cached value
        if (!component.cacheBreak && cache.has(component.name)) {
            return cache.get(component.name) ?? null;
        }
        // Otherwise compute and cache
        const value = await component.compute();
        setSystemPromptCache(component.name, value);
        return value;
    }));
}

// Mapping: B8q→evaluateSystemPromptComponents, ou1→getSystemPromptCache,
//          au1→setSystemPromptCache, AF→createStaticComponent

// ============================================
// Cache Storage — Session-Level Map
// Location: chunks.1.mjs:3111-3120
// ============================================

// ORIGINAL (for source lookup):
function ou1() { return v1.systemPromptSectionCache }
function au1(A, q) { v1.systemPromptSectionCache.set(A, q) }
function su1() { v1.systemPromptSectionCache.clear() }

// v1.systemPromptSectionCache is initialized as `new Map` on session start (chunks.1.mjs:2327)
```

**How it works:**

Since `AF("memory", () => ID1())` creates a component with `cacheBreak: false`, the first evaluation of `ID1()` caches the memory content under key `"memory"` in `v1.systemPromptSectionCache`. All subsequent turns reuse the cached value — `ID1()` is NOT called again.

**Cache lifetime:**

The cache persists for the entire session unless explicitly cleared by `RT6()` (`clearSystemPromptCache`):

```javascript
// ============================================
// clearSystemPromptCache - Invalidates all component caches
// Location: chunks.144.mjs:1751-1753
// ============================================

function RT6() { su1() }

// Called when:
// 1. Worktree created (chunks.144.mjs:1832) — new working directory
// 2. Worktree/context reset (chunks.144.mjs:1939) — exiting worktree
// 3. Session reset via gl() (chunks.147.mjs:2552) — full session clear
//    gl() also clears: conversation history, file state, telemetry, compact state
```

**Correct design understanding:**

```
Session Start
│
├─ Turn 1: buildSystemPrompt() → B8q() → cache miss → ID1() called → MEMORY.md read from disk
│          memory content cached in v1.systemPromptSectionCache["memory"]
│
├─ Turn 2: buildSystemPrompt() → B8q() → cache HIT → cached value returned (no disk read)
│
├─ Turn 3: Same as Turn 2
│
├─ ...
│
└─ Context Change (worktree/session reset) → RT6() → cache cleared
           Next turn will re-read MEMORY.md from disk
```

**Why cached (design rationale):**
- MEMORY.md changes should require explicit agent action (Write/Edit tool)
- Performance: avoids repeated disk I/O for unchanged content
- Consistency: prevents partial state if MEMORY.md is being written mid-session
- The `relevant_memories` dynamic path (via `zqq`) provides fresh per-turn memory content for semantic lookup

---

## 2. Relevant Memories Pipeline (Dynamic Path)

While the static memory component is cached, the `relevant_memories` mechanism provides **fresh memory content each turn** using semantic search. This is the TRUE per-turn memory mechanism.

### 2.1 Feature Flag Gate

`zqq` is gated by `tengu_moth_copse`:

```javascript
// ============================================
// getRelevantMemoriesTrigger - Gate and launch async memory search
// Location: chunks.147.mjs:592-601
// ============================================

// ORIGINAL (for source lookup):
function zqq(A, q) {
    if (!Z3() || !w8("tengu_moth_copse", !1)) return;
    let K = A.findLast((z) => z.type === "user" && !z.isMeta);
    if (!K) return;
    let Y = Fg(K);
    if (!Y || !/\s/.test(Y.trim())) return;
    return buY(Y, q.options.agentDefinitions.activeAgents, q.readFileState, uuY(A, K)).catch((z) => {
        return _6(z), []
    })
}

// READABLE (for understanding):
function getRelevantMemoriesTrigger(messages, agentContext) {
    // Dual gate: must be enabled AND have feature flag
    if (!isAutoMemoryEnabled() || !getFeatureFlag("tengu_moth_copse", false)) return;

    // Find last real user message (not meta messages)
    const lastUserMsg = messages.findLast(m => m.type === "user" && !m.isMeta);
    if (!lastUserMsg) return;

    // Extract text content from message
    const text = extractTextContent(lastUserMsg);
    // Reject single-word queries (require meaningful multi-word input)
    if (!text || !/\s/.test(text.trim())) return;

    // Launch async memory search with recent tool context
    const recentSuccessfulTools = getRecentSuccessfulToolNames(messages, lastUserMsg);
    return produceRelevantMemories(
        text,
        agentContext.options.agentDefinitions.activeAgents,
        agentContext.readFileState,
        recentSuccessfulTools
    ).catch(err => { logError(err); return []; });
}

// Mapping: zqq→getRelevantMemoriesTrigger, Z3→isAutoMemoryEnabled, w8→getFeatureFlag,
//          Fg→extractTextContent, buY→produceRelevantMemories, uuY→getRecentSuccessfulToolNames,
//          _6→logError
```

### 2.2 Concurrent Execution in Agent Loop

```javascript
// ============================================
// Agent Loop — zqq launched concurrently with LLM request
// Location: chunks.148.mjs:916
// ============================================

// ORIGINAL (for source lookup):
let L = zqq(P, X), h = hp8?.startSkillDiscoveryPrefetch(null, P, X);
// ... LLM request proceeds ...
// After LLM response and tool results:
if (L) {
    let D6 = _qq(await L, H6);
    for (let Q6 of D6) {
        let k6 = f4(Q6);
        yield k6, Y6.push(k6)
    }
}

// READABLE (for understanding):
// At turn start: launch memory search concurrently
const relevantMemoriesPromise = getRelevantMemoriesTrigger(messages, agentContext);
const skillPrefetchHandle = skillDiscovery?.startPrefetch(...);

// ... LLM processes and returns tool use ...
// ... Agent processes tool results (Vf6) ...

// After tool processing: collect memory results
if (relevantMemoriesPromise) {
    const relevantMemories = filterAlreadyReadMemories(await relevantMemoriesPromise, toolUses);
    for (const attachment of relevantMemories) {
        const msg = wrapAsAttachmentMessage(attachment);
        yield msg;
        toolResults.push(msg);
    }
}
```

**Key design insight:** Memory search is launched **concurrently with the LLM request**. By the time tool results are processed, the search is already complete or nearly complete — no additional latency. Memory content is injected as **user messages** (with `isMeta: true`) AFTER the current turn's tool results, providing context for the NEXT turn.

### 2.3 Recent Tool Context for Memory Search

```javascript
// ============================================
// getRecentSuccessfulToolNames - Extract tool context for memory selection
// Location: chunks.147.mjs:373262
// ============================================

// ORIGINAL (for source lookup):
function uuY(A, q) {
    let K = new Map, Y = new Map;
    for (let w = A.length - 1; w >= 0; w--) {
        let O = A[w];
        if (!O) continue;
        if (O.type === "user" && !O.isMeta && O !== q) break;
        if (O.type === "assistant" && typeof O.message.content !== "string") {
            for (let $ of O.message.content)
                if ($.type === "tool_use") K.set($.id, $.name)
        } else if (O.type === "user" && "message" in O && Array.isArray(O.message.content)) {
            for (let $ of O.message.content)
                if (xuY($)) Y.set($.tool_use_id, $.is_error === !0)
        }
    }
    let z = new Set, _ = new Set;
    for (let [w, O] of K) {
        let $ = Y.get(w);
        if ($ === void 0) continue;
        if ($) z.add(O); else _.add(O)
    }
    return [..._].filter((w) => !z.has(w))
}

// READABLE (for understanding):
function getRecentSuccessfulToolNames(messages, lastUserMessage) {
    const toolUseMap = new Map();   // tool_use_id → tool_name
    const toolResultMap = new Map(); // tool_use_id → is_error

    // Walk backwards through messages until the previous user message
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (!msg) continue;
        if (msg.type === "user" && !msg.isMeta && msg !== lastUserMessage) break;

        if (msg.type === "assistant" && Array.isArray(msg.message.content)) {
            for (const block of msg.message.content) {
                if (block.type === "tool_use") toolUseMap.set(block.id, block.name);
            }
        } else if (msg.type === "user" && Array.isArray(msg.message?.content)) {
            for (const block of msg.message.content) {
                if (isToolResult(block)) toolResultMap.set(block.tool_use_id, block.is_error === true);
            }
        }
    }

    // Collect successful tool names (error tools excluded)
    const failedTools = new Set();
    const succeededTools = new Set();
    for (const [id, name] of toolUseMap) {
        const wasError = toolResultMap.get(id);
        if (wasError === undefined) continue;
        if (wasError) failedTools.add(name); else succeededTools.add(name);
    }
    return [...succeededTools].filter(name => !failedTools.has(name));
}

// Mapping: uuY→getRecentSuccessfulToolNames, xuY→isToolResult
```

**What it does:** Collects the names of tools that succeeded in the previous turn (e.g., `["Read", "Bash", "Grep"]`). These are passed to `selectMemoriesWithLLM` as additional context so the LLM can select memory files that are relevant to the tools being used.

**Why this matters:** If the agent just ran `Bash` and `Grep`, it's likely working on code execution. The LLM can select memory files about code conventions rather than user preferences.

---

## 3. Anti-Deduplication Filter: `_qq` (filterAlreadyReadMemories)

This mechanism prevents the agent from receiving memory content that it already read via the `Read` tool in the current turn.

```javascript
// ============================================
// filterAlreadyReadMemories - Remove memories already read this turn
// Location: chunks.147.mjs:637-651
// ============================================

// ORIGINAL (for source lookup):
function _qq(A, q) {
    let K = new Set(q.filter((Y) => z3(Y, s7)).map((Y) => muY(Y.input) ? Y.input.file_path : void 0).filter((Y) => Y !== void 0));
    if (K.size === 0) return A;
    return A.map((Y) => {
        if (Y.type !== "relevant_memories") return Y;
        let z = Y.memories.filter((_) => !K.has(_.path));
        return z.length > 0 ? { ...Y, memories: z } : null
    }).filter((Y) => Y !== null)
}

// READABLE (for understanding):
function filterAlreadyReadMemories(attachments, toolUses) {
    // Collect file paths that were READ via the Read tool this turn
    const readFilePaths = new Set(
        toolUses
            .filter(tool => matchesTool(tool, READ_TOOL))  // only Read tool calls
            .map(tool => hasFilePath(tool.input) ? tool.input.file_path : undefined)
            .filter(path => path !== undefined)
    );

    if (readFilePaths.size === 0) return attachments;  // Nothing to filter

    // Remove memories whose files were already read
    return attachments.map(attachment => {
        if (attachment.type !== "relevant_memories") return attachment;

        const filteredMemories = attachment.memories.filter(
            memory => !readFilePaths.has(memory.path)
        );

        // Return null if all memories were filtered (cleaned up below)
        return filteredMemories.length > 0 ? { ...attachment, memories: filteredMemories } : null;
    }).filter(a => a !== null);
}

// Mapping: _qq→filterAlreadyReadMemories, z3→matchesTool, s7→READ_TOOL_NAME,
//          muY→hasFilePath
```

**Design rationale:** If the agent just read `debugging.md` via the `Read` tool, there's no point injecting it again as a `relevant_memories` attachment — that would waste context tokens with duplicate content.

---

## 4. Complete Memory Flow: Turn-by-Turn Diagram

```
Session Start
│
├─ Turn 1: User sends message
│   │
│   ├─ [CONCURRENT] L = zqq(messages, ctx)  ← starts memory search asynchronously
│   │       │ Gate: Z3() && tengu_moth_copse
│   │       │ Extract: last non-meta user message text
│   │       │ Context: uuY() → recent successful tool names
│   │       └─ buY() → a4q() semantic search (5s timeout)
│   │           ├─ AuY() → list .md files (sorted by mtime, max 200)
│   │           └─ quY() → LLM selects relevant files
│   │
│   ├─ buildSystemPrompt() → B8q()
│   │   ├─ cache MISS for "memory" → ID1() called
│   │   │   ├─ isAutoMemoryEnabled()
│   │   │   ├─ ensureMemoryDirExists()
│   │   │   └─ buildAutoMemoryPromptSimple() or buildMemoryIndex()
│   │   └─ cached in v1.systemPromptSectionCache["memory"]
│   │
│   ├─ LLM API call with system prompt (includes MEMORY.md content)
│   │
│   ├─ Agent processes response (may use Read tool on memory files)
│   │
│   └─ After tool results: await L
│       ├─ _qq() filters memories already read this turn
│       └─ Inject remaining relevant_memories as user messages (isMeta: true)
│           → normalizeAttachmentForAPI(Ui8) wraps in <system-reminder> tags
│
├─ Turn 2: User sends message
│   │
│   ├─ [CONCURRENT] zqq() → new memory search (fresh query)
│   │
│   ├─ buildSystemPrompt() → B8q()
│   │   └─ cache HIT for "memory" → returns cached MEMORY.md content
│   │       (NO disk read unless MEMORY.md was written this turn)
│   │
│   ├─ System prompt includes:
│   │   ├─ Cached MEMORY.md from Turn 1 (static path)
│   │   └─ relevant_memories injected after Turn 1 (dynamic path)
│   │
│   └─ [Same pattern continues...]
│
└─ Context Change (worktree/session reset) → RT6() clears cache
    Next turn re-reads MEMORY.md from disk
```

---

## 5. Permission Bypass: Cowork Mode Distinction

There is an important nuance in the write permission bypass for memory files.

```javascript
// ============================================
// isCoworkMode - Check if CLAUDE_COWORK_MEMORY_PATH_OVERRIDE is active
// Location: chunks.50.mjs:2439-2441
// ============================================

// ORIGINAL (for source lookup):
function Oz1() {
    return UJ7() !== void 0
}

// READABLE (for understanding):
function isCoworkMode() {
    return getCoworkMemoryPathOverride() !== undefined;
    // Returns true when CLAUDE_COWORK_MEMORY_PATH_OVERRIDE env var is set
}

// Mapping: Oz1→isCoworkMode, UJ7→getCoworkMemoryPathOverride
```

```javascript
// ============================================
// Write Permission Bypass — Memory Files
// Location: chunks.177.mjs:1013-1033
// ============================================

// ORIGINAL (for source lookup):
if (!Oz1() && Da(K)) return {
    behavior: "allow",
    updatedInput: q,
    decisionReason: { type: "other", reason: "auto memory files are allowed for writing" }
};
return { behavior: "passthrough", message: "" }

// READABLE (for understanding):
// Allow write to auto memory files ONLY when NOT in cowork mode
if (!isCoworkMode() && isAutoMemoryPath(filePath)) {
    return {
        behavior: "allow",
        reason: "auto memory files are allowed for writing"
    };
}
// In cowork mode: memory path is a shared remote path, permission may be handled differently
return { behavior: "passthrough" };  // Falls through to normal permission check
```

**What this means:**
- **Normal mode** (`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` not set): Memory files bypass permission check — agent can freely write
- **Cowork mode** (`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` set): Permission check is NOT bypassed for auto-memory path — falls through to regular permission handling

**Why this distinction:** In cowork mode, the memory path is shared across users (remote path). Bypassing permissions for a shared remote path would be unsafe — other users might have files in that directory that shouldn't be freely writable.

---

## 6. System Prompt Content Collector: `lf8` (buildSystemPromptContent)

The `lf8` function collects ALL CLAUDE.md-type files (including memory files) and formats them for the system prompt. This is the function that applies the special `<team-memory-content>` wrapping for team memory.

```javascript
// ============================================
// buildSystemPromptContent - Collect and format all CLAUDE.md-type files
// Location: chunks.84.mjs:800-820 (approximate)
// ============================================

// ORIGINAL (for source lookup):
lf8 = () => {
    let A = vO(),
        q = [],
        K = w8("tengu_paper_halyard", !1);
    for (let Y of A) {
        if (K && (Y.type === "Project" || Y.type === "Local")) continue;  // Filter gate
        if (Y.content) {
            let z = Y.type === "Project" ? " (project instructions, checked into the codebase)"
                  : Y.type === "Local" ? " (user's private project instructions, not checked in)"
                  : Y.type === "TeamMem" ? " (shared team memory, synced across the organization)"
                  : Y.type === "AutoMem" ? " (user's auto-memory, persists across conversations)"
                  : " (user's private global instructions for all projects)";
            if (Y.type === "TeamMem") q.push(`Contents of ${Y.path}${z}:\n\n<team-memory-content source="shared">\n${Y.content}\n</team-memory-content>`);
            else q.push(`Contents of ${Y.path}${z}:\n\n${Y.content}`)
        }
    }
    if (q.length === 0) return "";
    return `${Qv9}\n\n${q.join("\n\n")}`
}

// READABLE (for understanding):
function buildSystemPromptContent() {
    const allFiles = loadClaudeFiles();  // vO() - lazy-loaded array of all CLAUDE.md files
    const content = [];
    const filterProjectLocal = getFeatureFlag("tengu_paper_halyard", false);

    for (const file of allFiles) {
        // tengu_paper_halyard: exclude Project and Local scope files (only Global/User/AutoMem/TeamMem)
        if (filterProjectLocal && (file.type === "Project" || file.type === "Local")) continue;

        if (!file.content) continue;

        // Build context description based on file type
        const typeHint = {
            "Project": " (project instructions, checked into the codebase)",
            "Local": " (user's private project instructions, not checked in)",
            "TeamMem": " (shared team memory, synced across the organization)",
            "AutoMem": " (user's auto-memory, persists across conversations)",
        }[file.type] || " (user's private global instructions for all projects)";

        // Team memory gets special XML wrapping to identify shared content
        if (file.type === "TeamMem") {
            content.push(`Contents of ${file.path}${typeHint}:\n\n<team-memory-content source="shared">\n${file.content}\n</team-memory-content>`);
        } else {
            content.push(`Contents of ${file.path}${typeHint}:\n\n${file.content}`);
        }
    }

    if (content.length === 0) return "";
    return `${CODEBASE_INSTRUCTIONS_HEADER}\n\n${content.join("\n\n")}`;
}

// Mapping: lf8→buildSystemPromptContent, vO→loadClaudeFiles, w8→getFeatureFlag,
//          Qv9→CODEBASE_INSTRUCTIONS_HEADER = "Codebase and user instructions are shown below..."
//          tengu_paper_halyard: when true, filters out Project and Local type files
```

**File type taxonomy used by `lf8`:**

| Type | Source | Context Hint |
|------|--------|-------------|
| `Project` | `.claude/CLAUDE.md` in repo | `(project instructions, checked into the codebase)` |
| `Local` | `.claude/CLAUDE.local.md` | `(user's private project instructions, not checked in)` |
| `TeamMem` | Team memory MEMORY.md | `(shared team memory, synced across the organization)` |
| `AutoMem` | User memory MEMORY.md | `(user's auto-memory, persists across conversations)` |
| (Global) | `~/.claude/CLAUDE.md` | `(user's private global instructions for all projects)` |

**Special team memory XML wrapping:** Team memory content is wrapped in `<team-memory-content source="shared">` tags to clearly distinguish it from regular project instructions. This helps the LLM understand the provenance of different instruction sets.

---

## 7. Complete Feature Flag Decision Matrix

| Flag | Default | Effect |
|------|---------|--------|
| `tengu_coral_fern` | `false` | Enables search guidance section (`Dt`) in memory prompt |
| `tengu_herring_clock` | `false` | Enables team memory (`SD1` → `isTeamMemoryEnabled`) |
| `tengu_moth_copse` | `false` | Enables relevant memories per-turn search (`zqq`) |
| `tengu_paper_halyard` | `false` | Filters out Project/Local memory types from file collection |
| `tengu_passport_quail` | `false` | Background agent mode: read-only + extraction subagent |
| `tengu_swinburne_dune` | `false` | File-based memory format (typed/indexed) |

**Flag interaction diagram:**

```
User message arrives
│
├─ tengu_moth_copse=true?
│   YES → zqq() → concurrent memory search
│   NO  → no per-turn memory search
│
├─ Building system prompt for memory section:
│   ├─ SD1(tengu_herring_clock)?
│   │   YES → Dual memory (user + team):
│   │         ├─ tengu_passport_quail? → bv9() extract mode combined
│   │         ├─ tengu_swinburne_dune? → Iv9() typed combined
│   │         └─ default             → Cv9() standard combined
│   │
│   └─ Z3() (auto memory enabled)?
│       YES → Single memory:
│             ├─ tengu_passport_quail? → xv9() background agent mode
│             ├─ tengu_swinburne_dune? → U14() file-based index
│             └─ default             → uv9() simple prompt
│       NO  → null (no memory in prompt)
│
└─ In memory prompt text (Dt search section):
    tengu_coral_fern=true → include search guidance for grep/glob
    tengu_coral_fern=false → no search guidance
```

---

## 8. New Symbols Requiring Addition to Symbol Index

The following symbols are verified but not yet in `symbol_index_core_features.md`:

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| `R0` | `buildSystemPrompt` | chunks.168.mjs:2143 | async function |
| `AF` | `createStaticSystemPromptComponent` | chunks.144.mjs:1726 | function |
| `m8q` | `createCacheBreakingSystemPromptComponent` | chunks.144.mjs:1406 | function |
| `B8q` | `evaluateSystemPromptComponents` | chunks.144.mjs:1413 | async function |
| `ou1` | `getSystemPromptCache` | chunks.1.mjs:3111 | function |
| `au1` | `setSystemPromptCache` | chunks.1.mjs:3115 | function |
| `su1` | `clearSystemPromptCacheData` | chunks.1.mjs:3119 | function |
| `RT6` | `clearSystemPromptCache` | chunks.144.mjs:1751 | function |
| `Oz1` | `isCoworkMode` | chunks.50.mjs:2439 | function |
| `_qq` | `filterAlreadyReadMemories` | chunks.147.mjs:637 | function |
| `uuY` | `getRecentSuccessfulToolNames` | chunks.147.mjs:373262 | function |
| `lf8` | `buildSystemPromptContent` | chunks.84.mjs:~800 | function (lazy) |
| `gl` | `resetSession` | chunks.147.mjs:2552 | function |
| `JB` | `MAX_CHAR_LIMIT = 40000` | chunks.84.mjs:~800 | constant |
| `Qv9` | `CODEBASE_INSTRUCTIONS_HEADER` | chunks.84.mjs:~800 | constant |

---

## Summary

### Key Architecture Corrections

1. **Memory registration key**: `"memory"` (not `"auto_memory"`)
2. **Memory caching**: MEMORY.md content IS cached in `v1.systemPromptSectionCache` — only re-read on session/context reset via `RT6()`
3. **Two memory paths**: Static (cached MEMORY.md in system prompt) + Dynamic (per-turn `relevant_memories` via `zqq`, gated by `tengu_moth_copse`)

### Key Architecture Insights

1. **Concurrent memory search**: `zqq` fires memory search concurrently with LLM request — zero added latency
2. **Post-turn injection**: Relevant memories are injected AFTER tool results, becoming context for the next turn
3. **Anti-deduplication**: `_qq` filters memories already read via Read tool — avoids context waste
4. **Recent tool context**: `uuY` provides tool names from the previous turn to improve memory selection relevance
5. **Cowork mode permission**: Memory write bypass is disabled in cowork mode (shared remote path safety)
6. **Team memory XML wrapper**: `<team-memory-content source="shared">` tags distinguish team vs project instructions
