/**
 * memoryFileDetection — predicates that classify whether a path / glob / shell
 * command targets a *Claude-managed* memory file or directory. Consumed by the
 * REPL render/collapse path (collapseReadSearchGroups → CNp/INp) to decide when
 * Read/Edit/Grep/Glob/Bash tool uses on memory files should be collapsed and
 * badged as "memory" operations instead of shown as full diffs.
 *
 * 2.1.183 regions: cli_inner_pretty.js:444832-444922 (the detection module, obf
 *   helpers ENp/kye + predicates i4t/V4n/xWe/TYa/HNp/kWe/$mo/wYa/CYa) ; callers in
 *   the render path at 444971-444985 (CNp/INp) and 445118 (per-group flags).
 * 2.1.88 ancestor: src/utils/memoryFileDetection.ts (full named mirror).
 * scaffold: 31_auto_memory/README.md (render path / memory badge), v2.1.156 memdir_core.md.
 * cross-val: re-read every predicate in the 183 bundle. DELTA vs the 88 ancestor:
 *   the `session_memory` arm was removed from detectSessionFileType (444844),
 *   detectSessionPatternType (444847-444850), and isMemoryDirectory (the
 *   /session-memory/ check that the 88 ancestor had between 444887 and 444888) —
 *   in 183 only `session_transcript` (.jsonl under /projects/) survives here, since
 *   session-summary memory moved to the separate compact subsystem (OUT of scope,
 *   see _conventions.md). The remaining behavior is byte-for-byte carryover.
 */

import { feature } from 'bun:bundle'
import { normalize, posix, win32 } from 'path'
import {
  getAutoMemPath,
  getMemoryBaseDir,
  isAutoMemoryEnabled,
  isAutoMemPath,
} from '../memdir/paths.js'
import { isAgentMemoryPath } from '../tools/AgentTool/agentMemory.js'
import { getClaudeConfigHomeDir } from './envUtils.js'
import {
  posixPathToWindowsPath,
  windowsPathToPosixPath,
} from './windowsPaths.js'

// teamMemPaths is loaded lazily behind feature('TEAMMEM') so the team-store code
// is tree-shaken out of builds that don't ship it. In the 2.1.183 bundle the
// gate is inlined-enabled (the team predicates Nk/vK/Bme are called directly),
// so this require() collapses to a static import there.
// 2.1.183: feature('TEAMMEM') inlined-enabled — teamMemPaths.isTeamMemFile = vK @151174,
//          isTeamMemoryEnabled = Nk @151098, isTeamMemPath = Bme @151159
/* eslint-disable @typescript-eslint/no-require-imports */
const teamMemPaths = feature('TEAMMEM')
  ? (require('../memdir/teamMemPaths.js') as typeof import('../memdir/teamMemPaths.js'))
  : null
/* eslint-enable @typescript-eslint/no-require-imports */

// 2.1.183: IS_WINDOWS = Rmo @444924 — in this (non-Windows) build the bundle
// constant-folds it to `var Rmo = !1`; it is read in kye/wYa @444837/444900/444909
// but never reassigned. Source-level it is `process.platform === 'win32'`.
const IS_WINDOWS = process.platform === 'win32'

// Normalize path separators to posix (/). Does NOT translate drive encoding.
// 2.1.183: toPosix = ENp @cli_inner_pretty.js:444832
function toPosix(p: string): string {
  return p.split(win32.sep).join(posix.sep)
}

// Convert a path to a stable string-comparable form: forward-slash separated,
// and on Windows, lowercased (Windows filesystems are case-insensitive).
// 2.1.183: toComparable = kye @cli_inner_pretty.js:444835
function toComparable(p: string): string {
  const posixForm = toPosix(p)
  return IS_WINDOWS ? posixForm.toLowerCase() : posixForm
}

