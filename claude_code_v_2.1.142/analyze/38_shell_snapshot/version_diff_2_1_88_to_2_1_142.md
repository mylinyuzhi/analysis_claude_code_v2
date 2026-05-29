# Shell Snapshot — v2.1.88 → v2.1.142 Behavioural Diff

> Compact, code-anchored diff of the shell-snapshot module across the two reference points: the readable v2.1.88 TypeScript source (`/lyz/codespace/3rd/claude-code/src/`) and the v2.1.142 obfuscated bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`). Symbol-by-symbol audit lives in [cross_validation.md](./cross_validation.md); this file is the architectural-shift summary.

---

## Map at a Glance

| # | Shift | v2.1.88 | v2.1.142 | Introduced in |
|---|-------|---------|----------|---------------|
| 1 | argv0 dispatch — binary resolution | Baked `process.execPath` at snapshot generation | Runtime env var (`CLAUDE_CODE_EXECPATH`) → baked install path (`~/.local/bin/claude`) → `command` fallback | v2.1.121 |
| 2 | grep wrapper — flag dispatch | Always routes through ugrep | New deny-pattern allowlist hands ugrep-only flags back to system grep | v2.1.142 |
| 3 | Embedded-tools gate | `EMBEDDED_SEARCH_TOOLS=1` + non-SDK | Always-on + non-SDK (env var removed) | v2.1.121 |
| 4 | `CLAUDE_CODE_SESSION_ID` injection | Only when `USER_TYPE === 'ant'` | Unconditional | v2.1.132 |
| 5 | `AI_AGENT` env var | Not present | Always `"agent"` | v2.1.120 |
| 6 | `OTEL_*` env var scrub | 4 header keys, GHA-mode only | All `OTEL_*` keys, always | v2.1.128 |
| 7 | Background-session env scrub | Not present | 10 keys (auth + orchestration) | v2.1.132 |
| 8 | OTEL spans on snapshot creation | None | `shell_snapshot_create` success / failure with reason | v2.1.142 |
| 9 | One-shot missing-at-exec telemetry | Per-command debug log | One-shot OTEL span per session | v2.1.142 |
| 10 | Retention sweep for `shell-snapshots/` | None | `cleanupShellSnapshots` part of daily `cleanupPeriodDays` sweep | v2.1.117 |
| 11 | `CLAUDE_CODE_SHELL_PREFIX` wrap | Not present | Optional outer wrap via `applyShellPrefix` | (mid-window) |
| 12 | `CLAUDE_CODE_REMOTE` BUN_OPTIONS export | Not present | `export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"` injected | (mid-window) |
| 13 | PATH heredoc | `echo "export PATH=..."` line | Heredoc with random sentinel `PATH_END_<rand16>` | v2.1.13x |
| 14 | Plugin bin paths | Not in snapshot PATH | Prepended via `getPluginBinPaths()` (`bM6`) | v2.1.140 |
| 15 | Cygwin PATH on Windows | Not read | `execa('echo $PATH', { shell: true })` to read mintty PATH | v2.1.13x |
| 16 | `pwd -P` capture | Always | Always (unchanged) | — |
| 17 | `unalias find/grep` before shadows | Present | Present (unchanged) | — |
| 18 | bfs `-regextype findutils-default` | Present | Present (unchanged) | — |
| 19 | ugrep `-G --ignore-files --hidden -I` | Present | Present (unchanged) | — |
| 20 | `< /dev/null` on `source <config>` | Present | Present (unchanged) | — |

Rows 16-20 are not changes — they are the load-bearing invariants that **didn't** move.

---

## 1. Argv0 Dispatch — Binary Path Resolution

The most architecturally significant change. See [argv0_dispatch.md](./argv0_dispatch.md) for the full deep dive.

### v2.1.88 (ShellSnapshot.ts:35-59)

