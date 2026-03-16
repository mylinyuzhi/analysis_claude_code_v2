# Attachment Producers - Deep Implementation Analysis

## Overview

This document provides a comprehensive reverse engineering analysis of the **40+ attachment producer functions** that generate system reminders in Claude Code. Each producer is responsible for detecting specific conditions and creating attachment objects that get normalized into meta-messages and injected into the conversation stream.

The attachment production system is orchestrated by the `_uY` (assembleAllAttachments) function, which executes producers in parallel using a sophisticated 3-group strategy for optimal performance while maintaining strict isolation and error handling through the `Hz` (timedAttachmentProducer) wrapper.

---

## Architecture: The assembleAllAttachments Orchestrator

### Main Entry Point: _uY (assembleAllAttachments)

The `_uY` function is the central orchestrator that manages all attachment production. It implements a sophisticated parallel execution strategy that balances performance with proper dependency management.

```javascript
// ============================================
// assembleAllAttachments - Main attachment production orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(userMessage, sessionContext, ideContext, queuedCommands, messages, sessionMemoryType) {
    // Early exit if attachments are globally disabled or in simple mode
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create AbortController with 1-second global timeout
    let abortController = createAbortController();
    let timeoutId = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

    // Enhanced context with abort capability
    let enhancedContext = {
        ...sessionContext,
        abortController: abortController
    };

    // Determine if this is the main agent (not a subagent)
    let isMainAgent = !sessionContext.agentId;

    // GROUP 1: User-dependent producers (only run if user provided message)
    // These parse user input for @-mentions, MCP resources, and agent references
    let userDependentProducers = userMessage ? [
        timedAttachmentProducer("at_mentioned_files", () => getAtMentionedFilesAttachment(userMessage, enhancedContext)),
        timedAttachmentProducer("mcp_resources", () => getMcpResourcesAttachment(userMessage, enhancedContext)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(getAgentMentionsAttachment(userMessage, sessionContext.options.agentDefinitions.activeAgents))),
        // Placeholder for future expansion
        ...[]
    ] : [];

    // Execute group 1 and wait for completion
    let userDependentResults = await Promise.all(userDependentProducers);

    // GROUP 2: Always-computed producers (run for all agents, main and subagents)
    // These check system state and provide context attachments
    let alwaysComputedProducers = [
        // Status/State producers
        timedAttachmentProducer("date_change", () => Promise.resolve(getDateChangeAttachment())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(getUltrathinkEffortAttachment(userMessage))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDeltaAttachment(sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(getMcpInstructionsDeltaAttachment(sessionContext.options.mcpClients, sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),

        // File/Context producers
        timedAttachmentProducer("changed_files", () => getChangedFilesAttachment(enhancedContext)),
        timedAttachmentProducer("nested_memory", () => getNestedMemoryAttachments(enhancedContext)),
        timedAttachmentProducer("dynamic_skill", () => getDynamicSkillAttachments(enhancedContext)),
        timedAttachmentProducer("skill_listing", () => getSkillListingAttachment(enhancedContext)),
        timedAttachmentProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(messages)),

        // Mode control producers
        timedAttachmentProducer("plan_mode", () => getPlanModeAttachment(messages, sessionContext)),
        timedAttachmentProducer("plan_mode_exit", () => getPlanModeExitAttachment(sessionContext)),
        timedAttachmentProducer("auto_mode", () => getAutoModeAttachment(messages, sessionContext)),
        timedAttachmentProducer("auto_mode_exit", () => getAutoModeExitAttachment(sessionContext)),

        // Task management
        timedAttachmentProducer("todo_reminders", () => isTasksEnabled() ? getTaskReminderAttachment(messages, sessionContext) : getTodoReminderAttachment(messages, sessionContext)),

        // Team mode attachments (only if in team/swarm mode)
        ...isTeamMode() ? [
            // Skip teammate_mailbox in session_memory context to avoid duplication
            ...sessionMemoryType === "session_memory" ? [] : [
                timedAttachmentProducer("teammate_mailbox", async () => getTeammateMailboxAttachment(sessionContext))
            ],
            timedAttachmentProducer("team_context", async () => getTeamContextAttachment(messages ?? []))
        ] : [],

        // Agent messaging
        timedAttachmentProducer("agent_pending_messages", async () => getAgentPendingMessagesAttachment(sessionContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminderAttachment(sessionContext)))
    ];

    // GROUP 3: Main-agent-only producers (only run for primary agent, not subagents)
    // These provide IDE integration, diagnostics, and user-facing state
    let mainAgentOnlyProducers = isMainAgent ? [
        timedAttachmentProducer("ide_selection", async () => getIdeSelectionAttachment(ideContext, sessionContext)),
        timedAttachmentProducer("ide_opened_file", async () => getIdeOpenedFileAttachment(ideContext, sessionContext)),
        timedAttachmentProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        timedAttachmentProducer("diagnostics", async () => getDiagnosticsAttachment(sessionContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachment(sessionContext)),
        timedAttachmentProducer("unified_tasks", async () => getUnifiedTasksAttachment(sessionContext)),
        timedAttachmentProducer("async_hook_responses", async () => getAsyncHookResponsesAttachment()),
        timedAttachmentProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], sessionContext.options.mainLoopModel))),
        timedAttachmentProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(sessionContext.options.maxBudgetUsd))),
        timedAttachmentProducer("output_token_usage", async () => Promise.resolve(getOutputTokenUsageAttachment())),
        timedAttachmentProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, sessionContext)),
        timedAttachmentProducer("queued_commands", () => getQueuedCommandsAttachment(queuedCommands))
    ] : [];

    // Execute groups 2 and 3 in parallel, wait for both to complete
    let [alwaysComputedResults, mainAgentResults] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // Clear timeout and flatten all results
    clearTimeout(timeoutId);

    // Filter out undefined/null values and flatten
    return [...userDependentResults.flat(), ...alwaysComputedResults.flat(), ...mainAgentResults.flat()]
        .filter((attachment) => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→sessionContext, K→ideContext, Y→queuedCommands, z→messages, _→sessionMemoryType
//          Hz→timedAttachmentProducer, sK→createAbortController, t6→parseBoolean, E7→isTeamMode
//          RuY→getAtMentionedFilesAttachment, SuY→getMcpResourcesAttachment, huY→getAgentMentionsAttachment
//          DuY→getPlanModeAttachment, XuY→getPlanModeExitAttachment, ZuY→getAutoModeAttachment, GuY→getAutoModeExitAttachment
//          ruY→getTodoReminderAttachment, auY→getTaskReminderAttachment, suY→getUnifiedTasksAttachment
//          tuY→getAsyncHookResponsesAttachment, euY→getTeammateMailboxAttachment, AmY→getTeamContextAttachment
//          qmY→getTokenUsageAttachment, YmY→getBudgetUsdAttachment, OuY→getQueuedCommandsAttachment
```

### What it does

The `assembleAllAttachments` function orchestrates the parallel execution of 40+ attachment producers to generate system reminders based on the current session state, user input, and IDE context.

### How it works

1. **Global disable check**: First checks if `CLAUDE_CODE_DISABLE_ATTACHMENTS` or `CLAUDE_CODE_SIMPLE` environment variable is set, returning empty array if true
2. **Timeout setup**: Creates an AbortController with a 1-second global timeout to prevent any single producer from blocking the system
3. **Context enhancement**: Wraps the session context with the abort controller so all producers have cancellation capability
4. **Three-phase parallel execution**:
   - **Phase 1 (User-dependent)**: Executes 3 producers that parse user input for @-mentions, MCP resources, and agent references. These MUST complete before subsequent phases because they may trigger file reads that other producers need.
   - **Phase 2 (Always-computed)** & **Phase 3 (Main-agent-only)**: These two groups execute in parallel since they have no dependencies on each other
5. **Result flattening**: Each producer returns an array of attachments (may be empty), so results are flattened into a single array and filtered for null/undefined

### Why this approach

**Parallel execution strategy**: The 3-group design balances performance with correctness:
- **Group 1 sequential** ensures @-mentioned files are read before other producers check file state
- **Groups 2 & 3 parallel** maximizes throughput since they're independent

**Timeout isolation**: The 1-second global timeout prevents any producer from blocking the agent loop, ensuring system responsiveness even if a producer hangs.

