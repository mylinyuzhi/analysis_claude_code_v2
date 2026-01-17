# Telemetry and Observability

## Overview

Claude Code v2.1.7 implements a comprehensive, multi-destination telemetry system using:

- **OpenTelemetry (1P)** for first-party structured logging to Anthropic
- **Sentry** for error tracking and crash reporting
- **Datadog** for production event monitoring (feature-gated)
- **Segment** for analytics (feature-gated)
- **Local JSONL files** for error logs and MCP server logs
- **Performance Markers** for startup profiling

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry module symbols

Key functions in this document:
- `logEvent` (AR7) - Multi-destination synchronous event routing
- `logEventAsync` (QR7) - Multi-destination asynchronous event routing
- `sendToDatadog` (Zy0) - Datadog event batching and sending
- `initializeOpenTelemetry` (IKB) - OpenTelemetry LoggerProvider setup
- `telemetryMarker` (x9) - Performance checkpoint marking
- `getSampleRate` (ma1) - Event sampling logic
- `attachTelemetryProvider` (Uh0) - Provider registration

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Claude Code Application                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ l()          │  │ kl()         │  │ e()          │  │ x9()        │  │
│  │ analyticsEvt │  │ asyncEvent   │  │ errorLog     │  │ perfMarker  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                 │                 │                  │         │
│         └────────┬────────┴────────┬────────┘                  │         │
│                  ▼                 │                           │         │
│  ┌───────────────────────────────┐ │    ┌──────────────────────┴──────┐  │
│  │ Uh0 (attachTelemetryProvider) │ │    │ Performance API (perf_hooks)│  │
│  │ - Queue pending events        │ │    │ - Mark checkpoints          │  │
│  │ - Attach provider             │ │    │ - Track memory usage        │  │
│  │ - Flush on connect            │ │    └─────────────────────────────┘  │
│  └───────────────┬───────────────┘ │                                     │
│                  ▼                 │                                     │
│  ┌───────────────────────────────┐ │                                     │
│  │ AR7/QR7 (logEvent/Async)      │◄┘                                     │
│  │ - Sample rate filtering       │                                       │
│  │ - Multi-destination routing   │                                       │
│  └───────────────┬───────────────┘                                       │
│                  │                                                        │
│    ┌─────────────┼─────────────┬─────────────┬─────────────┐             │
│    ▼             ▼             ▼             ▼             ▼             │
│ ┌──────┐    ┌──────┐    ┌──────────┐   ┌──────────┐  ┌──────────┐       │
│ │Sentry│    │Local │    │ Segment  │   │ Datadog  │  │ OTEL 1P  │       │
│ │      │    │ Log  │    │(gated)   │   │ (gated)  │  │ (Anthro) │       │
│ └──────┘    └──────┘    └──────────┘   └──────────┘  └──────────┘       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Core Telemetry Functions

### 1.1 AR7 (logEvent) - Synchronous Multi-Destination Routing

```javascript
// ============================================
// logEvent - Route events to multiple telemetry destinations
// Location: chunks.155.mjs:1952-1962
// ============================================

// ORIGINAL (for source lookup):
function AR7(A, Q) {
  let B = ma1(A);
  if (B === 0) return;
  let G = B !== null ? {
    ...Q,
    sample_rate: B
  } : Q;
  if (qeQ(A, G), oN9()) Dz0(A, G);
  if (rN9()) Zy0(A, G);
  ca1(A, G)
}

// READABLE (for understanding):
function logEvent(eventName, metadata) {
  // Check sample rate (0 = skip, null = no sampling)
  let sampleRate = getSampleRate(eventName);
  if (sampleRate === 0) return;  // Sampled out

  // Attach sample rate to metadata if applicable
  let eventData = sampleRate !== null
    ? { ...metadata, sample_rate: sampleRate }
    : metadata;

  // Always send to Sentry/internal logging
  logToSentry(eventName, eventData);

  // Send to Segment if feature gate enabled
  if (isSegmentEnabled()) {
    sendToSegment(eventName, eventData);
  }

  // Send to Datadog if feature gate enabled
  if (isDatadogEnabled()) {
    sendToDatadog(eventName, eventData);
  }

  // Send to OpenTelemetry 1P (Anthropic)
  sendTo1PLogger(eventName, eventData);
}

// Mapping: AR7→logEvent, A→eventName, Q→metadata, B→sampleRate,
// ma1→getSampleRate, qeQ→logToSentry, oN9→isSegmentEnabled,
// Dz0→sendToSegment, rN9→isDatadogEnabled, Zy0→sendToDatadog, ca1→sendTo1PLogger
```

**What it does:** Routes telemetry events to multiple destinations based on feature gates and sample rates.

**How it works:**
1. **Sample rate check** - `ma1()` returns 0 (skip), null (no sampling), or probability value
2. **Metadata enrichment** - adds `sample_rate` property if sampling applied
3. **Sentry routing** - always sends via `qeQ()`
4. **Segment routing** - conditional on `oN9()` feature gate
5. **Datadog routing** - conditional on `rN9()` feature gate
6. **1P routing** - always sends to Anthropic's OpenTelemetry endpoint

**Why this approach:**
- **Multi-destination** allows different teams to consume telemetry (analytics, ops, product)
- **Feature gates** enable gradual rollout and cost control
- **Sample rate** reduces volume for high-frequency events
- **Synchronous** for predictable ordering and simpler call sites

---

### 1.2 QR7 (logEventAsync) - Asynchronous Multi-Destination Routing

