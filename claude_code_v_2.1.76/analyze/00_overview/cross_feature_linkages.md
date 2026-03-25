# Cross-Feature Linkages (CLI-UI-LLM Core)

> Complete documentation of how CLI, UI, and LLM Core integrate with other features.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-25.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

---

## Overview

This document describes how the three core modules (CLI, UI, LLM Core) integrate with other features in Claude Code v2.1.76.

---

## 1. System Reminder Integration (04_system_reminder)

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Flags: --plan, --auto, --dangerously-skip-permissions, --team-name         │
│         │                                                                    │
│         ▼                                                                    │
│  toolPermissionContext.mode → Determines attachment variants                │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  mainAgentLoopCore (omY) at turn start                                       │
│         │                                                                    │
│         ▼                                                                    │
│  assembleAllAttachments (_uY) at chunks.147.mjs:3                            │
│         │                                                                    │
│         ├── Group 1: User-message-dependent (sequential)                    │
│         │   ├── at_mentioned_files                                          │
│         │   ├── mcp_resources                                               │
│         │   └── agent_mentions                                              │
│         │                                                                    │
│         ├── Group 2: Always-computed (parallel)                             │
│         │   ├── plan_mode, auto_mode                                        │
│         │   ├── todo_reminders                                              │
│         │   └── critical_system_reminder                                    │
│         │                                                                    │
│         └── Group 3: Main-agent-only (parallel)                             │
│             ├── token_usage, budget_usd                                     │
│             └── ide_selection, diagnostics                                  │
│         │                                                                    │
│         ▼                                                                    │
│  normalizeAttachmentForAPI (Ui8) at chunks.174.mjs:3                         │
│         │                                                                    │
│         ▼                                                                    │
│  Injected as isMeta: true user messages                                     │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  Message rendering filters isMeta: true messages                            │
│  Users see only non-meta messages                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CLI Flags → Attachment Variants

| CLI Flag | Permission Mode | Attachment Types Produced |
|----------|-----------------|---------------------------|
| `--plan` | `plan` | `plan_mode`, `plan_mode_reentry`, `plan_file_reference` |
| None (auto mode active) | `auto` | `auto_mode`, `auto_mode_exit` |
| `--dangerously-skip-permissions` | `bypassPermissions` | All tools allowed, fewer reminders |
| Team mode active | `default` + team | `teammate_mailbox`, `team_context` |
| Default | `default` | Standard reminders (token_usage, budget_usd) |

### Key Functions

- `assembleAllAttachments` (_uY) - chunks.147.mjs:3 - Main orchestrator
- `normalizeAttachmentForAPI` (Ui8) - chunks.174.mjs:3 - API format converter
- `producePlanModeAttachment` (DuY) - chunks.147.mjs:136 - Plan mode producer
- `produceAutoModeAttachment` (ZuY) - chunks.147.mjs:214 - Auto mode producer

---

## 2. Permission System Integration

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION SYSTEM INTEGRATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Flags: --allowed-tools, --disallowed-tools, --permission-mode              │
│         │                                                                    │
│         ▼                                                                    │
│  permissionContextReducer (Ez) at chunks.53.mjs:1224                        │
│         │                                                                    │
│         ▼                                                                    │
│  toolPermissionContext object in state store                                │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  Tool Execution Request                                                      │
│         │                                                                    │
│         ▼                                                                    │
│  canUseTool function check                                                   │
│         │                                                                    │
│         ├── Tool in allowed list? → Allow                                   │
│         ├── Tool in denied list? → Deny                                     │
│         ├── Mode is bypassPermissions? → Allow                              │
│         └── Default → Queue for user approval                               │
│         │                                                                    │
│         ▼                                                                    │
│  toolDispatcher (Wi6) executes or defers                                    │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  toolUseConfirmQueue array                                                   │
│         │                                                                    │
│         ▼                                                                    │
│  getInputDialogType (ra6) returns "tool-permission"                         │
│         │                                                                    │
│         ▼                                                                    │
│  ToolPermissionDialog (HIq) displayed                                       │
│         │                                                                    │
│         ▼                                                                    │
│  User decision → resolve/reject → Tool executes/aborts                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Permission Mode Effects

