# CLI-UI-LLM Feature Interaction Matrix (Claude Code v2.1.76)

> Cross-feature interaction analysis showing how CLI flags, UI state, and LLM behavior interact.
>
> **Cross-validated**: All interactions verified against source code on 2026-03-26.

---

## 1. CLI Flags → UI State → LLM Behavior Mapping

### 1.1 Permission Mode Interactions

| CLI Flag | UI State Change | LLM Behavior | Symbol References |
|----------|-----------------|--------------|-------------------|
| `--dangerously-skip-permissions` | `toolPermissionContext.mode = "bypassPermissions"` | All tools allowed, no permission prompts | `Ez` reducer, `Xk8` filter |
| `--plan` | `toolPermissionContext.mode = "plan"` | Only PLAN_ALLOWED_TOOLS, plan mode attachments | `DuY` producer, `Xk8` filter |
| `--permission-mode auto` | `toolPermissionContext.mode = "auto"` | Auto-approve safe operations | `ZuY` producer |
| `--allowed-tools` | `allowRules` updated | Whitelist enforced | `Ez` reducer |
| `--disallowed-tools` | `denyRules` updated | Blacklist enforced | `Ez` reducer |

### 1.2 Mode Activation Interactions

| CLI Flag | UI State Change | LLM Behavior | Symbol References |
|----------|-----------------|--------------|-------------------|
| `--print` | Non-interactive, `maxTurns` set | Single response, exit after | `q7` check |
| `--resume` | Messages loaded from session | Continue conversation | Session loader |
| `--continue` | Last session loaded | Continue conversation | Session loader |
| `--fork-session` | New session ID | Branch conversation | Session manager |
| `--model` | `mainLoopModel` set | Use specified model | `N6` resolver |
| `--effort` | `effortValue` set | Thinking budget adjusted | `II` config |

---

## 2. Cross-Module Feature Interactions

### 2.1 Plan Mode Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLAN MODE FEATURE FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry                                                                   │
│  ──────────                                                                  │
│  --plan flag detected                                                       │
│        │                                                                     │
│        ▼                                                                     │
│  Permission Context Building                                                │
│  ─────────────────────────                                                  │
│  mode = "plan"                                                              │
│  prePlanMode = null                                                         │
│        │                                                                     │
│        ▼                                                                     │
│  UI State Initialization                                                    │
│  ─────────────────────────                                                  │
│  toolPermissionContext.mode = "plan"                                        │
│  Plan file path resolved                                                    │
│        │                                                                     │
│        ▼                                                                     │
│  LLM Request Preparation                                                    │
│  ─────────────────────────                                                  │
│  Tool Filtering (Xk8):                                                      │
│    • Only PLAN_ALLOWED_TOOLS                                               │
│    • Read, Edit, Write, Glob, Grep, LSP, Bash(specific)                    │
│        │                                                                     │
│        ▼                                                                     │
│  System Reminder Attachment (DuY):                                          │
│  ─────────────────────────────────────                                      │
│    • producePlanModeAttachment()                                           │
│    • type: "plan_mode" or "plan_mode_reentry"                              │
│    • reminderType: "full" or "sparse" or "ultraplan-complete"              │
│        │                                                                     │
│        ▼                                                                     │
│  LLM Response Processing                                                    │
│  ─────────────────────────                                                  │
│  Tool calls filtered by plan mode rules                                     │
│  ExitPlanMode tool available                                                │
│        │                                                                     │
│        ▼                                                                     │
│  Turn Completion                                                            │
│  ────────────────                                                           │
│  If ExitPlanMode called → mode transitions to "default"                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Team Mode Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEAM MODE FEATURE FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry (--agent-id, --agent-name, --team-name)                          │
│        │                                                                     │
│        ▼                                                                     │
│  Team Context Building                                                      │
│  ────────────────────────                                                   │
│  setDynamicTeamContext({                                                    │
│    agentId, agentName, teamName,                                            │
│    color, planModeRequired, parentSessionId                                 │
│  })                                                                          │
│        │                                                                     │
│        ▼                                                                     │
│  UI State Updates                                                           │
│  ────────────────────                                                       │
│  teamContext available                                                      │
│  Mailbox attachment producers active                                        │
│        │                                                                     │
│        ▼                                                                     │
│  System Reminder Attachments                                                │
│  ───────────────────────────                                                │
│  • produceTeamContextAttachment()                                          │
│  • produceMailboxAttachment() - read unread messages                        │
│  • Team memory attachments                                                  │
│        │                                                                     │
│        ▼                                                                     │
│  LLM Behavior Changes                                                       │
│  ─────────────────────                                                      │
│  • SendMessage tool available                                               │
│  • Team-aware responses                                                     │
│  • Coordination through mailbox                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Auto-Compact Trigger Chain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTO-COMPACT TRIGGER CHAIN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Turn Start (mainAgentLoopCore)                                             │
│        │                                                                     │
│        ▼                                                                     │
│  Microcompact Phase                                                         │
│  ───────────────────                                                        │
│  Remove consecutive duplicate messages                                       │
│  (j.microcompact)                                                           │
│        │                                                                     │
│        ▼                                                                     │
│  Token Count Check                                                          │
│  ─────────────────                                                          │
│  currentTokens = countTokens(messages)                                      │
│  threshold = getAutoCompactThreshold(model)                                 │
│        │                                                                     │
│        ├── currentTokens < threshold → Skip compact                         │
│        │                                                                     │
│        ▼ (currentTokens >= threshold)                                       │
│  Circuit Breaker Check                                                      │
│  ───────────────────────                                                    │
│  consecutiveFailures < 3?                                                   │
│        │                                                                     │
│        ├── NO → Skip compact (too many failures)                            │
│        │                                                                     │
│        ▼ (YES)                                                              │
│  Auto-Compact Execution                                                     │
│  ────────────────────────                                                   │
│  1. Call LLM to summarize old messages                                      │
│  2. Create summary message with key info                                    │
│  3. Replace old messages with summary                                       │
│  4. Track: { compacted: true, turnId, turnCounter }                         │
│        │                                                                     │
│        ▼                                                                     │
│  Yield Summary Messages                                                     │
│  ────────────────────────                                                   │
│  for (msg of summaryMessages) yield msg                                     │
│        │                                                                     │
│        ▼                                                                     │
│  Continue with compacted messages                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. UI State Machine Interactions

