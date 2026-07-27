# Subagent text forwarding: the flag, the env var, and the depth-2 extension

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Two changelog bullets, eight months apart in release numbering but one feature:

> `.211` #1: *"Added `--forward-subagent-text` and `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` to forward
> subagent text in stream-json."*
> `.219` #6: *"Nested subagent forwarding in stream-json at depth 2+ with `--forward-subagent-text`."*

**Headline finding, and it narrows the first bullet: the underlying SDK option
`forwardSubagentText` is CARRYOVER.** It is 220=18 / **193=12**, present in 2.1.193 in the
`initialize` control-request schema (`:700766 (193)`), the SDK client (`:564369 (193)`), the query
options (`:702951`, `:703036`, `:703273 (193)`), the Agent tool (`:431010 (193)`), and the
options-merge helper (`:708501 (193)`). What `.211` added is the **CLI flag and the env var** — two new
ways to reach an option that already existed for SDK embedders. What `.219` added is a **new `else if`
branch, 3 lines**, in the Agent tool's message pump.

Neither bullet is wrong; both are narrower than they read.

---

## 1. What the option actually does

`forwardSubagentText` controls one predicate inside the Agent tool's `onMessage` callback, and one
predicate inside the thinking-display normalizer.

Without it, a subagent's conversation is invisible to the parent stream except for tool activity: the
parent forwards only `tool_use` and `tool_result` blocks upward, so an SDK consumer sees *that* the
subagent called Bash but never sees what it said. With it, every assistant/user content block from the
subagent is republished as an `agent_progress` frame carrying `parent_tool_use_id`, so a client can
render a nested transcript.

The CLI flag's own help text (`:851029-851031`) is the precise statement:

> `Forward subagent text and thinking blocks as assistant/user messages with parent_tool_use_id set
> (only works with --print and --output-format=stream-json)`

---

## 2. `.211` #1 — the flag and the env var

`--forward-subagent-text` 220=2 (`:829537`, `:851029`) / **193=0**.
`CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` 220=2 (`:31043`, `:829131`) / **193=0**.

Three sites make up the whole addition.

### 2.1 Registration

```javascript
// ============================================
// --forward-subagent-text commander option registration
// Location: cli_inner_pretty.js:851028-851032
// ============================================

// ORIGINAL (for source lookup):
      .option(
        "--forward-subagent-text",
        "Forward subagent text and thinking blocks as assistant/user messages with parent_tool_use_id set (only works with --print and --output-format=stream-json)",
        () => !0,
      )

// READABLE (for understanding):
      .option(
        "--forward-subagent-text",
        "Forward subagent text and thinking blocks as assistant/user messages with parent_tool_use_id set (only works with --print and --output-format=stream-json)",
        () => true,                       // coercer: presence-only boolean, no value accepted
      )

// Mapping: (commander builder, no obfuscated identifiers)
```

It is registered immediately after `--include-partial-messages` (`:851023-851027`), which it mirrors in
every respect — same coercer shape, same "only works with `--print` and `--output-format=stream-json`"
suffix, same validation treatment (§2.3). The env var is registered in the managed env-var getter
namespace at `:31043` (`CLAUDE_CODE_FORWARD_SUBAGENT_TEXT: () => Zth`), which means it is read through
`Z.<NAME>` rather than `process.env` and is therefore subject to the same managed-settings gating as
every other `CLAUDE_CODE_*` var.

### 2.2 Resolution — flag OR env

```javascript
// :829131
    Te = R || Z.CLAUDE_CODE_FORWARD_SUBAGENT_TEXT;
```

where `R` is the destructured `forwardSubagentText` flag (`:829069`). The env var is a plain OR, not a
default — the flag cannot turn it *off* once the env var is set. This matches the sibling at `:829130`
(`ae = I || Yt(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES)`), with one difference worth noting:
`--include-partial-messages` runs its env var through the boolean parser `Yt`, while
`--forward-subagent-text` uses raw truthiness on `Z.…`. So `CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES=0`
disables that feature but `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT=0` **enables** this one (the string `"0"`
is truthy). That is almost certainly unintended and is worth flagging to anyone scripting against it.

### 2.3 Validation — a deliberate asymmetry between flag and env

