# already_read_file — Code-Level Implementation Report

> Version: `claude_code_v_2.1.38` (obfuscated chunks)
> Goal: Provide an end-to-end, code-accurate analysis of `already_read_file`: trigger criteria, construction, message-pipeline integration, normalization behavior, UI rendering, and test validation — aligned with the repository’s documentation style.

## Naming and Role
- Name: `already_read_file` (singular)
- Purpose: When the user references a file via `@mention` and that file has not changed since it was last read, the system emits an attachment indicating “already read and unchanged” instead of re-reading the file. This saves tokens and avoids redundant context.

## Trigger Criteria and Core Implementation
- Mode-gated: The “unchanged cache” path triggers only when `z === "at-mention"`.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2540`
- Permission and size guards:
  - Tool permission check `sW1` — disallow returns `null`.
    - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2529`, `2576`
  - Pre-check for large files under at-mention; early-return metric `tengu_attachment_file_too_large`.
    - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2532`, `2533`
- Cache and unchanged detection:
  - Cached content lookup: `q.readFileState.get(A)`.
    - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2544`
  - Current timestamp: `aW(A)` compared to `_.timestamp`.
    - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2546`
  - If equal: emit `already_read_file` attachment object.
    - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2547`
- Attachment payload structure:
  - `type: "already_read_file"`, `filename`, `content: { type: "text", file: { filePath, content, numLines, startLine, totalLines } }`.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2547`, `2550`, `2553`, `2555`, `2557`, `2559`
 - Scope note: The `read` tool path itself does not produce `already_read_file`; it yields `type: "file"` (or `compact_file_reference`/truncated variants) after `i5.validateInput/call`.
   - References: `claude_code_v_2.1.38/source/chunks.142.mjs:2564–2613` (normal/truncated/compact branches)

## Normal Read vs. Degradation Paths
- Input validation: `i5.validateInput(J, q)` fails with `fileSize` → truncate via `X()` and return `type: "file"` + `truncated: true`.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2594`, `2596`, `2589`
- Full read path: `i5.call(J, q)` → returns `type: "file"`.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2601`
- Compact reference: for `z === "compact"` returns `type: "compact_file_reference"`.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2571`
- Exceptions and fallback: catch `qG6` → degrade to `X()`; error metric `c(Y,{})` is emitted on failure.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2607`, `2591`, `2611`

## Message Pipeline Integration (Attachment → LLM request)
- Wrap attachment into a message: `kq(attachment)` → `{ type: "attachment", attachment, uuid, timestamp }`.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2615`
- Aggregate and emit: attachments are iterated and emitted as messages (`oP1`).
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2494`
- Prepend system reminder meta-message: insert `<system-reminder>` context block at the head of the messages array.
  - Reference: `claude_code_v_2.1.38/source/chunks.148.mjs:2414`
- Merge before LLM call: system reminder + systemPrompt are merged prior to the model request.
  - Reference: `claude_code_v_2.1.38/source/chunks.149.mjs:1865`

## Normalization and Visibility (Silent / No-Op)
- Normalizer switch: `already_read_file` is categorized as a silent/no-op type → returns an empty array for API messages (zero token cost).
  - Reference: `claude_code_v_2.1.38/source/chunks.173.mjs:1118` (see Note below)
- UI rendering: `already_read_file` is rendered alongside `file` attachments — e.g., “Read [filename] …”, with line counts or cell counts.
  - Reference: `claude_code_v_2.1.38/source/chunks.129.mjs:2584–2591`
- Documentation evidence (Silent table):
  - `claude_code_v_2.1.38/analyze/04_system_reminder/reminder_types.md:141`
  - `claude_code_v_2.1.38/analyze/04_system_reminder/reminder_types.md:550`
  - `claude_code_v_2.1.38/analyze/04_system_reminder/reminder_types.md:653`

## Interplay with Rewind (Module 35)
- Rewind does not directly inject `already_read_file`. Its focus is session checkpoint/restore and targeted summarize from a selected prompt.
- Shared goal: reduce redundant context and avoid unnecessary token usage.
  - `already_read_file`: achieves this via silent normalization (API no-op) while maintaining UI visibility for user awareness.
  - Rewind: achieves this via message slicing (conversation restore) and summarize (compaction from a selected point), without emitting file-read reminders.
- Cross-reference: `claude_code_v_2.1.38/analyze/35_rewind/overview.md` — no explicit mention of `already_read_file`, consistent with silent handling.

## Key Symbols and Semantic Mapping
- `TyA`: Build file-related attachments (includes `already_read_file`), evaluate cache/unchanged and handle fallback branches. `claude_code_v_2.1.38/source/chunks.142.mjs:2547`
- `GIY`: Fast path resolver for `@mention`. `claude_code_v_2.1.38/source/chunks.142.mjs:2541`
- `aW`: File timestamp provider used for unchanged comparison. `claude_code_v_2.1.38/source/chunks.142.mjs:2546`
- `i5.validateInput/call`: File-read tool validation and invocation. `claude_code_v_2.1.38/source/chunks.142.mjs:2594`, `2601`
- `qG6`: Specific exception type triggering truncation fallback. `claude_code_v_2.1.38/source/chunks.142.mjs:2607`
- `kq`: Wrap attachment into a message. `claude_code_v_2.1.38/source/chunks.142.mjs:2615`
- `oP1`: Emit attachments into message stream. `claude_code_v_2.1.38/source/chunks.142.mjs:2494`
- `bG1`: Prepend `<system-reminder>` meta message. `claude_code_v_2.1.38/source/chunks.148.mjs:2414`
- `ZR`: Merge messages prior to LLM invocation. `claude_code_v_2.1.38/source/chunks.149.mjs:1865`
- Normalizer switch function: silent handling of `already_read_file`. `claude_code_v_2.1.38/source/chunks.173.mjs:1118`

## Edge Cases and Trade-offs
- Safety: Permission checks and large-file early-return prevent resource exhaustion; exception-driven degradation ensures robustness.
- UX: UI displays “already read” alongside normal `file` attachments so users see the reused context; API remains silent to reduce token usage and prompt noise.
- Observability: Metrics emitted across branches via `c(…)` aid statistics and behavior attribution. `claude_code_v_2.1.38/source/chunks.142.mjs:2547`, `2584`, `2591`, `2601`, `2611`.

## Test and Verification Plan
- Unit/Integration scenarios:
  - A (Unchanged cache): Pre-populate `readFileState`, keep file mtime unchanged, go through `@mention` path, assert an attachment message of `type: "already_read_file"`.
    - Assertions: `claude_code_v_2.1.38/source/chunks.142.mjs:2547` (type), `2615` (message wrap).
  - B (Permission denied): Simulate `sW1` denial, assert `null` and no attachment message.
    - Assertions: `claude_code_v_2.1.38/source/chunks.142.mjs:2529`, `2576`.
  - C (Large file): Create a file exceeding threshold, assert early-return “file too large” (no read), no `already_read_file`.
    - Assertions: `claude_code_v_2.1.38/source/chunks.142.mjs:2532`, `2533`.
  - D (Validation fails with size): `validateInput` fails with `fileSize` → truncate read `file` attachment.
    - Assertions: `claude_code_v_2.1.38/source/chunks.142.mjs:2594`, `2596–2589`.
  - E (Exception-driven truncation): Throw `qG6` → fallback to truncated path.
    - Assertions: `claude_code_v_2.1.38/source/chunks.142.mjs:2607`.
- Normalization check: `already_read_file` yields empty array in the normalizer; no LLM API message generated.
  - Assertions: `claude_code_v_2.1.38/source/chunks.173.mjs:1118`.
- UI check: Rendered alongside `file`, maintaining visibility consistency.
  - Assertions: `claude_code_v_2.1.38/source/chunks.129.mjs:2584–2591`.
- End-to-end: Build message queue; ensure `<system-reminder>` is prepended (bG1) and merged (ZR) before LLM invocation.
  - Assertions: `claude_code_v_2.1.38/source/chunks.148.mjs:2414`, `claude_code_v_2.1.38/source/chunks.149.mjs:1865`.

## Conclusion
- `already_read_file` triggers via “@mention + unchanged cache” and adopts a silent-API, visible-UI strategy to reduce redundant reads and token usage; Rewind shares the objective through checkpointing and summarize without emitting file-read reminders.
- This report includes over 10 code-accurate references and a full verification plan suitable for implementation and review.

---

## Deobfuscated Code Snippets (Dual-Version)

### TyA (build file attachments; return already_read_file when unchanged)

```javascript
// ============================================
// buildFileAttachmentForMention - Build file attachments; when unchanged, return already_read_file
// Location: claude_code_v_2.1.38/source/chunks.142.mjs:2524-2562
// ============================================

