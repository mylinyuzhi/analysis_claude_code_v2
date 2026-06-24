/**
 * Team Memory Sync Service — CONTRACT-LEVEL reconstruction (v2.1.183)
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ SCOPE OF THIS FILE                                                          │
 * │   This is the ~1256-LOC team/personal memory SYNC TRANSPORT. Per the        │
 * │   reconstruction conventions (_conventions.md "88→183 unit map", row        │
 * │   services/teamMemorySync/index.ts = **CONTRACT-LEVEL**), the deep internal │
 * │   transport (delta computation, conflict/412 loop, byte-batched PUT splits,  │
 * │   tombstone/soft-delete bookkeeping, secret scanning, bulk export inflate)   │
 * │   is **carryover plumbing the v2.1.183 delta docs deliberately do NOT        │
 * │   re-derive**. This file therefore restores only the PUBLIC API SURFACE:     │
 * │     • the store-client interface (MemoryServiceBackend / m_n)                │
 * │     • the multistore object shape (buildMultistore / lAo result)             │
 * │     • the single-store SyncState shape (makeSingleStoreSyncState / nAo)      │
 * │     • the public entrypoints (multistorePush/Pull, pushMemory/pullMemory)    │
 * │     • the telemetry events                                                   │
 * │   Each is anchored to the live bundle. Internal helpers are SUMMARIZED in a  │
 * │   header note (see "Internal transport — summary" below), not reconstructed. │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - store client class     m_n            @150574-150709 (readByPath/read/list/create/update/delete/export)
 *   - backend factory        CNr            @150710-150712 (makeMultistoreBackends)
 *   - backend constants      SQu/EQu/ngi/HQu/vQu @150713-150717
 *   - multistore builder     lAo            @448434-448458 (buildMultistore)
 *   - single SyncState ctor  nAo            @447317-447332 (makeSingleStoreSyncState)
 *   - oauth gate             nGn            @447336-447340 (isMemorySyncAvailable)
 *   - scope label            SLe            @447314-447316
 *   - single-store pull      sAo/GBp        @447764-447773 / @447774… (pullMemory / multistorePull)
 *   - single-store push      iAo            @447877…       (pushMemory)
 *   - multistore sync        pAo/rFp        @448833-448842 / @448843-448930 (multistorePush)
 *   - per-store pull/push    QBp/uAo        @448578… / @448747… (internal — summarized)
 *   - pull/push telemetry    Udt/Gce        @448166-448253
 *   - transport constants    eAo/DWe/MBp/Qmo/eGn/MXa @448257-448263, 448934
 *
 * 2.1.88 ancestor (shape + real names + doc-comments): src/services/teamMemorySync/index.ts
 *   The 88 ancestor is a single-store axios HTTP client (GET/PUT /api/claude_code/team_memory).
 *   In v2.1.183 the transport was rewritten onto the **memory-service** REST backend
 *   (per-entry /memories CRUD via the store client `m_n`) AND generalized from one store to a
 *   set of mounted CLAUDE_MEMORY_STORES driven through a multistore object. So the 88 names
 *   (pushTeamMemory/pullTeamMemory/SyncState) survive as *concepts*, but the obf names and the
 *   wire protocol diverge — the 88 file is the convention template, the 183 bundle is the truth.
 *
 * scaffold: 31_auto_memory/team_memory_stores_recall.md (Delta 5 watcher scope-split + the
 *   "carryover — link, do NOT re-document" note on the multistore transport `lAo`/`m_n`/`pAo`/`sAo`);
 *   v2.1.156 baseline 31_auto_memory/memdir_core.md for the single-store sync lineage.
 *
 * cross-val: re-read the multistore builder lAo@448434, the store client m_n@150574 (readByPath
 *   @150633 + list/read/create/update/delete), the sync runner rFp@448843 (telemetry
 *   tengu_team_mem_multistore_sync@448913 + feature events team_memory_multistore_pull/_push/
 *   _conflict@448914-448918), the single-store pull GBp@447774 + push iAo@447877, and the
 *   per-scope telemetry tengu_team_mem_sync_pull@448187 / _push@448236 + config-invalid
 *   tengu_team_mem_multistore_config_invalid@449216 (emitted in the watcher, listed here for
 *   reference). The watcher scope-split that CALLS this surface lives in ./watcher.ts (uFp@449203).
 *
 * DELTA v2.1.172 (vs 88 ancestor):
 *   - Transport moved from axios HTTP (one `?repo=` endpoint, JSON body of {entries}) to the
 *     memory-service per-entry CRUD backend (`m_n`/MemoryServiceBackend, base path "/memories").
 *   - The single SyncState (88: lastKnownChecksum/serverChecksums/serverMaxEntries) gained
 *     tombstone bookkeeping for soft-delete propagation (tombstonedKeys/tombstonedPriorHashes/
 *     keptDivergentHashes/keptUnreadable) and an `aborted` fail-closed flag — see @447317-447332.
 *   - NEW multistore layer: buildMultistore (lAo) wraps N backends + scope routing (team→team dir,
 *     user→private auto-mem dir) into one object the watcher drives via multistorePush.
 */