```javascript
// ============================================
// forward-subagent-text mode validation: hard error for the flag, silent downgrade for the env var
// Location: cli_inner_pretty.js:829535-829540
// ============================================

// ORIGINAL (for source lookup):
  if (Te) {
    if (!Rt || $ !== "stream-json") {
      if (R) return hs("Error: --forward-subagent-text requires --print and --output-format=stream-json.");
      Te = !1;
    }
  }

// READABLE (for understanding):
  if (forwardSubagentText) {
    if (!isPrintMode || outputFormat !== "stream-json") {
      if (flagWasPassedExplicitly)                       // R = the CLI flag, not the env var
        return exitWithUsageError("Error: --forward-subagent-text requires --print and --output-format=stream-json.");
      forwardSubagentText = false;                       // env-var-only: downgrade quietly
    }
  }

// Mapping: Te→forwardSubagentText, R→flagWasPassedExplicitly, Rt→isPrintMode, $→outputFormat, hs→exitWithUsageError
```

### The explicit-flag / ambient-env distinction

**What it does:** makes an unsatisfiable *request* fatal while making an unsatisfiable *ambient setting*
inert.

**How it works:** the guard tests the merged value `Te` to decide whether validation is needed, but
tests the raw flag `R` to decide the severity. If the user typed the flag, they asked for something the
current mode cannot do — an error is correct and actionable. If the value came only from the
environment, the user may be running an interactive session in a shell where the var is exported for
their SDK work; erroring would make the CLI unusable in that shell.

**Why this matters more than it looks:** environment variables are *process-inherited*. A background
agent, a hook's subprocess, or a `claude` invocation from inside a tool call all inherit
`CLAUDE_CODE_FORWARD_SUBAGENT_TEXT`, and most of those are not stream-json print sessions. A hard error
on the env path would turn one exported variable into a session-wide failure. The same three-line shape
is used for `--include-partial-messages` at `:829529-829534` and for `--prompt-suggestions` at
`:829525-829528` (which has no env var and therefore errors unconditionally).

**Key insight:** the pattern is "a flag is a *demand*, an env var is a *preference*". Reading only the
merged boolean would have lost that distinction, which is why `R` is kept live all the way to
validation rather than being folded into `Te` at `:829131`.

### 2.4 The second consumer: thinking display

`forwardSubagentText` is also one of five conditions in the thinking-display normalizer:

```javascript
// ============================================
// normalizeSubagentThinkingDisplay - decides whether a subagent's thinking blocks are omitted
// Location: cli_inner_pretty.js:119662-119668
// ============================================

// ORIGINAL (for source lookup):
function yBc(e, { useExactTools: t, forwardSubagentText: r, isAsync: n, isNonInteractiveSession: o, sessionDisplayExplicit: i }) {
  if (i || !o || t || r || n || e.type === "disabled" || e.display === "omitted") return e;
  return { ...e, display: "omitted" };
}

// READABLE (for understanding):
function normalizeSubagentThinkingDisplay(
  thinkingConfig,
  { useExactTools, forwardSubagentText, isAsync, isNonInteractiveSession, sessionDisplayExplicit },
) {
  if (
    sessionDisplayExplicit ||        // the user set --thinking-display: never override
    !isNonInteractiveSession ||      // interactive sessions render thinking themselves
    useExactTools ||                 // evaluation/replay mode: do not perturb the request
    forwardSubagentText ||           // the consumer asked for thinking blocks — keep them
    isAsync ||                       // background agents persist their transcript
    thinkingConfig.type === "disabled" ||
    thinkingConfig.display === "omitted"
  )
    return thinkingConfig;
  return { ...thinkingConfig, display: "omitted" };   // headless default: don't pay for summaries
}

// Mapping: yBc→normalizeSubagentThinkingDisplay, e→thinkingConfig, t→useExactTools,
//          r→forwardSubagentText, n→isAsync, o→isNonInteractiveSession, i→sessionDisplayExplicit
```

Called at `:344538-344543` when building a subagent's tool-use context.

**⚠ Correction to a shared tree document.** `00_overview/_false_delta_ledger.md` records this as
*"`yBc` (thinking-display normalizer) 220=2 / 193=2 — `yBc` itself is carryover"*. That count is an
instance of `_CONVENTIONS.md` **trap #1** (identifier re-mangling and reuse): in 2.1.193, `yBc` is a
different function entirely — `:9245-9247 (193)`, `function yBc(e) { return len(e, Tse, ynn); }`, a
vendored lodash-style helper aliased to `s7e`. The correct anchors for this function are
`display: "omitted"` (220=1 `:119667` / **193=0**) and `sessionDisplayExplicit` (220=2 / **193=0**), both
of which say the normalizer is **new in this shape**. The ledger's *conclusion* about `.198` (the delta
is the always-inherit call site) may still hold; its *evidence* does not.

