/**
 * @claudecode/shared - Global State
 *
 * Global state management singleton.
 * Reconstructed from chunks.1.mjs:1784-2800+
 *
 * The global state (g0) holds session-wide state that persists
 * throughout the application lifecycle.
 */

import { generateUUID } from '../utils/index.js';
import type {
  GlobalState,
  ModelUsage,
  TokenUsage,
  TeleportedSessionInfo,
  InvokedSkillInfo,
  SettingSource,
} from '../types/index.js';

// ============================================
// Global State Singleton
// ============================================

/**
 * Create the default global state
 * Original: $T9 (createDefaultGlobalState) in chunks.1.mjs:1784-2327
 */
function createDefaultGlobalState(): GlobalState {
  let originalCwd = '';

  // Get current working directory if available
  if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
    try {
      originalCwd = process.cwd();
    } catch {
      // Ignore errors getting cwd
    }
  }

  return {
    // Directory paths
    originalCwd,
    projectRoot: originalCwd,
    cwd: originalCwd,

    // Cost & Performance tracking
    totalCostUSD: 0,
    totalAPIDuration: 0,
    totalAPIDurationWithoutRetries: 0,
    totalToolDuration: 0,
    startTime: Date.now(),
    lastInteractionTime: Date.now(),

    // Code modification tracking
    totalLinesAdded: 0,
    totalLinesRemoved: 0,

    // Model configuration
    hasUnknownModelCost: false,
    modelUsage: {},
    mainLoopModelOverride: undefined,
    initialMainLoopModel: null,
    modelStrings: null,
    sdkBetas: undefined,

    // Session configuration
    sessionId: generateUUID(),
    isInteractive: false,
    clientType: 'cli',
    sessionIngressToken: undefined,
    oauthTokenFromFd: undefined,
    apiKeyFromFd: undefined,
    flagSettingsPath: undefined,
    allowedSettingSources: [
      'userSettings',
      'projectSettings',
      'localSettings',
      'flagSettings',
      'policySettings',
    ],

    // OpenTelemetry metrics
    meter: null,
    sessionCounter: null,
    locCounter: null,
    prCounter: null,
    commitCounter: null,
    costCounter: null,
    tokenCounter: null,
    codeEditToolDecisionCounter: null,
    activeTimeCounter: null,

    // Logging & tracing
    loggerProvider: null,
    eventLogger: null,
    meterProvider: null,
    tracerProvider: null,

    // Agent colors for UI
    agentColorMap: new Map(),
    agentColorIndex: 0,

    // Environment validators
    envVarValidators: [],

    // API tracking
    lastAPIRequest: null,

    // Error tracking
    inMemoryErrorLog: [],

    // Plugin system
    inlinePlugins: [],

    // Permission modes
    sessionBypassPermissionsMode: false,
    sessionTrustAccepted: false,
    sessionPersistenceDisabled: false,

    // Plan mode state
    hasExitedPlanMode: false,
    needsPlanModeExitAttachment: false,

    // Delegate mode state
    hasExitedDelegateMode: false,
    needsDelegateModeExitAttachment: false,

    // LSP recommendation
    lspRecommendationShownThisSession: false,

    // JSON schema for init
    initJsonSchema: null,

    // Hooks registry
    registeredHooks: null,

    // Plan slug cache
    planSlugCache: new Map(),

    // Teleport session info
    teleportedSessionInfo: null,

    // Invoked skills tracking
    invokedSkills: new Map(),

    // Slow operations tracking
    slowOperations: [],

    // Main thread agent type
    mainThreadAgentType: undefined,
  };
}

/**
 * The global state singleton
 * Original: g0 in chunks.1.mjs
 */
let globalState: GlobalState = createDefaultGlobalState();

// ============================================
// Session ID Functions
// ============================================

/**
 * Get the current session ID
 * Original: q0 in chunks.1.mjs:1854
 */
export function getSessionId(): string {
  return globalState.sessionId;
}

/**
 * Generate and set a new session ID
 * Original: wb0 (generateNewSessionId) in chunks.1.mjs:1858
 */
export function generateNewSessionId(): string {
  globalState.sessionId = generateUUID();
  return globalState.sessionId;
}

/**
 * Set the session ID
 * Original: pw (setSessionId) in chunks.1.mjs:1862
 */
export function setSessionId(sessionId: string): void {
  globalState.sessionId = sessionId;
  if (process.env.CLAUDE_CODE_SESSION_ID !== undefined) {
    process.env.CLAUDE_CODE_SESSION_ID = sessionId;
  }
}