// Internal transport — summary (NOT reconstructed; carryover the delta docs do not re-derive):
//   • per-store pull  QBp @448578  — list store, write changed entries to disk, reap server-deleted
//                                    keys, bulk-export "inflate" fast path (ZBp), mount-dir canonicity
//                                    fail-closed (UXa); returns {success,entriesListed,filesWritten,filesDeleted,error?}.
//   • per-store push  uAo @448747  — scan local dir ($Xa: walk + secret-skip EVe + oversize-skip MXa),
//                                    diff against remoteHashes, create/update/delete via the backend,
//                                    track conflicts + soft-deletes; ro mounts no-op; returns
//                                    {success,filesWritten,filesDeleted,conflicts,secretsSkipped,error?,permanent?}.
//   • single pull     GBp @447774  — OAuth gate, root-canonicity abort, ETag/notModified, fetch+write,
//                                    refresh serverChecksums, reap; logs via Udt (tengu_team_mem_sync_pull).
//   • single push     iAo @447877  — delta upload + 412 conflict loop (eGn=2 retries), byte-batched
//                                    PUTs (MBp=200000), structured-413 max_entries learning, soft-delete
//                                    of tombstoned keys; logs via Gce (tengu_team_mem_sync_push).
//   • secret scanning  EVe (gitleaks-pattern scan) — files with secrets are skipped, never uploaded.
//   See team_memory_stores_recall.md §5 (carryover note) and the v2.1.156 baseline memdir_core.md.

import { createHash } from 'crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises'
import { join, relative, sep } from 'path'
import {
  CLAUDE_AI_INFERENCE_SCOPE,
  CLAUDE_AI_PROFILE_SCOPE,
} from '../../constants/oauth.js'
// 2.1.183: getAutoMemPath = hm @147746 (memoized auto-mem base dir) lives in
//          memdir/paths.ts; getTeamMemPath = uH @151103 lives in memdir/teamMemPaths.ts.
import { getAutoMemPath } from '../../memdir/paths.js'
import { getTeamMemPath } from '../../memdir/teamMemPaths.js'
// type-only import (erased at runtime, so it does NOT close a runtime cycle with
// teamMemPaths.ts's value-import of MemoryServiceBackend below). The parsed-store
// shape's SSOT is teamMemPaths.ts (MemoryStore).
import type { MemoryStore } from '../../memdir/teamMemPaths.js'
import { checkAndRefreshOAuthTokenIfNeeded } from '../../utils/auth.js'
import { logForDebugging } from '../../utils/debug.js'
// 2.1.183: the OAuth gate (nGn @447336) is a chain of internal predicates —
//   isFirstPartyBaseUrl (Pu @95241), isOAuthEnabledWithInferenceScope (Co @135818),
//   hasOAuthAccessToken (iH @135826), oauthScopesInclude (bJe @135829). Declared below.
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent,
} from '../analytics/index.js'
import {
  type TeamMemorySyncPushResult,
  type TeamMemorySyncFetchResult,
} from './types.js'

