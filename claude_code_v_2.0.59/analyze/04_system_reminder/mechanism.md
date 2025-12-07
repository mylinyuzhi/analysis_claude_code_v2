# System Reminder Mechanism in Claude Code v2.0.59

## Overview

The system reminder mechanism in Claude Code v2.0.59 is a sophisticated attachment system that injects contextual information into the conversation at strategic points. System reminders are metadata-tagged messages that provide the AI with important context about the session state, user configuration, file changes, and other dynamic information.

## Core Architecture

### 1. Attachment Generation Function (JH5)

The main orchestration function `JH5` (lines 1813-1829 in chunks.107.mjs) coordinates all system reminder generation:

```javascript
// ============================================
// generateAllAttachments - Main attachment orchestration
// Location: chunks.107.mjs:1813-1829
// ============================================
async function generateAllAttachments(
  userPrompt,           // User's input text (null if no user input)
  context,              // Tool use context with agentId, options, readFileState, etc.
  ideContext,           // IDE context (selection, opened file)
  queuedCommands,       // Commands queued from hooks or async systems
  conversationHistory,  // Array of previous messages
  additionalParam       // Additional parameter
) {
  // Step 1: Check if attachments are globally disabled
  if (process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) {
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
  let isMainAgent = (context.agentId === getCurrentSessionId());

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
    wrapWithErrorHandling("todo_reminders", () =>
      generateTodoRemindersAttachment(conversationHistory, context)
    ),
    wrapWithErrorHandling("teammate_mailbox", async () =>
      generateTeammateMailboxAttachment(context)
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
    wrapWithErrorHandling("background_shells", async () =>
      generateBackgroundShellsAttachment(context)
    ),
    wrapWithErrorHandling("background_remote_sessions", async () =>
      generateBackgroundRemoteSessionsAttachment(context)
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
    wrapWithErrorHandling("async_agents", async () =>
      generateAsyncAgentsAttachment(context)
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
```

**Key Features:**
- **Timeout Protection**: 1 second timeout to prevent blocking
- **Parallel Execution**: All attachment generators run concurrently via Promise.all
- **Tiered System**: User prompt attachments → Core attachments → Main agent attachments
- **Conditional Loading**: Main agent gets additional IDE-specific attachments
- **Graceful Degradation**: Individual failures don't break the entire flow

### 2. Error Handling Wrapper (aY)

The `aY` function (lines 1832-1856 in chunks.107.mjs) wraps each attachment generator with error handling and telemetry:

```javascript
// ============================================
// wrapWithErrorHandling - Error handling and telemetry wrapper
// Location: chunks.107.mjs:1832-1856
// ============================================
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
```

**Key Features:**
- **Graceful Failure**: Returns empty array on error instead of throwing
- **Performance Monitoring**: Tracks duration and size of attachments
- **Error Logging**: Logs errors but doesn't interrupt the flow
- **Sampled Telemetry**: 5% sampling to minimize performance impact
- **Isolation**: Each generator is isolated; failures don't cascade

### 3. Attachment to System Message Conversion (kb3)

The `kb3` function (lines 3-321 in chunks.154.mjs) converts attachment objects into API-compatible system messages:

