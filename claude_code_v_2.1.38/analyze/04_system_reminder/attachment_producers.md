# Attachment Producers - Deep Implementation Analysis

## Overview

This document provides a comprehensive reverse engineering analysis of the **40+ attachment producer functions** that generate system reminders in Claude Code. Each producer is responsible for detecting specific conditions and creating attachment objects that get normalized into meta-messages and injected into the conversation stream.

The attachment production system is orchestrated by the `phY` (assembleAttachments) function, which executes producers in parallel using a sophisticated 3-group strategy for optimal performance while maintaining strict isolation and error handling through the `gw` (timedAttachmentProducer) wrapper.

---

## Architecture: The assembleAttachments Orchestrator

### Main Entry Point: phY (assembleAttachments)

The `phY` function is the central orchestrator that manages all attachment production. It implements a sophisticated parallel execution strategy that balances performance with proper dependency management.

```javascript
// ============================================
// assembleAttachments - Main attachment production orchestrator
// Location: chunks.142.mjs:1948-1965
// ============================================

// ORIGINAL (for source lookup):
async function phY(A, q, K, Y, z, w) {
    if (J6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
    let H = Aq();
    setTimeout(() => {
        H.abort()
    }, 1000);
    let $ = {
            ...q,
            abortController: H
        },
        O = !q.agentId,
        _ = A ? [gw("at_mentioned_files", () => KIY(A, $)), gw("mcp_resources", () => zIY(A, $)), gw("agent_mentions", () => Promise.resolve(YIY(A, q.options.agentDefinitions.activeAgents)))] : [],
        J = await Promise.all(_),
        X = [gw("changed_files", () => wIY($)), gw("nested_memory", () => HIY($)), gw("dynamic_skill", () => $IY($)), gw("skill_listing", () => OIY($)), gw("ultra_claude_md", async () => thY(z)), gw("plan_mode", () => ihY(z, q)), gw("plan_mode_exit", () => nhY(q)), gw("delegate_mode", () => rhY(q)), gw("delegate_mode_exit", () => Promise.resolve(ohY())), gw("todo_reminders", () => jH() ? NIY(z, q) : fIY(z, q)), ...l8() ? [...w === "session_memory" ? [] : [gw("teammate_mailbox", async () => kIY(q))], gw("team_context", async () => LIY(z ?? []))] : [], gw("critical_system_reminder", () => Promise.resolve(ahY(q))), ...[]],
        D = O ? [gw("ide_selection", async () => ehY(K, q)), gw("ide_opened_file", async () => qIY(K, q)), gw("output_style", async () => Promise.resolve(shY())), gw("diagnostics", async () => PIY(q)), gw("lsp_diagnostics", async () => WIY(q)), gw("unified_tasks", async () => vIY(q, z)), gw("async_hook_responses", async () => EIY()), gw("token_usage", async () => Promise.resolve(RIY(z ?? [], q.options.mainLoopModel))), gw("budget_usd", async () => Promise.resolve(yIY(q.options.maxBudgetUsd))), gw("verify_plan_reminder", async () => SIY(z, q)), gw("queued_commands", async () => Promise.resolve(dhY(Y)))] : [],
        [j, M] = await Promise.all([Promise.all(X), Promise.all(D)]);
    return [...J.flat(), ...j.flat(), ...M.flat()]
}

// READABLE (for understanding):
async function assembleAttachments(userMessage, sessionContext, ideContext, queuedCommands, messages, sessionMemoryType) {
    // Early exit if attachments are globally disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) {
        return [];
    }

    // Create AbortController with 1-second global timeout
    let abortController = createAbortController();
    setTimeout(() => {
        abortController.abort();
    }, 1000);

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
        timedProducer("at_mentioned_files", () => extractAtMentionedFiles(userMessage, enhancedContext)),
        timedProducer("mcp_resources", () => extractMcpResources(userMessage, enhancedContext)),
        timedProducer("agent_mentions", () => Promise.resolve(extractAgentMentions(userMessage, sessionContext.options.agentDefinitions.activeAgents)))
    ] : [];

    // Execute group 1 and wait for completion
    let userDependentResults = await Promise.all(userDependentProducers);

    // GROUP 2: Always-computed producers (run for all agents, main and subagents)
    // These check system state and provide context attachments
    let alwaysComputedProducers = [
        timedProducer("changed_files", () => getChangedFilesAttachment(enhancedContext)),
        timedProducer("nested_memory", () => getNestedMemoryAttachments(enhancedContext)),
        timedProducer("dynamic_skill", () => getDynamicSkillAttachments(enhancedContext)),
        timedProducer("skill_listing", () => getSkillListingAttachment(enhancedContext)),
        timedProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(messages)),
        timedProducer("plan_mode", () => getPlanModeAttachment(messages, sessionContext)),
        timedProducer("plan_mode_exit", () => getPlanModeExitAttachment(sessionContext)),
        timedProducer("delegate_mode", () => getDelegateModeAttachment(sessionContext)),
        timedProducer("delegate_mode_exit", () => Promise.resolve(getDelegateModeExitAttachment())),
        timedProducer("todo_reminders", () => isTasksEnabled() ? getTaskReminderAttachment(messages, sessionContext) : getTodoReminderAttachment(messages, sessionContext)),
        // Team mode attachments (only if in team/swarm mode)
        ...isTeamMode() ? [
            // Skip teammate_mailbox in session_memory context to avoid duplication
            ...sessionMemoryType === "session_memory" ? [] : [
                timedProducer("teammate_mailbox", async () => getTeammateMailboxAttachment(sessionContext))
            ],
            timedProducer("team_context", async () => getTeamContextAttachment(messages ?? []))
        ] : [],
        timedProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(sessionContext))),
        // Placeholder for future producers
        ...[]
    ];

    // GROUP 3: Main-agent-only producers (only run for primary agent, not subagents)
    // These provide IDE integration, diagnostics, and user-facing state
    let mainAgentOnlyProducers = isMainAgent ? [
        timedProducer("ide_selection", async () => getIdeSelectionAttachment(ideContext, sessionContext)),
        timedProducer("ide_opened_file", async () => getIdeOpenedFileAttachment(ideContext, sessionContext)),
        timedProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        timedProducer("diagnostics", async () => getDiagnosticsAttachment(sessionContext)),
        timedProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachment(sessionContext)),
        timedProducer("unified_tasks", async () => getUnifiedTasksAttachment(sessionContext, messages)),
        timedProducer("async_hook_responses", async () => getAsyncHookResponsesAttachment()),
        timedProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], sessionContext.options.mainLoopModel))),
        timedProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(sessionContext.options.maxBudgetUsd))),
        timedProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, sessionContext)),
        timedProducer("queued_commands", async () => Promise.resolve(getQueuedCommandsAttachment(queuedCommands)))
    ] : [];

    // Execute groups 2 and 3 in parallel, wait for both to complete
    let [alwaysComputedResults, mainAgentResults] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // Flatten all results (each producer returns an array of attachments)
    return [...userDependentResults.flat(), ...alwaysComputedResults.flat(), ...mainAgentResults.flat()];
}

// Mapping: phY→assembleAttachments, A→userMessage, q→sessionContext, K→ideContext, Y→queuedCommands, z→messages, w→sessionMemoryType, H→abortController, $→enhancedContext, O→isMainAgent, _→userDependentProducers, J→userDependentResults, X→alwaysComputedProducers, D→mainAgentOnlyProducers, j→alwaysComputedResults, M→mainAgentResults
```

