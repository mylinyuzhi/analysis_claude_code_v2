# Environment Variable Capture and Filtering (Claude Code 2.1.142)

> Subprocess env construction: how `subprocessEnv()` produces the env for every spawned child process — Bash tool, shell snapshot creation, MCP stdio servers, LSP servers, and shell hooks. v2.1.142 adds OTEL_* stripping (v2.1.128), CLAUDE_CODE_SESSION_ID injection into Bash subprocess env (v2.1.132), and an expanded background-session scrub list.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 mappings

Key functions in this document:
- `subprocessEnv` (`XI`) - Returns scrubbed env for child processes - cli_inner_pretty.js:197531
- `getUpstreamProxyEnv` (`lt$`) - Returns proxy env when registered - cli_inner_pretty.js:197528
- `registerUpstreamProxyEnvFn` (`Vs1`) - Lazy registration from init.ts - cli_inner_pretty.js:197525
- `provider.getEnvironmentOverrides` (inside `$U7`) - Per-command env overlay - cli_inner_pretty.js:360926
- `GHA_SUBPROCESS_SCRUB` (`Ts1`) - Env keys to strip - cli_inner_pretty.js:197681
- `getCurrentSessionId` (`v$`) - The session UUID used for `CLAUDE_CODE_SESSION_ID`
- `getAgentSource` (`CT8`) - The `AI_AGENT` env var value source

---

## 1. The Three-Layer Env Model

Every subprocess spawn merges three independent sources of env vars:

```
                                ┌──────────────────────────────────┐
                                │  Source 1: subprocessEnv() (XI)  │
                                │  ─────────────────────────────   │
                                │  ...process.env                  │
                                │  + proxy vars (CCR only)         │
                                │  - GHA secrets (if scrub mode)   │
                                │  - OTEL_* (always, NEW v2.1.128) │
                                │  - background-session env scrub  │
                                └──────────────────────────────────┘
                                                  │
                                                  v
                                ┌──────────────────────────────────┐
                                │  Source 2: Fixed keys            │
                                │  ─────────────────────────────   │
                                │  SHELL = bash path               │
                                │  GIT_EDITOR = "true"             │
                                │  CLAUDECODE = "1"                │
                                │  AI_AGENT = "agent"             │
                                │  CLAUDE_CODE_SESSION_ID = v$()   │
                                │  (NEW v2.1.132)                  │
                                └──────────────────────────────────┘
                                                  │
                                                  v
                                ┌──────────────────────────────────┐
                                │  Source 3: providerOverrides     │
                                │  ─────────────────────────────   │
                                │  CLAUDE_CODE_EXECPATH = node bin │
                                │  TMUX = socket reattach          │
                                │  TMPDIR/CLAUDE_CODE_TMPDIR (sbx) │
                                │  TMPPREFIX (zsh, sbx)            │
                                │  sessionEnvVars (per-tool-call)  │
                                └──────────────────────────────────┘
                                                  │
                                                  v
                                ┌──────────────────────────────────┐
                                │  Source 4: OTEL TRACEPARENT      │
                                │  ─────────────────────────────   │
                                │  Conditional: only if active     │
                                └──────────────────────────────────┘
                                                  │
                                                  v
                                          spawn(..., { env })
```

Later sources override earlier ones (`{...a, ...b}` semantics). So provider overrides can replace `SHELL` if needed, and the fixed `CLAUDECODE = "1"` always wins over any inherited `process.env.CLAUDECODE`.

---

## 2. subprocessEnv: Scrubbed Parent Env

