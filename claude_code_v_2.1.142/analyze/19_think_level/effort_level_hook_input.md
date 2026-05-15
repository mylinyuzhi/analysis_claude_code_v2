# `effort.level` in Hook Input JSON (v2.1.133)

## What changed

Prior to v2.1.133 the JSON payload delivered to hooks via stdin contained
fields like `session_id`, `transcript_path`, `cwd`, `permission_mode`,
`agent_id`, `agent_type`, `tool_name`, `tool_input`, etc. The active
**effort level** was nowhere on it.

v2.1.133 adds an `effort` object with a single field, `level`, whose
value is the **resolved** effort level — *after* any silent
`xhigh→high` or `max→high` downgrade. The same shape is shared with
`StatusLineCommandInput.effort` (see
[status_line_effort_thinking.md](./status_line_effort_thinking.md)).

This is a pure plumbing change — the resolver and the request-side
behavior are unchanged. The new field lets:

- Permission policy hooks (`PreToolUse`, `PermissionRequest`) make
  effort-aware decisions: "only allow this destructive command at
  `effort: low`, never at `effort: max`".
- Audit hooks (`Stop`, `SubagentStop`) record the actual reasoning
  budget that was applied to each turn.
- Pre/PostCompact hooks correlate compaction frequency with effort
  level for telemetry.

## Source: schema (Zod)

```javascript
// ============================================
// HookInputBase.effort - Zod schema fragment, applies to all per-turn hooks
// Location: cli_inner_pretty.js:237705-237716
// ============================================

// ORIGINAL (for source lookup):
zM = yH(() =>
  y.object({
    session_id: y.string(),
    transcript_path: y.string(),
    cwd: y.string(),
    permission_mode: y.string().optional(),
    agent_id: y.string().optional().describe("Subagent identifier…"),
    agent_type: y.string().optional().describe("Agent type name…"),
    effort: y
      .object({
        level: y
          .string()
          .describe(
            'Active effort level for the current turn (e.g., "low", "medium", "high", "xhigh", "max"), after any silent downgrade for the selected model. Also exposed to hook commands and Bash as the CLAUDE_EFFORT env var.',
          ),
      })
      .optional()
      .describe(
        "Reasoning effort applied to the current turn. Same shape as StatusLineCommandInput.effort. Present for hooks that fire within a tool-use context (PreToolUse, PostToolUse, Stop, SubagentStop, etc.) on a model that supports the effort parameter; absent for session-lifecycle hooks and models without effort support.",
      ),
  }),
);

// READABLE (for understanding):
const HookInputBaseSchema = z.object({
  session_id: z.string(),
  transcript_path: z.string(),
  cwd: z.string(),
  permission_mode: z.string().optional(),
  agent_id: z.string().optional(),       // subagent only
  agent_type: z.string().optional(),     // present on --agent main thread too

  effort: z
    .object({
      level: z.string().describe(
        // Documented values: low | medium | high | xhigh | max
        // The value reflects what was ACTUALLY sent to the API for this turn,
        // not the user's typed preference. If a user set xhigh on Sonnet 4.6,
        // the resolver downgrades to high before the API call; the hook sees
        // "high" — the truth on the wire.
        'Active effort level after silent downgrade',
      ),
    })
    .optional()  // Absent for SessionStart/Setup/SubagentStart and models
                 // where modelSupportsEffort() returns false (e.g. Haiku).
});

// Mapping: zM→HookInputBaseSchema, yH→makeLazyZodSchema, y→z
```

### Which hook events get `effort.level`

The schema is composed via `zM().and(<event-specific-fields>)`. Each
per-turn hook event composes this base:

```javascript
// cli_inner_pretty.js around 237719-237800 — examples
const PreToolUse  = zM().and(z.object({ hook_event_name: z.literal("PreToolUse"), tool_name, tool_input, tool_use_id }));
const PostToolUse = zM().and(z.object({ hook_event_name: z.literal("PostToolUse"), tool_name, tool_input, tool_response, tool_use_id, duration_ms }));
const PermissionRequest = zM().and(z.object({ hook_event_name: z.literal("PermissionRequest"), tool_name, tool_input, permission_suggestions }));
// …Stop, SubagentStop, PostToolUseFailure, PostToolBatch all inherit zM()
```

