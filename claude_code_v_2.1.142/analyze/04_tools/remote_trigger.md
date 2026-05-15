# RemoteTrigger — Scheduled Remote Agent Routines via claude.ai CCR API

> **Tool name:** `RemoteTrigger`
> **Source:** `cli_inner_pretty.js:385375-385493` (`ae_` declaration)
> **Search hint:** *manage scheduled remote agent routines*
> **Concurrency-safe:** true

---

## Overview

`RemoteTrigger` is the in-process API client for the **claude.ai Code Routines** product. It manages scheduled "routines" (server-side scheduled Claude Code agents) via the CCR API at `${BASE_API_URL}/v1/code/triggers`. Auth (`Bearer ${oauthToken}`) is injected automatically — the model never sees nor handles tokens.

This tool exists primarily so that the model can avoid spawning `curl` with secrets in command arguments (which would be visible to EDR/SIEM telemetry).

---

## Schema

```javascript
// ============================================
// remoteTriggerInputSchema - ie_ five-action discriminator
// Location: cli_inner_pretty.js:385351-385361
// ============================================

// ORIGINAL (for source lookup):
ie_ = yH(() =>
  y.strictObject({
    action: y.enum(["list", "get", "create", "update", "run"]),
    trigger_id: y.string().regex(/^[\w-]+$/).optional().describe("Required for get, update, and run"),
    body: y.record(y.string(), y.unknown()).optional().describe("Required for create and update; optional for run"),
  }),
);

// READABLE (for understanding):
const remoteTriggerInputSchema = lazySchema(() =>
  z.strictObject({
    action: z.enum(["list", "get", "create", "update", "run"]),
    trigger_id: z.string().regex(/^[\w-]+$/).optional(),
    body: z.record(z.string(), z.unknown()).optional(),
  }),
);

// Mapping: ie_→remoteTriggerInputSchema
```

---

## Key Behavior

### Five actions → HTTP methods

| action  | HTTP | Path                              | Body required |
|---------|------|-----------------------------------|---------------|
| list    | GET  | `/v1/code/triggers`               | no            |
| get     | GET  | `/v1/code/triggers/{trigger_id}`  | no            |
| create  | POST | `/v1/code/triggers`               | yes           |
| update  | POST | `/v1/code/triggers/{trigger_id}`  | yes           |
| run     | POST | `/v1/code/triggers/{trigger_id}/run` | optional   |

### v2.1.101 `run` empty-body fix

```javascript
// ============================================
// run action body handling - v2.1.101 empty-body fix
// Location: cli_inner_pretty.js:385446-385452
// ============================================

// ORIGINAL (for source lookup):
case "run": {
  if (!Y) throw Error("run requires trigger_id");
  ((O = "POST"), (M = `${_}/${Y}/run`));
  let { trigger_id: J, ...X } = f ?? {};
  w = X;
  break;
}

// READABLE (for understanding):
case "run": {
  if (!triggerId) throw Error("run requires trigger_id");
  method = "POST";
  url = `${base}/${triggerId}/run`;
  // The v2.1.101 fix: defaulting `f` (body) to `{}` before destructure
  // ensures `X` (the body sans trigger_id) is always a defined object,
  // even when no body was provided. Previously, omitting body caused a
  // TypeError on the spread.
  const { trigger_id: _ignored, ...bodyWithoutTriggerId } = body ?? {};
  outboundBody = bodyWithoutTriggerId;
  break;
}

// Mapping: Y→triggerId, _→base, f→body, w→outboundBody, X→bodyWithoutTriggerId
```

### Auth + headers

Required precursors:
1. `xq()?.accessToken` — must be authenticated with claude.ai.
2. `fE()` — must resolve an organization UUID.

Then the request adds:
- `Authorization: Bearer ${token}` — silently appended in-process.
- `anthropic-version: "2023-06-01"`
- `anthropic-beta: "ccr-triggers-2026-01-30"` (`oe_` constant)
- `x-organization-uuid: ${orgUuid}`
- `anthropic-client-platform: ${platform}`

### Schedule summary post-processing

For `create` and `update` successes, the tool builds a human-readable schedule summary via `an7` (`buildScheduleSummary`):

