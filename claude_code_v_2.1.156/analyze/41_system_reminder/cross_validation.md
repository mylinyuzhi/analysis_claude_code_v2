# Cross-Validation — v2.1.156 obfuscated ↔ v2.1.88 TS reference

> Symbol-by-symbol verification of the `<system-reminder>` subsystem by comparing the v2.1.156 obfuscated bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, 649,979 lines) against the v2.1.88 deobfuscated TypeScript source at `/lyz/codespace/3rd/claude-code/src/`.

## Methodology

For each reminder-related function/constant in the v2.1.156 bundle:

1. **Locate** in `cli_inner_pretty.js` by line number — every 2.1.156 line below was Read/grep-verified directly against the bundle (NOT copied from the 2.1.142 reference; both obfuscated names and line numbers differ between the two versions).
2. **Cross-check** the obfuscated body against the v2.1.88 readable function with the same readable name and signature/behavior.
3. **Confidence rating**: HIGH if both bodies match line-for-line (or string byte-identical); MEDIUM if shapes match but with intentional edits; LOW if inferred from string anchors alone or no 2.1.88 counterpart exists.

All entries below are HIGH unless noted. Where a symbol existed in the 2.1.142 reference under a different obfuscated name, the rename is called out explicitly (a `2.1.142-obf → 2.1.156-obf` note).

---

## Master identity table (2.1.156-obf | 2.1.88-readable | confidence)

This is a `cross_validation` doc, so the spec explicitly permits an obfuscated→readable table here.

| 2.1.156 obf | 2.1.156 line | 2.1.88 readable name | 2.1.88 file:line | Confidence | 2.1.142-obf (renamed) |
|-------------|--------------|----------------------|------------------|------------|------------------------|
| `S0` | 445237-445241 | `wrapInSystemReminder` | messages.ts:3097-3099 | HIGH | `h2` |
| `C_` | 445299-445312 | `wrapMessagesInSystemReminder` | messages.ts:3101-3122 | HIGH | `o_` |
| `T8` | 443846-443883 | `createUserMessage` | messages.ts:460 | HIGH | `w8` |
| `fi6` | 445242-445245 | `extractSystemReminderContent` (original-returning) | betaSessionTracing.ts:149 (regex :143) | HIGH | `Wq4` |
| `JN6` | 271456-271458 | `extractSystemReminderContent` (null-returning) | betaSessionTracing.ts:149 | HIGH | `nD6` |
| `Az7` | 221264-221269 | `memoryFreshnessNote` (single-line wrap) | memdir/memoryAge.ts:49-53 | HIGH | (inline / new role) |
| `oG6` | 221255-221263 | `memoryFreshnessText` | memdir/memoryAge.ts:33-42 | HIGH | `A36` |
| `ME5` | 221252-221254 | `memoryAgeDays` | memdir/memoryAge.ts:6-8 | HIGH | (inline) |
| `PG4` | 443733-443740 | `stripSystemReminders` | messageActions.tsx:399-408 | HIGH | `Nq4` |
| `OD9` | 614580-614582 | `stripAllReminders` (regex) | transcriptSearch.ts:117-127 (loop) | HIGH (behavior) | `vQ4` |
| `Nm4` | 495652 | `SYSTEM_REMINDER_CLOSE` | transcriptSearch.ts (const) | HIGH | (close-tag const) |
| `aqz` strip loop | 495597-495605 | inlined `while(open>=0)` strip-all | transcriptSearch.ts:117-127 | HIGH (behavior) | (search index) |
| `DQ_` | 444371-444382 | `ensureSystemReminderWrap` | messages.ts:1797-1816 | HIGH | `Az5` |
| `hG4` | 444384-444402 | `smooshSystemReminderSiblings` | messages.ts:1835-1873 | HIGH | `mq4` |
| `Ai6` | 444756-444785 | `smooshIntoToolResult` | messages.ts:2534 | HIGH | `WR6` |
| `VQ_` | 444787-444803 | merge/smoosh driver (`tengu_chair_sermon`) | messages.ts:2616-2646 | HIGH | (merge path) |
| `kc6` | 445425-445808 | `normalizeAttachmentForAPI` | messages.ts:3453 | HIGH (shared cases) | `CI6` |
| `DG4` | 446557-446767 | per-type renderer object (inline in 2.1.88) | messages.ts:3453+ | HIGH (shared cases) | `Tq4` |
| `Aw4` | 412660-412738 | `getAttachmentMessages` | attachments.ts (gate :752) | HIGH | (collectAttachments) |
| `E3` | 412739-412763 | per-generator try/catch wrapper | attachments.ts (inline) | HIGH | (runGenerator) |
| `gV$` | 412764-412798 | `getQueuedCommandAttachments` | attachments.ts:760 | HIGH | (queued cmd gen) |
| `QV$` | 414014 | `REMINDER_THRESHOLDS` / TODO_REMINDER_CONFIG | attachments.ts | HIGH | `aO8` |
| `lg6` | 414015 | PLAN_MODE_ATTACHMENT_CONFIG | attachments.ts | HIGH | `Is7` |
| `zw4` | 414018 | VERIFY_PLAN_REMINDER_CONFIG | attachments.ts | MEDIUM (repurposed) | `B65`-shape |
| `Kw4` | 414016 | ULTRA_EFFORT_CONFIG (NEW) | — | LOW (no 2.1.88) | (new) |
| `_w4` | 414017 | RELEVANT_MEMORIES_CONFIG (NEW) | — | LOW (no 2.1.88) | (new) |
| `vR_` | 413741-413752 | `getTodoReminderAttachment` | attachments.ts | HIGH | `Vq5` |
| `NR_` | 413776-413787 | `getTaskReminderAttachment` | attachments.ts | HIGH | `kq5` |
| `yT8` | 446489-446490 | ambient-context trailer (inline in 2.1.88) | messages.ts (inline) | HIGH | (inline string) |
| `SQ_` | 445274-445281 | `makeApiSystemMessage` (NEW) | — | LOW (no 2.1.88) | (new) |
| `RQ_` | 445282-445298 | extract-bodies-for-api-system (NEW) | — | LOW (no 2.1.88) | (new) |
| `Uc5` | 271459-271492 | `formatMessagesForContext` | betaSessionTracing.ts:166-208 | HIGH (extended) | (telemetry split) |
| `iv7` | 271500-271593 | span-attribute setter | betaSessionTracing.ts:356-398 | HIGH | (telemetry setter) |
| `d7z` | 499732-499755 | `computeStickyPromptText` | VirtualMessageList.tsx:145-160 | HIGH | (sticky compute) |
| `Ce6` | 499726-499731 | `stickyPromptText` (memoizer) | VirtualMessageList.tsx:133-144 | HIGH | (sticky memo) |

---

## Primitives — wrap

### `wrapInSystemReminder` (`S0`)

```javascript
// ============================================
// wrapInSystemReminder - Multiline <system-reminder> envelope
// Location: cli_inner_pretty.js:445237-445241
// ============================================

// ORIGINAL (for source lookup):
function S0(H) {
  return `<system-reminder>
${H}
</system-reminder>`;
}

// READABLE (for understanding):
function wrapInSystemReminder(content) {
  return `<system-reminder>\n${content}\n</system-reminder>`;
}

// Mapping: S0→wrapInSystemReminder, H→content
```

