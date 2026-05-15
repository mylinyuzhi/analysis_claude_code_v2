# Memory Age & Staleness — `memoryAge.ts` (v2.1.142)

## Module Overview

`memoryAge.ts` is the staleness-detection primitive used by every consumer of memory in v2.1.142: the relevance attachment, the FileReadTool memory hint, the system reminder wrapper. It implements three small functions — `memoryAgeDays`, `memoryFreshnessText`, `memoryFreshnessNote` — that turn a millisecond timestamp into a textual caveat the model can act on.

**v2.1.88 source**: `/lyz/codespace/3rd/claude-code/src/memdir/memoryAge.ts` (53 lines).
**v2.1.142 lines**: `cli_inner_pretty.js:217444-217461`.

The module exists because models have a *blind spot for absolute dates* but reliably reason about relative phrases: "47 days old" plus an explicit caveat will trigger a verify-before-asserting behaviour, whereas an ISO timestamp embedded in a memory body usually won't. Every staleness warning Claude Code emits goes through this file.

**v2.1.112 → v2.1.142 change: none.** The three functions are bit-identical (modulo obfuscated names). The `memoryAge()` function (returning `"today" / "yesterday" / "N days ago"`) that v2.1.88 had — and v2.1.112 dropped for prompt-cache stability — remains absent.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — symbols added by this unit

Key functions in this document:
- `memoryAgeDays` (`e6_`) — Floor-rounded days since mtime, clamped at 0 (cli_inner_pretty.js:217444-217446)
- `memoryFreshnessText` (`A36`) — Plain-text staleness caveat for memories > 1 day old (cli_inner_pretty.js:217447-217455)
- `memoryFreshnessNote` (`iiK`) — `<system-reminder>`-wrapped caveat for FileReadTool (cli_inner_pretty.js:217456-217461)
- `memoryHeader` (`_h6`) — Caller that conditionally prepends the freshness text (cli_inner_pretty.js:398235-398242)
- `FileReadTool memory hint` — Caller in the file-read flow (uses `iiK`)

## Age Calculation

### What it does

`memoryAgeDays` returns an integer count of *whole days* between the file's mtime and now. The function is the only place where the day-boundary is defined in the codebase; everything downstream just consumes the integer.

### How it works

```javascript
// ============================================
// memoryAgeDays - Floor-rounded days since mtime, clamped at 0
// Location: cli_inner_pretty.js:217444-217446
// ============================================

// ORIGINAL (for source lookup):
function e6_(H) {
  return Math.max(0, Math.floor((Date.now() - H) / 86400000));
}

// READABLE (for understanding):
function memoryAgeDays(mtimeMs) {
  // 86_400_000 ms = 1 day
  return Math.max(0, Math.floor((Date.now() - mtimeMs) / 86_400_000))
}

// Mapping: e6_→memoryAgeDays, H→mtimeMs
```

### Why this approach

**Why `Math.floor` (not `Math.round` or ceil).** `floor` gives "0 for today, 1 for yesterday, 2+ for older" — the exact rounding rule a human uses. `round` would call a file modified 13 hours ago "1 day old" (sounds wrong); `ceil` would call a file modified 1 hour ago "1 day old" (also wrong).

**Why `Math.max(0, …)` clamping.** Future timestamps can occur on networked filesystems with clock skew, or when a user's machine clock is wrong, or after `touch -d future`. Returning a negative number from a freshness primitive would confuse downstream consumers (e.g. `K <= 1` in `A36` would treat very-stale-but-clock-skewed files as fresh). Clamping to 0 makes the worst case "marked as fresh-today" rather than "marked as -3 days old."

**Why a single constant `86400000` (not `1000 * 60 * 60 * 24`).** Pure micro-optimization for a hot path. This function is called once per memory file in every recall, and inlining the multiplication avoids three runtime arithmetic ops the JIT would have to constant-fold. The v2.1.88 source uses the literal as well; v2.1.142 keeps it.

### Key insight

