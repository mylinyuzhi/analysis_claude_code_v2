/**
 * Memory-directory scanning primitives. Split out of findRelevantMemories.ts
 * so extractMemories can import the scan without pulling in sideQuery and
 * the API-client chain (which closed a cycle through memdir.ts — #25372).
 *
 * 2.1.183 regions: cli_inner_pretty.js:454766-454862
 *   - scanMemoryFiles        = C4t @454800
 *   - formatMemoryManifest   = I4t @454838
 *   - buildPromptIndexExcludeSet = o2p @454766  (DELTA v2.1.172 — team-store promptIndex paths)
 *   - extractFirstHeading    = i2p @454782      (DELTA vs 88; net-new after v2.1.156 —
 *                                                description fallback, gated on the excludeSet `o`)
 *   - parseCreatedDate       = a2p @454790      (DELTA vs 88 — created-date sort key; carryover from 156)
 *   - caps/limits e2p/t2p/n2p/r2p/s2p @454858-454862
 * 2.1.88 ancestor: src/memdir/memoryScan.ts (scanMemoryFiles / formatMemoryManifest / MemoryHeader)
 * scaffold: v2.1.156 extract_memories_runtime.md §5 (manifest pre-injection: FV$(await UV$(...)))
 *           ; 31_auto_memory/team_memory_stores_recall.md §1-2 (promptIndex exclusion)
 *
 * VERSION ATTRIBUTION (verified against the v2.1.156 bundle — UV$@412302 / FV$@412339):
 *   - CARRYOVER from v2.1.156 (delta vs the v2.1.88 ancestor, NOT a v2.1.181 change):
 *     "tiny memory mode" (tengu_billiard_aviary; 156=_D@142142, 183=aH@147673), the second
 *     cap/line-limit set (156 BS_=200/pS_=250/US_=30/FS_=200 — identical values), the
 *     `created`/`last_read`/`content` triplet (156@412323-412325), the parseCreatedDate sort
 *     override (156 QS_@412300-area), the content-inlining manifest (156 FV$@412339), and the
 *     memory_scan telemetry (156 SH/t$@412334-412336). These already existed in 156.
 *   - NET-NEW after v2.1.156 (the genuine 172/181-era deltas):
 *     · buildPromptIndexExcludeSet (o2p) — v2.1.172 team-store promptIndex exclusion.
 *     · extractFirstHeading (i2p) + the `description: f.description ?? (o ? i2p(m) : null)`
 *       fallback — 156 used a bare `w.description` (412321), no first-heading fallback. This
 *       fallback is gated on the excludeSet `o` (NOT on tiny mode `n`).
 * cross-val: re-read C4t/I4t/o2p in the live 183 bundle; re-read UV$/FV$ in the 156 bundle to
 *   pin the carryover-vs-net-new boundary. The 88 ancestor's silent `catch { return [] }` is
 *   telemetered in BOTH 156 and 183 (Le/Rt "memory_scan").
 */

import { readdir } from 'fs/promises'
import { basename, join } from 'path'
// getMeta(frontmatter, key): string | null
//   2.1.183: MBe @cli_inner_pretty.js:150852 — `(e, t) => INr(e.metadata[t])`,
//   where INr (@150842) is the non-empty-string-or-null normalizer.
import { getMeta, parseFrontmatter } from '../utils/frontmatterParser.js'
import { readFileInRange } from '../utils/readFileInRange.js'
// recordSuccess / recordFailure: feature telemetry helpers.
//   2.1.183: Le @44569 (tengu_feature_ok) / Rt @44575 (tengu_feature_sad).
import { recordFailure, recordSuccess } from '../utils/telemetry.js'
import { type MemoryType, parseMemoryType } from './memoryTypes.js'
// DELTA v2.1.172: scan now consults the parsed CLAUDE_MEMORY_STORES to exclude
// promptIndex files (they are fetched/injected separately). see team_memory_stores_recall.md §1-2
import { parseMemoryStoresEnv } from './teamMemPaths.js'
// "tiny memory mode" gate — toggles a denser scan/manifest shape. DELTA vs the
// v2.1.88 ancestor, but carryover from v2.1.156 (156=_D@142142, same flag
// tengu_billiard_aviary) — NOT a v2.1.181 change.
import { isTinyMemoryEnabled } from './paths.js'

