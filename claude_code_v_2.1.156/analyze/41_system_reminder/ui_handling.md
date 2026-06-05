# UI Handling — Why the User Doesn't See Reminders (v2.1.156)

> How the UI layer detects and suppresses `<system-reminder>` content across the renderer, transcript search, sticky-prompt indicator, message selector, copy/paste path, activity-log preview, and `/resume` reload — in Claude Code **2.1.156**.
>
> PRIMARY bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines). Every line citation below was re-verified by Read/grep against this exact file — line numbers are NOT carried over from 2.1.142; obfuscated names and line numbers both differ.
> TS baseline (cross-validation by readable name only): `/lyz/codespace/3rd/claude-code/src` (2.1.88).

## The contract

A `<system-reminder>…</system-reminder>` text block reaches the model unchanged but is **invisible to the user** under all normal viewing surfaces. The reminder is *not* sent on a separate wire channel — it rides inside the body of a user-role `message.content`. That single text payload must therefore serve three audiences (model / UI / telemetry) without divergence. Three cooperating mechanisms enforce the "model sees it, user doesn't" contract:

1. **The `isMeta` flag** on the carrier `UserMessage` excludes the whole message from the transcript render, the sticky-prompt walk, the message selector, and the human-prompt scanners.
2. **Per-surface strip helpers** (`stripLeadingReminders` `PG4`, `stripAllReminders` `OD9`, the indexOf strip loop inside the search-index builder `aqz`) cleanse any text the user *would* see (sticky prompt, search hits, activity previews) even if a reminder leaked into a non-meta block.
3. **Per-surface predicates** (synthetic-blocklist `lSH`, navigable predicate `wq$`, human-prompt scanners) drop reminder-bearing or harness-chrome messages from interactive listings (jump-to-message, message selector, queued-command preview).

Why a flag and not a separate channel is examined in detail at the end of this document — but the short version: the reminder must reach the model *as part of the conversation* (so the model attends to it in context), while staying out of the user's view, and must do so **without mutating the cached prompt prefix**. A boolean that rides with the message identity through merges/splits/resumes is the cheapest way to satisfy all three.

## The `isMeta` flag — primary suppression

### Source of the flag — `makeUserMessage` (`T8`)

The user-message factory carries `isMeta` and `isVisibleInTranscriptOnly` as top-level booleans on every user message. Every attachment-origin reminder is created with `isMeta: true`.

```javascript
// ============================================
// makeUserMessage - User-message factory carrying isMeta / isVisibleInTranscriptOnly
// Location: cli_inner_pretty.js:443846-443883
// ============================================

// ORIGINAL (for source lookup):
function T8({ content: H, isMeta: $, isVisibleInTranscriptOnly: q, isVirtual: K, isCompactSummary: _, summarizeMetadata: z, toolUseResult: A, mcpMeta: Y, uuid: f, timestamp: O, imagePasteIds: M, sourceToolAssistantUUID: j, permissionMode: w, origin: D, interruptedMessageId: J, now: X, uuidFn: L }) {
  return { type: "user", message: { role: "user", content: H || IT }, isMeta: $, isVisibleInTranscriptOnly: q, isVirtual: K, isCompactSummary: _, summarizeMetadata: z, uuid: f || (L ? L() : Wk.randomUUID()), timestamp: O ?? (X ? X() : new Date().toISOString()), toolUseResult: A, mcpMeta: Y, imagePasteIds: M, sourceToolAssistantUUID: j, permissionMode: w, origin: D, interruptedMessageId: J };
}

// READABLE (for understanding):
function makeUserMessage({ content, isMeta, isVisibleInTranscriptOnly, isVirtual, isCompactSummary, summarizeMetadata, toolUseResult, mcpMeta, uuid, timestamp, imagePasteIds, sourceToolAssistantUUID, permissionMode, origin, interruptedMessageId, now, uuidFn }) {
  return {
    type: "user",
    message: { role: "user", content: content || EMPTY_CONTENT },   // EMPTY_CONTENT = IT
    isMeta,                          // ◄── primary UI-suppression flag
    isVisibleInTranscriptOnly,       // ◄── shown only in ctrl+o debug view
    isVirtual, isCompactSummary, summarizeMetadata,
    uuid: uuid || (uuidFn ? uuidFn() : crypto.randomUUID()),
    timestamp: timestamp ?? (now ? now() : new Date().toISOString()),
    toolUseResult, mcpMeta, imagePasteIds, sourceToolAssistantUUID,
    permissionMode, origin, interruptedMessageId
  };
}

// Mapping: T8→makeUserMessage, H→content, $→isMeta, q→isVisibleInTranscriptOnly, IT→EMPTY_CONTENT, Wk→crypto
```

The crucial detail is in the return shape: the message is `{ type:"user", message:{ role:"user", content } }`. The `isMeta` boolean is a sibling of `message`, **not** part of `message` — so it is never serialised into the API request. The model only ever sees `message.content`. `isMeta` exists purely for the harness's own bookkeeping.

**TS counterpart:** the `createUserMessage` factory in `utils/messages.ts` (the `isVisibleInTranscriptOnly` field is declared around `:463/478/509` and threaded at `:811`). Same shape.

**Change classification:** UNCHANGED (structural). Every reminder-bearing attachment message is still built as `makeUserMessage({ content, isMeta:true })`.

**Why a flag and not a `type` check:** A reminder-carrying user message can be *structurally identical* to a real user prompt — same `type:"user"`, same `content:[{type:"text", text:"…"}]`. There is no structural discriminator. The flag is the only stable one, and it survives the merge/smoosh passes that fold reminder text into adjacent `tool_result` blocks.

