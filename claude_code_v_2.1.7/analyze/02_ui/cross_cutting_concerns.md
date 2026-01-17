# Cross-Cutting UI Concerns

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `normalizeAttachmentForAPI` (q$7) - Attachment to API message conversion
- `ToolUseConfirmDialog` (Ih) - Tool permission UI component
- `IDEDiffSupport` (AD9) - IDE diff integration component
- `createToolResultMessage` (OuA) - Tool result message creator
- `createToolUseMessage` (MuA) - Tool use invocation message creator
- `createMetaMessage` (H0) - Meta message wrapper
- `wrapSystemReminder` (Yh) - System reminder text wrapper

---

## Overview

The UI layer in Claude Code integrates deeply with tools, system reminders, and plan mode through a sophisticated message-yielding architecture. This document covers the cross-cutting concerns where UI interacts with other subsystems.

---

## 1. System Reminders → UI Display Pipeline

### 1.1 Attachment Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│         Attachment Generation (generateAllAttachments)       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ User Prompt Attachments (if user input)              │   │
│  │  ├─→ @mentioned files                                │   │
│  │  ├─→ MCP resources                                   │   │
│  │  └─→ @agent mentions                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │ Core Attachments (always checked)                    │   │
│  │  ├─→ changed_files                                   │   │
│  │  ├─→ nested_memory                                   │   │
│  │  ├─→ plan_mode / plan_mode_exit                      │   │
│  │  ├─→ delegate_mode                                   │   │
│  │  ├─→ todo_reminders                                  │   │
│  │  └─→ critical_system_reminder                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │ Main Agent Attachments (main agent only)             │   │
│  │  ├─→ ide_selection                                   │   │
│  │  ├─→ diagnostics                                     │   │
│  │  ├─→ unified_tasks                                   │   │
│  │  └─→ memory                                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     yieldAttachments (VHA)                           │   │
│  │     For each attachment: yield wrapAttachment(att)   │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     normalizeAttachmentForAPI (q$7)                  │   │
│  │     SWITCH on attachment.type                        │   │
│  │     Returns formatted message for API                │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│                    UI Displays                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Attachment Type Handlers

```javascript
// ============================================
// normalizeAttachmentForAPI - Central attachment to message converter
// Location: chunks.148.mjs:3-371
// ============================================

// ORIGINAL (for source lookup):
function q$7(A) {
  switch (A.type) {
    case "directory":
      return q5([MuA(o2.name, {
        command: `ls ${m6([A.path])}`,
        description: `Lists files in ${A.path}`
      }), OuA(o2, {
        stdout: A.content,
        stderr: "",
        interrupted: !1
      })]);
    case "file": {
      let B = A.content;
      switch (B.type) {
        case "image":
          return q5([MuA(v5.name, {
            file_path: A.filename
          }), OuA(v5, B)]);
        case "text":
          return q5([MuA(v5.name, {
            file_path: A.filename
          }), OuA(v5, B), ...A.truncated ? [H0({
            content: `Note: The file ${A.filename} was too large and has been truncated...`,
            isMeta: !0
          })] : []]);
        // ... notebook, pdf cases
      }
    }
    case "todo":
      if (A.itemCount === 0) return q5([H0({
        content: `This is a reminder that your todo list is currently empty...`,
        isMeta: !0
      })]);
      else return q5([H0({
        content: `Your todo list has changed...${stringify(A.content)}...`,
        isMeta: !0
      })]);
    case "plan_mode":
      return z$7(A);  // Delegate to plan mode handler
    case "plan_mode_exit":
      return q5([H0({
        content: `## Exited Plan Mode\n\nYou have exited plan mode...`,
        isMeta: !0
      })]);
    // ... many more cases
  }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
  switch (attachment.type) {
    case "directory":
      // Simulate Bash ls command invocation + result
      return wrapSystemReminder([
        createToolUseMessage(BashTool.name, {
          command: `ls ${escapePath([attachment.path])}`,
          description: `Lists files in ${attachment.path}`
        }),
        createToolResultMessage(BashTool, {
          stdout: attachment.content,
          stderr: "",
          interrupted: false
        })
      ]);

    case "file":
      // Simulate Read tool invocation + result
      const content = attachment.content;
      switch (content.type) {
        case "image":
          return wrapSystemReminder([
            createToolUseMessage(ReadTool.name, { file_path: attachment.filename }),
            createToolResultMessage(ReadTool, content)
          ]);
        case "text":
          return wrapSystemReminder([
            createToolUseMessage(ReadTool.name, { file_path: attachment.filename }),
            createToolResultMessage(ReadTool, content),
            // Add truncation notice if needed
            ...attachment.truncated ? [createMetaMessage({
              content: `Note: The file ${attachment.filename} was too large and has been truncated to the first ${MAX_LINES} lines. Don't tell the user about this truncation. Use ${ReadTool.name} to read more of the file if you need.`,
              isMeta: true
            })] : []
          ]);
        // ... notebook, pdf
      }

    case "todo":
      if (attachment.itemCount === 0) {
        return wrapSystemReminder([createMetaMessage({
          content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${TODO_TOOL_NAME} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
          isMeta: true
        })]);
      } else {
        return wrapSystemReminder([createMetaMessage({
          content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:\n\n${stringify(attachment.content)}. Continue on with the tasks at hand if applicable.`,
          isMeta: true
        })]);
      }

    case "plan_mode":
      return generatePlanModeReminder(attachment);

    case "plan_mode_exit":
      return wrapSystemReminder([createMetaMessage({
        content: `## Exited Plan Mode\n\nYou have exited plan mode. You can now make edits, run tools, and take actions.${attachment.planExists ? ` The plan file is located at ${attachment.planFilePath} if you need to reference it.` : ""}`,
        isMeta: true
      })]);

    // ... many more attachment types
  }
}

