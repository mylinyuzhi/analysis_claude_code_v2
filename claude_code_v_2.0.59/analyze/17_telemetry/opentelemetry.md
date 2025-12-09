# Telemetry and Observability

## Overview

Claude Code v2.0.59 implements a comprehensive, multi-destination telemetry system using:

- **OpenTelemetry** for distributed tracing, metrics, and structured logging
- **Sentry** for error tracking and crash reporting
- **Datadog** for production event monitoring (feature-gated)
- **Segment** for analytics (feature-gated)
- **BigQuery** for Anthropic internal metrics
- **Grove System** for user privacy consent management

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Telemetry module symbols

Key functions in this document:
- `analyticsEvent` (GA) - Synchronous event logging
- `analyticsEventAsync` (eu) - Asynchronous event logging
- `errorLog` (AA) - Sentry error reporting
- `telemetryMarker` (M9) - Performance checkpoint marking
- `attachTelemetryProvider` (Hz0) - Provider initialization
- `initializeOpenTelemetry` (XO2) - Master OTEL initialization
- `logStructuredEvent` (HO) - OTEL structured log events
- `logEventSync` (hg3) - Multi-destination sync routing
- `sendToDatadog` ($D0) - Datadog batched sending
- `BigQueryMetricsExporter` (W80) - Custom OTEL metrics exporter
- `shouldShowGroveNotice` (zD9) - Privacy notice display logic

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Claude Code Application                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ GA()         │  │ eu()         │  │ AA()         │  │ M9()        │  │
│  │ analyticsEvt │  │ asyncEvent   │  │ errorLog     │  │ perfMarker  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                 │                 │                  │         │
│         └────────┬────────┴────────┬────────┘                  │         │
│                  ▼                 │                           │         │
│  ┌───────────────────────────────┐ │    ┌──────────────────────┴──────┐  │
│  │ Hz0 (attachTelemetryProvider) │ │    │ Performance API (perf_hooks)│  │
│  │ - Queue pending events        │ │    │ - Mark checkpoints          │  │
│  │ - Attach provider             │ │    │ - Track memory usage        │  │
│  │ - Flush on connect            │ │    └─────────────────────────────┘  │
│  └───────────────┬───────────────┘ │                                     │
│                  ▼                 │                                     │
│  ┌───────────────────────────────┐ │                                     │
│  │ hg3/gg3 (logEventSync/Async)  │◄┘                                     │
│  │ - Sample rate filtering       │                                       │
│  │ - Multi-destination routing   │                                       │
│  └───────────────┬───────────────┘                                       │
│                  │                                                        │
│    ┌─────────────┼─────────────┬─────────────┬─────────────┐             │
│    ▼             ▼             ▼             ▼             ▼             │
│ ┌──────┐    ┌──────┐    ┌──────────┐   ┌──────────┐  ┌──────────┐       │
│ │Sentry│    │Local │    │ Segment  │   │ Datadog  │  │ BigQuery │       │
│ │      │    │ Log  │    │(gated)   │   │ (gated)  │  │ (OTEL)   │       │
│ └──────┘    └──────┘    └──────────┘   └──────────┘  └──────────┘       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Core Telemetry Functions

### 1.1 GA (analyticsEvent) - Synchronous Event Logging

```javascript
// ============================================
// analyticsEvent - Log analytics event synchronously (queue if provider not ready)
// Location: chunks.1.mjs:2997-3007
// ============================================

// ORIGINAL (for source lookup):
function GA(A, Q) {
  if (tu === null) {
    NFA.push({
      eventName: A,
      metadata: Q,
      async: !1
    });
    return
  }
  tu.logEvent(A, Q)
}

// READABLE (for understanding):
function analyticsEvent(eventName, metadata) {
  if (telemetryProvider === null) {
    // Queue event if provider not yet attached
    pendingEventQueue.push({
      eventName: eventName,
      metadata: metadata,
      async: false
    });
    return;
  }
  telemetryProvider.logEvent(eventName, metadata);
}

// Mapping: GA→analyticsEvent, A→eventName, Q→metadata, tu→telemetryProvider, NFA→pendingEventQueue
```

**What it does:** Logs telemetry events synchronously, with automatic queue buffering before provider is ready.

**How it works:**
1. Checks if telemetry provider (`tu`) is attached
2. If null, pushes event to `NFA` (pending queue) with `async: false` flag
3. If attached, calls `logEvent()` on the provider immediately

**Why this approach:**
- **Queue buffering** ensures no events are lost during startup before provider initializes
- **Synchronous by default** for predictable ordering and simpler call sites
- **Minimal overhead** - just a null check and function call

**Key insight:** The queuing mechanism is critical because many telemetry events fire during early startup (before OpenTelemetry is initialized).

---

### 1.2 eu (analyticsEventAsync) - Asynchronous Event Logging

```javascript
// ============================================
// analyticsEventAsync - Log analytics event asynchronously
// Location: chunks.1.mjs:3009-3019
// ============================================

// ORIGINAL (for source lookup):
async function eu(A, Q) {
  if (tu === null) {
    NFA.push({
      eventName: A,
      metadata: Q,
      async: !0
    });
    return
  }
  await tu.logEventAsync(A, Q)
}

// READABLE (for understanding):
async function analyticsEventAsync(eventName, metadata) {
  if (telemetryProvider === null) {
    pendingEventQueue.push({
      eventName: eventName,
      metadata: metadata,
      async: true  // Mark as async for proper replay
    });
    return;
  }
  await telemetryProvider.logEventAsync(eventName, metadata);
}

// Mapping: eu→analyticsEventAsync, A→eventName, Q→metadata, async:!0→async:true
```

**What it does:** Async variant for events that need to await network completion.

**Why async variant exists:**
- Some events require confirmation of delivery (e.g., session end events)
- Allows proper error handling via try/catch at call site
- The `async: true` flag ensures queued events are replayed with await

---

### 1.3 Hz0 (attachTelemetryProvider) - Provider Initialization

