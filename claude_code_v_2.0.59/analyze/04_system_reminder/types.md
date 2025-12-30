# System Reminder Types in Claude Code v2.0.59

## Overview

This document catalogs all system reminder (attachment) types in Claude Code v2.0.59, their trigger conditions, content format, and priority ordering.

## Attachment Categories

System reminders are organized into three categories:

1. **User Prompt Attachments** - Triggered by user input (@mentions, etc.)
2. **Core Attachments** - Always checked, available to all agents
3. **Main Agent Attachments** - Only available to the primary agent (not sub-agents)

---

## User Prompt Attachments

These attachments are only generated when the user provides input with special syntax.

### 1. at_mentioned_files

**Generator Function**: `zH5()` (chunks.107.mjs:2017-2053)

**Trigger**: User message contains `@filename` or `@"path/to/file"` syntax

**Parsing Logic**:
```javascript
// ============================================
// extractAtMentionedFiles - Parse @mentions from user input
// Location: chunks.107.mjs:2165-2177
// ============================================
function extractAtMentionedFiles(userPrompt) {
  // Step 1: Extract quoted mentions (handles spaces in filenames)
  // Pattern: @"file with spaces.txt" or @"path/to/file"
  let quotedPattern = /(^|\s)@"([^"]+)"/g;
  let quotedMatches = [];
  let match;

  while ((match = quotedPattern.exec(userPrompt)) !== null) {
    if (match[2]) {
      quotedMatches.push(match[2]);
    }
  }

  // Step 2: Extract unquoted mentions
  // Pattern: @filename or @path/to/file
  let unquotedPattern = /(^|\s)@([^\s]+)\b/g;
  let unquotedMatches = [];

  (userPrompt.match(unquotedPattern) || []).forEach((matchStr) => {
    let filename = matchStr.slice(matchStr.indexOf("@") + 1);
    // Don't include if it starts with quote (already handled)
    if (!filename.startsWith('"')) {
      unquotedMatches.push(filename);
    }
  });

  // Step 3: Combine and deduplicate
  return [...new Set([...quotedMatches, ...unquotedMatches])];
}

// ============================================
// parseLineRange - Extract line numbers from @mention
// Location: chunks.107.mjs:2191-2201
// ============================================
function parseLineRange(mention) {
  // Pattern: filename#L10-20 or filename#L10
  let pattern = /^([^#]+)(?:#L(\d+)(?:-(\d+))?)?$/;
  let match = mention.match(pattern);

  if (!match) {
    return { filename: mention };
  }

  let [, filename, startLine, endLine] = match;
  let lineStart = startLine ? parseInt(startLine, 10) : undefined;
  let lineEnd = endLine ? parseInt(endLine, 10) : lineStart;

  return {
    filename: filename ?? mention,
    lineStart: lineStart,
    lineEnd: lineEnd
  };
}

// ============================================
// generateAtMentionedFilesAttachment - Read @mentioned files
// Location: chunks.107.mjs:2017-2053
// ============================================
async function generateAtMentionedFilesAttachment(userPrompt, context) {
  // Step 1: Extract all @mentions from user prompt
  let mentions = extractAtMentionedFiles(userPrompt);
  let appState = await context.getAppState();

  // Step 2: Process each mention in parallel
  let attachmentPromises = mentions.map(async (mention) => {
    try {
      // Parse line range if specified
      let { filename, lineStart, lineEnd } = parseLineRange(mention);

      // Resolve to absolute path
      let absolutePath = resolvePath(filename);

      // Check permissions
      if (isPathBlocked(absolutePath, appState.toolPermissionContext)) {
        return null;
      }

      try {
        // Check if it's a directory
        if (fs.statSync(absolutePath).isDirectory()) {
          try {
            // Run ls command to list directory contents
            let result = await BashTool.call({
              command: `ls ${escapeShellArgs([absolutePath])}`,
              description: `Lists files in ${absolutePath}`
            }, context);

            sendTelemetry("tengu_at_mention_extracting_directory_success", {});

            return {
              type: "directory",
              path: absolutePath,
              content: result.data.stdout
            };
          } catch {
            return null;
          }
        }
      } catch {
        // Not a directory, continue as file
      }

      // Read the file with optional line range
      return await readFileForAttachment(
        absolutePath,
        context,
        "tengu_at_mention_extracting_filename_success",
        "tengu_at_mention_extracting_filename_error",
        "at-mention",
        {
          offset: lineStart,
          limit: lineEnd && lineStart ? lineEnd - lineStart + 1 : undefined
        }
      );

    } catch {
      sendTelemetry("tengu_at_mention_extracting_filename_error", {});
      return null;
    }
  });

  // Step 3: Wait for all reads and filter nulls
  let attachments = await Promise.all(attachmentPromises);
  return attachments.filter(Boolean);
}
```

**Content Format**:
```javascript
// File attachment
{
  type: "file",
  filename: "/absolute/path/to/file",
  content: {
    type: "text" | "image" | "notebook" | "pdf",
    file: {
      filePath: string,
      content: string,
      numLines: number,
      startLine: number,
      totalLines: number
    }
  }
}

// Directory attachment
{
  type: "directory",
  path: "/absolute/path/to/dir",
  content: "file1.txt\nfile2.js\nsubdir/"
}
```

**Special Features**:
- Supports line range syntax: `@file.txt#L10-20`
- Handles directories: Returns `ls` output
- Handles images: Returns compressed image data
- Caching: Returns `already_read_file` if file unchanged