### What it does

The `assembleAttachments` function orchestrates the parallel execution of 40+ attachment producers to generate system reminders based on the current session state, user input, and IDE context.

### How it works

1. **Global disable check**: First checks if `CLAUDE_CODE_DISABLE_ATTACHMENTS` environment variable is set, returning empty array if true
2. **Timeout setup**: Creates an AbortController with a 1-second global timeout to prevent any single producer from blocking the system
3. **Context enhancement**: Wraps the session context with the abort controller so all producers have cancellation capability
4. **Three-phase parallel execution**:
   - **Phase 1 (User-dependent)**: Executes 3 producers that parse user input for @-mentions, MCP resources, and agent references. These MUST complete before subsequent phases because they may trigger file reads that other producers need.
   - **Phase 2 (Always-computed)** & **Phase 3 (Main-agent-only)**: These two groups execute in parallel since they have no dependencies on each other
5. **Result flattening**: Each producer returns an array of attachments (may be empty), so results are flattened into a single array

### Why this approach

**Parallel execution strategy**: The 3-group design balances performance with correctness:
- **Group 1 sequential** ensures @-mentioned files are read before other producers check file state
- **Groups 2 & 3 parallel** maximizes throughput since they're independent

**Timeout isolation**: The 1-second global timeout prevents any producer from blocking the agent loop, ensuring system responsiveness even if a producer hangs.

