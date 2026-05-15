# Symbol Additions - Unit 10 (Skill System v2.1.88 -> v2.1.112)

Symbols discovered while analyzing the v2.1.91 / v2.1.105 / v2.1.108 / v2.1.110 / v2.1.111 changes to the skill subsystem in v2.1.112. These functions live inside the larger Skill / Plugin / Settings infrastructure.

Source of truth for v2.1.88 names:
- `/lyz/codespace/3rd/claude-code/src/tools/SkillTool/SkillTool.ts` (Skill tool definition)
- `/lyz/codespace/3rd/claude-code/src/tools/SkillTool/prompt.ts` (skill listing prompt + budget)
- `/lyz/codespace/3rd/claude-code/src/skills/loadSkillsDir.ts` (skill loading)
- `/lyz/codespace/3rd/claude-code/src/skills/bundledSkills.ts` (bundled skill registration)
- `/lyz/codespace/3rd/claude-code/src/plugins/` (manifest parsing)
- `/lyz/codespace/3rd/claude-code/src/utils/processUserInput/processSlashCommand.tsx` (slash-command dispatch)
- `/lyz/codespace/3rd/claude-code/src/commands/init.ts`, `review.ts`, `security-review.ts` (built-in command definitions)
- `/lyz/codespace/3rd/claude-code/src/commands/createMovedToPluginCommand.ts` (security-review wrapper)

---

