# Mailbox Protocol — Agent Teams (v2.1.112)

## Overview

Agent Teams uses a **file-based, lock-coordinated mailbox** as the only IPC primitive between agents. Every team has its own folder under `~/.claude/{sanitizedTeamName}/`; every agent has its own JSON inbox file under `inboxes/`. All readers and writers go through `proper-lockfile` against a sibling `.lock` file.

This document specifies:
- **File layout** of a team's mailbox tree.
- **Message envelope** schema — the universal record format.
- **Message-type registry** — JSON-encoded structured messages plus their builders/parsers.
- **Lock semantics** — race avoidance and retry behavior.
- **Lifecycle invariants** — when files are created, cleared, and (not) deleted.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key functions in this document:
- `getInboxPath` (`eH6`) — chunks.99.mjs:1934
- `ensureInboxDirectory` (`dWz`) — chunks.99.mjs:1943
- `readMailbox` (`ts`) — chunks.99.mjs:1952
- `readUnreadMessages` (`qJ6`) — chunks.99.mjs:1965
- `writeToMailbox` (`F_`) — chunks.100.mjs:3
- `markMessageAsReadByIndex` (`Y18`) — chunks.100.mjs:38
- `markMessagesAsRead` (`A18`) — chunks.100.mjs:73
- `clearInbox` (`O18`) — chunks.100.mjs:103
- `formatTeammateXmlBlocks` (`cWz`) — chunks.100.mjs:122
- `composeMessageId` (`ph6`) — chunks.99.mjs:1911
- `parseAgentName` (`_18`) — chunks.99.mjs:1902
- Builders: `w18` (idle), `Ti1` (perm req), `Vi1` (perm resp), `dh6` (shutdown req), `ki1` (sandbox req), `Ni1` (sandbox resp)
- Parsers: `$18` (idle), `j18` (perm req), `KJ6` (perm resp), `i56` (shutdown req), `_J6`, `Qk`

---

## File Layout

```
~/.claude/{sanitizedTeamName}/
├── config.json                                       # team config (see configuration_schema.md)
├── tasks.json                                        # shared task list
├── inboxes/
│   ├── team-lead.json                                # leader's inbox
│   ├── team-lead.json.lock                           # proper-lockfile sentinel
│   ├── teammate-alpha.json
│   ├── teammate-alpha.json.lock
│   ├── teammate-beta.json
│   └── teammate-beta.json.lock
└── (other team-private files)
```

`{sanitizedTeamName}` follows the same name-sanitization rules as agent names: lowercase, digits, hyphens.

### Path resolution

```javascript
// ============================================
// getInboxPath - Resolve inbox file for an agent
// Location: chunks.99.mjs:1934-1941
// ============================================

// ORIGINAL (for source lookup):
function eH6(q, K) {
  let _ = K || Z9() || "default",
      z = Wh6(_),
      Y = Wh6(q),
      A = vi1(ID6(), z, "inboxes"),
      O = vi1(A, `${Y}.json`);
  return E(`[TeammateMailbox] getInboxPath: agent=${q}, team=${_}, fullPath=${O}`), O;
}

// READABLE (for understanding):
function getInboxPath(agentName, teamName) {
  const team = teamName || getCurrentTeamName() || "default";
  const sanitizedTeam  = sanitizeFileName(team);
  const sanitizedAgent = sanitizeFileName(agentName);
  const dir = pathJoin(getClaudeDir(), sanitizedTeam, "inboxes");
  return pathJoin(dir, `${sanitizedAgent}.json`);
}

// Mapping: eH6→getInboxPath, q→agentName, K→teamName, Z9→getCurrentTeamName,
//          Wh6→sanitizeFileName, vi1→pathJoin, ID6→getClaudeDir
```

`Z9()` falls through to `"default"` if no team is in scope. This is the path used when an agent runs outside an explicit team context (rare, mostly a pre-team-creation safety net).

---

## Message Envelope

Every entry in an inbox JSON array follows this shape:

```typescript
type MailboxMessage = {
  from: string;          // sender's sanitized agent name; "team-lead" for leader
  text: string;          // payload — plain text OR JSON-encoded structured message
  timestamp: string;     // ISO 8601, set at write time
  read: boolean;         // mutated to true on consumption
  color?: string;        // sender's hex color (for TUI rendering)
  summary?: string;      // one-line preview (set when sender provided one)
};
```