// ─── Constants ───────────────────────────────────────────────
// 2.1.183: backend request timeout SQu=30000 @150713
const MEMORY_SERVICE_TIMEOUT_MS = 30_000
// 2.1.183: transport-layer per-entry size cap DWe=250000 @448258 (server default)
const MAX_FILE_SIZE_BYTES = 250_000
// 2.1.183: multistore local-walk per-file cap MXa=102400 @448934 (skip oversized on the disk side)
const MULTISTORE_MAX_FILE_SIZE_BYTES = 102_400
// 2.1.183: gateway body-size cap for batched PUTs MBp=200000 @448259
const MAX_PUT_BODY_BYTES = 200_000
// 2.1.183: fetch retry budget Qmo=3 @448260
const MAX_RETRIES = 3
// 2.1.183: 412-conflict retry budget eGn=2 @448261
const MAX_CONFLICT_RETRIES = 2
// 2.1.183: store-client list pagination — page size EQu=100 @150714, page-walk cap ngi=50 @150715
const LIST_PAGE_SIZE = 100
const LIST_PAGE_LIMIT = 50
// 2.1.183: memory-service path roots HQu="/memories" @150716, vQu="/memories/export" @150717
const MEMORIES_BASE = '/memories'
const MEMORIES_EXPORT_BASE = '/memories/export'

// ─── Store-client interface (MemoryServiceBackend / m_n @150574) ──────────────

/** A single memory entry as returned by the memory-service list endpoint. */
export type MemoryEntryRef = {
  id: string // `mem_<base62>`
  /** Canonical leading-slash path, e.g. "/notes/foo.md". */
  path: string
  sha256: string // server content_sha256
  sizeBytes?: number
}

/** Body of one entry read by id/path. */
export type MemoryEntryContent = {
  content: string
  sha256: string
}

/**
 * REST client for ONE mounted memory store, backed by the memory-service
 * "/memories" CRUD surface. Replaces the v2.1.88 axios single-endpoint client.
 *
 * - `mode` "ro" mounts reject every mutating call (assertWritable throws).
 * - `auth` is "session-jwt" when the session-JWT path is active, else default.
 * - `validateStatus: () => !0` — the methods classify every HTTP status by hand
 *   (404 = store not provisioned → empty; 409 = conflict → typed error; ≥400 = throw).
 *
 * 2.1.183: MemoryServiceBackend = m_n @cli_inner_pretty.js:150574-150709
 */
export declare class MemoryServiceBackend {
  readonly mode: 'rw' | 'ro'
  /** Mount label (used in error messages + telemetry). */
  readonly label: string

  // 2.1.183: constructor reads {mode, mount, path}; listBase=path+"/memories",
  //          exportBase=path+"/memories/export" @150580-150585
  constructor(store: MemoryStore)

  /**
   * List entries (optionally filtered by `pathPrefix`), paging until next_page
   * is exhausted or the LIST_PAGE_LIMIT (ngi=50) page-walk cap trips.
   * 404 on the first page ⇒ store not provisioned ⇒ returns [] (treated as empty).
   * 2.1.183: m_n.list @150593-150632
   */
  list(pathPrefix?: string): Promise<MemoryEntryRef[]>

  /**
   * Resolve a relative path to its memory id (via list+find) and read its body.
   * Returns null when no entry matches the path.
   * 2.1.183: m_n.readByPath @150633-150638
   */
  readByPath(path: string): Promise<MemoryEntryContent | null>

  /** Read one entry by memory id. 404 ⇒ throws not-found. 2.1.183: m_n.read @150651-150660 */
  read(id: string): Promise<MemoryEntryContent>

  /**
   * Create an entry. 409 ⇒ typed conflict (carries conflicting_memory_id when the
   * path already exists). ro mount ⇒ assertWritable throws.
   * 2.1.183: m_n.create @150661-150680
   */
  create(path: string, content: string): Promise<{ id: string; sha256: string }>

  /**
   * Update an entry by id; `expectedSha256` (or null) becomes the optimistic
   * content_sha256 precondition. 409 ⇒ conflict. ro mount ⇒ throws.
   * 2.1.183: m_n.update @150681-150694
   */
  update(
    id: string,
    content: string,
    expectedSha256: string | null,
  ): Promise<{ id: string; sha256: string }>

  /**
   * Delete an entry by id with an optional expected_content_sha256 guard.
   * 2.1.183: m_n.delete @150695-150708
   */
  delete(id: string, expectedSha256: string | null): Promise<void>

  /**
   * Stream the whole store's entries (bulk export fast path for the initial pull).
   * 2.1.183: m_n.exportAll @150639-150650
   */
  exportAll(): Promise<{ stream: NodeJS.ReadableStream; destroy: () => void }>
}

/**
 * Construct one backend per parsed store (preserving order).
 * 2.1.183: makeMultistoreBackends = CNr @cli_inner_pretty.js:150710-150712
 * 2.1.88 ancestor: n/a (88 had a single implicit endpoint, not per-store backends)
 */
