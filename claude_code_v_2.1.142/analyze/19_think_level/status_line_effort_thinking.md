# Status Line JSON `effort.level` + `thinking.enabled` (v2.1.119)

## What changed

The custom status line script (`statusLine.command` in settings.json)
receives a JSON document on stdin every time the line refreshes. In
v2.1.119, two fields were added to that document:

- `effort.level` — the active effort level for the current turn (same
  string as in [the hook input](./effort_level_hook_input.md), after
  silent downgrade).
- `thinking.enabled` — whether the thinking feature is currently on
  (false when the user has disabled it via `disableThinking` or the
  `CLAUDE_CODE_DISABLE_THINKING` env var).

Both are documented as part of `StatusLineCommandInput`, the schema
that hook code re-uses in `HookInputBase.effort` (so a status line
script and a hook script can share JSON-parsing code).

## Source: status line payload builder

```javascript
// ============================================
// buildStatusLinePayload - assembles the JSON written to statusLine stdin
// Location: cli_inner_pretty.js:535631-535672
// ============================================

// ORIGINAL (for source lookup):
return {
  ...M_(),
  cwd: O,
  ...(W && { session_name: W }),
  model: { id: J, display_name: FJ(J) },
  workspace: { current_dir: O, project_dir: $6(), added_dirs: A, ...(Y && { git_worktree: Y }) },
  version: { … /* embedded build constants */ }.VERSION,
  output_style: { name: X },
  cost: { total_cost_usd: kW(), total_duration_ms: ehH(), total_api_duration_ms: CG(), total_lines_added: NXH(), total_lines_removed: EXH() },
  context_window: mU5(L, P),
  exceeds_200k_tokens: $,
  fast_mode: q,
  ...(CP(J) && { effort: { level: aT(J, M) } }),
  thinking: { enabled: w !== !1 },
  ...((V.five_hour || V.seven_day) && { rate_limits: V }),
  ...(X$H() && { vim: { mode: f ?? "INSERT" } }),
  ...(D && { agent: { name: D } }),
  ...(I6() && { remote: { session_id: v$() } }),
  ...(j && { worktree: { name, path, branch, original_cwd, original_branch } }),
};

// READABLE (for understanding):
function buildStatusLinePayload({
  cwd, sessionName, model, addedDirs, gitWorktree,
  outputStyleName, contextWindow, exceeds200k,
  fastMode, effortValue, thinkingEnabled,
  rateLimits, vimMode, agentName, worktree
}) {
  return {
    ...getEnvIdentity(),                     // device_id, account_uuid, hostname…
    cwd,
    ...(sessionName && { session_name: sessionName }),

    model: { id: model, display_name: getModelDisplayName(model) },
    workspace: {
      current_dir: cwd,
      project_dir: getProjectDir(),
      added_dirs: addedDirs,
      ...(gitWorktree && { git_worktree: gitWorktree }),
    },

    version: "2.1.142",
    output_style: { name: outputStyleName },

    cost: {
      total_cost_usd:        getTotalCostUsd(),
      total_duration_ms:     getTotalDurationMs(),
      total_api_duration_ms: getTotalApiDurationMs(),
      total_lines_added:     getTotalLinesAdded(),
      total_lines_removed:   getTotalLinesRemoved(),
    },

    context_window:      buildContextWindowReport(messages, lastAssistantId),
    exceeds_200k_tokens: exceeds200k,
    fast_mode:           fastMode,

    // ───── v2.1.119 additions ─────
    // `effort.level` — only when the model supports effort
    // (Haiku and Claude 3.x do not). The string is the resolved value,
    // matching what the API sees.
    ...(modelSupportsEffort(model) && {
      effort: { level: resolveEffortForApi(model, effortValue) }
    }),
    // `thinking.enabled` — true unless the user explicitly disabled.
    // The `!== false` check treats `undefined` (default) as enabled.
    thinking: { enabled: thinkingEnabled !== false },
    // ──────────────────────────────

    ...((rateLimits.five_hour || rateLimits.seven_day) && { rate_limits: rateLimits }),
    ...(isVimModeEnabled() && { vim: { mode: vimMode ?? "INSERT" } }),
    ...(agentName && { agent: { name: agentName } }),
    ...(isRemoteSession() && { remote: { session_id: getCurrentSessionId() } }),
    ...(worktree && { worktree }),
  };
}

// Mapping: M_→getEnvIdentity, mU5→buildContextWindowReport,
//          CP→modelSupportsEffort, aT→resolveEffortForApi,
//          X$H→isVimModeEnabled, I6→isRemoteSession, v$→getCurrentSessionId,
//          $6→getProjectDir, FJ→getModelDisplayName
```

The two new shape elements are wrapped in spread-conditionals so that
when they don't apply (Haiku model for `effort`; never for `thinking`,
which is always present), they're cleanly absent from the JSON.

## Source: where the payload is sent to the script

