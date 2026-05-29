# UI Handling — Why the User Doesn't See Reminders

> How the UI layer detects and suppresses `<system-reminder>` content across the renderer, transcript search, sticky-prompt indicator, message selector, copy/paste path, and `/resume` reload.

## The contract

A `<system-reminder>…</system-reminder>` text block reaches the model unchanged but is **invisible to the user** under all normal viewing surfaces. Three mechanisms cooperate to enforce this:

1. **The `isMeta` flag** on the carrier `UserMessage` excludes it from the transcript render entirely.
2. **Per-surface strip helpers** (`stripLeadingReminders`, `stripAllReminders`) cleanse any text that the user *would* see (sticky prompt, search hit context, clipboard) even if a reminder somehow leaked into a non-meta block.
3. **Per-surface predicates** (`isSyntheticMessage`, `isUserAuthored`, `oq4`, etc.) drop reminder-bearing messages from interactive listings (jump-to-message, message selector, queued-command preview).

## The `isMeta` flag — primary suppression

The `w8` factory (at `cli_inner_pretty.js:423394-423429`) carries `isMeta` as a top-level boolean on every user message. Every attachment-origin reminder is created with `isMeta: true`. The flag is **read at five places** in the UI:

### 1. Transcript render filter (`Messages.tsx:144`)

```typescript
// From /lyz/codespace/3rd/claude-code/src/components/Messages.tsx:139-145
if (msg.type === 'user') {
  if (block?.type === 'tool_result') {
    return block.tool_use_id !== undefined && briefToolUseIDs.has(block.tool_use_id);
  }
  // Real user input only — drop meta/tick messages.
  return !msg.isMeta;
}
```

This is the **canonical** UI suppression. The transcript view simply doesn't render `isMeta: true` messages.

**Why a flag and not a `type` check**: A reminder-carrying user message can otherwise be structurally identical to a real user prompt (same `type: "user"`, same `content: [{type:"text", text:"…"}]`). The flag is the only stable discriminator.

### 2. VirtualMessageList sticky-prompt walk (`VirtualMessageList.tsx:148`)

The sticky-prompt UI shows the user's last real prompt at the top of the screen when scrolled past it. It walks the message list backward, asking "what was the user's last prompt?":

```typescript
// From src/components/VirtualMessageList.tsx:145-160
function computeStickyPromptText(msg) {
  let raw: string | null = null;
  if (msg.type === 'user') {
    if (msg.isMeta || msg.isVisibleInTranscriptOnly) return null;     // ◄── skip
    const block = msg.message.content[0];
    if (block?.type !== 'text') return null;
    raw = block.text;
  } else if (msg.type === 'attachment' && msg.attachment.type === 'queued_command' && ...) {
    raw = ...
  }
  if (raw === null) return null;
  const t = stripSystemReminders(raw);                                 // ◄── peel leading SR
  if (t.startsWith('<') || t === '') return null;
  return t;
}
```

Two-layer defence: the `isMeta` check rejects the message outright; the `stripSystemReminders` call peels any *embedded* leading reminders (e.g., from auto-memory recalls that prepended to the prompt).

**Why both**: The `isMeta` flag is set on the *attachment-origin* message envelope, but the merge pass in `processMessageForAPI` can concatenate a SR-prefixed text block into a non-meta user message (e.g., when a queued user prompt got merged with an attachment-origin reminder). The strip handles that residual case.

### 3. Message selector (`MessageSelector.tsx:777`)

The `Esc`-key message selector lets the user jump back to any prior turn. It rejects meta messages:

```typescript
// From src/components/MessageSelector.tsx:777-782
if (message.isMeta) {
  return false;
}
if (message.isCompactSummary || message.isVisibleInTranscriptOnly) {
  return false;
}
```

**Why not strip + display**: A reminder *body* often contains technical text the user wouldn't recognise as their prior message. Hiding the entire entry is correct UX, not silent stripping.

### 4. ContextVisualization (`ContextVisualization.tsx:18`)

The `/ctx` view shows the context budget split by category. Meta messages contribute to the rolled-up byte count but render as `<collapsed>` placeholders rather than as quoted text:

> "their context was rewritten — the `<collapsed>` placeholders are isMeta"

