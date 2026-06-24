# Symbol Additions — Slash Commands `/loop` `/goal` `/batch` `/simplify` (v2.1.183)

> Consolidated obfuscated→readable symbol table for the four user-facing slash commands
> reconstructed in [`43_slash_commands/reconstructed_source/`](../43_slash_commands/reconstructed_source/):
> **`/loop`**, **`/goal`**, **`/batch`**, **`/simplify`**, plus the shared bundled-skill
> **registrar/dispatch** infrastructure they ride on. This is a *whole-command* manifest (carryover
> included), not just the 2.1.156→2.1.183 delta — but the Description column tags the version-specific
> facts (the per-command delta, the v2.1.88 ancestor, the v2.1.156 before-picture alias) so every claim
> is traceable.
>
> **Routing note (CLAUDE.md).** These rows belong in
> [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) under **Slash Commands**
> (the registrar/dispatch + the four commands' definitions). A small number of *shared execution/feature*
> symbols the commands merely consume have their canonical home elsewhere and are flagged inline (Skill
> tool / Cron / ScheduleWakeup / Monitor / hooks-registry / effort) — see "Notes on home-index
> placement" at the end.
>
> **Re-mangling warning.** The bundler re-mangles every build. The obfuscated names below are the
> **v2.1.183** names, read directly from the declaration line in
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`. The v2.1.156 aliases
> recorded in the Description column (e.g. "v2.1.156 `bA`") DO NOT apply in v2.1.183.

## Headline of this version (the four per-command 2.1.156→2.1.183 deltas)

The commands are **structurally frozen** vs v2.1.156. Every behavioral delta is a small, surgical edit:

1. **Registrar (`ap`).** The emitted `Command` object gained two fields — `menuDescription` (the short
   slash-menu label, distinct from the model-invocation `description`) and `getArgumentCompletions`;
   `progressMessage` became configurable (`definition.progressMessage ?? "running"`) instead of hardcoded
   `"running"`. Everything else is byte-identical to v2.1.156 `bA`@524187. (cli_inner_pretty.js:546993,
   546973-547022; v2.1.156 `bA`@524187.)
2. **`/loop`, `/batch`, `/simplify`** each gained **only** the new `menuDescription` field
   (`/simplify` additionally got a closure/memory-leak paragraph inside the Efficiency angle). All prompt
   bodies, gates, the dynamic/loop.md/autonomous machinery (loop), the 3-phase coordinator (batch), and
   the 4-angle review (simplify) **already shipped in v2.1.156**.
3. **`/goal`** gained **only** a distinct `local-jsx` description ("Set a goal Claude checks before
   stopping" — the non-interactive twin still reads "Set a goal — keep working until the condition is
   met"). The Stop-hook machinery (set/clear/validate/gate) is byte-identical to v2.1.156.

**Two framing traps** (changelog-adjacent facts that are NOT 156→183 source deltas): (a) `/batch`'s
worker-step-1 `simplify`→`code-review` switch and `/simplify`'s 3→4-agent evolution both **predate
v2.1.156** (they are deltas vs the v2.1.88 named-TS ancestor, carried in); (b) the `Sdt`
"Conventions (CLAUDE.md)" review angle exists in the 183 bundle but is **NOT wired into `/simplify`**
(it is consumed by the `/code-review` family).

## Cross-validated against

- **v2.1.183 bundle self-cross-check.** Every `File:Line` below was read directly from
  `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines) during
  this pass — not inferred from the reconstruction files. Confirmed declarations: registrar/registry
  (`ap`@546973, `Lwo`@547023, `oV`@392809, `Gwe`@193293, `txl`@547027, `scf`@547030, `icf`@547042,
  `ccf`@547058, `ucf`@547066, `dcf`@547072, `x6n`@575179, `exl`@547079, `acf`@547086, `lcf`@547087,
  `FJn`@660991, `IJl`@661027); loop (`_1f`@649251, `jAe`@221035, `IB`@221593, `o5r`@220891,
  `YTn`@220859, `TCe`@220758, `r1i`@220942, `t5r`@220863, `n5r`@220866, `n1i`@221013, `LPt`@221014,
  `Rtt`@220801, `wCe`@220802, builders `i7l`@649085/`p1f`@649090/`a7l`@649098/`l7l`@649126/`A1f`@649134/
  `g1f`@649139/`h1f`@649187/`y1f`@649202, consts `agt`@649363/`m1f`@649367/`f1f`@649386); batch
  (`pzl`@637828, `h$f`@637757, `g$f`@637849, `fzl`@637858, `y$f`@637850, `_$f`@637852, `uzl`@637847,
  `dzl`@637848, `T_`@51962); simplify (`OKl`@647978, `BUt`@372051, `ZOf`@648003, `NKl`@648004,
  `_dt`@435519, `bdt`@435521, `fLe`@435525, `mLe`@435531, `Sdt`@435541, `ALe`@435554); goal machinery
  (`FGn`@454437, `AQa`@454440, `gQa`@454450, `Jdt`@454453, `ego`@454461, `Qdt`@454466, `Zdt`@454481,
  `hQa`@454494, `Xdt`@454503, `UGn`@454505, `VUp`@454507, `zUp`@454508, `qUp`@454518) + UI/registration
  (`APl`@561812, `Hmf`@561943, `vmf`@561946, `NIo`@561949, `yPl`@561986, `Tmf`@561989, `bPl`@562013,
  `wmf`@562015, `SPl`@562040, `Cmf`@562050, `Imf`@562058, `xmf`@562070); tool-name constants
  (`vs`@149939, `mH`@221449, `Ff`@221315, `yv`@220793, `$g`@220800, `IL`@220833, `uP`@220834,
  `rI`@221670, `U2`@221671, `ree`@221680, `yx`@152252, `A7`@221314, `G9`@220751). All verified.
  - The goal registration lines (`Cmf`@562050, `Imf`@562058, `xmf`@562070) verified directly in the
    bundle override the slightly-off numbers in the goal anchor dossier (which read `Cmf`@562058 etc.);
    the descriptions ("Set a goal Claude checks before stopping" vs `"— keep working until the
    condition is met"`) were read at 562053/562063.
