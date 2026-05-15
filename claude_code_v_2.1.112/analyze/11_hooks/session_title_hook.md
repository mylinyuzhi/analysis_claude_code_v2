# `hookSpecificOutput.sessionTitle` on UserPromptSubmit (v2.1.98)

## Overview

v2.1.98 introduced a new field on the `UserPromptSubmit` hook's response: `hookSpecificOutput.sessionTitle`. A hook that returns a `sessionTitle` string causes the session to be **renamed** — same effect as the user typing `/rename <title>`. This lets plugins programmatically label sessions based on prompt content (e.g., "extract first git command and use as title", "summarize prompt subject", etc.).

**v2.1.88 status:** Not present. The `UserPromptSubmit` schema at `src/types/hooks.ts:79-82` had only `additionalContext`:

```typescript
z.object({
  hookEventName: z.literal('UserPromptSubmit'),
  additionalContext: z.string().optional(),
}),
```

**v2.1.112 schema:** Now has both `additionalContext` AND `sessionTitle`:

```javascript
// chunks.192.mjs:1593-1596
y.object({
    hookEventName: y.literal("UserPromptSubmit"),
    additionalContext: y.string().optional(),
    sessionTitle: y.string().describe("Set the session title (same effect as /rename)").optional()
}),
```

This unit documents the field's wiring from JSON output through to the session-title metadata writer.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md). New mappings: [symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md).

Key functions and constants:

- `userPromptSubmitHook` (`Tz8`) — chunks.192.mjs:3002 (hook dispatcher; now adds `session_title` to envelope and reads `sessionTitle` from response)
- `applyHookSessionTitle` (`Ma8`) — chunks.192.mjs:2992 (the writer that persists the title and re-renders the terminal)
- `applyHookPermissionDecision.UserPromptSubmit` — chunks.193.mjs:78-80 (extracts `sessionTitle` from `hookSpecificOutput`)
- `aggregateHookResults.sessionTitle` — chunks.193.mjs:1277-1279 (yields it to caller)
- `MAX_SESSION_TITLE_CHARS` (`meY`) — chunks.192.mjs:3022, set to `200`
- `getCurrentSessionTitle` (`NH`) — referenced
- `setSessionTitle` (`AN`) — the persisting writer
- `setSessionTitleAndPropagate` (`oP6`) — the post-write hook (terminal title, etc.)

## v2.1.112 Schema Definition

```javascript
// ============================================
// UserPromptSubmitHookOutput - Now has sessionTitle field
// Location: chunks.192.mjs:1593-1596
// ============================================

// ORIGINAL (for source lookup):
y.object({
    hookEventName: y.literal("UserPromptSubmit"),
    additionalContext: y.string().optional(),
    sessionTitle: y.string().describe("Set the session title (same effect as /rename)").optional()
})

// READABLE (for understanding):
z.object({
  hookEventName: z.literal("UserPromptSubmit"),
  additionalContext: z.string().optional(),
  sessionTitle: z.string()
    .describe("Set the session title (same effect as /rename)")
    .optional(),
})

// Mapping: y→z (zod alias). Compare to v2.1.88 src/types/hooks.ts:79-82 which has NO sessionTitle field.
```

## The Hook Dispatcher Now Includes `session_title`

The hook input envelope (what gets passed TO the hook) now carries the current session title. This lets the hook decide whether to rename or keep the existing title:

```javascript
// ============================================
// userPromptSubmitHook - Now ships session_title as part of hook input
// Location: chunks.192.mjs:3002-3020
// ============================================

// ORIGINAL (for source lookup):
async function* Tz8(q, K, _, z) {
    let Y = _.getAppState(),
        A = _.agentId ?? I8();
    if (!pn("UserPromptSubmit", Y, A)) return;
    let O = {
        ...J9(K),
        hook_event_name: "UserPromptSubmit",
        prompt: q,
        session_title: NH(I8())                                  // ← NEW (current title)
    };
    yield* E0({
        hookInput: O,
        toolUseID: ueY(),
        signal: _.abortController.signal,
        timeoutMs: u_,
        toolUseContext: _,
        requestPrompt: z
    })
}

// READABLE (for understanding):
async function* userPromptSubmitHook(prompt, permissionMode, toolUseContext, requestPrompt) {
  const appState = toolUseContext.getAppState();
  const sessionId = toolUseContext.agentId ?? getSessionId();
  if (!hasHookForEvent("UserPromptSubmit", appState, sessionId)) return;
  const hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "UserPromptSubmit",
    prompt,
    session_title: getCurrentSessionTitle(getSessionId()),         // NEW — current title in envelope
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID(),
    signal: toolUseContext.abortController.signal,
    timeoutMs: HOOK_DEFAULT_TIMEOUT,
    toolUseContext,
    requestPrompt,
  });
}

// Mapping: Tz8→userPromptSubmitHook, q→prompt, K→permissionMode, _→toolUseContext, z→requestPrompt,
//          NH→getCurrentSessionTitle, I8→getSessionId, J9→createBaseHookInput, E0→executeHooks,
//          ueY→randomUUID, u_→HOOK_DEFAULT_TIMEOUT, pn→hasHookForEvent
```

Compared to v2.1.88's version (`src/utils/hooks.ts:3841-3854`):

```typescript
// v2.1.88 ORIGINAL — no session_title in envelope
const hookInput: UserPromptSubmitHookInput = {
  ...createBaseHookInput(permissionMode),
  hook_event_name: 'UserPromptSubmit',
  prompt,
}
```

## Reading `sessionTitle` from Hook Output

```javascript
// ============================================
// applyHookPermissionDecision.UserPromptSubmit - Extract sessionTitle from response
// Location: chunks.193.mjs:78-80
// ============================================

// ORIGINAL (for source lookup):
case "UserPromptSubmit":
    H.additionalContext = q.hookSpecificOutput.additionalContext,
    H.sessionTitle = q.hookSpecificOutput.sessionTitle;
    break;

// READABLE (for understanding):
case "UserPromptSubmit":
  result.additionalContext = hookOutput.hookSpecificOutput.additionalContext;
  result.sessionTitle = hookOutput.hookSpecificOutput.sessionTitle;    // NEW
  break;

// Mapping: H→result, q→hookOutput
```

The parser pulls both `additionalContext` (unchanged) AND `sessionTitle` (new) from the hook's `hookSpecificOutput`. Note that this is the **only** code path that reads `sessionTitle` from a hook output — it's tightly scoped to `UserPromptSubmit`.

## Yielding `sessionTitle` to the Aggregator

```javascript
// ============================================
// aggregateHookResults.sessionTitle - Re-yield to caller; log char count
// Location: chunks.193.mjs:1277-1279
// ============================================

// ORIGINAL (for source lookup):
if (S.sessionTitle) E(`Hook ${J} (${DL(S.hook)}) provided sessionTitle (${[...S.sessionTitle].length} chars)`),
    yield { sessionTitle: S.sessionTitle };

// READABLE (for understanding):
if (hookResult.sessionTitle) {
  logForDebugging(
    `Hook ${hookEvent} (${getHookDisplayText(hookResult.hook)}) provided sessionTitle ` +
    `(${[...hookResult.sessionTitle].length} chars)`,
  );
  yield { sessionTitle: hookResult.sessionTitle };
}

// Mapping: S→hookResult, J→hookEvent, E→logForDebugging, DL→getHookDisplayText
```

Note `[...str].length` counts Unicode codepoints (not UTF-16 code units), so multi-byte characters are counted correctly in the debug log.

## Applying the Title — `applyHookSessionTitle` (`Ma8`)

The aggregated `sessionTitle` is consumed by `applyHookSessionTitle`, which sanitizes, deduplicates, and persists:

```javascript
// ============================================
// applyHookSessionTitle - Sanitize + persist hook-provided session title
// Location: chunks.192.mjs:2992-3000
// ============================================

// ORIGINAL (for source lookup):
async function Ma8(q) {
    if (Lz()) return;
    let K = d65(q);
    if (!K) return;
    let _ = I8(),
        z = NH(_);
    if (K === (z && d65(z))) return;
    E(`Hook sessionTitle applied (${[...K].length} chars)`),
        await AN(_, K, void 0, "hook"),
        await oP6(_, K, void 0, "hook")
}

// READABLE (for understanding):
async function applyHookSessionTitle(rawTitle) {
  if (isInReadOnlySessionMode()) return;                  // guard: don't rename ephemeral sessions
  const sanitizedTitle = sanitizeSessionTitle(rawTitle);  // strip control chars + truncate to 200
  if (!sanitizedTitle) return;                             // empty after sanitization → skip
  const sessionId = getSessionId();
  const currentTitle = getCurrentSessionTitle(sessionId);
  if (sanitizedTitle === (currentTitle && sanitizeSessionTitle(currentTitle))) {
    return;                                                // dedupe: no-op if same as current
  }
  logForDebugging(`Hook sessionTitle applied (${[...sanitizedTitle].length} chars)`);
  await setSessionTitle(sessionId, sanitizedTitle, undefined, "hook");
  await setSessionTitleAndPropagate(sessionId, sanitizedTitle, undefined, "hook");
}

// Mapping: Ma8→applyHookSessionTitle, q→rawTitle, K→sanitizedTitle,
//          Lz→isInReadOnlySessionMode, d65→sanitizeSessionTitle,
//          I8→getSessionId, NH→getCurrentSessionTitle, _→sessionId, z→currentTitle,
//          AN→setSessionTitle, oP6→setSessionTitleAndPropagate, E→logForDebugging
```

### The Sanitization Function (`d65`)

```javascript
// ============================================
// sanitizeSessionTitle - Strip C0/C1 controls and truncate to MAX_SESSION_TITLE_CHARS
// Location: chunks.192.mjs:2988-2990
// ============================================

// ORIGINAL (for source lookup):
function d65(q) {
    return [...q.replace(/[\x00-\x1f\x7f-\x9f]/g, "")].slice(0, meY).join("")
}

// READABLE (for understanding):
function sanitizeSessionTitle(rawTitle) {
  // Strip C0 control chars (\x00-\x1f) and C1 control chars (\x7f-\x9f)
  // Then split into codepoints and truncate to MAX_SESSION_TITLE_CHARS (200)
  return [...rawTitle.replace(/[\x00-\x1f\x7f-\x9f]/g, "")]
    .slice(0, MAX_SESSION_TITLE_CHARS)
    .join("");
}

// Mapping: d65→sanitizeSessionTitle, q→rawTitle, meY→MAX_SESSION_TITLE_CHARS (=200)
```

The `[...str]` codepoint split + slice approach guarantees the truncation respects multi-byte characters. A naive `.slice(0, 200)` on UTF-16 code units would risk cutting a surrogate pair in half.

## Deep Analysis

### Algorithm: Hook-Provided Title Application

**What it does:** Lets a `UserPromptSubmit` hook return a string that becomes the session title (the label shown in the terminal title bar, `/resume` picker, and session log filenames).

**How it works:**

1. **Hook input includes current title.** The hook's input envelope carries `session_title: <current value>`. This lets the hook decide whether to rename — e.g., a hook might only set a title if the current one is the default "untitled session".
2. **Hook returns `hookSpecificOutput.sessionTitle: "<new title>"`.** The output is parsed (`KJ7`), yielded by the aggregator (`hu8` loop), and aggregated into the per-event result.
3. **Sanitization.** The raw string is stripped of control characters and truncated to 200 codepoints. An empty or all-control-character string is rejected (no rename).
4. **Deduplication.** If the sanitized title equals the current title (also sanitized for fair comparison), the writer is skipped — no-op.
5. **Persistence.** Two writers are called: `setSessionTitle` writes to session metadata; `setSessionTitleAndPropagate` updates the terminal title and any subscribers (UI, telemetry). Both are awaited sequentially.
6. **Source tag = `"hook"`.** The fourth argument to both writers is the literal `"hook"`, which lets telemetry distinguish hook-set titles from user-set (`/rename`) titles from auto-generated titles.

**Why this approach:**

