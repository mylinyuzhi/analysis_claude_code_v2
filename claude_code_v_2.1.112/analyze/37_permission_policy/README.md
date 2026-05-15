# Module 37 — Permission Policy: Auto Mode + Permissions

**Scope:** Auto mode dispatch, safety classifier hardening, `--dangerously-skip-permissions` integrity, denied-command UX, and the Bash permission-bypass closures shipped across v2.1.88 → v2.1.112.

This module documents the **policy layer** that sits *above* individual tool execution and decides — before any side effects — whether the agent is allowed to proceed, must ask, or must be denied. The window covers a single coherent arc: auto mode goes from gated beta to default-on for Max+Opus 4.7, while a *much* larger surface of bypass classes is closed.

---

## 1. Architecture in One Diagram

```
                ┌─────────────────────────────────────────┐
                │  Tool dispatch (Query → CanUseTool)     │
                └─────────────────────┬───────────────────┘
                                      │
                  ┌───────────────────┼────────────────────┐
                  ▼                   ▼                    ▼
        PreToolUse hooks       Built-in rules        Safety classifier
        (permissionDecision)   (allow/deny/ask)      (yoloClassifier)
                  │                   │                    │
                  └─────────┬─────────┴──────────┬─────────┘
                            ▼                    ▼
                  Bash classifier          Mode gating
                  (compounds, env-vars,    (auto / acceptEdits /
                   backslash, /dev/tcp,    bypassPermissions /
                   wildcard, prototype)     plan / default)
                            │                    │
                            └─────────┬──────────┘
                                      ▼
                          allow | ask (prompt UX) | deny
                                      │
                                      ▼ if denied in auto mode
                          autoModeDenials store ──► /permissions Recent tab
```

**Three actors** decide a tool call's fate:
1. **Hooks** (user-supplied): can `allow` / `deny` / `ask` / `defer` and mutate input via `updatedInput`.
2. **Built-in rules**: `permissions.allow` / `permissions.deny` / `permissions.ask` and the deny-on-protected-path safety check.
3. **Safety classifier** (auto mode only): an LLM ("yolo") reviews the action against the transcript and returns `shouldBlock`.

The **mode** is the global state that decides *which checks run*: in `bypassPermissions` only deny rules fire; in `auto` the classifier is mandatory; in `acceptEdits` writes to the project go through but everything else still prompts; in `default` everything prompts unless an allow rule matches.

---

## 2. The Five Documents in this Module

| Doc | Topic | Versions touched |
|-----|-------|------------------|
| [`auto_mode_dispatch.md`](./auto_mode_dispatch.md) | Auto mode for Max+Opus 4.7, no `--enable-auto-mode` flag required | 2.1.111-112 |
| [`classifier_hardening.md`](./classifier_hardening.md) | Agent tool fallback on classifier-transcript-too-long; hook `updatedInput` re-checked against deny rules | 2.1.110 |
| [`dangerously_skip_fix.md`](./dangerously_skip_fix.md) | `--dangerously-skip-permissions` no longer downgrades to `acceptEdits` after a protected-path approval | 2.1.97-98 |
| [`denied_retry_ux.md`](./denied_retry_ux.md) | Auto mode denials show a notification + `/permissions` Recent tab with `r` to retry | 2.1.89 |
| [`bash_bypass_fixes.md`](./bash_bypass_fixes.md) | Bash classifier bypasses: backslash-escaped flag, compound commands, env-var prefixes, `/dev/tcp` redirects, wildcard matching, prototype-property rule names | 2.1.97-98 |

---

## 3. Cross-Cutting Themes

### 3.1 Auto Mode Graduation

By v2.1.110 the *safety classifier* was the most expensive piece of code Anthropic owned in Claude Code (every tool call in auto mode runs a side-query to an LLM). The team **graduated** the feature:

- **v2.1.88 baseline:** Auto mode is `TRANSCRIPT_CLASSIFIER`-flagged, requires `--enable-auto-mode`, and is only built into Anthropic-internal "ant" builds.
- **v2.1.111:** External Max subscribers get auto mode when using Opus 4.7. The flag is no longer required — auto mode is in the shift-tab carousel by default.
- **v2.1.112:** A hotfix for an availability check that was rejecting `claude-opus-4-7` after the v2.1.111 rollout.