// ============================================
// Directory Functions
// ============================================

/**
 * Get the original working directory
 * Original: EQ in chunks.1.mjs:1866
 */
export function getOriginalCwd(): string {
  return globalState.originalCwd;
}

/**
 * Get the project root directory
 * Original: Xq in chunks.1.mjs:1870
 */
export function getProjectRoot(): string {
  return globalState.projectRoot;
}

/**
 * Set the original working directory
 * Original: Lb0 in chunks.1.mjs:1874
 */
export function setOriginalCwd(cwd: string): void {
  globalState.originalCwd = cwd;
}

/**
 * Get the current working directory
 * Original: _y in chunks.1.mjs:1878
 */
export function getCwd(): string {
  return globalState.cwd;
}

/**
 * Set the current working directory
 * Original: Ob0 in chunks.1.mjs:1882
 */
export function setCwd(cwd: string): void {
  globalState.cwd = cwd;
}

// ============================================
// Cost & Duration Functions
// ============================================

/**
 * Add to API duration
 * Original: Mb0 in chunks.1.mjs:1886
 */
export function addAPIDuration(duration: number, durationWithoutRetries: number): void {
  globalState.totalAPIDuration += duration;
  globalState.totalAPIDurationWithoutRetries += durationWithoutRetries;
}

/**
 * Update model usage and cost
 * Original: Rb0 in chunks.1.mjs:1890
 */
export function updateModelUsage(
  costUSD: number,
  usage: TokenUsage,
  modelId: string
): void {
  globalState.totalCostUSD += costUSD;

  const existing = globalState.modelUsage[modelId] ?? {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
    webSearchRequests: 0,
    costUSD: 0,
    contextWindow: 0,
    maxOutputTokens: 0,
  };

  existing.inputTokens += usage.input_tokens;
  existing.outputTokens += usage.output_tokens;
  existing.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0;
  existing.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0;
  existing.webSearchRequests += usage.server_tool_use?.web_search_requests ?? 0;
  existing.costUSD += costUSD;

  globalState.modelUsage[modelId] = existing;
}

/**
 * Get total cost
 * Original: $H in chunks.1.mjs:1905
 */
export function getTotalCostUSD(): number {
  return globalState.totalCostUSD;
}

/**
 * Get total API duration
 * Original: PM in chunks.1.mjs:1909
 */
export function getTotalAPIDuration(): number {
  return globalState.totalAPIDuration;
}

/**
 * Get total session duration
 * Original: PCA in chunks.1.mjs:1913
 */
export function getSessionDuration(): number {
  return Date.now() - globalState.startTime;
}

/**
 * Get total API duration without retries
 * Original: _b0 in chunks.1.mjs:1917
 */
export function getTotalAPIDurationWithoutRetries(): number {
  return globalState.totalAPIDurationWithoutRetries;
}

/**
 * Get total tool duration
 * Original: jb0 in chunks.1.mjs:1921
 */
export function getTotalToolDuration(): number {
  return globalState.totalToolDuration;
}

/**
 * Add to tool duration
 * Original: aU1 in chunks.1.mjs:1925
 */
export function addToolDuration(duration: number): void {
  globalState.totalToolDuration += duration;
}

/**
 * Update last interaction time
 * Original: SCA in chunks.1.mjs:1929
 */
export function updateLastInteractionTime(): void {
  globalState.lastInteractionTime = Date.now();
}

/**
 * Get last interaction time
 * Original: wdA in chunks.1.mjs:1973
 */
export function getLastInteractionTime(): number {
  return globalState.lastInteractionTime;
}

// ============================================
// Code Modification Tracking
// ============================================

/**
 * Add lines modified
 * Original: oU1 in chunks.1.mjs:1933
 */
export function addLinesModified(added: number, removed: number): void {
  globalState.totalLinesAdded += added;
  globalState.totalLinesRemoved += removed;
}

/**
 * Get total lines added
 * Original: r5A in chunks.1.mjs:1937
 */
export function getTotalLinesAdded(): number {
  return globalState.totalLinesAdded;
}

/**
 * Get total lines removed
 * Original: s5A in chunks.1.mjs:1941
 */
export function getTotalLinesRemoved(): number {
  return globalState.totalLinesRemoved;
}

// ============================================
// Model Configuration Functions
// ============================================

/**
 * Get model usage
 * Original: jy in chunks.1.mjs:1977
 */
export function getModelUsage(): Record<string, ModelUsage> {
  return globalState.modelUsage;
}

/**
 * Get main loop model override
 * Original: yb0 in chunks.1.mjs:1981
 */
