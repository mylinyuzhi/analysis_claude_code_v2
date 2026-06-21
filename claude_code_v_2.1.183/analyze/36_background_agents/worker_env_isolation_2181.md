# Worker Env-Isolation — the ANTHROPIC_* provider-env leak fix (2.1.181)

> **Delta tree:** `claude_code_v_2.1.183/analyze` documents the v2.1.156 → v2.1.183 delta.
> **Target bundle (every unlabelled citation):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.
> Citations labelled *(v2.1.156 before-picture)* point at `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.
>
> **Scope of THIS doc.** The daemon worker-env builder rework that lands the 2.1.181 changelog item *"background workers no longer inherit the dispatching session's provider credentials."* In v2.1.156 the builder ran **one** scrub pass over a pure terminal/SSH/session list and forwarded the rest of `process.env` verbatim — so a backgrounded worker silently inherited `ANTHROPIC_API_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`, Bedrock/Vertex/Foundry credentials, and all provider routing config of whatever session dispatched it. v2.1.183 rebuilds the scrub as **four passes plus a host-auth branch** that deletes the full provider auth/config surface unless the dispatch explicitly re-passes it. This doc is the deep-dive companion to §2 ("D2") of the module [`README.md`](./README.md).
>
> Confidence: **high** for the env-builder rework itself (proved with before/after reads of both bundles). The attribution of the *pre-warmed-worker project-settings leak (2.1.172)* and *"Could not resolve authentication after idle" (2.1.174)* changelog items to this rework is carried as **medium-low** (see §7) — but this doc adds a previously-undocumented second builder (`buildSpareHostEnv` / `YGf`, the prewarm spare-host path) that applies the same scrub, which strengthens that attribution.

---

## 1. The one-line contrast

| | v2.1.156 (`Eq9` @559877) | v2.1.183 (`_Fl` @594705) |
|---|---|---|
| Scrub passes | **1** (terminal/session list `Y7q`) | **4** (terminal/session + provider-auth + vertex-prefix + host-auth branch) |
| Provider auth scrubbed? | **No** — `ANTHROPIC_API_KEY`, `*_AUTH_TOKEN`, OAuth, Bedrock/Vertex/Foundry tokens all forwarded | **Yes** — `GLo` + `XLt` + `JLt` cover the whole provider surface |
| Host-managed-auth handling | none | `WLo` branch deletes resolved host tokens + the host's custom auth env var |
| Escape hatch | per-key re-pass via `H.env` | per-key re-pass via `e.env` (same model, now applied to provider vars too) |
| Spare/prewarm host env | (no separate builder isolated in 156 docs) | NEW `YGf` builder, same scrub lists |

**Key framing.** This is not a redesign of *how* the worker env is assembled — the assembly (`{ ...process.env, ...bg-markers, ...dispatch.env }` then delete-by-list) is structurally the same builder. The delta is **what gets deleted**: v2.1.156 deleted only terminal noise; v2.1.183 deletes the provider credential/config surface. The fix is a *list addition* expressed as three new scrub passes wired into the same delete loop.

---

## 2. The v2.1.183 builder `buildWorkerEnv` (`_Fl`)

### What it does

`buildWorkerEnv` (obfuscated: `_Fl`, `cli_inner_pretty.js:594705-594748`) is the single function the daemon calls to construct the environment block for a backgrounded worker process. It is invoked from the claim-frame builder `qV.buildClaimFrame` (`cli_inner_pretty.js:595106`) and the dispatch path (`cli_inner_pretty.js:595413`). It returns a plain object that is handed to the worker spawn (`Bun.spawn(..., { env })`).

### How it works (step by step)

```javascript
// ============================================
// buildWorkerEnv - assemble the backgrounded worker's env, then scrub credentials by class
// Location: cli_inner_pretty.js:594705-594748
// ============================================

// ORIGINAL (for source lookup):
function _Fl(e, t, n, r, o) {
  let s = { ...process.env },
    i = {
      ...s,
      ...(n && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: n }),
      ...(Kt() === "windows" && { CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT: "1" }),
      ...e.env,
      CLAUDE_CODE_SESSION_KIND: "bg",
      CLAUDE_BG_BACKEND: "daemon",
      CLAUDE_ENABLE_STREAM_WATCHDOG: "1",
      CLAUDE_BG_SOURCE: e.source,
      CLAUDE_JOB_DIR: t,
      CLAUDE_CODE_SESSION_NAME: e.seed?.name || e.seed?.intent || e.short,
      CLAUDE_BG_RENDEZVOUS_SOCK: r,
      FORCE_COLOR: "3",
      COLORTERM: "truecolor",
      BROWSER: "true",
    };
  if (process.env.CLAUDE_CONFIG_DIR) i.CLAUDE_CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR;
  if (e.isolation === "worktree") i.CLAUDE_BG_ISOLATION = "worktree";
  for (let a of jLo) if (!e.env?.[a]) delete i[a];
  for (let a of GLo) if (!e.env?.[a]) delete i[a];
  for (let a of Object.keys(i)) if (JLt.some((l) => a.startsWith(l)) && !e.env?.[a]) delete i[a];
  if (WLo(s)) {
    for (let l of XLt) delete i[l];
    let a = s.CLAUDE_CODE_HOST_AUTH_ENV_VAR;
    if (a) delete i[a];
  } else if (s.ANTHROPIC_BASE_URL) delete i.ANTHROPIC_AUTH_TOKEN;
  if (o) ((i.CLAUDE_BG_RV_AUTH = o.rvAuth), (i.CLAUDE_BG_PTY_AUTH = o.ptyAuth));
  if (n) delete i.CLAUDE_CODE_OAUTH_TOKEN;
  if (e.launch.mode === "exec") {
    for (let a of Object.keys(i))
      if (
        (a.startsWith("CLAUDE_") &&
          a !== "CLAUDE_JOB_DIR" &&
          a !== "CLAUDE_CONFIG_DIR" &&
          a !== "CLAUDE_BG_PTY_AUTH") ||
        a.startsWith("OTEL_")
      )
        delete i[a];
    (delete i.BROWSER, (i.CLAUDE_PTY_HOST_EXEC = "1"));
  }
  return i;
}

