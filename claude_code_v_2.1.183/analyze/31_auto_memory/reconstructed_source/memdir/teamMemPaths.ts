/**
 * memdir/teamMemPaths.ts — team-memory store schema, path resolver, gate, the
 * network `promptIndex` fetch helpers, and the team-dir write/containment
 * validators. This is the v2.1.172 delta core: the `CLAUDE_MEMORY_STORES`
 * schema/parser/fetch machinery + the mounted-store team-enable fix (`Nk`).
 *
 * v2.1.183 source regions covered (cli_inner_pretty.js):
 *   - isPathAbsoluteHostSafe   = hQu  @150422   (path-absolute, host-safe; restored verbatim)
 *   - deriveMountName          = yQu  @150430
 *   - isPromptIndexPathSafe    = vNr  @150438
 *   - parseMemoryStoresEnv     = Zse  @150442   (single scope:"user" guard)
 *   - MemoryServiceBackend     = m_n  @150574   (transport; CONTRACT-LEVEL — see baseline)
 *   - absolutePathStringSchema = tgi  @150488
 *   - storeObjectSchema        = bQu  @150491   (gained scope/promptIndex/promptIndexMaxBytes)
 *   - MOUNT_REGEX_MESSAGE      = _Qu  @150481
 *   - fetchStorePromptIndices  = agi  @150754
 *   - fetchOnePromptIndex      = kQu  @150768   (memory_prompt_index telemetry ×4)
 *   - MEM_PROMPT_INDEX_TIMEOUT_MS = xQu @150791  (5000)
 *   - isTeamMemoryEnabled      = Nk   @151098   (mounted-store-enables fix, 2.1.172)
 *   - getTeamMemPath           = uH   @151103   (hm()/team/, NFC)
 *   - resolveTeamSubdir        = MNr  @151106   (realpath team subdir; NEW in 183)
 *   - checkTeamContainment     = $Be  @151111   (ok/escape/absent; NEW in 183)
 *   - realpathDeepestExisting  = $Nr  @151125
 *   - isRealPathWithinTeamDir  = BQu  @151147
 *   - isTeamMemPath            = Bme  @151159   (NFC+lowercase containment — DELTA vs 88)
 *   - validateTeamMemKey       = __n  @151164
 *   - isTeamMemFile            = vK   @151174
 *   - sanitizePathKey          = PNr  @151082
 *   - PathTraversalError       = Ow   (class)
 *
 * 2.1.88 ancestor (shape + real names + comments): src/memdir/teamMemPaths.ts.
 *   The ancestor is the high-fidelity template for the path/validation half
 *   (sanitizePathKey, realpathDeepestExisting, isRealPathWithinTeamDir,
 *   isTeamMemPath, isTeamMemFile, getTeamMemPath, PathTraversalError) — all
 *   carryover in 183.
 *
 * scaffold: 31_auto_memory/team_memory_stores_recall.md §1 (schema bQu / parser
 *   Zse / vNr), §2 (fetch agi/kQu/xQu), §4 (the Nk fix). Cross-link that doc for
 *   the WHY; the CODE below is restored faithfully from the 183 bundle.
 *
 * cross-val (re-read in 183 bundle):
 *   - bQu re-read @150491-150509: scope default "team", promptIndex refine vNr,
 *     promptIndexMaxBytes int positive. ✔
 *   - Zse re-read @150442-150480: scope:"team" default for bare strings, duplicate-mount
 *     Set, single scope:"user" guard, optional-field spread, debug log. ✔
 *   - vNr re-read @150438-150441 (empty reject + per-segment [A-Za-z0-9._-], not . / ..). ✔
 *   - agi/kQu/xQu re-read @150754-150791: allSettled drop-on-failure, 5s withTimeout,
 *     unsafe_path/ok/timeout/error telemetry, empty-but-present = success. ✔
 *   - Nk re-read @151098-151102: NEW middle clause `CLAUDE_MEMORY_STORES?.trim() → true`
 *     before tengu_herring_clock. ✔
 *   - uH re-read @151103-151105: join(hm(),"team")+sep, NFC. ✔
 *   - Bme re-read @151159-151163: NFC+toLowerCase on both sides (case-insensitive). ✔
 *
 * Divergences from the 88 ancestor (the 183 bundle wins). VERSION attributions are
 * verified against the v2.1.156 bundle so "delta vs 88" is not confused with "new in 183":
 *   - NO 88 ancestor (CLAUDE_MEMORY_STORES did not exist in 88), but ALREADY in v2.1.156:
 *     the store schema core (parseMemoryStoresEnv=z24@436721, storeObjectSchema=dp_@436760,
 *     deriveMountName, absolutePathStringSchema, isPathAbsoluteHostSafe). The 156 object
 *     schema had only `{ path, mode, mount? }`.
 *   - DELTA 2.1.172 (net-new after v2.1.156): the `scope`/`promptIndex`/`promptIndexMaxBytes`
 *     schema fields + the single scope:"user" guard; the promptIndex fetch
 *     (isPromptIndexPathSafe/fetchOnePromptIndex/fetchStorePromptIndices); and the helpers
 *     resolveTeamSubdir/checkTeamContainment.
 *   - DELTA 2.1.172: isTeamMemoryEnabled (Nk) gained the mounted-store clause (156 nM$ had
 *     the flag alone — verify against the 156 gate).
 *   - DELTA vs 88 (CARRYOVER from v2.1.156, NOT a 183 change): isTeamMemPath (Bme) is
 *     case-insensitive (NFC + lowercase both sides). The 156 NFK@144775 is byte-identical;
 *     only the 88 ancestor's plain resolve().startsWith(getTeamMemPath()) was case-sensitive.
 *   - REMOVED (present in the 88 ancestor AND in v2.1.156, gone in 183):
 *       · getTeamMemEntrypoint() — no standalone join(hm(),"team","MEMORY.md") in 183;
 *         the per-store entrypoint is derived through the multistore mount machinery.
 *       · validateTeamMemWritePath() — the absolute-path write validator (156 _95@144780,
 *         "Null byte in path:"/"Path escapes team memory directory:") is gone; only the
 *         server-key validator validateTeamMemKey (__n) survives. (No "Path escapes team
 *         memory directory" filePath-variant string exists in the 183 bundle; only the
 *         "Key escapes…" variant in __n. Confirmed: 0 occurrences in 183.)
 */

