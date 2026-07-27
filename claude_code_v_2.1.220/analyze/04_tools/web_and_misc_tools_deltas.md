# Web and miscellaneous tool deltas: WebSearch, WebFetch, ReportFindings, SendMessage, TaskStop/TaskOutput

Eight changelog bullets across `.199`, `.203`, `.210`, `.212`, `.214` and `.216` fall here. Two of them —
the web-tool "API Error" fix and the `SendMessage` misrouting fix — are among the cleanest single-line
deltas in the whole window, provable by a direct before/after of the same function. One (`.210` #8,
the tool-result renderer crash) is **unanchored** after a deliberate search, and is recorded as such.

This document also corrects the scoping file's anchor for `.212` #35.

---

## 1. Web search and web fetch returning "API Error" as content (`.212` #34)

> Fixed web search and web fetch returning "API Error" text as search results or page content when the API
> was overloaded

**Verdict: NET_NEW — two new throw sites, one per tool.** The literal `API Error` is **220=6 / 193=6**
(pure carryover, and a decoy). The real anchors are the two error tags:

| Anchor | 220 | 193 |
|---|---|---|
| `web-fetch-apply-api-error` | **1** (`:362426`) | **0** |
| `web-search-side-query-api-error` | **1** (`:403788`) | **0** |
| `isApiErrorMessage` (the flag both now test) | 76 | 51 |
| `API Error` | 6 | 6 |

Both tools have the same architecture and had the same bug: each runs a **nested model call** (WebFetch
asks a model to apply the user's prompt to the fetched page; WebSearch runs a side query with the
server-side `web_search` tool), and each treated the nested call's assistant message as content without
checking whether it was an error message.

### 1.1 WebFetch

```javascript
// ============================================
// applyPromptToFetchedPage - throws on a nested-call API error instead of returning its text
// Location: cli_inner_pretty.js:362402-362432   (193 counterpart uqt :414989-415018 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
async function Iin(e, t, r) {
  let { signal: n, isNonInteractiveSession: o, isPreapprovedDomain: i, agentContext: s } = r,
    a = t.length > yfr ? t.slice(0, yfr) + `\n\n[Content truncated due to length...]` : t,
    l = ETu(a, e, i),
    c = await g6({ systemPrompt: fp([]), userPrompt: l, signal: n,
      options: { querySource: "web_fetch_apply", agents: [], isNonInteractiveSession: o,
                 hasAppendSystemPrompt: !1, mcpTools: [], agentContext: s } });
  if (n.aborted) throw new tl();
  if (c.isApiErrorMessage) throw new Lr(Xc(c.message.content), "web-fetch-apply-api-error");
  let { content: u } = c.message;
  if (u.length > 0) { let d = u[0]; if ("text" in d) return d.text; }
  return "No response from model";
}

// ORIGINAL (2.1.193 — cli_inner_pretty.js:415008-415017 (193), the tail of the same function):
//   if (n.aborted) throw new nu();
//   let { content: c } = l.message;
//   if (c.length > 0) { let u = c[0]; if ("text" in u) return u.text; }
//   return "No response from model";
//   -- no isApiErrorMessage check at all

// READABLE (for understanding, 2.1.220):
async function applyPromptToFetchedPage(userPrompt, pageText, opts) {
  let { signal, isNonInteractiveSession, isPreapprovedDomain, agentContext } = opts,
    clipped = pageText.length > WEB_FETCH_MAX_CHARS               // yfr = 1e5 (:362449)
      ? pageText.slice(0, WEB_FETCH_MAX_CHARS) + "\n\n[Content truncated due to length...]"
      : pageText,
    prompt = buildWebFetchApplyPrompt(clipped, userPrompt, isPreapprovedDomain),
    reply = await runSideQuery({ systemPrompt: emptySystemPrompt([]), userPrompt: prompt, signal,
      options: { querySource: "web_fetch_apply", ... } });
  if (signal.aborted) throw new AbortedError();
  if (reply.isApiErrorMessage)                                     // <-- THE FIX
    throw new TaggedError(flattenContent(reply.message.content), "web-fetch-apply-api-error");
  let { content } = reply.message;
  if (content.length > 0) { let first = content[0]; if ("text" in first) return first.text; }
  return "No response from model";
}

// Mapping: Iin→applyPromptToFetchedPage, g6→runSideQuery, Lr→TaggedError, Xc→flattenContent,
//          tl→AbortedError, ETu→buildWebFetchApplyPrompt, yfr→WEB_FETCH_MAX_CHARS (1e5, :362449)
```

Placement matters: the check sits **after** `if (n.aborted) throw new tl()`. An aborted turn must report as
an abort, not as an API error, because the two are handled differently upstream (an abort is expected and
silent; an API error is retried/surfaced). Reversing the two lines would misclassify every user
interruption that raced an error.

### 1.2 WebSearch — same fix, but conditional

