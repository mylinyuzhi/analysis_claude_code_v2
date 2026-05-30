# Read PARTIAL-View Truncation (2.1.145) + Always-On Streaming Tool Exec (2.1.156)

## Related Symbols

> Symbol mappings live in the central index, not here:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model caps, API provider)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:

**Part 1 — Read PARTIAL-view truncation**
- `readFileBody` (`gJ4`) — the per-type Read body dispatcher; contains the token-cap truncation block (cli_inner_pretty.js:422327-422519)
- `PARTIAL_VIEW_PREFIX` (`$j$`) — `"[Truncated: PARTIAL view — "` system-reminder prefix constant (cli_inner_pretty.js:145392)
- `ensureUnderTokenCap` (`FJ4`) — throws `TokenCapExceeded` when projected tokens exceed `maxTokens` (cli_inner_pretty.js:422314-422320)
- `TokenCapExceeded` (`w8H`) — error carrying `tokenCount` and `cap` (cli_inner_pretty.js:422319, 422443)
- `READ_TOOL_NAME` (`HK`) — `"Read"` tool-name constant interpolated into the next-page hint (cli_inner_pretty.js:145385)
- `isReReadStub` (`w68`) — detects a re-read stub string by prefix `O95`/`mFK` (cli_inner_pretty.js:145353-145355)
- `FILE_UNCHANGED_LONG` (`O95`) — legacy/transcript phrasing of the "unchanged" stub (cli_inner_pretty.js:145389-145390)
- `FILE_UNCHANGED_SHORT` (`mFK`) — current model-facing phrasing of the "unchanged" stub (cli_inner_pretty.js:145391)
- `getFileUnchangedStub` (`BFK`) — returns `mFK` for the `file_unchanged` tool_result (cli_inner_pretty.js:145350-145352)
- `rebuildReadFileStateFromTranscript` (`anonymous`) — reconstructs `readFileState` from history, propagating `isPartialView` (cli_inner_pretty.js:410883-410911)
- `FileWriteTool.validateInput` re-read guard (`anonymous`) — rejects writes when state is missing or `isPartialView` (cli_inner_pretty.js:348094-348100)
- `FileEditTool.validateInput` re-read guard (`anonymous`) — same guard for edits (cli_inner_pretty.js:434434-434442)
- `readDedupGate` (`anonymous`) — dedup path that skips partial views (cli_inner_pretty.js:422852-422864)

**Part 2 — Always-on streaming tool execution**
- `buildToolSchema` (`w08`) — serializes one tool into the API schema; computes `eager_input_streaming` (cli_inner_pretty.js:555969-556009)
- `getModelCaps` (`jLz`) — maps a model id to its capability record, including `eagerInputStreaming` (cli_inner_pretty.js:555942-555944)
- `MODEL_CAPS` (`j3`) — model-id → caps record table; entries carry `eagerInputStreaming` (cli_inner_pretty.js:91835-91849)
- `opus48Caps` (`Xi$`) — Opus 4.8 caps record, `eagerInputStreaming: { bedrock: true, vertex: true }` (cli_inner_pretty.js:91825-91834)
- `opus47Caps` (`Ji$`) — Opus 4.7 caps, also `{ bedrock: true, vertex: true }` (cli_inner_pretty.js:91815-91824)
- `getAPIProvider` (`Zq`) — resolves `firstParty | bedrock | vertex | foundry | anthropicAws | mantle` (cli_inner_pretty.js:91853-91865)
- `isFirstPartyAnthropicBaseUrl` (`Rz`) — true only when `ANTHROPIC_BASE_URL` is unset or `api.anthropic.com` (cli_inner_pretty.js:91897-91906)
- `isLeanSystemPrompt` (`X3`) — lean/simple-prompt predicate; supplies the `"L:"` cache-key tag (cli_inner_pretty.js:143872-143877)
- `modelSupportsStructuredOutputs` (`OVH`) — gates `strict` tools (cli_inner_pretty.js:130417-130423)
- `parseBoolTrue` (`xH`) / `parseBoolFalse` (`k4`) — env-var truthy/falsy parsers (cli_inner_pretty.js:1795-1806)
- `getToolSchemaCache` (`qyK`) — session-stable tool-schema cache (cli_inner_pretty.js:130649)
- `FGTS_ENV` (`CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING`) — kill/force switch for eager streaming (cli_inner_pretty.js:555990)

---

## TL;DR

Two independent tool-subsystem deltas landed in the 2.1.143–156 window:

1. **Read PARTIAL-view truncation (2.1.145).** When a single Read would blow the
   model-facing token cap, `readFileBody` (`gJ4`) no longer hard-fails. It runs a
   binary-search-style shrink (line-based first, then character-based for files
   with pathologically long lines), prepends a `"[Truncated: PARTIAL view — …]"`
   system-reminder telling the model exactly how to page the rest, and crucially
   marks the cached `readFileState` entry with `isPartialView: true`. That flag is
   load-bearing: Edit/Write refuse to operate on a partial view, the read-dedup
   path refuses to short-circuit it, and `@`-mention attachment reuse skips it —
   so a truncated read can never masquerade as "you've already seen the whole
   file." Two distinct "unchanged since last read" phrasings (`O95` long-form,
   `mFK` short-form) are both recognized by the stub-detector `w68` so historical
   transcripts and fresh stubs reconstruct state identically.

