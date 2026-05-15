# Skill System Module (10_skill_system) - v2.1.112

## TL;DR - v2.1.88 -> v2.1.112 in 30 Seconds

The Skill subsystem (skill loading, Skill tool, slash-command dispatch, frontmatter parsing) is **architecturally the same** as v2.1.88, with six shipped diffs that all sit on top of the v2.1.88 foundation:

| Delta | Change | Where |
|---|--------|-------|
| Security | **`disableSkillShellExecution` policy gate** (v2.1.91) - admin/user can disable inline `!command` and `` ` !`` shell-execution placeholders in skills, custom slash commands, and plugin commands; runs are replaced with `[shell command execution disabled by policy]` | `Wc8` chunks.155.mjs:2839, `Dc8` chunks.155.mjs:2844 |
| Feature | **Plugin `monitors` manifest** (v2.1.105) - new top-level key declaring background watch scripts; host auto-arms them at session start (`when: "always"`) or on first skill dispatch (`when: "on-skill-invoke:<skill>"`) | `K_z` chunks.88.mjs:1799, `IP7` chunks.205.mjs:2878, `kz5` chunks.205.mjs:2911 |
| Capability | **Built-in slash commands discoverable via Skill tool** (v2.1.108) - `/init`, `/review`, `/security-review` and friends (all `type: "prompt"` with `source: "builtin"`) are now listed for the model and accepted by the Skill tool; only `local-jsx` and other non-prompt builtins are still rejected with a clearer error message | Skill-tool `validateInput` chunks.141.mjs:2553-2571 |
| Bugfix | **`disable-model-invocation` mid-message bypass** (v2.1.110) - `PJK` now detects when the user typed `/<skill>` mid-message; if so, the Skill tool allows the invocation even though `disable-model-invocation: true` is set on the skill | `PJK` chunks.141.mjs:2316-2329 |
| Feature | **`/less-permission-prompts` bundled skill** (v2.1.111) - new user-invocable bundled skill that scans `~/.claude/projects/*/sessions.jsonl` and proposes a prioritized read-only-Bash + MCP allowlist for project `.claude/settings.json` | `p25` chunks.211.mjs:1401, `WjA` chunks.211.mjs:1421 |
| Tuning | **Skill listing description cap raised 250 -> 1,536** (v2.1.105) - per-skill description ceiling in the Skill tool's static listing went from a hard-coded 250 chars to a configurable cap (`skillListingMaxDescChars`, default 1,536) | `Cb8` chunks.97.mjs:692, `GJz` chunks.97.mjs:777 |

Everything else (frontmatter parsing, `userInvocable` semantics, forked skill execution, skill-coach telemetry, MCP skill builders) is identical to v2.1.88 except for obfuscated symbol renames.

---

## Overview

**Skills** are markdown files that the user (`/skill-name`) and/or the model (via the Skill tool) can invoke to expand into a full agent prompt at run-time. They live in five places:

1. **Bundled** - shipped inside the binary (`init`, `review`, `security-review`, `simplify`, `claude-api`, `debug`, ...).
2. **User** - `~/.claude/skills/<name>/SKILL.md`.
3. **Project** - `<repo>/.claude/skills/<name>/SKILL.md`.
4. **Plugin** - `<plugin-root>/skills/<name>/SKILL.md` declared in a plugin manifest.
5. **MCP** - returned dynamically by an MCP server's `prompts/list` response.

A skill has frontmatter (`name`, `description`, `disable-model-invocation`, `allowed-tools`, `argument-hint`, `model`, `effort`, `context: fork`, `hooks`, ...) and a markdown body that gets expanded with `${CLAUDE_SKILL_DIR}`, `${CLAUDE_SESSION_ID}`, and `!command` shell-execution placeholders before being injected as the next user message.

Two execution shapes:

- **Inline** (default) - `processPromptSlashCommand` builds the expanded prompt and pushes it as a user message into the **main** conversation. The model receives the skill body and continues the same turn.
- **Forked** (`context: fork` frontmatter) - the skill is executed in a forked sub-agent (its own token budget, own message history) via `runAgent`. The parent only sees the sub-agent's final `result` text.

The Skill tool (named `Skill`, internal `VH`) is the proactive route for the model. It accepts `{skill, args?}` and is the only way the model can invoke a slash-command skill - the model cannot type `/foo` itself.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features: Skill discovery, frontmatter, Skill tool
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, Agents (used by forked skills)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Policy/permission settings
> - Unit-10 additions: [symbol_additions_unit_10.md](../00_overview/symbol_additions_unit_10.md)

Key symbols in this module:

- `SkillTool` (`m96`) - chunks.141.mjs:2509 - The `Skill` tool definition
- `SKILL_TOOL_NAME` (`VH`) - constant `"Skill"`
- `isUserTypedSlashCommandInTurn` (`PJK`) - chunks.141.mjs:2316 - mid-message detection for disable-model-invocation bypass
- `validateSkillInvocation` (anonymous in `m96.validateInput`) - chunks.141.mjs:2526
- `isShellExecutionDisabledByPolicy` (`Wc8`) - chunks.155.mjs:2839 - reads `disableSkillShellExecution`
- `stripShellExecutionPlaceholders` (`Dc8`) - chunks.155.mjs:2844 - replaces fences with `[shell command execution disabled by policy]`
- `SHELL_DISABLED_PLACEHOLDER` (`lNK`) - chunks.155.mjs:2854 - literal `"[shell command execution disabled by policy]"`
- `loadPluginMonitorsFromManifest` (`K_z`) - chunks.88.mjs:1799
- `armPluginMonitors` (`IP7`) - chunks.205.mjs:2878
- `usePluginMonitorsLifecycle` (`kz5`) - chunks.205.mjs:2911
- `runPluginMonitor` (`dzA`) - chunks.205.mjs:2852
- `lessPermissionPromptsBuilder` (`p25`) - chunks.211.mjs:1401
- `LESS_PERMISSION_PROMPTS_BODY` (`WjA`) - chunks.211.mjs:1421
- `getSkillListingMaxDescChars` (`Cb8`) - chunks.97.mjs:692
- `DEFAULT_SKILL_LISTING_DESC_CHARS` (`GJz`) - chunks.97.mjs:777 (constant `1536`)
- `shouldStripShellInSource` (`s0Y`) - chunks.158.mjs:1626 - decides which `loadedFrom` sources are subject to the shell-execution policy
- `pluginMonitorSchema` (`wi5`) - chunks.18.mjs:2241
- `pluginMonitorsArraySchema` (`XO1`) - chunks.18.mjs:2248
- `disableSkillShellExecutionSettingSchema` - chunks.19.mjs:475
- `skillListingMaxDescCharsSettingSchema` - chunks.19.mjs:450

---

## Module Structure

| Document | Purpose |
|----------|---------|
| [disable_shell_execution.md](./disable_shell_execution.md) | The `disableSkillShellExecution` policy/user setting added in v2.1.91 - how skills, custom slash commands, and plugin commands have their `!command` placeholders neutralized when the gate is on |
| [plugin_monitors.md](./plugin_monitors.md) | Background `monitors` manifest key (v2.1.105): persistent background-task scripts arming at session start or on first skill invocation; load pipeline, arm pipeline, suppression handling |
| [model_invokable_builtins.md](./model_invokable_builtins.md) | Why the model can now discover and invoke built-in slash commands like `/init`, `/review`, `/security-review` via the Skill tool (v2.1.108); rejection message split for `local-jsx` vs `built-in CLI` |
| [less_permission_prompts.md](./less_permission_prompts.md) | The `/less-permission-prompts` bundled skill (v2.1.111): transcript scanner, read-only filter, auto-allow exclusions, settings.json merge step |

---

## Architecture

```
                       SKILL SYSTEM ARCHITECTURE (v2.1.112 deltas)
 ============================================================================

   Source chunks (v2.1.112):
   chunks.18.mjs   -- Plugin manifest schemas (wi5, XO1, $i5 -- monitors)
   chunks.19.mjs   -- User/policy settings schemas (disableSkillShellExecution,
                       skillListingMaxDescChars)
   chunks.88.mjs   -- Plugin loader pipeline (K_z, A56) -- loads monitors from
                       manifest or monitors/monitors.json
   chunks.97.mjs   -- Skill listing budget helpers (Cb8, ah4, sh4, N88)
   chunks.140.mjs  -- Background-task type registry (uses "monitor" kind)
   chunks.141.mjs  -- SkillTool definition (m96), validateInput, checkPermissions,
                       call, PJK mid-message detector, builtin-skill listing (UF)
   chunks.155.mjs  -- Shell-execution policy gate (Wc8) + placeholder rewriter
                       (Dc8, KPY, _PY, lNK)
   chunks.156.mjs  -- Plugin skill -> Command shape (B_7-like) - applies Wc8/Dc8
   chunks.158.mjs  -- User/project skill -> Command shape (loadSkillsDir.ts
                       equivalent) - applies s0Y + Wc8/Dc8; PJK reads turn history
   chunks.183.mjs  -- builtin /review definition (LdY)
   chunks.174.mjs  -- builtin /init definition (QbY, GBK)
   chunks.185.mjs  -- builtin /security-review definition (QnK, via UnK / createMovedToPluginCommand)
   chunks.205.mjs  -- Plugin monitor runtime (dzA, IP7, kz5, gzA, QzA)
   chunks.211.mjs  -- /less-permission-prompts skill builder (p25) + body (WjA)

 ============================================================================

  +-----------------+   +----------------+   +----------------------+
  | bundled skills  |   | user/project   |   |  plugin skills /     |
  | (init, review,  |   | .claude/skills | --|  monitors / commands |
  | security-review,|   | /SKILL.md      |   +----------+-----------+
  | simplify, etc.) |   +-------+--------+              |
  +--------+--------+           |                       |
           |                    |                       v
           v                    v                  +----+-----+
    +------+--------------------+------------------+ commands |
    | getCommands(cwd)  ------> Command[] (type:'prompt'|...) | array
    +-------------------------+----------------------+--------+
                              |
                              v
              +---------------+--------------+
              | SkillTool (m96) validateInput|
              |  - disableModelInvocation +  |   <-- v2.1.110 fix:
              |    PJK mid-message bypass    |       PJK lets /<skill>
              |  - skillOverrides "off" /    |       mid-message bypass
              |    "user-invocable-only" +   |       disable-model-invocation
              |    PJK bypass                |
              |  - type === "prompt" else    |   <-- v2.1.108 change:
              |    "X is a UI/built-in CLI   |       error msg distinguishes
              |    command, not a skill"     |       local-jsx vs built-in CLI
              +---------------+--------------+
                              |
                              v
                  +-----------+-----------+
                  | processPromptSlashCmd |
                  +-----+----------+------+
                        |          |
                        v          v
                    (inline)    (forked context: fork)
                        |          |
                        v          v
                getPromptForCommand() applies:
                  - qL6  : $ARGUMENTS / $1 / arg-names interpolation
                  - fx   : ${ENV_VAR} substitution
                  - kb8  : ${user_config.*} substitution
                  - replace ${CLAUDE_SKILL_DIR}, ${CLAUDE_SESSION_ID}
                  - if Wc8() && s0Y(loadedFrom, source):
                        Dc8(prompt)  <-- v2.1.91: strip !command fences
                    else:
                        An(prompt)   <-- normal shell expansion
```

The diagram above is the v2.1.112 picture. The v2.1.88 equivalent omits the `Wc8`/`Dc8`/`s0Y` chain entirely (no shell-execution gate), the `PJK` bypass (no mid-message escape from `disable-model-invocation`), and the `local-jsx` vs `built-in CLI` rejection split (single generic "is not a prompt-based skill" error). Plugin monitors do not exist in v2.1.88 at all - no `monitors` manifest key, no `IP7`, no `kz5`.

---

## Cross-Version Notes (v2.1.88 -> v2.1.112)

### Bundled skills v2.1.88

In v2.1.88, `src/skills/bundled/` contains: `batch.ts`, `claudeApi.ts`, `claudeApiContent.ts`, `claudeInChrome.ts`, `debug.ts`, `keybindings.ts`, `loop.ts`, `loremIpsum.ts`, `remember.ts`, `scheduleRemoteAgents.ts`, `simplify.ts`, `skillify.ts`, `stuck.ts`, `updateConfig.ts`, `verify.ts`, `verifyContent.ts`. None of `less-permission-prompts.ts`, `fewer-permission-prompts.ts`, or `lessPermissionPrompts.ts` exist.

In v2.1.112, the new builder `p25` at chunks.211.mjs:1401 adds `less-permission-prompts` as a `userInvocable: !0` (model-invocable) bundled skill. So the changelog wording "added skill" is literal: the skill file is new.

### `monitors` v2.1.88

`grep -r "monitors" /lyz/codespace/3rd/claude-code/src/plugins/` returns no matches in v2.1.88. The entire plugin-monitor subsystem is new in v2.1.105+. The schema (`pluginMonitorSchema = wi5` in chunks.18.mjs:2241) lives next to the existing `pluginHookSchema` definition, mirroring the same union pattern (`string` path or `array` inline).

### `disableSkillShellExecution` v2.1.88

`grep -r "disableSkillShellExecution" /lyz/codespace/3rd/claude-code/src/` returns no matches in v2.1.88. The closest existing utility, `executeShellCommandsInPrompt` (`src/utils/promptShellExecution.ts`), unconditionally runs `!command` fences. The new gate in v2.1.91 sits in front of that path.

### `/init`, `/review`, `/security-review` v2.1.88

All three commands exist in v2.1.88 as `type: 'prompt'` with `source: 'builtin'`:
- `/lyz/codespace/3rd/claude-code/src/commands/init.ts:227` -- `type: 'prompt'`, line 238 `source: 'builtin'`
- `/lyz/codespace/3rd/claude-code/src/commands/review.ts:34` -- `type: 'prompt'`, line 39 `source: 'builtin'`
- `/lyz/codespace/3rd/claude-code/src/commands/security-review.ts:198` -- goes through `createMovedToPluginCommand`, which returns `type: 'prompt'`, `source: 'builtin'` (createMovedToPluginCommand.ts:32-37)

So why does the 2.1.108 changelog say "the model can now discover and invoke built-in slash commands"? The v2.1.88 Skill-tool `validateInput` (`src/tools/SkillTool/SkillTool.ts:412-427`) only rejects when `disableModelInvocation === true` or `type !== 'prompt'`. Built-in prompt commands like `/init` were *technically reachable* but were not in the model-visible listing - the **listing pipeline** filtered them out. v2.1.108 is the version that flipped that listing filter so the model actually sees them in the skill listing payload. (The validateInput error message also got the v2.1.108 split: in v2.1.112 chunks.141.mjs:2564-2570, non-prompt commands now report either "UI command" for `local-jsx` or "built-in CLI command" for everything else, instead of a single "is not a prompt-based skill" string in v2.1.88.)

### `disable-model-invocation` mid-message fix v2.1.110

In v2.1.88, the SkillTool `validateInput` blocks any skill with `disableModelInvocation === true`:

```javascript
// v2.1.88 - SkillTool.ts:412-417
if (foundCommand.disableModelInvocation) {
  return { result: false, message: ..., errorCode: 4 }
}
```

If a user typed `/my-deploy-skill` mid-message and `my-deploy-skill` had `disable-model-invocation: true`, the slash-command path passed the skill into `processPromptSlashCommand` which then went into the Skill tool wrapper, which then blocked it. The 2.1.110 fix adds `PJK` (chunks.141.mjs:2316-2329) - a scanner that walks back through the current turn's user messages looking for a `/<skill-name>` token that the user actually typed. If found, `validateInput` lets the call through (chunks.141.mjs:2553-2557).