```typescript
function createArgv0ShellFunction(
  funcName: string,
  argv0: string,
  binaryPath: string,            // ← path passed in by caller
  prependArgs: string[] = [],
): string {
  const quotedPath = quote([binaryPath])
  ...
  return [
    `function ${funcName} {`,
    `  if [[ -n $ZSH_VERSION ]]; then`,
    `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
    ...
  ].join('\n')
}
```

Caller passes `process.execPath` (the currently-running bun binary):

```typescript
const binaryPath = embeddedSearchToolsBinaryPath()  // = process.execPath
return [
  createArgv0ShellFunction('find', 'bfs', binaryPath, [...]),
  createArgv0ShellFunction('grep', 'ugrep', binaryPath, [...]),
].join('\n')
```

**Snapshot embeds the literal execPath at generation time.** If the binary moves or is deleted, the function fails.

### v2.1.142 (cli_inner_pretty.js:360476-360508)

```javascript
function Iv6(H, $, q = [], K = []) {                      // 4 args now
  ...
  let z = vX$.join(ne(), A ? "claude.exe" : "claude"),    // baked install path
      Y = A ? MP(z) : z;
  ...
  return [
    `function ${H} {`,
    ...denyDispatch,                                       // NEW: deny patterns
    `  local _cc_bin="\${${Rv6}:-}"`,                      // ${CLAUDE_CODE_EXECPATH:-}
    `  [[ -x $_cc_bin ]] || _cc_bin=${W4([Y])}`,           // fall back to baked
    `  if [[ ! -x $_cc_bin ]]; then command ${H} "$@"; return; fi`,
    ...
  ].join('\n')
}
```

The signature dropped `binaryPath` and added `denyPatterns`. The function body now resolves the binary path **at invocation time** through three tiers:

1. `${CLAUDE_CODE_EXECPATH}` — set by `getEnvironmentOverrides` (`$U7`) to `process.execPath` on every Bash spawn
2. Baked install path — `vX$.join(ne(), "claude")` where `ne()` returns `~/.local/bin`
3. `command find "$@"` / `command grep "$@"` — fall through to system tool if claude binary isn't found

**Implication:** snapshots written by yesterday's claude binary keep working after `npm i -g @anthropic-ai/claude-code@latest` — the env var picks up today's binary, and the baked install path is the canonical location.

---

## 2. Grep Wrapper — Deny-Pattern Allowlist (v2.1.142-only)

### v2.1.88 (ShellSnapshot.ts:171-177)

```typescript
createArgv0ShellFunction('grep', 'ugrep', binaryPath, [
  '-G', '--ignore-files', '--hidden', '-I',
  ...VCS_DIRECTORIES_TO_EXCLUDE.map(d => `--exclude-dir=${d}`),
])
```

Every `grep` call goes through ugrep. ugrep-specific flags like `--filter`, `--pager`, `--view` produce confusing errors because the shadow doesn't expose them transparently.

### v2.1.142 (cli_inner_pretty.js:360522-360527)

```javascript
Iv6(
  "grep",
  "ugrep",
  ["-G", "--ignore-files", "--hidden", "-I", ..._i_.map((H) => `--exclude-dir=${H}`)],
  ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"],
)
```

The new 4th arg emits a `case` block at the top of the generated function:

```bash
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in
      -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*)
        command grep "$@"; return ;;
    esac
  done
  ...
}
```

If any user arg matches a deny pattern, the wrapper falls through to **system `grep`** instead of routing to ugrep.

**Implication:** users invoking GNU-grep-specific features through what they think is `grep` get the system tool. The wrapper stops trying to be ugrep-everywhere.

---

## 3. Embedded-Tools Gate

### v2.1.88 (embeddedTools.ts:15-21)

```typescript
export function hasEmbeddedSearchTools(): boolean {
  if (!isEnvTruthy(process.env.EMBEDDED_SEARCH_TOOLS)) return false
  const e = process.env.CLAUDE_CODE_ENTRYPOINT
  return e !== 'sdk-ts' && e !== 'sdk-py' && e !== 'sdk-cli' && e !== 'local-agent'
}
```

Two-condition gate: build-time env var **and** non-SDK entrypoint.

### v2.1.142 (cli_inner_pretty.js:141600-141604)

```javascript
function dM() {
  if (!bH("true")) return !1;     // literal "true" → bH always returns true
  let H = process.env.CLAUDE_CODE_ENTRYPOINT;
  return H !== "sdk-ts" && H !== "sdk-py" && H !== "sdk-cli" && H !== "local-agent";
}
```

The `bH("true")` literal is a build-time-replaced constant. The original `bH(process.env.EMBEDDED_SEARCH_TOOLS)` got swapped for `bH("true")` by the build pipeline. Net: the env-var gate is gone; only the SDK-entrypoint gate remains.

**Implication:** users on native macOS/Linux builds cannot disable embedded search tools by unsetting the env var. The only escape hatch is running under one of the SDK entrypoints (`CLAUDE_CODE_ENTRYPOINT=sdk-cli` etc.).

---

## 4. Session-Identification Env Vars

### v2.1.88 (Shell.ts:316-328)

```typescript
const childProcess = spawn(spawnBinary, shellArgs, {
  env: {
    ...subprocessEnv(),
    SHELL: shellType === 'bash' ? binShell : undefined,
    GIT_EDITOR: 'true',
    CLAUDECODE: '1',
    ...envOverrides,
    ...(process.env.USER_TYPE === 'ant'
      ? { CLAUDE_CODE_SESSION_ID: getSessionId() }      // ant-only
      : {}),
  },
  ...
})
```

`AI_AGENT` doesn't exist. `CLAUDE_CODE_SESSION_ID` is **gated on `USER_TYPE === 'ant'`** — external users never saw it.

### v2.1.142 (cli_inner_pretty.js:361221-361232)

```javascript
let F = YU7.spawn(E, I, {
  env: {
    ...XI(),
    SHELL: q === "bash" ? G : void 0,
    GIT_EDITOR: "true",
    CLAUDECODE: "1",
    AI_AGENT: CT8("agent"),               // NEW: always present
    CLAUDE_CODE_SESSION_ID: v$(),          // NEW: unconditional
    ...h,
    ...w,
    ...(x && { TRACEPARENT: x }),
  },
  ...
});
```

Both `AI_AGENT` and `CLAUDE_CODE_SESSION_ID` are now unconditional. External users (npm-install or native builds) get both.

**Implication:** any script invoked through Bash tool can rely on `$CLAUDE_CODE_SESSION_ID` to correlate with the session — useful for hooks, telemetry scripts, and audit logging.

---

## 5. OTEL & Background-Session Env Scrub

### v2.1.88 (subprocessEnv.ts:15-53)

```typescript
const GHA_SUBPROCESS_SCRUB = [
  // ...
  'OTEL_EXPORTER_OTLP_HEADERS',
  'OTEL_EXPORTER_OTLP_LOGS_HEADERS',
  'OTEL_EXPORTER_OTLP_METRICS_HEADERS',
  'OTEL_EXPORTER_OTLP_TRACES_HEADERS',
  // ...
] as const

