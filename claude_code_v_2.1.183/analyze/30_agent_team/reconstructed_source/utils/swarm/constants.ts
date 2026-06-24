/**
 * Swarm-wide constants: tmux binary/holding-command, the teammate command-override
 * env var, the in-process poll interval, and the implicit-session-team name prefix
 * (v2.1.183).
 *
 * 2.1.183 regions:
 *   - cli_inner_pretty.js:362640 (B8 = "tmux"), 362642 (Gke = "cat"),
 *     362643 (_lt = "CLAUDE_CODE_TEAMMATE_COMMAND")   [all in the swarm constants block]
 *   - cli_inner_pretty.js:421380 (ZLp = 500, in-process poll interval)
 *   - cli_inner_pretty.js:682752/682817 (xic sessionTeamName uses B3f = "session")
 * 2.1.88 ancestor: utils/swarm/constants.ts (TMUX_COMMAND, TEAMMATE_COMMAND_ENV_VAR).
 * scaffold: _scout_dossier_agent_team.md §2 anchor table + §3.4 (tmux fix), _conventions.md registry.
 * cross-val: re-read the const block @362636-362643 (np@362636, N8@362638, ylt@362639,
 *   B8@362640, Qoo@362641, Gke@362642, _lt@362643; pDa regex init @362645 in the oF module),
 *   ZLp @421380, and B3f @682817 in the 183 bundle.
 *
 * NOTE on the v2.1.178 tmux fix: `TMUX_HOLDING_CMD` ("cat") is the benign process the
 * teammate pane is created running (split-window ... -- cat). The real teammate command
 * is then injected with `tmux respawn-pane -k -t <pane> -- <cmd>` (sendCommandToPane /
 * a3n), which replaces the pane's process directly instead of typing keystrokes via
 * `send-keys`. This fixes both the slow-rc-init race and the keystroke-leak. See
 * spawn_backends_and_tmux_fix.md.
 */

// 2.1.183: TEAM_LEAD_NAME = np @cli_inner_pretty.js:362636 ("team-lead")
/** Reserved agent name for the session leader (the human-driven main session). */
export const TEAM_LEAD_NAME = 'team-lead'

// 2.1.183: AGENT_NAME_RE = pDa @cli_inner_pretty.js:362645 (set in the oF module init)
/**
 * Allowed teammate-name shape: starts alnum, then up to 63 of [alnum_-].
 * Used by the Agent tool `name` schema and by tmux session-name slugging.
 */
export const AGENT_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/

// 2.1.183: TMUX_BIN = B8 @cli_inner_pretty.js:362640 ("tmux")
/** The tmux binary name, used as argv[0] for every tmux invocation. */
export const TMUX_BIN = 'tmux'

// 2.1.183: SWARM_SESSION_NAME = N8 @cli_inner_pretty.js:362638 ("claude-swarm")
/**
 * Name of the external standalone tmux session used when Claude is NOT already
 * running inside the user's tmux (the "claude-swarm-<pid>" -L socket hosts it).
 */
export const SWARM_SESSION_NAME = 'claude-swarm'

// 2.1.183: SWARM_VIEW_WINDOW_NAME = ylt @cli_inner_pretty.js:362639 ("swarm-view")
/** Window name inside the external swarm session that holds all teammate panes. */
export const SWARM_VIEW_WINDOW_NAME = 'swarm-view'

// 2.1.183: HIDDEN_SESSION_NAME = Qoo @cli_inner_pretty.js:362641 ("claude-hidden")
/** Detached session that hidePane breaks panes out into so they stay running but invisible. */
export const HIDDEN_SESSION_NAME = 'claude-hidden'

// 2.1.183: getSwarmSocketName = VFt @cli_inner_pretty.js:362633 ("claude-swarm-<pid>")
/**
 * The `-L` socket name for the external swarm tmux server. PID-scoped so multiple
 * Claude instances on the same machine never collide on one swarm socket.
 */
export function getSwarmSocketName(): string {
  return `claude-swarm-${process.pid}`
}

// 2.1.183: TMUX_HOLDING_CMD = Gke @cli_inner_pretty.js:362642 ("cat")
/**
 * Benign holding process the teammate pane is created running. The real command
 * replaces it via `respawn-pane -k -- <cmd>` (v2.1.178 send-keys -> respawn-pane fix).
 */
export const TMUX_HOLDING_CMD = 'cat'

// 2.1.183: TEAMMATE_COMMAND_ENV = _lt @cli_inner_pretty.js:362643 ("CLAUDE_CODE_TEAMMATE_COMMAND")
/**
 * Env var overriding the command used to spawn teammate instances. When unset,
 * the spawner defaults to the current Claude binary (process.execPath).
 */
export const TEAMMATE_COMMAND_ENV = 'CLAUDE_CODE_TEAMMATE_COMMAND'

// 2.1.183: IN_PROCESS_POLL_MS = ZLp @cli_inner_pretty.js:421380 (500)
/** Poll interval (ms) for the in-process teammate runner's mailbox loop. */
export const IN_PROCESS_POLL_MS = 500

// 2.1.183: SESSION_TEAM_PREFIX = B3f @cli_inner_pretty.js:682817 ("session")
/**
 * Prefix for the implicit, session-scoped team name. The team name is derived
 * deterministically as `session-<sessionId[:8]>` (see sessionTeamName / xic @682752).
 */
export const SESSION_TEAM_PREFIX = 'session'

// Mapping: np→TEAM_LEAD_NAME, pDa→AGENT_NAME_RE, B8→TMUX_BIN, N8→SWARM_SESSION_NAME,
//          ylt→SWARM_VIEW_WINDOW_NAME, Qoo→HIDDEN_SESSION_NAME, VFt→getSwarmSocketName,
//          Gke→TMUX_HOLDING_CMD, _lt→TEAMMATE_COMMAND_ENV,
//          ZLp→IN_PROCESS_POLL_MS, B3f→SESSION_TEAM_PREFIX