```javascript
// ============================================
// logEventAsync - Async event routing with await support
// Location: chunks.155.mjs:1964-1975
// ============================================

// ORIGINAL (for source lookup):
async function QR7(A, Q) {
  let B = ma1(A);
  if (B === 0) return;
  let G = B !== null ? {
      ...Q,
      sample_rate: B
    } : Q,
    Z = [dp1(A, G)];
  if (oN9()) Z.push(Dz0(A, G));
  if (rN9()) Zy0(A, G);
  ca1(A, G), await Promise.all(Z)
}

// READABLE (for understanding):
async function logEventAsync(eventName, metadata) {
  let sampleRate = getSampleRate(eventName);
  if (sampleRate === 0) return;

  let eventData = sampleRate !== null
    ? { ...metadata, sample_rate: sampleRate }
    : metadata;

  // Collect async operations
  let asyncOps = [sentryLogAsync(eventName, eventData)];

  if (isSegmentEnabled()) {
    asyncOps.push(sendToSegmentAsync(eventName, eventData));
  }

  // Datadog and 1P are fire-and-forget
  if (isDatadogEnabled()) {
    sendToDatadog(eventName, eventData);
  }
  sendTo1PLogger(eventName, eventData);

  // Wait for critical async operations
  await Promise.all(asyncOps);
}

// Mapping: QR7→logEventAsync, dp1→sentryLogAsync, Z→asyncOps
```

**What it does:** Async variant that awaits delivery confirmation for critical events.

**Why async variant exists:**
- Some events require confirmation (e.g., session end, critical errors)
- Allows proper error handling at call site
- Only waits for Sentry and Segment, not Datadog/1P (fire-and-forget)

---

### 1.3 Event Queue Buffering (l / Uh0)

The telemetry system uses a queue-based architecture to handle events that fire before the provider is initialized.

```javascript
// ============================================
// analyticsEvent - Log event with queue buffering
// Location: chunks.1.mjs:3982-3992
// ============================================

// ORIGINAL (for source lookup):
function l(A, Q) {
  if (vl === null) {
    uCA.push({
      eventName: A,
      metadata: Q,
      async: !1
    });
    return
  }
  vl.logEvent(A, Q)
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

// Mapping: l→analyticsEvent, A→eventName, Q→metadata, vl→telemetryProvider, uCA→pendingEventQueue
```

**What it does:** Buffers telemetry events during startup before provider is initialized.

**How it works:**
1. **Check provider** - if `vl` (telemetryProvider) is null, event goes to queue
2. **Queue with metadata** - stores eventName, metadata, and async flag
3. **Direct dispatch** - if provider attached, calls `logEvent()` immediately

**Why this approach:**
- **No events lost** - early startup events are captured
- **Async flag preservation** - queued events replay with correct sync/async behavior
- **Simple interface** - callers don't need to know about initialization state

---

### 1.4 Uh0 (attachTelemetryProvider) - Provider Attachment with Queue Flush

```javascript
// ============================================
// attachTelemetryProvider - Attach provider and flush queued events
// Location: chunks.1.mjs:3970-3980 (inferred)
// ============================================

// READABLE (for understanding):
function attachTelemetryProvider(provider) {
  // Enforce single-attachment pattern
  if (telemetryProvider !== null) {
    throw Error("Analytics sink already attached - cannot attach more than once");
  }

  telemetryProvider = provider;

  // Flush any queued events
  if (pendingEventQueue.length > 0) {
    let queuedEvents = [...pendingEventQueue];  // Clone to avoid mutation
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

// Mapping: Uh0→attachTelemetryProvider, vl→telemetryProvider, uCA→pendingEventQueue
```

**What it does:** Attaches the telemetry provider and replays all queued events.

**How it works:**
1. **Single-attachment enforcement** - throws if called twice (prevents duplicate events)
2. **Clone and clear queue** - `[...queue]` prevents race conditions during replay
3. **queueMicrotask replay** - non-blocking flush to avoid startup delays
4. **Async flag respect** - calls sync vs async methods based on original call type

**Why this approach:**
- **Clone before clear** prevents events added during replay from being lost
- **Microtask** ensures flush doesn't block startup-critical path
- **Error on double-attach** catches configuration bugs early

**Key insight:** The queue mechanism is critical because `tengu_init` and other early events fire during startup before OpenTelemetry/Segment/Datadog are initialized. Without this queue, these events would be lost.

---

### 1.5 tN9 (registerTelemetryProvider) - Provider Registration

```javascript
// ============================================
// registerTelemetryProvider - Wire up analytics provider
// Location: chunks.155.mjs:1981-1986
// ============================================

// ORIGINAL (for source lookup):
function tN9() {
  Uh0({
    logEvent: AR7,
    logEventAsync: QR7
  })
}

// READABLE (for understanding):
function registerTelemetryProvider() {
  attachTelemetryProvider({
    logEvent: logEvent,
    logEventAsync: logEventAsync
  });
}

// Mapping: tN9→registerTelemetryProvider, Uh0→attachTelemetryProvider
```

**What it does:** Registers the telemetry provider with the core event logging interface.

---

### 1.4 x9 (telemetryMarker) - Performance Checkpoint Marking

```javascript
// ============================================
// telemetryMarker - Record performance checkpoint with optional memory tracking
// Location: chunks.1.mjs:4019-4022
// ============================================

// ORIGINAL (for source lookup):
function x9(A) {
  if (!Lh0) return;
  if (Mq1().mark(A), idA) Oh0.set(A, process.memoryUsage())
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

// Mapping: x9→telemetryMarker, A→checkpointName, Lh0→enableStartupProfiling,
// Mq1→getPerformanceApi, idA→captureMemoryMetrics, Oh0→memoryUsageMap
```

**What it does:** Records performance checkpoints for startup profiling.

**Checkpoint Names Used:**

| Checkpoint | When Called | Purpose |
|------------|-------------|---------|
| `1p_event_logging_start` | IKB() start | OpenTelemetry initialization begins |
| `1p_event_after_growthbook_config` | After config | GrowthBook config loaded |
| `run_function_start` | Main run starts | Main entry function |
| `run_commander_initialized` | Commander created | CLI parser ready |
| `preAction_start` | Pre-action hook | Before command processing |
| `action_handler_start` | Main action | Command handler executing |
| `action_mcp_configs_loaded` | MCP loaded | MCP servers configured |
| `action_tools_loaded` | Tools loaded | Tool definitions ready |

