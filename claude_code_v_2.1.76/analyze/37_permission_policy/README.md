# 37_permission_policy Module Index (Claude Code 2.1.76)

> Permission and policy system: rule management, evaluation, decision pipeline, approval dialogs, and cross-feature integration.

---

## Module Overview

The permission/policy system is a **cross-cutting concern** spanning tools, hooks, sandbox, UI, plan mode, and multi-agent coordination. It controls whether tool invocations proceed, require user approval, or are blocked.

```
Permission Rules (config/CLI/hooks)
    |
    v
+-------------------------------------------------------------------+
|  Permission Context (toolPermissionContext)                         |
|  Mode: default | auto | bypassPermissions | acceptEdits | plan     |
|  Rules: alwaysAllowRules | alwaysDenyRules | alwaysAskRules        |
+-------------------------------------------------------------------+
|                                                                     |
|  +--------------+   +---------------+   +-------------------+      |
|  | Rule Engine  |   |  Decision     |   |  Dialog System    |      |
|  | (matching)   |-->|  Pipeline     |-->|  (UI approval)    |      |
|  +--------------+   +---------------+   +-------------------+      |
|         ^                  ^                    ^                    |
|         |                  |                    |                    |
|  +------+------+   +------+------+   +---------+--------+         |
|  | Bash Tool   |   | Hook System |   | Sandbox/Swarm    |         |
|  | Permissions |   | Overrides   |   | Integration      |         |
|  +-------------+   +-------------+   +------------------+         |
|                                                                     |
+-------------------------------------------------------------------+
```

### Core Data Flow

```
CLI flags + Config files + Env vars
    |
    v
xM() creates default context              [chunks.56.mjs:1596]
    |
    v
Ez() reducer applies updates              [chunks.53.mjs:1224]
  (addRules / setMode / replaceRules / removeRules / addDirectories / removeDirectories)
    |
    v
_v() applies batch updates                [chunks.53.mjs:1296]
    |
    v
U84() merges settings                     [chunks.172.mjs:2829]
  (clears local rules -> applies new from config)
    |
    v
toolPermissionContext stored in appState
    |
    v
Consumed by: BYz (main permission check), Tn8 (bash permission check),
             fxY (tool pipeline), LF8 (pre-tool hooks), Xk8 (tool filtering)
```

---

## Files in This Module

| File | Description |
|------|-------------|
| [permission_context.md](permission_context.md) | **Start here.** Permission context lifecycle: creation, reducer, updates, modes. Core data structure that all other components read. |

---

## Reading Order

1. **permission_context.md** -- Understand the data structure, reducer, lifecycle, and mode system

---

## Cross-Module References

| Module | Integration Point |
|--------|-------------------|
| [05_tools](../05_tools/) | Tool execution pipeline stage 4 (permission check), tool-level `checkPermissions()` |
| [04_system_reminder](../04_system_reminder/) | `permission_mode` field in hook context via `$w()` |
| [11_hooks](../11_hooks/) | PreToolUse hooks with `permissionDecision` output |
| [12_plan_mode](../12_plan_mode/) | `isReadOnly()` checks, `filterToolsByMode()` |
| [16_file_system](../16_file_system/) | `checkReadPermissions()`, `checkEditPermissions()`, path deny rules |
| [18_sandbox](../18_sandbox/) | Sandbox auto-allow, `shouldUseSandbox()` |
| [02_ui](../02_ui/) | Dialog priority system, permission prompt rendering |
| [30_agent_teams](../30_agent_teams/) | Mailbox-based permission sync between leader/worker |
| [01_cli](../01_cli/) | `--allowed-tools`, `--disallowed-tools`, `--dangerously-skip-permissions` |
| [29_shell_parser](../29_shell_parser/) | Command parsing for security validation |

---

## Key Entry Points

