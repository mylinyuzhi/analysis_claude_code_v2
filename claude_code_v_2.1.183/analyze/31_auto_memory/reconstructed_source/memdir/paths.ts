/**
 * memdir/paths.ts — auto-memory gate + path resolver (v2.1.183 restoration)
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - isAutoMemoryEnabled (Iu) @147636 + ccrSentinelDisabled (Oyn) @147654
 *   - isExtractModeActive (Nyn) @147662
 *   - getMemoryBaseDir (Wse) @147666
 *   - isTinyMemoryEnabled (aH) @147673 + memoryDirName (XXu) @147670
 *   - validateMemoryPath ($mi) @147676
 *   - getAutoMemPathOverride (Omi) @147697 / getAutoMemPathSetting (QXu) @147700
 *   - hasAutoMemPathOverride (Byn) @147709
 *   - getAutoMemBase (ZXu) @147712 / getAutoMemEntrypoint (bBe) @147715
 *   - isAutoMemPath (SK) @147718 / isAutoMemPathWritable (Lkt) @147721
 *   - getAutoMemPath (hm, memoized) @147746
 *   - dir-exclusion predicate dTe @146823 + WXu exclusion set @146836
 *
 * 2.1.88 ancestor (shape + real names + comments): src/memdir/paths.ts
 * scaffold: 31_auto_memory/README.md "Gates + paths (Delta 4)" + the isAutoMemoryEnabled
 *           snippet @README:480; v2.1.156 memdir_core.md §2 (master gate chain)
 * cross-val: re-read Iu@147636 (each gate branch), $mi@147676 (security rejects incl. the
 *           NEW `../` leading-segment reject @147682), QXu@147700 (NEW project-trust-gated
 *           local/projectSettings tier), hm@147746 memo key `${root}|${tiny}|${trust}`.
 *
 * Divergences from the 88 ancestor (all confirmed live in 183):
 *   - DELTA: isAutoMemoryEnabled gained 4 new gates — sessionToggledOff (uU), isSafeMode (Nl),
 *     ccrSentinelDisabled (Oyn, model-allowlist disable), and the CCR branch now also passes
 *     when CLAUDE_COWORK_MEMORY_PATH_OVERRIDE is set.
 *   - DELTA: NEW tiny-memory mode — memoryDirName() returns "tiny_memory" instead of "memory"
 *     when tengu_billiard_aviary is on; the memo key now includes the tiny flag.
 *   - DELTA: getAutoMemPathSetting now trusts localSettings/projectSettings only when the
 *     project is trusted (non-interactive OR trust-dialog accepted).
 *   - DELTA: validateMemoryPath now also rejects `~/..` / `~/foo/..` leading-`..` remainders.
 *   - DELTA: NEW isAutoMemPathWritable (Lkt) — isAutoMemPath AND not inside an excluded
 *     subdir (.git/hooks/node_modules/.claude/skills/…); drives the .md write carve-out.
 *   - REMOVED in 183: the KAIROS getAutoMemDailyLogPath helper has no counterpart in the
 *     183 path module (see note at end of file).
 */

import memoize from 'lodash-es/memoize.js'
import { homedir } from 'os'
import { isAbsolute, join, normalize, sep } from 'path'
import {
  getIsNonInteractiveSession,
  getProjectRoot,
} from '../bootstrap/state.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'
import {
  getClaudeConfigHomeDir,
  isEnvDefinedFalsy,
  isEnvTruthy,
} from '../utils/envUtils.js'
import { findCanonicalGitRoot } from '../utils/git.js'
import { sanitizePath } from '../utils/path.js'
import {
  getInitialSettings,
  getSettingsForSource,
} from '../utils/settings/settings.js'
import {
  isMemoryToggledOff,
  isSafeMode,
  isProjectTrusted,
  getMainLoopModelOverride,
  getInitialMainLoopModel,
} from '../bootstrap/runtimeState.js'