| Mode | CLI Trigger | Effect on Tools |
|------|-------------|-----------------|
| `default` | Normal operation | Tools require permission prompts |
| `accept` | `--permission-mode accept` | All tools auto-approved |
| `plan` | `--plan` | Only read-only tools allowed |
| `bypassPermissions` | `--dangerously-skip-permissions` | All tools allowed, no prompts |

### Key Functions

- `permissionContextReducer` (Ez) - chunks.53.mjs:1224 - Reducer for permission updates
- `updateToolPermissionContext` (U84) - chunks.172.mjs:2829 - Settings merge
- `filterToolsByMode` (Xk8) - chunks.93.mjs:1568 - Tool filtering
- `matchesTool` (z3) - chunks.56.mjs:1588 - Tool name matching

---

## 3. Hooks Integration (11_hooks)

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOOKS INTEGRATION                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Flags: --init, --init-only, --maintenance                                   │
│         │                                                                    │
│         ▼                                                                    │
│  Hook trigger types: init, maintenance, session_start                       │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  Tool Execution Lifecycle                                                    │
│         │                                                                    │
│         ▼                                                                    │
│  executeToolCore (fxY) at chunks.146.mjs:442                                │
│         │                                                                    │
│         ├── PreToolUse hooks execute                                        │
│         │   ├── Can return { behavior: "deny" } to block                    │
│         │   └── Can return { patch: {...} } to modify input                 │
│         │                                                                    │
│         ├── Tool executes                                                   │
│         │                                                                    │
│         └── PostToolUse hooks execute                                       │
│             └── Can modify tool result                                      │
│                                                                              │
│  Turn Completion                                                             │
│         │                                                                    │
│         └── Stop hooks execute                                              │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  Hook results displayed in conversation flow                                │
│  Async hook responses added as attachments                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hook Types and Triggers

| Hook Type | Trigger | Can Block? | Can Modify? |
|-----------|---------|------------|-------------|
| `PreToolUse` | Before tool execution | ✅ Yes | ✅ Yes (input) |
| `PostToolUse` | After tool execution | ❌ No | ✅ Yes (result) |
| `SessionStart` | Session begins | ❌ No | ❌ No |
| `PreCompact` | Before compaction | ✅ Yes | ❌ No |
| `PostCompact` | After compaction | ❌ No | ✅ Yes |
| `Stop` | Session ends | ❌ No | ❌ No |
| `Notification` | External event | ❌ No | ❌ No |
| `ConfigChange` | Settings changed | ❌ No | ❌ No |

### Key Functions

- `executeToolCore` (fxY) - chunks.146.mjs:442 - Tool execution with hooks
- `runHooks` - Hook execution engine
- `produceAsyncHookResponses` - chunks.147.mjs - Attachment from hook results

---

## 4. Compact Integration (07_compact)

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPACT INTEGRATION                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Env vars: DISABLE_COMPACT, DISABLE_AUTO_COMPACT                            │
│  Flags: Affects token threshold indirectly via model selection              │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  mainAgentLoopCore (omY) turn processing                                    │
│         │                                                                    │
│         ▼                                                                    │
│  PHASE 1: Micro-compact (always runs)                                        │
│         │                                                                    │
│         │   Remove consecutive duplicate messages                           │
│         │   Very cheap O(n) operation                                        │
│         │                                                                    │
│         ▼                                                                    │
│  PHASE 2: Auto-compact (conditional)                                         │
│         │                                                                    │
│         │   shouldTriggerAutoCompaction(messages, model)?                   │
│         │   ├── Check: tokenCount >= threshold                              │
│         │   ├── Check: consecutiveFailures < 3 (circuit breaker)            │
│         │   └── Check: !DISABLE_AUTO_COMPACT                                │
│         │                                                                    │
│         │   If triggered:                                                    │
│         │   ├── autoCompactDispatcher(sqq) runs                             │
│         │   ├── Summary message created                                     │
│         │   └── Old messages replaced                                       │
│         │                                                                    │
│         ▼                                                                    │
│  Context overflow error handling                                             │
│         │                                                                    │
│         └── parseContextOverflowError extracts token counts                │
│             └── Retry with smaller context                                  │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  Compact summary message displayed                                          │
│  Tombstone events remove old messages from display                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compaction Algorithm

