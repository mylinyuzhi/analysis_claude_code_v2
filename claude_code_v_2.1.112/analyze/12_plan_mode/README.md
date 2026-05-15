# Plan Mode Module (12_plan_mode) — v2.1.112

## TL;DR — v2.1.88 → v2.1.112 in 30 Seconds

The plan-mode subsystem (tools, lifecycle, approval flow) is **functionally the same** as v2.1.88, with three shipped diffs:

| Impact | Change | Where |
|--------|--------|-------|
| Behavior | **Plan files now seeded by prompt** — `getPlanSlug` accepts a prompt seed; produces `fix-auth-race-snug-otter.md` style names (was `gleaming-brewing-phoenix.md`) | `g56` chunks.97.mjs:1583, `MR4` chunks.97.mjs:1559 |
| Helper | **`generateShortWordSlug` added** — adjective+noun two-word generator used as the random suffix when a prompt seed is present | `Zh6` chunks.97.mjs:1567 |
| Safety | **Auto-mode gate fallback on plan exit** — if `prePlanMode === 'auto'` but the auto-mode gate is now off (circuit-breaker), `ExitPlanModeV2Tool` restores to `default` and emits a `'auto-mode-gate-plan-exit-fallback'` notification | chunks.150.mjs:2200-2228 |

Everything else (tool schemas, validateInput→checkPermissions→call flow, teammate plan-approval-request mailbox path, system reminders, mode cycling, attachment regeneration cadence) is identical to v2.1.88 except for obfuscated symbol renames.

---

## Overview

**Plan Mode** is the permission-mode that restricts the agent to read-only exploration of the codebase and forces a structured `EnterPlanMode → research → write plan → ExitPlanMode → user approval` workflow before any implementation. It is the official "Plan→Approve→Implement" safety pattern.

Two tools form the lifecycle:

1. **`EnterPlanMode`** (`o58`, chunks.151.mjs:1286-1353) — flips `toolPermissionContext.mode` from any non-plan mode to `'plan'`. Strips dangerous permissions if entering from `'auto'`. Cannot be called inside a subagent context. Disabled when `--channels` mode is active.
2. **`ExitPlanModeV2Tool`** (`zZ`, chunks.150.mjs:2094-2315) — reads the plan file from disk (or accepts an edited plan via `permissionResult.updatedInput`), shows the user an approval dialog, restores `prePlanMode` on approve, and produces a `tool_result` that includes the full plan so the model can immediately begin implementation.

Each session has a **plan slug** generated lazily on first access (`g56`, chunks.97.mjs:1583) and cached per session. The slug becomes the basename of the plan file at `${getPlansDirectory()}/${slug}.md`. The slug shape changed in v2.1.111: it is now `${promptDerivedKebab}-${adjective}-${noun}` (e.g. `fix-auth-race-snug-otter`) when a seed prompt is available, falling back to the legacy `${adjective}-${verb}-${noun}` (e.g. `gleaming-brewing-phoenix`) only when no seed exists.

Plan mode is entered by the model via the `EnterPlanMode` tool or by the user via Shift+Tab mode cycling. The plan-mode "system reminder" attachment (`HMY`, chunks.155.mjs:1624) is re-injected periodically while in plan mode and triggers the *first* call to `getPlanSlug(seed)` — this is when the slug actually gets fixed for the session.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, State
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions
> - Unit-1 additions: [symbol_additions_unit_01.md](../00_overview/symbol_additions_unit_01.md)