All fields except `from`, `text`, `timestamp`, `read` are optional. The `read` flag is set to `false` by `F_` on write and flipped to `true` by `Y18`/`A18` on consumption.

### File format

```json
[
  {
    "from": "team-lead",
    "text": "Please summarize the test failures you found.",
    "timestamp": "2026-05-08T14:23:01.234Z",
    "read": false,
    "summary": "Summarize test failures"
  },
  {
    "from": "team-lead",
    "text": "{\"type\":\"shutdown_request\",\"request_id\":\"sr-1715177345-abc\",\"reason\":\"team is done\"}",
    "timestamp": "2026-05-08T14:23:09.876Z",
    "read": false
  }
]
```

The file is pretty-printed (`I6(messages, null, 2)` — `JSON.stringify(messages, null, 2)`) so it's diffable and readable in `cat`/`tail`. Pretty-printing also has a side benefit: rebuilding the array is straightforward in any tool.

---

## Message-Type Registry

Beyond plain strings, six structured types travel through the same envelope. The discriminator is the `type` field on the JSON-decoded `text`.

| Type | Direction | Builder | Parser | File:Line | Carries |
|------|-----------|---------|--------|-----------|---------|
| `idle_notification` | worker → lead | `w18` | `$18` | chunks.100.mjs:134/147 | `idleReason`, `summary`, `completedTaskId`, `completedStatus`, `failureReason` |
| `permission_request` | worker → lead | `Ti1` | `j18` | chunks.100.mjs:155/186 | `request_id`, `agent_id`, `tool_name`, `tool_use_id`, `description`, `input`, `permission_suggestions` |
| `permission_response` | lead → worker | `Vi1` | `KJ6` | chunks.100.mjs:168/194 | `request_id`, `subtype`, `error?`, `updated_input?`, `permission_updates?` |
| `shutdown_request` | lead → worker | `dh6` | `i56` (schema `Yb4`) | chunks.100.mjs:242/293 | `requestId`, `from`, `reason?`, `timestamp` |
| `shutdown_approved` | worker → lead | `Ei1` | `Qk` (schema `Ab4`) | chunks.100.mjs:252/309 | `requestId`, `from`, `timestamp`, `paneId?`, `backendType?` |
| `shutdown_rejected` | worker → lead | `yi1` | `SI8` (schema `Ob4`) | chunks.100.mjs:263/317 | `requestId`, `from`, `reason`, `timestamp` |
| `plan_approval_request` | worker → lead | (inline in chunks.150.mjs:2174-2181, schema `_b4`) | `_J6` | chunks.100.mjs:301 | `from`, `timestamp`, `planFilePath`, `planContent`, `requestId` |
| `plan_approval_response` | lead → worker | (inline in `EJY`/`yJY`, schema `zb4`) | `ch6` | chunks.100.mjs:325 | `requestId`, `approved`, `feedback?`, `timestamp`, `permissionMode?` |
| `sandbox_permission_request` | worker → lead | `ki1` | `hI8` | chunks.100.mjs:202/226 | `requestId`, `workerId`, `workerName`, `workerColor`, `host` |
| `sandbox_permission_response` | lead → worker | `Ni1` | `H18` | chunks.100.mjs:216/234 | `requestId`, `host`, `allow` |
| `team_permission_update` | lead → all teammates | (inline) | `isTeamPermissionUpdate` (parser) | (broadcast) | `permissionUpdate.{type:"addRules", rules: [{toolName, ruleContent?}], behavior, destination}`, `directoryPath`, `toolName` — broadcasts new permission rules to the team |
| `mode_set_request` | lead → teammate | `createModeSetRequestMessage` | `isModeSetRequest` (uses `ModeSetRequestMessageSchema`) | chunks.100.mjs (referenced) | `mode: PermissionMode`, `from` — leader instructs teammate to switch permission mode |
| `task_assignment` | lead → teammate | (inline) | `isTaskAssignment` | (referenced) | `taskId`, `subject`, `description`, `assignedBy`, `timestamp` |
| `task_completed` | worker → lead | (inline) | — | chunks.139.mjs:2361 | `task_id`, `status` |

