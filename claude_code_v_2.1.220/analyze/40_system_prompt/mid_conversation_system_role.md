# The mid-conversation `role: "system"` channel

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

The changelog spends exactly one bullet on this subsystem in the whole 25-release window
(`.201`, a single-item release) and two more on its caching behaviour (`.211`, `.212`). What actually
happened is larger: between 2.1.193 and 2.1.220 the mid-conversation system turn went from *one thing*
(a place to put harness reminders on three named models) to a **general-purpose out-of-band control
channel** that carries reminders, a per-turn effort directive, and the conversation's cache breakpoint —
with a three-level fallback ladder underneath it.

---

## 1. What the capability is

The Anthropic Messages API normally takes instructions in the top-level `system` field, fixed for the whole
request. A **mid-conversation system message** is an entry in `messages` with `role: "system"`, appearing
*after* the conversation has started. The bundle's own `claude-api` skill documents the contract at
`:793005`:

> `For operator instructions that arrive mid-conversation (mode switches, injected state), append`
> `` `{"role": "system", ...}` `` `to` `` `messages` `` `instead of editing top-level` `` `system` `` `— this preserves the cached prefix and carries operator authority. Must follow a user message (or an` `assistant` `message ending in server-tool use), and must be either the last entry in` `messages` `or be followed by an` `assistant` `turn; cannot be` `messages[0]` `. Unsupported models return a 400 (` `role 'system' is not supported on this model` `).`

That paragraph is the spec every mechanism below implements. Three consequences drive the design:

1. **Not all models support it** → a capability gate (§2).
2. **Placement is constrained** → a demotion pass that rewrites illegal placements into user messages (§4).
3. **It preserves the cached prefix** → the cache breakpoint wants to sit *on* it (§5).

The wire opt-in is the beta header `mid-conversation-system-2026-04-07`, declared at `:109214`:

```javascript
(aW = WA("mid_conversation_system", "mid-conversation-system-2026-04-07")),
```

pushed onto the request's beta list at `:150547` (`if (Ser(e)) t.push(aW);`). The literal is
**220=1 / 193=1** — the header is pure carryover, which is exactly why counting it tells you nothing.

---

## 2. `supportsMidConversationSystem` — the capability resolver

### The function, both builds

```javascript
// ============================================
// supportsMidConversationSystem - decides whether a model accepts a role:"system" turn mid-conversation
// Location: cli_inner_pretty.js:150505-150526
// ============================================

// ORIGINAL (for source lookup):
  Ser = Vr((e) => {
    if (iY("hipaa")) return !1;
    if (Z.CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM) return !0;
    let t = Ede(e, "mid_conversation_system");
    if (t !== void 0) return t;
    let r = lo(e);
    if (
      r.includes("claude-3-") || r === "claude-opus-4-0" || r === "claude-opus-4-1" ||
      r === "claude-opus-4-5" || r === "claude-opus-4-6" || r === "claude-opus-4-7" ||
      r === "claude-sonnet-4-0" || r === "claude-sonnet-4-5" || r === "claude-sonnet-4-6" ||
      r === "claude-haiku-4-5"
    )
      return !1;
    if (M$(r, "mid_conv_system") || r === "claude-mythos-5") return !0;
    return dj(ny(e));
  });

// READABLE (for understanding):
  supportsMidConversationSystem = memoize((modelId) => {
    if (isComplianceMode("hipaa")) return false;                        // 1. compliance kill switch
    if (env.CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM) return true;     // 2. operator force-on
    let override = getCustomModelCapabilityOverride(modelId, "mid_conversation_system");
    if (override !== undefined) return override;                        // 3. per-model env override
    let id = normalizeModelId(modelId);
    if (TEN_KNOWN_UNSUPPORTED_IDS.includes(id)) return false;           // 4. explicit deny list
    if (modelHasCapability(id, "mid_conv_system") || id === "claude-mythos-5") return true;  // 5. catalogue
    return isFirstPartyProviderWithBetas(resolveProvider(modelId));     // 6. optimistic default
  });

// Mapping: Ser→supportsMidConversationSystem, Vr→memoize, iY→isComplianceMode,
//          Ede→getCustomModelCapabilityOverride, lo→normalizeModelId, M$→modelHasCapability,
//          dj→isFirstPartyProviderWithBetas, ny→resolveProvider
```

The 2.1.193 twin (`TAn`, `:135284-135304 (193)`) is **structurally identical** for steps 1–4 and 6. The only
difference is step 5:

| | 2.1.193 `:135303` | 2.1.220 `:150524` |
|---|---|---|
| allow test | `if (n === "claude-fable-5" \|\| n === "claude-mythos-5" \|\| n === "claude-opus-4-8") return !0;` | `if (M$(r, "mid_conv_system") \|\| r === "claude-mythos-5") return !0;` |
| shape | hardcoded three-id list | catalogue capability lookup + one name special case |
| deny list | identical 10 ids | identical 10 ids |

### Why the refactor, and why `claude-mythos-5` survives as a name

**What it does:** replaces a hardcoded allow-list with a data lookup against the baked-in model catalogue
(`:14007-14700`), so adding a model to the catalogue automatically grants it the capability.

**How it works:**
1. `M$(id, cap)` (`:14517-14522`) strips the `[1m]` context suffix, looks the id up in the catalogue map,
   and returns `entry.capabilities.includes(cap) ? true : undefined`. Note it returns **`undefined`, not
   `false`**, when the model is known but lacks the capability — so a known-but-uncapable model falls through
   to the optimistic default at step 6 rather than being denied.