```typescript
// v2.1.88 (src/utils/messages.ts:3097-3099):
export function wrapInSystemReminder(content: string): string {
  return `<system-reminder>\n${content}\n</system-reminder>`
}
```

**Match**: Byte-identical on the wire (`\n${content}\n` newline before AND after). The obfuscated form uses a template literal with embedded literal newlines; the TS source uses explicit `\n` escapes. Used 19× in the bundle.

**Confidence**: HIGH. **Rename**: 2.1.142 `h2` → 2.1.156 `S0`.

### `wrapMessagesInSystemReminder` (`C_`)

```javascript
// ============================================
// wrapMessagesInSystemReminder - List→list wrap of every text block
// Location: cli_inner_pretty.js:445299-445312
// ============================================

// ORIGINAL (for source lookup):
function C_(H) {
  return H.map(($) => {
    if (typeof $.message.content === "string")
      return { ...$, message: { ...$.message, content: S0($.message.content) } };
    else if (Array.isArray($.message.content)) {
      let q = $.message.content.map((K) => { if (K.type === "text") return { ...K, text: S0(K.text) }; return K; });
      return { ...$, message: { ...$.message, content: q } };
    }
    return $;
  });
}

// READABLE (for understanding):
function wrapMessagesInSystemReminder(messages) {
  return messages.map((msg) => {
    if (typeof msg.message.content === "string")
      return { ...msg, message: { ...msg.message, content: wrapInSystemReminder(msg.message.content) } };
    else if (Array.isArray(msg.message.content)) {
      const wrapped = msg.message.content.map((block) =>
        block.type === "text" ? { ...block, text: wrapInSystemReminder(block.text) } : block);
      return { ...msg, message: { ...msg.message, content: wrapped } };
    }
    return msg;
  });
}

// Mapping: C_→wrapMessagesInSystemReminder, S0→wrapInSystemReminder, H→messages, $→msg, K→block
```

```typescript
// v2.1.88 (src/utils/messages.ts:3101-3122):
export function wrapMessagesInSystemReminder(messages: UserMessage[]): UserMessage[] { ... }
```

**Match**: Structurally identical. image/document/tool_use blocks pass through unchanged in both versions. This is THE helper invoked by nearly every dispatcher case (`C_([T8({content, isMeta:!0})])`).

**Confidence**: HIGH. **Rename**: 2.1.142 `o_` → 2.1.156 `C_`.

### `createUserMessage` (`T8`)

The `isMeta`-carrying user-message factory. `T8({content, isMeta:!0})` is the canonical reminder envelope; `isMeta:true` is the UI-suppression flag every reminder rides. `content || IT` uses `IT` as the empty-content sentinel.

```javascript
// ============================================
// createUserMessage - User-message factory carrying isMeta / isVisibleInTranscriptOnly
// Location: cli_inner_pretty.js:443846-443883
// ============================================

// ORIGINAL (for source lookup):
function T8({ content: H, isMeta: $, isVisibleInTranscriptOnly: q, ... }) {
  return { type: "user", message: { role: "user", content: H || IT }, isMeta: $, isVisibleInTranscriptOnly: q, ... };
}

// READABLE (for understanding):
function createUserMessage({ content, isMeta, isVisibleInTranscriptOnly, ... }) {
  return { type: "user", message: { role: "user", content: content || EMPTY_CONTENT_SENTINEL }, isMeta, isVisibleInTranscriptOnly, ... };
}

// Mapping: T8→createUserMessage, H→content, $→isMeta, q→isVisibleInTranscriptOnly, IT→EMPTY_CONTENT_SENTINEL
```

```typescript
// v2.1.88 (src/utils/messages.ts:460):
export function createUserMessage({ content, isMeta, isVisibleInTranscriptOnly, ... }) { ... }
```

**Match**: Same envelope shape; the param list grew across versions but the role is identical. The `isMeta` boolean is never serialized to the API — it rides with message identity for UI/telemetry suppression.

**Confidence**: HIGH. **Rename**: 2.1.142 `w8` → 2.1.156 `T8`.

---

## Primitives — extract / unwrap

Two distinct extract helpers exist (same regex, different null-handling) — exactly mirroring the 2.1.88 split.

### `extractSystemReminderContent` original-returning (`fi6`)

```javascript
// ============================================
// extractSystemReminderContent - Unwrap a wholly-enclosed reminder, else return input
// Location: cli_inner_pretty.js:445242-445245
// ============================================

// ORIGINAL (for source lookup):
function fi6(H) {
  let $ = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H);
  return $ ? $[1] : H;
}

// READABLE (for understanding):
function extractSystemReminderContent(text) {
  const m = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(text);
  return m ? m[1] : text;
}

// Mapping: fi6→extractSystemReminderContent, H→text, $→m
```

The `^…$` anchors enforce "whole string is one envelope"; the optional `\n?` tolerates both the `S0` newline form and the single-line form. Used in the Chrome browser-batch dedup path. Returns the original string on no-match.

**Confidence**: HIGH. **Rename**: 2.1.142 `Wq4` → 2.1.156 `fi6`.

### `extractSystemReminderContent` null-returning (`JN6`)

```javascript
// ============================================
// extractSystemReminderContent - Telemetry variant: trim + return null on no-match
// Location: cli_inner_pretty.js:271456-271458
// ============================================

// ORIGINAL (for source lookup):
function JN6(H) {
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H.trim())?.[1]?.trim() || null;
}

// READABLE (for understanding):
function extractSystemReminderContent(text) {
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(text.trim())?.[1]?.trim() || null;
}

// Mapping: JN6→extractSystemReminderContent, H→text
```

```typescript
// v2.1.88 (src/utils/telemetry/betaSessionTracing.ts:149-152):
function extractSystemReminderContent(text: string): string | null {
  const match = text.trim().match(SYSTEM_REMINDER_REGEX)
  return match && match[1] ? match[1].trim() : null
}
```

**Match**: `JN6` matches the 2.1.88 `string | null` signature exactly (trims input and output, returns `null` on no-match — "is this text *entirely* a reminder?"). `fi6` is the original-returning sibling. Two copies of the same idea, two return conventions — same as 2.1.142.

**Confidence**: HIGH. **Rename**: 2.1.142 `nD6` → 2.1.156 `JN6`.

---

## Primitives — strip

### `stripSystemReminders` leading-strip (`PG4`)

```javascript
// ============================================
// stripSystemReminders - Peel leading reminder blocks (sticky-prompt / copy text)
// Location: cli_inner_pretty.js:443733-443740
// ============================================

// ORIGINAL (for source lookup):
function PG4(H) {
  let q = H.trimStart();
  while (q.startsWith("<system-reminder>")) {
    let K = q.indexOf("</system-reminder>");
    if (K < 0) break;
    q = q.slice(K + 18).trimStart();
  }
  return q;
}

// READABLE (for understanding):
function stripSystemReminders(text) {
  const CLOSE = "</system-reminder>";
  let t = text.trimStart();
  while (t.startsWith("<system-reminder>")) {
    const end = t.indexOf(CLOSE);
    if (end < 0) break;
    t = t.slice(end + CLOSE.length).trimStart();
  }
  return t;
}

// Mapping: PG4→stripSystemReminders, H→text, q→t, K→end; literal 18 = "</system-reminder>".length
```