This is the *day boundary contract* for the whole memory subsystem. If you wanted to change "today vs yesterday" semantics — say, to use timezone-aware calendar days instead of 24-hour windows — there's exactly one function to modify. The fact that this primitive is shared keeps every memory caveat consistent: a memory shown by FileReadTool as "fresh" cannot be shown as "stale" by an attachment a moment later.

---

## Staleness Caveat Text

### What it does

`memoryFreshnessText` returns a *plain-text* paragraph telling the model that the memory is old and instructing it to verify claims against current code. Returns the empty string for fresh memories (≤ 1 day) — emitting a caveat for today's memory would be noise that the model would learn to ignore.

### How it works

```javascript
// ============================================
// memoryFreshnessText - Plain-text staleness caveat
// Location: cli_inner_pretty.js:217447-217455
// ============================================

// ORIGINAL (for source lookup):
function A36(H) {
  let $ = e6_(H);
  if ($ <= 1) return "";
  return (
    `This memory is ${$} days old. ` +
    "Memories are point-in-time observations, not live state — " +
    "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
  );
}

// READABLE (for understanding):
function memoryFreshnessText(mtimeMs) {
  const days = memoryAgeDays(mtimeMs)
  if (days <= 1) return ''                              // today / yesterday → no caveat
  return (
    `This memory is ${days} days old. ` +
    `Memories are point-in-time observations, not live state — ` +
    `claims about code behavior or file:line citations may be outdated. ` +
    `Verify against current code before asserting as fact.`
  )
}

// Mapping: A36→memoryFreshnessText, H→mtimeMs, $→days, e6_→memoryAgeDays
```

### Why this approach

**Why the `≤ 1` threshold (not `=== 0`).** "Yesterday" is functionally as fresh as "today" for almost all memories — a user preference logged yesterday is still that user's preference today, and the staleness reasoning the caveat triggers ("verify before asserting") adds no value. Skipping yesterday avoids that minor noise without compromising the "old code-state citation" use case (which is days-to-weeks).

**Why the explicit "file:line citations may be outdated" wording.** The v2.1.88 source comment names this:
> "Motivated by user reports of stale code-state memories (file:line citations to code that has since changed) being asserted as fact — the citation makes the stale claim sound more authoritative, not less."

A model citing `auth.ts:142` from a 47-day-old memory is *more* convincing-sounding to a user than a memory without a citation, so the caveat must specifically remind the model that those citations are themselves the failure mode. The phrasing is prompt-tuned and tested against this pattern.

**Why an empty string (not `null`/`undefined`) when fresh.** Callers concatenate the result directly. Returning `""` lets the caller use a single template string without a null-check; the `_ ? ... : ...` ternary in `_h6` then chooses between the staleness header and the bare `Memory: path:` based on the empty-string check.

### Key insight

The caveat text is **prompt-engineered**, not informational. It does not exist to inform the model of an objective fact; it exists to *trigger a specific behavioural change* (verify before asserting). That's why the wording is hyper-specific ("point-in-time observations, not live state"; "claims about code behavior or file:line citations may be outdated"). Generic warnings like "this memory is old" would not produce the same behavioural delta.

---

## System-Reminder Wrapper

### What it does

`memoryFreshnessNote` (`iiK`) wraps the plain-text caveat in `<system-reminder>` tags and adds a trailing newline. It exists *only* for callers that don't provide their own `<system-reminder>` wrapper — primarily FileReadTool — so the model sees the caveat with the same semantic weight regardless of which path surfaced the memory.

### How it works

```javascript
// ============================================
// memoryFreshnessNote - <system-reminder>-wrapped caveat for FileReadTool
// Location: cli_inner_pretty.js:217456-217461
// ============================================

// ORIGINAL (for source lookup):
function iiK(H) {
  let $ = A36(H);
  if (!$) return "";
  return `<system-reminder>${$}</system-reminder>
