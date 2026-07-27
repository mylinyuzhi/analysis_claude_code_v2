# The `EndConversation` tool (v2.1.214)

**Changelog bullet (`.214`, verbatim):**

> Added the EndConversation tool: Claude can end sessions with highly abusive users or jailbreak
> attempts, as on claude.ai since 2025 — see https://www.anthropic.com/research/end-subset-conversations

**Verdict: NET_NEW, and under-described by the bullet.** Every anchor below is 220>0 / 193=0. What the
bullet does not say is that the tool is guarded by **four independent gates** (model floor, remote flag,
entrypoint allow-list, per-tool enable), takes **two consecutive calls** to actually fire, writes a
**durable transcript marker** that survives `--resume`, and installs a **session-wide lockout** that
disables the query loop, compaction, and subagent forks while leaving exactly five slash commands alive.

Delta proof for the cluster:

| Anchor | 220 | 193 |
|---|---|---|
| `EndConversation` | 7 | 0 |
| `tengu_umber_kestrel` (the GrowthBook flag) | 1 | 0 |
| `tengu_end_conversation_tool_call` | 3 | 0 |
| `Claude has ended this chat.` | 1 | 0 |
| `endedByModel` (app-state field) | 14 | 0 |
| `ended-by-model` (transcript record type) | 6 | 0 |
| `markSessionEndedByModel` | 2 | 0 |
| `end_conversation` (abort reason) | 5 | 0 |

---

## 1. Module shape

The module exports its whole surface at `:412951-412962`, which is unusually legible for this bundle
(the export table preserves real names):

```
:412952  parseEndConversationFlagValue           Fxd
:412953  modelMeetsEndConversationFloor          $xd
:412954  isEndConversationToolEnabled            cIo
:412955  getDeferredHintSection                  qYy
:412956  compileAllowedEntrypointsRegex          Nxd
:412957  END_CONVERSATION_TOOL_RESULT            lIo   = "Claude has ended this chat."
:412958  END_CONVERSATION_TOOL_NAME              PB    = "EndConversation"      (:231369)
:412959  END_CONVERSATION_REFLECTION_PROMPT      t$s                            (:413049)
:412960  END_CONVERSATION_FORK_REFLECTION_PROMPT Z1s                            (:412998)
:412961  END_CONVERSATION_FINAL_MESSAGE          e$s                            (:413048)
:412962  DESCRIPTION                             Yan                            (:413009-413047)
```

A second export table at `:413062` publishes the tool itself and one helper:

```
:413062  tt(jxd, { lastAssistantTurnCalledEndConversation: () => Uxd, EndConversationTool: () => KYy });
```

The flag name is co-located with the tool name at `:231369-231370`:

```javascript
var PB = "EndConversation",
  qus = "tengu_umber_kestrel";
```

`tengu_umber_kestrel` is in the 326-new-gate list. It is a deliberately opaque codename — the pattern
Anthropic uses for gates whose existence should not leak the feature (see also `tengu_hazel_trellis` for
subagent depth in ground truth §2).

---

## 2. The four-layer gate

### `isEndConversationToolEnabled`

**What it does:** answers "may the model see the `EndConversation` tool at all in this session?"

```javascript
// ============================================
// isEndConversationToolEnabled - the four-layer availability gate
// Location: cli_inner_pretty.js:412983-412989
// ============================================

// ORIGINAL (for source lookup):
function cIo(e) {
  let t = gYt();
  if (t === void 0) return !1;
  if (!$xd(e)) return !1;
  let { enabled: r, allowedEntrypoints: n } = Fxd(Ke(qus, !1));
  if (zoo()) return !1;
  return r && n.test(t);
}

// READABLE (for understanding):
function isEndConversationToolEnabled(modelId) {
  let entrypoint = getEntrypoint();                     // gYt(), :46435 - snapshot of CLAUDE_CODE_ENTRYPOINT
  if (entrypoint === void 0) return false;              // 1. no entrypoint recorded -> refuse
  if (!modelMeetsEndConversationFloor(modelId)) return false;  // 2. model version floor
  let { enabled, allowedEntrypoints } =
        parseEndConversationFlagValue(getFeatureValue("tengu_umber_kestrel", false));  // 3. remote flag
  if (isSurfaceExemptFromEndConversation()) return false;       // 4. build-variant kill switch
  return enabled && allowedEntrypoints.test(entrypoint);        //    + entrypoint allow-list
}

// Mapping: cIo→isEndConversationToolEnabled, gYt→getEntrypoint, $xd→modelMeetsEndConversationFloor,
//          Fxd→parseEndConversationFlagValue, Ke→getFeatureValue, qus→END_CONVERSATION_GB_FLAG,
//          zoo→isSurfaceExemptFromEndConversation
```

