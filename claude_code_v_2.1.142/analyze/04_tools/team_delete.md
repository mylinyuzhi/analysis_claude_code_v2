# TeamDelete — Disband Swarm Team & Clean Up

> **Tool name:** `TeamDelete`
> **Source:** `cli_inner_pretty.js:386387-386446` (`LH5` declaration)
> **Search hint:** *disband a swarm team and clean up*

---

## Overview

`TeamDelete` removes the current team and its task directories. The team name is **automatically determined** from the current session's `teamContext` — no parameters needed. The tool fails if active teammates remain; they must be gracefully shut down first.

---

## Schema

```javascript
// ============================================
// teamDeleteInputSchema - XH5 empty
// Location: cli_inner_pretty.js:386386
// ============================================

// ORIGINAL (for source lookup):
XH5 = yH(() => y.strictObject({}));

// READABLE (for understanding):
const teamDeleteInputSchema = lazySchema(() => z.strictObject({}));

// Mapping: XH5→teamDeleteInputSchema
```

Truly empty input — the current session's team context is the implicit target.

---

## Key Behavior

### Cleanup steps

For the current `teamContext.teamName`:

1. **Remove team directory** — `~/.claude/teams/<team-name>/` and its team file.
2. **Remove task directory** — `~/.claude/tasks/<team-name>/`.
3. **Clear team context** — `setAppState({ teamContext: undefined, inbox: { messages: [] } })`.
4. **Clear teammate colors** — `teammateColors.clear()` so colors are reusable for next team.

### Active-teammate check

```javascript
async call(H, $) {
  const teamName = getAppState().teamContext?.teamName;
  if (teamName) {
    const teamFile = readTeamFile(teamName);
    if (teamFile) {
      const activeNonLead = teamFile.members
        .filter((m) => m.name !== LEAD_NAME)
        .filter((m) => m.isActive !== false);
      if (activeNonLead.length > 0) {
        const names = activeNonLead.map((m) => m.name).join(", ");
        return {
          data: {
            success: false,
            message: `Cannot cleanup team with ${activeNonLead.length} active member(s): ${names}. Use requestShutdown to gracefully terminate teammates first.`,
            team_name: teamName,
          },
        };
      }
    }
    // ... delete directories, fire telemetry ...
  }
  // ... clear app state ...
}
```

The check prevents the lead from "abandoning" running teammates. If teammates are still active, the lead must:
1. Send `SendMessage(..., { type: "shutdown_request" })` to each.
2. Wait for their `shutdown_response`s.
3. Then call TeamDelete.

### Idempotent on missing team

If `teamContext` is undefined (no current team), the tool **succeeds quietly** with `{ success: true, message: "..." }`. This makes TeamDelete safe to call as a cleanup-on-error fallback without first checking team state.

---

## Key Insights

**Why no `team_name` parameter?**
- A session can only lead one team at a time (enforced by TeamCreate).
- Allowing arbitrary-team-name deletion would let a session destroy a team it doesn't own (which would also race with the owning session).
- The implicit-current-team rule keeps ownership semantics clean: "you can only dispose what you lead."

**Why is the "active members" check based on `name !== LEAD_NAME` and `isActive !== false`?**
- Excluding the lead from the active-list lets the lead delete its own team without filing a shutdown_request against itself.
- `isActive !== false` is the soft-shutdown marker — teammates set `isActive: false` when they gracefully terminate. Members that simply died (crashed without setting isActive) are still considered active for safety; the lead must explicitly resolve them.

**The cleanup is filesystem AND state.** Both `~/.claude/teams/<name>/` (filesystem) and `appState.teamContext` (memory) are cleared. Without the filesystem step, a future session could rejoin a "ghost" team. Without the state step, the current session would still think it's leading.

**`shouldDefer: true`** keeps this tool out of the default tool list — it's surfaced by tool-search when the lead asks "how do I clean up this team?".

---

## v2.1.112 → v2.1.142 Deltas

- The tool's surface and cleanup behavior have been stable across this window.
- Touches the team-color registry, which has been stable since the swarm-color feature was added.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Team / Swarm*

Key functions in this document:
- `TeamDeleteTool` (`LH5`) — declaration with active-member check
- `teamDeleteInputSchema` (`XH5`) — empty
- `TEAM_DELETE_TOOL_NAME` (`St`) — `"TeamDelete"`
- `buildTeamDeletePrompt` (`ki7`) — prompt template with shutdown-first guidance
- `a38` — team-directory deleter
- `GE6` — task-directory cleanup
- `L67` — teammate color registry reset
- `N2` — team-file reader
