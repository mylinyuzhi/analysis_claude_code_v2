# The 2.1.156 Hotfix: Opus 4.8 Thinking-Block Signature 400 Errors

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Thinking, Compact, Steering)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model, Prompt, Telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/constants in this document:
- `isThinkingSignatureError` (`B87`) — the new 2.1.156 400-matcher for modified/invalid thinking-block signatures (cli_inner_pretty.js:186575-186583)
- `matchBetaHeaderError` (`m87`) — sibling 400-matcher for rejected `anthropic-beta` headers (cli_inner_pretty.js:186564-186566)
- `matchMidConvSystemRoleError` (`xP6`) — sibling 400-matcher for `role:"system"` rejection (cli_inner_pretty.js:186568-186574)
- `matchThinkingTypeError` (`p87`) — sibling 400-matcher for `thinking.type` adaptive/enabled rejection (cli_inner_pretty.js:186584-186590)
- `stripSignedThinkingBlocks` (`cG4`) — strips signed thinking blocks, inserts `[Thinking removed]` placeholder (cli_inner_pretty.js:446238-446252)
- `isSignedThinkingBlock` (`gG4`) — predicate: redacted_thinking OR thinking-with-signature (cli_inner_pretty.js:446086-446090)
- `filterSignedThinkingBlocks` (`HF6`) — generic per-message signed-block filter with predicate (cli_inner_pretty.js:446218-446234)
- `stripCrossModelThinkingBlocks` (`dG4`) — cross-model preservation rule wrapper over `HF6` (cli_inner_pretty.js:446235-446237)
- `filterTrailingThinkingBlocks` (`pQ_`) — drops trailing thinking blocks from last assistant message (cli_inner_pretty.js:446091-446110)
- `isThinkingOrRedacted` (`wv$`) — predicate: thinking OR redacted_thinking (cli_inner_pretty.js:446083-446085)
- `stripContextSuffix` (`vP`) — strips the `[1m]`/`[2m]` context-tier suffix from a model id (cli_inner_pretty.js:98935-98937)
- `SYNTHETIC_MODEL_MARKER` (`CT`) — the `"<synthetic>"` model sentinel (cli_inner_pretty.js:143447)

---

## TL;DR

Claude Code 2.1.156 shipped a targeted hotfix for a regression that surfaced with the
new **Opus 4.8** model: when previously-generated **thinking blocks** were replayed in a
follow-up request but had been *modified* (or carried a *signature the server could no
longer verify*), the Anthropic API rejected the whole request with an **HTTP 400**.
Because thinking is on by default for Opus 4.8 and the agent loop replays prior assistant
turns on every iteration, a single bad signature could wedge an entire session.

The fix is a new reactive **error matcher** + **strip-and-retry** path inside the streaming
query's `onError` handler:

1. `isThinkingSignatureError` (`B87`) classifies the 400 by matching the server's error
   text — either the phrase `"signature in thinking block"`, or a thinking-block token
   (`"thinking block"` / `` "`thinking`" `` / `"redacted_thinking"`) combined with a
   tamper phrase (`"cannot be modified"` / `"invalid signature"`).
2. When it matches, the handler calls `stripSignedThinkingBlocks` (`cG4`) to remove every
   signature-bearing block from the message history, substituting a `[Thinking removed]`
   placeholder where needed.
3. If stripping actually changed the messages, it logs `tengu_thinking_signature_strip_retry`
   and returns the retry reason `"retry:thinking-signature-strip"`, which re-issues the
   request with clean history.

This sits alongside three sibling 400-matchers that handle other recoverable rejections:
`matchBetaHeaderError` (`m87`, bad beta header), `matchMidConvSystemRoleError` (`xP6`,
`role:"system"` rejection), and `matchThinkingTypeError` (`p87`, `thinking.type`
adaptive/enabled mismatch).

**Confidence:** medium-high. The matcher `B87` and the dedicated `tengu_thinking_signature_strip_retry`
retry are **NEW** post-2.1.88 (no 400-error matcher for signatures existed in the 2.1.88
source). The *stripping primitives* themselves (`cG4`/`HF6`/`pQ_`) have clear 2.1.88
precursors (`stripSignatureBlocks`, `filterTrailingThinkingFromLastAssistant`), which raises
confidence on the mechanism even though the trigger is new.

---

## Background: what a thinking-block signature is and why it must be byte-exact

Extended-thinking models emit reasoning as `thinking` content blocks during streaming.
When the server finishes a thinking block it appends a cryptographic **signature** —
delivered via a `signature_delta` event — that attests "this exact reasoning text was
produced by this model, server-side, under these decoding parameters." `redacted_thinking`
blocks are the redacted variant: the plaintext is hidden but a signed opaque payload remains.

