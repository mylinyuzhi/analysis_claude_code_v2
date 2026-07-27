# The three bridges: `chrome_bridge_*`, the environment/work bridge, and the REPL bridge

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `.../2.1.193/extract/cli_inner_pretty.js`, always tagged `(193)`.

The brief for this module asked for "the `tengu_bridge_*` gate family — work out the bridge's
architecture (it is the Chrome/Cowork transport)". Following the code produces a **correction to that
premise**, and the correction is the most valuable thing in this document:

> **`tengu_bridge_*` is not the Chrome transport.** The Chrome transport is `chrome_bridge_*`, a
> separate WebSocket client that shares only the English word "bridge". `tengu_bridge_*` covers two
> *other* transports: the **environment/work bridge** (`claude bridge`, the Cowork local-agent worker)
> and the **REPL bridge** (Remote Control mirroring of a live terminal session).

Getting this wrong is easy and expensive: `grep -c 'bridge'` mixes three subsystems, and the counts
then say "nothing changed" when in fact one subsystem is byte-stable and another gained five gates.

---

## 0. Delta summary before anything else

| Literal | 220 | 193 | Reading |
|---|---|---|---|
| `chrome_bridge` | 26 | **26** | Chrome WS transport: **pure carryover** |
| `[bridge:api]` | 29 | **29** | environment/work REST surface: **pure carryover** |
| `tengu_bridge` (whole family) | 48 | **41** | +7 — five new gates plus two extra call sites |
| `tengu_bridge_read_file_served` | 2 | 0 | net-new |
| `tengu_bridge_placeholder_sweep` | 1 | 0 | net-new |
| `tengu_bridge_repl_env_expired_fresh_session` | 1 | 0 | net-new |
| `tengu_bridge_outcome_branch_dropped` | 1 | 0 | net-new |
| `tengu_bridge_revision_guess_used` | 1 | 0 | net-new |
| `CLAUDE_CODE_BRIDGE_SESSION_ID` | 6 | 0 | net-new env var |
| `CLAUDE_BRIDGE_REATTACH_GROUPING` | 5 | 0 | net-new env var |
| `CLAUDE_BRIDGE_USE_CCR_V2` | **0** | 2 | **removed** — replaced by two gates |
| `bridgeConfig` | 7 | 7 | the Chrome context has always preferred the WS bridge |
| `LOCAL_BRIDGE` | 3 | 3 | dev override, carryover |

**None of this has a changelog bullet.** The bridge work in this window is entirely undocumented
upstream, which is why the architecture reconstruction below is worth the space.

---

## 1. Bridge #1 — the Chrome extension bridge (`chrome_bridge_*`)

### 1.1 Endpoints

```javascript
// ============================================
// getBridgeWebSocketUrl - selects the Chrome relay endpoint
// Location: cli_inner_pretty.js:537611-537618
// ============================================

// ORIGINAL (for source lookup):
function I3_() {
  if (Z.USE_LOCAL_OAUTH || Z.LOCAL_BRIDGE) return "ws://localhost:8765";
  if (Z.USE_STAGING_OAUTH) return "wss://bridge-staging.claudeusercontent.com";
  return "wss://bridge.claudeusercontent.com";
}
function R3_() {
  return Z.USE_LOCAL_OAUTH || Z.LOCAL_BRIDGE;
}

// READABLE (for understanding):
function getBridgeWebSocketUrl() {
  if (env.USE_LOCAL_OAUTH || env.LOCAL_BRIDGE) return "ws://localhost:8765";       // dev relay
  if (env.USE_STAGING_OAUTH) return "wss://bridge-staging.claudeusercontent.com";  // staging relay
  return "wss://bridge.claudeusercontent.com";                                     // production relay
}
function isLocalBridge() {
  return env.USE_LOCAL_OAUTH || env.LOCAL_BRIDGE;
}

// Mapping: I3_→getBridgeWebSocketUrl, R3_→isLocalBridge, Z→managedEnvProxy
```

`claudeusercontent.com` is the sandboxed-content domain, deliberately *not* `anthropic.com` — the
relay is on an origin that carries no first-party cookies. Both env overrides are carryover
(`:605339 (193)` is byte-equivalent apart from the `at(process.env.X)` → `Z.X` managed-proxy
refactor that swept the whole bundle in this window).

### 1.2 The connection is a relay rendezvous, not a socket to Chrome

The CLI never talks to Chrome directly in the default path. Both the CLI and the extension connect
*outbound* to the relay and are then **paired by device id**. Evidence, all read in 220:

- `createChromeContext` (`Tcp`, `:537619-537707`) builds the context with `bridgeConfig` (`:537658`),
  `clientTypeId: "claude-code"` (`:537637`), and a `getPersistedDeviceId` that reads
  `chromeExtension.pairedDeviceId` from config (`:537655`).
- `onExtensionPaired(deviceId, deviceName)` (`:537648-537654`) persists the pair.
- The client class (`:33780-34600`) carries `selectedDeviceId`, `discoveryComplete`,
  `multiBrowserPendingSelection`, `pendingPairingRequestId`, `peerConnectedWaiters` — a discovery /
  selection / pairing state machine, not a point-to-point socket.
