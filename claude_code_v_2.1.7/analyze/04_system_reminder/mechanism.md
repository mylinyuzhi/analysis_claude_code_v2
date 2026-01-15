# System Reminder Mechanism in Claude Code v2.1.7

## Overview

The system reminder mechanism in Claude Code v2.1.7 is a sophisticated attachment system that injects contextual information into the conversation at strategic points. System reminders are metadata-tagged messages that provide the AI with important context about the session state, user configuration, file changes, and other dynamic information.

**Changes from v2.0.59:**
- Added delegate mode support
- Added plan mode exit notifications
- Added task status/progress unified system
- Added invoked skills attachment
- Added collaboration notification support
- Added plan mode reminder types ("full" vs "sparse")
- Added verify plan reminder

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `generateAllAttachments` (O27) - Main attachment orchestration
- `wrapWithErrorHandling` (fJ) - Error handling wrapper with telemetry
- `convertAttachmentToSystemMessage` (q$7) - Attachment to API message conversion
- `wrapSystemReminderText` (Yh) - XML tag wrapper
- `wrapInSystemReminder` (q5) - Array message wrapper
- `createMetaBlock` (H0) - Create isMeta message

---

## Core Architecture

### 1. Attachment Generation Function (O27)

The main orchestration function `O27` (chunks.131.mjs:3121-3138) coordinates all system reminder generation:

```javascript
// ============================================
// generateAllAttachments - Main attachment orchestration
// Location: chunks.131.mjs:3121-3138
// ============================================

// ORIGINAL (for source lookup):
async function O27(A, Q, B, G, Z, Y) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
  let J = c9();
  setTimeout(() => { J.abort() }, 1000);
  let X = { ...Q, abortController: J },
    I = !Q.agentId,
    D = A ? [fJ("at_mentioned_files", () => h27(A, X)), ...] : [],
    W = await Promise.all(D),
    K = [fJ("changed_files", () => m27(X)), ...],
    V = I ? [fJ("ide_selection", async () => k27(B, Q)), ...] : [],
    [F, H] = await Promise.all([Promise.all(K), Promise.all(V)]);
  return [...W.flat(), ...F.flat(), ...H.flat()]
}

// READABLE (for understanding):
async function generateAllAttachments(
  userPrompt,           // User's input text (null if no user input)
  context,              // Tool use context with agentId, options, readFileState, etc.
  ideContext,           // IDE context (selection, opened file)
  queuedCommands,       // Commands queued from hooks or async systems
  conversationHistory,  // Array of previous messages
  additionalParam       // Additional parameter
) {
  // Step 1: Check if attachments are globally disabled
  if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) {
    return [];
  }

  // Step 2: Create timeout controller (1 second max for all attachments)
  let timeoutController = new AbortController();
  setTimeout(() => {
    timeoutController.abort();
  }, 1000);

  // Step 3: Create enhanced context with timeout controller
  let enhancedContext = {
    ...context,
    abortController: timeoutController
  };

  // Step 4: Determine if this is the main agent (vs sub-agent)
  let isMainAgent = !context.agentId;

  // Step 5: Generate USER PROMPT ATTACHMENTS (only if user provided input)
  let userPromptGenerators = userPrompt ? [
    wrapWithErrorHandling("at_mentioned_files", () =>
      generateAtMentionedFilesAttachment(userPrompt, enhancedContext)
    ),
    wrapWithErrorHandling("mcp_resources", () =>
      generateMcpResourcesAttachment(userPrompt, enhancedContext)
    ),
    wrapWithErrorHandling("agent_mentions", () =>
      Promise.resolve(generateAgentMentionsAttachment(userPrompt, context.options.agentDefinitions.activeAgents))
    )
  ] : [];

  // Wait for user prompt attachments to complete
  let userPromptAttachments = await Promise.all(userPromptGenerators);

  // Step 6: Generate CORE ATTACHMENTS (always checked, available to all agents)
  let coreGenerators = [
    wrapWithErrorHandling("changed_files", () =>
      generateChangedFilesAttachment(enhancedContext)
    ),
    wrapWithErrorHandling("nested_memory", () =>
      generateNestedMemoryAttachment(enhancedContext)
    ),
    wrapWithErrorHandling("ultra_claude_md", async () =>
      generateClaudeMdAttachment(conversationHistory)  // Currently disabled
    ),
    wrapWithErrorHandling("plan_mode", () =>
      generatePlanModeAttachment(conversationHistory, context)
    ),
    wrapWithErrorHandling("plan_mode_exit", () =>          // NEW in v2.1.7
      generatePlanModeExitAttachment(context)
    ),
    wrapWithErrorHandling("delegate_mode", () =>           // NEW in v2.1.7
      generateDelegateModeAttachment(context)
    ),
    wrapWithErrorHandling("delegate_mode_exit", () =>      // NEW in v2.1.7
      Promise.resolve(generateDelegateModeExitAttachment())
    ),
    wrapWithErrorHandling("todo_reminders", () =>
      generateTodoRemindersAttachment(conversationHistory, context)
    ),
    wrapWithErrorHandling("collab_notification", async () =>  // NEW in v2.1.7
      generateCollabNotificationAttachment()
    ),
    wrapWithErrorHandling("critical_system_reminder", () =>
      Promise.resolve(generateCriticalSystemReminderAttachment(context))
    )
  ];

  // Step 7: Generate MAIN AGENT ONLY ATTACHMENTS (only for primary agent)
  let mainAgentGenerators = isMainAgent ? [
    wrapWithErrorHandling("ide_selection", async () =>
      generateIdeSelectionAttachment(ideContext, context)
    ),
    wrapWithErrorHandling("ide_opened_file", async () =>
      generateIdeOpenedFileAttachment(ideContext, context)
    ),
    wrapWithErrorHandling("output_style", async () =>
      Promise.resolve(generateOutputStyleAttachment())
    ),
    wrapWithErrorHandling("queued_commands", async () =>
      generateQueuedCommandsAttachment(queuedCommands)
    ),
    wrapWithErrorHandling("diagnostics", async () =>
      generateDiagnosticsAttachment()
    ),
    wrapWithErrorHandling("lsp_diagnostics", async () =>
      generateLspDiagnosticsAttachment()
    ),
    wrapWithErrorHandling("unified_tasks", async () =>     // NEW in v2.1.7 (replaces background_shells, async_agents)
      generateUnifiedTasksAttachment(context, conversationHistory)
    ),
    wrapWithErrorHandling("async_hook_responses", async () =>
      generateAsyncHookResponsesAttachment()
    ),
    wrapWithErrorHandling("memory", async () =>
      generateMemoryAttachment(context, conversationHistory, additionalParam)
    ),
    wrapWithErrorHandling("token_usage", async () =>
      Promise.resolve(generateTokenUsageAttachment(conversationHistory ?? []))
    ),
    wrapWithErrorHandling("budget_usd", async () =>
      Promise.resolve(generateBudgetAttachment(context.options.maxBudgetUsd))
    ),
    wrapWithErrorHandling("verify_plan_reminder", async () =>  // NEW in v2.1.7
      generateVerifyPlanReminderAttachment(conversationHistory, context)
    )
  ] : [];

  // Step 8: Execute all core and main agent generators in parallel
  let [coreAttachments, mainAgentAttachments] = await Promise.all([
    Promise.all(coreGenerators),
    Promise.all(mainAgentGenerators)
  ]);

  // Step 9: Flatten and combine all attachments
  // Order: User prompt → Core → Main agent
  return [
    ...userPromptAttachments.flat(),
    ...coreAttachments.flat(),
    ...mainAgentAttachments.flat()
  ];
}

// Mapping: O27→generateAllAttachments, A→userPrompt, Q→context, B→ideContext,
//          G→queuedCommands, Z→conversationHistory, Y→additionalParam,
//          J→timeoutController, X→enhancedContext, I→isMainAgent, a1→parseBoolean,
//          c9→AbortController, fJ→wrapWithErrorHandling
```