```javascript
// ============================================
// buildRemoteTriggerScheduleSummary - relative time + claude.ai URL
// Location: cli_inner_pretty.js:385311-385329
// ============================================

// READABLE (key logic):
function buildRemoteTriggerScheduleSummary(trigger, now = new Date()) {
  const enabled = trigger.enabled ?? true;
  const lines = [];
  const nextRun = trigger.next_run_at ? new Date(trigger.next_run_at) : undefined;
  if (nextRun && !Number.isNaN(nextRun.getTime())) {
    const relative = humanRelativeTime(nextRun, { now });   // "in 3 hours"
    const isoUtc = nextRun.toISOString().replace(/\.\d{3}Z$/, "Z");
    const label = trigger.run_once_at ? "runs once"
                : trigger.cron_expression ? `next run (cron ${trigger.cron_expression})`
                : "next run";
    if (enabled) {
      lines.push(`→ Scheduled: ${label} ${relative} (${isoUtc} UTC)`);
      if (trigger.run_once_at && nextRun.getTime() < now.getTime())
        lines.push("⚠ next_run_at is in the past — confirm the date/timezone is intended.");
    } else {
      lines.push(`→ Disabled (next run would be ${relative}, ${isoUtc} UTC)`);
    }
  }
  if (trigger.id) lines.push(`→ View/manage: ${CLAUDE_AI_ORIGIN}/code/routines/${trigger.id}`);
  return lines.length ? lines.join("\n") : undefined;
}
```

The model is instructed in the prompt: "**relay both [server-parsed run time and routine URL] to the user** so they can confirm the time is right and know where the result will appear." This is critical because timezone/cron mis-encoding is silent at the API level — surfacing the server's parsed `next_run_at` is the only post-hoc check.

---

## Key Insights

**Why this tool exists instead of `Bash(curl ...)`.** The OAuth bearer token is a long-lived credential. Passing it on the shell command line exposes it to:
- `ps`/`/proc/<pid>/cmdline` for any other process or EDR/SIEM agent.
- Shell history (`~/.bash_history`, `.zsh_history`).
- Audit pipelines that capture invoked argv.

In-process injection keeps the token in heap memory only.

**`isReadOnly` is action-dependent.** `isReadOnly: (H) => H.action === "list" || H.action === "get"` — the tool reports itself as read-only only for the read actions, which matters for permission auto-approval and dry-run modes.

**`isEnabled` requires four conditions.** `zL() && qq() && !bH(process.env.CLAUDE_CODE_REMOTE) && Z$("tengu_surreal_dali", !1) && S4("allow_remote_sessions")`:
- Claude.ai auth (zL).
- Org/workspace eligibility (qq).
- Not currently *inside* a remote session (CLAUDE_CODE_REMOTE).
- GrowthBook flag (tengu_surreal_dali).
- Org policy `allow_remote_sessions`.

If any are off the tool is hidden.

**Why `body` accepts `record(string, unknown)`?** The API is forward-compatible — new fields land on the server before the client knows about them. The unknown-value escape hatch means new trigger schema fields work without a CLI update.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.101:** Run action `f ?? {}` empty-body fix — the destructure `{ trigger_id: J, ...X } = f ?? {}` was added; previously `f` could be undefined and the spread threw.
- **v2.1.121:** Authentication / OAuth refresh fix relevant here: refresh tokens persistence improvements ensure long-running scheduled routines don't break the management flow.
- **v2.1.139:** Remote Control, `/schedule`, and notification preferences are disabled when `ANTHROPIC_API_KEY` is set (no claude.ai bearer available) — the `isEnabled` check has been extended to honor this.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Scheduling*

Key functions in this document:
- `RemoteTriggerTool` (`ae_`) — top-level declaration with 5 actions
- `remoteTriggerInputSchema` (`ie_`) — strict enum action discriminator
- `buildRemoteTriggerScheduleSummary` (`an7`) — server-parsed time + routine URL builder
- `REMOTE_TRIGGER_BETA_HEADER` (`oe_`) — `"ccr-triggers-2026-01-30"`
- `wY` — refresh-token bookkeeping pre-call
- `xq` — accessor for the claude.ai OAuth token
- `fE` — organization UUID resolver