**System Message Format**:
```
Called the Read tool with the following input: {"file_path": "/path/to/file"}

Result of calling the Read tool: <file contents>
```

### 2. mcp_resources

**Generator Function**: `$H5()` (chunks.107.mjs:2069-2099)

**Trigger**: User message contains `@server:resource_uri` syntax

**Parsing Logic**:
```javascript
let Q = /(^|\s)@([^\s]+:[^\s]+)\b/g
```

**Content Format**:
```javascript
{
  type: "mcp_resource",
  server: "server_name",
  uri: "resource://uri",
  name: "Resource Name",
  description: "Optional description",
  content: {
    contents: [
      { text: "resource content" } |
      { blob: Buffer, mimeType: "..." }
    ]
  }
}
```

**System Message Format**:
```
Full contents of resource:

<resource content>

Do NOT read this resource again unless you think it may have changed, since you already have the full contents.
```

### 3. agent_mentions

**Generator Function**: `UH5()` (chunks.107.mjs:2055-2067)

**Trigger**: User message contains `@agent-<agentType>` syntax

**Parsing Logic**:
```javascript
let Q = /(^|\s)@(agent-[\w:.@-]+)/g
```

**Content Format**:
```javascript
{
  type: "agent_mention",
  agentType: "search" | "edit" | "custom"
}
```

**System Message Format**:
```
The user has expressed a desire to invoke the agent "<agentType>". Please invoke the agent appropriately, passing in the required context to it.
```

---

## Core Attachments

These attachments are checked on every turn for all agents.

### 4. changed_files

**Generator Function**: `wH5()` (chunks.107.mjs:2102-2150)

**Trigger**: Any previously-read file has been modified on disk

**How It Works**:
1. Checks all files in `readFileState` map
2. Compares file modification timestamp with last read timestamp
3. Re-reads file and generates diff if changed
4. Special handling for TODO file

**Content Formats**:

**Text File Change**:
```javascript
{
  type: "edited_text_file",
  filename: "/path/to/file",
  snippet: "diff output showing changes"
}
```

**Image File Change**:
```javascript
{
  type: "edited_image_file",
  filename: "/path/to/image.png",
  content: "base64_compressed_image_data"
}
```

**TODO File Change**:
```javascript
{
  type: "todo",
  content: [
    { content: "task", status: "pending" | "in_progress" | "completed", activeForm: "..." }
  ],
  itemCount: 3,
  context: "file-watch"
}
```

**System Message Format**:
```
Note: /path/to/file was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):

<diff snippet>
```

### 5. nested_memory

**Generator Function Chain**:
```
qH5() → ZY2() → [pZ2(), lZ2(), iZ2()]
```

| Function | Location | Purpose |
|----------|----------|---------|
| `qH5` | chunks.107.mjs:2152-2163 | Main generator (iterates triggers) |
| `ZY2` | chunks.107.mjs:1981-2005 | Reads related files for a path |
| `CH5` | chunks.107.mjs:1947-1963 | Calculates directory hierarchy |
| `pZ2` | chunks.106.mjs:2082-2090 | Managed + User settings |
| `lZ2` | chunks.106.mjs:2092-2115 | Project files in nested directories |
| `iZ2` | chunks.106.mjs:2117-2120 | Rules at cwd-level directories |

**Trigger Source Locations** (when `nestedMemoryAttachmentTriggers` is populated):

| File Type | Location | Line |
|-----------|----------|------|
| Text files | chunks.88.mjs | 1353 |
| Notebook files | chunks.88.mjs | 1283 |
| Image files | chunks.88.mjs | 1307 |

**Trigger Code Pattern**:
```javascript
// After successful file read:
context.nestedMemoryAttachmentTriggers?.add(absolutePath);
```

**How It Works**:
1. **Read Tool Trigger**: When any file is read, its path is added to `nestedMemoryAttachmentTriggers`
2. **Next API Call**: During `generateAllAttachments()`, `qH5()` iterates over triggered paths
3. **Directory Hierarchy Calculation** (`CH5`):
   - **nestedDirs**: Directories from file's parent up to (not including) cwd
   - **cwdLevelDirs**: Directories from cwd up to filesystem root
4. **File Discovery** (per triggered path):
   - `pZ2()`: Managed settings + User settings (if feature flag enabled)
   - `lZ2()`: Project files for each nested directory
   - `iZ2()`: Rules for each cwd-level directory
5. **Triggers Cleared**: After processing, the Set is cleared

**Directory Hierarchy Example**:
```
cwd = /Users/dev/project
file = /Users/dev/project/src/components/Button.tsx

nestedDirs = ["/Users/dev/project/src", "/Users/dev/project/src/components"]
cwdLevelDirs = ["/Users", "/Users/dev", "/Users/dev/project"]
```

**File Discovery Priority Order**:
```
Priority 1: MANAGED Settings
├── System-managed rules directory
└── via Y91() with type="Managed"

Priority 2: USER Settings (requires "userSettings" feature flag)
├── ~/.claude/rules/
└── via Y91() with type="User", includeExternal=true

Priority 3: PROJECT Settings per nested directory (requires "projectSettings")
├── CLAUDE.md
├── .claude/CLAUDE.md
├── .claude/rules/*.md (non-conditional)
└── .claude/rules/*.md (conditional, glob-matched)

Priority 4: LOCAL Settings (requires "localSettings")
└── CLAUDE.local.md

Priority 5: CWD-Level Rules (ancestors of cwd)
└── .claude/rules/*.md (conditional only)
```

