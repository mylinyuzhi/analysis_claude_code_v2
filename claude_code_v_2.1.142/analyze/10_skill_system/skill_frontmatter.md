# Skill Definition (Frontmatter Schema) and Author × Operator × Runtime Interaction

> Companion to [skill_overrides.md](./skill_overrides.md) (operator-tier `skillOverrides` setting), [skills_dialog_ui.md](./skills_dialog_ui.md) (the `/skills` UI), and [filter_search.md](./filter_search.md). This document covers the **skill author's** side of the contract — what a skill file declares in its YAML frontmatter, how those fields interact with the operator's `skillOverrides`, and exactly which runtime gate each field hits.

---

## TL;DR

A skill is a markdown file (`SKILL.md`) with YAML frontmatter. The frontmatter has two **author-level visibility fields** that interact with the operator-level `skillOverrides` setting:

| Author field (frontmatter) | Operator-level analogue (`skillOverrides`) | Runtime effect |
|----------------------------|--------------------------------------------|----------------|
| `disable-model-invocation: true` | `"user-invocable-only"` (auto-promoted by `oT5`) | Model cannot invoke via Skill tool **unless** user typed `/<name>` in the current turn |
| `user-invocable: false` | (no operator analogue) | Hides `/<name>` from slash-command list; model can still invoke via Skill tool |
| (default = both omitted) | `"on"` | Both user `/` and model Skill tool work |

The Skill tool runs **four gates in order** before invoking a skill. `name-only` passes all four — it only changes what the model sees in the *listing*, not whether it can call.

---

## The frontmatter schema (`os1` + `rA6`)

```javascript
// ============================================
// SKILL_FRONTMATTER_SCHEMA - The YAML frontmatter zod schema
// Location: cli_inner_pretty.js:198647-198716
// ============================================

// ORIGINAL (for source lookup):
os1 = yH(() =>
  y.object({
    name: RP().optional()...,
    description: RP().optional()...,
    model: RP().optional()...,
    "allowed-tools": yUH().optional()...,
    "argument-hint": RP().optional()...,
    arguments: yUH().optional()...,
    "disable-model-invocation": hUH().optional()...,
    "user-invocable": hUH().optional()...,
    effort: RP().optional()...,
    shell: RP().optional()...,
    version: RP().optional()...,
  }),
);
rA6 = yH(() =>
  os1().extend({
    when_to_use: RP().optional()...,
    paths: yUH().optional()...,
    hooks: y.unknown().optional()...,
    context: y.enum(["inline", "fork"]).nullable().optional()...,
    agent: RP().optional()...,
    fallback: hUH().optional()...,
    /* @internal: created_by, improved_by, mcpServers, lspServers,
       agents, outputStyles, themes, workflows, channels, monitors,
       settings, experimental, dependencies, metadata */
  }),
);

// READABLE (for understanding):
// os1 = COMMON_FRONTMATTER (shared with slash commands)
// rA6 = SKILL_FRONTMATTER (extends os1 with skill-specific fields)
//
// Mapping: os1 -> COMMON_FRONTMATTER, rA6 -> SKILL_FRONTMATTER,
//          RP/hUH -> primitiveValue (string|number|boolean|null),
//          yUH -> stringOrStringArray
```

### Field reference

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `name` | string | filename (no ext) | Display name in `/skills` listing and `/<name>` autocomplete |
| `description` | string | — | One-line summary; sent to the model in the Skill tool listing (collapsed under `name-only`) |
| `model` | string | inherit | Per-skill model override (`haiku`/`sonnet`/`opus`/full ID/`inherit`) |
| `allowed-tools` | string or string[] | (no restriction) | Tools the model can use **while this skill is active** |
| `argument-hint` | string | — | Placeholder text shown after `/<name>` in the prompt UI |
| `arguments` | string or string[] | — | @internal — typed variant of `argument-hint`; the documented form is `argument-hint` |
| **`disable-model-invocation`** | bool | `false` | **If true: model cannot use the Skill tool to invoke it; only user `/<name>` works** |
| **`user-invocable`** | bool | `true` | **If false: hides `/<name>` from users; only the model can invoke** |
| `effort` | string \| number | (inherit) | Thinking effort: `low`/`medium`/`high`/`max` or integer |
| `shell` | string | `bash` | Shell for `!`-fenced command blocks (`bash` or `powershell`) |
| `version` | string | — | @internal bookkeeping |
| `when_to_use` | string | — | Guidance for when the model should reach for this skill (concatenated into the tool description) |
| `paths` | string[] | — | Glob patterns; skill only auto-loads when the model touches matching files |
| `hooks` | object | — | Hooks registered for the duration of this skill (same shape as `settings.json hooks`) |
| **`context`** | `"inline"` \| `"fork"` \| `null` | `inline` | **`inline`: expands into the current conversation. `fork`: spawns a subagent with its own token budget; parent only sees the child's `result`** |
| `agent` | string | — | Agent type to spawn when `context: fork` |
| `fallback` | bool | `false` | @internal — yields to a same-suffix plugin/MCP skill if loaded |
| @internal | various | — | `created_by`, `improved_by`, `mcpServers`, `lspServers`, `agents`, `outputStyles`, `themes`, `workflows`, `channels`, `monitors`, `settings`, `experimental`, `dependencies`, `metadata` |