```typescript
// v2.1.88 (src/components/messageActions.tsx:399-408):
export function stripSystemReminders(text: string): string { ... }
```

**Match**: Byte-for-byte equivalent. The literal `18` in the obfuscated form is `"</system-reminder>".length`. Peels leading blocks only — a real user prompt never embeds reminders mid-body (they are always *prepended* by the attachment pipeline), so a leading-only strip is correct for sticky-prompt/copy.

**Confidence**: HIGH. **Rename**: 2.1.142 `Nq4` → 2.1.156 `PG4`.

### `stripAllReminders` regex (`OD9`)

```javascript
// ============================================
// stripAllReminders - Regex strip-all (preview/fuzzy-search normaliser)
// Location: cli_inner_pretty.js:614580-614582
// ============================================

// ORIGINAL (for source lookup):
function OD9(H) {
  return H.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// READABLE (for understanding):
function stripAllReminders(text) {
  return text.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// Mapping: OD9→stripAllReminders, H→text
```

```typescript
// v2.1.88 (src/utils/transcriptSearch.ts:117-127) — inlined as a while-loop on <system-reminder> only:
let open = t.indexOf('<system-reminder>')
while (open >= 0) {
  const close = t.indexOf(SYSTEM_REMINDER_CLOSE, open)
  if (close < 0) break
  t = t.slice(0, open) + t.slice(close + SYSTEM_REMINDER_CLOSE.length)
  open = t.indexOf('<system-reminder>')
}
```

**Match**: Different implementation, same intended effect. The 2.1.156 regex covers BOTH `<system-reminder>` and `<task-notification>` via the `\1` back-reference and replaces each slice with a single space; the `(<\/\1>|$)` arm nukes an unterminated trailing tag too. The 2.1.88 inlined loop handles `<system-reminder>` only and splices out the slice (no space). The wider `task-notification` coverage was added post-2.1.88 (background-agent notifications also need stripping from preview/search).

**Confidence**: HIGH (behavior verified; regex byte-exact vs the 2.1.142 form). **Rename**: 2.1.142 `vQ4` → 2.1.156 `OD9`.

### `SYSTEM_REMINDER_CLOSE` + index strip-all loop (`Nm4` + `aqz` tail)

```javascript
// ============================================
// SYSTEM_REMINDER_CLOSE + index strip-all - Search-index variant (indexOf splice, no space)
// Location: cli_inner_pretty.js:495597-495605 (loop), const Nm4 @495652
// ============================================

// ORIGINAL (for source lookup):
var Nm4 = "</system-reminder>";
// ... inside the search-index builder aqz:
let q = $, K = q.indexOf("<system-reminder>");
while (K >= 0) {
  let _ = q.indexOf(Nm4, K);
  if (_ < 0) break;
  ((q = q.slice(0, K) + q.slice(_ + Nm4.length)), (K = q.indexOf("<system-reminder>")));
}
return q;

// READABLE (for understanding):
const SYSTEM_REMINDER_CLOSE = "</system-reminder>";
let searchable = built, open = searchable.indexOf("<system-reminder>");
while (open >= 0) {
  const close = searchable.indexOf(SYSTEM_REMINDER_CLOSE, open);
  if (close < 0) break;
  searchable = searchable.slice(0, open) + searchable.slice(close + SYSTEM_REMINDER_CLOSE.length);
  open = searchable.indexOf("<system-reminder>");
}
return searchable;

// Mapping: Nm4→SYSTEM_REMINDER_CLOSE, aqz tail→search-index strip-all; q→searchable, K→open, _→close
```

```typescript
// v2.1.88 (src/utils/transcriptSearch.ts:117-127): the same indexOf/while-loop using SYSTEM_REMINDER_CLOSE.
```

**Match**: Verbatim structural match to the 2.1.88 transcript-search loop. Unlike the regex `OD9` (which substitutes a space and also covers `task-notification`), this variant splices the slice out WITHOUT inserting a space and handles only `<system-reminder>` — it relies on upstream per-type extraction (e.g. the `commandMode !== "task-notification"` guard) to keep task-notifications out. 2.1.156 keeps BOTH strip-all variants (regex `OD9` for previews, indexOf `aqz` for the lowercased search index — cheaper, no regex backtracking on large transcripts).

**Confidence**: HIGH (behavior). **Note**: in 2.1.142 the README documented only the inlined loop; 2.1.156's named `Nm4` const + `aqz` builder are obfuscated relocations of the same logic.

---

## Primitives — ensure-wrap and smoosh (re-wrap region @444371-444402)

### `ensureSystemReminderWrap` (`DQ_`)

```javascript
// ============================================
// ensureSystemReminderWrap - Idempotent final-pass wrap (identity-return when unchanged)
// Location: cli_inner_pretty.js:444371-444382
// ============================================

// ORIGINAL (for source lookup):
function DQ_(H) {
  let $ = H.message.content;
  if (typeof $ === "string") {
    if ($.startsWith("<system-reminder>")) return H;
    return { ...H, message: { ...H.message, content: S0($) } };
  }
  let q = !1,
    K = $.map((_) => { if (_.type === "text" && !_.text.startsWith("<system-reminder>")) return ((q = !0), { ..._, text: S0(_.text) }); return _; });
  return q ? { ...H, message: { ...H.message, content: K } } : H;
}

// READABLE (for understanding):
function ensureSystemReminderWrap(msg) {
  const content = msg.message.content;
  if (typeof content === "string") {
    if (content.startsWith("<system-reminder>")) return msg;
    return { ...msg, message: { ...msg.message, content: wrapInSystemReminder(content) } };
  }
  let changed = false;
  const newContent = content.map((b) => {
    if (b.type === "text" && !b.text.startsWith("<system-reminder>")) { changed = true; return { ...b, text: wrapInSystemReminder(b.text) }; }
    return b;
  });
  return changed ? { ...msg, message: { ...msg.message, content: newContent } } : msg;
}

// Mapping: DQ_→ensureSystemReminderWrap, S0→wrapInSystemReminder, H→msg, $→content, q→changed, K→newContent
```

```typescript
// v2.1.88 (src/utils/messages.ts:1797-1816):
function ensureSystemReminderWrap(msg: UserMessage): UserMessage { ... }
```

**Match**: Line-for-line identical, including the identity-return optimization (same object when nothing changed → preserves referential identity for downstream merges/cache stability). Final-pass safety net so no attachment case that forgot to wrap leaks a raw text block to the model.

**Confidence**: HIGH. **Rename**: 2.1.142 `Az5` → 2.1.156 `DQ_`.

### `smooshSystemReminderSiblings` (`hG4`)