2. `claude-mythos-5` (`:14439`) is in the catalogue but its `capabilities` array is **`[]`** and every
   `provider_ids` value is `null` — it is an unannounced family with a stub entry. The lookup therefore
   returns `undefined` for it, and the `|| r === "claude-mythos-5"` clause exists purely to keep it working
   while its catalogue row stays empty.

**Why this approach:** the deny list is kept *ahead* of the catalogue lookup even though the catalogue could
express "no capability". That ordering is deliberate — step 6's default is **optimistic** (any first-party
model with betas enabled is assumed to support the role), so without an explicit deny list every legacy
model would be probed with a header the server will 400 on. The deny list is a *cost* optimisation for
known-bad ids, the catalogue is the *authority* for known-good ids, and the optimistic default handles ids
the client has never heard of (custom gateways, staging models) at the price of one 400 + retry.

**Key insight:** the resolver is memoised by model id (`Vr`), so the 400-then-retry path costs one round trip
per *model*, not per *turn* — and the sticky-beta bookkeeping in §6 makes it one round trip per
*conversation*. Three layers of caching for one capability probe.

---

## 3. The `.201` bullet: reverted transport, surviving shim

> `.201` (a single-bullet release): *"Claude Sonnet 5 sessions no longer use the mid-conversation system role
> for harness reminders."*