/**
 * Whether auto-memory features are enabled (memdir, agent memory, past session search).
 * Enabled by default. Priority chain (first defined wins):
 *   0. session runtime toggle (/toggle off) → OFF                     [DELTA 2.1.183]
 *   0. CLAUDE_CODE_SAFE_MODE / --safe-mode → OFF                       [DELTA 2.1.183]
 *   1. CLAUDE_CODE_DISABLE_AUTO_MEMORY env var (1/true → OFF, 0/false → ON)
 *   2. CLAUDE_CODE_SIMPLE (--bare) → OFF
 *   3. CCR without persistent storage → OFF
 *      (no CLAUDE_CODE_REMOTE_MEMORY_DIR AND no CLAUDE_COWORK_MEMORY_PATH_OVERRIDE) [DELTA 2.1.183]
 *   4. ccrSentinelDisabled() — model-allowlist kill-switch → OFF       [DELTA 2.1.183]
 *   5. autoMemoryEnabled in settings.json (supports project-level opt-out)
 *   6. Default: enabled
 *
 * 2.1.88 ancestor: isAutoMemoryEnabled (same skeleton; gates 0/3-tail/4 are new in 183).
 * scaffold: README.md §"Gates + paths (Delta 4)" + snippet @README:480.
 */
// 2.1.183: isAutoMemoryEnabled = Iu @cli_inner_pretty.js:147636
export function isAutoMemoryEnabled(): boolean {
  // @147637 DELTA 2.1.183: per-session in-memory kill switch (set by the
  // memory toggle); short-circuits every other gate.
  if (isMemoryToggledOff()) {
    return false
  }
  // @147638 DELTA 2.1.183: --safe-mode / CLAUDE_CODE_SAFE_MODE hard-disables.
  if (isSafeMode()) {
    return false
  }
  const envVal = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY
  if (isEnvTruthy(envVal)) {
    return false
  }
  if (isEnvDefinedFalsy(envVal)) {
    return true
  }
  // --bare / SIMPLE: prompts.ts already drops the memory section from the
  // system prompt via its SIMPLE early-return; this gate stops the other half
  // (extractMemories turn-end fork, autoDream, /remember, /dream, team sync).
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    return false
  }
  // @147643 DELTA 2.1.183: a remote (CCR) session is disabled unless it has a
  // persistent mount — either CLAUDE_CODE_REMOTE_MEMORY_DIR or, new in 183,
  // a Cowork path override. Without one, there is nowhere durable to write.
  if (
    isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) &&
    !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR &&
    !process.env.CLAUDE_COWORK_MEMORY_PATH_OVERRIDE
  ) {
    return false
  }
  // @147649 DELTA 2.1.183: model-targeted kill switch (see below).
  if (ccrSentinelDisabled()) {
    return false
  }
  const settings = getInitialSettings()
  if (settings.autoMemoryEnabled !== undefined) {
    return settings.autoMemoryEnabled
  }
  return true
}

/**
 * Server-driven, model-targeted disable for auto-memory.  [DELTA 2.1.183]
 *
 * `tengu_sepia_cormorant` is a list of case-insensitive substrings matched
 * against the effective main-loop model name (override, else the initial
 * model). If the active model matches the list AND `tengu_umber_petrel` is
 * true, auto-memory is force-disabled — letting Anthropic remotely roll back
 * the feature for a specific model family without a client release.
 *
 * No allowlist (null / empty / no match) → not disabled by this gate.
 * 2.1.88 ancestor: none (new in 183).
 */
// 2.1.183: ccrSentinelDisabled = Oyn @cli_inner_pretty.js:147654
function ccrSentinelDisabled(): boolean {
  const modelAllowlist = getFeatureValue_CACHED_MAY_BE_STALE(
    'tengu_sepia_cormorant',
    null as string[] | null,
  )
  if (!Array.isArray(modelAllowlist) || modelAllowlist.length === 0) {
    return false
  }
  const override = getMainLoopModelOverride()
  const model = override !== undefined ? override : getInitialMainLoopModel()
  if (typeof model !== 'string' || !matchesAny(model, modelAllowlist)) {
    return false
  }
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_umber_petrel', false)
}

// 2.1.183: matchesAny = Myn @cli_inner_pretty.js:146806
// Case-insensitive: true if `value` contains any non-empty needle as a substring.
function matchesAny(value: string, needles: string[]): boolean {
  const haystack = value.toLowerCase()
  for (const needle of needles) {
    if (
      typeof needle === 'string' &&
      needle.length > 0 &&
      haystack.includes(needle.toLowerCase())
    ) {
      return true
    }
  }
  return false
}

