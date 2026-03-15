# Module: Telemetry & Logging (17)

## Overview

The Telemetry system in Claude Code v2.1.76 is designed for "Privacy-First" event reporting. It uses a tiered approach where events are buffered locally, sanitized at the call site, and then dispatched to multiple sinks (Segment, Datadog, and an internal OpenTelemetry collector) using configurable sampling rates.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `logEvent` (c) - Global entry point for synchronous event logging.
- `attachAnalyticsSink` (ziA) - Connects the actual telemetry providers to the global logger.
- `getUserMetadata` (tp) - Collects non-sensitive user/session info for event context.
- `getSanitizedCommandType` (z_q) - Strips sensitive arguments from shell commands before logging.
- `logToInternalCollector` (FX6) - Forwards events to the OpenTelemetry-based internal pipeline.

---

## Core Algorithms

### Privacy-Preserving Command Logging

**What it does:**
Ensures that shell commands executed by the agent are logged without sensitive data (like file paths, credentials, or personal names) contained in the arguments.

**How it works:**
1.  **Whitelisting**: The system maintains a list of "safe" command binaries (`TYz`) such as `git`, `npm`, `pnpm`, `python`, etc.
2.  **Extraction**: When `logEvent` is called for a command execution, it invokes `getSanitizedCommandType` (z_q).
3.  **Filtering**:
    - The full command string is split into words.
    - If the first word (the binary) is in the whitelist, only that word is returned.
    - If the binary is unknown, it returns `"other"`.
4.  **Payload Construction**: The final telemetry event contains the sanitized command type (e.g., `command_type: "npm"`) but never the full command line.

**Why this approach:**
- **Regulatory Compliance**: Prevents accidental collection of PII (Personally Identifiable Information) or proprietary code paths.
- **Developer Trust**: Users can see that only high-level usage patterns are reported, not their actual work.

---

### Tiered Event Dispatching

**What it does:**
Manages the flow of telemetry data from the agent to various cloud providers with buffering and sampling.

**How it works:**
1.  **Buffering**: Before the analytics sink is attached (during early startup), events are stored in a simple array (`VN1`).
2.  **Attachment**: Once the session is initialized, `attachAnalyticsSink` (ziA) is called. It flushes the buffer and redirects all future calls to the active provider.
3.  **Sampling**: For each event, `BX6` checks a remote configuration (`tengu_event_sampling_config`) to determine if the event should be skipped based on its name and a random roll.
4.  **Multi-sink Routing**:
    - **Segment**: Used for product analytics.
    - **Datadog**: Used for performance monitoring and error tracking.
    - **OTEL**: Internal Anthropic pipeline for deep system analysis.

**Key insight:** The `getUserMetadata` (tp) function is memoized using `KA`, ensuring that session-constant data like `deviceId` and `subscriptionType` are calculated only once, reducing overhead for every event.

---

## New in v2.1.76

### Session Quality Survey (`feedbackSurveyRate`)

v2.1.76 introduces a configurable session quality survey. The `feedbackSurveyRate` setting in `settings.json` controls the probability (0.0–1.0) that a quality survey prompt is shown at the end of a session.

**How it works:**
- `feedbackSurveyRate` defaults to a low value (e.g., 0.1 = 10% of sessions).
- At session end, a random float is compared against `feedbackSurveyRate`. If below the threshold, a brief survey is shown asking the user to rate the session quality.
- The survey result is captured in the `feedbackSurvey` AppState field (`{ timeLastShown, submitCountAtLastAppearance }`) and emitted as a telemetry event.
- Survey responses are logged via the standard `logEvent` / OTEL pipeline rather than a separate system.

### `speed` Attribute in OTel Events (Fast Mode)

When fast mode is active, the internal OpenTelemetry event for each API call is now annotated with a `speed` attribute (e.g., `speed: "fast"` vs `speed: "standard"`). This allows Anthropic engineering to correlate latency distributions with the fast-mode routing path in dashboards.

**Integration point:** `logToInternalCollector` (FX6) reads the current `isFastMode` state from the session context and appends `speed: isFastMode ? "fast" : "standard"` to the OTel span attributes before flushing.

