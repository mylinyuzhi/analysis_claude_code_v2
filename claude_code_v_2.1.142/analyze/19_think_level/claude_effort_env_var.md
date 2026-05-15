# `$CLAUDE_EFFORT` Environment Variable (v2.1.133)

## What changed

v2.1.133 adds a new environment variable, `CLAUDE_EFFORT`, that is
populated **for every spawned subprocess** with the active effort
level for the current turn — Bash tool commands, hook scripts, slash
command bodies, and any `${CLAUDE_EFFORT}` template substitutions.

There are three companion features that all share the same resolved
value (`resolveEffortForApi(model, effortValue)`):

1. **Bash tool spawn:** `extraEnv: { CLAUDE_EFFORT: aT(model, value) }` is
   injected when the model supports effort.
2. **Hook command spawn:** the hook input JSON's `effort.level` field
   is also lifted into the hook process's env as `CLAUDE_EFFORT`.
3. **Slash command body substitution:** `${CLAUDE_EFFORT}` tokens in
   slash command shell/template bodies are replaced with the value.

The three are different *entry points* but produce the same string,
so a Bash subprocess inside a hook inside a slash command all see the
same value.

## Source: Bash tool — extraEnv injection

```javascript
// ============================================
// BashToolExtraEnv - inject CLAUDE_EFFORT when model supports effort
// Location: cli_inner_pretty.js:419634-419636
// ============================================

// ORIGINAL (for source lookup):
let F = n55({
    input: H,
    abortController: z,
    taskRegistry: $.taskRegistry,
    abortSpeculation: $.abortSpeculation,
    setToolJSX: f,
    emitToolProgress: O,
    preventCwdChanges: P,
    isMainThread: L,
    toolUseId: $.toolUseId,
    agentId: $.agentId,
    sessionEnvVars: $.sessionEnvVars,
    extraEnv: CP($.options.mainLoopModel)
      ? { CLAUDE_EFFORT: aT($.options.mainLoopModel, $.getEffortValue()) }
      : void 0,
  });

// READABLE (for understanding):
const bashRunner = startBashRunner({
  input,
  abortController,
  taskRegistry,
  abortSpeculation,
  setToolJSX,
  emitToolProgress,
  preventCwdChanges: isSubagent,
  isMainThread,
  toolUseId,
  agentId,
  sessionEnvVars,
  // Only inject CLAUDE_EFFORT when the model supports an effort param.
  // Why: Haiku and Claude 3 don't take effort; we don't want to lie to
  // shell commands about a value that didn't influence the model.
  extraEnv: modelSupportsEffort(ctx.options.mainLoopModel)
    ? { CLAUDE_EFFORT: resolveEffortForApi(ctx.options.mainLoopModel, ctx.getEffortValue()) }
    : undefined,
});

// Mapping: n55→startBashRunner, CP→modelSupportsEffort, aT→resolveEffortForApi
```

The Bash tool's spawn() merges `sessionEnvVars` (user-defined session
env), `extraEnv` (this `CLAUDE_EFFORT` injection plus anything else
the tool needs like `CLAUDE_PROJECT_DIR`), and `process.env`. So:

```
process.env  ⊕  sessionEnvVars  ⊕  extraEnv
                                  └─ { CLAUDE_EFFORT: "high" }
```

A user-set `CLAUDE_EFFORT` in `sessionEnvVars` would be **overwritten**
by the resolved value. This is intentional — the active value is the
truth.

## Source: hook command env

