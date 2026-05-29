# Plan Mode Module (12_plan_mode) — v2.1.142

## TL;DR — v2.1.112 → v2.1.142 in 30 Seconds

The plan-mode subsystem in v2.1.142 retains the same architecture as v2.1.112 (`EnterPlanMode` → research → `ExitPlanMode` → user approval) but lands **three behavior-level fixes** driven by the v2.1.119/132/136 changelog entries plus a `--channels` gating refinement:

| Impact | Change | Where (v2.1.142) | Changelog |
|--------|--------|------------------|-----------|
| Safety | **Plan mode now blocks file writes even with matching `Edit(...)` allow rule** — `VkH` (`checkWritePermissionForTool`) inserts a `mode === 'plan'` early-return between safety checks and the allow-rule lookup so an explicit `Edit(/path/**)` allow rule cannot bypass plan-mode read-only enforcement | `cli_inner_pretty.js:518269-518274`, `cli_inner_pretty.js:421723-421725` (`d64`) | 2.1.136 |
| Resume | **`--permission-mode` flag now applied on `--resume`/`--continue`** — `permissionModeCliSet` propagates through `nZ8` (session-restore) → `ur5` (restore filter) so CLI flag is the source of truth; plan-mode transcript value is not restored when CLI explicitly overrides | `cli_inner_pretty.js:564219-564306`, `cli_inner_pretty.js:607273` | 2.1.132 |
| Re-entry | **Plan mode re-applied after `ExitPlanMode` within same session** — `Wv5` (`/plan` command) and `EnterPlanModeTool.call` re-evaluate the auto-mode gate and dangerous-rule stripping on re-entry via `UkH` (`prepareContextForPlanMode`); `hasExitedPlanModeInSession` no longer suppresses the re-entry attachment | `cli_inner_pretty.js:397726-397748`, `cli_inner_pretty.js:483806-483854` | 2.1.132 |
| UX | **`/plan` / `/plan open` now acts on existing plan** — `Wv5` distinguishes "already in plan mode" from "switching into plan mode" and reads the disk plan file (`HW()`) instead of unconditionally printing "Enabled plan mode" | `cli_inner_pretty.js:483806-483854` | 2.1.119 |
| Gating | **`--channels` gate strengthened** — `EnterPlanMode.isEnabled()` and `ExitPlanMode.isEnabled()` add `T6()` (background-session predicate) so plan mode is unavailable in background-agent contexts even when `--channels` is empty (paired gating preserved) | `cli_inner_pretty.js:381669-381672`, `cli_inner_pretty.js:383818-383821` | (silent in changelog; from v2.1.140 background-agent work) |

Everything else (tool schemas, validateInput → checkPermissions → call flow, teammate plan-approval-request mailbox, attachment cadence, slug generation, prompt-seeded naming) is **identical to v2.1.112** modulo obfuscated symbol renames. The v2.1.112 prompt-seeded slug pipeline (`PDH`/`getPlanSlug` + `Sq6`/`slugifyPrompt` + `nmH`/`generateShortWordSlug`) is preserved unchanged.

---

## Overview

**Plan Mode** is the permission-mode that restricts the agent to read-only exploration of the codebase and forces a structured `EnterPlanMode → research → write plan → ExitPlanMode → user approval` workflow before any implementation. It is the official "Plan→Approve→Implement" safety pattern.

Two tools form the lifecycle:

1. **`EnterPlanModeTool`** (`Q38`, `cli_inner_pretty.js:383798-383866`) — flips `toolPermissionContext.mode` from any non-plan mode to `'plan'`. Strips dangerous permissions if entering from `'auto'`. Cannot be called inside a subagent context. Disabled when `--channels` mode is active AND running as a background-session worker.
2. **`ExitPlanModeV2Tool`** (`V2`, `cli_inner_pretty.js:381649-381847`) — reads the plan file from disk (or accepts an edited plan via `permissionResult.updatedInput`), shows the user an approval dialog, restores `prePlanMode` on approve, and produces a `tool_result` that includes the full plan so the model can immediately begin implementation.