### `isMeta` / `isVisibleInTranscriptOnly` consumers

`isMeta` is read in ~190 places in the bundle. The load-bearing UI-suppression consumers, all verified for 2.1.156:

- **Sticky-prompt content extractor** `d7z` — `cli_inner_pretty.js:499735`: `if (H.isMeta || H.isVisibleInTranscriptOnly) return null;` (see "Sticky / last-user-prompt leading-strip").
- **Message-selector / navigable predicate** `wq$` — `cli_inner_pretty.js:573401-573402`: `if (lSH(H)) return !1; if (H.isMeta) return !1;` (see "Per-surface predicate filters").
- **Human-prompt scanner** (e.g. queued-prompt walk) — `cli_inner_pretty.js:571656-571663`: rejects `wH.isMeta`, `wH.toolUseResult`, non-human `origin`, and synthetic-blocklist messages.
- **Transcript-search index builder** `aqz` — `cli_inner_pretty.js:495557-495559`: the `queued_command` attachment branch requires `!H.attachment.isMeta` before indexing.

**TS counterpart:** `components/VirtualMessageList.tsx:148` (`if (msg.isMeta || msg.isVisibleInTranscriptOnly) return null;`) and `QueryEngine.ts:579` (`isSynthetic: msg.isMeta || msg.isVisibleInTranscriptOnly`). Same predicate.

**Change classification:** UNCHANGED.

`isVisibleInTranscriptOnly` is a **separate** flag from `isMeta`: it marks messages (notably compact summaries — built with `isCompactSummary:true, isVisibleInTranscriptOnly:true`) that should appear in `ctrl+o` full-transcript/debug mode but *not* in the normal scroll view. The two flags are usually OR'd together at suppression points, but a compact summary is `isVisibleInTranscriptOnly` *without* being `isMeta`, which is why the predicates check both.

## Sticky / last-user-prompt leading-strip

The sticky-prompt UI is the breadcrumb at the top of the screen showing "what the user last actually asked" while scrolled deep into a long transcript. It walks the message list backward asking "what was the user's last real prompt?". Two layers of defence apply: the `isMeta` check rejects the message outright, and `stripLeadingReminders` peels any *embedded leading* reminder.

### `stripLeadingReminders` (`PG4`)

```javascript
// ============================================
// stripLeadingReminders - Peel any leading <system-reminder> blocks off a string
// Location: cli_inner_pretty.js:443733-443741
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
function stripLeadingReminders(text) {
  let rest = text.trimStart();
  while (rest.startsWith("<system-reminder>")) {
    const end = rest.indexOf("</system-reminder>");
    if (end < 0) break;                              // unterminated tag — bail, leave the rest intact
    rest = rest.slice(end + 18).trimStart();         // 18 === "</system-reminder>".length
  }
  return rest;
}

// Mapping: PG4→stripLeadingReminders, H→text, q→rest, K→end, 18→"</system-reminder>".length
```

**TS counterpart:** `stripSystemReminders` at `components/messageActions.tsx:399-408` — byte-for-byte identical logic (`const CLOSE = '</system-reminder>'; … t.slice(end + CLOSE.length).trimStart()`). The literal `18` in the obfuscated build is the inlined `"</system-reminder>".length`.

**Change classification:** UNCHANGED (vs 2.1.88 readable). Obfuscated name `Nq4`(142)→`PG4`(156); line `423281`(142)→`443733`(156).

**Why leading-only (and not regex strip-all here):** A real user prompt never embeds a reminder mid-body — the attachment pipeline always *prepends* reminders (e.g. an auto-memory recall or a mode-reentry attachment that got merged onto a queued user prompt). So the cheap `startsWith`/`indexOf` peel handles every real case the sticky prompt cares about, with no regex backtracking on what can be a very long prompt string. A regex strip-all would be both slower and unnecessary for this surface.

### The sticky-prompt content extractor `d7z` (the sole consumer of `PG4`)

In 2.1.156 `stripLeadingReminders` (`PG4`) is consumed in exactly **one** place — the sticky-prompt extractor `d7z` (verified by `grep -n "PG4("` → only `443733` def and `499753` call).

```javascript
// ============================================
// computeStickyPromptText - Derive the breadcrumb "last real user prompt" text
// Location: cli_inner_pretty.js:499732-499755
// ============================================

// ORIGINAL (for source lookup):
function d7z(H) {
  let $ = null;
  if (H.type === "user") {
    if (H.isMeta || H.isVisibleInTranscriptOnly) return null;
    let K = H.message.content[0];
    if (K?.type !== "text") return null;
    $ = K.text;
  } else if (H.type === "attachment" && H.attachment.type === "queued_command" && H.attachment.commandMode !== "task-notification" && !H.attachment.isMeta) {
    let K = H.attachment.prompt;
    $ = typeof K === "string" ? K : K.flatMap((_) => (_.type === "text" ? [_.text] : [])).join("\n");
  }
  if ($ === null) return null;
  let q = PG4($);
  if (q.startsWith("<") || q === "") return null;
  return q;
}

// READABLE (for understanding):
function computeStickyPromptText(message) {
  let raw = null;
  if (message.type === "user") {
    if (message.isMeta || message.isVisibleInTranscriptOnly) return null;   // ◄── flag suppression
    const block = message.message.content[0];
    if (block?.type !== "text") return null;
    raw = block.text;
  } else if (
    message.type === "attachment" &&
    message.attachment.type === "queued_command" &&
    message.attachment.commandMode !== "task-notification" &&    // task-notifications are inbox, not prompts
    !message.attachment.isMeta                                    // not a synthesised meta command
  ) {
    const p = message.attachment.prompt;
    raw = typeof p === "string" ? p : p.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
  }
  if (raw === null) return null;
  const stripped = stripLeadingReminders(raw);                   // ◄── content strip (defence in depth)
  if (stripped.startsWith("<") || stripped === "") return null;  // still XML chrome or empty → not a prompt
  return stripped;
}

// Mapping: d7z→computeStickyPromptText, H→message, $→raw, K→block/p, q→stripped, PG4→stripLeadingReminders
```