import { lstat, realpath } from 'fs/promises'
import { basename, dirname, join, resolve, sep } from 'path'
import { z } from 'zod'

import { getFeatureValue_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'
// telemetryFeatureOk: Le @cli_inner_pretty.js:44569 (emits tengu_feature_ok)
// telemetryFeatureSad: Rt @cli_inner_pretty.js:44575 (emits tengu_feature_sad)
import {
  telemetryFeatureOk,
  telemetryFeatureSad,
} from '../services/analytics/telemetry.js'
// logForDebugging: v @cli_inner_pretty.js:10623 — warn/debug logger.
import { logForDebugging } from '../utils/debug.js'
// errorMessage: Se @8832 — best-effort error→string. getErrnoCode: dn @8835.
import { errorMessage, getErrnoCode } from '../utils/errors.js'
// jsonParse: Gt @9506 — JSON.parse wrapper.
import { jsonParse } from '../utils/slowOperations.js'
// withTimeout: uu @cli_inner_pretty.js:105304 — Promise.race against a labelled timeout.
import { withTimeout } from '../utils/promises.js'
// CONTRACT-LEVEL: the memory-service transport client is carryover team-store
// plumbing (the multistore sync path). Imported as a type/value only; its
// internals are not re-derived here — see team_memory_stores_recall.md §2.2
// and the v2.1.156 multistore baseline.
import { MemoryServiceBackend } from '../services/teamMemorySync/index.js'
import { getAutoMemPath, isAutoMemoryEnabled } from './paths.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** "rw" = writable store; "ro" = read-only (recall only, never written). */
export type StoreMode = 'rw' | 'ro'

/**
 * "team" = shared team store (default; routes to the team recall branch + the
 * team multistore sync lane). "user" = personal store (routes to the personal
 * recall branch + the user sync lane). At most one entry may be scope:"user".
 * DELTA 2.1.172: the `scope` axis is net-new — every legacy v2.1.156 config is
 * implicitly scope:"team". see team_memory_stores_recall.md §1.
 */
export type StoreScope = 'user' | 'team'

/**
 * A normalized entry from `CLAUDE_MEMORY_STORES`, as produced by
 * parseMemoryStoresEnv(). `mount` is always present (derived if not given);
 * `promptIndex`/`promptIndexMaxBytes` are only present when configured.
 */
export interface MemoryStore {
  path: string
  mode: StoreMode
  scope: StoreScope
  mount: string
  /** Relative path (inside the store) of a curated memory-index file to fetch. */
  promptIndex?: string
  /** Per-store byte budget for the promptIndex (falls back to the 25 KB cap). */
  promptIndexMaxBytes?: number
}

/** Result of fetching one store's promptIndex over the memory-service. */
export interface PromptIndexResult {
  mount: string
  promptIndex: string
  /** Index file body, or "" when the index file is present-but-empty / not-found. */
  content: string
}

/**
 * Error thrown when a path validation detects a traversal or injection attempt.
 * 2.1.88 ancestor: PathTraversalError (unchanged).
 */
// 2.1.183: PathTraversalError = Ow (class) @cli_inner_pretty.js (GM module init)
export class PathTraversalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PathTraversalError'
  }
}

// ---------------------------------------------------------------------------
// CLAUDE_MEMORY_STORES schema + parser  (NET-NEW in 183 — no 88 ancestor)
// see team_memory_stores_recall.md §1
// ---------------------------------------------------------------------------

