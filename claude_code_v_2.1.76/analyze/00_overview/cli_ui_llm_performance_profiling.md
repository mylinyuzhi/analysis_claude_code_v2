# CLI-UI-LLM Performance Profiling (Claude Code v2.1.76)

> Complete analysis of query profiling, startup profiling, and performance monitoring.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Query Profiling System](#2-query-profiling-system)
3. [Startup Profiling](#3-startup-profiling)
4. [Profiling Checkpoints](#4-profiling-checkpoints)
5. [Report Generation](#5-report-generation)
6. [Performance Warnings](#6-performance-warnings)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `profileCheckpoint` (K5) - Checkpoint marker at chunks.148.mjs:250
- `generateQueryReport` (BmY) - Report generator at chunks.148.mjs:282
- `resetQueryProfile` (vp8) - Profile reset at chunks.148.mjs:245
- `getPerformance` (Tp8) - Performance API at chunks.148.mjs:240

---

## 1. Overview

### 1.1 Profiling Architecture

Claude Code includes built-in profiling systems for diagnosing performance issues:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROFILING SYSTEMS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     QUERY PROFILING                                  │    │
│  │                                                                      │    │
│  │  Enabled: CLAUDE_CODE_PROFILE_QUERY=1                               │    │
│  │                                                                      │    │
│  │  Tracks:                                                             │    │
│  │  • Pre-request overhead (context, tools, messages)                  │    │
│  │  • Network latency (TTFT - Time To First Token)                     │    │
│  │  • Phase breakdown with visual bars                                 │    │
│  │  • Memory usage at each checkpoint                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    STARTUP PROFILING                                 │    │
│  │                                                                      │    │
│  │  Enabled: CLAUDE_CODE_PROFILE_STARTUP=1                             │    │
│  │         OR random sampling (0.1% of sessions)                        │    │
│  │                                                                      │    │
│  │  Tracks:                                                             │    │
│  │  • Module loading time                                               │    │
│  │  • CLI initialization                                                │    │
│  │  • First paint time                                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    TELEMETRY SAMPLING                                │    │
│  │                                                                      │    │
│  │  Random sampling for performance metrics:                            │    │
│  │  • 5% of attachment productions                                      │    │
│  │  • 5% of error events                                                │    │
│  │  • All critical operations                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Environment Variables

| Variable | Purpose | Values |
|----------|---------|--------|
| `CLAUDE_CODE_PROFILE_QUERY` | Enable query profiling | `1` to enable |
| `CLAUDE_CODE_PROFILE_STARTUP` | Enable startup profiling | `1` to enable |

---

## 2. Query Profiling System

### 2.1 Core Functions

```javascript
// ============================================
// Query Profiling Core Functions
// Location: chunks.148.mjs:240-386
// ============================================

// Global state
let isQueryProfilingEnabled = false;  // mi6
let memoryUsageMap = new Map();       // fp8 - maps checkpoint name to memory usage
let queryCounter = 0;                 // jKq - query number
let firstChunkTime = null;            // Gp8 - time of first chunk
let performanceInstance = null;       // Zp8 - Node.js performance object

// ============================================
// getPerformance (Tp8) - Get performance API
// Location: chunks.148.mjs:240-243
// ============================================

// ORIGINAL (for source lookup):
function Tp8() {
    if (!Zp8) Zp8 = x6("perf_hooks").performance;
    return Zp8
}

// READABLE (for understanding):
function getPerformance() {
    if (!performanceInstance) {
        performanceInstance = require("perf_hooks").performance;
    }
    return performanceInstance;
}

// Mapping: Tp8→getPerformance, Zp8→performanceInstance, x6→require

// ============================================
// resetQueryProfile (vp8) - Reset for new query
// Location: chunks.148.mjs:245-248
// ============================================

// ORIGINAL (for source lookup):
function vp8() {
    if (!mi6) return;
    Tp8().clearMarks(), fp8.clear(), Gp8 = null, jKq++, K5("query_user_input_received")
}

// READABLE (for understanding):
function resetQueryProfile() {
    if (!isQueryProfilingEnabled) return;

    getPerformance().clearMarks();  // Clear all performance marks
    memoryUsageMap.clear();          // Clear memory usage map
    firstChunkTime = null;           // Reset first chunk time
    queryCounter++;                  // Increment query counter

    // Mark start of query
    profileCheckpoint("query_user_input_received");
}

// Mapping: vp8→resetQueryProfile, mi6→isQueryProfilingEnabled, fp8→memoryUsageMap,
//          Gp8→firstChunkTime, jKq→queryCounter, K5→profileCheckpoint

// ============================================
// profileCheckpoint (K5) - Mark checkpoint
// Location: chunks.148.mjs:250-257
// ============================================

// ORIGINAL (for source lookup):
function K5(A) {
    if (!mi6) return;
    let q = Tp8();
    if (q.mark(A), fp8.set(A, process.memoryUsage()), A === "query_first_chunk_received" && Gp8 === null) {
        let K = q.getEntriesByType("mark");
        if (K.length > 0) Gp8 = K[K.length - 1]?.startTime ?? 0
    }
}

// READABLE (for understanding):
function profileCheckpoint(checkpointName) {
    if (!isQueryProfilingEnabled) return;

    let perf = getPerformance();

    // Create performance mark
    perf.mark(checkpointName);

    // Record memory usage at this checkpoint
    memoryUsageMap.set(checkpointName, process.memoryUsage());

    // Track first chunk time for TTFT calculation
    if (checkpointName === "query_first_chunk_received" && firstChunkTime === null) {
        let marks = perf.getEntriesByType("mark");
        if (marks.length > 0) {
            firstChunkTime = marks[marks.length - 1]?.startTime ?? 0;
        }
    }
}

// Mapping: K5→profileCheckpoint, A→checkpointName, q→perf, fp8→memoryUsageMap, Gp8→firstChunkTime
```

**Why this approach**:
- **Native performance API**: Uses Node.js `perf_hooks` for accurate timing
- **Memory tracking**: Captures memory at each checkpoint for leak detection
- **TTFT focus**: Special handling for first chunk time (critical UX metric)

### 2.2 Checkpoint Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUERY PROFILING CHECKPOINT FLOW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User submits message                                                        │
│         │                                                                    │
│         ▼                                                                    │
│  [query_user_input_received] ← Start of query                              │
│         │                                                                    │
│         ▼                                                                    │
│  [query_context_loading_start]                                               │
│         │                                                                    │
│         ▼                                                                    │
│  [query_context_loading_end]                                                 │
│         │                                                                    │
│         ▼                                                                    │
│  [query_microcompact_start] ──► [query_microcompact_end]                    │
│         │                                                                    │
│         ▼                                                                    │
│  [query_autocompact_start] ──► [query_autocompact_end]                      │
│         │                                                                    │
│         ▼                                                                    │
│  [query_setup_start]                                                         │
│         │                                                                    │
│         ▼                                                                    │
│  [query_setup_end]                                                           │
│         │                                                                    │
│         ▼                                                                    │
│  [query_tool_schema_build_start]                                             │
│         │                                                                    │
│         ▼                                                                    │
│  [query_tool_schema_build_end]                                               │
│         │                                                                    │
│         ▼                                                                    │
│  [query_message_normalization_start]                                         │
│         │                                                                    │
│         ▼                                                                    │
│  [query_message_normalization_end]                                           │
│         │                                                                    │
│         ▼                                                                    │
│  [query_client_creation_start]                                               │
│         │                                                                    │
│         ▼                                                                    │
│  [query_client_creation_end]                                                 │
│         │                                                                    │
│         ▼                                                                    │
│  [query_api_request_sent] ← Network latency starts                          │
│         │                                                                    │
│         ▼                                                                    │
│  [query_first_chunk_received] ← TTFT (Time To First Token)                  │
│         │                                                                    │
│         ▼                                                                    │
│  [query_tool_execution_start] ──► [query_tool_execution_end]                │
│         │                                                                    │
│         ▼                                                                    │
│  [query_profile_end] ← End of query                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Startup Profiling

### 3.1 Startup Profile Implementation

```javascript
// ============================================
// Startup Profiling
// Location: chunks.2.mjs:393-400, chunks.147.mjs:2868-2870
// ============================================

// READABLE (for understanding):
// In chunks.2.mjs
let isStartupProfilingEnv = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1";
let isRandomSampling = Math.random() < SAMPLING_RATE;
let isStartupProfilingEnabled = isStartupProfilingEnv || isRandomSampling;
let startupProfileData = [];

function startupCheckpoint(checkpointName) {
    if (!isStartupProfilingEnabled) return;

    startupProfileData.push({
        name: checkpointName,
        timestamp: Date.now(),
        memory: process.memoryUsage()
    });
}

// Checkpoint names used:
// - "cli_entry"
// - "cli_before_main_import"
// - "cli_after_main_import"
// - "cli_after_main_complete"
// - "cli_claude_in_chrome_mcp_path"
// - "cli_chrome_native_host_path"
// - "cli_bridge_path"
// - "cli_tmux_worktree_fast_path"
```

### 3.2 Startup Timing Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STARTUP TIMING BREAKDOWN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Process start                                                               │
│         │                                                                    │
│         ▼                                                                    │
│  [cli_entry]                                                                 │
│         │                                                                    │
│         │  (~5-10ms) Light initialization                                    │
│         ▼                                                                    │
│  [cli_before_main_import]                                                    │
│         │                                                                    │
│         │  (~100-400ms) HEAVY: Dynamic import of main module (~198 chunks)  │
│         ▼                                                                    │
│  [cli_after_main_import]                                                     │
│         │                                                                    │
│         │  (~50-200ms) Commander setup, state initialization                │
│         ▼                                                                    │
│  [cli_after_main_complete]                                                   │
│         │                                                                    │
│         │  (~50-100ms) React render, first paint                            │
│         ▼                                                                    │
│  Interactive UI ready                                                        │
│                                                                              │
│  TOTAL: ~200-700ms typical cold start                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Profiling Checkpoints

### 4.1 Checkpoint Categories

| Category | Checkpoints | Purpose |
|----------|-------------|---------|
| **CLI Entry** | `cli_entry`, `cli_before_main_import`, `cli_after_main_import`, `cli_after_main_complete` | Track startup performance |
| **Context** | `query_context_loading_start`, `query_context_loading_end` | Context loading time |
| **Compact** | `query_microcompact_start`, `query_microcompact_end`, `query_autocompact_start`, `query_autocompact_end` | Compaction overhead |
| **Setup** | `query_setup_start`, `query_setup_end` | General query setup |
| **Tools** | `query_tool_schema_build_start`, `query_tool_schema_build_end` | Tool schema building |
| **Messages** | `query_message_normalization_start`, `query_message_normalization_end` | Message processing |
| **Client** | `query_client_creation_start`, `query_client_creation_end` | API client creation |
| **Network** | `query_api_request_sent`, `query_first_chunk_received` | Network latency |
| **Execution** | `query_tool_execution_start`, `query_tool_execution_end` | Tool execution |

### 4.2 Checkpoint Placement in Code

```javascript
// ============================================
// Checkpoint Usage Example
// Location: chunks.171.mjs:12-54
// ============================================

// In streamingQueryCore
async function* streamingQueryCore(messages, systemPrompt, thinkingConfig, tools, context, options) {
    // Start profiling
    profileCheckpoint("query_tool_schema_build_start");

    // Build tool schemas
    let toolSchemas = await buildToolSchemas(tools, options);

    profileCheckpoint("query_tool_schema_build_end");

    // Track telemetry
    trackEvent("tengu_api_before_normalize", {
        preNormalizedMessageCount: messages.length
    });

    profileCheckpoint("query_message_normalization_start");

    // Normalize messages
    let normalizedMessages = normalizeMessages(messages, toolSchemas);

    profileCheckpoint("query_message_normalization_end");

    // ... continue with request ...

    profileCheckpoint("query_api_request_sent");

    // Stream response
    for await (let event of apiStream) {
        if (event.type === "content_block_start") {
            profileCheckpoint("query_first_chunk_received");
        }
        yield event;
    }

    // End profiling
    endQueryProfile();
}
```

---

## 5. Report Generation

### 5.1 Query Report Generator

```javascript
// ============================================
// generateQueryReport (BmY) - Report generator
// Location: chunks.148.mjs:282-315
// ============================================

// ORIGINAL (for source lookup):
function BmY() {
    if (!mi6) return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
    let q = Tp8().getEntriesByType("mark");
    if (q.length === 0) return "No query profiling checkpoints recorded";
    let K = [];
    K.push("=".repeat(80)), K.push(`QUERY PROFILING REPORT - Query #${jKq}`), K.push("=".repeat(80)), K.push("");
    let Y = q[0]?.startTime ?? 0,
        z = Y,
        _ = 0,
        w = 0;
    for (let H of q) {
        let j = H.startTime - Y,
            J = Y16(j),
            M = H.startTime - z,
            D = Y16(M),
            X = fp8.get(H.name),
            P = mmY(M, H.name),
            W = X ? ` | RSS: ${HKq(X.rss)}MB, Heap: ${HKq(X.heapUsed)}MB` : "";
        if (K.push(`[+${J.padStart(10)}ms] (+${D.padStart(9)}ms) ${H.name}${P}${W}`), H.name === "query_api_request_sent") _ = j;
        if (H.name === "query_first_chunk_received") w = j;
        z = H.startTime
    }
    let O = q[q.length - 1],
        $ = O ? O.startTime - Y : 0;
    if (K.push(""), K.push("-".repeat(80)), w > 0) {
        let H = _,
            j = w - _,
            J = (H / w * 100).toFixed(1),
            M = (j / w * 100).toFixed(1);
        K.push(`Total TTFT: ${Y16(w)}ms`), K.push(`  - Pre-request overhead: ${Y16(H)}ms (${J}%)`), K.push(`  - Network latency: ${Y16(j)}ms (${M}%)`)
    } else K.push(`Total time: ${Y16($)}ms`);
    return K.push(gmY(q, Y)), K.push("=".repeat(80)), K.join(`
`)
}

// READABLE (for understanding):
function generateQueryReport() {
    if (!isQueryProfilingEnabled) {
        return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
    }

    let marks = getPerformance().getEntriesByType("mark");
    if (marks.length === 0) {
        return "No query profiling checkpoints recorded";
    }

    let lines = [];

    // Header
    lines.push("=".repeat(80));
    lines.push(`QUERY PROFILING REPORT - Query #${queryCounter}`);
    lines.push("=".repeat(80));
    lines.push("");

    let startTime = marks[0]?.startTime ?? 0;
    let lastTime = startTime;
    let apiRequestTime = 0;
    let firstChunkTime = 0;

    // Process each checkpoint
    for (let mark of marks) {
        let elapsedSinceStart = mark.startTime - startTime;
        let elapsedSinceLast = mark.startTime - lastTime;

        let memUsage = memoryUsageMap.get(mark.name);
        let warning = getPerformanceWarning(elapsedSinceLast, mark.name);
        let memInfo = memUsage
            ? ` | RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)}MB, Heap: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`
            : "";

        lines.push(
            `[+${elapsedSinceStart.toFixed(3).padStart(10)}ms] ` +
            `(+${elapsedSinceLast.toFixed(3).padStart(9)}ms) ` +
            `${mark.name}${warning}${memInfo}`
        );

        // Track key times
        if (mark.name === "query_api_request_sent") apiRequestTime = elapsedSinceStart;
        if (mark.name === "query_first_chunk_received") firstChunkTime = elapsedSinceStart;

        lastTime = mark.startTime;
    }

    // Summary
    lines.push("");
    lines.push("-".repeat(80));

    if (firstChunkTime > 0) {
        let preRequestOverhead = apiRequestTime;
        let networkLatency = firstChunkTime - apiRequestTime;
        let preRequestPercent = ((preRequestOverhead / firstChunkTime) * 100).toFixed(1);
        let networkPercent = ((networkLatency / firstChunkTime) * 100).toFixed(1);

        lines.push(`Total TTFT: ${firstChunkTime.toFixed(3)}ms`);
        lines.push(`  - Pre-request overhead: ${preRequestOverhead.toFixed(3)}ms (${preRequestPercent}%)`);
        lines.push(`  - Network latency: ${networkLatency.toFixed(3)}ms (${networkPercent}%)`);
    } else {
        let totalTime = marks[marks.length - 1]?.startTime - startTime ?? 0;
        lines.push(`Total time: ${totalTime.toFixed(3)}ms`);
    }

    // Phase breakdown
    lines.push(generatePhaseBreakdown(marks, startTime));

    lines.push("=".repeat(80));

    return lines.join("\n");
}

// Mapping: BmY→generateQueryReport, mi6→isQueryProfilingEnabled, q→marks,
//          K→lines, Y→startTime, z→lastTime, _→apiRequestTime, w→firstChunkTime,
//          Y16→formatMs, HKq→formatMB, mmY→getPerformanceWarning, gmY→generatePhaseBreakdown
```

### 5.2 Phase Breakdown Generator

```javascript
// ============================================
// generatePhaseBreakdown (gmY) - Visual breakdown
// Location: chunks.148.mjs:317-370
// ============================================

// READABLE (for understanding):
function generatePhaseBreakdown(marks, startTime) {
    let phases = [
        { name: "Context loading", start: "query_context_loading_start", end: "query_context_loading_end" },
        { name: "Microcompact", start: "query_microcompact_start", end: "query_microcompact_end" },
        { name: "Autocompact", start: "query_autocompact_start", end: "query_autocompact_end" },
        { name: "Query setup", start: "query_setup_start", end: "query_setup_end" },
        { name: "Tool schemas", start: "query_tool_schema_build_start", end: "query_tool_schema_build_end" },
        { name: "Message normalization", start: "query_message_normalization_start", end: "query_message_normalization_end" },
        { name: "Client creation", start: "query_client_creation_start", end: "query_client_creation_end" },
        { name: "Network TTFB", start: "query_api_request_sent", end: "query_first_chunk_received" },
        { name: "Tool execution", start: "query_tool_execution_start", end: "query_tool_execution_end" }
    ];

    let markTimes = new Map(marks.map(m => [m.name, m.startTime - startTime]));
    let lines = [];

    lines.push("");
    lines.push("PHASE BREAKDOWN:");

    for (let phase of phases) {
        let start = markTimes.get(phase.start);
        let end = markTimes.get(phase.end);

        if (start !== undefined && end !== undefined) {
            let duration = end - start;
            // Visual bar (each █ = 10ms, max 50 chars)
            let bar = "█".repeat(Math.min(Math.ceil(duration / 10), 50));

            lines.push(`  ${phase.name.padEnd(22)} ${duration.toFixed(3).padStart(10)}ms ${bar}`);
        }
    }

    // Total pre-API overhead
    let apiRequestTime = markTimes.get("query_api_request_sent");
    if (apiRequestTime !== undefined) {
        lines.push("");
        lines.push(`  ${"Total pre-API overhead".padEnd(22)} ${apiRequestTime.toFixed(3).padStart(10)}ms`);
    }

    return lines.join("\n");
}

// Mapping: gmY→generatePhaseBreakdown, K→phases, Y→markTimes, z→lines
```

### 5.3 Sample Report Output

```
================================================================================
QUERY PROFILING REPORT - Query #1
================================================================================

[+     0.000ms] (+     0.000ms) query_user_input_received
[+    12.345ms] (+    12.345ms) query_context_loading_start
[+    45.678ms] (+    33.333ms) query_context_loading_end | RSS: 156.23MB, Heap: 89.45MB
[+    46.123ms] (+     0.445ms) query_microcompact_start
[+    46.234ms] (+     0.111ms) query_microcompact_end
[+    46.567ms] (+     0.333ms) query_autocompact_start
[+    46.789ms] (+     0.222ms) query_autocompact_end
[+    47.123ms] (+     0.334ms) query_setup_start
[+    52.456ms] (+     5.333ms) query_setup_end
[+    52.789ms] (+     0.333ms) query_tool_schema_build_start
[+    78.901ms] (+    26.112ms) query_tool_schema_build_end ⚠️  SLOW
[+    79.234ms] (+     0.333ms) query_message_normalization_start
[+    82.567ms] (+     3.333ms) query_message_normalization_end
[+    82.901ms] (+     0.334ms) query_client_creation_start
[+    89.234ms] (+     6.333ms) query_client_creation_end
[+    89.567ms] (+     0.333ms) query_api_request_sent
[+   245.678ms] (+   156.111ms) query_first_chunk_received
[+   456.789ms] (+   211.111ms) query_tool_execution_start
[+   512.345ms] (+    55.556ms) query_tool_execution_end
[+   513.456ms] (+     1.111ms) query_profile_end

--------------------------------------------------------------------------------
Total TTFT: 245.678ms
  - Pre-request overhead: 89.567ms (36.4%)
  - Network latency: 156.111ms (63.6%)

PHASE BREAKDOWN:
  Context loading          33.333ms ███
  Microcompact              0.111ms
  Autocompact               0.222ms
  Query setup               5.333ms
  Tool schemas             26.112ms ███
  Message normalization     3.333ms
  Client creation           6.333ms
  Network TTFB            156.111ms ████████████████
  Tool execution           55.556ms ██████

  Total pre-API overhead   89.567ms
================================================================================
```

---

## 6. Performance Warnings

### 6.1 Warning Thresholds

```javascript
// ============================================
// getPerformanceWarning (mmY) - Warning generator
// Location: chunks.148.mjs:272-280
// ============================================

// ORIGINAL (for source lookup):
function mmY(A, q) {
    if (q === "query_user_input_received") return "";
    if (A > 1000) return " ⚠️  VERY SLOW";
    if (A > 100) return " ⚠️  SLOW";
    if (q.includes("git_status") && A > 50) return " ⚠️  git status";
    if (q.includes("tool_schema") && A > 50) return " ⚠️  tool schemas";
    if (q.includes("client_creation") && A > 50) return " ⚠️  client creation";
    return ""
}

// READABLE (for understanding):
function getPerformanceWarning(durationMs, checkpointName) {
    // No warning for initial checkpoint
    if (checkpointName === "query_user_input_received") {
        return "";
    }

    // Critical: Over 1 second
    if (durationMs > 1000) {
        return " ⚠️  VERY SLOW";
    }

    // Warning: Over 100ms
    if (durationMs > 100) {
        return " ⚠️  SLOW";
    }

    // Specific warnings for known slow operations
    if (checkpointName.includes("git_status") && durationMs > 50) {
        return " ⚠️  git status";
    }

    if (checkpointName.includes("tool_schema") && durationMs > 50) {
        return " ⚠️  tool schemas";
    }

    if (checkpointName.includes("client_creation") && durationMs > 50) {
        return " ⚠️  client creation";
    }

    return "";
}

// Mapping: mmY→getPerformanceWarning, A→durationMs, q→checkpointName
```

### 6.2 Warning Threshold Summary

| Threshold | Warning | Trigger Condition |
|-----------|---------|-------------------|
| > 1000ms | `⚠️ VERY SLOW` | Any operation over 1 second |
| > 100ms | `⚠️ SLOW` | Any operation over 100ms |
| > 50ms | `⚠️ git status` | Git status specific |
| > 50ms | `⚠️ tool schemas` | Tool schema building specific |
| > 50ms | `⚠️ client creation` | API client creation specific |

### 6.3 Performance Optimization Tips

Based on profiling data, common optimizations include:

| Slow Operation | Cause | Optimization |
|----------------|-------|--------------|
| Tool schema build | Large tool set | Deferred tool loading |
| Git status | Large repository | Use sparse checkout |
| Context loading | Many messages | Enable auto-compact |
| Client creation | First request | Connection pooling |
| Message normalization | Complex messages | Cache normalization |

---

## Summary

The performance profiling system provides:

1. **Query Profiling**: Detailed timing for each phase of LLM request
2. **Startup Profiling**: Track cold start performance
3. **Memory Tracking**: RSS and heap usage at each checkpoint
4. **Visual Reports**: ASCII bar charts for phase breakdown
5. **Performance Warnings**: Automatic detection of slow operations

Key design decisions:
- **Native performance API**: Uses Node.js `perf_hooks` for accuracy
- **Memory integration**: Tracks memory alongside timing
- **TTFT focus**: Time To First Token is the critical UX metric
- **Visual feedback**: Bar charts make performance issues obvious

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All profiling functions documented with source verification