```javascript
// ============================================
// smooshSystemReminderSiblings - Fold SR-text siblings into the last tool_result
// Location: cli_inner_pretty.js:444384-444402
// ============================================

// ORIGINAL (for source lookup):
function hG4(H) {
  return H.map(($) => {
    if ($.type !== "user") return $;
    let q = $.message.content;
    if (!Array.isArray(q)) return $;
    if (!q.some((M) => M.type === "tool_result")) return $;
    let _ = [], z = [];
    for (let M of q) if (M.type === "text" && M.text.startsWith("<system-reminder>")) _.push(M); else z.push(M);
    if (_.length === 0) return $;
    let A = z.findLastIndex((M) => M.type === "tool_result"), Y = z[A], f = Ai6(Y, _);
    if (f === null) return $;
    let O = [...z.slice(0, A), f, ...z.slice(A + 1)];
    return { ...$, message: { ...$.message, content: O } };
  });
}

// READABLE (for understanding):
function smooshSystemReminderSiblings(messages) {
  return messages.map((msg) => {
    if (msg.type !== "user") return msg;
    const content = msg.message.content;
    if (!Array.isArray(content)) return msg;
    if (!content.some((b) => b.type === "tool_result")) return msg;
    const srText = [], kept = [];
    for (const b of content) (b.type === "text" && b.text.startsWith("<system-reminder>")) ? srText.push(b) : kept.push(b);
    if (srText.length === 0) return msg;
    const lastTrIdx = kept.findLastIndex((b) => b.type === "tool_result");
    const smooshed = smooshIntoToolResult(kept[lastTrIdx], srText);
    if (smooshed === null) return msg;
    const newContent = [...kept.slice(0, lastTrIdx), smooshed, ...kept.slice(lastTrIdx + 1)];
    return { ...msg, message: { ...msg.message, content: newContent } };
  });
}

// Mapping: hG4→smooshSystemReminderSiblings, Ai6→smooshIntoToolResult, _→srText, z→kept, A→lastTrIdx, f→smooshed
```

```typescript
// v2.1.88 (src/utils/messages.ts:1835-1873):
function smooshSystemReminderSiblings(messages: (UserMessage | AssistantMessage)[]): (UserMessage | AssistantMessage)[] { ... }
```

**Match**: Identical partition (SR-text vs rest) + `findLast tool_result` + `smooshIntoToolResult` fold. Keeps the API payload as one logical tool_result and stabilizes byte layout across turns (cache friendliness).

**Confidence**: HIGH. **Rename**: 2.1.142 `mq4` → 2.1.156 `hG4`.

### `smooshIntoToolResult` (`Ai6`)

```javascript
// ============================================
// smooshIntoToolResult - The actual fold; null when a tool_reference block forbids it
// Location: cli_inner_pretty.js:444756-444785
// ============================================

// ORIGINAL (for source lookup):
function Ai6(H, $) {
  if ($.length === 0) return H;
  let q = H.content;
  if (Array.isArray(q) && q.some($s)) return null;   // tool_reference constraint → cannot smoosh
  ... // string fast-path then block-coalesce path
}

// READABLE (for understanding):
function smooshIntoToolResult(toolResult, srTextBlocks) {
  if (srTextBlocks.length === 0) return toolResult;
  const content = toolResult.content;
  if (Array.isArray(content) && content.some(isToolReferenceBlock)) return null; // forbidden
  ... // join into string (\n\n separated) OR append/coalesce text blocks
}

// Mapping: Ai6→smooshIntoToolResult, $s→isToolReferenceBlock, H→toolResult, $→srTextBlocks
```

```typescript
// v2.1.88 (src/utils/messages.ts:2534): function smooshIntoToolResult(...) — comment @2524-2531 explains the same tool_reference exclusion.
```

**Match**: Identical fold logic and the `null` short-circuit when a `tool_reference`/beta block is present (predicate `$s`). Returns the joined string fast-path or coalesced text blocks.

**Confidence**: HIGH. **Rename**: 2.1.142 `WR6` → 2.1.156 `Ai6`.

### merge/smoosh driver (`VQ_`)

Drives the smoosh at merge time, gated by Statsig `tengu_chair_sermon` (OFF → legacy string-only fold; ON → universal fold of all non-tool_result blocks into the last tool_result). The gate name is unchanged.

```javascript
// ============================================
// mergeUserMessagesAndToolResults - Statsig-gated smoosh driver
// Location: cli_inner_pretty.js:444787-444803
// ============================================

// ORIGINAL (for source lookup):
function VQ_(H, $) {
  let q = Tx(H);
  if (q?.type !== "tool_result") return [...H, ...$];
  if (!V$("tengu_chair_sermon", !1)) { /* legacy string-only fold */ ... }
  /* universal fold (gated): */ ...
}

// READABLE (for understanding):
function mergeUserMessagesAndToolResults(existing, incoming) {
  const last = lastBlock(existing);
  if (last?.type !== "tool_result") return [...existing, ...incoming];
  if (!feature("tengu_chair_sermon", false)) { /* legacy string-only smoosh */ ... }
  /* universal smoosh of all non-tool_result blocks into last */ ...
}

// Mapping: VQ_→mergeUserMessagesAndToolResults, Ai6→smooshIntoToolResult, Tx→lastBlock, V$→feature, H→existing, $→incoming
```

```typescript
// v2.1.88 (src/utils/messages.ts:2616-2646): "Legacy (ungated) smoosh" vs "Universal smoosh (gated)" — same two-branch logic, same gate.
```

**Match**: Same two-branch logic, same gate name `tengu_chair_sermon`.

**Confidence**: HIGH.

---

## Dispatch — normalizeAttachmentForAPI (`kc6` + `DG4`)

### `normalizeAttachmentForAPI` (`kc6`)

The attachment-type → `UserMessage[]` renderer dispatches in three tiers:

```javascript
// ============================================
// normalizeAttachmentForAPI - 3-tier dispatch: swarm early-exit → DG4 map → switch
// Location: cli_inner_pretty.js:445425-445808
// ============================================

// ORIGINAL (for source lookup):
function kc6(H) {
  if (R7()) { /* teammate_mailbox / team_context early-exit @445426-445460 */ }
  if (H.type in DG4) return DG4[H.type](H);                 // @445461 per-type renderer map
  switch (H.type) { /* file, todo_reminder, task_reminder, ... @445462-445790 */ }
  if ([/* noop allow-list */].includes(H.type)) return [];  // @445791-445806
  return (em("normalizeAttachmentForAPI", Error("Unknown attachment type")), []);  // @445808
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
  if (isAgentSwarmsEnabled()) { /* teammate_mailbox / team_context */ }
  if (attachment.type in PER_TYPE_RENDERERS) return PER_TYPE_RENDERERS[attachment.type](attachment);
  switch (attachment.type) { /* complex multi-branch cases */ }
  if (NOOP_ATTACHMENT_TYPES.includes(attachment.type)) return [];
  return (logError("normalizeAttachmentForAPI", new Error("Unknown attachment type")), []);
}

// Mapping: kc6→normalizeAttachmentForAPI, DG4→PER_TYPE_RENDERERS, R7→isAgentSwarmsEnabled, em→logError, H→attachment
```

```typescript
// v2.1.88 (src/utils/messages.ts:3453): export function normalizeAttachmentForAPI(attachment) {
//   isAgentSwarmsEnabled early exit (teammate_mailbox/team_context) → inline renderer object → switch
// }
```

**Match**: Same 3-tier shape as 2.1.88 (agent-swarm early exit, then per-type renderer object, then switch). The case bodies for shared types match. Verified switch-case anchors: `todo_reminder`@445511, `task_reminder`@445524, `relevant_memories`@445538, `task_status`@445635, `deferred_tools_delta`@445673, `memory_update`@445768, `verify_plan_reminder`@445786 (all confirmed by grep within 445400-445900).