```javascript
// ============================================
// subprocessEnv - Returns process.env with secrets and OTEL stripped
// Location: cli_inner_pretty.js:197531-197566
// ============================================

// ORIGINAL (for source lookup):
function XI() {
  let H = lt$(),
    $ = Object.keys(H).length > 0,
    q = bH(process.env.CLAUDE_CODE_REMOTE) ? DgK($ ? { ...process.env, ...H } : process.env) : {},
    K = Object.keys(q).length > 0,
    _ = Ws1(),
    A = process.env.CLAUDE_CODE_OAUTH_TOKEN !== void 0 ||
        process.env.CLAUDE_CODE_SUBSCRIPTION_TYPE !== void 0 ||
        process.env.CLAUDE_CODE_RATE_LIMIT_TIER !== void 0 ||
        process.env.CLAUDE_BG_AUTH_SNAPSHOT_PATH !== void 0,
    z = !1;
  z = process.env.CLAUDE_CODE_SESSION_KIND !== void 0 ||
      process.env.CLAUDE_BG_SOURCE !== void 0 ||
      process.env.CLAUDE_BG_ISOLATION !== void 0 ||
      process.env.CLAUDE_BG_BACKEND !== void 0 ||
      process.env.CLAUDE_CODE_SESSION_NAME !== void 0;
  let Y = Object.keys(process.env).some((O) => O.startsWith("OTEL_"));
  if (!$ && !K && !_ && !z && !A && !Y) return process.env;
  let f = { ...process.env, ...H, ...q };
  (delete f.CLAUDE_CODE_OAUTH_TOKEN,
    delete f.CLAUDE_CODE_SUBSCRIPTION_TYPE,
    delete f.CLAUDE_CODE_RATE_LIMIT_TIER,
    delete f.CLAUDE_BG_AUTH_SNAPSHOT_PATH,
    delete f.CLAUDE_CODE_SESSION_KIND,
    delete f.CLAUDE_BG_SOURCE,
    delete f.CLAUDE_BG_ISOLATION,
    delete f.CLAUDE_BG_BACKEND,
    delete f.CLAUDE_CODE_SESSION_NAME,
    delete f.CLAUDE_CODE_RESUME_INTERRUPTED_TURN);
  for (let O of Object.keys(f)) if (O.startsWith("OTEL_")) delete f[O];
  if (!_) return f;
  for (let O of Ts1) (delete f[O], delete f[`INPUT_${O}`]);
  return f;
}

// READABLE (for understanding):
function subprocessEnv() {
  const settingsEnv = getUpstreamProxyEnv();                       // lt$
  const hasSettingsEnv = Object.keys(settingsEnv).length > 0;

  // Compute proxy env only when CLAUDE_CODE_REMOTE is set
  const proxyEnv = parseExplicitTrue(process.env.CLAUDE_CODE_REMOTE)
      ? buildProxyEnv(hasSettingsEnv ? { ...process.env, ...settingsEnv } : process.env)
      : {};
  const hasProxyEnv = Object.keys(proxyEnv).length > 0;

  const shouldScrub = shouldScrubSubprocessEnv();                   // Ws1

  // Background-session auth keys (always scrubbed when present in parent env)
  const hasBgAuthKeys = process.env.CLAUDE_CODE_OAUTH_TOKEN !== undefined ||
                        process.env.CLAUDE_CODE_SUBSCRIPTION_TYPE !== undefined ||
                        process.env.CLAUDE_CODE_RATE_LIMIT_TIER !== undefined ||
                        process.env.CLAUDE_BG_AUTH_SNAPSHOT_PATH !== undefined;

  // Background-session orchestration keys (always scrubbed when present)
  const hasBgOrchestrationKeys =
      process.env.CLAUDE_CODE_SESSION_KIND !== undefined ||
      process.env.CLAUDE_BG_SOURCE !== undefined ||
      process.env.CLAUDE_BG_ISOLATION !== undefined ||
      process.env.CLAUDE_BG_BACKEND !== undefined ||
      process.env.CLAUDE_CODE_SESSION_NAME !== undefined;

  // OTEL_* keys (always scrubbed since v2.1.128)
  const hasOtelKeys = Object.keys(process.env).some((k) => k.startsWith("OTEL_"));

  // Fast path: no rebuilding needed
  if (!hasSettingsEnv && !hasProxyEnv && !shouldScrub
      && !hasBgOrchestrationKeys && !hasBgAuthKeys && !hasOtelKeys) {
    return process.env;
  }

  // Slow path: build merged env, then delete unwanted keys
  const env = { ...process.env, ...settingsEnv, ...proxyEnv };
  // Background-session keys: always scrubbed
  delete env.CLAUDE_CODE_OAUTH_TOKEN;
  delete env.CLAUDE_CODE_SUBSCRIPTION_TYPE;
  delete env.CLAUDE_CODE_RATE_LIMIT_TIER;
  delete env.CLAUDE_BG_AUTH_SNAPSHOT_PATH;
  delete env.CLAUDE_CODE_SESSION_KIND;
  delete env.CLAUDE_BG_SOURCE;
  delete env.CLAUDE_BG_ISOLATION;
  delete env.CLAUDE_BG_BACKEND;
  delete env.CLAUDE_CODE_SESSION_NAME;
  delete env.CLAUDE_CODE_RESUME_INTERRUPTED_TURN;
  // OTEL_*: always scrubbed (v2.1.128)
  for (const key of Object.keys(env)) {
    if (key.startsWith("OTEL_")) delete env[key];
  }
  if (!shouldScrub) return env;
  // GHA secrets: scrubbed only when scrub-mode is active
  for (const key of GHA_SUBPROCESS_SCRUB) {
    delete env[key];
    delete env[`INPUT_${key}`];
  }
  return env;
}

// Mapping: XI→subprocessEnv, lt$→getUpstreamProxyEnv, Ws1→shouldScrubSubprocessEnv,
//          DgK→buildProxyEnv, bH→parseExplicitTrue, Ts1→GHA_SUBPROCESS_SCRUB,
//          H→settingsEnv, q→proxyEnv, _→shouldScrub, Y→hasOtelKeys, A→hasBgAuthKeys,
//          z→hasBgOrchestrationKeys, f→env
```