// READABLE (for understanding):
function buildWorkerEnv(dispatch, jobDir, authSnapshotPath, rendezvousSock, socketAuth) {
  let hostEnv = { ...process.env };           // snapshot of the dispatching session's env

  // (A) Base env = host env + bg markers; dispatch.env wins last so explicit re-passes survive scrubbing.
  let env = {
    ...hostEnv,
    ...(authSnapshotPath && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: authSnapshotPath }),
    ...(currentPlatform() === "windows" && { CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT: "1" }),
    ...dispatch.env,                           // <-- the escape hatch: anything here is re-passed verbatim
    CLAUDE_CODE_SESSION_KIND: "bg",
    CLAUDE_BG_BACKEND: "daemon",
    CLAUDE_ENABLE_STREAM_WATCHDOG: "1",
    CLAUDE_BG_SOURCE: dispatch.source,
    CLAUDE_JOB_DIR: jobDir,
    CLAUDE_CODE_SESSION_NAME: dispatch.seed?.name || dispatch.seed?.intent || dispatch.short,
    CLAUDE_BG_RENDEZVOUS_SOCK: rendezvousSock,
    FORCE_COLOR: "3", COLORTERM: "truecolor", BROWSER: "true",
  };
  if (process.env.CLAUDE_CONFIG_DIR) env.CLAUDE_CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR;
  if (dispatch.isolation === "worktree") env.CLAUDE_BG_ISOLATION = "worktree";

  // (1) Scrub terminal/SSH/session noise — unless re-passed (carried over from v2.1.156, list broadened).
  for (let k of TERMINAL_SESSION_SCRUB) if (!dispatch.env?.[k]) delete env[k];

  // (2) NEW (the 2.1.181 leak fix): scrub the provider auth/config surface — unless re-passed.
  for (let k of PROVIDER_AUTH_SCRUB) if (!dispatch.env?.[k]) delete env[k];

  // (3) NEW: scrub anything matching a provider-region prefix (VERTEX_REGION_CLAUDE_*) — unless re-passed.
  for (let k of Object.keys(env))
    if (VERTEX_REGION_PREFIXES.some((p) => k.startsWith(p)) && !dispatch.env?.[k]) delete env[k];

  // (4) NEW: host-managed-auth branch. If the host injects auth (Unix-socket broker / host-named var),
  //     the resolved tokens are transient host secrets — delete them unconditionally (no re-pass escape).
  if (isHostManagedAuth(hostEnv)) {
    for (let k of HOST_AUTH_TOKEN_SET) delete env[k];
    let custom = hostEnv.CLAUDE_CODE_HOST_AUTH_ENV_VAR;
    if (custom) delete env[custom];
  } else if (hostEnv.ANTHROPIC_BASE_URL) {
    delete env.ANTHROPIC_AUTH_TOKEN;          // custom base URL but not host-managed: still drop the bearer
  }

  // Re-key the rendezvous/pty socket auth for THIS worker (not the parent's).
  if (socketAuth) { env.CLAUDE_BG_RV_AUTH = socketAuth.rvAuth; env.CLAUDE_BG_PTY_AUTH = socketAuth.ptyAuth; }
  if (authSnapshotPath) delete env.CLAUDE_CODE_OAUTH_TOKEN; // snapshot supersedes the inline OAuth token

  // exec-mode belt-and-braces purge — BYTE-IDENTICAL to v2.1.156 (NOT a delta; see §5).
  if (dispatch.launch.mode === "exec") { /* delete CLAUDE_*/OTEL_* except JOB_DIR/CONFIG_DIR/PTY_AUTH */ }

  return env;
}

