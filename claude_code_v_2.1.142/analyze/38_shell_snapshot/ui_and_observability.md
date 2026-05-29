# UI and Observability Surface (v2.1.142)

> Shell snapshots are intentionally **invisible to the user**: there is no banner, no status-line indicator, no Doctor-screen section, and no Bash tool output that mentions the snapshot. This document inventories the few places a snapshot's existence *does* leak into user-visible or operator-visible surfaces — the CLI `claude project purge` warnings, debug logs, OpenTelemetry spans, and the `tengu_shell_snapshot_*` analytics events — and explains why the design keeps everything else silent.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) — Unit 04 mappings

Key functions in this document:
- `purgeProjectHandler` (`dqA`) — `claude project purge` CLI subcommand handler — cli_inner_pretty.js:604708
- `planProjectPurge` (`gqA`) — Builds the per-project purge plan — cli_inner_pretty.js:604585
- `planAllPurge` (`QqA`) — Builds the `--all` purge plan — cli_inner_pretty.js:604640
- `printPurgePlan` (`j$9`) — Prints items + warnings to stdout/stderr — cli_inner_pretty.js:604698
- `printLine` (`Nr6`) — `process.stdout.write(s + "\n")` — cli_inner_pretty.js:604438
- `printWarning` (`kr`) — Yellow `process.stderr.write(s + "\n")` — cli_inner_pretty.js:530206
- `directoryExists` (`j_H`) — Async stat-or-false probe — cli_inner_pretty.js:604457
- `logForDebugging` (`N`) — Routes to `~/.claude/debug/<sid>.txt` — cli_inner_pretty.js (referenced throughout snapshot creation)
- `logEvent` (`d`) — Tengu telemetry sink — cli_inner_pretty.js (referenced throughout)
- `recordSpanSuccess` (`RH`) — OTEL span success — cli_inner_pretty.js:360873
- `recordSpanFailure` (`J8`) — OTEL span failure — cli_inner_pretty.js:360876, 360892

---

## 1. Why There's (Almost) No UI

Shell snapshots are a **performance optimisation**, not a user-facing feature. Surfacing them anywhere — a startup spinner, a banner, a settings entry — would create three problems:

1. **Cognitive load**: most users have no model of what a shell snapshot is, so an indicator would generate support questions ("what is this `shell-snapshots/` folder?") far more often than it would inform.
2. **Failure-mode anxiety**: when snapshot creation fails, the user can still use Bash tool normally because the executor falls back to a login shell (`-l` flag). Showing a red "snapshot failed" banner would suggest broken behaviour where none exists.
3. **Persistence bias**: a status indicator implies state that the user can act on. The user cannot do anything meaningful with a "snapshot present/absent" indicator — the executor handles both cases transparently.

So the design is: **make it invisible when it works, surface only what an operator needs when it doesn't**. The operator-facing surfaces are observability tools (debug log, telemetry, OTEL spans), not end-user UI.

### What is *not* a snapshot UI

A thorough sweep of the v2.1.142 bundle confirms the **absence** of:

| Surface | Has snapshot reference? | Evidence |
|---------|-------------------------|----------|
| `/doctor` screen | No | `screens/Doctor.tsx` in v2.1.88 source has no `shell_snapshot` / `ShellSnapshot` import; no snapshot-related section emitted. Grep of v2.1.142 `cli_inner_pretty.js` for `Doctor.*Shell` / `DoctorShell` / `ShellSection` returns nothing. |
| Status line | No | `getStatusLine` and all status-line component code have no snapshot reference. |
| Startup banner | No | No "creating snapshot..." spinner. Snapshot creation is fire-and-forget at provider construction. |
| Bash tool result | No | The Bash tool output rendering (in `tools/BashTool/`) only includes the captured stdout/stderr; the source-snapshot line is part of `commandString` but the result rendering does not annotate it. |
| Settings UI | No | No snapshot-related entries in the settings store, `/config` screen, or the JSON schema for `~/.claude/settings.json`. |
| Notifications | No | Snapshot failures do not emit Ink notifications or toast popups. |

The single exception is documented in Section 2.

---

## 2. The One Real UI Surface: `claude project purge`

The `claude project purge` CLI subcommand is the only place where the shell-snapshots directory surfaces in user-visible output.

### 2.1 Command shape

Registered as a subcommand of `claude project`:

```bash
claude project purge [path] [--dry-run] [-y|--yes] [-i|--interactive] [--all]
```

