# Telemetry & Cache — Token Economics of Reminders (v2.1.156)

> How `<system-reminder>` content interacts with the Anthropic API's prompt cache and Claude Code's OTel telemetry pipeline. Why reminders live inside user-role text (cache-prefix stability), why some reminders are separately tracked in observability (`system_reminders` vs `new_context`), and how the NEW mid-conversation `role:"system"` rejection fallback fits in. Every 2.1.156 line cites `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, re-verified by Read/grep — line numbers differ from the 2.1.142 reference.

---

## 1. The cache-prefix invariant

Anthropic's prompt cache works on a **prefix match** — a cache hit requires the request's content to be **byte-identical to a previous request up to a cache breakpoint**. Any change in the cached prefix region (system prompt, tool definitions, prior messages with `cache_control: ephemeral`) **invalidates** everything from the mutation point onward and re-bills it as cache-creation tokens.

Reminders sit inside *user-role messages*. The naïve alternatives would have been:

- Edit the system prompt every turn (e.g., "Auto mode active; date is 2026-06-05").
- Or inject reminders as a separate top-level `system` field that mutates per turn.

Both break the prefix invariant. The design adopted by Claude Code:

- **Reminders live in user-role messages** appended turn-by-turn (the `T8` factory always produces `{ type:"user", message:{ role:"user", content } }`).
- **The cached prefix never mutates** — only the new turn's content carries fresh reminder tokens.
- **Cache breakpoints** sit AFTER the cached system prompt + tool defs + prior turns and BEFORE the per-turn user content, so the prefix-mutation cost of a reminder is zero.

The source-level acknowledgement of the convention is the system-prompt clause at `cli_inner_pretty.js:555453`:

> "Tool results and user messages may include `<system-reminder>` or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear."

This single clause is the cache-friendly *replacement* for restating "this is out-of-band context, don't narrate it" inside every reminder body — and is the economic motive behind the 2.1.156 slimming (§9): every per-event restatement that was deleted is a byte that no longer rides the per-turn user content, and the global convention now carries that meaning once, in the cached prefix.

---

## 2. Two reminder placement strategies

```
                Cached prefix region            Per-turn content
                ┌───────────────────────────┐  ┌─────────────────────┐
                │ system prompt (anchor)    │  │                     │
                │   …SR-convention clause   │  │  user msg 1         │
                │ tool definitions          │  │  assistant msg 1    │
                │ initial CLAUDE.md context │  │  user msg 2 (+ SRs) │
                │   <SR>As you answer…</SR> │  │  ↑ per-turn SRs     │
                │ breakpoint #1             │  └─────────────────────┘
                ├───────────────────────────┤
                │ assistant + tool turns    │
                │ from prior session        │
                │ breakpoint #N             │
                └───────────────────────────┘
```

### Placement A — once at session start (cache-friendly)

The CLAUDE.md / context block prepends a single reminder to the first user message. Verified text — `cli_inner_pretty.js:556130-556139`:

```javascript
// ============================================
// makeClaudeMdContextReminder - session-start CLAUDE.md context block (cached-prefix reminder)
// Location: cli_inner_pretty.js:556130-556139
// ============================================