Each session has a **plan slug** generated lazily on first access (`PDH`, `cli_inner_pretty.js:517632-517647`) and cached per session. The slug becomes the basename of the plan file at `${getPlansDirectory()}/${slug}.md`. Shape (preserved from v2.1.112): `${promptDerivedKebab}-${adjective}-${noun}` (e.g. `fix-auth-race-snug-otter`) when a seed prompt is available, falling back to the legacy `${adjective}-${verb}-${noun}` (e.g. `gleaming-brewing-phoenix`) when no seed exists.

Plan mode is entered by the model via the `EnterPlanMode` tool, by the user via Shift+Tab mode cycling, or via the `/plan` slash command (`Wv5`, `cli_inner_pretty.js:483806`). The plan-mode "system reminder" attachment (`d65`, `cli_inner_pretty.js:397726-397748`) is re-injected periodically while in plan mode and triggers the *first* call to `PDH(sessionId, seed)` — this is when the slug actually gets fixed for the session.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — all new symbol mappings discovered in this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, State
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions

Key functions in this module:
- `EnterPlanModeTool` (obfuscated: `Q38`) - tool object, `cli_inner_pretty.js:383798`
- `ExitPlanModeV2Tool` (obfuscated: `V2`) - tool object, `cli_inner_pretty.js:381649`
- `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `Q3H`) - constant `"EnterPlanMode"`, `cli_inner_pretty.js:211429`
- `EXIT_PLAN_MODE_V2_TOOL_NAME` (obfuscated: `NZ`) - constant `"ExitPlanMode"`, `cli_inner_pretty.js:143087`
- `EXIT_PLAN_MODE_TOOL_NAME` (legacy alias, obfuscated: `kZ`) - `cli_inner_pretty.js:143086`
- `getPlanSlug` (obfuscated: `PDH`) - slug accessor with prompt seeding, `cli_inner_pretty.js:517632`
- `getPlanFilePath` (obfuscated: `v2`) - `cli_inner_pretty.js:517657`
- `getPlan` (obfuscated: `HW`) - `cli_inner_pretty.js:517662`
- `getPlansDirectory` (obfuscated: `SO`) - memoized, `cli_inner_pretty.js:517791`
- `generateWordSlug` (obfuscated: `Li$`) - 3-word slug, `cli_inner_pretty.js:138981`
- `generateShortWordSlug` (obfuscated: `nmH`) - 2-word slug, `cli_inner_pretty.js:138997`
- `slugifyPrompt` (obfuscated: `Sq6`) - prompt-to-kebab function, `cli_inner_pretty.js:138987`
- `handlePlanModeTransition` (obfuscated: `Oo`) - mode-transition hook, `cli_inner_pretty.js:2961`
- `setHasExitedPlanMode` (obfuscated: `OT`) - `cli_inner_pretty.js:2952`
- `setNeedsPlanModeExitAttachment` (obfuscated: `qh`) - `cli_inner_pretty.js:2958`
- `setNeedsAutoModeExitAttachment` (obfuscated: `MT`) - `cli_inner_pretty.js:2968`
- `hasExitedPlanModeInSession` (obfuscated: `HH$`) - `cli_inner_pretty.js:2949`
- `buildPlanModeAttachment` (obfuscated: `d65`) - per-turn attachment builder, `cli_inner_pretty.js:397726`
- `buildPlanModeExitAttachment` (obfuscated: `c65`) - `cli_inner_pretty.js:397750`
- `prepareContextForPlanMode` (obfuscated: `UkH`) - `cli_inner_pretty.js:422720`
- `transitionPlanAutoMode` (obfuscated: `TdH`) - re-entry auto-mode toggle, `cli_inner_pretty.js:422736`
- `checkWritePermissionForTool` (obfuscated: `VkH`) - plan-mode floor for writes, `cli_inner_pretty.js:518202`
- `isPlanModeFloorReason` (obfuscated: `d64`) - decision-reason classifier, `cli_inner_pretty.js:421723`
- `restoreFromTranscriptPermissionMode` (obfuscated: `ur5`) - resume filter, `cli_inner_pretty.js:564219`

### Runtime / Reminder Builders

- `dispatchPlanModeReminder` (obfuscated: `Gz5`) - routes full/sparse/sub-agent, `cli_inner_pretty.js:424762`
- `buildPlanModeFullReminder_5Phase` (obfuscated: `Vz5`) - default workflow, `cli_inner_pretty.js:424773`
- `buildPlanModeFullReminder_Iterative` (obfuscated: `kz5`) - interview-phase workflow, `cli_inner_pretty.js:424867`
- `buildPlanModeSparseReminder` (obfuscated: `Nz5`) - short anchor, `cli_inner_pretty.js:424918`
- `buildPlanModeSubAgentReminder` (obfuscated: `Ez5`) - sub-agent variant, `cli_inner_pretty.js:424927`
- `getEndOfTurnInstruction` (obfuscated: `Gq4`) - turn-end enforcement text, `cli_inner_pretty.js:424767`
- `getReadOnlyToolsList` (obfuscated: `vz5`) - returns `Read`/`Glob`/`Grep` (vars `Bq`/`d1`/`v9`); aliased to `Read,` `` `find`/Glob, `` `` `grep`/Grep `` in shell-env mode, `cli_inner_pretty.js:424861`
- `PLAN_MODE_PREAMBLE` (obfuscated: `Zq4`) - top-of-reminder text, `cli_inner_pretty.js:425992`
- `PLAN_PHASE_4_PROMPT` (obfuscated: `Tz5`) - plan-structure bullets, `cli_inner_pretty.js:425984`
- `PLAN_MODE` (obfuscated: `Is7`) - cadence config `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`, `cli_inner_pretty.js:398822`
- `attachmentRegistrar` (obfuscated: `aY`) - per-attachment telemetry wrapper, `cli_inner_pretty.js:397620`
- `REJECTED_PLAN_TOOL_RESULT_SENTINEL` (obfuscated: `MV6`) - `cli_inner_pretty.js:425970`

### UI Components

- `ExitPlanModePermissionRequestComponent` (obfuscated: `Tb4`) - approval dialog, `cli_inner_pretty.js:540953`
- `buildPlanApprovalOptions` (obfuscated: `_c6`) - option-list builder, `cli_inner_pretty.js:540869`
- `mapApprovalChoiceToResult` (obfuscated: `M28`) - choice → permission decision, `cli_inner_pretty.js:540914`
- `autoNameSessionFromPlan` (obfuscated: `Kc6`) - session-name fire-and-forget, `cli_inner_pretty.js:540852`
- `RejectedPlanMessage` (obfuscated: `tz8`) - rejected-plan styled box, `cli_inner_pretty.js:349409`
- `nextPermissionModeForCycle` (obfuscated: `DyH`) - Shift+Tab cycle order, `cli_inner_pretty.js:540813`
- `computeCycleModeContext` (obfuscated: `Zb4`) - cycle + side effects, `cli_inner_pretty.js:540832`
- `canCycleToAuto` (obfuscated: `Wb4`) - auto-availability check, `cli_inner_pretty.js:540797`
- `transitionPermissionMode` (obfuscated: `tHH`) - mode-transition implementation, `cli_inner_pretty.js:422385`
- `MODE_INDICATOR_LIST` (obfuscated: `mO4`) - welcome-screen mode chip array, `cli_inner_pretty.js:464983`
- `ModeIndicatorTeaser` (obfuscated: `FO4`) - animated welcome mode preview, `cli_inner_pretty.js:464912`
- `cycleModeIndex` (obfuscated: `P25`) - simple cyclic index helper, `cli_inner_pretty.js:464953`
- `getModeColor` (obfuscated: `Cv`) - theme color resolver, `cli_inner_pretty.js:48491`

---

## Module Structure

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | End-to-end plan-mode lifecycle: enter → research → exit → approval. State machine, key data structures |
| [runtime_mechanism.md](./runtime_mechanism.md) | **NEW** — Per-turn reminder injection cycle (`d65`/`c65`), full/sparse/sub-agent text variants, attachment cadence, exit-attachment one-shot semantics, rejected-plan sentinel |
| [ui_components.md](./ui_components.md) | **NEW** — React/Ink UI: `ExitPlanModePermissionRequest` (`Tb4`) 5-option approval dialog, `EnterPlanModePermissionRequest`, tool-use pills (`rl7`/`lc7`/`nc7`), mode chip + Shift+Tab cycle, Ctrl+G external editor, `RejectedPlanMessage` (`tz8`) |
| [tool_interaction_matrix.md](./tool_interaction_matrix.md) | **NEW** — Exhaustive matrix of which tools the model can use in plan mode, full 10-layer gating pipeline in `VkH`, internal-path exemption (`iUH`), Bash read-only subset, MCP/Agent/AskUserQuestion handling |
| [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) | Deep deobfuscation of `EnterPlanModeTool` (`Q38`) — schema, gating, call body, follow-up instructions |
| [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) | Deep deobfuscation of `ExitPlanModeV2Tool` (`V2`) — disk read, edited-plan write-back, teammate fork, auto-mode gate fallback |
| [plan_file_naming.md](./plan_file_naming.md) | Plan-slug generation pipeline (`PDH`, `Sq6`, `nmH`); the prompt-seeded naming carried over from v2.1.111 |
| [approval_flow.md](./approval_flow.md) | User approval dialog, post-approval mode transition, 5-path acceptance UI |
| [hooks_integration.md](./hooks_integration.md) | How hooks (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`) participate in plan-mode transitions |
| [remote_sessions.md](./remote_sessions.md) | Plan file persistence for remote (CCR) sessions; transcript-mirrored snapshots and recovery |
| [ultraplan_integration.md](./ultraplan_integration.md) | Plan mode in Ultraplan/cloud contexts; the teleport sentinel; remote→local plan handoff |
| [permission_mode_persistence.md](./permission_mode_persistence.md) | **NEW for v2.1.142** — covers the v2.1.119 (`/plan` open), v2.1.132 (--permission-mode resume + plan-mode re-entry), v2.1.136 (plan-mode write block hardening) fixes |
| [cross_validation.md](./cross_validation.md) | v2.1.88 TypeScript ↔ v2.1.142 obfuscated cross-reference table |

