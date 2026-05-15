# Team Mailbox vs Per-User — v2.1.142

## TL;DR

Claude Code has *two* logically distinct "inbox" systems that both deliver inbound messages to a running agent — but they have completely different transports, audiences, and trust models:

| Surface | Transport | Audience | Trust | Visibility |
|---------|-----------|----------|-------|-----------|
| **Team mailbox** | `~/.claude/{team}/inboxes/{agent}.json` + `proper-lockfile` | Co-spawned local teammates | Same user, same machine | One file per recipient |
| **Channels** (v2.1.128+) | MCP server with `claude/channel` capability | External services (Slack, GitHub, etc.) via plugins | Org-gated (`channelsEnabled`), plugin-allowlisted | Push only; no file |
| **Bridge** (`bridge:` scheme) | claude.ai/code Remote Control HTTPS/SSE | Remote attached sessions | Authenticated remote control | Bridges to remote `SendMessage`/`/agents` |

This document explains:
- Team mailbox semantics (recipient = single inbox file)
- Per-user / per-agent inbox distinction
- Multi-recipient delivery: a *userland* loop, not a protocol primitive (broadcast `to: "*"` was removed)
- Channels: when they fire, how `channelsEnabled` gates them, what `allowedChannelPlugins` does
- claude.ai/code Bridge session integration: `bridge:` scheme in `SendMessage`

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

Key functions in this document:
- `writeToMailbox` (`cA`) — single-recipient write
- `getInboxPath` (`UTH`) — one file per `(agent, team)` pair
- `parseMailboxAddress` (`ui7`) — `uds:` / `bridge:` / `other` scheme split
- `isChannelsRestrictedByOrg` (`HSk5` ≈ around 394915-394935 inline) — `channelsEnabled` gate evaluator
- `validateSendMessageInput` (in `SH5` / SendMessageTool) — the `to: "*"` rejection
- `LEAD_NAME` (`az`) — `"team-lead"`, the canonical leader recipient
- Settings keys: `channelsEnabled`, `allowedChannelPlugins`, `experimental.channels`

---

## Team-Shared Mailbox vs Per-Agent Inbox

It's important to disambiguate two terms that sound similar:

- **Team mailbox** (informal usage): the collection of all inbox files under `~/.claude/{team}/inboxes/`. This is the shared directory; it's not a single inbox.
- **Per-agent inbox**: the *individual* `{agent}.json` file inside that directory. Each agent (lead and teammates) has exactly one.

There is **no "shared" inbox**. Even the leader's inbox is just another per-agent inbox addressed as `team-lead`. When a teammate "writes to the team", what actually happens is a `SendMessage` call that the leader processes and may then *manually* fan out by re-issuing one `writeToMailbox` per other teammate.

### One File Per Recipient

```
~/.claude/research-fall/
├── config.json
├── tasks.json
├── tasks.json.lock
└── inboxes/
    ├── team-lead.json          ← leader's inbox
    ├── team-lead.json.lock
    ├── alpha.json              ← teammate "alpha"
    ├── alpha.json.lock
    ├── beta.json               ← teammate "beta"
    └── beta.json.lock
```

Reading or writing the lead's inbox does **not** affect teammates' inboxes. There is no global "team-wide" file in `inboxes/`.

### Why Not a Single Shared File?

This design choice deserves explanation:

**What it does:** Per-recipient files instead of a single shared message log.

**How it works:** Each `writeToMailbox(recipient, msg)` only touches `inboxes/{recipient}.json`. Other recipients' files are untouched.

**Why this approach:**
1. **Lock granularity.** Writers contending for the same recipient's file serialize on that recipient's `.lock` only; cross-recipient writes proceed in parallel. With a single shared file, every send-from-anyone-to-anyone would serialize on one global lock.
2. **Read amplification.** A recipient polling its inbox reads only its own messages, not the entire team's history. With a shared file, each poll would deserialize all team traffic and filter.
3. **`read` flag scoping.** The `read: true/false` flag is per-recipient. With a single shared file, you'd need either per-recipient read maps (more complex) or one record per (sender, recipient) pair (more data).
4. **Authorization scoping.** A teammate can only mutate its own inbox (set `read: true` on its messages). With a shared file, every teammate would need write access to the global file and could (accidentally or maliciously) mutate others' read-flags.