## Module: Skill - Shell-Execution Policy Gate (v2.1.91)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Wc8` | `isShellExecutionDisabledByPolicy` | chunks.155.mjs:2839-2842 | function |
| `Dc8` | `stripShellExecutionPlaceholders` | chunks.155.mjs:2844-2848 | function |
| `KPY` | `TRIPLE_BACKTICK_BANG_FENCE` (regex `/```!\s*\n?[\s\S]*?\n?```/g`) | chunks.155.mjs:2850 | constant |
| `_PY` | `INLINE_BANG_BACKTICK_FENCE` (regex `/(?<=^|\s)!`[^`]+`/gm`) | chunks.155.mjs:2852 | constant |
| `lNK` | `SHELL_DISABLED_PLACEHOLDER` (string `"[shell command execution disabled by policy]"`) | chunks.155.mjs:2854 | constant |
| `s0Y` | `shouldStripShellInSource` | chunks.158.mjs:1626-1629 | function |

Where applied:
- chunks.158.mjs:1773 - user/project skill expansion path
- chunks.156.mjs:77 - plugin skill expansion path

Schema entry: chunks.19.mjs:475 - `disableSkillShellExecution: y.boolean().optional()...` (both `userSettingsSchema` and `policySettingsSchema`)

## Module: Plugin Monitors (v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wi5` | `pluginMonitorSchema` (per-entry schema with name/command/description/when) | chunks.18.mjs:2241-2247 | function (lazy schema) |
| `XO1` | `pluginMonitorsArraySchema` (array with unique-name refinement) | chunks.18.mjs:2248-2249 | function (lazy schema) |
| `$i5` | `pluginMonitorsManifestSchema` (top-level `monitors` manifest key) | chunks.18.mjs:2250-2251 | function (lazy schema) |
| `K_z` | `loadPluginMonitorsFromManifest` | chunks.88.mjs:1799-1838 | function |
| `T68` | `resolveRelativeToPluginRoot` (path-traversal guard) | chunks.88.mjs:1840-1846 | function |
| `gzA` | `resolveMonitorWithSubstitution` (applies `fx`/`I56`/`o36` env+config substitution to command) | chunks.205.mjs:2800-2815 | function |
| `UzA` | `resolveAllPluginMonitors` (flatten enabled plugins -> resolved monitor list) | chunks.205.mjs:2817-2831 | function |
| `QzA` | `createMonitorRateLimiter` (token-bucket wrapper around stdout batches) | chunks.205.mjs:2833-2850 | function |
| `dzA` | `runPluginMonitor` (spawn one monitor as long-lived bash task) | chunks.205.mjs:2852-2876 | function |
| `IP7` | `armPluginMonitors` (iterate, predicate-filter, dedupe-and-spawn) | chunks.205.mjs:2878-2894 | function |
| `FzA` | `ARMED_MONITORS_SET` (module-level dedupe set, key `pluginName:monitorName`) | chunks.205.mjs:2908 | constant |
| `kz5` | `usePluginMonitorsLifecycle` (React effect: arm always-monitors + subscribe to skill events) | chunks.205.mjs:2911-2928 | function |
| `Vz5` | `ReactModule` (the `React` namespace re-exported for `useEffect`) | chunks.205.mjs:2930 | variable |
| `sn1` | `skillInvocationEventBus` (publishes skill name on each invocation; subscribed by kz5) | utility | variable |
| (kind) | `"monitor"` (task `kind` discriminator in background task panel) | chunks.140.mjs:1252, chunks.205.mjs:2872 | string-literal type |

## Module: Skill Listing Cap (v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cb8` | `getSkillListingMaxDescChars` (reads `userSettings.skillListingMaxDescChars` or default) | chunks.97.mjs:692-694 | function |
| `ah4` | `getSkillListingBudgetFraction` | chunks.97.mjs:696-698 | function |
| `N88` | `getSkillToolCharBudget` (env override or `contextWindow * 0.04 * 0.01`) | chunks.97.mjs:700-705 | function |
| `al1` | `getCommandDescriptionWithWhenToUse` | chunks.97.mjs:707-709 | function |
| `vJz` | `isBundledPromptCommand` (`type === "prompt" && source === "bundled"`) | chunks.97.mjs:711-713 | function |
| `sh4` | `formatCommandsWithinBudget` (the main listing-renderer with truncation logic) | chunks.97.mjs:715-769 | function |
| `rh4` | `SKILL_BUDGET_CONTEXT_PERCENT` (= `0.01`) | chunks.97.mjs:771 | constant |
| `oh4` | `CHARS_PER_TOKEN` (= `4`) | chunks.97.mjs:773 | constant |
| `fJz` | `DEFAULT_CHAR_BUDGET` (= `8000`, used when no context window known) | chunks.97.mjs:775 | constant |
| `GJz` | `DEFAULT_SKILL_LISTING_DESC_CHARS` (= `1536`, was `250` in v2.1.88) | chunks.97.mjs:777 | constant |
| `sl1` | `MIN_DESCRIPTION_LENGTH` (= `20`, threshold for falling back to "names-only" mode) | chunks.97.mjs:779 | constant |

Schema entry: chunks.19.mjs:450 - `skillListingMaxDescChars: y.number().int().positive().optional().describe("Per-skill description character cap in the skill listing sent to Claude (default: 1536). Descriptions longer than this are truncated. Raise to opt in to higher per-turn context cost.")`

## Module: Skill Tool (v2.1.108 listing inclusion + rejection split, v2.1.110 mid-message bypass)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `m96` | `SkillTool` (the `Skill` tool definition object) | chunks.141.mjs:2509-2782 | object |
| `VH` | `SKILL_TOOL_NAME` (constant `"Skill"`) | (constants module) | constant |
| `oKY` | `skillToolInputSchema` (`{skill, args?}` zod schema) | chunks.141.mjs:2490-2493 | function (lazy schema) |
| `aKY` | `skillToolOutputSchema` (inline-or-forked discriminated union) | chunks.141.mjs:2493-2508 | function (lazy schema) |
| `sKY` | `SAFE_SKILL_PROPERTIES` (Set of property names that don't require permission prompt) | chunks.141.mjs:2783 | constant |
| `Bq7` | `getAllCommands` (union of local commands + MCP skill prompts) | chunks.141.mjs:2309-2314 | function |
| `ll` | `findCommand` (case-insensitive name+alias lookup) | utility | function |
| `Yb6` | `findNearestName` (Levenshtein near-miss suggester) | utility | function |
| `y_` | `getCommandName` (`userFacingName` or `name` fallback) | utility | function |
| `u56` | `getSkillOverrideValue` (reads `skillOverrides[skillName]` from settings) | utility | function |
| `PJK` | `isUserTypedSlashCommandInTurn` (mid-message bypass detector for disable-model-invocation) | chunks.141.mjs:2316-2329 | function |
| `jJK` | `formatSkillToolPromptForCommand` (wraps `/skill args` in COMMAND_NAME/COMMAND_MESSAGE tags) | chunks.141.mjs:2214-2217 | function |
| `XJK` | `formatSkillToolPromptForUserOnlySkill` (for `userInvocable: false` skills) | chunks.141.mjs:2209-2213 | function |
| `nKY` | `formatSkillToolPromptByInvocability` (chooses `jJK` vs `XJK`) | chunks.141.mjs:2219-2223 | function |
| `iKY` | `loadCommandForSkillToolInvocation` | chunks.141.mjs:2225-2230 | function |
| `MJK` | `runCommandPromptForSkillTool` (invokes `getPromptForCommand` + applies hook injection) | chunks.141.mjs:2232 | function |
| `tKY` | `isAutoAllowableSkillCommand` (checks `SAFE_SKILL_PROPERTIES` membership) | chunks.141.mjs:2420 | function |
| `rKY` | `executeSkillToolForkedSkill` (forked-context branch) | chunks.141.mjs:2331 | function |
| `lKY` | `processSlashCommand` (slash-command dispatch wrapper - sets up userInvocable: false short-circuit) | chunks.141.mjs:2026-2049 | function |
| `UF` | `getBuiltinCommandNames` (memoized Set of all built-in command names + aliases) | chunks.191.mjs:316 | function |
| `XH7` | `BUILTIN_COMMANDS_REGISTRY` (memoized array of all command definitions) | chunks.191.mjs:316 | function |
| `DJK` | `isOfficialMarketplaceSkill` (plugin from anthropics official marketplace) | utility | function |
| `jI8` | `recordSkillUsage` (frequency tracker for skill-coach ranking) | utility | function |

## Module: Built-in Slash Commands referenced by v2.1.108

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QbY` | `initCommand` (the `/init` command definition - `type: "prompt"`, `source: "builtin"`) | chunks.174.mjs:426-441 | object |
| `GBK` | `initCommand` export alias | chunks.174.mjs:441 | variable |
| `UbY` | `NEW_INIT_PROMPT` (the prompt body used when `CLAUDE_CODE_NEW_INIT` is set) | chunks.174.mjs | constant |
| `gbY` | `OLD_INIT_PROMPT` (the prompt body used otherwise) | chunks.174.mjs | constant |
| `dbY` | `initVerifiersCommand` (`/init-verifiers` definition) | chunks.174.mjs:449 | object |
| `TBK` | `initVerifiersCommand` export | chunks.174.mjs | variable |
| `LdY` | `reviewCommand` (the `/review` command - `type: "prompt"`, `source: "builtin"`) | chunks.183.mjs:2155-2167 | object |
| `dr8` | `reviewCommand` export alias | chunks.183.mjs:2176 | variable |
| `ulK` | `ultrareviewCommand` (the `/ultrareview` command - `type: "local-jsx"`, rejected by SkillTool) | chunks.183.mjs:2168-2176 | object |
| `ydY` | `LOCAL_REVIEW_PROMPT` (builder for `/review`'s prompt body) | chunks.183.mjs | function |
| `QnK` | `securityReviewCommand` (built via `createMovedToPluginCommand`) | chunks.185.mjs:201-230 | object |
| `UnK` | `createMovedToPluginCommand` factory | chunks.185.mjs | function |

## Module: Bundled Skill Builder (v2.1.111 `/less-permission-prompts`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `p25` | `registerLessPermissionPromptsSkill` | chunks.211.mjs:1401-1419 | function |
| `WjA` | `LESS_PERMISSION_PROMPTS_BODY` (~6 KB instruction string) | chunks.211.mjs:1421 | constant |
| `MA` | `registerBundledSkill` (the builder helper used by every bundled skill) | utility | function |
| `F25` | `lessPermissionPromptsModuleInit` (module init closure that wires `k0()`) | chunks.211.mjs:1423-1425 | function |

## Cross-version notes (v2.1.88 -> v2.1.112)

### `disableSkillShellExecution`

- **v2.1.88**: no such setting; `executeShellCommandsInPrompt` (`src/utils/promptShellExecution.ts`) unconditionally runs `!command` fences in skills and slash commands.
- **v2.1.91**: new boolean setting on both `userSettings` and `policySettings`. Policy layer wins. New helpers `Wc8` (gate read) and `Dc8` (placeholder rewriter) invoked from the skill expansion paths in `loadSkillsDir.ts` -> chunks.158.mjs and the plugin skill builder -> chunks.156.mjs. `s0Y` (chunks.158.mjs:1626) decides which `loadedFrom` values are subject to the gate: `"skills"`, `"commands_DEPRECATED"`, `"plugin"`. Sources marked `"policySettings"` are exempt (admin-trusted).

### Plugin `monitors`

- **v2.1.88**: no `monitors` key on plugin manifests. `grep -r "monitors" /lyz/codespace/3rd/claude-code/src/plugins/` returns no matches. The closest existing concept is `hooks`, which are short-lived and event-driven.
- **v2.1.105**: new `wi5`/`XO1`/`$i5` zod schemas, new loader `K_z`, new runtime `dzA`+`IP7`+`kz5`+`QzA`+`gzA`+`UzA`, new background-task `kind: "monitor"` discriminator. The arm-trigger `"on-skill-invoke:<name>"` ties into the skill-invocation event bus (`sn1`).

### Built-in command discovery + invocation via Skill tool

- **v2.1.88**: `/init`, `/review`, `/security-review` are `type: "prompt"`, `source: "builtin"` (same as v2.1.112), but the skill-listing pipeline excludes `source === "builtin"` commands from the model's view. The Skill tool's `validateInput` would have accepted them if invoked, but the model didn't know they existed.
- **v2.1.108**: listing pipeline no longer excludes built-ins. The `validateInput` rejection message for `type !== "prompt"` was also split into "UI command" (for `local-jsx`) and "built-in CLI command" (for everything else non-prompt), with an "Ask the user to run /<name> themselves" hint. v2.1.88's single-message error was `Skill ${name} is not a prompt-based skill`.

### `disable-model-invocation` mid-message bypass

- **v2.1.88**: `validateInput` in `SkillTool.ts:412-417` hard-rejects any command with `disableModelInvocation === true`. There is no bypass for the case where the user typed `/<skill>` mid-message.
- **v2.1.110**: new helper `PJK` (chunks.141.mjs:2316-2329) walks back through the current turn's user messages looking for an unambiguous `/<skill-name>` token (regex: `(?<!\\S)/${name}(?=$|\\s)`, skipping meta and tool-result messages, and skipping content that already contains a `<command-message>` tag). If found, `validateInput` lets the call proceed (chunks.141.mjs:2553-2557 - the `O.disableModelInvocation && !PJK(Y, K)` short-circuit). The same `PJK` is used for the `skillOverrides: "user-invocable-only"` setting (chunks.141.mjs:2559).

### Skill listing description cap

- **v2.1.88**: `MAX_LISTING_DESC_CHARS = 250` (hard-coded in `src/tools/SkillTool/prompt.ts:29`).
- **v2.1.105**: new setting `skillListingMaxDescChars` (schema in chunks.19.mjs:450) with default `1536` (constant `GJz` in chunks.97.mjs:777). Read via `Cb8` (chunks.97.mjs:692). Bundled skills get full descriptions regardless (logic in `sh4` chunks.97.mjs:752 - `vJz` is the "is-bundled" predicate). Truncation only fires when even bundled+description-truncated entries exceed the char budget.

### `/less-permission-prompts` bundled skill

- **v2.1.88**: no such skill. The bundled skill directory (`src/skills/bundled/`) contains 16 files, none of which is this skill or anything similar.
- **v2.1.111**: new builder `p25` (chunks.211.mjs:1401) registers the bundled skill. The body (`WjA`) is a ~6 KB instruction string that teaches the model how to scan transcripts, filter to read-only, drop auto-allowed commands, pick narrow patterns, prioritize by frequency, and merge into project `.claude/settings.json`.
