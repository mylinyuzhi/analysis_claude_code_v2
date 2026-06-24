# Reconstruction Conventions — Slash Commands `loop` / `goal` / `batch` / `simplify` (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of four user-facing slash commands —
> **`/loop`**, **`/goal`**, **`/batch`**, **`/simplify`** — **as they exist in Claude Code v2.1.183**,
> written as clean TypeScript organized the way the genuine Anthropic source tree
> (v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`) organizes it.
> This reconstructs the *whole* command, including carryover from earlier versions — not just the delta.

## Why this module's evidence is unusually strong

Three of the four commands have a **direct named-TypeScript ancestor** in the v2.1.88 source tree:

| 2.1.183 command | registration | v2.1.88 named ancestor | tier-3 strength |
|-----------------|--------------|------------------------|-----------------|
| `/simplify` | `ap()` bundled skill (`OKl`@647979, `BUt`="simplify"@372051) | `src/skills/bundled/simplify.ts` `registerSimplifySkill` | **template** (evolved 3→4 agents) |
| `/batch` | `ap()` bundled skill (`pzl`@637844) | `src/skills/bundled/batch.ts` `registerBatchSkill` | **template** (worker step 1 simplify→code-review) |
| `/loop` | `ap()` bundled skill (`_1f`@649252) | `src/skills/bundled/loop.ts` `registerLoopSkill` | **template** (fixed-only → +dynamic/loop.md/autonomous) |
| `/goal` | dual `Command`: `local-jsx` `Cmf`@562058 + `local` `Imf`@562065 | *none* (2.1.156-era addition) | **shape only** (mirror `commands/effort/`) |

The `ap()` registrar @546973 in the 2.1.183 bundle **is** v2.1.88's
`registerBundledSkill()` (`src/skills/bundledSkills.ts`) — same emitted `Command` object
(`type:'prompt'`, `source:'bundled'`, `getPromptForCommand`, `isHidden:!userInvocable`, …).
So for the three skills the v2.1.88 file is a near-complete template; reconstruction = **port the
v2.1.88 file forward to the v2.1.183 prompt text + registration flags**, not invent shape.

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle**
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   **Every** reconstructed function, constant, branch, and verbatim prompt string MUST be verified by
   *reading the exact line(s)* here. This is the only source of truth for the v2.1.183 behavior and
   for the exact prompt wording (which evolved). Obfuscated names re-mangle every build — never trust
   a name from another version; re-derive it here.
   - Rich assets corroborate: `extract/assets/slash_commands.json` (lists `/batch`,`/goal`,`/loop`;
     `/simplify` is model-invocable-but-not-listed), `assets/prompts/194_simplify-4-cleanup-agents-in-parallel.txt`,
     `assets/prompts/093|097_autonomous-loop-*.txt`, `assets/feature_gates.json`, `assets/env_vars.json`.

2. **SCAFFOLD — the v2.1.156 obfuscated bundle (before-picture)**
   `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines).
   All four commands already exist here (`goal`@538353, `batch`@600205, `simplify`@601352,
   `loop`@602614). Use ONLY to compute the 2.1.156→2.1.183 **delta** (what changed) — re-mangled names,
   shifted lines. Do not copy logic from it; read the 183 bundle directly.

3. **CONVENTION + TEMPLATE — the v2.1.88 named-TS source**
   `/lyz/codespace/3rd/claude-code/src`. For `batch`/`loop`/`simplify`, the files
   `src/skills/bundled/{batch,loop,simplify}.ts` are the **direct readable ancestors** — mirror their
   structure exactly (module-level prompt `const`s, `buildPrompt(args)` helper, `registerXSkill()`
   exporter calling `registerBundledSkill({...})`, ESM `.js` import specifiers, tool-name constants
   imported from `tools/*/constants.js`). For `goal`, there is no ancestor — mirror the `Command`
   convention from `src/commands/effort/{index.ts,effort.tsx}` (a `local-jsx` immediate command) plus
   the `type:'local'` non-interactive twin shape. The registrar shape is `src/skills/bundledSkills.ts`
   (`BundledSkillDefinition`, `registerBundledSkill`) and the registry is `src/skills/bundled/index.ts`
   (`initBundledSkills`, `feature()`-gated requires).

## Target file layout (mirror v2.1.88 `src/` tree)

```
reconstructed_source/
├── skills/
│   ├── bundledSkills.ts          # registerBundledSkill registrar + BundledSkillDefinition (ap@546973)
│   └── bundled/
│       ├── index.ts              # initBundledSkills registry + feature() gating (183 module-init fns)
│       ├── simplify.ts           # registerSimplifySkill — 4 cleanup agents (OKl/ZOf/_dt/...)
│       ├── batch.ts              # registerBatchSkill — coordinator + worker (pzl/h$f/g$f/...)
│       └── loop.ts               # registerLoopSkill — fixed + dynamic + loop.md + autonomous (_1f/...)
└── commands/
    └── goal/
        ├── index.ts              # local-jsx Cmf + local Imf Command defs
        ├── goal.tsx              # interactive component (APl) + selectors (vmf) + Tmf call
        └── goalNonInteractive.ts # the type:'local' thin-client path (wmf) + setGoal/clearGoal/validate
```

## File format (each reconstructed `.ts`/`.tsx`)

- Clean, idiomatic, **readable** TypeScript — port the v2.1.88 ancestor forward where one exists; for
  `goal`, write what the source plausibly looked like in the `effort/` idiom.