| Function | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| `createDefaultPermissionContext` | xM | chunks.56.mjs:1596 | Factory for initial permission context with default mode |
| `permissionContextReducer` | Ez | chunks.53.mjs:1224 | Core reducer: handles setMode, addRules, replaceRules, removeRules, addDirectories, removeDirectories |
| `applyPermissionUpdates` | _v | chunks.53.mjs:1296 | Applies multiple update actions to a context sequentially |
| `updateToolPermissionContext` | U84 | chunks.172.mjs:2829 | Merges settings into context (clears local then applies new) |
| `buildPermissionActions` | ifq | chunks.172.mjs:2804 | Groups rules by source:behavior into addRules/replaceRules action objects |
| `checkToolPermission` | BYz | chunks.172.mjs:2715 | Main 9-layer permission decision for any tool |
| `checkBashPermissions` | Tn8 | chunks.172.mjs:1930 | Bash-specific permission pipeline (tree-sitter + subcommand analysis) |
| `matchRulesForCommand` | CN6 | chunks.172.mjs:1756 | Evaluates deny/ask/allow rules against a command with prefix/exact matching |
| `filterToolsByMode` | Xk8 | chunks.93.mjs:1568 | Filters available tools based on permission mode |
| `executePreToolHooks` | LF8 | chunks.175.mjs:2462 | Pre-tool hook execution with permission override support |
| `toolExecutionPipeline` | fxY | chunks.146.mjs:442 | Core tool pipeline: validate, pre-hooks, permission, execute, post-hooks |
| `deletePermissionRule` | SMq | chunks.172.mjs:2778 | Removes a permission rule from context and persists to settings file |
| `persistPermissionUpdate` | Ym | chunks.53.mjs:1306 | Writes permission updates to settings JSON files on disk |
| `getRulesFromAllSources` | tz1 | chunks.53.mjs:1122 | Loads rules from all config sources (or only policySettings in managed mode) |

---

## Permission Mode Summary

| Mode | Effect | Trigger |
|------|--------|---------|
| `"default"` | Standard rule-based permission checking | Initial state, explicit reset |
| `"auto"` | Auto-allow all tool invocations | `--dangerously-skip-permissions` or background agents |
| `"bypassPermissions"` | Bypass all permission checks | API/SDK usage with explicit opt-in |
| `"acceptEdits"` | Auto-accept file edit operations (Write/Edit/MultiEdit/NotebookEdit) | Accept-edits mode toggle |
| `"plan"` | Read-only mode, restricts tool set to read-only tools | Plan mode toggle |
| `"dontAsk"` | Never prompt user (silently deny if not auto-allowed) | Non-interactive sessions |

---

## Rule Destination Sources

| Source | Persistence | Config File Location |
|--------|-------------|---------------------|
| `userSettings` | Persisted to disk | `~/.claude/settings.json` |
| `projectSettings` | Persisted to disk | `.claude/settings.json` (project root) |
| `localSettings` | Persisted to disk | `.claude/settings.local.json` (project root) |
| `policySettings` | Read-only (managed) | Policy-managed settings |
| `flagSettings` | Read-only | CLI flags like `--allowedTools` |
| `cliArg` | Session-only (cleared on reload) | `--allowed-tools`, `--disallowed-tools` |
| `command` | Session-only | Programmatic API commands |
| `session` | Session-only | Runtime permission grants (user approval) |

---

## Symbol Corrections

**IMPORTANT:** The following symbols in existing analysis documents are **incorrectly mapped** and must not be used:

| Symbol | Claimed Name | Actual Function | Actual Location |
|--------|-------------|-----------------|-----------------|
| `BJq` | getPermissionRules | React lazy module loader | chunks.162.mjs:524 |
| `SJq` | ignore library | mapRateLimitStatus | chunks.161.mjs:2906 |
| `hJq` | getRelativePath | transformMessagesForSession | chunks.161.mjs:2853 |
| `hmA` | matchesAlwaysAllowRule | EventSource polyfill | chunks.25.mjs:2493 |
