# 44_telemetry — Telemetry and OpenTelemetry (2.1.193 → 2.1.220)

Deobfuscation analysis of the telemetry surface across the 25-release window
`2.1.195 … 2.1.220`.

- **TARGET:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
  (872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`)
- **BASELINE:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
  (718,679 lines) — every citation from it is tagged `(193)`
- **Cross-validation:** the v2.1.88 named TypeScript tree at `3rd/claude-code/src/` — used only to
  recover identifier names and original design intent, never current behaviour

---

## The window's story for this theme

**Nothing new was measured, and almost everything became joinable.**

The count of distinct OTel log events did not change: `grep -c 'Ac("'` is 220=**39**,
`grep -c 'Jc("'` is 193=**39**. What changed is correlation. The single emission point
(`emitOtelLogEvent`, `:167354`) gained a third parameter and two lines, and `grep -c 'agentContext,$'`
went from 193=**18** to 220=**29**. Every one of the five attribute/correlation bullets in this window
is a consequence of that one function's new shape:

- a `context` field on the log record, resolved through a new three-tier resolver, so records emitted
  outside the turn's async stack stop losing `trace_id`/`span_id` (`.212`, `.214`);
- `workflow.run_id` / `workflow.name`, scoped deliberately to subagent contexts only (`.202`);
- `message.uuid`, so an OTel record and a `.jsonl` transcript entry share a join key (`.214`);
- `client_request_id` on the two highest-volume API events, suppressed on non-streaming fallback so
  the join is never false (`.214`);
- `tool_source`, a three-way provenance enum that a pre-existing boolean `is_mcp` could not express
  (`.214`).

The second thread is **configurability of things that used to be constants**. `61440` was never an
OTel limit — the named tree records it as *"60KB (Honeycomb limit is 64KB, staying safe)"*, one
vendor's ceiling baked into every install. `.214` made it an env var, folded it into a `Math.min` with
the three standard OTel length limits, and — the part the bullet does not say — made the limit a *hard*
cap. The 2.1.193 truncator always overshot its own limit by the 42-byte marker it appended. The same
change also deleted a second, duplicated 61440 truncator, so `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH`
silently governs `OTEL_LOG_RAW_API_BODIES=inline` too.

The third thread is **export-path plumbing**, and it is the most surgical work in the window. A
monkey-patch on `Agent.addRequest` buffers OTLP bodies so `Content-Length` can be set, fixing Azure
Monitor's 411s across all nine HTTP exporter variants with one function (`.212`). A single options
parameter and a three-line closure suppress metric units — **but only when every configured metrics
exporter is Prometheus**, so the OTLP payload is never degraded to fix a Prometheus-only problem
(`.216`). That `every`-not-`includes` predicate is the sharpest single design decision in this theme.

The fourth thread is **cost**, and it is where the changelog and the code diverge most. Two cost
bullets land inside a **Cloud gateway server that does not exist in 2.1.193 at all** (`all upstreams
failed` 2/0, `store.postgres_url` 3/0), so they have no before-picture. And the pricing path contains
a correction to this tree's own ground truth: **fast-mode pricing is implemented client-side**, as a
`speed === "fast"` rate-table override at `:109774-109777` with a `{10, 50, …}` table at `:109843`.
Ground truth §6.5 concluded the opposite from two grep terms that could not match a table-swap, and
drew the wrong consequence (that fast-mode session cost is under-reported ~2×). It is not. See
[`cost_and_usage_metering.md`](cost_and_usage_metering.md) §3.

The fifth thread is the **control plane**: GrowthBook. A three-line null-coalescer, a
stage-then-commit rewrite of payload processing, and an OAuth-rotation detector. This is where the
scoping anchors were worst — all four proposed literals for the GrowthBook bullet turned out to belong
to unrelated subsystems, and `tengu_otel_*` does not exist in either bundle.

**Method note, because it recurs.** Four of this theme's bullets are unanchorable by literal counting
and provable by other means: `/clear`-resets-cost by **counting call sites of an exported symbol**
(2 → 3, with the new one identified by eliminating the two that pair off); Prometheus `# UNIT` by
reading the **vendored serializer** and finding it byte-identical, then looking upstream at the
instrument declarations; permission-denial misreporting by noticing that `decisionClassification` is
5/5 and the change is *which branch the data flows down*; the GrowthBook cache wipe by noticing that
the clears **moved** relative to the validation. In every case a string-based diff reports "no change".

---

## Documents

| File | Covers |
|---|---|
| [`otel_attributes_and_correlation.md`](otel_attributes_and_correlation.md) | The `emitOtelLogEvent` rewrite; `workflow.run_id`/`workflow.name` (`.202`); three-tier trace-context resolution (`.212`, `.214`); `message.uuid` / `client_request_id` / `tool_source` (`.214`); permission-denial misreporting (`.216`) |
| [`content_truncation_and_exporters.md`](content_truncation_and_exporters.md) | `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` and the hard-cap truncator (`.214`); the `addRequest` Content-Length patch (`.212`); Prometheus `omitUnits` (`.216`); the gateway's managed telemetry env (`.217`) |
| [`cost_and_usage_metering.md`](cost_and_usage_metering.md) | `message_delta` double-counting (`.214`); gateway ARN pricing (`.218`); `/clear` cost reset (`.211`); **the fast-mode pricing ground-truth correction**; two honestly-unanchored bullets with their decoys |
| [`feature_flags_and_gate_resolution.md`](feature_flags_and_gate_resolution.md) | The GrowthBook null crash and cache wipe (`.214`); flags stale after OAuth rotation (`.214`); the five decoy anchors and the eleven falsely-"new" `OTEL_*` env vars |

Symbol tables are staged (not merged) in
[`../00_overview/symbol_additions_v2_1_220_telemetry.md`](../00_overview/symbol_additions_v2_1_220_telemetry.md).

---

## Per-bullet ledger

Every changelog bullet in the window whose primary or secondary theme is telemetry. Verdicts:
**NET_NEW** = new code, anchored; **DELTA** = the bullet's literal is carryover but a narrower real
change is anchored; **PARTIAL** = the bullet over-claims and the true scope is smaller;
**UNANCHORED** = no anchor found, decoys documented; **CROSS-THEME** = owned by another module.

| # | Version | Bullet (abridged) | Verdict | Anchor read in 2.1.220 | Doc section |
|---|---|---|---|---|---|
| 1 | `.196` | Rate-limit warning flickering off; rate-limit telemetry over-counted with parallel requests | **UNANCHORED** | `tengu_rate_limit_promo_notices` `:227175` is a **promo-content gate**, not a counter (read `:227145-227199`) | [cost §5.1](cost_and_usage_metering.md) |
| 2 | `.202` | Added `workflow.run_id` and `workflow.name` OTel attributes | **NET_NEW** (corrects ground truth §3) | `D5r` `:111459-111461`; `grep -cF 'workflow.run_id'` = **1/0** | [otel §2](otel_attributes_and_correlation.md) |
| 3 | `.206` | False "disused plugin" tips and skewed disuse telemetry for LSP plugins | **CROSS-THEME** | `pluginUsageLspGraceAppliedIds` — owned by `skills_plugins` | not covered |
| 4 | `.210` | Rendered text fragment leaking into crash telemetry | **UNANCHORED** | `Text string must be rendered` 0/0; a React/Ink render-guard, no CLI literal | not covered |
| 5 | `.211` | `/clear` not resetting the session cost counter | **NET_NEW** (call-site delta) | `Att()` `:449533`; `resetCostState` `:3114-3126`; sites 3 vs 193's 2 | [cost §4](cost_and_usage_metering.md) |
| 6 | `.212` | OTel HTTP exports rejected 411/400 by endpoints refusing chunked encoding | **NET_NEW** | `_Fo` `:494959-495001`; `OTLP request body chunk is not string or Uint8Array` `:494957` (1/0) | [exporters §2](content_truncation_and_exporters.md) |
| 7 | `.212` | OTLP event log records missing `trace_id`/`span_id` when `TRACEPARENT` is set | **NET_NEW** (anchor over-counts) | `X1g` `:167346-167353`; only `:167351` is new — `:168065` ↔ `:286545 (193)` | [otel §3](otel_attributes_and_correlation.md) |
| 8 | `.212` | Session transcripts record the reasoning effort level on each assistant message | **CROSS-THEME** | `model_reasoning_effort` `:453616` is a **decoy** — it is a field of an *external* agent session-file zod schema (beside `approval_policy` / `sandbox_mode`, `:453605-453625`). Owned by `47_models` | not covered |
| 9 | `.214` | Added `message.uuid`, `client_request_id`, `tool_source` OTel log attributes | **NET_NEW** (split 3 ways) | `"message.uuid"` 3/0 (`:340052`, `:343276`, `:593770`); `client_request_id` 7/5 → new at `:339695`, `:340033`; `tool_source` 1/0 (`:152009`) | [otel §4](otel_attributes_and_correlation.md) |
| 10 | `.214` | Added `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` to configure the 60 KB truncation | **NET_NEW** | `:24390` (accessor), `:24529` (zod), `:167274` (read), `V1g` `:167272`, `WP` `:167280`, `q1g` `:167289` | [truncation §1](content_truncation_and_exporters.md) |
| 11 | `.214` | Crash when a GrowthBook feature evaluates to `null`; malformed payload wiping the flag cache | **NET_NEW** (all 4 scope anchors are decoys) | `zXi` `:156630-156632`; `$no` `:156651-156665`; `Otu` `:156504-156561` (`a.size === 0` `:156553`, `R$e !== e` `:156554`) | [flags §1, §2](feature_flags_and_gate_resolution.md) |
| 12 | `.214` | Feature flags going stale in long sessions after the OAuth token rotates | **NET_NEW** | `Nno` `:156733-156757` (the `if (Pno)` block, absent from `awn` `:147414 (193)`); `tengu_gb_eval_authed_enable` `:156378` (1/0) | [flags §3](feature_flags_and_gate_resolution.md) |
| 13 | `.214` | Session cost/token telemetry double-counting on cumulative `message_delta` frames | **NET_NEW** (no baseline exists) | `e.usage.output_tokens = s.data.usage.output_tokens` `:862798`; `sawOutputTokens` 3/0; `estOutputChars` 5/0 | [cost §1](cost_and_usage_metering.md) |
| 14 | `.214` | OTel log events outside the turn's async context missing the interaction span's trace context | **NET_NEW** | `X1g` `:167346`; `Uio` `:167328` (carryover) + `...(a && { context: a })` `:167364` (new); `les` at `sat` `:168033` | [otel §3](otel_attributes_and_correlation.md) |
| 15 | `.216` | Prometheus metrics endpoint emitting invalid `# UNIT` lines | **DELTA** | `# UNIT` 1/1 and the serializer is byte-identical; real fix is `{ omitUnits }` `:3178-3180`, `:3188`, `:3189`, `:3196` + predicate `:827919` | [exporters §3](content_truncation_and_exporters.md) |
| 16 | `.216` | Telemetry misreporting permission denials (failed prompts / interrupts) | **NET_NEW** | `if (e.reason === i7t) return "user_abort"` `:425315` vs `case "other": return "config"` `:444530 (193)`; `i7t` `:58356`, `s7t` `:58383`; four reason literals all 1-2/0 | [otel §5](otel_attributes_and_correlation.md) |
| 17 | `.217` | Warnings when transcript writes fail (disk full) / session saving off via inherited env | **CROSS-THEME** | `tengu_transcript_writer_recovered`, `tengu_persistence_suppressed` (2/0 each) — owned by `50_performance` | not covered |
| 18 | `.217` | Managed `OTEL_EXPORTER_OTLP_ENDPOINT` not governing all signals | **PARTIAL** (bullet over-claims) | 9/7; the 2 new sites are `:861011`, `:861020` in the **gateway**. `hyE` `:861003-861023` sets all three `*_EXPORTER`s — but **not** the signal-specific endpoints, so the "lower-scope overrides" half is not implemented. Client resolution (`:494939`, `:489038-489042`) is carryover | [exporters §4](content_truncation_and_exporters.md) |
| 19 | `.218` | Gateway spend metering for Bedrock `application-inference-profile` ARNs | **NET_NEW** (literal carryover) | `application-inference-profile` **6/6**; the fix is `BMm` `:862658-862663` in a server absent from 193 | [cost §2](cost_and_usage_metering.md) |
| 20 | `.218` | PR events occasionally lost when a session exited right after creating/linking a PR | **NET_NEW** *(was UNANCHORED — cycle D2 resolved)* — `registerPreExitFlush` **2/0**, and 193's flush-all helper was **test-only** (`_flushLogWritersForTesting` **0/1**). ⚠ Narrowed, not closed: the default `onEpochMismatch` is a bare `process.exit(1)` (`:415612-415616`) that skips the drain entirely. See [../50_performance/disk_and_transcript.md](../50_performance/disk_and_transcript.md) §6 | `tengu_pr_footer_surface_suffix` / `tengu_gh_pr_status_auth_state` are 1/1 and 1/0 but are footer/auth-state events, not a flush guard | not covered |
| 21 | `.218` | Negative/incorrect turn durations after a clock adjustment; monotonic clock | **UNANCHORED** | `_monotonicClock` **6/6** is **vendored OTel SDK** code (`:102162-102169`, `:489375-489382`); `turnDurationMs` 2/2 and `turnStartTime` 8/8 all map 1:1. `performance.now()` is 324/297 — 27 new sites, none isolable | [cost §5.2](cost_and_usage_metering.md) |
| 22 | `.218` | Server-managed settings: benign feature/cost toggles no longer trigger the approval prompt | **UNANCHORED** | `tengu_advisor_settings_sync` 1/0 (gate only); `settings-approval` 0/0. Primary theme `auth_providers` | not covered |
| 23 | `.219` | *(adjacent)* "Removed Opus 4.7 from fast mode" — the **pricing** half | **GROUND-TRUTH CORRECTION** | `speed === "fast"` 4/2; `Dji` `:109772-109777`; `a7n = {10,50,…}` `:109843`; `UIc = {30,150,…}` `:109835`; `zkt` `:109713-109717` | [cost §3](cost_and_usage_metering.md) |

**Totals:** 11 NET_NEW · 1 DELTA · 1 PARTIAL · 5 UNANCHORED · 4 CROSS-THEME · 1 ground-truth correction.

---

## False deltas caught

Bullets or asset-diff entries that read as new but whose named literal is carryover. Each was
confirmed by reading both sites.

| Bullet / entry | Literal | 220 | 193 | Proof |
|---|---|---|---|---|
| `.216` Prometheus `# UNIT` | `# UNIT` | 1 | 1 | `_serializeMetricData` `:494148-494183` vs `:349507-349529 (193)`, plus helpers `:494050-494089` vs `:349412-349446 (193)` — vendored, byte-identical |
| `.218` monotonic turn duration | `_monotonicClock` | 6 | 6 | both 220 sites (`:102162`, `:489375`) have byte-identical 193 twins (`:140015`, `:344734`); it is `@opentelemetry/*` `TimeOrigin` code |
| `.218` monotonic turn duration | `turnDurationMs` | 2 | 2 | `J8p` `:647620-647642` ≡ `JJa` `:394402-394419 (193)`; statusline hook `:822912` ≡ `:689697 (193)` |
| `.218` gateway ARN pricing | `application-inference-profile` | 6 | 6 | all six 220 sites map 1:1 to 193; the fix is in a net-new server component |
| `.214` `client_request_id` | `client_request_id` | 7 | 5 | five sites pair off (`:167740`↔`:286218`, `:168137`↔`:286617`, `:168179`↔`:286659`, `:509624`↔`:594494`, `:510277`↔`:594969`); only `:339695`, `:340033` are new |
| `.212` `TRACEPARENT` extraction | `traceparent: Z.TRACEPARENT` | 2 | 0 | **over-counts**: `:168065` is `:286545 (193)` with `process.env.X` rewritten to `Z.X`. Only `:167351` is new |
| `.212`/`.214` stored trace context | `ROOT_CONTEXT && ` | 1 | 1 | `Uio` `:167328-167331` ≡ `bF` `:286500-286503 (193)`; `les`/`tlu` (`:167322`/`:167325`) only wrap 193's inline `E2t = n` (`:286511 (193)`) |
| `.214` GrowthBook payload | `skipped non-object features` | 1 | 1 | the null-entry guard already existed (`:156514` ≡ `:147237 (193)`); the change is that the clears moved after validation |
| `.216` permission denials | `decisionClassification` | 5 | 5 | classification plumbing untouched; the fix is that failures now carry `{type:"other"}` instead of `{type:"permissionPromptTool"}` |
| `.219` fast-mode pricing | `speed === "fast"` | 4 | 2 | `s7u` `:102553-102558 (193)` already had the fast-rate branch with identical numbers (`:102629-102644 (193)`); the delta is `|| r === "claude-opus-5"` at `:109775` |
| asset diff "new env vars" | `OTEL_METRICS_EXPORTER` | 7 | 5 | eleven `OTEL_*` names listed as new are all carryover; they only became *detectable* when 220 registered them in the typed accessor table `:24360-24400` |
| asset diff "new gates" | `gate_error` / `gate_denied` / `gate_skip` / `feature_disabled` / `feature_flag_writes` | 1/2/2/3/1 | 0/1/0/0/0 | none is a telemetry gate: `:317446`/`:317450` = agent-observer delivery, `:158808`/`:158848` = org memory credential, `:320533`+ = a stream error enum, `:345194` = an auto-mode dangerous-action category |

Additionally: **`tengu_otel_*` does not exist in either bundle** (`grep -c 'tengu_otel'` = 0/0). The
task brief's suggestion to chase those gates has no target.

And a false *carryover* claim corrected in the other direction: ground truth §3 files `.202` as
`220=3 / 193=2 — partially pre-existing`. That count comes from an unescaped regex where `.` matched
`workflow_run_id`, the internal snake_case analytics field (193 `:424852`, `:424892`; still present in
220 at `:388701`, `:388741`). `grep -cF 'workflow.run_id'` is **1/0** — the bullet is fully net-new.

---

## Corrections to `_GROUND_TRUTH_verified_anchors.md`

Raised loudly, as instructed.

1. **§3, `.202` row** — *"`workflow.run_id` 220=3 / 193=2. Partially pre-existing. Find the one new
   emission site."* The counts are a regex artefact; `-F` gives 1/0 for both `workflow.run_id` and
   `workflow.name`. The bullet is **fully net-new** and there is exactly one *builder* (`D5r`,
   `:111459`) with three consumers (`:167360`, `:168127`, `:168218`).

2. **§6.5** — *"There is no fast-mode tier and no multiplier anywhere in the pricing code … the
   client's own cost accounting prices a fast-mode turn at the standard `tier_5_25` rate, so session
   cost is under-reported by ~2× in fast mode."* **Wrong.** `resolveModelCosts` (`Dji`,
   `:109772-109784`) branches on `usage.speed === "fast"` and returns a *separate rate table*:
   `a7n` (`:109843`) = `{input: 10, output: 50, cache_write_5m: 12.5, cache_write_1h: 20,
   cache_read: 1, web_search: 0.01}` for Opus 4.8 and Opus 5, `UIc` (`:109835`) =
   `{30, 150, 37.5, 60, 3, 0.01}` for Opus 4.6/4.7. The `$10/$50` figure is implemented in the
   client. §6.5's greps (`fast_mode_multiplier`, `fastModeMultiplier`) could not match a table swap.
   What survives from §6.5: the *catalogue* has no fast tier, and fast mode is still selected
   server-side. Details and the 2.1.193 comparison: [cost §3](cost_and_usage_metering.md).