The schema is split into two pieces because the **common subset** (`os1`) is also used by ordinary slash commands under `.claude/commands/`. Skill-only extensions live in `rA6`. The two-layer parse means a slash-command-only field set in a SKILL.md is accepted, and a skill-only field set in a `.claude/commands/*.md` is also accepted (the loader treats `commands_DEPRECATED` files as skill-shaped). The parser at `cli_inner_pretty.js:406160-406194` (`HI6`) reads YAML and produces a normalised `Skill` record:

```javascript
// ============================================
// parseSkillFrontmatter - YAML → normalized Skill record
// Location: cli_inner_pretty.js:406180-406240
// ============================================

// READABLE (for understanding):
function parseSkillFrontmatter(yaml) {
  return {
    name: yaml.name ?? filenameSansExt,
    description: yaml.description,
    model: yaml.model,
    allowedTools: parseToolList(yaml["allowed-tools"]),
    argumentHint: yaml["argument-hint"],
    argumentNames: parseArgumentNames(yaml.arguments),
    disableModelInvocation: parseBoolean(yaml["disable-model-invocation"]),  // → field on Skill record
    userInvocable: yaml["user-invocable"] ?? true,                            // → field on Skill record
    effort: yaml.effort,
    shell: yaml.shell ?? "bash",
    context: yaml.context ?? "inline",
    agent: yaml.agent,
    whenToUse: yaml.when_to_use,
    paths: yaml.paths,
    hooks: yaml.hooks,
    fallback: parseBoolean(yaml.fallback),
    hasUserSpecifiedDescription: yaml.description !== undefined,
    // ...source/loadedFrom/pluginInfo added by the loader, not the parser
  };
}
```

The boolean parser `MBH` (`parseBoolean`) accepts `true`/`false`/`"true"`/`"false"`/`1`/`0` and normalises to a real boolean. The default for `disableModelInvocation` is `false` (model can invoke); the default for `userInvocable` is `true` (user can `/`).

---

## Per-field runtime behavior

The frontmatter schema is the contract. This section walks each field, documenting where it is parsed (the entry function), where it is **consumed at runtime**, and any non-obvious behavior.

### `name` — display + command-name fallback

- **Parser**: `HI6` at `cli_inner_pretty.js:406175`: `displayName: H.name != null ? String(H.name) : void 0`.
- **Consumer**: `userFacingName()` callback on the Skill record (cli_inner_pretty.js:406248-406250): returns `displayName || skillKey`. The `skillKey` is what the user types after `/` (derived from filesystem path via `Bq5`).
- **When does `name` change what you type after `/`?** Only for **plugin-root `SKILL.md`** (cli_inner_pretty.js:406183-406191), where there is no subdirectory to take the command name from. In every other location (skill-dir, `.claude/commands/<file>.md`, plugin-`skills/<dir>/`), the command name comes from the filesystem and `name` is purely cosmetic. See [root_skill_md.md](./root_skill_md.md).
- **Command-name derivation — three deriver functions** (each writes `skillName` into the record):
  - **Skill dir** (`R45` loader at `cli_inner_pretty.js:406315-406342`): `j = z.name` — name = directory name only (no nesting, no prefix). `<root>/.claude/skills/<dir>/SKILL.md` → `<dir>`.
  - **Commands-deprecated** (`v45` at `cli_inner_pretty.js:406397-406398` → `T45`/`V45`): supports nesting via `Ie7` colon-joining. `.claude/commands/<file>.md` → `<file>`; `.claude/commands/<sub>/<file>.md` → `<sub>:<file>`.
  - **Plugin** (`Bq5` at `cli_inner_pretty.js:398863-398878`): always prefixes with `<plugin-id>:`. `<plugin>/skills/<sub>/<dir>/SKILL.md` → `<plugin>:<sub>:<dir>`.