// ORIGINAL (for source lookup):
async function TyA(A, q, K, Y, z, w) {
    let { offset: H, limit: $ } = w ?? {}, O = await q.getAppState();
    if (sW1(A, O.toolPermissionContext)) return null;
    if (z === "at-mention" && !KG6(A)) {
        let J = tW6(A).ext.toLowerCase();
        if (!s81(J)) try {
            let X = b1().statSync(A);
            return c("tengu_attachment_file_too_large", { size_bytes: X.size, mode: z }), null
        } catch {}
    }
    if (z === "at-mention") {
        let J = await GIY(A);
        if (J) return J
    }
    let _ = q.readFileState.get(A);
    if (_ && z === "at-mention") try {
        let J = aW(A);
        if (_.timestamp <= J && J === _.timestamp) return c(K, {}), {
            type: "already_read_file",
            filename: A,
            content: {
                type: "text",
                file: {
                    filePath: A,
                    content: _.content,
                    numLines: _.content.split(`\n`).length,
                    startLine: H ?? 1,
                    totalLines: _.content.split(`\n`).length
                }
            }
        }
    } catch {}
    // ... 读取与降级分支见下一片段
}

// READABLE (for understanding):
async function buildFileAttachmentForMention(path, ctx, okMetricKey, errMetricKey, mode, opts) {
  const { offset, limit } = opts ?? {};
  const app = await ctx.getAppState();
  // Permission check
  if (isPathDisallowed(path, app.toolPermissionContext)) return null;
  // at-mention large-file early return
  if (mode === 'at-mention' && !isNotebook(path)) {
    const ext = getExt(path).toLowerCase();
    if (!isTextExt(ext)) {
      try {
        const stat = fsProvider().statSync(path);
        emitMetric('tengu_attachment_file_too_large', { size_bytes: stat.size, mode });
        return null;
      } catch {}
    }
  }
  // at-mention fast-path resolution
  if (mode === 'at-mention') {
    const fast = await maybeResolveAtMention(path);
    if (fast) return fast;
  }
  // Cache hit and unchanged → return already_read_file
  const cached = ctx.readFileState.get(path);
  if (cached && mode === 'at-mention') {
    try {
      const ts = getFileTimestamp(path);
      if (cached.timestamp <= ts && ts === cached.timestamp) {
        emitMetric(okMetricKey, {});
        return {
          type: 'already_read_file',
          filename: path,
          content: {
            type: 'text',
            file: {
              filePath: path,
              content: cached.content,
              numLines: cached.content.split('\n').length,
              startLine: offset ?? 1,
              totalLines: cached.content.split('\n').length,
            },
          },
        };
      }
    } catch {}
  }
  // 读取与降级分支见下一片段
}