---

## Architecture

```
                          PLAN MODE ARCHITECTURE (v2.1.142)
 ============================================================================

   Source locations:
   cli_inner_pretty.js:2949-2977   -- Session-flag declaration and getters/setters
                                      (HH$, OT, Cv8, qh, Oo, bv8, MT, xv8)
   cli_inner_pretty.js:143086-143087 -- ExitPlanMode constants (kZ, NZ)
   cli_inner_pretty.js:211429       -- EnterPlanMode constant (Q3H)
   cli_inner_pretty.js:381649-381847 -- ExitPlanModeV2Tool (V2) definition + body
   cli_inner_pretty.js:383798-383866 -- EnterPlanModeTool (Q38) definition + body
   cli_inner_pretty.js:397726-397757 -- buildPlanModeAttachment/Exit (d65, c65)
   cli_inner_pretty.js:483806-483854 -- /plan slash-command handler (Wv5)
   cli_inner_pretty.js:517632-517772 -- Plan-slug + plan-file utilities
                                      (PDH, haH, tg6, u74, v2, HW, RA8, $y4,
                                       ox5, ax5, u38)
   cli_inner_pretty.js:518202-518286 -- checkWritePermissionForTool (VkH) with
                                      v2.1.136 plan-mode write floor
   cli_inner_pretty.js:564219-564306 -- Session restore + permission-mode filter
                                      (ur5, nZ8) — v2.1.132 fix lives here
   cli_inner_pretty.js:421723-421725 -- d64 (decisionReason.type==="mode" check)
                                      — v2.1.136 plan_mode_floor classifier

 ============================================================================

  +--------------------------+       +-----------------------------+
  | User / Shift+Tab / Tool  |       |        Global AppState      |
  | /plan command (Wv5)      |       |  - mode: 'plan'             |
  +------------+-------------+       |  - prePlanMode: <saved>     |
               |                     |  - strippedDangerousRules?  |
               v                     |  hasExitedPlanMode (U$)     |
  +------------+-------------+       |  needsPlanModeExitAttachment|
  |  EnterPlanModeTool (Q38) |------>|  needsAutoModeExitAttachment|
  |  - throws if agentId     |       +-----------------------------+
  |  - Oo() mode transition  |
  |  - UkH() prepareCtxForPM |
  |  - Qz() applyPermUpdate  |
  +------------+-------------+
               |
               v
  +------------+-------------+       +-----------------------------+
  |  d65 (chunks ...) builds |       | First call to PDH(seed) is  |
  |  plan_mode attachment    |       | here. Slug = prompt-kebab + |
  |  every N turns           |       | adjective + noun.           |
  +------------+-------------+       +-----------------------------+
               |
               v
  +------------+--------------+
  | Read-only research phase  |
  | * Write/Edit blocked by   |
  |   VkH plan-mode floor     |
  |   (NEW in 2.1.136)        |
  | * model writes plan via   |
  |   internal-path allow     |
  | * persistFileSnapshotIfRemote
  +------------+--------------+
               |
               v
  +------------+--------------+      +----------------------------+
  | ExitPlanModeV2Tool (V2)   |      |  Branch A: teammate path   |
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

  Resume path (v2.1.132 fix):
  +-----------------------------------------------------+
  | --resume / --continue / --resume <id>               |
  |    ↓                                                |
  | nZ8(transcript, opts, { permissionModeCliSet })     |
  |    ↓                                                |
  | z = ur5(transcript.permissionMode, cliSet)          |
  |    ↓                                                |
  | if (cliSet) z = undefined  -- CLI wins              |
  | else if (transcript=='plan' or 'bypassPermissions')|
  |        z = undefined        -- transcript dropped   |
  | else z = transcript.permissionMode                  |
  |    ↓                                                |
  | initialState.toolPermissionContext.mode = z ??      |
  |   (CLI permission mode produced by zR6)             |
  +-----------------------------------------------------+
```

