# Cross-Validation Report — 05_plan_mode (v2.1.193 current-state appendix)

- **Theme:** Plan Mode current-state implementation (`EnterPlanMode`, `ExitPlanMode`, reminders, prompt surface, UI, compact carryover, remote Ultraplan scaffolding)
- **Module dir:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/05_plan_mode/`
- **Docs audited:** `README.md`, `lifecycle_state_machine.md`, `reminder_cadence.md`, `prompt_surface.md`, `ui_permission_flow.md`
- **Symbol index audited:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_index_core_features.md`
- **TARGET bundle (v2.1.193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE (v2.1.183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` and `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/PlanModeTools.ts`
- **NAMED-SOURCE MIRROR (v2.1.88 lineage):** `/lyz/codespace/3rd/claude-code/src/tools/{EnterPlanModeTool,ExitPlanModeTool}/`, `/lyz/codespace/3rd/claude-code/src/utils/{attachments.ts,messages.ts,permissions/permissionSetup.ts,ultraplan/ccrSession.ts}`

**Verdict (one line):** **PASS.** The 2.1.193 Plan Mode documentation is correctly framed as current-state/carryover coverage rather than a new 193 delta. Every load-bearing 193 anchor re-opened at its cited line, the 183 before-picture confirms the same local tool/reminder/UI handshake already existed, and the 2.1.88 named TypeScript source validates the semantic names used for the obfuscated 193 symbols. No forbidden module-level mapping table was introduced.

---

## Sample

- **193 anchors re-read:** 45+ source anchors across tools, attachment generation, attachment rendering, compact carryover, UI dialogs, remote Ultraplan strings, and SDK/init schema fields.
- **183 before-picture anchors re-read:** 20+ anchors, including the 183 tool objects (`a2n`, `Ij`), attachment cadence (`who`, `Z3p`, `e4p`, `dtl`), and renderer switch (`GSf`, `qSf`, `VSf`, `zSf`, `plan_mode_reentry`, `plan_mode_exit`).
- **Named-source semantic checks:** 2.1.88 `EnterPlanModeTool.ts`, `ExitPlanModeV2Tool.ts`, `utils/attachments.ts`, `utils/messages.ts`, `permissionSetup.ts`, and `ultraplan/ccrSession.ts`.
- **Grep-count checks:** stable Plan Mode strings were counted in both 193 and 183 to prevent false delta claims.

---

## C1 — 193 Anchor Spot-Check

Every row below was re-opened in the 2.1.193 bundle and matched against the claim in `05_plan_mode/README.md` or `symbol_index_core_features.md`.

| Surface | 193 anchor | Verified claim | Verdict |
|---------|------------|----------------|---------|
| Tool names | `C7` @ `229308`; `Ex` / `uD` @ `153113-153114` | Constants resolve to `EnterPlanMode` and `ExitPlanMode`. | PASS |
| Exit schemas | `mGp` @ `381493`; `pKa` @ `381500`; `Fk_` @ `381508`; `gGp` @ `381511` | Exit input/output schemas include `allowedPrompts`, SDK-injected `plan` / `planFilePath`, and output flags such as `planWasEdited` / `awaitingLeaderApproval`. | PASS |
| Exit tool object | `UD` @ `381532` | Deferred `ExitPlanMode` tool object with local ask permission, teammate bypass, disk-plan fallback, leader-approval branch, and result mapping. | PASS |
| Exit validation | `381567-381588` | Non-teammate calls outside `"plan"` mode log `tengu_exit_plan_mode_called_outside_plan` and return a validation error before the approval UI. | PASS |
| Plan file writeback | `381600-381610` | Edited `input.plan` is written back to the plan file and remote snapshot refresh is triggered. | PASS |
| Teammate approval | `381611-381631` | Required-plan teammate sends a `plan_approval_request` to `team-lead`, marks awaiting approval, and returns `awaitingLeaderApproval`. | PASS |
| Auto-mode restore guard | `381633-381675` | `prePlanMode === "auto"` restores to `"default"` if the auto-mode gate is off, then restores/strips dangerous permissions according to target mode. | PASS |
| Tool-result branches | `381681-381730` | Four branches exist: awaiting leader approval, agent approval `"ok"`, empty-plan approval, and approved plan with edited/un-edited label. | PASS |
| Enter prompt fragment | `hGp` @ `381733`; `yGp` @ `381748` | Prompt describes when to enter plan mode and the read/explore/ask/approve workflow. | PASS |
| Exit prompt constant | `Kza` @ `380558` | Prompt requires a completed plan file, says the tool reads the plan from disk, and forbids using `AskUserQuestion` for plan approval. | PASS |
| Enter tool object | `Z5n` @ `381889` | Deferred read-only tool blocks agent contexts and transitions the session to `"plan"`. | PASS |
| Enter call | `381922-381942` | Calls `handlePlanModeTransition`, then applies `prepareContextForPlanMode` before `setMode -> plan`. | PASS |
| Permission preparation | `Pmt` @ `598780-598794` | Captures `prePlanMode` before plan entry and reconciles auto-mode side effects. | PASS |
| Plan auto reconciliation | `A4t` @ `598796-598805` | Reconciles auto-mode active state and stripped/restored dangerous permissions while still in plan mode. | PASS |
| Bootstrap flags | `TTt` / `kz` / `qfr` / `bse` / `eme` @ `3402-3417` | Global one-shot flags track plan-mode exit and reset exit attachment state when crossing into/out of plan mode. | PASS |
| Compact carryover | `KKn` @ `470052-470064` | While still in plan mode after compaction, the system reconstructs a full `plan_mode` attachment with `planModeInstructions`. | PASS |
| Attachment cadence | `Pko` @ `473394`; `fuf` @ `473410`; `muf` @ `473421`; `HEl` @ `473445` | Human-turn throttle, full/sparse cycle, re-entry reminder, and post-exit attachment all match the README algorithm. | PASS |
| Attachment config | `Rko` @ `474654` | Both `TURNS_BETWEEN_ATTACHMENTS` and `FULL_REMINDER_EVERY_N_ATTACHMENTS` are `5`. | PASS |
| Attachment renderer | `o5f` @ `601213`; `i5f` @ `601224`; `a5f` @ `601311`; `l5f` @ `601316` | Renderer dispatches full, sparse, and subagent plan-mode reminder bodies. | PASS |
| Re-entry renderer | `601513-601532` | Re-entry reminder tells the model to read the existing plan, decide same/different task, and edit the plan before exiting again. | PASS |
| Exit renderer | `602686-602693` | Exit attachment tells the model it has exited plan mode and may now edit/run tools, with optional plan-file reference. | PASS |
| Final-plan prompt | `s5f` @ `602480` | Phase 4 asks for context, recommended approach, critical files, reusable functions/utilities, and verification. | PASS |
| Rejection reminder | `qEo` @ `602456` | Rejected plans keep the model in plan mode and include the rejected plan text. | PASS |
| Enter UI | `Qpc` @ `646536-646605` | Permission UI title is "Enter plan mode?", logs `tengu_plan_enter`, and applies `setMode -> plan` on yes. | PASS |
| Exit UI | `fdc` @ `640625-641219` | Exit permission UI shows either simple "Exit plan mode?" confirmation or editable "Here is Claude's plan:" flow with options, image paste, and external-editor hint. | PASS |
| Exit option builder | `AQf` @ `640541-640570` | Builds approval/rejection/context-clear/Ultraplan choices based on auto, bypass, context pressure, and feedback input availability. | PASS |
| Exit choice mapper | `Tar` @ `640586-640624` | Converts exit UI choices into allow/deny permission results, edited-plan input, feedback, image blocks, or context-clear denial handoff. | PASS |
| External editor hook | `fdc` body @ `640980-641014` | `ctrl+g` opens the plan in an external editor or temp editor, logs `tengu_plan_external_editor_used`, and marks local edits. | PASS |
| Remote Ultraplan prompts | `lUl` / `cUl` / `uUl` @ `537540-537630` | Lightweight, diagram-aware, and multi-agent remote plan reminders all require `ExitPlanMode` and handle `__ULTRAPLAN_TELEPORT_LOCAL__`. | PASS |
| SDK/init config | `planModeInstructions` @ `700728`, `708494`, `712419` | Custom workflow body is accepted and described as replacing the default plan-mode workflow while preserving read-only preamble and exit protocol. | PASS |

---

## C2 — Algorithm Verification

### Enter Plan Mode Transition

**What it does:** Converts the session from its current permission mode into `"plan"` while preserving enough state to restore the prior mode later.

**How it works:**
1. `Z5n.call` rejects agent contexts at `381922`; this prevents a subagent from entering a mode that depends on a local approval UI it cannot own.
2. `eme(previousMode, "plan")` runs before the context update, clearing stale exit-attachment state when the session re-enters plan mode.
3. `Pmt(previousContext)` snapshots `prePlanMode` before `_y(... setMode: "plan")` overwrites the active mode.
4. The tool result tells the model to explore and design, but enforcement comes from the permission context and later `plan_mode` attachments.

**Why this approach:**
- It treats plan mode as a temporary permission-mode overlay, not a purely textual instruction.
- It avoids losing the user's previous mode, including `"auto"` when safe to restore.
- It blocks agent entry because agent sessions do not have the same local approval/exit path.

**Key insight:** The safe transition is the order: capture previous mode first, then set `"plan"`, then rely on reminders to maintain the read-only contract.

### Plan Mode Reminder Cadence

**What it does:** Re-injects the plan-mode contract periodically without flooding every tool round.

**How it works:**
1. `Pko` scans backward from the transcript tail and counts only human user turns that are not meta and do not contain tool results.
2. If a previous `plan_mode` / `plan_mode_reentry` attachment exists and fewer than 5 human turns passed, `muf` emits no reminder.
3. `fuf` counts `plan_mode` attachments since the last `plan_mode_exit`.
4. `muf` chooses `full` when `(count + 1) % 5 === 1`; otherwise it chooses `sparse`.
5. If `TTt()` is true and a plan file exists, `muf` emits `plan_mode_reentry` once and clears the flag with `kz(false)`.
6. `HEl` emits `plan_mode_exit` only after mode is no longer `"plan"` and either the explicit exit flag or a prior plan-mode attachment proves the model needs the exit notice.

**Why this approach:**
- Counting human turns, not assistant/tool turns, prevents long tool-use loops from repeatedly injecting large reminders.
- Alternating full/sparse reminders preserves the safety invariant while controlling prompt size.
- Resetting at `plan_mode_exit` keeps a new planning cycle from inheriting stale cadence state.

**Key insight:** The cadence is conversation-relative. Tool-heavy exploration does not consume the reminder budget the way new human turns do.

### Exit Plan Mode Restore

**What it does:** Turns the plan file into an approval decision and restores the permission context to the pre-plan mode.

**How it works:**
1. Local calls must still be in `"plan"` mode at validation time; teammate contexts bypass the local approval dialog.
2. The call reads the plan from `input.plan` only when permission UI supplied an edited plan; otherwise it reads the plan file.
3. Required-plan teammates do not locally exit; they send a `plan_approval_request` to `team-lead` and wait.
4. Local/session exit checks whether `prePlanMode` can be restored. If it was `"auto"` but the auto-mode gate is now off, the restore target becomes `"default"`.
5. The mode update strips or restores dangerous rules based on whether the target mode is `"auto"`, clears `prePlanMode`, and sets exit attachment flags.
6. The tool-result mapper returns one of the four user-visible approval branches.

**Why this approach:**
- The plan file is the review artifact, so approval and later implementation share a concrete disk-backed document.
- Restore is defensive: it does not bypass an auto-mode circuit breaker just because the user entered planning while auto mode was available.
- Team approval is mailbox-based because teammate sessions are remote/agent contexts rather than local TUI owners.

**Key insight:** `ExitPlanMode` is not just a yes/no UI. It is the permission-context repair point that prevents plan mode from either sticking forever or restoring an unsafe auto state.

---

## C3 — 183 Before-Picture

The 183 before-picture confirms that the local Plan Mode machinery is mostly carryover and should not be marketed as a 193 delta.

| 183 surface | 183 anchor | 193 counterpart | Verdict |
|-------------|------------|-----------------|---------|
| Enter tool name | `A7` @ `221314` | `C7` @ `229308` | CARRYOVER |
| Exit tool names | `yx` / `WM` @ `152252-152253` | `Ex` / `uD` @ `153113-153114` | CARRYOVER |
| Enter prompt | `jwp` / `Gwp` @ `392179-392272` | `hGp` / `yGp` @ `381733-381823` | CARRYOVER |
| Enter tool object | `a2n` @ `392329` | `Z5n` @ `381889` | CARRYOVER |
| Exit prompt/schemas/object | `VUa` / `eCp` / `ZUa` / `jcy` / `tCp` / `Ij` @ `392403-392807` | `Kza` / `mGp` / `pKa` / `Fk_` / `gGp` / `UD` @ `381493-381732` | CARRYOVER |
| Human-turn throttle | `who` @ `464774` | `Pko` @ `473394` | CARRYOVER |
| Full/sparse count | `Z3p` @ `464790` | `fuf` @ `473410` | CARRYOVER |
| Attachment builder | `e4p` @ `464801` | `muf` @ `473421` | CARRYOVER |
| Exit attachment | `dtl` @ `464825` | `HEl` @ `473445` | CARRYOVER |
| Renderer dispatch | `GSf` @ `589092` | `o5f` @ `601213` | CARRYOVER |
| Full/sparse/subagent renderers | `qSf` / `VSf` / `zSf` @ `589103` / `589190` / `589195` | `i5f` / `a5f` / `l5f` @ `601224` / `601311` / `601316` | CARRYOVER |
| Re-entry attachment text | switch case @ `589372` | switch case @ `601513` | CARRYOVER |
| Exit attachment text | `plan_mode_exit` renderer @ `590537` | `plan_mode_exit` renderer @ `602686` | CARRYOVER |

The 183 reconstructed source at `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/PlanModeTools.ts` also documents the same core design: `EnterPlanMode` stores `prePlanMode`, `ExitPlanMode` reads the plan from disk, teammate-required plans go to a team-lead mailbox, and the result mapper has the same approval/empty-plan/agent/edited-plan branches.

---

## C4 — Stable-String / False-Delta Check

The counts below were re-run against the 193 and 183 bundles. They show why the 193 Plan Mode doc is a current-state appendix, not a thirteenth delta theme.

| Stable string | 193 count | 183 count | Classification |
|---------------|----------:|----------:|----------------|
| `EnterPlanMode` | 7 | 7 | CARRYOVER |
| `ExitPlanMode` | 19 | 19 | CARRYOVER |
| `plan_mode` | 38 | 39 | CARRYOVER with nearby-count drift from surrounding registry/code motion |
| `plan_mode_reentry` | 4 | 4 | CARRYOVER |
| `plan_mode_exit` | 6 | 7 | CARRYOVER with nearby-count drift from surrounding registry/code motion |
| `Approved Plan` | 4 | 4 | CARRYOVER |
| `Approved Plan (edited by user)` | 2 | 2 | CARRYOVER |
| `__ULTRAPLAN_TELEPORT_LOCAL__` | 4 | 4 | CARRYOVER |
| `planModeInstructions` | 14 | 14 | CARRYOVER/current configuration surface |
| `tengu_plan_enter` | 1 | 1 | CARRYOVER |
| `Exit plan mode?` | 2 | 2 | CARRYOVER |
| `Enter plan mode?` | 1 | 1 | CARRYOVER |

**False-delta conclusion:** No Plan Mode claim in the new 193 doc depends on a string that is absent from 183. The correct classification is "current 193 implementation, re-anchored and explained in detail," not "new in 193."

---

## C5 — 2.1.88 Named-Source Semantic Check

The 2.1.88 source tree is not the source of truth for 193 line claims, but it validates the deobfuscated names and design intent:

- `src/tools/EnterPlanModeTool/EnterPlanModeTool.ts` matches `Z5n`: deferred, read-only, parameterless input, agent-context rejection, `handlePlanModeTransition`, `prepareContextForPlanMode`, and `setMode -> plan`.
- `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts` matches `UD`: deferred approval tool, local `"plan"` validation, teammate bypass, disk-plan fallback, edited-plan writeback, required-plan teammate leader approval, auto-mode gate fallback, permission restore, and four result branches.
- `src/utils/attachments.ts` matches `Pko` / `fuf` / `muf` / `HEl`: human-turn reminder throttle, full/sparse cycle, one-time re-entry, and one-time exit attachment.
- `src/utils/messages.ts` matches `o5f` / `i5f` / `a5f` / `l5f`: full/sparse/subagent rendering, re-entry text, exit text, and the "do not ask for plan approval via text or AskUserQuestion" rule.
- `src/utils/ultraplan/ccrSession.ts` matches the remote approval parsing implied by the `## Approved Plan` / `## Approved Plan (edited by user)` tool-result labels and the `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel.

The named-source check supports the readable names used in `symbol_index_core_features.md`; the line-number evidence still comes from the 2.1.193 obfuscated bundle.

---

## C6 — Format / Instruction Compliance

- The `05_plan_mode/` docs have no forbidden symbol-reference section titles.
- The module docs have no obfuscated-to-readable mapping table; symbol references are list-form under `## Related Symbols`.
- The three code snippets in `05_plan_mode/README.md` retain the required structure: one header block, `ORIGINAL`, `READABLE`, and `Mapping`.
- Newly indexed Plan Mode symbols live in `symbol_index_core_features.md`, the correct central index for core feature symbols.
- English-only scan over the Plan Mode README and symbol-index additions returned no Chinese characters.

---

## Final Verdict

**PASS — confidence HIGH.**

Plan Mode is now documented at the right level for the 2.1.193 tree: not as a false delta, but as a source-backed current-state deep dive with 193 anchors, 183 before-picture evidence, and 2.1.88 named-source semantic validation. The main remaining limitation is scope: this report validates the local Plan Mode tool/reminder/prompt/UI surfaces, but it does not attempt a full model-selection or teammate-swarm audit beyond the branches directly touched by `EnterPlanMode`, `ExitPlanMode`, and their attachments.