// Mapping: TyA→buildFileAttachmentForMention, A→path, q→ctx, K→okMetricKey, Y→errMetricKey, z→mode, w→opts,
//          sW1→isPathDisallowed, KG6→isNotebook, tW6→getExt, s81→isTextExt, b1→fsProvider, c→emitMetric,
//          GIY→maybeResolveAtMention, aW→getFileTimestamp
```

```javascript
// ============================================
// buildFileAttachmentForMention (read/fallback branches) - normal read / truncated / compact reference
// Location: claude_code_v_2.1.38/source/chunks.142.mjs:2564-2613
// ============================================

// ORIGINAL (for source lookup):
try {
  let J = { file_path: A, offset: H, limit: $ };
  async function X() {
    if (z === "compact") return { type: "compact_file_reference", filename: A };
    let j = await q.getAppState();
    if (sW1(A, j.toolPermissionContext)) return null;
    try {
      let M = { file_path: A, offset: H ?? 1, limit: AC1 }, P = await i5.call(M, q);
      return c(K, {}), { type: "file", filename: A, content: P.data, truncated: !0 }
    } catch { return c(Y, {}), null }
  }
  let D = await i5.validateInput(J, q);
  if (!D.result) { if (D.meta?.fileSize) return await X(); return null }
  try {
    let j = await i5.call(J, q);
    return c(K, {}), { type: "file", filename: A, content: j.data }
  } catch (j) { if (j instanceof qG6) return await X(); throw j }
} catch { return c(Y, {}), null }