export function makeMultistoreBackends(
  stores: MemoryStore[],
): MemoryServiceBackend[] {
  return stores.map(store => new MemoryServiceBackend(store))
}

// ─── Single-store SyncState (nAo @447317) ────────────────────────────────────

/**
 * Mutable per-scope sync state, created once per session (per lane) and threaded
 * through every single-store sync call.
 *
 * DELTA v2.1.172: vs the 88 ancestor's {lastKnownChecksum, serverChecksums,
 *   serverMaxEntries}, v2.1.183 added tombstone bookkeeping for soft-delete
 *   propagation and an `aborted` fail-closed flag — see @447317-447332.
 *
 * 2.1.183: SyncState shape = nAo @cli_inner_pretty.js:447317-447332
 * 2.1.88 ancestor: SyncState (src/services/teamMemorySync/index.ts:100-119)
 */
export type SyncState = {
  scope: 'team' | 'user'
  repoSlug: string
  /** Last known server checksum (ETag) for conditional GETs. */
  lastKnownChecksum: string | null
  /** Per-key `sha256:<hex>` of what we believe the server holds (delta basis). */
  serverChecksums: Map<string, string>
  /** Server-enforced max_entries learned from a structured 413; null until observed. */
  serverMaxEntries: number | null
  /** Set once the first successful pull has established a sync basis. */
  pulled: boolean
  // ── DELTA v2.1.172: tombstone / divergence bookkeeping (soft-delete propagation) ──
  /** Keys deleted locally that must be soft-deleted server-side (not just dropped). */
  tombstonedKeys: Set<string>
  /** Hash a tombstoned key had when we last saw the server's copy (conflict guard). */
  tombstonedPriorHashes: Map<string, string>
  /** Keys whose local content diverged and was intentionally kept (not overwritten). */
  keptDivergentHashes: Map<string, string>
  /** Keys whose local file was unreadable and intentionally left untouched. */
  keptUnreadable: Set<string>
  /** In-flight pull promise — coalesces concurrent pull requests (see pullMemory). */
  pullPromise: Promise<TeamMemorySyncFetchResult> | null
  /** Fail-closed flag: set when the memory root escapes its canonical location. */
  aborted: boolean
}

/**
 * Create a fresh single-store SyncState for a scope+repo.
 * 2.1.183: makeSingleStoreSyncState = nAo @cli_inner_pretty.js:447317-447332
 * 2.1.88 ancestor: createSyncState (src/services/teamMemorySync/index.ts:121-127)
 */
export function makeSingleStoreSyncState(
  scope: 'team' | 'user',
  repoSlug: string,
): SyncState {
  return {
    scope,
    repoSlug,
    lastKnownChecksum: null,
    serverChecksums: new Map(),
    serverMaxEntries: null,
    pulled: false,
    tombstonedKeys: new Set(),
    tombstonedPriorHashes: new Map(),
    keptDivergentHashes: new Map(),
    keptUnreadable: new Set(),
    pullPromise: null,
    aborted: false,
  }
}

/**
 * Compute `sha256:<hex>` over the UTF-8 bytes of `content`. Format matches the
 * memory-service entry checksums so local-vs-server compares by string equality.
 * 2.1.183: hashContent = tGn @cli_inner_pretty.js:447333-447334
 * 2.1.88 ancestor: hashContent (src/services/teamMemorySync/index.ts:134-136)
 */
export function hashContent(content: string): string {
  return 'sha256:' + createHash('sha256').update(content, 'utf8').digest('hex')
}

// ─── Multistore object (buildMultistore / lAo @448434) ───────────────────────

/** One mounted store's runtime sync slot inside a MultistoreState. */
export type MultistoreEntry = {
  backend: MemoryServiceBackend
  mountName: string
  scope: 'team' | 'user'
  /**
   * Local directory this store mirrors. user-scope ⇒ the private auto-mem dir
   * (getAutoMemPath / hm); team-scope ⇒ `<teamMemPath>/<mount>/` (NFC-normalized).
   */
  mountDir: string
  /**
   * For user-scope stores, the key predicate that excludes the team/cowork
   * subtree from the personal lane (so private + team don't double-sync). null
   * for team-scope.
   */
  excludeKey: ((relPath: string) => boolean) | null
  /** Per-key server hash snapshot used to diff the local dir on push. */
  remoteHashes: Map<string, MemoryEntryRef>
  /** Lane-creation timestamp — anchors the "written since startup" mtime heuristic. */
  createdAtMs: number
  /** mtimes of files this lane wrote on pull (to distinguish our writes from user edits). */
  pullWrittenMtimes: Map<string, number>
  /** True once this store has completed at least one pull. */
  pulled: boolean
  /** Non-null reason ⇒ this store is permanently suppressed for the session. */
  suppressedReason: string | null
}