// Mapping: q$7→normalizeAttachmentForAPI, q5→wrapSystemReminder, H0→createMetaMessage,
//          MuA→createToolUseMessage, OuA→createToolResultMessage, o2→BashTool, v5→ReadTool
```

### 1.3 Complete Attachment Type Reference

| Attachment Type | Handler Logic | UI Display |
|-----------------|---------------|------------|
| `directory` | Creates Bash ls + result | File listing |
| `file` | Creates Read tool + result | File content (text/image/notebook/pdf) |
| `edited_text_file` | Meta message with diff | "Note: file was modified..." |
| `selected_lines_in_ide` | Meta message | Selected code from IDE |
| `opened_file_in_ide` | Meta message | "User opened file..." |
| `todo` | Meta message | Todo list content or empty reminder |
| `todo_reminder` | Meta message | Gentle reminder about TodoWrite |
| `plan_mode` | Full/sparse plan instructions | Plan mode guidelines |
| `plan_mode_reentry` | Re-entry instructions | Previous plan evaluation |
| `plan_mode_exit` | Exit notification | "Exited plan mode" |
| `plan_file_reference` | Meta message | Plan file contents |
| `delegate_mode` | Returns [] | (Hidden from UI) |
| `delegate_mode_exit` | Meta message | "Exited delegate mode" |
| `diagnostics` | Meta message | LSP diagnostic issues |
| `memory` | Meta message | Session memory summaries |
| `nested_memory` | Meta message | Related CLAUDE.md files |
| `ultramemory` | Meta message | Ultra memory content |
| `mcp_resource` | Meta message | MCP resource content |
| `agent_mention` | Meta message | Agent invocation hint |
| `task_status` | Meta message | "Task X (status) (desc)" |
| `task_progress` | Meta message | Task progress update |
| `async_hook_response` | Meta message | Hook system message |
| `hook_blocking_error` | Meta message | Hook blocked error |
| `hook_success` | Meta message | Hook success (SessionStart/UserPromptSubmit only) |
| `hook_additional_context` | Meta message | Hook context additions |
| `hook_stopped_continuation` | Meta message | Hook stopped continuation |
| `collab_notification` | Meta message | Unread collab messages |
| `verify_plan_reminder` | Meta message | Plan verification reminder |
| `token_usage` | Meta message | Token usage stats |
| `budget_usd` | Meta message | USD budget remaining |
| `invoked_skills` | Meta message | Active skill guidelines |
| `output_style` | Meta message | Output style reminder |
| `queued_command` | Meta message | User queued command |
| `critical_system_reminder` | Meta message | Critical reminder content |
| `compact_file_reference` | Meta message | File read before compaction |

### 1.4 Message Wrapper Functions

```javascript
// ============================================
// createMetaMessage - Create user message with meta flag
// Location: chunks.147.mjs:2410
// ============================================

