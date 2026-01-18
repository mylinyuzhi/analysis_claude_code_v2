/**
 * @claudecode/integrations - LSP Server Types
 *
 * Type definitions for the LSP server integration.
 * Reconstructed from chunks.114.mjs, chunks.90.mjs
 */

// ============================================
// Manager State
// ============================================

/**
 * LSP manager state.
 */
export type LspManagerState = 'not-started' | 'pending' | 'success' | 'failed';

/**
 * LSP server instance state.
 */
export type LspServerState = 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

// ============================================
// Server Configuration
// ============================================

/**
 * LSP server configuration.
 * Original: YVA (lspServerConfigSchema) in chunks.90.mjs:1668-1687
 */
export interface LspServerConfig {
  // Required
  command: string;
  extensionToLanguage: Record<string, string>;

  // Optional command config
  args?: string[];
  env?: Record<string, string>;

  // Transport
  transport?: 'stdio' | 'socket';

  // Server settings
  initializationOptions?: unknown;
  settings?: unknown;
  workspaceFolder?: string;

  // Lifecycle (NOT YET IMPLEMENTED)
  startupTimeout?: number;
  shutdownTimeout?: number;
  restartOnCrash?: boolean;
  maxRestarts?: number;
}

/**
 * LSP plugin configuration.
 */
export interface LspPluginConfig {
  lspServers:
    | string // Path to .lsp.json
    | Record<string, LspServerConfig> // Inline configs
    | Array<string | Record<string, LspServerConfig>>; // Array of both
}

// ============================================
// Server Instance
// ============================================

/**
 * LSP server instance interface.
 */
export interface LspServerInstance {
  // Identity
  readonly name: string;
  readonly config: LspServerConfig;

  // State
  readonly state: LspServerState;
  readonly startTime: Date | undefined;
  readonly lastError: Error | undefined;
  readonly restartCount: number;

  // Lifecycle
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  isHealthy(): boolean;

  // Communication
  sendRequest<T>(method: string, params?: unknown): Promise<T>;
  sendNotification(method: string, params?: unknown): Promise<void>;
  onNotification(method: string, handler: (params: unknown) => void): void;
  onRequest<T>(method: string, handler: (params: unknown) => T | Promise<T>): void;
}

// ============================================
// Manager Interface
// ============================================

/**
 * LSP server manager interface.
 */
export interface LspServerManager {
  // Lifecycle
  initialize(): Promise<void>;
  shutdown(): Promise<void>;

  // Server access
  getServerForFile(filePath: string): LspServerInstance | undefined;
  ensureServerStarted(filePath: string): Promise<LspServerInstance | undefined>;
  getAllServers(): Map<string, LspServerInstance>;

  // Request routing
  sendRequest<T>(filePath: string, method: string, params?: unknown): Promise<T | undefined>;

  // File synchronization
  openFile(filePath: string, content: string): Promise<void>;
  changeFile(filePath: string, content: string): Promise<void>;
  saveFile(filePath: string): Promise<void>;
  closeFile(filePath: string): Promise<void>;
  isFileOpen(filePath: string): boolean;
}

// ============================================
// Client Interface
// ============================================

/**
 * Low-level LSP client interface.
 */
export interface LspClient {
  // Lifecycle
  start(command: string, args: string[], options?: LspClientStartOptions): Promise<void>;
  initialize(params: LspInitializeParams): Promise<LspInitializeResult>;
  stop(): Promise<void>;

  // State
  readonly isInitialized: boolean;
  readonly capabilities: LspServerCapabilities | undefined;

  // Communication
  sendRequest<T>(method: string, params?: unknown): Promise<T>;
  sendNotification(method: string, params?: unknown): Promise<void>;
  onNotification(method: string, handler: (params: unknown) => void): void;
  onRequest<T>(method: string, handler: (params: unknown) => T | Promise<T>): void;
}

/**
 * LSP client start options.
 */
export interface LspClientStartOptions {
  env?: Record<string, string>;
  cwd?: string;
}

