# Cross-Platform Comparison: Shell Snapshot & Stateful Bash (Claude Code 2.1.76)

> Three-way comparison of shell snapshot, CWD tracking, command assembly, and background task management across Claude Code (JS), cocode-rs, and codex-rs.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [implementation.md](./implementation.md) - Claude Code snapshot implementation details

Key functions referenced in this document:
- `createBashExecutor` (o54) — Shell executor factory — chunks.89.mjs:1309
- `createSnapshot` (RN8) — Async snapshot creation — chunks.89.mjs:1180
- `generateSnapshotScript` (Ix9) — Snapshot script builder — chunks.89.mjs:1145
- `setCwd` (VO) — CWD update after command — chunks.89.mjs:1586
- `setCwdState` (Xt6) — Global CWD state setter — chunks.1.mjs:2374
- `ProcessHandler` (j38) — Shell process lifecycle — chunks.42.mjs:195

---

## 1. Shell Snapshot（Environment Snapshot）

### 1.1 Claude Code (JS)

**Core files**: `chunks.89.mjs` (Ix9 generates script, RN8 creates snapshot, o54 builds executor)

| Aspect | Details |
|--------|---------|
| **Trigger** | `RN8(shellPath)` at session init (via `o54`) |
| **Captured** | functions (**base64-encoded per-function**), shell options, aliases, exports (excl PWD/OLDPWD), **PATH**, **rg fallback**, **find/grep shadow** |
| **Shells** | zsh, bash, sh, PowerShell |
| **Storage** | `~/.claude/shell-snapshots/snapshot-{shell}-{timestamp}-{random}.sh` |
| **Async** | Promise-based; commands `await` snapshot completion |
| **Usage** | `buildExecCommand()`: `source {snapshotPath}` as command prefix |
| **Validation** | File size check (`stat().size`), no source-validation |
| **Cleanup** | `onExit()` handler calls `unlink()` |
| **Unique** | base64 function encoding, rg/find/grep injection, auto-rebuild on missing, extglob disable |
| **Telemetry** | `tengu_shell_snapshot_failed`, `tengu_shell_snapshot_error` |
| **Constants** | timeout=10s, maxBuffer=1MB |

### 1.2 cocode-rs

**Core files**: `cocode-rs/exec/shell/src/snapshot/` (shell_snapshot.rs, scripts.rs, cleanup.rs)

| Aspect | Details |
|--------|---------|
| **Trigger** | `ShellExecutor::start_snapshotting(cocode_home, session_id)` |
| **Captured** | functions (`declare -f` bulk), shell options, aliases, exports (excl PWD/OLDPWD) |
| **Storage** | `~/.cocode/shell_snapshots/{session_id}.sh` |
| **Async** | `watch::channel<Option<Arc<ShellSnapshot>>>` via tokio task |
| **Usage** | `maybe_wrap_shell_lc_with_snapshot()`: rewrites `shell -lc script` → `shell -c ". SNAPSHOT && script"` |
| **Validation** | `validate_snapshot()` — sources file to verify |
| **Cleanup** | `cleanup_stale_snapshots()` 7-day retention + Drop trait auto-delete |
| **Constants** | timeout=10s, retention=7d |

### 1.3 codex-rs

**Core files**: `codex-rs/core/src/shell_snapshot.rs`, `codex-rs/core/src/tools/runtimes/mod.rs`

| Aspect | Details |
|--------|---------|
| **Trigger** | `ShellSnapshot::start_snapshotting(codex_home, session_id, session_cwd, shell, telemetry)` |
| **Captured** | functions (`declare -f` bulk), shell options, aliases, exports (excl PWD/OLDPWD) |
| **Storage** | `~/.codex/shell_snapshots/{session_id}.{nonce}.sh` (nonce prevents collision) |
| **Async** | `watch::channel<Option<Arc<ShellSnapshot>>>` |
| **Usage** | `maybe_wrap_shell_lc_with_snapshot()` + env override capture/restore |
| **Validation** | `validate_snapshot()` — sources file |
| **Cleanup** | `cleanup_stale_snapshots()` 3-day retention + Drop delete |
| **Unique** | `refresh_snapshot()`, `SessionTelemetry` integration, `ShellSnapshot.cwd` field + CWD match check, `build_override_exports()` env override protection |

