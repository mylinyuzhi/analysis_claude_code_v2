# Brief — Legacy Name; Alias for SendUserMessage in v2.1.142

> **Tool name:** `Brief` (legacy)
> **Source:** 2.1.88 TS at `/lyz/codespace/3rd/claude-code/src/tools/BriefTool/BriefTool.ts`
> **Status in v2.1.142:** Brief is **not a separate tool**; it's registered as an alias on `SendUserMessage`.

---

## Overview

In 2.1.88, `BriefTool` was the original user-facing-message tool — the name "Brief" referenced both the "briefing the user" semantic and the experimental Kairos brief-mode infrastructure. In v2.1.142 the tool was renamed to `SendUserMessage`, but the **legacy name `Brief` is preserved as an alias** so code that references it still resolves correctly.

See [send_user_message.md](./send_user_message.md) for the full implementation deep-dive — this document covers the rename/alias story.

---

## The Alias

```javascript
// ============================================
// SendUserMessage with Brief alias
// Location: cli_inner_pretty.js:378457-378458 (in rd7 declaration)
// ============================================

// ORIGINAL (for source lookup):
(rd7 = XK({
  name: P7H,         // P7H = "SendUserMessage"
  aliases: [dY6],    // dY6 = "Brief"
  searchHint: "send a message to the user — your primary visible output channel",
  // ...
}));

// READABLE (for understanding):
const SendUserMessageTool = buildTool({
  name: SEND_USER_MESSAGE_TOOL_NAME,         // "SendUserMessage"
  aliases: [LEGACY_BRIEF_TOOL_NAME],         // "Brief" — preserved for legacy callers
  searchHint: "send a message to the user — your primary visible output channel",
  // ...
});

// Mapping: rd7→SendUserMessageTool, P7H→SEND_USER_MESSAGE_TOOL_NAME, dY6→LEGACY_BRIEF_TOOL_NAME
```

The `aliases` array on the tool definition tells the tool registry: "if the model emits `Brief` as a tool name, route the call to *this* tool". The registry's name-lookup falls back through the aliases list when the primary name doesn't match.

---

## Why Renamed?

**"Brief" was ambiguous.** A "brief" could mean:
- The action of briefing the user (the original intent).
- A short summary (a meaning the model might infer at inference time).
- The Kairos "Brief" feature flag set.

**"SendUserMessage" is precise.** The verb-object form leaves no doubt: the tool sends a message to the user. No semantic overload, no ambiguity about whether "Brief" means "a briefing tool" vs. "the Brief feature gate".

**The system-prompt sections that used "Brief"** (`y$_ = "BRIEF_PROACTIVE_SECTION"`, `E$_ = "BRIEF_ENFORCE_SENTINEL"`) retain the "Brief" prefix in constant names because:
- They predate the rename.
- Renaming constants would affect telemetry event names and break dashboards.
- The constant names are internal-only; the model never sees them.

---

## v2.1.142 Telemetry Compatibility

The call handler still fires `"tengu_brief_send"`:

```javascript
async call({ message, attachments, status }, K) {
  // ...
  d("tengu_brief_send", { proactive: status === "proactive", attachment_count: $?.length ?? 0 });
  // ...
}
```

This event name is **kept verbatim** so dashboards and analytics queries that filter by `tengu_brief_send` continue working without migration. The event payload is also unchanged.

---

## How the Alias is Used

A model output like:
```json
{"name": "Brief", "input": {"message": "...", "status": "normal"}}
```

is resolved by the registry to the `SendUserMessageTool` declaration via the aliases list. The tool's `call`, `validateInput`, etc. all run with the alias-named tool_use intact in the transcript — so reading older sessions back shows `Brief` calls in their original form.

---

## Key Insights

**Aliases are the right migration tool, not soft-renames.**
- A "soft rename" (rename the const and hope no one notices) breaks any consumer that hard-coded the old name.
- A duplicate tool registration (keep `BriefTool` AND `SendUserMessageTool`) would clutter the tool list and require duplicate code paths.
- An alias preserves a single implementation, single config, and routes legacy callers transparently.

**Telemetry event names are independently versioned.** Even with the tool rename, the event `tengu_brief_send` is the canonical name and won't change. The lesson: choose telemetry event names for stability, not for matching the current tool name — names migrate, events should not.

**The constants `BRIEF_TOOL_PROMPT`, `BRIEF_ENFORCE_SENTINEL`, `BRIEF_PROACTIVE_SECTION`** are internal naming and don't appear in model-visible strings. Their names use the old "BRIEF_" prefix purely for code-organization reasons.

---

## v2.1.112 → v2.1.142 Deltas

- **The alias was added at the rename point.** Older versions (pre-rename) had `BriefTool` as the registered tool; newer versions have `SendUserMessageTool` with `aliases: ["Brief"]`. The exact rename version isn't in the 2.1.112-2.1.142 changelog window, suggesting the rename predates 2.1.112.
- **v2.1.118-onward:** `KL$()` (the Kairos brief activation gate) controls visibility but doesn't affect the alias resolution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Notification / User Channel*

Key references in this document:
- See [send_user_message.md](./send_user_message.md) for the full implementation
- `SendUserMessageTool` (`rd7`) — actual tool definition with `aliases: [dY6]`
- `SEND_USER_MESSAGE_TOOL_NAME` (`P7H`) — `"SendUserMessage"` (primary)
- `LEGACY_BRIEF_TOOL_NAME` (`dY6`) — `"Brief"` (alias)
- 2.1.88 TS source: `src/tools/BriefTool/BriefTool.ts`
