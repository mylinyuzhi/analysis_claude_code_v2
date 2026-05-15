# SendMessage — Inter-Agent Messaging (Swarm Protocol)

> **Tool name:** `SendMessage`
> **Source:** `cli_inner_pretty.js:387042-387268` (`SH5` declaration)
> **Search hint:** *send messages to agent teammates (swarm protocol)*

---

## Overview

`SendMessage` sends a message to a named teammate within a swarm (a team of agents created via `TeamCreate`). Beyond plain text, the schema is a **discriminated union** that also carries protocol-level control messages:
- `shutdown_request` — request a teammate to wind down.
- `shutdown_response` — approve/reject another's shutdown request.
- `plan_approval_response` — approve/reject a teammate's plan.

The recipient is identified by a *bare teammate name* (not an `@` address) — there is one team per session.

---

## Schema

```javascript
// ============================================
// sendMessageInputSchema - VH5 with discriminated message union
// Location: cli_inner_pretty.js:387032-387041
// ============================================

// ORIGINAL (for source lookup):
TH5 = yH(() =>
  y.discriminatedUnion("type", [
    y.object({ type: y.literal("shutdown_request"), reason: y.string().optional() }),
    y.object({ type: y.literal("shutdown_response"), request_id: y.string(), approve: P2(), reason: y.string().optional() }),
    y.object({ type: y.literal("plan_approval_response"), request_id: y.string(), approve: P2(), feedback: y.string().optional() }),
  ]),
);
VH5 = yH(() =>
  y.object({
    to: y.string().describe("Recipient: teammate name"),
    summary: y.string().optional().describe("A 5-10 word summary shown as a preview in the UI (required when message is a string)"),
    message: y.union([y.string().describe("Plain text message content"), TH5()]),
  }),
);

// READABLE (for understanding):
const swarmProtocolMessageSchema = lazySchema(() =>
  z.discriminatedUnion("type", [
    z.object({ type: z.literal("shutdown_request"), reason: z.string().optional() }),
    z.object({ type: z.literal("shutdown_response"), request_id: z.string(), approve: optionalBool(), reason: z.string().optional() }),
    z.object({ type: z.literal("plan_approval_response"), request_id: z.string(), approve: optionalBool(), feedback: z.string().optional() }),
  ]),
);

const sendMessageInputSchema = lazySchema(() =>
  z.object({
    to: z.string().describe("Recipient: teammate name (bare name, not @addr)"),
    summary: z.string().optional().describe("5-10 word UI preview (required when message is a string)"),
    message: z.union([z.string(), swarmProtocolMessageSchema()]),
  }),
);

// Mapping: TH5→swarmProtocolMessageSchema, VH5→sendMessageInputSchema, P2→optionalBool
```

---

## Key Behavior

### Validation rules

1. `to` is non-empty and not `"*"` (broadcast removed; one message per recipient).
2. `to` is a **bare teammate name** — no `@server/teammate` form. Rationale: "there is only one team per session" — disambiguation is unnecessary.
3. For text messages, `summary` is required (UI preview).
4. `shutdown_response` MUST be sent to the named lead (`az` constant — typically `"lead"`).
5. Rejecting a shutdown_request requires a `reason` string.

### Auto-resume on stopped teammate

When the recipient resolves to an agentId whose task is **stopped** (not `running`, `not in-flight`), `SendMessage` doesn't just queue the message — it **resumes the agent** with the message as the new prompt:

```javascript
// READABLE (the auto-resume branch from cli_inner_pretty.js:387130-387159):
const targetTask = appState.tasks[targetAgentId];
if (isResumableTask(targetTask) && !isFinalState(targetTask)) {
  if (targetTask.status === "running") {
    // Active task: just queue the message for next tool-round.
    enqueueMessageToAgent(targetAgentId, message, registry, { origin: { kind: "coordinator" }, isMeta: true });
    return { data: { success: true, message: `Message queued for delivery to ${to} at next tool round.` } };
  }
  // Stopped task: resume in background with this message.
  const resumeResult = await resumeSubagent({ agentId: targetAgentId, prompt: message, toolUseContext, canUseTool, invokingRequestId });
  return { data: { success: true, message: `Agent "${to}" was stopped; resumed it in the background. ...` } };
}
```

### `cwd` restoration on resume (v2.1.118 fix)

```javascript
// ============================================
// resumeSubagent cwd resolution - v2.1.118 fix
// Location: cli_inner_pretty.js:386652
// ============================================

// ORIGINAL (for source lookup):
let J = M?.cwd ?? j,    // M = persisted metadata, j = worktree path

// READABLE (for understanding):
const resumeCwd = persistedMetadata?.cwd ?? worktreePath;
//                ^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^
//                explicit cwd from spawn      fallback if cwd not persisted
//                (v2.1.118 fix)
```

Before v2.1.118, the explicit `cwd` from the original spawn was dropped on resume — the teammate would re-launch in whatever directory the parent session happened to be in. The fix persists `cwd` in the launch metadata (`vE6(agentId)`) and prefers it over `worktreePath` on resume.

---

## Key Insights

**Why a discriminated union and not separate tools?** `SendMessage` is the *only* inter-teammate channel — having separate `RequestShutdown`/`ApprovePlan` tools would clutter the tool list and require teammates to learn many tool names. The discriminator (`type`) keeps the API surface small while letting the runtime route to the right handler.

**`isReadOnly: (H) => typeof H.message === "string"`.** Plain text messages are read-only (they don't change *this agent's* state — they only inform the recipient). Protocol messages can modify state (shutting down a teammate, approving a plan) so they're not read-only and require permission paths.

**`backfillObservableInput` rewrites the input** for telemetry/storage to use the older `{ type, recipient, content, request_id, approve, … }` flat shape rather than the new nested-message form. Backward compatibility: dashboards/replay tooling parse the flat shape; the new schema is just a UX simplification for the model.

**Why `to: "*"` (broadcast) was removed?** Broadcast caused two issues: (1) you couldn't customize the message per recipient, leading to "everyone gets the same generic text" outcomes; (2) it made coordination ambiguous — if six teammates ack a broadcast, the lead has to dedupe. The new rule is "one message per recipient", trading verbosity for clarity.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.118:** Fixed subagents resumed via SendMessage not restoring the explicit `cwd` they were spawned with. The fix lives at line 386652 (`M?.cwd ?? j`).
- **v2.1.114:** Agent panel below the prompt fixes related to teammate visibility.
- The "no broadcast" rule and bare-name addressing are version-stable.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Team / Swarm*

Key functions in this document:
- `SendMessageTool` (`SH5`) — declaration with type-dependent `isReadOnly`
- `swarmProtocolMessageSchema` (`TH5`) — discriminated union for protocol messages
- `sendMessageInputSchema` (`VH5`) — bare-name + summary + union message
- `resumeSubagent` (`uiH`) — auto-resume entry, cwd-restoring (v2.1.118 fix)
- `LEAD_TEAMMATE_NAME` (`az`) — usually "lead" — shutdown_response must target this
- `kH5` — text-message delivery
- `NH5` — shutdown_request handler