```
Auto-compact Decision Tree:

                    tokenCount >= threshold?
                           │
              ┌────────────┴────────────┐
              │ Yes                      │ No
              ▼                          ▼
    consecutiveFailures < 3?         Skip compact
              │
    ┌─────────┴─────────┐
    │ Yes               │ No
    ▼                   ▼
    Run compact       Circuit breaker
    │                  (return error)
    ▼
    Compact succeeds?
    │
    ┌──┴──┐
    │Yes  │No
    ▼     ▼
  Reset  Increment
  count  failures
```

### Key Functions

- `autoCompactDispatcher` (sqq) - chunks.147.mjs:2633 - Main compaction entry
- `shouldTriggerAutoCompaction` (CmY) - chunks.147.mjs:2620 - Trigger condition
- `parseContextOverflowError` ($54) - chunks.89.mjs:110 - Error parsing
- `microcompact` (pg) - chunks.133.mjs:991 - Duplicate removal

---

## 5. MCP Integration (06_mcp)

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MCP INTEGRATION                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Flags: --mcp-config, --strict-mcp-config                                   │
│         │                                                                    │
│         ▼                                                                    │
│  MCP server configuration loading                                            │
│         │                                                                    │
│         ▼                                                                    │
│  MCP client initialization (Fr6)                                             │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  Tool Discovery                                                              │
│         │                                                                    │
│         ▼                                                                    │
│  MCP tools prefixed with "mcp__" added to toolDefinitions                   │
│         │                                                                    │
│         ▼                                                                    │
│  Tool execution via toolDispatcher                                          │
│         │                                                                    │
│         └── MCP tools routed to MCP client                                  │
│                                                                              │
│  Elicitation Handling                                                        │
│         │                                                                    │
│         ▼                                                                    │
│  MCP server requests user input                                             │
│         │                                                                    │
│         ▼                                                                    │
│  elicitationQueue populated                                                  │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  getInputDialogType returns "elicitation"                                   │
│         │                                                                    │
│         ▼                                                                    │
│  ElicitationFormDialog displays JSON Schema form                            │
│         │                                                                    │
│         ▼                                                                    │
│  User input returned to MCP server                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MCP Tool Flow

```
LLM Response contains tool_use with name="mcp__server__tool"
         │
         ▼
toolDispatcher looks up tool in toolDefinitions
         │
         ▼
Tool isMcp flag is true
         │
         ▼
Route to MCP client for that server
         │
         ▼
Client sends request to MCP server
         │
         ▼
Server returns result
         │
         ▼
Result wrapped as tool_result message
```

### Key Functions

- MCP client initialization (Fr6) - Creates MCP clients from config
- `produceMcpResources` (SuY) - chunks.147.mjs - MCP resource attachments
- `produceMcpInstructionsDelta` (uE1) - MCP instruction attachments

---

## 6. Skills/Slash Commands Integration (10_skill_system)

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SKILLS/SLASH COMMANDS INTEGRATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Flags: --disable-slash-commands, --plugin-dir                              │
│         │                                                                    │
│         ▼                                                                    │
│  Plugin loading from directories                                             │
│         │                                                                    │
│         ▼                                                                    │
│  commands array populated                                                    │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  User types "/command" in input                                             │
│         │                                                                    │
│         ▼                                                                    │
│  Slash command matched in commands array                                    │
│         │                                                                    │
│         ├── Local JSX command → Execute immediately, show output            │
│         └── Skill command → Trigger Skill tool                              │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  Skill tool execution                                                        │
│         │                                                                    │
│         ▼                                                                    │
│  Skill prompt loaded from skill directory                                   │
│         │                                                                    │
│         ▼                                                                    │
│  System prompt augmented with skill instructions                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Command Types

