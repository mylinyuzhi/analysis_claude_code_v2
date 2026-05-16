# `effort.level` JSON Input + `$CLAUDE_EFFORT` Env Var (v2.1.133)

## Overview

v2.1.133 propagates the active "effort level" (one of `low`, `medium`, `high`, `xhigh`, `max`) to hooks in two channels:

1. **JSON input field:** Every hook event envelope now includes `effort: { level: "<value>" }` when the current model supports effort and an effort value is set.
2. **Environment variable:** Command-type hooks see `CLAUDE_EFFORT=<value>` in their process env. Bash tool commands also see this variable.

The changelog phrasing:

> hooks receive active effort via `effort.level` JSON input + `$CLAUDE_EFFORT` env var; Bash tool commands also see `$CLAUDE_EFFORT`

This lets hooks and tools observe effort-level changes (e.g., to skip slow validations on `low` or run heavier checks on `max`).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Model selection (effort lives near model)
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `createBaseHookInput` (`M_`) — Builds the hook envelope; injects `effort` when model supports it
- `bashCommandHook` (`vW8`) — Parses `effort.level` from JSON input to populate `CLAUDE_EFFORT` env
- `modelSupportsEffort` (`CP`) — Predicate: does this model accept effort levels
- `resolveEffortValue` (`aT`) — Returns the level string after any silent downgrade

## Envelope Builder (JSON Input)

```javascript
// ============================================
// createBaseHookInput - Envelope builder now embeds effort metadata
// Location: cli_inner_pretty.js:520506-520520
// ============================================

// ORIGINAL (for source lookup):
function M_(H, $, q) {
  let K = $ ?? v$(),
    _ = q?.agentType ?? Kh(),
    A = q?.options?.mainLoopModel,
    z = A && q?.getEffortValue && CP(A) ? { level: aT(A, q.getEffortValue()) } : void 0;
  return {
    session_id: K,
    transcript_path: UV(K),
    cwd: I$(),
    permission_mode: H,
    agent_id: q?.agentId,
    agent_type: _,
    effort: z,
  };
}

// READABLE (for understanding):
function createBaseHookInput(permissionMode, sessionIdOverride, toolUseContext) {
  const sessionId = sessionIdOverride ?? getSessionId();
  const agentType = toolUseContext?.agentType ?? getMainThreadAgentType();
  const currentModel = toolUseContext?.options?.mainLoopModel;

  // NEW v2.1.133: include effort metadata if the model supports effort levels
  const effortMetadata =
    currentModel && toolUseContext?.getEffortValue && modelSupportsEffort(currentModel)
      ? { level: resolveEffortValue(currentModel, toolUseContext.getEffortValue()) }
      : undefined;

  return {
    session_id: sessionId,
    transcript_path: getTranscriptPath(sessionId),
    cwd: getCwd(),
    permission_mode: permissionMode,
    agent_id: toolUseContext?.agentId,
    agent_type: agentType,
    // ↓ undefined-valued field gets serialized as missing by JSON.stringify, so absent for non-effort models
    effort: effortMetadata,
  };
}

// Mapping:
//   M_→createBaseHookInput, H→permissionMode, $→sessionIdOverride, q→toolUseContext,
//   K→sessionId, _→agentType, A→currentModel, z→effortMetadata,
//   v$→getSessionId, Kh→getMainThreadAgentType, UV→getTranscriptPath, I$→getCwd,
//   CP→modelSupportsEffort, aT→resolveEffortValue
```

The schema docstring (cli_inner_pretty.js:237710) calls this out:

> 'Active effort level for the current turn (e.g., "low", "medium", "high", "xhigh", "max"), after any silent downgrade for the selected model. Also exposed to hook commands and Bash as the CLAUDE_EFFORT env var.'

Note the **"after any silent downgrade"** language. Some model+effort combinations aren't actually supported (e.g. Haiku doesn't honor `max`). `resolveEffortValue` returns the effective level — so a hook seeing `effort.level: "high"` on a Haiku run knows the user *asked* for `max` but the system silently floored it to `high`. The hook can act on the model's true behavior, not the user's request.

## Env Var Injection (Command Hooks)

```javascript
// ============================================
// bashCommandHook - CLAUDE_EFFORT env injection from JSON input
// Location: cli_inner_pretty.js:520866-520869
// ============================================

// ORIGINAL (for source lookup):
try {
  let YH = JSON.parse(K).effort?.level;
  if (typeof YH === "string") R.CLAUDE_EFFORT = YH;
} catch {}

// READABLE (for understanding):
try {
  const effortFromInput = JSON.parse(jsonInput).effort?.level;
  if (typeof effortFromInput === "string") {
    envVars.CLAUDE_EFFORT = effortFromInput;
  }
} catch {
  // jsonInput came from the executor — if JSON.parse fails, something is very wrong upstream,
  // but a hook-side missing env var is recoverable, so silently swallow.
}

// Mapping: K→jsonInput, R→envVars, YH→effortFromInput
```