/**
 * Whether the extract-memories background agent will run this session.
 *
 * The main agent's prompt always has full save instructions regardless of
 * this gate — when the main agent writes memories, the background agent
 * skips that range (hasMemoryWritesSince in extractMemories.ts); when it
 * doesn't, the background agent catches anything missed.
 *
 * Callers must also gate on feature('EXTRACT_MEMORIES') — that check cannot
 * live inside this helper because feature() only tree-shakes when used
 * directly in an `if` condition.
 *
 * 2.1.88 ancestor: isExtractModeActive (unchanged behavior).
 */
// 2.1.183: isExtractModeActive = Nyn @cli_inner_pretty.js:147662
export function isExtractModeActive(): boolean {
  if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_passport_quail', false)) {
    return false
  }
  return (
    !getIsNonInteractiveSession() ||
    getFeatureValue_CACHED_MAY_BE_STALE('tengu_slate_thimble', false)
  )
}

/**
 * Returns the base directory for persistent memory storage.
 * Resolution order:
 *   1. CLAUDE_CODE_REMOTE_MEMORY_DIR env var (explicit override, set in CCR)
 *   2. ~/.claude (default config home)
 *
 * 2.1.88 ancestor: getMemoryBaseDir (unchanged).
 */
// 2.1.183: getMemoryBaseDir = Wse @cli_inner_pretty.js:147666
export function getMemoryBaseDir(): string {
  if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
    return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR
  }
  return getClaudeConfigHomeDir()
}

const AUTO_MEM_DIRNAME = 'memory'
// DELTA 2.1.183: tiny-memory mode writes under a sibling "tiny_memory" dir so the
// two modes never collide in the same project key.
const AUTO_MEM_TINY_DIRNAME = 'tiny_memory'
const AUTO_MEM_ENTRYPOINT_NAME = 'MEMORY.md'

/**
 * Tiny-memory mode gate.  [DELTA 2.1.183]
 * When `tengu_billiard_aviary` is on, the auto-memory subsystem runs in a
 * compact "tiny" variant (smaller recall prompts, a "# Dream: Memory Pruning"
 * dream instead of full consolidation, and the "tiny_memory" storage dir).
 * 2.1.88 ancestor: none (new in 183).
 */
// 2.1.183: isTinyMemoryEnabled = aH @cli_inner_pretty.js:147673
export function isTinyMemoryEnabled(): boolean {
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_billiard_aviary', false)
}

// 2.1.183: memoryDirName = XXu @cli_inner_pretty.js:147670
// Selects the storage dir leaf name based on tiny-memory mode.
function memoryDirName(): string {
  return isTinyMemoryEnabled() ? AUTO_MEM_TINY_DIRNAME : AUTO_MEM_DIRNAME
}

/**
 * Normalize and validate a candidate auto-memory directory path.
 *
 * SECURITY: Rejects paths that would be dangerous as a read-allowlist root
 * or that normalize() doesn't fully resolve:
 * - relative (!isAbsolute): "../foo" — would be interpreted relative to CWD
 * - root/near-root (length < 3): "/" → "" after strip; "/a" too short
 * - Windows drive-root (C: regex): "C:\" → "C:" after strip
 * - UNC paths (\\server\share): network paths — opaque trust boundary
 * - null byte: survives normalize(), can truncate in syscalls
 *
 * Returns the normalized path with exactly one trailing separator,
 * or undefined if the path is unset/empty/rejected.
 *
 * 2.1.88 ancestor: validateMemoryPath (same shape; the `~/..` remainder reject
 * is hardened in 183 — see DELTA below).
 */
// 2.1.183: validateMemoryPath = $mi @cli_inner_pretty.js:147676
function validateMemoryPath(
  raw: string | undefined,
  expandTilde: boolean,
): string | undefined {
  if (!raw) {
    return undefined
  }
  let candidate = raw
  // Settings.json paths support ~/ expansion (user-friendly). The env var
  // override does not (it's set programmatically by Cowork/SDK, which should
  // always pass absolute paths). Bare "~", "~/", "~/.", "~/..", etc. are NOT
  // expanded — they would make isAutoMemPath() match all of $HOME or its
  // parent (same class of danger as "/" or "C:\").
  if (
    expandTilde &&
    (candidate.startsWith('~/') || candidate.startsWith('~\\'))
  ) {
    const rest = candidate.slice(2)
    // normalize('') = '.', normalize('.') = '.', normalize('foo/..') = '.',
    // normalize('..') = '..'
    const restNorm = normalize(rest || '.')
    // @147682 DELTA 2.1.183: additionally reject any remainder that begins by
    // climbing out of $HOME ("../…", "..\…") — e.g. "~/../etc" — so the
    // expanded path can never escape the home directory.
    if (
      restNorm === '.' ||
      restNorm === '..' ||
      restNorm.startsWith(`..${sep}`) ||
      restNorm.startsWith('../') ||
      restNorm.startsWith('..\\')
    ) {
      return undefined
    }
    candidate = join(homedir(), rest)
  }
  // normalize() may preserve a trailing separator; strip before adding
  // exactly one to match the trailing-sep contract of getAutoMemPath()
  const normalized = normalize(candidate).replace(/[/\\]+$/, '')
  if (
    !isAbsolute(normalized) ||
    normalized.length < 3 ||
    /^[A-Za-z]:$/.test(normalized) ||
    normalized.startsWith('\\\\') ||
    normalized.startsWith('//') ||
    normalized.includes('\0')
  ) {
    return undefined
  }
  return (normalized + sep).normalize('NFC')
}