The model gate (`modelSupportsAutoMode` / `Dk6`) is the choke point: for Max subscribers, *only* Opus 4.7 unlocks the feature; for pro and API users, both 4.6 and 4.7 are allowed.

### 3.2 Defense in Depth on Permissions

Three independent layers each closed bypasses across the window:

1. **Hook layer** (v2.1.110): `PermissionRequest` hooks returning `updatedInput` are now **re-checked** against `permissions.deny` rules — previously a hook could mutate the input to dodge a deny rule.
2. **Rule-loader layer** (v2.1.97): Permission rules with names that collide with `Object.prototype` properties (`toString`, `hasOwnProperty`, `__proto__`) no longer cause `settings.json` to silently fail. Fixed by switching the rule registry to `Object.create(null)`.
3. **Bash classifier layer** (v2.1.97-98): Multiple specific bypasses — backslash-escaped flags, compound commands, env-var prefixes, `/dev/tcp` redirects — all closed in a single concentrated security pass.

### 3.3 Mode Integrity

A subtle class of bug fixed in v2.1.97: the **permission mode** itself can be mutated by side paths. The `--dangerously-skip-permissions` regression was the worst example — accepting a write to a protected path was silently downgrading the user from `bypassPermissions` to `acceptEdits`. From v2.1.97 onward, the protected-path approval is tracked **per-path** instead of mutating the global mode.

This pattern (per-path state instead of mode-state-mutation) repeats elsewhere in the codebase: the `strippedDangerousRules` field tracks which deny rules were temporarily lifted for auto-mode, so re-entering default mode restores them precisely (chunks.164.mjs:2704-2721, `restoreDangerousPermissions` aka `pe`).

---

## 4. Why This Matters

The permission policy layer is what makes Claude Code **safe to run unattended**. Every bypass class fixed in this window had the potential to allow:

| Bypass | Worst-case impact |
|--------|-------------------|
| Backslash-escaped flag | Auto-allow `git \-rm` → arbitrary destructive subcommand |
| Compound bypass | `safe && rm -rf $HOME` slips past per-segment checks |
| `/dev/tcp` redirect | Exfiltrate filesystem contents over network |
| Env-var prefix | `LD_PRELOAD=... safecmd` mutates safecmd's behavior |
| Wildcard whitespace | User's `Bash(git diff *)` allow fails to match `git\tdiff foo` → prompt fatigue |
| Prototype property | Permission rule named `toString` silently disables all rules in `settings.json` |
| Bypass→acceptEdits | User thinks they're in YOLO mode; actually under stricter rules |
| Classifier OOM | Agent tool blocks because its own input + transcript can't fit Opus context |

The team's response is consistent: when a bypass is found, the corresponding code path **fails closed** (default to ask/deny rather than allow), and the policy logic adds a new check rather than weakening existing checks.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_unit_12.md`](../00_overview/symbol_additions_unit_12.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions and constants discussed across these documents:
- `modelSupportsAutoMode` (`Dk6`) — Gate auto mode by model + provider
- `verifyAutoModeGateAccess` (`yK8`) — Async circuit-breaker + carousel availability check
- `isAutoModeGateEnabled` (`$L`) — Sync gate (settings, circuit breaker, model)
- `hasAutoModeOptIn` (`VU`) — Reads `skipAutoPermissionPrompt` from all four settings scopes
- `hasAutoModeOptInAnySource` (`Wn8`) — CLI flag OR `VU()`
- `restoreDangerousPermissions` (`pe`) — Re-installs `strippedDangerousRules` on auto exit
- `T4` — The string literal `"Agent"` (used as the special-case in classifier overflow fallback)
- `N98` — The safe-env-var allowlist for Bash classifier (37 entries)
- `recordAutoModeDenial` — Pushes a denial to the in-memory ring buffer that backs the Recent tab

---

## Reading Order

1. Start with [`auto_mode_dispatch.md`](./auto_mode_dispatch.md) — the GA happens in the window and frames everything else.
2. Then [`classifier_hardening.md`](./classifier_hardening.md) — the safety classifier's failure modes.
3. Then [`bash_bypass_fixes.md`](./bash_bypass_fixes.md) — the largest concentrated security pass.
4. [`dangerously_skip_fix.md`](./dangerously_skip_fix.md) and [`denied_retry_ux.md`](./denied_retry_ux.md) are smaller and can be read in any order.