On the next turn the client replays the prior assistant message — *including* its thinking
blocks and their signatures — back to the server. The server **re-verifies** every signature
against the block's bytes. The contract is strict:

- The signed thinking text must be **byte-identical** to what was generated. Any mutation
  (trimming whitespace, re-encoding, partial replay of a cancelled stream, merging split
  streaming siblings incorrectly) breaks the signature.
- The signature is bound to the **generating credential/model context**. After a credential
  change (e.g. `/login`) or a cross-model replay, the server cannot verify it.

A failed verification is a hard `400`, not a soft warning, because the API treats a thinking
block whose signature does not match as a tampering / integrity violation. The error message
is one of: `"signature in thinking block ..."`, `"... thinking block ... cannot be
modified"`, or `"... invalid signature ..."` (these are exactly the substrings `B87` keys
off — cli_inner_pretty.js:186578-186581).

```
generation (server)                 replay (client → server)
─────────────────────                ─────────────────────────
thinking text  ──┐                   thinking text (must == original bytes)
                 ├─ sign ─► signature ──────────────►  verify(signature, bytes)
decode params ───┘                                          │
model context ───────────────────────────────────────►     ▼
                                                       OK  or  400
```

---

## The four sibling 400 matchers

The streaming query installs an `onError: async (m8) => {...}` callback (the error is `m8`,
the live message array is the closure variable `b`; cli_inner_pretty.js:557335). Inside it,
a cascade of typed matchers classifies recoverable 400s and either mutates `b` + returns a
`retry:*` reason string, or falls through. All four matchers first guard on
`error instanceof rq && error.status === 400` — `rq` is the SDK's `APIError` class.

### 1. `matchBetaHeaderError` (`m87`) — rejected anthropic-beta header

```javascript
// ============================================
// matchBetaHeaderError - 400 because the server rejected a specific anthropic-beta header
// Location: cli_inner_pretty.js:186564-186566
// ============================================

// ORIGINAL (for source lookup):
function m87(H) {
  return H instanceof rq && H.status === 400 && H.message.includes(k4H.header) && H.message.includes("anthropic-beta");
}

// READABLE (for understanding):
function matchBetaHeaderError(error) {
  return error instanceof APIError &&
    error.status === 400 &&
    error.message.includes(CACHE_DIAGNOSIS_BETA.header) &&
    error.message.includes("anthropic-beta");
}

// Mapping: m87→matchBetaHeaderError, H→error, rq→APIError, k4H→CACHE_DIAGNOSIS_BETA
```

Matches when the server rejects a particular beta header (`k4H`, the cache-diagnosis beta).
Its retry path (cli_inner_pretty.js:557392-557398) drops the header latch and returns
`"retry:cache-diagnosis-beta"`.

### 2. `matchMidConvSystemRoleError` (`xP6`) — rejected role:"system"

```javascript
// ============================================
// matchMidConvSystemRoleError - 400 because the server rejected a mid-conversation role:"system" message
// Location: cli_inner_pretty.js:186568-186574
// ============================================

// ORIGINAL (for source lookup):
function xP6(H) {
  if (!_h) return !1;
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message;
  if ($.includes(_h.header) && $.includes("anthropic-beta")) return !0;
  if ($.includes("Unexpected role") && $.includes("input message role")) return !0;
  return $.includes("not supported") && /role .{0,2}system/i.test($);
}

// READABLE (for understanding):
function matchMidConvSystemRoleError(error) {
  if (!MID_CONV_SYSTEM_BETA) return false;
  if (!(error instanceof APIError) || error.status !== 400) return false;
  const msg = error.message;
  if (msg.includes(MID_CONV_SYSTEM_BETA.header) && msg.includes("anthropic-beta")) return true;
  if (msg.includes("Unexpected role") && msg.includes("input message role")) return true;
  return msg.includes("not supported") && /role .{0,2}system/i.test(msg);
}

// Mapping: xP6→matchMidConvSystemRoleError, H→error, $→msg, _h→MID_CONV_SYSTEM_BETA
```

Matches three flavors of the server rejecting an injected `role:"system"` block. Its retry
(cli_inner_pretty.js:557428-557437) falls back to a `<system-reminder>` body, sticky-rejects
the beta, and returns `"retry:mid-conv-system"`.

### 3. `matchThinkingTypeError` (`p87`) — thinking.type adaptive/enabled mismatch