```javascript
// ============================================
// attachTelemetryProvider - Wire up analytics provider and flush queued events
// Location: chunks.1.mjs:2985-2995
// ============================================

// ORIGINAL (for source lookup):
function Hz0(A) {
  if (tu !== null) throw Error("Analytics sink already attached - cannot attach more than once");
  if (tu = A, NFA.length > 0) {
    let Q = [...NFA];
    NFA.length = 0, queueMicrotask(() => {
      for (let B of Q)
        if (B.async) tu.logEventAsync(B.eventName, B.metadata);
        else tu.logEvent(B.eventName, B.metadata)
    })
  }
}

// READABLE (for understanding):
function attachTelemetryProvider(provider) {
  // Enforce single-attachment pattern
  if (telemetryProvider !== null) {
    throw Error("Analytics sink already attached - cannot attach more than once");
  }

  telemetryProvider = provider;

  // Flush any queued events
  if (pendingEventQueue.length > 0) {
    let queuedEvents = [...pendingEventQueue];  // Clone to avoid mutation issues
    pendingEventQueue.length = 0;               // Clear original queue

    // Replay events in next microtask (non-blocking)
    queueMicrotask(() => {
      for (let event of queuedEvents) {
        if (event.async) {
          telemetryProvider.logEventAsync(event.eventName, event.metadata);
        } else {
          telemetryProvider.logEvent(event.eventName, event.metadata);
        }
      }
    });
  }
}

// Mapping: Hz0→attachTelemetryProvider, A→provider, Q→queuedEvents, B→event
```

**What it does:** Attaches the telemetry provider and replays any queued events.

**How it works:**
1. **Single-attachment enforcement** - throws if called twice (prevents duplicate events)
2. **Clone and clear queue** - prevents race conditions during replay
3. **Microtask replay** - uses `queueMicrotask()` for non-blocking flush
4. **Respects async flag** - replays sync vs async events correctly

**Why this approach:**
- **Clone before clear** prevents events added during replay from being lost
- **queueMicrotask** ensures flush doesn't block startup-critical path
- **Async flag preservation** maintains proper await semantics

---

### 1.4 M9 (telemetryMarker) - Performance Checkpoint Marking

```javascript
// ============================================
// telemetryMarker - Record performance checkpoint with optional memory tracking
// Location: chunks.1.mjs:3034-3037
// ============================================

// ORIGINAL (for source lookup):
function M9(A) {
  if (!Uz0) return;
  if (gX1().mark(A), RkA) $z0.set(A, process.memoryUsage())
}

// READABLE (for understanding):
function telemetryMarker(checkpointName) {
  // Skip if startup profiling is disabled
  if (!enableStartupProfiling) return;

  // Record performance mark using Node.js perf_hooks
  getPerformanceApi().mark(checkpointName);

  // Optionally capture memory usage at this checkpoint
  if (captureMemoryMetrics) {
    memoryUsageMap.set(checkpointName, process.memoryUsage());
  }
}

// Mapping: M9→telemetryMarker, A→checkpointName, Uz0→enableStartupProfiling,
// gX1→getPerformanceApi, RkA→captureMemoryMetrics, $z0→memoryUsageMap
```

**What it does:** Records performance checkpoints using Node.js `perf_hooks` API.

**Checkpoint Names Used:**

| Checkpoint | When Called | Purpose |
|------------|-------------|---------|
| `telemetry_init_start` | XO2 start | OpenTelemetry initialization begins |
| `run_function_start` | hu3() starts | Main run function begins |
| `run_commander_initialized` | Commander created | CLI parser ready |
| `preAction_start` | Pre-action hook | Before command processing |
| `preAction_after_init` | After init | Configuration loaded |
| `preAction_after_migrations` | After migrations | Database migrations complete |
| `action_handler_start` | Main action | Command handler executing |
| `action_mcp_configs_loaded` | MCP loaded | MCP servers configured |
| `action_tools_loaded` | Tools loaded | Tool definitions ready |
| `action_before_setup` | Pre-setup | Before UI setup |
| `action_after_setup` | Post-setup | UI ready |
| `action_commands_loaded` | Commands loaded | Slash commands ready |
| `action_after_plugins_init` | Plugins init | Plugins initialized |
| `action_after_hooks` | Hooks done | Lifecycle hooks complete |
| `run_before_parse` | Pre-parse | Before CLI parsing |
| `run_after_parse` | Post-parse | CLI parsed |
| `main_after_run` | Post-run | Main execution complete |
| `cli_version_fast_path` | Version check | Version flag fast path |
| `cli_before_main_import` | Pre-import | Before loading main module |
| `cli_after_main_import` | Post-import | Main module loaded |
| `cli_after_main_complete` | Complete | CLI fully initialized |
| `cli_ripgrep_path` | Ripgrep mode | Ripgrep-specific path |

**Why this approach:**
- **Conditional execution** via `Uz0` flag (controlled by `CLAUDE_CODE_PROFILE_STARTUP` env var)
- **Uses Node.js native perf_hooks** for accurate timing
- **Memory tracking** helps identify memory-heavy operations

---

### 1.5 AA (errorLog) - Error Reporting

```javascript
// ============================================
// errorLog - Send error to Sentry and in-memory error log
// Location: chunks.1.mjs:3738-3752
// ============================================

// ORIGINAL (for source lookup):
function AA(A) {
  try {
    if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) ||
        Y0(process.env.CLAUDE_CODE_USE_VERTEX) ||
        Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) ||
        process.env.DISABLE_ERROR_REPORTING ||
        process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let Q = A.stack || A.message,
      B = {
        error: Q,
        timestamp: new Date().toISOString()
      };
    g(`${A.name}: ${Q}`, { level: "error" }),
    Az0(B),
    IP9(ZP9(), { error: Q })
  } catch {}
}

// READABLE (for understanding):
function errorLog(error) {
  try {
    // Skip error reporting for enterprise/alternative backends
    if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK) ||
        parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX) ||
        parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY) ||
        process.env.DISABLE_ERROR_REPORTING ||
        process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) {
      return;
    }

    let errorMessage = error.stack || error.message;
    let errorContext = {
      error: errorMessage,
      timestamp: new Date().toISOString()
    };

    // Log locally
    logMessage(`${error.name}: ${errorMessage}`, { level: "error" });

    // Add to in-memory circular buffer (max 100 errors)
    addToInMemoryErrorLog(errorContext);

    // Send to Sentry
    sendToSentry(getSentryErrorPath(), { error: errorMessage });
  } catch {
    // Fail silently to prevent recursive errors
  }
}

// Mapping: AA→errorLog, A→error, Q→errorMessage, B→errorContext,
// Y0→parseBoolean, g→logMessage, Az0→addToInMemoryErrorLog,
// IP9→sendToSentry, ZP9→getSentryErrorPath
```

**What it does:** Reports errors to Sentry with in-memory buffering.

