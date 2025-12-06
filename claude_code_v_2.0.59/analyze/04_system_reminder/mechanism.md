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