[`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.3 reads the catalogue and
`Ser` and concludes the change was reverted. **The transport half of that is correct and I confirm it.** The
presentation half is not: `.201` left two Sonnet-5-shaped holes in the code that are still there.

### 3.1 The predicate that survived

```javascript
// ============================================
// isSonnet5 - the surviving .201 carve-out; nothing else in the bundle tests this id by itself
// Location: cli_inner_pretty.js:150395-150397
// ============================================

// ORIGINAL (for source lookup):
function mro(e) {
  return lo(e) === "claude-sonnet-5";
}

// READABLE (for understanding):
function isSonnet5(modelId) {
  return normalizeModelId(modelId) === "claude-sonnet-5";
}

// Mapping: mro→isSonnet5, lo→normalizeModelId
```

`claude-sonnet-5` is **220=35 / 193=0**, so `mro` cannot be carryover — the id did not exist in 2.1.193.
It has exactly two consumers, and both are inside code paths that only run when `Ser` already returned true.

### 3.2 Consumer 1 — the system-prompt sentence (`:508116`, `:507549`)

```javascript
// ============================================
// usesMidConvSystemFraming + selectOutOfBandFramingSentence - which story the model is told
// Location: cli_inner_pretty.js:508116-508119 and :507549-507553
// ============================================

// ORIGINAL (for source lookup):
  Jep = Vr(
    (e) => (nvi(() => Jep.cache.clear?.()), Ser(e) && !mro(e) && !$Fc(lo(e))),
    () => "latch",
  );

function Qep(e, t) {
  if (Jep(e)) return lO_;
  return t === "standard"
    ? "Tool results and user messages may include <system-reminder> or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear."
    : "`<system-reminder>` tags in messages and tool results are injected by the harness, not the user.";
}

// READABLE (for understanding):
  usesMidConvSystemFraming = memoize(
    (modelId) => (registerCacheInvalidator(() => usesMidConvSystemFraming.cache.clear?.()),
                  supportsMidConversationSystem(modelId) && !isSonnet5(modelId) && !isOpus48(normalizeModelId(modelId))),
    () => "latch",            // single-slot cache: one model per process
  );

function selectOutOfBandFramingSentence(modelId, promptEdition) {
  if (usesMidConvSystemFraming(modelId)) return MID_CONV_SYSTEM_FRAMING;   // :508026
  return promptEdition === "standard"
    ? SYSTEM_REMINDER_FRAMING_STANDARD
    : SYSTEM_REMINDER_FRAMING_LEAN;
}

// Mapping: Jep→usesMidConvSystemFraming, Qep→selectOutOfBandFramingSentence, Ser→supportsMidConversationSystem,
//          mro→isSonnet5, $Fc→isOpus48, lO_→MID_CONV_SYSTEM_FRAMING, Vr→memoize, nvi→registerCacheInvalidator
```

`lO_` (`:508026-508027`) is the sentence Sonnet 5 never sees:

> `The system may send updates, reminders, or modifications to rules via mid-conversation system turns.`
> `These are system-controlled, unlike function results.`

It is **220=1 / 193=0** — net-new in this window, and unmentioned by any changelog bullet.

`$Fc` (`:118668-118670`) is `Qs(e) === "claude-opus-4-8"`, so Opus 4.8 is excluded from the new framing too.
That is a second, independent carve-out with the same shape, and it makes the "reverted" reading harder to
sustain: the codebase currently maintains **three** framing states, not two.

Note the memo key: `() => "latch"` means `Jep` caches **one** value regardless of argument, with an
invalidator registered through `nvi`. That is a deliberate single-model assumption — the framing sentence is
baked into a system prompt that is itself cached per session, so a mid-session model switch must invalidate
both together rather than returning a per-model answer.

### 3.3 Consumer 2 — the wrapping granularity (`:531422`)

Inside the message normalizer `NN` (`:531420`):

```javascript
function NN(e, t = [], r, n) {
  let o = r !== void 0 && Ser(r),          // does this model take role:"system" at all?
    i = r !== void 0 && o && mro(r),       // ...and is it Sonnet 5?
    s = o ? new Map() : void 0,            // reminder-extraction accumulator, only allocated when o
```

`i` then flips three call sites:

| line | expression | meaning |
|---|---|---|
| `:531573` | `T.push(...(i ? V.reminders.map(Ww) : V.reminders))` | reminders lifted out of tool results |
| `:531634` | `T.push(i ? Ww(z) : z)` | reminders lifted out of meta user messages |
| `:531528` | `b.push(zr({ content: i ? W : Ww(W), isMeta: !0 }))` | the flush fallback when no `api_system` slot exists |
| `:531783` | `r.push(zr({ content: t ? o.message.content : Ww(o.message.content), isMeta: !0 }))` | the demotion path (`t` is `i`) |

`Ww` (`:532376-532380`) is just the tag wrapper:

```javascript
function Ww(e) {
  return `<system-reminder>\n${e}\n</system-reminder>`;
}
```

**What this achieves:** for Sonnet 5, each reminder is wrapped **individually** and the aggregate is *not*
re-wrapped; for every other mid-conv-system model, reminders are collected **raw** and only the fallback
aggregate gets a single wrapper. So the bytes Sonnet 5 sees inside a `role: "system"` turn are identical to
the bytes it saw in a user turn before `.201` — same tags, same per-reminder boundaries.

**Why do it this way rather than reverting `.201` cleanly?** Two forces pull in opposite directions:

- The *transport* wants to be uniform: one code path, one beta header, one cache-breakpoint rule. Special
  cases in the transport multiply against the placement rules in §4 and the fallback ladder in §6.
- The *model* is a fixed artefact. Sonnet 5 was trained and evaluated against `<system-reminder>`-tagged
  reminders; feeding it bare text in a system turn is an unvalidated prompt change on the default model.

Keeping the carve-out at the *serialization* layer — the last place before the bytes go on the wire —
gets the uniform transport and the familiar presentation at the cost of one boolean threaded through four
call sites. The alternative (branching `Ser` itself, which is what `.201` actually did) costs the cache
promotion in §5 and the per-turn-effort channel in §7 for the default model, because both are gated on
`o = Ser(r)`.

**Key insight and the honest verdict:** the `.201` bullet as written — *"no longer use the mid-conversation
system role"* — is **false for 2.1.220**: Sonnet 5 requests carry the beta header and `role: "system"`
entries. But the *user-visible effect* the bullet was reaching for — Sonnet 5 keeps seeing
`<system-reminder>` — is **still true**, implemented one layer lower. A reader who takes §6.3 at face value
and writes "Sonnet 5 now gets the mid-conversation system framing" would be wrong twice over: wrong about the
prompt sentence (`Jep` excludes it) and wrong about the payload shape (`mro` re-wraps it).

---

## 4. Assembly and placement — where an `api_system` message comes from

Internal messages are typed; `api_system` is one of the types, minted only here:

```javascript
// ============================================
// makeApiSystemMessage - the only constructor for a mid-conversation system message
// Location: cli_inner_pretty.js:157377-157384
// ============================================

// ORIGINAL (for source lookup):
function Jno(e) {
  return {
    type: "api_system",
    message: { role: "system", content: e },
    uuid: cru.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

// READABLE (for understanding):
function makeApiSystemMessage(text) {
  return {
    type: "api_system",
    message: { role: "system", content: text },
    uuid: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

// Mapping: Jno→makeApiSystemMessage, cru→crypto
```

The flush closure inside `NN` (`:531516-531529`) decides between the three destinations:

```javascript
  function H() {
    if (T.length === 0) return;                     // nothing accumulated -> no-op
    let W = T.join("\n\n");
    T.length = 0;
    let q = hV(b);                                  // last message emitted so far
    if (q?.type === "api_system") q.message.content += `\n\n${W}`;   // (a) merge into the open block
    else if (q?.type === "user") ((C = !0), b.push(Jno(W)));         // (b) legal: follows a user message
    else b.push(zr({ content: i ? W : Ww(W), isMeta: !0 }));         // (c) illegal here -> meta user message
  }
```

`T` is only ever appended to inside `if (o)` / `if (s)` branches, and `s = o ? new Map() : void 0`, so when
`Ser` is false `T` stays empty and `H()` is a no-op — no `api_system` message is ever minted. That is the
single gate for the whole feature.

Branch (b) implements the spec's *"must follow a user message"*. Branch (a) implements a merge so two
adjacent reminder batches become one system block rather than two — which matters because the API also
requires the block be last-or-followed-by-assistant, and two consecutive system blocks would violate that.

### 4.1 The demotion pass

Branch (b) checks the *predecessor* but cannot check the *successor*, which is not known yet. A second pass
fixes that after the whole list is built. It runs only when at least one `api_system` was emitted
(`C`) and the model supports the role: `if (o) D = C ? cU_($, i) : $;` (`:531655`).

```javascript
// ============================================
// enforceApiSystemPlacement - rewrites illegally-placed system turns into meta user messages
// Location: cli_inner_pretty.js:531760-531786
// ============================================

// ORIGINAL (for source lookup):
function cU_(e, t) {
  let r;
  for (let n = 0; n < e.length; n++) {
    let o = e[n];
    if (o.type !== "api_system") { r?.push(o); continue; }
    let i = r ? r.at(-1) : e[n - 1],
      s = e[n + 1];
    if (i?.type === "api_system") {
      ((r ??= e.slice(0, n)), (i.message.content += `\n\n${o.message.content}`));
      continue;
    }
    let a = i?.type === "user",
      l = s === void 0 || s.type === "assistant" || s.type === "api_system";
    if (a && l) { r?.push(o); continue; }
    ((r ??= e.slice(0, n)), r.push(zr({ content: t ? o.message.content : Ww(o.message.content), isMeta: !0 })));
  }
  return r ? ylp(r) : e;
}

// READABLE (for understanding):
function enforceApiSystemPlacement(messages, isSonnet5Shim) {
  let out;                                          // stays undefined while nothing has changed
  for (let idx = 0; idx < messages.length; idx++) {
    let msg = messages[idx];
    if (msg.type !== "api_system") { out?.push(msg); continue; }
    let prev = out ? out.at(-1) : messages[idx - 1],
      next = messages[idx + 1];
    if (prev?.type === "api_system") {              // coalesce adjacent system turns
      out ??= messages.slice(0, idx);
      prev.message.content += `\n\n${msg.message.content}`;
      continue;
    }
    let followsUser = prev?.type === "user",
      lastOrBeforeAssistant = next === undefined || next.type === "assistant" || next.type === "api_system";
    if (followsUser && lastOrBeforeAssistant) { out?.push(msg); continue; }   // legal, keep
    out ??= messages.slice(0, idx);                                           // illegal -> demote
    out.push(makeMetaUserMessage({
      content: isSonnet5Shim ? msg.message.content : wrapInSystemReminder(msg.message.content),
      isMeta: true,
    }));
  }
  return out ? mergeAdjacentUserMessages(out) : messages;
}

// Mapping: cU_→enforceApiSystemPlacement, zr→makeMetaUserMessage, Ww→wrapInSystemReminder,
//          ylp→mergeAdjacentUserMessages, t→isSonnet5Shim
```

**Why a copy-on-write pass rather than building it right the first time?** The `out ??= messages.slice(0, n)`
idiom means the common case — every system turn legally placed — allocates nothing and returns the original
array by identity. The pass is O(n) with zero allocation on the happy path, which matters because it runs on
every request over the full message history.

**Why demote instead of dropping?** The content is a harness reminder the model is supposed to see. Dropping
it would silently change behaviour based on an API placement rule the model knows nothing about. Demoting to
a meta user message reproduces the pre-`.201` transport exactly, and the `isSonnet5Shim` argument makes the
demoted bytes byte-identical to what that model would have received anyway.

**Key insight:** the demotion path is *also* the Sonnet-5 shim's home. `t ? content : Ww(content)` is the
same conditional as `:531528`, because both are answering the same question — "has this text already been
individually wrapped upstream?" For Sonnet 5 the answer is yes, so the wrapper must not be applied twice.

---

## 5. `.211` — the trailing system block was being re-billed on every request

> *"Fixed a prompt-caching regression on Bedrock, Vertex, Mantle, and Foundry that billed the trailing system
> context block as fresh input tokens on every request."*

**Verdict: NET_NEW, and it is a five-token change with a large effect.** This is the cleanest before/after
pair in the module.

### 5.1 What 2.1.193 did

```javascript
// 2.1.193 :596391-596427  (PGf)
function PGf(e, t, n, r = !1, o) {
  let s = (u) => { let d = u; while (d >= 0 && e[d].type === "api_system") d--; return d; },
    i = s(e.length - 1);            // <- skips BACKWARDS past every api_system message
  ...
  e.map((u, d) => {
    let p = a.has(d);
    if (u.type === "user") return SGf(u, p, t, n);
    if (u.type === "api_system") return { role: "system", content: u.message.content };   // <- never cached
    return EGf(u, p, t, n);
  })
}
```

Two facts combine into the bug: the breakpoint index search **skips `api_system` messages**, and the
`api_system` serializer emits a bare `{role, content}` with **no `cache_control` field ever**. So when the
last message in the body was a system block — which is the normal case, because reminders are appended at
the end of the turn — the cache breakpoint landed on the message *before* it, and the system block sat
outside the cached prefix. Every request re-uploaded it as fresh input tokens.

The bullet names Bedrock/Vertex/Mantle/Foundry, but the code path is provider-agnostic; those are simply the
providers where the caching-cost delta was measured.

### 5.2 What 2.1.220 does

```javascript
// ============================================
// placeCacheBreakpoints - promotes the cache breakpoint onto the trailing api_system block
// Location: cli_inner_pretty.js:511886-511950
// ============================================

// ORIGINAL (for source lookup):
function g1_(e, t, r, n = !1, o, i = !1) {
  let s = (_) => {
      if (_.type !== "assistant") return !0;
      let E = _.message.content;
      if (typeof E === "string") return !0;
      let A = E.at(-1);
      return A !== void 0 && A.type !== "thinking" && A.type !== "redacted_thinking" && !GW(A);
    },
    a = (_) => { let E = _; while (E >= 0 && (e[E].type === "api_system" || !s(e[E]))) E--; return E; },
    l = a(e.length - 1);
  if (n) l = a(l - 1);
  let c = !i && !w_e(),
    u = e.length - 1,
    d = e[u],
    p = d !== void 0 && d.type === "api_system" && typeof d.message.content === "string" && d.message.content.trim() !== "",
    f = c && t && !n && l >= 0 && p ? u : l,
    m = new Set();
  if (f >= 0) m.add(f);
  ...
    e.map((_, E) => {
      let A = m.has(E);
      if (_.type === "user") return QO_(_, A, t, r);
      if (_.type === "api_system")
        return {
          role: "system",
          content: A && t && c
            ? [{ type: "text", text: _.message.content, cache_control: GEe({ ttl: r }) }]
            : _.message.content || [],
          ...(_.outputConfig && { output_config: _.outputConfig }),
        };
      return ZO_(_, A, t, r);
    })
}

// READABLE (for understanding):
function placeCacheBreakpoints(messages, cachingEnabled, cacheTtl, skipCacheWrite = false,
                               forkPointUuid, promotionRejected = false) {
  let canCarryBreakpoint = (msg) => {                       // NEW in 220: assistant tail-block test
      if (msg.type !== "assistant") return true;
      let content = msg.message.content;
      if (typeof content === "string") return true;
      let last = content.at(-1);
      return last !== undefined && last.type !== "thinking" && last.type !== "redacted_thinking" && !isServerToolUse(last);
    },
    lastNonSystemCarrier = (from) => {                      // walk back past api_system AND non-carriers
      let i = from;
      while (i >= 0 && (messages[i].type === "api_system" || !canCarryBreakpoint(messages[i]))) i--;
      return i;
    },
    carrierIdx = lastNonSystemCarrier(messages.length - 1);
  if (skipCacheWrite) carrierIdx = lastNonSystemCarrier(carrierIdx - 1);

  let promotionAllowed = !promotionRejected && !experimentalBetasDisabled(),
    tailIdx = messages.length - 1,
    tail = messages[tailIdx],
    tailIsUsableSystemBlock =
      tail !== undefined && tail.type === "api_system" &&
      typeof tail.message.content === "string" && tail.message.content.trim() !== "",
    breakpointIdx =
      promotionAllowed && cachingEnabled && !skipCacheWrite && carrierIdx >= 0 && tailIsUsableSystemBlock
        ? tailIdx            // <- THE .211 FIX: put it on the system block itself
        : carrierIdx,        // <- 2.1.193 behaviour
    marks = new Set();
  if (breakpointIdx >= 0) marks.add(breakpointIdx);
  ...
}

// Mapping: g1_→placeCacheBreakpoints, s→canCarryBreakpoint, a→lastNonSystemCarrier, GW→isServerToolUse,
//          w_e→experimentalBetasDisabled, GEe→buildCacheControl, i→promotionRejected, f→breakpointIdx
```

**How it works, step by step:**

1. `canCarryBreakpoint` is itself new in 220 (193's walker only skipped `api_system`). An assistant message
   whose **last** content block is `thinking`, `redacted_thinking`, or a server tool use cannot carry a
   `cache_control` marker, because the server rewrites those blocks. Landing a breakpoint there produces a
   cache miss on every subsequent request — a silent, expensive failure. 220 walks past them.
2. `carrierIdx` is the 193 answer: the last message that is neither a system block nor an unusable assistant
   tail.
3. `tailIsUsableSystemBlock` guards the promotion with three conditions: the tail really is an `api_system`,
   its content is a **string** (not an array — an already-structured block might carry its own
   `cache_control`), and it is not blank. A blank system block would burn the breakpoint on zero tokens.
4. `carrierIdx >= 0` is the non-obvious one: **the promotion requires that a legal carrier exists behind the
   system block.** If the system block is the only cacheable thing in the body there is nothing to cache a
   prefix *of*, and the promotion is skipped.
5. `!skipCacheWrite` — when the caller has asked not to write cache (e.g. a one-shot sub-query), the
   promotion is pointless.
6. The serializer then emits the block as an **array** with a `cache_control` entry, and — new in 220 —
   forwards `output_config` when present (§7).

**Why promote rather than add a second breakpoint?** Breakpoints are a scarce resource (the API caps them,
and the code already spends one on the fork point when `tpr()` is set, `:511913-511925`). Promoting moves the
existing marker forward by one message and captures strictly more of the body; adding a second would consume
budget the fork-point pin needs.

**Who consumes the result:** `:509728` calls it and immediately derives `K`:

```javascript
let $u = g1_(trp(z, ss), oo, oe, i.skipCacheWrite, i.forkPointUuid, q3(M, r5r) || uvi());
K = $u.some((kn) => kn.role === "system" && Array.isArray(kn.content) &&
      kn.content.some((Ma) => typeof Ma === "object" && Ma !== null && "cache_control" in Ma && Ma.cache_control != null));
```

`K` = "this request actually placed a breakpoint on a system block" — the precondition for every arm of §6.
Note it is derived by **re-inspecting the built wire messages** rather than by returning a flag from `g1_`.
That is defensive: the error-handling code below only fires when the offending construct is provably on the
wire, so a future change to `g1_` cannot desynchronise the two.

---

## 6. `.212` — making the promotion survive gateways

> *"Improved prompt caching: the mid-conversation system block now works behind LLM gateways and custom base
> URLs (Bedrock, Vertex, 1P)."*

**Verdict: NET_NEW — a per-conversation demote latch plus a widened 400 classifier.**
`mid_conv_cache_promotion` is **220=2 / 193=0**; `retry:api-system-cache-demote` is **220=1 / 193=0**.

A gateway sits between the client and the API and may validate the request body itself. Several reject
`cache_control` on a `role: "system"` message — a construct newer than their schema. The result is a hard
400 on every request, i.e. §5's optimisation breaks the session entirely behind a proxy.

### 6.1 The latch pair

```javascript
(r5r = WA("mid_conv_cache_promotion_latch", "x-cc-internal-mid-conv-cache-promotion")),     // :109219
(bji = WA("mid_conv_cache_promotion_ok_latch", "x-cc-internal-mid-conv-cache-promotion-ok")), // :109220
```

Both are **220-only**. They are registered in the same table as the real beta headers but are marked
`x-cc-internal-`: they are *sticky per-conversation flags stored in the beta set*, reusing that set's
existing lifetime (cleared on `/clear` and `/compact`, `vNr()` `:3951-3956`) rather than introducing a
parallel store. `r5r` = "this conversation's proxy rejected the promotion"; `bji` = "this conversation's
proxy accepted it" (used only to emit the success counter once).

### 6.2 The demote arm

```javascript
// ============================================
// onCacheControlRejected - demote the breakpoint off the system block for this conversation
// Location: cli_inner_pretty.js:509916-509926
// ============================================

// ORIGINAL (for source lookup):
      if (K && !q3(M, r5r) && rus(Ho))
        return (
          QF(M, r5r),
          dvi(),
          w("[mid-conv-system] proxy rejected cache_control on the api_system tail — demoting the breakpoint to the trailing message for this conversation",
            { level: "warn" }),
          $e("api_midconv_cache_proxy", "proxy_rejected"),
          "retry:api-system-cache-demote"
        );

// READABLE (for understanding):
      if (placedBreakpointOnSystemBlock && !hasStickyFlag(betaSet, MID_CONV_CACHE_PROMOTION_LATCH) && isCacheControlRejection(err))
        return (
          addStickyFlag(betaSet, MID_CONV_CACHE_PROMOTION_LATCH),   // per-conversation
          setMidConvCachePromotionRejectedGlobal(),                 // per-process
          logWarn("[mid-conv-system] proxy rejected cache_control on the api_system tail — demoting the breakpoint to the trailing message for this conversation"),
          incrementCounter("api_midconv_cache_proxy", "proxy_rejected"),
          "retry:api-system-cache-demote"
        );

// Mapping: K→placedBreakpointOnSystemBlock, q3→hasStickyFlag, QF→addStickyFlag, r5r→MID_CONV_CACHE_PROMOTION_LATCH,
//          rus→isCacheControlRejection, dvi→setMidConvCachePromotionRejectedGlobal, w→logWarn, $e→incrementCounter
```

The retry then re-enters `g1_` with `q3(M, r5r) || uvi()` true, `promotionAllowed` false, and the breakpoint
falls back to `carrierIdx` — the 2.1.193 placement. **The feature degrades to the old behaviour instead of
failing.**

Two latches for one fact is not redundancy: `r5r` (conversation) survives a `/resume` because it rides the
beta set; `uvi()` (process, `Ot.midConvCachePromotionRejected`, `:3930-3935`) short-circuits *other*
conversations in the same process so a proxy-wide incompatibility costs one 400 total, not one per
conversation.

### 6.3 The classifier that had to be widened

```javascript
// ============================================
// isCacheControlRejection - the .212 400-message classifier (no 193 counterpart)
// Location: cli_inner_pretty.js:228393-228410
// ============================================

// ORIGINAL (for source lookup):
function rus(e) {
  if (!(e instanceof hi) || e.status !== 400) return !1;
  let t = e.message;
  if (!t.includes("cache_control")) return !1;
  if (VLu.test(t)) return !1;
  if (t.includes("empty text block")) return !1;
  if (/\bsystem\.\d+\./.test(t) || t.includes("tool_result")) return !1;
  if (/\bttl\b/i.test(t)) return !1;
  let r = t.toLowerCase();
  return (
    r.includes("not permitted") || r.includes("cannot be set") || r.includes("unknown name") ||
    r.includes("unknown field") || r.includes("unrecognized") || r.includes("additional propert")
  );
}

// READABLE (for understanding):
function isCacheControlRejection(err) {
  if (!(err instanceof ApiError) || err.status !== 400) return false;
  let msg = err.message;
  if (!msg.includes("cache_control")) return false;
  if (SYSTEM_ROLE_ERROR_RE.test(msg)) return false;        // that's a role rejection -> vpo owns it
  if (msg.includes("empty text block")) return false;      // our bug, not the proxy's
  if (/\bsystem\.\d+\./.test(msg) || msg.includes("tool_result")) return false;  // top-level system / tool_result, not us
  if (/\bttl\b/i.test(msg)) return false;                  // extended-cache-ttl beta, different fix
  let lower = msg.toLowerCase();
  return ["not permitted", "cannot be set", "unknown name", "unknown field", "unrecognized", "additional propert"]
    .some((needle) => lower.includes(needle));
}

// Mapping: rus→isCacheControlRejection, hi→ApiError, VLu→SYSTEM_ROLE_ERROR_RE
```

**Why five negative filters before the positive test?** Because the string `cache_control` appears in 400s
from at least five unrelated causes, and demoting the promotion would be the wrong repair for four of them.
The ordering is *cheapest-and-most-specific first*: the `VLu` test (`/system messages?\b|role .{0,2}system/i`,
`:229018`) is checked first because that error belongs to a **different arm** — `vpo`, the role-rejection
classifier — and misrouting it would demote the cache instead of dropping the system turn, leaving the
request still broken. `system.\d+.` catches a path like `system.3.cache_control`, i.e. the *top-level*
`system` array, not a mid-conversation message. `ttl` carves out the separate `extended-cache-ttl` beta.
The positive test is six loose substrings because every gateway phrases schema rejection differently, and a
false positive here costs only a lost optimisation.

The same release also widened the **role**-rejection classifier. Comparing `EPn` (`:237478-237484 (193)`)
with `vpo` (`:228385-228392`), 220 adds one line:

```javascript
if (t.includes("cache_control") && VLu.test(t)) return !0;      // :228390 — 220 only
```

So a 400 that mentions both `cache_control` **and** a system role is treated as a *role* rejection, not a
cache rejection. That is the tie-break between the two classifiers, and it is placed in `vpo` (the more
drastic remedy) rather than in `rus`, so the ambiguous case fails toward the repair that definitely works.

---

## 7. The undocumented delta: the system turn became a control channel

No changelog bullet mentions this. `perTurnEffort` / `per_turn_effort` is **220=12 / 193=0**, and
`output_config` on an `api_system` message (`:511943`) has no 193 counterpart.

```javascript
// ============================================
// makeEffortOnlySystemTurn + insertPerTurnEffortStatements - carrying effort on the system channel
// Location: cli_inner_pretty.js:508707 and :508671-508689
// ============================================

// ORIGINAL (for source lookup):
function btp(e) {
  return { ...Jno(""), outputConfig: { effort: e } };
}
function Stp(e, t, r) {
  let n = [], o, i;
  for (let s of e) {
    if (i !== void 0 && s.type !== "user") {
      if (s.type === "api_system") { (n.push({ ...s, outputConfig: { effort: i } }), (o = i), (i = void 0)); continue; }
      (n.push(btp(i)), (o = i), (i = void 0));
    }
    if ((n.push(s), s.type === "user" && r.has(s.uuid))) {
      let a = cvi(s.uuid, t);
      i = a === o ? void 0 : a;
    }
  }
  if (i !== void 0) n.push(btp(i));
  return n;
}

// READABLE (for understanding):
function makeEffortOnlySystemTurn(effort) {
  return { ...makeApiSystemMessage(""), outputConfig: { effort } };   // empty content, config-only turn
}
function insertPerTurnEffortStatements(messages, effortByUuid, userUuids) {
  let out = [], lastApplied, pending;
  for (let msg of messages) {
    if (pending !== undefined && msg.type !== "user") {
      if (msg.type === "api_system") {                    // piggyback on an existing system turn
        out.push({ ...msg, outputConfig: { effort: pending } });
        lastApplied = pending; pending = undefined;
        continue;
      }
      out.push(makeEffortOnlySystemTurn(pending));        // else mint a config-only turn
      lastApplied = pending; pending = undefined;
    }
    out.push(msg);
    if (msg.type === "user" && userUuids.has(msg.uuid)) {
      let effort = resolveEffortForTurn(msg.uuid, effortByUuid);
      pending = effort === lastApplied ? undefined : effort;   // only emit on CHANGE
    }
  }
  if (pending !== undefined) out.push(makeEffortOnlySystemTurn(pending));
  return out;
}

// Mapping: btp→makeEffortOnlySystemTurn, Stp→insertPerTurnEffortStatements, Jno→makeApiSystemMessage,
//          cvi→resolveEffortForTurn, i→pending, o→lastApplied
```

**What it does:** records, in the conversation body itself, that the reasoning effort changed at a particular
user turn — so a replayed history reproduces the effort the model was actually running at, per turn, rather
than applying today's setting retroactively to the whole transcript.

**How it works:**
1. Walk the message list; when a user message is one of the marked turns, resolve its effort.
2. Emit **only on change** (`effort === lastApplied ? undefined : effort`) — a stable effort costs zero
   extra turns.
3. Prefer to **attach** the config to an `api_system` turn that already exists at that position; only mint a
   standalone empty-content turn when there is none. That keeps the message count down and, crucially, keeps
   the placement legal: the reminder block was already validated to follow a user message.
4. The pending config is flushed just *before* the next non-user message, so it lands between the user turn
   it describes and the assistant turn it governs.

The wire opt-in is a second beta, `per-turn-control-2026-07-01` (`lW`, `:109215`, **220=1 / 193=0**), and the
insertion is gated at `:509361`:
`if (l && o5r(r, lo(r)) && t.perTurnEffort !== void 0) a = Stp(a, t.perTurnEffort, vtp(n));`

**The strip-on-rejection path** shares the ladder with §6:

```javascript
function Etp(e) {                       // :508691-508702
  let t = [];
  for (let r of e) {
    if (r.type !== "api_system" || r.outputConfig === void 0) { t.push(r); continue; }
    if (r.message.content.length === 0) continue;         // config-only turn -> drop entirely
    let { outputConfig: n, ...o } = r;                    // reminder turn -> keep text, drop config
    t.push(o);
  }
  return t;
}
```

Called at `:509903` (`z = Pn ? V() : Etp(z)`). The asymmetry is the point: a turn that exists *only* to carry
the config is deleted, while a reminder turn that happens to carry a config keeps its text. Deleting the
latter would silently drop a harness reminder to work around an unrelated server limitation.

**Why this matters for this module:** the mid-conversation system role is no longer "where reminders go". It
is the harness's out-of-band lane, and three independent features now ride it. That is why the Sonnet-5
carve-out in §3 lives at the serialization layer rather than at `Ser`: branching `Ser` would have cut the
default model out of the cache promotion and the effort channel as collateral damage.

---

## 8. The fallback ladder, end to end

For one request, in the order the client tries them:

| # | Condition | Action | Anchor | 220/193 |
|---|---|---|---|---|
| 0 | `Ser(model)` false | never mint an `api_system`; reminders ride as meta user messages | `:531421`, `:531516` | mechanism carryover |
| 1 | placement illegal | demote that block to a meta user message | `cU_` `:531779-531783` | 220 rewrite of the 193 pass |
| 2 | proxy 400s on `cache_control` on the system tail | latch `r5r` + `dvi()`, demote the breakpoint, retry | `:509916` | **1 / 0** |
| 3 | server 400s on `output_config` | strip effort configs (`Etp`), drop `lW`, sticky-reject, retry | `:509903-509904` | **12 / 0** (`perTurnEffort`) |
| 4 | server 400s on `role:"system"` | rebuild the body with no system turn (`V()`), drop `aW` **and** `lW`, sticky-reject until `/clear` or `/compact`, retry | `:509903-509912` | event 1/1, payload new |

Level 4's log line is the tell that the fallback *body* changed:

| | 2.1.193 `:595121` | 2.1.220 `:509911` |
|---|---|---|
| text | `server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact` | `server rejected role:"system" — falling back to a body with no {role:"system"} turn, sticky-rejecting the beta until /clear or /compact` |
| telemetry payload | `V("tengu_mid_conv_system_fallback_retry", {})` | `O("tengu_mid_conv_system_fallback_retry", { per_turn_effort: mr })` |

193 named the destination format (`<system-reminder>` body) because there was only one; 220 names the
*absence* of the construct, because the destination now depends on `mro` (§3.3). The added
`per_turn_effort` property distinguishes level 3 from level 4 on a shared event name — which is why counting
`tengu_mid_conv_system_fallback_retry` (1/1) reports "no change" for a rung that did not exist in 193.

**Ordering rationale:** the ladder is strictly *least-destructive first*. Losing a cache breakpoint (2) costs
money; losing per-turn effort statements (3) costs fidelity; losing the system role (4) changes how the model
is addressed. Each rung is latched sticky so the cost is paid once per conversation, and every rung ends in a
retry rather than a user-visible error.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_system_prompt.md](../00_overview/symbol_additions_v2_1_220_system_prompt.md).

Key functions in this document:
- `supportsMidConversationSystem` (`Ser`, `:150505`) - six-step capability resolver, memoised per model id
- `isSonnet5` (`mro`, `:150395`) - the surviving `.201` carve-out
- `isOpus48` (`$Fc`, `:118668`) - the second framing carve-out
- `usesMidConvSystemFraming` (`Jep`, `:508116`) - single-slot latch combining the three predicates
- `selectOutOfBandFramingSentence` (`Qep`, `:507549`) - picks one of three system-prompt sentences
- `MID_CONV_SYSTEM_FRAMING` (`lO_`, `:508026`) - the 220-only sentence, 1/0
- `getCustomModelCapabilityOverride` (`Ede`, `:118826`) - `ANTHROPIC_CUSTOM_MODEL_OPTION` capability override
- `modelHasCapability` (`M$`, `:14517`) - catalogue lookup, returns `undefined` for known-but-uncapable
- `normalizeMessagesForApi` (`NN`, `:531420`) - message assembler; `o`/`i` set the two mid-conv flags
- `makeApiSystemMessage` (`Jno`, `:157377`) - the only `api_system` constructor
- `wrapInSystemReminder` (`Ww`, `:532376`) - the tag wrapper
- `enforceApiSystemPlacement` (`cU_`, `:531760`) - copy-on-write placement/demotion pass
- `placeCacheBreakpoints` (`g1_`, `:511886`) - breakpoint placer; holds the `.211` promotion
- `isCacheControlRejection` (`rus`, `:228393`) - `.212` 400 classifier, five negative filters
- `isSystemRoleRejection` (`vpo`, `:228385`) - role-rejection classifier; gained the `cache_control` tie-break
- `SYSTEM_ROLE_ERROR_RE` (`VLu`, `:229018`) - `/system messages?\b|role .{0,2}system/i`
- `setMidConvCachePromotionRejectedGlobal` (`dvi`, `:3933`) / `isMidConvCachePromotionRejected` (`uvi`, `:3930`)
- `MID_CONV_CACHE_PROMOTION_LATCH` (`r5r`, `:109219`) / `..._OK_LATCH` (`bji`, `:109220`)
- `MID_CONVERSATION_SYSTEM_BETA` (`aW`, `:109214`) / `PER_TURN_CONTROL_BETA` (`lW`, `:109215`)
- `insertPerTurnEffortStatements` (`Stp`, `:508671`) - emit-on-change effort statements
- `makeEffortOnlySystemTurn` (`btp`, `:508707`) - empty-content, config-only system turn
- `stripPerTurnEffortConfigs` (`Etp`, `:508691`) - asymmetric strip on server rejection