// Mapping: _Fl->buildWorkerEnv, e->dispatch, t->jobDir, n->authSnapshotPath, r->rendezvousSock, o->socketAuth,
//          s->hostEnv, i->env, Kt->currentPlatform, jLo->TERMINAL_SESSION_SCRUB, GLo->PROVIDER_AUTH_SCRUB,
//          JLt->VERTEX_REGION_PREFIXES, WLo->isHostManagedAuth, XLt->HOST_AUTH_TOKEN_SET
```

### The pass ordering (and why it matters)

The four scrub passes run in this exact order on the *assembled* env (which already has `...dispatch.env` merged on top):

1. **Pass 1 — terminal/session** (`for (let a of jLo)`, `cli_inner_pretty.js:594725`). The carryover pass. Deletes terminal-emulator/SSH/multiplexer markers (`TERM_PROGRAM`, `SSH_TTY`, `TMUX`, `ITERM_SESSION_ID`, …) so the worker doesn't think it's attached to the dispatcher's terminal.
2. **Pass 2 — provider auth/config** (`for (let a of GLo)`, `cli_inner_pretty.js:594726`). **The leak fix.** Deletes the union of provider auth keys, provider routing flags, base URLs, skip-auth flags, model overrides, and the host-managed markers.
3. **Pass 3 — vertex-region prefix** (`for (let a of Object.keys(i)) if (JLt.some(...))`, `cli_inner_pretty.js:594727`). A *prefix* scrub for the open-ended `VERTEX_REGION_CLAUDE_<MODEL>` family, which can't be enumerated by exact key because the model name is a suffix.
4. **Pass 4 — host-auth branch** (`if (WLo(s)) { ... }`, `cli_inner_pretty.js:594728-594732`). Conditional on the **host** snapshot `s` (NOT the assembled `i`), this deletes the resolved auth-token set when the provider is host-managed, plus the host's dynamically-named auth var. The `else if (s.ANTHROPIC_BASE_URL)` fallback drops just the bearer token when a custom base URL is set without full host management.

Passes 1–3 honor the **re-pass escape hatch** (`if (!e.env?.[a])` / `if (!e.env?.[k])`): a var explicitly supplied in `dispatch.env` is *kept*. Pass 4 does **not** — host-managed tokens are deleted unconditionally (there is no `if (!e.env?.…)` guard on the `XLt` loop), because they are transient secrets the worker is meant to re-fetch from the host broker, not inherit.

### Why this approach (deny-by-scrub vs allow-list)

**What the design buys.** The builder forwards `process.env` *wholesale* and then deletes known-sensitive classes — a **deny-list / scrub** model — rather than starting from an empty env and copying forward an **allow-list** of safe vars.

- **Trade-off chosen:** robustness against environment fragmentation vs. fail-open risk. A background worker is a *full second Claude Code process*; it legitimately needs hundreds of env vars (PATH, locale, proxy config, `CLAUDE_CONFIG_DIR`, user shell config, etc.). An allow-list would have to enumerate all of those and would silently break the worker whenever the user relies on some unlisted var. The scrub model forwards everything and only has to know the *dangerous* classes.
- **The cost** is exactly the bug 2.1.181 fixed: a deny-list is *fail-open* — anything you forget to add to the scrub list leaks. v2.1.156 forgot the entire provider-auth class. The v2.1.183 fix is therefore not architectural; it is "the deny-list was incomplete; complete it." That is why the change reads as *three new scrub passes wired into the same loop* rather than a new isolation mechanism.
- **The re-pass escape hatch** (`if (!dispatch.env?.[k])`) is what makes scrub-by-default safe to apply to credentials: a dispatch that legitimately needs to forward a specific provider var (e.g. a self-hosted gateway URL the worker can't otherwise discover) sets it in `dispatch.env`, which both wins the merge *and* suppresses the delete. So adding a key to `GLo`/`JLt` is **safe by construction** — it scrubs the ambient value but never overrides an explicit hand-off.

**Key insight.** The whole leak fix is "make the deny-list cover the credential surface, and make adding to it idempotent with the re-pass channel." Once `GLo`/`XLt`/`JLt` exist, *any* future provider var only needs to be appended to one list to be scrubbed in every worker — and because the lists are shared constants (used by both `_Fl` and the spare-host builder `YGf`, §4), the coverage is uniform across all bg-spawn paths.

---

## 3. The scrub lists and the host-auth predicate

All four passes are driven by module-level constants. They are **shared** across the worker builder (`_Fl`) and the spare-host builder (`YGf`, §4), and the auth-token set / vertex prefix are even reused by the general host-auth-detection helpers (`X0i` @191641, `CAd` @191716).

### `PROVIDER_AUTH_SCRUB` (`GLo`) — the new provider-auth pass

```javascript
// ============================================
// PROVIDER_AUTH_SCRUB - union of provider auth/config env classes deleted from bg workers
// Location: cli_inner_pretty.js:595849-595858
// ============================================

// ORIGINAL (for source lookup):
GLo = [
  ...k3r,                                       // model-name overrides (x3r) + custom-model overrides (Y0i)
  ...YLt,                                        // provider-select flags + provider resource ids
  ...C3r,                                        // provider base URLs
  ...I3r,                                        // skip-auth flags
  "ANTHROPIC_CUSTOM_HEADERS",
  "ANTHROPIC_UNIX_SOCKET",
  "CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST",
  "CLAUDE_CODE_HOST_AUTH_ENV_VAR",
];