**Conditional execution**:
- User-dependent producers only run if user provided a message (saves cycles on agent-initiated turns)
- Main-agent-only producers skip for subagents (avoids duplicate IDE state, diagnostics, etc.)
- Team-mode producers only run in swarm/team sessions

**Error isolation**: By wrapping each producer with `Hz` (timedAttachmentProducer), failures in one producer don't affect others.

### Key insight

The architecture treats attachment production as a **parallel map-reduce pipeline**: map each producer to an attachment array, reduce by flattening. The grouping strategy optimizes for the common case (no user @-mentions) while maintaining correctness when dependencies exist. The 1-second timeout is aggressive, reflecting a design philosophy that **stale/missing attachments are better than a blocked agent loop**.

---

## The Wrapper: Hz (timedAttachmentProducer)

Every producer is wrapped by `Hz`, which provides telemetry, error handling, and timeout enforcement.

```javascript
// ============================================
// timedAttachmentProducer - Telemetry and error handling wrapper
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
async function timedAttachmentProducer(producerLabel, producerFunction) {
    let startTime = Date.now();

    try {
        // Execute the producer function
        let attachments = await producerFunction();

        // Calculate execution time
        let durationMs = Date.now() - startTime;

        // Calculate total size of all attachments (in bytes)
        let totalSizeBytes = attachments
            .filter((item) => item !== undefined && item !== null)
            .reduce((sum, attachment) => {
                return sum + JSON.stringify(attachment).length;
            }, 0);

        // Sample telemetry (5% of executions to avoid overhead)
        if (Math.random() < 0.05) {
            logTelemetry("tengu_attachment_compute_duration", {
                label: producerLabel,
                duration_ms: durationMs,
                attachment_size_bytes: totalSizeBytes,
                attachment_count: attachments.length
            });
        }

        return attachments;

    } catch (error) {
        let durationMs = Date.now() - startTime;

        // Sample telemetry for errors (5% rate)
        if (Math.random() < 0.05) {
            logTelemetry("tengu_attachment_compute_duration", {
                label: producerLabel,
                duration_ms: durationMs,
                error: true
            });
        }

        // Log error for debugging (always logged, not sampled)
        logError(error);
        logWarning(`Attachment error in ${producerLabel}`, error);

        // Return empty array to isolate failure
        return [];
    }
}

// Mapping: Hz→timedAttachmentProducer, A→producerLabel, q→producerFunction, K→startTime, Y→attachments or error, z→durationMs, _→totalSizeBytes, w→sum, O→attachment, d→logTelemetry, B6→JSON.stringify, _6→logError, jV→logWarning
```

### What it does

Wraps each producer function with timing instrumentation, size measurement, error handling, and sampled telemetry reporting.

### How it works

1. **Start timer**: Records timestamp before executing producer
2. **Execute producer**: Awaits the producer function (may throw or timeout via AbortController)
3. **Success path**:
   - Measures duration
   - Calculates total size by JSON-stringifying each attachment
   - With 5% probability, logs telemetry with duration, size, and count metrics
   - Returns attachments array
4. **Error path**:
   - Measures duration
   - With 5% probability, logs telemetry with error flag
   - Logs error to console (100% rate for debugging)
   - Returns empty array (isolates failure)

### Why this approach

**Sampled telemetry (5%)**: Attachment production happens on every agent turn (potentially hundreds per session). Full telemetry would create overwhelming data volume and add measurable overhead. 5% sampling provides statistically significant insights while minimizing impact.

**Error isolation**: Returning empty array on failure ensures one broken producer doesn't crash the entire attachment system. The agent continues with partial attachments.

**Size measurement**: Tracking attachment size helps identify producers that generate excessive data, which could:
- Exceed token limits
- Slow down message normalization
- Cause memory pressure

**Always-log errors**: Even though telemetry is sampled, errors are always logged locally because they indicate bugs that need immediate investigation.

### Key insight

This wrapper implements the **"fail safe, observe selectively"** pattern: every failure is contained (return []), but only a sample is reported remotely (5%). This balances reliability (system stays up despite bugs) with observability (enough data to detect and diagnose issues).

---

## Producer Categories

The 40+ producers are organized into three categories based on execution conditions:

### Category 1: User-Dependent Producers (3 producers)

These only run when the user provides a message (not on agent-initiated turns).

| Producer | Function | Purpose |
|----------|----------|---------|
| `at_mentioned_files` | `RuY` | Extracts @"file.txt" mentions and loads file contents |
| `mcp_resources` | `SuY` | Extracts @server:uri mentions and fetches MCP resources |
| `agent_mentions` | `huY` | Extracts @agent-name mentions for agent invocation |

### Category 2: Always-Computed Producers (14+ producers)

These run on every turn for both main agents and subagents.

| Producer | Function | Purpose |
|----------|----------|---------|
| `changed_files` | `CuY` | Detects modifications to previously-read files |
| `nested_memory` | `IuY` | Loads MEMORY.md files from nested directories |
| `dynamic_skill` | `BuY` | Discovers dynamically-added skills |
| `skill_listing` | `guY` | Provides skill inventory for LLM discovery |
| `ultra_claude_md` | `VuY` | (Reserved for future use, currently returns []) |
| `plan_mode` | `DuY` | Injects plan mode instructions when active |
| `plan_mode_exit` | `XuY` | Notifies LLM when exiting plan mode |
| `auto_mode` | `ZuY` | Injects auto mode instructions when active |
| `auto_mode_exit` | `GuY` | Notifies LLM when exiting auto mode |
| `todo_reminders` | `ruY`/`auY` | Reminds LLM to use TodoWrite or TaskCreate |
| `teammate_mailbox` | `euY` | (Team mode) Delivers messages from teammates |
| `team_context` | `AmY` | (Team mode) Provides team configuration and identity |
| `critical_system_reminder` | `vuY` | Experimental: user-provided critical reminders |

### Category 3: Main-Agent-Only Producers (11 producers)

These only run for the primary agent, not subagents.

| Producer | Function | Purpose |
|----------|----------|---------|
| `ide_selection` | `kuY` | Reports user-selected text in IDE |
| `ide_opened_file` | `LuY` | Reports user-opened file in IDE (with nested memory) |
| `output_style` | `NuY` | Reminds LLM of active output style (concise, verbose, etc.) |
| `diagnostics` | `cuY` | Delivers new compiler/linter diagnostics |
| `lsp_diagnostics` | `luY` | Delivers new LSP diagnostics from language servers |
| `unified_tasks` | `suY` | Provides task status updates and progress messages |
| `async_hook_responses` | `tuY` | Delivers async responses from hook scripts |
| `token_usage` | `qmY` | Reports current token usage (if enabled) |
| `budget_usd` | `YmY` | Reports USD budget consumption |
| `verify_plan_reminder` | `_mY` | Reminds LLM to verify plan completion |
| `queued_commands` | `OuY` | Delivers user messages sent during execution |

---

## Deep Dive: User-Dependent Producers

### 1. RuY (extractAtMentionedFiles)

Parses user message for @-mentions and loads file contents.

```javascript
// ============================================
// extractAtMentionedFiles - Parse @-mentions and load file contents
// Location: chunks.147.mjs:407-448
// ============================================

// ORIGINAL (for source lookup):
async function RuY(A, q) {
    let K = FuY(A);
    if (K.length === 0) return [];
    let Y = q.getAppState();
    return (await Promise.all(K.map(async (_) => {
        try {
            let {
                filename: w,
                lineStart: O,
                lineEnd: $
            } = QuY(_), H = L4(w);
            if (rT6(H, Y.toolPermissionContext)) return null;
            try {
                if ((await qqq(H)).isDirectory()) try {
                    let J = await Aqq(H, {
                            withFileTypes: !0
                        }),
                        M = 1000,
                        D = J.length > 1000,
                        X = J.slice(0, 1000).map((W) => W.name);
                    if (D) X.push(`… and ${J.length-1000} more entries`);
                    let P = X.join(`