`;
}

// READABLE (for understanding):
function memoryFreshnessNote(mtimeMs) {
  const text = memoryFreshnessText(mtimeMs)
  if (!text) return ''                                  // pass through "fresh" → empty
  return `<system-reminder>${text}</system-reminder>\n`
}

// Mapping: iiK→memoryFreshnessNote, A36→memoryFreshnessText, H→mtimeMs, $→text
```

### Where it's used

`memoryFreshnessNote` has the same caller in v2.1.142 as in v2.1.112: the FileReadTool prefix builder that prepends a memory note when the read targeted a memory directory file.

The downstream invocation concatenates this prefix into the tool result content. That is: the FileReadTool's user-visible result *begins* with the staleness reminder when (and only when) the read targeted a memory file older than 1 day. The relevance attachment path uses the bare `memoryFreshnessText` directly (because it wraps in `<system-reminder>` already via `o_` / `wrapMessagesInSystemReminder`), so the wrapped-vs-unwrapped split avoids double-wrapping.

### Why this split exists

The relevance attachment path (`relevant_memories` case in the message renderer) already wraps its content in `<system-reminder>` via `o_(...)` (the `wrapMessagesInSystemReminder` helper). If `memoryFreshnessText` itself emitted the tags, that path would produce double-nested `<system-reminder><system-reminder>...</system-reminder></system-reminder>` which the prompt structure does not handle.

The FileReadTool path, by contrast, returns a tool result string with no outer wrapper, so it needs the tags to enter the system-reminder regime at all.

### Key insight

The two-function split — bare text vs wrapped — is a deliberate **caller-contract design**. Each caller picks the variant that matches its own wrapping. There is no "smart" version that detects whether wrapping is needed; the split makes the contract explicit at the import site, so a misuse would be visible in a code review.

---

## Notable Removals From v2.1.88 (still gone in v2.1.142)

v2.1.88's `memoryAge.ts` exports a fourth function — `memoryAge(mtimeMs): string` — that returns the human-readable `"today" / "yesterday" / "${d} days ago"` string. That function and its callers were **removed in v2.1.112** and **stay removed in v2.1.142**.

- v2.1.88 `memoryHeader` rendered:
  ```
  Memory (saved 3 days ago): path/to/memory.md:
  ```
- v2.1.142 `_h6` renders only:
  ```
  Memory: path/to/memory.md:
  ```
  or, with staleness:
  ```
  This memory is 47 days old. Memories are point-in-time observations...
  Verify against current code before asserting as fact.

  Memory: path/to/memory.md:
  ```

The reason — visible in the v2.1.88 source comment — is **prompt cache stability**. `"saved 3 days ago"` changes once a day, so a memory attached on Monday rendered "saved 0 days ago" but the same memory re-rendered on Tuesday became "saved 1 days ago" — different bytes, prompt-cache miss. v2.1.112 sidestepped this by removing the relative-time prose entirely; v2.1.142 has not reintroduced it.

This is one of the cleanest examples in the codebase of a "remove the user-facing string to fix the cache" decision. The model loses nothing actionable (it can still infer freshness from the mtime in the manifest if needed); the cache hit rate climbs significantly.

---

## Cross-Version Notes (v2.1.88 → v2.1.142)

| Function | v2.1.88 | v2.1.112 | v2.1.142 | Change vs v2.1.112 |
|---|---|---|---|---|
| `memoryAgeDays(mtimeMs)` | identical | identical | identical | none |
| `memoryFreshnessText(mtimeMs)` | identical | identical | identical | none |
| `memoryFreshnessNote(mtimeMs)` | identical | identical | identical | none |
| `memoryAge(mtimeMs)` | exported | **removed** | **still removed** | none |

The three remaining functions are bit-for-bit equivalent across all three versions — including the `≤ 1` threshold, the exact caveat wording, and the trailing newline in `memoryFreshnessNote`. The minimal API is part of the design: by holding the contract steady, anchor docs like this can confidently describe behaviour from any side.

The only v2.1.112 → v2.1.142 difference visible at this layer is the **caller rename**: `memoryHeader` was `B97` in v2.1.112, it is `_h6` in v2.1.142 (cli_inner_pretty.js:398235). Body is identical.