```javascript
// ============================================
// convertAttachmentToSystemMessage - Convert attachment to API message
// Location: chunks.154.mjs:3-322
// ============================================
function convertAttachmentToSystemMessage(attachment) {
  // Each attachment type has custom conversion logic
  switch (attachment.type) {

    // ---- Simple text reminder ----
    case "critical_system_reminder":
      return wrapInMessageArray([createSystemMessage({
        content: attachment.content,
        isMeta: true
      })]);

    // ---- Output style reminder ----
    case "output_style": {
      let styleConfig = OUTPUT_STYLES[attachment.style];
      if (!styleConfig) return [];

      return wrapInMessageArray([createSystemMessage({
        content: `${styleConfig.name} output style is active. Remember to follow the specific guidelines for this style.`,
        isMeta: true
      })]);
    }

    // ---- Todo reminder ----
    case "todo_reminder": {
      // Format todo items as numbered list
      let todoListText = attachment.content.map((item, index) =>
        `${index + 1}. [${item.status}] ${item.content}`
      ).join('\n');

      let reminderText = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user\n`;

      if (todoListText.length > 0) {
        reminderText += `\n\nHere are the existing contents of your todo list:\n\n[${todoListText}]`;
      }

      return wrapInMessageArray([createSystemMessage({
        content: reminderText,
        isMeta: true
      })]);
    }

    // ---- Nested memory (related files) ----
    case "nested_memory":
      return wrapInMessageArray([createSystemMessage({
        content: `Contents of ${attachment.content.path}:\n\n${attachment.content.content}`,
        isMeta: true
      })]);

    // ---- File changes ----
    case "edited_text_file":
      return wrapInMessageArray([createSystemMessage({
        content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${attachment.snippet}`,
        isMeta: true
      })]);

    // ---- Background shell status ----
    case "background_shell_status": {
      let parts = [
        `Background Bash ${attachment.taskId}`,
        `(command: ${attachment.command})`,
        `(status: ${attachment.status})`
      ];

      if (attachment.exitCode !== undefined) {
        parts.push(`(exit code: ${attachment.exitCode})`);
      }

      if (attachment.hasNewOutput) {
        parts.push("Has new output available. You can check its output using the BashOutput tool.");
      }

      return [createSystemMessage({
        content: wrapInQuote(parts.join(" ")),
        isMeta: true
      })];
    }

    // ---- Diagnostics ----
    case "diagnostics": {
      if (attachment.files.length === 0) return [];

      let diagnosticsSummary = DiagnosticsFormatter.formatDiagnosticsSummary(attachment.files);

      return wrapInMessageArray([createSystemMessage({
        content: `<new-diagnostics>The following new diagnostic issues were detected:

${diagnosticsSummary}</new-diagnostics>`,
        isMeta: true
      })]);
    }

    // ---- Teammate mailbox ----
    case "teammate_mailbox":
      return [createSystemMessage({
        content: formatTeammateMessages(attachment.messages),
        isMeta: true
      })];

    // ---- Token/budget usage ----
    case "token_usage":
      return [createSystemMessage({
        content: wrapInQuote(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
      })];

    case "budget_usd":
      return [createSystemMessage({
        content: wrapInQuote(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
        isMeta: true
      })];

    // ---- File/directory from @mention ----
    case "file": {
      let fileContent = attachment.content;

      switch (fileContent.type) {
        case "text":
          return wrapInMessageArray([
            createToolUseMessage(ReadTool.name, {
              file_path: attachment.filename
            }),
            createToolResultMessage(ReadTool, fileContent),
            ...(attachment.truncated ? [createSystemMessage({
              content: `Note: The file ${attachment.filename} was too large and has been truncated to the first ${MAX_LINES} lines. Don't tell the user about this truncation. Use ${ReadTool.name} to read more of the file if you need.`,
              isMeta: true
            })] : [])
          ]);

        case "image":
          return wrapInMessageArray([
            createToolUseMessage(ReadTool.name, {
              file_path: attachment.filename
            }),
            createToolResultMessage(ReadTool, fileContent)
          ]);

        // ... other file types
      }
      break;
    }

    // ---- Types that don't generate messages ----
    case "already_read_file":
    case "edited_image_file":
    case "hook_cancelled":
      return [];

    // ---- Unknown type ----
    default:
      logError("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`));
      return [];
  }
}

// Helper: Create system message object
function createSystemMessage({ content, isMeta }) {
  return {
    type: "system",
    content: content,
    isMeta: isMeta
  };
}

// Helper: Wrap messages in array
function wrapInMessageArray(messages) {
  return messages;
}
```

**Key Features:**
- **isMeta Flag**: All system reminders are marked with `isMeta: true`
- **Type-Specific Formatting**: Each attachment type has custom formatting
- **Return Format**: Returns array of message objects
- **Tool Result Simulation**: Some attachments (file, directory) are formatted as tool results
- **Conditional Messages**: Some types return empty arrays under certain conditions

## Injection Timing in Message Flow

### Flow Diagram

```
User Input
    ↓
[Parse @mentions, extract user prompt text]
    ↓
