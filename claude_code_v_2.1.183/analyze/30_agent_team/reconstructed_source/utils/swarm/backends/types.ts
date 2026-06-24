/**
 * Shared types for the pane-backend layer of the Agent Team / "swarm" subsystem (v2.1.183).
 *
 * This is the interface that both concrete pane backends (TmuxBackend / ITermBackend)
 * implement and that the detection/registry layer constructs and caches. It is pure
 * type information — no behavior — so it carries no obfuscated-name anchors except for
 * the runtime-shaped `BackendRegistryState`, whose fields mirror the object literal
 * returned by the registry factory in the bundle.
 *
 * 2.1.183 regions covered:
 *   - the `type`/`displayName`/`supportsHideShow` fields + every method below are read off
 *     the two concrete classes Ndo (TmuxBackend @cli_inner_pretty.js:421879) and
 *     Udo (ITermBackend @422159); the `isPaneBackendType` guard is XFt @362768.
 *   - BackendRegistryState mirrors createBackendRegistry (J5a @422279-422290) field-by-field.
 *   - BackendDetectionResult mirrors the object detectAndGetBackend (eLe @422314) returns.
 * 2.1.88 ancestor: utils/swarm/backends/types.ts (BackendType, PaneBackendType, PaneId,
 *   CreatePaneResult, PaneBackend, BackendDetectionResult, isPaneBackend). The 88 file also
 *   carried the TeammateExecutor/TeammateSpawn* types; in the 183 tree those live with the
 *   spawner, so this file is trimmed to the pane-backend surface plus the registry state.
 * scaffold: 30_agent_team/spawn_backends_and_tmux_fix.md §1.1 (the carried-over two-mode split).
 * cross-val: re-read the Ndo/Udo method signatures @421879-422158 / @422159-422260 and
 *   J5a @422279 in the 183 bundle to confirm field/method names and the `iterm2` type literal.
 */

/**
 * The agent color names used for pane borders/titles. These are the eight keys of the
 * tmux color map V5a (@cli_inner_pretty.js:421854): each maps to a concrete tmux color.
 * 2.1.88 ancestor: tools/AgentTool/agentColorManager.ts re-exports this `AgentColorName`;
 * we inline the union here to keep the backend layer self-contained.
 */
// 2.1.183: color domain = keys of V5a @cli_inner_pretty.js:421854-421865
export type AgentColorName =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan'

/**
 * Types of backends available for teammate execution.
 * - 'tmux': tmux pane management (works inside the user's tmux or a standalone session)
 * - 'iterm2': iTerm2 native split panes via the `it2` CLI
 * - 'in-process': runs the teammate in the leader's own Node process (AsyncLocalStorage-scoped)
 */
export type BackendType = 'tmux' | 'iterm2' | 'in-process'

/** Subset of BackendType for terminal-pane backends only. */
export type PaneBackendType = 'tmux' | 'iterm2'

/**
 * Opaque pane identifier.
 * For tmux this is the pane id (e.g. "%3"); for iTerm2 it is the it2 session UUID.
 */
export type PaneId = string

/** Result of creating a new teammate pane. */
export type CreatePaneResult = {
  /** The pane id of the newly created pane. */
  paneId: PaneId
  /** Whether this was the first teammate pane (decides the split/layout strategy). */
  isFirstTeammate: boolean
}

/**
 * Interface implemented by both concrete pane backends (tmux / iTerm2).
 *
 * Operations that target the *external* swarm session (i.e. when Claude is not running
 * inside the user's own tmux) take `useExternalSession = true`, which routes the tmux
 * command through the `-L <claude-swarm-<pid>>` socket instead of the user's `-S` socket.
 */
