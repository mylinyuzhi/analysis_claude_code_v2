# Memory Save Survey (`gY$` capture, `PcK` undo)

## What it does

After a memory file is written (by *any* writer — the main agent or the forked extraction subagent), v2.1.142 may capture a **survey record** containing the diff and ask the user whether the save was correct. If the user rejects, the file is restored (or deleted if it was a new file) and the rejection is recorded for analytics. If the user accepts (or ignores), the capture is silently retained for telemetry.

This subsystem is **new in v2.1.142** — there's no equivalent in v2.1.88. It exists for internal product feedback during the early-rollout phase of the tiny-memory experiment, so that the team can see which auto-saves are net-positive and which are noise.

The survey is gated on a Growthbook flag (`_cK` / `tengu_memory_save_survey_v2` or similar — the exact constant name lives in unreachable bytes) and is **disabled by default** for external users. When disabled, the gate function `KY6()` returns false and capture is skipped.

---

## How it works

### 1. The gate — `KY6()`

```javascript
// ============================================
// KY6 - the memory-write-survey enablement gate
// Location: cli_inner_pretty.js:207765-207767
// ============================================

// ORIGINAL (for source lookup):
function KY6() {
  return qY6().enabled && x9() && !pYH() && S4("allow_product_feedback");
}

// READABLE (for understanding):
function isMemorySurveyEnabled() {
  // qY6() reads the schema-validated survey config from Growthbook (default disabled)
  // x9() — auto memory is enabled
  // pYH() — likely a kill-switch (e.g., user explicitly opted out of feedback)
  // S4("allow_product_feedback") — the global feedback opt-in
  return getMemorySurveyConfig().enabled
      && isAutoMemoryEnabled()
      && !isMemorySurveyKillSwitchActive()
      && isUserFeedbackAllowed("allow_product_feedback");
}

// Mapping:
//   KY6 -> isMemorySurveyEnabled,  qY6 -> getMemorySurveyConfig,
//   x9  -> isAutoMemoryEnabled,    pYH -> isMemorySurveyKillSwitchActive (heuristic),
//   S4  -> isUserFeedbackAllowed
```

Four AND-ed conditions. The most important: `getMemorySurveyConfig().enabled` is `false` by default (read from the `tengu_memory_save_survey` schema; if validation fails, defaults apply). The survey only activates for cohorts that have been explicitly opted in via Growthbook.

### 2. The capture entry — `gY$`

```javascript
// ============================================
// gY$ - capture a save event into the survey buffer
// Location: cli_inner_pretty.js:207768-207789
// ============================================

// ORIGINAL (for source lookup):
function gY$(H, $) {
  if (H.agentId) return null;
  if (!KY6()) return null;
  if (!LH_($.filePath)) return null;
  if (S3H.basename($.filePath) === xj) return null;
  let { frontmatter: q, body: K } = wBH($.afterContent);
  return (
    RH("memory_save_capture"),
    {
      id: fcK.randomUUID(),
      filePath: $.filePath,
      memoryType: LKH(q, "type") ?? "?",
      memoryName: q.name ?? S3H.basename($.filePath).replace(/\.md$/, ""),
      isEdit: $.beforeContent !== null,
      body: K.trim(),
      afterContent: $.afterContent,
      beforeContent: $.beforeContent,
      structuredPatch: $.structuredPatch,
      capturedAt: Date.now(),
    }
  );
}

// READABLE (for understanding):
function captureMemorySave(toolContext, writeRecord) {
  // Subagents never capture (the forked extraction agent has its own scope)
  if (toolContext.agentId) return null;
  // Skip if survey isn't enabled
  if (!isMemorySurveyEnabled()) return null;
  // Skip if the path isn't a memory file (e.g., the write was to a random project file)
  if (!isAutoMemoryFilePath(writeRecord.filePath)) return null;
  // Skip the entrypoint MEMORY.md — index updates aren't "memories" to survey
  if (basename(writeRecord.filePath) === ENTRYPOINT_NAME) return null;
  // Parse the frontmatter of the new content to know type + name
  const { frontmatter, body } = parseFrontmatter(writeRecord.afterContent);
  recordSuccess("memory_save_capture");
  return {
    id: randomUUID(),
    filePath: writeRecord.filePath,
    memoryType: getFrontmatterField(frontmatter, "type") ?? "?",
    memoryName: frontmatter.name ?? basename(writeRecord.filePath).replace(/\.md$/, ""),
    isEdit: writeRecord.beforeContent !== null,    // edit vs create
    body: body.trim(),
    afterContent: writeRecord.afterContent,
    beforeContent: writeRecord.beforeContent,
    structuredPatch: writeRecord.structuredPatch,  // for edits, a unified-diff representation
    capturedAt: Date.now(),
  };
}

// Mapping:
//   gY$ -> captureMemorySave,        KY6 -> isMemorySurveyEnabled,
//   LH_ -> isAutoMemoryFilePath,     xj  -> ENTRYPOINT_NAME ("MEMORY.md"),
//   wBH -> parseFrontmatter,         LKH -> getFrontmatterField,
//   RH  -> recordSuccess,            fcK -> cryptoModule
```

