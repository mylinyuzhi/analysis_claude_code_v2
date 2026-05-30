# Symbol Additions — v2.1.156 Skill System (module 10_skill_system)

These mappings cover every obfuscated identifier introduced or touched by the
**v2.1.143 → v2.1.156 Skill-System delta**: the two mid-session skill-reload
entrypoints (`/reload-skills` command + SessionStart `reloadSkills` hook field) and the
shared cache-invalidation primitive; the new `disallowed-tools` skill/slash-command
frontmatter field (schema, both parsers, the inline `c28` union and the forked
`disallowed_tools` permission layer, and the cleared-on-next-message reset); the
`context: fork` self-reinvoke recursion guard (`spawnedBySkill` breadcrumb, errorCode 9,
`tengu_skill_tool_fork_recursion_blocked`); the `effort:` frontmatter delta (`xhigh`
level, the `kind:"effort"` permission layer, and the status-bar fix); and the three
bundled skill bodies (`/simplify`, `/code-review`, `/claude-api`) plus the bundled-skill
registrar.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and
type. Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that
location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` — the reload *primitive*
  (`clearSkillCaches`, the `skillsLoaded` signal, memoized loaders, conditional-skill
  state), `context: fork`, the `effort` frontmatter parser, and the `registerBundledSkill`
  shape all have precursors. The `/reload-skills` command, the SessionStart
  `reloadSkills` hook field, the `disallowed-tools` *skill/slash-command* frontmatter
  field, the `spawnedBySkill` fork-recursion guard, the `xhigh` effort level, the entire
  `permissionLayers` mechanism, and `/code-review` as a bundled skill are **NEW
  post-2.1.88**.
- Module docs:
  `claude_code_v_2.1.156/analyze/10_skill_system/{skill_reload_midsession,skill_disallowed_tools,skill_fork_recursion_guard,skill_effort_frontmatter,bundled_skill_bodies}.md`

> **Home-index placement (single source of truth).** When merged into the central index,
> split the rows by their `category`:
> - **`symbol_index_core_features.md`** (Skills / Effort / Hooks) — the reload
>   command + cache primitive + loaders + conditional state: `Zzz`, `Gzz`, `$U`, `_C`,
>   `wu`, `vG8`, `Cw4`, `DRH`, `Bo`, `Xc`, `L2`, `BL`, `sH9`, `gDz`, `nd6`, `RDH`, `zRH`,
>   `Kd6`, `tx`, `LG8`, `PG8`, `Gp6`, `_RH`, `dDz`, `OP$`; the frontmatter schemas and
>   skill parsers `aL6`, `GL5`, `cd6`, `Ov$`; and the bundled-skill bodies and registrars
>   `bA`, `vO9`, `Ehz`, `Y18`, `zO9`, `eyz`, `Qyz`, `tSz`, `cSz`, `nSz`, `oSz`, `rSz`,
>   `aSz`, `uj9`, `d1q`, `c1q`, `wj9`, `RAz`, `mAz`, `nwH`.
> - **`symbol_index_core_execution.md`** (Tools / Memoize / Subagent) — `ZX`, `sq`,
>   `TL5`, `X$`, `v8`, `cx8`, `C$`, `N8`, `y7`.
> - **`symbol_index_infra_platform.md`** (Permissions / Telemetry / Model) — `fc`, `tZ4`,
>   `IS`, `c28`, `fI8`, `fV8`, `YV8`, `tT4`, `D0$`, `T6`, `k3`, `w5`, `dN`, `vx`, `KkH`,
>   `or`, `Ev`, `q48`, `ycH`, `SH`, `uH`, `Xi$`.
> - **`symbol_index_infra_integration.md`** (Slash Commands / Plugin) — `cV$`.

> **Line-number notes (single source of truth):**
> - `Zzz`/`Gzz` (`/reload-skills` handler + descriptor) live in the same lazy-loaded
>   module: `Zzz` at 521237-521252, `Gzz` at 521262-521271 (the seed's 521260 is the
>   `var Gzz, CE8;` declaration; the object literal starts at 521262).
> - `OP$` (the SessionStart hook generator) is declared `async function* OP$` at
>   **551757**; the `reloadSkills` yield the reload doc cites is at 553933 inside its body.
>   This row cites the **declaration** (551757).
> - `PG8` and `_RH` are declared together in a `var` block at **413922-413923**
>   (`… PG8 = !1, _RH = null;`); the seed's 413488 is the *reset* site inside `Bo`. Rows
>   cite the declarations.
> - `v8` is the **alias** `v8 = cx8;` at **1492**; `cx8` is the lodash-style memoize
>   *impl* at 1475-1486. Rows distinguish the two.
> - `Bo`, `PG8`, `_RH`, `LG8` all appear inside `Bo` at 413487-413489; only `Bo` and
>   `LG8` (the `new Map()` at 414021) are *declared* there.
> - `dN`/`s$7` (the effort ladder + alias map) live at 185009-185010; the same row set
>   appears in `symbol_additions_v2_1_156_code_review.md` and
>   `symbol_additions_v2_1_156_model_opus48.md` — file under the effort area once.
> - `D0$`, `dN`, `ZX`, `sq`, `bA`, `Y18`, `c28`, `fc`, `tZ4`, `IS`, `SH`, `k3`, `T6`,
>   `w5` are **cross-module** symbols also cited by the disallowed-tools / effort /
>   bundled-bodies docs and (for `bA`/`Y18`/`dN`/`k3`/`sq`) by the 45_code_review
>   additions file; they are listed here once with the skill-system reading.

---

## Module: Skill System — 2.1.143–156 delta

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$U` | `runSessionStartHooks` (collects hook deltas; on any `reloadSkills` fires `_C()`+`Bo()`+`Xc.emit()`+`SH("hook_session_start_reload_skills")`) | cli_inner_pretty.js:270637 | function |
| `_C` | `clearSkillListingCaches` (reload primitive's outer clear: `wu()`, `vG8()`, `Cw4()`, `DRH()`) | cli_inner_pretty.js:545345 | function |
| `_RH` | `cachedAnnouncedSkillSet` (lazily-built announce/dedup `Set`; nulled by `Bo`, rebuilt in `Tp6`) | cli_inner_pretty.js:413923 | variable |
| `aL6` | `SKILL_FRONTMATTER_SCHEMA` (zod skill schema; `GL5().extend({...})`) | cli_inner_pretty.js:184517 | variable |
| `aSz` | `CLAUDE_API_SKILL_DESCRIPTION_BASE` (base `/claude-api` description; mentions migrating between model versions) | cli_inner_pretty.js:612051 | variable |
| `bA` | `registerBundledSkill` (turns a definition into a `type:"prompt"`, `source/loadedFrom:"bundled"` record; wraps `getPromptForCommand` to merge extracted `files`; passes through `disallowedTools`/`getEffort`/lazy descriptions) | cli_inner_pretty.js:524187 | function |
| `BL` | `aggregateAllSkillCommands` (async disk-walk aggregator delegating to `sH9`; concatenates skill-dir + plugin + bundled + builtin-plugin skills) | cli_inner_pretty.js:545320 | function |
| `Bo` | `resetConditionalSkillState` (reload primitive's state reset: `LG8.clear()`, `PG8=false`, `_RH=null`) | cli_inner_pretty.js:413487 | function |
| `c1q` | `SKILL_FILES` (map of relative path → bundled markdown string; includes `shared/model-migration.md`) | cli_inner_pretty.js:611884 | variable |
| `c28` | `applyToolDenyRules` (mode-aware union/replace of `alwaysDenyRules.command`, with identity-preserving no-op guard) | cli_inner_pretty.js:395738 | function |
| `cd6` | `parseSkillFrontmatter` (`.claude` SKILL.md frontmatter → record; normalizes `disallowed-tools`/`effort` via `fc`/`vx`) | cli_inner_pretty.js:421555 | function |
| `cSz` | `buildClaudeApiFiles` (materialize `SKILL_FILES` with `{{OPUS_ID}}`/`{{OPUS_NAME}}` substituted, for files extraction) | cli_inner_pretty.js:611935 | function |
| `cV$` | `parsePluginCommand` (plugin command/skill frontmatter parser; coalesces `disallowed-tools ?? disallowedTools` through `fc`) | cli_inner_pretty.js:414118 | function |
| `Cw4` | `clearBundledSkillCache` (`Kd6.cache?.clear?.()`) | cli_inner_pretty.js:414290 | function |
| `cx8` | `memoizeImpl` (lodash-style first-arg-keyed memoize impl; attaches `.cache` Map with `.clear()`) | cli_inner_pretty.js:1475 | function |
| `C$` | `getCwd` (current working directory; the memoization key passed to `L2`) | cli_inner_pretty.js:42238 | function |
| `d1q` | `SKILL_MODEL_VARS` (`{{OPUS_ID}}=claude-opus-4-8`, `{{OPUS_NAME}}=Claude Opus 4.8`, … substituted into every bundled doc) | cli_inner_pretty.js:611874 | variable |
| `dDz` | `invalidateWorkflowCache` (workflow-command cache buster; bound from the workflow module at 545804) | cli_inner_pretty.js:545804 | function |
| `dN` | `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]` — `xhigh` added 2.1.154) | cli_inner_pretty.js:185009 | constant |
| `D0$` | `buildForkedSkillContext` (builds forked-skill `allowed_tools`/`disallowed_tools` permission layers + base agent + body-as-prompt) | cli_inner_pretty.js:452910 | function |
| `DRH` | `clearDynamicSkillCachesAndState` (`nd6`/`tx` cache clear + `lL.conditionalSkills`/`activatedConditionalSkillNames` clear) | cli_inner_pretty.js:421850 | function |
| `Ehz` | `SIMPLIFY_SKILL_BODY` (the `/simplify` body: "not hunting for bugs", 4 cleanup agents in parallel via the Agent tool, then apply) | cli_inner_pretty.js:601378 | variable |
| `Ev` | `computeDisplayEffortLevel` (`or(model, effort) ?? "high"` → clean display string) | cli_inner_pretty.js:184944 | function |
| `eyz` | `codeReviewDescription` (function-typed description; appends the `ultra` clause only when cloud review `WF()` is enabled) | cli_inner_pretty.js:600558 | function |
| `fc` | `normalizeToolList` (wraps `tZ4`, returns `[]` for null/undefined) | cli_inner_pretty.js:443196 | function |
| `fI8` | `processUserInput` (per-message processor; resets `alwaysDenyRules.command` via `c28` replace each turn — the cleared-on-next-message semantics) | cli_inner_pretty.js:590814 | function |
| `fV8` | `addDenyRulesToContext` (pure union of deny specs into `alwaysDenyRules.command`) | cli_inner_pretty.js:452899 | function |
| `gDz` | `loadSkillDirCommands` (loads skill-dir + plugin + bundled + builtin-plugin skills; calls the disk-reading `nd6`) | cli_inner_pretty.js:545264 | function |
| `Gp6` | `markSkillDirsScanned` (sets `PG8 = true`) | cli_inner_pretty.js:413493 | function |
| `GL5` | `COMMON_FRONTMATTER_SCHEMA` (shared skill/slash-command zod schema; holds `disallowed-tools` + canonical `disallowedTools` alias) | cli_inner_pretty.js:184480 | variable |
| `Gzz` | `RELOAD_SKILLS_COMMAND` (`/reload-skills` local-command descriptor: `type:"local"`, `supportsNonInteractive:true`, `thinClientDispatch:"post-text"`) | cli_inner_pretty.js:521262 | object |
| `IS` | `parseToolSpecList` (paren-aware comma/space splitter for tool specs) | cli_inner_pretty.js:442850 | function |
| `Kd6` | `bundledSkillsLoaderMemo` (memoized bundled-skill loader; cleared by `Cw4`) | cli_inner_pretty.js:414435 | function |
| `KkH` | `isEffortLevel` (`dN.includes(value)` enum membership test) | cli_inner_pretty.js:184859 | function |
| `k3` | `resolveEffortFromLayers` (baseline `effortValue` overridden by each `kind:"effort"` permission layer; the runtime effort authority) | cli_inner_pretty.js:453183 | function |
| `L2` | `loadSkillsForList` (memoized user-facing skill list; on cache-miss re-reads disk via `BL`→`sH9`→`gDz`→`nd6`) | cli_inner_pretty.js:545823 | function |
| `LG8` | `dynamicSkillCommandMap` (Map of discovered dynamic/conditional skills + their commands; cleared by `Bo`) | cli_inner_pretty.js:414021 | variable |
| `mAz` | `prependBaseDir` (prefixes prompt blocks with `Base directory for this skill: <dir>` so the model can Read/Grep extracted refs) | cli_inner_pretty.js:524283 | function |
| `N8` | `pluralize` (`count===1 ? singular : plural`; used for `"skill"`/`"skills"`) | cli_inner_pretty.js:9655 | function |
| `nd6` | `skillDirLoaderMemo` (memoized skill-dir loader; reads `<dir>/<name>/SKILL.md` off disk; cleared by `DRH`) | cli_inner_pretty.js:421999 | function |
| `nSz` | `detectProjectLanguage` (scans cwd for language markers `.py`/`package.json`/… and returns the detected language) | cli_inner_pretty.js:611940 | function |
| `nwH` | `installLazyStringGetter` (installs an enumerable getter only for function-typed `description`/`argumentHint`/`whenToUse`) | cli_inner_pretty.js:222231 | function |
| `or` | `resolveModelEffort` (applies the silent `xhigh→high`/`max→high` downgrade for unsupported models) | cli_inner_pretty.js:184909 | function |
| `oSz` | `buildClaudeApiPrompt` (assembles base prompt + Quick Task Reference + inlined `<doc>` blocks) | cli_inner_pretty.js:611986 | function |
| `Ov$` | `buildSkillCommandObject` (skill record → command object; carries `disallowedTools`/`effort` through, collapses empty `disallowedTools` to `undefined`) | cli_inner_pretty.js:421592 | function |
| `OP$` | `sessionStartHookGenerator` (the `async function*` streaming SessionStart hook output; yields `reloadSkills`/`sessionTitle`/`watchPaths`/…) | cli_inner_pretty.js:551757 | function |
| `PG8` | `hasScannedSkillDirsFlag` ("dynamic skill dirs already scanned this pass" guard; reset by `Bo`, set by `Gp6`) | cli_inner_pretty.js:413922 | variable |
| `Qyz` | `skillToolCodeReviewGuidance` (coordinator post-implementation prompt instructing the worker to invoke the Skill tool with `skill:"code-review"`) | cli_inner_pretty.js:600237 | variable |
| `RAz` | `extractAndGetSkillRoot` (extracts a bundled skill's `files` map to a per-skill dir; returns the dir or `null` on write failure) | cli_inner_pretty.js:524241 | function |
| `RDH` | `bundledSkillsAsyncLoader` (memoized async loader for model-invocable bundled/plugin skills; cleared by `wu`) | cli_inner_pretty.js:545827 | function |
| `rSz` | `CLAUDE_API_QUICK_TASK_REFERENCE` (Quick Task Reference block; routes "Migrating to a newer model…" to `shared/model-migration.md`) | cli_inner_pretty.js:612049 | variable |
| `sH9` | `skillCommandAggregatorMemo` (memoized master skill+command aggregator that `BL` delegates to; cleared by `wu`) | cli_inner_pretty.js:545805 | function |
| `SH` | `featureOkTelemetry` (emits `tengu_feature_ok { feature_name }`; called with `"hook_session_start_reload_skills"` and `"skill_bundled_extract"`) | cli_inner_pretty.js:41590 | function |
| `sq` | `AGENT_TOOL_NAME` (`"Agent"`; the subagent tool `/simplify` and `/code-review` fan out across, and the runner that threads `spawnedBySkill`) | cli_inner_pretty.js:185637 | constant |
| `T6` | `applyPermissionLayers` (folds `permissionLayers` over the base tool context; `disallowed_tools`→`fV8`, `allowed_tools`→`YV8`, no-ops on `effort`/`model`) | cli_inner_pretty.js:453162 | function |
| `tSz` | `registerClaudeApiSkill` (registers `/claude-api`: `allowedTools` Read/Grep/Glob/WebFetch, `files: cSz()`, emits `tengu_claude_api_skill_loaded`) | cli_inner_pretty.js:612027 | function |
| `tT4` | `wrapAppStateWithRules` (wraps `getAppState` to bake allow+deny rules into the snapshot a forked child reads) | cli_inner_pretty.js:452903 | function |
| `tx` | `pairedSkillLoaderMemo` (memoized paired skill loader; cleared by `DRH`) | cli_inner_pretty.js:443338 | function |
| `tZ4` | `normalizeToolListOrNull` (string/array → trimmed token list; distinguishes absent (null) from empty; collapses `*` to `["*"]`) | cli_inner_pretty.js:443179 | function |
| `TL5` | `AGENT_FRONTMATTER_SCHEMA` (agent/subagent zod schema; carries its own `disallowedTools`, ignored when `tools` is set) | cli_inner_pretty.js:184556 | variable |
| `uH` | `logFeatureError` (emits `tengu_feature_bad { feature_name, error_code }`; the fork guard calls it `("skill_invoke","skill_invoke_fork_recursion")`) | cli_inner_pretty.js:41593 | function |
| `uj9` | `claudeApiSkillDescription` (full `/claude-api` description = `aSz` + TRIGGER/SKIP clauses) | cli_inner_pretty.js:612071 | variable |
| `v8` | `memoize` (alias `v8 = cx8;` — the public name every skill/command loader is built with) | cli_inner_pretty.js:1492 | variable |
| `vG8` | `clearPluginSkillCache` (`zRH.cache?.clear?.()`) | cli_inner_pretty.js:414228 | function |
| `vO9` | `registerSimplifySkill` (registers the cleanup-only `/simplify` via `bA`) | cli_inner_pretty.js:601350 | function |
| `vx` | `parseEffortValue` (frontmatter effort parser; named level after alias-map, or raw integer) | cli_inner_pretty.js:184870 | function |
| `w5` | `buildHookStatusEnv` (status/hook env; the 2.1.156 fix walks `permissionLayers` and overrides displayed effort to match `k3`) | cli_inner_pretty.js:552312 | function |
| `wj9` | `MODEL_MIGRATION_DOC` (bundled `shared/model-migration.md` body; the "Migrating to Opus 4.8" prose) | cli_inner_pretty.js:608931 | variable |
| `wu` | `clearMemoizedSkillCommandCaches` (clears `sH9`/`L2`/`RDH`, calls `dDz`, and async-clears the skill-index module) | cli_inner_pretty.js:545333 | function |
| `Xc` | `skillReloadEmitter` (signal emitter re-announcing skill changes to UI subscribers; built via `Xc = y7()`) | cli_inner_pretty.js:270624 | variable |
| `Xi$` | `OPUS_4_8_MODEL_IDS` (per-provider id map for `claude-opus-4-8` — the migration target) | cli_inner_pretty.js:91825 | object |
| `X$` | `defineModuleExports` (lazy module-export binder; registers the `/reload-skills` `call`) | cli_inner_pretty.js:521236 | function |
| `y7` | `createSignal` (exception-isolating subscribe/emit/clear signal factory) | cli_inner_pretty.js:1813 | function |
| `ycH` | `modelSupportsXhighEffort` (gate: `xhigh` honored only on Opus 4.7/4.8 or with the 3P override) | cli_inner_pretty.js:184834 | function |
| `YV8` | `addAllowRulesToContext` (pure allow-rule appender) | cli_inner_pretty.js:452892 | function |
| `Y18` | `CODE_REVIEW_SKILL_NAME` (`"code-review"` — skill name and slash command) | cli_inner_pretty.js:211646 | constant |
| `zO9` | `registerCodeReviewSkill` (registers `/code-review` via `bA`; `subcommands:{ultra:"ultrareview"}` + `getEffort`) | cli_inner_pretty.js:600612 | function |
| `zRH` | `pluginSkillsLoaderMemo` (memoized plugin-skills loader; cleared by `vG8`) | cli_inner_pretty.js:414317 | function |
| `ZX` | `SKILL_TOOL_NAME` (`"Skill"` tool-name constant; interpolated into the fork-recursion block message) | cli_inner_pretty.js:216282 | constant |
| `Zzz` | `reloadSkillsCommandHandler` (the `/reload-skills` `call()` body: snapshot names before/after, run the cache-clear chain, return an `N added, M removed` diff) | cli_inner_pretty.js:521237 | function |
| `q48` | `getDefaultEffortForModel` (Opus 4.8 → `high`, Opus 4.7 → `xhigh`, else `high`) | cli_inner_pretty.js:184987 | function |

---

## Notes & gaps

- **`OP$` line correction.** The seed cited `OP$` at 553933 (the `reloadSkills` yield inside
  its body). The actual `async function* OP$` declaration is at **551757**; this table cites
  the declaration. 553933 remains a valid in-body reference used by the reload doc.
- **`PG8`/`_RH` line correction.** The seed cited both at 413488 (the reset site inside
  `Bo`). Their `var` declarations are at **413922 / 413923**; this table cites the
  declarations.
- **`v8` vs `cx8`.** `cx8` is the memoize *impl* (1475-1486); `v8 = cx8;` is the alias at
  **1492**. The seed gave both 1475-1486; corrected here.
- **`Gzz` line.** The seed cited 521260 (the `var Gzz, CE8;` declaration line). The object
  literal `Gzz = { type:"local", … }` begins at **521262**; cited here. (`Zzz` at
  521237 is unchanged and verified.)
- **`BL` vs `sH9`.** These are distinct: `BL` (545320) is the async aggregator; `sH9`
  (545805) is its memoized wrapper. Kept as two rows (`aggregateAllSkillCommands` and
  `skillCommandAggregatorMemo`).
- **Cross-module symbols.** `dN`/`s$7`, `bA`, `Y18`, `k3`, `sq`, `vO9`, `Ehz`, `zO9`,
  `eyz`, `q48`, `ycH`, `or`, `Ev` also appear in `symbol_additions_v2_1_156_code_review.md`
  and/or `symbol_additions_v2_1_156_model_opus48.md`. When consolidating the central index,
  keep a single canonical row per symbol (effort ladder under core_features; `/code-review`
  registration under the integration/slash-command area); the readings here are the
  skill-system view of the same identifiers.
- `getEffort` is a **field name** (pass-through callback on the bundled-skill record), not a
  standalone obfuscated symbol; it is documented in `bundled_skill_bodies.md`/`skill_effort_frontmatter.md`
  but has no row of its own.