**Why collapsed-but-counted**: The user needs to see the *cost* of reminders to understand "why am I at 80% of context already?". Hiding them entirely would mislead.

### 5. PromptInputQueuedCommands (`PromptInputQueuedCommands.tsx:86`)

Queued commands (typed while a tool was running) are displayed in a small overlay below the prompt input. Meta queued commands (synthesised by the system) are excluded:

```typescript
// task-notification is shown via useInboxNotification; most isMeta commands
// shouldn't appear in the user-input queue.
```

## Strip helpers — defence in depth

Even with `isMeta` filtering, certain UI paths *do* read reminder text — and need to strip it cleanly. Two strip helpers cover the cases:

### `stripLeadingReminders` (obfuscated `Nq4`)

```javascript
// ============================================
// stripLeadingReminders (Nq4) — peel leading <sr> blocks
// Location: cli_inner_pretty.js:423281-423289
// TS reference: src/components/messageActions.tsx:399-408
// ============================================

// READABLE:
function stripLeadingReminders(text) {
  let s = text.trimStart();
  while (s.startsWith("<system-reminder>")) {
    const end = s.indexOf("</system-reminder>");
    if (end < 0) break;                                  // unterminated — bail
    s = s.slice(end + "</system-reminder>".length).trimStart();
  }
  return s;
}
```

**Used by**:
- `computeStickyPromptText` — strip leading reminders before identifying "what the user typed"
- `copyTextOf` — clipboard copy of a user message strips leading reminders
- `lq4` — preview generator at `cli_inner_pretty.js:467521` (collapsed-read-search content for transcript display)

**Why leading-only**: Real user input never has reminders mid-text; only at the start (e.g., when an auto-memory or mode-reentry attachment got merged with a queued prompt). A regex-replace would be overkill for the common case.

### `stripAllReminders` (obfuscated `vQ4`)

```javascript
// ============================================
// stripAllReminders (vQ4) — regex-strip any <sr>/<task-notification> slice
// Location: cli_inner_pretty.js:566114-566116
// TS reference: src/utils/transcriptSearch.ts:117-127 (inlined as while-loop)
// ============================================

// READABLE:
function stripAllReminders(text) {
  return text.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}
```

**Used by**:
- Transcript search (`/ search`) — both reminders and task-notifications must be invisible to search hits.
- `br` (`cli_inner_pretty.js:566117-566122`) — "build readable" function for activity logs / permission dialogs. Composes `stripAllReminders` → strip all XML tags → collapse whitespace.
- `latestAsk` extractor (`cli_inner_pretty.js:390867-390869`) — `/remote-control` summarises the user's most recent question; reminders would pollute that summary.
- Browser preview rendering (`replBridgeTransport.ts:242`) — `/remote-control` web view doesn't render reminders.

**Why regex-replace (not while-loop)**: The places that call this helper handle messages that may have reminders **embedded mid-text** (especially `cc -c` resumes — the persistence layer interleaves prior memory-update reminders between conversation turns). A regex sweeps all positions in one pass.

### `extractSystemReminderContent` (obfuscated `Wq4` / `nD6`)

```javascript
// ============================================
// extractSystemReminderContent (Wq4) — unwrap a wholly-tagged string
// Location: cli_inner_pretty.js:424719-424722
// TS reference: src/utils/telemetry/betaSessionTracing.ts:149-152
// ============================================

// READABLE:
function extractSystemReminderContent(text) {
  // Returns the inner content if the ENTIRE string is one <sr>...</sr> block,
  // null otherwise. Used by telemetry to split user-content from reminder-content.
  const match = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(text.trim());
  return match ? match[1].trim() : null;
}
```

**Used by**:
- `betaSessionTracing.formatMessagesForContext` — splits the per-turn message stream into `contextParts` (user-visible) and `systemReminders` (separate observability dimension).
- `Zz5` at `cli_inner_pretty.js:424731-424747` — used during compaction summary preparation to detect "this content is *just* a reminder" and exclude it from the summary scope.

**Why a different helper than `stripAllReminders`**: `extractSystemReminderContent` returns the *content* (not "" or " ") so the telemetry layer can attribute it to a `systemReminders` array. The other helpers return text-minus-reminders for display.

## Per-surface predicate filters

Several UI components filter messages through additional predicates beyond `isMeta`:

### `oq4` — keep-in-transcript predicate (`cli_inner_pretty.js:425556-425564`)

```javascript
function oq4(H, $) {
  if (H.type !== "user") return !0;
  if (H.isMeta) {
    if (s9H(H.origin)) return !0;            // channel-origin meta messages stay
    return !1;
  }
  if (H.isVisibleInTranscriptOnly && !$) return !1;
  return !0;
}
```

**Readable**:

```javascript
function shouldKeepInTranscript(msg, includeTranscriptOnly) {
  if (msg.type !== "user") return true;
  if (msg.isMeta) {
    // Exception: channel-origin meta messages (agent-team channel chatter) stay
    if (isChannelOrigin(msg.origin)) return true;
    return false;
  }
  // isVisibleInTranscriptOnly: only shown in ctrl+o transcript mode, not main view
  if (msg.isVisibleInTranscriptOnly && !includeTranscriptOnly) return false;
  return true;
}

// Mapping: oq4→shouldKeepInTranscript, H→msg, $→includeTranscriptOnly, s9H→isChannelOrigin
```

**Why channel-origin gets an exception**: Agent-team chat (`SendMessage` between teammates) is technically meta but the user *does* want to see those messages for situational awareness. The `origin.kind === 'channel'` carve-out keeps them visible.

### Synthetic message classifier

Several views filter "synthetic" messages — messages that exist for technical reasons but aren't user-facing turns:

```javascript
// From cli_inner_pretty.js:277243, 277300 (the syntheticness predicate):
isSynthetic: K.isMeta || K.isVisibleInTranscriptOnly
```

`isVisibleInTranscriptOnly` is a separate flag from `isMeta`: it marks compact-summary messages that should show in `ctrl+o` transcript mode (full debug view) but not in the normal transcript. Compact summaries are SR-wrapped (`isCompactSummary: true, isVisibleInTranscriptOnly: true`).

### Brief-mode filter (`filterForBriefTool` in `Messages.tsx:111-158`)

When the user enabled Brief mode (`/brief`), nothing outside Brief-tool calls renders:

```typescript
if (msg.type === 'user') {
  if (block?.type === 'tool_result') {
    return block.tool_use_id !== undefined && briefToolUseIDs.has(block.tool_use_id);
  }
  return !msg.isMeta;   // ◄── plus only non-meta user input
}
```

The reminder-meta filter still applies inside Brief mode — even more strictly, since Brief mode hides the model's free-text output too.

## Where reminders ARE shown to the user

Despite all the suppression, **two** UI surfaces *do* display reminder content to the user:

### 1. `/ctx` (context visualisation)

The `/ctx` command shows the context-window budget split by category. Reminders contribute to the "system / meta" bucket. The user sees the *count* and *byte size* of reminders but not their text. See `02_ui/` for the context view.

**Why expose count/size**: The user needs to understand "auto-memory loaded 12 KB of reminders this session" when wondering where their context budget went.

### 2. Full transcript mode (`ctrl+o`)

Pressing `ctrl+o` toggles full transcript mode. Reminders DO appear here — verbatim, with their `<system-reminder>` tags visible. Predicate `oq4` with `includeTranscriptOnly = true` keeps the message visible.

**Why exposed in transcript mode**: Transcript mode is the developer/debug view. Hiding harness chrome there would make debugging impossible.

## Pasting and resume edge cases

### Transcript paste

If the user clipboard-pastes a transcript exported from another session, raw `<system-reminder>` text can leak into the new session's input. The pasted content goes through `stripAllReminders` (via the prompt-submit normaliser) before being sent — so the new session won't re-replay old reminders as user input.

### `/resume` reload