- Transport selection: `:44179` `return e.bridgeConfig ? n3n(e) : e.getSocketPaths ? MFl(e) : J4n(e);`
  — **WS bridge first, local-socket pool second, single socket last.** Identical shape at
  `:33603 (193)`.

### 1.3 Frame shape

The tool-call frame is built in `callTool` (`:33837-33895`) and is the only place the wire format is
visible:

```javascript
// ============================================
// buildChromeToolCallFrame - the wire frame sent over the Chrome relay
// Location: cli_inner_pretty.js:33866-33878
// ============================================

// ORIGINAL (for source lookup):
      f = {
        type: "tool_call",
        tool_use_id: s,
        client_type: this.context.clientTypeId,
        tool: e,
        args: t,
        supports_tool_result_notices: !0,
      };
    if (this.selectedDeviceId) f.target_device_id = this.selectedDeviceId;
    if (d) f.permission_mode = d;
    if (p?.length) f.allowed_domains = p;
    if (r?.onPermissionRequest) f.handle_permission_prompts = !0;
    if (r?.sessionScope) f.session_scope = r.sessionScope;

// READABLE (for understanding):
      frame = {
        type: "tool_call",
        tool_use_id: callId,                       // crypto.randomUUID(), :33852
        client_type: this.context.clientTypeId,    // "claude-code"
        tool: toolName,
        args: toolInput,
        supports_tool_result_notices: true,        // opt-in to trailing advisory text blocks
      };
    if (this.selectedDeviceId) frame.target_device_id = this.selectedDeviceId;  // relay routing key
    if (permissionMode) frame.permission_mode = permissionMode;
    if (allowedDomains?.length) frame.allowed_domains = allowedDomains;
    if (opts?.onPermissionRequest) frame.handle_permission_prompts = true;      // extension may prompt
    if (opts?.sessionScope) frame.session_scope = opts.sessionScope;

// Mapping: f→frame, s→callId, e→toolName, t→toolInput, d→permissionMode, p→allowedDomains, r→opts
```