```javascript
// ============================================
// setHookEnvFromInput - parse effort from hook input and lift into env
// Location: cli_inner_pretty.js:520867-520869 (within hook spawn)
// ============================================

// ORIGINAL (for source lookup):
let R = { ...XI(), CLAUDE_PROJECT_DIR: W(G) },
  B = Nq8();
if (B) R.TRACEPARENT = B;
try {
  let YH = JSON.parse(K).effort?.level;
  if (typeof YH === "string") R.CLAUDE_EFFORT = YH;
} catch {}

// READABLE (for understanding):
const hookEnv = { ...baseSpawnEnv(), CLAUDE_PROJECT_DIR: pathToString(projectDir) };
const traceparent = getCurrentOtelTraceparent();
if (traceparent) hookEnv.TRACEPARENT = traceparent;

// Hooks receive the input JSON on stdin AND on the env. We parse the
// payload locally (the same string that will be written to stdin) and
// lift effort.level into CLAUDE_EFFORT for hook scripts that prefer
// env vars over jq.
try {
  const effortLevel = JSON.parse(hookInputJsonString).effort?.level;
  if (typeof effortLevel === "string") {
    hookEnv.CLAUDE_EFFORT = effortLevel;
  }
} catch {
  // hookInputJsonString shouldn't fail to parse since we just built it,
  // but defensive: if it does, simply omit CLAUDE_EFFORT.
}

// Mapping: XI→baseSpawnEnv, Nq8→getCurrentOtelTraceparent,
//          K→hookInputJsonString (already-serialized hook input)
```

Why parse the JSON locally instead of passing the resolved value
directly to the spawn? The hook input is built upstream in
`buildHookInput` (see
[effort_level_hook_input.md](./effort_level_hook_input.md)) and the
spawn function takes the *serialized* string. Re-parsing once on spawn
keeps `hookEnv.CLAUDE_EFFORT` in lock-step with the JSON payload —
they cannot disagree, even if a later refactor adds another path that
modifies the JSON between build and spawn.

## Source: slash command `${CLAUDE_EFFORT}` substitution

```javascript
// ============================================
// SlashCommandSubstitution - replace ${CLAUDE_EFFORT} in slash body
// Location: cli_inner_pretty.js:399003, :406269 (two paths: legacy/normalized)
// ============================================

// ORIGINAL (for source lookup):
(g = g.replaceAll("${CLAUDE_EFFORT}", aT(E ?? F.options.mainLoopModel, h ?? F.getEffortValue()))),

// READABLE (for understanding):
slashCommandBody = slashCommandBody.replaceAll(
  "${CLAUDE_EFFORT}",
  resolveEffortForApi(
    modelOverride ?? sessionContext.options.mainLoopModel,
    effortOverride ?? sessionContext.getEffortValue()
  )
);

// Mapping: g→slashCommandBody, aT→resolveEffortForApi,
//          E→modelOverride, F→sessionContext, h→effortOverride
```

So a custom slash command file like
`~/.claude/commands/my-deep-think.md` can contain:

```
---
description: Deep-think helper
---
# Use effort: ${CLAUDE_EFFORT}

Please analyze using a level of rigor matching ${CLAUDE_EFFORT} effort.
```

…and the substitution puts the resolved effort level into the prompt
text seen by the model. Combined with the env-var injection, slash
commands can also write `bash` blocks that read `$CLAUDE_EFFORT`.

## Why this approach

### Why `extraEnv` rather than a hard-coded `process.env` mutation?

**What:** The Bash tool's spawn uses an `extraEnv` parameter, not
`process.env.CLAUDE_EFFORT = …` before fork.

**Why:**

- `process.env` is a process-global. Two concurrent Bash invocations
  with different effort overrides (e.g. one through a subagent, one
  through the main thread) would race on `process.env.CLAUDE_EFFORT`.
- `extraEnv` is per-spawn. Each subprocess sees its own snapshot, so
  parallel calls don't interfere.
- The cleaner contract: "this env is set for this command only" makes
  cancellation and cleanup trivial — no rollback of process-global
  state required.

### Why gate on `modelSupportsEffort()` — why not always pass `CLAUDE_EFFORT`?

**What:** When the model is Haiku (or Claude 3.x), the Bash tool spawn
**doesn't** inject `CLAUDE_EFFORT`. The variable is simply absent from
the subprocess env.

**Why:**

- Haiku doesn't take an effort parameter — the model isn't reasoning
  at a different depth, so calling it "effort: high" is misleading to
  shell scripts.
- Absence is more honest than "high (because that's the default
  string)". Scripts that care can check `[[ -n "$CLAUDE_EFFORT" ]]`
  rather than `[[ "$CLAUDE_EFFORT" == "high" ]]`.