**Confidence**: HIGH for shared cases; case set was EXPANDED in 2.1.156 (`ultra_effort_*`, `workflow_keyword_request`, `pen_mode_*`) with no 2.1.88 counterpart → those are LOW. **Rename**: 2.1.142 `CI6` → 2.1.156 `kc6`.

### per-type renderer map (`DG4`)

The simple-case renderer object, split out as a top-level const (in 2.1.88 it was an inline object inside `normalizeAttachmentForAPI`). Members verified at 446557-446767: `directory`, `edited_text_file`, `compact_file_reference`, `pdf_reference`, `selected_lines_in_ide`, `opened_file_in_ide`, `plan_file_reference`, `nested_memory`, `agent_mention`, `skill_listing`, `output_style`, `critical_system_reminder`, `plan_mode_exit`, `auto_mode_exit`, `token_usage`, `budget_usd`, `output_token_usage`, `hook_blocking_error`/`hook_additional_context`/`hook_stopped_continuation`, `date_change`, `ultrathink_effort`, `workflow_keyword_request` (NEW), `ultra_effort_enter`/`ultra_effort_exit` (NEW), plus a block of `()=>[]` no-ops.

**Confidence**: HIGH for shared cases; MEDIUM/LOW for 2.1.156-new members. **Rename**: 2.1.142 `Tq4` → 2.1.156 `DG4`.

---

## collectAttachments master gate (`Aw4`)

```javascript
// ============================================
// getAttachmentMessages - Master gate + parallel generator pool (1s abort budget)
// Location: cli_inner_pretty.js:412660-412738 (gate @412662)
// ============================================

// ORIGINAL (for source lookup):
async function Aw4(H, $, q, K, _, z, A) {
  let Y = Bf($.options.mainLoopModel);
  if (xH(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || xH(process.env.CLAUDE_CODE_SIMPLE)) return gV$(K, Y);  // MASTER GATE
  let f = C4(), O = setTimeout((Z) => Z.abort(), 1000, f), ...   // 1s abort budget
  let j = !$.agentId;  // main-agent-only flag
  ... Promise.all([Promise.all(alwaysRun), Promise.all(mainOnly)]) ...
}

// READABLE (for understanding):
async function getAttachmentMessages(hasUserInput, ctx, ..., queuedCommands, messages, ...) {
  const model = resolveModel(ctx.options.mainLoopModel);
  if (isEnvTruthy(env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || isEnvTruthy(env.CLAUDE_CODE_SIMPLE))
    return getQueuedCommandAttachments(queuedCommands, model);  // only queued commands survive
  const abortController = newAbortController();
  const timer = setTimeout((c) => c.abort(), 1000, abortController);  // cap generator latency at 1s
  const isMainAgent = !ctx.agentId;  // IDE/diagnostics/token/memory_update run only for main agent
  ... await Promise.all([Promise.all(alwaysRunGenerators), Promise.all(mainOnlyGenerators)]) ...
}

// Mapping: Aw4→getAttachmentMessages, gV$→getQueuedCommandAttachments, xH→isEnvTruthy, K→queuedCommands, j→isMainAgent
```

```typescript
// v2.1.88 (src/utils/attachments.ts:2937 getAttachmentMessages; gate @752-761):
//   if (disabled) return getQueuedCommandAttachments(queuedCommands)  // comment @756-759 explains why queued survive
```

**Match**: Same master gate (when `CLAUDE_CODE_DISABLE_ATTACHMENTS` or `CLAUDE_CODE_SIMPLE` truthy → return ONLY queued-command attachments), same parallel-pool design, same 1s abort budget, same main-agent-only carve-out (`j = !$.agentId`). 2.1.88's comment at attachments.ts:756-759 explains why queued commands survive the gate (coworker/`--bare` depends on task-notification delivery).

**Confidence**: HIGH. Generator set EXPANDED in 2.1.156 (new `workflow_keyword_request`, `ultra_effort_enter` behind `NZ()`). **Note**: the OTHER env-gate at @240488 is `isAgentListInMessagesEnabled` (agent-listing only) — NOT this master gate; do not conflate.

### Generator type bindings — verified by call-site label

The obfuscated generator → readable attachment-type mapping is **not inferred from function bodies**; it is fixed at the registration site, where each generator is wrapped as `E3("<attachment-type>", () => generator(...))` (first string arg = the type/telemetry label). The bindings most relevant to the slimming analysis were re-verified by grep against the bundle:

- `E3("teammate_mailbox", … hR_($))` @412703 → `hR_`@413856 (`if (!R7()) return []; return []` — both branches `[]`)
- `E3("output_token_usage", … IR_())` @412731 → `IR_`@413877 (`return []` unconditional)
- `E3("verify_plan_reminder", … bR_(_, $))` @412732 → `bR_`@413895 (`return []` unconditional)
- `E3("auto_mode", () => HR_(_, $))` @412700, `E3("plan_mode", () => eS_(...))` @412698, `E3("todo_reminders", () => (OD() ? NR_ : vR_)(...))` @412702 — active generators.

This closes the one inference gap in the catalogue: the "neutered generator" claims rest on the call-site label (binding) **and** the generator-body `return []` (behaviour), both confirmed in source — not on body-shape guessing.

---

## Threshold constants (@414013-414019)

```javascript
// ============================================
// Reminder cadence threshold constants
// Location: cli_inner_pretty.js:414014-414018
// ============================================

// ORIGINAL (for source lookup):
QV$ = { TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 },                  // @414014
lg6 = { TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 },  // @414015
Kw4 = { TURNS_BETWEEN_MAINTENANCE: 10 },                                       // @414016 (NEW)
_w4 = { MAX_SESSION_BYTES: 61440 },                                           // @414017 (NEW)
zw4 = { TURNS_BETWEEN_REMINDERS: 10 };                                         // @414018

// READABLE (for understanding):
TODO_REMINDER_CONFIG          = { TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 };
PLAN_MODE_ATTACHMENT_CONFIG   = { TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 };
ULTRA_EFFORT_CONFIG           = { TURNS_BETWEEN_MAINTENANCE: 10 };  // NEW (Ultracode)
RELEVANT_MEMORIES_CONFIG      = { MAX_SESSION_BYTES: 61440 };       // NEW (60 KB)
VERIFY_PLAN_REMINDER_CONFIG   = { TURNS_BETWEEN_REMINDERS: 10 };

// Mapping: QV$→TODO_REMINDER_CONFIG, lg6→PLAN_MODE_ATTACHMENT_CONFIG, Kw4→ULTRA_EFFORT_CONFIG, _w4→RELEVANT_MEMORIES_CONFIG, zw4→VERIFY_PLAN_REMINDER_CONFIG
```

Readable names confirmed via the module's `__esModule` export block @412650-412659.