3. **§3, `.214` OTel row** — *"`client_request_id` 220=7 / 193=5 (partial); `tool_source` 220=1 /
   193=0 (genuinely new). Split the bullet."* Confirmed and extended: `message.uuid` is the third
   attribute and it is also **genuinely new** (`grep -cF '"message.uuid"'` = 3/0, not the 19/14 the
   scoping pass reported with an unescaped regex).

---

## Not covered, and why

- **`.210` rendered text fragment leaking into crash telemetry** — `Text string must be rendered` is
  0/0 in both bundles. The message originates in Ink's renderer, not in the Claude Code bundle, and
  the fix is a component-shape guard with no telemetry-side literal. Genuinely unanchorable from these
  two files.
- ~~**`.218` PR events lost on immediate exit**~~ — **NOW COVERED** (cycle D2 resolved). The candidate
  gates were indeed unrelated; the mechanism is the pre-exit flush registry, analysed in
  [`../50_performance/disk_and_transcript.md`](../50_performance/disk_and_transcript.md) §6.
- **`.218` server-managed settings / benign toggles** — primary theme `auth_providers`; the only new
  literal is a gate name with no read site I could pin.
- **`.212` reasoning effort in transcripts** and **`.217` transcript-write warnings** — cross-theme
  (`47_models`, `50_performance`). I record the `model_reasoning_effort` decoy (`:453616` is an
  *external* agent session-file schema field) so the owning module does not repeat the mistake.
