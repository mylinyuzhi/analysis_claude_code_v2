# The server-authored workflow launch channel — an undocumented NET_NEW subsystem

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md)

Companion documents: [workflow_runtime_core.md](workflow_runtime_core.md) ·
[workflow_lifecycle.md](workflow_lifecycle.md) ·
[workflow_model_resolution.md](workflow_model_resolution.md) ·
[workflow_state_and_ipc.md](workflow_state_and_ipc.md)

---

## 0. Why this document exists

[README §5](README.md) left an open question:

> **`tengu_workflow_launch_event`** (`:502483`, `:502581`, 220=2/193=0) is a new gate/event pair in the
> workflow launch path that I located but did not trace to a changelog bullet — it may be undocumented.

It is undocumented, and it is not a "gate/event pair". It is the telemetry surface of a **complete new
subsystem**: a channel by which the *server* — not the model, not the user — delivers a workflow
script into a running Claude Code session and gets the result back on the same wire. Every anchor in
it is `220=N / 193=0`.

| Anchor | 220 | 193 |
|---|---|---|
| `"workflow_launch"` (the message-type literal) | 8 | **0** |
| `serverAuthoredCarrier` | 5 | **0** |
| `workflow_launch_result` | 2 | **0** |
| `artifact_sha256` | 4 | **0** |
| `launch_uuid` | 1 | **0** |
| `/.workflow/` (filestore prefix) | 1 | **0** |
| `workflow-launch-exec` | 4 | **0** |
| `CLAUDE_REMOTE_WORKFLOW_SCRIPT` | 4 | **0** |
| `tengu_workflow_launch_event` | 2 | **0** |
| `workflow_event_launch` (counter) | 3 | **0** |
| `policy-gate` / `launch-payload` / `payload-digest-mismatch` | 5 / 4 / 2 | **0 / 0 / 0** |
| `cli_stdin_workflow_launch_dropped` | 1 | **0** |

**No changelog bullet in `.195`–`.220` mentions any of it.** It is the single largest undocumented
workflow change in the window, and it is larger than every documented one combined.

The module's own export map (`:502392-502407`) leaks the intended names, so most of this subsystem can
be described with real identifiers rather than guesses:

```javascript
// ORIGINAL (:502392-502407):
var dZd = {};
tt(dZd, {
  workflowBundleDigestMatches: () => aZd,   takeWorkflowLaunchHandoff: () => H6s,
  stashWorkflowLaunchHandoffForTest: () => MD_, parseWorkflowLaunchPointer: () => sZd,
  handleWorkflowLaunchEvent: () => OD_,     decodeWorkflowBundle: () => lZd,
  createWorkflowLaunchState: () => DD_,     clearWorkflowLaunchHandoffsForTest: () => PD_,
  WORKFLOW_LAUNCH_RESULT_SUBTYPE: () => iZd, WORKFLOW_LAUNCH_ERROR_LAYERS: () => LD_,
  WORKFLOW_BUNDLE_FORMAT_VERSION: () => x6s, WORKFLOW_BUNDLE_FILESTORE_PREFIX: () => vBo,
  MAX_LAUNCH_BUNDLE_BYTES: () => Npn,
});
```

---

## 1. Two entry points, one executor

There are **two** server-authored launch paths, and they share `runServerAuthoredWorkflow` (`bBo`,
`:502211-502303`):

| Path | Ingress | Trigger | Script arrives as | Anchor |
|---|---|---|---|---|
| **A — environment** | process env at session start | the hidden `/__remote-workflow` command | `CLAUDE_REMOTE_WORKFLOW_SCRIPT` (plus `CLAUDE_REMOTE_WORKFLOW_ARGS`) | `:502329-502354`, `:502378-502390` |
| **B — carrier event** | a `workflow_launch` frame on the SSE transport | the frame itself | a sha256-pinned binary bundle fetched from a filestore path | `:502491-502583`, `:502613-502638` |

Path A is the simpler, older-looking shape: the launcher puts the script in the environment and the
session runs one hidden command. Path B is the interesting one — it can arrive **mid-session**,
carries a content digest, and answers on the same channel.

Both are gated behind `CLAUDE_CODE_REMOTE` / a remote transport, so neither is reachable in an
ordinary local session.

---

## 2. The shared policy gate

```javascript
// ============================================
// checkServerWorkflowPolicy - The one gate both server-authored paths share
// Location: cli_inner_pretty.js:502205-502210
// ============================================

// ORIGINAL (for source lookup):
function $pn(e) {
  if (CQt()) return "dynamic workflows are disabled for this session (managed settings `disableWorkflows`).";
  if (e?.serverAuthoredCarrier && JQd()) return null;
  if (!lJn()) return "dynamic workflows are disabled for this session (org policy `allow_workflows`).";
  return null;
}
function JQd() { return Z.CLAUDE_CODE_REMOTE_SESSION_ORIGIN === "review"; }

// READABLE (for understanding):
function checkServerWorkflowPolicy(opts) {
  if (areWorkflowsDisabledByPolicy())                       // managed settings — ABSOLUTE
    return "dynamic workflows are disabled for this session (managed settings `disableWorkflows`).";
  if (opts?.serverAuthoredCarrier && isReviewOriginSession())   // ← the carve-out
    return null;
  if (!isPolicyAllowed("allow_workflows"))                  // org policy — bypassable above
    return "dynamic workflows are disabled for this session (org policy `allow_workflows`).";
  return null;
}
function isReviewOriginSession() { return env.CLAUDE_CODE_REMOTE_SESSION_ORIGIN === "review"; }

// Mapping: $pn→checkServerWorkflowPolicy, CQt→areWorkflowsDisabledByPolicy (:119310),
//          JQd→isReviewOriginSession (:502183), lJn→isPolicyAllowed("allow_workflows") (:119333)
```

**This is the most consequential five lines in the subsystem.** Read the ordering carefully:

1. `disableWorkflows` (managed settings / `CLAUDE_CODE_DISABLE_WORKFLOWS`) is checked **first** and is
   absolute — nothing bypasses it.
2. A **server-authored carrier event in a session whose origin is `"review"` skips the
   `allow_workflows` org-policy check entirely.**
3. Everyone else must satisfy `allow_workflows`.

