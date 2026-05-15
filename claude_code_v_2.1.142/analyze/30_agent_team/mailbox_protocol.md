# Mailbox Protocol Architecture — v2.1.142

## TL;DR

The mailbox is Claude Code's only inter-agent IPC primitive. Every team-spawned teammate (in-process or pane) communicates with the leader and with peers exclusively by reading and writing JSON files under `~/.claude/{team}/inboxes/{agent}.json`, with a sibling `.lock` file coordinating concurrent access.

The v2.1.142 protocol carries forward the v2.1.112 design with no schema changes; what *did* change is the surrounding surface area:

1. **`--add-dir` and other dispatch-extra flags** are *not* sent over the mailbox — they're stashed in a module-global on the leader and re-applied to *every* spawned worker's argv (see unit 08's `v2_1_142_dispatch_flags.md`). The mailbox protocol only carries inter-turn messages.
2. **Broadcast (`to: "*"`)** was **removed** in this release line — `SendMessage` now refuses it with `"broadcast (to: '*') is no longer supported — send a message per recipient"`. Multi-recipient delivery is a userland loop, not a protocol primitive.
3. **Channels** (`channelsEnabled` setting from v2.1.128) are NOT the mailbox protocol — they're a separate inbound-push system for plugin-provided MCP servers. The two systems are orthogonal.
4. **10 structured protocol message types** continue to flow through the envelope (up from v2.1.112's enumerated set, now formally returned by `isStructuredProtocolMessage` / `c68`).

This document covers the file-based IPC, the message envelope, the version field, the lock semantics (atomic-rename-as-creation + `proper-lockfile` for write), the poll interval, the v2.1.112 5-priority ordering inherited unchanged, and the v2.1.142 changes to the surrounding tool surface.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md) — v2.1.142 agent-team architecture additions
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agent Loop / Subagent
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Background Agents (unit 08)

Key functions in this document (v2.1.142 names):
- `writeToMailbox` (`cA`) — locked append to a recipient's inbox file
- `readMailbox` (`o7H`) — read full inbox (used by callers that want both read and unread)
- `readUnreadMessages` (`FTH`) — filter to `!read` entries
- `markMessageAsReadByIndex` (`mO$`) — flip a single record's `read` bit
- `markMessagesAsReadByPredicate` (`vD6`) — flip all records matching a function
- `clearMailbox` (`pO$`) — empty an inbox file (used on teammate spawn-with-reset)
- `getInboxPath` (`UTH`) — `~/.claude/{team}/inboxes/{agent}.json`
- `ensureInboxDirectory` (`Lf_`) — `mkdir -p` for the team's inboxes folder
- `isStructuredProtocolMessage` (`c68`) — predicate enumerating the 10 wire types
- `parseMailboxAddress` (`ui7`) — parse `bridge:` and `uds:` schemes (new in late 2.1.x)
- `formatTeammateMessages` (`Pf_`) — render inbox entries to `<teammate-message>` XML for the prompt
- `getLastPeerDmSummary` (`dO$`) — peer-to-peer DM summary extractor (used by TUI)
- `SendMessageTool` (`SH5`) — the public-tool wrapper around the mailbox
- Constants: `az` (`"team-lead"`), `pC` (`"claude-swarm"`), `mZ` (`"SendMessage"`), `IW` (`"teammate-message"`)

---

## File Layout

```
~/.claude/{sanitizedTeamName}/
├── config.json                              # team config
├── tasks.json                               # shared task list (atomic via tasks.json.lock)
└── inboxes/
    ├── team-lead.json                       # leader's inbox
    ├── team-lead.json.lock                  # proper-lockfile sentinel (dir created on demand)
    ├── alpha.json                           # teammate "alpha"'s inbox
    ├── alpha.json.lock
    └── …
```

`{sanitizedTeamName}` follows the same sanitization rules as agent names: `[a-z0-9-]` with whitespace and other characters collapsed.

### Resolution

```javascript
// ============================================
// getInboxPath - Resolve the inbox file for a (agent, team) pair
// Location: cli_inner_pretty.js:239131-239139
// ============================================

// ORIGINAL (for source lookup):
function UTH(H, $) {
  let q = $ || q5() || "default",
      K = UgH(q),
      _ = UgH(H),
      A = m68.join(XIH(), K, "inboxes"),
      z = m68.join(A, `${_}.json`);
  return (N(`[TeammateMailbox] getInboxPath: agent=${H}, team=${q}, fullPath=${z}`), z);
}

// READABLE (for understanding):
function getInboxPath(agentName, teamName) {
  const team = teamName || getCurrentTeamName() || "default";
  const safeTeam = sanitizeFilename(team);
  const safeAgent = sanitizeFilename(agentName);
  const dir = pathJoin(getClaudeDir(), safeTeam, "inboxes");
  const full = pathJoin(dir, `${safeAgent}.json`);
  log(`[TeammateMailbox] getInboxPath: agent=${agentName}, team=${team}, fullPath=${full}`);
  return full;
}

// Mapping: UTH→getInboxPath, H→agentName, $→teamName, q5→getCurrentTeamName,
//          UgH→sanitizeFilename, m68→path module, XIH→getClaudeDir
```

The `"default"` fallback exists so that agents running outside an explicit team context still have a valid inbox path. In practice this is exercised only briefly during TeamCreate.

### Cross-Platform Considerations

The path resolution uses Node's `path.join`, so backslashes on Windows and forward slashes on POSIX are handled. The `proper-lockfile` package backing `Ff(...)` is also cross-platform.

There is one subtle gotcha: `claude.exe` running under Windows with a network-drive `cwd` had Ctrl+C deadlocking startup in v2.1.141 and earlier (fixed in v2.1.142). The mailbox path itself is local (`~/.claude/...`), so that fix is orthogonal to the mailbox — but it illustrates that path issues can leak from the worker's cwd into surrounding code in unexpected ways.

---

## Message Envelope

The envelope is unchanged from v2.1.112 — same field layout, same JSON pretty-printing.

```typescript
type MailboxRecord = {
  from: string;            // sender's sanitized name; "team-lead" for the leader
  text: string;            // plain text OR JSON-encoded structured message
  timestamp: string;       // ISO 8601, set at write time
  read: boolean;           // mutated from false to true on consumption
  color?: string;          // sender's hex color (for TUI rendering)
  summary?: string;        // one-line preview, REQUIRED for plain-text messages
};
```

The leader's name constant is `az = "team-lead"` (in v2.1.112 this was `Mz`); the constant is used both as a sentinel `from` value and as the canonical recipient address for `shutdown_response`.

### File Format

The inbox JSON is pretty-printed with `JSON.stringify(messages, null, 2)`. This is deliberate:
1. **Diff-friendly** — git, `code`, `tail` all render line-by-line changes.
2. **Inspectable from a terminal** — `cat ~/.claude/foo/inboxes/alpha.json` is human-readable.
3. **No protocol benefit lost** — JSON parsing speed is identical between pretty and compact for files of this size (tens of entries, mostly).

Example:

```json
[
  {
    "from": "team-lead",
    "text": "Please summarize the failing tests.",
    "timestamp": "2026-05-15T14:23:01.234Z",
    "read": false,
    "summary": "Summarize failing tests"
  },
  {
    "from": "team-lead",
    "text": "{\"type\":\"shutdown_request\",\"requestId\":\"sr-1715177345-abc\",\"from\":\"team-lead\",\"timestamp\":\"2026-05-15T14:23:09.876Z\"}",
    "timestamp": "2026-05-15T14:23:09.876Z",
    "read": false
  }
]
```

---

## Versioning

There is **no explicit `version` field** in the envelope. The protocol relies on three implicit versioning strategies:

1. **Schema growth is additive.** New structured message types are added to `isStructuredProtocolMessage`'s enumeration; old types continue to work. The receiver tolerates unknown `type` fields by treating them as plain text.
2. **The CLI binary version dictates the protocol version.** A team-lead running v2.1.112 and a teammate running v2.1.142 *do* share the protocol — but only because v2.1.142 hasn't introduced incompatible types yet. There's no negotiation; the lead simply assumes the teammate understands every type the lead emits. In practice both processes always come from the same `claude` install (a teammate is spawned by the leader as the same binary).
3. **Daemon spare-version gating** (different layer): the bg daemon refuses to claim a pre-warmed spare whose `cliVersion` field doesn't match its own. This protects the *spawn* side; the mailbox protocol doesn't carry a CLI version because two co-spawned processes always agree on it by construction.

The lack of a version field is a deliberate simplification: any protocol mismatch would mean two unrelated `claude` versions trying to coordinate, which the spawn model doesn't allow.

---

## Lock Semantics

Two coordination primitives operate on the inbox files:

### 1. Atomic File Creation via `wx` Flag

When a writer wants to be sure the inbox file exists (perhaps for the first time after team setup), it does:

```javascript
await Sn.writeFile(K, "[]", { encoding: "utf-8", flag: "wx" });
```

The `wx` flag is `O_WRONLY | O_CREAT | O_EXCL`. If the file already exists, this throws `EEXIST` — which the caller catches and ignores. This is the only "atomic rename"-style primitive in the protocol; it's used to bootstrap an inbox file without racing with another concurrent writer.

```javascript
// ============================================
// writeToMailbox - Locked append to a recipient's inbox file
// Location: cli_inner_pretty.js:239157-239196
// ============================================

// ORIGINAL (for source lookup):
async function cA(H, $, q) {
  await Lf_(q);                                            // mkdir inboxes/
  let K = UTH(H, q), _ = `${K}.lock`;
  N(`[TeammateMailbox] writeToMailbox: recipient=${H}, from=${$.from}, path=${K}`);
  try {
    await Sn.writeFile(K, "[]", { encoding: "utf-8", flag: "wx" });
    N("[TeammateMailbox] writeToMailbox: created new inbox file");
  } catch (z) {
    if (O8(z) !== "EEXIST") { N(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${z}`), EH(z); return; }
  }
  let A;
  try {
    A = await Ff(K, { lockfilePath: _, ...uO$ });
    let z = await o7H(H, q), Y = { ...$, read: !1 };
    z.push(Y);
    await Sn.writeFile(K, SH(z, null, 2), "utf-8");
    N(`[TeammateMailbox] Wrote message to ${H}'s inbox from ${$.from}`);
  } catch (z) {
    N(`Failed to write to inbox for ${H}: ${z}`), EH(z);
  } finally {
    if (A) await A();
  }
}

