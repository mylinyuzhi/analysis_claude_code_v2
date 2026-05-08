# Configuration Schema — Agent Teams (v2.1.112)

## Overview

A team's configuration is split across three layers:

1. **Persistent team config** — `~/.claude/teams/{team}/config.json` (the canonical source-of-truth for member registry, lead identity, mode preferences).
2. **CLI flags** — passed to the spawned `claude` binary in pane modes; control per-process behavior.
3. **Environment variables** — control gate behavior, feature enablement, terminal env propagation.

This document specifies each layer's schema, the load/save paths, the precedence rules, and the validation logic.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key functions and constants:
- `getTeamConfigPath` (`oF`) — chunks.155.mjs:1173
- `readTeamConfigSync` (`uM`) — chunks.155.mjs:1177
- `readTeamConfigAsync` (`$J6`) — chunks.155.mjs:1187
- `writeTeamConfig` (`lM6`) — chunks.155.mjs:1197
- `getTeammateMode` (`UX6`) — chunks.137.mjs:1738
- `setTeammateModeOverride` (`gX6`) — chunks.137.mjs:1735
- `buildTeammateEnv` (`HK8`) — chunks.137.mjs:2374
- `agentTeamsCliFlag` (`cN_`) — chunks.63.mjs:2613
- `isAgentTeamsEnabled` (`z4`) — chunks.63.mjs:2617
- `LEAD_NAME` (`Mz`) — chunks.99.mjs:1920
- `SWARM_SESSION` (`Ny`) — chunks.99.mjs:1922
- `TEAMMATE_COMMAND_ENV` (`Uh6`) — chunks.99.mjs:1930

---

## Layer 1: Team Config File

### Path

```
~/.claude/teams/{sanitizedTeamName}/config.json
```

`{sanitizedTeamName}` is the team name passed to TeamCreate, lowercased and stripped of non-`[a-z0-9-]` characters. The sanitization is consistent with mailbox path naming.

### Schema

```typescript
type TeamConfig = {
  teamName: string;                    // canonical (sanitized) team name
  leadAgentId: string;                 // the team-lead's stable agent id
  members: TeamMember[];               // registry of all agents (lead + teammates)
  teammateMode?: "auto" | "in-process" | "tmux";  // default backend selection
  teammateDefaultModel?: string;       // model identifier
  description?: string;                // free-text team purpose
  // ... other optional fields (memory paths, hooks scoping, etc.)
};

type TeamMember = {
  agentId: string;                     // stable id derived from name+team
  name: string;                        // sanitized agent name
  agentType?: string;                  // custom agent type (if any)
  color?: string;                      // hex color for TUI
  model?: string;                      // per-member model override
  backendType?: "in-process" | "tmux" | "iterm2";   // last-known spawn backend
  tmuxPaneId?: string;                 // last-known pane id (for reconnect)
  spawnedAt?: number;                  // unix epoch ms
  cwd?: string;                        // working directory
};
```

### Read/Write

```javascript
// Sync read (only used in startup paths)
function readTeamConfigSync(teamName) {
  const path = getTeamConfigPath(teamName);
  try {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

// Async read (used during running session)
async function readTeamConfigAsync(teamName) {
  const path = getTeamConfigPath(teamName);
  try {
    return JSON.parse(await fs.readFile(path, "utf-8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

// Write (creates parent dirs)
async function writeTeamConfig(teamName, config) {
  const path = getTeamConfigPath(teamName);
  await fs.mkdir(dirname(path), { recursive: true });
  await fs.writeFile(path, JSON.stringify(config, null, 2), "utf-8");
}
```