- **v2.1.156 before-picture.** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (649,979 lines). The four commands all exist there: `goal`@538353, `batch`@600205, `simplify`@601352,
  `loop`@602614; registrar `bA`@524187 (no `menuDescription`, no `getArgumentCompletions`, hardcoded
  `progressMessage:"running"`); registry array `Ji4`; goal non-interactive `$jz`@538316; goal prompt
  `FT8`@447983 (== 183 `UGn` text); batch registration `nf9`@600205; batch worker init `if9`@600232
  (already `skill:"code-review"`); simplify registration `vO9`@601350 (no `menuDescription`).
- **v2.1.88 named TypeScript ancestors** (`/lyz/codespace/3rd/claude-code/src`): `src/skills/bundledSkills.ts`
  (`registerBundledSkill`/`BundledSkillDefinition`/`getBundledSkills`/`extractBundledSkillFiles`/…),
  `src/skills/bundled/index.ts` (`initBundledSkills`), `src/skills/bundled/{batch,loop,simplify}.ts`
  (the three `registerXSkill` templates). `/goal` has **no** named-TS ancestor (2.1.156-era addition); it
  mirrors the `src/commands/effort/{index.ts,effort.tsx}` `local-jsx` convention.
- **Extracted assets.** `extract/assets/slash_commands.json` lists `/batch`,`/goal`,`/loop`
  (`/simplify` is model-invocable-but-unlisted); `assets/prompts/194_simplify-4-cleanup-agents-in-parallel.txt`
  (== `ZOf` with interpolation slots blanked); `assets/prompts/093_autonomous-loop-*.txt` (== `JWr`,
  non-persistent preamble) + `097_autonomous-loop-*.txt` (== `qOi`, persistent); `125_loop-schedule-a-recurring-prompt-*.txt`
  (== `g1f`/`y1f` body).

---

## Module: Registrar / Dispatch (`skills/bundledSkills.ts`, `skills/bundled/index.ts`)

