# Plan Mode Module (12_plan_mode) — Claude Code v2.1.156

> **Scope / Source.** This README is the module entry point for the plan-mode subsystem as it ships
> in Claude Code **v2.1.156**. It synthesizes the six area documents in this directory (plus the two
> `AskUserQuestion` docs in `../04_tools/`). Every claim is grounded in the pretty-printed obfuscated
> bundle `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
> (cited as `cli_inner_pretty.js:<line>`; all line numbers were read and verified in this build).
> Readable names are recovered from the v2.1.88 unobfuscated TypeScript precursor under
> `/lyz/codespace/3rd/claude-code/src/{tools/EnterPlanModeTool,tools/ExitPlanModeTool,tools/AskUserQuestionTool,utils/plans.ts,utils/planModeV2.ts,utils/ultraplan}/`
> and are used for cross-validation only — they are NOT evidence for v2.1.156 behavior, which is taken
> from the bundle itself. The v2.1.142 README was used as a structure/format reference; all content
> here is re-grounded in v2.1.156.

---

## TL;DR — Plan Mode + AskUserQuestion as Shipped in v2.1.156

**Plan mode** is one value (`"plan"`) of the single six-mode permission enum
(`EXTERNAL_PERMISSION_MODES`, obfuscated `st`, `cli_inner_pretty.js:49174`). It is not a parallel
subsystem — the entire permission engine is parameterized over `mode`, so plan mode reuses every
existing decision surface. Its *enforcement* is a single line in the write-permission checker:
after deny-rules, allow-rules, ask-rules, the plan-file exemption, and the dangerous-path safety
check have all had their say, plan mode universally downgrades any remaining write to `ask`
(`checkWritePermissionForTool`, obfuscated `ChH`, floor at `cli_inner_pretty.js:549873`). Reads are
run with `mode` rewritten to `"default"` (`cli_inner_pretty.js:549790`), so plan mode floors writes
without ever restricting reads — a two-line encoding of "read-only exploration."

The user-visible lifecycle is the **two-tool pair** plus a clarification tool:

- **`EnterPlanMode`** (obfuscated `hL8`, `cli_inner_pretty.js:349703-349766`) — a deferred,
  read-only, parameterless tool that flips the session into plan mode (`{type:"setMode",
  mode:"plan", destination:"session"}`), snapshots the prior mode into `prePlanMode`, and re-injects
  a 6-step read-only workflow into its `tool_result`. It hard-**throws** in subagent contexts so plan
  mode can never become an unexitable trap.
- **`ExitPlanMode`** (obfuscated `JC`, `cli_inner_pretty.js:350025-350220`) — the approval handshake.
  The defining choice: **the plan is read from disk, not passed as a parameter** — the runtime injects
  `plan`/`planFilePath` from the on-disk plan file before the tool runs. Its `call()` restores
  `prePlanMode` (with an auto-mode circuit-breaker fallback), emits a `## Approved Plan:` marker that
  doubles as a machine-parseable contract for the remote (Ultraplan) consumer, and forks to a
  team-lead mailbox when a required-plan-mode teammate exits.
- **`AskUserQuestion`** (obfuscated `YtH`, `cli_inner_pretty.js:348809-348933`) — presents 1–4
  multiple-choice questions while planning. In v2.1.156 its base prompt was narrowed and rewritten so
  plan *entry* routes to the new `EnterPlanMode` tool while plan *approval* stays on `ExitPlanMode`;
  it explicitly forbids asking "Is my plan ready?" because the user cannot see the plan until
  `ExitPlanMode` renders it.

**The v2.1.156 story is convergence and de-flagging.** Across the whole region, the KAIROS/interview
experiment plumbing was removed: `isEnabled` on both plan tools dropped its `feature('KAIROS')`
predicate for a pure capability gate (`channels active && non-interactive`); the prompt's
`USER_TYPE === "ant"` fork and the `isPlanModeInterviewPhaseEnabled()` conditional were deleted (0
grep hits remain); and three genuinely new behaviors landed: (1) a **seeded, human-readable plan-file
slug** derived from the user's prompt (`add-user-auth-bright-otter.md`); (2) a **shell-alias branch**
in the What-Happens prompt that surfaces `find`/`grep` only for interactive bash sessions; and (3) a
**customizable plan-mode reminder body** via `--plan-mode-instructions` with the read-only preamble
and `ExitPlanMode` protocol footer always preserved.