**How it works:**
1. **Check disable conditions** - respects enterprise configs and user opt-out
2. **Extract error details** - prefers stack trace, falls back to message
3. **Log locally** - for debugging visibility
4. **Buffer in-memory** - circular buffer of 100 most recent errors
5. **Send to Sentry** - external error tracking

**Why this approach:**
- **Silent failure** in outer try/catch prevents error loops
- **Multiple disable mechanisms** for enterprise flexibility
- **In-memory buffer** allows diagnostic export without network

---

## 2. Multi-Destination Event Routing

### 2.1 Event Flow Through hg3/gg3

```javascript
// ============================================
// logEventSync - Multi-destination synchronous event routing
// Location: chunks.156.mjs:2014-2024
// ============================================

// ORIGINAL (for source lookup):
function hg3(A, Q) {
  let B = Qh1(A);
  if (B === 0) return;
  let G = B !== null ? { ...Q, sample_rate: B } : Q;
  if (SCB(A, G), n$9()) TW0(A, G);
  if (a$9()) $D0(A, G);
  Gh1(A, G)
}

// READABLE (for understanding):
function logEventSync(eventName, metadata) {
  // Check sample rate (0 = skip, null = no sampling)
  let sampleRate = getSampleRate(eventName);
  if (sampleRate === 0) return;  // Sampled out

  // Attach sample rate to metadata if applicable
  let eventData = sampleRate !== null
    ? { ...metadata, sample_rate: sampleRate }
    : metadata;

  // Always send to Sentry/local
  logToSentry(eventName, eventData);

  // Send to Segment if feature gate enabled
  if (isSegmentEnabled()) {
    sendToSegment(eventName, eventData);
  }

  // Send to Datadog if feature gate enabled
  if (isDatadogEnabled()) {
    sendToDatadog(eventName, eventData);
  }

  // Log locally
  logLocal(eventName, eventData);
}

// Mapping: hg3→logEventSync, A→eventName, Q→metadata, B→sampleRate,
// Qh1→getSampleRate, SCB→logToSentry, n$9→isSegmentEnabled,
// TW0→sendToSegment, a$9→isDatadogEnabled, $D0→sendToDatadog, Gh1→logLocal
```

**What it does:** Routes events to multiple telemetry destinations based on feature gates.

**Routing Logic:**
1. **Sample rate check** - some events are sampled (e.g., 5% of `tengu_attachment_compute_duration`)
2. **Sentry** - always receives events (primary destination)
3. **Segment** - receives if `tengu_log_segment_events` Statsig gate is enabled
4. **Datadog** - receives if `tengu_log_datadog_events` Statsig gate is enabled
5. **Local** - always logs locally for debugging

**Why multi-destination:**
- **Segment** for product analytics and user behavior
- **Datadog** for production monitoring and alerting
- **Sentry** for error context and debugging
- **Feature gates** allow gradual rollout and cost control

---

### 2.2 Datadog Integration ($D0)

```javascript
// ============================================
// sendToDatadog - Send event to Datadog with batching
// Location: chunks.156.mjs:1909-1952
// ============================================

// ORIGINAL (for source lookup):
async function $D0(A, Q) {
  if (!await fg3() || !xg3.has(A)) return;
  try {
    let G = await lc({ model: Q.model }), { envContext: Z, ...I } = G,
      Y = { ...I, ...Z, ...Q };
    if (typeof Y.toolName === "string" && Y.toolName.startsWith("mcp__")) Y.toolName = "mcp";
    if (typeof Y.model === "string" && !Y.model.startsWith("claude-")) Y.model = "other";
    if (typeof Y.version === "string") Y.version = Y.version.replace(/^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/, "$1");
    if (Y.status !== void 0 && Y.status !== null) {
      let V = String(Y.status); Y.http_status = V;
      let F = V.charAt(0); if (F >= "1" && F <= "5") Y.http_status_range = `${F}xx`;
      delete Y.status
    }
    let J = Y, X = { ddsource: "nodejs", ddtags: vg3.filter((V) => J[V] !== void 0 && J[V] !== null).map((V) => `${c$9(V)}:${J[V]}`).join(","),
      message: A, service: "claude-code", hostname: "claude-code", env: "external" };
    for (let [V, F] of Object.entries(Y)) if (F !== void 0 && F !== null) X[c$9(V)] = F;
    if (iSA.push(X), iSA.length >= kg3) { if (Iu) clearTimeout(Iu), Iu = null; await UD0() }
    else bg3()
  } catch (G) { AA(G instanceof Error ? G : Error(String(G))) }
}

// READABLE (for understanding):
async function sendToDatadog(eventName, metadata) {
  // Check feature gate and event whitelist
  if (!await isDatadogEnabled() || !isTrackedEvent(eventName)) {
    return;
  }

  // Get environment context
  let envContext = await getEnvironmentContext({ model: metadata.model });
  let mergedData = { ...envContext, ...metadata };

  // Normalize sensitive data
  if (mergedData.toolName?.startsWith("mcp__")) {
    mergedData.toolName = "mcp";  // Anonymize MCP tool names
  }
  if (!mergedData.model?.startsWith("claude-")) {
    mergedData.model = "other";   // Anonymize custom models
  }

  // Format version (strip build hash)
  if (typeof mergedData.version === "string") {
    mergedData.version = mergedData.version.replace(
      /^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/,
      "$1"
    );
  }

  // Convert HTTP status to range (5xx, 4xx, etc)
  if (mergedData.status !== undefined) {
    let statusStr = String(mergedData.status);
    mergedData.http_status = statusStr;
    mergedData.http_status_range = `${statusStr.charAt(0)}xx`;
    delete mergedData.status;
  }

  // Build Datadog log entry
  let datadogEntry = {
    ddsource: "nodejs",
    ddtags: buildDdTags(mergedData),
    message: eventName,
    service: "claude-code",
    hostname: "claude-code",
    env: "external",
    ...mergedData
  };

  // Add to batch buffer
  datadogBuffer.push(datadogEntry);

  // Flush if batch full (100 events) or schedule delayed flush
  if (datadogBuffer.length >= DATADOG_BATCH_SIZE) {
    await flushDatadogBuffer();
  } else {
    scheduleFlush();  // 15 second delay
  }
}

// Mapping: $D0→sendToDatadog, A→eventName, Q→metadata, fg3→isDatadogEnabled,
// xg3→trackedEventSet, lc→getEnvironmentContext, Y→mergedData, iSA→datadogBuffer,
// kg3→DATADOG_BATCH_SIZE, UD0→flushDatadogBuffer, bg3→scheduleFlush, vg3→DATADOG_TAGS,
// c$9→convertToSnakeCase, AA→errorLog
```