`);
                    return d("tengu_at_mention_extracting_directory_success", {}), {
                        type: "directory",
                        path: H,
                        content: P,
                        displayPath: Bl(G1(), H)
                    }
                } catch {
                    return null
                }
            } catch {}
            return await tF8(H, q, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
                offset: O,
                limit: $ && O ? $ - O + 1 : void 0
            })
        } catch {
            d("tengu_at_mention_extracting_filename_error", {})
        }
    }))).filter(Boolean)
}

// READABLE (for understanding):
async function extractAtMentionedFiles(userMessage, sessionContext) {
    // Parse all @-mentions from user message using regex
    let mentionedPaths = parseAtMentions(userMessage);

    if (mentionedPaths.length === 0) {
        return [];
    }

    // Get current app state for permission checks
    let appState = await sessionContext.getAppState();

    // Process each mention in parallel
    let attachments = await Promise.all(mentionedPaths.map(async (mentionPath) => {
        try {
            // Parse filename and optional line range (e.g., "file.txt#L10-20")
            let {
                filename: rawFilename,
                lineStart: lineStart,
                lineEnd: lineEnd
            } = parseFilePathWithLineRange(mentionPath);

            // Resolve to absolute path
            let absolutePath = resolveAbsolutePath(rawFilename);

            // Check if file is sandboxed (permission denied)
            if (isSandboxBlocked(absolutePath, appState.toolPermissionContext)) {
                return null; // Skip sandboxed files silently
            }

            // Check if it's a directory
            try {
                if ((await statAsync(absolutePath)).isDirectory()) {
                    // List directory contents with limit of 1000 entries
                    try {
                        let entries = await readdirAsync(absolutePath, { withFileTypes: true });
                        let limit = 1000;
                        let isTruncated = entries.length > limit;
                        let names = entries.slice(0, limit).map((e) => e.name);

                        if (isTruncated) {
                            names.push(`… and ${entries.length - limit} more entries`);
                        }

                        let listing = names.join('\n');

                        logTelemetry("tengu_at_mention_extracting_directory_success", {});

                        return {
                            type: "directory",
                            path: absolutePath,
                            content: listing,
                            displayPath: getRelativePath(getCwd(), absolutePath)
                        };
                    } catch {
                        return null; // Directory listing failed
                    }
                }
            } catch {
                // statAsync failed, assume it's a file
            }

            // Load file contents (handles text, image, notebook, PDF)
            return await loadFileAttachment(
                absolutePath,
                sessionContext,
                "tengu_at_mention_extracting_filename_success",
                "tengu_at_mention_extracting_filename_error",
                "at-mention",
                {
                    offset: lineStart,
                    limit: lineEnd && lineStart ? lineEnd - lineStart + 1 : undefined
                }
            );

        } catch (error) {
            logTelemetry("tengu_at_mention_extracting_filename_error", {});
            return null; // Skip failed mentions
        }
    }));

    // Filter out nulls (failed/blocked mentions)
    return attachments.filter(Boolean);
}

// Mapping: RuY→extractAtMentionedFiles, A→userMessage, q→sessionContext, K→mentionedPaths, Y→appState, _→mentionPath, w→rawFilename, O→lineStart, $→lineEnd, H→absolutePath, J→entries, M→limit, D→isTruncated, X→names, P→listing, W→entry
//          FuY→parseAtMentions, QuY→parseFilePathWithLineRange, L4→resolveAbsolutePath, rT6→isSandboxBlocked, qqq→statAsync, Aqq→readdirAsync, d→logTelemetry, tF8→loadFileAttachment, Bl→getRelativePath, G1→getCwd
```

**Key behaviors**:
- **Line range support**: Parses `@"file.txt#L10-20"` syntax to load specific lines
- **Directory handling**: If mention is a directory, lists contents with 1000-entry limit
- **Sandbox awareness**: Silently skips files blocked by sandbox permissions
- **Failure isolation**: Each mention processed independently; failures don't affect others
- **Telemetry tracking**: Records success/failure for analytics

### 2. SuY (extractMcpResources)

Fetches MCP resources referenced by @server:uri syntax.

```javascript
// ============================================
// extractMcpResources - Fetch MCP resources from @server:uri mentions
// Location: chunks.147.mjs:464-495
// ============================================

// ORIGINAL (for source lookup):
async function SuY(A, q) {
    let K = puY(A);
    if (K.length === 0) return [];
    let Y = q.options.mcpClients || [];
    return (await Promise.all(K.map(async (_) => {
        try {
            let [w, ...O] = _.split(":"), $ = O.join(":");
            if (!w || !$) return d("tengu_at_mention_mcp_resource_error", {}), null;
            let H = Y.find((M) => M.name === w);
            if (!H || H.type !== "connected") return d("tengu_at_mention_mcp_resource_error", {}), null;
            let J = (q.options.mcpResources?.[w] || []).find((M) => M.uri === $);
            if (!J) return d("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let M = await H.client.readResource({
                    uri: $
                });
                return d("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: w,
                    uri: $,
                    name: J.name || $,
                    description: J.description,
                    content: M
                }
            } catch (M) {
                return d("tengu_at_mention_mcp_resource_error", {}), _6(M), null
            }
        } catch {
            return d("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((_) => _ !== null)
}

// READABLE (for understanding):
async function extractMcpResources(userMessage, sessionContext) {
    // Parse all @server:uri mentions from user message
    let mentionedResources = parseMcpResourceMentions(userMessage);

    if (mentionedResources.length === 0) {
        return [];
    }

    // Get list of connected MCP clients
    let mcpClients = sessionContext.options.mcpClients || [];

    // Fetch each resource in parallel
    return (await Promise.all(mentionedResources.map(async (resourceString) => {
        try {
            // Parse "server:uri" format (may have colons in URI, so split carefully)
            let [serverName, ...uriParts] = resourceString.split(":");
            let resourceUri = uriParts.join(":"); // Rejoin URI parts (e.g., "file:///path")

            // Validate format
            if (!serverName || !resourceUri) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // Find connected client for this server
            let client = mcpClients.find((c) => c.name === serverName);
            if (!client || client.type !== "connected") {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // Find resource metadata from server's resource list
            let resourceMetadata = (sessionContext.options.mcpResources?.[serverName] || [])
                .find((r) => r.uri === resourceUri);

            if (!resourceMetadata) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // Fetch resource contents via MCP protocol
            try {
                let resourceContents = await client.client.readResource({
                    uri: resourceUri
                });

                logTelemetry("tengu_at_mention_mcp_resource_success", {});

                return {
                    type: "mcp_resource",
                    server: serverName,
                    uri: resourceUri,
                    name: resourceMetadata.name || resourceUri,
                    description: resourceMetadata.description,
                    content: resourceContents
                };
            } catch (fetchError) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                logError(fetchError);
                return null;
            }

        } catch (error) {
            logTelemetry("tengu_at_mention_mcp_resource_error", {});
            return null;
        }
    }))).filter((attachment) => attachment !== null);
}

// Mapping: SuY→extractMcpResources, A→userMessage, q→sessionContext, K→mentionedResources, Y→mcpClients, _→resourceString, w→serverName, O→uriParts, $→resourceUri, H→client, J→resourceMetadata, M→resourceContents or fetchError
//          puY→parseMcpResourceMentions, d→logTelemetry, _6→logError
```

**Key behaviors**:
- **URI splitting**: Carefully handles colons in URIs (e.g., `@server:file:///path`)
- **Connection validation**: Checks server is connected before attempting fetch
- **Resource metadata**: Enriches attachment with name/description from server's resource list
- **Graceful degradation**: Returns null for missing/disconnected servers without crashing

### 3. huY (extractAgentMentions)

Identifies agent invocation requests via @agent-name or @"agent-name (agent)" syntax.

```javascript
// ============================================
// extractAgentMentions - Parse agent invocation requests
// Location: chunks.147.mjs:450-462
// ============================================

// ORIGINAL (for source lookup):
function huY(A, q) {
    let K = wqq(A);
    if (K.length === 0) return [];
    return K.map((z) => {
        let _ = z.replace("agent-", ""),
            w = q.find((O) => O.agentType === _);
        if (!w) return d("tengu_at_mention_agent_not_found", {}), null;
        return d("tengu_at_mention_agent_success", {}), {
            type: "agent_mention",
            agentType: w.agentType
        }
    }).filter((z) => z !== null)
}

// READABLE (for understanding):
function extractAgentMentions(userMessage, activeAgents) {
    // Parse all agent mentions from user message (e.g., @agent-explore, @"Explore (agent)")
    let mentionedAgentIds = parseAgentMentions(userMessage);

    if (mentionedAgentIds.length === 0) {
        return [];
    }

    // Map mentions to agent definitions
    return mentionedAgentIds.map((agentId) => {
        // Remove "agent-" prefix if present (e.g., "agent-explore" → "explore")
        let agentType = agentId.replace("agent-", "");

        // Find agent definition in active agents list
        let agentDefinition = activeAgents.find((agent) => agent.agentType === agentType);

        if (!agentDefinition) {
            logTelemetry("tengu_at_mention_agent_not_found", {});
            return null;
        }

        logTelemetry("tengu_at_mention_agent_success", {});

        return {
            type: "agent_mention",
            agentType: agentDefinition.agentType
        };
    }).filter((mention) => mention !== null);
}

// Mapping: huY→extractAgentMentions, A→userMessage, q→activeAgents, K→mentionedAgentIds, z→agentId, _→agentType, w→agentDefinition, O→agent
//          wqq→parseAgentMentions, d→logTelemetry
```