### 1.4 Snapshot Differences

| Feature | Claude Code | cocode-rs | codex-rs |
|---------|------------|-----------|----------|
| Function capture | **base64 per-function** | `declare -f` bulk | `declare -f` bulk |
| rg fallback injection | **Yes** | No | No |
| find/grep shadow | **Yes** | No | No |
| extglob disable | **Yes** | No | No |
| Snapshot validation | File size check | **source validation** | **source validation** |
| Auto-rebuild on missing | **Yes** | No | No |
| Env override protection | No | env_overlay | **capture/restore** |
| CWD match check | No | No | **Yes** |
| Async mechanism | Promise | watch channel | watch channel |

---

## 2. CWD Tracking

### 2.1 Claude Code — File-Based

**Implementation**: `chunks.89.mjs` `buildExecCommand()` + `VO()` (setCwd)

```
Command build:  source snapshot && eval {command} && pwd -P >| {cwdFilePath}
                                                        ↑ writes to temp file
After command:  readFileSync(cwdFilePath) → VO(newCwd) → Xt6(cwd) updates global CWD
```

- CWD written to **separate temp file** `claude-{id}-cwd`
  - Non-sandbox: `join(tmpDir, 'claude-{id}-cwd')`
  - Sandbox: `join(sandboxTmpDir, 'cwd-{id}')`
- After success: `readFileSync(cwdFilePath).trim()` → `VO()` validates + updates
- `VO(path, fallback)`: verifies path exists → `realpathSync` → `Xt6()` sets global CWD
- **Background tasks skip CWD update**: `if (result && !preventCwdChanges && !result.backgroundTaskId)`
- Missing CWD recovery: falls back to home directory
- CWD file deleted after reading: `unlinkSync(cwdFilePath)`

### 2.2 cocode-rs — Output Marker-Based

**Implementation**: `executor.rs` `execute_with_cwd_tracking()`

```
Command wrap:  {command}; __cocode_exit=$?; echo '__COCODE_CWD_START__' "$(pwd)" '__COCODE_CWD_END__'; exit $__cocode_exit
                                                                   ↑ appended to stdout
After command: extract_cwd_from_output() → maybe_update_cwd() updates Arc<Mutex<PathBuf>>
```

- CWD markers embedded **in command output**
- `extract_cwd_from_output()` parses and cleans markers from output
- `Arc<StdMutex<PathBuf>>` maintains CWD state
- Subagent: `fork_for_subagent(initial_cwd)` does not track CWD changes

### 2.3 codex-rs — No Auto-Tracking

- `TurnContext.cwd` maintained per turn
- `resolve_path(Option<String>)` resolves tool parameter relative paths
- CWD changes require explicit `SessionConfigurationUpdate.cwd` update
- Shell tool has `workdir` parameter for model to specify directory

### 2.4 CWD Comparison

| Aspect | Claude Code | cocode-rs | codex-rs |
|--------|------------|-----------|----------|
| **Extraction method** | **File** (`pwd -P >| file`) | **Output markers** (`__COCODE_CWD_*`) | **No auto-tracking** |
| **Pros** | No stdout pollution | No temp file I/O needed | Simple |
| **Cons** | Temp file I/O overhead | Pollutes stdout, requires cleanup | Doesn't track cd changes |
| **Storage** | Global `v1.cwd` | `Arc<StdMutex<PathBuf>>` | `TurnContext.cwd` |
| **CWD recovery** | Fallback to home dir | None | None |
| **Background tasks** | Skip CWD update | N/A | N/A |

---

## 3. Execution Architecture

### 3.1 Claude Code (JS)

```
o54(shellPath) → {buildExecCommand, getSpawnArgs, getEnvironmentOverrides}
  → buildExecCommand(command, opts) → {commandString, cwdFilePath}
  → spawn(shellPath, args, {cwd, env, detached})
  → H91() → j38 instance (running → backgrounded/completed/killed)
```

- Node.js `child_process.spawn`
- `j38` class manages process lifecycle
- Login flag (`-l`) skipped when snapshot is available
- Output via `kw` TaskOutput class, large outputs spill to disk

### 3.2 cocode-rs

```
ShellExecutor.execute_with_cwd_tracking(command, timeout)
  → get_shell_args() → maybe_wrap_shell_lc_with_snapshot()
  → wrap CWD markers → tokio::process::Command
  → truncate_output(30KB) → extract_cwd → CommandResult
```