**What it does:** Sends telemetry events to Datadog with batching and data normalization.

**How it works:**
1. **Gate check** - verifies Datadog feature gate enabled AND event in whitelist
2. **Context enrichment** - merges environment context (model, version, OS) with event metadata
3. **Data normalization**:
   - Anonymizes MCP tool names (`mcp__*` → `mcp`)
   - Anonymizes non-Claude models (`*` → `other`)
   - Strips build hashes from version strings
   - Converts HTTP status to status range (`500` → `5xx`)
4. **Builds log entry** - formats for Datadog Logs API with tags, service, hostname
5. **Batch buffering** - adds to buffer, flushes when full (100) or schedules delayed flush (15s)

**Why this approach:**
- **Data anonymization** protects privacy and reduces cardinality for analytics
- **Batching** reduces network overhead and API costs
- **Delayed flush** balances latency vs efficiency
- **Event whitelist** limits what goes to Datadog (cost control)

**Key insight:** The version regex strips development build metadata (`-dev.YYYYMMDD.tXXXX.shaXXXX`) to keep only the semantic version, preventing high-cardinality explosion in Datadog tags.

**Datadog Configuration:**

| Constant | Value | Purpose |
|----------|-------|---------|
| `DATADOG_ENDPOINT` | `https://http-intake.logs.datadoghq.com/api/v2/logs` | API endpoint |
| `DATADOG_BATCH_SIZE` | 100 | Events before immediate flush |
| `DATADOG_FLUSH_INTERVAL` | 15000ms | Max delay before flush |

**Tracked Events (whitelist):**
- `tengu_api_error`
- `tengu_api_success`
- `tengu_compact_failed`
- `tengu_model_fallback_triggered`
- `tengu_oauth_*`
- `tengu_query_error`
- `tengu_tool_use_*`

---

### 2.3 HO (logStructuredEvent) - OpenTelemetry Log Events

```javascript
// ============================================
// logStructuredEvent - Emit structured telemetry event via OTEL LoggerProvider
// Location: chunks.121.mjs:887-901
// ============================================

// ORIGINAL (for source lookup):
async function HO(A, Q = {}) {
  let B = uE0();
  if (!B) return;
  let G = {
    ...kJA(),
    "event.name": A,
    "event.timestamp": new Date().toISOString()
  };
  for (let [Z, I] of Object.entries(Q))
    if (I !== void 0) G[Z] = I;
  B.emit({
    body: `claude_code.${A}`,
    attributes: G
  })
}

// READABLE (for understanding):
async function logStructuredEvent(eventName, metadata = {}) {
  let eventLogger = getEventLogger();
  if (!eventLogger) return;  // Skip if OTEL not initialized

  // Build attributes with common context
  let attributes = {
    ...getCommonAttributes(),
    "event.name": eventName,
    "event.timestamp": new Date().toISOString()
  };

  // Add custom metadata (skip undefined values)
  for (let [key, value] of Object.entries(metadata)) {
    if (value !== undefined) {
      attributes[key] = value;
    }
  }

  // Emit log record via OTEL
  eventLogger.emit({
    body: `claude_code.${eventName}`,
    attributes: attributes
  });
}

// Mapping: HO→logStructuredEvent, A→eventName, Q→metadata, B→eventLogger,
// uE0→getEventLogger, kJA→getCommonAttributes, G→attributes
```

**What it does:** Emits structured telemetry events through the OpenTelemetry LoggerProvider.

**How it works:**
1. **Get logger** - retrieves the event logger instance (set during OTEL init)
2. **Guard clause** - returns early if OTEL not initialized
3. **Build attributes** - starts with common attributes (session info, etc.)
4. **Add event context** - includes event name and ISO timestamp
5. **Merge metadata** - adds custom properties, filtering out undefined values
6. **Emit log** - sends to OTEL LoggerProvider with prefixed body

**Why this approach:**
- **Common attributes** ensures consistent context across all events
- **Undefined filtering** prevents null/undefined from polluting logs
- **Body prefix** (`claude_code.`) provides namespace for filtering in backends
- **ISO timestamp** ensures consistent, parseable time format

**Key insight:** This function is the bridge between the GA/eu analytics events and OpenTelemetry's structured logging. It's called for events that need OTEL-specific handling (like `user_prompt` events) rather than just Segment/Datadog routing.

---

## 3. OpenTelemetry Integration

### 3.1 XO2 (initializeOpenTelemetry) - Master Initialization

