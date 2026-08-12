# Dead-probe retirement and compatibility census in 2.1.227

## 1. The census is rolling, with only one probe retained

### Exact probe-family contraction

**What it does:** Measures how much of the bundle-wide dead-path instrumentation introduced by
2.1.220 remains in 2.1.227.

**How it works:**
1. Exact event-name extraction from the 2.1.220 bundle finds 25 unique
   `tengu_dead_probe_*` names across 32 emissions.
2. The same extraction from 2.1.227 finds nine unique names across nine emissions.
3. Set intersection contains exactly one name: `tengu_dead_probe_tool_alias_exec`.
4. Twenty-four 2.1.220 names disappear. Eight names are new in 2.1.227:
   `legacy_local_settings`, `include_coauthored_by`, `hook_updated_mcp_tool_output`,
   `legacy_progress_bridge`, `adopt_ticks_token`, `iterm2_crash_restore`, `bg_legacy_op`, and
   `legacy_plugin_tip_counts`.
5. Source-presence comparison proves removal and addition of instrumentation sites, not whether any
   probed branch fired or which intermediate release changed it.

**Why this approach:**
- Exact prefix extraction avoids confusing ordinary telemetry with the deliberately named census.
- Counting names, sites, and set intersection distinguishes category retirement, deduplication, and
  newly instrumented compatibility seams.
- The bundle is sufficient for structural history but not production reachability statistics.

**Key insight:** The family is a rolling migration census: its net footprint shrank by 64% in names and
72% in sites, but eight of nine current probes ask new questions. Net counts alone would hide that
turnover.

## 2. Current probes are bounded cardinality by construction

### Once-per-key latch design

**What it does:** Prevents a legacy path from flooding analytics while preserving distinctions needed
to decide whether that path can be removed.

**How it works:**
1. Eight current sites keep a `Set` or set-like class keyed by a small enum, boolean pair, alias, or
   site label.
2. Repeated observations of the same key return without emitting.
3. `legacy_local_settings` and `include_coauthored_by` expose reset methods for test or lifecycle
   isolation (`:60380-60388`, `:374099-374107`).
4. `tool_alias_exec` latches by alias (`:344990-344998`); `hook_updated_mcp_tool_output` latches by
   boolean presence (`:533932-533938`).
5. `legacy_progress_bridge`, `adopt_ticks_token`, and `bg_legacy_op` latch by enumerated signal/site/op
   (`:537509-537512`, `649483-649495`, `766873-766883`).
6. `legacy_plugin_tip_counts` compresses two comparisons into one of four possible boolean-pair keys
   (`:908889-908898`).
7. `iterm2_crash_restore` is not set-latched, but is naturally bounded by a persisted “setup in
   progress” state that is cleared on every handled outcome (`:651558-651585`).

**Why this approach:**
- A process-level once-per-key event answers “did this compatibility route occur?” without measuring
  user activity volume.
- Small explicit keys cap cardinality and prevent paths, command text, or arbitrary content from
  becoming dimensions.
- Latching loses frequency information, which is acceptable for deletion-readiness decisions but not
  performance analysis.

**Key insight:** These are presence detectors, not usage counters. Their data model is deliberately
binary or small-enum because the engineering decision is whether a path still exists in practice.

## 3. Payloads reveal migration questions without exposing raw values

### Compile-time-shaped probe payloads

**What it does:** Records the compatibility distinction relevant to cleanup while minimizing content
and telemetry cardinality.

**How it works:**
1. Site and operation fields are passed through the telemetry safe-enum/literal wrapper rather than
   emitted as arbitrary user strings.
2. The tool-alias probe sanitizes both alias and canonical tool name before emission (`:344998`).
3. The hook probe records only whether the newer `updatedToolOutput` field was present.
4. The iTerm2 probe records only whether a backup path existed, never the path.
5. The plugin-tip probe records only whether legacy counts changed the maximum and whether they
   crossed the threshold.
6. No current dead probe includes command contents, task descriptions, file paths, hook output, or
   message text.

**Why this approach:**
- Cleanup decisions need branch identity and coarse outcomes, not sensitive payloads.
- Booleanization prevents high-cardinality leakage from local paths or plugin state.
- Sanitized tool names remain more variable than a fixed enum, but preserve the alias migration
  question that the probe exists to answer.