```javascript
// ============================================
// matchThinkingTypeError - extracts the rejected thinking.type value from a 400 (or null)
// Location: cli_inner_pretty.js:186584-186590
// ============================================

// ORIGINAL (for source lookup):
function p87(H) {
  if (!(H instanceof rq) || H.status !== 400) return null;
  let $ =
    /thinking\.type[^a-z]{1,8}(enabled|adaptive)[^]*?not supported/i.exec(H.message) ??
    /\b(adaptive) thinking is not supported/i.exec(H.message);
  return $?.[1] ? $[1].toLowerCase() : null;
}

// READABLE (for understanding):
function matchThinkingTypeError(error) {
  if (!(error instanceof APIError) || error.status !== 400) return null;
  const match =
    /thinking\.type[^a-z]{1,8}(enabled|adaptive)[^]*?not supported/i.exec(error.message) ??
    /\b(adaptive) thinking is not supported/i.exec(error.message);
  return match?.[1] ? match[1].toLowerCase() : null;
}

// Mapping: p87→matchThinkingTypeError, H→error, $→match
```

Unlike the others this returns the *rejected value* (`"enabled"` or `"adaptive"`) rather than
a boolean. Its retry (cli_inner_pretty.js:557400-557411) flips to the other thinking type
and returns `"retry:thinking-type"` — note the helpful Bedrock-ARN hint logged when a
`GetInferenceProfile` round-trip is the underlying cause.

### 4. `isThinkingSignatureError` (`B87`) — the 2.1.156 hotfix matcher

```javascript
// ============================================
// isThinkingSignatureError - 400 because a thinking block was modified or its signature is invalid
// Location: cli_inner_pretty.js:186575-186583
// ============================================

// ORIGINAL (for source lookup):
function B87(H) {
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message.toLowerCase();
  if ($.includes("signature in thinking block")) return !0;
  return (
    ($.includes("thinking block") || $.includes("`thinking`") || $.includes("redacted_thinking")) &&
    ($.includes("cannot be modified") || $.includes("invalid signature"))
  );
}

// READABLE (for understanding):
function isThinkingSignatureError(error) {
  if (!(error instanceof APIError) || error.status !== 400) return false;
  const msg = error.message.toLowerCase();
  // Fast path: server explicitly names a thinking-block signature problem.
  if (msg.includes("signature in thinking block")) return true;
  // General path: a thinking-block token AND a tamper/invalid phrase.
  return (
    (msg.includes("thinking block") || msg.includes("`thinking`") || msg.includes("redacted_thinking")) &&
    (msg.includes("cannot be modified") || msg.includes("invalid signature"))
  );
}

// Mapping: B87→isThinkingSignatureError, H→error, $→msg, rq→APIError
```

**How it works (step-by-step):**

1. Guard: only HTTP 400s from the SDK error class qualify (cli_inner_pretty.js:186576).
2. Lowercase the message once (`$`) so all subsequent `includes` checks are case-insensitive
   (cli_inner_pretty.js:186577).
3. **Fast path** (cli_inner_pretty.js:186578): if the server says `"signature in thinking
   block"` it is unambiguously this error — return true immediately.
4. **General path** (cli_inner_pretty.js:186579-186582): require **(A)** a thinking-block
   *token* — `"thinking block"`, the literal `` "`thinking`" `` (the API formats the field
   name in backticks), or `"redacted_thinking"` — **AND (B)** a *tamper phrase* —
   `"cannot be modified"` or `"invalid signature"`. Both conjuncts must hold.

**Why a token-AND-phrase design instead of one regex:** the server's exact wording is not
contractual and varies across error variants ("the `thinking` block cannot be modified",
"redacted_thinking ... invalid signature", etc.). Requiring one term from each of two small
synonym sets is robust to wording drift while staying narrow enough not to misfire on
unrelated 400s. The fast path is a cheap optimization for the most common phrasing.

**Key insight:** `B87` is purely a *classifier* — it carries no recovery logic. That keeps
the matcher pure and testable; the recovery (stripping + retry) lives in the handler, mirrored
across all four siblings. This separation is what makes the `onError` cascade easy to extend
one matcher at a time.

---

## The retry path: B87 → cG4 → retry

```javascript
// ============================================
// thinkingSignatureRetry - strip signed blocks and retry when the server rejects a signature
// Location: cli_inner_pretty.js:557413-557427  (inside onError: async (m8) => {...})
// ============================================

// ORIGINAL (for source lookup):
if (B87(m8)) {
  let C6 = cG4(b);
  if (C6 !== b)
    return (
      (b = C6),
      N("[thinking] server rejected a thinking-block signature; stripping signed blocks and retrying.", {
        level: "warn",
      }),
      d("tengu_thinking_signature_strip_retry", {
        query_source: vj(z.querySource) ?? "",
        model: z.model,
      }),
      "retry:thinking-signature-strip"
    );
}

// READABLE (for understanding):
if (isThinkingSignatureError(error)) {
  const stripped = stripSignedThinkingBlocks(messages);
  if (stripped !== messages) {            // identity check: only retry if something changed
    messages = stripped;                  // mutate closure history for the retry
    log("[thinking] server rejected a thinking-block signature; stripping signed blocks and retrying.",
        { level: "warn" });
    logEvent("tengu_thinking_signature_strip_retry", {
      query_source: normalizeQuerySource(queryConfig.querySource) ?? "",
      model: queryConfig.model,
    });
    return "retry:thinking-signature-strip";
  }
}

// Mapping: B87→isThinkingSignatureError, cG4→stripSignedThinkingBlocks, m8→error, b→messages,
//          C6→stripped, N→log, d→logEvent, z→queryConfig, vj→normalizeQuerySource
```