/**
 * Detects if a file path is a session-related file under ~/.claude.
 * Returns the type of session file or null if not a session file.
 *
 * DELTA v2.1.x: the 88 ancestor also recognized `session_memory`
 * (`/session-memory/`*.md → 'session_memory'). In the 2.1.183 bundle that arm is
 * gone — only the `/projects/`*.jsonl → 'session_transcript' check remains, so the
 * return type narrows to `'session_transcript' | null`. Session-summary memory was
 * split out into the compact subsystem (07_compact/), which is OUT of scope here.
 */
// 2.1.183: detectSessionFileType = i4t @cli_inner_pretty.js:444839
export function detectSessionFileType(
  filePath: string,
): 'session_transcript' | null {
  const configDir = getClaudeConfigHomeDir()
  // Compare in forward-slash form; on Windows also case-fold. The caller
  // (isShellCommandTargetingMemory) converts MinGW /c/... → native before
  // reaching here, so we only need separator + case normalization.
  const normalized = toComparable(filePath)
  const configDirCmp = toComparable(configDir)
  if (!normalized.startsWith(configDirCmp)) {
    return null
  }
  // @444844 — session_memory arm removed in 183; only the transcript arm survives.
  if (normalized.includes('/projects/') && normalized.endsWith('.jsonl')) {
    return 'session_transcript'
  }
  return null
}

/**
 * Checks if a glob/pattern string indicates session file access intent.
 * Used for Grep/Glob tools where we check patterns, not actual file paths.
 *
 * DELTA v2.1.x: like detectSessionFileType, the `session-memory` → 'session_memory'
 * arm from the 88 ancestor is gone in 183 (@444847-444850); only the transcript
 * arm remains, narrowing the return type to `'session_transcript' | null`.
 */
// 2.1.183: detectSessionPatternType = V4n @cli_inner_pretty.js:444847
export function detectSessionPatternType(
  pattern: string,
): 'session_transcript' | null {
  const normalized = pattern.split(win32.sep).join(posix.sep)
  if (
    normalized.includes('.jsonl') ||
    (normalized.includes('projects') && normalized.includes('*.jsonl'))
  ) {
    return 'session_transcript'
  }
  return null
}

/**
 * Check if a file path is within the memdir directory.
 */
// 2.1.183: isAutoMemFile = xWe @cli_inner_pretty.js:444852 (isAutoMemPath = SK @147718)
export function isAutoMemFile(filePath: string): boolean {
  if (isAutoMemoryEnabled()) {
    return isAutoMemPath(filePath)
  }
  return false
}

export type MemoryScope = 'personal' | 'team'

/**
 * Determine which memory store (if any) a path belongs to.
 *
 * Team dir is a subdirectory of memdir (getTeamMemPath = join(getAutoMemPath, 'team')),
 * so a team path matches both isTeamMemFile and isAutoMemFile. Check team first.
 *
 * Use this for scope-keyed telemetry where a single event name distinguishes
 * by scope field — the existing tengu_memdir_* / tengu_team_mem_* event-name
 * hierarchy handles the overlap differently (team writes intentionally fire both).
 */
// 2.1.183: memoryScopeForPath = TYa @cli_inner_pretty.js:444856
//          (team branch checks vK @151174 = isTeamMemFile, which itself gates on Nk)
export function memoryScopeForPath(filePath: string): MemoryScope | null {
  if (feature('TEAMMEM') && teamMemPaths!.isTeamMemFile(filePath)) {
    return 'team'
  }
  if (isAutoMemFile(filePath)) {
    return 'personal'
  }
  return null
}

/**
 * Check if a file path is within an agent memory directory.
 */
// 2.1.183: isAgentMemFile = HNp @cli_inner_pretty.js:444861 (isAgentMemoryPath = n0t @152017)
function isAgentMemFile(filePath: string): boolean {
  if (isAutoMemoryEnabled()) {
    return isAgentMemoryPath(filePath)
  }
  return false
}