| Type | Execution | Example |
|------|-----------|---------|
| Local JSX | Immediate, no LLM | `/help`, `/clear`, `/color` |
| Skill | Via LLM with skill prompt | `/claude-api`, custom skills |
| Loop | Schedules recurring task | `/loop 5m /check-status` |

### Key Functions

- `produceDynamicSkill` (BuY) - chunks.147.mjs - Dynamic skill attachment
- `produceSkillListing` (guY) - chunks.147.mjs - Skill listing attachment
- Skill tool execution via `toolDispatcher`

---

## 7. Thinking Mode Integration

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THINKING MODE INTEGRATION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  Flags: --thinking, --effort                                                │
│         │                                                                    │
│         ▼                                                                    │
│  thinkingConfig object in state                                             │
│         │                                                                    │
│         ├── type: "enabled" | "adaptive" | "disabled"                       │
│         └── budgetTokens: number | undefined                               │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  streamingQueryCore (mGq) builds API params                                 │
│         │                                                                    │
│         ▼                                                                    │
│  thinking config added to request                                           │
│         │                                                                    │
│         ├── Adaptive: Model controls thinking budget                        │
│         ├── Enabled: Fixed budget_tokens                                    │
│         └── Disabled: No thinking blocks in response                        │
│                                                                              │
│  SSE Processing                                                              │
│         │                                                                    │
│         ├── thinking_delta events accumulate thinking text                  │
│         └── signature_delta events add signature                            │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  Thinking blocks displayed with special formatting                          │
│         │                                                                    │
│         └── 30-second fade after streaming ends                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Effort Levels

| Effort | Budget Tokens | Description |
|--------|---------------|-------------|
| `low` | ~1,024 | Quick responses |
| `medium` | ~8,192 | Balanced thinking |
| `high` | ~32,768 | Deep analysis |
| `auto` | Model decides | Let model choose |

---

## Complete Feature Matrix

### Matrix: CLI → UI → LLM Core → System Reminder

| Feature | CLI Entry Point | State Key | UI Component | LLM Handler | System Reminder |
|---------|-----------------|-----------|--------------|-------------|-----------------|
| **Plan Mode** | `--plan` | `toolPermissionContext.mode` | `PlanDialog` (implicit via mode) | `filterToolsByMode` (Xk8) at chunks.93.mjs:1568 | `plan_mode`, `plan_mode_reentry`, `plan_file_reference` |
| **Auto Mode** | Auto-triggered | `toolPermissionContext.prePlanMode` | Status indicator | `agentDefinition` routing | `auto_mode`, `auto_mode_exit` |
| **Team Mode** | `--team-name <name>` | `teamContext.teamName` | Team context UI | `isTeamMode` (E7) check | `team_context`, `teammate_mailbox` |
| **Bypass Permissions** | `--dangerously-skip-permissions` | `toolPermissionContext.mode = "bypassPermissions"` | No dialogs | All tools allowed | Minimal reminders |
| **Accept Mode** | `--permission-mode accept` | `toolPermissionContext.mode = "accept"` | No permission dialogs | Tools auto-approved | Standard reminders |
| **Budget Tracking** | `--max-budget-usd <n>` | `maxBudgetUsd` | Budget indicator | Cost calculation | `budget_usd` |
| **Token Tracking** | Model-dependent | `tokenUsage` | Token indicator | `getTokenUsageAttachment` (qmY) | `token_usage` |
| **Todo List** | TodoWrite tool | `todos` array | Todo list UI | `getTodoReminderAttachment` (ruY) | `todo_reminders`, `task_reminder` |
| **Hooks** | `--init`, `--init-only` | Hook config | Inline results | `executeToolCore` (fxY) at chunks.146.mjs:442 | `async_hook_response`, `hook_blocking_error` |
| **MCP** | `--mcp-config <path>` | `mcpClients` | `McpPermissionDialog`, `ElicitationFormDialog` | MCP tool routing via `mcp__` prefix | `mcp_resource`, `mcp_instructions_delta` |
| **Compact** | `DISABLE_COMPACT` env | Auto-triggered | Compact summary UI | `autoCompactDispatcher` (sqq) at chunks.147.mjs:2633 | `compaction_reminder` |
| **Skills** | `--plugin-dir <path>` | `commands` array | Skill trigger via `/` prefix | Skill tool execution | `dynamic_skill`, `skill_listing` |
| **Thinking** | `--thinking`, `--effort` | `thinkingConfig` | Thinking block display | `streamingQueryCore` (mGq) adds to API params | (none - API-level) |
| **IDE Integration** | IDE connection | `ideContext` | Selection display | `getIdeSelectionAttachment` (kuY) | `selected_lines_in_ide`, `opened_file_in_ide`, `diagnostics` |
| **Memory** | Auto-detected | Memory files | Memory status | `getNestedMemoryAttachments` (IuY) | `nested_memory`, `relevant_memories` |
| **Diagnostics** | LSP connection | `diagnostics` registry | Error indicators | `getLspDiagnosticsAttachment` (luY) | `diagnostics`, `lsp_diagnostics` |