```javascript
// ============================================
// WebSearchTool.call (stream loop) - divert API-error messages, throw only if nothing else survived
// Location: cli_inner_pretty.js:403735-403788   (193 counterpart :436010-436065 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
      let f = hpr({ ... }), m = [], g = null, y = "", _ = 0, E = new Map(), A = null;
      for await (let I of f) {
        if (I.type === "assistant") {
          if (I.isApiErrorMessage) { A = Xc(I.message.content); continue; }
          m.push(...I.message.content);
          continue;
        }
        ...
      }
      let T = (performance.now() - i) / 1000,
        C = E9y(m, s, T);
      if (A !== null && C.results.length === 0) throw new Lr(A, "web-search-side-query-api-error");
      return { data: C };

// ORIGINAL (2.1.193 — cli_inner_pretty.js:436015-436019, 436063-436065 (193)):
//   for await (let S of d) {
//     if (S.type === "assistant") { p.push(...S.message.content); continue; }      <-- error text pushed as a result
//     ...
//   }
//   let b = (performance.now() - s) / 1000;
//   return { data: oQp(p, i, b) };

// READABLE (for understanding, 2.1.220):
      let stream = runSideQuery({ ... }),
        blocks = [], serverToolUseId = null, partialJson = "", progressSeq = 0,
        queriesById = new Map(), apiErrorText = null;
      for await (let ev of stream) {
        if (ev.type === "assistant") {
          if (ev.isApiErrorMessage) { apiErrorText = flattenContent(ev.message.content); continue; }  // divert
          blocks.push(...ev.message.content);
          continue;
        }
        ...
      }
      let durationSeconds = (performance.now() - startedAt) / 1000,
        result = collectWebSearchResults(blocks, query, durationSeconds);
      if (apiErrorText !== null && result.results.length === 0)      // <-- only when there is nothing to return
        throw new TaggedError(apiErrorText, "web-search-side-query-api-error");
      return { data: result };

// Mapping: E9y→collectWebSearchResults, Xc→flattenContent, Lr→TaggedError, A→apiErrorText
```

### The divert-then-conditionally-throw decision

**What it does:** removes API-error prose from the result set unconditionally, but only fails the tool call
when the error left nothing usable.

**How it works:**
1. The error text is captured into `A` and the message is **not** pushed into `m`. So even in the
   partial-success case the error prose never reaches the model as a "search result".
2. After the stream ends, `E9y(m, s, T)` builds the result from whatever *did* arrive. The server-side
   `web_search` tool can complete several searches (`max_uses: 8`, `:403708`) and *then* the turn can fail
   — the successful `web_search_tool_result` blocks are already in `m`.
3. Only if `C.results.length === 0` does the call throw. Otherwise the model gets real results and never
   learns there was an error.

**Why WebSearch is conditional and WebFetch is not:** WebFetch's nested call produces exactly one artefact
— the applied summary. If that failed there is nothing to return, so an unconditional throw is correct.
WebSearch's nested call produces a *stream of independent results*, so a late failure is a partial success.
Throwing away 6 good searches because the 7th 529'd would be strictly worse than returning them.

**Trade-off accepted:** in the partial case the model is not told that the search was truncated. It sees
fewer results than it might have and cannot distinguish "that's all there is" from "the API died". Given
the alternative was surfacing `API Error: …` as a search hit — which the model then cites as a source —
the silent partial is the better failure.

**Key insight:** both fixes are one `if` each, in the one place where a nested model call's output crosses
into a tool result. The general lesson is that every `runSideQuery` consumer needs an `isApiErrorMessage`
check; the count going 51 → 76 suggests this was audited across the codebase in this window, not just in
these two tools.

### 1.3 CORRECTION: `.212` #35 is *not* `tengu_convolute_arcades_retry`

> `.212` #35: Improved web search and web fetch reliability by retrying 529 errors and rate-limited
> requests with bounded backoff

[`../00_overview/_scope_v211_214.md`](../00_overview/_scope_v211_214.md) rows 133–134 map this bullet to
`tengu_convolute_arcades_retry` (220=5 / 193=0) at `:338267`. **That anchor belongs to a different
feature.** Reading the site:

```
:338266   if (Je)
:338267     O("tengu_convolute_arcades_retry", {
:338268       request_id: wr(mr.requestId), queryChainId: he, queryDepth: ve.depth,
:338271       querySource: HS(a), continuation: po !== void 0, ...
:338274       had_partial_text: ur.partialTextChars > 0, salvaged_tool_use_count: ur.toolUseCount,
:338278       credit_minted: mr.creditCode !== null, armed_at_trigger: mr.silentArmAtTrigger === !0 });
:338281   else
:338282     (be("refusal_fallback"), O("tengu_refusal_fallback_triggered", { ... }));
```

It is the **silent branch of the refusal-fallback retry** in the main query loop — the `Je` flag selects
between a silent `convolute_arcades` retry and a user-visible `refusal_fallback`. Its siblings confirm it:
`tengu_convolute_arcades_tools` (`:331736`) reports how many in-flight tool calls were discarded by
`non(…, "refusal_retry", { silent: Je })`, and `tengu_convolute_arcades_retry_outcome` fires at `:338460`
and `:338518` in the same loop. That belongs to `57_api_reliability` / the refusal-fallback story, not to
the web tools.