// ENTRYPOINT_NAME ("MEMORY.md", $w @cli_inner_pretty.js:150799) is owned by
// memdir.ts — the bundle has a single shared `$w` const, so import it here
// rather than redefining, keeping memdir.ts the single source of truth.
import { ENTRYPOINT_NAME } from './memdir.js'

// 2.1.183: scan caps — normal vs tiny memory mode @cli_inner_pretty.js:454858-454862
//   e2p = 200  (MAX_MEMORY_FILES, normal)
//   t2p = 250  (MAX_MEMORY_FILES, tiny — denser corpus, keep more)
//   n2p = 30   (FRONTMATTER_MAX_LINES, normal — only the frontmatter is read)
//   r2p = 200  (FRONTMATTER_MAX_LINES, tiny — body is inlined, so read more lines)
//   s2p = 120  (MAX_HEADING_DESCRIPTION_LEN — first-heading slice used as fallback description)
const MAX_MEMORY_FILES = 200 // e2p
const MAX_MEMORY_FILES_TINY = 250 // t2p
const FRONTMATTER_MAX_LINES = 30 // n2p
const FRONTMATTER_MAX_LINES_TINY = 200 // r2p
const MAX_HEADING_DESCRIPTION_LEN = 120 // s2p

export type MemoryHeader = {
  filename: string
  filePath: string
  mtimeMs: number
  description: string | null
  type: MemoryType | undefined
  // DELTA vs the v2.1.88 ancestor (carryover from v2.1.156, 156@412323-412325 — NOT v2.1.181):
  // tiny-mode-only fields (populated only when isTinyMemoryEnabled()).
  // @454814-454824 — created/last_read are raw frontmatter strings; content is the trimmed body.
  created: string | null
  last_read: string | null
  content: string | null
}

/**
 * Build the set of relative paths to exclude from a memory scan because they
 * are team-store promptIndex files — those are fetched over the network and
 * injected as their own `<memory path="...">` block, so listing them here would
 * double-count them in the manifest.
 *
 * For a `scope:"user"` store the index path is relative to the user memory root
 * (`promptIndex` segments joined directly); for a team store it is rooted under
 * `team/<mount>/...`. Always includes the entrypoint `MEMORY.md`.
 *
 * Returns null when CLAUDE_MEMORY_STORES is unset/invalid — callers then fall
 * back to excluding only `MEMORY.md` by basename.
 *
 * 2.1.183: buildPromptIndexExcludeSet = o2p @cli_inner_pretty.js:454766
 * DELTA v2.1.172: new. see team_memory_stores_recall.md §1-2
 */
function buildPromptIndexExcludeSet(): Set<string> | null {
  let stores
  try {
    stores = parseMemoryStoresEnv() // Zse @150442 — parses+validates CLAUDE_MEMORY_STORES
  } catch {
    return null // @454770-454772 — malformed env → fall back to basename exclusion
  }
  if (stores === null) return null // @454773 — unset

  const exclude = new Set<string>([ENTRYPOINT_NAME]) // @454774
  for (const store of stores) {
    if (store.promptIndex === undefined) continue // @454776
    const segments = store.promptIndex.split('/') // @454777
    // @454778: user-scope index sits at the memory root; team-scope under team/<mount>/...
    exclude.add(
      store.scope === 'user'
        ? join(...segments)
        : join('team', store.mount, ...segments),
    )
  }
  return exclude
}