const MOUNT_REGEX = /^[A-Za-z0-9_-]+$/
// 2.1.183: MOUNT_REGEX_MESSAGE = _Qu @cli_inner_pretty.js:150481
const MOUNT_REGEX_MESSAGE = 'mount must match /^[A-Za-z0-9_-]+$/'

/**
 * Whether a store `path` is path-absolute and does not override the host. This
 * is the refinement behind `absolutePathStringSchema`. Restored verbatim from
 * the 183 body (@150422-150428): a leading-"/" check, then a sentinel-origin URL
 * parse so the value cannot smuggle in an authority component.
 * 2.1.88 ancestor: none (new in the store-schema feature).
 */
// 2.1.183: isPathAbsoluteHostSafe = hQu @cli_inner_pretty.js:150422
function isPathAbsoluteHostSafe(value: string): boolean {
  // @150423 the value must be path-absolute (POSIX leading "/"); anything else
  // (relative, or a "scheme://authority" URL) is rejected outright.
  if (!value.startsWith('/')) {
    return false
  }
  // @150425 then parse `new URL(value, "https://sentinel.invalid")` and require
  // the origin to stay on the sentinel host (i.e. the value cannot smuggle in an
  // authority component). see team_memory_stores_recall.md §1.1.
  try {
    return (
      new URL(value, 'https://sentinel.invalid').origin ===
      'https://sentinel.invalid'
    )
  } catch {
    return false
  }
}

/**
 * Zod schema for the bare absolute-path-string form of a store entry.
 * 2.1.88 ancestor: none.
 */
// 2.1.183: absolutePathStringSchema = tgi @cli_inner_pretty.js:150488 (lazy `we`)
const absolutePathStringSchema = z.lazy(() =>
  z.string().min(1).refine(isPathAbsoluteHostSafe, {
    message: 'path must be path-absolute and must not override the host',
  }),
)

/**
 * Reject empty paths and any promptIndex whose `/`-separated segments contain
 * anything outside [A-Za-z0-9._-] or that are `.`/`..`. Defence-in-depth: used
 * both as a parse-time zod `.refine` (schema below) and again at fetch time
 * (fetchOnePromptIndex) before the path is sent to the memory-service.
 * 2.1.88 ancestor: none. see team_memory_stores_recall.md §1.3
 */
// 2.1.183: isPromptIndexPathSafe = vNr @cli_inner_pretty.js:150438
export function isPromptIndexPathSafe(relPath: string): boolean {
  if (relPath.length === 0) {
    return false
  }
  return relPath
    .split('/')
    .every(
      (segment) =>
        /^[A-Za-z0-9._-]+$/.test(segment) &&
        segment !== '.' &&
        segment !== '..',
    )
}

/**
 * Derive a mount name from a store path: take the last path segment and sanitize
 * non-alphanumerics to `-`. Carryover logic from v2.1.156 (`Qp_`).
 * 2.1.88 ancestor: none.
 */
// 2.1.183: deriveMountName = yQu @cli_inner_pretty.js:150430
export function deriveMountName(storePath: string): string {
  const trimmed = storePath.replace(/\/+$/, '')
  const lastSegment = trimmed.slice(trimmed.lastIndexOf('/') + 1)
  if (lastSegment === '') {
    throw new Error(`cannot derive mount name from path: ${storePath}`)
  }
  const sanitized = lastSegment.replace(/[^A-Za-z0-9_-]/g, '-')
  if (sanitized === '' || sanitized === '.' || sanitized === '..') {
    throw new Error(
      `derived mount name is not a valid path segment: ${lastSegment}`,
    )
  }
  return sanitized
}

/**
 * Zod schema for a single `CLAUDE_MEMORY_STORES` entry: either a bare absolute
 * path string, or an object.
 *
 * DELTA 2.1.172: the object gained `scope` (default "team"), `promptIndex`
 * (safe relative path), and `promptIndexMaxBytes` (positive int). The v2.1.156
 * object schema (`dp_`) had only `{ path, mode, mount? }`.
 * see team_memory_stores_recall.md §1.1
 * 2.1.88 ancestor: none.
 */
// 2.1.183: storeObjectSchema = bQu @cli_inner_pretty.js:150491 (lazy `we`)
const storeObjectSchema = z.lazy(() =>
  z.union([
    absolutePathStringSchema,
    z.object({
      path: absolutePathStringSchema,
      mode: z.enum(['rw', 'ro']).default('rw'),
      // DELTA 2.1.172: defaults "team" so every legacy config keeps meaning.  @150497
      scope: z.enum(['user', 'team']).default('team'),
      mount: z
        .string()
        .min(1)
        .refine((m) => MOUNT_REGEX.test(m), { message: MOUNT_REGEX_MESSAGE })
        .optional(),
      // DELTA 2.1.172: relative path of the index file to fetch (Delta 2).  @150502
      promptIndex: z
        .string()
        .min(1)
        .refine(isPromptIndexPathSafe, {
          message:
            'promptIndex segments must match [A-Za-z0-9._-]+ and must not be . or ..',
        })
        .optional(),
      // DELTA 2.1.172: per-store byte budget for the index file.  @150506
      promptIndexMaxBytes: z.number().int().positive().optional(),
    }),
  ]),
)