/**
 * The per-lane multistore object the watcher drives. Wraps N backends + their
 * scope-routed mount dirs into one syncable unit (one per scope lane: team / user).
 *
 * 2.1.183: MultistoreState shape = lAo result @cli_inner_pretty.js:448438-448457
 */
export type MultistoreState = {
  stores: MultistoreEntry[]
  /** In-flight sync promise — coalesces concurrent multistorePush calls. */
  inFlight: Promise<MultistoreSyncResult> | null
}

/** Aggregate result of one multistore sync pass (pull map + push map by mount). */
export type MultistoreSyncResult = {
  pulls: Record<
    string,
    {
      success: boolean
      entriesListed: number
      filesWritten: number
      filesDeleted: number
      error?: string
      permanent?: string
    }
  >
  pushes: Record<
    string,
    {
      success: boolean
      filesWritten: number
      filesDeleted: number
      conflicts: number
      secretsSkipped: number
      error?: string
      permanent?: string
    }
  >
}

/**
 * Build a MultistoreState from parallel arrays of backends and store descriptors.
 * Routes each store's local mountDir by scope (user → private auto-mem dir,
 * team → `<teamDir>/<mount>/`) and seeds empty per-store sync bookkeeping.
 * Throws on a length mismatch between the two arrays.
 *
 * 2.1.183: buildMultistore = lAo @cli_inner_pretty.js:448434-448458
 * 2.1.88 ancestor: n/a (multistore layer is net-new in v2.1.172)
 * scaffold: team_memory_stores_recall.md §5 (watcher splits stores into team rX / user $W lanes)
 */
export function buildMultistore(
  backends: MemoryServiceBackend[],
  storeDescriptors: Array<
    string | { mount: string; scope: 'team' | 'user' }
  >,
): MultistoreState {
  if (backends.length !== storeDescriptors.length) {
    throw new Error('createMultiStoreState: length mismatch') // @448435 verbatim
  }
  const teamDir = getTeamMemPath() // uH @448436
  const privateDir = getAutoMemPath() // hm @448437
  return {
    stores: backends.map((backend, i) => {
      const raw = storeDescriptors[i]!
      const desc =
        typeof raw === 'string' ? { mount: raw, scope: 'team' as const } : raw
      const isUserScope = desc.scope === 'user' // @448442
      return {
        backend,
        mountName: desc.mount,
        scope: desc.scope,
        // @448447: user → private dir; team → "<teamDir>/<mount>/" NFC-normalized
        mountDir: isUserScope
          ? privateDir
          : (join(teamDir, desc.mount) + sep).normalize('NFC'),
        // @448448 (use-site): user lane excludes the team subtree (Bge predicate,
        //          defined @289772); team lane null.
        excludeKey: isUserScope ? excludePrivateNonPersonal : null,
        remoteHashes: new Map(),
        createdAtMs: Date.now(),
        pullWrittenMtimes: new Map(),
        pulled: false,
        suppressedReason: null,
      }
    }),
    inFlight: null,
  }
}

// 2.1.183: excludePrivateNonPersonal = Bge @289772 (user-lane key exclusion predicate;
//   the use-site inside lAo is @448448). Body (verified @289772): split relPath on "/",
//   exclude when there are no segments, any segment starts with ".", or the first segment
//   (lowercased via I0n) is in the reserved-prefix list pYr — i.e. excludes the team/cowork
//   subtree from the personal lane. Carryover internal; summarized.
declare const excludePrivateNonPersonal: (relPath: string) => boolean

// ─── Public API ──────────────────────────────────────────────

// OAuth-gate predicates the 183 nGn chains over (internal; declared for the contract).
// 2.1.183: isFirstPartyBaseUrl = Pu @95241 (_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL || ANTHROPIC_BASE_URL check)
declare function isFirstPartyBaseUrl(): boolean
// 2.1.183: isOAuthEnabledWithInferenceScope = Co @135818 (isOAuthEnabled() && scopes.includes(INFERENCE))
declare function isOAuthEnabledWithInferenceScope(): boolean
// 2.1.183: hasOAuthAccessToken = iH @135826 (cached tokens' accessToken != null)
declare function hasOAuthAccessToken(): boolean
// 2.1.183: oauthScopesInclude = bJe @135829 (cached tokens' scopes array includes the given scope)
declare function oauthScopesInclude(scope: string): boolean

