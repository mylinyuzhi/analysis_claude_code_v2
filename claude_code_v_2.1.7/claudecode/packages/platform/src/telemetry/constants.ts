/**
 * @claudecode/platform - Telemetry Constants
 *
 * Telemetry system constants.
 * Reconstructed from chunks.51.mjs, chunks.155.mjs
 */

import type { DatadogConfig, SegmentConfig, OtelBatchConfig } from './types.js';

// ============================================
// OpenTelemetry Configuration
// ============================================

/**
 * Default OpenTelemetry batch configuration.
 */
export const OTEL_DEFAULT_CONFIG: OtelBatchConfig = {
  scheduledDelayMillis: 5000,
  maxExportBatchSize: 200,
  maxQueueSize: 8192,
};

/**
 * OpenTelemetry logger name.
 */
export const OTEL_LOGGER_NAME = 'com.anthropic.claude_code.events';

/**
 * OpenTelemetry service name.
 */
export const OTEL_SERVICE_NAME = 'claude-code';

// ============================================
// Datadog Configuration
// ============================================

/**
 * Datadog configuration.
 */
export const DATADOG_CONFIG: DatadogConfig = {
  endpoint: 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs',
  apiKey: 'pubbbf48e6d78dae54bceaa4acf463299bf',
  batchSize: 100,
  flushIntervalMs: 15000,
  httpTimeoutMs: 5000,
};

/**
 * Datadog tracked events whitelist.
 */
export const DATADOG_TRACKED_EVENTS = new Set([
  'tengu_api_error',
  'tengu_api_success',
  'tengu_compact_failed',
  'tengu_model_fallback_triggered',
  'tengu_oauth_error',
  'tengu_oauth_success',
  'tengu_oauth_token_refresh_failure',
  'tengu_oauth_token_refresh_success',
  'tengu_oauth_token_refresh_lock_acquiring',
  'tengu_oauth_token_refresh_lock_acquired',
  'tengu_oauth_token_refresh_starting',
  'tengu_oauth_token_refresh_completed',
  'tengu_oauth_token_refresh_lock_releasing',
  'tengu_oauth_token_refresh_lock_released',
  'tengu_query_error',
  'tengu_tool_use_error',
  'tengu_tool_use_success',
]);

/**
 * Datadog allowed tag fields.
 */
export const DATADOG_ALLOWED_TAGS = [
  'arch',
  'clientType',
  'errorType',
  'http_status_range',
  'http_status',
  'model',
  'platform',
  'provider',
  'toolName',
  'userType',
  'version',
  'versionBase',
] as const;

// ============================================
// Segment Configuration
// ============================================

/**
 * Segment write keys.
 */
export const SEGMENT_WRITE_KEYS: Record<'production' | 'development', string> =
  {
    production: 'LKJN8LsLERHEOXkw487o7qCTFOrGPimI',
    development: 'b64sf1kxwDGe1PiSAlv5ixuH0f509RKK',
  };

/**
 * Get Segment configuration.
 */
export function getSegmentConfig(): SegmentConfig {
  const isDev = process.env.NODE_ENV === 'development';
  return {
    writeKey: isDev
      ? SEGMENT_WRITE_KEYS.development
      : SEGMENT_WRITE_KEYS.production,
    environment: isDev ? 'development' : 'production',
  };
}

// ============================================
// Feature Gate Names
// ============================================

/**
 * Feature gate names for telemetry destinations.
 */
export const FEATURE_GATES = {
  SEGMENT: 'tengu_log_segment_events',
  DATADOG: 'tengu_log_datadog_events',
  EVENT_SAMPLING: 'tengu_event_sampling_config',
  BATCH_CONFIG: 'tengu_1p_event_batch_config',
} as const;

// ============================================
// Environment Variables
// ============================================

/**
 * Telemetry environment variable names.
 */
export const TELEMETRY_ENV_VARS = {
  /** Enable telemetry */
  ENABLE_TELEMETRY: 'CLAUDE_CODE_ENABLE_TELEMETRY',
  /** Disable all telemetry */
  DISABLE_TELEMETRY: 'DISABLE_TELEMETRY',
  /** Disable non-essential traffic */
  DISABLE_NONESSENTIAL: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC',
  /** Enable startup profiling */
  PROFILE_STARTUP: 'CLAUDE_CODE_PROFILE_STARTUP',
  /** OTEL log export interval */
  OTEL_EXPORT_INTERVAL: 'OTEL_LOGS_EXPORT_INTERVAL',
} as const;

// ============================================
// Performance Checkpoint Names
// ============================================

/**
 * Performance checkpoint names for startup profiling.
 */
export const PERFORMANCE_CHECKPOINTS = {
  /** OpenTelemetry initialization starts */
  OTEL_START: '1p_event_logging_start',
  /** GrowthBook config loaded */
  GROWTHBOOK_CONFIG: '1p_event_after_growthbook_config',
  /** Main run function starts */
  RUN_START: 'run_function_start',
  /** Commander.js initialized */
  COMMANDER_INIT: 'run_commander_initialized',
  /** Pre-action hook starts */
  PREACTION_START: 'preAction_start',
  /** Main action handler starts */
  ACTION_START: 'action_handler_start',
  /** MCP configs loaded */
  MCP_LOADED: 'action_mcp_configs_loaded',
  /** Tools loaded */
  TOOLS_LOADED: 'action_tools_loaded',
} as const;

// ============================================
// Event Name Patterns
// ============================================

/**
 * Event name prefix for Claude Code telemetry.
 */
export const EVENT_PREFIX = 'tengu_';

/**
 * Common event names.
 */
export const COMMON_EVENTS = {
  // API events
  API_ERROR: 'tengu_api_error',
  API_SUCCESS: 'tengu_api_success',
  API_QUERY: 'tengu_api_query',
  API_RETRY: 'tengu_api_retry',

  // Tool events
  TOOL_SUCCESS: 'tengu_tool_use_success',
  TOOL_ERROR: 'tengu_tool_use_error',
  TOOL_CANCELLED: 'tengu_tool_use_cancelled',

  // Session events
  INIT: 'tengu_init',
  SESSION_RESUMED: 'tengu_session_resumed',
  QUERY_ERROR: 'tengu_query_error',

  // Compact events
  COMPACT: 'tengu_compact',
  COMPACT_FAILED: 'tengu_compact_failed',

  // Plan mode events
  PLAN_EXIT: 'tengu_plan_exit',
  PLAN_EXTERNAL_EDITOR: 'tengu_plan_external_editor_used',

  // Performance events
  STARTUP_PERF: 'tengu_startup_perf',
  ATTACHMENT_COMPUTE: 'tengu_attachment_compute_duration',
} as const;

// ============================================
// Export
// ============================================

// NOTE: 常量/函数已在声明处导出；移除重复聚合导出。