---

## Overview

Plan mode is Claude Code's "Plan → Approve → Implement" safety pattern: it restricts the agent to
read-only exploration of the codebase and forces a structured workflow before any implementation.
The user enters plan mode three ways — the model calls `EnterPlanMode`, the user presses `Shift+Tab`
to cycle the permission mode, or via the `/plan` slash command — and leaves it only through the
`ExitPlanMode` approval dialog (or `Shift+Tab` again).

The subsystem decomposes into five concerns, each owned by a different region of the bundle, that
share only a *vocabulary* (the mode identifiers and the chip config) rather than shared code paths:

1. **The two tools** — `EnterPlanMode` and `ExitPlanMode`, the model-callable levers.
2. **The runtime mechanism** — the permission-mode metadata, the session-state flags, the write
   floor, the seeded plan-file naming, the per-turn reminder cadence, and resume reconciliation.
3. **The UI / approval flow** — tool-result rendering, the "Ready to code?" approval dialog with its
   variable-arity option list, the choice→permission mapping, in-dialog keys, and the `Shift+Tab`
   mode cycle.
4. **Remote / Ultraplan** — plan mode run inside a Claude-Code-on-the-web container, with the local
   CLI degraded to a poller of the remote event stream, the `__ULTRAPLAN_TELEPORT_LOCAL__` handoff
   sentinel, and the swappable reminder body.
5. **`AskUserQuestion`** — the mid-plan clarification tool, covered in `../04_tools/`.

The architectural through-line is that **plan mode is a permission mode, not a feature flag**: the
same `mode === "plan"` signal that floors writes also upgrades the model (opusplan → Opus,
`cli_inner_pretty.js:98735`), suppresses prompt suggestions (`cli_inner_pretty.js:240792`), keeps
`ExitPlanMode` available (`cli_inner_pretty.js:278956`), and is intentionally *not* persisted across
`--resume` (`cli_inner_pretty.js:598936`). No separate "is planning" boolean is threaded anywhere.

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools, Agent Loop, LLM API, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Plan Mode, Compact, Hooks, Skills)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Permissions, Model, Prompt, Telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (UI, Chrome, IDE)

Key symbols in this module (curated; verified against the area docs and the bundle):