> **`isStructuredProtocolMessage`** (chunks.100.mjs equivalent) is a predicate that enumerates **10 known protocol message types** for routing decisions: `permission_request`, `permission_response`, `sandbox_permission_request`, `sandbox_permission_response`, `shutdown_request`, `shutdown_approved`, `team_permission_update`, `mode_set_request`, `plan_approval_request`, `plan_approval_response`. Plain (non-structured) text and `idle_notification`/`task_assignment` are routed differently — the 10-type set is what triggers special handling in the leader's `useInboxPoller`.

> **Note on shutdown response shape:** v2.1.112 uses **two** distinct types — `shutdown_approved` and `shutdown_rejected` — instead of a unified `shutdown_response{approve: bool}`. Approval carries `paneId`/`backendType` so the leader can clean up the pane after the worker exits. Rejection carries the worker's `reason` so the leader can surface it to the user.

> **Note on plan_approval field naming:** schemas use **camelCase** (`requestId`, `approved`, `planContent`, `planFilePath`, `permissionMode`), not snake_case. The response's optional `permissionMode` field tells the worker which permission mode to adopt after approval (e.g., `"default"`).

### Builder pattern

```javascript
// ============================================
// buildIdleNotification - Build idle_notification envelope payload
// Location: chunks.100.mjs:134-145
// ============================================

// ORIGINAL (for source lookup):
function w18(q, K) {
  return {
    type: "idle_notification",
    from: q,
    timestamp: new Date().toISOString(),
    idleReason: K?.idleReason,
    summary: K?.summary,
    completedTaskId: K?.completedTaskId,
    completedStatus: K?.completedStatus,
    failureReason: K?.failureReason
  };
}

// READABLE (for understanding):
function buildIdleNotification(fromAgentName, options) {
  return {
    type: "idle_notification",
    from: fromAgentName,
    timestamp: new Date().toISOString(),
    idleReason: options?.idleReason,           // "available" | "interrupted" | "failed"
    summary: options?.summary,                 // last assistant text
    completedTaskId: options?.completedTaskId, // when reason="completed"
    completedStatus: options?.completedStatus,
    failureReason: options?.failureReason,     // when reason="failed"
  };
}

// Mapping: w18→buildIdleNotification, q→fromAgentName, K→options
```

### Parser pattern

```javascript
// ============================================
// parseIdleNotification - Tolerant JSON-decode + type check
// Location: chunks.100.mjs:147-153
// ============================================

// ORIGINAL (for source lookup):
function $18(q) {
  try {
    let K = n8(q);
    if (K && K.type === "idle_notification") return K;
  } catch {}
  return null;
}

// READABLE (for understanding):
function parseIdleNotification(text) {
  try {
    const parsed = safeJsonParse(text);
    if (parsed && parsed.type === "idle_notification") return parsed;
  } catch {}
  return null;
}

// Mapping: $18→parseIdleNotification, q→text, n8→safeJsonParse
```

The `try/catch + return null` pattern lets the runner test "is this a structured shutdown_request?" without distinguishing JSON-parse errors from wrong-type messages — both return null, both mean "treat as plain text".

---

## Locking Semantics

### proper-lockfile config (`z18`)

```javascript
// Approximate; actual values shared across the codebase
const z18 = {
  retries: { retries: 10, minTimeout: 5 },     // 10 attempts, 5ms backoff
  // realm: ENOENT-tolerant defaults
};
```

`proper-lockfile`'s `lock(path, {lockfilePath, retries})`:
- Creates `{lockfilePath}` (the sibling `.lock` file).
- Returns a `release()` function.
- On contention, retries with exponential-ish backoff up to the configured count.

### Why a sibling .lock file, not flock(2)?

Three reasons:
1. **Cross-platform.** `flock(2)` is POSIX-only. `proper-lockfile` works on Windows.
2. **Crash recovery.** A crashed process leaves a stale `.lock` file, but proper-lockfile checks lockfile age (mtime) and can steal stale locks.
3. **Filesystem-agnostic.** Works on NFS and remote mounts where advisory locks are unreliable.