2. **Always-on streaming tool execution (2.1.156).** `buildToolSchema` (`w08`)
   sets the wire field `eager_input_streaming: true` not only for direct
   `api.anthropic.com` (as in 2.1.88) but now also for **Bedrock and Vertex** —
   gated per-model by the new `eagerInputStreaming: { bedrock, vertex }` capability
   record on each model entry. Opus 4.7 and Opus 4.8 opt in on both platforms.
   In 2.1.88 this field was strictly firstParty-only because older Claude 4.5 on
   Bedrock/Vertex rejected it with HTTP 400; the per-model caps make it safe to
   turn on wherever the deployed model is known to accept it.

Cross-validation against 2.1.88 (`src/utils/api.ts`, `src/tools/FileReadTool/FileReadTool.ts`,
`src/utils/fileStateCache.ts`): **high confidence**. `isPartialView` already
existed in 2.1.88 but was only set on CLAUDE.md/memory/attachment paths
(`contentDiffersFromDisk`); setting it from **normal Read token-cap truncation**
is the 2.1.145 addition. The per-model `eagerInputStreaming` caps are **NEW** —
no precursor field exists anywhere in the 2.1.88 tree.

---

# Part 1 — Read PARTIAL-View Truncation (2.1.145)

## Background: the token cap and how it used to fail

Read's body dispatcher `readFileBody` (`gJ4`) reads `lineCount` lines starting at
`offset`, then calls `ensureUnderTokenCap` (`FJ4`) to verify the result will fit
the model-facing budget (cli_inner_pretty.js:422434, 422441). `ensureUnderTokenCap`
estimates token count and, if the projected count exceeds `maxTokens`, throws a
`TokenCapExceeded` (`w8H`) carrying both the estimate and the cap:

```javascript
// ============================================
// ensureUnderTokenCap - Throws TokenCapExceeded when a read won't fit the token budget
// Location: cli_inner_pretty.js:422314-422320
// ============================================

// ORIGINAL (for source lookup):
async function FJ4(H, $, q) {
  let K = q ?? Z5H().maxTokens,
    _ = Z57(H, $);
  if (!_ || _ <= K / 4) return;
  let A = (await nJ4(H)) ?? _;
  if (A > K) throw new w8H(A, K);
}

// READABLE (for understanding):
async function ensureUnderTokenCap(content, ext, maxTokensOverride) {
  let maxTokens = maxTokensOverride ?? getDefaultFileReadingLimits().maxTokens;
  let cheapEstimate = estimateTokensFast(content, ext);
  // Fast path: if the cheap estimate is under a quarter of the cap, skip the
  // expensive precise tokenizer entirely.
  if (!cheapEstimate || cheapEstimate <= maxTokens / 4) return;
  let preciseCount = (await tokenizePrecise(content)) ?? cheapEstimate;
  if (preciseCount > maxTokens) throw new TokenCapExceeded(preciseCount, maxTokens);
}

// Mapping: FJ4→ensureUnderTokenCap, H→content, $→ext, q→maxTokensOverride,
//          K→maxTokens, _→cheapEstimate, A→preciseCount, Z57→estimateTokensFast,
//          nJ4→tokenizePrecise, w8H→TokenCapExceeded, Z5H→getDefaultFileReadingLimits
```

In earlier builds, an oversized read just surfaced this error to the model. The
2.1.145 delta wraps the call in a `try/catch` that, **only for a whole-file read**,
converts the failure into a truncated-but-useful page plus an explicit paging hint.

## The truncation algorithm

The catch block is the heart of the feature (cli_inner_pretty.js:422440-422483):