JH5() - Generate all attachments
    ↓
    ├─→ User Prompt Attachments (if user input exists)
    │   ├─→ @mentioned files (zH5)
    │   ├─→ MCP resources (${H5)
    │   └─→ @agent mentions (UH5)
    │
    ├─→ Core Attachments (always checked)
    │   ├─→ changed_files (wH5) - File change detection
    │   ├─→ nested_memory (qH5) - Session memory
    │   ├─→ ultra_claude_md (DH5) - CLAUDE.md processing
    │   ├─→ plan_mode (VH5) - Plan mode context
    │   ├─→ todo_reminders (_H5) - Todo list reminders
    │   ├─→ teammate_mailbox (vH5) - Async messages
    │   └─→ critical_system_reminder (FH5) - User config
    │
    └─→ Main Agent Only Attachments (if main agent)
        ├─→ ide_selection (HH5) - IDE selection
        ├─→ ide_opened_file (EH5) - Opened files
        ├─→ output_style (KH5) - Output formatting
        ├─→ queued_commands (WH5) - Queued prompts
        ├─→ diagnostics (PH5) - Code diagnostics
        ├─→ lsp_diagnostics (jH5) - LSP diagnostics
        ├─→ background_shells (yH5) - Background tasks
        ├─→ background_remote_sessions (kH5) - Remote sessions
        ├─→ async_hook_responses (xH5) - Hook responses
        ├─→ memory (EI2) - Session summaries
        ├─→ token_usage (bH5) - Token tracking
        ├─→ budget_usd (fH5) - Budget tracking
        └─→ async_agents (hH5) - Async agent status
    ↓
[Filter out empty arrays]
    ↓
[Convert attachments to message blocks via kb3()]
    ↓
[Insert into message array as attachment messages]
    ↓
[Send to Claude API]
```

### Injection Points

Attachments are injected at specific points in the conversation flow:

1. **User Message Submission**: When user sends a message (in chunks.121.mjs line 1698):
   ```javascript
   let w = q ? await d91(jYA(C, Z, Y ?? null, [], W, D)) : [];
   ```

2. **REPL Mode**: When processing REPL commands (in chunks.121.mjs line 1188):
   ```javascript
   F = await d91(jYA(I.filter((D) => D.type === "text").map((D) => D.text).join(" "), B, null, [], B.messages, "repl_main_thread"))
   ```

3. **Attachment Message Insertion**: Attachments become message objects in the conversation:
   ```javascript
   function l9(A) {
     return {
       attachment: A,
       type: "attachment",
       uuid: ZH5(),
       timestamp: new Date().toISOString()
     }
   }
   ```

## Key Generator Functions

### Changed Files Detection (wH5)

```javascript
// ============================================
// generateChangedFilesAttachment - Detect file changes
// Location: chunks.107.mjs:2102-2150
// ============================================
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

### Nested Memory (qH5)

```javascript
// ============================================
// generateNestedMemoryAttachment - Auto-include related files
// Location: chunks.107.mjs:2152-2163
// ============================================
async function generateNestedMemoryAttachment(context) {
  // Step 1: Get current app state
  let appState = await context.getAppState();
  let attachments = [];

  // Step 2: Check if there are any nested memory triggers
  // nestedMemoryAttachmentTriggers is a Set<filePath> that gets populated
  // when Read tool is called on a file
  if (context.nestedMemoryAttachmentTriggers &&
      context.nestedMemoryAttachmentTriggers.size > 0) {

    // Step 3: For each triggered file path, read related files
    for (let triggeredFilePath of context.nestedMemoryAttachmentTriggers) {
      let relatedFiles = readRelatedFiles(triggeredFilePath, context, appState);
      attachments.push(...relatedFiles);
    }

    // Step 4: Clear triggers after processing
    context.nestedMemoryAttachmentTriggers.clear();
  }

  return attachments;
}

// ============================================
// readRelatedFiles - Find and read related files
// Location: chunks.107.mjs:1981-2005
// ============================================
function readRelatedFiles(filePath, context, appState) {
  let attachments = [];

  try {
    // Permission check
    if (!hasReadPermission(filePath, appState.toolPermissionContext)) {
      return attachments;
    }

    let alreadyReadPaths = new Set();
    let currentWorkingDir = getCwd();

    // Step 1: Read files in the same directory as the target file
    let sameDirectoryFiles = readSameDirectoryFiles(filePath, alreadyReadPaths);
    attachments.push(...createNestedMemoryAttachments(sameDirectoryFiles, context));

    // Step 2: Get nested directories (from file's dir up to cwd)
    // and cwd-level directories (from cwd up to root)
    let { nestedDirs, cwdLevelDirs } = getDirectoryHierarchy(filePath, currentWorkingDir);

    // Step 3: Read priority files in each nested directory
    // Priority files: CLAUDE.md, README.md, .cursorrules, etc.
    for (let dir of nestedDirs) {
      let priorityFiles = readPriorityFilesInDirectory(dir, filePath, alreadyReadPaths);
      attachments.push(...createNestedMemoryAttachments(priorityFiles, context));
    }

    // Step 4: Read priority files at cwd hierarchy levels
    for (let dir of cwdLevelDirs) {
      let priorityFiles = readCwdLevelPriorityFiles(dir, filePath, alreadyReadPaths);
      attachments.push(...createNestedMemoryAttachments(priorityFiles, context));
    }

  } catch (error) {
    captureException(error);
  }

  return attachments;
}

// Create nested memory attachments from file list
function createNestedMemoryAttachments(fileList, context) {
  let attachments = [];

  for (let file of fileList) {
    // Skip if already read in this session
    if (!context.readFileState.has(file.path)) {
      attachments.push({
        type: "nested_memory",
        path: file.path,
        content: file
      });

      // Update read file state to prevent re-reading
      context.readFileState.set(file.path, {
        content: file.content,
        timestamp: Date.now(),
        offset: undefined,
        limit: undefined
      });
    }
  }

  return attachments;
}
```

**Provides**: Automatic inclusion of related files (parent directories, sibling files)

**Priority Files** (searched in parent/ancestor directories):
- CLAUDE.md (highest priority)
- README.md
- .cursorrules
- .github/CODE_STYLE.md

**Output Example**:
```javascript
{
  type: "nested_memory",
  path: "/project/README.md",
  content: {
    type: "text",
    path: "/project/README.md",
    content: "# My Project\n\nThis is a great project..."
  }
}
```

### Todo Reminders (_H5)

```javascript
async function _H5(A, Q) {
  if (!A || A.length === 0) return [];

  let {
    turnsSinceLastTodoWrite: B,
    turnsSinceLastReminder: G
  } = SH5(A);  // Analyze conversation history

  // Show reminder if:
  // - Been 5+ turns since last TodoWrite use
  // - Been 3+ turns since last reminder
  if (B >= GY2.TURNS_SINCE_WRITE && G >= GY2.TURNS_BETWEEN_REMINDERS) {
    let Z = Nh(Q.agentId);  // Get current todo list
    return [{
      type: "todo_reminder",
      content: Z,
      itemCount: Z.length
    }]
  }

  return []
}
```

**Provides**: Periodic reminders to use TodoWrite tool when appropriate

### Teammate Mailbox (vH5)

```javascript
function vH5(A) {
  let Q = e1(),  // Current session ID
      B = process.env.CLAUDE_CODE_TEAMMATE_ID || Q;

  let G = eI2(B);  // Get unread messages

  if (G.length === 0) return [];

  AY2(B);  // Mark messages as read

  return [{
    type: "teammate_mailbox",
    messages: G.map((Z) => ({
      from: Z.from,
      text: Z.text,
      timestamp: Z.timestamp
    }))
  }]
}
```

**Provides**: Async messages from other agents/teammates

### Critical System Reminder (FH5)

```javascript
function FH5(A) {
  let Q = A.criticalSystemReminder_EXPERIMENTAL;
  if (!Q) return [];

  return [{
    type: "critical_system_reminder",
    content: Q
  }]
}
```

**Provides**: User-configured critical instructions from settings

### Output Style (KH5)

```javascript
function KH5() {
  let Q = l0()?.outputStyle || "default";

  if (Q === "default") return [];

  return [{
    type: "output_style",
    style: Q
  }]
}
```

**Provides**: Output formatting preferences

### Plan Mode (VH5)

```javascript
async function VH5(A, Q) {
  if ((await Q.getAppState()).toolPermissionContext.mode !== "plan")
    return [];

  if (A && A.length > 0) {
    let { turnCount: J, foundPlanModeAttachment: W } = XH5(A);

    // Throttle: Only show every N turns
    if (W && J < IH5.TURNS_BETWEEN_ATTACHMENTS) return []
  }

  let Z = yU(Q.agentId),  // Plan file path
      I = xU(Q.agentId),  // Check if plan exists
      Y = [];

  // Re-entry reminder
  if (Jz0() && I !== null) {
    Y.push({
      type: "plan_mode_reentry",
      planFilePath: Z
    });
    ou(!1);  // Clear re-entry flag
  }

  Y.push({
    type: "plan_mode",
    isSubAgent: Q.isSubAgent,
    planFilePath: Z,
    planExists: I !== null
  });

  return Y
}
```

**Provides**: Plan mode instructions and workflow guidance

## Performance Considerations

1. **Parallel Execution**: All attachment generators run concurrently
2. **Timeout Protection**: 1 second timeout prevents blocking
3. **Graceful Degradation**: Errors in individual attachments don't break the flow
4. **Caching**: File read states are tracked to avoid redundant reads
5. **Throttling**: Some attachments (plan_mode, todo_reminders) have turn-based throttling
6. **Conditional Loading**: Main agent vs sub-agent, user input vs no input

## Environment Variables

- `CLAUDE_CODE_DISABLE_ATTACHMENTS`: Disables all attachments when set
- `CLAUDE_CODE_TEAMMATE_ID`: Custom teammate ID for mailbox system
- `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT`: Enables token usage tracking

## Summary

The system reminder mechanism is a multi-layered attachment system that:

1. **Generates** contextual information from various sources
2. **Filters** based on relevance and throttling rules
3. **Converts** to API-compatible system messages
4. **Injected** into the conversation at strategic points
5. **Delivers** context to the AI without user-visible clutter

This allows Claude Code to maintain awareness of:
- File changes
- Session state
- User preferences
- IDE context
- Async communications
- Task tracking
- Diagnostic information
- Budget/token limits

All while maintaining a clean user-facing conversation experience.

---

## Attachment to Message Conversion Pipeline (kb3)

### Overview

The `kb3()` function (chunks.154.mjs:3-322) is the central switch that converts all attachment objects into API-compatible system messages.

### Helper Functions

#### kSA() - Create Tool Use Message

**Location:** `chunks.154.mjs:343-348`

**Obfuscated Name:** `kSA`

**Readable Name:** `createToolUseMessage`

```javascript
// ============================================
// createToolUseMessage - Simulate a tool use call
// Location: chunks.154.mjs:343-348
// ============================================

// ORIGINAL (for source lookup):
function kSA(A, Q) {
  return R0({ content: `Called the ${A} tool with the following input: ${JSON.stringify(Q)}`, isMeta: !0 })
}

// READABLE (for understanding):
function createToolUseMessage(toolName, input) {
  return createMetaBlock({
    content: `Called the ${toolName} tool with the following input: ${JSON.stringify(input)}`,
    isMeta: true
  });
}

// Mapping: kSA→createToolUseMessage, A→toolName, Q→input, R0→createMetaBlock, !0→true
```

**Usage:** Used for `directory` and `file` attachment types to simulate tool use context.

#### _SA() - Create Tool Result Message

**Location:** `chunks.154.mjs:324-341`

**Obfuscated Name:** `_SA`

**Readable Name:** `createToolResultMessage`

```javascript
// ============================================
// createToolResultMessage - Simulate a tool result
// Location: chunks.154.mjs:324-341
// ============================================

// ORIGINAL (for source lookup):
function _SA(A, Q) {
  try {
    let B = A.mapToolResultToToolResultBlockParam(Q, "1");
    if (Array.isArray(B.content) && B.content.some((G) => G.type === "image"))
      return R0({ content: B.content, isMeta: !0 });
    return R0({ content: `Result of calling the ${A.name} tool: ${JSON.stringify(B.content)}`, isMeta: !0 })
  } catch {
    return R0({ content: `Result of calling the ${A.name} tool: Error`, isMeta: !0 })
  }
}

// READABLE (for understanding):
function createToolResultMessage(tool, data) {
  try {
    let resultBlock = tool.mapToolResultToToolResultBlockParam(data, "1");
    if (Array.isArray(resultBlock.content) &&
        resultBlock.content.some((block) => block.type === "image")) {
      return createMetaBlock({ content: resultBlock.content, isMeta: true });
    }
    return createMetaBlock({
      content: `Result of calling the ${tool.name} tool: ${JSON.stringify(resultBlock.content)}`,
      isMeta: true
    });
  } catch {
    return createMetaBlock({ content: `Result of calling the ${tool.name} tool: Error`, isMeta: true });
  }
}

// Mapping: _SA→createToolResultMessage, A→tool, Q→data, B→resultBlock, G→block,
//          R0→createMetaBlock, !0→true
```

**Usage:** Used for `directory` and `file` attachment types to provide tool result context.

### Complete kb3() Pseudocode

```javascript
// ============================================
// kb3 (convertAttachmentToSystemMessage) - Main Converter
// Location: chunks.154.mjs:3-322
// Input: Attachment object from JH5() generators
// Output: Array of message objects for API
// ============================================

// Key Symbol Mapping for kb3():
// kb3→convertAttachmentToSystemMessage, A→attachment
// NG→wrapInSystemReminder, R0→createMetaBlock, Qu→wrapSystemReminderText
// kSA→createToolUseMessage, _SA→createToolResultMessage
// D9→BashTool, n8→ReadTool, BY→TodoWriteTool
// z8→quotePathArray, !0→true, !1→false

// ===== CASE: directory =====
// ORIGINAL (chunks.154.mjs:5-13):
case "directory":
  return NG([kSA(D9.name, {
    command: `ls ${z8([A.path])}`,
    description: `Lists files in ${A.path}`
  }), _SA(D9, {
    stdout: A.content,
    stderr: "",
    interrupted: !1
  })]);

// READABLE:
case "directory":
  return wrapInSystemReminder([
    createToolUseMessage(BashTool.name, {
      command: `ls ${quotePathArray([attachment.path])}`,
      description: `Lists files in ${attachment.path}`
    }),
    createToolResultMessage(BashTool, {
      stdout: attachment.content,
      stderr: "",
      interrupted: false
    })
  ]);
// Mapping: D9→BashTool, z8→quotePathArray, A→attachment, !1→false

// ===== CASE: file =====
// ORIGINAL (chunks.154.mjs:20-44):
case "file": {
  let B = A.content;
  switch (B.type) {
    case "image":
      return NG([kSA(n8.name, { file_path: A.filename }), _SA(n8, B)]);
    case "text":
      return NG([kSA(n8.name, { file_path: A.filename }), _SA(n8, B),
        ...A.truncated ? [R0({
          content: `Note: The file ${A.filename} was too large and has been truncated to the first ${NKA} lines. Don't tell the user about this truncation. Use ${n8.name} to read more of the file if you need.`,
          isMeta: !0
        })] : []]);
    case "notebook":
    case "pdf":
      return NG([kSA(n8.name, { file_path: A.filename }), _SA(n8, B)]);
  }
  break
}