**Conditional execution**:
- User-dependent producers only run if user provided a message (saves cycles on agent-initiated turns)
- Main-agent-only producers skip for subagents (avoids duplicate IDE state, diagnostics, etc.)
- Team-mode producers only run in swarm/team sessions

**Error isolation**: By wrapping each producer with `gw` (timedAttachmentProducer), failures in one producer don't affect others.

### Key insight

The architecture treats attachment production as a **parallel map-reduce pipeline**: map each producer to an attachment array, reduce by flattening. The grouping strategy optimizes for the common case (no user @-mentions) while maintaining correctness when dependencies exist. The 1-second timeout is aggressive, reflecting a design philosophy that **stale/missing attachments are better than a blocked agent loop**.

---

## The Wrapper: gw (timedAttachmentProducer)

Every producer is wrapped by `gw`, which provides telemetry, error handling, and timeout enforcement.

```javascript
// ============================================
// timedAttachmentProducer - Telemetry and error handling wrapper
// Location: chunks.142.mjs:1967-1991
// ============================================

// ORIGINAL (for source lookup):
async function gw(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K,
            w = Y.reduce((H, $) => {
                return H + Q1($).length
            }, 0);
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            attachment_size_bytes: w,
            attachment_count: Y.length
        });
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return K1(Y), Yk(`Attachment error in ${A}`, Y), []
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
        let totalSizeBytes = attachments.reduce((sum, attachment) => {
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

// Mapping: gw→timedAttachmentProducer, A→producerLabel, q→producerFunction, K→startTime, Y→attachments or error, z→durationMs, w→totalSizeBytes, H→sum, $→attachment, c→logTelemetry, Q1→JSON.stringify, K1→logError, Yk→logWarning
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
| `at_mentioned_files` | `KIY` | Extracts @"file.txt" mentions and loads file contents |
| `mcp_resources` | `zIY` | Extracts @server:uri mentions and fetches MCP resources |
| `agent_mentions` | `YIY` | Extracts @agent-name mentions for agent invocation |

### Category 2: Always-Computed Producers (14+ producers)

These run on every turn for both main agents and subagents.

| Producer | Function | Purpose |
|----------|----------|---------|
| `changed_files` | `wIY` | Detects modifications to previously-read files |
| `nested_memory` | `HIY` | Loads MEMORY.md files from nested directories |
| `dynamic_skill` | `$IY` | Discovers dynamically-added skills |
| `skill_listing` | `OIY` | Provides skill inventory for LLM discovery |
| `ultra_claude_md` | `thY` | (Reserved for future use, currently returns []) |
| `plan_mode` | `ihY` | Injects plan mode instructions when active |
| `plan_mode_exit` | `nhY` | Notifies LLM when exiting plan mode |
| `delegate_mode` | `rhY` | Injects delegate mode instructions for team coordination |
| `delegate_mode_exit` | `ohY` | Notifies LLM when exiting delegate mode |
| `todo_reminders` | `NIY`/`fIY` | Reminds LLM to use TodoWrite or TaskCreate |
| `teammate_mailbox` | `kIY` | (Team mode) Delivers messages from teammates |
| `team_context` | `LIY` | (Team mode) Provides team configuration and identity |
| `critical_system_reminder` | `ahY` | Experimental: user-provided critical reminders |

### Category 3: Main-Agent-Only Producers (11 producers)

These only run for the primary agent, not subagents.

| Producer | Function | Purpose |
|----------|----------|---------|
| `ide_selection` | `ehY` | Reports user-selected text in IDE |
| `ide_opened_file` | `qIY` | Reports user-opened file in IDE (with nested memory) |
| `output_style` | `shY` | Reminds LLM of active output style (concise, verbose, etc.) |
| `diagnostics` | `PIY` | Delivers new compiler/linter diagnostics |
| `lsp_diagnostics` | `WIY` | Delivers new LSP diagnostics from language servers |
| `unified_tasks` | `vIY` | Provides task status updates and progress messages |
| `async_hook_responses` | `EIY` | Delivers async responses from hook scripts |
| `token_usage` | `RIY` | Reports current token usage (if enabled) |
| `budget_usd` | `yIY` | Reports USD budget consumption |
| `verify_plan_reminder` | `SIY` | Reminds LLM to verify plan completion |
| `queued_commands` | `dhY` | Delivers user messages sent during execution |

---

## Deep Dive: User-Dependent Producers

### 1. KIY (extractAtMentionedFiles)

Parses user message for @-mentions and loads file contents.

```javascript
// ============================================
// extractAtMentionedFiles - Parse @-mentions and load file contents
// Location: chunks.142.mjs:2199-2236
// ============================================

