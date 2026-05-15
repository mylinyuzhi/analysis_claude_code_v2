# "Pasting…" Footer Hint (v2.1.132)

## What changed

When the user pastes content (especially clipboard images, which can
take 100-1000ms to transcode from PNG/JPEG into the prompt buffer),
the input box's footer now shows a dim `Pasting…` hint while the
paste is being ingested.

Before this change, the user pressed Cmd+V (or whatever paste chord
their system uses), and saw no feedback until the paste fully landed.
For large clipboard images that's a multi-second silence with no
visible indication anything is happening — leading users to retry the
paste, which double-pastes.

The fix surfaces the in-flight state explicitly. The footer hint is
ordered with other contextual hints (paste-again, vim mode, exit
confirmation, history search) by priority.

## Source: footer messages dispatcher

```javascript
// ============================================
// useFooterMessages - composes the footer hint based on session state
// Location: cli_inner_pretty.js:550843 (priority chain)
// ============================================

function useFooterMessages(state) {
  const {
    exitConfirmation,       // { show, action, key } — Ctrl+C double-press
    historySearchMode,
    historyFailedMatch,
    onOpenTasksDialog,
    isPasting,              // ← v2.1.132 — true while paste is being ingested
    canExpandPaste,
    pasteAttachmentExpanded,
    showVimModeIndicator,
    vimMode,
    /* …other state… */
  } = state;
  initSubAgentNoticeCache();  // Sm4() — initializes a render-scoped cache

  // Priority 1: exit confirmation (Ctrl+C/Ctrl+D pressed once)
  if (exitConfirmation.show) {
    const action = exitConfirmation.action === "clear"
      ? "/clear"
      : isInteractive() ? "detach (session keeps running)" : "exit";
    return React.createElement(Text, { dimColor: true, key: "exit-message" },
      `Press ${exitConfirmation.key} again to ${action}`
    );
  }

  // Priority 2: paste in progress — v2.1.132 addition
  if (isPasting) {
    return React.createElement(Text, { dimColor: true, key: "pasting-message" }, "Pasting…");
  }

  // Priority 3: paste-collapsed hint (paste again to expand)
  if (canExpandPaste && !pasteAttachmentExpanded) {
    return React.createElement(Text, { dimColor: true, key: "expand-paste-hint" }, "paste again to expand");
  }

  // Priority 4: vim mode indicator (lowest priority)
  const showVim = isVimModeEnabled()
    && !exitConfirmation.show
    && vimMode !== "NORMAL"
    && !pasteAttachmentExpanded;

  // …history search bar, …other priorities…
}

// Mapping: Sm4→initSubAgentNoticeCache (or footer-message cache init)
```

The priority order matters because only ONE footer message is shown
at a time. The order is:

1. **Exit confirmation** (highest) — safety-critical.
2. **Pasting…** — transient, prevents double-paste.
3. **Paste-again-to-expand** — informational.
4. **Vim mode indicator** — passive state.

If the user pastes while an exit confirmation is showing (an unusual
edge case), the exit message wins. The pasting message replaces it
once the user dismisses the exit confirmation.

## Source: `isPasting` state

The `isPasting` state is tracked by the input-handling hook
(`useInputHandling`-like, sourced from the bundle's
input-management hierarchy). It's set true at paste-start (when the
clipboard read begins) and cleared when the paste is fully transferred
into the input buffer.

```javascript
// ============================================
// useInputHandling - paste lifecycle tracking (excerpt)
// Location: cli_inner_pretty.js:176874-176883 (consumer)
// ============================================

const {
  handleKeyDown,
  handlePaste,
  isPasting: pasteInProgress,   // ← true between paste-start and paste-complete
} = useInputHandling(/* … */);

const { onIsPastingChange } = otherHandlers;
useEffect(() => {
  onIsPastingChange(pasteInProgress);  // propagates to parent
}, [pasteInProgress, onIsPastingChange]);
```

The propagation through `onIsPastingChange` lets the input-box parent
component lift the state up, so the footer-messages dispatcher can
read it from session state.

## Source: paste lifecycle (high level)

```javascript
// ============================================
// Paste lifecycle - clipboard read → buffer transfer
// Location: cli_inner_pretty.js:176077, :176575, :176874 (inferred from references)
// ============================================

async function handlePaste(rawData) {
  setIsPasting(true);
  try {
    if (isImagePaste(rawData)) {
      // Image paste: transcode PNG → bytes → attachment object.
      // Time-dependent: ~50ms for small images, up to seconds for huge ones.
      const attachment = await transcodeImageClipboard(rawData);
      addAttachment(attachment);
    } else {
      // Text paste: a fast path; we still show "Pasting…" for visual
      // consistency but it'll typically clear in <16ms.
      const text = decodeClipboardText(rawData);
      insertTextAtCursor(text);
    }
  } catch (err) {
    // Image transcoding can fail (invalid format, too large).
    showToast("Image paste failed", err);
  } finally {
    setIsPasting(false);
  }
}
```