**Five skip conditions** filter out events that shouldn't be surveyed:

1. **Subagent context** — the forked extraction agent shouldn't recursively populate its own survey buffer.
2. **Survey disabled** — fast-path exit when the feature flag is off.
3. **Non-memory path** — only files inside the auto-memory directory count.
4. **MEMORY.md entrypoint** — index updates are mechanical, not user-meaningful memories.
5. *(none, implicit)* — frontmatter parse errors don't skip; the record stores `"?"` as type instead.

The returned record is buffered for later use by the survey UI (which prompts the user to accept/reject one or more captures at a time).

### 3. The reject/undo path — `PcK`

```javascript
// ============================================
// PcK - undo a captured save (rollback on reject)
// Location: cli_inner_pretty.js:207901-207923
// ============================================

// ORIGINAL (for source lookup):
async function PcK(H) {
  try {
    let $;
    try {
      $ = await FY$.readFile(H.filePath, "utf8");
    } catch (q) {
      if (f8(q)) return;     // ENOENT — file already gone, nothing to undo
      throw q;
    }
    if (YcK($) !== YcK(H.afterContent)) {
      N(`[memoryWriteSurvey] skip undo for ${H.filePath}: changed since capture`);
      return;
    }
    if (H.isEdit && H.beforeContent !== null) {
      (await sO(H.filePath, H.beforeContent), RH("memory_save_reject"));
      return;
    }
    (await FY$.unlink(H.filePath), await XH_(H.filePath), RH("memory_save_reject"));
  } catch ($) {
    if (!f8($))
      (uH("memory_save_reject", "memory_save_reject_undo_failed"),
        N(`[memoryWriteSurvey] undo failed for ${H.filePath}: ${ZH($)}`));
  }
}

// READABLE (for understanding):
async function rejectMemorySave(capture) {
  try {
    // Read current content
    let currentContent;
    try {
      currentContent = await fsPromises.readFile(capture.filePath, "utf8");
    } catch (e) {
      if (isErrnoNotFound(e)) return;   // file already deleted — nothing to undo
      throw e;
    }
    // Safety: if the file changed since the capture, refuse to undo
    // (the user might have edited it in /memory and we'd clobber their changes)
    if (normalizeForCompare(currentContent) !== normalizeForCompare(capture.afterContent)) {
      debugLog(`[memoryWriteSurvey] skip undo for ${capture.filePath}: changed since capture`);
      return;
    }
    // Restore previous content (for edits) or delete the file (for creates)
    if (capture.isEdit && capture.beforeContent !== null) {
      await safeWriteFile(capture.filePath, capture.beforeContent);
      recordSuccess("memory_save_reject");
      return;
    }
    await fsPromises.unlink(capture.filePath);
    await cleanupEmptyParentDirs(capture.filePath);
    recordSuccess("memory_save_reject");
  } catch (error) {
    if (!isErrnoNotFound(error)) {
      recordFailureMetric("memory_save_reject", "memory_save_reject_undo_failed");
      debugLog(`[memoryWriteSurvey] undo failed for ${capture.filePath}: ${formatError(error)}`);
    }
  }
}

// Mapping:
//   PcK -> rejectMemorySave, FY$ -> fsPromises,
//   YcK -> normalizeForCompare (trims/normalizes whitespace before equality check),
//   sO  -> safeWriteFile (atomic via temp+rename),
//   XH_ -> cleanupEmptyParentDirs (walk up removing empty topic subdirs),
//   f8  -> isErrnoNotFound,    uH -> recordFailureMetric
```

**Three safety guards** on the undo:

1. **File-missing tolerance** — if the file is already gone, the undo is a no-op (not an error).
2. **Change-detection guard** — if the file was modified after capture (e.g., the user opened `/memory` and edited it), the undo is skipped. We don't want to silently roll back the user's own edits.
3. **Cleanup of empty parent dirs** — when a created file is deleted, walk up the directory tree and remove empty `topic/` subdirectories. This keeps the memory directory clean of empty leaves.

For edits, the `beforeContent` is preserved in the capture record, so undo restores byte-for-byte. For creates, undo is a delete + parent-dir cleanup.

### 4. The capture format

The captured record (`gY$` return shape) is essentially a *patch with metadata*:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Identifies the capture for accept/reject correlation |
| `filePath` | absolute path | Where the write happened |
| `memoryType` | string | `user` / `feedback` / `project` / `reference` / `"?"` |
| `memoryName` | string | From frontmatter `name:` field or filename basename |
| `isEdit` | boolean | True if `beforeContent` existed (an Edit), false for Write/create |
| `body` | string | Post-frontmatter content, trimmed |
| `afterContent` | string | Full file content after the write |
| `beforeContent` | string\|null | Full content before (null for creates) |
| `structuredPatch` | object[] | Unified-diff hunks (for edits only) |
| `capturedAt` | timestamp | Wall-clock at capture |

The `structuredPatch` for edits enables a diff-style display in the survey UI — "you changed line 5 from X to Y". For creates, the `body` field is the full new content.

### 5. The display formatter — `LcK`

```javascript
// ============================================
// LcK - format a capture into human-readable text for the survey UI
// Location: cli_inner_pretty.js:207888-207900
// ============================================

// ORIGINAL (for source lookup):
function LcK(H) {
  if (H.isEdit) {
    let $ = [`Edit to ${H.memoryName}:`];
    for (let q of H.structuredPatch) {
      $.push(`@@ -${q.oldStart} +${q.newStart} @@`);
      for (let K of q.lines) $.push(K);
    }
    return $.join("\n");
  }
  return `New memory ${H.memoryName}:\n${H.body}`;
}

// READABLE (for understanding):
function formatCaptureForSurvey(capture) {
  if (capture.isEdit) {
    const lines = [`Edit to ${capture.memoryName}:`];
    for (const hunk of capture.structuredPatch) {
      lines.push(`@@ -${hunk.oldStart} +${hunk.newStart} @@`);
      for (const line of hunk.lines) lines.push(line);
    }
    return lines.join("\n");
  }
  return `New memory ${capture.memoryName}:\n${capture.body}`;
}
```

Edits get unified-diff formatting; creates get a full-content block. This becomes the text the survey UI shows the user when asking "is this save correct?"

### 6. Counting helpers — `wcK`, `DcK`, `JcK`, `XcK`

These are row-counting helpers for the survey UI's text-wrapping logic. The survey panel shows captures with a configurable visible-rows limit; these functions compute how many wrapped rows each capture occupies so the panel can correctly slice/expand. They aren't part of the capture/reject contract proper — they're rendering math.

| Function | Purpose |
|----------|---------|
| `wcK(H)` | Adjusts wrap width for hunk display |
| `DcK(H)` | Computes the number of context lines a patch occupies |
| `jcK(H, $)` | Total row count for a capture at a given wrap width |
| `JcK(H, $, q)` | Truncates a text body to N rows with overflow accounting |
| `XcK(H, $, q)` | Truncates a structuredPatch to N rows with overflow accounting |
| `JH_(H, $)` | Hard-wrap a single line at width |
| `I3H(H, $)` | Total row count for a body at a given wrap width |

These are utility-belt functions used by the survey UI's panel rendering. They're internal — no other module consumes them.

### 7. The companion deletes — `McK`, `XH_`

```javascript
// McK at line 207790 — remove a capture from a list by id (used by the survey UI when the user acts on one)
// XH_ at line 207925 — walk up parent dirs from a deleted file, removing any that became empty
```

`McK` is `filter(c => c.id !== id)` with a length-check to avoid array reallocation when no change.