The env var is sourced from the parsed JSON input — **not** from a direct `getEffortValue()` call. This means the JSON envelope is the **canonical source**; if `createBaseHookInput` decided to omit `effort` (e.g., model doesn't support it), the env var is also absent. Single source of truth.

## Bash Tool Integration

The same env var is injected when the Bash tool spawns commands. Looking at the Bash tool execution:

```javascript
// ============================================
// bashToolEnvWithEffort - Bash tool injects CLAUDE_EFFORT in command env
// Location: cli_inner_pretty.js:419632-419636
// ============================================

// ORIGINAL (for source lookup):
              ? { CLAUDE_EFFORT: aT($.options.mainLoopModel, $.getEffortValue()) }

// READABLE (for understanding):
const effortEnv = $.options.mainLoopModel && supportsEffort($.options.mainLoopModel)
  ? { CLAUDE_EFFORT: resolveEffortValue($.options.mainLoopModel, $.getEffortValue()) }
  : {};
```

And in the slash-command / shell-substitution path (`cli_inner_pretty.js:399003`, 406269) the same template substitution applies to commands containing `${CLAUDE_EFFORT}`:

```javascript
g = g.replaceAll("${CLAUDE_EFFORT}", aT(E ?? F.options.mainLoopModel, h ?? F.getEffortValue()));
```

So both Bash commands and template-substituted commands see the effort level.

## Key Decisions/Algorithms

### Effort gating by model support

**What it does:** Only models that **actually accept** effort levels expose `effort` in the JSON envelope. For others, the field is `undefined` and gets serialized as missing.

**How it works:**
```javascript
const z = A && q?.getEffortValue && CP(A)
  ? { level: aT(A, q.getEffortValue()) }
  : void 0;
```
Three checks:
1. `A` (currentModel) is set
2. `q?.getEffortValue` is callable (context is rich enough)
3. `CP(A)` (modelSupportsEffort) returns true

If any check fails, `z` is `undefined`, the result object has `effort: undefined`, and `JSON.stringify` omits the key.

**Why this approach:**
- Hooks should be able to distinguish "user didn't set effort" from "model doesn't support effort." But the JSON-level fix-up is "make missing == not applicable" — simpler than two states. A hook checking `if (input.effort)` doesn't have to special-case model class.
- The triple-guard is defensive — `mainLoopModel` could be unset during initialization, `toolUseContext` could be a non-tool event (like SessionStart), and `modelSupportsEffort` is the authoritative source.

**Key insight:** Missing is the same as not-applicable. Hooks don't need to know **which** models support effort — they just need to react to the level when it's there.

### Silent downgrade is observable

**What it does:** The `aT(model, value)` call returns the **effective** level after model-specific downgrades. If the user set `max` but the model only supports up to `high`, the hook sees `high`.

**How it works:** `resolveEffortValue` is the same function used by the main loop to pick the actual effort sent to the LLM. By calling the same function inside the hook envelope, the JSON sees what the model actually receives.

**Why this approach:**
- Without this, hooks would have to re-implement the downgrade matrix themselves to know "is the model actually thinking at this level?"
- A hook that runs slow validations only on `max` would otherwise spuriously trigger on `max` requests against models that floor it to `high`.

**Key insight:** The hook sees **the truth, not the request**. This is consistent with other hook fields (e.g., `permission_mode` shows the resolved mode, not what the user typed).

### Env var sourced from JSON, not from context

**What it does:** `R.CLAUDE_EFFORT = JSON.parse(K).effort?.level` reads back the JSON envelope to populate the env var, instead of calling `q.getEffortValue()` directly.

**Why this approach:**
- The JSON envelope is already authoritative (handles model-support gating). Re-reading from JSON means both channels (env, JSON) always agree.
- If a future change adds a `effort.downgraded_from` field or similar, the env var gets it for free since it's reading from the same source.

**Key insight:** Avoid two independent computations. The runtime computes effort once (in `M_`), and the env-var path consumes that as input. Subtle: this also means a malformed JSON input would skip env injection — but if JSON parsing fails at this point, the hook is going to misbehave anyway, so the silent catch is appropriate.

## Diff vs v2.1.112

In v2.1.112's `J9` (the v2.1.112 counterpart to `M_`), the return object had no `effort` field. The schema documentation made no mention of `effort.level`. Command hooks set `CLAUDE_PROJECT_DIR` but not `CLAUDE_EFFORT`. Bash-tool execution didn't propagate effort.

The v2.1.133 patch adds:
1. `createBaseHookInput` — compute `effortMetadata` and include in return.
2. `bashCommandHook` — try/catch JSON.parse + env injection.
3. Slash-command / Bash tool path — `${CLAUDE_EFFORT}` template substitution and `CLAUDE_EFFORT` env in the spawn options.
4. Schema docs — top-level "effort" field with description on the input-schema definition.

All three channels (JSON, env, template) read from the same `resolveEffortValue(model, level)` source.

## Related Reading

- Effort level configuration: see [v2.1.112 analyze/](../../../claude_code_v_2.1.112/analyze/) for the effort-feature analysis in 2.1.112 baseline (effort itself existed; hook propagation is new).
- Model selection: see `00_overview/symbol_index_infra_platform.md` "Model" section for `modelSupportsEffort` and `resolveEffortValue` locations.
