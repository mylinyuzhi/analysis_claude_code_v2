# Memory Age & Staleness — `memoryAge.ts` (v2.1.112)

## Module Overview

`memoryAge.ts` is the staleness-detection primitive shared by *every consumer of memory in v2.1.112*: the relevance attachment, the FileReadTool memory hint, the system reminder wrapper. It implements three small functions — `memoryAgeDays`, `memoryFreshnessText`, `memoryFreshnessNote` — that turn a millisecond timestamp into a textual caveat the model can act on.

**v2.1.88 source** : `/lyz/codespace/3rd/claude-code/src/memdir/memoryAge.ts` (53 lines).
**v2.1.112 chunk** : `chunks.86.mjs:2680-2697`.

The module exists because models have a *blind spot for absolute dates* but reliably reason about relative phrases: "47 days old" plus an explicit caveat will trigger a verify-before-asserting behaviour, whereas an ISO timestamp embedded in a memory body usually won't. Every staleness warning Claude Code emits goes through this file.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_04.md](../00_overview/symbol_additions_unit_04.md) — symbols added by this unit
> - [symbol_index.md](../00_overview/symbol_index.md) — v2.1.88 → v2.1.112 scoped diff index

Key functions in this document:
- `memoryAgeDays` (`a5z`) — Floor-rounded days since mtime, clamped at 0 (chunks.86.mjs:2682-2684)
- `memoryFreshnessText` (`$Q1`) — Plain-text staleness caveat for memories > 1 day old (chunks.86.mjs:2686-2690)
- `memoryFreshnessNote` (`RZ4`) — `<system-reminder>`-wrapped caveat for FileReadTool (chunks.86.mjs:2692-2697)
- `memoryHeader` (`B97`) — Caller that conditionally prepends the freshness text (chunks.155.mjs:2152-2157, see [attachment_normalization.md](./attachment_normalization.md))
- `FileReadTool memory hint` (`EDY`) — Caller in the file-read flow (chunks.158.mjs:2432-2436)

## Age Calculation

### What it does

`memoryAgeDays` returns an integer count of *whole days* between the file's mtime and now. The function is the only place where the day-boundary is defined in the codebase; everything downstream just consumes the integer.

### How it works

```javascript
// ============================================
// memoryAgeDays - Floor-rounded days since mtime, clamped at 0
// Location: chunks.86.mjs:2682-2684
// ============================================

// ORIGINAL (for source lookup):
function a5z(q) {
    return Math.max(0, Math.floor((Date.now() - q) / 86400000))
}

// READABLE (for understanding):
function memoryAgeDays(mtimeMs) {
    // 86_400_000 ms = 1 day
    return Math.max(0, Math.floor((Date.now() - mtimeMs) / 86_400_000));
}

// Mapping:
// a5z → memoryAgeDays
// q   → mtimeMs
```

### Why this approach

**Why `Math.floor` (not `Math.round` or ceil).** `floor` gives "0 for today, 1 for yesterday, 2+ for older" — the exact rounding rule a human uses. `round` would call a file modified 13 hours ago "1 day old" (sounds wrong); `ceil` would call a file modified 1 hour ago "1 day old" (also wrong).

**Why `Math.max(0, …)` clamping.** Future timestamps can occur on networked filesystems with clock skew, or when a user's machine clock is wrong, or after `touch -d future`. Returning a negative number from a freshness primitive would confuse downstream consumers (e.g. `K <= 1` in `$Q1` would treat very-stale-but-clock-skewed files as fresh). Clamping to 0 makes the worst case "marked as fresh-today" rather than "marked as -3 days old."

**Why a single constant `86_400_000` (not `1000 * 60 * 60 * 24`).** Pure micro-optimization for a hot path. This function is called once per memory file in every recall, and inlining the multiplication avoids three runtime arithmetic ops the JIT would have to constant-fold. The v2.1.88 source uses the literal as well.

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
// Location: chunks.86.mjs:2686-2690
// ============================================