// ============================================
// LSP Protocol Types
// ============================================

/**
 * LSP initialize parameters.
 */
export interface LspInitializeParams {
  processId: number;
  initializationOptions?: unknown;
  workspaceFolders: Array<{ uri: string; name: string }>;
  rootPath: string;
  rootUri: string;
  capabilities: LspClientCapabilities;
}

/**
 * LSP client capabilities.
 */
export interface LspClientCapabilities {
  workspace: {
    configuration: boolean;
    workspaceFolders: boolean;
  };
  textDocument: {
    synchronization: {
      dynamicRegistration: boolean;
      willSave: boolean;
      willSaveWaitUntil: boolean;
      didSave: boolean;
    };
    publishDiagnostics: {
      relatedInformation: boolean;
      tagSupport: { valueSet: number[] };
      versionSupport: boolean;
      codeDescriptionSupport: boolean;
      dataSupport: boolean;
    };
    hover: {
      dynamicRegistration: boolean;
      contentFormat: string[];
    };
    definition: {
      dynamicRegistration: boolean;
      linkSupport: boolean;
    };
    references: {
      dynamicRegistration: boolean;
    };
    documentSymbol: {
      dynamicRegistration: boolean;
      hierarchicalDocumentSymbolSupport: boolean;
    };
    callHierarchy: {
      dynamicRegistration: boolean;
    };
  };
  general: {
    positionEncodings: string[];
  };
}

/**
 * LSP initialize result.
 */
export interface LspInitializeResult {
  capabilities: LspServerCapabilities;
}

/**
 * LSP server capabilities.
 */
export interface LspServerCapabilities {
  textDocumentSync?: number | { openClose?: boolean; change?: number; save?: boolean | object };
  hoverProvider?: boolean;
  definitionProvider?: boolean;
  referencesProvider?: boolean;
  documentSymbolProvider?: boolean;
  callHierarchyProvider?: boolean;
  [key: string]: unknown;
}

// ============================================
// Error Types
// ============================================

/**
 * LSP configuration error.
 */
export interface LspConfigError {
  type: 'lsp-config-invalid';
  plugin: string;
  serverName: string;
  validationError: string;
  source: 'plugin' | 'builtin';
}

// ============================================
// Constants
// ============================================

export const LSP_CONSTANTS = {
  // Retry configuration
  MAX_RETRIES: 3,
  CONTENT_MODIFIED_ERROR_CODE: -32801,
  BASE_RETRY_DELAY: 100, // ms

  // Default configuration
  DEFAULT_MAX_RESTARTS: 3,
  DEFAULT_TRANSPORT: 'stdio' as const,

  // LSP methods
  METHODS: {
    INITIALIZE: 'initialize',
    INITIALIZED: 'initialized',
    SHUTDOWN: 'shutdown',
    EXIT: 'exit',
    TEXT_DOCUMENT_DID_OPEN: 'textDocument/didOpen',
    TEXT_DOCUMENT_DID_CHANGE: 'textDocument/didChange',
    TEXT_DOCUMENT_DID_SAVE: 'textDocument/didSave',
    TEXT_DOCUMENT_DID_CLOSE: 'textDocument/didClose',
    TEXT_DOCUMENT_HOVER: 'textDocument/hover',
    TEXT_DOCUMENT_DEFINITION: 'textDocument/definition',
    TEXT_DOCUMENT_REFERENCES: 'textDocument/references',
    TEXT_DOCUMENT_DOCUMENT_SYMBOL: 'textDocument/documentSymbol',
    WORKSPACE_CONFIGURATION: 'workspace/configuration',
  } as const,
} as const;

// ============================================
// Export
// ============================================

export type {
  LspManagerState,
  LspServerState,
  LspServerConfig,
  LspPluginConfig,
  LspServerInstance,
  LspServerManager,
  LspClient,
  LspClientStartOptions,
  LspInitializeParams,
  LspClientCapabilities,
  LspInitializeResult,
  LspServerCapabilities,
  LspConfigError,
};