- **MCP skills** use a different format entirely: internal `name = "mcp__" + serverName + "__" + commandName` (`n9H` at `cli_inner_pretty.js:414989`). The `<server>:<command>` form is the **display-only** `userFacingName()` (cli_inner_pretty.js:414997-414999).

### `description` — primary listing field

- **Parser**: `HI6` at `cli_inner_pretty.js:406161-406162` via `yE(H.description, q)` — `yE` falls back to the first paragraph of the markdown body if `description` is omitted.
- **Consumer**: emitted into the model-facing skill listing via `lM6` (cli_inner_pretty.js:232276-232278): combined as `description + " - " + whenToUse` if `whenToUse` is set.
- **Truncation**: per-skill cap of 1536 chars (`maxSkillDescriptionChars`); listing-budget pressure can further truncate or drop. See [skill_listing_budget.md](./skill_listing_budget.md).
- **Why "first paragraph of the body" fallback?** Lets one-shot skill files (no frontmatter) still surface a description without the author having to repeat themselves.

### `model` — per-skill model override

- **Parser**: `HI6` at `cli_inner_pretty.js:406164-406169`:
  ```javascript
  let Y = H.model, f;
  if (typeof Y === "string" && Y.trim().length > 0) {
    let w = Y.trim();
    f = w === "inherit" ? void 0 : n7(w);          // "inherit" → undefined (session model)
  }
  ```
- **Consumer 1 (effort label substitution)**: `getPromptForCommand` at `cli_inner_pretty.js:406269` passes `model ?? ctx.options.mainLoopModel` to `aT()` so `${CLAUDE_EFFORT}` resolves under the skill's model.
- **Consumer 2 (model activation)**: when the skill is invoked, the model field overrides the session model **for the duration of this turn**. The override does **not** persist into settings — the docs explicitly say "the session model resumes on your next prompt." This is by design: a `/deploy` skill running on Opus 4.7 [max-effort] shouldn't permanently switch the user's model.
- **`inherit` literal**: stored as `undefined` so the runtime falls back to the session model. Useful for plugin skills that want to express "I work with whatever model is configured" explicitly.
- **Invalid value handling**: `n7(model)` returns `undefined` on unrecognised model IDs — silently falls back. No log line, intentionally lenient.

### `allowed-tools` — pre-approved tools while skill is active

- **Parser**: `HI6` at `cli_inner_pretty.js:406178`: `allowedTools: rt(H["allowed-tools"])`. `rt` parses both YAML list and comma-separated string forms.
- **Consumer**: injected into the skill record's `allowedTools` array (cli_inner_pretty.js:406232). At invocation time (cli_inner_pretty.js:352230-352232), these are added to `toolPermissionContext.alwaysAllowRules.command`, so the model can run them without per-use approval.
- **`${CLAUDE_SKILL_DIR}` early-bind**: inside `$I6` (cli_inner_pretty.js:406223-406226), every `${CLAUDE_SKILL_DIR}` in an `allowed-tools` entry is expanded to the skill's filesystem root **at parse time**. So `Bash(python3 ${CLAUDE_SKILL_DIR}/scripts/*)` works regardless of cwd at invoke time.
- **Workspace trust gate**: this happens at the **settings-tier level**, not per-skill. `o1H()` (cli_inner_pretty.js:520502-520505) is the global trust check used by hooks, status line, file suggestions, and plugin monitors (cli_inner_pretty.js:521345, 522200, 522448, 558144) — when trust is not accepted, the corresponding configuration sources are suppressed. Project-scoped skills loaded from `.claude/skills/` are similarly subject to whether `projectSettings` is enabled. The source does not contain a per-skill check that gates `allowed-tools` specifically — the gate is upstream at "is the workspace configuration trusted enough to load these skills at all."
- **It is a grant, not a restriction**: `allowed-tools` lists what's auto-approved. Other tools remain callable subject to normal permission rules. To block a tool, use `permissions` settings instead.

### `argument-hint` — autocomplete placeholder

- **Parser**: `HI6` at `cli_inner_pretty.js:406179`: `argumentHint: H["argument-hint"] != null ? String(H["argument-hint"]) : void 0`.
- **Consumer**: rendered by the slash-command autocomplete when the user types `/<name>` — shown as ghost text after the name to suggest expected arguments. Pure display, no behavioral effect.
- **Example**: `argument-hint: "[issue-number]"` makes `/fix-issue ` show ` [issue-number]` until the user starts typing.

### `arguments` — named positional argument list