```javascript
// ============================================
// initializeOpenTelemetry - Initialize OTEL metrics, logs, traces
// Location: chunks.118.mjs:559-664
// ============================================

// ORIGINAL (for source lookup):
function XO2() {
  M9("telemetry_init_start");
  ev5();
  L_.diag.setLogger(new Wb5.DiagConsoleLogger, { logLevel: L_.DiagLogLevel.ERROR, suppressOverrideMessage: !0 });
  let A = new uv5.Resource({ [kv5.SEMRESATTRS_SERVICE_NAME]: "claude-code", [kv5.SEMRESATTRS_SERVICE_VERSION]: f1A, "os.type": process.platform, "host.arch": process.arch, "wsl.version": ov5() || void 0 }),
    Q = Yb5(), B = Kb5(), G = Fb5();
  let Z = new av5.MeterProvider({ resource: A, readers: Q ? [new av5.PeriodicExportingMetricReader({ exporter: Q, exportIntervalMillis: process.env.OTEL_METRIC_EXPORT_INTERVAL ? parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL, 10) : 60000 })] : [] });
  cE0(Z);
  let I = new Jb5.LoggerProvider({ resource: A });
  B && I.addLogRecordProcessor(new Jb5.BatchLogRecordProcessor(B, { scheduledDelayMillis: process.env.OTEL_LOGS_EXPORT_INTERVAL ? parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL, 10) : 5000 }));
  gE0(I), mE0(I.getLogger("claude-code"));
  if (process.env.ENABLE_ENHANCED_TELEMETRY_BETA && G) {
    let Y = new Wb5.NodeTracerProvider({ resource: A });
    Y.addSpanProcessor(new Wb5.BatchSpanProcessor(G, { scheduledDelayMillis: process.env.OTEL_TRACES_EXPORT_INTERVAL ? parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL, 10) : 5000 }));
    pE0(Y)
  }
  if (Zb5()) Gb5();
  process.on("SIGINT", Nb5), process.on("SIGTERM", Nb5);
  return Z.getMeter("claude-code")
}

// READABLE (for understanding):
function initializeOpenTelemetry() {
  telemetryMarker("telemetry_init_start");

  // Configure OTEL headers from environment
  configureOtelHeaders();

  // Set up diagnostics logger (error-level only)
  diag.setLogger(new DiagConsoleLogger(), {
    logLevel: DiagLogLevel.ERROR,
    suppressOverrideMessage: true
  });

  // Build resource attributes
  let resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "claude-code",
    [SEMRESATTRS_SERVICE_VERSION]: "2.0.59",
    "os.type": process.platform,
    "host.arch": process.arch,
    "wsl.version": getWslVersion() || undefined
  });

  // Initialize exporters based on environment
  let metricsExporter = createMetricsExporter();  // OTLP or BigQuery
  let logsExporter = createLogsExporter();        // OTLP
  let traceExporter = createTraceExporter();      // OTLP (if enhanced telemetry)

  // Set up MeterProvider
  let meterProvider = new MeterProvider({
    resource: resource,
    readers: [
      new PeriodicExportingMetricReader({
        exporter: metricsExporter,
        exportIntervalMillis: OTEL_METRIC_EXPORT_INTERVAL || 60000
      })
    ]
  });
  setMeterProvider(meterProvider);

  // Set up LoggerProvider
  let loggerProvider = new LoggerProvider({ resource });
  loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(logsExporter, {
      scheduledDelayMillis: OTEL_LOGS_EXPORT_INTERVAL || 5000
    })
  );
  setLoggerProvider(loggerProvider);
  setEventLogger(loggerProvider.getLogger("claude-code"));

  // Set up TracerProvider (if enhanced telemetry enabled)
  if (process.env.ENABLE_ENHANCED_TELEMETRY_BETA) {
    let tracerProvider = new NodeTracerProvider({ resource });
    tracerProvider.addSpanProcessor(
      new BatchSpanProcessor(traceExporter, {
        scheduledDelayMillis: OTEL_TRACES_EXPORT_INTERVAL || 5000
      })
    );
    setTracerProvider(tracerProvider);
  }

  // Set up BigQuery exporter for Anthropic metrics
  if (isBigQueryEnabled()) {
    setupBigQueryExporter();
  }

  // Register graceful shutdown
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);

  return meterProvider.getMeter("claude-code");
}

// Mapping: XO2→initializeOpenTelemetry, M9→telemetryMarker, ev5→configureOtelHeaders,
// A→resource, Q→metricsExporter, B→logsExporter, G→traceExporter, Z→meterProvider,
// I→loggerProvider, cE0→setMeterProvider, gE0→setLoggerProvider, mE0→setEventLogger,
// pE0→setTracerProvider, Zb5→isBigQueryEnabled, Gb5→setupBigQueryExporter, Nb5→gracefulShutdown,
// Yb5→createMetricsExporter, Kb5→createLogsExporter, Fb5→createTraceExporter, ov5→getWslVersion
```

**What it does:** Initializes the complete OpenTelemetry observability stack (metrics, logs, traces).

**How it works:**
1. **Mark checkpoint** - records `telemetry_init_start` for startup profiling
2. **Configure headers** - parses `OTEL_EXPORTER_OTLP_HEADERS` env var
3. **Set up diagnostics** - error-level only logging to avoid noise
4. **Build resource** - creates resource with service name, version, OS, arch, WSL info
5. **Create exporters** - creates OTLP exporters for metrics, logs, traces based on config
6. **Initialize MeterProvider** - sets up periodic metric export (default 60s interval)
7. **Initialize LoggerProvider** - sets up batch log processing (default 5s interval)
8. **Initialize TracerProvider** - only if `ENABLE_ENHANCED_TELEMETRY_BETA` is set
9. **BigQuery exporter** - sets up custom Anthropic metrics exporter if enabled
10. **Register shutdown** - hooks SIGINT/SIGTERM for graceful cleanup

**Why this approach:**
- **Conditional initialization** - trace exporter only loads when explicitly enabled (reduces overhead)
- **Periodic export** - batches data to reduce network calls
- **Resource attributes** - provides context for all telemetry (which service, which OS)
- **Graceful shutdown** - ensures data is flushed before process exit

**Key insight:** The function returns a `Meter` instance, not the full provider - this is the only interface exposed to application code for recording metrics. The meter has methods like `createCounter()`, `createHistogram()` etc.

### 3.2 OTLP Exporters

**Supported Protocols:**

| Protocol | Metrics | Logs | Traces |
|----------|---------|------|--------|
| `grpc` | `OTLPMetricExporter` | `OTLPLogExporter` | `OTLPTraceExporter` |
| `http/json` | `OTLPMetricExporter` | `OTLPLogExporter` | `OTLPTraceExporter` |
| `http/protobuf` | `OTLPMetricExporter` | `OTLPLogExporter` | `OTLPTraceExporter` |

**Configuration via Environment:**
- `OTEL_EXPORTER_OTLP_PROTOCOL` - default protocol for all signals
- `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` - override for metrics
- `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` - override for logs
- `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL` - override for traces

### 3.3 BigQuery Metrics Exporter (W80)

Custom exporter for Anthropic internal metrics:

```javascript
// ============================================
// BigQueryMetricsExporter - Custom Anthropic metrics exporter
// Location: chunks.118.mjs:3-115
// ============================================

// ORIGINAL (for source lookup):
class W80 {
  constructor(A) {
    this.b65 = `${e9().BASE_API_URL}/api/claude_code/metrics`;
    this.n65 = A.version; this.e65 = A.customerType; this.t65 = A.subscriptionType;
    this.queue = []; this.pending = !1; this.c65 = null; this.authHeaders = A.authHeaders || {}
  }
  export(A, Q) {
    let B = A.resourceMetrics.scopeMetrics.flatMap((G) => G.metrics).map((G) => ({
      name: G.descriptor.name, description: G.descriptor.description, unit: G.descriptor.unit,
      aggregationTemporality: G.aggregationTemporality,
      dataPoints: G.dataPoints.filter((Z) => typeof Z.value === "number").map((Z) => ({
        value: Z.value, attributes: Z.attributes, startTime: Z.startTime, endTime: Z.endTime
      }))
    }));
    let G = { metrics: B, resource: { service_name: "claude-code", service_version: this.n65,
      os_type: process.platform, host_arch: process.arch, customer_type: this.e65, subscription_type: this.t65 } };
    this.queue.push(G), this.r65(), Q({ code: sv5.ExportResultCode.SUCCESS })
  }
  async forceFlush() { await this.flush() }
  async shutdown() { this.c65 && (clearTimeout(this.c65), this.c65 = null); await this.flush() }
  r65() { this.c65 || (this.c65 = setTimeout(() => { this.c65 = null, this.flush() }, 5000)) }
  async flush() {
    if (this.pending || this.queue.length === 0) return;
    this.pending = !0; let A = [...this.queue]; this.queue = [];
    try { await YQ.post(this.b65, { batches: A }, { headers: { ...this.authHeaders } }) }
    catch (Q) { AA(Q instanceof Error ? Q : Error(String(Q))) }
    finally { this.pending = !1 }
  }
}

// READABLE (for understanding):
class BigQueryMetricsExporter {
  constructor(config) {
    this.endpoint = `${getApiBaseUrl()}/api/claude_code/metrics`;
    this.version = config.version;
    this.customerType = config.customerType;
    this.subscriptionType = config.subscriptionType;
    this.queue = [];
    this.pending = false;
    this.flushTimer = null;
    this.authHeaders = config.authHeaders || {};
  }

  export(metrics, resultCallback) {
    // Transform OTEL metrics to internal format
    let transformed = metrics.resourceMetrics.scopeMetrics
      .flatMap(scope => scope.metrics)
      .map(metric => ({
        name: metric.descriptor.name,
        description: metric.descriptor.description,
        unit: metric.descriptor.unit,
        aggregationTemporality: metric.aggregationTemporality,
        dataPoints: metric.dataPoints
          .filter(dp => typeof dp.value === "number")  // Numeric values only
          .map(dp => ({
            value: dp.value,
            attributes: dp.attributes,
            startTime: dp.startTime,
            endTime: dp.endTime
          }))
      }));

    // Add resource attributes
    let payload = {
      metrics: transformed,
      resource: {
        service_name: "claude-code",
        service_version: this.version,
        os_type: process.platform,
        host_arch: process.arch,
        customer_type: this.customerType,  // "claude_ai" or "api"
        subscription_type: this.subscriptionType
      }
    };

    // Queue for batch sending
    this.queue.push(payload);
    this.scheduleFlush();
    resultCallback({ code: ExportResultCode.SUCCESS });
  }

  async forceFlush() { await this.flush(); }
  async shutdown() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }

  scheduleFlush() {
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null;
        this.flush();
      }, 5000);  // 5 second delay
    }
  }

  async flush() {
    if (this.pending || this.queue.length === 0) return;
    this.pending = true;
    let batches = [...this.queue];
    this.queue = [];

    try {
      await httpClient.post(this.endpoint, { batches }, {
        headers: { ...this.authHeaders }
      });
    } catch (error) {
      errorLog(error instanceof Error ? error : Error(String(error)));
    } finally {
      this.pending = false;
    }
  }
}

// Mapping: W80→BigQueryMetricsExporter, b65→endpoint, n65→version, e65→customerType,
// t65→subscriptionType, c65→flushTimer, r65→scheduleFlush, YQ→httpClient, AA→errorLog
```

**What it does:** Custom OTEL metrics exporter that sends metrics to Anthropic's internal BigQuery pipeline.

**How it works:**
1. **Transform metrics** - flattens OTEL scope metrics and extracts only numeric data points
2. **Add resource context** - includes service info, OS, and customer/subscription type
3. **Queue batching** - accumulates payloads in queue
4. **Scheduled flush** - 5 second delay before sending (batches multiple exports)
5. **Immediate callback** - returns SUCCESS immediately (fire-and-forget)
6. **Graceful shutdown** - clears timer and flushes remaining data

**Why this approach:**
- **Immediate callback** prevents blocking the OTEL export pipeline
- **Clone before clear** (`[...this.queue]`) prevents race conditions
- **Numeric filter** ensures only countable metrics are sent (ignores histograms with complex values)
- **Customer type tracking** enables per-customer analytics (claude_ai vs api users)

**Key insight:** The exporter uses a `pending` flag to prevent concurrent flush operations - this is critical because HTTP requests are async and multiple flushes could overlap, causing duplicate data or race conditions.

---

## 4. Privacy Controls (Grove System)

### 4.1 Overview

The Grove system manages user consent for telemetry data collection:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Privacy Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. First Launch                                             │
│     └─► shouldShowGroveNotice() → true                       │
│         └─► Display privacy consent dialog                   │
│                                                              │
│  2. User Response                                            │
│     ├─► Accept → updateGroveSetting(true)                    │
│     ├─► Decline → updateGroveSetting(false)                  │
│     └─► Dismiss → markGroveNoticeViewed()                    │
│                                                              │
│  3. Subsequent Launches                                      │
│     └─► Check reminder frequency                             │
│         └─► Re-prompt if notice_reminder_frequency days      │
│                                                              │
│  4. At Event Time                                            │
│     └─► isGroveEnabled() → skip events if false              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Grove Configuration Structure

Fetched from `/api/claude_code_grove`:

```javascript
{
  grove_enabled: boolean,           // User opt-in/opt-out status
  domain_excluded: boolean,         // Domain-level exclusion
  notice_is_grace_period: boolean,  // Within compliance grace period
  notice_reminder_frequency: number // Days before showing reminder
}
```

### 4.3 zD9 (shouldShowGroveNotice) - Display Logic