The result is memoized so the StickyTracker can re-invoke it cheaply on every scroll tick:

```javascript
// ============================================
// stickyPromptText - WeakMap-memoized wrapper over computeStickyPromptText
// Location: cli_inner_pretty.js:499726-499731
// ============================================

// ORIGINAL (for source lookup):
function Ce6(H) {
  let $ = up4.get(H);
  if ($ !== void 0) return $;
  let q = d7z(H);
  return (up4.set(H, q), q);
}

// READABLE (for understanding):
function stickyPromptText(message) {
  let cached = promptTextCache.get(message);          // promptTextCache = up4 (WeakMap keyed on message object)
  if (cached !== void 0) return cached;
  const value = computeStickyPromptText(message);
  return (promptTextCache.set(message, value), value);
}

// Mapping: Ce6→stickyPromptText, up4→promptTextCache, d7z→computeStickyPromptText
```

**Consumers of `stickyPromptText` (`Ce6`):** the StickyTracker backward-scan at `cli_inner_pretty.js:499825` (`for (…) if (Ce6(kH[NH]) !== null) return NH;`), and `:499996`, `:500157`.

**TS counterpart (EXACT 1:1):** `computeStickyPromptText` at `components/VirtualMessageList.tsx:145-160`, memoized by `stickyPromptText` at `:133-144` (WeakMap `promptTextCache`). Same `isMeta || isVisibleInTranscriptOnly` guard, same `queued_command`/`commandMode !== 'task-notification'`/`!isMeta` branch, same `stripSystemReminders(raw)`, same post-strip rejection `if (t.startsWith('<') || t === '') return null;`.

**Change classification:** UNCHANGED behavior, RELOCATED (new obfuscated names).

**Why both `isMeta` *and* the leading strip:** The `isMeta` flag is set on the *attachment-origin* envelope, but the merge pass in the API-normaliser can concatenate an SR-prefixed text block into a *non-meta* user message (e.g. when a queued user prompt got merged with an attachment-origin reminder). The flag check handles the envelope; the strip handles that residual in-body case. After stripping, the extra `startsWith("<")` guard rejects anything still beginning with an XML envelope (`<command-message>`, `<bash-stdout>`, etc.) — those are not user prose either. The WeakMap memoization matters because the StickyTracker re-invokes this many times per scroll tick over the same append-only message objects; without the cache every tick would re-allocate fresh strings from the strip.

## Transcript-search strip-all — the indexOf variant inside `aqz`

The transcript search (`/`-search over the conversation) needs a clean, lowercased haystack with zero harness chrome, so a user searching for their own words isn't drowned in reminder boilerplate. The search-index content builder `aqz` constructs a searchable string from each message type, then strips **all** reminder blocks before lowercasing.

```javascript
// ============================================
// buildSearchIndexText - Strip-all <system-reminder> tail of the search-index builder
// Location: cli_inner_pretty.js:495543-495605 (strip loop 495599-495604)
// ============================================

// ORIGINAL (for source lookup):
function aqz(H) {
  let $ = "";
  switch (H.type) { /* user / assistant / attachment(relevant_memories, queued_command) / collapsed_read_search */ }
  let q = $, K = q.indexOf("<system-reminder>");
  while (K >= 0) {
    let _ = q.indexOf(Nm4, K);                         // Nm4 = "</system-reminder>"
    if (_ < 0) break;
    ((q = q.slice(0, K) + q.slice(_ + Nm4.length)), (K = q.indexOf("<system-reminder>")));
  }
  return q;
}

// READABLE (for understanding):
function buildSearchIndexText(message) {
  let text = "";
  switch (message.type) { /* per-type extraction of searchable text */ }
  // Strip EVERY <system-reminder>…</system-reminder> block by repeated indexOf + splice:
  let out = text, open = out.indexOf("<system-reminder>");
  while (open >= 0) {
    const close = out.indexOf(CLOSE_TAG, open);        // CLOSE_TAG = Nm4 = "</system-reminder>"
    if (close < 0) break;                              // unterminated — leave the remainder, bail
    out = out.slice(0, open) + out.slice(close + CLOSE_TAG.length);
    open = out.indexOf("<system-reminder>");
  }
  return out;
}

// Mapping: aqz→buildSearchIndexText, H→message, $/q→text/out, Nm4→CLOSE_TAG, K→open, _→close
```

The close-tag constant is `var Nm4 = "</system-reminder>"` at `cli_inner_pretty.js:495652`. The strip-all loop is at `cli_inner_pretty.js:495599-495604`.

The built string is then lowercased and memoized:

```javascript
// ============================================
// searchableText - Lowercase + WeakMap-memoize the search-index text
// Location: cli_inner_pretty.js:495537-495541
// ============================================

// ORIGINAL (for source lookup):
function _N8(H) { let $ = ym4.get(H); if ($ !== void 0) return $; let q = aqz(H).toLowerCase(); return (ym4.set(H, q), q); }

// READABLE (for understanding):
function searchableText(message) {
  let cached = searchTextCache.get(message);           // searchTextCache = ym4 (WeakMap)
  if (cached !== void 0) return cached;
  const value = buildSearchIndexText(message).toLowerCase();
  return (searchTextCache.set(message, value), value);
}

// Mapping: _N8→searchableText, ym4→searchTextCache, aqz→buildSearchIndexText
```

**TS counterpart:** `utils/transcriptSearch.ts` — the 2.1.88/142 baseline documents this as an inlined `while (open >= 0)` strip loop (`transcriptSearch.ts:117-127`) feeding the search haystack.

**Change classification:** UNCHANGED behavior (strip-all for search), names new.

**Why indexOf-splice and not the regex `OD9` here:** `aqz` runs over the *entire transcript* whenever the index is (re)built, so it favours the allocation-light indexOf/slice splice (no regex compilation, no `[\s\S]*?` backtracking over large bodies). Note `aqz` strips only `<system-reminder>` — *not* `<task-notification>`. That's safe because the per-type extraction already excludes task-notifications upstream (the `queued_command` branch guards on `commandMode !== "task-notification"`), so a second pass for `task-notification` would be dead work. The regex `OD9` variant below covers surfaces where a task-notification *can* be present.

## The regex strip-all `OD9` and the preview normalizer `fn`

```javascript
// ============================================
// stripAllReminders - Regex-strip every <system-reminder>/<task-notification> block
// Location: cli_inner_pretty.js:614580-614582
// ============================================

// ORIGINAL (for source lookup):
function OD9(H) {
  return H.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// READABLE (for understanding):
function stripAllReminders(text) {
  // Replace every <system-reminder>…</system-reminder> OR <task-notification>…</task-notification>
  // block with a single space. The trailing |$ lets an unterminated tag at end-of-string still be nuked.
  return text.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// Mapping: OD9→stripAllReminders, H→text. \1 backreference ties the close tag to the open tag.
```

**TS counterpart:** `utils/transcriptSearch.ts:117-127` (an inlined loop in 2.1.88) — same intent: each named-reminder container becomes a space, with `|$` covering a tag left open at the end of the string.

**Change classification:** UNCHANGED behavior; name `vQ4`(142)→`OD9`(156); line `566114`(142)→`614580`(156).

`OD9` strips only the two *named* reminder containers. For one-line UI previews, that's not enough — the surrounding content may carry *other* XML envelopes too. The preview normalizer `fn` layers a generic tag-strip on top:

```javascript
// ============================================
// previewPlainText - Strip reminders, then any remaining XML tags, then collapse whitespace
// Location: cli_inner_pretty.js:614583-614588
// ============================================

// ORIGINAL (for source lookup):
function fn(H) {
  return OD9(T5(H)).replace(/<\/?[\w-]+>/g, " ").replace(/\s+/g, " ").trim();
}

// READABLE (for understanding):
function previewPlainText(value) {
  return stripAllReminders(coerceToText(value))   // T5 = coerce content → plain string
    .replace(/<\/?[\w-]+>/g, " ")                  // flatten any remaining <tag>/</tag>
    .replace(/\s+/g, " ")                          // collapse runs of whitespace
    .trim();
}

// Mapping: fn→previewPlainText, T5→coerceToText, OD9→stripAllReminders
```

**Consumers of `fn`:** `cli_inner_pretty.js:614950`, `:615011`, `:615108` — rendering task `needs`/`detail` text into the task-list UI (`fn(H.state.detail)` etc.). These are 1-line Ink cells that must show pure prose.

**Change classification:** behavior RELOCATED/EXTENDED relative to the 2.1.142 README (which documented only `vQ4`). `fn` adds the generic-tag flatten step on top of `OD9` for previews.

**Why two stages (named-block then generic-tag), and the order matters:** `OD9` first removes each reminder block *wholesale* — tag and body. Only then does the generic `<\/?[\w-]+>` pass flatten leftover non-reminder tags. If the order were reversed (generic strip first), the generic pass would delete the `<system-reminder>` *opening/closing tags* but leave the reminder **body text** behind, so the boilerplate would still pollute the preview. Doing the named-block removal first guarantees the body is gone before the generic flattening runs.

## Activity-log readable-preview builder `fD9`

The activity log / transcript-row view is a dense scroll of one-liners. For a *user* row it shows the user's actual first line, prefixed with `> ` to distinguish it from assistant output and tool errors. A leading `<system-reminder>…` block would otherwise render an opaque tag fragment for every reminder-prefixed turn — so the builder strips all reminders before picking the first non-blank line.