Reads return `null` on ENOENT (team doesn't exist yet). Other errors propagate. Writes overwrite — there is no append semantics.

### Lifecycle

| Event | Effect |
|-------|--------|
| TeamCreate tool call | Writes initial config (members = [], leadAgentId set) |
| First spawn | Adds the lead to members; writes |
| Each subsequent spawn | Appends teammate to members; writes |
| Teammate killed | Removes from members; writes |
| `teammateMode` UI toggle | Updates teammateMode field; writes |
| Default model change | Updates teammateDefaultModel; writes |
| Team delete | Removes the entire `~/.claude/teams/{team}/` dir |

### Cross-Process Reads

Pane teammates read this file when they boot (via `--team-name` flag) to discover the lead's agent id and color. They do not write to it themselves — only the leader's process mutates the config.

### Validation

There is no schema enforcement at write time — the writer trusts itself. At read time, missing fields fall back to defaults:
- `teammateMode` → `"auto"`
- `teammateDefaultModel` → main loop model
- `members` → `[]`

---

## Layer 2: CLI Flags

The spawned `claude` binary in pane modes parses these flags at startup and routes itself into the teammate boot path.

| Flag | Type | Description |
|------|------|-------------|
| `--agent-id <id>` | string | Stable agent id for the spawning process |
| `--agent-name <name>` | string | Sanitized name (used in inbox path, sender field) |
| `--team-name <name>` | string | Team to join; must already have a config.json |
| `--agent-color <hex>` | string | Color used in TUI tags |
| `--parent-session-id <id>` | string | Lead's session id; used for `tasks.json` co-resolution |
| `--plan-mode-required` | boolean | If present, spawn already in plan mode |
| `--agent-type <type>` | string | Match a defined agent in `~/.claude/agents/` |
| `--teammate-mode <auto\|in-process\|tmux\|in-process-only>` | string | Force a backend |
| `--model <model>` | string | Pin the teammate's model |
| `--agent-teams` | boolean | Alias for `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |

### Construction

```javascript
// Conceptual c7Y/l7Y argument assembly
const teammateArgs = [
  `--agent-id ${shellEscape([teammateId])}`,
  `--agent-name ${shellEscape([sanitizedName])}`,
  `--team-name ${shellEscape([teamName])}`,
  `--agent-color ${shellEscape([teammateColor])}`,
  `--parent-session-id ${shellEscape([currentSessionId])}`,
  planModeRequired ? "--plan-mode-required" : "",
  agentType ? `--agent-type ${shellEscape([agentType])}` : "",
].filter(Boolean).join(" ");
```

`shellEscape` (`A5`) protects against argument injection — names with quotes or spaces would otherwise break the shell command.

### Why pass via CLI, not env vars?

Env vars are global to the spawned process; CLI flags are explicit and inspectable. A user troubleshooting can `tmux send-keys` a teammate's pane to see the launch command in scrollback. Env vars would be hidden.

---

## Layer 3: Environment Variables

### Gating

| Var | Type | Effect |
|-----|------|--------|
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | boolean | First half of `z4()` gate |

`z4()` requires both this AND `tengu_amber_flint` (server-side flag). Without both, the agent teams tool surface is hidden.

### Inherited

| Var | Type | Effect |
|-----|------|--------|
| `CLAUDECODE=1` | constant | Marker that this is a Claude Code-spawned process |
| `CLAUDE_CODE_TEAMMATE_COMMAND` | string | The launch command (set by parent for debug/relaunch) |

These are passed through the pane spawn's `env ${env}` prefix:

```javascript
// HK8 — Build teammate env inheriting standard Claude env
function buildTeammateEnv() {
  const allowList = ["CLAUDECODE=1", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"];
  // ... possibly add more from process.env
  return allowList.join(" ");
}
```

### CLAUDE_CODE_TEAMMATE_COMMAND

Set by the leader on the spawning shell so the teammate process knows the exact command line that started it. Useful for:
- Debugging (echo the var to see how the process was launched).
- Self-restart logic (the teammate could re-exec itself with the same args).

---

## Precedence Rules

For backend selection (`teammateMode`):

```
1. CLI flag --teammate-mode  (highest)
2. Runtime override gX6
3. Team config teammateMode
4. bF() heuristic
```

For model:

```
1. CLI flag --model           (highest, on a per-spawn basis)
2. Tool input .model
3. Team config teammateDefaultModel
4. Leader's mainLoopModel      (default)
```

For permission mode:

```
1. plan_mode_required input    (if true, force "plan")
2. Leader's current mode minus "plan"/"dontAsk" rewrite
3. "default"
```

These chains let users override at any level without committing to it for the whole team.

---

## tasks.json Schema

The shared task list lives at `~/.claude/teams/{team}/tasks.json` (or possibly a session-keyed variant; the implementation is shared with the standalone task tool).

```typescript
type Task = {
  id: number;                          // monotonic
  subject: string;                     // short title
  description?: string;                // long form
  status: "pending" | "in_progress" | "completed" | "cancelled";
  owner?: string;                      // teammate that claimed it; null = unowned
  blockedBy: number[];                 // task ids that must complete first
  // ... metadata fields (createdAt, updatedAt, etc.)
};
```

### Operations

| Op | Function | Lock? |
|----|----------|-------|
| Read all | `readTasksFile` (`Qf`) | No |
| Update field | `updateTaskField` (`ns`) | Yes |
| Atomic claim | `atomicClaimTask` (`HR4`) | Yes |
| Append new | (via Task tool) | Yes |

The lock semantics mirror the inbox lock: read is unlocked, mutate is locked. The atomic claim gives owner-set-once-with-failure-on-race semantics.

---

## Initial TeamCreate Flow

```
TeamCreate({team_name, description?, agent_type?})
  │
  ├─ sanitize team_name
  ├─ check for existing config.json → if exists, error "team already exists"
  ├─ create ~/.claude/teams/{team}/ dir tree:
  │   - config.json (with leadAgentId, empty members array)
  │   - tasks.json  (with empty array)
  │   - inboxes/    (empty dir)
  ├─ emit tengu_team_created
  └─ return {team_name, config_path}
```

The team starts empty; teammates are added as they are spawned.

---

## Per-Member Persistence on Spawn

`y77(teamName, teammateId, info)` is the function that adds/updates a member entry under a lock:

```javascript
async function persistTeammateRecord(teamName, teammateId, info) {
  // Locked read-modify-write of config.json's members array
  const release = await lockTeamConfig(teamName);
  try {
    const config = await readTeamConfigAsync(teamName);
    const idx = config.members.findIndex(m => m.agentId === teammateId);
    const merged = { ...config.members[idx], ...info, agentId: teammateId };
    if (idx >= 0) config.members[idx] = merged;
    else config.members.push(merged);
    await writeTeamConfig(teamName, config);
  } finally {
    await release();
  }
}
```

The fields included in `info` vary by spawn path:
- In-process: `{tmuxPaneId: "in-process", backendType: "in-process"}`.
- Pane modes: `{tmuxPaneId: actualPaneId, backendType: backend.type}`.

---

## Why a Single Config File per Team, Not per Member?

Three reasons:
1. **Atomicity.** Adding/removing members is one lock acquire, one read, one write.
2. **Coherence.** Reading the team's full state is one file read (not N file reads of N members).
3. **Debuggability.** A user can `cat config.json` to see the full team in one place.

Trade-off: hot path (every spawn writes the same file) means contention if many teammates spawn concurrently. In practice, spawns are user-driven and serial enough that this isn't an issue.

---

## Cross-Session Persistence

Team config persists across Claude sessions. If a user runs:

```
$ claude   # session 1
> /agent-team create mid-team
> /agent-team spawn alpha
^D
$ claude   # session 2
> /agent-team list      # shows mid-team with alpha registered
```

Session 2 reads the config and recognizes the team. However, the **runtime tasks** (`AppState.tasks`) are session-scoped — alpha's running state from session 1 is gone unless alpha was running in a tmux pane that survived (in which case alpha is still alive but disconnected from any leader).

This is by-design: teams are persistent metadata; runtime state is ephemeral.

---

## Cleanup on Team Delete

Team deletion is a **separate tool** — `Cc` (object `jJY` at chunks.152.mjs:2609), distinct from `TeamCreate`. The `userFacingName()` is empty (it's an internal/programmatic tool, not surfaced as a slash command).

The cleanup tool's contract:

```javascript
async function teamCleanupCall(_, ctx) {
  const teamName = ctx.getAppState().teamContext?.teamName;
  if (teamName) {
    const config = readTeamConfigSync(teamName);
    if (config) {
      // Refuse if any active members other than the lead remain
      const activeNonLead = config.members
        .filter(m => m.name !== "team-lead")
        .filter(m => m.isActive !== false);
      if (activeNonLead.length > 0) {
        return {
          data: {
            success: false,
            message: `Cannot cleanup team with ${activeNonLead.length} active member(s): ${activeNonLead.map(m => m.name).join(", ")}. Use requestShutdown to gracefully terminate teammates first.`,
            team_name: teamName,
          }
        };
      }
    }
    await removeTeamDirectory(teamName);     // pd8
    cleanupTeamWorktrees(teamName);          // l37
    ctx.teammateColors.clear();
    clearTeamRegistry();                     // zR4
    emitTelemetry("tengu_team_deleted", { team_name: teamName });
  }
  ctx.setAppState(s => ({...s, teamContext: undefined, inbox: { messages: [] }}));
  return { data: { success: true, team_name: teamName, ... } };
}
```

Key invariants:

1. **Refuses to run if any non-lead teammates are still active.** The user must call `requestShutdown` (which writes `shutdown_request`) on each teammate first; the leader sees `shutdown_approved` come back and the teammate exits; *only then* is cleanup safe.
2. **Removes the entire `~/.claude/teams/{team}/` directory** — config, tasks, inboxes, all gone.
3. **Clears the runtime team context and any tmux worktrees** associated with the team.
4. **Emits `tengu_team_deleted`** at the end.

After cleanup, no future Claude session will see this team. The decision to refuse-on-active rather than auto-shutdown protects against accidental cleanup mid-collaboration.

---

## Configuration Inspection from CLI

The team config can be inspected with standard Unix tools:

```bash
# List all teams
ls ~/.claude/teams/

# View a team's full config
cat ~/.claude/teams/myteam/config.json | jq

# View task list
cat ~/.claude/teams/myteam/tasks.json | jq '[.[] | select(.status != "completed")]'

# View inbox
cat ~/.claude/teams/myteam/inboxes/team-lead.json | jq '[.[] | select(.read | not)]'
```

All files are pretty-printed JSON, so they're greppable and editable.

---

## Backwards Compat with v2.1.76

Configs created in v2.1.76 are forward-compatible with v2.1.112. Field names are unchanged. New optional fields (`teammateMode`, `teammateDefaultModel`) default to `"auto"` and the leader's main model respectively when missing.

The reverse (v2.1.112 → v2.1.76) is also compatible: v2.1.76 simply ignores unknown fields and uses its own defaults.

---

## Summary

Configuration spans three layers — persistent team file, per-spawn CLI flags, gate-controlling env vars — with a clear precedence order. Schemas are minimal, fields default sensibly when missing, and standard Unix tools can inspect everything. Cross-session persistence is metadata-only; runtime task state is ephemeral.
