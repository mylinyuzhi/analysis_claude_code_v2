# Query Profiling System (Claude Code 2.1.76)

> Deep analysis of the internal query profiling/performance measurement infrastructure
> Source: `chunks.149.mjs:1195-1360`, `chunks.169.mjs:740-1000`, `chunks.188.mjs:555-590`

---

## Table of Contents

- [Overview](#overview)
- [Activation Mechanism](#activation-mechanism)
- [Performance Mark Recording](#performance-mark-recording)
- [Checkpoint Timing and Memory Tracking](#checkpoint-timing-and-memory-tracking)
- [Slow Operation Detection](#slow-operation-detection)
- [Report Generation](#report-generation)
- [Phase Breakdown Report](#phase-breakdown-report)
- [Call Sites Across the Agent Loop](#call-sites-across-the-agent-loop)
- [Key Insight](#key-insight)
- [Related Symbols](#related-symbols)

---

## Overview

Claude Code includes an internal query profiling system that instruments the full lifecycle of a single query -- from user input received, through context loading, compaction, tool schema building, message normalization, client creation, API request, streaming, tool execution, and recursive calls. When activated, it places named "marks" into Node.js `perf_hooks` performance timeline and simultaneously captures `process.memoryUsage()` snapshots at each checkpoint. At query end, it generates a human-readable report with absolute timestamps, delta timings, slow-operation warnings, memory usage, and a phase breakdown bar chart.

This system is entirely opt-in and zero-cost when disabled: every function begins with `if (!profilingEnabled) return;`, so no performance marks, memory snapshots, or report formatting occur unless the flag is set.

---

## Activation Mechanism

### How the Flag Works

**What it does:** Controls whether any profiling code executes throughout the entire session.

**How it works:**
1. A module-level boolean variable `profilingEnabled` (obfuscated: `BU1`) is initialized to `false` at module load time (line 380699)
2. When the environment variable `CLAUDE_CODE_PROFILE_QUERY=1` is set before launching Claude Code, the initialization logic sets `BU1 = true`
3. Every profiling function (`recordMark`, `resetProfiling`, `endProfiling`, `generateReport`, `printReport`) immediately returns if `BU1` is `false`
4. The report generation function explicitly references the env var name in its disabled message: `"Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)"`

**Why this approach:**
- A boolean guard at the top of every function is the cheapest possible gating mechanism -- a single branch prediction that almost always falls through to `return`
- No conditional imports, no dynamic patching, no wrapper functions
- The `perf_hooks` module itself is lazily loaded only when profiling is active (via `getPerformanceInstance`)

**Key insight:** The profiling infrastructure is designed to be permanently embedded in production code with effectively zero overhead when disabled. There is no separate "debug build" -- every user has the profiling code, they just need to set one env var to activate it.

```javascript
// ============================================
// recordMark - Record a named performance checkpoint with memory snapshot
// Location: chunks.149.mjs:1215-1222
// ============================================

// ORIGINAL (for source lookup):
function y3(A) {
    if (!BU1) return;
    let q = HhA();
    if (q.mark(A), whA.set(A, process.memoryUsage()), A === "query_first_chunk_received" && zhA === null) {
        let K = q.getEntriesByType("mark");
        if (K.length > 0) zhA = K[K.length - 1]?.startTime ?? 0
    }
}

// READABLE (for understanding):
function recordMark(checkpointName) {
    if (!profilingEnabled) return;
    let perf = getPerformanceInstance();
    perf.mark(checkpointName);
    memorySnapshots.set(checkpointName, process.memoryUsage());
    if (checkpointName === "query_first_chunk_received" && firstChunkTime === null) {
        let marks = perf.getEntriesByType("mark");
        if (marks.length > 0) firstChunkTime = marks[marks.length - 1]?.startTime ?? 0;
    }
}

// Mapping: y3→recordMark, A→checkpointName, BU1→profilingEnabled,
//          HhA→getPerformanceInstance, whA→memorySnapshots, zhA→firstChunkTime
```

---

## Performance Mark Recording

### The Core Mechanism

**What it does:** Each call to `recordMark` (obfuscated: `y3`) places a named mark into the Node.js `perf_hooks` performance timeline and simultaneously snapshots `process.memoryUsage()` into a parallel `Map`.

**How it works:**
1. `perf.mark(checkpointName)` records the name and high-resolution timestamp into the performance timeline
2. `memorySnapshots.set(checkpointName, process.memoryUsage())` captures RSS, heap total, heap used, external, and array buffers at the same instant
3. Special handling for `"query_first_chunk_received"`: captures the absolute startTime into `firstChunkTime` for TTFT (Time To First Token) calculation later

**Why this approach:**
- Node.js `perf_hooks` provides monotonic high-resolution timestamps that are immune to system clock adjustments
- Memory snapshots at each checkpoint enable correlating memory growth with specific operations (e.g., detecting a spike during context loading or compaction)
- The parallel Map approach keeps memory data separate from the performance timeline, avoiding any interference with native `perf_hooks` APIs

### Lazy Performance Instance

```javascript
// ============================================
// getPerformanceInstance - Lazily load perf_hooks.performance
// Location: chunks.149.mjs:1205-1208
// ============================================

// ORIGINAL (for source lookup):
function HhA() {
    if (!YhA) YhA = h1("perf_hooks").performance;
    return YhA
}

// READABLE (for understanding):
function getPerformanceInstance() {
    if (!performanceInstance) performanceInstance = require("perf_hooks").performance;
    return performanceInstance;
}

// Mapping: HhA→getPerformanceInstance, YhA→performanceInstance
```

**Key insight:** The `perf_hooks` module is only imported when actually needed. This is a micro-optimization: if profiling is never enabled during a session, the module is never loaded.

### Reset Between Queries

```javascript
// ============================================
// resetProfiling - Clear all marks and start fresh for a new query
// Location: chunks.149.mjs:1210-1213
// ============================================

// ORIGINAL (for source lookup):
function l1q() {
    if (!BU1) return;
    HhA().clearMarks(), whA.clear(), zhA = null, c1q++, y3("query_user_input_received")
}

// READABLE (for understanding):
function resetProfiling() {
    if (!profilingEnabled) return;
    getPerformanceInstance().clearMarks();
    memorySnapshots.clear();
    firstChunkTime = null;
    queryCounter++;
    recordMark("query_user_input_received");
}

// Mapping: l1q→resetProfiling, BU1→profilingEnabled, HhA→getPerformanceInstance,
//          whA→memorySnapshots, zhA→firstChunkTime, c1q→queryCounter, y3→recordMark
```

**What it does:** Clears all previous marks and memory snapshots, increments the query counter, and places the first checkpoint for the new query.

**Why this approach:**
- Performance marks accumulate globally in `perf_hooks`, so `clearMarks()` is essential to avoid contamination from previous queries
- The `queryCounter` provides a sequential query number in the report header, making it easy to track which query is being profiled in a multi-turn session
- Placing `"query_user_input_received"` as the very first mark establishes the baseline timestamp (time zero) for all subsequent checkpoints

---

## Checkpoint Timing and Memory Tracking

### Complete Checkpoint Inventory

The profiling system places marks at these named checkpoints throughout the query lifecycle:

| Checkpoint Name | Location | What It Captures |
|----------------|----------|-----------------|
| `query_user_input_received` | `chunks.149.mjs:1212` (via `resetProfiling`) | User submits input, baseline timestamp |
| `query_context_loading_start` | `chunks.188.mjs:563` | Begin loading git status, file context, env info |
| `query_context_loading_end` | `chunks.188.mjs:569` | Context loading complete |
| `query_query_start` | `chunks.188.mjs:577` | Main query generator about to be entered |
| `query_fn_entry` | `chunks.149.mjs:1771` | Entry into `queryGenerator` function body |
| `query_microcompact_start` | `chunks.149.mjs:1786` | Begin micro-compaction of messages |
| `query_microcompact_end` | `chunks.149.mjs:1789` | Micro-compaction complete |
| `query_autocompact_start` | `chunks.149.mjs:1791` | Begin auto-compaction check/execution |
| `query_autocompact_end` | `chunks.149.mjs:1801` | Auto-compaction complete |
| `query_setup_start` | `chunks.149.mjs:1834` | Begin building streaming tool executor, permission mode |
| `query_setup_end` | `chunks.149.mjs:1843` | Setup complete |
| `query_api_loop_start` | `chunks.149.mjs:1858` | Enter the retry/fallback API loop |
| `query_api_streaming_start` | `chunks.149.mjs:1864` | Begin streaming request to API |
| `query_tool_schema_build_start` | `chunks.169.mjs:747` | Begin building tool schemas for API |
| `query_tool_schema_build_end` | `chunks.169.mjs:799` | Tool schema building complete |
| `query_message_normalization_start` | `chunks.169.mjs:801` | Begin normalizing messages for API format |
| `query_message_normalization_end` | `chunks.169.mjs:803` | Message normalization complete |
| `query_client_creation_start` | `chunks.169.mjs:943` | Begin creating API client |
| `query_client_creation_end` | `chunks.169.mjs:971` | Client creation complete |
| `query_api_request_sent` | `chunks.169.mjs:971` | API request sent to server |
| `query_first_chunk_received` | `chunks.169.mjs:994` | First streaming chunk received from API |
| `query_api_streaming_end` | `chunks.149.mjs:1919` | All streaming chunks received |
| `query_tool_execution_start` | `chunks.149.mjs:2013` | Begin executing tool use blocks |
| `query_tool_execution_end` | `chunks.149.mjs:2046` | All tool executions complete |
| `query_recursive_call` | `chunks.149.mjs:2128` | About to recurse for next turn in agent loop |
| `query_profile_end` | `chunks.149.mjs:1226` (via `endProfiling`) | Profiling cycle ends (called on first chunk) |
| `query_end` | `chunks.188.mjs:587` | Query fully complete |

### Execution Flow with Checkpoints

```
user_input_received
    |
    v
context_loading_start --> context_loading_end
    |
    v
query_query_start --> query_fn_entry
    |
    v
microcompact_start --> microcompact_end
    |
    v
autocompact_start --> autocompact_end
    |
    v
setup_start --> setup_end
    |
    v
api_loop_start --> api_streaming_start
    |                   |
    |    [in chunks.169.mjs streaming layer:]
    |    tool_schema_build_start --> tool_schema_build_end
    |    message_normalization_start --> message_normalization_end
    |    client_creation_start --> client_creation_end
    |    api_request_sent
    |    ... network wait ...
    |    first_chunk_received --> profile_end (TTFT captured)
    |                   |
    v                   v
api_streaming_end
    |
    v
tool_execution_start --> tool_execution_end
    |
    v
[recursive_call if tools produced output]
    |
    v
query_end --> printReport
```

---

## Slow Operation Detection

### Warning Thresholds

```javascript
// ============================================
// getSlowWarning - Flag operations that exceed timing thresholds
// Location: chunks.149.mjs:1237-1245
// ============================================

// ORIGINAL (for source lookup):
function vdY(A, q) {
    if (q === "query_user_input_received") return "";
    if (A > 1000) return " ⚠️  VERY SLOW";
    if (A > 100) return " ⚠️  SLOW";
    if (q.includes("git_status") && A > 50) return " ⚠️  git status";
    if (q.includes("tool_schema") && A > 50) return " ⚠️  tool schemas";
    if (q.includes("client_creation") && A > 50) return " ⚠️  client creation";
    return ""
}

// READABLE (for understanding):
function getSlowWarning(deltaMs, checkpointName) {
    if (checkpointName === "query_user_input_received") return "";  // baseline, no warning
    if (deltaMs > 1000) return " ⚠️  VERY SLOW";    // >1s between any two checkpoints
    if (deltaMs > 100)  return " ⚠️  SLOW";          // >100ms between any two checkpoints
    if (checkpointName.includes("git_status") && deltaMs > 50) return " ⚠️  git status";
    if (checkpointName.includes("tool_schema") && deltaMs > 50) return " ⚠️  tool schemas";
    if (checkpointName.includes("client_creation") && deltaMs > 50) return " ⚠️  client creation";
    return "";
}

// Mapping: vdY→getSlowWarning, A→deltaMs, q→checkpointName
```

**Key insight:** The 50ms specific thresholds for git status, tool schemas, and client creation reveal that these are **known historical problem areas** where regressions have previously occurred. The profiling system serves as both a diagnostic tool and a regression detection mechanism.

---

## Report Generation

### Example Report Output

```
================================================================================
QUERY PROFILING REPORT - Query #3
================================================================================

[+     0.000ms] (+    0.000ms) query_user_input_received | RSS: 145.23MB, Heap: 98.45MB
[+     2.341ms] (+    2.341ms) query_context_loading_start | RSS: 145.23MB, Heap: 98.50MB
[+    45.678ms] (+   43.337ms) query_context_loading_end | RSS: 148.12MB, Heap: 101.20MB
[+    46.012ms] (+    0.334ms) query_query_start | RSS: 148.12MB, Heap: 101.20MB
[+    46.500ms] (+    0.488ms) query_fn_entry | RSS: 148.12MB, Heap: 101.22MB
[+    47.100ms] (+    0.600ms) query_microcompact_start | RSS: 148.12MB, Heap: 101.22MB
[+    48.200ms] (+    1.100ms) query_microcompact_end | RSS: 148.15MB, Heap: 101.30MB
[+    48.500ms] (+    0.300ms) query_autocompact_start | RSS: 148.15MB, Heap: 101.30MB
[+    49.000ms] (+    0.500ms) query_autocompact_end | RSS: 148.15MB, Heap: 101.30MB
[+    49.500ms] (+    0.500ms) query_setup_start | RSS: 148.15MB, Heap: 101.32MB
[+    52.000ms] (+    2.500ms) query_setup_end | RSS: 148.20MB, Heap: 101.40MB
[+    52.500ms] (+    0.500ms) query_api_loop_start | RSS: 148.20MB, Heap: 101.40MB
[+    53.000ms] (+    0.500ms) query_api_streaming_start | RSS: 148.20MB, Heap: 101.40MB
[+    55.000ms] (+    2.000ms) query_tool_schema_build_start | RSS: 148.20MB, Heap: 101.42MB
[+    62.000ms] (+    7.000ms) query_tool_schema_build_end | RSS: 148.50MB, Heap: 101.80MB
[+    62.500ms] (+    0.500ms) query_message_normalization_start | RSS: 148.50MB, Heap: 101.80MB
[+    63.000ms] (+    0.500ms) query_message_normalization_end | RSS: 148.50MB, Heap: 101.82MB
[+    63.500ms] (+    0.500ms) query_client_creation_start | RSS: 148.50MB, Heap: 101.82MB
[+    68.000ms] (+    4.500ms) query_client_creation_end | RSS: 148.55MB, Heap: 101.90MB
[+    68.500ms] (+    0.500ms) query_api_request_sent | RSS: 148.55MB, Heap: 101.90MB
[+   520.000ms] (+  451.500ms) query_first_chunk_received | RSS: 149.00MB, Heap: 102.10MB

--------------------------------------------------------------------------------
Total TTFT: 520.000ms
  - Pre-request overhead: 68.500ms (13.2%)
  - Network latency: 451.500ms (86.8%)

PHASE BREAKDOWN:
  Context loading         43.337ms ████▍
  Microcompact             1.100ms ▏
  Autocompact              0.500ms ▏
  Query setup              2.500ms ▎
  Tool schemas             7.000ms ▊
  Message normalization    0.500ms ▏
  Client creation          4.500ms ▌
  Network TTFB           451.500ms █████████████████████████████████████████████▏

  Total pre-API overhead   68.500ms
================================================================================
```

---

## Phase Breakdown Report

### Named Phase Aggregation

The 9 defined phases cover the complete critical path of a query:

| Phase Name | Start Checkpoint | End Checkpoint |
|-----------|-----------------|---------------|
| Context loading | `query_context_loading_start` | `query_context_loading_end` |
| Microcompact | `query_microcompact_start` | `query_microcompact_end` |
| Autocompact | `query_autocompact_start` | `query_autocompact_end` |
| Query setup | `query_setup_start` | `query_setup_end` |
| Tool schemas | `query_tool_schema_build_start` | `query_tool_schema_build_end` |
| Message normalization | `query_message_normalization_start` | `query_message_normalization_end` |
| Client creation | `query_client_creation_start` | `query_client_creation_end` |
| Network TTFB | `query_api_request_sent` | `query_first_chunk_received` |
| Tool execution | `query_tool_execution_start` | `query_tool_execution_end` |

**Bar chart scale:** 1 block character = 10ms, capped at 50 blocks (500ms max width).

---

## Call Sites Across the Agent Loop

### Where Profiling Hooks Into the System

The profiling marks are placed at strategic points across three source files:

**1. Query Orchestrator (`chunks.188.mjs`)** -- The top-level React hook that drives the query lifecycle:
- `l1q()` (resetProfiling) called at line 3161 when user input is received
- `y3("query_context_loading_start")` at line 563 before loading git/file context
- `y3("query_context_loading_end")` at line 569 after context loading
- `y3("query_query_start")` at line 577 before entering the query generator
- `y3("query_end")` at line 587 after the query generator completes
- `n1q()` (printReport) at line 587 to output the final report

**2. Query Generator (`chunks.149.mjs`)** -- The main agent loop generator function (`ZR`):
- `y3("query_fn_entry")` at line 1771 on function body entry
- `y3("query_microcompact_start/end")` at lines 1786/1789 around micro-compaction
- `y3("query_autocompact_start/end")` at lines 1791/1801 around auto-compaction
- `y3("query_setup_start/end")` at lines 1834/1843 around streaming executor setup
- `y3("query_api_loop_start")` at line 1858 before the retry loop
- `y3("query_api_streaming_start/end")` at lines 1864/1919 around the streaming iteration
- `y3("query_tool_execution_start/end")` at lines 2013/2046 around tool execution
- `y3("query_recursive_call")` at line 2128 before recursing for the next agent turn

**3. Streaming Layer (`chunks.169.mjs`)** -- The low-level API streaming function:
- `y3("query_tool_schema_build_start/end")` at lines 747/799 around tool schema construction
- `y3("query_message_normalization_start/end")` at lines 801/803 around message normalization
- `y3("query_client_creation_start/end")` at lines 943/971 around API client creation
- `y3("query_api_request_sent")` at line 971 when the request is dispatched
- `y3("query_first_chunk_received")` at line 994 when the first streaming chunk arrives
- `i1q()` (endProfiling) at line 995 to mark the profiling end point

---

## Key Insight

### Why This System Exists

The query profiling system exists to solve a specific engineering challenge: **diagnosing where time is spent before the user sees the first token of a response**.

The TTFT breakdown explicitly separates **client-side overhead** (steps the Claude Code engineering team can directly optimize) from **network + server latency** (which they cannot control). The profiling system's TTFT breakdown gives the team a clear signal about whether a regression is in their code or on the API side.

The operation-specific slow warnings (git status >50ms, tool schemas >50ms, client creation >50ms) reveal that these are **known historical problem areas** where regressions have previously occurred.

The memory tracking at each checkpoint adds another dimension: if RSS grows by 50MB during context loading, that indicates the context itself is too large. If heap usage spikes during compaction, the compaction algorithm may be creating excessive intermediate objects.

---

## Module-Level State

| Variable | Obfuscated | Purpose | Initial Value |
|----------|------------|---------|---------------|
| `profilingEnabled` | `BU1` | Master on/off flag | `false` |
| `memorySnapshots` | `whA` | Map of checkpoint name to `process.memoryUsage()` result | `new Map` |
| `queryCounter` | `c1q` | Sequential query number for report headers | `0` |
| `firstChunkTime` | `zhA` | Absolute startTime of first chunk mark | `null` |
| `performanceInstance` | `YhA` | Cached `perf_hooks.performance` reference | `null` |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Telemetry section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, query generator)

Key functions in this document:
- `recordMark` (y3) - Record a named performance checkpoint with memory snapshot
- `resetProfiling` (l1q) - Clear all marks and start fresh for a new query
- `endProfiling` (i1q) - Mark end of profiling window (on first chunk)
- `generateProfilingReport` (EdY) - Build the full profiling report string
- `generatePhaseBreakdown` (kdY) - Build phase breakdown with ASCII bar chart
- `getSlowWarning` (vdY) - Flag operations exceeding timing thresholds
- `printProfilingReport` (n1q) - Output report to debug log
- `getPerformanceInstance` (HhA) - Lazily load perf_hooks.performance
- `formatMs` (st) - Format milliseconds to 3 decimal places
- `formatMB` (d1q) - Convert bytes to megabytes with 2 decimal places
- `profilingEnabled` (BU1) - Master on/off flag for query profiling
- `memorySnapshots` (whA) - Map of checkpoint name to memory usage data
- `queryCounter` (c1q) - Sequential query number for report headers
- `firstChunkTime` (zhA) - Absolute time of first chunk received
- `performanceInstance` (YhA) - Cached Node.js performance instance