### Why the multi-trigger fast-path check

The function checks **six** conditions before deciding whether to clone process.env:
1. Has settings env (from `~/.claude/settings.json` env field)
2. Has proxy env (CLAUDE_CODE_REMOTE active)
3. Should scrub (CLAUDE_CODE_SUBPROCESS_ENV_SCRUB or local-agent default)
4. Has background-session orchestration keys
5. Has background-session auth keys
6. Has any OTEL_* keys

If **none** of these triggers fire, we return `process.env` **directly** — no allocation, no copy. This optimization matters because `subprocessEnv()` is called on every Bash tool spawn, every MCP server spawn, every snapshot creation.

The slow path always rebuilds the env object via `{ ...process.env, ...settingsEnv, ...proxyEnv }`, then deletes the unwanted keys.

### v2.1.128 addition: unconditional OTEL_* stripping

```javascript
for (let O of Object.keys(f)) if (O.startsWith("OTEL_")) delete f[O];
```

This deletes any env var starting with `OTEL_` from the subprocess env. The v2.1.128 changelog says:

> Subprocesses (Bash, hooks, MCP, LSP) no longer inherit `OTEL_*` environment variables, so OTEL-instrumented apps run via the Bash tool no longer pick up the CLI's own OTLP endpoint

**Why this matters:**

If a user has OTEL exporters configured for Claude Code (e.g., `OTEL_EXPORTER_OTLP_ENDPOINT=https://collector.mycompany/`), those env vars are present in `process.env`. Without the strip:
- An OTEL-instrumented Python app run via `Bash` would inherit those vars and export its own telemetry to Claude Code's collector.
- This pollutes Claude Code's metrics with non-Claude data.
- More seriously: if the user's app has its own OTEL collector configured at runtime, inheriting the env vars would override it (since env vars have lower priority than runtime config in most OTEL SDKs, but some SDKs read env at init time).

Stripping `OTEL_*` before spawn ensures subprocess apps see no OTEL config from Claude Code — they get their own defaults or whatever they configure programmatically. The user's app behaves identically whether run via Bash tool or directly.