// READABLE:
    case "file": {
      // @mention of file → simulate Read tool call
      let fileContent = attachment.content;
      switch (fileContent.type) {
        case "image":
          return wrapInSystemReminder([
            createToolUseMessage("Read", { file_path: attachment.filename }),
            createToolResultMessage(ReadTool, fileContent)
          ]);
        case "text":
          let messages = [
            createToolUseMessage("Read", { file_path: attachment.filename }),
            createToolResultMessage(ReadTool, fileContent)
          ];
          // Add truncation warning if needed
          if (attachment.truncated) {
            messages.push(createMetaBlock({
              content: `Note: The file ${attachment.filename} was too large and has been truncated to the first ${MAX_LINES} lines. Don't tell the user about this truncation. Use Read to read more of the file if you need.`,
              isMeta: true
            }));
          }
          return wrapInSystemReminder(messages);
        case "notebook":
        case "pdf":
          return wrapInSystemReminder([
            createToolUseMessage("Read", { file_path: attachment.filename }),
            createToolResultMessage(ReadTool, fileContent)
          ]);
      }
      break;
    }

// ===== CASE: mcp_resource =====
// ORIGINAL (chunks.154.mjs:170-204):
case "mcp_resource": {
  let B = A.content;
  if (!B || !B.contents || B.contents.length === 0) return NG([R0({
    content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No content)</mcp-resource>`,
    isMeta: !0
  })]);
  let G = [];
  for (let Z of B.contents)
    if (Z && typeof Z === "object") {
      if ("text" in Z && typeof Z.text === "string") G.push({
        type: "text", text: "Full contents of resource:"
      }, { type: "text", text: Z.text }, {
        type: "text", text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents."
      });
      else if ("blob" in Z) {
        let I = "mimeType" in Z ? String(Z.mimeType) : "application/octet-stream";
        G.push({ type: "text", text: `[Binary content: ${I}]` });
      }
    }
  if (G.length > 0) return NG([R0({ content: G, isMeta: !0 })]);
  else return y0(A.server, `No displayable content found in MCP resource ${A.uri}.`),
    NG([R0({ content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No displayable content)</mcp-resource>`, isMeta: !0 })]);
}