- **`QV$` (TODO_REMINDER_CONFIG)** ↔ 2.1.88 `REMINDER_THRESHOLDS` `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`. Values unchanged. **Rename**: 2.1.142 `aO8` → 2.1.156 `QV$`. Confidence HIGH.
- **`lg6` (PLAN_MODE_ATTACHMENT_CONFIG)** ↔ `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`. Values unchanged. **Rename**: 2.1.142 `Is7` → 2.1.156 `lg6`. **Structural diff**: 2.1.142 listed TWO configs at this region (`Is7` plan + `Ss7` auto); 2.1.156 has ONE (`lg6`) — auto-mode no longer has its own cadence config (auto_mode is now emitted once per session, no cadence — see `auto_mode` rewrite below). Confidence HIGH.
- **`zw4` (VERIFY_PLAN_REMINDER_CONFIG)** `{TURNS_BETWEEN_REMINDERS:10}`. The 2.1.142 `zw4`-*shape* was the `MEMORY_REMINDER_THRESHOLD`/`B65` bucket; in 2.1.156 this shape is repurposed for verify-plan cadence. Confidence MEDIUM (repurposed; the generator `bR_` hard-returns `[]`, so this config is effectively unused — see verify_plan below).
- **`Kw4` (ULTRA_EFFORT_CONFIG)** and **`_w4` (RELEVANT_MEMORIES_CONFIG, 61440 = 60 KB)** — NEW in 2.1.156 (Ultracode + relevant-memories session budget). No 2.1.88 counterpart. Confidence LOW (existence verified, but no baseline to cross-check semantics).

---

## Reminder-emitting helpers — dual-gate cadence

### `getTodoReminderAttachment` (`vR_`)

```javascript
// ============================================
// getTodoReminderAttachment - Dual-gate todo nudge (fires at 10-AND-10)
// Location: cli_inner_pretty.js:413741-413752
// ============================================

// ORIGINAL (for source lookup):
async function vR_(H, $) {
  if (!$.options.tools.some((_) => h1(_, mv))) return [];            // TodoWrite must be present
  if (XG8 && $.options.tools.some((_) => h1(_, XG8))) return [];      // suppressed when Brief tool active
  if (!H || H.length === 0) return [];
  let { turnsSinceLastTodoWrite: q, turnsSinceLastReminder: K } = VR_(H);
  if (q >= QV$.TURNS_SINCE_WRITE && K >= QV$.TURNS_BETWEEN_REMINDERS) {  // DUAL GATE @413746
    let _ = $.agentId ?? E$(), A = $.getAppState().todos[_] ?? [];
    return [{ type: "todo_reminder", content: A, itemCount: A.length }];
  }
  return [];
}

// READABLE (for understanding):
async function getTodoReminderAttachment(messages, ctx) {
  if (!ctx.options.tools.some((t) => isTool(t, TodoWriteTool))) return [];
  if (BRIEF_TOOL_NAME && ctx.options.tools.some((t) => isTool(t, BRIEF_TOOL_NAME))) return [];
  if (!messages || messages.length === 0) return [];
  const { turnsSinceLastTodoWrite, turnsSinceLastReminder } = countTodoTurns(messages);
  if (turnsSinceLastTodoWrite >= TODO_REMINDER_CONFIG.TURNS_SINCE_WRITE &&
      turnsSinceLastReminder   >= TODO_REMINDER_CONFIG.TURNS_BETWEEN_REMINDERS) {
    const agentId = ctx.agentId ?? defaultAgentId();
    const todos = ctx.getAppState().todos[agentId] ?? [];
    return [{ type: "todo_reminder", content: todos, itemCount: todos.length }];
  }
  return [];
}

// Mapping: vR_→getTodoReminderAttachment, VR_→countTodoTurns, h1→isTool, mv→TodoWriteTool, XG8→BRIEF_TOOL_NAME, QV$→TODO_REMINDER_CONFIG
```

```typescript
// v2.1.88 (src/utils/attachments.ts): getTodoReminderAttachment with the same `>= && >=` dual gate.
```

**Match**: Same dual-gate logic. **Rename**: 2.1.142 `Vq5` → 2.1.156 `vR_`. Confidence HIGH.

### `getTaskReminderAttachment` (`NR_`)

```javascript
// ============================================
// getTaskReminderAttachment - Dual-gate task nudge (TaskList feature-gated)
// Location: cli_inner_pretty.js:413776-413787
// ============================================

// ORIGINAL (for source lookup):
async function NR_(H, $) {
  if (!OD()) return [];                                              // TaskList feature gate
  if (XG8 && $.options.tools.some((_) => h1(_, XG8))) return [];
  if (!$.options.tools.some((_) => h1(_, rT))) return [];            // TaskUpdate must be present
  if (!H || H.length === 0) return [];
  let { turnsSinceLastTaskManagement: q, turnsSinceLastReminder: K } = kR_(H);
  if (q >= QV$.TURNS_SINCE_WRITE && K >= QV$.TURNS_BETWEEN_REMINDERS) {  // SAME DUAL GATE @413782
    let _ = await OE(ah());
    return [{ type: "task_reminder", content: _, itemCount: _.length }];
  }
  return [];
}

// READABLE (for understanding):
async function getTaskReminderAttachment(messages, ctx) {
  if (!isTaskListEnabled()) return [];
  if (BRIEF_TOOL_NAME && ctx.options.tools.some((t) => isTool(t, BRIEF_TOOL_NAME))) return [];
  if (!ctx.options.tools.some((t) => isTool(t, TaskUpdateTool))) return [];
  if (!messages || messages.length === 0) return [];
  const { turnsSinceLastTaskManagement, turnsSinceLastReminder } = countTaskTurns(messages);
  if (turnsSinceLastTaskManagement >= TODO_REMINDER_CONFIG.TURNS_SINCE_WRITE &&
      turnsSinceLastReminder        >= TODO_REMINDER_CONFIG.TURNS_BETWEEN_REMINDERS) {
    const tasks = await loadTasks(currentTaskList());
    return [{ type: "task_reminder", content: tasks, itemCount: tasks.length }];
  }
  return [];
}

// Mapping: NR_→getTaskReminderAttachment, kR_→countTaskTurns, OD→isTaskListEnabled, rT→TaskUpdateTool, QV$→TODO_REMINDER_CONFIG
```

**Dual-gate insight (deep)**: Both helpers fire ONLY when `turnsSinceLastWrite >= 10 AND turnsSinceLastReminder >= 10` (logical AND). This is the anti-nag mechanism: a model that *ignored* a prior reminder still waits a full 10-turn window before being prodded again, so a stale-todo model is not spammed every turn. The counters are computed by walking the message tail (`VR_` for todos, `kR_`@413753 for tasks — the latter finds the last TaskCreate/TaskUpdate tool_use AND the last `task_reminder` attachment). Both reminders share the same `QV$` config.

**Match**: Same dual gate, same values. **Rename**: 2.1.142 `kq5` → 2.1.156 `NR_`. Confidence HIGH.

---

## Inline reminder strings

Cross-validated by string byte-match against the 2.1.88 source. (See `41_system_reminder/` companion docs for the full verbatim catalogue; here only the cross-version verdict + anchor is given.)