Key functions in this module:
- `EnterPlanModeTool` (`o58`) - chunks.151.mjs:1286
- `ExitPlanModeV2Tool` (`zZ`) - chunks.150.mjs:2094
- `ENTER_PLAN_MODE_TOOL_NAME` (`d56`) - chunks.98.mjs:1319 (constant `"EnterPlanMode"`)
- `EXIT_PLAN_MODE_V2_TOOL_NAME` (`dP`) - chunks.96.mjs:2551 (constant `"ExitPlanMode"`)
- `getPlanSlug` (`g56`) - chunks.97.mjs:1583
- `getPlanFilePath` (`eW`) - chunks.97.mjs:1612
- `getPlan` (`lP`) - chunks.97.mjs:1618
- `getPlansDirectory` (`aO`) - chunks.97.mjs:1767 (memoized)
- `generateWordSlug` (`Bb8`) - chunks.97.mjs:1552
- `generateShortWordSlug` (`Zh6`) - chunks.97.mjs:1567
- `slugifyPrompt` (`MR4`) - chunks.97.mjs:1559
- `handlePlanModeTransition` (`bi`) - chunks.1.mjs:3042
- `setHasExitedPlanMode` (`iL`) - chunks.1.mjs:3030
- `setNeedsPlanModeExitAttachment` (`Km`) - chunks.1.mjs:3038
- `setNeedsAutoModeExitAttachment` (`sG`) - chunks.1.mjs:3051
- `hasExitedPlanModeInSession` (`_p6`) - chunks.1.mjs:3026
- `buildPlanModeAttachment` (`HMY`) - chunks.155.mjs:1624

---

## Module Structure

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | End-to-end plan-mode lifecycle: enter → research → exit → approval. State machine, key data structures |
| [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) | Deep deobfuscation of `EnterPlanModeTool` (`o58`) — schema, gating, call body, follow-up instructions |
| [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) | Deep deobfuscation of `ExitPlanModeV2Tool` (`zZ`) — disk read, edited-plan write-back, teammate fork, auto-mode gate fallback |
| [plan_file_naming.md](./plan_file_naming.md) | Plan-slug generation pipeline (`getPlanSlug`, `slugifyPrompt`, `generateShortWordSlug`); the v2.1.111 prompt-seeded naming change |

---

## Architecture

```
                          PLAN MODE ARCHITECTURE
 ============================================================================

   Source chunks (v2.1.112):
   chunks.1.mjs    -- Global state setters (iL, Km, sG, bi, _p6)
   chunks.96.mjs   -- ExitPlanMode constants (Fk, dP)
   chunks.97.mjs   -- Plan-slug + plan-file utilities (g56, eW, lP, aO,
                       Bb8, Zh6, MR4)
   chunks.98.mjs   -- EnterPlanMode constant (d56)
   chunks.150.mjs  -- ExitPlanModeV2Tool object (zZ) + schemas + prompt
   chunks.151.mjs  -- EnterPlanModeTool object (o58) + schemas
   chunks.155.mjs  -- buildPlanModeAttachment (HMY) — fires getPlanSlug(seed)
   chunks.141.mjs  -- planSlugSeed propagation through slash-command path
   chunks.139.mjs  -- (no plan-mode code in this chunk; transitive only)
   chunks.183.mjs  -- ExitPlanMode prompt strings (Ultraplan teammate variant)

 ============================================================================

  +--------------------------+       +-----------------------------+
  | User / Shift+Tab / Tool  |       |        Global AppState      |
  +------------+-------------+       |  - mode: 'plan'              |
               |                     |  - prePlanMode: <saved>      |
               v                     |  - strippedDangerousRules?   |
  +------------+-------------+       |  hasExitedPlanMode (chunks.1)|
  |  EnterPlanModeTool (o58) |------>|  needsPlanModeExitAttachment |
  |  - throws if agentId     |       |  needsAutoModeExitAttachment |
  |  - bi() mode transition  |       +-----------------------------+
  |  - prepareContextForPlan +
  |  - applyPermissionUpdate |
  +------------+-------------+
               |
               v
  +------------+-------------+       +-----------------------------+
  |  HMY (chunks.155) builds |       | First call to g56(seed) is  |
  |  plan_mode attachment    |       | here. Slug = prompt-kebab + |
  |  every N turns           |       | adjective + noun.           |
  +------------+-------------+       +-----------------------------+
               |
               v
  +------------+--------------+
  | Read-only research phase  |
  | (model uses Read/Grep/... |
  |  + writes to plan file)   |
  +------------+--------------+
               |
               v
  +------------+--------------+      +----------------------------+
  | ExitPlanModeV2Tool (zZ)   |      |  Branch A: teammate path   |
  | - validateInput: mode==   +----->|  isPlanModeRequired() →    |
  |   'plan' (skipped if      |      |  writeToMailbox(team-lead, |
  |   isTeammate())           |      |   plan_approval_request)   |
  | - checkPermissions: ask   |      |  → awaitingLeaderApproval  |
  | - call: disk read +       |      +----------------------------+
  |   optional disk write-    |
  |   back for edited plan    |      +----------------------------+
  |                           +----->|  Branch B: main user path  |
  | - auto-mode gate guard    |      |  - User dialog: approve?   |
  | - restore prePlanMode     |      |  - On approve: setMode     |
  | - strip/restore perms     |      |    back to prePlanMode     |
  +------------+--------------+      |  - tool_result echoes plan |
               |                      +----------------------------+
               v
  +------------+--------------+
  | tool_result content:      |
  | "Your plan has been saved |
  |  to: <path>. ## Approved  |
  |  Plan: <plan>"            |
  +---------------------------+
```