**For the web tools specifically, no client-side 529/rate-limit retry wrapper could be found.** The
`529` literal is 220=92 / 193=76 and `Overloaded` is 220=2 / 193=2; both web tools reach the API through
the shared `runSideQuery` path (`g6` / `hpr`), so any bounded backoff they gained is the **shared HTTP
retry layer's**, not theirs. Verdict for `.212` #35 within this theme: **not anchored to a web-tool-local
change; the anchor the scoping file offers is a false positive.** The retry itself is `57_api_reliability`'s
to prove.

### 1.4 The WebSearch session cap (`.212` #3) — where it lives

> Added a session-wide limit on WebSearch tool calls (default 200, tunable via
> `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) to stop runaway search loops

**Verdict: NET_NEW.** `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` **220=4 / 193=0**;
`used its web search budget` **220=1 / 193=0**. Ground truth §2/§6.1 already establishes the env plumbing
(accessor `:32122`, read `:231406` as `Z.<ENV> ?? _ty`, `_ty = 200` at `:231413`). The tool-side half is
the first thing `WebSearchTool.call` does (`:403657-403673`; the refusal text is at `:403669`):

```javascript
      let i = performance.now(), { query: s } = e,
        a = yPu(),                                             // resolved cap
        l = t.taskRegistry.getWebSearchCalls();                // session counter
      if (l >= a)
        return (
          pe("tool_web_search", "web_search_session_cap", { max_web_searches_per_session: a }),
          { data: { query: s,
              results: [`Web search was not performed: this session has used its web search budget (${l} of ${a} WebSearch calls). Continue with the information already gathered instead of issuing more searches. If more searches are genuinely needed, ask the user to raise CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION.`],
              durationSeconds: 0, searchCount: 0 } }
        );
      if ((t.taskRegistry.incrementWebSearchCalls(), wwd())) { ... }
```

Three design details worth naming:

1. **The refusal is returned as a normal `data` result, not thrown.** `results: [<string>]` uses the
   `v.union([hit, v.string()])` arm of the output schema (`:403570`) — the schema already allowed
   free-text commentary alongside structured hits, so the cap message needed no schema change. A throw
   would have surfaced as a tool error and invited a retry; a successful result with an explanatory string
   redirects the model.
2. **The counter lives on `taskRegistry`, not in module state.** That makes it session-scoped and shared
   across subagents — the cap is a *session* budget, so a fan-out of 20 subagents cannot each get 200.
3. **Increment happens after the check and before the work** (`:403676`), so an aborted or failed search
   still consumes budget. That is the right direction for a runaway-loop guard: a search that fails and is
   retried in a loop is exactly the case the cap exists for.

The message names the env var, which is the same self-service pattern as the subagent-depth refusal
(ground truth §2).

---

## 2. `SendMessage` misrouting to a re-spawned agent (`.199` #18)

> Fixed `SendMessage` silently misrouting when a re-spawned agent reuses a previous agent's name — the tool
> now detects the mismatch and asks the caller to retarget

**Verdict: NET_NEW.** `send_message_pin_guard` **220=2 / 193=0**;
`now resolves to a different agent than it did earlier` **220=1 / 193=0**.

The mechanism is a **name→id pin**: the first time a session sends to a name, the resolved agent id is
pinned; a later send to the same name that resolves to a *different* id is refused rather than delivered.

```javascript
// ============================================
// SendMessageTool.call (rebound branch) - refuse a send whose name now resolves elsewhere
// Location: cli_inner_pretty.js:418470-418504
// ============================================

// ORIGINAL (for source lookup):
      let d = await ekd({ to: e.to, message: e.message, resolved: c,
                          appState: t.getAppState(), agentLifecycle: t.agentLifecycle });
      if (d.kind === "rebound") {
        $e("send_message_pin_guard", "rebound");
        let y = `'${d.name}' now resolves to a different agent than it did earlier in this conversation: earlier sends went to [${d.previous.ref}], which this name no longer reaches. Nothing was sent.`,
          _ = d.previous.id,
          E = $ne(_) !== null
              ? "If you need the earlier agent and it is still running, address it by its agent ID from its spawn result."
              : `The earlier recipient is ${Ype(_) !== _ ? "a Claude session running in the cloud" : "another Claude session on this machine"}; this name now belongs to an agent in this session.`;
        if (d.next === void 0)
          return { data: { success: !1, message: `${y}\nCheck the spelling, or use the agent ID from a background agent's spawn result.` } };
        return { data: { success: !1, message: `${y}\nIt now resolves to:\n  ${lan(d.next, Date.now())}\nTo message the new agent, re-send with its ref:\ne.g. {"to": "${uNt(d.next)}", ...}\n${E}` } };
      }
      let p = d.pin ? { pin: d.pin } : void 0;
      if (p) be("send_message_pin_guard");

// READABLE (for understanding):
      let resolution = await resolveWithPinGuard({ to: input.to, message: input.message, resolved: candidate,
                                                   appState: ctx.getAppState(), agentLifecycle: ctx.agentLifecycle });
      if (resolution.kind === "rebound") {
        counterInc("send_message_pin_guard", "rebound");
        let lead = `'${resolution.name}' now resolves to a different agent than it did earlier in this `
                 + `conversation: earlier sends went to [${resolution.previous.ref}], which this name no `
                 + `longer reaches. Nothing was sent.`,
          previousId = resolution.previous.id,
          whereIsTheOldOne = lookupRunningAgent(previousId) !== null
            ? "If you need the earlier agent and it is still running, address it by its agent ID from its spawn result."
            : `The earlier recipient is ${isCloudAgentId(previousId) ? "a Claude session running in the cloud"
                                                                     : "another Claude session on this machine"}; `
              + `this name now belongs to an agent in this session.`;
        if (resolution.next === undefined)                          // the name reaches nobody now
          return { data: { success: false, message: `${lead}\nCheck the spelling, or use the agent ID from a background agent's spawn result.` } };
        return { data: { success: false, message: `${lead}\nIt now resolves to:\n  ${describeAgent(resolution.next, Date.now())}\nTo message the new agent, re-send with its ref:\ne.g. {"to": "${refFor(resolution.next)}", ...}\n${whereIsTheOldOne}` } };
      }
      let pinUpdate = resolution.pin ? { pin: resolution.pin } : undefined;
      if (pinUpdate) counterInc("send_message_pin_guard");          // a pin was established/refreshed

// Mapping: ekd→resolveWithPinGuard, $e/be→counterInc, $ne→lookupRunningAgent, Ype→isCloudAgentId,
//          lan→describeAgent, uNt→refFor
```

### The pin-guard decision

**What it does:** converts a silent mis-delivery into an explicit refusal plus a re-target instruction.

**How it works:**
1. Names are ergonomic but not unique over time: an agent named `reviewer` can exit and a new `reviewer`
   can be spawned. Prior behaviour resolved the name fresh on every send, so the second `reviewer` silently
   received messages intended as a continuation of a conversation with the first.
2. The guard records the resolved id the first time a name is used (`resolution.pin`) and compares on
   subsequent sends. A mismatch is `kind: "rebound"`.
3. **Nothing is sent** — stated explicitly in the message, because the model's next action depends on
   whether the message was delivered.
4. The message is built in three parts: (a) the invariant lead, (b) a branch on whether the name now
   reaches *anyone*, (c) advice about the *old* recipient, further branched on whether it is still running
   and whether it is local or cloud.

**Why the third part exists.** The model's likely intent is "keep talking to the agent I was talking to".
The three cases have genuinely different remedies:
   - old agent still running → use its agent ID from the spawn result (`$ne(_) !== null`);
   - old agent gone and it was a cloud session → `Ype(_) !== _` distinguishes a cloud id from a local one,
     because "it's finished" means something different for a remote session;
   - old agent gone and local → the name has simply been reused.

**Why refuse rather than deliver to the new agent with a warning?** Because a cross-agent message carries
context ("as we discussed, apply the fix to line 40"). Delivering it to a fresh agent produces a
plausible-looking but wrong conversation, and the new agent has no way to detect it. A refusal costs one
turn; a mis-delivery can corrupt an entire task.

**Telemetry design:** the same counter name is incremented with a `"rebound"` label on the refusal path and
with no label on the success path, so the ratio (guard fired / guard active) is directly readable.

---

## 3. `ReportFindings` (`.214`-window addition, no dedicated bullet)

**Verdict: NET_NEW.** `ReportFindings` **220=1 / 193=0**; `tengu_report_findings_tool` **220=1 / 193=0**;
`CLAUDE_CODE_REPORT_FINDINGS` **220=2 / 193=0**. Interestingly there is **no changelog bullet** announcing
it — it is one of the window's undocumented additions, discoverable only from the tool index.

The tool is a **structured-output sink for the code-review flow**: it does no work, it exists so the host UI
can render a typed list instead of parsing prose.

```javascript
// ============================================
// ReportFindingsTool - a pure structured-output sink for /code-review
// Location: cli_inner_pretty.js:403877-403920
// ============================================

// ORIGINAL (for source lookup):
    (Lwd = Bi({
      name: ZB,
      searchHint: "report code-review findings as a structured list",
      maxResultSizeChars: 256,
      strict: !0,
      async description() { return LOs; },
      async prompt() { return LOs; },
      get inputSchema() { return Iwd(); },
      get outputSchema() { return v9y(); },
      isReadOnly() { return !0; },
      isConcurrencySafe() { return !0; },
      toAutoClassifierInput(e) { return `${e.findings.length} findings`; },
      userFacingName() { return "Code review"; },
      renderToolUseMessage(e) {
        let t = e.findings?.length ?? 0;
        return `${e.level ?? "review"} \xB7 ${t} ${Et(t, "finding")}`;
      },
      async call({ findings: e, level: t }) { return { data: { count: e.length, level: t, findings: e } }; },
      mapToolResultToToolResultBlockParam({ count: e }, t) {
        return { tool_use_id: t, type: "tool_result",
                 content: e === 0 ? "No findings reported." : `${e} ${Et(e, "finding")} reported.` };
      },
    })));