```javascript
// ============================================
// readPartialViewTruncation - Converts a token-cap failure into a paginated partial view
// Location: cli_inner_pretty.js:422438-422483
// ============================================

// ORIGINAL (for source lookup):
let S = (_ ?? 1) <= 1 && z === void 0 && A === void 0;
try {
  await FJ4(J, K, f);
} catch (B) {
  if (B instanceof w8H && S) {
    let R = J.split(`\n`),
      x = Math.max(0.5, J.length / Math.max(1, B.tokenCount)),
      U = (r) => r.length / x,
      Q = Math.max(1, Math.min(R.length, Math.floor(((R.length * f) / Math.max(1, B.tokenCount)) * 0.85))),
      g = R.slice(0, Q).join(`\n`);
    for (let r = 0; r < 6; r++) {
      if (U(g) <= f || Q <= 1) break;
      ((Q = Math.max(1, Math.floor(Q * 0.7))), (g = R.slice(0, Q).join(`\n`)));
    }
    let l = !1;
    if (U(g) > f || g.trim() === "") {
      let r = Math.max(1, Math.floor(f * x * 0.85));
      for (let o = 0; o < 6; o++) {
        if (((g = J.slice(0, r)), U(g) <= f)) break;
        r = Math.max(1, Math.floor(r * 0.7));
      }
      let a = g.charCodeAt(g.length - 1);
      if (a >= 55296 && a <= 56319) g = g.slice(0, -1);
      l = !0;
    }
    ((G = g),
      (V = l ? a1(g, `\n`) + 1 : Q),
      (v = V),
      (E = !l && V < L
          ? $j$ + `showing lines 1-${V} of ${L} total (${B.tokenCount} tokens, cap ${f}). Call ${HK} with offset=${V + 1} limit=${V} for the next page, or ${s1} to find a specific section. Do NOT answer from this page alone if the answer may be further in the file.]`
          : $j$ + `showing the first ${g.length} of ${J.length} characters (${B.tokenCount} tokens, cap ${f}); this file has very long lines and cannot be paginated by line. Use ${s1} to find a specific section, or ${HK} with offset/limit to page through it. Do NOT answer from this excerpt alone if the answer may be elsewhere in the file.]`));
  } else throw B;
}

// READABLE (for understanding):
let isWholeFileRead = (offset ?? 1) <= 1 && limit === undefined && pages === undefined;
try {
  await ensureUnderTokenCap(content, ext, maxTokens);
} catch (err) {
  // Only salvage whole-file reads. An explicit offset/limit means the caller
  // already chose a window; failing loudly there is correct.
  if (err instanceof TokenCapExceeded && isWholeFileRead) {
    let lines = content.split("\n");
    // charsPerToken: derive the file's own bytes-per-token ratio (floor 0.5)
    // so the estimator below is calibrated to THIS file, not a global average.
    let charsPerToken = Math.max(0.5, content.length / Math.max(1, err.tokenCount));
    let estTokens = (s) => s.length / charsPerToken;

    // Initial guess: lines * (cap / fullTokenCount) * 0.85 safety margin.
    let keepLines = Math.max(1, Math.min(lines.length,
      Math.floor(((lines.length * maxTokens) / Math.max(1, err.tokenCount)) * 0.85)));
    let excerpt = lines.slice(0, keepLines).join("\n");

    // Geometric shrink (×0.7), capped at 6 iterations, until it fits.
    for (let i = 0; i < 6; i++) {
      if (estTokens(excerpt) <= maxTokens || keepLines <= 1) break;
      keepLines = Math.max(1, Math.floor(keepLines * 0.7));
      excerpt = lines.slice(0, keepLines).join("\n");
    }

    // Fallback for "one giant line" files: line-based paging can't help, so
    // truncate by characters instead.
    let isCharTruncated = false;
    if (estTokens(excerpt) > maxTokens || excerpt.trim() === "") {
      let keepChars = Math.max(1, Math.floor(maxTokens * charsPerToken * 0.85));
      for (let i = 0; i < 6; i++) {
        excerpt = content.slice(0, keepChars);
        if (estTokens(excerpt) <= maxTokens) break;
        keepChars = Math.max(1, Math.floor(keepChars * 0.7));
      }
      // Don't slice through a UTF-16 surrogate pair.
      let lastCode = excerpt.charCodeAt(excerpt.length - 1);
      if (lastCode >= 0xd800 && lastCode <= 0xdbff) excerpt = excerpt.slice(0, -1);
      isCharTruncated = true;
    }

    truncatedContent = excerpt;
    numLines = isCharTruncated ? countOccurrences(excerpt, "\n") + 1 : keepLines;
    effectiveLimit = numLines;
    partialViewReminder =
      !isCharTruncated && numLines < totalLines
        ? PARTIAL_VIEW_PREFIX + `showing lines 1-${numLines} of ${totalLines} total (${err.tokenCount} tokens, cap ${maxTokens}). Call ${READ_TOOL_NAME} with offset=${numLines + 1} limit=${numLines} for the next page, or ${GREP_TOOL_NAME} to find a specific section. Do NOT answer from this page alone if the answer may be further in the file.]`
        : PARTIAL_VIEW_PREFIX + `showing the first ${excerpt.length} of ${content.length} characters (${err.tokenCount} tokens, cap ${maxTokens}); this file has very long lines and cannot be paginated by line. Use ${GREP_TOOL_NAME} to find a specific section, or ${READ_TOOL_NAME} with offset/limit to page through it. Do NOT answer from this excerpt alone if the answer may be elsewhere in the file.]`;
  } else throw err;
}

// Mapping: S→isWholeFileRead, J→content, _→offset, z→limit, A→pages, f→maxTokens,
//          R→lines, x→charsPerToken, U→estTokens, Q→keepLines, g/G→excerpt/truncatedContent,
//          l→isCharTruncated, V→numLines, v→effectiveLimit, E→partialViewReminder,
//          L→totalLines, B→err, B.tokenCount→err.tokenCount, a1→countOccurrences,
//          $j$→PARTIAL_VIEW_PREFIX, HK→READ_TOOL_NAME, s1→GREP_TOOL_NAME
```

### Decision: PARTIAL-view truncation

**What it does:** Salvages an oversized whole-file Read by returning a fitted
prefix of the file plus a precise paging instruction, instead of erroring out.

**How it works:**
1. **Eligibility gate** — `isWholeFileRead` requires `offset <= 1`, no `limit`, no
   `pages` (cli_inner_pretty.js:422439). If the model already asked for a specific
   window, a token-cap failure is a genuine "your window is too big" error and is
   re-thrown unchanged. Only the implicit "just read the file" call gets rescued.
2. **Per-file calibration** — `charsPerToken` is derived from this file's actual
   `content.length / err.tokenCount` (floored at 0.5). The cheap estimator
   `estTokens(s) = s.length / charsPerToken` is therefore tuned to the file at
   hand (minified JS vs. prose tokenize very differently), avoiding repeated calls
   to the expensive precise tokenizer inside the loop (cli_inner_pretty.js:422446-422447).
3. **Line-based shrink** — initial guess scales line count by `cap/fullCount` with
   a 0.85 margin, then geometrically shrinks by ×0.7 for at most 6 iterations
   (cli_inner_pretty.js:422448-422456). Bounded iterations guarantee termination
   and bounded latency; 6 ×0.7 steps reduce the window to ≈12% of the guess, which
   comfortably covers estimation error.
4. **Character-based fallback** — if line truncation still doesn't fit, or the
   excerpt is all-whitespace (the "one 5 MB line" case), it switches to truncating
   by characters with the same ×0.7 / 6-iteration scheme, and trims a trailing
   UTF-16 high surrogate so the excerpt is never cut mid-codepoint
   (cli_inner_pretty.js:422458-422467).