**Key Features:**
- **Timeout Protection**: 1 second timeout to prevent blocking
- **Parallel Execution**: All attachment generators run concurrently via Promise.all
- **Tiered System**: User prompt attachments → Core attachments → Main agent attachments
- **Conditional Loading**: Main agent gets additional IDE-specific attachments
- **Graceful Degradation**: Individual failures don't break the entire flow

**New in v2.1.7:**
- `plan_mode_exit` - Notifies when exiting plan mode
- `delegate_mode` - Delegate mode context
- `delegate_mode_exit` - Notifies when exiting delegate mode
- `collab_notification` - Collaboration messages
- `unified_tasks` - Replaces separate background_shells and async_agents
- `verify_plan_reminder` - Reminds to verify plan completion

---

### 2. Error Handling Wrapper (fJ)

The `fJ` function (chunks.131.mjs:3140-3163) wraps each attachment generator with error handling and telemetry:

```javascript
// ============================================
// wrapWithErrorHandling - Error handling and telemetry wrapper
// Location: chunks.131.mjs:3140-3163
// ============================================

// ORIGINAL (for source lookup):
async function fJ(A, Q) {
  let B = Date.now();
  try {
    let G = await Q(),
      Z = Date.now() - B,
      Y = G.reduce((J, X) => { return J + eA(X).length }, 0);
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A, duration_ms: Z, attachment_size_bytes: Y, attachment_count: G.length
    });
    return G
  } catch (G) {
    let Z = Date.now() - B;
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A, duration_ms: Z, error: !0
    });
    return e(G), xM(`Attachment error in ${A}`, G), []
  }
}

// READABLE (for understanding):
async function wrapWithErrorHandling(
  attachmentLabel,      // Human-readable label for telemetry (e.g., "changed_files")
  generatorFunction     // Async function that returns attachment array
) {
  // Step 1: Record start time for performance tracking
  let startTime = Date.now();

  try {
    // Step 2: Execute the attachment generator
    let attachments = await generatorFunction();

    // Step 3: Calculate execution metrics
    let duration = Date.now() - startTime;
    let totalSizeBytes = attachments.reduce((sum, attachment) => {
      return sum + JSON.stringify(attachment).length;
    }, 0);

    // Step 4: Send telemetry (5% sampling rate to reduce overhead)
    if (Math.random() < 0.05) {
      sendTelemetry("tengu_attachment_compute_duration", {
        label: attachmentLabel,
        duration_ms: duration,
        attachment_size_bytes: totalSizeBytes,
        attachment_count: attachments.length
      });
    }

    // Step 5: Return successful attachments
    return attachments;

  } catch (error) {
    // Step 6: Handle errors gracefully
    let duration = Date.now() - startTime;

    // Send error telemetry (5% sampling)
    if (Math.random() < 0.05) {
      sendTelemetry("tengu_attachment_compute_duration", {
        label: attachmentLabel,
        duration_ms: duration,
        error: true
      });
    }

    // Log error for debugging
    captureException(error);
    logError(`Attachment error in ${attachmentLabel}`, error);

    // Return empty array instead of throwing
    // This ensures one failing attachment doesn't break all attachments
    return [];
  }
}

// Mapping: fJ→wrapWithErrorHandling, A→attachmentLabel, Q→generatorFunction,
//          B→startTime, G→attachments/error, Z→duration, Y→totalSizeBytes,
//          eA→JSON.stringify, l→sendTelemetry, e→captureException, xM→logError
```

**Key Features:**
- **Graceful Failure**: Returns empty array on error instead of throwing
- **Performance Monitoring**: Tracks duration and size of attachments
- **Error Logging**: Logs errors but doesn't interrupt the flow
- **Sampled Telemetry**: 5% sampling to minimize performance impact
- **Isolation**: Each generator is isolated; failures don't cascade

---

### 3. Attachment to System Message Conversion (q$7)

The `q$7` function (chunks.148.mjs:3-371) converts attachment objects into API-compatible system messages. This is the main switch statement handling all attachment types.

See [types.md](./types.md) for detailed conversion logic for each attachment type.

---

## Injection Timing in Message Flow

### Flow Diagram

```
User Input
    ↓
[Parse @mentions, extract user prompt text]
    ↓
O27() - Generate all attachments
    ↓
    ├─→ User Prompt Attachments (if user input exists)
    │   ├─→ @mentioned files (h27)
    │   ├─→ MCP resources (u27)
    │   └─→ @agent mentions (g27)
    │
    ├─→ Core Attachments (always checked)
    │   ├─→ changed_files (m27) - File change detection
    │   ├─→ nested_memory (d27) - Session memory
    │   ├─→ ultra_claude_md (v27) - CLAUDE.md processing
    │   ├─→ plan_mode (j27) - Plan mode context
    │   ├─→ plan_mode_exit (T27) - Plan mode exit (NEW)
    │   ├─→ delegate_mode (P27) - Delegate mode (NEW)
    │   ├─→ delegate_mode_exit (S27) - Delegate exit (NEW)
    │   ├─→ todo_reminders (t27) - Todo list reminders
    │   ├─→ collab_notification (B97) - Collab messages (NEW)
    │   └─→ critical_system_reminder (x27) - User config
    │
    └─→ Main Agent Only Attachments (if main agent)
        ├─→ ide_selection (k27) - IDE selection
        ├─→ ide_opened_file (f27) - Opened files
        ├─→ output_style (y27) - Output formatting
        ├─→ queued_commands (M27) - Queued prompts
        ├─→ diagnostics (o27) - Code diagnostics
        ├─→ lsp_diagnostics (r27) - LSP diagnostics
        ├─→ unified_tasks (A97) - Task status (NEW, unified)
        ├─→ async_hook_responses (Q97) - Hook responses
        ├─→ memory (mr2) - Session summaries
        ├─→ token_usage (G97) - Token tracking
        ├─→ budget_usd (Z97) - Budget tracking
        └─→ verify_plan_reminder (J97) - Plan verification (NEW)
    ↓
[Filter out empty arrays]
    ↓
[Convert attachments to message blocks via q$7()]
    ↓
[Insert into message array as attachment messages]
    ↓
[Send to Claude API]
```