**How it works (step-by-step):**

1. The `onError` handler runs through the matcher cascade; when `isThinkingSignatureError(m8)`
   is true (cli_inner_pretty.js:557413), it attempts recovery.
2. `stripSignedThinkingBlocks(b)` returns a *new* array if it removed anything, or the
   **same reference** `b` if nothing matched (cli_inner_pretty.js:557414). The handler tests
   `stripped !== messages` by **identity** (cli_inner_pretty.js:557415).
3. **If unchanged** (no signed blocks were present): the handler does *not* retry — it falls
   through to the generic context-hint path (cli_inner_pretty.js:557439-557445) and ultimately
   surfaces the error. This prevents an infinite retry loop where the same request is re-sent
   with no change.
4. **If changed**: assign `b = stripped` so the retried request uses clean history, log a
   warn-level message, emit telemetry `tengu_thinking_signature_strip_retry` (tagged with
   `query_source` and `model` so analytics can attribute it to Opus 4.8), and return the
   reason string `"retry:thinking-signature-strip"`.
5. The driving loop (cli_inner_pretty.js:557451-557453) iterates the request generator and
   treats any returned non-controller value as a retry trigger, re-issuing the request with
   the mutated `b`.

**Why the identity (`!==`) guard matters:** the strip primitive deliberately returns the
*input reference unchanged* when nothing was removed (see `cG4` below — `return $ ? q : H`).
The handler exploits that to distinguish "I fixed something, retry" from "nothing to fix,
give up." Returning a fresh-but-equal array would silently loop forever; reference equality
is the cheap, correct signal.

```
            API 400
               │
   ┌───────────▼─────────────┐
   │ onError(error, messages) │
   └───────────┬─────────────┘
   matcher cascade (first hit wins)
   ├─ m87  ─► retry:cache-diagnosis-beta
   ├─ p87  ─► retry:thinking-type
   ├─ B87  ─► stripSignedThinkingBlocks(messages)
   │            │
   │     stripped === messages ? ── yes ─► fall through (no retry)
   │            │ no
   │            ▼
   │     messages = stripped
   │     logEvent tengu_thinking_signature_strip_retry
   │     return "retry:thinking-signature-strip" ─► re-issue request
   ├─ xP6  ─► retry:mid-conv-system
   └─ (default) onRequestError / context-hint
```

---

## The stripping primitives

### `isThinkingOrRedacted` (`wv$`) and `isSignedThinkingBlock` (`gG4`)

Two predicates with deliberately different scope:

```javascript
// ============================================
// isSignedThinkingBlock - block carries a server signature that must survive byte-exact
// Location: cli_inner_pretty.js:446083-446090
// ============================================

// ORIGINAL (for source lookup):
function wv$(H) {
  return H.type === "thinking" || H.type === "redacted_thinking";
}
function gG4(H) {
  if (H.type === "redacted_thinking") return !0;
  if (H.type === "thinking" && "signature" in H && H.signature) return !0;
  return !1;
}

// READABLE (for understanding):
function isThinkingOrRedacted(block) {
  return block.type === "thinking" || block.type === "redacted_thinking";
}
function isSignedThinkingBlock(block) {
  if (block.type === "redacted_thinking") return true;          // always signed/opaque
  if (block.type === "thinking" && "signature" in block && block.signature) return true;
  return false;                                                  // unsigned thinking (e.g. partial stream) is NOT signed
}

// Mapping: wv$→isThinkingOrRedacted, gG4→isSignedThinkingBlock, H→block
```

The distinction is the crux of the fix. `isThinkingOrRedacted` (`wv$`) matches *any* thinking
block; `isSignedThinkingBlock` (`gG4`) matches only blocks that actually carry a signature
the server will verify — every `redacted_thinking`, and `thinking` blocks with a non-empty
`signature` field. An **unsigned** thinking block (e.g. a partial block from a cancelled
stream that never received its `signature_delta`) is *not* signed and therefore not the cause
of a signature 400; `gG4` correctly leaves it for other normalization paths.

### `stripSignedThinkingBlocks` (`cG4`) — the recovery primitive

