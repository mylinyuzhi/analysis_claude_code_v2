# Symbol Additions - Unit 09 v2.1.113 -> v2.1.142 (Skills + Goal)

Symbols discovered while analyzing v2.1.117 / v2.1.120 / v2.1.121 / v2.1.126 / v2.1.129 / v2.1.133 / v2.1.136 / v2.1.139 / v2.1.140 / v2.1.142 changes to the skill subsystem and the new `/goal` command. The symbols live inside the larger Skill / Plugin / Hook / Slash-Command infrastructure.

Source of truth for v2.1.88 names:

- `/lyz/codespace/3rd/claude-code/src/utils/argumentSubstitution.ts` (arg substitution - v2.1.139 fix point)
- `/lyz/codespace/3rd/claude-code/src/skills/loadSkillsDir.ts` (skill loading)
- `/lyz/codespace/3rd/claude-code/src/skills/bundledSkills.ts` (bundled skill registration)
- `/lyz/codespace/3rd/claude-code/src/plugins/` (manifest parsing - v2.1.136 / v2.1.142 inheritance changes)
- `/lyz/codespace/3rd/claude-code/src/tools/SkillTool/SkillTool.ts` (Skill tool - v2.1.139 wildcard, v2.1.126 OTel)

Source bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`

---

## Module: Skill - Regex-Safe Argument Substitution (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Vx` | `escapeRegex` | cli_inner_pretty.js:9491-9493 | function |
| `uFH` | `substituteArgsInPrompt` | cli_inner_pretty.js:217479-217509 | function |
| `z36` | `parseArgumentString` | cli_inner_pretty.js:217462-217466 | function |
| `iH8` | `parseArgumentNames` | cli_inner_pretty.js:217467-217473 | function |
| `riK` | `formatProgressiveArgumentHint` | cli_inner_pretty.js:217474-217478 | function |
| `rH8` | `escapeShellBang` | cli_inner_pretty.js:217510-217514 | function |

Where applied:
- cli_inner_pretty.js:406263 - `$I6.getPromptForCommand` calls `uFH(R, h, !0, Y, rH8)` for skill body expansion

The `Vx` call wraps the argument name on line 217490 before constructing the replacement regex - the actual fix point.

---

## Module: Plugin Manifest - skills field inheritance (v2.1.136 + v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `WTH` | `resolvePluginPathRelative` | cli_inner_pretty.js:229990-229995 | function |
| `kg` | `validatePluginComponentPaths` | cli_inner_pretty.js:229997-230032 | function |
| `r__` | `manifestPathsCoverDefaultFolder` | cli_inner_pretty.js:230034-230048 | function |
| `U88` | `loadPluginFromDir` | cli_inner_pretty.js:230049-… | function |
| `H2` | `SKILLS_DIR_SENTINEL` (= `"skills-dir"`) | cli_inner_pretty.js:218312 | constant |
| `Yn` | `INLINE_MARKETPLACE_SENTINEL` (= `"inline"`) | cli_inner_pretty.js:218311 | constant |
| `V36` | `recordAdvisoryMarketplaceTransition` | (utility) | function |
| `VjH` | `formatPluginErrorMessage` | cli_inner_pretty.js:457508-457548+ | function |
| `nX5` | `scanSkillsPaths` (skills directory walker - accepts root SKILL.md) | cli_inner_pretty.js:457453-457486 | function |

v2.1.142 specifically:
- cli_inner_pretty.js:230198-230213 - the fallback branch in `U88` (the if/else if/else for skills paths)
- cli_inner_pretty.js:230204 - the `kg(..., /*expectDir=*/!0)` call that enables file-vs-dir rejection
- cli_inner_pretty.js:230207 - the `P === H2 && a === KH` filter that gates the `skills: ["./"]` opt-in

Error types:
- `path-not-found` - referenced path doesn't exist
- `path-traversal` - path escapes plugin directory
- `component-load-failed` with reason `"path is a file; expected a directory"` (v2.1.136 addition)
- `folder-shadowed-by-manifest` (v2.1.136 addition, v2.1.142 enhancement enumerates every shadowing manifest key)

---

