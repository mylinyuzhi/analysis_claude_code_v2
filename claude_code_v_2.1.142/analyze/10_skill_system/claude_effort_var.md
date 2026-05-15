# `${CLAUDE_EFFORT}` Placeholder in Skill Content (v2.1.120)

## What it does

A skill author can now embed `${CLAUDE_EFFORT}` in the markdown body. At dispatch time, the host substitutes the current effort level (`low`/`medium`/`high`/`xhigh`/`max`) - **after** any silent downgrade for the selected model. This complements the existing `${CLAUDE_SKILL_DIR}` and `${CLAUDE_SESSION_ID}` placeholders.

The same value is exposed to hooks (via the `effort.level` JSON input field) and Bash tool commands (via the `CLAUDE_EFFORT` environment variable), so a `!command` shell fence inside a skill body can also read `$CLAUDE_EFFORT` from its environment without needing the placeholder.

---

## How it works

### 1. The placeholder substitution

Inside `$I6.getPromptForCommand` (the per-invocation expansion entry point at `cli_inner_pretty.js:406257`), the substitution happens right after `${CLAUDE_SESSION_ID}`:

```javascript
// ============================================
// formatCommand.getPromptForCommand - ${CLAUDE_EFFORT} substitution
// Location: cli_inner_pretty.js:406257-406269 (focus 406269)
// ============================================

// ORIGINAL (for source lookup):
async getPromptForCommand(h, C) {
  let R = J ? `Base directory for this skill: ${J}\n\n${_}` : _;
  if (((R = uFH(R, h, !0, Y, rH8)), J)) {
    let B = J;
    R = R.replaceAll("${CLAUDE_SKILL_DIR}", B);
  }
  if (
    ((R = R.replace(/\$\{CLAUDE_SESSION_ID\}/g, v$())),
    (R = R.replaceAll("${CLAUDE_EFFORT}", aT(M ?? C.options.mainLoopModel, G ?? C.getEffortValue()))),     // line 406269
    L45(X, j) && KM8())
  )
    R = _M8(R);
  // ...
  return [{ type: "text", text: R }];
}

// READABLE (for understanding):
async getPromptForCommand(rawArgs, toolUseContext) {
  let body = baseDir ? `Base directory for this skill: ${baseDir}\n\n${markdownContent}` : markdownContent;
  body = substituteArgsInPrompt(body, rawArgs, /*appendIfNoPlaceholder*/ true, argumentNames, escapeShellBang);
  if (baseDir) body = body.replaceAll("${CLAUDE_SKILL_DIR}", baseDir);
  body = body.replace(/\$\{CLAUDE_SESSION_ID\}/g, currentSessionId());
  body = body.replaceAll(
    "${CLAUDE_EFFORT}",
    effortLevelFor(
      skillModelOverride ?? toolUseContext.options.mainLoopModel,
      skillEffortOverride ?? toolUseContext.getEffortValue(),
    ),
  );
  // ...continue with the v2.1.91 shell-fence-disable check + shell expansion path...
  return [{ type: "text", text: body }];
}

// Mapping:
//   aT  -> effortLevelFor,             v$  -> currentSessionId,
//   M   -> skillModelOverride,         G   -> skillEffortOverride,
//   C   -> toolUseContext,             h   -> rawArgs,
//   R   -> body,                       J   -> baseDir,
//   _   -> markdownContent,            Y   -> argumentNames
```

### 2. Why model + effort, not just effort?

The substituted value comes from `aT(model, effort)`. The function takes both arguments because **effort levels are silently downgraded per model**:

- Opus 4.7 supports the full ladder.
- Sonnet 4.6 caps at `high`.
- Haiku 4.5 caps at `medium`.
- Models without effort support return `none`.

`aT` looks up the model's effort ceiling and clamps the requested effort to it. The substituted value reflects what the model **actually** runs at, not what the user requested. A skill body that branches on `${CLAUDE_EFFORT}` therefore sees a value that matches the model's behavior.

### 3. Hooks and Bash see the same value

Two parallel call sites at `cli_inner_pretty.js:399003` and `cli_inner_pretty.js:419635` apply the same substitution to other surfaces:

```javascript
// ============================================
// hookInputExpansion - ${CLAUDE_EFFORT} in hook commands
// Location: cli_inner_pretty.js:399003 (similar at 406269, 419635)
// ============================================

// ORIGINAL (for source lookup):
(g = g.replaceAll("${CLAUDE_EFFORT}", aT(E ?? F.options.mainLoopModel, h ?? F.getEffortValue())))

// READABLE (for understanding):
hookCommand = hookCommand.replaceAll(
  "${CLAUDE_EFFORT}",
  effortLevelFor(
    skillModelOverride ?? toolUseContext.options.mainLoopModel,
    skillEffortOverride ?? toolUseContext.getEffortValue(),
  ),
);

// Mapping: aT -> effortLevelFor, E -> skillModelOverride, h -> skillEffortOverride,
//          F -> toolUseContext, g -> hookCommand
```