```javascript
// ============================================
// stripSignedThinkingBlocks - remove signed thinking blocks; insert [Thinking removed] placeholder
// Location: cli_inner_pretty.js:446238-446252
// ============================================

// ORIGINAL (for source lookup):
function cG4(H) {
  let $ = !1,
    q = H.map((K) => {
      if (K.type !== "assistant" || !Array.isArray(K.message.content)) return K;
      let _ = K.message.content,
        z = _.filter((Y) => !gG4(Y));
      if (z.length === _.length) return K;
      $ = !0;
      let A = z.filter((Y) => Y.type !== "text" || Boolean(Y.text?.trim()));
      if (A.length === 0 || A.every((Y) => Y.type === "thinking" || Y.type === "redacted_thinking"))
        A.push({ type: "text", text: "[Thinking removed]", citations: [] });
      return { ...K, message: { ...K.message, content: A } };
    });
  return $ ? q : H;
}

// READABLE (for understanding):
function stripSignedThinkingBlocks(messages) {
  let changed = false;
  const result = messages.map((msg) => {
    if (msg.type !== "assistant" || !Array.isArray(msg.message.content)) return msg;
    const content = msg.message.content;
    const withoutSigned = content.filter((block) => !isSignedThinkingBlock(block));
    if (withoutSigned.length === content.length) return msg;        // nothing removed → keep ref
    changed = true;
    // Drop whitespace-only text blocks left behind.
    const cleaned = withoutSigned.filter((block) => block.type !== "text" || Boolean(block.text?.trim()));
    // If the message would now be empty or only-thinking, leave a visible marker.
    if (cleaned.length === 0 || cleaned.every((b) => b.type === "thinking" || b.type === "redacted_thinking"))
      cleaned.push({ type: "text", text: "[Thinking removed]", citations: [] });
    return { ...msg, message: { ...msg.message, content: cleaned } };
  });
  return changed ? result : messages;                               // identity-stable when no-op
}

// Mapping: cG4→stripSignedThinkingBlocks, gG4→isSignedThinkingBlock, H→messages, $→changed,
//          q→result, K→msg, _→content, z→withoutSigned, A→cleaned, Y→block
```

**How it works (step-by-step):**

1. Walk every message; skip anything that is not an assistant message with array content
   (cli_inner_pretty.js:446241).
2. Filter out signed blocks via `isSignedThinkingBlock` (cli_inner_pretty.js:446243).
3. If the filtered length equals the original, nothing was removed — **return the same
   message reference** so the top-level `changed` flag stays false for this entry
   (cli_inner_pretty.js:446244).
4. Otherwise set `changed = true` and additionally drop *whitespace-only text* blocks
   (cli_inner_pretty.js:446246) — these are often the stray `"\n\n"` text the model emits
   immediately before a thinking block, which would itself trigger a "text content blocks must
   contain non-whitespace text" 400 once the thinking block is gone.
5. If the cleaned content is now empty **or** consists only of thinking blocks (the message
   was thinking-dominant), push a `{type:"text", text:"[Thinking removed]"}` placeholder
   (cli_inner_pretty.js:446247-446248). The API forbids empty assistant content and forbids
   messages ending in thinking; the placeholder satisfies both and gives the user a visible
   trace of what happened.
6. Return the rebuilt array only if anything changed; otherwise return the original
   (cli_inner_pretty.js:446251) — this is the identity-stability the retry guard relies on.

**Why a placeholder instead of dropping the message:** removing the whole assistant turn would
desynchronize `tool_use`/`tool_result` pairing and lose the visible record of a reasoning step.
Replacing only the signed blocks with `[Thinking removed]` keeps message structure intact while
discarding exactly the bytes the server refused to verify.

### `filterSignedThinkingBlocks` (`HF6`) and `stripCrossModelThinkingBlocks` (`dG4`) — the cross-model preservation rule