/**
 * True iff memory sync is available — first-party Anthropic base URL + OAuth
 * enabled with the inference scope + an access token carrying both the
 * inference and profile scopes.
 *
 * DELTA v2.1.172: the 183 gate is a chain of internal predicates, NOT the 88
 *   ancestor's `getAPIProvider()/isFirstPartyAnthropicBaseUrl()` pair:
 *     nGn() = isFirstPartyBaseUrl()           // Pu @447337
 *           && isOAuthEnabledWithInferenceScope() // Co @447338
 *           && hasOAuthAccessToken()          // iH @447339 (accessToken != null)
 *           && oauthScopesInclude(INFERENCE)  // bJe(TU)
 *           && oauthScopesInclude(PROFILE)    // bJe(KSe)
 *   where Pu = `_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL || isFirstPartyBaseUrl(ANTHROPIC_BASE_URL)`
 *   and Co = `isOAuthEnabled() && scopes.includes(INFERENCE)`. iH/bJe read the
 *   cached OAuth tokens directly (mi()), not via getClaudeAIOAuthTokens.
 *
 * 2.1.183: isMemorySyncAvailable = nGn @cli_inner_pretty.js:447336-447340
 * 2.1.88 ancestor: isUsingOAuth / isTeamMemorySyncAvailable (src/.../index.ts:151-161, 762-764)
 */
export function isMemorySyncAvailable(): boolean {
  if (!isFirstPartyBaseUrl()) return false // Pu @447337
  if (!isOAuthEnabledWithInferenceScope()) return false // Co @447338
  // iH @447339: access token present; bJe(TU)/bJe(KSe): scopes carry both.
  return (
    hasOAuthAccessToken() &&
    oauthScopesInclude(CLAUDE_AI_INFERENCE_SCOPE) && // bJe(TU)
    oauthScopesInclude(CLAUDE_AI_PROFILE_SCOPE) // bJe(KSe)
  )
}

/** Scope → telemetry/log label. 2.1.183: SLe @cli_inner_pretty.js:447314-447316 */
function scopeLabel(scope: 'team' | 'user'): string {
  return scope === 'team' ? 'team-memory-sync' : 'personal-memory-sync'
}

/**
 * Pull one store (one scope lane) from the memory-service to the local dir.
 * Coalesces concurrent calls via state.pullPromise. OAuth-gated, aborts
 * fail-closed if the memory root escapes its canonical location, honors the
 * ETag (notModified short-circuit), refreshes serverChecksums, reaps
 * server-deleted keys. Emits tengu_team_mem_sync_pull (team scope only).
 *
 * 2.1.183: pullMemory / multistorePull = sAo @cli_inner_pretty.js:447764-447773
 *          (delegates the body to GBp @447774; telemetry via Udt @448166)
 * 2.1.88 ancestor: pullTeamMemory (src/services/teamMemorySync/index.ts:770-867)
 *
 * NOTE: the watcher imports this both as `pullMemory` and `multistorePull`
 *       (single-store lane pull) — they are the same entrypoint, aliased below.
 */
export declare function pullMemory(
  state: SyncState,
  options?: { skipEtagCache?: boolean },
): Promise<{
  success: boolean
  filesWritten: number
  filesReaped: number
  entryCount: number
  notModified?: boolean
  errorType?: string
  httpStatus?: number
  error?: string
}>

// Watcher-facing alias: per-lane pull is the same single-store pull (sAo).
export { pullMemory as multistorePull }

/**
 * Push one store (one scope lane) from the local dir to the memory-service.
 * Delta upload + 412-conflict loop (MAX_CONFLICT_RETRIES), byte-batched PUTs
 * (MAX_PUT_BODY_BYTES), structured-413 max_entries learning, and soft-delete of
 * tombstoned keys. user-scope defers until an initial pull basis exists. ro mounts
 * are skipped. Emits tengu_team_mem_sync_push (team scope only) via Gce @448200.
 *
 * 2.1.183: pushMemory = iAo @cli_inner_pretty.js:447877…
 * 2.1.88 ancestor: pushTeamMemory (src/services/teamMemorySync/index.ts:889-1146)
 */