The shared infrastructure behind the three bundled skills (`/loop`,`/batch`,`/simplify`). `ap` is
v2.1.88's `registerBundledSkill`; logic identical to v2.1.156 `bA` apart from the two new emitted fields.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `ap` | `registerBundledSkill` | cli_inner_pretty.js:546973 | function | Emits the `Command{type:'prompt',source:'bundled'}` and pushes to the registry; wraps `getPromptForCommand` to extract `files` once + prepend base-dir. **NEW 183:** emits `menuDescription`@546993 + `getArgumentCompletions`; `progressMessage` now configurable. v2.1.156 `bA`@524187. |
| `Lwo` | `getBundledSkills` | cli_inner_pretty.js:547023 | function | Returns a copy of the registry; `[]` when bundled skills disabled. v2.1.156 `Xi4`. |
| `oV` | `areBundledSkillsDisabled` | cli_inner_pretty.js:392809 | function | `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS \|\| settings.disableBundledSkills===true`. |
| `Gwe` | `defineLazyOverride` | cli_inner_pretty.js:193293 | function | Installs an enumerable/configurable getter for fn-valued `description`/`argumentHint`/`whenToUse`. |
| `txl` | `getBundledSkillExtractDir` | cli_inner_pretty.js:547027 | function | `join(getBundledSkillsRoot(), name)`. |
| `scf` | `extractBundledSkillFiles` | cli_inner_pretty.js:547030 | function | Lazy first-invocation extract; on success `Le("skill_bundled_extract")`, on failure `v(...)`+`Me(...)`; returns dir or null. |
| `icf` | `writeSkillFiles` | cli_inner_pretty.js:547042 | function | Group-by-parent, `mkdir(recursive,0o700)`, write each file via `ccf`. |
| `ccf` | `safeWriteFile` | cli_inner_pretty.js:547058 | function | `open(p, lcf, 384)` → `writeFile('utf8')` → `close()`. |
| `ucf` | `resolveSkillFilePath` | cli_inner_pretty.js:547066 | function | Normalize + traversal guard; throws `bundled skill file path escapes skill dir` on `..`/absolute. |
| `dcf` | `prependBaseDir` | cli_inner_pretty.js:547072 | function | Prefix prompt with `"Base directory for this skill: ${dir}\n\n"` (verbatim, trailing blank line). |
| `x6n` | `getBundledSkillsRoot` | cli_inner_pretty.js:575179 | function | `join(vB(), "bundled-skills", VERSION, randomBytes(16).hex)` — per-process nonce (symlink defense). |
| `exl` | `bundledSkills` (registry array) | cli_inner_pretty.js:547079 | variable | `var exl` (decl @547079); set to `[]` inside module-init `OH` (decl @547080, `exl = []`@547085). v2.1.156 `Ji4`. |
| `acf` | `O_NOFOLLOW` | cli_inner_pretty.js:547086 | constant | `_qt.constants.O_NOFOLLOW ?? 0`. |
| `lcf` | `SAFE_WRITE_FLAGS` | cli_inner_pretty.js:547087 | constant | `O_WRONLY\|O_CREAT\|O_EXCL\|acf` (or `'wx'` on win32). |
| `FJn` | `initBundledSkills` | cli_inner_pretty.js:660991 | function | Idempotent registry init; calls `OKl()`@661006, `pzl()`@661007 unconditionally + lazy-binds and calls `registerLoopSkill` @661011-661012. |
| `IJl` | `bundledSkillsInitialized` (latch) | cli_inner_pretty.js:661027 | variable | `var IJl=!1`; guards `FJn` re-entry. |
| `Le` | `logEvent` (registrar telemetry) | cli_inner_pretty.js:547034 (callsite) | function | `Le("skill_bundled_extract")` on successful extract. *Distinct symbol from goal's `Le`@44569 — name collision across modules.* |
| `Me` | `logError` (registrar telemetry) | cli_inner_pretty.js:547038 (callsite) | function | `Me("skill_bundled_extract","skill_bundled_extract_write_failed")` on extract failure. |
| `v` | `logForDebugging` | cli_inner_pretty.js:547036 (callsite) | function | Debug log on extract failure. |

> **Dispatch site** (not a named slash-commands symbol; canonical home is the agent-loop): the
> prompt-command runner @386870 (`a = await e.getPromptForCommand(t, n)`) flattens the returned
> `ContentBlockParam[]` and merges them into a synthetic user turn (`m = [...o, ...r, ...a]` @386885),
> applying the Command's `allowedTools`/`disallowedTools` @386882-386884. The `type:'local'` (goal twin)
> branch instead returns `{messages, shouldQuery:true, …}` @386861.

---

## Module: `/loop` bundled skill (`skills/bundled/loop.ts`)

3-way dispatch: empty-input default (loop.md/autonomous) × dynamic(jAe)/cron × ScheduleWakeup/Monitor
event-gating vs legacy fixed-interval cron. The 2.1.156→2.1.183 delta is **only** the new `menuDescription`.

### Registration / gates

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `_1f` | `registerLoopSkill` | cli_inner_pretty.js:649251 | function | Registers the `loop` skill via `ap()` (call @649252); `aliases:["proactive"]`; **NEW `menuDescription`** @649254. v2.1.88 ancestor `registerLoopSkill` (fixed-interval only). |
| `IB` | `isLoopEnabled` | cli_inner_pretty.js:221593 | function | The `/loop` `isEnabled`: `!parseBoolean(env.CLAUDE_CODE_DISABLE_CRON) && featureFlag("tengu_kairos_cron",true,300000)`. |
| `jAe` | `isDynamicLoopEnabled` | cli_inner_pretty.js:221035 | function | `featureFlag("tengu_kairos_loop_dynamic",false)` — picks the self-pacing prompt branch (runtime, not registration). |
| `o5r` | `isLoopDefaultPromptEnabled` | cli_inner_pretty.js:220891 | function | `featureFlag("tengu_kairos_loop_prompt",false)` — toggles the empty-input default (loop.md/autonomous). Exported as `_9e.isLoopDefaultPromptEnabled`. |
| `YTn` | `isLoopPersistentPreambleEnabled` | cli_inner_pretty.js:220859 | function | `env.CLAUDE_CODE_LOOP_PERSISTENT \|\| featureFlag("tengu_kairos_loop_persistent",false)` — persistent vs non-persistent autonomous preamble. |
| `TCe` | `isAgentPushNotifEnabled` | cli_inner_pretty.js:220758 | function | `isPushNotifFeature() && entitlement("agentPushNotifEnabled").value` — gates `i7l()` PushNotification suffix. |

