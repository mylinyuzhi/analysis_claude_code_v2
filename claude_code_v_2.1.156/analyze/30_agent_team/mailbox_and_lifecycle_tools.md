# Mailbox Protocol, Lifecycle Tools & Permission Bridge (v2.1.156)

## TL;DR

Both agent-team execution modes — the **in-process** teammate (an async task in the leader's own `claude` process) and the **cross-process** teammate (a separate `claude` process in a tmux pane / iTerm2 split) — talk to each other through one and the same primitive: a **per-recipient JSON inbox file** on disk under `~/.claude/teams/<team>/inboxes/<agent>.json`. Every message — chat text, idle notifications, shutdown requests, permission requests/responses, sandbox-network approvals — is one JSON object appended to that array under an advisory file lock. The leader never speaks "tmux" or "async task" to a teammate; it just writes to a file, and the teammate polls that file every 500 ms. That is the central design decision of the whole subsystem: **a file mailbox is the lowest common denominator that works uniformly across an in-process async boundary *and* a cross-process OS boundary**, so the protocol, the tool surface, and the permission bridge can all be written once.

On top of that mailbox sit three model-facing lifecycle tools — `TeamCreate`, `TeamDelete`, `SendMessage` (the `U57` tool set) — and a system-prompt addendum (`TEAMMATE_SYSTEM_PROMPT_ADDENDUM`) that forces a teammate to *use* `SendMessage` instead of just emitting text (because plain text is never written to anyone's inbox and is therefore invisible to the rest of the team). Finally, the **leader↔teammate permission bridge** (`OT_`) reuses the very same mailbox to let a worker's `canUseTool` either (a) raise an interactive dialog on the leader's terminal with a colored "worker badge", or (b) — when no interactive dialog is available — serialize a `permission_request` into the leader's inbox and **poll its own inbox for a matching `permission_response`** before allowing or rejecting the tool. This document covers the IPC + the public toolset shared by both modes, with faithful dual-version snippets, and cross-validates the mapping against the v2.1.88 named-TypeScript ground truth.

> Contrast with `36_background_agents/`: those are daemon-supervised child processes with their own persisted lifecycle that *survive the leader*. Agent-team teammates are leader-owned and die with the leader REPL — but both modes of an agent-team teammate share the mailbox described here, whereas the background fleet uses a different transport. This doc is mailbox + lifecycle tools only; the two execution modes themselves are in `in_process_mode.md` and `cross_process_mode.md`.

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Team / swarm lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/constants in this document (list format, per CLAUDE.md):

- `getInboxPath` (obfuscated: `jhH`, `cli_inner_pretty.js:338272`) — resolves `<teamsDir>/<team>/inboxes/<agent>.json`.
- `ensureInboxDir` (obfuscated: `HD_`, `cli_inner_pretty.js:338280`) — `mkdir -p` of the inbox dir.
- `readMailbox` (obfuscated: `h_H`, `cli_inner_pretty.js:338286`) — read+parse the whole inbox array (back-fills `type:"message"`).
- `readUnreadMessages` (obfuscated: `whH`, `cli_inner_pretty.js:338301`) — `readMailbox` filtered to `!read`.
- `writeToMailbox` (obfuscated: `aA`, `cli_inner_pretty.js:338306`) — lock → re-read → push → atomic write.
- `markMessageAsReadByIndex` (obfuscated: `JG$`, `cli_inner_pretty.js:338333`) — lock → flip one message's `read` flag.
- `markMessagesAsRead` (obfuscated: `XG$`, `cli_inner_pretty.js:338367`) — mark all unread read.
- `formatMessagesAsTeammateXml` (obfuscated: `$D_`, `cli_inner_pretty.js:338411`) — render an array of messages into stacked `<teammate-message …>` envelopes.
- `formatAsTeammateMessage` (obfuscated: `wU6`, `cli_inner_pretty.js:379576`) — single-message XML envelope used for the spawn prompt.
- `TEAMMATE_MESSAGE_TAG` (obfuscated: `_Z`, `cli_inner_pretty.js:41644`) — the literal `"teammate-message"` tag name.
- `TEAM_LEAD_NAME` (obfuscated: `tY`, `cli_inner_pretty.js:336140`) — the constant `"team-lead"`.
- `createIdleNotification` (obfuscated: `PG$`, `cli_inner_pretty.js:338422`) / `isIdleNotification` (obfuscated: `WG$`, `cli_inner_pretty.js:338434`).
- `createPermissionRequestMessage` (obfuscated: `jx6`, `cli_inner_pretty.js:338441`) / `createPermissionResponseMessage` (obfuscated: `wx6`, `cli_inner_pretty.js:338453`).
- `isPermissionRequest` (obfuscated: `ZG$`, `cli_inner_pretty.js:338468`) / `isPermissionResponse` (obfuscated: `DhH`, `cli_inner_pretty.js:338475`).
- `createShutdownRequestMessage` (obfuscated: `VsH`, `cli_inner_pretty.js:338516`) / `createShutdownApprovedMessage` (obfuscated: `Xx6`, `cli_inner_pretty.js:338525`) / `createShutdownRejectedMessage` (obfuscated: `Lx6`, `cli_inner_pretty.js:338535`).
- `sendShutdownRequestToMailbox` (obfuscated: `oJ8`, `cli_inner_pretty.js:338544`).
- `isShutdownRequest` (obfuscated: `NXH`, `cli_inner_pretty.js:338554`).
- `isControlMessage` (obfuscated: `$X8`, `cli_inner_pretty.js:338613`) — predicate for "this is a protocol message, not chat".
- `LOCK_OPTIONS` (obfuscated: `DG$`, `cli_inner_pretty.js:338697`) — `proper-lockfile` retry/backoff config.
- `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (obfuscated: `jU6`, `cli_inner_pretty.js:379421`, module `H94`).
- `createTeammateCanUseTool` (obfuscated: `OT_`, `cli_inner_pretty.js:379430`) — the permission bridge.
- `createPermissionRequest` (obfuscated: `zX8`, `cli_inner_pretty.js:338774`) — builds a `SwarmPermissionRequest`.
- `sendPermissionRequestViaMailbox` (obfuscated: `AX8`, `cli_inner_pretty.js:338814`) / `sendPermissionResponseViaMailbox` (obfuscated: `YX8`, `cli_inner_pretty.js:338840`).
- `getLeaderName` (obfuscated: `Ya7`, `cli_inner_pretty.js:338807`).
- `registerPermissionCallback` (obfuscated: `OX8`, `cli_inner_pretty.js:338966`) / `unregisterPermissionCallback` (obfuscated: `Ma7`, `cli_inner_pretty.js:338969`) / `processMailboxPermissionResponse` (obfuscated: `SsH`, `cli_inner_pretty.js:338978`).
- `getLeaderSetToolPermissionContext` (obfuscated: `Pa7`, called at `cli_inner_pretty.js:379479`).
- `PERMISSION_POLL_INTERVAL_MS` (obfuscated: `fT_`, `cli_inner_pretty.js:380022`) — `500`.
- Tool name constants `SendMessage` (obfuscated: `cf`, `cli_inner_pretty.js:216283`), `TeamCreate` (obfuscated: `rd`, `cli_inner_pretty.js:216438`), `TeamDelete` (obfuscated: `Oo`, `cli_inner_pretty.js:216439`).
- Tool set `SWARM_TOOL_SET` (obfuscated: `U57`, `cli_inner_pretty.js:216435`).
- Tool defs: `TeamCreateTool` (obfuscated: `Th_`, `cli_inner_pretty.js:406631`), `TeamDeleteTool` (obfuscated: `vh_`, `cli_inner_pretty.js:406775`), `SendMessageTool` (obfuscated: `Bh_`, `cli_inner_pretty.js:407447`).
- Master gate `isAgentTeamsEnabled` (obfuscated: `R7`, `cli_inner_pretty.js:240766`).
- Identity helpers `getAgentId` (obfuscated: `vT`, `:99264`), `getAgentName` (obfuscated: `ZA`, `:99269`), `getTeamName` (obfuscated: `c_`, `:99274`), `getTeammateColor` (obfuscated: `EP`, `:99284`), `isTeammate` (obfuscated: `FA`, `:99280`).
- `generateRequestId` (obfuscated: `gUH`, `cli_inner_pretty.js:99008`) — `<prefix>-<ts>@<target>`.

---

## 1. Why a *file* mailbox? The single key design decision

**What it does:** Every teammate (leader or worker) owns exactly one inbox file, `~/.claude/teams/<team>/inboxes/<agent>.json`, which holds a JSON array of message objects. To send a message you append one object to the recipient's array; to receive, you read the array and filter on `read:false`.

**How it works (step-by-step):**

1. The path is computed by `getInboxPath` (obfuscated: `jhH`, `cli_inner_pretty.js:338272`). It sanitizes both the team name and agent name through `sanitizePathComponent` (obfuscated: `OiH`, `:237112` — `replace(/[^a-zA-Z0-9_-]/g, "-")`), joins them under the teams root `getTeamsDir` (obfuscated: `RxH`, `:3531` → `<configDir>/teams`), and appends `inboxes/<agent>.json`.
2. A *write* (`writeToMailbox`) first guarantees the file exists, then takes an advisory lock, re-reads the array (to pick up concurrent writes), pushes the new object with `read:false`, and atomically rewrites the file.
3. A *read* (`readMailbox`) parses the array; an `unread` read (`readUnreadMessages`) filters on `!read`. Marking a message consumed (`markMessageAsReadByIndex`) flips one element's `read` flag under the same lock.

```javascript
// ============================================
// getInboxPath - Resolve a teammate's inbox file path
// Location: cli_inner_pretty.js:338272-338279
// ============================================

// ORIGINAL (for source lookup):
function jhH(H, $) {
  let q = $ || c_() || "default", K = OiH(q), _ = OiH(H),
    z = iJ8.join(RxH(), K, "inboxes"), A = iJ8.join(z, `${_}.json`);
  return (N(`[TeammateMailbox] getInboxPath: agent=${H}, team=${q}, fullPath=${A}`), A);
}

// READABLE (for understanding):
function getInboxPath(agentName, teamName) {
  let team = teamName || getTeamName() || "default";     // c_() reads AsyncLocalStorage/env team
  let safeTeam  = sanitizePathComponent(team);           // OiH: [^a-zA-Z0-9_-] -> "-"
  let safeAgent = sanitizePathComponent(agentName);
  let inboxDir  = path.join(getTeamsDir(), safeTeam, "inboxes");   // ~/.claude/teams/<team>/inboxes
  let fullPath  = path.join(inboxDir, `${safeAgent}.json`);
  logForDebugging(`[TeammateMailbox] getInboxPath: agent=${agentName}, team=${team}, fullPath=${fullPath}`);
  return fullPath;
}

// Mapping: jhH→getInboxPath, c_→getTeamName, OiH→sanitizePathComponent, RxH→getTeamsDir, iJ8→path, N→logForDebugging
```

**Why this approach (the decisive trade-off):** The agent-team subsystem has *two physically different* teammate runtimes:

```
        leader  ── writes message ──►  recipient inbox file  ──  polled by recipient
        (one writeToMailbox call)            (on disk)
                                                  │
                ┌─────────────────────────────────┴──────────────────────────────────┐
   IN-PROCESS teammate                                          CROSS-PROCESS teammate
   (async task in THIS Node process,                            (separate `claude` process in a
    isolated by AsyncLocalStorage)                               tmux pane / iTerm2 split)
   reads the SAME file via its 500ms                            reads the SAME file via its 500ms
   poll loop (DT_) — no shared heap                              poll loop — across the OS boundary
   trick needed                                                  (only thing they share is the FS)
```

For an in-process teammate, the two parties share a V8 heap, so an in-memory queue *would* work; for a cross-process teammate, the two parties share *nothing but the filesystem*, so an in-memory queue *cannot* work. Rather than maintain two transports and a routing layer that picks one, the design picks the transport that is valid in **both** worlds — a file. The cost is real: every message is a lock acquire + JSON re-read + atomic rewrite (O(messages) per write), and delivery latency is bounded below by the 500 ms poll interval. The benefit is that `writeToMailbox(name, msg, team)` is the *only* send primitive in the entire subsystem; the `InProcessBackend.sendMessage`, the `PaneBackendExecutor.sendMessage`, the `SendMessage` tool, the idle notifier, the shutdown path, and the permission bridge all bottom out in it. The v2.1.88 source states this rationale explicitly in `getInboxPath`'s doc comment and in `writeToMailbox`'s comment "*routes to in-process or file-based based on recipient*" — but note that in v2.1.156 that routing collapsed: **all** recipients are file-based, which makes the IPC trivially uniform.

### 1.1 The concurrency-safe write

**What it does:** `writeToMailbox` (obfuscated: `aA`, `cli_inner_pretty.js:338306`) is the universal send. It must tolerate N agents (leader + multiple workers) writing to the same inbox concurrently — e.g. two teammates both DM the leader at once.

**How it works:**

1. `ensureInboxDir` (`HD_`, `:338280`) creates the team's `inboxes/` directory.
2. It creates the inbox file *exclusively* (`writeExclusive` = `wx` flag). If that throws `EEXIST` the file already exists (fine); any other error aborts. The reason to pre-create is that `proper-lockfile` requires the lockee file to exist before it can be locked.
3. It locks via `bf(...)` (= `proper-lockfile.lock`) with `LOCK_OPTIONS` (`DG$`, `:338697`): `retries:{retries:10, minTimeout:5, maxTimeout:100}`. So a contended writer **retries with backoff** rather than failing.
4. After acquiring the lock it **re-reads** the array (critical: the on-disk state may have changed since the caller last read it), pushes `{...message, type:"message", read:false}`, and `atomicWrite`s the pretty-printed JSON.
5. `finally`, it releases the lock.

```javascript
// ============================================
// writeToMailbox - Append a message to a recipient's inbox under an advisory lock
// Location: cli_inner_pretty.js:338306-338332
// ============================================

// ORIGINAL (for source lookup):
async function aA(H, $, q) {
  await HD_(q);
  let K = jhH(H, q), _ = `${K}.lock`;
  N(`[TeammateMailbox] writeToMailbox: recipient=${H}, from=${$.from}, path=${K}`);
  try { await o7().writeExclusive(K, "[]"); }
  catch (A) { if (X8(A) !== "EEXIST") { hH(A); return; } }
  let z;
  try {
    z = await bf(K, { lockfilePath: _, ...DG$ });
    let A = await h_H(H, q), Y = { ...$, type: "message", read: !1 };
    (A.push(Y), await o7().atomicWrite(K, IH(A, null, 2)));
  } catch (A) { hH(A); }
  finally { if (z) await z(); }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
  await ensureInboxDir(teamName);
  let inboxPath = getInboxPath(recipientName, teamName);
  let lockFilePath = `${inboxPath}.lock`;
  // Pre-create the file (proper-lockfile needs the lockee to exist):
  try { await fs().writeExclusive(inboxPath, "[]"); }            // 'wx' flag
  catch (e) { if (errnoCode(e) !== "EEXIST") { logError(e); return; } }
  let release;
  try {
    release = await lockfileLock(inboxPath, { lockfilePath, ...LOCK_OPTIONS });
    let messages = await readMailbox(recipientName, teamName);   // RE-READ under lock
    let newMessage = { ...message, type: "message", read: false };
    messages.push(newMessage);
    await fs().atomicWrite(inboxPath, jsonStringify(messages, null, 2));
  } catch (e) { logError(e); }
  finally { if (release) await release(); }
}

// Mapping: aA→writeToMailbox, HD_→ensureInboxDir, jhH→getInboxPath, h_H→readMailbox,
//          bf→lockfileLock, DG$→LOCK_OPTIONS, o7→fs, IH→jsonStringify, X8→errnoCode, hH→logError, N→logForDebugging
```

**Key insight:** The *re-read under lock* is what makes the file safe to use as a multi-writer queue. Without it, two writers that both read `[a]`, both append, and both write back would produce `[a,b]` (one append lost). With the lock + re-read, the second writer sees `[a,b]` after acquiring the lock and produces `[a,b,c]`. The lock is **per-inbox** (`<inboxPath>.lock`), so writes to *different* recipients never contend — the natural sharding is "one lock per recipient".

### 1.2 Reading and consuming

`readMailbox` (obfuscated: `h_H`, `cli_inner_pretty.js:338286`) reads the file, tolerating two non-fatal failure modes: `ENOENT` (no inbox yet → `[]`) and `SyntaxError` (a half-written / corrupt file → treat as empty rather than crash). It also **back-fills** a missing `type` field to `"message"` (`:338292`), a forward-compat shim so older inbox entries are treated as chat. `readUnreadMessages` (obfuscated: `whH`, `:338301`) is just `readMailbox(...).filter(m => !m.read)`.

`markMessageAsReadByIndex` (obfuscated: `JG$`, `cli_inner_pretty.js:338333`) is the consume side. Note that it does *not* delete the message — it flips `read:true` in place. This is a deliberate choice: messages accumulate in the file as an audit trail, and "unread" is the queue. It takes the same per-inbox lock, re-reads, bounds-checks the index, and skips if the message is already read/missing (idempotent).

```javascript
// ============================================
// markMessageAsReadByIndex - Flip one inbox message's read flag (the "consume" op)
// Location: cli_inner_pretty.js:338333-338366
// ============================================

// ORIGINAL (for source lookup):
async function JG$(H, $, q) {
  let K = jhH(H, $), _ = `${K}.lock`, z;
  try {
    z = await bf(K, { lockfilePath: _, ...DG$ });
    let A = await h_H(H, $);
    if (q < 0 || q >= A.length) return;
    let Y = A[q];
    if (!Y || Y.read) return;
    ((A[q] = { ...Y, read: !0 }), await o7().atomicWrite(K, IH(A, null, 2)));
  } catch (A) { if (X8(A) === "ENOENT") return; hH(A); }
  finally { if (z) await z(); }
}

// READABLE (for understanding):
async function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
  let inboxPath = getInboxPath(agentName, teamName);
  let lockFilePath = `${inboxPath}.lock`;
  let release;
  try {
    release = await lockfileLock(inboxPath, { lockfilePath, ...LOCK_OPTIONS });
    let messages = await readMailbox(agentName, teamName);          // re-read under lock
    if (messageIndex < 0 || messageIndex >= messages.length) return;
    let msg = messages[messageIndex];
    if (!msg || msg.read) return;                                   // idempotent
    messages[messageIndex] = { ...msg, read: true };                // flip, do NOT delete
    await fs().atomicWrite(inboxPath, jsonStringify(messages, null, 2));
  } catch (e) { if (errnoCode(e) === "ENOENT") return; logError(e); }
  finally { if (release) await release(); }
}

// Mapping: JG$→markMessageAsReadByIndex, jhH→getInboxPath, h_H→readMailbox, bf→lockfileLock,
//          DG$→LOCK_OPTIONS, o7→fs, IH→jsonStringify, X8→errnoCode, hH→logError
```

**The `"team-lead"` constant.** Both modes share a single distinguished recipient name: `TEAM_LEAD_NAME` (obfuscated: `tY`, `cli_inner_pretty.js:336140` = `"team-lead"`). The leader's own inbox is `inboxes/team-lead.json`. Workers always send their idle notifications, shutdown approvals, and permission requests to `team-lead`; the leader sends back to the worker's name. The poll loop even *prioritizes* messages whose `from === "team-lead"` (case-insensitively) over peer messages so the leader's instructions jump the queue (`in_process_mode.md`, poll-loop priority 6).

---

## 2. The teammate XML envelope — how a message text becomes context

**What it does:** When a message is delivered *into* a teammate's agent loop (as a new turn), its raw text is first wrapped in an XML envelope so the model can see *who* sent it, in what color, with what summary, distinctly from the user's own words. Two functions produce that envelope and they emit the **same tag**.

- `formatAsTeammateMessage` (obfuscated: `wU6`, `cli_inner_pretty.js:379576`) wraps a *single* message — used for the very first spawn prompt, where the leader's instruction to a new teammate is wrapped as if it came from `"team-lead"`.
- `formatMessagesAsTeammateXml` (obfuscated: `$D_`, `cli_inner_pretty.js:338411`) wraps an *array* of messages — used when the poll loop drains several unread mailbox messages at once.

Both use the tag constant `TEAMMATE_MESSAGE_TAG` (obfuscated: `_Z`, `cli_inner_pretty.js:41644` = `"teammate-message"`), and both render the attributes `teammate_id` (the sender's name), optional `color`, and optional `summary`.

```javascript
// ============================================
// formatAsTeammateMessage - Wrap one message in the <teammate-message ...> envelope
// Location: cli_inner_pretty.js:379576-379582
// ============================================

// ORIGINAL (for source lookup):
function wU6(H, $, q, K) {
  let _ = q ? ` color="${q}"` : "", z = K ? ` summary="${K}"` : "";
  return `<${_Z} teammate_id="${H}"${_}${z}>
${$}
</${_Z}>`;
}

// READABLE (for understanding):
function formatAsTeammateMessage(senderName, text, color, summary) {
  let colorAttr   = color   ? ` color="${color}"`     : "";
  let summaryAttr = summary ? ` summary="${summary}"` : "";
  // TEAMMATE_MESSAGE_TAG === "teammate-message"
  return `<teammate-message teammate_id="${senderName}"${colorAttr}${summaryAttr}>\n${text}\n</teammate-message>`;
}

// Mapping: wU6→formatAsTeammateMessage, _Z→"teammate-message", H→senderName, $→text, q→color, K→summary
```

In the in-process runner, the *initial* prompt for a newly-spawned teammate is built with exactly this envelope, with `senderName` hard-coded to `"team-lead"` (`cli_inner_pretty.js:379774` — `v = wU6("team-lead", K, void 0, _)`), so from the new teammate's perspective its first turn looks like a message from the team lead with a summary attribute. The array variant `$D_` (`:338411`) produces the same shape but stacks each message separated by a blank line, which is how a batch of drained mailbox messages is presented as one synthetic user turn.

**Key insight:** The envelope is what lets the model attribute messages correctly *and* what makes `SendMessage` the only real channel: a teammate's own assistant text is never wrapped or written anywhere, so the only bytes that reach a peer are the ones inside a `<teammate-message>` envelope, which only `writeToMailbox` produces.

---

## 3. Message types — the protocol on top of the mailbox

The mailbox carries *chat* (`type:"message"`) and a family of *control* messages. Each control type has a `create…` builder (writes the object) and an `is…` parser (zod-validates a text blob back into the typed object). The full set of control types is enumerated by `isControlMessage` (obfuscated: `$X8`, `cli_inner_pretty.js:338613`):

```javascript
// ORIGINAL (cli_inner_pretty.js:338616-338629): the control-message type set
q === "permission_request" || q === "permission_response" ||
q === "sandbox_permission_request" || q === "sandbox_permission_response" ||
q === "shutdown_request" || q === "shutdown_approved" ||
q === "team_permission_update" || q === "mode_set_request" ||
q === "plan_approval_request" || q === "plan_approval_response"
```

This document focuses on the lifecycle-relevant ones: shutdown, idle, and permission.

### 3.1 Shutdown request

**What it does:** `createShutdownRequestMessage` (obfuscated: `VsH`, `cli_inner_pretty.js:338516`) builds the envelope that asks a teammate to terminate. `isShutdownRequest` (obfuscated: `NXH`, `:338554`) zod-validates inbound text into it. The schema is `$a7` (`:338718`): `{type:"shutdown_request", requestId, from, reason?, timestamp}`.

```javascript
// ============================================
// createShutdownRequestMessage / isShutdownRequest - the shutdown_request envelope
// Location: cli_inner_pretty.js:338516-338523, 338554-338560, schema 338718-338726
// ============================================

// ORIGINAL (for source lookup):
function VsH(H) {
  return { type: "shutdown_request", requestId: H.requestId, from: H.from,
           reason: H.reason, timestamp: new Date().toISOString() };
}
function NXH(H) {
  try { let $ = $a7().safeParse(B$(H)); if ($.success) return $.data; } catch {}
  return null;
}
// schema $a7:
y.object({ type: y.literal("shutdown_request"), requestId: y.string(),
           from: y.string(), reason: y.string().optional(), timestamp: y.string() })

// READABLE (for understanding):
function createShutdownRequestMessage({ requestId, from, reason }) {
  return { type: "shutdown_request", requestId, from, reason,
           timestamp: new Date().toISOString() };
}
function isShutdownRequest(messageText) {
  try {
    let parsed = ShutdownRequestSchema().safeParse(jsonParse(messageText));
    if (parsed.success) return parsed.data;       // typed { requestId, from, reason?, ... }
  } catch {}
  return null;                                    // not a shutdown_request
}

// Mapping: VsH→createShutdownRequestMessage, NXH→isShutdownRequest, $a7→ShutdownRequestSchema,
//          B$→jsonParse
```

The high-level "send a shutdown" path is `sendShutdownRequestToMailbox` (obfuscated: `oJ8`, `cli_inner_pretty.js:338544`): it resolves the team, picks the sender (`getAgentName() || "team-lead"`), generates a deterministic id via `generateRequestId("shutdown", target)` (obfuscated: `gUH`, `:99008` → `shutdown-<ts>@<target>`), serializes a `VsH(...)` message, and `writeToMailbox`'s it as JSON text to the target's inbox:

```javascript
// ============================================
// sendShutdownRequestToMailbox - the reusable "ask teammate to shut down" helper
// Location: cli_inner_pretty.js:338544-338553
// ============================================

// ORIGINAL (for source lookup):
async function oJ8(H, $, q) {
  let K = $ || c_(), _ = ZA() || tY, z = gUH("shutdown", H),
    A = VsH({ requestId: z, from: _, reason: q });
  return (await aA(H, { from: _, text: IH(A), timestamp: new Date().toISOString(), color: EP() }, K),
          { requestId: z, target: H });
}

// READABLE (for understanding):
async function sendShutdownRequestToMailbox(targetName, teamName, reason) {
  let team = teamName || getTeamName();
  let sender = getAgentName() || TEAM_LEAD_NAME;       // ALS-aware; falls back to "team-lead"
  let requestId = generateRequestId("shutdown", targetName);     // "shutdown-<ts>@<target>"
  let msg = createShutdownRequestMessage({ requestId, from: sender, reason });
  await writeToMailbox(targetName,
    { from: sender, text: jsonStringify(msg), timestamp: new Date().toISOString(), color: getTeammateColor() },
    team);
  return { requestId, target: targetName };
}

// Mapping: oJ8→sendShutdownRequestToMailbox, c_→getTeamName, ZA→getAgentName, tY→TEAM_LEAD_NAME,
//          gUH→generateRequestId, VsH→createShutdownRequestMessage, aA→writeToMailbox,
//          IH→jsonStringify, EP→getTeammateColor
```

The *response* leg has two builders: `createShutdownApprovedMessage` (obfuscated: `Xx6`, `:338525`, includes `paneId`/`backendType` so the leader can kill the right pane) and `createShutdownRejectedMessage` (obfuscated: `Lx6`, `:338535`, requires a `reason`). The runner's poll loop (`in_process_mode.md`) consumes the inbound `shutdown_request` and, if approved, aborts the teammate's `AbortController`.

### 3.2 Idle notification

When a teammate's turn ends it goes **idle** (not terminal) and posts an `idle_notification` to the leader. `createIdleNotification` (obfuscated: `PG$`, `cli_inner_pretty.js:338422`) builds `{type:"idle_notification", from, timestamp, idleReason?, summary?, completedTaskId?, completedStatus?, failureReason?}`; `isIdleNotification` (obfuscated: `WG$`, `:338434`) parses it back. The delivery wrapper `notifyTeamLeadIdle` (obfuscated: `$94`, `:379595`) builds the notification and routes it to the leader's inbox via the tiny helper `MT_` (`:379592`), which is literally `writeToMailbox(TEAM_LEAD_NAME, {...}, team)`:

```javascript
// ============================================
// notifyTeamLeadIdle + deliverToLeaderInbox - idle notification to the team lead
// Location: cli_inner_pretty.js:379592-379598
// ============================================

// ORIGINAL (for source lookup):
async function MT_(H, $, q, K) {
  await aA(tY, { from: H, text: $, timestamp: new Date().toISOString(), color: q }, K);
}
async function $94(H, $, q, K) {
  let _ = PG$(H, K);
  await MT_(H, IH(_), $, q);
}

// READABLE (for understanding):
async function deliverToLeaderInbox(from, text, color, teamName) {
  await writeToMailbox(TEAM_LEAD_NAME, { from, text, timestamp: new Date().toISOString(), color }, teamName);
}
async function notifyTeamLeadIdle(agentName, color, teamName, options) {
  let notification = createIdleNotification(agentName, options);     // {idleReason, summary, completedTaskId, ...}
  await deliverToLeaderInbox(agentName, jsonStringify(notification), color, teamName);
}

// Mapping: $94→notifyTeamLeadIdle, MT_→deliverToLeaderInbox, PG$→createIdleNotification,
//          tY→TEAM_LEAD_NAME, aA→writeToMailbox, IH→jsonStringify
```

The `summary` field is computed by scanning the teammate's recent transcript for its last outbound `SendMessage` (`TG$`, `:338654`), so the leader's idle notification carries a one-line "`[to <name>] <summary>`" preview of peer DMs — the leader gets visibility into peer collaboration without the full message body.

### 3.3 Permission request/response

`createPermissionRequestMessage` (obfuscated: `jx6`, `cli_inner_pretty.js:338441`) builds `{type:"permission_request", request_id, agent_id, tool_name, tool_use_id, description, input, permission_suggestions}` — snake_case to mirror the SDK `can_use_tool` shape. `createPermissionResponseMessage` (obfuscated: `wx6`, `:338453`) builds the success/error response. `isPermissionResponse` (obfuscated: `DhH`, `:338475`) parses inbound text back into the response. These three are the wire format of the permission bridge in §6.

---

## 4. The lifecycle tools — the public, model-facing surface

Three tools are exposed to the model. Their *name constants* are `SendMessage` (`cf`, `:216283`), `TeamCreate` (`rd`, `:216438`), `TeamDelete` (`Oo`, `:216439`). They are grouped (with the Task* and Cron* tools) into the swarm/background tool set `U57` (`cli_inner_pretty.js:216435`):

```javascript
// ORIGINAL (cli_inner_pretty.js:216435):
U57 = new Set([SL, nd, Y0, rT, cf, rP, dI, bJ$])
// READABLE: SWARM_TOOL_SET = { TaskCreate, TaskGet, TaskList, TaskUpdate, SendMessage, <Cron…> }
// Mapping: U57→SWARM_TOOL_SET, SL→TaskCreate, nd→TaskGet, Y0→TaskList, rT→TaskUpdate, cf→SendMessage
```

Every one of the three lifecycle tools gates its visibility on the **single master gate** `isAgentTeamsEnabled` (obfuscated: `R7`, `cli_inner_pretty.js:240766`): the tool is only `isEnabled()` when `(CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS || --agent-teams)` **and** the GrowthBook flag `tengu_amber_flint` is on:

```javascript
// ORIGINAL (cli_inner_pretty.js:240766-240769):
function R7() {
  if (!xH(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !Ru5()) return !1;
  if (!V$("tengu_amber_flint", !0)) return !1;
  return !0;
}
// READABLE: isAgentTeamsEnabled = (envFlag || --agent-teams) && growthBook("tengu_amber_flint", default=true)
// Mapping: R7→isAgentTeamsEnabled, Ru5→hasAgentTeamsCliFlag, V$→getGrowthBookFlag
```

### 4.1 TeamCreate (`rd`, def `Th_` @406631)

**What it does:** Creates a team: writes the team config file, creates the matching task-list directory, registers the leader as the first member, and stores `teamContext` in app state. A leader may lead exactly one team at a time.

**inputSchema** (`Gh_`, `cli_inner_pretty.js:406619`): `{ team_name: string, description?: string, agent_type?: string }`. **isEnabled** = `R7()`. **description**: "Create a new team for coordinating multiple agents". **prompt** (`RO4`, `:406487`): a long playbook telling the model *when* to spawn a team (parallel multi-agent work), how to choose teammate agent types, the team workflow (create team → create tasks → spawn teammates via the Agent tool → assign via TaskUpdate `owner`), and — critically — that **teammate messages are delivered automatically** so the leader need not poll its inbox, and that **idle is normal** and must not be treated as an error.

**What it mutates** (`call` @406662):

1. Rejects if the session already leads a team (`teamContext?.teamName` set) — one team per leader.
2. Computes the leader's agent id `Ei(tY, team)` (= `team-lead@<team>`) and member record with `name:"team-lead"`, `agentType` (= `agent_type` or `"team-lead"`), the session model, cwd.
3. Writes the team config file *exclusively* (`pW8(team, cfg, {exclusive:true})`); an `EEXIST` whose path matches becomes a "Team already exists… run TeamDelete first" error — so creation is atomic and idempotent-safe.
4. Creates/initializes the team's task-list directory (`wz8`, `cV6`, `xD7`).
5. Assigns the leader a color and writes `teamContext` into app state.
6. Emits telemetry `tengu_team_created` with `{team_name, teammate_count:1, lead_agent_type, teammate_mode}`.

```javascript
// ============================================
// TeamCreateTool - tool definition (schema/gate/mutation excerpt)
// Location: cli_inner_pretty.js:406631-406733 (schema 406619, prompt 406487)
// ============================================

// ORIGINAL (for source lookup):
Th_ = yK({
  name: rd,
  get inputSchema() { return Gh_(); },               // {team_name, description?, agent_type?}
  isEnabled() { return R7(); },
  async description() { return "Create a new team for coordinating multiple agents"; },
  async prompt() { return RO4(); },
  async call(H, $) {
    let { setAppState: q, getAppState: K } = $, { team_name: _, description: z, agent_type: A } = H;
    let f = K().teamContext?.teamName;
    if (f) throw Error(`Already leading team "${f}". ... Use ${Oo} to end the current team ...`);
    let M = Ei(tY, _), j = A || tY, ...;
    try { await pW8(_, /*config*/J, { exclusive: !0 }); }
    catch (P) { if (X8(P) === "EEXIST" && Wb$(P) === pa(_)) throw Error(`Team "${_}" already exists ...`); throw P; }
    /* create task dir, assign color, set teamContext */
    return (q((P)=>({ ...P, teamContext: { teamName:_, leadAgentId:M, teammates:{ [M]:{ name:tY, ... } } } })),
            d("tengu_team_created", { team_name:_, teammate_count:1, lead_agent_type:j, teammate_mode: NU6() }),
            { data: { team_name:_, team_file_path: pa(_), lead_agent_id: M } });
  },
});

// READABLE (for understanding):
const TeamCreateTool = createTool({
  name: TeamCreate,                                  // "TeamCreate"
  get inputSchema() { return TeamCreateSchema(); },  // strictObject({ team_name, description?, agent_type? })
  isEnabled() { return isAgentTeamsEnabled(); },     // R7() master gate
  async description() { return "Create a new team for coordinating multiple agents"; },
  async prompt() { return TEAM_CREATE_PROMPT(); },
  async call(input, ctx) {
    const { setAppState, getAppState } = ctx;
    const { team_name, description, agent_type } = input;
    if (getAppState().teamContext?.teamName)
      throw new Error(`Already leading a team. Use TeamDelete to end it first.`);   // one team per leader
    const leadAgentId = formatAgentId(TEAM_LEAD_NAME, team_name);   // "team-lead@<team>"
    const leadType = agent_type || TEAM_LEAD_NAME;
    const config = { name: team_name, description, createdAt: Date.now(),
                     leadAgentId, leadSessionId: getSessionId(),
                     members: [{ agentId: leadAgentId, name: TEAM_LEAD_NAME, agentType: leadType, /* model, cwd */ }] };
    try { await writeTeamFileExclusive(team_name, config, { exclusive: true }); }    // atomic create
    catch (e) { if (errnoCode(e) === "EEXIST" /* same path */) throw new Error(`Team already exists; TeamDelete first.`); throw e; }
    await initTeamTaskList(team_name);
    const color = ctx.teammateColors.assign(leadAgentId);
    setAppState(s => ({ ...s, teamContext: { teamName: team_name, leadAgentId,
                        teammates: { [leadAgentId]: { name: TEAM_LEAD_NAME, agentType: leadType, color, /* ... */ } } } }));
    emitTelemetry("tengu_team_created", { team_name, teammate_count: 1, lead_agent_type: leadType, teammate_mode: getResolvedTeammateMode() });
    return { data: { team_name, team_file_path: getTeamFilePath(team_name), lead_agent_id: leadAgentId } };
  },
});

// Mapping: Th_→TeamCreateTool, rd→TeamCreate, Gh_→TeamCreateSchema, R7→isAgentTeamsEnabled, RO4→TEAM_CREATE_PROMPT,
//          Ei→formatAgentId, tY→TEAM_LEAD_NAME, pW8→writeTeamFileExclusive, X8→errnoCode, pa→getTeamFilePath,
//          NU6→getResolvedTeammateMode, d→emitTelemetry, Oo→TeamDelete, yK→createTool
```

**Key insight:** `TeamCreate` does *not* spawn teammates. The prompt explicitly says teammates are spawned via the **Agent tool** with `team_name`/`name`; `TeamCreate` only establishes the team file + task list + the leader's membership. The 1:1 "Team = TaskList" correspondence (prompt @406510) is the coordination model: claiming/assigning work goes through the Task tools, *not* through `TeamCreate`.

### 4.2 TeamDelete (`Oo`, def `vh_` @406775)

**What it does:** Tears down a completed team: refuses if any teammate is still active, then deletes the team and task directories and clears `teamContext`. **inputSchema** is the empty object (`Vh_` = `strictObject({})`, `:406774`) — the team name comes from the session's own `teamContext`, never from the model. **isEnabled** = `R7()`. **prompt** (`xO4`, `:406735`) stresses that TeamDelete *fails if the team still has active members*, so the leader must gracefully shut teammates down first.

**What it mutates** (`call` @406798):

1. Reads `teamContext?.teamName`; if a team file exists, filters members to non-`team-lead` *active* members. If any remain, returns a **failure result** (not a throw) naming them: "Cannot cleanup team with N active member(s)…".
2. Otherwise removes the team dir (`UW8`) and task dir (`xU6`), clears colors, and emits `tengu_team_deleted`.
3. Unconditionally clears `teamContext` and resets the inbox in app state.

```javascript
// ============================================
// TeamDeleteTool.call - refuse while teammates are active, else clean up
// Location: cli_inner_pretty.js:406798-406830 (prompt 406735, schema 406774)
// ============================================

// ORIGINAL (for source lookup):
async call(H, $) {
  let { setAppState: q, getAppState: K } = $, z = K().teamContext?.teamName;
  if (z) {
    let A = gZ(z);
    if (A) {
      let f = A.members.filter((O) => O.name !== tY).filter((O) => O.isActive !== !1);
      if (f.length > 0)
        return { data: { success: !1,
          message: `Cannot cleanup team with ${f.length} active member(s): ${f.map((M)=>M.name).join(", ")}. ...`,
          team_name: z } };
    }
    (await UW8(z), xU6(z), $.teammateColors.clear(), uD7(), d("tengu_team_deleted", { team_name: z }));
  }
  return (q((A) => ({ ...A, teamContext: void 0, inbox: { messages: [] } })),
          { data: { success: !0, message: z ? `Cleaned up ... "${z}"` : "No team name found ...", team_name: z } });
}

// READABLE (for understanding):
async call(input, ctx) {
  const { setAppState, getAppState } = ctx;
  const teamName = getAppState().teamContext?.teamName;
  if (teamName) {
    const teamFile = readTeamFile(teamName);
    if (teamFile) {
      const stillActive = teamFile.members.filter(m => m.name !== TEAM_LEAD_NAME).filter(m => m.isActive !== false);
      if (stillActive.length > 0)
        return { data: { success: false,
          message: `Cannot cleanup team with ${stillActive.length} active member(s): ${stillActive.map(m=>m.name).join(", ")}. Use requestShutdown first.`,
          team_name: teamName } };
    }
    await deleteTeamDir(teamName);              // ~/.claude/teams/<team>/
    deleteTaskDir(teamName);                    // ~/.claude/tasks/<team>/
    ctx.teammateColors.clear();
    emitTelemetry("tengu_team_deleted", { team_name: teamName });
  }
  setAppState(s => ({ ...s, teamContext: undefined, inbox: { messages: [] } }));
  return { data: { success: true, message: teamName ? `Cleaned up "${teamName}"` : "No team name found", team_name: teamName } };
}

// Mapping: Oo→TeamDelete, vh_→TeamDeleteTool, tY→TEAM_LEAD_NAME, gZ→readTeamFile, UW8→deleteTeamDir,
//          xU6→deleteTaskDir, d→emitTelemetry
```

**Why a result, not a throw, for active members:** A throw would surface as a tool *error*; returning `{success:false, message}` lets the model read a structured reason and *act* on it (shut down the named teammates, then retry) without an error turn. The teardown itself is best-effort but the `teamContext` clear is unconditional, so even a partial failure leaves the session in a consistent "no team" state.

### 4.3 SendMessage (`cf`, def `Bh_` @407447)

**What it does:** The model's *only* way to talk to a teammate. The `message` field is a union: a **plain string** (chat) or a **structured protocol object** (`shutdown_request`, `shutdown_response`, `plan_approval_response`). **inputSchema** (`Sh_`, `:407437`): `{ to: string, summary?: string, message: string | <protocol object> }`. **isEnabled** = `R7()`.

**validateInput** (`:407490`) encodes hard protocol rules:

- `to` must be non-empty.
- `to: "*"` is **rejected**: "broadcast is no longer supported — send a message per recipient" (`:407492`). (This is the v2.1.156 delta vs v2.1.88, which still allowed `*`.)
- `to` must be a bare teammate name (no `@`): "there is only one team per session" (`:407501`).
- If `message` is a string, `summary` is **required** (`:407507`) — the 5-10 word UI preview.
- A `shutdown_response` must be addressed to `"team-lead"` (`:407512`), and a *rejecting* one must carry a `reason`.

**call** (`:407531`) dispatches:

1. If `message` is a string and `to` resolves to a known background/agent task, route through the agent-resume path (queue at next tool round if running, else resume it). This is the bridge into the background-agent / Task subsystem — out of scope here beyond noting it exists.
2. Otherwise, a string `message` goes to `sendTeammateMessage` (obfuscated: `Ih_`, `:407257`) → `writeToMailbox`.
3. A structured `message` switches on `.type`: `shutdown_request → handleShutdownRequest` (`Ch_`, `:407279`), `shutdown_response (approve) → handleShutdownApproval` (`bh_`, `:407290`), `plan_approval_response → …`.

```javascript
// ============================================
// sendTeammateMessage - the string-message leg of SendMessage (writes to mailbox)
// Location: cli_inner_pretty.js:407257-407278
// ============================================

// ORIGINAL (for source lookup):
async function Ih_(H, $, q, K) {
  let _ = K.getAppState(), z = c_(_.teamContext);
  if (!z) return { data: { success: !1, message: `No agent named '${H}' is currently addressable. ...` } };
  let A = ZA() || (FA() ? "teammate" : tY), Y = EP();
  await aA(H, { from: A, text: $, summary: q, timestamp: new Date().toISOString(), color: Y }, z);
  let f = Rh_(_, H);
  return { data: { success: !0, message: `Message sent to ${H}'s inbox`,
    routing: { sender: A, senderColor: Y, target: `@${H}`, targetColor: f, summary: q, content: $ } } };
}

// READABLE (for understanding):
async function sendTeammateMessage(toName, text, summary, ctx) {
  let state = ctx.getAppState();
  let team = getTeamName(state.teamContext);
  if (!team) return { data: { success: false, message: `No agent named '${toName}' is addressable.` } };
  let sender = getAgentName() || (isTeammate() ? "teammate" : TEAM_LEAD_NAME);   // leader vs worker self-name
  let color  = getTeammateColor();
  await writeToMailbox(toName, { from: sender, text, summary, timestamp: new Date().toISOString(), color }, team);
  let targetColor = lookupTeammateColor(state, toName);
  return { data: { success: true, message: `Message sent to ${toName}'s inbox`,
    routing: { sender, senderColor: color, target: `@${toName}`, targetColor, summary, content: text } } };
}

// Mapping: Ih_→sendTeammateMessage, c_→getTeamName, ZA→getAgentName, FA→isTeammate, tY→TEAM_LEAD_NAME,
//          EP→getTeammateColor, aA→writeToMailbox, Rh_→lookupTeammateColor
```

The structured `shutdown_request` leg, `handleShutdownRequest` (obfuscated: `Ch_`, `:407279`), is essentially the tool-side twin of `sendShutdownRequestToMailbox`: it generates a `shutdown-<ts>@<target>` id, builds a `VsH(...)` message, writes it to the target's inbox, and returns the `request_id` so the leader can correlate the eventual `shutdown_approved`/`shutdown_rejected`. The `shutdown_response (approve)` leg, `handleShutdownApproval` (`bh_`, `:407290`), is what a *teammate* runs when it agrees to die: it writes a `shutdown_approved` (with its `paneId`/`backendType` looked up from the team file) to `team-lead`'s inbox, and — if it is an **in-process** teammate — directly aborts its own `AbortController` (because there is no process to kill); otherwise the leader uses the `paneId`/`backendType` to kill the pane.

**The SendMessage prompt** (`iO4`, `:407200`) is blunt about why this tool is mandatory: *"Your plain text output is NOT visible to other agents — to communicate, you MUST call this tool."* It also documents the legacy protocol-response pattern (echo `request_id`, set `approve`) and forbids originating shutdown requests or sending structured JSON status messages.

---

## 5. The teammate system-prompt addendum — forcing SendMessage

**What it does:** `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (obfuscated: `jU6`, module `H94`, export at `cli_inner_pretty.js:379420`, text `:379421-379428`) is appended to the *full* main-agent system prompt for every teammate by the in-process runner (and passed in the spawned-pane case). Verbatim text:

```text
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team, use the SendMessage tool with `to: "<name>"` to send messages to specific teammates.

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
```

```javascript
// ============================================
// TEAMMATE_SYSTEM_PROMPT_ADDENDUM - appended to every teammate's system prompt
// Location: cli_inner_pretty.js:379419-379429
// ============================================

// ORIGINAL (for source lookup):
var H94 = {};
X$(H94, { TEAMMATE_SYSTEM_PROMPT_ADDENDUM: () => jU6 });
var jU6 = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team, use the SendMessage tool with \`to: "<name>"\` to send messages to specific teammates.

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`;

// READABLE: TEAMMATE_SYSTEM_PROMPT_ADDENDUM (module H94) — verbatim above.
// Mapping: jU6→TEAMMATE_SYSTEM_PROMPT_ADDENDUM, H94→teammatePromptAddendumModule
```

**Why this approach (analysis):** The mailbox is structurally invisible to the model. A teammate's assistant turn produces text that the runner records in the transcript and may render to the *leader's* UI — but it is **never written to any peer's inbox** unless the model emits a `SendMessage` tool call, because `writeToMailbox` is reachable *only* through tools (`SendMessage`, the idle notifier, the permission bridge). So a teammate that "answers in text" is, from the team's point of view, silent. The addendum exists to make the model's mental model match this mechanical reality: it states the constraint ("not visible … you MUST use the SendMessage tool") and the social model ("the user interacts primarily with the team lead"). The alternative — auto-wrapping a teammate's final assistant text into a `SendMessage` to the leader — was *not* taken; instead the design keeps a single explicit channel and teaches the model to use it, which avoids accidental message storms and keeps the `summary` UI preview (required for string messages, §4.3) meaningful. The v2.1.156 wording is a **deliberate tightening** of the v2.1.88 addendum: it drops the `to: "*"` broadcast guidance entirely, consistent with `SendMessage.validateInput` now rejecting broadcast.

---

## 6. The leader↔teammate permission bridge (`OT_` @379430)

This is the most intricate algorithm in the IPC layer. When a *teammate's* agent loop hits a tool that requires permission, it cannot just pop a dialog — the teammate may be a different process, or an async task with no terminal of its own. The bridge `createTeammateCanUseTool` (obfuscated: `OT_`, `cli_inner_pretty.js:379430`) wraps the teammate's `canUseTool` and resolves the permission via one of two paths.

**What it does:** Returns an async `canUseTool(tool, input, ctx, assistantMessage, toolUseID, prefetchedResult)` that:

1. Computes the base permission result (`zeH`, the standard permission evaluator). If it isn't `"ask"` (i.e. already `allow`/`deny`), return it unchanged — only genuinely-prompting tools enter the bridge.
2. Builds a human description of the tool use.
3. **Path A (leader-attended):** if the leader has registered an interactive dialog (`ctx.requestDialog` is set), build a permission dialog with a **worker badge** `{name, color}` and show it on the leader's terminal. Resolve from the leader's click.
4. **Path B (mailbox fallback):** otherwise, build a `SwarmPermissionRequest`, register an in-memory callback keyed by `request_id`, write a `permission_request` to the *leader's* inbox, and **poll the teammate's own inbox every 500 ms** for a matching `permission_response`, resolving allow/reject when it arrives.

### 6.1 Path A — interactive dialog with a worker badge

```javascript
// ============================================
// createTeammateCanUseTool (Path A) - dialog with worker badge on the leader's terminal
// Location: cli_inner_pretty.js:379430-379506
// ============================================

// ORIGINAL (for source lookup):
function OT_(H, $, q, K) {
  return async (_, z, A, Y, f, O) => {
    let M = O ?? (await zeH(_, z, A, Y, f, void 0, K));
    if (M.behavior !== "ask") return M;                 // only "ask" enters the bridge
    let j = M.updatedInput ?? z;
    if ($.signal.aborted) return { behavior: "ask", message: p6H };
    let w = T6(A), D = await _.description(j, { ... });
    let J = A.requestDialog;
    if (J) {
      let X = H.color ? { name: H.agentName, color: H.color } : void 0,           // worker badge
        { dialog: L, descriptor: P } = MLH({ tool: _, input: j, description: D, toolUseID: f,
          permissionResult: M, assistantMessage: Y, theme: "dark", toolPermissionContext: w, workerBadge: X });
      // ... subscribe to "allow if leader changes the shared permission context" (w$H) ...
      let E = await J(L, P, { signal: W.signal });
      switch (E.behavior) {
        case "allow": { /* persist permission updates into leader's shared context via Pa7() */
                        return { behavior: "allow", updatedInput: E.updatedInput, ... }; }
        case "deny":  return { behavior: "ask", message: E.feedback ? `${B0$}${E.feedback}` : p6H, ... };
        case "cancelled": return V !== void 0 ? V : { behavior: "ask", message: p6H };
      }
    }
    /* else Path B (below) */
  };
}

// READABLE (for understanding):
function createTeammateCanUseTool(identity, abortController, onPermissionWaitMs, permissionContext) {
  return async (tool, input, toolUseContext, assistantMessage, toolUseID, prefetchedResult) => {
    let result = prefetchedResult ?? await evaluatePermission(tool, input, toolUseContext, assistantMessage, toolUseID, undefined, permissionContext);
    if (result.behavior !== "ask") return result;                         // allow/deny short-circuit
    let effectiveInput = result.updatedInput ?? input;
    if (abortController.signal.aborted) return { behavior: "ask", message: SUBAGENT_REJECT_MESSAGE };
    let permCtx = getToolPermissionContext(toolUseContext);
    let description = await tool.description(effectiveInput, { /* ... */ });
    let requestDialog = toolUseContext.requestDialog;                     // leader-attended?
    if (requestDialog) {
      let workerBadge = identity.color ? { name: identity.agentName, color: identity.color } : undefined;
      let { dialog, descriptor } = buildPermissionDialog({ tool, input: effectiveInput, description,
          toolUseID, permissionResult: result, assistantMessage, theme: "dark",
          toolPermissionContext: permCtx, workerBadge });                 // colored badge identifies WHICH worker is asking
      let decision = await requestDialog(dialog, descriptor, { signal });
      switch (decision.behavior) {
        case "allow":     /* write permissionUpdates back into the LEADER's shared context (getLeaderSetToolPermissionContext, preserveMode:true) */
                          return { behavior: "allow", updatedInput: decision.updatedInput, userModified: false /*, contentBlocks */ };
        case "deny":      return { behavior: "ask", message: decision.feedback ? withReason(decision.feedback) : SUBAGENT_REJECT_MESSAGE };
        case "cancelled": return autoAllowed ?? { behavior: "ask", message: SUBAGENT_REJECT_MESSAGE };
      }
    }
    /* else: mailbox fallback (Path B) */
  };
}

// Mapping: OT_→createTeammateCanUseTool, zeH→evaluatePermission, T6→getToolPermissionContext,
//          MLH→buildPermissionDialog, p6H→SUBAGENT_REJECT_MESSAGE, B0$→reasonPrefix,
//          A.requestDialog→toolUseContext.requestDialog, w$H→permissionContextChangeSubscription,
//          Pa7→getLeaderSetToolPermissionContext
```

Two subtle behaviors in Path A:
- A **worker badge** `{name, color}` is threaded into the dialog so the leader's prompt shows *which* teammate (by color) is asking — important when several workers are active.
- The bridge subscribes to the leader's *shared permission context* (`w$H`, `:379462`): if while the dialog is open the leader independently changes the rules so the tool would now be auto-allowed, the dialog is aborted and the request auto-resolves `allow` (the `cancelled` case returns the captured auto-allow `V`). On `allow` with "always allow" rules, those updates are written **back into the leader's shared context** via `getLeaderSetToolPermissionContext` (`Pa7`, `:379479`) with `preserveMode:true`, so the leader's mode isn't clobbered by the worker's possibly-`acceptEdits` context.

### 6.2 Path B — mailbox request + self-poll (the key algorithm)

When there is no interactive dialog (the common case for a detached/cross-process worker), the bridge falls back to the mailbox. **This is the leader↔teammate permission sync.**

**How it works (step-by-step):**

1. Build a `SwarmPermissionRequest` via `createPermissionRequest` (obfuscated: `zX8`, `:338774`): a unique `perm-<ts>-<rand>` id plus worker identity (`workerId/workerName/workerColor`), `teamName`, `toolName`, `toolUseId`, `description`, `input`, `permissionSuggestions`, `status:"pending"`.
2. Register an in-memory callback keyed by `request.id` via `registerPermissionCallback` (obfuscated: `OX8`, `:338966`) — `onAllow`/`onReject` close over the promise resolver and the cleanup.
3. Send the request to the **leader's** inbox via `sendPermissionRequestViaMailbox` (obfuscated: `AX8`, `:338814`): it resolves the leader name from the team file (`getLeaderName`, `Ya7`, `:338807`), builds a `permission_request` message (`jx6`), and `writeToMailbox`'s it to the leader.
4. Start a `setInterval` at `PERMISSION_POLL_INTERVAL_MS` (`fT_` = `500`, `:380022`) that reads the **teammate's own** inbox (`readMailbox`), scans for an unread message whose parsed `permission_response` (`isPermissionResponse` / `DhH`, `:338475`) `request_id` matches `request.id`, marks it read (`markMessageAsReadByIndex`), and calls `processMailboxPermissionResponse` (obfuscated: `SsH`, `:338978`) with `approved` (carrying `updated_input`/`permission_updates`) or `rejected` (carrying `error` as feedback).
5. `processMailboxPermissionResponse` looks up the registered callback by `request_id`, deletes it, and invokes `onAllow`/`onReject` — which resolves the outer promise. `cleanup` clears the interval and unregisters.
6. On abort, the interval and the abort listener both `cleanup` + resolve `ask`.

```javascript
// ============================================
// createTeammateCanUseTool (Path B) - mailbox request + 500ms self-poll for the response
// Location: cli_inner_pretty.js:379507-379573 (poll body 379534-379565)
// ============================================

// ORIGINAL (for source lookup):
return new Promise((X) => {
  let L = zX8({ toolName: _.name, toolUseId: f, input: j, description: D,
                permissionSuggestions: M.suggestions,
                workerId: H.agentId, workerName: H.agentName, workerColor: H.color, teamName: H.teamName });
  (OX8({ requestId: L.id, toolUseId: f,
         onAllow(G, V, v, E) { W(); Sx(V); let S = G && Object.keys(G).length > 0 ? G : j;
                               X({ behavior: "allow", updatedInput: S, userModified: !1, ...(E&&E.length>0&&{contentBlocks:E}) }); },
         onReject(G, V) { W(); X({ behavior: "ask", message: G ? `${B0$}${G}` : p6H, contentBlocks: V }); } }),
    AX8(L));                                                   // send request to leader's inbox
  let P = setInterval(async (G, V, v, E, S) => {
      if (G.signal.aborted) { V(); v({ behavior: "ask", message: p6H }); return; }
      let h = await h_H(E.agentName, E.teamName);              // read OWN inbox
      for (let I = 0; I < h.length; I++) {
        let C = h[I];
        if (C && !C.read) {
          let b = DhH(C.text);                                 // parse permission_response
          if (b && b.request_id === S.id) {                   // match request_id
            if ((await JG$(E.agentName, E.teamName, I), b.subtype === "success"))
              SsH({ requestId: b.request_id, decision: "approved",
                    updatedInput: b.response?.updated_input, permissionUpdates: b.response?.permission_updates });
            else SsH({ requestId: b.request_id, decision: "rejected", feedback: b.error });
            return;
          }
        }
      }
    }, fT_, $, W, X, H, L);
  let Z = () => { W(); X({ behavior: "ask", message: p6H }); };
  $.signal.addEventListener("abort", Z, { once: !0 });
  function W() { clearInterval(P); Ma7(L.id); $.signal.removeEventListener("abort", Z); }
});

// READABLE (for understanding):
return new Promise(resolve => {
  let request = createPermissionRequest({ toolName: tool.name, toolUseId: toolUseID, input: effectiveInput,
      description, permissionSuggestions: result.suggestions,
      workerId: identity.agentId, workerName: identity.agentName, workerColor: identity.color, teamName: identity.teamName });
  registerPermissionCallback({ requestId: request.id, toolUseId: toolUseID,
    onAllow(updatedInput, permissionUpdates, _feedback, contentBlocks) {
      cleanup(); persistPermissionUpdates(permissionUpdates);
      let finalInput = (updatedInput && Object.keys(updatedInput).length > 0) ? updatedInput : effectiveInput;
      resolve({ behavior: "allow", updatedInput: finalInput, userModified: false /*, contentBlocks */ });
    },
    onReject(feedback, contentBlocks) {
      cleanup();
      resolve({ behavior: "ask", message: feedback ? withReason(feedback) : SUBAGENT_REJECT_MESSAGE, contentBlocks });
    } });
  void sendPermissionRequestViaMailbox(request);                 // -> leader's inbox

  let pollInterval = setInterval(async (abort, cleanup, resolve, id, req) => {
      if (abort.signal.aborted) { cleanup(); resolve({ behavior: "ask", message: SUBAGENT_REJECT_MESSAGE }); return; }
      let messages = await readMailbox(id.agentName, id.teamName);   // poll OWN inbox
      for (let i = 0; i < messages.length; i++) {
        let m = messages[i];
        if (m && !m.read) {
          let parsed = isPermissionResponse(m.text);
          if (parsed && parsed.request_id === req.id) {
            await markMessageAsReadByIndex(id.agentName, id.teamName, i);
            if (parsed.subtype === "success")
              processMailboxPermissionResponse({ requestId: parsed.request_id, decision: "approved",
                updatedInput: parsed.response?.updated_input, permissionUpdates: parsed.response?.permission_updates });
            else
              processMailboxPermissionResponse({ requestId: parsed.request_id, decision: "rejected", feedback: parsed.error });
            return;                                              // the callback resolves the promise
          }
        }
      }
    }, PERMISSION_POLL_INTERVAL_MS, abortController, cleanup, identity, request);

  let onAbort = () => { cleanup(); resolve({ behavior: "ask", message: SUBAGENT_REJECT_MESSAGE }); };
  abortController.signal.addEventListener("abort", onAbort, { once: true });
  function cleanup() { clearInterval(pollInterval); unregisterPermissionCallback(request.id); abortController.signal.removeEventListener("abort", onAbort); }
});

// Mapping: zX8→createPermissionRequest, OX8→registerPermissionCallback, AX8→sendPermissionRequestViaMailbox,
//          h_H→readMailbox, DhH→isPermissionResponse, JG$→markMessageAsReadByIndex,
//          SsH→processMailboxPermissionResponse, Ma7→unregisterPermissionCallback, fT_→PERMISSION_POLL_INTERVAL_MS,
//          Sx→persistPermissionUpdates, B0$→reasonPrefix, p6H→SUBAGENT_REJECT_MESSAGE
```

**Why poll, and why 500 ms?** The teammate cannot be *pushed* a response: in the cross-process case there is no shared event loop, and even in-process the leader's "approve" happens in a UI callback on a different async stack. The only shared channel is the inbox file, so the worker must *pull*. 500 ms is the same interval the runner uses for its main poll loop (`POLL_INTERVAL_MS` / `fT_` = 500), giving a consistent, low-CPU cadence — responsive enough for a human-in-the-loop approval, cheap enough to run continuously. The `request_id` match is the correlation key, so multiple in-flight permission requests on the same inbox don't cross-resolve. The full round-trip is:

```
  teammate canUseTool == "ask"
        │
        ├─ writeToMailbox(permission_request)  ──►  team-lead inbox
        │                                              │  leader UI / handler
        │                                              ▼
        │                                       writeToMailbox(permission_response, request_id)
        │                                              │
        ▼                                              ▼
  setInterval 500ms: readMailbox(own)  ◄── matching request_id ── worker inbox
        │
        ├─ markMessageAsReadByIndex(i)
        └─ processMailboxPermissionResponse → onAllow / onReject → resolve(behavior)
```

The leader side that *produces* the `permission_response` is `sendPermissionResponseViaMailbox` (obfuscated: `YX8`, `:338840`): it builds a `permission_response` (`wx6`) with `subtype:"success"` (+`updated_input`/`permission_updates`) or `subtype:"error"` (+`error`), and writes it to the worker's inbox from sender `getAgentName() || "team-lead"`. The same pattern exists for **sandbox network** approvals (`sandbox_permission_request`/`sandbox_permission_response`, builders `Dx6`/`Jx6` at `:338482`/`:338493`, senders `Oa7`/`fX8`), letting a worker's sandbox runtime ask the leader to approve a network host — same mailbox, same poll, different message type.

**Key insight:** The permission bridge does **not** introduce a new transport. It reuses `writeToMailbox`/`readMailbox`/`markMessageAsReadByIndex` exactly as the chat path does, distinguished only by the `permission_request`/`permission_response` message types. That is the payoff of the §1 decision: one IPC primitive carries chat, lifecycle, *and* permission negotiation across both execution modes.

---

## 7. Cross-Validation (v2.1.88)

The v2.1.88 named-TypeScript tree under `/lyz/codespace/3rd/claude-code/src` corroborates the mapping almost line-for-line; the mailbox core is **byte-identical** (modulo minification), the permission *fallback* is byte-identical, and exactly two things **evolved**.

**Byte-identical (mailbox core)** — `utils/teammateMailbox.ts`:
- `getInboxPath` (`@56`) ⇒ `jhH` (`:338272`): same `team || getTeamName() || 'default'`, same `sanitizePathComponent`, same `<teamsDir>/<team>/inboxes/<agent>.json`, same debug log.
- `readMailbox` (`@84`) ⇒ `h_H` (`:338286`); `readUnreadMessages` (`@115`) ⇒ `whH` (`:338301`).
- `writeToMailbox` (`@134`) ⇒ `aA` (`:338306`): same pre-create-with-`wx`, same `LOCK_OPTIONS` (`@35` `{retries:10,minTimeout:5,maxTimeout:100}` ⇒ `DG$` `:338697`, **identical values**), same re-read-under-lock, same atomic write. The v2.1.88 comment explains the retries are to "achieve the same serialization semantics" as the old sync `lockSync` — confirming the design intent.
- `markMessageAsReadByIndex` (`@201`) ⇒ `JG$` (`:338333`): same lock, re-read, bounds-check, idempotent flip-in-place (no delete).
- `createIdleNotification` (`@410`) ⇒ `PG$` (`:338422`); `isIdleNotification` (`@435`) ⇒ `WG$` (`:338434`) — identical field set.
- `createPermissionRequestMessage` (`@488`) ⇒ `jx6` (`:338441`); `createPermissionResponseMessage` (`@512`) ⇒ `wx6` (`:338453`); `isPermissionResponse` (`@558`) ⇒ `DhH` (`:338475`).
- `createShutdownRequestMessage` (`@772`) ⇒ `VsH` (`:338516`); `createShutdownApprovedMessage` (`@789`) ⇒ `Xx6` (`:338525`); `createShutdownRejectedMessage` (`@808`) ⇒ `Lx6` (`:338535`); `sendShutdownRequestToMailbox` (`@831`) ⇒ `oJ8` (`:338544`); `isShutdownRequest` (`@868`) ⇒ `NXH` (`:338554`) — identical, including the `getAgentName() || TEAM_LEAD_NAME` sender fallback and the `generateRequestId('shutdown', target)` id scheme.
- `TEAM_LEAD_NAME = 'team-lead'` (`utils/swarm/constants.ts:1`) ⇒ `tY` (`:336140`) — identical string.

**Byte-identical (permission sync + bridge fallback)**:
- `utils/swarm/permissionSync.ts`: `createPermissionRequest` (`@167`) ⇒ `zX8` (`:338774`, including the three required-field throws and `perm-<ts>-<rand>` id `generateRequestId @161` ⇒ `qD_` `:338771`); `getLeaderName` (`@651`) ⇒ `Ya7` (`:338807`, same `members.find(m.agentId===leadAgentId)?.name || 'team-lead'`); `sendPermissionRequestViaMailbox` (`@676`) ⇒ `AX8` (`:338814`); `sendPermissionResponseViaMailbox` (`@734`) ⇒ `YX8` (`:338840`); the sandbox pair (`@805`/`@882`) ⇒ `Oa7`/`fX8`. `isTeamLeader` (`@581` — "agentId is empty or 'team-lead'") ⇒ `KD_` (`:338797`); `isSwarmWorker` (`@596`) ⇒ `XhH` (`:338802`).
- `utils/swarm/leaderPermissionBridge.ts`: the register/get/unregister setter pair ⇒ the `Pa7` accessor used at `:379479` (`getLeaderSetToolPermissionContext`) — the bridge's "write permissionUpdates back into the leader's shared context, `preserveMode:true`" logic is identical (v2.1.88 `inProcessRunner.ts:264-281`).
- `hooks/useSwarmPermissionPoller.ts`: `registerPermissionCallback` (`@82`) ⇒ `OX8` (`:338966`); `unregisterPermissionCallback` (`@94`) ⇒ `Ma7` (`:338969`); `processMailboxPermissionResponse` (`@124`) ⇒ `SsH` (`:338978`).
- The permission **fallback** half of the bridge (`utils/swarm/inProcessRunner.ts:336-449`) is essentially identical to `OT_`'s Path B: `createPermissionRequest` → `registerPermissionCallback` → `sendPermissionRequestViaMailbox` → `setInterval(PERMISSION_POLL_INTERVAL_MS = 500 @114)` reading the worker's own mailbox, matching `request_id`, `markMessageAsReadByIndex`, `processMailboxPermissionResponse`. The `PERMISSION_POLL_INTERVAL_MS = 500` constant is identical to `fT_` (`:380022`).

**Evolved (two specific places):**
1. **Permission bridge Path A (dialog) was restructured.** v2.1.88 (`inProcessRunner.ts:195-334`) pushes a `ToolUseConfirm` onto the leader's `setToolUseConfirmQueue` (obtained via `getLeaderToolUseConfirmQueue()`), carrying `workerBadge`. v2.1.156 instead reads `toolUseContext.requestDialog` and builds the dialog inline via `buildPermissionDialog` (`MLH`) with the same `workerBadge` and shows it directly. The *intent* (badge-labeled dialog, write-back of permission updates with `preserveMode:true`, auto-allow on a mid-dialog context change) is preserved; the plumbing migrated from a React queue setter to a `requestDialog` callback on the tool-use context. Hence `OT_` is an **evolved** symbol — its fallback half maps cleanly, its dialog half does not.
2. **Broadcast removed.** v2.1.88 `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (`teammatePromptAddendum.ts:8-18`) includes the line *"Use the SendMessage tool with `to: \"*\"` sparingly for team-wide broadcasts."* v2.1.156 `jU6` (`:379422`) **drops** that line, and `SendMessage.validateInput` (`:407492`) now *rejects* `to: "*"` with "broadcast … is no longer supported — send a message per recipient". So both the addendum and the tool evolved in lock-step to delete broadcast.

**Net:** the mailbox protocol, the message-type builders/parsers, the lifecycle tools' structure, and the permission *sync* are a faithful continuation of v2.1.88; the only behavioral deltas in this doc's scope are the broadcast removal and the dialog-plumbing migration.

---

## See Also

- [README.md](README.md) — module overview (agent team / swarm), the two execution modes.
- [execution_modes_and_backend_registry.md](execution_modes_and_backend_registry.md) — the `BackendRegistry` executor split (`isInProcessEnabled` → in-process vs pane).
- [in_process_mode.md](in_process_mode.md) — `InProcessBackend`, `runInProcessTeammate`, and the 6-priority poll loop that *consumes* the mailbox.
- [cross_process_mode.md](cross_process_mode.md) — `PaneBackendExecutor`, tmux/iTerm2 backends; how a pane teammate `writeToMailbox`'s identically.
- [mailbox_and_lifecycle_tools.md](mailbox_and_lifecycle_tools.md) — this document.
- [cross_validation.md](cross_validation.md) — full v2.1.88 symbol mapping and v2.1.142 delta for the whole module.