### Write protocol (F_)

```
1. ensureInboxDirectory(team)                  # create {team}/inboxes/ if needed
2. inboxPath = getInboxPath(recipient, team)
3. lockPath  = inboxPath + ".lock"
4. try fs.writeFile(inboxPath, "[]", {flag: "wx"})    # exclusive create
   catch e where e.code != "EEXIST": log + return    # I/O failure not race
5. release = await properLockfile.lock(inboxPath, {lockfilePath: lockPath, ...z18})
6. try:
     msgs = await readMailbox(recipient, team)
     msgs.push({...message, read: false})
     await fs.writeFile(inboxPath, JSON.stringify(msgs, null, 2), "utf-8")
   finally:
     await release()
```

Step 4 (`flag: "wx"`) is **not** redundant with step 5. The lockfile mechanism only protects against concurrent locks; it does not prevent the file from being read before any writer has created it. The exclusive-create avoids ENOENT in `readMailbox` for the very first writer to a brand-new inbox.

### Read protocol (ts)

```
1. inboxPath = getInboxPath(agent, team)
2. try data = await fs.readFile(inboxPath, "utf-8")
   catch e where e.code === "ENOENT": return []      # absent file = empty inbox
   catch e: log + return []
3. msgs = safeJsonParse(data) ?? []
4. return msgs
```

**Reads are not locked.** Two consequences:
- A reader can observe a half-written file if `fs.writeFile` is mid-flush. JSON.parse failure → empty array.
- A reader can race with `Y18`/`A18` and re-read a message that was just marked read. The runner is idempotent against this (re-marking is a no-op).

This relaxation is intentional — locking every read would multiply lock acquisitions per poll cycle, slowing every teammate by the lock-acquisition cost. Failures are rare and self-correcting.

### Mark-read protocol (Y18)

```
1. inboxPath = getInboxPath(agent, team)
2. lockPath  = inboxPath + ".lock"
3. release = await properLockfile.lock(inboxPath, {lockfilePath: lockPath, ...z18})
4. try:
     msgs = await readMailbox(agent, team)
     if index out of bounds: return
     if msgs[index].read: return                      # already read; no-op
     msgs[index] = {...msgs[index], read: true}
     await fs.writeFile(inboxPath, JSON.stringify(msgs, null, 2), "utf-8")
   catch e where e.code === "ENOENT": return
   finally:
     await release()
```

The double-check (`if msgs[index].read: return`) under the lock makes mark-read idempotent under all races.

### Bulk mark-read (A18)

Same as `Y18` but iterates the entire array. Used after the runner consumes a message stream from the leader and wants to fast-forward over historical traffic.

### Clear (O18)

```
1. acquire lock
2. write "[]" to inboxPath
3. release lock
```

Used at spawn time (clears any stale messages from a previous teammate with the same name).

---

## Sender Conventions

| Sender value | Meaning |
|--------------|---------|
| `"team-lead"` (the constant `Mz`) | Reserved leader id. Cannot be used as a teammate name (sanitization rejects). |
| `"<sanitized agent name>"` | A teammate. |
| `"user"` | Synthetic; only seen on the *receiving* side via `pendingUserMessages`. Never written to the mailbox file. |
| `"task-list"` | Synthetic; only seen on the receiving side when `HNK` injects an auto-claimed task. Never persisted. |

The synthetic senders (`"user"`, `"task-list"`) exist purely to label the prompt's origin in the runner's `switch` on `next.type`. They're not part of the on-disk format.

---

## Message Composition Helpers

### Wrapping incoming messages with XML tags

When a teammate receives a message from another teammate, the runner wraps it in `<teammate teammate_id="…">` so the LLM can recognize the source:

```javascript
// ============================================
// wrapMessageForTeammate - XML-wrap incoming peer/lead messages
// Location: chunks.154.mjs:2386-2392
// ============================================

// ORIGINAL (for source lookup):
function k97(q, K, _, z) {
  let Y = _ ? ` color="${_}"` : "",
      A = z ? ` summary="${z}"` : "";
  return `<${oX} teammate_id="${q}"${Y}${A}>