### Background-session env scrubbing

The eleven keys deleted in the slow path are organised into two groups:

**Auth keys (sensitive, present in some background sessions):**
- `CLAUDE_CODE_OAUTH_TOKEN` — OAuth credentials
- `CLAUDE_CODE_SUBSCRIPTION_TYPE` — Subscription tier identifier
- `CLAUDE_CODE_RATE_LIMIT_TIER` — Rate-limit tier
- `CLAUDE_BG_AUTH_SNAPSHOT_PATH` — Path to background-session auth snapshot file

**Orchestration keys (NOT sensitive, but would confuse a child Claude session):**
- `CLAUDE_CODE_SESSION_KIND` — main / background / agent
- `CLAUDE_BG_SOURCE` — How the background session was launched
- `CLAUDE_BG_ISOLATION` — Isolation level
- `CLAUDE_BG_BACKEND` — Backend used
- `CLAUDE_CODE_SESSION_NAME` — Session display name
- `CLAUDE_CODE_RESUME_INTERRUPTED_TURN` — Flag for in-progress turn resume

**Why scrub these?** When a Bash tool command spawns a new Claude session (e.g., `claude -p "summarize this"`), the inherited env would cause that child session to inherit the parent's session identity. Stripping these keys forces the child session to initialise fresh.

---

## 3. GHA Subprocess Scrub List (`Ts1`)

```javascript
// ============================================
// GHA_SUBPROCESS_SCRUB - Env keys stripped when scrub-mode is active
// Location: cli_inner_pretty.js:197681-197703
// ============================================

// ORIGINAL (for source lookup):
Ts1 = [
  "ANTHROPIC_API_KEY",
  "CLAUDE_CODE_OAUTH_TOKEN",
  "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_FOUNDRY_API_KEY",
  "ANTHROPIC_AWS_API_KEY",
  "ANTHROPIC_BEDROCK_MANTLE_API_KEY",
  "ANTHROPIC_CUSTOM_HEADERS",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_SESSION_TOKEN",
  "AWS_BEARER_TOKEN_BEDROCK",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "AZURE_CLIENT_SECRET",
  "AZURE_CLIENT_CERTIFICATE_PATH",
  "ACTIONS_ID_TOKEN_REQUEST_TOKEN",
  "ACTIONS_ID_TOKEN_REQUEST_URL",
  "ACTIONS_RUNTIME_TOKEN",
  "ACTIONS_RUNTIME_URL",
  "ALL_INPUTS",
  "OVERRIDE_GITHUB_TOKEN",
  "DEFAULT_WORKFLOW_TOKEN",
  "SSH_SIGNING_KEY",
];

// READABLE (for understanding):
const GHA_SUBPROCESS_SCRUB = [
  // Groups annotated by purpose:
  // Anthropic auth — parent process re-reads per request, subprocesses never need them
  "ANTHROPIC_API_KEY", "CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_AWS_API_KEY",
  "ANTHROPIC_BEDROCK_MANTLE_API_KEY", "ANTHROPIC_CUSTOM_HEADERS",

  // Cloud provider creds — SDKs read these lazily, subprocesses don't need them
  "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN", "AWS_BEARER_TOKEN_BEDROCK",
  "GOOGLE_APPLICATION_CREDENTIALS", "AZURE_CLIENT_SECRET",
  "AZURE_CLIENT_CERTIFICATE_PATH",

  // GitHub Actions OIDC — leaking allows minting an App installation token
  "ACTIONS_ID_TOKEN_REQUEST_TOKEN", "ACTIONS_ID_TOKEN_REQUEST_URL",

  // GitHub Actions artifact/cache API — cache poisoning → supply-chain pivot
  "ACTIONS_RUNTIME_TOKEN", "ACTIONS_RUNTIME_URL",

  // claude-code-action-specific duplicates — action JS consumes these before spawning claude
  "ALL_INPUTS",          // contains anthropic_api_key as JSON
  "OVERRIDE_GITHUB_TOKEN",
  "DEFAULT_WORKFLOW_TOKEN",
  "SSH_SIGNING_KEY",
];

// Mapping: Ts1→GHA_SUBPROCESS_SCRUB
```