export function getMainLoopModelOverride(): string | undefined {
  return globalState.mainLoopModelOverride;
}

/**
 * Set main loop model override
 * Original: dAA in chunks.1.mjs:1989
 */
export function setMainLoopModelOverride(model: string): void {
  globalState.mainLoopModelOverride = model;
}

/**
 * Get initial main loop model
 * Original: LdA in chunks.1.mjs:1985
 */
export function getInitialMainLoopModel(): string | null {
  return globalState.initialMainLoopModel;
}

/**
 * Set initial main loop model
 * Original: vb0 in chunks.1.mjs:1993
 */
export function setInitialMainLoopModel(model: string): void {
  globalState.initialMainLoopModel = model;
}

/**
 * Get SDK betas
 * Original: SM in chunks.1.mjs:1997
 */
export function getSdkBetas(): string[] | undefined {
  return globalState.sdkBetas;
}

/**
 * Set SDK betas
 * Original: kb0 in chunks.1.mjs:2001
 */
export function setSdkBetas(betas: string[]): void {
  globalState.sdkBetas = betas;
}

// ============================================
// Session Mode Functions
// ============================================

/**
 * Check if in non-interactive mode
 * Original: p2 in chunks.1.mjs:2118
 */
export function isNonInteractive(): boolean {
  return !globalState.isInteractive;
}

/**
 * Check if in interactive mode
 * Original: e5A in chunks.1.mjs:2122
 */
export function isInteractive(): boolean {
  return globalState.isInteractive;
}

/**
 * Set interactive mode
 * Original: db0 in chunks.1.mjs:2126
 */
export function setInteractive(interactive: boolean): void {
  globalState.isInteractive = interactive;
}

/**
 * Get client type
 * Original: _dA in chunks.1.mjs:2130
 */
export function getClientType(): string {
  return globalState.clientType;
}

/**
 * Set client type
 * Original: cb0 in chunks.1.mjs:2134
 */
export function setClientType(clientType: string): void {
  globalState.clientType = clientType;
}

// ============================================
// Plan Mode Functions
// ============================================

/**
 * Check if exited plan mode
 * Original: Xf0 (hasExitedPlanMode) in chunks.1.mjs:2230
 */
export function hasExitedPlanMode(): boolean {
  return globalState.hasExitedPlanMode;
}

/**
 * Set has exited plan mode
 * Original: Iq (setHasExitedPlanMode) in chunks.1.mjs:2234
 */
export function setHasExitedPlanMode(value: boolean): void {
  globalState.hasExitedPlanMode = value;
}

/**
 * Check if needs plan mode exit attachment
 * Original: If0 (needsPlanModeExitAttachment) in chunks.1.mjs:2238
 */
export function needsPlanModeExitAttachment(): boolean {
  return globalState.needsPlanModeExitAttachment;
}

/**
 * Set needs plan mode exit attachment
 * Original: lw (setNeedsPlanModeExitAttachment) in chunks.1.mjs:2242
 */
export function setNeedsPlanModeExitAttachment(value: boolean): void {
  globalState.needsPlanModeExitAttachment = value;
}

/**
 * Handle tool permission mode change
 * Original: Ty (onToolPermissionModeChanged) in chunks.1.mjs:2246
 */
export function onToolPermissionModeChanged(
  oldMode: string,
  newMode: string
): void {
  // Source behavior (chunks.1.mjs:2722-2725):
  // - Entering plan mode clears the exit-attachment flag.
  // - Exiting plan mode sets the exit-attachment flag, so the next turn can inject it.

  if (newMode === 'plan' && oldMode !== 'plan') {
    globalState.needsPlanModeExitAttachment = false;
  }

  if (oldMode === 'plan' && newMode !== 'plan') {
    globalState.needsPlanModeExitAttachment = true;
  }
}

// ============================================
// Session Persistence Functions
// ============================================

/**
 * Check if session persistence is disabled
 * Original: cAA (isSessionPersistenceDisabled) in chunks.1.mjs:2226
 */
export function isSessionPersistenceDisabled(): boolean {
  return globalState.sessionPersistenceDisabled;
}

/**
 * Set session persistence disabled
 * Original: Jf0 in chunks.1.mjs:2222
 */
export function setSessionPersistenceDisabled(disabled: boolean): void {
  globalState.sessionPersistenceDisabled = disabled;
}

// ============================================
// Hooks Functions
// ============================================

/**
 * Register hooks
 * Original: G7A (registerHooks) in chunks.1.mjs:2279
 */