- **`.206` LSP plugin disuse telemetry** — `skills_plugins`.
- **`.196` rate-limit over-counting** and **`.218` monotonic turn duration** — attempted at length and
  recorded as UNANCHORED with all probes and decoys documented in
  [cost §5](cost_and_usage_metering.md). For `.218` I can say the fix is *somewhere* among the 27 new
  `performance.now()` sites (324 vs 297) but not which; naming a line would be fabrication.
- **The Perfetto / beta-tracing path** (`ENABLE_BETA_TRACING_DETAILED`, `qP()` at `:167433-167436`,
  `CLAUDE_CODE_PERFETTO_TRACE`) is touched only where it intersects a bullet. No bullet in this window
  covers it, and it would have been depth spent outside the assignment.
- **`claude_code.*` metric semantics** beyond the unit question — the eight counters are enumerated in
  [exporters §3](content_truncation_and_exporters.md) but their emission sites are not traced. No
  bullet required it.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols discovered by this module are staged for merge in
> [symbol_additions_v2_1_220_telemetry.md](../00_overview/symbol_additions_v2_1_220_telemetry.md)
> (target file: `symbol_index_infra_platform.md`).

Entry points a reader should start from:
- `emitOtelLogEvent` (`Ac`, `:167354`) - every `claude_code.*` OTel log record
- `resolveLogRecordTraceContext` (`X1g`, `:167346`) - which trace a record joins
- `resolveOtelContentMaxLength` (`V1g`, `:167272`) / `truncateTelemetryContent` (`WP`, `:167280`) - the content ceiling
- `initializeTelemetry` (`oI_`, `:494733`) - readers, exporters, `metricsExporterKinds`
- `setMeterAndCounters` (`FSi`, `:3178`) - the eight `claude_code.*` counters
- `buildOtlpHttpAgentFactory` (`JKd`, `:495002`) / `wrapAgentToBufferBodyAndSetContentLength` (`_Fo`, `:494959`) - the HTTP export path
- `resolveModelCosts` (`Dji`, `:109772`) - client-side pricing, including fast mode
- `priceUsageCents` (`BMm`, `:862658`) - gateway spend metering
- `getFeatureValueWithSource` (`$no`, `:156651`) - the flag control plane
