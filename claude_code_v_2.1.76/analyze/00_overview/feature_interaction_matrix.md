# Feature Interaction Matrix (Claude Code v2.1.76)

> Comprehensive analysis of feature interactions across CLI, UI, LLM Core, and System Reminder modules.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.

---

## Table of Contents

1. [Cross-Module Feature Integration Matrix](#1-cross-module-feature-integration-matrix)
2. [Permission System Integration](#2-permission-system-integration)
3. [Compact Feature Integration](#3-compact-feature-integration)
4. [Hook System Integration](#4-hook-system-integration)
5. [MCP Integration](#5-mcp-integration)
6. [System Reminder Integration](#6-system-reminder-integration)
7. [State Propagation Flows](#7-state-propagation-flows)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## 1. Cross-Module Feature Integration Matrix

### Complete Feature Integration Table

| Feature | CLI Flags | UI Components | LLM Core Functions | System Reminder | Hooks |
|---------|-----------|---------------|---------------------|-----------------|-------|
| **Permissions** | `--dangerously-skip-permissions`, `--allowed-tools`, `--disallowed-tools`, `--permission-mode` | Dialog priority, tool-permission queue, sandbox-permission queue | Tool filtering (`filterToolsByMode`), `canUseTool` check | Permission mode attachment | PreToolUse/PostToolUse can modify |
| **Compact** | `DISABLE_AUTO_COMPACT`, `DISABLE_COMPACT` env | Compaction indicator, summary display | Auto-compact trigger in turn loop, `autoCompactDispatcher` | Token usage attachment | PreCompact/PostCompact hooks |
| **Hooks** | `--init`, `--init-only`, `--maintenance` | Hook result display, dialog interaction | PreToolUse, PostToolUse, Stop, Notification hooks | Hook result attachments | Core hook execution |
| **MCP** | `--mcp-config`, `--strict-mcp-config` | MCP notification UI, elicitation dialog, server status | MCP tool execution, tool discovery | MCP client state attachment | MCP hooks |
| **Skills/Slash Commands** | `--disable-slash-commands`, `--plugin-dir` | Command rendering, help display | Skill tool execution, skill discovery | Skill context attachment | Skill hooks |
| **Plan Mode** | `--permission-mode plan` | Plan mode UI, question forms, review screen | Plan mode tools (EnterPlanMode, ExitPlanMode, AskUserQuestion) | Plan mode attachment | Plan hooks |
| **Thinking Mode** | `--thinking`, `--max-thinking-tokens` | Thinking indicator, streaming display | Thinking config in API params, extended thinking | Thinking mode context | Thinking hooks |
| **Model Selection** | `--model`, `--effort`, `--agent`, `--betas` | Model display in footer, effort callout | Model resolution, effort tokens, API parameters | Model context attachment | Model change hooks |
| **Remote Sessions** | `--session-id`, Chrome flags, remote-control | Remote session UI, session list | Remote session config, state sync | Remote session state | Remote session hooks |
| **Team Mode** | `--agent-id`, `--agent-name`, `--team-name`, `--tmux` | Team tab UI, teammate display, mailbox | Team context, mailbox polling, task distribution | Team context attachment | Team hooks |
| **Todo/Task** | (via agent definitions) | Todo list UI, task progress | TodoWrite tool, task management | Todo list attachment | Task hooks |
| **Background Agents** | `--worktree` | Background agent status, progress | Background execution, worktree isolation | Background state | Background hooks |
| **IDE Integration** | `--ide` | IDE selection indicator, onboarding | IDE connection, file sync | IDE state | IDE hooks |
| **Cost/Budget** | `--max-budget-usd` | Cost warning dialog, budget display | Budget tracking, usage calculation | Budget attachment | Budget hooks |
| **Authentication** | `auth login/status/logout` | Auth status display, login flow | API key management, token refresh | Auth state | Auth hooks |

---

## 2. Permission System Integration

### Permission Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERMISSION SYSTEM FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI FLAGS                           STATE BUILDING                         │
│  ──────────                          ───────────────                         │
│                                                                              │
│  --dangerously-skip-permissions      initialState.toolPermissionContext = { │
│  --allowed-tools <tools...>            mode: "accept" | "plan" | "auto",   │
│  --disallowed-tools <tools...>         allowedTools: [...],                │
│  --permission-mode <mode>              disallowedTools: [...],             │
│                                        rules: { allow, deny, ask }         │
│                                      }                                      │
│          │                                  │                               │
│          │                                  ▼                               │
│          │                          createStateStore (WX1)                  │
│          │                                  │                               │
│          └─────────────────────────────────►│                               │
│                                             │                               │
│                                             ▼                               │
│  UI LAYER                           DIALOG PRIORITY                         │
│  ─────────                           ───────────────                         │
│                                                                              │
│  useAppState((s) => s.toolPermissionContext)                                │
│          │                                  │                               │
│          ▼                                  ▼                               │
│  ┌───────────────────┐              ┌───────────────────┐                  │
│  │ Tool Permission   │              │ Sandbox Permission │                  │
│  │ Queue             │              │ Queue              │                  │
│  │                   │              │                    │                  │
│  │ a8[0]?            │              │ G7[0]?             │                  │
│  └───────────────────┘              └───────────────────┘                  │
│          │                                  │                               │
│          └──────────────┬───────────────────┘                               │
│                           │                                                  │
│                           ▼                                                  │
│  LLM CORE LAYER                                                      │
│  ───────────────                                                      │
│                                                                              │
│  canUseTool(toolName, input)                                                 │
│          │                                                                  │
│          ├─► Check toolPermissionContext.mode                               │
│          │    ├─► "accept" → always true                                    │
│          │    ├─► "plan" → check plan-allowed tools                         │
│          │    └─► "auto" → check rules                                      │
│          │                                                                  │
│          ├─► Check allowedTools/disallowedTools                             │
│          │                                                                  │
│          └─► Return true/false + add to queue if needed                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Permission Decision Algorithm

```javascript
// ============================================
// Permission Decision Flow
// Location: chunks.93.mjs:1568-1588 (filterToolsByMode)
// ============================================

// READABLE (for understanding):
function canUseTool(toolName, toolInput, toolPermissionContext) {
    // Mode-based decisions
    switch (toolPermissionContext.mode) {
        case "accept":
            // Dangerously skip all permissions
            return { allowed: true, reason: "mode_accept" };

        case "plan":
            // Plan mode: only allow specific tools
            if (PLAN_ALLOWED_TOOLS.includes(toolName)) {
                return { allowed: true, reason: "plan_allowed" };
            }
            return { allowed: false, reason: "plan_not_allowed" };

        case "auto":
            // Check explicit rules
            break;
    }

    // Check explicit allow list
    if (matchesToolPattern(toolName, toolPermissionContext.allowedTools)) {
        return { allowed: true, reason: "explicit_allow" };
    }

    // Check explicit deny list
    if (matchesToolPattern(toolName, toolPermissionContext.disallowedTools)) {
        return { allowed: false, reason: "explicit_deny" };
    }

    // Check rule-based permissions
    for (let rule of toolPermissionContext.rules) {
        if (matchesRule(toolName, toolInput, rule)) {
            if (rule.type === "allow") {
                return { allowed: true, reason: "rule_allow" };
            } else if (rule.type === "deny") {
                return { allowed: false, reason: "rule_deny" };
            } else if (rule.type === "ask") {
                // Need to prompt user
                return { allowed: null, reason: "rule_ask", rule };
            }
        }
    }

    // Default: ask user
    return { allowed: null, reason: "default_ask" };
}
```

---

## 3. Compact Feature Integration

### Compact Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPACT INTEGRATION FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI/ENV                             TURN LOOP                              │
│  ─────────                           ──────────                              │
│                                                                              │
│  DISABLE_COMPACT                    mainAgentLoopCore (omY)                 │
│  DISABLE_AUTO_COMPACT                       │                               │
│                                        Phase 1: Micro-compact               │
│          │                                  │                               │
│          │                                  ▼                               │
│          │                          Phase 2: Auto-compact                    │
│          │                                  │                               │
│          │                                  ▼                               │
│          │                    shouldTriggerAutoCompaction()                  │
│          │                                  │                               │
│          ├─────────────────────────────────►│                               │
│          │                          (checks env var)                        │
│          │                                  │                               │
│          │                                  ▼                               │
│          │                    autoCompactDispatcher (sqq)                    │
│          │                                  │                               │
│          │                                  ├─► Generate summary             │
│          │                                  ├─► Replace old messages         │
│          │                                  └─► Update tracking              │
│          │                                                                  │
│          │                                  │                               │
│          │                                  ▼                               │
│  UI LAYER                           HOOK INTEGRATION                         │
│  ─────────                           ─────────────────                        │
│                                                                              │
│  Compaction indicator               PreCompact hook                         │
│  Summary message display                    │                               │
│          │                                  ▼                               │
│          │                          Perform compaction                       │
│          │                                  │                               │
│          │                                  ▼                               │
│          │                          PostCompact hook                         │
│          │                                  │                               │
│          │                                  ▼                               │
│  SYSTEM REMINDER                                                            │
│  ────────────────                                                           │
│                                                                              │
│  Token usage attachment                                                     │
│  (triggers re-check of thresholds)                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Environment Variable Effects

| Environment Variable | Effect | Scope |
|---------------------|--------|-------|
| `DISABLE_COMPACT` | Disable all compaction (manual and auto) | Session |
| `DISABLE_AUTO_COMPACT` | Disable only automatic compaction | Session |
| `CLAUDE_CODE_PROFILE_QUERY` | Enable profiling of query phases | Debug |

---

## 4. Hook System Integration

### Hook Lifecycle Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HOOK LIFECYCLE INTEGRATION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI TRIGGERS                        HOOK EXECUTION                         │
│  ─────────────                       ───────────────                         │
│                                                                              │
│  --init                              Setup hooks (trigger: "init")          │
│  --init-only                         Setup + SessionStart hooks, then exit  │
│  --maintenance                       Setup hooks (trigger: "maintenance")    │
│          │                                  │                               │
│          └─────────────────────────────────►│                               │
│                                             │                               │
│  TOOL EXECUTION LAYER                                                       │
│  ─────────────────────                                                      │
│                                                                             │
│  executeToolCore (fxY)                                                      │
│          │                                                                  │
│          ├─► PreToolUse hooks                                               │
│          │    ├─► Can block tool execution                                  │
│          │    ├─► Can modify tool input                                     │
│          │    └─► Can add feedback                                          │
│          │                                                                  │
│          ├─► Tool execution                                                 │
│          │                                                                  │
│          └─► PostToolUse hooks                                              │
│               ├─► Can modify tool result                                    │
│               └─► Can add feedback                                          │
│                                             │                               │
│  TURN COMPLETION LAYER                                                      │
│  ──────────────────────                                                     │
│                                                                             │
│  Turn ends                                                                  │
│          │                                                                  │
│          └─► Stop hooks                                                     │
│               └─► Can trigger session end                                   │
│                                             │                               │
│  COMPACT LAYER                       NOTIFICATION LAYER                     │
│  ─────────────                       ──────────────────                     │
│                                                                             │
│  Auto-compact triggered             Notification received                   │
│          │                                  │                               │
│          ├─► PreCompact hooks               └─► Notification hooks          │
│          │                                                                  │
│          └─► PostCompact hooks                                              │
│                                             │                               │
│  SYSTEM REMINDER INTEGRATION                                                │
│  ──────────────────────────                                                 │
│                                                                             │
│  Hook results are collected as attachments                                  │
│  and injected into the conversation context                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hook Types and Their Integration Points

| Hook Type | Trigger Point | Can Block | Can Modify | Feedback |
|-----------|---------------|-----------|------------|----------|
| `Setup` | CLI --init/--maintenance | No | No | Yes |
| `SessionStart` | Session start, --init-only | No | No | Yes |
| `PreToolUse` | Before tool execution | Yes | Yes (input) | Yes |
| `PostToolUse` | After tool execution | No | Yes (result) | Yes |
| `PreCompact` | Before auto-compact | Yes | No | Yes |
| `PostCompact` | After auto-compact | No | No | Yes |
| `Stop` | Turn completion | No | No | Yes |
| `Notification` | External notification | No | No | Yes |

---

## 5. MCP Integration

### MCP Feature Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MCP INTEGRATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI FLAGS                           MCP CLIENT INIT                        │
│  ──────────                          ─────────────────                       │
│                                                                              │
│  --mcp-config <file.json>            McpHub (JVq)                           │
│  --strict-mcp-config                        │                               │
│          │                                  │                               │
│          └─────────────────────────────────►│                               │
│                                             │                               │
│                                             ▼                               │
│                                    Load MCP servers                         │
│                                    Connect transports                       │
│                                    Discover tools/resources                 │
│                                             │                               │
│  UI LAYER                                    │                               │
│  ─────────                                   │                               │
│                                              │                               │
│  MCP notification UI                        │                               │
│  Elicitation dialog                         │                               │
│  Server status indicators                   │                               │
│          │                                  │                               │
│          │                                  ▼                               │
│          │                          TOOL REGISTRY                            │
│          │                          ─────────────                            │
│          │                                                                   │
│          │                          MCP tools prefixed with "mcp__"          │
│          │                          Added to toolDefinitions                 │
│          │                                  │                                │
│          │                                  │                                │
│          └──────────────────────────────────┤                               │
│                                             │                               │
│  LLM CORE LAYER                             │                               │
│  ───────────────                            │                               │
│                                             │                               │
│  toolDispatcher (Wi6)                       │                               │
│          │                                  │                               │
│          ├─► Check if mcp__ prefix          │                               │
│          │                                  │                               │
│          └─► Route to McpClient            │                               │
│                    │                        │                               │
│                    ▼                        │                               │
│          callMcpTool (pC)                   │                               │
│                    │                        │                               │
│                    └─► Execute via MCP protocol                             │
│                                             │                               │
│  SYSTEM REMINDER LAYER                                                      │
│  ──────────────────────                                                     │
│                                                                             │
│  MCP client state is tracked for                                            │
│  attachment producers                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MCP Tool Discovery Flow

```javascript
// ============================================
// MCP Tool Discovery and Integration
// Location: chunks.175.mjs, chunks.170.mjs
// ============================================

// READABLE (for understanding):
async function discoverMcpTools(mcpClients) {
    let allTools = [];

    for (let client of mcpClients) {
        try {
            // Call tools/list on MCP server
            let response = await client.request({ method: "tools/list" });

            for (let tool of response.tools) {
                // Prefix with mcp__ to avoid collisions
                let mcpTool = {
                    name: `mcp__${client.serverName}__${tool.name}`,
                    description: tool.description,
                    inputSchema: tool.inputSchema,
                    // MCP tools are generally concurrency-safe
                    isConcurrencySafe: () => true,
                    // Execution goes through MCP client
                    execute: async (input) => {
                        return await client.request({
                            method: "tools/call",
                            params: { name: tool.name, arguments: input }
                        });
                    }
                };
                allTools.push(mcpTool);
            }
        } catch (error) {
            // Log error but continue with other servers
            console.error(`MCP tool discovery failed for ${client.serverName}:`, error);
        }
    }

    return allTools;
}
```

---

## 6. System Reminder Integration

### System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM REMINDER FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGER SOURCES                     ASSEMBLY PHASE                         │
│  ────────────────                    ──────────────                         │
│                                                                              │
│  • Session state changes             assembleAllAttachments (_uY)           │
│  • Mode transitions                          │                               │
│  • Tool execution results                    │                               │
│  • Token usage updates                       ▼                               │
│  • Team context changes              ┌───────────────────────────────────┐  │
│  • LSP diagnostics                  │ Priority-based Producer Selection │  │
│                                      └───────────────────────────────────┘  │
│                                              │                               │
│                                              ▼                               │
│  PRODUCERS                           NORMALIZATION                          │
│  ──────────                          ──────────────                          │
│                                                                              │
│  • Plan mode attachment              normalizeAttachmentForAPI (Ui8)        │
│  • Token usage attachment                    │                               │
│  • Budget USD attachment                     ▼                               │
│  • Team context attachment           ┌───────────────────────────────────┐  │
│  • Todo list attachment             │ Convert to API-compatible format  │  │
│  • Auto mode attachment             │ • isMeta: true                    │  │
│  • MCP client state                 │ • content: string | content[]     │  │
│  • Hook results                     └───────────────────────────────────┘  │
│  • LSP diagnostics                           │                               │
│  • IDE selection                             │                               │
│  • Memory context                            ▼                               │
│                                      INJECTION                               │
│                                      ─────────                               │
│                                                                              │
│                                      Injected as user message:               │
│                                      {                                       │
│                                        type: "user",                        │
│                                        content: [...],                       │
│                                        isMeta: true,                         │
│                                        role: "user"                          │
│                                      }                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Attachment Producer Priority

| Priority | Producer | Trigger Condition |
|----------|----------|-------------------|
| 1 | Plan mode attachment | `permissionMode === "plan"` |
| 2 | Mode control attachment | Mode transition pending |
| 3 | Team context attachment | `teamContext` exists |
| 4 | Token usage attachment | Always (shows current usage) |
| 5 | Budget USD attachment | `maxBudgetUsd` set |
| 6 | Todo list attachment | `todos` non-empty |
| 7 | MCP client state attachment | MCP clients active |
| 8 | Hook results attachment | Hook results pending |
| 9 | LSP diagnostics attachment | Diagnostics available |
| 10 | IDE selection attachment | IDE selection active |
| 11 | Memory context attachment | Memory files exist |

---

## 7. State Propagation Flows

### Global State Propagation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE PROPAGATION FLOWS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SOURCE                              PROPAGATION PATH                        │
│  ──────                              ────────────────                        │
│                                                                              │
│  CLI Flags → initialState → createStateStore → AppStateProvider             │
│                                              │                               │
│                                              ├── useAppState hooks          │
│                                              │                               │
│                                              └── SessionOrchestrator        │
│                                                      │                       │
│  LOCAL STATE                                          │                       │
│  ────────────                                         │                       │
│                                                       │                       │
│  SessionOrchestrator useState calls:                  │                       │
│  • screen                                             │                       │
│  • streamMode                                         │                       │
│  • streamingToolUses                                  │                       │
│  • dialog queues                                      │                       │
│          │                                            │                       │
│          │                                            │                       │
│          └────────────────────────────────────────────►│                       │
│                                                       │                       │
│  EVENT FLOW                                           │                       │
│  ──────────                                           │                       │
│                                                       │                       │
│  mainAgentLoop yields events                          │                       │
│          │                                            │                       │
│          ▼                                            │                       │
│  handleStreamedEvent updates state                    │                       │
│          │                                            │                       │
│          ├── setMessages                              │                       │
│          ├── setStreamMode                            │                       │
│          ├── setStreamingToolUses                     │                       │
│          └── Dialog queue updates                     │                       │
│                                                       │                       │
│          └────────────────────────────────────────────►│                       │
│                                                       │                       │
│  UI RENDER                                            │                       │
│  ─────────                                            │                       │
│                                                       │                       │
│  React re-render based on state changes              │                       │
│  • MessageList updates                               │                       │
│  • StreamingIndicator shows/hides                    │                       │
│  • Dialog appears/disappears                         │                       │
│  • Input field state changes                         │                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Variable Categories

| Category | Source | Storage | Access Pattern |
|----------|--------|---------|----------------|
| **Session State** | CLI flags, session config | Global state store | `useAppState` |
| **UI State** | User interaction | Local useState | Direct state setter |
| **Streaming State** | LLM events | Local useState | Event-driven updates |
| **Dialog State** | User actions, tool needs | Local useState + queues | Priority dispatcher |
| **Tool Context** | Session initialization | Passed to agent loop | Function parameter |

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Permissions | chunks.93.mjs, chunks.53.mjs | `filterToolsByMode` (Xk8), `permissionContextReducer` (Ez) |
| Compact | chunks.147.mjs, chunks.148.mjs | `autoCompactDispatcher` (sqq), `shouldTriggerAutoCompaction` |
| Hooks | chunks.146.mjs | `executePreToolHooks` (y4q), `executePostToolHooks` |
| MCP | chunks.175.mjs, chunks.170.mjs | `McpHub` (JVq), `callMcpTool` (pC) |
| System Reminder | chunks.147.mjs, chunks.174.mjs | `assembleAllAttachments` (_uY), `normalizeAttachmentForAPI` (Ui8) |

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - Feature interaction matrix with cross-module analysis