# SendUserFile — Deliver Files as the Output (NEW in v2.1.142)

> **Tool name:** `SendUserFile`
> **Source:** `cli_inner_pretty.js:385814-385877` (`fH5` declaration)
> **Search hint:** *deliver files (screenshots, reports, artifacts) to the user*
> **Concurrency-safe:** true · **Read-only:** true
> **Status:** New in v2.1.142.

---

## Overview

`SendUserFile` is a v2.1.142 addition for the case where **the file *is* the deliverable** — a generated diagram, a built artifact, a screenshot — and you want it surfaced as a primary output rather than mentioned in the text of a SendUserMessage.

Unlike SendUserMessage (which can attach files but the message text is primary), SendUserFile centers the file(s) with an optional one-line caption.

---

## Schema

```javascript
// ============================================
// sendUserFileInputSchema - zH5 files + caption + status
// Location: cli_inner_pretty.js:385793-385803
// ============================================

// ORIGINAL (for source lookup):
zH5 = yH(() =>
  y.strictObject({
    files: y.array(y.string()).min(1).describe("File paths (absolute or relative to cwd) to send to the user."),
    caption: y.string().optional().describe("Optional short caption for the file(s)."),
    status: y.enum(["normal", "proactive"]).describe("Use 'proactive' when ... build artifact ready, report generated"),
  }),
);

// READABLE (for understanding):
const sendUserFileInputSchema = lazySchema(() =>
  z.strictObject({
    files: z.array(z.string()).min(1).describe("File paths (absolute or relative to cwd)"),
    caption: z.string().optional(),
    status: z.enum(["normal", "proactive"]),
  }),
);

// Mapping: zH5→sendUserFileInputSchema
```

The `min(1)` enforces at least one file — there's no point invoking SendUserFile with zero files.

---

## Key Behavior

### Enablement requires one of three transport conditions

```javascript
isEnabled() {
  if (vq() !== "firstParty" || f4()) return !1;             // Anthropic-first-party only
  if (!Z$("tengu_send_user_file", !0)) return !1;            // GrowthBook flag
  return (
    (bd() || !!process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE || bH(process.env.CLAUDE_CODE_REMOTE)) && !KL$()
    //                                                                                                   ^^^^^^
    //                                                                                                   NOT in Kairos brief mode
  );
}
```

For SendUserFile to surface:
- Provider = first-party Anthropic (not Bedrock/Vertex).
- Feature flag on.
- AT LEAST ONE of: Remote Control connected, `CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE` set, or `CLAUDE_CODE_REMOTE` truthy.
- NOT currently in SendUserMessage's "Brief"/Kairos mode (`KL$()` returns false).

The last clause means SendUserFile is mutually exclusive with SendUserMessage's attachment-passing path: in brief mode you attach files to messages; in non-brief mode you deliver files as their own output.

### Output enumerates the delivered files

```javascript
mapToolResultToToolResultBlockParam(H, $) {
  let q = H.attachments.length,
    K = H.attachments
      .filter((_) => _.file_uuid !== void 0)
      .map((_) => `  ${_.path} → file_uuid: ${_.file_uuid}`);
  return {
    tool_use_id: $,
    type: "tool_result",
    content: `${q} ${plural(q, "file")} delivered to user.${K.length > 0 ? `\n${K.join("\n")}` : ""}`,
  };
}
```

The model sees both the file count and (for files that got `file_uuid`s) a mapping line `local/path → file_uuid:abc123`. The `file_uuid` is the filestore identifier the device receives.

### Telemetry tags proactive vs normal

```javascript
logEvent("tengu_send_user_file", { proactive: status === "proactive", file_count: files.length });
```

Same `proactive` boolean dimension as SendUserMessage — letting analytics compare proactive-delivery rates across both surfaces.

---

## Key Insights

**Why was SendUserFile added as a separate tool instead of overloading SendUserMessage?**
- **Semantic clarity for the model.** "The deliverable is a file" is a different mental model than "here's some text with a file attached." A tool with `files: array.min(1)` requires the model to commit to file-centric delivery.
- **No `message: required`.** SendUserMessage requires a `message` string. SendUserFile only takes a `caption` — meaning the file alone can be the entire output. ("here's the diagram." — caption can be empty.)
- **Different downstream routing.** SendUserMessage's recipient is text-oriented (chat stream). SendUserFile's recipient may be a file viewer or download path. Splitting at the tool surface lets routing be cleaner.

**Why `min(1)` on files?** Without it, a model could accidentally call SendUserFile with `files: []` and the tool would succeed with a misleading "0 files delivered" result. The minimum-1 schema constraint surfaces this as a validation error so the model retries.

**Why is it `!KL$()` (NOT brief mode) in `isEnabled`?** In brief mode, SendUserMessage carries attachments — adding SendUserFile creates ambiguity for the model ("which one do I use?"). By making them mutually exclusive in `isEnabled`, only one surface is available per session.

**The `proactive` status is the high-value path.** The prompt says: *"Use 'proactive' when you're initiating — the user is away and you want this to reach their phone (build artifact ready, report generated)."* — meaning SendUserFile + proactive is the route for "your background build finished, here's the artifact" mobile pushes.

---

## v2.1.112 → v2.1.142 Deltas

- **NEW in v2.1.142.** No prior version had this tool; before, file delivery happened through SendUserMessage's `attachments` field exclusively.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Notification / User Channel*

Key functions in this document:
- `SendUserFileTool` (`fH5`) — new declaration in v2.1.142
- `sendUserFileInputSchema` (`zH5`) — `min(1)` files + caption + status
- `SEND_USER_FILE_TOOL_NAME` (`NH8`) — `"SendUserFile"`
- `resolveAttachments` (`J38`) — shared with SendUserMessage
- `vq` — provider tier (firstParty gate)
- `f4` — non-interactive session detector
- `bd` — Remote Control bridge connected check
- `KL$` — Kairos brief-mode detector (mutually-exclusive gate)
