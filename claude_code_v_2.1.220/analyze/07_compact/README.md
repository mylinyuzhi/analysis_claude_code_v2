# 07 — Compaction and context accounting deltas (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

## Documents

| File | Covers |
|---|---|
| [`dispatcher_and_failure_breakers.md`](dispatcher_and_failure_breakers.md) | the `FHs` dispatcher and its `{kind}` union; both circuit breakers; the `.217` Opus-4.8 conditional deletion; the `.198` extended-thinking inheritance |
| [`context_accounting_and_context_command.md`](context_accounting_and_context_command.md) | the three window-resolution layers; the `/context` breakdown and grid; token counting and the `.196` Bedrock fix; `.208`, `.218` fork lineage; two decoys |

---

## The three headline findings

### 1. The assigned headline is a false delta — `failure_breaker_open` is CARRYOVER

[`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.6 records that the
compaction dispatcher "gained a member the 193 union did not have", `failure_breaker_open`, and asks
this module to treat it as the undocumented headline. **It is not new.**

```
failure_breaker_open              220=1 (:441117)   193=1 (:470252)
tengu_auto_compact_circuit_breaker 220=1            193=1
GMd = 3  (:441233)          ==     ISl = 3  (:470357 (193))
jMd      (:441054-441067)   ==     CSl      (:470189-470202 (193))
```

The guard line, the threshold value, the incrementer, the reset (`consecutiveFailures: 0` in `Gds`
`:237113` / `:235135 (193)`), the telemetry gate and the log string are all present in 2.1.193. `GMd` is
`ISl` re-mangled — `_CONVENTIONS.md` §4.1's trap in its purest form.

**What misled the check:** `consecutiveFailures` greps 220=11 / 193=6. The five extra 2.1.220 sites
(`:420177`, `:420185-420187`, `:420192`) are the **artifact live-watch reconnect backoff** `MHd`
(`:420181`), an unrelated subsystem that happens to use the same field name. Filtered to the compaction
call graph, the count is 6 in both builds.

**§6.6 of `_GROUND_TRUTH` should be amended.** The mechanism is still worth the deep write-up it gets in
[`dispatcher_and_failure_breakers.md`](dispatcher_and_failure_breakers.md) §1 — it is genuinely
undocumented in *both* builds, and the most interesting fact about it is that **the user is told nothing
when it opens**, unlike its sibling rapid-refill breaker which has a full explanatory message
(`Wds` `:237116`). But it must not be presented as a 2.1.220 introduction.

### 2. The real `.217` fix is a deletion, in three places at once

2.1.193 carried a model-pinned experiment predicate `P7` (`:234849 (193)`) whose second line was
`if (e !== PZr) return !1;` with `PZr = "claude-opus-4-8"` (`:234872 (193)`). It appeared as a **negated
conjunct** in the auto-compact trigger (`:470242 (193)`), the blocking-limit check (`:235100 (193)`) and
the `/context` buffer decision (`:470718 (193)`). On Bedrock the session model id does not reduce to the
bare `claude-opus-4-8`, so `!P7(...)` was true and all three predicates took the "do nothing" branch —
auto-compact never fired, and the client never noticed the hard limit had passed.

2.1.220 deletes the conjunct from all three (`:441107`, `:237072`, `:441639`) and rewrites the
supporting predicate from a four-name enumeration to its complement:

```javascript
// 193 :235035   return n === "env" || n === "settings" || n === "clientdata" || n === "model-default";
// 220 :237009   return o7(e, t).source !== "auto";
```

which also closes a hole 193 had (the enumeration omitted `source: "experiment"`). Corroborating
counts: `model-default` **220=2 / 193=4**, `clientdata` **220=6 / 193=8** — literals went *down*
because an enumeration became a complement.

### 3. The `.198` thinking bullet is one deleted allow-table, proved by a single literal

```
cedar_lagoon    220=0   193=1   (:382222 (193), inside oVn :382221-382226 (193))
```

`oVn(model)` read a remote clientdata table `cedar_lagoon` and, for unlisted models, replaced the
session's `thinkingConfig` with `{ type: "disabled" }` in **both** places the bullet names:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| compaction summarizer | `thinkingConfig: oVn(S) ? r.options.thinkingConfig : { type: "disabled" }` `:469909 (193)` | `thinkingConfig: SXr(n)` `:440739` |
| subagent spawn | `thinkingConfig: b \|\| !1 \|\| oVn(q) ? n.options.thinkingConfig : { type: "disabled" }` `:398740 (193)` | `thinkingConfig: yBc(r.options.thinkingConfig, {…})` `:344538` |

Both anchors sit next to a stable landmark that is byte-identical across builds — the summarizer's
system prompt `"You are a helpful AI assistant tasked with summarizing conversations."`
(220 `:440738` / 193 `:469908`) — so the comparison is exact. **The scoping pass's instruction was right:
the `thinkingConfig:` literal count (220=50 / 193=46) is noise and the call site is the whole delta.**
220 never disables thinking; `yBc` (`:119662`) only normalises `display` to `"omitted"`, and only when
six escape hatches all fail.

---

## Per-bullet ledger

Every changelog bullet whose primary or secondary theme is `compact`, with its verdict. Bullets marked
*(shared)* are owned by another module; the row records only the compaction-side finding.

| # | Bullet (abridged) | Ver | Verdict | Anchor (2.1.220) | 220/193 | Section |
|---|---|---|---|---|---|---|
| 1 | `/context` showing 0 tokens for all tool groups on Bedrock | `.196` | **NET_NEW** — scope said UNANCHORED | `QMd` `:442351`, applied `:442365`/`:442392` | destructure 1/0 | [ctx §4](context_accounting_and_context_command.md) |
| 2 | Subagents and compaction inherit the session's extended-thinking config | `.198` | **NET_NEW (deletion)** | `:440739` (`SXr` `:237866`); `:344538` (`yBc` `:119662`) | `cedar_lagoon` 0/1 | [disp §4](dispatcher_and_failure_breakers.md) |
| 3 | `/branch` fork name from the compaction summary *(shared: `43_slash_commands`)* | `.198` | **UNANCHORED** | — `compaction summary` is skill/settings text | 3/3 | [ctx §6.2](context_accounting_and_context_command.md) |
| 4 | Context-usage indicator re-analyzing the whole transcript *(shared: `50_performance`)* | `.203` | **PARTIAL** — the side-effect half is anchored | `analysisOnly` `:441593`; `Gst` `:161289` | 9/0 | [ctx §3.4](context_accounting_and_context_command.md) |
| 5 | Context window briefly resetting to 200k after an auto-update | `.208` | **DELTA (mechanism only)** | `H9t` `:3066`; `gZc` `:150268` | `autoCompactWindowsCache` 5/4 | [ctx §1](context_accounting_and_context_command.md) |
| 6 | Memory when resuming sessions with bg agents or forks *(shared: `36_background_agents`)* | `.208` | **NET_NEW (gates only)** | `tengu_precomputed_compact_rehydrated` `:328512` + 2 siblings | 1/0 each | [disp §5.4](dispatcher_and_failure_breakers.md) |
| 7 | Many-image conversations failing "Request too large" *(shared: `57_api_reliability`)* | `.212` | **NET_NEW** | `Qcs` `:228176-228180` (`Bls = 33554432` `:222501`) | 2/0 | this file |
| 8 | `/context` warns when the conversation exceeds the window; failed `/compact` shows as error | `.215` | **UNANCHORED** — scope anchor is wrong | — `:523812` is the transcript-**file** GC | literal 0/0 | [ctx §6.1](context_accounting_and_context_command.md) |
| 9 | Auto-compact never triggering for Opus 4.8 on Bedrock; `/compact` failing over the limit | `.217` | **NET_NEW (deletion ×3)** | `:441107`, `:237072`, `:441639`; `$ny` `:237103` | `P7`/`PZr` gone | [disp §3](dispatcher_and_failure_breakers.md) |
| 10 | `/context` reporting stale pre-compact usage after compacting from the picker | `.218` | **UNANCHORED** — `originalMessages` is a refactor artefact | — slicer `FE` `:533381` is carryover | 3/0 artefact | [ctx §3.3](context_accounting_and_context_command.md) |
| 11 | Fork-session lineage lost after compaction in headless/SDK *(shared: `51_headless_sdk`)* | `.218` | **NET_NEW** — scope anchor is wrong | `:841759`, `:842259`; schema `:837055` | 5/3 | [ctx §5](context_accounting_and_context_command.md) |
| 12 | Resumed session failing every turn on a malformed delta attachment | `.218` | **NET_NEW** | `tengu_resume_unchained_transcript` `:525013`; message `:525011` | 1/0 | this file |
| 13 | Retry loop re-sending doomed requests after context overflow *(shared: `57_api_reliability`)* | `.218` | **DELTA (not compaction-side)** | `tengu_defer_cap_refused_restartable` `:823533`; `zW` `:228935` carryover | 1/0; 1/1 | this file |
| 14 | `--resume`/`--continue` TypeError on a malformed attachment *(shared: `43_slash_commands`)* | `.218` | **not covered** — slash-command side | — | — | — |

**Score: 14 bullets — 6 NET_NEW, 2 DELTA, 3 UNANCHORED, 1 PARTIAL, 1 shared-only, 1 not covered.**
Two of the three UNANCHORED verdicts *overturn* an anchor the scoping pass had recorded.

### Rows 7, 12, 13 (not large enough for their own section)

**Row 7 — `.212` many-image "Request too large".** `Qcs()` (`:228176-228180`) is 220=2 / 193=0. It
builds a size-aware message keyed off `Bls = 33554432` (32 MiB, `:222501`) with an
interactive/non-interactive split, and it is the only error string in the bundle that names compaction
as the remedy: *"Run /compact, or double press esc to go back and remove attachments."* 2.1.193 had only
the generic per-image `fpo()` message. The compaction-relevant point is that **image/attachment bytes
are not visible in any token category** — `/context`'s Messages bucket is derived from token usage, and
a 32 MiB attachment payload can blow the *request size* limit long before the *token* limit, so the
compaction machinery never sees it coming. That is why this needed a bespoke message rather than a
threshold.

**Row 12 — `.218` resumed session failing every turn.** `tengu_resume_unchained_transcript` is
**220=1 / 193=0** at `:525013`, and the diagnostic at `:525011` states the invariant compaction depends
on:

> `Resume transcript … has ${n} user/assistant records but none carry parentUuid links; only ${i}
> reached the resumed conversation. Conversation reconstruction walks parentUuid from the last record,
> so unlinked records are dropped — the file's producer must chain records (parentUuid null on the
> first, the previous record's uuid on each subsequent one).`

This is the same `parentUuid` chain that `logical_parent_uuid` (row 11) bridges across a compaction
boundary — the two `.218` bullets are two ends of one invariant. The dedupe set `osp` (`:525007-525008`)
keyed on a session-uuid regex (`:525005`) means the warning fires once per session, and it escalates to
`process.stderr` only under `NOe() || Z.CLAUDE_CODE_ENTRYPOINT === "bench"` (`:525015`).

**Row 13 — `.218` retry loop after context overflow.** The compaction-side literal is carryover:
`Prompt is too long` is `zW = "Prompt is too long"` (`:228935`), 220=1 / 193=1, with a byte-identical
193 twin `dF` (`:237968 (193)`), and its 13 use sites map one-for-one. The genuinely new anchor
(`tengu_defer_cap_refused_restartable`, 220=1 / 193=0, `:823533`) is in the Ctrl+B background-defer cap,
which is [`../57_api_reliability/`](../57_api_reliability/)'s. **No compaction-side delta.**

---

## What survived unchanged (state this before claiming anything here)

| Mechanism | 2.1.220 | Status |
|---|---|---|
| `{kind}` discriminated union (7 arms) | `FHs` `:441115` | **identical** to the 2.1.193 tree's documentation |
| failure circuit breaker + `GMd = 3` | `:441117`, `:441233` | carryover |
| rapid-refill breaker + `cOu = 3` + thrash message | `:441137`, `:237115`, `:237116` | carryover |
| `CLAUDE_CODE_COLD_COMPACT` / `stripNonEssential` semantics | `Yn_` `:441100` | carryover (2/2) |
| prefix-overflow warning + `tengu_auto_compact_prefix_overflow` | `:441123-441127` | carryover (1/1) |
| reactive-path routing + `tengu_auto_compact_routed_reactive` | `:441142-441143` | carryover (1/1) |
| compact-boundary message slicer for `/context` | `FE` `:533381` | carryover (193 `yy` `:601955`) |
| last-API-usage extractor | `khr` `:442517` | carryover (193 `hat` `:235307`) |
| `/context` 1M grid branch (20×10 vs 10×10) | `:441673-441677` | carryover (193 `:470739`) |
| Bedrock `CountTokens` branch + `countTokensWithFallback` | `:442371`, `Hhr` `:441299` | carryover (4/4) |
| `Prompt is too long` diagnostic family | `zW` `:228935` | carryover (1/1) |

---

## Cross-module boundaries

- [`../50_performance/`](../50_performance/) owns the general `.203` per-turn machinery. This module owns
  only the `analysisOnly` side-effect suppression on the `/context` path, and the observation that the
  **transcript-file** compactor (`tengu_transcript_compact`, `:523965`) is a disk mechanism that belongs
  there, not here.
- [`../51_headless_sdk/`](../51_headless_sdk/) owns headless/SDK transport. This module owns the
  compaction side of the fork-lineage bullet: the `logical_parent_uuid` backpointer and its two new
  emitters.
- [`../47_models/`](../47_models/) owns the model catalogue. This module owns the
  `MODEL_AUTO_COMPACT_WINDOWS` table (`nOu` `:237096`) and the `$ny` model-default set — note for that
  module that `gZc` (`:150268`) consults the persisted window cache **only under first-party auth**.
- [`../57_api_reliability/`](../57_api_reliability/) owns the retry loop and the defer cap.
- [`../43_slash_commands/`](../43_slash_commands/) owns `/branch` fork-name derivation and the
  `--resume` attachment TypeError.

---

## Not covered, and why

1. **The precompute-then-swap state machine** (`:328400-328900`). Ten `tengu_precomputed_compact_*`
   gates, an arm/gate/start/ready/consume/discard lifecycle, and a rehydration validator. Three of its
   gates are net-new and are anchored in
   [`dispatcher_and_failure_breakers.md`](dispatcher_and_failure_breakers.md) §5.4, but the machine
   deserves its own document and no changelog bullet in this window describes it. **Highest-value
   follow-up in this theme.**
2. **`compactConversation` (`Pko` `:440219`) end to end** — the message-selection, `preserved_segment`
   and `messagesToKeep` logic. Sampled only where the `.198` thinking change lands. `messagesToKeep`
   is 9/9 and `anchor_uuid` 9/9, so the core is carryover; `preserved_segment` is 220=8 / 193=4 and was
   not chased.
3. **The reactive-compaction path** (`nwo` `:329022`, called at `:441164`; recovery timeout `Eio` `:441154`). Structurally
   identical to 193's `jKn`; not diffed statement by statement.
4. **`count_tokens` 220=32 / 193=22.** I isolated the `.196` fix inside that delta but did not diff the
   remaining ~10 sites.
5. **The `.208` fix line.** Mechanism identified (§1 of the context doc), exact changed statement not
   isolated; the suggested next step is recorded there.

---

## Method note for cross-validation

Two of the three overturned anchors in this module were caught by the same move: **read the site, do not
trust the literal**. `:523812` (`tengu_transcript_compact_failed`) and `:846491` (`lineage`) are both
genuinely net-new strings that sit in genuinely unrelated code. A count-only workflow scores both as
confirmed. The third, `originalMessages` 3/0, is the inverse failure: a *real* net-new literal that is
purely an argument-shape artefact of a positional→named refactor, with byte-identical behaviour on both
sides.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All symbols discovered by this module are staged in
> [symbol_additions_v2_1_220_compact.md](../00_overview/symbol_additions_v2_1_220_compact.md).

Key functions referenced in this README:
- `autoCompactDispatcher` (`FHs`, `:441115`) - the `{kind}` union; unchanged in shape since 2.1.193
- `recordCompactionFailure` (`jMd`, `:441054`) - failure breaker incrementer (carryover)
- `COMPACT_FAILURE_BREAKER_THRESHOLD` (`GMd`, `:441233`) - `3`; 193's `ISl`
- `hasExplicitAutoCompactWindow` (`zVe`, `:237008`) - `source !== "auto"`; replaced 193's `p0e` enum
- `resolveEffectiveThinkingConfig` (`SXr`, `:237866`) - compaction-side thinking inheritance
- `resolveSubagentThinkingDisplay` (`yBc`, `:119662`) - subagent-side inheritance
- `stripNonCountableToolFields` (`QMd`, `:442351`) - the `.196` Bedrock `/context` fix
- `buildRequestTooLargeAttachmentMessage` (`Qcs`, `:228176`) - the `.211` many-image message
- `MAX_REQUEST_BYTES` (`Bls`, `:222501`) - `33554432`
- `warnUnchainedResumeTranscript` (`sUo`, `:524997-525018`) - the `.218` `parentUuid`-chain diagnostic
- `MODEL_AUTO_COMPACT_WINDOWS` (`nOu`, `:237096`) - Sonnet 5 967000 / 500000-by-surface
- `getAutoCompactWindowsCache` (`gZc`, `:150268`) - first-party-only persisted window cache
- `rewatchArtifactWithBackoff` (`MHd`, `:420181`) - the `consecutiveFailures` decoy
