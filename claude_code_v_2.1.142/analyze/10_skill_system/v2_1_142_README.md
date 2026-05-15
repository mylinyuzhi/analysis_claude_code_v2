# Skill System Module (10_skill_system) - v2.1.113 -> v2.1.142

## TL;DR - v2.1.112 -> v2.1.142 in 30 Seconds

The Skill subsystem layers nine new diffs on top of the v2.1.112 foundation. The architecture is unchanged (frontmatter loader, `Skill` tool, slash-command dispatcher, forked-skill runner) but the configuration surface, telemetry, and skill-discovery rules all expanded:

| Version | Delta | Change |
|---------|-------|--------|
| v2.1.142 | Feature | **Plugin with root-level `SKILL.md` is itself a skill** - if the plugin manifest declares no `skills` and there is no `skills/` directory, but `SKILL.md` exists at the plugin root, the host treats the whole plugin directory as a single skill. |
| v2.1.142 | Bugfix | **`skills: ["./"]` no longer reports "path escapes plugin directory"** - the kg path-resolver and the `oj/U88` filter step both accept the plugin root as a valid skill path now (`H2` marketplace exception). |
| v2.1.139 | Bugfix | **Regex metacharacters in argument names no longer break substitution** - `uFH` now wraps every argument name in `Vx(...)` before building the replacement regex, so frontmatter `arguments: ["foo.bar", "baz*"]` no longer leaves the placeholder unreplaced. |
| v2.1.136 | Bugfix | **Plugin `skills` entry no longer hides the default `skills/` directory silently** - `U88` now adds a `folder-shadowed-by-manifest` advisory in the plugin diagnostic stream, and listing a plain file path under `skills:` errors instead of failing silently. |
| v2.1.133 | Bugfix | **Subagents can discover project, user, and plugin skills via the Skill tool** - the loader now passes the full skill set into forked-subagent prompts, matching the main-loop tool listing. |
| v2.1.129 | Feature | **`skillOverrides` setting** with values `"off" / "user-invocable-only" / "name-only" / "on"` - new admin/user/project/local setting key resolved by `oT5` and `aT5`, surfaced in the `/skills` dialog (`uJ4`). |
| v2.1.126 | Feature | **`claude_code.skill_activated` OTel event with `invocation_trigger`** - `Qf$` emits one event per skill activation, tagged `"user-slash"`, `"claude-proactive"`, or `"nested-skill"`. |
| v2.1.121 | Feature | **Type-to-filter search box in `/skills` dialog** - the `/skills` dialog (`uJ4`) gained an inline query input that filters by name, description, or source. |
| v2.1.120 | Feature | **`${CLAUDE_EFFORT}` placeholder in skill content** - `$I6.getPromptForCommand` replaces the placeholder with the current effort value, computed via `aT(model, effort)`. Also exposed to hook commands and the Bash tool via the `CLAUDE_EFFORT` env var. |
| v2.1.117 | Capability | **Native `bfs`/`ugrep` available via the Bash tool** - on native macOS/Linux builds, `Glob` and `Grep` are replaced by embedded `bfs` and `ugrep` invoked through the Bash tool. (Skill system is unchanged - it just gets faster searches from inside skills' shell fences.) |

Everything else (frontmatter parsing, `userInvocable` semantics, forked-skill execution, the v2.1.91 shell-execution policy gate, the v2.1.105 listing cap, the v2.1.108 builtin-skill listing inclusion, plugin monitors) is identical to v2.1.112 except for obfuscated symbol renames.

---

## Overview

A **skill** is a markdown file with frontmatter that the user (`/skill-name`) and/or the model (via the `Skill` tool) can invoke. The body is expanded with `${CLAUDE_SKILL_DIR}`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}` (new in v2.1.120), and `!command` shell fences before being injected as a user message. Two execution shapes:

- **Inline** (default) - `processPromptSlashCommand` builds the expanded prompt and pushes it as a user message into the main conversation.
- **Forked** (`context: fork` frontmatter) - the skill runs in a child agent via `runAgent`, with its own token budget and message history; parent only sees the child's final `result`.

The Skill tool is `SkillTool` (internal `VH`) - the only model-facing route. It validates against `skillOverrides`, plays the permission flow, then either runs the skill inline (and emits the expansion back to the main loop) or hands off to the forked path (`ql_`).

In v2.1.142 the skill discovery sources are:

1. **Bundled** - shipped inside the binary (`init`, `review`, `security-review`, `simplify`, `claude-api`, `debug`, ...)
2. **User** - `~/.claude/skills/<name>/SKILL.md`
3. **Project** - `<repo>/.claude/skills/<name>/SKILL.md`
4. **Plugin (subdir)** - `<plugin-root>/skills/<name>/SKILL.md` declared in a plugin manifest
5. **Plugin (root)** - `<plugin-root>/SKILL.md` when the plugin has no `skills` manifest entry and no `skills/` subdir (NEW v2.1.142)
6. **MCP** - returned dynamically by an MCP server's `prompts/list` response

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features: Skill discovery, frontmatter, Skill tool
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, Agents (used by forked skills)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Policy/permission settings
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Plugin manifests
> - Unit-09 (v2.1.142) additions: [symbol_additions_v2_1_142_skills_goal.md](../00_overview/symbol_additions_v2_1_142_skills_goal.md)

Key new symbols (v2.1.113 -> v2.1.142):

- `escapeRegex` (`Vx`) - cli_inner_pretty.js:9491 - regex metacharacter escaper used in `uFH`
- `substituteArgsInPrompt` (`uFH`) - cli_inner_pretty.js:217479 - argument substitution function (now regex-safe)
- `pluginRootIsSkillFallback` (anonymous in `U88`) - cli_inner_pretty.js:230211-230213 - root-level SKILL.md branch
- `INLINE_PLUGIN_SENTINEL` (`H2` = `"skills-dir"`) - cli_inner_pretty.js:218312 - marketplace sentinel allowing `skills: ["./"]`
- `resolvePluginPathRelative` (`WTH`) - cli_inner_pretty.js:229990 - path-traversal guard
- `validatePluginComponentPaths` (`kg`) - cli_inner_pretty.js:229997 - generic plugin path resolver (gained `isDir` strictness in v2.1.136)
- `resolveSkillOverride` (`oT5`) - cli_inner_pretty.js:476885 - reads `skillOverrides` from `policySettings`/`flagSettings`
- `resolveProjectSkillOverride` (`aT5`) - cli_inner_pretty.js:476894 - reads `projectSettings`/`userSettings` overrides
- `formatSkillSource` (`xJ4`) - cli_inner_pretty.js:476897 - "mcp"/"plugin"/"built-in"/etc display labels
- `SkillsDialog` (`uJ4`) - cli_inner_pretty.js:476909 - the `/skills` dialog component with filter search
- `SkillRow` (`sT5`) - cli_inner_pretty.js:477137 - per-skill row inside the dialog
- `SKILL_OVERRIDE_VALUES` (`kB6`) - cli_inner_pretty.js:477208 - `["on", "name-only", "user-invocable-only", "off"]`
- `SKILL_OVERRIDE_STYLES` (`rT5`) - cli_inner_pretty.js:477209 - per-state glyph/color/label
- `getSkillOverride` (`st`) - cli_inner_pretty.js:513847 - per-skill final state used by the SkillTool
- `isSkillModelInvocationDisabled` (`VE4`) - cli_inner_pretty.js:513851 - resolves to `user-invocable-only` or `off`
- `isSkillOff` (`iP8`) - cli_inner_pretty.js:513855 - resolves to `off` only
- `getSkillsFromAllSources` (`Ax5`) - cli_inner_pretty.js:513752 - the unified skill loader (v2.1.133 includes subagent path)
- `getAllCommands` (`TE4`) - cli_inner_pretty.js:514269 - memoised orchestrator for commands+skills
- `emitSkillActivatedOtel` (`Qf$`) - cli_inner_pretty.js:218520 - the new OTel event emitter
- `formatSkillSourceForOtel` (`N7H`) - cli_inner_pretty.js:218534 - metadata for the event
- `getSkillEffortValue` (`aT`) - referenced by `getPromptForCommand` for `${CLAUDE_EFFORT}` substitution
- `formatCommand` (`$I6`) - cli_inner_pretty.js:406196 - the v2.1.120 `${CLAUDE_EFFORT}` substitution lives in `getPromptForCommand`

---

## Module Structure (v2.1.142 additions)

| Document | Purpose |
|----------|---------|
| [root_skill_md.md](./root_skill_md.md) | v2.1.142 plugin with root-level `SKILL.md` and no `skills/` subdir becomes a skill |
| [skill_wildcard.md](./skill_wildcard.md) | v2.1.121/v2.1.139 `Skill(name *)` permission wildcard - prefix match (cross-link to 37_permission_policy) |
| [regex_safe_args.md](./regex_safe_args.md) | v2.1.139 fix: argument names with regex metacharacters now escape via `Vx` |
| [skill_overrides.md](./skill_overrides.md) | v2.1.129 `skillOverrides` setting (`off` / `user-invocable-only` / `name-only`) |
| [claude_effort_var.md](./claude_effort_var.md) | v2.1.120 `${CLAUDE_EFFORT}` placeholder in skill content + hook/Bash env var |
| [filter_search.md](./filter_search.md) | v2.1.121 type-to-filter search box in the `/skills` dialog |
| [plugin_skills_inheritance.md](./plugin_skills_inheritance.md) | v2.1.142 `skills: ["./"]` valid; v2.1.136 `plugin.json skills` shadowing default `skills/` warning + file-path error |
| [subagent_skill_discovery.md](./subagent_skill_discovery.md) | v2.1.133 subagents now discover project/user/plugin skills via Skill tool |
| [skill_activation_otel.md](./skill_activation_otel.md) | v2.1.126 `claude_code.skill_activated` OTel event with `invocation_trigger` |

---

## Architecture (v2.1.142 deltas)

```
                       SKILL SYSTEM ARCHITECTURE (v2.1.142 deltas)
 ============================================================================

   Source: /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js

   cli_inner_pretty.js:9491       Vx (escapeRegex) - used in uFH for arg name escape
   cli_inner_pretty.js:217479     uFH (substituteArgsInPrompt) - now regex-safe
   cli_inner_pretty.js:218312     H2 (INLINE_PLUGIN_SENTINEL = "skills-dir") - marketplace
                                  exception that lets a `skills: ["./"]` entry resolve to the
                                  plugin root itself rather than being filtered as a self-ref
   cli_inner_pretty.js:218520     Qf$ (emitSkillActivatedOtel) - v2.1.126
   cli_inner_pretty.js:229997     kg (validatePluginComponentPaths) - the path resolver
   cli_inner_pretty.js:230198-13  U88 root-level SKILL.md detection + skills: ["./"] filter
   cli_inner_pretty.js:352727     sc_ (forked slash-command, "user-slash" trigger)
   cli_inner_pretty.js:353376     ql_ (forked skill via Skill tool, claude-proactive/nested-skill)
   cli_inner_pretty.js:406180     argumentNames frontmatter parser
   cli_inner_pretty.js:406263-69  $I6.getPromptForCommand - new ${CLAUDE_EFFORT} substitution
   cli_inner_pretty.js:476885     oT5 (resolveSkillOverride) - policy/flag layer
   cli_inner_pretty.js:476894     aT5 (resolveProjectSkillOverride) - project/user layer
   cli_inner_pretty.js:476909     uJ4 (SkillsDialog) - rendered for /skills
   cli_inner_pretty.js:513847     st (getSkillOverride) - effective per-skill state
   cli_inner_pretty.js:513752     Ax5 (getSkillsFromAllSources) - unified loader

                ┌────────────────────────────────────────────────┐
                │  Discovery (v2.1.142 has 6 sources)            │
                │                                                │
                │  ┌─Bundled─────────────────────────────────┐   │
                │  │ zG4(): /init, /review, /simplify, ...   │   │
                │  └─────────────────────────────────────────┘   │
                │  ┌─User ~/.claude/skills/  (KI6)─────────────┐ │
                │  │ Project .claude/skills/                   │ │
                │  └───────────────────────────────────────────┘ │
                │  ┌─Plugin <root>/skills/<name>/  (Dh6)───────┐ │
                │  └───────────────────────────────────────────┘ │
                │  ┌─Plugin <root>/SKILL.md  (U88, NEW)────────┐ │ <- v2.1.142
                │  │ When manifest.skills absent AND no        │ │
                │  │ skills/ dir AND SKILL.md exists           │ │
                │  └───────────────────────────────────────────┘ │
                │  ┌─MCP prompts/list (yV6)────────────────────┐ │
                │  └───────────────────────────────────────────┘ │
                └────────────────────────────────────────────────┘
                              │
                              v (all merged via D9H, sorted by source priority)
                ┌────────────────────────────────────────────────┐
                │  Filtering layer                               │
                │                                                │
                │  st(skill)                                     │
                │   ├─ skillOverrides[name] from settings?       │
                │   │   └─> off / name-only / user-invocable     │
                │   └─ fallback: "on"                            │
                │                                                │
                │  VE4(skill)  -> not for model (off|user-only)  │
                │  iP8(skill)  -> off (also hidden from /)       │
                └────────────────────────────────────────────────┘
                              │
                              v
                ┌────────────────────────────────────────────────┐
                │  Activation                                    │
                │                                                │
                │  /skill-name           (user-slash)            │
                │  Skill tool main loop  (claude-proactive)      │
                │  Skill tool from fork  (nested-skill)          │
                │                                                │
                │  -> Qf$ emits skill_activated OTel             │
                │  -> $I6.getPromptForCommand expands:           │
                │     - ${CLAUDE_SKILL_DIR}                      │
                │     - ${CLAUDE_SESSION_ID}                     │
                │     - ${CLAUDE_EFFORT}     (NEW v2.1.120)      │
                │     - $argName regex (regex-safe v2.1.139)     │
                │     - !command fences (gated by v2.1.91)       │
                └────────────────────────────────────────────────┘