Events that DO inherit `effort.level` when present:
`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`,
`PermissionRequest`, `PermissionDenied`, `Notification`,
`UserPromptSubmit`, `UserPromptExpansion`, `Stop`, `StopFailure`,
`SubagentStop`, `PreCompact`, `PostCompact`, `TeammateIdle`,
`TaskCreated`, `TaskCompleted`, `Elicitation`, `ElicitationResult`.

Events that do NOT (per the schema's `.optional()` + "absent for
session-lifecycle hooks" description):
`SessionStart`, `Setup`, `SubagentStart`, `SessionEnd`, `ConfigChange`,
`WorktreeCreate`, `WorktreeRemove`, `InstructionsLoaded`, `CwdChanged`,
`FileChanged`.

## Source: input assembly (where `effort` is populated)

The schema declares the shape; the hook dispatcher inlines the
resolved `effort` in the payload right before invoking the hook
command. Look for the hook-input builder where it pulls the active
effort from session state:

```javascript
// READABLE — synthesized from hook input builders + the resolver
function buildHookInput(eventName, sessionContext, eventSpecificFields) {
  const base = {
    session_id:     sessionContext.sessionId,
    transcript_path: sessionContext.transcriptPath,
    cwd:            sessionContext.cwd,
    permission_mode: sessionContext.permissionMode,
    agent_id:       sessionContext.agentId,
    agent_type:     sessionContext.agentType,
  };

  // effort: only included when:
  // 1. the model supports effort (CP / modelSupportsEffort)
  // 2. AND the hook event is per-turn (not lifecycle)
  if (isPerTurnHook(eventName) && modelSupportsEffort(sessionContext.mainLoopModel)) {
    const resolved = resolveEffortForApi(sessionContext.mainLoopModel, sessionContext.effortValue);
    base.effort = { level: resolved };
  }

  return { ...base, hook_event_name: eventName, ...eventSpecificFields };
}
```

The `resolveEffortForApi` (`aT`) call is the same function used to
build `output_config.effort` and `CLAUDE_EFFORT`, so the hook sees the
same value the API sees.

## Why this approach

### Why expose `effort.level` to hooks at all?

**What:** Surfacing the resolved effort to hook scripts lets policy
hooks make capability-aware decisions.

**How it works:**

The effort level is a proxy for "how much agent autonomy is currently
authorized." High-effort runs are intentional — the user is asking the
model to reason deeply, often about destructive operations
(refactoring, data migration, infra changes). Low-effort runs are
quick interactive tweaks. A site policy might:

```bash
# PreToolUse hook for Bash
#!/bin/bash
input=$(cat)
effort=$(echo "$input" | jq -r '.effort.level // "unknown"')
command=$(echo "$input" | jq -r '.tool_input.command')
if [[ "$command" =~ ^(rm -rf|drop table) && "$effort" == "low" ]]; then
  echo '{"decision": "block", "reason": "Destructive ops require effort >= medium"}'
  exit 0
fi
```

This kind of policy is impossible without effort surfaced to the
hook.

**Why a nested `effort.level` rather than a top-level `effort_level` string?**

- Reserves room for future fields: `effort.budget_tokens`,
  `effort.downgraded_from`, `effort.is_default`, etc. — extending an
  object is non-breaking; extending a top-level string requires adding
  new sibling fields and risks naming conflicts.
- Matches the API request shape (`output_config.effort` is similarly
  an object).
- Matches the parallel `StatusLineCommandInput.effort` shape — one
  documentation effort for both surfaces.

### Why "after silent downgrade" rather than the raw user-typed value?

**What:** If user types `/effort xhigh` on Sonnet 4.6 (which doesn't
support xhigh), `effort.level` is `"high"` in the hook input — NOT
`"xhigh"`.

**Why:**

The downgrade is the truth on the wire. A hook deciding policy on the
user's *intent* would be wrong: a permission rule "allow at effort >=
medium" would falsely *deny* on a Sonnet 4.6 user who typed
`/effort xhigh` (the user intended a higher reasoning level than
medium, but the API got `high`, which is the level the hook should
see). Showing the resolved value gives the hook a consistent picture
of the actual API behavior.

The trade-off is that hooks lose visibility into the original *intent*
when downgrade happens. The team's design choice: this is acceptable
because (a) the downgrade is silent by design (you're not supposed to
notice), and (b) hooks that need intent can inspect
`process.env.CLAUDE_CODE_EFFORT_LEVEL` directly — the raw env override
is preserved.

### Why is `effort.level` a string, not a discriminated union or enum?

**What:** The Zod schema declares `level: y.string()`, not
`y.enum(["low","medium","high","xhigh","max"])`.

**Why:**

- Forward compatibility: a future model might add a new tier
  (`x-low`?, `extreme`?). A string field accepts it; an enum would
  reject it as a Zod validation error.
- Hook scripts that don't care about specific levels (audit/telemetry
  hooks) just emit `effort=$(...)` without exhaustively listing
  values.