- tokio spawn, direct subprocess
- 30KB output truncation (`MAX_OUTPUT_BYTES = 30_000`)
- `BackgroundTaskRegistry` manages background tasks

### 3.3 codex-rs

```
ShellHandler → ShellRuntime.run(req, attempt, ctx)
  → maybe_wrap_shell_lc_with_snapshot() → build_command_spec()
  → execute_env() → ExecToolCallOutput
```

- `ExecProcess` trait (local/remote via WebSocket)
- 1MB output retention (`RETAINED_OUTPUT_BYTES_PER_PROCESS`)
- `ToolOrchestrator` manages approval + sandbox + retry
- `zsh_fork_backend` special execution path via shell-escalation

---

## 4. Background Tasks

| Feature | Claude Code | cocode-rs | codex-rs |
|---------|------------|-----------|----------|
| **Background transition** | Yes (`j38.background(taskId)`) | Yes (`execute_backgroundable`) | No |
| **Trigger** | Timeout → `autoBackground` callback | Ctrl+B signal | N/A |
| **Output management** | `kw` TaskOutput + spill to disk | `Arc<Mutex<String>>` 200ms sync | Process output buffer |
| **State machine** | running/backgrounded/completed/killed | Similar | Via process manager |
| **CWD on background** | Skip CWD update | No CWD tracking for background | N/A |
| **Process termination** | tree-kill (SIGKILL entire tree) | CancellationToken + kill_on_drop | terminate() via trait |

---

## 5. Command Assembly Comparison

### Claude Code
```bash
source /path/to/snapshot.sh &&     # 1. Source snapshot (shell env restoration)
shopt -u extglob 2>/dev/null &&   # 2. Disable extglob (prevent glob interference)
eval "user_command_wrapped" &&     # 3. Eval user command (with pipe handling)
pwd -P >| /tmp/claude-xxxx-cwd   # 4. Write CWD to temp file
```

### cocode-rs
```bash
# Rewritten argv: shell -c "..."
. '/path/to/snapshot.sh' >/dev/null 2>&1   # 1. Source snapshot (best effort, silent)
exec 'original_shell' -c 'user_command'    # 2. Exec command in original shell
# Appended to stdout:
; __cocode_exit=$?; echo '__COCODE_CWD_START__' "$(pwd)" '__COCODE_CWD_END__'; exit $__cocode_exit
```

### codex-rs
```bash
# Rewritten argv: user_shell -c "..."
__CODEX_SNAPSHOT_OVERRIDE_0="${VAR+x}"     # 1. Capture env override pre-values
__CODEX_SNAPSHOT_OVERRIDE_1="${VAR-}"      #    (for each explicit override var)

if . '/path/to/snapshot.sh' >/dev/null 2>&1; then :; fi  # 2. Source snapshot

if [ -n "${__CODEX_SNAPSHOT_OVERRIDE_SET_0}" ]; then     # 3. Restore overrides
  export VAR="${__CODEX_SNAPSHOT_OVERRIDE_0}";            #    (overrides take precedence
else unset VAR; fi                                         #     over snapshot values)

exec 'original_shell' -c 'user_command'                   # 4. Exec command
```

---

## 6. Summary Comparison Table

| Feature | Claude Code (JS) | cocode-rs | codex-rs |
|---------|-----------------|-----------|----------|
| **Shell env snapshot** | Yes | Yes | Yes |
| **Function capture** | base64 per-function | `declare -f` bulk | `declare -f` bulk |
| **rg/find/grep injection** | Yes | No | No |
| **extglob disable** | Yes | No | No |
| **CWD tracking method** | **File** | **Output markers** | **None (auto)** |
| **Background transition** | Yes (timeout) | Yes (Ctrl+B) | No |
| **Execution arch** | Node spawn | tokio spawn | ExecProcess trait |
| **Output limit** | Configurable | 30KB | 1MB |
| **Snapshot validation** | File size | source validation | source validation |
| **Snapshot CWD match** | No | No | Yes |
| **Env override protection** | No | env_overlay | capture/restore |
| **Snapshot rebuild** | Yes (auto) | No | No |
| **Remote execution** | No | No | Yes (WebSocket) |
| **Snapshot retention** | Cleanup on exit | 7 days | 3 days |
| **Telemetry** | tengu events | None | SessionTelemetry |
| **ZshFork backend** | No | No | Yes |