// READABLE (for understanding):
const PROVIDER_AUTH_SCRUB = [
  ...MODEL_OVERRIDE_VARS,        // k3r = [...x3r model defaults, ...Y0i custom-model options]
  ...PROVIDER_SELECT_VARS,       // YLt: CLAUDE_CODE_USE_BEDROCK/VERTEX/FOUNDRY/ANTHROPIC_AWS/MANTLE/GATEWAY,
                                 //      ANTHROPIC_FOUNDRY_RESOURCE, ANTHROPIC_VERTEX_PROJECT_ID,
                                 //      ANTHROPIC_AWS_WORKSPACE_ID, CLOUD_ML_REGION
  ...PROVIDER_BASE_URLS,         // C3r: ANTHROPIC_BASE_URL, *_BEDROCK/VERTEX/FOUNDRY/AWS/MANTLE_BASE_URL, ...
  ...PROVIDER_SKIP_AUTH_FLAGS,   // I3r: CLAUDE_CODE_SKIP_{BEDROCK,VERTEX,FOUNDRY,ANTHROPIC_AWS,MANTLE}_AUTH
  "ANTHROPIC_CUSTOM_HEADERS",    // arbitrary header injection — a credential channel
  "ANTHROPIC_UNIX_SOCKET",       // host broker socket path
  "CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST",
  "CLAUDE_CODE_HOST_AUTH_ENV_VAR",
];

// Mapping: GLo->PROVIDER_AUTH_SCRUB, k3r->MODEL_OVERRIDE_VARS, YLt->PROVIDER_SELECT_VARS,
//          C3r->PROVIDER_BASE_URLS, I3r->PROVIDER_SKIP_AUTH_FLAGS
```

Constituent lists, verified by reading the declarations:
- `MODEL_OVERRIDE_VARS` (obfuscated: `k3r`, `cli_inner_pretty.js:192032`) — `[...x3r, ...Y0i]`; `x3r` (@191688) is the `ANTHROPIC_DEFAULT_*_MODEL[...]` / `ANTHROPIC_SMALL_FAST_MODEL` / `CLAUDE_CODE_SUBAGENT_MODEL` family; `Y0i` (@191710) is `ANTHROPIC_CUSTOM_MODEL_OPTION[...]`.
- `PROVIDER_SELECT_VARS` (obfuscated: `YLt`, `cli_inner_pretty.js:191650-191661`) — provider-selection flags and resource ids.
- `PROVIDER_BASE_URLS` (obfuscated: `C3r`, `cli_inner_pretty.js:191662-191671`) — the eight base-URL vars.
- `PROVIDER_SKIP_AUTH_FLAGS` (obfuscated: `I3r`, `cli_inner_pretty.js:191681-191687`) — five `CLAUDE_CODE_SKIP_*_AUTH` flags.

Note that `GLo` scrubs *routing/config* as well as auth: a leaked `ANTHROPIC_BEDROCK_BASE_URL` or `CLAUDE_CODE_USE_VERTEX=1` would silently re-point a worker at a provider the user never intended for the bg job. Stripping the whole provider class — not just the bearer tokens — is what makes the worker's provider resolution start from a clean slate (or from the explicit `dispatch.env` hand-off).

### `HOST_AUTH_TOKEN_SET` (`XLt`) — the bearer/token class

```javascript
// ============================================
// HOST_AUTH_TOKEN_SET - resolved auth tokens deleted unconditionally under host-managed auth
// Location: cli_inner_pretty.js:191672-191680
// ============================================

// ORIGINAL (for source lookup):
XLt = [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_AUTH_TOKEN",
  "CLAUDE_CODE_OAUTH_TOKEN",
  "AWS_BEARER_TOKEN_BEDROCK",
  "ANTHROPIC_FOUNDRY_API_KEY",
  "ANTHROPIC_AWS_API_KEY",
  "ANTHROPIC_BEDROCK_MANTLE_API_KEY",
];

// READABLE (for understanding):
const HOST_AUTH_TOKEN_SET = [
  "ANTHROPIC_API_KEY",          // first-party key
  "ANTHROPIC_AUTH_TOKEN",       // bearer
  "CLAUDE_CODE_OAUTH_TOKEN",    // CLI OAuth token
  "AWS_BEARER_TOKEN_BEDROCK",   // Bedrock bearer
  "ANTHROPIC_FOUNDRY_API_KEY",  // Foundry
  "ANTHROPIC_AWS_API_KEY",      // Anthropic-on-AWS
  "ANTHROPIC_BEDROCK_MANTLE_API_KEY",
];
// Mapping: XLt->HOST_AUTH_TOKEN_SET
```

These are the *resolved* tokens — the actual secrets. Under host-managed auth they are deleted from the worker env in pass 4 with **no re-pass escape**, because the host is expected to re-provision them to the worker through its own broker (the `ANTHROPIC_UNIX_SOCKET` / `CLAUDE_CODE_HOST_AUTH_ENV_VAR` channel) on demand, with fresh, short-lived values.

### `VERTEX_REGION_PREFIXES` (`JLt`) — the prefix pass

```javascript
// ============================================
// VERTEX_REGION_PREFIXES - prefix match for the open-ended VERTEX_REGION_CLAUDE_<MODEL> family
// Location: cli_inner_pretty.js:191730
// ============================================

// ORIGINAL (for source lookup):
JLt = ["VERTEX_REGION_CLAUDE_"];

