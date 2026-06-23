# Cross-Validation Report — Tools Subsystem (v2.1.183)

> **Adversarial independent re-verification** of the reconstructed `.ts` files in
> `04_tools/reconstructed_source/` against the LIVE bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> Default-to-fail; each anchor was opened at its cited bundle line and the decl/obf-id + logic +
> byte-exact string re-confirmed. A subset of load-bearing claims was re-derived from scratch
> (registry array spine, the keyword-scorer weights, the deferred-tools delta reminder render, the
> Read-vs-Write validateInput attribution) rather than trusting the anchor.

## Scope covered

Framework (`Tool.ts`), registry/assembly (`tools.ts`), wire serialization (`toolSchema.ts`),
deferral/ToolSearch machine (`deferredTools.ts`, `tools/ToolSearchTool.ts`), and the per-tool
contract files under `tools/` (Bash, Read, Write, Edit, Glob, Grep, NotebookEdit, Agent/Task family,
Cron family, MCP-resource family, Web{Fetch,Search}, LSP, Skill, TodoWrite, StructuredOutput,
SendMessage, PlanMode, PushNotification, RemoteTrigger, ScheduleWakeup, Worktree, PowerShell, REPL,
OnboardingMisc/SendUserMessage).

## PASS/FAIL table (sample → file:symbol → bundle:line → verdict)