5. **Two reminder phrasings** — line-truncated reads get a *paginate-by-line* hint
   with the exact `offset`/`limit` for the next page; char-truncated reads get a
   *cannot-paginate-by-line, use Grep* hint. Both begin with the
   `PARTIAL_VIEW_PREFIX` (`$j$`) = `"[Truncated: PARTIAL view — "`
   (cli_inner_pretty.js:145392, 422479-422482).

**Why this approach:**
- **Graceful degradation over hard failure.** A model that asked to read a file
  and got an error has to reason about retrying with a window it can't size
  correctly. Returning a usable prefix + the literal next-page command lets it
  continue without a guessing round-trip.
- **Self-calibrating estimator** avoids both under-filling (wasting context budget)
  and re-tripping the cap (wasting a whole tool round-trip). The 0.85 margin is the
  same safety constant used in the initial guess and the char fallback — one knob.
- **Bounded loops** (6 iterations, geometric ×0.7) trade a little optimality for a
  hard ceiling on cost; the truncation runs in the hot tool path, so it must be O(1)
  in iterations regardless of file size.

**Key insight:** The reminder is delivered as a `<system-reminder>` wrapper around
the content (see "Where the reminder goes" below), and it embeds *executable*
instructions (`offset=N+1 limit=N`). The model isn't merely told "this is
truncated" — it's handed the exact tool call to read page two. The companion flag
`isPartialView` is what stops the model (and the harness) from treating the prefix
as the whole file.

## Where the truncated content and reminder are stored

After the catch block, `readFileBody` writes the salvaged excerpt into
`readFileState`, conditionally tagging it as a partial view, and records the
truncation in the output payload (cli_inner_pretty.js:422485-422518):

```javascript
// ============================================
// persistPartialReadState - Caches the read result and marks partial views
// Location: cli_inner_pretty.js:422485-422501
// ============================================

// ORIGINAL (for source lookup):
O.set($, { content: G, timestamp: Math.floor(W), offset: _, limit: v, ...(E !== void 0 && { isPartialView: !0 }) });
// ...
let I = {
  type: "text",
  file: {
    filePath: H, content: G, numLines: V,
    startLine: E !== void 0 ? Math.max(1, _) : _,
    totalLines: L,
    ...(E !== void 0 && { truncatedByTokenCap: !0 }),
  },
};
if (JRH($)) cJ4.set(I, W);
if (E !== void 0) lJ4.set(I, E);

// READABLE (for understanding):
readFileState.set(stateKey, {
  content: truncatedContent, timestamp: Math.floor(mtimeMs),
  offset, limit: effectiveLimit,
  ...(partialViewReminder !== undefined && { isPartialView: true }),
});
// ...
let output = {
  type: "text",
  file: {
    filePath, content: truncatedContent, numLines,
    startLine: partialViewReminder !== undefined ? Math.max(1, offset) : offset,
    totalLines,
    ...(partialViewReminder !== undefined && { truncatedByTokenCap: true }),
  },
};
if (isSessionTranscript(stateKey)) mtimeByOutput.set(output, mtimeMs);
if (partialViewReminder !== undefined) reminderByOutput.set(output, partialViewReminder);

// Mapping: O→readFileState, $→stateKey, G→truncatedContent, W→mtimeMs, _→offset,
//          v→effectiveLimit, E→partialViewReminder, I→output, V→numLines, L→totalLines,
//          cJ4→mtimeByOutput, lJ4→reminderByOutput, JRH→isSessionTranscript
```

The reminder string is later spliced in front of the file content as a
`<system-reminder>…</system-reminder>` block when the tool_result is materialized
(cli_inner_pretty.js:422922-422939 — the `"text"` case pulls the stored reminder
from `lJ4`/`reminderByOutput` and wraps it). That is why
`rebuildReadFileStateFromTranscript` later detects a partial view by checking
whether the tool_result content `startsWith("<system-reminder>" + $j$)`
(cli_inner_pretty.js:410889).

## Why `isPartialView` is load-bearing: the four consumers

Setting the flag would be pointless if nothing read it. Four call sites enforce
the "a partial view is not a real read" invariant:

1. **Edit guard** — `FileEditTool.validateInput` (cli_inner_pretty.js:434434-434442):

```javascript
// ============================================
// editPartialViewGuard - Edit refuses to operate on an unread-or-partial file
// Location: cli_inner_pretty.js:434434-434442
// ============================================

// ORIGINAL (for source lookup):
let w = $.readFileState.get(A);
if (!w || w.isPartialView)
  return { result: !1, behavior: "ask", message: "File has not been read yet. Read it first before writing to it.", meta: { isFilePathAbsolute: String(iLH.isAbsolute(q)) }, errorCode: 6 };

// READABLE (for understanding):
let state = ctx.readFileState.get(absPath);
if (!state || state.isPartialView)
  return { result: false, behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it.",
    meta: { isFilePathAbsolute: String(path.isAbsolute(filePath)) }, errorCode: 6 };

// Mapping: w→state, $→ctx, A→absPath, q→filePath, iLH→path
```

2. **Write guard** — `FileWriteTool.validateInput` uses the identical
   `!O || O.isPartialView` test (cli_inner_pretty.js:348094-348100). A truncated
   view never reflects full file content, so blindly overwriting could destroy the
   unseen tail; the guard forces a real Read first.

3. **Read dedup gate** — the dedup short-circuit only fires when
   `!L.isPartialView` (cli_inner_pretty.js:422852-422853). Without this, a repeated
   whole-file Read of a too-big file would dedup against the partial entry and
   return `file_unchanged`, permanently hiding the rest of the file from the model.

