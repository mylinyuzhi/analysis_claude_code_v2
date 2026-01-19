/**
 * @claudecode/platform - Sandbox Types
 *
 * Type definitions for the sandbox system.
 * Reconstructed from chunks.53.mjs, chunks.55.mjs
 */

// ============================================
// Configuration Types
// ============================================

/**
 * Network restriction configuration
 */
export interface NetworkConfig {
  /** Whitelist of allowed domains */
  allowedDomains: string[];
  /** Blacklist of denied domains */
  deniedDomains: string[];
  /** Specific Unix socket paths to allow */
  allowUnixSockets?: string[];
  /** Allow all Unix sockets (disables seccomp) */
  allowAllUnixSockets?: boolean;
  /** Allow localhost connections */
  allowLocalBinding?: boolean;
  /** External HTTP proxy port */
  httpProxyPort?: number;
  /** External SOCKS proxy port */
  socksProxyPort?: number;
}

/**
 * Filesystem restriction configuration
 */
export interface FilesystemConfig {
  /** Paths to deny reading */
  denyRead: string[];
  /** Paths to allow writing */
  allowWrite: string[];
  /** Paths to deny within allowed areas */
  denyWrite: string[];
}

/**
 * Ripgrep configuration for dangerous file scanning
 */
export interface RipgrepConfig {
  /** Custom ripgrep command path */
  command: string;
  /** Additional ripgrep arguments */
  args?: string[];
}

/**
 * Ignore patterns for sandbox violations
 */
export interface IgnoreViolationsConfig {
  /** Global ignore patterns (apply to all commands) */
  '*'?: string[];
  /** Per-command ignore patterns */
  [command: string]: string[] | undefined;
}

/**
 * Main sandbox configuration.
 * Original: SandboxConfig interface used by XB (sandboxManager)
 */
export interface SandboxConfig {
  /** Network restrictions */
  network: NetworkConfig;
  /** Filesystem restrictions */
  filesystem: FilesystemConfig;
  /** Violation ignore patterns */
  ignoreViolations?: IgnoreViolationsConfig;
  /** Enable weaker nested sandbox for Docker */
  enableWeakerNestedSandbox?: boolean;
  /** Custom ripgrep configuration */
  ripgrep?: RipgrepConfig;
  /** Depth for dangerous file search (default: 3) */
  mandatoryDenySearchDepth?: number;
}

/**
 * Sandbox settings from user/policy configuration
 */
export interface SandboxSettings {
  /** Enable sandbox mode */
  enabled?: boolean;
  /** Auto-approve bash commands when sandboxed */
  autoAllowBashIfSandboxed?: boolean;
  /** Allow dangerouslyDisableSandbox parameter */
  allowUnsandboxedCommands?: boolean;
}

// ============================================
// Read/Write Config Types
// ============================================

/**
 * Read restriction configuration
 */
export interface ReadConfig {
  /** Paths to deny reading (everything else allowed) */
  denyOnly: string[];
}

/**
 * Write restriction configuration
 */
export interface WriteConfig {
  /** Paths to allow writing (everything else denied) */
  allowOnly: string[];
  /** Paths to deny within allowed areas */
  denyWithinAllow: string[];
}

// ============================================
// Network Infrastructure Types
// ============================================

/**
 * Network infrastructure state
 */
export interface NetworkInfrastructure {
  /** HTTP proxy port */
  httpProxyPort: number;
  /** SOCKS proxy port */
  socksProxyPort: number;
  /** Linux-specific bridge info */
  linuxBridge?: LinuxBridgeInfo;
}

/**
 * Linux socat bridge information
 */
export interface LinuxBridgeInfo {
  /** HTTP Unix socket path */
  httpSocketPath: string;
  /** SOCKS Unix socket path */
  socksSocketPath: string;
  /** HTTP bridge process */
  httpBridgeProcess: unknown;
  /** SOCKS bridge process */
  socksBridgeProcess: unknown;
  /** Host HTTP proxy port */
  httpProxyPort: number;
  /** Host SOCKS proxy port */
  socksProxyPort: number;
}

// ============================================
// Violation Types
// ============================================

/**
 * Sandbox violation record
 */
export interface SandboxViolation {
  /** Violation message from sandbox */
  line: string;
  /** Decoded command that caused violation */
  command?: string;
  /** Base64-encoded command for correlation */
  encodedCommand?: string;
  /** When the violation occurred */
  timestamp: Date;
}

/**
 * Violation listener callback
 */
export type ViolationListener = (violations: SandboxViolation[]) => void;

// ============================================
// Wrapper Options
// ============================================

/**
 * Options for sandbox wrapper functions
 */