**Trade-offs:**
- **Discovery cost.** Listing all messages across a team requires reading every inbox file.
- **Storage overhead.** Per-recipient files have some FS overhead each.

**Key insight:** The mailbox isn't a shared log — it's a **distribution mechanism**. The leader is the natural fan-out point (it owns the agent registry and the team config); teammates only ever address messages to one peer at a time.

---

## Multi-Recipient Delivery

There is no "fan-out" primitive in the protocol. As of v2.1.142, broadcast `to: "*"` is rejected by `validateInput`:

```javascript
// ============================================
// broadcastRejection - validateInput rejects to: "*"
// Location: cli_inner_pretty.js:387090-387095
// ============================================

// ORIGINAL (for source lookup):
if (H.to === "*")
  return {
    result: !1,
    message: 'broadcast (to: "*") is no longer supported — send a message per recipient',
    errorCode: 9,
  };

// READABLE (for understanding):
if (input.to === "*") {
  return {
    result: false,
    message: 'broadcast (to: "*") is no longer supported — send a message per recipient',
    errorCode: 9,
  };
}
```

If a model wants to message all teammates, it must:
1. Read `tasks.json` or call its own team-registry helper.
2. Iterate the teammate list (excluding self and lead).
3. Call `SendMessage({to, message, summary})` once per recipient.

The leader is exempt from this rule because it's the only sender of certain *leader-broadcast* messages — `team_permission_update`, the inline permission-rule fan-out — which use `writeToMailbox` *directly* (not through `SendMessage`), once per teammate. This bypasses the `to: "*"` validator entirely.

### The "Leader-Issued Broadcast" Pattern

When the leader needs to broadcast (e.g., the user just added a permission rule), the code path inside the leader's session does:

```javascript
// Pseudocode of leader-broadcast pattern
for (const member of teamConfig.members) {
  if (member.name === LEAD_NAME) continue;             // skip self
  await writeToMailbox(member.name, {
    from: LEAD_NAME,
    text: JSON.stringify({ type: "team_permission_update", permissionUpdate, ... }),
    timestamp: new Date().toISOString(),
  }, teamConfig.teamName);
}
```

This isn't a "protocol primitive" — it's just a loop. The mailbox sees N independent writes, one per recipient. Each write has independent durability; if one fails, the others succeed (and the failure is logged for that recipient only).

### Why Centralize Broadcasts in the Leader?

The leader has two unique privileges:
1. **It owns `teamConfig.members`** — the authoritative list of who's currently spawned.
2. **It's authorized to write to every teammate's inbox** — there's no permission check inside `writeToMailbox`; the function just writes to whatever path you give it. Restricting broadcast to leader-issued is a *convention* enforced by where the broadcast helper functions live.

A teammate calling `writeToMailbox("alpha", ...)` would technically work — the function doesn't check the caller's identity. But teammates don't have direct access to the team-registry helpers; they only see the SendMessage tool, which validates and rejects `to: "*"`. So in practice, only the leader broadcasts.

---

## Channels — A Different System Entirely

A *channel* in v2.1.128+ is **not** the team mailbox. It's an MCP server endpoint that asynchronously pushes messages into the user's current Claude Code session.

```
                         ┌──────────────────────────────┐
                         │  MCP server with             │
                         │  experimental['claude/channel']│
                         │  capability                  │
                         └─────────┬────────────────────┘
                                   │ pushes inbound message
                                   ▼
                         ┌──────────────────────────────┐
                         │  Claude Code session         │
                         │  (interactive or background) │
                         │                              │
                         │  Inbound msg → inserted      │
                         │  into next user turn         │
                         └──────────────────────────────┘
```

Channels have their own settings:

```javascript
channelsEnabled: y.boolean().optional().describe(
  "Managed-org opt-in for channel notifications (MCP servers with the claude/channel capability " +
  "pushing inbound messages). claude.ai Teams/Enterprise: default off. Console: default on unless " +
  "managed settings exist. Set true to allow; users then select servers via --channels."
),
allowedChannelPlugins: y.array(y.object({ marketplace: y.string(), plugin: y.string() })).optional().describe(
  "Managed-org allowlist of channel plugins. When set, replaces the default Anthropic allowlist — " +
  "admins decide which plugins may push inbound messages. Undefined falls back to the default. " +
  "Requires channelsEnabled: true."
),
```

### Channel Gating (Org Policy)

```javascript
// ============================================
// isChannelsRestrictedByOrg - Default-off logic for managed orgs
// Location: cli_inner_pretty.js:394915-394935
// ============================================

// ORIGINAL (for source lookup):
function ZSk5(H, $) {
  return ($ === "team" || $ === "enterprise") && H?.channelsEnabled !== !0;
}
function $Sk5(H) {
  return H !== null && H.channelsEnabled !== !0;
}
// ... at use site ...
if (channelsBlocked) {
  return {
    enabled: !1,
    reason: "channels not enabled by org policy (set channelsEnabled: true in managed settings)",
  };
}

// READABLE (for understanding):
function isChannelsRestrictedByConsumerTier(settings, tier) {
  // claude.ai Teams or Enterprise: channels OFF by default.
  return (tier === "team" || tier === "enterprise") && settings?.channelsEnabled !== true;
}
function isChannelsRestrictedByConsole(settings) {
  // Console (managed-settings-bearing) accounts: channels OFF if managed settings explicitly say so.
  return settings !== null && settings.channelsEnabled !== true;
}
```

### Allowlist Logic (Anthropic + Org)

When a plugin declares `channel_enable` for one of its MCP servers, the loader checks:

1. **Plugin source must be marketplace-installed.** Local-dev plugins (`pluginSource === "local"`) without `--dangerously-load-development-channels` are rejected.
2. **Plugin must be on the default Anthropic allowlist** OR the org's `allowedChannelPlugins` array (if set; if `allowedChannelPlugins` is undefined, Anthropic's default list applies).
3. **Org gate must be open** — `channelsEnabled === true` in managed settings (or the Console default).

If any check fails, `experimental['claude/channel']` is *stripped* from the server capabilities, and the user sees `"Channels are not enabled for your org · have an administrator set channelsEnabled: true in managed settings"` when they try `/mcp <server> channel_enable`.

### What Happens When a Channel Fires

A connected MCP server with the channel capability can push messages at any time during a session. The repl bridge (`[bridge:repl]` log channel) inserts them into the session's message buffer; on the next user turn, they appear as `user`-role messages with a `[from: server-name]` tag. The model sees them as if the user typed them.

### Why Channels Are Not the Mailbox

- **Different transport.** MCP over SSE / HTTP, not files.
- **Different scope.** A channel-bearing MCP server is per-*session*, not per-team. Two unrelated `claude` sessions can each subscribe independently.
- **Different trust model.** Channels accept messages from *external* sources (with prompt-injection risks; the dialog explicitly says so). The team mailbox only accepts messages from same-user, same-machine, same-team processes.
- **Different lifecycle.** Channels deactivate on `/clear` and certain MCP reconnects; mailboxes persist on disk indefinitely.

A channel message and a mailbox message can coexist in the same session, but they never see each other.

---

## claude.ai/code Bridge Session Integration

Claude Code's "Remote Control" (claude.ai/code in browsers, mobile app, etc.) connects to a running local session over an HTTPS+SSE backplane. When this is active, the local session is "bridged" to the remote UI.

```
                     ┌──────────────────────────────┐
                     │   claude.ai/code (web UI)    │
                     │   or mobile app              │
                     └─────────┬────────────────────┘
                               │ Bridge protocol (HTTPS+SSE)
                               ▼
        ┌────────────────────────────────────────────┐
        │  local `claude` session                    │
        │  CLAUDE_CODE_ENVIRONMENT_KIND="bridge"     │
        │                                            │
        │  Bridge messages   ↔   local mailbox       │
        │       (Remote Control transport)           │
        └────────────────────────────────────────────┘
```