```javascript
// ============================================
// filterSignedThinkingBlocks / stripCrossModelThinkingBlocks - preserve only same-model signed thinking
// Location: cli_inner_pretty.js:446218-446237
// ============================================

// ORIGINAL (for source lookup):
function HF6(H, $ = () => !0) {
  if (!H.some((_) => _.type === "assistant" && $(_))) return H;
  let q = !1,
    K = H.map((_) => {
      if (_.type !== "assistant") return _;
      if (!$(_)) return _;
      let z = _.message.content;
      if (!Array.isArray(z)) return _;
      let A = z.filter((Y) => {
        if (gG4(Y)) return !1;
        return !0;
      });
      if (A.length === z.length) return _;
      return ((q = !0), { ..._, message: { ..._.message, content: A } });
    });
  return q ? K : H;
}
function dG4(H, $) {
  return HF6(H, (q) => q.message.model !== CT && q.message.model !== $);
}

// READABLE (for understanding):
function filterSignedThinkingBlocks(messages, shouldFilter = () => true) {
  if (!messages.some((m) => m.type === "assistant" && shouldFilter(m))) return messages;
  let changed = false;
  const result = messages.map((msg) => {
    if (msg.type !== "assistant") return msg;
    if (!shouldFilter(msg)) return msg;                  // message exempt → keep its signed blocks
    const content = msg.message.content;
    if (!Array.isArray(content)) return msg;
    const filtered = content.filter((block) => !isSignedThinkingBlock(block));
    if (filtered.length === content.length) return msg;
    changed = true;
    return { ...msg, message: { ...msg.message, content: filtered } };
  });
  return changed ? result : messages;
}
function stripCrossModelThinkingBlocks(messages, currentModel) {
  // Strip signed thinking only from messages produced by a DIFFERENT model
  // (and never from synthetic <synthetic> messages). Same-model signed blocks are preserved.
  return filterSignedThinkingBlocks(
    messages,
    (msg) => msg.message.model !== SYNTHETIC_MODEL_MARKER && msg.message.model !== currentModel,
  );
}

// Mapping: HF6→filterSignedThinkingBlocks, dG4→stripCrossModelThinkingBlocks,
//          gG4→isSignedThinkingBlock, CT→SYNTHETIC_MODEL_MARKER, H→messages, $→shouldFilter/currentModel,
//          q→changed, K→result, _→msg, z→content, A→filtered, Y→block
```

`HF6` is the *general* form: it takes a predicate selecting which assistant messages to filter,
then strips signed blocks (no placeholder — it does not need one because it leaves at least the
non-thinking content of the message). `dG4` specializes it into the **cross-model preservation
rule**: strip signed thinking blocks **only** from messages whose `message.model` is neither the
current model nor the `"<synthetic>"` sentinel (`CT`, cli_inner_pretty.js:143447).

**Why preserve same-model thinking but strip cross-model:** a signature is only verifiable by
the model context that produced it. Replaying *opus48*'s signed thinking back to *opus48* is the
intended, supported path — those blocks should be preserved for full reasoning continuity.
Replaying them to a *different* model (e.g. after a fallback or a `/model` switch) would 400, so
they are stripped proactively at request-build time. This is the **proactive** counterpart to
the **reactive** `cG4` retry: `dG4` runs on every request to prevent the predictable cross-model
400, while `cG4` only fires after the server actually rejects a same-model signature it could not
verify (a credential/tamper situation `dG4` cannot predict).

**Call site (cli_inner_pretty.js:557020):**

```javascript
// ORIGINAL:
let E = dG4(H, vP(z.model)),  ...
// READABLE:
let normalized = stripCrossModelThinkingBlocks(messages, stripContextSuffix(queryConfig.model));
```

Here `vP` (`stripContextSuffix`, cli_inner_pretty.js:98935-98937) removes the `[1m]`/`[2m]`
context-tier suffix from the model id before comparison, so a 1M-context variant of opus48 is
treated as the same model as its base — its signed thinking is preserved rather than needlessly
stripped.

### `filterTrailingThinkingBlocks` (`pQ_`) — the trailing-thinking guard

```javascript
// ============================================
// filterTrailingThinkingBlocks - the API forbids assistant messages ending in thinking blocks
// Location: cli_inner_pretty.js:446091-446110
// ============================================

// ORIGINAL (for source lookup):
function pQ_(H) {
  let $ = H.at(-1);
  if (!$ || $.type !== "assistant") return H;
  let q = $.message.content,
    K = q.at(-1);
  if (!K || !wv$(K)) return H;
  let _ = q.length - 1;
  while (_ >= 0) {
    let Y = q[_];
    if (!Y || !wv$(Y)) break;
    _--;
  }
  d("tengu_filtered_trailing_thinking_block", {
    messageUUID: $.uuid,
    blocksRemoved: q.length - _ - 1,
    remainingBlocks: _ + 1,
  });
  let z = _ < 0 ? [{ type: "text", text: "[No message content]", citations: [] }] : q.slice(0, _ + 1),
    A = [...H];
  return ((A[H.length - 1] = { ...$, message: { ...$.message, content: z } }), A);
}

// READABLE (for understanding):
function filterTrailingThinkingBlocks(messages) {
  const last = messages.at(-1);
  if (!last || last.type !== "assistant") return messages;       // only acts on a trailing assistant msg
  const content = last.message.content;
  const lastBlock = content.at(-1);
  if (!lastBlock || !isThinkingOrRedacted(lastBlock)) return messages;  // no trailing thinking → no-op
  // Walk backward past the contiguous run of trailing thinking blocks.
  let lastValidIndex = content.length - 1;
  while (lastValidIndex >= 0) {
    const block = content[lastValidIndex];
    if (!block || !isThinkingOrRedacted(block)) break;
    lastValidIndex--;
  }
  logEvent("tengu_filtered_trailing_thinking_block", {
    messageUUID: last.uuid,
    blocksRemoved: content.length - lastValidIndex - 1,
    remainingBlocks: lastValidIndex + 1,
  });
  const newContent = lastValidIndex < 0
    ? [{ type: "text", text: "[No message content]", citations: [] }]
    : content.slice(0, lastValidIndex + 1);
  const result = [...messages];
  result[messages.length - 1] = { ...last, message: { ...last.message, content: newContent } };
  return result;
}

// Mapping: pQ_→filterTrailingThinkingBlocks, wv$→isThinkingOrRedacted, H→messages, $→last,
//          q→content, K→lastBlock, _→lastValidIndex, Y→block, z→newContent, A→result
```