- **Every** top-level function/const carries an anchor comment tying it to evidence, e.g.
  `// 2.1.183: buildBatchPrompt = h$f @637760`. Non-trivial branches get inline `// @<line>` anchors.
- **Verbatim prompt text** (the big template strings) MUST be copied *exactly* from the 183 bundle —
  these are the actual user-facing behavior. Do not paraphrase, reflow, or "improve" wording. Where the
  bundle uses `${X}` interpolations of tool-name constants, reproduce the same interpolation with the
  readable constant name (e.g. `${CRON_CREATE_TOOL_NAME}`), and note the obf source in a comment.
- **File header block** listing: v2.1.183 source regions covered; the v2.1.88 ancestor/convention path;
  the 2.1.156→2.1.183 delta in one line; a one-line cross-validation note.
- **No invented behavior.** If a detail can't be confirmed in the 183 bundle, omit it or mark
  `// UNVERIFIED: …` and report it. Faithful-to-source beats plausible-but-guessed.
- English only.

## Established symbol map (v2.1.183 — re-derive, but start here)

**Registrar / dispatch**
- `registerBundledSkill` = `ap` @546973 · `getPromptForCommand` consumed by slash dispatch
- bundled-skill `Command` fields: `type:'prompt'`, `source:'bundled'`, `userInvocable`, `disableModelInvocation`,
  `isHidden:!userInvocable`, `menuDescription`, `whenToUse`, `argumentHint`, `aliases`, `allowedTools`, `isEnabled`

**Tool-name constants (shared)**
- `AGENT_TOOL_NAME` = `vs`="Agent" @149939
- `SKILL_TOOL_NAME` = `mH`="Skill" @221449
- `EXIT_PLAN_MODE_TOOL_NAME` = `yx`="ExitPlanMode" @152252
- `ASK_USER_QUESTION_TOOL_NAME` = `Ff`="AskUserQuestion" @221315
- `MONITOR_TOOL_NAME` = `yv`="Monitor" @220793
- `SCHEDULE_WAKEUP_TOOL_NAME` = `$g`="ScheduleWakeup" @220800
- `TASK_LIST_TOOL_NAME` = `IL`="TaskList" @220833
- `TASK_STOP_TOOL_NAME` = `uP`="TaskStop" @220834
- `CRON_CREATE_TOOL_NAME` = `rI` (resolve), `CRON_DELETE_TOOL_NAME` = `U2` (resolve)
- `jsonStringify`/`Re` = `Re` (JSON.stringify helper @9461) used by schedule prompt

**`goal`** (module regions ~454437-454520, ~561900-562130)
- `MAX_GOAL_CONDITION_CHARS` = `Xdt`=4000 @454503
- `buildGoalPrompt` = `UGn` @454505
- `validateGoalCondition` = `Qdt` @454466 · `clearGoal` = `Zdt` @454481 · `isClearKeyword` = `FGn` @454437
- `formatLastReason` = `gQa` @454450 · `pluralize` = `vn` @10069
- interactive: `GoalCommand`/call `Tmf` (yPl@562040), component `APl`, selector `selectActiveGoal` = `vmf`,
  `incrementIterations` = `Hmf`, label row `NIo`
- non-interactive `local` call = `wmf` (bPl@562010); local-jsx def `Cmf`, local def `Imf`, default export `xmf`
- analytics `logEvent`-like = `Rt`; gates `isNonInteractive` = `xr` (=`!isInteractive`), `_a`

**`simplify`** (OKl@647979, ZOf@648007, angles from `_dt`@435519 + `bdt`/`fLe`/`mLe`/`ALe`)
- `registerSimplifySkill` = `OKl` · `SIMPLIFY_PROMPT` = `ZOf` · skill name `BUt`="simplify"@372051
- four review-angle blocks (Reuse / Quality / Efficiency / **Altitude** — the new 4th vs 2.1.88's 3)

**`batch`** (pzl@637844, h$f coordinator, g$f worker, _$f/y$f messages)
- `registerBatchSkill` = `pzl` · `buildBatchPrompt` = `h$f` · `WORKER_INSTRUCTIONS` = `g$f`
- `MISSING_INSTRUCTION_MESSAGE` = `_$f` · `NOT_A_GIT_REPO_MESSAGE` = `y$f` · `getIsGit` = `T_`
- `MIN_AGENTS` = `uzl`=5 · `MAX_AGENTS` = `dzl`=30

**`loop`** (_1f@649252; builders y1f/h1f/A1f/g1f/f1f/p1f/a7l/i7l/l7l@649085-649145; module `_9e`)
- `registerLoopSkill` = `_1f` · `DEFAULT_INTERVAL` = `agt`="10m"
- `INTERVAL_RE` = `u1f`=/^\d+[smhd]$/ · `EVERY_RE` = `d1f` · `CRON_TABLE` = `m1f`
- gates: `isDynamicLoopEnabled` = `jAe`@221035 · `isLoopEnabled` = `IB`@221593
- loop module `_9e` (HUe/EUe): `isLoopDefaultPromptEnabled`, `readLoopFile`, `LOOP_FILE_SENTINEL`,
  `LOOP_FILE_DYNAMIC_SENTINEL`, `getAutonomousLoopPreamble`, `logAutonomousLoopActivation`,
  `AUTONOMOUS_LOOP_SENTINEL` (Rtt), `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` (wCe)
- `DEFAULT_MAX_AGE_DAYS` = `ree` (recurring auto-expire)

If you discover a NEW symbol not above, record it in your manifest for the symbol index.