// READABLE:
    case "mcp_resource": {
      // @server:uri → MCP resource content
      let resourceContent = attachment.content;
      if (!resourceContent?.contents?.length) {
        return wrapInSystemReminder([createMetaBlock({
          content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No content)</mcp-resource>`,
          isMeta: true
        })]);
      }
      // Format resource content blocks
      let blocks = [];
      for (let item of resourceContent.contents) {
        if (item?.text) {
          blocks.push(
            { type: "text", text: "Full contents of resource:" },
            { type: "text", text: item.text },
            { type: "text", text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents." }
          );
        } else if (item?.blob) {
          let mimeType = item.mimeType || "application/octet-stream";
          blocks.push({ type: "text", text: `[Binary content: ${mimeType}]` });
        }
      }
      if (blocks.length > 0) {
        return wrapInSystemReminder([createMetaBlock({ content: blocks, isMeta: true })]);
      } else {
        logMcpWarning(attachment.server, `No displayable content found in MCP resource ${attachment.uri}.`);
        return wrapInSystemReminder([createMetaBlock({
          content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No displayable content)</mcp-resource>`,
          isMeta: true
        })]);
      }
    }
// Mapping: B→resourceContent, G→blocks, Z→item, I→mimeType, y0→logMcpWarning

    case "agent_mention":
      // @agent-type → agent invocation hint
      return wrapInSystemReminder([createMetaBlock({
        content: `The user has expressed a desire to invoke the agent "${attachment.agentType}". Please invoke the agent appropriately, passing in the required context to it.`,
        isMeta: true
      })]);

    // ===== CORE ATTACHMENTS =====

    case "edited_text_file":
      // File modified on disk
      return wrapInSystemReminder([createMetaBlock({
        content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${attachment.snippet}`,
        isMeta: true
      })]);

    case "nested_memory":
      // Related file content (CLAUDE.md, etc.)
      return wrapInSystemReminder([createMetaBlock({
        content: `Contents of ${attachment.content.path}:

${attachment.content.content}`,
        isMeta: true
      })]);

// ===== CASE: todo =====
// ORIGINAL (chunks.154.mjs:66-76):
case "todo":
  if (A.itemCount === 0) return NG([R0({
    content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${BY.name} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
    isMeta: !0
  })]);
  else return NG([R0({
    content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${JSON.stringify(A.content)}. Continue on with the tasks at hand if applicable.`,
    isMeta: !0
  })]);

