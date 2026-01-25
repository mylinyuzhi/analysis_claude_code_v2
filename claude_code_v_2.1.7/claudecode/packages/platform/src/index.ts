/**
 * @claudecode/platform
 *
 * Platform infrastructure for Claude Code.
 * Provides file system, auth, sandbox, telemetry, and shell parsing.
 *
 * Reconstructed from chunks.48, chunks.51, chunks.53, chunks.55,
 * chunks.112, chunks.121, chunks.123, chunks.147, chunks.155
 */

// ============================================
// File System Operations
// ============================================

export * from './fs/index.js';

// ============================================
// Sandbox Module
// ============================================

export * from './sandbox/index.js';

// ============================================
// Auth Module
// ============================================

export * as auth from './auth/index.js';
export {
  // Types
  type OAuthConfig,
  type ApiKeySource,
  type ApiKeyResult,
  type GetApiKeyOptions,
  type OAuthTokens,
  type OAuthTokenSource,
  type OAuthAccount,
  type SubscriptionType,
  type ProviderType,
  type ProviderClientOptions,
  type BedrockConfig,
  type VertexConfig,
  type FoundryConfig,

  // Constants
  OAUTH_CONFIG,
  AUTH_ENV_VARS,
  PROVIDER_ENV_VARS,
  API_HEADERS,
  API_VERSION,

  // API Key functions
  isSDKMode,
  isHostedMode,
  getApiKeyAndSource,
  getApiKey,
  maskApiKey,
  hashApiKey,
  saveKeychainKey,
  getKeychainKey,

  // OAuth functions
  isClaudeAiOAuth,
  getClaudeAiOAuth,
  getOAuthTokenSource,
  shouldUseOAuth,
  getOAuthAccount,
  getJwtToken,
  saveOAuthTokens,
  clearOAuthTokens,
  isTokenExpiringSoon,
  refreshOAuthTokenIfNeeded,
  refreshOAuthToken,
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  fetchOAuthProfile,
  fetchUserRoles,
  createApiKey,
  AuthCodeListener,
  OAuthManager,
} from './auth/index.js';

// ============================================
// Telemetry Module
// ============================================

export * as telemetry from './telemetry/index.js';
export {
  // Types
  type EventMetadata,
  type TelemetryProvider,
  type EnvironmentContext,
  type UserMetadata,
  type TelemetryEventType,

  // Constants
  OTEL_DEFAULT_CONFIG,
  DATADOG_CONFIG,
  DATADOG_TRACKED_EVENTS,
  FEATURE_GATES,
  TELEMETRY_ENV_VARS,
  PERFORMANCE_CHECKPOINTS,
  COMMON_EVENTS,

  // Core functions
  isTelemetryEnabled,
  isSegmentEnabled,
  isDatadogEnabled,
  checkFeatureGate,
  setFeatureGates,
  setEventSamplingConfig,
  getSampleRate,
  getEnvironmentContext,
  logEvent,
  logEventAsync,
  analyticsEvent,
  analyticsEventAsync,
  trackEvent,
  logStructuredMetric,
  attachTelemetryProvider,
  registerTelemetryProvider,
  telemetryMarker,
  getPerformanceCheckpoints,
  flushTelemetry,
  registerTelemetryCleanup,
} from './telemetry/index.js';

// ============================================
// Shell Parser Module
// ============================================

export * as shellParser from './shell-parser/index.js';
export {
  // Types
  type ParsedCommand,
  type OutputRedirection,
  type SecurityCheckResult,
  type SecurityContext,
  type SecurityBehavior,
  SecurityRiskType,

  // Constants
  DANGEROUS_PATTERNS,
  SHELL_METACHARACTERS,
  CWD_RESET_REGEX,
  SAFE_COMMANDS,

  // Tokenizer functions
  tokenizeCommand,
  parseShellCommand,
  removeQuotes,
  hasUnescapedChar,
  isMalformedTokens,

  // Security functions
  shellOperatorChecker,
  checkEmptyCommand,
  checkIncompleteCommand,
  checkJqDanger,
  checkObfuscatedFlags,
  checkShellMetacharacters,
  checkDangerousSubstitution,

  // Parser functions
  RichCommand,
  SimpleCommand,
  shellCommandParser,
  extractOutputRedirections,
  extractCwdReset,
  hasShellOperators,
  stripOutputRedirections,
} from './shell-parser/index.js';

// ============================================
// Code Indexing Module
// ============================================

export * as codeIndexing from './code-indexing/index.js';
export {
  // Types
  type TreeSitterNode,
  type TreeSitterTree,
  type ParseCommandResult,
  type RedirectionInfo,
  type Command,
  type ShellCommandParser,
  type FileIndex,
  type FileSearchResult,
  type FileSuggestion,
  type FileSuggestionContext,
  type FileIndexCache,

  // Constants
  MAX_COMMAND_LENGTH,
  CACHE_TTL,
  MAX_SUGGESTIONS,
  DECLARATION_KEYWORDS,
  ARGUMENT_TYPES,
  SUBSTITUTION_TYPES,
  COMMAND_NODE_TYPES,

  // Tree-sitter functions
  ensureTreeSitterLoaded,
  isTreeSitterAvailable,
  parseCommand,
  findCommandNode,
  extractEnvironmentVariables,
  extractCommandArguments,
  extractPipePositions,
  extractRedirections,
  traverseTree,
  unquoteString,

  // File index functions
  getFileSuggestions,
  clearFileIndexCache,
  refreshIndexCache,
  initializeFileIndex,
  isGitRepo,
  getFilesUsingGit,
  getFilesUsingRipgrep,
  getProjectFiles,
  extractDirectoryPrefixes,
  performSearch,
  createFileResult,
  executeFileSuggestionCommand,
} from './code-indexing/index.js';

// ============================================
// Network & Proxy Module
// ============================================

export * from './network.js';
export {
  getMtlsConfig,
  getMtlsCredentials,
  getProxyUrl,
  shouldBypassProxy,
  getUndiciProxyAgent,
  getUndiciMtlsAgent,
  getGlobalDispatcher,
  getHttpsAgentWithMtls,
  getProxyAgentForUrl,
  getAxiosProxyAgent,
} from './network.js';

// ============================================
// Image Processing
// ============================================

export * from './images.js';

// ============================================
// LLM & API Module
// ============================================

export {
  countTokens,
  getDefaultModel,
  getContextWindowSize,
  getModelBetas,
} from './llm.js';

// ============================================
// UI Symbols
// ============================================

export const symbols = {
  tick: '✓',
  cross: '✗',
  warning: '⚠',
  pointer: '›',
  circle: '○',
};
