# Module 11 — Hooks (v2.1.88 → v2.1.112 New Hook Events & Decision Tokens)

## Overview

This module documents hook system changes introduced between Claude Code v2.1.88 (the public source baseline) and v2.1.112. The window saw four new hook surfaces land, plus two fix passes that close subtle correctness holes:

| Version | Change | Lifecycle Impact |
|---------|--------|------------------|
| v2.1.89 | `PermissionDenied` hook event | New post-deny callback for auto-mode classifier outcomes |
| v2.1.89 | `defer` permissionDecision token | Fourth token alongside `allow` / `deny` / `ask` |
| v2.1.89 | `TaskCreated` hook event (documented) | Pre-creation veto for shared task list entries |
| v2.1.98 | `hookSpecificOutput.sessionTitle` on `UserPromptSubmit` | Programmatic session rename (same effect as `/rename`) |
| v2.1.105 | `PreCompact` blocking via exit-2 / `{decision:"block"}` | Hooks can now veto compaction outright |
| v2.1.105 | Plugin `monitors` manifest key | Plugins ship long-running monitors that run with hook trust |
| v2.1.110 | `PermissionRequest.updatedInput` re-checked against `permissions.deny` | Closes deny-rule bypass via hook input rewrite |
| v2.1.110 | `PreToolUse.additionalContext` retained on tool failure | Bug fix: context no longer dropped when tool errors |

The throughline is **hooks gaining authority over flows they previously could only observe**: compaction (block), permission denial (retry), permission request (deny rules now post-mutation), and tasks (pre-creation veto).

## Document Map

| File | Topic | Changelog Anchor |
|------|-------|------------------|
| [permission_denied_hook.md](./permission_denied_hook.md) | `PermissionDenied` lifecycle + `retry:true` re-feed | 2.1.89 |
| [defer_decision.md](./defer_decision.md) | `defer` token, escalation matrix, `passthrough` interaction | 2.1.89 |
| [precompact_hook.md](./precompact_hook.md) | `PreCompact` blocking — `blockedBy` plumbing through `oc` and `ec8` | 2.1.105 |
| [task_created_hook.md](./task_created_hook.md) | `TaskCreated` event documentation; pre-creation blocking pattern | 2.1.89 |
| [session_title_hook.md](./session_title_hook.md) | `hookSpecificOutput.sessionTitle` flow from JSON → session metadata | 2.1.98 |
| [../00_overview/symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md) | Symbol additions discovered while documenting Unit 9 | — |

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md). New mappings discovered in this unit live in [symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md).

Key functions referenced across this module:

- `permissionDeniedHook` (`$38`) — chunks.192.mjs:2939
- `taskCreatedHook` (`e58`) — chunks.192.mjs:2829
- `userPromptSubmitHook` (`Tz8`) — chunks.192.mjs:3002
- `applyHookSessionTitle` (`Ma8`) — chunks.192.mjs:2992
- `preCompactHook` (`oc`) — chunks.192.mjs:2406
- `throwIfPreCompactBlocked` (`ec8`) — chunks.159.mjs:533
- `applyHookPermissionDecision` (`KJ7`) — chunks.193.mjs:3-148
- `aggregateHookResults` (streamed reducer over `streamHookResults` iterator) — chunks.193.mjs:1217+
- `PERMISSION_BEHAVIOR_SCHEMA` (`ZeY`) — chunks.192.mjs:1571 (`["allow","deny","ask","defer"]`)
- `HOOK_EVENTS` (`hV` / `wPz`) — chunks.18.mjs:1810 / chunks.99.mjs:1225 (27 events including new ones)
- `BLOCKED_BY_PRECOMPACT_MESSAGE` (`GI6`) — chunks.159.mjs:1200 (`"Compaction blocked by PreCompact hook"`)

## Hook Lifecycle (Where the New Events Fit)