**Key insight:** Each payload is the minimal witness for a deletion hypothesis: legacy field present,
old alias executed, fallback restore needed, or obsolete count changed behavior.

## 4. A probe observes the old branch; it does not replace it

### Non-interfering legacy-path execution

**What it does:** Preserves compatibility behavior after recording that a supposedly dead route was
reached.

**How it works:**
1. Legacy local settings invoke a callback probe and continue through normal settings resolution
   (`:60390-60409`).
2. Alias execution records remapping and then executes the canonical tool (`:344990-345024`).
3. Disabled co-author attribution emits a site and still returns the legacy empty attribution text
   (`:374109-374118`, second site `:374240`).
4. The iTerm2 branch records crash restoration, then validates and restores the backup or clears stale
   setup state.
5. Background legacy operations are marked before their compatibility dispatch handles the request
   (`:766880-766907`, calls at `:767061`, `:767408`).
6. Plugin-tip legacy counts are observed before the existing threshold/cooldown relevance pipeline
   continues (`:908900-908915`).

**Why this approach:**
- Removing behavior at the moment measurement begins would make the probe unable to distinguish dead
  code from broken compatibility.
- Side-effect-free telemetry can be safely deployed before deletion.
- Keeping the branch has maintenance cost; the probe exists to gather evidence that can justify
  paying that cost no longer.

**Key insight:** A dead probe is intentionally paradoxical: it marks code believed dead while keeping
that code fully alive. Only later evidence should authorize deletion.

## 5. The nine current probes cover five migration boundaries

### Residual compatibility ownership

**What it does:** Groups the current probes by the decision they inform without duplicating symbol
mappings into this module document.

**How it works:**
1. Configuration migration retains `legacy_local_settings` at `:60384` and
   `include_coauthored_by` at `:374103`.
2. Tool/protocol migration retains `tool_alias_exec` at `:344998` and
   `hook_updated_mcp_tool_output` at `:533938`.
3. Transcript/background protocol migration retains `legacy_progress_bridge` at `:537511` and
   `bg_legacy_op` at `:766882`.
4. Process/terminal recovery retains `adopt_ticks_token` at `:649487` and
   `iterm2_crash_restore` at `:651571`.
5. Plugin/UI migration retains `legacy_plugin_tip_counts` at `:908897`.
6. Ownership of the surrounding implementation remains with permissions/settings, tools, hooks,
   background agents, terminal integration, and plugin/UI modules; this document owns only the
   cross-cutting probe mechanism and census.

**Why this approach:**
- Grouping by migration question makes the census useful for cleanup planning.
- Keeping implementation ownership in the specialist module avoids turning a telemetry mechanism into
  a duplicate architecture report.
- Exact line anchors allow each specialist analysis to incorporate the relevant survivor later.

**Key insight:** What remains is not one subsystem. It is a common evidence-gathering pattern applied
at nine old/new compatibility seams.

## 6. Removed instrumentation does not prove the old path was deleted

### Conservative retirement inference

**What it does:** Defines the strongest conclusion supportable from two obfuscated bundles without
production telemetry or intermediate releases.

**How it works:**
1. An old event string absent from 2.1.227 proves only that its emission code is absent under that
   name.
2. The underlying compatibility behavior may have been deleted, rewritten, renamed, or moved behind a
   different signal.
3. A surviving event proves the instrumented branch still exists, not that users reach it.
4. A zero event count in production would support deletion only after accounting for client adoption,
   event sampling, offline/headless use, and the relevant observation window.
5. No 2.1.221–2.1.227 changelog bullet announces this cleanup campaign, so intermediate timing cannot
   be assigned honestly.
6. The correct report status is “probe retired/refactored” unless the owning module independently
   proves removal of the underlying branch.

**Why this approach:**
- Event strings are strong static anchors but weak evidence about runtime frequency.
- Conservative language avoids converting telemetry intent into a false behavioral claim.
- Separate owner-module verification can later promote individual cases from instrumentation removal
  to implementation deletion.

**Key insight:** Static diff answers “is the detector present?” Production telemetry answers “did the
branch fire?” Control-flow analysis answers “does the branch still exist?” Those are three different
questions.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isTaskTrackingSuppressedForModel` (`cle`) - retained model-targeted task kill switch; it is not a
  dead probe and should not be confused with the census family.
- `carryTaskListToFork` (`sGv`) - retained compatibility-preservation path adjacent to the historical
  task analysis, but likewise not a dead probe.