### Loop module `_9e` (default-prompt machinery) + sentinels

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `r1i` | `readLoopFile` | cli_inner_pretty.js:220942 | function | Reads `loop.md` (`<projectRoot>/.claude/loop.md` then `<cwd>/loop.md`); `{path,content}` or null; truncates >25000 bytes. |
| `t5r` | `getAutonomousLoopPreamble` | cli_inner_pretty.js:220863 | function | Returns `qOi` (persistent) or `JWr` (non-persistent) per `YTn()`. |
| `n5r` | `logAutonomousLoopActivation` | cli_inner_pretty.js:220866 | function | `logEvent("tengu_kairos_loop_persistent_activated",{variant:YTn()})`. |
| `n1i` | `LOOP_FILE_SENTINEL` | cli_inner_pretty.js:221013 | constant | `"<<loop.md>>"` (cron-mode loop.md fire-time sentinel). |
| `LPt` | `LOOP_FILE_DYNAMIC_SENTINEL` | cli_inner_pretty.js:221014 | constant | `"<<loop.md-dynamic>>"` (ScheduleWakeup-mode loop.md sentinel). |
| `Rtt` | `AUTONOMOUS_LOOP_SENTINEL` | cli_inner_pretty.js:220801 | constant | `"<<autonomous-loop>>"` (cron-mode autonomous sentinel). |
| `wCe` | `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` | cli_inner_pretty.js:220802 | constant | `"<<autonomous-loop-dynamic>>"` (ScheduleWakeup-mode autonomous sentinel). |
| `JWr` | `AUTONOMOUS_LOOP_PREAMBLE` (non-persistent) | cli_inner_pretty.js:220701 | constant | Non-persistent autonomous preamble (== asset `093_autonomous-loop-*.txt`). |
| `qOi` | `AUTONOMOUS_LOOP_PREAMBLE_PERSISTENT` | cli_inner_pretty.js:220726 | constant | Persistent ("spirit of the task") autonomous preamble (== asset `097_autonomous-loop-*.txt`). |

### Prompt builders + constants

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `i7l` | `pushNotifOutcomeSuffix` | cli_inner_pretty.js:649085 | function | "send a one-line outcome via PushNotification before you stop" clause when `TCe()`. |
| `p1f` | `intervalFromEveryMatch` | cli_inner_pretty.js:649090 | function | Normalizes an `EVERY_RE` match `[_, N, unitWord]` → `Ns`/`Nm`/`Nh`/`Nd` (defaults minutes). |
| `a7l` | `cloudOfferSection` | cli_inner_pretty.js:649098 | function | Conditional "Offer cloud first" section (not remote/bg + `tengu_surreal_dali` + `allow_remote_sessions` + no remote channels). |
| `l7l` | `sessionOnlyFooterLine` | cli_inner_pretty.js:649126 | function | Conditional italic "_Runs until you close this session…_" footer (two channel-dependent variants). |
| `A1f` | `fixedIntervalActionBlock` | cli_inner_pretty.js:649134 | function | Numbered Action block (CronCreate + confirm + execute now) for fixed-interval mode. |
| `g1f` | `buildFixedIntervalLoopPrompt` | cli_inner_pretty.js:649139 | function | Legacy/non-dynamic full prompt (fixed-interval only; inlines the cron table literally @649164). Direct descendant of v2.1.88 `buildPrompt`. |
| `h1f` | `buildDynamicUsageMessage` | cli_inner_pretty.js:649187 | function | Usage message for the dynamic-enabled empty-input case. |
| `y1f` | `buildDynamicLoopPrompt` | cli_inner_pretty.js:649202 | function | Full prompt for the dynamic-enabled non-empty case (fixed-interval section + dynamic self-pace section; inner `t`@649203; `${m1f}`@649238). |
| `agt` | `DEFAULT_INTERVAL` | cli_inner_pretty.js:649363 | constant | `"10m"`. |
| `u1f` | `INTERVAL_RE` | cli_inner_pretty.js:649364 (decl) / 649383 (assign) | constant | `/^\d+[smhd]$/`. |
| `d1f` | `EVERY_RE` | cli_inner_pretty.js:649365 (decl) / 649384 (assign) | constant | `/^every\s+(\d+)\s*(s\|…\|d\|day\|days)\s*$/i`. |
| `m1f` | `CRON_TABLE` | cli_inner_pretty.js:649367 | constant | The `Interval pattern → Cron expression` markdown table (one packed string literal @649368). |
| `f1f` | `LEGACY_USAGE_MESSAGE` | cli_inner_pretty.js:649386 | constant | Legacy usage message (non-dynamic empty-input case). |

---

## Module: `/goal` dual Command (`commands/goal/{index.ts,goal.tsx,goalNonInteractive.ts}`)

A `local-jsx` immediate command + a `local` non-interactive twin (no bundled-skill registrar). The
2.1.156→2.1.183 delta is **only** the local-jsx `description` divergence.