**Comparison vs v2.1.112:**

The list shrunk slightly — v2.1.112's `Yn_` included four OTEL header keys (`OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_EXPORTER_OTLP_LOGS_HEADERS`, `OTEL_EXPORTER_OTLP_METRICS_HEADERS`, `OTEL_EXPORTER_OTLP_TRACES_HEADERS`). In v2.1.142, those are covered by the **unconditional OTEL_* strip**, so they're removed from this scrub list.

The threat model is unchanged: prevent prompt-injection in GitHub Actions from exfiltrating credentials via the Bash tool.

---

## 4. The Bash Tool Spawn Env

This is where the snapshot's role meets the subprocess env layer:

```javascript
// ============================================
// Bash tool exec - env construction at spawn
// Location: cli_inner_pretty.js:361221-361232
// ============================================

// ORIGINAL (for source lookup):
let F = YU7.spawn(E, I, {
    env: {
      ...XI(),
      SHELL: q === "bash" ? G : void 0,
      GIT_EDITOR: "true",
      CLAUDECODE: "1",
      AI_AGENT: CT8("agent"),
      CLAUDE_CODE_SESSION_ID: v$(),
      ...h,
      ...w,
      ...(x && { TRACEPARENT: x }),
    },
    cwd: W,
    stdio: Vi_(C, u?.fd, S),
    detached: j.detached,
    windowsHide: !0,
  }),

// READABLE (for understanding):
const childProcess = spawn(spawnBinary, shellArgs, {
  env: {
    ...subprocessEnv(),                                  // scrubbed parent env (XI)
    SHELL: shellType === "bash" ? binShell : undefined,
    GIT_EDITOR: "true",                                   // prevents `git commit` blocking
    CLAUDECODE: "1",                                      // marker for scripts
    AI_AGENT: getAiAgentTag("agent"),                     // CT8 - for gh attribution
    CLAUDE_CODE_SESSION_ID: getCurrentSessionId(),        // v$ - NEW v2.1.132
    ...providerOverrides,                                 // TMUX, TMPDIR, CLAUDE_CODE_EXECPATH
    ...sessionEnvVars,                                    // per-call overrides
    ...(otelTraceParent && { TRACEPARENT: otelTraceParent }),
  },
  cwd: trackedCwd,
  stdio: buildStdioConfig(usePipeMode, outputFd, sandboxFd),
  detached: provider.detached,
  windowsHide: true,
});

// Mapping: spawn→YU7.spawn, XI→subprocessEnv, CT8→getAiAgentTag, v$→getCurrentSessionId,
//          h→providerOverrides, w→sessionEnvVars, x→otelTraceParent
```

### v2.1.132 addition: `CLAUDE_CODE_SESSION_ID`

The v2.1.132 changelog item: "Added `CLAUDE_CODE_SESSION_ID` environment variable to the Bash tool subprocess environment, matching the `session_id` passed to hooks".

`v$()` (`getCurrentSessionId`) returns the UUID for the current Claude Code session. Every Bash tool command's subprocess sees this env var, which lets:
- Shell scripts correlate their actions with the session
- User hooks (PostToolUse, etc.) cross-reference subprocess output with the parent session
- Multi-process workflows (e.g., `claude --print` invocations from inside Bash) share session identity

**Note:** `process.env.CLAUDE_CODE_SESSION_ID` is also set by `init.ts` at startup (cli_inner_pretty.js:430416-430418), so the parent process itself sees the same value. The Bash tool spawn then re-injects it because `subprocessEnv()` strips other session-related env vars (see Section 2) — without re-injection, scripts inside Bash tool calls wouldn't see the session ID either.