**Key insight:** `target_device_id` is the routing key. The relay is a dumb fan-out; the CLI decides
which browser gets the call. That is why "which extension is connected" is a whole discovery
sub-protocol (`discoverAndSelectExtension`, `:33841`) rather than a connection property, and why the
`.199` "reconnect page opened repeatedly" bug (see
[`chrome_ga_and_hardening.md`](chrome_ga_and_hardening.md#5-the-199-reconnect-page-loop-a-one-boolean--two-boolean-rewrite))
was possible at all: device identity is persisted in the config dir, so a *different config dir* looks
like a *different device*.

### 1.4 Telemetry is allow-listed, not free-form

`:537696-537705` shows `trackEvent` copying only booleans/numbers, plus strings whose key is in a
set `k3_`, and renaming `status` → `bridge_status`. The bridge event names themselves are enumerated
in an allow-list (`y3_`, `:537275`; its `chrome_bridge_*` members at `:537279-537285`:
`chrome_bridge_connection_succeeded`, `…_failed`,
`…_disconnected`, `…_tool_call_completed`, `…_error`, `…_started`, `…_timeout`). Both are carryover;
worth stating because it explains why the Chrome subsystem *cannot* drift in the gate diff even when
its behaviour changes — new events would have to be added to the allow-list.

---

## 2. Bridge #2 — the environment/work bridge (`claude bridge`)

This is the Cowork "local agent" / VM-mode worker: a long-lived process on the developer's machine
that **registers itself as an execution environment**, polls the server for units of *work*, and
spawns a child Claude Code session per work item.

### 2.1 Complete REST surface (all read in 220 at `:541648-541807`)

| Operation | Method + path | Line | Notes |
|---|---|---|---|
| Register environment | `POST /v1/environments/bridge` | `:541657` | body `{machine_name, directory, branch, git_repo_url, max_sessions, metadata:{worker_type}}`, optional `environment_id` for reuse; 15 s timeout |
| Poll for work | `GET /v1/environments/{envId}/work/poll` | `:541691` | params `reclaim_older_than_ms`, `poll_interval_ms`; 10 s timeout; **`null` body means "no work"** |
| Ack work | `POST /v1/environments/{envId}/work/{workId}/ack` | `:541714` | |
| Stop work | `POST /v1/environments/{envId}/work/{workId}/stop` | `:541725` | body `{force}` |
| Heartbeat work | `POST /v1/environments/{envId}/work/{workId}/heartbeat` | `:541785` | returns `{lease_extended, state}` — **a lease, not a keepalive** |
| Deregister | `DELETE /v1/environments/bridge/{envId}` | `:541737` | |
| Reconnect session | `POST /v1/environments/{envId}/bridge/reconnect` | `:541771` | body `{session_id}` |
| Archive session | `POST /v1/{code/}sessions/{id}/archive` | `:541748` | **route depends on a gate** — see §2.4 |
| Permission response | `POST` (url built by `kur`) | `:541799` | route also gate-dependent |

Status handling is centralised in `t7e` (`:541809+`): 200/204 pass, 401 throws a typed `Y9` with a
re-auth hint, and a 401 anywhere triggers one `onAuth401` refresh-and-retry (`:541638-541645`).

### 2.2 The poll cadence is a remotely-tunable, schema-validated config object

```javascript
// ============================================
// getBridgePollIntervalConfig - remote poll/heartbeat cadence with a zod fallback
// Location: cli_inner_pretty.js:545275-545279 (defaults :545264-545273)
// ============================================

// ORIGINAL (for source lookup):
function igt() {
  let e = abe("tengu_bridge_poll_interval_config", Ybr, 300000),
    t = nW_().safeParse(e);
  return t.success ? t.data : Ybr;
}
  Ybr = {
    poll_interval_ms_not_at_capacity: 2000,
    poll_interval_ms_at_capacity: 600000,
    non_exclusive_heartbeat_interval_ms: 0,
    multisession_poll_interval_ms_not_at_capacity: 2000,
    multisession_poll_interval_ms_partial_capacity: 2000,
    multisession_poll_interval_ms_at_capacity: 600000,
    reclaim_older_than_ms: 5000,
    session_keepalive_interval_v2_ms: 120000,
  };

// READABLE (for understanding):
function getBridgePollIntervalConfig() {
  let remote = getFeatureValueCached("tengu_bridge_poll_interval_config",
                                     BRIDGE_POLL_DEFAULTS, /* refreshMs */ 300000),
    parsed = bridgePollConfigSchema().safeParse(remote);
  return parsed.success ? parsed.data : BRIDGE_POLL_DEFAULTS;   // fail-safe to the baked-in table
}

// Mapping: igt→getBridgePollIntervalConfig, abe→getFeatureValueCached, Ybr→BRIDGE_POLL_DEFAULTS,
//          nW_→bridgePollConfigSchema
```

**Why these numbers.** 2 s when the worker has spare capacity, **600 s (10 min) when at capacity**.
The 300× spread is the whole design: an idle worker must feel instant when you dispatch work from
claude.ai, but a *saturated* worker has nothing to gain from polling — it cannot accept the work —
so it drops to a slow liveness ping. `reclaim_older_than_ms: 5000` lets a worker re-claim work whose
lease was last touched more than 5 s ago, which is how a crashed sibling's work is recovered.

**The schema encodes a safety invariant the defaults would otherwise violate.** Two `.refine()`
clauses (`:545313-545320`) reject any remote payload where
`non_exclusive_heartbeat_interval_ms === 0 && poll_interval_ms_at_capacity === 0` (and the
multisession twin), with the message
`at-capacity liveness requires non_exclusive_heartbeat_interval_ms > 0 or poll_interval_ms_at_capacity > 0`.
Read that together with the default `non_exclusive_heartbeat_interval_ms: 0`: **the shipped config is
legal only because the at-capacity poll is 600 s, not 0.** A server operator who tried to disable the
at-capacity poll without first enabling heartbeats would produce a config that parses to failure and
silently falls back to the defaults — the worker stays alive rather than going dark. That is a
deliberate fail-*safe*, and it is the reason the validation lives in a `.refine()` rather than in the
consumer.

The consumer honours it at `:546316-546323`: after processing a poll, if the worker is at capacity it
awaits either the heartbeat interval (when non-zero) *or* the at-capacity poll interval — never
neither.

### 2.3 The work loop and its two independent error budgets

`:546324-546394` is the catch arm, and its structure is the interesting part:

1. **Typed API error (`Y9`)** → emit `tengu_bridge_fatal_error {status, error_type}` (`:546331`) and
   **break the loop**. A 403 that `_Ks()` recognises is suppressed to a debug line (`:546328`); a
   grouping-style error with live sessions triggers `ne()` instead of dying (`:546329`).
2. **Connection error** (`hfp`/`gfp`) → budget `G`, backoff `q` doubling to `a.connCapMs`, give up at
   `a.connGiveUpMs` with `tengu_bridge_poll_give_up {error_type: "connection"}` (`:546352`).
3. **Anything else** → a *separate* budget `j`/`F` and `a.generalGiveUpMs`, give up with
   `error_type: "general"` (`:546379`).

Crucially, each arm **zeroes the other budget** (`:546357` sets `j = null, F = 0`; `:546384` sets
`G = null, q = 0`). A machine that flaps between "no network" and "server 500" therefore never
accumulates a give-up in either budget — the alternation resets both. This is a deliberate choice to
favour availability over fast failure, and it is only safe because both give-up paths log an operator
message (`Server unreachable for N minutes, giving up.` `:546351`, `Persistent errors for N minutes,
giving up.` `:546378`).

**Sleep detection.** Both arms first check `he - z > ffp(a)` and, on a large wall-clock gap, log
`Detected system sleep (Ns gap), resetting error budget` (`:546342`, `:546369`) and clear *all four*
budget variables. Without this a laptop lid-close would burn the entire connection budget while
suspended and the worker would give up on wake. `bridge_poll_sleep_detected` carries `gapMs`.

### 2.4 `CLAUDE_BRIDGE_USE_CCR_V2` was deleted and replaced by two gates

This is the one clean **removal** in the family.

| | 2.1.193 | 2.1.220 |
|---|---|---|
| env var | `CLAUDE_BRIDGE_USE_CCR_V2` registered `:43197 (193)` | **absent** (220=0) |
| decision | `if (se.use_code_sessions === !0 \|\| at(process.env.CLAUDE_BRIDGE_USE_CCR_V2))` `:569238 (193)` | two independent gates: `tengu_ccr_v2_send_events_cli` `:535751`, `tengu_ccr_v2_session_crud_cli` `:535754` |
| consumers | one flag for everything | `useCcrV2Routing` (event POST url) `:541799`, `useCcrV2SessionCrud` (archive route) `:541748`, wired at `:546924-546925` and `:547347-547348` |

**Why split one flag into two.** The v2 migration has two independent halves — *where events are
posted* and *which session CRUD routes exist* (`/v1/sessions/{id}` vs `/v1/code/sessions/{id}`).
Under one flag they must flip together, which makes the rollout all-or-nothing across a fleet of
long-lived workers that cannot be restarted in lockstep. Two gates let the server move routing first
and CRUD later. The cost is that a misconfigured pair is representable (v2 routing with v1 CRUD); the
code tolerates it because the two call sites are genuinely independent.
`tengu_ccr_v2_send_events_cli` existed in 193 (`:603988 (193)`); `tengu_ccr_v2_session_crud_cli` is
the new half.

### 2.5 Spawn mode: `same-dir` vs `worktree`

Resolution order at `:546871-546874`, read verbatim in 220:

```
if (resume)            -> "single-session", source "resume"
else if (flag != null) -> flag,             source "flag"
else if (saved != null)-> saved,            source "saved"     // config remoteControlSpawnMode
else                   -> "same-dir",       source "gate_default"
```

First run with no saved preference prompts interactively (`Choose [1/2] (default: 1): ` `:546859`)
and records `tengu_bridge_spawn_mode_chosen` (`:546864`). A live toggle is bound to the `w` key
(char code 119, `:547167-547180`) and emits `tengu_bridge_spawn_mode_toggled`. Both gates are 1/1 —
carryover. `tengu_bridge_started` (`:547117-547127`) reports `max_sessions`, `sandbox`, `spawn_mode`,
`spawn_mode_source`, `pre_create_session`, `worktree_available` — a good single event to read when
reconstructing a worker's configuration from telemetry.

### 2.6 The two new bridge env vars

| Env var | Accessor | Role |
|---|---|---|
| `CLAUDE_CODE_BRIDGE_SESSION_ID` | `:32163` | set/deleted on the **child** process at `:332295-332296`; listed in the worker env allow-list `:552322` and scrubbed at `:680020` and `:869243`. It is how a spawned session learns which bridge session it *is*. |
| `CLAUDE_BRIDGE_REATTACH_GROUPING` | `:32182` | written into the child env at `:330485`, deleted from a sanitised copy at `:501828`, and consumed once at `:737599` |

`CLAUDE_BRIDGE_REATTACH_GROUPING` is the more interesting of the two. It arrives as part of a
**four-variable reattach handshake** — `CLAUDE_BRIDGE_REATTACH_SESSION`, `…_SEQ`,
`…_OUTBOUND_ONLY`, `…_GROUPING` — which the child **deletes from its own environment immediately**
after reading (`:737600-737604`):

```javascript
// ============================================
// resolveReattachHandshake - one-shot env handshake for REPL-bridge reattach
// Location: cli_inner_pretty.js:737596-737615
// ============================================

// ORIGINAL (for source lookup):
    U = process.env.CLAUDE_BRIDGE_REATTACH_SESSION,
    W = U ?? L,
    q = process.env.CLAUDE_BRIDGE_REATTACH_SEQ,
    F = process.env.CLAUDE_BRIDGE_REATTACH_GROUPING;
  if (U)
    (delete process.env.CLAUDE_BRIDGE_REATTACH_SESSION,
      delete process.env.CLAUDE_BRIDGE_REATTACH_SEQ,
      delete process.env.CLAUDE_BRIDGE_REATTACH_OUTBOUND_ONLY,
      delete process.env.CLAUDE_BRIDGE_REATTACH_GROUPING);
  let G = U ? (q ? Number.parseInt(q, 10) || void 0 : void 0) : P;
  ...
  let z;
  if (W) z = U ? F : Nfn()?.groupingId;
  else z = H;

// READABLE (for understanding):
    envSessionId   = process.env.CLAUDE_BRIDGE_REATTACH_SESSION,
    sessionId      = envSessionId ?? argSessionId,
    envSeq         = process.env.CLAUDE_BRIDGE_REATTACH_SEQ,
    envGroupingId  = process.env.CLAUDE_BRIDGE_REATTACH_GROUPING;
  if (envSessionId)                       // consume once: a re-exec must NOT inherit the handshake
    (delete process.env.CLAUDE_BRIDGE_REATTACH_SESSION,
     delete process.env.CLAUDE_BRIDGE_REATTACH_SEQ,
     delete process.env.CLAUDE_BRIDGE_REATTACH_OUTBOUND_ONLY,
     delete process.env.CLAUDE_BRIDGE_REATTACH_GROUPING);
  let resumeSeq = envSessionId ? (envSeq ? Number.parseInt(envSeq, 10) || undefined : undefined)
                               : argSeq;
  let groupingId;
  if (sessionId) groupingId = envSessionId ? envGroupingId          // env wins for an env reattach
                                           : readPersistedBridgeSession()?.groupingId;
  else groupingId = newGroupingId;

// Mapping: U→envSessionId, W→sessionId, q→envSeq, F→envGroupingId, G→resumeSeq, z→groupingId,
//          Nfn→readPersistedBridgeSession
```

**Why delete-after-read.** These variables describe *one* reattach. If they survived in
`process.env` they would be inherited by every child the session spawns (background agents, hooks,
`Bash` tool commands) and by any in-place re-exec, each of which would then try to reattach to a
session that is already attached. Consuming them turns a sticky environment variable into a
single-use message. The `Number.parseInt(q, 10) || void 0` idiom also quietly maps `"0"` and garbage
to `undefined`, i.e. "resume from the beginning" rather than "resume from sequence 0" — a small but
real difference when the server treats sequence 0 as a valid cursor.

Note the fallback chain: env handshake → CLI argument → **persisted bridge session on disk**
(`Nfn()`, `:737606-737610`, logging `Reattaching to persisted bridge session {id} at seq {seq}`).

---

## 3. Bridge #3 — the REPL bridge (Remote Control)

The REPL bridge mirrors the *current interactive terminal session* to claude.ai so that a phone or
web client can watch and steer it. Its log prefix is `[bridge:repl]` / `[remote-bridge]`.

### 3.1 Three policy gates before a byte is sent

`:737616-737629`, read verbatim, in this order:

1. `if (!(await lzs())) return Dse("not_enabled", "[bridge:repl] Skipping: bridge not enabled")`
2. `if (!jW()) return Dse("no_oauth", …)` → also reports `"failed"` to the UI
3. `if ((await U6(), !ns("allow_remote_control"))) return Dse("policy_denied", …)` with the user-facing
   `disabled by your organization's policy`
4. and, only for the *mirror* variant, `if (I && !ns("allow_remote_sessions")) …` (`:737624`)

**Why two separate policies.** `allow_remote_control` governs *someone else driving my terminal*;
`allow_remote_sessions` governs *a session existing on Anthropic's side at all*. An org can permit the
second and forbid the first. Ordering matters too: the local enable check is first (cheapest, no
network), OAuth second, and the policy fetch (`U6()` awaits a settings refresh) last — so a
policy-denied user still gets the cheaper, more actionable "not enabled" / "no OAuth" message when
those apply.

### 3.2 Session creation and the grouping-rejection classifier

`createCodeSession` (`Kwo`, `:333753-333800`) posts to **`/v1/code/sessions`** with
`{title, bridge: {}, tags?, session_grouping_id?, config: {cwd, model?, sources?, outcomes?,
reuse_outcome_branches?}}` and requires the response id to start with **`cse_`** (`:333796`) — a
cheap shape check that catches a proxy returning some other object.

`isGroupingRejection` (`rcd`, `:333740-333752`, 220=1/193=0) classifies a 4xx as *terminal for
grouping specifically*:

```javascript
// ============================================
// isGroupingRejection - distinguishes "your grouping is not usable" from a generic 4xx
// Location: cli_inner_pretty.js:333740-333752
// ============================================

// ORIGINAL (for source lookup):
function rcd(e) {
  if (e === null || typeof e !== "object" || !("error" in e) || e.error === null || typeof e.error !== "object")
    return !1;
  let t = e.error,
    r = "type" in t ? t.type : void 0,
    n = "resource_type" in t ? t.resource_type : void 0,
    o = "reason" in t ? t.reason : void 0;
  return (
    (r === "not_found_error" && n === "session_grouping") ||
    o === "public_grouping_hosted_only" ||
    o === "feature_disabled"
  );
}

// READABLE (for understanding):
function isGroupingRejection(responseBody) {
  if (!isPlainObjectWithErrorObject(responseBody)) return false;
  let err = responseBody.error,
    type = err.type,
    resourceType = err.resource_type,
    reason = err.reason;
  return (
    (type === "not_found_error" && resourceType === "session_grouping") ||  // grouping id is gone
    reason === "public_grouping_hosted_only" ||                              // grouping requires a hosted env
    reason === "feature_disabled"                                            // grouping turned off for this org
  );
}

// Mapping: rcd→isGroupingRejection, e→responseBody, t→err, r→type, n→resourceType, o→reason
```

Its one caller (`:333782`) converts a matching 4xx into `{terminal: true, status, detail}` instead of
`null`. **Why this matters:** `null` means "retryable, try again"; `terminal` means "stop and tell the
user". Without the classifier, a user whose org disabled session grouping would sit in a retry loop
against a request that can never succeed. The three recognised shapes are exactly the three ways a
grouping id can be permanently unusable — deleted, wrong environment class, feature off.

### 3.3 NEW gate — `tengu_bridge_repl_env_expired_fresh_session`

`:417051-417070`. On reattach, the client first tries `unarchiveSession`; if the outcome is `"gone"`
it logs `Reattach {id} gone (unarchive {status}); minting fresh session`, emits the new gate with
`{v2: true, via: "unarchive", status}`, and creates a brand-new session.

**Why instrument this.** Silently minting a fresh session is *correct* but *lossy* — the user loses
scrollback on the remote side. The gate turns an invisible degradation into a measurable one, and the
`status` field distinguishes "server said 404" from "server said 410/403", which is the difference
between an expired environment and a permissions change.

### 3.4 NEW gate — `tengu_bridge_placeholder_sweep`

`:415181-415185`:

```javascript
async function Ckd() {
  if (ca()) return !1;                                            // essential-traffic mode -> skip
  let { getFeatureValue_CACHED_MAY_BE_STALE: e } = await import(...);
  return e("tengu_bridge_placeholder_sweep", !0);                 // default ON
}
```

`ca()` (`:24894`) is `return mRl() === "essential-traffic"` — the client-wide traffic-minimisation
mode, *not* a bridge setting.

Two call sites: `:415191` (`if (!(await Ckd())) return;`) and `:415243`, the latter behind
`await vr(e.startDelayMs ?? g7y)` — a *delayed* sweep. The sweep operates on the transcript
placeholder queue implemented by the class at `:415150-415177` (`start` / `enqueue` / `end` / `drop`
/ `deactivate`, with `pendingCount`).

**What this is for.** When a remote client sends a message the local session has not yet rendered, the
bridge inserts a placeholder so the mirrored transcript stays ordered. If the local turn never
materialises (interrupted, errored, superseded), those placeholders leak. The sweep drops them. It
defaults to `true` and is gated so it can be killed remotely if it ever removes a placeholder that
was about to resolve — the classic shape for a cleanup task whose failure mode is *data loss* rather
than *data growth*. Note the ordering: the local traffic-mode check is **before** the gate read, so a
client in `essential-traffic` mode never performs the gate lookup at all — the check is placed first
precisely because evaluating the gate is itself network-backed.

### 3.5 NEW gate — `tengu_bridge_read_file_served`

`readFileForRemote` (`Ovn`, `:652721-652755`, exported at `:652720`) is the handler that lets a
remote viewer open a local file. The function itself is **carryover** (`:617913 (193)`); the two new
things are the telemetry and the `source` argument.

```javascript
// ============================================
// readFileForRemote - permission-checked, bounded file read served to a remote client
// Location: cli_inner_pretty.js:652721-652755
// ============================================

// ORIGINAL (for source lookup):
async function Ovn(e, t, r, n = "utf-8", o) {
  try {
    let i = Mi(e);
    for (let u of M_(i)) if (!glt(u, r, "read").allowed) throw Error(`read denied: ${e}`);
    let s = Math.min(t && t > 0 ? t : eCb, szo),
      a = await DKp.open(i, "r"), l, c;
    try {
      let u = Buffer.alloc(s + 1), { bytesRead: d } = await a.read(u, 0, s + 1, 0);
      ((c = d > s), (l = u.subarray(0, Math.min(d, s))));
    } finally { await a.close(); }
    if (o)
      O("tengu_bridge_read_file_served", { success: !0, source: fe(o), size_bytes: l.length,
                                           requested_max_bytes: s, truncated: c, ext: SW(i) });
    return { contents: l.toString(n === "base64" ? "base64" : "utf-8"), absPath: i,
             ...(c && { truncated: c }), ...(n === "base64" && { encoding: n }) };
  } catch (i) {
    if (o) O("tengu_bridge_read_file_served", { success: !1, source: fe(o) });
    throw i;
  }
}
var DKp, eCb = 1e6, szo = 1e7;

// READABLE (for understanding):
async function readFileForRemote(requestedPath, maxBytes, permissionCtx, encoding = "utf-8", source) {
  try {
    let absPath = toAbsolutePath(requestedPath);
    for (let ancestor of pathAndAncestors(absPath))                 // every path component, not just the leaf
      if (!checkFileReadPermission(ancestor, permissionCtx, "read").allowed)
        throw Error(`read denied: ${requestedPath}`);
    let limit = Math.min(maxBytes && maxBytes > 0 ? maxBytes : REMOTE_READ_DEFAULT_BYTES,
                         REMOTE_READ_MAX_BYTES),
      handle = await fs.open(absPath, "r"), body, truncated;
    try {
      let scratch = Buffer.alloc(limit + 1),                        // +1 byte = the truncation probe
        { bytesRead } = await handle.read(scratch, 0, limit + 1, 0);
      ((truncated = bytesRead > limit), (body = scratch.subarray(0, Math.min(bytesRead, limit))));
    } finally { await handle.close(); }
    if (source)
      emitTelemetry("tengu_bridge_read_file_served", { success: true, source: sanitize(source),
        size_bytes: body.length, requested_max_bytes: limit, truncated, ext: extensionOf(absPath) });
    return { contents: body.toString(encoding === "base64" ? "base64" : "utf-8"), absPath,
             ...(truncated && { truncated }), ...(encoding === "base64" && { encoding }) };
  } catch (err) {
    if (source) emitTelemetry("tengu_bridge_read_file_served", { success: false, source: sanitize(source) });
    throw err;
  }
}
var fs, REMOTE_READ_DEFAULT_BYTES = 1_000_000, REMOTE_READ_MAX_BYTES = 10_000_000;

// Mapping: Ovn→readFileForRemote, e→requestedPath, t→maxBytes, r→permissionCtx, n→encoding, o→source,
//          Mi→toAbsolutePath, M_→pathAndAncestors, glt→checkFileReadPermission, DKp→fs,
//          eCb→REMOTE_READ_DEFAULT_BYTES, szo→REMOTE_READ_MAX_BYTES, SW→extensionOf, fe→sanitize
```

Three details worth naming:

1. **The ancestor loop, not a leaf check.** `M_(i)` yields the path *and every ancestor*; a deny rule
   on a parent directory therefore blocks the child. A leaf-only check would let
   `/secrets/../secrets/key` through if only `/secrets` were denied.
2. **`limit + 1` is the truncation oracle.** Reading one byte past the cap is how `truncated` is
   determined without a `stat`, which would be racy against a concurrently-growing file.
3. **`Math.min(requested, 1e7)`** — the caller's `maxBytes` can only *lower* the cap. A remote client
   cannot ask for 100 MB. The 1 MB default vs 10 MB ceiling gap exists because the common case is
   "show me this source file" and the ceiling is for deliberate large reads.

The three call sites are `:653760` (a tool path, no `source`), `:737839`
(`source: "repl_bridge"` — the REPL bridge's `onReadFile`), and `:847848` (the SDK/control path).
Only the sites that pass `source` are instrumented, so the gate's volume is a direct measure of
*remote-originated* reads.

### 3.6 NEW gates — `tengu_bridge_outcome_branch_dropped` and `tengu_bridge_revision_guess_used`

These two ship together in `reportGitSessionContext` (`cHs`, `:333699-333709`) and belong to
`buildGitSessionContext` (`aHs`, `:333660-333693`), the function that translates *this local
checkout* into the `sources` / `outcomes` a remote session needs to reproduce it.

Supporting literals, all 220>0 / 193=0: `outcomes.branches` 2/0, `branchDropped` 6/0,
`revisionGuessUsed` 3/0, `git remote set-head origin -a` 1/0, `reportGitSessionContext` 2/0.

```javascript
// ============================================
// buildGitSessionContext - derives remote-session git sources/outcomes from the local checkout
// Location: cli_inner_pretty.js:333660-333693
// ============================================

// ORIGINAL (for source lookup):
async function aHs(e, t, r) {
  let n = { revisionGuessUsed: !1 };
  if (!e) return { sources: [], outcomes: [], report: n };
  let { parseGitRemote: o, parseGitHubRepository: i } = await ...,
    { getDefaultBranch: s } = await ...;
  if (t === "HEAD") t = "";
  let a = !1, l = t || r || void 0;
  if (!l) ((l = (await s()) || void 0), (a = l !== void 0));
  let c = t && r && t !== r ? [t] : [], u, d;
  if (t && c.length === 0)
    ((u = r ? "is_default" : "no_evidence"),
     (d = r ? `[bridge] requested branch '${t}' is the default branch — omitted from outcomes.branches (the runner stays on the clone)`
            : `[bridge] no session-anchored default-branch evidence — omitting requested branch '${t}' from outcomes.branches; the remote session will work on a generated branch instead. Run 'git remote set-head origin -a' in the repo (or supply defaultBranch via the SDK) to restore branch continuity.`));
  let p = { branchDropped: u, revisionGuessUsed: a, warnMessage: d },
    f = (y, _, E) => ({ report: p,
      sources: [{ type: "git_repository", url: `https://${y}/${_}/${E}`, revision: l }],
      outcomes: [{ type: "git_repository", git_info: { type: "github", repo: `${_}/${E}`, branches: c } }] });
  ...
}