export declare function pushMemory(
  state: SyncState,
): Promise<TeamMemorySyncPushResult>

/**
 * Sync ONE lane's whole multistore: pull every store, then push every store, in
 * two parallel passes. Fails individual stores closed on a canonicity escape;
 * suppresses a store permanently when a per-store op reports a `permanent` reason.
 * Coalesces concurrent calls via state.inFlight.
 *
 * Telemetry per pass (rFp @448843-448929):
 *   - tengu_team_mem_multistore_sync  @448913 — aggregate counts + trigger
 *   - team_memory_multistore_pull  ok/sad @448914-448915 (feature event)
 *   - team_memory_multistore_push  ok/sad @448916-448917 (feature event)
 *   - team_memory_multistore_conflict ok  @448918 (when conflicts > 0)
 *
 * `trigger` is one of "watch" | "startup" | "periodic" (default "watch" @448833).
 *   Confirmed call sites: pAo(r, "startup") @449241, YXa(...,"periodic") @449121,
 *   default "watch" elsewhere — there is NO "manual" trigger in the 183 bundle.
 *
 * 2.1.183: multistorePush = pAo @cli_inner_pretty.js:448833-448842
 *          (delegates the body to rFp @448843; per-store pull QBp @448578, push uAo @448747)
 * 2.1.88 ancestor: syncTeamMemory (src/services/teamMemorySync/index.ts:1153-1191) — single-store
 */
export declare function multistorePush(
  state: MultistoreState,
  trigger?: 'watch' | 'startup' | 'periodic',
): Promise<MultistoreSyncResult>

// ─── Telemetry events (reference; emitted by the helpers above) ───────────────
//
// 2.1.183 events confirmed in the bundle:
//   tengu_team_mem_multistore_sync           @448913  (Udt-sibling aggregate; in rFp)
//   tengu_team_mem_multistore_config_invalid @449216  (emitted in watcher.ts uFp on parse failure)
//   tengu_team_mem_sync_pull                 @448187  (single-store pull, team scope only)
//   tengu_team_mem_sync_push                 @448236  (single-store push, team scope only)
//   tengu_team_mem_sync_started              @449259  (watcher; multistore team lane started)
//   tengu_personal_mem_sync_started          @449262  (watcher; multistore user lane started)
// Feature ok/sad events: team_memory_multistore_pull / _push / _conflict @448914-448918,
//   team_memory{,_multistore}_bulk_inflate (per-store inflate fast path).
//
// The two helpers that wrap these are kept here as the canonical reference for the
// event payload shapes (bodies summarized — they are pure logEvent fan-out):
//   2.1.183: logPull = Udt @448166-448199 → tengu_team_mem_sync_pull
//   2.1.183: logPush = Gce @448200-448253 → tengu_team_mem_sync_push
declare function logPull(
  scope: 'team' | 'user',
  startTime: number,
  outcome: {
    success: boolean
    filesWritten?: number
    filesReaped?: number
    notModified?: boolean
    errorType?: string
    status?: number
    serverMessage?: string
    serverErrorCode?: string
    serverErrorType?: string
  },
): void

declare function logPush(
  scope: 'team' | 'user',
  startTime: number,
  outcome: TeamMemorySyncPushResult & { errorType?: string },
): void

// Re-export type for watcher coherence (watcher imports TeamMemorySyncPushResult from ./types.js).
export type { TeamMemorySyncPushResult }

// Suppress unused-import lint for reference-only symbols that anchor the contract.
// (These mirror the 88 ancestor's import structure; the deep bodies that consume
//  them are the summarized internal transport.)
void checkAndRefreshOAuthTokenIfNeeded
void logForDebugging
void logEvent
void mkdir
void readdir
void readFile
void stat
void writeFile
void relative
void MEMORY_SERVICE_TIMEOUT_MS
void MAX_FILE_SIZE_BYTES
void MULTISTORE_MAX_FILE_SIZE_BYTES
void MAX_PUT_BODY_BYTES
void MAX_RETRIES
void MAX_CONFLICT_RETRIES
void LIST_PAGE_SIZE
void LIST_PAGE_LIMIT
void MEMORIES_BASE
void MEMORIES_EXPORT_BASE
void scopeLabel
type _ReferencedTypes = AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