---

## Key Generator Functions

### Plan Mode (j27) - Enhanced in v2.1.7

```javascript
// ============================================
// generatePlanModeAttachment - Plan mode instructions
// Location: chunks.131.mjs:3207-3231
// ============================================

// ORIGINAL (for source lookup):
async function j27(A, Q) {
  if ((await Q.getAppState()).toolPermissionContext.mode !== "plan") return [];
  if (A && A.length > 0) {
    let { turnCount: D, foundPlanModeAttachment: W } = R27(A);
    if (W && D < ar2.TURNS_BETWEEN_ATTACHMENTS) return []
  }
  let Z = dC(Q.agentId), Y = AK(Q.agentId), J = [];
  if (Xf0() && Y !== null) J.push({ type: "plan_mode_reentry", planFilePath: Z }), Iq(!1);
  let I = (_27(A ?? []) + 1) % ar2.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  return J.push({
    type: "plan_mode",
    reminderType: I,  // NEW: "full" or "sparse"
    isSubAgent: !!Q.agentId,
    planFilePath: Z,
    planExists: Y !== null
  }), J
}

// READABLE (for understanding):
async function generatePlanModeAttachment(conversationHistory, context) {
  // Check if currently in plan mode
  if ((await context.getAppState()).toolPermissionContext.mode !== "plan") {
    return [];
  }

  // Throttle plan mode attachments
  if (conversationHistory && conversationHistory.length > 0) {
    let { turnCount, foundPlanModeAttachment } = analyzePlanModeHistory(conversationHistory);
    if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_PLAN_ATTACHMENTS) {
      return [];
    }
  }

  let planFilePath = getPlanFilePath(context.agentId);
  let planContent = readPlanFile(context.agentId);
  let attachments = [];

  // Check if re-entering plan mode
  if (isReenteringPlanMode() && planContent !== null) {
    attachments.push({
      type: "plan_mode_reentry",
      planFilePath: planFilePath
    });
    clearReentryFlag();
  }

  // NEW: Determine reminder type (full or sparse)
  let attachmentCount = countPlanModeAttachments(conversationHistory ?? []);
  let reminderType = (attachmentCount + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";

  attachments.push({
    type: "plan_mode",
    reminderType: reminderType,  // NEW in v2.1.7
    isSubAgent: !!context.agentId,
    planFilePath: planFilePath,
    planExists: planContent !== null
  });

  return attachments;
}

// Mapping: j27→generatePlanModeAttachment, A→conversationHistory, Q→context,
//          R27→analyzePlanModeHistory, _27→countPlanModeAttachments,
//          dC→getPlanFilePath, AK→readPlanFile, ar2→PLAN_MODE_CONSTANTS
```

**New in v2.1.7:**
- Added `reminderType` field ("full" or "sparse") for optimized reminder content
- Sparse reminders show abbreviated instructions to reduce token usage

---

### Plan Mode Exit (T27) - NEW in v2.1.7

```javascript
// ============================================
// generatePlanModeExitAttachment - Plan mode exit notification
// Location: chunks.131.mjs:3233-3244
// ============================================

// ORIGINAL (for source lookup):
async function T27(A) {
  if (!If0()) return [];
  if ((await A.getAppState()).toolPermissionContext.mode === "plan") return lw(!1), [];
  lw(!1);
  let B = dC(A.agentId), G = AK(A.agentId) !== null;
  return [{
    type: "plan_mode_exit",
    planFilePath: B,
    planExists: G
  }]
}

// READABLE (for understanding):
async function generatePlanModeExitAttachment(context) {
  // Check if we just exited plan mode
  if (!hasJustExitedPlanMode()) {
    return [];
  }

  // Don't show exit if still in plan mode
  if ((await context.getAppState()).toolPermissionContext.mode === "plan") {
    clearPlanModeExitFlag();
    return [];
  }

  clearPlanModeExitFlag();

  let planFilePath = getPlanFilePath(context.agentId);
  let planExists = readPlanFile(context.agentId) !== null;

  return [{
    type: "plan_mode_exit",
    planFilePath: planFilePath,
    planExists: planExists
  }];
}

// Mapping: T27→generatePlanModeExitAttachment, A→context, If0→hasJustExitedPlanMode,
//          lw→clearPlanModeExitFlag, dC→getPlanFilePath, AK→readPlanFile
```

---

### Delegate Mode (P27) - NEW in v2.1.7

```javascript
// ============================================
// generateDelegateModeAttachment - Delegate mode context
// Location: chunks.131.mjs:3246-3256
// ============================================

// ORIGINAL (for source lookup):
async function P27(A) {
  let Q = await A.getAppState();
  if (Q.toolPermissionContext.mode !== "delegate") return [];
  if (!Q.teamContext) return [];
  let Z = `${process.env.HOME||process.env.USERPROFILE||"."}/.claude/tasks/${Q.teamContext.teamName}/`;
  return [{
    type: "delegate_mode",
    teamName: Q.teamContext.teamName,
    taskListPath: Z
  }]
}

// READABLE (for understanding):
async function generateDelegateModeAttachment(context) {
  let appState = await context.getAppState();

  // Only active in delegate mode
  if (appState.toolPermissionContext.mode !== "delegate") {
    return [];
  }

  // Requires team context
  if (!appState.teamContext) {
    return [];
  }

  let taskListPath = `${process.env.HOME || process.env.USERPROFILE || "."}/.claude/tasks/${appState.teamContext.teamName}/`;

  return [{
    type: "delegate_mode",
    teamName: appState.teamContext.teamName,
    taskListPath: taskListPath
  }];
}

// Mapping: P27→generateDelegateModeAttachment, A→context, Q→appState
```

