# Permission Mode Inheritance — v2.1.142

## TL;DR

Permission mode (`default`, `acceptEdits`, `bypassPermissions`, `auto`, `plan`, `dontAsk`) is a session-scoped knob that controls when the leader prompts the user for tool approvals. When a teammate or background subagent is spawned, the leader's mode must be communicated to the child so the child either inherits or overrides it.

Three inheritance paths exist in v2.1.142:

1. **In-process teammate** — direct inheritance via `inheritPermissionModeForTeammate` (`CD6`), which maps `plan` and `dontAsk` to `default` (those modes don't make sense for teammates) and otherwise copies the leader's mode unchanged. Plan-mode-required teammates are *forced* to `plan` regardless.
2. **Subagent dispatched via the Agent tool** — the dispatcher (`MyTask`/`uiH`) checks the spawner's `toolPermissionContext.mode` and inherits it (with the same plan/dontAsk demotion). The subagent's agent-definition can override via its `permissionMode` frontmatter field.
3. **Background subagent (`claude agents` dispatch)** — argv-level: `--permission-mode <mode>` or `--dangerously-skip-permissions` is added by the agent-view dispatcher (v2.1.142 new flag); these flags are scanned by `resolvePermissionMode` (`rgK`), which composes CLI flags + env + settings + agent frontmatter into a final mode.

Critical v2.1.141 fix: **background agents now preserve the current permission mode** instead of reverting to default on retire/wake. The `bypassPermissions` mode in particular is persisted across daemon retire and reattach, fixing `claude --bg --dangerously-skip-permissions` losing its bypass after a session bounce.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Subagent

Key functions in this document:
- `inheritPermissionModeForTeammate` (`CD6`) — leader → teammate mode mapper (cli_inner_pretty.js:240330-240334)
- `resolvePermissionMode` (`rgK`) — composes CLI/env/settings/frontmatter (cli_inner_pretty.js:198981-199046)
- `wrapResolvePermissionMode` (`zR6`) — adds CLAUDE_CODE_SUBPROCESS_ENV_SCRUB hardening (cli_inner_pretty.js:422449-422466)
- `coerceDispatchDefaults` (`gg4`) — validates `--permission-mode`/`--model`/`--effort` on `claude agents` (v2.1.142, unit 08)
- `serializeBgWorkerEnv` (`kKA`) — sets `CLAUDE_CODE_SESSION_KIND=bg`, propagates mode to bg worker env
- `applyToolPermissionContext` (referenced in `toolPermissionContext.mode`)
- Constants: `permissionMode` enum (`default`, `acceptEdits`, `bypassPermissions`, `auto`, `plan`, `dontAsk`)
- Settings: `permissions.disableBypassPermissionsMode`, `permissions.defaultMode`
- Feature gates: `tengu_disable_bypass_permissions_mode`, `tengu_auto_mode_config`

---

## The Six Modes

| Mode | Behavior | Source |
|------|----------|--------|
| `default` | Prompt user for every write/network/sandbox-relevant tool | settings/CLI default |
| `acceptEdits` | Auto-approve Edit/Write/MultiEdit; everything else still prompts | `--permission-mode acceptEdits` |
| `bypassPermissions` | Auto-approve everything; high-risk | `--dangerously-skip-permissions` |
| `auto` | Use auto-mode classifier (LLM-based decision) on each prompt | `--permission-mode auto`, requires opt-in |
| `plan` | Plan-mode session — refuse write tools entirely; produce a plan instead | `--permission-mode plan` |
| `dontAsk` | Like `acceptEdits` + accept all reads silently | rare, legacy |

A teammate runs **with its own mode**, separate from the leader's. The mode is set at spawn time and only changes if the leader broadcasts a `mode_set_request`.

---

## Path 1: Leader → In-Process Teammate Inheritance

When the leader spawns an in-process teammate via the Agent tool with a `name` and `team_name`, the spawn helper (`t68` in v2.1.142, formerly `j2K`/`cI8` in v2.1.112) sets the teammate's initial permission mode via `CD6(leaderMode, planRequired)`:

```javascript
// ============================================
// inheritPermissionModeForTeammate - Map leader's mode to teammate's initial mode
// Location: cli_inner_pretty.js:240330-240334
// ============================================

// ORIGINAL (for source lookup):
function CD6(H, $) {
  if ($) return "plan";
  if (H === "plan" || H === "dontAsk") return "default";
  return H;
}

// READABLE (for understanding):
function inheritPermissionModeForTeammate(leaderMode, teammateRequiresPlan) {
  if (teammateRequiresPlan) return "plan";
  if (leaderMode === "plan" || leaderMode === "dontAsk") return "default";
  return leaderMode;
}

// Mapping: CD6→inheritPermissionModeForTeammate, H→leaderMode, $→teammateRequiresPlan
```

### Decision Logic

The function is short but encodes three policies:

1. **`teammateRequiresPlan` wins.** If the agent's frontmatter says the teammate runs in plan mode (e.g., a `planning-only` custom agent), it's forced regardless of the leader's mode. Why: such agents are gated to *only* produce plans; running them in `acceptEdits` would silently violate their contract.

2. **`plan` does NOT inherit downward.** If the leader is in plan mode (it's drafting a plan, not making changes), spawning a teammate in plan mode would prevent the teammate from *implementing* anything. Demote to `default` so the teammate can do real work, while the leader stays in plan mode awaiting approval. Why: plan-mode is a *reviewer* role; teammates are *executors*.

3. **`dontAsk` does NOT inherit downward.** `dontAsk` is a legacy mode where the leader silently accepted everything; demoting to `default` forces the teammate through the normal permission flow. Why: dontAsk was rarely used and is being phased out; downstream agents should not inherit the silent-accept policy.

4. **Everything else inherits unchanged.** `default`, `acceptEdits`, `bypassPermissions`, and `auto` all flow straight through.

### Why `bypassPermissions` DOES Inherit

This deserves attention. A user who launched the leader with `--dangerously-skip-permissions` clearly opted into bypassing all prompts — but should that opt-in propagate to *every* teammate?

The answer in v2.1.142 is **yes, it propagates**. Rationale:
- If the user trusted the leader to bypass permissions, they're explicitly delegating that trust.
- Forcing each teammate back to default would create UX whiplash: a stream of permission prompts in a session the user explicitly marked as "skip prompts".
- The user can always *override* per-teammate by setting the teammate's agent-definition `permissionMode: default`, which takes precedence (next section).

### Plan Mode Auto-Approval Path

When the teammate runs in plan mode, an additional invariant kicks in: any plan the teammate produces must be *approved* by the leader before the teammate can switch back to a normal mode. This is the `plan_approval_request` / `plan_approval_response` protocol described in `plan_mode_integration.md` (v2.1.112 baseline). The leader writes the response with `permissionMode: "acceptEdits"` (typically), and the teammate transitions on receipt.

---

## Path 2: Spawner → Subagent (Agent Tool)

When the Agent tool's call handler dispatches a subagent (the "fresh agent" path, not the "send-message-to-existing-teammate" fast-path), it picks the subagent's initial mode from:

```javascript
// From the Agent tool's spawn branch (cli_inner_pretty.js:240367 in spawnInProcessTeammate context):
permissionMode: CD6(ctx.getAppState().toolPermissionContext.mode, planModeRequired),
```

That is, it reads the *spawner's current* `toolPermissionContext.mode` and pipes it through `CD6` as above. The spawner could be:
- The leader (top-level user session).
- Another in-process teammate (in `cI8`-style nested spawns — rare, since teammates-can-spawn-teammates is documented as disallowed in the tool prompt).
- The main thread of a `--agent <type>` session (uses the agent's frontmatter `permissionMode` if specified).

The agent's frontmatter `permissionMode` field is handled in the `rgK` resolver:

```javascript
// ============================================
// resolvePermissionMode - Compose CLI/env/settings/frontmatter into final mode
// Location: cli_inner_pretty.js:198981-199046
// ============================================

// ORIGINAL (for source lookup):
function rgK(H) {
  let { cli: $, env: q, settings: K, agentFrontmatter: _ } = H,
      A = $.permissionMode, z = $.dangerouslySkipPermissions, Y = _?.permissionMode;
  if (bH(q.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) {
    let X = z || (A && A !== "default") || (Y && Y !== "default"),
        L = "Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set " +
            "(allowed_non_write_users hardening). Declare allowedTools explicitly, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to opt out.";
    return { mode: "default", notification: X ? L : void 0 };
  }
  let f = Z$("tengu_disable_bypass_permissions_mode", !1),
      O = K.permissions?.disableBypassPermissionsMode === "disable",
      M = f || O, w = $t1(), D = [], j;
  if (z) D.push("bypassPermissions");
  if (A) { let X = Rv(A); if (X === "auto") { if (w) N(/* warn */); else D.push("auto"); } else D.push(X); }
  if (Y) { if (Y === "auto" && w) N(/* warn */); else D.push(Y); }
  if (K.permissions?.defaultMode) { /* settings defaultMode candidate, with auto-source gating */ D.push(K.permissions.defaultMode); }
  let J;
  for (let X of D) {
    if (X === "bypassPermissions" && M) { j = f ? "...feature gate..." : "...settings..."; continue; }
    J = { mode: X, notification: j }; break;
  }
  if (!J) J = { mode: "default", notification: j };
  return { mode: J.mode, notification: J.notification };
}

// READABLE (for understanding):
function resolvePermissionMode(args) {
  const { cli, env, settings, agentFrontmatter } = args;
  const cliPermMode = cli.permissionMode;
  const bypassFlag = cli.dangerouslySkipPermissions;
  const frontmatterMode = agentFrontmatter?.permissionMode;

  // Hardening: CLAUDE_CODE_SUBPROCESS_ENV_SCRUB forces default mode for allowed_non_write_users.
  if (parseBool(env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) {
    const userRequested = bypassFlag || (cliPermMode && cliPermMode !== "default") || (frontmatterMode && frontmatterMode !== "default");
    const msg = "Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set " +
                "(allowed_non_write_users hardening). Declare allowedTools explicitly, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to opt out.";
    return { mode: "default", notification: userRequested ? msg : undefined };
  }

  // Bypass-mode gating: settings or feature flag can disable bypass.
  const bypassDisabledByFlag = featureFlag("tengu_disable_bypass_permissions_mode", false);
  const bypassDisabledBySettings = settings.permissions?.disableBypassPermissionsMode === "disable";
  const bypassDisabled = bypassDisabledByFlag || bypassDisabledBySettings;
  const autoCircuitOpen = isAutoModeCircuitBreakerOpen();

  // Precedence order: CLI flags > CLI permissionMode > frontmatter > settings defaultMode.
  const candidates = [];
  if (bypassFlag) candidates.push("bypassPermissions");
  if (cliPermMode) {
    const mode = normalizePermissionMode(cliPermMode);
    if (mode === "auto") {
      if (autoCircuitOpen) warn("auto mode circuit breaker active — falling back to default");
      else candidates.push("auto");
    } else candidates.push(mode);
  }
  if (frontmatterMode) {
    if (frontmatterMode === "auto" && autoCircuitOpen) warn("frontmatter requested auto but breaker active");
    else candidates.push(frontmatterMode);
  }
  if (settings.permissions?.defaultMode) {
    /* policy/user/flag-settings-only gating for auto mode applies here */
    candidates.push(settings.permissions.defaultMode);
  }

  // Walk candidates in order; first non-blocked wins.
  let notification;
  for (const candidate of candidates) {
    if (candidate === "bypassPermissions" && bypassDisabled) {
      notification = bypassDisabledByFlag
        ? "Bypass permissions mode was disabled by your organization policy"
        : "Bypass permissions mode was disabled by settings";
      continue;
    }
    return { mode: candidate, notification };
  }
  return { mode: "default", notification };
}

// Mapping: rgK→resolvePermissionMode, H→args, $→cli, q→env, K→settings, _→agentFrontmatter,
//          A→cliPermMode, z→bypassFlag, Y→frontmatterMode, bH→parseBool, Z$→featureFlag,
//          $t1→isAutoModeCircuitBreakerOpen, Rv→normalizePermissionMode, D→candidates
```

### Precedence Order

The candidate-walk implements: **CLI flag > CLI argument > agent frontmatter > settings defaultMode > built-in default**. The first that survives gating wins.

This precedence matters when, e.g.:
- User runs `claude --agent reviewer --permission-mode default` against a `reviewer.md` whose frontmatter says `permissionMode: bypassPermissions`. CLI argument wins; mode is `default`. The user can always override the agent's frontmatter from the CLI.
- User runs `claude --dangerously-skip-permissions --agent reviewer`. CLI flag wins; mode is `bypassPermissions` (assuming policy permits).
- User has no CLI override, agent is `reviewer.md` with `permissionMode: acceptEdits`. Frontmatter wins; mode is `acceptEdits`.

### Why an Ordered Candidate Walk?

An obvious alternative would be a "merge" or "max-permissive-wins" or "min-permissive-wins" rule. The walk-and-break design captures explicit override semantics: the most specific source wins, with each level's restrictions (e.g., bypass-disabled policy) able to *skip* a candidate without aborting the whole resolution.

The walk also makes the `notification` field carry useful messaging: if the user explicitly set `--dangerously-skip-permissions` but org policy disabled bypass, the next candidate is consulted, and a notification documents *why* bypass was downgraded.

---

## Path 3: Background Subagent (Daemon-Dispatched)

`claude agents` (v2.1.142's agent view) and `claude --bg` are dispatched by the daemon, not by an in-process leader. They take their permission mode from argv flags rather than inheriting from a parent session in memory.

The flags introduced in v2.1.142 (see unit 08's `v2_1_142_dispatch_flags.md`):

```
--permission-mode <default|acceptEdits|auto|plan>
--dangerously-skip-permissions     # implies bypassPermissions
```

These flags are validated by `coerceDispatchDefaults` (`gg4`) before being stashed in the dispatch-defaults bag:

```javascript
// Excerpt from agent-view .action(opts) handler (cli_inner_pretty.js:607834):
dispatchDefaults: {
  permissionMode: A.dangerouslySkipPermissions ? "bypassPermissions" : A.permissionMode,
  model: A.model,
  effort: A.effort,
}
```

When a worker is dispatched, `dispatchDefaultsToArgv` (`qg6`) serializes these back into `--permission-mode X` flags that the worker process parses normally via `rgK`. The worker is just `claude` started with those flags — no special inheritance protocol is needed.

### Bg Worker Environment

The daemon also sets `CLAUDE_CODE_SESSION_KIND=bg` and `CLAUDE_BG_BACKEND=daemon` in the worker's environment. This signals the worker's startup code to:
1. Use the daemon-managed PTY socket as its UI surface (instead of stdin/stdout).
2. Persist its `permissionMode` to the job-dir state file (`.claude/jobs/{short}/state.json`), so that:
   - `claude daemon status` / `/doctor` can report it.
   - **A retire/wake cycle reuses the same mode** rather than reverting to default.

This last point is the **v2.1.141 fix**: previously, when a bg worker idled out and the daemon re-dispatched it, the relaunch used a fresh argv without the `--permission-mode` flag, so the worker fell back to settings default. v2.1.141 persists the dispatch defaults in the job-dir state, and the daemon's relaunch path reads them back.

```
First dispatch:
  claude agents → flags: --dangerously-skip-permissions
                ↓
  Worker boots in bypassPermissions mode
                ↓
  state.json: { "dispatchDefaults": { "permissionMode": "bypassPermissions", ... } }
                ↓
  Worker idles → daemon retires it
                ↓
  Later: `claude agents` reattach
                ↓
  Daemon reads state.json, relaunches with --permission-mode bypassPermissions
                ↓
  Worker is back in bypassPermissions ✓ (was lost before v2.1.141)
```

---

## Inheritance Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│ User (CLI flags + env + settings)                                       │
│   │                                                                       │
│   │  --dangerously-skip-permissions, --permission-mode, env, settings    │
│   ▼                                                                       │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ resolvePermissionMode (rgK)                                          │ │
│ │   → Walks: CLI flag > CLI arg > frontmatter > settings default       │ │
│ │   → Returns: { mode, notification }                                  │ │
│ └────────┬────────────────────────────────────────────────────┬─────────┘ │
│          │                                                    │           │
│          ▼ (interactive session)                              ▼ (bg)      │
│  Leader's toolPermissionContext.mode                  Bg worker argv:     │
│          │                                              --permission-mode │
│          │                                                                │
│          │ spawn teammate                                                 │
│          ▼                                                                │
│  CD6(mode, planRequired) → mapped mode                                    │
│          │                                                                │
│          ▼                                                                │
│  Teammate's toolPermissionContext.mode                                    │
│          │                                                                │
│          │ teammate's own Agent-tool spawn                                │
│          ▼                                                                │
│  CD6(teammateMode, ...) → grandchild mode    (rare path; gated)           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## acceptEdits / bypass / auto Propagation in Detail

### `acceptEdits`

- **Inherits down.** A teammate spawned by an `acceptEdits` leader starts in `acceptEdits` unless its frontmatter overrides.
- **Settings effect.** `settings.permissions.defaultMode === "acceptEdits"` makes new sessions start in acceptEdits.
- **Per-rule overrides.** Even in acceptEdits, individual permission rules (`permissions.allow`/`permissions.deny`) still apply. A rule denying a specific Bash command still fires the deny.

### `bypassPermissions`

- **Inherits down** (subject to policy).
- **Disabled by `permissions.disableBypassPermissionsMode === "disable"` setting** — policy-controlled, prevents bypass even if the user passed `--dangerously-skip-permissions`. The notification message documents the demotion.
- **Disabled by `tengu_disable_bypass_permissions_mode` feature flag** — server-side kill switch.
- **Persisted across bg retire/wake** as of v2.1.141.

### `auto`

- **Inherits down** if circuit breaker is closed.
- **Circuit breaker** (`tengu_auto_mode_config.enabled === "disabled"`) makes auto-mode fall through to the next candidate.
- **Requires explicit opt-in** via settings to enable as a session default. Only `policySettings`, `userSettings`, and `flagSettings` (not `projectSettings` or `localSettings`) can set `defaultMode: "auto"` — projectSettings and localSettings are considered untrusted (a checked-in `.claude/settings.json` could quietly enable auto).
- **Classifier-driven.** Each prompt is run through the auto-mode classifier (a small model) to decide allow/deny.

---

## Permission Mode Override on Subagent Dispatch (v2.1.135 / v2.1.141 / v2.1.142)

The `--permission-mode` flag on `claude agents` (v2.1.142) is the agent-view dispatcher's way of overriding the persisted default for *that dispatch*. The flow:

1. User runs `claude agents --permission-mode acceptEdits`.
2. `Go6` (`parseAgentsDispatchFlags`) pulls the flag out of argv.
3. `gg4` (`coerceDispatchDefaults`) validates: it's a known mode AND not bypass/auto unless the user has prior opt-in.
4. The agent-view stashes `dispatchDefaults.permissionMode = "acceptEdits"`.
5. Each task dispatched from agent view has `--permission-mode acceptEdits` appended to its worker argv.
6. The worker reaches `rgK`, which sees the CLI flag and uses it as the highest-priority candidate.

This is **per-dispatch override**: the user can have global settings of `default` but flag `acceptEdits` for one agent-view session. Each dispatched task within that session inherits the override; tasks dispatched from a *different* `claude agents` invocation without the flag use settings default.

### `--dangerously-skip-permissions` on `claude agents`

This is the most consequential combination. It says: "every task I dispatch from this agent view should run in bypass mode."

The validator (in `coerceDispatchDefaults`) gates this:
- If the user has *not* already accepted the bypass trust dialog this session, the flag is rejected.
- If they have, it's accepted and propagated to every worker.

This matches the v2.1.98 documented behavior of "subagent permission-mode inheritance from --dangerously-skip-permissions": once accepted at the leader/dispatcher level, all downstream subagents start with bypass.

---

## Edge Cases and Failure Modes

### CLAUDE_CODE_SUBPROCESS_ENV_SCRUB

The env-scrub hardening (`zR6` / `wrapResolvePermissionMode`) forces mode to `default` regardless of CLI/settings if the env var is set. This is for `allowed_non_write_users` enterprise hardening — a wrapper script can scrub the env, forcing the inner `claude` to behave as if no bypass was requested.

If the user *did* request bypass via CLI or settings, the notification documents the downgrade explicitly. They see:

> Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set (allowed_non_write_users hardening). Declare allowedTools explicitly, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to opt out.

### Re-resolution on `--resume`

`--resume` does NOT re-apply the persisted `permissionMode` from the resumed session. Instead, the worker's startup notes the mismatch:

> Deferred tool resume: permissionMode mismatch (deferred under 'X', resuming under 'Y'). --resume does not restore permissionMode — pass --permission-mode X to match.

This is intentional: `--resume` is for *picking up a transcript*, not for restoring the entire trust state. The user must explicitly re-affirm bypass by passing the flag.

### Plan-Mode-Required Frontmatter

An agent whose frontmatter sets `planModeRequired: true` (e.g., a planning-only reviewer) is *always* spawned in plan mode. This overrides every other source — `CD6(leaderMode, true)` returns `"plan"` unconditionally. The reasoning: if a tool's agent definition asserts it can only operate in plan mode, ignoring that would let the agent perform destructive writes outside its contract.

---

## See Also

- [tool_inheritance.md](./tool_inheritance.md) — Tool availability inheritance (orthogonal to permission mode)
- [worktree_isolation.md](./worktree_isolation.md) — `isolation: worktree` is a sibling sandboxing mechanism
- [coordinator_process_model.md](./coordinator_process_model.md) — How the daemon persists dispatch defaults across retire/wake
- v2.1.112 baseline: `permission_sync.md` for the `permission_request` / `permission_response` mailbox round-trip