The Bash tool subprocess env merge order means `CLAUDE_CODE_SESSION_ID: v$()` (Source 2) sits after `subprocessEnv()` (Source 1, which strips session keys). So the session ID is set fresh from `v$()`, regardless of whatever was inherited.

### v2.1.120 addition: `AI_AGENT`

The v2.1.120 changelog item: "Set `AI_AGENT` environment variable for subprocesses so `gh` can attribute traffic to Claude Code".

`gh` (the GitHub CLI) reads this env var to add a `User-Agent: claude-code` suffix to its HTTP requests. Other tools may follow the convention.

### `CLAUDE_CODE_EXECPATH` via `providerOverrides`

```javascript
async getEnvironmentOverrides(z, Y) {
  let f = null,
    O = {};
  if (((O[Rv6] = process.execPath), f)) O.TMUX = f;
  if (Y) for (let [M, w] of Y) O[M] = w;
  if (q) {
    let M = q;
    if (c$() === "windows") M = MP(M);
    ((O.TMPDIR = M), (O.CLAUDE_CODE_TMPDIR = M), (O.TMPPREFIX = kX$.join(M, "zsh")));
  }
  return O;
}
```

- `Rv6` = `"CLAUDE_CODE_EXECPATH"` — points subprocesses at the running Claude binary.
- `TMUX` — only set if a tmux socket was captured at startup; lets `tmux` commands inside Bash tool reattach to the user's tmux session.
- The for-loop applies caller-supplied `sessionEnvVars` (Map<string, string>).
- Sandbox env vars (`TMPDIR`, `CLAUDE_CODE_TMPDIR`, `TMPPREFIX`) are set when a sandbox tmpdir is active.

---

## 5. Snapshot-Creation Env (Special Case)

The shell snapshot is created via `execFile` (not `spawn`), but uses the same scrubbed env:

```javascript
// cli_inner_pretty.js:360716-360729
np7.execFile(H, ["-c", "-l", O], {
    env: {
        ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : XI()),
        SHELL: H,
        GIT_EDITOR: "true",
        CLAUDECODE: "1"
    },
    timeout: hv6,
    maxBuffer: 1048576,
    encoding: "utf8"
}, /* callback */)
```

**Two differences from regular Bash tool spawn:**

1. `CLAUDE_CODE_DONT_INHERIT_ENV` — if set, the snapshot shell gets a completely empty env (no inheritance, no `subprocessEnv()`). Useful for users who want absolutely deterministic snapshots regardless of their interactive shell env. Note: this only affects snapshot creation, not later Bash tool calls.

2. **No `CLAUDE_CODE_SESSION_ID` injection here.** Snapshot creation doesn't run a user script, just captures shell state. There's no need to give the snapshot-creation shell the session ID — and if the user's `.bashrc` checks for it, we want the snapshot to capture whatever the user's normal interactive shell would do.

3. No `providerOverrides`, no OTEL — snapshot creation predates provider construction, so it can't depend on its own state.

This means the snapshot script itself runs with scrubbed secrets too. Even if a user's `.bashrc` exports `ANTHROPIC_API_KEY="..."` (as some setups do), the snapshot won't see it during creation (when scrub mode is on), so the snapshot file won't contain the secret to be re-sourced later.

---

## 6. Per-Command Env Overrides (Provider Layer)

