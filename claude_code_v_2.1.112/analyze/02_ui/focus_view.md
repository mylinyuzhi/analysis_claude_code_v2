# Focus View (`Ctrl+O` v2.1.97 → `/focus` v2.1.110) — v2.1.112

## Overview

"Focus view" is a fullscreen-only transcript mode that hides everything except:

- The user's prompt
- A one-line summary per tool call (with edit diffstats — e.g., `+4 -1`)
- The assistant's final text response

It strips out the per-turn intermediate noise (streaming chunks, tool argument JSON, tool result content, between-call status updates) so users can read sessions as a thread of question-and-answer pairs.

Focus view shipped in v2.1.97 toggled via `Ctrl+O` *within NO_FLICKER mode only*. In v2.1.110 the toggle was **split out** to a dedicated `/focus` slash command, and `Ctrl+O` reverted to a verbose-only toggle (see [ctrl_o_toggle.md](./ctrl_o_toggle.md)).

## State Model

Focus view's on/off state lives in *two* places:

| Slot | Lifetime | Used for |
|------|----------|----------|
| `AppState.briefTranscript` | Session-scoped (in-memory) | Drives current frame rendering |
| `Config.briefTranscript` | Persistent (`~/.claude/config.json`) | Carried into next session |

The `/focus` toggle writes both; this means a single invocation persists. A user who wants temporary focus must toggle off before exiting.

A third override exists at startup: `Config.viewMode` (an enum `"default" | "verbose" | "focus"`) lets users pin a startup mode that wins over the persisted `briefTranscript`:

```javascript
// chunks.222.mjs:80-82
let n = v7().viewMode,
    l = n ? n === "focus" : H8().briefTranscript ?? !1,
    z6 = H.verbose ?? (n ? n === "verbose" : l ? !1 : H8().verbose),
```

Reading this: `viewMode` (if set) wins; otherwise fall back to `briefTranscript` (for focus) and `verbose` (for verbose).

## The `/focus` Command

```javascript
// ============================================
// focusCommandDef - /focus slash command definition
// Location: chunks.189.mjs:1450-1475
// ============================================

// ORIGINAL (for source lookup):
wtK = L(() => {
    h1();
    nO();
    FoY = {
        type: "local-jsx",
        name: "focus",
        description: "Toggle focus view (show only your prompt, a tool summary, and the final response)",
        isEnabled: lq,
        immediate: !0,
        load: () => Promise.resolve({
            async call(q, K) {
                let _ = !K.getAppState().briefTranscript;
                if (K.setAppState((z) => z.briefTranscript === _ ? z : {
                        ...z,
                        briefTranscript: _
                    }), H8().briefTranscript !== _) d8((z) => ({
                    ...z,
                    briefTranscript: _
                }));
                return q(_ ? "Focus view enabled" : "Focus view disabled", {
                    display: "system"
                }), null
            }
        })
    }, OtK = FoY
})

// READABLE (for understanding):
const focusCommandDef = {
  type: "local-jsx",
  name: "focus",
  description: "Toggle focus view (show only your prompt, a tool summary, and the final response)",
  isEnabled: isFullscreenMode,  // hidden from menu when not in fullscreen
  immediate: true,               // no confirmation prompt — toggle and go
  load: () => Promise.resolve({
    async call(emitMessage, ctx) {
      const next = !ctx.getAppState().briefTranscript;

      // 1. Update in-session state.
      ctx.setAppState((s) =>
        s.briefTranscript === next ? s : { ...s, briefTranscript: next }
      );

      // 2. Persist to config if it would change.
      if (getAppConfig().briefTranscript !== next) {
        updateAppConfig((c) => ({ ...c, briefTranscript: next }));
      }

      // 3. User feedback (system message visible in transcript).
      emitMessage(next ? "Focus view enabled" : "Focus view disabled", {
        display: "system"
      });
      return null;
    }
  })
};

// Mapping: FoY→focusCommandDef, lq→isFullscreenMode, H8→getAppConfig, d8→updateAppConfig
```

### Why `isEnabled: lq` (i.e. `isFullscreenMode`)

Focus view is *meaningful* only in fullscreen mode for two reasons:

1. **Scrollback ownership** — In fullscreen, the renderer owns the entire scrollback (virtualized). Hiding intermediate content means hiding it from a viewport the renderer fully controls. In default mode, intermediate content has *already been written* to the OS scrollback by the time you'd hide it; scrolling up would still show it.
2. **Atomic repaints** — Toggling between focus and full transcript repaints the entire viewport. Fullscreen does this without flicker; default mode would tear visibly.

So when `isFullscreenMode()` is false, `/focus` is hidden from the slash menu altogether — preventing a confusing "I toggled it but nothing happened" experience.

### Why `immediate: true`

Most slash commands of `type: "local-jsx"` show a confirmation prompt or modal. Focus is a *transient toggle* — modal would be overkill. `immediate: true` skips the confirmation and runs the `call` function directly.

## Rendering — How Focus Filters the Transcript