export interface SandboxWrapperOptions {
  /** Command to wrap */
  command: string;
  /** Whether network restriction is needed */
  needsNetworkRestriction: boolean;
  /** HTTP proxy socket path (Linux) or port (macOS) */
  httpSocketPath?: string;
  /** SOCKS proxy socket path (Linux) or port (macOS) */
  socksSocketPath?: string;
  /** Host HTTP proxy port */
  httpProxyPort?: number;
  /** Host SOCKS proxy port */
  socksProxyPort?: number;
  /** Read restriction configuration */
  readConfig?: ReadConfig;
  /** Write restriction configuration */
  writeConfig?: WriteConfig;
  /** Enable weaker nested sandbox (Docker) */
  enableWeakerNestedSandbox?: boolean;
  /** Allow all Unix sockets */
  allowAllUnixSockets?: boolean;
  /** Specific Unix sockets to allow */
  allowUnixSockets?: string[];
  /** Allow localhost binding */
  allowLocalBinding?: boolean;
  /** Allow PTY access */
  allowPty?: boolean;
  /** Allow git config modification */
  allowGitConfig?: boolean;
  /** Shell to use */
  binShell?: string;
  /** Custom ripgrep config */
  ripgrepConfig?: RipgrepConfig;
  /** Depth for mandatory deny search */
  mandatoryDenySearchDepth?: number;
  /** Abort signal */
  abortSignal?: AbortSignal;
}

// ============================================
// Platform Types
// ============================================

/**
 * Supported platforms for sandboxing
 */
export type SandboxPlatform = 'linux' | 'macos' | 'unsupported';

/**
 * Permission callback for network access
 */
export type PermissionCallback = (
  domain: string,
  type: 'http' | 'socks'
) => Promise<boolean>;

// ============================================
// Manager Types
// ============================================

/**
 * Sandbox manager interface.
 * Original: XB object in chunks.55.mjs:1518-1546
 */
export interface SandboxManager {
  // Lifecycle
  initialize: (
    config: SandboxConfig,
    permissionCallback: PermissionCallback,
    enableMonitoring?: boolean
  ) => Promise<void>;
  reset: () => Promise<void>;
  refreshConfig: () => void;

  // Status checks
  isSandboxingEnabled: () => boolean;
  isAutoAllowBashIfSandboxedEnabled: () => boolean;
  areUnsandboxedCommandsAllowed: () => boolean;
  areSandboxSettingsLockedByPolicy: () => boolean;
  isSupportedPlatform: () => boolean;
  checkDependencies: () => boolean;

  // Settings
  setSandboxSettings: (settings: SandboxSettings) => void;
  getExcludedCommands: () => string[];

  // Config getters
  getFsReadConfig: () => ReadConfig | undefined;
  getFsWriteConfig: () => WriteConfig | undefined;
  getNetworkRestrictionConfig: () => NetworkConfig | undefined;
  getIgnoreViolations: () => IgnoreViolationsConfig | undefined;
  getAllowUnixSockets: () => string[] | undefined;
  getAllowLocalBinding: () => boolean;
  getEnableWeakerNestedSandbox: () => boolean;

  // Network infrastructure
  getProxyPort: () => number | undefined;
  getSocksProxyPort: () => number | undefined;
  getLinuxHttpSocketPath: () => string | undefined;
  getLinuxSocksSocketPath: () => string | undefined;
  waitForNetworkInitialization: () => Promise<NetworkInfrastructure | undefined>;

  // Command wrapping
  wrapWithSandbox: (options: SandboxWrapperOptions) => Promise<string>;

  // Violation tracking
  getSandboxViolationStore: () => SandboxViolationStore;
  annotateStderrWithSandboxFailures: (
    stderr: string,
    command: string
  ) => string;

  // Linux-specific
  getLinuxGlobPatternWarnings: () => string[];
}

/**
 * Sandbox violation store interface
 */
export interface SandboxViolationStore {
  addViolation: (violation: SandboxViolation) => void;
  getViolations: (limit?: number) => SandboxViolation[];
  getCount: () => number;
  getTotalCount: () => number;
  getViolationsForCommand: (command: string) => SandboxViolation[];
  clear: () => void;
  subscribe: (callback: ViolationListener) => () => void;
}

// ============================================
// Constants
// ============================================

/**
 * Default sandbox constants
 */
export const SANDBOX_CONSTANTS = {
  /** Default search depth for dangerous files */
  DEFAULT_MANDATORY_DENY_SEARCH_DEPTH: 3,

  /** HTTP proxy port inside container */
  CONTAINER_HTTP_PROXY_PORT: 3128,

  /** SOCKS proxy port inside container */
  CONTAINER_SOCKS_PROXY_PORT: 1080,

  /** Max violations to keep in store */
  MAX_VIOLATIONS: 100,

  /** Protected configuration files */
  PROTECTED_FILES: [
    '.gitconfig',
    '.gitmodules',
    '.bashrc',
    '.bash_profile',
    '.zshrc',
    '.zprofile',
    '.profile',
    '.ripgreprc',
    '.mcp.json',
  ] as const,

  /** Protected directories */
  PROTECTED_DIRS: ['.git', '.vscode', '.idea'] as const,

  /** Temp directory for sandbox */
  SANDBOX_TEMP_DIR: '/tmp/claude',
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型/常量已在声明处导出；移除重复聚合导出。