### Shared machinery (`goalNonInteractive.ts`, module `FWe`)

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `FGn` | `isClearKeyword` | cli_inner_pretty.js:454437 | function | `qUp.has(arg.toLowerCase())`. |
| `AQa` | `findLastAchievedGoal` | cli_inner_pretty.js:454440 | function | Scans messages newest-first for the last met (non-sentinel) `goal_status` attachment → `{condition,iterations,durationMs,tokens}`. |
| `gQa` | `formatLastReason` | cli_inner_pretty.js:454450 | function | `` `Last check: ${collapseNewlines(reason.trim())}` ``. |
| `Jdt` | `findStopPromptHooks` | cli_inner_pretty.js:454453 | function | Collects empty-matcher, no-skillRoot, `type:"prompt"` Stop hooks (the ones goal installs). |
| `ego` | `goalGateCheck` | cli_inner_pretty.js:454461 | function | `{message,code}` if hooks-restricted (`hooks_gate`) or untrusted (`trust_gate`), else null. Hooks gate checked **before** trust. |
| `Qdt` | `setGoal` / `validateGoalCondition` | cli_inner_pretty.js:454466 | function | Gate-check → remove old Stop hooks → add empty-matcher `prompt` Stop hook carrying `condition` → set `activeGoal` → append sentinel → analytics. Returns error string or null. |
| `Zdt` | `clearGoal` | cli_inner_pretty.js:454481 | function | Removes the goal Stop hook(s), clears `activeGoal`, appends "met" sentinel, logs removal; returns cleared prompt or null. |
| `hQa` | `makeGoalStatusAttachment` | cli_inner_pretty.js:454494 | function | Builds a `goal_status` sentinel attachment `{met, sentinel:true, condition}`. |
| `Xdt` | `MAX_GOAL_CONDITION_CHARS` | cli_inner_pretty.js:454503 | constant | `4000`. |
| `UGn` | `buildGoalPrompt` | cli_inner_pretty.js:454505 | function | The verbatim Stop-hook directive ("A session-scoped Stop hook is now active with condition: …auto-clears once the condition is met…"). Identical text to v2.1.156 `FT8`@447983. |
| `VUp` | `TRUST_GATE_MESSAGE` | cli_inner_pretty.js:454507 | constant | "/goal is only available in trusted workspaces…". |
| `zUp` | `HOOKS_GATE_MESSAGE` | cli_inner_pretty.js:454508 | constant | "/goal can't run while hooks are restricted…". |
| `qUp` | `CLEAR_KEYWORDS` | cli_inner_pretty.js:454518 | constant | `new Set(["clear","stop","off","reset","none","cancel"])` (assigned in `FWe` init). |
| `mQa` | `crypto` (require) | cli_inner_pretty.js:454518 | variable | `require("crypto")` (for `randomUUID`). |

### Interactive (`goal.tsx`, modules `gPl`/`_Pl`) + registration (`index.ts`, module `HPl`)

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `APl` | `ActiveGoalDialog` | cli_inner_pretty.js:561812 | function | Ink component: active / achieved / no-goal render branches. |
| `Hmf` | `incrementIterations` | cli_inner_pretty.js:561943 | function | `n => n+1` (1s re-render tick for the running-duration). |
| `vmf` | `selectActiveGoal` | cli_inner_pretty.js:561946 | function | `state => state.activeGoal` app-state selector. |
| `NIo` | `LabelRow` | cli_inner_pretty.js:561949 | function | Dimmed `label: ` + wrapped-children flex row. |
| `yPl` | `goalLocalJsxModule` | cli_inner_pretty.js:561986 | object | The `local-jsx` lazy module `{ call: Tmf }`. |
| `Tmf` | `GoalCommand.call` (interactive) | cli_inner_pretty.js:561989 | function | `(onDone,context,args)`: empty→dialog, clear→`clearGoal`, too-long→reject, set→`{shouldQuery,metaMessages:[buildGoalPrompt]}`. |
| `bPl` | `goalLocalModule` | cli_inner_pretty.js:562013 | object | The `local` (non-interactive) lazy module `{ call: wmf }`. |
| `wmf` | `goalNonInteractive` (call) | cli_inner_pretty.js:562015 | function | Non-interactive `(args,context)`: empty→status, clear, too-long, set→`{type:'query',value,prompt}`. v2.1.156 `$jz`@538316. |
| `SPl` | `goalRegistrationInit` | cli_inner_pretty.js:562040 | object | Module-init thunk assigning `Cmf`/`Imf`/`xmf`. |
| `Cmf` | `goalLocalJsxCommand` | cli_inner_pretty.js:562050 | object | `local-jsx`, `name:"goal"`, `immediate:!0`. **DELTA:** `description:"Set a goal Claude checks before stopping"`@562053 (v2.1.156 `qjz`@538353: "Set a goal — keep working until the condition is met"). |
| `Imf` | `goalCommand` (local twin) | cli_inner_pretty.js:562058 | object | `local`, `supportsNonInteractive:!0`, `thinClientDispatch:"post-text"`, `description:"Set a goal — keep working until the condition is met"`@562063, `isHidden:()=>!xr()`, `isEnabled:()=>xr()\|\|_a()`. |
| `xmf` | `goalDefaultExport` | cli_inner_pretty.js:562070 | variable | `= Cmf` (the local-jsx command is the default). |