4. **`@`-mention attachment reuse** — the "already_read_file" fast path requires
   `!f.isPartialView` before reusing cached content for an at-mention
   (cli_inner_pretty.js:413652). Same reasoning: a partial attachment must not be
   served as the complete file.

A fifth consumer, the manifest-dependency scanner, treats a partial entry as a
cache miss and re-reads from disk
(`!j.isPartialView ? j.content : void 0`, cli_inner_pretty.js:482644), and the
memory/CLAUDE.md attachment path sets `isPartialView: $8.contentDiffersFromDisk`
(cli_inner_pretty.js:413069, 629992) — the original 2.1.88 producer of the flag.

### Decision: reuse the existing `isPartialView` channel

**Why this approach:** 2.1.88 already had `isPartialView` plumbed through
`readFileState`, Edit/Write guards, and dedup — but the only thing that ever *set*
it was the CLAUDE.md/memory loader (`contentDiffersFromDisk`). The 2.1.145 feature
adds a **new producer** (Read token-cap truncation) onto an **existing consumer
mesh**. No new field, no new guards — the truncation simply becomes "yet another
way a cached entry is incomplete," and all four existing guards immediately do the
right thing. This is the lowest-risk way to ship a feature with cross-tool safety
implications. **Confidence: high** — the consumer code is byte-for-byte the 2.1.88
logic (xref `src/tools/FileWriteTool/FileWriteTool.ts:199`,
`src/tools/FileReadTool/FileReadTool.ts:549`).

## The two "unchanged since last read" phrasings

The cited "two phrasings" are the two forms of the file-unchanged stub, both
recognized by `isReReadStub` (`w68`):

```javascript
// ============================================
// isReReadStub - Detects an "unchanged since last read" stub by either phrasing
// Location: cli_inner_pretty.js:145353-145355
// ============================================

// ORIGINAL (for source lookup):
function w68(H) {
  return H.startsWith(O95) || H.startsWith(mFK);
}

// READABLE (for understanding):
function isReReadStub(content) {
  return content.startsWith(FILE_UNCHANGED_LONG) || content.startsWith(FILE_UNCHANGED_SHORT);
}

// Mapping: w68→isReReadStub, H→content, O95→FILE_UNCHANGED_LONG, mFK→FILE_UNCHANGED_SHORT
```

The two constants (cli_inner_pretty.js:145389-145391):
- `FILE_UNCHANGED_LONG` (`O95`) = `"File unchanged since last read. The content from the earlier Read tool_result in this conversation is still current — refer to that instead of re-reading."` — the verbose phrasing that may appear in older transcripts.
- `FILE_UNCHANGED_SHORT` (`mFK`) = `"Wasted call — file unchanged since your last Read. Refer to that earlier tool_result instead."` — the current phrasing actually emitted, returned by `getFileUnchangedStub` (`BFK`) for the `file_unchanged` tool_result case (cli_inner_pretty.js:145350-145352, 422920-422921).

**Why two?** When `rebuildReadFileStateFromTranscript` walks history to rebuild
`readFileState`, it must *not* treat a stub as real file content
(`!w68(f.content)` guard at cli_inner_pretty.js:410888). Because the emitted
phrasing changed over versions, the detector accepts **both** the legacy long form
and the current short form. The same `w68` test is used when scrubbing dedup stubs
out of replayed history (cli_inner_pretty.js:423770). Recognizing both phrasings
makes state reconstruction phrasing-independent — a transcript written by an older
client still reconstructs cleanly under 2.1.156.

Note these stubs are distinct from the **partial-view** system-reminder: a
partial view starts with `"<system-reminder>" + $j$`, which `w68` does **not**
match, so a truncated read is correctly preserved as content (with its
`isPartialView` flag re-applied) rather than dropped as a stub
(cli_inner_pretty.js:410889, 410904).

## ASCII flow — Read whole-file with token-cap overrun

```
Read(file_path)  (no offset/limit/pages → isWholeFileRead = true)
        │
        ▼
  read all lines ── ensureUnderTokenCap(content) ──► fits? ──► return full content
        │                                                          (isPartialView NOT set)
        │ throws TokenCapExceeded
        ▼
  isWholeFileRead?  ── no ──► re-throw (model picked a bad window)
        │ yes
        ▼
  charsPerToken = len / tokenCount        (calibrate estimator to THIS file)
  keepLines = lines * cap/count * 0.85
        │
        ▼
  shrink ×0.7 up to 6× until estTokens(excerpt) ≤ cap
        │
        ├── fits by lines ──► reminder = "[Truncated: PARTIAL view — showing lines 1-N of T …
        │                                  offset=N+1 limit=N …]"
        │
        └── still too big / blank (giant single line)
                │
                ▼
            truncate by chars ×0.7 up to 6×, trim trailing surrogate
            reminder = "[Truncated: PARTIAL view — showing first C of total chars …
                        cannot paginate by line, use Grep …]"
        │
        ▼
  readFileState.set({ content: excerpt, isPartialView: true })   ◄── load-bearing flag
  output.file.truncatedByTokenCap = true
  tool_result = "<system-reminder>" + reminder + "</system-reminder>\n\n" + excerpt
        │
        ▼
  Edit/Write/dedup/@-mention all see isPartialView ⇒ refuse to treat as full read
```

---

# Part 2 — Always-On Streaming Tool Execution (2.1.156)

## What `eager_input_streaming` is

`eager_input_streaming` is a per-tool wire field on the Anthropic Messages API. With
it set, the server emits `input_json_delta` events for a tool's input *as the model
generates them*, instead of buffering the entire (possibly huge) tool input and
sending it in one shot. Without it, large tool inputs — a big `Write` body, a long
`Edit` patch, a `StructuredOutput` payload — cause multi-minute client-side hangs
where nothing renders until the whole argument blob lands. This is the mechanism
behind "streaming tool execution."