```javascript
// ============================================
// buildRowPreview - One-line activity/transcript-row preview (strips reminders for user rows)
// Location: cli_inner_pretty.js:614542-614578
// ============================================

// ORIGINAL (for source lookup):
function fD9(H) {
  try {
    let $ = B$(H);
    if ($.type === "assistant") { let q = $.message?.content ?? [], K = q.find((z) => z.type === "text")?.text; if (K) return K; let _ = q.find((z) => z.type === "tool_use" && z.name !== l3); if (_) { let z = _.input?.description; if (_.name === "REPL" && typeof z === "string" && z) return `REPL ${z}`; return ZHq(_.name, _.input); } }
    if ($.type === "user") { let q = $.message?.content, K = typeof q === "string" ? q : q?.find((z) => z.type === "text")?.text, _ = K ? OD9(K).split("\n").find((z) => z.trim())?.trim() : void 0; if (_) return `> ${_}`; if (Array.isArray(q)) { let z = q.find((A) => A.type === "tool_result" && A.is_error); if (z) { let A = typeof z.content === "string" ? z.content : z.content?.find((Y) => Y.type === "text")?.text; if (A) return `✗ ${A_(A)}`; } } }
  } catch {}
  return null;
}

// READABLE (for understanding):
function buildRowPreview(message) {
  try {
    const m = normalize(message);                         // B$ = normalize-for-display
    if (m.type === "assistant") {
      const content = m.message?.content ?? [];
      const firstText = content.find((b) => b.type === "text")?.text;
      if (firstText) return firstText;
      const toolUse = content.find((b) => b.type === "tool_use" && b.name !== HIDDEN_TOOL);  // l3
      if (toolUse) {
        const desc = toolUse.input?.description;
        if (toolUse.name === "REPL" && typeof desc === "string" && desc) return `REPL ${desc}`;
        return summarizeToolCall(toolUse.name, toolUse.input);                                // ZHq
      }
    }
    if (m.type === "user") {
      const content = m.message?.content;
      const text = typeof content === "string" ? content : content?.find((b) => b.type === "text")?.text;
      const firstLine = text
        ? stripAllReminders(text).split("\n").find((l) => l.trim())?.trim()  // ◄── strip reminders, 1st non-blank line
        : undefined;
      if (firstLine) return `> ${firstLine}`;
      if (Array.isArray(content)) {
        const errResult = content.find((b) => b.type === "tool_result" && b.is_error);
        if (errResult) {
          const errText = typeof errResult.content === "string"
            ? errResult.content
            : errResult.content?.find((b) => b.type === "text")?.text;
          if (errText) return `✗ ${formatError(errText)}`;             // ✗ prefix for tool errors
        }
      }
    }
  } catch {}
  return null;
}

// Mapping: fD9→buildRowPreview, B$→normalize, l3→HIDDEN_TOOL, ZHq→summarizeToolCall, OD9→stripAllReminders, A_→formatError
```

**TS counterpart:** the `> {preview}` user-row rendering — the 2.1.88 baseline has no single exported name; the 2.1.142 README groups it under "the preview string rendered into permission dialogs / activity logs." The strip helper is the same `stripAllReminders` family.

**Change classification:** behavior UNCHANGED (preview strips reminders), implementation RELOCATED.

**Why strip-all (not leading-only) here:** Unlike the sticky prompt, this preview operates on already-merged message content where a reminder may sit *after* a tool_result block or be interleaved. Stripping ALL reminders and then taking the first non-blank line guarantees the row shows the user's words regardless of where the reminder landed in the content array. The `> ` prefix visually separates a quoted user prompt from assistant free-text (no prefix) and tool errors (`✗` prefix).

## Per-surface predicate filters

Beyond the content strips, several interactive surfaces drop reminder-bearing or harness-chrome messages outright via predicates.

### Synthetic-message blocklist `lSH` (the `isNavigableMessage` core)

```javascript
// ============================================
// isSyntheticUserMessage - Blocklist check for harness-synthesised user text (interrupts, no-response)
// Location: cli_inner_pretty.js:443723-443731
// ============================================

// ORIGINAL (for source lookup):
function lSH(H) {
  return H.type !== "progress" && H.type !== "attachment" && H.type !== "system" && Array.isArray(H.message.content) && H.message.content[0]?.type === "text" && qnH.has(H.message.content[0].text);
}

// READABLE (for understanding):
function isSyntheticUserMessage(message) {
  return message.type !== "progress" &&
    message.type !== "attachment" &&
    message.type !== "system" &&
    Array.isArray(message.message.content) &&
    message.message.content[0]?.type === "text" &&
    SYNTHETIC_MESSAGES.has(message.message.content[0].text);   // qnH = new Set([...interrupt / no-response strings])
}

// Mapping: lSH→isSyntheticUserMessage, qnH→SYNTHETIC_MESSAGES
```

`SYNTHETIC_MESSAGES` (`qnH`) is built at `cli_inner_pretty.js:446537` as `new Set([ZLH, FE, USH, nhH, MkH])` — i.e. the interrupt and no-response sentinels: `"[Request interrupted by user]"` (`ZLH`, `:446449`), `"[Request interrupted by user for tool use]"` (`FE`, `:446450`), `"No response requested."` (`MkH`, `:446467`), etc. `lSH` is the 2.1.156 equivalent of the TS `isNavigableMessage`'s `SYNTHETIC_MESSAGES.has(b.text)` branch (`components/messageActions.tsx:36`).

**Consumers of `lSH`:** the navigable predicate `wq$` (`:573401`), the human-prompt scanner (`:571663`), the message-list filter (`:399010`).

### Navigable / message-selector predicate `wq$`

The `Esc`-key message selector and jump-to-message use a predicate that combines the synthetic blocklist, the `isMeta` flag, the transcript-only flag, and an XML-envelope check.