```javascript
// ============================================
// transcriptCollapseInFocus - collapse non-relevant blocks when briefTranscript is on
// Location: chunks.182.mjs:1505-1508
// ============================================

// ORIGINAL (for source lookup):
p8 = lq() && z6 && !k6 ? rRK(f8, K, (c1) => {
    let dq = A6.getState().tasks[c1];
    return dq?.type === "local_agent" ? dq.result?.toolStats : void 0
}, W) : f8

// READABLE (for understanding):
const collapsedMessages = (isFullscreenMode() && briefTranscriptOn && !isTranscriptViewActive)
  ? collapseForFocusMode(messages, tools, (taskId) => {
      const task = teammateRegistry.getState().tasks[taskId];
      return task?.type === "local_agent" ? task.result?.toolStats : undefined;
    }, teamsSelected)
  : messages;

// Mapping: lq→isFullscreenMode, z6→briefTranscriptOn, k6→isTranscriptViewActive,
//          rRK→collapseForFocusMode, A6→teammateRegistry
```

### Three conditions must hold for focus to apply

1. `isFullscreenMode()` — fullscreen renderer active
2. `briefTranscriptOn` (i.e. `AppState.briefTranscript === true`)
3. `!isTranscriptViewActive` — we're in the chat frame, *not* the verbose transcript view (Ctrl+O); in transcript view, the user explicitly wants to see everything

When all three are true, `collapseForFocusMode()` walks the message list and rewrites tool calls into one-line summaries. The `toolStats` callback is how it gets edit diffstats — it's hauled out of the teammate task store because edit-style tools record `{ linesAdded, linesRemoved }` there.

### What gets collapsed (the one-line summary)

Tools render a *renderToolUseMessage* normally; in focus mode they fall back to `renderInlineSummary` (a different method on the tool definition) which produces strings like:

```
Edit  src/foo.ts  +4 -1
Read  package.json
Bash  npm test
```

Each tool defines its own inline-summary format. The Edit tool includes diffstats; Read shows the path; Bash shows the trimmed command. Streaming output, tool argument JSON, and tool result content are dropped.

## Footer Indicator

When focus is active, the chat footer shows a `focus` chip:

```javascript
// chunks.203.mjs:2227-2230
let n = lq(),
    l = M8((H6) => H6.briefTranscript),
    z6 = n && U < $_A,
    A6 = [!1, n && l && "focus"].filter((H6) => Boolean(H6)),
```

`A6.length > 0` (line 2300) flips the footer text to `"focus"`, joined with `" & "` if other chips are present.

## Why the Split From `Ctrl+O`

In v2.1.97, `Ctrl+O` had two responsibilities:

- Toggle verbose transcript visibility (a *view mode* — show all messages, full content)
- In fullscreen mode, also toggle focus view (a *content filter* — show only prompts + summaries + responses)

These are **orthogonal** concerns. A user might want:

| Want | Verbose | Focus |
|------|---------|-------|
| Just final answers | off | on |
| Just final answers, but with full thinking | on | on |
| Full transcript | off | off |
| Full transcript including hidden retries | on | off |

Conflating them under one keychord meant the keychord couldn't reach `(on, on)` or `(off, off)` independently. v2.1.110 split them so:

- `Ctrl+O` → toggles verbose only
- `/focus` → toggles focus only

The slash command was chosen over a separate keychord because focus is a *mode* (state persists across turns; durable enough for a settings entry), not a momentary action.

## Cross-Validation with v2.1.88

The v2.1.88 source has **no `/focus` command** and no `briefTranscript` field on AppState:

```bash
$ grep -rn "briefTranscript\|FocusView\|focus.view" /lyz/codespace/3rd/claude-code/src/
# (no results)
```

The v2.1.88 source *does* have `Ctrl+O` for toggle-transcript (`/lyz/codespace/3rd/claude-code/src/components/CtrlOToExpand.tsx`) and `useShortcutDisplay('app:toggleTranscript', 'Global', 'ctrl+o')` (line 33). This was the pre-2.1.97 baseline — `Ctrl+O` was verbose-only at v2.1.88, picked up focus-toggling in v2.1.97, and reverted to verbose-only in v2.1.110.

## State Persistence — Where `briefTranscript` Lives in Config

```javascript
// chunks.64.mjs:2118 — list of fields synced to userConfig
["apiKeyHelper", "installMethod", ..., "briefTranscript", ...]
```

`briefTranscript` is a top-level boolean in the user config. Changing it via `/focus` writes the config file directly. Loading a new session reads it back into AppState's initial value (`chunks.117.mjs:2620` shows `briefTranscript: !1` as the default).

`viewMode` (the startup-override enum) is a *separate* field — and stronger. If `viewMode === "focus"` is set, it wins regardless of `briefTranscript`. This is the way to force focus on for every session from `settings.json`.

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions:
- `focusCommandDef` (`FoY`) - `/focus` command definition (chunks.189.mjs:1450-1475)
- `briefTranscript` - AppState field (chunks.117.mjs:2620 default; chunks.64.mjs:2118 in config schema)
- `viewMode` - User-config enum override (chunks.19.mjs:510)
- `collapseForFocusMode` (`rRK`) - Transcript collapse filter (chunks.182.mjs:1505)
- `getAppConfig` (`H8`) - Read user config (utility)
- `updateAppConfig` (`d8`) - Mutate user config (utility)

v2.1.88 cross-reference: no `/focus` command existed; `briefTranscript` field did not exist; `Ctrl+O` was verbose-only.