// ORIGINAL (for source lookup):
function H0({content: A, isMeta: Q = !1, toolUseResult: B, sourceToolAssistantUUID: G}) {
  return {
    type: "user",
    message: {
      type: "message",
      role: "user",
      content: typeof A === "string" ? [{type: "text", text: A}] : A,
      isMeta: Q,
      toolUseResult: B,
      sourceToolAssistantUUID: G
    }
  }
}

// READABLE (for understanding):
function createMetaMessage({
  content,
  isMeta = false,
  toolUseResult,
  sourceToolAssistantUUID
}) {
  return {
    type: "user",
    message: {
      type: "message",
      role: "user",
      content: typeof content === "string" ? [{ type: "text", text: content }] : content,
      isMeta,  // Flag for UI to style as system message
      toolUseResult,
      sourceToolAssistantUUID
    }
  };
}

// Mapping: H0→createMetaMessage
```

```javascript
// ============================================
// wrapSystemReminder - Wrap text in system-reminder tags
// Location: chunks.147.mjs:3212
// ============================================

// ORIGINAL (for source lookup):
function Yh(A) {
  return `<system-reminder>\n${A}\n</system-reminder>`
}

// READABLE (for understanding):
function wrapSystemReminder(text) {
  return `<system-reminder>\n${text}\n</system-reminder>`;
}

// Mapping: Yh→wrapSystemReminder
```

---

## 2. Tool Results → UI Rendering Pipeline

### 2.1 Tool Confirm Dialog Component

```javascript
// ============================================
// ToolUseConfirmDialog - Permission confirmation UI
// Location: chunks.150.mjs:101-223
// ============================================

// ORIGINAL (for source lookup):
function Ih({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  title: Z,
  subtitle: Y,
  question: J = "Do you want to proceed?",
  content: X,
  completionType: I = "tool_use_single",
  languageName: D = "none",
  path: W,
  parseInput: K,
  operationType: V = "write",
  ideDiffSupport: F
}) {
  let H = BD9.useMemo(() => ({
    completion_type: I,
    language_name: D
  }), [I, D]);
  yj(A, H);
  let E = rI9({
    filePath: W || "",
    completionType: I,
    languageName: D,
    toolUseConfirm: A,
    onDone: B,
    onReject: G,
    parseInput: K,
    operationType: V
  });
  // ... render logic
}