**Key behaviors**:
- **Dual syntax support**: Handles both `@agent-explore` and `@"Explore (agent)"` formats
- **Prefix normalization**: Strips "agent-" prefix for consistent lookup
- **Validation**: Returns null for unknown agents (user typos or unavailable agent types)
- **No async work**: Synchronous since it only validates against in-memory agent list

---

## Deep Dive: Always-Computed Producers

### 4. CuY (getChangedFilesAttachment)

Detects modifications to files that were previously read during the session.

```javascript
// ============================================
// getChangedFilesAttachment - Detect modifications to watched files
// Location: chunks.147.mjs:497-539
// ============================================

// ORIGINAL (for source lookup):
async function CuY(A) {
    let q = jB(A.readFileState);
    if (q.length === 0) return [];
    let K = A.getAppState();
    return (await Promise.all(q.map(async (z) => {
        let _ = A.readFileState.get(z);
        if (!_) return null;
        if (_.offset !== void 0 || _.limit !== void 0) return null;
        let w = L4(z);
        if (rT6(w, K.toolPermissionContext)) return null;
        try {
            if (Jh(w) <= _.timestamp) return null;
            let O = {
                file_path: w
            };
            if (!(await L9.validateInput(O, A)).result) return null;
            let H = await L9.call(O, A);
            if (H.data.type === "text") {
                let j = Bf7(_.content, H.data.file.content);
                if (j === "") return null;
                return {
                    type: "edited_text_file",
                    filename: w,
                    snippet: j
                }
            }
            if (H.data.type === "image") try {
                let j = await XV8(w);
                return {
                    type: "edited_image_file",
                    filename: w,
                    content: j
                }
            } catch (j) {
                return _6(j), d("tengu_watched_file_compression_failed", {
                    file: w
                }), null
            }
        } catch {
            return A.readFileState.delete(z), null
        }
    }))).filter((z) => z !== null)
}

// READABLE (for understanding):
async function getChangedFilesAttachment(sessionContext) {
    let appState = await sessionContext.getAppState();

    // Check each file in the read file state cache
    return (await Promise.all(Array.from(sessionContext.readFileState.keys()).map(async (relativeFilePath) => {
        // Get cached file state (content, timestamp, offset, limit)
        let cachedState = sessionContext.readFileState.get(relativeFilePath);

        if (!cachedState) {
            return null; // Race condition: file removed from cache
        }

        // Skip files that were read with offset/limit (partial reads)
        // We only watch files that were read in full
        if (cachedState.offset !== undefined || cachedState.limit !== undefined) {
            return null;
        }

        // Resolve to absolute path
        let absolutePath = resolveAbsolutePath(relativeFilePath);

        // Check if file is now sandboxed
        if (isSandboxBlocked(absolutePath, appState.toolPermissionContext)) {
            return null;
        }

        try {
            // Check if file was modified since we cached it
            if (getFileModificationTime(absolutePath) <= cachedState.timestamp) {
                return null; // No changes
            }

            // Re-read file to get new contents
            let readInput = {
                file_path: absolutePath
            };

            // Validate file is still readable
            if (!(await ReadTool.validateInput(readInput, sessionContext)).result) {
                return null; // File no longer readable (deleted, permissions changed)
            }

            let readResult = await ReadTool.call(readInput, sessionContext);

            // Special case: If this is the todo file, return todo reminder
            let agentId = sessionContext.agentId ?? getMainAgentId();
            if (absolutePath === getTodoFilePath(agentId)) {
                // Only provide todo reminder if TodoWrite tool is available
                if (!sessionContext.options.tools.some((tool) => tool.name === TODO_WRITE_TOOL_NAME)) {
                    return null;
                }

                let todoItems = parseTodoFile(agentId);
                return {
                    type: "todo",
                    content: todoItems,
                    itemCount: todoItems.length,
                    context: "file-watch"
                };
            }

            // Handle text files: generate diff snippet
            if (readResult.data.type === "text") {
                let diffSnippet = generateDiffSnippet(cachedState.content, readResult.data.file.content);

                // Skip if no meaningful changes (whitespace only)
                if (diffSnippet === "") {
                    return null;
                }

                return {
                    type: "edited_text_file",
                    filename: absolutePath,
                    snippet: diffSnippet
                };
            }

            // Handle image files: re-compress and include
            if (readResult.data.type === "image") {
                try {
                    let compressedImage = await compressImageForLLM(absolutePath);
                    return {
                        type: "edited_image_file",
                        filename: absolutePath,
                        content: compressedImage
                    };
                } catch (compressionError) {
                    logError(compressionError);
                    logTelemetry("tengu_watched_file_compression_failed", {
                        file: absolutePath
                    });
                    return null;
                }
            }

        } catch (error) {
            logTelemetry("tengu_watched_file_stat_error", {});
            return null;
        }
    }))).filter((attachment) => attachment !== null);
}

// Mapping: CuY→getChangedFilesAttachment, A→sessionContext, q→appState, Th()→Array.from, Y→relativeFilePath or attachment, z→cachedState, w→absolutePath, H→readInput, O→readResult, _→agentId, J→todoItems or compressedImage, X→tool, g4→resolveAbsolutePath, sW1→isSandboxBlocked, aW→getFileModificationTime, i5→ReadTool, Lp→getTodoFilePath, U6()→getMainAgentId, cg→TODO_WRITE_TOOL_NAME, UB→parseTodoFile, DjA→generateDiffSnippet, vyA→compressImageForLLM, K1→logError, c→logTelemetry
```

**Key behaviors**:
- **File watch scope**: Only watches files read in full (not partial reads with offset/limit)
- **Modification detection**: Compares file mtime against cached timestamp
- **Diff generation**: For text files, generates human-readable diff snippet showing changes
- **Todo file special case**: If the todo file changed, returns todo reminder instead of diff
- **Image handling**: Re-compresses modified images for token efficiency
- **Graceful handling**: Ignores deleted files, permission changes, sandbox transitions

**Key insight**: This producer implements **implicit file watching** without OS-level inotify/FSEvents. The agent loop calls this on every turn, making it a **polling-based change detector**. The trade-off: simple implementation vs potential latency (changes detected on next turn, not immediately).

### 5. DuY (getPlanModeAttachment)

Injects plan mode instructions when the agent is in planning mode.