---

## Plan-Mode Lifecycle (Linear Summary)

1. **Entry**: `EnterPlanModeTool.call()` calls `Oo(prevMode, 'plan')` which flips `U$.needsPlanModeExitAttachment` if leaving plan mode. Then `setToolPermissionContext` updates the mode to `'plan'`, optionally stripping dangerous-permission rules via `UkH` (`prepareContextForPlanMode`).
2. **System reminder cycle**: `d65` (`buildPlanModeAttachment`) is invoked by the attachment loader on each turn. It calls `PDH(sessionId, planSlugSeed ?? prompt)` on first invocation per session, fixing the plan file path. It returns either a `plan_mode_reentry` attachment (when `hasExitedPlanMode` is set from a prior cycle) or a `plan_mode` attachment alternating `full`/`sparse` reminder types.
3. **Research**: The model uses read-only tools (Grep, Glob, Read, AskUserQuestion). Writes are blocked by the **v2.1.136 plan-mode floor**: `VkH` short-circuits with `behavior:"ask", decisionReason:{type:"mode", mode:"plan"}` *after* safety checks but *before* allow-rule consultation, so even an `Edit(/path/**)` allow rule cannot bypass plan-mode enforcement. The plan file itself is exempt via the `checkEditableInternalPath` (`iUH`) bypass.
4. **Exit**: `ExitPlanModeV2Tool.call()` reads the plan from disk via `HW(agentId)`, asks the user to approve via the permission UI (or auto-allows for teammates), then transitions `mode` back to `prePlanMode` (with the auto-mode gate-fallback safeguard inherited from v2.1.112).
5. **Post-exit**: `OT(true)` (sets `hasExitedPlanMode`) and `qh(true)` (sets `needsPlanModeExitAttachment`) so the next attachment cycle emits a `plan_mode_exit` reminder. The tool_result content includes the full plan text so the model can immediately resume implementation work without re-reading the file.
6. **Re-entry (v2.1.132)**: If the model calls `EnterPlanMode` again after exit, `Oo('any', 'plan')` triggers and clears `needsPlanModeExitAttachment`. The attachment builder (`d65`) detects `HH$()` (= `hasExitedPlanMode === true`) and emits a `plan_mode_reentry` attachment instead of a fresh `plan_mode` attachment, then resets `OT(!1)`. Prior to v2.1.132 the re-entry was lost because the transcript-saved mode dropped `'plan'` and there was no separate signal for re-entry.