```

---

## How the v2.1.142 changes interact

The nine diffs cluster into three layers:

**Authoring surface** (what a skill author can write)
- v2.1.142 root-level `SKILL.md` enables single-file-plugin skills (a plugin with one skill is no longer forced into the `skills/<name>/SKILL.md` boilerplate)
- v2.1.120 `${CLAUDE_EFFORT}` lets skills branch on effort without reading env vars
- v2.1.139 regex-safe arg substitution makes frontmatter `arguments: ["foo.bar"]` (with metacharacters) finally work

**Configuration surface** (what an operator can tune)
- v2.1.129 `skillOverrides` setting - per-skill override at policy/user/project/local tiers
- v2.1.136 `plugin.json skills` shadowing of default `skills/` - now reports a `folder-shadowed-by-manifest` advisory instead of silently dropping the folder
- v2.1.142 `skills: ["./"]` - lets a plugin author opt into the "plugin root *is* the skill" model explicitly

**Visibility and telemetry**
- v2.1.121 `/skills` dialog gained a search filter (small UX change, no semantic shift)
- v2.1.126 `claude_code.skill_activated` OTel event - enables enterprises to track which skills fire and via what trigger
- v2.1.133 subagent skill discovery fix - now visible to subagents via the Skill tool

---

## Cross-references

- Permission policy (`Skill(name *)` wildcard rules) - `37_permission_policy/skill_wildcard.md`
- Plugin manifests (the `plugin.json skills` field shape) - `26_plugin_packaging`
- Hooks (the `CLAUDE_EFFORT` environment variable, the new `effort.level` JSON input) - `27_hooks_subsystem`
- Goal command (uses the Stop hook with a literal prompt - similar internal mechanism to a skill but without frontmatter or arg substitution) - `39_goal/README.md`