/**
 * Parse + normalize `CLAUDE_MEMORY_STORES`. JSON-parses the env var, validates
 * each entry, derives a mount per entry, dedupes mounts, and enforces that at
 * most one entry has scope:"user". Returns the normalized store list or null.
 *
 * DELTA 2.1.172: vs the v2.1.156 parser (`z24`) this adds the scope:"team"
 * default for bare strings, the single-scope:"user" guard, and the optional
 * promptIndex/promptIndexMaxBytes spread. The mount-derivation and
 * duplicate-mount guard are byte-identical carryover from v2.1.156.
 * see team_memory_stores_recall.md §1.2
 * 2.1.88 ancestor: none.
 */
// 2.1.183: parseMemoryStoresEnv = Zse @cli_inner_pretty.js:150442
export function parseMemoryStoresEnv(): MemoryStore[] | null {
  const raw = process.env.CLAUDE_MEMORY_STORES
  if (!raw || raw.trim() === '') {
    return null
  }

  let json: unknown
  try {
    json = jsonParse(raw)
  } catch (e) {
    throw new Error(
      `CLAUDE_MEMORY_STORES is not valid JSON: ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  }

  const validated = z.array(storeObjectSchema).safeParse(json)
  if (!validated.success) {
    throw new Error(
      `CLAUDE_MEMORY_STORES failed validation: ${validated.error.message}`,
    )
  }

  const stores: MemoryStore[] = []
  const seenMounts = new Set<string>()
  let sawUserScope = false

  for (const entry of validated.data) {
    // A bare string is a writable team store; an object is used as-is.
    const store =
      typeof entry === 'string'
        ? { path: entry, mode: 'rw' as StoreMode, scope: 'team' as StoreScope }
        : (entry as MemoryStore)
    const mount = store.mount ?? deriveMountName(store.path)

    if (seenMounts.has(mount)) {
      throw new Error(`CLAUDE_MEMORY_STORES has duplicate mount: ${mount}`)
    }
    seenMounts.add(mount)

    // @150462 DELTA 2.1.172: at most one personal (scope:"user") store — there
    // is only one personal memory directory per session (hm()), so two writable
    // user stores would be ambiguous. Fail fast at parse time.
    if (store.scope === 'user') {
      if (sawUserScope) {
        throw new Error(
          'CLAUDE_MEMORY_STORES has more than one scope:"user" entry',
        )
      }
      sawUserScope = true
    }

    stores.push({
      path: store.path,
      mode: store.mode,
      scope: store.scope,
      mount,
      // Optional fields are spread only when present so the normalized shape
      // omits them entirely for stores that don't configure an index.
      ...(store.promptIndex !== undefined && { promptIndex: store.promptIndex }),
      ...(store.promptIndexMaxBytes !== undefined && {
        promptIndexMaxBytes: store.promptIndexMaxBytes,
      }),
    })
  }

  if (stores.length === 0) {
    return null
  }
  logForDebugging(
    `memory-stores: parsed ${stores.length} store(s): ` +
      stores.map((s) => `${s.mount}(${s.mode})`).join(', '),
    { level: 'debug' },
  )
  return stores
}

// ---------------------------------------------------------------------------
// promptIndex network fetch  (NET-NEW in 183 — no 88 ancestor)
// see team_memory_stores_recall.md §2
// ---------------------------------------------------------------------------

/** Per-store timeout for a promptIndex fetch (memory-service read). */
// 2.1.183: MEM_PROMPT_INDEX_TIMEOUT_MS = xQu @cli_inner_pretty.js:150791
export const MEM_PROMPT_INDEX_TIMEOUT_MS = 5000

/**
 * Fetch one store's promptIndex over the memory-service, race against a timeout,
 * and classify the outcome into `memory_prompt_index` telemetry.
 *
 * Outcomes:
 *   - unsafe_path  → telemetryFeatureSad, return null (path failed the re-check)
 *   - found        → telemetryFeatureOk,  return { mount, promptIndex, content }
 *   - empty/absent → telemetryFeatureOk,  return { …, content: "" } (success: an
 *                    empty-but-present index lets the dispatcher render the
 *                    "index currently empty" bootstrapping nudge — §3.1)
 *   - timeout      → telemetryFeatureSad("timeout"), return null
 *   - error        → telemetryFeatureSad("error"),   return null
 *
 * The timeout is re-detected by substring-matching the timeout label in the
 * thrown error message (withTimeout builds its rejection from the label).
 * see team_memory_stores_recall.md §2.2
 * 2.1.88 ancestor: none.
 */
// 2.1.183: fetchOnePromptIndex = kQu @cli_inner_pretty.js:150768
export async function fetchOnePromptIndex(
  store: MemoryStore,
  timeoutMs: number,
): Promise<PromptIndexResult | null> {
  const indexPath = store.promptIndex!
  // @150770 belt-and-suspenders: re-validate the relative path at the use site
  // before it becomes a memory-service request path (it was already validated
  // at parse time by the schema's .refine).
  if (!isPromptIndexPathSafe(indexPath)) {
    telemetryFeatureSad('memory_prompt_index', 'unsafe_path')
    return null
  }

  // CONTRACT-LEVEL transport: carryover multistore client.
  const backend = new MemoryServiceBackend(store)
  const timeoutLabel = `promptIndex fetch for ${store.mount}`
  try {
    const result = await withTimeout(
      backend.readByPath(indexPath),
      timeoutMs,
      timeoutLabel,
    )
    if (result === null) {
      // Present-but-missing file → still a success; render the empty-index nudge.
      logForDebugging(`memory-prompt-index[${store.mount}]: ${indexPath} not found`, {
        level: 'debug',
      })
      telemetryFeatureOk('memory_prompt_index')
      return { mount: store.mount, promptIndex: indexPath, content: '' }
    }
    telemetryFeatureOk('memory_prompt_index')
    return {
      mount: store.mount,
      promptIndex: indexPath,
      content: result.content,
    }
  } catch (e) {
    const message = errorMessage(e)
    // @150782 the timeout label leaks into withTimeout's rejection message, so a
    // substring match distinguishes "we gave up waiting" from a service error.
    const code = message.includes(timeoutLabel) ? 'timeout' : 'error'
    telemetryFeatureSad('memory_prompt_index', code)
    logForDebugging(
      `memory-prompt-index[${store.mount}]: fetch failed (${code}): ${message}`,
      { level: 'debug' },
    )
    return null
  }
}

/**
 * Parse `CLAUDE_MEMORY_STORES`, filter to stores that declare a promptIndex,
 * fetch each in parallel with a per-store timeout, and return the successfully-
 * fetched ones. Never throws: a parse failure logs at debug and returns [];
 * each individual fetch failure is dropped (allSettled + flatMap).
 *
 * Fail-open by design — index fetch is best-effort enrichment, never a
 * correctness requirement, so recall must proceed with whatever did arrive.
 * see team_memory_stores_recall.md §2.1
 * 2.1.88 ancestor: none.
 */
// 2.1.183: fetchStorePromptIndices = agi @cli_inner_pretty.js:150754
export async function fetchStorePromptIndices(
  timeoutMs: number = MEM_PROMPT_INDEX_TIMEOUT_MS,
): Promise<PromptIndexResult[]> {
  let stores: MemoryStore[] | null
  try {
    stores = parseMemoryStoresEnv()
  } catch (e) {
    logForDebugging(
      `memory-prompt-index: parseMemoryStoresEnv failed: ${errorMessage(e)}`,
      { level: 'debug' },
    )
    return []
  }
  if (stores === null) {
    return []
  }

  const withIndex = stores.filter((s) => s.promptIndex !== undefined)
  if (withIndex.length === 0) {
    return []
  }

  const settled = await Promise.allSettled(
    withIndex.map((s) => fetchOnePromptIndex(s, timeoutMs)),
  )
  return settled.flatMap((r) =>
    r.status === 'fulfilled' && r.value !== null ? [r.value] : [],
  )
}

// ---------------------------------------------------------------------------
// Team-memory gate + path
// ---------------------------------------------------------------------------

/**
 * Whether team memory features are enabled.
 *
 * Team memory is a layer on top of auto memory, so it requires auto memory to
 * be enabled. This keeps all team-memory consumers (recall prompt, content
 * injection, sync watcher, file detection) consistent when auto memory is
 * disabled via env var or settings.
 *
 * DELTA 2.1.172 (the remote-session recall fix): if `CLAUDE_MEMORY_STORES` is
 * mounted (non-empty after trim), team memory is enabled OUTRIGHT — before
 * consulting the `tengu_herring_clock` rollout flag. An explicit operator mount
 * is a stronger signal of intent than a gradual-rollout gate, so it must win in
 * remote/managed sessions where the account may not be in the rollout cohort.
 * The v2.1.156 gate (`nM$`) consulted the flag alone, so mounted stores were
 * synced to disk but never surfaced into the prompt.
 * see team_memory_stores_recall.md §4
 */
// 2.1.183: isTeamMemoryEnabled = Nk @cli_inner_pretty.js:151098
export function isTeamMemoryEnabled(): boolean {
  if (!isAutoMemoryEnabled()) {
    return false
  }
  // @151100 DELTA 2.1.172: a mounted store enables team recall independent of the flag.
  if (process.env.CLAUDE_MEMORY_STORES?.trim()) {
    return true
  }
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_herring_clock', false)
}

/**
 * Whether the personal (user-scope) memory sync lane is enabled.
 *
 * Like isTeamMemoryEnabled this is a layer on top of auto memory, so it requires
 * auto memory first, then consults the `tengu_marble_lark` rollout flag. Drives
 * the watcher's user lane (the single-store personal sync) and its mid-session
 * enable/disable handling.
 * 2.1.88 ancestor: none (the personal sync lane is net-new with the 172 deltas).
 */
// 2.1.183: isUserStoreEnabled = lje @cli_inner_pretty.js:289759 (reads tengu_marble_lark)
export function isUserStoreEnabled(): boolean {
  if (!isAutoMemoryEnabled()) {
    return false
  }
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_marble_lark', false)
}

/**
 * Whether the team-memory SERVER reports content for this repo (the "show the
 * Auto-dream toggle" / "default auto-dream on" signal). True only when team
 * memory is enabled AND the runtime team-memory server status is "has-content".
 *
 * Consumed by services/autoDream/config.ts (both the server-side opt-in
 * precondition and the cohort-default fallthrough).
 * 2.1.88 ancestor: none (team-memory server status is net-new in 183).
 */
// 2.1.183: isTeamMemServerActive = RNr @cli_inner_pretty.js:151121
//   (`if (!Nk()) return !1; return zht() === "has-content"`)
export function isTeamMemServerActive(): boolean {
  if (!isTeamMemoryEnabled()) {
    return false
  }
  return getTeamMemServerStatus() === 'has-content'
}

/**
 * Returns the (local) team memory path: <autoMemPath>/team/ with a trailing
 * separator, NFC-normalized. Lives as a subdirectory of the auto-memory
 * directory, scoped per-project. Mounted stores hang off this dir by mount name
 * (team/<mount>/…) in the recall dispatcher and watcher.
 * 2.1.88 ancestor: getTeamMemPath (unchanged).
 */
// 2.1.183: getTeamMemPath = uH @cli_inner_pretty.js:151103
export function getTeamMemPath(): string {
  return (join(getAutoMemPath(), 'team') + sep).normalize('NFC')
}

// ---------------------------------------------------------------------------
// Path containment + write validation
// ---------------------------------------------------------------------------

/**
 * Sanitize a server-provided relative path key by rejecting dangerous patterns:
 * null bytes, URL-encoded traversals, NFKC-normalization traversals, backslashes,
 * and absolute paths. Returns the key unchanged or throws PathTraversalError.
 * 2.1.88 ancestor: sanitizePathKey (unchanged).
 */
// 2.1.183: sanitizePathKey = PNr @cli_inner_pretty.js:151082
function sanitizePathKey(key: string): string {
  // Null bytes can truncate paths in C-based syscalls.
  if (key.includes('\0')) {
    throw new PathTraversalError(`Null byte in path key: "${key}"`)
  }
  // URL-encoded traversals (e.g. %2e%2e%2f = ../).
  let decoded: string
  try {
    decoded = decodeURIComponent(key)
  } catch {
    // Malformed percent-encoding — not valid URL-encoding, so no URL-encoded
    // traversal is possible.
    decoded = key
  }
  if (decoded !== key && (decoded.includes('..') || decoded.includes('/'))) {
    throw new PathTraversalError(`URL-encoded traversal in path key: "${key}"`)
  }
  // Unicode normalization attacks: fullwidth ．．／ normalize to ASCII ../ under NFKC.
  const normalized = key.normalize('NFKC')
  if (
    normalized !== key &&
    (normalized.includes('..') ||
      normalized.includes('/') ||
      normalized.includes('\\') ||
      normalized.includes('\0'))
  ) {
    throw new PathTraversalError(
      `Unicode-normalized traversal in path key: "${key}"`,
    )
  }
  // Reject backslashes (Windows path-separator traversal vector).
  if (key.includes('\\')) {
    throw new PathTraversalError(`Backslash in path key: "${key}"`)
  }
  // Reject absolute paths.
  if (key.startsWith('/')) {
    throw new PathTraversalError(`Absolute path key: "${key}"`)
  }
  return key
}

/** Strip any trailing path separators (realpath rejects them on some platforms). */
// 2.1.183: stripTrailingSep = fgi @cli_inner_pretty.js (GM module init)
const stripTrailingSep = (p: string): string => p.replace(/[/\\]+$/, '')

/**
 * Resolve symlinks for the deepest existing ancestor of a path.
 * The target file may not exist yet, so we walk up the directory tree until
 * realpath() succeeds, then rejoin the non-existing tail onto the resolved
 * ancestor.
 *
 * SECURITY (PSR M22186): path.resolve() does NOT resolve symlinks. realpath() on
 * the deepest existing ancestor compares the actual filesystem location, not the
 * symbolic path — catching symlink escapes (e.g. a link inside teamDir pointing
 * at ~/.ssh/authorized_keys).
 * 2.1.88 ancestor: realpathDeepestExisting (unchanged).
 */
// 2.1.183: realpathDeepestExisting = $Nr @cli_inner_pretty.js:151125
async function realpathDeepestExisting(absolutePath: string): Promise<string> {
  const tail: string[] = []
  let current = absolutePath
  // Loop terminates at the filesystem root (dirname('/') === '/').
  for (
    let parent = dirname(current);
    current !== parent;
    parent = dirname(current)
  ) {
    try {
      const realCurrent = await realpath(current)
      return tail.length === 0
        ? realCurrent
        : join(realCurrent, ...tail.reverse())
    } catch (e: unknown) {
      const code = getErrnoCode(e)
      if (code === 'ENOENT') {
        // Could be truly non-existent OR a dangling symlink whose target is gone.
        // Dangling symlinks are an attack vector (writeFile would follow them).
        // lstat succeeds for the dangling link entry, fails for truly-absent paths.
        try {
          if ((await lstat(current)).isSymbolicLink()) {
            throw new PathTraversalError(
              `Dangling symlink detected (target does not exist): "${current}"`,
            )
          }
        } catch (lstatErr: unknown) {
          if (lstatErr instanceof PathTraversalError) {
            throw lstatErr
          }
          // lstat also failed — safe to walk up.
        }
      } else if (code === 'ELOOP') {
        throw new PathTraversalError(
          `Symlink loop detected in path: "${current}"`,
        )
      } else if (code !== 'ENOTDIR' && code !== 'ENAMETOOLONG') {
        // EACCES, EIO, etc. — cannot verify containment; fail closed.
        throw new PathTraversalError(
          `Cannot verify path containment (${code}): "${current}"`,
        )
      }
      tail.push(current.slice(parent.length + sep.length))
      current = parent
    }
  }
  // Reached root without an existing ancestor (rare). Fall back to input;
  // the containment check will reject.
  return absolutePath
}

/**
 * Resolve the real (symlink-followed) path of a subdirectory under the
 * auto-memory directory. Realpaths the auto-mem dir's PARENT (so the auto-mem
 * dir itself may be a symlink), then rejoins the auto-mem basename and the extra
 * segments. Called as resolveTeamSubdir("team", …) to canonicalize a mount dir.
 * Used by the watcher/sync paths for containment checks (checkTeamContainment).
 *
 * NOTE: this realpaths hm() (getAutoMemPath, the auto-mem base — WITHOUT the
 * trailing "/team"), not getTeamMemPath(): the segments argument carries "team".
 * 2.1.88 ancestor: none (new in 183).
 */
// 2.1.183: resolveTeamSubdir = MNr @cli_inner_pretty.js:151106
async function resolveTeamSubdir(...segments: string[]): Promise<string> {
  const autoMemDir = stripTrailingSep(getAutoMemPath())
  const realParent = await realpath(dirname(autoMemDir))
  return join(realParent, basename(autoMemDir), ...segments)
}

/**
 * Containment status of a candidate path against a real team subdirectory.
 * Returns "ok" (the candidate's realpath equals the resolved team subdir),
 * "absent" (ENOENT/ENOTDIR — the dir doesn't exist, so no escape is possible),
 * or "escape" (any mismatch or unexpected error — fail closed).
 * 2.1.88 ancestor: none (new in 183).
 */
// 2.1.183: checkTeamContainment = $Be @cli_inner_pretty.js:151111
export async function checkTeamContainment(
  candidate: string,
  ...segments: string[]
): Promise<'ok' | 'absent' | 'escape'> {
  try {
    const expected = await resolveTeamSubdir(...segments)
    return (await realpath(stripTrailingSep(candidate))) === expected
      ? 'ok'
      : 'escape'
  } catch (e: unknown) {
    const code = getErrnoCode(e)
    if (code === 'ENOENT' || code === 'ENOTDIR') {
      return 'absent'
    }
    return 'escape'
  }
}

/**
 * Check whether a real (symlink-resolved) path is within the real team memory
 * directory. Both sides are realpath'd so the comparison is between canonical
 * filesystem locations.
 *
 * If teamDir does not exist, returns true (skips the check) — a symlink escape
 * requires a pre-existing symlink inside teamDir, which requires teamDir to
 * exist; with no directory the first-pass string-level containment is enough.
 * 2.1.88 ancestor: isRealPathWithinTeamDir (unchanged).
 */
// 2.1.183: isRealPathWithinTeamDir = BQu @cli_inner_pretty.js:151147
async function isRealPathWithinTeamDir(
  realCandidate: string,
): Promise<boolean> {
  let realTeamDir: string
  try {
    // getTeamMemPath() includes a trailing separator; strip it — realpath()
    // rejects trailing separators on some platforms.
    realTeamDir = await realpath(stripTrailingSep(getTeamMemPath()))
  } catch (e: unknown) {
    const code = getErrnoCode(e)
    if (code === 'ENOENT' || code === 'ENOTDIR') {
      // Team dir doesn't exist — symlink escape impossible, skip check.
      return true
    }
    // Unexpected error (EACCES, EIO) — fail closed.
    return false
  }
  if (realCandidate === realTeamDir) {
    return true
  }
  // Prefix-attack protection: require a separator after the prefix so that
  // "/foo/team-evil" doesn't match "/foo/team".
  return realCandidate.startsWith(realTeamDir + sep)
}

/**
 * Check if a resolved absolute path is within the team memory directory. Does
 * NOT resolve symlinks — for write validation use validateTeamMemKey() which
 * includes symlink resolution.
 *
 * DELTA vs the v2.1.88 ancestor: the check is CASE-INSENSITIVE — both sides are
 * NFC-normalized and lowercased before comparison, and the equal case is matched
 * on `resolved + sep === teamDir` (teamDir already carries a trailing sep). The 88
 * ancestor compared `resolve(filePath).startsWith(getTeamMemPath())` verbatim
 * (case-sensitive, single clause). The fold guards macOS/Windows case-insensitive
 * filesystems where "TEAM" and "team" are the same directory.
 * VERSION: this is NOT a v2.1.183 change — the v2.1.156 isTeamMemPath (NFK@144775)
 * is byte-identical: `$ = resolve(H).normalize("NFC").toLowerCase(), q =
 * Jv().normalize("NFC").toLowerCase(); return $ + sep === q || $.startsWith(q)`.
 * So the case-fold is carryover from 156; only the delta-vs-88 framing applies.
 * 2.1.88 ancestor: isTeamMemPath (logic hardened — see DELTA).
 */
// 2.1.183: isTeamMemPath = Bme @cli_inner_pretty.js:151159
export function isTeamMemPath(filePath: string): boolean {
  // SECURITY: resolve() converts to absolute and eliminates `..` segments,
  // preventing path traversal (e.g. "team/../../etc/passwd").
  const resolvedPath = resolve(filePath).normalize('NFC').toLowerCase()
  const teamDir = getTeamMemPath().normalize('NFC').toLowerCase()
  // @151161 teamDir ends with sep; the first clause matches an exact-dir hit,
  // the second matches anything strictly inside it.
  return resolvedPath + sep === teamDir || resolvedPath.startsWith(teamDir)
}

/**
 * Validate a relative path key from the server against the team memory directory.
 * Sanitizes the key, joins with the team dir, resolves symlinks on the deepest
 * existing ancestor, and verifies containment against the real team dir.
 * Returns the resolved absolute path. Throws PathTraversalError on a malicious
 * key (PSR M22186).
 * 2.1.88 ancestor: validateTeamMemKey (unchanged).
 */
// 2.1.183: validateTeamMemKey = __n @cli_inner_pretty.js:151164
export async function validateTeamMemKey(relativeKey: string): Promise<string> {
  sanitizePathKey(relativeKey)
  const teamDir = getTeamMemPath()
  const fullPath = join(teamDir, relativeKey)
  // First pass: normalize `..` segments and check string-level containment.
  const resolvedPath = resolve(fullPath)
  if (!resolvedPath.startsWith(teamDir)) {
    throw new PathTraversalError(
      `Key escapes team memory directory: "${relativeKey}"`,
    )
  }
  // Second pass: resolve symlinks and verify real containment.
  const realPath = await realpathDeepestExisting(resolvedPath)
  if (!(await isRealPathWithinTeamDir(realPath))) {
    throw new PathTraversalError(
      `Key escapes team memory directory via symlink: "${relativeKey}"`,
    )
  }
  return resolvedPath
}

/**
 * Check if a file path is within the team memory directory and team memory is
 * enabled.
 * 2.1.88 ancestor: isTeamMemFile (unchanged).
 */
// 2.1.183: isTeamMemFile = vK @cli_inner_pretty.js:151174
export function isTeamMemFile(filePath: string): boolean {
  return isTeamMemoryEnabled() && isTeamMemPath(filePath)
}

// ---------------------------------------------------------------------------
// Contract-level dependency (defined in the team-memory sync transport layer).
// The runtime team-memory server status reader consulted by isTeamMemServerActive
// (RNr@151121). Carryover plumbing — see team_memory_stores_recall.md §5 and the
// v2.1.156 multistore baseline; declared here only so RNr type-checks in isolation.
// ---------------------------------------------------------------------------
// 2.1.183: getTeamMemServerStatus = zht @cli_inner_pretty.js:3208 (returns the
//   global Ot.teamMemoryServerStatus, set by j8e@3211). Confirmed set-values:
//   "not-available" (j8e@447798), "has-content"/"empty" (j8e@447865/448006).
//   isTeamMemServerActive (RNr@151121) only ever compares against "has-content".
declare function getTeamMemServerStatus():
  | 'not-available'
  | 'has-content'
  | 'empty'
  | string

// ---------------------------------------------------------------------------
// NOTE — removed in 2.1.183 vs the 2.1.88 ancestor:
//   · getTeamMemEntrypoint() — there is no standalone join(hm(),"team","MEMORY.md")
//     in the 183 bundle; the per-store entrypoint is resolved through the
//     multistore mount machinery (team/<mount>/…).
//   · validateTeamMemWritePath() — the absolute-path write validator is gone;
//     only validateTeamMemKey (the server-key validator) survives. No
//     "Path escapes team memory directory: <filePath>" string exists in 183.
// ---------------------------------------------------------------------------