```javascript
// ============================================
// getEnvironmentOverrides - Per-Bash-tool-call env overlay
// Location: cli_inner_pretty.js:360926-360937
// ============================================

// ORIGINAL (for source lookup):
async getEnvironmentOverrides(z, Y) {
    let f = null,
      O = {};
    if (((O[Rv6] = process.execPath), f)) O.TMUX = f;
    if (Y) for (let [M, w] of Y) O[M] = w;
    if (q) {
      let M = q;
      if (c$() === "windows") M = MP(M);
      ((O.TMPDIR = M), (O.CLAUDE_CODE_TMPDIR = M), (O.TMPPREFIX = kX$.join(M, "zsh")));
    }
    return O;
  },

// READABLE (for understanding):
async function getEnvironmentOverrides(command, sessionEnvVars) {
  // Note: v2.1.142 simplified vs v2.1.112 - tmuxSocket arg was removed from signature.
  // The tmuxValue is now always null (the feature exists but is dormant in this build).
  const tmuxValue = null;
  const overrides = {};

  // Always: hint subprocesses where the parent claude binary lives
  overrides[CLAUDE_CODE_EXECPATH_ENV] = process.execPath;

  // Tmux reattach: only set TMUX if a socket was captured (currently never)
  if (tmuxValue) overrides.TMUX = tmuxValue;

  // Session env vars (per-tool-call overrides from the caller)
  if (sessionEnvVars) {
    for (const [key, value] of sessionEnvVars) {
      overrides[key] = value;
    }
  }

  // Sandbox temp directory: redirect all temp files
  if (sandboxTmpDir) {     // captured from buildExecCommand
    let sandboxPath = sandboxTmpDir;
    if (getPlatform() === "windows") sandboxPath = posixPathToWindowsPath(sandboxPath);
    overrides.TMPDIR = sandboxPath;
    overrides.CLAUDE_CODE_TMPDIR = sandboxPath;
    overrides.TMPPREFIX = pathJoinPosix(sandboxPath, "zsh");
  }
  return overrides;
}

// Mapping: z→command, Y→sessionEnvVars, f→tmuxValue, O→overrides,
//          Rv6→CLAUDE_CODE_EXECPATH_ENV, q→sandboxTmpDir, M→sandboxPath,
//          c$→getPlatform, MP→posixPathToWindowsPath, kX$→pathJoinPosix
```

**Five potential overrides:**

| Key | When set | Why |
|-----|----------|-----|
| `CLAUDE_CODE_EXECPATH` | Always | Lets subprocesses find the running claude binary (used by SDK scripts, status-line helpers) |
| `TMUX` | When tmux socket was captured at startup (currently null in v2.1.142) | Allows `tmux send-keys` etc. to work inside Claude Code's shell |
| `<custom>` | When `sessionEnvVars` is non-empty | Per-call overrides — used by session-env hook system for scratch variables |
| `TMPDIR` | Sandbox active | Isolates temp files to the sandbox tmpdir |
| `CLAUDE_CODE_TMPDIR` | Sandbox active | Same as TMPDIR but Claude-specific (used by Claude-aware tools) |
| `TMPPREFIX` | Sandbox active | Zsh temp file prefix — different from TMPDIR in zsh |

---

## 7. Settings-Sourced Env (Background)

The `getUpstreamProxyEnv` (`lt$`) helper returns env vars sourced from settings files. The registration flow is dynamic — when CCR mode is active, the upstream proxy module dynamically imports and registers its env-vending function:

```javascript
// cli_inner_pretty.js:197525-197530
function Vs1(H) {                    // registerUpstreamProxyEnvFn
    PgK = H;
}
function lt$() {                     // getUpstreamProxyEnv
    return PgK?.() ?? {};
}
```

For non-CCR sessions, `PgK` stays undefined and the function returns `{}` — no overhead.

---

## 8. v2.1.112 → v2.1.142 Behavior Changes