```javascript
// ============================================
// getPlanModeAttachment - Inject plan mode instructions
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    if ((await q.getAppState()).toolPermissionContext.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {
            turnCount: _,
            foundPlanModeAttachment: J
        } = chY(A);
        if (J && _ < ii4.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = uW(q.agentId),
        w = pD(q.agentId),
        H = [];
    if (aL6() && w !== null) H.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), OT(!1);
    let O = (lhY(A ?? []) + 1) % ii4.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return H.push({
        type: "plan_mode",
        reminderType: O,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: w !== null
    }), H
}

// READABLE (for understanding):
async function getPlanModeAttachment(messages, sessionContext) {
    // Check if plan mode is active
    if ((await sessionContext.getAppState()).toolPermissionContext.mode !== "plan") {
        return [];
    }

    // Frequency throttling: Don't send plan mode reminder on every turn
    if (messages && messages.length > 0) {
        let {
            turnCount: turnsSinceLastPlanAttachment,
            foundPlanModeAttachment: foundPreviousAttachment
        } = countTurnsSincePlanMode(messages);

        // If we found a previous plan mode attachment and haven't reached the threshold,
        // skip this turn
        if (foundPreviousAttachment && turnsSinceLastPlanAttachment < PLAN_MODE_TURNS_BETWEEN_ATTACHMENTS) {
            return [];
        }
    }

    // Get plan file path for this agent
    let planFilePath = getPlanFilePath(sessionContext.agentId);

    // Check if plan file exists
    let planFileContents = readPlanFileIfExists(sessionContext.agentId);

    let attachments = [];

    // Check if this is a plan mode re-entry (user previously exited, now re-entering)
    if (isPlanModeReentryDetected() && planFileContents !== null) {
        // Add reentry notification
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });

        // Clear reentry flag (only notify once)
        clearPlanModeReentryFlag(false);
    }

    // Determine reminder type: full or sparse
    // Every N attachments, send full reminder; otherwise send sparse
    let planModeAttachmentCount = countPlanModeReminders(messages ?? []);
    let reminderType = (planModeAttachmentCount + 1) % PLAN_MODE_FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";

    // Add main plan mode attachment
    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,
        isSubAgent: !!sessionContext.agentId,
        planFilePath: planFilePath,
        planExists: planFileContents !== null
    });

    return attachments;
}

// Mapping: DuY→getPlanModeAttachment, A→messages, q→sessionContext, _→turnsSinceLastPlanAttachment, J→foundPreviousAttachment, z→planFilePath, w→planFileContents, H→attachments, O→reminderType, chY→countTurnsSincePlanMode, ii4→PLAN_MODE_CONSTANTS, uW→getPlanFilePath, pD→readPlanFileIfExists, aL6()→isPlanModeReentryDetected, OT→clearPlanModeReentryFlag, lhY→countPlanModeReminders
```

**Frequency algorithm**:

1. **Turn-based throttling**: Only send reminder every N turns (controlled by `TURNS_BETWEEN_ATTACHMENTS`)
2. **Full vs sparse**: Every Mth reminder is "full" (complete instructions), others are "sparse" (short reminder)
3. **Reentry detection**: If user exited and re-entered plan mode, send special reentry notification

### Turn Counting Functions

```javascript
// ============================================
// countTurnsSincePlanMode - Count assistant turns since last plan mode attachment
// Location: chunks.147.mjs:2003-2020
// ============================================

// ORIGINAL (for source lookup):
function chY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (bg1(z)) continue;
            q++
        } else if (z?.type === "attachment" && (z.attachment.type === "plan_mode" || z.attachment.type === "plan_mode_reentry")) {
            K = !0;
            break
        }
    }
    return {
        turnCount: q,
        foundPlanModeAttachment: K
    }
}

// READABLE (for understanding):
function countTurnsSincePlanMode(messages) {
    let assistantTurnCount = 0;
    let foundPlanModeAttachment = false;

    // Walk backwards through message history
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip meta-only messages)
        if (message?.type === "assistant") {
            if (isMetaOnlyMessage(message)) {
                continue; // Don't count meta-only assistant messages
            }
            assistantTurnCount++;
        }
        // Stop when we find a plan mode attachment
        else if (message?.type === "attachment" &&
                 (message.attachment.type === "plan_mode" ||
                  message.attachment.type === "plan_mode_reentry")) {
            foundPlanModeAttachment = true;
            break;
        }
    }

    return {
        turnCount: assistantTurnCount,
        foundPlanModeAttachment: foundPlanModeAttachment
    };
}

// Mapping: chY→countTurnsSincePlanMode, A→messages, q→assistantTurnCount, K→foundPlanModeAttachment, Y→i, z→message, bg1→isMetaOnlyMessage
```

```javascript
// ============================================
// countPlanModeReminders - Count how many plan mode reminders have been sent
// Location: chunks.147.mjs:2022-2032
// ============================================

// ORIGINAL (for source lookup):
function lhY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "attachment") {
            if (Y.attachment.type === "plan_mode_exit") break;
            if (Y.attachment.type === "plan_mode") q++
        }
    }
    return q
}

// READABLE (for understanding):
function countPlanModeReminders(messages) {
    let reminderCount = 0;

    // Walk backwards through message history
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        if (message?.type === "attachment") {
            // Stop counting when we hit plan_mode_exit (entered plan mode on this session)
            if (message.attachment.type === "plan_mode_exit") {
                break;
            }

            // Count plan_mode attachments
            if (message.attachment.type === "plan_mode") {
                reminderCount++;
            }
        }
    }

    return reminderCount;
}

// Mapping: lhY→countPlanModeReminders, A→messages, q→reminderCount, K→i, Y→message
```

**Key behaviors**:
- **Reentry detection**: Tracks whether user exited and re-entered plan mode, notifying LLM to read existing plan first
- **Frequency modulation**: Sends full instructions on first reminder and every Nth thereafter; sparse in between
- **Subagent awareness**: Passes `isSubAgent` flag so normalizer can send simpler instructions for subagents

### 6. ruY (getTodoReminderAttachment)

Reminds the LLM to use TodoWrite tool when it hasn't been used recently.

```javascript
// ============================================
// getTodoReminderAttachment - Remind LLM to use TodoWrite tool
// Location: chunks.147.mjs:2645-2661
// ============================================

// ORIGINAL (for source lookup):
async function ruY(A, q) {
    if (!q.options.tools.some((z) => z.name === cg)) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTodoWrite: K,
        turnsSinceLastReminder: Y
    } = ZIY(A);
    if (K >= eW6.TURNS_SINCE_WRITE && Y >= eW6.TURNS_BETWEEN_REMINDERS) {
        let z = UB(q.agentId ?? U6());
        return [{
            type: "todo_reminder",
            content: z,
            itemCount: z.length
        }]
    }
    return []
}

// READABLE (for understanding):
async function getTodoReminderAttachment(messages, sessionContext) {
    // Only provide reminder if TodoWrite tool is available
    if (!sessionContext.options.tools.some((tool) => tool.name === TODO_WRITE_TOOL_NAME)) {
        return [];
    }

    // Need message history to determine reminder timing
    if (!messages || messages.length === 0) {
        return [];
    }

    // Count turns since last TodoWrite usage and last reminder
    let {
        turnsSinceLastTodoWrite: turnsSinceWrite,
        turnsSinceLastReminder: turnsSinceReminder
    } = analyzeToDoUsageHistory(messages);

    // Send reminder if both thresholds exceeded
    if (turnsSinceWrite >= TODO_REMINDER_TURNS_SINCE_WRITE &&
        turnsSinceReminder >= TODO_REMINDER_TURNS_BETWEEN_REMINDERS) {

        // Load current todo list
        let todoItems = parseTodoFile(sessionContext.agentId ?? getMainAgentId());

        return [{
            type: "todo_reminder",
            content: todoItems,
            itemCount: todoItems.length
        }];
    }

    return [];
}

// Mapping: ruY→getTodoReminderAttachment, A→messages, q→sessionContext, z→todoItems, K→turnsSinceWrite, Y→turnsSinceReminder, cg→TODO_WRITE_TOOL_NAME, ZIY→analyzeToDoUsageHistory, eW6→TODO_REMINDER_CONSTANTS, UB→parseTodoFile, U6()→getMainAgentId
```

**Reminder logic**:
1. Tool must be available (skip if TodoWrite not in tool set)
2. Must have message history
3. **Both** conditions must be true:
   - N turns since last TodoWrite tool use
   - M turns since last todo reminder (avoids reminder spam)
4. Includes current todo list contents in reminder

---

## Deep Dive: Main-Agent-Only Producers

### 7. kuY (getIdeSelectionAttachment)

Reports text selected by user in IDE.

```javascript
// ============================================
// getIdeSelectionAttachment - Report IDE text selection
// Location: chunks.147.mjs:306-320
// ============================================

// ORIGINAL (for source lookup):
async function kuY(A, q) {
    let K = T$6(q.options.mcpClients);
    if (!K || A?.lineStart === void 0 || !A.text || !A.filePath) return [];
    let Y = await q.getAppState();
    if (sW1(A.filePath, Y.toolPermissionContext)) return [];
    return [{
        type: "selected_lines_in_ide",
        ideName: K,
        lineStart: A.lineStart,
        lineEnd: A.lineStart + A.lineCount - 1,
        filename: A.filePath,
        content: A.text
    }]
}

// READABLE (for understanding):
async function getIdeSelectionAttachment(ideContext, sessionContext) {
    // Detect IDE name from MCP clients (e.g., "VS Code", "Cursor")
    let ideName = detectIdeName(sessionContext.options.mcpClients);

    // Validate IDE context has selection data
    if (!ideName ||
        ideContext?.lineStart === undefined ||
        !ideContext.text ||
        !ideContext.filePath) {
        return [];
    }

    // Check if file is sandboxed
    let appState = await sessionContext.getAppState();
    if (isSandboxBlocked(ideContext.filePath, appState.toolPermissionContext)) {
        return [];
    }

    // Return selection attachment
    return [{
        type: "selected_lines_in_ide",
        ideName: ideName,
        lineStart: ideContext.lineStart,
        lineEnd: ideContext.lineStart + ideContext.lineCount - 1,
        filename: ideContext.filePath,
        content: ideContext.text
    }];
}

// Mapping: kuY→getIdeSelectionAttachment, A→ideContext, q→sessionContext, K→ideName, Y→appState, T$6→detectIdeName, sW1→isSandboxBlocked
```