| # | Reconstructed file : symbol | Bundle anchor | What was re-verified | Verdict |
|---|------------------------------|---------------|----------------------|---------|
| 1 | `Tool.ts` : `buildTool` (`pi`) | :149995-149997 | `Object.defineProperties({...jJu, userFacingName...}, getOwnPropertyDescriptors(e))` getter-preservation | PASS |
| 2 | `Tool.ts` : `toolMatchesName` (`Rc`) | :149965-149967 | `e.name === t \|\| (e.aliases?.includes(t) ?? !1)` | PASS |
| 3 | `Tool.ts` : `findToolByName` (`vl`) | :149984-149994 | aliasMap recurse + WeakMap/WeakSet two-tier cache + `e.find(Rc)` | PASS |
| 4 | `Tool.ts` : `getEmptyToolPermissionContext` (`kO`) | :149998-150006 | `mode:"default"`, 5 rule maps, `isBypassPermissionsModeAvailable:!1`, `mcpPermissionModeOverrides:{}` | PASS |
| 5 | `Tool.ts` : `TOOL_DEFAULTS` (`jJu`) | :150013-150021 | all 7 default methods incl. `checkPermissions→{behavior:"allow"}` | PASS |
| 6 | `tools.ts` : `getAllBaseTools` (`LW`) | :436517-436577 | full built-in array spine + every conditional spread/named slot | PASS |
| 7 | `tools.ts` : `getToolsForDefaultPreset` (`kfo`) | :436512-436516 | mask-then-filter `.map(isEnabled())`→`.map(name)` | PASS |
| 8 | `tools.ts` : `filterToolsByDenyRules` (`Fce`) | :436578-436580 | `!N3t(t,n) && mcpInfo?.effectiveMaxPermission !== "blocked"` | PASS |
| 9 | `tools.ts` : `assembleToolPool` (`YY`) | :436581-436588 | deny+repl filter, localeCompare sort, skillTools concat, `fS(...,"name")` uniqBy | PASS |
| 10 | `tools.ts` : `getTools` (`zR`) | :436622-436652 | CLAUDE_CODE_SIMPLE fast path, coordinator-mode push, REPL filter, isEnabled mask, Glob/Grep re-add | PASS |
| 11 | `toolSchema.ts` : `buildToolSchema` (`CWn`) | :581300-581356 | cache key, 4-way eager_input_streaming gate, `defer_loading`/`cache_control` layering, baseline-key strip | PASS |
| 12 | `deferredTools.ts` : `isDeferredTool` (`G2`) | :222307-222321 | full ladder incl. new `c1i()` gate, Agent/Brief/SendUserFile/Push/ScheduleWakeup/EnterWorktree exemptions | PASS |
| 13 | `deferredTools.ts` : `getNonDeferrableBuiltins` (`c1i`) | :221201-221217 | feature-gate + clientDataCache union, `svd` fallback | PASS |
| 14 | `tools/ToolSearchTool.ts` : `getPrompt` (`own`) | :222325-222342 | `xvd + (qmi()?Lvd:kvd) + Dvd`, all four strings byte-exact (incl. `—` em-dash) | PASS |
| 15 | `tools/ToolSearchTool.ts` : `searchToolsWithKeywords` (`dUi`) | :230294-230362 | exact-match/mcp-prefix short-circuits, `+`-required filter, scorer weights 12/10/6/5/4/3/2 | PASS |
| 16 | `deferredTools.ts` : deferred-tools delta reminder | :589470-589511 | added/readded/removed/pending 4-section render, all verbatim strings | PASS |
| 17 | `deferredTools.ts` : gentle-reminder + new-available reminder | :589330 / :589473 | "Some available tools' schemas…" + "The following deferred tools are now available…" verbatim | PASS |
| 18 | `tools/BashTool.ts` : `BashTool` (`Cl`) | :450669-450676 | name `ns`, ruleContentField "command", maxResultSizeChars 30000, strict, "Run shell command" | PASS |
| 19 | `tools/BashTool.ts` : input schema (`mJa`) | :450554-450576 | command/timeout/description (verbatim multi-line) /run_in_background/dangerouslyDisableSandbox/_simulatedSedEdit | PASS |
| 20 | `tools/BashTool.ts` : output schema (`UFp`) | :450606-450645 | all 13 fields + verbatim describe strings | PASS |
| 21 | `tools/ReadTool.ts` : `Read` (`hg`, name `Ws`) | :463601-463644 | validateInput errorCodes 7/8/1/4/9 + verbatim messages (correct region) | PASS |
| 22 | `tools/WriteTool.ts` : `Write` (`yE`, name `Kc`) | :390672-390722 | validateInput errorCodes 7/5/0/1/6/2, subagent-report-block + Perforce `kze` (correct attribution) | PASS |
| 23 | `tools/EditTool.ts` : error strings + `PERFORCE_READONLY_MESSAGE` (`kze`) | :48727 / :444670-444681 | "String to replace not found", "Found N matches…", Perforce read-only msg verbatim | PASS |
| 24 | `tools/NotebookEditTool.ts` : validateInput | :391117/391119/391145 | "Edit mode must be…", "Cell type is required…", "Notebook file does not exist." verbatim | PASS |
| 25 | `tools/GrepTool.ts` / `tools/GlobTool.ts` (`OR`/`hj`) | :370736 / :371072 | names `Uc`/`_u`, searchHints, maxResultSizeChars 20000/1e5, "Path is not a directory" | PASS |
| 26 | `tools/AgentTool.ts` : `Agent` (`f3n`) checkPermissions + schema | :424241-424245 / :423433-423440 | "auto"→passthrough "Agent tool requires permission to spawn subagents."; describe strings verbatim | PASS |
| 27 | `tools/AgentTool.ts` : teammate_spawned result text | :424248-424262 | "Spawned successfully. / agent_id: … / The agent is now running…" verbatim | PASS |
| 28 | `tools/CronTools.ts` : names + descriptions | :221670-221672 / :221660-221666 | `rI`/`U2`/`OPt` = CronCreate/Delete/List; "Cancel a cron job…"/"List all cron jobs…" verbatim | PASS |
| 29 | `tools/TaskTools.ts` : TaskStop (`edt`) schema + aliases | :424853-424870 | task_id/shell_id schema, aliases `["KillShell","KillBash"]` | PASS |
| 30 | `tools/TodoWriteTool.ts` : `Dxe` isEnabled | :299546-299548 | `isEnabled(){ return !_H() }` inverse Task gate | PASS |
| 31 | `tools/WebFetchTool.ts` / `tools/WebSearchTool.ts` (`gF`/`V3n`) | :409284 / :428558 | names `nE`/`rG`, `shouldDefer:!0`, "Claude wants to fetch/search…" verbatim, WebSearch provider gate | PASS |
| 32 | `tools/PlanModeTools.ts` : ExitPlanMode (`Ij`) checkPermissions+validate | :392642-392663 | `{behavior:"ask",message:"Exit plan mode?"}`; "You are not in plan mode…" errorCode 1 verbatim | PASS |
| 33 | `tools/McpResourceTools.ts` (`_G`/`kG`) | :236164 / :275629 | names "ListMcpResourcesTool"/"ReadMcpResourceTool" + aliases "ListMcpResources"/"ReadMcpResource" | PASS |
| 34 | `tools/SkillTool.ts` : `lut` (name `mH`) | :393152-393175 | isEnabled `!pU()`, `description:({skill})=>\`Execute skill: ${skill}\``, "Invalid skill format" | PASS |
| 35 | `tools/StructuredOutputTool.ts` (`Em`) | :221489/:221514 | name "StructuredOutput", "Return structured output in the requested format" | PASS |
| 36 | `tools/SendMessageTool.ts` : `p$p` (name `zh`) | :434569-434580 | "send messages to agent teammates", `isEnabled(){return Sl()}`, shouldDefer | PASS |
| 37 | `tools/LSPTool.ts` : `Opo` (name `Vlt`) | :368922 / :429593 | name "LSP", `isLsp:!0`, "code intelligence…" searchHint | PASS |
| 38 | `tools/PushNotificationTool.ts` / `tools/RemoteTriggerTool.ts` | :431837 / :431472 | names `G9`/`dWe`, maxResultSizeChars 1000, descriptions verbatim | PASS |
| 39 | `tools/WorktreeTools.ts` (`G8a`/`Z8a`) | :429904 / :430192 | names `WAe`/`ZTn` = EnterWorktree/ExitWorktree, "create an isolated git worktree…" | PASS |
| 40 | `tools/OnboardingMiscTools.ts` : SendUserMessage (`KO`/`MPt`) | :221278-221298 | name "SendUserMessage" alias "Brief", turn-without-send sentinel, two descriptions verbatim | PASS |