// READABLE (for understanding):
async function writeToMailbox(recipient, message, teamName) {
  await ensureInboxDirectory(teamName);
  const inboxPath = getInboxPath(recipient, teamName);
  const lockPath = `${inboxPath}.lock`;
  log(`[TeammateMailbox] writeToMailbox: recipient=${recipient}, from=${message.from}, path=${inboxPath}`);

  // (1) Atomic create-if-missing — uses O_EXCL to avoid clobbering a concurrent writer.
  try {
    await fs.writeFile(inboxPath, "[]", { encoding: "utf-8", flag: "wx" });
    log("[TeammateMailbox] writeToMailbox: created new inbox file");
  } catch (e) {
    if (errnoOf(e) !== "EEXIST") { log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${e}`); EH(e); return; }
    // EEXIST means another writer created it first; fine to continue.
  }

  // (2) Acquire the proper-lockfile across the read-modify-write.
  let release;
  try {
    release = await lockFile(inboxPath, { lockfilePath: lockPath, ...LOCK_OPTS });
    const existing = await readMailbox(recipient, teamName);
    existing.push({ ...message, read: false });
    await fs.writeFile(inboxPath, JSON.stringify(existing, null, 2), "utf-8");
    log(`[TeammateMailbox] Wrote message to ${recipient}'s inbox from ${message.from}`);
  } catch (e) {
    log(`Failed to write to inbox for ${recipient}: ${e}`);
    EH(e);
  } finally {
    if (release) await release();
  }
}

// Mapping: cA→writeToMailbox, Lf_→ensureInboxDirectory, UTH→getInboxPath, Ff→lockFile,
//          o7H→readMailbox, uO$→LOCK_OPTS, SH→JSON.stringify
```

### 2. `proper-lockfile` for the Read-Modify-Write

The `Ff(...)` call is `proper-lockfile.lock`. Its behavior:
1. Creates a lockfile directory at `${inboxPath}.lock` (a directory, not a file — `proper-lockfile` uses directory creation as the atomic primitive on POSIX).
2. Retries with configured backoff if the directory already exists.
3. Returns a release function that removes the lockfile.

The `LOCK_OPTS` (`uO$`) include retry counts and exponential backoff — the exact values aren't critical, but they're tuned so a typical contended write (two writers, one in line) takes < 50 ms.

#### Why directory-based locks?

`proper-lockfile` uses directory creation rather than `flock` or `fcntl` because:
1. **Cross-platform** — Windows has different file-locking semantics; `mkdir` works identically.
2. **Network filesystem-tolerant** — NFS, SMB, and similar generally support atomic mkdir but not POSIX advisory locks.
3. **Crash-safe** — A killed process leaves a stale `.lock` directory; `proper-lockfile` recovers by checking if the lock-holder PID (stored inside) is alive.

#### Why a separate sibling lock file?

If you locked the inbox file itself, you'd need to open it first — which is impossible if the file doesn't exist yet. The sibling pattern (`{path}.lock`) lets the lock be acquired *before* the file is read or written, and works whether the file exists or not.

### 3. Pretty-Print is Locked

The pretty-printed JSON output is generated *under* the lock — the JSON-serialize step happens between `read existing` and `write new`. So even if the file is partially written (process crash mid-`writeFile`), the lock holder doesn't observe partial state, and the recovery path re-reads after acquiring the lock.

### What's NOT Protected by the Lock

- **Inbox file existence** is *not* under the lock — that's covered by `wx`-style atomic create.
- **Inbox directory creation** is `mkdir -p` (idempotent), not locked.
- **Multiple parallel reads** are NOT serialized. Two readers may both see the same pre-update state simultaneously; this is fine because reads don't mutate.

---

## Poll Interval

The teammate runner (`bXY` in v2.1.112, same skeleton in v2.1.142) polls every **500 ms** between turns. This constant is `yXY` in v2.1.112; the v2.1.142 module structure keeps the same value but the symbol name may differ.

500 ms is a heuristic balance:
- **Lower** would burn CPU on tight `readdir`/`readFile` calls with little benefit (humans don't notice sub-second delays).
- **Higher** would feel laggy when the user types a follow-up into the leader and watches the teammate idle.
- **Lock-coordination** also benefits: if both writer and reader fire every 500 ms, lock contention on a single inbox is naturally low.

The poll cycle is gated by `AbortSignal`; the runner exits cleanly if its lifecycle controller aborts mid-sleep.

---

## Priority Order (Inherited from v2.1.112)

The 5-level priority is unchanged:

1. **`pendingUserMessages`** — in-memory queue from the leader's TUI (no FS access). Highest priority because the user is actively typing.
2. **`shutdown_request`** — scanned across the *entire* unread set, bypassing arrival order. Lead-initiated team shutdowns must preempt everything.
3. **Team-lead messages** — first unread message whose `from === "team-lead"`.
4. **Any unread** — first unread message regardless of sender.
5. **Auto task-claim** — if `tasks.json` has an unowned task with no unmet blockers, claim it and treat its description as the next prompt.

This ordering is identical to v2.1.112; see `claude_code_v_2.1.112/analyze/30_agent_team/polling_priorities.md` for the worked examples.

---

## Message-Type Registry (v2.1.142 Verified)

`isStructuredProtocolMessage` (`c68`) enumerates the 10 wire types recognized as protocol traffic:

```javascript
// ============================================
// isStructuredProtocolMessage - Predicate for routing decisions
// Location: cli_inner_pretty.js:239470-239489
// ============================================

// ORIGINAL (for source lookup):
function c68(H) {
  try {
    let $ = x$(H);
    if (!$ || typeof $ !== "object" || !("type" in $)) return !1;
    let q = $.type;
    return (
      q === "permission_request" ||
      q === "permission_response" ||
      q === "sandbox_permission_request" ||
      q === "sandbox_permission_response" ||
      q === "shutdown_request" ||
      q === "shutdown_approved" ||
      q === "team_permission_update" ||
      q === "mode_set_request" ||
      q === "plan_approval_request" ||
      q === "plan_approval_response"
    );
  } catch { return !1; }
}

// READABLE (for understanding):
function isStructuredProtocolMessage(text) {
  try {
    const parsed = safeJsonParse(text);
    if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return false;
    const t = parsed.type;
    return (
      t === "permission_request" ||
      t === "permission_response" ||
      t === "sandbox_permission_request" ||
      t === "sandbox_permission_response" ||
      t === "shutdown_request" ||
      t === "shutdown_approved" ||
      t === "team_permission_update" ||
      t === "mode_set_request" ||
      t === "plan_approval_request" ||
      t === "plan_approval_response"
    );
  } catch {
    return false;
  }
}

// Mapping: c68→isStructuredProtocolMessage, x$→safeJsonParse
```

Note that `idle_notification`, `task_assignment`, and `shutdown_rejected` are NOT in this set — they have their own predicates (`FO$`, `F68`, `U68`) and are routed differently (idle/assignment go to the TUI; rejection goes to the leader's reply path).

The 10-type set is the **routing-significant** set: messages of these types trigger special handling in the leader's `useInboxPoller` (e.g., open a permission UI, fan a `team_permission_update` to other teammates, set a `mode_set_request` on the receiver).

---

## SendMessage Tool: The Public Wire

`SendMessage` is the Claude-facing tool that ultimately writes to the mailbox. Its validation in v2.1.142:

```javascript
// ============================================
// validateSendMessageInput - SendMessage tool validation
// Location: cli_inner_pretty.js:387084-387120 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
async validateInput(H, $) {
  if (H.to.trim().length === 0) return { result: !1, message: "to must not be empty", errorCode: 9 };
  if (H.to === "*")
    return { result: !1, message: 'broadcast (to: "*") is no longer supported — send a message per recipient', errorCode: 9 };
  let q = ui7(H.to);
  if ((q.scheme === "bridge" || q.scheme === "uds") && q.target.trim().length === 0)
    return { result: !1, message: "address target must not be empty", errorCode: 9 };
  if (H.to.includes("@"))
    return { result: !1, message: "to must be a bare teammate name — there is only one team per session", errorCode: 9 };
  if (typeof H.message === "string") {
    if (!H.summary || H.summary.trim().length === 0)
      return { result: !1, message: "summary is required when message is a string", errorCode: 9 };
    return { result: !0 };
  }
  if (H.message.type === "shutdown_response" && H.to !== az)
    return { result: !1, message: `shutdown_response must be sent to "${az}"`, errorCode: 9 };
  // ... more shutdown_response-specific checks ...
}

// READABLE (for understanding):
async function validateInput(input, ctx) {
  if (input.to.trim().length === 0) {
    return { result: false, message: "to must not be empty", errorCode: 9 };
  }
  if (input.to === "*") {
    return {
      result: false,
      message: 'broadcast (to: "*") is no longer supported — send a message per recipient',
      errorCode: 9,
    };
  }
  const addr = parseMailboxAddress(input.to);
  if ((addr.scheme === "bridge" || addr.scheme === "uds") && addr.target.trim().length === 0) {
    return { result: false, message: "address target must not be empty", errorCode: 9 };
  }
  if (input.to.includes("@")) {
    return {
      result: false,
      message: "to must be a bare teammate name — there is only one team per session",
      errorCode: 9,
    };
  }
  if (typeof input.message === "string") {
    if (!input.summary || input.summary.trim().length === 0) {
      return { result: false, message: "summary is required when message is a string", errorCode: 9 };
    }
  }
  // ... shutdown_response-specific checks ...
}

// Mapping: H→input, $→ctx, ui7→parseMailboxAddress, az→LEAD_NAME
```

### Broadcast Removal — Why?

The `to: "*"` removal is a significant API change. Three motivations are visible in the broader changelog (the "send a message per recipient" message is the explicit guidance):

1. **Misuse pattern.** Models would call `SendMessage({to: "*", message: "ack"})` as a sloppy "wake everyone" gesture, doubling load with no real coordination benefit.
2. **Permission-update conflict.** `team_permission_update` is *already* a broadcast (it's enqueued to every teammate's inbox by the leader, not by `SendMessage`). Having two broadcast paths confuses the audit log: a model-driven broadcast and a leader-driven broadcast were indistinguishable in the mailbox file.
3. **Address scheme complications.** v2.1.x added `bridge:` and `uds:` schemes for cross-session sends (see `parseMailboxAddress` / `ui7`); broadcasting across schemes is semantically muddy — does `to: "*"` fan out across local team and remote-bridge sessions?

The "send a message per recipient" rule resolves all three: the model loops the recipients in its own turn, the leader's broadcast remains the *only* fan-out primitive, and cross-scheme sends require explicit targets.

### `bridge:` and `uds:` Schemes

```javascript
// ============================================
// parseMailboxAddress - SendMessage address parser
// Location: cli_inner_pretty.js:386620-386626
// ============================================

// ORIGINAL (for source lookup):
function ui7(H) {
  if (H.startsWith("uds:")) return { scheme: "uds", target: H.slice(4) };
  if (H.startsWith("bridge:")) return { scheme: "bridge", target: H.slice(7) };
  if (H.startsWith("/")) return { scheme: "uds", target: H };
  return { scheme: "other", target: H };
}

// READABLE (for understanding):
function parseMailboxAddress(address) {
  if (address.startsWith("uds:")) return { scheme: "uds", target: address.slice(4) };
  if (address.startsWith("bridge:")) return { scheme: "bridge", target: address.slice(7) };
  if (address.startsWith("/")) return { scheme: "uds", target: address };
  return { scheme: "other", target: address };
}

// Mapping: ui7→parseMailboxAddress, H→address
```

The three schemes route differently:
- `other` (the default, no prefix) — file mailbox under `~/.claude/{team}/inboxes/`.
- `uds:` or a literal `/`-prefixed path — send over a Unix domain socket directly (used by the daemon for in-line dispatch acks).
- `bridge:` — send over the claude.ai/code "Bridge" session integration. The target is a Bridge session ID; the message goes through the `claude.ai/code` Remote Control protocol rather than the local mailbox.

For the local-team case (the focus of this module), only `other` matters. The `bridge:` scheme is the bridge between the local mailbox protocol and claude.ai/code's remote-control message stream — see `team_mailbox_v_personal.md`.

---

## Why File-Based IPC?

This is a design question worth answering explicitly because socket-based IPC would be the obvious alternative.

**What it does:** File-based JSON-array inboxes with `proper-lockfile`-coordinated writes.

**How it works:**
1. Sender locks `{inbox}.lock`, reads JSON, appends record, writes JSON, unlocks.
2. Receiver polls `{inbox}` every 500 ms, deserializes, processes unread.

**Why this approach (over sockets):**
- **Crash resilience.** If a teammate process dies mid-turn, its inbox survives. On restart, the runner reads any messages received during the outage and continues.
- **Auditability.** Every message is on disk in a human-readable format. `tail -f ~/.claude/foo/inboxes/team-lead.json` is a live transcript of one direction of team traffic.
- **No daemon required.** Tmux pane teammates run separate processes with no parent-child relationship to the leader; sockets would require either a daemon or a peer-discovery mechanism.
- **Plays well with `--bg`.** Background sessions are different processes (often launched by the daemon, not by the leader), and may outlive the leader. Files-as-IPC means the dead leader can't "lose" messages buffered in its memory.

**Trade-offs:**
- **Latency.** 500 ms poll is the floor; lower-frequency exchanges would need inotify/FSEvents wiring (none today).
- **FS dependence.** A network-mounted home directory (rare but possible in enterprise) imposes FS-roundtrip latency on every read.
- **Disk usage.** Inboxes grow monotonically within a session (entries are marked `read`, not removed). A long-running team can accumulate megabytes. This is mitigated by `clearMailbox` on teammate respawn, but persistent leaders pay the cost.

**Key insight:** The mailbox is *eventually consistent* by design. There's no synchronous request/response; the sender writes and moves on, the receiver picks up on the next poll. This makes the protocol a natural fit for the async, multi-agent semantics of teams — no agent is blocked on another's responsiveness.

---

## What the v2.1.142 Architecture Layer Adds

Above the mailbox primitive, v2.1.142 introduces several flow changes that affect *how* the mailbox is used:

1. **Background agents bypass the team mailbox entirely.** A `claude --bg` worker is dispatched by the daemon, not by a team-lead. It has no team and no team mailbox; the mailbox machinery in `w77`/`writeToMailbox` is dormant for those workers.
2. **Channels are NOT mailbox traffic.** A "channel" (gated by `channelsEnabled` setting and `allowedChannelPlugins` allowlist) is a separate inbound-push surface for MCP servers with the `claude/channel` capability. Channels deliver messages directly into the prompt; they never touch the mailbox files.
3. **The `bridge:` SendMessage scheme transits Remote Control, not files.** A `SendMessage({to: "bridge:abc123"})` writes through the bridge transport (HTTPS/SSE), not the local mailbox. This means messages sent to bridge addresses are *not* visible in `~/.claude/{team}/inboxes/`.

Each of these splits has its own audit log (telemetry events, `[bridge:repl]` logs, channel-specific logs), but none of them duplicate mailbox traffic.

---

## See Also

- [team_mailbox_v_personal.md](./team_mailbox_v_personal.md) — Team-shared vs per-agent mailbox semantics, broadcast removal rationale, `bridge:` integration
- [permission_inheritance.md](./permission_inheritance.md) — How `permission_request` / `permission_response` traverse the mailbox
- [coordinator_process_model.md](./coordinator_process_model.md) — The daemon (which does NOT use the mailbox)
- v2.1.112 baseline: `mailbox_protocol.md` for the original message-type registry