---

## Detailed Feature Flow Diagrams

### Feature Flow: Plan Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLAN MODE FEATURE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  $ claude --plan                                                             │
│         │                                                                    │
│         ▼                                                                    │
│  parseCliArgs extracts flag                                                  │
│         │                                                                    │
│         ▼                                                                    │
│  initialState.toolPermissionContext.mode = "plan"                           │
│                                                                              │
│  State Layer                                                                 │
│  ────────────                                                                │
│  createStateStore (WX1)                                                      │
│         │                                                                    │
│         ▼                                                                    │
│  useAppState(M1) returns state                                              │
│         │                                                                    │
│         ▼                                                                    │
│  LLM Core reads mode from toolPermissionContext                             │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  filterToolsByMode (Xk8)                                                     │
│         │                                                                    │
│         ├── Only allows: Read, Grep, Glob, Glob paths                      │
│         └── Blocks: Edit, Write, Bash (unless read-only)                   │
│         │                                                                    │
│         ▼                                                                    │
│  assembleAllAttachments (_uY)                                                │
│         │                                                                    │
│         ▼                                                                    │
│  getPlanModeAttachment (DuY) at chunks.147.mjs:136                          │
│         │                                                                    │
│         ├── Check: plan file exists?                                        │
│         ├── Yes → plan_file_reference content                               │
│         └── No → plan_mode instructions only                                │
│         │                                                                    │
│         ▼                                                                    │
│  Message injected with isMeta: true                                         │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  MessageList filters isMeta messages                                        │
│  Plan mode indicator in status line                                         │
│  User sees "Plan mode active" but not the reminder                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature Flow: Team/Swarm Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEAM MODE FEATURE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  $ claude --team-name "my-team"                                              │
│         │                                                                    │
│         ▼                                                                    │
│  teamContext.teamName = "my-team"                                           │
│  isTeamMode() (E7) returns true                                             │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  assembleAllAttachments includes team producers:                            │
│         │                                                                    │
│         ├── getTeamContextAttachment (AmY)                                  │
│         │   └── Team name, agent IDs, role                                  │
│         │                                                                    │
│         └── getTeammateMailboxAttachment (euY)                              │
│             └── Pending messages from other agents                          │
│         │                                                                    │
│         ▼                                                                    │
│  Tools available: SendMessage to communicate with teammates                 │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  Team context indicator in status                                           │
│  Mailbox notification when messages arrive                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature Flow: MCP Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MCP FEATURE FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  $ claude --mcp-config ./mcp-servers.json                                    │
│         │                                                                    │
│         ▼                                                                    │
│  MCP client initialization (Fr6)                                             │
│         │                                                                    │
│         ▼                                                                    │
│  mcpClients array populated                                                  │
│  Tools prefixed with "mcp__server__tool" added                              │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  @-mention in user message triggers:                                        │
│         │                                                                    │
│         └── getMcpResourcesAttachment (SuY)                                 │
│             └── Fetches resource from MCP server                            │
│         │                                                                    │
│  getMcpInstructionsDeltaAttachment (uE1)                                    │
│         └── MCP server instructions injected as reminder                    │
│         │                                                                    │
│  Tool execution:                                                             │
│         │                                                                    │
│         └── mcp__ prefixed tools routed to MCP client                       │
│         │                                                                    │
│         ▼                                                                    │
│  Elicitation request from MCP server:                                       │
│         │                                                                    │
│         └── elicitationQueue populated                                      │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  getInputDialogType returns "elicitation"                                   │
│         │                                                                    │
│         ▼                                                                    │
│  ElicitationFormDialog (JSON Schema form)                                   │
│         │                                                                    │
│         ▼                                                                    │
│  User input returned to MCP server                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature Flow: Hooks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOOKS FEATURE FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                                                                   │
│  ──────────                                                                  │
│  $ claude --init                                                             │
│         │                                                                    │
│         ▼                                                                    │
│  PreToolUse hooks registered                                                 │
│  PostToolUse hooks registered                                                │
│                                                                              │
│  LLM Core Layer                                                              │
│  ────────────────                                                            │
│  executeToolCore (fxY) at chunks.146.mjs:442                                │
│         │                                                                    │
│         ├── 1. Run PreToolUse hooks                                         │
│         │       │                                                            │
│         │       ├── Return { behavior: "deny" }?                            │
│         │       │   └── Block tool, create hook_blocking_error attachment   │
│         │       │                                                            │
│         │       ├── Return { patch: {...} }?                                │
│         │       │   └── Modify tool input                                   │
│         │       │                                                            │
│         │       └── Continue with original/modified input                   │
│         │                                                                    │
│         ├── 2. Execute tool                                                 │
│         │                                                                    │
│         └── 3. Run PostToolUse hooks                                        │
│                 └── Can modify tool result                                  │
│         │                                                                    │
│         ▼                                                                    │
│  getAsyncHookResponsesAttachment (tuY)                                       │
│         └── Collects hook responses as attachment                           │
│                                                                              │
│  UI Layer                                                                    │
│  ─────────                                                                   │
│  Hook results shown inline in conversation                                  │
│  Blocking errors shown as error messages                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-Module Data Flow Summary