Source: `cli_inner_pretty.js:607772-607784`. The handler is `purgeProjectHandler` (`dqA`) at line 604708.

The command exists so a user can fully reset Claude Code's per-project state (`~/.claude/projects/<sid>.jsonl`, `tasks/`, `file-history/`, `~/.claude.json` entry, history-lines, etc.). The user expects "purge this project" or "purge everything" to clear *all* state — so the command takes pains to tell them what it will *not* touch.

### 2.2 The snapshot warning

Both planners (`planProjectPurge` and `planAllPurge`) include this branch:

```javascript
// ============================================
// shell-snapshots warning (in both planProjectPurge and planAllPurge)
// Location: cli_inner_pretty.js:604631-604632, 604658-604659
// ============================================

// ORIGINAL (for source lookup):
if (await j_H(_v.join(H, "shell-snapshots")))
  q.push("shell-snapshots/ are not project-scoped and will not be touched");

// READABLE (for understanding):
if (await directoryExists(path.join(claudeHome, "shell-snapshots"))) {
  warnings.push("shell-snapshots/ are not project-scoped and will not be touched");
}

// Mapping: j_H→directoryExists, _v→path, q→warnings, H→claudeHome
```

When the planner finishes, `printPurgePlan` walks the `items` and `warnings` arrays and emits them:

```javascript
// ============================================
// printPurgePlan - Print purge plan items and warnings
// Location: cli_inner_pretty.js:604698-604707
// ============================================

// ORIGINAL (for source lookup):
function j$9(H, $, q) {
  Nr6(`\nPurge plan for ${H}:\n`);
  for (let K of $) Nr6(`  ${P$9(K)}`);
  if (q.length) {
    Nr6();
    for (let K of q) kr(K);
  }
}

// READABLE (for understanding):
function printPurgePlan(targetLabel, items, warnings) {
  printLine(`\nPurge plan for ${targetLabel}:\n`);
  for (const item of items) printLine(`  ${formatPurgeItem(item)}`);
  if (warnings.length > 0) {
    printLine();
    for (const warning of warnings) printWarning(warning);
  }
}

// Mapping: j$9→printPurgePlan, H→targetLabel, $→items, q→warnings,
//   Nr6→printLine, kr→printWarning, P$9→formatPurgeItem
```

`printWarning` (`kr`) writes the string in **yellow ANSI** to **stderr** — chalk's `yellow(text) + "\n"`. So the resulting rendering is:

```text
Purge plan for /home/alice/projects/foo:

  ~/.claude/projects/abc-def-...jsonl    (project transcripts (.jsonl) and memory/)
  ~/.claude/tasks/abc-def-...            (tasks for session abc-def-...)
  ...

shell-snapshots/ are not project-scoped and will not be touched     ← yellow stderr
backups/ may still contain ...                                       ← yellow stderr
```

### 2.3 Why this single carve-out exists

Snapshots are **per-session, not per-project** — every session creates one snapshot named `snapshot-{shell}-{timestamp}-{rand6}.sh`. There's no encoded project identity in the filename or contents, so it's impossible for the purge command to "purge only project X's snapshots". The warning tells the user this directly rather than letting them assume snapshots got purged.

The `backups/` directory has a similar carve-out for similar reasons: it holds rotated `~/.claude.json` snapshots (config-level, not project-level).

### 2.4 What the user actually sees

For the per-project flow (`claude project purge ~/projects/foo`):

```text
Purge plan for /home/alice/projects/foo:

  /home/alice/.claude/projects/.../<sid>.jsonl   (project transcripts (.jsonl) and memory/)
  /home/alice/.claude/tasks/<sid>                (tasks for session <sid>)
  /home/alice/.claude/debug/<sid>.txt            (debug log for session <sid>)
  /home/alice/.claude/file-history/<sid>         (file edit history for session <sid>)
  /home/alice/.claude/history.jsonl               (<N> prompt(s) typed in this project)

shell-snapshots/ are not project-scoped and will not be touched
backups/ may still contain this project entry in old .claude.json snapshots
  (/home/alice/.claude/backups); at most 5 are kept and they rotate out automatically
Delete 5 item(s) for /home/alice/projects/foo? This cannot be undone. [y/N]
```

For the `--all` flow (`claude project purge --all`):

