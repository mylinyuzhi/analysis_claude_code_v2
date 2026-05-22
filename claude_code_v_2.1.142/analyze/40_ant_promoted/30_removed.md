# Removed Ant-Gated Features (v2.1.142)

> Survey of features that were present in 2.1.88 (gated by `USER_TYPE === 'ant'` or a build-time `feature()` flag) but have NO trace in 2.1.142's `cli_inner_pretty.js` — including both the gating logic and any code it once protected.
>
> **Method**: For each candidate, run `grep -c <token>` against `cli_inner_pretty.js`. A feature qualifies as "removed" if the count is 0 across all reasonable spelling variants (readable name, obfuscated import path, kebab-case slug, key constants, telemetry-event name).
>
> **Distinction from `20_still_internal.md`**: That file covers features whose gating is dead-but-present (`isEnabled: () => !1`, stubs, dead-text strings, hardcoded `isAnt: false`). This file covers features where even the dead carcass is gone — the build's dead-code-elimination pass walked through them.

## 1. KAIROS_* Family

### KAIROS_GITHUB_WEBHOOKS / subscribePr

**2.1.88 location**: `commands.ts:101-103`

```typescript
// ============================================
// subscribePr command import - KAIROS feature flag gated
// Location: 2.1.88 commands.ts:101-103
// ============================================

const subscribePr = feature('KAIROS_GITHUB_WEBHOOKS')
  ? require('./commands/subscribe-pr.js').default
  : null
```

**Where used in 2.1.88**: `INTERNAL_ONLY_COMMANDS` spread at `commands.ts:240`: `...(subscribePr ? [subscribePr] : [])`. Tool side: `tools.ts:50-52` imports `SubscribePRTool` under the same flag.

**2.1.142 evidence of removal**:
- `grep -c "KAIROS_GITHUB_WEBHOOKS" cli_inner_pretty.js` → 0
- `grep -c "SubscribePR" cli_inner_pretty.js` → 0
- `grep -c "subscribePr" cli_inner_pretty.js` → 0
- Only orphan reference: error string at `cli_inner_pretty.js:427278` reading `"Couldn't subscribe this session to PR webhooks — falling back to a 30-minute poll. Check the debug log for [bridge] subscribe-pr."` — this is dead text inside the bridge poll-fallback path (the fallback IS public, but the path that would have prevented it via webhook subscription is gone)

**Speculation on when removed**:
- Likely removed in the same wave as the broader KAIROS feature retirement
- Cross-referencing `by_version/`: no version-specific notes mention `KAIROS_GITHUB_WEBHOOKS` or `subscribePr` removal — consistent with a silent removal between 2.1.88 and 2.1.113 (earliest version notes available)

### KAIROS / KAIROS_BRIEF / proactive / brief / assistant commands

**2.1.88 location**: `commands.ts:62-72`

```typescript
// ============================================
// KAIROS feature-gated command imports
// Location: 2.1.88 commands.ts:62-72
// ============================================

const proactive =
  feature('PROACTIVE') || feature('KAIROS')
    ? require('./commands/proactive.js').default
    : null
const briefCommand =
  feature('KAIROS') || feature('KAIROS_BRIEF')
    ? require('./commands/brief.js').default
    : null
const assistantCommand = feature('KAIROS')
  ? require('./commands/assistant/index.js').default
  : null
```

**Where used in 2.1.88**: All three spread into `COMMANDS()` at `commands.ts:323-325`. Related tools at `tools.ts:42-49`: `SendUserFileTool` (KAIROS), `PushNotificationTool` (KAIROS || KAIROS_PUSH_NOTIFICATION).

**2.1.142 evidence of removal**:
- `grep -c "PROACTIVE" cli_inner_pretty.js` → 5 matches, ALL pointing to `Fw.PROACTIVELY_REFRESHED` cache-state enum (unrelated to PROACTIVE feature flag)
- `grep -c "/proactive" cli_inner_pretty.js` → 0
- `grep -c "name: \"brief\"" cli_inner_pretty.js` → 0
- `grep -c "name: \"assistant\"" cli_inner_pretty.js` → 0
- `grep -c "PushNotificationTool" cli_inner_pretty.js` → 0 (BUT the tool registration `PushNotification` IS in `assets/tools/_index.json`, indicating a different/separate PushNotification feature is now public — this is the cron/`ScheduleWakeup` push, not the KAIROS one)
- `grep -c "SendUserFileTool" cli_inner_pretty.js` → 0
- Single tangential mention at `cli_inner_pretty.js:588276` inside a `/dream` skill comment: `"won't exact-match migrateAssistantTasksPermanent()'s '/dream' check... won't keep working if the bundled skill is disabled via kill-switch or KAIROS activation"` — descriptive text inside a public skill, the only string-level survivor