**Why `forwardSubagentText` belongs in this list:** the default for a non-interactive subagent is
`display: "omitted"`, which tells the API not to return thinking summaries at all. If the consumer has
asked for subagent text to be forwarded, omitting thinking at the *request* level would make the
forwarding silently incomplete — the frames would arrive with no thinking blocks in them and no
indication why. So the flag has to reach back into request construction, not just into the forwarding
predicate. That coupling is the reason the help text says "text **and thinking blocks**".

---

## 3. `.219` #6 — forwarding at depth 2 and beyond

`tengu_remote_subagent_frame_nested` 220=1 (`:757401`) / **193=0** — but see §3.4; that anchor is
unreachable code and is *not* the implementation. The real anchor is the branch below.

### 3.1 The message pump before and after

Both builds route every message a subagent produces through an `onMessage` callback registered on the
subagent's query stream. Here is 2.1.193's, complete:

```javascript
// ============================================
// 2.1.193 subagent onMessage - agent_progress from a grandchild has no branch and is dropped
// Location: cli_inner_pretty.js:431011-431048 (193)
// ============================================

// ORIGINAL (for source lookup):
                ct = (nt) => {
                  if (xe) return;
                  if (nt.type === "spinner_mode") return;
                  if (nt.type !== "api_metrics" && nt.type !== "set_in_progress_tool_use_ids") Ne.push(nt);
                  if (!p) return;
                  if (nt.type === "api_metrics") { p(nt); return; }
                  if (nt.type === "set_in_progress_tool_use_ids") return;
                  if (nt.type === "progress" && (nt.data.type === "bash_progress" || nt.data.type === "powershell_progress"))
                    p({ type: "progress", toolUseID: nt.toolUseID, data: nt.data });
                  if (nt.type !== "assistant" && nt.type !== "user") return;      // <-- agent_progress dies here
                  ...
                  for (let Rt of Kb([nt])) {
                    let $t = Rt.message.content[0];
                    if (!qe && $t.type !== "tool_use" && $t.type !== "tool_result") continue;
                    p({ type: "progress", toolUseID: `agent_${d.message.id}`, data: { message: Rt, type: "agent_progress", ... } });
                  }
                },

// READABLE (for understanding):  (see the 220 version below; the shape is identical minus one branch)

// Mapping: ct→onSubagentMessage, nt→msg, qe→forwardSubagentText, p→emitToParent,
//          d.message.id→this Agent tool_use id, Kb→splitIntoSingleBlockMessages
```

The fall-through at `:431026 (193)` — `if (nt.type !== "assistant" && nt.type !== "user") return;` — is
the bug. A **depth-2** subagent's forwarded text arrives at its parent as
`{ type: "progress", data: { type: "agent_progress", … } }` (that is what the depth-1 forwarder emits,
last block above). At the depth-1 agent's own pump that message is neither `assistant` nor `user`, so it
returns, and the frame never reaches the session stream. Forwarding worked at exactly one level.

### 3.2 The 2.1.220 branch

```javascript
// ============================================
// forwardNestedAgentProgress - the .219 depth-2+ re-emit, preserving the original parentToolUseID
// Location: cli_inner_pretty.js:399018-399026
// ============================================

// ORIGINAL (for source lookup):
                    if (ut.type === "progress" && ut.data.type === "agent_progress") {
                      if (Tr)
                        d({
                          type: "progress",
                          toolUseID: ut.toolUseID,
                          parentToolUseID: ut.parentToolUseID,
                          data: ut.data,
                        });
                      return;
                    }
                    if (ut.type !== "assistant" && ut.type !== "user") return;

// READABLE (for understanding):
                    if (msg.type === "progress" && msg.data.type === "agent_progress") {
                      if (forwardSubagentText)
                        emitToParent({
                          type: "progress",
                          toolUseID: msg.toolUseID,               // keep the GRANDCHILD's ids
                          parentToolUseID: msg.parentToolUseID,   // ...including its spawning Agent tool_use id
                          data: msg.data,                         // ...and its payload verbatim
                        });
                      return;                                     // never fall through to the depth-1 path
                    }
                    if (msg.type !== "assistant" && msg.type !== "user") return;

// Mapping: ut→msg, Tr→forwardSubagentText (= l.options.forwardSubagentText, :398969), d→emitToParent
```