---

## Cross-Cutting Concerns

- **Subagent containment**: `EnterPlanMode` throws if `context.agentId` is truthy — subagents may NOT enter plan mode independently. Teammates instead inherit `plan` from the leader at spawn time (gated by `plan_mode_required`).
- **Teammate approval mailbox**: Inside `ExitPlanModeV2Tool.call`, when `isTeammate() && isPlanModeRequired()`, the plan is posted to the team lead's mailbox as a `plan_approval_request` with a generated `requestId`. The teammate then waits for an `approve`/`reject` response in its inbox.
- **Channels gate (refined)**: When `--channels` is active (`jj().length > 0`) AND the session is a background-agent worker (`T6()`), both tools are `isEnabled() === false`. v2.1.112 only gated on `--channels`; v2.1.142 adds the `T6()` background-session predicate (paired with `claude agents` flag additions).
- **Edited-plan write-back**: If the user edits the plan in the CCR web UI or via Ctrl+G external editor, the edited plan flows back through `permissionResult.updatedInput.plan` to `call()`. The tool writes the edited content back to the plan file with `writeFile()` and calls `u38()` (`persistFileSnapshotIfRemote`) so remote sessions can recover it.
- **Auto-mode interaction**: `prePlanMode === 'auto'` is a special case. On exit, the tool checks the auto-mode gate (`isAutoModeGateEnabled()`) before restoring auto. If the gate has been tripped (circuit breaker), it restores to `'default'` and emits a user-visible warning notification with key `auto-mode-gate-plan-exit-fallback` (inherited from v2.1.112).
- **Plan-mode floor for writes (NEW in v2.1.136)**: `VkH` (`checkWritePermissionForTool`) enforces plan-mode read-only-ness regardless of `Edit(...)` allow rules. The order in v2.1.142 is: deny rules → memory toggle → `.claude/**` session-allow (only when NOT in plan mode) → ask rules → internal editable paths → safety checks → **plan-mode floor (NEW)** → acceptEdits mode → allow rules → default ask. The plan-mode floor returns `decisionReason: { type: "mode", mode: "plan" }` so downstream auto-mode classifiers can detect and skip it (`d64` predicate).
- **--permission-mode CLI persistence (NEW in v2.1.132)**: When `--resume` / `--continue` is invoked with `--permission-mode <mode>`, the CLI flag wins over the transcript-saved mode. The mechanism: `permissionModeCliSet: P !== void 0 || Boolean(w)` is threaded into `nZ8`, which passes it to `ur5(transcript.permissionMode, cliSet)`. When `cliSet === true`, `ur5` returns `undefined` (don't restore from transcript) and the initial-state `mode` produced by `zR6({permissionModeCli, ...})` is used instead.

---

## Source Cross-Validation

All readable names come from the v2.1.88 unobfuscated TypeScript source at:

- `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/` (EnterPlanModeTool.ts, prompt.ts, constants.ts, UI.tsx)
- `/lyz/codespace/3rd/claude-code/src/tools/ExitPlanModeTool/` (ExitPlanModeV2Tool.ts, prompt.ts, constants.ts, UI.tsx)
- `/lyz/codespace/3rd/claude-code/src/utils/plans.ts`
- `/lyz/codespace/3rd/claude-code/src/utils/planModeV2.ts`
- `/lyz/codespace/3rd/claude-code/src/utils/permissions/filesystem.ts` (`checkWritePermissionForTool`, `checkEditableInternalPath`)
- `/lyz/codespace/3rd/claude-code/src/utils/permissions/permissionSetup.ts` (auto-mode gating, `prepareContextForPlanMode`)
- `/lyz/codespace/3rd/claude-code/src/components/messages/PlanApprovalMessage.tsx`
- `/lyz/codespace/3rd/claude-code/src/components/messages/UserPlanMessage.tsx`
- `/lyz/codespace/3rd/claude-code/src/components/permissions/EnterPlanModePermissionRequest/`
- `/lyz/codespace/3rd/claude-code/src/components/permissions/ExitPlanModePermissionRequest/`

Every obfuscated symbol cited in this module has been traced to a v2.1.142 location in `cli_inner_pretty.js` and matched 1:1 with its v2.1.88 counterpart unless explicitly flagged as a v2.1.142-only addition in the symbol additions file or the [permission_mode_persistence.md](./permission_mode_persistence.md) deltas.