This guard exists because the API additionally forbids an assistant message from *ending* with
a thinking/redacted_thinking block (the final block must be text or tool_use). It uses the
*broad* `wv$` predicate (any thinking block, signed or not) because the constraint here is
structural — trailing thinking — not signature-based. It emits
`tengu_filtered_trailing_thinking_block` recording how many blocks it removed. Note this is a
*different* concern from `cG4`: `cG4` removes signed blocks anywhere because their signatures
failed; `pQ_` removes trailing thinking everywhere because of message-shape rules.

---

## The normal (success-path) signature flow

For contrast, here is how a signature is *assembled* during a successful stream — the data the
strip path exists to defend. There are two parallel handlers because the SDK maintains both an
event-emitter view and a message-accumulator view.

```javascript
// ============================================
// Signature assembly during streaming - thinking_delta accumulates text, signature_delta sets signature
// Location: cli_inner_pretty.js:6356-6361 (emitter) and 6455-6460 (accumulator)
// ============================================

// ORIGINAL (for source lookup):
// emitter view (6356-6361):
case "thinking_delta": {
  if (K.type === "thinking") this._emit("thinking", $.delta.thinking, K.thinking);
  break;
}
case "signature_delta": {
  if (K.type === "thinking") this._emit("signature", K.signature);
  break;
}
// accumulator view (6455-6460):
case "thinking_delta": {
  if (K?.type === "thinking") q.content[$.index] = { ...K, thinking: K.thinking + $.delta.thinking };
  break;
}
case "signature_delta": {
  if (K?.type === "thinking") q.content[$.index] = { ...K, signature: $.delta.signature };
  break;
}

// READABLE (for understanding):
// thinking_delta APPENDS streamed reasoning text to the current thinking block.
case "thinking_delta":
  if (block.type === "thinking") emit("thinking", delta.thinking, block.thinking);
  break;
// signature_delta REPLACES the block's signature with the final server-issued value.
case "signature_delta":
  if (block.type === "thinking") emit("signature", block.signature);   // emitter
  // accumulator: content[index] = { ...block, signature: delta.signature };
  break;

// Mapping: K→block, $→event, q→accumulatedMessage; thinking is appended, signature is assigned-last
```

The accumulator (cli_inner_pretty.js:6455-6460) shows the key contract: `thinking_delta`s are
*appended* (`K.thinking + $.delta.thinking`) building the reasoning text incrementally, then a
single `signature_delta` *assigns* the final signature (`signature: $.delta.signature`). The
signature therefore covers the fully-assembled thinking text — which is exactly why any later
byte-level change invalidates it.

On the UI/telemetry side, a `signature_delta` is surfaced as a `thinking_signature` progress
event carrying only the signature *length* (not the value):

```javascript
// ============================================
// thinking_signature progress event - reports signature char count to the UI (value never logged)
// Location: cli_inner_pretty.js:445211-445218
// ============================================

// ORIGINAL (for source lookup):
case "thinking_delta": {
  let { delta: j } = H.event;
  if ("estimated_tokens" in j && typeof j.estimated_tokens === "number")
    f?.({ type: "thinking_progress", estimatedTokensDelta: j.estimated_tokens });
  return;
}
case "signature_delta":
  f?.({ type: "thinking_signature", chars: rG6(H.event.delta.signature.length) });
  return;

// READABLE (for understanding):
case "thinking_delta": {
  const { delta } = event.event;
  if ("estimated_tokens" in delta && typeof delta.estimated_tokens === "number")
    onProgress?.({ type: "thinking_progress", estimatedTokensDelta: delta.estimated_tokens });
  return;
}
case "signature_delta":
  onProgress?.({ type: "thinking_signature", chars: bucketize(event.event.delta.signature.length) });
  return;

// Mapping: j→delta, f→onProgress, rG6→bucketize (length-bucketing helper)
```

Only the bucketized character count is reported (`rG6(...length)`), never the signature bytes —
a small privacy/log-hygiene detail consistent with treating the signature as opaque.

---

## Why strip-and-retry is the safe recovery

A signature 400 means the server determined a replayed thinking block does not match its
signature. The client has three options:

1. **Re-send unchanged** — guaranteed to 400 again; useless (the identity guard explicitly
   prevents this).