---

### Unified Tasks (A97) - NEW in v2.1.7

Replaces separate `background_shells` and `async_agents` with a unified task status system.

```javascript
// ============================================
// generateUnifiedTasksAttachment - Unified task status
// Location: chunks.132.mjs:151-188
// ============================================

// ORIGINAL (for source lookup):
async function A97(A, Q) {
  let B = await A.getAppState(),
    { attachments: G, progressAttachments: Z, updatedTasks: Y } = Gm2(B),
    J = e27(Q),
    X = Z.filter((W) => (J.get(W.taskId) ?? 1/0) >= w27);
  // ... update task states, create attachments
  let I = G.map((W) => ({
    type: "task_status",
    taskId: W.taskId,
    taskType: W.taskType,
    status: W.status,
    description: W.description,
    deltaSummary: W.deltaSummary
  })),
  D = X.map((W) => ({
    type: "task_progress",
    taskId: W.taskId,
    taskType: W.taskType,
    message: W.message
  }));
  return [...I, ...D]
}

// READABLE (for understanding):
async function generateUnifiedTasksAttachment(context, conversationHistory) {
  let appState = await context.getAppState();

  // Get task status and progress from unified task manager
  let { attachments, progressAttachments, updatedTasks } = getTaskAttachments(appState);

  // Check turn count since last progress for each task
  let turnsSinceProgress = getTurnsSinceTaskProgress(conversationHistory);

  // Filter progress attachments by turn threshold
  let filteredProgress = progressAttachments.filter((progress) => {
    return (turnsSinceProgress.get(progress.taskId) ?? Infinity) >= PROGRESS_TURN_THRESHOLD;
  });

  // Update task states
  // ... state management code ...

  // Create task status attachments
  let statusAttachments = attachments.map((task) => ({
    type: "task_status",
    taskId: task.taskId,
    taskType: task.taskType,
    status: task.status,
    description: task.description,
    deltaSummary: task.deltaSummary
  }));

  // Create task progress attachments
  let progressAttachmentsList = filteredProgress.map((progress) => ({
    type: "task_progress",
    taskId: progress.taskId,
    taskType: progress.taskType,
    message: progress.message
  }));

  return [...statusAttachments, ...progressAttachmentsList];
}

// Mapping: A97→generateUnifiedTasksAttachment, A→context, Q→conversationHistory,
//          B→appState, Gm2→getTaskAttachments, e27→getTurnsSinceTaskProgress,
//          w27→PROGRESS_TURN_THRESHOLD (value: 3)
```

---

## Performance Considerations

1. **Parallel Execution**: All attachment generators run concurrently
2. **Timeout Protection**: 1 second timeout prevents blocking
3. **Graceful Degradation**: Errors in individual attachments don't break the flow
4. **Caching**: File read states are tracked to avoid redundant reads
5. **Throttling**: Some attachments (plan_mode, todo_reminders) have turn-based throttling
6. **Conditional Loading**: Main agent vs sub-agent, user input vs no input
7. **Sparse Reminders**: Plan mode uses "sparse" reminders to reduce token usage

## Environment Variables

- `CLAUDE_CODE_DISABLE_ATTACHMENTS`: Disables all attachments when set
- `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT`: Enables token usage tracking

---

## Changed Files Detection (m27)

The `m27` function detects file changes since the last read:

```javascript
// ============================================
// generateChangedFilesAttachment - Detect file changes
// Location: chunks.131.mjs:3458-3508
// ============================================

// READABLE (for understanding):
async function generateChangedFilesAttachment(context) {
  // Step 1: Get current app state for permission checks
  let appState = await context.getAppState();

  // Step 2: Iterate through all previously-read files
  // readFileState is a Map<filePath, { content, timestamp, offset, limit }>
  let changeDetectionPromises = Array.from(context.readFileState.keys()).map(async (filePath) => {
    // Get cached file state
    let cachedState = context.readFileState.get(filePath);
    if (!cachedState) return null;

    // Skip partial reads (only check fully-read files)
    if (cachedState.offset !== undefined || cachedState.limit !== undefined) {
      return null;
    }

    // Resolve to absolute path
    let absolutePath = resolvePath(filePath);

    // Check permissions (sandbox mode, blocklist, etc.)
    if (isPathBlocked(absolutePath, appState.toolPermissionContext)) {
      return null;
    }

    try {
      // Step 3: Check if file has been modified since last read
      let currentModificationTime = getFileModificationTime(absolutePath);
      if (currentModificationTime <= cachedState.timestamp) {
        return null;  // No changes
      }

      // Step 4: Re-read the file to get current content
      let currentFileData = await ReadTool.call({ file_path: absolutePath }, context);

      // Step 5: Special handling for TODO file
      if (absolutePath === getTodoFilePath(context.agentId)) {
        let currentTodoList = getTodoList(context.agentId);
        return {
          type: "todo",
          content: currentTodoList,
          itemCount: currentTodoList.length,
          context: "file-watch"
        };
      }

      // Step 6: Handle text file changes
      if (currentFileData.data.type === "text") {
        // Generate diff between cached and current content
        let diffSnippet = generateDiff(cachedState.content, currentFileData.data.file.content);

        // If no meaningful changes, skip
        if (diffSnippet === "") return null;

        return {
          type: "edited_text_file",
          filename: absolutePath,
          snippet: diffSnippet  // Unified diff format with line numbers
        };
      }

      // Step 7: Handle image file changes
      if (currentFileData.data.type === "image") {
        // Compress image for attachment
        let compressedImage = await compressImage(absolutePath);
        return {
          type: "edited_image_file",
          filename: absolutePath,
          content: compressedImage  // Base64 compressed
        };
      }

    } catch (error) {
      // File might have been deleted or become inaccessible
      return null;
    }
  });

  // Step 8: Wait for all change detections and filter nulls
  let attachments = await Promise.all(changeDetectionPromises);
  return attachments.filter(attachment => attachment !== null);
}

// Mapping: m27→generateChangedFilesAttachment
```

**Tracks**: Files that have been read and detects changes since last read

**Output Examples**:
```javascript
// Text file change
{
  type: "edited_text_file",
  filename: "/path/to/file.js",
  snippet: "10: -const oldValue = 42;\n10: +const newValue = 100;"
}

// TODO file change
{
  type: "todo",
  content: [
    { content: "Fix bug", status: "completed", activeForm: "Fixing bug" },
    { content: "Add tests", status: "pending", activeForm: "Adding tests" }
  ],
  itemCount: 2,
  context: "file-watch"
}
```

---

## Nested Memory Deep Dive