| # | Reminder | 2.1.156 anchor | 2.1.88 counterpart | Confidence | Verdict |
|---|----------|----------------|--------------------|-----------|---------|
| 1 | Read empty-file warning | 422944 | FileReadTool.ts:706 | HIGH | UNCHANGED (byte-identical) |
| 2 | Read short-file (offset past EOF) | 422945 | FileReadTool.ts:707 | HIGH | UNCHANGED |
| 3 | Per-Read malware `CYBER_RISK_MITIGATION_REMINDER` | — (REMOVED) | FileReadTool.ts:729-730 | HIGH | **REMOVED** (grep "malware"=0) |
| 4 | `CYBER_RISK_INSTRUCTION` system-prompt clause | 555397-555398 | cyberRiskInstruction.ts:24 | HIGH | UNCHANGED (distinct, survives) |
| 5 | gh GitHub rate-limit | 269428 | none | LOW | **NEW** (post-2.1.88) |
| 6 | Side-question prompt | 454123-454138 | sideQuestion.ts:61-76 | HIGH | UNCHANGED (byte-identical) |
| 7 | Container-restart | 623996-624002 | none | LOW | **NEW** |
| 8 | Brief-mode toggle | 527818-527820 | commands/brief.ts:114-118 | HIGH | UNCHANGED |
| 9 | Ultraplan single-agent | 503303 | none (string) | LOW | **NEW** (string) |
| 10 | Ultraplan + mermaid | 503324 | none (string) | LOW | **NEW** (string) |
| 11 | Ultraplan multi-agent | 503348 | none (string) | LOW | **NEW** (string) |
| 12 | CLAUDE.md session-start context block | 556130-556139 | utils/api.ts:463-469 | HIGH | UNCHANGED |
| 13 | Stale-memory / memory-age marker | 221258-221269 / 422935 | memdir/memoryAge.ts:33-53 | HIGH | UNCHANGED |
| 14 | SR-convention clause (`# System`/`gXz`) | 555453 | prompts.ts:190 | HIGH | UNCHANGED (byte-identical) |
| 15 | SR-convention + hooks (`# Harness`/`oXz`) | 555604 | prompts.ts (combined) | MEDIUM | NEW/REWORDED (hooks-aware bullet) |
| 16 | Auto-memory SR clauses | 144507, 144564 | memory prompt strings | MEDIUM | UNCHANGED/REWORDED |
| 17 | Team shutdown (print mode) | 642102-642114 | print path | HIGH | UNCHANGED/RELOCATED |
| 18 | Thinking-reminder clause + attachment | — (gone) / 445800 noop | prompts (thinking clause) | HIGH | **REMOVED** (both surfaces) |

### Two headline inline strings (verified verbatim)

**CLAUDE.md session-start block (`KV8`@556126):**

```javascript
// ============================================
// CLAUDE.md session-start context block (prepended once, isMeta)
// Location: cli_inner_pretty.js:556130-556139
// ============================================

// ORIGINAL (for source lookup):
T8({
  content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries($).map(([q, K]) => `# ${q}\n${K}`).join(`\n`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`, isMeta: !0,
})

// READABLE (for understanding):
createUserMessage({
  content: `<system-reminder>\nAs you answer the user's questions, you can use the following context:\n${entries}\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.\n</system-reminder>\n`,
  isMeta: true,
})

// Mapping: KV8→buildStaticContextMessage, T8→createUserMessage, $→contextEntries
```

```typescript
// v2.1.88 (src/utils/api.ts:463-469): same block — byte-identical including the 6-space-indented IMPORTANT line.
```

**Match**: Byte-identical. **Rename**: 2.1.142 `EO8`@524243 → 2.1.156 `KV8`@556126. Confidence HIGH.

**SR-convention system-prompt clause (`gXz`@555449):**

```javascript
// ============================================
// SR-convention teaching clause (# System builder)
// Location: cli_inner_pretty.js:555453
// ============================================

// ORIGINAL (for source lookup):
"Tool results and user messages may include <system-reminder> or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear.",

// READABLE (for understanding):
// (3rd element of the # System section array in gXz; same literal string)

// Mapping: gXz→buildSystemSection
```

```typescript
// v2.1.88 (src/constants/prompts.ts:190): byte-identical sentence.
```

**Match**: Byte-identical. (2.1.88 also carries an older/longer variant at prompts.ts:132; 2.1.156 uses the shorter `:190` phrasing.) **Rename of location ref**: 2.1.142 cited L523574 → 2.1.156 L555453. Confidence HIGH.

---

## Slimming facts — confirmed cross-version

### Per-Read malware reminder FULLY REMOVED

The 2.1.88 `CYBER_RISK_MITIGATION_REMINDER` (`FileReadTool.ts:729-730`), appended to EVERY non-empty `text` Read result via `shouldIncludeFileReadMitigation()`, is **gone** in 2.1.156. Verified: `grep -ci "considered malware|refuse to improve or augment|CYBER_RISK_MITIGATION" = 0` over the full 649,979-line bundle. The Read content-builder at `cli_inner_pretty.js:422933-422940` has no mitigation arm — only the memory-freshness prefix `K`, `formatFileLines`, and the line-format instruction.

The **distinct** `CYBER_RISK_INSTRUCTION` system-prompt clause (`gKq`@555397-555398, ↔ 2.1.88 `cyberRiskInstruction.ts:24`) is a different thing about authorized security testing and is STILL PRESENT and byte-identical. Removing the per-Read reminder did not touch it.

### todo_reminder / task_reminder dropped the "NEVER mention" tail

```javascript
// ============================================
// todo_reminder text - "NEVER mention this reminder" sentence DROPPED
// Location: cli_inner_pretty.js:445514 (todo), :445528 (task)
// ============================================

// ORIGINAL 2.1.156 (verified — ends with "ignore if not applicable." then newline; NO trailing sentence):
K = `The TodoWrite tool hasn't been used recently. ... This is just a gentle reminder - ignore if not applicable.
`;
```

```typescript
// v2.1.88 (src/utils/messages.ts:3668 todo / :3688 task) — verified to END with the removed sentence:
let message = `The TodoWrite tool hasn't been used recently. ... This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user\n`
```

**Match**: Body identical except 2.1.156 dropped the trailing `Make sure that you NEVER mention this reminder to the user` sentence in BOTH reminders. The list-rendering format (`${i+1}. [${status}] ${content}` for todos, `#${id}. [${status}] ${subject}` for tasks) is unchanged. **Rationale**: the global SR convention (clause #14) + the centralized `yT8` ambient-context trailer make the per-reminder "don't mention" sentence redundant. Confidence HIGH.

---

## NEW subsystem (no 2.1.88 counterpart) — mid-conversation `role:"system"` fallback

This is the single largest 2.1.156 addition in the reminder subsystem. The 2.1.88 baseline has NO `api_system` message type, NO `mid-conversation-system` beta, and NO `[mid-conv-system]` fallback. Confidence LOW per-symbol (nothing to cross-validate against) but HIGH that it is genuinely new.

- `makeApiSystemMessage` (`SQ_`@445274-445281) — builds `{ type:"api_system", message:{ role:"system", content } }`. No 2.1.88 equivalent.
- `extractReminderBodiesForApiSystem` (`RQ_`@445282-445298) — unwraps reminder text (via `fi6`) for re-emission as `role:"system"` content. No 2.1.88 equivalent.
- normalizer `D0`@444461 + flush helper `w()`@444492 — the dual-representation switch: same `w()` emits either `SQ_(text)` (real system message) OR `T8({content: S0(text), isMeta:!0})` (in-band fallback) depending on context. When `D0` is called without a model arg, reminders ALWAYS take the in-band `S0`-wrapped path.
- gate constant `_h`@98142 (`mid-conversation-system-2026-04-07`), capability check `XH8`@130520, dispatch dual-build @557037-557043, rejection detector `xP6`@186567, sticky-reject `aI$`@1938, fallback handler @557428 (`tengu_mid_conv_system_fallback_retry`).

