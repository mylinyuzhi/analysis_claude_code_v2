# Anchor Dossier — Bundled-Skill Registrar + Registry (v2.1.183)

Unit: the shared infrastructure behind `/batch`, `/loop`, `/simplify` — the
`registerBundledSkill` registrar (`ap`), the registry array + `getBundledSkills`
accessor, the lazy file-extraction machinery, and the `initBundledSkills`
registry (`FJn`). Includes brief documentation of slash-dispatch consumption.

All line numbers refer to the v2.1.183 bundle:
`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.

## Load-bearing symbols

### Registrar / registry (`skills/bundledSkills.ts`)

| Readable | Obf | Line | Role |
|----------|-----|------|------|
| `registerBundledSkill` | `ap` | 546973 | Emits the `Command{type:'prompt',source:'bundled'}` and pushes to registry |
| `getBundledSkills` | `Lwo` | 547023 | Returns a copy of the registry; `[]` when bundled skills disabled |
| `areBundledSkillsDisabled` | `oV` | 392809 | `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS \|\| settings.disableBundledSkills===true` |
| `defineLazyOverride` | `Gwe` | 193293 | Installs lazy getter for fn-valued `description`/`argumentHint`/`whenToUse` |
| `getBundledSkillExtractDir` | `txl` | 547027 | `join(getBundledSkillsRoot(), name)` |
| `extractBundledSkillFiles` | `scf` | 547030 | Lazy first-invocation extract; logs `skill_bundled_extract`; returns dir or null |
| `writeSkillFiles` | `icf` | 547042 | Group-by-parent, `mkdir(recursive,0o700)`, write each file |
| `safeWriteFile` | `ccf` | 547058 | `open(p, lcf, 384)` → `writeFile('utf8')` → `close()` |
| `resolveSkillFilePath` | `ucf` | 547066 | Normalize + traversal guard; throws on `..`/absolute |
| `prependBaseDir` | `dcf` | 547072 | Prefix prompt with "Base directory for this skill: <dir>\n\n" |
| `bundledSkills` (registry array) | `exl` | 547079 decl / init 547085 | `var exl`; set to `[]` in module-init `OH` |
| `O_NOFOLLOW const` | `acf` | 547086 | `_qt.constants.O_NOFOLLOW ?? 0` |
| `SAFE_WRITE_FLAGS const` | `lcf` | 547087 | `O_WRONLY\|O_CREAT\|O_EXCL\|acf` |
| module-init thunk | `OH` | 547080 | sets `exl=[]`, `acf`, `lcf`; requires fs/path |
| `getBundledSkillsRoot` | `x6n` | 575179 | `join(vB(), "bundled-skills", VERSION, randomBytes(16).hex)` — per-process nonce |

### Registry init (`skills/bundled/index.ts`)

| Readable | Obf | Line | Role |
|----------|-----|------|------|
| `initBundledSkills` | `FJn` | 660991 | Idempotent registry init; calls each `registerXSkill()` |
| init latch | `IJl` | 661027 | `var IJl=!1`; guards re-entry |
| `registerSimplifySkill` | `OKl` | 647978 (ap-call 647979) | Called unconditionally @661006 |
| `registerBatchSkill` | `pzl` | 637828 (ap-call 637829) | Called unconditionally @661007 |
| `registerLoopSkill` | `_1f` | 649251 (ap-call 649252) | Lazy-bound + called unconditionally @661011-661012 |

### Loop gates (runtime, not registration)

| Readable | Obf | Line | Role |
|----------|-----|------|------|
| `isDynamicLoopEnabled` | `jAe` | 221035 | `ct("tengu_kairos_loop_dynamic", false)` — picks dynamic-pacing prompt branch |
| `isLoopEnabled` | `IB` | 221593 | `!CLAUDE_CODE_DISABLE_CRON && yK("tengu_kairos_cron", true)` — the `/loop` `isEnabled` |
| gate read helper | `ct` | 146595 | Reads override map then gate config |
| gate read helper (bool) | `yK` | 146611 | `yK(name,default,…) => ct(name,default)` |

### Tool-name constants (interpolated in `/loop` prompts; resolved this pass)

| Readable | Obf | Line | Value |
|----------|-----|------|-------|
| `AGENT_TOOL_NAME` | `vs` | 149939 | `"Agent"` |
| `SKILL_TOOL_NAME` | `mH` | 221449 | `"Skill"` |
| `ASK_USER_QUESTION_TOOL_NAME` | `Ff` | 221315 | `"AskUserQuestion"` |
| `MONITOR_TOOL_NAME` | `yv` | 220793 | `"Monitor"` |
| `SCHEDULE_WAKEUP_TOOL_NAME` | `$g` | 220800 | `"ScheduleWakeup"` |
| `TASK_LIST_TOOL_NAME` | `IL` | 220833 | `"TaskList"` |
| `TASK_STOP_TOOL_NAME` | `uP` | 220834 | `"TaskStop"` |
| `CRON_CREATE_TOOL_NAME` | `rI` | 221670 | `"CronCreate"` (RESOLVED) |
| `CRON_DELETE_TOOL_NAME` | `U2` | 221671 | `"CronDelete"` (RESOLVED) |
| `DEFAULT_MAX_AGE_DAYS` | `ree` | 221680 | `U9.recurringMaxAgeMs / 86400000` — recurring auto-expire days (RESOLVED) |

## Emitted Command field set (verified against `ap`@546973, re-read 546987-547016)

```
type: "prompt"
name
description                  // "" if fn-valued (lazy getter installed later)
menuDescription              // 2.1.183 NEW
aliases
subcommands
hasUserSpecifiedDescription: true
allowedTools: e.allowedTools ?? []
disallowedTools: e.disallowedTools ?? []
argumentHint                 // undefined if fn-valued
whenToUse                    // undefined if fn-valued
model
disableModelInvocation: ?? false
userInvocable: ?? true
contentLength: 0
source: "bundled"
loadedFrom: "bundled"
hooks
skillRoot                    // set only when files present
context
agent
isEnabled
isHidden: !(userInvocable ?? true)
progressMessage: e.progressMessage ?? "running"   // 2.1.183: now configurable
getPromptForCommand          // wrapped to prepend base-dir when files present
getEffort
getArgumentCompletions       // 2.1.183 NEW
```
Then `Gwe(o,"description",…)`, `Gwe(o,"argumentHint",…)`, `Gwe(o,"whenToUse",…)`
install lazy getters for any fn-valued fields, and `exl.push(o)`.

## Verbatim strings captured

- `prependBaseDir` prefix (`dcf`@547073-547075), exact incl. trailing blank line:
  `"Base directory for this skill: ${baseDir}\n\n"`
- Extract failure debug line (`scf`@547036): ``Failed to extract bundled skill '${e}' to ${n}: ${...}``
- Traversal-guard throw (`ucf`@547069): `bundled skill file path escapes skill dir: ${t}`
- getBundledSkillsRoot path segment (`x6n`@575183): `"bundled-skills"` + `VERSION` ("2.1.183") + 16-byte hex nonce
- `/simplify` Command.description (`OKl`@647982, verbatim, `—`→`—` decoded):
  `Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.`
- `/simplify` menuDescription (`OKl`@647981): `Clean up the changed code without changing behavior`
- `/batch` not-a-git-repo message (`y$f`@637850-637851, verbatim):
  ``This is not a git repository. The `/batch` command requires a git repo because it spawns agents in isolated git worktrees and creates PRs from each. Initialize a repo first, or run this from inside an existing one.``
- `/batch` missing-instruction message (`_$f`@637852-637857, verbatim multi-line with examples)
- `/loop` menuDescription (`_1f`@649254): `Repeat a prompt or command on an interval (e.g. /loop 5m /foo)`
- `/loop` whenToUse (`_1f`@649262, verbatim): `When the user wants to set up a recurring task, poll for status, or run something repeatedly on an interval (e.g. "check the deploy every 5 minutes", "keep running /babysit-prs"). Do NOT invoke for one-off tasks.`

(Per-command full prompt bodies — `ZOf`/`g$f`/the loop builders — belong to the
per-command reconstruction files, not this registrar dossier; captured there.)

## Slash-dispatch consumption (how `getPromptForCommand` result becomes a user turn)

Dispatch site: prompt-command runner @386870 (`a = await e.getPromptForCommand(t, n)`).

1. `e` is the resolved bundled-skill `Command`; `t` = the argument string the
   user typed after the slash command; `n` = the `ToolUseContext`.
2. `await e.getPromptForCommand(t, n)` returns `ContentBlockParam[]` (`a`). For
   skills with `files`, this is already wrapped (via `ap`) to extract reference
   files once and prepend the base-directory text block.
3. If the command declares `hooks` (and hooks aren't suppressed for the source),
   they are registered (@386871-386873).
4. The text blocks are flattened (`a.filter(type==="text").map(.text).join("\n\n")`)
   for analytics/active-skill tracking (`syt(...)`, `options.activeSkill = …`).
5. The blocks are merged into the next user turn: `m = [...o, ...r, ...a]` where
   `o`/`r` are any preamble/context blocks (@386886). This array is the content of
   the **synthetic user message** fed back into the agent loop, so the bundled
   skill's prompt template runs exactly as if the user had typed it.
6. `allowedTools`/`disallowedTools` from the Command are applied to the tool
   permission context for that turn (@386883-386885), and `model`/`getEffort` are
   carried on the returned dispatch result.

(For the *immediate*/non-prompt branch — used by e.g. `/goal`'s `type:'local'`
twin — the runner instead returns `{messages, shouldQuery:true, …}` @386861; that
path is documented in the goal reconstruction, not here.)

## v2.1.88 ancestor mapping

| v2.1.183 (`ap`/`FJn`) | v2.1.88 named ancestor |
|-----------------------|------------------------|
| `registerBundledSkill` (`ap`) | `registerBundledSkill` — `src/skills/bundledSkills.ts` |
| `BundledSkillDefinition` (inferred from `ap` param) | `BundledSkillDefinition` — same file |
| `getBundledSkills` (`Lwo`) | `getBundledSkills` — same file |
| `defineLazyOverride` (`Gwe`) | *(no ancestor — 2.1.183 mechanism for fn-valued fields)* |
| `extractBundledSkillFiles` (`scf`) | `extractBundledSkillFiles` — same file |
| `writeSkillFiles` (`icf`) | `writeSkillFiles` — same file |
| `resolveSkillFilePath` (`ucf`) | `resolveSkillFilePath` — same file |
| `prependBaseDir` (`dcf`) | `prependBaseDir` — same file |
| `safeWriteFile` (`ccf`) | `safeWriteFile` — same file |
| `getBundledSkillExtractDir` (`txl`) | `getBundledSkillExtractDir` — same file |
| `initBundledSkills` (`FJn`) | `initBundledSkills` — `src/skills/bundled/index.ts` |

## 2.1.156 → 2.1.183 delta

Registrar (`bA`@524187 in 2.1.156 → `ap`@546973 in 2.1.183):
- **Added** emitted field `menuDescription` (from `definition.menuDescription`).
- **Added** emitted field `getArgumentCompletions`.
- `progressMessage` changed from the hardcoded `"running"` (156) to
  `definition.progressMessage ?? "running"` (183) — now configurable.
- Everything else (the `type/source/loadedFrom/skillRoot/getEffort/…` set and the
  three `Gwe`-installed lazy getters) is byte-identical to 156.

Registry / gating:
- 2.1.88 gated `/loop` behind `feature('AGENT_TRIGGERS')`. In 2.1.183 (`FJn`)
  `/loop` is registered **unconditionally**; visibility is decided lazily by the
  skill's own `isEnabled = isLoopEnabled` (`IB`, `tengu_kairos_cron`). `/simplify`
  and `/batch` are likewise unconditional (no feature gate).
- 2.1.156 → 2.1.183 added `menuDescription` to the three skills' definitions, and
  added the dynamic-pacing `/loop` branch selected at prompt-build time by
  `isDynamicLoopEnabled` (`jAe`, `tengu_kairos_loop_dynamic`, default false) — a
  runtime prompt gate, NOT a registration gate.

## v2.1.156 reference anchors (before-picture)

`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- registrar `bA` @524187 (no `menuDescription`, no `getArgumentCompletions`,
  hardcoded `progressMessage:"running"`); registry array `Ji4`; accessor `Xi4`;
  extract-dir `Li4`; root `o$q`; lazy-getter installer `nwH`.
- `/batch` registration @600205 (no `menuDescription`).

## Open questions

- `getArgumentCompletions` is emitted by `ap` but none of our three skills supply
  one; the consumer of the completion provider was not traced in this pass.
- The `subcommands` field is emitted but unused by batch/loop/simplify (all omit
  it); confirmed only that `ap` passes it through verbatim.
- Exact telemetry helpers behind `Le`/`Me` in `scf` are referenced as
  `logEvent`/`logError` in the reconstruction; their precise definitions were not
  re-derived here (out of scope for the registrar unit).