**Why this approach:**
- **Conditional execution** via `Lh0` flag (controlled by env var)
- **Uses Node.js native perf_hooks** for accurate timing
- **Memory tracking** helps identify memory-heavy operations

---

## 2. Event Sampling System

### 2.1 ma1 (getSampleRate) - Sample Rate Logic

```javascript
// ============================================
// getSampleRate - Determine sampling rate for event
// Location: chunks.51.mjs:573-581
// ============================================

// ORIGINAL (for source lookup):
function ma1(A) {
  let B = P18()[A];
  if (!B) return null;
  let G = B.sample_rate;
  if (typeof G !== "number" || G < 0 || G > 1) return null;
  if (G >= 1) return null;
  if (G <= 0) return 0;
  return Math.random() < G ? G : 0
}

// READABLE (for understanding):
function getSampleRate(eventName) {
  let eventConfig = getEventSamplingConfig()[eventName];
  if (!eventConfig) return null;  // No config = always sample

  let sampleRate = eventConfig.sample_rate;

  // Validate sample rate
  if (typeof sampleRate !== "number" || sampleRate < 0 || sampleRate > 1) {
    return null;  // Invalid = always sample
  }

  if (sampleRate >= 1) return null;   // 100% = always sample
  if (sampleRate <= 0) return 0;      // 0% = never sample

  // Probabilistic sampling
  return Math.random() < sampleRate ? sampleRate : 0;
}

// Mapping: ma1→getSampleRate, A→eventName, B→eventConfig, G→sampleRate, P18→getEventSamplingConfig
```

**What it does:** Implements probabilistic event sampling based on GrowthBook configuration.

**How it works:**
1. **Lookup config** - gets event-specific config from GrowthBook feature `tengu_event_sampling_config`
2. **Validate rate** - ensures rate is a valid number between 0 and 1
3. **Edge cases** - 1.0 or invalid returns null (always sample), 0.0 returns 0 (never sample)
4. **Random check** - `Math.random() < rate` determines if event is sampled

**Return Values:**
- `null` - No sampling, always send
- `0` - Sampled out, skip event
- `rate` - Sampled in, attach rate to metadata

**Why this approach:**
- **Server-controlled** via GrowthBook allows dynamic adjustment
- **Rate attachment** enables backend volume estimation
- **Probabilistic** ensures unbiased sample across sessions

---

## 3. Datadog Integration

### 3.1 Zy0 (sendToDatadog) - Event Batching

```javascript
// ============================================
// sendToDatadog - Send event to Datadog with batching
// Location: chunks.155.mjs:1843-1888
// ============================================

// ORIGINAL (for source lookup):
async function Zy0(A, Q) {
  let B = YU1;
  if (B === null) B = await eM7();
  if (!B || !rM7.has(A)) return;
  try {
    let G = await dn({
        model: Q.model
      }),
      {
        envContext: Z,
        ...Y
      } = G,
      J = {
        ...Y,
        ...Z,
        ...Q
      };
    if (typeof J.toolName === "string" && J.toolName.startsWith("mcp__")) J.toolName = "mcp";
    if (typeof J.model === "string" && !J.model.startsWith("claude-")) J.model = "other";
    if (typeof J.version === "string") J.version = J.version.replace(/^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/, "$1");
    if (J.status !== void 0 && J.status !== null) {
      let W = String(J.status);
      J.http_status = W;
      let K = W.charAt(0);
      if (K >= "1" && K <= "5") J.http_status_range = `${K}xx`;
      delete J.status
    }
    let X = J,
      D = {
        ddsource: "nodejs",
        ddtags: sM7.filter((W) => X[W] !== void 0 && X[W] !== null).map((W) => `${lN9(W)}:${X[W]}`).join(","),
        message: A,
        service: "claude-code",
        hostname: "claude-code",
        env: "external"
      };
    for (let [W, K] of Object.entries(J))
      if (K !== void 0 && K !== null) D[lN9(W)] = K;
    if (qmA.push(D), qmA.length >= aM7) {
      if (mp) clearTimeout(mp), mp = null;
      Gy0()
    } else tM7()
  } catch (G) {
    e(G instanceof Error ? G : Error(String(G)))
  }
}

// READABLE (for understanding):
async function sendToDatadog(eventName, metadata) {
  // Initialize Datadog if needed
  let isEnabled = datadogEnabled;
  if (isEnabled === null) isEnabled = await initializeDatadog();

  // Check feature gate AND event whitelist
  if (!isEnabled || !TRACKED_EVENTS.has(eventName)) return;

  try {
    // Get environment context
    let envContext = await getEnvironmentContext({ model: metadata.model });
    let mergedData = { ...envContext, ...metadata };

    // NORMALIZE SENSITIVE DATA
    // Anonymize MCP tool names
    if (mergedData.toolName?.startsWith("mcp__")) {
      mergedData.toolName = "mcp";
    }
    // Anonymize non-Claude models
    if (!mergedData.model?.startsWith("claude-")) {
      mergedData.model = "other";
    }
    // Strip build hash from version
    if (typeof mergedData.version === "string") {
      mergedData.version = mergedData.version.replace(
        /^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/,
        "$1"
      );
    }
    // Convert HTTP status to range
    if (mergedData.status !== undefined) {
      let statusStr = String(mergedData.status);
      mergedData.http_status = statusStr;
      mergedData.http_status_range = `${statusStr.charAt(0)}xx`;  // e.g., "5xx"
      delete mergedData.status;
    }

    // Build Datadog log entry
    let datadogEntry = {
      ddsource: "nodejs",
      ddtags: ALLOWED_TAGS.filter(tag => mergedData[tag] != null)
        .map(tag => `${toSnakeCase(tag)}:${mergedData[tag]}`)
        .join(","),
      message: eventName,
      service: "claude-code",
      hostname: "claude-code",
      env: "external"
    };

    // Add all properties as snake_case
    for (let [key, value] of Object.entries(mergedData)) {
      if (value != null) datadogEntry[toSnakeCase(key)] = value;
    }

    // Add to batch buffer
    datadogBuffer.push(datadogEntry);

    // Flush if buffer full (100 events) or schedule delayed flush
    if (datadogBuffer.length >= BATCH_SIZE) {
      if (flushTimer) clearTimeout(flushTimer);
      flushToDatadog();
    } else {
      scheduleFlush();  // 15 second delay
    }
  } catch (error) {
    logError(error);
  }
}

// Mapping: Zy0→sendToDatadog, A→eventName, Q→metadata, YU1→datadogEnabled,
// eM7→initializeDatadog, rM7→TRACKED_EVENTS, dn→getEnvironmentContext,
// sM7→ALLOWED_TAGS, lN9→toSnakeCase, qmA→datadogBuffer, aM7→BATCH_SIZE,
// tM7→scheduleFlush, Gy0→flushToDatadog, e→logError
```