### `tool_decision` OTel Event Fix (Headless Mode)

In v2.1.38, the `tool_decision` OTel event was silently dropped in headless (non-interactive) mode because the permission context was not available in that code path. v2.1.76 fixes this by always emitting `tool_decision` regardless of interactive mode, using a fallback permission context when the UI-bound context is unavailable.

---

## Code Implementation (Deobfuscated)

### getSanitizedCommandType - Privacy filter for terminal commands
// Location: chunks.170.mjs:260-268

// ORIGINAL (for source lookup):
```javascript
function z_q(A) {
    let q = AD(A);
    if (q.length === 0) return "other";
    for (let K of q) {
        let Y = K.split(" ")[0] || "";
        if (TYz.includes(Y)) return Y
    }
    return "other"
}
```

// READABLE (for understanding):
```javascript
/**
 * Sanitizes a command string for telemetry by only returning the base command if it's whitelisted.
 * @param {string} command - The raw command string
 * @returns {string} The name of the command or "other"
 */
function getSanitizedCommandType(command) {
    // AD splits the command into individual statements (handling pipes/semicolons)
    const statements = splitCommandStatements(command);

    if (statements.length === 0) return "other";

    // Check each statement in the command
    for (const statement of statements) {
        const binaryName = statement.trim().split(" ")[0] || "";

        // SAFE_COMMAND_WHITELIST includes "git", "npm", "ls", "grep", etc.
        if (SAFE_COMMAND_WHITELIST.includes(binaryName)) {
            return binaryName;
        }
    }

    return "other";
}
```

// Mapping: z_q→getSanitizedCommandType, A→command, q→statements, TYz→SAFE_COMMAND_WHITELIST

---

### getUserMetadata - Standard event context
// Location: chunks.174.mjs:2022-2065

// ORIGINAL (for source lookup):
```javascript
tp = KA((A) => {
    let q = Lh(), K = f6(), Y, z, w;
    if (A) {
        if (Y = dK() ?? void 0, z = Sn() ?? void 0, Y && K.claudeCodeFirstTokenDate) {
            let _ = new Date(K.claudeCodeFirstTokenDate).getTime();
            if (!isNaN(_)) w = _
        }
    }
    let H = u3(), $ = H?.organizationUuid, O = H?.accountUuid;
    return {
        deviceId: q,
        sessionId: U6(),
        email: Jwz(),
        appVersion: "2.1.76",
        platform: xA.platform,
        organizationUuid: $,
        accountUuid: O,
        userType: "external",
        subscriptionType: Y,
        rateLimitTier: z,
        firstTokenTime: w
    }
})
```

// READABLE (for understanding):
```javascript
/**
 * Collects metadata about the current user and environment for telemetry.
 * @param {boolean} includeExtendedInfo - Whether to include billing/tier info
 */
const getUserMetadata = memoize((includeExtendedInfo) => {
    const deviceId = getDeviceId();
    const config = getGlobalConfig();

    let subType, rateLimitTier, firstUseTimestamp;

    if (includeExtendedInfo) {
        subType = getSubscriptionType() || undefined;
        rateLimitTier = getRateLimitTier() || undefined;

        if (subType && config.claudeCodeFirstTokenDate) {
            const date = new Date(config.claudeCodeFirstTokenDate).getTime();
            if (!isNaN(date)) firstUseTimestamp = date;
        }
    }

    const auth = getAuthInfo();

    return {
        deviceId: deviceId,
        sessionId: getSessionId(),
        email: getMaskedEmail(),
        appVersion: "2.1.76",
        platform: process.platform,
        organizationUuid: auth?.organizationUuid,
        accountUuid: auth?.accountUuid,
        userType: "external",
        subscriptionType: subType,
        rateLimitTier: rateLimitTier,
        firstTokenTime: firstUseTimestamp
    };
});
```

// Mapping: tp→getUserMetadata, q→deviceId, K→config, Y→subType, z→rateLimitTier, w→firstUseTimestamp