/**
 * Direct override for the full auto-memory directory path via env var.
 * When set, getAutoMemPath()/getAutoMemEntrypoint() return this path directly
 * instead of computing `{base}/projects/{sanitized-cwd}/memory/`.
 *
 * Used by Cowork to redirect memory to a space-scoped mount where the
 * per-session cwd (which contains the VM process name) would otherwise
 * produce a different project-key for every session.
 *
 * 2.1.88 ancestor: getAutoMemPathOverride (unchanged).
 */
// 2.1.183: getAutoMemPathOverride = Omi @cli_inner_pretty.js:147697
function getAutoMemPathOverride(): string | undefined {
  return validateMemoryPath(
    process.env.CLAUDE_COWORK_MEMORY_PATH_OVERRIDE,
    false,
  )
}

/**
 * Settings.json override for the full auto-memory directory path.
 * Supports ~/ expansion for user convenience.
 *
 * SECURITY: project-trust gating. policySettings and flagSettings (managed /
 * flag-driven sources) are always honored. localSettings and projectSettings
 * (`.claude/settings.json`, which can be committed to a repo) are honored ONLY
 * when the project is trusted — non-interactive sessions, or interactive ones
 * where the trust dialog was accepted. An untrusted repo therefore cannot set
 * autoMemoryDirectory: "~/.ssh" and gain silent write access via the
 * filesystem.ts .md write carve-out (which fires when isAutoMemPathWritable()
 * matches and hasAutoMemPathOverride() is false). userSettings (global,
 * user-owned) is the final fallback.
 *
 * 2.1.88 ancestor: getAutoMemPathSetting — DELTA 2.1.183: the 88 ancestor
 * unconditionally read localSettings and never read projectSettings; 183 reads
 * BOTH but only behind the project-trust gate.
 */
// 2.1.183: getAutoMemPathSetting = QXu @cli_inner_pretty.js:147700
function getAutoMemPathSetting(): string | undefined {
  // @147701 DELTA 2.1.183: project-trust gate for repo-committable sources.
  const projectTrusted = isProjectTrusted()
  const dir =
    getSettingsForSource('policySettings')?.autoMemoryDirectory ??
    getSettingsForSource('flagSettings')?.autoMemoryDirectory ??
    (projectTrusted
      ? (getSettingsForSource('localSettings')?.autoMemoryDirectory ??
        getSettingsForSource('projectSettings')?.autoMemoryDirectory)
      : undefined) ??
    getSettingsForSource('userSettings')?.autoMemoryDirectory
  return validateMemoryPath(dir, true)
}

/**
 * Check if CLAUDE_COWORK_MEMORY_PATH_OVERRIDE is set to a valid override.
 * Use this as a signal that the SDK caller has explicitly opted into
 * the auto-memory mechanics — e.g. to decide whether to inject the
 * memory prompt when a custom system prompt replaces the default.
 *
 * 2.1.88 ancestor: hasAutoMemPathOverride (unchanged).
 */
// 2.1.183: hasAutoMemPathOverride = Byn @cli_inner_pretty.js:147709
export function hasAutoMemPathOverride(): boolean {
  return getAutoMemPathOverride() !== undefined
}

/**
 * Returns the canonical git repo root if available, otherwise falls back to
 * the stable project root. Uses findCanonicalGitRoot so all worktrees of the
 * same repo share one auto-memory directory (anthropics/claude-code#24382).
 *
 * 2.1.88 ancestor: getAutoMemBase (unchanged).
 */