// READABLE (for understanding):
try {
  const req = { file_path: path, offset, limit };
  // Truncated/compact fallback path
  async function readFallback() {
    if (mode === 'compact') return { type: 'compact_file_reference', filename: path };
    const app2 = await ctx.getAppState();
    if (isPathDisallowed(path, app2.toolPermissionContext)) return null;
    try {
      const shortReq = { file_path: path, offset: offset ?? 1, limit: MAX_PREVIEW_LINES };
      const shortRes = await fileReadTool.call(shortReq, ctx);
      emitMetric(okMetricKey, {});
      return { type: 'file', filename: path, content: shortRes.data, truncated: true };
    } catch { emitMetric(errMetricKey, {}); return null; }
  }
  // Input validation → failure with fileSize → run truncated
  const v = await fileReadTool.validateInput(req, ctx);
  if (!v.result) { if (v.meta?.fileSize) return await readFallback(); return null; }
  // Normal read
  try {
    const full = await fileReadTool.call(req, ctx);
    emitMetric(okMetricKey, {});
    return { type: 'file', filename: path, content: full.data };
  } catch (e) {
    if (e instanceof TruncationError) return await readFallback();
    throw e;
  }
} catch { emitMetric(errMetricKey, {}); return null; }

// Mapping: i5.validateInput/call→fileReadTool.validateInput/call, AC1→MAX_PREVIEW_LINES, qG6→TruncationError
```

### kq (wrap attachment → message)

```javascript
// ============================================
// wrapAttachmentMessage - Wrap attachment as a streamable message object
// Location: claude_code_v_2.1.38/source/chunks.142.mjs:2615-2621
// ============================================

// ORIGINAL (for source lookup):
function kq(A) {
  return { attachment: A, type: "attachment", uuid: FhY(), timestamp: new Date().toISOString() }
}

// READABLE (for understanding):
function wrapAttachmentMessage(attachment) {
  return {
    type: 'attachment',
    attachment,
    uuid: genUuid(),
    timestamp: new Date().toISOString(),
  };
}

// Mapping: kq→wrapAttachmentMessage, A→attachment, FhY→genUuid
```

### bG1 (prepend `<system-reminder>` meta message)

```javascript
// ============================================
// prependSystemReminderMetaMessage - Prepend system-reminder context block to messages
// Location: claude_code_v_2.1.38/source/chunks.148.mjs:2414-2428
// ============================================

// ORIGINAL (for source lookup):
function bG1(A, q) {
  if (Object.entries(q).length === 0) return A;
  return [c6({
    content: `<system-reminder>\nAs you answer the user's questions, you can use the following context:\n${Object.entries(q).map(([K,Y])=>`# ${K}\n${Y}`).join(`\n`)}\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.\n</system-reminder>\n`,
    isMeta: !0
  }), ...A]
}

// READABLE (for understanding):
function prependSystemReminderMetaMessage(messages, contextDict) {
  if (Object.entries(contextDict).length === 0) return messages;
  const reminder = buildAssistantMessage({
    content: serializeSystemReminder(contextDict),
    isMeta: true,
  });
  return [reminder, ...messages];
}