```javascript
// ============================================
// isNavigableMessage - Decide whether a user message is a real, selectable prompt
// Location: cli_inner_pretty.js:573398-573417
// ============================================

// ORIGINAL (for source lookup):
function wq$(H) {
  if (H.type !== "user") return !1;
  if (Array.isArray(H.message.content) && H.message.content[0]?.type === "tool_result") return !1;
  if (lSH(H)) return !1;
  if (H.isMeta) return !1;
  if (H.isCompactSummary || H.isVisibleInTranscriptOnly) return !1;
  let $ = KS(H)?.trim() ?? "";
  if ($.indexOf(`<${dW}>`) !== -1 || $.indexOf(`<${lt}>`) !== -1 || $.indexOf(`<${s5$}>`) !== -1 || $.indexOf(`<${ct}>`) !== -1 || $.indexOf(`<${zz}>`) !== -1 || $.indexOf(`<${y3H}>`) !== -1 || $.indexOf(`<${_Z}`) !== -1) return !1;
  return !0;
}

// READABLE (for understanding):
function isNavigableMessage(message) {
  if (message.type !== "user") return false;
  if (Array.isArray(message.message.content) && message.message.content[0]?.type === "tool_result") return false;
  if (isSyntheticUserMessage(message)) return false;     // interrupts / no-response sentinels
  if (message.isMeta) return false;                      // ◄── reminder-bearing meta messages
  if (message.isCompactSummary || message.isVisibleInTranscriptOnly) return false;
  const text = getUserText(message)?.trim() ?? "";       // KS → jl: pull the user text
  // Reject any message whose text is itself an XML envelope (command-message, bash-stdout, etc.):
  if (text.indexOf(`<${TAG_A}>`) !== -1 || text.indexOf(`<${TAG_B}>`) !== -1 || /* …5 more envelope tags… */
      text.indexOf(`<${TAG_G}`) !== -1) return false;
  return true;
}

// Mapping: wq$→isNavigableMessage, lSH→isSyntheticUserMessage, KS→getUserText, dW/lt/s5$/ct/zz/y3H/_Z→XML envelope tag names
```

**TS counterpart:** `isNavigableMessage` at `components/messageActions.tsx:21-44`. Note the TS variant ends its user-branch with `return !stripSystemReminders(b.text).startsWith('<')`. The 2.1.156 obfuscated `wq$` reaches the same outcome by an explicit set of `indexOf("<tag>")` envelope checks plus the upstream `isMeta` reject — it does **not** call `PG4` here. This is a refactor (different mechanics, identical user-visible effect: command-expansion / bash-stdout / reminder envelopes are not navigable).

**Change classification:** behavior UNCHANGED, RELOCATED/refactored (no shared strip call).

**Why hide the whole entry rather than strip-and-show:** A reminder *body* (or a `<command-message>` envelope) often contains technical text the user wouldn't recognise as a prior turn. For a *jump target*, hiding the entry entirely is correct UX — silently displaying stripped chrome would offer a confusing or empty selection.

### Human-prompt scanner (queued-prompt / replay walk)

```javascript
// From cli_inner_pretty.js:571656-571663 — reject meta + non-human messages when looking for a human prompt:
if (wH.type !== "user" || wH.isMeta || wH.toolUseResult || wH.isCompactSummary ||
    (wH.origin && wH.origin.kind !== "human") || lSH(wH)) continue;
```

This walk wants only messages the *human* actually authored. It rejects `isMeta`, tool-result carriers, compact summaries, non-human `origin`, and synthetic sentinels — a strict superset of the reminder filter.

## The copy-text path

The "Copy message" action (TS: `copyTextOf` at `messageActions.tsx:409-414`) strips leading reminders so the clipboard receives only the user's real prose:

```typescript
// From src/components/messageActions.tsx:409-414 (2.1.88 baseline):
export function copyTextOf(msg: NavigableMessage): string {
  switch (msg.type) {
    case 'user': {
      const b = msg.message.content[0];
      return b?.type === 'text' ? stripSystemReminders(b.text) : '';   // ◄── leading-strip on copy
    }
    // assistant / grouped_tool_use / collapsed_read_search …
  }
}
```

In **2.1.156**, the copy path no longer routes through the shared `PG4` (confirmed: `grep -n "PG4("` returns only the definition at `:443733` and the single sticky-prompt call at `:499753`). The copy/navigable surfaces in 156 protect the clipboard by *filtering at selection time* — only `isNavigableMessage` (`wq$`)-eligible messages can be selected/copied, and that predicate already rejects `isMeta` reminder-carriers and XML-envelope text via the `indexOf("<tag>")` checks before the copy ever happens. So a reminder-bearing message is unreachable as a copy target rather than being copied-then-stripped. The user-visible outcome is identical to 2.1.88: the clipboard never receives reminder boilerplate.

**Change classification:** behavior UNCHANGED (no reminder text reaches the clipboard), mechanism refactored (selection-time predicate instead of copy-time strip).

## Telemetry side-channel (split, not UI)

The telemetry layer doesn't go through the UI — it taps the message stream and separates reminder bodies from real user/tool content so observability dashboards don't count harness chrome as "what the user typed."

The "is this text *entirely* a reminder?" probe:

```javascript
// ============================================
// extractSystemReminderContent - Return the inner body iff the whole string is one <system-reminder>
// Location: cli_inner_pretty.js:271456-271458
// ============================================

// ORIGINAL (for source lookup):
function JN6(H) {
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H.trim())?.[1]?.trim() || null;
}

// READABLE (for understanding):
function extractSystemReminderContent(text) {
  // Whole-string match only: returns the inner body if the ENTIRE trimmed string is one
  // <system-reminder>…</system-reminder> block; null otherwise.
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(text.trim())?.[1]?.trim() || null;
}

// Mapping: JN6→extractSystemReminderContent, H→text
```

The split into `{contextParts, systemReminders}`:

```javascript
// ============================================
// splitContextAndReminders - Partition messages into user/tool context vs reminder bodies
// Location: cli_inner_pretty.js:271459-271492
// ============================================

// ORIGINAL (for source lookup):
function Uc5(H) {
  let $ = [], q = [];
  for (let K of H) {
    if (K.type === "api_system") { q.push(K.message.content); continue; }   // role:"system" → reminders bucket
    let _ = K.message.content;
    if (typeof _ === "string") { let z = JN6(_); if (z) q.push(z); else $.push(`[USER]\n${_}`); }
    else if (Array.isArray(_)) for (let z of _)
      if (z.type === "text") { let A = JN6(z.text); if (A) q.push(A); else $.push(`[USER]\n${z.text}`); }
      else if (z.type === "tool_result") { let A = typeof z.content === "string" ? z.content : IH(z.content), Y = JN6(A); if (Y) q.push(Y); else $.push(`[TOOL RESULT: ${z.tool_use_id}]\n${A}`); }
  }
  return { contextParts: $, systemReminders: q };
}

// READABLE (for understanding):
function splitContextAndReminders(messages) {
  const contextParts = [], systemReminders = [];
  for (const msg of messages) {
    if (msg.type === "api_system") { systemReminders.push(msg.message.content); continue; }  // ◄── NEW in 156
    const content = msg.message.content;
    if (typeof content === "string") {
      const r = extractSystemReminderContent(content);
      if (r) systemReminders.push(r); else contextParts.push(`[USER]\n${content}`);
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === "text") {
          const r = extractSystemReminderContent(block.text);
          if (r) systemReminders.push(r); else contextParts.push(`[USER]\n${block.text}`);
        } else if (block.type === "tool_result") {
          const t = typeof block.content === "string" ? block.content : stringifyBlocks(block.content);
          const r = extractSystemReminderContent(t);
          if (r) systemReminders.push(r); else contextParts.push(`[TOOL RESULT: ${block.tool_use_id}]\n${t}`);
        }
      }
    }
  }
  return { contextParts, systemReminders };
}

// Mapping: Uc5→splitContextAndReminders, JN6→extractSystemReminderContent, IH→stringifyBlocks, $→contextParts, q→systemReminders
```

