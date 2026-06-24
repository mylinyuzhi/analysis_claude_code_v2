/**
 * components/memory/MemoryUpdateNotification.tsx — readable-source restoration (v2.1.183)
 * ============================================================================
 *
 * The REPL renderer for the `memory_saved` system message — the
 * "Saved/Improved N memories · M team memories" status line emitted after the
 * per-turn extraction subagent or the auto-dream consolidator writes memory
 * files. Both producers funnel through `createMemorySavedMessage`
 * (utils/messages.ts) and differ only in the patched `verb` ("Saved" vs
 * "Improved") and the optional `teamCount`.
 *
 * ----------------------------------------------------------------------------
 * ⚠️ SHAPE NOTE — this file diverged from its v2.1.88 ancestor.
 * In v2.1.88, `src/components/memory/MemoryUpdateNotification.tsx` was a tiny
 * component that rendered a single line — `Memory updated in {path} · /memory
 * to edit` — via a `getRelativeMemoryPath()` helper (home/cwd-relative path
 * shortening). By v2.1.183 the `memory_saved` render path has been rebuilt
 * around a *summary + per-file clickable list* model with a team-memory segment
 * and a verbose gate. The v2.1.88 single-line component no longer exists in the
 * 183 bundle; the live renderer is `Svp` (the function reconstructed here as
 * `MemoryUpdateNotification`). We keep the original filename + the
 * `getRelativeMemoryPath` ancestor logic alongside (it is still the natural
 * home for path-shortening), but the *exported renderer* now mirrors `Svp`.
 * ----------------------------------------------------------------------------
 *
 * v2.1.183 regions covered (cli_inner_pretty.js):
 *   - renderMemorySaved  = Svp  @383399-383440  (summary always; file list verbose-only)
 *   - renderClickableFile = Evp @383441-383443  (key/path wrapper)
 *   - clickableFile      = Hvp  @383444-383473  (onClick→openFile, hover underline)
 *   - teamMemSavedPart   = ANa  @382753-382757  ("N team memories" segment; carryover)
 *   - dispatch case      = SNa  @382861, memory_saved branch @382871-382883
 *                          (verbose = verbose || isTranscriptMode @382872, carryover)
 *   - openFile           = Uxt  @137434-137442  (spawns `xdg-open <path>`)
 *
 * v2.1.88 ancestor (shape + real names): src/components/memory/MemoryUpdateNotification.tsx
 *   - getRelativeMemoryPath  (home/cwd-relative path shortener) — ported verbatim
 *   - MemoryUpdateNotification (single-line "Memory updated in …") — SUPERSEDED by Svp
 *
 * scaffold: 31_auto_memory/status_line_and_misc_delta.md
 *   §1.1 (factory carryover), §1.2 (teamMemSavedPart carryover),
 *   §2.1 (Svp body), §2.3 (156↔183 side-by-side), §2.4 (verbose-gate analysis), §4 (what did NOT change)
 *
 * cross-val (re-read in the 183 bundle, all confirmed):
 *   - Svp @383428-383429: `y = o && s.map(Evp)` — file list short-circuits to
 *     `false` (→ renders nothing) unless `o` (verbose) is true; NO `slice`, NO
 *     truncation cap, NO "+N more files". This is the only real code delta vs
 *     v2.1.156 (`sk_` truncated to `ak_=3` + an `iP` "+N more files" count).
 *   - SNa @382871-382872: `verbose = verbose || isTranscriptMode` — CARRYOVER
 *     (already `_ || !!z` in v2.1.156:393208), NOT a delta.
 *   - ANa @382753: `teamCount ?? 0`; null when 0; pluralizes memory/memories — identical to v2.1.156.
 *   - Hvp @383444: dim when not hovered, underline when hovered, `onClick → Uxt(path)`.
 *     Element nesting @383459/383463: Text(dim/underline) wraps FileLink wraps label.
 *   - leading bullet `mc` @53778: `Kt()==="macos" ? "⏺" : "●"` (filled circle, NOT a
 *     middot; the inter-segment " · " IS a middot @383420). verb "Saved"/"Improved"
 *     confirmed: factory YGn@589751 sets neither; auto-dream patches `verb:"Improved"`@455506.
 *
 * DELTA v2.1.181: per-file list rendered verbose-only (see §2 of the delta doc).
 */
// 2.1.183 dispatch: SNa @cli_inner_pretty.js:382861 (memory_saved branch @382871)

import { homedir } from 'os'
import { relative, basename } from 'path'
import React from 'react'
import { Box, Text } from '../../ink.js'
import { getCwd } from '../../utils/cwd.js'
import { openFile } from '../../utils/openFile.js'
import { FileLink } from '../FileLink.js'
import { Link } from '../Link.js'
import { pluralize } from '../../utils/string.js'
import type { SystemMemorySavedMessage } from '../../types/message.js'

// ===========================================================================
// Path-shortening helper (v2.1.88 carryover; not used by the Svp render path,
// kept because this file is its historical home and other callers still use it).
// ===========================================================================