## Module: skillOverrides Setting (v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `oT5` | `resolveSkillOverrideLock` | cli_inner_pretty.js:476885-476893 | function |
| `aT5` | `resolveProjectSkillOverride` | cli_inner_pretty.js:476894-476896 | function |
| `xJ4` | `formatSkillSource` | cli_inner_pretty.js:476897-476908 | function |
| `uJ4` | `SkillsDialog` | cli_inner_pretty.js:476909-477136 | function (React component) |
| `sT5` | `SkillRow` | cli_inner_pretty.js:477137-477182 | function (React component) |
| `kB6` | `SKILL_OVERRIDE_VALUES` (= `["on", "name-only", "user-invocable-only", "off"]`) | cli_inner_pretty.js:477208 | constant |
| `rT5` | `SKILL_OVERRIDE_STYLES` | cli_inner_pretty.js:477209-477214 | object |
| `st` | `getSkillOverride` | cli_inner_pretty.js:513847-513849 | function |
| `VE4` | `isSkillModelInvocationDisabled` | cli_inner_pretty.js:513851-513853 | function |
| `iP8` | `isSkillHiddenFromUser` | cli_inner_pretty.js:513855-513857 | function |
| `tT5` | `renderSkillsDialog` (the React render wrapper) | cli_inner_pretty.js:477218-… | function |

Skill tool gate:
- cli_inner_pretty.js:353581-353590 - the `st(Y)` + `Am7(_, $)` check before allowing model invocation
- cli_inner_pretty.js:353567 - the `Y.disableModelInvocation && !Am7(_, $)` check (v2.1.110 author-tier; gated together with skillOverrides)

Settings layer save:
- cli_inner_pretty.js:477008 - `B6("localSettings", { skillOverrides: r })` writes user dialog changes

---

## Module: ${CLAUDE_EFFORT} placeholder (v2.1.120)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$I6` | `formatCommand` (returns a `prompt`-type command object with `getPromptForCommand`) | cli_inner_pretty.js:406196-406299 | function |
| `aT` | `effortLevelFor` (resolves model + effort to display string, applies silent downgrade) | (model module) | function |
| (none) | the `getPromptForCommand` method | cli_inner_pretty.js:406257-406297 | method |
| (none) | the `${CLAUDE_EFFORT}` substitution line | cli_inner_pretty.js:406269 | snippet |
| (none) | hook-input parallel substitution | cli_inner_pretty.js:399003 | snippet |
| (none) | hook-input parallel substitution (alt path) | cli_inner_pretty.js:406317 | snippet |
| (none) | Bash tool env injection | cli_inner_pretty.js:419635 | snippet |
| (none) | env-override path (caller-supplied CLAUDE_EFFORT) | cli_inner_pretty.js:520868 | snippet |
| (none) | "active effort level" describe text in JSON schema | cli_inner_pretty.js:237710 | snippet |

---

## Module: claude_code.skill_activated OTel event (v2.1.126)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Qf$` | `emitSkillActivatedOtel` | cli_inner_pretty.js:218520-218533 | function |
| `N7H` | `formatSkillSourceMetadataForOtel` | cli_inner_pretty.js:218534-218541 | function |
| `M1` | `emitOtelLogEvent` (general emitter) | (otel module) | function |
| `XY` | `isToolDetailLoggingEnabled` (reads `OTEL_LOG_TOOL_DETAILS=1`) | (otel module) | function |
| `rE` | `isOfficialMarketplace` | cli_inner_pretty.js:218301-218303 | function |
| (constant) | `"user-slash"` invocation trigger | cli_inner_pretty.js:352732, 352942, 352979 | string literal |
| (constant) | `"claude-proactive"` invocation trigger | cli_inner_pretty.js:353385 (computed), 353681 (computed) | string literal |
| (constant) | `"nested-skill"` invocation trigger | cli_inner_pretty.js:353385 (computed), 353681 (computed) | string literal |

Call sites:
- cli_inner_pretty.js:353406 - `Qf$($, H, X)` from the SkillTool forked-call path
- cli_inner_pretty.js:353704 - `Qf$(Y, O, V)` from the SkillTool inline-call path
- Slash-command paths emit via the same shared internal `d("tengu_...")` event and the OTel path is parallel

---