// READABLE (for understanding):
function ToolUseConfirmDialog({
  toolUseConfirm,      // Tool use being confirmed
  toolUseContext,      // Execution context
  onDone,              // Callback when accepted
  onReject,            // Callback when rejected
  title,               // Dialog title
  subtitle,            // Optional subtitle (e.g., file path)
  question = "Do you want to proceed?",
  content,             // Content to display (e.g., code diff)
  completionType = "tool_use_single",
  languageName = "none",
  path,                // File path if applicable
  parseInput,          // Input parser function
  operationType = "write",
  ideDiffSupport       // IDE diff configuration
}) {
  // Track completion metrics
  const metrics = useMemo(() => ({
    completion_type: completionType,
    language_name: languageName
  }), [completionType, languageName]);
  trackCompletion(toolUseConfirm, metrics);

  // Setup confirmation options
  const {
    options,
    acceptFeedback,
    rejectFeedback,
    setFocusedOption,
    handleInputModeToggle,
    focusedOption,
    yesInputMode,
    noInputMode
  } = useConfirmOptions({
    filePath: path || "",
    completionType,
    languageName,
    toolUseConfirm,
    onDone,
    onReject,
    parseInput,
    operationType
  });

  // Parse input
  const parsedInput = parseInput(toolUseConfirm.input);

  // Check for IDE diff support
  const diffConfig = ideDiffSupport ? ideDiffSupport.getConfig(parsedInput) : null;

  // Setup IDE diff state
  const {
    closeTabInIDE,
    showingDiffInIDE,
    ideName
  } = useIDEDiff({...});

  const handleChange = (option, input, feedback) => {
    closeTabInIDE?.();
    onChange(option, parsedInput, feedback?.trim());
  };

  // If showing in IDE, render minimal UI
  if (showingDiffInIDE && diffConfig && path) {
    return <IDEDiffSupport {...} />;
  }

  // Render full confirmation dialog
  return (
    <>
      <PermissionBox title={title} subtitle={subtitle}>
        {content}
        <Box flexDirection="column" paddingX={1}>
          {typeof question === "string" ? <Text>{question}</Text> : question}
          <OptionSelector
            options={options}
            onChange={handleChange}
            onCancel={() => handleChange({ type: "reject" })}
            onFocus={setFocusedOption}
            onInputModeToggle={handleInputModeToggle}
          />
        </Box>
      </PermissionBox>
      <Box paddingX={1} marginTop={1}>
        <Text dimColor>
          Esc to cancel
          {(focusedOption === "yes" && !yesInputMode || focusedOption === "no" && !noInputMode) &&
            " · Tab to add additional instructions"}
        </Text>
      </Box>
    </>
  );
}

// Mapping: Ih→ToolUseConfirmDialog, BD9→React, yj→trackCompletion,
//          rI9→useConfirmOptions, VY→PermissionBox, k0→OptionSelector
```

**What it does:** Renders the permission confirmation dialog when a tool requires user approval.

**How it works:**
1. Parses tool input to understand what's being requested
2. Checks if IDE diff support is available
3. If IDE diff active, shows minimal UI with "Save to continue..."
4. Otherwise shows full dialog with content, question, and options
5. Options include accept-once, accept-session, reject with feedback

**Why this approach:**
- IDE integration reduces friction for file edits
- Feedback input allows users to guide rejection reasons
- Option types support granular permission control

### 2.2 IDE Diff Support

```javascript
// ============================================
// IDEDiffSupport - IDE diff integration component
// Location: chunks.150.mjs:29-89
// ============================================

// ORIGINAL (for source lookup):
function AD9({
  onChange: A,
  options: Q,
  input: B,
  filePath: G,
  ideName: Z,
  rejectFeedback: Y,
  acceptFeedback: J,
  setFocusedOption: X,
  onInputModeToggle: I,
  focusedOption: D,
  yesInputMode: W,
  noInputMode: K
}) {
  return vj.default.createElement(T, {
    flexDirection: "column"
  }, vj.default.createElement(K8, {
    dividerColor: "permission"
  }), vj.default.createElement(T, {
    marginX: 1,
    flexDirection: "column",
    gap: 1
  }, vj.default.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Opened changes in ", Z, " ⧉"), JhA() && vj.default.createElement(C, {
    dimColor: !0
  }, "Save file to continue…"), /* ... option selector ... */))
}