**Tool names & objects**
- `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `og`) — `"EnterPlanMode"` — `cli_inner_pretty.js:143385`
- `EXIT_PLAN_MODE_TOOL_NAME` (obfuscated: `oG`/`wv`) — `"ExitPlanMode"` (legacy + V2 alias, same string) — `cli_inner_pretty.js:143386-143387`
- `ASK_USER_QUESTION_TOOL_NAME` (obfuscated: `ez`) — `"AskUserQuestion"` — `cli_inner_pretty.js:143388`
- `EnterPlanModeTool` (obfuscated: `hL8`) — the tool descriptor object — `cli_inner_pretty.js:349703-349766`
- `ExitPlanModeV2Tool` (obfuscated: `JC`) — the `buildTool` exit object — `cli_inner_pretty.js:350025-350220`
- `AskUserQuestionTool` (obfuscated: `YtH`) — the question tool object — `cli_inner_pretty.js:348809-348933`
- `buildTool` (obfuscated: `yK`) — tool factory merging def over `P45` defaults — `cli_inner_pretty.js:143482-143484`

**Runtime mechanism**
- `EXTERNAL_PERMISSION_MODES` (obfuscated: `st`) — the six-mode list (incl. `"plan"`) — `cli_inner_pretty.js:49174`
- `PERMISSION_MODE_METADATA` (obfuscated: `xEq`) — title/symbol/color table (plan entry `49230`) — `cli_inner_pretty.js:49228-49253`
- `checkWritePermissionForTool` (obfuscated: `ChH`) — THE WRITE FLOOR (plan gate at `549873`) — `cli_inner_pretty.js:549806-549890`
- `checkInternalEditablePath` (obfuscated: `WlH`) — plan-file/scratchpad/bg exemption — `cli_inner_pretty.js:549939-549997`
- `isPlanFileForCurrentSession` (obfuscated: `b$9`) — session-scoped plan-file path test — `cli_inner_pretty.js:549461-549467`
- `prepareContextForPlanMode` (obfuscated: `xhH`) — captures `prePlanMode` + auto-mode prep — `cli_inner_pretty.js:443097-443112`
- `transitionPermissionMode` (obfuscated: `vl`) — central mode-transition funnel — `cli_inner_pretty.js:442777-442791`
- `handlePlanModeTransition` (obfuscated: `Tt`) — toggles `needsPlanModeExitAttachment` — `cli_inner_pretty.js:3047-3050`
- `getPlanSlug` (obfuscated: `ILH`) — seeded, collision-avoiding plan slug (NEW seed param) — `cli_inner_pretty.js:549223-549238`
- `slugifyPromptSeed` (obfuscated: `MM6`) / `generateTwoWordSuffix` (obfuscated: `wgH`) — NEW slug helpers — `cli_inner_pretty.js:141346-141362`
- `getPlanFilePath` (obfuscated: `wV`) / `getPlan` (obfuscated: `DV`) — plan path/read — `cli_inner_pretty.js:549248-549261`
- `PLAN_MODE_CADENCE` (obfuscated: `lg6`) — `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}` — `cli_inner_pretty.js:414015`
- `buildPlanModeAttachment` (obfuscated: `eS_`) — per-turn reminder builder — `cli_inner_pretty.js:412847-412870`
- `reconcileRestoredPermissionMode` (obfuscated: `Vyz`) — drops plan/bypass on resume — `cli_inner_pretty.js:598936-598953`
- `getMainLoopModelForPermissionMode` (obfuscated: `VT`) — opusplan/haiku plan model switch — `cli_inner_pretty.js:98735-98740`

**UI & approval flow**
- `ExitPlanModePermissionRequest` (obfuscated: `mA9`) — the "Ready to code?" dialog — `cli_inner_pretty.js:589878-590475`
- `buildPlanApprovalOptions` (obfuscated: `Gkz`) — variable-arity option list (bypass>auto>edits) — `cli_inner_pretty.js:589794-589824`
- `getApprovalResult` (obfuscated: `_I8`) — pure choice→PermissionResult mapping — `cli_inner_pretty.js:589839-589877`
- `getNextPermissionMode` (obfuscated: `QCH`) — `Shift+Tab` cycle order (ant branch removed) — `cli_inner_pretty.js:578712-578730`
- `canCycleToAuto` (obfuscated: `PR8`) — three-signal auto-mode gate — `cli_inner_pretty.js:578696-578711`
- `renderExitPlanModeResult` (obfuscated: `_$4`) — 3-state tool-result render — `cli_inner_pretty.js:349843-349900`
- `getModeColor` (obfuscated: `tV`) — mode → theme color — `cli_inner_pretty.js:49218-49220`

**Remote / Ultraplan**
- `ExitPlanModeScanner` (obfuscated: `kU4`) — pure CCR-event approval classifier — `cli_inner_pretty.js:503138-503189`
- `pollForApprovedExitPlanMode` (obfuscated: `NU4`) — the 3s poll loop — `cli_inner_pretty.js:503190-503245`
- `extractApprovedPlan` (obfuscated: `B4z`) — `## Approved Plan:` scraper (the contract) — `cli_inner_pretty.js:503257-503272`
- `ULTRAPLAN_TELEPORT_SENTINEL` (obfuscated: `u4z`) — `"__ULTRAPLAN_TELEPORT_LOCAL__"` — `cli_inner_pretty.js:503276`
- `isUltraplanEnabled` (obfuscated: `cqH`) — three-way enable gate — `cli_inner_pretty.js:503294-503296`
- `persistFileSnapshotIfRemote` (obfuscated: `CL8`) — remote-only plan snapshot — `cli_inner_pretty.js:549341-549363`

**Shared gates**
- `getAllowedChannels` (obfuscated: `uw`) — `--channels` allow-list — `cli_inner_pretty.js:3217-3219`
- `isNonInteractive` (obfuscated: `R6`) — `!isInteractive` — `cli_inner_pretty.js:2742-2744`
- `isTeammate` (obfuscated: `FA`) — subagent/team detection — `cli_inner_pretty.js:99280-99283`
- `isPlanModeRequired` (obfuscated: `NY$`) — required-vs-voluntary plan mode — `cli_inner_pretty.js:99289-99294`

---

## Module Structure