**Feature Flag Dependencies**:

| Flag | Controls | Effect When Disabled |
|------|----------|----------------------|
| `userSettings` | User CLAUDE.md and ~/.claude/rules/ | Skip user-level settings |
| `projectSettings` | Project CLAUDE.md and .claude/CLAUDE.md | Skip project-level settings |
| `localSettings` | CLAUDE.local.md | Skip local-only settings |

**Key Constants** (chunks.106.mjs:2153-2157):

| Constant | Value | Description |
|----------|-------|-------------|
| `Lh` | 40000 | Max content size (40KB) |
| `wYA` | 3000 | Max lines per file |
| `dK5` | 5 | Max @import recursion depth |

**Content Format**:
```javascript
{
  type: "nested_memory",
  path: "/path/to/related/file",
  content: {
    type: "text",
    path: "/path/to/related/file",
    content: "file contents"
  }
}
```

**System Message Format** (kb3 - chunks.154.mjs:103-109):
```
Contents of /path/to/related/file:

<file contents>
```

**UI Rendering** (chunks.142.mjs:317-318):
```javascript
case "nested_memory":
  return <AttachmentInfo>{bold(relativePath(cwd(), attachment.path))}</AttachmentInfo>;
```

**Context Initialization** (chunks.145.mjs:255, 930):
```javascript
// Both main and subagent contexts get fresh Set:
nestedMemoryAttachmentTriggers: new Set()
// Note: NOT inherited from parent context
```

**Detailed Documentation**: See `mechanism.md` § "Nested Memory Deep Dive"

### 6. ultra_claude_md (CLAUDE.md)

**Generator Function**: `DH5()` (chunks.107.mjs:1928-1930)

**Trigger**: Currently disabled (returns empty array)

**Note**: In v2.0.59, CLAUDE.md is handled via `nested_memory` instead of a dedicated attachment type.

### 7. plan_mode

**Generator Function**: `VH5()` (chunks.107.mjs:1886-1908)

**Trigger**: Tool permission context mode is "plan"

**Throttling**: Only appears every N turns (after first appearance)

**Generator Code**:
```javascript
// ============================================
// generatePlanModeAttachment - Plan mode instructions
// Location: chunks.107.mjs:1886-1908
// ============================================
async function generatePlanModeAttachment(conversationHistory, context) {
  // Step 1: Check if currently in plan mode
  let appState = await context.getAppState();
  if (appState.toolPermissionContext.mode !== "plan") {
    return [];
  }

  // Step 2: Throttle plan mode attachments (don't show every turn)
  if (conversationHistory && conversationHistory.length > 0) {
    let { turnCount, foundPlanModeAttachment } = analyzePlanModeHistory(conversationHistory);

    // If we already showed plan mode attachment recently, skip
    if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_PLAN_ATTACHMENTS) {
      return [];
    }
  }

  // Step 3: Get plan file information
  let planFilePath = getPlanFilePath(context.agentId);
  let planContent = readPlanFile(context.agentId);
  let planExists = (planContent !== null);

  let attachments = [];

  // Step 4: Check if re-entering plan mode
  if (isReenteringPlanMode() && planExists) {
    attachments.push({
      type: "plan_mode_reentry",
      planFilePath: planFilePath
    });
    clearReentryFlag();  // Only show re-entry message once
  }

  // Step 5: Add main plan mode attachment
  attachments.push({
    type: "plan_mode",
    isSubAgent: context.isSubAgent,
    planFilePath: planFilePath,
    planExists: planExists
  });

  return attachments;
}

// ============================================
// analyzePlanModeHistory - Count turns since last plan attachment
// Location: chunks.107.mjs:1867-1884
// ============================================
function analyzePlanModeHistory(conversationHistory) {
  let turnCount = 0;
  let foundPlanModeAttachment = false;

  // Scan conversation history backwards
  for (let i = conversationHistory.length - 1; i >= 0; i--) {
    let message = conversationHistory[i];

    if (message?.type === "assistant") {
      // Skip empty assistant messages
      if (isEmptyAssistantMessage(message)) continue;
      turnCount++;
    } else if (message?.type === "attachment" &&
               (message.attachment.type === "plan_mode" ||
                message.attachment.type === "plan_mode_reentry")) {
      foundPlanModeAttachment = true;
      break;
    }
  }

  return { turnCount, foundPlanModeAttachment };
}
```

**Content Formats**:

**Initial Plan Mode**:
```javascript
{
  type: "plan_mode",
  isSubAgent: false,
  planFilePath: "/path/to/.claude/plans/<agent-id>.md",
  planExists: true | false
}
```

**Plan Mode Re-entry** (after exiting and re-entering):
```javascript
{
  type: "plan_mode_reentry",
  planFilePath: "/path/to/.claude/plans/<agent-id>.md"
}
```

**System Message Format** (plan_mode):
```
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
A plan file already exists at /path/to/plan.md. You can read it and make incremental edits using the Edit tool.
[or]
No plan file exists yet. You should create your plan at /path/to/plan.md using the Write tool.

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the Search subagent type.

[... extensive plan mode instructions ...]
```

**System Message Format** (plan_mode_reentry):
```
## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at /path/to/plan.md from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling PlanExit

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.
```

### 8. todo_reminders

**Generator Function**: `_H5()` (chunks.107.mjs:2379-2394)

**Trigger**:
- Been 5+ assistant turns since last TodoWrite tool use
- Been 3+ assistant turns since last todo_reminder attachment