// READABLE (for understanding):
const VERTEX_REGION_PREFIXES = ["VERTEX_REGION_CLAUDE_"];  // e.g. VERTEX_REGION_CLAUDE_3_5_SONNET=us-east5
// Mapping: JLt->VERTEX_REGION_PREFIXES
```

Pass 3 exists because these keys are model-suffixed and therefore unenumerable as a fixed list — a Vertex deployment can set `VERTEX_REGION_CLAUDE_<any-model-id>` to pin per-model regions. A prefix scrub catches the whole family. (The same prefix is used by the general host-auth-var classifier `X0i`, `cli_inner_pretty.js:191643`, confirming `JLt` is the canonical "provider region config" prefix list, not a bg-only invention.)

### `isHostManagedAuth` (`WLo`) — the host-auth predicate

```javascript
// ============================================
// isHostManagedAuth - is provider auth injected/managed by an external host (IDE/SDK broker)?
// Location: cli_inner_pretty.js:594777-594779
// ============================================

// ORIGINAL (for source lookup):
function WLo(e) {
  return !!e.ANTHROPIC_UNIX_SOCKET || st(e.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) || !!e.CLAUDE_CODE_HOST_AUTH_ENV_VAR;
}

// READABLE (for understanding):
function isHostManagedAuth(env) {
  return (
    !!env.ANTHROPIC_UNIX_SOCKET ||                          // host exposes a broker socket
    parseBoolean(env.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) ||// host explicitly claims provider management
    !!env.CLAUDE_CODE_HOST_AUTH_ENV_VAR                      // host points at a custom auth env var name
  );
}
// Mapping: WLo->isHostManagedAuth, st->parseBoolean, e->env
```

`parseBoolean` (obfuscated: `st`, `cli_inner_pretty.js:163-168`) is the standard `"1"/"true"/"yes"/"on"` truthiness helper. `isHostManagedAuth` is evaluated against the **host** env snapshot `s = { ...process.env }` (captured before merging `dispatch.env`), so it asks "is the *dispatching* process running under a host-managed auth regime?" — and if so, the worker must not carry the host's resolved tokens forward, because they belong to the host's session, not the worker's.

**Why the branch instead of always-scrub `XLt`?** When auth is *not* host-managed (the common standalone CLI case, e.g. a user with `ANTHROPIC_API_KEY` in their shell), the worker legitimately needs that key to authenticate — scrubbing it unconditionally would break every standalone bg job. The branch keeps the user's own key for standalone use, but strips the *host's* injected key under host management, where the key is a per-session secret the host re-issues. The `else if (s.ANTHROPIC_BASE_URL) delete i.ANTHROPIC_AUTH_TOKEN` fallback is a narrower belt: a custom base URL without full host management still drops just the bearer token, on the assumption that a custom-endpoint deployment manages its own session bearer separately from the long-lived API key.

---

## 4. The previously-undocumented second builder: `buildSpareHostEnv` (`YGf`)

The dossier flagged the *pre-warmed-worker leak (2.1.172)* as an open question (could not isolate a dedicated prewarm-scrub line). Reading the prewarm spare-host spawn path surfaces a **second** env builder that the v2.1.156 baseline docs did not cover and that applies the **same** four scrub classes — concrete evidence the prewarm path is also covered by the v2.1.183 isolation rework.

```javascript
// ============================================
// buildSpareHostEnv - env for the prewarmed --bg-pty-host / --bg-spare process
// Location: cli_inner_pretty.js:695919-695944
// ============================================

// ORIGINAL (for source lookup):
function YGf(e) {
  let t = { ...process.env };
  for (let n of jLo) delete t[n];
  if (WLo(t)) {
    let n = t.CLAUDE_CODE_HOST_AUTH_ENV_VAR;
    if (n) delete t[n];
    for (let r of XLt) delete t[r];
  } else if (t.ANTHROPIC_BASE_URL) delete t.ANTHROPIC_AUTH_TOKEN;
  for (let n of GLo) delete t[n];
  for (let n of Object.keys(t)) if (JLt.some((r) => n.startsWith(r))) delete t[n];
  if (Kt() === "macos") delete t.CLAUDE_CODE_OAUTH_TOKEN;
  return (
    Object.assign(t, {
      CLAUDE_CODE_SESSION_KIND: "bg",
      CLAUDE_BG_BACKEND: "daemon",
      CLAUDE_ENABLE_STREAM_WATCHDOG: "1",
      FORCE_COLOR: "3",
      COLORTERM: "truecolor",
      BROWSER: "true",
      ...("tokensPath" in e
        ? { CLAUDE_BG_SOCKET_TOKENS_PATH: e.tokensPath }
        : { CLAUDE_BG_PTY_AUTH: e.ptyAuth, CLAUDE_BG_CLAIM_AUTH: e.claimAuth }),
    }),
    t
  );
}