| Document | Focus | Key symbols |
|----------|-------|-------------|
| [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) | Deep deobfuscation of `EnterPlanMode` (`hL8`): the parameterless schema, the subagent throw, the `isEnabled` capability gate, the transition→prepare→setMode `call()` lifecycle, the NEW `find`/`grep` shell-alias prompt branch, and the read-only result footer | `hL8`, `xhH`, `Tt`, `nY`, `ZL_`, `GL_`, `K0$` |
| [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) | Deep deobfuscation of `ExitPlanMode` (`JC`): why the plan is read from disk (`dH4`), the teammate→team-lead mailbox fork, the auto-mode circuit-breaker fallback, mode restore + dangerous-perms reconciliation, the four `tool_result` branches, and the no-op `allowedPrompts` Bash pre-authorization | `JC`, `dH4`, `i9q`/`jwH`, `aA`, `ou6`, `B4z` |
| [runtime_mechanism.md](./runtime_mechanism.md) | What actually runs in plan mode: permission-mode metadata, session-state flags, the write floor (`ChH`) ordering and `.claude/**` carve-out, the plan-file exemption, the NEW seeded slug algorithm, the per-turn reminder cadence, opusplan model switch, and resume reconciliation (`Vyz`) | `st`, `xEq`, `ChH`, `WlH`, `ILH`, `lg6`, `eS_`, `VT`, `Vyz` |
| [ui_and_approval_flow.md](./ui_and_approval_flow.md) | User-facing surfaces: 3-state result rendering (`_$4`), the "Ready to code?" approval dialog (`mA9`), the bypass>auto>edits priority flip in `buildPlanApprovalOptions` (`Gkz`), the extracted pure `getApprovalResult` (`_I8`), in-dialog keys (ctrl+g / shift+tab), the `Shift+Tab` cycle (`QCH`, ant branch removed), the 800ms auto opt-in hold, and mode-chip theming | `_$4`, `mA9`, `Gkz`, `_I8`, `QCH`, `PR8`, `vl`, `xEq` |
| [remote_and_ultraplan.md](./remote_and_ultraplan.md) | Remote (CCR) plan mode: the enable gate (`cqH`), the `/ultraplan` command, the three remote-planning reminders, the pure approval scanner (`kU4`) and poll loop (`NU4`), the teleport sentinel, the `## Approved Plan:` marker contract (`B4z`), and the swappable reminder body (`--plan-mode-instructions`) | `kU4`, `NU4`, `B4z`, `u4z`, `cqH`, `CL8`, `bQ_` |
| [../04_tools/ask_user_question_tool.md](../04_tools/ask_user_question_tool.md) | Full `AskUserQuestion` (`YtH`): constants, Zod schemas (incl. the NEW multi-select join `YL_`), the narrowed base prompt and rewritten plan-mode note, the channels/interactivity `isEnabled` gate, the preview feature + HTML validation, the three runtime outcomes (accept/respond/reject), and the `"(notes only)"` sentinel | `YtH`, `xM6`, `YL_`, `INz`, `BNz`/`pNz`, `Bu6` |
| [../04_tools/ask_user_question_reservation.md](../04_tools/ask_user_question_reservation.md) | The lean-model reservation paragraph (`FUK`) injected by `prompt(model)`, the `X3` lean-prompt gate, and the `tengu_cinder_plover` experiment override | `FUK`, `X3`, `tengu_cinder_plover` |
| [cross_validation.md](./cross_validation.md) | Consolidated v2.1.88 → v2.1.156 behavioral diff for every subsystem (EnterPlanMode, ExitPlanMode, plan runtime/state, plan-file naming, write floor, UI/approval, AskUserQuestion, remote/ultraplan), with per-row v2.1.88 `file:line` ↔ v2.1.156 `cli_inner_pretty.js:line` and an overall confidence assessment | (diff tables) |

> **Note on cross-validation.** The v2.1.88 → v2.1.156 behavioral diff is documented in two
> complementary places: (1) a dedicated cross-version section *inside* each area doc
> (`enter_plan_mode_tool.md` §12, `exit_plan_mode_tool.md` §16, `runtime_mechanism.md` §12,
> `ui_and_approval_flow.md` §13, `remote_and_ultraplan.md` §10), and (2) the **consolidated
> [cross_validation.md](./cross_validation.md)** that rolls all subsystems into one place. Each row
> is grounded in the named v2.1.88 TypeScript precursor and re-verified against the 2.1.156 bundle.