/**
 * Shorten an absolute memory-file path for display: prefer `~/…` when it lives
 * under the home dir, `./…` when it lives under the cwd, and pick whichever of
 * the two is shorter; fall back to the raw absolute path.
 *
 * 2.1.88 ancestor: src/components/memory/MemoryUpdateNotification.tsx:7-20
 * (No standalone Svp-era equivalent in the 183 bundle — Hvp renders `basename(path)`
 * directly. Retained as the canonical path-shortener for memory paths.)
 */
export function getRelativeMemoryPath(path: string): string {
  const homeDir = homedir()
  const cwd = getCwd()

  // Calculate relative paths
  const relativeToHome = path.startsWith(homeDir) ? '~' + path.slice(homeDir.length) : null
  const relativeToCwd = path.startsWith(cwd) ? './' + relative(cwd, path) : null

  // Return the shorter path, or absolute if neither is applicable
  if (relativeToHome && relativeToCwd) {
    return relativeToHome.length <= relativeToCwd.length ? relativeToHome : relativeToCwd
  }
  return relativeToHome || relativeToCwd || path
}

// ===========================================================================
// Team-memory summary segment (carryover) — ANa
// ===========================================================================

/**
 * Build the "N team memories" segment of the summary line from the message's
 * `teamCount`. Returns `null` when there are no team memories (so the segment is
 * filtered out and the line reads just "Saved N memories"); otherwise returns
 * the rendered segment plus the count, which the renderer subtracts from
 * `writtenPaths.length` to get the local-memory count:
 *
 *   "Saved 3 memories · 2 team memories"   (writtenPaths.length === 5, teamCount === 2)
 *
 * 2.1.183: teamMemSavedPart = ANa @cli_inner_pretty.js:382753 (logic identical to v2.1.156)
 * 2.1.88 ancestor: co-located teamMemSavedPart helper (see status_line_and_misc_delta.md §1.2)
 *
 * NOTE: a later coherence pass may re-home this into `teamMemSaved.ts`; the
 * registry references it as `teamMemSaved.ts / teamMemSavedPart`. Co-located here
 * because `Svp` is its only consumer in the 183 render path.
 */
export function teamMemSavedPart(
  message: SystemMemorySavedMessage,
): { segment: string; count: number } | null {
  const teamCount = message.teamCount ?? 0
  if (teamCount === 0) return null
  return {
    // bundle ANa@382755 inlines `${t === 1 ? "memory" : "memories"}`; pluralize
    // is the helper form. NOTE: vn@10069 signature is (count, singular, plural).
    segment: `${teamCount} team ${pluralize(teamCount, 'memory', 'memories')}`,
    count: teamCount,
  }
}

// ===========================================================================
// Clickable per-file row — Hvp / Evp
// ===========================================================================

/**
 * A single written-memory-file row: renders `basename(path)` as a clickable
 * file link that opens the file in the OS default app (`xdg-open` via
 * `openFile`). Dim by default; underlined while hovered.
 *
 * 2.1.183: clickableFile = Hvp @cli_inner_pretty.js:383444-383473
 *   - onClick handler → `openFile(path)` (Uxt @137434, spawns `xdg-open <path>`) @383449
 *   - hover state via useState; `dimColor = !hovered`, `underline = hovered` @383463
 *   - label is `basename(path)` @383456, wrapped in a <FileLink filePath> @383459
 *   - <Text dimColor underline> wraps the <FileLink> @383463 (Text OUTSIDE FileLink)
 *   - outer <Link> wraps a <Box onClick/onMouseEnter/onMouseLeave> @383467
 *
 * Element nesting (bundle order): Link > Box > Text(dim/underline) > FileLink > label.
 * Pure-render/ink layout; structure summarized from the memo-cached original.
 */
function ClickableFile({ path }: { path: string }): React.ReactNode {
  const [hovered, setHovered] = React.useState(false)
  const open = () => void openFile(path) // @383449 Uxt → xdg-open
  const label = basename(path) // @383456 c = basename(n)
  // Nesting (bundle Hvp): Link > Box > Text(dim/underline) > FileLink(filePath) > label.
  // @383459 u = <FileLink filePath={n}>{c}</FileLink>  (FileLink wraps the raw label)
  // @383463 d = <Text dimColor={l} underline={r}>{u}</Text>  (Text wraps the FileLink)
  return (
    <Link>
      <Box
        onClick={open}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* dim unless hovered, underline while hovered @383463 */}
        <Text dimColor={!hovered} underline={hovered}>
          <FileLink filePath={path}>{label}</FileLink>
        </Text>
      </Box>
    </Link>
  )
}

/**
 * Key/path wrapper so each `writtenPaths` entry can be mapped directly with a
 * stable React key (the path string is unique within one save).
 *
 * 2.1.183: renderClickableFile = Evp @cli_inner_pretty.js:383441-383443
 *   `Evp(e) => createElement(Hvp, { key: e, path: e })`
 */
function renderClickableFile(path: string): React.ReactNode {
  return <ClickableFile key={path} path={path} />
}