// ORIGINAL (for source lookup):
return [ T8({ content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries($).map(([q, K]) => `# ${q}
${K}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`, isMeta: !0 }), ... ];

// READABLE (for understanding):
return [ makeUserMessage({ content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(contextEntries).map(([title, body]) => `# ${title}\n${body}`).join("\n")}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`, isMeta: true }), ... ];

// Mapping: T8→makeUserMessage, $→contextEntries, q→title, K→body
```

This reminder is **inside the cached prefix** — it is part of every turn but never re-sent. Adding/removing it would invalidate the cache, so the harness keeps it stable: a `/clear` or `/compact` resets the prefix entirely; otherwise CLAUDE.md changes surface as a per-turn `memory_update` reminder (a NEW surface in 2.1.156, `445768-445785`), **not** as a prefix mutation.

### Placement B — per-turn (cache-bypass)

Per-turn reminders (todo_reminder, plan_mode, relevant_memories, memory_update, etc.) live **outside** the cached prefix — they ride alongside the new user content. They do not invalidate the cache, but they count against per-turn tokens. The split is invisible to the model (it sees a stream of reminder blocks) but matters for token economics:

- **Stable reminders** (e.g. the initial deferred-tools listing once MCP topology stabilises): effectively cached.
- **Per-turn reminders** (todo_reminder embedding the live list, relevant_memories per-prompt recall, date_change): NOT cached — putting them in the prefix would invalidate it every time the embedded data changes.

---

## 3. Why per-turn reminders don't cache

A reminder like `todo_reminder` embeds the *current* todo list. If the harness placed it in the cached region, every TodoWrite would invalidate the prefix (the embedded list changes), forcing a full re-pay of the cached prefix in cache-creation tokens on that turn.

Per-turn placement means the *prior turns' prefix stays cached* — only the new reminder content is fresh tokens. The trade-off:

- ❌ Reminder content is fresh tokens every turn (not amortised by a cache hit).
- ✅ The cached prefix (system prompt + tool defs + prior turns) stays valid.

For a session with N turns and reminder size R tokens:

- **In-prefix placement**: N × full-prefix-tokens (cache misses on every prefix update).
- **Per-turn placement**: full-prefix-tokens once + N × R reminder tokens.

For R ≪ prefix, per-turn is dramatically cheaper. A typical reminder is 50–200 tokens; the cached prefix is 5,000–20,000 tokens. Per-turn is the right choice, and that is *why* the 2.1.156 slimming targets per-turn-billed reminders (the per-Read malware reminder rode in re-billed Read tool_results — §9) far more aggressively than occasional ones.

---

## 4. The cache-prefix guards in 2.1.156

Three pieces of machinery exist specifically to keep the serialized byte layout of reminder-bearing messages stable turn-over-turn so the prompt cache keeps hitting.

### 4.1 Idempotent wrap guard `ensureSystemReminderWrap` (`DQ_`)

If a text block is wrapped twice, its bytes change and the cache busts. The guard skips text already wrapped. Verified text — `cli_inner_pretty.js:444371-444382`:

```javascript
// ============================================
// ensureSystemReminderWrap - idempotent wrap guard (double-wrap would bust cache)
// Location: cli_inner_pretty.js:444371-444382
// ============================================

// ORIGINAL (for source lookup):
function DQ_(H) {
  let $ = H.message.content;
  if (typeof $ === "string") {
    if ($.startsWith("<system-reminder>")) return H;
    return { ...H, message: { ...H.message, content: S0($) } };
  }
  let q = !1, K = $.map((_) => {
    if (_.type === "text" && !_.text.startsWith("<system-reminder>")) return ((q = !0), { ..._, text: S0(_.text) });
    return _;
  });
  return q ? { ...H, message: { ...H.message, content: K } } : H;
}

// READABLE (for understanding):
function ensureSystemReminderWrap(message) {
  const content = message.message.content;
  if (typeof content === "string") {
    if (content.startsWith("<system-reminder>")) return message;            // already wrapped → unchanged bytes
    return { ...message, message: { ...message.message, content: wrapStringMultiline(content) } };
  }
  let mutated = false;
  const blocks = content.map((block) => {
    if (block.type === "text" && !block.text.startsWith("<system-reminder>")) {
      mutated = true;
      return { ...block, text: wrapStringMultiline(block.text) };
    }
    return block;
  });
  return mutated ? { ...message, message: { ...message.message, content: blocks } } : message;
}

// Mapping: DQ_→ensureSystemReminderWrap, S0→wrapStringMultiline, H→message, $→content
```

The `S0` primitive it calls is the string wrap (`cli_inner_pretty.js:445237-445240`): `` `<system-reminder>\n${H}\n</system-reminder>` ``. The guard is gated by the `tengu_chair_sermon` statsig flag at `cli_inner_pretty.js:444604` (`V$("tengu_chair_sermon", !1) ? G.map(DQ_) : G`).

### 4.2 Sibling smoosh `smooshSystemReminderSiblings` (`hG4`)

`hG4` (`cli_inner_pretty.js:444384+`) folds reminder-prefixed text blocks into the adjacent `tool_result` so the per-turn byte layout is stable across turns — the same reminder always serializes into the same position, which keeps any breakpoint placed after it deterministic.

### 4.3 Telemetry content hashing (`dv7`/`LN6`/`XN6`)

The telemetry dedupe keys on a sha256 of the content (`cli_inner_pretty.js:271452-271454`), so a *stable reminder body* is reported once and then deduped — the same hash-stability the cache prefix depends on:

```javascript
// ============================================
// hashMessageContent - per-message content hash for telemetry dedupe
// Location: cli_inner_pretty.js:271446-271454
// ============================================

// ORIGINAL (for source lookup):
function LN6(H) { return cv7.createHash("sha256").update(H).digest("hex").slice(0, 12); }
function dv7(H) { let $ = IH(H.message.content); return `msg_${LN6($)}`; }

// READABLE (for understanding):
function sha256Hex12(text) { return crypto.createHash("sha256").update(text).digest("hex").slice(0, 12); }
function hashMessageContent(message) {
  const serialized = serializeContent(message.message.content);
  return `msg_${sha256Hex12(serialized)}`;
}

// Mapping: LN6→sha256Hex12, dv7→hashMessageContent, IH→serializeContent, cv7→crypto
```

---

## 5. Telemetry — separating reminders from user content

The telemetry pipeline (the OTel beta-session-tracing equivalent) deliberately separates reminder content from "what the user typed" so observability dashboards don't count harness chrome as user input.

### 5.1 The single-line extract `extractSystemReminderTelemetry` (`JN6`)

This answers "is this text *entirely* a system reminder? return its body, else null." Verified text — `cli_inner_pretty.js:271456-271458`:

```javascript
// ============================================
// extractSystemReminderTelemetry - wholly-tagged-string detector for telemetry
// Location: cli_inner_pretty.js:271456-271458
// TS reference: src/utils/telemetry/betaSessionTracing.ts:149-152 (extractSystemReminderContent)
// ============================================

// ORIGINAL (for source lookup):
function JN6(H) {
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H.trim())?.[1]?.trim() || null;
}

// READABLE (for understanding):
function extractSystemReminderTelemetry(text) {
  const m = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(text.trim());
  return m?.[1]?.trim() || null;
}

// Mapping: JN6→extractSystemReminderTelemetry
```

The `^…$` anchors mean it only matches a string that is *nothing but* one reminder — a user message with a reminder prefix plus real prose falls through to the `[USER]` bucket (correct: that string carries actual user content).

### 5.2 The split `splitContextAndReminders` (`Uc5`)

This walks the message tail and buckets every piece into `contextParts` (real user/tool content) or `systemReminders` (harness chrome). Verified text — `cli_inner_pretty.js:271459-271492`:

```javascript
// ============================================
// splitContextAndReminders - bucket message tail into {contextParts, systemReminders}
// Location: cli_inner_pretty.js:271459-271492
// TS reference: src/utils/telemetry/betaSessionTracing.ts:166-208 (formatMessagesForContext)
// ============================================

// ORIGINAL (for source lookup):
function Uc5(H) {
  let $ = [], q = [];
  for (let K of H) {
    if (K.type === "api_system") { q.push(K.message.content); continue; }    // NEW in 156
    let _ = K.message.content;
    if (typeof _ === "string") { let z = JN6(_); if (z) q.push(z); else $.push(`[USER]\n${_}`); }
    else if (Array.isArray(_)) for (let z of _)
      if (z.type === "text") { let A = JN6(z.text); if (A) q.push(A); else $.push(`[USER]\n${z.text}`); }
      else if (z.type === "tool_result") {
        let A = typeof z.content === "string" ? z.content : IH(z.content), Y = JN6(A);
        if (Y) q.push(Y); else $.push(`[TOOL RESULT: ${z.tool_use_id}]\n${A}`);
      }
  }
  return { contextParts: $, systemReminders: q };
}

// READABLE (for understanding):
function splitContextAndReminders(messages) {
  const contextParts = [];     // → new_context span attribute
  const systemReminders = [];  // → system_reminders span attribute
  for (const message of messages) {
    if (message.type === "api_system") {                       // NEW: native role:"system" reminder
      systemReminders.push(message.message.content);
      continue;
    }
    const content = message.message.content;
    if (typeof content === "string") {
      const sr = extractSystemReminderTelemetry(content);
      if (sr) systemReminders.push(sr); else contextParts.push(`[USER]\n${content}`);
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === "text") {
          const sr = extractSystemReminderTelemetry(block.text);
          if (sr) systemReminders.push(sr); else contextParts.push(`[USER]\n${block.text}`);
        } else if (block.type === "tool_result") {
          const text = typeof block.content === "string" ? block.content : serializeContent(block.content);
          const sr = extractSystemReminderTelemetry(text);
          if (sr) systemReminders.push(sr); else contextParts.push(`[TOOL RESULT: ${block.tool_use_id}]\n${text}`);
        }
      }
    }
  }
  return { contextParts, systemReminders };
}

// Mapping: Uc5→splitContextAndReminders, JN6→extractSystemReminderTelemetry, IH→serializeContent
```

**KEY DIFFERENCE vs the 2.1.88 TS baseline (NEW in 156):** the *new first branch* `if (K.type === "api_system") { q.push(K.message.content); continue; }`. The 2.1.88 `formatMessagesForContext` (`betaSessionTracing.ts:166-208`) has NO `api_system` case — that message type does not exist in 2.1.88. This branch is the telemetry-side counterpart of the mid-conversation `role:"system"` feature (§7): when a reminder is delivered as a real `role:"system"` message instead of an in-band `<system-reminder>` user block, it must still land in the `systemReminders` bucket, not `contextParts`. Without this branch, native-system reminders would be miscounted as "new user context," defeating the very separation telemetry exists to provide.

### 5.3 The span-attribute setter `setReminderSpanAttributes` (`iv7`)

The setter (`cli_inner_pretty.js:271500-271593`) computes the *new tail* (messages not yet reported), splits it, and emits two top-level span attributes. Verified text — the reminder portion (`271558-271590`):

```javascript
// ============================================
// setReminderSpanAttributes - emit new_context / system_reminders span attributes
// Location: cli_inner_pretty.js:271558-271590 (within iv7 271500-271593)
// TS reference: src/utils/telemetry/betaSessionTracing.ts:356-398
// ============================================

// ORIGINAL (for source lookup):
let A = q.slice(z).filter((Y) => Y.type === "user" || Y.type === "api_system");
if (A.length > 0) {
  let { contextParts: Y, systemReminders: f } = Uc5(A);
  if ((H.setAttribute("new_context_message_count", A.length), f.length > 0))
    H.setAttribute("system_reminders_count", f.length);
  if (Y.length > 0 && qJH()) {
    let O = Y.join(`\n\n---\n\n`), { content: M, truncated: j } = sh(O);
    H.setAttributes({ new_context: M, ...(j && { new_context_truncated: !0, new_context_original_length: O.length }) });
  }
  if (f.length > 0 && qJH()) {
    let O = f.join(`\n\n---\n\n`), { content: M, truncated: j } = sh(O);
    H.setAttributes({ system_reminders: M, ...(j && { system_reminders_truncated: !0, system_reminders_original_length: O.length }) });
  }
  if (qJH()) { let O = q.at(-1); if (O) XN6.set(K, dv7(O)); }
}

// READABLE (for understanding):
const newTail = allMessages.slice(reportedFrom).filter((m) => m.type === "user" || m.type === "api_system");
if (newTail.length > 0) {
  const { contextParts, systemReminders } = splitContextAndReminders(newTail);
  span.setAttribute("new_context_message_count", newTail.length);
  if (systemReminders.length > 0) span.setAttribute("system_reminders_count", systemReminders.length);
  if (contextParts.length > 0 && logUserPromptsEnabled()) {
    const joined = contextParts.join("\n\n---\n\n");
    const { content, truncated } = truncate60KB(joined);
    span.setAttributes({ new_context: content, ...(truncated && { new_context_truncated: true, new_context_original_length: joined.length }) });
  }
  if (systemReminders.length > 0 && logUserPromptsEnabled()) {
    const joined = systemReminders.join("\n\n---\n\n");
    const { content, truncated } = truncate60KB(joined);
    span.setAttributes({ system_reminders: content, ...(truncated && { system_reminders_truncated: true, system_reminders_original_length: joined.length }) });
  }
  if (logUserPromptsEnabled()) { const last = allMessages.at(-1); if (last) lastReportedHash.set(querySource, hashMessageContent(last)); }
}

// Mapping: iv7→setReminderSpanAttributes, Uc5→splitContextAndReminders, qJH→logUserPromptsEnabled, sh→truncate60KB, XN6→lastReportedHash, dv7→hashMessageContent
```

### 5.4 Resulting span attributes (verified strings)

Two top-level span attributes plus their count and truncation metadata:

- **`new_context`** (`271571`) — the user's *actual* content (stripped of reminders). Drives the "user prompt length over time" metric. Metadata: `new_context_message_count` (`271561`), `new_context_truncated` / `new_context_original_length` (`271572`).
- **`system_reminders`** (`271583`) — joined reminder bodies, separated by `"\n\n---\n\n"`. Drives the "what is the harness telling the model" metric. Metadata: `system_reminders_count` (`271562`), `system_reminders_truncated` / `system_reminders_original_length` (`271584`).

**Why two separate buckets:** A dashboard can spot "this session had 20KB of reminders but only 200 bytes of actual user input" — normal for a heavy plan-mode session, but worth knowing. Crucially, it stops harness chrome (mostly constant boilerplate) from inflating the "new user context" number, which would otherwise make every reminder-heavy turn look like a giant user prompt.

### 5.5 The gates

- **`betaTracingEnabled` (`$W`)** — `cli_inner_pretty.js:271431-271434`: requires `xH(process.env.ENABLE_BETA_TRACING_DETAILED) && Boolean(process.env.BETA_TRACING_ENDPOINT)`, then `R6() || V$("tengu_trace_lantern", !1)`. The whole setter early-returns if this is off.
- **`logUserPromptsEnabled` (`qJH`)** — `cli_inner_pretty.js:271425-271427`: `xH(process.env.OTEL_LOG_USER_PROMPTS)`. The *counts* (`system_reminders_count`, `new_context_message_count`) are emitted whenever `$W()` is on; the *bodies* (`new_context`, `system_reminders`) additionally require `qJH()` because they contain potentially sensitive user prose.
- **Dedupe state** cleared by `lv7()` (`271428-271430`: `DP$.clear(); XN6.clear()`); maps defined at `271628` (`DP$ = new Set(); XN6 = new Map()`). `XN6` is the per-`querySource` last-reported-hash map; the setter skips everything already reported (`q.slice(z)` where `z` is the index after the last reported hash) so each message is reported once even across retries/continuations.

### 5.6 Truncation cap — 60KB, not 2KB

The truncation helper `sh` (`cli_inner_pretty.js:271435-271445`) caps each attribute at **`Bc5 = 61440` (60KB)** (`cli_inner_pretty.js:271619`), appending `"[TRUNCATED - Content exceeds 60KB limit]"`. This is a meaningful correction to the 2.1.142-era note that assumed a ~2KB cap: the 2.1.156 cap is 60KB. When exceeded, `new_context_truncated`/`system_reminders_truncated` and the corresponding `_original_length` are emitted alongside.

---

## 6. The `api_system` message type

For sessions that DO accept mid-conversation `role:"system"`, the harness emits messages with `type: "api_system"`. Verified text — `cli_inner_pretty.js:445274-445281`:

```javascript
// ============================================
// makeApiSystemMessage - native role:"system" mid-conversation message factory
// Location: cli_inner_pretty.js:445274-445281
// ============================================

// ORIGINAL (for source lookup):
function SQ_(H) {
  return { type: "api_system", message: { role: "system", content: H }, uuid: Wk.randomUUID(), timestamp: new Date().toISOString() };
}

// READABLE (for understanding):
function makeApiSystemMessage(content) {
  return { type: "api_system", message: { role: "system", content }, uuid: crypto.randomUUID(), timestamp: new Date().toISOString() };
}

// Mapping: SQ_→makeApiSystemMessage, Wk→crypto
```

These are functionally equivalent to a `<system-reminder>`-wrapped user message but use the native `role:"system"` channel. The telemetry layer treats their content identically (the `api_system` branch in `Uc5` at `271463`); the dedupe/tail logic in `iv7` filters on `Y.type === "user" || Y.type === "api_system"` (`271558`) so both representations of a reminder participate in `system_reminders` counting.

---

## 7. The mid-conv-system fallback (NEW subsystem)

This is the largest NEW machinery in this area and has **NO counterpart in the 2.1.88 TS baseline**. It lets the harness deliver reminders as real `role:"system"` messages (under a beta) on supporting models, and gracefully falls back to in-band `<system-reminder>` user-body text when the server rejects them — without busting the cache.

### 7.1 The beta gate and capability check

- **Beta descriptor `_h`** — `cli_inner_pretty.js:98142`: `_h = KX("mid_conversation_system", "mid-conversation-system-2026-04-07")`. Its `.header` is `"mid-conversation-system-2026-04-07"`.
- **Header injection** — `cli_inner_pretty.js:130562`: `if (_h && XH8(H)) $.push(_h);` — the beta is added to the request beta list only when the model `XH8(H)` supports it.
- **Model capability `XH8`** — `cli_inner_pretty.js:130520-130541`: memoized predicate, disabled under HIPAA, force-overridable via `CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM`, otherwise a per-model table where `claude-3-*`, `claude-opus-4-0/4-1/4-5/4-6/4-7` and the sonnet/haiku entries (`130532-130538`) return false, while `claude-opus-4-8` returns true (`130539`).

### 7.2 The dual representation — one flush helper, two outputs

The decisive design point: the SAME flush helper `w()` inside the normalizer `D0` emits EITHER a `role:"system"` message OR the in-band `<system-reminder>` user message, depending on context. Verified text — `cli_inner_pretty.js:444492-444505`:

```javascript
// ============================================
// flushReminderAccumulator (w, inside D0) - emit accumulated reminders as role:"system" OR in-band SR
// Location: cli_inner_pretty.js:444492-444505
// ============================================

// ORIGINAL (for source lookup):
function w() {
  if (M.length === 0) return;
  let W = M.join(`\n\n`); M.length = 0;
  let G = Tx(O);
  if (G?.type === "api_system") G.message.content += `\n\n${W}`;        // coalesce into prior system msg
  else if (G?.type === "user") ((j = !0), O.push(SQ_(W)));              // new role:"system" msg
  else O.push(T8({ content: S0(W), isMeta: !0 }));                      // FALLBACK: in-band <system-reminder> user msg
}

// READABLE (for understanding):
function flushReminderAccumulator() {                 // M = accumulated reminder bodies, O = output messages
  if (reminderBuffer.length === 0) return;
  const joined = reminderBuffer.join("\n\n"); reminderBuffer.length = 0;
  const prev = lastOf(out);
  if (prev?.type === "api_system") prev.message.content += `\n\n${joined}`;             // append to existing system msg
  else if (prev?.type === "user") { emittedApiSystem = true; out.push(makeApiSystemMessage(joined)); }  // role:"system"
  else out.push(makeUserMessage({ content: wrapStringMultiline(joined), isMeta: true }));               // in-band SR fallback
}

// Mapping: w→flushReminderAccumulator, M→reminderBuffer, O→out, Tx→lastOf, SQ_→makeApiSystemMessage, T8→makeUserMessage, S0→wrapStringMultiline, j→emittedApiSystem
```

The normalizer header decides whether the native path is even available — `cli_inner_pretty.js:444461-444462`: `function D0(H, $ = [], q) { let K = q !== void 0 && XH8(q), … }`. `K` is true only when a model arg `q` was passed AND that model supports the beta. The attachment branch (`cli_inner_pretty.js:444595-444603`) extracts reminder bodies via `RQ_(G)` into the `M` accumulator only when `K` is true; otherwise reminders fall through to the in-band `S0`-wrapped path. **When `D0` is called WITHOUT a model arg (`q === void 0`), `K=false` and reminders ALWAYS take the in-band path** — this is exactly how the fallback variant is built (§7.3).

`RQ_` (`extractReminderBodiesForApiSystem`, `cli_inner_pretty.js:445282-445298`) unwraps each reminder message's text via `fi6` (the multiline extract) and joins them, returning the raw body for re-emission as `role:"system"` content (or null if empty).

### 7.3 Dispatch + dual-build at request time

The dispatcher pre-builds BOTH the native variant and the in-band fallback *before sending*, so a 400 rejection costs one retry, not a re-plan. Verified text — `cli_inner_pretty.js:557037-557043`:

```javascript
// ============================================
// midConvSystemDispatch - pre-build native + fallback message variants
// Location: cli_inner_pretty.js:557037-557043
// ============================================

// ORIGINAL (for source lookup):
I = am8(), C = !1;
if (_h != null && g3q(I, _h)) ((C = !0), (M = M.filter((BH) => BH !== _h)));
let b = D0(E, X, C ? void 0 : z.model);
($D$(b, ...), b = h(b));
let B = null;
if (_h && !C && M.includes(_h)) B = b.some((BH) => BH.type === "api_system") ? h(D0(E, X)) : b;

// READABLE (for understanding):
const stickyBetas = getStickyBetas(), stickyRejected = false_init;
let rejected = false;
if (midConvBeta != null && isBetaRejected(stickyBetas, midConvBeta)) {
  rejected = true;
  betaList = betaList.filter((b) => b !== midConvBeta);          // drop the beta from the request
}
let primary = normalizeMessages(rawMessages, prevAttachments, rejected ? undefined : opts.model);  // native if not rejected
validateBase64(primary, ...); primary = finalize(primary);
let fallback = null;
if (midConvBeta && !rejected && betaList.includes(midConvBeta))
  fallback = primary.some((m) => m.type === "api_system")        // only pre-build fallback if native actually used it
    ? finalize(normalizeMessages(rawMessages, prevAttachments))  // D0 with NO model → every reminder in-band SR
    : primary;

// Mapping: am8→getStickyBetas, g3q→isBetaRejected, D0→normalizeMessages, _h→midConvBeta, b→primary, B→fallback, h→finalize, $D$→validateBase64
```

- `am8()` (`cli_inner_pretty.js:3264-3266`): `return d$.stickyBetas` — the sticky beta state object with `.sent`/`.rejected` sets.
- `g3q(I, _h)` (`cli_inner_pretty.js:1941-1943`): `return H.rejected.has($)` — has this beta been sticky-rejected this session?
- The fallback `B` is built by `D0(E, X)` with NO model arg → every reminder folded into `<system-reminder>` user bodies. It is only pre-built if the primary `b` actually contains an `api_system` message (otherwise `B = b` and no re-shape is needed).

### 7.4 The rejection handler `[mid-conv-system]`

Verified text — `cli_inner_pretty.js:557428-557438`:

```javascript
// ============================================
// midConvSystemRejectHandler - on 400 reject, swap to fallback and sticky-reject the beta
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
if (fallback && isMidConvSystemRejection(error)) {
  betaList = betaList.filter((b) => b !== midConvBeta);     // drop beta from request
  primary = fallback; fallback = null;                       // swap to the pre-built in-band variant
  if (midConvBeta) markBetaRejected(stickyBetas, midConvBeta);  // sticky-reject for the rest of the session
  log('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact', { level: "warn" });
  emitEvent("tengu_mid_conv_system_fallback_retry", {});
  return "retry:mid-conv-system";
}

// Mapping: xP6→isMidConvSystemRejection, B→fallback, b→primary, aI$→markBetaRejected, _h→midConvBeta, N→log, d→emitEvent
```

- **`xP6`** (rejection detector) — `cli_inner_pretty.js:186567-186574`: only fires for a `400` from the API client (`rq`), and matches three rejection shapes: (1) `_h.header` present + `"anthropic-beta"` (beta-header-not-recognised), (2) `"Unexpected role"` + `"input message role"`, (3) `"not supported"` + `/role .{0,2}system/i`. The same predicate maps the error to telemetry category `"system_role_unsupported"` at `cli_inner_pretty.js:186862`.
- **`aI$(I, _h)`** (sticky-reject) — `cli_inner_pretty.js:1938-1940`: `H.sent.delete($); H.rejected.add($)`.
- **Telemetry event:** `d("tengu_mid_conv_system_fallback_retry", {})` at `557435`.

**Why sticky-reject:** Without it, every reminder-bearing request would re-try the beta, get rejected, fall back — wasting one round-trip per request. The sticky flag stays for the session.

**Why `/clear` or `/compact` resets:** Those commands rebuild the message stream and re-negotiate the beta cleanly (the user might have flipped a gate, or a model switch may now support it).

**Why this matters for cache:** This is the cache-critical part. Moving a reminder to a `role:"system"` message *changes the message-array shape*. A *flapping* beta (try native → reject → fall back → try native again next turn) would repeatedly reshape the array and **bust the cache prefix every turn**. The sticky-reject pins the shape: once rejected, the harness sends the in-band variant deterministically for the rest of the session, so the byte layout stabilises and the cache keeps hitting. The fallback retry re-sends with a different *tail* shape, but the cached *prefix* (system prompt + tool defs + prior turns) is preserved, so the next turn's cache lookup still hits.

---

## 8. Why reminders live inside user-role text — the unifying motive

Every mechanism in this document is downstream of one decision: **harness↔model mid-conversation communication must not mutate the cached prompt prefix.**

- The `T8` factory always produces user-role messages — reminders ride the (non-cached) tail, never the (cached) system prompt.
- The idempotent wrap guard (`DQ_`) and sibling smoosh (`hG4`) keep the serialized bytes of reminder-bearing messages stable so any breakpoint after them stays valid.
- The telemetry split exists *because* reminders are mixed into user-role text on the wire — observability has to re-separate what the wire format deliberately merged.
- The mid-conv-system feature is a *new* path that trades cache-shape risk for cleaner role separation; the sticky-reject and pre-built fallback exist specifically to bound that risk to at most one reshape per session.
- **The slimming program (§9) is the economic payoff of this same decision.** Because reminders are billed as per-turn user content (not amortised by cache), every byte removed from a frequently-billed reminder is a recurring saving. That is why the per-Read malware reminder — which rode in *re-billed* Read tool_results every turn — was the single highest-value removal, and why occasional reminders (todo/task) were trimmed only marginally.

---

## 9. The economic tie-back — slimming as cache economics

The 2.1.156 reminder slimming (analyzed in full in `slimming_master.md`) is not a blanket shrink; it is a *cache-economy-aware* trim. The connection to this document:

- **Per-Read malware `<system-reminder>` FULLY REMOVED** (`grep -c -i malware cli_inner_pretty.js` = **0**). In 2.1.88 it was appended to *every* non-empty file Read tool_result. Because each Read tool_result is re-sent in the prompt on every subsequent turn (it lives in the message history), a static ~90–100-token suffix on N Reads re-bills as N×suffix tokens × remaining turns — the single largest *repeated* reminder cost. Removing it is the dominant, real-world token win, and it was *cache-neutral to remove* (a static suffix on a tool_result does not destabilise any breakpoint, so the only effect is a smaller, cheaper Read result). This is the textbook removal target: high frequency × in-prompt persistence × cache-neutral deletion.
- **`todo_reminder` / `task_reminder` trailing "Make sure that you NEVER mention this reminder to the user" dropped** (verified at `cli_inner_pretty.js:445514` / `445528`; `grep -c -i "NEVER mention this reminder"` = **0**). The dropped sentence restated a *global* convention already carried once in the cached prefix by the SR-convention clause at `555453`. Re-asserting it per-reminder was pure redundancy — and since these reminders are per-turn-billed, the restatement was pure recurring waste. The "don't narrate" rule is now centralised into one hoisted constant (`yT8`, `446489-446490`) applied only where it matters (delta/memory reminders), instead of N inline copies.

The two facts share one principle: **stop restating cached-prefix-resident global policy inside per-turn-billed reminder bodies.** The slimming is, at root, the same cache-economics decision that motivates placing reminders in user-role text — minimise the bytes that ride the non-cached, per-turn-billed tail.

---

## 10. Observability — what to look at if reminders go wrong

| Symptom | Where to look |
|---------|---------------|
| "Why is my session burning cache?" | `tengu_mid_conv_system_fallback_retry` events (`557435`) — a flapping mid-conv-system beta reshapes the message array |
| "Is the harness sending reminders at all?" | `system_reminders_count` span attr (`271562`) — always emitted when `$W()` (beta tracing) is on; bodies need `OTEL_LOG_USER_PROMPTS` (`qJH`) too |
| "Is reminder boilerplate inflating the user-prompt metric?" | Compare `new_context` vs `system_reminders` (`271571`/`271583`) — the split exists to keep them separate |
| "Why are native-system reminders missing from counts?" | The `api_system` branch in `Uc5` (`271463`) must route them to `systemReminders`; the `iv7` tail filter (`271558`) must include `"api_system"` |
| "Why are reminders not stripped from telemetry user-content?" | `JN6` (`271456`) is anchored `^…$` — a reminder with trailing user prose correctly falls into `[USER]` |
| "Why is the model not surfacing context it should ignore?" | The cached CLAUDE.md block (`556130-556139`) ends with the "IMPORTANT: …should not respond… unless highly relevant" guard |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/constants in this document:

- `makeUserMessage` (obfuscated: `T8`) - User-message factory; always `role:"user"`, carries `isMeta` (`443846`)
- `wrapStringMultiline` (obfuscated: `S0`) - String → `<system-reminder>\n…\n</system-reminder>` (`445237-445240`)
- `unwrapReminder` (obfuscated: `fi6`) - Multiline extract regex (`445242-445244`)
- `ensureSystemReminderWrap` (obfuscated: `DQ_`) - Idempotent wrap guard, cache-byte stability (`444371-444382`)
- `smooshSystemReminderSiblings` (obfuscated: `hG4`) - Fold reminder text into adjacent tool_result (`444384+`)
- `normalizeMessages` (obfuscated: `D0`) - Message normalizer; decides native-system vs in-band by model arg (`444461`)
- `flushReminderAccumulator` (obfuscated: `w`, inside `D0`) - Dual-output reminder flush (`444492-444505`)
- `makeApiSystemMessage` (obfuscated: `SQ_`) - Native `role:"system"` mid-conv message factory (`445274-445281`)
- `extractReminderBodiesForApiSystem` (obfuscated: `RQ_`) - Unwrap reminder text for `role:"system"` re-emission (`445282-445298`)
- `extractSystemReminderTelemetry` (obfuscated: `JN6`) - Wholly-tagged-string detector for telemetry (`271456-271458`)
- `splitContextAndReminders` (obfuscated: `Uc5`) - `{contextParts, systemReminders}` split; NEW `api_system` branch (`271459-271492`)
- `setReminderSpanAttributes` (obfuscated: `iv7`) - Emit `new_context`/`system_reminders` span attrs (`271500-271593`)
- `truncate60KB` (obfuscated: `sh`) - Telemetry truncation, cap `Bc5 = 61440` (`271435-271445`, cap `271619`)
- `hashMessageContent` (obfuscated: `dv7`) - `msg_${sha256[:12]}` dedupe key (`271452-271454`)
- `sha256Hex12` (obfuscated: `LN6`) - 12-char sha256 hex (`271446`)
- `betaTracingEnabled` (obfuscated: `$W`) - Beta-tracing gate (`271431-271434`)
- `logUserPromptsEnabled` (obfuscated: `qJH`) - `OTEL_LOG_USER_PROMPTS` body-logging gate (`271425-271427`)
- `MID_CONV_SYSTEM_BETA` (obfuscated: `_h`) - `mid-conversation-system-2026-04-07` beta descriptor (`98142`)
- `modelSupportsMidConvSystem` (obfuscated: `XH8`) - Per-model capability predicate (`130520-130541`)
- `isMidConvSystemRejection` (obfuscated: `xP6`) - 400-rejection detector, 3 shapes (`186567-186574`)
- `markBetaRejected` (obfuscated: `aI$`) - Sticky-reject a beta for the session (`1938-1940`)
- `isBetaRejected` (obfuscated: `g3q`) - Has this beta been sticky-rejected? (`1941-1943`)
- `getStickyBetas` (obfuscated: `am8`) - Returns `d$.stickyBetas` (`3264-3266`)
- `clearTelemetryDedupe` (obfuscated: `lv7`) - Clears `DP$`/`XN6` dedupe state (`271428-271430`)