---

## 7. Key Insights

### 7.1 CWD Tracking: Three Completely Different Approaches

- **Claude Code**: File-based (`pwd -P >| file`) — most reliable, zero stdout pollution, requires temp file I/O
- **cocode-rs**: Output markers (`__COCODE_CWD_*`) — simpler, no file I/O, but pollutes stdout and requires cleanup
- **codex-rs**: No auto-tracking — relies on model passing `workdir` parameter explicitly

### 7.2 Snapshot Script Robustness: Claude Code Most Mature

- Functions captured via **base64 encoding** avoids special character issues in function bodies
- **rg fallback** injection ensures ripgrep is always available
- **find/grep shadow** functions provide enhanced search capabilities
- **Auto-rebuild** on missing snapshot file (e.g., if temp directory cleared)
- **extglob disable** prevents glob pattern expansion interfering with commands

### 7.3 Env Override Protection: codex-rs Unique

- Shell snapshots can override explicitly set environment variables
- codex-rs captures pre-snapshot values and restores them post-source
- Prevents issues like: snapshot sets `PATH=/old/path` overriding the user's updated `PATH`

### 7.4 Snapshot CWD Match: codex-rs Unique

- Snapshot is only applied when command CWD matches snapshot CWD
- Prevents worktree environment contamination across different project directories

### 7.5 Background Tasks: Different Trigger Models

- **Claude Code**: Timeout-driven — if command exceeds timeout, automatically transitions to background
- **cocode-rs**: User-driven — Ctrl+B keyboard shortcut triggers background transition
- **codex-rs**: No background transition support

### 7.6 cocode-rs Features Missing vs Claude Code

1. **base64 function encoding** — more robust special character handling in function bodies
2. **rg/find/grep shadow injection** — tool availability guarantees
3. **extglob disable** — prevents glob expansion issues
4. **Snapshot auto-rebuild** — resilience to temp file cleanup
5. **File-based CWD tracking** — cleaner than stdout markers
6. **Timeout auto-background** — automatic long-running command management

---

## Source File References

### Claude Code
| File | Content |
|------|---------|
| `chunks.89.mjs:1050-1260` | Snapshot scripts (Ix9), snapshot creation (RN8), tool injections (Cx9) |
| `chunks.89.mjs:1300-1600` | Shell executor (o54), command execution, CWD tracking (VO) |
| `chunks.42.mjs:170-310` | ProcessHandler (j38), StreamHandler (H38), factory (H91) |
| `chunks.1.mjs:2368-2376` | Global CWD state (v1.cwd, Xt6, OS) |

### cocode-rs
| File | Content |
|------|---------|
| `exec/shell/src/snapshot/shell_snapshot.rs` | ShellSnapshot struct, start_snapshotting, try_new |
| `exec/shell/src/snapshot/scripts.rs` | zsh/bash/sh/powershell snapshot scripts |
| `exec/shell/src/snapshot/cleanup.rs` | Stale snapshot cleanup |
| `exec/shell/src/executor.rs` | ShellExecutor, CWD tracking, background tasks |
| `exec/shell/src/background.rs` | BackgroundTaskRegistry, BackgroundProcess |

### codex-rs
| File | Content |
|------|---------|
| `core/src/shell_snapshot.rs` | ShellSnapshot, snapshot scripts, cleanup |
| `core/src/tools/runtimes/mod.rs` | maybe_wrap_shell_lc_with_snapshot, build_override_exports |
| `core/src/tools/runtimes/shell.rs` | ShellRuntime, ShellRequest |
| `core/src/tools/handlers/shell.rs` | ShellHandler, ShellCommandHandler |

---

## Related Documents

- [Shell Snapshot Implementation](./implementation.md) — Claude Code snapshot implementation details
- [CWD Tracking](./cwd_tracking.md) — CWD tracking mechanism deep dive
- [Command Assembly](./command_assembly.md) — Command construction flow
- [Background Tasks](./background_tasks.md) — Process lifecycle management
- [Bash Tool Analysis](../05_tools/bash_tool.md) — Bash tool permission and execution
- [Shell Parser](../29_shell_parser/) — Command security validation