So an organisation that has *not* enabled `allow_workflows` will still execute a server-delivered
workflow inside a review-origin CCR session. The carve-out is narrow — it requires all three of
`serverAuthoredCarrier: true` (set only at `:502514` and `:502629`), `CLAUDE_CODE_REMOTE_SESSION_ORIGIN === "review"`,
and `disableWorkflows` unset — but it is a real policy asymmetry between "the model asked for a
workflow" and "the server sent one", and it is documented nowhere.

The rationale is inferable: a review-origin session *is* the product feature (server-side code review
implemented as a workflow), so gating it on a customer-facing "let the model write workflows" policy
toggle would break the feature for orgs that disabled model-authored workflows for a completely
different reason. Whether that reasoning survives contact with a security review is not for this
document to decide — but note that `disableWorkflows` remains the honest kill switch, and an org that
wants no workflow execution at all must set *that*, not `allow_workflows: false`.

Also note the env path (`ID_`, `:502341`) calls `$pn()` with **no argument**, so it never gets the
carve-out; only the carrier path does.

---

## 3. Path A — the environment-delivered script

```javascript
// ============================================
// __remote-workflow slash command - deterministic entry point for env-delivered scripts
// Location: cli_inner_pretty.js:502329-502354 (call), :502378-502390 (definition)
// ============================================

// ORIGINAL (for source lookup, abridged):
ID_ = async (e, t) => {
  if (!Z.CLAUDE_CODE_REMOTE)
    return E_r("not-remote-session", "this command only runs inside a remote (CCR) session (CLAUDE_CODE_REMOTE is not set). Use the Workflow tool locally.");
  let r = Z.CLAUDE_REMOTE_WORKFLOW_SCRIPT;
  if (r === void 0 || r === "")
    return E_r("env-missing", `${Vxo} is not set. This command is the deterministic entry point for sessions launched with an environment-delivered workflow script; it has no interactive use.`);
  let n = $pn(); if (n) return E_r("policy-gate", n);
  let o, i = Z.CLAUDE_REMOTE_WORKFLOW_ARGS;
  if (i !== void 0 && i !== "") {
    if (i.length > o1) return E_r("args-too-large", `${KPs} exceeds ${o1} bytes.`);
    try { o = JSON.parse(i); } catch (a) { return E_r("args-parse", `${KPs} is not valid JSON: ${…}`); }
  }
  return { type: "text", value: (await bBo({ script: r, args: o, telemetrySource: "remote_env", context: t })).line };
};
RD_ = { type: "local", name: "__remote-workflow",
        description: "Run the workflow script delivered in this session environment (server-launched sessions only)",
        isHidden: !0, disableModelInvocation: !0, supportsNonInteractive: !0, load: … };

// READABLE (for understanding):
const remoteWorkflowCommand = async (_args, context) => {
  if (!env.CLAUDE_CODE_REMOTE)
    return errorLine("not-remote-session",
      "this command only runs inside a remote (CCR) session (CLAUDE_CODE_REMOTE is not set). Use the Workflow tool locally.");
  const script = env.CLAUDE_REMOTE_WORKFLOW_SCRIPT;
  if (!script)
    return errorLine("env-missing",
      "CLAUDE_REMOTE_WORKFLOW_SCRIPT is not set. This command is the deterministic entry point for "
    + "sessions launched with an environment-delivered workflow script; it has no interactive use.");
  const denied = checkServerWorkflowPolicy();          // ← no carve-out on this path
  if (denied) return errorLine("policy-gate", denied);

  let args;
  const rawArgs = env.CLAUDE_REMOTE_WORKFLOW_ARGS;
  if (rawArgs) {
    if (rawArgs.length > MAX_WORKFLOW_SCRIPT_BYTES) return errorLine("args-too-large", "…");
    try { args = JSON.parse(rawArgs); } catch (e) { return errorLine("args-parse", "…"); }
  }
  const outcome = await runServerAuthoredWorkflow({ script, args, telemetrySource: "remote_env", context });
  return { type: "text", value: outcome.line };
};

// Mapping: ID_→remoteWorkflowCommand, E_r→errorLine (:502325-502327), Vxo→"CLAUDE_REMOTE_WORKFLOW_SCRIPT" (:386785),
//          KPs→"CLAUDE_REMOTE_WORKFLOW_ARGS" (:386786), o1→MAX_WORKFLOW_SCRIPT_BYTES (=524288, :162044),
//          bBo→runServerAuthoredWorkflow (:502211), RD_→REMOTE_WORKFLOW_COMMAND
```

**Why a hidden slash command rather than a startup hook.** The three flags say it:
`isHidden: true` (never in `/help`), `disableModelInvocation: true` (the model cannot call it), and
`supportsNonInteractive: true` (it works with `-p`). Routing through the command dispatcher rather
than a bespoke startup path means the launch inherits everything a normal turn has — the tool-use
context, the permission context, the task registry, transcript recording, and the notification queue
— without any of it having to be constructed twice. The description calls it *"the deterministic
entry point"*, which is exactly what it is: a launcher that wants "run this script and print the
result" needs a single, stable, argument-free command to put in its session bootstrap.

The command-classification table registers it as an **`"agent"`**-class command (`:743886-743887`)
alongside `workflow-launch-exec` — i.e. commands that spawn agent work rather than merely displaying
information.

---

## 4. Path B — the `workflow_launch` carrier event

### 4.1 Ingress, and the two places it is refused

The event type is threaded through the stream-json message plumbing at three points:

- **Accepted** as a known top-level type (`:840204-840216`) — it bypasses the usual
  "unknown message type" rejection and is returned verbatim.
- **Refused on the stdin lane** (`:840708-840715`):

  ```javascript
  // ORIGINAL:
  if (typeof o === "object" && o !== null && o.type === "workflow_launch")
    return (Sr("warn", "cli_stdin_workflow_launch_dropped", {}),
            w("[remote-io] dropped a workflow_launch frame from the stdin lane (server-authored-only type; SSE is its only ingress)", { level: "warn" }),
            !1);

  // READABLE: a workflow_launch arriving on stdin is dropped with a warning — the type is
  //           server-authored-only and SSE is its ONLY legitimate ingress.
  ```