**What it does:** Sends telemetry events to Datadog with batching and data normalization.

**Data Normalization:**
1. **MCP tool anonymization** - `mcp__custom_tool` → `mcp`
2. **Model anonymization** - non-Claude models → `other`
3. **Version sanitization** - strips dev build metadata
4. **Status range** - `500` → `http_status_range: "5xx"`

**Why this approach:**
- **Privacy protection** - anonymizes custom tool/model names
- **Cardinality control** - prevents tag explosion in Datadog
- **Batching** - reduces API calls and costs

---

### 3.2 Gy0 (flushToDatadog) - Buffer Flush

```javascript
// ============================================
// flushToDatadog - Send buffered events to Datadog API
// Location: chunks.155.mjs:1819-1834
// ============================================

// ORIGINAL (for source lookup):
async function Gy0() {
  if (qmA.length === 0) return;
  let A = [...qmA];
  qmA = [];
  try {
    await xQ.post(lM7, A, {
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": iM7
      },
      timeout: oM7
    })
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(String(Q)))
  }
}

// READABLE (for understanding):
async function flushToDatadog() {
  if (datadogBuffer.length === 0) return;

  // Clone and clear buffer atomically
  let events = [...datadogBuffer];
  datadogBuffer = [];

  try {
    await httpClient.post(DATADOG_ENDPOINT, events, {
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": DATADOG_API_KEY
      },
      timeout: HTTP_TIMEOUT
    });
  } catch (error) {
    logError(error);
  }
}

// Mapping: Gy0→flushToDatadog, qmA→datadogBuffer, lM7→DATADOG_ENDPOINT,
// iM7→DATADOG_API_KEY, oM7→HTTP_TIMEOUT, xQ→httpClient
```

---

### 3.3 Datadog Configuration Constants

```javascript
// Location: chunks.155.mjs:1890-1918

lM7 = "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"  // Endpoint
iM7 = "pubbbf48e6d78dae54bceaa4acf463299bf"                     // API Key
nM7 = 15000    // Flush interval (ms)
aM7 = 100      // Batch size threshold
oM7 = 5000     // HTTP timeout (ms)

// Tracked events whitelist
rM7 = new Set([
  "tengu_api_error",
  "tengu_api_success",
  "tengu_compact_failed",
  "tengu_model_fallback_triggered",
  "tengu_oauth_error",
  "tengu_oauth_success",
  "tengu_oauth_token_refresh_failure",
  "tengu_oauth_token_refresh_success",
  "tengu_oauth_token_refresh_lock_acquiring",
  "tengu_oauth_token_refresh_lock_acquired",
  "tengu_oauth_token_refresh_starting",
  "tengu_oauth_token_refresh_completed",
  "tengu_oauth_token_refresh_lock_releasing",
  "tengu_oauth_token_refresh_lock_released",
  "tengu_query_error",
  "tengu_tool_use_error",
  "tengu_tool_use_success"
])

// Allowed tag fields for ddtags
sM7 = [
  "arch", "clientType", "errorType", "http_status_range", "http_status",
  "model", "platform", "provider", "toolName", "userType", "version", "versionBase"
]
```

---

## 4. Segment Integration

### 4.1 Dz0 (sendToSegment) - Analytics Event Tracking

```javascript
// ============================================
// sendToSegment - Send event to Segment Analytics
// Location: chunks.110.mjs:1146-1169
// ============================================

// ORIGINAL (for source lookup):
async function Dz0(A, Q) {
  let B = await ij2();
  if (!B) return;
  try {
    let G = ei1(),
      Z = v3(),
      Y = await dn({
        model: Q.model
      }),
      J = EeQ(Y, Q),
      X = {
        anonymousId: G,
        event: A,
        properties: J
      };
    if (Z) {
      let I = cn(!0);
      X.userId = I.userID, X.properties.accountUuid = Z.accountUuid, X.properties.organizationUuid = Z.organizationUuid
    }
    B.track(X)
  } catch (G) {
    e(G instanceof Error ? G : Error(String(G)))
  }
}

// READABLE (for understanding):
async function sendToSegment(eventName, metadata) {
  let analyticsClient = await getSegmentAnalytics();
  if (!analyticsClient) return;

  try {
    let anonymousId = getAnonymousId();
    let oauthAccount = getOAuthAccount();
    let envContext = await getEnvironmentContext({ model: metadata.model });
    let transformedProperties = transformEventProperties(envContext, metadata);

    let trackPayload = {
      anonymousId: anonymousId,
      event: eventName,
      properties: transformedProperties
    };

    // Add user identity if authenticated
    if (oauthAccount) {
      let userIdentity = getUserIdentity(true);
      trackPayload.userId = userIdentity.userID;
      trackPayload.properties.accountUuid = oauthAccount.accountUuid;
      trackPayload.properties.organizationUuid = oauthAccount.organizationUuid;
    }

    analyticsClient.track(trackPayload);
  } catch (error) {
    logError(error);
  }
}

// Mapping: Dz0→sendToSegment, A→eventName, Q→metadata, B→analyticsClient,
// ij2→getSegmentAnalytics, G→anonymousId, ei1→getAnonymousId,
// Z→oauthAccount, v3→getOAuthAccount, Y→envContext, dn→getEnvironmentContext,
// J→transformedProperties, EeQ→transformEventProperties, cn→getUserIdentity
```