## Module: Subagent skill discovery (v2.1.133)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ax5` | `getSkillsFromAllSources` | cli_inner_pretty.js:513752-513791 | function |
| `TE4` | `getAllCommands` (memoised orchestrator) | cli_inner_pretty.js:514269-514285 | function |
| `KI6` | `loadSkillDirCommands` (walks `~/.claude/skills/` and project skills) | (skill-loader module) | function |
| `Dh6` | `loadPluginSkills` (iterates plugin manifests) | (plugin-loader module) | function |
| `zG4` | `getBundledSkills` | (bundled module) | function |
| `GrK` | `getBuiltinPluginSkills` | (builtin plugin module) | function |
| `XG$` | `shouldListSkillForModel` (filter predicate) | cli_inner_pretty.js:513858-513870 | function |
| `LG$` | `isLocallyDispatchable` | cli_inner_pretty.js:513871-513875 | function |
| `kE4` | `isDispatchable` | cli_inner_pretty.js:513881-513883 | function |
| `D9H` | `applyFallbackDeduplication` (drops same-suffix `fallback: true` skills) | cli_inner_pretty.js:513829-513842 | function |
| `Eg6` | `getLocalJsxCommands` (`/agents`, `/effort`, `/goal`, etc.) | cli_inner_pretty.js:514163-514267 | function |
| `kb` | `getLocalJsxCommandNames` (set of names+aliases) | cli_inner_pretty.js:514268 | function |
| `HG` | `getCommandsForContext` (the consumer) | cli_inner_pretty.js:513810-513822 | function |
| `gZ` | `getModelFacingCommands` (filters via XG$) | cli_inner_pretty.js:514286-514288 | function |
| `GTH` | `getSkillToolListing` | cli_inner_pretty.js:514289-514311 | function |

---

## Module: Type-to-Filter in /skills (v2.1.121)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DN` | `FilterTextInput` (rendered inside SkillsDialog) | (utility component) | function (React) |
| `AG` | `useFilterInputController` | (hook) | function |
| (state) | `P` / `filterQuery` in SkillsDialog | cli_inner_pretty.js:476956-476957 | (local state) |
| (state) | `J` / `isFilterFocused` in SkillsDialog | cli_inner_pretty.js:476953-476954 | (local state) |
| (handler) | `x` / `handleKeyDown` in SkillsDialog | cli_inner_pretty.js:477029-477048 | (callback) |
| (handler) | `F` / `handlePaste` in SkillsDialog | cli_inner_pretty.js:477049-477062 | (callback) |
| (memo)  | `v` / `filteredSkills` in SkillsDialog | cli_inner_pretty.js:476969-476978 | (memoized) |

Filter applies on `name`, `description`, and `formatSkillSource(source)` lowercase substring match (line 476972-476977).

---

## Module: Skill(name *) wildcard (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (closure) | `matchesRule` inside Skill tool checkPermissions | cli_inner_pretty.js:353610-353618 | function |
| `GQ` | `getToolRules` (allow/deny lookup) | (permission module) | function |
| `SnH` | `SKILL_TOOL_NAME` (= `"Skill"`) | (constants module) | constant |
| `fX` | `SKILL_TOOL_NAME` (alias - same constant referenced via different name) | (constants module) | constant |
| `Xy` | `findCommand` (resolves a name in the available commands map) | (utility) | function |
| `yV6` | `getMcpAndStaticCommands` (loads MCP prompts + static commands) | cli_inner_pretty.js:353356-353361 | function |

Rule formats accepted:
- `Skill(name)` - exact
- `Skill(name *)` - prefix match (v2.1.139 fix)
- `Skill(name:*)` - legacy prefix match (kept for backward compat)
- `Skill(/name)` - leading slash stripped

---

## Module: /goal command (v2.1.139 + v2.1.140)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BR5` | `goalCommand` (interactive local-jsx variant) | cli_inner_pretty.js:507850-507857 | object |
| `pR5` | `goalNonInteractive` (non-interactive local variant) | cli_inner_pretty.js:507858-507869 | object |
| `UR5` | `goalDefaultExport` (= `goalCommand`) | cli_inner_pretty.js:507870 | object |
| `uR5` | `interactiveGoalCall` (`BR5.call` body) | cli_inner_pretty.js:507789-507806 | function |
| `mR5` | `goalNonInteractiveCall` (`pR5.call` body) | cli_inner_pretty.js:507815-507839 | function |
| `Wk4` | `interactiveGoalModule` | cli_inner_pretty.js:507787-507811 | module |
| `Gk4` | `nonInteractiveGoalModule` | cli_inner_pretty.js:507813-507843 | module |
| `Vk4` | `goalCommandExports` | cli_inner_pretty.js:507845-507871 | module |
| `Ng6` | `goalNonInteractive` (alias reference for non-interactive registration) | cli_inner_pretty.js:514107 | reference |
| `Hx5` | `goalDefaultRef` (= `WE4.default` = `BR5`; resolves to `goalCommand`) | cli_inner_pretty.js:514106 | reference |
| `WE4` | `goalCommandModuleRef` (= `s6(Vk4)`; the lazy-loaded module record) | cli_inner_pretty.js:514105 | module reference |