**Throttling Constants** (GY2):
```javascript
TURNS_SINCE_WRITE: 5        // Min turns since TodoWrite
TURNS_BETWEEN_REMINDERS: 3  // Min turns between reminders
```

**Content Format**:
```javascript
{
  type: "todo_reminder",
  content: [
    { content: "task text", status: "pending", activeForm: "task text" },
    { content: "another task", status: "in_progress", activeForm: "doing another task" }
  ],
  itemCount: 2
}
```

**System Message Format**:
```
The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user

Here are the existing contents of your todo list:

[1. [pending] task text
2. [in_progress] another task]
```

### 9. teammate_mailbox

**Generator Function**: `vH5()` (chunks.107.mjs:2482-2496)

**Trigger**: Unread messages exist in `.claude/mailbox/<teammate-id>.json`

**File Location**: `.claude/mailbox/<teammate-id>.json`

**Content Format**:
```javascript
{
  type: "teammate_mailbox",
  messages: [
    {
      from: "teammate_id",
      text: "message content",
      timestamp: "2024-01-15T10:30:00Z"
    }
  ]
}
```

**System Message Format**:
```
<teammate-message teammate_id="agent-123">
Hey, I found a bug in the authentication module. Check line 45.
</teammate-message>

<teammate-message teammate_id="agent-456">
I've completed the database migration. Ready for testing.
</teammate-message>
```

**Behavior**:
- Automatically marks messages as read after retrieval
- Uses file locking to prevent race conditions
- Uses `CLAUDE_CODE_TEAMMATE_ID` env var or session ID as recipient ID

### 10. critical_system_reminder

**Generator Function**: `FH5()` (chunks.107.mjs:1910-1917)

**Trigger**: User has set `criticalSystemReminder_EXPERIMENTAL` in configuration

**Content Format**:
```javascript
{
  type: "critical_system_reminder",
  content: "User-defined critical instructions"
}
```

**System Message Format**:
```
<user-defined critical instructions>
```

**Usage**: Allows users to inject custom instructions that appear on every turn.

---

## Main Agent Only Attachments

These attachments are only available to the primary agent (not sub-agents).

### 11. ide_selection

**Generator Function**: `HH5()` (chunks.107.mjs:1932-1945)

**Trigger**:
- MCP clients are connected
- User has selected text in IDE
- File is not in tool permission blocklist

**Content Format**:
```javascript
{
  type: "selected_lines_in_ide",
  ideName: "Cursor" | "VS Code" | "Zed",
  lineStart: 10,
  lineEnd: 25,
  filename: "/path/to/file",
  content: "selected text content"
}
```

**System Message Format**:
```
The user selected the lines 10 to 25 from /path/to/file:

<selected text content>

This may or may not be related to the current task.
```

**Truncation**: Content truncated to 2000 characters if longer

### 12. ide_opened_file

**Generator Function**: `EH5()` (chunks.107.mjs:2007-2015)

**Trigger**:
- User opened a file in IDE (without selection)
- File is not in tool permission blocklist

**Content Format**:
```javascript
{
  type: "opened_file_in_ide",
  filename: "/path/to/file"
}

// Plus nested_memory attachments for related files
```

**System Message Format**:
```
The user opened the file /path/to/file in the IDE. This may or may not be related to the current task.
```

**Side Effect**: Also triggers nested_memory for related files

### 13. output_style

**Generator Function**: `KH5()` (chunks.107.mjs:1919-1926)

**Trigger**: User has set output style preference (non-default)

**Content Format**:
```javascript
{
  type: "output_style",
  style: "concise" | "detailed" | "technical" | etc.
}
```

**System Message Format**:
```
<StyleName> output style is active. Remember to follow the specific guidelines for this style.
```

### 14. queued_commands

**Generator Function**: `WH5()` (chunks.107.mjs:1858-1865)

**Trigger**: User has queued commands (e.g., via hooks or async systems)

**Content Format**:
```javascript
{
  type: "queued_command",
  prompt: "command text" | [{ type: "text", text: "..." }],
  source_uuid: "uuid-of-source"
}
```

**System Message Format**:
```
The user sent the following message:
<command text>

Please address this message and continue with your tasks.
```

### 15. diagnostics

**Generator Function**: `PH5()` (chunks.107.mjs:2225-2233)

**Trigger**: New diagnostics available from diagnostic system

**Content Format**:
```javascript
{
  type: "diagnostics",
  files: [
    {
      filePath: "/path/to/file",
      diagnostics: [
        { message: "error", severity: "error", line: 10 }
      ]
    }
  ],
  isNew: true
}
```

**System Message Format**:
```
<new-diagnostics>The following new diagnostic issues were detected:

File: /path/to/file
Line 10: [error] error message
Line 15: [warning] warning message

</new-diagnostics>
```

### 16. lsp_diagnostics

**Generator Function**: `jH5()` (chunks.107.mjs:2235-2254)

**Trigger**: LSP server provides new diagnostics

**Content Format**: Same as `diagnostics` type

**System Message Format**: Same as `diagnostics` type

**Note**: Clears delivered diagnostics from registry after retrieval

### 17. background_shells

**Generator Function**: `yH5()` (chunks.107.mjs:2419-2480)

**Trigger**: Background bash processes have updates