- Forward compatibility: if a future Haiku tier *does* gain effort
  support, the gate flips automatically with no env-var change.

### Why have *three* mechanisms (env, hook input JSON, slash body sub)?

**What:** Each mechanism serves a distinct surface:

- **env var** is best for shell scripts and command-line tools that
  want a single value without JSON parsing.
- **hook input JSON** is best for hooks that already parse the
  payload with `jq` or a JSON library — they get the value as part of
  the structured input.
- **slash body substitution** is best for prompt-content interpolation
  — the resolved value flows into the model context.

A unified single-mechanism design would force every consumer into the
same model:
- Forcing JSON parse on shell users is heavy (`jq` round-trip).
- Forcing env var on slash body content is wrong (the model context
  is JSON, not shell).
- Forcing template substitution on the hook process means hooks would
  have to template their input — which is doable but adds friction.

The trade-off is duplication (3 places to keep in sync). The code
mitigates this by routing **all three** through the *same*
`resolveEffortForApi` function — there's one source of truth for the
value; only the delivery channel varies.

### Why use the *resolved* (downgraded) value rather than the raw user pref?

Same rationale as the hook input field: the resolved value is what the
API received. A Bash audit script logging `CLAUDE_EFFORT` should match
what was actually sent. If the user wants the raw user intent, they
can read `process.env.CLAUDE_CODE_EFFORT_LEVEL` (the env override) or
parse settings.json.

The trade-off: a hook script can't distinguish "user typed `/effort
high`" from "user typed `/effort xhigh` on Sonnet → downgraded to
high". For the small set of cases that need this, the hook can inspect
`process.env.CLAUDE_CODE_EFFORT_LEVEL` and the session's effortValue
through other channels.

## Cross-validation: v2.1.112 → v2.1.142

| Aspect | v2.1.112 | v2.1.142 | Δ |
|--------|----------|----------|---|
| `CLAUDE_EFFORT` env var on Bash spawn | No | Yes (gated on `modelSupportsEffort`) | New |
| `CLAUDE_EFFORT` env var on hook spawn | No | Yes (parsed from input JSON) | New |
| `${CLAUDE_EFFORT}` slash command substitution | No | Yes (replaceAll) | New |
| Same value across all 3 channels | n/a | Yes (single `resolveEffortForApi`) | New invariant |
| Behavior when model doesn't support effort | n/a | Variable absent | New |

## End-to-end example: nested call

User has Opus 4.7 selected (xhigh default). They run `/effort high`,
then a slash command `/my-tool` whose body is:

```
---
description: Run my-tool with current effort hint
---
!bash
echo "Running my-tool with effort=$CLAUDE_EFFORT"
my-tool --hint=${CLAUDE_EFFORT}
```

What happens:

1. `/my-tool` body has `${CLAUDE_EFFORT}` replaced via slash body
   substitution → command body becomes
   `my-tool --hint=high`.
2. The `!bash` block is sent to the Bash tool with the rewritten
   command.
3. The Bash tool spawn injects `extraEnv: { CLAUDE_EFFORT: "high" }`.
4. Inside the spawned shell:
   - `echo "Running my-tool with effort=$CLAUDE_EFFORT"` prints
     `"Running my-tool with effort=high"` (from env).
   - `my-tool --hint=high` runs (from substitution).
5. If there's a `PreToolUse` hook configured, it receives:
   - JSON input with `effort: { level: "high" }`.
   - Process env with `CLAUDE_EFFORT=high`.

All three observations agree on `high` — the truth on the wire.

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Hooks / Effort
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `resolveEffortForApi` (`aT`) — single source of truth; cli_inner_pretty.js:198908-198911
- `modelSupportsEffort` (`CP`) — gates env injection; cli_inner_pretty.js:198795-198811
- Bash tool `extraEnv` injection — cli_inner_pretty.js:419634-419636
- Hook spawn `CLAUDE_EFFORT` parse-from-input — cli_inner_pretty.js:520867-520869
- Slash command `${CLAUDE_EFFORT}` substitution — cli_inner_pretty.js:399003, :406269