`XH_` is the post-delete cleanup that prevents empty `topic/` subdirectories from accumulating after rejected creates. It stops at the memory directory root (won't try to delete `~/.claude/projects/...`).

---

## Telemetry

| Event | Fired by | Significance |
|-------|----------|-------------|
| `memory_save_capture` | `gY$` (every capture) | Counts how often the survey buffers a save |
| `memory_save_reject` | `PcK` (every successful undo) | Counts how often a user rejects a captured save |
| `memory_save_reject_undo_failed` | `PcK` catch block (excluding ENOENT) | Catches unexpected filesystem failures during undo |

Compared as a ratio: `memory_save_reject / memory_save_capture` gives the "reject rate" — what fraction of captured saves the user disapproved of. This is the central metric the survey is designed to expose. Low reject rate = extractions are net-positive; high reject rate = the prompt or canUseTool needs tuning.

---

## Why this approach

**Why a separate survey subsystem rather than a UI prompt at write time?** Because interrupting the user mid-conversation to ask "is this save correct?" would be a hostile UX. The survey captures silently and asks in a batched, deferrable UI panel that the user can deal with at their leisure.

**Why a content-change guard on undo?** Because the user might open `/memory`, edit a file the survey captured, and *then* reject the original save in the survey panel. Without the guard, undo would silently overwrite the user's manual edit. With the guard, the system refuses to clobber and logs a debug message instead.

**Why store the full `afterContent` and `beforeContent` rather than just a diff?** Because:

- Diffs can be applied incorrectly if the surrounding context changed (the classic 3-way merge failure mode).
- The change-detection guard needs to compare full content to know whether the user modified the file.
- For creates, there's nothing to diff against, so `beforeContent` is null and the undo is a straight delete.

The storage cost is small (memory files are at most ~25KB each and there are rarely more than a few captures at once).

**Why exclude MEMORY.md from survey?** Because the index file's writes are mechanical link-append/delete operations; surveying "is it correct that we added a line to the index?" would be noise. The interesting unit of memory is the topic file, not the index entry.

**Why "?" as the fallback type rather than throwing?** Because surveys should never break the user's flow. If frontmatter parsing fails, the record is still captured (with `type: "?"`) and the UI just shows the body without a type tag. The failure shows up in analytics as a `memory_save_capture` event with `type: "?"`.

**Why only capture for the main agent, not subagents?** Because subagents (including the forked extraction subagent) write through the same `Write`/`Edit` tools — without the agent-id check, the survey would capture *every* memory the extraction subagent wrote, including ones the user didn't see being saved. Limiting capture to the main agent means the survey shows the user only saves *they* triggered, which is the actionable population.

Wait — that's wrong. The forked extraction agent *is* the path that writes most memories in v2.1.142. So why would we only capture main-agent writes?

Looking at the code path more carefully: `gY$` is called with a `toolContext` that includes `agentId`. The forked agent has its OWN agentId (different from the main agent's). The check `if (H.agentId) return null` skips when there's any agentId — INCLUDING the forked extraction agent. So the survey captures only writes done by the MAIN agent directly (the "user asked you to remember X" path), not by the forked extraction agent.

This makes sense for a survey: the main agent's saves are explicit and user-correlated; the forked agent's saves are speculative and would dominate the buffer with noise. The survey is designed to evaluate the *prompt-driven save* path, not the *post-turn extraction* path. The extraction path has its own telemetry (`tengu_extract_memories_extraction`).

---

## Key insight

The survey subsystem is a **quiet feedback channel** for the team running the auto-memory rollout. It captures saves silently, batches them in a UI panel the user can engage with on their own time, and uses the diff/delete operations as the reject mechanism. The reject path's content-change guard ensures the survey never destroys the user's own intervening edits.

It's also a clean illustration of v2.1.142's design philosophy: feature additions live in their own modules, gated by their own feature flags, with their own telemetry events. The extraction subsystem doesn't know the survey exists; the survey doesn't know the extraction subsystem exists. They both just observe `Write`/`Edit` tool calls and react. This decoupling is what makes the codebase incrementally evolvable — adding a survey didn't require touching the extraction or the prompt-builder layers at all.

---

## Cross-references

- [extract_memories_runtime.md](./extract_memories_runtime.md) — the main writer; its agent-id mark is what `gY$` uses to skip capturing extraction subagent writes
- [memory_ui.md](./memory_ui.md) — `MemoryFileSelector` opens edits that the survey's content-change guard protects
- [memdir_core.md](./memdir_core.md) — `xj` / `ENTRYPOINT_NAME` constant referenced by the survey-skip check
- [frontmatter_parsing.md](./frontmatter_parsing.md) — `wBH` / `parseFrontmatter` used to extract type+name from captured content
- The survey UI panel itself (consumes the row-counting helpers `JcK`/`XcK`/`I3H`) — lives in a different file/section not covered by this analysis
- The Growthbook flag schema (`tengu_memory_save_survey` or similar) — `analytics/growthbook` subsystem