- **Refused on SSE when the envelope disagrees with the payload** (`:416596-416598`):

  ```javascript
  // ORIGINAL:
  else if (n.type === "workflow_launch" && r.event_type !== "workflow_launch")
    (Sr("warn", "cli_sse_workflow_launch_event_type_mismatch", { event_type: r.event_type }), this.onEventVetoed?.(r));

  // READABLE: the SSE envelope's `event_type` must independently say "workflow_launch".
  //           A payload that claims the type inside an envelope typed as something else is vetoed.
  ```

**Why two independent refusals for one type.** Together they establish that a `workflow_launch` is
only honoured when it came down the authenticated server channel *and* was labelled as such by the
server at the envelope layer. The stdin drop closes local injection (anything that can write to the
CLI's stdin — a wrapper script, a compromised pipe — could otherwise queue a launch). The
envelope-match check closes payload smuggling inside an unrelated event type, which matters because
`event_type` is what any server-side routing, filtering or audit would key on. The wiring at
`:849022` makes the same point structurally: the handler receives
`isRemoteTransport: () => e instanceof Iet` (`Iet` is the SSE transport class, `:840800`), and
`handleWorkflowLaunchEvent` re-checks it (`:502503`).

### 4.2 The handler

```javascript
// ============================================
// handleWorkflowLaunchEvent - Validate, fetch, verify, and hand off a server-authored launch
// Location: cli_inner_pretty.js:502491-502583
// ============================================

// ORIGINAL (for source lookup — first 20 of ~90 lines; the rest is the same early-return shape):
async function OD_(e, t) {
  let r = typeof e.uuid === "string" ? e.uuid : void 0;
  if (!r) { k6s(t, "launch-payload", "event has no uuid", {}); return; }
  let { ledger: n } = t.state, o = n.get(r);
  if (o) { if (o.outcome !== "pending") t.ackProcessed(r); return; }
  if (!t.isRemoteTransport() || !Z.CLAUDE_CODE_REMOTE || !Z.CLAUDE_CODE_REMOTE_SESSION_ID) {
    k6s(t, "not-remote-session", "workflow_launch received outside a remote (CCR) session", { launchUuid: r }); return;
  }
  let i = sZd(e);
  if (!i.ok) { EBo(t, r, "launch-payload", i.error, { launchUuid: r }); return; }
  let s = i.pointer, a = { launchUuid: r, artifactSha256: s.artifactSha256 },
    l = $pn({ serverAuthoredCarrier: !0 });
  if (l) { EBo(t, r, "policy-gate", l, a); return; }
  let { firstLaunch: c } = t.state;
  if (c && c.eventUuid !== r) {
    EBo(t, r, "launch-protocol",
      "a second distinct workflow_launch event arrived in this session; at most one launch per session is permitted", a);
    return;
  }
  /* … fetch → size/digest → decode → args → handoff slot → prependUserMessage … */
}

// READABLE (for understanding — the full ~90-line cascade, annotated):
async function handleWorkflowLaunchEvent(event, host) {
  const uuid = typeof event.uuid === "string" ? event.uuid : undefined;
  if (!uuid) { failTransient(host, "launch-payload", "event has no uuid", {}); return; }

  // 1. IDEMPOTENCE — a redelivered event is acked, never re-run.
  const { ledger } = host.state;
  const prior = ledger.get(uuid);
  if (prior) { if (prior.outcome !== "pending") host.ackProcessed(uuid); return; }

  // 2. TRANSPORT — must be a real remote session on the SSE transport.
  if (!host.isRemoteTransport() || !env.CLAUDE_CODE_REMOTE || !env.CLAUDE_CODE_REMOTE_SESSION_ID) {
    failTransient(host, "not-remote-session", "workflow_launch received outside a remote (CCR) session", { launchUuid: uuid });
    return;
  }

  // 3. POINTER SHAPE
  const parsed = parseWorkflowLaunchPointer(event);
  if (!parsed.ok) { failFinal(host, uuid, "launch-payload", parsed.error, { launchUuid: uuid }); return; }
  const pointer = parsed.pointer;
  const ctx = { launchUuid: uuid, artifactSha256: pointer.artifactSha256 };

  // 4. POLICY — with the review-origin carve-out (§2)
  const denied = checkServerWorkflowPolicy({ serverAuthoredCarrier: true });
  if (denied) { failFinal(host, uuid, "policy-gate", denied, ctx); return; }

  // 5. AT MOST ONE LAUNCH PER SESSION
  const { firstLaunch } = host.state;
  if (firstLaunch && firstLaunch.eventUuid !== uuid) {
    failFinal(host, uuid, "launch-protocol",
      "a second distinct workflow_launch event arrived in this session; at most one launch per session is permitted", ctx);
    return;
  }
  const entry = { eventUuid: uuid, outcome: "pending" };
  ledger.set(uuid, entry);
  host.state.firstLaunch = entry;

  const failAndUnclaim = (layer, msg) => {
    if (host.state.firstLaunch === entry) host.state.firstLaunch = null;   // release the slot
    failFinal(host, uuid, layer, msg, ctx);
  };

  // 6. FETCH the staged bundle
  const fetched = await host.fetchBundle(pointer.filestorePath);
  if (!fetched.ok) {
    if (fetched.gated) { failAndUnclaim("bundle-fetch", `bundle fetch gated: ${fetched.error}`); return; }
    ledger.delete(uuid);                                   // ← TRANSIENT: forget it entirely …
    if (host.state.firstLaunch === entry) host.state.firstLaunch = null;
    postFailureLine(host, "bundle-fetch", `bundle fetch failed: ${fetched.error}`, ctx);   // … no ack …
    countTransient("workflow_event_launch", "bundle_fetch_transient");                      // … so it can be retried
    return;
  }

  // 7. SIZE + DIGEST — both pinned by the event
  const buf = fetched.buf;
  if (buf.byteLength > MAX_LAUNCH_BUNDLE_BYTES || buf.byteLength !== pointer.bundleSizeBytes) {
    failAndUnclaim("payload-digest-mismatch",
      `staged bundle is ${buf.byteLength} bytes, event pinned ${pointer.bundleSizeBytes}`); return;
  }
  if (!workflowBundleDigestMatches(buf, pointer.artifactSha256)) {
    failAndUnclaim("payload-digest-mismatch",
      "staged bundle sha256 does not match the artifact_sha256 the event pinned"); return;
  }

  // 8. DECODE + args
  const decoded = decodeWorkflowBundle(buf);
  if (!decoded.ok) { failAndUnclaim("launch-payload", decoded.error); return; }
  let args;
  if (decoded.argsJson !== "") {
    try { args = JSON.parse(decoded.argsJson); }
    catch (e) { failAndUnclaim("args-parse", `args_json is not valid JSON: ${msg(e)}`); return; }
  }

  // 9. HAND OFF via a one-shot slot, then inject a hidden user turn
  host.state.firstLaunch = entry;
  const slot = crypto.randomUUID();
  handoffSlots.set(slot, {
    script: decoded.script, args,
    postResultLine: (line) => postSystemResultEvent(host, line, ctx),
    onRunSettled: (ok) => { entry.outcome = ok ? "executed" : "run-failed"; },
  });
  host.prependUserMessage(`/workflow-launch-exec ${slot}`);
  host.ackProcessed(uuid);
  logEvent("tengu_workflow_launch_event", { ok: true });
  countSuccess("workflow_event_launch");
  structuredLog("info", "workflow_launch_dispatched", {});
}

// Mapping: OD_→handleWorkflowLaunchEvent, DD_→createWorkflowLaunchState (:502461),
//          sZd→parseWorkflowLaunchPointer (:502408), aZd→workflowBundleDigestMatches (:502434),
//          lZd→decodeWorkflowBundle (:502439), Fpn→handoffSlots (:502591/:502609), cZd→postSystemResultEvent (:502474),
//          uZd→postFailureLine (:502480), k6s→failTransient (:502485), EBo→failFinal (:502488),
//          Npn→MAX_LAUNCH_BUNDLE_BYTES (=4194304, :502588), Sr→structuredLog (:52758)
```

### 4.3 Design points

**The ledger is a three-state machine, and the states are load-bearing.** Entries are
`"pending"` → `"executed"` | `"run-failed"` | `"failed-final"`. The ack policy differs by state:

| Outcome | `ackProcessed` called? | Effect on redelivery |
|---|---|---|
| `pending` | no | a redelivery is ignored (step 1 returns without acking) — the in-flight run is not duplicated |
| `failed-final` | yes, at failure time (`:502489`) | redelivery is acked and dropped |
| `executed` / `run-failed` | yes, at dispatch (`:502580`) | redelivery is acked and dropped |
| **transient fetch failure** | **no — the entry is deleted** (`:502542`) | the server may legitimately re-send |

That last row is the interesting one. A digest mismatch, a bad pointer, or a policy denial are all
**final** — the ledger keeps a tombstone and the event is acked, because retrying cannot help and
retrying a *tampered* bundle definitely must not happen. A bundle-fetch failure that is not "gated"
is **transient** — the ledger entry is deleted and the event is deliberately **not** acked, so the
server can retry. Distinguishing these two is the difference between a resilient channel and one
that either loses work or replays attacks. Note the "gated" sub-case (`fetched.gated`, `:502538`) is
treated as *final*, because a gated fetch is a policy answer, not a network hiccup.

**At most one launch per session** (`:502519-502529`). `firstLaunch` pins the first event's uuid; a
*different* uuid is refused with the `launch-protocol` layer, while the *same* uuid falls through the
idempotence check at step 1. The constraint makes the session a single-purpose worker: one server
launch, one result line, one lifetime. Combined with the result-posting protocol (§6), it means the
server can correlate "this session" with "this workflow" without any additional bookkeeping. The slot
is released on every final failure (`failAndUnclaim`) so a rejected launch does not permanently burn
the session's one chance.

**The handoff slot indirection** (`:502570-502579`) is the subtlest part. The handler does not run
the workflow. It stashes `{script, args, postResultLine, onRunSettled}` in a module-level `Map` under
a fresh UUID and injects the *text* `/workflow-launch-exec <uuid>` as a prepended user message. Three
reasons:

1. **The script never enters the transcript.** Only the opaque slot id does. A workflow script can be
   512 KB; putting it in a user message would consume the context window and be replayed on every
   subsequent turn.
2. **Execution happens in a normal turn**, with a real tool-use context, permission context and task
   registry — none of which exist at SSE-frame-handling time.
3. **Replay safety.** `takeWorkflowLaunchHandoff` (`H6s`, `:502464-502467`) is a **destructive read**
   — `get` then `delete`. When a restored session replays its transcript, the dispatch turn re-runs,
   finds no slot, and reports so explicitly rather than re-executing:

   ```javascript
   // ORIGINAL (:502617-502623):
   Sr("info", "workflow_launch_exec_no_slot", {}),
   { type: "text", value: "workflow-launch-exec: no pending launch handoff for this invocation (expected when a restored session replays the dispatch turn); nothing executed." }
   ```

   The message names the expected cause, which is the mark of a case the authors hit and understood
   rather than guessed at.

---

## 5. The bundle format

### 5.1 The pointer

```javascript
// ============================================
// parseWorkflowLaunchPointer - Validate the event's four pointer fields
// Location: cli_inner_pretty.js:502408-502433
// ============================================

// ORIGINAL (for source lookup):
function sZd(e) {
  let t = (s) => ({ ok: !1, error: s }), r = e.filestore_path;
  if (typeof r !== "string" || r.length === 0) return t("filestore_path is missing or not a non-empty string");
  if (r.includes("\x00") || r.split("/").includes("..") || !r.startsWith(vBo) || r.length === vBo.length)
    return t(`filestore_path must be under ${vBo}`);
  let n = e.artifact_sha256;
  if (typeof n !== "string" || !/^[0-9a-f]{64}$/.test(n)) return t("artifact_sha256 is missing or not 64 lowercase hex chars");
  let o = e.bundle_size_bytes;
  if (typeof o !== "number" || !Number.isSafeInteger(o) || o <= 0) return t("bundle_size_bytes is missing or not a positive integer");
  if (o > Npn) return t(`bundle_size_bytes exceeds ${Npn}`);
  return { ok: !0, pointer: {
    workflowName: typeof e.workflow_name === "string"
      ? e.workflow_name.replace(/[\x00-\x1f\x7f-\x9f\u2028\u2029]/g, "").slice(0, 200) : "",
    filestorePath: r, artifactSha256: n, bundleSizeBytes: o } };
}

// READABLE (for understanding):
const WORKFLOW_BUNDLE_FILESTORE_PREFIX = "/.workflow/";      // vBo, :502589
const MAX_LAUNCH_BUNDLE_BYTES = 4 * 1024 * 1024;             // Npn, :502588

function parseWorkflowLaunchPointer(event) {
  const fail = (error) => ({ ok: false, error });
  const path = event.filestore_path;
  if (typeof path !== "string" || path.length === 0) return fail("filestore_path is missing or not a non-empty string");
  if (path.includes("\0")                      // NUL truncation
   || path.split("/").includes("..")           // traversal, component-wise not substring
   || !path.startsWith(WORKFLOW_BUNDLE_FILESTORE_PREFIX)
   || path.length === WORKFLOW_BUNDLE_FILESTORE_PREFIX.length)   // the bare prefix is not a file
    return fail(`filestore_path must be under ${WORKFLOW_BUNDLE_FILESTORE_PREFIX}`);
  const sha = event.artifact_sha256;
  if (typeof sha !== "string" || !/^[0-9a-f]{64}$/.test(sha))
    return fail("artifact_sha256 is missing or not 64 lowercase hex chars");
  const size = event.bundle_size_bytes;
  if (typeof size !== "number" || !Number.isSafeInteger(size) || size <= 0)
    return fail("bundle_size_bytes is missing or not a positive integer");
  if (size > MAX_LAUNCH_BUNDLE_BYTES) return fail(`bundle_size_bytes exceeds ${MAX_LAUNCH_BUNDLE_BYTES}`);
  return { ok: true, pointer: {
    workflowName: typeof event.workflow_name === "string"
      ? event.workflow_name.replace(/[\x00-\x1f\x7f-\x9f\u2028\u2029]/g, "").slice(0, 200)   // control chars stripped
      : "",
    filestorePath: path, artifactSha256: sha, bundleSizeBytes: size } };
}

// Mapping: sZd→parseWorkflowLaunchPointer, vBo→WORKFLOW_BUNDLE_FILESTORE_PREFIX, Npn→MAX_LAUNCH_BUNDLE_BYTES
```

Each check is doing a specific job:

- **`path.split("/").includes("..")`, not `path.includes("..")`.** The substring form would reject
  the legitimate `/.workflow/my..name.bin`; the component form rejects exactly the traversal segment.
- **`length === prefix.length`** rejects the bare `/.workflow/` — a prefix match alone would allow
  addressing the directory itself.
- **`\0` rejection** guards against a path that a downstream C-string consumer would truncate to a
  different location.
- **`workflow_name` is stripped of C0/C1 controls and `U+2028`/`U+2029`, then capped at 200.** This
  field is *display* text of server origin; the line-separator characters are the ones that would let
  it break out of the single-line result protocol (§6).
- **Size is pinned twice** — here (a *claim*) and again after the fetch against the actual byte length
  (`:502548`). A bundle that is the right size but the wrong content fails the digest; a bundle that
  is the right content but a different length fails here. Both are needed because the fetch is a
  separate trust domain from the event.

### 5.2 The binary bundle

```javascript
// ============================================
// decodeWorkflowBundle - v1 length-prefixed two-frame container
// Location: cli_inner_pretty.js:502439-502460
// ============================================

// ORIGINAL (for source lookup):
function lZd(e) {
  let t = (s) => ({ ok: !1, error: s });
  if (e.length < 1) return t("bundle is empty");
  if (e[0] !== x6s) return t(`unsupported bundle format version ${e[0]} (expected ${x6s})`);
  let r = 1,
    n = (s, a) => {
      if (r + 8 > e.length) return { ok: !1, error: `bundle truncated in ${a} length frame` };
      let l = e.readBigUInt64BE(r);
      if (((r += 8), l > BigInt(s))) return { ok: !1, error: `${a} frame exceeds ${s} bytes` };
      let c = Number(l);
      if (r + c > e.length) return { ok: !1, error: `bundle truncated in ${a} frame` };
      let u = e.subarray(r, r + c);
      return ((r += c), { ok: !0, buf: u });
    },
    o = n(o1, "script");
  if (!o.ok) return t(o.error);
  if (o.buf.length === 0) return t("script frame is empty");
  let i = n(Npn, "args_json");
  if (!i.ok) return t(i.error);
  if (r !== e.length) return t(`bundle has ${e.length - r} trailing bytes`);
  return { ok: !0, script: o.buf.toString("utf8"), argsJson: i.buf.toString("utf8") };
}

// READABLE (for understanding):
const WORKFLOW_BUNDLE_FORMAT_VERSION = 1;   // x6s, :502590

//   byte 0        : format version (must be 1)
//   bytes 1..8    : script length, big-endian uint64
//   next N bytes  : script, UTF-8
//   next 8 bytes  : args_json length, big-endian uint64
//   next M bytes  : args_json, UTF-8 ("" means no args)
//   (nothing else — trailing bytes are an error)
function decodeWorkflowBundle(buf) {
  const fail = (error) => ({ ok: false, error });
  if (buf.length < 1) return fail("bundle is empty");
  if (buf[0] !== WORKFLOW_BUNDLE_FORMAT_VERSION)
    return fail(`unsupported bundle format version ${buf[0]} (expected ${WORKFLOW_BUNDLE_FORMAT_VERSION})`);

  let offset = 1;
  const readFrame = (maxBytes, name) => {
    if (offset + 8 > buf.length) return { ok: false, error: `bundle truncated in ${name} length frame` };
    const len = buf.readBigUInt64BE(offset);
    offset += 8;
    if (len > BigInt(maxBytes)) return { ok: false, error: `${name} frame exceeds ${maxBytes} bytes` };
    const n = Number(len);                                    // safe: already bounded above
    if (offset + n > buf.length) return { ok: false, error: `bundle truncated in ${name} frame` };
    const slice = buf.subarray(offset, offset + n);
    offset += n;
    return { ok: true, buf: slice };
  };

  const script = readFrame(MAX_WORKFLOW_SCRIPT_BYTES, "script");   // 512 KiB
  if (!script.ok) return fail(script.error);
  if (script.buf.length === 0) return fail("script frame is empty");
  const argsJson = readFrame(MAX_LAUNCH_BUNDLE_BYTES, "args_json"); // 4 MiB
  if (!argsJson.ok) return fail(argsJson.error);
  if (offset !== buf.length) return fail(`bundle has ${buf.length - offset} trailing bytes`);
  return { ok: true, script: script.buf.toString("utf8"), argsJson: argsJson.buf.toString("utf8") };
}

// Mapping: lZd→decodeWorkflowBundle, x6s→WORKFLOW_BUNDLE_FORMAT_VERSION, o1→MAX_WORKFLOW_SCRIPT_BYTES
```

**Why a binary container instead of JSON.** The payload is two opaque UTF-8 blobs, one of which is
arbitrary JavaScript. JSON-encoding a 512 KB script means escaping it, roughly doubling the wire size
and forcing a full parse before the digest can be checked against a canonical form. A
length-prefixed container lets the digest be computed over the *exact bytes on the wire*, with no
canonicalisation question at all — which is what makes `timingSafeEqual` against `artifact_sha256`
meaningful.

**Why the length-check ordering is `len > max` *before* `Number(len)`.** `readBigUInt64BE` can return
a value beyond `Number.MAX_SAFE_INTEGER`. Converting first and then comparing would lose precision and
could let a crafted length slip past. Comparing in `BigInt` space and only then narrowing is the
correct order, and it is the kind of detail that is usually got wrong.

**Why trailing bytes are an error.** Accepting them would create a bundle-malleability channel: two
byte sequences that decode to the same `(script, args)` but hash differently — or, worse, a canonical
bundle with appended data that some other consumer interprets. Strict length equality makes the
encoding bijective.

**Why the version byte is checked before anything else** and produces a *specific* message naming both
the seen and expected version: this is the format's only forward-compatibility hinge, and a server
rolling out v2 needs the client's rejection to be diagnosable rather than a generic parse failure.

### 5.3 The digest check

```javascript
// ORIGINAL (:502434-502438):
function aZd(e, t) {
  let r = zBt.createHash("sha256").update(e).digest(), n = Buffer.from(t, "hex");
  return n.length === r.length && zBt.timingSafeEqual(r, n);
}

// READABLE:
function workflowBundleDigestMatches(bundleBytes, expectedHex) {
  const actual = crypto.createHash("sha256").update(bundleBytes).digest();
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}
```

The explicit length guard before `timingSafeEqual` is required, not decorative — Node's
`timingSafeEqual` **throws** on length mismatch, and `Buffer.from(x, "hex")` silently truncates at the
first invalid hex pair, so a malformed digest would otherwise crash the handler instead of failing it.
(The regex in `parseWorkflowLaunchPointer` already guarantees 64 hex chars, so this is defence in
depth against a future caller that skips the pointer parse.)

---

## 6. The result protocol

The session answers on the same wire, as a **single line** with a fixed prefix.

```javascript
// ============================================
// Result-line construction and sanitisation
// Location: cli_inner_pretty.js:502189-502204, :502259-502296
// ============================================

// ORIGINAL (for source lookup):
function kD_(e) {
  let t = e.replace(/[\r\n\v\f\x1c\x1d\x1e\u0085\u2028\u2029]+/g, " ").replaceAll("remote-workflow:", "remote-workflow;");
  if (t.length > ZQd) t = `${t.slice(0, ZQd)}\u2026[truncated]`;
  return t;
}
function Opn(e, t) { return `remote-workflow: error[${e}]: ${kD_(t)}`; }
function Mpn(e) {
  let t = Ie(e);
  return t === void 0 ? void 0
    : t.replaceAll("\x85", "\\u0085").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}

// READABLE (for understanding):
const MAX_ERROR_TEXT = 4000;      // ZQd, :502306
const MAX_RESULT_LINE = 100_000;  // S_r, :502305

function sanitiseErrorText(text) {
  let out = text
    .replace(/[\r\n\v\f\x1c\x1d\x1e\u0085\u2028\u2029]+/g, " ")   // collapse EVERY line terminator
    .replaceAll("remote-workflow:", "remote-workflow;");           // defuse a forged second line
  if (out.length > MAX_ERROR_TEXT) out = `${out.slice(0, MAX_ERROR_TEXT)}…[truncated]`;
  return out;
}
function errorResultLine(layer, text) { return `remote-workflow: error[${layer}]: ${sanitiseErrorText(text)}`; }

function serialiseResultJson(value) {
  const json = JSON.stringify(value);
  return json === undefined ? undefined
    : json.replaceAll("\u0085", "\\u0085")     // JSON.stringify does NOT escape these three,
          .replaceAll("\u2028", "\\u2028")     // but they ARE line terminators to a JS/line parser
          .replaceAll("\u2029", "\\u2029");
}

// Mapping: kD_→sanitiseErrorText, Opn→errorResultLine, Mpn→serialiseResultJson,
//          ZQd→MAX_ERROR_TEXT, S_r→MAX_RESULT_LINE, Ie→JSON.stringify
```

**The `remote-workflow:` → `remote-workflow;` substitution is a line-protocol injection defence.**
Because the protocol is "one line beginning with `remote-workflow: `", any *content* that contains
that same prefix could — once line terminators were collapsed — be mistaken for a second, forged
result by a lenient parser. Rewriting the colon to a semicolon in error text makes the prefix
unforgeable from inside the payload. The character class collapsed alongside it is deliberately
exhaustive: `\r \n \v \f \x1c \x1d \x1e \u0085 \u2028 \u2029` — file/group/record separators and the
Unicode line terminators, not just `\n`.

**`serialiseResultJson` escapes exactly the three characters `JSON.stringify` leaves raw.** `U+2028`
and `U+2029` are valid inside a JSON string but are *line terminators* to a JavaScript parser and to
most line-oriented readers; `U+0085` (NEL) is a line terminator to several. This is the well-known
"JSON is not a subset of JavaScript" hazard, handled correctly.

**The four-stage size ladder** (`:502261-502293`) is the most careful piece of the protocol. The
success line must fit in `MAX_RESULT_LINE = 100_000` chars. Rather than truncating blindly, the code
degrades in a stated priority order:

```javascript
// READABLE (paraphrasing :502261-502293):
let line = serialiseResultJson(payload);                    // {status, workflowName, runId, agentCount,
                                                            //  durationMs, failures, result}
if (line === undefined || line.length > MAX_RESULT_LINE) {
  const why = line === undefined ? "not serializable" : `${line.length} chars exceeds ${MAX_RESULT_LINE}`;

  // 1. cap the failure list: first 20, each ≤500 chars, with an "…and N more" marker
  let trimmed = payload.failures.slice(0, 20).map((f) => f.length > 500 ? `${f.slice(0,500)}…[truncated]` : f);
  if (payload.failures.length > trimmed.length)
    trimmed.push(`…and ${payload.failures.length - trimmed.length} more failures omitted`);
  line = serialiseResultJson({ ...payload, failures: trimmed });

  // 2. still too big → drop failures entirely, keeping the RESULT
  if (line === undefined || line.length > MAX_RESULT_LINE)
    line = serialiseResultJson({ ...payload,
      failures: [`<${payload.failures.length} failures omitted: diagnostics never outrank the result payload>`] });

  // 3. still too big → now sacrifice the result, restoring the trimmed failures
  if (line === undefined || line.length > MAX_RESULT_LINE)
    line = serialiseResultJson({ ...payload, failures: trimmed, result: `<result omitted: ${why}>` });

  // 4. last resort → a minimal envelope; if even that fails, a hard-coded literal
  if (line === undefined || line.length > MAX_RESULT_LINE)
    line = serialiseResultJson({ status: "completed", workflowName: String(name).slice(0, 200), runId,
                                 agentCount, durationMs,
                                 failures: [`<${payload.failures.length} failures omitted: fallback exceeded ${MAX_RESULT_LINE}>`],
                                 result: `<result omitted: ${why}>` })
        ?? '{"status":"completed"}';
}
return { ok: true, line: `remote-workflow: ${line}`, workflowName: meta.name };
```

**The priority is stated in the source itself** — *"diagnostics never outrank the result payload"*
(`:502285`). Stage 2 removes *all* failure text before touching the result; only when that is still
insufficient does stage 3 sacrifice the result. Every degradation is *self-describing*: the receiver
always learns what was dropped and why (`<result omitted: 143221 chars exceeds 100000>`), never
receiving a silently truncated value. And the terminal fallback is a string literal
`'{"status":"completed"}'`, so the function cannot return `undefined` no matter what.

Note what stage 4 preserves: `status`, `workflowName`, `runId`, `agentCount`, `durationMs`. The
`runId` in particular means even the most degraded response still lets a human resume or inspect the
run locally.

**Non-success outcomes** map to error layers (`:502297-502302`): `failed` →
`workflow-failed` with duration and agent count, `killed` → `killed`, `adopted`/`unknown` →
`unexpected-state`.

**Posting.** `postSystemResultEvent` (`cZd`, `:502474-502479`) emits a stream-json frame:

```javascript
// READABLE:
function postSystemResultEvent(host, artifactLine, ctx) {
  const evt = { type: "system", subtype: "workflow_launch_result",   // iZd, :502587
                artifact_line: artifactLine, uuid: crypto.randomUUID(),
                session_id: host.getSessionId() };
  if (ctx.launchUuid !== undefined) evt.launch_uuid = ctx.launchUuid;         // correlate to the request
  if (ctx.artifactSha256 !== undefined) evt.artifact_sha256 = ctx.artifactSha256;
  host.postEvent(evt);
}
```

Echoing `launch_uuid` and `artifact_sha256` back lets the server correlate the answer with the
request *and* confirm which artifact actually ran — the latter mattering because the client verified
the digest and the server is entitled to see that verification reflected.

---

## 7. Error layers — two vocabularies, deliberately different

Two exported layer lists exist, and they do **not** match:

```javascript
// HD_ (:502360-502374) — the __remote-workflow (env) path, 13 layers:
["not-remote-session","env-missing","policy-gate","script-too-large","control-chars","args-too-large",
 "args-parse","meta-parse","nondeterminism","compile","workflow-failed","killed","unexpected-state"]

// LD_ (:502600-502607) — WORKFLOW_LAUNCH_ERROR_LAYERS, the carrier path, 7 layers:
["not-remote-session","launch-payload","bundle-fetch","payload-digest-mismatch","args-parse",
 "policy-gate","launch-protocol"]
```

The split is exactly the *transport* boundary. The carrier list covers everything that can go wrong
**getting the script into the process** (pointer shape, fetch, digest, protocol, args). The env list
covers everything that can go wrong **with the script itself** (size, control characters, meta parse,
nondeterminism, compile) plus the run outcomes. They overlap on only three layers —
`not-remote-session`, `policy-gate`, `args-parse` — because those are the checks both paths must
perform independently.

That is not duplication: the carrier path *also* hits the script-level layers, but by then it is
inside `runServerAuthoredWorkflow`, whose own `i(layer, msg)` helper (`:502212`) uses the env
vocabulary. So the two lists are the union of a shared executor's vocabulary and one path's extra
ingress vocabulary — and `WORKFLOW_LAUNCH_ERROR_LAYERS` is exported precisely so a server can
enumerate what it might see on the wire.

**Every layer name appears in a `remote-workflow: error[<layer>]: …` line and in
`tengu_workflow_launch_event { ok: false, layer }`**, so the same taxonomy drives both the on-wire
diagnostic and the metric. `fe(layer)` is the redaction wrapper — the layer set is closed and
enumerable, so it is safe to emit verbatim.

---

## 8. What the shared executor does differently

`runServerAuthoredWorkflow` (`bBo`, `:502211-502303`) re-implements the tool's `call` path with four
deliberate differences:

| | `WorkflowTool.call` | `runServerAuthoredWorkflow` |
|---|---|---|
| Permission dialog | `checkPermissions` → `ask` by default | **none** — no user is present |
| Validation | 5 gates in `validateInput` | inline: policy, size, control chars, meta, nondeterminism, compile (`:502213-502225`) |
| Notification | `qxo` task-notification to the model | **suppressed** (`suppressCompletionNotification: true`, `:502257`) |
| Result delivery | tool result + notification | `onSettled` → one `remote-workflow:` line |

```javascript
// READABLE (from :502212-502227):
const fail = (layer, text) => ({ ok: false, layer, line: errorResultLine(layer, text) });
const denied = checkServerWorkflowPolicy({ serverAuthoredCarrier });
if (denied) return fail("policy-gate", denied);
if (script.length > MAX_WORKFLOW_SCRIPT_BYTES) return fail("script-too-large", `workflow script exceeds ${…} bytes.`);
if (!hasNoHiddenControlChars(script))  return fail("control-chars", "workflow script contains disallowed control characters.");
const parsed = parseWorkflowScriptMeta(script);          if ("error" in parsed) return fail("meta-parse", `invalid workflow script: ${parsed.error}`);
if (hasNondeterministicCall(parsed.scriptBody))    return fail("nondeterminism", "workflow scripts must be deterministic: …");
const compiled = compileWorkflowScript(parsed.scriptBody);
if (!compiled.ok) return fail("compile", `workflow script compile failed: ${compiled.error}`);
```

Note it applies `VHe` (`:323495-323498` — rejects any code point the terminal would hide; the tool applies it via a zod `.refine` at `:389260`) and `Uxo` (the nondeterminism AST check) **unconditionally** — whereas the tool path skips
the nondeterminism check for `scriptPath`/`name` inputs (`if (e.script && Uxo(...))`, `:389414`). The
server-authored path is stricter, which is right: there is no human to notice a runtime failure.

Telemetry differs too. `tengu_workflow_launched` is emitted at `:502231-502239` with **seven** fields
instead of nine — `workflow_name` and `workflow_description` are computed (`Qxo`/`Zxo` at `:502228-502229`)
but **not** included in the event, because `scriptIsVerbatimBuiltIn` is hard-coded `false` and the
redactors would emit `"custom"`/`""` anyway. `invocation_mode` and `workflow_source` both carry the
`telemetrySource` (`"remote_env"` or `"remote_event"`), which is how these launches are distinguished
from tool launches in aggregate.

The run is awaited via a promise around `onSettled` (`:502240-502258`) — the only place in the
codebase that uses `Osn`'s `onSettled` hook — so the caller can build the result line synchronously
after completion.

---

## 9. Assessment

**What this subsystem is for.** The shape is unambiguous: a server-side product that needs to run a
deterministic, multi-agent JavaScript program inside a customer's checkout, with a verifiable
artifact and a single structured answer. The `CLAUDE_CODE_REMOTE_SESSION_ORIGIN === "review"`
carve-out names the first such product. `.196`'s changelog bullet *"`/code-review` workflow: merged
five cleanup finders into one, −25% tokens"* shows the review pipeline **is** a workflow; this channel
is how the server ships it rather than baking it into the client.

**What is well done:**

- Digest-pinned artifacts with `timingSafeEqual` and a length pre-check.
- A bijective wire format with no malleability (strict length, no trailing bytes, BigInt-safe frames).
- Two independent ingress refusals (stdin lane, envelope-type mismatch).
- A ledger that distinguishes final from transient failures, so retries are possible without replays.
- A destructive-read handoff slot that makes transcript replay a no-op with an explicit message.
- A four-stage degradation ladder with a written priority (*"diagnostics never outrank the result
  payload"*) and self-describing omissions.
- Line-protocol injection defence (`remote-workflow:` → `remote-workflow;`) and the `U+2028`/`U+2029`/`U+0085`
  escaping that most implementations miss.

**What deserves scrutiny:**

- **The `allow_workflows` bypass** (§2). A review-origin server-authored launch runs in an org that
  has *not* enabled workflows. Only `disableWorkflows` stops it. Whether this is intended is a
  product question; that it is undocumented is not in doubt.
- **No permission dialog on either path.** Correct given the trust model (the server is already
  trusted to send prompts), but it means the digest pin *is* the entire integrity story for the
  script. If the filestore and the event channel ever share a compromise, there is no second factor.
- **`workflowName` from the pointer is parsed, sanitised — and then unused.** `parseWorkflowLaunchPointer`
  produces `pointer.workflowName`, and the handler never reads it; the name that reaches telemetry and
  the result line comes from `meta.name` in the decoded bundle. Harmless, and arguably correct (the
  bundle is the digest-pinned truth), but it means the event's `workflow_name` is decorative.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md).
> Names marked **(exported)** are leaked verbatim by the module's own export map at `:502392-502407`
> and are therefore ground truth, not inference.

Key functions in this document:
- `handleWorkflowLaunchEvent` (OD_) **(exported)** - `:502491-502583`
- `parseWorkflowLaunchPointer` (sZd) **(exported)** - `:502408-502433`
- `decodeWorkflowBundle` (lZd) **(exported)** - `:502439-502460`
- `workflowBundleDigestMatches` (aZd) **(exported)** - `:502434-502438`
- `createWorkflowLaunchState` (DD_) **(exported)** - `:502461-502463`
- `takeWorkflowLaunchHandoff` (H6s) **(exported)** - `:502464-502467` — destructive read
- `WORKFLOW_LAUNCH_RESULT_SUBTYPE` (iZd) **(exported)** - `:502587` = `"workflow_launch_result"`
- `WORKFLOW_LAUNCH_ERROR_LAYERS` (LD_) **(exported)** - `:502600-502607`
- `WORKFLOW_BUNDLE_FORMAT_VERSION` (x6s) **(exported)** - `:502590` = `1`
- `WORKFLOW_BUNDLE_FILESTORE_PREFIX` (vBo) **(exported)** - `:502589` = `"/.workflow/"`
- `MAX_LAUNCH_BUNDLE_BYTES` (Npn) **(exported)** - `:502588` = `4194304`
- `runServerAuthoredWorkflow` (bBo) - `:502211-502303` — the shared executor
- `checkServerWorkflowPolicy` ($pn) - `:502205-502210` — the `allow_workflows` carve-out
- `isReviewOriginSession` (JQd) - `:502183-502185`
- `sanitiseErrorText` (kD_) - `:502189-502195`, `errorResultLine` (Opn) - `:502196-502198`, `serialiseResultJson` (Mpn) - `:502199-502204`
- `postSystemResultEvent` (cZd) - `:502474-502479`, `postFailureLine` (uZd) - `:502480-502484`, `failTransient` (k6s) - `:502485-502487`, `failFinal` (EBo) - `:502488-502490`
- `remoteWorkflowCommand` (ID_) - `:502329-502354`, `REMOTE_WORKFLOW_COMMAND` (RD_) - `:502378-502390`
- `workflowLaunchExecCommand` ($D_) - `:502613-502638`, `WORKFLOW_LAUNCH_EXEC_COMMAND` (ND_) - `:502646-502657`
- `MAX_RESULT_LINE` (S_r) - `:502305` = `100000`, `MAX_ERROR_TEXT` (ZQd) - `:502306` = `4000`
- `handoffSlots` (Fpn) - declared `:502591`, initialised `:502609`