// READABLE (for understanding):
async function buildGitSessionContext(remoteUrl, requestedBranch, knownDefaultBranch) {
  let emptyReport = { revisionGuessUsed: false };
  if (!remoteUrl) return { sources: [], outcomes: [], report: emptyReport };
  ...
  if (requestedBranch === "HEAD") requestedBranch = "";              // "HEAD" is not a branch name
  let guessed = false,
    revision = requestedBranch || knownDefaultBranch || undefined;
  if (!revision) { revision = (await getDefaultBranch()) || undefined; guessed = revision !== undefined; }
  let outcomeBranches = requestedBranch && knownDefaultBranch && requestedBranch !== knownDefaultBranch
                          ? [requestedBranch] : [];
  let dropReason, warnMessage;
  if (requestedBranch && outcomeBranches.length === 0)
    dropReason  = knownDefaultBranch ? "is_default" : "no_evidence";
    warnMessage = knownDefaultBranch ? "<benign: it IS the default branch>"
                                     : "<lossy: no evidence, remote will invent a branch>";
  ...
}

// Mapping: aHs→buildGitSessionContext, e→remoteUrl, t→requestedBranch, r→knownDefaultBranch,
//          a→guessed, l→revision, c→outcomeBranches, u→dropReason, d→warnMessage,
//          s→getDefaultBranch, o→parseGitRemote, i→parseGitHubRepository
```

**The design decision.** `outcomes.branches` tells the server *"push results to this branch"*. Naming
the default branch there would make the remote runner create a redundant branch off `main`, so it is
omitted. But the omission has **two causes with opposite severity**, and the code separates them:

| `branchDropped` | Meaning | Severity | User sees |
|---|---|---|---|
| `"is_default"` | we *know* the requested branch is the default, so dropping it is correct | benign | debug log only |
| `"no_evidence"` | we *cannot tell* whether it is the default, so we drop it defensively and the remote invents a branch | **lossy** | `console.warn` (`:333706`) plus the remediation `Run 'git remote set-head origin -a'` |

`reportGitSessionContext` (`:333699-333709`) is the whole consumer, and its shape encodes exactly
that asymmetry:

```javascript
function cHs(e) {
  if (e.branchDropped && e.warnMessage) {
    if ((O("tengu_bridge_outcome_branch_dropped", { reason: fe(e.branchDropped) }),
         w(e.warnMessage, { level: "warn" }),
         e.branchDropped === "no_evidence"))
      console.warn(e.warnMessage);        // only the lossy case escalates to the user's terminal
  }
  if (e.revisionGuessUsed) O("tengu_bridge_revision_guess_used", {});
}
```

`revisionGuessUsed` is orthogonal: it fires when neither the caller's branch nor a known default was
available and the code fell back to `getDefaultBranch()`. The remote session then starts from a
*guessed* revision. Emitting it silently (no message) is right — it is usually correct — but it makes
"remote session started on the wrong commit" reports diagnosable after the fact.

**Key insight:** these two gates exist because the failure they describe is *invisible at the time*.
The user dispatches work, it runs, and only later do they notice the branch is wrong. Anthropic
instrumented the two moments where fidelity was knowingly traded away, and attached a copy-pasteable
git command to the one that is recoverable.

---

## 4. Reading guide: which bridge am I looking at?

| Clue in the source | Bridge |
|---|---|
| `chrome_bridge_*` event, `target_device_id`, `client_type: "claude-code"`, `bridgeConfig` | #1 Chrome extension |
| `[bridge:api]`, `/v1/environments/`, `pollForWork`, `spawn_mode`, `[bridge:work]` | #2 environment/work |
| `[bridge:repl]`, `[remote-bridge]`, `cse_` ids, `/v1/code/sessions`, `replBridgeEnabled` | #3 REPL / Remote Control |
| `tengu_bridge_poll_*`, `…_session_started`, `…_spawn_mode_*`, `…_shutdown` | #2 |
| `tengu_bridge_repl_*`, `…_placeholder_sweep`, `…_read_file_served` | #3 |
| `tengu_bridge_outcome_branch_dropped`, `…_revision_guess_used` | #3 (session creation) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getBridgeWebSocketUrl` (`I3_`) - Chrome relay endpoint selector, `:537611`
- `isLocalBridge` (`R3_`) - dev-relay predicate, `:537616`
- `createChromeContext` (`Tcp`) - Chrome MCP server context factory, `:537619`
- `getBridgePollIntervalConfig` (`igt`) - remotely-tunable poll cadence with zod fallback, `:545275`
- `BRIDGE_POLL_DEFAULTS` (`Ybr`) - the eight baked-in cadence constants, `:545264`
- `buildGitSessionContext` (`aHs`) - local checkout → remote `sources`/`outcomes`, `:333660`
- `reportGitSessionContext` (`cHs`) - emits the two new branch-fidelity gates, `:333699`
- `isGroupingRejection` (`rcd`) - terminal-vs-retryable grouping 4xx classifier, `:333740`
- `createCodeSession` (`Kwo`) - `POST /v1/code/sessions`, `cse_*` id check, `:333753`
- `readFileForRemote` (`Ovn`) - bounded permission-checked remote read, `:652721`
- `shouldSweepBridgePlaceholders` (`Ckd`) - default-on placeholder sweep gate, `:415181`