**Key behaviors**:
- **IDE detection**: Infers IDE name from MCP client list (VS Code, Cursor, etc.)
- **Selection validation**: Requires lineStart, text, and filePath to be present
- **Sandbox check**: Silently skips selections from sandboxed files
- **Line range calculation**: Converts lineStart + lineCount to lineStart/lineEnd pair

### 8. luY (getLspDiagnosticsAttachment)

Delivers LSP diagnostics from connected language servers.

```javascript
// ============================================
// getLspDiagnosticsAttachment - Deliver LSP diagnostics
// Location: chunks.147.mjs:2473-2492
// ============================================

// ORIGINAL (for source lookup):
async function luY(A) {
    h("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let q = sm4();
        if (q.length === 0) return [];
        h(`LSP Diagnostics: Found ${q.length} pending diagnostic set(s)`);
        let K = q.map(({
            files: Y
        }) => ({
            type: "diagnostics",
            files: Y,
            isNew: !0
        }));
        if (q.length > 0) tm4(), h(`LSP Diagnostics: Cleared ${q.length} delivered diagnostic(s) from registry`);
        return h(`LSP Diagnostics: Returning ${K.length} diagnostic attachment(s)`), K
    } catch (q) {
        let K = q instanceof Error ? q : Error(String(q));
        return K1(Error(`Failed to get LSP diagnostic attachments: ${K.message}`)), []
    }
}

// READABLE (for understanding):
async function getLspDiagnosticsAttachment(sessionContext) {
    logDebug("LSP Diagnostics: getLSPDiagnosticAttachments called");

    try {
        // Get all pending diagnostics from registry
        let pendingDiagnosticSets = getPendingLspDiagnostics();

        if (pendingDiagnosticSets.length === 0) {
            return [];
        }

        logDebug(`LSP Diagnostics: Found ${pendingDiagnosticSets.length} pending diagnostic set(s)`);

        // Convert each diagnostic set to attachment format
        let attachments = pendingDiagnosticSets.map(({files: fileList}) => ({
            type: "diagnostics",
            files: fileList,
            isNew: true
        }));

        // Clear delivered diagnostics from registry
        if (pendingDiagnosticSets.length > 0) {
            clearDeliveredLspDiagnostics();
            logDebug(`LSP Diagnostics: Cleared ${pendingDiagnosticSets.length} delivered diagnostic(s) from registry`);
        }

        logDebug(`LSP Diagnostics: Returning ${attachments.length} diagnostic attachment(s)`);
        return attachments;

    } catch (error) {
        let errorObj = error instanceof Error ? error : Error(String(error));
        logError(Error(`Failed to get LSP diagnostic attachments: ${errorObj.message}`));
        return [];
    }
}

// Mapping: luY→getLspDiagnosticsAttachment, A→sessionContext, q→pendingDiagnosticSets or error, K→attachments or errorObj, Y→fileList, h→logDebug, sm4→getPendingLspDiagnostics, tm4→clearDeliveredLspDiagnostics, K1→logError
```

**Key behaviors**:
- **Pull-based delivery**: Fetches pending diagnostics from global registry
- **Clear-after-deliver**: Removes diagnostics from registry after creating attachments (avoids duplicates)
- **Error resilience**: Returns empty array on failure, ensuring diagnostic errors don't break agent loop
- **Debug logging**: Extensive logging for diagnostic delivery tracking

### 9. tuY (getAsyncHookResponsesAttachment)

Delivers responses from asynchronous hook scripts.

```javascript
// ============================================
// getAsyncHookResponsesAttachment - Deliver async hook responses
// Location: chunks.147.mjs:2758-2789
// ============================================

// ORIGINAL (for source lookup):
async function tuY() {
    let A = await Jn7();
    if (A.length === 0) return [];
    h(`Hooks: getAsyncHookResponseAttachments found ${A.length} responses`);
    let q = A.map(({
        processId: K,
        response: Y,
        hookName: z,
        hookEvent: w,
        toolName: H,
        stdout: $,
        stderr: O,
        exitCode: _
    }) => {
        return h(`Hooks: Creating attachment for ${K} (${z}): ${Q1(Y)}`), {
            type: "async_hook_response",
            processId: K,
            hookName: z,
            hookEvent: w,
            toolName: H,
            response: Y,
            stdout: $,
            stderr: O,
            exitCode: _
        }
    });
    if (A.length > 0) {
        let K = A.map((Y) => Y.processId);
        Xn7(K), h(`Hooks: Removed ${K.length} delivered hooks from registry`)
    }
    return h(`Hooks: getAsyncHookResponseAttachments found ${q.length} attachments`), q
}

// READABLE (for understanding):
async function getAsyncHookResponsesAttachment() {
    // Fetch all pending hook responses from registry
    let pendingResponses = await getPendingHookResponses();

    if (pendingResponses.length === 0) {
        return [];
    }

    logDebug(`Hooks: getAsyncHookResponseAttachments found ${pendingResponses.length} responses`);

    // Convert each response to attachment format
    let attachments = pendingResponses.map(({
        processId: pid,
        response: hookResponse,
        hookName: name,
        hookEvent: event,
        toolName: tool,
        stdout: stdoutOutput,
        stderr: stderrOutput,
        exitCode: code
    }) => {
        logDebug(`Hooks: Creating attachment for ${pid} (${name}): ${JSON.stringify(hookResponse)}`);

        return {
            type: "async_hook_response",
            processId: pid,
            hookName: name,
            hookEvent: event,
            toolName: tool,
            response: hookResponse,
            stdout: stdoutOutput,
            stderr: stderrOutput,
            exitCode: code
        };
    });

    // Clear delivered responses from registry
    if (pendingResponses.length > 0) {
        let processIds = pendingResponses.map((r) => r.processId);
        removeDeliveredHookResponses(processIds);
        logDebug(`Hooks: Removed ${processIds.length} delivered hooks from registry`);
    }

    logDebug(`Hooks: getAsyncHookResponseAttachments found ${attachments.length} attachments`);
    return attachments;
}

// Mapping: tuY→getAsyncHookResponsesAttachment, A→pendingResponses, q→attachments, K→pid or processIds, Y→hookResponse or r, z→name, w→event, H→tool, $→stdoutOutput, O→stderrOutput, _→code, h→logDebug, Jn7→getPendingHookResponses, Q1→JSON.stringify, Xn7→removeDeliveredHookResponses
```

**Key behaviors**:
- **Async hook delivery**: Hooks can run asynchronously (background processes), this producer fetches their results
- **Rich context**: Includes stdout, stderr, exitCode for debugging
- **Clear-after-deliver**: Removes responses from registry after attachment creation
- **Hook response structure**: Contains both raw output and structured response object

---

## Deep Dive: v2.1.76 New Producers

The following producers were added in v2.1.76 to support new features and enhanced context awareness.

### 10. fuY (getDateChangeAttachment)

**Location**: `chunks.147.mjs:237-246`

**What it does**: Detects when the calendar date has changed between turns and notifies the LLM.

```javascript
// ============================================
// getDateChangeAttachment - Detect date rollover
// Location: chunks.147.mjs:237-246
// ============================================

// ORIGINAL (for source lookup):
function fuY() {
    let A = GD6(),
        q = tu1();
    if (q === null) return dw6(A), [];
    if (A === q) return [];
    return a2.cache.clear?.(), dw6(A), [{
        type: "date_change",
        newDate: A
    }]
}

// READABLE (for understanding):
function getDateChangeAttachment() {
    let currentDate = getCurrentDate();
    let lastRecordedDate = getLastRecordedDate();

    // First run - just record the date
    if (lastRecordedDate === null) {
        recordCurrentDate(currentDate);
        return [];
    }

    // No change - skip
    if (currentDate === lastRecordedDate) {
        return [];
    }

    // Date changed - clear caches and notify
    dateCache.cache.clear?.();
    recordCurrentDate(currentDate);

    return [{
        type: "date_change",
        newDate: currentDate
    }];
}

// Mapping: fuY→getDateChangeAttachment, A→currentDate, q→lastRecordedDate, GD6→getCurrentDate, tu1→getLastRecordedDate, dw6→recordCurrentDate, a2→dateCache
```