```javascript
// ============================================
// shouldShowGroveNotice - Determine if privacy notice should be shown
// Location: chunks.149.mjs:3076-3086
// ============================================

// ORIGINAL (for source lookup):
function zD9(A, Q, B) {
  if (A !== null && A.grove_enabled !== null) return !1;
  if (B) return !0;
  if (Q !== null && !Q.notice_is_grace_period) return !0;
  let Z = Q?.notice_reminder_frequency;
  if (Z !== null && Z !== void 0 && A?.grove_notice_viewed_at)
    return Math.floor((Date.now() - new Date(A.grove_notice_viewed_at).getTime()) / 86400000) >= Z;
  else {
    let I = A?.grove_notice_viewed_at;
    return I === null || I === void 0
  }
}

// READABLE (for understanding):
function shouldShowGroveNotice(userSettings, groveConfig, forceShow) {
  // Don't show if user already made explicit choice
  if (userSettings !== null && userSettings.grove_enabled !== null) {
    return false;
  }

  // Force show if requested
  if (forceShow) return true;

  // Show if not in grace period
  if (groveConfig !== null && !groveConfig.notice_is_grace_period) {
    return true;
  }

  // Check if enough time has passed since last view
  let reminderFreq = groveConfig?.notice_reminder_frequency;
  if (reminderFreq !== null && reminderFreq !== void 0 && userSettings?.grove_notice_viewed_at) {
    let daysSinceLastView = Math.floor(
      (Date.now() - new Date(userSettings.grove_notice_viewed_at).getTime()) / 86400000
    );
    return daysSinceLastView >= reminderFreq;
  }

  // Show if never viewed before
  return userSettings?.grove_notice_viewed_at == null;
}

// Mapping: zD9→shouldShowGroveNotice, A→userSettings, Q→groveConfig, B→forceShow,
// Z→reminderFreq, I→lastViewedAt, 86400000→MILLISECONDS_PER_DAY
```

**What it does:** Determines whether to display the Grove privacy consent notice to the user.

**How it works:**
1. **Explicit choice check** - if user already set `grove_enabled` (true/false), don't show
2. **Force flag** - if `forceShow` is true, always show (used for settings screen)
3. **Grace period check** - if not in grace period, show notice (compliance requirement)
4. **Reminder frequency** - if `notice_reminder_frequency` days have passed since last view, show again
5. **First view** - if `grove_notice_viewed_at` is null/undefined, show notice

**Why this approach:**
- **Priority ordering** matters - explicit choice always wins over other conditions
- **Grace period** allows time for legal/compliance preparation before mandatory notices
- **Reminder frequency** enables periodic re-prompting without being too aggressive
- **Day calculation** uses `Math.floor` for whole-day granularity (not hour/minute precision)

**Key insight:** The `86400000` constant is milliseconds per day (24*60*60*1000). The function converts the timestamp difference to days using integer division to avoid partial-day calculations.

**Decision Logic:**

| Condition | Result |
|-----------|--------|
| User explicitly set `grove_enabled` | Don't show |
| `forceShow` flag is true | Show |
| Not in grace period | Show |
| `notice_reminder_frequency` days passed | Show |
| Never viewed before | Show |

---

## 5. Telemetry Events Catalog

### 5.1 Event Naming Convention

All events follow the `tengu_*` pattern:

```
tengu_{category}_{action}
        │         │
        │         └─► What happened (init, start, success, error, etc.)
        │
        └─► Feature area (api, mcp, oauth, tool, etc.)
```

### 5.2 Events by Category

#### Initialization Events (5)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_init` | `entrypoint`, `hasInitialPrompt`, `hasStdin`, `verbose`, `debug`, `mcpClientCount`, etc. | Main initialization |
| `tengu_began_setup` | - | Setup process started |
| `tengu_onboarding_step` | `step` | User progresses through onboarding |
| `tengu_startup_telemetry` | `is_git`, `worktree_count`, `sandbox_enabled` | Startup metrics |
| `tengu_startup_manual_model_config` | `cli_flag`, `env_var`, `settings_file` | Manual model configuration |

#### MCP Events (22)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_mcp_start` | - | MCP server startup |
| `tengu_mcp_servers` | Server config | MCP server listing |
| `tengu_mcp_server_connection_succeeded` | `server_name` | Connection success |
| `tengu_mcp_server_connection_failed` | `server_name`, `error` | Connection failure |
| `tengu_mcp_add` | `type`, `scope`, `source`, `transport` | Server added |
| `tengu_mcp_delete` | `name`, `scope` | Server deleted |
| `tengu_mcp_list` | - | Servers listed |
| `tengu_mcp_get` | `name` | Server get operation |
| `tengu_mcp_cli_command_executed` | `command`, `success`, `duration_ms` | CLI command executed |

#### Tool Events (23)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_tool_use_success` | `tool_name`, `duration_ms` | Tool executed successfully |
| `tengu_tool_use_error` | `tool_name`, `error` | Tool execution error |
| `tengu_tool_use_cancelled` | `tool_name` | Tool cancelled |
| `tengu_tool_use_can_use_tool_allowed` | `tool_name` | Permission allowed |
| `tengu_tool_use_can_use_tool_rejected` | `tool_name`, `reason` | Permission rejected |
| `tengu_bash_tool_command_executed` | `command`, `exit_code` | Bash command |
| `tengu_skill_tool_invocation` | `skill_name` | Skill invoked |

#### Session Events (16)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_session_resumed` | `entrypoint` | Session resumed |
| `tengu_session_renamed` | `old_name`, `new_name` | Session renamed |
| `tengu_fork_agent_query` | `agent_type` | Agent forked |
| `tengu_remote_create_session` | `description_length` | Remote session |
| `tengu_remote_create_session_success` | `session_id` | Remote success |
| `tengu_remote_create_session_error` | `error` | Remote error |

#### Authentication Events (26)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_oauth_success` | - | OAuth successful |
| `tengu_oauth_error` | `error` | OAuth error |
| `tengu_oauth_flow_start` | - | OAuth flow initiated |
| `tengu_oauth_token_exchange_success` | - | Token exchange success |
| `tengu_oauth_token_exchange_error` | `error` | Token exchange error |
| `tengu_oauth_token_refresh_success` | - | Token refresh success |
| `tengu_oauth_token_refresh_failure` | `error` | Token refresh failure |

#### API/Model Events (18)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_api_query` | `model`, `message_count`, `input_tokens`, `output_tokens` | API query |
| `tengu_api_error` | `status`, `error` | API error |
| `tengu_api_retry` | `attempt`, `reason` | API retry |
| `tengu_api_success` | `duration_ms`, `tokens` | API success |
| `tengu_api_opus_fallback_triggered` | - | Opus fallback |
| `tengu_model_fallback_triggered` | `from_model`, `to_model` | Model fallback |
| `tengu_context_size` | `input_tokens`, `output_tokens`, `cache_*` | Context window |