### 3.1 Stream Mode Transitions with Event Triggers

| Current State | Trigger Event | Next State | UI Behavior |
|---------------|---------------|------------|-------------|
| `prompt` | User submits message | `requesting` | Input disabled, spinner shown |
| `requesting` | `stream_request_start` | `responding` | Streaming begins |
| `requesting` | `content_block_start(thinking)` | `thinking` | Thinking UI shown |
| `responding` | `content_block_start(tool_use)` | `tool-input` | Tool input JSON accumulates |
| `tool-input` | `content_block_stop` | `tool-use` | Tool executes, result pending |
| `tool-use` | Tool result received | `responding` or `prompt` | Continue or end turn |
| `thinking` | `content_block_stop` | `responding` | Thinking complete |
| Any | `message_stop` | `prompt` | Turn complete, ready for input |

### 3.2 Dialog Priority Interactions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DIALOG PRIORITY DECISION TREE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  getInputDialogType() called                                                │
│        │                                                                     │
│        ├── isConfirmingAction || hasBlockingDialog?                         │
│        │       └── YES → return undefined (no dialog)                       │
│        │                                                                     │
│        ├── isMessageSelectorVisible?                                        │
│        │       └── YES → return "message-selector"                          │
│        │                                                                     │
│        ├── isLoading?                                                       │
│        │       └── YES → return undefined (no dialog)                       │
│        │                                                                     │
│        ├── sandboxPermissionQueue[0]?                                       │
│        │       └── YES → return "sandbox-permission"                        │
│        │                                                                     │
│        ├── !shouldShowDialog?                                               │
│        │       └── YES → return undefined (animation blocking)              │
│        │                                                                     │
│        ├── toolPermissionQueue[0]?                                          │
│        │       └── YES → return "tool-permission"                           │
│        │                                                                     │
│        ├── promptQueue[0]?                                                  │
│        │       └── YES → return "prompt"                                    │
│        │                                                                     │
│        ├── workerSandboxPermissionQueue[0]?                                 │
│        │       └── YES → return "worker-sandbox-permission"                 │
│        │                                                                     │
│        ├── elicitationQueue[0]?                                             │
│        │       └── YES → return "elicitation"                               │
│        │                                                                     │
│        └── ... (lower priority dialogs)                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. System Reminder Integration Points

### 4.1 Attachment Producer Activation Matrix