---

## Module: `/batch` bundled skill (`skills/bundled/batch.ts`)

Coordinator (`h$f`, 3 phases: plan-mode research/decompose into 5-30 units/e2e recipe → spawn
worktree+background agents → track PR table) + worker instructions (`g$f`, step 1 = code-review skill).
`disableModelInvocation:true`; `T_` git gate. 2.1.156→2.1.183 delta = **only** the new `menuDescription`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `pzl` | `registerBatchSkill` | cli_inner_pretty.js:637828 | function | Registers `batch` via `ap()` (call @637829); `userInvocable:!0`, `disableModelInvocation:!0`; **NEW `menuDescription`** @637831. v2.1.156 `nf9`@600205; v2.1.88 ancestor `registerBatchSkill`. |
| `h$f` | `buildBatchPrompt` | cli_inner_pretty.js:637757 | function | 3-phase coordinator prompt (`# Batch: Parallel Work Orchestration`, body @637758-637825). v2.1.156 `gyz`@600132; v2.1.88 `buildPrompt`. |
| `g$f` | `WORKER_INSTRUCTIONS` | cli_inner_pretty.js:637849 (decl) | constant | 5-step worker checklist (step 1 = `Skill` `skill:"code-review"`); assigned @637863-637868 inside init `fzl`@637858. v2.1.156 `Qyz`. |
| `_$f` | `MISSING_INSTRUCTION_MESSAGE` | cli_inner_pretty.js:637852 | constant | Returned when args empty (`Provide an instruction…` + 3 examples). v2.1.156 `cyz`@600226. |
| `y$f` | `NOT_A_GIT_REPO_MESSAGE` | cli_inner_pretty.js:637850 | constant | Returned when not in a git repo. v2.1.156 `dyz`@600224. |
| `uzl` | `MIN_AGENTS` | cli_inner_pretty.js:637847 | constant | `5` (lower bound of unit decomposition). v2.1.156 `cf9`. |
| `dzl` | `MAX_AGENTS` | cli_inner_pretty.js:637848 | constant | `30` (upper bound). v2.1.156 `lf9`. |
| `fzl` | `batchModuleInit` | cli_inner_pretty.js:637858 | function | ESM lazy module-init thunk (`E(()=>…)`) that assigns `g$f`. |
| `T_` | `getIsGit` | cli_inner_pretty.js:51962 (assign) | function | Memoized async git-repo check (`wn(asyncFn)`); emits `is_git_check_started`/`_completed`. *Canonical home: utils/git, not slash-commands.* |

---

## Module: `/simplify` bundled skill (`skills/bundled/simplify.ts`)

4 parallel review agents (Reuse `bdt` / Simplification `fLe` / Efficiency `mLe` / Altitude `ALe`) via the
Agent tool → apply fixes; quality-only (defers bugs to `/code-review`). 2.1.156→2.1.183 delta = new
`menuDescription` + the Efficiency angle's closure/memory-leak paragraph.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `OKl` | `registerSimplifySkill` | cli_inner_pretty.js:647978 | function | Registers `simplify` via `ap()`; `menuDescription`@647981, `description`@647982, `argumentHint:"[<target>]"`@647984; `getPromptForCommand` **prepends** `` Review target: `<arg>` ``@647987-647999. v2.1.156 `vO9`@601350; v2.1.88 `registerSimplifySkill`. |
| `BUt` | `SKILL_NAME` (`"simplify"`) | cli_inner_pretty.js:372051 | constant | The slash-command name. |
| `ZOf` | `SIMPLIFY_PROMPT` | cli_inner_pretty.js:648003 (decl) | variable | Template assembled from `${_dt}${vs}${bdt}${fLe}${mLe}${ALe}`; assigned in module-init `NKl`@648004 (body @648007-648036). v2.1.156 `Ehz`. |
| `NKl` | `simplifyModuleInit` | cli_inner_pretty.js:648004 | function | ESM lazy module-init thunk (`E(()=>…)`) assigning `ZOf`. v2.1.156 `kO9`. |
| `_dt` | `DIFF_PREAMBLE` (Phase 0) | cli_inner_pretty.js:435519 | constant | "## Phase 0 — Gather the diff" block. Shared review-angle const (reused by `/code-review`). v2.1.156 `dq$`. |
| `bdt` | `REUSE_ANGLE_BODY` | cli_inner_pretty.js:435521 | constant | Body of the **Reuse** angle (header hardcoded in `ZOf`). v2.1.156 `BI8`. |
| `fLe` | `SIMPLIFICATION_ANGLE` | cli_inner_pretty.js:435525 | constant | Full **Simplification** angle (header + body). v2.1.156 `cq$`. |
| `mLe` | `EFFICIENCY_ANGLE` | cli_inner_pretty.js:435531 | constant | Full **Efficiency** angle. **DELTA:** gained the closure/captured-environment memory-leak paragraph vs v2.1.156 `lq$`. |
| `Sdt` | `CONVENTIONS_ANGLE` | cli_inner_pretty.js:435541 | constant | "### Conventions (CLAUDE.md)" angle — **defined but NOT wired into `/simplify`** (consumed by `/code-review`). No `/simplify` ancestor. |
| `ALe` | `ALTITUDE_ANGLE` | cli_inner_pretty.js:435554 | constant | Full **Altitude** angle (the 4th agent; the post-v2.1.88 addition — v2.1.88 had 3 agents). v2.1.156 `nq$`. |

