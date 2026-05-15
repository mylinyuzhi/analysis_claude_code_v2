# TeamCreate — Spawn a Multi-Agent Swarm Team

> **Tool name:** `TeamCreate`
> **Source:** `cli_inner_pretty.js:386243-386345` (`JH5` declaration)
> **Search hint:** *create a multi-agent swarm team*

---

## Overview

`TeamCreate` creates a new **swarm team** for coordinating multiple agents under a single lead. The caller becomes the team's lead with `agent_type` (default the lead constant `az`, typically `"lead"`); subsequent `SendMessage`s to named teammates flow through the team's coordination file at `~/.claude/teams/<name>/`.

A lead can only manage one team at a time — calling TeamCreate twice without an intervening `TeamDelete` errors with "Already leading team X".

---

## Schema

```javascript
// ============================================
// teamCreateInputSchema - jH5 name + description + agent_type
// Location: cli_inner_pretty.js:386231-386241
// ============================================

// ORIGINAL (for source lookup):
jH5 = yH(() =>
  y.strictObject({
    team_name: y.string().describe("Name for the new team to create."),
    description: y.string().optional().describe("Team description/purpose."),
    agent_type: y.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). ...'),
  }),
);

// READABLE (for understanding):
const teamCreateInputSchema = lazySchema(() =>
  z.strictObject({
    team_name: z.string(),
    description: z.string().optional(),
    agent_type: z.string().optional(),
  }),
);

// Mapping: jH5→teamCreateInputSchema
```

`validateInput` requires non-empty `team_name`.

---

## Key Behavior

### Team file layout

```
~/.claude/teams/<team_name>/      ← team metadata
~/.claude/tasks/<team_name>/       ← task outputs

team file contents (JSON):
{
  name: "<team_name>",
  description: "<optional>",
  createdAt: <epochMs>,
  leadAgentId: "<agentId>",
  leadSessionId: "<sessionId>",
  members: [
    { agentId, name: "lead" (az), agentType, model, joinedAt, tmuxPaneId, cwd, subscriptions: [] }
  ]
}
```

### Exclusive creation

```javascript
try {
  await o38(O, J, { exclusive: !0 });   // file create with O_EXCL — fails if team file exists
} catch (P) {
  if (O8(P) === "EEXIST" && mk$(P) === j)
    throw Error(`Team "${O}" already exists at ${j}. Choose a different team_name, or run ${St} on the existing team first.`);
  throw P;
}
```

Atomicity is at the filesystem level. Two concurrent TeamCreates with the same name on the same machine will lose the race to file-creation; only one wins.

### App state setup post-create

```javascript
setAppState((prev) => ({
  ...prev,
  teamContext: {
    teamName, teamFilePath, leadAgentId,
    teammates: {
      [leadAgentId]: { name: "lead", agentType, color, tmuxSessionName: "", tmuxPaneId: "", cwd: cwd(), spawnedAt },
    },
  },
}));
```

After successful create, the running session is **the lead** of the new team. Subsequent SendMessage calls route through this team context.

### `isEnabled: eK()` — swarm feature gate

The tool only surfaces when the swarm feature (`eK()`) is on. In non-swarm builds it's invisible.

---

## Key Insights

**Why one lead per team?**
- Avoids the "two leads disagree on policy" coordination problem (Byzantine generals).
- Lead-as-owner makes the team-deletion semantics simple: the lead created it, the lead can dispose it. Teammates can't accidentally delete the team out from under each other.
- Telemetry and audit are simpler: one lead session ID maps to the team.

**Why per-machine teams (filesystem-backed)?**
- Lightweight: no DB or coordination server needed.
- POSIX `O_EXCL` is sufficient for exclusive creation.
- Teams are session-life — if the host dies, the team dies (cleanly).

**`description` is optional but recommended.** Goes into the team file metadata; appears in `/agents`-style introspection. Without it, the team name is the only context for future readers.

**`agent_type` defaults to the lead constant `az`** which (in current builds) is typically `"lead"`. Overriding lets the lead identify as a domain role ("researcher", "test-runner") which may bind to a specific subagent prompt set via the agent definition system.

**Lead session ID (`v$()` — `getSessionId`) is captured.** This binds the team to a specific session; if that session ends (REPL exits, OS reboots), the team is effectively orphaned and must be cleaned via TeamDelete on a future run.

---

## v2.1.112 → v2.1.142 Deltas

- The tool is feature-gated (`eK()`); swarm builds may have varying surface across versions but the schema and creation flow are stable.
- **v2.1.114:** Fixed crash in the permission dialog when an agent-team teammate requested tool permission (touches TeamCreate's permission path).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Team / Swarm*

Key functions in this document:
- `TeamCreateTool` (`JH5`) — declaration
- `teamCreateInputSchema` (`jH5`) — strict { team_name, description?, agent_type? }
- `TEAM_CREATE_TOOL_NAME` (`Am`) — `"TeamCreate"`
- `LEAD_TEAMMATE_NAME` (`az`) — typically `"lead"`
- `teamFileLocation` (`Ci`) — path builder
- `teamFilePath` (`In`) — agent-id-derived path
- `isSwarmEnabled` (`eK`) — feature gate
- `buildTeamCreatePrompt` (`Gi7`) — long-form prompt