### Goal core (xaH module)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `xaH` | `goalCoreModule` (the `xaH = T(() => { ... })` import block) | cli_inner_pretty.js:486763-486772 | module |
| `CaH` | `registerGoal` | cli_inner_pretty.js:486719-486732 | function |
| `baH` | `clearGoal` | cli_inner_pretty.js:486734-486745 | function |
| `Xp6` | `goalGateCheck` | cli_inner_pretty.js:486714-486718 | function |
| `gX8` | `getStopHookPrompts` | cli_inner_pretty.js:486706-486713 | function |
| `oP4` | `getLastGoalAttachment` | cli_inner_pretty.js:486693-486702 | function |
| `aP4` | `formatHookReason` | cli_inner_pretty.js:486703-486705 | function |
| `sP4` | `goalStatusAttachment` | cli_inner_pretty.js:486747-486753 | function |
| `UX8` | `isClearKeyword` | cli_inner_pretty.js:486690-486692 | function |
| `FX8` | `STOP_HOOK_GOAL_PROMPT` (priming meta-message factory) | cli_inner_pretty.js:486758-486759 | function |
| `ov5` | `GOAL_TRUST_GATE_MSG` | cli_inner_pretty.js:486760 | constant |
| `av5` | `GOAL_HOOKS_GATE_MSG` | cli_inner_pretty.js:486761-486762 | constant |
| `rv5` | `GOAL_CLEAR_KEYWORDS` (Set) | cli_inner_pretty.js:486771 | constant |
| `RaH` | `MAX_GOAL_CONDITION_CHARS` (= `4000`) | cli_inner_pretty.js:486756 | constant |
| `rP4` | `cryptoModule` (the `require("crypto")` import) | cli_inner_pretty.js:486771 | module |

### Goal hook-disable detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `km` | `isAllHooksDisabled` | cli_inner_pretty.js:240936-240938 | function |
| `rw` | `isAllowManagedHooksOnly` | cli_inner_pretty.js:240930-240935 | function |
| `T6` | `isTrustedWorkspace` | (settings module) | function |
| `_5` | `isTrustBypassContext` | (settings module) | function |
| `Oq` | `mergedSettings` (resolves the merged user/project/local/policy setting state) | (settings module) | function |
| `v8` | `getSettings` (per-tier getter) | (settings module) | function |
| `I6` | `isRemoteWorkspace` (= `U$.caps.workspace === "remote"`; bridge-context bypass for trust gate) | cli_inner_pretty.js:3104-3106 | function |

### Goal resume

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kn6` | `goalResumeModule` | cli_inner_pretty.js:564142-564170 | module |
| `Cr5` | `restoreGoalFromTranscript` | cli_inner_pretty.js:564153-564164 | function |
| `Eg4` | `findGoalToRestore` | cli_inner_pretty.js:564144-564152 | function |
| `_X$` | `registerSessionHookDirect` (the underlying hook-registry add) | (hooks module) | function |
| `nX` | `currentTokenCount` | (telemetry module) | function |
| `v$` | `currentSessionId` | (session module) | function |

### Goal UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Lk4` | `goalOverlayPanelModule` | cli_inner_pretty.js:507771-507785 | module |
| `Xk4` | `GoalOverlayPanel` (active/achieved/none three-flavour dialog) | cli_inner_pretty.js:507612-507742 | function (React) |
| `UF6` | `LabeledField` (the "Label: value" row) | cli_inner_pretty.js:507749-507768 | function (React) |
| `xR5` | `activeGoalSelector` | cli_inner_pretty.js:507746-507748 | function |
| `bR5` | `incrementHelper` (= `H + 1`) | cli_inner_pretty.js:507743-507745 | function |
| `FF6` | `useMemoCacheGoal` (the React memo-cache helper for LabeledField) | cli_inner_pretty.js:507770 | reference |
| `fJ` | `ReactReference` (the React module reference) | cli_inner_pretty.js:507770 | reference |