This section provides comprehensive technical details about the nested memory system in v2.1.7.

### Trigger Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Read Tool Execution                          │
│                        (chunks.88.mjs)                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────┐
    │  After successful read, add to triggers:                   │
    │  context.nestedMemoryAttachmentTriggers?.add(absolutePath) │
    │                                                            │
    │  Trigger points:                                           │
    │  - Text files                                              │
    │  - Notebook files                                          │
    │  - Image files                                             │
    └───────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────┐
    │           Next API Call: generateAllAttachments()          │
    │                  (O27 - chunks.131.mjs:3121)               │
    └───────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────┐
    │  d27() - Generate Nested Memory Attachment                 │
    │  (chunks.131.mjs:3510-3521)                               │
    │                                                            │
    │  for (let path of nestedMemoryAttachmentTriggers) {       │
    │    let relatedFiles = readRelatedFiles(path, context);    │
    │    attachments.push(...relatedFiles);                     │
    │  }                                                         │
    │  nestedMemoryAttachmentTriggers.clear();                  │
    └───────────────────────────────────────────────────────────┘
```

### Directory Hierarchy Calculation

The system calculates two directory lists for file discovery:

```javascript
// ============================================
// getDirectoryHierarchy - Calculate directory levels
// Location: chunks.92.mjs:2929-2947
// ============================================
function getDirectoryHierarchy(filePath, cwd) {
  // Get parent directory of the file
  let currentDir = parentDir(getDirectory(filePath));

  // NESTED DIRS: Directories from file's parent up to (not including) cwd
  // These are directories BELOW cwd where the file lives
  let nestedDirs = [];
  while (currentDir !== cwd && currentDir !== root) {
    if (currentDir.startsWith(cwd)) {
      nestedDirs.push(currentDir);  // Only include if under cwd
    }
    currentDir = parentDir(currentDir);
  }
  nestedDirs.reverse();  // Order: closest to cwd first → closest to file last

  // CWD-LEVEL DIRS: Directories from cwd up to root
  // These are directories AT or ABOVE cwd
  let cwdLevelDirs = [];
  currentDir = cwd;
  while (currentDir !== root) {
    cwdLevelDirs.push(currentDir);
    currentDir = parentDir(currentDir);
  }
  cwdLevelDirs.reverse();  // Order: root first → cwd last

  return { nestedDirs, cwdLevelDirs };
}
```

**Example**:
```
cwd = /Users/dev/project
file = /Users/dev/project/src/components/Button.tsx

nestedDirs = ["/Users/dev/project/src", "/Users/dev/project/src/components"]
cwdLevelDirs = ["/Users", "/Users/dev", "/Users/dev/project"]
```

### File Discovery Functions

#### G52 - Managed and User Settings

**Location**: `chunks.92.mjs:2894-2902`

```javascript
// ============================================
// readManagedAndUserSettings - Read managed and user rules
// Location: chunks.92.mjs:2894-2902
// ============================================
function G52(triggeredPath, processedPaths) {
  let files = [];

  // 1. Read from managed rules directory (system-controlled)
  let managedDir = getManagedRulesDirectory();
  files.push(...readConditionalRules(triggeredPath, managedDir, "Managed", processedPaths, false));

  // 2. Read from user settings (if feature enabled)
  if (isFeatureEnabled("userSettings")) {
    let userDir = getUserRulesDirectory();  // ~/.claude/rules/
    files.push(...readConditionalRules(triggeredPath, userDir, "User", processedPaths, true));
  }

  return files;
}

// Mapping: G52→readManagedAndUserSettings, An1→getManagedRulesDirectory,
//          Qn1→getUserRulesDirectory, iK→isFeatureEnabled, zY1→readConditionalRules
```

#### Z52 - Project Settings in Nested Directories

**Location**: `chunks.92.mjs:2904-2927`

```javascript
// ============================================
// readProjectFilesInNestedDir - Read project files
// Location: chunks.92.mjs:2904-2927
// ============================================
function Z52(directory, triggeredPath, processedPaths) {
  let files = [];

  // 1. Read project CLAUDE.md files (if feature enabled)
  if (isFeatureEnabled("projectSettings")) {
    // ./CLAUDE.md
    let claudeMd = path.join(directory, "CLAUDE.md");
    files.push(...readSingleFileWithImports(claudeMd, "Project", processedPaths, false));

    // ./.claude/CLAUDE.md
    let dotClaudeMd = path.join(directory, ".claude", "CLAUDE.md");
    files.push(...readSingleFileWithImports(dotClaudeMd, "Project", processedPaths, false));
  }

  // 2. Read local CLAUDE.md (if feature enabled)
  if (isFeatureEnabled("localSettings")) {
    let localMd = path.join(directory, "CLAUDE.local.md");
    files.push(...readSingleFileWithImports(localMd, "Local", processedPaths, false));
  }

  // 3. Read .claude/rules/ directory
  let rulesDir = path.join(directory, ".claude", "rules");
  let tempProcessed = new Set(processedPaths);

  files.push(...readRulesDirectoryRecursive({
    rulesDir: rulesDir,
    type: "Project",
    processedPaths: tempProcessed,
    includeExternal: false,
    conditionalRule: false
  }));

  // Add conditional rules filtered by globs
  files.push(...readConditionalRules(triggeredPath, rulesDir, "Project", processedPaths, false));

  // Merge processed paths
  for (let p of tempProcessed) processedPaths.add(p);

  return files;
}

// Mapping: Z52→readProjectFilesInNestedDir, iK→isFeatureEnabled,
//          gb→readSingleFileWithImports, fVA→readRulesDirectoryRecursive,
//          zY1→readConditionalRules
```

#### fVA - Recursive Rules Reading

**Location**: `chunks.92.mjs:2831-2880`

```javascript
// ============================================
// readRulesDirectoryRecursive - Recursively read rules directory
// Location: chunks.92.mjs:2831-2880
// ============================================
function fVA({
  rulesDir,
  type,
  processedPaths,
  includeExternal,
  conditionalRule,
  visitedDirs = new Set()
}) {
  let files = [];

  // Prevent infinite loops
  if (visitedDirs.has(rulesDir)) return files;
  visitedDirs.add(rulesDir);

  // Check if directory exists
  if (!existsSync(rulesDir) || !statSync(rulesDir).isDirectory()) return files;

  try {
    let entries = readdirSync(rulesDir);

    for (let entry of entries) {
      let entryPath = path.join(rulesDir, entry.name);

      if (entry.isDirectory()) {
        // Recursively read subdirectories
        let subFiles = fVA({
          rulesDir: entryPath,
          type: type,
          processedPaths: processedPaths,
          includeExternal: includeExternal,
          conditionalRule: conditionalRule,
          visitedDirs: visitedDirs
        });
        files.push(...subFiles);

      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        // Read markdown files
        let mdFiles = readSingleFileWithImports(entryPath, type, processedPaths, includeExternal);

        if (conditionalRule) {
          // Only include files WITH globs
          files.push(...mdFiles.filter(f => f.globs));
        } else {
          // Only include files WITHOUT globs
          files.push(...mdFiles.filter(f => !f.globs));
        }
      }
    }
  } catch (error) {
    if (error.message.includes("EACCES")) {
      // Log permission error telemetry
      sendTelemetry("tengu_claude_rules_md_permission_error", {
        is_access_error: 1,
        has_home_dir: rulesDir.includes(getHomeDir()) ? 1 : 0
      });
    }
  }

  return files;
}