**Telemetry side-effect (verified)**: the telemetry split `formatMessagesForContext` (`Uc5`@271459-271492) gained a NEW first branch `if (K.type === "api_system") { systemReminders.push(K.message.content); continue; }` that the 2.1.88 `formatMessagesForContext` (`betaSessionTracing.ts:166-208`) does not have — so a reminder delivered as a real `role:"system"` message still lands in the `systemReminders` bucket, not `contextParts`. This is EXTENDED (rest of the split is 1:1 with 2.1.88).

```javascript
// ============================================
// [mid-conv-system] rejection fallback — sticky-reject the beta, swap to in-band wrap
// Location: cli_inner_pretty.js:557428-557438
// ============================================

// ORIGINAL (for source lookup):
if (B && xP6(m8)) {
  if (((M = M.filter((C6) => C6 !== _h)), (b = B), (B = null), _h)) aI$(I, _h);
  return (
    N('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact', { level: "warn" }),
    d("tengu_mid_conv_system_fallback_retry", {}),
    "retry:mid-conv-system"
  );
}

// READABLE (for understanding):
if (fallbackVariant && isMidConvSystemRejection(error)) {
  betaList = betaList.filter((b) => b !== MID_CONV_SYSTEM_BETA);
  request = fallbackVariant; fallbackVariant = null;
  if (MID_CONV_SYSTEM_BETA) stickyRejectBeta(stickyBetaState, MID_CONV_SYSTEM_BETA);
  logWarn('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact');
  telemetry("tengu_mid_conv_system_fallback_retry", {});
  return "retry:mid-conv-system";
}

// Mapping: xP6→isMidConvSystemRejection, _h→MID_CONV_SYSTEM_BETA, aI$→stickyRejectBeta, B→fallbackVariant, b→request
```

**Design insight**: the harness optimistically tries the cleaner `role:"system"` delivery on supporting models, but pre-computes the in-band `<system-reminder>` fallback BEFORE sending (the `B` variant). A 400 rejection costs only one retry, not a re-plan. The rejection is *sticky* (`aI$` adds to `.rejected`) so the harness stops retrying the beta for the session until `/clear` or `/compact` resets it — protecting the prompt cache from a flapping beta that would reshape the message array every turn.

---

## Notable 2.1.142 → 2.1.156 behavioral deltas (beyond renames)

These are not symbol renames but semantic changes the writer should surface:

- **`auto_mode` collapsed**: 2.1.142 had a full/sparse/once tri-state selector with its own cadence config. 2.1.156 emits ONE short prose `## Auto Mode Active` message once per session (generator `HR_`@412889) — the 6-point numbered body (incl. destructive-action + data-exfiltration safety points) was dropped. This is why only `lg6` (plan) survives at the threshold region and the 2.1.142 `Ss7` auto-config is gone.
- **`verify_plan_reminder` dead**: generator `bR_`@413895 hard-returns `[]`; the renderer case @445786 survives but is unreachable. (Renders Agent tool, not Skill; tool name `""` via dead-code elimination — same as 2.1.88's env-gated `''`.) So `zw4` (VERIFY_PLAN_REMINDER_CONFIG) is effectively unused.
- **`thinking_reminder` fully removed**: both the system-prompt clause ("respond without a thinking block / tune your thinking frequency", grep=0) and the attachment render (noop at @445800) are gone — parallel slimming to the malware-reminder removal.
- **`yT8` centralization**: the per-reminder ambient-context trailer is now a shared const (@446489) appended to `deferred_tools_delta` / `agent_listing_delta` / `mcp_instructions_delta` / `memory_update` removed-branches, replacing per-string "do not mention" sentences.
- **Generators neutered**: `teammate_mailbox` (`hR_`@413856 returns `[]`), `output_token_usage` (`IR_`@413877 returns `[]`), `token_usage` (`RR_`@413871 env-gated) — render cases retained, emission disabled in default builds.
- **`context_efficiency` hard-noop**: 2.1.88's `feature('HISTORY_SNIP')`/`SNIP_NUDGE_TEXT` branch removed; 2.1.156 is a bare `return []`.
- **`deferred_tools_delta` expanded**: 2.1.88 had 2 sections; 2.1.156 has 4 (added/readded/removed/pending) with `$qH=30` truncation and the expanded "schemas NOT loaded … InputValidationError … select:<name>" added-text.

---

## Confidence summary

| Symbol type | Count | HIGH | MEDIUM | LOW |
|-------------|------:|-----:|-------:|----:|
| Primitive helpers (wrap/strip/extract/ensure/smoosh) | 11 | 11 | 0 | 0 |
| Dispatch (`kc6`/`DG4`, shared cases) | 2 | 2 | 0 | 0 |
| Master gate + generator pool (`Aw4`/`E3`/`gV$`) | 3 | 3 | 0 | 0 |
| Threshold constants | 5 | 2 | 1 | 2 |
| Emitter helpers (`vR_`/`NR_`) | 2 | 2 | 0 | 0 |
| Telemetry / UI suppression (`Uc5`/`iv7`/`d7z`/`Ce6`) | 4 | 4 | 0 | 0 |
| Inline reminder strings | 18 | 9 | 3 | 6 |
| Mid-conv-system (NEW, no baseline) | 8 | 0 | 0 | 8 |
| **Total** | **53** | **33** | **4** | **16** |

The 16 LOW entries are all symbols with NO 2.1.88 counterpart (the entire mid-conv-system subsystem, two new threshold configs, the gh-rate-limit / container-restart / three ultraplan strings) — they are "new in 2.1.156", verified to exist in the bundle but cannot be cross-validated against the 2.1.88 baseline. The 4 MEDIUM entries are the repurposed `zw4` config and the reworded/auto-memory system-prompt clauses. The 33 HIGH entries are byte-identical or line-for-line matches against the 2.1.88 readable source.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions cross-validated in this document:
- `wrapInSystemReminder` (`S0`), `wrapMessagesInSystemReminder` (`C_`), `createUserMessage` (`T8`) - wrap primitives
- `extractSystemReminderContent` (`fi6`/`JN6`) - extract primitives (original-returning / null-returning)
- `stripSystemReminders` (`PG4`), `stripAllReminders` (`OD9`), `SYSTEM_REMINDER_CLOSE` (`Nm4`) - strip primitives
- `ensureSystemReminderWrap` (`DQ_`), `smooshSystemReminderSiblings` (`hG4`), `smooshIntoToolResult` (`Ai6`) - re-wrap/smoosh
- `normalizeAttachmentForAPI` (`kc6`), per-type renderer map (`DG4`) - dispatcher
- `getAttachmentMessages` (`Aw4`), `getQueuedCommandAttachments` (`gV$`) - collect gate
- `getTodoReminderAttachment` (`vR_`), `getTaskReminderAttachment` (`NR_`) - dual-gate emitters
- `makeApiSystemMessage` (`SQ_`), `formatMessagesForContext` (`Uc5`) - mid-conv-system + telemetry split

This document validates every symbol introduced in the 2.1.156 `41_system_reminder/` module docs (`README.md`, `attachment_catalogue.md`, and companions) against the v2.1.88 TypeScript reference.
