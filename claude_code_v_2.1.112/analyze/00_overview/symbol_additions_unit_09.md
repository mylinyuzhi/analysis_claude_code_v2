# Symbol Additions — Unit 9: Hooks (v2.1.88 → v2.1.112)

This file lists symbols discovered while analyzing v2.1.88 → v2.1.112 hook changes (Unit 9). Symbols listed here are NEW (not in `symbol_index.md`) or have updated location anchors relative to the existing index. Authors integrating this unit's findings should merge these rows into `symbol_index.md` when convenient.

## Module: Hooks — Event Dispatchers (new/relocated)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$38` | `permissionDeniedHook` | chunks.192.mjs:2939-2959 | function |
| `e58` | `taskCreatedHook` | chunks.192.mjs:2829-2846 | function |
| `CM6` | `taskCompletedHook` | chunks.192.mjs:2848-2865 | function |
| `Tz8` | `userPromptSubmitHook` | chunks.192.mjs:3002-3020 | function |
| `oc` | `preCompactHook` | chunks.192.mjs:2406-2443 | function |
| `K36` | `postCompactHook` | chunks.192.mjs:2445-2470 | function |
| `kW6` | `worktreeCreateHook` | chunks.192.mjs:3033-3051 | function |
| `mu6` | `worktreeRemoveHook` | chunks.192.mjs:3053+ | function |
| `Be` | `permissionRequestHook` | chunks.192.mjs:2961-2980 | function |

## Module: Hooks — Result Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `KJ7` | `applyHookPermissionDecision` | chunks.193.mjs:3-149 | function |
| `Wa8` | `executeCommandHook` | chunks.193.mjs:151+ | function |
| `Ja8` | `processElicitationHookResult` | chunks.193.mjs:1578-1609 | function |
| `hu8` | `streamHookResults` | (iterator used at chunks.193.mjs:1243) | function |
| `Vz8` | `truncateSystemReminderContent` | (referenced at chunks.193.mjs:1257) | function |
| `m37` | `buildTaskCreatedHookFeedback` | chunks.193.mjs:631-634 | function |
| `q38` | `buildTaskCompletedHookFeedback` | chunks.193.mjs:636-639 | function |
| `W97` | `buildTeammateIdleHookFeedback` | chunks.193.mjs:626-629 | function |
| `YJ7` | `buildUserPromptSubmitBlockedFeedback` | chunks.193.mjs:641-644 | function |

## Module: Hooks — Session Title (NEW v2.1.98)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ma8` | `applyHookSessionTitle` | chunks.192.mjs:2992-3000 | function |
| `d65` | `sanitizeSessionTitle` | chunks.192.mjs:2988-2990 | function |
| `meY` | `MAX_SESSION_TITLE_CHARS` (=200) | chunks.192.mjs:3022 | constant |
| `NH` | `getCurrentSessionTitle` | (utility) | function |
| `AN` | `setSessionTitle` | (utility) | function |
| `oP6` | `setSessionTitleAndPropagate` | (utility) | function |
| `Lz` | `isInReadOnlySessionMode` | (utility) | function |

## Module: Hooks — PreCompact Blocking (NEW v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ec8` | `throwIfPreCompactBlocked` | chunks.159.mjs:533-544 | function |
| `GI6` | `BLOCKED_BY_PRECOMPACT_MESSAGE` (`"Compaction blocked by PreCompact hook"`) | chunks.159.mjs:1200 | constant |
| `be` | `CompactionBlockedException` | chunks.159.mjs:1204 | class |
| `vI6` | `performCompaction` | chunks.159.mjs:574+ | function |

## Module: Hooks — Schema (defer + sessionTitle additions)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ZeY` | `permissionBehaviorSchema` (=`["allow","deny","ask","defer"]`) | chunks.192.mjs:1571 | constant |
| `OPz` | `permissionBehaviorSchemaExternal` (duplicate for SDK schemas) | chunks.99.mjs:1183 | constant |
| `feY` | `syncHookResponseSchema` | chunks.192.mjs:1579+ | constant |
| `xu6` | `hookJSONOutputSchema` | chunks.192.mjs:1649+ | constant |
| `wPz` | `HOOK_EVENTS` (27 entries; new in v2.1.89+: `PermissionDenied`, `TaskCreated`, `TaskCompleted`) | chunks.99.mjs:1225 / chunks.18.mjs:1810 | constant |
| `dC4` | `hookEventEnumSchema` | chunks.99.mjs:1225 | constant |

## Module: Hooks — Aggregator State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `S` | `hookResult` (loop variable in aggregator) | chunks.193.mjs:1243 | variable |
| `B` | `aggregatedPermissionBehavior` | chunks.193.mjs:1283-1298 | variable |
| `h` | `outcomeCounts` (`{success, blocking, non_blocking_error, cancelled}`) | chunks.193.mjs:1229 | variable |
| `C` | `byteCounts` (`{additionalContextChars, systemMessageChars, ...}`) | chunks.193.mjs:1235 | variable |
| `D` | `matchedHooks` | (passed to aggregator) | variable |

## Module: Hooks — Consumer/Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$38` invocation site | `dispatchClassifierDenyHook` (handler that fires PermissionDenied after auto-mode deny) | chunks.153.mjs:1360-1369 | code-snippet |
| reactive compact handler | `runReactiveCompact` | chunks.101.mjs:1547+ | function |
| in-process runner catch | `handlePreCompactBlock` (catches `GI6`-prefixed error) | chunks.155.mjs:115-118 | code-snippet |

## Notes on Cross-File Lookups

- The hook event enum is **declared in TWO places** in v2.1.112: `chunks.18.mjs:1810` (`hV`) and `chunks.99.mjs:1225` (`wPz`). Both lists are identical; the duplicate suggests separate bundling for different entry points (CLI vs SDK).
- The `permissionBehaviorSchema` similarly has two copies: `ZeY` (chunks.192.mjs:1571) and `OPz` (chunks.99.mjs:1183). Both are `["allow","deny","ask","defer"]` post-2.1.89.
- The `applyHookPermissionDecision` function (`KJ7`) handles `permissionDecision` in **two switch statements** (lines 34 and 56): the first is "top-level normalization" (legacy `decision: "approve"|"block"`), the second is per-event-namespaced. Both gained the `defer` case.

## Cross-Reference

- Main symbol index: [symbol_index.md](./symbol_index.md). Existing "Module: Hooks (Permission Decisions)" and "Module: Hooks (Other Events)" sections already cover `KJ7` and `oc` / `Dr1` / `H.blockedBy`.
- This file lists the **additional** symbols touched while documenting Unit 9. Merge into `symbol_index.md` when consolidating.