// Mapping: fVA→readRulesDirectoryRecursive
```

#### gb - Single File Reading with @import

**Location**: `chunks.92.mjs:2810-2829`

```javascript
// ============================================
// readSingleFileWithImports - Read file with @import support
// Location: chunks.92.mjs:2810-2829
// ============================================
function gb(filePath, type, processedPaths, includeExternal, depth = 0, parent) {
  // Max recursion depth: 5 (aZ5)
  if (processedPaths.has(filePath) || depth >= MAX_IMPORT_DEPTH) return [];

  // Read and parse file
  let fileData = readClaudeMdFile(filePath, type);
  if (!fileData || !fileData.content.trim()) return [];

  // Set parent reference for import chain
  if (parent) fileData.parent = parent;

  processedPaths.add(filePath);

  let files = [fileData];

  // Handle symlinks
  let { realpath } = resolveSymlink(fs, filePath);
  if (realpath !== filePath) processedPaths.add(realpath);

  // Find and process @imports
  let imports = extractImportPaths(fileData.content, realpath);
  for (let importPath of imports) {
    // Check if external imports are allowed
    if (!isLocalPath(importPath) && !includeExternal) continue;

    // Recursively read imported file
    let importedFiles = gb(importPath, type, processedPaths, includeExternal, depth + 1, filePath);
    files.push(...importedFiles);
  }

  return files;
}

// Mapping: gb→readSingleFileWithImports, aZ5→MAX_IMPORT_DEPTH (5),
//          B52→readClaudeMdFile, nZ5→extractImportPaths, xI→resolveSymlink
```

### File Discovery Priority Order

When a file is read, related files are discovered in this order:

```
Priority 1: MANAGED Settings
├── System-managed rules directory
└── Read by: readConditionalRules() with type="Managed"

Priority 2: USER Settings (if "userSettings" feature flag enabled)
├── User rules directory (~/.claude/rules/)
└── Read by: readConditionalRules() with type="User", includeExternal=true

