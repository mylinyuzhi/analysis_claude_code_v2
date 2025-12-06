# Telemetry and Observability

## Overview

Claude Code v2.0.59 implements comprehensive telemetry using **OpenTelemetry** for distributed tracing and metrics, plus **Sentry** for error tracking. The implementation is found in `chunks.117.mjs` and `chunks.138.mjs`.

## Telemetry Functions

### M9() - Telemetry Markers

The `M9()` function emits telemetry markers throughout the application lifecycle:

```javascript
M9("run_function_start")           // hu3() starts
M9("run_commander_initialized")     // Commander created
M9("preAction_start")              // Pre-action hook starts
M9("preAction_after_init")         // After initialization
M9("preAction_after_migrations")   // After migrations
M9("action_handler_start")         // Main action starts
M9("action_mcp_configs_loaded")    // MCP configs loaded
M9("action_after_input_prompt")    // Prompt processed
M9("action_tools_loaded")          // Tools loaded
M9("action_before_setup")          // Before setup
M9("action_after_setup")           // After setup
M9("action_commands_loaded")       // Commands loaded
M9("action_after_plugins_init")    // Plugins initialized
M9("action_after_hooks")           // Hooks executed
M9("run_before_parse")             // Before parsing
M9("run_after_parse")              // After parsing
M9("main_after_run")               // Main execution done
M9("cli_version_fast_path")        // Version fast path
M9("cli_before_main_import")       // Before main import
M9("cli_after_main_import")        // After main import
M9("cli_after_main_complete")      // CLI complete
M9("cli_ripgrep_path")             // Ripgrep mode
```

### GA() - Analytics Events

The `GA()` function sends analytics events with structured data:

```javascript
GA("tengu_init", {
  entrypoint: "claude",
  hasInitialPrompt: A,
  hasStdin: Q,
  verbose: B,
  debug: G,
  debugToStderr: Z,
  print: I,
  outputFormat: Y,
  inputFormat: J,
  numAllowedTools: W,
  numDisallowedTools: X,
  mcpClientCount: V,
  worktree: F,
  skipWebFetchPreflight: K,
  dangerouslySkipPermissionsPassed: H,
  modeIsBypass: C,
  allowDangerouslySkipPermissionsPassed: E,
  systemPromptFlag: U,
  appendSystemPromptFlag: q
});
```

### Event Categories

#### Initialization Events

```javascript
GA("tengu_init", { /* ... */ })
GA("tengu_code_prompt_ignored", {})
GA("tengu_single_word_prompt", { length: Y.length })
```

#### MCP Events

```javascript
GA("tengu_mcp_start", {})
GA("tengu_mcp_add", {
  type: F,
  scope: V,
  source: "command",
  transport: F,
  transportExplicit: K,
  looksLikeUrl: D
})
GA("tengu_mcp_delete", { name: Y, scope: D })
GA("tengu_mcp_list", {})
GA("tengu_mcp_get", { name: Y })
GA("tengu_mcp_cli_command_executed", {
  command: A,
  success: true,
  duration_ms: Date.now() - Z,
  // ... more fields
})
```

#### Plugin Events

```javascript
GA("tengu_plugin_install_command", { plugin: Y })
GA("tengu_plugin_uninstall_command", { plugin: Y })
GA("tengu_plugin_enable_command", { plugin: Y })
GA("tengu_plugin_disable_command", { plugin: Y })
GA("tengu_marketplace_added", { source_type: V })
GA("tengu_marketplace_removed", { marketplace_name: Y })
GA("tengu_marketplace_updated", { marketplace_name: Y })
GA("tengu_marketplace_updated_all", { count: W.length })
```

#### Session Events

```javascript
GA("tengu_continue", {})
GA("tengu_session_resumed", { entrypoint: "cli_flag" })
GA("tengu_teleport_interactive_mode", {})
GA("tengu_teleport_resume_session", { mode: "direct" })
GA("tengu_remote_create_session", { description_length: String(NA.length) })
GA("tengu_remote_create_session_success", { session_id: K0.id })
GA("tengu_remote_create_session_error", { error: "unable_to_create_session" })
```

#### Privacy/Policy Events

```javascript
GA("tengu_grove_policy_viewed", {
  location: Q,
  dismissable: K?.notice_is_grace_period
})
GA("tengu_grove_policy_submitted", {
  state: true,
  dismissable: I?.notice_is_grace_period
})
GA("tengu_grove_policy_dismissed", { state: true })
GA("tengu_grove_policy_escaped", {})
GA("tengu_grove_privacy_settings_viewed", {})
GA("tengu_grove_print_viewed", { dismissable: Q?.notice_is_grace_period })
```

#### Model Events

```javascript
GA("tengu_startup_manual_model_config", {
  cli_flag: J.model,
  env_var: process.env.ANTHROPIC_MODEL,
  settings_file: ($T() || {}).model,
  subscriptionType: f4(),
  agent: F0
})
```

#### Other Events

```javascript
GA("tengu_doctor_command", {})
GA("tengu_setup_token_command", {})
```

## OpenTelemetry Integration

From `chunks.117.mjs`, Claude Code uses OpenTelemetry for:

### 1. Metrics Collection

```javascript
// Metrics handler setup
this.metricsHandler = Q;
this.queue = new Lk5.PriorityQueue((Z, I) => Z.deadline < I.deadline);

// Metric reading
if (this.metricsHandler) {
  return Object.assign(Object.assign({}, B), {
    onCallEnded: (0, Hq2.createMetricsReader)(
      (G) => this.metricsHandler(G, Q.endpointName),
      B.onCallEnded
    )
  });
}
```

### 2. OTLP Exporters

**OTLP gRPC Metrics Exporter:**