```text
Purge plan for all projects:

  /home/alice/.claude/projects                   (all project transcripts (.jsonl) and memory/)
  /home/alice/.claude/tasks                       (all session task lists)
  /home/alice/.claude/debug                       (all session debug logs)
  /home/alice/.claude/file-history                (all session file edit history)
  /home/alice/.claude/history.jsonl              (prompt history across all projects)
  /home/alice/.claude.json [trust]               (project entry in ~/.claude.json (trust, history, MCP servers))

shell-snapshots/ are not project-scoped and will not be touched
backups/ may still contain project entries in old .claude.json snapshots
  ...
Delete 6 item(s) for ALL projects? This cannot be undone. [y/N]
```

### 2.5 How to actually clean snapshots

Users who really want to flush `shell-snapshots/` have three options:

1. **Wait** — the retention sweep (`cleanupShellSnapshots` / `al5` — see [retention_cleanup.md](./retention_cleanup.md)) removes `.sh` files older than `cleanupPeriodDays` (default 30 days) on each fresh session start.
2. **Restart Claude Code** — the cleanup callback registered in `createAndSaveSnapshot` fires on graceful shutdown and unlinks the current session's snapshot.
3. **`rm -rf ~/.claude/shell-snapshots`** — safe at any time; the next session will recreate the directory via `mkdir(..., { recursive: true })`.

The purge command's warning subtly steers users toward option 1 ("rotate out automatically") because that's the lowest-friction path.

---

## 3. Operator Observability: Debug Log

`logForDebugging` (`N`) is the workhorse for snapshot-creation observability. Every step writes a line that appears in `~/.claude/debug/<session-id>.txt` and in the in-process debug ring buffer that the `/bug` command attaches to bug reports.

### 3.1 Successful-creation trace

A clean snapshot creation produces this debug-log sequence:

```text
Creating shell snapshot for zsh (/bin/zsh)
Looking for shell config file: /home/alice/.zshrc
Snapshots directory: /home/alice/.claude/shell-snapshots
Creating snapshot at: /home/alice/.claude/shell-snapshots/snapshot-zsh-1715750000000-a1b2c3.sh
Execution timeout: 10000ms
Shell snapshot created successfully (4231 bytes)
```

When the Bash tool consumes the snapshot for its first command:

```text
Spawning shell without login (-l flag skipped)
```

### 3.2 Missing-config-file path

When the user has no `~/.zshrc` (etc.):

```text
Creating shell snapshot for zsh (/bin/zsh)
Looking for shell config file: /home/alice/.zshrc
Shell config file not found: /home/alice/.zshrc, creating snapshot with Claude Code defaults only
Snapshots directory: /home/alice/.claude/shell-snapshots
Creating snapshot at: /home/alice/.claude/shell-snapshots/snapshot-zsh-1715750000000-a1b2c3.sh
Execution timeout: 10000ms
Shell snapshot created successfully (892 bytes)
```

The "Claude Code defaults only" string is the cue: the snapshot still has the rg/find/grep wrappers and PATH export, just no user functions/aliases/options.

### 3.3 Failure trace

When `execFile` fails (timeout, signal, non-zero exit), the failure dump is extensive — it's designed for support engineers to reproduce:

```text
Shell snapshot creation failed: Command failed: /bin/bash -c -l <script>
Error details:
  - Error code: 1
  - Error signal: undefined
  - Error killed: false
  - Shell path: /bin/bash
  - Config file: /home/alice/.bashrc
  - Config file exists: true
  - Working directory: /home/alice/projects/foo
  - Claude home: /home/alice/.claude
Full snapshot script:
<...the entire generated bash script...>
stdout output (0 chars):
stderr output (245 chars): /home/alice/.bashrc: line 87: syntax error near unexpected token `}'
Failed to create shell snapshot: Command failed: /bin/bash -c -l <script>
```

Three observability properties worth flagging:

1. **The full script is dumped** — operators can copy-paste the script into a fresh `/bin/bash -c -l <pasted>` to reproduce the failure outside Claude Code. This is critical because the script contents change with shell version, user config, and platform.
2. **stderr is captured up to `maxBuffer: 1048576` (1 MB)**. Pathological configs that produce gigabytes of stderr will be truncated, but the truncation point is rare in practice — bashrc syntax errors usually emit a few hundred bytes.
3. **The `Full snapshot script` line is a Markdown-fence-safe newline** — the script body starts on the next line. Support engineers should be aware of this when triaging.

### 3.4 Missing-at-exec trace

When the snapshot file is unlinked after creation (e.g., a tmpfs-backed `~/.claude/` got cleared by an external process):

```text
Snapshot file missing, falling back to login shell: /home/alice/.claude/shell-snapshots/snapshot-zsh-1715750000000-a1b2c3.sh
```

This appears **once per session** even if 50 commands run after the unlink, because of the `missingTelemetryFired` (`A` in `$U7`) one-shot flag.

### 3.5 Where the debug log goes

`logForDebugging` writes to:

- `~/.claude/debug/<session-id>.txt` (rotated by `cleanupDebug` / `el5` after `cleanupPeriodDays`)
- An in-process ring buffer (consumed by `/bug` to attach the last N log lines to a feedback bundle)
- stderr when `CLAUDE_CODE_DEBUG=1` is set in the environment

The `{ level: "error" }` option on a `logForDebugging` call is used for the final "Failed to create shell snapshot" line — this routes through `logError` as well, ensuring the failure shows up in error-level monitoring (Sentry-like collectors) on Anthropic's internal build.

---

## 4. OpenTelemetry Spans

`createBashShellProvider` records two distinct OTEL outcomes (introduced in v2.1.142):

| When | API call | Span name | Reason field |
|------|----------|-----------|--------------|
| Snapshot promise resolves to a path | `recordSpanSuccess("shell_snapshot_create")` | `shell_snapshot_create` | (success, no reason) |
| Snapshot promise rejects | `recordSpanFailure("shell_snapshot_create", "snapshot_failed")` | `shell_snapshot_create` | `"snapshot_failed"` |
| First missing-at-exec detection in a session | `recordSpanFailure("shell_snapshot_create", "snapshot_missing_at_exec")` | `shell_snapshot_create` | `"snapshot_missing_at_exec"` |

Notes:

- The `.then` records success even when `ip7` resolves to `undefined` (an internal-failure-reduced-to-undefined). This is a known imprecision — see [implementation.md](./implementation.md) Section 8.
- All three are children of the session's root OTEL trace and are observable by anyone running their own OTLP collector (`OTEL_EXPORTER_OTLP_ENDPOINT`).
- v2.1.112 only had `.catch(reason="snapshot_failed")` — the success span and the missing-at-exec failure span are both v2.1.142 additions.

### 4.1 Reasoning chain

```
session start
   ↓
createBashShellProvider() called
   ↓
ip7(shellPath) returns a Promise (eager, not awaited)
   ↓
[time passes; other startup work]
   ↓
ip7 settles:
   ↓                        ↓
path returned            promise rejected (unexpected)
   ↓                        ↓
recordSpanSuccess        recordSpanFailure
("shell_snapshot_create")  ("shell_snapshot_create", "snapshot_failed")

[first Bash tool call later]
   ↓
buildExecCommand awaits the settled snapshotPromise
   ↓
file existence probe (fs.access)
   ↓                        ↓
exists                   missing
   ↓                        ↓
(no span)                if !missingTelemetryFired:
                            missingTelemetryFired = true
                            recordSpanFailure
                            ("shell_snapshot_create", "snapshot_missing_at_exec")