| Producer | Activation Condition | CLI Flag Dependency | Symbol |
|----------|---------------------|---------------------|--------|
| `producePlanModeAttachment` | `mode === "plan"` | `--plan` | DuY |
| `produceAutoModeAttachment` | `mode === "auto"` | `--permission-mode auto` | ZuY |
| `produceTeamContextAttachment` | `teamContext` exists | `--team-name` | - |
| `produceMailboxAttachment` | `teamContext` + unread messages | Team mode | wl |
| `produceTokenUsageAttachment` | Always (throttled) | None | qmY |
| `produceBudgetAttachment` | `maxBudgetUsd` set | `--max-budget-usd` | YmY |
| `produceAutoMemoryAttachment` | Auto memory enabled | Settings | - |
| `produceDiagnosticsAttachment` | LSP diagnostics available | LSP enabled | luY |

### 4.2 isMeta Visibility Contract

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    isMeta VISIBILITY CONTRACT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Message Creation (normalizeAttachmentForAPI - Ui8)                         │
│        │                                                                     │
│        ▼                                                                     │
│  isMeta: true set on attachment messages                                    │
│        │                                                                     │
│        ├── UI Rendering (XV6 filter)                                        │
│        │       └── isMeta → HIDDEN from user                                │
│        │                                                                     │
│        ├── API Preparation (formatUserMessageForAPI)                        │
│        │       └── isMeta → STRIPPED from API payload                       │
│        │                                                                     │
│        └── Other Uses:                                                      │
│            • Turn counting exclusion                                        │
│            • Token budget exclusion                                         │
│            • Telemetry normalization (isSynthetic field)                    │
│            • Session title generation (getFirstMeaningfulUserMessage)       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Error Recovery Interactions

### 5.1 Error Propagation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR PROPAGATION FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM API Error (streamingQueryCore)                                         │
│        │                                                                     │
│        ├── Rate Limit Error                                                 │
│        │       └── Retry with exponential backoff                           │
│        │                                                                     │
│        ├── Context Overflow (invalid_request)                               │
│        │       ├── Trigger reactive compact                                 │
│        │       └── Retry with smaller context                               │
│        │                                                                     │
│        ├── max_output_tokens Error                                          │
│        │       ├── Reduce output token limit                                │
│        │       └── Retry (max 3 times)                                      │
│        │                                                                     │
│        └── Other Error                                                      │
│                └── Yield error message, end turn                            │
│                                                                              │
│  Tool Execution Error (StreamingToolExecutor)                               │
│        │                                                                     │
│        ├── Bash tool error                                                  │
│        │       └── hasErrored = true, abort siblings                        │
│        │                                                                     │
│        ├── User interrupt                                                   │
│        │       └── Create synthetic error, abort tool                       │
│        │                                                                     │
│        └── Other tool error                                                 │
│                └── Return error as tool_result                              │
│                                                                              │
│  UI Error Handling (handleCancel - TM)                                      │
│        │                                                                     │
│        ├── During tool-permission dialog                                    │
│        │       └── Abort tool, clear queue                                  │
│        │                                                                     │
│        ├── During prompt dialog                                             │
│        │       └── Reject all prompts, abort request                        │
│        │                                                                     │
│        └── Default                                                           │
│                └── Abort request, reset to prompt mode                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Performance Considerations

### 6.1 Token Efficiency Patterns

| Feature | Efficiency Strategy | Implementation |
|---------|---------------------|----------------|
| Deferred Tool Loading | Only include referenced tools | Tool schema built on-demand |
| Prompt Caching | Cache system prompt, repeated user messages | `cache_control` with TTL |
| Message Normalization | Remove unnecessary metadata | `normalizeMessages` (cM) |
| Auto-Compact | Prevent context overflow | Threshold-based triggering |

### 6.2 UI Performance Patterns

| Feature | Strategy | Implementation |
|---------|----------|----------------|
| Deferred Rendering | Use `useDeferredValue` for messages | `N8.useDeferredValue(u7)` |
| Event Batching | Yield events as they arrive | Async generator pattern |
| State Isolation | Separate UI state from message state | Multiple useState hooks |
| Animation Control | Reduced motion support | `prefersReducedMotion` setting |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key interaction symbols:
- `permissionContextReducer` (Ez) - Permission state updates
- `filterToolsByMode` (Xk8) - Tool filtering
- `producePlanModeAttachment` (DuY) - Plan mode reminders
- `produceAutoModeAttachment` (ZuY) - Auto mode reminders
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalization
- `getInputDialogType` (ra6) - Dialog priority
- `handleCancel` (TM) - Cancel handling

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76