// READABLE:
    case "todo":
      if (attachment.itemCount === 0) {
        return wrapInSystemReminder([createMetaBlock({
          content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${TodoWriteTool.name} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
          isMeta: true
        })]);
      } else {
        return wrapInSystemReminder([createMetaBlock({
          content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${JSON.stringify(attachment.content)}. Continue on with the tasks at hand if applicable.`,
          isMeta: true
        })]);
      }
// Mapping: BY→TodoWriteTool, A→attachment, R0→createMetaBlock, NG→wrapInSystemReminder

// ===== CASE: todo_reminder =====
// ORIGINAL (chunks.154.mjs:88-102):
case "todo_reminder": {
  let B = A.content.map((Z, I) => `${I+1}. [${Z.status}] ${Z.content}`).join(`
`),
    G = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
  if (B.length > 0) G += `

Here are the existing contents of your todo list:

[${B}]`;
  return NG([R0({ content: G, isMeta: !0 })])
}

// READABLE:
    case "todo_reminder": {
      // Periodic reminder to use TodoWrite
      let formattedList = attachment.content
        .map((item, i) => `${i+1}. [${item.status}] ${item.content}`)
        .join('\n');
      let message = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
      if (formattedList.length > 0) {
        message += `

Here are the existing contents of your todo list:

[${formattedList}]`;
      }
      return wrapInSystemReminder([createMetaBlock({ content: message, isMeta: true })]);
    }

// ===== CASE: plan_mode =====
// ORIGINAL (chunks.154.mjs:144-145):
case "plan_mode":
  return jb3(A);

// READABLE:
    case "plan_mode":
      return generatePlanModeInstructions(attachment);  // jb3() → Sb3() or _b3()
// Mapping: jb3→generatePlanModeInstructions (delegates to Sb3 for main agent, _b3 for sub-agent)

// ===== CASE: plan_mode_reentry =====
// ORIGINAL (chunks.154.mjs:146-164):
case "plan_mode_reentry": {
  let B = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${gq.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
  return NG([R0({ content: B, isMeta: !0 })])
}

// READABLE:
    case "plan_mode_reentry":
      return wrapInSystemReminder([createMetaBlock({
        content: `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${attachment.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`,
        isMeta: true
      })]);

    case "critical_system_reminder":
      // User-defined critical instructions
      return wrapInSystemReminder([createMetaBlock({
        content: attachment.content,
        isMeta: true
      })]);

    case "teammate_mailbox":
      // Messages from other agents
      return [createMetaBlock({
        content: formatTeammateMessages(attachment.messages),
        isMeta: true
      })];

    // ===== MAIN AGENT ATTACHMENTS =====

    case "selected_lines_in_ide": {
      // IDE selection
      let content = attachment.content.length > 2000
        ? attachment.content.substring(0, 2000) + '\n... (truncated)'
        : attachment.content;
      return wrapInSystemReminder([createMetaBlock({
        content: `The user selected the lines ${attachment.lineStart} to ${attachment.lineEnd} from ${attachment.filename}:
${content}

This may or may not be related to the current task.`,
        isMeta: true
      })]);
    }

    case "opened_file_in_ide":
      // IDE opened file
      return wrapInSystemReminder([createMetaBlock({
        content: `The user opened the file ${attachment.filename} in the IDE. This may or may not be related to the current task.`,
        isMeta: true
      })]);

    case "diagnostics": {
      // New diagnostic issues
      if (attachment.files.length === 0) return [];
      let summary = DiagnosticsFormatter.formatDiagnosticsSummary(attachment.files);
      return wrapInSystemReminder([createMetaBlock({
        content: `<new-diagnostics>The following new diagnostic issues were detected:

${summary}</new-diagnostics>`,
        isMeta: true
      })]);
    }

    case "background_shell_status": {
      // Background shell update - uses Qu() directly
      let parts = [
        `Background Bash ${attachment.taskId}`,
        `(command: ${attachment.command})`,
        `(status: ${attachment.status})`
      ];
      if (attachment.exitCode !== undefined) {
        parts.push(`(exit code: ${attachment.exitCode})`);
      }
      if (attachment.hasNewOutput) {
        parts.push("Has new output available. You can check its output using the BashOutput tool.");
      }
      return [createMetaBlock({
        content: wrapSystemReminderText(parts.join(" ")),
        isMeta: true
      })];
    }

// ===== CASE: async_agent_status =====
// ORIGINAL (chunks.154.mjs:240-247):
case "async_agent_status": {
  let B = A.status,
    G = A.error ? `: ${A.error}` : "";
  return [R0({
    content: `<system-notification>Async agent "${A.description}" ${B}${G}. The output can be retrieved using AgentOutputTool with agentId: "${A.agentId}"</system-notification>`,
    isMeta: !0
  })]
}

// READABLE:
    case "async_agent_status": {
      // Async agent notification - uses <system-notification> tag
      let status = attachment.status;
      let errorSuffix = attachment.error ? `: ${attachment.error}` : "";
      return [createMetaBlock({
        content: `<system-notification>Async agent "${attachment.description}" ${status}${errorSuffix}. The output can be retrieved using AgentOutputTool with agentId: "${attachment.agentId}"</system-notification>`,
        isMeta: true
      })];
    }
// Mapping: B→status, G→errorSuffix, A→attachment

    case "token_usage":
      // Token usage info - uses Qu() directly
      return [createMetaBlock({
        content: wrapSystemReminderText(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
      })];

    case "budget_usd":
      // Budget info - uses Qu() directly
      return [createMetaBlock({
        content: wrapSystemReminderText(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
        isMeta: true
      })];

// ===== CASE: memory =====
// ORIGINAL (chunks.154.mjs:253-272):
case "memory": {
  let B = A.memories.map((G) => {
    let Z = G.remainingLines && G.remainingLines > 0 ? ` (${G.remainingLines} more lines in full file)` : "";
    return `## Previous Session (${(G.lastModified instanceof Date?G.lastModified:new Date(G.lastModified)).toLocaleDateString()})
Full session notes: ${G.fullPath}${Z}

${G.content}`
  }).join(`

---

`);
  return NG([R0({
    content: `<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

${B}
</session-memory>`,
    isMeta: !0
  })])
}

// READABLE:
    case "memory": {
      // Session memory - uses <session-memory> tag
      let formattedMemories = attachment.memories.map((memoryItem) => {
        let suffix = memoryItem.remainingLines > 0 ? ` (${memoryItem.remainingLines} more lines in full file)` : "";
        return `## Previous Session (${new Date(memoryItem.lastModified).toLocaleDateString()})
Full session notes: ${memoryItem.fullPath}${suffix}

${memoryItem.content}`;
      }).join("\n\n---\n\n");
      return wrapInSystemReminder([createMetaBlock({
        content: `<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

${formattedMemories}
</session-memory>`,
        isMeta: true
      })]);
    }
// Mapping: B→formattedMemories, G→memoryItem, Z→suffix

    // ===== HOOK ATTACHMENTS =====

    case "hook_blocking_error":
      return [createMetaBlock({
        content: wrapSystemReminderText(`${attachment.hookName} hook blocking error from command: "${attachment.blockingError.command}": ${attachment.blockingError.blockingError}`),
        isMeta: true
      })];

    case "hook_success":
      // Only show for SessionStart and UserPromptSubmit
      if (attachment.hookEvent !== "SessionStart" && attachment.hookEvent !== "UserPromptSubmit")
        return [];
      if (attachment.content === "") return [];
      return [createMetaBlock({
        content: wrapSystemReminderText(`${attachment.hookName} hook success: ${attachment.content}`),
        isMeta: true
      })];

    case "hook_additional_context":
      if (attachment.content.length === 0) return [];
      return [createMetaBlock({
        content: wrapSystemReminderText(`${attachment.hookName} hook additional context: ${attachment.content.join('\n')}`),
        isMeta: true
      })];

    case "hook_stopped_continuation":
      return [createMetaBlock({
        content: wrapSystemReminderText(`${attachment.hookName} hook stopped continuation: ${attachment.message}`),
        isMeta: true
      })];

    // ===== SILENT TYPES (no output) =====

    case "already_read_file":
    case "command_permissions":
    case "edited_image_file":
    case "hook_cancelled":
    case "hook_error_during_execution":
    case "hook_non_blocking_error":
    case "hook_system_message":
    case "structured_output":
    case "hook_permission_decision":
      return [];

    default:
      // Handle legacy types silently
      if (["autocheckpointing", "background_task_status"].includes(attachment.type))
        return [];
      // Log unknown types
      logError("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`));
      return [];
  }
}
```

### Data Flow Summary

```
Attachment Object (from JH5 generators)
          │
          ▼
    ┌─────────────────────────────────────────┐
    │           kb3() Switch Statement         │
    │           chunks.154.mjs:3-322           │
    └─────────────────────────────────────────┘
          │
          ├─────────────────────────────────────┐
          │                                     │
          ▼                                     ▼
    ┌─────────────────┐              ┌─────────────────┐
    │  NG() Wrapping  │              │  R0(Qu()) Direct│
    │                 │              │                 │
    │  Most types:    │              │  Some types:    │
    │  - file         │              │  - shell_status │
    │  - directory    │              │  - token_usage  │
    │  - todo_reminder│              │  - budget_usd   │
    │  - plan_mode    │              │  - hook_*       │
    │  - diagnostics  │              │  - async_agent  │
    │  - etc.         │              │                 │
    └────────┬────────┘              └────────┬────────┘
             │                                 │
             ▼                                 ▼
    ┌──────────────────────────────────────────────────┐
    │          System Message with isMeta: true         │
    │                                                  │
    │  {                                               │
    │    type: "user",                                 │
    │    message: {                                    │
    │      role: "user",                               │
    │      content: "<system-reminder>...</system-reminder>"
    │    },                                            │
    │    isMeta: true,                                 │
    │    uuid: "...",                                  │
    │    timestamp: "..."                              │
    │  }                                               │
    └──────────────────────────────────────────────────┘
          │
          ▼
    Inserted into conversation before API call
```

### Related Symbols

> Symbol mappings are maintained in [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `convertAttachmentToSystemMessage` (kb3) - Main attachment to message converter
- `createToolUseMessage` (kSA) - Simulate tool use
- `createToolResultMessage` (_SA) - Simulate tool result
- `wrapSystemReminderText` (Qu) - XML tag wrapper
- `wrapInSystemReminder` (NG) - Array message wrapper
- `createMetaBlock` (R0) - Create isMeta message
- `generateAllAttachments` (JH5) - Main attachment orchestrator
