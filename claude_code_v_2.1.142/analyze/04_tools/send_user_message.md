# SendUserMessage — Primary User-Visible Output Channel

> **Tool name:** `SendUserMessage` (alias: `Brief` — legacy name)
> **Source:** `cli_inner_pretty.js:378456-378510` (`rd7` declaration)
> **Search hint:** *send a message to the user — your primary visible output channel*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

In Kairos / Brief mode, this is **the only channel through which the model talks to the user**. Plain text emitted *outside* `SendUserMessage` is hidden in the detail view that most users never expand — "the answer lives here, or it doesn't reach them at all."

The tool is registered with `aliases: [dY6]` (`"Brief"`) so legacy code calling `Brief(...)` still resolves to the same handler.

---

## Schema

```javascript
// ============================================
// sendUserMessageInputSchema - us_ message + attachments + status
// Location: cli_inner_pretty.js:378423-378438
// ============================================

// ORIGINAL (for source lookup):
us_ = yH(() =>
  y.strictObject({
    message: y.string().describe("The message for the user. Supports markdown formatting."),
    attachments: y
      .array(y.union([y.string(), xs_()]))
      .optional()
      .describe("Optional attachments ... file path string OR pre-resolved {file_uuid, file_name, size, is_image} object ..."),
    status: y.enum(["normal", "proactive"]).describe("Use 'proactive' when you're surfacing something the user hasn't asked for; 'normal' when replying."),
  }),
);

// READABLE (for understanding):
const sendUserMessageInputSchema = lazySchema(() =>
  z.strictObject({
    message: z.string().describe("Markdown-supported message body"),
    attachments: z.array(z.union([z.string(), preuploadedFileSchema()])).optional(),
    status: z.enum(["normal", "proactive"]),
  }),
);

// Mapping: us_→sendUserMessageInputSchema, xs_→preuploadedFileSchema
```

The `attachments` union accepts **two forms per entry**:
1. **File path** (string, absolute or cwd-relative) — for files Claude can read locally.
2. **Preuploaded reference** (`{file_uuid, file_name, size, is_image}`) — for files already uploaded by a device tool like `attach_file`; passed through verbatim.

---

## Key Behavior

### `sentAt` is timestamped at the emitting process

```javascript
async call({ message, attachments, status }, context) {
  const sentAt = new Date().toISOString();   // captured here, not at delivery
  logEvent("tengu_brief_send", { proactive: status === "proactive", attachment_count: attachments?.length ?? 0 });
  if (!attachments || attachments.length === 0) return { data: { message, sentAt } };
  const resolved = await resolveAttachments(attachments, { replBridgeEnabled: ..., signal: ... });
  return { data: { message, attachments: resolved, sentAt } };
}
```

The output schema describes `sentAt` as: *"ISO timestamp captured at tool execution on the emitting process. Optional — resumed sessions replay pre-sentAt outputs verbatim."* — meaning older sessions that pre-date the `sentAt` field still parse correctly.

### Attachment resolution

`J38` (`resolveAttachments`) walks the input array:
- **String entries** → `validateAttachmentPaths` (stat the file, get size, derive isImage) → upload to filestore → return `{ path, size, isImage, file_uuid }`.
- **Object entries** → pass through (already uploaded, has `file_uuid`).

The `replBridgeEnabled` flag controls whether to also push the attachment over the Remote Control bridge to the connected device.

### Status drives downstream routing

The `status` field labels intent so downstream channels can route differently:
- `"normal"` — replying to what the user just asked. Routes through the standard chat stream.
- `"proactive"` — initiating contact: scheduled task finished, blocker surfaced, etc. Routes through the push/notification channels (if connected) so it can reach a user who isn't watching.

The prompt explicitly says: *"Set it honestly; downstream routing uses it."*

---

## Key Insights

**Why a separate tool versus just streaming text?**
- In Kairos/assistant mode, the system prompt says *"text outside this tool is hidden in detail view"*. Forcing the model to actively call `SendUserMessage` makes the intent explicit and skip-resistant.
- A tool call has structured `{ message, status, attachments }` — easy to route, easy to log, easy to filter for telemetry.
- The `BRIEF_ENFORCE_SENTINEL` (`E$_ = "You ended the turn without calling SendUserMessage."`) is injected when the model finishes a turn without sending a message — this catches "I did the work but didn't tell the user" failure modes.

**The `BRIEF_PROACTIVE_SECTION` (`y$_`)** is a system-prompt insertion that hard-codes the contract — second person ("your config"), no third person, terse messages, ack-then-work-then-result pattern. Without it, the model defaults to verbose academic prose.

**Why does the prompt say "Even for 'hi'. Even for 'thanks'."?** Because the natural model failure mode is: "user said hi, my response is short — I'll just emit it as text." But that text never reaches the user. The prompt overrides this with an unconditional rule: every reply, even single-word, goes through `SendUserMessage`.

**Two attachment forms exist because of the dual local/remote architecture.** When Claude is running locally with cwd access, it reads files via paths. When it's spawned via Remote Control on a different device, files are uploaded by the user's *device* and arrive as a `{file_uuid, file_name, size, is_image}` reference — Claude has no path-based access to them. Accepting both lets the same tool serve both topologies.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.142:** SendUserFile sibling tool added for file-as-deliverable case.
- **v2.1.121:** SendUserMessage is gated through `KL$()` which combines Kairos/Brief feature gates with userMsgOptIn — flipping the GrowthBook flag off kills the tool mid-session.
- The dual-form attachments union (string | preuploaded object) has been version-stable since the Remote Control integration landed.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Notification / User Channel*

Key functions in this document:
- `SendUserMessageTool` (`rd7`) — declaration with `aliases: [LEGACY_BRIEF_TOOL_NAME]`
- `sendUserMessageInputSchema` (`us_`) — strict message + union attachments + status
- `preuploadedFileSchema` (`xs_`) — `{file_uuid, file_name, size, is_image}` describer
- `isSendUserMessageEnabled` (`KL$`) — Kairos/Brief activation gate
- `LEGACY_BRIEF_TOOL_NAME` (`dY6`) — `"Brief"` literal kept as alias
- `BRIEF_ENFORCE_SENTINEL` (`E$_`) — "You ended the turn without calling SendUserMessage."
- `BRIEF_PROACTIVE_SECTION` (`y$_`) — system-prompt section enforcing the contract
- `resolveAttachments` (`J38`) — path/object → uploaded metadata pipeline
- `validateAttachmentPaths` (`j38`) — preflight stat/permission check
