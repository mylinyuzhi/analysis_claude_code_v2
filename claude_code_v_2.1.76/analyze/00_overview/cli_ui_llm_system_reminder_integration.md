# CLI-UI-LLM System Reminder Deep Integration (Claude Code v2.1.76)

> Complete analysis of attachment production, normalization, and cross-module integration.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Source-Level**: Includes verified pseudocode with exact line references.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Attachment Producer Catalog](#2-attachment-producer-catalog)
3. [Production Flow Analysis](#3-production-flow-analysis)
4. [Turn-Based Attachment Logic](#4-turn-based-attachment-logic)
5. [Cross-Module Integration](#5-cross-module-integration)
6. [Key Algorithms](#6-key-algorithms)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features

Key functions in this document:
- `assembleAllAttachments` (_uY) - Main orchestrator at chunks.147.mjs:3
- `produceAttachment` (Hz) - Producer wrapper at chunks.147.mjs:20
- `normalizeAttachmentForAPI` (Ui8) - Normalizer at chunks.174.mjs:3

---

## 1. Architecture Overview

### 1.1 System Reminder Purpose

System reminders are meta-messages injected into the conversation to provide context to the LLM without explicit user action. They enable:

1. **Context Injection**: File contents, IDE state, team context
2. **State Tracking**: Token usage, budget, turn counts
3. **Mode Signaling**: Plan mode, auto mode, team mode
4. **Delta Updates**: Changed files, new tools, MCP instructions

### 1.2 Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ATTACHMENT PRODUCTION LAYER                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    assembleAllAttachments (_uY)                      │    │
│  │                    Location: chunks.147.mjs:3                         │    │
│  │                                                                        │    │
│  │  Responsibilities:                                                    │    │
│  │  • Orchestrate all attachment producers                               │    │
│  │  • Manage timeout (1000ms abort)                                      │    │
│  │  • Filter null/undefined results                                      │    │
│  │  • Return flat array of attachments                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                    ┌───────────────┴───────────────┐                        │
│                    ▼                               ▼                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │   User-Dependent Producers  │  │   Main-Thread Producers     │          │
│  │   (only if has user message)│  │   (only if !agentId)        │          │
│  │                             │  │                             │          │
│  │  • at_mentioned_files       │  │  • ide_selection            │          │
│  │  • mcp_resources            │  │  • ide_opened_file          │          │
│  │  • agent_mentions           │  │  • diagnostics              │          │
│  │                             │  │  • token_usage              │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ALWAYS-RUN PRODUCERS LAYER                              │
│                                                                              │
│  • date_change        • todo_reminders        • team_context                │
│  • ultrathink_effort  • plan_mode             • auto_mode                   │
│  • deferred_tools     • plan_mode_exit        • auto_mode_exit              │
│  • changed_files      • critical_reminder     • agent_pending               │
│  • nested_memory      • mcp_instructions      • queued_commands             │
│  • skill_listing      • dynamic_skill         • teammate_mailbox            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NORMALIZATION LAYER                                    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                 normalizeAttachmentForAPI (Ui8)                      │    │
│  │                 Location: chunks.174.mjs:3                            │    │
│  │                                                                        │    │
│  │  Transforms attachment objects to API format:                         │    │
│  │  { type: "...", ... } → { content: "...", isMeta: true }             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Attachment Producer Catalog

### 2.1 Complete Producer List (25+ Types)

The `assembleAllAttachments` function orchestrates three categories of producers:

#### Category A: User-Dependent Producers
Only run when there's a user message to process.

| Producer | Function | Location | Purpose |
|----------|----------|----------|---------|
| `at_mentioned_files` | `RuY` | chunks.147.mjs:407 | Parse @file mentions, read file contents |
| `mcp_resources` | `SuY` | chunks.147.mjs:464 | Fetch MCP server resources via @resource:uri |
| `agent_mentions` | `huY` | chunks.147.mjs:450 | Handle @agent-type mentions |

#### Category B: Always-Run Producers
Run on every agent turn regardless of user input.

| Producer | Function | Location | Purpose |
|----------|----------|----------|---------|
| `date_change` | `fuY` | chunks.147.mjs:237 | Detect date boundary crossing |
| `ultrathink_effort` | `TuY` | chunks.147.mjs:248 | High effort mode detection |
| `deferred_tools_delta` | `xE1` | chunks.147.mjs:256 | Dynamic tool availability changes |
| `mcp_instructions_delta` | `uE1` | chunks.147.mjs:269 | MCP server instruction updates |
| `changed_files` | `CuY` | chunks.147.mjs:497 | Files modified in current session |
| `nested_memory` | `IuY` | chunks.147.mjs:541 | CLAUDE.md file chain loading |
| `dynamic_skill` | `BuY` | chunks.147.mjs:650 | Dynamic skill loading |
| `skill_listing` | `guY` | chunks.147.mjs:700 | Available skills list |
| `ultra_claude_md` | `VuY` | chunks.147.mjs:302 | Ultra CLAUDE.md support (stub) |
| `plan_mode` | `DuY` | chunks.147.mjs:136 | Plan mode state injection |
| `plan_mode_exit` | `XuY` | chunks.147.mjs:170 | Plan mode exit notification |
| `auto_mode` | `ZuY` | chunks.147.mjs:214 | Auto mode state injection |
| `auto_mode_exit` | `GuY` | chunks.147.mjs:229 | Auto mode exit notification |
| `todo_reminders` | `ruY`/`auY` | chunks.147.mjs:972/1013 | Todo list state |
| `teammate_mailbox` | `euY` | chunks.147.mjs:1084 | Team mailbox messages |
| `team_context` | `AmY` | chunks.147.mjs:1089 | Team collaboration context |
| `agent_pending_messages` | `$uY` | chunks.147.mjs:70 | Pending agent messages |
| `critical_system_reminder` | `vuY` | chunks.147.mjs:284 | Critical reminders |
| `queued_commands` | `OuY` | chunks.147.mjs:48 | Queued slash commands |

#### Category C: Main-Thread-Only Producers
Only run when `!agentId` (main agent thread, not subagent).

| Producer | Function | Location | Purpose |
|----------|----------|----------|---------|
| `ide_selection` | `kuY` | chunks.147.mjs:306 | IDE selected text/lines |
| `ide_opened_file` | `LuY` | chunks.147.mjs:397 | IDE currently open file |
| `output_style` | `NuY` | chunks.147.mjs:293 | Output style setting |
| `diagnostics` | `cuY` | chunks.147.mjs:789 | IDE diagnostics |
| `lsp_diagnostics` | `luY` | chunks.147.mjs:800 | LSP diagnostics |
| `unified_tasks` | `suY` | chunks.147.mjs:1033 | Unified task list |
| `async_hook_responses` | `tuY` | chunks.147.mjs:1050 | Async hook responses |
| `token_usage` | `qmY` | chunks.147.mjs:1108 | Token usage tracking |
| `budget_usd` | `YmY` | chunks.147.mjs:1117 | Budget tracking |
| `output_token_usage` | `KmY` | chunks.147.mjs:1120 | Output token tracking |
| `verify_plan_reminder` | `_mY` | chunks.147.mjs:1124 | Plan verification |

### 2.2 Producer Execution Order

```javascript
// ============================================
// assembleAllAttachments (_uY) - Producer orchestration
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),  // Create abort controller
        O = setTimeout((W) => W.abort(), 1000, w),  // 1 second timeout
        $ = {...q, abortController: w},
        H = !q.agentId,  // Is main thread?
        // User-dependent producers
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)),
                 Hz("mcp_resources", () => SuY(A, $)),
                 Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents)))] : [],
        J = await Promise.all(j),
        // Always-run producers
        M = [Hz("date_change", () => Promise.resolve(fuY())),
             Hz("ultrathink_effort", () => Promise.resolve(TuY(A))),
             // ... more producers ...
            ],
        // Main-thread-only producers
        D = H ? [Hz("ide_selection", async () => kuY(K, q)),
                 Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))),
                 // ... more producers ...
                ] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(userMessage, sessionContext, ideState, queuedCommands, messages, sessionMemoryType) {
    // Early exit conditions
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1 second timeout
    let abortController = createAbortController();
    let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);
    let contextWithAbort = {...sessionContext, abortController};

    let isMainThread = !sessionContext.agentId;

    // PHASE 1: User-dependent producers (only if user message exists)
    let userDependentProducers = userMessage ? [
        produceAttachment("at_mentioned_files", () => produceAtMentionedFiles(userMessage, contextWithAbort)),
        produceAttachment("mcp_resources", () => produceMcpResources(userMessage, contextWithAbort)),
        produceAttachment("agent_mentions", () => Promise.resolve(produceAgentMentions(userMessage, sessionContext.options.agentDefinitions.activeAgents)))
    ] : [];
    let userDependentResults = await Promise.all(userDependentProducers);

    // PHASE 2: Always-run producers
    let alwaysRunProducers = [
        produceAttachment("date_change", () => Promise.resolve(produceDateChange())),
        produceAttachment("ultrathink_effort", () => Promise.resolve(produceUltrathinkEffort(userMessage))),
        produceAttachment("deferred_tools_delta", () => Promise.resolve(produceDeferredToolsDelta(sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        produceAttachment("mcp_instructions_delta", () => Promise.resolve(produceMcpInstructionsDelta(sessionContext.options.mcpClients, sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        produceAttachment("changed_files", () => produceChangedFiles(contextWithAbort)),
        produceAttachment("nested_memory", () => produceNestedMemory(contextWithAbort)),
        produceAttachment("dynamic_skill", () => produceDynamicSkill(contextWithAbort)),
        produceAttachment("skill_listing", () => produceSkillListing(contextWithAbort)),
        produceAttachment("ultra_claude_md", async () => produceUltraClaudeMd(messages)),
        produceAttachment("plan_mode", () => producePlanMode(messages, sessionContext)),
        produceAttachment("plan_mode_exit", () => producePlanModeExit(sessionContext)),
        produceAttachment("auto_mode", () => produceAutoMode(messages, sessionContext)),
        produceAttachment("auto_mode_exit", () => produceAutoModeExit(sessionContext)),
        produceAttachment("todo_reminders", () => isTeamMode() ? produceTeamTodoReminders(messages, sessionContext) : produceTodoReminders(messages, sessionContext)),
        // Team-mode conditional producers
        ...(isTeamMode() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [produceAttachment("teammate_mailbox", async () => produceTeammateMailbox(sessionContext))]),
            produceAttachment("team_context", async () => produceTeamContext(messages ?? []))
        ] : []),
        produceAttachment("agent_pending_messages", async () => produceAgentPendingMessages(sessionContext)),
        produceAttachment("critical_system_reminder", () => Promise.resolve(produceCriticalReminder(sessionContext)))
    ];

    // PHASE 3: Main-thread-only producers
    let mainThreadProducers = isMainThread ? [
        produceAttachment("ide_selection", async () => produceIdeSelection(ideState, sessionContext)),
        produceAttachment("ide_opened_file", async () => produceIdeOpenedFile(ideState, sessionContext)),
        produceAttachment("output_style", async () => Promise.resolve(produceOutputStyle())),
        produceAttachment("diagnostics", async () => produceDiagnostics(sessionContext)),
        produceAttachment("lsp_diagnostics", async () => produceLspDiagnostics(sessionContext)),
        produceAttachment("unified_tasks", async () => produceUnifiedTasks(sessionContext)),
        produceAttachment("async_hook_responses", async () => produceAsyncHookResponses()),
        produceAttachment("token_usage", async () => Promise.resolve(produceTokenUsage(messages ?? [], sessionContext.options.mainLoopModel))),
        produceAttachment("budget_usd", async () => Promise.resolve(produceBudgetUsd(sessionContext.options.maxBudgetUsd))),
        produceAttachment("output_token_usage", async () => Promise.resolve(produceOutputTokenUsage())),
        produceAttachment("verify_plan_reminder", async () => produceVerifyPlanReminder(messages, sessionContext)),
        produceAttachment("queued_commands", () => produceQueuedCommands(queuedCommands))
    ] : [];

    let [alwaysResults, mainThreadResults] = await Promise.all([
        Promise.all(alwaysRunProducers),
        Promise.all(mainThreadProducers)
    ]);

    // Clear timeout and return flattened results
    clearTimeout(timeoutId);
    return [...userDependentResults.flat(), ...alwaysResults.flat(), ...mainThreadResults.flat()]
        .filter((result) => result !== void 0 && result !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→sessionContext, K→ideState,
//          Y→queuedCommands, z→messages, _→sessionMemoryType, w→abortController,
//          O→timeoutId, H→isMainThread, j→userDependentProducers, M→alwaysRunProducers,
//          D→mainThreadProducers, Hz→produceAttachment
```

---

## 3. Production Flow Analysis

### 3.1 ProduceAttachment Wrapper (Hz)

```javascript
// ============================================
// produceAttachment (Hz) - Producer wrapper with telemetry
// Location: chunks.147.mjs:20-46
// ============================================

// ORIGINAL (for source lookup):
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K;
        if (Math.random() < 0.05) {
            let _ = Y.filter((w) => w !== void 0 && w !== null).reduce((w, O) => {
                return w + B6(O).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: A,
                duration_ms: z,
                attachment_size_bytes: _,
                attachment_count: Y.length
            })
        }
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function produceAttachment(label, producerFn) {
    let startTime = Date.now();

    try {
        let attachments = await producerFn();
        let duration = Date.now() - startTime;

        // Sample 5% of productions for telemetry
        if (Math.random() < 0.05) {
            let totalBytes = attachments
                .filter((a) => a !== void 0 && a !== null)
                .reduce((sum, attachment) => sum + JSON.stringify(attachment).length, 0);

            trackEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalBytes,
                attachment_count: attachments.length
            });
        }

        return attachments;

    } catch (error) {
        let duration = Date.now() - startTime;

        // Log error with 5% sampling
        if (Math.random() < 0.05) {
            trackEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        logError(error);
        debugLog(`Attachment error in ${label}`, error);
        return [];  // Return empty on error (graceful degradation)
    }
}

// Mapping: Hz→produceAttachment, A→label, q→producerFn, K→startTime,
//          Y→attachments, z→duration, d→trackEvent, _6→logError, jV→debugLog
```

**Why this approach**:
- **Graceful degradation**: Errors return empty array, don't break the session
- **Sampling**: 5% sampling for telemetry reduces overhead
- **Timing**: Duration tracking helps identify slow producers

### 3.2 Timeout Handling

```javascript
// ============================================
// Timeout Pattern in assembleAllAttachments
// Location: chunks.147.mjs:5-6
// ============================================

// READABLE (for understanding):
let abortController = createAbortController();
let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);

// ... producers run with abortController in context ...

clearTimeout(timeoutId);
```

**Why 1000ms timeout**:
- Prevents slow producers from blocking the session
- Producers should check `abortController.signal.aborted`
- If aborted, producers return early with partial results

---

## 4. Turn-Based Attachment Logic

### 4.1 Plan Mode Turn Counting

Plan mode attachments use turn counting to avoid spamming the context with the same information every turn.

```javascript
// ============================================
// producePlanMode (DuY) - Turn-based attachment
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {turnCount: H, foundPlanModeAttachment: j} = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = Fj(q.agentId),
        _ = sJ(q.agentId),
        w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode",
        reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({
        type: "plan_mode",
        reminderType: $,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w
}

// READABLE (for understanding):
async function producePlanMode(messages, sessionContext) {
    let permissionContext = sessionContext.getAppState().toolPermissionContext;

    // Only run in plan mode
    if (permissionContext.mode !== "plan") {
        return [];
    }

    // Check if we should skip (recent attachment exists)
    if (messages && messages.length > 0) {
        let {turnCount, foundPlanModeAttachment} = countTurnsSinceLastPlanAttachment(messages);

        // Skip if attached recently and not enough turns passed
        if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
            return [];
        }
    }

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planExists = checkPlanExists(sessionContext.agentId);
    let attachments = [];

    // Ultraplan mode - special handling
    if (permissionContext.prePlanMode === "ultraplan") {
        attachments.push({
            type: "plan_mode",
            reminderType: "ultraplan-complete",
            isSubAgent: !!sessionContext.agentId,
            planFilePath: planFilePath,
            planExists: planExists !== null
        });
        return attachments;
    }

    // Re-entry handling
    if (isReEnteringPlanMode() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });
        clearReEntryFlag(false);
    }

    // Determine reminder type: full or sparse
    let attachmentCount = countPlanModeAttachments(messages ?? []);
    let reminderType = (attachmentCount + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
        ? "full"
        : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,
        isSubAgent: !!sessionContext.agentId,
        planFilePath: planFilePath,
        planExists: planExists !== null
    });

    return attachments;
}

// Mapping: DuY→producePlanMode, A→messages, q→sessionContext, Y→permissionContext,
//          H→turnCount, j→foundPlanModeAttachment, z→planFilePath, _→planExists
```

### 4.2 Turn Counting Helper

```javascript
// ============================================
// countTurnsSinceLastPlanAttachment (JuY) - Turn counter
// Location: chunks.147.mjs:105-122
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastPlanAttachment(messages) {
    let turnCount = 0;
    let foundPlanModeAttachment = false;

    // Iterate backwards through messages
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip tool-use-only messages)
        if (message?.type === "assistant") {
            if (isToolUseOnlyMessage(message)) continue;
            turnCount++;
        }
        // Stop when we find a plan mode attachment
        else if (message?.type === "attachment" &&
                 (message.attachment.type === "plan_mode" ||
                  message.attachment.type === "plan_mode_reentry")) {
            foundPlanModeAttachment = true;
            break;
        }
    }

    return {turnCount, foundPlanModeAttachment};
}

// Mapping: JuY→countTurnsSinceLastPlanAttachment, q→turnCount, K→foundPlanModeAttachment
```

**Key insight**: The turn counting algorithm walks backwards from the latest message, counting assistant turns until it finds a relevant attachment. This prevents redundant context injection while ensuring the LLM has necessary mode information.

---

## 5. Cross-Module Integration

### 5.1 CLI → System Reminder

CLI flags affect attachment production:

| CLI Flag | Effect | Producer Affected |
|----------|--------|-------------------|
| `--plan` | Activates plan mode | `plan_mode`, `plan_mode_exit` |
| `--dangerously-skip-permissions` | Sets mode to "auto" | `auto_mode`, `auto_mode_exit` |
| `--team-name` | Enables team mode | `team_context`, `teammate_mailbox` |
| `--agent-id` | Subagent mode | Disables main-thread producers |

### 5.2 UI → System Reminder

UI state flows into attachments:

| UI State | Producer | Data Flow |
|----------|----------|-----------|
| IDE selection | `ide_selection` | `ideState.lineStart`, `ideState.text` |
| Open file | `ide_opened_file` | `ideState.filePath` |
| Token display | `token_usage` | `messages` → token calculation |
| Budget warning | `budget_usd` | `sessionContext.options.maxBudgetUsd` |

### 5.3 LLM Core → System Reminder

The agent loop triggers attachment production:

```
mainAgentLoop (turn start)
        │
        ▼
assembleAllAttachments(sessionState)
        │
        ├── Produce all relevant attachments
        │
        ▼
normalizeAttachmentForAPI(attachment)
        │
        ▼
Inject as user message with isMeta: true
        │
        ▼
Include in next LLM request
```

### 5.4 MCP → System Reminder

MCP servers contribute to attachments:

```
MCP Client State
        │
        ├── mcp_resources producer
        │   └── @resource:server:uri mentions
        │
        ├── mcp_instructions_delta producer
        │   └── Server instruction updates
        │
        └── dynamic_skill producer
            └── Dynamic tool discovery
```

---

## 6. Key Algorithms

### 6.1 At-Mentioned Files Processing

```javascript
// ============================================
// produceAtMentionedFiles (RuY) - File mention handler
// Location: chunks.147.mjs:407-448
// ============================================

// READABLE (for understanding):
async function produceAtMentionedFiles(userMessage, sessionContext) {
    let mentions = extractAtMentions(userMessage);

    if (mentions.length === 0) {
        return [];
    }

    let appState = sessionContext.getAppState();

    return (await Promise.all(mentions.map(async (mention) => {
        try {
            let {filename, lineStart, lineEnd} = parseMention(mention);
            let resolvedPath = resolvePath(filename);

            // Check permission
            if (isPathDenied(resolvedPath, appState.toolPermissionContext)) {
                return null;
            }

            // Handle directory mentions
            try {
                if ((await stat(resolvedPath)).isDirectory()) {
                    let entries = await readdir(resolvedPath, {withFileTypes: true});
                    let maxEntries = 1000;
                    let isTruncated = entries.length > maxEntries;

                    let names = entries.slice(0, maxEntries).map((e) => e.name);
                    if (isTruncated) {
                        names.push(`… and ${entries.length - maxEntries} more entries`);
                    }

                    let content = names.join("\n");

                    trackEvent("tengu_at_mention_extracting_directory_success", {});
                    return {
                        type: "directory",
                        path: resolvedPath,
                        content: content,
                        displayPath: relativeToCwd(resolvedPath)
                    };
                }
            } catch {
                // Not a directory, continue with file handling
            }

            // Handle file mentions
            return await readFileForAttachment(
                resolvedPath,
                sessionContext,
                "tengu_at_mention_extracting_filename_success",
                "tengu_at_mention_extracting_filename_error",
                "at-mention",
                {offset: lineStart, limit: lineEnd && lineStart ? lineEnd - lineStart + 1 : undefined}
            );

        } catch {
            trackEvent("tengu_at_mention_extracting_filename_error", {});
        }
    }))).filter(Boolean);
}

// Mapping: RuY→produceAtMentionedFiles, K→mentions, Y→appState
```

### 6.2 Changed Files Detection

```javascript
// ============================================
// produceChangedFiles (CuY) - File modification tracker
// Location: chunks.147.mjs:497-540
// ============================================

// READABLE (for understanding):
async function produceChangedFiles(sessionContext) {
    let modifiedFiles = getModifiedFilesFromReadState(sessionContext.readFileState);

    if (modifiedFiles.length === 0) {
        return [];
    }

    // Filter files that have been read and modified
    return modifiedFiles
        .filter((file) => file.contentDiffersFromDisk)
        .map((file) => ({
            type: "changed_file",
            path: file.path,
            content: file.content,
            displayPath: relativeToCwd(file.path)
        }));
}

// Mapping: CuY→produceChangedFiles, q→sessionContext
```

**Why this approach**:
- Only includes files that differ from disk (actual modifications)
- Uses `readFileState` maintained by Read tool
- Provides LLM with current file state without re-reading

### 6.3 Token Usage Calculation

```javascript
// ============================================
// produceTokenUsage (qmY) - Token tracker
// Location: chunks.147.mjs:1108-1118
// ============================================

// READABLE (for understanding):
function produceTokenUsage(messages, model) {
    if (!messages || messages.length === 0) {
        return [];
    }

    let tokenCount = calculateTokenCount(messages, model);
    let threshold = getTokenThreshold(model);

    return [{
        type: "token_usage",
        currentTokens: tokenCount,
        threshold: threshold,
        percentageUsed: Math.round((tokenCount / threshold) * 100)
    }];
}

// Mapping: qmY→produceTokenUsage, A→messages, q→model
```

---

## Summary

The System Reminder module provides a sophisticated meta-messaging system that:

1. **Orchestrates 25+ producers** across three categories (user-dependent, always-run, main-thread-only)
2. **Implements graceful degradation** with error handling and timeouts
3. **Uses turn-based logic** to avoid context spam
4. **Integrates deeply** with CLI, UI, MCP, and LLM Core modules
5. **Provides sampling-based telemetry** for performance monitoring

Key design decisions:
- **1000ms timeout**: Prevents slow producers from blocking sessions
- **5% telemetry sampling**: Balances observability with overhead
- **Turn counting**: Ensures context efficiency without losing information
- **Category-based execution**: Optimizes by running only relevant producers

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All attachment producers documented with source verification