**What it does:** Sends analytics events to Segment with user identity enrichment.

**How it works:**
1. **Get client** - lazily initializes Segment Analytics client via `ij2()`
2. **Guard clause** - returns early if analytics unavailable
3. **Build context** - gets anonymous ID, OAuth account, and environment context
4. **Transform properties** - merges and transforms event metadata
5. **Add identity** - if authenticated, adds userId, accountUuid, organizationUuid
6. **Track event** - calls Segment's `track()` method

**Why this approach:**
- **Anonymous + identified** - supports both logged-out and logged-in users
- **Environment context** - includes model, version, OS for all events
- **Organization tracking** - enables per-org analytics for enterprise

**Key insight:** The `anonymousId` is generated once per device/installation and persists across sessions. When a user authenticates, the `userId` is added to link anonymous and identified events.

### 4.2 Segment Configuration

```javascript
// Location: chunks.110.mjs:1207-1209
ok5 = {
  production: "LKJN8LsLERHEOXkw487o7qCTFOrGPimI",
  development: "b64sf1kxwDGe1PiSAlv5ixuH0f509RKK"
};

// Segment client initialization (memoized)
ij2 = W0(async () => {
  if (!await sk5()) return null;  // Check if telemetry enabled
  try {
    return DD1 = new lj2.Analytics({
      writeKey: rk5()  // Gets production or development key
    }),
    process.on("beforeExit", async () => {
      await DD1?.closeAndFlush()  // Graceful shutdown
    }),
    ...
  }
});
```

**Segment Write Keys:**
- Production: `LKJN8LsLERHEOXkw487o7qCTFOrGPimI`
- Development: `b64sf1kxwDGe1PiSAlv5ixuH0f509RKK`

---

## 5. OpenTelemetry (1P) Integration

### 4.1 IKB (initializeOpenTelemetry) - LoggerProvider Setup

```javascript
// ============================================
// initializeOpenTelemetry - Initialize OTEL LoggerProvider for 1P events
// Location: chunks.51.mjs:652-698
// ============================================

// ORIGINAL (for source lookup):
function IKB() {
  if (x9("1p_event_logging_start"), !VMA()) return;
  let Q = HMA("tengu_1p_event_batch_config", {});
  x9("1p_event_after_growthbook_config");
  let B = Q.scheduledDelayMillis || parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || y18.toString()),
    G = Q.maxExportBatchSize || v18,
    Z = Q.maxQueueSize || k18,
    Y = $Q(),
    J = {
      [O11.ATTR_SERVICE_NAME]: "claude-code",
      [O11.ATTR_SERVICE_VERSION]: {...}.VERSION
    };
  if (Y === "wsl") {
    let D = Z1A();
    if (D) J["wsl.version"] = D
  }
  let X = JKB.resourceFromAttributes(J),
    I = new ua1({
      maxBatchSize: G
    });
  NXA = new L11.LoggerProvider({
    resource: X,
    processors: [new L11.BatchLogRecordProcessor(I, {
      scheduledDelayMillis: B,
      maxExportBatchSize: G,
      maxQueueSize: Z
    })]
  }), KMA = NXA.getLogger("com.anthropic.claude_code.events", {...}.VERSION),
  C6(async () => {
    await NXA?.forceFlush()
  }), process.on("beforeExit", async () => {
    await NXA?.forceFlush()
  })
}

// READABLE (for understanding):
function initializeOpenTelemetry() {
  telemetryMarker("1p_event_logging_start");

  // Skip if telemetry disabled
  if (!isTelemetryEnabled()) return;

  // Get batch configuration from GrowthBook
  let batchConfig = getGrowthBookFeature("tengu_1p_event_batch_config", {});
  telemetryMarker("1p_event_after_growthbook_config");

  // Configuration with defaults
  let scheduledDelayMs = batchConfig.scheduledDelayMillis ||
    parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || "5000");
  let maxBatchSize = batchConfig.maxExportBatchSize || 200;
  let maxQueueSize = batchConfig.maxQueueSize || 8192;

  // Build resource attributes
  let resourceAttrs = {
    [ATTR_SERVICE_NAME]: "claude-code",
    [ATTR_SERVICE_VERSION]: "2.1.7"
  };

  // Add WSL version if applicable
  if (getPlatform() === "wsl") {
    let wslVersion = getWslVersion();
    if (wslVersion) resourceAttrs["wsl.version"] = wslVersion;
  }

  // Create resource and exporter
  let resource = resourceFromAttributes(resourceAttrs);
  let exporter = new AnthropicLogExporter({ maxBatchSize });

  // Initialize LoggerProvider
  loggerProvider = new LoggerProvider({
    resource: resource,
    processors: [new BatchLogRecordProcessor(exporter, {
      scheduledDelayMillis: scheduledDelayMs,
      maxExportBatchSize: maxBatchSize,
      maxQueueSize: maxQueueSize
    })]
  });

  // Get logger instance
  eventLogger = loggerProvider.getLogger("com.anthropic.claude_code.events", "2.1.7");

  // Register graceful shutdown
  onCleanup(async () => {
    await loggerProvider?.forceFlush();
  });

  process.on("beforeExit", async () => {
    await loggerProvider?.forceFlush();
  });
}

// Mapping: IKB→initializeOpenTelemetry, x9→telemetryMarker, VMA→isTelemetryEnabled,
// HMA→getGrowthBookFeature, y18→DEFAULT_DELAY(5000), v18→DEFAULT_BATCH_SIZE(200),
// k18→DEFAULT_QUEUE_SIZE(8192), NXA→loggerProvider, KMA→eventLogger,
// ua1→AnthropicLogExporter, L11→LoggerProvider, C6→onCleanup
```