`/resume` reloads a persisted transcript from `transcript.jsonl`. The persisted form contains the SR text **inside** the user messages (the persistence layer doesn't strip them). On reload:
- The transcript loader re-runs `normalizeAttachmentForAPI` on the saved attachment records — re-deriving the SR text via the *current* renderers (so changed reminder text picks up).
- For *primitive* user messages whose text starts with `<system-reminder>` (i.e., the reminder was inlined into a tool_result or merged into a prior message), the text is preserved as-is. The UI's `isMeta` filter still hides them.

### `/fork` from an arbitrary message

When the user forks at message N, all subsequent messages are discarded. The fork keeps prior reminders in context — the model effectively sees a freshly-loaded context with all the original reminders intact. The UI re-renders the (now-shorter) transcript with the same `isMeta` filter applied.

## Telemetry side-channel

The telemetry layer doesn't go through the UI — it taps the message stream after `normalizeAttachmentForAPI` and before send:

```typescript
// From src/utils/telemetry/betaSessionTracing.ts:166-208
function formatMessagesForContext(messages) {
  const contextParts = [], systemReminders = [];
  for (const message of messages) {
    const content = message.message.content;
    if (typeof content === 'string') {
      const reminderContent = extractSystemReminderContent(content);
      if (reminderContent) systemReminders.push(reminderContent);
      else contextParts.push(`[USER]\n${content}`);
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'text') {
          const reminderContent = extractSystemReminderContent(block.text);
          if (reminderContent) systemReminders.push(reminderContent);
          else contextParts.push(`[USER]\n${block.text}`);
        }
        // tool_result also checked for embedded reminders…
      }
    }
  }
  return { contextParts, systemReminders };
}
```

Two span attributes result:
- `new_context` — the user's actual content (reminder-stripped)
- `system_reminders` — the joined reminder bodies

This split lets observability dashboards graph "user prompt length over time" without polluting it with reminder bytes that the user didn't type.

See `telemetry_and_cache.md` for the full picture.

## Putting it together — a UX trace

Scenario: a TodoWrite call returns. The next request includes a `todo_reminder` attachment.

1. **Attachment generated**: `Vq5` produces `{type: "todo_reminder", content: […], itemCount: N}`.
2. **Normalised**: `CI6` routes to the `case "todo_reminder"` renderer; emits `o_([w8({content: "The TodoWrite tool hasn't…", isMeta: true})])`.
3. **Wrapped**: `o_` wraps the content in `<system-reminder>…</system-reminder>` tags.
4. **Merged**: The message merges into the existing user-turn message (which was the tool_result for TodoWrite). The result is a user message with `isMeta: true` and content like `[{type:"tool_result", …}, {type:"text", text:"<system-reminder>…</system-reminder>"}]`.
5. **Smooshed**: `mq4` folds the SR-text block into the tool_result's content array. The user message now has just one block (`tool_result`) with the reminder text embedded inside.
6. **Sent to API**: The model sees `<system-reminder>…</system-reminder>` inside the tool_result content.
7. **UI render**: The Ink renderer filters the user message via `!msg.isMeta` — it's NOT rendered.
8. **Sticky prompt**: The breadcrumb walks backwards looking for a real user prompt; this meta message returns `null` from `computeStickyPromptText`.
9. **Search**: `/search` over the transcript skips this message (the `toolResultSearchText` helper strips reminders via `stripAllReminders`).
10. **Copy**: User selects the user's prior actual prompt; `copyTextOf` strips leading reminders so the clipboard gets only the user's real text.
11. **Telemetry**: `extractSystemReminderContent` separates the reminder into the `system_reminders` span attribute; the user-content metrics are not polluted.
12. **Transcript resume** (next session via `/resume`): The persisted message is re-loaded with `isMeta: true` intact; the UI filters apply on reload.
13. **`ctrl+o` debug view**: Pressing `ctrl+o` shows the reminder text verbatim for debugging.

The user, viewing normally, sees only their prompts and the model's responses. The reminder did its job — guiding the model — without ever entering the user's visual field.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `makeUserMessage` (obfuscated: `w8`) - Factory with `isMeta` flag
- `stripLeadingReminders` (obfuscated: `Nq4`) - Peel leading SR blocks
- `stripAllReminders` (obfuscated: `vQ4`) - Regex-strip any SR/task-notification slice
- `extractSystemReminderContent` (obfuscated: `Wq4`, `nD6`) - Unwrap wholly-tagged string
- `shouldKeepInTranscript` (obfuscated: `oq4`) - Per-surface keep-predicate
- `isChannelOrigin` (obfuscated: `s9H`) - Carve-out for agent-team channel chatter
- `computeStickyPromptText` - Sticky-prompt UI walk (TS only)
- `formatMessagesForContext` - Telemetry separator (TS only)
- `filterForBriefTool` - Brief-mode message filter (TS only)
- `br` (`cli_inner_pretty.js:566117`) - "Build readable" preview generator