/**
 * Check if a file is a Claude-managed memory file (NOT user-managed instruction files).
 * Includes: auto-memory (memdir), team memory, agent memory, session transcripts.
 * Excludes: CLAUDE.md, CLAUDE.local.md, .claude/rules/*.md (user-managed).
 *
 * Use this for collapse/badge logic where user-managed files should show full diffs.
 * This is the primary render-path predicate: called from collapseReadSearchGroups
 * (CNp @444975, INp @444984) and the per-group flag map (445118).
 *
 * DELTA v2.1.x: detectSessionFileType no longer returns 'session_memory', so the
 * branch `detectSessionFileType(...) !== null` here now only matches transcripts.
 */
// 2.1.183: isAutoManagedMemoryFile = kWe @cli_inner_pretty.js:444865
export function isAutoManagedMemoryFile(filePath: string): boolean {
  if (isAutoMemFile(filePath)) {
    return true
  }
  if (feature('TEAMMEM') && teamMemPaths!.isTeamMemFile(filePath)) {
    return true
  }
  if (detectSessionFileType(filePath) !== null) {
    return true
  }
  if (isAgentMemFile(filePath)) {
    return true
  }
  return false
}

// Check if a directory path is a memory-related directory.
// Used by Grep/Glob which take a directory `path` rather than a specific file.
// Checks both configDir and memoryBaseDir to handle custom memory dir paths.
//
// DELTA v2.1.x: the 88 ancestor matched `/session-memory/` directories here; that
// branch is gone in 183 (@444888-444889 only keep /projects/ and /memory/).
// 2.1.183: isMemoryDirectory = $mo @cli_inner_pretty.js:444872
export function isMemoryDirectory(dirPath: string): boolean {
  // SECURITY: Normalize to prevent path traversal bypasses via .. segments.
  // On Windows this produces backslashes; toComparable flips them back for
  // string matching. MinGW /c/... paths are converted to native before
  // reaching here (extraction-time in isShellCommandTargetingMemory), so
  // normalize() never sees them.
  const normalizedPath = normalize(dirPath)
  const normalizedCmp = toComparable(normalizedPath)
  // Agent memory directories can be under cwd (project scope), configDir, or memoryBaseDir
  if (
    isAutoMemoryEnabled() &&
    (normalizedCmp.includes('/agent-memory/') ||
      normalizedCmp.includes('/agent-memory-local/'))
  ) {
    return true
  }
  // Team memory directories live under <autoMemPath>/team/
  // @444876 — isTeamMemoryEnabled = Nk @151098, isTeamMemPath = Bme @151159
  if (
    feature('TEAMMEM') &&
    teamMemPaths!.isTeamMemoryEnabled() &&
    teamMemPaths!.isTeamMemPath(normalizedPath)
  ) {
    return true
  }
  // Check the auto-memory path override (CLAUDE_COWORK_MEMORY_PATH_OVERRIDE)
  // @444877-444882 — getAutoMemPath = hm @147746
  if (isAutoMemoryEnabled()) {
    const autoMemPath = getAutoMemPath()
    const autoMemDirCmp = toComparable(autoMemPath.replace(/[/\\]+$/, ''))
    const autoMemPathCmp = toComparable(autoMemPath)
    if (
      normalizedCmp === autoMemDirCmp ||
      normalizedCmp.startsWith(autoMemPathCmp)
    ) {
      return true
    }
  }

  // getMemoryBaseDir = Wse @147666 (returns CLAUDE_CODE_REMOTE_MEMORY_DIR or configDir)
  const configDirCmp = toComparable(getClaudeConfigHomeDir())
  const memoryBaseCmp = toComparable(getMemoryBaseDir())
  const underConfig = normalizedCmp.startsWith(configDirCmp)
  const underMemoryBase = normalizedCmp.startsWith(memoryBaseCmp)

  if (!underConfig && !underMemoryBase) {
    return false
  }
  // @444888 — /session-memory/ directory check removed in 183.
  if (underConfig && normalizedCmp.includes('/projects/')) {
    return true
  }
  if (isAutoMemoryEnabled() && normalizedCmp.includes('/memory/')) {
    return true
  }
  return false
}