Priority 3: PROJECT Settings per nested directory (if "projectSettings" enabled)
├── 3a. CLAUDE.md
├── 3b. .claude/CLAUDE.md
├── 3c. .claude/rules/*.md (non-conditional)
└── 3d. .claude/rules/*.md (conditional, glob-matched)

Priority 4: LOCAL Settings per nested directory (if "localSettings" enabled)
└── CLAUDE.local.md

Priority 5: CWD-Level Rules (ancestors of cwd)
└── .claude/rules/*.md (conditional only)
```

### Conditional Rules with Glob Filtering (zY1)

**Location**: `chunks.92.mjs:2934-2947`

Rules files can have glob patterns that determine when they apply:

```javascript
// ============================================
// readConditionalRules - Read rules with glob filtering
// Location: chunks.92.mjs:2934-2947
// ============================================
function zY1(triggeredPath, rulesDir, type, processedPaths, includeExternal) {
  // Read all rules with conditionalRule=true
  return fVA({
    rulesDir: rulesDir,
    type: type,
    processedPaths: processedPaths,
    includeExternal: includeExternal,
    conditionalRule: true
  }).filter((rule) => {
    // Only include if rule has globs and they match the triggered path
    if (!rule.globs || rule.globs.length === 0) return false;

    // Calculate relative path from rules dir
    let baseDir = type === "Project" ? parentDir(parentDir(rulesDir)) : cwd;
    let relativePath = isAbsolutePath(triggeredPath)
      ? makeRelativePath(baseDir, triggeredPath)
      : triggeredPath;

    // Use ignore library to check glob match
    return ignoreLib.add(rule.globs).ignores(relativePath);
  });
}

// Mapping: zY1→readConditionalRules, fVA→readRulesDirectoryRecursive,
//          A52→ignoreLib
```

### Feature Flag Dependencies

| Feature Flag | Controls | Effect When Disabled |
|--------------|----------|----------------------|
| `userSettings` | User CLAUDE.md and ~/.claude/rules/ | Skip user-level settings |
| `projectSettings` | Project CLAUDE.md and .claude/CLAUDE.md | Skip project-level settings |
| `localSettings` | CLAUDE.local.md | Skip local-only settings |

Feature flags are checked via `iK()` function.

### Key Constants

| Constant | Obfuscated | Value | Description |
|----------|------------|-------|-------------|
| `MAX_CONTENT_SIZE` | `xd` | 40000 | Max content size (40KB) |
| `MAX_LINES` | `hVA` | 3000 | Max lines per file |
| `MAX_IMPORT_DEPTH` | `aZ5` | 5 | Max @import recursion depth |
| `PROGRESS_TURN_THRESHOLD` | `w27` | 3 | Turns between task progress updates |
| `TURNS_SINCE_WRITE` | - | 5 | Turns before showing todo reminder |
| `TURNS_BETWEEN_REMINDERS` | - | 3 | Turns between todo reminders |

**Source Location**: `chunks.92.mjs:2971-2979`

### Context Initialization

Both main agent and subagent contexts initialize with a fresh Set:

```javascript
// Main agent context creation:
{
  readFileState: new Map(),
  nestedMemoryAttachmentTriggers: new Set(),  // Fresh Set for each session
  // ... other fields
}

// Subagent context creation:
{
  readFileState: cloneMap(parentContext?.readFileState ?? mainContext.readFileState),
  nestedMemoryAttachmentTriggers: new Set(),  // Fresh Set, NOT inherited
  // ... other fields
}
```

### CLAUDE.md Context Format

The CLAUDE.md content is formatted for injection with type labels:

```javascript
// ============================================
// formatClaudeMdContext - Format CLAUDE.md for context injection
// Location: chunks.92.mjs:2983-2998
// ============================================
const CLAUDE_MD_PREFIX = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written.";

function formatClaudeMdContext() {
  let files = getAllClaudeMdFiles();
  let sections = [];

  for (let file of files) {
    if (file.content) {
      // Add type label to each file
      let typeLabel = file.type === "Project"
        ? " (project instructions, checked into the codebase)"
        : file.type === "Local"
          ? " (user's private project instructions, not checked in)"
          : " (user's private global instructions for all projects)";

      sections.push(`Contents of ${file.path}${typeLabel}:\n\n${file.content}`);
    }
  }

  if (sections.length === 0) return "";

  return `${CLAUDE_MD_PREFIX}\n\n${sections.join("\n\n")}`;
}

// Mapping: XD0→formatClaudeMdContext, pZ5→CLAUDE_MD_PREFIX, GV→getAllClaudeMdFiles
```

### Malware Warning Constant

**Location**: `chunks.86.mjs:480-485`

```javascript
// ============================================
// MALWARE_WARNING - Warning appended to file reads
// Location: chunks.86.mjs:480-485
// ============================================
const MALWARE_WARNING = `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`;

// Mapping: Se8→MALWARE_WARNING
```

---

## Symbol Mapping Reference

### Core Attachment Functions (v2.1.7)

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| `O27` | `generateAllAttachments` | chunks.131.mjs:3121 | Main orchestrator |
| `fJ` | `wrapWithErrorHandling` | chunks.131.mjs:3140 | Error wrapper |
| `h27` | `generateAtMentionedFilesAttachment` | chunks.131.mjs:3372 | @file mentions |
| `u27` | `generateMcpResourcesAttachment` | chunks.131.mjs:3425 | MCP resources |
| `g27` | `generateAgentMentionsAttachment` | chunks.131.mjs:3411 | @agent mentions |
| `m27` | `generateChangedFilesAttachment` | chunks.131.mjs:3458 | File change detection |
| `d27` | `generateNestedMemoryAttachment` | chunks.131.mjs:3510 | Nested memory |
| `v27` | `generateClaudeMdAttachment` | chunks.131.mjs:3560 | CLAUDE.md |
| `j27` | `generatePlanModeAttachment` | chunks.131.mjs:3207 | Plan mode |
| `T27` | `generatePlanModeExitAttachment` | chunks.131.mjs:3233 | Plan mode exit (NEW) |
| `P27` | `generateDelegateModeAttachment` | chunks.131.mjs:3246 | Delegate mode (NEW) |
| `S27` | `generateDelegateModeExitAttachment` | chunks.131.mjs:3258 | Delegate exit (NEW) |
| `t27` | `generateTodoRemindersAttachment` | chunks.132.mjs:117 | Todo reminders |
| `B97` | `generateCollabNotificationAttachment` | chunks.132.mjs:223 | Collab notifications (NEW) |
| `x27` | `generateCriticalSystemReminderAttachment` | chunks.131.mjs:3265 | Critical reminder |
| `k27` | `generateIdeSelectionAttachment` | chunks.131.mjs:3287 | IDE selection |
| `f27` | `generateIdeOpenedFileAttachment` | chunks.131.mjs:3362 | Opened file |
| `y27` | `generateOutputStyleAttachment` | chunks.131.mjs:3274 | Output style |
| `M27` | `generateQueuedCommandsAttachment` | chunks.131.mjs:3166 | Queued commands |
| `o27` | `generateDiagnosticsAttachment` | chunks.131.mjs:3583 | Diagnostics |
| `r27` | `generateLspDiagnosticsAttachment` | chunks.131.mjs:3593 | LSP diagnostics |
| `A97` | `generateUnifiedTasksAttachment` | chunks.132.mjs:151 | Unified tasks (NEW) |
| `Q97` | `generateAsyncHookResponsesAttachment` | chunks.132.mjs:190 | Hook responses |
| `mr2` | `generateMemoryAttachment` | chunks.131.mjs:3073 | Session memory |
| `G97` | `generateTokenUsageAttachment` | chunks.132.mjs:227 | Token usage |
| `Z97` | `generateBudgetAttachment` | chunks.132.mjs:239 | Budget tracking |
| `J97` | `generateVerifyPlanReminderAttachment` | chunks.132.mjs:274 | Plan verification (NEW) |

### Nested Memory Functions

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| `G52` | `readManagedAndUserSettings` | chunks.92.mjs:2894 | Managed + user settings |
| `Z52` | `readProjectFilesInNestedDir` | chunks.92.mjs:2904 | Project files |
| `Y52` | `readCwdLevelRules` | chunks.92.mjs:2929 | CWD-level rules |
| `zY1` | `readConditionalRules` | chunks.92.mjs:2934 | Glob-filtered rules |
| `fVA` | `readRulesDirectoryRecursive` | chunks.92.mjs:2831 | Recursive rules read |
| `gb` | `readSingleFileWithImports` | chunks.92.mjs:2810 | Single file + @import |
| `XD0` | `formatClaudeMdContext` | chunks.92.mjs:2983 | Format for injection |

### Conversion Functions

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| `q$7` | `convertAttachmentToSystemMessage` | chunks.148.mjs:3 | Main converter |
| `Yh` | `wrapSystemReminderText` | chunks.147.mjs:3212 | XML tag wrapper |
| `q5` | `wrapInSystemReminder` | chunks.147.mjs:3218 | Array message wrapper |
| `H0` | `createMetaBlock` | chunks.147.mjs:2410 | Create isMeta message |
| `MuA` | `createToolUseMessage` | chunks.148.mjs:392 | Simulate tool use |
| `OuA` | `createToolResultMessage` | chunks.148.mjs:373 | Simulate tool result |

### Constants

| Obfuscated | Readable | Value | Purpose |
|------------|----------|-------|---------|
| `xd` | `MAX_CONTENT_SIZE` | 40000 | Max file content size |
| `hVA` | `MAX_LINES` | 3000 | Max lines per file |
| `aZ5` | `MAX_IMPORT_DEPTH` | 5 | Max @import recursion |
| `pZ5` | `CLAUDE_MD_PREFIX` | string | Instruction prefix |
| `Se8` | `MALWARE_WARNING` | string | Malware analysis warning |
| `w27` | `PROGRESS_TURN_THRESHOLD` | 3 | Task progress throttle |
| `ar2` | `PLAN_MODE_CONSTANTS` | object | Plan mode thresholds |

---

## Injection Points and Timing

### Attachment Wrapper Function (X4)

**Location:** `chunks.132.mjs:87-94`

```javascript
// ============================================
// wrapAttachmentToMessage - Wrap attachment for yield
// Location: chunks.132.mjs:87-94
// ============================================

// ORIGINAL (for source lookup):
function X4(A) {
  return {
    attachment: A,
    type: "attachment",
    uuid: q27(),
    timestamp: new Date().toISOString()
  }
}

// READABLE (for understanding):
function wrapAttachmentToMessage(attachment) {
  return {
    attachment: attachment,
    type: "attachment",
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  };
}

// Mapping: X4→wrapAttachmentToMessage, A→attachment, q27→generateUUID
```

### Attachment Yield Generator (VHA)

**Location:** `chunks.131.mjs:3614-3621`

```javascript
// ============================================
// yieldAttachments - Async generator for attachments
// Location: chunks.131.mjs:3614-3621
// ============================================

// ORIGINAL (for source lookup):
async function* VHA(A, Q, B, G, Z, Y) {
  let J = await O27(A, Q, B, G, Z, Y);
  if (J.length === 0) return;
  l("tengu_attachments", {
    attachment_types: J.map((X) => X.type)
  });
  for (let X of J) yield X4(X)
}

// READABLE (for understanding):
async function* yieldAttachments(userPrompt, context, ideContext, queuedCommands, history, additional) {
  // Step 1: Generate all attachments
  let attachments = await generateAllAttachments(userPrompt, context, ideContext, queuedCommands, history, additional);

  // Step 2: If no attachments, return early
  if (attachments.length === 0) return;

  // Step 3: Send telemetry with attachment types
  sendTelemetry("tengu_attachments", {
    attachment_types: attachments.map(a => a.type)
  });

  // Step 4: Yield each attachment wrapped in message format
  for (let attachment of attachments) {
    yield wrapAttachmentToMessage(attachment);
  }
}

// Mapping: VHA→yieldAttachments, O27→generateAllAttachments, X4→wrapAttachmentToMessage
```

### Injection Point in Agent Loop

The attachments are injected in the agent loop at specific points:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Agent Loop (K$1.agentLoop)                      │
│                     Location: chunks.134.mjs                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    User Input / Tool Results                        │
│                    (Triggers attachment generation)                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VHA() - yieldAttachments                         │
│                    (Async generator yields attachments)             │
│                                                                     │
│   for await (let message of yieldAttachments(...)) {               │
│     yield message;  // Attachment message                           │
│     messages.push(message);                                        │
│   }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FI() - normalizeAttachmentsToAPI                 │
│                    (Convert attachments to API format)              │
│                                                                     │
│   Filters messages where message.type === "attachment"              │
│   Calls q$7(attachment) to convert to system messages               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Claude API Call                                  │
│                    (Messages include converted attachments)         │
└─────────────────────────────────────────────────────────────────────┘
```

### Message Processing Flow (FI)

**Location:** `chunks.148.mjs:399-435`

```javascript
// ============================================
// normalizeAttachmentsToAPI - Process messages for API
// Location: chunks.148.mjs:399-435
// ============================================

// READABLE (for understanding):
function normalizeAttachmentsToAPI(messages, tools) {
  let result = [];

  for (let message of messages) {
    if (message.type === "attachment") {
      // Convert attachment to system messages via q$7
      let systemMessages = convertAttachmentToSystemMessage(message.attachment);
      result.push(...systemMessages);
    } else if (message.type === "user") {
      // Regular user message - pass through
      result.push(message);
    } else if (message.type === "assistant") {
      // Assistant message - pass through
      result.push(message);
    }
  }

  return result;
}

// Mapping: FI→normalizeAttachmentsToAPI
```

### Timing Diagram

```
T0: User sends input
    │
T1: │ parseAtMentions(input) - Extract @files, @agents, @resources
    │
T2: │ VHA() called - Start attachment generation
    │ ├── User Prompt Attachments (parallel)
    │ │   ├── h27() at_mentioned_files
    │ │   ├── u27() mcp_resources
    │ │   └── g27() agent_mentions
    │ │
    │ ├── Core Attachments (parallel)
    │ │   ├── m27() changed_files
    │ │   ├── d27() nested_memory
    │ │   ├── j27() plan_mode
    │ │   ├── T27() plan_mode_exit
    │ │   ├── P27() delegate_mode
    │ │   ├── S27() delegate_mode_exit
    │ │   ├── t27() todo_reminders
    │ │   ├── B97() collab_notification
    │ │   └── x27() critical_system_reminder
    │ │
    │ └── Main Agent Attachments (parallel, if main agent)
    │     ├── k27() ide_selection
    │     ├── f27() ide_opened_file
    │     ├── y27() output_style
    │     ├── M27() queued_commands
    │     ├── o27() diagnostics
    │     ├── r27() lsp_diagnostics
    │     ├── A97() unified_tasks
    │     ├── Q97() async_hook_responses
    │     ├── mr2() memory
    │     ├── G97() token_usage
    │     ├── Z97() budget_usd
    │     └── J97() verify_plan_reminder
    │
T3: │ (Timeout: 1 second max for all attachment generation)
    │
T4: │ yield X4(attachment) - Yield each attachment
    │
T5: │ FI() - Convert attachments to API messages
    │
T6: │ API call to Claude
    │
T7: Claude response
```

### Key Timing Constraints

| Constraint | Value | Purpose |
|------------|-------|---------|
| Attachment Generation Timeout | 1000ms | Prevent blocking |
| Telemetry Sampling Rate | 5% | Performance monitoring |
| Todo Reminder Turns Since Write | 5 | Avoid spamming |
| Todo Reminder Turns Between | 3 | Throttle reminders |
| Task Progress Turn Threshold | 3 | Throttle progress updates |
| Plan Mode Full Reminder Interval | N | Sparse reminders between |

---

## Summary

The system reminder mechanism in v2.1.7 is a multi-layered attachment system that:

1. **Generates** contextual information from various sources
2. **Filters** based on relevance and throttling rules
3. **Converts** to API-compatible system messages
4. **Injects** into the conversation at strategic points
5. **Delivers** context to the AI without user-visible clutter

Key improvements in v2.1.7:
- **Delegate Mode**: New execution mode for team coordination
- **Unified Tasks**: Consolidated task status/progress system
- **Sparse Reminders**: Optimized token usage for plan mode
- **Plan Mode Exit**: Explicit notification when leaving plan mode
- **Collaboration**: Support for multi-agent collaboration notifications

This allows Claude Code to maintain awareness of:
- File changes
- Session state
- User preferences
- IDE context
- Async communications
- Task tracking
- Diagnostic information
- Budget/token limits
- Plan/delegate mode status
- Team collaboration

All while maintaining a clean user-facing conversation experience.