- **Parser**: `HI6` at `cli_inner_pretty.js:406180`: `argumentNames: iH8(H.arguments)`. `iH8` accepts both YAML list and space-separated string. Each name becomes a positional slot, indexed by order.
- **Consumer**: `uFH` (cli_inner_pretty.js:217479-217509, see [skill_substitutions.md](./skill_substitutions.md#pass-1--ufh-argument-substitution)) — for each `name`, replaces `$name` in the body with the indexed arg value.
- **Why named positional**: the names are not key-value pairs. `arguments: [issue, branch]` means `$issue` = `argv[0]` and `$branch` = `argv[1]`. Callers still pass positional args (`/fix 42 main`), the names are just readable placeholders for the skill body.
- **Regex-safe since v2.1.139** — see [regex_safe_args.md](./regex_safe_args.md).
- **Longest-first replacement**: names are sorted descending by length (`f.sort((O, M) => M.name.length - O.name.length)`) so that `$fooBar` is matched before `$foo`. Prevents prefix collisions.

### `disable-model-invocation` — author-side model lock

- **Parser**: `HI6` at `cli_inner_pretty.js:406184`: `disableModelInvocation: MBH(H["disable-model-invocation"])`. `MBH` is the boolean coercer.
- **Consumer 1 (gate)**: Skill tool gate 2 (cli_inner_pretty.js:353567-353574) blocks invocation unless the user typed `/<name>` this turn (detected by `Am7`).
- **Consumer 2 (override-lock auto-promotion)**: `oT5` at `cli_inner_pretty.js:476890` reads this field and promotes the skill to a `"user-invocable-only"` lock in the `/skills` dialog. The dialog displays `🔒 user-only · locked by author` and refuses to cycle the row.
- **Consumer 3 (subagent preload exclusion)**: per the docs, also prevents the skill from being preloaded into subagents via the `skills:` field of an agent definition.
- **Consumer 4 (listing filter)**: `XG$` predicate (cli_inner_pretty.js:513858-513869) excludes `disableModelInvocation`-true skills from the model-facing listing — Gate 2 would block anyway, but pre-filtering saves listing-budget chars.

### `user-invocable` — author-side user lock

- **Parser**: `HI6` at `cli_inner_pretty.js:406163`: `z = H["user-invocable"] === void 0 ? !0 : MBH(H["user-invocable"])`.
- **Consumer 1 (slash dispatcher)**: `ec_` at `cli_inner_pretty.js:353002-353015` checks `userInvocable === false` and **does not invoke** — instead it emits a self-message saying "This skill can only be invoked by Claude, not directly by users. Ask Claude to use the …".
- **Consumer 2 (autocomplete listing)**: `cli_inner_pretty.js:536513`: `commands.filter((A) => A.userInvocable !== !1)` strips `userInvocable: false` skills from the autocomplete menu.
- **Consumer 3 (isHidden flag)**: skill record's `isHidden: !D` (cli_inner_pretty.js:406246) — drives some UI states.
- **Default**: `true`. Skill is user-invocable unless explicitly opted out.

### `effort` — per-skill effort override

- **Parser**: `HI6` at `cli_inner_pretty.js:406170-406173`: `M = O !== void 0 ? DC(O) : void 0`. `DC` validates against the `sF` effort enum (`low` / `medium` / `high` / `xhigh` / `max`); invalid values log a warning and become `undefined`.
- **Consumer 1 (effort activation)**: when the skill is invoked, the effort field overrides session effort for the turn.
- **Consumer 2 (`${CLAUDE_EFFORT}` substitution)**: `getPromptForCommand` at `cli_inner_pretty.js:406269` passes `effort ?? ctx.getEffortValue()` to `aT()`. See [claude_effort_var.md](./claude_effort_var.md).
- **Validation log**: `Skill <name> has invalid effort '<value>'. Valid options: <enum> or an integer` — the parser is permissive on integers as well as the named enum.

### `shell` — bash vs powershell for `!`-fences

- **Parser**: `HI6` at `cli_inner_pretty.js:406190` via `di$(H.shell, q)`.
- **Consumer**: `gHH` at `cli_inner_pretty.js:406026-406034` selects the shell tool based on this field. If `shell: bash` is set on Windows and Git Bash is not installed, throws an explicit error pointing to https://git-scm.com/downloads/win.
- **Default**: `bash`.
- **PowerShell variant**: `shell: powershell` requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` env var. On non-Windows it silently falls back to bash.
- **Affects only `!`-fences**, not the tools the model invokes (which are still `Bash` / `PowerShell` per session config).

### `when_to_use` — listing description extension

- **Parser**: `HI6` at `cli_inner_pretty.js:406181`: `whenToUse: H.when_to_use != null ? String(H.when_to_use) : void 0`.
- **Consumer 1 (listing)**: `lM6` at `cli_inner_pretty.js:232276-232278` joins it with `description` as `description + " - " + whenToUse` for the listing string.
- **Consumer 2 (fingerprint)**: `bn5` at `cli_inner_pretty.js:557920` includes `whenToUse` in the watcher fingerprint, so edits to it trigger a re-announce.
- **Why split from `description`**: lets the author distinguish "what the skill does" from "trigger phrases / examples that should make Claude reach for it." Combined for the listing, separate in the source for readability.

### `paths` — conditional auto-activation glob

- **Parser**: `Z45` at `cli_inner_pretty.js:406150-406158`. Reads `H.paths`, normalises (strips `/**` suffix), filters empty patterns and `**`-only entries. Returns `undefined` if the result is empty — treated as "unconditional skill" downstream.
- **Consumer 1 (initial split)**: the loader at `cli_inner_pretty.js:406638-406642` checks `if (W.paths && W.paths.length > 0 && !hX.activatedConditionalSkillNames.has(W.name))` — skills with paths go into `hX.conditionalSkills` instead of the active set.
- **Consumer 2 (activation on file touch)**: `snH` at `cli_inner_pretty.js:406510-406538` is called when the model touches files. For each conditional skill, the touched paths are matched against the skill's glob list via the `ignore` library (`he7`). Match → skill is promoted to active. Activation is **sticky** for the session (added to `activatedConditionalSkillNames`).
- **Glob syntax**: gitignore-style — `src/**/*.tsx`, `Makefile`, `!docs/**` (negation), etc.
- **Why "ignore" library?** Same grammar as `.gitignore`, which is what most developers know. Lets `paths: [".github/**"]` work intuitively.
- **One-time activation**: once activated, a conditional skill stays active for the session even if the model touches a non-matching file later. This is a deliberate choice — re-evaluating per-turn would cause confusing oscillation in the listing.

### `hooks` — skill-lifecycle-scoped hooks

- **Parser**: `W45` at `cli_inner_pretty.js:406141-406148`. Runs `MR().safeParse(H.hooks)` (the same zod schema as `settings.json` hooks) and logs `Invalid hooks in skill '<name>': <err>` on parse failure — failure does not block skill load.
- **Consumer**: stored on the skill record as `hooks` (cli_inner_pretty.js:406255). Wired in at invocation time by the hook subsystem (`11_hooks/`) — these hooks are registered for the duration the skill is active in the conversation, then unregistered.
- **Same shape as `settings.json.hooks`**: e.g. `{ PreToolUse: [{ matcher: "Bash", hooks: [...] }] }`. Skill-scoped hooks override session-level ones for the matchers they declare.

### `context` — execution shape

- **Parser**: `HI6` at `cli_inner_pretty.js:406187`: `executionContext: H.context === "fork" ? "fork" : void 0`. Stored as `context` on the Skill record (cli_inner_pretty.js:406240).
- **Consumer (inline path)**: undefined → the rendered body is pushed as a user message into the main conversation. Default behavior.
- **Consumer (fork path)**: `"fork"` → the skill body is handed to `ql_` (forked-skill runner at `cli_inner_pretty.js:353376`) which spawns a subagent. The parent main loop sees only the subagent's `result` field.
- **Why split**: forking gives the skill its own token budget and isolated message history — good for big research/analysis tasks. The cost is that the parent doesn't see the working state.
- **Pairs with `agent`**: forked skills consult `agent: <type>` to pick the subagent configuration. If `agent` is omitted, defaults to `general-purpose`.

### `agent` — subagent type for forked skills

- **Parser**: `HI6` at `cli_inner_pretty.js:406188`: `agent: H.agent != null ? String(H.agent) : void 0`.
- **Consumer**: passed to `runAgent` when `context: fork` is active. Looks up the agent definition (Explore, Plan, general-purpose, or any custom `.claude/agents/<name>.md`).
- **Built-in agents that skip CLAUDE.md**: Explore and Plan skip CLAUDE.md and git status to keep their context small (per the docs and `02_ui` / `30_agent_team` modules).
- **No effect when `context` is `inline`**: silently ignored. The `agent` field needs `context: fork` to do anything.

### `fallback` — defer to a same-name plugin/MCP skill

- **Parser**: `WZH(H.fallback)` (boolean coercer). Stored on the skill record (cli_inner_pretty.js:406254).
- **Consumer**: `D9H` at `cli_inner_pretty.js:513829-513843` filters the merged skill list:
  ```javascript
  if (q.disableModelInvocation || VE4(q)) continue;
  let K = q.name.lastIndexOf(":");
  if (K > 0) $.add(q.name.slice(K + 1));
  ...
  return H.filter((q) => {
    if (q.type !== "prompt" || !q.fallback || !$.has(q.name)) return !0;
    return (N(`Dropping fallback skill '${q.name}' — a plugin/MCP skill with the same suffix is loaded`), !1);
  });
  ```
  So if a fallback skill named `review` exists and a plugin/MCP skill named `<x>:review` is loaded, the fallback gets dropped and a log line is emitted.
- **Intended use**: shipping a thin-pointer "stub" skill at the user/project tier that yields to the canonical plugin version once installed. Marked `@internal` in the schema docstring — operators should not rely on this.
- **Cleanup expectation**: per the schema's `@internal` note, stubs carrying `fallback: true` should be deleted once their canonical plugin/MCP skill ships.

### `created_by` / `improved_by` (@internal)

- **Parser**: `HI6` at `cli_inner_pretty.js:406191`: `createdBy: H.created_by === "dream-proposal" || H.improved_by === "dream-proposal" ? "dream-proposal" : void 0`. Only one value (`"dream-proposal"`) is currently recognised.
- **Consumer**: provenance marker — used by telemetry to identify skills authored by the dream-proposal agent (auto-improvement system).
- **No runtime effect** beyond logging.

### Boolean coercion (`MBH`)

The frontmatter accepts permissive boolean values. `MBH` (`parseBoolean`) coerces:

| Input | Result |
|-------|--------|
| `true`, `"true"`, `1`, `"1"`, `"yes"`, `"on"` | `true` |
| `false`, `"false"`, `0`, `"0"`, `"no"`, `"off"`, `""` | `false` |
| `null`, `undefined` | `false` (parser default) |
| anything else | typically `false` |

This is why both `disable-model-invocation: true` and `disable-model-invocation: "true"` work — YAML's flexible scalar parsing combined with the permissive coercer.

---

## The Skill tool's four gates (in order)

The Skill tool's `validateInput` at `cli_inner_pretty.js:353562-353602` runs these gates **in this exact order**. The **first** gate to fail returns its error code; subsequent gates don't run.

```javascript
// ============================================
// SkillTool validateInput - the full gate chain
// Location: cli_inner_pretty.js:353562-353602
// ============================================

// ORIGINAL (for source lookup):
// 1. Skill not found
if (!Y) return { result: !1, message: `Unknown skill: ${_}...`, errorCode: 2 };

// 2. Author-level disable
if (Y.disableModelInvocation && !Am7(_, $))
  return { result: !1, message: `Skill ${_} cannot be used with ${fX} tool due to disable-model-invocation`, errorCode: 4 };

// 3. Session allowlist (per-session, not settings-tier)
if (A !== void 0 && Q7H([Y], A).length === 0)
  return { result: !1, message: `Skill ${_} is not in this session's skills allowlist`, errorCode: 8 };

// 4. Operator-level override
let f = st(Y);
if (f === "off" || (f === "user-invocable-only" && !Am7(_, $)))
  return { result: !1, message: `Skill ${_} is disabled for model invocation in skillOverrides settings`, errorCode: 7 };

// 5. Type check (must be prompt; UI/local commands rejected)
if (Y.type !== "prompt")
  return { result: !1, message: `${_} is a ${Y.type === "local-jsx" ? "UI" : "built-in CLI"} command, not a skill...`, errorCode: 5 };

return { result: !0 };
```

### Gate effect matrix

| Skill state | Gate 2 (`disableModelInvocation`) | Gate 4 (`skillOverrides`) | Model can invoke? |
|-------------|-----------------------------------|---------------------------|-------------------|
| Default (`on`, no frontmatter override) | pass | pass | ✅ |
| **`name-only`** (operator) | pass | pass | ✅ **yes — passes all gates** |
| `user-invocable-only` (operator) | pass | block (unless user-typed) | Only if user-typed |
| `off` (operator) | pass | block (always) | ❌ |
| `disable-model-invocation: true` (author) | block (unless user-typed) | (would be `user-invocable-only` per `oT5`, but gate 2 fires first) | Only if user-typed |
| `disable-model-invocation: true` + operator `off` | block (gate 2 fires first) | (gate 4 would also block) | ❌ |

**`Am7`** / `isUserTypedSlashCommandInTurn` (cli_inner_pretty.js:353362) is the shared "user typed `/<name>` this turn" detector — both gate 2 (author `disable-model-invocation`) and gate 4 (operator `user-invocable-only`) consult the same function. This means a user typing `/sensitive-skill` in the prompt lifts **both** kinds of model-invocation locks for that single turn.

---

## The `name-only` clarification (important!)

`name-only` is the most subtle state because its name suggests restriction but its runtime behavior does not block:

```javascript
// ============================================
// isSkillModelInvocationDisabled - name-only is NOT in this set
// Location: cli_inner_pretty.js:513851-513853
// ============================================

// ORIGINAL (for source lookup):
function VE4(H) {
  let $ = st(H);
  return $ === "user-invocable-only" || $ === "off";
}
```

Note `name-only` is **absent** from the disjunction. The only place `name-only` is consumed is the listing builder `rM6` at `cli_inner_pretty.js:232385-232395`:

```javascript
// ============================================
// formatSkillListing - name-only collapses description, not invocation
// Location: cli_inner_pretty.js:232385-232395
// ============================================

// ORIGINAL (for source lookup):
let z = H.map((L, P) => {
  if (st(L) === "name-only") return (A.add(P), { cmd: L, full: `- ${L.name}` });
  return { cmd: L, full: k5_(L) };  // k5_(L) = "- name: description"
});

// READABLE (for understanding):
const entries = skills.map((skill, idx) => {
  if (getSkillOverride(skill) === "name-only") {
    nameOnlySet.add(idx);
    return { cmd: skill, full: `- ${skill.name}` };   // name only, no description
  }
  return { cmd: skill, full: formatSkillFull(skill) };  // "- name: description"
});

// Mapping: rM6 -> formatSkillListing, st -> getSkillOverride,
//          k5_ -> formatSkillFull, A -> nameOnlySet
```

**Behavior summary for `name-only`:**

| Aspect | Behavior |
|--------|----------|
| Listed in skill-listing sent to model? | ✅ Yes — name appears |
| Description sent to model? | ❌ No — only `- name` line |
| Model can invoke via Skill tool? | ✅ Yes — **no user-trigger required** |
| Visible in `/<name>` autocomplete? | ✅ Yes |
| User can invoke via `/<name>`? | ✅ Yes (subject to author's `user-invocable`) |

This makes `name-only` the **"trust the model to recognize the skill by name"** option: useful when a skill name is self-explanatory but its description would waste context. The model can still proactively invoke it.

### State semantics — the corrected truth table

|              | Listed to model | Hidden from model |
|--------------|-----------------|--------------------|
| Listed in `/` | `on` (full) / `name-only` (name only) | `user-invocable-only` |
| Hidden from `/` | (impossible — no state does this without hiding from model) | `off` |

Cells:
- **`on`**: full listing to model, `/` works, model can invoke freely
- **`name-only`**: name-only listing to model, `/` works, **model can still invoke freely** (no user-trigger required)
- **`user-invocable-only`**: hidden from model listing, `/` works, model can only invoke if user typed `/<name>` this turn
- **`off`**: hidden from model listing, hidden from `/`, model cannot invoke at all

---

## Author × Operator precedence — how they compose

The `/skills` dialog displays an effective view that already composes author and operator decisions:

```
Author frontmatter         Operator skillOverrides           Effective state
─────────────────          ─────────────────────             ───────────────
disable-model-invocation:  (none, or anything)         ─►    "user-invocable-only"
  true                                                       (locked by author,
                                                             shown as 🔒)

(default)                  policySettings sets "off"   ─►    "off"
                                                             (locked by policy)

(default)                  flagSettings sets "name-only" ─►  "name-only"
                                                             (locked by flag)

(default)                  user/project sets "off"     ─►    "off"
                                                             (editable — dialog
                                                             can override)

source === "plugin"        (any)                       ─►    "on"
                                                             (locked — manage
                                                             via /plugin)

(default)                  (default)                   ─►    "on"
```

The `oT5` resolver (`resolveSkillOverrideLock` at `cli_inner_pretty.js:476885-476893`) is what walks this precedence. When `disable-model-invocation: true` is present in the frontmatter, the dialog shows the row as `🔒 user-only · locked by author` — the operator cannot tighten it via local settings (no point — it is already restrictive) and the dialog does not let them loosen it either (`if (f.has(c)) return` at line 476984).

**Note on Gate 2 vs Gate 4:** Because Gate 2 (author) fires before Gate 4 (operator), the runtime error message for an `disable-model-invocation`-blocked skill is "...cannot be used with Skill tool due to disable-model-invocation" (errorCode 4), not "...disabled for model invocation in skillOverrides settings" (errorCode 7). Telemetry distinguishes them via the error code so the team can tell whether a skill block came from the author or from an operator policy.

---

## `user-invocable: false` — the opposite-axis lock

The other author-level visibility field, `user-invocable: false`, is the mirror of `disable-model-invocation`:

```javascript
// ============================================
// Slash command dispatcher - userInvocable: false rejection
// Location: cli_inner_pretty.js:353001-353015
// ============================================

// ORIGINAL (for source lookup):
if (O.type === "prompt" && O.userInvocable !== !1) J68(O.name);
if (O.userInvocable === !1)
  return (
    uH(M, "cmd_not_user_invocable"),
    {
      messages: [
        w8({ content: ZQ({ inputString: `/${H}`, precedingInputBlocks: _ }) }),
        w8({
          content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${H}" skill for you.`,
        }),
      ],
      shouldQuery: !1,
      command: O,
    }
  );

// READABLE (for understanding):
if (slashCommand.userInvocable === false) {
  recordFailure(commandType, "cmd_not_user_invocable");
  return {
    messages: [
      makeUserMessage({ content: rebuildOriginalInputBlock({ inputString: `/${name}` }) }),
      makeUserMessage({
        content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${name}" skill for you.`,
      }),
    ],
    shouldQuery: false,
    command: slashCommand,
  };
}
```

When a user types `/<name>` for a `user-invocable: false` skill, the dispatcher does **not** run the skill — it inserts a self-message reminding the user to ask Claude to invoke it. The `shouldQuery: false` flag means the message goes into history but does not trigger an LLM round-trip.

`user-invocable: false` also affects autocomplete via the slash-command listing filter at `cli_inner_pretty.js:536513` (`commands.filter((A) => A.userInvocable !== !1)`).

**`user-invocable: false` has no operator-level analogue.** `skillOverrides` cannot hide a skill from `/` without also hiding it from the model. The two visibility axes (`disable-model-invocation` for hiding from model; `user-invocable: false` for hiding from user) are author-only, and `skillOverrides` mostly mirrors the first axis at the operator tier.

---

## `context: inline` vs `context: fork` — execution shape

The `context` field is not a visibility field — it controls **where the skill body runs**:

| `context` | Execution shape |
|-----------|-----------------|
| `inline` (default) | The skill body (with `${CLAUDE_SKILL_DIR}`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}` substituted and `!command` fences expanded) is pushed as a **user message** into the main conversation. The model continues as if the user typed the expanded text. |
| `fork` | A **subagent** is spawned via `runAgent`. The subagent has its own token budget, message history, and (optionally) its own `agent` type. The parent main loop only sees the subagent's final `result`. |

When `context: fork`, the `agent` field optionally specifies which agent type to spawn. The forked-skill runner is `ql_` at `cli_inner_pretty.js:353376`.

This is orthogonal to `skillOverrides` — both inline and forked skills go through the same gate chain.

---

## Cross-references

- [skill_substitutions.md](./skill_substitutions.md) — the **5-pass substitution pipeline** that renders the body at invocation time: arg substitution, `${CLAUDE_*}` variables, the `!`-fence executor `gHH`, the disable-shell rewriter `_M8`.
- [skill_lifecycle.md](./skill_lifecycle.md) — discovery (6 sources), conditional-paths activation, chokidar watcher, render-once injection, compaction carry-forward.
- [skill_listing_budget.md](./skill_listing_budget.md) — how `description` + `when_to_use` fields are budgeted across the skill listing sent to the model (`l88` / `rM6`, 1% context default, 1536-char per-skill cap).
- [skill_overrides.md](./skill_overrides.md) — the operator-tier `skillOverrides` setting, its four states, the lock-precedence resolver `oT5`, the runtime resolver `st`/`VE4`/`iP8`.
- [skills_dialog_ui.md](./skills_dialog_ui.md) — the `/skills` interactive editor: keystroke map, save algorithm, persistence path.
- [filter_search.md](./filter_search.md) — the type-to-filter search box in `/skills`.
- [claude_effort_var.md](./claude_effort_var.md) — the `${CLAUDE_EFFORT}` placeholder runtime semantics.
- [skill_wildcard.md](./skill_wildcard.md) — the `Skill(name *)` permission rule (operator can also gate which skills the model is *allowed* to invoke, separately from `skillOverrides`).
- [regex_safe_args.md](./regex_safe_args.md) — the v2.1.139 fix that made `arguments: ["foo.bar"]` work correctly.
- [root_skill_md.md](./root_skill_md.md) — the v2.1.142 plugin-root SKILL.md path (the only place `name:` changes the command name).
- v2.1.112's `model_invokable_builtins.md` — the v2.1.110 mid-message bypass mechanism that Gate 2 and Gate 4 share via `Am7`.
- `runAgent` / `ql_` — the forked-skill runner (referenced by `context: fork`).