#### Error/Reliability Events (28)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_query_error` | `error` | Query error |
| `tengu_streaming_error` | `error` | Streaming error |
| `tengu_streaming_fallback_to_non_streaming` | - | Fallback to non-streaming |
| `tengu_preflight_check_failed` | `check_name` | Preflight failed |
| `tengu_git_index_lock_error` | - | Git lock error |
| `tengu_file_history_*` | Various | File history events |

#### Hook Events (10)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_pre_tool_hooks_cancelled` | - | Pre-tool hooks cancelled |
| `tengu_pre_tool_hook_error` | `error` | Pre-tool hook error |
| `tengu_post_tool_hooks_cancelled` | - | Post-tool hooks cancelled |
| `tengu_run_hook` | `hook_name` | Hook execution |
| `tengu_repl_hook_finished` | `duration_ms` | REPL hook done |

#### Privacy/Grove Events (7)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_grove_policy_viewed` | `location`, `dismissable` | Policy viewed |
| `tengu_grove_policy_submitted` | `state`, `dismissable` | Policy submitted |
| `tengu_grove_policy_dismissed` | `state` | Policy dismissed |
| `tengu_grove_policy_escaped` | - | Policy escaped |
| `tengu_grove_privacy_settings_viewed` | - | Settings viewed |

#### Compaction Events (5)
| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_compact` | `before_tokens`, `after_tokens` | Compaction performed |
| `tengu_compact_failed` | `error` | Compaction failed |
| `tengu_microcompact` | `tokens_saved` | Micro-compaction |
| `tengu_auto_compact_succeeded` | - | Auto-compact success |

---

## 6. Configuration Reference

### 6.1 Telemetry Control Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | - | Enable OpenTelemetry stack |
| `ENABLE_ENHANCED_TELEMETRY_BETA` | - | Enable trace exporter |
| `DISABLE_ERROR_REPORTING` | - | Disable Sentry error reporting |
| `DISABLE_TELEMETRY` | - | Disable all telemetry |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | - | Disable optional telemetry |
| `CLAUDE_CODE_PROFILE_STARTUP` | - | Enable startup profiling |

### 6.2 OTEL Exporter Configuration

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP backend endpoint |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Default protocol (grpc, http/json, http/protobuf) |
| `OTEL_EXPORTER_OTLP_HEADERS` | Authentication headers (key=value,key=value) |
| `OTEL_EXPORTER_OTLP_INSECURE` | Allow insecure connections |
| `OTEL_EXPORTER_OTLP_CERTIFICATE` | Root CA certificate path |
| `OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE` | Client certificate path |
| `OTEL_EXPORTER_OTLP_CLIENT_KEY` | Client key path |

### 6.3 Export Intervals

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_METRIC_EXPORT_INTERVAL` | 60000ms | Metrics export frequency |
| `OTEL_LOGS_EXPORT_INTERVAL` | 5000ms | Logs export frequency |
| `OTEL_TRACES_EXPORT_INTERVAL` | 5000ms | Traces export frequency |

### 6.4 Content Filtering

| Variable | Description |
|----------|-------------|
| `OTEL_LOG_USER_PROMPTS` | Log full user prompts (PII sensitive) |
| `OTEL_LOG_TOOL_CONTENT` | Log tool execution output |
| `OTEL_LOG_MODEL_RESPONSE` | Log LLM responses |

### 6.5 Shutdown Timeouts

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS` | 2000ms | Graceful shutdown timeout |
| `CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS` | 5000ms | Final flush timeout |

---

## 7. Telemetry Workflow

### 7.1 Startup Sequence

```
1. CLI Entry (chunks.158.mjs)
   └─► M9("cli_before_main_import")

2. Main Module Import
   └─► M9("cli_after_main_import")

3. Commander Initialization
   └─► M9("run_commander_initialized")

4. Pre-Action Hook
   ├─► M9("preAction_start")
   ├─► Load configuration
   ├─► M9("preAction_after_init")
   ├─► Run migrations
   └─► M9("preAction_after_migrations")

5. Action Handler
   ├─► M9("action_handler_start")
   ├─► Load MCP configs
   │   └─► M9("action_mcp_configs_loaded")
   ├─► Load tools
   │   └─► M9("action_tools_loaded")
   ├─► Setup UI
   │   ├─► M9("action_before_setup")
   │   └─► M9("action_after_setup")
   ├─► Initialize OpenTelemetry
   │   └─► XO2() → M9("telemetry_init_start")
   ├─► Attach telemetry provider
   │   └─► Hz0(provider) → Flush queued events
   └─► GA("tengu_init", {...})
```

### 7.2 Event Flow

```
1. Application Code
   └─► GA("tengu_tool_use_success", { tool_name: "Bash" })

2. GA() Function
   ├─► Check if provider attached
   │   ├─► No: Queue in NFA
   │   └─► Yes: Continue
   └─► Call telemetryProvider.logEvent()

3. logEventSync (hg3)
   ├─► Check sample rate
   │   └─► Skip if sampled out
   ├─► Add sample_rate to metadata
   ├─► logToSentry()
   ├─► If isSegmentEnabled(): sendToSegment()
   ├─► If isDatadogEnabled(): sendToDatadog()
   └─► logLocal()

4. sendToDatadog ($D0)
   ├─► Check feature gate
   ├─► Check event whitelist
   ├─► Normalize sensitive data
   ├─► Build Datadog entry
   ├─► Add to batch buffer
   └─► Flush if buffer full or schedule delayed flush
```

### 7.3 Shutdown Sequence

```
1. SIGINT/SIGTERM received

2. Graceful Shutdown Handler
   ├─► Set timeout (OTEL_SHUTDOWN_TIMEOUT_MS)
   ├─► Flush Datadog buffer
   ├─► Flush OTEL metrics
   ├─► Flush OTEL logs
   ├─► Flush OTEL traces
   └─► Exit process
```

---

## Summary

Claude Code v2.0.59's telemetry system provides:

1. **Multi-destination routing** - Events flow to Sentry, Segment, Datadog, BigQuery
2. **Queue buffering** - No events lost during startup
3. **Feature gates** - Statsig controls for gradual rollout
4. **Privacy controls** - Grove system for user consent
5. **Performance profiling** - Checkpoint marking with memory tracking
6. **Sample rate filtering** - Reduces volume for high-frequency events
7. **Graceful shutdown** - Flushes pending data before exit
8. **429+ telemetry events** - Comprehensive coverage across all features
9. **OTEL integration** - Standard observability with custom BigQuery exporter
10. **Enterprise flexibility** - Multiple disable mechanisms for regulated environments
