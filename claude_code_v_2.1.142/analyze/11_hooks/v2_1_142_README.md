# Module 11 — Hooks (v2.1.113 → v2.1.142 Deltas)

## Overview

This document covers hook-subsystem changes that landed between v2.1.113 and v2.1.142. The v2.1.112 baseline analysis is in [v2.1.112 hooks analysis](../../../claude_code_v_2.1.112/analyze/11_hooks/) — read that first for the foundational architecture (executor dispatch, schema layout, decision cascade).

The window saw three structural shifts:

1. **Hook authoring surface widens** — exec form (`args[]`), MCP-tool hooks (`type: "mcp_tool"`), and per-hook continue-on-block knob. Hooks can now invoke MCP tools as first-class operations rather than only shelling out.
2. **Hook output protocol grows** — `terminalSequence` (out-of-band UI emission), `hookSpecificOutput.updatedToolOutput` (generalized from MCP-only to all tools).
3. **Runtime isolation hardens** — hooks spawn detached (no controlling TTY), `effort.level` is propagated as both JSON input and `$CLAUDE_EFFORT` env var, MCP stdio servers inherit `CLAUDE_PROJECT_DIR` matching hooks. Configuration validation rejects prompt/agent hooks for context-less events (`SessionStart`/`Setup`/`SubagentStart`).

| Version | Change | Lifecycle Impact |
|---------|--------|------------------|
| v2.1.117 | Agent frontmatter `hooks:` fire on main-thread agent via `--agent` | Agent-scoped hooks now apply outside the subagent runner |
| v2.1.118 | Hooks can invoke MCP tools via `type: "mcp_tool"` | New hook type — sandboxed structured output, no shell |
| v2.1.119 | PostToolUse/PostToolUseFailure include `duration_ms` | Hooks see tool wallclock for telemetry-style decisions |
| v2.1.121 | PostToolUse `hookSpecificOutput.updatedToolOutput` works for all tools | Output rewrite generalized from MCP-only to native tools |
| v2.1.133 | `effort.level` JSON input field + `$CLAUDE_EFFORT` env var | Hooks (and Bash tool) observe the active effort level |
| v2.1.139 | `args: string[]` exec form (spawns directly, no shell) | Path placeholders never reach a shell parser |
| v2.1.139 | `continueOnBlock` config option for `PostToolUse` | Hook rejection can keep the turn alive and feed back to Claude |
| v2.1.139 | Hooks run without terminal access (`detached: true`) | Spawned hooks can no longer corrupt on-screen prompts |
| v2.1.139 | MCP stdio servers receive `CLAUDE_PROJECT_DIR` | Plugin configs can reference `${CLAUDE_PROJECT_DIR}` |
| v2.1.141 | `terminalSequence` JSON output field | Hooks emit OSC 0/1/2/9/99/777 + BEL through Claude Code's terminal |
| v2.1.142 | Prompt/agent hook validation for SessionStart/Setup/SubagentStart | Clear error message instead of opaque runtime failure |

The throughline is **hooks gaining shapes that match how they're authored in practice** — plugin authors wanted MCP tool calls, not just shell strings; output rewrite for non-MCP tools; turn continuation when blocking a tool; and a way to send desktop notifications via OSC sequences without spawning a foreground process.

## Document Map

| File | Topic | Changelog Anchor |
|------|-------|------------------|
| [args_exec_form.md](./args_exec_form.md) | `args: string[]` exec form — spawn-without-shell, placeholder substitution | 2.1.139 |
| [continue_on_block.md](./continue_on_block.md) | `continueOnBlock` config — feed rejection to model, keep turn alive | 2.1.139 |
| [terminal_sequence.md](./terminal_sequence.md) | `terminalSequence` JSON output — OSC/BEL allowlist + emission | 2.1.141 |
| [effort_level_injection.md](./effort_level_injection.md) | `effort.level` JSON + `$CLAUDE_EFFORT` env propagation | 2.1.133 |
| [mcp_tool_hook.md](./mcp_tool_hook.md) | `type: "mcp_tool"` — invoking MCP tools as hooks | 2.1.118 |
| [terminal_isolation.md](./terminal_isolation.md) | Hooks `detached: true` — no controlling terminal | 2.1.139 |
| [prompt_type_validation.md](./prompt_type_validation.md) | SessionStart/Setup/SubagentStart prompt/agent-hook validation error | 2.1.142 |
| [updated_tool_output_all_tools.md](./updated_tool_output_all_tools.md) | `updatedToolOutput` (all tools) vs legacy `updatedMCPToolOutput` | 2.1.121 |
| [duration_ms.md](./duration_ms.md) | PostToolUse/PostToolUseFailure `duration_ms` field | 2.1.119 |
| [agent_hooks_main_thread.md](./agent_hooks_main_thread.md) | `mainThreadAgentHooks` — frontmatter `hooks:` on `--agent` sessions | 2.1.117 |
| [../00_overview/symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) | All symbol mappings discovered in this delta | — |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks live here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - This delta's new symbols

Key functions added in v2.1.113 → v2.1.142:

- `bashCommandHook` (`vW8`) — `cli_inner_pretty.js:520794-522029` — Shell command hook executor; now branches on `args !== void 0` for exec form
- `mcpToolHook` (`XQ6`) — `cli_inner_pretty.js:519807-519849` — MCP tool hook executor
- `interpolateMCPHookInput` (`hu5`) — `cli_inner_pretty.js:519789-519814` — `${path.expr}` interpolation in mcp_tool input
- `dispatchHookOutputStream` (`aP`) — `cli_inner_pretty.js:521329-522181` — Main async iterator that streams hook results; new validation throws on prompt/agent + context-less event
- `parseHookJSONOutput` (`Kh4`) — `cli_inner_pretty.js:520521-520554` — Parses + validates `VsH` schema; recognizes `terminalSequence`
- `applyHookJSONOutput` (`TW8`) — `cli_inner_pretty.js:520617-520795` — Builds the result object from validated JSON; routes `terminalSequence` through `Lm6` allowlist; routes `updatedToolOutput` for `PostToolUse`
- `validateTerminalSequence` (`Lm6`) — `cli_inner_pretty.js:467431-467435` — Allowlist for OSC 0/1/2/9/99/777 + BEL
- `emitTerminalSequence` (`Pm6`) — `cli_inner_pretty.js:467447-467449` — Writes validated sequence to terminal stack
- `createHookBaseInput` (`M_`) — `cli_inner_pretty.js:520506-520520` — Builds the hook envelope; now adds `effort: { level }` when model supports effort
- `postToolUseHook` (`zL$`) — `cli_inner_pretty.js:520183-520195` — Now passes `duration_ms`
- `postToolUseFailureHook` (`YL$`) — `cli_inner_pretty.js:520197-520213` — Now passes `duration_ms`
- `setMainThreadAgentHooks` (`dv$`) — `cli_inner_pretty.js:3087-3091` — Persists agent-frontmatter hooks for main thread
- `getMainThreadAgentHooks` (`kp`) — `cli_inner_pretty.js:3083-3086` — Reader consulted by `getMatchedHooks` and `hasHookForEvent`

## Hook Lifecycle Changes (v2.1.142 view)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Session entry                                                            │
│   --agent <name> ─→ pJH(agent) ─→ dv$(hooks) [NEW v2.1.117]              │
│     │              kp()/getMatchedHooks now reads main-thread hooks       │
│                                                                          │
│   SessionStart ─→ throws on prompt/agent hooks [NEW v2.1.142]            │
│   Setup        ─→ throws on prompt/agent hooks [NEW v2.1.142]            │
│   SubagentStart─→ throws on prompt/agent hooks [NEW v2.1.142]            │
│                                                                          │
│ Each turn                                                                │
│   per-toolUse (loop):                                                    │
│     PreToolUse → ... unchanged                                           │
│     tool runs (records duration)                                         │
│     PostToolUse  ─→ NEW input: duration_ms          [v2.1.119]           │
│                 ─→ NEW output: updatedToolOutput    [v2.1.121]           │
│                 ─→ continueOnBlock: true keeps turn [v2.1.139]           │
│     PostToolUseFailure ─→ NEW input: duration_ms    [v2.1.119]           │
│                                                                          │
│   Per hook execution (any event):                                        │
│     Input envelope: + effort: { level: "high" }    [v2.1.133]            │
│     Env: + CLAUDE_PROJECT_DIR, + CLAUDE_EFFORT     [v2.1.133]            │
│     Spawn: detached: true (Unix), windowsHide      [v2.1.139]            │
│           args present → spawn(cmd, args[]) direct [v2.1.139]            │
│           type:"mcp_tool" → call MCP server tool   [v2.1.118]            │
│     Output JSON: terminalSequence → OSC/BEL allowlist [v2.1.141]         │
└──────────────────────────────────────────────────────────────────────────┘
```

### What changed in the 4-stage hook result lifecycle (v2.1.112 → v2.1.142)

The hook executor's result lifecycle has 4 stages: **execute → parse → apply decision → aggregate**. The diff is concentrated in stages 1, 2, and 4:

**Stage 1 (execute):** Multiple changes:
- Command hooks: detached spawning (no controlling TTY), `args[]` exec form bypasses shell parser, `CLAUDE_PROJECT_DIR`/`CLAUDE_EFFORT` env injection.
- New `mcp_tool` hook type — `XQ6` looks up the named MCP server in the toolUseContext's client list, interpolates `${path.expr}` references from hook input JSON, and calls `client.callTool`.

**Stage 2 (parse):** New fields recognized by `parseHookJSONOutput` (`Kh4`):
- `terminalSequence` (top-level) — routed through `Lm6` allowlist before assignment.
- `hookSpecificOutput.updatedToolOutput` (PostToolUse) — now valid for all tools; legacy `updatedMCPToolOutput` retained for MCP backwards compatibility.

**Stage 3 (apply decision):** Mostly unchanged; the new `continueOnBlock` flag on prompt-hooks flips `preventContinuation` from hardcoded `true` to `!isStop && hook.continueOnBlock !== true`.

**Stage 4 (aggregate):** The aggregator (`aP`'s consumer loop) now:
- Yields `updatedToolOutput` (preferred) and `updatedMCPToolOutput` (only if updatedToolOutput absent and tool is MCP).
- Calls `emitTerminalSequence` (`Pm6`) eagerly for each `terminalSequence` yielded by a hook, rather than only at end of aggregation.

## Cross-References

- **Agent frontmatter loading**: see [../30_agent_team/](../30_agent_team/) for `--agent` flag handling and `pJH` integration.
- **MCP client list**: see [../22_mcp/](../22_mcp/) for `toolUseContext.options.mcpClients` shape that `mcpToolHook` consumes.
- **Permission cascade**: unchanged from v2.1.112; see [defer_decision.md](../../../claude_code_v_2.1.112/analyze/11_hooks/defer_decision.md).
- **Compaction blocking**: unchanged from v2.1.112; see [precompact_hook.md](../../../claude_code_v_2.1.112/analyze/11_hooks/precompact_hook.md).