```javascript
// READABLE (for understanding) — pU5 / statusLineText subscription, cli_inner_pretty.js:535677-…
function StatusLineSubscriber({ messagesRef, lastAssistantMessageId, tokenUsage, vimMode }) {
  // The payload-builder result is JSON-serialized then written to the
  // statusLine.command child process's stdin.
  const payload = buildStatusLinePayload({
    cwd:              getCurrentCwd(),
    model:            mainLoopModel,
    addedDirs:        toolPermissionContext.additionalWorkingDirectories,
    effortValue:      effortValue,            // session state
    thinkingEnabled:  thinkingEnabled,        // session state
    fastMode:         fastMode,
    // …other fields
  });
  // The script's stdout becomes the line shown above the input box.
  pipeJsonToCommand(statusLineCommand, payload);
}
```

The payload is re-emitted on every event that updates the right side
of the status line — message added, fast mode toggled, effort changed,
permission mode changed, vim mode swap, etc. Status line scripts
should expect a stream of payloads on stdin (the framework
re-spawns the script per refresh for simplicity).

## Sample status line script

A common use case:

```python
#!/usr/bin/env python3
# ~/.config/claude/statusline.py
import json, sys

data = json.load(sys.stdin)
parts = []
parts.append(data["model"]["display_name"])
if "effort" in data:
    parts.append(f"effort={data['effort']['level']}")
if data.get("thinking", {}).get("enabled"):
    parts.append("thinking")
parts.append(f"${data['cost']['total_cost_usd']:.2f}")
print(" · ".join(parts))
```

Output: `Opus 4.7 · effort=xhigh · thinking · $0.42`

## Why this approach

### Why expose `effort.level` to the status line?

**What:** Surfacing effort lets users see the active reasoning budget
at a glance.

**Why:**

- The effort slider added in v2.1.111 lets users change effort
  frequently. Without a status indicator, it's easy to forget what
  level was last set — leading to the v2.1.111 "burns fastest" surprise
  that originally drove the slider UX.
- The status bar already had `" with high effort"` text appended to
  the model name; surfacing the same data as JSON lets users *style*
  it (color, icon, hide-when-default).
- It also makes the status line useful as an audit channel — a tmux
  status integration can write the active effort to a log.

### Why a separate `effort` object rather than top-level `effort_level`?

Same rationale as the hook input nesting:
- Forward compatibility for `effort.budget_tokens`,
  `effort.downgraded_from`, etc.
- Schema parity with `output_config.effort` (API request shape).

### Why is `thinking.enabled` always present, while `effort` is conditional?

**What:**
- `thinking: { enabled: bool }` is always present.
- `effort: { level: string }` is omitted when `modelSupportsEffort` is
  false.

**Why:**

- Thinking is a *toggle*: every session has a true/false value for it,
  even when it doesn't make a model-level difference. Always-present
  makes scripts trivial: `data["thinking"]["enabled"]`.
- Effort is a *capability-conditional value*. For Haiku users, there's
  no meaningful "current effort"; pretending there's one ("medium"?)
  would mislead. Absence is more honest.

### Why use `!== false` rather than `=== true` for `thinking.enabled`?

**What:** `thinking: { enabled: w !== !1 }`.

**Why:**

- `w` is the `thinkingEnabled` AppState field, which can be:
  - `true` — explicitly enabled by the user.
  - `false` — explicitly disabled by the user (`disableThinking`).
  - `undefined` — never touched (default).
- The user's intent for `undefined` is "use the default" — which is
  *enabled* for thinking-capable models.
- `=== true` would falsely report `false` for the default case;
  `!== false` correctly reports `true` for both the explicit-true and
  the never-set-yet cases.

### Why use the *resolved* (downgraded) effort value?

**What:** `effort.level` comes from `resolveEffortForApi(model, effortValue)`,
which applies `xhigh→high` and `max→high` downgrades.

**Why:**

- Status line should show what's *actually happening*, not what the
  user typed. A Sonnet 4.6 user who typed `/effort xhigh` is running
  at `high` — that's the truth on the wire.
- Consistent with `output_config.effort` and hook input — there's one
  resolved value visible everywhere.
- Users that *want* to see their typed preference can show
  `process.env.CLAUDE_CODE_EFFORT_LEVEL` in their custom script, but
  that's an opt-in choice — the default JSON shows truth.

## Cross-validation: v2.1.112 → v2.1.142

| Aspect | v2.1.112 | v2.1.142 | Δ |
|--------|----------|----------|---|
| `model.id` / `model.display_name` | Yes | Yes | Unchanged |
| `cost.*` (cost summary) | Yes | Yes | Unchanged |
| `effort.level` | No | Yes (when model supports effort) | New |
| `thinking.enabled` | No | Yes (always) | New |
| `vim.mode` | Yes | Yes | Unchanged |
| `worktree.*` | Yes | Yes | Unchanged |
| Schema identifier | `StatusLineCommandInput` | `StatusLineCommandInput` (shared with `HookInputBase`) | Reused |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry / Status Line
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `buildStatusLinePayload` (`mU5` and surrounding) — payload builder; cli_inner_pretty.js:535631-535672
- `resolveEffortForApi` (`aT`) — resolved effort value source; cli_inner_pretty.js:198908-198911
- `modelSupportsEffort` (`CP`) — capability gate for the conditional field; cli_inner_pretty.js:198795-198811
- `StatusLineSubscriber` (`pU5`) — re-emits payload on state changes; cli_inner_pretty.js:535677-…
- `getModelDisplayName` (`FJ`) — human label for `model.display_name`