// 2.1.183: getAutoMemBase = ZXu @cli_inner_pretty.js:147712
function getAutoMemBase(): string {
  return findCanonicalGitRoot(getProjectRoot()) ?? getProjectRoot()
}

/**
 * Returns the auto-memory directory path.
 *
 * Resolution order:
 *   1. CLAUDE_COWORK_MEMORY_PATH_OVERRIDE env var (full-path override, used by Cowork)
 *   2. autoMemoryDirectory in settings.json (trusted sources only — see
 *      getAutoMemPathSetting for the project-trust gating)
 *   3. <memoryBase>/projects/<sanitized-git-root>/<dirName>/
 *      where memoryBase is resolved by getMemoryBaseDir() and dirName is
 *      "memory" or, in tiny mode, "tiny_memory"
 *
 * Memoized: render-path callers (collapseReadSearchGroups → isAutoManagedMemoryFile)
 * fire per tool-use message per Messages re-render; each miss costs
 * getSettingsForSource × 4 → parseSettingsFile (realpathSync + readFileSync).
 *
 * 2.1.88 ancestor: getAutoMemPath. DELTA 2.1.183: the memo key now also folds
 * in the tiny-mode flag and the project-trust flag (both can flip the resolved
 * dir without the projectRoot changing), and the dir leaf comes from
 * memoryDirName() instead of a fixed "memory".
 */
// 2.1.183: getAutoMemPath = hm @cli_inner_pretty.js:147746 (memoized)
export const getAutoMemPath = memoize(
  (): string => {
    const override = getAutoMemPathOverride() ?? getAutoMemPathSetting()
    if (override) {
      return override
    }
    const projectsDir = join(getMemoryBaseDir(), 'projects')
    return (
      join(projectsDir, sanitizePath(getAutoMemBase()), memoryDirName()) + sep
    ).normalize('NFC')
  },
  // @147753 DELTA 2.1.183: memo key = `${projectRoot}|${tinyMode}|${trusted}`
  () => `${getProjectRoot()}|${isTinyMemoryEnabled()}|${isProjectTrusted()}`,
)

/**
 * Returns the auto-memory entrypoint (MEMORY.md inside the auto-memory dir).
 * Follows the same resolution order as getAutoMemPath().
 *
 * 2.1.88 ancestor: getAutoMemEntrypoint (unchanged).
 */
// 2.1.183: getAutoMemEntrypoint = bBe @cli_inner_pretty.js:147715
export function getAutoMemEntrypoint(): string {
  return join(getAutoMemPath(), AUTO_MEM_ENTRYPOINT_NAME)
}

/**
 * The auto-memory base directory the watcher's chokidar watch + lane resolver
 * compare against. A thin alias of getAutoMemPath() — the watcher routes events
 * by their position relative to this root (team/… → team lane, the rest → user
 * lane). Kept as its own named helper to match the watcher's call site.
 *
 * 2.1.88 ancestor: none (the multistore watcher scope-split is net-new in 183).
 */
// 2.1.183: getAutoMemBaseDir = C0n @cli_inner_pretty.js:289763 (`return hm()`)
export function getAutoMemBaseDir(): string {
  return getAutoMemPath()
}

/**
 * Check if an absolute path is within the auto-memory directory.
 *
 * When CLAUDE_COWORK_MEMORY_PATH_OVERRIDE is set, this matches against the
 * env-var override directory. Note that a true return here does NOT imply
 * write permission in that case — the filesystem.ts write carve-out is gated
 * on !hasAutoMemPathOverride() (it exists to bypass DANGEROUS_DIRECTORIES) and,
 * in 183, additionally on isAutoMemPathWritable().
 *
 * The settings.json autoMemoryDirectory DOES get the write carve-out: it's the
 * user's explicit choice from a trusted settings source, and
 * hasAutoMemPathOverride() remains false for it.
 *
 * 2.1.88 ancestor: isAutoMemPath (unchanged).
 */
// 2.1.183: isAutoMemPath = SK @cli_inner_pretty.js:147718
export function isAutoMemPath(absolutePath: string): boolean {
  // SECURITY: Normalize to prevent path traversal bypasses via .. segments
  const normalizedPath = normalize(absolutePath)
  return normalizedPath.startsWith(getAutoMemPath())
}