`setIsPasting` toggles the state that drives the footer hint. The
`try/finally` ensures `false` is restored even if the paste throws
(invalid image format, file too large, etc.).

## Source: companion paste hints

```javascript
// ============================================
// Companion paste hints
// Location: cli_inner_pretty.js:176077, :550861-550866
// ============================================

// Two adjacent paste-related hints (separate from "Pasting…"):

// 1. After Ctrl+W deletes word — toast hint about Ctrl+Y to undo.
//    (Not in the footer chain — appears as a toast.)
toast({ key: "kill-paste-hint", text: "Ctrl+Y to paste deleted text", priority: "immediate", timeoutMs: 5000 });

// 2. Footer hint when an attachment is collapsed and could be expanded
//    by re-pasting:
if (canExpandPaste && !pasteAttachmentExpanded) {
  return React.createElement(Text, { dimColor: true, key: "expand-paste-hint" }, "paste again to expand");
}
```

These three paste-related signals form a coordinated set:

- **"Pasting…"** during ingest.
- **"paste again to expand"** after ingest, when the attachment is
  collapsed.
- **"Ctrl+Y to paste deleted text"** toast after Ctrl+W kill.

The footer chain handles the first two; the third is a transient toast.

## Why this approach

### Why a footer hint rather than a toast or modal?

**What:** "Pasting…" appears in the input box's footer, not as a
toast notification or modal.

**Why:**

- The footer is the user's natural visual focus during input. They're
  looking right at it.
- Toasts are for *transient* notifications about *separate*
  operations. The paste happens in the input box, so the message
  belongs there.
- A modal would block other interactions — paste is supposed to be
  non-blocking.
- The footer-chain priority system already handles the "show one
  message at a time" arbitration.

### Why dim color rather than emphasized?

**What:** `dimColor: true` — the text is rendered with reduced
contrast.

**Why:**

- The message is informational ("we're working on it"), not actionable
  ("you need to do X"). Dim color signals "passive status."
- Emphasized text in the footer is reserved for actionable
  instructions (history search, paste-again-to-expand, etc.). Dim
  text keeps the visual hierarchy clear.
- Dim also reduces visual jumpiness: when the paste completes (within
  16ms for most cases), the dim text gracefully disappears without a
  jarring flash.

### Why priority just below exit confirmation?

**What:** "Pasting…" beats "paste again to expand" and vim mode, but
loses to exit confirmation.

**Why:**

- Exit confirmation is safety-critical: the user just pressed Ctrl+C
  and is asking for a destructive action. Overriding this with
  "Pasting…" would be confusing.
- "Paste again to expand" is post-paste — it conflicts directly with
  "Pasting…" semantically (we can't be mid-paste and post-paste
  simultaneously). The priority order ensures the post-paste hint
  takes over only after `isPasting` clears.
- Vim mode indicator is passive state; it can wait until the paste
  completes.

### Why `try/finally` rather than always setting false?

**What:** The paste handler uses `try { … } finally { setIsPasting(false); }`.

**Why:**

- Paste can throw (invalid image format, transcoding failure, file
  too large). Without the `finally`, the footer would be stuck on
  "Pasting…" forever.
- The try/finally guarantees state cleanup even on async-thrown
  errors.
- A separate error path that also calls `setIsPasting(false)` would
  be more verbose; the finally is idiomatic.

### Why no progress percentage for large image pastes?

**What:** Just "Pasting…" — no `Pasting 47%…` progress.

**Why:**

- Image transcoding doesn't have intrinsic progress; it's a single
  CPU-bound JPEG-to-RGB transformation. There's no natural
  intermediate state to report.
- The transcode finishes quickly (< 1s for typical images, < 3s for
  huge images). A progress percentage would update so rapidly it'd
  flicker.
- The ellipsis is a stable signal — "this is in flight" — without
  implying a measurable countdown.

## Cross-validation: pre-2.1.132 vs 2.1.132

| Aspect | Pre-2.1.132 | v2.1.132+ |
|--------|-------------|-----------|
| Paste from clipboard | Silent ingest | "Pasting…" footer hint |
| Image paste delay perception | Long pause with no feedback | Visible "Pasting…" while transcode runs |
| Footer priority for paste state | n/a | Just below exit confirmation |
| Post-paste hints | "paste again to expand" (if collapsed) | Same — pasting-message clears first |
| Ctrl+Y kill-paste toast | Existed before, unchanged | Unchanged |
| Error during paste (e.g. invalid image) | Silent | Footer clears + toast |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Input
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `useFooterMessages` (compiled around `Sm4`) — composes the footer hint chain; cli_inner_pretty.js:550843
- `isPasting` state — toggled by paste handler; cli_inner_pretty.js:550854-550859
- "pasting-message" — message key; cli_inner_pretty.js:550857
- "expand-paste-hint" — companion message key; cli_inner_pretty.js:550864
- "kill-paste-hint" — Ctrl+Y reminder toast; cli_inner_pretty.js:176077
- `handlePaste` — paste lifecycle setter; cli_inner_pretty.js:176575
- `onIsPastingChange` — prop propagation; cli_inner_pretty.js:176883
