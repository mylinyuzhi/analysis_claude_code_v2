# Ground truth: anchors verified by hand in the 2.1.220 bundle

Every row below was **grepped in both bundles and the 2.1.220 line was read** during the
orchestration pass, before any module agent ran. Treat these as settled facts: build on them,
and if your own reading disagrees, say so loudly rather than silently overriding.

Bundles (see [`_CONVENTIONS.md`](_CONVENTIONS.md) §1):

```
T=/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js   # 872,596 lines
B=/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js   # 718,679 lines
```

---

## 1. THE BIGGEST UNDOCUMENTED DELTA: the model registry was rewritten

The changelog announces two models (Sonnet 5 in `.197`, Opus 5 in `.219`) but **never mentions that the
whole model registry changed shape**. It did, and it is the largest single structural change in the window.

| Fact | v2.1.193 | v2.1.220 |
|------|----------|----------|
| Where models live | scattered, camelCase, around `cli_inner_pretty.js:95696 (193)` | one declarative catalogue at `cli_inner_pretty.js:14028-14496` |
| Provider-id key style | `firstParty` / `anthropicAws` (camelCase) — `:95696-95702 (193)` | `provider_ids: { first_party, bedrock, vertex, foundry, anthropic_aws, anthropic_google_cloud, mantle, gateway }` (snake_case) — `:14369-14378` |
| `provider_ids` literal | **0** | 22 |
| `knowledge_cutoff` | **0** | 16 |
| `advisor_rank` | **0** | 12 |
| `latest_per_family` | **0** | 4 (`:14489-14494`) |
| `alias_migration` | **0** | 4 (`:14495`) |
| `vertex_region_env_var` | **0** (193 used a pair-array at `:4077 (193)`) | 19 (`:14380`) |
| `supports_1m_suffix` | **0** | 13 (`:14382`) |
| `tier_5_25` / `tier_10_50` pricing tokens | **0 / 0** | 6 / 3 |

So: the per-model data moved from imperative branch-on-id code into a **data-driven catalogue**, and
`anthropic_google_cloud` appears as a brand-new provider channel. This deserves its own deep-dive doc
in `47_models/` and is the single best example in this tree of "the changelog under-reports the change".

### Verified catalogue entries

The catalogue holds **17 model ids** at these exact lines in 2.1.220:

```
14028 claude-3-5-haiku    14048 claude-haiku-4-5    14070 claude-3-5-sonnet   14089 claude-3-7-sonnet
14108 claude-sonnet-4-0   14130 claude-sonnet-4-5   14153 claude-sonnet-4-6   14177 claude-sonnet-5
14215 claude-opus-4-0     14236 claude-opus-4-1     14257 claude-opus-4-5     14280 claude-opus-4-6
14304 claude-opus-4-7     14330 claude-opus-4-8     14365 claude-opus-5       14402 claude-fable-5
14439 claude-mythos-5
```

`claude-mythos-5` (`:14439-14458`) is **not in the changelog at all**. Its entry carries
`first_party: "claude-mythos-5"` with **every other provider id `null`** (bedrock, vertex, foundry,
anthropic_aws, anthropic_google_cloud, mantle, gateway) and `capabilities: []`.

> ⚠ **CORRECTED — it is NOT new, and the direction of travel is the opposite of what this section
> originally implied.** Re-measured with `grep -cF`: `claude-mythos-5` is **220=25 / 193=31** — the count
> went **down**. The family already existed in 2.1.193 **with third-party provider ids populated**:
>
> ```
> 193:95716      firstParty: "claude-mythos-5",
> 193:95717      bedrock: "us.anthropic.claude-mythos-5",
> 193:95718      vertex: "claude-mythos-5",
> ```
>
> So 2.1.220 **de-provisioned** it: Bedrock and Vertex ids stripped to `null`, `capabilities` emptied.
> The correct framing is *"an unannounced family that was narrowed to first-party-only in this window"*,
> **not** *"an unannounced new family"*. `advisor_rank: 5` and `pricing: "tier_10_50"` survive.
> A count that falls is the signature of a withdrawal, and it is easy to misread as an introduction when
> the entry is simply *unfamiliar* — unfamiliar to the reader is not the same as new to the build.

**Opus 5 entry (`:14365-14400`), read verbatim:**
- `display_name: "Opus 5"`, `family: "opus"`, `knowledge_cutoff: "May 2026"`
- `context: { window: 1e6, native_1m: !0, supports_1m_beta: !0, supports_1m_suffix: !0 }`
- `max_output_tokens: { default: 64000, upper: 128000 }`
- `pricing: "tier_5_25"` — matches the changelog's `$10/$50` claim only *after* the fast-mode multiplier;
  the base tier token says 5/25. **Reconcile this in the doc, don't paper over it.**
- `capabilities: ["effort","max_effort","xhigh_effort","adaptive_thinking","mid_conv_system",
  "context_management","fast_mode","lean_prompt","refusal_fallback","opus_5_prompt_bundle"]` —
  `opus_5_prompt_bundle` is a **220-only capability token** (220=2 / 193=0)
- `fallback_3p: "claude-opus-4-8"`, `vertex_region_env_var: "VERTEX_REGION_CLAUDE_5_OPUS"`

**Sonnet 5 entry (`:14177-…`)**: `provider_ids.first_party: "claude-sonnet-5"`, `bedrock:
"us.anthropic.claude-sonnet-5"`.

**Alias table (`:14461-14486`)** — the "which model does `opus`/`sonnet` mean" resolution, and it is
**provider-dependent**, which is a much more interesting story than the changelog's flat claim:

```
opus:   default "claude-opus-5"   but foundry→"claude-opus-4-6",  gateway→"claude-opus-4-7"
sonnet: default "claude-sonnet-5" but bedrock/vertex/foundry/mantle→"claude-sonnet-4-5",
                                      anthropic_aws/gateway→"claude-sonnet-4-6"
haiku:  "claude-haiku-4-5"        fable: "claude-fable-5"
best:   "fable"        (:14488)
```

So `.219`'s "now the default Opus model" is **first-party-only**; Foundry and gateway users do *not*
get Opus 5 from the `opus` alias. Same for Sonnet 5 on Bedrock/Vertex. This nuance is invisible in the
changelog and is exactly the kind of thing this tree exists to surface.