2. **Try to "repair" the block** — impossible: the client cannot re-sign; only the server can
   produce a valid signature, and it will only do so by *regenerating* the reasoning.
3. **Strip the signed blocks and retry** — the request becomes a normal request with no signed
   thinking to verify; the model simply re-reasons fresh on this turn.

Option 3 is the only correct recovery, and it is *safe*:

- It removes exactly the bytes the server rejected (signed blocks) and nothing else — unsigned
  thinking, text, and tool_use survive.
- The `[Thinking removed]` placeholder keeps message structure valid and gives a visible trace.
- The identity-stable return makes the retry idempotent: a second signature 400 on a history
  that has *no* signed blocks left will strip nothing, return the same reference, and fall
  through instead of looping.
- It loses only *cached reasoning* for that turn, not user content or tool results — the worst
  case is the model spends a few extra thinking tokens re-deriving a step.

**Key insight:** signatures exist to let the server trust client-replayed reasoning without
re-deriving it. The moment that trust breaks (tampering, credential change, verification
failure), the safest move is to discard the untrusted artifact and let the server do what it
always *can* do — reason from scratch. Strip-and-retry is just "fall back to the no-cache path."

---

## Cross-validation against v2.1.88

| Aspect | v2.1.88 (readable source) | v2.1.156 | Verdict |
|--------|---------------------------|----------|---------|
| 400-error matcher for thinking signatures | **none** | `B87` (cli_inner_pretty.js:186575) | **NEW** |
| Dedicated strip-and-retry on signature 400 | **none** | `B87`→`cG4` + `tengu_thinking_signature_strip_retry` (557413) | **NEW** |
| Signature stripping primitive | `stripSignatureBlocks` (src/utils/messages.ts:5066) | `cG4`/`HF6` (446218-446252) | precursor exists |
| Trailing-thinking filter | `filterTrailingThinkingFromLastAssistant` (src/utils/messages.ts:4781) | `pQ_` (446091-446110) | precursor exists |
| `tengu_filtered_trailing_thinking_block` event | yes (src/utils/messages.ts:4806) | yes (446103) | unchanged |

The decisive difference is the **trigger model**:

- In **2.1.88**, `stripSignatureBlocks` was invoked **proactively** on the *model-fallback* path
  only, and was gated to internal users: the comment reads *"Thinking signatures are
  model-bound: replaying a protected-thinking block (e.g. capybara) to an unprotected fallback
  (e.g. opus) 400s. Strip before retry"* with `if (process.env.USER_TYPE === 'ant')
  messagesForQuery = stripSignatureBlocks(messagesForQuery)` (src/query.ts:924-929). There was
  **no reactive matcher** that inspected an actual 400 error message — the strip happened
  speculatively when the model changed.

- In **2.1.156**, the proactive cross-model strip is generalized into `dG4` (run unconditionally
  at request build, cli_inner_pretty.js:557020) **and** a new *reactive* layer is added: `B87`
  classifies a real 400 by its message text, and `cG4` strips + retries with the new
  `tengu_thinking_signature_strip_retry` telemetry. Crucially, `cG4`/`gG4` now strip only
  **signed** blocks (`gG4` requires a non-empty `signature` or `redacted_thinking`), whereas
  2.1.88's `stripSignatureBlocks` removed *all* thinking blocks. This narrowing preserves
  unsigned/partial thinking that is not the cause of the error.

**Confidence:** medium-high. The stripping/normalization mechanism is a verified evolution of
2.1.88 code (high confidence on the primitives). The `B87` matcher, the
`"signature in thinking block"`/`"invalid signature"` phrase set, the signed-only narrowing in
`gG4`, and the `tengu_thinking_signature_strip_retry` retry path are **new post-2.1.88** with no
precursor matcher (medium-high confidence on attributing them to the 2.1.156 Opus-4.8 hotfix,
consistent with the changelog and scout dossier line 98).

---

## Summary

The 2.1.156 hotfix closes a gap between two recovery styles. The 2.1.88 code could only avoid
signature 400s *proactively* on a model switch; it had no answer when the server rejected a
*same-model* signature it could no longer verify (tampering, credential rotation, partial-stream
mutation). 2.1.156 adds the reactive half: `isThinkingSignatureError` (`B87`) detects the 400
from its message text, `stripSignedThinkingBlocks` (`cG4`) discards exactly the signed blocks
(leaving a `[Thinking removed]` placeholder), and the request retries once with clean history —
guarded by reference-equality so it can never loop. Together with the proactive cross-model
strip `stripCrossModelThinkingBlocks` (`dG4`) and the structural `filterTrailingThinkingBlocks`
(`pQ_`), Opus 4.8's default-on thinking gets a complete defense layer against the full range of
thinking-block 400s.