```javascript
// ============================================
// bashSubprocessEnv - CLAUDE_EFFORT env var injection
// Location: cli_inner_pretty.js:419635
// ============================================

// ORIGINAL (for source lookup):
? { CLAUDE_EFFORT: aT($.options.mainLoopModel, $.getEffortValue()) }

// READABLE (for understanding):
{ CLAUDE_EFFORT: effortLevelFor(toolUseContext.options.mainLoopModel, toolUseContext.getEffortValue()) }
```

The third site at `cli_inner_pretty.js:520868` accepts a `CLAUDE_EFFORT` override from caller-supplied env vars:

```javascript
// ============================================
// claudeEffortOverride - Honour an explicit CLAUDE_EFFORT env value
// Location: cli_inner_pretty.js:520868
// ============================================

// ORIGINAL (for source lookup):
if (typeof YH === "string") R.CLAUDE_EFFORT = YH;

// READABLE (for understanding):
if (typeof envCaller === "string") subprocessEnv.CLAUDE_EFFORT = envCaller;
```

This is the path that lets a hook command pass its own `CLAUDE_EFFORT` down to a nested process, rather than always re-deriving it from `getEffortValue()`.

### 4. The effort source-of-truth

`getEffortValue()` lives on the `toolUseContext` and reads the session effort state. The state can be set by:

- The `/effort` slash command
- The `CLAUDE_CODE_EFFORT_LEVEL` env var
- The skill's own `effort:` frontmatter (overrides for the duration of that skill invocation - that's the `G ?? C.getEffortValue()` priority above)
- The `--effort` CLI flag
- The `effort:` field in a model picker selection

A skill `effort: high` frontmatter therefore makes `${CLAUDE_EFFORT}` resolve to `high` regardless of the session-level setting - the skill is opting into a specific effort for its own run.

---

## Why this approach

**Why a placeholder instead of "always inject CLAUDE_EFFORT env"?** Because skills run in different execution contexts:

- Inline skill - skill body becomes a user message; there is no subprocess to inject env vars into.
- Forked skill - the forked subagent gets its own env including the placeholder substitution.
- Hook-spawned skill - the hook's spawn process can read the env var, but the skill body still needs the placeholder to surface the value to the model.

A unified placeholder ensures the same source-of-truth across all four surfaces (skill body, hook command, Bash subprocess, env caller override).

**Why does the placeholder include the silent downgrade?** Because a skill that branches on `${CLAUDE_EFFORT}` is making decisions about how much work the model will do. If the user is on Haiku and asked for `high`, the model silently runs at `medium`. A skill body that read `high` from the placeholder would over-promise. Surfacing the actual clamped value keeps the skill's logic honest.

**Why is the skill's own `effort:` frontmatter higher priority than the session effort?** Because the author who wrote `effort: high` had a specific reason - typically "this analysis needs the highest reasoning the model can do." If a user invokes the skill with the session at `low`, the placeholder still resolves to `high` because the skill is going to be **run** at `high`. The clamping happens before, not after, the substitution.

**Key insight:** The `${CLAUDE_EFFORT}` substitution is one of three placeholders that flow into a skill body, and the only one whose value depends on **runtime state** rather than session identity. `${CLAUDE_SKILL_DIR}` is fixed at skill load time, `${CLAUDE_SESSION_ID}` is fixed at session start, but `${CLAUDE_EFFORT}` can change mid-session via `/effort`. The expansion happening at dispatch time (not skill-load time) is what makes this work.

---

## Practical examples

### Branching skill body

```yaml
---
name: review
description: Review code with effort-appropriate depth
arguments: [path]
---

I will review ${path}.

${CLAUDE_EFFORT === "max" ? "" : "ARGUMENTS: skip-deep-dependencies"}

When ${CLAUDE_EFFORT} is "high" or above, also check for performance issues.
```

The substitution is purely textual - there is no expression evaluation. The skill author still has to wire the branching logic into the markdown they write; what `${CLAUDE_EFFORT}` provides is the **substring** the model sees.

### Hook reading the value

```bash
# .claude/hooks/preview-effort.sh
echo "Effort: $CLAUDE_EFFORT"   # Also available as ${CLAUDE_EFFORT} in the command field
```

### Skill with effort override

```yaml
---
name: deep-review
effort: max          # Always runs at max effort
---

This review uses ${CLAUDE_EFFORT} effort.
```

The body will always read `This review uses max effort.` regardless of what the user's session effort is.

---

## Cross-references

- The effort ladder and silent downgrade logic - `25_model_selection` (where `aT` lives)
- Hooks effort exposure (`effort.level` JSON input, `$CLAUDE_EFFORT` env var) - `27_hooks_subsystem`
- `/effort` slash command - `28_cli_commands`
- The `effort:` frontmatter field - `10_skill_system/README.md` (under "Frontmatter parsing")