---

## Plan-Mode Lifecycle (Linear Summary)

1. **Entry**: `EnterPlanModeTool.call()` calls `bi(prevMode, 'plan')` which flips `B8.needsPlanModeExitAttachment` if leaving plan mode. Then `setToolPermissionContext` updates the mode to `'plan'`, optionally stripping dangerous-permission rules via `prepareContextForPlanMode`.
2. **System reminder cycle**: `HMY` (`buildPlanModeAttachment`) is invoked by the attachment loader on each turn. It calls `g56(sessionId, planSlugSeed ?? prompt)` on first invocation per session, fixing the plan file path. It returns either a `plan_mode_reentry` attachment (when `hasExitedPlanMode` is set from a prior cycle) or a `plan_mode` attachment alternating `full`/`sparse` reminder types.
3. **Research**: The model uses read-only tools (Grep, Glob, Read, AskUserQuestion) to explore. It writes its plan to the file path embedded in the system reminder.
4. **Exit**: `ExitPlanModeV2Tool.call()` reads the plan from disk via `lP(agentId)`, asks the user to approve via the permission UI (or auto-allows for teammates), then transitions `mode` back to `prePlanMode` (with the auto-mode gate-fallback safeguard).
5. **Post-exit**: `iL(true)` (sets `hasExitedPlanMode`) and `Km(true)` (sets `needsPlanModeExitAttachment`) so the next attachment cycle emits a `plan_mode_exit` reminder. The tool_result content includes the full plan text so the model can immediately resume implementation work without re-reading the file.

---

## Cross-Cutting Concerns

- **Subagent containment**: `EnterPlanMode` throws if `context.agentId` is truthy — subagents may NOT enter plan mode independently. Teammates instead inherit `plan` from the leader at spawn time (gated by `plan_mode_required`).
- **Teammate approval mailbox**: Inside `ExitPlanModeV2Tool.call`, when `isTeammate() && isPlanModeRequired()`, the plan is posted to the team lead's mailbox as a `plan_approval_request` with a generated `requestId`. The teammate then waits for an `approve`/`reject` response in its inbox.
- **Channels gate**: When `--channels` is active (`qj().length > 0`), both tools are `isEnabled() === false`. This pairs the entry and exit so plan mode is never a trap.
- **Edited-plan write-back**: If the user edits the plan in the CCR web UI or via Ctrl+G external editor, the edited plan flows back through `permissionResult.updatedInput.plan` to `call()`. The tool writes the edited content back to the plan file with `writeFile()` and calls `persistFileSnapshotIfRemote` so remote sessions can recover it.
- **Auto-mode interaction**: `prePlanMode === 'auto'` is a special case. On exit, the tool checks the auto-mode gate (`isAutoModeGateEnabled()`) before restoring auto. If the gate has been tripped (circuit breaker), it restores to `'default'` and emits a user-visible warning notification.

---

## Source Cross-Validation

All readable names come from the v2.1.88 unobfuscated TypeScript source at `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/`, `.../ExitPlanModeTool/ExitPlanModeV2Tool.ts`, `.../utils/plans.ts`, and `.../utils/words.ts`. Every obfuscated symbol cited in this module has been traced to a v2.1.112 chunk line and matched 1:1 with its v2.1.88 counterpart unless explicitly flagged as a v2.1.112-only addition in the symbol additions file.