```javascript
super(
  (0, eq2.createOtlpGrpcExportDelegate)(
    (0, eq2.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"),
    ty5.ProtobufMetricsSerializer,
    "MetricsExportService",
    "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"
  ),
  A
)
```

**OTLP gRPC Logs Exporter:**

```javascript
super(
  (0, ON2.createOtlpGrpcExportDelegate)(
    (0, ON2.convertLegacyOtlpGrpcOptions)(A, "LOGS"),
    Lx5.ProtobufLogsSerializer,
    "LogsExportService",
    "/opentelemetry.proto.collector.logs.v1.LogsService/Export"
  )
)
```

**OTLP gRPC Trace Exporter:**

```javascript
super(
  (0, RM2.createOtlpGrpcExportDelegate)(
    (0, RM2.convertLegacyOtlpGrpcOptions)(A, "TRACES"),
    Sv5.ProtobufTraceSerializer,
    "TraceExportService",
    "/opentelemetry.proto.collector.trace.v1.TraceService/Export"
  )
)
```

### 3. Prometheus Exporter

```javascript
endpoint: "/metrics"

// Serialization
for (let B of A.metrics) {
  Q += this._serializeMetricData(B) + `\n`;
}

// Error handling
if (G.length) {
  JRA.diag.error("PrometheusExporter: metrics collection errors", ...G);
}

// Export failure
A.end(`# failed to export metrics: ${Q}`);
```

### 4. Metrics API Check

```javascript
let G = await YQ.get(
  "https://api.anthropic.com/api/claude_code/organizations/metrics_enabled",
  {
    headers: { /* ... */ }
  }
);

g(`Metrics opt-out API response: enabled=${G.data.metrics_logging_enabled}, vcsLinking=${G.data.vcs_account_linking_enabled}`);

return {
  enabled: G.data.metrics_logging_enabled,
  // ...
};
```

## Sentry Error Tracking

Sentry integration for error tracking and crash reporting.

### Error Capture

```javascript
AA(error instanceof Error ? error : Error(String(error)))
```

The `AA()` function sends errors to Sentry with:
- Stack traces
- Context information
- User data (if available)
- Environment details

## Event Structure

### Event Naming Convention

All events follow the `tengu_*` naming pattern:

```javascript
tengu_init
tengu_mcp_*
tengu_plugin_*
tengu_session_*
tengu_grove_*
tengu_startup_*
```

### Event Properties

Events include structured data:

```javascript
{
  // Identifiers
  session_id: "...",
  user_id: "...",

  // Context
  entrypoint: "claude",
  location: "settings",

  // Flags
  hasInitialPrompt: true,
  verbose: false,
  debug: false,

  // Counts
  numAllowedTools: 5,
  mcpClientCount: 3,

  // Timing
  duration_ms: 1234,

  // Success/Error
  success: true,
  error_type: "NetworkError"
}
```

## Telemetry Opt-Out

Users can control telemetry via privacy settings:

```javascript
let [A, Q] = await Promise.all([bYA(), yi()]);

if (zD9(A, Q, !1)) {
  // Show privacy notice
  GA("tengu_grove_print_viewed", {
    dismissable: Q?.notice_is_grace_period
  });
}
```

### Privacy Controls

- **grove_enabled**: User opt-in for data sharing
- **domain_excluded**: Domain-level opt-out
- **notice_is_grace_period**: Grace period for compliance

## Metrics Collection

### Performance Metrics

```javascript
// Duration tracking
let Y = Date.now();
// ... operation ...
let duration_ms = Date.now() - Y;

GA("tengu_operation", {
  duration_ms,
  success: true
});
```

### Counter Metrics

```javascript
// Count operations
GA("tengu_mcp_cli_command_executed", {
  command: A,
  success: true,
  // ... counters
});
```

### Gauge Metrics

```javascript
// Current state
GA("tengu_init", {
  mcpClientCount: V,
  numAllowedTools: W,
  numDisallowedTools: X
});
```

## Logging Integration

Telemetry markers integrate with logging:

```javascript
M9("action_handler_start");
g("Starting action handler");  // Log function

// ... operation ...

M9("action_handler_complete");
```

## Distributed Tracing

OpenTelemetry provides distributed tracing across:
- CLI invocations
- MCP server calls
- API requests
- Plugin operations

Trace structure:
- **Span**: Individual operation
- **Trace**: Connected spans
- **Context**: Trace propagation

## Error Tracking Flow

1. **Capture Error**: `AA(error)`
2. **Add Context**: Automatic context from state
3. **Send to Sentry**: Async transmission
4. **Group/Aggregate**: Sentry backend processing
5. **Alert**: Based on error rules

## Privacy-Preserving Telemetry

Claude Code implements privacy-preserving telemetry:

1. **No PII**: Personal information excluded
2. **Aggregated**: Data aggregated before transmission
3. **Opt-out**: User-controlled via settings
4. **Anonymized**: User identifiers hashed
5. **Minimal**: Only essential data collected

## Summary

Claude Code's telemetry system provides:

1. **OpenTelemetry Integration**: Standard observability
2. **Multiple Exporters**: OTLP, Prometheus
3. **Structured Events**: Consistent event schema
4. **Error Tracking**: Sentry integration
5. **Performance Monitoring**: Duration metrics
6. **Lifecycle Tracking**: M9 markers throughout
7. **Privacy Controls**: User opt-out options
8. **Distributed Tracing**: Cross-service correlation
9. **Metrics Collection**: Counters, gauges, histograms
10. **Event Analytics**: GA function for events

This comprehensive telemetry enables:
- Performance optimization
- Error detection and debugging
- Usage analytics
- Feature adoption tracking
- Reliability monitoring
- User experience improvement