**Speculation on when removed**:
- The KAIROS umbrella project appears to have been retired entirely. The `/dream` skill (and its scheduling via `tengu_kairos_*` telemetry events still present in the gates index) was the consumer-facing visible portion of KAIROS — that portion was REPACKAGED as the standard scheduling/cron tooling (`CronCreate`, `CronDelete`, `CronList`, `ScheduleWakeup`, `RemoteTrigger`) which is now public.
- The KAIROS-specific commands (`/proactive`, `/brief`, `/assistant`) and tools (`SendUserFile`, `PushNotification`-KAIROS-variant) did not survive the unbundling

### KAIROS_PUSH_NOTIFICATION / KAIROS_GITHUB_WEBHOOKS / ScheduleWakeup-like KAIROS variants

Already covered under the umbrella above. Sub-flags share the same fate.

## 2. Repo Classification & Undercover Mode (setup.ts:337-348)

**2.1.88 location**: `setup.ts:336-348`

```typescript
// ============================================
// Repo classification primer - sets undercover mode based on repo
// Location: 2.1.88 setup.ts:336-348
// ============================================

if (!isBareMode()) {
  if (process.env.USER_TYPE === 'ant') {
    // Prime repo classification cache for auto-undercover mode. Default is
    // undercover ON until proven internal; if this resolves to internal, clear
    // the prompt cache so the next turn picks up the OFF state.
    void import('./utils/commitAttribution.js').then(async m => {
      if (await m.isInternalModelRepo()) {
        const { clearSystemPromptSections } = await import(
          './constants/systemPromptSections.js'
        )
        clearSystemPromptSections()
      }
    })
  }
  ...
}
```

**Where used in 2.1.88**: `setup.ts` startup path. Supporting module `utils/commitAttribution.ts` defines `INTERNAL_MODEL_REPOS` (15+ private repo paths including `github.com:anthropics/claude-cli-internal`, `anthropics/anthropic`, `anthropics/apps`, `anthropics/casino`, `anthropics/dbt`, `anthropics/dotfiles`, `anthropics/terraform-config`, etc.), `isInternalModelRepo()` async classifier, `isInternalModelRepoCached()` sync read, `sanitizeSurfaceKey()`/`sanitizeModelName()` for git-commit-trailer model-name redaction.

**2.1.142 evidence of removal**:
- `grep -c "isInternalModelRepo" cli_inner_pretty.js` → 0
- `grep -c "INTERNAL_MODEL_REPOS" cli_inner_pretty.js` → 0
- `grep -c "repoClassCache" cli_inner_pretty.js` → 0
- `grep -c "sanitizeModelName" cli_inner_pretty.js` → 0
- `grep -c "sanitizeSurfaceKey" cli_inner_pretty.js` → 0
- Private repo paths absent: `anthropics/anthropic` (excl. SDK URLs), `anthropics/apps`, `anthropics/casino`, `anthropics/dbt`, `anthropics/dotfiles`, `anthropics/terraform-config`, `anthropics/hex-export`, `anthropics/feedback-v2`, `anthropics/labs` — `grep` returns 0 for all
- `claude-cli-internal` references in 2.1.142 are only the build-time `__dirname` strings (e.g., `file:///home/runner/work/claude-cli-internal/claude-cli-internal/...`) baked into module path constants — not a runtime classification lookup

**Purpose recap**: When an ant user opened Claude Code inside an internal repo (one where Anthropic does NOT want their model codenames sanitized — because those codenames ARE the real names there), `isInternalModelRepo()` would resolve to `true` and `clearSystemPromptSections()` would purge any cached "undercover mode" system-prompt fragment. Outside the internal allowlist (including in public anthropics repos), undercover mode stayed ON so that real model codenames stayed hidden in git commit trailers and prompts.

**Speculation on when removed**:
- The classification is gated entirely on `USER_TYPE === 'ant'` in 2.1.88, so it's a clean removal candidate when the public build is stamped
- The `INTERNAL_MODEL_REPOS` list itself is a confidentiality-sensitive token (it discloses internal repo names) — that's a stronger motivation to scrub it from the public build than other ant-only features
- The `sanitizeModelName`/`sanitizeSurfaceKey` helpers were also `COMMIT_ATTRIBUTION` consumers — both COMMIT_ATTRIBUTION feature and the helpers were dropped in the same pass
- No `by_version/` notes mention this removal — consistent with a silent dead-code-elimination cleanup

## 3. Dev Panes in tmux (worktree.ts:1395-1462)

**2.1.88 location**: `utils/worktree.ts:1395-1462`