// READABLE (for understanding):
function IDEDiffSupport({
  onChange,
  options,
  input,
  filePath,
  ideName,
  rejectFeedback,
  acceptFeedback,
  setFocusedOption,
  onInputModeToggle,
  focusedOption,
  yesInputMode,
  noInputMode
}) {
  return (
    <Box flexDirection="column">
      <Divider dividerColor="permission" />
      <Box marginX={1} flexDirection="column" gap={1}>
        {/* Header showing IDE name */}
        <Text bold color="permission">
          Opened changes in {ideName} ⧉
        </Text>

        {/* Instruction to save in IDE */}
        {isIDEConnected() && (
          <Text dimColor>Save file to continue…</Text>
        )}

        {/* Question and options */}
        <Box flexDirection="column">
          <Text>
            Do you want to make this edit to <Text bold>{formatPath(filePath)}</Text>?
          </Text>
          <OptionSelector
            options={options}
            onChange={(value) => {
              const option = options.find(o => o.value === value);
              if (option) {
                if (option.option.type === "reject") {
                  onChange(option.option, input, rejectFeedback.trim() || undefined);
                } else if (option.option.type === "accept-once") {
                  onChange(option.option, input, acceptFeedback.trim() || undefined);
                } else {
                  onChange(option.option, input);
                }
              }
            }}
            onCancel={() => onChange({ type: "reject" }, input)}
            onFocus={setFocusedOption}
            onInputModeToggle={onInputModeToggle}
          />
        </Box>

        {/* Footer with keyboard hints */}
        <Box marginTop={1}>
          <Text dimColor>
            Esc to cancel
            {(focusedOption === "yes" && !yesInputMode || focusedOption === "no" && !noInputMode) &&
              " · Tab to add additional instructions"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

// Mapping: AD9→IDEDiffSupport, K8→Divider, JhA→isIDEConnected
```

**What it does:** Renders a minimal UI when the IDE is showing a diff view.

**How it works:**
1. Opens diff in IDE (VS Code, Cursor, etc.)
2. Shows "Save file to continue..." prompt
3. User edits in IDE and saves to accept
4. Or uses CLI options to reject/modify

### 2.3 Tool-Specific Renderers

Tools register rendering functions in their schema:

```javascript
const EditTool = {
  name: "Edit",
  inputSchema: z.object({...}),

  // UI rendering functions
  renderToolUseMessage(input, context) {
    // Returns string for tool use display
    return `${input.file_path}`;
  },

  renderToolUseRejectedMessage(input, context) {
    // Called when tool is rejected
    return <RejectedEditDisplay {...input} />;
  },

  renderToolUseErrorMessage(error, input, context) {
    // Called when tool errors
    return <ErrorDisplay error={error} />;
  },

  renderToolUseProgressMessage(progressMessages, context) {
    // Called during tool execution
    return <ProgressIndicator messages={progressMessages} />;
  },

  renderToolResultMessage(result, context) {
    // Called with tool result
    return <ResultDisplay result={result} />;
  },

  renderToolUseTag(input) {
    // Optional tag (e.g., permissions badge)
    return null;
  }
};
```

---

## 3. Plan Mode → UI State Transitions

### 3.1 Plan Mode Entry

```javascript
// ============================================
// Plan mode entry handler
// Location: chunks.148.mjs:177-178
// ============================================

// ORIGINAL (for source lookup):
case "plan_mode":
  return z$7(A);

// z$7 function generates full or sparse instructions based on reminderType
function z$7(attachment) {
  if (attachment.reminderType === "sparse") {
    return wrapSystemReminder([createMetaMessage({
      content: PLAN_MODE_SPARSE_INSTRUCTIONS,
      isMeta: true
    })]);
  }
  return wrapSystemReminder([createMetaMessage({
    content: PLAN_MODE_FULL_INSTRUCTIONS,
    isMeta: true
  })]);
}

// READABLE flow:
// User Input: "/plan" or tool calls EnterPlanMode
//     ↓
// Mode: "default" → "plan"
//     ↓
// generatePlanModeAttachment() fires
//     ├─→ Checks if re-entering (plan file exists)
//     ├─→ If re-entering: generates "plan_mode_reentry" attachment
//     └─→ Generates "plan_mode" attachment with reminderType ("full" or "sparse")
//     ↓
// UI shows:
//   - Full mode: Complete planning instructions (phases, guidelines)
//   - Sparse mode: Abbreviated instructions (to save tokens)
//   - Re-entry mode: "Previous plan exists, evaluate if same/different task"
```

**Full vs Sparse Mode:**
- **Full**: Complete planning instructions sent first time entering plan mode
- **Sparse**: Abbreviated instructions sent on subsequent turns in plan mode
- Saves tokens while maintaining context

### 3.2 Plan Mode Reentry

```javascript
// ============================================
// Plan mode reentry handler
// Location: chunks.148.mjs:179-196
// ============================================

// ORIGINAL (for source lookup):
case "plan_mode_reentry": {
  let B = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${ExitPlanModeTool.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
  return q5([H0({
    content: B,
    isMeta: !0
  })])
}
```

**What it does:** Provides guidance when re-entering plan mode with an existing plan file.

**Key decisions:**
1. Read existing plan
2. Evaluate if same or different task
3. Either overwrite or modify plan
4. Must edit plan file before exiting

### 3.3 Plan Mode Exit

```javascript
// ============================================
// Plan mode exit handler
// Location: chunks.148.mjs:198-205
// ============================================

// ORIGINAL (for source lookup):
case "plan_mode_exit": {
  let G = `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${A.planExists?` The plan file is located at ${A.planFilePath} if you need to reference it.`:""}`;
  return q5([H0({
    content: G,
    isMeta: !0
  })])
}

// READABLE flow:
// Tool: ExitPlanMode(mode: "default" | "acceptEdits" | "bypassPermissions")
//     ↓
// Mode: "plan" → selected mode
//     ↓
// generatePlanModeExitAttachment() fires
//     └─→ Generates "plan_mode_exit" attachment
//     ↓
// UI shows: "Exited plan mode. You can now make edits, run tools..."
//     └─→ Includes plan file path if it exists
```

### 3.4 Plan File Reference (Outside Plan Mode)

```javascript
// ============================================
// Plan file reference - inject plan contents when not in plan mode
// Location: chunks.148.mjs:77-86
// ============================================

// ORIGINAL (for source lookup):
case "plan_file_reference":
  return q5([H0({
    content: `A plan file exists from plan mode at: ${A.planFilePath}

Plan contents:

${A.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
    isMeta: !0
  })]);
```

**What it does:** Injects plan file contents as a system reminder when outside plan mode.

**Why this approach:**
- AI remains aware of existing plans
- Can continue implementing without re-entering plan mode
- Non-intrusive (meta message, not conversation)

---

## 4. Hook Progress → UI Updates

### 4.1 Async Hook Response

```javascript
// ============================================
// Async hook response handler
// Location: chunks.148.mjs:274-285
// ============================================

// ORIGINAL (for source lookup):
case "async_hook_response": {
  let B = A.response,
    G = [];
  if (B.systemMessage) G.push(H0({
    content: B.systemMessage,
    isMeta: !0
  }));
  if (B.hookSpecificOutput && "additionalContext" in B.hookSpecificOutput && B.hookSpecificOutput.additionalContext) G.push(H0({
    content: B.hookSpecificOutput.additionalContext,
    isMeta: !0
  }));
  return q5(G)
}

// READABLE (for understanding):
case "async_hook_response": {
  const response = attachment.response;
  const messages = [];

  // Add system message if present
  if (response.systemMessage) {
    messages.push(createMetaMessage({
      content: response.systemMessage,
      isMeta: true
    }));
  }

  // Add additional context from hook-specific output
  if (response.hookSpecificOutput?.additionalContext) {
    messages.push(createMetaMessage({
      content: response.hookSpecificOutput.additionalContext,
      isMeta: true
    }));
  }

  return wrapSystemReminder(messages);
}
```

### 4.2 Hook Blocking Error

```javascript
// ============================================
// Hook blocking error handler
// Location: chunks.148.mjs:318-322
// ============================================

// ORIGINAL (for source lookup):
case "hook_blocking_error":
  return [H0({
    content: Yh(`${A.hookName} hook blocking error from command: "${A.blockingError.command}": ${A.blockingError.blockingError}`),
    isMeta: !0
  })];

// READABLE (for understanding):
case "hook_blocking_error":
  return [createMetaMessage({
    content: wrapSystemReminder(
      `${attachment.hookName} hook blocking error from command: "${attachment.blockingError.command}": ${attachment.blockingError.blockingError}`
    ),
    isMeta: true
  })];
```

### 4.3 Hook Success Notification

```javascript
// ============================================
// Hook success handler (selective display)
// Location: chunks.148.mjs:323-329
// ============================================

// ORIGINAL (for source lookup):
case "hook_success":
  if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return [];
  if (A.content === "") return [];
  return [H0({
    content: Yh(`${A.hookName} hook success: ${A.content}`),
    isMeta: !0
  })];

// READABLE (for understanding):
case "hook_success":
  // Only show for SessionStart and UserPromptSubmit events
  if (attachment.hookEvent !== "SessionStart" && attachment.hookEvent !== "UserPromptSubmit") {
    return [];  // Silent for other hook events
  }

  // Skip empty content
  if (attachment.content === "") {
    return [];
  }

  return [createMetaMessage({
    content: wrapSystemReminder(`${attachment.hookName} hook success: ${attachment.content}`),
    isMeta: true
  })];
```

**What it does:** Selectively displays hook success messages.

**Why selective:** Most hooks run silently. Only SessionStart and UserPromptSubmit are shown because:
- SessionStart may inject important context
- UserPromptSubmit may modify user input
- Other hooks (PreToolUse, PostToolUse) are too frequent

---

## 5. Task Status → UI Display

### 5.1 Task Status Updates

```javascript
// ============================================
// Task status display
// Location: chunks.148.mjs:261-267
// ============================================

// ORIGINAL (for source lookup):
case "task_status": {
  let B = [`Task ${A.taskId}`, `(type: ${A.taskType})`, `(status: ${A.status})`, `(description: ${A.description})`];
  if (A.deltaSummary) B.push(`Delta: ${A.deltaSummary}`);
  return B.push("You can check its output using the TaskOutput tool."), [H0({
    content: Yh(B.join(" ")),
    isMeta: !0
  })]
}

// READABLE (for understanding):
case "task_status": {
  const parts = [
    `Task ${attachment.taskId}`,
    `(type: ${attachment.taskType})`,
    `(status: ${attachment.status})`,
    `(description: ${attachment.description})`
  ];

  // Add delta summary if available
  if (attachment.deltaSummary) {
    parts.push(`Delta: ${attachment.deltaSummary}`);
  }

  parts.push("You can check its output using the TaskOutput tool.");

  return [createMetaMessage({
    content: wrapSystemReminder(parts.join(" ")),
    isMeta: true
  })];
}
```

**Example output:**
```
Task abc123 (type: background_shell) (status: running) (description: npm test)
Delta: 15 lines written
You can check its output using the TaskOutput tool.
```

### 5.2 Task Progress Messages

```javascript
// ============================================
// Task progress display
// Location: chunks.148.mjs:269-272
// ============================================

// ORIGINAL (for source lookup):
case "task_progress":
  return [H0({
    content: Yh(A.message),
    isMeta: !0
  })];

// READABLE (for understanding):
case "task_progress":
  return [createMetaMessage({
    content: wrapSystemReminder(attachment.message),
    isMeta: true
  })];
```

---

## 6. Collaboration Notifications [NEW in v2.1.7]

```javascript
// ============================================
// Collaboration notification handler
// Location: chunks.148.mjs:343-349
// ============================================

// ORIGINAL (for source lookup):
case "collab_notification": {
  let B = A.chats.reduce((Z, Y) => Z + Y.unreadCount, 0),
    G = A.chats.map((Z) => Z.handle === "self" ? `self (${Z.unreadCount} new)` : `@${Z.handle} (${Z.unreadCount} new)`).join(", ");
  return q5([H0({
    content: `You have ${B} unread collab message${B!==1?"s":""} from: ${G}. Use the CollabRead tool to read these messages.`,
    isMeta: !0
  })])
}

// READABLE (for understanding):
case "collab_notification": {
  // Sum total unread messages
  const totalUnread = attachment.chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Format list of senders
  const senderList = attachment.chats.map(chat =>
    chat.handle === "self"
      ? `self (${chat.unreadCount} new)`
      : `@${chat.handle} (${chat.unreadCount} new)`
  ).join(", ");

  return wrapSystemReminder([createMetaMessage({
    content: `You have ${totalUnread} unread collab message${totalUnread !== 1 ? "s" : ""} from: ${senderList}. Use the CollabRead tool to read these messages.`,
    isMeta: true
  })]);
}
```

**What it does:** Notifies about unread collaboration messages.

**Example output:**
```
You have 3 unread collab messages from: @alice (2 new), self (1 new). Use the CollabRead tool to read these messages.
```

---

## 7. Memory System Integration

### 7.1 Session Memory Display

```javascript
// ============================================
// Session memory display
// Location: chunks.148.mjs:287-306
// ============================================

// ORIGINAL (for source lookup):
case "memory": {
  let B = A.memories.map((G) => {
    let Z = G.remainingLines && G.remainingLines > 0 ? ` (${G.remainingLines} more lines in full file)` : "";
    return `## Previous Session (${(G.lastModified instanceof Date?G.lastModified:new Date(G.lastModified)).toLocaleDateString()})
Full session notes: ${G.fullPath}${Z}

${G.content}`
  }).join(`

---

`);
  return q5([H0({
    content: `<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

${B}
</session-memory>`,
    isMeta: !0
  })])
}
```

### 7.2 Nested Memory

```javascript
// ============================================
// Nested memory handler
// Location: chunks.148.mjs:122-127
// ============================================

// ORIGINAL (for source lookup):
case "nested_memory":
  return q5([H0({
    content: `Contents of ${A.content.path}:

${A.content.content}`,
    isMeta: !0
  })]);
```

**What it does:** Injects contents of related CLAUDE.md files found in project hierarchy.

### 7.3 Ultramemory

```javascript
// ============================================
// Ultramemory handler
// Location: chunks.148.mjs:154-157
// ============================================

// ORIGINAL (for source lookup):
case "ultramemory":
  return q5([H0({
    content: A.content,
    isMeta: !0
  })]);
```

**What it does:** Injects ultra memory content (persistent knowledge across sessions).

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| normalizeAttachmentForAPI | q$7 | chunks.148.mjs:3-371 | Central attachment conversion |
| ToolUseConfirmDialog | Ih | chunks.150.mjs:101-223 | Permission dialog |
| IDEDiffSupport | AD9 | chunks.150.mjs:29-89 | IDE diff UI |
| createMetaMessage | H0 | chunks.147.mjs:2410 | Meta message creator |
| createToolResultMessage | OuA | chunks.148.mjs:373-390 | Tool result message |
| createToolUseMessage | MuA | chunks.148.mjs:392-397 | Tool use message |
| wrapSystemReminder | Yh | chunks.147.mjs:3212 | System reminder wrapper |
| wrapSystemReminderArray | q5 | chunks.147.mjs:3218 | Array wrapper |
| generatePlanModeReminder | z$7 | chunks.148.mjs | Plan mode instructions |

---

## Message Type Hierarchy

```
Attachment (from generators)
    ↓
normalizeAttachmentForAPI (q$7)
    ↓
┌─────────────────────────────────────────────┐
│ Returns:                                     │
│   - [] (empty) - suppress display           │
│   - [H0({...})] - single meta message       │
│   - q5([...]) - wrapped in system-reminder  │
└─────────────────────────────────────────────┘
    ↓
UI Layer (Ink components)
    ↓
┌─────────────────────────────────────────────┐
│ Renders based on message type:              │
│   - isMeta: true → System message styling   │
│   - tool_result → Tool result component     │
│   - assistant → Assistant message           │
└─────────────────────────────────────────────┘
```

---

## Attachment Type → Handler Mapping Quick Reference

| Type | Returns | Notes |
|------|---------|-------|
| `directory` | Simulated Bash ls | `q5([MuA, OuA])` |
| `file` | Simulated Read | Type-specific (image/text/notebook/pdf) |
| `todo` | Meta message | Empty reminder or todo list |
| `plan_mode` | Meta message | Full or sparse via `z$7()` |
| `plan_mode_exit` | Meta message | Exit notification |
| `delegate_mode` | `[]` | Hidden |
| `hook_success` | Meta or `[]` | Only SessionStart/UserPromptSubmit |
| `collab_notification` | Meta message | Unread message count |
| `memory` | Meta message | Session memory with XML tags |