### Goal status badge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Xx4` | `GoalActiveBadge` (the status-bar React component) | cli_inner_pretty.js:544426-544501 | function (React component) |
| `gg5` | `tickHelperModulo` (= `(H + 1) % V28`) | cli_inner_pretty.js:544502-544504 | function |
| `Qg5` | `tickHelperIncr` (= `H + 1`) | cli_inner_pretty.js:544505-544507 | function |
| `dg5` | `setAtSelector` (= `H.activeGoal?.setAt`) | cli_inner_pretty.js:544508-544510 | function |
| `Ug5` | `BADGE_PULSE_PERIOD_MS` (= `4000`) | cli_inner_pretty.js:544514 | constant |
| `Fg5` | `BADGE_DOT_INTERVAL_FRAC` (= `0.18`) | cli_inner_pretty.js:544515 | constant |
| `V28` | `BADGE_DOTS` (= `20`) | cli_inner_pretty.js:544513 | constant |
| `vR$` | `ICON_PULSE` (= `"◎"` U+25CE) | cli_inner_pretty.js:48414 | constant |
| `kR$` | `ICON_PAUSE` (= `"⏸"` U+23F8) | cli_inner_pretty.js:48416 | constant |

### Goal attachments and rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (case)  | the `goal_status` attachment renderer | cli_inner_pretty.js:347071-347110 | switch case |

### Goal Stop-hook resolution loop

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (block) | Stop-hook success -> goal achieved emission | cli_inner_pretty.js:391744-391769 | inline |
| (block) | Stop-hook block -> iterations++, lastReason emission | cli_inner_pretty.js:391778-391786 | inline |
| (yield) | `yield { type: "active_goal", value: ... }` | cli_inner_pretty.js:391751, 391784 | event |
| (event) | `tengu_stop_hook_added` (via: "goal") | cli_inner_pretty.js:486729 | event |
| (event) | `tengu_stop_hook_removed` (via: "goal") | cli_inner_pretty.js:486743 | event |
| (event) | `tengu_goal_achieved` | cli_inner_pretty.js:391761 | event |
| (event) | `tengu_goal_restored_on_resume` | cli_inner_pretty.js:564163 | event |

### Goal thin-client dispatch and other slash-command infra

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Yx5` | `getCommandRequirements` (returns `{ workspace, ink }`) | cli_inner_pretty.js:513884-513894 | function |
| `fx5` | `isThinClientDispatchable` | cli_inner_pretty.js:513895-513897 | function |
| `NE4` | `getRemoteControlSlashCommandList` (filters via `fx5`) | cli_inner_pretty.js:513898-513900 | function |
| (value) | `thinClientDispatch: "post-text"` on goalNonInteractive | cli_inner_pretty.js:507862 | string literal |

---

## Quick cross-reference

| Diff | Location summary |
|------|------------------|
| v2.1.142 root SKILL.md | `U88` cli_inner_pretty.js:230211-230213 |
| v2.1.142 skills: ["./"] | `U88` cli_inner_pretty.js:230204-230207 (the `P === H2 && a === KH` filter) |
| v2.1.139 regex-safe args | `uFH` cli_inner_pretty.js:217490 (wraps name in `Vx(...)`) |
| v2.1.139 Skill(name *) | `cli_inner_pretty.js:353610-353618` matcher |
| v2.1.139 /goal command | `BR5`/`pR5` cli_inner_pretty.js:507850-507870 |
| v2.1.140 /goal hook gate | `Xp6` cli_inner_pretty.js:486714-486718 |
| v2.1.136 plugin shadowing advisory | `U88` cli_inner_pretty.js:230063-230090 |
| v2.1.133 subagent skill discovery | `Ax5` + `XG$` cli_inner_pretty.js:513752, 513858 |
| v2.1.129 skillOverrides | `oT5`/`aT5`/`st`/`uJ4` cli_inner_pretty.js:476885, 476894, 513847, 476909 |
| v2.1.126 skill_activated OTel | `Qf$` cli_inner_pretty.js:218520-218533 |
| v2.1.121 /skills filter | `uJ4` cli_inner_pretty.js:476969-477062 |
| v2.1.120 ${CLAUDE_EFFORT} | `$I6.getPromptForCommand` cli_inner_pretty.js:406269 |

---

**Status**: Consolidated into symbol_index_core_features.md as of v2.1.142 deobfuscation work.