// READABLE (for understanding):
function buildSpareHostEnv(auth) {
  let env = { ...process.env };
  for (let k of TERMINAL_SESSION_SCRUB) delete env[k];   // (1) terminal/session — note: NO re-pass guard
  if (isHostManagedAuth(env)) {                          // (4) host-auth branch runs FIRST here
    let custom = env.CLAUDE_CODE_HOST_AUTH_ENV_VAR; if (custom) delete env[custom];
    for (let k of HOST_AUTH_TOKEN_SET) delete env[k];
  } else if (env.ANTHROPIC_BASE_URL) delete env.ANTHROPIC_AUTH_TOKEN;
  for (let k of PROVIDER_AUTH_SCRUB) delete env[k];      // (2) provider auth/config
  for (let k of Object.keys(env))                        // (3) vertex-region prefix
    if (VERTEX_REGION_PREFIXES.some((p) => k.startsWith(p))) delete env[k];
  if (currentPlatform() === "macos") delete env.CLAUDE_CODE_OAUTH_TOKEN; // Keychain-backed → re-fetchable
  Object.assign(env, { /* bg markers */, ...(spare socket-auth markers) });
  return env;
}
// Mapping: YGf->buildSpareHostEnv, e->auth, jLo->TERMINAL_SESSION_SCRUB, GLo->PROVIDER_AUTH_SCRUB,
//          WLo->isHostManagedAuth, XLt->HOST_AUTH_TOKEN_SET, JLt->VERTEX_REGION_PREFIXES, Kt->currentPlatform
```

`buildSpareHostEnv` is the env for the prewarmed pty-host process — it is the `env:` argument of the `Bun.spawn([... "--bg-pty-host" ... "--bg-spare" ...])` call (`cli_inner_pretty.js:695866-695868`).

**Three meaningful differences from `_Fl`** (each understandable, none a leak):
1. **No re-pass escape hatch.** `YGf` deletes every scrub-list key unconditionally (`delete t[n]`, no `if (!e.env?.[n])`). This is correct because a *prewarmed spare* has no specific dispatch yet — there is no `dispatch.env` to honor. The spare is a blank, credential-free worker that will be *claimed* by a real dispatch later (which re-supplies whatever it needs through the claim frame built by `_Fl`).
2. **Host-auth branch runs first** (before the `GLo`/`JLt` passes). Ordering is irrelevant to the result here because there is no re-pass guard and the sets are deletes — but it is a small divergence worth noting for anyone diffing the two functions.
3. **macOS-only OAuth scrub** (`if (Kt() === "macos") delete t.CLAUDE_CODE_OAUTH_TOKEN`) replaces `_Fl`'s `if (n) delete i.CLAUDE_CODE_OAUTH_TOKEN`. On macOS the OAuth token is Keychain-backed and re-fetchable, so the spare can drop it; the `_Fl` worker drops it only when an auth-snapshot path (`n`) supersedes it.

**Significance for the open question.** Because the prewarmed spare's env is built by `YGf`, and `YGf` runs the same `GLo`/`XLt`/`JLt`/`WLo` scrub as `_Fl`, the v2.1.183 isolation rework **does** cover the prewarm path — a prewarmed worker no longer carries the originating session's provider credentials/config. That makes the 2.1.172 *"pre-warmed worker inherits project settings/auth"* and 2.1.174 *"could not resolve authentication after idle"* changelog items **plausibly subsumed** by this rework (a prewarmed worker now starts auth-clean and resolves auth at claim time). This remains **medium-low confidence** as a precise attribution — there is no single string tying these changelog lines to `YGf`, and "project settings" leakage could also involve config-dir/settings paths not in these scrub lists — but `YGf`'s existence is direct evidence the prewarm env is now scrubbed identically to the dispatch env.

---

## 5. What is carryover (do NOT re-derive)

These pieces are present in v2.1.183 `_Fl` but unchanged from v2.1.156 `Eq9`:

- **The env-assembly skeleton** — `{ ...process.env, ...(authSnapshot), ...(windows repaint), ...dispatch.env, <bg markers> }` is identical line-for-line between `Eq9` (`cli_inner_pretty.js:559878-559893`, *v2.1.156 before-picture*) and `_Fl` (`cli_inner_pretty.js:594706-594722`). Only the scrub block below it changed.
- **The terminal/session scrub *loop*** (pass 1) — the *loop* `for (let z of Y7q) if (!H.env?.[z]) delete _[z]` is carryover; only the *list* `jLo` was broadened (see §6).
- **The OAuth-snapshot scrub** — `if (q) delete _.CLAUDE_CODE_OAUTH_TOKEN` (156) → `if (n) delete i.CLAUDE_CODE_OAUTH_TOKEN` (183) — identical.
- **The exec-mode `CLAUDE_*`/`OTEL_*` purge** — `cli_inner_pretty.js:594735-594746` is byte-identical to v2.1.156 `cli_inner_pretty.js:559898-559903` *except* it adds one allow-list exception, `a !== "CLAUDE_BG_PTY_AUTH"` (so the exec worker keeps its pty-auth token). This is a tiny refinement of the existing shell-exec purge, not part of the provider-leak fix. Full treatment of the shell-exec env model: [`shell_exec_sessions.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md).
- **The unified dispatcher seam** that *calls* `_Fl` (launch-mode cascade, claim frame, ack-timeout rescue) is structurally unchanged → [`unified_dispatcher_ol.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/unified_dispatcher_ol.md).

---

## 6. The v2.1.156 before-picture in full

### Builder `Eq9` (v2.1.156)

```javascript
// ============================================
// (v2.1.156 before-picture) buildWorkerEnv predecessor - ONE scrub pass, no provider auth
// Location: cli_inner_pretty.js:559877-559905  (v2.1.156 bundle)
// ============================================

// ORIGINAL (v2.1.156 for source lookup):
function Eq9(H, $, q, K) {
  let _ = {
    ...process.env,
    ...(q && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: q }),
    ...(n$() === "windows" && { CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT: "1" }),
    ...H.env,
    CLAUDE_CODE_SESSION_KIND: "bg", CLAUDE_BG_BACKEND: "daemon", CLAUDE_ENABLE_STREAM_WATCHDOG: "1",
    CLAUDE_BG_SOURCE: H.source, CLAUDE_JOB_DIR: $,
    CLAUDE_CODE_SESSION_NAME: H.seed?.name || H.seed?.intent || H.short,
    CLAUDE_BG_RENDEZVOUS_SOCK: K, FORCE_COLOR: "3", COLORTERM: "truecolor", BROWSER: "true",
  };
  if (process.env.CLAUDE_CONFIG_DIR) _.CLAUDE_CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR;
  if (H.isolation === "worktree") _.CLAUDE_BG_ISOLATION = "worktree";
  for (let z of Y7q) if (!H.env?.[z]) delete _[z];   // <-- THE ONLY scrub pass (terminal/session)
  if (q) delete _.CLAUDE_CODE_OAUTH_TOKEN;
  if (H.launch.mode === "exec") { /* CLAUDE_*/OTEL_* purge */ }
  return _;
}