/**
 * Stricter variant of isAutoMemPath used to authorize a write.  [DELTA 2.1.183]
 *
 * Returns true only when `absolutePath` is inside the auto-memory directory
 * AND does not pass through (or end in) a structurally-sensitive subdirectory
 * — ".git", "hooks", "node_modules", ".claude", "skills", "commands",
 * "agents", git internals ("objects"/"refs"/"head"/"config"), editor dirs, etc.
 * (the full set is matched per path segment, case- and homoglyph-folded).
 *
 * This is the predicate that the filesystem `.md` write carve-out actually
 * uses (see filesystem.ts: `!hasAutoMemPathOverride() && path.endsWith(".md")
 * && isAutoMemPathWritable(path)`), so that auto-memory's permission bypass can
 * never be steered into, say, a repo's `.git/hooks` even if it lives under the
 * memory root.
 *
 * 2.1.88 ancestor: none (new in 183).
 */
// 2.1.183: isAutoMemPathWritable = Lkt @cli_inner_pretty.js:147721
export function isAutoMemPathWritable(absolutePath: string): boolean {
  const normalizedPath = normalize(absolutePath)
  const root = getAutoMemPath()
  if (!normalizedPath.startsWith(root)) {
    return false
  }
  return !pathCrossesExcludedDir(normalizedPath, root)
}

/**
 * Per-segment exclusion check for the auto-memory write carve-out.  [DELTA 2.1.183]
 *
 * Walks each path segment *below* `root`, folding it to a canonical form
 * (lowercase, homoglyph-normalized, control-char stripped, extension/trailing
 * dots removed) and returning true if any segment is in the always-excluded
 * set, or the final segment is in the optional `extraLeafNames` set.
 *
 * 2.1.88 ancestor: none (new in 183).
 */
// 2.1.183: pathCrossesExcludedDir = dTe @cli_inner_pretty.js:146823
function pathCrossesExcludedDir(
  fullPath: string,
  root: string,
  extraLeafNames?: Set<string>,
): boolean {
  const segments = fullPath.slice(root.length).split(sep)
  const lastIndex = segments.length - 1
  for (let i = 0; i < segments.length; i++) {
    const canonical = canonicalizeSegment(segments[i])
    if (EXCLUDED_DIR_SEGMENTS.has(canonical)) {
      return true
    }
    if (i === lastIndex && extraLeafNames?.has(canonical)) {
      return true
    }
  }
  return false
}

/**
 * Canonicalize a single path segment for exclusion matching.  [DELTA 2.1.183]
 * Lowercase, fold Turkish-dotless-i / long-s, strip zero-width & bidi controls,
 * drop a trailing `.<ext>` and trailing dots/spaces (Windows shortname tricks).
 * Falls back to the lowercased form if the stripped result is empty.
 */
// 2.1.183: canonicalizeSegment = bK @cli_inner_pretty.js:146811
function canonicalizeSegment(segment: string): string {
  const lowered = segment
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ſ/g, 's')
  return (
    lowered
      // zero-width + bidi-override + invisible-format chars
      .replace(/[‌-‏‪-‮⁪-⁯﻿]/g, '')
      .replace(/:.*$/, '')
      .replace(/[. ]+$/, '') || lowered
  )
}

/**
 * Directory segment names that must never appear inside a write target under
 * the auto-memory root (matched per-segment, canonicalized).  [DELTA 2.1.183]
 * 2.1.183: EXCLUDED_DIR_SEGMENTS = WXu @cli_inner_pretty.js:146836
 */
const EXCLUDED_DIR_SEGMENTS = new Set<string>([
  '.git',
  'hooks',
  '.husky',
  '.githooks',
  'node_modules',
  '.vscode',
  '.idea',
  'head',
  'config',
  'objects',
  'refs',
  '.claude',
  'skills',
  'commands',
  'agents',
  '.cargo',
  '.devcontainer',
  '.yarn',
  '.mvn',
])

// ---------------------------------------------------------------------------
// NOTE — removed in 2.1.183 vs the 2.1.88 ancestor:
//   getAutoMemDailyLogPath(date) — the KAIROS daily-log helper
//   (<autoMemPath>/logs/YYYY/MM/YYYY-MM-DD.md) — has no counterpart in the
//   183 path module. The only `"logs"` join under the memory root in 183 lives
//   in autoDream pruning (cli_inner_pretty.js:455570), and the date-formatting
//   getFullYear/padStart helpers in the bundle are general-purpose, not memdir
//   path builders. Omitted rather than carried forward as false carryover.
// ---------------------------------------------------------------------------