// READABLE (for understanding):
    ReportFindingsTool = defineTool({
      name: "ReportFindings",
      searchHint: "report code-review findings as a structured list",
      maxResultSizeChars: 256,                  // the smallest cap in the surface - see below
      strict: true,                             // request strict JSON-schema enforcement server-side
      async description() { return REPORT_FINDINGS_DESCRIPTION; },
      async prompt()      { return REPORT_FINDINGS_DESCRIPTION; },   // same text for both
      get inputSchema()  { return reportFindingsInputSchema(); },
      get outputSchema() { return reportFindingsOutputSchema(); },
      isReadOnly: () => true, isConcurrencySafe: () => true,
      toAutoClassifierInput: (i) => `${i.findings.length} findings`,  // auto-mode sees a count, not the text
      userFacingName: () => "Code review",
      renderToolUseMessage: (i) => `${i.level ?? "review"} · ${i.findings?.length ?? 0} finding(s)`,
      async call({ findings, level }) { return { data: { count: findings.length, level, findings } }; },
      mapToolResultToToolResultBlockParam: ({ count }, id) => ({
        tool_use_id: id, type: "tool_result",
        content: count === 0 ? "No findings reported." : `${count} finding(s) reported.` }),
    });

// Mapping: Lwd→ReportFindingsTool, ZB→"ReportFindings" (:403821), LOs→REPORT_FINDINGS_DESCRIPTION (:403823),
//          Iwd→reportFindingsInputSchema (:403857), v9y→reportFindingsOutputSchema (:403870),
//          DOs→reportFindingsFindingSchema (:403827), Bi→defineTool
```

### Why `call` is a no-op and the tool result is a count

**What it does:** the *input* is the product. `call` echoes it into `data` for the UI layer, and the *tool
result* returned to the model is a bare count.

**Why:** if the tool result echoed the findings, the model would re-read its own 32-item list on the next
turn — thousands of tokens of pure duplication, plus a strong pull toward restating them as prose. The
`maxResultSizeChars: 256` cap (`:403880`) makes this structural: even a misbehaving implementation could
not return the list. Compare the other tools' caps: `Grep` `20000` (`:312105`), `Read`/`Write`/`Glob`/
`NotebookEdit` `1e5`, `EndConversation` `1e4`. 256 is an order of magnitude below anything else and is a
deliberate statement that this tool's output is *not context*.

The description (`:403823`) reinforces it in prose:

> `…call it once with the verified findings ranked most-severe first (empty array if nothing survived
> verification) and do not also print the findings as text.`

### The finding schema is a review methodology encoded as types

`DOs` (`:403827-403856`, fields read verbatim in that range):

| Field | Type | Constraint | Design intent |
|---|---|---|---|
| `file` | string | required | repo-relative |
| `line` | int | optional | 1-indexed |
| `summary` | string | required | "One-sentence statement of the defect" |
| `short_summary` | string | optional | **`.max(60)`** — "the claim alone, no rationale or consequence clause" |
| `failure_scenario` | string | **required** | "Concrete inputs/state → wrong output/crash" |
| `category` | string | optional, `.max(40)` | kebab-case slug |
| `verdict` | enum | `CONFIRMED` \| `PLAUSIBLE` | "Set when a verify pass ran; absent on inline-only reviews" |
| `outcome` | enum | `fixed` \| `skipped` \| `no_change_needed` | "Set ONLY when re-reporting after applying fixes" |

Wrapper (`Iwd`, `:403857-403862`): `v.strictObject({ level: enum(low|medium|high|xhigh|max).optional(),
findings: array(...).max(32) })`.

Three of these constraints are load-bearing:

- **`failure_scenario` is required.** A reviewer cannot file a finding without stating how the code
  misbehaves. This is the schema doing what a prompt cannot enforce: it makes "I have a vague concern"
  unrepresentable.
- **`.max(32)` on findings** caps a review at 32 items. The `/code-review` prompt at `:774271` says
  "submit at most 15 findings", so the schema bound is 2× the prompt bound — a hard ceiling under a soft
  guideline, the standard belt-and-braces arrangement.
- **`short_summary.max(60)`** with an explicit "no rationale or consequence clause" description exists
  because the compact UI truncates; asking the model for the compressed form is better than truncating
  the long one mid-clause.

`strict: !0` requests server-side strict JSON-schema enforcement. `serializeToolForApi` (`:508170-508180`)
only honours it if the schema passes `Bpo(f)` strict-compatibility checking and the model supports it,
otherwise it logs `Tool ${e.name} has strict: true but its schema is not strict-compatible (…); sending
non-strict` (`:508175-508178`) and degrades. So the strictness is best-effort by design.

### Gating

Two predicates, and they disagree in an interesting way:

```javascript
// :774313-774317  (acl - the local force-on path)
function acl(e) {
  if (e.options?.isSkillPreload) return !1;
  let t = XNn();
  if (t === "text" || t === "json") return !1;
  return Boolean(Z.CLAUDE_CODE_REPORT_FINDINGS) && Boolean(e.options?.tools?.some((r) => qa(r, ZB)));

// :774319-774327  (kqS - the gated path)
function kqS(e, t) {
  if (t.options?.isSkillPreload) return !1;
  if (acl(t)) return !0;                                        // the env-var path above short-circuits
  if (!t.options?.tools?.some((n) => qa(n, ZB))) return !1;
  let r = XNn();
  if (r === "text" || r === "json") return !1;
  if (e === "low") return !1;                                   // effort floor
  return Ke("tengu_report_findings_tool", !1);                  // gate, default OFF
}
```

- Both refuse when the output format is `text` or `json` — a structured-findings tool is pointless when the
  host is going to print raw text anyway.
- Both require the tool to be in the session's tool list.
- `CLAUDE_CODE_REPORT_FINDINGS` is a **local force-on**; `tengu_report_findings_tool` is the **remote
  rollout dial**, default `false`.
- `if (e === "low") return !1` — a **reasoning-effort floor**. At low effort the review is shallower and the
  structured-findings pass is skipped. This is the only effort-gated tool decision in the file-and-web set.
- `isSkillPreload` short-circuits: during skill preloading the tool set is being *described*, not used.

---

## 4. `TaskStop` / `TaskOutput` failing to find agents spawned by another agent (`.203` #17)

> Fixed `TaskStop` and `TaskOutput` failing to find background agents spawned by another agent — errors now
> list running agents by id and description

**Verdict: NET_NEW.** `matches both teammate` **220=1 / 193=0**;
`Use the full agent ID (name@team)` **220=2 / 193=0**; `Multiple teammates match` **220=1 / 193=0**;
`TaskOutput` 220=28 / 193=9. `agentNameRegistry` is 220=24 / 193=20 — the registry existed; the
**cross-namespace lookup over it** is new.

```javascript
// ============================================
// resolveTaskIdAcrossNamespaces - four-stage lookup across the task registry and the agent-name registry
// Location: cli_inner_pretty.js:399713-399747 (definition) - called from TaskStop :400008 and siblings
// ============================================

// ORIGINAL (for source lookup):
function Qko(e, t, r) {
  let n = t.all(),
    o = Bvd(e, n),
    i = TAd((c) => c === e, t, r);
  if (o.status !== "not_found" && i) {
    let c = o.status === "found" ? [o.task.identity.agentId] : o.candidates;
    return { status: "ambiguous", message: wAd(e, c, i.id) };
  }
  if (o.status === "ambiguous") return { status: "ambiguous", message: AAd(e, o.candidates) };
  if (o.status === "found") return { status: "found", task: o.task };
  if (i) return { status: "found", task: i };
  let s = QB(e),
    a = iVy(s, n),
    l = TAd((c) => QB(c) === s, t, r);
  if (a.length > 0 && l)
    return { status: "ambiguous", message: wAd(e, a.map((c) => c.identity.agentId), l.id) };
  if (a.length > 1) return { status: "ambiguous", message: AAd(e, a.map((c) => c.identity.agentId)) };
  if (a.length === 1) return { status: "found", task: a[0] };
  if (l) return { status: "found", task: l };
  return { status: "not_found", suggestion: oVy(s, t, r) };
}
function AAd(e, t) { return `Multiple teammates match "${e}": ${t.join(", ")}. Use the full agent ID (name@team).`; }
function wAd(e, t, r) { return `"${e}" matches both teammate ${t.join(", ")} and background agent ${r}. Use the full agent ID (name@team) for the teammate or the task ID for the background agent.`; }

// READABLE (for understanding):
function resolveTaskIdAcrossNamespaces(ref, taskRegistry, getAppState) {
  let allTasks = taskRegistry.all(),
    exactTeammate  = findTeammateByExactRef(ref, allTasks),                       // Bvd
    exactBgAgent   = findLocalAgentByName((name) => name === ref, taskRegistry, getAppState);  // TAd

  // STAGE 1 - exact match in BOTH namespaces -> ambiguous, name both, do nothing
  if (exactTeammate.status !== "not_found" && exactBgAgent) {
    let ids = exactTeammate.status === "found" ? [exactTeammate.task.identity.agentId]
                                              : exactTeammate.candidates;
    return { status: "ambiguous", message: bothNamespacesMessage(ref, ids, exactBgAgent.id) };
  }
  // STAGE 2 - exact match in one namespace
  if (exactTeammate.status === "ambiguous") return { status: "ambiguous", message: multipleTeammatesMessage(ref, exactTeammate.candidates) };
  if (exactTeammate.status === "found")     return { status: "found", task: exactTeammate.task };
  if (exactBgAgent)                          return { status: "found", task: exactBgAgent };

  // STAGE 3 - normalised (case/punctuation-folded) match, same two-namespace collision logic
  let norm = normalizeAgentRef(ref),                                             // QB
    fuzzyTeammates = findTeammatesByNormalizedRef(norm, allTasks),               // iVy
    fuzzyBgAgent   = findLocalAgentByName((name) => normalizeAgentRef(name) === norm, taskRegistry, getAppState);
  if (fuzzyTeammates.length > 0 && fuzzyBgAgent)
    return { status: "ambiguous", message: bothNamespacesMessage(ref, fuzzyTeammates.map(t => t.identity.agentId), fuzzyBgAgent.id) };
  if (fuzzyTeammates.length > 1) return { status: "ambiguous", message: multipleTeammatesMessage(ref, fuzzyTeammates.map(t => t.identity.agentId)) };
  if (fuzzyTeammates.length === 1) return { status: "found", task: fuzzyTeammates[0] };
  if (fuzzyBgAgent)                return { status: "found", task: fuzzyBgAgent };

  // STAGE 4 - nothing matched: build a suggestion list of RUNNING agents
  return { status: "not_found", suggestion: buildRunningAgentSuggestion(norm, taskRegistry, getAppState) };
}

// Mapping: Qko→resolveTaskIdAcrossNamespaces, Bvd→findTeammateByExactRef, TAd→findLocalAgentByName,
//          iVy→findTeammatesByNormalizedRef, QB→normalizeAgentRef, oVy→buildRunningAgentSuggestion,
//          AAd→multipleTeammatesMessage, wAd→bothNamespacesMessage
```

The second namespace is the app-state agent-name registry:

```javascript
// :399780-399789
function TAd(e, t, r) {
  let n = r?.().agentNameRegistry;
  if (!n) return;
  for (let [o, i] of n) {
    if (!e(o)) continue;
    let s = t.get(i);
    if (s?.type === "local_agent") return s;
  }
  return;
}
```

### The two-namespace resolution decision

**What it does:** resolves a model-supplied `task_id`/agent reference against **both** the caller's own task
registry and the session-wide `agentNameRegistry`, so an agent can stop or read a task another agent
spawned.

**How it works, and why the stage order:**
1. **Exact before normalised.** An exact match is unambiguous by construction; folding case/punctuation
   first would manufacture collisions that do not exist. Both stages then repeat the identical
   collision logic — deliberate duplication rather than a shared helper, because the *candidate list
   shapes* differ (`{status, task|candidates}` vs a plain array).
2. **Collision across namespaces is `ambiguous`, never a guess.** `wAd` names both the teammate ids *and*
   the background-agent id and tells the caller which disambiguator to use for each
   (`name@team` for teammates, the task ID for background agents). Silently preferring one namespace is
   the bug class this whole function exists to prevent: stopping the wrong agent is unrecoverable.
3. `TAd` filters `s?.type === "local_agent"` — the name registry may contain entries whose task is a
   different kind; only local agents are stoppable/readable this way.
4. **Stage 4 produces a suggestion**, which is the bullet's "errors now list running agents by id and
   description": `oVy` (`:399754-399779`) walks `Oft(t.all())`, skips anything whose `status !== "running"`, and
   builds a `normalizedName → agentId` map for the "did you mean" list. Only *running* agents are
   suggested — a finished agent is not a useful retarget.

**Failure modes handled:** unknown ref → `not_found` with suggestions; two teammates with the same short
name → `ambiguous` with full ids; a teammate and a background agent with the same name → `ambiguous` naming
both. **Nothing** in the function can return a task the caller did not name.

`TaskStop` also emits a deprecation probe for the legacy parameter (`:399998-400001`):

```javascript
        if (t !== void 0 && !CAd)
          ((CAd = !0), O("tengu_dead_probe_taskstop_shell_id", { with_task_id: e !== void 0 ? Ee("true") : Ee("false") }));
```

`tengu_dead_probe_taskstop_shell_id` is **220=1 / 193=0**, and `CAd` is a once-per-session latch so a
looping model does not flood the event. The `with_task_id` field measures whether callers send *both*
`shell_id` and `task_id` (safe to remove `shell_id`) or only `shell_id` (removal would break them). The
sibling `tengu_dead_probe_taskoutput_legacy_params` (`:508461`, `:508463`) does the same for `TaskOutput`'s
`agentId` / `bash_id` / `wait_up_to`. Both are in the 326-new-gate list, and both belong to a family of
`tengu_dead_probe_*` events added in this window to measure whether deprecated surfaces can be deleted.

---

## 5. UNANCHORED: tool-result renderer returning a bigint or plain text (`.210` #8)

> Fixed a session crash when a tool's result renderer returned a numeric bigint value or plain text instead
> of a UI element

**Verdict: UNANCHORED after a targeted search.** Recorded honestly rather than fabricated.

What was checked in the 2.1.220 bundle:

| Probe | 220 | 193 | Conclusion |
|---|---|---|---|
| `typeof e === "bigint"` | 9 | 9 | carryover |
| `isValidElement` | 14 | 14 | carryover; all 14 sites are vendored React/Ink or unrelated UI |
| `renderToolResultMessage` | 80 | 43 | +37, but the growth tracks the +15 new tools each declaring a renderer, not a new guard |
| `renderToolResultMessage?.(` | **0** | **2** | the optional-call form was *removed*; the dispatch was restructured |
| `typeof r === "string" \|\| typeof r === "number"` | 3 | 0 | all three hits are vendored code (`:15105`, `:16266` form-data; `:305046` LSP `ProgressToken.is`) — **decoys** |

The renderer table itself is at `:652098` (`[ZB]: { renderToolResultMessage: F4p }`) and the per-tool
renderers are declared inline on each tool. The `renderToolResultMessage?.(` → 0 change means the call site
moved, and a guard could well have been added there, but no string, constant, or gate distinguishes the
before and after. **Not claimed.** A future pass should diff the renderer dispatch function itself rather
than hunting literals.

---

## 6. `AskUserQuestion` (`.200` #3, `.216` #4, `.216` #5) — cross-referenced, not duplicated

Three bullets in the window touch `AskUserQuestion`:

| Bullet | Version | Anchor (read in 220) | Verdict |
|---|---|---|---|
| no longer auto-continues; opt into an idle timeout via `/config` | .200 | `askUserQuestionTimeout` **220=9 / 193=0**, zod field `:61218`; `/config` row id `:451891`; three new `tengu_ask_user_question_*` gates | **NET_NEW** |
| telling Claude to continue even when the answer asked it to wait | .216 | `The user answered` **220=1 / 193=0** at `:323485` | **NET_NEW** |
| Claude Code on the web re-asking the same question after idle | .216 | `tengu_ask_user_question_afk_auto_advance`, `tengu_ask_user_question_skipped` (both 220=1 / 193=0) | **NET_NEW** |

All three are *dialog/settings* changes rather than tool-surface changes: the setting is a `/config` enum
(`["60s","5m","10m","never"]` defaulting to `never`), the wording fix is in the synthesised tool result, and
the web fix is in the remote-control idle path. They are owned by `48_accessibility_ui` /
`43_slash_commands` / `54_remote_control` respectively. Anchors recorded here for the ledger; the deep
analysis is deliberately **not** duplicated. The tool object itself is at `:323350` with
`maxResultSizeChars: 1e5` (`:323351`).

---

## 7. Verdict table for this document

| Bullet | Version | Verdict | Anchor |
|---|---|---|---|
| web search/fetch returning "API Error" as content | .212 | **NET_NEW ×2** | `web-fetch-apply-api-error` `:362426`, `web-search-side-query-api-error` `:403788` — both 220=1/193=0 |
| web search/fetch retry 529 + bounded backoff | .212 | **NOT ANCHORED here; scoping-file anchor is a false positive** | `tengu_convolute_arcades_retry` `:338267` is refusal-fallback, not web |
| session-wide WebSearch cap | .212 | **NET_NEW** | `used its web search budget` 220=1/193=0, `:403669` |
| `SendMessage` misrouting on name reuse | .199 | **NET_NEW** | `send_message_pin_guard` 220=2/193=0, `:418478` |
| `ReportFindings` tool | (none) | **NET_NEW, undocumented** | `:403821`, `:403877`; `tengu_report_findings_tool` `:774326` |
| `TaskStop`/`TaskOutput` cross-agent lookup | .203 | **NET_NEW** | `matches both teammate` 220=1/193=0, `:399752` |
| tool-result renderer bigint/plain-text crash | .210 | **UNANCHORED** | see §5 |
| `AskUserQuestion` idle timeout | .200 | **NET_NEW** (owned elsewhere) | `askUserQuestionTimeout` `:61218`, `/config` row `:451891` |
| `AskUserQuestion` neutral answer wording | .216 | **NET_NEW** (owned elsewhere) | `The user answered` `:323485` |
| `AskUserQuestion` web re-ask after idle | .216 | **NET_NEW** (owned elsewhere) | two new `tengu_ask_user_question_*` gates |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows for this window are staged in
> [symbol_additions_v2_1_220_tools.md](../00_overview/symbol_additions_v2_1_220_tools.md).

Key functions in this document:
- `applyPromptToFetchedPage` (`Iin`) - WebFetch's nested model call; now throws on `isApiErrorMessage`
- `collectWebSearchResults` (`E9y`) - assembles WebSearch results from stream blocks
- `WebSearchTool` (`kwd`) / `WebFetchTool` (`hte`) - the two tool objects
- `getMaxWebSearchesPerSession` (`yPu`) - `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION ?? 200`
- `resolveWithPinGuard` (`ekd`) - `SendMessage` name→id pin comparison
- `ReportFindingsTool` (`Lwd`) - structured code-review sink
- `REPORT_FINDINGS_DESCRIPTION` (`LOs`) - the model-facing contract
- `reportFindingsInputSchema` (`Iwd`) / `reportFindingsFindingSchema` (`DOs`) - `.max(32)` findings, `.max(60)` short summary
- `isReportFindingsForceEnabled` (`acl`) / `isReportFindingsAvailable` (`kqS`) - env force-on + gate + effort floor
- `resolveTaskIdAcrossNamespaces` (`Qko`) - four-stage `TaskStop`/`TaskOutput` reference resolution
- `findLocalAgentByName` (`TAd`) - `agentNameRegistry` scan filtered to `local_agent`
- `bothNamespacesMessage` (`wAd`) / `multipleTeammatesMessage` (`AAd`) - the two ambiguity messages
- `buildRunningAgentSuggestion` (`oVy`) - the "did you mean" list, running agents only
- `sweepDiscardedToolUses` (`non`) - emits `tengu_convolute_arcades_tools` on the silent-retry path