In 2.1.88 the field was gated **firstParty-only**, with an explicit code comment
(`src/utils/api.ts:194-200`) that Bedrock/Vertex with Claude 4.5 *reject* the field
with HTTP 400. The 2.1.156 delta extends it to Bedrock and Vertex, gated per-model.

## The gate in `buildToolSchema` (`w08`)

```javascript
// ============================================
// buildToolSchema - Serializes a tool to API schema and computes eager_input_streaming
// Location: cli_inner_pretty.js:555969-556009
// ============================================

// ORIGINAL (for source lookup):
async function w08(H, $) {
  let q = Zq(),
    K = $.model ? jLz($.model) : void 0,
    _ = X3($.model) ? "L:" : "",
    z = (q === "vertex" && K?.eagerInputStreaming?.vertex) || (q === "bedrock" && K?.eagerInputStreaming?.bedrock) ? "F:" : "",
    A = "",
    Y = _ + z + "" + ("inputJSONSchema" in H && H.inputJSONSchema ? `${H.name}:${PLz(H.inputJSONSchema)}` : H.name),
    f = qyK(),
    O = f.get(Y);
  if (!O) {
    let j = V$("tengu_tool_pear", !1),
      D = "inputJSONSchema" in H && H.inputJSONSchema ? H.inputJSONSchema : dLH(H.inputSchema);
    if (!R7()) D = JLz(H.name, D);
    if (((O = { name: H.name, description: await XLz(H, $), input_schema: D }),
        j && H.strict === !0 && $.model && OVH($.model)))
      O.strict = !0;
    let J = process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING;
    if (
      !k4(J) &&
      ((q === "firstParty" && Rz() && V$("tengu_fgts", !1)) ||
        (q === "vertex" && !process.env.ANTHROPIC_VERTEX_BASE_URL && K?.eagerInputStreaming?.vertex) ||
        (q === "bedrock" && !process.env.ANTHROPIC_BEDROCK_BASE_URL && K?.eagerInputStreaming?.bedrock) ||
        xH(J))
    )
      O.eager_input_streaming = !0;
    f.set(Y, O);
  }
  let M = {
    name: O.name, description: O.description, input_schema: O.input_schema,
    ...(O.strict && { strict: !0 }),
    ...(O.eager_input_streaming && { eager_input_streaming: !0 }),
  };
  if ($.deferLoading) M.defer_loading = !0;
  if ($.cacheControl) M.cache_control = $.cacheControl;
  // ...
}

// READABLE (for understanding):
async function buildToolSchema(tool, options) {
  let provider = getAPIProvider();                                  // firstParty | bedrock | vertex | ...
  let modelCaps = options.model ? getModelCaps(options.model) : undefined;
  let leanTag = isLeanSystemPrompt(options.model) ? "L:" : "";       // lean-prompt cache split
  let streamTag =
    (provider === "vertex"  && modelCaps?.eagerInputStreaming?.vertex) ||
    (provider === "bedrock" && modelCaps?.eagerInputStreaming?.bedrock)
      ? "F:" : "";                                                    // eager-streaming cache split
  let cacheKey = leanTag + streamTag + (
    ("inputJSONSchema" in tool && tool.inputJSONSchema)
      ? `${tool.name}:${stableStringify(tool.inputJSONSchema)}`
      : tool.name);
  let cache = getToolSchemaCache();
  let base = cache.get(cacheKey);
  if (!base) {
    let strictEnabled = getFeatureGate("tengu_tool_pear", false);
    let inputSchema = ("inputJSONSchema" in tool && tool.inputJSONSchema)
      ? tool.inputJSONSchema : zodToJsonSchema(tool.inputSchema);
    if (!agentTeamsEnabled()) inputSchema = stripDisallowedProps(tool.name, inputSchema);
    base = { name: tool.name, description: await renderToolPrompt(tool, options), input_schema: inputSchema };
    if (strictEnabled && tool.strict === true && options.model && modelSupportsStructuredOutputs(options.model))
      base.strict = true;

    let fgtsEnv = process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING;
    if (
      !parseBoolFalse(fgtsEnv) &&                                    // not explicitly disabled
      ((provider === "firstParty" && isFirstPartyAnthropicBaseUrl() && getFeatureGate("tengu_fgts", false)) ||
       (provider === "vertex"  && !process.env.ANTHROPIC_VERTEX_BASE_URL  && modelCaps?.eagerInputStreaming?.vertex) ||
       (provider === "bedrock" && !process.env.ANTHROPIC_BEDROCK_BASE_URL && modelCaps?.eagerInputStreaming?.bedrock) ||
       parseBoolTrue(fgtsEnv))                                       // explicitly forced
    )
      base.eager_input_streaming = true;
    cache.set(cacheKey, base);
  }
  let schema = {
    name: base.name, description: base.description, input_schema: base.input_schema,
    ...(base.strict && { strict: true }),
    ...(base.eager_input_streaming && { eager_input_streaming: true }),
  };
  if (options.deferLoading) schema.defer_loading = true;
  if (options.cacheControl) schema.cache_control = options.cacheControl;
  // ...
}

// Mapping: w08→buildToolSchema, H→tool, $→options, q→provider, Zq→getAPIProvider,
//          K→modelCaps, jLz→getModelCaps, _→leanTag, X3→isLeanSystemPrompt, z→streamTag,
//          Y→cacheKey, PLz→stableStringify, f→cache, qyK→getToolSchemaCache, O→base,
//          j→strictEnabled, V$→getFeatureGate, D→inputSchema, dLH→zodToJsonSchema,
//          R7→agentTeamsEnabled, JLz→stripDisallowedProps, XLz→renderToolPrompt,
//          OVH→modelSupportsStructuredOutputs, J→fgtsEnv, k4→parseBoolFalse, xH→parseBoolTrue,
//          Rz→isFirstPartyAnthropicBaseUrl, M→schema
```