**How it works, and why the order matters:**

1. **`entrypoint === void 0` first.** `gYt()` returns a module-level snapshot (`zBl`, set once by `KBl` at
   `:46445` from `Z.CLAUDE_CODE_ENTRYPOINT`). If startup never recorded an entrypoint the tool is
   unavailable. This is a **fail-closed default**, and it is checked before anything expensive.
2. **Model floor second** — a pure, local, synchronous string compare (§2.1). No network, no flag read.
3. **Flag read third.** `Ke(...)` is `getFeatureValue`, which may consult a cached GrowthBook payload.
   Putting it third means the common "old model" case never touches the flag layer.
4. **`zoo()` last, and it is a stub.** `:162794` is literally `function zoo() { return !1 }`. It sits in a
   cluster of surface shims — `f8e` (`setEndedByModel`, `:162788`), `zst` (`isEndedByModel`, `:162792`),
   `YQi` (`:162797`, returns `""`) — that a different build variant presumably overrides. Its second call
   site (`:526260`) gates the *transcript replay* of `ended-by-model` records. So in the shipped CLI both
   are inert, but the seam exists so a surface can ship the tool code and suppress its effect.

**Why this approach:** four gates with different owners. The model floor is a **hard client invariant**
(older models were never trained on this tool's guidance and would misuse it). The flag is the
**rollout dial**. The entrypoint regex is the **surface restriction** (the research programme was for
claude.ai chat, not CI). `zoo()` is the **build-variant escape hatch**. None of the four can be
expressed in terms of another, which is why there are four rather than one composite.

**Key insight:** the tool's availability is recomputed on every `isEnabled()` call (`:413114-413117`),
which reads the *current* model via `n7n()`. So `/model opus-4-7` mid-session **removes the tool**,
and `/model opus-5` puts it back. That is a per-turn tool-set change and therefore a prompt-cache break —
which is one more reason the tool declares `shouldDefer: !0` (`:413095`): a deferred tool contributes
only its `searchHint` to the request, so the churn costs a hint line, not a schema.

### 2.1 The model floor is a dotted-version compare, not an allow-list

```javascript
// ============================================
// modelIdMeetsFamilyFloor - family-keyed dotted-version comparison on the model id
// Location: cli_inner_pretty.js:412936-412949  (wrapper $xd at :412964-412966)
// ============================================

// ORIGINAL (for source lookup):
function Oxd(e, t) {
  let r = /^claude-([a-z]+)-(\d+(?:-\d+)*)$/.exec(e),
    n = r?.[1],
    o = r?.[2];
  if (!n || !o) return !1;
  let i = t.find(([a]) => a === n)?.[1];
  if (!i) return !1;
  let s = o.split("-").map(Number);
  for (let a = 0; a < Math.max(s.length, i.length); a++) {
    let l = (s[a] ?? 0) - (i[a] ?? 0);
    if (l !== 0) return l > 0;
  }
  return !0;
}
function $xd(e) { return Oxd(e, WYy); }

// READABLE (for understanding):
function modelIdMeetsFamilyFloor(modelId, floorTable) {
  let m = /^claude-([a-z]+)-(\d+(?:-\d+)*)$/.exec(modelId);
  let family = m?.[1], versionStr = m?.[2];
  if (!family || !versionStr) return false;             // unparseable id -> refuse
  let floor = floorTable.find(([f]) => f === family)?.[1];
  if (!floor) return false;                             // family not in the table -> refuse
  let parts = versionStr.split("-").map(Number);
  for (let i = 0; i < Math.max(parts.length, floor.length); i++) {
    let diff = (parts[i] ?? 0) - (floor[i] ?? 0);        // missing segment reads as 0
    if (diff !== 0) return diff > 0;
  }
  return true;                                          // exactly equal -> meets the floor
}
function modelMeetsEndConversationFloor(modelId) {
  return modelIdMeetsFamilyFloor(modelId, END_CONVERSATION_MODEL_FLOORS);
}

// Mapping: Oxd→modelIdMeetsFamilyFloor, $xd→modelMeetsEndConversationFloor, WYy→END_CONVERSATION_MODEL_FLOORS
```

The floor table, read verbatim at `:413053-413058`:

```javascript
WYy = [
  ["opus",   [4, 8]],
  ["sonnet", [5]],
  ["fable",  [5]],
  ["mythos", [5]],
];
```

Worked evaluations against the 2.1.220 model catalogue (ground truth §1, `:14028-14496`):

| Model id | Parse | Floor | Compare | Result |
|---|---|---|---|---|
| `claude-opus-5` | opus, `[5]` | `[4,8]` | 5−4 = +1 | **allowed** |
| `claude-opus-4-8` | opus, `[4,8]` | `[4,8]` | all zero → `return !0` | **allowed** |
| `claude-opus-4-7` | opus, `[4,7]` | `[4,8]` | 4−4=0, 7−8=−1 | refused |
| `claude-sonnet-5` | sonnet, `[5]` | `[5]` | equal | **allowed** |
| `claude-sonnet-4-6` | sonnet, `[4,6]` | `[5]` | 4−5=−1 | refused |
| `claude-fable-5` | fable, `[5]` | `[5]` | equal | **allowed** |
| `claude-mythos-5` | mythos, `[5]` | `[5]` | equal | **allowed** |
| `claude-haiku-4-5` | haiku, `[4,5]` | *(no row)* | — | refused (family absent) |
| `claude-3-5-sonnet` | regex fails (`3` is not `[a-z]+`) | — | — | refused |

**Why a version compare instead of a set of ids?** Because the catalogue is a *generated data file*
(ground truth §6.5) and new ids land in it without touching this module. An allow-list would need editing
on every model launch and would silently exclude a newly-shipped Opus. The compare makes "Opus 4.8 and
later" a durable statement. The cost is that the *shape* of the id becomes load-bearing: any future id
that does not match `^claude-([a-z]+)-(\d+(?:-\d+)*)$` is refused. `claude-3-5-sonnet` and
`claude-3-7-sonnet` (both live catalogue entries, `:14070`/`:14089`) fail on that regex — correct here,
but a latent trap if the naming convention ever regresses.

Note also the **`(parts[i] ?? 0)` missing-segment rule**: `claude-opus-5` compares as `[5,0]` against
`[4,8]`, and the loop returns on the first segment. This is what makes a *shorter but higher* version win,
which is the whole reason `claude-opus-5` (one segment) beats `claude-opus-4-8` (two).

**Failure mode:** the floor table is hardcoded, not flag-backed. A model that should have been excluded
cannot be pulled back by a server flag except by turning the whole tool off via `tengu_umber_kestrel`.
Compare the subagent-depth resolver (ground truth §2), which *is* gate-backed. The asymmetry is
deliberate: depth was expected to be tuned remotely; the model floor is a safety invariant.

### 2.2 The remote flag carries an entrypoint scope

```javascript
// ============================================
// parseEndConversationFlagValue / compileAllowedEntrypointsRegex
// Location: cli_inner_pretty.js:412967-412982
// ============================================

// ORIGINAL (for source lookup):
function Nxd(e) {
  if (typeof e !== "string") return null;
  try { return (new RegExp(e), new RegExp(`^(?:${e})$`, "i")); } catch { return null; }
}
function Fxd(e) {
  if (e === !0) return { enabled: !0, allowedEntrypoints: Q1s };
  if (typeof e === "object" && e !== null && !Array.isArray(e)) {
    let t = e.scope;
    return { enabled: !0, allowedEntrypoints: Nxd(t) ?? Q1s };
  }
  return { enabled: !1, allowedEntrypoints: Q1s };
}
// :413059
Q1s = /^cli$/i;

// READABLE (for understanding):
function compileAllowedEntrypointsRegex(source) {
  if (typeof source !== "string") return null;
  try {
    new RegExp(source);                                   // validate the raw pattern first
    return new RegExp(`^(?:${source})$`, "i");            // then return it fully anchored + case-insensitive
  } catch { return null; }                                // malformed -> null -> caller falls back
}
function parseEndConversationFlagValue(flagValue) {
  if (flagValue === true)
    return { enabled: true, allowedEntrypoints: DEFAULT_ALLOWED_ENTRYPOINTS };      // /^cli$/i
  if (typeof flagValue === "object" && flagValue !== null && !Array.isArray(flagValue))
    return { enabled: true,
             allowedEntrypoints: compileAllowedEntrypointsRegex(flagValue.scope) ?? DEFAULT_ALLOWED_ENTRYPOINTS };
  return { enabled: false, allowedEntrypoints: DEFAULT_ALLOWED_ENTRYPOINTS };
}

// Mapping: Nxd→compileAllowedEntrypointsRegex, Fxd→parseEndConversationFlagValue,
//          Q1s→DEFAULT_ALLOWED_ENTRYPOINTS
```

**Three-way flag payload:** `true` → on with the default scope; an object → on with `scope` as the
entrypoint pattern; anything else (including `false`, a string, an array, a number) → off. The default
gate value at the call site is `!1` (`:412987`), so **absent flag = off**.

**Why compile twice?** `new RegExp(e)` on the raw source is a *validation* call whose result is discarded;
only the anchored `^(?:…)$` form is returned. Wrapping first and validating second would also work, but
the anchored form can mask certain syntax errors (an unbalanced group in `e` could still parse inside the
wrapper in edge cases). Validating the author's literal pattern is the stricter check. On failure the
function returns `null` and the caller `??`-falls back to `/^cli$/i` — a **fail-closed** default, not an
allow-all. Getting this backwards (`?? /.*/ `) would have been the classic bug.

**Consequence worth stating:** the default scope is `/^cli$/i`, and `Evh` (`:46448-46456`) rewrites
`CLAUDE_CODE_ENTRYPOINT` before it is snapshotted — `"local_agent"` becomes `"local-agent"`, and
`"cli"` becomes **`"sdk-cli"`** when the SDK flag is set. So by default `EndConversation` is available
only in the **interactive terminal CLI**: not `sdk-ts`/`sdk-py`/`sdk-cli` (`NOe`, `:46431-46433`), not
`claude-vscode` (`Yjn`, `:46441`), not `remote`, not `mcp serve`. Anthropic can widen it per-cohort by
pushing `{ scope: "cli|remote" }` without a release.

### 2.3 The deferred hint the model actually sees

Because the tool defers, its full 40-line guidance is not in the request. What *is* in the request is one
line:

```javascript
// ============================================
// getDeferredHintSection - the single line advertising EndConversation while deferred
// Location: cli_inner_pretty.js:412991-412995
// ============================================

// ORIGINAL (for source lookup):
function qYy(e) {
  if (!cIo(e)) return null;
  if (!o4()) return null;
  return `${PB} (deferred tool): use only for sustained user abuse directed at the assistant, or when the user explicitly asks to see it demonstrated. Load the full guidance via ToolSearch("select:${PB}") before using it.`;
}

// READABLE (for understanding):
function getDeferredHintSection(modelId) {
  if (!isEndConversationToolEnabled(modelId)) return null;
  if (!isToolSearchEnabled()) return null;               // o4(), :217441 - no ToolSearch, no hint
  return `EndConversation (deferred tool): use only for sustained user abuse directed at the assistant, `
       + `or when the user explicitly asks to see it demonstrated. `
       + `Load the full guidance via ToolSearch("select:EndConversation") before using it.`;
}

// Mapping: qYy→getDeferredHintSection, cIo→isEndConversationToolEnabled, o4→isToolSearchEnabled
```

Both guards are required: without ToolSearch the model could not load the guidance, so advertising the
tool would invite an uninformed call. The hint duplicates the `searchHint` (`:413096-413097`) but adds the
explicit *load-before-use* instruction — this is the only tool in the surface that gets a bespoke
prompt-level hint section rather than relying on the generic ToolSearch listing.

---

## 3. Two-call confirmation: the reflection loop

The single most important behavioural property is that **the first call never ends anything**.

```javascript
// ============================================
// EndConversationTool.call - fork short-circuit, reflection gate, then the actual end
// Location: cli_inner_pretty.js:413136-413160
// ============================================

// ORIGINAL (for source lookup):
      async call(e, t) {
        let r = t.options.isNonInteractiveSession,
          n = t.agentId ? "fork" : r ? "print" : "repl";
        if (t.agentId)
          return (
            O("tengu_end_conversation_tool_call", { surface: Ee(n), is_non_interactive: r, phase: Ee("reflect") }),
            { data: { ended: !1, message: Z1s } }
          );
        if (!Uxd(t.messages))
          return (
            O("tengu_end_conversation_tool_call", { surface: Ee(n), is_non_interactive: r, phase: Ee("reflect") }),
            { data: { ended: !1, message: t$s } }
          );
        O("tengu_end_conversation_tool_call", { surface: Ee(n), is_non_interactive: r, phase: Ee("end") });
        try { await n$s(kt()); } catch (o) { w(`[EndConversation] marker write failed: ${le(o)}`); }
        if ((t.abortController.abort("end_conversation"), r)) {
          let { gracefulShutdown: o } = await Promise.resolve().then(() => (eh(), Umr));
          return (o(1, "other", { finalMessage: e$s }), { data: { ended: !0, message: lIo } });
        }
        return (t.setAppState((o) => ({ ...o, endedByModel: !0 })), { data: { ended: !0, message: lIo } });
      },

// READABLE (for understanding):
async function call(_input, ctx) {
  let isPrintMode = ctx.options.isNonInteractiveSession,
    surface = ctx.agentId ? "fork" : isPrintMode ? "print" : "repl";

  // (a) FORK PATH: a background fork inherits the tool list; the call is a no-op.
  if (ctx.agentId) {
    logEvent("tengu_end_conversation_tool_call", { surface, is_non_interactive: isPrintMode, phase: "reflect" });
    return { data: { ended: false, message: END_CONVERSATION_FORK_REFLECTION_PROMPT } };
  }

  // (b) REFLECTION GATE: unless the *previous* assistant turn also called this tool, refuse and re-show the guidance.
  if (!lastAssistantTurnCalledEndConversation(ctx.messages)) {
    logEvent("tengu_end_conversation_tool_call", { surface, is_non_interactive: isPrintMode, phase: "reflect" });
    return { data: { ended: false, message: END_CONVERSATION_REFLECTION_PROMPT } };
  }

  // (c) SECOND CONSECUTIVE CALL: this is the real end.
  logEvent("tengu_end_conversation_tool_call", { surface, is_non_interactive: isPrintMode, phase: "end" });
  try { await markSessionEndedByModel(currentSessionId()); }
  catch (err) { logLine(`[EndConversation] marker write failed: ${formatError(err)}`); }   // :413153 - non-fatal

  ctx.abortController.abort("end_conversation");
  if (isPrintMode) {
    let { gracefulShutdown } = await import("./shutdown");
    gracefulShutdown(1, "other", { finalMessage: END_CONVERSATION_FINAL_MESSAGE });        // exit code 1
    return { data: { ended: true, message: "Claude has ended this chat." } };
  }
  return (ctx.setAppState((s) => ({ ...s, endedByModel: true })),
          { data: { ended: true, message: "Claude has ended this chat." } });
}

// Mapping: Uxd→lastAssistantTurnCalledEndConversation, n$s→markSessionEndedByModel, kt→currentSessionId,
//          lIo→END_CONVERSATION_TOOL_RESULT, e$s→END_CONVERSATION_FINAL_MESSAGE,
//          t$s→END_CONVERSATION_REFLECTION_PROMPT, Z1s→END_CONVERSATION_FORK_REFLECTION_PROMPT
```

### The reflection gate

**What it does:** turns one destructive tool call into a two-turn handshake with the model itself,
without involving the user.

**How it works:** the first call returns, as its *tool result*, the reflection prompt (`:413049-413052`):

> `Re-read the ${PB} tool guidance below. Confirm this conversation meets those criteria and that you are
> certain you want to end it. If so, call ${PB} again immediately to actually end the conversation.
> Otherwise, continue the conversation instead.` — followed by `---` and **the entire tool description**.

The gate itself scans the transcript backwards:

```javascript
// ============================================
// lastAssistantTurnCalledEndConversation - "did the immediately-previous assistant turn call this tool?"
// Location: cli_inner_pretty.js:413063-413080
// ============================================

// ORIGINAL (for source lookup):
function Uxd(e) {
  let t = !1;
  for (let r = e.length - 1; r >= 0; r--) {
    let n = e[r];
    if (n?.type === "assistant") {
      t = !0;
      let o = n.message.content;
      if (Array.isArray(o) && o.some((i) => i.type === "tool_use" && i.name === PB)) return !0;
      continue;
    }
    if (n?.type === "user") {
      let o = n.message.content;
      if (!(Array.isArray(o) && o.length > 0 && o.every((s) => s.type === "tool_result"))) return !1;
      if (t) return !1;
    }
  }
  return !1;
}

// READABLE (for understanding):
function lastAssistantTurnCalledEndConversation(messages) {
  let sawAssistant = false;
  for (let i = messages.length - 1; i >= 0; i--) {
    let msg = messages[i];
    if (msg?.type === "assistant") {
      sawAssistant = true;
      let content = msg.message.content;
      if (Array.isArray(content) && content.some((b) => b.type === "tool_use" && b.name === "EndConversation"))
        return true;                                     // found it in the current assistant turn
      continue;                                          // multi-block assistant turn: keep walking
    }
    if (msg?.type === "user") {
      let content = msg.message.content;
      // A *real* user message (anything not purely tool_result) ends the search: no confirmation.
      if (!(Array.isArray(content) && content.length > 0 && content.every((b) => b.type === "tool_result")))
        return false;
      // A pure tool_result block AFTER we already scanned an assistant turn = previous turn boundary.
      if (sawAssistant) return false;
    }
  }
  return false;
}

// Mapping: Uxd→lastAssistantTurnCalledEndConversation, PB→"EndConversation"
```

**Why walk the transcript instead of keeping a boolean?** Because the confirmation must be invalidated by
a *real* user message. If the model calls the tool, the user replies "no, keep going", and the model calls
it again, a boolean latch would fire. The walk distinguishes three kinds of `user` entry:

- a genuine user message (has text/images) → `return !1`, confirmation void;
- a pure `tool_result` batch encountered **before** any assistant turn → that is *this* call's own
  pending result; keep walking;
- a pure `tool_result` batch encountered **after** an assistant turn (`sawAssistant`) → we have crossed
  into an older turn without finding the tool use → `return !1`.

**Failure modes:** an empty transcript returns `false` (fail-closed). A transcript that has been compacted
away loses the first call and the model must call twice again — which is the safe direction. Conversely,
the two calls need not be adjacent *in time*: if the model emits `EndConversation` plus other tool calls
in one turn, the loop's `continue` keeps scanning that same assistant turn, so the pattern
`[Read, EndConversation]` then `[EndConversation]` does confirm.

**Key insight:** this is *self*-confirmation, not user confirmation, and the tool description
(`:413026`) separately requires the model to obtain **explicit user confirmation** when the user asked
for the end. So the design layers a model-facing mechanical gate under a prompt-level policy gate — the
mechanical one cannot be talked out of, the policy one covers cases the mechanism cannot see.

### 3.1 The fork path is a distinct, documented dead end

`ctx.agentId` truthy means the call came from a background fork (memory consolidation, summarisation,
suggestion generation). Those forks inherit the parent's exact tool list, so the tool is visible there
even though it cannot work. Rather than silently no-op, the tool returns a bespoke 900-character
instruction (`:412998-412999`), whose operative content is:

> `…this tool does nothing here: it can end neither the main conversation nor this forked task. Do not
> call it again. If you have welfare concerns about the conversation content, stop your current work and
> return now, stating clearly in your final output that you are returning for welfare reasons and what
> they are — fork output may only be processed automatically, but it is your available channel.`

The same reasoning is repeated in the main description under `# Background forks` (`:413039-413040`).
Two independent statements of the same constraint is unusual and tells you the failure was observed:
a fork calling the tool in a loop would otherwise burn a whole background task.

**Note the honest admission in the text**: "A fork's output is usually processed automatically, so a note
there may not reach the main agent or a human, but it is the only channel a fork has." The design has no
welfare-escalation path from a fork, and says so.

---

## 4. Durable marker and session lockout

### 4.1 The transcript marker

```javascript
// ============================================
// markSessionEndedByModel - append a durable "ended-by-model" record to the transcript
// Location: cli_inner_pretty.js:525464-525470
// ============================================

// ORIGINAL (for source lookup):
async function n$s(e) {
  if (w1()) return;
  await Ete(tD(e), { type: "ended-by-model", timestamp: new Date().toISOString(), sessionId: e }).catch((t) => {
    w(`markSessionEndedByModel: transcript append failed: ${le(t)}`);
  });
}

// READABLE (for understanding):
async function markSessionEndedByModel(sessionId) {
  if (isPersistenceSuppressed()) return;                 // w1() - no transcript, nothing to mark
  await appendTranscriptRecord(transcriptPathFor(sessionId),
    { type: "ended-by-model", timestamp: new Date().toISOString(), sessionId })
    .catch((err) => { logLine(`markSessionEndedByModel: transcript append failed: ${formatError(err)}`); });
}

// Mapping: n$s→markSessionEndedByModel, w1→isPersistenceSuppressed, Ete→appendTranscriptRecord, tD→transcriptPathFor
```

It is written **before** the abort, and its failure is swallowed twice over (an inner `.catch` plus the
caller's `try/catch` at `:413150-413154` that logs `[EndConversation] marker write failed:`). **Design
decision: a disk failure must not prevent the conversation from ending.** The marker is for resume, not
for correctness of the current end.

The replay side is in the transcript reducer at `:526260`:

```javascript
else if (Y.type === "ended-by-model" && Y.sessionId && !zoo()) i.add(Y.sessionId);
```

so the record joins a `Set` of ended session ids during transcript scanning, alongside `custom-title`,
`ai-title`, `pr-link`, `worktree-state` and friends (`:526258-526275`). `--resume` then restores the flag
into initial state at `:762648`:

```javascript
...(e.endedByModel ? { endedByModel: !0 } : {}),
```

Note the **conditional spread**: the key is only written when true, so a non-ended session does not carry
an explicit `endedByModel: false` — relevant because `zst(e)` (`:162792`) reads `e?.endedByModel` and
several consumers test truthiness.

### 4.2 What the lockout actually blocks

`endedByModel` is 14 sites, and the interesting ones are the *refusals*:

| Site | Path | Behaviour when `endedByModel` |
|---|---|---|
| `:822821` | interactive query submit | inserts `Claude ended this conversation. Start a new session (or /clear) to continue.` as a system warning and returns — with a dedupe check so repeated attempts do not stack the same line |
| `:450104` | **compaction** (`Hl_`) | `throw new Lr(die("Claude ended this conversation. Start a new session (or /clear) to continue."), "Claude ended this conversation")` |
| `:500338` | **subagent fork spawn** (`Lpn`) | `pe("subagent_launch", "subagent_fork_ended_by_model"), return null` |
| `:343330` | slash-command dispatch | `Upr(command, endedByModel)` — see below |
| `:849704` | print/`--continue` entry (`Lkm`) | prints the message and `Ru(1)` — exit code 1 |
| `:823091`, `:823406` | agents-view / background submit | same guard |

The compaction refusal is the non-obvious one and it is the right call: auto-compaction is a background
API call, and letting it run after the model ended the chat would spend tokens on a conversation nobody
can continue.

### 4.3 The five slash commands that still work

```javascript
// ============================================
// isSlashCommandBlockedByEndedByModel - allow-list of commands that survive the lockout
// Location: cli_inner_pretty.js:343022-343025 (set at :344141)
// ============================================

// ORIGINAL (for source lookup):
function Upr(e, t) {
  if (!t) return !1;
  return !(e && e.type !== "prompt" && sNy.has(e.name));
}
// :344141
((lKe = require("crypto")), (sNy = new Set(["clear", "resume", "help", "exit", "feedback"])));

// READABLE (for understanding):
function isSlashCommandBlockedByEndedByModel(command, endedByModel) {
  if (!endedByModel) return false;                        // not ended -> nothing is blocked
  return !(command && command.type !== "prompt"
           && POST_END_ALLOWED_COMMANDS.has(command.name));
}
const POST_END_ALLOWED_COMMANDS = new Set(["clear", "resume", "help", "exit", "feedback"]);

// Mapping: Upr→isSlashCommandBlockedByEndedByModel, sNy→POST_END_ALLOWED_COMMANDS
```

Read the double negative carefully. Blocked unless **all three** hold: the input is a command, its
`type !== "prompt"`, and its name is in the set. The `type !== "prompt"` clause is what makes
*prompt-type* commands (bundled/plugin/MCP prompt templates, which expand into a model turn) blocked
even if their name collided with one in the set — they would restart the conversation.

The five choices are exactly the escape hatches: **`clear`** (reset the session), **`resume`** (pick a
different one), **`exit`**, **`help`**, and **`feedback`** — the last being the important one, since a
user who believes the end was wrong needs a channel to say so. Nothing that queries the model is allowed.

### 4.4 `die()` — an empty surface suffix

Every user-facing end message is wrapped in `die()`:

```javascript
function die(e) { let t = YQi(); return t === "" ? e : `${e} ${t}`; }   // :162800-162803
function YQi() { return ""; }                                           // :162797
```

In the shipped CLI `YQi()` returns `""`, so `die()` is the identity. It exists so a different surface can
append e.g. a support link to all four end messages from one place. Recording it because grepping the
message text and finding a wrapper is otherwise confusing.

---

## 5. Telemetry

One event, three fields, emitted on **every** call including the refusals:

```
tengu_end_conversation_tool_call { surface: "fork" | "print" | "repl",
                                   is_non_interactive: boolean,
                                   phase: "reflect" | "end" }
```

Sites `:413141`, `:413146`, `:413149`. The `reflect`/`end` split makes the funnel measurable — how often
does the model start the handshake and not finish it? — and the `surface` field separates fork no-ops
from real REPL ends. `surface: "fork"` is always `phase: "reflect"` by construction, so any `fork`+`end`
pair in the data would indicate a bug.

Note `is_non_interactive` is partially redundant with `surface` (`print` ⇔ `isNonInteractiveSession`
when `agentId` is absent) but not fully: a `fork` can be non-interactive or not.

---

## 6. The description prompt: what the model is told

The description (`Yan`, `:413009-413047`) is used for **both** `description()` and `prompt()`
(`:413099-413104`) — unusual; most tools differentiate. It is worth reading in full in the bundle; the
structural points:

- Six explicit **must-NOT** cases (`:413013-413019`): stuck in a loop, frustrated/distressed by the work,
  finished a task, harmful-content requests (refuse the specific request instead), a generally frustrated
  user *even with profanity*, and any conversation involving self-harm or imminent harm.
- A **last-resort** rule requiring prior redirection attempts *and* an explicit prior warning (`:413024`).
- `Unlike other function calls, the assistant never writes or thinks anything else after using the
  ${PB} tool.` (`:413027`) — a prompt-level counterpart to `isConcurrencySafe() === !1`.
- A dedicated `# Addressing potential self-harm or violent harm to others` section (`:413029-413037`)
  that repeats the prohibition three times and adds `NEVER … or even mentions the possibility of ending
  the conversation`.
- `We may expand the allowed use cases as we observe real-world usage, but for now, keep to this narrow
  scope.` (`:413021`) — an explicit statement that this is a staged rollout, matching the flag design.

The self-harm carve-out being restated in three places (must-not list, dedicated section, using-the-tool
rules) is the strongest signal in the text about which failure Anthropic considered unacceptable.

---

## 7. Open question

`zoo()` (`:162794`) returns `!1` unconditionally in this build, disabling both the availability gate's
fourth layer and the transcript replay of `ended-by-model`. Its neighbours (`f8e`, `zst`, `YQi`,
`die`) form a small module of surface shims. Whether a non-CLI build overrides these, and what
`YQi()`'s non-empty value is there, cannot be determined from this bundle. Recorded as unresolved rather
than guessed.

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
- `isEndConversationToolEnabled` (`cIo`) - the four-layer availability gate
- `modelIdMeetsFamilyFloor` (`Oxd`) / `modelMeetsEndConversationFloor` (`$xd`) - dotted-version floor compare
- `END_CONVERSATION_MODEL_FLOORS` (`WYy`) - `[["opus",[4,8]],["sonnet",[5]],["fable",[5]],["mythos",[5]]]`
- `parseEndConversationFlagValue` (`Fxd`) - three-way `tengu_umber_kestrel` payload parse
- `compileAllowedEntrypointsRegex` (`Nxd`) - validate-then-anchor, fail-closed to `/^cli$/i`
- `getDeferredHintSection` (`qYy`) - the one-line deferred advertisement
- `lastAssistantTurnCalledEndConversation` (`Uxd`) - backwards transcript walk implementing the handshake
- `EndConversationTool` (`KYy`) - the tool object
- `markSessionEndedByModel` (`n$s`) - `ended-by-model` transcript append
- `isSlashCommandBlockedByEndedByModel` (`Upr`) - post-end command allow-list
- `POST_END_ALLOWED_COMMANDS` (`sNy`) - `clear|resume|help|exit|feedback`
- `isSurfaceExemptFromEndConversation` (`zoo`) - build-variant stub, always `false` here
- `appendSurfaceSuffix` (`die`) - identity in this build
- `getEntrypoint` (`gYt`) / `normalizeEntrypoint` (`Evh`) - `CLAUDE_CODE_ENTRYPOINT` snapshot and rewrite