```

---

## 5. Tengu Analytics Events

`logEvent` (`d`) emits three distinct events for snapshot-creation outcomes — each shape is documented in [snapshot_creation.md](./snapshot_creation.md) Section 1, but consolidated here for the observability angle:

| Event name | Trigger | Payload |
|------------|---------|---------|
| `tengu_shell_snapshot_failed` | `execFile` callback received an error | `{stderr_length, has_error_code, error_signal_number, error_killed}` |
| `tengu_shell_unknown_error` | `execFile` succeeded but `stat(snapshotPath).size` failed | `{}` (empty) |
| `tengu_shell_snapshot_error` | Synchronous throw in the outer try | `{}` (empty) |

The three-way split lets Anthropic's pipeline distinguish:
- "user's `.bashrc` is broken" (`tengu_shell_snapshot_failed` with `has_error_code: true`)
- "snapshot was killed" (`tengu_shell_snapshot_failed` with `error_killed: true`, `error_signal_number: 15` for SIGTERM)
- "rare race with FS state" (`tengu_shell_unknown_error`)
- "our setup logic threw" (`tengu_shell_snapshot_error`)

No payload contains any user content, file paths, or hostnames — only structured numerics and booleans. This was a deliberate privacy choice: the events are useful for tracking aggregate failure rates without ever leaking what's in `~/.bashrc`.

---

## 6. End-to-End Observability Matrix

The same snapshot-creation event surfaces across multiple observability planes. This matrix shows what each plane records for each lifecycle outcome:

| Outcome | Debug log (`N`) | OTEL span | Tengu event | User UI |
|---------|----------------|-----------|-------------|---------|
| Snapshot created successfully | "Shell snapshot created successfully (N bytes)" | `shell_snapshot_create` success | (none) | (none) |
| Bash tool skips `-l` | "Spawning shell without login (-l flag skipped)" | (none) | (none) | (none) |
| Missing config file | "Shell config file not found: ...; creating snapshot with Claude Code defaults only" | (none — still succeeds) | (none — still succeeds) | (none) |
| execFile error (timeout / non-zero) | Multi-line failure dump + stderr | `shell_snapshot_create` failure (`snapshot_failed`) | `tengu_shell_snapshot_failed` with payload | (none) |
| File missing after creation | "Shell snapshot file not found after creation: ..." + dir-listing | `shell_snapshot_create` success (!) | `tengu_shell_unknown_error` | (none) |
| Synchronous throw in setup | "Unexpected error during snapshot creation: ..." + stack | `shell_snapshot_create` failure (`snapshot_failed`) | `tengu_shell_snapshot_error` | (none) |
| File missing at first Bash call | "Snapshot file missing, falling back to login shell: ..." | `shell_snapshot_create` failure (`snapshot_missing_at_exec`) — one-shot per session | (none) | (none) |
| Retention sweep deleted N files | (from `Rr` / `Xd`) | (none) | (none) | (none) |
| `claude project purge` invoked | (none specific) | `cli_purge_project` span | `tengu_*` (purge events) | **Yellow warning to stderr** "shell-snapshots/ are not project-scoped and will not be touched" |

Note the asymmetry on row 5: "execFile succeeded but file is missing" records an OTEL **success** but a Tengu **error**. The reason is that the `.then` chain on `createBashShellProvider`'s `snapshotPromise` runs regardless of the resolved value (path vs undefined), so the success span fires either way. This is a known imprecision — operators correlating OTEL traces with Tengu events should be aware that a success span can coexist with a `tengu_shell_unknown_error` event from the same lifecycle.

---

## 7. Why the Imprecision Is Acceptable

A more accurate observability design would:

- Record OTEL span failure when `ip7` resolves to `undefined` (regardless of whether it threw).
- Differentiate the three Tengu events into spans with distinct `reason` fields.

The current design accepts the imprecision because:

1. The **aggregate failure rate** is what matters for product health; the exact failure-shape distribution is in the Tengu events.
2. OTEL spans are primarily used by **end users** running their own collectors (per the v2.1.x privacy posture) — they care about "did snapshot creation work?" more than "exactly which failure path was hit".
3. The `missing_at_exec` reason is the one that distinguishes "creation failed" from "creation worked, then file vanished", and it does get its own reason field — that's the operationally important split.
4. Refining further would require either splitting `shell_snapshot_create` into multiple span names (breaking dashboards) or threading more state through the closure (complexity).

The result: end users see snapshots as a transparent optimisation, Anthropic operators see structured aggregate metrics, and the OTEL surface is honest about high-level outcomes without committing to fine-grained taxonomy.

---

## 8. Decision Summary

| Decision | Choice | Why |
|----------|--------|-----|
| End-user UI surface | None except `claude project purge` warning | Snapshots are an internal optimisation; surfacing them adds confusion without enabling any user action |
| Doctor screen integration | None | The fallback (login shell) is graceful; snapshot absence is not a user-actionable diagnostic |
| Debug-log detail | Full script dump + dir-listing on failure | Support reproducibility outweighs log volume |
| OTEL span granularity | Single name (`shell_snapshot_create`), success/failure with reason | Trade off between dashboard stability and fine-grained taxonomy |
| Tengu event granularity | Three event names by failure shape | Differentiates user-config errors from logic errors from races without payload content |
| Privacy in telemetry payloads | Booleans + numbers only; no paths, hostnames, stderr content | Aggregate signal without leaking user-config secrets |
| `purge` warning style | Yellow stderr line per directory carve-out | Stands out from the items list (white stdout) without aborting the flow |
| Missing-at-exec telemetry | One-shot per session | Avoid flooding when the file is unlinked mid-session and 50 commands follow |