export type PaneBackend = {
  /** Backend type discriminant. */
  readonly type: PaneBackendType

  /** Human-readable display name (e.g. "tmux", "iTerm2"). */
  readonly displayName: string

  /** Whether this backend supports hiding/showing panes (tmux: true, iTerm2: false). */
  readonly supportsHideShow: boolean

  /** Whether this backend is usable on this system (binary present, etc.). */
  isAvailable(): Promise<boolean>

  /** Whether Claude is currently running inside this backend's environment. */
  isRunningInside(): Promise<boolean>

  /**
   * Create a new pane for a teammate in the swarm view, applying the backend's
   * layout strategy. Returns the pane id and whether it was the first teammate.
   */
  createTeammatePaneInSwarmView(
    name: string,
    color: AgentColorName,
  ): Promise<CreatePaneResult>

  /**
   * Inject a command to run in a specific pane.
   *
   * v2.1.178 fix: tmux now does this with `respawn-pane -k -- <cmd>` (replacing the
   * pane's holding `cat` process), NOT `send-keys` (typing into a shell). iTerm2 uses
   * `it2 session run` (it never typed via send-keys).
   */
  sendCommandToPane(
    paneId: PaneId,
    command: string,
    useExternalSession?: boolean,
  ): Promise<void>

  /** Set the border color for a pane. */
  setPaneBorderColor(
    paneId: PaneId,
    color: AgentColorName,
    useExternalSession?: boolean,
  ): Promise<void>

  /** Set the title shown in a pane's border/header. */
  setPaneTitle(
    paneId: PaneId,
    name: string,
    color: AgentColorName,
    useExternalSession?: boolean,
  ): Promise<void>

  /** Enable border-status display (so titles render in the borders). */
  enablePaneBorderStatus(
    windowTarget?: string,
    useExternalSession?: boolean,
  ): Promise<void>

  /** Rebalance panes to the desired layout (leader-30%-main-vertical, or tiled). */
  rebalancePanes(windowTarget: string, hasLeader: boolean): Promise<void>

  /** Kill/close a specific pane. Resolves true on success. */
  killPane(paneId: PaneId, useExternalSession?: boolean): Promise<boolean>

  /** Hide a pane by breaking it out into the hidden session (tmux only). */
  hidePane(paneId: PaneId, useExternalSession?: boolean): Promise<boolean>

  /** Show a previously hidden pane by joining it back into a window (tmux only). */
  showPane(
    paneId: PaneId,
    targetWindowOrPane: string,
    useExternalSession?: boolean,
  ): Promise<boolean>
}

/** Result returned by the backend detector (`detectAndGetBackend` / eLe). */
export type BackendDetectionResult = {
  /** The backend that should be used. */
  backend: PaneBackend
  /** Whether Claude is running inside the backend's native environment. */
  isNative: boolean
  /** True when iTerm2 is detected but the `it2` CLI is not installed/configured. */
  needsIt2Setup?: boolean
}

/**
 * Mutable per-process registry state. Mirrors the object literal returned by the
 * registry factory (createBackendRegistry / J5a @cli_inner_pretty.js:422279): a cache of
 * the chosen backend + detection result, the lazily-loaded backend classes, and the
 * sticky `inProcessFallbackActive` bit consulted by isInProcessEnabled.
 */
// 2.1.183: BackendRegistryState shape = J5a @cli_inner_pretty.js:422279-422290
export type BackendRegistryState = {
  cachedBackend: PaneBackend | null
  cachedDetectionResult: BackendDetectionResult | null
  backendsRegistered: boolean
  cachedInProcessBackend: unknown | null
  cachedPaneBackendExecutor: unknown | null
  inProcessFallbackActive: boolean
  // Constructors are loaded lazily by ensureBackendsRegistered (u3n).
  TmuxBackendClass: (new () => PaneBackend) | null
  ITermBackendClass: (new () => PaneBackend) | null
}

// 2.1.183: isPaneBackendType = XFt @cli_inner_pretty.js:362768 ("tmux" || "iterm2")
/** Type guard: does this backend type use terminal panes? */
export function isPaneBackend(type: BackendType): type is PaneBackendType {
  return type === 'tmux' || type === 'iterm2'
}

// Mapping: BackendType/PaneBackend/CreatePaneResult/PaneId — 88 backends/types.ts shape;
//          BackendRegistryState→J5a literal, isPaneBackend→XFt, AgentColorName→keys of V5a