---

## Module: Shared tool-name constants (interpolated into the prompts)

All `"Name"` string constants; canonical homes are the respective tool modules (`symbol_index_core_execution.md`
for Agent/Skill/Task*; platform/integration for Cron/ScheduleWakeup/Monitor/PushNotification). Listed here
because the four slash-command prompts interpolate them verbatim.

| Obfuscated | Readable | File:Line | Type | Used by |
|------------|----------|-----------|------|---------|
| `vs` | `AGENT_TOOL_NAME` (`"Agent"`) | cli_inner_pretty.js:149939 | constant | batch Phase 2, simplify Phase 1. |
| `mH` | `SKILL_TOOL_NAME` (`"Skill"`) | cli_inner_pretty.js:221449 | constant | batch worker step 1 (`code-review`), loop cloud-offer (`schedule`). |
| `Ff` | `ASK_USER_QUESTION_TOOL_NAME` (`"AskUserQuestion"`) | cli_inner_pretty.js:221315 | constant | batch Phase 1 step 3, loop cloud-offer. |
| `A7` | `ENTER_PLAN_MODE_TOOL_NAME` (`"EnterPlanMode"`) | cli_inner_pretty.js:221314 | constant | batch Phase 1 step 1. |
| `yx` | `EXIT_PLAN_MODE_TOOL_NAME` (`"ExitPlanMode"`) | cli_inner_pretty.js:152252 | constant | batch Phase 1 step 5. |
| `yv` | `MONITOR_TOOL_NAME` (`"Monitor"`) | cli_inner_pretty.js:220793 | constant | loop dynamic-mode event-gating. |
| `$g` | `SCHEDULE_WAKEUP_TOOL_NAME` (`"ScheduleWakeup"`) | cli_inner_pretty.js:220800 | constant | loop dynamic-mode self-pace. |
| `IL` | `TASK_LIST_TOOL_NAME` (`"TaskList"`) | cli_inner_pretty.js:220833 | constant | loop dynamic-mode (find monitor task ID). |
| `uP` | `TASK_STOP_TOOL_NAME` (`"TaskStop"`) | cli_inner_pretty.js:220834 | constant | loop dynamic-mode (stop monitor). |
| `rI` | `CRON_CREATE_TOOL_NAME` (`"CronCreate"`) | cli_inner_pretty.js:221670 | constant | loop fixed-interval/cron-default action. |
| `U2` | `CRON_DELETE_TOOL_NAME` (`"CronDelete"`) | cli_inner_pretty.js:221671 | constant | loop confirm (cancel-sooner). |
| `ree` | `DEFAULT_MAX_AGE_DAYS` | cli_inner_pretty.js:221680 | constant | `recurringMaxAgeMs/86400000` — loop auto-expiry days. |
| `G9` | `PUSH_NOTIFICATION_TOOL_NAME` (`"PushNotification"`) | cli_inner_pretty.js:220751 | constant | loop `pushNotifOutcomeSuffix` (`i7l`). |

---

## Module: Gates / flags / shared helpers (consumed, not owned, by slash commands)

Predicates and telemetry helpers the four commands consume; canonical homes are feature/platform/execution
indices as flagged. Included for traceability.