### State Flow (CLI → State → All Modules)

```
CLI Flags
    │
    ▼
createStateStore (WX1) at chunks.85.mjs:1747
    │
    ├── initialState object
    │       │
    │       ├── toolPermissionContext
    │       │       ├── mode
    │       │       ├── allowedTools
    │       │       └── disallowedTools
    │       │
    │       ├── teamContext
    │       │       ├── teamName
    │       │       └── agentId
    │       │
    │       ├── todos array
    │       │
    │       ├── maxBudgetUsd
    │       │
    │       └── mcpClients
    │
    ▼
useAppState(M1) hook
    │
    ├── UI components read state
    ├── LLM core reads state via toolUseContext
    └── Attachment producers read state via sessionContext
```

### Event Flow (LLM → UI)

```
mainAgentLoop (Yh) at chunks.148.mjs:875
    │
    ├── Yields events
    │       │
    │       ├── content_block_start
    │       ├── content_block_delta
    │       ├── content_block_stop
    │       ├── message_start
    │       ├── message_delta
    │       └── message_stop
    │
    ▼
handleStreamedEvent (xN6)
    │
    ├── Updates state
    │       │
    │       ├── Append to messages
    │       ├── Update thinking buffer
    │       └── Queue tool confirmations
    │
    ▼
UI re-renders
    │
    ├── MessageList updates
    ├── ThinkingBlock shows/hides
    └── Dialog appears if needed
```

---

## Summary Table

| Feature | CLI Entry Point | LLM Core Integration | UI Display |
|---------|-----------------|----------------------|------------|
| System Reminder | Mode flags | `assembleAllAttachments` | Hidden (isMeta) |
| Permissions | Permission flags | `canUseTool` check | Permission dialogs |
| Hooks | `--init` flags | `executeToolCore` | Inline results |
| Compact | Env vars | `autoCompactDispatcher` | Summary message |
| MCP | `--mcp-config` | Tool routing | Elicitation dialogs |
| Skills | `--plugin-dir` | Skill tool | Command output |
| Thinking | `--effort` | API params | Thinking blocks |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Cross-feature linkages documented with complete feature matrix and detailed flow diagrams