The bridge isn't strictly mailbox traffic; it's a separate protocol. But `SendMessage` has a `bridge:` scheme in its address parser specifically to let an *in-session* model emit a message that's delivered to the *bridged* remote view:

```javascript
function ui7(H) {
  if (H.startsWith("uds:")) return { scheme: "uds", target: H.slice(4) };
  if (H.startsWith("bridge:")) return { scheme: "bridge", target: H.slice(7) };
  if (H.startsWith("/")) return { scheme: "uds", target: H };
  return { scheme: "other", target: H };
}
```

A `SendMessage({to: "bridge:abc123", message, summary})` doesn't write a file — it routes through the bridge transport and surfaces in the remote UI's session list. The target `abc123` is a *Bridge session ID* (typically opaque to the model; populated by the bridge handshake).

### Why a Distinct Scheme?

Three options exist for sending to a bridged session, and each has trade-offs:

1. **Address by bare name** (current default `other` scheme). Would conflate local-team and remote-bridge targets — they have different naming conventions and lifetimes.
2. **Address by `uds:`** (Unix socket). Local sockets, not HTTPS. The bridge isn't a UDS in the local sense; it's an HTTPS roundtrip.
3. **Address by `bridge:`** (chosen). Explicit prefix; the model knows it's targeting a remote session; the validator can require non-empty targets.

The third was chosen because **address space ambiguity is corrupting**. A local teammate named `support` and a bridge session ID happening to be `support` would otherwise collide in the routing table. With `bridge:support`, the routing is unambiguous.

### Cross-System Send Semantics

A `SendMessage({to: "bridge:remoteUser", ...})` is:
- **Not** written to any local inbox file.
- **Is** delivered to the remote session via the Bridge transport.
- **Does not** appear in `~/.claude/{team}/inboxes/`.
- **Telemetry** records `bridge:` scheme separately (`label: "bridge"`).

Conversely, a `SendMessage({to: "alpha"})` (local team scheme) is:
- **Not** routed over Bridge.
- **Is** written to `~/.claude/{team}/inboxes/alpha.json`.

Cross-routing (local-to-remote or vice versa) requires intermediate handling at the leader/bridge layer. There's no automatic translation; each scheme has its own complete delivery path.

---

## Implications for the Model

The model sees three distinct facts in its tool-use surface:

1. **`SendMessage` tool, target = local teammate.** Filesystem mailbox, ~500ms latency, must enumerate recipients explicitly.
2. **`SendMessage` tool, target = `bridge:...`** address. Remote Control transport, network latency, single recipient.
3. **`channels` tool (or implicit MCP server)** — does NOT use SendMessage at all. Channel messages are *pushed* by the server, not pulled by the model.

For users running a vanilla local-only team (no channels, no bridge): only system 1 matters. For users on claude.ai/code Bridge with channel-providing MCPs: all three coexist, with no interaction.

---

## Lifecycle Summary

| Event | Team mailbox | Channels | Bridge |
|-------|--------------|----------|--------|
| Teammate spawn | `clearMailbox(name, team)` resets that teammate's file | unaffected | unaffected |
| Teammate shutdown | Inbox file is **not** deleted (kept for audit) | unaffected | unaffected |
| Team disband | Files remain on disk (no cleanup) | unaffected | unaffected |
| `/clear` in session | Files remain | Channel subscriptions are typically dropped | Bridge connection may persist |
| `claude --bg` start | No team, no mailbox | unaffected | Bridge may attach |
| Daemon retire-idle | unaffected (no team) | unaffected | Bridge disconnects |

The team mailbox persists across crashes, restarts, and even reboots. The bridge connection and channel subscriptions live within a single session.

---

## See Also

- [mailbox_protocol.md](./mailbox_protocol.md) — File-IPC semantics, message envelope, lock primitives
- [permission_inheritance.md](./permission_inheritance.md) — `team_permission_update` broadcast logic
- [tool_inheritance.md](./tool_inheritance.md) — MCP server (including channel-providing) inheritance for `--agent main-thread`