/**
 * Extract the first Markdown heading line from a body and return it (stripped
 * of leading `#` markers, trimmed, sliced to MAX_HEADING_DESCRIPTION_LEN). Used
 * as the description fallback when the frontmatter has none. NOTE: the call site
 * (@454820) gates this on the team-store exclude set `o` (i.e. it fires when
 * CLAUDE_MEMORY_STORES is configured), NOT on tiny mode `n`.
 *
 * 2.1.183: extractFirstHeading = i2p @cli_inner_pretty.js:454782
 * DELTA vs 88; net-new after v2.1.156 (156's scan used a bare `w.description`
 * @412321 with no first-heading fallback). Tied to the promptIndex feature.
 */
function extractFirstHeading(body: string): string | null {
  for (const line of body.split('\n')) {
    const heading = line.replace(/^#{1,6}\s+/, '').trim() // @454785
    if (heading) return heading.slice(0, MAX_HEADING_DESCRIPTION_LEN) // @454786
  }
  return null
}

/**
 * Parse a `YYYY-MM-DD` frontmatter `created:` value into epoch millis using
 * local-time midnight. Returns null if the string isn't an exact date.
 *
 * In tiny memory mode the parsed `created` date (when present) overrides the
 * file mtime as the sort key, so memories sort by authored date rather than by
 * filesystem touch time.
 *
 * 2.1.183: parseCreatedDate = a2p @cli_inner_pretty.js:454790
 * DELTA vs the v2.1.88 ancestor (tiny-mode sort key) — carryover from v2.1.156
 * (156=QS_, scan UV$@412316 already overrode mtime with the created date). NOT v2.1.181.
 */
function parseCreatedDate(value: string | null): number | null {
  if (typeof value !== 'string') return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) // @454792
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const ms = new Date(year, month - 1, day).getTime() // @454797 — local-time midnight
  return Number.isNaN(ms) ? null : ms
}

/**
 * Scan a memory directory for .md files, read their frontmatter (and, in tiny
 * mode, their body), and return a header list sorted newest-first (capped).
 * Shared by findRelevantMemories (query-time recall) and extractMemories
 * (pre-injects the listing so the extraction agent doesn't spend a turn on `ls`).
 *
 * Single-pass: readFileInRange stats internally and returns mtimeMs, so we
 * read-then-sort rather than stat-sort-read. For the common case (N ≤ cap) this
 * halves syscalls vs a separate stat round; for large N we read a few extra
 * small files but still avoid the double-stat on the surviving cap.
 *
 * 2.1.183: scanMemoryFiles = C4t @cli_inner_pretty.js:454800
 * DELTA v2.1.172: exclusion set comes from buildPromptIndexExcludeSet (team stores) @454803/454806.
 *   Also net-new after 156: the first-heading description fallback @454820, gated on the team-store
 *   exclude set `o2p()`/`o` (NOT on tiny mode `n`).
 * DELTA vs the v2.1.88 ancestor (carryover from v2.1.156 UV$@412302 — NOT v2.1.181): tiny memory
 *   mode (aH@147673; 156=_D@142142) selects a second cap/line-limit, reads the body, populates
 *   created/last_read/content, and overrides the sort key with the created date @454801-454832.
 * DELTA vs 88 (also present in 156 @412334/412336): the 88 ancestor's silent catch is now
 *   telemetered — Le/Rt "memory_scan" @454833/454835.
 */