These feed two span attributes (`new_context` = the user's actual content; `system_reminders` = joined reminder bodies). The full telemetry path, gates (`OTEL_LOG_USER_PROMPTS`), the per-querySource dedupe, and the **NEW** `api_system` branch (the telemetry-side counterpart of the mid-conversation `role:"system"` feature) are documented in `telemetry_and_cache.md`. The key UI-relevant point: the same regex-probe (`extractSystemReminderContent`) that the UI uses to *recognise* a wholly-reminder block also lets telemetry attribute it to a separate dimension, so "user prompt length over time" graphs aren't polluted by reminder bytes the user never typed.

**TS counterpart:** `extractSystemReminderContent` (`utils/telemetry/betaSessionTracing.ts:149-152`) and `formatMessagesForContext` (`:166-208`). The 2.1.156 split is EXTENDED with the `api_system` first branch (no such message type exists in 2.1.88).

## Where reminders ARE shown to the user

Despite all the suppression, **two** surfaces deliberately surface reminder data:

1. **`/ctx` (context visualisation):** shows the context-window budget split by category. Reminders contribute to the "system / meta" bucket. The user sees the *count* and *byte size* but not the text — so they can understand "auto-memory loaded N KB of reminders this session" when wondering where their budget went.
2. **Full transcript mode (`ctrl+o`):** reminders appear here verbatim, with `<system-reminder>` tags visible. The suppression predicates pass their `includeTranscriptOnly = true` argument so `isVisibleInTranscriptOnly` content (and reminder context) stays visible. Transcript mode is the developer/debug view — hiding harness chrome there would make debugging impossible.

## Pasting and resume edge cases

- **Transcript paste:** if the user clipboard-pastes a transcript exported from another session, raw `<system-reminder>` text could leak into the new input. The submit normaliser's strip-all family removes it before send, so the new session doesn't replay old reminders as user input.
- **`/resume` reload:** the persisted transcript stores reminder text *inside* the user messages. On reload the loader re-runs the attachment normaliser on saved attachment records (re-deriving SR text via the current renderers, so changed reminder text is picked up), while primitive user messages whose text begins with `<system-reminder>` are preserved as-is. Either way the reloaded message keeps `isMeta:true`, so the UI filters hide it.
- **`/fork` from message N:** subsequent messages are discarded; prior reminders stay in context. The UI re-renders the now-shorter transcript with the same `isMeta` filter applied.

## Putting it together — a UX trace

Scenario: a TodoWrite call returns; the next request carries a `todo_reminder` attachment.

1. **Attachment generated:** the todo-reminder attachment record is produced.
2. **Wrapped & flagged:** the attachment renderer emits `wrapMessagesAsReminders([makeUserMessage({ content, isMeta:true })])` (the canonical `C_([T8({content, isMeta:!0})])` at `cli_inner_pretty.js:445522`). The text is wrapped in `<system-reminder>…</system-reminder>` and the carrier message gets `isMeta:true`.
3. **Merged & smooshed:** the normaliser folds the SR-text block into the adjacent TodoWrite `tool_result`, keeping a stable byte layout.
4. **Sent to API:** the model sees `<system-reminder>…</system-reminder>` inside the tool_result content.
5. **Transcript render:** the message is `isMeta:true` → not rendered in the normal view.
6. **Sticky prompt:** `computeStickyPromptText` (`d7z`) returns `null` for the meta message; the breadcrumb keeps walking back to the user's last real prompt.
7. **Search:** the search-index builder `aqz` strips all reminder blocks (indexOf loop) before lowercasing, so `/`-search hits never match reminder text.
8. **Activity preview:** `buildRowPreview` (`fD9`) runs `stripAllReminders` (`OD9`) and shows the first non-blank user line as `> …`.
9. **Selection/copy:** `isNavigableMessage` (`wq$`) rejects the `isMeta` message, so it's never a jump or copy target; the clipboard can only ever receive non-reminder prose.
10. **Telemetry:** `splitContextAndReminders` (`Uc5`) routes the reminder body into `system_reminders`, leaving `new_context` clean.
11. **`/resume`:** the reloaded message keeps `isMeta:true`; all filters reapply.
12. **`ctrl+o` debug view:** the reminder text shows verbatim for debugging.

The user, viewing normally, sees only their prompts and the model's responses. The reminder did its job — steering the model — without ever entering the user's visual field.

## Why a flag rather than a separate channel — the deep rationale

Three constraints force the in-band-text + `isMeta`-flag design over a hypothetical "second channel":

1. **The model must attend to the reminder in conversational context.** A reminder is a mid-conversation instruction ("the TODO list hasn't been updated", "plan mode re-entered"). For the model to weight it correctly it has to appear *in the message stream the model reads*, adjacent to the turn it concerns. A side-channel that the model didn't read as part of the conversation would defeat the purpose.

2. **The cached prompt prefix must stay stable.** Putting reminders in the *system prompt* (the natural "out-of-band" place) would mutate the `cache_control: ephemeral` prefix every turn and bust the server-side prompt cache. By contrast, a reminder appended to the *tail* user message lands in the already-uncached region, so the cached prefix is untouched. The idempotent wrap guard `ensureSystemReminderWrap` (`DQ_`, `cli_inner_pretty.js:444371-444382`, `if ($.startsWith("<system-reminder>")) return H;`) and the sibling-smoosh (`hG4`, `:444384+`) exist specifically to keep the serialized byte layout stable turn-over-turn so the cache keeps hitting.

3. **One payload, three audiences, zero divergence.** The same `message.content` string is what the model reads, what telemetry partitions, and what the UI suppresses. A flag that *travels with the message identity* (surviving the merge/smoosh/split/resume passes) lets the harness make all three decisions from one source of truth. A literal second channel would require keeping a parallel array in sync across every persistence and resume path — a far larger surface for drift and bugs.

2.1.156 adds an *optional* genuine second channel — the mid-conversation `role:"system"` message (`api_system`, under the `mid-conversation-system-2026-04-07` beta) — but it is strictly a cleaner-separation *upgrade* layered on top, with a pre-computed in-band fallback for servers/models that reject it. Even there, the rejection is sticky precisely to avoid a flapping beta repeatedly reshaping the message array and busting the cache. The in-band `<system-reminder>` + `isMeta` flag remains the always-available baseline. See `telemetry_and_cache.md` (§7-§8) for that subsystem.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `makeUserMessage` (obfuscated: `T8`) - User-message factory carrying `isMeta` / `isVisibleInTranscriptOnly` (`cli_inner_pretty.js:443846`)
- `stripLeadingReminders` (obfuscated: `PG4`) - Peel leading `<system-reminder>` blocks; sole consumer is the sticky-prompt extractor (`cli_inner_pretty.js:443733`)
- `computeStickyPromptText` (obfuscated: `d7z`) - Derive the breadcrumb "last real user prompt" (`cli_inner_pretty.js:499732`)
- `stickyPromptText` (obfuscated: `Ce6`) - WeakMap memoizer over `d7z` (`cli_inner_pretty.js:499726`)
- `buildSearchIndexText` (obfuscated: `aqz`) - Search-index builder with indexOf strip-all loop (`cli_inner_pretty.js:495543`)
- `searchableText` (obfuscated: `_N8`) - Lowercase + WeakMap memoize search text (`cli_inner_pretty.js:495537`)
- `stripAllReminders` (obfuscated: `OD9`) - Regex strip-all `<system-reminder>`/`<task-notification>` (`cli_inner_pretty.js:614580`)
- `previewPlainText` (obfuscated: `fn`) - Strip reminders then all tags then whitespace for previews (`cli_inner_pretty.js:614583`)
- `buildRowPreview` (obfuscated: `fD9`) - One-line activity/transcript-row preview; strips reminders for user rows (`cli_inner_pretty.js:614542`)
- `isSyntheticUserMessage` (obfuscated: `lSH`) - Blocklist for interrupt/no-response sentinels (`cli_inner_pretty.js:443723`)
- `isNavigableMessage` (obfuscated: `wq$`) - Message-selector/jump/copy eligibility predicate (`cli_inner_pretty.js:573398`)
- `getUserText` (obfuscated: `KS`) - Extract user text from message content (`cli_inner_pretty.js:445017`)
- `extractSystemReminderContent` (obfuscated: `JN6`) - Whole-string reminder probe for telemetry (`cli_inner_pretty.js:271456`)
- `splitContextAndReminders` (obfuscated: `Uc5`) - Partition messages into `contextParts` vs `systemReminders` (`cli_inner_pretty.js:271459`)
- `SYNTHETIC_MESSAGES` (obfuscated: `qnH`) - Set of interrupt/no-response sentinel strings (`cli_inner_pretty.js:446537`)
- `CLOSE_TAG` (obfuscated: `Nm4`) - `"</system-reminder>"` constant for the search strip loop (`cli_inner_pretty.js:495652`)