Other verified model-adjacent anchors: `"claude-opus-5": "opus5"` short-name map `:100233`;
`:109715` / `:109775` `(e === "claude-opus-4-8" || e === "claude-opus-5")` capability branches;
`:111121` id-normaliser; `:119700`/`:119704` allow-list branches; `:120149`/`:120202` pricing-suffix
call sites via `Goe("claude-opus-5", e)`; `:120029` `lo(CT()) === "claude-sonnet-5"` (a *is the session
on Sonnet 5* predicate — relevant to the `.201` mid-conversation-system-role bullet).

---

## 2. Subagent orchestration limits — genuinely net-new, with a gate

All four env vars are **220>0 / 193=0**. They are registered together in the env-var accessor table at
`:32122-32125` and read at `:231400-231406`.

| Env var | Line (accessor) | Line (read) | Default | Notes |
|---------|-----------------|-------------|---------|-------|
| `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` | `:32122` | `:231406` (`?? _ty`) | 200 per changelog — **verify `_ty`** | refusal text `:403669` |
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | `:32123` | `:230897` | **`ZDu = 3`** (`:230907`) | see below |
| `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` | `:32124` | `:231403` (`?? yty`) | 200 per changelog — **verify `yty`** | refusal text `:398397` |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | `:32125` | `:231400` (`?? gty`) | 20 per changelog — **verify `gty`** | refusal text `:398411` |

Two of them are also listed in a settings/env allow-list at `:58164` and `:58166`.

**`getMaxSubagentSpawnDepth` (`hee`, `:230896-230906`) read verbatim — a 3-tier resolution:**

```javascript
function hee() {
  let e = Z.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH;
  if (e !== void 0) return e;                                  // 1. env var wins
  if (Dus === null) {                                          // 2. memoised GrowthBook gate
    let { getFeatureValue_CACHED_MAY_BE_STALE: t } = (Zr(), en(iRt)),
      r = t(sty, ZDu);                                         //    gate "tengu_hazel_trellis"
    Dus = typeof r === "number" && Number.isInteger(r) && r >= 1 ? r : ZDu;
  }
  return Dus;                                                  // 3. hardcoded default 3
}
var ZDu = 3, sty = "tengu_hazel_trellis", Dus = null;
```

This single function is the source-proof of the `.217`→`.219` flip-flop in the changelog
(`.217`: "no longer spawn nested subagents by default"; `.219`: "up to depth 3 by default (was 1)").
The **remote gate `tengu_hazel_trellis` is how the default moved without a release** — the shipped
constant is 3 but a server value overrides it. Note the validation `Number.isInteger(r) && r >= 1`
silently falls back to 3 on a bad payload. `tengu_hazel_trellis` is in the 326 new-gate list.

**Trap:** 193's depth limit existed too, but as an *obfuscated constant with no string literal*
(the 2.1.193 tree named it `SUBAGENT_DEPTH_LIMIT`/`FBt` = 5). Grepping `SUBAGENT_DEPTH` in 193
returns **0 hits** — that is a naming artefact, **not** proof the feature is new. The 193 nesting
refusal message is at `:430482 (193)`; compare it to 220's `:398328`, which gained
`If the user explicitly requested deeper nesting, ask them to raise CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH.`
So: depth limiting is **carryover**; the *env override, the gate, the value 3, and the three sibling
caps* are the delta.

---

## 3. CONFIRMED FALSE-DELTA TRAPS (the changelog says "Added"; the code says otherwise)

Do not write any of these up as an introduction. Each needs its *real, narrower* delta found.

| Changelog claim | Reality | Evidence |
|---|---|---|
| `.208` "Added screen reader mode … `--ax-screen-reader`, `CLAUDE_AX_SCREEN_READER`, `axScreenReader`" | **All three already exist in 2.1.193.** The setting is at `:55849 (193)`, resolution at `:137296-137299 (193)`, flag at `:714398 (193)` — with a *byte-identical description string*. | 220: setting `:60191`, resolver `:156204-156208`, flag `:851358`. **Real delta:** 220's resolver returns a *source tuple* (`t = "flag"` / `"settings"`, `:156204`/`:156208`) that 193 lacks, plus the actual plain-text renderer + announcements. It was **dark-launched in 193 and promoted in .208**. |
| `.219` "Added `sandbox.network.strictAllowlist` setting" | The **enforcement** already existed: `:211506 (193)` `if (!n \|\| Ya.network.strictAllowlist) return … denying` — 193=1. | 220=4. **Real delta:** the *public settings surface* — zod field `:49648`, settings merge `:62415`, managed-settings aggregation `:205177` — plus enforcement now at `:195200`. Readable-but-unsettable → settable. |
| `.216` "Added `sandbox.filesystem.disabled` setting" | 220=7 / **193=6**. | Same pattern as above — find which of the 7 sites is new (`:49737` is the 220 zod area, first hit `:195430`). |
| `.207` "disable via `disableAutoMode` in settings" | 220=7 / **193=7** — the setting is pure **carryover**. | Real delta is the *default availability* on Bedrock/Vertex/Foundry, not the kill switch. |
| `.214` "`Needs attention`" / `.212` "`Needs input`" agent-view states | `Needs attention` 220=1 / **193=1**; `Needs input` 220=2 / **193=2**. | The label strings are carryover; the delta is in the *state-machine* that assigns them. |
| `.196` "streaming idle watchdog now on by default … `CLAUDE_ENABLE_STREAM_WATCHDOG=0` to disable" | Literal count went **DOWN**: 220=2 / 193=4. | A default-on flip *removes* gating code. Read both sets of sites; the delta is a deleted opt-in branch, so frame it as a removal, not an addition. |
| `.199` "`CLAUDE_CODE_RETRY_WATCHDOG` now raises the default retry count to 300 and lifts the cap of 15 on `CLAUDE_CODE_MAX_RETRIES`" | Literals are carryover: `RETRY_WATCHDOG` 220=2/193=2, `MAX_RETRIES` 220=5/193=4. | The delta lives in **numeric constants** (300; the removal of the 15 cap the 193 tree documented as `MAX_RETRIES_CAP`/`Ujo`). Grep the numbers, not the names. |
| ~~`.202` "Added `workflow.run_id` / `workflow.name` OTel attributes"~~ **ROW RETRACTED** | ❌ **This row was a FALSE CARRYOVER.** The `220=3 / 193=2` figure is a **grep artefact**: the unescaped `.` is a regex wildcard, so it also matched 193's *snake_case* `workflow_run_id` (`:424852`, `:424892 (193)`) — a different namespace. With `grep -cF`: `workflow.run_id` **1/0** and `workflow.name` **1/0**. | **Both attributes are genuinely NET_NEW**, emitted together on one line `:111461`. Caught by the `by_version/2.1.202` pass, re-verified by the orchestrator. See [`44_telemetry/otel_attributes_and_correlation.md`](44_telemetry/otel_attributes_and_correlation.md). |
| `.218` "`context: fork` skills run in the background by default" | `context: fork` 220=3 / **193=2**. | The enum member is carryover (193 `:149313`, `:230371`, `:398210`). The delta is the *background default* + `background: false` opt-out. |
| `.214` OTel `client_request_id` / `tool_source` | `client_request_id` 220=7 / **193=5** (partial); `tool_source` 220=1 / **193=0** (genuinely new, `:152009`). | Split the bullet — don't call both new. |