${K}
</${oX}>`;
}

// READABLE (for understanding):
function wrapMessageForTeammate(senderId, body, color, summary) {
  const colorAttr   = color   ? ` color="${color}"`     : "";
  const summaryAttr = summary ? ` summary="${summary}"` : "";
  return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${senderId}"${colorAttr}${summaryAttr}>
${body}
</${TEAMMATE_MESSAGE_TAG}>`;
}

// Mapping: k97→wrapMessageForTeammate, q→senderId, K→body, _→color, z→summary, oX→TEAMMATE_MESSAGE_TAG
```

`oX` (the tag name) is the constant `"teammate-message"` (defined at chunks.16.mjs:584). The wrapped output looks like:
```xml
<teammate-message teammate_id="alpha" color="#0080ff" summary="…">
…body…
</teammate-message>
```

User messages from `pendingUserMessages` are **not** wrapped — they go straight through as raw user text.

### Pretty-printing teammate broadcasts (cWz)

```javascript
// oX = "teammate-message" (chunks.16.mjs:584)
function cWz(q) {
  return q.map((K) => {
    let _ = K.color   ? ` color="${K.color}"`     : "",
        z = K.summary ? ` summary="${K.summary}"` : "";
    return `<${oX} teammate_id="${K.from}"${_}${z}>\n${K.text}\n</${oX}>`;
  }).join("\n\n");
}
```

This is used by the leader's TUI to render multiple teammate messages as a single block. It's not part of the wire protocol — it's purely a display formatter.

---

## Lifecycle Invariants

| Event | Effect on inbox file |
|-------|----------------------|
| Spawn | `O18` clears or creates the file (size=2: `"[]"`). |
| Normal write | Appended record with `read: false`. |
| Read | No effect (read-only). |
| Consume (mark read) | One record's `read` flag flips to `true`. |
| Bulk mark | All records' `read` flags flip. |
| Teammate exit | **No effect.** The inbox stays so a future spawn-by-name can read history. |
| Team deletion (TeamCreate cleanup) | Whole `~/.claude/{team}/` directory unlinked, including all inboxes. |

The "no delete on exit" decision matters: if a teammate crashes and is respawned, its inbox carries the unread messages from the leader. Without persistence, the leader would have to retransmit.

---

## Why an Append-Only-with-Soft-Delete Log?

The format is technically not append-only (the file is rewritten on every mutation), but conceptually it's a log with soft delete (`read: true`). Why?

- **Simplicity.** No log compaction, no segment files. A flat JSON array is greppable and inspectable.
- **Readback.** The TUI's "team chat" view wants to render history including read messages. Soft delete preserves history for free.
- **Debug.** A user can `cat ~/.claude/myteam/inboxes/teammate-alpha.json` to see exactly what was sent and what was consumed.

Cost: every mutation rewrites the entire file. For typical session-length traffic (dozens to low-hundreds of messages), this is well under a millisecond per operation, and the lock-acquisition cost dominates anyway.

---

## Common Lock Failure Patterns

| Pattern | Cause | Mitigation |
|---------|-------|------------|
| `EAGAIN` after retries | Many concurrent writers (e.g., 6 teammates idle-notifying simultaneously) | retries=10, minTimeout=5ms gives 50ms+ retry budget; rare in practice |
| Stale `.lock` file | Crashed writer | proper-lockfile detects via mtime and steals after threshold |
| ENOENT on lock acquisition | Deleted directory mid-spawn | `dWz` recreates idempotently; `wx` create handles the race |
| JSON.parse error on read | Half-written file (writer mid-flush) | Returns `[]`; runner re-polls; data is observable on next cycle |

The system is designed for "almost always works"; failures degrade to "delivery happens 500ms later" rather than "delivery is lost".

---

## Mailbox Tracing

`E(...)` calls (`logDebug`) bracket every mailbox operation. Tags:

- `[TeammateMailbox]` — lifecycle events (read/write/mark/clear, ENOENT, lock acquire/release)
- `[PermissionSync]` — permission round-trip writes/reads
- `[inProcessRunner]` — poll-loop state (which inbox, which path)

These show up in the project's debug log file, not the user TUI. Useful for diagnosing flaky cooperation: a missing message can be traced back to either a write or a read failure based on the absence of `Wrote message to … from …` or `read N message(s)`.
