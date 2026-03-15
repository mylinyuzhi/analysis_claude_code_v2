# UI Module - Claude Code v2.1.76

> Terminal UI architecture for Claude Code CLI using Ink (React for CLI)

---

## Module Overview

The UI module manages all user-facing terminal rendering in Claude Code. It uses **Ink** (React for CLI) to provide a responsive, component-based interface. The architecture follows a single-directional data flow pattern with centralized state management.

### Key Architectural Principles

1. **Single Active Dialog** - Only one interactive dialog can be visible at a time
2. **Priority Dispatching** - Dialogs are shown based on security/urgency priority
3. **Deferred Rendering** - Message updates are deferred to keep input responsive
4. **Streaming State** - LLM streaming events are normalized before display

---

## Documents in This Module

| Document | Purpose |
|----------|---------|
| [dialog_system.md](./dialog_system.md) | Priority dispatcher, 9 dialog types, cancel behavior |
| [elicitation_system.md](./elicitation_system.md) | MCP elicitation forms, JSON Schema rendering |
| [rendering_pipeline.md](./rendering_pipeline.md) | 7-stage pipeline, MessageList, normalization |
| [user_interaction_loop.md](./user_interaction_loop.md) | REPL state machine, streaming modes |
| [input_handling.md](./input_handling.md) | PromptInput, autocomplete, history, Vim mode |
| [spinner_status.md](./spinner_status.md) | Spinner visibility, status text, loading states |
| [streaming_ui.md](./streaming_ui.md) | Streaming tool uses, thinking blocks, transitions |
| [integration_summary.md](./integration_summary.md) | Cross-module integration points |

---

## Component Hierarchy

```
REPL (TUA)
├── Header (lgA)
│   └── Logo, version, agent info
├── MessageList (P8z)
│   ├── MessageComponent (n9q)
│   │   ├── UserMessage
│   │   ├── AssistantMessage
│   │   ├── ToolUseCard
│   │   └── ToolResultCard
│   └── StreamingToolUse (streamingToolUses)
├── Spinner (conditional)
│   └── Activity text, progress indicator
├── PromptInput (YUA)
│   ├── Autocomplete overlay
│   ├── Image attachment indicators
│   └── Vim mode status
└── Dialogs (priority queue)
    ├── ToolPermissionDialog (_Wq)
    ├── SandboxPermissionDialog (wUA)
    ├── ElicitationRouter (WWq)
    ├── CostWarningDialog (dMq)
    ├── IDEOnboardingDialog (Nx7)
    ├── LSPRecommendationDialog (kLq)
    └── MessageSelector (fMq)
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key components in this module:
- `REPL` (TUA) - Main React component orchestrating the session, chunks.188.mjs:3
- `MessageList` (P8z) - Memoized message list with 7-stage pipeline, chunks.161.mjs:587
- `getInputDialogType` (f11) - Priority dispatcher for dialogs, chunks.188.mjs:304
- `handleCancel` (N11) - Escape/cancel handler, chunks.188.mjs:328
- `handleSubmit` (Z$) - User input handler, chunks.188.mjs:686
- `normalizeMessages` (WJ) - Message transformation, chunks.173.mjs:89
- `normalizeDisplayMessages` (t9q) - Display grouping, chunks.172.mjs:3072
- `groupToolResults` (q9q) - Tool grouping for display, chunks.160.mjs:1849

---

## State Variables Reference

### REPL Core State (chunks.188.mjs)

| Variable | Setter | Purpose |
|----------|--------|---------|
| `W4` | `F1` / `X6` | Messages array |
| `K8` | `$8` | Current input value |
| `O7` | `tK` | Stream mode state |
| `_4` | `C3` | Is loading flag |
| `gq` | `xq` | Streaming tool uses |
| `U8` | `R4` | Streaming thinking |
| `F7` | `f8` | Tool permission queue |
| `oq` | `j5` | Sandbox permission queue |
| `vK` | `l9` | Tool JSX (local commands) |
| `y1` | `B1` | Screen mode (chat/transcript) |

### Derived State

| Variable | Calculation | Purpose |
|----------|-------------|---------|
| `PG` | Spinner visibility | `(!vK \|\| vK.showSpinner) && F7.length === 0 && ...` |
| `Gw` | Has active dialogs | `F7.length > 0 \|\| oq.length > 0 \|\| ...` |
| `XO` | Focused dialog type | Result of `f11()` |
| `V11` | Blocked items | Paused with pending dialogs |

---

## Quick Reference

### Dialog Priority Order

1. `message-selector` - User browsing history (highest)
2. (streaming paused blocks all)
3. `sandbox-permission` - Network access (security-critical)
4. (animation gate)
5. `tool-permission` - Tool approval
6. `worker-sandbox-permission` - Worker network access
7. `elicitation` - MCP input request
8. `cost` - Cost threshold warning
9. `ide-onboarding` - IDE setup
10. `lsp-recommendation` - LSP suggestion (lowest)

### Streaming State Machine

```
"responding" → "tool_use" → "responding" (loop)
     ↓              ↓
"reasoning"    "content_block_delta"
     ↓
"responding"
```

### Message Pipeline Stages

1. **Streaming** (iW1) - LLM events → state
2. **Normalization** (WJ) - Format conversion
3. **Compaction Filter** (EN) - Hide pre-compact
4. **Visibility Filter** (qYq) - Remove isMeta
5. **Display Normalization** (t9q) - Group hooks
6. **Tool Grouping** (q9q) - Collapse repeats
7. **Render** (P8z/n9q) - React elements

---

## Integration Points

| Module | UI Integration |
|--------|----------------|
| [05_tools](../05_tools/) | Permission dialogs, tool result display |
| [04_system_reminder](../04_system_reminder/) | isMeta filtering, attachment injection |
| [06_compact](../06_compact/) | Compact boundary display |
| [01_cli](../01_cli/) | Slash command autocomplete |
| [16_hooks](../16_hooks/) | Pre/Post tool use display grouping |
| [09_mcp](../09_mcp/) | Elicitation forms |

See [integration_summary.md](./integration_summary.md) for detailed cross-module connections.