**Method that catches these:** always run `grep -c 'literal' $T $B` (both files in one call) *before*
writing a word. A non-zero 193 count means the bullet is over-claiming and your job is to find the
narrower true delta.

---

## 4. Verified NET-NEW anchors (220>0, 193=0) — safe to build on

### 4.1 EndConversation tool (`.214`) — rich, deserves a full doc

`END_CONVERSATION_TOOL_NAME` = `PB` = `"EndConversation"` at `:231369`. The module's export table at
`:412952-412962` reveals the whole surface:

```
parseEndConversationFlagValue      Fxd
modelMeetsEndConversationFloor     $xd      <- a MODEL FLOOR gate; the semver compare is at :412940-412949
isEndConversationToolEnabled       cIo
getDeferredHintSection             qYy
compileAllowedEntrypointsRegex     Nxd      <- entrypoint allow-list
END_CONVERSATION_TOOL_RESULT       lIo
END_CONVERSATION_TOOL_NAME         PB
END_CONVERSATION_REFLECTION_PROMPT       t$s
END_CONVERSATION_FORK_REFLECTION_PROMPT  Z1s   <- a SEPARATE prompt for the fork path
```

Also: `lastAssistantTurnCalledEndConversation` (`Uxd`) and `EndConversationTool` (`KYy`) exported at
`:413062`; a marker-write failure log `[EndConversation] marker write failed:` at `:413153`; the tool is
wired into the registry at `:425147`. Telemetry gate `tengu_end_conversation_tool_call` is in the new-gate
list. **Four separate gates (model floor + entrypoint regex + enable flag + flag value parse) guard one
tool** — that layering is the interesting story.

### 4.2 `DirectoryAdded` hook (`.219`)

220=20 / 193=0. Registered in the hook-event enum at `:49396`, empty-config slots at `:271032` and
`:271149`, payload construction `{ ...Kf(void 0), hook_event_name: "DirectoryAdded", directory: e, source: t }`
at `:518818`, dispatcher `executeDirectoryAddedHooks` = `a2t` at `:519444`/`:519508`, switch arm
`:520412`, matcher list `:522099`, and the `/add-dir` call site with its three failure paths at
`:655141-655162`. `register_repo_root` (the SDK control request that also fires it) is 220=15 / **193=3**
— so the control request pre-existed and only the hook firing is new.

### 4.3 `workflowSizeGuideline` (`.219`) + dynamic workflow size (`.202`)

220=21 / 193=0. Zod field `:60914`; `isWorkflowSizeGuidelineSetBySettings`-style predicate
`:389150` (`SI()?.settings.workflowSizeGuideline !== void 0`); resolution with fallback `:389153`;
two prompt-injection sites `:389362`/`:389365` (`rMs + iMs(xt().workflowSizeGuideline)`);
`/config` row gating `workflowSizeGuidelineToggleable` `:451231`, `:451295`, row id `:451504`.
The `.219` bullet "the `/config` row is hidden while one does [set it]" maps exactly to the
`Toggleable` plumbing — a clean, provable bullet→code chain.

### 4.4 Other confirmed net-new (220>0 / 193=0), with a first-hit line

| Anchor | 220 | first line | Theme |
|---|---|---|---|
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | 3 | `:32120` | mcp |
| `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` | 2 | `:24390` | telemetry |
| `tool_source` | 1 | `:152009` | telemetry |
| `forward-subagent-text` | 2 | `:829537` | headless_sdk |
| `mcp_server_errors` | 3 | `:593620` | headless_sdk / mcp |
| `emojiCompletionEnabled` | 2 | `:61202` | accessibility_ui |
| `vimInsertModeRemaps` | 2 | `:61454` | accessibility_ui |
| `CLAUDE_CODE_PROCESS_WRAPPER` | 13 | `:60632` | background_agents |
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | 3 | `:31082` | accessibility_ui |
| `auto-mode reset` | 1 | `:865404` | permissions / slash_cli |

### 4.5 `/subtask` (`.212`, the `/fork` split)

Command object `name: "subtask"` at `:500574`, usage string `Usage: /subtask \<task\>` at `:500549`.
`--fork-name` is in the new-CLI-flag list and appears in a flag set at `:443144`
(`new Set(["--org", "--fork-name", "--remote-name"])`).

### 4.6 Auto-mode classifier — much deeper than the changelog suggests