**Key behaviors**:
- **First-run initialization**: Records date on first call, no attachment
- **Cache invalidation**: Clears date-related caches when date changes
- **Simple detection**: String comparison of ISO date strings

---

### 11. TuY (getUltrathinkEffortAttachment)

**Location**: `chunks.147.mjs:248-254`

**What it does**: Notifies the LLM about extended thinking mode and reasoning effort level.

```javascript
// ============================================
// getUltrathinkEffortAttachment - Extended thinking mode notification
// Location: chunks.147.mjs:248-254
// ============================================

// ORIGINAL (for source lookup):
function TuY(A) {
    if (!GU() || !A || !pG7(A)) return [];
    return d("tengu_ultrathink", {}), [{
        type: "ultrathink_effort",
        level: "high"
    }]
}

// READABLE (for understanding):
function getUltrathinkEffortAttachment(mainLoopModel) {
    // Check if extended thinking is enabled and model supports it
    if (!isExtendedThinkingEnabled() || !mainLoopModel || !modelSupportsExtendedThinking(mainLoopModel)) {
        return [];
    }

    // Log telemetry for ultrathink usage
    logTelemetry("tengu_ultrathink", {});

    return [{
        type: "ultrathink_effort",
        level: "high"
    }];
}

// Mapping: TuY→getUltrathinkEffortAttachment, A→mainLoopModel, GU→isExtendedThinkingEnabled, pG7→modelSupportsExtendedThinking, d→logTelemetry
```

**Key behaviors**:
- **Feature flag check**: Requires extended thinking to be enabled
- **Model capability check**: Only activates for models that support extended thinking
- **Telemetry logging**: Tracks ultrathink usage for analytics

---

### 12. xE1 (getDeferredToolsDeltaAttachment)

**Location**: `chunks.147.mjs:256-267`

**What it does**: Tracks changes in deferred MCP tool availability and notifies the LLM about newly available or removed tools.

```javascript
// ============================================
// getDeferredToolsDeltaAttachment - Deferred tools availability changes
// Location: chunks.147.mjs:256-267
// ============================================

// ORIGINAL (for source lookup):
function xE1(A, q, K) {
    if (!ki6()) return [];
    if (!dk()) return [];
    if (!Vi6(q)) return [];
    if (!bz6(A)) return [];
    let Y = eF8(A, K ?? []);
    if (!Y) return [];
    return [{
        type: "deferred_tools_delta",
        ...Y
    }]
}

// READABLE (for understanding):
function getDeferredToolsDeltaAttachment(tools, mainLoopModel, previousTools) {
    // Feature flag checks
    if (!isDeferredToolsEnabled()) return [];
    if (!isToolDeltaTrackingEnabled()) return [];
    if (!modelSupportsDeferredTools(mainLoopModel)) return [];
    if (!hasDeferredTools(tools)) return [];

    // Compute the delta between current and previous tool sets
    let delta = computeDeferredToolsDelta(tools, previousTools ?? []);
    if (!delta) return [];

    return [{
        type: "deferred_tools_delta",
        ...delta  // Contains addedLines and removedNames
    }];
}

// Mapping: xE1→getDeferredToolsDeltaAttachment, A→tools, q→mainLoopModel, K→previousTools
//          ki6→isDeferredToolsEnabled, dk→isToolDeltaTrackingEnabled, Vi6→modelSupportsDeferredTools
//          bz6→hasDeferredTools, eF8→computeDeferredToolsDelta, Y→delta
```

**Key behaviors**:
- **Multiple feature flags**: Requires multiple capabilities to be enabled
- **Delta computation**: Compares current vs previous tool sets
- **ToolSearch integration**: Output instructs LLM to use ToolSearch for discovery

---

### 13. uE1 (getMcpInstructionsDeltaAttachment)

**Location**: `chunks.147.mjs:269-282`

**What it does**: Tracks changes in MCP server instructions and notifies the LLM about added or removed instructions.

```javascript
// ============================================
// getMcpInstructionsDeltaAttachment - MCP instruction changes
// Location: chunks.147.mjs:269-282
// ============================================

// ORIGINAL (for source lookup):
function uE1(A, q, K, Y) {
    if (!iT6()) return [];
    let z = [];
    if (dk() && Vi6(K) && bz6(q)) z.push({
        serverName: lv,
        block: kE1
    });
    let _ = c4q(A, Y ?? [], z);
    if (!_) return [];
    return [{
        type: "mcp_instructions_delta",
        ..._
    }]
}

// READABLE (for understanding):
function getMcpInstructionsDeltaAttachment(instructions, mainLoopModel, tools, previousInstructions) {
    // Feature flag check
    if (!isMcpInstructionsEnabled()) return [];

    let addedBlocks = [];

    // Check for new instructions from MCP servers
    if (isInstructionTrackingEnabled() && modelSupportsMcpInstructions(mainLoopModel) && hasMcpTools(tools)) {
        addedBlocks.push({
            serverName: SERVER_NAME,
            block: INSTRUCTION_BLOCK
        });
    }

    // Compute delta between current and previous instructions
    let delta = computeInstructionsDelta(instructions, previousInstructions ?? [], addedBlocks);
    if (!delta) return [];

    return [{
        type: "mcp_instructions_delta",
        ...delta  // Contains addedBlocks and removedBlocks
    }];
}

// Mapping: uE1→getMcpInstructionsDeltaAttachment, A→instructions, q→mainLoopModel, K→tools, Y→previousInstructions
//          iT6→isMcpInstructionsEnabled, dk→isInstructionTrackingEnabled, Vi6→modelSupportsMcpInstructions
//          bz6→hasMcpTools, z→addedBlocks, _→delta, c4q→computeInstructionsDelta
```

**Key behaviors**:
- **Dynamic instructions**: MCP servers can provide custom instructions that change at runtime
- **Delta tracking**: Only notifies when instructions actually change
- **Rich content**: Full instruction blocks are included in the attachment

---

### 14. vuY (getCriticalSystemReminderAttachment)

**Location**: `chunks.147.mjs:284-291`

**What it does**: Delivers user-provided critical system reminders that require immediate LLM attention.

```javascript
// ============================================
// getCriticalSystemReminderAttachment - Critical alert delivery
// Location: chunks.147.mjs:284-291
// ============================================

// ORIGINAL (for source lookup):
function vuY(A) {
    let q = A.criticalSystemReminder_EXPERIMENTAL;
    if (!q) return [];
    return [{
        type: "critical_system_reminder",
        content: q
    }]
}

// READABLE (for understanding):
function getCriticalSystemReminderAttachment(sessionContext) {
    let content = sessionContext.criticalSystemReminder_EXPERIMENTAL;
    if (!content) return [];

    return [{
        type: "critical_system_reminder",
        content: content
    }];
}

// Mapping: vuY→getCriticalSystemReminderAttachment, A→sessionContext, q→content
```

**Key behaviors**:
- **Experimental feature**: Marked as EXPERIMENTAL, may change
- **User-provided content**: Content comes from session options
- **High priority**: Always delivered when present, bypasses normal filtering

---

### 15. NuY (getOutputStyleAttachment)

**Location**: `chunks.147.mjs:293-300`

**What it does**: Reminds the LLM about the active output style (concise, verbose, etc.).

```javascript
// ============================================
// getOutputStyleAttachment - Output style reminder
// Location: chunks.147.mjs:293-300
// ============================================

// ORIGINAL (for source lookup):
function NuY() {
    let A = C8()?.outputStyle || "default";
    if (A === "default") return [];
    return [{
        type: "output_style",
        style: A
    }]
}

// READABLE (for understanding):
function getOutputStyleAttachment() {
    let outputStyle = getSettings()?.outputStyle || "default";
    if (outputStyle === "default") return [];

    return [{
        type: "output_style",
        style: outputStyle
    }];
}

// Mapping: NuY→getOutputStyleAttachment, A→outputStyle, C8→getSettings
```