export async function scanMemoryFiles(
  memoryDir: string,
  signal: AbortSignal,
): Promise<MemoryHeader[]> {
  const tinyMode = isTinyMemoryEnabled() // aH @147673 (tengu_billiard_aviary)
  const frontmatterLines = tinyMode
    ? FRONTMATTER_MAX_LINES_TINY
    : FRONTMATTER_MAX_LINES // @454802 (r2p vs n2p)
  const excludeSet = buildPromptIndexExcludeSet() // o2p @454803

  try {
    const entries = await readdir(memoryDir, { recursive: true })
    // @454806: with an exclusion set, match relative paths exactly; otherwise
    // fall back to dropping any file basename'd "MEMORY.md".
    const mdFiles = entries.filter(
      f =>
        f.endsWith('.md') &&
        (excludeSet ? !excludeSet.has(f) : basename(f) !== ENTRYPOINT_NAME),
    )

    const headerResults = await Promise.allSettled(
      mdFiles.map(async (relativePath): Promise<MemoryHeader> => {
        const filePath = join(memoryDir, relativePath)
        const { content, mtimeMs } = await readFileInRange(
          filePath,
          0,
          frontmatterLines,
          undefined,
          signal,
        )
        // 183: parseFrontmatter returns { frontmatter, body }; frontmatter has
        // top-level name/description plus a frozen metadata map. @454813 (g_n@150806)
        const { frontmatter, body } = parseFrontmatter(content, filePath)
        // getMeta(frontmatter, key) === string-or-null of frontmatter.metadata[key]
        // (MBe @150852). type/created/last_read live in metadata; description is top-level.
        const created = getMeta(frontmatter, 'created') // @454814
        // @454815: tiny mode prefers the parsed created date as sort key; else mtime.
        const sortMs = (tinyMode ? parseCreatedDate(created) : null) ?? mtimeMs
        return {
          filename: relativePath,
          filePath,
          mtimeMs: sortMs,
          // @454820: frontmatter description, else (when a team-store exclude set
          // is present, i.e. `o2p()` returned a Set) the body's first heading.
          // NOTE: gated on `excludeSet` (`o`), NOT tinyMode (`n`). bundle: `f.description ?? (o ? i2p(m) : null)`.
          description:
            frontmatter.description ??
            (excludeSet ? extractFirstHeading(body) : null),
          type: parseMemoryType(getMeta(frontmatter, 'type')), // @454821 (dgi@150869)
          created, // @454822
          last_read: getMeta(frontmatter, 'last_read'), // @454823
          content: tinyMode ? body.trim() || null : null, // @454824
        }
      }),
    )

    const headers = headerResults
      .filter(
        (r): r is PromiseFulfilledResult<MemoryHeader> =>
          r.status === 'fulfilled',
      )
      .map(r => r.value)
      .sort((a, b) => b.mtimeMs - a.mtimeMs)
      .slice(0, tinyMode ? MAX_MEMORY_FILES_TINY : MAX_MEMORY_FILES) // @454832

    recordSuccess('memory_scan') // Le @454833 → tengu_feature_ok{feature_name:"memory_scan"}
    return headers
  } catch {
    // DELTA: was a silent `return []` in the 88 ancestor.
    recordFailure('memory_scan', 'memory_scan_readdir_failed') // Rt @454835 → tengu_feature_sad
    return []
  }
}

/**
 * Format memory headers as a text manifest: one line per file with
 * [type] filename (timestamp): description. Used by both the recall selector
 * prompt and the extraction-agent prompt.
 *
 * In tiny memory mode, when a header carries inline `content`, the body is
 * appended under the line (newlines re-indented two spaces) instead of the
 * description — the manifest doubles as the memory payload so the agent never
 * has to open the file.
 *
 * 2.1.183: formatMemoryManifest = I4t @cli_inner_pretty.js:454838
 * DELTA vs the v2.1.88 ancestor: content-inlining branch @454843-454851. Carryover
 * from v2.1.156 (156=FV$@412339, same `if ($.content !== null)` inline) — NOT v2.1.181.
 */
export function formatMemoryManifest(memories: MemoryHeader[]): string {
  return memories
    .map(m => {
      const tag = m.type ? `[${m.type}] ` : '' // @454840
      const ts = new Date(m.mtimeMs).toISOString() // @454841
      const head = `- ${tag}${m.filename} (${ts})` // @454842
      // @454843: tiny mode — inline the body, indenting continuation lines by two spaces.
      if (m.content !== null) {
        const indentedBody = m.content.replace(/\n/g, '\n  ') // @454844
        return `${head}\n  ${indentedBody}` // @454849
      }
      // @454852: normal mode — append the description if present.
      return m.description ? `${head}: ${m.description}` : head
    })
    .join('\n')
}