- **Why expose `session_title` in the input?** Without it, a hook would have to call some other API to check the current title before deciding to rename. Including it in the envelope keeps hooks stateless and synchronous — a single round-trip can read+write the title.
- **Why sanitize before persisting?** Session titles appear in shell prompts and filenames. Control characters (especially `\x1b` for ANSI escapes) would corrupt terminal output if injected unsanitized. The strict allowlist (printable + non-control chars only) is a defensive choice.
- **Why dedupe?** Without dedupe, every prompt submission with a deterministic hook would trigger a metadata write, multiplying disk I/O. The early return is cheap (sanitize-string comparison) and avoids the writer if the hook is just re-confirming the existing title.
- **Why two writers (`AN` and `oP6`)?** `setSessionTitle` updates the canonical metadata file. `setSessionTitleAndPropagate` updates the terminal title and triggers a re-render of the title bar. Splitting these lets the canonical write succeed even if the terminal update fails (e.g., when running in a non-TTY environment).

**Key insight:** The hook can be **deterministic** because it has the current title in input. A common pattern: "if current title looks auto-generated, replace it with a smarter one based on the prompt; otherwise leave it alone." This idempotency-by-default keeps the user's manual `/rename` from being clobbered every turn.

### Decision: Why a Separate Field Instead of Reusing `additionalContext`?

**Alternative considered:** Smuggle the title into `additionalContext` with a special prefix.

**Why rejected (inferable):** `additionalContext` is delivered to the model as a system reminder. Smuggling control data through it would risk the model interpreting the prefix as instruction. Separate fields with separate semantics is the safer design — `additionalContext` is for the model, `sessionTitle` is for the host.

**Why not embed in `decision` or `permissionDecision`?** Those fields are for control flow (approve/block). Conflating control flow with metadata updates would force the parser to switch on decision semantics to find metadata updates — adding coupling between unrelated concerns.

### Trade-off: 200-Character Truncation

**Why 200?** The constant `meY = 200` (`MAX_SESSION_TITLE_CHARS`) sets the cap. This is chosen to:

- Fit in a typical terminal title bar (~80–120 chars visible).
- Not exceed common filesystem limits when used in session-log filenames.
- Allow room for ANSI rendering margins.

The truncation is **silent** (no error, no warning) — long titles are quietly cut. This is a UX trade-off: most hook authors will produce concise titles anyway, and a hard error would be annoying for the rare overage. The fact that the truncation is silent is something hook authors should be aware of (e.g., if testing with a 500-char title, the persisted title is only 200 chars).

## Edge Cases & Gotchas

1. **Read-only session mode skips the writer entirely.** The early return `if (isInReadOnlySessionMode()) return;` means hooks can't rename ephemeral sessions (e.g., `--continue` or `--resume` may flag the session as read-only). The hook still receives `sessionTitle` in its response stream, but the writer no-ops.
2. **The hook envelope's `session_title` may be `undefined`** (for brand-new sessions before any title has been set). Hook scripts should treat it as optional.
3. **Sanitization-only-control-chars input returns empty.** E.g., `\x1b[31mred\x1b[0m` becomes `red`. A string of nothing but escapes (`\x1b\x1b`) becomes empty and is rejected.
4. **No `sessionTitle` from non-UserPromptSubmit events.** The schema enforces that `sessionTitle` only appears in `UserPromptSubmit` hookSpecificOutput; other events would fail schema validation. (The parser at chunks.193.mjs:55 throws if hookEventName mismatches.)
5. **The current title comparison in `Ma8` uses `sanitizeSessionTitle(currentTitle)` too.** If the current title contains control characters (set externally somehow), the comparison still works correctly because both sides go through the same sanitizer.
6. **`source` tag `"hook"` is part of the writer's audit trail.** Telemetry events for title changes can distinguish hook-origin from user-origin (`/rename` uses a different source tag).

## Cross-Reference

- The `/rename` slash command shares the writer (`AN` / `setSessionTitle`) but tags `source = "rename"`. Both paths go through the same sanitization rules.
- The `generateSessionTitle` flow (auto-titling, used when LLM proposes a title based on conversation) tags `source = "auto"`. The "hook" tag is sandwiched between manual `/rename` and auto-generation, sourcing-priority-wise.