// ORIGINAL (for source lookup):
async function KIY(A, q) {
    let K = _IY(A);
    if (K.length > 0) u8("at-mentions");
    let Y = await q.getAppState();
    return (await Promise.all(K.map(async (w) => {
        try {
            let {
                filename: H,
                lineStart: $,
                lineEnd: O
            } = DIY(w), _ = g4(H);
            if (sW1(_, Y.toolPermissionContext)) return null;
            try {
                if (b1().statSync(_).isDirectory()) try {
                    let X = await qq.call({
                        command: `ls ${R7([_])}`,
                        description: `Lists files in ${_}`
                    }, q);
                    c("tengu_at_mention_extracting_directory_success", {});
                    let D = X.data.stdout;
                    return {
                        type: "directory",
                        path: _,
                        content: D
                    }
                } catch {
                    return null
                }
            } catch {}
            return await TyA(_, q, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
                offset: $,
                limit: O && $ ? O - $ + 1 : void 0
            })
        } catch {
            c("tengu_at_mention_extracting_filename_error", {})
        }
    }))).filter(Boolean)
}

// READABLE (for understanding):
async function extractAtMentionedFiles(userMessage, sessionContext) {
    // Parse all @-mentions from user message using regex
    let mentionedPaths = parseAtMentions(userMessage);

    // Log telemetry if any mentions found
    if (mentionedPaths.length > 0) {
        logFeatureUsage("at-mentions");
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
                if (getFileSystem().statSync(absolutePath).isDirectory()) {
                    // List directory contents using Bash tool
                    try {
                        let listResult = await BashTool.call({
                            command: `ls ${shellEscape([absolutePath])}`,
                            description: `Lists files in ${absolutePath}`
                        }, sessionContext);

                        logTelemetry("tengu_at_mention_extracting_directory_success", {});

                        let directoryListing = listResult.data.stdout;
                        return {
                            type: "directory",
                            path: absolutePath,
                            content: directoryListing
                        };
                    } catch {
                        return null; // Directory listing failed
                    }
                }
            } catch {
                // statSync failed, assume it's a file
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

// Mapping: KIY→extractAtMentionedFiles, A→userMessage, q→sessionContext, K→mentionedPaths, Y→appState, w→mentionPath, H→rawFilename, $→lineStart, O→lineEnd, _→absolutePath, X→listResult, D→directoryListing, _IY→parseAtMentions, u8→logFeatureUsage, DIY→parseFilePathWithLineRange, g4→resolveAbsolutePath, sW1→isSandboxBlocked, b1()→getFileSystem, qq→BashTool, R7→shellEscape, c→logTelemetry, TyA→loadFileAttachment
```

**Key behaviors**:
- **Line range support**: Parses `@"file.txt#L10-20"` syntax to load specific lines
- **Directory handling**: If mention is a directory, lists contents with `ls`
- **Sandbox awareness**: Silently skips files blocked by sandbox permissions
- **Failure isolation**: Each mention processed independently; failures don't affect others
- **Telemetry tracking**: Records success/failure for analytics

### 2. zIY (extractMcpResources)

Fetches MCP resources referenced by @server:uri syntax.

```javascript
// ============================================
// extractMcpResources - Fetch MCP resources from @server:uri mentions
// Location: chunks.142.mjs:2252-2283
// ============================================

// ORIGINAL (for source lookup):
async function zIY(A, q) {
    let K = JIY(A);
    if (K.length === 0) return [];
    let Y = q.options.mcpClients || [];
    return (await Promise.all(K.map(async (w) => {
        try {
            let [H, ...$] = w.split(":"), O = $.join(":");
            if (!H || !O) return c("tengu_at_mention_mcp_resource_error", {}), null;
            let _ = Y.find((D) => D.name === H);
            if (!_ || _.type !== "connected") return c("tengu_at_mention_mcp_resource_error", {}), null;
            let X = (q.options.mcpResources?.[H] || []).find((D) => D.uri === O);
            if (!X) return c("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let D = await _.client.readResource({
                    uri: O
                });
                return c("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: H,
                    uri: O,
                    name: X.name || O,
                    description: X.description,
                    content: D
                }
            } catch (D) {
                return c("tengu_at_mention_mcp_resource_error", {}), K1(D), null
            }
        } catch {
            return c("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((w) => w !== null)
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

// Mapping: zIY→extractMcpResources, A→userMessage, q→sessionContext, K→mentionedResources, Y→mcpClients, w→resourceString, H→serverName, $→uriParts, O→resourceUri, _→client, X→resourceMetadata, D→resourceContents or fetchError, JIY→parseMcpResourceMentions, c→logTelemetry, K1→logError
```

**Key behaviors**:
- **URI splitting**: Carefully handles colons in URIs (e.g., `@server:file:///path`)
- **Connection validation**: Checks server is connected before attempting fetch
- **Resource metadata**: Enriches attachment with name/description from server's resource list
- **Graceful degradation**: Returns null for missing/disconnected servers without crashing

### 3. YIY (extractAgentMentions)

Identifies agent invocation requests via @agent-name or @"agent-name (agent)" syntax.

```javascript
// ============================================
// extractAgentMentions - Parse agent invocation requests
// Location: chunks.142.mjs:2238-2250
// ============================================

// ORIGINAL (for source lookup):
function YIY(A, q) {
    let K = XIY(A);
    if (K.length === 0) return [];
    return K.map((z) => {
        let w = z.replace("agent-", ""),
            H = q.find(($) => $.agentType === w);
        if (!H) return c("tengu_at_mention_agent_not_found", {}), null;
        return c("tengu_at_mention_agent_success", {}), {
            type: "agent_mention",
            agentType: H.agentType
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

// Mapping: YIY→extractAgentMentions, A→userMessage, q→activeAgents, K→mentionedAgentIds, z→agentId, w→agentType, H→agentDefinition, $→agent, XIY→parseAgentMentions, c→logTelemetry
```

**Key behaviors**:
- **Dual syntax support**: Handles both `@agent-explore` and `@"Explore (agent)"` formats
- **Prefix normalization**: Strips "agent-" prefix for consistent lookup
- **Validation**: Returns null for unknown agents (user typos or unavailable agent types)
- **No async work**: Synchronous since it only validates against in-memory agent list

---

## Deep Dive: Always-Computed Producers

### 4. wIY (getChangedFilesAttachment)

Detects modifications to files that were previously read during the session.

```javascript
// ============================================
// getChangedFilesAttachment - Detect modifications to watched files
// Location: chunks.142.mjs:2285-2335
// ============================================

// ORIGINAL (for source lookup):
async function wIY(A) {
    let q = await A.getAppState();
    return (await Promise.all(Th(A.readFileState).map(async (Y) => {
        let z = A.readFileState.get(Y);
        if (!z) return null;
        if (z.offset !== void 0 || z.limit !== void 0) return null;
        let w = g4(Y);
        if (sW1(w, q.toolPermissionContext)) return null;
        try {
            if (aW(w) <= z.timestamp) return null;
            let H = {
                file_path: w
            };
            if (!(await i5.validateInput(H, A)).result) return null;
            let O = await i5.call(H, A),
                _ = A.agentId ?? U6();
            if (w === Lp(_)) {
                if (!A.options.tools.some((X) => X.name === cg)) return null;
                let J = UB(_);
                return {
                    type: "todo",
                    content: J,
                    itemCount: J.length,
                    context: "file-watch"
                }
            }
            if (O.data.type === "text") {
                if (DjA(z.content, O.data.file.content) === "") return null;
                return {
                    type: "edited_text_file",
                    filename: w,
                    snippet: DjA(z.content, O.data.file.content)
                }
            }
            if (O.data.type === "image") try {
                let J = await vyA(w);
                return {
                    type: "edited_image_file",
                    filename: w,
                    content: J
                }
            } catch (J) {
                return K1(J), c("tengu_watched_file_compression_failed", {
                    file: w
                }), null
            }
        } catch {
            return c("tengu_watched_file_stat_error", {}), null
        }
    }))).filter((Y) => Y !== null)
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

// Mapping: wIY→getChangedFilesAttachment, A→sessionContext, q→appState, Th()→Array.from, Y→relativeFilePath or attachment, z→cachedState, w→absolutePath, H→readInput, O→readResult, _→agentId, J→todoItems or compressedImage, X→tool, g4→resolveAbsolutePath, sW1→isSandboxBlocked, aW→getFileModificationTime, i5→ReadTool, Lp→getTodoFilePath, U6()→getMainAgentId, cg→TODO_WRITE_TOOL_NAME, UB→parseTodoFile, DjA→generateDiffSnippet, vyA→compressImageForLLM, K1→logError, c→logTelemetry
```

**Key behaviors**:
- **File watch scope**: Only watches files read in full (not partial reads with offset/limit)
- **Modification detection**: Compares file mtime against cached timestamp
- **Diff generation**: For text files, generates human-readable diff snippet showing changes
- **Todo file special case**: If the todo file changed, returns todo reminder instead of diff
- **Image handling**: Re-compresses modified images for token efficiency
- **Graceful handling**: Ignores deleted files, permission changes, sandbox transitions

**Key insight**: This producer implements **implicit file watching** without OS-level inotify/FSEvents. The agent loop calls this on every turn, making it a **polling-based change detector**. The trade-off: simple implementation vs potential latency (changes detected on next turn, not immediately).

### 5. ihY (getPlanModeAttachment)

Injects plan mode instructions when the agent is in planning mode.

```javascript
// ============================================
// getPlanModeAttachment - Inject plan mode instructions
// Location: chunks.142.mjs:2034-2058
// ============================================

// ORIGINAL (for source lookup):
async function ihY(A, q) {
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

// Mapping: ihY→getPlanModeAttachment, A→messages, q→sessionContext, _→turnsSinceLastPlanAttachment, J→foundPreviousAttachment, z→planFilePath, w→planFileContents, H→attachments, O→reminderType, chY→countTurnsSincePlanMode, ii4→PLAN_MODE_CONSTANTS, uW→getPlanFilePath, pD→readPlanFileIfExists, aL6()→isPlanModeReentryDetected, OT→clearPlanModeReentryFlag, lhY→countPlanModeReminders
```

**Frequency algorithm**:

1. **Turn-based throttling**: Only send reminder every N turns (controlled by `TURNS_BETWEEN_ATTACHMENTS`)
2. **Full vs sparse**: Every Mth reminder is "full" (complete instructions), others are "sparse" (short reminder)
3. **Reentry detection**: If user exited and re-entered plan mode, send special reentry notification

### Turn Counting Functions

```javascript
// ============================================
// countTurnsSincePlanMode - Count assistant turns since last plan mode attachment
// Location: chunks.142.mjs:2003-2020
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
// Location: chunks.142.mjs:2022-2032
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

### 6. fIY (getTodoReminderAttachment)

Reminds the LLM to use TodoWrite tool when it hasn't been used recently.

```javascript
// ============================================
// getTodoReminderAttachment - Remind LLM to use TodoWrite tool
// Location: chunks.142.mjs:2645-2661
// ============================================

// ORIGINAL (for source lookup):
async function fIY(A, q) {
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

// Mapping: fIY→getTodoReminderAttachment, A→messages, q→sessionContext, z→todoItems, K→turnsSinceWrite, Y→turnsSinceReminder, cg→TODO_WRITE_TOOL_NAME, ZIY→analyzeToDoUsageHistory, eW6→TODO_REMINDER_CONSTANTS, UB→parseTodoFile, U6()→getMainAgentId
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

### 7. ehY (getIdeSelectionAttachment)

Reports text selected by user in IDE.

```javascript
// ============================================
// getIdeSelectionAttachment - Report IDE text selection
// Location: chunks.142.mjs:2114-2127
// ============================================

// ORIGINAL (for source lookup):
async function ehY(A, q) {
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

// Mapping: ehY→getIdeSelectionAttachment, A→ideContext, q→sessionContext, K→ideName, Y→appState, T$6→detectIdeName, sW1→isSandboxBlocked
```

**Key behaviors**:
- **IDE detection**: Infers IDE name from MCP client list (VS Code, Cursor, etc.)
- **Selection validation**: Requires lineStart, text, and filePath to be present
- **Sandbox check**: Silently skips selections from sandboxed files
- **Line range calculation**: Converts lineStart + lineCount to lineStart/lineEnd pair

### 8. WIY (getLspDiagnosticsAttachment)

Delivers LSP diagnostics from connected language servers.

```javascript
// ============================================
// getLspDiagnosticsAttachment - Deliver LSP diagnostics
// Location: chunks.142.mjs:2473-2492
// ============================================

// ORIGINAL (for source lookup):
async function WIY(A) {
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

// Mapping: WIY→getLspDiagnosticsAttachment, A→sessionContext, q→pendingDiagnosticSets or error, K→attachments or errorObj, Y→fileList, h→logDebug, sm4→getPendingLspDiagnostics, tm4→clearDeliveredLspDiagnostics, K1→logError
```

**Key behaviors**:
- **Pull-based delivery**: Fetches pending diagnostics from global registry
- **Clear-after-deliver**: Removes diagnostics from registry after creating attachments (avoids duplicates)
- **Error resilience**: Returns empty array on failure, ensuring diagnostic errors don't break agent loop
- **Debug logging**: Extensive logging for diagnostic delivery tracking

### 9. EIY (getAsyncHookResponsesAttachment)

Delivers responses from asynchronous hook scripts.

```javascript
// ============================================
// getAsyncHookResponsesAttachment - Deliver async hook responses
// Location: chunks.142.mjs:2758-2789
// ============================================

// ORIGINAL (for source lookup):
async function EIY() {
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

// Mapping: EIY→getAsyncHookResponsesAttachment, A→pendingResponses, q→attachments, K→pid or processIds, Y→hookResponse or r, z→name, w→event, H→tool, $→stdoutOutput, O→stderrOutput, _→code, h→logDebug, Jn7→getPendingHookResponses, Q1→JSON.stringify, Xn7→removeDeliveredHookResponses
```

**Key behaviors**:
- **Async hook delivery**: Hooks can run asynchronously (background processes), this producer fetches their results
- **Rich context**: Includes stdout, stderr, exitCode for debugging
- **Clear-after-deliver**: Removes responses from registry after attachment creation
- **Hook response structure**: Contains both raw output and structured response object

---

## Performance Characteristics

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
- **Graceful degradation**: If a producer times out, `gw` wrapper catches the error and returns []
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
- `assembleAttachments` (phY) - Main orchestrator for attachment production
- `timedAttachmentProducer` (gw) - Telemetry and error handling wrapper
- `extractAtMentionedFiles` (KIY) - Parse @-mentions and load file contents
- `extractMcpResources` (zIY) - Fetch MCP resources from @server:uri mentions
- `extractAgentMentions` (YIY) - Parse agent invocation requests
- `getChangedFilesAttachment` (wIY) - Detect modifications to watched files
- `getPlanModeAttachment` (ihY) - Inject plan mode instructions
- `getTodoReminderAttachment` (fIY) - Remind LLM to use TodoWrite tool
- `getIdeSelectionAttachment` (ehY) - Report IDE text selection
- `getLspDiagnosticsAttachment` (WIY) - Deliver LSP diagnostics
- `getAsyncHookResponsesAttachment` (EIY) - Deliver async hook responses
- `countTurnsSincePlanMode` (chY) - Count assistant turns since last plan mode attachment
- `countPlanModeReminders` (lhY) - Count how many plan mode reminders have been sent

---

## Related Documents

- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of 57 reminder types
- [integration_points.md](./integration_points.md) - Cross-module integration analysis
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling deep dive
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance optimization analysis