### Algorithm: the four-way eager-streaming gate

**What it does:** Decides whether to attach `eager_input_streaming: true` to a
tool's serialized schema, per API provider and per model.

**How it works (evaluated left to right, short-circuit OR):**
1. **Hard kill check** — `!parseBoolFalse(fgtsEnv)` (cli_inner_pretty.js:555992).
   If `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING` is explicitly falsy
   (`0/false/no/off`), the whole expression is `false` and streaming is off no
   matter what — a universal off-switch.
2. **firstParty branch** — `provider === "firstParty"` AND
   `isFirstPartyAnthropicBaseUrl()` (only `api.anthropic.com` or no base URL) AND
   the `tengu_fgts` feature gate is on (cli_inner_pretty.js:555993). This is the
   *exact* 2.1.88 condition, preserved verbatim.
3. **vertex branch (NEW)** — `provider === "vertex"` AND no
   `ANTHROPIC_VERTEX_BASE_URL` override (i.e. not pointed at a proxy) AND the
   resolved model's `eagerInputStreaming.vertex` cap is true (cli_inner_pretty.js:555994).
4. **bedrock branch (NEW)** — symmetric: `provider === "bedrock"` AND no
   `ANTHROPIC_BEDROCK_BASE_URL` override AND `eagerInputStreaming.bedrock`
   (cli_inner_pretty.js:555995).
5. **Hard force check** — `parseBoolTrue(fgtsEnv)` (cli_inner_pretty.js:555996).
   If the env var is explicitly truthy, force-enable on any provider — escape hatch
   for users on platforms whose model caps don't yet list streaming.

**Why this approach:**
- **Per-model caps, not per-provider blanket.** The 2.1.88 firstParty-only gate was
  a coarse safety hammer: the field 400s on *some* Bedrock/Vertex models, so it was
  banned on *all* of them. The 2.1.156 design instead asks "does *this specific
  model* on *this platform* accept the field?" via `eagerInputStreaming`. That lets
  newer models (Opus 4.7/4.8) stream on Bedrock/Vertex while older ones stay off,
  without per-platform branching scattered through the code.
- **Proxy guard.** Both new branches require the platform base-URL override to be
  *unset*. LiteLLM-style proxies in front of Bedrock/Vertex also reject the field,
  and the client can't know the proxy's capabilities, so streaming is suppressed
  whenever a custom base URL is present. This mirrors `isFirstPartyAnthropicBaseUrl()`
  on the firstParty branch.
- **Two override env checks bracketing the logic** give operators both a global
  off-switch (`!parseBoolFalse`) and a global on-switch (`parseBoolTrue`), so the
  feature can be debugged or force-fixed in the field without a release.

**Key insight:** The cache key gains two prefixes — `"L:"` (lean prompt) and `"F:"`
(eager streaming active for this platform/model). Because the serialized tool array
is cached per session and is also a *prompt-cache boundary*, the key MUST encode
every input that changes the bytes. If `eager_input_streaming` flips on for Bedrock
Opus 4.8 but the cache key didn't include `"F:"`, the cached schema (from a
firstParty session) would be reused with the wrong field, silently breaking
streaming or causing a 400. Adding `streamTag` to the key is the safety mechanism
that makes per-model streaming cache-correct. (The `"L:"` tag is the parallel
lean-system-prompt split — same rationale, different feature.)

## The per-model capability records

The new capability lives on each model's id-map record in `MODEL_CAPS` (`j3`)
(cli_inner_pretty.js:91835-91849). `getModelCaps` (`jLz`) resolves a model id to its
record via a memoized firstParty-id → record map (cli_inner_pretty.js:555942-555944).
The Opus 4.7 and Opus 4.8 records both opt in for Bedrock and Vertex:

```javascript
// ============================================
// opus47Caps / opus48Caps - Model id maps carrying the eagerInputStreaming caps
// Location: cli_inner_pretty.js:91815-91834
// ============================================

// ORIGINAL (for source lookup):
(Ji$ = {
  firstParty: "claude-opus-4-7", bedrock: "us.anthropic.claude-opus-4-7", vertex: "claude-opus-4-7",
  foundry: "claude-opus-4-7", anthropicAws: "claude-opus-4-7", mantle: "anthropic.claude-opus-4-7", gateway: "claude-opus-4-7",
  eagerInputStreaming: { bedrock: !0, vertex: !0 },
}),
(Xi$ = {
  firstParty: "claude-opus-4-8", bedrock: "us.anthropic.claude-opus-4-8", vertex: "claude-opus-4-8",
  foundry: "claude-opus-4-8", anthropicAws: "claude-opus-4-8", mantle: "anthropic.claude-opus-4-8", gateway: "claude-opus-4-8",
  eagerInputStreaming: { bedrock: !0, vertex: !0 },
});

// READABLE (for understanding):
const opus47Caps = {
  firstParty: "claude-opus-4-7", bedrock: "us.anthropic.claude-opus-4-7", vertex: "claude-opus-4-7",
  foundry: "claude-opus-4-7", anthropicAws: "claude-opus-4-7", mantle: "anthropic.claude-opus-4-7", gateway: "claude-opus-4-7",
  eagerInputStreaming: { bedrock: true, vertex: true },
};
const opus48Caps = {
  firstParty: "claude-opus-4-8", bedrock: "us.anthropic.claude-opus-4-8", vertex: "claude-opus-4-8",
  foundry: "claude-opus-4-8", anthropicAws: "claude-opus-4-8", mantle: "anthropic.claude-opus-4-8", gateway: "claude-opus-4-8",
  eagerInputStreaming: { bedrock: true, vertex: true },
};

// Mapping: Ji$→opus47Caps, Xi$→opus48Caps
```