**What it does:** Initializes OpenTelemetry LoggerProvider for first-party event logging to Anthropic.

**Configuration Defaults:**

| Constant | Value | Description |
|----------|-------|-------------|
| `y18` | 5000ms | Log export interval |
| `v18` | 200 | Max batch size |
| `k18` | 8192 | Max queue size |

**Key insight:** The 1P logger uses a custom `ua1` (AnthropicLogExporter) that sends events to Anthropic's backend rather than a standard OTLP endpoint.

---

### 4.2 ca1 (sendTo1PLogger) - Event Emission

```javascript
// ============================================
// sendTo1PLogger - Emit event via OpenTelemetry logger
// Location: chunks.51.mjs:615-619
// ============================================

// ORIGINAL (for source lookup):
function ca1(A, Q = {}) {
  if (!VMA()) return;
  if (!KMA) return;
  S18(KMA, A, Q)
}

// READABLE (for understanding):
function sendTo1PLogger(eventName, metadata = {}) {
  if (!isTelemetryEnabled()) return;
  if (!eventLogger) return;
  emitLogRecord(eventLogger, eventName, metadata);
}

// Mapping: ca1→sendTo1PLogger, VMA→isTelemetryEnabled, KMA→eventLogger, S18→emitLogRecord
```

---

### 4.3 S18 (emitLogRecord) - Log Record Building

```javascript
// ============================================
// emitLogRecord - Build and emit structured log record
// Location: chunks.51.mjs:594-613
// ============================================

// ORIGINAL (for source lookup):
async function S18(A, Q, B = {}) {
  try {
    let G = await dn({
        model: B.model
      }),
      Z = {
        event_name: Q,
        event_id: YKB(),
        core_metadata: G,
        user_metadata: RQA(!0),
        event_metadata: B
      },
      Y = xu();
    if (Y) Z.user_id = Y;
    A.emit({
      body: Q,
      attributes: Z
    })
  } catch (G) {}
}

// READABLE (for understanding):
async function emitLogRecord(logger, eventName, metadata = {}) {
  try {
    let coreMetadata = await getEnvironmentContext({ model: metadata.model });

    let attributes = {
      event_name: eventName,
      event_id: generateEventId(),
      core_metadata: coreMetadata,
      user_metadata: getUserMetadata(true),
      event_metadata: metadata
    };

    let userId = getUserId();
    if (userId) attributes.user_id = userId;

    logger.emit({
      body: eventName,
      attributes: attributes
    });
  } catch (error) {
    // Silently fail
  }
}

// Mapping: S18→emitLogRecord, dn→getEnvironmentContext, YKB→generateEventId,
// RQA→getUserMetadata, xu→getUserId
```

---

## 6. Feature Gate System

### 6.1 Feature Gate Functions

```javascript
// ============================================
// isSegmentEnabled / isDatadogEnabled - Check feature gates
// Location: chunks.155.mjs:1934-1950
// ============================================

// ORIGINAL (for source lookup):
function oN9() {
  if (Yy0 !== void 0) return Yy0;
  try {
    return f8(nN9)  // "tengu_log_segment_events"
  } catch {
    return !1
  }
}

function rN9() {
  if (Jy0 !== void 0) return Jy0;
  try {
    return f8(aN9)  // "tengu_log_datadog_events"
  } catch {
    return !1
  }
}

// READABLE (for understanding):
function isSegmentEnabled() {
  if (segmentEnabledCache !== undefined) return segmentEnabledCache;
  try {
    return checkFeatureGate("tengu_log_segment_events");
  } catch {
    return false;
  }
}

function isDatadogEnabled() {
  if (datadogEnabledCache !== undefined) return datadogEnabledCache;
  try {
    return checkFeatureGate("tengu_log_datadog_events");
  } catch {
    return false;
  }
}

// Mapping: oN9→isSegmentEnabled, rN9→isDatadogEnabled, f8→checkFeatureGate,
// Yy0→segmentEnabledCache, Jy0→datadogEnabledCache,
// nN9→"tengu_log_segment_events", aN9→"tengu_log_datadog_events"
```

**What it does:** Checks GrowthBook/Statsig feature gates to determine routing destinations.

**Gate Names:**
- `tengu_log_segment_events` - Controls Segment routing
- `tengu_log_datadog_events` - Controls Datadog routing

---

## 7. Cross-References with Other Systems

### 7.1 Plan Mode Telemetry

Plan mode has dedicated telemetry events tracked in `chunks.150.mjs:2440-2612`:

| Event | Properties | Description |
|-------|------------|-------------|
| `tengu_plan_exit` | `planLengthChars`, `outcome`, `clearContext` | User exits plan mode |
| `tengu_plan_external_editor_used` | (none) | User opens plan in external editor via Ctrl+G |

**Outcome Values:**
- `yes-bypass-permissions` - Accept, bypass future permissions
- `yes-bypass-permissions-keep-context` - Accept, bypass permissions, keep context
- `yes-accept-edits` - Accept, auto-accept edits
- `yes-accept-edits-keep-context` - Accept, auto-accept edits, keep context
- `yes-default` - Accept with manual approval
- `yes-default-keep-context` - Accept with manual approval, keep context
- `no` - Reject, keep planning

**Code Example:**
```javascript
// Location: chunks.150.mjs:2469-2474
l("tengu_plan_exit", {
  planLengthChars: O.length,
  outcome: S,
  clearContext: !1
})
```

---

### 7.2 Tool Telemetry

Tool execution telemetry is tracked in `chunks.134.mjs`:

| Event | Location | Properties |
|-------|----------|------------|
| `tengu_tool_use_success` | :992-1006 | `messageID`, `toolName`, `isMcp`, `durationMs`, `toolResultSizeBytes`, `queryChainId`, `queryDepth` |
| `tengu_tool_use_error` | :1073-1086 | `messageID`, `toolName`, `error`, `isMcp`, `queryChainId`, `queryDepth` |
| `tengu_tool_use_cancelled` | :698-710 | `toolName`, `toolUseID`, `isMcp` |
| `tengu_tool_use_can_use_tool_allowed` | :916-926 | `messageID`, `toolName`, `queryChainId`, `queryDepth` |
| `tengu_tool_use_can_use_tool_rejected` | :889-900 | `messageID`, `toolName`, `queryChainId`, `queryDepth` |

**Permission Tracking Events (chunks.152.mjs):**
- `tengu_tool_use_granted_in_config` - Permission from config
- `tengu_tool_use_granted_in_prompt_temporary` - User granted temporary permission
- `tengu_tool_use_granted_in_prompt_permanent` - User granted permanent permission
- `tengu_tool_use_granted_by_permission_hook` - Hook approved
- `tengu_tool_use_denied_in_config` - Denied by config
- `tengu_tool_use_rejected_in_prompt` - User rejected
- `tengu_tool_use_show_permission_request` - Permission UI shown

**Code Example:**
```javascript
// Location: chunks.134.mjs:992-1006
l("tengu_tool_use_success", {
  messageID: J,
  toolName: k9(A.name),  // Obfuscated name
  isMcp: A.isMcp ?? !1,
  durationMs: x,
  toolResultSizeBytes: S,
  queryChainId: G.queryTracking?.chainId,
  queryDepth: G.queryTracking?.depth,
  ...I ? { mcpServerType: I } : {},
  ...X ? { requestId: X } : {}
});
```

---

### 7.3 System Reminder Telemetry

System reminders are tracked via attachment computation telemetry in `chunks.131.mjs`:

| Event | Location | Properties |
|-------|----------|------------|
| `tengu_attachment_compute_duration` | :3148-3163 | `label`, `duration_ms`, `attachment_size_bytes`, `attachment_count` |

**Attachment Types with Telemetry:**
- `critical_system_reminder` - Experimental system reminder
- `todo_reminder` - Todo list reminders
- `plan_mode` - Plan mode context
- `plan_mode_exit` - Plan mode exit notification
- `changed_files` - File change context
- `nested_memory` - Memory context

**Span Attributes (chunks.91.mjs:3530-3537):**
```javascript
span.setAttributes({
  system_reminders: truncatedContent,        // Content (max 60KB)
  system_reminders_count: reminderCount,     // Count of reminders
  system_reminders_truncated: wasTruncated,  // Boolean
  system_reminders_original_length: originalLength  // Pre-truncation size
});
```

**Sampling:** Attachment telemetry is sampled at 5% (`Math.random() < 0.05`).

---

## 8. Telemetry Events Catalog

### 8.1 Event Categories (Comprehensive)

#### API & Model Events
| Event | Description |
|-------|-------------|
| `tengu_api_error` | API call failed |
| `tengu_api_success` | API call succeeded |
| `tengu_api_query` | API query initiated |
| `tengu_api_retry` | API retry attempted |
| `tengu_model_fallback_triggered` | Model fallback occurred |
| `tengu_unknown_model_cost` | Unknown model cost lookup |

#### Tool Events
| Event | Description |
|-------|-------------|
| `tengu_tool_use_success` | Tool executed successfully |
| `tengu_tool_use_error` | Tool execution failed |
| `tengu_tool_use_cancelled` | Tool use cancelled |
| `tengu_tool_use_can_use_tool_allowed` | Permission check passed |
| `tengu_tool_use_can_use_tool_rejected` | Permission check failed |
| `tengu_tool_use_granted_in_config` | Permission from config |
| `tengu_tool_use_granted_in_prompt_temporary` | User granted temp permission |
| `tengu_tool_use_granted_in_prompt_permanent` | User granted permanent permission |
| `tengu_tool_use_granted_by_permission_hook` | Hook granted permission |
| `tengu_tool_use_denied_in_config` | Denied by config |
| `tengu_tool_use_rejected_in_prompt` | User rejected in prompt |
| `tengu_tool_use_show_permission_request` | Permission UI displayed |
| `tengu_agent_tool_selected` | Agent tool selected |
| `tengu_skill_tool_invocation` | Skill tool invoked |
| `tengu_skill_tool_slash_prefix` | Skill invoked via slash prefix |

#### Plan Mode Events
| Event | Description |
|-------|-------------|
| `tengu_plan_exit` | User exits plan mode |
| `tengu_plan_external_editor_used` | External editor opened via Ctrl+G |

#### OAuth & Authentication Events
| Event | Description |
|-------|-------------|
| `tengu_oauth_success` | OAuth completed successfully |
| `tengu_oauth_error` | OAuth failed |
| `tengu_oauth_manual_entry` | Manual auth code entry used |
| `tengu_oauth_storage_warning` | OAuth token storage warning |
| `tengu_oauth_tokens_saved` | OAuth tokens saved |
| `tengu_oauth_tokens_save_failed` | OAuth tokens save failed |
| `tengu_oauth_tokens_not_claude_ai` | Not a Claude.ai token |
| `tengu_oauth_tokens_inference_only` | Inference-only token |
| `tengu_oauth_401_recovered_from_keychain` | Recovered from 401 via keychain |
| `tengu_oauth_token_refresh_lock_acquiring` | Acquiring refresh lock |
| `tengu_oauth_token_refresh_lock_acquired` | Refresh lock acquired |
| `tengu_oauth_token_refresh_lock_retry` | Lock acquisition retry |
| `tengu_oauth_token_refresh_lock_error` | Lock acquisition error |
| `tengu_oauth_token_refresh_starting` | Token refresh starting |
| `tengu_oauth_token_refresh_race_resolved` | Race condition resolved |
| `tengu_oauth_token_refresh_race_recovered` | Recovered from race |
| `tengu_oauth_token_refresh_lock_releasing` | Releasing refresh lock |
| `tengu_oauth_token_refresh_lock_released` | Refresh lock released |