/**
 * Check if a shell command string (Bash or PowerShell) targets memory files
 * by extracting absolute path tokens and checking them against memory
 * detection functions. Used for Bash/PowerShell grep/search commands in the
 * collapse logic.
 */
// 2.1.183: isShellCommandTargetingMemory = wYa @cli_inner_pretty.js:444892
export function isShellCommandTargetingMemory(command: string): boolean {
  const configDir = getClaudeConfigHomeDir()
  const memoryBase = getMemoryBaseDir()
  const autoMemDir = isAutoMemoryEnabled()
    ? getAutoMemPath().replace(/[/\\]+$/, '')
    : ''

  // Quick check: does the command mention the config, memory base, or
  // auto-mem directory? Compare in forward-slash form (PowerShell on Windows
  // may use either separator while configDir uses the platform-native one).
  // On Windows also check the MinGW form (/c/...) since BashTool runs under
  // Git Bash which emits that encoding. On Linux/Mac, configDir is already
  // posix so only one form to check — and crucially, windowsPathToPosixPath
  // is NOT called, so Linux paths like /m/foo aren't misinterpreted as MinGW.
  const commandCmp = toComparable(command)
  const dirs = [configDir, memoryBase, autoMemDir].filter(Boolean)
  const matchesAnyDir = dirs.some(d => {
    if (commandCmp.includes(toComparable(d))) return true
    if (IS_WINDOWS) {
      // BashTool on Windows (Git Bash) emits /c/Users/... — check MinGW form too
      // @444900 — windowsPathToPosixPath = ND @47604
      return commandCmp.includes(windowsPathToPosixPath(d).toLowerCase())
    }
    return false
  })
  if (!matchesAnyDir) {
    return false
  }

  // Extract absolute path-like tokens. Matches Unix absolute paths (/foo/bar),
  // Windows drive-letter paths (C:\foo, C:/foo), and MinGW paths (/c/foo —
  // they're /-prefixed so the regex already captures them). Bare backslash
  // tokens (\foo) are intentionally excluded — they appear in regex/grep
  // patterns and would cause false-positive memory classification after
  // normalization flips backslashes to forward slashes.
  // @444905 — regex copied verbatim from the bundle.
  const matches = command.match(/(?:[A-Za-z]:[/\\]|\/)[^\s'"]+/g)
  if (!matches) {
    return false
  }

  for (const match of matches) {
    // Strip trailing shell metacharacters that could be adjacent to a path
    const cleanPath = match.replace(/[,;|&>]+$/, '')
    // On Windows, convert MinGW /c/... → native C:\... at this single
    // point. Downstream predicates (isAutoManagedMemoryFile, isMemoryDirectory,
    // isAutoMemPath, isAgentMemoryPath) then receive native paths and only
    // need toComparable() for matching. On other platforms, paths are already
    // native — no conversion, so /m/foo etc. pass through unmodified.
    // @444909 — posixPathToWindowsPath = G$e @47614
    const nativePath = IS_WINDOWS
      ? posixPathToWindowsPath(cleanPath)
      : cleanPath
    if (isAutoManagedMemoryFile(nativePath) || isMemoryDirectory(nativePath)) {
      return true
    }
  }

  return false
}

// Check if a glob/pattern targets auto-managed memory files only.
// Excludes CLAUDE.md, CLAUDE.local.md, .claude/rules/ (user-managed).
// Used for collapse badge logic where user-managed files should not be
// counted as "memory" operations.
//
// DELTA v2.1.x: detectSessionPatternType no longer matches 'session_memory', so
// the first branch here now only fires for transcript-targeting patterns.
// 2.1.183: isAutoManagedMemoryPattern = CYa @cli_inner_pretty.js:444914
export function isAutoManagedMemoryPattern(pattern: string): boolean {
  if (detectSessionPatternType(pattern) !== null) {
    return true
  }
  if (
    isAutoMemoryEnabled() &&
    (pattern.replace(/\\/g, '/').includes('agent-memory/') ||
      pattern.replace(/\\/g, '/').includes('agent-memory-local/'))
  ) {
    return true
  }
  return false
}