export function registerHooks(hooks: Record<string, unknown[]>): void {
  if (!globalState.registeredHooks) {
    globalState.registeredHooks = {};
  }

  for (const [eventType, hookList] of Object.entries(hooks)) {
    if (!globalState.registeredHooks[eventType]) {
      globalState.registeredHooks[eventType] = [];
    }
    globalState.registeredHooks[eventType].push(...hookList);
  }
}

/**
 * Get registered hooks
 * Original: TdA (getRegisteredHooks) in chunks.1.mjs:2288
 */
export function getRegisteredHooks(): Record<string, unknown[]> | null {
  return globalState.registeredHooks;
}

/**
 * Clear plugin hooks
 * Original: Hf0 (clearPluginHooks) in chunks.1.mjs:2292
 */
export function clearPluginHooks(): void {
  if (!globalState.registeredHooks) return;

  const filtered: Record<string, unknown[]> = {};

  for (const [eventType, hookList] of Object.entries(globalState.registeredHooks)) {
    const nonPluginHooks = hookList.filter(
      (hook) => !(hook as { pluginRoot?: string }).pluginRoot
    );
    if (nonPluginHooks.length > 0) {
      filtered[eventType] = nonPluginHooks;
    }
  }

  globalState.registeredHooks =
    Object.keys(filtered).length > 0 ? filtered : null;
}

// ============================================
// Teleport Functions
// ============================================

/**
 * Get plan slug cache
 * Original: Z7A (getPlanSlugCache) in chunks.1.mjs:2302
 */
export function getPlanSlugCache(): Map<string, string> {
  return globalState.planSlugCache;
}

/**
 * Set teleported session info
 * Original: PdA (setTeleportedSessionInfo) in chunks.1.mjs:2306
 */
export function setTeleportedSessionInfo(info: { sessionId: string }): void {
  globalState.teleportedSessionInfo = {
    isTeleported: true,
    hasLoggedFirstMessage: false,
    sessionId: info.sessionId,
  };
}

/**
 * Get teleported session info
 * Original: Iq1 (getTeleportedSessionInfo) in chunks.1.mjs:2314
 */
export function getTeleportedSessionInfo(): TeleportedSessionInfo | null {
  return globalState.teleportedSessionInfo;
}

/**
 * Mark teleport first message logged
 * Original: Dq1 (markTeleportFirstMessageLogged) in chunks.1.mjs:2318
 */
export function markTeleportFirstMessageLogged(): void {
  if (globalState.teleportedSessionInfo) {
    globalState.teleportedSessionInfo.hasLoggedFirstMessage = true;
  }
}

// ============================================
// Reset Functions
// ============================================

/**
 * Reset session statistics
 * Original: xCA in chunks.1.mjs:2005
 */
export function resetSessionStats(): void {
  globalState.totalCostUSD = 0;
  globalState.totalAPIDuration = 0;
  globalState.totalAPIDurationWithoutRetries = 0;
  globalState.totalToolDuration = 0;
  globalState.startTime = Date.now();
  globalState.totalLinesAdded = 0;
  globalState.totalLinesRemoved = 0;
  globalState.hasUnknownModelCost = false;
  globalState.modelUsage = {};
}

/**
 * Restore session statistics
 * Original: OdA in chunks.1.mjs:2009
 */
export function restoreSessionStats(stats: {
  totalCostUSD: number;
  totalAPIDuration: number;
  totalAPIDurationWithoutRetries: number;
  totalToolDuration: number;
  totalLinesAdded: number;
  totalLinesRemoved: number;
  lastDuration?: number;
  modelUsage?: Record<string, ModelUsage>;
}): void {
  globalState.totalCostUSD = stats.totalCostUSD;
  globalState.totalAPIDuration = stats.totalAPIDuration;
  globalState.totalAPIDurationWithoutRetries = stats.totalAPIDurationWithoutRetries;
  globalState.totalToolDuration = stats.totalToolDuration;
  globalState.totalLinesAdded = stats.totalLinesAdded;
  globalState.totalLinesRemoved = stats.totalLinesRemoved;

  if (stats.modelUsage) {
    globalState.modelUsage = stats.modelUsage;
  }

  if (stats.lastDuration) {
    globalState.startTime = Date.now() - stats.lastDuration;
  }
}

/**
 * Reset the entire global state
 */
export function resetGlobalState(): void {
  globalState = createDefaultGlobalState();
}

/**
 * Get the raw global state (for testing/debugging)
 */
export function getGlobalState(): GlobalState {
  return globalState;
}