**Generator Code**:
```javascript
// ============================================
// generateBackgroundShellsAttachment - Background task status
// Location: chunks.107.mjs:2419-2447
// ============================================
async function generateBackgroundShellsAttachment(context) {
  // Step 1: Get all background shell tasks
  let appState = await context.getAppState();
  let allShellTasks = Object.values(appState.backgroundTasks)
    .filter(task => task.type === "shell");

  // Step 2: Get running tasks with new output
  let runningTasksWithOutput = getRunningTasks(allShellTasks)
    .filter(task => task.hasNewOutput)
    .map(task => ({
      type: "background_shell_status",
      taskId: task.id,
      command: task.command,
      status: "running",
      hasNewOutput: task.hasNewOutput
    }));

  // Step 3: Get recently completed tasks (not yet notified)
  let completedTasks = getCompletedTasks(allShellTasks)
    .map(task => ({
      type: "background_shell_status",
      taskId: task.id,
      command: task.command,
      status: task.status,  // "completed" or "failed"
      exitCode: task.result?.code,
      hasNewOutput: hasUnreadOutput(task)
    }));

  // Step 4: Mark completed tasks as notified
  await context.setAppState(state => ({
    ...state,
    backgroundTasks: {
      ...state.backgroundTasks,
      ...Object.fromEntries(
        allShellTasks.map(task => [task.id, {
          ...task,
          completionStatusSentInAttachment: true
        }])
      )
    }
  }));

  // Step 5: Combine running and completed task statuses
  return [...runningTasksWithOutput, ...completedTasks];
}
```

**Content Format**:
```javascript
// Running task with new output
{
  type: "background_shell_status",
  taskId: "task-uuid",
  command: "npm test",
  status: "running",
  hasNewOutput: true
}

// Completed task
{
  type: "background_shell_status",
  taskId: "task-uuid-2",
  command: "npm build",
  status: "completed",
  exitCode: 0,
  hasNewOutput: true
}
```

**System Message Format**:
```
Background Bash task-uuid (command: npm test) (status: running) Has new output available. You can check its output using the BashOutput tool.

Background Bash task-uuid-2 (command: npm build) (status: completed) (exit code: 0) Has new output available. You can check its output using the BashOutput tool.
```

### 18. background_remote_sessions

**Generator Function**: `kH5()` (chunks.107.mjs:2396-2417)

**Trigger**:
- Feature flag `tengu_web_tasks` enabled
- Background remote sessions have delta summaries

**Content Format**:
```javascript
{
  type: "background_remote_session_status",
  taskId: "task-uuid",
  title: "Task Title",
  status: "running" | "completed",
  deltaSummarySinceLastFlushToAttachment: "summary text"
}
```

**System Message Format**:
```
<background-remote-session-status>Task id:task-uuid
Title:Web Scraping Task
Status:running
Delta summary since last flush:Found 5 new items, processed 3</background-remote-session-status>
```

### 19. async_hook_responses

**Generator Function**: `xH5()` (location not shown in excerpts)

**Trigger**: Async hooks return responses

**Content Format**:
```javascript
{
  type: "async_hook_response",
  response: {
    systemMessage: "optional system message",
    hookSpecificOutput: {
      additionalContext: "hook context"
    }
  }
}
```

**System Message Format**:
```
<system message from hook>

<additional context from hook>
```

### 20. memory (Session Summaries)

**Generator Function**: `EI2()` (chunks.106.mjs:3390-3393)

**Trigger**:
- Only in `repl_main_thread` context
- Currently returns empty (disabled in v2.0.59)

**Expected Content Format**:
```javascript
{
  type: "memory",
  memories: [
    {
      fullPath: "/path/to/.claude/session-memory/session-123.md",
      content: "preview of session summary",
      lastModified: Date,
      remainingLines: 50
    }
  ]
}
```

**Expected System Message Format**:
```
<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

## Previous Session (1/15/2024)
Full session notes: /path/to/session.md (50 more lines in full file)

<preview content>

---

## Previous Session (1/14/2024)
Full session notes: /path/to/session2.md

<preview content>

</session-memory>
```

### 21. token_usage

**Generator Function**: `bH5()` (chunks.107.mjs:2498-2520)

**Trigger**: Environment variable `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` is set

**Content Format**:
```javascript
{
  type: "token_usage",
  used: 150000,
  total: 200000,
  remaining: 50000
}
```

**System Message Format**:
```
Token usage: 150000/200000; 50000 remaining
```

### 22. budget_usd

**Generator Function**: `fH5()` (chunks.107.mjs:2521-2540)

**Trigger**: `maxBudgetUsd` is configured in options

**Content Format**:
```javascript
{
  type: "budget_usd",
  used: 5.23,
  total: 10.00,
  remaining: 4.77
}
```

**System Message Format**:
```
USD budget: $5.23/$10.00; $4.77 remaining
```

### 23. async_agents

**Generator Function**: `hH5()` (chunks.107.mjs:2522-2551)

**Trigger**: Async agents complete or update status

**Generator Code**:
```javascript
// ============================================
// generateAsyncAgentsAttachment - Async agent status updates
// Location: chunks.107.mjs:2522-2551
// ============================================
async function generateAsyncAgentsAttachment(context) {
  // Step 1: Get current app state
  let appState = await context.getAppState();

  // Step 2: Find async agents that have finished and haven't been notified yet
  let finishedAgentAttachments = Object.values(appState.backgroundTasks)
    .filter(task => task.type === "async_agent")
    .filter(task => task.status !== "running" && !task.notified)
    .map(task => ({
      type: "async_agent_status",
      agentId: task.agentId,
      description: task.description,
      status: task.status,  // "completed" or "failed"
      error: task.error
    }));

  // Step 3: Mark these agents as notified
  if (finishedAgentAttachments.length > 0) {
    await context.setAppState(state => {
      let updatedTasks = { ...state.backgroundTasks };

      for (let { agentId } of finishedAgentAttachments) {
        let task = updatedTasks[agentId];
        if (task?.type === "async_agent") {
          updatedTasks[agentId] = {
            ...task,
            notified: true
          };
        }
      }

      return {
        ...state,
        backgroundTasks: updatedTasks
      };
    });
  }

  // Step 4: Return attachments
  return finishedAgentAttachments;
}
```