// READABLE: identical skeleton to v2.1.183 buildWorkerEnv, but the scrub block is a SINGLE
// terminal/session pass — there is NO PROVIDER_AUTH_SCRUB, NO VERTEX prefix pass, NO host-auth branch.
// Everything in Y7q is deleted; everything else in process.env — including every ANTHROPIC_*/Bedrock/
// Vertex/Foundry credential and routing var — is forwarded to the worker verbatim.

// Mapping: Eq9->(v2.1.156 buildWorkerEnv), H->dispatch, $->jobDir, q->authSnapshotPath, K->rendezvousSock,
//          Y7q->(v2.1.156 terminal/session scrub list), n$->currentPlatform
```

### List `Y7q` (v2.1.156) — pure terminal/session, zero provider auth

`Y7q` (`cli_inner_pretty.js:560861-560906`, *v2.1.156 before-picture*) is **44 entries**, and *every one* is a terminal-emulator / SSH / multiplexer / IDE-integration marker:

```
CLAUDE_CODE_QUESTION_PREVIEW_FORMAT, GITHUB_ACTIONS, CLAUDECODE, CLAUDE_CODE_SESSION_ID,
CLAUDE_CODE_EXECPATH, CLAUDE_CODE_COORDINATOR_MODE, TERM_PROGRAM, TERM_PROGRAM_VERSION,
__CFBundleIdentifier, KITTY_WINDOW_ID, WT_SESSION, KONSOLE_VERSION, VTE_VERSION, ZED_TERM,
ZELLIJ, TMUX, TMUX_PANE, STY, LC_TERMINAL, SSH_CONNECTION, SSH_CLIENT, SSH_TTY, COLORFGBG,
CURSOR_TRACE_ID, GIT_ASKPASS, SSH_ASKPASS, SSH_ASKPASS_REQUIRE, VSCODE_GIT_ASKPASS_MAIN,
VSCODE_GIT_ASKPASS_NODE, VSCODE_GIT_ASKPASS_EXTRA_ARGS, VSCODE_GIT_IPC_HANDLE, TERMINAL_EMULATOR,
ITERM_SESSION_ID, GNOME_TERMINAL_SERVICE, XTERM_VERSION, ALACRITTY_LOG, TILIX_ID, TERMINATOR_UUID,
ConEmuANSI, ConEmuPID, ConEmuTask, MSYSTEM, CLAUDE_CODE_SSE_PORT, FORCE_CODE_TERMINAL
```

There is **no `ANTHROPIC_*`, no Bedrock/Vertex/Foundry, no `*_API_KEY`, no `*_AUTH_TOKEN`, no `*_OAUTH_TOKEN`** key in this list. The only credential touched in all of `Eq9` is `CLAUDE_CODE_OAUTH_TOKEN`, and *only* when an auth snapshot path was passed (`if (q)`). So in the standalone-CLI case a v2.1.156 bg worker inherited the dispatching session's `ANTHROPIC_API_KEY` and every provider routing var unchanged — the leak the 2.1.181 changelog describes. (Neither `Eq9` nor `Y7q` appears in the v2.1.156 symbol-index files; this builder was not previously documented, so this is net-new analysis rather than a re-base.)

### The v2.1.183 terminal/session list (`jLo`) was also broadened

The terminal/session scrub list `TERMINAL_SESSION_SCRUB` (obfuscated: `jLo`, `cli_inner_pretty.js:595797-595848`) is the carryover pass-1 list, but v2.1.183 **added** seven entries over `Y7q`:

- `CLAUDE_CODE_CHILD_SESSION` — so a child session marker doesn't leak into the worker.
- `CLAUDE_BG_RV_AUTH`, `CLAUDE_BG_PTY_AUTH`, `CLAUDE_BG_SOCKET_TOKENS_PATH` — the *parent's* bg socket-auth tokens; the worker is re-keyed with its own (`if (o) (i.CLAUDE_BG_RV_AUTH = o.rvAuth, …)` @594733). Scrubbing them here ensures a stale parent token never survives if `socketAuth` is absent.
- `CLAUDE_AX_SCREEN_READER` — accessibility/screen-reader marker (terminal-attachment state).
- `ANTHROPIC_MODEL` — the active model override; a bg worker should resolve its own model, not inherit the live session's.
- `SSH_CLIENT` — completes the `SSH_*` family (156 had `SSH_CONNECTION`/`SSH_TTY` but not `SSH_CLIENT`).

This list broadening is secondary to the headline `GLo` provider-auth pass, but it shows the same intent: a bg worker should start from a *clean attachment + clean credentials* state, inheriting only what is deliberately handed off.

---

## 7. Confidence and open questions (carried from the dossier)

- **High confidence:** the `_Fl` four-pass rework, the `GLo`/`XLt`/`JLt` lists, the `WLo` host-auth branch, and the v2.1.156 `Eq9`/`Y7q` single-pass before-picture — all proved by direct reads of both bundles (cited above).
- **Medium-low confidence (attribution):** that this rework lands the *pre-warmed-worker project-settings leak (2.1.172)* and *"Could not resolve authentication after idle" (2.1.174)* changelog items. §4 shows the prewarm spare-host builder `YGf` applies the same scrub, which is strong evidence the prewarm env is now credential-clean — but no single string ties these exact changelog lines to these functions, and "project settings" (vs. provider auth) could involve config/settings paths outside `GLo`/`XLt`/`JLt`. Treat the attribution as plausible-but-unproven.
- **Not in scope / not isolated here:** the `--bg -cn <name>` name-seeding fix (2.1.176) and the "Working forever" fix (2.1.178) — see the module [`README.md`](./README.md) §7. The session name is seeded in `_Fl` via `CLAUDE_CODE_SESSION_NAME: e.seed?.name || e.seed?.intent || e.short` (`cli_inner_pretty.js:594717`), but the name-not-seeding micro-fix likely lives in `--bg` arg parsing, not in this builder.

---

## Related Symbols

> Symbol mappings live in the central indexes, not here:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the depth-limit / subagent spawn path)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Background Agents** is the home module: dispatcher, worker, env builder)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (provider auth/config env lists, the host-auth predicate)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_183_background_agents.md](../00_overview/symbol_additions_v2_1_183_background_agents.md) — the granular v2.1.183 additions for this module (add new rows there)

Key functions/constants in this doc:
- `buildWorkerEnv` (obfuscated: `_Fl`, `cli_inner_pretty.js:594705`) — bg worker env builder; four scrub passes + host-auth branch. Replaces v2.1.156 `Eq9` (`cli_inner_pretty.js:559877`, before-picture).
- `buildSpareHostEnv` (obfuscated: `YGf`, `cli_inner_pretty.js:695919`) — prewarmed `--bg-pty-host`/`--bg-spare` env builder; same scrub lists, no re-pass guard, macOS-only OAuth scrub.
- `isHostManagedAuth` (obfuscated: `WLo`, `cli_inner_pretty.js:594777`) — host-managed-auth predicate (Unix socket / managed-by-host / host auth env var).
- `parseBoolean` (obfuscated: `st`, `cli_inner_pretty.js:163`) — `"1"/"true"/"yes"/"on"` truthiness helper used by `isHostManagedAuth`.
- `PROVIDER_AUTH_SCRUB` (obfuscated: `GLo`, `cli_inner_pretty.js:595849`) — NEW provider auth/config scrub list (`[...k3r, ...YLt, ...C3r, ...I3r, …]`).
- `HOST_AUTH_TOKEN_SET` (obfuscated: `XLt`, `cli_inner_pretty.js:191672`) — resolved auth-token class deleted under host-managed auth.
- `VERTEX_REGION_PREFIXES` (obfuscated: `JLt`, `cli_inner_pretty.js:191730`) — `["VERTEX_REGION_CLAUDE_"]` prefix scrub.
- `TERMINAL_SESSION_SCRUB` (obfuscated: `jLo`, `cli_inner_pretty.js:595797`) — carryover terminal/session scrub list (broadened by 7 entries vs v2.1.156 `Y7q`).
- `MODEL_OVERRIDE_VARS` (`k3r`, `cli_inner_pretty.js:192032`), `PROVIDER_SELECT_VARS` (`YLt`, `cli_inner_pretty.js:191650`), `PROVIDER_BASE_URLS` (`C3r`, `cli_inner_pretty.js:191662`), `PROVIDER_SKIP_AUTH_FLAGS` (`I3r`, `cli_inner_pretty.js:191681`) — the constituent lists composing `PROVIDER_AUTH_SCRUB`.
- (v2.1.156 before-picture) `Eq9` (`cli_inner_pretty.js:559877`) / `Y7q` (`cli_inner_pretty.js:560861`) — the single-pass predecessor builder + its pure terminal/session list.