// ===========================================================================
// The memory_saved renderer — Svp
// ===========================================================================

interface MemoryUpdateNotificationProps {
  message: SystemMemorySavedMessage
  addMargin: boolean
  /**
   * Effective verbose flag. The dispatcher (`SNa`) folds transcript mode in:
   * `verbose = props.verbose || isTranscriptMode` (@382872, carryover) — so the
   * full clickable list still appears in the transcript view and under
   * `--verbose`, and is suppressed only on the terse inline status line.
   */
  verbose: boolean
}

/**
 * Render the `memory_saved` status line.
 *
 * Layout (column):
 *   1. SUMMARY ROW (always): a dim leading bullet glyph (`mc`: ⏺ macOS / ●
 *      other — a filled circle, NOT a middot) + "<verb> <segments>", where the
 *      inter-segment separator IS a middot (" · "):
 *      `segments = [localSeg, teamSeg].filter(Boolean).join(" · ")`,
 *      `verb = message.verb ?? "Saved"` ("Improved" for auto-dream),
 *      `localCount = writtenPaths.length - teamCount`.
 *        e.g.  "● Saved 3 memories"
 *              "● Saved 3 memories · 2 team memories"
 *              "● Improved 5 memories"        (auto-dream)
 *   2. FILE LIST (verbose-only — THE 2.1.181 DELTA): when `verbose`, every path
 *      in the FULL `writtenPaths` array is rendered as a clickable file row;
 *      when not verbose the list short-circuits to `false` and React renders
 *      nothing. No truncation, no cap, no "+N more files".
 *
 * 2.1.183: renderMemorySaved = Svp @cli_inner_pretty.js:383399-383440
 * 2.1.88 ancestor: src/components/memory/MemoryUpdateNotification.tsx:21-44
 *   (single-line "Memory updated in {path} · /memory to edit" — SUPERSEDED)
 *
 * DELTA v2.1.181 (@383428-383429): file list is verbose-gated via
 *   `const fileList = verbose && writtenPaths.map(renderClickableFile)`.
 *   v2.1.156 (`sk_`) instead did `verbose ? writtenPaths : writtenPaths.slice(0, ak_)`
 *   (ak_ = 3) AND appended an `iP` "+N more files" expandable count when the path
 *   set exceeded the cap — BOTH removed in 183. The summary computation, the
 *   `verb`/`teamCount` contract, and the `ClickableFile` component are unchanged.
 *   See status_line_and_misc_delta.md §2 for the full before/after.
 */
export function MemoryUpdateNotification({
  message,
  addMargin,
  verbose,
}: MemoryUpdateNotificationProps): React.ReactNode {
  const { writtenPaths } = message

  // --- summary line (UNCHANGED from v2.1.156) ---
  const teamPart = teamMemSavedPart(message) // ANa: { segment, count } | null
  const localCount = writtenPaths.length - (teamPart?.count ?? 0) // @383407
  const localSeg =
    localCount > 0 ? `${localCount} ${pluralize(localCount, 'memory', 'memories')}` : null // @383408 (bundle inlines `l === 1 ? "memory" : "memories"`; vn@10069 = (count, singular, plural))
  const segments = [localSeg, teamPart?.segment].filter(Boolean) // @383411
  const verb = message.verb ?? 'Saved' // @383419 ("Saved" | "Improved")

  const summaryRow = (
    <Box flexDirection="row">
      {/* dim platform bullet glyph (mc) @383417 */}
      <Box minWidth={2}>
        <Text dimColor>{BULLET}</Text>
      </Box>
      <Text>
        {verb} {segments.join(' · ')}
      </Text>
    </Box>
  )

  // --- file list: ONLY in verbose mode (THE 2.1.181 DELTA) ---
  // @383428-383429: `y = o && s.map(Evp)` — short-circuits to `false` (renders
  // nothing) when not verbose; full writtenPaths mapped to clickable rows when verbose.
  const fileList = verbose && writtenPaths.map(renderClickableFile)

  return (
    <Box flexDirection="column" marginTop={addMargin ? 1 : 0}>
      {summaryRow}
      {fileList}
    </Box>
  )
}

/**
 * The dim status-line bullet glyph (`mc` in the 183 bundle, module-scoped — the
 * standard Claude Code REPL leading-bullet used by every status row).
 *
 * 2.1.183: mc @cli_inner_pretty.js:53778
 *   `mc = Kt() === "macos" ? "⏺" : "●"`
 *   — PLATFORM-DEPENDENT filled circle: ⏺ (U+23FA, "record") on macOS,
 *     ● (U+25CF, BLACK CIRCLE) everywhere else. `Kt` is the memoized platform
 *     detector (Kt @46437: "macos" | "wsl" | …). This is NOT a middot.
 *   Carryover from v2.1.156 (`r9 = n$() === "macos" ? "⏺" : "●"` @49159).
 */
const BULLET = process.platform === 'darwin' ? '⏺' : '●' // ⏺ macOS / ● other