export function subprocessEnv(): NodeJS.ProcessEnv {
  // ...
  if (!isEnvTruthy(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) {
    return /* unscrubbed */
  }
  const env = { ...process.env, ...proxyEnv }
  for (const k of GHA_SUBPROCESS_SCRUB) {
    delete env[k]
    delete env[`INPUT_${k}`]
  }
  return env
}
```

OTEL stripping is **only** active in GHA-scrub mode (controlled by `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`). Only the four `*_HEADERS` keys are scrubbed.

### v2.1.142 (cli_inner_pretty.js:197531-197566)

Two changes:

```javascript
function XI() {
  let H = lt$(), ...;
  let f = /* base env build */;
  // (1) Unconditional OTEL_* strip — NEW v2.1.128
  for (let O of Object.keys(f)) {
    if (O.startsWith("OTEL_")) delete f[O];
  }
  // (2) Background-session keys — NEW v2.1.132
  if (A) {
    delete f.CLAUDE_CODE_OAUTH_TOKEN;
    delete f.CLAUDE_CODE_SUBSCRIPTION_TYPE;
    delete f.CLAUDE_CODE_RATE_LIMIT_TIER;
    delete f.CLAUDE_BG_AUTH_SNAPSHOT_PATH;
  }
  if (z) {
    delete f.CLAUDE_CODE_SESSION_KIND;
    delete f.CLAUDE_BG_SOURCE;
    delete f.CLAUDE_BG_ISOLATION;
    delete f.CLAUDE_BG_BACKEND;
    delete f.CLAUDE_CODE_SESSION_NAME;
    delete f.CLAUDE_CODE_RESUME_INTERRUPTED_TURN;
  }
  ...
}
```

OTEL stripping became unconditional and broadened to **all** `OTEL_*` keys (not just header keys). Background-session env vars are stripped to isolate child processes from parent's BG-session orchestration state. The `GHA_SUBPROCESS_SCRUB` list itself shrank because the OTEL header keys are now covered by the general strip.

**Implication:** users' `.bashrc` cannot inherit Claude Code's OTEL endpoint/headers and accidentally export their own application traces to the wrong collector.

---

## 6. OTEL Spans & One-Shot Telemetry (v2.1.142-only)

### v2.1.88 (bashProvider.ts:63-68, 93-102)

```typescript
const snapshotPromise: Promise<string | undefined> = options?.skipSnapshot
  ? Promise.resolve(undefined)
  : createAndSaveSnapshot(shellPath).catch(error => {
      logForDebugging(`Failed to create shell snapshot: ${error}`)
      return undefined
    })

// In buildExecCommand:
if (snapshotFilePath) {
  try {
    await access(snapshotFilePath)
  } catch {
    logForDebugging(
      `Snapshot file missing, falling back to login shell: ${snapshotFilePath}`,
    )
    snapshotFilePath = undefined
  }
}
```

No OTEL spans. The missing-file warning fires on **every** Bash tool call after the file vanishes — potential log noise.

### v2.1.142 (cli_inner_pretty.js:360867-360894)

```javascript
let q,
  K = $?.skipSnapshot
    ? Promise.resolve(void 0)
    : ip7(H)
        .then((z) => { return (RH("shell_snapshot_create"), z); })   // OTEL success
        .catch((z) => {
          N(`Failed to create shell snapshot: ${z}`);
          J8("shell_snapshot_create", "snapshot_failed");             // OTEL failure
          return;
        }),
  _,
  A = !1;                                                              // one-shot flag

// In buildExecCommand:
if (f) {
  try { await ep7.access(f); }
  catch {
    if ((N(`Snapshot file missing, falling back to login shell: ${f}`), !A))
      ((A = !0), J8("shell_snapshot_create", "snapshot_missing_at_exec"));
    f = void 0;
  }
}
```

Two adds:

1. **OTEL spans** — `recordSpanSuccess`/`recordSpanFailure` on the create-time outcome, observable by anyone running an OTLP collector.
2. **`missingTelemetryFired` one-shot flag** — the missing-at-exec OTEL failure fires once per session. The debug log still writes every time, but the OTEL surface stays clean.

**Implication:** snapshot creation became observable in OTEL dashboards. The reason fields (`snapshot_failed` / `snapshot_missing_at_exec`) distinguish creation vs runtime failures.

---

## 7. Retention Sweep for `shell-snapshots/` (v2.1.142-only)

### v2.1.88

```typescript
// In startBackgroundHousekeeping (backgroundHousekeeping.ts):
// ...nothing that touches shell-snapshots/...
```

The only cleanup mechanism is the in-session graceful-shutdown unlink registered by `registerCleanup` in `createAndSaveSnapshot`. Sessions that crash without graceful shutdown leak `.sh` files forever.

### v2.1.142 (cli_inner_pretty.js:555525-555527, aB4 orchestrator at 555633+)

```javascript
function al5() {
  return Rr(XA.join(b8(), "shell-snapshots"), ".sh");
}
// Called from aB4() orchestrator alongside other per-directory sweeps:
//   tasks/, backups/, debug/, file-history/, etc.
```

`Rr` is the shared "walk dir, delete files older than `cleanupPeriodDays` (default 30)". Now applied to `shell-snapshots/`.

**Implication:** crashed-session snapshot leftovers get cleaned up automatically on the next session that triggers the sweep.

---

## 8. Smaller v2.1.142-only Touches

### 8.1 `CLAUDE_CODE_SHELL_PREFIX` wrap

```javascript
// In buildExecCommand:
if (process.env.CLAUDE_CODE_SHELL_PREFIX) {
  G = nY8(process.env.CLAUDE_CODE_SHELL_PREFIX, G);    // applyShellPrefix
}
```

`nY8` parses the prefix (looks for last `-` flag) and inserts the assembled commandString before the trailing options. v2.1.88 has no equivalent.

Used to wrap the entire `source && ... && eval ...` chain in an outer shell like `firejail --quiet --net=none --` or `nice -n 19`.

### 8.2 `CLAUDE_CODE_REMOTE` BUN_OPTIONS export

```javascript
if (bH(process.env.CLAUDE_CODE_REMOTE))
  P.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
```

When Claude Code is running in remote (background-agent) mode, child Bun processes use the `--smol` GC flag for lower memory pressure. v2.1.88 has no equivalent.

### 8.3 PATH heredoc sentinel

v2.1.88 writes the PATH export with a single `echo` line:

```bash
echo "export PATH=${quotedPath}" >> "$SNAPSHOT_FILE"
```

v2.1.142 uses a heredoc with a random sentinel:

```javascript
let Y = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
_ += `
  cat >> "$SNAPSHOT_FILE" << '${Y}'
export PATH=${W4([$ || ""])}
${Y}`;
```

**Reason:** if the PATH contains the literal substring `PATH_END_` (unlikely but possible), the heredoc would terminate early. Randomising the sentinel guarantees a unique terminator.

### 8.4 Plugin bin paths in PATH

v2.1.142 (cli_inner_pretty.js:360603-360607):

```javascript
let q = await bM6();                       // getPluginBinPaths
if (q.length > 0) {
  let f = c$() === "windows" ? q.map(MP) : q;
  $ = [$, ...f].filter(Boolean).join(":");  // prepend to PATH
}
```

Plugin `bin/` directories get joined into the snapshot's exported PATH. v2.1.88 has no plugin system at this layer.

### 8.5 Cygwin PATH on Windows

v2.1.142 (cli_inner_pretty.js:360599-360602):

```javascript
if (c$() === "windows") {
  let f = await tX(H, ["-lc", 'echo "$PATH"'], { reject: !1, timeout: hv6 });
  if (f.exitCode === 0 && f.stdout) $ = f.stdout.trim();
}
```

On Windows, Git Bash uses a different PATH than `process.env.PATH` (cygwin-mounted POSIX paths). v2.1.142 reads the cygwin PATH by spawning the actual shell. v2.1.88 has the equivalent (`execa('echo $PATH', { shell: true })`), so this is **unchanged** — both versions handle it correctly.

---

## 9. The Things That Didn't Change

Equally important — these load-bearing properties are identical across both versions:

- **`< /dev/null` on `source <config>`** — prevents user `read` prompts in `.bashrc`/`.zshrc` from hanging snapshot creation
- **`>|` (clobber)** for the file-clear step — works under user's `noclobber` setting
- **`unalias -a 2>/dev/null || true`** as the first executable line in the snapshot — avoids alias-baked-into-function-body issues
- **Bash function dump via base64** (`declare -F | grep -vE '^_[^_]' | declare -f | base64 -d`) — preserves special characters
- **Zsh `typeset +f`** to autoload + dump — matches zsh's stricter quoting semantics
- **Completion-function filter** `grep -vE '^_[^_]'` — drops single-underscore completion handlers while keeping double-underscore helpers
- **1000-line caps** on shopt/setopt/aliases output
- **Snapshot path format** `snapshot-{shell}-{timestamp}-{rand6}.sh`
- **10-second timeout** (`SNAPSHOT_CREATION_TIMEOUT = 10000`)
- **1 MB stdout buffer** in `execFile`
- **3-event telemetry split**: `tengu_shell_snapshot_failed` (execFile error), `tengu_shell_unknown_error` (file missing post-success), `tengu_shell_snapshot_error` (sync throw)
- **`-l` flag skipped** when snapshot path is non-null in `getSpawnArgs`
- **`SHELL` / `GIT_EDITOR=true` / `CLAUDECODE=1`** during snapshot creation
- **`CLAUDE_CODE_DONT_INHERIT_ENV`** escape hatch for reproducible CI envs

These invariants form the **contract** between snapshot creator and consumer — the diff happens at the layers above.

---

## 10. Implication Summary

| Concern | v2.1.88 → v2.1.142 effect |
|---------|--------------------------|
| Binary-upgrade resilience | Snapshots survive `npm i -g @anthropic-ai/claude-code@latest`; v2.1.88 snapshots break on path change |
| ugrep flag surprises | v2.1.142 transparently routes ugrep-only flags back to system grep |
| Search-tool availability | v2.1.142 always-on on native builds; v2.1.88 needed `EMBEDDED_SEARCH_TOOLS=1` |
| Session correlation in Bash subprocess | v2.1.142 always exposes `CLAUDE_CODE_SESSION_ID`; v2.1.88 only for ant builds |
| Operator dashboards (OTEL) | v2.1.142 has `shell_snapshot_create` spans; v2.1.88 has none |
| Privacy in subprocess env | v2.1.142 strips all `OTEL_*` always; v2.1.88 strips 4 keys only in GHA mode |
| BG-session env isolation | v2.1.142 strips 10 keys; v2.1.88 had none of them yet |
| Crashed-session snapshot leaks | v2.1.142 retention sweep cleans up; v2.1.88 leaks forever |
| Sandboxed / remote scenarios | v2.1.142 wraps via `CLAUDE_CODE_SHELL_PREFIX` and exports BUN_OPTIONS for remote |
| Plugin tooling availability in shell | v2.1.142 prepends plugin `bin/` to PATH; v2.1.88 doesn't |
| Per-command observability noise | v2.1.142 one-shot OTEL on missing snapshot; v2.1.88 logged every call |

---

## 11. Where the Code Actually Lives

| Concern | v2.1.88 file | v2.1.142 location |
|---------|-------------|-------------------|
| Snapshot creation orchestrator | `src/utils/bash/ShellSnapshot.ts:413` | `cli_inner_pretty.js:360697` |
| Snapshot script assembler | `src/utils/bash/ShellSnapshot.ts:345` | `cli_inner_pretty.js:360661` |
| Argv0 dispatch generator | `src/utils/bash/ShellSnapshot.ts:35` | `cli_inner_pretty.js:360476` |
| Bash provider factory | `src/utils/shell/bashProvider.ts:58` | `cli_inner_pretty.js:360867` |
| Spawn env construction | `src/utils/Shell.ts:316` | `cli_inner_pretty.js:361221` |
| Subprocess env scrub | `src/utils/subprocessEnv.ts:79` | `cli_inner_pretty.js:197531` |
| Embedded-tools gate | `src/utils/embeddedTools.ts:15` | `cli_inner_pretty.js:141600` |
| Retention sweep | _(absent)_ | `cli_inner_pretty.js:555525` |
| Purge-command warning | _(absent — no purge command in 2.1.88)_ | `cli_inner_pretty.js:604631, 604659` |

---

## 12. Confidence

| Area | Basis |
|------|-------|
| Snapshot script template | Side-by-side template comparison — identical SNAPSHOT_FILE prelude, source-config redirect, unalias-a write, user/code content order, exit-1 trailer. PATH heredoc sentinel pattern matches in shape. |
| Argv0 dispatch generator | Branch-by-branch diff — same zsh/msys/bashpid-not-pid/else fallback chain in both. Only the dispatch flow and binary resolution changed. |
| Bash provider shape | Identical `{ type, shellPath, detached, buildExecCommand, getSpawnArgs, getEnvironmentOverrides }` object shape. |
| Subprocess env scrub | Identical fast-path / slow-path / GHA-list structure; documented v2.1.128 OTEL change is clearly visible as an unconditional `for (...) if (key.startsWith("OTEL_")) delete`. |
| Spawn env keys | Direct quote of both files; `AI_AGENT` and `CLAUDE_CODE_SESSION_ID` clearly added unconditionally in 2.1.142 vs 2.1.88's USER_TYPE === 'ant' gate. |
| Retention sweep | `al5` and `aB4` orchestrator in v2.1.142 have no equivalent in v2.1.88's `backgroundHousekeeping.ts` (which only schedules npm-cache and version cleanup). |

All claims in this diff are anchored to specific files and line numbers in both versions. The companion [cross_validation.md](./cross_validation.md) lists every individual symbol mapping with its file:line in both bundles.
