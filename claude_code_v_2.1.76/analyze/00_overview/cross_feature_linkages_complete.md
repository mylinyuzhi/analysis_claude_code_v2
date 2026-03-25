# Cross-Feature Linkage Complete (Claude Code 2.1.76)

> Complete analysis of cross-feature interactions and linkages.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Version**: v1 - Complete cross-feature linkage documentation.

---

## Table of Contents

1. [Overview](#1-overview)
2. [CLI ↔ System Reminder Linkage](#2-cli--system-reminder-linkage)
3. [UI ↔ System Reminder Linkage](#3-ui--system-reminder-linkage)
4. [LLM Core ↔ System Reminder Linkage](#4-llm-core--system-reminder-linkage)
5. [Plan Mode Cross-Linkage](#5-plan-mode-cross-linkage)
6. [Team Mode Cross-Linkage](#6-team-mode-cross-linkage)
7. [Compact Cross-Linkage](#7-compact-cross-linkage)
8. [Hooks Cross-Linkage](#8-hooks-cross-linkage)
9. [Feature Interaction Matrix](#9-feature-interaction-matrix)

---

## 1. Overview

This document maps all cross-feature interactions in Claude Code, showing how different modules communicate and coordinate.

### Key Integration Points

| Source | Target | Integration Method |
|--------|--------|-------------------|
| CLI | System Reminder | Flags → Attachment producers |
| UI | System Reminder | State → isMeta flag |
| LLM Core | System Reminder | Pre-turn → assembleAllAttachments |
| Plan Mode | Compact | Mode-aware compaction |
| Team Mode | Agent Teams | Team context injection |
| Hooks | System Reminder | Hook response attachments |

---

## 2. CLI ↔ System Reminder Linkage

### 2.1 Flag-to-Attachment Mapping

```
CLI Flag                     System Reminder Attachment
───────────                  ──────────────────────────
--plan                       → producePlanModeAttachment()
--team-name <name>           → produceTeamContextAttachment()
--dangerously-skip-perm      → Affects permission mode context
--resume                     → Restores previous reminders from session
--name <name>                → session_name attachment
--effort <level>             → ultrathink_effort attachment
--model <model>              → Affects token_usage calculation
```

### 2.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLI → SYSTEM REMINDER DATA FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  run() → Parse flags → Initialize state                             │    │
│  │                                                                       │    │
│  │  Flags:                                                               │    │
│  │  ├── --plan → toolPermissionContext.mode = "plan"                   │    │
│  │  ├── --team-name → teamConfig.name = value                          │    │
│  │  ├── --effort → effortValue = value                                 │    │
│  │  └── --name → sessionName = value                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  State Store (WX1)                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  {                                                                    │    │
│  │    toolPermissionContext: { mode, ... },                             │    │
│  │    teamConfig: { name, ... },                                        │    │
│  │    effortValue: "low" | "medium" | "high",                           │    │
│  │    sessionName: string                                               │    │
│  │  }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  System Reminder (04_system_reminder)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  assembleAllAttachments()                                            │    │
│  │                                                                       │    │
│  │  Producers check state:                                              │    │
│  │  ├── producePlanModeAttachment() checks mode === "plan"             │    │
│  │  ├── produceTeamContextAttachment() checks teamConfig               │    │
│  │  ├── produceUltrathinkEffortAttachment() checks effortValue         │    │
│  │  └── produceSessionNameAttachment() checks sessionName              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Code Example

```javascript
// ============================================
// CLI Flag → Attachment Producer Connection
// ============================================

// In run() (OVz):
if (options.plan) {
    initialState.toolPermissionContext.mode = "plan";
}

// In assembleAllAttachments() (_uY):
async function producePlanModeAttachment(messages, toolUseContext) {
    let mode = toolUseContext.getAppState().toolPermissionContext.mode;

    if (mode !== "plan") {
        return null;  // CLI didn't set plan mode
    }

    // Check plan mode variant
    let exceeds200k = exceedsTokenThreshold(messages, 200000);
    let variant = getPlanModeVariant(mode, exceeds200k);

    return {
        type: "plan_mode",
        variant: variant,  // "full" | "sparse" | "subagent"
        planFilePath: getPlanFilePath()
    };
}
```

---

## 3. UI ↔ System Reminder Linkage

### 3.1 Visibility Control

```
UI State                     System Reminder Behavior
──────────                   ─────────────────────────
message.isMeta === true      → Hidden from chat display
message.isMeta === false     → Visible in chat display
message.isCompactSummary     → Special rendering (summary)
message.toolUseResult        → Tool result display
```

### 3.2 UI Message Filter

```javascript
// ============================================
// Message Visibility Filter
// ============================================

function filterMessagesForDisplay(messages) {
    return messages.filter(message => {
        // Meta messages are hidden
        if (message.isMeta) {
            return false;
        }

        // Tombstones are removed
        if (message.type === "tombstone") {
            return false;
        }

        // Empty messages are filtered
        if (isEmptyMessage(message)) {
            return false;
        }

        return true;
    });
}
```

### 3.3 Streaming State ↔ Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     UI ↔ SYSTEM REMINDER FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  UI State                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  streamMode: "responding" | "tool-input" | "thinking"               │    │
│  │  streamingToolUses: [...]                                             │    │
│  │  inProgressToolUseIDs: Set<string>                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    │ Updates                                 │
│                                    ▼                                         │
│  System Reminder Producers                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • token_usage attachment gets real-time token counts              │    │
│  │  • tool_use_in_progress affects interruptible state                │    │
│  │  • streaming mode affects which attachments are produced           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  Next LLM Request                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Pre-turn: assembleAllAttachments()                                 │    │
│  │  Includes updated token_usage, tool state, etc.                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. LLM Core ↔ System Reminder Linkage

### 4.1 Pre-Turn Attachment Assembly

```
LLM Turn Phase               Attachment Integration
───────────────              ───────────────────────
Turn Start                   → assembleAllAttachments()
Message Preparation          → normalizeAttachmentForAPI()
API Request Building         → Attachments as user messages
Response Processing          → Update token counts
Turn Completion              → Track state for next turn
```

### 4.2 Attachment Integration Point

```javascript
// ============================================
// Main Agent Loop - Attachment Integration
// Location: chunks.148.mjs:882-1000
// ============================================

// READABLE (for understanding):
async function* mainAgentLoopCore(params, completedToolIds) {
    // ... turn loop ...

    // PRE-TURN PHASE
    // 1. Micro-compact (remove consecutive duplicates)
    messages = (await deps.microcompact(messages, toolUseContext, querySource)).messages;

    // 2. Auto-compact check
    let { compactionResult } = await deps.autocompact(messages, toolUseContext, ...);

    // 3. ATTACHMENT ASSEMBLY - Key integration point
    let attachments = await assembleAllAttachments(
        atMentionedFiles,   // @-mentioned files
        toolUseContext,     // Session state
        ideContext,         // IDE selection/opened files
        queuedCommands,     // Pending user messages
        messages,           // Conversation history
        querySource         // Request source
    );

    // 4. Normalize attachments for API
    for (let attachment of attachments) {
        let normalized = normalizeAttachmentForAPI(attachment);
        messages = [...messages, ...normalized];
    }

    // 5. Continue with LLM request...
}
```

### 4.3 Token Usage Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TOKEN USAGE FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM Response                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  Usage Object { input_tokens, output_tokens, cache_read, cache_creation }   │
│       │                                                                      │
│       ▼                                                                      │
│  Update Session State                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  totalInputTokens += usage.input_tokens                             │    │
│  │  totalOutputTokens += usage.output_tokens                           │    │
│  │  cacheReadTokens += usage.cache_read_input_tokens                   │    │
│  │  cacheCreationTokens += usage.cache_creation_input_tokens           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  System Reminder Producer                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  produceTokenUsageAttachment()                                       │    │
│  │                                                                       │    │
│  │  Returns:                                                             │    │
│  │  {                                                                    │    │
│  │    type: "token_usage",                                              │    │
│  │    inputTokens: N,                                                   │    │
│  │    outputTokens: M,                                                  │    │
│  │    totalTokens: N + M                                                │    │
│  │  }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  Auto-Compact Trigger Check                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  shouldTriggerAutoCompaction()?                                      │    │
│  │  tokenCount >= threshold?                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Plan Mode Cross-Linkage

### 5.1 Plan Mode Integration Points

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PLAN MODE CROSS-LINKAGE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  --plan flag → mode = "plan"                                        │    │
│  │  Plan file created at .claude/plans/<id>.md                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  Permission System (Ez)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  mode === "plan" → Block write tools                                │    │
│  │  filterToolsByMode() removes Edit, Write, Bash                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  System Reminder (04_system_reminder)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  producePlanModeAttachment()                                         │    │
│  │                                                                       │    │
│  │  Variants:                                                            │    │
│  │  ├── "full" - < 200k tokens, complete instructions                  │    │
│  │  ├── "sparse" - > 200k tokens, minimal context                      │    │
│  │  └── "subagent" - delegated to subagent                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  LLM Core (03_llm_core)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Plan mode affects:                                                  │    │
│  │  ├── Tool filtering (no write tools)                                │    │
│  │  ├── System prompt (planning instructions)                          │    │
│  │  └── Turn handling (exit on plan complete)                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  UI (02_ui)                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Plan mode indicator in status bar                                   │    │
│  │  Plan file displayed in message                                      │    │
│  │  Exit plan mode button (Escape)                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Plan Mode Tool Filtering

```javascript
// ============================================
// filterToolsByMode - Plan mode tool filtering
// Location: chunks.93.mjs:1568-1588
// ============================================

// READABLE (for understanding):
function filterToolsByMode({ tools, isBuiltIn, isAsync, permissionMode }) {
    return tools.filter(tool => {
        // MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Plan mode: only allow read-only tools
        if (matchesTool(tool, PLAN_ALLOWED_TOOLS) && permissionMode === "plan") {
            return true;
        }

        // Excluded tools are never allowed
        if (EXCLUDED_TOOLS.has(tool.name)) return false;

        // Non-builtin tools with exclusion
        if (!isBuiltIn && NON_BUILTIN_EXCLUDED.has(tool.name)) return false;

        // Async mode restrictions
        if (isAsync && !ASYNC_ALLOWED_TOOLS.has(tool.name)) {
            // Exception for team mode background agents
            // ...
        }

        return true;
    });
}

// PLAN_ALLOWED_TOOLS: Read, Grep, Glob, ls, etc.
// EXCLUDED_TOOLS: Internal tools not for LLM
```

---

## 6. Team Mode Cross-Linkage

### 6.1 Team Mode Integration Points

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TEAM MODE CROSS-LINKAGE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  --team-name <name> → Enable team mode                              │    │
│  │  Team config loaded from .claude/teams/<name>/                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  Agent Teams (30_agent_teams)                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Team coordination:                                                   │    │
│  │  ├── Team leader coordinates tasks                                   │    │
│  │  ├── Teammates claim tasks from shared list                         │    │
│  │  └── Mailbox for inter-agent communication                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  System Reminder (04_system_reminder)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Team mode attachments:                                              │    │
│  │  ├── teammate_mailbox - Messages from other agents                  │    │
│  │  ├── team_context - Team identity and resources                     │    │
│  │  └── task_list - Available tasks for claiming                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  Background Agents (26_background_agents)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Spawn teammates:                                                     │    │
│  │  ├── In-process (same Node process)                                 │    │
│  │  ├── Tmux (separate terminal panes)                                 │    │
│  │  └── iTerm2 (separate terminal windows)                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Team Context Attachment

```javascript
// ============================================
// Team Context Attachment Format
// Location: chunks.174.mjs:9-38
// ============================================

// READABLE (for understanding):
function produceTeamContextAttachment(teamName, agentName, teamConfigPath, taskListPath) {
    return {
        type: "team_context",
        teamName: teamName,
        agentName: agentName,
        teamConfigPath: teamConfigPath,
        taskListPath: taskListPath,
        content: `<system-reminder>
# Team Coordination

You are a teammate in team "${teamName}".

**Your Identity:**
- Name: ${agentName}

**Team Resources:**
- Team config: ${teamConfigPath}
- Task list: ${taskListPath}

**Team Leader:** The team lead's name is "team-lead".
Send updates and completion notifications to them.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead",
"analyzer", "researcher"), never by UUID.
</system-reminder>`
    };
}
```

---

## 7. Compact Cross-Linkage

### 7.1 Compact Integration Points

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPACT CROSS-LINKAGE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Environment Variables                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  DISABLE_COMPACT → Disable all compaction                           │    │
│  │  DISABLE_AUTO_COMPACT → Disable automatic compaction                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  LLM Core (03_llm_core)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Pre-turn checks:                                                    │    │
│  │  ├── Micro-compact (remove consecutive duplicates)                  │    │
│  │  └── Auto-compact (token threshold exceeded?)                       │    │
│  │                                                                       │    │
│  │  Triggers:                                                            │    │
│  │  ├── shouldTriggerAutoCompaction()                                   │    │
│  │  └── autoCompactDispatcher()                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  Compact Module (07_compact)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Compaction process:                                                  │    │
│  │  ├── Select messages to summarize                                    │    │
│  │  ├── Generate summary via LLM                                        │    │
│  │  ├── Create summary message with isCompactSummary: true             │    │
│  │  └── Replace old messages with summary                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  System Reminder (04_system_reminder)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Compaction reminders:                                               │    │
│  │  ├── compaction_reminder - Notify about upcoming compact            │    │
│  │  └── plan_file_reference - Reference compacted plan file            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  UI (02_ui)                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Compact indicator in status bar                                      │    │
│  │  Summary messages with special rendering                             │    │
│  │  Token count display updates                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Hooks Cross-Linkage

### 8.1 Hook Event Types

| Hook Type | Trigger | Cross-Feature Impact |
|-----------|---------|---------------------|
| PreToolUse | Before tool execution | Can modify/block tool input |
| PostToolUse | After tool execution | Can modify tool result |
| SessionStart | Session initialization | Can configure permissions |
| PreCompact | Before compaction | Can modify messages |
| PostCompact | After compaction | v2.1.76 new - can access summary |
| Stop | Turn completion | Can extend conversation |
| Notification | System events | Can add context |

### 8.2 Hook Response Integration

```javascript
// ============================================
// Hook Response Flow
// ============================================

async function processHookResponse(hookResponse, context) {
    // Hook responses become system reminder attachments

    switch (hookResponse.type) {
        case "block":
            // Tool execution blocked
            return {
                type: "hook_blocking_error",
                error: hookResponse.message
            };

        case "approve":
            // Tool execution approved
            return {
                type: "hook_success",
                approved: true
            };

        case "additionalContext":
            // Context added to next LLM turn
            return {
                type: "hook_additional_context",
                context: hookResponse.context
            };

        case "elicitation":
            // Request user input
            return {
                type: "elicitation",
                prompt: hookResponse.prompt
            };
    }
}
```

---

## 9. Feature Interaction Matrix

### 9.1 Complete Interaction Matrix

| Feature | CLI | UI | LLM Core | System Reminder | Compact | Hooks | Team |
|---------|-----|----|---------|-----------------|---------|-------|------|
| Plan Mode | --plan | Indicator | Tool filter | plan_mode attachment | Mode-aware | Block writes | - |
| Team Mode | --team-name | Team status | Team context | teammate_mailbox | - | - | Task claiming |
| Compact | DISABLE_* | Token display | Auto-trigger | compaction_reminder | Core | Pre/Post | - |
| Thinking | --effort | Thinking display | thinkingConfig | ultrathink_effort | - | - | - |
| Permissions | --permission-mode | Dialog | Permission check | Permission attachments | - | Config | - |
| Hooks | --init | Dialog | Hook execution | Hook response | Pre/Post | Core | - |
| MCP | --mcp-config | Server dialog | MCP tools | mcp_instructions_delta | - | - | Team tools |
| Skills | --disable-slash | Command list | Skill loading | skill_listing | - | - | - |
| Session | -r, -c, -n | Session info | Message restore | session_name | Preserve | - | Resume team |

### 9.2 State Flow Between Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     STATE FLOW BETWEEN FEATURES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input                                                                  │
│       │                                                                      │
│       ▼                                                                      │
│  CLI Layer                                                                   │
│  ├── Parse flags                                                            │
│  ├── Initialize state (createStateStore)                                    │
│  └── Wire providers (AppStateProvider)                                      │
│       │                                                                      │
│       ▼                                                                      │
│  UI Layer                                                                    │
│  ├── Render REPL                                                            │
│  ├── Handle input (keyboard, paste)                                         │
│  └── Display messages                                                       │
│       │                                                                      │
│       ▼                                                                      │
│  LLM Core                                                                    │
│  ├── Pre-turn (compact, attachments)                                        │
│  ├── Streaming (SSE events)                                                 │
│  ├── Tool execution (parallel/sequential)                                   │
│  └── Post-turn (hooks, state update)                                        │
│       │                                                                      │
│       ▼                                                                      │
│  System Reminder                                                             │
│  ├── Assemble attachments                                                   │
│  ├── Normalize for API                                                      │
│  └── Inject into messages                                                   │
│       │                                                                      │
│       ▼                                                                      │
│  Cross-Feature Updates                                                       │
│  ├── Token count → UI display + auto-compact check                         │
│  ├── Permission changes → UI dialog + tool filtering                       │
│  ├── Team messages → Mailbox → System reminder                             │
│  └── Hook responses → System reminder → Next LLM turn                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:
- `assembleAllAttachments` (_uY) - Main attachment orchestrator
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer
- `filterToolsByMode` (Xk8) - Mode-based tool filtering
- `permissionContextReducer` (Ez) - Permission state updates
- `shouldTriggerAutoCompaction` (CmY) - Auto-compact trigger

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-feature linkages documented