Note the asymmetry across the table: Opus 4.6 (`Di$`) carries only
`eagerInputStreaming: { vertex: true }` (cli_inner_pretty.js:91813) — Bedrock is
*omitted* for 4.6. So an operator running Opus 4.6 on Bedrock will *not* get eager
streaming, but the same operator on Vertex will. This is exactly the granularity
the firstParty-only 2.1.88 gate could not express.

`getModelCaps` (`jLz`) keys on the normalized firstParty id (`O7(model)`), so a
Bedrock-style id like `us.anthropic.claude-opus-4-8` still resolves to the same
caps record (cli_inner_pretty.js:555943).

## Provider resolution

`getAPIProvider` (`Zq`) is the single source of truth for which platform the
session is talking to (cli_inner_pretty.js:91853-91865): it checks
`CLAUDE_CODE_USE_BEDROCK`, `…USE_FOUNDRY`, `…USE_ANTHROPIC_AWS`, `…USE_MANTLE`,
`…USE_VERTEX` in order and otherwise returns `"firstParty"`. The gate above only
ever enables streaming for `firstParty`, `vertex`, and `bedrock` — `foundry`,
`anthropicAws`, and `mantle` are deliberately absent from the OR-expression and so
never receive the field unless the user force-enables it via the env var.

## Cross-validation against 2.1.88 — confidence

**The firstParty branch is byte-identical to 2.1.88** (`src/utils/api.ts:194-206`),
including the `isFirstPartyAnthropicBaseUrl()` guard and the `tengu_fgts` gate, and
the post-cache overlay (`...(base.eager_input_streaming && …)`) at
`src/utils/api.ts:220` matches cli_inner_pretty.js:556006. **Confidence: high.**

**The Bedrock/Vertex branches and the `eagerInputStreaming` model field are NEW
post-2.1.88.** A full-tree grep of `src/` finds `eager_input_streaming` only in
`utils/api.ts` and `utils/toolSchemaCache.ts`, and **no occurrence of
`eagerInputStreaming`** (the per-model cap) anywhere. The 2.1.88 comment is
explicit that the field was firstParty-only *because* "Bedrock/Vertex with Claude
4.5 reject this field with 400." The 2.1.156 design directly answers that comment by
asking the per-model cap whether the deployed model accepts it. **Confidence: high
that this is a genuine new capability, not a renamed precursor.** The cache-key
prefixes (`"L:"`, `"F:"`) are also new — 2.1.88 keyed on `tool.name` (or
`name:schema`) with no provider/prompt tags (`src/utils/api.ts:148-151`).

## ASCII flow — eager-streaming gate per (provider, model)

```
buildToolSchema(tool, {model})
        │
        ▼
  provider = getAPIProvider()         modelCaps = getModelCaps(model)
        │
        ▼
  cacheKey = ("L:" if lean prompt) + ("F:" if (vertex|bedrock streaming cap)) + name[:schema]
        │
        ├── cache HIT ──► reuse base schema ──────────────────────────────┐
        │                                                                   │
        └── cache MISS                                                      │
              │                                                             │
              ▼                                                             │
   eager = NOT explicitlyOff(env)  AND (                                    │
              firstParty AND apiAnthropicBaseUrl AND tengu_fgts            │
            | vertex     AND no VERTEX_BASE_URL  AND caps.vertex           │
            | bedrock    AND no BEDROCK_BASE_URL AND caps.bedrock          │
            | explicitlyOn(env) )                                          │
              │                                                             │
              ▼                                                             │
   base.eager_input_streaming = eager ; cache.set(cacheKey, base)          │
              │                                                             │
              ▼                                                             ▼
   schema = {…base, ...(eager && {eager_input_streaming:true})}  ◄─────────┘
              │
              ▼
   + defer_loading? + cache_control?  →  wire tool schema
```

---

## Module context (for cross-reference)

This doc covers two of the five tools-subsystem deltas in the 2.1.143–156 window.
The other three are documented separately or inline:
- **Workflow tool registration** — see `04_tools/workflow_tool_registration.md`.
- **AskUserQuestion 2.1.154 reservation** — see `04_tools/ask_user_question_reservation.md`
  (`ez = "AskUserQuestion"` at cli_inner_pretty.js:143388).
- **`disallowed-tools` frontmatter** (skills/slash commands removing tools,
  cli_inner_pretty.js:184492-184497) — see `10_skill_system/`.

Both features here ride on **existing infrastructure**: the partial-view feature
reuses the `isPartialView` channel that Edit/Write/dedup already honored, and the
streaming feature reuses the session-stable `getToolSchemaCache` and the existing
`eager_input_streaming` overlay — the only new moving parts are a new *producer*
(Read truncation) and a new *capability table* (`eagerInputStreaming`).

---

## Pre-completion notes

- No symbol mapping tables in this doc — list-format refs only (see "Related Symbols").
- Every cited `cli_inner_pretty.js:<line>` was read directly during analysis.
- New symbols for this delta should be added to `symbol_index_core_execution.md`
  (Tools/LLM API) and `symbol_index_infra_platform.md` (Model caps / API provider).