```typescript
// ============================================
// Dev panes setup - ant-internal tmux multipane for claude-cli-internal
// Location: 2.1.88 utils/worktree.ts:1395-1462
// ============================================

// For ants in claude-cli-internal, set up dev panes (watch + start)
const isAnt = process.env.USER_TYPE === 'ant'
const isClaudeCliInternal = repoName === 'claude-cli-internal'
const shouldSetupDevPanes = isAnt && isClaudeCliInternal && !sessionExists

if (shouldSetupDevPanes) {
  // Create detached session with Claude in first pane
  spawnSync('tmux', ['new-session', '-d', '-s', tmuxSessionName, ...], ...)
  // Split horizontally and run watch
  spawnSync('tmux', ['split-window', '-h', '-t', tmuxSessionName, ...], ...)
  spawnSync('tmux', ['send-keys', '-t', tmuxSessionName, 'bun run watch', 'Enter'], ...)
  // Split vertically and run start
  spawnSync('tmux', ['split-window', '-v', '-t', tmuxSessionName, ...], ...)
  spawnSync('tmux', ['send-keys', '-t', tmuxSessionName, 'bun run start'], ...)
  // Select the first pane (Claude)
  spawnSync('tmux', ['select-pane', '-t', `${tmuxSessionName}:0.0`], ...)
  // Attach or switch
  if (isAlreadyInTmux) spawnSync('tmux', ['switch-client', '-t', tmuxSessionName], ...)
  else spawnSync('tmux', [...tmuxGlobalArgs, 'attach-session', '-t', tmuxSessionName], ...)
} else {
  // Standard behavior: create or attach
  ...
}
```

**Where used in 2.1.88**: `worktree.ts` — the worktree-creation flow that bridges `git worktree` with tmux session management

**2.1.142 evidence — PARTIAL: code present but dead-coded with `if (!1)`**

```javascript
// ============================================
// worktreeAttachTmux - Dev panes are present but unreachable
// Location: cli_inner_pretty.js:523449-523460
// ============================================

// ORIGINAL (for source lookup):
if (!1)
  if (
    (await O6("tmux", ["new-session", "-d", "-s", Y, "-c", A, "--", process.execPath, ...f], { cwd: A, env: j }),
    await O6("tmux", ["split-window", "-h", "-t", Y, "-c", A], { cwd: A }),
    await O6("tmux", ["send-keys", "-t", Y, "bun run watch", "Enter"], { cwd: A }),
    await O6("tmux", ["split-window", "-v", "-t", Y, "-c", A], { cwd: A }),
    await O6("tmux", ["send-keys", "-t", Y, "bun run start"], { cwd: A }),
    await O6("tmux", ["select-pane", "-t", `${Y}:0.0`], { cwd: A }),
    L)
  )
    await tX("tmux", ["switch-client", "-t", Y], { stdio: "inherit", cwd: A, reject: !1 });
  else await tX("tmux", [...Z, "attach-session", "-t", Y], { stdio: "inherit", cwd: A, reject: !1 });
else if (L) ...

// READABLE (for understanding):
if (false) {  // shouldSetupDevPanes was compile-time inlined to false
  // Dead branch: dev-pane setup
  await spawn("tmux", ["new-session", "-d", "-s", sessionName, "-c", worktreeDir, "--", process.execPath, ...args], { cwd: worktreeDir, env: tmuxEnv });
  await spawn("tmux", ["split-window", "-h", "-t", sessionName, "-c", worktreeDir], { cwd: worktreeDir });
  await spawn("tmux", ["send-keys", "-t", sessionName, "bun run watch", "Enter"], { cwd: worktreeDir });
  await spawn("tmux", ["split-window", "-v", "-t", sessionName, "-c", worktreeDir], { cwd: worktreeDir });
  await spawn("tmux", ["send-keys", "-t", sessionName, "bun run start"], { cwd: worktreeDir });
  await spawn("tmux", ["select-pane", "-t", `${sessionName}:0.0`], { cwd: worktreeDir });
  if (isAlreadyInTmux) {
    await spawnInherit("tmux", ["switch-client", "-t", sessionName], ...);
  } else {
    await spawnInherit("tmux", [...attachExtraArgs, "attach-session", "-t", sessionName], ...);
  }
} else if (isAlreadyInTmux) {
  // ... standard tmux flow
}

// Mapping: O6→spawn, tX→spawnInherit, Y→sessionName, A→worktreeDir, j→tmuxEnv, f→args, L→isAlreadyInTmux, Z→attachExtraArgs
```

**Status — REMOVED (dead-coded)**:
- `grep -c "shouldSetupDevPanes" cli_inner_pretty.js` → 0 (the variable name is gone)
- `grep -c "claude-cli-internal" cli_inner_pretty.js` → 9 matches, but ALL are `__dirname`/`fileURLToPath` build paths — not the runtime repoName comparison
- The dev-pane code body itself IS present as the body of an `if (!1)` block at line 523449. Since `!1 === false`, this is unreachable code that the bundler did NOT strip (likely because the tree-shaker only eliminates dead exports/imports, not dead branches inside live functions)

