/**
 * @claudecode/platform - Telemetry Type Definitions
 *
 * Type definitions for the telemetry system.
 * Reconstructed from chunks.51.mjs, chunks.155.mjs
 */

// ============================================
// Event Types
// ============================================

/**
 * Telemetry event metadata.
 */
export interface EventMetadata {
  [key: string]: unknown;
  model?: string;
  sample_rate?: number;
}

/**
 * Queued telemetry event.
 */
export interface QueuedEvent {
  eventName: string;
  metadata: EventMetadata;
  async: boolean;
}

/**
 * Telemetry provider interface.
 */
export interface TelemetryProvider {
  logEvent: (eventName: string, metadata?: EventMetadata) => void;
  logEventAsync: (eventName: string, metadata?: EventMetadata) => Promise<void>;
}

// ============================================
// Environment Context
// ============================================

/**
 * Environment context for telemetry events.
 */
export interface EnvironmentContext {
  version: string;
  versionBase: string;
  platform: string;
  arch: string;
  nodeVersion: string;
  model?: string;
  provider?: string;
  clientType?: string;
  userType?: string;
  envContext?: Record<string, unknown>;
}

/**
 * User metadata for telemetry events.
 */
export interface UserMetadata {
  anonymousId?: string;
  userId?: string;
  accountUuid?: string;
  organizationUuid?: string;
}

// ============================================
// Datadog
// ============================================

/**
 * Datadog log entry.
 */
export interface DatadogLogEntry {
  ddsource: string;
  ddtags: string;
  message: string;
  service: string;
  hostname: string;
  env: string;
  [key: string]: unknown;
}

/**
 * Datadog configuration.
 */
export interface DatadogConfig {
  endpoint: string;
  apiKey: string;
  batchSize: number;
  flushIntervalMs: number;
  httpTimeoutMs: number;
}

// ============================================
// Segment
// ============================================

/**
 * Segment track payload.
 */
export interface SegmentTrackPayload {
  anonymousId: string;
  event: string;
  properties: Record<string, unknown>;
  userId?: string;
}

/**
 * Segment configuration.
 */
export interface SegmentConfig {
  writeKey: string;
  environment: 'production' | 'development';
}

// ============================================
// OpenTelemetry
// ============================================

/**
 * Log record attributes for OpenTelemetry.
 */
export interface LogRecordAttributes {
  event_name: string;
  event_id: string;
  core_metadata: EnvironmentContext;
  user_metadata: UserMetadata;
  event_metadata: EventMetadata;
  user_id?: string;
}

/**
 * OpenTelemetry batch configuration.
 */
export interface OtelBatchConfig {
  scheduledDelayMillis?: number;
  maxExportBatchSize?: number;
  maxQueueSize?: number;
}

// ============================================
// Sampling
// ============================================

/**
 * Event sampling configuration.
 */
export interface EventSamplingConfig {
  [eventName: string]: {
    sample_rate?: number;
  };
}

/**
 * Sample rate result.
 */
export type SampleRateResult = number | null;

// ============================================
// Performance
// ============================================

/**
 * Performance checkpoint.
 */
export interface PerformanceCheckpoint {
  name: string;
  timestamp: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

/**
 * Startup performance data.
 */
export interface StartupPerformanceData {
  checkpoints: PerformanceCheckpoint[];
  totalDurationMs: number;
  memoryPeakMb?: number;
}

// ============================================
// Event Categories
// ============================================

/**
 * API event types.
 */
export type ApiEventType =
  | 'tengu_api_error'
  | 'tengu_api_success'
  | 'tengu_api_query'
  | 'tengu_api_retry'
  | 'tengu_model_fallback_triggered';

/**
 * Tool event types.
 */
export type ToolEventType =
  | 'tengu_tool_use_success'
  | 'tengu_tool_use_error'
  | 'tengu_tool_use_cancelled'
  | 'tengu_tool_use_progress'
  | 'tengu_tool_use_can_use_tool_allowed'
  | 'tengu_tool_use_can_use_tool_rejected'
  | 'tengu_tool_use_granted_in_config'
  | 'tengu_tool_use_granted_in_prompt_temporary'
  | 'tengu_tool_use_granted_in_prompt_permanent'
  | 'tengu_tool_use_granted_by_permission_hook'
  | 'tengu_tool_use_denied_in_config'
  | 'tengu_tool_use_rejected_in_prompt'
  | 'tengu_tool_use_show_permission_request';

/**
 * Session event types.
 */
export type SessionEventType =
  | 'tengu_init'
  | 'tengu_session_resumed'
  | 'tengu_query_error'
  | 'tengu_compact'
  | 'tengu_compact_failed';

/**
 * Plan mode event types.
 */
export type PlanModeEventType =
  | 'tengu_plan_exit'
  | 'tengu_plan_external_editor_used';

/**
 * All telemetry event types.
 */
export type TelemetryEventType =
  | ApiEventType
  | ToolEventType
  | SessionEventType
  | PlanModeEventType
  | string;

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出。