**Content Format**:
```javascript
// Successful completion
{
  type: "async_agent_status",
  agentId: "agent-uuid",
  description: "Search Agent",
  status: "completed",
  error: undefined
}

// Failed agent
{
  type: "async_agent_status",
  agentId: "agent-uuid-2",
  description: "Edit Agent",
  status: "failed",
  error: "File not found: /path/to/missing.js"
}
```

**System Message Format**:
```
<system-notification>Async agent "Search Agent" completed. The output can be retrieved using AgentOutputTool with agentId: "agent-uuid"</system-notification>

<system-notification>Async agent "Edit Agent" failed: File not found: /path/to/missing.js. The output can be retrieved using AgentOutputTool with agentId: "agent-uuid-2"</system-notification>
```

**Usage**: Allows the main agent to be notified when sub-agents complete their work asynchronously.

---

## Attachment Priority and Ordering

Attachments are processed and inserted in this order:

1. **User Prompt Attachments** (if user input exists)
   - at_mentioned_files
   - mcp_resources
   - agent_mentions

2. **Core Attachments** (all agents)
   - changed_files
   - nested_memory
   - ultra_claude_md
   - plan_mode
   - todo_reminders
   - teammate_mailbox
   - critical_system_reminder

3. **Main Agent Attachments** (main agent only)
   - ide_selection
   - ide_opened_file
   - output_style
   - queued_commands
   - diagnostics
   - lsp_diagnostics
   - background_shells
   - background_remote_sessions
   - async_hook_responses
   - memory
   - token_usage
   - budget_usd
   - async_agents

**Note**: Order within each category is as shown above, but all attachments in a category are generated in parallel.

---

## Special Attachment Features

### Throttling

Some attachments implement throttling to avoid spam:

- **plan_mode**: Only appears every N turns after first appearance
- **todo_reminders**: Requires 5 turns since last TodoWrite, 3 turns since last reminder

### Caching

- **at_mentioned_files**: Returns `already_read_file` if file unchanged
- **changed_files**: Only triggers if file modified since last read

### File Watching

- **changed_files**: Monitors all previously-read files for changes

### Auto-Discovery

- **nested_memory**: Automatically includes related files based on directory structure

### Permission Checks

Many attachments check `toolPermissionContext` to respect:
- Sandbox mode restrictions
- Blocklisted paths
- Plan mode read-only enforcement

---

## Summary Table

| Type | Category | Trigger | Throttled | Cached | Main Agent Only |
|------|----------|---------|-----------|--------|-----------------|
| at_mentioned_files | User Prompt | @filename | No | Yes | No |
| mcp_resources | User Prompt | @server:uri | No | No | No |
| agent_mentions | User Prompt | @agent-type | No | No | No |
| changed_files | Core | File modified | No | Yes | No |
| nested_memory | Core | Related files | No | No | No |
| ultra_claude_md | Core | (disabled) | No | No | No |
| plan_mode | Core | Plan mode active | Yes | No | No |
| todo_reminders | Core | Turns threshold | Yes | No | No |
| teammate_mailbox | Core | Unread messages | No | No | No |
| critical_system_reminder | Core | User config | No | No | No |
| ide_selection | Main Agent | IDE selection | No | No | Yes |
| ide_opened_file | Main Agent | IDE file open | No | No | Yes |
| output_style | Main Agent | Style set | No | No | Yes |
| queued_commands | Main Agent | Queued cmds | No | No | Yes |
| diagnostics | Main Agent | New diagnostics | No | No | Yes |
| lsp_diagnostics | Main Agent | LSP diagnostics | No | No | Yes |
| background_shells | Main Agent | Background tasks | No | No | Yes |
| background_remote_sessions | Main Agent | Remote sessions | No | No | Yes |
| async_hook_responses | Main Agent | Hook responses | No | No | Yes |
| memory | Main Agent | (disabled) | No | No | Yes |
| token_usage | Main Agent | Env var set | No | No | Yes |
| budget_usd | Main Agent | Budget set | No | No | Yes |
| async_agents | Main Agent | Agent status | No | No | Yes |

---

## Implementation Notes

1. **All attachments use `isMeta: true`**: System reminders are metadata messages
2. **Empty arrays are filtered**: Generators return `[]` when not applicable
3. **Errors are graceful**: Attachment failures don't break the conversation
4. **1 second timeout**: All attachment generation completes within 1 second
5. **Telemetry**: 5% sample rate for performance monitoring
6. **Parallel execution**: All attachments in a category generate concurrently

This comprehensive system allows Claude Code to maintain rich contextual awareness while keeping the user-facing conversation clean and focused.

---

## Additional Attachment Types (From kb3 Switch Statement)

The following attachment types are handled by `kb3()` (chunks.154.mjs:3-322) but were not covered in the main categories above:

### 24. directory

**Location:** `chunks.154.mjs:5-13`

**Trigger:** @mention of a directory path