| Behavior | v2.1.112 | v2.1.142 | Source |
|----------|---------|----------|--------|
| OTEL_* env-var inheritance | Inherited (4 specific OTEL header keys scrubbed in GHA mode) | Always stripped | v2.1.128 changelog |
| `CLAUDE_CODE_SESSION_ID` in Bash subprocess env | Not present | Set to current session UUID | v2.1.132 changelog |
| Background-session orchestration env keys | Not scrubbed | Always scrubbed (`CLAUDE_CODE_SESSION_KIND`, `CLAUDE_BG_SOURCE`, etc.) | (internal change, dates uncertain) |
| Background-session auth keys | Not scrubbed | Always scrubbed (`CLAUDE_CODE_OAUTH_TOKEN`, `CLAUDE_BG_AUTH_SNAPSHOT_PATH`, etc.) | (internal change) |
| `AI_AGENT` env var | Not present | Set to `"agent"` for gh attribution | v2.1.120 changelog |
| `process.env.CLAUDE_CODE_SESSION_ID` set at startup | Not present | Set if missing | v2.1.132 |
| `tmuxSocket` parameter to `getEnvironmentOverrides` | Present | Removed (parameter trimmed; feature dormant) | (internal change) |
| GHA scrub list `OTEL_EXPORTER_OTLP_*_HEADERS` entries | Present | Removed (covered by general OTEL strip) | v2.1.128 |
| GHA scrub list size | 24 entries | 21 entries | (v2.1.128 cleanup) |

---

## 9. The Complete Env Plumbing

```
┌────────────────────────────────────────────────────────────────────────┐
│  Startup (init.ts)                                                     │
│  ─────────────────                                                     │
│  1. applySafeConfigEnvironmentVariables() (filters settings.env)       │
│  2. If !process.env.CLAUDE_CODE_SESSION_ID:                            │
│       process.env.CLAUDE_CODE_SESSION_ID = v$()  (NEW v2.1.132)        │
│  3. CCR mode? -> dynamic import upstreamproxy -> Vs1(getProxyEnvFn)    │
│                                                                         │
│  process.env is now ready                                              │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
                                  │
                                  v
┌────────────────────────────────────────────────────────────────────────┐
│  Every subprocess spawn                                                │
│  ──────────────────────                                                │
│  env: {                                                                │
│    ...XI(),                ← scrubbed process.env (no OTEL_*, no bg)   │
│    SHELL: bash binary,                                                 │
│    GIT_EDITOR: "true",                                                 │
│    CLAUDECODE: "1",                                                    │
│    AI_AGENT: "agent",                                                  │
│    CLAUDE_CODE_SESSION_ID: v$(),                                       │
│    ...providerOverrides,   ← CLAUDE_CODE_EXECPATH, TMUX, TMPDIR, etc.  │
│    ...sessionEnvVars,      ← per-call overrides from hooks             │
│    ...(otel ? { TRACEPARENT: ... } : {})                               │
│  }                                                                     │
└────────────────────────────────────────────────────────────────────────┘
```

The model can introspect what env it sees by running `env` as a Bash tool command — but secrets stripped at the spawn boundary are simply not there. This is the same approach used by container runtimes: defense at the boundary, not inside the container.

---

## Summary

Subprocess env capture and filtering in Claude Code v2.1.142 is a defense-in-depth system:

1. **Startup scrub** — settings-sourced env is filtered by SSH-tunnel, host-provider, and CCD filters before being merged into `process.env`. Project-scoped sources only get a safe-allowlist.
2. **Per-spawn scrub** — `subprocessEnv()` strips GHA secrets, OTEL_* (new v2.1.128), and background-session orchestration/auth keys from every child process env, even though they remain in `process.env` for the parent.
3. **Proxy injection** — CCR sessions inject `HTTPS_PROXY`/CA-bundle vars into every subprocess so curl/gh/python route through the local relay. Lazy-loaded so non-CCR sessions pay nothing.
4. **Bash-tool spawn additions (v2.1.132)** — `CLAUDE_CODE_SESSION_ID` is injected so scripts can correlate with the session, joining `AI_AGENT` (v2.1.120) for gh attribution.
5. **Provider overlay** — per-Bash-tool-call overrides for tmux reattach, sandbox tmpdir, and caller-supplied session env vars.

Each layer addresses a different threat or use case, and the layers compose in a defined order. The composition is order-sensitive: provider overrides always win, but startup-applied settings env (even allowlisted ones) can still be scrubbed if they happen to be in the GHA scrub list or start with `OTEL_`.