**Why is the dead branch retained?** Two reasons:
1. The branch sits INSIDE a publicly-reachable function (`worktreeAttachTmux`-equivalent), so the function survives. Branch-elimination requires a separate dead-code pass that wasn't applied
2. The original source had `if (shouldSetupDevPanes)` where `shouldSetupDevPanes = isAnt && isClaudeCliInternal && !sessionExists`. The build-time-inliner saw `isAnt` collapse to `false` (because the global `USER_TYPE === 'ant'` substitution made `isAnt === false`), then `false && X` folded to `false`, leaving `if (false)` literally in the output

**Speculation on when removed**:
- This was never "removed" in source; it's purely a public-build artifact of the `USER_TYPE === 'ant'` substitution. Internal builds presumably still get the dev-pane code path
- The `'external' === 'ant'` pattern visible in 2.1.88 `PromptInput.tsx:297` (`useAppState(s => "external" === 'ant' && s.tungstenActiveSession !== undefined)`) is the same fingerprint — the build process substitutes the literal string before compilation, leaving `"external" === "ant"` (always false) in place of `USER_TYPE === 'ant'`
- No `by_version/` notes — and there shouldn't be, because from an ant-internal perspective nothing changed

## 4. AGENT_TRIGGERS_REMOTE / RemoteTriggerTool — PROMOTED (NOT removed)

Originally flagged as a candidate for "removed" in the task brief, but verification shows this was PROMOTED to public, not removed. Listed here so it isn't double-counted:

- 2.1.88 gate: `feature('AGENT_TRIGGERS_REMOTE') ? require('./tools/RemoteTriggerTool/...') : null` at `tools.ts:36-38`
- 2.1.142 presence: 5+ matches in `cli_inner_pretty.js` including `var QkH = "RemoteTrigger"` at line 385266, full tool implementation at lines 385310-385402, and tool list inclusion at 387594. The tool ALSO appears in the public `assets/tools/_index.json`
- Status: PROMOTED — defer to C2 (`10_promoted.md`) for the deep-dive

## 5. Other Candidates Investigated but NOT Confirmed Removed

These were not in the primary task brief but came up during the survey. They are partially-present and so are catalogued in `20_still_internal.md` (still-internal) or `10_promoted.md` (promoted) rather than here:

- BRIDGE_MODE / DAEMON — partially promoted (bridge runtime is public, build flag eliminated)
- VOICE_MODE — promoted to public (with availability gating)
- FORK_SUBAGENT — promoted to env-var gate
- ENHANCED_TELEMETRY_BETA — promoted to env-var gate
- PERFETTO_TRACING — promoted to env-var gate (`CLAUDE_CODE_PERFETTO_TRACE`)
- ULTRAPLAN — partially removed (command gone, mode-name string survives in bridge protocol)
- BYOC_ENVIRONMENT_RUNNER — partially present (2 matches, likely promoted with env-var)

## Summary

**Confirmed fully removed (no carcass) in 2.1.142**:

1. KAIROS_GITHUB_WEBHOOKS / subscribePr / SubscribePRTool — only an orphan error string survives
2. KAIROS / KAIROS_BRIEF / proactive / brief / assistant commands — only a `/dream` skill comment string survives
3. KAIROS PushNotificationTool / SendUserFileTool — fully gone (the public `PushNotification` tool is a separate, generic mechanism)
4. Repo classification (isInternalModelRepo, INTERNAL_MODEL_REPOS allowlist, sanitizeModelName, sanitizeSurfaceKey) — entire `commitAttribution.ts` module tree-shaken
5. COMMIT_ATTRIBUTION feature flag + attributionHooks setup — fully gone
6. TEAMMEM feature + teamMemorySync watcher — fully gone

**Confirmed dead-but-present in 2.1.142** (qualifies as "removed in spirit" but the carcass is still in the file):

1. Dev panes in tmux (worktree.ts:1395-1462) — wrapped in `if (!1)` because `isAnt && isClaudeCliInternal` collapsed to false at build time

**Pattern**: The 2.1.142 public build's removal strategy is:
- **Tree-shake** at the import boundary when possible — `feature('X') ? require(...) : null` becomes `null` and the entire imported module is dead-code-eliminated
- **Inline-substitute** for boolean checks — `process.env.USER_TYPE === 'ant'` becomes `'external' === 'ant'` becomes `false` at the call site, leaving dead branches inside live functions
- **Hardcode** for runtime gates that flow through `gates.isAnt` — set to `false` in `getDefaultGates()`, propagating dead-branchness throughout query/agent execution

## Cross-References

- See `20_still_internal.md` for features whose dead carcass IS visible (stubs, dead strings, dead branches in live functions)
- See `10_promoted.md` (C2) for ant-only-to-public migrations
- See `00_overview/changelog_analysis.md` for cross-version context if available