The classifier prompt corpus around `:443172-443379` is large and includes a **tool-call outcome
taxonomy** that is worth documenting on its own: `'ok'`, `'error'`, `'interrupted'`,
`'rejected-by-user'`, `'blocked-by-permissions'`, `'automode-blocked'`, `'automode-unavailable'`
(fail-closed, *not* a policy decision), `'automode-parsing-error'` (also fail-closed). See `:443172`.
Scope-limiting preamble at `:443183` ("prevents destructive, hard-to-undo, or security-relevant actions
**only**" + an explicit out-of-scope list). The `Unverifiable Deletion Target` rule at `:443379` is the
source of `.205`'s "ask before running `rm -rf` on a variable it can't resolve from context" — and the
rule text explains *why* (`an empty or unexpected $VAR turns rm -rf "$VAR"/* into a $HOME wipe`) and how
it clears. Staged classifier telemetry: `classifierStage: "xml_s1"` `:444073`, `"xml_s2"` `:444181`,
stall log `:444344`, and a beta-rejection self-heal at `:444418`.
`dangerous` count 220=136 / 193=117 — a real but partial-overlap delta, so diff site-by-site.

---

## 5. Tool surface: 50 → 65 entries

`assets/tools/_index.json` has **65** entries in 220 vs **50** in 193. New `.md` files present in 220
and absent in 193:

```
ClaudeDesign  EndConversation  ListConnectors  ObserverReport  RefreshMcpTools  ReportFindings
SearchMcpRegistry  SendFeedback  SendFile  SuggestConnectors  SuggestPluginInstall  SuggestSkills
propose_skills  _unknown_
```

`_unknown_` / `<unknown>` / `eval_registered________` / `explain_command` / `mcp` are **detector noise**,
not tools — the top-level `assets/tools_index.json` is broken (1 entry). Each candidate above must be
individually grep-confirmed in the bundle with a 193 zero-count before being called new; some are
plausibly claude.ai-surface tools that existed earlier under a different registration.
`ReportFindings` is confirmed real: description at `:403823`, `searchHint: "report code-review findings
as a structured list"` at `:403879`.

---

## 6. RESOLVED: three changelog↔code discrepancies (already nailed — use these, don't re-derive)

### 6.1 The subagent-cap defaults match the changelog exactly

`:231411-231413` declares them literally:

```javascript
gty = 20,     // CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS   -> read by gPu()  :231400
yty = 200,    // CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION  -> read by Q7r()  :231403
_ty = 200,    // CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION -> read by yPu() :231406
```

All three read `Z.<ENV> ?? <const>` with **no gate and no validation** — unlike the spawn-depth
resolver (§2), which is gate-backed and validates. That asymmetry is worth a paragraph: the three
budget caps were shipped as plain constants, the depth cap as a remotely-tunable gate, because depth
was the one Anthropic expected to change without a release (and it did, `.217`→`.219`).

### 6.2 ⚠ `.219` "Removed Opus 4.7 from fast mode" is NOT in the 2.1.220 client bundle

`fast_mode` is a capability on exactly three models — Opus 4.7 `:14324`, Opus 4.8 `:14357`,
Opus 5 `:14392` — and the eligibility predicate `isFastModeEligibleModel` (`mv`, `:109468-109474`)
**allows Opus 4.7 twice over**:

```javascript
// ============================================
// isFastModeEligibleModel - decides whether /fast can apply to a model
// Location: cli_inner_pretty.js:109468-109474
// ============================================

// ORIGINAL (for source lookup):
function mv(e) {
  if (!vl()) return !1;
  let t = e ?? Z$(), r = vi(t);
  if (M$(lo(r), "fast_mode")) return !0;
  let n = r.toLowerCase();
  return n.includes("opus-4-7") || n.includes("opus-4-8") || n.includes("opus-5");
}

// READABLE (for understanding):
function isFastModeEligibleModel(modelOverride) {
  if (!isFastModeBuildEnabled()) return false;
  let requested = modelOverride ?? getSessionModel(),
    resolvedId = resolveModelId(requested);
  if (modelHasCapability(normalizeModelId(resolvedId), "fast_mode")) return true;   // catalogue path
  let lower = resolvedId.toLowerCase();
  return lower.includes("opus-4-7") || lower.includes("opus-4-8") || lower.includes("opus-5");
}

// Mapping: mv→isFastModeEligibleModel, vl→isFastModeBuildEnabled, Z$→getSessionModel,
//          vi→resolveModelId, M$→modelHasCapability, lo→normalizeModelId
```

So Opus 4.7 passes on the capability branch *and* on the substring fallback. The removal must be
**server-side**, via the org/flag layer read by `xji` (`:109461-109466`:
`fastMode` → `fastModePerSessionOptIn` → `policySettings.fastModePerSessionOptIn` →
`flagSettings.fastMode`). **Write this up as a changelog↔code discrepancy, not as an implemented
removal.** Corroboration: this very session's Claude Code system prompt says fast mode "is available
on Opus 5/4.8/4.7" — i.e. it describes the *code*, not the changelog bullet.

Bonus anchors from the same region: `fastMode` / `fastModePerSessionOptIn` zod fields `:61190`/`:61194`;
the 8-reason unavailability string set `:109390-109433` (subscription, org-disabled, usage-credits,
network, direct-API-only, not-in-Agent-SDK); the cooldown re-enable path `:109500`/`:109509`;
`tengu_fast_mode_toggled` with `source: "model_switch_restore" | "model_switch_downgrade"` `:109484`
— which is the source-proof of `.208`'s "fast mode staying off after switching back to a model that
supports it" fix and `.218`'s "announcement when fast mode changes".

### 6.3 ⚠ `.201`'s Sonnet-5 mid-conversation-system change was REVERTED before `.220`

`.201` was a single-bullet release: "Claude Sonnet 5 sessions no longer use the mid-conversation system
role for harness reminders." In the 2.1.220 bundle that is **no longer true**:

- Sonnet 5's `capabilities` array **contains** `"mid_conv_system"` (`:14207`, inside the
  `claude-sonnet-5` entry that spans `:14177-14214`).