**Content Format:**
```javascript
{
  type: "directory",
  path: "/absolute/path/to/dir",
  content: "file1.txt\nfile2.js\nsubdir/"
}
```

**System Message Format:**
```xml
<system-reminder>
Called the Bash tool with the following input: {"command":"ls /path/to/dir","description":"Lists files in /path/to/dir"}

Result of calling the Bash tool: [ls output]
</system-reminder>
```

### 25. edited_text_file

**Location:** `chunks.154.mjs:14-19`

**Trigger:** File monitored via `readFileState` has been modified on disk

**Content Format:**
```javascript
{
  type: "edited_text_file",
  filename: "/path/to/file",
  snippet: "diff output with line numbers"
}
```

**System Message Format:**
```xml
<system-reminder>
Note: /path/to/file was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
[diff snippet]
</system-reminder>
```

### 26. compact_file_reference

**Location:** `chunks.154.mjs:45-49`

**Trigger:** File was read before context compaction but content is too large to re-include

**Content Format:**
```javascript
{
  type: "compact_file_reference",
  filename: "/path/to/large/file"
}
```

**System Message Format:**
```xml
<system-reminder>
Note: /path/to/file was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>
```

### 27. plan_file_reference

**Location:** `chunks.154.mjs:77-87`

**Trigger:** Plan file exists from previous plan mode session

**Content Format:**
```javascript
{
  type: "plan_file_reference",
  planFilePath: "/path/to/.claude/plans/plan-id.md",
  planContent: "# Plan Content..."
}
```

**System Message Format:**
```xml
<system-reminder>
A plan file exists from plan mode at: /path/to/plan.md

Plan contents:

[plan content]

If this plan is relevant to the current work and not already complete, continue working on it.
</system-reminder>
```

### 28. ultramemory

**Location:** `chunks.154.mjs:121-125`

**Trigger:** Ultra memory content available

**Content Format:**
```javascript
{
  type: "ultramemory",
  content: "Ultra memory content string"
}
```

**System Message Format:**
```xml
<system-reminder>
[ultra memory content]
</system-reminder>
```

### 29. hook_blocking_error

**Location:** `chunks.154.mjs:284-288`

**Trigger:** Hook encountered a blocking error

**Content Format:**
```javascript
{
  type: "hook_blocking_error",
  hookName: "PreToolUse",
  blockingError: {
    command: "some-command",
    blockingError: "Error message"
  }
}
```

**System Message Format:**
```xml
<system-reminder>
PreToolUse hook blocking error from command: "some-command": Error message
</system-reminder>
```

### 30. hook_success

**Location:** `chunks.154.mjs:289-295`

**Trigger:** Hook executed successfully (only for SessionStart and UserPromptSubmit events)

**Content Format:**
```javascript
{
  type: "hook_success",
  hookEvent: "SessionStart" | "UserPromptSubmit",
  hookName: "HookName",
  content: "Success message"
}
```

**System Message Format:**
```xml
<system-reminder>
HookName hook success: Success message
</system-reminder>
```

**Note:** Returns empty array for non-SessionStart/UserPromptSubmit events or empty content.

### 31. hook_additional_context

**Location:** `chunks.154.mjs:296-303`

**Trigger:** Hook provides additional context

**Content Format:**
```javascript
{
  type: "hook_additional_context",
  hookName: "HookName",
  content: ["context line 1", "context line 2"]
}
```

**System Message Format:**
```xml
<system-reminder>
HookName hook additional context: context line 1
context line 2
</system-reminder>
```

### 32. hook_stopped_continuation

**Location:** `chunks.154.mjs:304-308`

**Trigger:** Hook stopped the continuation

**Content Format:**
```javascript
{
  type: "hook_stopped_continuation",
  hookName: "HookName",
  message: "Stop reason"
}
```

**System Message Format:**
```xml
<system-reminder>
HookName hook stopped continuation: Stop reason
</system-reminder>
```

### 33. async_agent_status

**Location:** `chunks.154.mjs:240-247`

**Trigger:** Async agent completed or failed

**Content Format:**
```javascript
{
  type: "async_agent_status",
  agentId: "agent-uuid",
  description: "Agent Description",
  status: "completed" | "failed",
  error: "Optional error message"
}
```

**System Message Format:**
```xml
<system-notification>Async agent "Agent Description" completed. The output can be retrieved using AgentOutputTool with agentId: "agent-uuid"</system-notification>
```

**Note:** Uses `<system-notification>` tag instead of `<system-reminder>`.

### 34. background_remote_session_status

**Location:** `chunks.154.mjs:210-216`

**Trigger:** Background remote session has status update

**Content Format:**
```javascript
{
  type: "background_remote_session_status",
  taskId: "task-uuid",
  title: "Task Title",
  status: "running" | "completed",
  deltaSummarySinceLastFlushToAttachment: "Summary text"
}
```

**System Message Format:**
```xml
<system-reminder>
<background-remote-session-status>Task id:task-uuid
Title:Task Title
Status:running
Delta summary since last flush:Summary text</background-remote-session-status>
</system-reminder>
```

---

## Silent Attachment Types (No Message Output)

The following attachment types return empty arrays from `kb3()` and produce no system message:

**Location:** `chunks.154.mjs:309-318, 320`