### Why the re-emit preserves ids instead of re-tagging

**What it does:** relays a grandchild's `agent_progress` frame upward unchanged, rather than wrapping it
as new progress belonging to the child.

**How it works:**

1. The depth-1 forwarder (`:399033-399048`) tags its frames `toolUseID: \`agent_${u.message.id}\`` —
   a synthetic id derived from **this** Agent tool call's assistant message.
2. The nested branch does **not** do that. It copies `ut.toolUseID` and `ut.parentToolUseID` straight
   through, so the frame still identifies the *grandchild* and still names the Agent `tool_use` id that
   spawned the grandchild.
3. `return` immediately — so a nested frame never also takes the depth-1 path.

**Why this approach:** the SDK consumer's job is to attach each frame to a node in a tree. The only
stable key for "which Agent call is this text coming from" is the `tool_use` id of the `Agent`
invocation that started it. Re-tagging at each hop would rewrite that key once per level, and by depth 3
the frame would claim to belong to the depth-1 agent. Preserving the id makes the relay **idempotent**:
the same three lines work at depth 2, 3, and up to the spawn-depth cap (`ZDu = 3`, see
[`../53_subagent_limits/`](../53_subagent_limits/)), and each level is a pure pass-through.

**The alternative the code rejects** is carrying an explicit depth counter or a path array. That would
need a schema change on the progress frame and a migration for existing consumers. Reusing
`parentToolUseID` — a field the frame already carried — costs nothing on the wire.

**Failure mode this closes, and one it does not.** It closes silent loss (frames vanishing at depth 2).
It does not bound volume: with forwarding on and depth 3 allowed, every token a leaf agent produces
crosses two relays before reaching stdout. There is no de-duplication and no rate limit on this path —
which is one more reason the feature is opt-in and print-mode-only.

**Why `return` rather than falling through:** without it, a nested frame would also reach
`if (ut.type !== "assistant" && ut.type !== "user") return;` — harmless today — but more importantly the
early `return` documents that this branch is *terminal*, so a future `progress` handler added below
cannot accidentally double-emit nested frames.

### 3.3 The parallel path for background subagents

`runAgent` has a second, independent forwarder for sessions that publish frames to a background/remote
transport (`:344717-344739`). It has the same two-branch shape:

```javascript
        if (o && L) {
          let In = tdd();                                          // the frame writer, if one is installed
          if (In && (jr.type === "assistant" || jr.type === "user"))
            for (let ni of Bw([jr])) {
              let Vt = Yon({ toolUseID: `agent_${oe}`, parentToolUseID: L, data: { message: ni, type: "agent_progress", … } });
              for (let un of iKe(Vt, Tr)) In.write(un).catch((dn) => w(`bg-subagent progress write failed: ${dn}`, { level: "warn" }));
            }
          else if (In && jr.type === "progress" && jr.data.type === "agent_progress" && r.options.forwardSubagentText)
            for (let ni of iKe(jr, Tr))
              In.write(ni).catch((Vt) => w(`bg-subagent nested progress write failed: ${Vt}`, { level: "warn" }));
        }
```

Note the log strings: `bg-subagent progress write failed` (depth 1) vs
`bg-subagent nested progress write failed` (`:344739`, depth 2+). Both are 220=1/193=0. The depth-1 arm
here is **not** gated on `forwardSubagentText` — background sessions always publish assistant/user
frames because the agent view needs them — while the nested arm **is**. That asymmetry is deliberate: a
background agent's own transcript is a product feature; its grandchildren's transcripts are the opt-in.

### 3.4 ⚠ The scoping anchor `tengu_remote_subagent_frame_nested` is dead code

The scoping pass anchored `.219` #6 to `tengu_remote_subagent_frame_nested` at `:757401`. That gate is
220=1 / 193=0, so the count looks right. Reading the site does not support it:

```javascript
// :757390-757408, verbatim
        let ut = null;
        if (ut !== null) {
          if (typeof we.uuid === "string" && lqt(_, we.uuid, "ccr")) return;
          if (ut.length > 0) {
            ...
            let it = ut[0].parentToolUseID;
            if (!Lt.has(it)) (Lt.add(it), O("tengu_remote_subagent_frame_nested", { frame_type: fe(we.type) }));
            ...
          }
          return;
        }
```

`ut` is assigned `null` on the line before the test and is never reassigned. **The entire block is
unreachable in the 2.1.220 build.** This is the signature of a constant-folded feature flag: whatever
expression used to produce the nested-frame list in the Remote Control renderer has been replaced by
`null`, leaving the guarded body as dead weight the minifier did not remove (it cannot prove
`O(...)` and `t(...)` are side-effect-free).

Consequences for a reader:

- The **telemetry gate never fires** in this build. Do not expect
  `tengu_remote_subagent_frame_nested` in any dashboard from 2.1.220.
- Nested forwarding in **Remote Control clients** (`757xxx` is the RC message-list component) is
  therefore *not* wired, even though nested forwarding in **stream-json** is. The `.219` bullet says
  "in stream-json", so the bullet is accurate; the anchor was picked from the wrong subsystem.
- A gate name appearing with a 220=N/193=0 count is not proof of a live feature. This is the cleanest
  counter-example in the tree to the `_raw_asset_diff` guidance that "a new `tengu_*` name is almost
  always a real new call site".

---

## 4. Where the option travels

For anyone tracing the value end to end in 2.1.220:

| Hop | Site | Note |
|---|---|---|
| commander flag | `:851029` | `--forward-subagent-text` |
| env-var namespace | `:31043` | `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` |
| argv destructure | `:829069` | `forwardSubagentText: R` |
| merge with env | `:829131` | `Te = R \|\| Z.CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` |
| mode validation | `:829537` | hard error only for the explicit flag |
| SDK `initialize` schema | `:838435` | `forwardSubagentText: v.boolean().optional()` — **carryover**, 193 `:700766` |
| SDK client send | `:548602` | `this.initConfig?.forwardSubagentText` — carryover, 193 `:564369` |
| query options | `:842666`, `:842712`, `:841271`, `:841366`, `:841638` | plumbing |
| options merge helper | `:849429` | `if (e.forwardSubagentText !== void 0) c.forwardSubagentText = …` — carryover, 193 `:708501` |
| subagent context build | `:344540`, `:344545` | into `yBc` and onto the child's options |
| **depth-1 forward** | `:399034` | `if (!Tr && it.type !== "tool_use" && it.type !== "tool_result") continue;` — carryover, 193 `:431033` |
| **depth-2+ forward** | `:399018-399026` | **`.219`, net-new** |
| bg/remote depth-2+ | `:344737-344739` | **`.219`, net-new** |
| print-mode option | `:846753` | `forwardSubagentText: d.forwardSubagentText` |

---

## 5. Not covered here

- The spawn-depth cap that makes depth-2+ reachable at all (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`,
  `ZDu = 3`, gate `tengu_hazel_trellis`) — [`../53_subagent_limits/`](../53_subagent_limits/) and
  [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §2.
- The Remote Control message-list component around `:757000-757500` beyond the dead block in §3.4 —
  [`../54_remote_control/`](../54_remote_control/).
- `agentProgressSummaries` (`:838434`, gate `tengu_slate_prism` `:847559`), a sibling `initialize`
  option that summarises rather than forwards. Not in any bullet in this window and not investigated.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_headless_sdk.md](../00_overview/symbol_additions_v2_1_220_headless_sdk.md).

Key functions in this document:
- `normalizeSubagentThinkingDisplay` (`yBc`, `:119662`) - five-condition thinking-omit normalizer; **not** the 193 `yBc`
- `runAgentTool` message pump (`:398966-399050`) - holds both the depth-1 and the new depth-2+ forwarders
- `runAgent` background frame publisher (`:344717-344739`) - the second, transport-side forwarder
- `getSubagentFrameWriter` (`tdd`, `:340754`) - returns the installed background frame writer or undefined
- `buildAgentProgressFrame` (`Yon`, `:530801`) - constructs the `agent_progress` progress frame
- `toWireFrames` (`iKe`, `:341013`) - generator turning an internal message into SDK wire frames
- `resolveHeadlessOptions` (`:829060-829560`) - argv destructure, env merge, and mode validation