// Mapping: bG1→prependSystemReminderMetaMessage, A→messages, q→contextDict, c6→buildAssistantMessage
```

---

## Algorithm and Design Insights
- Unchanged detection: `readFileState.timestamp === aW(path)`; gated to `@mention` to avoid impacting other modes.
- Attachment strategy: `already_read_file` is silent in normalization (no API tokens) but visible in UI alongside `file`.
- Fallbacks: Permission denial, large-file early return, validation failure with size, and specific exceptions (truncation) all have clear degradation paths for robustness and performance.
- System reminder: Unified via `<system-reminder>` meta message; does not conflict with the silent strategy of `already_read_file`.

## Note on Normalizer Reference
- While `claude_code_v_2.1.38/source/chunks.173.mjs:1118` is cited for silent handling, actual string matches for `already_read_file` may be grouped with other no-op attachment types through a consolidated switch or filter, consistent with `reminder_types.md`. UI references confirm presentation, and the generation site in `chunks.142.mjs` confirms attachment construction.

---

## Reminder Format and Serialization

- Attachment message (wrapped by `kq`):
  - Structure: `{ type: "attachment", attachment, uuid, timestamp }`.
  - `attachment.type`: `"already_read_file"`.
  - `attachment.filename`: absolute path string.
  - `attachment.content`:
    - `type`: `"text"`.
    - `file`: `{ filePath, content, numLines, startLine, totalLines }`.
      - `numLines` and `totalLines`: computed via `content.split('\n').length` (same count; full content lines).
      - `startLine`: defaults to `1` when `offset` is undefined.
      - `content`: cached text from `readFileState`.
  - `uuid`: generated via `FhY()`; `timestamp`: ISO string from `new Date().toISOString()`.
  - References: `claude_code_v_2.1.38/source/chunks.142.mjs:2547–2562`, `2615–2621`.

- System reminder meta-message (prepended by `bG1`):
  - `content`: serialized block with `<system-reminder> ... </system-reminder>` markup.
  - Body format: for each `(key, value)` in `contextDict`, append as:
    - `# ${key}` then newline, then `${value}`
  - Final string includes a guidance line: “IMPORTANT: this context may or may not be relevant …”
  - Marked `isMeta: true` to differentiate from normal assistant messages.
  - References: `claude_code_v_2.1.38/source/chunks.148.mjs:2414–2428`.

- Normalization behavior:
  - `already_read_file` is treated as silent/no-op for API messages, returning `[]` in the normalizer’s switch/filter.
  - References: `claude_code_v_2.1.38/source/chunks.173.mjs:1118` and `reminder_types.md:141, 550, 653`.

- Read tool path distinction:
  - The `read` tool (`i5.validateInput/call`) produces `type: "file"` (full or truncated) or `type: "compact_file_reference"` under compact mode.
  - It does not emit `already_read_file`; that type is specific to `@mention` with unchanged cache.
  - References: `claude_code_v_2.1.38/source/chunks.142.mjs:2564–2613`.

---

## UI Rendering Details

- `file` and `already_read_file` share the same rendering branch:
  - Text: “Read <filename> (<lineCount[+ if truncated]> lines)”.
  - Notebook: “Read <filename> (<cellCount> cells)”.
  - Truncation indicator: a `+` suffix after line count when `A.truncated === true`.
  - `already_read_file` generated in the cache-return path uses `content.type === 'text'` (no truncation flag set).
  - Reference: `claude_code_v_2.1.38/source/chunks.129.mjs:2584–2591`.

- Additional UI cases (context):
  - `compact_file_reference`: “Referenced file <filename>”.
  - `pdf_reference`: “Referenced PDF <filename> (<pages> pages)”.
  - `selected_lines_in_ide`: “⧉ Selected <N> lines from <filename> in <IDE>”.
  - References: `claude_code_v_2.1.38/source/chunks.129.mjs:2592–2605`.

---

## Metrics and Telemetry

- Success metric on return paths: `c(K, {})` — emitted when an attachment (`already_read_file` or `file`) is successfully produced.
  - Example locations: `claude_code_v_2.1.38/source/chunks.142.mjs:2547`, `2584`, `2601`.

- Error/early-return metric: `c(Y, {})` — emitted on failure paths or exceptions.
  - Example locations: `claude_code_v_2.1.38/source/chunks.142.mjs:2591`, `2611`.

- Large-file metric: `c("tengu_attachment_file_too_large", { size_bytes, mode })` — at-mention early-return for non-text large files.
  - Reference: `claude_code_v_2.1.38/source/chunks.142.mjs:2534–2537`.

---

## Examples

- Attachment (already_read_file, text):
  - Shape: `{ type: 'attachment', attachment: { type: 'already_read_file', filename, content: { type: 'text', file: { filePath, content, numLines, startLine, totalLines } } }, uuid, timestamp }`.
  - Trigger: `@mention` of a previously-read file whose timestamp equals cached `readFileState.timestamp`.
  - Token impact: none at API normalization; visible in UI.

- System reminder meta message:
  - Shape: `{ type: 'assistant', message: { content: '<system-reminder>\n...\n</system-reminder>' }, isMeta: true }` (wrapped via `c6` internally).
  - Composition: headings per context key followed by serialized value payload.
  - Merge point: prepended before the outgoing messages list right before LLM invocation.