The hook executor (`E0`) is the single dispatcher: it gates execution on whether any hook listens to the event (`pn`), builds a base envelope (`J9` — cwd, session id, transcript path), then matches and executes hook entries. Different `hook_event_name` values flow into different downstream consumers:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Session entry                                                            │
│   SessionStart ─→ inject context, initialUserMessage, watchPaths         │
│                                                                          │
│ Each turn                                                                │
│   UserPromptSubmit ─→ additionalContext, sessionTitle (NEW v2.1.98)      │
│     │                                                                    │
│     ▼                                                                    │
│   per-toolUse (loop):                                                    │
│     PreToolUse ─→ permissionDecision: allow/deny/ask/defer (NEW: defer)  │
│       │                                                                  │
│       ▼                                                                  │
│     PermissionRequest ─→ behavior: allow/deny + updatedInput             │
│       │                                                                  │
│       ▼ (if denied by auto-mode classifier)                              │
│     PermissionDenied (NEW v2.1.89) ─→ retry: true to model               │
│       │                                                                  │
│       ▼ (else: tool runs)                                                │
│     PostToolUse / PostToolUseFailure ─→ additionalContext                │
│                                                                          │
│   Idle/Stop                                                              │
│     Stop / SubagentStop ─→ preventContinuation                           │
│                                                                          │
│ Compact path                                                             │
│   PreCompact ─→ NEW: decision:"block" or exit 2 vetoes compaction        │
│   PostCompact ─→ user-visible message only                               │
│   SessionStart(source:"compact") ─→ re-fires init logic post-compact     │
│                                                                          │
│ Agent teams                                                              │
│   TaskCreated (NEW v2.1.89) ─→ vetoes task creation if blocking          │
│   TaskCompleted / TeammateIdle ─→ unchanged                              │
└──────────────────────────────────────────────────────────────────────────┘
```

### What changed in the 4-stage hook result lifecycle (v2.1.88 → v2.1.112)

The hook executor's result lifecycle has 4 stages: **execute → parse → apply decision → aggregate**. The diff is concentrated in stages 2 and 3:

**Stage 1 (execute):** Unchanged. Spawn process / call callback / POST HTTP / send prompt. Capture stdout/stderr/status.

**Stage 2 (parse → flag `blocked`):** This is where exit-2 OR `{decision:"block"}` is recognized. The result object now carries a `blocked: boolean` field that is **independent** of `succeeded`. This is the load-bearing change for PreCompact blocking: a PreCompact hook that exits 2 is `succeeded:false, blocked:true`, but the new `oc` function partitions the results so blocked-and-failed entries don't trigger the failure-counter increment.

```javascript
// chunks.193.mjs:1541-1552 — command hook return shape
let R = k && bu(k) && k.decision === "block",    // JSON block
    h = V.status === 2 || !!R;                    // exit 2 OR JSON block
return {
    command: M.command,
    succeeded: V.status === 0,                    // status check
    output: ...,
    blocked: h,                                    // ← NEW: independent of succeeded
    ...
};
```

**Stage 3 (apply decision):** Per-event hookSpecificOutput handling. `defer` is now valid for `PreToolUse.permissionDecision`. `PermissionDenied` reads `retry`. `UserPromptSubmit` reads `sessionTitle`.

**Stage 4 (aggregate):** Reducer combines yielded results. `retry: true` → flagged at top level. `sessionTitle` → forwarded to the session renamer. `permissionBehavior === "defer"` → propagated via the cascade (deny > defer > ask > allow).

## Cross-References

- **PreCompact integration**: see [../07_compact/hooks_system.md](../07_compact/hooks_system.md) for the compaction-side hook flow.
- **Agent teams**: see [../30_agent_team/hooks_and_telemetry.md](../30_agent_team/hooks_and_telemetry.md) for `TeammateIdle` / `TaskCompleted` / `TaskCreated` integration with the runner.
- **Per-version diffs**: see [../by_version/v2.1.89.md](../by_version/v2.1.89.md), [../by_version/v2.1.98.md](../by_version/v2.1.98.md), [../by_version/v2.1.105.md](../by_version/v2.1.105.md), [../by_version/v2.1.110.md](../by_version/v2.1.110.md).