- `supportsMidConversationSystem` (memoised, `:150508-150526`) has an explicit exclusion list —
  `claude-3-*`, opus-4-0/4-1/4-5/4-6/**4-7**, sonnet-4-0/4-5/4-6, haiku-4-5 — and **`claude-sonnet-5`
  is not in it**. Control then reaches `if (M$(r, "mid_conv_system") || r === "claude-mythos-5") return !0;`
  (`:150524`), which returns true for Sonnet 5.

> ⚠ **REFINED by the `40_system_prompt` module pass, re-verified by the orchestrator.** The sentence
> "the `.201` hotfix was reverted" is **half right and must not be quoted alone.** What was reverted is
> the **role-level** exclusion: Sonnet 5 does now reach `mid_conv_system`, exactly as traced below.
> But a **Sonnet-5-only carve-out survives at the presentation level**, via a dedicated predicate
> `mro` — `function mro(e) { return lo(e) === "claude-sonnet-5"; }` at `:150395-150397` — consumed at
> **two** sites, both re-read in the bundle:
> - `:508117` `Jep = Vr((e) => (…, Ser(e) && !mro(e) && !$Fc(lo(e))), …)` — so Sonnet 5 never receives
>   the new framing sentence `lO_` `:508026` (220=1 / 193=0). `$Fc` `:118668` is
>   `Qs(e) === "claude-opus-4-8"`, so **Opus 4.8 is excluded too**.
> - `:531422` `i = r !== void 0 && o && mro(r)` inside `NN` `:531420` — reminders are individually
>   `<system-reminder>`-wrapped before entering the system turn.
>
> **Correct statement: `.201`'s role-level exclusion was reverted and replaced by a presentation-level
> shim. There are THREE framing states (Sonnet 5 / Opus 4.8 / everything else), not two.**
> See [`40_system_prompt/mid_conversation_system_role.md`](40_system_prompt/mid_conversation_system_role.md).

So the `.201` hotfix was superseded somewhere in `.202`…`.220`. Note also the per-model override hook
`Ede(e, "mid_conversation_system")` at the top of the same function (`:150509`) — an escape hatch that
short-circuits the whole list. And `tengu_mid_conv_system_fallback_retry` (`:509912`) shows there is a
retry path when a mid-conversation system block is rejected upstream. This is a *reverted-hotfix*
finding: exactly the class of thing a pure changelog reading gets wrong.

Also resolved while here: the Sonnet 5 promo price is built by `wug()` (`:120046-120050`) —
`pricing: "$2/$10 per Mtok · promo through <date>"`, `promoListPrice: "$3/$15"` — consumed by the
pricing-suffix builder `Goe` (`:120053`), which only applies the promo when
`YO(e) === "claude-sonnet-5"`. That matches `.197`'s bullet exactly and explains `.206`'s
"`/model` picker rows printing a price for a different model than the row named" fix.

## 6.4 WORKED EXAMPLE — how to pin a `.214` security bullet to its *one-line* real delta

The bullet: *"Fixed Bash permission checks misjudging very long commands — commands over 10,000
characters now always prompt instead of running automatically."* A naive read files this as NET_NEW.
It is not. Here is the full derivation, which every permissions agent should imitate.

**Step 1 — find the constant, not the number.** `10000` is 220=36 / 193=34 (useless), and the literal
`10,000 characters` (220=1 `:205495`) is a **decoy**: it is the *Windows sandbox argv* error message
(`jVg`, `:205490-205497`), nothing to do with permissions. In 193 the same literal is about system-prompt
length (`:552762 (193)`). Two different false anchors for one bullet.

**Step 2 — find the real threshold via the analyzer.** `grep -n 'command.length > ' $T` →
`:390644` `if (e.command.length > AIe || Fsn(e.command))`, and `AIe = 1e4` at `:512643`.

**Step 3 — count the constant's call sites in BOTH builds.**

| | 2.1.220 | 2.1.193 |
|---|---|---|
| constant | `AIe = 1e4` `:512643` | `Mbe = 1e4` `:597098 (193)` |
| total occurrences | **10** | **9** |
| tokenizer-divergence predicate | `Fsn` `:512253` — `Wss‖qss‖Vss‖tuo‖ruo‖Yss` (6 regexes) | `Ojt` `:596724 (193)` — `jJr‖GJr‖WJr‖tDn‖nDn‖zJr` (**same 6-regex shape**) |
| guard sites | `:390560 :390644 :392119 :512261 :512280 :512309 :512347 :512463 :512534` | `:304066 :304150 :596732 :596751 :596780 :596817 :596933 :597004` |

**Step 4 — the delta is the set difference: exactly one new guard**, at `:392119`:

```javascript
if (r.length > AIe) return { behavior: "passthrough", message: "Command too long for read-only analysis" };
```

and that message is **220=1 / 193=0** — the only genuinely new string in the whole cluster. Every other
over-length guard, the named constant, and the divergence predicate are **byte-equivalent carryover**.

**Also carryover, despite sounding new:**
- `sed command requires approval …` 220=3 / 193=3; `redirect-borne` 2/2;
  `swallowed arguments, unanalyzable heredoc` 1/1;
  `command is over-length or contains characters bash and the analyzer tokenize differently` 1/1.
- `bashMissKind` taxonomy: 220=22 / **193=23** (it *shrank*). The 13 kinds in 220 are
  `cd-git-compound`(4) `sed-dangerous`(3) `no-rule-match`(2) `multi-cd`(2) `too-complex`
  `shell-operators` `shell-expansion` `semantics` `process-substitution` `flag-validation`
  `cd-multi-positional` `cd-compound-write` `cd-compound-redirect`.
- `zshBraceDiff` (the zsh-brace divergence flag in the shell parser, `:206105`/`:206110`,
  with the parser budget `nodeCount > 50000` and a 50 ms `deadline` at `:206100`/`:206127`):
  **220=20 / 193=20 — pure carryover.** So `.214`'s zsh-subscript bullet is *not* this flag; find the
  actual regex/predicate change instead.

**Lesson:** for the `.214` batch specifically, the mechanisms are mature and the deltas are
single-line. Budget your effort on *locating the one changed line*, and report the carryover
explicitly — that is the finding, and it is more useful than an invented introduction.

## 6.5 RESOLVED: the catalogue is a generated artefact, and fast-mode pricing is NOT client-side

The catalogue carries its **own documentation comment** at `:14009` — a `"//"` key holding:

> `Hand-maintained baked-in model catalog — the source of truth for per-model provider IDs and metadata.`
> `On model launch add one entry to \`models\` below; \`bun run generate:model-catalog\` validates this file`
> `against the schema and formats it.`

`generate:model-catalog` is **220=2 / 193=0**. So the catalogue is a *build-validated data file* with
`schema_version: 1` (`:14012`) and a zod schema at `:14634` (`pricing_tiers: v.record(...)`), resolved by
`:14514` (`let r = yQ().pricing_tiers`). That is strong confirmation that §1's registry rewrite is real
and deliberate, not an artefact of the pretty-printer.

**The complete `pricing_tiers` table (`:14011-14025`)**, in $/Mtok:

| Tier | input | output | cache_write_5m | cache_write_1h | cache_read | web_search | used by |
|------|-------|--------|----------------|----------------|------------|------------|---------|
| `tier_3_15` | 3 | 15 | 3.75 | 6 | 0.30 | 0.01 | Sonnet family |
| `tier_5_25` | 5 | 25 | 6.25 | 10 | 0.50 | 0.01 | Opus 4.7 `:14323`, Opus 4.8, **Opus 5 `:14384`** |
| `tier_15_75` | 15 | 75 | 18.75 | 30 | 1.50 | 0.01 | older Opus |
| `tier_10_50` | 10 | 50 | 12.50 | 20 | 1.00 | 0.01 | **Fable 5 `:14421`, Mythos 5 `:14455`** |
| `haiku_35` | 0.8 | 4 | 1 | 1.6 | 0.08 | 0.01 | Haiku 3.5 |
| `haiku_45` | 1 | 5 | 1.25 | 2 | 0.10 | 0.01 | Haiku 4.5 |

> ❌ **THE PARAGRAPH BELOW IS WRONG AND IS RETRACTED.** Refuted by two module passes and re-verified by
> the orchestrator against the bundle. **The client DOES implement fast-mode pricing** — not as a
> multiplier (hence the failed grep), but as a **substituted price table**:
>
> ```javascript
> function Dji(e, t) {                                   // :109772-109784
>   let r = lo(e);
>   if (t.speed === "fast") {
>     if (r === "claude-opus-4-8" || r === "claude-opus-5") return a7n;      // <-- $10/$50
>     if (r === "claude-opus-4-6" || r === "claude-opus-4-7") return UIc;
>   }
>   ...
> }
> var a7n = { inputTokens: 10, outputTokens: 50, promptCacheWriteTokens: 12.5,
>             promptCacheWrite1hTokens: 20, promptCacheReadTokens: 1, webSearchRequests: 0.01 };  // :109843-109850
> ```
>
> So the `$10/$50` figure is **in the pricing code**, exactly matching the changelog. The retracted
> claim's practical consequence — *"session cost is under-reported by ~2× in fast mode"* — is
> **false**; do not repeat it.
>
> **Why the original reasoning failed:** it grepped for `fast_mode_multiplier` / `fastModeMultiplier`
> (still genuinely 0/0) and concluded no mechanism existed. Absence of the *shape you guessed* is not
> absence of the *mechanism*. The catalogue's `pricing_tiers` table is only one of two pricing paths;
> `Dji` overrides it before the tier lookup is ever reached.

### Retracted paragraph (kept as a record of the reasoning it replaced)

~~**Answer to the `$10/$50` puzzle:** Opus 5's catalogue price is `tier_5_25` = **$5/$25 standard**.
There is **no fast-mode tier and no multiplier anywhere in the pricing code** — `grep` for
`fast_mode_multiplier` / `fastModeMultiplier` returns 0, and no `fastMode` site touches pricing.
The `$10/$50` figure lives only in the **bundled `claude-api` skill text**, at `:797089`:~~

> `- [ ] **[TUNE]** Fast mode (\`speed: "fast"\`, \`fast-mode-2026-02-01\`, $10/$50) is Claude-API-only —`
> `drop it on Bedrock, Google Cloud, and Foundry routes`

So fast mode is a **server-side billing mode** selected by `speed: "fast"` with the beta header
`fast-mode-2026-02-01`, and it coincidentally lands on the same numbers as `tier_10_50`. **Consequence
worth stating explicitly: the client's own cost accounting prices a fast-mode turn at the standard
`tier_5_25` rate, so session cost is under-reported by ~2× in fast mode** unless something outside the
catalogue corrects it. `44_telemetry` should check this against the cost-metering path, and `47_models`
should not claim the client implements the $10/$50 price.

## 6.2b COMPLETE RESOLUTION of `.219` "Removed Opus 4.7 from fast mode" — the bullet is PREMATURE

§6.2 established that Opus 4.7 is still fast-mode eligible in 2.1.220. The full mechanism is now traced,
and it is better than "server-side": **the bundle ships an announcement of a future removal.**

```javascript
// ============================================
// getOpus47FastModeSunsetDate - formats the Opus 4.7 fast-mode sunset date, or null once it has passed
// Location: cli_inner_pretty.js:109491-109498
// ============================================

// ORIGINAL (for source lookup):
function LIc() {
  if (lo(Oi()) !== "claude-opus-4-7") return null;
  let e = Ke("tengu_sunset_penguin_opus47", "2026-07-25"),
    t = Date.parse(e);
  if (Number.isNaN(t) || Date.now() >= t) return null;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

// READABLE (for understanding):
function getOpus47FastModeSunsetDate() {
  if (normalizeModelId(getCurrentModel()) !== "claude-opus-4-7") return null;   // only this one model
  let dateStr = getFeatureValue("tengu_sunset_penguin_opus47", "2026-07-25"),   // remotely tunable date
    sunsetMs = Date.parse(dateStr);
  if (Number.isNaN(sunsetMs) || Date.now() >= sunsetMs) return null;            // silent once passed
  return new Date(sunsetMs).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

// Mapping: LIc→getOpus47FastModeSunsetDate, lo→normalizeModelId, Oi→getCurrentModel, Ke→getFeatureValue
```

Its single caller `:499782-499791` builds a warning banner:

```javascript
function ZFo() {                                  // buildOpus47FastModeDeprecationNotice
  let e = LIc();
  if (!e) return null;
  return {
    key: "opus47-fast-mode-deprecation",
    text: `Opus 4.7 fast mode is deprecated and will be removed on ${e}`,
    priority: "immediate",
    color: "warning",
  };
}
```

**So the 2.1.220 client state is: Opus 4.7 fast mode still WORKS, and the UI warns that it will be
removed.** The `.219` bullet claims the removal already happened. It had not, client-side.

**The timing is the punchline.** The gate default is `"2026-07-25"` and this build's `build_time` is
`2026-07-24T22:17:45Z` — the bundle shipped **1 hour 42 minutes 15 seconds before its own announced
sunset**.

> ⚠ **CORRECTED (by the `by_version/2.1.219` pass, re-verified by the orchestrator).** This section
> previously said "~26 hours". That was wrong: `Date.parse("2026-07-25")` parses a **date-only** string
> as **UTC midnight**, i.e. `2026-07-25T00:00:00Z`, so the interval from `2026-07-24T22:17:45Z` is
> `1:42:15`, not ~26 h. **The conclusion is unchanged and in fact strengthened** — the notice's live
> window was under two hours. Because the
function returns `null` once `Date.now() >= t`, **2.1.220 is the last build that can ever display this
notice**; from 2026-07-25 onward it silently disappears without a code change. A reader running this
build today sees nothing, which is exactly why you must reason from the constant, not from behaviour.

**A second, structural finding in the same place: the model-sunset mechanism was de-generalized.**

| | 2.1.193 | 2.1.220 |
|---|---|---|
| Shape | a **data table** `QYu` at `:102522-102525 (193)` | a **hardcoded single-model function** `LIc` `:109491` |
| Rows | `{canonical:"claude-opus-4-6", label:"Opus 4.6", flag:"tengu_sunset_penguin_opus46", defaultDate:"2026-06-29"}` and the same shape for Opus 4.7 / `…opus47` / `"2026-07-25"` | none — the model id, gate name and date are inlined |
| Lookup | generic `QYu.find((s) => s.canonical === e)` at `:102328 (193)` | `if (lo(Oi()) !== "claude-opus-4-7") return null` |
| Scope | any number of models | exactly one |

The Opus 4.6 row was dropped once its 2026-06-29 date passed, and the table collapsed to a special case.
Note `tengu_sunset_penguin_opus47` is **220=1 / 193=1** — the gate NAME is carryover, so a count-only
check calls this "no change" while the surrounding structure was rewritten. That is the strongest
argument in this whole tree for reading code rather than counting literals.

## 6.7 ~~CAUTION: a 2:1 literal count in the MCP client may be a duplication artefact~~ — **SUPERSEDED**

> **CORRECTED by the `39_mcp` module pass, re-verified by the orchestrator.** The doubling is **not** a
> bundling artefact. 2.1.220 deliberately ships **two complete MCP runtime trees**: `v1` (default) and
> `v2` (opt-in), selected at runtime. Evidence, all `220>0 / 193=0`:
> `MCP_SDK_GENERATION` env var **220=3 / 193=0** (accessor `:31998`, read `:262849`, with validation
> `MCP_SDK_GENERATION=${e} is invalid; expected 'v1' or 'v2' — ignoring` at `:262852`);
> gate `tengu_brindle_causeway` **220=1 / 193=0**; and an `MCP_TREE_ID` tripwire **220=6 / 193=0**
> exported from **two separate module tables** (`:292852` → `xAy`, `:298394` → `aTy`) and branched on at
> `:302431` (`if (r.MCP_TREE_ID !== "v2")`).
>
> **Consequence: the default MCP code path is the HIGHER line range.** Reading only the first hit of an
> MCP literal means reading the non-default tree. This is the single largest MCP change in the window and
> it has **no changelog bullet at all**. See [`39_mcp/dual_mcp_runtime_trees.md`](39_mcp/dual_mcp_runtime_trees.md).
>
> The original (wrong) note is kept below as a record of the reasoning it replaced.

### Original note (superseded)

The foundation pass reported that "the 2.1.220 bundle contains TWO near-identical copies of the MCP client
module", because `tengu_mcp_oauth_refresh_failure` is **220=2 (`:288008`, `:298055`) / 193=1**.
I re-checked and the warning is **directionally right but overstated**: the transport literal
`StreamableHTTPClientTransport already started!` is **220=1 (`:264977`) / 193=1**, so the *whole* client
is not duplicated — some inner module (the OAuth-refresh path around `:288008` / `:298055`) is emitted
twice. **Practical rule: for any MCP-client literal, if the 220 count is exactly 2× the 193 count, read
BOTH 220 sites before claiming a delta — they may be clones.** Do not generalise the duplication to the
entire MCP surface.

## 6.6 ~~Bonus: the compaction dispatcher gained a failure breaker~~ — **WRONG, RETRACTED**

> ❌ **This section was a FALSE DELTA. Retracted by the `07_compact` module pass and re-verified by the
> orchestrator against both bundles.** The compaction circuit breaker is **pure carryover**:
>
> | Anchor | 220 | 193 |
> |---|---|---|
> | `failure_breaker_open` | 1 (`:441117`) | **1** (`:470252`) |
> | threshold constant | `GMd = 3` (`:441233`) | **`ISl = 3`** (`:470357 (193)`) |
> | gate `tengu_auto_compact_circuit_breaker` | 1 | **1** |
>
> `193:470252` reads
> `if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= ISl) return { kind: "failure_breaker_open" };`
> — byte-identical to `220:441117` apart from the re-mangled constant name. The incrementer `jMd`
> (`:441054-441067`) ≡ `CSl` (`:470189-470202 (193)`), and the reset lives in `Gds` `:237113` ≡ `:235135 (193)`.
>
> **What produced the error:** `consecutiveFailures` counts **220=11 / 193=6**, which looks like a delta.
> The 5 extra 220 sites (`:420177-420192`) are an unrelated **artifact live-watch backoff** (`MHd`).
> This is trap #1 of `_CONVENTIONS.md` §4 — a count difference in a *generic* field name, attributed to
> the wrong subsystem — and it is the reason the "read the decl in BOTH bundles" rule exists.
>
> Correct statement: the `{kind}` union including `failure_breaker_open` **survives unchanged** from 193.
> See [`07_compact/dispatcher_and_failure_breakers.md`](07_compact/dispatcher_and_failure_breakers.md).
>
> The original (wrong) note is kept below as a record of the reasoning it replaced.

### Original note (retracted)

The 2.1.193 tree documented the auto-compact dispatcher's discriminated `{kind}` union. It **survives**
in 2.1.220 at `:441115` (`FHs`), and it gained a member the 193 union did not have:

```javascript
if (Z.DISABLE_COMPACT) return { kind: "not_needed" };                                       // :441116
if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= GMd) return { kind: "failure_breaker_open" };  // :441117
```

`failure_breaker_open` + the `GMd` consecutive-failure threshold is a **circuit breaker on compaction
itself** — after N failed compactions it stops trying. `07_compact` owns this: find `GMd`'s value, find
who resets `consecutiveFailures`, and check whether it maps to any changelog bullet (it may be
completely undocumented, like the catalogue rewrite).

## 7. Still-open questions for module agents (answer these in your doc)

1. Which of the 7 `filesystem.disabled` sites and 4 `strictAllowlist` sites are the new ones? (§3)
2. What is `claude-mythos-5` (`:14439`) — all-null providers, empty `capabilities`, yet
   special-cased by *name* in `supportsMidConversationSystem` (`:150524`)? An unannounced family.
4. ~~`alias_migration: {}` (`:14495`) is empty — what consumes it?~~ **ANSWERED** by the
   `by_version/2.1.219` pass, re-verified: **the machinery shipped disarmed.** The migration runner
   `rTm` (`:833732-833744`) executes on every first-party startup, but its table `qlE` is `{}`
   (`:833753`) and the catalogue's own `alias_migration: {}` (`:14495`) is schema-validated and **read
   by nothing**. So the feature is fully plumbed and inert — a *pre-installed* migration hook awaiting
   a future server-side or catalogue-side population. Same category as the dead remote reply-channel
   gates (§ `54_remote_control`) and the `tengu_dead_probe_*` census: **shipped ≠ reachable**, and this
   tree should keep saying so explicitly.
5. `best: "fable"` (`:14488`) — what consumes `best`, and does it explain `.210`'s "Fable temporarily
   shows as unavailable in the advisor picker"? (`advisor_rank` is 4 for Opus 5, 5 for Fable/Mythos.)
6. `anthropic_google_cloud` appears as a provider channel in every catalogue entry and as
   `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` in the new-env list — but **no changelog bullet mentions
   it**. Another under-reported addition; trace its plumbing.

---

## 8. ROUND-2 ADDITION: the workflow runtime carried five undocumented changes

Added after the round-2 full-chain re-analysis of the Workflow script runtime
([`42_workflow/`](42_workflow/README.md) §6). Recorded here because it is the same class of finding
as §1 — *"the changelog under-reports the change"* — and because §7's open-question list should not
be the only place a later reader looks for unexplained anchors.

`42_workflow/README.md` §5 originally deferred the runtime layer on the grounds that "`grep`-level
spot checks showed no changelog bullet in this window claiming a change there". Both halves were
true and the conclusion was wrong. Verified `grep -cF` counts, 220 vs 193:

| Finding | Proof | Owning doc |
|---|---|---|
| **A whole server-authored workflow launch channel** — a `workflow_launch` SSE event carries a sha256-pinned binary bundle, the client verifies and executes it, and answers on a single `remote-workflow:` line. Plus an env-delivered variant. | `"workflow_launch"` **8/0** · `serverAuthoredCarrier` **5/0** · `artifact_sha256` **4/0** · `workflow-launch-exec` **4/0** · `CLAUDE_REMOTE_WORKFLOW_SCRIPT` **4/0** | [`42_workflow/workflow_server_authored_launch.md`](42_workflow/workflow_server_authored_launch.md) |
| Auto-mode **hand-off safety classifier** now reviews every workflow subagent's transcript | in-executor `agentMessages` **7/0**; `isBackgroundAgent: !0` **8/0** | [`42_workflow/workflow_runtime_core.md`](42_workflow/workflow_runtime_core.md) §7.4 |
| **`scriptSha256` content pin** on the adopt path | `scriptSha256` **7/0** | [`42_workflow/workflow_lifecycle.md`](42_workflow/workflow_lifecycle.md) §5 |
| **`CLAUDE_WORKFLOW_NAME_ONLY`** lockdown mode | **5/0** | [`42_workflow/workflow_lifecycle.md`](42_workflow/workflow_lifecycle.md) §1.2 |
| Telemetry privacy hardening + two new audit channels | `scriptIsVerbatimBuiltIn` **5/0** · `subagent_model_resolve` **7/0** · `workflow_compile`/`workflow_resolve` **2/0** | [`42_workflow/workflow_lifecycle.md`](42_workflow/workflow_lifecycle.md) §1.3, [`workflow_model_resolution.md`](42_workflow/workflow_model_resolution.md) §2.2 |

This also **closes §7-style open question** recorded in `42_workflow/README.md`:
`tengu_workflow_launch_event` (`:502483`, `:502581`) is **not** part of the Workflow tool's launch
path — it belongs to the carrier channel above.

Two policy facts from that channel that belong in ground truth:

- **`allow_workflows` has a carve-out.** `$pn` (`:502205-502210`): a server-authored carrier launch in
  a session with `CLAUDE_CODE_REMOTE_SESSION_ORIGIN === "review"` skips the `allow_workflows` org-policy
  check. Only `disableWorkflows` (managed settings / `CLAUDE_CODE_DISABLE_WORKFLOWS`) is absolute.
- **`workflow_launch` has exactly one legitimate ingress.** It is dropped on the stdin lane
  (`cli_stdin_workflow_launch_dropped`, `:840710`) and vetoed on SSE when the envelope's `event_type`
  disagrees with the payload (`:416596`).

### Method note — add these two probes to the standard passes

A **string-literal diff of a function body measures its prose surface, not its behaviour.** The
workflow executor's literal set changed by five entries between the bundles, which reads as
"unchanged"; the same body gained two parameters, a new field on its derived context, and a whole
security-review step. The probes that found them:

```bash
# 1. parameter arity — a renamed function with more params is a changed contract
grep -nE '^function [A-Za-z0-9_$]+\(e, t, r, n, o, i, s, a, l, c, u\) \{' $T

# 2. range-scoped counts — grep -cF INSIDE the function's line range, not the whole bundle
awk 'NR>=387149 && NR<=388105' $T | grep -cF 'agentMessages'   # 7
awk 'NR>=423445 && NR<=424279' $B | grep -cF 'agentMessages'   # 0
```

Whole-bundle counts hid finding #2 completely: `agentMessages` is `220=11 / 193=4`, which reads as a
modest increase somewhere. Scoped to the executor it is **7/0**.