// ORIGINAL (for source lookup):
function $Q1(q) {
    let K = a5z(q);
    if (K <= 1) return "";
    return `This memory is ${K} days old. ` + "Memories are point-in-time observations, not live state — " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
}

// READABLE (for understanding):
function memoryFreshnessText(mtimeMs) {
    const days = memoryAgeDays(mtimeMs);
    if (days <= 1) return "";                           // today / yesterday → no caveat
    return (
        `This memory is ${days} days old. ` +
        `Memories are point-in-time observations, not live state — ` +
        `claims about code behavior or file:line citations may be outdated. ` +
        `Verify against current code before asserting as fact.`
    );
}

// Mapping:
// $Q1 → memoryFreshnessText
// a5z → memoryAgeDays
// q   → mtimeMs
// K   → days
```

### Why this approach

**Why the `≤ 1` threshold (not `=== 0`).** "Yesterday" is functionally as fresh as "today" for almost all memories — a user preference logged yesterday is still that user's preference today, and the staleness reasoning the caveat triggers ("verify before asserting") adds no value. Skipping yesterday avoids that minor noise without compromising the "old code-state citation" use case (which is days-to-weeks).

**Why the explicit "file:line citations may be outdated" wording.** The v2.1.88 source comment names this:
> "Motivated by user reports of stale code-state memories (file:line citations to code that has since changed) being asserted as fact — the citation makes the stale claim sound more authoritative, not less."

A model citing `auth.ts:142` from a 47-day-old memory is *more* convincing-sounding to a user than a memory without a citation, so the caveat must specifically remind the model that those citations are themselves the failure mode. The phrasing is prompt-tuned and tested against this pattern.

**Why an empty string (not `null`/`undefined`) when fresh.** Callers concatenate the result directly: `${freshnessText}\n\nMemory: path:` (see `memoryHeader` in `attachment_normalization.md`). Returning `""` lets the caller use a single template string without a null-check; the `_ ? ... : ...` ternary in `B97` then chooses between the staleness header and the bare `Memory: path:` based on the empty-string check.

### Key insight

The caveat text is **prompt-engineered**, not informational. It does not exist to inform the model of an objective fact; it exists to *trigger a specific behavioural change* (verify before asserting). That's why the wording is hyper-specific ("point-in-time observations, not live state"; "claims about code behavior or file:line citations may be outdated"). Generic warnings like "this memory is old" would not produce the same behavioural delta.

---

## System-Reminder Wrapper

### What it does

`memoryFreshnessNote` (`RZ4`) wraps the plain-text caveat in `<system-reminder>` tags and adds a trailing newline. It exists *only* for callers that don't provide their own `<system-reminder>` wrapper — primarily FileReadTool — so the model sees the caveat with the same semantic weight regardless of which path surfaced the memory.

### How it works

```javascript
// ============================================
// memoryFreshnessNote - <system-reminder>-wrapped caveat for FileReadTool
// Location: chunks.86.mjs:2692-2697
// ============================================

// ORIGINAL (for source lookup):
function RZ4(q) {
    let K = $Q1(q);
    if (!K) return "";
    return `<system-reminder>${K}</system-reminder>
`
}

// READABLE (for understanding):
function memoryFreshnessNote(mtimeMs) {
    const text = memoryFreshnessText(mtimeMs);
    if (!text) return "";                               // pass through "fresh" → empty
    return `<system-reminder>${text}</system-reminder>\n`;
}