## Counts

- **Sampled:** 40 load-bearing anchors (≥2× the required 20), spread across all 30 reconstructed files.
- **Passed:** 40 / 40.
- **Fixed:** 0 (no defect found in any reconstructed `.ts` file).
- **Flagged:** 1 (a documentation note in a non-deliverable SCOUT dossier, detailed below — does NOT
  affect any `.ts` deliverable).

## Flag (non-blocking, scout-dossier only)

`_anchors_framework_registry.md` §1 (lines 46-48) mislabels bundle lines **:390676 / :390688 / :390700**
as belonging to the **"Read tool"** (errorCodes 7/0/6 with message `kze`, described as a "Read tool
symlink" case). In the live bundle those lines belong to the **Write tool** (`yE`, name `Kc="Write"`,
object @390665) — the `errorCode:6` branch is gated by `Lze(d.mode)` (a read-only file-mode predicate,
not a symlink check) and `kze` (:48727) is the **Perforce read-only** message
(`"File is read-only — it has not been opened for edit in Perforce…"`), not a symlink message. The real
Read tool (`hg`, name `Ws`) has a *different* validateInput at :463601-463644 (errorCodes 7/8/1/4/9).

**This mislabel did NOT propagate into the deliverable `.ts` files** — and in fact the reconstructions
are *more accurate than their own scout dossier*:
- `tools/WriteTool.ts` correctly reconstructs :390672-390748 as the Write tool with the right errorCodes
  and the verbatim subagent-report-block message.
- `tools/ReadTool.ts` correctly sources the Read validateInput from the :463601 region.
- `tools/EditTool.ts` correctly names `kze` `PERFORCE_READONLY_MESSAGE` (:48727).

Because the error is confined to a scout `_anchors_*.md` scaffold (explicitly an input, not a
deliverable, per `_conventions.md`) and no `.ts` consumes it incorrectly, no in-place `.ts` Edit was
applied. Recommend a one-line correction to that dossier's §1 for future re-use; it is purely a
provenance-comment nit, not a contract defect.

## Verdict

**PASS.** Across 40 independently re-opened, byte-checked anchors spanning the framework, registry,
serialization, deferral/ToolSearch machine, and ~30 per-tool contract files, every reconstructed
declaration, obfuscated-id mapping, Zod schema field + `.describe(...)` string, `validateInput` error
message + numeric `errorCode`, `checkPermissions` decision, verbatim description/prompt/system-reminder
string, gating predicate, and control-flow core matched the live v2.1.183 bundle exactly — including
load-bearing details re-derived from scratch (the `getAllBaseTools` array spine, the keyword-scorer
weight ladder, the four-section deferred-tools delta reminder, the four-way `eager_input_streaming`
gate, and the subtle Read-vs-Write validateInput attribution). The single anomaly found is a
mislabeled provenance line in a SCOUT dossier (`_anchors_framework_registry.md`), which the
deliverable `.ts` files already get right; it carries zero impact on contract fidelity. The tools
subsystem reconstruction is faithful to source.