---

## Architecture

```
                       PLAN MODE ARCHITECTURE (v2.1.156)
 ============================================================================
   Source anchors (all verified in cli_inner_pretty.js):
   49174            -- EXTERNAL_PERMISSION_MODES (st): the six-mode enum incl. "plan"
   49228-49253      -- PERMISSION_MODE_METADATA (xEq): plan chip = title/⏸/planMode color
   143385-143388    -- tool-name constants (og/oG/wv/ez)
   3035-3050        -- session-state cluster (m7$/zQ, Rm8/Gt, Tt)
   349703-349766    -- EnterPlanModeTool (hL8) descriptor + call()
   350025-350220    -- ExitPlanModeV2Tool (JC) descriptor + call() + mapToolResult
   442777-442791    -- transitionPermissionMode (vl): the single mode funnel
   443097-443112    -- prepareContextForPlanMode (xhH): snapshots prePlanMode
   549806-549890    -- checkWritePermissionForTool (ChH): THE WRITE FLOOR (gate @549873)
   549939-549997    -- checkInternalEditablePath (WlH): plan-file exemption
   549223-549238    -- getPlanSlug (ILH): NEW seeded slug
   412847-412870    -- buildPlanModeAttachment (eS_) + cadence lg6 @414015
   578712-578730    -- getNextPermissionMode (QCH): Shift+Tab cycle
   589794-590475    -- approval dialog (mA9), options (Gkz), result map (_I8)
   503140-503277    -- Ultraplan scanner (kU4), poller (NU4), marker (B4z), sentinel (u4z)
   598936-598953    -- reconcileRestoredPermissionMode (Vyz): drop plan/bypass on resume
 ============================================================================

  ENTRY (3 paths)                          GLOBAL SESSION STATE (d$)
  +---------------------------+            +-----------------------------+
  | model: EnterPlanMode (hL8)|            |  toolPermissionContext:     |
  | user:  Shift+Tab (QCH)    |----------->|    mode: "plan"             |
  | cmd:   /plan              |            |    prePlanMode: <saved>     |
  +-------------+-------------+            |    strippedDangerousRules?  |
                |                          |  hasExitedPlanMode (m7$/zQ) |
                v                          |  needsPlanModeExitAttachment|
  +-------------+-------------+            |    (Rm8/Gt, toggled by Tt)  |
  | call(): subagent throw,   |            +-----------------------------+
  | xhH() snapshot prePlanMode|                       ^
  | nY() setMode "plan"       |                       |
  +-------------+-------------+        +---------------+----------------+
                |                      | First plan_mode attachment     |
                v                      | (eS_) calls ILH(seed) here ->  |
  +-------------+-------------+        | slug = kebab(prompt)-adj-noun  |
  | READ-ONLY RESEARCH PHASE  |        | cadence lg6: 1 per 5 turns,    |
  | * writes floored to "ask" |        | every 5th reminder is "full"   |
  |   by ChH @549873 (after   |        +--------------------------------+
  |   deny/safety, before     |
  |   acceptEdits/workingDir) |        +--------------------------------+
  | * reads run as "default"  |        | opusplan -> Opus while planning|
  |   @549790 (never floored)  |        |   (VT @98735, <200k tokens)    |
  | * plan FILE exempt via    |        | prompt suggestions suppressed  |
  |   WlH/b$9 @549942         |        |   (gv6 @240792)                |
  | * model writes plan incr. |        +--------------------------------+
  +-------------+-------------+
                |
                v
  +-------------+-------------+        +--------------------------------+
  | EXIT: ExitPlanMode (JC)   |        | TEAMMATE FORK: FA() && NY$()   |
  | normalizeToolInput (dH4)  +------->| post plan_approval_request to  |
  |  injects plan FROM DISK   |        | "team-lead" mailbox (aA),      |
  | validateInput: mode==plan |        | mark awaitingPlanApproval(ou6),|
  |  (teammates bypass)       |        | return awaitingLeaderApproval  |
  | checkPermissions: "ask"   |        +--------------------------------+
  +-------------+-------------+
                |  (MAIN branch: local exit)
                v
  +-------------+-------------+        +--------------------------------+
  | auto-gate fallback: if    |        | APPROVAL DIALOG (mA9 @589878)  |
  | prePlanMode=="auto" but   |        | "Ready to code?" + plan body   |
  | gate off -> "default" +   |        | options (Gkz): bypass>auto>    |
  | warning notification      |        | edits, +clear-context, +ultra, |
  | restore prePlanMode,      |<-------+ +"keep planning" feedback row   |
  | strip/restore dangerous   |        | choice->result: _I8 (pure)     |
  | rules, telemetry t1H      |        | keys: ctrl+g edit, shift+tab=  |
  +-------------+-------------+        |   accept-edits                 |
                |                      +--------------------------------+
                v
  +-------------+-------------+
  | tool_result (mapToolResult|        +--- REMOTE / ULTRAPLAN ---------+
  | @350169): 4 branches.     |        | local CLI = POLLER only.       |
  | Approved branch emits     |        | NU4 polls SDKMessage[] @3s;    |
  | "## Approved Plan:\n<plan>"+------->| kU4 classifies approved>       |
  | <- machine contract for   |        |  terminated>rejected>pending;  |
  |    B4z (remote consumer)  |        | B4z scrapes "## Approved Plan:" |
  +---------------------------+        | teleport: deny w/ u4z sentinel |
                                       +--------------------------------+

  RESUME (Vyz @598936): plan & bypassPermissions are DELIBERATELY DROPPED.
  +--------------------------------------------------------------------+
  | --resume/--continue:                                               |
  |   if (--permission-mode set)            -> undefined (CLI wins)    |
  |   if (restored mode in {plan, bypass})  -> undefined (DROPPED)     |
  |   if (auto && gate off)                 -> undefined               |
  |   else                                  -> restore acceptEdits/etc |
  | The plan FILE is still recoverable (snapshot/history); the MODE is |
  | not. State is ephemeral; the artifact is durable.                  |
  +--------------------------------------------------------------------+
```