**Key behaviors**:
- **Settings integration**: Reads from user settings
- **Default skip**: No attachment when style is "default"
- **Style-specific instructions**: Normalization provides style-specific guidance

---

### 16. ZuY (getAutoModeAttachment)

**Location**: `chunks.147.mjs:214-227`

**What it does**: Injects auto mode instructions when autonomous execution mode is active.

```javascript
// ============================================
// getAutoModeAttachment - Auto mode activation
// Location: chunks.147.mjs:214-227
// ============================================

// ORIGINAL (for source lookup):
async function ZuY(A, q) {
    if (q.getAppState().toolPermissionContext.mode !== "auto") return [];
    if (A && A.length > 0) {
        let {
            turnCount: w,
            foundAutoModeAttachment: O
        } = PuY(A);
        if (O && w < e4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    return [{
        type: "auto_mode",
        reminderType: (WuY(A ?? []) + 1) % e4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse"
    }]
}

// READABLE (for understanding):
async function getAutoModeAttachment(messages, sessionContext) {
    if (sessionContext.getAppState().toolPermissionContext.mode !== "auto") return [];

    // Turn throttling
    if (messages && messages.length > 0) {
        let { turnCount, foundAutoModeAttachment } = countTurnsSinceAutoModeAttachment(messages);
        if (foundAutoModeAttachment && turnCount < AUTO_MODE_CONFIG.TURNS_BETWEEN_ATTACHMENTS) {
            return [];
        }
    }

    // Determine reminder type (full vs sparse)
    let reminderType = (countAutoModeReminders(messages ?? []) + 1) %
                       AUTO_MODE_CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
                       ? "full"
                       : "sparse";

    return [{
        type: "auto_mode",
        reminderType: reminderType
    }];
}

// Mapping: ZuY→getAutoModeAttachment, A→messages, q→sessionContext
//          w→turnCount, O→foundAutoModeAttachment, PuY→countTurnsSinceAutoModeAttachment
//          WuY→countAutoModeReminders, e4q→AUTO_MODE_CONFIG
```

**Key behaviors**:
- **Mode detection**: Checks if auto mode is active
- **Turn throttling**: Uses same pattern as plan mode
- **Full/sparse variants**: Same optimization as plan mode

---

### 17. GuY (getAutoModeExitAttachment)

**Location**: `chunks.147.mjs:229-235`

**What it does**: Notifies the LLM when exiting auto mode.

```javascript
// ============================================
// getAutoModeExitAttachment - Auto mode exit notification
// Location: chunks.147.mjs:229-235
// ============================================

// ORIGINAL (for source lookup):
async function GuY(A) {
    if (!pu1()) return [];
    if (A.getAppState().toolPermissionContext.mode === "auto") return MS(!1), [];
    return MS(!1), [{
        type: "auto_mode_exit"
    }]
}

// READABLE (for understanding):
async function getAutoModeExitAttachment(sessionContext) {
    if (!shouldSendAutoModeExit()) return [];

    // Still in auto mode - clear flag and skip
    if (sessionContext.getAppState().toolPermissionContext.mode === "auto") {
        clearAutoModeExitFlag(false);
        return [];
    }

    clearAutoModeExitFlag(false);

    return [{
        type: "auto_mode_exit"
    }];
}

// Mapping: GuY→getAutoModeExitAttachment, A→sessionContext, pu1→shouldSendAutoModeExit, MS→clearAutoModeExitFlag
```

**Key behaviors**:
- **Exit flag check**: Uses flag to trigger single delivery
- **Mode verification**: Confirms mode has actually changed
- **Flag cleanup**: Always clears the exit flag

### Execution Time Analysis

Based on telemetry sampling (5% of executions), typical producer durations:

| Producer Category | Avg Duration | Max Duration | Notes |
|-------------------|-------------|--------------|-------|
| User-dependent (file parsing) | 50-200ms | 1000ms (timeout) | Depends on @-mention count and file sizes |
| Always-computed (state checks) | 5-50ms | 1000ms (timeout) | Fast path: early exit if no changes |
| Main-agent-only (IDE integration) | 10-100ms | 1000ms (timeout) | LSP queries can be slow |

### Timeout Behavior

The 1-second global timeout is enforced by AbortController:
- **Individual producer timeout**: Each producer is async and can be cancelled via `abortController.signal`
- **Graceful degradation**: If a producer times out, `Hz` wrapper catches the error and returns []
- **No retry**: Timeouts are not retried; the agent proceeds without that attachment

**Rationale**: 1 second is aggressive but intentional. The philosophy is **"better to proceed with incomplete context than to block the agent loop"**. Missing attachments (e.g., no file change detection) are acceptable; a frozen agent is not.

### Memory Optimization

Attachment size limits to prevent token budget exhaustion:

| Attachment Type | Size Limit | Handling |
|----------------|-----------|----------|
| File contents | `AC1` = 2000 lines | Truncate with note, suggest Read tool for more |
| PDF reference | 100 pages | Reference-only attachment with page count, require Read with pages parameter |
| Directory listing | No explicit limit | Shell output typically small |
| MCP resource | No explicit limit | Controlled by MCP server |
| Image files | Compressed | `vyA` (compressImageForLLM) reduces size |
| Diagnostics | Aggregated | `KI.formatDiagnosticsSummary` provides summary, not full details |

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:
- `assembleAllAttachments` (_uY) - Main orchestrator for attachment production, `chunks.147.mjs:3-18`
- `timedAttachmentProducer` (Hz) - Telemetry and error handling wrapper, `chunks.147.mjs:20-46`
- `extractAtMentionedFiles` (RuY) - Parse @-mentions and load file contents, `chunks.147.mjs:407-448`
- `extractMcpResources` (SuY) - Fetch MCP resources from @server:uri mentions, `chunks.147.mjs:464-495`
- `extractAgentMentions` (huY) - Parse agent invocation requests, `chunks.147.mjs:450-462`
- `getChangedFilesAttachment` (CuY) - Detect modifications to watched files, `chunks.147.mjs:497+`
- `getPlanModeAttachment` (DuY) - Inject plan mode instructions, `chunks.147.mjs:136-168`
- `getPlanModeExitAttachment` (XuY) - Notify exit from plan mode, `chunks.147.mjs:170-181`
- `getAutoModeAttachment` (ZuY) - Inject auto mode instructions, `chunks.147.mjs:214-227`
- `getAutoModeExitAttachment` (GuY) - Notify exit from auto mode, `chunks.147.mjs:229-235`
- `getDateChangeAttachment` (fuY) - Detect date rollover, `chunks.147.mjs:237-246`
- `getUltrathinkEffortAttachment` (TuY) - Extended thinking notification, `chunks.147.mjs:248-254`
- `getDeferredToolsDeltaAttachment` (xE1) - Deferred tools changes, `chunks.147.mjs:256-267`
- `getMcpInstructionsDeltaAttachment` (uE1) - MCP instruction changes, `chunks.147.mjs:269-282`
- `getCriticalSystemReminderAttachment` (vuY) - Critical alert delivery, `chunks.147.mjs:284-291`
- `getOutputStyleAttachment` (NuY) - Output style reminder, `chunks.147.mjs:293-300`
- `getIdeSelectionAttachment` (kuY) - Report IDE text selection, `chunks.147.mjs:306-320`
- `getLspDiagnosticsAttachment` (luY) - Deliver LSP diagnostics
- `getAsyncHookResponsesAttachment` (tuY) - Deliver async hook responses
- `countTurnsSincePlanMode` (JuY) - Count assistant turns since last plan mode attachment
- `countPlanModeReminders` (MuY) - Count how many plan mode reminders have been sent
- `countTurnsSinceAutoModeAttachment` (PuY) - Count assistant turns since last auto mode attachment
- `countAutoModeReminders` (WuY) - Count how many auto mode reminders have been sent
- `PLAN_MODE_CONFIG` (t4q) - Plan mode timing constants, `chunks.147.mjs:1231-1235`
- `AUTO_MODE_CONFIG` (e4q) - Auto mode timing constants, `chunks.147.mjs:1236-1240`

---

## Related Documents

- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of 57 reminder types
- [integration_points.md](./integration_points.md) - Cross-module integration analysis
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling deep dive
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance optimization analysis