| Type | Purpose |
|------|---------|
| `already_read_file` | File unchanged since last read (cached) |
| `command_permissions` | Permission context (handled elsewhere) |
| `edited_image_file` | Image file change (visual diff not supported) |
| `hook_cancelled` | Hook was cancelled |
| `hook_error_during_execution` | Hook execution error |
| `hook_non_blocking_error` | Non-blocking hook error |
| `hook_system_message` | Hook system message (handled elsewhere) |
| `structured_output` | Structured output (handled differently) |
| `hook_permission_decision` | Hook permission decision |
| `autocheckpointing` | Auto-checkpoint event |
| `background_task_status` | Background task status (generic) |

---

## Complete kb3() Switch Statement Reference

**Location:** `chunks.154.mjs:3-322`

```javascript
// ============================================
// kb3 (convertAttachmentToSystemMessage) - Complete Switch
// Location: chunks.154.mjs:3-322
// All 34+ attachment types handled
// ============================================
function convertAttachmentToSystemMessage(attachment) {
  switch (attachment.type) {
    case "directory":           // → NG() wrapped ls output
    case "edited_text_file":    // → NG() wrapped change notification
    case "file":                // → NG() wrapped file content (text/image/notebook/pdf)
    case "compact_file_reference":  // → NG() wrapped reference
    case "selected_lines_in_ide":   // → NG() wrapped IDE selection
    case "opened_file_in_ide":      // → NG() wrapped file open notification
    case "todo":                    // → NG() wrapped todo list update
    case "plan_file_reference":     // → NG() wrapped plan reference
    case "todo_reminder":           // → NG() wrapped reminder
    case "nested_memory":           // → NG() wrapped related file content
    case "queued_command":          // → NG() wrapped queued message
    case "ultramemory":             // → NG() wrapped ultra memory
    case "output_style":            // → NG() wrapped style reminder
    case "diagnostics":             // → NG() wrapped diagnostics
    case "plan_mode":               // → jb3() delegate (Sb3 or _b3)
    case "plan_mode_reentry":       // → NG() wrapped reentry instructions
    case "critical_system_reminder": // → NG() wrapped user-defined reminder
    case "mcp_resource":            // → NG() wrapped resource content
    case "agent_mention":           // → NG() wrapped agent invocation
    case "background_remote_session_status": // → NG() wrapped status
    case "background_shell_status":  // → R0() with Qu() wrapped status
    case "async_hook_response":      // → NG() wrapped hook response
    case "async_agent_status":       // → R0() with <system-notification>
    case "teammate_mailbox":         // → R0() with formatted messages
    case "memory":                   // → NG() wrapped session memory
    case "token_usage":              // → R0() with Qu() wrapped usage
    case "budget_usd":               // → R0() with Qu() wrapped budget
    case "hook_blocking_error":      // → R0() with Qu() wrapped error
    case "hook_success":             // → R0() with Qu() wrapped success
    case "hook_additional_context":  // → R0() with Qu() wrapped context
    case "hook_stopped_continuation": // → R0() with Qu() wrapped stop

    // Silent types - return []
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
      // Unknown type - log error, return []
      if (["autocheckpointing", "background_task_status"].includes(attachment.type))
        return [];
      logError("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`));
      return [];
  }
}
```

---

## Updated Summary Table (All 34+ Types)

| Type | Category | Wrapping | Output |
|------|----------|----------|--------|
| directory | User Prompt | NG() | Tool use simulation |
| file | User Prompt | NG() | Tool result simulation |
| edited_text_file | Core | NG() | Change notification |
| compact_file_reference | Core | NG() | File reference |
| selected_lines_in_ide | Main Agent | NG() | IDE selection |
| opened_file_in_ide | Main Agent | NG() | File open notice |
| todo | Core | NG() | Todo list update |
| plan_file_reference | Core | NG() | Plan reference |
| todo_reminder | Core | NG() | Reminder |
| nested_memory | Core | NG() | Related file |
| queued_command | Main Agent | NG() | Queued message |
| ultramemory | Core | NG() | Ultra memory |
| output_style | Main Agent | NG() | Style reminder |
| diagnostics | Main Agent | NG() | Diagnostic issues |
| plan_mode | Core | jb3() | Plan workflow |
| plan_mode_reentry | Core | NG() | Reentry guide |
| critical_system_reminder | Core | NG() | User reminder |
| mcp_resource | User Prompt | NG() | Resource content |
| agent_mention | User Prompt | NG() | Agent invoke |
| background_remote_session_status | Main Agent | NG() | Session status |
| background_shell_status | Main Agent | R0(Qu()) | Shell status |
| async_hook_response | Main Agent | NG() | Hook response |
| async_agent_status | Main Agent | R0() | Agent notification |
| teammate_mailbox | Core | R0() | Teammate messages |
| memory | Main Agent | NG() | Session memory |
| token_usage | Main Agent | R0(Qu()) | Token count |
| budget_usd | Main Agent | R0(Qu()) | Budget info |
| hook_blocking_error | Main Agent | R0(Qu()) | Hook error |
| hook_success | Main Agent | R0(Qu()) | Hook success |
| hook_additional_context | Main Agent | R0(Qu()) | Hook context |
| hook_stopped_continuation | Main Agent | R0(Qu()) | Hook stop |
| already_read_file | - | - | Silent |
| command_permissions | - | - | Silent |
| edited_image_file | - | - | Silent |
| hook_cancelled | - | - | Silent |
| hook_error_during_execution | - | - | Silent |
| hook_non_blocking_error | - | - | Silent |
| hook_system_message | - | - | Silent |
| structured_output | - | - | Silent |
| hook_permission_decision | - | - | Silent |
| autocheckpointing | - | - | Silent |
| background_task_status | - | - | Silent |