#### API Key Events
| Event | Description |
|-------|-------------|
| `tengu_api_key_saved_to_keychain` | API key saved to OS keychain |
| `tengu_api_key_keychain_error` | Keychain save error |
| `tengu_api_key_saved_to_config` | API key saved to config file |
| `tengu_apiKeyHelper_missing_trust11` | API key helper trust check failed |
| `tengu_awsAuthRefresh_missing_trust` | AWS auth refresh trust check failed |
| `tengu_awsCredentialExport_missing_trust` | AWS credential export trust check failed |

#### MCP Events
| Event | Description |
|-------|-------------|
| `tengu_mcp_auth_config_authenticate` | MCP auth config authenticated |
| `tengu_mcp_auth_config_clear` | MCP auth config cleared |
| `tengu_claudeai_mcp_auth_started` | Claude.ai MCP auth started |
| `tengu_claudeai_mcp_auth_completed` | Claude.ai MCP auth completed |
| `tengu_claudeai_mcp_clear_auth_started` | Claude.ai MCP clear auth started |
| `tengu_claudeai_mcp_clear_auth_completed` | Claude.ai MCP clear auth completed |
| `tengu_claudeai_mcp_toggle` | Claude.ai MCP toggled |
| `tengu_claudeai_mcp_reconnect` | Claude.ai MCP reconnected |

#### Marketplace & Plugin Events
| Event | Description |
|-------|-------------|
| `tengu_marketplace_added` | Marketplace item added |
| `tengu_marketplace_removed` | Marketplace item removed |
| `tengu_marketplace_updated` | Marketplace item updated |
| `tengu_plugin_installed` | Plugin installed |

#### UI Interaction Events
| Event | Description |
|-------|-------------|
| `tengu_status_line_mount` | Status line UI mounted |
| `tengu_prompt_suggestion` | Prompt suggestion shown |
| `tengu_help_toggled` | Help panel toggled |
| `tengu_paste_image` | Image pasted |
| `tengu_paste_text` | Text pasted |
| `tengu_ext_at_mentioned` | External @ mention |
| `tengu_external_editor_used` | External editor used for prompt |
| `tengu_mode_cycle` | Mode cycled via hotkey |
| `tengu_model_picker_hotkey` | Model picker opened via hotkey |
| `tengu_thinking_toggled_hotkey` | Thinking mode toggled via hotkey |
| `tengu_code_change_view_opened` | Code change view opened |
| `tengu_timer` | Timer event |
| `tengu_toggle_todos` | Todo list toggled |
| `tengu_cancel` | User cancelled operation |
| `tengu_ext_ide_command` | IDE integration command |

#### GitHub Actions Events
| Event | Description |
|-------|-------------|
| `tengu_setup_github_actions_started` | GitHub Actions setup started |
| `tengu_setup_github_actions_completed` | GitHub Actions setup completed |
| `tengu_setup_github_actions_failed` | GitHub Actions setup failed |
| `tengu_install_github_app_started` | GitHub App installation started |
| `tengu_install_github_app_step_completed` | GitHub App install step completed |
| `tengu_install_github_app_error` | GitHub App installation error |

#### Config & Session Events
| Event | Description |
|-------|-------------|
| `tengu_init` | Session initialized |
| `tengu_session_resumed` | Session resumed |
| `tengu_query_error` | Query error occurred |
| `tengu_config_cache_stats` | Config cache statistics |
| `tengu_config_lock_contention` | Config file lock contention |
| `tengu_config_stale_write` | Stale config write detected |
| `tengu_config_parse_error` | Config parsing error |
| `tengu_worktree_detection` | Git worktree detected |
| `tengu_file_changed` | File changed notification |

#### Compact Events
| Event | Description |
|-------|-------------|
| `tengu_compact` | Compaction performed |
| `tengu_compact_failed` | Compaction failed |

#### Performance Events
| Event | Description |
|-------|-------------|
| `tengu_startup_perf` | Startup performance metrics |
| `tengu_attachment_compute_duration` | Attachment computation time |

---

## 9. Configuration Reference

### 9.1 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_LOGS_EXPORT_INTERVAL` | 5000ms | Log batch export interval |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | - | Enable telemetry |
| `DISABLE_TELEMETRY` | - | Disable all telemetry |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | - | Disable optional telemetry |
| `CLAUDE_CODE_PROFILE_STARTUP` | - | Enable startup profiling |

### 9.2 GrowthBook Features

| Feature | Purpose |
|---------|---------|
| `tengu_log_segment_events` | Enable Segment routing |
| `tengu_log_datadog_events` | Enable Datadog routing |
| `tengu_event_sampling_config` | Per-event sample rates |
| `tengu_1p_event_batch_config` | 1P logger batch settings |

### 9.3 Batch Configuration Defaults

| Parameter | Default | Description |
|-----------|---------|-------------|
| `scheduledDelayMillis` | 5000 | Export interval |
| `maxExportBatchSize` | 200 | Max events per batch |
| `maxQueueSize` | 8192 | Max queued events |

---

## Summary

Claude Code v2.1.7's telemetry system provides:

1. **Multi-destination routing** - Events flow to Sentry, Segment, Datadog, and Anthropic 1P
2. **Event sampling** - Probabilistic sampling via GrowthBook configuration
3. **Feature gates** - Statsig/GrowthBook controls for destination enablement
4. **Batching** - Datadog (100 events/15s) and OTEL (200 events/5s) batch buffering
5. **Data normalization** - Anonymizes sensitive data (MCP tools, non-Claude models)
6. **Performance profiling** - Startup checkpoint marking with memory tracking
7. **Cross-system integration** - Telemetry embedded in plan mode, tools, system reminders
8. **Graceful shutdown** - Flushes pending data before process exit
9. **Privacy controls** - Respects telemetry disable flags