| Obfuscated | Readable | File:Line | Type | Used by |
|------------|----------|-----------|------|---------|
| `ct` | `isFeatureFlagEnabled` | cli_inner_pretty.js:146595 | function | loop (`tengu_surreal_dali`), gate reads. |
| `yK` | `featureFlagBool` | cli_inner_pretty.js:146611 | function | `IB`/cron gate read. |
| `di` | `isFeatureAllowed` | cli_inner_pretty.js:147998 | function | loop (`allow_remote_sessions` entitlement). |
| `qb` | `getAllowedChannels` | cli_inner_pretty.js:3665 | function | loop cloud-offer (`.length===0` ⇒ no remote channels). |
| `yi` | `isBackgroundSession` | cli_inner_pretty.js:103598 | function | loop cloud-offer/footer gate. |
| `st` | `parseBoolean` | cli_inner_pretty.js:163 | function | loop (`CLAUDE_CODE_REMOTE`), env truthy parse. |
| `xr` | `isNonInteractive` | cli_inner_pretty.js:3151 | function | goal twin `isHidden`/`isEnabled`; goal gate (trust skip). |
| `_a` | `isRemoteWorkspace` | cli_inner_pretty.js:3638 | function | goal twin `isEnabled`. |
| `Lp` | `isTrusted` | cli_inner_pretty.js:591980 | function | goal `ego` trust gate. |
| `f2` | `isHooksDisabledByPolicy` | cli_inner_pretty.js:150375 | function | goal `ego` hooks gate. |
| `Qse` | `isHooksRestricted` | cli_inner_pretty.js:150369 | function | goal `ego` hooks gate. |
| `g0e` | `getStopHooks` | cli_inner_pretty.js:385695 | function | goal `findStopPromptHooks` (resolves the merged `Stop` hook map). |
| `vn` | `pluralize` | cli_inner_pretty.js:10069 | function | goal status/dialog (`turn`/`turns`). |
| `Kd` | `collapseNewlines` | cli_inner_pretty.js:10156 | function | goal `formatLastReason`. |
| `xt` | `getSessionId` | cli_inner_pretty.js:2661 | function | goal set/clear (session-scoped hook). |
| `rb` | `getOutputTokens` | cli_inner_pretty.js:2816 | function | goal `tokensAtStart` + running-token display. |
| `nnn` | `GOAL_GLYPH` | cli_inner_pretty.js:53753 | constant | `"◎"` (U+25CE), prefix of "Goal active" dialog title. |
| `Qe` | `sanitizeFeatureName` | cli_inner_pretty.js:137 | function | goal analytics `via:sanitizeFeatureName("goal")`. |
| `G` | `logEvent` | cli_inner_pretty.js:3810 | function | goal `tengu_stop_hook_added`/`_removed`. |
| `Le` | `logFeatureOk` (goal) | cli_inner_pretty.js:44569 | function | goal `logFeatureOk("goal_set")`. *Distinct from registrar's `Le`@547034 callsite.* |
| `Rt` | `logFeatureSad` (goal) | cli_inner_pretty.js:44575 | function | goal `logFeatureSad("goal_set", code)` (gate/too_long). |

---

## Notes on home-index placement

When merged into the central index (single source of truth), split as follows:

- **`symbol_index_infra_integration.md` (Slash Commands)** — the primary home: registrar/dispatch
  (`ap`, `Lwo`, `oV`, `Gwe`, `txl`, `scf`, `icf`, `ccf`, `ucf`, `dcf`, `x6n`, `exl`, `acf`, `lcf`,
  `FJn`, `IJl`), the loop skill (`_1f` + builders `i7l`/`p1f`/`a7l`/`l7l`/`A1f`/`g1f`/`h1f`/`y1f` +
  consts `agt`/`u1f`/`d1f`/`m1f`/`f1f` + the `_9e` module `r1i`/`t5r`/`n5r` + sentinels
  `n1i`/`LPt`/`Rtt`/`wCe` + preambles `JWr`/`qOi`), the goal command (`FGn`/`AQa`/`gQa`/`Jdt`/`ego`/
  `Qdt`/`Zdt`/`hQa`/`Xdt`/`UGn`/`VUp`/`zUp`/`qUp`/`mQa` + `APl`/`Hmf`/`vmf`/`NIo`/`yPl`/`Tmf`/`bPl`/
  `wmf`/`SPl`/`Cmf`/`Imf`/`xmf`), the batch skill (`pzl`/`h$f`/`g$f`/`_$f`/`y$f`/`uzl`/`dzl`/`fzl`),
  and the simplify skill (`OKl`/`BUt`/`ZOf`/`NKl`/`_dt`/`bdt`/`fLe`/`mLe`/`Sdt`/`ALe`).
- **`symbol_index_core_execution.md`** — the tool-name constants the prompts merely interpolate
  (`vs` Agent, `mH` Skill, `IL` TaskList, `uP` TaskStop) and the agent-loop dispatch site @386870.
- **`symbol_index_core_features.md`** — loop gates (`IB`/`jAe`/`o5r`/`YTn`/`TCe`), the Cron/ScheduleWakeup/
  Monitor tool-name constants (`rI`/`U2`/`ree`/`$g`/`yv`/`G9`/`Ff`/`A7`/`yx`), and the goal/hooks helpers
  (`g0e`/`f2`/`Qse`).
- **`symbol_index_infra_platform.md`** — generic predicates/telemetry the commands consume
  (`ct`/`yK`/`di`/`qb`/`yi`/`st`/`xr`/`_a`/`Lp`/`xt`/`rb`/`Qe`/`G`/`Le`/`Rt`/`vn`/`Kd`) and `T_` (getIsGit).

> **Status.** This is the comprehensive, deduplicated additions table the
> [`43_slash_commands/`](../43_slash_commands/) v2.1.183 module docs reference via list-format
> `Related Symbols` sections. Every `File:Line` was verified by reading the v2.1.183 bundle declaration
> during this pass.