// Mapping:
// RZ4 → memoryFreshnessNote
// $Q1 → memoryFreshnessText
// q   → mtimeMs
// K   → text
```

### Where it's used

`memoryFreshnessNote` has exactly one caller in v2.1.112: `EDY` (chunks.158.mjs:2432-2436), the FileReadTool prefix builder that prepends a memory note when the read targeted a memory directory file:

```javascript
// chunks.158.mjs:2432-2436
function EDY(q) {
    let K = lyK.get(q);                                  // lyK: WeakMap<File, mtimeMs>
    if (K === void 0) return "";
    return RZ4(K)                                         // → memoryFreshnessNote
}
```

The downstream invocation at chunks.159.mjs:358 concatenates this prefix into the tool result content:

```javascript
// chunks.159.mjs:358
if (q.file.content) _ = EDY(q) + TDY(q.file) + (NDY() ? VDY : "");
```

That is: the FileReadTool's user-visible result *begins* with the staleness reminder when (and only when) the read targeted a memory file older than 1 day. The relevance attachment path uses the bare `memoryFreshnessText` directly (because it wraps in `<system-reminder>` already), so the wrapped-vs-unwrapped split avoids double-wrapping.

### Why this split exists

The relevance attachment path (`relevant_memories` case in chunks.165.mjs:2549-2561) already wraps its content in `<system-reminder>` via `X_(...)` (the `wrapMessagesInSystemReminder` helper). If `memoryFreshnessText` itself emitted the tags, that path would produce double-nested `<system-reminder><system-reminder>...</system-reminder></system-reminder>` which the prompt structure does not handle.

The FileReadTool path, by contrast, returns a tool result string with no outer wrapper, so it needs the tags to enter the system-reminder regime at all.

### Key insight

The two-function split — bare text vs wrapped — is a deliberate **caller-contract design**. Each caller picks the variant that matches its own wrapping. There is no "smart" version that detects whether wrapping is needed; the split makes the contract explicit at the import site, so a misuse would be visible in a code review.

---

## Notable Removals From v2.1.88

v2.1.88's `memoryAge.ts` exports a fourth function — `memoryAge(mtimeMs): string` — that returns the human-readable `"today" / "yesterday" / "${d} days ago"` string. That function and its callers have been **removed from v2.1.112**.

- v2.1.88 `memoryHeader` rendered:
  ```
  Memory (saved 3 days ago): path/to/memory.md:
  ```
- v2.1.112 `B97` (memoryHeader, chunks.155.mjs:2152-2157) renders only:
  ```
  Memory: path/to/memory.md:
  ```
  or, with staleness:
  ```
  This memory is 47 days old. Memories are point-in-time observations...
  Verify against current code before asserting as fact.

  Memory: path/to/memory.md:
  ```

The reason — visible in the v2.1.88 source comment on `header?:` (attachments.ts:506-512) — is **prompt cache stability**. `"saved 3 days ago"` changes once a day, so a memory attached on Monday rendered "saved 0 days ago" but the same memory re-rendered on Tuesday became "saved 1 days ago" — different bytes, prompt-cache miss. v2.1.112 sidesteps this by removing the relative-time prose entirely: the staleness *warning* is still day-dependent, but it only fires past the > 1 day threshold, so the typical fresh-memory case has perfectly stable bytes. See [attachment_normalization.md](./attachment_normalization.md) for the full cache-stability story.

This is one of the cleanest examples in v2.1.112 of a "remove the user-facing string to fix the cache" decision. The model loses nothing actionable (it can still infer freshness from the mtime in the manifest if needed); the cache hit rate climbs significantly.

---

## Cross-Version Notes (v2.1.88 → v2.1.112)

| Function | v2.1.88 | v2.1.112 | Change |
|---|---|---|---|
| `memoryAgeDays(mtimeMs)` | identical | identical | — |
| `memoryFreshnessText(mtimeMs)` | identical | identical | — |
| `memoryFreshnessNote(mtimeMs)` | identical | identical | — |
| `memoryAge(mtimeMs)` | exported | **removed** | "today" / "yesterday" / "N days ago" prose deleted to stabilize prompt-cache bytes |

The three remaining functions are bit-for-bit equivalent across versions — including the `≤ 1` threshold, the exact caveat wording, and the trailing newline in `memoryFreshnessNote`. The minimal API is part of the design: by holding the contract steady across versions, anchor docs like this can confidently describe behaviour from either side.
