/**
 * @claudecode/features - Hook Aggregation
 *
 * Aggregate hooks from all sources (policy, plugin, session).
 * Reconstructed from chunks.120.mjs:1419-1467
 */

import type {
  HookEventType,
  HookMatcher,
  EventHooksConfig,
  HookInput,
  HookDefinition,
} from './types.js';
import { getSessionHooks, getSessionFunctionHooks } from './state.js';

// ============================================
// Logging Placeholder
// ============================================

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[Hooks] ${message}`);
  }
}

// ============================================
// Policy Hooks
// ============================================

let cachedPolicyHooks: EventHooksConfig | null = null;

type UnknownRecord = Record<string, unknown>;

function getGlobalSettings(): UnknownRecord {
  const s = (globalThis as any).__claudeSettings;
  return s && typeof s === 'object' ? (s as UnknownRecord) : {};
}

function getPolicySettings(settings: UnknownRecord): UnknownRecord | undefined {
  const p = (settings as any).policySettings;
  return p && typeof p === 'object' ? (p as UnknownRecord) : undefined;
}

function hookSortKey(h: HookDefinition): string {
  switch (h.type) {
    case 'command':
      return `command:${h.command}`;
    case 'prompt':
      return `prompt:${typeof h.prompt === 'string' ? h.prompt : ''}`;
    case 'agent':
      return `agent:${typeof h.prompt === 'string' ? h.prompt : 'function'}`;
    case 'callback':
      return 'callback';
    default:
      return JSON.stringify(h);
  }
}

/**
 * Normalize hook config for stable iteration.
 * Source alignment: bI0() in `source/chunks.91.mjs` (sort events, matchers, hooks).
 */
function normalizeEventHooksConfig(raw: unknown): EventHooksConfig {
  if (!raw || typeof raw !== 'object') return {};
  const input = raw as Record<string, unknown>;
  const out: Record<string, HookMatcher[]> = {};

  for (const key of Object.keys(input).sort()) {
    const matchersRaw = input[key];
    if (!Array.isArray(matchersRaw)) continue;

    const matchers: HookMatcher[] = matchersRaw
      .filter((m): m is HookMatcher => Boolean(m && typeof m === 'object'))
      .map((m: any) => ({
        matcher: typeof m.matcher === 'string' ? m.matcher : undefined,
        hooks: Array.isArray(m.hooks) ? (m.hooks as HookDefinition[]) : [],
        // Preserve extra metadata (e.g. pluginRoot) for downstream filtering.
        ...(m as object),
      }))
      .sort((a, b) => (a.matcher || '').localeCompare(b.matcher || ''))
      .map((m) => ({
        ...m,
        hooks: [...m.hooks].sort((a, b) => hookSortKey(a).localeCompare(hookSortKey(b))),
      }));

    if (matchers.length > 0) out[key] = matchers;
  }

  return out as EventHooksConfig;
}

/**
 * Initialize policy hooks.
 * Original: fI0 in chunks.91.mjs
 */
function initializePolicyHooks(): void {
  const settings = getGlobalSettings();
  const policySettings = getPolicySettings(settings);

  // Source alignment: kI0() in `source/chunks.91.mjs`
  // - If allowManagedHooksOnly is enabled by policy, the hook editor and runtime
  //   should use policy hooks.
  // - Otherwise use the merged settings' `hooks`.
  const allowManagedHooksOnly =
    (policySettings as any)?.allowManagedHooksOnly === true ||
    (settings as any)?.allowManagedHooksOnly === true;

  const hooksConfig = allowManagedHooksOnly
    ? ((policySettings as any)?.hooks ?? {})
    : ((settings as any)?.hooks ?? {});

  cachedPolicyHooks = normalizeEventHooksConfig(hooksConfig);
}

/**
 * Get policy hooks.
 * Original: o32 in chunks.91.mjs:3225-3228
 */
export function getPolicyHooks(): EventHooksConfig | null {
  if (cachedPolicyHooks === null) {
    initializePolicyHooks();
  }
  return cachedPolicyHooks;
}

/**
 * Set policy hooks (for testing/initialization).
 */
export function setPolicyHooks(hooks: EventHooksConfig): void {
  cachedPolicyHooks = hooks;
}

// ============================================
// Plugin Hooks
// ============================================

interface GlobalState {
  registeredHooks?: EventHooksConfig;
}

const globalState: GlobalState = {};

/**
 * Set plugin hooks.
 * Original: G7A in chunks.1.mjs:2755-2762
 */
export function setPluginHooks(hooksByEvent: EventHooksConfig): void {
  if (!globalState.registeredHooks) {
    globalState.registeredHooks = {};
  }

  for (const [eventType, matchers] of Object.entries(hooksByEvent)) {
    const event = eventType as HookEventType;
    if (!globalState.registeredHooks[event]) {
      globalState.registeredHooks[event] = [];
    }
    globalState.registeredHooks[event]!.push(...(matchers || []));
  }
}

/**
 * Get plugin hooks.
 * Original: TdA in chunks.1.mjs:2764-2766
 */
export function getPluginHooks(): EventHooksConfig | undefined {
  return globalState.registeredHooks;
}

/**
 * Clear plugin hooks (for testing).
 */
export function clearPluginHooks(): void {
  globalState.registeredHooks = undefined;
}

// ============================================
// Settings Checks
// ============================================

/**
 * Check if only managed hooks are allowed.
 * Original: br in chunks.91.mjs
 */
export function isAllowManagedHooksOnly(): boolean {
  const settings = getGlobalSettings();
  const policySettings = getPolicySettings(settings);
  // Source alignment: br() in `source/chunks.91.mjs` checks policySettings first.
  if ((policySettings as any)?.allowManagedHooksOnly === true) return true;
  // Fallback for environments that only expose merged settings.
  return (settings as any)?.allowManagedHooksOnly === true;
}

/**
 * Check if all hooks are disabled.
 */
export function isHooksDisabled(): boolean {
  const settings = getGlobalSettings();
  const policySettings = getPolicySettings(settings);
  const localDisabled = (settings as any)?.disableAllHooks === true;
  // If policy settings are available, treat disableAllHooks as restricted unless
  // both local + policy are disabled (mirrors hooks UI logic in source/chunks.143.mjs).
  if (policySettings) {
    const policyDisabled = (policySettings as any)?.disableAllHooks === true;
    return localDisabled && policyDisabled;
  }
  return localDisabled;
}

// ============================================
// Aggregate Hooks
// ============================================

/**
 * Aggregate hooks from all sources.
 * Original: al5 in chunks.120.mjs:1430-1467
 *
 * Priority order:
 * 1. Policy hooks (always run, even with allowManagedHooksOnly)
 * 2. Plugin hooks (skipped when allowManagedHooksOnly)
 * 3. Session hooks (skipped when allowManagedHooksOnly)
 */
export function aggregateHooksFromAllSources(
  appState: unknown,
  sessionId: string
): EventHooksConfig {
  const aggregatedHooks: EventHooksConfig = {};

  // 1. Load policy hooks (highest priority)
  const policyHooks = getPolicyHooks();
  if (policyHooks) {
    for (const [eventType, matchers] of Object.entries(policyHooks)) {
      const event = eventType as HookEventType;
      aggregatedHooks[event] = (matchers || []).map((m) => ({
        matcher: m.matcher,
        hooks: m.hooks,
      }));
    }
  }

  // 2. Load plugin hooks (global scope)
  const managedOnly = isAllowManagedHooksOnly();
  const pluginHooks = getPluginHooks();

  if (pluginHooks) {
    for (const [eventType, matchers] of Object.entries(pluginHooks)) {
      const event = eventType as HookEventType;
      if (!aggregatedHooks[event]) {
        aggregatedHooks[event] = [];
      }

      for (const matcher of matchers || []) {
        // Skip plugin hooks if allowManagedHooksOnly is enabled
        if (managedOnly && 'pluginRoot' in matcher) continue;
        aggregatedHooks[event]!.push(matcher);
      }
    }
  }

  // 3. Load session hooks (session-scoped, includes skill hooks)
  if (!managedOnly && appState !== undefined) {
    const typedAppState = appState as { sessionHooks: Record<string, unknown> };

    // Regular session hooks
    const sessionHooks = getSessionHooks(typedAppState as never, sessionId);
    for (const [eventType, matchers] of sessionHooks.entries()) {
      if (!aggregatedHooks[eventType]) {
        aggregatedHooks[eventType] = [];
      }
      for (const matcher of matchers) {
        aggregatedHooks[eventType]!.push({
          matcher: matcher.matcher,
          hooks: matcher.hooks.map((entry) => entry.hook),
        });
      }
    }

    // Function hooks (internal use)
    const functionHooks = getSessionFunctionHooks(typedAppState as never, sessionId);
    for (const [eventType, matchers] of functionHooks.entries()) {
      if (!aggregatedHooks[eventType]) {
        aggregatedHooks[eventType] = [];
      }
      for (const matcher of matchers) {
        aggregatedHooks[eventType]!.push({
          matcher: matcher.matcher,
          hooks: matcher.hooks.map((entry) => entry.hook),
        });
      }
    }
  }

  return aggregatedHooks;
}

// ============================================
// Hook Matching
// ============================================

/**
 * Match hook pattern.
 * Original: nl5 in chunks.120.mjs:1419-1428
 *
 * Supported patterns:
 * - Exact: "Write"
 * - OR syntax: "Write|Read|Edit"
 * - Regex: "^Bash.*"
 * - Empty: matches all
 */
export function matchHookPattern(value: string, pattern: string): boolean {
  // Empty pattern matches everything
  if (!pattern) return true;

  // Simple alphanumeric patterns (with | for OR)
  if (/^[a-zA-Z0-9_|]+$/.test(pattern)) {
    // OR syntax: "Write|Read|Edit"
    if (pattern.includes('|')) {
      return pattern
        .split('|')
        .map((p) => p.trim())
        .includes(value);
    }
    // Exact match
    return value === pattern;
  }

  // Regex pattern
  try {
    return new RegExp(pattern).test(value);
  } catch {
    logDebug(`Invalid regex pattern in hook matcher: ${pattern}`);
    return false;
  }
}

// ============================================
// Get Matching Hooks
// ============================================

/**
 * Matched hook with source info.
 */
export interface MatchedHook {
  hook: HookDefinition;
  pluginRoot?: string;
}

/**
 * Get hooks matching an event and query.
 * Original: uU0 in chunks.120.mjs
 */
export function getMatchingHooks(
  appState: unknown,
  sessionId: string,
  eventType: HookEventType,
  hookInput: HookInput
): MatchedHook[] {
  const allHooks = aggregateHooksFromAllSources(appState, sessionId);
  const eventHooks = allHooks[eventType];

  if (!eventHooks || eventHooks.length === 0) {
    return [];
  }

  const matchedHooks: MatchedHook[] = [];

  // Determine match query based on event type
  let matchQuery: string | undefined;
  if ('tool_name' in hookInput) {
    matchQuery = hookInput.tool_name;
  } else if ('notification_type' in hookInput) {
    matchQuery = hookInput.notification_type;
  } else if ('agent_type' in hookInput && 'agent_id' in hookInput) {
    matchQuery = hookInput.agent_type;
  } else if ('trigger' in hookInput) {
    matchQuery = hookInput.trigger;
  } else if ('reason' in hookInput) {
    matchQuery = hookInput.reason;
  }

  for (const matcher of eventHooks) {
    // Check if pattern matches
    if (!matchQuery || !matcher.matcher || matchHookPattern(matchQuery, matcher.matcher)) {
      for (const hook of matcher.hooks) {
        matchedHooks.push({
          hook,
          pluginRoot: (matcher as { pluginRoot?: string }).pluginRoot,
        });
      }
    }
  }

  return matchedHooks;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