---

## Plan-Mode Lifecycle (Linear Walkthrough)

The numbered walkthrough below traces a single plan-mode session end to end. Each step names the
function that runs and the area doc with the deep analysis.

**1. Entry.** The model emits `{"name":"EnterPlanMode","input":{}}` (or the user presses `Shift+Tab`
to `acceptEdits → plan`, or runs `/plan`). The tool's `call()` (`hL8`,
`cli_inner_pretty.js:349736-349748`) first **throws** if `context.agentId` is set — subagents cannot
enter plan mode, because the only exit (`ExitPlanMode`'s approval dialog) needs a human at a terminal,
and a headless subagent would be trapped. It then runs `handlePlanModeTransition` (`Tt`,
`cli_inner_pretty.js:3047-3050`) to clear any pending exit-attachment flag, and in a single atomic
`setToolPermissionContext` call composes `prepareContextForPlanMode` (`xhH`,
`cli_inner_pretty.js:443097`) — which snapshots the *current* mode into `prePlanMode` so exit can
restore it — *before* `applyPermissionUpdate` (`nY`) sets `mode = "plan"`. The order is load-bearing:
if `setMode` ran first, `xhH`'s `if (prev === "plan") return ctx` guard would short-circuit and
restore-on-exit would break. *(See `enter_plan_mode_tool.md` §3, §6.)*

**2. The plan-file slug is fixed (lazily).** On the first plan-mode `<system-reminder>` attachment,
`buildPlanModeAttachment` (`eS_`, `cli_inner_pretty.js:412847`) calls `getPlanSlug` (`ILH`,
`cli_inner_pretty.js:549223`) with the user's prompt as a seed. NEW in v2.1.156: the slug is now
human-readable — `slugifyPromptSeed` (`MM6`) kebab-cases the first four prompt words and
`generateTwoWordSuffix` (`wgH`) appends a random `adjective-noun` for collision avoidance, yielding
`add-user-auth-bright-otter.md` instead of the old opaque `wise-ancient-otter.md`. An `existsSync`
retry loop (≤10, unchanged from v2.1.88) and a per-session cache guarantee uniqueness and stability.
*(See `runtime_mechanism.md` §6.)*

**3. Read-only research phase.** The model explores with `Glob`/`Grep`/`Read` and writes its plan
incrementally to the plan file. Writes to anything else are floored: `checkWritePermissionForTool`
(`ChH`, `cli_inner_pretty.js:549873`) downgrades every remaining write to `behavior:"ask"` with
`decisionReason:{type:"mode", mode:"plan"}` — but only *after* deny-rules, allow-rules, ask-rules, the
plan-file exemption, and the dangerous-path safety check have run, so high-priority semantics are
preserved and the plan file itself stays writable (via `checkInternalEditablePath`/`WlH`). Reads are
unaffected because the read path rewrites `mode` to `"default"` before delegating
(`cli_inner_pretty.js:549790`). A per-turn reminder re-anchors the model on a 5-turn cadence with
every 5th reminder being the full 5-phase protocol (`PLAN_MODE_CADENCE`/`lg6`). If the model needs to
choose between approaches, it calls **`AskUserQuestion`** — *not* to ask "Is my plan ready?", which the
prompt forbids since the user cannot see the plan yet. *(See `runtime_mechanism.md` §4–§8;
`../04_tools/ask_user_question_tool.md` §8.)*

**4. Exit request.** The model calls `ExitPlanMode` (`JC`) with an essentially empty input. Before
`call()` runs, `normalizeExitPlanModeToolInput` (`dH4`, `cli_inner_pretty.js:349140`) injects `plan`
and `planFilePath` **from disk** — the plan is never a tool parameter, which is what guarantees the
approved artifact is exactly the file the user reviewed (tamper resistance), keeps the tool argument
cheap (token economy), and auto-reflects out-of-band edits. `validateInput` rejects the call if
`mode !== "plan"` (teammates bypass this), naming `EnterPlanMode` in the recovery message. *(See
`exit_plan_mode_tool.md` §2, §4.)*

**5a. Approval dialog (the common case).** `checkPermissions` returns `behavior:"ask"`, surfacing the
`ExitPlanModePermissionRequest` dialog (`mA9`, `cli_inner_pretty.js:589878`) titled **"Ready to
code?"** with the rendered plan and a variable-arity option list built by `buildPlanApprovalOptions`
(`Gkz`). The elevated "Yes" options prioritize **bypass > auto > accept-edits** (a v2.1.156 flip from
v2.1.88's auto-first ordering). The chosen value maps to a `PermissionResult` through the extracted
*pure* function `getApprovalResult` (`_I8`, `cli_inner_pretty.js:589839`), while the React handler
owns the store side-effects (re-injecting the plan on clear-context, activating auto). `ctrl+g` opens
the plan in an external editor (threading the edit back via `planEditedLocally`), and `shift+tab`
quick-approves with accept-edits. *(See `ui_and_approval_flow.md` §4–§7.)*

**5b. Teammate fork (alternative).** If a *required-plan-mode* teammate (`isTeammate() &&
isPlanModeRequired()`) exits, it does not exit locally: it posts a `plan_approval_request` to the
`team-lead` mailbox (`writeToMailbox`/`aA`), marks its task `awaitingPlanApproval` (`ou6`), and returns
`awaitingLeaderApproval:true`. This routes every required teammate's plan through one chokepoint the
lead controls, using crash-safe mailbox files rather than a synchronous RPC. *(See
`exit_plan_mode_tool.md` §7.)*

**6. Mode restore + reconciliation.** On local approval, `call()`'s MAIN branch runs the **auto-mode
circuit-breaker fallback**: if `prePlanMode` was `"auto"` but the auto-mode gate is now disabled,
restoring auto would launder away a tripped breaker, so it falls back to `"default"` with a warning
notification. It then sets `hasExitedPlanMode`/`needsPlanModeExitAttachment`, restores the saved
`prePlanMode` (atomically, inside one `setToolPermissionContext`), reconciles dangerous-permission
rules (strip if re-entering auto, restore if leaving it), emits `permission_mode_changed` telemetry
with `trigger:"exit_plan_mode"`, and computes `hasTaskTool` to decide whether to suggest `TeamCreate`.
*(See `exit_plan_mode_tool.md` §8–§10.)*

**7. Result emission.** `mapToolResultToToolResultBlockParam` (`cli_inner_pretty.js:350169`) chooses
one of four branches. The approved branch echoes the **full plan text** under a `## Approved Plan:`
(or `## Approved Plan (edited by user):`) heading. That marker is not decoration — it is a
machine-parseable contract that the remote Ultraplan consumer `extractApprovedPlan` (`B4z`,
`cli_inner_pretty.js:503257`) string-matches to recover the plan; a missing marker throws a diagnostic
error naming the two producer branches (empty-plan / isAgent) that omit it. *(See
`exit_plan_mode_tool.md` §11; `remote_and_ultraplan.md` §7.)*

**8. (Remote variant) Ultraplan.** When planning runs in a Claude-Code-on-the-web container, the local
CLI never runs the model — it polls the remote `SDKMessage[]` stream every 3s
(`pollForApprovedExitPlanMode`/`NU4`) and infers the verdict with a pure classifier
(`ExitPlanModeScanner`/`kU4`) whose precedence is `approved > terminated > rejected > pending`. The
user can yank the plan back to the terminal by overloading a *rejection* whose feedback begins with
the `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel (`u4z`). *(See `remote_and_ultraplan.md` §4–§8.)*

**9. Resume (the deliberate non-restore).** If the session is later resumed,
`reconcileRestoredPermissionMode` (`Vyz`, `cli_inner_pretty.js:598936`) returns `undefined` for both
`"plan"` and `"bypassPermissions"` — they are intentionally *not* restored, so a user resuming to
*implement* an approved plan is not surprised by re-entering read-only mode, and the most dangerous
mode is never silently re-granted. The plan *file* remains recoverable via snapshot/message-history;
only the mode is ephemeral. *(See `runtime_mechanism.md` §9.)*

---

## Cross-Cutting Concerns

- **Plan mode is never a trap.** Two layers enforce this: `isEnabled` on *both* tools disables them
  when `getAllowedChannels().length > 0 && isNonInteractive()` (no terminal for the exit dialog), and
  `EnterPlanMode.call()` hard-throws in subagent contexts. The enable conditions of the two tools are
  kept in lockstep so plan mode is always escapable.
- **The disk is the single source of truth for the plan.** Entry never writes a plan; the model writes
  it incrementally to the exempt plan file; `ExitPlanMode` reads it back via `dH4`; edits (CCR web or
  `ctrl+g`) flow through `permissionResult.updatedInput.plan` and are re-snapshotted. State (the mode)
  is ephemeral across resume; the artifact (the plan) is durable.
- **De-flagging / convergence.** v2.1.156 removed the KAIROS feature-flag predicate from `isEnabled`,
  the `USER_TYPE === "ant"` prompt fork, the `isPlanModeInterviewPhaseEnabled()` conditional in both
  the prompt and the result footer, and the `USER_TYPE` branch in the `Shift+Tab` cycle — all
  confirmed by 0 grep hits in the bundle. The product converged on a single always-on variant per
  surface.
- **The `allowedPrompts` Bash pre-authorization is shipped-but-off.** `ExitPlanMode`'s schema accepts
  `allowedPrompts`, and `buildPlanExitPermissionUpdates` (`i9q`) would turn them into session `allow`
  rules — but the whole `addRules` push is guarded by `isPromptBasedPermissionsEnabled` (`jwH`), which
  is hardcoded `return !1`. It is a no-op in this build.
- **Auto mode is gated in three independent places** — `canCycleToAuto` (cycle eligibility), the throw
  in `transitionPermissionMode` (hard guard), and the `ExitPlanMode.call()` circuit-breaker fallback —
  because the live auto-mode gate can diverge from any cached state at any moment.

---

## Confidence

- **High confidence:** the tool descriptors, schemas, the subagent throw, the transition→prepare→
  setMode lifecycle and its order-sensitivity, the `isEnabled` capability gate and both predicates,
  the write floor ordering and the `.claude/**`/read-downgrade carve-outs, the plan-file exemption,
  the seeded slug algorithm, the reminder cadence, the opusplan model switch, the resume
  reconciliation, the approval dialog / options / pure choice-mapping, the `Shift+Tab` cycle, the
  Ultraplan scanner/poller and the `## Approved Plan:` marker contract, and all the de-flagging deltas
  (0 grep hits for `isPlanModeInterviewPhase` / `USER_TYPE === "ant"`). Every line number in this
  README was read directly from the v2.1.156 bundle or confirmed against the area docs.
- **Medium confidence (inherited from the area docs):** the exact glyph byte of the plan-mode bullet
  (`r9` declaration confirmed; figures-init assignment not byte-read); the precise intent of the
  lazy-imported `stripDangerousPermissionsForAutoMode`/`restoreDangerousPermissions` bodies; and the
  v2.1.88-side line citations in the cross-version sections, which are taken from the precursor files.
