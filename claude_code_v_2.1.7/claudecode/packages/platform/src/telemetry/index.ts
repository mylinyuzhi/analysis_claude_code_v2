/**
 * @claudecode/platform - Telemetry Module
 *
 * Multi-destination telemetry system for Claude Code.
 * Supports OpenTelemetry, Datadog, Segment, and Sentry.
 *
 * Reconstructed from chunks.1.mjs, chunks.51.mjs, chunks.155.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Constants
// ============================================

export {
  OTEL_DEFAULT_CONFIG,
  OTEL_LOGGER_NAME,
  OTEL_SERVICE_NAME,
  DATADOG_CONFIG,
  DATADOG_TRACKED_EVENTS,
  DATADOG_ALLOWED_TAGS,
  SEGMENT_WRITE_KEYS,
  getSegmentConfig,
  FEATURE_GATES,
  TELEMETRY_ENV_VARS,
  PERFORMANCE_CHECKPOINTS,
  EVENT_PREFIX,
  COMMON_EVENTS,
} from './constants.js';

// ============================================
// Core Functions
// ============================================

export {
  // Feature gates
  isTelemetryEnabled,
  isSegmentEnabled,
  isDatadogEnabled,
  checkFeatureGate,
  setFeatureGates,

  // Sampling
  setEventSamplingConfig,
  getSampleRate,

  // Context
  getEnvironmentContext,
  toSnakeCase,

  // Event logging
  logEvent,
  logEventAsync,
  recordTelemetry,
  analyticsEvent,
  analyticsEventAsync,
  trackEvent,
  logStructuredMetric,

  // Provider management
  attachTelemetryProvider,
  registerTelemetryProvider,

  // Performance profiling
  initializeStartupProfiling,
  telemetryMarker,
  getPerformanceCheckpoints,
  clearPerformanceData,

  // Cleanup
  flushTelemetry,
  registerTelemetryCleanup,
} from './core.js';