- The *meaningful* validation (`isValidEffortLevel`/`H0H` in
  cli_inner_pretty.js:198848-198850) lives on the resolver side, not
  the hook input side — by the time the hook sees it, it's already
  been normalized.

### Why optional rather than always present?

**What:** `effort: y.object({...}).optional()` — the field can be
absent.

**When it's absent:**
- Session-lifecycle events (`SessionStart`, `Setup`, etc.) — at those
  points, "active effort for the current turn" is meaningless because
  no turn is in progress.
- Models where `modelSupportsEffort()` returns false (Haiku, Claude 3
  generation, Sonnet 4.0/4.5, Opus 4.0/4.1/4.5).
- Subagent-start hooks before the subagent has run any tool.

**Why optional rather than null:**

- Absence is the conventional Zod way to signal "this field doesn't
  apply" — JSON null would imply "applies, but cleared," which is
  semantically wrong.
- Hook scripts can use `// effort: {level}` or `// no effort field`
  patterns naturally with `if "effort" in input:`.

## Hook event delivery — concrete shape

For a `PreToolUse` hook on a Bash call at xhigh effort (downgraded to
high on Sonnet 4.6):

```json
{
  "session_id":   "sesn_01H…",
  "transcript_path": "/Users/alice/.claude/projects/-Users-alice-app/sesn_01H….jsonl",
  "cwd":          "/Users/alice/app",
  "permission_mode": "default",
  "agent_id":     null,
  "agent_type":   null,
  "effort":       { "level": "high" },
  "hook_event_name": "PreToolUse",
  "tool_name":    "Bash",
  "tool_input":   { "command": "ls -la", "description": "list files" },
  "tool_use_id":  "toolu_01…"
}
```

For a `SessionStart` hook (no `effort` field):

```json
{
  "session_id":   "sesn_01H…",
  "transcript_path": "/Users/alice/.claude/projects/-Users-alice-app/sesn_01H….jsonl",
  "cwd":          "/Users/alice/app",
  "permission_mode": "default",
  "hook_event_name": "SessionStart"
}
```

## Cross-validation: v2.1.112 → v2.1.142

| Aspect | v2.1.112 | v2.1.142 | Δ |
|--------|----------|----------|---|
| Hook input has `effort` field | No | Yes (optional, nested) | New |
| Hook input has `effort.level` | No | Yes, string, post-downgrade | New |
| Schema location | (no field) | `zM`/`HookInputBaseSchema` | New |
| Lifecycle events get it | n/a | No (intentional) | n/a |
| Per-turn events get it | n/a | Yes when `modelSupportsEffort` true | n/a |
| Hook can read original env override | Yes (process.env) | Yes (unchanged) | Unchanged |
| `CLAUDE_EFFORT` env var on hook process | No | Yes (paired feature) | New (see [claude_effort_env_var.md](./claude_effort_env_var.md)) |

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Hooks / Effort
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/types in this document:
- `HookInputBaseSchema` (`zM`) — base hook input shape with `effort` field; cli_inner_pretty.js:237687-237717
- `resolveEffortForApi` (`aT`) — resolved value used for both API and hook input; cli_inner_pretty.js:198908-198911
- `modelSupportsEffort` (`CP`) — gate; cli_inner_pretty.js:198795-198811
- `setHookEnvFromInput.CLAUDE_EFFORT` (inline) — populates env var from same input; cli_inner_pretty.js:520867-520869
